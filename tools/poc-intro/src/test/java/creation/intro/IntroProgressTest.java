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
        System.out.println("PASS actual NBT flight persistence, owner isolation, duplicate grants and malformed optional entries");
    }
}
