package creation.cursor;

import net.neoforged.neoforge.common.ModConfigSpec;

final class CursorConfig {
    static final ModConfigSpec SPEC;
    static final ModConfigSpec.BooleanValue CURSOR, EFFECTS;
    static final ModConfigSpec.IntValue DURATION;
    static {
        ModConfigSpec.Builder b = new ModConfigSpec.Builder();
        CURSOR = b.comment("Replace ordinary GUI arrows; preserve third-party special cursors.").define("customCursor", true);
        EFFECTS = b.comment("Show cosmetic click rings. Disable for reduced motion.").define("clickEffects", true);
        DURATION = b.comment("Animation duration in milliseconds.").defineInRange("durationMs", 420, 100, 1000);
        SPEC = b.build();
    }
}
