// // StartupEvents.registry('entity_type',event=>{
// //        event.create('rain:dumiao', 'minecraft:cat') // Basic Cat Entity
// // })
// // priority: 10
// ClientEvents.entityRendererRegistry(event => {
//   const CatRenderer = Java.loadClass('net.minecraft.client.renderer.entity.CatRenderer')
//   const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
//   const DUMIAO_TEX = new ResourceLocation('rain', 'textures/entity/cat/dumiao.png')

//   // 注册时直接用 JS 匿名类把 getTexture 覆盖
//   event.register('minecraft:cat', ctx => new (Java.extend(CatRenderer, {
//     getTexture(entity) {
//       const name = entity.getCustomName()?.getString()?.trim()?.toLowerCase()
//       if (name === '杜苗' || name === 'metcat') return DUMIAO_TEX
//       return this.super$getTexture(entity)
//     }
//   }))(ctx))
// })