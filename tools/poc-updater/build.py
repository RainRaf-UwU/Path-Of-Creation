"""Build against an installed 1.21.1/NeoForge instance without Gradle downloads."""
import argparse
import io
import json
from pathlib import Path
import shutil
import subprocess
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--jdk", type=Path, required=True)
    parser.add_argument("--libraries", type=Path, required=True)
    parser.add_argument("--version-json", type=Path, required=True)
    parser.add_argument("--test", action="store_true")
    args = parser.parse_args()
    metadata = json.loads(args.version_json.read_text(encoding="utf-8-sig"))
    neo = "21.1.255"
    game = "1.21.1-20240808.144430"
    jars = [args.libraries / f"net/neoforged/neoforge/{neo}/neoforge-{neo}-client.jar",
            args.libraries / f"net/neoforged/neoforge/{neo}/neoforge-{neo}-universal.jar",
            args.libraries / f"net/minecraft/client/{game}/client-{game}-srg.jar"]
    for lib in metadata["libraries"]:
        artifact = lib.get("downloads", {}).get("artifact", {}).get("path")
        if artifact and (args.libraries / artifact).is_file():
            jars.append(args.libraries / artifact)
    jars = list(dict.fromkeys(p.resolve() for p in jars))
    missing = [str(p) for p in jars[:3] if not p.is_file()]
    if missing:
        raise SystemExit("Missing game libraries: " + ", ".join(missing))
    gson = next(p for p in jars if p.name == "gson-2.10.1.jar")
    build = HERE / "build"
    classes = build / "classes"
    classes.mkdir(parents=True, exist_ok=True)
    sources = sorted((HERE / "src/main/java").rglob("*.java"))
    if args.test:
        sources += sorted((HERE / "src/test/java").rglob("*.java"))
    cp = (";" if __import__("os").name == "nt" else ":").join(map(str, jars))
    # javac argument files avoid Windows command length limits.
    def quoted(path):
        return '"' + str(path).replace("\\", "/") + '"'
    argfile = build / "javac.args"
    argfile.write_text("\n".join(["--release", "21", "-encoding", "UTF-8", "-proc:none", "-classpath",
                                 quoted(cp), "-d", quoted(classes)] + [quoted(p) for p in sources]), encoding="utf-8")
    subprocess.run([str(args.jdk / "bin/javac.exe" if __import__("os").name == "nt" else args.jdk / "bin/javac"),
                    "@" + str(argfile)], check=True)
    if args.test:
        testcp = str(classes) + (";" if __import__("os").name == "nt" else ":") + str(gson)
        subprocess.run([str(args.jdk / "bin/java.exe" if __import__("os").name == "nt" else args.jdk / "bin/java"),
                        "-ea", "-cp", testcp, "creation.updater.UpdaterTest"], check=True)
    helper_data = io.BytesIO()
    with zipfile.ZipFile(helper_data, "w", zipfile.ZIP_DEFLATED) as helper:
        helper.writestr("META-INF/MANIFEST.MF", "Manifest-Version: 1.0\r\nMain-Class: creation.updater.Installer\r\n\r\n")
        for prefix in ("UpdateCore", "Installer"):
            for file in sorted((classes / "creation/updater").glob(prefix + "*.class")):
                helper.write(file, file.relative_to(classes).as_posix())
        with zipfile.ZipFile(gson) as source:
            for name in source.namelist():
                if name.startswith("com/google/gson/") and name.endswith(".class"):
                    helper.writestr(name, source.read(name))
        helper.write(ROOT / "LICENSE", "META-INF/licenses/POC-LICENSE")
        for file in sorted((HERE / "src/main/resources/META-INF/licenses").glob("*")):
            if file.is_file():
                helper.write(file, "META-INF/licenses/" + file.name)
    output = build / "poc-updater-1.0.0.jar"
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as jar:
        jar.writestr("META-INF/MANIFEST.MF", "Manifest-Version: 1.0\r\n\r\n")
        jar.write(ROOT / "LICENSE", "META-INF/licenses/POC-LICENSE")
        for file in sorted(classes.rglob("*.class")):
            if not file.name.startswith("UpdaterTest"):
                jar.write(file, file.relative_to(classes).as_posix())
        for file in sorted((HERE / "src/main/resources").rglob("*")):
            if file.is_file():
                jar.write(file, file.relative_to(HERE / "src/main/resources").as_posix())
        jar.writestr("poc-updater-helper.jar", helper_data.getvalue())
    destination = ROOT / "mods" / output.name
    shutil.copy2(output, destination)
    print(f"Built and installed: {destination} ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
