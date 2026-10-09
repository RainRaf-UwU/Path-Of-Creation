import json
import hashlib
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
import zipfile
import package_release as release


class PackageTest(unittest.TestCase):
    def fixture(self):
        root = Path(tempfile.mkdtemp(prefix="poc-delta-package-test-"))
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        for path, value in {
            release.PACK: release.json_bytes({"version":"0.0.4", "minecraft":"1.21.1", "neoforge":"21.1.255", "changelog":"old"}),
            "mods/poc-updater-1.0.0.jar": b"test updater",
            "mods/keep.jar": os.urandom(128 * 1024),
            "mods/deleted.jar": b"obsolete mod",
            "config/gameplay.toml": b"old gameplay",
            "saves/World/level.dat": b"survival save",
            "options.txt": b"player settings",
        }.items():
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(value)
        base = release.package(root, baseline=True)
        (root / "mods/deleted.jar").unlink()
        (root / "mods/new.jar").write_bytes(b"new mod")
        (root / "config/gameplay.toml").write_bytes(b"new gameplay")
        return root, base

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

    def test_delta_payload_and_complete_target(self):
        root, base = self.fixture()
        output = root / "output"
        target = release.package(root, "v0.0.5", "新版本", output, bases=[base])
        feed = json.loads((output / "latest.json").read_bytes())
        asset = feed["deltas"][0]
        path = output / asset["download"].split("/")[-1]
        self.assertLess(asset["size"], feed["size"] // 4)
        self.assertEqual(asset["from"], "0.0.4")
        self.assertEqual(asset["size"], path.stat().st_size)
        self.assertEqual(asset["digest"], "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest())
        with zipfile.ZipFile(path) as zip_file:
            delta = json.loads(zip_file.read(release.DELTA))
            self.assertEqual(delta["removed"], ["mods/deleted.jar"])
            self.assertEqual(delta["base"], base)
            self.assertEqual(json.loads(zip_file.read(release.MANIFEST)), target)
            self.assertEqual(set(zip_file.namelist()), set(delta["files"]) | {release.MANIFEST, release.DELTA})
            self.assertNotIn("mods/keep.jar", zip_file.namelist())
            self.assertNotIn("mods/poc-updater-1.0.0.jar", zip_file.namelist())
            for name in delta["files"]:
                self.assertEqual(release.info(zip_file.read(name)), target["files"][name])
        self.assertIn("mods/keep.jar", target["files"])
        self.assertEqual(json.loads((output / release.MANIFEST).read_bytes()), target)
        expected_assets = {release.ASSET, release.ASSET + ".sha256", release.MANIFEST, path.name, path.name + ".sha256"}
        self.assertEqual(set((output / "assets.txt").read_text().splitlines()), expected_assets)
        self.assertEqual((root / "saves/World/level.dat").read_bytes(), b"survival save")
        self.assertEqual((root / "options.txt").read_bytes(), b"player settings")
        self.assertEqual(json.loads((root / release.PACK).read_bytes())["version"], "0.0.4")

    def test_direct_deltas_from_multiple_bases(self):
        root, base = self.fixture()
        older = json.loads(json.dumps(base))
        older["version"] = "0.0.3"
        output = root / "output"
        release.package(root, "v0.0.6", "notes", output, bases=[base, older])
        feed = json.loads((output / "latest.json").read_bytes())
        self.assertEqual([d["from"] for d in feed["deltas"]], ["0.0.4", "0.0.3"])
        for asset in feed["deltas"]:
            with zipfile.ZipFile(output / asset["download"].split("/")[-1]) as archive:
                self.assertEqual(json.loads(archive.read(release.MANIFEST))["version"], "0.0.6")

    def test_invalid_bases_fail_before_publication(self):
        root, base = self.fixture()
        invalid = []
        for key, value in (("schema",2),("version","0.0.5"),("neoforge","21.1.254")):
            other = json.loads(json.dumps(base)); other[key] = value; invalid.append(other)
        unsafe = json.loads(json.dumps(base)); unsafe["files"]["saves/World/level.dat"] = release.info(b"save"); invalid.append(unsafe)
        case = json.loads(json.dumps(base)); case["files"]["mods/KEEP.jar"] = case["files"].pop("mods/keep.jar"); invalid.append(case)
        for other in invalid:
            with self.assertRaises(ValueError):
                release.package(root, "v0.0.5", "notes", root / "invalid-output", bases=[other])
        self.assertFalse((root / "invalid-output").exists())
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            release.package(root, "v0.0.5", "notes", root / "invalid-output", bases=[base,base])

    def test_reused_output_does_not_publish_stale_deltas(self):
        root, base = self.fixture()
        output = root / "output"
        release.package(root, "v0.0.5", "notes", output, bases=[base])
        release.package(root, "v0.0.6", "notes", output)
        self.assertEqual(json.loads((output / "latest.json").read_bytes())["deltas"], [])
        self.assertEqual((output / "assets.txt").read_text().splitlines(), [release.ASSET, release.ASSET + ".sha256", release.MANIFEST])


if __name__ == "__main__":
    unittest.main()
