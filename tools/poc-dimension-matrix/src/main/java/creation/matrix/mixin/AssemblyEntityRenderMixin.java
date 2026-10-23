package creation.matrix.mixin;
import creation.matrix.FormedMachineVisuals;
import net.minecraft.client.renderer.blockentity.BlockEntityRenderDispatcher;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.world.level.block.entity.BlockEntity;
import com.mojang.blaze3d.vertex.PoseStack;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
@Mixin(value=BlockEntityRenderDispatcher.class,remap=false)
public abstract class AssemblyEntityRenderMixin {
    @Inject(method="render",at=@At("HEAD"),cancellable=true)
    private void poc$hide(BlockEntity tile,float partial,PoseStack pose,MultiBufferSource buffers,CallbackInfo ci){if(FormedMachineVisuals.hideEntity(tile.getBlockPos()))ci.cancel();}
}
