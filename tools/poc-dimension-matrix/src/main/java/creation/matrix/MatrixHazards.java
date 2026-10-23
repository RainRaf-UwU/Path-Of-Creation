package creation.matrix;

import net.minecraft.core.registries.Registries;
import net.minecraft.resources.*;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.damagesource.*;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.phys.Vec3;

public final class MatrixHazards {
    public static final ResourceKey<DamageType> TYPE=ResourceKey.create(Registries.DAMAGE_TYPE,ResourceLocation.parse("poc_dimension_matrix:dimensional_shear"));
    public static DamageSource source(ServerLevel level,Vec3 center){return new DamageSource(level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE).getHolderOrThrow(TYPE),center);}
    /** 直接扣实际生命，吸收心、抗性、护甲、伤害冷却及创造免伤不参与计算。 */
    public static void damage(Player player,float amount,DamageSource source){
        if(!player.isAlive()||player.isRemoved())return;
        float damage=Math.min(player.getHealth(),amount);
        player.getCombatTracker().recordDamage(source,damage);
        player.setHealth(Math.max(0,player.getHealth()-damage));
        ((ServerLevel)player.level()).broadcastDamageEvent(player,source);
        if(player.getHealth()<=0)player.die(source);
    }
}
