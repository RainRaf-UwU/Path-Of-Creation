package creation.updater;

import net.minecraft.Util;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.util.FormattedCharSequence;
import java.util.*;

/** Uses Minecraft's native screen, buttons, font, scaling and keyboard handling. */
final class UpdateScreen extends Screen {
    private final Screen parent;
    private final ClientUpdater updater;
    private final UpdateCore.Release release;
    private String text, sha;
    private boolean downloading, waiting, restart;
    private int left, panelWidth, top, bottom, scroll, polls;
    private volatile long downloaded;
    private List<FormattedCharSequence> lines = List.of();

    static UpdateScreen update(Screen parent, ClientUpdater updater, UpdateCore.Release release, String current) {
        return new UpdateScreen(parent, tr("poc_updater.title.update"), tr("poc_updater.versions", current, release.version())
            + "\n\n" + (release.notes().isBlank() ? tr("poc_updater.no_notes") : release.notes())
            + tr("poc_updater.instructions"), updater, release);
    }

    static UpdateScreen message(Screen parent, String title, String text, ClientUpdater updater) {
        return new UpdateScreen(parent, title, text, updater, null);
    }

    static UpdateScreen waiting(Screen parent, ClientUpdater updater) {
        UpdateScreen screen = message(parent, tr("poc_updater.title.installing"), tr("poc_updater.installing"), updater);
        screen.waiting = true;
        return screen;
    }

    private UpdateScreen(Screen parent, String title, String text, ClientUpdater updater, UpdateCore.Release release) {
        super(Component.literal(title));
        this.parent = parent;
        this.text = text;
        this.updater = updater;
        this.release = release;
    }

    @Override protected void init() {
        panelWidth = Math.min(460, width - 24);
        left = (width - panelWidth) / 2;
        top = 44;
        bottom = height - 76;
        lines = font.split(Component.literal(text), panelWidth - 24);
        scroll = Math.min(scroll, maxScroll());
        int y = height - 32;
        if (waiting) {
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.quit"), b -> minecraft.stop())
                .bounds(width / 2 - 70, y, 140, 20).build());
        } else if (downloading) {
            // The transfer runs off the render thread. The screen remains responsive.
        } else if (restart) {
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.restart"), b -> minecraft.stop())
                .bounds(width / 2 - 80, y, 160, 20).build());
        } else if (release == null) {
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.ok"), b -> onClose())
                .bounds(width / 2 - 70, y, 140, 20).build());
        } else if (sha != null) {
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.install"), b -> updater.install(this, release, sha))
                .bounds(left, y, panelWidth / 2 - 4, 20).build());
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.later"), b -> onClose())
                .bounds(width / 2 + 4, y, panelWidth / 2 - 4, 20).build());
        } else {
            Button update = Button.builder(Component.translatable(release.download().isEmpty() ? "poc_updater.button.release" : "poc_updater.button.update"), b -> {
                if (release.download().isEmpty()) Util.getPlatform().openUri(release.page());
                else {
                    downloading = true;
                    text = tr("poc_updater.downloading", release.version());
                    scroll = 0;
                    rebuildWidgets();
                    updater.download(this, release);
                }
            }).bounds(left, y, panelWidth / 2 - 4, 20).build();
            addRenderableWidget(update);
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.later"), b -> onClose())
                .bounds(width / 2 + 4, y, panelWidth / 2 - 4, 20).build());
            addRenderableWidget(Button.builder(Component.translatable("poc_updater.button.view_release"), b -> Util.getPlatform().openUri(release.page()))
                .bounds(width / 2 - 65, y - 24, 130, 20).build());
        }
    }

    void progress(long bytes) { downloaded = bytes; }

    void ready(String hash) {
        downloading = false;
        sha = hash;
        text = tr("poc_updater.ready", release.version());
        scroll = 0;
        rebuildWidgets();
    }

    void failed(String message) {
        downloading = false;
        sha = null;
        text = tr("poc_updater.failed", message);
        scroll = 0;
        rebuildWidgets();
    }

    @Override public void tick() {
        if (waiting && ++polls % 20 == 0) {
            try {
                UpdateCore.Status status = updater.pendingResult();
                if (status != null) {
                    waiting = false;
                    restart = true; // This JVM may already have loaded the old JARs.
                    text = (status.success() ? tr("poc_updater.installed") : tr("poc_updater.install_failed", status.message()))
                        + tr("poc_updater.restart_instructions");
                    rebuildWidgets();
                }
            } catch (Exception ignored) {} // Atomic status writes may be temporarily inaccessible on Windows.
        }
    }

    @Override public void render(GuiGraphics g, int mouseX, int mouseY, float partialTick) {
        // Screen.render blurs the background before drawing widgets. Run it once,
        // before our foreground, so the title and changelog stay sharp.
        super.render(g, mouseX, mouseY, partialTick);
        g.fill(left, top - 4, left + panelWidth, bottom + 4, 0xE018202C);
        g.drawCenteredString(font, title, width / 2, 18, 0xFFFFFF);
        g.enableScissor(left + 8, top, left + panelWidth - 8, bottom);
        for (int i = 0; i < lines.size(); i++) {
            int y = top + (i - scroll) * (font.lineHeight + 3);
            if (y >= top && y < bottom) g.drawString(font, lines.get(i), left + 12, y, 0xE0E6EE, false);
        }
        g.disableScissor();
        if (maxScroll() > 0) g.drawCenteredString(font, tr("poc_updater.scroll_hint"), width / 2, height - 66, 0xA0A8B8);
        if (downloading) g.drawCenteredString(font, String.format(Locale.ROOT, "%.1f / %.1f MiB", downloaded / 1048576.0,
            release.size() / 1048576.0), width / 2, height - 42, 0xA0E0FF);
    }

    static String tr(String key, Object... args) { return Component.translatable(key, args).getString(); }

    private int maxScroll() { return Math.max(0, lines.size() - Math.max(1, (bottom - top) / (font.lineHeight + 3))); }

    @Override public boolean mouseScrolled(double x, double y, double dx, double dy) {
        scroll = Math.max(0, Math.min(maxScroll(), scroll - (int) Math.signum(dy) * 3));
        return true;
    }

    @Override public boolean keyPressed(int key, int scan, int modifiers) {
        if (key == 264 || key == 265 || key == 266 || key == 267) {
            int amount = key == 264 ? 1 : key == 265 ? -1 : key == 266 ? -8 : 8;
            scroll = Math.max(0, Math.min(maxScroll(), scroll + amount));
            return true;
        }
        return super.keyPressed(key, scan, modifiers);
    }

    @Override public boolean shouldCloseOnEsc() { return !downloading && !waiting && !restart; }
    @Override public void onClose() { if (shouldCloseOnEsc()) Minecraft.getInstance().setScreen(parent); }
}
