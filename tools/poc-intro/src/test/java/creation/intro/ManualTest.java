package creation.intro;
import java.util.*;
public final class ManualTest {
    static int count;static void check(boolean value,String message){count++;if(!value)throw new AssertionError(message);}
    public static void main(String[] args){
        ManualData d=ManualData.load();Set<String> ids=new HashSet<>(),mods=new HashSet<>();
        for(var g:d.groups){check(ids.add(g.id()),"Duplicate group");for(String m:g.mods())check(mods.add(m),"Addon belongs to exactly one family: "+m);}
        ids.clear();for(var e:d.entries){check(ids.add(e.id()),"Duplicate entry "+e.id());check(!e.zh().isBlank()&&!e.en().isBlank()&&!e.body().isBlank()&&!e.bodyEn().isBlank(),"Bilingual operation text");check(e.zh().codePoints().anyMatch(p->p>=0x3400&&p<=0x9fff),"Chinese title must not fall back to a raw English model name: "+e.id());d.group(e.group());}
        check(d.entries.stream().noneMatch(e->e.id().startsWith("buildinggadgets2:construction_")||e.items().stream().anyMatch(id->id.startsWith("buildinggadgets2:construction_"))),"Legacy building-paste models cannot masquerade as installed items");
        for(String id:List.of("more/xnet/simple/controller","more/sfm/forget","more/justdirethings/mach_blockbreakert2","more/rftoolsstorage/scanner/scanner"))check(d.entries.stream().anyMatch(e->e.id().equals(id)&&e.body().length()>100),"Expanded machine has an operational tutorial: "+id);
        // Prevent a broad family paragraph from replacing researched machine instructions.
        for(var requirement:Map.of("mekanism",50L,"industrialforegoing",45L,"enderio",20L,"create",100L,"immersiveengineering",50L).entrySet()){
            check(d.entries.stream().filter(e->e.group().equals(requirement.getKey())).map(ManualData.Entry::body).distinct().count()>=requirement.getValue(),"Distinct operation coverage: "+requirement.getKey());
        }
        var dissolution=d.entries.stream().filter(e->e.id().equals("industrialforegoing:dissolution_chamber")).findFirst().orElseThrow();
        check(dissolution.body().contains("无序")&&!dissolution.body().contains("保留空位"),"Installed dissolution recipes are shapeless");
        var largeDissolution=d.entries.stream().filter(e->e.id().equals("ifeu:big_dissolution_chamber")).findFirst().orElseThrow();
        check(largeDissolution.body().contains("单方块"),"Installed Extra Upgrades changed the chamber structure");
        for(String id:List.of("create:packager","create:factory_gauge","create:stock_link","create:repackager","mekanism:chemical_washer","mekanism:chemical_crystallizer","mekmm:presser","mekanismgenerators:fission_reactor_casing","enderio:sag_mill","industrialforegoing:simulated_hydroponic_bed","stellaris:vacuumator"))
            check(d.entries.stream().anyMatch(e->e.id().equals(id)&&e.body().length()>25),"Important machine has an operational entry: "+id);
        var ae=d.entries.stream().filter(e->e.group().equals("ae2")&&e.items().contains("ae2:controller")).findFirst().orElseThrow();var g=d.group("ae2");
        check(new ManualSearch("@extendedae").matches(ae,g,(e,t)->false),"Addon alias finds its family");
        check(new ManualSearch("@扩展AE").matches(ae,g,(e,t)->false),"Chinese addon alias");
        check(new ManualSearch("@ae2 &ae2:controller").matches(ae,g,(e,t)->false),"AND and item ID");
        check(new ManualSearch("@create | @ae2").matches(ae,g,(e,t)->false),"OR");
        check(!new ManualSearch("@ae2 -&ae2:controller").matches(ae,g,(e,t)->false),"Negative item filter");
        check(new ManualSearch("\"Applied Energistics\"").matches(ae,g,(e,t)->false),"Quoted phrase");
        check(!new ManualSearch("@unknown").matches(ae,g,(e,t)->false),"No-result query");
        check(new ManualSearch("@").matches(ae,g,(e,t)->false),"Prefix-only query is ignored while typing");
        check(new ManualSearch("\"Applied Energistics").matches(ae,g,(e,t)->false),"Unclosed phrase remains usable while typing");
        check(new ManualSearch("@ae2 | ").matches(ae,g,(e,t)->false),"Trailing OR does not lose valid results");
        check(new ManualSearch("#c:ingots").matches(ae,g,(e,t)->t.equals("#c:ingots")),"Registry tags");
        check(new ManualSearch("^blue %tools $energy").matches(ae,g,(e,t)->true),"JEI fields");
        for(var e:d.entries)for(String picture:e.pictureIds())check(d.pictures.containsKey(picture),"Illustration reference resolves");
        for(var e:d.entries)for(String control:e.controlIds())check(d.keybinds.containsKey(control),"Control reference resolves: "+control);
        var configurator=d.entries.stream().filter(e->e.id().equals("controls/mekanism/configurator")).findFirst().orElseThrow();
        check(d.controlText(configurator,true,id->"Ctrl + F9").contains("[Ctrl + F9]"),"Configured bindings retain their modifiers");
        check(d.controlText(configurator,true,id->"未分配").contains("[未分配]"),"Unbound action never falls back to a default key");
        check(d.controlText(configurator,false,id->"Unbound").contains("Change held-item mode"),"Control descriptions are bilingual");
        check(!d.controlText(configurator,true,id->"NEW KEY").contains("Ctrl + F9"),"Rebinding is resolved on each render");
        check(d.entries.stream().anyMatch(e->e.id().equals("create:wrench")),"Common wrench is indexed");
        check(d.entries.stream().anyMatch(e->e.id().equals("create:goggles")),"Engineer Goggles are indexed");
        for(var picture:d.pictures.values())check(picture.width()>0&&picture.height()>0&&picture.resource().contains(":"),"Native image dimensions and resource");
        var c=new ManualUi.Canvas(){public void rect(int x,int y,int w,int h,int color){check(w>=0&&h>=0,"Nonnegative rectangles");}public void text(String s,int x,int y,int color){}public int width(String s){return s.codePoints().map(p->p>255?9:6).sum();}public void clip(ManualUi.Box b){check(b.w()>0&&b.h()>0,"Positive clipping");}public void unclip(){}public void item(String id,int x,int y){}};
        for(int[] size:new int[][]{{320,180},{426,240},{640,360},{854,360}})for(boolean cn:new boolean[]{true,false}){
            var state=new ManualUi.State();state.cn=cn;state.results=d.entries;var l=ManualUi.draw(c,size[0],size[1],state,d,-1,-1);check(l.article().w()>=126,"Readable article column");check(l.article().y()+l.article().h()<=size[1],"Article in viewport");state.help=true;ManualUi.draw(c,size[0],size[1],state,d,-1,-1);state.help=false;state.results=List.of();ManualUi.draw(c,size[0],size[1],state,d,-1,-1);
            var illustrated=d.entries.stream().filter(e->!e.pictureIds().isEmpty()).findFirst();if(illustrated.isPresent()){state.results=List.of(illustrated.get());ManualUi.draw(c,size[0],size[1],state,d,-1,-1);var media=ManualUi.media(c,l,state,d);check(media!=null&&media.box().w()<=l.article().w()-18,"Illustration fits article");state.bodyScroll=10;ManualUi.draw(c,size[0],size[1],state,d,-1,-1);}
        }
        System.out.println("PASS "+count+" manual assertions: catalog, aliases, search and responsive shared layout");
    }
}
