package creation.intro.mixin;

import creation.intro.IntroMod;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/** Extended Crafting does not publish ItemCraftedEvent from its manual table output slot. */
@Mixin(targets="com.blakebr0.extendedcrafting.container.slot.TableOutputSlot",remap=false)
public abstract class ExtendedTableCraftMixin {
    @Inject(method="onTake(Lnet/minecraft/world/entity/player/Player;Lnet/minecraft/world/item/ItemStack;)V",at=@At("RETURN"),require=1,allow=1)
    private void poc$crafted(Player player,ItemStack result,CallbackInfo ci){IntroMod.crafted(player,result);}
}
