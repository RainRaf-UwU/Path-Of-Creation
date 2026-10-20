package creation.cursor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;

/** Select once per instance; a later user deselection must survive restarts/updates. */
final class DefaultPackSelection {
    static final String PACK_ID = "file/Path-of-Creation-UI";

    static boolean initialize(Path marker, Collection<String> available, Collection<String> selected,
                              Consumer<List<String>> apply) throws IOException {
        if (Files.exists(marker)) return true;
        if (!available.contains(PACK_ID)) return false;
        if (!selected.contains(PACK_ID)) {
            List<String> next = new ArrayList<>(selected);
            next.add(PACK_ID);
            apply.accept(next);
        }
        Files.createDirectories(marker.getParent());
        Files.writeString(marker, "Default UI pack initialized. Later selections belong to the player.\n");
        return true;
    }
}
