package creation.intro;

import net.minecraft.client.*;
import net.minecraft.client.gui.screens.ReceivingLevelScreen;
import net.minecraft.client.resources.sounds.SimpleSoundInstance;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.sounds.SoundEvent;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.client.event.*;
import net.neoforged.neoforge.network.PacketDistributor;

public final class ClientIntro {
    private static IntroScreen screen;
    private static CameraType previousCamera;
    private static boolean previousGui,previousBob,readySent,finishSent;
    private static double x,y,z;private static float yaw,pitch;
    private static final SoundEvent SYSTEM=SoundEvent.createVariableRangeEvent(ResourceLocation.parse("poc_intro:glyph_system"));
    private static final SoundEvent SELF=SoundEvent.createVariableRangeEvent(ResourceLocation.parse("poc_intro:glyph_self"));
    private static final SoundEvent SELECT=SoundEvent.createVariableRangeEvent(ResourceLocation.parse("poc_intro:select"));

    @Mod(value="poc_intro",dist=Dist.CLIENT)
    public static final class Entry {
        public Entry(IEventBus ignored){
            var bus=NeoForge.EVENT_BUS;
            bus.addListener(ClientTickEvent.Post.class,event->tick());
            bus.addListener(RenderGuiEvent.Pre.class,event->{if(active())event.setCanceled(true);});
            bus.addListener(RenderPlayerEvent.Pre.class,event->{
                if(screen!=null&&event.getEntity()==Minecraft.getInstance().player&&screen.playback.age>=7
                    &&IntroTimeline.thirdPerson(screen.playback.age)<.25)event.setCanceled(true);
            });
            bus.addListener(ClientPlayerNetworkEvent.LoggingOut.class,event->close(false));
            bus.addListener(MovementInputUpdateEvent.class,event->{
                if(!active())return;var input=event.getInput();
                input.leftImpulse=input.forwardImpulse=0;
                input.up=input.down=input.left=input.right=input.jumping=input.shiftKeyDown=false;
            });
            bus.addListener(ScreenEvent.Opening.class,event->{
                if(active()&&event.getNewScreen()==null&&Minecraft.getInstance().level!=null)event.setNewScreen(screen);
            });
        }
    }
    static void receive(IntroPackets.Scene packet){
        Minecraft mc=Minecraft.getInstance();
        if(packet.phase()==2||packet.phase()==5){close(packet.phase()==2);return;}
        x=packet.x();y=packet.y();z=packet.z();yaw=packet.yaw();pitch=packet.pitch();
        if(screen==null){
            previousCamera=mc.options.getCameraType();previousGui=mc.options.hideGui;previousBob=mc.options.bobView().get();
            readySent=finishSent=false;
            boolean chapter=packet.phase()==3||packet.phase()==4;
            try{
                IntroStory story=chapter?IntroStory.parse(packet.chapterStory()):IntroStory.load();
                screen=new IntroScreen(story,mc.options.languageCode.toLowerCase(java.util.Locale.ROOT).startsWith("zh_"),chapter);
            }catch(RuntimeException failure){
                IntroMod.LOG.error("[POC Intro] Cannot open story",failure);
                PacketDistributor.sendToServer(new IntroPackets.Action(2));return;
            }
        }
        if((packet.phase()==1||packet.phase()==4)&&!screen.playback.begun){screen.playback.begun=true;screen.playback.age=screen.chapter?15:0;screen.resetClock();}
    }
    private static void tick(){
        if(screen==null)return;
        Minecraft mc=Minecraft.getInstance();
        if(mc.getConnection()==null){close(false);return;}
        if(mc.player==null||mc.level==null||mc.getOverlay()!=null||mc.screen instanceof ReceivingLevelScreen)return;
        mc.options.setCameraType(!screen.chapter&&screen.playback.begun&&screen.playback.age>=7?CameraType.THIRD_PERSON_FRONT:CameraType.FIRST_PERSON);
        mc.options.hideGui=true;mc.options.bobView().set(false);
        if(screen.playback.begun){
            mc.player.setYRot(yaw+(screen.chapter?0:IntroTimeline.yaw(screen.playback.age)));
            mc.player.setXRot(screen.chapter?pitch:IntroTimeline.pitch(screen.playback.age));
            mc.player.yHeadRot=mc.player.getYRot();mc.player.yBodyRot=yaw;
        }
        KeyMapping.releaseAll();
        if(mc.screen!=screen)mc.setScreen(screen);
        if(!readySent){PacketDistributor.sendToServer(new IntroPackets.Action(0));readySent=true;}
        if(screen.playback.release>=1.7&&!finishSent){PacketDistributor.sendToServer(new IntroPackets.Action(1));finishSent=true;}
    }
    public static boolean active(){return screen!=null;}
    /** Camera setup Mixin calls this after all vanilla first/third-person and bobbing calculations. */
    public static double[] pose(){
        if(screen==null||screen.chapter||!screen.playback.begun)return null;
        IntroPlayback p=screen.playback;
        var camera=IntroTimeline.camera(p.age,p.release,yaw);
        return new double[]{x+camera.x(),y+camera.y(),z+camera.z(),camera.yaw(),camera.pitch()};
    }
    static void glyph(){
        if(screen==null)return;
        Minecraft mc=Minecraft.getInstance();
        boolean self=screen.playback.node.speaker().equals("self");
        SoundEvent sound=self?SELF:SYSTEM;
        // Every revealed code point receives a separate short sound, including options and punctuation.
        mc.getSoundManager().play(SimpleSoundInstance.forUI(sound,1f,self?.65f:.62f));
    }
    static void select(){Minecraft.getInstance().getSoundManager().play(SimpleSoundInstance.forUI(SELECT,1f,.6f));}
    private static void close(boolean completed){
        if(screen==null)return;
        Minecraft mc=Minecraft.getInstance();IntroScreen old=screen;screen=null;
        mc.options.setCameraType(previousCamera);mc.options.hideGui=previousGui;mc.options.bobView().set(previousBob);
        KeyMapping.releaseAll();
        if(mc.screen==old)mc.setScreen(null);
        if(completed&&mc.player!=null){
            mc.player.setYRot(yaw);mc.player.setXRot(old.chapter?pitch:10);
            mc.player.displayClientMessage(Component.literal(old.playback.label("flight")),true);
        }
    }
}
