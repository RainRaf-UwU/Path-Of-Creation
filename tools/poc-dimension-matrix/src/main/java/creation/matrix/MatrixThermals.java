package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.core.*;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.phys.AABB;

public final class MatrixThermals {
    public static BlockPos center(CustomMachineTile tile){return tile.getBlockPos().relative(tile.getComponentManager().facing().getOpposite(),5).above(4);}
    public static AABB interior(BlockPos center){var c=center.getCenter();return new AABB(c.x-4.5,c.y-4.5,c.z-4.5,c.x+4.5,c.y+4.5,c.z+4.5);}
    public static BlockPos modulePos(BlockPos controller,Direction front,int side,int depth){return controller.relative(front.getClockWise(),side).relative(front.getOpposite(),depth).below();}
    public static void modules(CustomMachineTile tile,boolean powered){
        var level=tile.getLevel();var front=tile.getComponentManager().facing();
        for(int side:new int[]{-2,2})for(int depth:new int[]{3,7}){
            var pos=modulePos(tile.getBlockPos(),front,side,depth);if(!level.hasChunkAt(pos))continue;
            var state=level.getBlockState(pos);
            if(state.getBlock()==MatrixMod.PROJECTOR.get()&&state.getValue(ProjectorBlock.ACTIVE)!=powered){
                level.setBlock(pos,state.setValue(ProjectorBlock.ACTIVE,powered),3);
            }
            if(powered&&state.getBlock()==MatrixMod.PROJECTOR.get())level.scheduleTick(pos,MatrixMod.PROJECTOR.get(),20);
        }
    }
    public static boolean modulePowered(Level level,BlockPos pos){
        for(var front:Direction.Plane.HORIZONTAL)for(int side:new int[]{-2,2})for(int depth:new int[]{3,7}){
            var candidate=pos.above().relative(front.getClockWise(),-side).relative(front,depth);
            if(level.hasChunkAt(candidate)&&level.getBlockEntity(candidate) instanceof CustomMachineTile tile&&MatrixState.isMatrix(tile)
                &&(((MatrixAccess)tile).matrix$getFlags()&MatrixState.POWERED)!=0)return true;
        }return false;
    }
    public static void tick(CustomMachineTile tile,boolean formed,boolean powered,boolean running){
        var level=(ServerLevel)tile.getLevel();var data=((MatrixAccess)tile).matrix$getThermal();
        double previousHeat=data.model.heat;
        int available=data.tank.getFluid().is(MatrixThermalData.COOLANTS)?data.tank.getFluidAmount():0;
        int consumed=data.model.step(formed&&running,available);
        if(consumed>0)data.tank.drain(consumed,net.neoforged.neoforge.fluids.capability.IFluidHandler.FluidAction.EXECUTE);
        if(previousHeat!=data.model.heat||consumed>0)tile.setChanged();
        if(level.getGameTime()%10==0){
            modules(tile,powered);
            level.sendBlockUpdated(tile.getBlockPos(),tile.getBlockState(),tile.getBlockState(),2);
            if(formed&&running){
                var center=center(tile);var box=interior(center);
                var source=MatrixHazards.source(level,center.getCenter());
                for(var player:level.getEntitiesOfClass(Player.class,box))MatrixHazards.damage(player,4,source);
            }
        }
        if(data.model.detonated){
            modules(tile,false);MatrixMeltdown.enqueue(level,center(tile));
            // 先持久化爆炸任务，再移除控制器，防止重复触发或继续加工。
            level.removeBlock(tile.getBlockPos(),false);
        }
    }
}
