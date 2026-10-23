package creation.matrix.mixin;
import creation.matrix.FormedMachineVisuals;
import net.minecraft.client.resources.model.BakedModel;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.core.BlockPos;
import org.spongepowered.asm.mixin.*;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
@Pseudo
@Mixin(targets="net.caffeinemc.mods.sodium.client.render.chunk.compile.pipeline.BlockRenderer",remap=false)
public abstract class AssemblySodiumBlockMixin {
    @Inject(method="renderModel",at=@At("HEAD"),cancellable=true)
    private void poc$hide(BakedModel model,BlockState state,BlockPos pos,BlockPos origin,CallbackInfo ci){if(FormedMachineVisuals.hidden(pos))ci.cancel();}
}
