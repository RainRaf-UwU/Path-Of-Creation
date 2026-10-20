package creation.intro;

import java.util.*;
import net.minecraft.nbt.*;
import net.minecraft.core.HolderLookup;
import net.minecraft.world.level.saveddata.SavedData;
import net.minecraft.server.level.ServerLevel;

final class IntroProgress extends SavedData {
    private static final Factory<IntroProgress> FACTORY=new Factory<>(IntroProgress::new,IntroProgress::read);
    private final Set<UUID> flight=new HashSet<>();
    static IntroProgress get(ServerLevel level,boolean create){
        return create?level.getDataStorage().computeIfAbsent(FACTORY,"poc_intro"):
            level.getDataStorage().get(FACTORY,"poc_intro");
    }
    boolean hasFlight(UUID id){return flight.contains(id);}
    void grant(UUID id){if(flight.add(id))setDirty();}
    static IntroProgress read(CompoundTag tag,HolderLookup.Provider lookup){
        IntroProgress progress=new IntroProgress();ListTag list=tag.getList("flight",Tag.TAG_STRING);
        for(int i=0;i<list.size();i++){try{progress.flight.add(UUID.fromString(list.getString(i)));}catch(IllegalArgumentException ignored){}}
        return progress;
    }
    @Override public CompoundTag save(CompoundTag tag,HolderLookup.Provider lookup){
        ListTag list=new ListTag();flight.stream().sorted().forEach(id->list.add(StringTag.valueOf(id.toString())));
        tag.putInt("version",1);tag.put("flight",list);return tag;
    }
}
