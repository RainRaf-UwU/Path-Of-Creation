package creation.matrix.jei;

import java.util.*;

/** 注册表无关的图纸坐标；从实际 CM requirement 的 pattern/keys 构造。 */
public final class Blueprint {
    public record Cell(int x,int y,int z,List<String> choices) { }
    public record Material(String ingredient,int count,List<String> alternatives) { }
    public final List<Cell> cells;
    public final List<Material> materials;
    public final int width,height,depth,originX,originY,originZ;
    public final String signature;
    public Blueprint(List<List<String>> pattern,Map<Character,List<String>> keys){
        height=pattern.size();depth=pattern.getFirst().size();width=pattern.getFirst().getFirst().length();
        int mx=0,my=0,mz=0,found=0;
        for(int y=0;y<height;y++){
            if(pattern.get(y).size()!=depth)throw new IllegalArgumentException("Uneven depth");
            for(int z=0;z<depth;z++){
                var row=pattern.get(y).get(z);if(row.length()!=width)throw new IllegalArgumentException("Uneven width");
                for(int x=0;x<width;x++)if(row.charAt(x)=='m'){mx=x;my=y;mz=z;found++;}
            }
        }
        if(found!=1)throw new IllegalArgumentException("Expected one controller, found "+found);
        originX=mx;originY=my;originZ=mz;
        var all=new ArrayList<Cell>();var counts=new TreeMap<String,Integer>();var options=new TreeMap<String,Set<String>>();
        for(int y=0;y<height;y++)for(int z=0;z<depth;z++)for(int x=0;x<width;x++){
            char symbol=pattern.get(y).get(z).charAt(x);
            var choice=symbol=='m'?List.of("$controller"):keys.getOrDefault(symbol,symbol==' '?List.of("*"):null);
            if(choice==null||choice.isEmpty())throw new IllegalArgumentException("Missing key "+symbol);
            choice=List.copyOf(choice);if(choice.equals(List.of("*")))continue;
            all.add(new Cell(x-mx,y-my,z-mz,choice));
            String first=choice.getFirst();
            if(!air(first)&&!first.equals("$controller")&&!first.startsWith("!")){
                counts.merge(first,1,Integer::sum);
                options.computeIfAbsent(first,k->new TreeSet<>()).addAll(choice);
            }
        }
        cells=List.copyOf(all);
        materials=counts.entrySet().stream().map(e->new Material(e.getKey(),e.getValue(),List.copyOf(options.get(e.getKey())))).toList();
        signature=width+":"+height+":"+depth+":"+cells.toString();
    }
    public static boolean air(String value){return value.equals("minecraft:air")||value.equals("minecraft:cave_air")||value.equals("minecraft:void_air");}
    public int blockCount(){return 1+materials.stream().mapToInt(Material::count).sum();}
}
