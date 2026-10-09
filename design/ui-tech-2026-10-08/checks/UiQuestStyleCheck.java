import java.nio.file.*;
import java.lang.reflect.*;
import java.util.*;
import dev.ftb.mods.ftbquests.quest.theme.*;
import dev.ftb.mods.ftbquests.quest.theme.property.*;
import dev.ftb.mods.ftblibrary.icon.*;

public class UiQuestStyleCheck {
    static double linear(int c) {double v=c/255.0;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);}
    static double luminance(Color4I c) {return 0.2126*linear(c.redi())+0.7152*linear(c.greeni())+0.0722*linear(c.bluei());}
    public static void main(String[] args) throws Exception {
        Method parse=ThemeLoader.class.getDeclaredMethod("parse",Map.class,List.class);parse.setAccessible(true);
        Map<Object,SelectorProperties> map=new LinkedHashMap<>();
        parse.invoke(null,map,Files.readAllLines(Path.of(args[0])));
        Constructor<QuestTheme> ctor=QuestTheme.class.getDeclaredConstructor(Map.class);ctor.setAccessible(true);
        QuestTheme theme=ctor.newInstance(map);
        int[][] expected={{176,245,207},{177,243,255},{224,237,245},{122,217,176}};
        int i=0;Color4I panel=Color4I.rgb(0x142336);
        Color4I highlight=theme.get(ThemeProperties.SELECTED_HILITE_1);
        double alpha=highlight.alphai()/255.0;
        Color4I selected=Color4I.rgb((int)Math.round(panel.redi()*(1-alpha)+highlight.redi()*alpha),
            (int)Math.round(panel.greeni()*(1-alpha)+highlight.greeni()*alpha),
            (int)Math.round(panel.bluei()*(1-alpha)+highlight.bluei()*alpha));
        System.out.printf("%s RGBA=%d,%d,%d,%d selected backdrop RGB=%d,%d,%d%n",ThemeProperties.SELECTED_HILITE_1.getName(),
            highlight.redi(),highlight.greeni(),highlight.bluei(),highlight.alphai(),selected.redi(),selected.greeni(),selected.bluei());
        for(ColorProperty property:List.of(ThemeProperties.QUEST_COMPLETED_COLOR,ThemeProperties.QUEST_STARTED_COLOR,
                ThemeProperties.QUEST_NOT_STARTED_COLOR,ThemeProperties.DEPENDENCY_LINE_COMPLETED_COLOR)) {
            Color4I color=theme.get(property);
            System.out.printf("%s: r=%d g=%d b=%d a=%d%n",property.getName(),color.redi(),color.greeni(),color.bluei(),color.alphai());
            int[] rgb=expected[i++];
            if(color.redi()!=rgb[0]||color.greeni()!=rgb[1]||color.bluei()!=rgb[2])throw new IllegalStateException("Unexpected RGB channels");
            if(i<=3) {
                Color4I dimmed=color.addBrightness(-0.35f);
                double ratio=Math.min((luminance(dimmed)+0.05)/(luminance(panel)+0.05),(luminance(dimmed)+0.05)/(luminance(selected)+0.05));
                System.out.printf("Chapter non-hover RGB=%d,%d,%d contrast=%.2f%n",dimmed.redi(),dimmed.greeni(),dimmed.bluei(),ratio);
                if(ratio<4.5)throw new IllegalStateException("Dimmed chapter title contrast below 4.5");
            }
        }
        Icon check=theme.get(ThemeProperties.CHECK_ICON);
        System.out.println("check icon: "+check.getClass().getName()+" "+check.getJson());
        Icon icon=theme.get(ThemeProperties.CHAPTER_PANEL_BACKGROUND);
        PartIcon part=(PartIcon)icon;
        System.out.printf("Chapter PartIcon: texture=%dx%d sub=%dx%d corner=%d%n",part.textureWidth,part.textureHeight,part.subWidth,part.subHeight,part.corner);
        int panels=0;
        for(Field field:ThemeProperties.class.getFields())if(field.getType()==IconProperty.class) {
            Icon entry=theme.get((IconProperty)field.get(null));
            if(entry instanceof PartIcon p) {
                if(p.textureWidth!=32||p.textureHeight!=32||p.subWidth!=32||p.subHeight!=32||p.corner!=4)throw new IllegalStateException("Wrong nine-slice geometry: "+field.getName());
                panels++;
            }
        }
        if(panels!=11)throw new IllegalStateException("Unexpected PartIcon count: "+panels);
        if(!check.getJson().getAsString().equals("rain:textures/gui/poc/check.png"))throw new IllegalStateException("Wrong completion overlay icon");
        System.out.println("11 PartIcons use the actual 32x32 texture dimensions; all three dimmed chapter state colors meet 4.5 contrast on normal and selected rows.");
    }
}
