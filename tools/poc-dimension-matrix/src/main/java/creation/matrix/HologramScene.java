package creation.matrix;

import java.util.ArrayList;
import java.util.List;

/** 共享纯几何：真实tesseract的4D旋转、透视投影及加色发光网格。 */
public final class HologramScene {
    @FunctionalInterface public interface Sink {
        void vertex(double x, double y, double z, float r, float g, float b, float alpha);
    }
    public static final int[][] EDGES;
    public static final int[][] FACES;
    private static final float[] CYAN = {0.08f, 0.79f, 1.0f}, VIOLET = {0.51f, 0.28f, 1.0f};
    private static final float[] WHITE = {0.72f, 0.97f, 1.0f};
    static {
        List<int[]> edges = new ArrayList<>(), faces = new ArrayList<>();
        for (int v = 0; v < 16; v++) for (int axis = 0; axis < 4; axis++)
            if ((v & (1 << axis)) == 0) edges.add(new int[]{v, v | (1 << axis), axis});
        for (int a = 0; a < 4; a++) for (int b = a + 1; b < 4; b++)
            for (int v = 0; v < 16; v++) if ((v & ((1 << a) | (1 << b))) == 0)
                faces.add(new int[]{v, v | (1 << a), v | (1 << a) | (1 << b), v | (1 << b)});
        EDGES = edges.toArray(int[][]::new); FACES = faces.toArray(int[][]::new);
    }
    private HologramScene() { }

    private static void turn(double[] v, int a, int b, double angle) {
        double c = Math.cos(angle), s = Math.sin(angle), old = v[a];
        v[a] = c * old - s * v[b]; v[b] = s * old + c * v[b];
    }
    public static double[][] vertices(double degrees) {
        double angle = Math.toRadians(degrees % 360000.0);
        double[][] result = new double[16][3];
        for (int i = 0; i < 16; i++) {
            double[] p = new double[4];
            for (int a = 0; a < 4; a++) p[a] = (i & (1 << a)) == 0 ? -1 : 1;
            turn(p, 0, 3, angle * 0.31);
            turn(p, 1, 3, angle * 0.23);
            turn(p, 2, 3, angle * -0.17);
            double projection = HologramStyle.SCALE * HologramStyle.PERSPECTIVE / (HologramStyle.PERSPECTIVE - p[3]);
            for (int a = 0; a < 3; a++) result[i][a] = p[a] * projection;
            turn(result[i], 0, 2, angle);
            turn(result[i], 0, 1, Math.toRadians(14));
        }
        return result;
    }
    private static double[] mix(double[] a, double[] b, double t) {
        return new double[]{a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t};
    }
    private static double[] offset(double[] p, double[] n, double scale) {
        return new double[]{p[0]+n[0]*scale,p[1]+n[1]*scale,p[2]+n[2]*scale};
    }
    private static void vertex(Sink sink, double[] p, float[] color, double alpha) {
        sink.vertex(p[0],p[1],p[2],color[0],color[1],color[2],(float) alpha);
    }
    private static void quad(Sink s, double[] a, double[] b, double[] c, double[] d, float[] color, double alpha) {
        vertex(s,a,color,alpha);vertex(s,b,color,alpha);vertex(s,c,color,alpha);vertex(s,d,color,alpha);
    }
    private static double[] perpendicular(double[] a, double[] b, double[] camera) {
        double x=b[0]-a[0],y=b[1]-a[1],z=b[2]-a[2];
        double[] n={y*camera[2]-z*camera[1],z*camera[0]-x*camera[2],x*camera[1]-y*camera[0]};
        double length=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);
        if(length<0.000001){n=new double[]{camera[1],-camera[0],0};length=Math.sqrt(n[0]*n[0]+n[1]*n[1]);}
        if(length<0.000001)return new double[]{1,0,0};
        for(int i=0;i<3;i++)n[i]/=length;
        return n;
    }
    private static void line(Sink s, double[] a, double[] b, double width, float[] color, double alpha, double[] camera) {
        double[] n=perpendicular(a,b,camera);
        quad(s,offset(a,n,-width),offset(b,n,-width),offset(b,n,width),offset(a,n,width),color,alpha);
    }
    private static void glow(Sink s, double[] a, double[] b, float[] color, double alpha, double[] camera) {
        double[] n=perpendicular(a,b,camera);
        // 两侧顶点透明，亮度向中心连续增加；是真正渲染的光晕，不依赖后处理。
        for(int sign:new int[]{-1,1}) {
            vertex(s,offset(a,n,sign*0.17),color,0);vertex(s,offset(b,n,sign*0.17),color,0);
            vertex(s,b,color,alpha*0.27);vertex(s,a,color,alpha*0.27);
        }
        line(s,a,b,0.027,color,alpha*0.70,camera);
        line(s,a,b,0.008,WHITE,alpha*0.95,camera);
    }
    private static double[] circle(double radius, double y, double a) {return new double[]{Math.cos(a)*radius,y,Math.sin(a)*radius};}
    private static void ring(Sink s,double radius,double y,double phase,double alpha,int segments,float[] color,double[] camera) {
        for(int i=0;i<segments;i++) {
            if(i%8==6||i%8==7)continue;
            double a=i*Math.PI*2/segments+phase;
            double[] start=circle(radius,y,a),end=circle(radius,y,a+Math.PI*1.55/segments);
            glow(s,start,end,color,alpha,camera);
        }
    }
    private static double[] orbitPoint(double radius,double angle,double tilt,double heading) {
        double[] p={Math.cos(angle)*radius,0,Math.sin(angle)*radius};
        turn(p,1,2,tilt);turn(p,0,2,heading);return p;
    }
    private static void decorations(Sink s,double time,double visibility,double[][] core,double[] camera) {
        // 两组相互交错的倾斜轨道及沿轨道运行的数据星点。
        for(int orbit=0;orbit<2;orbit++) {
            double tilt=Math.toRadians(orbit==0?61:-57),heading=time*(orbit==0?0.13:-0.11)+orbit*1.3;
            float[] color=orbit==0?CYAN:VIOLET;
            for(int segment=0;segment<48;segment++) {
                if(segment%6>=4)continue;
                double a=segment*Math.PI/24;
                glow(s,orbitPoint(3.45,a,tilt,heading),orbitPoint(3.45,a+Math.PI/31,tilt,heading),color,visibility*0.20,camera);
            }
            for(int node=0;node<3;node++) {
                double a=time*(orbit==0?0.60:-0.49)+node*Math.PI*2/3;
                double[] p=orbitPoint(3.45,a,tilt,heading);
                for(int axis=0;axis<3;axis++){
                    double[] n=new double[3];n[axis]=1;
                    glow(s,offset(p,n,-0.105),offset(p,n,0.105),color,visibility*0.65,camera);
                }
            }
        }
        // 四角全息标尺和悬浮菱形节点：没有真实装饰方块。
        int corner=0;
        for(int sx:new int[]{-1,1})for(int sz:new int[]{-1,1}) {
            double x=sx*3.38,z=sz*3.38;
            glow(s,new double[]{x,-2.9,z},new double[]{x,2.6,z},CYAN,visibility*0.16,camera);
            for(int tick=0;tick<13;tick++) {
                double y=-2.8+tick*0.42,length=tick%3==0?0.32:0.16;
                double alpha=(tick==((int)(time*3)+corner*3)%13?0.65:0.18)*visibility;
                line(s,new double[]{x-sx*length,y,z},new double[]{x,y,z-sz*length},0.016,CYAN,alpha,camera);
            }
            double y=2.85+Math.sin(time*0.8+corner)*0.12;
            double[][] diamond={{x+.16,y,z},{x-.16,y,z},{x,y+.26,z},{x,y-.26,z},{x,y,z+.16},{x,y,z-.16}};
            for(int a=0;a<6;a++)for(int b=a+1;b<6;b++)if(a/2!=b/2)
                glow(s,diamond[a],diamond[b],VIOLET,visibility*0.36,camera);
            // 细能量丝连接投影节点，随4D核心变形。
            line(s,new double[]{x,-1.7,z},core[corner*4],0.009,CYAN,visibility*0.15,camera);
            corner++;
        }
        // 四面浮动数据板：透明底片、切角边框及动态分段码。
        for(int panel=0;panel<4;panel++) {
            double heading=panel*Math.PI/2;
            double[][] p={{-.73,.65,3.72},{.73,.65,3.72},{.73,1.9,3.72},{-.73,1.9,3.72}};
            for(double[] v:p)turn(v,0,2,heading);
            quad(s,p[0],p[1],p[2],p[3],CYAN,visibility*.012);
            for(int edge=0;edge<4;edge++){
                double[] a=p[edge],b=p[(edge+1)%4];
                line(s,a,mix(a,b,.23),.011,CYAN,visibility*.38,camera);
                line(s,mix(a,b,.77),b,.011,CYAN,visibility*.38,camera);
            }
            for(int row=0;row<6;row++)for(int column=0;column<8;column++) {
                int code=(row*19+column*13+panel*7+(int)(time*.8))%11;
                if(code<5)continue;
                double x=-.58+column*.15,y=.82+row*.17;
                double[] a={x,y,3.72},b={x+.08,y,3.72};turn(a,0,2,heading);turn(b,0,2,heading);
                line(s,a,b,.016,row==5?VIOLET:CYAN,visibility*(row==0?.40:.21),camera);
            }
        }
        // 发射阵列网格与周围刻度。
        for(int i=-3;i<=3;i++){
            line(s,new double[]{i*.45,-4.02,-1.35},new double[]{i*.45,-4.02,1.35},.004,CYAN,visibility*.065,camera);
            line(s,new double[]{-1.35,-4.02,i*.45},new double[]{1.35,-4.02,i*.45},.004,CYAN,visibility*.065,camera);
        }
        for(int tick=0;tick<48;tick++){
            double a=tick*Math.PI/24;
            line(s,circle(2.90,-3.95,a),circle(tick%4==0?3.18:3.03,-3.95,a),.014,CYAN,visibility*.34,camera);
        }
    }
    public static void emit(double angle,double speed,double time,double visibility,double[] camera,Sink sink) {
        if(visibility<=0.0001)return;
        double gain=Math.max(0,Math.min(1,speed/HologramStyle.MAX_SPEED));
        double[][] points=vertices(angle);
        // 24透明单元面及投影扫描条；没有不透明内核。
        for(int f=0;f<FACES.length;f++) {
            int[] ids=FACES[f];float[] color=f%3==0?VIOLET:CYAN;
            quad(sink,points[ids[0]],points[ids[1]],points[ids[2]],points[ids[3]],color,0.008*visibility);
            for(int scan=0;scan<5;scan++) {
                double t=(scan/5.0+time*0.10)%1.0;
                double[] a=mix(points[ids[0]],points[ids[3]],t), b=mix(points[ids[1]],points[ids[2]],t);
                line(sink,a,b,0.005,color,0.045*visibility,camera);
            }
        }
        // 按时间回采历史姿态，最高速度时显示短曝光残影。
        for(int trail=HologramStyle.TRAILS;trail>=1;trail--) {
            if(gain<0.03)break;
            double past=HologramStyle.TRAIL_TIME*trail/HologramStyle.TRAILS;
            double[][] old=vertices(angle-speed*past);
            double alpha=0.10*gain*Math.pow(1.0-trail/(HologramStyle.TRAILS+1.0),1.4)*visibility;
            for(int[] e:EDGES)line(sink,old[e[0]],old[e[1]],0.013,e[2]==3?VIOLET:CYAN,alpha,camera);
        }
        for(int[] e:EDGES)glow(sink,points[e[0]],points[e[1]],e[2]==3?VIOLET:CYAN,visibility,camera);
        // 每个顶点的十字星芒。
        for(double[] p:points)for(int axis=0;axis<3;axis++) {
            double[] n=new double[3];n[axis]=1;
            glow(sink,offset(p,n,-0.065),offset(p,n,0.065),CYAN,visibility*0.60,camera);
        }
        ring(sink,2.7,-3.95,time*0.10,visibility*0.60,64,CYAN,camera);
        ring(sink,2.30,-3.93,-time*0.08,visibility*0.32,48,VIOLET,camera);
        ring(sink,1.05,3.65,-time*0.12,visibility*0.22,40,CYAN,camera);
        // 低亮度上行投影光束，边界受世界深度遮挡。
        for(int i=0;i<24;i++) {
            double a=i*Math.PI/12,b=(i+1)*Math.PI/12;
            vertex(sink,circle(0.42,-4.10,a),CYAN,0.055*visibility);
            vertex(sink,circle(0.42,-4.10,b),CYAN,0.055*visibility);
            vertex(sink,circle(2.35,-0.85,b),CYAN,0);
            vertex(sink,circle(2.35,-0.85,a),CYAN,0);
        }
        double scanY=-2.75+(time*0.23%1)*5.5;
        ring(sink,2.55,scanY,0,visibility*0.14,48,CYAN,camera);
        if(gain>0.08)ring(sink,3.25,0,Math.toRadians(angle*0.7),visibility*gain*0.45,80,CYAN,camera);
        decorations(sink,time,visibility,points,camera);
    }
}
