package creation.matrix;

import java.util.*;

/** 粒子发射位置：上升烟柱、环形翻滚的菌盖和顶端穹顶，共用离线预览。 */
public final class MushroomShape {
    public record Point(double x,double y,double z) { }
    public static List<Point> points(int ticks){
        double growth=Math.min(1,ticks/200.0),height=12+68*growth,radius=5+39*growth;
        var points=new ArrayList<Point>();
        for(int i=0;i<12;i++){
            double a=i*2*Math.PI/12+ticks*.007,y=height*(i+.5)/12;
            double r=2+5*growth+3*Math.sin(y*.08);
            points.add(new Point(Math.cos(a)*r,y,Math.sin(a)*r));
        }
        for(int i=0;i<24;i++){
            double a=i*2*Math.PI/24+ticks*.003;
            double r=radius*(.78+.16*Math.sin(i*1.7+ticks*.025));
            points.add(new Point(Math.cos(a)*r,height+Math.sin(i*1.7+ticks*.025)*6*growth,Math.sin(a)*r));
        }
        for(int i=0;i<12;i++){
            double a=i*2*Math.PI/12;
            points.add(new Point(Math.cos(a)*radius*.45,height+radius*.28,Math.sin(a)*radius*.45));
        }
        return points;
    }
}
