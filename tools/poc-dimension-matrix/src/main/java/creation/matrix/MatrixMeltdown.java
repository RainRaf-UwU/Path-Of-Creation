package creation.matrix;

import java.util.*;
import net.minecraft.core.*;
import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.nbt.*;
import net.minecraft.server.level.*;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.*;
import net.minecraft.world.level.block.*;
import net.minecraft.world.level.saveddata.SavedData;
import net.minecraft.world.phys.AABB;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.event.tick.LevelTickEvent;

/** 范围严格有界的分批地形爆炸，任务跟随维度存档，服务器重启后继续。 */
@EventBusSubscriber(modid="poc_dimension_matrix")
public final class MatrixMeltdown extends SavedData {
    private static final TicketType<Long> TICKET=TicketType.create("poc_matrix_meltdown",Long::compare,40);
    private static final Factory<MatrixMeltdown> FACTORY=new Factory<>(MatrixMeltdown::new,MatrixMeltdown::load);
    private static final class Job {
        BlastVolume volume;BlockPos center;long id;int cursor,age;ChunkPos ticket;
    }
    private final List<Job> jobs=new ArrayList<>();
    private static MatrixMeltdown data(ServerLevel level){return level.getDataStorage().computeIfAbsent(FACTORY,"poc_matrix_meltdowns");}
    public static void enqueue(ServerLevel level,BlockPos center){
        var data=data(level);if(data.jobs.stream().anyMatch(existing->existing.center.equals(center)))return;
        var job=new Job();job.center=center.immutable();job.id=center.asLong()^level.getGameTime();
        job.volume=BlastVolume.around(center.getX(),center.getY(),center.getZ(),level.getMinBuildHeight(),level.getMaxBuildHeight());
        data.jobs.add(job);data.setDirty();
        var source=MatrixHazards.source(level,center.getCenter());
        var v=job.volume;var box=new AABB(v.minChunkX()*16,v.minY(),v.minChunkZ()*16,(v.minChunkX()+11)*16,v.maxY(),(v.minChunkZ()+11)*16);
        for(var player:level.getEntitiesOfClass(Player.class,box))MatrixHazards.damage(player,1000,source);
        level.explode(null,source,null,center.getX()+.5,center.getY()+.5,center.getZ()+.5,8,false,Level.ExplosionInteraction.NONE);
    }
    @SubscribeEvent public static void tick(LevelTickEvent.Post event){
        if(!(event.getLevel() instanceof ServerLevel level))return;
        var data=data(level);if(data.jobs.isEmpty())return;
        long deadline=System.nanoTime()+4_000_000;boolean terrainWork=false;
        for(var iterator=data.jobs.iterator();iterator.hasNext();){
            var job=iterator.next();job.age++;
            if(job.age<=900&&job.age%20==0)cloud(level,job);
            if(!terrainWork&&job.cursor<job.volume.cells()){clearSome(level,job,deadline);terrainWork=true;}
            if(job.cursor>=job.volume.cells()&&job.age>900){release(level,job);iterator.remove();}
        }data.setDirty();
    }
    private static void clearSome(ServerLevel level,Job job,long deadline){
        var v=job.volume;var next=new ChunkPos(v.chunkX(job.cursor),v.chunkZ(job.cursor));
        if(!next.equals(job.ticket)){release(level,job);job.ticket=next;}
        level.getChunkSource().addRegionTicket(TICKET,next,0,job.id);
        var chunk=level.getChunkSource().getChunkNow(next.x,next.z);if(chunk==null)return;
        var pos=new BlockPos.MutableBlockPos();int scanned=0;
        while(job.cursor<v.cells()&&scanned++<16384&&System.nanoTime()<deadline){
            if(v.chunkX(job.cursor)!=next.x||v.chunkZ(job.cursor)!=next.z){release(level,job);break;}
            pos.set(v.x(job.cursor),v.y(job.cursor),v.z(job.cursor));job.cursor++;
            var state=chunk.getBlockState(pos);
            if(!state.isAir()&&state.getDestroySpeed(level,pos)>=0)level.setBlock(pos,Blocks.AIR.defaultBlockState(),Block.UPDATE_CLIENTS|Block.UPDATE_KNOWN_SHAPE|Block.UPDATE_SUPPRESS_DROPS);
        }
        if(job.cursor>=v.cells())release(level,job);
    }
    private static void release(ServerLevel level,Job job){if(job.ticket!=null){level.getChunkSource().removeRegionTicket(TICKET,job.ticket,0,job.id);job.ticket=null;}}
    private static void cloud(ServerLevel level,Job job){
        for(var point:MushroomShape.points(job.age))for(var player:level.players()){
            double x=job.center.getX()+point.x(),y=job.center.getY()+point.y(),z=job.center.getZ()+point.z();
            if(player.distanceToSqr(job.center.getCenter())<512*512)level.sendParticles(player,ParticleTypes.CAMPFIRE_SIGNAL_SMOKE,true,x,y,z,3,3,2,3,.02);
        }
    }
    @Override public CompoundTag save(CompoundTag tag,HolderLookup.Provider registries){
        var list=new ListTag();for(var job:jobs){
            var value=new CompoundTag();value.putLong("center",job.center.asLong());value.putLong("id",job.id);value.putInt("cursor",job.cursor);value.putInt("age",job.age);
            value.putIntArray("volume",new int[]{job.volume.minChunkX(),job.volume.minY(),job.volume.minChunkZ(),job.volume.maxY()});list.add(value);
        }tag.put("jobs",list);return tag;
    }
    private static MatrixMeltdown load(CompoundTag tag,HolderLookup.Provider registries){
        var data=new MatrixMeltdown();for(var value:tag.getList("jobs",Tag.TAG_COMPOUND)){
            var saved=(CompoundTag)value;int[] v=saved.getIntArray("volume");if(v.length!=4||v[3]<=v[1]||v[3]-v[1]>BlastVolume.SIZE)continue;
            var job=new Job();job.center=BlockPos.of(saved.getLong("center"));job.id=saved.getLong("id");job.volume=new BlastVolume(v[0],v[1],v[2],v[3]);
            job.cursor=Math.max(0,Math.min(job.volume.cells(),saved.getInt("cursor")));job.age=Math.max(0,saved.getInt("age"));data.jobs.add(job);
        }return data;
    }
}
