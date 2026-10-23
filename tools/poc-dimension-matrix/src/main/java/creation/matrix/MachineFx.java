package creation.matrix;

import com.google.gson.*;
import fr.frinn.custommachinery.common.init.CustomMachineTile;
import fr.frinn.custommachinery.common.init.Registration;
import fr.frinn.custommachinery.common.util.BlockIngredient;
import fr.frinn.custommachinery.common.util.BlockStructure;
import fr.frinn.custommachinery.api.machine.MachineStatus;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.BiConsumer;

/** 原有多方块的纯表现状态。不改配方、不扣能、不更改方块。 */
public final class MachineFx {
    public static final String TAG="poc_machine_assembly_v2";
    public interface Access { State poc$fx(); }
    public static final class State {
        public int layout=-1, flags;
        public long lastCheck=Long.MIN_VALUE;
        public double time,angle,speed,visibility;
        public void advance(double dt){
            time+=dt;double target=(flags&4)!=0?1:0;
            speed=Math.max(0,Math.min(1,speed+(target>speed?dt/1.5:-dt)));
            angle+=dt*speed*2.8;
            visibility=Math.max(0,Math.min(1,visibility+((flags&2)!=0?dt/1.5:-dt)));
        }
        public State sample(double dt){State s=new State();s.layout=layout;s.flags=flags;s.time=time;s.angle=angle;s.speed=speed;s.visibility=visibility;s.advance(dt);return s;}
    }
    public static final class Layout {
        public record Cell(int x,int y,int z){}
        public final int index;
        public final String id,family,effect;
        public final double[] focus,color;
        public final double radius;
        public final List<List<String>> pattern;
        public final Map<Character,String> keys=new LinkedHashMap<>();
        public final int count;
        public final List<Cell> cells;
        public final int originX,originY,originZ;
        private BlockStructure structure;
        Layout(JsonObject o,int index){
            this.index=index;id=o.get("id").getAsString();family=o.get("family").getAsString();effect=o.get("effect").getAsString();
            radius=o.get("radius").getAsDouble();focus=array(o.getAsJsonArray("focus"));color=array(o.getAsJsonArray("color"));
            pattern=new ArrayList<>();int n=0;
            for(var floor:o.getAsJsonArray("pattern")){List<String> rows=new ArrayList<>();for(var row:floor.getAsJsonArray()){String s=row.getAsString();rows.add(s);for(char c:s.toCharArray())if(c!=' ')n++;}pattern.add(rows);}
            count=n;for(var e:o.getAsJsonObject("keys").entrySet())keys.put(e.getKey().charAt(0),e.getValue().getAsString());
            int mx=0,my=0,mz=0;for(int y=0;y<pattern.size();y++)for(int z=0;z<pattern.get(y).size();z++){int x=pattern.get(y).get(z).indexOf('m');if(x>=0){mx=x;my=y;mz=z;}}
            originX=mx;originY=my;originZ=mz;var list=new ArrayList<Cell>();for(int y=0;y<pattern.size();y++)for(int z=0;z<pattern.get(y).size();z++)for(int x=0;x<pattern.get(y).get(z).length();x++)if(pattern.get(y).get(z).charAt(x)!=' ')list.add(new Cell(x-mx,y-my,z-mz));cells=List.copyOf(list);
        }
        public String modelId(){return switch(id){case "inspector-0"->"dyeing-0";case "inspector-1"->"mining-0";case "inspector-2"->"mining-1";case "inspector-3"->"fluid-0";case "inspector-4"->"fluid-1";case "inspector-5"->"fluid-2";case "inspector-6"->"fluid-4";default->id;};}
        private static double[] array(JsonArray a){double[] x=new double[a.size()];for(int i=0;i<x.length;i++)x[i]=a.get(i).getAsDouble();return x;}
        private BlockStructure structure(){
            if(structure==null){try{var b=BlockStructure.Builder.start();for(var f:pattern)b.aisle(f.toArray(String[]::new));for(var e:keys.entrySet())b.where(e.getKey(),List.of(BlockIngredient.of(e.getValue())));structure=b.build();}catch(Exception e){throw new IllegalStateException("Invalid FX structure "+id,e);}}return structure;
        }
        boolean match(CustomMachineTile tile){return structure().match(tile.getLevel(),tile.getBlockPos(),tile.getComponentManager().facing());}
    }
    public static final List<Layout> LAYOUTS=load();
    private static List<Layout> load(){
        try(var in=MachineFx.class.getResourceAsStream("/machine-redesign.json")){
            if(in==null)throw new IllegalStateException("Missing machine-redesign.json");
            List<Layout> result=new ArrayList<>();for(var o:JsonParser.parseReader(new InputStreamReader(in,StandardCharsets.UTF_8)).getAsJsonArray())result.add(new Layout(o.getAsJsonObject(),result.size()));return List.copyOf(result);
        }catch(Exception e){throw new IllegalStateException("Invalid machine FX data",e);}
    }
    public static String family(CustomMachineTile t){
        if(t.getId()==null||!t.getId().getNamespace().equals("custommachinery"))return "";
        return switch(t.getId().getPath()){case "void_mining_machine"->"mining";case "dyeing_factory"->"dyeing";case "fluid_processing"->"fluid";default->"";};
    }
    public static boolean supported(CustomMachineTile t){return !family(t).isEmpty();}
    public static BiConsumer<CustomMachineTile,State> client=(t,s)->{};
    public static Layout layout(State s){return s.layout>=0&&s.layout<LAYOUTS.size()?LAYOUTS.get(s.layout):null;}
    public static void serverTick(CustomMachineTile tile){
        String family=family(tile);if(family.isEmpty())return;State s=((Access)tile).poc$fx();int old=s.flags,oldLayout=s.layout;
        long now=tile.getLevel().getGameTime();boolean annex=(s.flags&8)!=0;
        if(s.lastCheck==Long.MIN_VALUE||now-s.lastCheck>=10){
            s.lastCheck=now;
            // 先验证上次命中的主体；增幅叉不是独立机器，不单独触发启动。
            var current=layout(s);boolean valid=current!=null&&current.match(tile);
            if(!valid){s.layout=-1;for(var l:LAYOUTS.stream().filter(l->l.family.equals(family)&&!l.effect.equals("time")).sorted(Comparator.comparingInt((Layout l)->l.count).reversed()).toList())if(l.match(tile)){s.layout=l.index;break;}}
            var l=layout(s);annex=l!=null&&l.modelId().equals("fluid-2")&&LAYOUTS.stream().filter(a->a.id.equals("fluid-3")).findFirst().orElseThrow().match(tile);
        }
        boolean formed=s.layout>=0;
        boolean powered=formed&&tile.getComponentManager().getComponent(Registration.ENERGY_MACHINE_COMPONENT.get()).map(e->e.getEnergy()>0).orElse(true);
        boolean running=powered&&tile.getStatus()==MachineStatus.RUNNING;
        s.flags=(formed?1:0)|(powered?2:0)|(running?4:0)|(formed&&annex?8:0);
        if(old!=s.flags||oldLayout!=s.layout)tile.getLevel().sendBlockUpdated(tile.getBlockPos(),tile.getBlockState(),tile.getBlockState(),2);
    }
    private MachineFx(){}
}
