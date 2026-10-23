package creation.matrix;

/** 20 TPS 热量模型；任何运行冷却缺口都会升温，满额供液才主动降温。 */
public final class HeatModel {
    public static final double MAX_HEAT=10000,DRY_SECONDS=120;
    public static final int TANK_CAPACITY=64000,COOLANT_PER_TICK=5;
    public double heat;
    public boolean detonated;
    public int step(boolean running,int available){
        if(detonated)return 0;
        int demand=running?COOLANT_PER_TICK:heat>0?1:0;
        int used=Math.min(demand,Math.max(0,available));
        if(running)heat+=used<demand?MAX_HEAT/(DRY_SECONDS*20)*(1-(double)used/demand):-6;
        else heat-=used>0?5:1.25;
        heat=Math.max(0,Math.min(MAX_HEAT,heat));
        if(heat>=MAX_HEAT-1e-7){heat=MAX_HEAT;detonated=true;}
        return used;
    }
    public double fraction(){return Math.max(0,Math.min(1,heat/MAX_HEAT));}
    public static int alarmInterval(double fraction){return fraction<.4?Integer.MAX_VALUE:(int)Math.round(60-55*Math.min(1,(fraction-.4)/.6));}
    public static float alarmPitch(double fraction){return (float)(.7+Math.max(0,Math.min(1,fraction)));}
}
