import java.nio.file.*;
import java.net.*;
import java.lang.reflect.*;
import java.util.*;
import net.minecraft.server.packs.*;
import net.minecraft.server.packs.repository.PackSource;
import net.minecraft.server.packs.resources.*;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.network.chat.Component;
import dev.latvian.mods.kubejs.script.data.KubeFileResourcePack;
import dev.ftb.mods.ftbquests.quest.theme.*;
import dev.ftb.mods.ftbquests.quest.theme.property.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import net.mehvahdjukaar.moonlight.core.misc.FilteredResManager;

public class UiOverridePriorityCheck {
    static PackLocationInfo info(String id) {
        return new PackLocationInfo(id,Component.literal(id),PackSource.DEFAULT,Optional.empty());
    }
    static PackResources zip(String id,Path path) {
        return new FilePackResources.FileResourcesSupplier(path).openPrimary(info(id));
    }
    @SuppressWarnings("unchecked")
    static List<PackResources> prioritize(Path jar,PackType type,List<PackResources> packs) throws Exception {
        try(URLClassLoader loader=new URLClassLoader(new URL[]{jar.toUri().toURL()},UiOverridePriorityCheck.class.getClassLoader())) {
            Class<?> clazz=Class.forName("org.hp.kubejs_lang_override.mixin.client.MultiPackResourceManagerMixin",true,loader);
            Method method=clazz.getDeclaredMethod("kubejsLangOverride$prioritizeKubeJsAssets",List.class,PackType.class,List.class);
            method.setAccessible(true);return (List<PackResources>)method.invoke(null,packs,type,packs);
        }
    }
    public static void main(String[] args) throws Exception {
        Path root=Path.of(args[0]),cache=root.resolve(".cache/ui-tech-20261008/no-zip-switch");
        String currentId=new KubeFileResourcePack(PackType.CLIENT_RESOURCES).packId();
        if(!currentId.equals("KubeJS File Resource Pack [assets]"))throw new IllegalStateException(currentId);
        boolean staged=args.length>5&&args[5].equals("staged");
        Path packRoot=root.resolve(staged?"design/ui-tech-2026-10-08":"kubejs");
        List<PackResources> packs=new ArrayList<>(List.of(zip("vanilla",Path.of(args[4])),
            new PathPackResources(info(currentId),packRoot),
            zip("mod/ftbquests",Path.of(args[1])),zip("mod/jei",Path.of(args[2])),zip("mod/extendedcrafting",Path.of(args[3]))));
        List<PackResources> initial=List.copyOf(packs);
        Path previous=cache.resolve("crash-fix-backup/e0327f63557efb67e72bb568f3a0a8a0f71e0a4e482c77a9738fb7265ecc5b59.jar");
        try(URLClassLoader loader=new URLClassLoader(new URL[]{previous.toUri().toURL()},UiOverridePriorityCheck.class.getClassLoader())) {
            Class<?> clazz=Class.forName("org.hp.kubejs_lang_override.mixin.client.MultiPackResourceManagerMixin",true,loader);
            Method method=clazz.getDeclaredMethod("kubejsLangOverride$prioritizeKubeJsAssets",PackType.class,List.class,CallbackInfo.class);
            method.setAccessible(true);
            try {method.invoke(null,PackType.CLIENT_RESOURCES,initial,new CallbackInfo("<init>",false));throw new IllegalStateException("Expected previous crash");}
            catch(InvocationTargetException e) {if(!(e.getCause() instanceof UnsupportedOperationException))throw e;}
        }
        Path fixed=cache.resolve("kubejs_lang_override-1.21.1-neoforge-1.0-poc.jar");
        List<List<PackResources>> inputs=List.of(packs,List.copyOf(packs),packs.stream().toList(),Collections.unmodifiableList(packs));
        List<PackResources> regular=new ArrayList<>(initial);regular.remove(1);
        for(List<PackResources> input:inputs) {
            List<PackResources> output=prioritize(fixed,PackType.CLIENT_RESOURCES,input);
            if(output==input || !output.getLast().packId().equals(currentId))throw new IllegalStateException("Wrong final pack");
            if(!input.equals(initial))throw new IllegalStateException("Caller-owned list changed");
            if(!output.subList(0,output.size()-1).equals(regular))throw new IllegalStateException("Other packs reordered");
            if(prioritize(fixed,PackType.SERVER_DATA,input)!=input)throw new IllegalStateException("Server data packs changed");
            try(MultiPackResourceManager server=new MultiPackResourceManager(PackType.SERVER_DATA,input)) {
                if(!server.listPacks().toList().equals(input))throw new IllegalStateException("Transformed constructor changed server order");
            }
        }
        List<PackResources> empty=List.of();
        if(prioritize(fixed,PackType.CLIENT_RESOURCES,empty)!=empty)throw new IllegalStateException("Empty list changed");
        List<PackResources> withoutKube=List.copyOf(regular);
        if(prioritize(fixed,PackType.CLIENT_RESOURCES,withoutKube)!=withoutKube)throw new IllegalStateException("Unrelated list changed");
        List<PackResources> duplicate=List.of(initial.get(1),initial.get(0),initial.get(1),initial.get(2));
        if(!prioritize(fixed,PackType.CLIENT_RESOURCES,duplicate).equals(List.of(initial.get(0),initial.get(2),initial.get(1),initial.get(1))))throw new IllegalStateException("Stable partition failed");
        int matched=0;Path assets=root.resolve("design/ui-tech-2026-10-08/assets");
        // Deliberately pass the original unsorted immutable list to the transformed constructor.
        try(MultiPackResourceManager manager=new MultiPackResourceManager(PackType.CLIENT_RESOURCES,initial)) {
            if(!initial.equals(packs))throw new IllegalStateException("Transformed constructor changed caller list");
            if(!manager.listPacks().toList().getLast().packId().equals(currentId))throw new IllegalStateException("Constructor Mixin did not prioritize KubeJS");
            // Moonlight owns no separate packs here; manager below closes the shared packs.
            FilteredResManager filtered=FilteredResManager.including(manager,PackType.CLIENT_RESOURCES,p->true);
            if(!filtered.listPacks().toList().equals(manager.listPacks().toList()))throw new IllegalStateException("Moonlight filtered pack order changed");
            Resource node=filtered.getResource(ResourceLocation.parse("ftbquests:textures/shapes/circle/background.png")).orElseThrow();
            if(!node.sourcePackId().equals(currentId))throw new IllegalStateException("Moonlight filter lost KubeJS priority");
            try(var files=Files.walk(assets)) {
                for(Path file:files.filter(Files::isRegularFile).toList()) {
                    String path=assets.relativize(file).toString().replace('\\','/');int slash=path.indexOf('/');
                    Resource resource=manager.getResource(ResourceLocation.fromNamespaceAndPath(path.substring(0,slash),path.substring(slash+1))).orElseThrow();
                    if(!resource.sourcePackId().equals(currentId))throw new IllegalStateException(path+" from "+resource.sourcePackId());
                    try(var input=resource.open()) {
                        if(!Arrays.equals(input.readAllBytes(),Files.readAllBytes(file)))throw new IllegalStateException("Wrong bytes: "+path);
                    }
                    matched++;
                }
            }
            Class<?> loader=Class.forName("dev.ftb.mods.ftbquests.quest.theme.ThemeLoader");
            Method sorter=loader.getDeclaredMethod("resourceSorter",Resource.class,Resource.class);sorter.setAccessible(true);
            Method parse=loader.getDeclaredMethod("parse",Map.class,List.class);parse.setAccessible(true);
            List<Resource> themes=new ArrayList<>(manager.getResourceStack(ResourceLocation.parse("ftbquests:ftb_quests_theme.txt")));
            themes.sort((a,b)-> {try{return (int)sorter.invoke(null,a,b);}catch(Exception e){throw new RuntimeException(e);}});
            Map<Object,SelectorProperties> parsed=new LinkedHashMap<>();
            for(Resource resource:themes)try(var reader=resource.openAsReader()){parse.invoke(null,parsed,reader.lines().toList());}
            Constructor<QuestTheme> ctor=QuestTheme.class.getDeclaredConstructor(Map.class);ctor.setAccessible(true);
            QuestTheme theme=ctor.newInstance(parsed);
            if(!theme.get(ThemeProperties.QUEST_COMPLETED_COLOR).equals(dev.ftb.mods.ftblibrary.icon.Color4I.rgb(0xB0F5CF)))throw new IllegalStateException("wrong completion color");
            if(!theme.get(ThemeProperties.DEPENDENCY_LINE_COMPLETED_COLOR).equals(dev.ftb.mods.ftblibrary.icon.Color4I.fromString("#D07AD9B0")))throw new IllegalStateException("wrong dependency color");
            if(theme.get(ThemeProperties.CHECK_ICON).isEmpty())throw new IllegalStateException("empty check icon");
            var panel=(dev.ftb.mods.ftblibrary.icon.PartIcon)theme.get(ThemeProperties.CHAPTER_PANEL_BACKGROUND);
            if(panel.textureWidth!=32||panel.textureHeight!=32)throw new IllegalStateException("Wrong chapter panel texture size");
            System.out.println("Mutable ArrayList, List.copyOf, Stream.toList and unmodifiableList: sorted copy returned; caller-owned lists unchanged.");
            System.out.println("Actual transformed Minecraft constructor accepts the original unsorted immutable list and prioritizes KubeJS.");
            System.out.println("Previous patch reproduces UnsupportedOperationException; actual Moonlight FilteredResManager.including now accepts its immutable Stream.toList output.");
            System.out.println("Server data pack order is unchanged.");
            System.out.println("Actual Minecraft resource manager: "+matched+" UI files resolve from KubeJS with identical bytes, without the UI ZIP.");
            System.out.println("Actual FTB theme stack: "+themes.size()+" resources merged; completion/dependency colors and check icon correct.");
            System.out.println("Asset check mode: "+(staged?"staged":"installed"));
        }
    }
}
