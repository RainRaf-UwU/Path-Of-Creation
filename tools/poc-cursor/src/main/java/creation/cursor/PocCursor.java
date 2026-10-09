package creation.cursor;

import com.mojang.logging.LogUtils;
import com.mojang.blaze3d.vertex.VertexConsumer;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.renderer.RenderType;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.EventPriority;
import net.neoforged.fml.ModContainer;
import net.neoforged.fml.common.Mod;
import net.neoforged.fml.config.ModConfig;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.client.event.InputEvent;
import net.neoforged.neoforge.client.event.RenderFrameEvent;
import net.neoforged.neoforge.client.event.ScreenEvent;
import net.neoforged.neoforge.event.GameShuttingDownEvent;
import org.lwjgl.glfw.GLFW;
import org.joml.Matrix4f;
import org.slf4j.Logger;

@Mod(value="poc_cursor", dist=Dist.CLIENT)
public final class PocCursor {
    private static final Logger LOG = LogUtils.getLogger();
    private final CursorController cursor = new CursorController(new GlfwCursor(
            new FancyCursorCompat(PocCursor.class.getClassLoader(), s -> LOG.warn("[POC Cursor] {}",s)),
            s -> LOG.warn("[POC Cursor] {}",s)));
    private final ClickEffects effects = new ClickEffects();

    public PocCursor(ModContainer container) {
        container.registerConfig(ModConfig.Type.CLIENT, CursorConfig.SPEC, "poc-cursor-client.toml");
        NeoForge.EVENT_BUS.addListener(EventPriority.LOWEST, RenderFrameEvent.Post.class, this::frame);
        NeoForge.EVENT_BUS.addListener(EventPriority.LOWEST, InputEvent.MouseButton.Pre.class, this::click);
        NeoForge.EVENT_BUS.addListener(EventPriority.LOWEST, ScreenEvent.Render.Post.class, this::render);
        NeoForge.EVENT_BUS.addListener(GameShuttingDownEvent.class, this::shutdown);
        LOG.info("[POC Cursor] Client cursor and click effects loaded (no input interception)");
    }

    private boolean eligible(Minecraft mc) {
        return mc.screen != null && mc.getOverlay() == null && mc.isWindowActive()
                && !mc.mouseHandler.isMouseGrabbed()
                && GLFW.glfwGetInputMode(mc.getWindow().getWindow(),GLFW.GLFW_CURSOR) == GLFW.GLFW_CURSOR_NORMAL;
    }

    private void context(Minecraft mc, boolean active) {
        effects.context(mc.screen,mc.getWindow().getGuiScaledWidth(),mc.getWindow().getGuiScaledHeight(),
                active && CursorConfig.EFFECTS.get());
    }

    private void frame(RenderFrameEvent.Post event) {
        Minecraft mc = Minecraft.getInstance();
        boolean active = eligible(mc);
        context(mc,active);
        cursor.update(mc.getWindow().getWindow(),active && CursorConfig.CURSOR.get());
    }

    private void click(InputEvent.MouseButton.Pre event) {
        if (event.getAction() != GLFW.GLFW_PRESS) return;
        Minecraft mc = Minecraft.getInstance();
        context(mc,eligible(mc));
        double x = mc.mouseHandler.xpos()*mc.getWindow().getGuiScaledWidth()/mc.getWindow().getScreenWidth();
        double y = mc.mouseHandler.ypos()*mc.getWindow().getGuiScaledHeight()/mc.getWindow().getScreenHeight();
        effects.click(x,y,event.getButton(),System.nanoTime());
    }

    private void render(ScreenEvent.Render.Post event) {
        Minecraft mc = Minecraft.getInstance();
        // Render only the active/top screen; background NeoForge GUI layers must not duplicate rings.
        if (event.getScreen() != mc.screen) return;
        context(mc,eligible(mc));
        if (effects.size() == 0) return;
        GuiGraphics gui = event.getGuiGraphics();
        gui.flush();
        Matrix4f matrix = new Matrix4f(gui.pose().last().pose());
        VertexConsumer vertices = gui.bufferSource().getBuffer(RenderType.gui());
        effects.render(System.nanoTime(),CursorConfig.DURATION.get()*1_000_000L,(x1,y1,x2,y2,x3,y3,x4,y4,color) -> {
            vertices.addVertex(matrix,x1,y1,500).setColor(color);
            vertices.addVertex(matrix,x2,y2,500).setColor(color);
            vertices.addVertex(matrix,x3,y3,500).setColor(color);
            vertices.addVertex(matrix,x4,y4,500).setColor(color);
        });
        gui.flush();
    }

    private void shutdown(GameShuttingDownEvent event) {
        cursor.close(Minecraft.getInstance().getWindow().getWindow());
    }
}
