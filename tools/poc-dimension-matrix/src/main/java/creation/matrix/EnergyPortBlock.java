package creation.matrix;

import com.mojang.serialization.MapCodec;
import net.minecraft.ChatFormatting;
import net.minecraft.core.*;
import net.minecraft.network.chat.Component;
import net.minecraft.world.*;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.*;
import net.minecraft.world.item.context.BlockPlaceContext;
import net.minecraft.world.level.*;
import net.minecraft.world.level.block.*;
import net.minecraft.world.level.block.entity.*;
import net.minecraft.world.level.block.state.*;
import net.minecraft.world.level.block.state.properties.*;
import net.minecraft.world.phys.BlockHitResult;
import java.util.List;

public final class EnergyPortBlock extends BaseEntityBlock {
    public static final DirectionProperty FACING=BlockStateProperties.HORIZONTAL_FACING;
    public static final BooleanProperty ACTIVE=BooleanProperty.create("active");
    private static final MapCodec<EnergyPortBlock> INPUT_CODEC=simpleCodec(p->new EnergyPortBlock(true,p));
    private static final MapCodec<EnergyPortBlock> OUTPUT_CODEC=simpleCodec(p->new EnergyPortBlock(false,p));
    public final boolean input;
    public EnergyPortBlock(boolean input,Properties properties){
        super(properties);this.input=input;
        registerDefaultState(stateDefinition.any().setValue(FACING,Direction.NORTH).setValue(ACTIVE,false));
    }
    @Override protected MapCodec<EnergyPortBlock> codec(){return input?INPUT_CODEC:OUTPUT_CODEC;}
    @Override protected void createBlockStateDefinition(StateDefinition.Builder<Block,BlockState> builder){builder.add(FACING,ACTIVE);}
    @Override public BlockState getStateForPlacement(BlockPlaceContext context){return defaultBlockState().setValue(FACING,context.getHorizontalDirection().getOpposite());}
    @Override protected RenderShape getRenderShape(BlockState state){return RenderShape.MODEL;}
    @Override public BlockEntity newBlockEntity(BlockPos pos,BlockState state){return new EnergyPortBlockEntity(pos,state);}
    @Override public <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level,BlockState state,BlockEntityType<T> type){
        return level.isClientSide?null:createTickerHelper(type,MatrixMod.PORT_ENTITY.get(),EnergyPortBlockEntity::serverTick);
    }
    @Override protected InteractionResult useWithoutItem(BlockState state,Level level,BlockPos pos,Player player,BlockHitResult hit){
        if(!level.isClientSide && level.getBlockEntity(pos) instanceof EnergyPortBlockEntity port)port.describe(player);
        return InteractionResult.sidedSuccess(level.isClientSide);
    }
    @Override public void appendHoverText(ItemStack stack,Item.TooltipContext context,List<Component> lines,TooltipFlag flag){
        lines.add(Component.translatable(input?"poc.matrix.port.input_hint":"poc.matrix.port.output_hint").withStyle(input?ChatFormatting.AQUA:ChatFormatting.GOLD));
        lines.add(Component.translatable("poc.matrix.port.rate_hint").withStyle(ChatFormatting.GRAY));
    }
}
