package creation.intro;

import com.mojang.logging.LogUtils;
import org.slf4j.Logger;
import net.neoforged.fml.common.Mod;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;

@Mod("poc_intro")
public final class IntroMod {
    public static final FreshWorldGate BIRTHS=new FreshWorldGate();
    static final Logger LOG=LogUtils.getLogger();
    public IntroMod(IEventBus bus) {
        bus.addListener(RegisterPayloadHandlersEvent.class,event->{
            var registrar=event.registrar("1");
            registrar.playToClient(IntroPackets.Scene.TYPE,IntroPackets.Scene.CODEC,
                (packet,context)->context.enqueueWork(()->ClientIntro.receive(packet)));
            registrar.playToServer(IntroPackets.Action.TYPE,IntroPackets.Action.CODEC,
                (packet,context)->context.enqueueWork(()->IntroServer.action(context.player(),packet.action())));
        });
        IntroServer.register();
        LOG.info("[POC Intro] New-world prologue loaded; existing worlds are never enrolled");
    }
}
