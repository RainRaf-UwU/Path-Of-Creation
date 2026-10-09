package org.hp.kubejs_lang_override.mixin.client;

import java.util.ArrayList;
import java.util.List;
import net.minecraft.server.packs.PackResources;
import net.minecraft.server.packs.PackType;
import net.minecraft.server.packs.resources.MultiPackResourceManager;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.ModifyVariable;

/** Local compatibility fix: never mutate a caller's resource list. */
@Mixin(MultiPackResourceManager.class)
public class MultiPackResourceManagerMixin {
    @ModifyVariable(method = "<init>", at = @At("HEAD"), argsOnly = true, ordinal = 0)
    private static List<PackResources> kubejsLangOverride$prioritizeKubeJsAssets(
            List<PackResources> resources, PackType type, List<PackResources> originalResources) {
        if (type != PackType.CLIENT_RESOURCES || resources.isEmpty()) {
            return resources;
        }
        List<PackResources> regular = new ArrayList<>(resources.size());
        List<PackResources> kubejs = new ArrayList<>();
        for (PackResources resource : resources) {
            if ("KubeJS File Resource Pack [assets]".equals(resource.packId())) {
                kubejs.add(resource);
            } else {
                regular.add(resource);
            }
        }
        if (kubejs.isEmpty()) {
            return resources;
        }
        regular.addAll(kubejs);
        return regular;
    }
}
