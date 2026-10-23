package creation.matrix;

import net.neoforged.fml.common.Mod;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.neoforge.registries.*;
import net.neoforged.neoforge.capabilities.*;
import net.minecraft.core.registries.Registries;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.block.entity.BlockEntityType;
import net.minecraft.sounds.SoundEvent;
import net.minecraft.resources.ResourceLocation;

@Mod("poc_dimension_matrix")
public final class MatrixMod {
    public static final DeferredRegister.Blocks BLOCKS=DeferredRegister.createBlocks("poc_dimension_matrix");
    public static final DeferredRegister.Items ITEMS=DeferredRegister.createItems("poc_dimension_matrix");
    public static final DeferredRegister<BlockEntityType<?>> ENTITIES=DeferredRegister.create(Registries.BLOCK_ENTITY_TYPE,"poc_dimension_matrix");
    public static final DeferredRegister<SoundEvent> SOUNDS=DeferredRegister.create(Registries.SOUND_EVENT,"poc_dimension_matrix");
    private static DeferredHolder<SoundEvent,SoundEvent> sound(String name){return SOUNDS.register(name,()->SoundEvent.createVariableRangeEvent(ResourceLocation.fromNamespaceAndPath("poc_dimension_matrix",name)));}
    public static final DeferredHolder<SoundEvent,SoundEvent> POWER_ON=sound("power_on"),ACCELERATE=sound("accelerate"),FULL_SPEED=sound("full_speed"),DECELERATE=sound("decelerate");
    public static final DeferredHolder<SoundEvent,SoundEvent> WARNING=sound("warning");
    public static final DeferredHolder<SoundEvent,SoundEvent> FX_START=sound("fx_start"),FX_STOP=sound("fx_stop"),FX_MINING=sound("fx_mining"),FX_DYEING=sound("fx_dyeing"),FX_FLUID=sound("fx_fluid"),FX_INSPECTOR=sound("fx_inspector");
    private static BlockBehaviour.Properties properties(){return BlockBehaviour.Properties.of().strength(5,12).sound(SoundType.METAL)
        .requiresCorrectToolForDrops().lightLevel(s->s.getValue(EnergyPortBlock.ACTIVE)?7:0);}
    public static final DeferredBlock<EnergyPortBlock> INPUT_PORT=BLOCKS.register("energy_input_port",()->new EnergyPortBlock(true,properties()));
    public static final DeferredBlock<EnergyPortBlock> OUTPUT_PORT=BLOCKS.register("energy_output_port",()->new EnergyPortBlock(false,properties()));
    public static final DeferredBlock<CoolantPortBlock> COOLANT_PORT=BLOCKS.register("coolant_input_port",()->new CoolantPortBlock(properties()));
    public static final DeferredBlock<ProjectorBlock> PROJECTOR=BLOCKS.register("projection_module",()->new ProjectorBlock(BlockBehaviour.Properties.of().strength(5,12).sound(SoundType.METAL).requiresCorrectToolForDrops().lightLevel(s->s.getValue(ProjectorBlock.ACTIVE)?15:0)));
    public static final DeferredHolder<BlockEntityType<?>,BlockEntityType<EnergyPortBlockEntity>> PORT_ENTITY=ENTITIES.register("energy_port",
        ()->BlockEntityType.Builder.of(EnergyPortBlockEntity::new,INPUT_PORT.get(),OUTPUT_PORT.get()).build(null));
    public static final DeferredHolder<BlockEntityType<?>,BlockEntityType<CoolantPortBlockEntity>> COOLANT_ENTITY=ENTITIES.register("coolant_port",()->BlockEntityType.Builder.of(CoolantPortBlockEntity::new,COOLANT_PORT.get()).build(null));
    static {ITEMS.registerSimpleBlockItem(INPUT_PORT);ITEMS.registerSimpleBlockItem(OUTPUT_PORT);ITEMS.registerSimpleBlockItem(COOLANT_PORT);ITEMS.registerSimpleBlockItem(PROJECTOR);}
    public MatrixMod(IEventBus bus){
        BLOCKS.register(bus);ITEMS.register(bus);ENTITIES.register(bus);SOUNDS.register(bus);
        bus.addListener(this::capabilities);
    }
    private void capabilities(RegisterCapabilitiesEvent event){
        event.registerBlockEntity(Capabilities.EnergyStorage.BLOCK,PORT_ENTITY.get(),EnergyPortBlockEntity::capability);
        event.registerBlockEntity(Capabilities.FluidHandler.BLOCK,COOLANT_ENTITY.get(),CoolantPortBlockEntity::capability);
    }
}
