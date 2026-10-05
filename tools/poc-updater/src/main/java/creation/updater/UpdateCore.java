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
import java.util.zip.*;

/** Shared by the client and the separate installer. No Minecraft dependencies. */
public final class UpdateCore {
    public static final Gson JSON = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();
    public static final String REPO = "RainRaf-UwU/Path-Of-Creation";
    public static final String ASSET = "path-of-creation-update.zip";
    public static final String PACK = "config/poc-updater/pack.json";
    public static final String BASELINE = "config/poc-updater/baseline.json";
    public static final String MANIFEST = "poc-update.json";
    public static final String FEED = "https://raw.githubusercontent.com/" + REPO + "/main/config/poc-updater/latest.json";
    public static final long MAX_BYTES = 8L * 1024 * 1024 * 1024;

    public record Pack(String version, String minecraft, String neoforge, String changelog) {}
    public record FileInfo(String sha256, long size) {}
    public record Manifest(int schema, String version, String minecraft, String neoforge,
                           Map<String, FileInfo> files) {}
    public record Release(String version, String notes, String page, String download,
                          String digest, String checksum, long size) {}
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
            for (JsonElement element : data.getAsJsonArray("assets")) {
                JsonObject asset = element.getAsJsonObject();
                if (ASSET.equals(string(asset, "name"))) {
                    url = string(asset, "browser_download_url");
                    digest = string(asset, "digest");
                    size = asset.get("size").getAsLong();
                } else if ((ASSET + ".sha256").equals(string(asset, "name"))) {
                    checksum = string(asset, "browser_download_url");
                }
            }
            if (!url.isEmpty()) releaseAssetUrl(url);
            if (!checksum.isEmpty()) releaseAssetUrl(checksum);
            return new Release(ver, string(data, "body"), page, url, digest, checksum, size);
        } catch (IllegalArgumentException | NullPointerException e) { throw new IOException("Invalid GitHub release", e); }
    }

    private static String string(JsonObject obj, String key) {
        return obj.has(key) && !obj.get(key).isJsonNull() ? obj.get(key).getAsString() : "";
    }

    public static void releaseAssetUrl(String url) throws IOException {
        if (!url.startsWith("https://github.com/" + REPO + "/releases/download/"))
            throw new IOException("更新文件必须来自本整合包的 GitHub Release");
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
        if (release.digest().matches("sha256:[a-fA-F0-9]{64}")) hash = release.digest().substring(7);
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
        try (ZipFile zip = new ZipFile(zipPath.toFile(), StandardCharsets.UTF_8)) {
            ZipEntry entry = zip.getEntry(MANIFEST);
            if (entry == null || entry.getSize() < 0 || entry.getSize() > 8 * 1024 * 1024) throw new IOException("缺少有效更新清单");
            Manifest m;
            try (Reader in = new InputStreamReader(zip.getInputStream(entry), StandardCharsets.UTF_8)) {
                m = JSON.fromJson(in, Manifest.class);
            }
            validate(m);
            if (compare(m.version(), expectedVersion) != 0) throw new IOException("Release 与更新包版本不一致");
            if (!m.minecraft().equals(minecraft) || !m.neoforge().equals(neoforge))
                throw new IOException("此版本需要更换 Minecraft/NeoForge，请从发布页安装完整实例");
            Set<String> names = new HashSet<>();
            Enumeration<? extends ZipEntry> entries = zip.entries();
            while (entries.hasMoreElements()) {
                ZipEntry e = entries.nextElement();
                if (!names.add(e.getName())) throw new IOException("ZIP 中有重复路径");
                if (e.getName().equals(MANIFEST)) continue;
                FileInfo f = m.files().get(e.getName());
                if (e.isDirectory() || f == null || e.getSize() != f.size()) throw new IOException("ZIP 与更新清单不一致");
            }
            if (names.size() != m.files().size() + 1) throw new IOException("更新文件不完整");
            Pack pack;
            try (Reader in = new InputStreamReader(zip.getInputStream(zip.getEntry(PACK)), StandardCharsets.UTF_8)) {
                pack = JSON.fromJson(in, Pack.class);
            }
            if (pack == null || compare(pack.version(), m.version()) != 0 || !m.minecraft().equals(pack.minecraft())
                || !m.neoforge().equals(pack.neoforge())) throw new IOException("本地版本信息与更新清单不一致");
            return m;
        } catch (JsonParseException | IllegalArgumentException | NullPointerException e) { throw new IOException("更新清单无效", e); }
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
