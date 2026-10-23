# 创世之径 · Lychee JEI 流体兼容

客户端兼容补丁，修复在 Lychee 配方页点击流动液体模型查询配方或用途时的 `Focus value is invalid` 崩溃。修复依据为 2026-10-21 报告，UUID `12155bc5-0e55-4114-b6ca-53a33fe71088`。

已针对 Minecraft 1.21.1、NeoForge 21.1.255、Lychee 6.7.0、JEI 19.57.0.450 编译和离线验证。

## 行为

仅挂钩 `JeiRvHelper.doAction(Fluid, InputAction.Direct)`：先把 `FlowingFluid` 规范化为 `getSource()`，再拒绝仍为空或不满足 JEI 源流体校验的查询。有效对象继续执行 Lychee 原来的代码，保持配方/用途方向和 1000 mB 查询量。

不改变世界内流体、配方输入、消耗、概率或产物，不修改 Lychee 和 JEI 的原始 JAR，也不更改普通物品/固体方块查询或其他配方浏览器的代码。补丁入口和 Mixin 都仅在客户端加载。

## 构建与检查

使用 Java 21 和本地现有库，不下载依赖，不读取启动器版本、账户或认证参数。从项目根目录执行，参数中的路径按本机实际位置填写：

```text
node tools/poc-lychee-jei-compat/build.mjs --jdk <JDK21目录> --classpath-file <已有安全javac.args> --work <构建输出目录> --test --output <候选JAR路径>
```

构建脚本复用已有编译依赖，并添加本机 Lychee/JEI/Kiwi。`--test` 还需要本地 LaunchWrapper 1.12，可用 `--launchwrapper <JAR路径>` 指定；它只负责启动离线 Mixin 验证环境，不会运行 Minecraft。输出 JSON 记录成品哈希、日志位置和是否执行检查。

- `FluidQueryTest`：直接调用生产补丁的两个方法，使用已安装 JEI 的 `FluidIngredientHelper.isValidIngredient` 与 `Focus.createFromApi` 复现修复前异常并验证修复后行为，92 项断言。Minecraft 流体对象使用最小测试夹具，名称只是用例标签，不冒充实机中的六种流体。
- `MixinTransformCheck`：用真实 Mixin 0.8.7 对当前 Lychee 类执行转换，检查“规范化→保存参数→校验→原有 JEI 查询”的顺序，并比较其他方法的可执行字节码保持。离线 LaunchWrapper 可能提示缺少旧 FML、bootstrap 阶段和 JAVA_21 平台兼容性；该进程不会创建游戏窗口，转换与断言必须成功退出。
- 成品只包含两个生产类、Mixin JSON、NeoForge 元数据和许可。测试夹具与测试程序不会打包。

## 安装、复测与回退

成品为 `mods/poc-lychee-jei-compat-1.0.0.jar`。完整退出并重新启动游戏才能加载新模组，`/reload` 或资源重载不能代替。

在 Lychee 配方页分别检查源/流动虚无之液、嬗变之液、复制之液和原版水的配方与用途查询；同时确认鼠标、配方/用途快捷键、普通物品查询，以及世界中实际的物品转化行为。离线检查通过不等于实机验收完成。

回退只需在游戏退出后移出这一个新 JAR，原始 Lychee/JEI 和其他文件保持。其他入口（如 JEI 配置页面）的独立崩溃不属于此补丁处理范围。

## English

Client-only compatibility fix for Lychee's JEI fluid queries. Flowing variants are converted to their source fluid before JEI validates a focus; invalid queries return false safely. World recipes and the upstream JARs are unchanged. Build with Java 21 and existing local dependencies; `--test` runs JEI regression checks with fluid fixtures and an actual offline Mixin transformation of the installed Lychee class. A full game restart and in-game verification are still required.
