"""Generate compatible full updates and file-level delta ZIPs."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import zipfile
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[2]
PACK = "config/poc-updater/pack.json"
BASELINE = "config/poc-updater/baseline.json"
ASSET = "path-of-creation-update.zip"
MANIFEST = "poc-update.json"
DELTA = "poc-delta.json"
MAX_BYTES = 8 * 1024 ** 3


def allowed(path):
    # Keep this policy in sync with UpdateCore.allowed; tests check representative paths.
    if not path or "\\" in path or ":" in path:
        return False
    for part in path.split("/"):
        if (part in ("", ".", "..") or part.endswith((".", " ")) or any(ord(c) < 32 for c in part)
                or re.fullmatch(r"(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\..*)?", part, re.I)):
            return False
    p = path.lower()
    if re.search(r"credential|password|secret|token|account|session|auth", p):
        return False
    if re.fullmatch(r".*\.(?:bak|log|tmp|key|pem|p12|pfx|keystore)", p) or "/." in p:
        return False
    if path in (PACK, BASELINE):
        return True
    if p.startswith("mods/"):
        return path.count("/") == 1 and p.endswith(".jar")
    if p.startswith("kubejs/"):
        return bool(re.fullmatch(r"kubejs/(assets|data|client_scripts|server_scripts|startup_scripts|event_groups)/.+", p)) and not p.endswith("jsconfig.json")
    if p.startswith("config/"):
        if p.startswith(("config/poc-updater/", "config/modpack-update-checker/")):
            return False
        if re.fullmatch(r".*(?:[-/]client\.(?:toml|json|snbt)|[-/]client-[0-9]+\.toml)", p):
            return False
        if re.fullmatch(r"config/(sodium.*|iris.*|replaymod.*|jei/.*|inventoryprofilesnext/.*|mcef/.*|.*fingerprint.*)", p):
            return False
        if p.startswith(("config/ars_nouveau/search_index/", "config/skyblockbuilder/data/")) or p == "config/brandon3055/contributors.json":
            return False
        return True
    return bool(re.fullmatch(r"(?:defaultconfigs|resourcepacks|shaderpacks|patchouli_books)/.+", p)) or p.startswith("skyblockbuilder/exports/")


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def info(data):
    return {"sha256": hashlib.sha256(data).hexdigest(), "size": len(data)}


def file_info(file):
    digest = hashlib.sha256()
    with file.open("rb") as stream:
        for chunk in iter(lambda: stream.read(128 * 1024), b""):
            digest.update(chunk)
    return {"sha256": digest.hexdigest(), "size": file.stat().st_size}


def candidates(root):
    # Tracked + non-ignored new files includes the author's current working changes.
    output = subprocess.check_output(["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], cwd=root)
    names = set(output.decode("utf-8").split("\0"))
    names.add(PACK)
    result = []
    for name in sorted(names):
        if name == BASELINE or not allowed(name):
            continue
        file = root / name
        if not file.is_file():
            continue  # Deleted old JARs are not published.
        if file.is_symlink() or file.resolve() != file.absolute() or not file.resolve().is_relative_to(root.resolve()):
            raise ValueError("Linked files cannot be published: " + name)
        result.append(name)
    folded = [p.lower() for p in result]
    if len(folded) != len(set(folded)):
        raise ValueError("Case-insensitive duplicate file names")
    if "mods/poc-updater-1.0.0.jar" not in result:
        raise ValueError("Build the updater mod first")
    return result


def manifest(pack, files):
    if sum(f["size"] for f in files.values()) > MAX_BYTES or len(files) > 50000:
        raise ValueError("Update exceeds installer limits")
    return {"schema": 1, "version": pack["version"], "minecraft": pack["minecraft"], "neoforge": pack["neoforge"], "files": files}


def version_parts(value):
    if not isinstance(value, str) or not re.fullmatch(r"[vV]?\d+(?:\.\d+){1,3}", value):
        raise ValueError("Invalid numeric version")
    parts = tuple(map(int, value.lstrip("vV").split(".")))
    return parts + (0,) * (4 - len(parts))


def validate_base(base, target):
    if (not isinstance(base, dict) or base.get("schema") != 1 or not isinstance(base.get("files"), dict)
            or not base["files"] or len(base["files"]) > 50000 or PACK not in base["files"]):
        raise ValueError("Invalid delta base manifest")
    if version_parts(base.get("version")) >= version_parts(target["version"]):
        raise ValueError("Delta base must be older than target")
    if any(base.get(key) != target[key] for key in ("minecraft", "neoforge")):
        raise ValueError("Delta base requires different Minecraft/NeoForge")
    folded = set()
    total = 0
    for path, value in base["files"].items():
        if (not allowed(path) or path.lower() in folded or not isinstance(value, dict)
                or not re.fullmatch(r"[a-fA-F0-9]{64}", value.get("sha256", ""))
                or type(value.get("size")) is not int or not 0 <= value["size"] <= MAX_BYTES):
            raise ValueError("Invalid delta base file: " + path)
        folded.add(path.lower())
        total += value["size"]
    if total > MAX_BYTES:
        raise ValueError("Delta base exceeds installer limits")
    prior_paths = {p.lower():p for p in base["files"]}
    for path in target["files"]:
        if path.lower() in prior_paths and prior_paths[path.lower()] != path:
            raise ValueError("Delta cannot rename paths by case only: " + path)


def write_archive(root, archive, final, paths, generated, delta=None):
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zip_file:
        for path in sorted(paths):
            if path in generated:
                zip_file.writestr(path, generated[path])
            else:
                digest = hashlib.sha256()
                size = 0
                with (root / path).open("rb") as stream, zip_file.open(path, "w", force_zip64=True) as out:
                    for chunk in iter(lambda: stream.read(128 * 1024), b""):
                        digest.update(chunk)
                        size += len(chunk)
                        out.write(chunk)
                if digest.hexdigest() != final["files"][path]["sha256"] or size != final["files"][path]["size"]:
                    raise ValueError("File changed while packaging: " + path)
        zip_file.writestr(MANIFEST, json_bytes(final))
        if delta is not None:
            zip_file.writestr(DELTA, json_bytes(delta))
    if archive.stat().st_size >= 2 * 1024 ** 3:
        raise ValueError("Update ZIP exceeds GitHub's 2 GiB per-asset limit")
    digest = file_info(archive)["sha256"]
    archive.with_name(archive.name + ".sha256").write_text(digest + "  " + archive.name + "\n", encoding="ascii")
    return digest


def package(root, version=None, notes=None, output=None, baseline=False, bases=()):
    pack = json.loads((root / PACK).read_text(encoding="utf-8-sig"))
    if version is not None:
        if not re.fullmatch(r"[vV]?\d+(?:\.\d+){1,3}", version):
            raise ValueError("Release tag must be numeric, such as v0.0.5")
        pack["version"] = version.lstrip("vV")
    if notes is not None:
        pack["changelog"] = notes
    data = json_bytes(pack)
    paths = candidates(root)
    files = {p: info(data) if p == PACK and not baseline else file_info(root / p) for p in paths}
    initial = manifest(pack, files)
    if baseline:
        target = root / BASELINE
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(json_bytes(initial))
        print(f"Bootstrap v{pack['version']}: {len(files)} managed files, {sum(f['size'] for f in files.values()):,} bytes")
        return initial
    if output is None:
        raise ValueError("Output directory required")
    baseline_data = json_bytes(initial)
    files[BASELINE] = info(baseline_data)
    final = manifest(pack, files)
    # Reject bad bases before writing any release artifacts.
    base_versions = set()
    for base in bases:
        validate_base(base, final)
        key = version_parts(base["version"])
        if key in base_versions:
            raise ValueError("Duplicate delta base version")
        base_versions.add(key)
    output.mkdir(parents=True, exist_ok=True)
    archive = output / ASSET
    generated = {PACK: data, BASELINE: baseline_data}
    digest = write_archive(root, archive, final, files, generated)
    (output / MANIFEST).write_bytes(json_bytes(final))
    tag = version if version is not None else "v" + pack["version"]
    page = "https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/" + quote(tag, safe="")
    prefix = "https://github.com/RainRaf-UwU/Path-Of-Creation/releases/download/" + quote(tag, safe="") + "/"
    download = prefix + ASSET
    deltas = []
    assets = [ASSET, ASSET + ".sha256", MANIFEST]
    for base in bases:
        changed = sorted(p for p, f in files.items() if p in (PACK, BASELINE) or base["files"].get(p) != f)
        removed = sorted(set(base["files"]) - set(files) - {BASELINE})
        delta = {"schema": 1, "base": base, "files": changed, "removed": removed}
        name = "path-of-creation-delta-from-v" + base["version"].lstrip("vV") + ".zip"
        path = output / name
        delta_digest = write_archive(root, path, final, changed, generated, delta)
        deltas.append({"from": base["version"].lstrip("vV"), "download": prefix + name,
                       "digest": "sha256:" + delta_digest, "checksum": prefix + name + ".sha256", "size": path.stat().st_size})
        assets.extend([name, name + ".sha256"])
        print(f"Delta v{base['version']} -> v{pack['version']}: {len(changed)} payload files, {len(removed)} removals, ZIP {path.stat().st_size:,} bytes")
    (output / "latest.json").write_bytes(json_bytes({"version": pack["version"], "notes": pack.get("changelog", ""),
        "page": page, "download": download, "digest": "sha256:" + digest, "checksum": download + ".sha256", "size": archive.stat().st_size,
        "deltas": deltas}))
    (output / "assets.txt").write_text("\n".join(assets) + "\n", encoding="utf-8")
    print(f"Release v{pack['version']}: {len(files)} files, ZIP {archive.stat().st_size:,} bytes")
    print(archive)
    return final


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--baseline", action="store_true", help="Create initial ownership for the current client")
    parser.add_argument("--version", help="GitHub release tag, e.g. v0.0.5")
    parser.add_argument("--notes-file", type=Path)
    parser.add_argument("--output", type=Path, default=ROOT / "dist/poc-updater")
    parser.add_argument("--base-manifest", type=Path, action="append", default=[], help="Previous published manifest; repeat for direct cross-version deltas")
    parser.add_argument("--bases-dir", type=Path, help="Directory of previous published manifests selected by Actions")
    args = parser.parse_args()
    if args.baseline and (args.version or args.notes_file or args.base_manifest or args.bases_dir):
        parser.error("--baseline always snapshots the currently installed version")
    paths = args.base_manifest + (sorted(args.bases_dir.glob("*.json")) if args.bases_dir else [])
    bases = [json.loads(path.read_text(encoding="utf-8-sig")) for path in paths]
    package(args.root.resolve(), args.version, args.notes_file.read_text(encoding="utf-8") if args.notes_file else None,
            args.output.resolve(), args.baseline, bases)


if __name__ == "__main__":
    main()
