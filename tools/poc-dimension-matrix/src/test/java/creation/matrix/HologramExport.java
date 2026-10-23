package creation.matrix;

import java.io.*;
import java.nio.file.*;
import java.util.Arrays;

/** 离线导出生产渲染器发出的相同顶点、颜色和alpha；预览不重新实现4D数学。 */
public final class HologramExport {
    private static final class Mesh implements HologramScene.Sink {
        float[] data=new float[65536];int size;
        public void vertex(double x,double y,double z,float r,float g,float b,float a){
            if(size+7>data.length)data=Arrays.copyOf(data,data.length*2);
            data[size++]=(float)x;data[size++]=(float)y;data[size++]=(float)z;
            data[size++]=r;data[size++]=g;data[size++]=b;data[size++]=a;
        }
    }
    public static void main(String[] args)throws Exception{
        Path dest=Path.of(args[0]);Files.createDirectories(dest);
        try(var out=new DataOutputStream(new BufferedOutputStream(Files.newOutputStream(dest.resolve("hologram-frames.bin"))))){
            int fps=30,frames=16*fps+1;out.writeInt(fps);out.writeInt(frames);
            for(int frame=0;frame<frames;frame++){
                double t=frame/(double)fps;Rotor rotor=new Rotor();
                rotor.advance(Math.min(t,4),true,false);
                if(t>4)rotor.advance(Math.min(t-4,6),true,true);
                if(t>10)rotor.advance(Math.min(t-10,3),true,false);
                if(t>13)rotor.advance(t-13,false,false);
                Mesh mesh=new Mesh();HologramScene.emit(rotor.angle,rotor.speed,t,rotor.visibility,new double[]{.76,.38,.525},mesh);
                out.writeFloat((float)t);out.writeFloat((float)rotor.speed);out.writeFloat((float)rotor.visibility);
                out.writeInt(mesh.size/7);for(int i=0;i<mesh.size;i++)out.writeFloat(mesh.data[i]);
            }
        }
        System.out.println("Exported 481 production hologram meshes / 30fps / 16s");
    }
}
