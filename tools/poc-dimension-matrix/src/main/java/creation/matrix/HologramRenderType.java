package creation.matrix;

import com.mojang.blaze3d.vertex.DefaultVertexFormat;
import com.mojang.blaze3d.vertex.VertexFormat;
import net.minecraft.client.renderer.RenderStateShard;
import net.minecraft.client.renderer.RenderType;

/** 自发光、SRC_ALPHA+ONE加色光晕，保留方块深度遮挡，不写入深度。 */
public final class HologramRenderType extends RenderStateShard {
    private HologramRenderType() { super("poc_hologram", () -> {}, () -> {}); }
    public static final RenderType GLOW = RenderType.create("poc_dimension_hologram",
        DefaultVertexFormat.POSITION_COLOR, VertexFormat.Mode.QUADS, 32768, false, false,
        RenderType.CompositeState.builder().setShaderState(POSITION_COLOR_SHADER)
            .setTransparencyState(LIGHTNING_TRANSPARENCY).setCullState(NO_CULL)
            .setDepthTestState(LEQUAL_DEPTH_TEST).setWriteMaskState(COLOR_WRITE)
            .setOutputState(ITEM_ENTITY_TARGET).createCompositeState(false));
}
