package creation.matrix.mixin;

import creation.matrix.*;
import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.core.BlockPos;
import net.minecraft.core.HolderLookup;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Unique;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

@Mixin(value = CustomMachineTile.class, remap = false)
public abstract class MachineTileMixin implements MatrixAccess, MachineFx.Access {
    @Unique private MachineFx.State poc$effect;
    public MachineFx.State poc$fx(){if(poc$effect==null)poc$effect=new MachineFx.State();return poc$effect;}
    @Unique private int matrix$flags;
    @Unique private Rotor matrix$rotor;
    @Unique private MatrixThermalData matrix$thermal;
    public MatrixThermalData matrix$getThermal(){if(matrix$thermal==null)matrix$thermal=new MatrixThermalData();return matrix$thermal;}
    public int matrix$getFlags() { return matrix$flags; }
    public void matrix$setFlags(int flags) { matrix$flags = flags; }
    public Rotor matrix$getRotor() {
        if (matrix$rotor == null) matrix$rotor = new Rotor();
        return matrix$rotor;
    }

    @Inject(method = "serverTick", at = @At("TAIL"))
    private static void matrix$server(Level level, BlockPos pos, BlockState state, CustomMachineTile tile, CallbackInfo ci) {
        MatrixState.tick(tile);
        MachineFx.serverTick(tile);
    }

    @Inject(method = "clientTick", at = @At("TAIL"))
    private static void matrix$client(Level level, BlockPos pos, BlockState state, CustomMachineTile tile, CallbackInfo ci) {
        if(MachineFx.supported(tile)){var fx=((MachineFx.Access)tile).poc$fx();fx.advance(.05);MachineFx.client.accept(tile,fx);}
        if (!MatrixState.isMatrix(tile)) return;
        var access = (MatrixAccess) tile;
        int flags = access.matrix$getFlags();
        access.matrix$getRotor().advance(0.05, (flags & MatrixState.POWERED) != 0, (flags & MatrixState.RUNNING) != 0);
        MatrixSoundBridge.tick.accept(tile,access.matrix$getRotor());
        access.matrix$getThermal().clientTick();
    }

    @Inject(method = "getUpdateTag", at = @At("RETURN"))
    private void matrix$write(HolderLookup.Provider registries, CallbackInfoReturnable<CompoundTag> cir) {
        if(MachineFx.supported((CustomMachineTile)(Object)this)){var fx=poc$fx();cir.getReturnValue().putInt(MachineFx.TAG,((fx.layout+1)<<4)|fx.flags);}
        if (MatrixState.isMatrix((CustomMachineTile) (Object) this)) {
            cir.getReturnValue().putInt(MatrixState.TAG,matrix$flags);matrix$getThermal().save(cir.getReturnValue(),registries);
        }
    }

    @Inject(method = "loadAdditional", at = @At("TAIL"))
    private void matrix$read(CompoundTag tag, HolderLookup.Provider registries, CallbackInfo ci) {
        if(tag.contains(MachineFx.TAG)){int v=tag.getInt(MachineFx.TAG);poc$fx().layout=(v>>4)-1;poc$fx().flags=v&15;}
        if (tag.contains(MatrixState.TAG)) matrix$flags = tag.getInt(MatrixState.TAG);
        if(tag.contains("poc_matrix_thermal"))matrix$getThermal().load(tag,registries);
    }
    @Inject(method="saveAdditional",at=@At("TAIL"))
    private void matrix$saveThermal(CompoundTag tag,HolderLookup.Provider registries,CallbackInfo ci){
        if(MatrixState.isMatrix((CustomMachineTile)(Object)this))matrix$getThermal().save(tag,registries);
    }
}
