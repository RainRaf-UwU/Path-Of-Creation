package creation.matrix;

public final class AudioTest {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    public static void main(String[] args){
        var edge=new AudioPhase();check(!edge.powerOn(true));check(!edge.powerOn(true));check(!edge.powerOn(false));check(edge.powerOn(true));check(!edge.powerOn(true));
        var rotor=new Rotor();check(AudioPhase.phase(rotor)==AudioPhase.Phase.SILENT);
        double previous=0;
        for(int tick=1;tick<=80;tick++){
            rotor.advance(.05,true,true);check(rotor.speed>=previous);previous=rotor.speed;
            check(AudioPhase.phase(rotor)==(tick==80?AudioPhase.Phase.FULL_SPEED:AudioPhase.Phase.ACCELERATING));
            check(AudioPhase.pitch(rotor)>=.65&&AudioPhase.pitch(rotor)<=1.401);
        }
        for(int tick=0;tick<400;tick++){rotor.advance(.05,true,true);check(AudioPhase.phase(rotor)==AudioPhase.Phase.FULL_SPEED);}
        for(int tick=1;tick<=60;tick++){
            rotor.advance(.05,true,false);check(rotor.speed<=previous);previous=rotor.speed;
            check(AudioPhase.phase(rotor)==(tick==60?AudioPhase.Phase.SILENT:AudioPhase.Phase.DECELERATING));
        }
        rotor.advance(1,true,true);rotor.advance(.1,false,false);check(AudioPhase.phase(rotor)==AudioPhase.Phase.DECELERATING);
        rotor.advance(.05,true,true);check(AudioPhase.phase(rotor)==AudioPhase.Phase.ACCELERATING);
        System.out.println("PASS audio: startup edge / no join replay / 4s ramp / sustained maximum / 3s brake / interrupted resume / speed-linked pitch");
    }
}
