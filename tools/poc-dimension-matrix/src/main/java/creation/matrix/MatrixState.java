package creation.matrix;

import com.google.gson.JsonParser;
import fr.frinn.custommachinery.common.init.CustomMachineTile;
import fr.frinn.custommachinery.common.init.Registration;
import fr.frinn.custommachinery.common.util.BlockIngredient;
import fr.frinn.custommachinery.common.util.BlockStructure;
import net.minecraft.resources.ResourceLocation;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.ArrayList;

public final class MatrixState {
    public static final ResourceLocation ID = ResourceLocation.fromNamespaceAndPath("custommachinery", "dimension_matrix");
    public static final String TAG = "poc_dimension_matrix_flags";
    public static final int FORMED = 1, POWERED = 2, RUNNING = 4;
    private static BlockStructure structure;

    public static boolean isMatrix(CustomMachineTile tile) { return ID.equals(tile.getId()); }

    private static BlockStructure structure() {
        if (structure != null) return structure;
        try (var stream = MatrixState.class.getResourceAsStream("/dimension-matrix-structure.json")) {
            if (stream == null) throw new IllegalStateException("Missing matrix structure");
            var data = JsonParser.parseReader(new InputStreamReader(stream, StandardCharsets.UTF_8)).getAsJsonObject();
            var builder = BlockStructure.Builder.start();
            for (var floor : data.getAsJsonArray("pattern")) {
                var rows = floor.getAsJsonArray();
                String[] aisle = new String[rows.size()];
                for (int i = 0; i < rows.size(); i++) aisle[i] = rows.get(i).getAsString();
                builder.aisle(aisle);
            }
            for (var key : data.getAsJsonObject("keys").entrySet()) {
                var values=new ArrayList<BlockIngredient>();
                if(key.getValue().isJsonArray())for(var entry:key.getValue().getAsJsonArray())values.add(BlockIngredient.of(entry.getAsString()));
                else values.add(BlockIngredient.of(key.getValue().getAsString()));
                builder.where(key.getKey().charAt(0),values);
            }
            return structure = builder.build();
        } catch (Exception error) { throw new IllegalStateException("Invalid dimension matrix structure", error); }
    }

    public static boolean structureValid(CustomMachineTile tile){
        return structure().match(tile.getLevel(),tile.getBlockPos(),tile.getComponentManager().facing());
    }

    public static void tick(CustomMachineTile tile) {
        if (!isMatrix(tile)) return;
        MatrixPorts.refresh(tile);
        var access = (MatrixAccess) tile;
        int old = access.matrix$getFlags();
        boolean formed = (old & FORMED) != 0;
        if (tile.getLevel().getGameTime() % 10 == 0)
            formed = structure().match(tile.getLevel(), tile.getBlockPos(), tile.getComponentManager().facing());
        boolean powered = formed && tile.getComponentManager()
            .getComponent(Registration.ENERGY_MACHINE_COMPONENT.get()).map(e -> e.getEnergy() > 0).orElse(false);
        boolean running = powered && tile.getStatus() == fr.frinn.custommachinery.api.machine.MachineStatus.RUNNING;
        int flags = (formed ? FORMED : 0) | (powered ? POWERED : 0) | (running ? RUNNING : 0);
        if (flags != old) {
            access.matrix$setFlags(flags);
            tile.getLevel().sendBlockUpdated(tile.getBlockPos(), tile.getBlockState(), tile.getBlockState(), 2);
        }
        MatrixThermals.tick(tile,formed,powered,running);
    }
}
