package creation.intro;

import java.util.*;
import mezz.jei.api.*;
import mezz.jei.api.runtime.IJeiRuntime;
import mezz.jei.api.constants.VanillaTypes;
import mezz.jei.api.recipe.RecipeIngredientRole;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.world.item.ItemStack;
import net.minecraft.core.component.DataComponentType;

@JeiPlugin
public final class ManualJei implements IModPlugin {
    private static IJeiRuntime runtime;
    @Override public ResourceLocation getPluginUid(){return ResourceLocation.parse("poc_intro:manual");}
    @Override public void onRuntimeAvailable(IJeiRuntime value){runtime=value;}
    @Override public void onRuntimeUnavailable(){runtime=null;}
    static Set<String> matching(String term){
        if(runtime==null)return Set.of();
        var filter=runtime.getIngredientFilter();String previous=filter.getFilterText();
        try{filter.setFilterText(term);Set<String> ids=new HashSet<>();for(ItemStack item:filter.getFilteredItemStacks())ids.add(key(item));return ids;}
        finally{filter.setFilterText(previous);}
    }
    @SuppressWarnings("unchecked")
    static String key(ItemStack stack){
        String id=BuiltInRegistries.ITEM.getKey(stack.getItem()).toString();
        var type=BuiltInRegistries.DATA_COMPONENT_TYPE.get(ResourceLocation.parse("custommachinery:machine"));
        if(type!=null){ResourceLocation machine=stack.get((DataComponentType<ResourceLocation>)type);if(machine!=null)id+="["+machine+"]";}
        return id;
    }
    static boolean show(ItemStack stack,boolean uses){
        if(runtime==null||stack.isEmpty())return false;
        var role=uses?RecipeIngredientRole.INPUT:RecipeIngredientRole.OUTPUT;
        runtime.getRecipesGui().show(runtime.getJeiHelpers().getFocusFactory().createFocus(role,VanillaTypes.ITEM_STACK,stack));return true;
    }
}
