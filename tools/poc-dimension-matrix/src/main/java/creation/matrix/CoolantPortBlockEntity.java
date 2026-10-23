package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.core.*;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.state.BlockState;
import net.neoforged.neoforge.fluids.FluidStack;
import net.neoforged.neoforge.fluids.capability.IFluidHandler;

public final class CoolantPortBlockEntity extends BlockEntity {
    private BlockPos controller;
    private Direction outward;
    private final IFluidHandler[] views=new IFluidHandler[7];
    public CoolantPortBlockEntity(BlockPos pos,BlockState state){super(MatrixMod.COOLANT_ENTITY.get(),pos,state);for(int i=0;i<7;i++)views[i]=new View(i==6?null:Direction.from3DDataValue(i));}
    public static BlockPos offset(Direction front,int across,int height){return BlockPos.ZERO.relative(front.getOpposite(),10).relative(front.getClockWise(),across).above(height);}
    private CustomMachineTile owner(){
        if(isRemoved()||level==null||level.isClientSide||controller==null||!level.hasChunkAt(controller))return null;
        if(!(level.getBlockEntity(controller) instanceof CustomMachineTile tile)||tile.isRemoved()||!MatrixState.isMatrix(tile))return null;
        var front=tile.getComponentManager().facing();
        int dx=worldPosition.getX()-controller.getX(),dy=worldPosition.getY()-controller.getY(),dz=worldPosition.getZ()-controller.getZ();
        int depth=-(dx*front.getStepX()+dz*front.getStepZ()),across=dx*front.getClockWise().getStepX()+dz*front.getClockWise().getStepZ();
        return depth==10&&dy>=0&&dy<=8&&Math.abs(across)<=4&&outward==front.getOpposite()&&MatrixPorts.operational(tile)?tile:null;
    }
    public void bind(CustomMachineTile tile){
        if(controller!=null&&!controller.equals(tile.getBlockPos())&&owner()!=null)return;
        var side=tile.getComponentManager().facing().getOpposite();
        if(!tile.getBlockPos().equals(controller)||outward!=side){controller=tile.getBlockPos().immutable();outward=side;level.invalidateCapabilities(worldPosition);}
    }
    public IFluidHandler capability(Direction side){return side!=null&&outward!=null&&side!=outward?null:views[side==null?6:side.get3DDataValue()];}
    public static void tick(Level level,BlockPos pos,BlockState state,CoolantPortBlockEntity port){
        boolean active=port.owner()!=null;
        var next=state.setValue(EnergyPortBlock.ACTIVE,active);
        if(active)next=next.setValue(EnergyPortBlock.FACING,port.outward);
        if(next!=state){level.setBlock(pos,next,3);level.invalidateCapabilities(pos);}
    }
    public void describe(Player player){
        var tile=owner();if(tile==null){player.displayClientMessage(Component.translatable("poc.matrix.port.unbound"),true);return;}
        var data=((MatrixAccess)tile).matrix$getThermal();
        player.displayClientMessage(Component.translatable("poc.matrix.coolant.status",data.tank.getFluidAmount(),data.tank.getCapacity(),(int)data.model.heat,(int)HeatModel.MAX_HEAT),true);
    }
    private final class View implements IFluidHandler {
        private final Direction side;
        private View(Direction side){this.side=side;}
        private MatrixThermalData data(){if(side!=null&&side!=outward)return null;var tile=owner();return tile==null?null:((MatrixAccess)tile).matrix$getThermal();}
        public int getTanks(){return 1;}
        public FluidStack getFluidInTank(int tank){var data=data();return tank==0&&data!=null?data.tank.getFluid().copy():FluidStack.EMPTY;}
        public int getTankCapacity(int tank){return tank==0?HeatModel.TANK_CAPACITY:0;}
        public boolean isFluidValid(int tank,FluidStack stack){return tank==0&&stack.is(MatrixThermalData.COOLANTS);}
        public int fill(FluidStack stack,FluidAction action){var data=data();if(data==null)return 0;int moved=data.tank.fill(stack,action);if(moved>0&&action.execute())level.getBlockEntity(controller).setChanged();return moved;}
        public FluidStack drain(FluidStack resource,FluidAction action){return FluidStack.EMPTY;}
        public FluidStack drain(int maxDrain,FluidAction action){return FluidStack.EMPTY;}
    }
}
