package creation.matrix;

/** 所有接口共用的每tick额度；模拟请求不预占额度或修改储能。 */
public final class PortTransfer {
    @FunctionalInterface public interface Receiver {int receive(int amount,boolean simulate);}
    public interface Buffer {
        int receive(int amount, boolean simulate);
        int extract(int amount, boolean simulate);
    }
    private long inputTick=Long.MIN_VALUE, outputTick=Long.MIN_VALUE;
    private int inputUsed,outputUsed;
    public static int push(Buffer source,Receiver receiver){
        int offered=source.extract(PortLayout.RATE,true);if(offered<=0)return 0;
        int accepted=Math.max(0,Math.min(offered,receiver.receive(offered,true)));if(accepted<=0)return 0;
        int reserved=source.extract(accepted,false);if(reserved<=0)return 0;
        int delivered=Math.max(0,Math.min(reserved,receiver.receive(reserved,false)));
        if(delivered<reserved)source.receive(reserved-delivered,false);
        return delivered;
    }
    public int transfer(Buffer buffer,boolean input,int requested,boolean simulate,long tick) {
        if(requested<=0)return 0;
        int used=(input ? inputTick : outputTick)==tick ? (input ? inputUsed : outputUsed) : 0;
        int amount=Math.min(requested,PortLayout.RATE-used);
        if(amount<=0)return 0;
        int moved=input ? buffer.receive(amount,simulate) : buffer.extract(amount,simulate);
        if(moved<0 || moved>amount)throw new IllegalStateException("Invalid energy storage response");
        if(!simulate && moved>0) {
            if(input){inputTick=tick;inputUsed=used+moved;}
            else{outputTick=tick;outputUsed=used+moved;}
        }
        return moved;
    }
}
