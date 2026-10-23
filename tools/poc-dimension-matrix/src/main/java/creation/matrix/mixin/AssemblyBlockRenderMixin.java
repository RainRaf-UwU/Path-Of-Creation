package creation.matrix.mixin;
import creation.matrix.FormedMachineVisuals;
import net.minecraft.client.renderer.block.BlockRenderDispatcher;
import net.minecraft.client.renderer.RenderType;
import net.minecraft.core.BlockPos;
import net.minecraft.world.level.BlockAndTintGetter;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.material.FluidState;
import net.minecraft.util.RandomSource;
import com.mojang.blaze3d.vertex.*;
import net.neoforged.neoforge.client.model.data.ModelData;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
@Mixin(value=BlockRenderDispatcher.class,remap=false)
public abstract class AssemblyBlockRenderMixin {
    @Inject(method="renderBatched(Lnet/minecraft/world/level/block/state/BlockState;Lnet/minecraft/core/BlockPos;Lnet/minecraft/world/level/BlockAndTintGetter;Lcom/mojang/blaze3d/vertex/PoseStack;Lcom/mojang/blaze3d/vertex/VertexConsumer;ZLnet/minecraft/util/RandomSource;Lnet/neoforged/neoforge/client/model/data/ModelData;Lnet/minecraft/client/renderer/RenderType;)V",at=@At("HEAD"),cancellable=true)
    private void poc$hide(BlockState state,BlockPos pos,BlockAndTintGetter level,PoseStack pose,VertexConsumer out,boolean check,RandomSource random,ModelData data,RenderType type,CallbackInfo ci){if(FormedMachineVisuals.hidden(pos))ci.cancel();}
    @Inject(method="renderLiquid",at=@At("HEAD"),cancellable=true)
    private void poc$fluid(BlockPos pos,BlockAndTintGetter level,VertexConsumer out,BlockState state,FluidState fluid,CallbackInfo ci){if(FormedMachineVisuals.hidden(pos))ci.cancel();}
}
