package creation.matrix;

import com.google.gson.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import net.minecraft.core.Direction;

public final class PortTest {
    private static void check(boolean value){if(!value)throw new AssertionError();}
    private static final class Storage implements PortTransfer.Buffer {
        int energy,capacity;Storage(int energy,int capacity){this.energy=energy;this.capacity=capacity;}
        public int receive(int value,boolean simulate){int v=Math.min(value,capacity-energy);if(!simulate)energy+=v;return v;}
        public int extract(int value,boolean simulate){int v=Math.min(value,energy);if(!simulate)energy-=v;return v;}
    }
    public static void main(String[] args)throws Exception{
        check(PortLayout.outward(Direction.SOUTH,true)==Direction.WEST);
        check(PortLayout.outward(Direction.SOUTH,false)==Direction.EAST);
        check(PortLayout.outward(Direction.NORTH,true)==Direction.EAST);
        for(var front:Direction.Plane.HORIZONTAL)for(boolean input:new boolean[]{true,false}){
            for(int depth=1;depth<=9;depth++)for(int height=0;height<=8;height++){
                var pos=PortLayout.offset(front,input,depth,height);
                check(PortLayout.accepts(front,input,pos.getX(),pos.getY(),pos.getZ()));
                check(!PortLayout.accepts(front,!input,pos.getX(),pos.getY(),pos.getZ()));
            }
            for(int depth:new int[]{0,10}){var pos=PortLayout.offset(front,input,depth,4);check(!PortLayout.accepts(front,input,pos.getX(),pos.getY(),pos.getZ()));}
            for(int height:new int[]{-1,9}){var pos=PortLayout.offset(front,input,4,height);check(!PortLayout.accepts(front,input,pos.getX(),pos.getY(),pos.getZ()));}
        }
        var data=JsonParser.parseReader(new InputStreamReader(PortTest.class.getResourceAsStream("/dimension-matrix-structure.json"),StandardCharsets.UTF_8)).getAsJsonObject();
        var base=data.getAsJsonArray("base_pattern");var pattern=data.getAsJsonArray("pattern");var keys=data.getAsJsonObject("keys");int slots=0;
        for(int y=0;y<11;y++)for(int z=0;z<11;z++)for(int x=0;x<11;x++){
            char old=base.get(y).getAsJsonArray().get(z).getAsString().charAt(x);
            char symbol=pattern.get(y).getAsJsonArray().get(z).getAsString().charAt(x);
            if((x==0||x==10)&&y>=1&&y<=9&&z>=1&&z<=9){
                slots++;var choices=keys.getAsJsonArray(String.valueOf(symbol));check(choices.size()==2);
                check(choices.get(0).getAsString().equals(keys.get(String.valueOf(old)).getAsString()));
                check(choices.get(1).getAsString().equals("poc_dimension_matrix:energy_"+(x==0?"input":"output")+"_port"));
            }else if(z==0&&x>=1&&x<=9&&y>=1&&y<=9){
                var choices=keys.getAsJsonArray(String.valueOf(symbol));check(choices.size()==2);
                check(choices.get(0).getAsString().equals(keys.get(String.valueOf(old)).getAsString()));
                check(choices.get(1).getAsString().equals("poc_dimension_matrix:coolant_input_port"));
            }else check(old==symbol);
        }check(slots==162);
        var storage=new Storage(0,10_000_000);var budget=new PortTransfer();
        check(budget.transfer(storage,true,-1,false,0)==0&&storage.energy==0);
        check(budget.transfer(storage,true,700000,true,0)==700000&&storage.energy==0);
        check(budget.transfer(storage,true,700000,false,0)==700000&&storage.energy==700000);
        check(budget.transfer(storage,true,700000,true,0)==300000&&storage.energy==700000);
        check(budget.transfer(storage,true,700000,false,0)==300000&&storage.energy==1000000);
        check(budget.transfer(storage,true,1,false,0)==0);
        check(budget.transfer(storage,false,600000,true,0)==600000&&storage.energy==1000000);
        check(budget.transfer(storage,false,600000,false,0)==600000&&storage.energy==400000);
        check(budget.transfer(storage,true,1000000,false,1)==1000000&&storage.energy==1400000);
        check(budget.transfer(storage,false,Integer.MAX_VALUE,false,1)==1000000&&storage.energy==400000);
        var nearFull=new Storage(9999999,10000000);check(new PortTransfer().transfer(nearFull,true,1000,false,0)==1);
        Storage source=new Storage(50000,100000),sink=new Storage(99000,100000);
        check(PortTransfer.push(source,sink::receive)==1000&&source.energy==49000&&sink.energy==100000);
        int total=source.energy+sink.energy;check(total==149000);
        check(PortTransfer.push(source,sink::receive)==0&&source.energy+sink.energy==total);
        source=new Storage(50000,100000);Storage changing=new Storage(0,100000);
        check(PortTransfer.push(source,(amount,simulate)->simulate?amount:changing.receive(Math.min(10,amount),false))==10);
        check(source.energy==49990&&changing.energy==10);
        System.out.println("PASS ports: all four facings / 162 optional wall cells / wrong side and edge rejection / shared per-tick limits / simulation / backpressure / refund / energy conservation");
    }
}
