package creation.cursor;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.function.Consumer;

/** Optional public FTB Library API adapter. Never changes its selection state. */
final class FtbCursorCompat {
    record Selection(boolean compatible, Object special) {}
    private Class<?> wrapper;
    private Field selected;
    private Method set;
    private boolean broken;
    private final Consumer<String> warn;

    FtbCursorCompat(ClassLoader loader, Consumer<String> warn) {
        this.warn=warn;
        try {
            wrapper=Class.forName("dev.ftb.mods.ftblibrary.ui.IScreenWrapper",false,loader);
            Class<?> type=Class.forName("dev.ftb.mods.ftblibrary.ui.CursorType",false,loader);
            selected=Class.forName("dev.ftb.mods.ftblibrary.FTBLibraryClient",false,loader).getField("lastCursorType");
            set=type.getMethod("set",type);
        }catch(ClassNotFoundException absent) {
            if(wrapper!=null) fail(absent);
        }catch(ReflectiveOperationException | RuntimeException | LinkageError failure) { fail(failure); }
    }

    Selection selection(Object screen) {
        if(wrapper==null || !wrapper.isInstance(screen)) return new Selection(true,null);
        if(broken) return new Selection(false,null);
        try {
            Object cursor=selected.get(null);
            return new Selection(true,cursor==null || ((Enum<?>)cursor).name().equals("ARROW") ? null : cursor);
        }catch(ReflectiveOperationException | RuntimeException | LinkageError failure) {
            fail(failure);return new Selection(false,null);
        }
    }

    void apply(Selection selection) {
        if(broken || selection.special()==null) return;
        try { set.invoke(null,selection.special()); }
        catch(ReflectiveOperationException | RuntimeException | LinkageError failure) { fail(failure); }
    }

    private void fail(Throwable error) {
        if(!broken) warn.accept("FTB cursor API unavailable; keeping its cursor: "+error.getClass().getSimpleName());
        broken=true;
    }
}
