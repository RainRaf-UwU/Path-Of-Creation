package creation.matrix;

import com.mojang.blaze3d.vertex.PoseStack;
import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.client.renderer.MultiBufferSource;
import com.mojang.math.Axis;
import net.minecraft.world.phys.AABB;

public final class MachineFxRenderer {
    public static void render(CustomMachineTile tile,float partial,PoseStack pose,MultiBufferSource buffers){
        if(!MachineFx.supported(tile))return;var state=((MachineFx.Access)tile).poc$fx().sample(partial/20.0);var layout=MachineFx.layout(state);FormedMachineVisuals.observe(tile,state);if(layout==null||(state.flags&1)==0)return;
        pose.pushPose();try{
            pose.translate(.5,.5,.5);
            // CM 图纸以正面向南为规范坐标，水平朝向与配方结构一致。
            pose.mulPose(Axis.YP.rotationDegrees(-tile.getComponentManager().facing().toYRot()));
            var mesh=FormedMachineScene.mesh(layout,state);
            for(int layer=0;layer<3;layer++){
                var vertices=buffers.getBuffer(layer==0?AssemblyRenderType.SOLID:layer==1?AssemblyRenderType.GLASS:HologramRenderType.GLOW);
                for(var quad:mesh)if(quad.layer()==layer)for(var p:quad.p())vertices.addVertex(pose.last(),(float)p[0],(float)p[1],(float)p[2]).setColor(quad.color()[0],quad.color()[1],quad.color()[2],quad.color()[3]);
            }
        }finally{pose.popPose();}
    }
    public static AABB bounds(CustomMachineTile tile){return new AABB(tile.getBlockPos()).inflate(42);}
    private MachineFxRenderer(){}
}
