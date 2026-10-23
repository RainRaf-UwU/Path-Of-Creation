package creation.matrix.jei;

import com.mojang.blaze3d.platform.InputConstants;
import mezz.jei.api.gui.inputs.*;
import net.minecraft.client.gui.navigation.ScreenRectangle;

/** 整个图纸的本地坐标输入，留出物品槽给 JEI；模拟输入不改变视角。 */
public final class BlueprintControls implements IJeiInputHandler {
    private final Blueprint plan;
    private final BlueprintView view;
    public BlueprintControls(Blueprint plan,BlueprintView view){this.plan=plan;this.view=view;}
    @Override public ScreenRectangle getArea(){return new ScreenRectangle(0,0,176,147);}
    @Override public boolean handleInput(double x,double y,IJeiUserInput input){
        var key=input.getKey();if(key.getType()!=InputConstants.Type.MOUSE)return false;
        if(inside(x,y,2,30,172,99)&&(key.getValue()==0||key.getValue()==1))return true;
        if(key.getValue()!=0)return false;
        for(int[] button:new int[][]{{4,22,0},{150,22,1},{31,22,2},{123,22,3},{57,62,4}}){
            if(!inside(x,y,button[0],132,button[1],15))continue;
            if(input.isSimulate())return true;
            switch(button[2]){
                case 0->{view.yaw-=90;view.layer=-1;}
                case 1->{view.yaw+=90;view.layer=-1;}
                case 2->view.layer=view.layer<=0?plan.height-1:view.layer-1;
                case 3->view.layer=(view.layer+1)%plan.height;
                case 4->view.reset();
            }return true;
        }return false;
    }
    @Override public boolean handleMouseScrolled(double x,double y,double horizontal,double vertical){
        if(!inside(x,y,2,30,172,99)||vertical==0)return false;view.zoom(vertical,x,y);return true;
    }
    @Override public boolean handleMouseDragged(double x,double y,InputConstants.Key key,double dx,double dy){
        if(!inside(x,y,2,30,172,99)||key.getType()!=InputConstants.Type.MOUSE)return false;
        if(key.getValue()==0&&view.layer<0){view.rotate(dx,dy);return true;}
        if(key.getValue()==1||key.getValue()==0&&view.layer>=0){view.panX+=dx;view.panY+=dy;return true;}return false;
    }
    private static boolean inside(double x,double y,int left,int top,int width,int height){return x>=left&&x<left+width&&y>=top&&y<top+height;}
}
