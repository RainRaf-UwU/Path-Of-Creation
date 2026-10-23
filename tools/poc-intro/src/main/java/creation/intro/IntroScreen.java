package creation.intro;

import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.inventory.InventoryScreen;
import net.minecraft.network.chat.Component;
import net.minecraft.client.resources.language.I18n;
import org.lwjgl.glfw.GLFW;

final class IntroScreen extends Screen {
    final IntroPlayback playback;
    private long lastFrame=System.nanoTime();
    private IntroUi.Layout layout;
    final boolean chapter;
    IntroScreen(IntroStory story,boolean chinese,boolean chapter){super(Component.translatable(story.labels.get("prologue")));this.chapter=chapter;playback=new IntroPlayback(story,chinese,ClientIntro::glyph,key->I18n.get(key));}
    void resetClock(){lastFrame=System.nanoTime();}
    @Override public boolean isPauseScreen(){return false;}
    @Override public boolean shouldCloseOnEsc(){return false;}
    @Override public void onClose(){}
    @Override public void renderBackground(GuiGraphics g,int x,int y,float partial){}
    @Override public void render(GuiGraphics g,int mouseX,int mouseY,float partial){
        long now=System.nanoTime();double seconds=(now-lastFrame)/1_000_000_000.0;lastFrame=now;
        playback.tick(seconds,minecraft.isWindowActive());
        IntroUi.Canvas canvas=new IntroUi.Canvas(){
            public void rect(int x,int y,int w,int h,int c){if(w>0&&h>0)g.fill(x,y,x+w,y+h,c);}
            public void line(double x,double y,double a,double b,int c){
                int steps=Math.max(1,(int)Math.ceil(Math.max(Math.abs(a-x),Math.abs(b-y))));
                for(int i=0;i<=steps;i++){int px=(int)Math.round(x+(a-x)*i/steps),py=(int)Math.round(y+(b-y)*i/steps);g.fill(px,py,px+1,py+1,c);}
            }
            public void text(String s,int x,int y,int c){g.drawString(font,s,x,y,c,false);}
            public int width(String s){return font.width(s);}
            public void portrait(IntroUi.Box b,boolean player){
                if(player&&minecraft.player!=null){
                    // Vanilla renderer resolves the current player's real skin, model width and outer layers.
                    // The fixed negative angle looks gently toward the text on the right; it never follows the mouse.
                    var framing=PortraitFraming.fit(b,minecraft.player.getBbHeight()/minecraft.player.getScale());
                    InventoryScreen.renderEntityInInventoryFollowsAngle(g,b.x(),b.y(),b.x()+b.w(),b.y()+b.h(),
                        framing.scale(),framing.offset(),-.55f,0,minecraft.player);
                }
            }
        };
        layout=IntroUi.draw(canvas,width,height,playback,mouseX,mouseY);
    }
    @Override public boolean keyPressed(int key,int scan,int mods){
        if(layout==null)return true;
        if(key==GLFW.GLFW_KEY_UP||key==GLFW.GLFW_KEY_DOWN){
            int count=playback.node.options().size();
            if(count>0&&playback.choicesReady()){playback.selected=Math.floorMod(playback.selected+(key==GLFW.GLFW_KEY_UP?-1:1),count);ClientIntro.select();}
        }else if(key==GLFW.GLFW_KEY_SPACE||key==GLFW.GLFW_KEY_ENTER||key==GLFW.GLFW_KEY_KP_ENTER){
            if(!layout.choices().isEmpty()&&playback.choicesReady()){playback.choose(playback.selected,layout.pageCount());ClientIntro.select();}
            else playback.advance(layout.pageCount());
        }
        return true;
    }
    @Override public boolean charTyped(char c,int mods){return true;}
    @Override public boolean mouseClicked(double x,double y,int button){
        if(button!=0||layout==null)return true;
        for(int i=0;i<layout.choices().size();i++)if(layout.choices().get(i).contains(x,y)){
            if(playback.choicesReady()){playback.choose(i,layout.pageCount());ClientIntro.select();}return true;
        }
        playback.advance(layout.pageCount());return true;
    }
    @Override public void mouseMoved(double x,double y){
        if(layout==null||!playback.choicesReady())return;
        for(int i=0;i<layout.choices().size();i++)if(layout.choices().get(i).contains(x,y))playback.selected=i;
    }
    @Override public boolean mouseScrolled(double x,double y,double dx,double dy){return true;}
    @Override public boolean mouseDragged(double x,double y,int button,double dx,double dy){return true;}
}
