# Path of Creation updater

[简体中文](README.md) · English · [Modpack home](../../docs/en/README.md)

The client mod is `mods/poc-updater-1.0.0.jar`, internal version **1.1.0**, for Minecraft 1.21.1, NeoForge 21.1.255, and Java 21. Its filename remains the same for existing installations.

## Updating the game

At startup, the updater checks the latest official Release. It shows the new version, changelog, and download size. Choose “Update Now”, “Maybe Later”, or “View Release”. Postponing skips reminders for that startup.

The client prefers an applicable incremental ZIP and falls back to the full ZIP when needed. After verification, click “Exit and Install”. The installer waits for the game to exit, backs up affected files, and installs the update. Restart from your launcher when it finishes.

The local changelog appears once per installed version; state is stored in `local/poc-updater/state.json`. Network failures allow normal play. The interface and local notes support English (US) and Simplified Chinese. Older updaters need one full download before using incremental updates. Clients without the updater need a manual installation first. Changes to Minecraft or NeoForge require a launcher environment update.

## Files and backups

Updates cover managed mods, KubeJS scripts and assets, quests, gameplay settings, resource packs, shaders, and skyblock templates. Saves, screenshots, map data, extra mods, and common personal client settings are preserved. Only files owned by the previous manifest and removed from the new one are deleted. Incremental installation replaces changed files only.

The initial manifest is `config/poc-updater/baseline.json`; successful updates store the complete new manifest in `local/poc-updater/installed.json`. Backups are under `local/poc-updater/backups/<timestamp>/`. Results and logs are in `local/poc-updater/result.json` and `install.log`. Failed installations attempt rollback. Wait until installation finishes before reopening the game, and back up important saves before upgrading.

## Publishing a release

1. Commit pack files, updater source, and the compiled JAR.
2. Set the version, environment, and bilingual changelog in `config/poc-updater/pack.json`. Generate a baseline when preparing a full client, then commit it:

   ```powershell
   node .github/scripts/package-release.mjs --baseline
   ```

3. Push a matching Tag: version `0.2.1` uses `v0.2.1`. The workflow creates and publishes the Release after packaging. Alternatively, publish an official Release on GitHub to trigger packaging.
4. Wait for the [release workflow](../../.github/workflows/poc-update-release.yml). It uploads packages, manifests, checksums, and icons, then updates `config/poc-updater/latest.json` on the existing `main` branch.

Code commits alone do not trigger updates. Use a new version for each release. Drafts and prereleases are ignored. Tag-triggered publishing uses the `pack.json` changelog; manually published releases use the Release body.

The three most recent earlier official releases are selected as delta bases. Their `poc-update.json` attachments are used when available, otherwise the corresponding Tag's baseline is used. Bases with different game environments are skipped.

## Release files

| File | Purpose |
| --- | --- |
| `path-of-creation-update.zip` | Complete managed snapshot for installation, upgrades, and repair |
| `path-of-creation-delta-from-v<old-version>.zip` | Changes for upgrading from a specified version |
| `poc-update.json` | Complete target manifest with paths, sizes, and SHA-256 values |
| `*.sha256` | Package checksums |

Delta ZIPs cannot be extracted as first installations. Install a matching Minecraft, NeoForge, and Java environment first. GitHub's `Source code` archives are source snapshots. The client first reads `latest.json`, falling back to the GitHub Releases API. The installer verifies reused files after the game exits and stops before installation if they changed during exit.

## Local packaging and builds

Run from the pack root with Node.js 22 and JDK 21. Put the JDK's `jar` command on PATH or specify it with `--jar`.

```powershell
# notes.txt is UTF-8. Output defaults to dist/poc-updater.
node .github/scripts/package-release.mjs --version v0.2.1 --notes-file notes.txt

# base.json is an old complete manifest; repeat for several base versions.
node .github/scripts/package-release.mjs --version v0.2.1 --notes-file notes.txt --base-manifest base.json
```

Java source is under `src/main/java`; language files and mod metadata are under `src/main/resources`. Compile for Java 21 against the matching Minecraft/NeoForge libraries. Rebuild and replace the installed JAR after changing source or language files.

Actual prompts and online updates require a game restart, an official Release, and successful Actions publishing. Before a release, check file verification, save and extra-mod preservation, and rollback after a failed installation.

## Manifest format

`poc-update.json` uses schema 1 with versions and the complete file list. Delta ZIPs also include `poc-delta.json`: `base` is the complete base manifest, `files` lists changed files, and `removed` lists deletions. The installer recomputes differences and verifies ZIP contents, hashes, and reused files.

`latest.json` retains the original full-package fields and adds an optional `deltas` array with base versions, URLs, checksums, and sizes. Old clients ignore the new fields. Downloads do not yet support resuming.
