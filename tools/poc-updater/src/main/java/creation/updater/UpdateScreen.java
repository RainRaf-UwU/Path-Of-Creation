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
        return new UpdateScreen(parent, "发现创世之径新版本", "当前版本：v" + current + "    最新版本：v" + release.version()
            + "\n\n" + (release.notes().isBlank() ? "此版本未填写更新说明。" : release.notes())
            + "\n\n选择更新后将下载更新包；下载完成后退出游戏安装，再重新启动。\n存档、按键和常见画面设置会保留。", updater, release);
    }

    static UpdateScreen message(Screen parent, String title, String text, ClientUpdater updater) {
        return new UpdateScreen(parent, title, text, updater, null);
    }

    static UpdateScreen waiting(Screen parent, ClientUpdater updater) {
        UpdateScreen screen = message(parent, "正在安装更新", "安装器正在更新整合包，请等待。\n安装结束后需要重新启动游戏。", updater);
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
            addRenderableWidget(Button.builder(Component.literal("退出游戏"), b -> minecraft.stop())
                .bounds(width / 2 - 70, y, 140, 20).build());
        } else if (downloading) {
            // The transfer runs off the render thread. The screen remains responsive.
        } else if (restart) {
            addRenderableWidget(Button.builder(Component.literal("退出并重新启动"), b -> minecraft.stop())
                .bounds(width / 2 - 80, y, 160, 20).build());
        } else if (release == null) {
            addRenderableWidget(Button.builder(Component.literal("知道了"), b -> onClose())
                .bounds(width / 2 - 70, y, 140, 20).build());
        } else if (sha != null) {
            addRenderableWidget(Button.builder(Component.literal("退出并安装"), b -> updater.install(this, release, sha))
                .bounds(left, y, panelWidth / 2 - 4, 20).build());
            addRenderableWidget(Button.builder(Component.literal("稍后再说"), b -> onClose())
                .bounds(width / 2 + 4, y, panelWidth / 2 - 4, 20).build());
        } else {
            Button update = Button.builder(Component.literal(release.download().isEmpty() ? "前往发布页" : "立即更新"), b -> {
                if (release.download().isEmpty()) Util.getPlatform().openUri(release.page());
                else {
                    downloading = true;
                    text = "正在下载创世之径 v" + release.version() + "…\n\n下载完成后可以选择退出游戏并安装。";
                    scroll = 0;
                    rebuildWidgets();
                    updater.download(this, release);
                }
            }).bounds(left, y, panelWidth / 2 - 4, 20).build();
            addRenderableWidget(update);
            addRenderableWidget(Button.builder(Component.literal("稍后再说"), b -> onClose())
                .bounds(width / 2 + 4, y, panelWidth / 2 - 4, 20).build());
            addRenderableWidget(Button.builder(Component.literal("查看发布页"), b -> Util.getPlatform().openUri(release.page()))
                .bounds(width / 2 - 65, y - 24, 130, 20).build());
        }
    }

    void progress(long bytes) { downloaded = bytes; }

    void ready(String hash) {
        downloading = false;
        sha = hash;
        text = "创世之径 v" + release.version() + " 已下载并通过校验。\n\n点击“退出并安装”后，安装器会等待游戏完全退出，再备份和替换文件。\n安装完成后请从启动器重新启动游戏。\n\n存档、截图、按键和个人添加的模组会保留。\n原文件备份保存在 local/poc-updater/backups。";
        scroll = 0;
        rebuildWidgets();
    }

    void failed(String message) {
        downloading = false;
        sha = null;
        text = "更新未完成：\n" + message + "\n\n可以重试或打开发布页手动安装。";
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
                    text = (status.success() ? "更新安装完成。" : "更新安装失败：" + status.message())
                        + "\n\n请退出当前游戏，然后从启动器重新启动。";
                    rebuildWidgets();
                }
            } catch (Exception ignored) {} // Atomic status writes may be temporarily inaccessible on Windows.
        }
    }

    @Override public void render(GuiGraphics g, int mouseX, int mouseY, float partialTick) {
        renderBackground(g, mouseX, mouseY, partialTick);
        g.fill(left, top - 4, left + panelWidth, bottom + 4, 0xE018202C);
        g.drawCenteredString(font, title, width / 2, 18, 0xFFFFFF);
        g.enableScissor(left + 8, top, left + panelWidth - 8, bottom);
        for (int i = 0; i < lines.size(); i++) {
            int y = top + (i - scroll) * (font.lineHeight + 3);
            if (y >= top && y < bottom) g.drawString(font, lines.get(i), left + 12, y, 0xE0E6EE, false);
        }
        g.disableScissor();
        if (maxScroll() > 0) g.drawCenteredString(font, "滚轮 / ↑ ↓ / PageUp PageDown 查看更新内容", width / 2, height - 66, 0xA0A8B8);
        if (downloading) g.drawCenteredString(font, String.format(Locale.ROOT, "%.1f / %.1f MiB", downloaded / 1048576.0,
            release.size() / 1048576.0), width / 2, height - 42, 0xA0E0FF);
        super.render(g, mouseX, mouseY, partialTick);
    }

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
