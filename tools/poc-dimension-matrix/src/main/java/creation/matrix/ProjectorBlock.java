package creation.matrix;

import com.mojang.serialization.MapCodec;
import net.minecraft.core.BlockPos;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.util.RandomSource;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.*;
import net.minecraft.world.level.block.state.properties.BooleanProperty;
import net.minecraft.world.item.*;
import net.minecraft.network.chat.Component;
import java.util.List;

public final class ProjectorBlock extends Block {
    public static final BooleanProperty ACTIVE=BooleanProperty.create("active");
    public static final MapCodec<ProjectorBlock> CODEC=simpleCodec(ProjectorBlock::new);
    public ProjectorBlock(Properties properties){super(properties);registerDefaultState(stateDefinition.any().setValue(ACTIVE,false));}
    @Override protected MapCodec<ProjectorBlock> codec(){return CODEC;}
    @Override protected void createBlockStateDefinition(StateDefinition.Builder<Block,BlockState> builder){builder.add(ACTIVE);}
    @Override protected void tick(BlockState state,ServerLevel level,BlockPos pos,RandomSource random){
        boolean active=MatrixThermals.modulePowered(level,pos);
        if(state.getValue(ACTIVE)!=active)level.setBlock(pos,state.setValue(ACTIVE,active),3);
        if(active)level.scheduleTick(pos,this,20);
    }
    @Override public void appendHoverText(ItemStack stack,Item.TooltipContext context,List<Component> lines,TooltipFlag flag){lines.add(Component.translatable("poc.matrix.projector.hint"));lines.add(Component.translatable("poc.matrix.projector.danger"));}
}
