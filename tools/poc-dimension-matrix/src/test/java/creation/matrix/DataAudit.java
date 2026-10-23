package creation.matrix;

import com.google.gson.*;
import java.nio.file.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** 静态数据/连通性检查；不初始化Minecraft或NeoForge。 */
public final class DataAudit {
    public static void main(String[] args) throws Exception {
        var machine=JsonParser.parseString(Files.readString(Path.of(args[0]))).getAsJsonObject();
        if(!machine.getAsJsonObject("name").getAsJsonObject("text").has("translate"))throw new AssertionError("Missing named-text wrapper");
        var data=JsonParser.parseReader(new InputStreamReader(DataAudit.class.getResourceAsStream("/dimension-matrix-structure.json"),StandardCharsets.UTF_8)).getAsJsonObject();
        var floors=data.getAsJsonArray("base_pattern");
        if(floors.size()!=11)throw new AssertionError("Height");
        Set<Integer> solid=new HashSet<>();int machines=0,air=0,projectors=0;
        for(int y=0;y<11;y++){
            var rows=floors.get(y).getAsJsonArray();if(rows.size()!=11)throw new AssertionError("Depth");
            for(int z=0;z<11;z++){
                String row=rows.get(z).getAsString();if(row.length()!=11)throw new AssertionError("Width");
                for(int x=0;x<11;x++){
                    char key=row.charAt(x);
                    if(key=='P'){projectors++;if(y!=0||(x!=3&&x!=7)||(z!=3&&z!=7))throw new AssertionError("Projector location");}
                    if(key=='m'){machines++;if(x!=5||y!=1||z!=10)throw new AssertionError("Controller location");}
                    else if(!data.getAsJsonObject("keys").has(String.valueOf(key)))throw new AssertionError("Undefined symbol");
                    if(key!='a')solid.add(y*121+z*11+x);else air++;
                    if(y>=2&&y<=8&&x>=1&&x<=9&&z>=1&&z<=9&&key!='a')throw new AssertionError("Obstructed chamber");
                }
            }
        }
        if(machines!=1||solid.size()!=338||air!=993||projectors!=4)throw new AssertionError("Unexpected bill of materials");
        Set<Integer> seen=new HashSet<>();ArrayDeque<Integer> queue=new ArrayDeque<>();queue.add(solid.iterator().next());
        while(!queue.isEmpty()){
            int p=queue.remove();if(!seen.add(p))continue;
            int x=p%11,z=p/11%11,y=p/121;
            for(int[] d:new int[][]{{1,0,0},{-1,0,0},{0,1,0},{0,-1,0},{0,0,1},{0,0,-1}}){
                int X=x+d[0],Y=y+d[1],Z=z+d[2];
                if(X<0||X>10||Y<0||Y>10||Z<0||Z>10)continue;
                int next=Y*121+Z*11+X;if(solid.contains(next)&&!seen.contains(next))queue.add(next);
            }
        }
        if(seen.size()!=solid.size())throw new AssertionError("Disconnected structural blocks");
        var style=JsonParser.parseReader(new InputStreamReader(DataAudit.class.getResourceAsStream("/dimension-matrix-visual.json"),StandardCharsets.UTF_8)).getAsJsonObject();
        if(!style.get("kind").getAsString().equals("tesseract_hologram")||!style.get("blend").getAsString().equals("src_alpha_one")
                ||style.get("depthWrite").getAsBoolean()||!style.get("depthTest").getAsBoolean())throw new AssertionError("Invalid hologram material");
        System.out.println("PASS static data: 11x11x11 structure; four required base projectors; 338 connected blocks; 993 air cells; additive hologram schema");
    }
}
