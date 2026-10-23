package creation.matrix;

public final class RotorTest {
    private static void equal(double a, double b) { if (Math.abs(a-b)>0.00001) throw new AssertionError(a+" != "+b); }
    public static void main(String[] args) {
        Rotor rotor = new Rotor();
        rotor.advance(2, true, false); equal(rotor.speed,0); equal(rotor.visibility,0.5);
        rotor.advance(2, true, false); equal(rotor.visibility,1);
        for (int i=0;i<80;i++) rotor.advance(0.05,true,true);
        equal(rotor.speed,1440); equal(rotor.angle,2880);
        double angle = rotor.angle;
        rotor.sample(0.03); equal(rotor.angle,angle);
        rotor.advance(10,true,true); equal(rotor.angle,17280); equal(rotor.speed,1440);
        for (int i=0;i<60;i++) rotor.advance(0.05,true,false);
        equal(rotor.speed,0); equal(rotor.angle,19440); equal(rotor.visibility,1);
        rotor.advance(10,true,false); equal(rotor.angle,19440);
        rotor.advance(1.5,false,false); equal(rotor.visibility,0.5);
        rotor.advance(1.5,false,false); equal(rotor.visibility,0);
        Rotor big = new Rotor(); big.advance(20,true,true);
        Rotor small = new Rotor(); for(int i=0;i<400;i++) small.advance(0.05,true,true);
        equal(big.speed,small.speed); equal(big.angle,small.angle);
        big.advance(20,false,false); for(int i=0;i<400;i++) small.advance(0.05,false,false);
        equal(big.speed,small.speed); equal(big.angle,small.angle);
        Rotor interrupted=new Rotor(); interrupted.advance(3,true,true);
        interrupted.advance(0.5,true,false); double before=interrupted.speed;
        interrupted.advance(0.05,true,true); equal(interrupted.speed,before+Rotor.ACCEL*0.05);
        System.out.println("Rotor: 4s fade-in / 3s fade-out / 4s acceleration / 240rpm / 3s braking / restart / frame independence passed");
    }
}
