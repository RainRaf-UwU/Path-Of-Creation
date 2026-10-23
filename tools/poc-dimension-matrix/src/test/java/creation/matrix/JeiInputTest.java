package creation.matrix;

import com.mojang.blaze3d.platform.InputConstants;
import creation.matrix.jei.*;
import java.util.*;
import mezz.jei.api.gui.inputs.IJeiUserInput;
import mezz.jei.api.runtime.IJeiKeyMapping;
import mezz.jei.common.gui.OffsetJeiInputHandler;
import net.minecraft.client.KeyMapping;
import net.minecraft.client.gui.navigation.ScreenPosition;

public final class JeiInputTest {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    private record Click(boolean isSimulate) implements IJeiUserInput {
        public InputConstants.Key getKey(){return InputConstants.Type.MOUSE.getOrCreate(0);}
        public int getModifiers(){return 0;}
        public boolean is(KeyMapping mapping){return false;}
        public boolean is(IJeiKeyMapping mapping){return false;}
    }
    public static void main(String[] args){
        var plan=new Blueprint(List.of(List.of("ama","aaa")),Map.of('a',List.of("minecraft:stone")));
        var view=new BlueprintView();var controls=new BlueprintControls(plan,view);
        var actualJeiWrapper=new OffsetJeiInputHandler(controls,()->new ScreenPosition(40,50));
        check(actualJeiWrapper.handleInput(40+160,50+139,new Click(true)));check(view.yaw==-35);
        check(actualJeiWrapper.handleInput(40+160,50+139,new Click(false)));check(view.yaw==55);
        check(actualJeiWrapper.handleInput(40+131,50+139,new Click(false)));check(view.layer==0);
        check(actualJeiWrapper.handleMouseScrolled(40+88,50+79,0,3));check(view.zoom>1);
        double oldX=view.panX;check(actualJeiWrapper.handleMouseDragged(40+88,50+79,InputConstants.Type.MOUSE.getOrCreate(1),10,2));check(view.panX==oldX+10);
        check(!actualJeiWrapper.handleMouseScrolled(40+10,50+8,0,1));
        check(!actualJeiWrapper.handleInput(40+10,50+8,new Click(false)));
        check(actualJeiWrapper.handleInput(40+88,50+139,new Click(false)));check(view.zoom==1&&view.layer==-1&&view.panX==0&&view.yaw==-35);
        System.out.println("PASS native JEI input wrapper: page offsets / non-mutating simulation / rotate and layer buttons / zoom / pan / item-slot pass-through / reset");
    }
}
