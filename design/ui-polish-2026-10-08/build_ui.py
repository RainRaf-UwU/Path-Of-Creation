"""Deterministic native UI decoration; stage, review, then install changed files only."""
from __future__ import annotations
import argparse
import hashlib
import importlib.util
import json
import math
import re
import shutil
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CACHE = ROOT / '.cache/ui-polish-20261008'
ASSETS = HERE / 'assets'
MENUS = HERE / 'menu-assets'
LAYOUTS = HERE / 'layouts'
spec = importlib.util.spec_from_file_location('base_ui', ROOT / 'design/ui-tech-2026-10-08/build_ui.py')
B = importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)
P = B.P
P.update(violet='#B082DD', metal='#8CA7B9', slot='#102033', shadow='#070D16')
B.HERE, B.ASSETS = HERE, ASSETS
PLACEMENTS = {}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def frame(im, box, fill=None, edge=None):
    x, y, r, b = box
    d = ImageDraw.Draw(im)
    d.rectangle(box, fill=fill or P['panel'], outline=P['shadow'])
    d.line([(x+1,b-1),(x+1,y+1),(r-1,y+1)], fill=edge or P['line'])
    d.line([(r-1,y+2),(r-1,b-1),(x+2,b-1)], fill='#0C1725')
    if r-x >= 10 and b-y >= 10:
        d.line((x+2,y+2,r-2,y+2),fill='#20354A')
        d.point((x+2,y+2), fill=P['metal'])
        d.point((r-2,b-2), fill=P['dim'])


def slot(im, x, y, size=18, output=False):
    d = ImageDraw.Draw(im)
    d.rectangle((x,y,x+size-1,y+size-1),fill=P['slot'])
    d.line([(x,y+size-1),(x,y),(x+size-1,y)], fill='#315363')
    d.line([(x+size-1,y+1),(x+size-1,y+size-1),(x+1,y+size-1)],fill=P['shadow'])
    if output:
        for xx,yy,dx,dy in [(x,y,1,1),(x+size-1,y,-1,1),(x,y+size-1,1,-1),(x+size-1,y+size-1,-1,-1)]:
            d.line([(xx+dx*3,yy),(xx,yy),(xx,yy+dy*3)],fill=P['amber'])


def panel(size, visible):
    im = Image.new('RGBA',size)
    w,h = visible
    frame(im,(0,0,w-1,h-1))
    d = ImageDraw.Draw(im)
    d.line((3,5,3,h-6),fill='#244151')
    d.line((w-4,5,w-4,h-6),fill='#244151')
    d.line((5,h-4,w-6,h-4),fill=P['line'])
    for x,y,dx,dy in [(3,3,1,1),(w-4,3,-1,1),(3,h-4,1,-1),(w-4,h-4,-1,-1)]:
        d.line([(x+dx*5,y),(x,y),(x,y+dy*4)],fill=P['dim'])
        d.point((x,y),fill=P['cyan'])
    for x in range(w//2-8,w//2+9,4):
        d.line((x,h-3,x+1,h-3),fill='#5C6B82')
    return im


B.frame, B.slot, B.panel = frame, slot, panel


def overwrite(im, resource):
    original = B.MANIFEST[resource].copy()
    B.save(im,resource)
    original.update(sha256=sha(ASSETS/resource),size=list(im.size))
    B.MANIFEST[resource] = original


def polish_resources():
    B.build_creative(); B.build_jei(); B.build_widgets(); B.build_hotbar(); B.build_quests()
    for resource in list(B.MANIFEST):
        im=Image.open(ASSETS/resource).convert('RGBA');d=ImageDraw.Draw(im);w,h=im.size
        alpha=im.getchannel('A')
        if '/creative_inventory/tab_' in resource and '/sprites/' in resource:
            active='/tab_top_selected_' in resource or '/tab_bottom_selected_' in resource
            bottom='/tab_bottom_' in resource
            yy=h-3 if bottom else 2
            d.line((4,yy,w-5,yy),fill=P['cyan'] if active else '#3B596A')
            d.point((4,yy),fill=P['amber'] if active else P['metal'])
        elif '/creative_inventory/scroller' in resource:
            for yy in range(h//2-2,h//2+3,2):
                d.line((3,yy,w-4,yy),fill=P['metal'] if 'disabled' not in resource else P['line'])
        elif resource.endswith('/hud/hotbar.png'):
            for c in range(9):
                d.line((5+c*20,h-2,16+c*20,h-2),fill='#294153')
                d.point((10+c*20,h-2),fill=P['dim'])
            d.point((1,1),fill=P['violet']);d.point((w-2,1),fill=P['violet'])
        elif resource.endswith('/hud/hotbar_selection.png'):
            d.rectangle((0,0,w-1,h-1),fill=P['slot'])
            d.rectangle((1,1,w-2,h-2),outline=P['cyan'])
            d.rectangle((2,2,w-3,h-3),outline='#305D70')
            for x,y,dx,dy in [(0,0,1,1),(w-1,0,-1,1),(0,h-1,1,-1),(w-1,h-1,-1,-1)]:
                d.line([(x+dx*4,y),(x,y),(x,y+dy*4)],fill=P['cyan'])
                d.point((x,y),fill=P['amber'])
        elif '/widget/button' in resource:
            disabled='disabled' in resource
            bright='highlighted' in resource
            for x in [3,w-4]:
                d.line((x,4,x,h-5),fill='#243848' if disabled else P['cyan'] if bright else P['dim'])
            d.line((5,h-3,w-6,h-3),fill='#122132')
        elif resource.startswith('jei/') and 'scrollbar_marker' in resource:
            for yy in range(h//2-2,h//2+3,2):d.line((3,yy,w-4,yy),fill=P['metal'])
        elif resource.startswith('jei/') and 'background_v2' in resource and 'slot_' not in resource:
            # Decorations stay within the original nine-slice corner band.
            if w>12 and h>12:
                d.line((2,2,5,2),fill=P['dim']);d.line((w-6,h-3,w-3,h-3),fill=P['dim'])
                d.point((w-3,2),fill=P['metal'])
        im.putalpha(alpha);overwrite(im,resource)

    # Sparse blueprints: the low-contrast substrate is subordinate to quest nodes.
    im=Image.new('RGBA',(256,256),'#101C29');d=ImageDraw.Draw(im)
    for n in range(0,256,32):
        d.line((n,0,n,255),fill='#142431');d.line((0,n,255,n),fill='#142431')
    for x in range(16,256,32):
        for y in range(16,256,32):d.point((x,y),fill='#1C303F')
    for path in [[(0,48),(24,48),(36,60),(36,88),(64,88)],
                 [(256,208),(232,208),(220,196),(220,168),(192,168)],
                 [(96,0),(96,20),(108,32),(140,32)],
                 [(160,256),(160,236),(148,224),(116,224)]]:
        d.line(path,fill='#203746');x,y=path[-1]
        d.rectangle((x-1,y-1,x+1,y+1),outline='#2A4555')
    d.ellipse((82,82,174,174),outline='#152733')
    d.arc((87,87,169,169),30,110,fill='#1E3544')
    d.arc((87,87,169,169),210,290,fill='#1E3544')
    for x,y in [(128,78),(128,178),(78,128),(178,128)]:
        d.line((x-2,y,x+2,y),fill='#233E4D');d.line((x,y-2,x,y+2),fill='#233E4D')
    overwrite(im,'rain/textures/gui/poc/blueprint.png')
    theme=ASSETS/'ftbquests/ftb_quests_theme.txt'
    theme.write_text(theme.read_text(encoding='utf-8').replace('tile_size=128','tile_size=256'),encoding='utf-8')
    # A dedicated chapter skin gives the sidebar an inset, quieter surface.
    side=Image.new('RGBA',(32,32));frame(side,(0,0,31,31),'#101E2D',P['line'])
    sd=ImageDraw.Draw(side);sd.line((2,4,2,27),fill='#244655');sd.point((2,2),fill=P['cyan'])
    B.save(side,'rain/textures/gui/poc/chapter_panel.png')
    theme.write_text(theme.read_text(encoding='utf-8').replace(
        'chapter_panel_background: part:rain:textures/gui/poc/panel.png',
        'chapter_panel_background: part:rain:textures/gui/poc/chapter_panel.png'),encoding='utf-8')

    # JourneyMap Purist uses local theme images first; supply both local and pack copies.
    jar=B.jar_for('journeymap')
    for name in ['pur_rim_256','pur_rim_512','pur_compass_point']:
        resource='journeymap/theme/flat/minimap/circle/'+name+'.png'
        original=B.source_image(jar,resource);im=original.copy();w,h=im.size
        for y in range(h):
            for x in range(w):
                r,g,b,a=original.getpixel((x,y))
                if not a:continue
                angle=(math.degrees(math.atan2(y-h/2,x-w/2))+360)%360
                color=P['cyan'] if angle%90<12 else P['violet'] if 290<angle<315 else P['metal']
                rgb=tuple(bytes.fromhex(color[1:]));light=max(r,g,b)/255
                im.putpixel((x,y),(*(int(c*light) for c in rgb),a))
        B.save(im,resource,jar,alpha_preserved=True,geometry='native JourneyMap Purist rim/compass silhouette')


def font(size):
    return ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',size)


def menu_save(im,name):
    MENUS.mkdir(parents=True,exist_ok=True);im.save(MENUS/(name+'.png'))


def card(name,label):
    im=Image.new('RGBA',(272,296));d=ImageDraw.Draw(im)
    d.rectangle((0,0,271,295),fill=(9,17,28,206),outline='#35536B')
    d.line((2,2,268,2),fill=P['dim']);d.line((2,2,2,292),fill=P['dim'])
    d.rectangle((12,12,259,30),fill='#142336')
    f=font(12)
    # The community caption sits beyond the logo's right edge at short GUI heights.
    tx=272-12-int(d.textlength(label,font=f)) if name=='community-panel' else 20
    d.text((tx,12),label,font=f,fill=P['metal'])
    d.line((12,35,259,35),fill=P['line'])
    for x,y,dx,dy in [(0,0,1,1),(271,0,-1,1),(0,295,1,-1),(271,295,-1,-1)]:
        d.line([(x+dx*10,y),(x,y),(x,y+dy*10)],fill=P['cyan'],width=2)
    for yy in [40,90,138,188,238]:
        d.rectangle((7,yy+14,8,yy+24),fill=P['dim'])
    for x in range(14,67,6):d.line((x,285,x+2,285),fill=P['line'],width=2)
    d.line((225,285,255,285),fill=P['violet'],width=2)
    menu_save(im,name)


def create_menu_assets():
    card('play-panel','开始旅程 / PLAY');card('community-panel','社区与支持 / COMMUNITY')
    im=Image.new('RGBA',(160,142));d=ImageDraw.Draw(im)
    for box,start,end,color in [((11,2,149,140),12,62,(74,175,201,150)),
                               ((11,2,149,140),115,166,(74,175,201,150)),
                               ((11,2,149,140),196,252,(74,175,201,150)),
                               ((11,2,149,140),287,343,(161,108,203,150)),
                               ((17,8,143,134),0,359,(38,70,92,100))]:
        d.arc(box,start,end,fill=color)
    for a in range(0,360,15):
        r=67;x=80+int(math.cos(math.radians(a))*r);y=71+int(math.sin(math.radians(a))*r)
        d.point((x,y),fill=(88,217,234,160) if a%45==0 else (64,104,128,120))
    for x,y in [(7,71),(153,71),(80,0),(80,141)]:
        d.line((x-2,y,x+2,y),fill=(140,167,185,160))
    menu_save(im,'creation-orbit')
    im=Image.new('RGBA',(540,360));d=ImageDraw.Draw(im)
    for y in range(360):
        a=int(40+40*abs(y-180)/180)
        d.line((0,y,539,y),fill=(9,17,28,a))
    menu_save(im,'atmosphere')
    im=Image.new('RGBA',(540,360));d=ImageDraw.Draw(im)
    for x,y,dx,dy in [(8,8,1,1),(531,8,-1,1),(8,351,1,-1),(531,351,-1,-1)]:
        d.line([(x+dx*30,y),(x,y),(x,y+dy*12)],fill=(77,141,165,130))
    for x in range(70,470,20):d.line((x,9,x+5,9),fill=(60,87,111,80))
    d.line([(10,93),(10,116),(18,124)],fill=(60,125,148,100))
    d.line([(530,93),(530,116),(522,124)],fill=(60,125,148,100))
    menu_save(im,'screen-corners')
    im=Image.new('RGBA',(600,36));d=ImageDraw.Draw(im)
    d.line((0,1,599,1),fill='#286879',width=2)
    d.line((220,1,380,1),fill=P['violet'],width=2)
    d.text((95,10),'PATH OF CREATION  /  TECHNOLOGY & POSSIBILITY',font=font(14),fill=P['text'])
    for x in [4,14,24,574,584,594]:d.rectangle((x,12,x+2,14),fill=P['dim'])
    menu_save(im,'brand-rail')
    # Scroll headers/footers are native size-independent surfaces with no text.
    for name in ['world-header','world-footer']:
        im=Image.new('RGBA',(540,64),'#0B1522');d=ImageDraw.Draw(im)
        yy=63 if name.endswith('header') else 0
        d.line((0,yy,539,yy),fill=P['dim'])
        d.line((226,yy,314,yy),fill=P['violet'])
        for xx in [12,22,32,507,517,527]:d.line((xx,yy,xx+3,yy),fill=P['metal'])
        menu_save(im,name)
    for name,heading in [('world-left','WORLD'),('world-right','CREATION')]:
        im=Image.new('RGBA',(120,340));d=ImageDraw.Draw(im)
        d.line((0,0,119,0),fill=P['line']);d.line((0,339,119,339),fill=P['line'])
        d.text((12,14),heading,font=font(14),fill=P['metal'])
        d.line((12,42,108,42),fill=P['dim'])
        for yy in range(75,285,14):
            d.line((14,yy,25 if yy%28 else 34,yy),fill='#315363')
        d.line([(89,60),(89,170),(72,187),(72,289)],fill=P['dim'],width=2)
        for x,y in [(89,60),(72,289)]:d.rectangle((x-3,y-3,x+3,y+3),outline=P['cyan'])
        d.line((12,312,76,312),fill=P['violet'],width=2)
        menu_save(im,name)


def image_element(template,name,anchor,x,y,w,h,stretch=False):
    values=dict(element_type='image',instance_identifier='poc-polish-'+name,
                anchor_point=anchor,anchor_point_element='',x=str(x),y=str(y),width=str(w),height=str(h),
                source='[source:local]/config/fancymenu/assets/poc-polish/'+name+'.png',
                stretch_x=str(stretch).lower(),stretch_y=str(stretch).lower(),stay_on_screen='false',
                should_be_affected_by_decoration_overlays='false',enable_parallax='false')
    # Reuse the installed editor's complete image schema, changing only values.
    template=re.sub(r'^  \[loading_requirement_container_meta:.*\n','',template,flags=re.M)
    values['element_loading_requirement_container_identifier']='poc-polish-'+name+'-requirements'
    for key,value in values.items():
        line='  '+key+' = '+value
        template=re.sub(r'^  '+re.escape(key)+r' = .*$',lambda m:line,template,flags=re.M)
    template=template.replace('  repeat_texture = false','  [loading_requirement_container_meta:poc-polish-'+name+'-requirements] = [groups:][instances:]\n  repeat_texture = false')
    PLACEMENTS[name]=dict(anchor=anchor,x=x,y=y,w=w,h=h,stretch=stretch)
    return 'element {\n'+template+'\n}\n\n'


def make_layouts():
    LAYOUTS.mkdir(parents=True,exist_ok=True)
    path=ROOT/'config/fancymenu/customization/title_screen_layout.txt'
    original=path.read_text(encoding='utf-8')
    template=re.search(r'\nelement \{\n(.*?)\n\}',original,re.S).group(1)
    chunks=[image_element(template,'atmosphere','top-left',0,0,540,360,True),
            image_element(template,'screen-corners','top-left',0,0,540,360,True),
            image_element(template,'creation-orbit','mid-centered',-80,-35,160,142),
            image_element(template,'play-panel','mid-centered',-224,-78,136,148),
            image_element(template,'community-panel','mid-centered',85,-78,136,148),
            image_element(template,'brand-rail','bottom-centered',-150,-33,300,18)]
    # A separate background decoration layout prevents opaque cards from
    # painting over vanilla buttons. The existing title layout stays byte-identical.
    decorated='''type = fancymenu_layout

layout-meta {
  identifier = title_screen
  render_custom_elements_behind_vanilla = true
  is_enabled = true
  randommode = false
  layout_index = -10
}

'''+''.join(chunks)
    (LAYOUTS/'poc_title_decoration.txt').write_text(decorated,encoding='utf-8')
    obsolete=LAYOUTS/'title_screen_layout.txt'
    if obsolete.exists():
        assert 'poc-polish-atmosphere' in obsolete.read_text(encoding='utf-8')
        obsolete.unlink()  # This file is a generated, uninstalled early candidate.
    world='''type = fancymenu_layout

layout-meta {
  identifier = select_world_screen
  render_custom_elements_behind_vanilla = true
  is_enabled = true
  randommode = false
  layout_index = 0
}

scroll_list_customization {
  preserve_scroll_list_header_footer_aspect_ratio = false
  scroll_list_header_texture = [source:local]/config/fancymenu/assets/poc-polish/world-header.png
  scroll_list_footer_texture = [source:local]/config/fancymenu/assets/poc-polish/world-footer.png
  render_scroll_list_header_shadow = false
  render_scroll_list_footer_shadow = false
  repeat_scroll_list_header_texture = false
  repeat_scroll_list_footer_texture = false
  show_screen_background_overlay_on_custom_background = false
  apply_vanilla_background_blur = true
}

'''
    world+=image_element(template,'world-left','mid-centered',-214,-85,60,170)
    world+=image_element(template,'world-right','mid-centered',154,-85,60,170)
    (LAYOUTS/'poc_world_selection.txt').write_text(world,encoding='utf-8')
    config_dir=HERE/'menu-config';config_dir.mkdir(parents=True,exist_ok=True)
    raw=(ROOT/'config/fancymenu/customizablemenus.txt').read_bytes()
    name=b'net.minecraft.client.gui.screens.worldselection.SelectWorldScreen'
    if name not in raw:raw+=b'\r\n'+name+b' {\r\n}\r\n'
    (config_dir/'customizablemenus.txt').write_bytes(raw)


def native_icon(resource):
    if resource.startswith('rain/'):
        path=ROOT/'kubejs/assets'/resource
        if path.exists():return Image.open(path).convert('RGBA')
    return B.source_image(next(ROOT.glob('*.jar')),resource)


def text(im,xy,label,size=18,color=None):
    ImageDraw.Draw(im).text(xy,label,font=font(size),fill=color or P['text'])


def paste(im,source,xy,size=None):
    source=source.convert('RGBA')
    if size:source=source.resize(size,Image.Resampling.NEAREST)
    im.alpha_composite(source,xy)


def decorations(im,names,gui):
    sw,sh=gui;s=im.width/sw
    for name in names:
        p=PLACEMENTS[name]
        x,y=p['x'],p['y']
        if p['anchor']=='mid-centered':x+=sw/2;y+=sh/2
        if p['anchor']=='bottom-centered':x+=sw/2;y+=sh
        w,h=(sw,sh) if p['stretch'] else (p['w'],p['h'])
        paste(im,Image.open(MENUS/(name+'.png')),(round(x*s),round(y*s)),(round(w*s),round(h*s)))


def button(im,xy,size,label,disabled=False):
    src=ASSETS/f'minecraft/textures/gui/sprites/widget/button{"_disabled" if disabled else ""}.png'
    paste(im,B.nine(Image.open(src),*size,b=3),xy)
    f=font(22);box=f.getbbox(label);width=box[2]-box[0]
    text(im,(xy[0]+(size[0]-width)//2,xy[1]+(size[1]-27)//2),label,22,P['metal'] if disabled else P['text'])


def previews():
    # Main menu: original background and logo, actual additive decoration geometry.
    im=Image.open(ROOT/'config/fancymenu/assets/2025-11-17_23.21.23.png').convert('RGBA').resize((1620,1080))
    decorations(im,['atmosphere','screen-corners','creation-orbit','play-panel','community-panel','brand-rail'],(540,360))
    logo=Image.open(ROOT/'config/fancymenu/assets/minecraft_title.png')
    paste(im,logo,(405,51),(774,300))
    for x,labels in [(156,['单人游戏','多人游戏','模组','选项…','退出游戏']),
                     (1083,['QQ群：1023077022','Discord','BiliBili主页','爱发电主页','Github'])]:
        for y,label in zip([366,441,513,588,663],labels):button(im,(x,y),(372,60),label)
    text(im,(44,37),'创世之径',18);text(im,(18,1026),'Minecraft 1.21.1 · NeoForge',18,P['metal'])
    text(im,(1330,1044),'© Mojang AB',18,P['metal'])
    im.convert('RGB').save(HERE/'preview-menu.png')

    im=Image.new('RGBA',(1620,1080),P['void']);d=ImageDraw.Draw(im)
    d.rectangle((0,144,1619,887),fill='#121C26')
    # Static samples, no reading or modifying saves.
    paste(im,Image.open(MENUS/'world-header.png'),(0,0),(1620,144))
    paste(im,Image.open(MENUS/'world-footer.png'),(0,888),(1620,192))
    decorations(im,['world-left','world-right'],(540,360))
    text(im,(746,18),'选择世界',24)
    paste(im,B.nine(Image.open(ASSETS/'minecraft/textures/gui/sprites/widget/text_field.png'),600,60,3),(510,69))
    text(im,(1350,18),'□ 录制单人游戏',21,P['metal'])
    for n in range(5):
        y=162+n*135
        if n==0:d.rectangle((405,y,1206,y+125),outline='#A0ACB8',width=2)
        d.rectangle((419,y+12,509,y+102),fill='#234358')
        paste(im,Image.open(ASSETS/'rain/textures/gui/poc/emblem.png'),(432,y+25),(64,64))
        text(im,(528,y+10),'新的世界',24)
        text(im,(528,y+44),'空岛 · 创世之径',21,P['metal'])
        text(im,(528,y+75),'生存模式，版本：1.21.1',20,P['metal'])
    d.rectangle((1239,151,1245,878),fill='#0B1522');d.rectangle((1239,153,1245,352),fill=P['dim'])
    for xy,size,label,disabled in [((348,924),(450,60),'进入选中的世界',False),((822,924),(450,60),'创建新的世界',False),
                                  ((348,999),(210,60),'编辑',False),((585,999),(210,60),'删除',False),
                                  ((822,999),(210,60),'重建',False),((1059,999),(210,60),'返回',False)]:
        button(im,xy,size,label,disabled)
    im.convert('RGB').save(HERE/'preview-worlds.png')

    # Reuse same native renderer for creative/inventory/HUD assets.
    B.previews()
    # Include the matching circular map frame in the HUD component preview.
    hud=Image.open(HERE/'preview-hotbar.png').convert('RGBA')
    map_demo=Image.new('RGBA',(1440,850),P['void']);paste(map_demo,hud,(0,290))
    md=ImageDraw.Draw(map_demo)
    md.ellipse((30,20,290,280),fill='#102033')
    rim=Image.open(ASSETS/'journeymap/theme/flat/minimap/circle/pur_rim_256.png')
    paste(map_demo,rim,(30,20),(260,260))
    text(map_demo,(318,70),'HUD · 青蓝定位环与金属槽位',25)
    text(map_demo,(318,118),'地图内容、方位文字和位置仍由 JourneyMap 绘制',20,P['metal'])
    map_demo.convert('RGB').save(HERE/'preview-hotbar.png')
    # Its blueprint renderer assumed a 128px tile; redraw accurate new theme.
    im=Image.new('RGBA',(1620,1080),P['void'])
    bg=Image.open(ASSETS/'rain/textures/gui/poc/blueprint.png').resize((768,768),Image.Resampling.NEAREST)
    for x in range(0,1620,768):
        for y in range(0,1080,768):paste(im,bg,(x,y))
    paste(im,B.nine(Image.open(ASSETS/'rain/textures/gui/poc/chapter_panel.png'),345,1080),(0,0))
    text(im,(24,22),'任务书',28)
    for n,label in enumerate(['欢迎','主线','第一章：无中生有','第二章：苦尽甘来','第三章：探明真相','第四章：创世之径','第五章：创造模式？','提示','提示与技巧','AE2']):
        y=92+n*54
        if n==2:ImageDraw.Draw(im).rectangle((9,y-3,333,y+44),fill='#1B3145',outline=P['dim'])
        text(im,(24,y),label,23,P['cyan'] if n==2 else P['text'])
    nodes=[(465,140,'grass_block','cube'),(685,260,'cobblestone','cube'),(940,150,'sand','cube'),
           (880,410,'iron_ingot','item'),(1190,365,'redstone','item'),(685,580,'gold_ingot','item'),
           (960,710,'diamond','item'),(1330,740,'ender_pearl','item')]
    edges=[(0,1),(1,2),(1,3),(3,4),(1,5),(5,6),(6,7),(4,7)]
    d=ImageDraw.Draw(im)
    for a,b in edges:d.line((nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1]),fill='#668A9C',width=3)
    for n,(x,y,name,typ) in enumerate(nodes):
        shape='pentagon' if n==0 else 'rsquare'
        src=Image.open(ASSETS/f'ftbquests/textures/shapes/{shape}/background.png')
        paste(im,src,(x-33,y-33),(66,66))
        # Static sample cube uses the native quest emblem; item sprites are exact.
        icon=Image.open(ASSETS/'rain/textures/gui/poc/emblem.png') if typ=='cube' else native_icon('minecraft/textures/item/'+name+'.png')
        paste(im,icon,(x-20,y-20),(40,40))
    text(im,(389,1011),'任务背景与面板素材预览 · 节点与文字由游戏绘制',20,P['metal'])
    im.convert('RGB').save(HERE/'preview-quests.png')
    names=['menu','worlds','hotbar','creative','quests']
    board=Image.new('RGB',(1500,1580),P['void'])
    for n,name in enumerate(names):
        source=Image.open(HERE/f'preview-{name}.png');source.thumbnail((720,480))
        x=20+(n%2)*750;y=50+(n//2)*520
        board.paste(source,(x,y));ImageDraw.Draw(board).text((x,y-29),['主菜单','世界选择','快捷栏','创造背包','任务书'][n],font=font(21),fill=P['text'])
    board.save(HERE/'preview-overview.png')
    (HERE/'preview.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>创世之径 · UI 细节改版</title>
<style>body{margin:0;padding:28px;background:#09111c;color:#e0edf5;font:16px system-ui}main{max-width:1620px;margin:auto}h1{font-size:26px}p{color:#8ca7b9}img{width:100%;image-rendering:pixelated;margin:12px 0 30px;border:1px solid #35536b}nav a{color:#58d9ea;margin-right:22px}h2{font-size:20px}</style>
<main><h1>创世之径 · 五页 UI 细节改版</h1><p>实际素材的静态预览。世界列表为样本，玩家实体、游戏字体、背景与完整任务图以游戏为准。</p><nav>'''+''.join(f'<a href="#{n}">{t}</a>' for n,t in zip(names,['主菜单','世界选择','快捷栏','创造背包','任务书']))+'</nav>'+''.join(f'<h2 id="{n}">{t}</h2><img src="preview-{n}.png">' for n,t in zip(names,['主菜单','世界选择','快捷栏','创造背包','任务书']))+'</main></html>',encoding='utf-8')


def protect():
    roots=['kubejs/server_scripts','kubejs/startup_scripts','kubejs/client_scripts','kubejs/data','config/ftbquests/quests']
    paths=[p for r in roots for p in (ROOT/r).rglob('*') if p.is_file()]
    paths += [ROOT/p for p in ['options.txt','config/ftbquests-client.snbt','config/ftblibrary-client.snbt','config/fancymenu/customization/title_screen_layout.txt']]
    paths += [ROOT/'journeymap/config/6.0'/p for p in ['journeymap.core.config','journeymap.minimap.config','journeymap.minimap2.config']]
    return {p.relative_to(ROOT).as_posix():sha(p) for p in paths}


def install():
    manifest=json.loads((HERE/'installation-plan.json').read_text(encoding='utf-8'))
    before=protect();record=[]
    # Confirm every candidate and live baseline before any mutation.
    for item in manifest:
        src=HERE/item['source'];dst=ROOT/item['target']
        assert sha(src)==item['sha256'],src
        current=sha(dst) if dst.exists() else None
        assert current==item['before_sha256'],f'Live file changed after preview: {dst}'
    for item in manifest:
        src=HERE/item['source'];dst=ROOT/item['target']
        backup=CACHE/'backup'/item['target']
        if dst.exists():
            backup.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(dst,backup)
        dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
        record.append(item)
    assert before==protect(),'Protected files changed'
    (CACHE/'installation.json').write_text(json.dumps({'files':record,'protected_files':len(before),'protected_unchanged':True},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Installed {len(record)} changed files; {len(before)} protected files unchanged. No mod JAR/personal options/saves changes.')


def stage():
    before=protect()
    ASSETS.mkdir(parents=True,exist_ok=True);CACHE.mkdir(parents=True,exist_ok=True)
    polish_resources();create_menu_assets();make_layouts()
    # The base preview also references unchanged crafting textures; use copies only.
    for p in (ROOT/'design/ui-tech-2026-10-08/assets').rglob('*'):
        if p.is_file() and not (ASSETS/p.relative_to(ROOT/'design/ui-tech-2026-10-08/assets')).exists():
            dst=ASSETS/p.relative_to(ROOT/'design/ui-tech-2026-10-08/assets');dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dst)
    previews()
    plan=[]
    for source,target in [('assets','kubejs/assets'),('menu-assets','config/fancymenu/assets/poc-polish'),('layouts','config/fancymenu/customization'),('menu-config','config/fancymenu')]:
        for p in (HERE/source).rglob('*'):
            if not p.is_file():continue
            rel=Path(target)/p.relative_to(HERE/source);live=ROOT/rel
            if not live.exists() or sha(live)!=sha(p):plan.append(dict(source=p.relative_to(HERE).as_posix(),target=rel.as_posix(),sha256=sha(p),before_sha256=sha(live) if live.exists() else None))
    for p in (ASSETS/'journeymap/theme/flat/minimap/circle').glob('pur_*.png'):
        rel=Path('journeymap/icon/theme/flat/minimap/circle')/p.name;live=ROOT/rel
        if not live.exists() or sha(live)!=sha(p):plan.append(dict(source=p.relative_to(HERE).as_posix(),target=rel.as_posix(),sha256=sha(p),before_sha256=sha(live) if live.exists() else None))
    (HERE/'manifest.json').write_text(json.dumps(B.MANIFEST,indent=2,ensure_ascii=False),encoding='utf-8')
    (HERE/'installation-plan.json').write_text(json.dumps(plan,indent=2,ensure_ascii=False),encoding='utf-8')
    (HERE/'tokens.json').write_text(json.dumps(dict(palette=P,slot=18,item=16,hud_step=20,pixel_border=1,nine_slice=4,menu_gui=[540,360],font={'game':'Minecraft native','decorative':'Microsoft YaHei raster caption','caption_gui_px':6},spacing={'card_padding_gui':6,'button_gap_gui':5},radius=0,shadows={'hard_pixel':P['shadow'],'blur':0},states=['normal','hover','disabled'],placements=PLACEMENTS),indent=2,ensure_ascii=False),encoding='utf-8')
    assert before==protect()
    print(f'Staged {len(B.MANIFEST)} textures, {len(list(MENUS.glob("*.png")))} menu assets, 2 layouts; {len(plan)} changed live files proposed.')


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--install',action='store_true');args=parser.parse_args()
    install() if args.install else stage()
