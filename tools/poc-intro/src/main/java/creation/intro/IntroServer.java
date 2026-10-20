package creation.intro;

import java.util.*;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.entity.decoration.ArmorStand;
import net.minecraft.world.level.storage.LevelResource;
import net.minecraft.world.phys.Vec3;
import net.neoforged.bus.api.EventPriority;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.event.server.*;
import net.neoforged.neoforge.event.tick.PlayerTickEvent;
import net.neoforged.neoforge.event.entity.EntityJoinLevelEvent;
import net.neoforged.neoforge.event.entity.player.PlayerEvent;
import net.neoforged.neoforge.event.entity.player.PlayerInteractEvent;
import net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent;
import net.neoforged.neoforge.network.PacketDistributor;

final class IntroServer {
    private static final String SEAT="poc_intro_temporary_seat";
    private static final Set<MinecraftServer> fresh=Collections.newSetFromMap(new IdentityHashMap<>());
    private static final Map<MinecraftServer,Optional<IntroProgress>> progress=new IdentityHashMap<>();
    private static final Map<UUID,Session> sessions=new HashMap<>();
    private static final class Session {
        final ServerPlayer player;final ServerLevel level;final Vec3 original;
        Vec3 anchor; ArmorStand seat; int ticks,readyTicks; boolean ready,started;
        Session(ServerPlayer p){player=p;level=p.serverLevel();original=p.position();anchor=original;}
    }
    static void register(){
        var bus=NeoForge.EVENT_BUS;
        bus.addListener(ServerAboutToStartEvent.class,event->{
            MinecraftServer server=event.getServer();
            if(IntroMod.BIRTHS.consume(server.getWorldPath(LevelResource.ROOT),server.getWorldData()))fresh.add(server);
        });
        bus.addListener(ServerStartedEvent.class,event->{
            MinecraftServer server=event.getServer();progress.put(server,Optional.ofNullable(IntroProgress.get(server.overworld(),fresh.contains(server))));
        });
        bus.addListener(EventPriority.LOWEST,PlayerEvent.PlayerLoggedInEvent.class,IntroServer::login);
        bus.addListener(PlayerTickEvent.Post.class,IntroServer::tick);
        bus.addListener(PlayerEvent.PlayerLoggedOutEvent.class,event->{if(event.getEntity() instanceof ServerPlayer p)finish(p,false);});
        bus.addListener(ServerStoppingEvent.class,event->{
            var copy=new ArrayList<>(sessions.values());
            for(Session s:copy)if(s.player.getServer()==event.getServer())finish(s.player,false);
            fresh.remove(event.getServer());progress.remove(event.getServer());
        });
        bus.addListener(LivingIncomingDamageEvent.class,event->{if(sessions.containsKey(event.getEntity().getUUID()))event.setCanceled(true);});
        bus.addListener(EventPriority.HIGHEST,PlayerInteractEvent.RightClickBlock.class,event->{if(locked(event.getEntity()))event.setCanceled(true);});
        bus.addListener(EventPriority.HIGHEST,PlayerInteractEvent.RightClickItem.class,event->{if(locked(event.getEntity()))event.setCanceled(true);});
        bus.addListener(EventPriority.HIGHEST,PlayerInteractEvent.LeftClickBlock.class,event->{if(locked(event.getEntity()))event.setCanceled(true);});
        bus.addListener(EventPriority.HIGHEST,PlayerInteractEvent.EntityInteract.class,event->{if(locked(event.getEntity()))event.setCanceled(true);});
        bus.addListener(EntityJoinLevelEvent.class,event->{
            if(!event.getLevel().isClientSide()&&event.loadedFromDisk()&&event.getEntity() instanceof ArmorStand&&event.getEntity().getTags().contains(SEAT))event.setCanceled(true);
        });
    }
    private static boolean locked(Player p){return !p.level().isClientSide()&&sessions.containsKey(p.getUUID());}
    private static void login(PlayerEvent.PlayerLoggedInEvent event){
        if(!(event.getEntity() instanceof ServerPlayer p))return;
        MinecraftServer server=p.getServer();
        if(!fresh.contains(server)||!server.isSingleplayerOwner(p.getGameProfile()))return;
        fresh.remove(server); // Consumed now: disconnect/reopen and LAN joins can never replay this scene.
        IntroProgress data=progress.getOrDefault(server,Optional.empty()).orElse(null);
        if(data==null){IntroMod.LOG.warn("[POC Intro] Missing new-world progress; refusing to lock player");return;}
        data.grant(p.getUUID());
        grantFlight(p);
        Session s=new Session(p);sessions.put(p.getUUID(),s);send(s,0);
    }
    private static void grantFlight(ServerPlayer p){
        if(!p.getAbilities().mayfly){p.getAbilities().mayfly=true;p.onUpdateAbilities();}
    }
    private static void tick(PlayerTickEvent.Post event){
        if(!(event.getEntity() instanceof ServerPlayer p))return;
        IntroProgress data=progress.getOrDefault(p.getServer(),Optional.empty()).orElse(null);
        if(data!=null&&data.hasFlight(p.getUUID()))grantFlight(p);
        Session s=sessions.get(p.getUUID());if(s==null)return;
        s.ticks++;p.fallDistance=0;p.setDeltaMovement(Vec3.ZERO);
        if(s.player.hasDisconnected()||s.player.serverLevel()!=s.level||s.ticks>12000){finish(p,true);return;}
        if(!s.started){
            if(s.ready)s.readyTicks++;
            // Skyblock Builder may finish the spawn island after its login event. Keep the player safe while it does.
            if(p.position().distanceToSqr(s.anchor)>.001)p.teleportTo(s.level,s.anchor.x,s.anchor.y,s.anchor.z,p.getYRot(),p.getXRot());
            if(s.ready&&s.readyTicks>=10&&s.ticks%5==0){
                BlockPos table=findTable(s.level,p.blockPosition());
                if(table!=null){
                    s.anchor=new Vec3(table.getX()+.5,table.getY()+1.01,table.getZ()+.5);
                    p.teleportTo(s.level,s.anchor.x,s.anchor.y,s.anchor.z,180,10);
                    s.seat=new ArmorStand(s.level,s.anchor.x,s.anchor.y+.1,s.anchor.z);
                    var marker=new net.minecraft.nbt.CompoundTag();marker.putBoolean("Marker",true);s.seat.readAdditionalSaveData(marker);
                    s.seat.setInvisible(true);s.seat.setNoGravity(true);s.seat.setInvulnerable(true);s.seat.setSilent(true);s.seat.addTag(SEAT);
                    s.seat.setYRot(180);s.seat.yBodyRot=180;s.seat.yHeadRot=180;
                    s.level.addFreshEntity(s.seat);p.startRiding(s.seat,true);s.started=true;send(s,1);
                }
            }
            if(s.ticks%40==0)send(s,0);
            if((!s.ready&&s.ticks>2400)||(s.ready&&s.readyTicks>240)){
                IntroMod.LOG.warn("[POC Intro] New world did not supply the Rain Ultimate Crafting Table/client readiness; safely releasing player");finish(p,true);
            }
        }else if(s.seat!=null&&p.getVehicle()!=s.seat){p.startRiding(s.seat,true);}
    }
    private static BlockPos findTable(ServerLevel level,BlockPos origin){
        for(BlockPos pos:BlockPos.betweenClosed(origin.offset(-5,-8,-5),origin.offset(5,2,5))){
            if(BuiltInRegistries.BLOCK.getKey(level.getBlockState(pos).getBlock()).toString().equals("extendedcrafting:ultimate_table"))return pos.immutable();
        }
        return null;
    }
    static void action(Player source,int action){
        if(!(source instanceof ServerPlayer p))return;
        Session s=sessions.get(p.getUUID());if(s==null)return;
        if(action==0)s.ready=true;
        else if(action==1&&s.started&&s.ticks>=300)finish(p,true);
    }
    private static void send(Session s,int phase){PacketDistributor.sendToPlayer(s.player,new IntroPackets.Scene(phase,s.anchor.x,s.anchor.y,s.anchor.z,180));}
    private static void finish(ServerPlayer p,boolean notify){
        Session s=sessions.remove(p.getUUID());if(s==null)return;
        p.stopRiding();if(s.seat!=null)s.seat.discard();
        p.fallDistance=0;p.setDeltaMovement(Vec3.ZERO);grantFlight(p);
        if(s.started&&p.serverLevel()==s.level)p.teleportTo(s.level,s.anchor.x,s.anchor.y,s.anchor.z,180,10);
        // No invulnerability, game-mode, gravity or effect flags were changed on the player.
        if(notify&&!p.hasDisconnected())send(s,2);
    }
}
