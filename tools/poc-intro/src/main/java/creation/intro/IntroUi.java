package creation.intro;

import java.util.*;

/** A single layout/drawing source for the native game screen and headless UI acceptance images. */
public final class IntroUi {
    public interface Canvas {
        void rect(int x, int y, int w, int h, int argb);
        void line(double x1, double y1, double x2, double y2, int argb);
        void text(String value, int x, int y, int argb);
        int width(String value);
        void portrait(Box box, boolean player);
    }
    public record Box(int x, int y, int w, int h) {
        public boolean contains(double px, double py) { return px >= x && px < x+w && py >= y && py < y+h; }
    }
    public record Layout(Box panel, Box portrait, List<String> lines, List<Box> choices, int pageCount, int linesPerPage) {}
    public static final int CYAN=0xff79dedf, GOLD=0xffddbb86, TEXT=0xffe8eff1, MUTED=0xff8a9caa;
    public static List<String> wrap(String text, int width, Canvas c) {
        var lines = new ArrayList<String>(); StringBuilder line = new StringBuilder();
        for (int point : text.codePoints().toArray()) {
            String next = new String(Character.toChars(point));
            if (point == '\n' || (!line.isEmpty() && c.width(line + next) > width)) {
                lines.add(line.toString().stripTrailing()); line.setLength(0);
                if (point == '\n') continue;
            }
            if (line.isEmpty() && point == ' ') continue;
            line.append(next);
        }
        if (!line.isEmpty()) lines.add(line.toString());
        return lines;
    }
    public static Layout layout(Canvas c, int w, int h, IntroPlayback p) {
        int total=Math.min(800,w-2*Math.max(12,(int)(w*.06))), ph=94;
        int left=(w-total)/2, portraitWidth=Math.clamp((int)(w*.2),64,128);
        int portraitHeight=portraitWidth*3/2, pw=total-portraitWidth-8;
        Box portrait=new Box(left,h-12-portraitHeight,portraitWidth,portraitHeight);
        Box panel=new Box(left+portraitWidth+8,h-12-ph,pw,ph);
        var lines=wrap(p.text(),pw-32,c);
        int pages=Math.max(1,(lines.size()+2)/3);
        var choices=new ArrayList<Box>();
        if (!p.node.options().isEmpty() && p.shown==p.length() && p.page+1>=pages) {
            int y=panel.y()-8;
            var options=p.node.options();
            for (int i=options.size()-1;i>=0;i--) {
                int height=Math.max(24,wrap(p.choiceText(options.get(i)),pw-40,c).size()*12+12);
                y-=height; choices.add(0,new Box(panel.x(),y,pw,height)); y-=4;
            }
        }
        return new Layout(panel,portrait,lines,choices,pages,3);
    }
    public static Layout draw(Canvas c, int w, int h, IntroPlayback p, double mx, double my) {
        Layout l=layout(c,w,h,p);
        if (!p.begun) { c.rect(0,0,w,h,0xff000000); return l; }
        c.rect(0,0,w,h,0x30030913);
        c.rect(0,0,w,Math.max(10,h/24),0xff03060d);
        c.rect(0,h-Math.max(10,h/24),w,Math.max(10,h/24),0xff03060d);
        if (p.age>7 && h>=240) {
            c.text(p.label("prologue"),Math.max(16,(int)(w*.06)),30,MUTED);
            c.rect(Math.max(16,(int)(w*.06)),46,24,1,GOLD);
        }
        if (p.age>=13 && l.choices().isEmpty()) core(c,w/2,Math.min(l.panel().y()-40,(int)(h*.37)),p.age);
        if (p.release>=0) {
            int alpha=(int)(255*IntroTimeline.smooth(0,1.25,p.release));
            c.rect(0,0,w,h,(alpha<<24)|0x050913);
            if (p.release>.65) {
                center(c,p.label("release"),w,h/2-18,GOLD);
                center(c,p.label("releaseSub"),w,h/2+3,TEXT);
            }
            return l;
        }
        if (p.age>=15) {
            if(p.node.speaker().equals("self"))c.portrait(l.portrait(),true);
            else systemPortrait(c,l.portrait(),p.age);
            panel(c,p,l,mx,my);
        }
        double open=IntroTimeline.openness(p.age);
        if (open<1) {
            int gap=(int)Math.round(open*h),top=(h-gap)/2,bottom=top+gap;
            c.rect(0,0,w,top,0xff000000);
            c.rect(0,bottom,w,h-bottom,0xff000000);
            if(gap>0){c.rect(0,top,w,1,0xb0000000);c.rect(0,bottom-1,w,1,0xb0000000);}
        }
        return l;
    }
    private static void panel(Canvas c, IntroPlayback p, Layout l, double mx,double my) {
        Box b=l.panel(); int accent=p.node.speaker().equals("system")?CYAN:GOLD;
        c.rect(b.x(),b.y(),b.w(),b.h(),0xf20a1422); frame(c,b,0xff426175);
        c.rect(b.x(),b.y(),2,b.h(),accent);
        c.text(p.label(p.node.speaker()),b.x()+16,b.y()+12,accent);
        c.rect(b.x()+16,b.y()+25,b.w()-32,1,0xff263947);
        int start=p.page*3;
        // Wrap visible text using the same character/line rules as the full page layout.
        var visible=wrap(p.visible(),b.w()-32,c);
        for(int i=0;i<3 && start+i<visible.size();i++) c.text(visible.get(start+i),b.x()+16,b.y()+33+i*14,TEXT);
        String hint=p.label(p.shown<p.length()?"typing":(!l.choices().isEmpty()?(p.choicesReady()?"choose":"choiceTyping"):"continue"));
        c.text(hint,b.x()+b.w()-16-c.width(hint),b.y()+80,MUTED);
        if(l.pageCount()>1) c.text((p.page+1)+" / "+l.pageCount(),b.x()+16,b.y()+80,MUTED);
        int remaining=p.choiceShown;
        for(int i=0;i<l.choices().size();i++) {
            Box option=l.choices().get(i); boolean focus=p.choicesReady()&&i==p.selected;
            c.rect(option.x(),option.y(),option.w(),option.h(),focus?0xf21b3848:0xf20a1422);
            frame(c,option,focus?CYAN:0xff426175); c.rect(option.x()+10,option.y()+option.h()/2-2,4,4,focus?CYAN:MUTED);
            String text=p.choiceText(p.node.options().get(i)); int count=text.codePointCount(0,text.length());
            String reveal=text.substring(0,text.offsetByCodePoints(0,Math.clamp(remaining,0,count))); remaining-=count;
            int y=option.y()+7; for(String line:wrap(reveal,option.w()-40,c)){c.text(line,option.x()+24,y,focus?TEXT:MUTED);y+=12;}
        }
    }
    private static void center(Canvas c,String text,int w,int y,int color){c.text(text,(w-c.width(text))/2,y,color);}
    private static void systemPortrait(Canvas c,Box b,double time){
        double x=b.x()+b.w()*.5,y=b.y()+b.h()*.46,rx=b.w()*.27,ry=b.h()*.24;
        int faint=0x9979dedf,bright=0xffb3f5f0;
        // A non-humanoid crystal intelligence: asymmetric facets and tilted orbital rings, no face or body.
        c.line(x,y-ry,x+rx,y,bright);c.line(x+rx,y,x,y+ry,CYAN);
        c.line(x,y+ry,x-rx,y,faint);c.line(x-rx,y,x,y-ry,CYAN);
        c.line(x,y-ry,x+rx*.28,y+ry*.1,bright);c.line(x+rx*.28,y+ry*.1,x,y+ry,bright);
        c.line(x-rx,y,x+rx*.28,y+ry*.1,faint);c.line(x+rx*.28,y+ry*.1,x+rx,y,CYAN);
        for(int ring=0;ring<3;ring++){
            double radius=b.w()*(.39-ring*.055),cy=y+(ring-1)*b.h()*.14;
            for(int i=0;i<100;i++){
                if((i/10+ring)%4==2)continue;
                double a=i*Math.PI/50+time*(ring%2==0?.11:-.13),a2=a+Math.PI/50;
                c.line(x+Math.cos(a)*radius,cy+Math.sin(a)*radius*.25-Math.cos(a)*radius*.15,
                    x+Math.cos(a2)*radius,cy+Math.sin(a2)*radius*.25-Math.cos(a2)*radius*.15,ring==1?CYAN:faint);
            }
        }
        c.rect((int)x-2,(int)y-2,5,5,bright);
        c.line(x,y+ry+8,x,y+ry+20,faint);
        for(int i=0;i<3;i++){int px=b.x()+8+i*8,py=b.y()+b.h()-16;c.rect(px,py,4,1,i==0?GOLD:faint);}
    }
    private static void frame(Canvas c,Box b,int color){c.rect(b.x(),b.y(),b.w(),1,color);c.rect(b.x(),b.y()+b.h()-1,b.w(),1,color);c.rect(b.x(),b.y(),1,b.h(),color);c.rect(b.x()+b.w()-1,b.y(),1,b.h(),color);}
    private static void core(Canvas c,int x,int y,double t) {
        double a=IntroTimeline.system(t); int color=((int)(255*a)<<24)|(CYAN&0xffffff);
        for(int ring=0;ring<2;ring++) {
            int radius=ring==0?23:31;
            for(int i=0;i<80;i++){if((i/8)%3==1)continue;double r=i*Math.PI/40+t*(ring==0?.14:-.09),r2=r+Math.PI/40;
                c.line(x+Math.cos(r)*radius,y+Math.sin(r)*radius*.72,x+Math.cos(r2)*radius,y+Math.sin(r2)*radius*.72,color);}
        }
        double r=10+Math.sin(t*1.6)*1.5;
        c.line(x,y-r,x+r,y,color);c.line(x+r,y,x,y+r,color);c.line(x,y+r,x-r,y,color);c.line(x-r,y,x,y-r,color);
        c.rect(x-1,y-1,3,3,color);c.line(x,y+25,x,y+37,0x6679dedf);
    }
}
