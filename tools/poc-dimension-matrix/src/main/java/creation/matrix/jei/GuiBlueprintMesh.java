package creation.matrix.jei;

import java.util.*;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.renderer.block.model.BakedQuad;
import net.minecraft.client.resources.model.BakedModel;
import net.minecraft.core.*;
import net.minecraft.util.RandomSource;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.state.BlockState;
import org.joml.*;

/** 原生模型四边形投影后通过GUI纹理管线绘制，不依赖物品实体着色器/世界深度状态。 */
public final class GuiBlueprintMesh {
    public record Instance(BlockPos pos,BlockState state,boolean controller) { }
    private record Face(float[] x,float[] y,float[] u,float[] v,float depth,int color) { }
    private static final int[] FORWARD={0,1,2,3},REVERSE={0,3,2,1};
    private final List<Instance> cells;
    private final ItemStack controller;
    private Matrix4f previous;
    private BakedModel generation;
    private List<Face> faces=List.of();
    public GuiBlueprintMesh(List<Instance> cells,ItemStack controller){this.cells=cells;this.controller=controller;}
    public void draw(GuiGraphics graphics,Matrix4f matrix){
        var mc=Minecraft.getInstance();var current=mc.getBlockRenderer().getBlockModel(Blocks.LODESTONE.defaultBlockState());
        if(previous==null||!previous.equals(matrix)||generation!=current){previous=new Matrix4f(matrix);generation=current;rebuild(matrix);}
        var buffer=graphics.bufferSource().getBuffer(GuiBlueprintRenderType.TYPE);
        for(var face:faces){
            float area=(face.x[1]-face.x[0])*(face.y[2]-face.y[0])-(face.y[1]-face.y[0])*(face.x[2]-face.x[0]);
            int[] order=area<=0?FORWARD:REVERSE;
            for(int i:order)buffer.addVertex(graphics.pose().last(),face.x[i],face.y[i],0).setUv(face.u[i],face.v[i]).setColor(face.color);
        }
    }
    private void rebuild(Matrix4f matrix){
        var mc=Minecraft.getInstance();var result=new ArrayList<Face>();var cached=new HashMap<BlockState,List<BakedQuad>>();
        var controllerModel=mc.getItemRenderer().getModel(controller,mc.level,null,0);
        var controllerQuads=quads(controllerModel,null);
        if(controllerQuads.isEmpty())controllerQuads=quads(generation,Blocks.LODESTONE.defaultBlockState());
        for(var cell:cells){
            var quads=cell.controller?controllerQuads:cached.computeIfAbsent(cell.state,state->quads(mc.getBlockRenderer().getBlockModel(state),state));
            for(var quad:quads){
                int[] raw=quad.getVertices();int stride=raw.length/4;
                float[] x=new float[4],y=new float[4],u=new float[4],v=new float[4];float depth=0;
                for(int i=0;i<4;i++){
                    var point=matrix.transformPosition(new Vector3f(Float.intBitsToFloat(raw[i*stride])+cell.pos.getX(),Float.intBitsToFloat(raw[i*stride+1])+cell.pos.getY(),Float.intBitsToFloat(raw[i*stride+2])+cell.pos.getZ()));
                    x[i]=point.x;y[i]=point.y;depth+=point.z/4;u[i]=Float.intBitsToFloat(raw[i*stride+4]);v[i]=Float.intBitsToFloat(raw[i*stride+5]);
                }
                int tint=quad.isTinted()&&!cell.controller?mc.getBlockColors().getColor(cell.state,null,null,quad.getTintIndex()):0xffffff;
                float shade=switch(quad.getDirection()){case UP->1;case DOWN->.5f;case EAST,WEST->.7f;default->.85f;};
                int r=(int)(((tint>>16)&255)*shade),g=(int)(((tint>>8)&255)*shade),b=(int)((tint&255)*shade);
                result.add(new Face(x,y,u,v,depth,0xff000000|(r<<16)|(g<<8)|b));
            }
        }
        result.sort(Comparator.comparingDouble(Face::depth));faces=List.copyOf(result);
    }
    private static List<BakedQuad> quads(BakedModel model,BlockState state){
        var result=new ArrayList<BakedQuad>();var random=RandomSource.create(42);
        result.addAll(model.getQuads(state,null,random));
        for(var direction:Direction.values()){random.setSeed(42);result.addAll(model.getQuads(state,direction,random));}
        return result;
    }
}
