package creation.cursorprobe;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import com.mojang.blaze3d.platform.NativeImage;
import net.minecraft.client.Minecraft;
import net.minecraft.client.Screenshot;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.EditBox;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.TitleScreen;
import net.minecraft.client.gui.screens.inventory.InventoryScreen;
import net.minecraft.network.chat.Component;
import net.minecraft.world.Difficulty;
import net.minecraft.world.level.GameRules;
import net.minecraft.world.level.GameType;
import net.minecraft.world.level.LevelSettings;
import net.minecraft.world.level.WorldDataConfiguration;
import net.minecraft.world.level.levelgen.WorldOptions;
import net.minecraft.world.level.levelgen.presets.WorldPresets;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import org.lwjgl.glfw.GLFW;

/** Test-only mod, never included in the release JAR or the author's instance. */
@Mod(value="poc_cursor_probe",dist=Dist.CLIENT)
public final class CursorProbe {
    private final List<String> passed=new ArrayList<>();
    private int phase=0, ticks=0, clicks;
    private long themed;
    private ProbeScreen probe;
    private boolean finished;
    private Method move, press, active, shape, choose;
    private String pendingShot;
    private boolean verifyRing;
    private double shotX,shotY;

    public CursorProbe() {
        NeoForge.EVENT_BUS.addListener(this::tick);
        NeoForge.EVENT_BUS.addListener(net.neoforged.bus.api.EventPriority.LOWEST,
            net.neoforged.neoforge.client.event.RenderFrameEvent.Post.class,this::rendered);
    }

    private void tick(ClientTickEvent.Post event) {
        Minecraft mc=Minecraft.getInstance();
        if(finished || !mc.isGameLoadFinished() || mc.getOverlay()!=null || pendingShot!=null) return;
        mc.setWindowActive(true); // Synthetic focus state affects only this isolated game process.
        if(++ticks<20) return;
        ticks=0;
        try {
            long window=mc.getWindow().getWindow();
            switch(phase) {
                case 0 -> {
                    Class<?> tracker=Class.forName("de.keksuccino.fancymenu.util.rendering.ui.cursor.GlfwCursorTracker");
                    active=tracker.getMethod("getActiveCursor",long.class);
                    shape=tracker.getMethod("getStandardCursorShape",long.class);
                    Class<?> handler=Class.forName("de.keksuccino.fancymenu.util.rendering.ui.cursor.CursorHandler");
                    choose=handler.getMethod("setClientTickCursor",long.class);
                    move=mc.mouseHandler.getClass().getDeclaredMethod("onMove",long.class,double.class,double.class);
                    press=mc.mouseHandler.getClass().getDeclaredMethod("onPress",long.class,int.class,int.class,int.class);
                    move.setAccessible(true); press.setAccessible(true);
                    mc.setScreen(new TitleScreen()); phase++;
                }
                case 1 -> {
                    themed=cursor(window);
                    require(themed>0 && (Integer)shape.invoke(null,themed)==-1,"Main menu custom native cursor");
                    capture(mc,"01-main-menu.png");
                    probe=new ProbeScreen(); mc.setScreen(probe); phase++;
                }
                case 2 -> {
                    require(cursor(window)==themed,"Cursor survives screen transition");
                    click(mc,probe.width/2.0,probe.height/2.0,0);
                    require(clicks==1,"Real MouseHandler button action executes once");
                    queueShot("02-click-ring.png",probe.width/2.0,probe.height/2.0,true);
                    phase++;
                    ticks=18; // capture within 100ms of this click
                }
                case 3 -> {
                    click(mc,probe.width/2.0,probe.height/2.0+30,0);
                    require(probe.box.isFocused(),"Text field focus preserved");
                    probe.charTyped('A',0); require(probe.box.getValue().equals("A"),"Text entry preserved");
                    long writing=Class.forName("de.keksuccino.fancymenu.util.rendering.ui.cursor.CursorHandler").getField("CURSOR_WRITING").getLong(null);
                    // Ask the real FancyMenu controller to select its semantic cursor.
                    choose.invoke(null,writing);
                    Class<?> acara=Class.forName("de.keksuccino.fancymenu.util.event.acara.EventHandler");
                    Class<?> base=Class.forName("de.keksuccino.fancymenu.util.event.acara.EventBase");
                    Object tick=Class.forName("de.keksuccino.fancymenu.events.ticking.ClientTickEvent$Pre").getConstructor().newInstance();
                    acara.getMethod("postEvent",base).invoke(acara.getField("INSTANCE").get(null),tick);
                    NeoForge.EVENT_BUS.post(new net.neoforged.neoforge.client.event.RenderFrameEvent.Post(net.minecraft.client.DeltaTracker.ZERO));
                    require(cursor(window)==writing,"FancyMenu writing cursor has priority");
                    GLFW.glfwSetCursor(window,0); phase++;
                }
                case 4 -> {
                    int mode=GLFW.glfwGetInputMode(window,GLFW.GLFW_CURSOR);
                    mc.setWindowActive(false);
                    NeoForge.EVENT_BUS.post(new net.neoforged.neoforge.client.event.RenderFrameEvent.Post(net.minecraft.client.DeltaTracker.ZERO));
                    require(cursor(window)!=themed,"Focus loss releases own cursor");
                    require(mode==GLFW.glfwGetInputMode(window,GLFW.GLFW_CURSOR),"Focus handling leaves input mode unchanged");
                    mc.setWindowActive(true); mc.options.guiScale().set(3);mc.resizeDisplay();phase++;
                }
                case 5 -> {
                    require(cursor(window)==themed,"GUI scale 3 uses same native cursor");
                    capture(mc,"03-gui-scale-3.png");
                    mc.options.guiScale().set(2);mc.resizeDisplay();
                    GameRules rules=new GameRules();
                    mc.createWorldOpenFlows().createFreshLevel("poc-cursor-compatibility-test-"+System.currentTimeMillis(),
                        new LevelSettings("POC Cursor Test",GameType.SURVIVAL,false,Difficulty.PEACEFUL,true,rules,WorldDataConfiguration.DEFAULT),
                        new WorldOptions(20261009L,false,false),WorldPresets::createNormalWorldDimensions,new TitleScreen());
                    phase++;
                }
                case 6 -> {
                    if(mc.player==null || mc.level==null) return;
                    if(!mc.player.isAlive()) return;
                    mc.getSingleplayerServer().execute(()->{
                        var player=mc.getSingleplayerServer().getPlayerList().getPlayers().getFirst();
                        player.getInventory().setItem(9,new net.minecraft.world.item.ItemStack(net.minecraft.world.item.Items.STICK,8));
                        player.inventoryMenu.broadcastChanges();
                    });
                    mc.setScreen(new InventoryScreen(mc.player)); phase++;
                }
                case 7 -> {
                    require(mc.screen instanceof InventoryScreen && cursor(window)==themed,"Survival inventory and JEI render with themed cursor");
                    capture(mc,"04-survival-inventory.png");
                    InventoryScreen inventory=(InventoryScreen)mc.screen;
                    slotClick(mc,inventory,9);
                    require(mc.player.inventoryMenu.getCarried().getCount()==8,"Inventory pickup receives original stack");
                    slotClick(mc,inventory,10);
                    require(mc.player.inventoryMenu.getCarried().isEmpty() && mc.player.inventoryMenu.getSlot(10).getItem().getCount()==8,"Inventory placement preserves stack");
                    slotClick(mc,inventory,10);
                    slotMove(mc,inventory,11);
                    press.invoke(mc.mouseHandler,window,0,GLFW.GLFW_PRESS,0);
                    slotMove(mc,inventory,11);slotMove(mc,inventory,12);
                    press.invoke(mc.mouseHandler,window,0,GLFW.GLFW_RELEASE,0);
                    phase++;
                }
                case 8 -> {
                    require(mc.player.inventoryMenu.getCarried().isEmpty()
                        && mc.player.inventoryMenu.getSlot(11).getItem().getCount()==4
                        && mc.player.inventoryMenu.getSlot(12).getItem().getCount()==4,"Inventory drag distributes stacks and server confirms");
                    Class.forName("dev.ftb.mods.ftbquests.client.ClientQuestFile").getMethod("openGui").invoke(null);phase++;
                }
                case 9 -> {
                    require(mc.screen!=null && mc.screen.getClass().getName().contains("ftblibrary"),"Actual FTB Quests screen opened");
                    require(cursor(window)==themed,"FTB Quests uses themed cursor");
                    click(mc,mc.screen.width*.7,mc.screen.height*.7,1);
                    queueShot("05-ftb-quests.png",mc.screen.width*.7,mc.screen.height*.7,false);
                    phase++;ticks=18;
                }
                case 10 -> {
                    mc.setScreen(null);phase++;
                }
                case 11 -> {
                    require(cursor(window)!=themed,"World GUI close restores cursor");
                    require(mc.mouseHandler.isMouseGrabbed(),"World mouse capture remains working");
                    mc.setScreen(new InventoryScreen(mc.player));phase++;
                }
                case 12 -> {
                    require(cursor(window)==themed,"Reopening GUI restores theme");
                    Field field=Class.forName("creation.cursor.CursorConfig").getDeclaredField("CURSOR");field.setAccessible(true);
                    Object setting=field.get(null); setting.getClass().getMethod("set",Object.class).invoke(setting,false);phase++;
                }
                case 13 -> {
                    require(cursor(window)!=themed,"Custom cursor config switch releases cursor");
                    finish(mc,null);
                }
                default -> throw new AssertionError("Unknown test phase");
            }
        } catch(Throwable error) { finish(mc,error); }
    }

    private long cursor(long window) throws Exception { return (Long)active.invoke(null,window); }
    private void require(boolean value,String message) {
        if(!value) throw new AssertionError(message);
        passed.add(message);System.out.println("[POC Cursor Probe] PASS "+message);
    }
    private void click(Minecraft mc,double x,double y,int button) throws Exception {
        long w=mc.getWindow().getWindow();
        mouseMove(mc,x,y);
        press.invoke(mc.mouseHandler,w,button,GLFW.GLFW_PRESS,0);
        press.invoke(mc.mouseHandler,w,button,GLFW.GLFW_RELEASE,0);
    }
    private void mouseMove(Minecraft mc,double x,double y) throws Exception {
        move.invoke(mc.mouseHandler,mc.getWindow().getWindow(),x*mc.getWindow().getScreenWidth()/mc.getWindow().getGuiScaledWidth(),y*mc.getWindow().getScreenHeight()/mc.getWindow().getGuiScaledHeight());
    }
    private void slotMove(Minecraft mc,InventoryScreen screen,int id) throws Exception {
        var slot=screen.getMenu().getSlot(id);mouseMove(mc,screen.getGuiLeft()+slot.x+8,screen.getGuiTop()+slot.y+8);
    }
    private void slotClick(Minecraft mc,InventoryScreen screen,int id) throws Exception {
        var slot=screen.getMenu().getSlot(id);click(mc,screen.getGuiLeft()+slot.x+8,screen.getGuiTop()+slot.y+8,0);
    }
    private void queueShot(String name,double x,double y,boolean check) {
        pendingShot=name;shotX=x;shotY=y;verifyRing=check;
    }
    private void rendered(net.neoforged.neoforge.client.event.RenderFrameEvent.Post event) {
        if(pendingShot==null || finished) return;
        Minecraft mc=Minecraft.getInstance();
        try {
            Path output=mc.gameDirectory.toPath().resolve("cursor-test");Files.createDirectories(output);
            try(NativeImage image=Screenshot.takeScreenshot(mc.getMainRenderTarget())) {
                image.writeToFile(output.resolve(pendingShot));
                if(verifyRing) {
                    int x=(int)(shotX*image.getWidth()/mc.getWindow().getGuiScaledWidth());
                    int y=(int)(shotY*image.getHeight()/mc.getWindow().getGuiScaledHeight());
                    int pixels=0;
                    for(int i=Math.max(0,x-32);i<Math.min(image.getWidth(),x+33);i++)
                        for(int j=Math.max(0,y-32);j<Math.min(image.getHeight(),y+33);j++) {
                            int color=image.getPixelRGBA(i,j),r=color&255,g=color>>>8&255,b=color>>>16&255;
                            if(g>r+20 && b>r+20)pixels++;
                        }
                    require(pixels>=8,"Click ring visible in actual framebuffer");
                }
            }
            pendingShot=null;
        }catch(Throwable error){finish(mc,error);}
    }
    private void capture(Minecraft mc,String name) throws Exception {
        Path output=mc.gameDirectory.toPath().resolve("cursor-test");Files.createDirectories(output);
        try(NativeImage image=Screenshot.takeScreenshot(mc.getMainRenderTarget())) {image.writeToFile(output.resolve(name));}
    }
    private void finish(Minecraft mc,Throwable error) {
        finished=true;
        try {
            Path output=mc.gameDirectory.toPath().resolve("cursor-test");Files.createDirectories(output);
            StringBuilder result=new StringBuilder("{\"passed\":").append(error==null).append(",\"checks\":[");
            for(int i=0;i<passed.size();i++){if(i>0)result.append(',');result.append('"').append(passed.get(i)).append('"');}
            result.append(']');
            if(error!=null){error.printStackTrace();result.append(",\"error\":\"").append(error.toString().replace("\\","/").replace("\"","'").replace("\n"," ")).append('"');}
            Files.writeString(output.resolve("result.json"),result.append('}').toString());
        }catch(Exception failure){failure.printStackTrace();}
        mc.stop();
    }

    private final class ProbeScreen extends Screen {
        EditBox box;
        ProbeScreen(){super(Component.literal("POC Cursor compatibility probe"));}
        @Override protected void init(){
            addRenderableWidget(Button.builder(Component.literal("Input remains functional"),b->clicks++).bounds(width/2-90,height/2-10,180,20).build());
            box=new EditBox(font,width/2-90,height/2+20,180,20,Component.literal("Text input"));addRenderableWidget(box);
        }
        @Override public void render(GuiGraphics graphics,int x,int y,float delta){
            graphics.fill(0,0,width,height,0xFF142336);
            graphics.drawCenteredString(font,"Actual NeoForge / FancyMenu / cursor render",width/2,height/2-55,0xFFE0EDF5);
            super.render(graphics,x,y,delta);
        }
    }
}
