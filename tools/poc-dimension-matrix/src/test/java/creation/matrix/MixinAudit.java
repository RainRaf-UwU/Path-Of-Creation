package creation.matrix;

import java.lang.reflect.Method;
import java.net.URL;
import java.nio.file.*;
import java.util.*;
import net.minecraft.launchwrapper.Launch;
import net.minecraft.launchwrapper.LaunchClassLoader;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import org.spongepowered.asm.launch.MixinBootstrap;
import org.spongepowered.asm.mixin.*;
import org.spongepowered.asm.mixin.transformer.IMixinTransformer;

/** 对本机Custom Machinery执行真实Mixin转换，不启动游戏。 */
public final class MixinAudit {
    public static void main(String[] args) throws Exception {
        URL[] urls=Arrays.stream(System.getProperty("java.class.path").split(java.io.File.pathSeparator))
            .map(p->{try{return Path.of(p).toUri().toURL();}catch(Exception e){throw new RuntimeException(e);}}).toArray(URL[]::new);
        Launch.classLoader=new LaunchClassLoader(urls);
        Launch.blackboard=new HashMap<>();
        Launch.blackboard.put("TweakClasses",new ArrayList<String>());
        Launch.blackboard.put("Tweaks",new ArrayList<>());
        MixinBootstrap.init();
        MixinEnvironment.getDefaultEnvironment().setSide(MixinEnvironment.Side.CLIENT);
        Mixins.addConfiguration("poc_dimension_matrix.mixins.json");
        Method phase=MixinEnvironment.class.getDeclaredMethod("gotoPhase",MixinEnvironment.Phase.class);
        phase.setAccessible(true);phase.invoke(null,MixinEnvironment.Phase.DEFAULT);
        var transformer=(IMixinTransformer)MixinEnvironment.getCurrentEnvironment().getActiveTransformer();
        for(String target:List.of("fr.frinn.custommachinery.common.init.CustomMachineTile","fr.frinn.custommachinery.client.render.CustomMachineRenderer","net.minecraft.client.renderer.block.BlockRenderDispatcher","net.minecraft.client.renderer.blockentity.BlockEntityRenderDispatcher","net.caffeinemc.mods.sodium.client.render.chunk.compile.pipeline.BlockRenderer","net.caffeinemc.mods.sodium.neoforge.render.FluidRendererImpl")){
            byte[] original;
            try(var stream=MixinAudit.class.getResourceAsStream("/"+target.replace('.','/')+".class")){if(stream==null&&target.startsWith("net.caffeinemc")){System.out.println("SKIP optional Sodium class: "+target);continue;}original=stream.readAllBytes();}
            byte[] transformed=transformer.transformClassBytes(target,target,original);
            if(Arrays.equals(original,transformed))throw new AssertionError("Mixin not applied: "+target);
            var node=new ClassNode();new ClassReader(transformed).accept(node,0);
            Set<String> hooks=new HashSet<>();
            for(var method:node.methods)for(var insn:method.instructions)if(insn instanceof MethodInsnNode call&&(call.name.contains("matrix$")||call.name.contains("poc$")))hooks.add(method.name);
            if(target.endsWith("CustomMachineTile")){
                if(!hooks.containsAll(Set.of("serverTick","clientTick","getUpdateTag","loadAdditional")))throw new AssertionError(hooks);
                if(!node.interfaces.contains("creation/matrix/MatrixAccess"))throw new AssertionError("Missing state interface");
            }else if(target.endsWith("CustomMachineRenderer")){
                if(!hooks.contains("render"))throw new AssertionError("Missing render injection");
                if(node.methods.stream().noneMatch(m->m.name.equals("getRenderBoundingBox")&&m.desc.contains("CustomMachineTile")))throw new AssertionError("Missing multiblock culling bounds");
            }else if(target.endsWith("BlockRenderDispatcher")){if(!hooks.containsAll(Set.of("renderBatched","renderLiquid")))throw new AssertionError(hooks);}
            else if(target.endsWith("BlockEntityRenderDispatcher")){if(!hooks.contains("render"))throw new AssertionError(hooks);}
            else if(hooks.isEmpty())throw new AssertionError("Missing Sodium masking hook: "+target);
            Path out=Path.of(args[0],target.replace('.','/')+".class");Files.createDirectories(out.getParent());Files.write(out,transformed);
            System.out.println("PASS real Mixin transform: "+target+"; hooks="+hooks);
        }
    }
}
