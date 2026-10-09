from pathlib import Path
from PIL import Image
import json, re, subprocess, sys
import build_screens as B
sys.stdout.reconfigure(encoding='utf-8',errors='replace')

HERE=B.HERE;ROOT=B.ROOT;CACHE=B.CACHE
CACHE.mkdir(parents=True,exist_ok=True)
plan=json.loads((HERE/'installation-plan.json').read_text(encoding='utf-8'))
pngs=0
for p in B.ART.glob('*.png'):
    with Image.open(p) as im: im.verify()
    pngs+=1
with Image.open(B.ART/'waiting-scan.gif') as gif:
    assert gif.n_frames==24 and gif.info['loop']==0
    for n in range(gif.n_frames):gif.seek(n);assert gif.size==(672,20) and gif.info['duration']==80
for item in plan:
    assert B.sha(HERE/item['source'])==item['sha256']

tokens=json.loads((HERE/'tokens.json').read_text(encoding='utf-8'))
for w,h in [(480,270),(540,360),(640,360)]:
    for name,p in tokens['placements'].items():
        if p['stretch']:continue
        x,y=p['x'],p['y']
        if p['anchor']=='mid-centered':x+=w/2;y+=h/2
        elif p['anchor']=='bottom-centered':x+=w/2;y+=h
        assert x>=0 and y>=0 and x+p['w']<=w and y+p['h']<=h,(w,h,name)
    assert w/2-214+60<=w/2-154 and w/2+154>=w/2+135+6

lines=(ROOT/'.cache/ui-polish-20261008/compile-layout.args').read_text(encoding='utf-8').splitlines()
cp=lines[lines.index('"-classpath"')+1].strip('"')
cp=str(CACHE).replace('\\','/')+';'+cp
jdk=Path('C:/Users/44479/.gradle/jdks/eclipse_adoptium-21-amd64-windows.2/bin')
jobs=[('javac',['-proc:none','-encoding','UTF-8','-classpath',cp,'-d',str(CACHE),str(HERE/'NativeScreenCheck.java'),str(HERE/'PrepareNativeAccess.java')],'utf-8','native-compile'),
      ('java',['-classpath',cp,'PrepareNativeAccess',str(next((ROOT/'mods').glob('fancymenu*.jar'))),str(CACHE/'native-at')],'gbk','native-access'),
      ('java',['-classpath',str(CACHE/'native-at').replace('\\','/')+';'+cp,'NativeScreenCheck',*[str(p) for p in sorted(B.LAYOUTS.glob('*.txt'))],str(HERE/'customizablemenus.txt')],'gbk','native-schema')]
for tool,args,encoding,name in jobs:
    argfile=CACHE/(name+'.args');argfile.write_text('\n'.join('"'+s.replace('\\','/')+'"' for s in args)+'\n',encoding=encoding)
    r=subprocess.run([str(jdk/(tool+'.exe')),'@'+str(argfile)],capture_output=True)
    (CACHE/(name+'.log')).write_bytes(r.stdout+r.stderr)
    print(r.stdout.decode('gbk',errors='replace')[-1400:]+r.stderr.decode('gbk',errors='replace')[-1800:])
    assert r.returncode==0,(name,r.returncode)

sys.path.insert(0,str(ROOT/'design'))
import audit_progression
quests=audit_progression.read_chapters();errors=audit_progression.validate(quests);assert not errors,errors
report=dict(png_valid=pngs,gif_frames=24,gif_frame_ms=80,native_fancymenu_parser=True,native_progress_round_trip=True,native_text_source_valid=True,text_render_verified=False,
            screens=4,real_progress_stages=2,indeterminate_stages=2,
            gui_sizes=[[480,270],[540,360],[640,360]],quest_count=len(quests),quest_graph_errors=errors,
            loading_overlay_replaced=False,live_render_verified=False)
(HERE/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
