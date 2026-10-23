package creation.compat.lychee.mixin;

import net.minecraft.world.level.material.FlowingFluid;
import net.minecraft.world.level.material.Fluid;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.ModifyVariable;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;
import snownee.lychee.compat.recipeviewer.jei.category.JeiRvHelper;
import snownee.lychee.util.ui.InputAction;

/** JEI accepts source fluids; a Lychee block preview can supply a flowing variant. */
@Mixin(value = JeiRvHelper.class, remap = false)
public abstract class JeiRvHelperMixin {
    private static final String FLUID_ACTION = "doAction(Lnet/minecraft/world/level/material/Fluid;"
            + "Lsnownee/lychee/util/ui/InputAction$Direct;)Z";

    // Normalize the argument before both validation and Lychee's original query code.
    @ModifyVariable(method = FLUID_ACTION, at = @At("HEAD"), argsOnly = true,
            ordinal = 0, order = 900, require = 1, allow = 1)
    private Fluid poc$sourceFluid(Fluid fluid) {
        return fluid instanceof FlowingFluid flowing ? flowing.getSource() : fluid;
    }

    @Inject(method = FLUID_ACTION, at = @At("HEAD"), cancellable = true,
            order = 1100, require = 1, allow = 1)
    private void poc$validFluidQuery(Fluid fluid, InputAction.Direct action,
            CallbackInfoReturnable<Boolean> callback) {
        if (fluid == null || !fluid.isSource(fluid.defaultFluidState())) {
            callback.setReturnValue(false);
        }
    }
}
