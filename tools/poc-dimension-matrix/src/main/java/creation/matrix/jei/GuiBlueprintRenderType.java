package creation.matrix.jei;

import com.mojang.blaze3d.vertex.*;
import net.minecraft.client.renderer.RenderType;
import net.minecraft.client.renderer.GameRenderer;
import net.minecraft.client.renderer.texture.TextureAtlas;

/** 1.21.1 的GUI纹理着色器，显式关闭三维深度和背面剔除。 */
public final class GuiBlueprintRenderType extends RenderType {
    private GuiBlueprintRenderType(){super("poc_blueprint",DefaultVertexFormat.POSITION_TEX_COLOR,VertexFormat.Mode.QUADS,1024,false,false,()->{},()->{});}
    public static final RenderType TYPE=create("poc_blueprint",DefaultVertexFormat.POSITION_TEX_COLOR,VertexFormat.Mode.QUADS,65536,false,false,
        CompositeState.builder().setShaderState(new ShaderStateShard(GameRenderer::getPositionTexColorShader)).setTextureState(new TextureStateShard(TextureAtlas.LOCATION_BLOCKS,false,false))
            .setTransparencyState(TRANSLUCENT_TRANSPARENCY).setDepthTestState(NO_DEPTH_TEST).setCullState(NO_CULL).setWriteMaskState(COLOR_WRITE).createCompositeState(false));
}
