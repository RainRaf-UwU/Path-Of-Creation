import java.nio.file.*;
import java.util.*;
import de.keksuccino.fancymenu.util.properties.*;

/** Uses the installed FancyMenu parser without bootstrapping a game. */
public class FancyLayoutCheck {
    public static void main(String[] args) throws Exception {
        int elements = 0;
        for (String arg : args) {
            PropertyContainerSet set = PropertiesParser.deserializeSetFromStream(Files.newInputStream(Path.of(arg)));
            if ("customizablemenus".equals(set.getType())) {
                if (set.getFirstContainerOfType("net.minecraft.client.gui.screens.worldselection.SelectWorldScreen") == null)
                    throw new IllegalStateException("World selection customization not enabled");
                if (set.getFirstContainerOfType("net.minecraft.client.gui.screens.TitleScreen") == null)
                    throw new IllegalStateException("Title screen customization was removed");
                System.out.println("Native FancyMenu parser: world selection and title screen enabled.");
                continue;
            }
            if (!"fancymenu_layout".equals(set.getType())) throw new IllegalStateException("Wrong layout type");
            PropertyContainer meta = set.getFirstContainerOfType("layout-meta");
            if (meta == null || meta.getValue("identifier") == null) throw new IllegalStateException("Missing screen id");
            if (!"true".equals(meta.getValue("render_custom_elements_behind_vanilla")))
                throw new IllegalStateException("Decoration must render behind native widgets");
            Set<String> ids = new HashSet<>();
            for (PropertyContainer element : set.getContainersOfType("element")) {
                String id = element.getValue("instance_identifier");
                if (id == null || !ids.add(id)) throw new IllegalStateException("Duplicate/missing element id");
                if ("image".equals(element.getValue("element_type"))) {
                    String source = element.getValue("source");
                    if (source == null || !source.startsWith("[source:local]/")) throw new IllegalStateException("Invalid image source");
                    String relative = source.substring("[source:local]/".length());
                    Path live = Path.of(relative);
                    if (relative.contains("/poc-polish/")) {
                        live = Path.of("design/ui-polish-2026-10-08/menu-assets").resolve(live.getFileName());
                    }
                    if (!Files.isRegularFile(live)) throw new IllegalStateException("Image not found: " + live);
                }
                elements++;
            }
            System.out.println("Native FancyMenu parser: " + meta.getValue("identifier") + ", " + set.getContainers().size() + " containers, element sources and ids valid.");
        }
        System.out.println("Checked " + elements + " custom elements; this is file parsing, not live rendering.");
    }
}
