import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.jar.*;
import org.objectweb.asm.*;

/** Apply only FancyMenu's published access rules in an isolated validation directory. */
public class PrepareNativeAccess {
    record Rule(boolean removeFinal, String member) {}
    static int widen(int access,boolean removeFinal) {
        return (access & ~(Opcodes.ACC_PRIVATE|Opcodes.ACC_PROTECTED|(removeFinal?Opcodes.ACC_FINAL:0)))|Opcodes.ACC_PUBLIC;
    }
    public static void main(String[] args) throws Exception {
        Map<String,List<Rule>> rules=new HashMap<>();
        Set<String> names=new HashSet<>();
        try(JarFile jar=new JarFile(args[0])) {
            String cfg=new String(jar.getInputStream(jar.getJarEntry("META-INF/accesstransformer.cfg")).readAllBytes());
            for(String line:cfg.split("\\R")) {
                String s=line.split("#",2)[0].trim();if(s.isEmpty())continue;
                String[] a=s.split("\\s+");String cls=a[1].replace('.','/');
                rules.computeIfAbsent(cls,k->new ArrayList<>()).add(new Rule(a[0].equals("public-f"),a.length==3?a[2]:null));
                names.add(cls);if(cls.contains("$"))names.add(cls.substring(0,cls.indexOf('$')));
            }
        }
        for(String cls:names) {
            byte[] bytes=PrepareNativeAccess.class.getClassLoader().getResourceAsStream(cls+".class").readAllBytes();
            ClassWriter writer=new ClassWriter(0);
            new ClassReader(bytes).accept(new ClassVisitor(Opcodes.ASM9,writer) {
                public void visit(int v,int a,String n,String s,String sup,String[] ifs) {
                    for(Rule r:rules.getOrDefault(cls,List.of()))if(r.member==null)a=widen(a,r.removeFinal);
                    super.visit(v,a,n,s,sup,ifs);
                }
                public FieldVisitor visitField(int a,String n,String desc,String sig,Object value) {
                    for(Rule r:rules.getOrDefault(cls,List.of()))if(n.equals(r.member))a=widen(a,r.removeFinal);
                    return super.visitField(a,n,desc,sig,value);
                }
                public MethodVisitor visitMethod(int a,String n,String desc,String sig,String[] ex) {
                    for(Rule r:rules.getOrDefault(cls,List.of()))if((n+desc).equals(r.member))a=widen(a,r.removeFinal);
                    return super.visitMethod(a,n,desc,sig,ex);
                }
                public void visitInnerClass(String n,String outer,String inner,int a) {
                    for(Rule r:rules.getOrDefault(n,List.of()))if(r.member==null)a=widen(a,r.removeFinal);
                    super.visitInnerClass(n,outer,inner,a);
                }
            },0);
            Path p=Path.of(args[1],cls+".class");Files.createDirectories(p.getParent());Files.write(p,writer.toByteArray());
        }
        System.out.println("Applied installed FancyMenu access rules to "+names.size()+" validation-only classes. Game JARs untouched.");
    }
}
