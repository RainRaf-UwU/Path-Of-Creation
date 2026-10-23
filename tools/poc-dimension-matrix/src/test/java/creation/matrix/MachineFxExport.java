package creation.matrix;

import java.nio.*;import java.nio.file.*;import java.io.*;import java.util.*;
public final class MachineFxExport {
    public static void main(String[] args)throws Exception{
        Path dir=Path.of(args[0]);Files.createDirectories(dir);
        for(var l:MachineFx.LAYOUTS){
            if(l.family.equals("inspector")&&!l.id.equals("inspector-0"))continue;
            var s=new MachineFx.State();try(var out=new DataOutputStream(new BufferedOutputStream(Files.newOutputStream(dir.resolve(l.id+".bin"))))){
                out.writeInt(64);
                for(int frame=0;frame<64;frame++){
                    // 0-1.5秒启动，1.5-6秒运行，6-7秒制动，7-8秒断电淡出。
                    s.flags=frame<12?3:frame<48?7:frame<56?3:0;
                    for(int j=0;j<5;j++)s.advance(.025);
                    List<float[]> vertices=new ArrayList<>();MachineFxScene.emit(l.effect,l.radius,l.color,s,(x,y,z,r,g,b,a)->vertices.add(new float[]{(float)x,(float)y,(float)z,r,g,b,a}));
                    out.writeInt(vertices.size());for(var v:vertices)for(float x:v)out.writeFloat(x);
                }
            }
        }
        System.out.println("Exported production machine FX meshes, 64 frames at 8 fps: "+dir);
    }
}
