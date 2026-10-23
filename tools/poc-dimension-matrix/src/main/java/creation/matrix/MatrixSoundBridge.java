package creation.matrix;

import fr.frinn.custommachinery.common.init.CustomMachineTile;
import java.util.function.BiConsumer;

/** 公共 tick 不直接链接客户端声音类，专用服务器保持可加载。 */
public final class MatrixSoundBridge {
    public static BiConsumer<CustomMachineTile,Rotor> tick=(tile,rotor)->{};
    private MatrixSoundBridge() { }
}
