package creation.matrix;

import java.util.*;

public final class BlastTest {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    public static void main(String[] args){
        var volume=BlastVolume.around(-1,80,-17,-64,320);
        check(volume.cells()==176*176*176);check(volume.maxY()-volume.minY()==176);
        check(volume.chunkX(0)==volume.minChunkX()+5&&volume.chunkZ(0)==volume.minChunkZ()+5);
        var visited=new BitSet(volume.cells());var chunks=new HashSet<Long>();
        for(int cursor=0;cursor<volume.cells();cursor++){
            int x=volume.x(cursor),y=volume.y(cursor),z=volume.z(cursor);
            check(volume.contains(x,y,z));
            int relative=(y-volume.minY())*176*176+(z-volume.minChunkZ()*16)*176+x-volume.minChunkX()*16;
            check(!visited.get(relative));visited.set(relative);
            chunks.add(((long)volume.chunkX(cursor)<<32)^(volume.chunkZ(cursor)&0xffffffffL));
        }
        check(visited.cardinality()==volume.cells()&&chunks.size()==121);
        check(!volume.contains(volume.minChunkX()*16-1,80,-17));check(!volume.contains((volume.minChunkX()+11)*16,80,-17));
        check(BlastVolume.around(0,-64,0,-64,320).minY()==-64);
        check(BlastVolume.around(0,319,0,-64,320).maxY()==320);
        // 保存游标后恢复，下一格、剩余范围完全一致，不接触真实世界。
        int checkpoint=123456;var restored=new BlastVolume(volume.minChunkX(),volume.minY(),volume.minChunkZ(),volume.maxY());
        check(restored.x(checkpoint)==volume.x(checkpoint)&&restored.y(checkpoint)==volume.y(checkpoint)&&restored.z(checkpoint)==volume.z(checkpoint));
        System.out.println("PASS blast: exact 11x11x11 chunk-section cube / 5,451,776 unique cells / 121 horizontal chunks / negative coordinates / exclusive bounds / world-height clipping / cursor restoration; no world modified");
    }
}
