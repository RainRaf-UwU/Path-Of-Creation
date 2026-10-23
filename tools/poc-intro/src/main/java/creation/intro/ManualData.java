package creation.intro;

import com.google.gson.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Authored articles and an installed-item index, with no Minecraft class loading. */
public final class ManualData {
    public record Group(String id,String zh,String en,List<String> mods,String summary,String summaryEn,String search) {
        public Group(String id,String zh,String en,List<String> mods,String summary,String summaryEn){this(id,zh,en,mods,summary,summaryEn,"");}
        public String name(boolean cn){return cn?zh:en;}
        public String aliases(){return (id+" "+zh+" "+en+" "+String.join(" ",mods)+" "+(search==null?"":search)).toLowerCase(Locale.ROOT);}
    }
    public record Entry(String id,String group,String zh,String en,String body,String bodyEn,List<String> items,List<String> tags,List<String> sources,boolean guide,List<String> pictures,List<String> controls) {
        public Entry(String id,String group,String zh,String en,String body,String bodyEn,List<String> items,List<String> tags,List<String> sources,boolean guide,List<String> pictures){this(id,group,zh,en,body,bodyEn,items,tags,sources,guide,pictures,List.of());}
        public Entry(String id,String group,String zh,String en,String body,String bodyEn,List<String> items,List<String> tags,List<String> sources,boolean guide){this(id,group,zh,en,body,bodyEn,items,tags,sources,guide,List.of());}
        public String title(boolean cn){return cn?zh:en;}
        public String text(boolean cn){return cn?body:bodyEn;}
        public List<String> pictureIds(){return pictures==null?List.of():pictures;}
        public List<String> controlIds(){return controls==null?List.of():controls;}
    }
    public record Keybind(String zh,String en,String when,String whenEn){}
    public record Picture(String resource,int width,int height,String caption,String captionEn,String credit,String preview){}
    public List<Group> groups=List.of();
    public List<Entry> entries=List.of();
    public Map<String,Picture> pictures=Map.of();
    public Map<String,Keybind> keybinds=Map.of();
    public String controlText(Entry entry,boolean cn,java.util.function.Function<String,String> resolver){
        if(entry.controlIds().isEmpty())return "";
        StringBuilder text=new StringBuilder(cn?"按键与操作\n":"Keys and controls\n");
        for(String id:entry.controlIds()){
            Keybind key=keybinds.get(id);if(key==null)continue;
            text.append('[').append(resolver.apply(id)).append("] ").append(cn?key.zh():key.en()).append('\n');
            String when=cn?key.when():key.whenEn();if(when!=null&&!when.isBlank())text.append("  ").append(when).append('\n');
        }
        return text.append('\n').toString();
    }
    public Group group(String id){return groups.stream().filter(g->g.id().equals(id)).findFirst().orElseThrow();}
    public static ManualData load(){
        try(var stream=ManualData.class.getResourceAsStream("/assets/poc_intro/manual.json")){
            if(stream==null)throw new IOException("Missing manual.json");
            return new Gson().fromJson(new InputStreamReader(stream,StandardCharsets.UTF_8),ManualData.class);
        }catch(IOException e){throw new UncheckedIOException(e);}
    }
}
