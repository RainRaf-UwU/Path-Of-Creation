package creation.matrix;

import java.util.*;
public final class MachineFxTest {
    private static void check(boolean b){if(!b)throw new AssertionError();}
    public static void main(String[] args){
        check(MachineFx.LAYOUTS.size()==16);
        var state=new MachineFx.State();state.flags=7;
        for(int i=0;i<30;i++)state.advance(.05);check(Math.abs(state.speed-1)<1e-8&&Math.abs(state.visibility-1)<1e-8);
        var sample=state.sample(.025);check(sample.time>state.time&&state.time<1.501);
        state.flags=3;for(int i=0;i<20;i++)state.advance(.05);check(state.speed<1e-8&&state.visibility>.999);
        state.flags=0;for(int i=0;i<20;i++)state.advance(.05);check(state.visibility<1e-8);
        for(var l:MachineFx.LAYOUTS){
            check(l.pattern.stream().allMatch(f->f.size()==l.pattern.getFirst().size()&&f.stream().allMatch(s->s.length()==l.pattern.getFirst().getFirst().length())));
            int[] count={0};state.flags=7;state.visibility=1;state.speed=1;
            for(double t:new double[]{0,1.5,3,6}){state.time=t;state.angle=t*3;MachineFxScene.emit(l.effect,l.radius,l.color,state,(x,y,z,r,g,b,a)->{check(Double.isFinite(x+y+z)&&Float.isFinite(a));check(Math.abs(x)<l.radius*2&&Math.abs(y)<l.radius*2&&Math.abs(z)<l.radius*2);check(a>=0&&a<=1);count[0]++;});}
            check(count[0]>0&&count[0]%4==0);
        }
        System.out.println("PASS machine FX: 16 layouts; bounded finite production meshes; 1.5s startup; 1s braking; partial-tick sampling; shutdown fade");
    }
}
