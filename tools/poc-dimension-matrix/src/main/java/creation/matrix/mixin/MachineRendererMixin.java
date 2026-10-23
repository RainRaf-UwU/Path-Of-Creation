package creation.matrix.mixin;

import creation.matrix.*;
import com.mojang.blaze3d.vertex.PoseStack;
import fr.frinn.custommachinery.client.render.CustomMachineRenderer;
import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.client.renderer.blockentity.BlockEntityRenderer;
import net.minecraft.world.phys.AABB;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(value = CustomMachineRenderer.class, remap = false)
public abstract class MachineRendererMixin implements BlockEntityRenderer<CustomMachineTile> {
    @Inject(method = "render(Lfr/frinn/custommachinery/common/init/CustomMachineTile;FLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;II)V", at = @At("HEAD"), cancellable = true)
    private void poc$formed(CustomMachineTile tile, float partial, PoseStack pose, MultiBufferSource buffers, int light, int overlay, CallbackInfo ci) {
        // 成形时控制器本身也由整机面板代替，避免旧动态模型或罐内液体穿过新外壳。
        if (MachineFx.supported(tile) && (((MachineFx.Access)tile).poc$fx().flags & 1) != 0) {
            MachineFxRenderer.render(tile, partial, pose, buffers);
            ci.cancel();
        }
    }

    @Inject(method = "render(Lfr/frinn/custommachinery/common/init/CustomMachineTile;FLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;II)V", at = @At("TAIL"))
    private void matrix$render(CustomMachineTile tile, float partial, PoseStack pose, MultiBufferSource buffers, int light, int overlay, CallbackInfo ci) {
        MatrixRenderer.render(tile, partial, pose, buffers);
        MachineFxRenderer.render(tile, partial, pose, buffers);
    }

    @Override public AABB getRenderBoundingBox(CustomMachineTile tile) {
        if(MachineFx.supported(tile))return MachineFxRenderer.bounds(tile);
        if (!MatrixState.isMatrix(tile)) return BlockEntityRenderer.super.getRenderBoundingBox(tile);
        var facing = tile.getComponentManager().facing();
        var pos = tile.getBlockPos();
        return new AABB(pos.getX() - facing.getStepX() * 5 - 5, pos.getY() - 1,
            pos.getZ() - facing.getStepZ() * 5 - 5, pos.getX() - facing.getStepX() * 5 + 6,
            pos.getY() + 10, pos.getZ() - facing.getStepZ() * 5 + 6);
    }
}
