package creation.intro;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import java.util.*;
import javax.imageio.ImageIO;

/** Shared production UI, offline font and icon placeholders clearly marked. */
public final class ManualPreview {
    static final Map<String,String> KEYS=loadKeys();
    static Map<String,String> loadKeys(){try{String file=System.getProperty("poc.manual.keybindings","");if(file.isBlank())return Map.of();var json=com.google.gson.JsonParser.parseString(Files.readString(Path.of(file))).getAsJsonObject();Map<String,String> keys=new HashMap<>();json.entrySet().forEach(e->keys.put(e.getKey(),e.getValue().getAsString()));return keys;}catch(Exception ex){throw new IllegalStateException("Invalid preview key snapshot",ex);}}
    static class Surface implements ManualUi.Canvas{
        final Graphics2D g;final Shape full;Surface(Graphics2D g){this.g=g;full=g.getClip();g.setFont(new Font("Microsoft YaHei",Font.PLAIN,9));g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_ON);}
        public void rect(int x,int y,int w,int h,int c){g.setColor(new Color(c,true));if(w>0&&h>0)g.fillRect(x,y,w,h);}
        public void text(String s,int x,int y,int c){g.setColor(new Color(c,true));g.drawString(s,x,y+8);}
        public int width(String s){return g.getFontMetrics().stringWidth(s);}
        public String keyName(String id,boolean cn){String name=KEYS.getOrDefault(id,cn?"见按键设置":"See controls");return !cn?name.replace("未分配","Unbound").replace("未注册","Not registered"):name;}
        public void clip(ManualUi.Box b){g.setClip(full);g.clipRect(b.x(),b.y(),b.w(),b.h());}public void unclip(){g.setClip(full);}
        public void item(String id,int x,int y){rect(x,y,16,16,ManualUi.BORDER);rect(x+2,y+2,12,12,ManualUi.SELECT);rect(x+6,y+4,4,8,ManualUi.CYAN);}
        public void image(ManualData.Picture picture,ManualUi.Box box){try{var image=ImageIO.read(Path.of(System.getProperty("poc.manual.images","design/manual-20261020"),picture.preview()).toFile());g.drawImage(image,box.x(),box.y(),box.w(),box.h(),null);}catch(Exception ex){throw new IllegalStateException("Missing preview image "+picture.preview(),ex);}}
    }
    public static ManualData fixed(){
        ManualData d=new ManualData();d.groups=java.util.List.of(new ManualData.Group("ae2","应用能源 2","Applied Energistics 2",java.util.List.of("ae2","extendedae","advanced_ae","megacells"),"网络存储与自动合成","Network storage and crafting"),new ManualData.Group("create","机械动力","Create",java.util.List.of("create"),"旋转动力与加工","Kinetic processing"),new ManualData.Group("mekanism","通用机械","Mekanism",java.util.List.of("mekanism"),"化学工业与能源","Chemicals and power"),new ManualData.Group("industrialforegoing","工业先锋","Industrial Foregoing",java.util.List.of("industrialforegoing"),"流体与生物工业","Fluid and mob industry"),new ManualData.Group("oritech","Oritech 工业","Oritech",java.util.List.of("oritech"),"模块化工业","Modular industry"),new ManualData.Group("powah","Powah 能源","Powah",java.util.List.of("powah"),"发电与充能","Generation and energizing"));
        d.entries=java.util.List.of(new ManualData.Entry("network","ae2","ME 网络与频道","ME networks and channels","把控制器、能源接收器、线缆与终端连接起来，再通过存储总线或 ME 驱动器接入物品。\n\n重要机制\n有频道的设备需要可用频道；普通线缆与致密线缆的承载量不同。能量不足或网络分裂会使终端离线。\n\n在创世之径中\n扩展 AE、高级 AE、MEGA 和无限元件都归在这个目录。用 @extendedae 也能找到同一个模组族。\n\n先检查供电和频道，再排查存储优先级与物品类型限制。","Connect a controller, energy acceptor, cables and terminal. Add storage through drives or storage buses.\n\nChannels and stable power determine whether devices stay online. AE2 addons share this family.",java.util.List.of("ae2:controller","ae2:drive","ae2:terminal"),java.util.List.of(),java.util.List.of(),true),new ManualData.Entry("crafting","ae2","样板与自动合成","Patterns and autocrafting","编码样板后放入样板供应器，使用合成 CPU 执行请求。加工样板需要外部机器实际完成加工。","Encode patterns and install them in pattern providers. A crafting CPU schedules requests; processing patterns still need external machines.",java.util.List.of("ae2:pattern_provider"),java.util.List.of(),java.util.List.of(),true),new ManualData.Entry("addons","ae2","附属与扩展元件","Addons and expanded cells","扩展元件与自动化设备统一列在 AE2 分类，搜索仍识别附属名称。","Expanded cells and automation addons are grouped with AE2.",java.util.List.of("ae2:cell_workbench"),java.util.List.of(),java.util.List.of(),true));return d;
    }
    static void render(Path path,ManualData data,ManualUi.State s,int w,int h)throws Exception{
        BufferedImage im=new BufferedImage(w*2,h*2+32,BufferedImage.TYPE_INT_RGB);Graphics2D g=im.createGraphics();g.setColor(new Color(0x030812));g.fillRect(0,0,im.getWidth(),im.getHeight());g.setColor(new Color(0x8a9caa));g.setFont(new Font("Microsoft YaHei",Font.PLAIN,13));g.drawString("离线 UI 预览 · 键位为本实例参考，游戏内跟随设置 · 字体/物品图标为示意",16,21);g.translate(0,32);g.scale(2,2);ManualUi.draw(new Surface(g),w,h,s,data,-1,-1);g.dispose();ImageIO.write(im,"png",path.toFile());
    }
    public static void main(String[] args)throws Exception{
        Path out=Path.of(args[0]);Files.createDirectories(out);ManualData data=args.length>1?ManualData.load():fixed();ManualUi.State s=new ManualUi.State();s.group="ae2";s.results=data.entries.stream().filter(e->e.group().equals("ae2")).toList();
        if(args.length<=1){data.keybinds=Map.of("key.mekanism.mode",new ManualData.Keybind("切换工具模式","Change tool mode","配置器：手持工具并潜行","Configurator: hold the tool and sneak"));var e=data.entries.getFirst();data.entries=new ArrayList<>(data.entries);data.entries.set(0,new ManualData.Entry(e.id(),e.group(),e.zh(),e.en(),e.body(),e.bodyEn(),e.items(),e.tags(),e.sources(),e.guide(),e.pictures(),java.util.List.of("key.mekanism.mode")));s.results=data.entries;}
        render(out.resolve("01-manual.png"),data,s,640,360);render(out.resolve("02-small.png"),data,s,320,180);render(out.resolve("03-wide.png"),data,s,854,360);s.help=true;render(out.resolve("04-help.png"),data,s,640,360);s.help=false;s.results=java.util.List.of();s.query="@未知模组";render(out.resolve("05-empty.png"),data,s,640,360);s.cn=false;s.query="@ae2";s.results=data.entries.stream().filter(e->e.group().equals("ae2")).toList();render(out.resolve("06-english.png"),data,s,640,360);
        if(!data.pictures.isEmpty()){
            s.cn=true;s.query="";
            int n=7;for(String id:java.util.List.of("ae2:inscriber","oritech:machine_extender","powah:energizing_orb")){
                var entry=data.entries.stream().filter(e->e.id().equals(id)).findFirst().orElseThrow();s.group=entry.group();s.results=data.entries.stream().filter(e->e.group().equals(s.group)).toList();s.selected=s.results.indexOf(entry);s.entryScroll=Math.max(0,s.selected-2);s.bodyScroll=0;s.groupScroll=Math.max(0,data.groups.indexOf(data.group(s.group))-2);
                render(out.resolve(String.format("%02d-illustrated.png",n++)),data,s,640,360);render(out.resolve(String.format("%02d-illustrated-small.png",n++)),data,s,320,180);
            }
            int detail=13;for(String id:java.util.List.of("industrialforegoing:dissolution_chamber","create:packager","mekanismgenerators:fission_reactor_casing","enderio:sag_mill","deep/stellaris/vacuumator","laserio:laser_node","modularrouters:modular_router")){
                var entry=data.entries.stream().filter(e->e.id().equals(id)).findFirst().orElseThrow();s.group=entry.group();s.results=data.entries.stream().filter(e->e.group().equals(s.group)).toList();s.selected=s.results.indexOf(entry);s.entryScroll=Math.max(0,s.selected-2);s.bodyScroll=0;s.groupScroll=Math.max(0,data.groups.indexOf(data.group(s.group))-2);
                render(out.resolve(String.format("%02d-expanded.png",detail++)),data,s,640,360);
            }
        }
        int control=20;for(String id:java.util.List.of("controls/mekanism/configurator","controls/buildinggadgets2/building","controls/controls/jei","controls/controls/quests","controls/modularrouters/module-controls","controls/oritech/augments")){
            var entry=data.entries.stream().filter(e->e.id().equals(id)).findFirst();if(entry.isEmpty())continue;
            s.cn=true;s.query="";s.group=entry.get().group();s.results=data.entries.stream().filter(e->e.group().equals(s.group)).toList();s.selected=s.results.indexOf(entry.get());s.entryScroll=Math.max(0,s.selected-1);s.bodyScroll=0;s.groupScroll=Math.max(0,data.groups.indexOf(data.group(s.group))-2);
            render(out.resolve(String.format("%02d-controls.png",control++)),data,s,640,360);
            if(id.endsWith("configurator")){render(out.resolve("25-controls-small.png"),data,s,320,180);s.bodyScroll=99999;render(out.resolve("26-controls-end.png"),data,s,640,360);s.bodyScroll=0;}
        }
        int more=27;for(String id:java.util.List.of("integrateddynamics:part_machine_reader","more/xnet/simple/controller","more/rftoolsstorage/scanner/scanner","more/sfm/forget","more/justdirethings/mach_clickert1","buildinggadgets2:gadget_building","more/rftoolsutility/machines/environmental")){
            var entry=data.entries.stream().filter(e->e.id().equals(id)).findFirst();if(entry.isEmpty())continue;
            s.cn=true;s.query="";s.group=entry.get().group();s.results=data.entries.stream().filter(e->e.group().equals(s.group)).toList();s.selected=s.results.indexOf(entry.get());s.entryScroll=Math.max(0,s.selected-1);s.bodyScroll=0;s.groupScroll=Math.max(0,data.groups.indexOf(data.group(s.group))-2);
            render(out.resolve(String.format("%02d-localized.png",more++)),data,s,640,360);
        }
        System.out.println("Rendered manual states with production ManualUi and installed-mod illustrations");
    }
}
