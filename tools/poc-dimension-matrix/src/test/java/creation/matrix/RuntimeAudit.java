package creation.matrix;

import java.io.*;
import java.util.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import net.minecraft.core.BlockPos;

public final class RuntimeAudit {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    private static ClassNode read(String name)throws Exception{
        var node=new ClassNode();try(var input=RuntimeAudit.class.getResourceAsStream("/"+name.replace('.','/')+".class")){new ClassReader(input).accept(node,0);}return node;
    }
    public static void main(String[] args)throws Exception{
        var damage=read("creation.matrix.MatrixHazards").methods.stream().filter(m->m.name.equals("damage")).findFirst().orElseThrow();
        Set<String> calls=new HashSet<>();for(var insn:damage.instructions)if(insn instanceof MethodInsnNode call)calls.add(call.name);
        check(calls.containsAll(List.of("setHealth","recordDamage","broadcastDamageEvent","die")));
        check(!calls.contains("hurt")&&!calls.contains("getArmorValue")&&!calls.contains("getAbsorptionAmount")&&!calls.contains("isCreative"));
        var bounds=MatrixThermals.interior(new BlockPos(5,5,5));
        check(bounds.minX==1&&bounds.minY==1&&bounds.minZ==1&&bounds.maxX==10&&bounds.maxY==10&&bounds.maxZ==10);
        check(!bounds.contains(.9,5,5)&&bounds.contains(1.1,5,5));
        var shader=read("creation.matrix.jei.GuiBlueprintRenderType");Set<String> fields=new HashSet<>(),handles=new HashSet<>();
        for(var method:shader.methods)for(var insn:method.instructions){
            if(insn instanceof FieldInsnNode field)fields.add(field.name);
            if(insn instanceof InvokeDynamicInsnNode dynamic)for(Object arg:dynamic.bsmArgs)if(arg instanceof Handle handle)handles.add(handle.getName());
        }
        check(fields.containsAll(List.of("POSITION_TEX_COLOR","NO_DEPTH_TEST","NO_CULL","LOCATION_BLOCKS"))&&handles.contains("getPositionTexColorShader"));
        for(String name:List.of("MatrixMod","MatrixSoundBridge","MatrixState","MatrixThermals","MatrixMeltdown","MatrixHazards")){
            try(var input=RuntimeAudit.class.getResourceAsStream("/creation/matrix/"+name+".class")){check(!new String(input.readAllBytes(),java.nio.charset.StandardCharsets.ISO_8859_1).contains("net/minecraft/client/"));}
        }
        System.out.println("PASS runtime audit: direct health damage including Creative / no armor, absorption or effect path / exact interior bounds / GUI atlas shader with depth and culling disabled / server-safe common classes");
    }
}
