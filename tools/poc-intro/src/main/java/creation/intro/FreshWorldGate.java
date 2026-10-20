package creation.intro;

import java.nio.file.*;
import java.io.IOException;

/** Creation permission is tied to this WorldData object, never to a missing 'seen' flag. */
public final class FreshWorldGate {
    private Path path;
    private Object identity;
    public synchronized boolean arm(Path root, Object worldData) {
        path=null;identity=null;
        try {
            root=root.toRealPath();
            for(String name:new String[]{"level.dat","level.dat_old","region","playerdata","DIM-1","DIM1"}) {
                try { Files.readAttributes(root.resolve(name),java.nio.file.attribute.BasicFileAttributes.class);return false; }
                catch(NoSuchFileException absent) { /* Creation may already contain datapacks and session.lock. */ }
            }
            if(worldData==null)return false;
            path=root;identity=worldData;return true;
        }catch(IOException|SecurityException failure){return false;}
    }
    public synchronized boolean consume(Path root,Object worldData) {
        try {
            boolean allowed=path!=null&&identity==worldData&&path.equals(root.toRealPath());
            // An unrelated server cannot take a stale creation permission either.
            path=null;identity=null;return allowed;
        }catch(IOException|SecurityException failure){path=null;identity=null;return false;}
    }
}
