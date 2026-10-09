package creation.updater;

import com.mojang.logging.LogUtils;
import static creation.updater.UpdateScreen.tr;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.TitleScreen;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.fml.common.Mod;
import net.neoforged.fml.loading.FMLLoader;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import org.slf4j.Logger;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@Mod(value = "poc_updater", dist = Dist.CLIENT)
public final class ClientUpdater {
    private static final Logger LOG = LogUtils.getLogger();
    private boolean started, checked, handled;
    private Path root, work;
    private UpdateCore.Pack pack;
    private UpdateCore.Release release;
    private Set<String> seen = new HashSet<>();

    public ClientUpdater() {
        NeoForge.EVENT_BUS.addListener(this::tick);
    }

    private void tick(ClientTickEvent.Post event) {
        Minecraft mc = Minecraft.getInstance();
        if (!mc.isGameLoadFinished() || mc.getOverlay() != null) return;
        if (!started) {
            started = true;
            root = mc.gameDirectory.toPath().toAbsolutePath().normalize();
            work = root.resolve("local/poc-updater");
            try {
                pack = UpdateCore.read(root.resolve(UpdateCore.PACK), UpdateCore.Pack.class);
                UpdateCore.version(pack.version());
            } catch (Exception e) { LOG.warn("[POC Updater] Cannot read pack state", e); handled = true; return; }
            try {
                if (Files.exists(work.resolve("state.json"))) {
                    UpdateCore.State state = UpdateCore.read(work.resolve("state.json"), UpdateCore.State.class);
                    if (state.seenVersions() != null) seen.addAll(state.seenVersions());
                }
            } catch (Exception e) { LOG.warn("[POC Updater] Ignoring damaged popup state", e); }
            background(() -> {
                UpdateCore.Release latest = null;
                try { latest = UpdateCore.latest(); }
                catch (Exception e) { LOG.warn("[POC Updater] Version check failed: {}", e.getMessage()); }
                UpdateCore.Release result = latest;
                mc.execute(() -> { release = result; checked = true; });
            });
        }
        if (handled || !checked) return;
        if (!(mc.screen instanceof TitleScreen) && !(mc.level != null && mc.screen == null)) return;
        Screen parent = mc.screen;
        if (Files.exists(work.resolve("pending.json"))) {
            handled = true;
            mc.setScreen(UpdateScreen.waiting(parent, this));
            return;
        }
        try {
            Path result = work.resolve("result.json");
            if (Files.exists(result)) {
                UpdateCore.Status status = UpdateCore.read(result, UpdateCore.Status.class);
                Files.delete(result);
                if (!status.success()) {
                    handled = true;
                    mc.setScreen(UpdateScreen.message(parent, tr("poc_updater.title.failed"), tr("poc_updater.rollback", status.message()), this));
                    return;
                }
            }
            handled = true;
            UpdateCore.Popup popup = UpdateCore.popup(pack.version(), release, seen);
            if (popup == UpdateCore.Popup.UPDATE) {
                mc.setScreen(UpdateScreen.update(parent, this, release, pack.version()));
            } else if (popup == UpdateCore.Popup.CHANGELOG) {
                String notes = release != null && UpdateCore.compare(release.version(), pack.version()) == 0 && !release.notes().isBlank()
                    ? release.notes() : pack.changelog();
                mc.setScreen(UpdateScreen.message(parent, tr("poc_updater.title.changelog", pack.version()),
                    notes == null || notes.isBlank() ? tr("poc_updater.welcome", pack.version()) : notes, this));
                seen.add(UpdateCore.version(pack.version()));
                UpdateCore.write(work.resolve("state.json"), new UpdateCore.State(seen));
            }
        } catch (Exception e) { handled = true; LOG.warn("[POC Updater] Popup failed", e); }
    }

    void download(UpdateScreen screen, UpdateCore.Release target) {
        background(() -> {
            try {
                String sha = UpdateCore.prepare(root, target, work.resolve("update.zip"), FMLLoader.versionInfo().mcVersion(),
                    FMLLoader.versionInfo().neoForgeVersion(), screen::progress,
                    selected -> Minecraft.getInstance().execute(() -> screen.transfer(selected)));
                Minecraft.getInstance().execute(() -> screen.ready(sha));
            } catch (Exception e) {
                LOG.warn("[POC Updater] Download failed", e);
                Minecraft.getInstance().execute(() -> screen.failed(e.getMessage()));
            }
        });
    }

    void install(UpdateScreen screen, UpdateCore.Release target, String sha) {
        try {
            Path helper = work.resolve("installer.jar");
            Files.createDirectories(work);
            try (InputStream in = ClientUpdater.class.getResourceAsStream("/poc-updater-helper.jar")) {
                if (in == null) throw new IOException(tr("poc_updater.helper_missing"));
                Files.copy(in, helper, StandardCopyOption.REPLACE_EXISTING);
            }
            String javaName = System.getProperty("os.name").toLowerCase(Locale.ROOT).contains("win") ? "javaw.exe" : "java";
            Path java = Path.of(System.getProperty("java.home"), "bin", javaName);
            UpdateCore.write(work.resolve("pending.json"), new UpdateCore.Job(ProcessHandle.current().pid(), target.version(), sha,
                FMLLoader.versionInfo().mcVersion(), FMLLoader.versionInfo().neoForgeVersion()));
            Process process = new ProcessBuilder(java.toString(), "-jar", helper.toString(), root.toString())
                .directory(root.toFile()).redirectErrorStream(true).redirectOutput(work.resolve("install.log").toFile()).start();
            UpdateCore.write(work.resolve("installer-pid.json"), process.pid());
            Minecraft.getInstance().stop();
        } catch (Exception e) {
            try { Files.deleteIfExists(work.resolve("pending.json")); } catch (IOException ignored) {}
            screen.failed(tr("poc_updater.helper_failed", e.getMessage()));
            LOG.warn("[POC Updater] Cannot start installer", e);
        }
    }

    UpdateCore.Status pendingResult() throws IOException {
        if (Files.exists(work.resolve("pending.json"))) {
            Path pidFile = work.resolve("installer-pid.json");
            if (Files.exists(pidFile)) {
                long pid = UpdateCore.read(pidFile, Long.class);
                if (ProcessHandle.of(pid).map(ProcessHandle::isAlive).orElse(false)) return null;
            }
            return new UpdateCore.Status(false, tr("poc_updater.helper_stopped"));
        }
        Path result = work.resolve("result.json");
        return Files.exists(result) ? UpdateCore.read(result, UpdateCore.Status.class) : new UpdateCore.Status(false, tr("poc_updater.no_result"));
    }

    private static void background(Runnable task) {
        Thread thread = new Thread(task, "POC-Updater");
        thread.setDaemon(true);
        thread.start();
    }
}
