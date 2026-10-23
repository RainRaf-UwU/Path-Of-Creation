package creation.matrix.jei;

import org.joml.Matrix4f;
import org.joml.Vector3f;

/** 绘制和鼠标射线共享同一矩阵，旋转、平移及缩放后仍能精确定位方块格。 */
public final class BlueprintView {
    public double zoom=1,panX,panY,yaw=-35,pitch=25;
    public int layer=-1;
    public void reset(){zoom=1;panX=panY=0;yaw=-35;pitch=25;layer=-1;}
    public void zoom(double amount,double mouseX,double mouseY){
        double next=Math.max(.2,Math.min(16,zoom*Math.pow(1.15,amount)));
        double ratio=next/zoom;
        panX=mouseX-88-(mouseX-88-panX)*ratio;
        panY=mouseY-79-(mouseY-79-panY)*ratio;
        zoom=next;
    }
    public void rotate(double dx,double dy){yaw+=dx*.7;pitch=Math.max(-85,Math.min(85,pitch+dy*.7));}
    public Matrix4f matrix(Blueprint plan){
        float scale=(float)(Math.min(155.0/(plan.width+plan.depth),84.0/(plan.height+.45*(plan.width+plan.depth)))*zoom);
        return new Matrix4f().translate((float)(88+panX),(float)(79+panY),150).scale(1,1,.1f).scale(scale,-scale,scale)
            .rotateX((float)Math.toRadians(pitch)).rotateY((float)Math.toRadians(yaw))
            .translate((float)(-plan.width/2.0+plan.originX),(float)(-plan.height/2.0+plan.originY),(float)(-plan.depth/2.0+plan.originZ));
    }
    public Vector3f[] ray(Blueprint plan,double mouseX,double mouseY){
        var inverse=matrix(plan).invert();
        return new Vector3f[]{inverse.transformPosition(new Vector3f((float)mouseX,(float)mouseY,1000)),inverse.transformPosition(new Vector3f((float)mouseX,(float)mouseY,-1000))};
    }
    public static double hit(Vector3f[] ray,int x,int y,int z){
        double near=0,far=1;
        for(int axis=0;axis<3;axis++){
            double from=ray[0].get(axis),delta=ray[1].get(axis)-from,min=axis==0?x:axis==1?y:z;
            if(Math.abs(delta)<1e-9){if(from<min||from>min+1)return Double.POSITIVE_INFINITY;continue;}
            double a=(min-from)/delta,b=(min+1-from)/delta;
            near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));
            if(near>far)return Double.POSITIVE_INFINITY;
        }
        return near;
    }
    public double tileSize(Blueprint plan){return Math.min(164.0/plan.width,91.0/plan.depth)*zoom;}
    public double layerX(Blueprint plan){return 88+panX-plan.width*tileSize(plan)/2;}
    public double layerZ(Blueprint plan){return 79+panY-plan.depth*tileSize(plan)/2;}
}
