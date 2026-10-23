package creation.matrix;

import com.mojang.serialization.MapCodec;
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
import net.minecraft.world.phys.BlockHitResult;
import net.neoforged.neoforge.fluids.FluidUtil;
import java.util.List;

public final class CoolantPortBlock extends BaseEntityBlock {
    public static final MapCodec<CoolantPortBlock> CODEC=simpleCodec(CoolantPortBlock::new);
    public CoolantPortBlock(Properties properties){super(properties);registerDefaultState(stateDefinition.any().setValue(EnergyPortBlock.FACING,Direction.NORTH).setValue(EnergyPortBlock.ACTIVE,false));}
    @Override protected MapCodec<CoolantPortBlock> codec(){return CODEC;}
    @Override protected RenderShape getRenderShape(BlockState state){return RenderShape.MODEL;}
    @Override protected void createBlockStateDefinition(StateDefinition.Builder<Block,BlockState> builder){builder.add(EnergyPortBlock.FACING,EnergyPortBlock.ACTIVE);}
    @Override public BlockState getStateForPlacement(BlockPlaceContext context){return defaultBlockState().setValue(EnergyPortBlock.FACING,context.getHorizontalDirection().getOpposite());}
    @Override public BlockEntity newBlockEntity(BlockPos pos,BlockState state){return new CoolantPortBlockEntity(pos,state);}
    @Override public <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level,BlockState state,BlockEntityType<T> type){return level.isClientSide?null:createTickerHelper(type,MatrixMod.COOLANT_ENTITY.get(),CoolantPortBlockEntity::tick);}
    @Override protected ItemInteractionResult useItemOn(ItemStack stack,BlockState state,Level level,BlockPos pos,Player player,InteractionHand hand,BlockHitResult hit){
        if(level.isClientSide)return ItemInteractionResult.SUCCESS;
        if(FluidUtil.interactWithFluidHandler(player,hand,level,pos,hit.getDirection()))return ItemInteractionResult.SUCCESS;
        return ItemInteractionResult.PASS_TO_DEFAULT_BLOCK_INTERACTION;
    }
    @Override protected InteractionResult useWithoutItem(BlockState state,Level level,BlockPos pos,Player player,BlockHitResult hit){
        if(!level.isClientSide&&level.getBlockEntity(pos) instanceof CoolantPortBlockEntity port)port.describe(player);
        return InteractionResult.sidedSuccess(level.isClientSide);
    }
    @Override public void appendHoverText(ItemStack stack,Item.TooltipContext context,List<Component> lines,TooltipFlag flag){lines.add(Component.translatable("poc.matrix.coolant.hint"));}
}
