package creation.compat.lychee;

import java.lang.reflect.Method;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import net.minecraft.launchwrapper.Launch;
import net.minecraft.launchwrapper.LaunchClassLoader;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.VarInsnNode;
import org.spongepowered.asm.launch.MixinBootstrap;
import org.spongepowered.asm.mixin.MixinEnvironment;
import org.spongepowered.asm.mixin.Mixins;
import org.spongepowered.asm.mixin.transformer.IMixinTransformer;

/** Weaves the installed Lychee with the actual Mixin engine, without starting Minecraft. */
public final class MixinTransformCheck {
    private static final String TARGET = "snownee.lychee.compat.recipeviewer.jei.category.JeiRvHelper";
    private static final String ACTION = "(Lnet/minecraft/world/level/material/Fluid;Lsnownee/lychee/util/ui/InputAction$Direct;)Z";
    private static ClassNode read(byte[] bytes) {
        ClassNode result = new ClassNode();
        // Mixin may regenerate frames/debug tables; compare executable code.
        new ClassReader(bytes).accept(result, ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES);
        return result;
    }
    private static byte[] methodBytes(MethodNode method) {
        ClassWriter writer = new ClassWriter(0);
        writer.visit(Opcodes.V21, Opcodes.ACC_PUBLIC, TARGET.replace('.', '/'), null, "java/lang/Object", null);
        method.accept(writer);
        writer.visitEnd();
        return writer.toByteArray();
    }
    public static void main(String[] args) throws Exception {
        URL[] urls = Arrays.stream(System.getProperty("java.class.path").split(java.io.File.pathSeparator))
                .map(p -> { try { return Path.of(p).toUri().toURL(); } catch (Exception e) { throw new RuntimeException(e); } })
                .toArray(URL[]::new);
        Launch.classLoader = new LaunchClassLoader(urls);
        Launch.blackboard = new HashMap<>();
        Launch.blackboard.put("TweakClasses", new ArrayList<String>());
        Launch.blackboard.put("Tweaks", new ArrayList<>());
        MixinBootstrap.init();
        MixinEnvironment.getDefaultEnvironment().setSide(MixinEnvironment.Side.CLIENT);
        Mixins.addConfiguration("poc_lychee_jei_compat.mixins.json");
        Method phase = MixinEnvironment.class.getDeclaredMethod("gotoPhase", MixinEnvironment.Phase.class);
        phase.setAccessible(true);
        phase.invoke(null, MixinEnvironment.Phase.DEFAULT);
        IMixinTransformer transformer = (IMixinTransformer) MixinEnvironment.getCurrentEnvironment().getActiveTransformer();
        if (transformer == null) throw new AssertionError("No active Mixin transformer");
        byte[] original;
        try (var input = MixinTransformCheck.class.getResourceAsStream("/" + TARGET.replace('.', '/') + ".class")) {
            original = input.readAllBytes();
        }
        byte[] transformed = transformer.transformClassBytes(TARGET, TARGET, original);
        if (Arrays.equals(original, transformed)) throw new AssertionError("Mixin was not applied");
        ClassNode before = read(original), after = read(transformed);
        MethodNode method = after.methods.stream().filter(m -> m.name.equals("doAction") && m.desc.equals(ACTION)).findFirst().orElseThrow();
        int normalize = -1, store = -1, guard = -1, query = -1;
        for (int i = 0; i < method.instructions.size(); i++) {
            var instruction = method.instructions.get(i);
            if (instruction instanceof MethodInsnNode call) {
                if (call.name.contains("poc$sourceFluid")) normalize = i;
                if (call.name.contains("poc$validFluidQuery")) guard = i;
                if (call.name.equals("createFocus")) query = i;
            }
            if (normalize >= 0 && store < 0 && instruction instanceof VarInsnNode variable
                    && variable.getOpcode() == Opcodes.ASTORE && variable.var == 1) store = i;
        }
        if (!(normalize >= 0 && normalize < store && store < guard && guard < query))
            throw new AssertionError("Expected normalize -> store fluid argument -> validate -> original JEI query; got "
                    + normalize + ", " + store + ", " + guard + ", " + query);
        for (MethodNode old : before.methods) {
            if (old.name.equals("doAction") && old.desc.equals(ACTION)) continue;
            MethodNode current = after.methods.stream().filter(m -> m.name.equals(old.name) && m.desc.equals(old.desc)).findFirst().orElseThrow();
            if (!Arrays.equals(methodBytes(old), methodBytes(current)))
                throw new AssertionError("Unrelated Lychee method changed: " + old.name + old.desc);
        }
        Path output = Path.of(args[0]).resolve(TARGET.replace('.', '/') + ".class");
        Files.createDirectories(output.getParent());
        Files.write(output, transformed);
        System.out.println("PASS actual Mixin transformation: normalization precedes guard and JEI focus; all unrelated Lychee methods unchanged. Minecraft was not launched.");
    }
}
