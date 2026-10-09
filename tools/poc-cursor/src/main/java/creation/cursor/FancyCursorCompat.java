package creation.cursor;

import java.lang.reflect.Method;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

/** Optional tick observer, with no hard dependency on FancyMenu or Minecraft. */
final class FancyCursorCompat {
    private Method active, shape, changed;
    private boolean present, broken;
    private final Consumer<String> warn;
    private final ClassLoader loader;
    private Object selection;
    private Field rawCursor, customCursor;
    private final Map<Long,Integer> standardShapes=new HashMap<>();
    private long normalCursor, mirroredCursor;
    private long observedWindow;
    private boolean bridgeReady;

    FancyCursorCompat(ClassLoader loader, Consumer<String> warn) {
        this.warn = warn;
        this.loader = loader;
        try {
            Class<?> tracker = Class.forName(
                    "de.keksuccino.fancymenu.util.rendering.ui.cursor.GlfwCursorTracker", false, loader);
            present = true;
            active = tracker.getMethod("getActiveCursor", long.class);
            shape = tracker.getMethod("getStandardCursorShape", long.class);
            changed = tracker.getMethod("onGlfwSetCursor", long.class, long.class);
        } catch (ClassNotFoundException absent) {
            // An older FancyMenu may lack the tracker. Yield instead of fighting its cursor.
            try {
                Class.forName("de.keksuccino.fancymenu.FancyMenu", false, loader);
                breakCompat(absent);
            } catch (ClassNotFoundException noFancyMenu) {
                // Standalone operation when FancyMenu is absent.
            } catch (LinkageError failure) { breakCompat(failure); }
        } catch (ReflectiveOperationException | LinkageError failure) { breakCompat(failure); }
    }

    CursorController.Observed observe(long window) {
        observedWindow=window;
        if (broken) return new CursorController.Observed(false, false, 0, -1);
        if (!present) return new CursorController.Observed(true, false, 0, CursorController.ARROW);
        if (bridgeReady) return new CursorController.Observed(true,true,mirroredCursor,
                mirroredCursor==0 ? CursorController.ARROW : standardShapes.getOrDefault(mirroredCursor,-1));
        try {
            long cursor = (Long) active.invoke(null, window);
            int standard = cursor == 0 ? CursorController.ARROW : (Integer) shape.invoke(null, cursor);
            return new CursorController.Observed(true, cursor >= 0, cursor, standard);
        } catch (ReflectiveOperationException | LinkageError failure) {
            breakCompat(failure);
            return new CursorController.Observed(false, false, 0, -1);
        }
    }

    void changed(long window, long cursor) {
        if(bridgeReady) mirroredCursor=cursor;
        if (!present || broken) return;
        try { changed.invoke(null, window, cursor); }
        catch (ReflectiveOperationException | LinkageError failure) { breakCompat(failure); }
    }

    /** GLFW lives in the bootstrap layer, where FancyMenu's tracker Mixin may not run.
     * Mirror its real tick selection before it is consumed, without modifying the queue. */
    boolean enableTickBridge() {
        if(!present) return !broken;
        if(bridgeReady) return true;
        if(broken) return false;
        try {
            Class<?> handler=Class.forName("de.keksuccino.fancymenu.util.rendering.ui.cursor.CursorHandler",true,loader);
            Field queue=handler.getDeclaredField("CLIENT_TICK_CURSOR");queue.setAccessible(true);selection=queue.get(null);
            rawCursor=selection.getClass().getDeclaredField("rawCursor");rawCursor.setAccessible(true);
            customCursor=selection.getClass().getDeclaredField("customCursor");customCursor.setAccessible(true);
            for(Field field:handler.getFields()) {
                if(field.getType()==long.class && field.getName().startsWith("CURSOR_")) {
                    long id=field.getLong(null);
                    standardShapes.put(id,field.getName().equals("CURSOR_NORMAL") ? CursorController.ARROW : 0);
                }
            }
            normalCursor=handler.getField("CURSOR_NORMAL").getLong(null);
            mirroredCursor=normalCursor;
            Class<?> busClass=Class.forName("de.keksuccino.fancymenu.util.event.acara.EventHandler",true,loader);
            Object bus=busClass.getField("INSTANCE").get(null);
            Class<?> tick=Class.forName("de.keksuccino.fancymenu.events.ticking.ClientTickEvent$Pre",false,loader);
            Consumer<Object> observer=e->beforeFancyTick();
            busClass.getMethod("registerListener",Consumer.class,Class.class,int.class).invoke(bus,observer,tick,Integer.MAX_VALUE);
            Consumer<Object> after=e->{if(!broken && observedWindow!=0) changed(observedWindow,mirroredCursor);};
            busClass.getMethod("registerListener",Consumer.class,Class.class,int.class).invoke(bus,after,tick,Integer.MIN_VALUE);
            bridgeReady=true;
            beforeFancyTick();
            return !broken;
        } catch(ReflectiveOperationException | RuntimeException | LinkageError failure) {
            breakCompat(failure);return false;
        }
    }

    private void beforeFancyTick() {
        if(broken) return;
        try {
            synchronized(selection) {
                Object custom=customCursor.get(selection);
                long raw=rawCursor.getLong(selection);
                if(custom!=null) {
                    if((Boolean)custom.getClass().getMethod("isUsable").invoke(custom)) {
                        mirroredCursor=custom.getClass().getField("id_long").getLong(custom);
                    }
                } else if(raw>=0) mirroredCursor=raw;
                else if(raw==-1) mirroredCursor=normalCursor;
                // -2 means FancyMenu will make no native cursor change this tick.
            }
        }catch(ReflectiveOperationException | RuntimeException | LinkageError failure) {breakCompat(failure);}
    }

    private void breakCompat(Throwable error) {
        broken = true;
        warn.accept("FancyMenu cursor API unavailable; keeping its cursor: " + error.getClass().getSimpleName());
    }
}
