package creation.cursor;

import java.awt.image.BufferedImage;
import java.nio.ByteBuffer;
import java.util.function.Consumer;
import org.lwjgl.glfw.GLFW;
import org.lwjgl.glfw.GLFWImage;
import org.lwjgl.system.MemoryUtil;

final class GlfwCursor implements CursorController.NativeAccess {
    private final FancyCursorCompat compat;
    private final Consumer<String> warn;
    private CursorTheme theme;

    GlfwCursor(FancyCursorCompat compat, Consumer<String> warn) { this.compat = compat; this.warn = warn; }

    void theme(CursorTheme next) { theme = next; }

    @Override public long create() {
        if(theme == null || !compat.enableTickBridge()) return 0;
        ByteBuffer pixels = null;
        try {
            BufferedImage image = theme.image();
            int width = image.getWidth(), height = image.getHeight();
            pixels = MemoryUtil.memAlloc(width * height * 4);
            for (int y = 0; y < height; y++) for (int x = 0; x < width; x++) {
                int argb = image.getRGB(x, y);
                pixels.put((byte)(argb >>> 16)).put((byte)(argb >>> 8)).put((byte)argb).put((byte)(argb >>> 24));
            }
            pixels.flip();
            try (GLFWImage nativeImage = GLFWImage.malloc()) {
                nativeImage.width(width).height(height).pixels(pixels);
                long handle = GLFW.glfwCreateCursor(nativeImage, theme.hotspotX(), theme.hotspotY());
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
