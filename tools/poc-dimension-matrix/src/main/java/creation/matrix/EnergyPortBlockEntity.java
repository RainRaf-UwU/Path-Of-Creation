package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.ChatFormatting;
import net.minecraft.core.*;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.state.BlockState;
import net.neoforged.neoforge.capabilities.Capabilities;
import net.neoforged.neoforge.energy.IEnergyStorage;

public final class EnergyPortBlockEntity extends BlockEntity {
    private BlockPos controller;
    private Direction outward;
    private final IEnergyStorage[] views=new IEnergyStorage[7];
    public EnergyPortBlockEntity(BlockPos pos,BlockState state){
        super(MatrixMod.PORT_ENTITY.get(),pos,state);
        for(int i=0;i<7;i++)views[i]=new View(i==6?null:Direction.from3DDataValue(i));
    }
    public boolean isInput(){return getBlockState().getBlock() instanceof EnergyPortBlock block && block.input;}
    public IEnergyStorage capability(Direction side){
        return side!=null && outward!=null && side!=outward?null:views[side==null?6:side.get3DDataValue()];
    }
    private CustomMachineTile owner(boolean requireFormed){
        if(isRemoved() || level==null || level.isClientSide || controller==null || !level.hasChunkAt(controller))return null;
        if(!(level.getBlockEntity(controller) instanceof CustomMachineTile tile) || tile.isRemoved() || !MatrixState.isMatrix(tile))return null;
        var front=tile.getComponentManager().facing();
        if(outward!=PortLayout.outward(front,isInput()))return null;
        if(!PortLayout.accepts(front,isInput(),worldPosition.getX()-controller.getX(),worldPosition.getY()-controller.getY(),worldPosition.getZ()-controller.getZ()))return null;
        return !requireFormed || MatrixPorts.operational(tile)?tile:null;
    }
    public void bind(CustomMachineTile tile){
        if(controller!=null && !controller.equals(tile.getBlockPos()) && owner(false)!=null)return;
        var side=PortLayout.outward(tile.getComponentManager().facing(),isInput());
        if(!tile.getBlockPos().equals(controller) || outward!=side){
            controller=tile.getBlockPos().immutable();outward=side;
            level.invalidateCapabilities(worldPosition);
        }
    }
    public static void serverTick(Level level,BlockPos pos,BlockState state,EnergyPortBlockEntity port){
        var tile=port.owner(true);boolean active=tile!=null;
        var next=state.setValue(EnergyPortBlock.ACTIVE,active);
        if(port.outward!=null && active)next=next.setValue(EnergyPortBlock.FACING,port.outward);
        if(next!=state){level.setBlock(pos,next,3);level.invalidateCapabilities(pos);}
        if(port.controller!=null && port.owner(false)==null){port.controller=null;port.outward=null;level.invalidateCapabilities(pos);}
        if(!active || port.isInput() || port.outward==null)return;
        var energy=port.views[port.outward.get3DDataValue()];
        if(energy.getEnergyStored()<=0)return;
        var targetPos=pos.relative(port.outward);if(!level.hasChunkAt(targetPos))return;
        var target=level.getCapability(Capabilities.EnergyStorage.BLOCK,targetPos,port.outward.getOpposite());
        if(target==null || !target.canReceive())return;
        var buffer=MatrixPorts.energy(tile);
        PortTransfer.push(new PortTransfer.Buffer(){
            public int extract(int amount,boolean simulate){return energy.extractEnergy(amount,simulate);}
            public int receive(int amount,boolean simulate){return buffer.receiveRecipeEnergy(amount,simulate);}
        },target::receiveEnergy);
    }
    public void describe(Player player){
        var tile=owner(true);
        if(tile==null){player.displayClientMessage(Component.translatable("poc.matrix.port.unbound").withStyle(ChatFormatting.YELLOW),true);return;}
        var e=MatrixPorts.energy(tile);
        player.displayClientMessage(Component.translatable("poc.matrix.port.status",Component.translatable(isInput()?"poc.matrix.port.input":"poc.matrix.port.output"),e.getEnergy(),e.getCapacity()).withStyle(ChatFormatting.AQUA),true);
    }
    private final class View implements IEnergyStorage {
        private final Direction side;
        private View(Direction side){this.side=side;}
        private CustomMachineTile target(){return side!=null && side!=outward?null:owner(true);}
        public int receiveEnergy(int amount,boolean simulate){var tile=target();return tile!=null&&isInput()?MatrixPorts.transfer(tile,true,amount,simulate):0;}
        public int extractEnergy(int amount,boolean simulate){var tile=target();return tile!=null&&!isInput()?MatrixPorts.transfer(tile,false,amount,simulate):0;}
        public int getEnergyStored(){var tile=target();var e=tile==null?null:MatrixPorts.energy(tile);return e==null?0:(int)Math.min(Integer.MAX_VALUE,e.getEnergy());}
        public int getMaxEnergyStored(){var tile=target();var e=tile==null?null:MatrixPorts.energy(tile);return e==null?0:(int)Math.min(Integer.MAX_VALUE,e.getCapacity());}
        public boolean canExtract(){return !isInput()&&target()!=null;}
        public boolean canReceive(){return isInput()&&target()!=null;}
    }
}
