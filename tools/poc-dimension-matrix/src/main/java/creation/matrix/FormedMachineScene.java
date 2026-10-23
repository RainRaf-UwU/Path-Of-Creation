package creation.matrix;

import java.util.*;

/** 形成后的整机几何：可辨认的工艺部件，生产和离线预览共用。单位为方块。 */
public final class FormedMachineScene {
    public static final int SOLID=0,GLASS=1,LIGHT=2;
    public record Quad(int layer,double[][] p,float[] color){}
    @FunctionalInterface public interface Vertex {void add(int layer,double x,double y,double z,float r,float g,float b,float a);}
    private static final int DARK=0x18242f,STEEL=0x536c7e,EDGE=0x99acb8,BLACK=0x09131d,COPPER=0xbc8052;
    private static final Map<Integer,List<Quad>> STATIC=new HashMap<>();
    private final List<Quad> quads=new ArrayList<>();
    private final MachineFx.Layout l;
    private final double y0,h,r,cz;
    private final int accent;
    private FormedMachineScene(MachineFx.Layout l){this.l=l;y0=-l.originY-.5;h=l.pattern.size();r=l.pattern.getFirst().getFirst().length()/2.0-.22;cz=l.modelId().equals("mining-0")?-3:l.focus[2];accent=l.family.equals("inspector")?0x4eaf92:rgb(l.color);}
    private static int rgb(double[] c){return ((int)(c[0]*190+30)<<16)|((int)(c[1]*190+30)<<8)|(int)(c[2]*190+30);}
    private void quad(int layer,int color,double alpha,double[] a,double[] b,double[] c,double[] d){
        double[] u={b[0]-a[0],b[1]-a[1],b[2]-a[2]},v={c[0]-a[0],c[1]-a[1],c[2]-a[2]};double nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0],length=Math.sqrt(nx*nx+ny*ny+nz*nz);
        double shade=layer==LIGHT?1:length<1e-8?.8:.65+.22*Math.abs(ny/length)+.12*Math.max(0,(nx+nz)/length*.707);
        quads.add(new Quad(layer,new double[][]{a,b,c,d},new float[]{(float)((color>>16&255)/255.0*shade),(float)((color>>8&255)/255.0*shade),(float)((color&255)/255.0*shade),(float)alpha}));
    }
    private void box(double x,double y,double z,double w,double height,double depth,int color){
        double a=x-w/2,b=x+w/2,c=y-height/2,d=y+height/2,e=z-depth/2,f=z+depth/2;
        quad(SOLID,color,1,new double[]{a,d,e},new double[]{b,d,e},new double[]{b,d,f},new double[]{a,d,f});
        quad(SOLID,color,1,new double[]{a,c,f},new double[]{b,c,f},new double[]{b,c,e},new double[]{a,c,e});
        quad(SOLID,color,1,new double[]{a,c,e},new double[]{a,d,e},new double[]{a,d,f},new double[]{a,c,f});
        quad(SOLID,color,1,new double[]{b,c,f},new double[]{b,d,f},new double[]{b,d,e},new double[]{b,c,e});
        quad(SOLID,color,1,new double[]{a,c,f},new double[]{a,d,f},new double[]{b,d,f},new double[]{b,c,f});
        quad(SOLID,color,1,new double[]{b,c,e},new double[]{b,d,e},new double[]{a,d,e},new double[]{a,c,e});
    }
    private double[][] outline(double x,double y,double z,double w,double d,double bevel){return new double[][]{{x-w/2+bevel,y,z-d/2},{x+w/2-bevel,y,z-d/2},{x+w/2,y,z-d/2+bevel},{x+w/2,y,z+d/2-bevel},{x+w/2-bevel,y,z+d/2},{x-w/2+bevel,y,z+d/2},{x-w/2,y,z+d/2-bevel},{x-w/2,y,z-d/2+bevel}};}
    private void armor(double x,double y,double z,double w,double height,double d,int color){
        double edge=Math.min(.13,Math.min(height*.2,Math.min(w,d)*.08)),bevel=Math.min(w,d)*.16;
        double[][] a=outline(x,y-height/2,z,w-.12,d-.12,bevel),b=outline(x,y-height/2+edge,z,w,d,bevel),c=outline(x,y+height/2-edge,z,w,d,bevel),e=outline(x,y+height/2,z,w-.12,d-.12,bevel);
        for(int i=0;i<8;i++){int j=(i+1)%8;quad(SOLID,DARK,1,a[i],a[j],b[j],b[i]);quad(SOLID,color,1,b[i],b[j],c[j],c[i]);quad(SOLID,EDGE,1,c[i],c[j],e[j],e[i]);quad(SOLID,color,1,new double[]{x,y+height/2,z},e[i],e[j],new double[]{x,y+height/2,z});}
    }
    private void cylinder(double x,double y,double z,double radius,double height,int segments,int color){annulus(x,y,z,radius,0,height,segments,color);}
    /** 环/法兰，y是底面。 */
    private void annulus(double x,double y,double z,double outer,double inner,double height,int segments,int color){
        for(int i=0;i<segments;i++){double a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;double ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
            double[] p={x+ca*outer,y,z+sa*outer},q={x+cb*outer,y,z+sb*outer},pt={p[0],y+height,p[2]},qt={q[0],y+height,q[2]};
            quad(SOLID,color,1,p,q,qt,pt);quad(SOLID,EDGE,1,pt,qt,new double[]{x+cb*inner,y+height,z+sb*inner},new double[]{x+ca*inner,y+height,z+sa*inner});
            if(inner>0)quad(SOLID,DARK,1,new double[]{x+ca*inner,y,z+sa*inner},new double[]{x+ca*inner,y+height,z+sa*inner},new double[]{x+cb*inner,y+height,z+sb*inner},new double[]{x+cb*inner,y,z+sb*inner});
        }
    }
    private void rod(double[] a,double[] b,double radius,int color){
        double dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.sqrt(dx*dx+dy*dy+dz*dz);if(len<1e-6)return;dx/=len;dy/=len;dz/=len;
        double ux=0,uy=dz,uz=-dy;if(Math.abs(dy)<.8){ux=-dz;uy=0;uz=dx;}double norm=Math.sqrt(ux*ux+uy*uy+uz*uz);ux/=norm;uy/=norm;uz/=norm;double vx=dy*uz-dz*uy,vy=dz*ux-dx*uz,vz=dx*uy-dy*ux;
        for(int i=0;i<8;i++){double ta=i*Math.PI/4,tb=(i+1)*Math.PI/4;double[] u={radius*(ux*Math.cos(ta)+vx*Math.sin(ta)),radius*(uy*Math.cos(ta)+vy*Math.sin(ta)),radius*(uz*Math.cos(ta)+vz*Math.sin(ta))},v={radius*(ux*Math.cos(tb)+vx*Math.sin(tb)),radius*(uy*Math.cos(tb)+vy*Math.sin(tb)),radius*(uz*Math.cos(tb)+vz*Math.sin(tb))};quad(SOLID,color,1,new double[]{a[0]+u[0],a[1]+u[1],a[2]+u[2]},new double[]{a[0]+v[0],a[1]+v[1],a[2]+v[2]},new double[]{b[0]+v[0],b[1]+v[1],b[2]+v[2]},new double[]{b[0]+u[0],b[1]+u[1],b[2]+u[2]});}
    }
    private void window(double x,double y,double z,double radius,double height,int sectors){
        annulus(x,y,z,radius+.14,radius-.12,.23,sectors*2,STEEL);annulus(x,y+height-.23,z,radius+.14,radius-.12,.23,sectors*2,STEEL);
        for(int i=0;i<sectors;i++){double a=i*Math.PI*2/sectors,b=(i+1)*Math.PI*2/sectors,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);quad(GLASS,0x459daf,.25,new double[]{x+ca*radius,y+.23,z+sa*radius},new double[]{x+cb*radius,y+.23,z+sb*radius},new double[]{x+cb*radius,y+height-.23,z+sb*radius},new double[]{x+ca*radius,y+height-.23,z+sa*radius});rod(new double[]{x+ca*radius,y,z+sa*radius},new double[]{x+ca*radius,y+height,z+sa*radius},.055,EDGE);}
    }
    private void ribs(double x,double y,double z,double width,double height,int n){for(int i=0;i<n;i++)box(x,y+(i/(double)(n-1)-.5)*height,z,width,.09,.15,BLACK);}
    private void base(){
        armor(0,y0+.32,cz,r*2,.64,r*2,DARK);armor(0,y0+.72,cz,r*1.9,.2,r*1.9,STEEL);
        // 支座与入口桥从工艺主体一直连接到控制器。
        double end=cz+r*.86;if(end<-.35){armor(0,y0+.43,(end-.2)/2,1.35,.7,-.2-end,DARK);rod(new double[]{-.35,y0+.8,end},new double[]{-.35,-.1,-.35},.11,STEEL);rod(new double[]{.35,y0+.8,end},new double[]{.35,-.1,-.35},.11,STEEL);}
        for(int i=0;i<6;i++)box((i-2.5)*r*.22,y0+.66,cz+r-.2,r*.11,.04,.16,i%2==0?0xc59b46:BLACK);
        armor(0,-.06,0,1,.9,.91,DARK);box(0,.05,.466,.71,.48,.025,BLACK);
        for(double x:new double[]{-.4,.4})for(double y:new double[]{-.4,.29})rod(new double[]{x,y,.45},new double[]{x,y,.49},.036,EDGE);
        box(.31,-.28,.49,.12,.1,.035,0xba7047);
    }
    private void tower(double x,double z,double w,double top){
        armor(x,(y0+.8+top)/2,z,w,top-y0-.8,w*1.05,STEEL);armor(x,top-.1,z,w*1.1,.4,w*1.15,DARK);ribs(x,(y0+top)/2,z+w*.53+.015,w*.58,(top-y0)*.5,9);box(x-w*.34,(y0+top)/2,z+w*.54,w*.09,(top-y0)*.62,.04,accent);
    }
    private void build(){
        base();double top=y0+h;
        switch(l.modelId()){
            case "dyeing-0"->{
                for(int sign:new int[]{-1,1}){tower(sign*r*.64,cz-.35,r*.49,top-.7);cylinder(sign*r*.61,y0+.85,cz+r*.59,.65,h*.28,20,STEEL);annulus(sign*r*.61,y0+1,cz+r*.59,.71,.55,.18,20,COPPER);rod(new double[]{sign*r*.61,y0+1.8,cz+r*.59},new double[]{sign*.8,y0+1.8,cz+.6},.12,COPPER);}
                armor(0,top-.57,cz,r*1.72,.95,2.2,STEEL);ribs(0,top-.56,cz+1.12,r*.8,.48,4);
                window(0,y0+1.05,cz,1.12,h*.49,16);cylinder(0,y0+.85,cz,1.4,.35,24,DARK);annulus(0,y0+h*.62,cz,1.38,1,.3,24,STEEL);
            }
            case "mining-0"->{
                for(int sign:new int[]{-1,1}){tower(sign*r*.76,cz,.85,top-.65);rod(new double[]{sign*1.25,y0+.8,cz+1.25},new double[]{sign*1.25,top-.9,cz+1.25},.14,EDGE);}
                armor(0,top-.45,cz,r*1.95,.8,1.6,STEEL);ribs(0,top-.4,cz+.82,1.5,.34,3);
                annulus(0,y0+.9,cz,1.18,.78,.4,28,DARK);rod(new double[]{0,top-.8,cz},new double[]{0,y0+1.7,cz},.2,EDGE);
            }
            case "mining-1","mining-2","fluid-1"->{
                boolean stellar=l.modelId().equals("mining-2"),cracker=l.modelId().equals("fluid-1");double cr=r*(cracker?.56:stellar?.51:.6);
                for(int sx:new int[]{-1,1})for(int sz:new int[]{-1,1}){
                    double x=sx*r*.72,z=cz+sz*r*.72;tower(x,z,r*.22,top-1);for(double f:new double[]{.19,.78})rod(new double[]{x,y0+h*f,z},new double[]{sx*cr*.65,y0+h*f,cz+sz*cr*.65},r*.065,DARK);
                }
                cylinder(0,y0+.95,cz,cr*1.15,h*.13,32,DARK);window(0,y0+h*.21,cz,cr,h*.55,16);cylinder(0,y0+h*.76,cz,cr*1.1,h*.12,32,STEEL);
                for(double f:new double[]{.21,.48,.75})annulus(0,y0+h*f,cz,cr*1.16,cr*.86,.25,40,STEEL);
                cylinder(0,top-.9,cz,cr*.78,.5,28,DARK);annulus(0,top-.98,cz,cr*.9,cr*.7,.23,32,accent);
                // 采矿的导向轴贯穿采掘舱；裂解器则是封闭的反应电极。
                rod(new double[]{0,y0+1.2,cz},new double[]{0,top-1.1,cz},cr*.13,EDGE);
                if(cracker)for(int sign:new int[]{-1,1}){
                    // 流体处理器的外置进液泵和回流管，与采矿分离舱区分。
                    double x=sign*r*.84,z=cz+r*.32,yy=y0+h*.7;
                    cylinder(x,y0+.9,z,.68,h*.16,20,STEEL);annulus(x,y0+1,z,.73,.51,.18,20,DARK);
                    rod(new double[]{x,y0+1.4,z},new double[]{x,yy,z},.23,COPPER);
                    rod(new double[]{x,yy,z},new double[]{sign*cr*.7,yy,cz+cr*.35},.23,COPPER);
                }
            }
            case "fluid-0"->{
                double cr=r*.42;cylinder(0,y0+.85,cz,cr,h*.25,32,STEEL);window(0,y0+h*.34,cz,cr,h*.27,16);cylinder(0,y0+h*.61,cz,cr,h*.25,32,STEEL);
                for(double f:new double[]{.12,.33,.58,.8})annulus(0,y0+h*f,cz,cr*1.13,cr*.92,.2,32,DARK);
                for(int sign:new int[]{-1,1}){double x=sign*r*.72;rod(new double[]{x,y0+1,cz},new double[]{x,top-.75,cz},.23,COPPER);rod(new double[]{x,top-.75,cz},new double[]{sign*cr*.5,top-.75,cz},.23,COPPER);cylinder(x,y0+.85,cz+1.25,.69,h*.34,20,STEEL);annulus(x,y0+1,cz+1.25,.73,.57,.2,20,DARK);}
                armor(0,top-.5,cz,cr*1.7,.65,cr*1.7,DARK);
            }
            case "fluid-2"->{
                double cr=r*.59;cylinder(0,y0+.86,cz,cr*1.12,h*.21,32,DARK);window(0,y0+h*.31,cz,cr,h*.43,20);cylinder(0,y0+h*.76,cz,cr*1.04,h*.12,32,STEEL);
                for(int i=0;i<8;i++){double a=i*Math.PI/4,x=Math.cos(a)*cr*1.22,z=cz+Math.sin(a)*cr*1.22;armor(x,y0+h*.32,z,.8,h*.29,.8,STEEL);for(int j=0;j<5;j++)annulus(x,y0+h*.2+j*.25, z,.45,.31,.12,12,COPPER);}
                annulus(0,top-.85,cz,cr*1.03,cr*.78,.3,40,DARK);cylinder(0,top-.65,cz,cr*.77,.25,32,STEEL);rod(new double[]{0,y0+1,cz},new double[]{0,top-.7,cz},cr*.13,EDGE);
            }
            case "fluid-4"->{
                // 预言矩阵的真实用途是数据模型/命令方块实体化：机柜、冷却总线和结果生成舱。
                for(int sign:new int[]{-1,1})for(int row=-1;row<=1;row++){
                    double x=sign*r*.62,z=cz+row*r*.52,w=r*.34,d=r*.4;armor(x,y0+h*.45,z,w,h*.78,d,STEEL);
                    for(int slot=0;slot<7;slot++){double yy=y0+1.65+slot*h*.095;armor(x,yy,z+d*.5+.03,w*.83,.7,.18,DARK);ribs(x,yy,z+d*.5+.13,w*.6,.3,3);}
                    rod(new double[]{x+sign*w*.4,y0+1,z-d*.5-.15},new double[]{x+sign*w*.4,top-1,z-d*.5-.15},.24,COPPER);
                    rod(new double[]{x,top-1.3,z},new double[]{sign*r*.22,top-1.3,z},.24,DARK);
                }
                double cr=r*.24;window(0,y0+1.5,cz,cr,h*.61,16);cylinder(0,y0+1,cz,cr*1.1,.6,28,DARK);cylinder(0,y0+h*.7,cz,cr*1.08,.7,28,STEEL);
                armor(0,y0+2.2,cz,cr*1.25,.8,cr*1.25,STEEL);rod(new double[]{-cr*.65,y0+3,cz},new double[]{-cr*.65,y0+h*.67,cz},.12,EDGE);rod(new double[]{cr*.65,y0+3,cz},new double[]{cr*.65,y0+h*.67,cz},.12,EDGE);
                for(int sign:new int[]{-1,1}){rod(new double[]{sign*r*.82,y0+1,cz-r*.68},new double[]{sign*r*.82,top-1,cz-r*.68},.38,STEEL);rod(new double[]{sign*r*.82,top-1,cz-r*.68},new double[]{sign*r*.82,top-1,cz+r*.68},.38,STEEL);}
            }
            default->{}
        }
    }
    private void rotor(double radius,double y,double angle,int blades,int color){
        annulus(0,y-.12,cz,radius,radius*.88,.24,40,color);cylinder(0,y-.2,cz,radius*.2,.4,20,DARK);
        for(int i=0;i<blades;i++){double a=angle+i*Math.PI*2/blades,b=a+.26;quad(SOLID,color,1,new double[]{Math.cos(a)*radius*.22,y,cz+Math.sin(a)*radius*.22},new double[]{Math.cos(b)*radius*.94,y+.09,cz+Math.sin(b)*radius*.94},new double[]{Math.cos(b+.18)*radius*.94,y+.09,cz+Math.sin(b+.18)*radius*.94},new double[]{Math.cos(a+.18)*radius*.22,y,cz+Math.sin(a+.18)*radius*.22});}
    }
    private void dynamic(MachineFx.State state){
        double a=state.angle,work=state.speed;boolean powered=(state.flags&2)!=0;double top=y0+h;
        // 面板展示运行量和状态；指示灯不离开机身。
        if(powered){for(int i=0;i<4;i++){double width=.09+.34*(.35+.65*(Math.sin(state.time*.9+i)*.5+.5))*((state.flags&4)!=0?1:.3);quad(LIGHT,accent,.7,new double[]{-.27,-.08+i*.08,.485},new double[]{-.27+width,-.08+i*.08,.485},new double[]{-.27+width,-.04+i*.08,.485},new double[]{-.27,-.04+i*.08,.485});}box(-.26,-.28,.49,.09,.08,.03,0x57bb8b);}
        switch(l.modelId()){
            case "dyeing-0"->{
                // 染色本质处理、模型卡匣夹具和往复写入头，对应数据模型训练配方。
                cylinder(0,y0+1.1,cz,.94,.65,28,0x5f335f);armor(0,y0+2.05,cz,1.3,.23,.8,DARK);armor(0,y0+2.27,cz,.9,.18,.55,STEEL);
                rod(new double[]{-.82,y0+h*.57,cz},new double[]{.82,y0+h*.57,cz},.1,EDGE);double head=.53*Math.sin(a);armor(head,y0+h*.5,cz,.38,.7,.45,STEEL);
                if((state.flags&4)!=0)for(int i=0;i<3;i++)quad(LIGHT,new int[]{0xb85f91,0x588fb8,0xc3a457}[i],.48,new double[]{head-.04+i*.04,y0+2.37,cz-.2},new double[]{head-.02+i*.04,y0+2.37,cz-.2},new double[]{head-.02+i*.04,y0+h*.46,cz-.2},new double[]{head-.04+i*.04,y0+h*.46,cz-.2});
            }
            case "mining-0"->{
                double drillY=y0+1.2+.18*work*Math.sin(a);cylinder(0,drillY+.7,cz,.36,1.35,20,STEEL);
                for(int i=0;i<6;i++){double t=a+i*Math.PI/3;rod(new double[]{Math.cos(t)*.18,drillY-.12,cz+Math.sin(t)*.18},new double[]{Math.cos(t+.9)*.78,drillY+.9,cz+Math.sin(t+.9)*.78},.13,EDGE);}
                rotor(.82,y0+1.1,a,6,DARK);
            }
            case "mining-1","mining-2"->{
                rotor(r*.48,y0+h*.35,a,12,STEEL);rotor(r*.43,y0+h*.61,-a*.72,12,STEEL);
                for(int i=0;i<5;i++){double yy=y0+1.1+i*h*.13,rr=r*(.12+i*.027);for(int j=0;j<5;j++){double t=a+j*Math.PI*.4;rod(new double[]{Math.cos(t)*rr,yy,cz+Math.sin(t)*rr},new double[]{Math.cos(t+.5)*(rr+.2),yy+.35,cz+Math.sin(t+.5)*(rr+.2)},.12,EDGE);}}
            }
            case "fluid-0"->{
                // 侧置循环泵的叶轮和管路内的流量窗口。
                rotor(r*.29,y0+h*.44,a,10,STEEL);cylinder(0,y0+h*.35,cz,r*.33,h*.15,28,0x335f69);if(powered)for(int sign:new int[]{-1,1}){double yy=y0+1.2+(a/(Math.PI*2)%1)*(h*.56);box(sign*r*.72,yy,cz+.245,.13,.34,.025,0x68bfc8);}
                for(int i=-1;i<=1;i++){double x=i*.56;armor(x,y0+1,cz+r*.57,.42,.15,.45,DARK);cylinder(x,y0+1.1,cz+r*.57,.16,.42,12,0x678d91);cylinder(x,y0+1.52,cz+r*.57,.08,.15,10,EDGE);rod(new double[]{x,y0+2.2,cz+r*.57},new double[]{x,y0+1.83,cz+r*.57},.075,COPPER);}
            }
            case "fluid-1"->{
                rotor(r*.46,y0+h*.47,a,16,STEEL);rotor(r*.37,y0+h*.63,-a*.6,12,COPPER);
                cylinder(0,y0+h*.34,cz,r*.18,h*.31,24,0x345e6b);
            }
            case "fluid-2"->{
                armor(0,y0+h*.4,cz,r*.42,.55,r*.42,STEEL);armor(0,y0+h*.48,cz,.85,.85,.85,0x8a8870);
                for(int i=0;i<8;i++){double t=i*Math.PI/4,x=Math.cos(t)*r*.53,z=cz+Math.sin(t)*r*.53;rod(new double[]{x,y0+h*.46,z},new double[]{x*.79,y0+h*.53,cz+(z-cz)*.79},.16,DARK);
                    if((state.flags&4)!=0){double[] p={x*.77,y0+h*.53,cz+(z-cz)*.77},target={0,y0+h*.49,cz};quad(LIGHT,0xf0c36d,.48,p,new double[]{p[0]+.025,p[1],p[2]+.025},new double[]{target[0]+.025,target[1],target[2]+.025},target);}}
            }
            case "fluid-4"->{
                double yy=y0+h*.54+.25*Math.sin(a);armor(0,yy,cz,r*.32,.5,r*.12,STEEL);rod(new double[]{0,y0+h*.7,cz},new double[]{0,yy+.3,cz},.18,DARK);
                if((state.flags&4)!=0){armor(0,y0+3.2,cz,1.5,1.4,1.5,0x6c8d91);quad(LIGHT,0x65b9c4,.4,new double[]{-1,yy-.3,cz},new double[]{1,yy-.3,cz},new double[]{1,y0+4.1,cz},new double[]{-1,y0+4.1,cz});}
                if(powered)for(int sign:new int[]{-1,1})for(int row=-1;row<=1;row++)for(int slot=0;slot<7;slot++){double x=sign*r*.62,z=cz+row*r*.52+r*.2+.14,y=y0+1.65+slot*h*.095;double active=((state.flags&4)!=0&&((int)(state.time*3)+slot+row)%4==0)?1:.25;quad(LIGHT,0x69bbad,active*.65,new double[]{x-r*.1,y-.08,z},new double[]{x-r*.1+.11,y-.08,z},new double[]{x-r*.1+.11,y+.08,z},new double[]{x-r*.1,y+.08,z});}
            }
            default->{}
        }
        if((state.flags&8)!=0){for(int sign:new int[]{-1,1}){armor(sign*.98,.9,0,.65,2.8,.72,DARK);for(int i=0;i<6;i++)annulus(sign*.98,-.18+i*.4,0,.36,.22,.15,12,COPPER);rod(new double[]{sign*.98,-.28,0},new double[]{sign*.4,-.28,-.4},.12,STEEL);}}
        // 工作灯沿压力法兰安装，亮度只取决于供电/运行。
        if(powered&&!l.modelId().equals("fluid-4")&&!l.modelId().equals("mining-0")){
            double cr=switch(l.modelId()){case "dyeing-0"->1.385;case "mining-1"->r*.6*1.16;case "mining-2"->r*.51*1.16;case "fluid-0"->r*.42*1.13;case "fluid-1"->r*.56*1.16;default->r*.59*1.03;};
            double y=switch(l.modelId()){case "dyeing-0"->y0+h*.62+.1;case "fluid-0"->y0+h*.8+.06;case "fluid-2"->top-.75;default->y0+h*.75+.08;};
            for(int i=0;i<16;i++){double t=i*Math.PI/8,rr=cr+.025,alpha=(.27+.25*work)*state.visibility;quad(LIGHT,accent,alpha,new double[]{Math.cos(t)*rr,y,cz+Math.sin(t)*rr},new double[]{Math.cos(t+.1)*rr,y,cz+Math.sin(t+.1)*rr},new double[]{Math.cos(t+.1)*rr,y+.065,cz+Math.sin(t+.1)*rr},new double[]{Math.cos(t)*rr,y+.065,cz+Math.sin(t)*rr});}}
    }
    public static List<Quad> mesh(MachineFx.Layout layout,MachineFx.State state){
        if((state.flags&1)==0)return List.of();
        var fixed=STATIC.computeIfAbsent(layout.index,key->{var b=new FormedMachineScene(layout);b.build();return List.copyOf(b.quads);});var moving=new FormedMachineScene(layout);moving.dynamic(state);var all=new ArrayList<Quad>(fixed.size()+moving.quads.size());all.addAll(fixed);all.addAll(moving.quads);return all;
    }
    public static void emit(MachineFx.Layout layout,MachineFx.State state,Vertex sink){for(var q:mesh(layout,state))for(var p:q.p)sink.add(q.layer,p[0],p[1],p[2],q.color[0],q.color[1],q.color[2],q.color[3]);}
    private FormedMachineScene(){throw new AssertionError();}
}
