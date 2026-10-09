import java.nio.file.*;
import java.net.*;
import java.util.*;
import java.lang.reflect.*;
import net.minecraft.launchwrapper.Launch;
import net.minecraft.launchwrapper.LaunchClassLoader;
import org.spongepowered.asm.launch.MixinBootstrap;
import org.spongepowered.asm.mixin.MixinEnvironment;
import org.spongepowered.asm.mixin.Mixins;
import org.spongepowered.asm.mixin.transformer.IMixinTransformer;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;

/** Offline bytecode transformation; never launches the Minecraft client. */
public class UiMixinTransformCheck {
    public static void main(String[] args) throws Exception {
        Path root=Path.of(args[0]),out=Path.of(args[1]);
        String name="net.minecraft.server.packs.resources.MultiPackResourceManager";
        URL[] urls=Arrays.stream(System.getProperty("java.class.path").split(java.io.File.pathSeparator))
            .map(p->{try{return Path.of(p).toUri().toURL();}catch(Exception e){throw new RuntimeException(e);}}).toArray(URL[]::new);
        Launch.classLoader=new LaunchClassLoader(urls);
        Launch.blackboard=new HashMap<>();
        Launch.blackboard.put("TweakClasses",new ArrayList<String>());
        Launch.blackboard.put("Tweaks",new ArrayList<>());
        MixinBootstrap.init();
        MixinEnvironment.getDefaultEnvironment().setSide(MixinEnvironment.Side.CLIENT);
        Mixins.addConfiguration("kubejs_lang_override.mixins.json");
        Method phase=MixinEnvironment.class.getDeclaredMethod("gotoPhase",MixinEnvironment.Phase.class);
        phase.setAccessible(true);phase.invoke(null,MixinEnvironment.Phase.DEFAULT);
        IMixinTransformer transformer=(IMixinTransformer)MixinEnvironment.getCurrentEnvironment().getActiveTransformer();
        if(transformer==null)throw new IllegalStateException("No active Mixin transformer");
        byte[] original;
        try(var input=UiMixinTransformCheck.class.getClassLoader().getResourceAsStream(name.replace('.','/')+".class")) {
            original=input.readAllBytes();
        }
        byte[] transformed=transformer.transformClassBytes(name,name,original);
        if(Arrays.equals(original,transformed))throw new IllegalStateException("Mixin was not applied");
        ClassNode node=new ClassNode();new ClassReader(transformed).accept(node,0);
        MethodNode constructor=node.methods.stream().filter(m->m.name.equals("<init>")).findFirst().orElseThrow();
        boolean invokes=false,stores=false;
        for(AbstractInsnNode insn:constructor.instructions) {
            if(insn instanceof MethodInsnNode call && call.name.contains("prioritizeKubeJsAssets"))invokes=true;
            if(invokes && insn instanceof VarInsnNode var && var.getOpcode()==Opcodes.ASTORE && var.var==2)stores=true;
        }
        if(!invokes||!stores)throw new IllegalStateException("Constructor resource argument not replaced");
        for(MethodNode method:node.methods)if(method.name.contains("prioritizeKubeJsAssets")) {
            for(AbstractInsnNode insn:method.instructions)if(insn instanceof MethodInsnNode call && call.name.equals("clear"))
                throw new IllegalStateException("Destructive list.clear remains");
        }
        Path file=out.resolve(name.replace('.','/')+".class");Files.createDirectories(file.getParent());Files.write(file,transformed);
        System.out.println("Actual Mixin 0.8.7 transformed the Minecraft constructor: resource argument replaced; no list.clear call.");
    }
}
