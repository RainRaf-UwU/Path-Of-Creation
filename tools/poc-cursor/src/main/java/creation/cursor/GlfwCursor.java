package creation.cursor;

import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.function.Consumer;
import javax.imageio.ImageIO;
import org.lwjgl.glfw.GLFW;
import org.lwjgl.glfw.GLFWImage;
import org.lwjgl.system.MemoryUtil;

final class GlfwCursor implements CursorController.NativeAccess {
    private final FancyCursorCompat compat;
    private final Consumer<String> warn;

    GlfwCursor(FancyCursorCompat compat, Consumer<String> warn) { this.compat = compat; this.warn = warn; }

    @Override public long create() {
        if(!compat.enableTickBridge()) return 0;
        ByteBuffer pixels = null;
        try (InputStream stream = GlfwCursor.class.getResourceAsStream("/assets/poc_cursor/textures/cursor.png")) {
            if (stream == null) throw new IllegalStateException("Missing cursor texture");
            BufferedImage image = ImageIO.read(stream);
            if (image == null || image.getWidth() != 48 || image.getHeight() != 48) {
                throw new IllegalStateException("Cursor must be 48x48 RGBA");
            }
            pixels = MemoryUtil.memAlloc(48 * 48 * 4);
            for (int y = 0; y < 48; y++) for (int x = 0; x < 48; x++) {
                int argb = image.getRGB(x, y);
                pixels.put((byte)(argb >>> 16)).put((byte)(argb >>> 8)).put((byte)argb).put((byte)(argb >>> 24));
            }
            pixels.flip();
            try (GLFWImage nativeImage = GLFWImage.malloc()) {
                nativeImage.width(48).height(48).pixels(pixels);
                // Star Core is centered on its bright pixel, rather than an arrow tip.
                long handle = GLFW.glfwCreateCursor(nativeImage, 24, 24);
                if (handle == 0) warn.accept("Native cursor creation failed; using the existing cursor");
                return handle;
            }
        } catch (Exception | LinkageError failure) {
            warn.accept("Cursor unavailable; using the existing cursor: " + failure.getClass().getSimpleName());
            return 0;
        } finally { if (pixels != null) MemoryUtil.memFree(pixels); }
    }

    @Override public CursorController.Observed observe(long window) { return compat.observe(window); }
    @Override public void set(long window, long cursor) {
        GLFW.glfwSetCursor(window, cursor);
        // Mirrors the successful native call; harmless when FancyMenu's GLFW hook also reports it.
        compat.changed(window, cursor);
    }
    @Override public void destroy(long cursor) { GLFW.glfwDestroyCursor(cursor); }
}
