package creation.matrix;

/** 温度着色/抖动和四个实体投影模块的光束；与预览共享实际网格。 */
public final class ThermalScene {
    public static float[] color(double heat){
        double t=Math.max(0,Math.min(1,heat));
        if(t<.65){double a=t/.65;return new float[]{(float)(.06+.94*a),(float)(.65+.05*a),(float)(1-.95*a)};}
        double a=(t-.65)/.35;return new float[]{1,(float)(.7-.68*a),(float)(.05-.045*a)};
    }
    public static double shake(double heat){return .004+.25*Math.pow(Math.max(0,Math.min(1,heat)),3);}
    public static void emit(double angle,double speed,double time,double visibility,double heat,double[] camera,HologramScene.Sink output){
        var tone=color(heat);double amplitude=shake(heat);
        double dx=Math.sin(time*47)*amplitude,dy=Math.sin(time*61+1)*amplitude*.6,dz=Math.sin(time*53+2)*amplitude;
        HologramScene.Sink color=(x,y,z,r,g,b,a)->{float light=Math.max(r,Math.max(g,b));output.vertex(x,y,z,tone[0]*light,tone[1]*light,tone[2]*light,a);};
        HologramScene.emit(angle,speed,time,visibility,camera,(x,y,z,r,g,b,a)->color.vertex(x+dx,y+dy,z+dz,r,g,b,a));
        for(int sx:new int[]{-1,1})for(int sz:new int[]{-1,1}){
            double x=sx*2,z=sz*2,tx=sx*.55+dx,tz=sz*.55+dz;
            for(int face=0;face<4;face++){
                double a=face*Math.PI/2,b=a+Math.PI/2;
                float alpha=(float)(visibility*(.16+.025*Math.sin(time*4+sx+sz)));
                point(color,x+Math.cos(a)*.22,-4.48,z+Math.sin(a)*.22,alpha);
                point(color,x+Math.cos(b)*.22,-4.48,z+Math.sin(b)*.22,alpha);
                point(color,tx+Math.cos(b)*.7,-.9+dy,tz+Math.sin(b)*.7,.012f*(float)visibility);
                point(color,tx+Math.cos(a)*.7,-.9+dy,tz+Math.sin(a)*.7,.012f*(float)visibility);
            }
            for(int ring=0;ring<2;ring++)for(int segment=0;segment<24;segment++){
                double a=segment*Math.PI*2/24,b=(segment+1)*Math.PI*2/24;
                double r=.28+ring*.1,y=-4.45;
                point(color,x+Math.cos(a)*r,y,z+Math.sin(a)*r,.7f*(float)visibility);
                point(color,x+Math.cos(b)*r,y,z+Math.sin(b)*r,.7f*(float)visibility);
                point(color,x+Math.cos(b)*(r+.025),y,z+Math.sin(b)*(r+.025),.7f*(float)visibility);
                point(color,x+Math.cos(a)*(r+.025),y,z+Math.sin(a)*(r+.025),.7f*(float)visibility);
            }
        }
    }
    private static void point(HologramScene.Sink sink,double x,double y,double z,float alpha){sink.vertex(x,y,z,1,1,1,alpha);}
}
