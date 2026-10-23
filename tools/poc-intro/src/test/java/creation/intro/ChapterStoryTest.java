package creation.intro;

import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.*;
import com.google.gson.*;

/** Exercise the production JSON loader, playback/layout, and shared world-freeze lease offline. */
public final class ChapterStoryTest {
    static int checks;
    static void check(boolean value,String reason){checks++;if(!value)throw new AssertionError(reason);}
    static void rejects(String json){try{IntroStory.parse(json);throw new AssertionError("Invalid story accepted");}catch(IllegalArgumentException expected){checks++;}}
    static String changed(String json,String field,String value){
        var root=JsonParser.parseString(json).getAsJsonObject();
        if(field.equals("first"))root.addProperty(field,value);
        else root.getAsJsonArray("nodes").get(0).getAsJsonObject().addProperty(field,value);
        return root.toString();
    }
    public static void main(String[] ignored)throws Exception{
        Path file=Files.createTempDirectory("poc-chapter-json-").resolve("config/chapter1.json");
        String json=ChapterOneStory.read(file);IntroStory story=IntroStory.parse(json);
        String dialogue=story.nodes.stream().map(n->n.text(true)).reduce("",String::concat);
        check(dialogue.contains("九乘九")&&dialogue.contains("很长一段时间")&&dialogue.contains("嬗变流体")&&dialogue.contains("一张就会变成两张"),"Required exchange, regret and comfort remain in translated dialogue");
        check(json.chars().allMatch(c->c<128)&&!json.contains("\"zh\"")&&!json.contains("\"en\""),"Graph contains keys, not embedded language text");
        check(story.node("complaint").speaker().equals("self")&&story.node("comfort").speaker().equals("system"),"Regret belongs to protagonist; ECHO consoles them");
        check(story.node("exchange").next().equals("complaint")&&story.node("complaint").next().equals("comfort"),"Exchange, regret and comfort are an unskippable narrative sequence");
        String edited=changed(json,"text","poc_intro.story.chapter1.echo");Files.writeString(file,edited);
        check(ChapterOneStory.read(file).equals(edited)&&IntroStory.parse(edited).node("crafted").text(true).equals(story.node("echo").text(true)),"Editing a graph translation key changes the next performance");
        rejects(changed(json,"first","missing"));
        rejects(changed(json,"next","crafted"));
        rejects(changed(json,"id","echo"));
        rejects(changed(json,"speaker","unknown"));
        rejects(changed(json,"text","这里不再允许直接写正文"));
        rejects(" ".repeat(32768));
        translations();
        AtomicBoolean frozen=new AtomicBoolean(false);AtomicInteger writes=new AtomicInteger();
        SceneFreeze lease=new SceneFreeze(frozen::get,value->{frozen.set(value);writes.incrementAndGet();});
        UUID a=UUID.randomUUID(),b=UUID.randomUUID();
        lease.enter(a);check(frozen.get(),"Entering scene freezes the world");lease.enter(a);lease.enter(b);
        lease.leave(a);check(frozen.get(),"Other viewer keeps the world frozen");lease.leave(a);lease.leave(b);
        check(!frozen.get()&&writes.get()==2,"Last exit restores once, including duplicate callbacks");
        frozen.set(true);lease.enter(a);lease.leave(a);check(frozen.get(),"Pre-existing /tick freeze is preserved");
        frozen.set(false);lease.enter(a);lease.leave(a);check(!frozen.get(),"Abort/disconnect releases the same lease");
        for(boolean chinese:new boolean[]{true,false})for(int[] size:new int[][]{{320,180},{426,240},{640,360},{854,360},{960,540}})for(var node:story.nodes){
            IntroPlayback p=new IntroPlayback(story,chinese,()->{});p.begun=true;p.age=15;p.node=node;p.shown=p.length();p.choiceShown=p.choiceLength();
            var first=IntroUi.layout(IntroTest.METRICS,size[0],size[1],p);p.page=first.pageCount()-1;
            var layout=IntroUi.draw(IntroTest.METRICS,size[0],size[1],p,-1,-1);
            check(layout.portrait().y()>=0&&layout.panel().x()+layout.panel().w()<=size[0],"Reused dialogue fits screen");
            for(String line:layout.lines())check(IntroTest.METRICS.width(line)<=layout.panel().w()-32,"Bilingual body wraps");
            for(var choice:layout.choices())check(choice.y()>=0&&choice.y()+choice.h()<layout.panel().y(),"Branches fit above dialogue");
        }
        for(boolean chinese:new boolean[]{true,false})for(int choice:new int[]{0,1}){
            AtomicInteger glyphs=new AtomicInteger();IntroPlayback p=new IntroPlayback(story,chinese,glyphs::incrementAndGet);p.begun=true;p.age=15;
            Set<String> visited=new HashSet<>();
            while(p.release<0){check(visited.add(p.node.id()),"Branch terminates without revisiting a node");
                for(int i=0;!p.choicesReady()&&i<1000;i++)p.tick(.1,true);
                check(p.choicesReady(),"All dialogue/options can finish typing");
                if(p.node.options().isEmpty())p.advance(1);else p.choose(choice,1);
            }
            check(visited.containsAll(List.of("exchange","complaint","comfort","duplicate")),"Every branch plays exchange/regret/comfort/copy conversation");
            check(glyphs.get()>0,"Original per-character sound callbacks remain active");
        }
        System.out.println("PASS "+checks+" chapter story assertions: JSON editing/validation, narrative branches, bilingual layouts and shared world freeze");
    }
    static void translations(){
        for(IntroStory story:List.of(IntroStory.load(),IntroStory.load("chapter1.json"))){
            Set<String> keys=new HashSet<>(story.labels.values());
            for(var node:story.nodes){keys.add(node.text());for(var choice:node.options())keys.add(choice.text());}
            for(String key:keys)for(boolean chinese:new boolean[]{true,false})
                check(IntroTranslations.has(key,chinese)&&!IntroTranslations.text(key,chinese).equals(key),"Each story key has a real translation: "+key);
        }
        check(IntroTranslations.text("missing.story.key",true).equals("missing.story.key"),"Missing key fallback is deterministic");
        var story=IntroStory.load("chapter1.json");AtomicInteger glyphs=new AtomicInteger();
        var p=new IntroPlayback(story,false,glyphs::incrementAndGet,key->key.endsWith(".crafted")?"测试🌌":key.contains(".choice.")?"回应":key.endsWith("label.self")?"资源包角色名":"资源包文本");
        p.begun=true;p.age=15;for(int i=0;i<10;i++)p.tick(.1,true);
        check(p.text().equals("测试🌌")&&p.length()==3&&glyphs.get()==3,"Client resolver controls Unicode glyph length/sounds, not the key or boolean locale");
        check(p.label("self").equals("资源包角色名"),"Speaker labels use the same client resource resolver");
        p.go("question");for(int i=0;i<20;i++)p.tick(.1,true);
        check(p.choicesReady()&&p.choiceLength()==4&&p.choiceText(p.node.options().getFirst()).equals("回应"),"Choices also resolve before typing and pagination");
    }
}
