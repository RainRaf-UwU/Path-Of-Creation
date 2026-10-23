package creation.intro;
import java.util.*;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import org.lwjgl.glfw.GLFW;

/** Inspects the original installed-mod illustrations, without entering a world machine UI. */
final class ManualImageScreen extends Screen {
    private final Screen parent;private final List<ManualData.Picture> pictures;private final boolean cn;private int index;
    private double zoom=1,panX,panY;
    ManualImageScreen(Screen parent,List<ManualData.Picture> pictures,boolean cn){super(Component.literal("Machine illustration"));this.parent=parent;this.pictures=List.copyOf(pictures);this.cn=cn;}
    @Override public boolean isPauseScreen(){return false;}
    @Override public void renderBackground(GuiGraphics g,int x,int y,float p){}
    @Override public void onClose(){minecraft.setScreen(parent);}
    static void image(GuiGraphics g,ManualData.Picture p,ManualUi.Box box){
        g.blit(ResourceLocation.parse(p.resource()),box.x(),box.y(),box.w(),box.h(),0,0,p.width(),p.height(),p.width(),p.height());
    }
    @Override public void render(GuiGraphics g,int mx,int my,float partial){
        g.fill(0,0,width,height,ManualUi.BG);var p=pictures.get(index);
        double scale=Math.min((double)(width-24)/p.width(),(double)(height-64)/p.height())*zoom;
        int iw=Math.max(1,(int)(p.width()*scale)),ih=Math.max(1,(int)(p.height()*scale));
        g.enableScissor(6,28,width-6,height-28);image(g,p,new ManualUi.Box((int)((width-iw)*.5+panX),(int)((height-ih)*.5+panY),iw,ih));g.disableScissor();
        g.drawString(font,ManualUi.fit(new Metrics(),p.caption()+" · "+p.credit(),width-58),12,10,ManualUi.GOLD,false);
        g.drawString(font,(index+1)+"/"+pictures.size(),width-40,10,ManualUi.CYAN,false);
        g.drawString(font,cn?"滚轮缩放 · 拖动平移 · ← → 换图 · Esc 返回":"Wheel zoom · Drag pan · ← → · Esc back",12,height-16,ManualUi.MUTED,false);
    }
    @Override public boolean mouseScrolled(double x,double y,double dx,double dy){zoom=Math.clamp(zoom*Math.pow(1.2,dy),.5,6);return true;}
    @Override public boolean mouseDragged(double x,double y,int button,double dx,double dy){if(button==0){panX+=dx;panY+=dy;return true;}return false;}
    @Override public boolean keyPressed(int key,int scan,int mods){if(key==GLFW.GLFW_KEY_LEFT||key==GLFW.GLFW_KEY_RIGHT){index=Math.floorMod(index+(key==GLFW.GLFW_KEY_LEFT?-1:1),pictures.size());zoom=1;panX=panY=0;return true;}return super.keyPressed(key,scan,mods);}
    private final class Metrics implements ManualUi.Canvas{
        public void rect(int x,int y,int w,int h,int c){}public void text(String s,int x,int y,int c){}public int width(String s){return font.width(s);}public void clip(ManualUi.Box b){}public void unclip(){}public void item(String id,int x,int y){}
    }
}
