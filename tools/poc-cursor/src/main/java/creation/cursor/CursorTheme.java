package creation.cursor;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import javax.imageio.ImageIO;

/** Resource-pack data only; no bundled fallback keeps pack deselection meaningful. */
record CursorTheme(BufferedImage image, int hotspotX, int hotspotY,
                   int leftColor, int rightColor, int middleColor) {
    static CursorTheme read(Reader metadata, InputStream texture) throws IOException {
        JsonObject json = JsonParser.parseReader(metadata).getAsJsonObject();
        BufferedImage image = ImageIO.read(texture);
        if (image == null || image.getWidth() < 1 || image.getHeight() < 1
                || image.getWidth() > 256 || image.getHeight() > 256 || !image.getColorModel().hasAlpha()) {
            throw new IOException("Cursor must be a PNG with alpha, at most 256x256");
        }
        int x = integer(json, "hotspot_x"), y = integer(json, "hotspot_y");
        if (x < 0 || y < 0 || x >= image.getWidth() || y >= image.getHeight()) {
            throw new IOException("Cursor hotspot is outside the texture");
        }
        JsonObject colors = json.getAsJsonObject("click_colors");
        return new CursorTheme(image, x, y, color(colors, "left"), color(colors, "right"), color(colors, "middle"));
    }

    private static int integer(JsonObject json, String key) throws IOException {
        String value = json.get(key).getAsString();
        if (!value.matches("-?[0-9]+")) throw new IOException("Expected integer: " + key);
        return Integer.parseInt(value);
    }

    private static int color(JsonObject colors, String key) throws IOException {
        String value = colors.get(key).getAsString();
        if (!value.matches("#[0-9a-fA-F]{6}")) throw new IOException("Expected RGB color: " + key);
        return Integer.parseInt(value.substring(1), 16);
    }
}
