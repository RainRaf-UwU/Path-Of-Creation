# Path of Creation · 创世之径

[简体中文](../../README.md) · English

<p align="center">
  <img src="../../design/branding/path-of-creation-icon-256-v2.png" alt="Path of Creation" width="256" height="256">
</p>

Path of Creation is a Minecraft skyblock modpack focused on technology and automation. Start with one block in the void, gather resources through custom interactions and recipes, and follow the quest book to build production lines, power systems, and each stage's ultimate items.

[Download v0.2.0](https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/v0.2.0) · [All releases](https://github.com/RainRaf-UwU/Path-Of-Creation/releases) · [Report an issue](https://github.com/RainRaf-UwU/Path-Of-Creation/issues) · [Discord community](https://discord.gg/KjrtbhCSf)

## Gameplay

- Start on a single-block island. Gather resources through block interactions, fluid transformations, lightning, and portals. The quest book and JEI explain the requirements and outputs.
- Build with Create, Mekanism, Applied Energistics 2, Industrial Foregoing, Oritech, Ender IO, and other technology mods.
- Custom machines handle fluid processing, replication, dyeing, and void mining. Materials and upgrades connect the stages of progression.
- The first five chapters contain 448 quests in Simplified Chinese and English (US). Chapter 6 is still in development.
- The client checks for official releases at startup and supports incremental updates.

## Quest progression

| Stage | Chapter |
| --- | --- |
| Chapter 1 | Something from Nothing |
| Chapter 2 | Hard Work Pays Off |
| Chapter 3 | Void Dawn |
| Chapter 4 | Path of Creation |
| Chapter 5 | Creative Mode? |
| Optional Chapter 6 | Stairway to Ascension (in development) |

Each chapter's ultimate item helps unlock the next chapter. Read the quest description when you encounter an unfamiliar material or interaction, then check JEI for recipes and uses.

## Installation

v0.2.0 uses **Minecraft 1.21.1, NeoForge 21.1.255, and Java 21**.

1. Create a separate instance in a launcher that supports NeoForge and install the versions above.
2. Download `path-of-creation-update.zip` from the [release page](https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/v0.2.0) and extract it into the instance's game directory.
3. Create a world with Skyblock Builder's skyblock world type and choose the **Rain** island template.
4. Open FTB Quests and begin with “Welcome” and “Chapter 1: Something from Nothing”.

The update ZIP includes mods, scripts, configuration, and resources. Install Minecraft, NeoForge, and Java through your launcher first. GitHub's `Source code` archives are source snapshots; use the dedicated update ZIP for installation.

## Updating an existing instance

At startup, the updater prompts you when a new version is available. Choose “Update Now”, wait for download and verification, then click “Exit and Install”. Restart from your launcher after installation finishes.

The updater chooses an applicable incremental package and uses the full package when needed. Older updaters need a full download for their first upgrade. Saves, extra mods, and common personal settings are preserved, and replaced files are backed up. Back up important saves before upgrading. Changes to Minecraft or NeoForge require a launcher environment update. See the [updater README](../../tools/poc-updater/README.en.md) for details.

## Language and icon

Choose **English (US)** or Simplified Chinese in Options → Language. Leave FTB Quests locale overrides blank and reopen the quest book. Custom items, hints, story text, and the updater follow your game language.

PCL users can use `config/fancymenu/assets/pack_icon.png` as the instance icon. Releases also include a 256×256 icon and a high-resolution logo.

## v0.2.0 changes

- Added 47 JEI display recipes for world interactions, data models, fishing, and lightning transformations.
- Updated inventory, crafting, JEI, quest, and hotbar visuals, with title and world-loading decorations.
- Added the star-core cursor, cyan double-ring click effects, button audio, and title music “Void Dawn”.
- Expanded Tips and Tricks to 36 entries and renamed Chapter 3 to “Void Dawn”.
- Added incremental updates, full-package fallback, file verification, and rollback on installation failure.

Full changelogs are available in [Releases](https://github.com/RainRaf-UwU/Path-Of-Creation/releases).

## Project structure and maintenance

| Directory | Contents |
| --- | --- |
| `kubejs/server_scripts` | Recipes, resource acquisition, game events, and custom machines |
| `kubejs/startup_scripts` | Custom item and block registration |
| `kubejs/client_scripts` | Client scripts |
| `kubejs/assets` / `kubejs/data` | Textures, models, language files, data, and recipes |
| `config/ftbquests/quests` | Quest chapters, dependencies, and bilingual text |
| `config/skyblockbuilder` | Skyblock generation settings and templates |
| `mods` | Installed mod files |
| [tools/poc-updater](../../tools/poc-updater/README.en.md) | Updater source, release steps, and installation details |
| `tools/poc-cursor` | Custom cursor source and artwork |

Official update packages are built by [GitHub Actions](../../.github/workflows/poc-update-release.yml). See the [updater README](../../tools/poc-updater/README.en.md) for publishing steps. Gameplay changes require a game reload and a check of the affected survival progression.

## Acknowledgements

Thank you to the mod authors and contributors whose work makes this pack possible, to [CFPAOrg and its translation contributors](https://github.com/CFPAOrg/Minecraft-Mod-Language-Package) for Simplified Chinese translations, and to the players who test the pack and report issues.

<details>
<summary>Mod list (261 JARs, including libraries and pack-specific mods)</summary>

| Mod | Authors |
| --- | --- |
| [AE2WTLib](https://github.com/Mari023/AE2WirelessTerminalLibrary/issues) | mari_023, Ridanisaurus |
| [AE2 Import Export Card](https://www.curseforge.com/minecraft/mc-mods/ae2-import-export-card) | Ultramega |
| [Corail Tombstone](https://www.curseforge.com/minecraft/mc-mods/corail-tombstone/) | Corail31 |
| [FTB Chunks](https://go.ftb.team/support-mod-issues) | FTB Team |
| [FTB Teams](https://go.ftb.team/support-mod-issues) | FTB Team |
| [FTB Quests](https://github.com/FTBTeam/FTB-Mods-Issues/issues) | FTB Team |
| FTB Backups 2 | CreeperHost |
| [Just Enough Items](https://www.curseforge.com/minecraft/mc-mods/jei) | mezz |
| [KubeJS Offline](https://www.curseforge.com/minecraft/mc-mods/kubejs-offline) | ILIKEPIEFOO2 |
| [MEGA Cells](https://github.com/62832/MEGACells/issues) | — |
| MEInfinityCell | Y_Xiao233 |
| [MCEF (Minecraft Chromium Embedded Framework)](https://github.com/CinemaMod/mcef/issues) | — |
| AE Omni Cells | Frostbite(Code), MHanHanBing(Art) |
| [RFToolsBase](http://github.com/McJtyMods/RFToolsBase/issues) | — |
| [RFToolsStorage](http://github.com/McJtyMods/RFToolsStorage/issues) | — |
| [RFToolsUtility](http://github.com/McJtyMods/RFToolsUtility/issues) | — |
| [RFToolsPower](http://github.com/McJtyMods/RFToolsPower/issues) | — |
| [YUNG's Better End Island](https://www.curseforge.com/minecraft/mc-mods/yungs-better-end-island-neoforge) | YUNGNICKYOUNG, Acarii |
| [Unusual End](https://www.curseforge.com/members/sweetygamer/projects) | Sweetygamer, SashaKYotoz |
| [Waystones](https://mods.twelveiterations.com/minecraft/waystones) | BlayTheNinth |
| PortalTransform | QiHuang02 |
| Gpu memory leak fix | Someaddon |
| [Cooking for Blockheads](https://mods.twelveiterations.com/minecraft/cookingforblockheads) | BlayTheNinth |
| Public GUI Announcement | AbsolemJackdaw |
| [Farming for Blockheads](https://mods.twelveiterations.com/minecraft/farming-for-blockheads) | BlayTheNinth |
| [Farmer's Delight](https://github.com/vectorwing/FarmersDelight) | vectorwing |
| [Iceberg](https://anthonyhilyard.com/) | Grend |
| Mob Grinding Utils | vadis365, flanks255 |
| Functional Storage | Buuz135, Rid |
| Torcherino | LukeGrahamLandry#6888, NinjaPhenix, sci4me, Moze_Intel, skniro |
| [Dynamic FPS](https://dapprgames.com/mods) | juliand665 & LostLuma |
| [IntegratedDynamics](https://github.com/CyclopsMC/IntegratedDynamics/issues) / [IntegratedDynamics-Compat](https://github.com/CyclopsMC/IntegratedDynamics/issues) | — |
| [Extended Crafting](https://blakesmods.com/extended-crafting) | BlakeBr0 |
| AE2:Crafting Tree | Neuvillette |
| [Crafting Tweaks](https://mods.twelveiterations.com/mc/craftingtweaks) | BlayTheNinth |
| [Reliquary Reincarnations](https://www.curseforge.com/minecraft/mc-mods/reliquary-reincarnations) | P3pp3rF1y |
| [Trash Cans](https://www.curseforge.com/minecraft/mc-mods/trash-cans) | SuperMartijn642 |
| [TrashSlot](https://mods.twelveiterations.com/minecraft/trashslot) | BlayTheNinth |
| [Polymorph](https://github.com/illusivesoulworks/polymorph) | Illusive Soulworks |
| [The Aether](https://modrinth.com/mod/aether) | AlphaMode, baguchi, bconlon, Blodhgarm, Burning Cactus, Drullkus, Hugo Payn, Jaryt, Katie 'Oz' Payn, quek, Raptor, reetam, RENREN, sunsette |
| [Artifacts](https://www.curseforge.com/minecraft/mc-mods/artifacts) | ochotonida |
| [Actually Additions](https://github.com/Ellpeck/ActuallyAdditions) | Ellpeck |
| [Silent Gear](https://github.com/SilentChaos512/Silent-Gear/issues) | SilentChaos512 |
| [PackagedAuto](https://www.curseforge.com/minecraft/mc-mods/packagedauto) | TheLMiffy1111 |
| [PackagedExCrafting](https://www.curseforge.com/minecraft/mc-mods/packagedexcrafting) | TheLMiffy1111 |
| [PackagedAvaritia:Re](https://www.curseforge.com/minecraft/mc-mods/packagedavaritia) | TheLMiffy1111 |
| [PackagedDraconic](https://www.curseforge.com/minecraft/mc-mods/packageddraconic) | TheLMiffy1111 |
| Industrial Foregoing | Buuz135 |
| Industrial Foregoing: Extra Upgrades | Y_Xiao233 |
| [Patchouli](https://github.com/VazkiiMods/Patchouli) | Vazkii |
| [Applied Energistics 2](https://appliedenergistics.org) | Team AppliedEnergistics |
| [Applied Mekanistics](https://github.com/AppliedEnergistics/Applied-Mekanistics#readme) | ramidzkh |
| [AppliedFlux](https://github.com/GlodBlock/ExtendedAE) | GlodBlock |
| [Building Gadgets 2](https://github.com/Direwolf20-MC/BuildingGadgets2) | Direwolf20 |
| [Construction Sticks](https://github.com/Mrbysco/ConstructionSticks) | Mrbysco, ShyNieke |
| OverloadedArmorBar | Jared |
| [Explorer's Compass](https://github.com/MattCzyr/ExplorersCompass) | ChaosTheDude |
| Carry On | Tschipp, PurpliciousCow |
| Ars Nouveau's Flavors & Delight | lcy0x1 |
| [Ars Nouveau](https://github.com/baileyholl/Ars-Nouveau) | Bailey Hollingsworth |
| [Journeymap](http://journeymap.info) | Techbrew, Mysticdrew |
| [Re-Avaritia](https://www.curseforge.com/minecraft/mc-mods/re-avaritia) | cnlimiter, IAFEnvoy, Asek3, MikhailTapio, cu6, NadienDev |
| [Solar Flux Reborn](https://modrinth.com/mod/4QG5lev4) | Zeitheron |
| More Functional Storage | Matyrobbrt |
| [NotEnoughAnimations](https://modrinth.com/mod/not-enough-animations) | tr7zw |
| Iron Furnaces | Qelifern (pizzaatime), XenoMustache |
| More Armor Trims | Masik16u |
| [Compact Machines](https://compactmods.dev) | Davenonymous, RobotGryphon |
| [Not Enough Wands](http://github.com/romelo333/notenoughwands1.8.8/issues) | — |
| [Better Advancements](https://www.curseforge.com/minecraft/mc-mods/better-advancements) | way2muchnoise |
| [Colorful Hearts](https://github.com/Terrails/colorful-hearts) | Terrails |
| [Ender IO](https://enderio.com/) | CrazyPants, tterrag, HenryLoenwind, MatthiasM, CyanideX, EpicSquid, Rover656, HypherionSA, liliandev, Ferri_Arnus, dphaldes |
| [Create](https://www.curseforge.com/minecraft/mc-mods/create) | simibubi |
| [Easy Villagers](https://www.curseforge.com/minecraft/mc-mods/easy-villagers) | Max Henkel |
| [Neat](https://github.com/VazkiiMods/Neat) | Vazkii, Uraneptus |
| [BotanyPots](https://www.curseforge.com/minecraft/mc-mods/botany-pots) | Darkhax |
| [Modular Routers](https://github.com/desht/ModularRouters/issues) | — |
| [Modonomicon](https://www.curseforge.com/minecraft/mc-mods/modonomicon) | Kli Kli |
| Gateways To Eternity | Shadows_of_Fire |
| [EverlastingAbilities](https://github.com/CyclopsMC/EverlastingAbilities/issues) | — |
| [Immersive Engineering](https://minecraft.curseforge.com/projects/immersive-engineering/) | BluSunrize and Damien A.W. Hazard |
| Torchmaster | Xalcon |
| [Item Zoom](https://github.com/mezz/ItemZoom/issues?q=is%3Aissue) | — |
| [Item Borders](https://anthonyhilyard.com/) | Grend |
| [Rhino](https://kubejs.com) | latvian.dev, Mozilla |
| [Jade](https://www.curseforge.com/minecraft/mc-mods/jade) | Snownee |
| [Mystical Agriculture](https://blakesmods.com/mystical-agriculture) | BlakeBr0 |
| [Mystical Agradditions](https://blakesmods.com/mystical-agradditions) | BlakeBr0 |
| [Occultism](https://www.curseforge.com/minecraft/mc-mods/occultism) | Kli Kli |
| [Skyblock Builder](https://github.com/ChaoticTrials/SkyblockBuilder) | MelanX |
| [curtain](https://github.com/Gu-ZT/Curtain/issues) | Gugle |
| [Simple Magnets](https://www.curseforge.com/minecraft/mc-mods/simple-magnets) | SuperMartijn642 |
| [Sophisticated Storage](https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage) | P3pp3rF1y, Ridanisaurus |
| [Sophisticated Core](https://www.curseforge.com/minecraft/mc-mods/sophisticated-core) | P3pp3rF1y |
| [Sophisticated Backpacks](https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks) | P3pp3rF1y, Ridanisaurus |
| [Redstone Pen](https://github.com/stfwi/redstonepen) | wilechaote |
| [Clumps](https://www.curseforge.com/minecraft/mc-mods/clumps) | Jared |
| [Stellaris](https://github.com/st0x0ef/Stellaris/issues) | The Stellaris Team |
| [I18nUpdateMod](https://github.com/xfl03/I18nUpdateMod3) | [{'name': 'xfl03', 'contact': {'homepage': 'https://github.com/xfl03'}}] |
| Click Machine | Shadows_of_Fire |
| NaturesAura | Ellpeck |
| [Nature's Compass](https://github.com/MattCzyr/NaturesCompass) | ChaosTheDude |
| [AppleSkin](https://github.com/squeek502/AppleSkin) | squeek |
| [MmmMmmMmmMmm](https://github.com/MehVahdJukaar/DuMmmMmmy/issues) | Mehvahdjukaar, Bonusboni, Gooigipunch, Plantkillable |
| [Tesseract](https://www.curseforge.com/minecraft/mc-mods/tesseract) | SuperMartijn642 |
| Twerk It Meal | TicTicBoom |
| [FTB Ultimine](https://go.ftb.team/support-mod-issues) | FTB Team |
| [Just Enough Characters](https://github.com/Towdium/JustEnoughCharacters) | Towdium, yzl210, Death-123, vfyjxf_ |
| [Mekanism](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| [Mekanism: Generators](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| [Mekanism: Tools](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| [Mekanism: Additions](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| [MekanismExtras](https://github.com/lostmyself8/Mekanism-Extras) | Lost Myself |
| [Mekanism: MoreMachine](https://github.com/lostmyself8/Mekanism-MoreMachine) | Lost Myself |
| [Flux Networks](https://www.curseforge.com/minecraft/mc-mods/flux-networks) | Sonar Sonic, BloCamLimb |
| [Configured](https://mrcrayfish.com/mods?id=configured) | MrCrayfish |
| Titanium | — |
| Sodium | JellySquid (jellysquid3), IMS212 |
| [HammerLib](https://modrinth.com/mod/PlkSuVtM) | Zeitheron |
| [Controlling](https://www.curseforge.com/minecraft/mc-mods/controlling) | Jaredlll08 |
| [EnchantmentDescriptions](https://www.curseforge.com/minecraft/mc-mods/enchantment-descriptions) | Darkhax |
| Cute Words | Rinko1231 |
| [IntegratedCrafting](https://github.com/CyclopsMC/IntegratedCrafting/issues) | — |
| [IntegratedTunnels](https://github.com/CyclopsMC/IntegratedTunnels/issues) / [IntegratedTunnels-Compat](https://github.com/CyclopsMC/IntegratedTunnels/issues) | — |
| [IntegratedTerminals](https://github.com/CyclopsMC/IntegratedTerminals/issues) / [IntegratedTerminals-Compat](https://github.com/CyclopsMC/IntegratedTerminals/issues) | — |
| [Advanced AE](https://github.com/pedroksl/AdvancedAE/issues) | Pedroksl |
| [AdvancedLootInfo](https://github.com/yanny7/advancedlootinfo/issues) | Yanny |
| [Mouse Tweaks](https://minecraft.curseforge.com/projects/mouse-tweaks) | Ivan Molodetskikh (YaLTeR) |
| Draconic Evolution | brandon3055 |
| [QuarryPlus](https://github.com/Kotori316/QuarryPlus) | Kotori316 |
| [AdvancedCoreInfo](https://github.com/yanny7/advancedlootinfo) | Yanny |
| AE2 JEI Integration | Tamaized, mezz |
| [AE2NetworkAnalyzer](https://github.com/GlodBlock/ExtendedAE) | GlodBlock |
| [AE2 QoL Recipes](https://github.com/Christofmeg/AE2-QoL-Recipes) | Christofmeg, Lafen99 |
| AEInfinityBooster | Hexeption |
| Allthemodium | thevortex, whatthedrunk |
| AllTheOres | thevortex, whatthedrunk, Satherov |
| [AntiBlocksReChiseled](https://github.com/manmaed/AntiBlocksReChiseled/issues) | manmaed |
| Apothic Attributes | Shadows_of_Fire |
| Apothic Enchanting | Shadows_of_Fire |
| Apothic Spawners | Shadows_of_Fire |
| AppliedSoul | Y_Xiao233 |
| [Architectury](https://github.com/shedaniel/architectury/issues) | shedaniel |
| [Ars Additions](https://github.com/Jarva/Ars-Additions/issues) | Jarva |
| [Ars Caelum](https://github.com/baileyholl/ars-caelum/issues) | Bailey |
| [Ars Creo](https://github.com/baileyholl/ars-creo/issues) | Bailey |
| [Ars Ocultas](https://github.com/dphaldes/Ars-Ocultas/issues) | mystchonky |
| [Ars Énergistique](https://github.com/62832/ArsEnergique/issues) | — |
| [Athena](https://modrinth.com/mod/athena-ctm) | ThatGravyBoat |
| [Balm](https://mods.twelveiterations.com/) | BlayTheNinth |
| [Bookshelf](https://www.curseforge.com/minecraft/mc-mods/bookshelf) | Darkhax |
| [Brandon's Core](https://github.com/Draconic-Inc/BrandonsCore) | brandon3055 |
| [Cloth Config v15 API](https://github.com/architectury/ClothConfig/issues/) | — |
| Cobblegen Galore | LobsterJonn |
| [CodeChicken Lib](https://www.curseforge.com/minecraft/mc-mods/codechicken-lib-1-8) | ChickenBones, covers1624 |
| [CommonCapabilities](https://github.com/CyclopsMC/CommonCapabilities/issues) | — |
| [Cryonic Config](https://github.com/matthewperiut/cryonicconfig/issues) | Slainlight |
| [Cucumber Library](https://blakesmods.com/cucumber) | BlakeBr0 |
| Cupboard mod | Someaddon |
| [Curios API](https://github.com/TheIllusiveC4/Curios) | C4 |
| [Custom Machinery](https://www.curseforge.com/minecraft/mc-mods/custom-machinery) | Frinn |
| [Custom Machinery Mekanism](https://www.curseforge.com/minecraft/mc-mods/custom-machinery-mekanism) | Frinn |
| [Cyclops Core](https://github.com/CyclopsMC/CyclopsCore/issues) | — |
| DailyShop | KaptainWutax |
| Dank Storage | Tfarcenim |
| [Default World Type](https://github.com/ChaoticTrials/DefaultWorldType) | MelanX |
| [DimStorage](https://github.com/Edivad99/DimStorage/issues) | Edivad99 |
| [Dis-Enchanting Table](https://github.com/Cursee-Development) | Lupin, Jason13 |
| [EdivadLib](https://github.com/Edivad99/EdivadLib/issues) | Edivad99 |
| [Entangled](https://www.curseforge.com/minecraft/mc-mods/entangled) | SuperMartijn642 |
| [ExtendedAE](https://github.com/GlodBlock/ExtendedAE) | GlodBlock |
| [ExtendedAE-Plus](https://github.com/GaLicn/ExtendedAE_Plus) | GaLi |
| FancyMenu | Keksuccino |
| FlowTech | BlockLogic Modding |
| [Forgified Fabric API](https://github.com/Sinytra/ForgifiedFabricAPI) / [Forgified Fabric API (dummy)](https://github.com/Sinytra/ForgifiedFabricAPI) | Sinytra, FabricMC |
| [FTB Filter System](https://www.curseforge.com/minecraft/mc-mods/ftb-filter-system) | FTB Team |
| FTB Jei Extras | FTB Team |
| [FTB Library](https://go.ftb.team/support-mod-issues) | FTB Team |
| FTB XMod Compat | FTB Team |
| [Fusion](https://www.curseforge.com/minecraft/mc-mods/fusion-connected-textures) | SuperMartijn642 |
| [GeckoLib 4](http://geckolib.com/) | Gecko, Eliot, AzureDoom, DerToaster, Tslat, Witixin |
| [Glassential-renewed](https://www.curseforge.com/minecraft/mc-mods/glassential-renewed) | Big_Energy |
| [Glodium](https://github.com/GlodBlock/Glodium) | GlodBlock |
| [GuideME](https://github.com/AppliedEnergistics/GuideME/) | — |
| Hostile Neural Networks | Shadows_of_Fire |
| [Hyperbox](https://www.curseforge.com/minecraft/mc-mods/hyperbox) | Commoble |
| [Immersive Energistics](https://github.com/AppliedEnergistics/Immersive-Energistics) | Technici4n |
| Industrial Foregoing Souls | Buuz135, Rid |
| Industrial Foregoing Additional | MrPup(minecraftkus) |
| Iris Flywheel Compat | Leon |
| Iris | coderbot, IMS212 |
| [Item Collectors](https://www.curseforge.com/minecraft/mc-mods/item-collectors) | SuperMartijn642 |
| [Jade Addons](https://www.curseforge.com/minecraft/mc-mods/jade-addons) | Snownee |
| Just Enough Immersive Multiblocks | sguest |
| [JourneyMap Integration](https://www.curseforge.com/minecraft/mc-mods/journeymap-integration) | frankV |
| Just Dire Things | Direwolf20 |
| [Just Enough Mekanism Multiblocks](https://curseforge.com/minecraft/mc-mods/just-enough-mekanism-multiblocks) | gisellevonbingen |
| [Just Enough Resources](https://www.curseforge.com/minecraft/mc-mods/just-enough-resources-jer) | way2muchnoise |
| [Kiwi Library](https://www.curseforge.com/minecraft/mc-mods/kiwi) | Snownee |
| Konkrete | Keksuccino |
| Kotlin for Forge | — |
| [KubeJS Mekanism](https://kubejs.com) | latvian.dev |
| [KubeJS](https://kubejs.com) | latvian.dev |
| [KubeJS Actually Additions](https://github.com/AlmostReliable/kubejs_actuallyadditions/issues) | Almost Reliable |
| KubeJS Assets Override | HP |
| KubeJS Nature's Aura | FalAut |
| kubejsarsnouveau | Bob Varioa |
| KubeJS Powah | BobVarioa |
| [LaserIO](https://github.com/Direwolf20-MC/LaserIO) | Direwolf20, ErrorMikey |
| [libIPN](https://github.com/blackd/libIPN) | Mirinimi |
| [LibX](https://github.com/ModdingX/LibX) | ModdingX |
| [LootJS](https://github.com/AlmostReliable/lootjs/issues) | AlmostReliable |
| [Lychee Tweaker](https://www.curseforge.com/minecraft/mc-mods/lychee) | Snownee |
| [MaxHealthFix](https://www.curseforge.com/minecraft/mc-mods/max-health-fix) | Darkhax |
| [McJtyLib](http://github.com/McJtyMods/McJtyLib/issues) | — |
| [Mekanism Unleashed](https://www.curseforge.com/minecraft/mc-mods/mekanism-unleashed) | WhitePhantom |
| Mekanistic Routers | Matyrobbrt |
| Melody | Keksuccino |
| [ME Requester](https://github.com/AlmostReliable/merequester/issues) | Almost Reliable |
| [More Industrial Foregoing Addons](https://github.com/Christofmeg/MoreIndustrialForegoingAddons) | Christofmeg |
| [MonoLib](https://github.com/Mods-For-Lupin/MonoLib) | Lupin, Jason13 |
| [Moonlight Lib](https://github.com/MehVahdJukaar/moonlight/issues) | MehVahdJukaar |
| [Mystical Customization](https://blakesmods.com/mystical-customization) | BlakeBr0 |
| [Occultism KubeJS](https://www.curseforge.com/minecraft/mc-mods/occultism-kubejs) | Kli Kli |
| Oracle Index | Me! - Rearth |
| [Oritech](https://github.com/Rearth/Oritech/issues) | Me! - Rearth |
| Oritech Things | Lumengrid,muroalparco,MtcLeo05,DevDyna,Sirios_dev |
| oωo | glisco, Blodhgarm, BasiqueEvangelist, Noaaan |
| [Pipez](https://www.curseforge.com/minecraft/mc-mods/pipez) | Max Henkel |
| Placebo | Shadows_of_Fire |
| [Plushie Mod](https://github.com/Link4real/Plushie-Mod/issues) | Link4real, Vento |
| [创世之径 · 光标](https://github.com/RainRaf-UwU/Path-Of-Creation) | RainRaf-UwU |
| [创世之径自动更新](https://github.com/RainRaf-UwU/Path-Of-Creation) | RainRaf-UwU |
| [Polymorphic Energistics](https://github.com/62832/PolymorphicEnergistics/issues) | — |
| [PolyLib](https://github.com/CreeperHost/PolyLib/issues) | CreeperHost |
| [Potentials](https://github.com/Fej1Dev/Potentials/issues) | Fej1Fun |
| [Powah](https://www.curseforge.com/minecraft/mc-mods/powah-rearchitected) | owmii,Technici4n,shartte |
| [PrickleMC](https://www.curseforge.com/minecraft/mc-mods/prickle) | Darkhax |
| [Prism](https://anthonyhilyard.com/) | Grend |
| [ProbeJS](https://github.com/Prunoideae/ProbeJS) | Prunoideae |
| Property Modifier | IchHabeHunger54 |
| [Psi](https://github.com/VazkiiMods/Psi/issues) | Vazkii, Wiiv, WireSegal, Kamefrede, Williewillus, Hubry, Dudblockman, TheidenHD |
| [Pylons](https://www.curseforge.com/minecraft/mc-mods/pylons) | — |
| Path of Creation ME Controller Size | — |
| RenderJS | chen_1335 |
| [Replay Mod](https://github.com/ReplayMod/ReplayMod/issues) | — |
| ScalableCatsForce | — |
| [Searchables](https://www.curseforge.com/minecraft/mc-mods/searchables) | Jaredlll08 |
| [Shrink](https://github.com/gigabit101/Shrink/issues) | Gigabit101 |
| [Silent Lib](https://github.com/SilentChaos512/SilentLib/issues) | SilentChaos512 |
| [Sky GUIs](https://wiki.chaotictrials.de/swl/sky-guis) | MelanX |
| [SmartBrainLib](https://github.com/Tslat/SmartBrainLib/issues) | Tslat |
| Soulplied Energistics | Buuz135 |
| [Super Factory Manager (SFM)](https://github.com/TeamDman/SuperFactoryManager/issues) | TeamDman |
| [SuperMartijn642's Config Library](https://www.curseforge.com/minecraft/mc-mods/supermartijn642s-config-lib) | SuperMartijn642 |
| [SuperMartijn642's Core Lib](https://www.curseforge.com/minecraft/mc-mods/supermartijn642s-core-lib) | SuperMartijn642 |
| Time In A Bottle | RealMangoRage, MangoRage |
| [Time in a bottle Curio Support](https://www.curseforge.com/minecraft/mc-mods/time-in-a-bottle-curio-support) | MangoRage, bananasplit50, JustDoom |
| Utilitarian | LobsterJonn |
| [XNet](http://github.com/McJtyMods/XNet/issues) | — |
| [YUNG's API](https://www.curseforge.com/minecraft/mc-mods/yungs-api-neoforge) | YUNGNICKYOUNG |

This list follows the current `mods` directory. Author credits come from mod metadata; “—” means no author was listed. Project links lead to author information, source code, or issue trackers.

</details>

## Feedback and licensing

Please [open an issue](https://github.com/RainRaf-UwU/Path-Of-Creation/issues) with the pack version, reproduction steps, and relevant logs or screenshots. Remove account details and other personal information before uploading.

Original code is licensed under the [MIT License](../../LICENSE). Third-party mods, resource packs, and shaders retain their own licenses. CFPAOrg translations use [CC BY-NC-SA 4.0](https://github.com/CFPAOrg/Minecraft-Mod-Language-Package/blob/main/LICENSE).
