package creation.intro;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;

/** Read the graph/translation keys per performance; each client resolves its own resource language. */
final class ChapterOneStory {
    static String read(Path file)throws IOException {
        if(!Files.exists(file)){
            Files.createDirectories(file.getParent());
            try(var input=ChapterOneStory.class.getResourceAsStream("/assets/poc_intro/chapter1.json")){
                if(input==null)throw new IOException("Missing bundled chapter1.json");
                Files.copy(input,file);
            }
        }
        if(Files.size(file)>131068)throw new IOException("chapter1.json is too large");
        String json=Files.readString(file,StandardCharsets.UTF_8);
        IntroStory.parse(json);
        return json;
    }
}
