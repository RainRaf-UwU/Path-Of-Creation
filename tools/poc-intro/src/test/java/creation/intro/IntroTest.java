package creation.intro;

import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/** Behavioural regressions that do not launch Minecraft or touch any user save. */
public final class IntroTest {
    static int checks;
    static void check(boolean condition,String why){checks++;if(!condition)throw new AssertionError(why);}
    static final IntroUi.Canvas METRICS=new IntroUi.Canvas(){
        public void rect(int x,int y,int w,int h,int color){}
        public void line(double x,double y,double a,double b,int color){}
        public void text(String s,int x,int y,int color){}
        public void portrait(IntroUi.Box b,boolean p){}
        public int width(String s){return s.codePoints().map(c->c>255?9:6).sum();}
    };
    public static void main(String[] ignored)throws Exception{
        gate();story();playback();timeline();layouts();portrait();eyelids();
        System.out.println("PASS "+checks+" assertions: fresh-world gate, narrative, glyph sounds, flat eyelids, portrait framing, camera and 160 language/layout cases.");
    }
    static void gate()throws Exception{
        Path root=Files.createTempDirectory("poc-intro-gate-");
        var gate=new FreshWorldGate();Object born=new Object();
        check(!gate.consume(root,born),"An unmarked old world must never play");
        Files.writeString(root.resolve("session.lock"),"");Files.createDirectory(root.resolve("datapacks"));
        check(gate.arm(root,born),"New creation can contain lock/datapacks");
        check(!gate.consume(root,new Object()),"Failed creation permission cannot be used by a reloaded WorldData");
        check(!gate.consume(root,born),"Mismatched server revokes stale permission");
        check(gate.arm(root,born)&&gate.consume(root,born),"The same fresh creation can play once");
        check(!gate.consume(root,born),"Cannot replay on reconnect");
        for(String name:List.of("level.dat","level.dat_old","region","playerdata","DIM-1","DIM1")){
            Path existing=Files.createDirectory(root.resolve(name.replace('.','_')+"-case"));
            Files.writeString(existing.resolve(name),"old");
            check(!gate.arm(existing,new Object()),"Existing save component must block: "+name);
        }
        check(!gate.arm(root.resolve("missing"),born),"Inaccessible/missing root fails closed");
        check(!gate.arm(root,null),"No WorldData identity fails closed");
    }
    static void story(){
        IntroStory s=IntroStory.load();Set<String> ids=new HashSet<>();
        for(var n:s.nodes){check(ids.add(n.id()),"Duplicate node");check(!n.text(true).isBlank()&&!n.text(false).isBlank(),"Both languages required");check(n.options().size()<=2,"Choice count");}
        walk(s,s.first,new HashSet<>());
        for(var n:s.nodes){
            for(String chapter:List.of("无中生有","苦尽甘来","虚空初光","创世之径","创造模式","登神长阶")){
                check(!n.text(true).contains(chapter),"Dialogue must not name quest chapters");
                for(var option:n.options())check(!option.text(true).contains(chapter),"Choices must not name quest chapters");
            }
            if(n.next()!=null)check(n.next().equals("end")||ids.contains(n.next()),"Next node exists");
            for(var c:n.options())check(ids.contains(c.next())&&!c.text(true).isBlank()&&!c.text(false).isBlank(),"Choice destination exists");
        }
        check(s.nodes.stream().filter(n->!n.options().isEmpty()).count()==2,"Two player decisions");
        check(s.nodes.stream().anyMatch(n->n.text(true).contains("神龙反应堆")),"Required reactor story");
        check(s.nodes.stream().anyMatch(n->n.text(true).contains("最基本的飞行")),"Required sealed-flight story");
    }
    static void walk(IntroStory s,String id,Set<String> ancestors){
        if(id.equals("end"))return;
        check(ancestors.add(id),"Story must terminate");var n=s.node(id);
        if(n.options().isEmpty())walk(s,n.next(),new HashSet<>(ancestors));
        else for(var c:n.options())walk(s,c.next(),new HashSet<>(ancestors));
    }
    static void playback(){
        AtomicInteger glyphs=new AtomicInteger();var p=new IntroPlayback(IntroStory.load(),true,glyphs::incrementAndGet);
        p.tick(.1,true);check(p.age==0,"No playing before server handshake");p.begun=true;p.age=15;
        p.tick(.1,false);check(p.shown==0,"Unfocused text pauses");p.advance(1);
        for(int i=0;i<100;i++)p.tick(.1,true);
        check(p.shown==p.length()&&glyphs.get()==p.length(),"One sound per visible code point");
        p.page=0;p.advance(2);check(p.page==1&&p.node.id().equals("wake"),"Page advance cannot skip dialogue");
        p.go("identity");p.shown=p.length();p.choose(0,1);check(p.node.id().equals("identity"),"Choices disabled until their letters are revealed");
        int before=glyphs.get();for(int i=0;i<100;i++)p.tick(.1,true);
        check(glyphs.get()-before==p.choiceLength(),"Choice letters also each produce sound");
        p.choose(1,1);check(p.node.id().equals("ruins"),"Second choice branch");
        p.go("dawn");p.shown=p.length();p.advance(1);check(p.release==0,"Last line starts release");
        p.tick(.1,false);check(p.release==0,"Release pauses on lost focus");p.tick(.1,true);check(p.release>.09,"Release resumes");
    }
    static void timeline(){
        check(IntroTimeline.openness(0)==0,"Starts fully black");
        check(IntroTimeline.openness(2.9)>IntroTimeline.openness(3.5),"First blink closes");
        check(IntroTimeline.openness(5.1)>IntroTimeline.openness(5.5),"Second blink closes");
        check(IntroTimeline.openness(7)==1,"Fully awake");
        check(IntroTimeline.yaw(9)<-45&&IntroTimeline.yaw(11.6)>45,"Looks left then right");
        check(Math.abs(IntroTimeline.yaw(15))<.001,"Returns to system");
        check(Math.abs(IntroTimeline.seatHeight(0)-.72)<.001&&Math.abs(IntroTimeline.seatHeight(1.6)-1.62)<.001,"Seated then standing eye height");
        check(IntroTimeline.thirdPerson(7)==0&&IntroTimeline.thirdPerson(9)==1,"Eye opening stays first person, then transitions");
        var first=IntroTimeline.camera(4.7,-1,180);check(first.x()==0&&first.z()==0,"First-person eye opening has no orbit offset");
        var third=IntroTimeline.camera(15,-1,180);
        check(Math.abs(third.x()-3.6)<.001&&Math.abs(third.z()+4.4)<.001,"Front three-quarter camera offset");
        double distance=Math.hypot(third.x(),third.z()),yaw=Math.toRadians(third.yaw()),pitch=Math.toRadians(third.pitch());
        check(Math.abs(-Math.sin(yaw)*distance+third.x())<.001&&Math.abs(Math.cos(yaw)*distance+third.z())<.001,"Camera looks toward seated player");
        check(Math.abs(third.y()-Math.tan(pitch)*distance-.30)<.001,"Camera targets the seated upper body");
        for(double age=6.99;age<9.02;age+=.02){
            var a=IntroTimeline.camera(age,-1,180);var b=IntroTimeline.camera(age+.001,-1,180);
            check(Double.isFinite(a.x()+a.y()+a.z()+a.yaw()+a.pitch())&&Math.abs(b.x()-a.x())<.01&&Math.abs(b.yaw()-a.yaw())<1,"Smooth finite first-to-third-person transition");
        }
    }
    static void portrait(){
        for(int width:new int[]{64,85,128})for(float height:new float[]{1.8f,.6f,2.4f}){
            var box=new IntroUi.Box(12,12,width,width*3/2);var frame=PortraitFraming.fit(box,height);
            for(double modelY:new double[]{1.95,1.875,1.4,.7})check(frame.screenY(modelY)>=box.y()&&frame.screenY(modelY)<=box.y()+box.h(),"Head, shoulders and waist stay in the native scissor");
            double oldHead=box.y()+box.h()*.5+box.h()*.85*(height*.5-.34-1.875);
            if(height==1.8f)check(oldHead<box.y(),"Regression reproduces original clipped head");
        }
    }
    static void eyelids(){
        for(double age:new double[]{0,1.7,2.9,3.5,4.7,5.4,6.7}){
            var masks=new ArrayList<int[]>();var canvas=new IntroUi.Canvas(){
                public void rect(int x,int y,int w,int h,int c){if(c==0xff000000)masks.add(new int[]{x,y,w,h});}
                public void line(double x,double y,double a,double b,int c){}
                public void text(String s,int x,int y,int c){}
                public void portrait(IntroUi.Box b,boolean p){}
                public int width(String s){return METRICS.width(s);}
            };
            var p=new IntroPlayback(IntroStory.load(),true,()->{});p.begun=true;p.age=age;IntroUi.draw(canvas,640,360,p,-1,-1);
            check(masks.size()==2,"Exactly two flat eyelids, with no curved strips");
            check(masks.stream().allMatch(r->r[0]==0&&r[2]==640),"Both eyelids span the entire width");
            int[] top=masks.get(0),bottom=masks.get(1);
            check(top[1]==0&&bottom[1]+bottom[3]==360,"Eyelids anchor to opposite edges");
            check(bottom[1]-top[3]==Math.round(IntroTimeline.openness(age)*360),"Horizontal opening matches the timeline");
        }
    }
    static void layouts(){
        IntroStory s=IntroStory.load();
        for(boolean chinese:new boolean[]{true,false})for(int[] size:new int[][]{{320,180},{426,240},{640,360},{854,360},{960,540}})for(var n:s.nodes){
            var p=new IntroPlayback(s,chinese,()->{});p.begun=true;p.age=22;p.node=n;p.shown=p.length();p.choiceShown=p.choiceLength();
            IntroUi.Layout initial=IntroUi.layout(METRICS,size[0],size[1],p);p.page=initial.pageCount()-1;
            var l=IntroUi.draw(METRICS,size[0],size[1],p,-1,-1);
            check(l.panel().x()>l.portrait().x()+l.portrait().w(),"Portrait never covers text");
            check(l.panel().y()>=0&&l.panel().y()+l.panel().h()<=size[1]-12,"Dialogue within safe area");
            check(l.portrait().y()>=0,"Portrait within screen");
            for(String line:l.lines())check(METRICS.width(line)<=l.panel().w()-32,"Body never overflows");
            for(var b:l.choices())check(b.y()>=0&&b.y()+b.h()<l.panel().y(),"Choices above dialogue without clipping");
        }
    }
}
