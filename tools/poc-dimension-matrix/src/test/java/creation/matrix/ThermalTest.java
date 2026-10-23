package creation.matrix;

import java.util.*;

public final class ThermalTest {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    public static void main(String[] args){
        var dry=new HeatModel();
        for(int tick=1;tick<=2400;tick++){check(dry.step(true,0)==0);check(dry.detonated==(tick==2400));}
        check(dry.heat==HeatModel.MAX_HEAT);check(dry.step(true,100)==0);
        var cooled=new HeatModel();int used=0;for(int tick=0;tick<1200;tick++)used+=cooled.step(true,5);
        check(used==6000&&cooled.heat==0&&!cooled.detonated);
        cooled.heat=8000;cooled.step(true,5);check(cooled.heat==7994);
        for(int supplied=0;supplied<5;supplied++){var partial=new HeatModel();double old=partial.heat;check(partial.step(true,supplied)==supplied);check(partial.heat>old);}
        double previous=cooled.heat;cooled.step(false,0);check(cooled.heat<previous);previous=cooled.heat;check(cooled.step(false,1)==1&&cooled.heat<previous-1.25);
        check(HeatModel.alarmInterval(.39)==Integer.MAX_VALUE);int interval=1000;
        for(int i=40;i<=100;i++){int next=HeatModel.alarmInterval(i/100.0);check(next<=interval&&next>=5);interval=next;}
        check(HeatModel.alarmPitch(.95)>HeatModel.alarmPitch(.4));
        check(ThermalScene.color(0)[2]>ThermalScene.color(0)[0]);check(ThermalScene.color(1)[0]>ThermalScene.color(1)[2]);
        check(ThermalScene.shake(.99)>ThermalScene.shake(.5)*3);
        for(double heat:new double[]{0,.5,.95,1}){
            int[] vertices={0};ThermalScene.emit(100,1440,12,1,heat,new double[]{0,0,1},(x,y,z,r,g,b,a)->{
                check(Double.isFinite(x)&&Double.isFinite(y)&&Double.isFinite(z));check(Math.abs(x)<5.5&&y>=-4.5&&y<5.5&&Math.abs(z)<5.5);
                check(r>=0&&r<=1&&g>=0&&g<=1&&b>=0&&b<=1&&a>=0&&a<=1);vertices[0]++;
            });check(vertices[0]>9388&&vertices[0]<16000);
        }
        for(int tick:new int[]{0,200,600,900}){var points=MushroomShape.points(tick);check(points.size()==48);check(points.stream().allMatch(p->Double.isFinite(p.x())&&p.y()>=0&&p.y()<100&&Math.hypot(p.x(),p.z())<=45));}
        System.out.println("PASS thermal: 120s dry limit / 6000mB per 60s recipe / every partial deficit heats / active and passive cooling / escalating alarm / blue-red tint / thermal shake / four emitter beams / mushroom geometry");
    }
}
