package creation.intro;

/** Pure time/pose functions, shared with the offline preview and tests. */
public final class IntroTimeline {
    private IntroTimeline() {}
    public static double smooth(double a, double b, double time) {
        double t = Math.clamp((time - a) / (b - a), 0, 1);
        return t * t * (3 - 2 * t);
    }
    public static double openness(double t) {
        if (t < 1.4) return 0;
        if (t < 2.9) return .28 * smooth(1.4, 2.9, t);
        if (t < 3.5) return .28 * (1 - smooth(2.9, 3.5, t));
        if (t < 5.1) return .68 * smooth(3.5, 5.1, t);
        if (t < 5.5) return .68 - .40 * smooth(5.1, 5.5, t);
        return .28 + .72 * smooth(5.5, 7, t);
    }
    public static float yaw(double t) {
        return (float)(-48 * smooth(7, 9, t) + 96 * smooth(9.4, 11.6, t) - 48 * smooth(12, 13.5, t));
    }
    public static float pitch(double t) {
        return (float)(35 * (1 - smooth(6.4, 8, t)) + 10 * smooth(12.3, 13.5, t));
    }
    public static double system(double t) { return smooth(13, 15, t); }
    public static double seatHeight(double release) { return .72 + .9 * smooth(0, 1.6, release); }
    public static double thirdPerson(double age){return smooth(7,9,age);}
    public record CameraPose(double x,double y,double z,float yaw,float pitch){}
    public static CameraPose camera(double age,double release,float baseYaw){
        double blend=thirdPerson(age),turn=Math.toRadians(baseYaw-180);
        double dx=3.6*Math.cos(turn)+4.4*Math.sin(turn),dz=3.6*Math.sin(turn)-4.4*Math.cos(turn);
        double rising=.9*smooth(0,1.6,Math.max(0,release));
        float orbitYaw=(float)Math.toDegrees(Math.atan2(dx,-dz));
        float orbitPitch=(float)Math.toDegrees(Math.atan2(2.35-.30,Math.hypot(dx,dz)));
        float startYaw=baseYaw+yaw(age);
        double delta=((orbitYaw-startYaw+540)%360)-180;
        return new CameraPose(dx*blend,seatHeight(Math.max(0,release))*(1-blend)+(2.35+rising)*blend,
            dz*blend,(float)(startYaw+delta*blend),(float)(pitch(age)*(1-blend)+orbitPitch*blend));
    }
}
