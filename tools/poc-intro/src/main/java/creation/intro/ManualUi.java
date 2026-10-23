package creation.intro;

import java.util.*;

/** Shared production layout and drawing for Minecraft and headless acceptance images. */
public final class ManualUi {
    public static final int BG=0xff07101b,PANEL=0xff0c1928,BORDER=0xff294459,SELECT=0xff173a47,CYAN=0xff79dedf,GOLD=0xffddbb86,TEXT=0xffe8eff1,MUTED=0xff8a9caa;
    public record Box(int x,int y,int w,int h){public boolean contains(double a,double b){return a>=x&&a<x+w&&b>=y&&b<y+h;}}
    public interface Canvas{
        void rect(int x,int y,int w,int h,int color);void text(String s,int x,int y,int color);int width(String s);
        void clip(Box b);void unclip();void item(String id,int x,int y);
        default void image(ManualData.Picture picture,Box box){}
        default String keyName(String id,boolean cn){return cn?"见按键设置":"See controls";}
    }
    public record Layout(Box frame,Box search,Box clear,Box help,Box close,Box groups,Box entries,Box article){}
    public static final class State{
        public boolean cn=true,help;public String query="",group="";public int selected,groupScroll,entryScroll,bodyScroll;
        public List<ManualData.Entry> results=List.of();
    }
    public static Layout layout(int w,int h){
        int m=w<500?5:12,top=h<240?24:34,foot=16,gap=w<500?4:6;
        Box frame=new Box(m,m,w-m*2,h-m*2);int y=m+top+28,bottom=h-m-foot;
        int gw=w<500?74:126,ew=w<500?84:150,ax=m+gw+ew+gap*2;
        return new Layout(frame,new Box(m+5,m+top,w-m*2-60,20),new Box(w-m-52,m+top,20,20),new Box(w-m-28,m+top,23,20),new Box(w-m-19,m+5,14,14),new Box(m,y,gw,bottom-y),new Box(m+gw+gap,y,ew,bottom-y),new Box(ax,y,w-m-ax,bottom-y));
    }
    public static String fit(Canvas c,String s,int w){if(c.width(s)<=w)return s;while(!s.isEmpty()&&c.width(s+"…")>w)s=s.substring(0,s.offsetByCodePoints(s.length(),-1));return s+"…";}
    public static List<String> wrap(Canvas c,String s,int width){
        List<String> lines=new ArrayList<>();StringBuilder line=new StringBuilder();
        for(int p:s.codePoints().toArray()){String next=new String(Character.toChars(p));if(p=='\n'||(!line.isEmpty()&&c.width(line+next)>width)){lines.add(line.toString());line.setLength(0);if(p=='\n')continue;}line.append(next);}if(!line.isEmpty())lines.add(line.toString());return lines;
    }
    public static int maxScroll(int count,int pixels,int row){return Math.max(0,count-Math.max(1,pixels/row));}
    public static List<String> articleLines(Canvas c,Layout l,State s,ManualData data){
        String text;
        if(s.help)text=s.cn?"搜索方法\n\n普通文字：检索名称与正文\n@ae2：本体与附属一起查\n#c:ingots：物品标签\n$能量：物品提示\n&mekanism:：物品 ID\n^blue：JEI 颜色\n%tools：JEI 创造标签页\n\n空格表示同时满足\n| 表示任意满足\n-词语 排除结果\n\"合成 CPU\" 精确短语\n\n示例：@ae2 -无线\n示例：@create 黄铜 | @powah\n\n颜色与标签页遵循 JEI 搜索配置。\nCtrl+F 聚焦搜索；右键搜索框清空。\n物品左键/R 配方，右键/U 用途。\nPageUp/Down 翻页，Home/End 到首尾。\n按键表显示当前绑定（含修饰键）。":"Search help\n\nText: names and articles\n@ae2: mod family\n#c:ingots: item tags\n$energy: item tooltips\n&mekanism: item ID\n^blue: JEI color\n%tools: JEI creative tabs\n\nSpace = AND; | = OR\n-word = exclude\n\"crafting CPU\" = phrase\n\nColor/tab search follows JEI settings.\nCtrl+F focuses search.\nItems: left/R recipes, right/U uses.\nPageUp/Down pages; Home/End jumps.\nControl tables show live key bindings.";
        else if(s.results.isEmpty())text=s.cn?"没有找到条目\n\n试试缩短词语、清空搜索，或选择“全部内容”。\n\n点击 ? 查看搜索语法。":"No matching entries\n\nTry fewer words, clear the search, or select All entries.\n\nUse ? for search help.";
        else {var e=s.results.get(Math.clamp(s.selected,0,s.results.size()-1));text=e.title(s.cn)+"\n\n"+data.controlText(e,s.cn,id->c.keyName(id,s.cn))+e.text(s.cn)+"\n\n"+(s.cn?"所属模组 / ":"Mod / ")+data.group(e.group()).name(s.cn);}
        var lines=wrap(c,text,Math.max(25,l.article.w-18));
        var media=media(c,l,s,data);if(media!=null){int count=media.compact?1:(media.box.h+29+11)/12;for(int i=0;i<count;i++)lines.add(Math.min(media.start,lines.size()),"");}
        return lines;
    }
    public record Media(ManualData.Picture picture,Box box,int start,boolean compact,int count){}
    public static Media media(Canvas c,Layout l,State s,ManualData data){
        if(s.help||s.results.isEmpty())return null;var e=s.results.get(Math.clamp(s.selected,0,s.results.size()-1));
        if(e.pictureIds().isEmpty())return null;var p=data.pictures.get(e.pictureIds().getFirst());if(p==null)return null;
        int start=wrap(c,e.title(s.cn)+"\n\n",Math.max(25,l.article.w-18)).size();boolean compact=l.article.h<180;
        double scale=Math.min((double)(l.article.w-18)/p.width(),106.0/p.height());int iw=Math.max(1,(int)(p.width()*scale)),ih=compact?12:Math.max(1,(int)(p.height()*scale));
        return new Media(p,new Box(l.article.x+(l.article.w-iw)/2,l.article.y+9+(start-s.bodyScroll)*12,iw,ih),start,compact,e.pictureIds().size());
    }
    public static Layout draw(Canvas c,int w,int h,State s,ManualData data,double mx,double my){
        Layout l=layout(w,h);c.rect(0,0,w,h,BG);panel(c,l.frame);
        // Stable geometry icon mirrors manual/assets/echo-book.svg.
        int ix=l.frame.x+10,iy=l.frame.y+8;c.rect(ix,iy,13,14,BORDER);c.rect(ix+2,iy+2,8,10,SELECT);c.rect(ix+5,iy+4,3,6,CYAN);
        c.text(s.cn?"ECHO / 科技模组手册":"ECHO / TECHNOLOGY MANUAL",ix+22,iy+1,CYAN);c.text("×",l.close.x+3,l.close.y+2,MUTED);
        panel(c,l.search);c.text(fit(c,s.query.isEmpty()?(s.cn?"搜索模组、机器或机制…":"Search mods, machines, mechanics…"):s.query,l.search.w-10),l.search.x+5,l.search.y+6,s.query.isEmpty()?MUTED:TEXT);
        panel(c,l.clear);c.text("×",l.clear.x+7,l.clear.y+6,MUTED);panel(c,l.help);c.text("?",l.help.x+8,l.help.y+6,CYAN);
        panel(c,l.groups);panel(c,l.entries);panel(c,l.article);
        String all=s.cn?"全部内容":"All entries";List<String> names=new ArrayList<>();names.add(all);for(var g:data.groups)names.add(g.name(s.cn));
        c.clip(l.groups);for(int i=s.groupScroll;i<names.size();i++){int y=l.groups.y+(i-s.groupScroll)*20;if(y>=l.groups.y+l.groups.h)break;String id=i==0?"":data.groups.get(i-1).id();boolean selected=s.group.equals(id);row(c,new Box(l.groups.x+1,y,l.groups.w-2,20),selected,mx,my);c.text(fit(c,names.get(i),l.groups.w-14),l.groups.x+7,y+6,selected?CYAN:TEXT);}c.unclip();
        c.clip(l.entries);for(int i=s.entryScroll;i<s.results.size();i++){int y=l.entries.y+(i-s.entryScroll)*30;if(y>=l.entries.y+l.entries.h)break;var e=s.results.get(i);row(c,new Box(l.entries.x+1,y,l.entries.w-2,30),i==s.selected,mx,my);c.text(fit(c,e.title(s.cn),l.entries.w-14),l.entries.x+7,y+5,i==s.selected?CYAN:TEXT);c.text(fit(c,(e.guide()?(s.cn?"机制 · ":"Guide · "):(s.cn?"物品 · ":"Item · "))+data.group(e.group()).name(s.cn),l.entries.w-14),l.entries.x+7,y+17,MUTED);}c.unclip();
        List<String> lines=articleLines(c,l,s,data);int reserve=!s.help&&!s.results.isEmpty()?42:0;
        s.bodyScroll=Math.clamp(s.bodyScroll,0,maxScroll(lines.size(),l.article.h-16-reserve,12));
        c.clip(new Box(l.article.x+1,l.article.y+1,l.article.w-2,Math.max(1,l.article.h-2-reserve)));
        for(int i=s.bodyScroll;i<lines.size();i++){int y=l.article.y+9+(i-s.bodyScroll)*12;if(y>=l.article.y+l.article.h-reserve-4)break;String line=lines.get(i);c.text(line,l.article.x+9,y,i==0||heading(line)?GOLD:line.startsWith("[")?CYAN:TEXT);}
        var media=media(c,l,s,data);if(media!=null){
            if(media.compact)c.text(s.cn?"查看配图（"+media.count+"） ›":"View images ("+media.count+") ›",l.article.x+9,media.box.y,CYAN);
            else{c.image(media.picture,media.box);c.text(fit(c,(s.cn?"原模组手册 · 点击放大 ":"Mod guide · click to zoom ")+"1/"+media.count,l.article.w-18),l.article.x+9,media.box.y+media.box.h+4,MUTED);}
        }c.unclip();
        if(reserve>0){var e=s.results.get(Math.clamp(s.selected,0,s.results.size()-1));int y=l.article.y+l.article.h-39;c.rect(l.article.x+5,y,l.article.w-10,1,BORDER);c.text(fit(c,s.cn?"相关物品 · 左键配方 / 右键用途":"Items · left: recipe / right: uses",l.article.w-12),l.article.x+7,y+4,MUTED);int limit=Math.min(e.items().size(),Math.max(1,(l.article.w-12)/21));for(int i=0;i<limit;i++)c.item(e.items().get(i),l.article.x+7+i*21,y+17);}
        bar(c,l.groups,names.size(),s.groupScroll,20);bar(c,l.entries,s.results.size(),s.entryScroll,30);bar(c,new Box(l.article.x,l.article.y,l.article.w,l.article.h-reserve),lines.size(),s.bodyScroll,12);
        c.text(fit(c,(s.cn?"收录 ":"Indexed ")+data.groups.size()+(s.cn?" 个分类  /  ":" categories / ")+s.results.size()+(s.cn?" 个结果":" results"),w-2*l.frame.x-12),l.frame.x+5,h-l.frame.y-11,MUTED);return l;
    }
    static boolean heading(String line){return line.matches("(?:按键与操作|操作说明|准备|操作步骤|配置步骤|工作流程|常见问题|故障排查|注意事项|输入与输出|配方与获取|Keys and controls|Instructions|Preparation|Steps|Troubleshooting|Input and output)")||line.matches("[一二三四五六七八九十]+、.*");}
    static void panel(Canvas c,Box b){c.rect(b.x,b.y,b.w,b.h,BORDER);c.rect(b.x+1,b.y+1,b.w-2,b.h-2,PANEL);}
    static void row(Canvas c,Box b,boolean selected,double mx,double my){if(selected||b.contains(mx,my))c.rect(b.x,b.y,b.w,b.h,SELECT);if(selected)c.rect(b.x,b.y,2,b.h,CYAN);}
    static void bar(Canvas c,Box b,int count,int scroll,int row){int visible=Math.max(1,b.h/row);if(count<=visible)return;int thumb=Math.max(5,b.h*visible/count),y=b.y+(int)((double)(b.h-thumb)*scroll/Math.max(1,count-visible));c.rect(b.x+b.w-3,y,2,thumb,BORDER);}
}
