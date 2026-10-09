"""Asset geometry, native theme/layout parsing and progression audit."""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
import hashlib
import json
import re
import subprocess
import sys
from PIL import Image

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
CACHE=ROOT/'.cache/ui-polish-20261008'
assets=HERE/'assets'
manifest=json.loads((HERE/'manifest.json').read_text(encoding='utf-8'))
pngs=0;metadata=0;alpha_masks=0;source_sizes=0;slots=0
vanilla=next(ROOT.glob('*.jar'))
for p in assets.rglob('*'):
    if not p.is_file():continue
    if p.suffix=='.png':
        with Image.open(p) as im:im.verify()
        pngs+=1
        rel=p.relative_to(assets).as_posix()
        if rel not in manifest:continue
        s=manifest[rel]
        assert hashlib.sha256(p.read_bytes()).hexdigest()==s['sha256']
        im=Image.open(p).convert('RGBA');assert list(im.size)==s['size']
        jar=ROOT/'mods'/s['source_jar'] if s.get('source_jar') else None
        if s.get('source_jar')==vanilla.name:jar=vanilla
        if jar:
            with ZipFile(jar) as z:original=Image.open(BytesIO(z.read('assets/'+rel))).convert('RGBA')
            assert im.size==original.size;source_sizes+=1
            if s.get('alpha_preserved'):
                assert im.getchannel('A').tobytes()==original.getchannel('A').tobytes();alpha_masks+=1
            for x,y in s.get('slots',[]):
                assert all(original.getpixel((x+j,y))==(55,55,55,255) for j in range(17))
                assert all(original.getpixel((x,y+j))==(55,55,55,255) for j in range(17));slots+=1
        if rel.startswith('ftbquests/textures/shapes/'):
            jar=next((ROOT/'mods').glob('*ftb-quests*.jar'))
            with ZipFile(jar) as z:original=Image.open(BytesIO(z.read('assets/'+rel))).convert('RGBA')
            assert im.size==original.size and im.getchannel('A').tobytes()==original.getchannel('A').tobytes();alpha_masks+=1
    elif p.suffix in ['.json','.mcmeta']:
        json.loads(p.read_text(encoding='utf-8'));metadata+=1
theme=(assets/'ftbquests/ftb_quests_theme.txt').read_text(encoding='utf-8')
refs=set(re.findall(r'\b([a-z0-9_]+):(textures/[a-z0-9_./-]+\.png)',theme))
for ns,rel in refs:
    if (assets/ns/rel).exists():continue
    assert any('assets/'+ns+'/'+rel in ZipFile(jar).namelist() for jar in (ROOT/'mods').glob('*.jar')),(ns,rel)
for p in (HERE/'menu-assets').glob('*.png'):
    with Image.open(p) as im:im.verify()
    pngs+=1
tokens=json.loads((HERE/'tokens.json').read_text(encoding='utf-8'))
for w,h in [(480,270),(540,360),(640,360)]:
    for name,p in tokens['placements'].items():
        if p['stretch']:continue
        x=p['x']+w/2;y=p['y']+(h if p['anchor']=='bottom-centered' else h/2)
        assert x>=0 and y>=0 and x+p['w']<=w and y+p['h']<=h,(w,h,name)
        if name in ['world-left','world-right']:
            # Native list's icons/text occupy centered 270px; native button band 308px.
            assert x+p['w']<=w/2-154 or x>=w/2+154

sys.path.insert(0,str(ROOT/'design'))
import audit_progression
quests=audit_progression.read_chapters();errors=audit_progression.validate(quests);assert not errors,errors

# Reuse known resource-loader classpath, without game launch or launcher files.
lines=(ROOT/'.cache/ui-tech-20261008/javac.args').read_text(encoding='utf-8').splitlines()
cp=lines[lines.index('-classpath')+1].strip('"')
paths=[str(ROOT/'.cache/ui-tech-20261008/native-at'),str(ROOT/'.cache/ui-tech-20261008'),str(CACHE)]
paths += [p for p in cp.split(';') if not any(ord(c)>65535 for c in p)]
paths += [str(next((ROOT/'mods').glob('fancymenu*.jar'))),str(next((ROOT/'mods').glob('konkrete*.jar')))]
cp=';'.join(paths).replace('\\','/')
jdk=Path('C:/Users/44479/.gradle/jdks/eclipse_adoptium-21-amd64-windows.2/bin')
jobs=[('javac',['-proc:none','-encoding','UTF-8','-classpath',cp,'-d',str(CACHE),str(HERE/'FancyLayoutCheck.java')],'utf-8','compile-layout'),
      ('java',['-classpath',cp,'FancyLayoutCheck',str(HERE/'layouts/poc_title_decoration.txt'),str(HERE/'layouts/poc_world_selection.txt'),str(HERE/'menu-config/customizablemenus.txt')],'gbk','layout'),
      ('java',['-classpath',cp,'UiQuestStyleCheck',str(assets/'ftbquests/ftb_quests_theme.txt')],'gbk','theme')]
for tool,argv,encoding,label in jobs:
    argfile=CACHE/(label+'.args');argfile.write_text('\n'.join('"'+a.replace('\\','/')+'"' for a in argv)+'\n',encoding=encoding)
    result=subprocess.run([str(jdk/(tool+'.exe')),'@'+str(argfile)],capture_output=True)
    (CACHE/(label+'.log')).write_bytes(result.stdout+result.stderr)
    print(result.stdout.decode('utf-8',errors='replace')[-1500:]+result.stderr.decode('utf-8',errors='replace')[-500:])
    assert result.returncode==0,(label,result.returncode)
report=dict(pngs_valid=pngs,json_valid=metadata,native_source_sizes=source_sizes,alpha_masks_unchanged=alpha_masks,
            creative_slots_checked=slots,theme_references=len(refs),quest_count=len(quests),dependency_count=sum(len(q['dependencies']) for q in quests.values()),
            quest_graph_errors=errors,gui_sizes_checked=[[480,270],[540,360],[640,360]],native_fancymenu_parser=True,
            native_ftb_style_parser=True,live_render_verified=False)
(HERE/'verification.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
