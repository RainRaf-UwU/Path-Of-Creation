package creation.matrix.jei;

import fr.frinn.custommachinery.common.init.CustomMachineItem;
import fr.frinn.custommachinery.common.init.Registration;
import fr.frinn.custommachinery.common.requirement.StructureRequirement;
import fr.frinn.custommachinery.common.util.BlockIngredient;
import java.util.*;
import mezz.jei.api.*;
import mezz.jei.api.constants.VanillaTypes;
import mezz.jei.api.gui.builder.*;
import mezz.jei.api.gui.drawable.IDrawable;
import mezz.jei.api.gui.ingredient.IRecipeSlotsView;
import mezz.jei.api.gui.widgets.IRecipeExtrasBuilder;
import mezz.jei.api.helpers.IGuiHelper;
import mezz.jei.api.recipe.*;
import mezz.jei.api.recipe.category.IRecipeCategory;
import mezz.jei.api.registration.*;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.*;
import net.minecraft.world.level.block.state.BlockState;

/** 独立搭建分类，读取服务器已经同步并成功加载的 CM 配方，不添加或改写加工配方。 */
@JeiPlugin
public final class MultiblockJei implements IModPlugin {
    public static final RecipeType<Page> TYPE=RecipeType.create("poc_dimension_matrix","multiblock_building",Page.class);
    private static final int PAGE_SIZE=18;
    private final Map<String,List<BlockState>> states=new HashMap<>();
    private record Visual(BlockPos pos,BlockState state,boolean controller) { }
    private record Material(Blueprint.Material source,List<ItemStack> items) { }
    private static final class Entry {
        ResourceLocation machine;
        Blueprint plan;
        ItemStack controller;
        List<Visual> visual;
        List<Material> materials;
        int variant,parts;
        final BlueprintView view=new BlueprintView();
        boolean matrix;
        GuiBlueprintMesh mesh;
    }
    public record Page(Entry entry,int index,int pages) { }
    @Override public ResourceLocation getPluginUid(){return ResourceLocation.parse("poc_dimension_matrix:multiblock_building");}
    @Override public void registerCategories(IRecipeCategoryRegistration registration){
        registration.addRecipeCategories(new Category(registration.getJeiHelpers().getGuiHelper()));
    }
    @Override public void registerRecipes(IRecipeRegistration registration){
        var level=Minecraft.getInstance().level;if(level==null)return;
        states.clear();var unique=new LinkedHashMap<String,Entry>();
        var recipes=new ArrayList<>(level.getRecipeManager().getAllRecipesFor(Registration.CUSTOM_MACHINE_RECIPE.get()));
        recipes.sort(Comparator.comparing(holder->holder.id().toString()));
        for(var holder:recipes){
            var recipe=holder.value();
            var requirements=recipe.getRequirements().stream().map(r->r.requirement()).filter(r->r instanceof StructureRequirement).map(r->(StructureRequirement)r).toList();
            for(var requirement:requirements){
                var keys=new HashMap<Character,List<String>>();
                requirement.keys().forEach((symbol,choices)->keys.put(symbol,choices.stream().map(BlockIngredient::serialize).toList()));
                var plan=new Blueprint(requirement.pattern(),keys);
                String key=recipe.getMachineId()+"/"+plan.signature;
                if(unique.containsKey(key)){unique.get(key).parts=Math.max(unique.get(key).parts,requirements.size());continue;}
                var entry=new Entry();entry.machine=recipe.getMachineId();entry.plan=plan;
                entry.controller=CustomMachineItem.makeMachineItem(entry.machine);entry.matrix=entry.machine.toString().equals("custommachinery:dimension_matrix");
                entry.parts=requirements.size();
                entry.visual=plan.cells.stream().map(cell->{
                    boolean controller=cell.choices().getFirst().equals("$controller");
                    var choices=controller?List.<BlockState>of():resolve(cell.choices().getFirst());
                    return new Visual(new BlockPos(cell.x(),cell.y(),cell.z()),choices.isEmpty()?null:choices.getFirst(),controller);
                }).filter(cell->cell.controller||cell.state!=null&&!cell.state.isAir()).toList();
                entry.materials=plan.materials.stream().map(material->new Material(material,items(material.ingredient()))).toList();
                entry.mesh=new GuiBlueprintMesh(entry.visual.stream().map(cell->new GuiBlueprintMesh.Instance(cell.pos,cell.state,cell.controller)).toList(),entry.controller);
                unique.put(key,entry);
            }
        }
        var variants=new HashMap<ResourceLocation,Integer>();var pages=new ArrayList<Page>();
        for(var entry:unique.values()){
            entry.variant=variants.merge(entry.machine,1,Integer::sum);
            int count=Math.max(1,(entry.materials.size()+PAGE_SIZE-1)/PAGE_SIZE);
            for(int index=0;index<count;index++)pages.add(new Page(entry,index,count));
        }
        registration.addRecipes(TYPE,pages);
    }
    private List<BlockState> resolve(String ingredient){
        return states.computeIfAbsent(ingredient,key->{
            try{return BlockIngredient.of(key).getAll().stream().map(state->state.getBlockState()).distinct().toList();}
            catch(Exception error){throw new IllegalStateException("Invalid loaded structure ingredient: "+key,error);}
        });
    }
    private List<ItemStack> items(String ingredient){
        var items=resolve(ingredient).stream().map(state->state.getBlock().asItem()).filter(item->item!=Items.AIR).distinct().map(ItemStack::new).toList();
        if(items.isEmpty()&&ingredient.equals("minecraft:fire"))return List.of(new ItemStack(BuiltInRegistries.ITEM.get(ResourceLocation.parse("rain:fire"))));
        return items;
    }
    @Override public void registerRecipeCatalysts(IRecipeCatalystRegistration registration){
        var level=Minecraft.getInstance().level;if(level==null)return;
        level.getRecipeManager().getAllRecipesFor(Registration.CUSTOM_MACHINE_RECIPE.get()).stream().map(holder->holder.value())
            .filter(recipe->recipe.getRequirements().stream().anyMatch(r->r.requirement() instanceof StructureRequirement))
            .map(recipe->recipe.getMachineId()).distinct().forEach(machine->registration.addRecipeCatalyst(CustomMachineItem.makeMachineItem(machine),TYPE));
    }
    private static List<Material> materials(Page page){
        var all=page.entry.materials;int from=page.index*PAGE_SIZE;return all.subList(from,Math.min(all.size(),from+PAGE_SIZE));
    }
    private static final class Category implements IRecipeCategory<Page> {
        private final IDrawable icon;
        Category(IGuiHelper helper){icon=helper.createDrawableItemStack(CustomMachineItem.makeMachineItem(ResourceLocation.parse("custommachinery:dimension_matrix")));}
        @Override public RecipeType<Page> getRecipeType(){return TYPE;}
        @Override public Component getTitle(){return tr("title");}
        @Override public IDrawable getIcon(){return icon;}
        @Override public int getWidth(){return 176;}
        @Override public int getHeight(){return 210;}
        @Override public void setRecipe(IRecipeLayoutBuilder builder,Page page,IFocusGroup focuses){
            var entry=page.entry;
            builder.addOutputSlot(5,5).addItemStack(entry.controller).setSlotName("controller").setOutputSlotBackground()
                .addRichTooltipCallback((slot,tooltip)->tooltip.add(tr("controller")));
            var materials=materials(page);
            for(int i=0;i<materials.size();i++){
                var material=materials.get(i);
                builder.addInputSlot(8+i%9*18,166+i/9*20).addItemStacks(material.items).setStandardSlotBackground()
                    .addRichTooltipCallback((slot,tooltip)->{
                        tooltip.add(tr("count",material.source.count()));tooltip.add(Component.literal(material.source.ingredient()));
                        if(material.source.alternatives().size()>1)tooltip.add(tr("replaceable"));
                    });
            }
            if(entry.matrix){
                for(int i=0;i<3;i++){
                    final boolean input=i==0;
                    final boolean coolant=i==2;
                    var block=BuiltInRegistries.ITEM.get(ResourceLocation.parse("poc_dimension_matrix:"+(coolant?"coolant_input_port":"energy_"+(input?"input":"output")+"_port")));
                    builder.addInputSlot(114+i*19,5).addItemStack(new ItemStack(block)).setStandardSlotBackground()
                        .addRichTooltipCallback((slot,tooltip)->{tooltip.add(tr(coolant?"coolant":input?"left_port":"right_port"));if(!coolant)tooltip.add(tr("optional"));});
                }
            }
            String template=entry.machine.getPath().equals("dyeing_factory")?"structure_dyeing":entry.machine.getPath().equals("void_mining_machine")&&entry.plan.width==5?"structure_void_mining_machine-3":null;
            if(template!=null)builder.addInvisibleIngredients(RecipeIngredientRole.OUTPUT).addItemStack(new ItemStack(BuiltInRegistries.ITEM.get(ResourceLocation.parse("rain:"+template))));
        }
        @Override public void draw(Page page,IRecipeSlotsView slots,GuiGraphics graphics,double mouseX,double mouseY){
            var e=page.entry;var font=Minecraft.getInstance().font;
            graphics.fill(2,30,174,129,0xff101c2a);graphics.renderOutline(2,30,172,99,0xff31536a);
            int textWidth=e.matrix?83:144;
            graphics.drawString(font,font.plainSubstrByWidth(e.controller.getHoverName().getString(),textWidth),26,4,0xffe6f6ff,false);
            graphics.drawString(font,e.plan.width+"×"+e.plan.height+"×"+e.plan.depth+"  #"+e.variant,26,16,0xff89b9c9,false);
            if(e.view.layer<0)drawModel(e,graphics);else drawLayer(e,graphics);
            button(graphics,4,132,22,"<",mouseX,mouseY);button(graphics,150,132,22,">",mouseX,mouseY);
            button(graphics,31,132,22,"-",mouseX,mouseY);button(graphics,123,132,22,"+",mouseX,mouseY);
            button(graphics,57,132,62,e.view.layer<0?tr("all").getString():tr("layer",e.view.layer+1,e.plan.height).getString(),mouseX,mouseY);
            graphics.drawString(font,String.format(Locale.ROOT,"%.1f×",e.view.zoom),145,117,0xff9bd9e5,false);
            graphics.drawString(font,tr("materials",page.index+1,page.pages),5,153,0xff9db4be,false);
            var materials=materials(page);
            for(int i=0;i<materials.size();i++){
                String count=Integer.toString(materials.get(i).source.count());
                graphics.pose().pushPose();graphics.pose().translate(23+i%9*18,176+i/9*20,300);graphics.pose().scale(.65f,.65f,1);
                graphics.drawString(font,count,-font.width(count),0,0xffffffff,true);graphics.pose().popPose();
            }
        }
        private static void drawModel(Entry entry,GuiGraphics g){
            g.flush();g.enableScissor(3,31,173,128);
            entry.mesh.draw(g,entry.view.matrix(entry.plan));
            g.flush();g.disableScissor();
        }
        private static void drawLayer(Entry entry,GuiGraphics g){
            double size=entry.view.tileSize(entry.plan),ox=entry.view.layerX(entry.plan),oz=entry.view.layerZ(entry.plan);
            g.enableScissor(3,31,173,128);
            for(var cell:entry.visual){
                if(cell.pos.getY()+entry.plan.originY!=entry.view.layer)continue;
                double x=ox+(cell.pos.getX()+entry.plan.originX)*size,z=oz+(cell.pos.getZ()+entry.plan.originZ)*size;
                g.fill((int)x,(int)z,(int)(x+size),(int)(z+size),cell.controller?0xff36dbe8:0xff294155);
                var item=cell.controller?entry.controller:new ItemStack(cell.state.getBlock());
                if(!item.isEmpty()){
                    g.pose().pushPose();g.pose().translate(x,z,0);g.pose().scale((float)(size/16),(float)(size/16),1);g.renderFakeItem(item,0,0);g.pose().popPose();
                }
            }
            g.flush();g.disableScissor();
        }
        private static void button(GuiGraphics g,int x,int y,int width,String text,double mx,double my){
            g.fill(x,y,x+width,y+15,inside(mx,my,x,y,width,15)?0xff31546a:0xff1f3445);
            g.drawCenteredString(Minecraft.getInstance().font,text,x+width/2,y+3,0xffc7eff5);
        }
        @Override public void createRecipeExtras(IRecipeExtrasBuilder builder,Page page,IFocusGroup focuses){
            builder.addInputHandler(new BlueprintControls(page.entry.plan,page.entry.view));
        }
        @Override public void getTooltip(ITooltipBuilder tooltip,Page page,IRecipeSlotsView slots,double x,double y){tooltip.addAll(tooltips(page,x,y));}
        private static List<Component> tooltips(Page page,double x,double y){
            var e=page.entry;
            if(!inside(x,y,2,30,172,118))return List.of();
            var result=new ArrayList<Component>();BlockPos picked=null;
            if(e.view.layer>=0&&y<129){
                double size=e.view.tileSize(e.plan),ox=e.view.layerX(e.plan),oz=e.view.layerZ(e.plan);
                int cx=(int)Math.floor((x-ox)/size),cz=(int)Math.floor((y-oz)/size);
                if(cx>=0&&cx<e.plan.width&&cz>=0&&cz<e.plan.depth){
                    picked=new BlockPos(cx-e.plan.originX,e.view.layer-e.plan.originY,cz-e.plan.originZ);
                }
            }else if(y<129){
                var ray=e.view.ray(e.plan,x,y);double distance=Double.POSITIVE_INFINITY;
                for(var cell:e.visual){double hit=BlueprintView.hit(ray,cell.pos.getX(),cell.pos.getY(),cell.pos.getZ());if(hit<distance){distance=hit;picked=cell.pos;}}
            }
            if(picked!=null){
                var pos=picked;
                var visual=e.visual.stream().filter(c->c.pos.equals(pos)).findFirst();
                result.add(visual.map(cell->cell.controller?e.controller.getHoverName():cell.state.getBlock().getName()).orElse(tr("empty")));
                result.add(tr("position",pos.getX(),pos.getY(),pos.getZ()));
                visual.filter(cell->!cell.controller&&!cell.state.getValues().isEmpty()).ifPresent(cell->result.add(Component.literal(cell.state.toString())));
                var rule=e.plan.cells.stream().filter(c->c.x()==pos.getX()&&c.y()==pos.getY()&&c.z()==pos.getZ()).findFirst();
                if(rule.isEmpty())result.add(tr("unrestricted"));
                else if(rule.get().choices().size()>1)result.add(tr("alternatives",String.join(" / ",rule.get().choices())));
            }
            result.add(tr("help"));if(e.parts>1)result.add(tr("combined",e.parts));
            if(picked==null)result.add(tr(e.matrix?"matrix_hint":"space_hint"));
            return result;
        }
    }
    private static boolean inside(double x,double y,int left,int top,int width,int height){return x>=left&&x<left+width&&y>=top&&y<top+height;}
    private static Component tr(String key,Object... args){return Component.translatable("poc.matrix.jei."+key,args);}
}
