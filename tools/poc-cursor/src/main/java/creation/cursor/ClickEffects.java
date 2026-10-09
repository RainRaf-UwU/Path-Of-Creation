package creation.cursor;

import java.util.ArrayDeque;
import java.util.Deque;

/** Bounded cosmetic state; no game objects, input mutation, clocks or renderer state. */
final class ClickEffects {
    static final int MAX_BURSTS = 12;
    private static final int SEGMENTS = 40;
    private record Burst(float x, float y, int color, long started) {}
    interface QuadSink { void quad(float x1,float y1,float x2,float y2,float x3,float y3,float x4,float y4,int argb); }
    private final Deque<Burst> bursts = new ArrayDeque<>();
    private Object screen;
    private int width, height;

    void context(Object nextScreen, int nextWidth, int nextHeight, boolean eligible) {
        if (!eligible || nextScreen != screen || nextWidth != width || nextHeight != height) bursts.clear();
        screen = eligible ? nextScreen : null;
        width = nextWidth; height = nextHeight;
    }
    void click(double x, double y, int button, long now) {
        if (screen == null || button < 0 || button > 2 || !Double.isFinite(x) || !Double.isFinite(y)
                || x < 0 || y < 0 || x >= width || y >= height) return;
        if (bursts.size() == MAX_BURSTS) bursts.removeFirst();
        bursts.addLast(new Burst((float)x,(float)y,button == 0 ? 0x58D9EA : button == 1 ? 0x7AD9B0 : 0xE9B867,now));
    }
    void render(long now, long duration, QuadSink sink) {
        bursts.removeIf(b -> now - b.started >= duration || now < b.started);
        for (Burst b : bursts) {
            float t = (float)(now - b.started) / duration;
            float ease = 1 - (1-t)*(1-t)*(1-t), radius = 3 + 10*ease;
            int alpha = Math.round(170*(1-t)*(1-t));
            if (alpha == 0) continue;
            int argb = alpha << 24 | b.color;
            for (int i = 0; i < SEGMENTS; i++) {
                double a = Math.PI*2*i/SEGMENTS, c = Math.PI*2*(i+1)/SEGMENTS;
                float inner = radius-.35f, outer = radius+.35f;
                sink.quad(b.x+(float)Math.cos(a)*inner,b.y+(float)Math.sin(a)*inner,
                          b.x+(float)Math.cos(c)*inner,b.y+(float)Math.sin(c)*inner,
                          b.x+(float)Math.cos(c)*outer,b.y+(float)Math.sin(c)*outer,
                          b.x+(float)Math.cos(a)*outer,b.y+(float)Math.sin(a)*outer,argb);
            }
            for (int i = 0; i < 6; i++) {
                double angle = Math.PI*2*i/6 + .25;
                float x = b.x+(float)Math.cos(angle)*(radius+3), y = b.y+(float)Math.sin(angle)*(radius+3);
                float s = .65f*(1-t);
                sink.quad(x-s,y-s,x-s,y+s,x+s,y+s,x+s,y-s,argb);
            }
        }
    }
    int size() { return bursts.size(); }
}
