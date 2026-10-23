package creation.intro;

import java.util.*;
import java.util.function.BiPredicate;

/** JEI-style boolean queries; item fields are augmented by the client registry. */
public final class ManualSearch {
    public record Term(String text,boolean exclude){}
    private final List<List<Term>> alternatives=new ArrayList<>();
    public ManualSearch(String query){
        List<Term> terms=new ArrayList<>();StringBuilder s=new StringBuilder();boolean quote=false,escape=false,negative=false;
        for(char c:(query+" ").toCharArray()){
            if(escape){s.append(c);escape=false;continue;}if(c=='\\'){escape=true;continue;}
            if(c=='"'){quote=!quote;continue;}
            if(!quote&&(Character.isWhitespace(c)||c=='|')){
                if(!s.isEmpty()){add(terms,s.toString(),negative);s.setLength(0);}negative=false;
                if(c=='|'&&!terms.isEmpty()){alternatives.add(List.copyOf(terms));terms.clear();}continue;
            }
            if(!quote&&s.isEmpty()&&c=='-'){negative=true;continue;}s.append(c);
        }
        if(!s.isEmpty())add(terms,s.toString(),negative);
        if(!terms.isEmpty())alternatives.add(List.copyOf(terms));
    }
    private static void add(List<Term> terms,String text,boolean negative){String value=text.strip().toLowerCase(Locale.ROOT);if(value.isEmpty()||value.length()==1&&"@#$^&%".contains(value))return;terms.add(new Term(value,negative));}
    public boolean matches(ManualData.Entry entry,ManualData.Group group,BiPredicate<ManualData.Entry,String> dynamic){
        if(alternatives.isEmpty())return true;
        return alternatives.stream().anyMatch(terms->terms.stream().allMatch(t->{
            String term=t.text();char prefix=term.charAt(0);String value=term.substring(1);
            boolean match=switch(prefix){
                case '@'->!value.isEmpty()&&group.aliases().contains(value);
                case '&'->!value.isEmpty()&&entry.items().stream().anyMatch(id->id.contains(value));
                case '#'->!value.isEmpty()&&(entry.tags().stream().anyMatch(tag->tag.contains(value))||dynamic.test(entry,term));
                case '$','^','%'->!value.isEmpty()&&dynamic.test(entry,term);
                default->(entry.zh()+" "+entry.en()+" "+entry.body()+" "+entry.bodyEn()+" "+String.join(" ",entry.items())+" "+group.aliases()).toLowerCase(Locale.ROOT).contains(term)||dynamic.test(entry,term);
            };return t.exclude()?!match:match;
        }));
    }
}
