package creation.matrix;

import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;

/** 玩家站在互动面前看向控制器：左=正面朝向的顺时针，右=逆时针。 */
public final class PortLayout {
    public static final int RATE = 1_000_000;
    private PortLayout() { }
    public static Direction outward(Direction front, boolean input) {
        return input ? front.getClockWise() : front.getCounterClockWise();
    }
    public static BlockPos offset(Direction front, boolean input, int depth, int height) {
        var side = outward(front,input);
        return new BlockPos(side.getStepX()*5-front.getStepX()*depth,height,
            side.getStepZ()*5-front.getStepZ()*depth);
    }
    public static boolean accepts(Direction front, boolean input, int x, int y, int z) {
        if (!front.getAxis().isHorizontal() || y<0 || y>8) return false;
        var side=outward(front,input);
        int across=x*side.getStepX()+z*side.getStepZ();
        int depth=-x*front.getStepX()-z*front.getStepZ();
        return across==5 && depth>=1 && depth<=9;
    }
}
