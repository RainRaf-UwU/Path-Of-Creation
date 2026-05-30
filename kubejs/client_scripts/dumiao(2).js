RenderJSEvents.onLivingPreRender(event => {
    const entity = event.getEntity()
    
    if (entity.getType() === 'minecraft:cat') {
        const name = entity.getCustomName()
        
        if (name && (name.getString() === '杜苗' || name.getString() === 'metcat')) {
            //这里可以修改渲染，但实际贴图替换需要通过资源包实现
            //kubejs的渲染事件主要用于修改渲染参数，不是直接替换贴图
            event.setCanceled(true) // 取消原渲染
        }
    }
})