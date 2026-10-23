package creation.matrix;

/** 每游戏tick积分，帧间采样不修改状态；暂停游戏时转子也暂停。 */
public final class Rotor {
    public static final double MAX_SPEED = HologramStyle.MAX_SPEED;
    public static final double ACCEL = MAX_SPEED / HologramStyle.SPIN_UP;
    public static final double BRAKE = MAX_SPEED / HologramStyle.SPIN_DOWN;
    public double angle, speed, visibility, time;
    public boolean powered, running;

    public void advance(double seconds, boolean powered, boolean running) {
        time += seconds;
        this.powered = powered;
        this.running = powered && running;
        double target = this.running ? MAX_SPEED : 0;
        double acceleration = this.running ? ACCEL : -BRAKE;
        double ramp = Math.min(seconds, Math.abs(target - speed) / Math.abs(acceleration));
        double next = this.running ? Math.min(target, speed + ACCEL * seconds)
                                  : Math.max(0, speed - BRAKE * seconds);
        angle += speed * ramp + acceleration * ramp * ramp / 2
                + next * (seconds - ramp);
        speed = next;
        visibility = Math.max(0, Math.min(1, visibility + (powered ? seconds / HologramStyle.FADE_IN : -seconds / HologramStyle.FADE_OUT)));
    }

    public Rotor sample(double seconds) {
        Rotor copy = new Rotor();
        copy.angle = angle; copy.speed = speed; copy.visibility = visibility; copy.time = time;
        copy.advance(seconds, powered, running);
        return copy;
    }
}
