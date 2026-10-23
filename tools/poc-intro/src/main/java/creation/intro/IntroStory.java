package creation.intro;

import com.google.gson.Gson;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public final class IntroStory {
    public record Choice(String text, String next) {
        public String text(boolean chinese) { return IntroTranslations.text(text, chinese); }
    }
    public record Node(String id, String speaker, String text, String next, List<Choice> choices) {
        public String text(boolean chinese) { return IntroTranslations.text(text, chinese); }
        public List<Choice> options() { return choices == null ? List.of() : choices; }
    }
    public String first;
    public List<Node> nodes;
    public Map<String, String> labels;
    public Node node(String id) {
        return nodes.stream().filter(n -> n.id().equals(id)).findFirst().orElseThrow();
    }
    public String label(String key, boolean chinese) { return IntroTranslations.text(labels.get(key), chinese); }
    public static IntroStory load() {
        return load("story.json");
    }
    public static IntroStory load(String resource) {
        try (var input = IntroStory.class.getResourceAsStream("/assets/poc_intro/" + resource)) {
            if (input == null) throw new IOException("Missing intro story");
            return parse(new String(input.readAllBytes(), StandardCharsets.UTF_8));
        } catch (IOException failure) { throw new UncheckedIOException(failure); }
    }
    public static IntroStory parse(String json) {
        if(json.length()>32767)throw new IllegalArgumentException("Story exceeds 32767 characters");
        IntroStory story=new Gson().fromJson(json.startsWith("\ufeff")?json.substring(1):json,IntroStory.class);
        if(story==null||story.nodes==null||story.nodes.isEmpty()||story.nodes.size()>128)throw new IllegalArgumentException("Missing/oversized story nodes");
        Map<String,Node> indexed=new HashMap<>();
        for(Node n:story.nodes){
            if(n==null||n.id()==null||n.id().isBlank()||"end".equals(n.id())||indexed.put(n.id(),n)!=null)throw new IllegalArgumentException("Invalid/duplicate node id");
            if(!List.of("self","system").contains(n.speaker()==null?"":n.speaker())||!translationKey(n.text())||n.options().size()>2)throw new IllegalArgumentException("Invalid speaker, translation key or choices: "+n.id());
            for(Choice c:n.options())if(c==null||!translationKey(c.text()))throw new IllegalArgumentException("Missing choice translation key: "+n.id());
        }
        visit(story.first,indexed,new HashSet<>(),new HashSet<>());
        // Check unused nodes too, so an edit cannot hide a broken branch or a loop.
        for(Node n:story.nodes)visit(n.id(),indexed,new HashSet<>(),new HashSet<>());
        for(String key:List.of("self","system","prologue","continue","typing","choose","choiceTyping","release","releaseSub","flight"))
            if(story.labels==null||!translationKey(story.labels.get(key)))throw new IllegalArgumentException("Missing label translation key: "+key);
        return story;
    }
    private static boolean translationKey(String text){return text!=null&&text.matches("[A-Za-z0-9_.-]+");}
    private static void visit(String id,Map<String,Node> nodes,Set<String> active,Set<String> done){
        if("end".equals(id)||done.contains(id))return;
        Node n=nodes.get(id);
        if(n==null||!active.add(id))throw new IllegalArgumentException("Missing destination or story cycle: "+id);
        if(n.options().isEmpty())visit(n.next(),nodes,active,done);
        else for(Choice c:n.options())visit(c.next(),nodes,active,done);
        active.remove(id);done.add(id);
    }
}
