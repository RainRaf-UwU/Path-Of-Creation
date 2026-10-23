package creation.intro;

import net.minecraft.world.item.*;
import net.minecraft.world.*;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.server.level.ServerPlayer;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.neoforge.registries.*;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.event.RegisterCommandsEvent;
import net.neoforged.neoforge.network.PacketDistributor;
import net.minecraft.commands.Commands;

/** Common-only registration and delivery; no client classes in server item logic. */
final class ManualItem extends Item {
    static final DeferredRegister.Items ITEMS=DeferredRegister.createItems("poc_intro");
    static final DeferredItem<ManualItem> BOOK=ITEMS.register("tech_manual",()->new ManualItem(new Item.Properties().stacksTo(1)));
    ManualItem(Properties properties){super(properties);}
    static void register(IEventBus bus){
        ITEMS.register(bus);
        bus.addListener(net.neoforged.neoforge.event.BuildCreativeModeTabContentsEvent.class,event->{
            if(event.getTabKey().location().equals(net.minecraft.resources.ResourceLocation.parse("minecraft:tools_and_utilities")))event.accept(BOOK.get());
        });
        NeoForge.EVENT_BUS.addListener(RegisterCommandsEvent.class,event->event.getDispatcher().register(Commands.literal("pocmanual").executes(context->{
            ServerPlayer player=context.getSource().getPlayerOrException();
            if(!player.getInventory().contains(new ItemStack(BOOK.get())))give(player);
            PacketDistributor.sendToPlayer(player,new IntroPackets.Manual());return 1;
        })));
    }
    static void give(ServerPlayer player){ItemStack stack=new ItemStack(BOOK.get());if(!player.getInventory().add(stack))player.drop(stack,false);}
    @Override public InteractionResultHolder<ItemStack> use(Level level,Player player,InteractionHand hand){
        if(player instanceof ServerPlayer serverPlayer)PacketDistributor.sendToPlayer(serverPlayer,new IntroPackets.Manual());
        return InteractionResultHolder.sidedSuccess(player.getItemInHand(hand),level.isClientSide());
    }
}
