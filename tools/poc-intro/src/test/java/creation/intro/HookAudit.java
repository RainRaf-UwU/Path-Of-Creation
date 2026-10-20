package creation.intro;

import java.io.*;
import java.util.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;

/** Checks the installed Minecraft bytecode targeted by the mod; does not transform/run Minecraft. */
public final class HookAudit {
    static ClassNode read(String name)throws IOException{
        try(var in=HookAudit.class.getResourceAsStream("/"+name+".class")){
            if(in==null)throw new FileNotFoundException(name);ClassNode node=new ClassNode();new ClassReader(in).accept(node,0);return node;
        }
    }
    static void method(ClassNode c,String name,String descriptor){
        if(c.methods.stream().noneMatch(m->m.name.equals(name)&&m.desc.equals(descriptor)))throw new AssertionError(c.name+"."+name+descriptor);
    }
    public static void main(String[] ignored)throws Exception{
        ClassNode flows=read("net/minecraft/client/gui/screens/worldselection/WorldOpenFlows");
        String target="(Lnet/minecraft/world/level/storage/LevelStorageSource$LevelStorageAccess;Lnet/minecraft/server/packs/repository/PackRepository;Lnet/minecraft/server/WorldStem;Z)V";
        for(String name:List.of("createFreshLevel","createLevelFromExistingSettings")){
            int calls=0;for(MethodNode m:flows.methods)if(m.name.equals(name))for(var i:m.instructions)
                if(i instanceof MethodInsnNode call&&call.owner.equals("net/minecraft/client/Minecraft")&&call.name.equals("doWorldLoad")&&call.desc.equals(target))calls++;
            if(calls!=1)throw new AssertionError("Creation call site "+name+": "+calls);
        }
        method(read("net/minecraft/client/Minecraft"),"doWorldLoad",target);
        ClassNode camera=read("net/minecraft/client/Camera");
        method(camera,"setup","(Lnet/minecraft/world/level/BlockGetter;Lnet/minecraft/world/entity/Entity;ZZF)V");
        method(camera,"setPosition","(DDD)V");method(camera,"setRotation","(FF)V");
        method(read("net/minecraft/client/gui/screens/inventory/InventoryScreen"),"renderEntityInInventoryFollowsAngle",
            "(Lnet/minecraft/client/gui/GuiGraphics;IIIIIFFFLnet/minecraft/world/entity/LivingEntity;)V");
        System.out.println("PASS installed bytecode: both new-world call sites, camera injection/shadows and real-skin portrait renderer signatures");
    }
}
