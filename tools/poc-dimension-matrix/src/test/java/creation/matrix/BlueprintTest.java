package creation.matrix;

import com.google.gson.*;
import creation.matrix.jei.*;
import java.nio.file.*;
import java.util.*;
import org.joml.Vector3f;

public final class BlueprintTest {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    public static void main(String[] args)throws Exception{
        var data=JsonParser.parseString(Files.readString(Path.of(args[0]))).getAsJsonObject();
        int valid=0,invalid=0;var families=new HashSet<String>();
        for(var element:data.getAsJsonArray("structures")){
            var row=element.getAsJsonObject();
            var pattern=new ArrayList<List<String>>();
            for(var layer:row.getAsJsonArray("pattern")){var rows=new ArrayList<String>();for(var line:layer.getAsJsonArray())rows.add(line.getAsString());pattern.add(rows);}
            var keys=new HashMap<Character,List<String>>();
            row.getAsJsonObject("keys").entrySet().forEach(entry->{
                var list=new ArrayList<String>();if(entry.getValue().isJsonArray())for(var choice:entry.getValue().getAsJsonArray())list.add(choice.getAsString());else list.add(entry.getValue().getAsString());keys.put(entry.getKey().charAt(0),list);
            });
            Blueprint plan=new Blueprint(pattern,keys);
            valid++;families.add(row.get("machine").getAsString());
            check(plan.cells.stream().filter(c->c.choices().equals(List.of("$controller"))).count()==1);
            check(plan.cells.stream().filter(c->c.choices().equals(List.of("$controller"))).allMatch(c->c.x()==0&&c.y()==0&&c.z()==0));
            for(var cell:plan.cells){check(cell.x()+plan.originX>=0&&cell.x()+plan.originX<plan.width);check(cell.y()+plan.originY>=0&&cell.y()+plan.originY<plan.height);}
            if(row.get("machine").getAsString().equals("custommachinery:dimension_matrix"))check(plan.blockCount()==338);
            var view=new BlueprintView();
            for(int turn=0;turn<4;turn++)for(double zoom:new double[]{.2,1,4,16}){
                view.yaw=-35+90*turn;view.zoom=zoom;view.panX=13;view.panY=-8;
                // 单方块中心投影再反投影，必须命中同一格；验证矩阵顺序/缩放/深度。
                var screen=view.matrix(plan).transformPosition(new Vector3f(.5f,.5f,.5f));
                check(Double.isFinite(BlueprintView.hit(view.ray(plan,screen.x,screen.y),0,0,0)));
            }
            view.reset();var before=view.matrix(plan).transformPosition(new Vector3f(.5f,.5f,.5f));
            view.zoom(4,before.x,before.y);var after=view.matrix(plan).transformPosition(new Vector3f(.5f,.5f,.5f));
            check(Math.abs(before.x-after.x)<.001&&Math.abs(before.y-after.y)<.001);
        }
        check(families.size()==5);check(valid==17&&invalid==0);
        var ray=new Vector3f[]{new Vector3f(.5f,.5f,10),new Vector3f(.5f,.5f,-10)};
        check(BlueprintView.hit(ray,0,0,2)<BlueprintView.hit(ray,0,0,0));check(!Double.isFinite(BlueprintView.hit(ray,2,0,0)));
        System.out.println("PASS JEI blueprints: 5 machine families / 17 source structures / default material counts / controller coordinates / four views / 0.2x-16x picking / cursor-anchored zoom / frontmost ray hit");
    }
}
