package creation.matrix;
import com.mojang.blaze3d.vertex.*;
import net.minecraft.client.renderer.*;
public final class AssemblyRenderType extends RenderStateShard {
    private AssemblyRenderType(){super("poc_assembly",()->{},()->{});}
    public static final RenderType SOLID=RenderType.create("poc_formed_machine_solid",DefaultVertexFormat.POSITION_COLOR,VertexFormat.Mode.QUADS,65536,false,false,
        RenderType.CompositeState.builder().setShaderState(POSITION_COLOR_SHADER).setTransparencyState(NO_TRANSPARENCY).setCullState(NO_CULL).setDepthTestState(LEQUAL_DEPTH_TEST).setWriteMaskState(COLOR_DEPTH_WRITE).setOutputState(MAIN_TARGET).createCompositeState(false));
    public static final RenderType GLASS=RenderType.create("poc_formed_machine_glass",DefaultVertexFormat.POSITION_COLOR,VertexFormat.Mode.QUADS,32768,false,true,
        RenderType.CompositeState.builder().setShaderState(POSITION_COLOR_SHADER).setTransparencyState(TRANSLUCENT_TRANSPARENCY).setCullState(NO_CULL).setDepthTestState(LEQUAL_DEPTH_TEST).setWriteMaskState(COLOR_WRITE).setOutputState(ITEM_ENTITY_TARGET).createCompositeState(false));
}
