package creation.cursor;

import java.net.URLClassLoader;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public final class CursorTest {
    static class Fake implements CursorController.NativeAccess {
        long current, created=77;
        int shape=CursorController.ARROW, creates, destroys;
        boolean compatible=true;
        List<Long> sets = new ArrayList<>();
        @Override public long create() { creates++; return created; }
        @Override public CursorController.Observed observe(long window) {
            return new CursorController.Observed(compatible,true,current,shape);
        }
        @Override public void set(long window,long cursor) { current=cursor; sets.add(cursor); }
        @Override public void destroy(long cursor) { assert cursor == 77; destroys++; }
    }
    public static void main(String[] args) throws Exception {
        Fake n=new Fake(); CursorController c=new CursorController(n);
        c.update(1,false); assert n.creates==0 && n.sets.isEmpty();
        c.update(1,true); c.update(1,true); assert n.creates==1 && n.sets.equals(List.of(77L,77L));
        // A FancyMenu text cursor takes ownership: do not reset or destroy it.
        n.current=90; n.shape=0x36002; c.update(1,true); assert n.sets.size()==2;
        assert !c.allowsAlternative(1);
        c.update(1,false); assert n.sets.size()==2;
        n.current=91; n.shape=CursorController.ARROW; c.update(1,true);
        c.update(1,false); assert n.current==91 && n.creates==1;
        // Custom PNG cursors are unknown standard shapes and must also win.
        n.current=100; n.shape=-1; c.update(1,true); assert n.current==100;
        // Shutdown restores only our own cursor and destroys only our own handle, once.
        n.current=0; n.shape=CursorController.ARROW; c.update(1,true); c.close(1); c.close(1);
        assert n.current==0 && n.destroys==1;
        Fake fail=new Fake(); fail.created=0; CursorController failed=new CursorController(fail);
        for(int i=0;i<100;i++) failed.update(1,true);
        assert fail.creates==1 && fail.sets.isEmpty() && fail.destroys==0;
        Fake broken=new Fake(); broken.compatible=false;
        new CursorController(broken).update(1,true); assert broken.creates==0;
        List<String> oldWarnings=new ArrayList<>();
        Path temp=java.nio.file.Files.createTempDirectory("poc-old-cursor-api");
        Path marker=temp.resolve("de/keksuccino/fancymenu/FancyMenu.java");
        java.nio.file.Files.createDirectories(marker.getParent());
        java.nio.file.Files.writeString(marker,"package de.keksuccino.fancymenu; public class FancyMenu {}");
        assert javax.tools.ToolProvider.getSystemJavaCompiler().run(null,null,null,"-d",temp.toString(),marker.toString())==0;
        try(URLClassLoader oldApi=new URLClassLoader(new java.net.URL[]{temp.toUri().toURL()},null)) {
            FancyCursorCompat oldCompat=new FancyCursorCompat(oldApi,oldWarnings::add);
            assert !oldCompat.observe(1).compatible() && oldWarnings.size()==1;
        }
        java.nio.file.Files.delete(marker);java.nio.file.Files.delete(marker.resolveSibling("FancyMenu.class"));
        java.nio.file.Files.delete(marker.getParent());java.nio.file.Files.delete(temp.resolve("de/keksuccino"));
        java.nio.file.Files.delete(temp.resolve("de"));java.nio.file.Files.delete(temp);
        Fake swapped=new Fake(); CursorController windows=new CursorController(swapped);
        windows.update(1,true); swapped.current=0; windows.update(2,false);
        assert swapped.sets.size()==1; windows.close(2); assert swapped.destroys==1;

        // FTB's onClosed() sets native cursor 0 without updating the bootstrap tracker.
        // Repeat the chapter reset while the observed handle remains our cached handle.
        long[] actual={0};
        Fake stale=new Fake() {
            @Override public void set(long w,long v) { super.set(w,v);actual[0]=v; }
        };
        CursorController chapters=new CursorController(stale);
        chapters.update(1,true);
        for(int i=0;i<100;i++) {
            actual[0]=0;
            assert stale.current==77;
            chapters.update(1,true);
            assert actual[0]==77 && stale.creates==1;
        }
        assert chapters.allowsAlternative(1);
        chapters.update(1,false);assert actual[0]==0;
        chapters.close(1);assert stale.destroys==1;

        List<String> ftbWarnings=new ArrayList<>();
        FtbCursorCompat ftb=new FtbCursorCompat(CursorTest.class.getClassLoader(),ftbWarnings::add);
        Object taskScreen=new dev.ftb.mods.ftblibrary.ui.IScreenWrapper() {};
        assert ftb.selection(new Object()).special()==null;
        assert ftb.selection(taskScreen).special()==null;
        for(var type:dev.ftb.mods.ftblibrary.ui.CursorType.values()) {
            dev.ftb.mods.ftblibrary.FTBLibraryClient.lastCursorType=type;
            var selection=ftb.selection(taskScreen);
            assert selection.compatible();
            if(type==dev.ftb.mods.ftblibrary.ui.CursorType.ARROW) assert selection.special()==null;
            else {
                assert selection.special()==type;
                ftb.apply(selection);
                assert dev.ftb.mods.ftblibrary.ui.CursorType.applied==type;
            }
            assert dev.ftb.mods.ftblibrary.FTBLibraryClient.lastCursorType==type;
        }
        dev.ftb.mods.ftblibrary.FTBLibraryClient.lastCursorType=null;
        assert ftb.selection(taskScreen).special()==null;
        assert dev.ftb.mods.ftblibrary.ui.CursorType.calls==6 && ftbWarnings.isEmpty();
        FtbCursorCompat absentFtb=new FtbCursorCompat(new ClassLoader(null) {},ftbWarnings::add);
        assert absentFtb.selection(taskScreen).compatible() && ftbWarnings.isEmpty();

        Object screen=new Object(); ClickEffects effects=new ClickEffects(); long start=1000;
        effects.context(screen,320,200,true);
        effects.click(Double.NaN,2,0,start); effects.click(320,2,0,start); effects.click(2,2,4,start);
        assert effects.size()==0;
        for(int i=0;i<10000;i++) effects.click(160,100,i%3,start+i);
        assert effects.size()==12;
        final int[] quads={0};
        effects.render(start+10000,420_000_000L,(x1,y1,x2,y2,x3,y3,x4,y4,col)->{
            quads[0]++; assert Float.isFinite(x1) && (col>>>24)<=170;
            // RenderType.gui() culls back faces. Match GuiGraphics.fill() in GUI coordinates.
            float area=x1*y2-x2*y1+x2*y3-x3*y2+x3*y4-x4*y3+x4*y1-x1*y4;
            assert area<0 : "GUI quad winding must remain visible with culling enabled";
        });
        assert quads[0]==12*46;
        effects.render(start+430_000_000L,420_000_000L,(a,b,d,e,f,g,h,i,j)->{throw new AssertionError("Expired animation");});
        assert effects.size()==0;
        effects.click(160,100,0,start); effects.context(screen,640,400,true); assert effects.size()==0;
        effects.click(160,100,0,start); effects.context(new Object(),640,400,true); assert effects.size()==0;
        effects.click(160,100,0,start); effects.context(screen,640,400,false); assert effects.size()==0;
        // Validate the actual installed FancyMenu public API, without loading Minecraft.
        try(URLClassLoader loader=new URLClassLoader(new java.net.URL[]{Path.of(args[0]).toUri().toURL()},CursorTest.class.getClassLoader())) {
            List<String> warnings=new ArrayList<>(); FancyCursorCompat compat=new FancyCursorCompat(loader,warnings::add);
            Class<?> tracker=Class.forName("de.keksuccino.fancymenu.util.rendering.ui.cursor.GlfwCursorTracker",true,loader);
            tracker.getMethod("onGlfwCreateStandardCursor",int.class,long.class).invoke(null,CursorController.ARROW,5L);
            compat.changed(55,5); assert compat.observe(55).cursor()==5 && compat.observe(55).shape()==CursorController.ARROW;
            compat.changed(55,99); assert compat.observe(55).cursor()==99 && compat.observe(55).shape()==-1;
            assert warnings.isEmpty();
            Fake api=new Fake() {
                @Override public CursorController.Observed observe(long w) { return compat.observe(w); }
                @Override public void set(long w,long v) { super.set(w,v); compat.changed(w,v); }
            };
            CursorController realApi=new CursorController(api);
            realApi.update(55,true); assert api.creates==0; // Custom cursor wins.
            compat.changed(55,5); realApi.update(55,true); realApi.update(55,false);
            assert compat.observe(55).cursor()==5 && api.creates==1;
            realApi.close(55);
        }
        System.out.println("PASS: lifecycle, third-party cursors, failure fallback, screen/scale transitions, 100 untracked chapter resets, 10000-click bound, animation expiry, installed FancyMenu API");
    }
}
