package net.minecraft.world.level.material;

public class Fluid {
    private final boolean source;
    public Fluid(boolean source) { this.source = source; }
    public FluidState defaultFluidState() { return new FluidState(source); }
    public boolean isSource(FluidState state) { return state.source(); }
}
