package creation.intro;

/** No game dependencies: the client and the inspectable preview run the same story machine. */
public final class IntroPlayback {
    public final IntroStory story;
    public final boolean chinese;
    public IntroStory.Node node;
    public double age, release = -1;
    public int shown, choiceShown, selected, page;
    public boolean begun, fast;
    private double accumulator;
    private final Runnable glyphSound;
    public IntroPlayback(IntroStory story, boolean chinese, Runnable glyphSound) {
        this.story = story; this.chinese = chinese; this.glyphSound = glyphSound;
        node = story.node(story.first);
    }
    public String text() { return node.text(chinese); }
    public int length() { return text().codePointCount(0, text().length()); }
    public String visible() { String s = text(); return s.substring(0, s.offsetByCodePoints(0, Math.min(shown, length()))); }
    public int choiceLength() { return node.options().stream().mapToInt(c -> c.text(chinese).codePointCount(0,c.text(chinese).length())).sum(); }
    public boolean choicesReady() { return shown == length() && choiceShown == choiceLength(); }
    public void tick(double seconds, boolean focused) {
        if (!focused) return;
        // Never jump through a blink or emit a burst of sounds after a slow/stalled frame.
        seconds = Math.clamp(seconds, 0, .1);
        if (release >= 0) { release += seconds; return; }
        if (!begun) return;
        age += seconds;
        if (age < 15) return;
        accumulator += seconds;
        double interval = shown < length() ? (fast ? .016 : .055) : .035;
        while (accumulator >= interval) {
            accumulator -= interval;
            if (shown < length()) { shown++; glyphSound.run(); }
            else if (choiceShown < choiceLength()) { choiceShown++; glyphSound.run(); }
            else { accumulator = 0; break; }
        }
    }
    public void advance(int pageCount) {
        if (age < 15 || release >= 0) return;
        if (shown < length()) { fast = true; return; }
        if (page + 1 < pageCount) { page++; return; }
        if (!node.options().isEmpty()) return;
        go(node.next());
    }
    public void choose(int index, int pageCount) {
        if (age < 15 || release >= 0 || !choicesReady() || page + 1 < pageCount || index < 0 || index >= node.options().size()) return;
        go(node.options().get(index).next());
    }
    public void go(String next) {
        if ("end".equals(next)) { release = 0; return; }
        node = story.node(next); shown = choiceShown = selected = page = 0; accumulator = 0; fast = false;
    }
}
