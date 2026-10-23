package creation.matrix;

/** 与转子共用实际速度；连续配方不重启循环，首次观察机器不补播通电提示。 */
public final class AudioPhase {
    public enum Phase { SILENT, ACCELERATING, FULL_SPEED, DECELERATING }
    private boolean observed, powered;
    public boolean powerOn(boolean next) {
        boolean edge=observed && !powered && next;
        observed=true;powered=next;return edge;
    }
    public static Phase phase(Rotor rotor) {
        if(rotor.speed<0.0001)return Phase.SILENT;
        if(!rotor.running)return Phase.DECELERATING;
        return rotor.speed>=Rotor.MAX_SPEED-0.0001?Phase.FULL_SPEED:Phase.ACCELERATING;
    }
    public static float pitch(Rotor rotor) {
        return (float)(0.65+0.75*Math.max(0,Math.min(1,rotor.speed/Rotor.MAX_SPEED)));
    }
    public static float volume(Rotor rotor) {
        return (float)(0.22+0.35*Math.sqrt(Math.max(0,Math.min(1,rotor.speed/Rotor.MAX_SPEED))));
    }
}
