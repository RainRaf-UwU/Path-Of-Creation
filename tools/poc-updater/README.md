# 创世之径客户端自动更新

已安装的客户端模组：`mods/poc-updater-1.0.0.jar`。支持 Minecraft 1.21.1、NeoForge 21.1.255，使用当前游戏的 Java 21，不需要玩家安装 Python。

从整合包 v0.1.1 起，界面文字随游戏语言显示为简体中文或 English (US)，Release 更新说明提供中英文。背景模糊先于说明正文绘制，保持文字清晰。

## 玩家体验

- 每次启动，在主菜单或直接进入世界后异步检查 `RainRaf-UwU/Path-Of-Creation` 最新正式 Release。
- 有更新：显示版本号、Release 更新说明，以及“立即更新”“稍后再说”“查看发布页”。拒绝后本次启动不再提醒，下次启动重新检查。
- 同意更新：下载完整的受管理文件更新包，校验 SHA-256。下载完成后点击“退出并安装”。独立安装器等待游戏进程退出，备份原文件，再安装新版；完成后从启动器重新启动。
- 没有更新：每个本地版本的更新说明仅首次启动显示一次，之后不再弹窗。记录保存在 `local/poc-updater/state.json`，跨存档生效。
- 无网络、GitHub 限流或尚未发布 Release：正常游玩，首次仍可查看本地更新说明。不会反复弹网络错误。

目前是**启动时检查**，已运行的客户端在下一次启动时收到新版本。已有旧客户端需要先获得一次包含本模组、`pack.json` 和 `baseline.json` 的完整整合包，才能接收后续自动更新。

## 作者发布步骤

1. 将本功能的文件与整合包最新内容提交到 GitHub：`mods/poc-updater-1.0.0.jar`、`config/poc-updater/`、`tools/poc-updater/`、`.github/workflows/poc-update-release.yml`。发布时保留原来的存档和启动器忽略规则。
2. 在 GitHub 的 Releases 页面创建**正式 Release**，Tag 使用递增数字版本，例如 `v0.1`、`v0.2`。不要勾选预发布；将新版本设为 Latest。Tag 指向包含本功能和最新整合包文件的提交。也可以先在 `config/poc-updater/pack.json` 填写版本与更新说明、生成 baseline 并提交，然后推送与版本完全一致的 `v<版本>` Tag；工作流会在打包成功后创建 Release、上传附件并发布。
3. Release 描述填写更新内容，这段文字会显示在玩家弹窗中；通过 Tag 发布时，说明取自 `pack.json` 的 `changelog`。
4. 发布后，等待 `Build client update package` Actions 成功。工作流会自动附加 `path-of-creation-update.zip`、同名 `.sha256` 文件和 V2 的 256×256 图标/高清 Logo，再更新 `main` 中的 `config/poc-updater/latest.json`。整个发布流程不创建分支。ZIP 中的客户端版本和更新说明自动取自该 Release，不需要改 Java 源码。

只提交代码不会触发版本更新。草稿和预发布被忽略；编辑同一个版本的更新说明不会再次弹窗。每次发布请使用新版本号。工作流未完成或没有更新 ZIP 时，弹窗会提供发布页入口，玩家可手动安装。

更新包是**受管理文件的完整快照**，玩家可以跨版本升级。它不是启动器安装包，不包含 Minecraft 本体、运行库和启动器；GitHub 自动提供的 `Source code (zip)` 也不是本功能的更新包。

客户端优先读取 `raw.githubusercontent.com/RainRaf-UwU/Path-Of-Creation/main/config/poc-updater/latest.json`，不消耗匿名 REST API 的每小时额度；未生成此清单时，回退到 GitHub Releases API。该文件由 Actions 在现有 `main` 分支维护，不需要玩家登录 GitHub。若手动打包上传而未运行 Actions，也可将打包生成的 `latest.json` 保存到该路径；否则只能使用 API 备用检查。

## 更新范围与保留内容

- 更新模组 JAR、KubeJS 运行脚本/资源/数据、任务及玩法配置、defaultconfigs、资源包、光影包、手册和空岛导出模板。
- 初始文件清单为 `config/poc-updater/baseline.json`；成功更新后的文件清单为 `local/poc-updater/installed.json`。只清理上一个清单中已删除的受管理文件，防止旧模组和旧脚本残留。
- 保留 `saves`、`options.txt`、截图、地图数据、玩家添加的额外模组、更新弹窗记录，以及常见 `*-client.toml` / `*-client.snbt`、Sodium、Iris、JEI 等个人配置。
- 整合包管理的玩法配置可能被新版覆盖，但原文件会备份。保留的个人配置不会随整合包同步；若新版必须修改某个个人配置，需要单独迁移。
- KubeJS 开发/网页服务配置、账户、凭据、日志、缓存、设计草稿和启动器设置不会进入更新包。
- Minecraft 或 NeoForge 版本变化时，会提示通过发布页安装完整实例。当前自动安装仅适用于相同的 Minecraft / NeoForge 版本，防止启动器运行库不匹配。

安装失败会尝试回滚已改文件。备份及恢复文件列表保存在 `local/poc-updater/backups/<时间>/original`、`restore.json`，结果和日志在 `local/poc-updater/result.json`、`install.log`。安装完成前不要重新打开实例。

## 本地发布工具

从整合包根目录运行：

```powershell
# 仅在制作首个完整客户端、或制作另一个完整客户端时生成其当前文件清单。
python tools/poc-updater/package_release.py --baseline

# 手动生成更新包；notes.txt 使用 UTF-8。输出位于 dist/poc-updater。
python tools/poc-updater/package_release.py --version v0.0.5 --notes-file notes.txt
```

`--baseline` 记录当前安装版本。手动生成更新 ZIP 不会修改作者实例的本地版本号。制作新的完整客户端时，应先在 `config/poc-updater/pack.json` 填写其实际版本、Minecraft/NeoForge 和更新内容，再生成 baseline。

## 重新编译与验证

源码随包保存。构建脚本直接使用已安装的游戏库和 JDK 21，无需 Gradle 或额外下载：

```powershell
python tools/poc-updater/build.py --jdk "<JDK21目录>" --libraries "<Minecraft libraries目录>" --version-json "<当前实例版本JSON>" --test
python tools/poc-updater/test_package.py
python tools/poc-updater/test_installer_process.py --java "<JDK21目录>/bin/java.exe" --mod "mods/poc-updater-1.0.0.jar"
python tools/poc-updater/test_workflow.py
```

构建后更新 `mods/poc-updater-1.0.0.jar`，并重新生成当前完整客户端的 baseline。模组使用原生 Screen / Button，不依赖 FancyMenu 或 KubeJS 的自定义 GUI API；专用服务端不会加载此客户端模组。

测试覆盖数字版本比较、最新版本弹窗策略、更新说明持久化、文件完整性、路径限制、跨语言打包、旧文件清理、存档/个人模组保留、备份、失败回滚，以及独立安装器等待父进程退出。发布脚本测试需要 Node.js，用模拟 API 验证工作流在现有 main 发布、不调用分支创建，以及防止旧版本覆盖新版。首次实际启用仍需重启游戏，检查 FancyMenu 共存和真实弹窗；真实 GitHub 更新链路需正式 Release 和 Actions 完成后验证。

协议：`poc-update.json` schema 1 含版本、Minecraft/NeoForge 及每个受管理文件的相对路径、SHA-256、大小。安装器拒绝越界路径、链接、重复/缺失条目、存档路径、包与 Release 版本不一致和运行库版本不匹配。
