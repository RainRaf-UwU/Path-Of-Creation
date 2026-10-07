# Path of Creation · 创世之径

[简体中文](../../README.md) · English

<p align="center">
  <img src="../../design/branding/path-of-creation-icon-256-v2.png" alt="Path of Creation logo" width="256" height="256">
</p>

**Start with a single block and build your own world, one step at a time.**

Path of Creation is a Minecraft skyblock modpack focused on technology and automation. You begin on a single-block island in the void, gather your first resources through custom interactions and recipes, then build production lines, develop power systems, and explore dimensions as you follow the path of creation.

[Download v0.1.1](https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/v0.1.1) · [All releases](https://github.com/RainRaf-UwU/Path-Of-Creation/releases) · [Report an issue](https://github.com/RainRaf-UwU/Path-Of-Creation/issues)

## Features

- **Single-block skyblock start:** Gather resources from a limited starting point and expand your foothold in the void into a world of your own.
- **Custom resource acquisition:** Progress through block interactions, fluid transformations, lightning strikes, dimension changes, and more. Check the quest book and JEI for specific requirements.
- **Technology and automation:** Build production lines around Create, Mekanism, Applied Energistics 2, Industrial Foregoing, Oritech, Ender IO, and other mods, gradually replacing manual work with automation.
- **Custom machines and materials:** Use custom fluid-processing, replication, dyeing, and void-mining machines, along with materials, upgrades, and ultimate items that connect the stages of progression.
- **Chinese and English quest guidance:** The first five chapters contain 450 quests linking the technology stages. Chapter 6 is unfinished and still in development. Both Simplified Chinese and English (US) quest text are available.
- **Client update notifications:** An included updater checks for official GitHub releases when the game starts, letting you update immediately or postpone it.

## Quest progression

Chapter names follow your selected game language.

| Stage | Chapter |
| --- | --- |
| Chapter 1 | Something from Nothing · 无中生有 |
| Chapter 2 | Hard Work Pays Off · 苦尽甘来 |
| Chapter 3 | Uncovering the Truth · 探明真相 |
| Chapter 4 | Path of Creation · 创世之径 |
| Chapter 5 | Creative Mode? · 创造模式？ |
| Optional Chapter 6 | Stairway to Ascension · 登神长阶 — unfinished, in development |

The quest book is both a guide and part of progression. Each chapter's ultimate item is tied to unlocking the next chapter. When you encounter an unfamiliar material or interaction, read its quest description first, then check JEI for recipes and uses.

## Requirements

| Component | Version used by v0.1.1 |
| --- | --- |
| Minecraft | 1.21.1 |
| Mod loader | NeoForge 21.1.255 |
| Java | 21 |

## Installation and getting started

1. Create a separate instance in a Minecraft launcher that supports NeoForge. Install Minecraft **1.21.1** and NeoForge **21.1.255**, and use **Java 21**.
2. Download `path-of-creation-update.zip` from the [v0.1.1 release page](https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/v0.1.1), then extract the modpack files into that instance's game directory. For a first installation, complete the game and loader setup in step 1 first.
3. Launch the game and create a new world using Skyblock Builder's skyblock world type and the included **Rain** island template.
4. Open the FTB Quests book and begin with “Welcome” and “Chapter 1: Something from Nothing”.

The update ZIP contains mods, scripts, configuration, and resources. It does not include Minecraft itself, Java, or launcher runtime libraries. GitHub's `Source code` archives are repository snapshots; the automatic updater uses the dedicated update ZIP described above.

## Updating an existing instance

Clients that already include the updater show a prompt when a new version is available at startup. Choose to update, wait for the download and verification, then click “Exit and Install”. Once installation finishes, restart the game from your launcher.

The updater backs up replaced managed files and preserves saves, extra mods added by the player, and common personal settings. Back up important saves yourself before upgrading. Older clients without the updater need one manual installation of a version that includes it. If Minecraft or NeoForge changes, update the runtime through your launcher.

## Language and launcher icon

Choose **English (US)** or Simplified Chinese in Options → Language. Leave FTB Quests locale overrides blank, then reopen the quest book. Custom items, hints, story text, and the updater interface use your selected language.

PCL users can select `config/fancymenu/assets/pack_icon.png` as the instance icon. The release also includes a 256×256 icon and a high-resolution logo.

## v0.1.1 changes

- Added English (US) / en_us support for all 290 FTB Quests text entries, including chapters, quest titles, descriptions, and hints.
- Expanded KubeJS localization for item tooltips, creative cell names, building template names, the hidden advancement, animated story text, and quiz prompts. Story text follows each player's language; Chinese remains available.
- Localized the FancyMenu Easter egg hint and the client updater interface.
- Fixed Building Gadgets templates failing to display or load: seven quest blueprints are restored when entering a world. Previously claimed templates remain usable, and existing player blueprints are preserved.
- Fixed background blur obscuring the update notes.
- Refined the pack logo using the original title artwork, revised gears and lighting, and a purple void background. A 256×256 PCL icon and a high-resolution version are provided; the revised icon is installed in the author's local PCL instance.
- Improved the Chinese README, added a complete English README with language links, and marked Chapter 6 as unfinished and still in development.

## v0.1 changes

- Updated several mods.
- Fixed known bugs.
- Improved the modpack's quest progression.

## Project structure and maintenance

| Directory | Contents |
| --- | --- |
| `kubejs/server_scripts` | Recipes, resource acquisition, game events, and custom machine logic |
| `kubejs/startup_scripts` | Custom item and block registration |
| `kubejs/client_scripts` | Client scripts |
| `kubejs/assets` / `kubejs/data` | Textures, models, data, and recipe definitions |
| `config/ftbquests/quests` | Quest chapters, dependencies, and Chinese/English text |
| `config/skyblockbuilder` | Skyblock generation settings and templates |
| `mods` | Installed mod files |
| `tools/poc-updater` | Updater source code, packaging, and validation tools |

See the [updater documentation](../../tools/poc-updater/README.md) for maintainer build, release, and verification instructions.

## Feedback and licensing

Please [open an issue](https://github.com/RainRaf-UwU/Path-Of-Creation/issues) with the modpack version, reproduction steps, and relevant logs or screenshots. Remove account details and other personal information before uploading them.

Original code in this repository is licensed under the [MIT License](../../LICENSE). Included third-party mods, resource packs, and shaders remain subject to their respective authors' licenses.
