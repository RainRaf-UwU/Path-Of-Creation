<?php
// 初始化变量
$radius = '';
$area = '';
$msg = '';

// 处理表单提交
if (isset($_POST['radius'])) {
    $radius = trim($_POST['radius']);
    // 仅验证是否为数字（包含正数判断）
    if (is_numeric($radius) && $radius > 0) {
        // 计算面积并保留1位小数
        $area = round(pi() * $radius * $radius, 1);
        $msg = "半径为 $radius 的圆面积是：$area";
    } else {
        $msg = "请输入有效的正数！";
    }
}
?>
<html>
<body>
<h3>圆面积计算</h3>
<!-- 简单表单 -->
<form method="post">
半径：<input type="text" name="radius" value="<?php echo $radius; ?>">
<input type="submit" value="计算">
</form>

<!-- 显示结果/提示 -->
<?php if ($msg) echo "<p>$msg</p >"; ?>
</body>
</html>