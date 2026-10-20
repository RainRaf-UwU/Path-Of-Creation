package creation.intro.mixin;

import creation.intro.IntroMod;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.screens.worldselection.WorldOpenFlows;
import net.minecraft.server.WorldStem;
import net.minecraft.server.packs.repository.PackRepository;
import net.minecraft.world.level.storage.LevelStorageSource.LevelStorageAccess;
import net.minecraft.world.level.storage.LevelResource;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

@Mixin(value=WorldOpenFlows.class,remap=false)
public abstract class WorldCreationMixin {
    @Redirect(method={"createFreshLevel","createLevelFromExistingSettings"},at=@At(value="INVOKE",
        target="Lnet/minecraft/client/Minecraft;doWorldLoad(Lnet/minecraft/world/level/storage/LevelStorageSource$LevelStorageAccess;Lnet/minecraft/server/packs/repository/PackRepository;Lnet/minecraft/server/WorldStem;Z)V"),require=1)
    private void poc$created(Minecraft client,LevelStorageAccess access,PackRepository packs,WorldStem stem,boolean fresh) {
        IntroMod.BIRTHS.arm(access.getLevelPath(LevelResource.ROOT),stem.worldData());
        client.doWorldLoad(access,packs,stem,fresh);
    }
}
