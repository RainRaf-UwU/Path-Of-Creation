import java.nio.file.*;
import java.util.*;
import de.keksuccino.fancymenu.util.properties.*;
import de.keksuccino.fancymenu.customization.element.*;
import de.keksuccino.fancymenu.customization.element.elements.progressbar.*;
import de.keksuccino.fancymenu.customization.element.elements.button.vanillawidget.*;
import de.keksuccino.fancymenu.customization.element.elements.text.v2.*;
import de.keksuccino.fancymenu.customization.placeholder.DeserializedPlaceholderString;

/** Native file/schema round-trip; no Minecraft client is launched. */
public class NativeScreenCheck {
    static SerializedElement serialized(PropertyContainer c) {
        SerializedElement s = new SerializedElement();
        s.setType(c.getValue("element_type"));
        c.getProperties().forEach(s::putProperty);
        return s;
    }
    public static void main(String[] args) throws Exception {
        DeserializedPlaceholderString p = new DeserializedPlaceholderString();
        p.placeholderIdentifier="world_load_progress";
        p.values=new HashMap<>();
        String placeholder=p.toString();
        System.out.println("Native progress placeholder: " + placeholder);
        for (String file : args) {
            PropertyContainerSet set = PropertiesParser.deserializeSetFromStream(Files.newInputStream(Path.of(file)));
            if ("customizablemenus".equals(set.getType())) {
                for (String cls : List.of("TitleScreen", "LevelLoadingScreen", "ProgressScreen", "ReceivingLevelScreen", "GenericMessageScreen"))
                    if (set.getFirstContainerOfType("net.minecraft.client.gui.screens."+cls)==null) throw new IllegalStateException(cls);
                if (set.getFirstContainerOfType("net.minecraft.client.gui.screens.worldselection.SelectWorldScreen")==null) throw new IllegalStateException("SelectWorldScreen");
                continue;
            }
            PropertyContainer meta=set.getFirstContainerOfType("layout-meta");
            String sid=meta.getValue("identifier");
            if (!"false".equals(meta.getValue("render_custom_elements_behind_vanilla"))) throw new IllegalStateException("Loading layer must be in front");
            Set<String> ids=new HashSet<>(); int progress=0, scans=0, hidden=0;
            for (PropertyContainer c:set.getContainersOfType("vanilla_button")) {
                // is_hidden=true and the widget IDs were verified against the installed
                // VanillaWidgetElementBuilder and screen mixins; no client widgets created.
                if (!"true".equals(c.getValue("is_hidden"))) throw new IllegalStateException("Native widget not hidden");
                hidden++;
            }
            for (PropertyContainer c:set.getContainersOfType("element")) {
                if (!ids.add(c.getValue("instance_identifier"))) throw new IllegalStateException("Duplicate element id");
                String type=c.getValue("element_type");
                if ("progress_bar".equals(type)) {
                    ProgressBarElementBuilder b=new ProgressBarElementBuilder();
                    ProgressBarElement e=b.deserializeElementInternal(serialized(c));
                    SerializedElement round=b.serializeElementInternal(e);
                    if (!c.getValue("progress_source").equals(round.getValue("progress_source"))) throw new IllegalStateException("Progress source lost: "+round.getValue("progress_source"));
                    if (e.direction!=ProgressBarElement.BarDirection.RIGHT || e.progressValueMode!=ProgressBarElement.ProgressValueMode.PERCENTAGE) throw new IllegalStateException("Progress direction/mode");
                    if(e.barTextureSupplier==null || e.backgroundTextureSupplier==null) throw new IllegalStateException("Missing progress skin");
                    progress++;
                } else if ("text_v2".equals(type)) {
                    // TextElement requires a running client's font. Validate the native
                    // enum and parsed source without constructing its MarkdownRenderer.
                    if (!(placeholder+"%").equals(c.getValue("source"))) throw new IllegalStateException("Percentage source");
                    if(TextElement.SourceMode.getByName(c.getValue("source_mode"))!=TextElement.SourceMode.DIRECT)
                        throw new IllegalStateException("Percentage source mode");
                } else if ("image".equals(type)) {
                    String source=c.getValue("source");
                    if(source.endsWith(".gif")) scans++;
                    Path asset=Path.of("design/screen-polish-2026-10-08/assets").resolve(source.substring(source.lastIndexOf('/')+1));
                    if(!Files.isRegularFile(asset)) throw new IllegalStateException("Missing image: "+asset);
                } else throw new IllegalStateException("Unknown element: "+type);
            }
            boolean real=sid.equals("level_loading_screen") || sid.equals("progress_screen");
            if (hidden==0 || progress!=(real?1:0) || scans!=(real?0:1)) throw new IllegalStateException("Incorrect stage configuration");
            System.out.println("Native round-trip: "+sid+", "+ids.size()+" elements, "+hidden+" native widgets hidden, real progress="+real);
        }
        System.out.println("Native schemas and progress binding passed; this is not live rendering.");
    }
}
