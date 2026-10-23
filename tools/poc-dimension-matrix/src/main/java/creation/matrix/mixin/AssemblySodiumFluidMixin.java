package creation.matrix.mixin;
import creation.matrix.FormedMachineVisuals;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.material.FluidState;
import net.minecraft.core.BlockPos;
import org.spongepowered.asm.mixin.*;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
@Pseudo
@Mixin(targets="net.caffeinemc.mods.sodium.neoforge.render.FluidRendererImpl",remap=false)
public abstract class AssemblySodiumFluidMixin {
    @Inject(method="render",at=@At("HEAD"),cancellable=true)
    private void poc$hide(@Coerce Object level,BlockState state,FluidState fluid,BlockPos pos,BlockPos offset,@Coerce Object collector,@Coerce Object buffers,CallbackInfo ci){if(FormedMachineVisuals.hidden(pos))ci.cancel();}
}
