package creation.intro;

import com.google.gson.Gson;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public final class IntroStory {
    public record Choice(String zh, String en, String next) {
        public String text(boolean chinese) { return chinese ? zh : en; }
    }
    public record Node(String id, String speaker, String zh, String en, String next, List<Choice> choices) {
        public String text(boolean chinese) { return chinese ? zh : en; }
        public List<Choice> options() { return choices == null ? List.of() : choices; }
    }
    public String first;
    public List<Node> nodes;
    public Map<String, Map<String, String>> labels;
    public Node node(String id) {
        return nodes.stream().filter(n -> n.id().equals(id)).findFirst().orElseThrow();
    }
    public String label(String key, boolean chinese) { return labels.get(chinese ? "zh" : "en").get(key); }
    public static IntroStory load() {
        try (var input = IntroStory.class.getResourceAsStream("/assets/poc_intro/story.json")) {
            if (input == null) throw new IOException("Missing intro story");
            return new Gson().fromJson(new InputStreamReader(input, StandardCharsets.UTF_8), IntroStory.class);
        } catch (IOException failure) { throw new UncheckedIOException(failure); }
    }
}
