package net.minecraft.world.level.material;

/** Minimal fluid fixture: avoids starting Minecraft registries or a game window. */
public record FluidState(boolean source) {
}
