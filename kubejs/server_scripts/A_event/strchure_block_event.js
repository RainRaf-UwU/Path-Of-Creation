//功能：输入数组a(支持一维和二维)和字典b，输出坐标数组c和方块数组d，返回字典
function transformArrays(a, b) {
    var matrix = Array.isArray(a[0]) ? a : [a];
    
    var rLayer = -1, rIndex = -1, rPos = -1;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var pos = matrix[i][j].indexOf('r');
            if (pos !== -1) {
                rLayer = i;
                rIndex = j;
                rPos = pos;
                break;
            }
        }
        if (rLayer !== -1) break;
    }
    
    var c = [];
    var d = [];
    
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var str = matrix[i][j];
            var y = i - rLayer;
            var z = rIndex - j;
            
            for (var k = 0; k < str.length; k++) {
                var char = str[k];
                var x = k - rPos;
                
                if (char !== ' ') {
                    c.push([x, y, z]);
                    d.push(b[char]);
                }
            }
        }
    }
    
    return { c: c, d: d };
}

//功能：将数组顺时针旋转90度(支持一维和二维)
function rotateClockwise90(a) {
    var matrix = Array.isArray(a[0]) ? a : [a];
    var result = [];
    
    for (var layer = 0; layer < matrix.length; layer++) {
        var layerArr = matrix[layer];
        var rows = layerArr.length;
        var cols = layerArr[0].length;
        
        var newLayer = [];
        for (var newRow = 0; newRow < cols; newRow++) {
            var newStr = '';
            for (var newCol = 0; newCol < rows; newCol++) {
                var oldRow = rows - 1 - newCol;
                var oldCol = newRow;
                newStr += layerArr[oldRow][oldCol];
            }
            newLayer.push(newStr);
        }
        result.push(newLayer);
    }
    
    return Array.isArray(a[0]) ? result : result[0];
}

BlockEvents.rightClicked('minecraft:chain_command_block',e=>{
    const{ player , block , level} = e
    const a = [
        ["cabac",
        "aadaa",
        "bdrdb",
        "aadaa",
        "cabac"]
        ];
    const b = {
        "a":"minecraft:end_stone",
        "b":"alltheores:peridot_block",
        "c":"minecraft:command_block",
        "d":"mysticalagriculture:imperium_ingot_block",
        "r":'minecraft:chain_command_block'
    };

    

    //使用
    let h2 = transformArrays(a, b)
    let b1 = h2["d"]
    let a1 = h2["c"] //取出坐标数组
    // player.tell(JSON.stringify(h2))

    for(let i = 0;i<b1.length;i++){
        if(block.offset(a1[i][0],a1[i][1],a1[i][2]).id != b1[i].toString()) return
    }

    let px = block.x
    let py = block.y
    let pz = block.z
    level.server.schedule(1000,()=>{
        level.server.runCommandSilent(`/summon minecraft:lightning_bolt ${px} ${py} ${pz}`)
        block.set('minecraft:repeating_command_block')
        // block.set('minecraft:air',px+2)
        // block.set('minecraft:air',px-2)
        // block.set('minecraft:air',pz+2)
        // block.set('minecraft:air',pz-2)
        level.server.runCommandSilent(`/fill ${px+2} ${py} ${pz} ${px+2} ${py} ${pz} minecraft:air`)
        level.server.runCommandSilent(`/fill ${px-2} ${py} ${pz} ${px-2} ${py} ${pz} minecraft:air`)
        level.server.runCommandSilent(`/fill ${px} ${py} ${pz+2} ${px} ${py} ${pz+2} minecraft:air`)
        level.server.runCommandSilent(`/fill ${px} ${py} ${pz-2} ${px} ${py} ${pz-2} minecraft:air`)
    })
})