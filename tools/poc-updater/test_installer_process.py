"""Exercise the actual standalone helper and its wait-for-game-exit behavior."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import time
import zipfile
import sys
import package_release as release


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--java", type=Path, required=True)
    parser.add_argument("--mod", type=Path, required=True)
    args = parser.parse_args()
    for delta_mode in (False, True):
        run(args, delta_mode)


def run(args, delta_mode):
    root = Path(tempfile.mkdtemp(prefix="poc-installer-process-"))
    subprocess.run(["git", "init", "-q", str(root)], check=True)
    for path, value in {
        release.PACK: json.dumps({"version": "0.0.4", "minecraft": "1.21.1", "neoforge": "21.1.255", "changelog": "old notes"}),
        "mods/poc-updater-1.0.0.jar": "test updater", "mods/old.jar": "old mod",
        "mods/keep.jar": "unchanged mod",
        "saves/World/level.dat": "survival save", "options.txt": "keys",
    }.items():
        target = root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(value, encoding="utf-8")
    base = release.package(root, baseline=True)
    keep_mtime = (root / "mods/keep.jar").stat().st_mtime_ns
    next_mod = root / "mods/new.jar"
    next_mod.write_text("new mod", encoding="utf-8")
    (root / "mods/old.jar").unlink()
    work = root / "local/poc-updater"
    manifest = release.package(root, "v0.0.5", "测试新版本更新内容", work, bases=[base] if delta_mode else [])
    (root / "mods/old.jar").write_text("old mod", encoding="utf-8")
    next_mod.unlink()
    (root / "mods/personal.jar").write_text("personal mod", encoding="utf-8")
    archive = work / ("path-of-creation-delta-from-v0.0.4.zip" if delta_mode else release.ASSET)
    archive.rename(work / "update.zip")
    with zipfile.ZipFile(args.mod) as mod:
        helper = work / "installer.jar"
        helper.write_bytes(mod.read("poc-updater-helper.jar"))
    dummy_game = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(120)"])
    helper_process = None
    try:
        job = {"parentPid": dummy_game.pid, "version": "0.0.5", "minecraft": "1.21.1", "neoforge": "21.1.255",
               "sha256": hashlib.sha256((work / "update.zip").read_bytes()).hexdigest()}
        (work / "pending.json").write_text(json.dumps(job), encoding="utf-8")
        helper_process = subprocess.Popen([str(args.java), "-jar", str(helper), str(root)], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        time.sleep(1)
        assert helper_process.poll() is None, "Installer must wait while the game process is alive"
        assert (root / "mods/old.jar").read_text() == "old mod"
        assert json.loads((root / release.PACK).read_text())["version"] == "0.0.4"
        dummy_game.terminate()
        dummy_game.wait(timeout=10)
        output, _ = helper_process.communicate(timeout=20)
        assert helper_process.returncode == 0, output.decode("utf-8", errors="replace")
        assert not (root / "mods/old.jar").exists()
        assert (root / "mods/new.jar").read_text() == "new mod"
        assert json.loads((root / release.PACK).read_text(encoding="utf-8"))["version"] == "0.0.5"
        assert (root / "saves/World/level.dat").read_text() == "survival save"
        assert (root / "options.txt").read_text() == "keys"
        assert (root / "mods/personal.jar").read_text() == "personal mod"
        assert (root / "mods/keep.jar").read_text() == "unchanged mod"
        assert json.loads((work / "installed.json").read_text(encoding="utf-8")) == manifest
        if delta_mode:
            assert (root / "mods/keep.jar").stat().st_mtime_ns == keep_mtime, "Retained mod must not be rewritten"
        assert not (work / "pending.json").exists()
        assert json.loads((work / "result.json").read_text(encoding="utf-8"))["success"] is True
        print("PASS:", "delta" if delta_mode else "full", "standalone helper waits for exit, installs Python-generated ZIP, preserves world/keys/extra mods and reports success")
        print("Process fixture:", root)
    finally:
        if dummy_game.poll() is None:
            dummy_game.terminate()
            dummy_game.wait(timeout=10)
        if helper_process is not None and helper_process.poll() is None:
            helper_process.terminate()
            helper_process.wait(timeout=10)


if __name__ == "__main__":
    main()
