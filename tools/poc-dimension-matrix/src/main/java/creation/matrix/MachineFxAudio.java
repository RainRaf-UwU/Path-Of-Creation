package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import java.lang.ref.WeakReference;
import java.util.*;
import net.minecraft.client.Minecraft;
import net.minecraft.client.resources.sounds.AbstractTickableSoundInstance;
import net.minecraft.client.resources.sounds.SimpleSoundInstance;
import net.minecraft.sounds.SoundSource;
import net.minecraft.sounds.SoundEvent;
import net.minecraft.util.RandomSource;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.fml.event.lifecycle.FMLClientSetupEvent;

@EventBusSubscriber(modid="poc_dimension_matrix",value=Dist.CLIENT,bus=EventBusSubscriber.Bus.MOD)
public final class MachineFxAudio {
    private static final class Track {int oldFlags;Loop loop;int pending;}
    private static final Map<CustomMachineTile,Track> TRACKS=new WeakHashMap<>();
    @SubscribeEvent public static void setup(FMLClientSetupEvent event){event.enqueueWork(()->{MachineFx.client=MachineFxAudio::tick;net.neoforged.neoforge.common.NeoForge.EVENT_BUS.addListener((net.neoforged.neoforge.client.event.ClientTickEvent.Post e)->FormedMachineVisuals.clean());});}
    private static void tick(CustomMachineTile tile,MachineFx.State state){
        FormedMachineVisuals.observe(tile,state);
        var mc=Minecraft.getInstance();var track=TRACKS.computeIfAbsent(tile,t->new Track());int old=track.oldFlags;track.oldFlags=state.flags;
        var l=MachineFx.layout(state);if(l==null||mc.player==null||mc.level!=tile.getLevel()||mc.player.distanceToSqr(tile.getBlockPos().getCenter())>48*48||mc.options.getSoundSourceVolume(SoundSource.MASTER)==0||mc.options.getSoundSourceVolume(SoundSource.BLOCKS)==0){if(track.loop!=null){track.loop.retire=true;track.loop=null;}return;}
        if(((state.flags&1)!=0&&(old&1)==0)||((state.flags&2)!=0&&(old&2)==0))shot(tile,MatrixMod.FX_START.get(),.42f);
        if((old&4)!=0&&(state.flags&4)==0)shot(tile,MatrixMod.FX_STOP.get(),.22f);
        var manager=mc.getSoundManager();boolean running=(state.flags&4)!=0;
        if(track.loop!=null&&(!running||track.loop.isStopped()||++track.pending>8&&!manager.isActive(track.loop))){track.loop.retire=true;track.loop=null;}
        if(running&&track.loop==null){SoundEvent sound=switch(l.family){case "mining"->MatrixMod.FX_MINING.get();case "dyeing"->MatrixMod.FX_DYEING.get();case "inspector"->MatrixMod.FX_INSPECTOR.get();default->MatrixMod.FX_FLUID.get();};track.loop=new Loop(tile,sound);track.pending=0;manager.play(track.loop);}
    }
    private static void shot(CustomMachineTile tile,SoundEvent sound,float volume){var p=tile.getBlockPos();Minecraft.getInstance().getSoundManager().play(new SimpleSoundInstance(sound,SoundSource.BLOCKS,volume,1,RandomSource.create(),p));}
    private static final class Loop extends AbstractTickableSoundInstance {
        private final WeakReference<CustomMachineTile> owner;private float gain;boolean retire;
        Loop(CustomMachineTile tile,SoundEvent sound){super(sound,SoundSource.BLOCKS,RandomSource.create());owner=new WeakReference<>(tile);looping=true;delay=0;volume=.01f;x=tile.getBlockPos().getX()+.5;y=tile.getBlockPos().getY()+.5;z=tile.getBlockPos().getZ()+.5;}
        @Override public boolean canStartSilent(){return true;}
        @Override public void tick(){var tile=owner.get();var mc=Minecraft.getInstance();if(tile==null||tile.isRemoved()||tile.getLevel()!=mc.level||mc.player==null||mc.player.distanceToSqr(x,y,z)>48*48){stop();return;}if(mc.isPaused())return;
            var state=((MachineFx.Access)tile).poc$fx();if((state.flags&4)==0)retire=true;
            gain=Math.max(0,Math.min(1,gain+(retire?-.12f:.08f)));pitch=(float)(.75+.3*state.speed);volume=.32f*gain;if(retire&&gain<=0)stop();
        }
    }
}
