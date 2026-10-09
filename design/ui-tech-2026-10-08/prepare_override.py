"""Rebuild the local Assets Override fix using Java 21 and installed dependencies.

Replace the client constructor argument with a sorted copy. Never modify caller
lists, including Moonlight's immutable lists. Keep the upstream download intact.
"""
from __future__ import annotations

import hashlib
import json
import argparse
import shutil
import subprocess
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CACHE = ROOT / '.cache/ui-tech-20261008/no-zip-switch'
SOURCE_NAME = 'kubejs_lang_override-1.21.1-neoforge-1.0.jar'
TARGET_NAME = 'kubejs_lang_override-1.21.1-neoforge-1.0-poc.jar'
SOURCE_SHA256 = 'd4c62f4b7a5c389f62099b00bb62280a8b174d4bf935e16349bdd5e9b0fab014'
MIXIN = 'org/hp/kubejs_lang_override/mixin/client/MultiPackResourceManagerMixin.class'
OLD_ID = 'KubeJS Resource Pack [assets]'
NEW_ID = 'KubeJS File Resource Pack [assets]'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--javac', type=Path, default=Path.home() / '.gradle/jdks/eclipse_adoptium-21-amd64-windows.2/bin/javac.exe')
    parser.add_argument('--classpath-args', type=Path, default=CACHE.parent / 'javac.args')
    args = parser.parse_args()
    source = CACHE / SOURCE_NAME; target = CACHE / TARGET_NAME
    assert hashlib.sha256(source.read_bytes()).hexdigest() == SOURCE_SHA256
    lines = args.classpath_args.read_text(encoding='utf-8').splitlines()
    classpath = lines[lines.index('-classpath') + 1].strip('"')
    classpath = ';'.join(p for p in classpath.split(';') if Path(p).name != TARGET_NAME)
    classes = CACHE / 'immutable-safe-classes'
    classes.mkdir(parents=True, exist_ok=True)
    java_source = HERE / 'override-src' / MIXIN.replace('.class', '.java')
    compile_args = CACHE / 'compile-override.args'
    compile_args.write_text('\n'.join([
        '-proc:none', '--release', '21', '-g:none', '-encoding', 'UTF-8',
        '-classpath', '"' + classpath.replace('\\', '/') + '"',
        '-d', '"' + classes.as_posix() + '"', '"' + java_source.as_posix() + '"',
    ]) + '\n', encoding='utf-8')
    subprocess.run([str(args.javac), '@' + str(compile_args)], check=True)
    replacement = (classes / MIXIN).read_bytes()
    record = {'source_url':'https://www.curseforge.com/minecraft/mc-mods/kubejs-assets-override/files/8712379',
              'download_url':'https://mediafilez.forgecdn.net/files/8712/379/'+SOURCE_NAME,
              'source_sha256':SOURCE_SHA256, 'installed_kubejs':'2101.7.2-build.377',
              'class':MIXIN, 'old_pack_id':OLD_ID, 'new_pack_id':NEW_ID, 'patch_version':2,
              'source_file':java_source.relative_to(ROOT).as_posix(),
              'java_source_sha256':hashlib.sha256(java_source.read_bytes()).hexdigest(),
              'caller_list_unchanged':True,
              'change':'Replace client constructor list argument with a stable sorted copy using ModifyVariable; never mutate the input. Server data unchanged.'}
    if target.exists():
        old_sha = hashlib.sha256(target.read_bytes()).hexdigest()
        backup = CACHE / 'crash-fix-backup' / (old_sha + '.jar')
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():shutil.copyfile(target, backup)
    with ZipFile(source) as src, ZipFile(target,'w',ZIP_DEFLATED) as dst:
        assert src.testzip() is None
        for info in src.infolist():
            data=src.read(info)
            dst.writestr(info,replacement if info.filename==MIXIN else data)
        info = ZipInfo('META-INF/poc-local-patch.json', date_time=(2000,1,1,0,0,0))
        info.compress_type = ZIP_DEFLATED
        dst.writestr(info,json.dumps(record,indent=2)+'\n')
    with ZipFile(source) as src, ZipFile(target) as dst:
        assert dst.testzip() is None
        assert dst.read(MIXIN) != src.read(MIXIN)
        assert all(src.read(n)==dst.read(n) for n in src.namelist() if n!=MIXIN)
    record.update(target_name=TARGET_NAME,target_sha256=hashlib.sha256(target.read_bytes()).hexdigest(),
                  target_size=target.stat().st_size)
    (CACHE/'patch.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(record))


if __name__=='__main__':main()
