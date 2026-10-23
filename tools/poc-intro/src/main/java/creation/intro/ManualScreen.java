package creation.intro;

import java.util.*;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.EditBox;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.component.DataComponentType;
import net.minecraft.world.item.*;
import org.lwjgl.glfw.GLFW;

/** Native text input, independent scrolling panes, and registry-backed JEI links. */
public final class ManualScreen extends Screen {
    private final ManualData data=ManualData.load();private final ManualUi.State state=new ManualUi.State();
    private ManualUi.Layout layout;private EditBox search;private double mouseX,mouseY;private boolean dragging;
    private final Map<String,Set<String>> jeiCache=new HashMap<>();private final Map<String,String> tooltipCache=new HashMap<>();
    public ManualScreen(){super(Component.translatable("item.poc_intro.tech_manual"));state.cn=Minecraft.getInstance().options.languageCode.startsWith("zh_");}
    public static void open(){if(!ClientIntro.active())Minecraft.getInstance().setScreen(new ManualScreen());}
    @Override public boolean isPauseScreen(){return false;}
    @Override public void renderBackground(GuiGraphics g,int mx,int my,float partial){}
    @Override protected void init(){
        int oldSelected=state.selected,oldEntryScroll=state.entryScroll,oldBodyScroll=state.bodyScroll;
        layout=ManualUi.layout(width,height);var b=layout.search();
        search=new EditBox(font,b.x()+5,b.y()+6,b.w()-10,10,Component.literal(state.cn?"搜索手册":"Search manual"));
        search.setBordered(false);search.setTextColor(ManualUi.TEXT);search.setMaxLength(256);search.setValue(state.query);
        search.setHint(Component.literal(state.cn?"搜索模组、机器或机制…":"Search mods, machines, mechanics…"));
        search.setResponder(value->{state.query=value;state.group="";state.groupScroll=0;state.help=false;refresh();});
        addRenderableWidget(search);refresh();state.selected=Math.clamp(oldSelected,0,Math.max(0,state.results.size()-1));state.entryScroll=oldEntryScroll;state.bodyScroll=oldBodyScroll;
    }
    private void refresh(){
        if(jeiCache.size()>64)jeiCache.clear();var query=new ManualSearch(state.query);
        state.results=data.entries.stream().filter(e->state.group.isEmpty()||e.group().equals(state.group)).filter(e->e.items().isEmpty()||e.items().stream().anyMatch(id->BuiltInRegistries.ITEM.containsKey(ResourceLocation.parse(id)))).filter(e->query.matches(e,data.group(e.group()),this::dynamic)).toList();
        state.selected=state.entryScroll=state.bodyScroll=0;
    }
    private boolean dynamic(ManualData.Entry entry,String term){
        if("@#$^&%".indexOf(term.charAt(0))<0&&data.controlText(entry,state.cn,id->keyName(id)).toLowerCase(Locale.ROOT).contains(term))return true;
        char prefix=term.charAt(0);String value=term.substring(1).toLowerCase(Locale.ROOT);
        if(prefix!='#'&&prefix!='$'){Set<String> matches=jeiCache.computeIfAbsent(term,ManualJei::matching);return entry.items().stream().anyMatch(id->matches.contains(ManualJei.key(stack(id,entry))));}
        for(String id:entry.items()){
            ItemStack stack=stack(id,entry);if(stack.isEmpty())continue;
            if(prefix=='#'&&stack.getTags().anyMatch(tag->tag.location().toString().contains(value)))return true;
            if(prefix=='$'){
                String tooltip=tooltipCache.computeIfAbsent(entry.id()+"|"+id,k->String.join(" ",stack.getTooltipLines(Item.TooltipContext.of(minecraft.level),minecraft.player,TooltipFlag.NORMAL).stream().map(Component::getString).toList()).toLowerCase(Locale.ROOT));
                if(tooltip.contains(value))return true;
            }
        }return false;
    }
    private String keyName(String id){
        for(var key:minecraft.options.keyMappings)if(key.getName().equals(id))return key.getTranslatedKeyMessage().getString();
        return state.cn?"未注册":"Not registered";
    }
    @SuppressWarnings("unchecked")
    private ItemStack stack(String id,ManualData.Entry entry){
        ResourceLocation key=ResourceLocation.tryParse(id);if(key==null||!BuiltInRegistries.ITEM.containsKey(key))return ItemStack.EMPTY;
        ItemStack result=new ItemStack(BuiltInRegistries.ITEM.get(key));
        if(entry!=null&&entry.id().startsWith("machine/custommachinery:")){
            // Installed Custom Machinery Registration.MACHINE_DATA is DataComponentType<ResourceLocation>.
            var type=BuiltInRegistries.DATA_COMPONENT_TYPE.get(ResourceLocation.parse("custommachinery:machine"));
            if(type!=null)result.set((DataComponentType<ResourceLocation>)type,ResourceLocation.parse(entry.id().substring("machine/".length())));
        }return result;
    }
    private final ManualUi.Canvas metrics=new ManualUi.Canvas(){
        public void rect(int x,int y,int w,int h,int c){}public void text(String s,int x,int y,int c){}public int width(String s){return font.width(s);}public void clip(ManualUi.Box b){}public void unclip(){}public void item(String id,int x,int y){}public String keyName(String id,boolean cn){return ManualScreen.this.keyName(id);}
    };
    private ManualData.Entry selected(){return state.results.isEmpty()?null:state.results.get(Math.clamp(state.selected,0,state.results.size()-1));}
    @Override public void render(GuiGraphics g,int mx,int my,float partial){
        mouseX=mx;mouseY=my;ManualUi.Canvas c=new ManualUi.Canvas(){
            public void rect(int x,int y,int w,int h,int color){if(w>0&&h>0)g.fill(x,y,x+w,y+h,color);}
            public void text(String s,int x,int y,int color){g.drawString(font,s,x,y,color,false);}
            public int width(String s){return font.width(s);}
            public void clip(ManualUi.Box b){g.enableScissor(b.x(),b.y(),b.x()+b.w(),b.y()+b.h());}public void unclip(){g.disableScissor();}
            public void item(String id,int x,int y){ItemStack stack=stack(id,selected());if(!stack.isEmpty())g.renderItem(stack,x,y);}
            public void image(ManualData.Picture picture,ManualUi.Box box){ManualImageScreen.image(g,picture,box);}
            public String keyName(String id,boolean cn){return ManualScreen.this.keyName(id);}
        };
        layout=ManualUi.draw(c,width,height,state,data,mx,my);
        // Cover the mock text with the native EditBox; same measured search rectangle.
        var b=layout.search();g.fill(b.x()+1,b.y()+1,b.x()+b.w()-1,b.y()+b.h()-1,ManualUi.PANEL);search.render(g,mx,my,partial);
        String item=hoveredItem(mx,my);if(item!=null){ItemStack stack=stack(item,selected());if(!stack.isEmpty())g.renderTooltip(font,stack,mx,my);}
    }
    private String hoveredItem(double x,double y){
        if(layout==null||state.help||selected()==null)return null;var a=layout.article();int iy=a.y()+a.h()-22,limit=Math.min(selected().items().size(),Math.max(1,(a.w()-12)/21));
        for(int i=0;i<limit;i++)if(new ManualUi.Box(a.x()+7+i*21,iy,16,16).contains(x,y))return selected().items().get(i);return null;
    }
    @Override public boolean mouseClicked(double x,double y,int button){
        if(layout==null)return super.mouseClicked(x,y,button);
        if(layout.close().contains(x,y)){onClose();return true;}
        if(layout.clear().contains(x,y)||button==1&&layout.search().contains(x,y)){search.setValue("");setFocused(search);search.setFocused(true);return true;}
        if(layout.help().contains(x,y)){state.help=!state.help;state.bodyScroll=0;return true;}
        if(layout.search().contains(x,y)){setFocused(search);search.setFocused(true);return super.mouseClicked(x,y,button);}
        search.setFocused(false);setFocused(null);
        if(button==0&&layout.groups().contains(x,y)){int index=state.groupScroll+(int)(y-layout.groups().y())/20;if(index<=data.groups.size()){state.group=index==0?"":data.groups.get(index-1).id();state.help=false;refresh();}return true;}
        if(button==0&&layout.entries().contains(x,y)){int index=state.entryScroll+(int)(y-layout.entries().y())/30;if(index<state.results.size()){state.selected=index;state.bodyScroll=0;state.help=false;}return true;}
        String item=hoveredItem(x,y);if(item!=null&&(button==0||button==1)){ManualJei.show(stack(item,selected()),button==1);return true;}
        var media=ManualUi.media(metrics,layout,state,data);
        if(button==0&&media!=null&&layout.article().contains(x,y)&&y<layout.article().y()+layout.article().h()-42){
            var hit=media.compact()?new ManualUi.Box(layout.article().x()+7,media.box().y(),layout.article().w()-14,14):media.box();
            if(hit.contains(x,y)){var images=selected().pictureIds().stream().map(data.pictures::get).filter(Objects::nonNull).toList();if(!images.isEmpty())minecraft.setScreen(new ManualImageScreen(this,images,state.cn));return true;}
        }
        if(button==0&&layout.article().contains(x,y)){dragging=true;return true;}return super.mouseClicked(x,y,button);
    }
    @Override public boolean mouseScrolled(double x,double y,double dx,double dy){
        int amount=dy>0?-3:3;
        if(layout.groups().contains(x,y))state.groupScroll=Math.clamp(state.groupScroll+amount,0,ManualUi.maxScroll(data.groups.size()+1,layout.groups().h(),20));
        else if(layout.entries().contains(x,y))state.entryScroll=Math.clamp(state.entryScroll+amount,0,ManualUi.maxScroll(state.results.size(),layout.entries().h(),30));
        else if(layout.article().contains(x,y)){int reserve=!state.help&&selected()!=null?42:0;state.bodyScroll=Math.clamp(state.bodyScroll+amount,0,ManualUi.maxScroll(ManualUi.articleLines(metrics,layout,state,data).size(),layout.article().h()-16-reserve,12));}
        else return super.mouseScrolled(x,y,dx,dy);return true;
    }
    @Override public boolean mouseDragged(double x,double y,int button,double dx,double dy){if(dragging&&button==0){state.bodyScroll=Math.max(0,state.bodyScroll-(int)Math.round(dy/6));return true;}return super.mouseDragged(x,y,button,dx,dy);}
    @Override public boolean mouseReleased(double x,double y,int button){dragging=false;return super.mouseReleased(x,y,button);}
    @Override public boolean keyPressed(int key,int scan,int mods){
        if(key==GLFW.GLFW_KEY_F&&hasControlDown()){setFocused(search);search.setFocused(true);return true;}
        if(search.isFocused()&&key!=GLFW.GLFW_KEY_ESCAPE)return super.keyPressed(key,scan,mods);
        String item=hoveredItem(mouseX,mouseY);if(item!=null&&(key==GLFW.GLFW_KEY_R||key==GLFW.GLFW_KEY_U)){ManualJei.show(stack(item,selected()),key==GLFW.GLFW_KEY_U);return true;}
        if(key==GLFW.GLFW_KEY_PAGE_UP||key==GLFW.GLFW_KEY_PAGE_DOWN||key==GLFW.GLFW_KEY_HOME||key==GLFW.GLFW_KEY_END){
            int reserve=!state.help&&selected()!=null?42:0,max=ManualUi.maxScroll(ManualUi.articleLines(metrics,layout,state,data).size(),layout.article().h()-16-reserve,12),page=Math.max(1,(layout.article().h()-16-reserve)/12-1);
            state.bodyScroll=key==GLFW.GLFW_KEY_HOME?0:key==GLFW.GLFW_KEY_END?max:Math.clamp(state.bodyScroll+(key==GLFW.GLFW_KEY_PAGE_DOWN?page:-page),0,max);return true;
        }
        if(key==GLFW.GLFW_KEY_DOWN||key==GLFW.GLFW_KEY_UP){state.selected=Math.clamp(state.selected+(key==GLFW.GLFW_KEY_DOWN?1:-1),0,Math.max(0,state.results.size()-1));state.bodyScroll=0;int visible=Math.max(1,layout.entries().h()/30);if(state.selected<state.entryScroll)state.entryScroll=state.selected;if(state.selected>=state.entryScroll+visible)state.entryScroll=state.selected-visible+1;return true;}
        return super.keyPressed(key,scan,mods);
    }
}
