package creation.intro;

import net.minecraft.network.RegistryFriendlyByteBuf;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;

final class IntroPackets {
    record Manual() implements CustomPacketPayload {
        static final Type<Manual> TYPE=new Type<>(ResourceLocation.parse("poc_intro:manual"));
        static final StreamCodec<RegistryFriendlyByteBuf,Manual> CODEC=StreamCodec.of((b,p)->{},b->new Manual());
        @Override public Type<Manual> type(){return TYPE;}
    }
    record Scene(int phase,double x,double y,double z,float yaw,float pitch,String chapterStory) implements CustomPacketPayload {
        Scene(int phase,double x,double y,double z,float yaw){this(phase,x,y,z,yaw,10,"");}
        static final Type<Scene> TYPE=new Type<>(ResourceLocation.fromNamespaceAndPath("poc_intro","scene"));
        static final StreamCodec<RegistryFriendlyByteBuf,Scene> CODEC=StreamCodec.of(
            (b,p)->{b.writeVarInt(p.phase);b.writeDouble(p.x);b.writeDouble(p.y);b.writeDouble(p.z);b.writeFloat(p.yaw);b.writeFloat(p.pitch);b.writeUtf(p.chapterStory,32767);},
            b->new Scene(b.readVarInt(),b.readDouble(),b.readDouble(),b.readDouble(),b.readFloat(),b.readFloat(),b.readUtf(32767)));
        @Override public Type<Scene> type(){return TYPE;}
    }
    record Action(int action) implements CustomPacketPayload {
        static final Type<Action> TYPE=new Type<>(ResourceLocation.fromNamespaceAndPath("poc_intro","action"));
        static final StreamCodec<RegistryFriendlyByteBuf,Action> CODEC=StreamCodec.of((b,p)->b.writeVarInt(p.action),b->new Action(b.readVarInt()));
        @Override public Type<Action> type(){return TYPE;}
    }
}
