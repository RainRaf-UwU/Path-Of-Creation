package creation.intro;

import java.awt.*;
import java.awt.geom.*;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import java.util.*;
import javax.imageio.*;
import javax.imageio.metadata.*;
import javax.imageio.stream.*;

/** Headless only. The scene is illustrative; the UI calls are the production IntroUi. */
public final class PreviewMain {
    static final class Surface implements IntroUi.Canvas {
        final Graphics2D g;
        Surface(Graphics2D g) { this.g=g;g.setFont(new Font("Microsoft YaHei",Font.PLAIN,9));g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_ON); }
        public void rect(int x,int y,int w,int h,int c){if(w<=0||h<=0)return;g.setColor(new Color(c,true));g.fillRect(x,y,w,h);}
        public void line(double x,double y,double a,double b,int c){g.setColor(new Color(c,true));g.draw(new Line2D.Double(x,y,a,b));}
        public void text(String s,int x,int y,int c){g.setColor(new Color(c,true));g.drawString(s,x,y+8);}
        public int width(String s){return g.getFontMetrics().stringWidth(s);}
        public void portrait(IntroUi.Box b,boolean player){
            // Offline only: an explicitly labelled sample skin. The game renders its actual Player entity.
            var frame=PortraitFraming.fit(b,1.8f);Shape old=g.getClip();g.clipRect(b.x(),b.y(),b.w(),b.h());
            sample(g,b.x()+b.w()*.5,frame.screenY(0),frame.scale(),false);g.setClip(old);
            text("示例皮肤",b.x()+6,b.y()+b.h()-11,IntroUi.MUTED);
        }
    }
    static void modelRect(Graphics2D g,double cx,double baseline,double unit,double x,double y,double w,double h,int color){
        g.setColor(new Color(color));g.fill(new Rectangle2D.Double(cx+x*unit,baseline-(y+h)*unit,w*unit,h*unit));
    }
    static void sample(Graphics2D g,double cx,double baseline,double unit,boolean seated){
        if(seated){modelRect(g,cx,baseline,unit,-.23,.15,.24,.55,0x323c56);modelRect(g,cx,baseline,unit,.01,.15,.24,.55,0x273047);modelRect(g,cx,baseline,unit,-.23,.6,.53,.15,0x3c4865);}
        modelRect(g,cx,baseline,unit,-.25,.7,.5,.7,0x30858f);
        modelRect(g,cx,baseline,unit,-.38,.6,.13,.8,0xb3825f);modelRect(g,cx,baseline,unit,.25,.65,.13,.75,0xb3825f);
        modelRect(g,cx,baseline,unit,-.38,1.12,.13,.28,0x256b76);modelRect(g,cx,baseline,unit,.25,1.12,.13,.28,0x3a929a);
        modelRect(g,cx,baseline,unit,-.25,1.4,.5,.5,0x422e22);
        modelRect(g,cx,baseline,unit,-.10,1.4,.35,.34,0xb3825f);
        modelRect(g,cx,baseline,unit,-.25,1.4,.15,.34,0x815a42);
        modelRect(g,cx,baseline,unit,-.04,1.58,.06,.055,0xe3d6c8);modelRect(g,cx,baseline,unit,.13,1.58,.06,.055,0xe3d6c8);
        modelRect(g,cx,baseline,unit,-.005,1.58,.028,.055,0x304772);modelRect(g,cx,baseline,unit,.16,1.58,.028,.055,0x304772);
        modelRect(g,cx,baseline,unit,.06,1.46,.09,.025,0x704c3f);
    }
    static BufferedImage image(IntroPlayback p,int w,int h,int scale,BufferedImage table) {
        BufferedImage out=new BufferedImage(w*scale,h*scale,BufferedImage.TYPE_INT_RGB);
        Graphics2D g=out.createGraphics();g.scale(scale,scale);scene(g,w,h,p.age,table);
        IntroUi.draw(new Surface(g),w,h,p,-1,-1);g.dispose();return out;
    }
    static void scene(Graphics2D g,int w,int h,double t,BufferedImage table) {
        g.setPaint(new GradientPaint(0,0,new Color(5,9,19),w,h,new Color(16,25,40)));g.fillRect(0,0,w,h);
        Random r=new Random(2381);double yaw=IntroTimeline.yaw(t);
        for(int i=0;i<95;i++){int x=Math.floorMod((int)(r.nextInt(w)-yaw*2),w),y=r.nextInt(h);int a=r.nextInt(70)+10;g.setColor(new Color(130,168,187,a));g.fillRect(x,y,1,1);}
        // No invented islands: only a single table over an empty void.
        double third=IntroTimeline.thirdPerson(t);
        int cx=(int)(w*.5-yaw*1.7*(1-third)),cy=(int)(h*.67+IntroTimeline.pitch(t)*.9*(1-third)),rx=(int)(w*(.11-.055*third)),ry=(int)(h*(.08-.04*third));
        Polygon top=new Polygon(new int[]{cx,cx+rx,cx,cx-rx},new int[]{cy-ry,cy,cy+ry,cy},4);
        g.setColor(new Color(40,48,68));g.fillPolygon(new int[]{cx-rx,cx,cx,cx-rx},new int[]{cy,cy+ry,cy+ry+40,cy+40},4);
        g.setColor(new Color(18,25,39));g.fillPolygon(new int[]{cx,cx+rx,cx+rx,cx},new int[]{cy+ry,cy,cy+40,cy+ry+40},4);
        if(table!=null){Shape old=g.getClip();g.clip(top);AffineTransform tx=new AffineTransform((double)rx/table.getWidth(),(double)ry/table.getWidth(),-(double)rx/table.getHeight(),(double)ry/table.getHeight(),cx,cy-ry);g.drawImage(table,tx,null);g.setClip(old);}
        else {g.setColor(new Color(90,82,99));g.fill(top);}
        g.setColor(new Color(115,160,175,80));g.draw(top);
        if(third>.25){Composite old=g.getComposite();g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,(float)((third-.25)/.75)));sample(g,cx,cy+h*.115*.7,h*.115,true);g.setComposite(old);}
    }
    static IntroPlayback state(IntroStory story,String node,double age,boolean full,boolean choices){
        IntroPlayback p=new IntroPlayback(story,true,()->{});p.begun=true;p.age=age;p.node=story.node(node);if(full)p.shown=p.length();if(choices)p.choiceShown=p.choiceLength();return p;
    }
    static void gif(Path path,IntroStory story,BufferedImage table)throws Exception{
        ImageWriter writer=ImageIO.getImageWritersBySuffix("gif").next();
        try(ImageOutputStream output=ImageIO.createImageOutputStream(path.toFile())){
            writer.setOutput(output);writer.prepareWriteSequence(null);
            IntroPlayback p=new IntroPlayback(story,true,()->{});p.begun=true;
            for(int frame=0;frame<150;frame++){
                p.tick(.1,true);p.tick(.1,true);
                if(frame==103){p.go("identity");p.shown=p.length();}
                BufferedImage im=image(p,640,360,1,table);
                IIOMetadata meta=writer.getDefaultImageMetadata(new ImageTypeSpecifier(im),null);
                String format=meta.getNativeMetadataFormatName();IIOMetadataNode tree=(IIOMetadataNode)meta.getAsTree(format);
                IIOMetadataNode control=(IIOMetadataNode)tree.getElementsByTagName("GraphicControlExtension").item(0);
                control.setAttribute("delayTime","20");control.setAttribute("disposalMethod","none");
                if(frame==0){IIOMetadataNode extensions=new IIOMetadataNode("ApplicationExtensions"),ext=new IIOMetadataNode("ApplicationExtension");ext.setAttribute("applicationID","NETSCAPE");ext.setAttribute("authenticationCode","2.0");ext.setUserObject(new byte[]{1,0,0});extensions.appendChild(ext);tree.appendChild(extensions);}
                meta.setFromTree(format,tree);writer.writeToSequence(new IIOImage(im,null,meta),null);
            }
            writer.endWriteSequence();
        }finally{writer.dispose();}
    }
    public static void main(String[] args)throws Exception{
        Path out=Path.of(args[0]);Files.createDirectories(out);IntroStory story=IntroStory.load();
        BufferedImage table=args.length>1?ImageIO.read(Path.of(args[1]).toFile()):null;
        var states=new LinkedHashMap<String,IntroPlayback>();
        states.put("01-black",state(story,"wake",0,false,false));states.put("02-eyes",state(story,"wake",4.7,false,false));
        states.put("03-dialogue",state(story,"contact",18,true,false));states.put("04-choice",state(story,"identity",22,true,true));
        states.put("05-long-text",state(story,"sealed",22,true,false));
        IntroPlayback end=state(story,"dawn",22,true,false);end.release=1.3;states.put("06-ending",end);
        BufferedImage sheet=new BufferedImage(1280,1140,BufferedImage.TYPE_INT_RGB);Graphics2D grid=sheet.createGraphics();grid.setColor(new Color(8,12,19));grid.fillRect(0,0,1280,1140);grid.setFont(new Font("Microsoft YaHei",Font.PLAIN,15));int index=0;
        for(var entry:states.entrySet()){
            BufferedImage im=image(entry.getValue(),640,360,2,table);ImageIO.write(im,"png",out.resolve(entry.getKey()+".png").toFile());
            int x=(index%2)*640,y=(index/2)*380;grid.drawImage(im,x,y+20,640,360,null);grid.setColor(new Color(138,156,170));grid.drawString(entry.getKey()+" / 离线 UI 预览",x+16,y+15);index++;
        }
        grid.dispose();ImageIO.write(sheet,"png",out.resolve("preview-sheet.png").toFile());
        ImageIO.write(image(state(story,"identity",22,true,true),320,180,3,table),"png",out.resolve("07-small.png").toFile());
        ImageIO.write(image(state(story,"sealed",22,true,false),854,360,2,table),"png",out.resolve("08-ultrawide.png").toFile());
        ImageIO.write(image(state(story,"wake",10.5,false,false),640,360,2,table),"png",out.resolve("09-third-person.png").toFile());
        gif(out.resolve("opening.gif"),story,table);
        System.out.println("Rendered 9 UI states and opening.gif using production IntroUi and PortraitFraming (scene/font/skin preview only).");
    }
}
