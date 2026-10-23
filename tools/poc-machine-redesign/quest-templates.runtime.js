// 官方模板使用新版UUID。原始模板随更新包保留，已领取且未编辑的官方模板可安全升级。
ServerEvents.loaded(event => {
    const BGData = Java.loadClass('com.direwolf20.buildinggadgets2.common.worlddata.BG2Data')
    const UUID = Java.loadClass('java.util.UUID')
    const TagParser = Java.loadClass('net.minecraft.nbt.TagParser')
    const definitions = JsonIO.read('kubejs/data/rain/machine_redesign/templates.json')
    const data = BGData.get(event.server.overworld())
    let restored = 0
    let upgraded = 0
    definitions.templates.forEach(template => {
        const id = UUID.fromString(template.uuid)
        const existing = data.getCopyPasteList(id, false)
        if (existing != null && !existing.isEmpty()) return
        const blocks = BGData.statePosListFromNBTMapArray(TagParser.parseTag(template.snbt))
        if (blocks.isEmpty()) throw new Error('任务建筑模板没有方块数据：' + template.name)
        data.addToCopyPaste(id, blocks)
        restored++
    })
    // 仅当当前数据逐状态、逐坐标等于原官方模板时升级；任何玩家编辑均保留。
    definitions.migrations.forEach(migration => {
        const id = UUID.fromString(migration.uuid)
        const existing = data.getCopyPasteList(id, false)
        if (existing == null || existing.isEmpty()) return
        const original = BGData.statePosListFromNBTMapArray(TagParser.parseTag(migration.original_snbt))
        const currentTag = BGData.statePosListToNBTMapArray(existing)
        const originalTag = BGData.statePosListToNBTMapArray(original)
        if (!currentTag.equals(originalTag)) return
        const updated = BGData.statePosListFromNBTMapArray(TagParser.parseTag(migration.updated_snbt))
        data.addToCopyPaste(id, updated)
        upgraded++
    })
    if (restored > 0 || upgraded > 0) console.info('任务建筑模板：补齐 ' + restored + ' 份，安全升级 ' + upgraded + ' 份')
})
