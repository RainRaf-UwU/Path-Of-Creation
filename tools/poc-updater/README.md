# 创世之径客户端自动更新

客户端模组：`mods/poc-updater-1.0.0.jar`，当前内部版本为 **1.1.0**。文件名保持不变，方便已有实例替换。支持 Minecraft 1.21.1、NeoForge 21.1.255，使用当前游戏的 Java 21，不需要玩家安装 Python。

从整合包 v0.1.1 起，界面文字随游戏语言显示为简体中文或 English (US)，Release 更新说明提供中英文。背景模糊先于说明正文绘制，保持文字清晰。

## 玩家体验

- 每次启动，在主菜单或直接进入世界后异步检查 `RainRaf-UwU/Path-Of-Creation` 最新正式 Release。
- 有更新：显示版本号、Release 更新说明，以及“立即更新”“稍后再说”“查看发布页”。拒绝后本次启动不再提醒，下次启动重新检查。
- 同意更新：优先下载适用于当前版本、且小于完整包的增量 ZIP，校验 SHA-256、完整清单及需要复用的本地文件。增量包缺失、损坏或不适用时自动回退完整 ZIP；下载界面显示实际所选包的大小。下载完成后点击“退出并安装”。独立安装器等待游戏进程退出，备份本次涉及的原文件，再安装新版；完成后从启动器重新启动。
- 没有更新：每个本地版本的更新说明仅首次启动显示一次，之后不再弹窗。记录保存在 `local/poc-updater/state.json`，跨存档生效。
- 无网络、GitHub 限流或尚未发布 Release：正常游玩，首次仍可查看本地更新说明。不会反复弹网络错误。

目前是**启动时检查**，已运行的客户端在下一次启动时收到新版本。已有旧客户端需要先获得一次包含本模组、`pack.json` 和 `baseline.json` 的完整整合包，才能接收后续自动更新。

只支持完整包的旧更新器仍读取原有下载字段。因此，旧玩家第一次获得本次新版更新器时会下载一次完整包；之后才会自动选择增量包。不需要手动替换玩家的初始清单。

## 作者发布步骤

1. 将本功能的文件与整合包最新内容提交到 GitHub：`mods/poc-updater-1.0.0.jar`、`config/poc-updater/`、`tools/poc-updater/`、`.github/workflows/poc-update-release.yml`。发布时保留原来的存档和启动器忽略规则。
2. 在 GitHub 的 Releases 页面创建**正式 Release**，Tag 使用递增数字版本，例如 `v0.1`、`v0.2`。不要勾选预发布；将新版本设为 Latest。Tag 指向包含本功能和最新整合包文件的提交。也可以先在 `config/poc-updater/pack.json` 填写版本与更新说明、生成 baseline 并提交，然后推送与版本完全一致的 `v<版本>` Tag；工作流会在打包成功后创建 Release、上传附件并发布。
3. Release 描述填写更新内容，这段文字会显示在玩家弹窗中；通过 Tag 发布时，说明取自 `pack.json` 的 `changelog`。
4. 发布后，等待 `Build client update package` Actions 成功。工作流会自动附加完整 ZIP、完整目标清单 `poc-update.json`、增量 ZIP、各 ZIP 的 `.sha256` 文件和 V2 的 256×256 图标/高清 Logo，再更新 `main` 中的 `config/poc-updater/latest.json`。整个发布流程不创建分支。ZIP 中的客户端版本和更新说明自动取自该 Release，不需要改 Java 源码。

Actions 按数字版本顺序选择目标之前的最近三个正式 Release，生成各旧版本直接升级到目标的补丁。草稿、预发布、已下架 Release 和只有 Git 标签的版本不会作为基础。优先读取旧 Release 的 `poc-update.json` 附件；旧发布没有该附件时，从对应 Tag 读取 `baseline.json`。不同 Minecraft/NeoForge 的基础会跳过；获取基础失败会记录警告，该版本仍可通过完整包升级。上传文件列表由本次打包生成，避免重复使用输出目录时误上传旧补丁。

只提交代码不会触发版本更新。草稿和预发布被忽略；编辑同一个版本的更新说明不会再次弹窗。每次发布请使用新版本号。工作流未完成或没有更新 ZIP 时，弹窗会提供发布页入口，玩家可手动安装。

`path-of-creation-update.zip` 保持为**受管理文件的完整快照**，用于首次安装、任意跨版本升级和修复本地文件。`path-of-creation-delta-from-v<旧版本>.zip` 只携带新增/修改文件、完整目标清单及旧版本与删除声明，不能直接解压当作首次安装包。没有对应补丁时自动使用完整包。这些文件不包含 Minecraft 本体、运行库或启动器；GitHub 自动提供的 `Source code (zip)` 也不是本功能的更新包。

客户端优先读取 `raw.githubusercontent.com/RainRaf-UwU/Path-Of-Creation/main/config/poc-updater/latest.json`，不消耗匿名 REST API 的每小时额度；未生成此清单时，回退到 GitHub Releases API。该文件由 Actions 在现有 `main` 分支维护，不需要玩家登录 GitHub。若手动打包上传而未运行 Actions，也可将打包生成的 `latest.json` 保存到该路径；否则只能使用 API 备用检查。

## 更新范围与保留内容

- 更新模组 JAR、KubeJS 运行脚本/资源/数据、任务及玩法配置、defaultconfigs、资源包、光影包、手册和空岛导出模板。
- 初始文件清单为 `config/poc-updater/baseline.json`；成功更新后的文件清单为 `local/poc-updater/installed.json`。只清理上一个清单中已删除的受管理文件，防止旧模组和旧脚本残留。
- 保留 `saves`、`options.txt`、截图、地图数据、玩家添加的额外模组、更新弹窗记录，以及常见 `*-client.toml` / `*-client.snbt`、Sodium、Iris、JEI 等个人配置。
- 整合包管理的玩法配置可能被新版覆盖，但原文件会备份。保留的个人配置不会随整合包同步；若新版必须修改某个个人配置，需要单独迁移。
- KubeJS 开发/网页服务配置、账户、凭据、日志、缓存、设计草稿和启动器设置不会进入更新包。
- Minecraft 或 NeoForge 版本变化时，会提示通过发布页安装完整实例。当前自动安装仅适用于相同的 Minecraft / NeoForge 版本，防止启动器运行库不匹配。

安装失败会尝试回滚已改文件。备份及恢复文件列表保存在 `local/poc-updater/backups/<时间>/original`、`restore.json`，结果和日志在 `local/poc-updater/result.json`、`install.log`。安装完成前不要重新打开实例。

增量安装仅备份/替换补丁中的变化文件，并删除旧清单中声明移除的文件；未变化的模组不会重写或重复备份。成功后 `installed.json` 保存**完整**目标清单，支持下一次增量更新，初始 `baseline.json` 保持不变。要复用的文件如果被玩家或模组改写、缺失或经过目录链接，下载准备会回退完整包。独立安装器在游戏退出后再次校验；若退出时又改写了复用文件，则在改动游戏文件前终止，重启后可以重新更新。受管理配置的本地改动因此可能触发完整包修复；个人配置仍受原有保留规则保护。

## 本地发布工具

从整合包根目录运行：

```powershell
# 仅在制作首个完整客户端、或制作另一个完整客户端时生成其当前文件清单。
python tools/poc-updater/package_release.py --baseline

# 手动生成更新包；notes.txt 使用 UTF-8。输出位于 dist/poc-updater。
python tools/poc-updater/package_release.py --version v0.0.5 --notes-file notes.txt

# 同时生成完整包和从旧版直接升级的增量包。
# base.json 使用旧完整 ZIP 中的 poc-update.json，或旧 Release 的同名附件。
# --base-manifest 可以重复传入，为多个旧版本生成直达补丁。
python tools/poc-updater/package_release.py --version v0.2 --notes-file notes.txt --base-manifest base.json
```

`--baseline` 记录当前安装版本。手动生成更新 ZIP 不会修改作者实例的本地版本号。制作新的完整客户端时，应先在 `config/poc-updater/pack.json` 填写其实际版本、Minecraft/NeoForge 和更新内容，再生成 baseline。

## 重新编译与验证

源码随包保存。构建脚本直接使用已安装的游戏库和 JDK 21，无需 Gradle 或额外下载：

```powershell
python tools/poc-updater/build.py --jdk "<JDK21目录>" --libraries "<Minecraft libraries目录>" --version-json "<当前实例版本JSON>" --test
# 有已有 javac.args 时可复用 classpath；--output 让测试构建不安装到真实实例。
python tools/poc-updater/build.py --jdk "<JDK目录>" --classpath-file tools/poc-updater/build/javac.args --output "<测试目录>/poc-updater-1.0.0.jar" --test
python tools/poc-updater/test_package.py
python tools/poc-updater/test_installer_process.py --java "<JDK21目录>/bin/java.exe" --mod "mods/poc-updater-1.0.0.jar"
python tools/poc-updater/test_workflow.py
```

构建后更新 `mods/poc-updater-1.0.0.jar`，并重新生成当前完整客户端的 baseline。模组使用原生 Screen / Button，不依赖 FancyMenu 或 KubeJS 的自定义 GUI API；专用服务端不会加载此客户端模组。

测试覆盖数字版本比较、弹窗持久化、完整/增量打包与跨语言安装、复用文件不重写、不重复备份、受管理删除、跨版本直达补丁、连续两次增量升级、旧清单/本地文件不符、补丁损坏或缺失时自动完整回退、存档/个人模组保留及失败回滚。独立安装器的完整包和增量包都通过真实父进程退出等待测试。发布脚本测试需要 Node.js，用模拟 API 验证正式版本基础选择、旧清单回退、运行环境过滤、下载地址限制、在现有 main 发布及防止旧版本覆盖新版。首次实际启用仍需重启游戏，检查 FancyMenu 共存和真实弹窗；真实 GitHub 更新链路需正式 Release 和 Actions 完成后验证。

协议：`poc-update.json` schema 1 含版本、Minecraft/NeoForge 及每个受管理文件的相对路径、SHA-256、大小。安装器拒绝越界路径、链接、重复/缺失条目、存档路径、包与 Release 版本不一致和运行库版本不匹配。

增量 ZIP 额外包含 `poc-delta.json` schema 1：`base` 是完整基础清单，`files` 是必须携带的新增/修改路径，`removed` 是基础有而目标没有的受管理路径。安装器重新计算两份清单的差异并核对列表、ZIP 条目及每个文件哈希，禁止用不完整列表绕过删除/复用检查。版本说明可能由 Release 覆盖，因此基础匹配不比较旧 `pack.json` 的说明内容；每个补丁必须携带目标 `pack.json`。初始清单不会覆盖，因此也不比较其旧摘要。其余基础文件路径/摘要/大小必须完全匹配，复用文件实际字节须符合目标摘要。仅大小写变化的路径重命名被拒绝。

`latest.json` 原有完整包字段保持不变，新增可选 `deltas` 数组，每项包含 `from`、`download`、`digest`、`checksum`、`size`。旧客户端忽略新字段；新客户端也支持旧的完整包清单和 GitHub API 备用检查。暂未增加断点续传，失败后的完整包仍需重新下载。
