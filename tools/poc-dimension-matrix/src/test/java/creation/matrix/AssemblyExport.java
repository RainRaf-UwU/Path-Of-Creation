package creation.matrix;
import java.nio.file.*;import java.io.*;import java.util.*;import java.util.zip.GZIPOutputStream;
public final class AssemblyExport {
    public static void main(String[] args)throws Exception{
        var dir=Path.of(args[0]);Files.createDirectories(dir);
        for(var l:MachineFx.LAYOUTS){if(l.family.equals("inspector")||l.effect.equals("time"))continue;
            var state=new MachineFx.State();state.layout=l.index;try(var out=new DataOutputStream(new GZIPOutputStream(new BufferedOutputStream(Files.newOutputStream(dir.resolve(l.id+".bin.gz")))))){
                out.writeInt(64);
                for(int f=0;f<64;f++){
                    // 首秒未成形，随后断电成形、供电运行、停机保持外壳，末秒结构破坏恢复。
                    state.flags=f<8?0:f<24?1:f<48?7:f<56?3:0;
                    if(l.id.equals("fluid-2")&&f>=40&&f<56)state.flags|=8;
                    for(int tick=0;tick<5;tick++)state.advance(.025);
                    var mesh=FormedMachineScene.mesh(l,state);out.writeInt(state.flags);out.writeInt(mesh.size());
                    for(var q:mesh){out.writeByte(q.layer());for(var p:q.p())for(double x:p)out.writeFloat((float)x);for(float c:q.color())out.writeFloat(c);}
                }
            }
            System.out.println("Exported formed machine "+l.id);
        }
    }
}
