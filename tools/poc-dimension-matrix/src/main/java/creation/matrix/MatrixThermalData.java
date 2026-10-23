package creation.matrix;

import net.minecraft.core.HolderLookup;
import net.minecraft.core.registries.Registries;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.tags.TagKey;
import net.minecraft.world.level.material.Fluid;
import net.neoforged.neoforge.fluids.capability.templates.FluidTank;

public final class MatrixThermalData {
    public static final TagKey<Fluid> COOLANTS=TagKey.create(Registries.FLUID,ResourceLocation.parse("poc_dimension_matrix:coolants"));
    public final HeatModel model=new HeatModel();
    public final FluidTank tank=new FluidTank(HeatModel.TANK_CAPACITY,stack->stack.is(COOLANTS));
    public double displayHeat;
    public void save(CompoundTag tag,HolderLookup.Provider registries){
        var value=new CompoundTag();value.putDouble("heat",model.heat);value.putBoolean("detonated",model.detonated);
        value.put("tank",tank.writeToNBT(registries,new CompoundTag()));tag.put("poc_matrix_thermal",value);
    }
    public void load(CompoundTag tag,HolderLookup.Provider registries){
        if(!tag.contains("poc_matrix_thermal"))return;var value=tag.getCompound("poc_matrix_thermal");
        double heat=value.getDouble("heat");model.heat=Double.isFinite(heat)?Math.max(0,Math.min(HeatModel.MAX_HEAT,heat)):0;model.detonated=value.getBoolean("detonated");
        tank.readFromNBT(registries,value.getCompound("tank"));
    }
    public void clientTick(){displayHeat+=(model.fraction()-displayHeat)*.15;}
}
