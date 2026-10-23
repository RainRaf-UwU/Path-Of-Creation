package net.minecraft.world.level.material;

public class FlowingFluid extends Fluid {
    private final Fluid source;
    public FlowingFluid() { super(true); source = this; }
    public FlowingFluid(Fluid source) { super(false); this.source = source; }
    public Fluid getSource() { return source; }
}
