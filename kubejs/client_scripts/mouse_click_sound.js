// A physical left-button press plays once, including GUI slots, empty areas and the world.
// Observe the raw input event without cancelling or changing the click itself.
const $PocClickMinecraft = Java.loadClass('net.minecraft.client.Minecraft')
const $PocClickSoundInstance = Java.loadClass('net.minecraft.client.resources.sounds.SimpleSoundInstance')
const $PocClickSoundEvent = Java.loadClass('net.minecraft.sounds.SoundEvent')
const $PocClickResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
const pocMouseClickSound = $PocClickSoundEvent.createVariableRangeEvent(
    $PocClickResourceLocation.parse('minecraft:poc_mouse_click')
)

NativeEvents.onEvent('net.neoforged.neoforge.client.event.InputEvent$MouseButton$Pre', event => {
    // GLFW: left button = 0; press = 1. Release/hold/right/middle do not play.
    if (event.getButton() !== 0 || event.getAction() !== 1) return
    const client = $PocClickMinecraft.getInstance()
    if (!client.isWindowActive()) return
    client.getSoundManager().play($PocClickSoundInstance.forUI(pocMouseClickSound, 1.0))
})

// Buttons already play ui.button.click. Suppress that event so a left click
// never doubles the new mouse sound, and keyboard/right-button activation is silent.
NativeEvents.onEvent('net.neoforged.neoforge.client.event.sound.PlaySoundEvent', event => {
    if (event.getOriginalSound().getLocation().toString() === 'minecraft:ui.button.click') {
        event.setSound(null)
    }
})
