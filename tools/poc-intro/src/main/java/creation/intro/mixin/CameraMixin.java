package creation.intro.mixin;

import creation.intro.ClientIntro;
import net.minecraft.client.Camera;
import net.minecraft.world.level.BlockGetter;
import net.minecraft.world.entity.Entity;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(value=Camera.class,remap=false)
public abstract class CameraMixin {
    @Shadow protected abstract void setPosition(double x,double y,double z);
    @Shadow protected abstract void setRotation(float yaw,float pitch);
    @Inject(method="setup",at=@At("RETURN"),require=1)
    private void poc$seatedCamera(BlockGetter level,Entity entity,boolean detached,boolean mirrored,float partial,CallbackInfo ci){
        double[] p=ClientIntro.pose();if(p==null)return;
        setPosition(p[0],p[1],p[2]);setRotation((float)p[3],(float)p[4]);
    }
}
