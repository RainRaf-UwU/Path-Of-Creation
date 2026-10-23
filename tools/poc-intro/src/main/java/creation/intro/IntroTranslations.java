package creation.intro;

import com.google.gson.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Bundled language fallback for offline previews/tests. The game uses its resource-loaded I18n. */
final class IntroTranslations {
    private static final Map<String,String> EN=load("en_us"),ZH=load("zh_cn");
    private static Map<String,String> load(String locale){
        try(var input=IntroTranslations.class.getResourceAsStream("/assets/poc_intro/lang/"+locale+".json")){
            if(input==null)throw new IOException("Missing story language: "+locale);
            var result=new HashMap<String,String>();
            var object=JsonParser.parseReader(new InputStreamReader(input,StandardCharsets.UTF_8)).getAsJsonObject();
            for(var entry:object.entrySet())result.put(entry.getKey(),entry.getValue().getAsString());
            return Map.copyOf(result);
        }catch(IOException failure){throw new UncheckedIOException(failure);}
    }
    static String text(String key,boolean chinese){return (chinese?ZH:EN).getOrDefault(key,EN.getOrDefault(key,key));}
    static boolean has(String key,boolean chinese){return (chinese?ZH:EN).containsKey(key);}
}
