package creation.updater;

import com.google.gson.*;
import java.io.*;
import java.math.BigInteger;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.*;
import java.util.*;
import java.util.function.LongConsumer;
import java.util.function.Consumer;
import java.util.zip.*;

/** Shared by the client and the separate installer. No Minecraft dependencies. */
public final class UpdateCore {
    public static final Gson JSON = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();
    public static final String REPO = "RainRaf-UwU/Path-Of-Creation";
    public static final String ASSET = "path-of-creation-update.zip";
    public static final String PACK = "config/poc-updater/pack.json";
    public static final String BASELINE = "config/poc-updater/baseline.json";
    public static final String MANIFEST = "poc-update.json";
    public static final String DELTA = "poc-delta.json";
    public static final String FEED = "https://raw.githubusercontent.com/" + REPO + "/main/config/poc-updater/latest.json";
    public static final long MAX_BYTES = 8L * 1024 * 1024 * 1024;

    public record Pack(String version, String minecraft, String neoforge, String changelog) {}
    public record FileInfo(String sha256, long size) {}
    public record Manifest(int schema, String version, String minecraft, String neoforge,
                           Map<String, FileInfo> files) {}
    public record Delta(int schema, Manifest base, List<String> files, List<String> removed) {}
    public record UpdatePackage(Manifest manifest, Delta delta) {
        public Set<String> payload() { return delta == null ? manifest.files().keySet() : new LinkedHashSet<>(delta.files()); }
    }
    public record DeltaAsset(String from, String download, String digest, String checksum, long size) {}
    public record Release(String version, String notes, String page, String download,
                          String digest, String checksum, long size, List<DeltaAsset> deltas) {
        public Release(String version, String notes, String page, String download, String digest, String checksum, long size) {
            this(version, notes, page, download, digest, checksum, size, List.of());
        }
    }
    @FunctionalInterface interface Downloader {
        String download(Release release, Path zip, LongConsumer progress) throws IOException;
    }
    public record Job(long parentPid, String version, String sha256, String minecraft, String neoforge) {}
    public record Status(boolean success, String message) {}
    public record State(Set<String> seenVersions) {}
    public enum Popup { UPDATE, CHANGELOG, NONE }

    public static Popup popup(String current, Release latest, Set<String> seen) {
        if (latest != null && compare(latest.version(), current) > 0) return Popup.UPDATE;
        return seen.contains(version(current)) ? Popup.NONE : Popup.CHANGELOG;
    }

    public static <T> T read(Path path, Class<T> type) throws IOException {
        if (Files.size(path) > 8 * 1024 * 1024) throw new IOException("JSON file too large");
        try (Reader in = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
            T result = JSON.fromJson(in, type);
            if (result == null) throw new IOException("Empty JSON: " + path.getFileName());
            return result;
        } catch (JsonParseException e) { throw new IOException("Invalid JSON: " + path.getFileName(), e); }
    }

    public static void write(Path path, Object value) throws IOException {
        Files.createDirectories(path.getParent());
        Path temp = path.resolveSibling(path.getFileName() + ".tmp");
        Files.writeString(temp, JSON.toJson(value), StandardCharsets.UTF_8);
        move(temp, path);
    }

    public static void move(Path source, Path target) throws IOException {
        try { Files.move(source, target, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE); }
        catch (AtomicMoveNotSupportedException e) { Files.move(source, target, StandardCopyOption.REPLACE_EXISTING); }
    }

    public static String version(String value) {
        if (value == null || !value.matches("[vV]?\\d+(?:\\.\\d+){1,3}"))
            throw new IllegalArgumentException("版本号必须为 v0.0.5 这样的数字版本");
        return value.replaceFirst("^[vV]", "");
    }

    public static int compare(String a, String b) {
        String[] aa = version(a).split("\\."), bb = version(b).split("\\.");
        for (int i = 0; i < Math.max(aa.length, bb.length); i++) {
            int c = new BigInteger(i < aa.length ? aa[i] : "0").compareTo(new BigInteger(i < bb.length ? bb[i] : "0"));
            if (c != 0) return c;
        }
        return 0;
    }

    public static Release latest() throws IOException {
        // Static publication feed has no anonymous REST API quota. API is a fallback.
        try {
            String feed = fetch(FEED, 2 * 1024 * 1024, true);
            if (feed != null) {
                Release published = JSON.fromJson(feed, Release.class);
                if (published == null || published.notes() == null || published.page() == null
                    || !published.page().startsWith("https://github.com/" + REPO + "/releases/")
                    || published.digest() == null || !published.digest().matches("sha256:[a-fA-F0-9]{64}")
                    || published.size() <= 0 || published.size() > MAX_BYTES) throw new IOException("Invalid publication feed");
                releaseAssetUrl(published.download());
                releaseAssetUrl(published.checksum());
                version(published.version());
                validateDeltaAssets(published);
                return published;
            }
        } catch (IOException | JsonParseException | IllegalArgumentException | NullPointerException ignored) {
            // Unavailable/invalid static feed must not prevent the standard GitHub check.
        }
        String body = fetch("https://api.github.com/repos/" + REPO + "/releases/latest", 2 * 1024 * 1024, true);
        if (body == null) return null; // No published stable release yet.
        try {
            JsonObject data = JsonParser.parseString(body).getAsJsonObject();
            if (data.get("draft").getAsBoolean() || data.get("prerelease").getAsBoolean()) return null;
            String ver = version(data.get("tag_name").getAsString());
            String page = string(data, "html_url");
            if (!page.startsWith("https://github.com/" + REPO + "/releases/")) throw new IOException("Invalid release URL");
            String url = "", digest = "", checksum = "";
            long size = 0;
            List<DeltaAsset> deltas = new ArrayList<>();
            for (JsonElement element : data.getAsJsonArray("assets")) {
                JsonObject asset = element.getAsJsonObject();
                if (ASSET.equals(string(asset, "name"))) {
                    url = string(asset, "browser_download_url");
                    digest = string(asset, "digest");
                    size = asset.get("size").getAsLong();
                } else if ((ASSET + ".sha256").equals(string(asset, "name"))) {
                    checksum = string(asset, "browser_download_url");
                } else if (string(asset, "name").matches("path-of-creation-delta-from-v\\d+(?:\\.\\d+){1,3}\\.zip")) {
                    String name = string(asset, "name");
                    String from = name.substring("path-of-creation-delta-from-v".length(), name.length() - 4);
                    String deltaUrl = string(asset, "browser_download_url");
                    deltas.add(new DeltaAsset(from, deltaUrl, string(asset, "digest"), deltaUrl + ".sha256", asset.get("size").getAsLong()));
                }
            }
            if (!url.isEmpty()) releaseAssetUrl(url);
            if (!checksum.isEmpty()) releaseAssetUrl(checksum);
            Release release = new Release(ver, string(data, "body"), page, url, digest, checksum, size, deltas);
            validateDeltaAssets(release);
            return release;
        } catch (IllegalArgumentException | NullPointerException e) { throw new IOException("Invalid GitHub release", e); }
    }

    private static String string(JsonObject obj, String key) {
        return obj.has(key) && !obj.get(key).isJsonNull() ? obj.get(key).getAsString() : "";
    }

    public static void releaseAssetUrl(String url) throws IOException {
        if (url == null || !url.startsWith("https://github.com/" + REPO + "/releases/download/"))
            throw new IOException("更新文件必须来自本整合包的 GitHub Release");
    }

    static void validateDeltaAssets(Release release) throws IOException {
        if (release.deltas() == null) return; // Old feeds have no optional delta field.
        if (release.deltas().size() > 16) throw new IOException("增量包数量异常");
        Set<String> versions = new HashSet<>();
        for (DeltaAsset asset : release.deltas()) {
            if (asset == null || compare(asset.from(), release.version()) >= 0 || !versions.add(version(asset.from()))
                    || asset.size() <= 0 || asset.size() > MAX_BYTES || asset.digest() == null
                    || !asset.digest().isEmpty() && !asset.digest().matches("sha256:[a-fA-F0-9]{64}"))
                throw new IOException("增量包下载信息无效");
            releaseAssetUrl(asset.download());
            releaseAssetUrl(asset.checksum());
            // Every optional patch must belong to the same immutable release directory.
            String prefix = release.download().substring(0, release.download().lastIndexOf('/') + 1);
            if (!asset.download().startsWith(prefix) || !asset.checksum().equals(asset.download() + ".sha256"))
                throw new IOException("增量包与发布版本不一致");
        }
    }

    private static HttpURLConnection connection(String url) throws IOException {
        for (int i = 0; i < 6; i++) {
            URI uri = URI.create(url);
            String host = uri.getHost();
            if (!"https".equals(uri.getScheme()) || uri.getUserInfo() != null || (uri.getPort() != -1 && uri.getPort() != 443)
                || !Set.of("api.github.com", "github.com", "raw.githubusercontent.com", "release-assets.githubusercontent.com", "objects.githubusercontent.com").contains(host))
                throw new IOException("Invalid download host");
            HttpURLConnection c = (HttpURLConnection) uri.toURL().openConnection();
            c.setConnectTimeout(10000);
            c.setReadTimeout(30000);
            c.setInstanceFollowRedirects(false);
            c.setRequestProperty("User-Agent", "Path-of-Creation-Updater/1.0");
            c.setRequestProperty("Accept", "application/vnd.github+json");
            int code = c.getResponseCode();
            if (code == 301 || code == 302 || code == 303 || code == 307 || code == 308) {
                String next = c.getHeaderField("Location");
                c.disconnect();
                if (next == null) throw new IOException("Missing redirect URL");
                url = uri.resolve(next).toString();
            } else return c;
        }
        throw new IOException("Too many redirects");
    }

    private static String fetch(String url, int limit, boolean allow404) throws IOException {
        HttpURLConnection c = connection(url);
        try {
            if (allow404 && c.getResponseCode() == 404) return null;
            if (c.getResponseCode() != 200) throw new IOException("GitHub HTTP " + c.getResponseCode());
            try (InputStream in = c.getInputStream()) {
                byte[] bytes = in.readNBytes(limit + 1);
                if (bytes.length > limit) throw new IOException("Response too large");
                return new String(bytes, StandardCharsets.UTF_8);
            }
        } finally { c.disconnect(); }
    }

    public static String download(Release release, Path zip, LongConsumer progress) throws IOException {
        releaseAssetUrl(release.download());
        if (release.size() <= 0 || release.size() > MAX_BYTES) throw new IOException("更新包大小无效");
        String hash;
        if (release.digest() != null && release.digest().matches("sha256:[a-fA-F0-9]{64}")) hash = release.digest().substring(7);
        else {
            if (release.checksum().isEmpty()) throw new IOException("此 Release 缺少 SHA-256 校验文件");
            hash = fetch(release.checksum(), 512, false).strip().split("\\s+")[0];
        }
        if (!hash.matches("[a-fA-F0-9]{64}")) throw new IOException("Invalid SHA-256");
        Files.createDirectories(zip.getParent());
        Path part = zip.resolveSibling(zip.getFileName() + ".part");
        HttpURLConnection c = connection(release.download());
        try {
            if (c.getResponseCode() != 200) throw new IOException("Download HTTP " + c.getResponseCode());
            try (InputStream in = c.getInputStream(); OutputStream out = Files.newOutputStream(part)) {
                byte[] buffer = new byte[128 * 1024];
                long total = 0;
                for (int n; (n = in.read(buffer)) != -1;) {
                    total += n;
                    if (total > release.size()) throw new IOException("下载文件大于发布声明");
                    out.write(buffer, 0, n);
                    progress.accept(total);
                }
                if (total != release.size()) throw new IOException("下载不完整，请重试");
            }
            if (!sha256(part).equalsIgnoreCase(hash)) throw new IOException("更新包校验失败，请重试");
            move(part, zip);
            return hash.toLowerCase(Locale.ROOT);
        } finally { c.disconnect(); Files.deleteIfExists(part); }
    }

    public static String sha256(Path file) throws IOException {
        MessageDigest digest;
        try { digest = MessageDigest.getInstance("SHA-256"); }
        catch (NoSuchAlgorithmException e) { throw new AssertionError(e); }
        try (InputStream in = Files.newInputStream(file)) {
            byte[] buffer = new byte[128 * 1024];
            for (int n; (n = in.read(buffer)) != -1;) digest.update(buffer, 0, n);
        }
        return HexFormat.of().formatHex(digest.digest());
    }

    public static Manifest ownership(Path root) throws IOException {
        Path installed = root.resolve("local/poc-updater/installed.json");
        Path path = Files.exists(installed) ? installed : root.resolve(BASELINE);
        if (!Files.isRegularFile(path)) throw new IOException("此客户端缺少初始文件清单，请先安装含自动更新功能的完整版本");
        Manifest old = read(path, Manifest.class);
        validate(old);
        return old;
    }

    static Release selectDownload(Path root, Release target) throws IOException {
        validateDeltaAssets(target);
        if (target.deltas() == null || target.deltas().isEmpty()) return target;
        Manifest old = ownership(root);
        DeltaAsset selected = null;
        for (DeltaAsset asset : target.deltas()) {
            if (compare(asset.from(), old.version()) == 0 && asset.size() < target.size()
                    && (selected == null || asset.size() < selected.size())) selected = asset;
        }
        return selected == null ? target : new Release(target.version(), target.notes(), target.page(), selected.download(),
            selected.digest(), selected.checksum(), selected.size());
    }

    public static String prepare(Path root, Release target, Path zip, String minecraft, String neoforge,
                                  LongConsumer progress, Consumer<Release> transfer) throws IOException {
        return prepare(root, target, zip, minecraft, neoforge, progress, transfer, UpdateCore::download);
    }

    /** The injected downloader lets the complete fallback path run without external network access in tests. */
    static String prepare(Path root, Release target, Path zip, String minecraft, String neoforge,
                          LongConsumer progress, Consumer<Release> transfer, Downloader downloader) throws IOException {
        Release chosen;
        try { chosen = selectDownload(root, target); }
        catch (IOException | IllegalArgumentException e) { chosen = target; }
        if (!chosen.download().equals(target.download())) {
            try {
                transfer.accept(chosen);
                String hash = downloader.download(chosen, zip, progress);
                UpdatePackage update = inspectPackage(zip, target.version(), minecraft, neoforge);
                if (update.delta() == null) throw new IOException("增量下载必须包含增量声明");
                validateDeltaBase(root, ownership(root), update);
                return hash;
            } catch (IOException e) {
                // No game files have changed. A missing, corrupt or inapplicable patch can safely use the full ZIP.
                Files.deleteIfExists(zip);
            }
        }
        transfer.accept(target);
        String hash = downloader.download(target, zip, progress);
        if (inspectPackage(zip, target.version(), minecraft, neoforge).delta() != null)
            throw new IOException("完整包下载入口不能提供增量包");
        return hash;
    }

    private static Map<String, FileInfo> ownedFiles(Manifest manifest) {
        Map<String, FileInfo> files = new HashMap<>(manifest.files());
        files.remove(BASELINE); // Physical bootstrap is immutable; installed.json may include a newer copy's hash.
        files.remove(PACK); // Release notes may differ from the tag's pack.json; PACK is always replaced by a delta.
        return files;
    }

    public static void validateDeltaBase(Path root, Manifest old, UpdatePackage update) throws IOException {
        Delta delta = update.delta();
        if (delta == null) return;
        Manifest base = delta.base();
        if (compare(old.version(), base.version()) != 0 || !old.minecraft().equals(base.minecraft())
                || !old.neoforge().equals(base.neoforge()) || !ownedFiles(old).equals(ownedFiles(base)))
            throw new IOException("增量包不适用于当前文件清单，请使用完整包");
        Set<String> payload = update.payload();
        for (var entry : update.manifest().files().entrySet()) {
            if (payload.contains(entry.getKey())) continue;
            Path file = safePath(root, entry.getKey());
            if (!Files.isRegularFile(file) || Files.size(file) != entry.getValue().size()
                    || !sha256(file).equalsIgnoreCase(entry.getValue().sha256()))
                throw new IOException("增量包需要复用的本地文件已修改或缺失: " + entry.getKey());
        }
    }

    public static boolean allowed(String path) {
        if (path == null || path.isEmpty() || path.contains("\\") || path.contains(":")) return false;
        for (String part : path.split("/", -1)) {
            if (part.isEmpty() || part.equals(".") || part.equals("..") || part.endsWith(".") || part.endsWith(" ")
                || part.chars().anyMatch(ch -> ch < 32) || part.matches("(?i)(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\\..*)?")) return false;
        }
        String p = path.toLowerCase(Locale.ROOT);
        if (p.matches(".*(credential|password|secret|token|account|session|auth).*")) return false;
        if (p.matches(".*\\.(?:bak|log|tmp|key|pem|p12|pfx|keystore)$") || p.contains("/.")) return false;
        if (path.equals(PACK) || path.equals(BASELINE)) return true;
        if (p.startsWith("mods/")) return path.split("/").length == 2 && p.endsWith(".jar");
        if (p.startsWith("kubejs/")) return p.matches("kubejs/(assets|data|client_scripts|server_scripts|startup_scripts|event_groups)/.+")
            && !p.endsWith("jsconfig.json");
        if (p.startsWith("config/")) {
            if (p.startsWith("config/poc-updater/") || p.startsWith("config/modpack-update-checker/")) return false;
            if (p.matches(".*(?:[-/]client\\.(?:toml|json|snbt)|[-/]client-[0-9]+\\.toml)$")) return false;
            if (p.matches("config/(sodium.*|iris.*|replaymod.*|jei/.*|inventoryprofilesnext/.*|mcef/.*|.*fingerprint.*)")) return false;
            if (p.startsWith("config/ars_nouveau/search_index/") || p.startsWith("config/skyblockbuilder/data/")
                || p.equals("config/brandon3055/contributors.json")) return false;
            return true;
        }
        return p.matches("(?:defaultconfigs|resourcepacks|shaderpacks|patchouli_books)/.+")
            || p.startsWith("skyblockbuilder/exports/");
    }

    public static Path safePath(Path root, String relative) throws IOException {
        Path normalized = root.toAbsolutePath().normalize();
        Path target = normalized.resolve(relative).normalize();
        if (!allowed(relative) || !target.startsWith(normalized)) throw new IOException("禁止更新此路径: " + relative);
        for (Path part = target; part != null && part.startsWith(normalized); part = part.getParent()) {
            if (Files.isSymbolicLink(part) || Files.exists(part, LinkOption.NOFOLLOW_LINKS) && !Files.exists(part))
                throw new IOException("禁止更新链接: " + relative);
            // Windows junctions are also redirected by toRealPath.
            if (Files.exists(part) && !part.toRealPath().equals(part.toAbsolutePath().normalize()))
                throw new IOException("禁止通过目录链接更新: " + relative);
        }
        return target;
    }

    public static Manifest inspect(Path zipPath, String expectedVersion, String minecraft, String neoforge) throws IOException {
        return inspectPackage(zipPath, expectedVersion, minecraft, neoforge).manifest();
    }

    private static <T> T zipJson(ZipFile zip, String path, Class<T> type) throws IOException {
        ZipEntry entry = zip.getEntry(path);
        if (entry == null || entry.isDirectory() || entry.getSize() < 0 || entry.getSize() > 8 * 1024 * 1024)
            throw new IOException("缺少有效更新清单: " + path);
        try (InputStream in = zip.getInputStream(entry)) {
            byte[] data = in.readNBytes(8 * 1024 * 1024 + 1);
            if (data.length > 8 * 1024 * 1024) throw new IOException("更新清单过大");
            return JSON.fromJson(new String(data, StandardCharsets.UTF_8), type);
        }
    }

    public static UpdatePackage inspectPackage(Path zipPath, String expectedVersion, String minecraft, String neoforge) throws IOException {
        try (ZipFile zip = new ZipFile(zipPath.toFile(), StandardCharsets.UTF_8)) {
            Manifest m = zipJson(zip, MANIFEST, Manifest.class);
            validate(m);
            if (compare(m.version(), expectedVersion) != 0) throw new IOException("Release 与更新包版本不一致");
            if (!m.minecraft().equals(minecraft) || !m.neoforge().equals(neoforge))
                throw new IOException("此版本需要更换 Minecraft/NeoForge，请从发布页安装完整实例");
            Delta delta = zip.getEntry(DELTA) == null ? null : zipJson(zip, DELTA, Delta.class);
            if (zip.getEntry(DELTA) != null && delta == null) throw new IOException("增量声明为空");
            if (delta != null) validateDelta(m, delta);
            UpdatePackage update = new UpdatePackage(m, delta);
            Set<String> payload = update.payload();
            Set<String> names = new HashSet<>();
            Enumeration<? extends ZipEntry> entries = zip.entries();
            while (entries.hasMoreElements()) {
                ZipEntry e = entries.nextElement();
                if (!names.add(e.getName())) throw new IOException("ZIP 中有重复路径");
                if (e.getName().equals(MANIFEST)) continue;
                if (delta != null && e.getName().equals(DELTA)) continue;
                FileInfo f = m.files().get(e.getName());
                if (e.isDirectory() || f == null || !payload.contains(e.getName()) || e.getSize() != f.size()) throw new IOException("ZIP 与更新清单不一致");
            }
            if (names.size() != payload.size() + (delta == null ? 1 : 2)) throw new IOException("更新文件不完整");
            Pack pack = zipJson(zip, PACK, Pack.class);
            if (pack == null || compare(pack.version(), m.version()) != 0 || !m.minecraft().equals(pack.minecraft())
                || !m.neoforge().equals(pack.neoforge())) throw new IOException("本地版本信息与更新清单不一致");
            return update;
        } catch (JsonParseException | IllegalArgumentException | NullPointerException e) { throw new IOException("更新清单无效", e); }
    }

    static void validateDelta(Manifest next, Delta delta) throws IOException {
        if (delta.schema() != 1 || delta.base() == null || delta.files() == null || delta.removed() == null)
            throw new IOException("增量声明无效");
        validate(delta.base());
        Manifest base = delta.base();
        if (compare(base.version(), next.version()) >= 0 || !base.minecraft().equals(next.minecraft())
                || !base.neoforge().equals(next.neoforge())) throw new IOException("增量基础版本无效");
        Set<String> changed = new HashSet<>();
        for (var entry : next.files().entrySet()) {
            if (entry.getKey().equals(PACK) || entry.getKey().equals(BASELINE)
                    || !entry.getValue().equals(base.files().get(entry.getKey()))) changed.add(entry.getKey());
        }
        Set<String> removed = new HashSet<>(base.files().keySet());
        removed.removeAll(next.files().keySet());
        removed.remove(BASELINE);
        if (delta.files().size() != changed.size() || !changed.equals(new HashSet<>(delta.files()))
                || delta.removed().size() != removed.size() || !removed.equals(new HashSet<>(delta.removed())))
            throw new IOException("增量新增、修改或删除列表与完整清单不一致");
        Map<String, String> folded = new HashMap<>();
        for (String path : base.files().keySet()) folded.put(path.toLowerCase(Locale.ROOT), path);
        for (String path : next.files().keySet()) {
            String prior = folded.get(path.toLowerCase(Locale.ROOT));
            if (prior != null && !prior.equals(path)) throw new IOException("增量更新不支持仅大小写不同的路径重命名");
        }
    }

    public static void validate(Manifest m) throws IOException {
        if (m == null || m.schema() != 1 || m.files() == null || m.files().isEmpty() || m.files().size() > 50000
            || m.minecraft() == null || m.neoforge() == null || !m.files().containsKey(PACK)) throw new IOException("更新清单无效");
        version(m.version());
        long total = 0;
        Set<String> folded = new HashSet<>();
        for (Map.Entry<String, FileInfo> entry : m.files().entrySet()) {
            FileInfo f = entry.getValue();
            if (!allowed(entry.getKey()) || !folded.add(entry.getKey().toLowerCase(Locale.ROOT)) || f == null
                || f.sha256() == null || !f.sha256().matches("[a-fA-F0-9]{64}") || f.size() < 0 || f.size() > MAX_BYTES)
                throw new IOException("更新文件信息无效: " + entry.getKey());
            total += f.size();
            if (total > MAX_BYTES) throw new IOException("更新解压大小超过限制");
        }
    }

    private UpdateCore() {}
}
