package creation.intro;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import javax.imageio.ImageIO;

/** Shared production dialogue drawing on a neutral, explicitly offline background. */
public final class ChapterPreview {
    public static void main(String[] args)throws Exception{
        Path output=Path.of(args[0]);Files.createDirectories(output);IntroStory story=IntroStory.load("chapter1.json");
        for(String name:new String[]{"complaint","comfort","duplicate","question","narrow-en"}){
            boolean narrow=name.equals("narrow-en");int w=narrow?320:640,h=narrow?180:360,scale=narrow?3:2;
            var p=new IntroPlayback(story,!narrow,()->{});p.begun=true;p.age=18;p.node=story.node(narrow?"question":name);p.shown=p.length();p.choiceShown=p.choiceLength();
            BufferedImage image=new BufferedImage(w*scale,(h+20)*scale,BufferedImage.TYPE_INT_RGB);Graphics2D g=image.createGraphics();g.scale(scale,scale);g.translate(0,20);
            g.setPaint(new GradientPaint(0,0,new Color(12,24,38),w,h,new Color(24,45,53)));g.fillRect(0,0,w,h);
            var canvas=new PreviewMain.Surface(g);IntroUi.draw(canvas,w,h,p,-1,-1);
            g.translate(0,-20);
            canvas.text(narrow?"OFFLINE PREVIEW / NOT A GAME SCREENSHOT":"离线排版预览 · 背景为示意，并非游戏截图",8,5,IntroUi.MUTED);
            g.dispose();ImageIO.write(image,"png",output.resolve(name+".png").toFile());
        }
        System.out.println("PASS chapter dialogue previews generated: "+output);
    }
}
