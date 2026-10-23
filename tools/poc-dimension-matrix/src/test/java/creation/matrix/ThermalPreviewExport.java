package creation.matrix;

import java.io.*;
import java.nio.file.*;
import com.google.gson.*;

/** 导出实际生产温度网格及蘑菇云发射点，不启动游戏。 */
public final class ThermalPreviewExport {
    public static void main(String[] args)throws Exception{
        var dest=Path.of(args[0]);Files.createDirectories(dest);
        for(double heat:new double[]{0,.55,.95}){
            var data=new java.util.ArrayList<float[]>();
            ThermalScene.emit(75,1440,12,1,heat,new double[]{.65,.3,.7},(x,y,z,r,g,b,a)->data.add(new float[]{(float)x,(float)y,(float)z,r,g,b,a}));
            try(var out=new DataOutputStream(new BufferedOutputStream(Files.newOutputStream(dest.resolve("heat-"+(int)(heat*100)+".bin"))))){out.writeInt(data.size());for(var vertex:data)for(float value:vertex)out.writeFloat(value);}
        }
        Files.writeString(dest.resolve("mushroom.json"),new Gson().toJson(MushroomShape.points(200)));
        System.out.println("Exported production thermal geometry and mushroom cloud samples");
    }
}
