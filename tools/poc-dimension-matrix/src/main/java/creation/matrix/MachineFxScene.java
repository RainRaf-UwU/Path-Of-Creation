package creation.matrix;

/** 同一份虚拟几何用于游戏渲染与离线效果图。没有粒子实体、世界方块或额外建材。 */
public final class MachineFxScene {
    @FunctionalInterface public interface Vertex {void add(double x,double y,double z,float r,float g,float b,float a);}
    private final Vertex out;private final double[] rgb;private final double gain;
    private MachineFxScene(Vertex v,double[] rgb,double gain){out=v;this.rgb=rgb;this.gain=gain;}
    private void v(double[] p,double a){out.add(p[0],p[1],p[2],(float)rgb[0],(float)rgb[1],(float)rgb[2],(float)(a*gain));}
    private void line(double[] a,double[] b,double width,double alpha){
        for(int axis=0;axis<3;axis++){
            double[] d=new double[3];d[axis]=width;
            v(new double[]{a[0]-d[0],a[1]-d[1],a[2]-d[2]},alpha);v(new double[]{a[0]+d[0],a[1]+d[1],a[2]+d[2]},alpha);
            v(new double[]{b[0]+d[0],b[1]+d[1],b[2]+d[2]},alpha);v(new double[]{b[0]-d[0],b[1]-d[1],b[2]-d[2]},alpha);
        }
    }
    private void beam(double[] a,double[] b,double power){line(a,b,.011,.85*power);line(a,b,.055,.075*power);}
    private static double[] orbit(double a,double r,double y,double tilt,int plane){
        double x=Math.cos(a)*r,z=Math.sin(a)*r;double[] p={x,y+z*Math.sin(tilt),z*Math.cos(tilt)};
        if(plane==1)return new double[]{p[1],p[0],p[2]};if(plane==2)return new double[]{p[0],p[2],p[1]};return p;
    }
    private void ring(double r,double y,double tilt,int plane,double angle,boolean dashed,double alpha){
        for(int i=0;i<96;i++){if(dashed&&i%8>=5)continue;double a=i*Math.PI/48+angle,b=(i+1)*Math.PI/48+angle;beam(orbit(a,r,y,tilt,plane),orbit(b,r,y,tilt,plane),alpha);}
    }
    private void diamond(double radius,double angle,double alpha){
        double[][] p=new double[6][];p[0]=new double[]{0,radius*1.35,0};p[1]=new double[]{0,-radius*1.35,0};
        for(int i=0;i<4;i++)p[i+2]=new double[]{Math.cos(angle+i*Math.PI/2)*radius,0,Math.sin(angle+i*Math.PI/2)*radius};
        for(int i=0;i<4;i++){beam(p[0],p[i+2],alpha);beam(p[1],p[i+2],alpha);beam(p[i+2],p[(i+1)%4+2],alpha);}
    }
    public static void emit(String kind,double radius,double[] color,MachineFx.State state,Vertex out){
        if(state.visibility<.001)return;
        var s=new MachineFxScene(out,color,state.visibility);double t=state.time,a=state.angle,r=radius*(.15+.85*state.visibility),run=.2+.8*state.speed;
        if(kind.equals("scan")){
            double y=(Math.sin(t*.9)*.7)*r;s.ring(r,y,0,0,a,true,.9);for(int i=-4;i<=4;i++)s.beam(new double[]{i*r/4,y,-r},new double[]{i*r/4,y,r},.2);s.diamond(r*.2,-a,.6);return;
        }
        if(kind.equals("drill")){
            for(int j=0;j<3;j++)s.ring(r*(.4+.25*j),(.5-j*.55)*r,0,0,(j%2==0?a:-a),true,run);
            s.beam(new double[]{0,r,0},new double[]{0,-r,0},run);s.diamond(r*.3,a,run);
        }else if(kind.equals("helix")||kind.equals("spectrum")){
            int strands=kind.equals("spectrum")?3:2;
            for(int k=0;k<strands;k++)for(int i=0;i<100;i++){double h=(i/100.0-.5)*r*2,h2=((i+1)/100.0-.5)*r*2,u=i*.13+a+k*Math.PI*2/strands,v=(i+1)*.13+a+k*Math.PI*2/strands;
                s.beam(new double[]{Math.cos(u)*r*.65,h,Math.sin(u)*r*.65},new double[]{Math.cos(v)*r*.65,h2,Math.sin(v)*r*.65},run);}
            s.ring(r,-r,0,0,-a,true,.8);s.ring(r,r,0,0,a,true,.8);s.diamond(r*.35,-a,run);
        }else{
            s.ring(r,0,.35,0,a,true,run);s.ring(r*.88,0,-.5,1,-a*.7,true,run);s.ring(r*.72,0,.4,2,a*.6,true,run);
            s.diamond(r*.33,a,run);s.diamond(r*.21,-a,.5*run);
            if(kind.equals("cryo"))for(int i=0;i<12;i++){double u=i*Math.PI/6;s.beam(new double[]{Math.cos(u)*r*.9,-r*.5,Math.sin(u)*r*.9},new double[]{Math.cos(u)*r*.9,r*.5,Math.sin(u)*r*.9},.35*run);}
        }
        // 沿轨道依次跳动的数据光点，启动时从中心向外展开。
        for(int i=0;i<8;i++){double u=a*1.8+i*Math.PI/4;double[] p=orbit(u,r,.12*Math.sin(u*2),.2,0);s.line(new double[]{p[0]-.04,p[1],p[2]},new double[]{p[0]+.04,p[1],p[2]},.04,run);}
        // 刻度浮环与底部投影锥。
        s.ring(r*1.12,-r*.72,0,0,-a*.2,true,.3);
        for(int i=0;i<4;i++){double u=Math.PI/4+i*Math.PI/2;s.beam(new double[]{Math.cos(u)*r,-r*.72,Math.sin(u)*r},new double[]{0,0,0},.12*run);}
    }
}
