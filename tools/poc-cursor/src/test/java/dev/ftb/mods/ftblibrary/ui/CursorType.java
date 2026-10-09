package dev.ftb.mods.ftblibrary.ui;

/** Test-only semantic cursor spy; no Minecraft or GLFW initialization. */
public enum CursorType {
    ARROW, IBEAM, CROSSHAIR, HAND, HRESIZE, VRESIZE, MOVE;
    public static CursorType applied;
    public static int calls;
    public static void set(CursorType cursor) { applied=cursor;calls++; }
}
