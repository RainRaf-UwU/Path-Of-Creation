package creation.cursor;

/** Owns only our cursor. Never changes input modes, positions or callbacks. */
final class CursorController {
    static final int ARROW = 0x00036001;
    record Observed(boolean compatible, boolean known, long cursor, int shape) {}
    interface NativeAccess {
        long create();
        Observed observe(long window);
        void set(long window, long cursor);
        void destroy(long cursor);
    }
    private final NativeAccess nativeAccess;
    private long handle, boundWindow, previous;
    private boolean failed;

    CursorController(NativeAccess nativeAccess) { this.nativeAccess = nativeAccess; }

    void update(long window, boolean eligible) {
        // A replaced/destroyed window must not receive a restore call.
        if (boundWindow != 0 && boundWindow != window) boundWindow = 0;
        if (window == 0) return;
        Observed observed = nativeAccess.observe(window);
        boolean foreign = observed.known && observed.cursor != 0 && observed.cursor != handle
                && observed.shape != ARROW;
        if (!eligible || !observed.compatible || foreign || failed) {
            release(window, observed);
            return;
        }
        if (handle == 0) {
            handle = nativeAccess.create();
            if (handle == 0) { failed = true; return; }
            observed=nativeAccess.observe(window);
            if(!observed.compatible || observed.known && observed.cursor!=0 && observed.cursor!=handle && observed.shape!=ARROW) return;
        }
        if (boundWindow == 0 || observed.known && observed.cursor != handle) {
            previous = observed.known && observed.cursor != handle ? observed.cursor : 0;
            boundWindow = window;
        }
        // FancyMenu resets the arrow each tick. Reapply only if it no longer owns the window.
        if (!observed.known || observed.cursor != handle) nativeAccess.set(window, handle);
    }

    private void release(long window, Observed observed) {
        if (boundWindow != window) return;
        if (observed.compatible && (!observed.known || observed.cursor == handle)) {
            nativeAccess.set(window, previous);
        }
        boundWindow = 0;
        previous = 0;
    }

    void close(long liveWindow) {
        if (liveWindow != 0) release(liveWindow, nativeAccess.observe(liveWindow));
        boundWindow = 0;
        if (handle != 0) { nativeAccess.destroy(handle); handle = 0; }
    }
}
