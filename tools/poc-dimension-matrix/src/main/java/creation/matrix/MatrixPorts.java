package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import fr.frinn.custommachinery.common.init.Registration;
import fr.frinn.custommachinery.common.component.EnergyMachineComponent;
import java.util.Map;
import java.util.WeakHashMap;

public final class MatrixPorts {
    private static final class Budget {
        final PortTransfer transfer=new PortTransfer();
        long checked=Long.MIN_VALUE;boolean formed;
    }
    // 键是控制器，值不反向持有控制器；卸载后的机器可回收。
    private static final Map<CustomMachineTile,Budget> BUDGETS=new WeakHashMap<>();
    private MatrixPorts() { }
    public static boolean operational(CustomMachineTile tile) {
        if(tile.isRemoved() || tile.getLevel()==null || tile.getLevel().isClientSide || !MatrixState.isMatrix(tile)||((MatrixAccess)tile).matrix$getThermal().model.detonated)return false;
        var budget=BUDGETS.computeIfAbsent(tile,k->new Budget());long tick=tile.getLevel().getGameTime();
        if(budget.checked!=tick){budget.formed=MatrixState.structureValid(tile);budget.checked=tick;}
        return budget.formed;
    }
    public static EnergyMachineComponent energy(CustomMachineTile tile) {
        return tile.getComponentManager().getComponent(Registration.ENERGY_MACHINE_COMPONENT.get()).orElse(null);
    }
    public static int transfer(CustomMachineTile tile,boolean input,int amount,boolean simulate) {
        if(!operational(tile))return 0;
        var energy=energy(tile);if(energy==null)return 0;
        return BUDGETS.get(tile).transfer.transfer(new PortTransfer.Buffer(){
            public int receive(int value,boolean sim){return energy.receiveRecipeEnergy(value,sim);}
            public int extract(int value,boolean sim){return energy.extractRecipeEnergy(value,sim);}
        },input,amount,simulate,tile.getLevel().getGameTime());
    }
    public static void refresh(CustomMachineTile tile) {
        var level=tile.getLevel();
        if(level.getGameTime()%10!=0)return;
        var front=tile.getComponentManager().facing();
        for(boolean input:new boolean[]{true,false})for(int depth=1;depth<=9;depth++)for(int height=0;height<=8;height++){
            var pos=tile.getBlockPos().offset(PortLayout.offset(front,input,depth,height));
            if(level.hasChunkAt(pos) && level.getBlockEntity(pos) instanceof EnergyPortBlockEntity port && port.isInput()==input)
                port.bind(tile);
        }
        for(int across=-4;across<=4;across++)for(int height=0;height<=8;height++){
            var pos=tile.getBlockPos().offset(CoolantPortBlockEntity.offset(front,across,height));
            if(level.hasChunkAt(pos)&&level.getBlockEntity(pos) instanceof CoolantPortBlockEntity port)port.bind(tile);
        }
    }
}
