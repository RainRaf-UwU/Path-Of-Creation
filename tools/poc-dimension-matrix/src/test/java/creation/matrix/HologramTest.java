package creation.matrix;

import java.util.*;

public final class HologramTest {
    public static void main(String[] args) {
        if(HologramScene.EDGES.length!=32||HologramScene.FACES.length!=24)throw new AssertionError("Tesseract topology");
        Set<String> edges=new HashSet<>();int[] degree=new int[16];
        for(int[] edge:HologramScene.EDGES){
            if(Integer.bitCount(edge[0]^edge[1])!=1||!edges.add(edge[0]+":"+edge[1]))throw new AssertionError("Non-hypercube edge");
            degree[edge[0]]++;degree[edge[1]]++;
        }
        for(int d:degree)if(d!=4)throw new AssertionError("Expected 4 edges per vertex");
        for(int[] face:HologramScene.FACES)for(int i=0;i<4;i++)if(Integer.bitCount(face[i]^face[(i+1)%4])!=1)throw new AssertionError("Invalid square face");
        for(double angle:new double[]{0,1,25,145,359.9,360,2560,359999.999,360000.001})
            for(double[] p:HologramScene.vertices(angle))for(double v:p)if(!Double.isFinite(v)||Math.abs(v)>3.5)throw new AssertionError("Unbounded projection");
        double[][] before=HologramScene.vertices(0),after=HologramScene.vertices(80);
        if(Math.abs(distance(before[0],before[1])-distance(after[0],after[1]))<0.01)throw new AssertionError("Expected true 4D morph, not rigid 3D rotation");
        int idle=check(0,1),running=check(1440,1),hidden=check(1440,0);
        if(running<=idle||running>15000||hidden!=0)throw new AssertionError("Trails / visibility / mesh budget");
        double[][] a=HologramScene.vertices(359999.999),b=HologramScene.vertices(360000.001);
        for(int i=0;i<16;i++)if(distance(a[i],b[i])>0.01)throw new AssertionError("Angle wrap jump");
        System.out.println("PASS tesseract: 16 vertices / 32 edges / 24 faces; genuine 4D morph, bounded projection, continuous phase, finite additive mesh; idle="+idle+" fast="+running+" vertices");
    }
    private static double distance(double[] a,double[] b){double sum=0;for(int i=0;i<3;i++)sum+=(a[i]-b[i])*(a[i]-b[i]);return Math.sqrt(sum);}
    private static int check(double speed,double visibility){
        int[] count={0};
        HologramScene.emit(83,speed,8.2,visibility,new double[]{.7,.4,.5},(x,y,z,r,g,b,a)->{
            if(!Double.isFinite(x+y+z)||Math.max(Math.abs(x),Math.max(Math.abs(y),Math.abs(z)))>4.5||a<0||a>1||r<0||g<0||b<0)throw new AssertionError("Invalid vertex");
            count[0]++;
        });
        if(count[0]%4!=0)throw new AssertionError("Incomplete quads");return count[0];
    }
}
