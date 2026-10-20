package creation.intro;

/** Matches InventoryScreen's translate/scale/rotateZ(PI) projection, with the head inside the crop. */
public final class PortraitFraming {
    private PortraitFraming() {}
    public record Frame(IntroUi.Box box,int scale,float offset,float entityHeight) {
        public double modelCenter(){return entityHeight*.5+offset;}
        public double screenY(double modelY){return box.y()+box.h()*.5+scale*(modelCenter()-modelY);}
    }
    public static Frame fit(IntroUi.Box box,float unscaledEntityHeight){
        int scale=Math.max(1,Math.min((int)(box.w()*.82),(int)(box.h()*.8/1.3)));
        // Include the outer skin layer above the 1.875-block vanilla player model.
        double center=1.95-(box.h()*.4)/scale;
        return new Frame(box,scale,(float)(center-unscaledEntityHeight*.5),unscaledEntityHeight);
    }
}
