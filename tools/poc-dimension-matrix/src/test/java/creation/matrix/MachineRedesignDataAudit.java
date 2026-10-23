package creation.matrix;

import com.google.gson.*;import java.nio.file.*;import java.util.*;
import net.minecraft.nbt.*;import net.minecraft.core.*;import net.minecraft.world.level.block.Rotation;import org.joml.Vector3f;
import dev.ftb.mods.ftblibrary.snbt.SNBT;

public final class MachineRedesignDataAudit {
    private static void check(boolean b,String why){if(!b)throw new AssertionError(why);}
    private static Tag clean(Tag t){
        if(t instanceof CompoundTag c){var result=c.copy();for(String key:c.getAllKeys()){if(key.equals("buildinggadgets2:copy_uuid")||key.equals("buildinggadgets2:gadget_uuid"))result.remove(key);else result.put(key,clean(c.get(key)));}return result;}
        if(t instanceof ListTag list){var result=new ListTag();for(Tag v:list)result.add(clean(v));return result;}return t.copy();
    }
    public static void main(String[] args)throws Exception{
        var root=Path.of(args[0]);var backup=root.resolve("design/multiblock-redesign-20261023/backup");int files=0;
        try(var paths=Files.walk(root.resolve("config/ftbquests/quests"))){for(var p:paths.filter(p->p.toString().endsWith(".snbt")).toList()){
            var actual=SNBT.tryRead(p);var old=SNBT.tryRead(backup.resolve(root.relativize(p)));check(actual!=null&&old!=null,"FTB SNBT parse "+p);check(clean(actual).equals(clean(old)),"Changed non-template quest data "+p);files++;
        }}
        var json=JsonParser.parseString(Files.readString(root.resolve("kubejs/data/rain/machine_redesign/templates.json"))).getAsJsonObject();int decoded=0;
        for(var e:json.getAsJsonArray("templates")){var o=e.getAsJsonObject();CompoundTag tag=TagParser.parseTag(o.get("snbt").getAsString());int[] indices=tag.getIntArray("statelist");var start=tag.getCompound("startpos");var end=tag.getCompound("endpos");var palette=tag.getList("blockstatemap",Tag.TAG_COMPOUND);var min=new BlockPos(start.getInt("X"),start.getInt("Y"),start.getInt("Z"));var max=new BlockPos(end.getInt("X"),end.getInt("Y"),end.getInt("Z"));int i=0;
            for(var p:BlockPos.betweenClosed(min,max)){check(i<indices.length,"Template too short");check(indices[i]>=0&&indices[i]<palette.size(),"Invalid palette index");int offset=(p.getX()-min.getX())+(max.getX()-min.getX()+1)*((p.getY()-min.getY())+(max.getY()-min.getY()+1)*(p.getZ()-min.getZ()));check(offset==i,"BG2 position ordering");i++;}
            check(i==indices.length,"Template volume mismatch");decoded++;
        }
        // 游戏特效矩阵必须与CM内部四朝向方块坐标一致。
        var point=new BlockPos(2,3,5);for(var facing:List.of(Direction.SOUTH,Direction.WEST,Direction.NORTH,Direction.EAST)){
            var expected=point.rotate(switch(facing){case SOUTH->Rotation.NONE;case WEST->Rotation.CLOCKWISE_90;case NORTH->Rotation.CLOCKWISE_180;default->Rotation.COUNTERCLOCKWISE_90;});
            var actual=new Vector3f(2,3,5).rotateY((float)Math.toRadians(-facing.toYRot()));check(Math.abs(actual.x-expected.getX())<.0001&&Math.abs(actual.z-expected.getZ())<.0001,"FX facing mismatch "+facing);
        }
        System.out.println("PASS native FTB parser: "+files+" files; quests/tasks/dependencies unchanged after excluding two UUID fields; native NBT + BG2 coordinate order: "+decoded+" templates; all four FX facings");
    }
}
