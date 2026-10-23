package creation.intro;

import java.util.UUID;
import net.minecraft.nbt.*;

/** Real Minecraft NBT/SavedData types, without starting a client, server or registry bootstrap. */
public final class IntroProgressTest {
    public static void main(String[] ignored){
        UUID owner=UUID.randomUUID(),other=UUID.randomUUID();IntroProgress progress=new IntroProgress();
        if(progress.hasFlight(owner)||progress.isDirty())throw new AssertionError("Old/empty data grants nothing");
        progress.grant(owner);if(!progress.hasFlight(owner)||!progress.isDirty())throw new AssertionError("Grant must persist");
        CompoundTag disk=progress.save(new CompoundTag(),null);
        IntroProgress restored=IntroProgress.read(disk,null);
        if(!restored.hasFlight(owner)||restored.hasFlight(other))throw new AssertionError("Flight qualification must survive an NBT round trip for the owner only");
        restored.setDirty(false);restored.grant(owner);if(restored.isDirty())throw new AssertionError("No extra write for repeated ability restoration");
        disk.getList("flight",Tag.TAG_STRING).add(StringTag.valueOf("broken-uuid"));
        if(!IntroProgress.read(disk,null).hasFlight(owner))throw new AssertionError("Malformed optional entry must not discard the owner");
        if(restored.hasManual(owner)||restored.hasManual(other))throw new AssertionError("Old saves must not claim a delivered manual");
        if(!restored.claimManual(owner)||restored.claimManual(owner))throw new AssertionError("Manual granted only once");
        IntroProgress withBook=IntroProgress.read(restored.save(new CompoundTag(),null),null);
        if(!withBook.hasManual(owner)||withBook.hasManual(other)||withBook.claimManual(owner))throw new AssertionError("Book delivery survives NBT and remains owner-specific");
        if(!withBook.hasFlight(owner))throw new AssertionError("Adding book persistence preserves flight");
        UUID old=UUID.randomUUID(),newPlayer=UUID.randomUUID();
        withBook.checkChapter(old,true);
        if(!withBook.chapterDone(old)||withBook.queueChapter(old))throw new AssertionError("Already finished chapter must never replay");
        withBook.checkChapter(old,false);
        if(withBook.queueChapter(old))throw new AssertionError("A later quest reset must not re-enrol migrated players");
        if(withBook.queueChapter(newPlayer))throw new AssertionError("No chapter trigger before old-save baseline");
        withBook.checkChapter(newPlayer,false);
        if(!withBook.queueChapter(newPlayer)||withBook.queueChapter(newPlayer))throw new AssertionError("Normal/shift duplicate hooks create one pending scene");
        IntroProgress pending=IntroProgress.read(withBook.save(new CompoundTag(),null),null);
        if(!pending.chapterPending(newPlayer)||pending.chapterPending(old)||!pending.chapterDone(old))throw new AssertionError("Pending and old-completed states survive reconnect");
        pending.checkChapter(newPlayer,true);
        if(!pending.chapterPending(newPlayer))throw new AssertionError("New task completion cannot erase a queued story");
        pending.completeChapter(newPlayer);
        IntroProgress completed=IntroProgress.read(pending.save(new CompoundTag(),null),null);
        if(!completed.chapterDone(newPlayer)||completed.chapterPending(newPlayer)||completed.queueChapter(newPlayer))throw new AssertionError("Finished scene does not replay");
        if(completed.hasFlight(old)||completed.hasFlight(newPlayer)||completed.hasManual(newPlayer))throw new AssertionError("Chapter migration does not grant prologue abilities/rewards");
        if(!completed.hasFlight(owner)||!completed.hasManual(owner))throw new AssertionError("Chapter migration must preserve existing manual and flight");
        System.out.println("PASS actual NBT v1/v2/v3 migration, flight/manual preservation, old-chapter suppression, pending reconnect, completion and player isolation");
    }
}
