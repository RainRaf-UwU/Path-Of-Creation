package creation.intro;

import java.util.*;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import dev.ftb.mods.ftbquests.quest.ServerQuestFile;
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
import net.neoforged.fml.loading.FMLPaths;

final class IntroServer {
    private static final String SEAT="poc_intro_temporary_seat";
    private static final Set<MinecraftServer> fresh=Collections.newSetFromMap(new IdentityHashMap<>());
    private static final Map<MinecraftServer,Optional<IntroProgress>> progress=new IdentityHashMap<>();
    private static final Map<UUID,Session> sessions=new HashMap<>();
    private static final Map<MinecraftServer,SceneFreeze> freezes=new IdentityHashMap<>();
    private static final Set<UUID> attemptedChapter=new HashSet<>();
    private static final class Session {
        final ServerPlayer player;final ServerLevel level;final Vec3 original;
        final boolean chapter;final String story;final float yaw,pitch;
        Vec3 anchor; ArmorStand seat; int ticks,readyTicks; boolean ready,started;
        Session(ServerPlayer p){this(p,false,"");}
        Session(ServerPlayer p,boolean chapter,String story){player=p;level=p.serverLevel();original=p.position();anchor=original;this.chapter=chapter;this.story=story;yaw=chapter?p.getYRot():180;pitch=chapter?p.getXRot():10;}
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
        bus.addListener(PlayerEvent.PlayerLoggedOutEvent.class,event->{if(event.getEntity() instanceof ServerPlayer p){finish(p,false);attemptedChapter.remove(p.getUUID());}});
        bus.addListener(ServerStoppingEvent.class,event->{
            var copy=new ArrayList<>(sessions.values());
            for(Session s:copy)if(s.player.getServer()==event.getServer())finish(s.player,false);
            fresh.remove(event.getServer());progress.remove(event.getServer());freezes.remove(event.getServer());
            attemptedChapter.clear();
        });
        bus.addListener(LivingIncomingDamageEvent.class,event->{if(sessions.containsKey(event.getEntity().getUUID()))event.setCanceled(true);});
        bus.addListener(PlayerEvent.ItemCraftedEvent.class,event->crafted(event.getEntity(),event.getCrafting()));
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
        checkExistingChapter(p);
        if(!fresh.contains(server)||!server.isSingleplayerOwner(p.getGameProfile()))return;
        fresh.remove(server); // Consumed now: disconnect/reopen and LAN joins can never replay this scene.
        IntroProgress data=progress.getOrDefault(server,Optional.empty()).orElse(null);
        if(data==null){IntroMod.LOG.warn("[POC Intro] Missing new-world progress; refusing to lock player");return;}
        data.grant(p.getUUID());
        grantFlight(p);
        Session s=new Session(p);sessions.put(p.getUUID(),s);send(s,0);
    }
    private static IntroProgress data(ServerPlayer p){
        MinecraftServer server=p.getServer();
        IntroProgress data=progress.getOrDefault(server,Optional.empty()).orElse(null);
        if(data==null){data=IntroProgress.get(server.overworld(),true);progress.put(server,Optional.of(data));}
        return data;
    }
    /** Baseline once, before new crafting: old completed quests never become a replay request. */
    private static void checkExistingChapter(ServerPlayer p){
        IntroProgress data=data(p);if(data.chapterKnown(p.getUUID()))return;
        ServerQuestFile file=ServerQuestFile.INSTANCE;
        if(file==null||file.server!=p.getServer()||file.isLoading())return;
        file.getTeamData(p).ifPresent(team->data.checkChapter(p.getUUID(),
            team.getCompletedTime(0x180E8919165FF169L).isPresent()||team.getCompletedTime(0x2ABCB692F4717BC5L).isPresent()
            ||team.getProgress(0x2A074D4057754076L)>0));
    }
    static void crafted(Player source,ItemStack result){
        if(!(source instanceof ServerPlayer p)||result==null||!result.is(Items.CRAFTING_TABLE)||p.isCreative()||p.isSpectator())return;
        // The slot hook runs inside the inventory transaction; start only on a subsequent player tick.
        checkExistingChapter(p);data(p).queueChapter(p.getUUID());
    }
    private static SceneFreeze freeze(MinecraftServer server){
        return freezes.computeIfAbsent(server,s->new SceneFreeze(s.tickRateManager()::isFrozen,s.tickRateManager()::setFrozen));
    }
    private static void startChapter(ServerPlayer p){
        if(!attemptedChapter.add(p.getUUID()))return;
        try{
            String story=ChapterOneStory.read(FMLPaths.CONFIGDIR.get().resolve("poc-intro/chapter1.json"));
            // Returning the carried stack is vanilla closeContainer behaviour (also safe with a full inventory).
            p.closeContainer();Session s=new Session(p,true,story);sessions.put(p.getUUID(),s);
            freeze(p.getServer()).enter(p.getUUID());send(s,3);
        }catch(Exception failure){
            IntroMod.LOG.error("[POC Intro] Cannot start chapter one; fix config/poc-intro/chapter1.json and reconnect",failure);
            finish(p,true);
        }
    }
    private static void grantFlight(ServerPlayer p){
        if(!p.getAbilities().mayfly){p.getAbilities().mayfly=true;p.onUpdateAbilities();}
    }
    private static void tick(PlayerTickEvent.Post event){
        if(!(event.getEntity() instanceof ServerPlayer p))return;
        IntroProgress data=progress.getOrDefault(p.getServer(),Optional.empty()).orElse(null);
        if(data!=null&&data.hasFlight(p.getUUID()))grantFlight(p);
        if(data==null||!data.chapterKnown(p.getUUID())){checkExistingChapter(p);data=progress.getOrDefault(p.getServer(),Optional.empty()).orElse(null);}
        Session s=sessions.get(p.getUUID());
        if(s==null){
            if(data!=null&&data.chapterPending(p.getUUID())&&p.tickCount%10==0&&p.isAlive()&&!p.isPassenger()&&!p.isInWaterOrBubble()&&!p.isFallFlying()
                &&(p.onGround()||p.getAbilities().flying))startChapter(p);
            return;
        }
        s.ticks++;p.fallDistance=0;p.setDeltaMovement(Vec3.ZERO);
        if(s.player.hasDisconnected()||s.player.serverLevel()!=s.level||s.ticks>12000){finish(p,true);return;}
        if(s.chapter){
            if(p.position().distanceToSqr(s.anchor)>.001)p.teleportTo(s.level,s.anchor.x,s.anchor.y,s.anchor.z,s.yaw,s.pitch);
            if(!s.started&&s.ready){s.started=true;send(s,4);}
            if(!s.started&&s.ticks%40==0)send(s,3);
            if(!s.ready&&s.ticks>2400)finish(p,true);
            return;
        }
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
                    s.level.addFreshEntity(s.seat);p.startRiding(s.seat,true);s.started=true;freeze(p.getServer()).enter(p.getUUID());send(s,1);
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
        else if(action==2)finish(p,true);
        else if(action==1&&s.started&&(s.chapter||s.ticks>=300)){
            if(s.chapter){data(p).completeChapter(p.getUUID());finish(p,true);return;}
            finish(p,true);
            IntroProgress data=progress.getOrDefault(p.getServer(),Optional.empty()).orElse(null);
            if(data!=null&&data.claimManual(p.getUUID()))ManualItem.give(p);
        }
    }
    private static void send(Session s,int phase){PacketDistributor.sendToPlayer(s.player,new IntroPackets.Scene(phase,s.anchor.x,s.anchor.y,s.anchor.z,s.yaw,s.pitch,s.chapter&&(phase==3||phase==4)?s.story:""));}
    private static void finish(ServerPlayer p,boolean notify){
        Session s=sessions.remove(p.getUUID());if(s==null)return;
        try{
            if(!s.chapter)p.stopRiding();if(s.seat!=null)s.seat.discard();
            p.fallDistance=0;p.setDeltaMovement(Vec3.ZERO);if(!s.chapter)grantFlight(p);
            if(s.started&&p.serverLevel()==s.level)p.teleportTo(s.level,s.anchor.x,s.anchor.y,s.anchor.z,s.yaw,s.pitch);
            // No invulnerability, game-mode, gravity or effect flags were changed on the player.
            if(notify&&!p.hasDisconnected())send(s,s.chapter&&!data(p).chapterDone(p.getUUID())?5:2);
        }finally{freeze(p.getServer()).leave(p.getUUID());}
    }
}
