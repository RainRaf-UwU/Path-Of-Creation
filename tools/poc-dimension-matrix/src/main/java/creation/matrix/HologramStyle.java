package creation.matrix;

import com.google.gson.*;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/** 投影与转子共同读取同一份参数，离线预览也使用此实现。 */
public final class HologramStyle {
    private static final JsonObject DATA;
    static {
        try (var stream = HologramStyle.class.getResourceAsStream("/dimension-matrix-visual.json")) {
            if (stream == null) throw new IllegalStateException("Missing hologram style");
            DATA = JsonParser.parseReader(new InputStreamReader(stream, StandardCharsets.UTF_8)).getAsJsonObject();
            if (!DATA.get("kind").getAsString().equals("tesseract_hologram")) throw new IllegalStateException("Wrong projection schema");
        } catch (Exception error) { throw new IllegalStateException("Invalid hologram style", error); }
    }
    public static double number(String key) { return DATA.get(key).getAsDouble(); }
    public static final double MAX_SPEED = number("maxSpeedDegreesPerSecond");
    public static final double FADE_IN = number("fadeInSeconds"), FADE_OUT = number("fadeOutSeconds");
    public static final double SPIN_UP = number("spinUpSeconds"), SPIN_DOWN = number("spinDownSeconds");
    public static final double PERSPECTIVE = number("perspective"), SCALE = number("scale");
    public static final int TRAILS = (int) number("trailSamples");
    public static final double TRAIL_TIME = number("trailSeconds");
}
