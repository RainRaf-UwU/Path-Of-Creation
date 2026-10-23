package creation.matrix;
import java.util.*;
import java.util.concurrent.*;
import net.minecraft.core.BlockPos;

public final class AssemblyTest {
    private static void check(boolean b,String message){if(!b)throw new AssertionError(message);}
    public static void main(String[] args)throws Exception{
        var mask=new FormationMask();check(mask.update(1,Set.of(1L,3L,4L)).size()==3,"Initial formation");mask.update(2,Set.of(2L,3L,5L));check(mask.size()==5&&mask.hidden(3)&&mask.controller(1),"Overlapping structures");mask.update(1,Set.of());check(mask.hidden(3)&&!mask.hidden(4)&&!mask.controller(1),"Shared member prematurely unhidden");mask.update(2,Set.of());check(mask.size()==0,"Dismantle did not restore");
        ExecutorService workers=Executors.newFixedThreadPool(2);List<Future<?>> readers=new ArrayList<>();for(int i=0;i<2;i++)readers.add(workers.submit(()->{for(int j=0;j<50000;j++)mask.hidden(j%100);}));
        for(int round=0;round<100;round++){Set<Long> set=new HashSet<>();for(long i=0;i<100;i++)set.add(i);mask.update(99,set);mask.update(99,Set.of());}for(var f:readers)f.get();workers.shutdown();check(mask.clear().isEmpty(),"Mask leak");
        int active=0;long vertices=0;for(var l:MachineFx.LAYOUTS){if(l.family.equals("inspector")||l.effect.equals("time"))continue;active++;
            var state=new MachineFx.State();state.layout=l.index;state.flags=1;state.visibility=0;
            check(!FormedMachineScene.mesh(l,state).isEmpty(),"Unpowered complete structure must form: "+l.id);
            state.flags=0;check(FormedMachineScene.mesh(l,state).isEmpty(),"Broken structure still rendered: "+l.id);
            double minX=-l.originX-.65,maxX=l.pattern.getFirst().getFirst().length()-l.originX-.35,minY=-l.originY-.65,maxY=l.pattern.size()-l.originY-.35,minZ=-l.originZ-.7,maxZ=l.pattern.getFirst().size()-l.originZ+.2;
            for(int flags:new int[]{1,3,7,15})for(double time:new double[]{0,.5,2,5}){
                state.flags=flags;state.time=time;state.angle=time*2;state.speed=(flags&4)!=0?1:0;state.visibility=(flags&2)!=0?1:0;
                int[] n={0};FormedMachineScene.emit(l,state,(layer,x,y,z,r,g,b,a)->{check(Double.isFinite(x+y+z)&&Float.isFinite(a),"Nonfinite model "+l.id);check(layer>=0&&layer<=2&&a>=0&&a<=1,"Material channel");check(x>=minX&&x<=maxX&&y>=minY&&y<=maxY&&z>=minZ&&z<=maxZ,"Model outside structure bounds "+l.id+" "+x+","+y+","+z);n[0]++;});check(n[0]>0&&n[0]<60000&&n[0]%4==0,"Unbounded vertex count "+l.id+" "+n[0]);vertices=Math.max(vertices,n[0]);
            }
            // 原结构中的每一格都必须进入遮罩（包括控制器、红石块和方块实体）。
            Set<BlockPos> positions=new HashSet<>();for(var c:l.cells)positions.add(new BlockPos(c.x(),c.y(),c.z()));check(positions.size()==l.count&&positions.contains(BlockPos.ZERO),"Member coordinates "+l.id);
        }
        check(active==8,"Scope must exclude abandoned inspector and standalone time addon");
        var stopped=new MachineFx.State();stopped.flags=1;stopped.angle=4;stopped.advance(5);check(stopped.angle==4,"Idle mechanical parts drift");
        System.out.println("PASS formed models: 8 functional machines; no-power auto formation; dismantle restore; all states bounded; max "+vertices+" vertices; shared masks and worker-thread reads; detector excluded");
    }
}
