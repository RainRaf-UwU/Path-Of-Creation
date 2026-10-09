"""Build a standalone client mod against a safe existing javac classpath, without launcher metadata."""
import argparse
import hashlib
import os
from pathlib import Path
import subprocess
import tempfile
import zipfile

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]

def quote(value):
    return '"'+str(value).replace('\\','/').replace('"','\\"')+'"'

def argument_file(path,items,native=False):
    # Windows Java argument files use native encoding, including Chinese paths.
    path.write_text('\n'.join(quote(v) for v in items),encoding='gbk' if native and os.name=='nt' else 'utf-8')

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--jdk',type=Path,required=True)
    p.add_argument('--classpath-file',type=Path,required=True)
    p.add_argument('--test',action='store_true')
    p.add_argument('--native-test',action='store_true')
    p.add_argument('--output',type=Path)
    a=p.parse_args()
    lines=a.classpath_file.read_text(encoding='utf-8').splitlines()
    separator=';' if os.name=='nt' else ':'
    jars=[Path(v) for v in lines[lines.index('-classpath')+1].strip('"').split(separator)]
    missing=[str(v) for v in jars if not v.is_file()]
    if missing: raise RuntimeError('Missing compile libraries: '+str(missing))
    build=HERE/'build';build.mkdir(exist_ok=True)
    javac=a.jdk/('bin/javac.exe' if os.name=='nt' else 'bin/javac')
    java=a.jdk/('bin/java.exe' if os.name=='nt' else 'bin/java')
    sources=sorted((HERE/'src/main/java').rglob('*.java'))
    tests=sorted((HERE/'src/test/java').rglob('*.java')) if a.test or a.native_test else []
    with tempfile.TemporaryDirectory(prefix='compile-',dir=build) as temporary:
        classes=Path(temporary)
        argument_file(build/'javac.args',['--release','21','-encoding','UTF-8','-proc:none','-classpath',separator.join(map(str,jars)),'-d',classes,*sources,*tests])
        subprocess.run([str(javac),'@'+str(build/'javac.args')],check=True)
        for resource in (HERE/'src/main/resources').rglob('*'):
            if resource.is_file():
                target=classes/resource.relative_to(HERE/'src/main/resources')
                target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(resource.read_bytes())
        if a.test:
            fancy=ROOT/'mods/fancymenu_neoforge_3.9.14_MC_1.21.1.jar'
            argument_file(build/'test.args',['-ea','-cp',classes,'creation.cursor.CursorTest',fancy],native=True)
            subprocess.run([str(java),'@'+str(build/'test.args')],check=True)
        if a.native_test:
            natives=[]
            lwjgl=[v for v in jars if v.name.startswith('lwjgl') and '-natives-' not in v.name]
            for v in lwjgl:
                native=v.with_name(v.stem+'-natives-windows.jar')
                if native.is_file(): natives.append(native)
            argument_file(build/'native-test.args',['-ea','-Djava.awt.headless=true','-cp',separator.join(map(str,[classes,*lwjgl,*natives])),'creation.cursor.NativeCursorTest'],native=True)
            subprocess.run([str(java),'@'+str(build/'native-test.args')],check=True)
        out=a.output or build/'poc-cursor-1.0.0.jar'
        out.parent.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as jar:
            def put(name,data):
                item=zipfile.ZipInfo(name,(2026,10,9,0,0,0));item.compress_type=zipfile.ZIP_DEFLATED
                jar.writestr(item,data)
            put('META-INF/MANIFEST.MF',b'Manifest-Version: 1.0\r\n\r\n')
            put('META-INF/licenses/POC-LICENSE',(ROOT/'LICENSE').read_bytes())
            for source in sources:
                for compiled in sorted((classes/'creation/cursor').glob(source.stem+'*.class')):
                    if compiled.stem==source.stem or compiled.stem.startswith(source.stem+'$'):
                        put(compiled.relative_to(classes).as_posix(),compiled.read_bytes())
            for resource in sorted((HERE/'src/main/resources').rglob('*')):
                if resource.is_file():put(resource.relative_to(HERE/'src/main/resources').as_posix(),resource.read_bytes())
        print('Built:',out,'bytes:',out.stat().st_size,'SHA256:',hashlib.sha256(out.read_bytes()).hexdigest())

if __name__=='__main__':main()
