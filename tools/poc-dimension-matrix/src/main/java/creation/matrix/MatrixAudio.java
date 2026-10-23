package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import java.lang.ref.WeakReference;
import java.util.Map;
import java.util.WeakHashMap;
import net.minecraft.client.Minecraft;
import net.minecraft.client.resources.sounds.AbstractTickableSoundInstance;
import net.minecraft.client.resources.sounds.SimpleSoundInstance;
import net.minecraft.core.BlockPos;
import net.minecraft.sounds.SoundEvent;
import net.minecraft.sounds.SoundSource;
import net.minecraft.util.RandomSource;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.fml.event.lifecycle.FMLClientSetupEvent;

@EventBusSubscriber(modid="poc_dimension_matrix",value=Dist.CLIENT,bus=EventBusSubscriber.Bus.MOD)
public final class MatrixAudio {
    private static final class Track {
        final AudioPhase edges=new AudioPhase();
        MachineSound loop;
        int pending;
        int alarmTicks;
    }
    // Track 与声音均不强引用机器；声音自身在卸载、换世界或距离过远时停止。
    private static final Map<CustomMachineTile,Track> TRACKS=new WeakHashMap<>();
    @SubscribeEvent public static void setup(FMLClientSetupEvent event){event.enqueueWork(()->MatrixSoundBridge.tick=MatrixAudio::tick);}
    private static void tick(CustomMachineTile tile,Rotor rotor){
        var mc=Minecraft.getInstance();
        var track=TRACKS.computeIfAbsent(tile,k->new Track());
        boolean startup=track.edges.powerOn(rotor.powered);
        double heat=((MatrixAccess)tile).matrix$getThermal().model.fraction();
        int interval=HeatModel.alarmInterval(heat);track.alarmTicks=Math.min(track.alarmTicks,interval);
        if(interval!=Integer.MAX_VALUE&&mc.player!=null&&mc.player.distanceToSqr(center(tile).getCenter())<128*128){
            if(--track.alarmTicks<=0){
                var pos=center(tile);mc.getSoundManager().play(new SimpleSoundInstance(MatrixMod.WARNING.get(),SoundSource.BLOCKS,(float)(.25+.7*heat),HeatModel.alarmPitch(heat),RandomSource.create(),pos));
                track.alarmTicks=interval;
            }
        }else track.alarmTicks=0;
        if(mc.player==null || mc.level!=tile.getLevel() || mc.player.distanceToSqr(center(tile).getCenter())>48*48
                || mc.options.getSoundSourceVolume(SoundSource.BLOCKS)==0 || mc.options.getSoundSourceVolume(SoundSource.MASTER)==0){
            if(track.loop!=null){track.loop.retire=true;track.loop=null;}return;
        }
        var manager=mc.getSoundManager();
        if(startup)manager.play(new MachineSound(tile,null,MatrixMod.POWER_ON.get()));
        var phase=AudioPhase.phase(rotor);
        if(track.loop!=null && (track.loop.phase!=phase || track.loop.isStopped() || ++track.pending>5&&!manager.isActive(track.loop))){
            track.loop.retire=true;track.loop=null;
        }
        if(phase!=AudioPhase.Phase.SILENT && track.loop==null){
            SoundEvent sound=switch(phase){
                case ACCELERATING->MatrixMod.ACCELERATE.get();
                case FULL_SPEED->MatrixMod.FULL_SPEED.get();
                case DECELERATING->MatrixMod.DECELERATE.get();
                default->throw new IllegalStateException();
            };
            track.pending=0;track.loop=new MachineSound(tile,phase,sound);manager.play(track.loop);
        }
    }
    private static BlockPos center(CustomMachineTile tile){
        return tile.getBlockPos().relative(tile.getComponentManager().facing().getOpposite(),5).above(4);
    }
    private static final class MachineSound extends AbstractTickableSoundInstance {
        private final WeakReference<CustomMachineTile> owner;
        private final AudioPhase.Phase phase;
        private int age;
        private float gain;
        private boolean retire;
        MachineSound(CustomMachineTile tile,AudioPhase.Phase phase,SoundEvent sound){
            super(sound,SoundSource.BLOCKS,RandomSource.create());
            owner=new WeakReference<>(tile);this.phase=phase;looping=phase!=null;delay=0;
            var pos=center(tile);x=pos.getX()+0.5;y=pos.getY()+0.5;z=pos.getZ()+0.5;
            // OpenAL 以零音量启动时会丢弃声音；首 tick 使用很低的正值再平滑淡入。
            volume=0.01f;pitch=phase==null?1:AudioPhase.pitch(((MatrixAccess)tile).matrix$getRotor());
        }
        @Override public boolean canStartSilent(){return true;}
        @Override public void tick(){
            var tile=owner.get();var mc=Minecraft.getInstance();
            if(tile==null || tile.isRemoved() || tile.getLevel()!=mc.level || mc.player==null || mc.player.distanceToSqr(x,y,z)>48*48){stop();return;}
            if(mc.isPaused())return;
            var rotor=((MatrixAccess)tile).matrix$getRotor();
            if(phase==null){
                if(!rotor.powered || ++age>40){stop();return;}
                volume=0.65f;return;
            }
            if(AudioPhase.phase(rotor)!=phase)retire=true;
            gain=Math.max(0,Math.min(1,gain+(retire?-0.25f:0.25f)));
            pitch=AudioPhase.pitch(rotor);volume=AudioPhase.volume(rotor)*gain;
            if(retire && gain<=0)stop();
        }
    }
}
