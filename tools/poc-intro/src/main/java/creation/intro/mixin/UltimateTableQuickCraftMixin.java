package creation.intro.mixin;

import creation.intro.IntroMod;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/** Shift crafting passes a now-empty stack to onTake; the returned copy retains the result. */
@Mixin(targets="com.blakebr0.extendedcrafting.container.UltimateTableContainer",remap=false)
public abstract class UltimateTableQuickCraftMixin {
    @Inject(method="quickMoveStack(Lnet/minecraft/world/entity/player/Player;I)Lnet/minecraft/world/item/ItemStack;",at=@At("RETURN"),require=1)
    private void poc$shiftCrafted(Player player,int slot,CallbackInfoReturnable<ItemStack> ci){
        if(slot==0)IntroMod.crafted(player,ci.getReturnValue());
    }
}
