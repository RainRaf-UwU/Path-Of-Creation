import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import zipfile
import package_release as release


class PackageTest(unittest.TestCase):
    def test_publish_current_files_and_protect_player_state(self):
        root = Path(tempfile.mkdtemp(prefix="poc-package-test-"))
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        values = {
            release.PACK: json.dumps({"version": "0.0.4", "minecraft": "1.21.1", "neoforge": "21.1.255", "changelog": "old"}),
            "mods/poc-updater-1.0.0.jar": "test updater", "mods/current.jar": "current mod",
            "kubejs/server_scripts/recipe.js": "current recipe",
            "config/ftbquests/quests/chapters/1111.snbt": "current quest",
            "options.txt": "player options", "saves/World/level.dat": "player save",
            "config/ae2-client.toml": "client preferences", "config/sodium-options.json": "graphics preferences",
            "local/poc-updater/state.json": "popup state", "kubejs/config/web_server.json": "test-only placeholder",
            "mods/mcef-cache/cache.bin": "cache", "design/draft.txt": "local design",
        }
        for path, value in values.items():
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(value, encoding="utf-8")
        old = root / "mods/deleted.jar"
        old.write_bytes(b"old mod")
        subprocess.run(["git", "add", "mods/deleted.jar"], cwd=root, check=True)
        old.unlink()
        initial = release.package(root, baseline=True)
        self.assertEqual(initial["version"], "0.0.4")
        next_manifest = release.package(root, "v0.0.5", "中文更新说明", root / "output")
        with zipfile.ZipFile(root / "output" / release.ASSET) as archive:
            published = set(archive.namelist())
            self.assertIn("mods/current.jar", published)
            self.assertIn("config/ftbquests/quests/chapters/1111.snbt", published)
            for protected in values.keys() - initial["files"].keys():
                self.assertNotIn(protected, published)
            self.assertNotIn("mods/deleted.jar", published)
            pack = json.loads(archive.read(release.PACK))
            self.assertEqual(pack["version"], "0.0.5")
            self.assertEqual(pack["changelog"], "中文更新说明")
            self.assertEqual(set(next_manifest["files"]) | {"poc-update.json"}, published)
        self.assertEqual(json.loads((root / release.PACK).read_text())["version"], "0.0.4")
        self.assertTrue((root / "output" / (release.ASSET + ".sha256")).is_file())
        feed = json.loads((root / "output/latest.json").read_text(encoding="utf-8"))
        self.assertEqual(feed["version"], "0.0.5")
        self.assertEqual(feed["notes"], "中文更新说明")
        self.assertTrue(feed["download"].endswith("/v0.0.5/" + release.ASSET))
        self.assertEqual(feed["size"], (root / "output" / release.ASSET).stat().st_size)
        print("Cross-language fixture:", root / "output" / release.ASSET)

    def test_protected_paths(self):
        for path in ["../mods/a.jar", "mods/a.jar:stream", "mods/a.jar\\escape", "saves/a/level.dat",
                     "config/auth.json", "mods/CON.jar", "mods/a.jar.", "mods/a.jar/", "options.txt"]:
            self.assertFalse(release.allowed(path), path)


if __name__ == "__main__":
    unittest.main()
