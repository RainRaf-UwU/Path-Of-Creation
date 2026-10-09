"""Stage deterministic FancyMenu artwork/configuration and install reviewed files only."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import argparse, hashlib, json, math, re, shutil

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OLD = ROOT / 'design/ui-polish-2026-10-08'
CACHE = ROOT / '.cache/screen-polish-20261008'
ART = HERE / 'assets'
LAYOUTS = HERE / 'layouts'
C = dict(bg='#08121F', panel='#101F30', cyan='#58D9EA', line='#31596D',
         metal='#8CA7B9', violet='#B082DD', amber='#D7AE69', text='#E0EDF5')
STAGES = {
    'level_loading_screen': ('LevelLoadingScreen', ['chunks', 'percentage'], '构建世界', 'WORLD CONSTRUCTION', '01', True),
    'progress_screen': ('ProgressScreen', ['header', 'stage'], '处理世界数据', 'PROCESSING WORLD DATA', '02', True),
    'receiving_level_screen': ('ReceivingLevelScreen', ['downloading_terrain'], '接入世界', 'ENTERING WORLD', '03', False),
    'generic_dirt_message_screen': ('GenericMessageScreen', ['message'], '准备创世环境', 'PREPARING ENVIRONMENT', '00', False),
}
PLACE = {}

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def font(n):
    return ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', n)

def txt(d, p, s, n, fill=None):
    d.text(p, s, font=font(n), fill=fill or C['text'])

def save(im, name):
    ART.mkdir(parents=True, exist_ok=True)
    im.save(ART/name)

def corners(d, box, length=16, color=None, width=2):
    x,y,r,b=box
    for xx,yy,dx,dy in [(x,y,1,1),(r,y,-1,1),(x,b,1,-1),(r,b,-1,-1)]:
        d.line([(xx+dx*length,yy),(xx,yy),(xx,yy+dy*length)], fill=color or C['cyan'], width=width)

def loading_art():
    # Generated source copied intact; all editable interface content is separate.
    for sid, (_,_,cn,en,num,real) in STAGES.items():
        im=Image.new('RGBA',(800,416)); d=ImageDraw.Draw(im)
        d.polygon([(16,0),(799,0),(799,399),(783,415),(0,415),(0,16)],fill=(8,18,31,236),outline=C['line'])
        d.line((16,1,720,1),fill=C['cyan'],width=2)
        d.line((721,1,785,1),fill=C['violet'],width=2)
        corners(d,(8,8,790,406),20)
        d.rectangle((40,36,85,64),outline=C['line']);txt(d,(48,37),num,20,C['cyan'])
        txt(d,(104,38),'CREATION PROTOCOL',21,C['metal'])
        txt(d,(40,99),cn,49)
        txt(d,(42,167),en,24,C['cyan'])
        d.line((40,221,759,221),fill='#233F52')
        txt(d,(40,226),'WORLD DATA' if real else 'AWAITING WORLD',20,C['metal'])
        # Progress/scan will be drawn in the clear region y=256..276.
        for k in range(15):
            x=64+k*48
            d.line((x,294,x,299 if k%3 else 305),fill=C['line'])
        txt(d,(40,334),'从一个方块，创造无限可能',26,C['metal'])
        for x in range(638,758,12):
            d.line((x,362,x+7,352),fill=C['violet'] if x>718 else C['line'],width=2)
        for x,y in [(20,24),(780,24),(20,388),(780,388)]:
            d.rectangle((x-2,y-2,x+2,y+2),fill=C['metal'])
        save(im,'loading-'+sid+'.png')
    im=Image.new('RGBA',(1080,128));d=ImageDraw.Draw(im)
    txt(d,(0,0),'PATH OF CREATION',48)
    txt(d,(2,65),'创世之径  /  TECHNOLOGY & POSSIBILITY',24,C['metal'])
    d.line((0,119,888,119),fill=C['line'],width=2)
    d.line((0,119,100,119),fill=C['cyan'],width=2)
    d.line((780,119,888,119),fill=C['violet'],width=2)
    save(im,'loading-brand.png')
    im=Image.new('RGBA',(1080,56));d=ImageDraw.Draw(im)
    d.line((0,0,1079,0),fill=C['line'])
    for x in [0,8,16,1062,1070,1078]:d.rectangle((x,12,x+2,14),fill=C['cyan'])
    label='单方块起点  /  自动化产线  /  创世之径'
    f=font(24);x=(1080-d.textlength(label,font=f))/2
    d.text((x,12),label,font=f,fill=C['metal'])
    save(im,'loading-footer.png')
    im=Image.new('RGBA',(540,360));d=ImageDraw.Draw(im)
    corners(d,(8,8,531,351),24,(69,116,145,180),1)
    for x in range(32,500,12):d.line((x,348,x+3,348),fill=(49,89,109,120))
    d.line((8,70,8,92),fill=(88,217,234,140));d.line((531,270,531,292),fill=(176,130,221,140))
    save(im,'loading-corners.png')
    for name in ['progress-track.png','progress-fill.png']:
        im=Image.new('RGBA',(672,20));d=ImageDraw.Draw(im)
        if name.startswith('progress-track'):
            d.rectangle((0,0,671,19),fill='#0A1423',outline=C['line'])
            for x in range(0,672,24):d.line((x,2,x,17),fill='#193042')
        else:
            for x in range(672):
                t=x/671;rgb=tuple(round(a*(1-t)+b*t) for a,b in zip((88,217,234),(176,130,221)))
                d.line((x,1,x,18),fill=rgb)
            d.line((0,1,671,1),fill='#D3F2FF')
            for x in range(20,672,24):d.line((x,2,x,17),fill='#355D75')
        save(im,name)
    # Small 2-second loop, no animated full-screen background or fake percentage.
    frames=[]
    for k in range(24):
        im=Image.open(ART/'progress-track.png').convert('RGB');d=ImageDraw.Draw(im)
        start=round(k*744/23)-72
        for x in range(max(1,start),min(671,start+72)):
            t=(x-start)/72;c=tuple(round(a*(1-t)+b*t) for a,b in zip((176,130,221),(88,217,234)))
            d.line((x,2,x,17),fill=c)
        frames.append(im)
    frames[0].save(ART/'waiting-scan.gif',save_all=True,append_images=frames[1:],duration=80,loop=0,optimize=False)

def menu_art():
    # Same footprint as installed decorations; no change to original actions/widgets.
    for name,cn,en,num in [('play-panel','开始旅程','PLAY','01'),('community-panel','社区与支持','COMMUNITY','02')]:
        im=Image.new('RGBA',(544,592));d=ImageDraw.Draw(im)
        d.rectangle((0,0,543,591),fill=(9,17,28,225),outline=C['line'])
        corners(d,(1,1,542,590),24,width=3)
        d.line((5,5,5,586),fill='#274556',width=2)
        d.line((538,5,538,586),fill='#274556',width=2)
        d.rectangle((25,23,516,65),fill='#14283A')
        # Keep the original safe, right-aligned community heading at short heights.
        label=cn+' / '+en
        f=font(24);x=544-27-d.textlength(label,font=f) if name=='community-panel' else 38
        d.text((x,24),label,font=f,fill=C['metal'])
        d.line((25,70,516,70),fill=C['line'],width=2)
        d.line((25,70,76,70),fill=C['cyan'],width=2)
        d.line((466,70,516,70),fill=C['violet'],width=2)
        for k in range(5):
            y=82+k*99
            d.line((15,y+18,15,y+37),fill=C['cyan'],width=2)
            d.line((527,y+22,527,y+32),fill=C['line'],width=2)
            d.rectangle((10,y+10,13,y+13),fill=C['amber'] if k==0 else C['metal'])
        # Footer below the five native 20px buttons, no labels inside click areas.
        txt(d,(30,558),num+' / '+('JOURNEY' if name=='play-panel' else 'SOCIAL LINKS'),17,C['metal'])
        for x in range(280,392,9):d.line((x,565,x+4,565),fill=C['line'],width=2)
        d.line((440,566,512,566),fill=C['violet'],width=3)
        for x,y in [(10,10),(534,10),(10,582),(534,582)]:
            d.rectangle((x-1,y-1,x+1,y+1),fill=C['metal'])
        save(im,name+'.png')
    im=Image.new('RGBA',(320,284));d=ImageDraw.Draw(im)
    cx,cy=160,142
    for r,c in [(136,(70,147,176,155)),(128,(40,83,103,150)),(144,(45,86,104,100))]:
        for a,b in [(6,58),(80,164),(186,238),(260,344)]:d.arc((cx-r,cy-r,cx+r,cy+r),a,b,fill=c,width=1)
    for a in range(0,360,6):
        rr=137;rad=math.radians(a)
        x,y=cx+math.cos(rad)*rr,cy+math.sin(rad)*rr
        r2=132 if a%30==0 else 135
        d.line((x,y,cx+math.cos(rad)*r2,cy+math.sin(rad)*r2),fill=(88,217,234,185) if a%30==0 else (49,89,109,130))
    d.arc((24,6,296,278),284,340,fill=C['violet'],width=2)
    for x,y in [(17,142),(303,142),(160,0),(160,282)]:
        d.line((x-4,y,x+4,y),fill=C['metal']);d.line((x,y-2,x,y+2),fill=C['line'])
    save(im,'creation-orbit.png')
    im=Image.new('RGBA',(1080,720));d=ImageDraw.Draw(im)
    corners(d,(16,16,1062,702),58,(88,159,185,155),2)
    for x in range(140,940,40):d.line((x,18,x+12,18),fill=(70,116,145,120),width=2)
    for x,sgn in [(22,1),(1058,-1)]:
        d.line([(x,194),(x,236),(x+sgn*20,256)],fill=(70,151,180,130),width=2)
        for y in range(298,454,24):d.line((x,y,x+sgn*8,y),fill=(69,116,145,110))
        d.rectangle((x-3,276,x+3,282),outline=(88,217,234,150))
    save(im,'screen-corners.png')
    im=Image.new('RGBA',(1200,72));d=ImageDraw.Draw(im)
    d.line((0,3,1199,3),fill=C['line'],width=2);d.line((440,3,760,3),fill=C['violet'],width=2)
    f=font(27);s='PATH OF CREATION  /  TECHNOLOGY & POSSIBILITY'
    d.text(((1200-d.textlength(s,font=f))/2,21),s,font=f,fill=C['text'])
    for x in [8,22,36,1160,1174,1188]:d.rectangle((x,27,x+3,30),fill=C['cyan'])
    save(im,'brand-rail.png')

def world_art():
    for name,en,num in [('world-left','WORLD ARCHIVE','01'),('world-right','CREATION','02')]:
        im=Image.new('RGBA',(240,680));d=ImageDraw.Draw(im)
        d.line((0,0,239,0),fill=C['line'],width=2);d.line((0,679,239,679),fill=C['line'],width=2)
        txt(d,(24,28),en,22,C['metal']);txt(d,(24,65),'PATH / '+num,16,C['line'])
        d.line((24,92,216,92),fill=C['line']);d.line((24,92,90,92),fill=C['cyan'],width=2)
        for y in range(143,556,20):
            d.line((28,y,56 if y%40 else 75,y),fill=C['line'])
        d.line([(176,124),(176,325),(143,358),(143,576)],fill=C['line'],width=2)
        for x,y in [(176,124),(143,576)]:
            d.rectangle((x-5,y-5,x+5,y+5),outline=C['cyan']);d.point((x,y),fill=C['amber'])
        # A small circuit module with etched traces, never inside the list.
        d.rectangle((78,259,134,300),fill=(16,31,48,210),outline='#355C70')
        d.rectangle((88,269,124,290),outline=C['line'])
        for y in range(268,295,7):d.line((72,y,78,y),fill=C['metal']);d.line((134,y,140,y),fill=C['metal'])
        d.line([(143,442),(119,442),(95,466),(78,466)],fill=C['line'])
        d.rectangle((70,461,78,469),outline=C['violet'])
        d.line((24,624,152,624),fill=C['violet'],width=2)
        txt(d,(24,643),'PoC / WORLD DATA',15,C['metal'])
        save(im,name+'.png')
    for name in ['world-header','world-footer']:
        im=Image.new('RGBA',(1080,128),'#0B1522');d=ImageDraw.Draw(im)
        y=127 if name.endswith('header') else 0
        d.line((0,y,1079,y),fill=C['line'],width=2);d.line((452,y,628,y),fill=C['violet'],width=2)
        for x in [24,44,64,1010,1030,1050]:d.line((x,y,x+8,y),fill=C['metal'],width=2)
        # Stretchable texture: marks confined to far corners, clear center/native UI.
        for x in [10,1068]:d.line((x,10,x,117),fill='#162F40')
        for yy in range(24,108,12):
            d.line((10,yy,18,yy),fill=C['line']);d.line((1060,yy,1068,yy),fill=C['line'])
        save(im,name+'.png')

def image_element(template,name,anchor,x,y,w,h,source=None,stretch=False):
    values={'element_type':'image','instance_identifier':'poc-screen-'+name,
            'anchor_point':anchor,'anchor_point_element':'','x':str(x),'y':str(y),'width':str(w),'height':str(h),
            'source':'[source:local]/config/fancymenu/assets/poc-screen/'+(source or name+'.png'),
            'stretch_x':str(stretch).lower(),'stretch_y':str(stretch).lower(),
            'stay_on_screen':'false','enable_parallax':'false','should_be_affected_by_decoration_overlays':'false',
            'element_loading_requirement_container_identifier':'poc-screen-'+name+'-requirements'}
    template=re.sub(r'^  \[loading_requirement_container_meta:.*\n','',template,flags=re.M)
    for k,v in values.items():
        template=re.sub(r'^  '+re.escape(k)+r' = .*$',lambda m:'  '+k+' = '+v,template,flags=re.M)
    template+='\n  [loading_requirement_container_meta:poc-screen-'+name+'-requirements] = [groups:][instances:]'
    PLACE[name]=dict(anchor=anchor,x=x,y=y,w=w,h=h,stretch=stretch,source=source or name+'.png')
    return 'element {\n'+template+'\n}\n\n'

def configs():
    LAYOUTS.mkdir(parents=True,exist_ok=True)
    original=(ROOT/'config/fancymenu/customization/title_screen_layout.txt').read_text(encoding='utf-8')
    template=re.search(r'\nelement \{\n(.*?)\n\}',original,re.S).group(1)
    for sid,(cls,hidden,cn,en,num,real) in STAGES.items():
        s='type = fancymenu_layout\n\nlayout-meta {\n  identifier = '+sid+'\n  render_custom_elements_behind_vanilla = false\n  is_enabled = true\n  randommode = false\n  layout_index = 0\n}\n\n'
        s+='menu_background {\n  image_path = [source:local]/config/fancymenu/assets/poc-screen/loading-background.png\n  background_type = image\n  repeat_texture = false\n  parallax = false\n  instance_identifier = poc-screen-background-'+sid+'\n}\n\ncustomization {\n  action = backgroundoptions\n  keepaspectratio = true\n}\n\nscroll_list_customization {\n  apply_vanilla_background_blur = false\n  show_screen_background_overlay_on_custom_background = false\n}\n\n'
        for widget in hidden:
            s+='vanilla_button {\n  element_type = vanilla_button\n  instance_identifier = '+widget+'\n  is_hidden = true\n}\n\n'
        s+=image_element(template,'loading-corners-'+sid,'top-left',0,0,540,360,'loading-corners.png',True)
        s+=image_element(template,'loading-brand-'+sid,'top-left',20,18,270,32,'loading-brand.png')
        s+=image_element(template,'loading-panel-'+sid,'mid-centered',4,-43,200,104,'loading-'+sid+'.png')
        s+=image_element(template,'loading-footer-'+sid,'bottom-centered',-135,-27,270,14,'loading-footer.png')
        # Track lives inside the panel at local (16,64); texture masking handled by FM.
        if real:
            block=image_element(template,'loading-progress-'+sid,'mid-centered',20,21,168,5,'progress-fill.png')
            block=block.replace('  element_type = image','  element_type = progress_bar')
            block=block.replace('\n}\n\n','\n  progress_source = {"placeholder":"world_load_progress"}\n  value_mode = percentage\n  direction = right\n  smooth_filling_animation = true\n  bar_color = #FFFFFFFF\n  background_color = #FFFFFFFF\n  bar_texture = [source:local]/config/fancymenu/assets/poc-screen/progress-fill.png\n  background_texture = [source:local]/config/fancymenu/assets/poc-screen/progress-track.png\n  bar_nine_slice = false\n  background_nine_slice = false\n}\n\n')
            s+=block
            percent=image_element(template,'loading-percentage-'+sid,'mid-centered',154,11,40,10,'progress-fill.png')
            percent=percent.replace('  element_type = image','  element_type = text_v2')
            percent=re.sub(r'^  source = .*$',lambda m:'  source = {"placeholder":"world_load_progress"}%',percent,flags=re.M)
            percent=percent.replace('\n}\n\n','\n  source_mode = direct\n  scale = 1.0\n  shadow = false\n  text_border = 0\n  enable_scrolling = false\n  auto_line_wrapping = false\n  parse_markdown = false\n  interactable = false\n}\n\n')
            s+=percent
        else:
            s+=image_element(template,'loading-scan-'+sid,'mid-centered',20,21,168,5,'waiting-scan.gif')
        (LAYOUTS/('poc_loading_'+sid+'.txt')).write_text(s,encoding='utf-8')
    raw=(ROOT/'config/fancymenu/customizablemenus.txt').read_bytes()
    for cls,*_ in STAGES.values():
        name=('net.minecraft.client.gui.screens.'+cls).encode()
        if name not in raw:raw+=b'\r\n'+name+b' {\r\n}\r\n'
    (HERE/'customizablemenus.txt').write_bytes(raw)

def protect():
    paths=[]
    for directory in ['kubejs','config/ftbquests/quests']:
        paths.extend(p for p in (ROOT/directory).rglob('*') if p.is_file())
    paths += [ROOT/p for p in ['options.txt','config/fml.toml','config/ftblibrary-client.snbt','config/ftbquests-client.snbt',
                              'config/fancymenu/customization/title_screen_layout.txt','config/fancymenu/customization/poc_title_decoration.txt',
                              'config/fancymenu/customization/poc_world_selection.txt']]
    return {p.relative_to(ROOT).as_posix():sha(p) for p in paths if p.exists()}

def plan():
    items=[]
    for p in ART.iterdir():
        # Existing ornaments retain their installed filenames and geometry.
        target='config/fancymenu/assets/'+('poc-polish/' if p.stem in ['play-panel','community-panel','creation-orbit','screen-corners','brand-rail','world-left','world-right','world-header','world-footer'] else 'poc-screen/')+p.name
        items.append((p,target))
    items += [(p,'config/fancymenu/customization/'+p.name) for p in LAYOUTS.glob('*.txt')]
    items += [(HERE/'customizablemenus.txt','config/fancymenu/customizablemenus.txt')]
    manifest=[]
    for p,target in items:
        dst=ROOT/target;before=sha(dst) if dst.exists() else None
        if before!=sha(p):manifest.append(dict(source=p.relative_to(HERE).as_posix(),target=target,sha256=sha(p),before_sha256=before))
    (HERE/'installation-plan.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
    return manifest

def paste(im,name,xy,size):
    src=Image.open(ART/name).convert('RGBA').resize(size,Image.Resampling.LANCZOS)
    im.alpha_composite(src,xy)

def loading_preview(gui,real=True,progress=64):
    w,h=gui;s=3;im=ImageOps.fit(Image.open(ART/'loading-background.png').convert('RGB'),(w*s,h*s)).convert('RGBA')
    sid='level_loading_screen' if real else 'receiving_level_screen'
    paste(im,'loading-corners.png',(0,0),im.size)
    paste(im,'loading-brand.png',(60,54),(810,96))
    x,y=round((w/2+4)*s),round((h/2-43)*s)
    paste(im,'loading-'+sid+'.png',(x,y),(600,312))
    px,py=x+48,y+192
    paste(im,'progress-track.png',(px,py),(504,15))
    if real:
        bar=Image.open(ART/'progress-fill.png').convert('RGBA').resize((504,15),Image.Resampling.LANCZOS)
        im.alpha_composite(bar.crop((0,0,round(504*progress/100),15)),(px,py))
        txt(ImageDraw.Draw(im),(x+450,y+162),str(progress)+'%',26)
    else:
        with Image.open(ART/'waiting-scan.gif') as scan:
            scan.seek(12);im.alpha_composite(scan.convert('RGBA').resize((504,15)),(px,py))
    paste(im,'loading-footer.png',(round((w/2-135)*s),(h-27)*s),(810,42))
    return im.convert('RGB')

def previews():
    loading_preview((540,360)).save(HERE/'preview-loading.png')
    loading_preview((540,360),False).save(HERE/'preview-waiting.png')
    for w,h in [(480,270),(640,360)]:loading_preview((w,h)).save(HERE/f'preview-loading-{w}x{h}.png')
    # Static reconstruction, dynamic player entities and vanilla fonts are not simulated.
    im=Image.open(ROOT/'config/fancymenu/assets/2025-11-17_23.21.23.png').convert('RGBA').resize((1620,1080))
    atmosphere=Image.open(ROOT/'config/fancymenu/assets/poc-polish/atmosphere.png').resize(im.size)
    im.alpha_composite(atmosphere)
    for name,xy,size in [('screen-corners',(0,0),(1620,1080)),('creation-orbit',(570,435),(480,426)),
                         ('play-panel',(138,306),(408,444)),('community-panel',(1065,306),(408,444)),
                         ('brand-rail',(360,981),(900,54))]:paste(im,name+'.png',xy,size)
    logo=Image.open(ROOT/'config/fancymenu/assets/minecraft_title.png').convert('RGBA').resize((774,300))
    im.alpha_composite(logo,(405,51))
    def button(im,xy,size,label,disabled=False):
        import importlib.util
        if not hasattr(button,'base'):
            sp=importlib.util.spec_from_file_location('base_geometry',ROOT/'design/ui-tech-2026-10-08/build_ui.py')
            m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);button.base=m
        src=Image.open(ROOT/'kubejs/assets/minecraft/textures/gui/sprites/widget'/('button_disabled.png' if disabled else 'button.png'))
        im.alpha_composite(button.base.nine(src,*size,b=3),xy)
        d=ImageDraw.Draw(im);f=font(24);tx=xy[0]+(size[0]-d.textlength(label,font=f))/2
        d.text((tx,xy[1]+12),label,font=f,fill=C['metal'] if disabled else C['text'])
    for x,labels in [(156,['单人游戏','多人游戏','模组','选项…','退出游戏']),(1083,['QQ群：1023077022','Discord','BiliBili主页','爱发电主页','Github'])]:
        for y,label in zip([366,441,513,588,663],labels):button(im,(x,y),(372,60),label)
    txt(ImageDraw.Draw(im),(20,1026),'Minecraft 1.21.1 · NeoForge',18,C['metal'])
    im.convert('RGB').save(HERE/'preview-menu.png')
    im=ImageOps.fit(Image.open(HERE/'references/world-backdrop.png').convert('RGB'),(1620,1080)).convert('RGBA')
    # This source is used only as a static demonstration; live vanilla panorama stays managed by Minecraft.
    im.alpha_composite(Image.new('RGBA',im.size,(8,18,31,80)))
    paste(im,'world-header.png',(0,0),(1620,144));paste(im,'world-footer.png',(0,888),(1620,192))
    paste(im,'world-left.png',(168,285),(180,510));paste(im,'world-right.png',(1272,285),(180,510))
    d=ImageDraw.Draw(im);txt(d,(736,17),'选择世界',24)
    field=Image.open(ROOT/'kubejs/assets/minecraft/textures/gui/sprites/widget/text_field.png')
    im.alpha_composite(button.base.nine(field,600,60,3),(510,69));txt(d,(1360,20),'□ 录制单人游戏',20,C['metal'])
    for n in range(5):
        y=162+n*135
        if n==0:d.rectangle((405,y,1206,y+125),fill=(10,24,38,120),outline=C['line'],width=2)
        d.rectangle((419,y+12,509,y+102),fill='#19364A',outline=C['line'])
        txt(d,(433,y+34),'PoC',24,C['cyan']);txt(d,(528,y+10),'新的世界',24)
        txt(d,(528,y+46),'空岛 · 创世之径',21,C['metal']);txt(d,(528,y+78),'生存模式，版本：1.21.1',20,C['metal'])
    d.rectangle((1239,151,1245,878),fill='#0B1522');d.rectangle((1239,153,1245,352),fill=C['metal'])
    for xy,size,label in [((348,924),(450,60),'进入选中的世界'),((822,924),(450,60),'创建新的世界'),
                          ((348,999),(210,60),'编辑'),((585,999),(210,60),'删除'),((822,999),(210,60),'重建'),((1059,999),(210,60),'返回')]:button(im,xy,size,label)
    im.convert('RGB').save(HERE/'preview-worlds.png')
    names=['loading','menu','worlds'];board=Image.new('RGB',(1200,2480),C['bg']);d=ImageDraw.Draw(board)
    for n,name in enumerate(names):
        txt(d,(20,n*820+12),['加载页 · 自定义进度','主菜单 · 细节装饰','世界选择 · 电路导轨'][n],25)
        pic=Image.open(HERE/f'preview-{name}.png');pic.thumbnail((1160,760));board.paste(pic,(20,n*820+56))
    board.save(HERE/'preview-overview.png')
    (HERE/'preview.html').write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>创世之径 · 加载与菜单</title><style>body{background:#08121f;color:#e0edf5;font:16px system-ui;margin:30px}main{max-width:1620px;margin:auto}img{width:100%;border:1px solid #31596d;margin-bottom:30px}p{color:#91afbf}h2{font-size:22px}</style><main><h1>创世之径 · 加载与菜单细节</h1><p>同一素材的静态布局预览。64% 为预览样本，游戏接入真实进度；等待状态使用扫描动画。主菜单玩家实体、世界列表、字体及渲染顺序以实际游戏为准。</p>'+''.join('<h2>'+label+'</h2><img src="preview-'+name+'.png">' for name,label in [('loading','原创加载页'),('waiting','等待阶段'),('menu','主菜单'),('worlds','世界选择')])+'</main></html>',encoding='utf-8')

def install():
    items=json.loads((HERE/'installation-plan.json').read_text(encoding='utf-8'))
    before=protect();mods={p.name:(p.stat().st_size,p.stat().st_mtime_ns) for p in (ROOT/'mods').glob('*.jar')}
    for item in items:
        src=HERE/item['source'];dst=ROOT/item['target']
        assert sha(src)==item['sha256']
        assert (sha(dst) if dst.exists() else None)==item['before_sha256'],dst
    backup=CACHE/'backup';backup.mkdir(parents=True,exist_ok=True)
    for item in items:
        src=HERE/item['source'];dst=ROOT/item['target'];old=backup/item['target']
        if dst.exists():
            assert not old.exists(),'Refusing to overwrite original backup: '+str(old)
            old.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(dst,old)
        dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
    assert before==protect(),'Protected files changed'
    assert mods=={p.name:(p.stat().st_size,p.stat().st_mtime_ns) for p in (ROOT/'mods').glob('*.jar')}
    assert all(sha(ROOT/i['target'])==i['sha256'] for i in items)
    CACHE.mkdir(parents=True,exist_ok=True)
    (CACHE/'installation.json').write_text(json.dumps(dict(files=items,protected_files=len(before),protected_unchanged=True,mod_files_unchanged=len(mods),live_render_verified=False),ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Installed {len(items)} files; {len(before)} protected files and {len(mods)} mod JARs unchanged.')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--install',action='store_true');args=parser.parse_args()
    if args.install:install();return
    before=protect();loading_art();menu_art();world_art();configs();previews()
    (HERE/'tokens.json').write_text(json.dumps(dict(colors=C,base_gui=[540,360],placements=PLACE,progress_source={'placeholder':'world_load_progress'},waiting_animation={'frames':24,'frame_ms':80,'size':[672,20]},typography='Microsoft YaHei raster brand and status / Minecraft dynamic percentage',preserve_native_menu_actions=True),ensure_ascii=False,indent=2),encoding='utf-8')
    items=plan();assert before==protect();print(f'Staged {len(items)} files with 3-page previews; live configuration unchanged.')

if __name__=='__main__':main()
