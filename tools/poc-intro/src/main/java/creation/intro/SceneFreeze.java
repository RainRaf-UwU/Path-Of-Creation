package creation.intro;

import java.util.*;
import java.util.function.*;

/** A shared lease: the last viewer restores the world's original freeze state. */
final class SceneFreeze {
    private final BooleanSupplier frozen;
    private final Consumer<Boolean> setFrozen;
    private final Set<UUID> viewers=new HashSet<>();
    private boolean original;
    SceneFreeze(BooleanSupplier frozen,Consumer<Boolean> setFrozen){this.frozen=frozen;this.setFrozen=setFrozen;}
    void enter(UUID id){
        if(viewers.contains(id))return;
        if(viewers.isEmpty()){original=frozen.getAsBoolean();setFrozen.accept(true);}
        viewers.add(id);
    }
    void leave(UUID id){if(viewers.remove(id)&&viewers.isEmpty())setFrozen.accept(original);}
}
