package creation.updater;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.FileTime;
import java.security.MessageDigest;
import java.util.*;
import java.util.zip.*;

/** Exercises incremental installation and the real client's download/fallback orchestration in disposable instances. */
public final class DeltaTest {
    private static int checks;
    private static void check(boolean value, String message) {
        checks++;
        if (!value) throw new AssertionError(message);
    }
    private static void rejects(Action action, String message) throws Exception {
        checks++;
        try { action.run(); } catch (IOException | IllegalArgumentException expected) { return; }
        throw new AssertionError("Expected rejection: " + message);
    }
    @FunctionalInterface interface Action { void run() throws Exception; }
    private static byte[] text(String value) { return value.getBytes(StandardCharsets.UTF_8); }
    private static byte[] json(Object value) { return text(UpdateCore.JSON.toJson(value)); }
    private static UpdateCore.FileInfo info(byte[] bytes) throws Exception {
        return new UpdateCore.FileInfo(HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes)), bytes.length);
    }
    private static UpdateCore.Manifest manifest(String version, Map<String, byte[]> files) throws Exception {
        Map<String, UpdateCore.FileInfo> entries = new LinkedHashMap<>();
        for (var e : files.entrySet()) entries.put(e.getKey(), info(e.getValue()));
        return new UpdateCore.Manifest(1, version, "1.21.1", "21.1.255", entries);
    }
    private static void put(Path root, String path, byte[] bytes) throws IOException {
        Path file = root.resolve(path);
        Files.createDirectories(file.getParent());
        Files.write(file, bytes);
    }
    private static Map<String, byte[]> oldFiles() {
        Map<String, byte[]> files = new LinkedHashMap<>();
        files.put("mods/keep.jar", text("unchanged mod"));
        files.put("mods/old.jar", text("obsolete mod"));
        files.put("kubejs/server_scripts/obsolete.js", text("obsolete script"));
        files.put("config/gameplay.toml", text("old gameplay"));
        files.put(UpdateCore.PACK, json(new UpdateCore.Pack("0.0.4", "1.21.1", "21.1.255", "old notes")));
        return files;
    }
    private static Path fixture() throws Exception {
        Path root = Files.createTempDirectory("poc-delta-test-");
        Map<String, byte[]> files = oldFiles();
        for (var e : files.entrySet()) put(root, e.getKey(), e.getValue());
        UpdateCore.write(root.resolve(UpdateCore.BASELINE), manifest("0.0.4", files));
        put(root, "saves/World/level.dat", text("survival save"));
        put(root, "options.txt", text("player keys"));
        put(root, "mods/personal.jar", text("personal mod"));
        Files.setLastModifiedTime(root.resolve("mods/keep.jar"), FileTime.fromMillis(123000));
        return root;
    }
    private static Map<String, byte[]> nextFiles(String version) throws Exception {
        Map<String, byte[]> files = new LinkedHashMap<>();
        files.put("mods/keep.jar", text("unchanged mod"));
        files.put("mods/new.jar", text("new mod"));
        files.put("config/gameplay.toml", text("new gameplay"));
        files.put(UpdateCore.PACK, json(new UpdateCore.Pack(version, "1.21.1", "21.1.255", "new notes")));
        files.put(UpdateCore.BASELINE, json(manifest(version, files)));
        return files;
    }
    private static UpdateCore.Delta delta(UpdateCore.Manifest base, UpdateCore.Manifest next) {
        List<String> changed = new ArrayList<>();
        for (var e : next.files().entrySet()) {
            if (e.getKey().equals(UpdateCore.PACK) || e.getKey().equals(UpdateCore.BASELINE)
                || !e.getValue().equals(base.files().get(e.getKey()))) changed.add(e.getKey());
        }
        List<String> removed = new ArrayList<>(base.files().keySet());
        removed.removeAll(next.files().keySet()); removed.remove(UpdateCore.BASELINE);
        return new UpdateCore.Delta(1, base, changed, removed);
    }
    private static Path archive(Path root, String name, UpdateCore.Manifest next, UpdateCore.Delta delta,
                                Map<String, byte[]> bytes) throws Exception {
        Path path = root.resolve(name);
        Set<String> payload = delta == null ? next.files().keySet() : new LinkedHashSet<>(delta.files());
        try (ZipOutputStream zip = new ZipOutputStream(Files.newOutputStream(path), StandardCharsets.UTF_8)) {
            for (String file : payload) {
                if (!bytes.containsKey(file)) continue; // Used by the missing-payload rejection test.
                zip.putNextEntry(new ZipEntry(file)); zip.write(bytes.get(file)); zip.closeEntry();
            }
            zip.putNextEntry(new ZipEntry(UpdateCore.MANIFEST)); zip.write(json(next)); zip.closeEntry();
            if (delta != null) {
                zip.putNextEntry(new ZipEntry(UpdateCore.DELTA)); zip.write(json(delta)); zip.closeEntry();
            }
        }
        return path;
    }
    private static UpdateCore.Job job(Path zip, String version) throws Exception {
        return new UpdateCore.Job(0, version, UpdateCore.sha256(zip), "1.21.1", "21.1.255");
    }
    private static UpdateCore.UpdatePackage inspect(Path zip, String version) throws IOException {
        return UpdateCore.inspectPackage(zip, version, "1.21.1", "21.1.255");
    }
    private static UpdateCore.Release release() {
        String prefix = "https://github.com/" + UpdateCore.REPO + "/releases/download/v0.0.5/";
        String full = prefix + UpdateCore.ASSET;
        String patch = prefix + "path-of-creation-delta-from-v0.0.4.zip";
        return new UpdateCore.Release("0.0.5", "notes", "", full, "sha256:" + "a".repeat(64), full + ".sha256", 10000,
            List.of(new UpdateCore.DeltaAsset("0.0.4", patch, "sha256:" + "b".repeat(64), patch + ".sha256", 100)));
    }
    private static void preserved(Path root) throws Exception {
        check(Files.readString(root.resolve("saves/World/level.dat")).equals("survival save"), "save preserved");
        check(Files.readString(root.resolve("options.txt")).equals("player keys"), "keys preserved");
        check(Files.readString(root.resolve("mods/personal.jar")).equals("personal mod"), "extra mod preserved");
    }
    public static void main(String[] args) throws Exception {
        Map<String, byte[]> files = nextFiles("0.0.5");
        UpdateCore.Manifest base = manifest("0.0.4", oldFiles());
        UpdateCore.Manifest next = manifest("0.0.5", files);
        UpdateCore.Delta delta = delta(base, next);
        Path root = fixture();
        byte[] bootstrap = Files.readAllBytes(root.resolve(UpdateCore.BASELINE));
        Path zip = archive(root, "patch.zip", next, delta, files);
        check(!inspect(zip, "0.0.5").payload().contains("mods/keep.jar"), "unchanged JAR absent from payload");
        Installer.install(root, zip, job(zip, "0.0.5"), -1);
        check(Files.readString(root.resolve("mods/new.jar")).equals("new mod"), "new mod installed");
        check(!Files.exists(root.resolve("mods/old.jar")), "old managed mod removed");
        check(!Files.exists(root.resolve("kubejs/server_scripts/obsolete.js")), "old script removed");
        check(Files.getLastModifiedTime(root.resolve("mods/keep.jar")).toMillis() == 123000, "unchanged mod never rewritten");
        check(Arrays.equals(bootstrap, Files.readAllBytes(root.resolve(UpdateCore.BASELINE))), "bootstrap ownership immutable");
        check(UpdateCore.ownership(root).equals(next), "installed ownership is COMPLETE target manifest");
        preserved(root);
        Path backup;
        try (var list = Files.list(root.resolve("local/poc-updater/backups"))) { backup = list.findFirst().orElseThrow(); }
        check(!Files.exists(backup.resolve("original/mods/keep.jar")), "unchanged mod not backed up");
        check(Files.readString(backup.resolve("original/mods/old.jar")).equals("obsolete mod"), "deleted mod backed up");
        rejects(() -> Installer.install(root, zip, job(zip, "0.0.5"), -1), "repeated delta");

        Map<String, byte[]> laterFiles = nextFiles("0.0.6");
        UpdateCore.Manifest later = manifest("0.0.6", laterFiles);
        Path second = archive(root, "second.zip", later, delta(next, later), laterFiles);
        Installer.install(root, second, job(second, "0.0.6"), -1);
        check(UpdateCore.ownership(root).version().equals("0.0.6"), "second delta uses installed.json, not immutable baseline");
        check(Files.getLastModifiedTime(root.resolve("mods/keep.jar")).toMillis() == 123000, "second delta also retains mod");

        Path cross = fixture();
        Path crossZip = archive(cross, "cross.zip", later, delta(base, later), laterFiles);
        Installer.install(cross, crossZip, job(crossZip, "0.0.6"), -1);
        check(UpdateCore.ownership(cross).version().equals("0.0.6"), "direct cross-version delta");

        Path failed = fixture();
        Path failedZip = archive(failed, "patch.zip", next, delta, files);
        rejects(() -> Installer.install(failed, failedZip, job(failedZip, "0.0.5"), 2), "delta write failure");
        for (var e : oldFiles().entrySet()) check(Arrays.equals(Files.readAllBytes(failed.resolve(e.getKey())), e.getValue()), "rollback " + e.getKey());
        check(!Files.exists(failed.resolve("mods/new.jar")), "rollback newly added mod");
        check(!Files.exists(failed.resolve("local/poc-updater/installed.json")), "rollback does not commit ownership");
        preserved(failed);

        Path edited = fixture();
        Path editedZip = archive(edited, "patch.zip", next, delta, files);
        put(edited, "mods/keep.jar", text("modified! mod")); // Same length; size alone cannot validate reuse.
        rejects(() -> Installer.install(edited, editedZip, job(editedZip, "0.0.5"), -1), "modified retained file");
        check(!Files.exists(edited.resolve("local/poc-updater/backups")), "invalid base rejected before staging/backups");
        Files.delete(edited.resolve("mods/keep.jar"));
        rejects(() -> Installer.install(edited, editedZip, job(editedZip, "0.0.5"), -1), "missing retained file");
        check(UpdateCore.ownership(edited).version().equals("0.0.4"), "rejected base leaves old ownership");

        Path invalid = fixture();
        List<String> removals = new ArrayList<>(delta.removed()); removals.add("mods/personal.jar");
        Path invalidZip = archive(invalid, "removal.zip", next, new UpdateCore.Delta(1, base, delta.files(), removals), files);
        rejects(() -> inspect(invalidZip, "0.0.5"), "cannot delete unowned personal mod");
        List<String> changes = new ArrayList<>(delta.files()); changes.remove("mods/new.jar");
        Path omitted = archive(invalid, "omitted.zip", next, new UpdateCore.Delta(1, base, changes, delta.removed()), files);
        rejects(() -> inspect(omitted, "0.0.5"), "changed file omitted from delta declaration");
        changes = new ArrayList<>(delta.files()); changes.add(changes.get(0));
        Path duplicate = archive(invalid, "duplicate.zip", next, new UpdateCore.Delta(1, base, changes, delta.removed()), files);
        rejects(() -> inspect(duplicate, "0.0.5"), "duplicate declared payload");
        Map<String, byte[]> missing = new LinkedHashMap<>(files); missing.remove("mods/new.jar");
        Path incomplete = archive(invalid, "missing.zip", next, delta, missing);
        rejects(() -> inspect(incomplete, "0.0.5"), "missing ZIP payload");
        Map<String, byte[]> tampered = new LinkedHashMap<>(files); tampered.put("mods/new.jar", text("bad mod"));
        Path badHash = archive(invalid, "bad-hash.zip", next, delta, tampered);
        rejects(() -> Installer.install(invalid, badHash, job(badHash, "0.0.5"), -1), "delta per-file hash mismatch");
        check(Files.readString(invalid.resolve("mods/old.jar")).equals("obsolete mod"), "bad payload touches no game files");
        rejects(() -> inspect(zip, "0.0.6"), "delta target version mismatch");
        rejects(() -> UpdateCore.inspectPackage(zip, "0.0.5", "1.21.1", "21.1.254"), "delta loader mismatch");
        preserved(invalid);

        Path wrongOwnership = fixture();
        Map<String, byte[]> otherOld = oldFiles(); otherOld.put("config/gameplay.toml", text("other config"));
        UpdateCore.write(wrongOwnership.resolve(UpdateCore.BASELINE), manifest("0.0.4", otherOld));
        rejects(() -> UpdateCore.validateDeltaBase(wrongOwnership, UpdateCore.ownership(wrongOwnership), inspect(zip, "0.0.5")), "same version but different ownership");

        Path transfer = fixture();
        Path patch = archive(transfer, "patch.zip", next, delta, files);
        Path full = archive(transfer, "full.zip", next, null, files);
        UpdateCore.Release target = release();
        check(UpdateCore.selectDownload(transfer, target).size() == 100, "client chooses smaller applicable delta");
        List<String> downloads = new ArrayList<>();
        List<Long> sizes = new ArrayList<>();
        UpdateCore.Downloader downloader = (selected, destination, progress) -> {
            downloads.add(selected.download());
            Files.copy(selected.download().equals(target.download()) ? full : patch, destination, StandardCopyOption.REPLACE_EXISTING);
            progress.accept(Files.size(destination));
            return UpdateCore.sha256(destination);
        };
        Path destination = transfer.resolve("downloaded.zip");
        String hash = UpdateCore.prepare(transfer, target, destination, "1.21.1", "21.1.255", n -> {}, r -> sizes.add(r.size()), downloader);
        check(hash.equals(UpdateCore.sha256(patch)) && downloads.size() == 1, "client prepares delta without full download");
        check(sizes.equals(List.of(100L)), "progress uses actual delta size");
        put(transfer, "mods/keep.jar", text("modified! mod"));
        downloads.clear(); sizes.clear();
        hash = UpdateCore.prepare(transfer, target, destination, "1.21.1", "21.1.255", n -> {}, r -> sizes.add(r.size()), downloader);
        check(hash.equals(UpdateCore.sha256(full)) && downloads.size() == 2, "edited local file triggers full fallback");
        check(sizes.equals(List.of(100L, 10000L)), "fallback resets progress to full size");
        Installer.install(transfer, destination, job(destination, "0.0.5"), -1);
        check(Files.readString(transfer.resolve("mods/keep.jar")).equals("unchanged mod"), "full fallback repairs edited mod");
        preserved(transfer);

        Path network = fixture();
        downloads.clear();
        UpdateCore.prepare(network, target, network.resolve("downloaded.zip"), "1.21.1", "21.1.255", n -> {}, r -> {}, (selected, path, progress) -> {
            downloads.add(selected.download());
            if (!selected.download().equals(target.download())) throw new IOException("404 or corrupt patch");
            Files.copy(full, path, StandardCopyOption.REPLACE_EXISTING); return UpdateCore.sha256(path);
        });
        check(downloads.size() == 2, "missing/corrupt delta download falls back");
        UpdateCore.Release legacy = UpdateCore.JSON.fromJson("{\"version\":\"0.0.5\",\"download\":\"full\",\"size\":10000}", UpdateCore.Release.class);
        check(UpdateCore.selectDownload(network, legacy) == legacy, "legacy full-only feed supported");
        UpdateCore.Release noBase = new UpdateCore.Release("0.0.5", "notes", "", target.download(), target.digest(), target.checksum(), target.size(),
            List.of(new UpdateCore.DeltaAsset("0.0.3", target.deltas().get(0).download(), target.digest(), target.deltas().get(0).checksum(), 100)));
        check(UpdateCore.selectDownload(network, noBase) == noBase, "no matching old version uses full package");
        System.out.println("PASS: " + checks + " delta checks (install, unchanged files, removals, cross-version, rollback, integrity, automatic full fallback)");
    }
}
