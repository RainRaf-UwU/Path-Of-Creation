# 创世之径自动更新

简体中文 · [English](README.en.md) · [整合包首页](../../README.md)

客户端模组 `mods/poc-updater-1.0.0.jar`，内部版本 **1.1.0**。支持 Minecraft 1.21.1、NeoForge 21.1.255、Java 21。文件名保持不变，便于替换旧版。

## 玩家如何更新

每次启动游戏，更新器会检查最新正式 Release。发现新版本后，弹窗显示版本号、更新说明和下载大小，可选择“立即更新”“稍后再说”或“查看发布页”。稍后再说会跳过本次启动的提醒。

选择更新后，客户端优先下载适用的增量 ZIP；补丁不可用或本地文件不符合要求时，自动使用完整 ZIP。校验完成后点击“退出并安装”。安装器等待游戏退出，备份并替换文件。完成后从启动器重新启动。

本地版本的说明只显示一次，记录在 `local/poc-updater/state.json`。网络检查失败时仍可正常游玩。界面和本地说明支持简体中文与 English (US)。旧更新器首次升级使用完整包，之后才支持增量；未包含更新器的实例需要先手动安装一次。Minecraft 或 NeoForge 版本变化时，需要通过启动器调整环境。

## 文件与备份

- 更新受管理的模组、KubeJS 脚本和资源、任务、玩法配置、资源包、光影与空岛模板。
- 保留存档、截图、地图数据、玩家额外添加的模组和常见个人客户端设置。
- 只删除上一份清单中、且新版已经移除的受管理文件。增量安装只替换变化文件。

初始清单是 `config/poc-updater/baseline.json`，更新后的完整清单在 `local/poc-updater/installed.json`。备份位于 `local/poc-updater/backups/<时间>/`，结果与日志位于 `local/poc-updater/result.json` 和 `install.log`。安装失败会尝试回滚；安装结束前不要重新打开实例。升级前请自行备份重要存档。

## 发布新版本

1. 提交整合包文件、更新器源码与编译后的 JAR。
2. 在 `config/poc-updater/pack.json` 填写版本、运行环境与中英文说明。制作完整客户端时生成对应的 baseline，再提交清单：

   ```powershell
   node .github/scripts/package-release.mjs --baseline
   ```

3. 推送与 `pack.json` 版本一致的 Tag，例如 `0.2.1` 对应 `v0.2.1`。工作流打包成功后会创建并发布 Release。也可在 GitHub 手动发布正式 Release，由发布事件触发打包。
4. 等待 [发布工作流](../../.github/workflows/poc-update-release.yml) 完成。它上传完整包、增量包、清单、校验文件和图标，并在现有 `main` 分支更新 `config/poc-updater/latest.json`。

只提交代码不会触发客户端更新。每次发布使用新版本号；草稿与预发布会被忽略。Tag 发布的说明取自 `pack.json`，手动发布则取自 Release 正文。

工作流选择之前最近三个正式 Release 作为增量基础，优先读取旧 Release 的 `poc-update.json` 附件，缺少附件时读取对应 Tag 的 baseline。运行环境不同的基础会跳过。

## 发布附件

| 文件 | 用途 |
| --- | --- |
| `path-of-creation-update.zip` | 完整受管理文件快照，用于首次安装、升级和修复 |
| `path-of-creation-delta-from-v<旧版本>.zip` | 从指定旧版本升级，只携带变化文件 |
| `poc-update.json` | 完整目标清单，记录路径、大小和 SHA-256 |
| `*.sha256` | 下载包校验值 |

增量 ZIP 不能直接解压用于首次安装。更新包需要已有匹配的 Minecraft、NeoForge 与 Java 环境。GitHub 的 `Source code` 压缩包是源码快照。

客户端优先读取仓库中的 `latest.json`，失败时回退 GitHub Releases API。退出游戏后，安装器会再次检查要复用的文件；若退出时文件被改写，会在安装前终止。

## 本地打包与编译

从整合包根目录运行，需要 Node.js 22 和 JDK 21；JDK 的 `jar` 命令需在 PATH 中，也可通过 `--jar` 指定路径。

```powershell
# notes.txt 使用 UTF-8，默认输出到 dist/poc-updater。
node .github/scripts/package-release.mjs --version v0.2.1 --notes-file notes.txt

# base.json 是旧版完整清单，可重复指定多个基础版本。
node .github/scripts/package-release.mjs --version v0.2.1 --notes-file notes.txt --base-manifest base.json
```

更新器 Java 源码位于 `src/main/java`，语言文件和模组元数据位于 `src/main/resources`。编译目标是 Java 21，需使用对应的 Minecraft/NeoForge 运行库。修改源码或语言文件后，重新编译并替换游戏中的 JAR。

真实弹窗与在线更新需要重启游戏、正式 Release 和成功的 Actions 发布。发布前应检查文件校验、存档与额外模组保留，以及安装失败后的回滚。

## 清单协议

`poc-update.json` 使用 schema 1，包含版本、Minecraft/NeoForge 版本及完整文件清单。增量 ZIP 另含 `poc-delta.json`：`base` 是完整基础清单，`files` 是变化路径，`removed` 是删除列表。安装器重新计算差异并核对 ZIP 内容、哈希和复用文件。

`latest.json` 保留旧完整包字段，增加可选 `deltas` 数组，记录基础版本、下载地址、校验值和大小。旧客户端忽略新字段。下载暂不支持断点续传。
