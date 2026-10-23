package creation.compat.lychee;

import creation.compat.lychee.mixin.JeiRvHelperMixin;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import mezz.jei.api.ingredients.IIngredientTypeWithSubtypes;
import mezz.jei.api.recipe.RecipeIngredientRole;
import mezz.jei.api.runtime.IIngredientManager;
import mezz.jei.common.platform.IPlatformFluidHelperInternal;
import mezz.jei.library.focus.Focus;
import mezz.jei.library.plugins.vanilla.ingredients.fluid.FluidIngredientHelper;
import net.minecraft.world.level.material.FlowingFluid;
import net.minecraft.world.level.material.Fluid;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;
import snownee.lychee.util.ui.InputAction;
import sun.misc.Unsafe;

/** Executes the production hooks and installed JEI validation without booting Minecraft. */
public final class FluidQueryTest {
    record Stack(Fluid fluid, long amount) {}
    static final class Probe extends JeiRvHelperMixin {}
    static final class Helper extends FluidIngredientHelper<Stack> {
        private Helper() { super(null, null, null); }
        @Override public String getErrorInfo(Stack value) { return "FluidStack[amount=" + value.amount + "]"; }
    }
    private static int assertions;
    private static void check(boolean value, String message) {
        assertions++;
        if (!value) throw new AssertionError(message);
    }
    private static void set(Object object, String name, Object value) throws Exception {
        Field field = FluidIngredientHelper.class.getDeclaredField(name);
        field.setAccessible(true);
        field.set(object, value);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    public static void main(String[] ignored) throws Exception {
        // Bypass the helper's registry lookup, not its real isValidIngredient implementation.
        Field field = Unsafe.class.getDeclaredField("theUnsafe");
        field.setAccessible(true);
        Unsafe unsafe = (Unsafe) field.get(null);
        Helper helper = (Helper) unsafe.allocateInstance(Helper.class);
        IIngredientTypeWithSubtypes<Fluid, Stack> type = (IIngredientTypeWithSubtypes) Proxy.newProxyInstance(
                FluidQueryTest.class.getClassLoader(), new Class<?>[]{IIngredientTypeWithSubtypes.class}, (p, m, a) -> switch (m.getName()) {
                    case "getIngredientClass" -> Stack.class;
                    case "getBaseClass" -> Fluid.class;
                    case "getBase" -> ((Stack) a[0]).fluid;
                    case "toString" -> "TestFluidStack";
                    default -> throw new UnsupportedOperationException(m.getName());
                });
        Object platform = Proxy.newProxyInstance(FluidQueryTest.class.getClassLoader(),
                new Class<?>[]{IPlatformFluidHelperInternal.class}, (p, m, a) -> switch (m.getName()) {
                    case "isEmpty" -> a[0] == null;
                    default -> throw new UnsupportedOperationException(m.getName());
                });
        set(helper, "platformFluidHelper", platform);
        set(helper, "fluidType", type);
        IIngredientManager manager = (IIngredientManager) Proxy.newProxyInstance(FluidQueryTest.class.getClassLoader(),
                new Class<?>[]{IIngredientManager.class}, (p, m, a) -> switch (m.getName()) {
                    case "getIngredientHelper" -> helper;
                    default -> throw new UnsupportedOperationException(m.getName());
                });
        Method normalize = JeiRvHelperMixin.class.getDeclaredMethod("poc$sourceFluid", Fluid.class);
        Method guard = JeiRvHelperMixin.class.getDeclaredMethod("poc$validFluidQuery", Fluid.class,
                InputAction.Direct.class, CallbackInfoReturnable.class);
        normalize.setAccessible(true);
        guard.setAccessible(true);
        Probe probe = new Probe();
        InputAction.Direct[] actions = {InputAction.Direct.SHOW_RECIPES, InputAction.Direct.SHOW_USAGES};
        for (String name : new String[]{"water", "lava", "void_fluid", "transmutation_fluid", "copy_fluid", "atomic_reconstruct_fluid"}) {
            Fluid source = new FlowingFluid();
            Fluid flowing = new FlowingFluid(source);
            // Reproduce the exact JEI exception before applying the production normalizer.
            for (var action : actions) {
                RecipeIngredientRole role = action == InputAction.Direct.SHOW_USAGES
                        ? RecipeIngredientRole.INPUT : RecipeIngredientRole.OUTPUT;
                boolean rejected = false;
                try { Focus.createFromApi(manager, role, type, new Stack(flowing, 1000)); }
                catch (IllegalArgumentException exception) { rejected = exception.getMessage().contains("Focus value is invalid"); }
                check(rejected, name + ": original flowing query must reproduce invalid-focus failure");
                for (Fluid input : new Fluid[]{source, flowing}) {
                    Fluid normalized = (Fluid) normalize.invoke(probe, input);
                    check(normalized == source, name + ": query must use the matching source object");
                    var callback = new CallbackInfoReturnable<Boolean>("fluid-query", true);
                    guard.invoke(probe, normalized, action, callback);
                    check(!callback.isCancelled(), name + ": valid query must continue into Lychee");
                    Focus<Stack> focus = Focus.createFromApi(manager, role, type, new Stack(normalized, 1000));
                    check(focus.getRole() == role && focus.getTypedValue().getIngredient().amount == 1000,
                            name + ": preserve query direction and one-bucket quantity");
                }
            }
        }
        for (Fluid bad : new Fluid[]{null, new Fluid(false), new FlowingFluid(null)}) {
            for (var action : actions) {
                Fluid normalized = (Fluid) normalize.invoke(probe, bad);
                var callback = new CallbackInfoReturnable<Boolean>("invalid-fluid", true);
                guard.invoke(probe, normalized, action, callback);
                check(callback.isCancelled() && !callback.getReturnValue(), "Invalid fluid must decline safely before JEI");
            }
        }
        Fluid standalone = new Fluid(true);
        check(normalize.invoke(probe, standalone) == standalone, "Non-flowing valid fluid remains unchanged");
        var callback = new CallbackInfoReturnable<Boolean>("favorite", true);
        guard.invoke(probe, standalone, InputAction.Direct.FAVORITE, callback);
        check(!callback.isCancelled(), "Other actions retain Lychee's original behavior");
        System.out.println("PASS " + assertions + " assertions: installed JEI reproduces the original failure; source/flowing queries pass for both roles; invalid fluids decline safely. Minecraft fluid fixtures only.");
    }
}
