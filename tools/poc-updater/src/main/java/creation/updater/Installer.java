package creation.updater;

import java.io.*;
import java.nio.channels.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.zip.*;

/** Runs from a copied helper JAR after the Minecraft JVM has exited. */
public final class Installer {
    public static void main(String[] args) throws Exception {
        Path root = Path.of(args[0]).toRealPath();
        Path work = root.resolve("local/poc-updater");
        try (FileChannel channel = FileChannel.open(work.resolve("install.lock"), StandardOpenOption.CREATE, StandardOpenOption.WRITE);
             FileLock lock = channel.tryLock()) {
            if (lock == null) throw new IOException("另一个更新正在安装");
            UpdateCore.Job job = UpdateCore.read(work.resolve("pending.json"), UpdateCore.Job.class);
            ProcessHandle.of(job.parentPid()).ifPresent(parent -> parent.onExit().join());
            Thread.sleep(2000); // Let the OS release JAR handles.
            try {
                install(root, work.resolve("update.zip"), job, -1);
                UpdateCore.write(work.resolve("result.json"), new UpdateCore.Status(true, "更新已安装，请重新启动游戏。"));
                Files.deleteIfExists(work.resolve("pending.json"));
            } catch (Exception e) {
                UpdateCore.write(work.resolve("result.json"), new UpdateCore.Status(false, e.getMessage()));
                Files.deleteIfExists(work.resolve("pending.json"));
                e.printStackTrace();
                System.exit(1);
            }
        }
    }

    /** failAfter is used only by the rollback integration test; production passes -1. */
    static void install(Path root, Path archive, UpdateCore.Job job, int failAfter) throws IOException {
        if (!UpdateCore.sha256(archive).equalsIgnoreCase(job.sha256())) throw new IOException("下载包在安装前被修改");
        UpdateCore.UpdatePackage update = UpdateCore.inspectPackage(archive, job.version(), job.minecraft(), job.neoforge());
        UpdateCore.Manifest next = update.manifest();
        Path work = root.resolve("local/poc-updater");
        Path owned = work.resolve("installed.json");
        UpdateCore.Manifest old = UpdateCore.ownership(root);
        if (UpdateCore.compare(next.version(), old.version()) <= 0) throw new IOException("拒绝重复更新或降级");
        UpdateCore.validateDeltaBase(root, old, update); // Recheck after the game exits; it may have saved files since download.
        Path backup = work.resolve("backups/" + DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss").format(LocalDateTime.now())
            + "-" + UUID.randomUUID().toString().substring(0, 8));
        Path stage = backup.resolve("staged");
        Files.createDirectories(stage);
        LinkedHashSet<String> changes = new LinkedHashSet<>(update.payload());
        if (update.delta() == null) changes.addAll(old.files().keySet());
        else changes.addAll(update.delta().removed());
        changes.remove(UpdateCore.BASELINE); // Bootstrap ownership is immutable; installed.json supersedes it.
        Map<String, Boolean> existed = new LinkedHashMap<>();
        for (String path : changes) {
            Path target = UpdateCore.safePath(root, path);
            if (Files.exists(target) && !Files.isRegularFile(target)) throw new IOException("更新目标不是普通文件: " + path);
            existed.put(path, Files.exists(target));
        }
        // Complete extraction, per-file hashes and backup BEFORE changing any game file.
        try (ZipFile zip = new ZipFile(archive.toFile(), StandardCharsets.UTF_8)) {
            for (String path : update.payload()) {
                UpdateCore.FileInfo info = next.files().get(path);
                Path file = UpdateCore.safePath(stage, path);
                Files.createDirectories(file.getParent());
                try (InputStream in = zip.getInputStream(zip.getEntry(path)); OutputStream out = Files.newOutputStream(file)) {
                    byte[] buffer = new byte[128 * 1024];
                    long size = 0;
                    for (int n; (n = in.read(buffer)) != -1;) {
                        size += n;
                        if (size > info.size()) throw new IOException("解压文件大小异常");
                        out.write(buffer, 0, n);
                    }
                    if (size != info.size()) throw new IOException("解压文件不完整");
                }
                if (!UpdateCore.sha256(file).equalsIgnoreCase(info.sha256())) throw new IOException("文件校验失败: " + path);
            }
        }
        for (String path : changes) {
            if (existed.get(path)) {
                Path file = backup.resolve("original").resolve(path);
                Files.createDirectories(file.getParent());
                Files.copy(UpdateCore.safePath(root, path), file);
            }
        }
        UpdateCore.write(backup.resolve("restore.json"), existed);
        List<String> touched = new ArrayList<>();
        try {
            // Version metadata is committed last, so a failed update cannot claim a new version.
            changes.remove(UpdateCore.PACK);
            changes.add(UpdateCore.PACK);
            int done = 0;
            for (String path : changes) {
                if (failAfter >= 0 && done++ == failAfter) throw new IOException("Injected install failure");
                Path target = UpdateCore.safePath(root, path);
                touched.add(path);
                if (next.files().containsKey(path)) {
                    Files.createDirectories(target.getParent());
                    UpdateCore.move(stage.resolve(path), target);
                } else Files.deleteIfExists(target);
            }
            UpdateCore.write(backup.resolve("result.json"), new UpdateCore.Status(true, "Installed " + next.version()));
            UpdateCore.write(owned, next); // Final commit: no fallible writes after ownership changes.
        } catch (IOException e) {
            Collections.reverse(touched);
            for (String path : touched) {
                try {
                    Path target = UpdateCore.safePath(root, path);
                    if (existed.get(path)) Files.copy(backup.resolve("original").resolve(path), target, StandardCopyOption.REPLACE_EXISTING);
                    else Files.deleteIfExists(target);
                } catch (IOException restoreError) { e.addSuppressed(restoreError); }
            }
            UpdateCore.write(backup.resolve("result.json"), new UpdateCore.Status(false, e.toString()));
            throw e;
        }
    }

    private Installer() {}
}
