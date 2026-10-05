package creation.updater;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.*;
import java.util.*;
import java.util.zip.*;

public final class UpdaterTest {
    private static int checks;
    private static void check(boolean value, String name) {
        checks++;
        if (!value) throw new AssertionError(name);
    }
    private static void rejects(Action action, String name) throws Exception {
        checks++;
        try { action.run(); } catch (IOException | IllegalArgumentException expected) { return; }
        throw new AssertionError("Expected rejection: " + name);
    }
    interface Action { void run() throws Exception; }

    private static byte[] bytes(Object value) { return UpdateCore.JSON.toJson(value).getBytes(StandardCharsets.UTF_8); }
    private static byte[] text(String text) { return text.getBytes(StandardCharsets.UTF_8); }
    private static UpdateCore.FileInfo info(byte[] data) throws Exception {
        return new UpdateCore.FileInfo(HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(data)), data.length);
    }
    private static UpdateCore.Manifest manifest(String version, Map<String, byte[]> files) throws Exception {
        Map<String, UpdateCore.FileInfo> metadata = new LinkedHashMap<>();
        for (var e : files.entrySet()) metadata.put(e.getKey(), info(e.getValue()));
        return new UpdateCore.Manifest(1, version, "1.21.1", "21.1.255", metadata);
    }
    private static Path archive(Path root, UpdateCore.Manifest manifest, Map<String, byte[]> files) throws Exception {
        Path zip = root.resolve("update.zip");
        try (ZipOutputStream out = new ZipOutputStream(Files.newOutputStream(zip), StandardCharsets.UTF_8)) {
            for (var e : files.entrySet()) {
                out.putNextEntry(new ZipEntry(e.getKey())); out.write(e.getValue()); out.closeEntry();
            }
            out.putNextEntry(new ZipEntry(UpdateCore.MANIFEST)); out.write(bytes(manifest)); out.closeEntry();
        }
        return zip;
    }
    private static UpdateCore.Job job(Path zip, String version) throws Exception {
        return new UpdateCore.Job(0, version, UpdateCore.sha256(zip), "1.21.1", "21.1.255");
    }
    private static void put(Path root, String path, byte[] data) throws Exception {
        Path target = root.resolve(path); Files.createDirectories(target.getParent()); Files.write(target, data);
    }
    private static Path fixture() throws Exception {
        Path root = Files.createTempDirectory("poc-updater-test-");
        Map<String, byte[]> old = new LinkedHashMap<>();
        old.put("mods/old.jar", text("old mod"));
        old.put("kubejs/server_scripts/obsolete.js", text("old script"));
        old.put("config/gameplay.toml", text("original config"));
        old.put(UpdateCore.PACK, bytes(new UpdateCore.Pack("0.0.4", "1.21.1", "21.1.255", "old notes")));
        for (var e : old.entrySet()) put(root, e.getKey(), e.getValue());
        UpdateCore.write(root.resolve(UpdateCore.BASELINE), manifest("0.0.4", old));
        put(root, "saves/World/level.dat", text("survival save"));
        put(root, "options.txt", text("player keys"));
        put(root, "mods/personal.jar", text("personal mod"));
        UpdateCore.write(root.resolve("local/poc-updater/state.json"), new UpdateCore.State(Set.of("0.0.4")));
        return root;
    }
    private static Map<String, byte[]> newFiles() {
        Map<String, byte[]> files = new LinkedHashMap<>();
        files.put("mods/new.jar", text("new mod"));
        files.put("kubejs/server_scripts/new.js", text("new script"));
        files.put("config/gameplay.toml", text("updated config"));
        files.put(UpdateCore.PACK, bytes(new UpdateCore.Pack("0.0.5", "1.21.1", "21.1.255", "new notes")));
        return files;
    }

    public static void main(String[] args) throws Exception {
        check(UpdateCore.compare("v0.0.10", "0.0.9") > 0, "numeric version ordering");
        check(UpdateCore.compare("0.1.0", "0.0.99") > 0, "minor ordering");
        check(UpdateCore.compare("v0.0.4", "0.0.4.0") == 0, "equivalent versions");
        check(UpdateCore.compare("0.0.3", "0.0.4") < 0, "downgrade comparison");
        rejects(() -> UpdateCore.version("nightly-main"), "unversioned release");
        rejects(() -> UpdateCore.version("0.0.5-beta"), "prerelease tag");
        UpdateCore.Release currentRelease = new UpdateCore.Release("0.0.4", "notes", "", "", "", "", 0);
        UpdateCore.Release newerRelease = new UpdateCore.Release("0.0.5", "notes", "", "", "", "", 0);
        check(UpdateCore.popup("0.0.4", newerRelease, Set.of("0.0.4")) == UpdateCore.Popup.UPDATE, "older client offers update even after reading its notes");
        check(UpdateCore.popup("0.0.4", currentRelease, Set.of()) == UpdateCore.Popup.CHANGELOG, "latest client first launch shows only notes");
        check(UpdateCore.popup("0.0.4", currentRelease, Set.of("0.0.4")) == UpdateCore.Popup.NONE, "latest client subsequent launch has no popup");
        check(UpdateCore.popup("0.0.5", newerRelease, Set.of("0.0.4")) == UpdateCore.Popup.CHANGELOG, "updated client shows new notes once");
        check(UpdateCore.popup("0.0.5", currentRelease, Set.of("0.0.5")) == UpdateCore.Popup.NONE, "never offer a downgrade");
        check(UpdateCore.popup("0.0.4", null, Set.of("0.0.4")) == UpdateCore.Popup.NONE, "offline startup does not repeatedly popup");
        for (String path : List.of("../mods/new.jar", "mods/../options.txt", "saves/a/level.dat", "options.txt",
            "mods/a.jar:stream", "mods/a.jar\\evil", "config/auth.json", "config/sodium-options.json",
            "config/ae2-client.toml", "config/server.key", "local/poc-updater/state.json", "mods/CON.jar", "mods/a.jar.", "mods/a.jar/"))
            check(!UpdateCore.allowed(path), "protected path " + path);
        check(UpdateCore.allowed("mods/科技.jar"), "unicode mod path");
        check(UpdateCore.allowed("config/ftbquests/quests/chapters/1111.snbt"), "quest path");
        check(UpdateCore.allowed("kubejs/server_scripts/assembler.js"), "script path");

        Path root = fixture();
        Path link = root.resolve("config/world-link");
        if (System.getProperty("os.name").toLowerCase(Locale.ROOT).contains("win")) {
            String command = "New-Item -ItemType Junction -Path '" + link.toString().replace("'", "''")
                + "' -Target '" + root.resolve("saves").toString().replace("'", "''") + "' | Out-Null";
            Process junction = new ProcessBuilder("powershell.exe", "-NoProfile", "-NonInteractive", "-Command", command).start();
            if (junction.waitFor() != 0) throw new AssertionError("Cannot create test junction");
        } else Files.createSymbolicLink(link, root.resolve("saves"));
        rejects(() -> UpdateCore.safePath(root, "config/world-link/World/level.dat"), "junction into saves");
        Map<String, byte[]> files = newFiles();
        Path zip = archive(root, manifest("0.0.5", files), files);
        UpdateCore.Job job = job(zip, "0.0.5");
        rejects(() -> UpdateCore.inspect(zip, "0.0.6", "1.21.1", "21.1.255"), "release/package version mismatch");
        rejects(() -> UpdateCore.inspect(zip, "0.0.5", "1.21.1", "21.1.254"), "loader mismatch");
        rejects(() -> Installer.install(root, zip, new UpdateCore.Job(0, "0.0.5", "0".repeat(64), "1.21.1", "21.1.255"), -1), "archive tampering");
        Installer.install(root, zip, job, -1);
        check(!Files.exists(root.resolve("mods/old.jar")), "old managed mod removed");
        check(!Files.exists(root.resolve("kubejs/server_scripts/obsolete.js")), "obsolete script removed");
        check(Files.readString(root.resolve("mods/new.jar")).equals("new mod"), "new mod installed");
        check(Files.readString(root.resolve("config/gameplay.toml")).equals("updated config"), "config updated");
        check(Files.readString(root.resolve("saves/World/level.dat")).equals("survival save"), "world preserved");
        check(Files.readString(root.resolve("options.txt")).equals("player keys"), "keys preserved");
        check(Files.readString(root.resolve("mods/personal.jar")).equals("personal mod"), "personal mod preserved");
        check(UpdateCore.read(root.resolve("local/poc-updater/state.json"), UpdateCore.State.class).seenVersions().equals(Set.of("0.0.4")), "popup state retained across update");
        check(UpdateCore.read(root.resolve(UpdateCore.PACK), UpdateCore.Pack.class).version().equals("0.0.5"), "version committed");
        Path backup;
        try (var list = Files.list(root.resolve("local/poc-updater/backups"))) { backup = list.findFirst().orElseThrow(); }
        check(Files.readString(backup.resolve("original/mods/old.jar")).equals("old mod"), "old mod backed up");
        rejects(() -> Installer.install(root, zip, job, -1), "repeated update");

        Path failed = fixture();
        Path failedZip = archive(failed, manifest("0.0.5", files), files);
        rejects(() -> Installer.install(failed, failedZip, job(failedZip, "0.0.5"), 3), "simulated write failure");
        check(Files.readString(failed.resolve("mods/old.jar")).equals("old mod"), "rollback old mod");
        check(!Files.exists(failed.resolve("mods/new.jar")), "rollback added mod");
        check(Files.readString(failed.resolve("config/gameplay.toml")).equals("original config"), "rollback overwritten config");
        check(UpdateCore.read(failed.resolve(UpdateCore.PACK), UpdateCore.Pack.class).version().equals("0.0.4"), "rollback version");
        check(!Files.exists(failed.resolve("local/poc-updater/installed.json")), "ownership not committed after rollback");

        Path corrupt = fixture();
        UpdateCore.Manifest declaration = manifest("0.0.5", files);
        files.put("mods/new.jar", text("tamper!")); // Same byte length, wrong per-file hash.
        Path corruptZip = archive(corrupt, declaration, files);
        rejects(() -> Installer.install(corrupt, corruptZip, job(corruptZip, "0.0.5"), -1), "per-file tampering");
        check(Files.readString(corrupt.resolve("mods/old.jar")).equals("old mod"), "tampering never touches game files");

        Map<String, byte[]> unsafe = newFiles();
        unsafe.put("saves/World/level.dat", text("malicious save overwrite"));
        Path unsafeZip = archive(corrupt, manifest("0.0.5", unsafe), unsafe);
        rejects(() -> UpdateCore.inspect(unsafeZip, "0.0.5", "1.21.1", "21.1.255"), "manifest cannot target saves");
        check(Files.readString(corrupt.resolve("saves/World/level.dat")).equals("survival save"), "rejected save untouched");
        Path seenPath = root.resolve("local/poc-updater/state.json");
        UpdateCore.State seen = UpdateCore.read(seenPath, UpdateCore.State.class);
        check(!seen.seenVersions().contains("0.0.5"), "new version has unseen changelog");
        UpdateCore.write(seenPath, new UpdateCore.State(Set.of("0.0.4", "0.0.5")));
        check(UpdateCore.read(seenPath, UpdateCore.State.class).seenVersions().contains("0.0.5"), "changelog acknowledgement survives restart");
        if (args.length > 0) {
            UpdateCore.inspect(Path.of(args[0]), "0.0.5", "1.21.1", "21.1.255");
            checks++;
        }
        System.out.println("PASS: " + checks + " checks (versions, integrity, ownership, saves, backup, rollback, changelog persistence)");
    }

    public static final class NetworkSmoke {
        public static void main(String[] args) throws Exception {
            UpdateCore.Release release = UpdateCore.latest();
            System.out.println(release == null ? "GitHub API: no stable release; local changelog fallback available" : "GitHub API: latest v" + release.version());
        }
    }

    public static final class PackageSmoke {
        public static void main(String[] args) throws Exception {
            Path archive = Path.of(args[0]);
            UpdateCore.Manifest m = UpdateCore.inspect(archive, args[1], "1.21.1", "21.1.255");
            try (ZipFile zip = new ZipFile(archive.toFile(), StandardCharsets.UTF_8)) {
                for (var entry : m.files().entrySet()) {
                    MessageDigest digest = MessageDigest.getInstance("SHA-256");
                    try (InputStream in = zip.getInputStream(zip.getEntry(entry.getKey()))) {
                        byte[] buffer = new byte[128 * 1024];
                        for (int n; (n = in.read(buffer)) != -1;) digest.update(buffer, 0, n);
                    }
                    if (!HexFormat.of().formatHex(digest.digest()).equals(entry.getValue().sha256()))
                        throw new AssertionError("Published file hash mismatch: " + entry.getKey());
                }
            }
            System.out.println("PASS: actual v" + m.version() + " package, " + m.files().size() + " file paths/sizes/hashes accepted by the Java installer");
        }
    }
}
