package creation.intro;

import java.util.*;
import net.minecraft.nbt.*;
import net.minecraft.core.HolderLookup;
import net.minecraft.world.level.saveddata.SavedData;
import net.minecraft.server.level.ServerLevel;

final class IntroProgress extends SavedData {
    private static final Factory<IntroProgress> FACTORY=new Factory<>(IntroProgress::new,IntroProgress::read);
    private final Set<UUID> flight=new HashSet<>();
    private final Set<UUID> manual=new HashSet<>();
    private final Set<UUID> chapterKnown=new HashSet<>(),chapterPending=new HashSet<>(),chapterDone=new HashSet<>();
    static IntroProgress get(ServerLevel level,boolean create){
        return create?level.getDataStorage().computeIfAbsent(FACTORY,"poc_intro"):
            level.getDataStorage().get(FACTORY,"poc_intro");
    }
    boolean hasFlight(UUID id){return flight.contains(id);}
    void grant(UUID id){if(flight.add(id))setDirty();}
    boolean hasManual(UUID id){return manual.contains(id);}
    boolean claimManual(UUID id){if(!manual.add(id))return false;setDirty();return true;}
    boolean chapterKnown(UUID id){return chapterKnown.contains(id);}
    void checkChapter(UUID id,boolean alreadyCompleted){
        if(!chapterKnown.add(id))return;
        if(alreadyCompleted)chapterDone.add(id);
        setDirty();
    }
    boolean queueChapter(UUID id){
        if(!chapterKnown(id)||chapterDone.contains(id)||!chapterPending.add(id))return false;
        setDirty();return true;
    }
    boolean chapterPending(UUID id){return chapterPending.contains(id)&&!chapterDone.contains(id);}
    boolean chapterDone(UUID id){return chapterDone.contains(id);}
    void completeChapter(UUID id){chapterPending.remove(id);chapterKnown.add(id);if(chapterDone.add(id))setDirty();}
    static IntroProgress read(CompoundTag tag,HolderLookup.Provider lookup){
        IntroProgress progress=new IntroProgress();ListTag list=tag.getList("flight",Tag.TAG_STRING);
        for(int i=0;i<list.size();i++){try{progress.flight.add(UUID.fromString(list.getString(i)));}catch(IllegalArgumentException ignored){}}
        ListTag books=tag.getList("manual",Tag.TAG_STRING);
        for(int i=0;i<books.size();i++){try{progress.manual.add(UUID.fromString(books.getString(i)));}catch(IllegalArgumentException ignored){}}
        readIds(tag,"chapter1_known",progress.chapterKnown);readIds(tag,"chapter1_pending",progress.chapterPending);readIds(tag,"chapter1_done",progress.chapterDone);
        progress.chapterKnown.addAll(progress.chapterDone);progress.chapterKnown.addAll(progress.chapterPending);
        progress.chapterPending.removeAll(progress.chapterDone);
        return progress;
    }
    private static void readIds(CompoundTag tag,String key,Set<UUID> ids){
        ListTag entries=tag.getList(key,Tag.TAG_STRING);
        for(int i=0;i<entries.size();i++)try{ids.add(UUID.fromString(entries.getString(i)));}catch(IllegalArgumentException ignored){}
    }
    private static ListTag ids(Set<UUID> ids){ListTag list=new ListTag();ids.stream().sorted().forEach(id->list.add(StringTag.valueOf(id.toString())));return list;}
    @Override public CompoundTag save(CompoundTag tag,HolderLookup.Provider lookup){
        ListTag list=new ListTag();flight.stream().sorted().forEach(id->list.add(StringTag.valueOf(id.toString())));
        ListTag books=new ListTag();manual.stream().sorted().forEach(id->books.add(StringTag.valueOf(id.toString())));
        tag.putInt("version",3);tag.put("flight",list);tag.put("manual",books);
        tag.put("chapter1_known",ids(chapterKnown));tag.put("chapter1_pending",ids(chapterPending));tag.put("chapter1_done",ids(chapterDone));return tag;
    }
}
