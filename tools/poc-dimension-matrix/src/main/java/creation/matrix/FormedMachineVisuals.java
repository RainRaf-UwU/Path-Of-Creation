package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import java.lang.ref.WeakReference;
import java.util.*;
import net.minecraft.client.Minecraft;
import net.minecraft.client.multiplayer.ClientLevel;
import net.minecraft.core.BlockPos;

/** 只隐藏视觉，不替换世界方块、不读写其物品/流体/NBT。 */
public final class FormedMachineVisuals {
    public static final FormationMask MASK=new FormationMask();
    private record Owner(WeakReference<CustomMachineTile> tile,int signature){}
    private static final Map<Long,Owner> OWNERS=new HashMap<>();
    private static ClientLevel level;
    public static boolean hidden(BlockPos p){return MASK.hidden(p.asLong());}
    public static boolean hideEntity(BlockPos p){return hidden(p)&&!MASK.controller(p.asLong());}
    private static void world(){var current=Minecraft.getInstance().level;if(level!=current){MASK.clear();OWNERS.clear();level=current;}}
    public static void observe(CustomMachineTile tile,MachineFx.State state){
        world();if(tile.getLevel()!=level||level==null)return;long key=tile.getBlockPos().asLong();var l=MachineFx.layout(state);
        if(l==null||(state.flags&1)==0){if(OWNERS.remove(key)!=null)dirty(MASK.update(key,Set.of()));return;}
        int signature=l.index*64+tile.getComponentManager().facing().ordinal()*2+((state.flags&8)!=0?1:0);var previous=OWNERS.get(key);
        if(previous!=null&&previous.signature==signature&&previous.tile.get()==tile)return;
        Set<Long> cells=new HashSet<>();add(cells,l,tile);
        if((state.flags&8)!=0)add(cells,MachineFx.LAYOUTS.stream().filter(a->a.id.equals("fluid-3")).findFirst().orElseThrow(),tile);
        OWNERS.put(key,new Owner(new WeakReference<>(tile),signature));dirty(MASK.update(key,cells));
    }
    private static void add(Set<Long> out,MachineFx.Layout l,CustomMachineTile tile){
        for(var c:l.cells){var p=new BlockPos(c.x(),c.y(),c.z()).rotate(switch(tile.getComponentManager().facing()){case SOUTH->net.minecraft.world.level.block.Rotation.NONE;case WEST->net.minecraft.world.level.block.Rotation.CLOCKWISE_90;case NORTH->net.minecraft.world.level.block.Rotation.CLOCKWISE_180;default->net.minecraft.world.level.block.Rotation.COUNTERCLOCKWISE_90;});out.add(tile.getBlockPos().offset(p).asLong());}
    }
    public static void clean(){
        world();if(level==null)return;var it=OWNERS.entrySet().iterator();while(it.hasNext()){var e=it.next();var tile=e.getValue().tile.get();if(tile==null||tile.isRemoved()||tile.getLevel()!=level||!level.hasChunkAt(BlockPos.of(e.getKey()))||level.getBlockEntity(BlockPos.of(e.getKey()))!=tile){dirty(MASK.update(e.getKey(),Set.of()));it.remove();}}
    }
    private static void dirty(Set<Long> cells){
        if(level==null||cells.isEmpty())return;Set<Long> sections=new HashSet<>();for(long packed:cells){var p=BlockPos.of(packed);sections.add(net.minecraft.core.SectionPos.asLong(p));}
        var renderer=Minecraft.getInstance().levelRenderer;for(long packed:sections){var s=net.minecraft.core.SectionPos.of(packed);renderer.setBlocksDirty(s.minBlockX()-1,s.minBlockY()-1,s.minBlockZ()-1,s.maxBlockX()+1,s.maxBlockY()+1,s.maxBlockZ()+1);}
    }
    private FormedMachineVisuals(){}
}
