package creation.matrix;

import com.mojang.blaze3d.vertex.PoseStack;
import fr.frinn.custommachinery.common.init.CustomMachineTile;
import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.MultiBufferSource;

public final class MatrixRenderer {
    private MatrixRenderer() { }
    public static void render(CustomMachineTile tile, float partialTick, PoseStack pose, MultiBufferSource buffers) {
        if (!MatrixState.isMatrix(tile)) return;
        var rotor = ((MatrixAccess) tile).matrix$getRotor().sample(partialTick / 20.0);
        if (rotor.visibility <= 0.001) return;
        var facing = tile.getComponentManager().facing();
        double x = 0.5 - facing.getStepX() * 5, y = 4.5, z = 0.5 - facing.getStepZ() * 5;
        var eye = Minecraft.getInstance().gameRenderer.getMainCamera().getPosition();
        double[] camera = {eye.x - tile.getBlockPos().getX() - x,
            eye.y - tile.getBlockPos().getY() - y, eye.z - tile.getBlockPos().getZ() - z};
        double length = Math.sqrt(camera[0]*camera[0]+camera[1]*camera[1]+camera[2]*camera[2]);
        if (length > 0.00001) for (int i = 0; i < 3; i++) camera[i] /= length;
        else camera = new double[]{0,0,1};
        pose.pushPose();
        try {
            pose.translate(x,y,z);
            var vertices = buffers.getBuffer(HologramRenderType.GLOW);
            ThermalScene.emit(rotor.angle,rotor.speed,rotor.time,rotor.visibility,((MatrixAccess)tile).matrix$getThermal().displayHeat,camera,
                (X,Y,Z,r,g,b,a) -> vertices.addVertex(pose.last(),(float) X,(float) Y,(float) Z).setColor(r,g,b,a));
        } finally { pose.popPose(); }
    }
}
