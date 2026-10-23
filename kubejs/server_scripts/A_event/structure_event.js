// 一键搭建与配方/任务模板使用同一份生成图纸；控制器由玩家单独放置。
function pocPlaceRedesignedStructure(event, layoutId) {
    const {block, player} = event
    if (!player || !player.isPlayer()) return
    if (player.getOffHandItem().id !== 'rain:fazhang') {
        player.tell(Text.red(Text.translate('rain.structure_block.player.tell.text_0_0')).append(Text.aqua(Item.of('rain:fazhang').displayName)).append(Text.red(Text.translate('rain.structure_block.player.tell.text_0_1'))))
        player.tell(Text.gold(Text.translate('rain.structure_block.player.tell.text_info')))
        event.cancel()
        return
    }
    const layouts = JsonIO.read('kubejs/data/rain/machine_redesign/structures.json')
    const layout = layouts.find(value => value.id === layoutId)
    let origin = null
    layout.pattern.forEach((floor, y) => floor.forEach((row, z) => { const x = row.indexOf('m'); if (x >= 0) origin = [x, y, z] }))
    const cells = []
    layout.pattern.forEach((floor, y) => floor.forEach((row, z) => {
        for (let x = 0; x < row.length; x++) {
            const symbol = row.charAt(x)
            if (symbol === ' ' || symbol === 'm') continue
            let state = layout.keys[symbol]
            if (state === 'naturesaura:golden_leaves') state += '[persistent=true]'
            // 控制器在标记正上方，面向北；CM南向规范图纸旋转180度。
            cells.push({x: origin[0] - x, y: y - origin[1] + 1, z: origin[2] - z, state: state})
        }
    }))
    if (cells.some(cell => { const id = block.offset(cell.x, cell.y, cell.z).id; return id !== 'minecraft:air' && id !== cell.state.split('[')[0] })) {
        player.tell(Text.red(Text.translate('rain.structure_block.occupied')))
        event.cancel()
        return
    }
    block.set('minecraft:air')
    cells.forEach(cell => event.server.runCommandSilent('setblock ' + (block.x + cell.x) + ' ' + (block.y + cell.y) + ' ' + (block.z + cell.z) + ' ' + cell.state))
}
BlockEvents.placed('rain:structure_void_mining_machine-3', event => pocPlaceRedesignedStructure(event, 'mining-0'))
BlockEvents.placed('rain:structure_dyeing', event => pocPlaceRedesignedStructure(event, 'dyeing-0'))

BlockEvents.placed('rain:structure_fluid_processing_primering',e=>{
     const { block, level, player } = e;

    if (!player || !player.isPlayer()) return;
    

    const place_block_pos = block.pos.above(1)

    if (player.getOffHandItem().id !== "rain:fazhang") {
            player.tell(Text.red(Text.translate('rain.structure_block.player.tell.text_0_0')).append(Text.aqua(Item.of("rain:fazhang").displayName)).append(Text.red(Text.translate('rain.structure_block.player.tell.text_0_1'))));
            player.tell(Text.gold(Text.translate('rain.structure_block.player.tell.text_info')));
    
            e.cancel();
            return;
        }

     block.set('minecraft:air')

     const bx = block.x
     const by = block.y
     const bz = block.z

     //第一层
    e.server.runCommandSilent(`fill ${bx} ${by} ${bz + 4} ${bx} ${by} ${bz + 4} alltheores:steel_block`)

    //第二层
    e.server.runCommandSilent(`fill ${bx} ${by+1} ${bz + 3} ${bx} ${by+1} ${bz + 5} alltheores:steel_block`)
    e.server.runCommandSilent(`fill ${bx-1} ${by+1} ${bz + 4} ${bx+1} ${by+1} ${bz + 4} alltheores:steel_block`)
    e.server.runCommandSilent(`fill ${bx} ${by+1} ${bz + 4} ${bx} ${by+1} ${bz + 4} minecraft:chest`)
})


