"""Build original pixel UI assets from installed-mod geometry; stage before install."""
from __future__ import annotations

import argparse
import colorsys
import hashlib
import json
import re
import shutil
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
ASSETS = HERE / 'assets'
CACHE = ROOT / '.cache/ui-tech-20261008'
P = dict(void='#09111C', panel='#142336', raised='#1E344B', line='#35536B',
         cyan='#58D9EA', dim='#286879', amber='#E9B867', success='#7AD9B0',
         locked='#667586', text='#E0EDF5', plate='#A8C8D1',
         state_complete='#B0F5CF', state_started='#B1F3FF', state_idle='#E0EDF5')
MANIFEST = {}
PACK_NAME = 'Path-of-Creation-Cyan-UI.zip'
PACK_ID = 'file/' + PACK_NAME
OVERRIDE_NAME = 'kubejs_lang_override-1.21.1-neoforge-1.0-poc.jar'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def jar_for(key):
    return next(p for p in (ROOT / 'mods').glob('*.jar') if key.lower() in p.name.lower())


def source_image(jar, resource):
    with ZipFile(jar) as z:
        return Image.open(BytesIO(z.read('assets/' + resource))).convert('RGBA')


def save(im, resource, source=None, **extra):
    dest = ASSETS / resource
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest)
    MANIFEST[resource] = dict(size=list(im.size), sha256=digest(dest), **extra)
    if source:
        MANIFEST[resource]['source_jar'] = source.name
        with ZipFile(source) as z:
            name = 'assets/' + resource + '.mcmeta'
            if name in z.namelist():
                dest.with_name(dest.name + '.mcmeta').write_bytes(z.read(name))


def frame(im, box, fill=None, edge=None):
    d = ImageDraw.Draw(im)
    x, y, r, b = box
    d.rectangle(box, fill=fill or P['panel'], outline=P['void'])
    d.line([(x+1, b-1), (x+1, y+1), (r-1, y+1)], fill=edge or P['line'])
    d.line([(r-1, y+2), (r-1, b-1), (x+2, b-1)], fill='#0C1725')


def slot(im, x, y, size=18, output=False):
    d = ImageDraw.Draw(im)
    d.rectangle((x, y, x+size-1, y+size-1), fill=P['void'])
    d.rectangle((x+1, y+1, x+size-2, y+size-2), fill='#172A3D')
    d.line([(x, y+size-1), (x, y), (x+size-1, y)], fill=P['dim'])
    d.line([(x+size-1, y+1), (x+size-1, y+size-1), (x+1, y+size-1)], fill=P['line'])
    if output:
        for xx, yy, dx, dy in [(x,y,1,1),(x+size-1,y,-1,1),(x,y+size-1,1,-1),(x+size-1,y+size-1,-1,-1)]:
            d.line([(xx+dx*3, yy), (xx, yy), (xx, yy+dy*3)], fill=P['amber'])


def grid(im, x, y, cols, rows):
    for row in range(rows):
        for col in range(cols):
            slot(im, x+18*col, y+18*row)


def arrow(im, x, y, w=22):
    d = ImageDraw.Draw(im)
    d.polygon([(x,y+5),(x+w-8,y+5),(x+w-8,y),(x+w,y+8),(x+w-8,y+16),
               (x+w-8,y+11),(x,y+11)], fill=P['dim'])
    d.line([(x+1,y+7),(x+w-7,y+7),(x+w-7,y+4),(x+w-3,y+8)], fill=P['cyan'])


def plate(im, x, y, w, h=11):
    d = ImageDraw.Draw(im)
    d.rectangle((x, y, x+w-1, y+h-1), fill=P['plate'])
    d.line((x, y+h-1, x+w-1, y+h-1), fill=P['dim'])
    d.line((x, y, x+w-1, y), fill='#D1E5E9')


def panel(size, visible):
    im = Image.new('RGBA', size)
    w, h = visible
    frame(im, (0, 0, w-1, h-1))
    d = ImageDraw.Draw(im)
    d.line((3, 3, 3, h-4), fill=P['dim'])
    d.line((w-4, 3, w-4, h-4), fill=P['dim'])
    d.line((4, h-4, w-5, h-4), fill=P['line'])
    for x in [4, w-6]:
        for y in [4, h-6]:
            d.rectangle((x,y,x+1,y+1),fill=P['cyan'])
    return im


TABLES = {
    'basic': dict(visible=(176,170), size=(256,256), grid=(31,17,3), inv=(7,87), out=(119,31), title=32),
    'advanced': dict(visible=(176,206), size=(256,256), grid=(13,17,5), inv=(7,123), out=(137,48), title=14),
    'elite': dict(visible=(200,242), size=(256,256), grid=(7,17,7), inv=(19,159), out=(167,66), title=8),
    'ultimate': dict(visible=(234,278), size=(512,512), grid=(7,17,9), inv=(38,195), out=(201,84), title=8),
}


def build_tables():
    ext = jar_for('ExtendedCrafting')
    for name, spec in TABLES.items():
        im = panel(spec['size'], spec['visible'])
        w,h = spec['visible']; gx,gy,n = spec['grid']; ix,iy=spec['inv']; ox,oy=spec['out']
        d = ImageDraw.Draw(im)
        # Circuits are confined to the free output column and margins.
        d.line([(ox+12, oy-6),(ox+12,22),(w-12,22),(w-12,29)], fill=P['dim'])
        d.rectangle((w-13,29,w-11,31),fill=P['cyan'])
        d.line([(ox+12,oy+32),(ox+12,iy-22),(w-12,iy-22)],fill=P['dim'])
        for yy in range(iy-36,iy-27,3):d.line((ox+4,yy,ox+20,yy),fill=P['line'])
        plate(im,spec['title']-2,4,w-spec['title']-4)
        plate(im,ix-1,h-95,163,10)
        grid(im,gx,gy,n,n);grid(im,ix,iy,9,3);grid(im,ix,iy+58,9,1)
        slot(im,ox,oy,26,True)
        arrow(im,gx+n*18+2,oy+5,w=22 if name!='ultimate' else 22)
        # 18px slots; output is 26px and must retain its original UV.
        save(im,f'extendedcrafting/textures/gui/{name}_table.png',ext,
             visible=list(spec['visible']),grid=list(spec['grid']),inventory=list(spec['inv']),output=list(spec['out']))
    ava=jar_for('Re-Avaritia')
    im=Image.open(ASSETS/'extendedcrafting/textures/gui/ultimate_table.png')
    save(im,'avaritia/textures/gui/craft/extreme_crafting_table_gui.png',ava,visible=[234,278])


def build_vanilla():
    vanilla=next(ROOT.glob('*.jar'))
    for name in ['inventory','crafting_table','generic_54']:
        resource=f'minecraft/textures/gui/container/{name}.png'
        original=source_image(vanilla,resource)
        if name=='generic_54':
            # Vanilla chest renderer cuts and stacks two source segments.
            im=panel(original.size,(176,222))
            plate(im,7,4,162,11);grid(im,7,17,9,6)
            # This unused-on-6-row strip is the inventory title for shorter chests.
            plate(im,7,126,162,12)
            grid(im,7,139,9,3);grid(im,7,197,9,1)
        else:
            im=panel(original.size,(176,166))
            grid(im,7,83,9,3);grid(im,7,141,9,1)
            if name=='crafting_table':
                plate(im,7,4,162);plate(im,7,72,162,10)
                grid(im,29,16,3,3);slot(im,123,34,26,True);arrow(im,90,39)
            else:
                # The paperdoll panel retains black contrast; armor silhouettes are sprites.
                d=ImageDraw.Draw(im);d.rectangle((25,7,75,77),fill=P['void'],outline=P['line'])
                for y in [7,25,43,61]:slot(im,7,y)
                slot(im,76,61);grid(im,97,17,2,2);slot(im,153,27);arrow(im,135,27,w=14)
                plate(im,86,13,83,11)
        save(im,resource,vanilla,visible=list(original.getbbox()[2:]))


def creative_slots(name):
    coords = [(8+c*18,111) for c in range(9)]
    if name == 'tab_inventory':
        coords += [(8+c*18,53+r*18) for r in range(3) for c in range(9)]
        coords += [(53,5),(107,5),(34,19),(53,32),(107,32),(172,111)]
    else:
        coords += [(8+c*18,17+r*18) for r in range(5) for c in range(9)]
    return coords


def build_creative():
    vanilla=next(ROOT.glob('*.jar'))
    for name in ['tab_items','tab_item_search','tab_inventory']:
        resource=f'minecraft/textures/gui/container/creative_inventory/{name}.png'
        original=source_image(vanilla,resource)
        im=panel(original.size,(195,136));d=ImageDraw.Draw(im)
        if name=='tab_inventory':
            d.rectangle((73,5,105,49),fill=P['void'],outline=P['line'])
        else:
            # Creative tab labels use each mod's label color, normally #404040.
            plate(im,7,4,70 if name=='tab_item_search' else 162,11)
            frame(im,(174,17,187,129),P['void'],P['line'])
            if name=='tab_item_search':
                # The actual search EditBox uses white text and no border.
                frame(im,(80,4,169,14),P['void'],P['dim'])
        for x,y in creative_slots(name):slot(im,x,y)
        if name=='tab_inventory':
            d.rectangle((173,112,188,127),fill='#4C2934')
            d.line([(176,115),(185,124)],fill='#F0908D',width=2)
            d.line([(185,115),(176,124)],fill='#F0908D',width=2)
        # Tab corners/open seams and transparent atlas padding are structural.
        im.putalpha(original.getchannel('A'))
        save(im,resource,vanilla,visible=[195,136],slots=creative_slots(name),alpha_preserved=True)
    with ZipFile(vanilla) as z:
        resources=sorted(n.removeprefix('assets/') for n in z.namelist()
                         if n.startswith('assets/minecraft/textures/gui/sprites/container/creative_inventory/')
                         and n.endswith('.png'))
    for resource in resources:
        original=source_image(vanilla,resource);im=Image.new('RGBA',original.size)
        active='selected_' in resource and 'unselected_' not in resource
        disabled='disabled' in resource
        # Preserve all 28 tab seams and both scroller silhouettes exactly.
        for y in range(im.height):
            for x in range(im.width):
                r,g,b,a=original.getpixel((x,y))
                if not a:continue
                grey=(r+g+b)//3
                color=P['void'] if grey<70 else P['line'] if grey<180 else P['panel'] if grey<235 else P['cyan'] if active else P['dim']
                if disabled:color='#2A3B4D' if grey>=235 else '#101C2A'
                im.putpixel((x,y),tuple(int(color[i:i+2],16) for i in (1,3,5))+(a,))
        save(im,resource,vanilla,alpha_preserved=True)


def build_jei():
    jei=jar_for('jei-1.21.1')
    names=['gui_background_v2','ingredient_list_background_v2','bookmark_list_background_v2',
           'ingredient_list_slot_background_v2','bookmark_list_slot_background_v2','search_background_v2',
           'button_enabled_v2','button_disabled_v2','button_highlight_v2','button_pressed_v2',
           'button_pressed_highlight_v2','scrollbar_background_v2','scrollbar_marker_v2',
           'recipe_preview_background_v2','single_recipe_background_v2','recipe_catalyst_slot_background_v2',
           'recipe_options_tab_v2','catalyst_tab_v2']
    for name in names:
        resource=f'jei/textures/gui/sprites/{name}.png'
        original=source_image(jei,resource);w,h=original.size
        im=Image.new('RGBA',(w,h))
        fill=P['panel'];edge=P['line']
        if 'disabled' in name:fill='#101C2A';edge='#2A3B4D'
        elif 'highlight' in name:fill='#254459';edge=P['cyan']
        elif 'pressed' in name:fill=P['void'];edge=P['dim']
        elif 'search' in name:fill=P['void'];edge=P['dim']
        elif 'slot_background' in name:fill='#172A3D';edge=P['dim']
        elif 'scrollbar_marker' in name:fill=P['raised'];edge=P['cyan']
        elif name in ['single_recipe_background_v2','recipe_preview_background_v2']:
            # Third-party recipe labels often hardcode dark text, so recipe cards stay light.
            fill='#B7CED5';edge='#7198A9'
        frame(im,(0,0,w-1,h-1),fill,edge)
        if name in ['gui_background_v2','ingredient_list_background_v2','bookmark_list_background_v2']:
            d=ImageDraw.Draw(im)
            for x,y,dx,dy in [(2,2,1,1),(w-3,2,-1,1),(2,h-3,1,-1),(w-3,h-3,-1,-1)]:
                d.line([(x+dx*5,y),(x,y),(x,y+dy*5)],fill=P['dim'])
                d.point((x,y),fill=P['cyan'])
        save(im,resource,jei)
    color={'pageNavigationBackground':'0xD9142336','pageNavigationText':'0xFFE0EDF5',
           'searchFieldText':'0xFFE0EDF5','searchFieldErrorText':'0xFFFF8A85',
           'recipeCategoryTitleText':'0xFFE0EDF5','recipeCategoryIconText':'0xFFE0EDF5',
           'lookupHistoryLine':'0xFF35536B','recipeTransferButtonHighlight':'0x80E9B867',
           'bookmarkDragPageFlipHighlight':'0x8058D9EA','bookmarkDragPageFlipHint':'0x40286879'}
    (ASSETS/'jei/gui').mkdir(parents=True,exist_ok=True)
    (ASSETS/'jei/gui/colors.json').write_text(json.dumps(color,indent=2)+'\n',encoding='utf-8')


def build_tweak_buttons():
    jar=jar_for('craftingtweaks')
    resource='craftingtweaks/gui.png'
    original=source_image(jar,resource)
    im=Image.new('RGBA',original.size)
    # Retain the mod atlas's UV, glyph silhouettes and alpha. Replace its bevel palette.
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=original.getpixel((x,y))
            if not a:continue
            if max(r,g,b)-min(r,g,b)>12:
                value=(r,g,b,a)  # colored warning/count markings retain their meaning
            else:
                grey=(r+g+b)//3
                color=P['void'] if grey<70 else P['raised'] if grey<160 else P['line'] if grey<220 else P['text']
                value=tuple(int(color[i:i+2],16) for i in (1,3,5))+(a,)
            im.putpixel((x,y),value)
    # Edge accents on both normal and hover styles; all atlas cell sizes are unchanged.
    d=ImageDraw.Draw(im)
    for yy,cellw,cellh in [(0,16,16),(16,16,16),(48,16,10),(58,16,10),
                          (78,10,16),(94,10,16),(126,10,10),(136,10,10)]:
        for col in range(7):
            x=col*cellw
            d.line((x+2,yy+1,x+cellw-3,yy+1),fill=P['cyan'] if yy in [16,58,94,136] else P['dim'])
    save(im,resource,jar,geometry='source UV and glyph alpha retained')


def build_widgets():
    vanilla=next(ROOT.glob('*.jar'))
    for name in ['button','button_highlighted','button_disabled','text_field','text_field_highlighted']:
        resource=f'minecraft/textures/gui/sprites/widget/{name}.png'
        original=source_image(vanilla,resource);w,h=original.size
        im=Image.new('RGBA',(w,h))
        fill=P['raised'];edge=P['dim']
        if 'highlighted' in name:fill='#274A5B';edge=P['cyan']
        elif 'disabled' in name:fill='#101C2A';edge='#2A3B4D'
        elif 'text_field' in name:fill=P['void'];edge=P['line']
        frame(im,(0,0,w-1,h-1),fill,edge)
        save(im,resource,vanilla)


def build_hotbar():
    vanilla=next(ROOT.glob('*.jar'))
    for name in ['hotbar','hotbar_selection','hotbar_offhand_left','hotbar_offhand_right',
                 'hotbar_attack_indicator_background','hotbar_attack_indicator_progress']:
        resource=f'minecraft/textures/gui/sprites/hud/{name}.png'
        original=source_image(vanilla,resource);w,h=original.size
        im=Image.new('RGBA',(w,h),P['panel']);d=ImageDraw.Draw(im)
        if name=='hotbar':
            frame(im,(0,0,w-1,h-1))
            for col in range(9):slot(im,1+col*20,1,20)
        elif name=='hotbar_selection':
            frame(im,(0,0,w-1,h-1),P['void'],P['cyan'])
            d.rectangle((1,1,w-2,h-2),outline=P['cyan'])
            for x,y,dx,dy in [(0,0,1,1),(w-1,0,-1,1),(0,h-1,1,-1),(w-1,h-1,-1,-1)]:
                d.line([(x+dx*4,y),(x,y),(x,y+dy*4)],fill=P['amber'])
        elif 'offhand' in name:
            frame(im,(0,0,w-1,h-1),P['panel'],P['dim'])
            # Keep Minecraft's asymmetrical side attachment and empty silhouette.
            slot(im,1 if name.endswith('left') else 8,2,20)
        else:
            fill=P['cyan'] if name.endswith('progress') else P['line']
            im=Image.new('RGBA',(w,h),fill)
        im.putalpha(original.getchannel('A'))
        geometry={'geometry':'native HUD dimensions, 20px item step, original alpha mask'}
        if name=='hotbar':geometry['item_origins']=[[3+c*20,3] for c in range(9)]
        elif 'offhand' in name:geometry['item_origin']=[3 if name.endswith('left') else 10,4]
        save(im,resource,vanilla,alpha_preserved=True,**geometry)


def tick(color):
    im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im)
    d.line([(3,8),(6,11),(13,4)],fill=P['void'],width=4)
    d.line([(3,7),(6,10),(13,3)],fill=color,width=2)
    return im


def build_quests():
    base='rain/textures/gui/poc/'
    bg=Image.new('RGBA',(128,128),'#121F2D');d=ImageDraw.Draw(bg)
    # At GUI scale 4 each source pixel occupies 4 screen pixels. Keep the
    # grid sparse and low-contrast so task nodes remain the primary signal.
    for n in range(0,128,16):
        d.line((n,0,n,127),fill='#152532');d.line((0,n,127,n),fill='#152532')
    for n in range(0,128,64):
        d.line((n,0,n,127),fill='#192A39');d.line((0,n,127,n),fill='#192A39')
    for path in [[(0,16),(12,16),(20,24),(20,40)],[(128,104),(108,104),(100,96),(100,84)],
                 [(48,0),(48,12),(56,20),(72,20)],[(68,128),(68,116),(60,108),(44,108)]]:
        d.line(path,fill='#1D3543',width=1);x,y=path[-1];d.rectangle((x-1,y-1,x+1,y+1),outline='#254958')
    save(bg,base+'blueprint.png')
    for name,fill,edge in [('panel',P['panel'],P['line']),('button',P['raised'],P['dim']),
                           ('hover', '#274A5B',P['cyan']),('disabled','#101C2A','#2A3B4D'),
                           ('inset',P['void'],P['line'])]:
        im=Image.new('RGBA',(32,32));frame(im,(0,0,31,31),fill,edge)
        save(im,base+name+'.png')
    save(tick(P['success']),base+'check.png')
    save(tick('#A0BDCD'),base+'check_inactive.png')
    library=jar_for('ftb-library')
    for name,color in [('accept',P['success']),('accept_gray','#A0BDCD')]:
        resource=f'ftblibrary/textures/icons/{name}.png'
        original=source_image(library,resource);im=original.copy()
        rgb=tuple(bytes.fromhex(color[1:]));shadow=tuple(bytes.fromhex(P['void'][1:]))
        for y in range(im.height):
            for x in range(im.width):
                r,g,b,a=original.getpixel((x,y))
                im.putpixel((x,y),(*(rgb if max(r,g,b)>80 else shadow),a))
        save(im,resource,library,alpha_preserved=True,geometry='native task-type/checkmark atlas icon')
    emblem=Image.new('RGBA',(32,32));d=ImageDraw.Draw(emblem)
    d.polygon([(16,2),(29,9),(29,23),(16,30),(3,23),(3,9)],fill=P['void'],outline=P['dim'])
    d.polygon([(16,7),(24,12),(16,17),(8,12)],fill=P['cyan'])
    d.polygon([(8,13),(15,18),(15,26),(8,22)],fill=P['dim'])
    d.polygon([(17,18),(24,13),(24,22),(17,26)],fill='#3A97B4')
    save(emblem,base+'emblem.png')
    ftb=jar_for('ftb-quests')
    with ZipFile(ftb) as z:
        for shape in ['circle','diamond','gear','heart','hexagon','octagon','pentagon','rsquare','square']:
            resource=f'ftbquests/textures/shapes/{shape}/background.png'
            original=Image.open(BytesIO(z.read('assets/'+resource))).convert('RGBA')
            # Original alpha geometry is retained; hit-test shape.png is never overridden.
            im=Image.new('RGBA',original.size);w,h=im.size
            for y in range(h):
                v=int(38+17*(1-y/max(1,h-1)))
                for x in range(w):im.putpixel((x,y),(v,int(v*1.4),int(v*1.85),original.getpixel((x,y))[3]))
            save(im,resource)
            (ASSETS/(resource+'.mcmeta')).write_text('{"texture":{"blur":false,"clamp":true}}\n',encoding='utf-8')
    part=lambda name:f'part:rain:textures/gui/poc/{name}.png; pos=0,0,32,32; corner=4; texture_w=32; texture_h=32'
    theme={
        'background':'rain:textures/gui/poc/blueprint.png; color=#FFFFFFFF; tile_size=128',
        'chapter_panel_background':part('panel'), 'key_reference_background':part('panel'),
        'selected_chapter_highlight_1':'#18286879','selected_chapter_highlight_2':'#101E344B',
        'text_color':P['text'],'hover_text_color':P['cyan'],'disabled_text_color':'#8A9CAE',
        'widget_border':P['line'],'widget_background':'#D9142336','symbol_in':P['success'],'symbol_out':P['dim'],
        'button':part('button'),'panel':part('panel'),'disabled_button':part('disabled'),'hover_button':part('hover'),
        'context_menu':part('panel'),'scroll_bar_background':'color:#09111C',
        'scroll_bar':part('button'),'container_slot':part('inset'),'text_box':part('inset'),
        'quest_view_background':part('panel'),'quest_view_border':P['dim'],'quest_view_title':P['cyan'],
        'tasks_text_color':P['cyan'],'rewards_text_color':P['amber'],
        'quest_completed_color':P['state_complete'],'quest_started_color':P['state_started'],
        'quest_not_started_color':P['state_idle'],'quest_locked_color':'#FF667586',
        'dependency_line_completed_color':'#D07AD9B0','dependency_line_uncompleted_color':'#B07094A8',
        'dependency_line_unavailable_color':'#70667586','dependency_line_requires_color':P['cyan'],
        'dependency_line_required_for_color':P['amber'],'dependency_line_thickness':'0.12',
        'dependency_line_selected_speed':'0.6',
        'modpack_icon':'rain:textures/gui/poc/emblem.png','check_icon':'rain:textures/gui/poc/check.png',
        'checkmark_task_active':'rain:textures/gui/poc/check.png',
        'checkmark_task_inactive':'rain:textures/gui/poc/check_inactive.png',
        'pin_icon_on':'ftbquests:textures/gui/pin.png; color=#E9B867',
        'pin_icon_off':'ftbquests:textures/gui/pin.png; color=#A0BDCD',
        'guide_icon':'ftbquests:textures/gui/guide.png; color=#58D9EA',
        'collect_rewards_icon':'ftbquests:textures/gui/collect_rewards.png; color=#E9B867',
    }
    path=ASSETS/'ftbquests/ftb_quests_theme.txt';path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text('// Path of Creation: Cyan Circuit UI, Minecraft 1.21.1\n[*]\n'+
                    '\n'.join(f'{k}: {v}' for k,v in theme.items())+'\n',encoding='utf-8')


def font(size):
    return ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',size)


def nine(im,w,h,b=4):
    sw,sh=im.size;out=Image.new('RGBA',(w,h))
    xs=[0,b,sw-b,sw];ys=[0,b,sh-b,sh];tx=[0,b,w-b,w];ty=[0,b,h-b,h]
    for yy in range(3):
        for xx in range(3):
            tile=im.crop((xs[xx],ys[yy],xs[xx+1],ys[yy+1]))
            tile=tile.resize((tx[xx+1]-tx[xx],ty[yy+1]-ty[yy]),Image.Resampling.NEAREST)
            out.alpha_composite(tile,(tx[xx],ty[yy]))
    return out


def previews():
    # Static fixed data only: actual generated textures, illustrative labels and item icons.
    canvas=Image.new('RGBA',(1440,960),P['void']);d=ImageDraw.Draw(canvas)
    d.text((42,26),'创世之径  /  青蓝科技 UI',font=font(30),fill=P['text'])
    d.text((42,70),'合成界面 · 静态素材预览，实际文字由游戏绘制',font=font(16),fill=P['locked'])
    table=Image.open(ASSETS/'extendedcrafting/textures/gui/ultimate_table.png').crop((0,0,234,278))
    tweaks=Image.open(ASSETS/'craftingtweaks/gui.png')
    for row,sx in enumerate([16,48,32]):
        table.alpha_composite(tweaks.crop((sx,0,sx+16,16)),(171,17+row*18))
    table=table.resize((702,834),Image.Resampling.NEAREST);canvas.alpha_composite(table,(365,112));d=ImageDraw.Draw(canvas)
    d.text((389,125),'终极合成',font=font(22),fill='#404040')
    d.text((482,663),'物品栏',font=font(22),fill='#404040')
    # Generic items are drawn to the exact 16px interiors without dynamic data.
    vanilla=next(ROOT.glob('*.jar'))
    for i,n in enumerate(['diamond','iron_ingot','redstone','gold_ingot','ender_pearl','nether_star']):
        icon=source_image(vanilla,f'minecraft/textures/item/{n}.png').resize((48,48),Image.Resampling.NEAREST)
        canvas.alpha_composite(icon,(365+24+i*54,112+54))
    pane=nine(Image.open(ASSETS/'jei/textures/gui/sprites/ingredient_list_background_v2.png'),300,775,16)
    canvas.alpha_composite(pane,(1100,112));d=ImageDraw.Draw(canvas)
    d.text((1122,133),'JEI  /  物品浏览',font=font(22),fill=P['text'])
    for row in range(12):
        for col in range(5):
            item=['diamond','iron_ingot','redstone','gold_ingot','ender_pearl','nether_star'][(row+col)%6]
            icon=source_image(vanilla,f'minecraft/textures/item/{item}.png').resize((32,32),Image.Resampling.NEAREST)
            canvas.alpha_composite(icon,(1123+col*51,191+row*48))
    search=nine(Image.open(ASSETS/'jei/textures/gui/sprites/search_background_v2.png'),270,30,6)
    canvas.alpha_composite(search,(1115,828));d=ImageDraw.Draw(canvas)
    d.text((1122,833),'搜索物品…',font=font(17),fill=P['locked'])
    for j,k in enumerate(['cyan','amber','success']):
        d.rectangle((42,220+j*96,58,236+j*96),fill=P[k])
        d.text((72,216+j*96),['青蓝槽框','琥珀输出','状态指示'][j],font=font(18),fill=P['text'])
    canvas.convert('RGB').save(HERE/'preview-crafting.png')

    canvas=Image.new('RGBA',(1440,960),P['void'])
    tile=Image.open(ASSETS/'rain/textures/gui/poc/blueprint.png').resize((512,512),Image.Resampling.NEAREST)
    for y in range(0,960,512):
        for x in range(0,1440,512):canvas.alpha_composite(tile,(x,y))
    pane=nine(Image.open(ASSETS/'rain/textures/gui/poc/panel.png'),330,960)
    canvas.alpha_composite(pane,(0,0));d=ImageDraw.Draw(canvas)
    d.text((25,24),'创世之径 · 任务书',font=font(25),fill=P['text'])
    entries=['欢迎','欢迎','音频','主线','第一章：无中生有','第二章：苦尽甘来','第三章：探明真相',
             '第四章：创世之径','第五章：创造模式？','[DLC] 第六章：登神长阶','提示','提示与技巧','ae2']
    for i,label in enumerate(entries):
        yy=98+i*48
        if i==1:d.rectangle((5,yy-6,324,yy+35),fill='#16293C',outline='#A0BDCD',width=2)
        # Chapter titles lose 0.35 brightness in the real non-hover draw path.
        hh,ss,vv=colorsys.rgb_to_hsv(*(c/255 for c in bytes.fromhex(P['state_idle'][1:])))
        dimmed=tuple(round(c*255) for c in colorsys.hsv_to_rgb(hh,ss,max(0,vv-0.35)))
        d.text((24 if i in [0,3,10] else 40,yy),label,font=font(19),fill=P['text'] if i in [0,3,10] else dimmed)
    # Frozen layout follows the welcome-screen reference. No quest file is rewritten.
    coords=[(600,222),(430,405),(600,405),(790,405),(790,588),(565,700),(677,700),(790,700),(902,700),(1015,700)]
    for a,b in [(0,2),(1,2),(2,3),(2,4),(4,5),(4,6),(4,7),(4,8),(4,9)]:
        d.line([coords[a],coords[b]],fill='#7094A8',width=4)
    bg=Image.open(ASSETS/'ftbquests/textures/shapes/circle/background.png').resize((68,68),Image.Resampling.NEAREST)
    ftb=jar_for('ftb-quests');outline=source_image(ftb,'ftbquests/textures/shapes/circle/outline.png').resize((68,68))
    for i,(x,y) in enumerate(coords):
        node=Image.new('RGBA',(68,68),P['void']);node.putalpha(bg.getchannel('A'));node.alpha_composite(bg)
        state=P['state_complete'] if i==0 else P['state_idle'];rim=Image.new('RGBA',(68,68),state);rim.putalpha(outline.getchannel('A'))
        node.alpha_composite(rim);canvas.alpha_composite(node,(x-34,y-34))
        if i==3:icon=source_image(ftb,'ftbquests/textures/item/book.png')
        elif i==4:icon=source_image(vanilla,'minecraft/textures/item/diamond.png')
        else:icon=Image.open(ASSETS/f'ftblibrary/textures/icons/{"accept" if i==0 else "accept_gray"}.png')
        canvas.alpha_composite(icon.resize((32,32),Image.Resampling.NEAREST),(x-16,y-16))
    d=ImageDraw.Draw(canvas)
    d.text((375,30),'欢迎',font=font(28),fill=P['text'])
    d.text((375,73),'静态主题预览 · 背景按 GUI 缩放 4 绘制，任务布局仅示意',font=font(16),fill=P['locked'])
    legend=[('state_complete','已完成'),('state_started','进行中'),('state_idle','未开始'),('locked','已锁定')]
    for i,(k,t) in enumerate(legend):
        x=390+i*230;d.rectangle((x,846,x+16,862),fill=P[k]);d.text((x+28,840),t,font=font(18),fill=P['text'])
    canvas.convert('RGB').save(HERE/'preview-quests.png')
    states=Image.new('RGBA',(960,330),P['void']);sd=ImageDraw.Draw(states)
    sd.text((25,18),'按钮与任务状态 / 静态素材预览',font=font(24),fill=P['text'])
    for i,(name,label) in enumerate([('button','普通'),('button_highlighted','悬停'),('button_disabled','禁用')]):
        sprite=Image.open(ASSETS/f'minecraft/textures/gui/sprites/widget/{name}.png')
        states.alpha_composite(sprite.resize((300,30),Image.Resampling.NEAREST),(20+i*310,78))
        sd.text((38+i*310,78),label,font=font(18),fill=P['text'])
    for i,(name,label) in enumerate([('button','任务按钮'),('hover','任务悬停'),('disabled','任务禁用')]):
        states.alpha_composite(nine(Image.open(ASSETS/f'rain/textures/gui/poc/{name}.png'),300,44),(20+i*310,142))
        sd.text((38+i*310,150),label,font=font(18),fill=P['text'])
    for i,(name,label) in enumerate(legend):
        x=30+i*230
        states.alpha_composite(bg,(x,223))
        rim=Image.new('RGBA',(68,68),P[name]);rim.putalpha(outline.getchannel('A'))
        states.alpha_composite(rim,(x,223));sd.text((x+78,246),label,font=font(17),fill=P['text'])
    states.convert('RGB').save(HERE/'preview-states.png')
    hud=Image.new('RGBA',(1440,560),P['void']);hd=ImageDraw.Draw(hud)
    hd.text((30,20),'底部快捷栏 · 实际 HUD 素材静态预览',font=font(28),fill=P['text'])
    hd.text((30,70),'原版 182 × 22；选中框 24 × 23；每格 20px，物品 16px。透明轮廓与原版一致。',font=font(19),fill=P['text'])
    for row,selected in enumerate([0,8]):
        x,y=240,155+row*150;scale=5
        hotbar=Image.open(ASSETS/'minecraft/textures/gui/sprites/hud/hotbar.png')
        hud.alpha_composite(hotbar.resize((182*scale,22*scale),Image.Resampling.NEAREST),(x,y))
        selection=Image.open(ASSETS/'minecraft/textures/gui/sprites/hud/hotbar_selection.png')
        hud.alpha_composite(selection.resize((24*scale,23*scale),Image.Resampling.NEAREST),(x-1*scale+selected*20*scale,y-1*scale))
        for col,item in enumerate(['diamond','iron_ingot','redstone']):
            icon=source_image(vanilla,f'minecraft/textures/item/{item}.png')
            hud.alpha_composite(icon.resize((16*scale,16*scale),Image.Resampling.NEAREST),(x+(3+20*col)*scale,y+3*scale))
        for side,xx in ([('left',x-29*scale)] if row==0 else [('right',x+182*scale)]):
            offhand=Image.open(ASSETS/f'minecraft/textures/gui/sprites/hud/hotbar_offhand_{side}.png')
            hud.alpha_composite(offhand.resize((29*scale,24*scale),Image.Resampling.NEAREST),(xx,y-1*scale))
            icon=source_image(vanilla,'minecraft/textures/item/ender_pearl.png')
            hud.alpha_composite(icon.resize((16*scale,16*scale),Image.Resampling.NEAREST),(xx+(3 if side=='left' else 10)*scale,y+3*scale))
    hd.text((30,492),'只展示素材与固定物品；实际副手、攻击进度、位置与缩放仍由 Minecraft 控制。',font=font(20),fill=P['text'])
    hud.convert('RGB').save(HERE/'preview-hotbar.png')
    creative=Image.new('RGBA',(1440,760),P['void']);cd=ImageDraw.Draw(creative)
    cd.text((30,20),'创造背包 · 实际资源静态预览',font=font(28),fill=P['text'])
    for i,name in enumerate(['tab_items','tab_item_search','tab_inventory']):
        x=30+i*470;y=175
        texture=Image.open(ASSETS/f'minecraft/textures/gui/container/creative_inventory/{name}.png').crop((0,0,195,136))
        scale=2;creative.alpha_composite(texture.resize((390,272),Image.Resampling.NEAREST),(x,y))
        for col in range(7):
            state='selected' if col==3 else 'unselected'
            for edge,yy in [('top',y-56),('bottom',y+272)]:
                sprite=Image.open(ASSETS/f'minecraft/textures/gui/sprites/container/creative_inventory/tab_{edge}_{state}_{col+1}.png')
                creative.alpha_composite(sprite.resize((52,64),Image.Resampling.NEAREST),(x+col*56,yy))
        if name!='tab_inventory':
            cd.text((x+16,y+9),'搜索物品' if 'search' in name else '无尽：重生',font=font(16),fill='#404040')
            for row in range(5):
                for col in range(9):
                    icon=source_image(vanilla,f'minecraft/textures/item/{["diamond","iron_ingot","redstone","gold_ingot","ender_pearl","nether_star"][(row+col)%6]}.png')
                    creative.alpha_composite(icon.resize((32,32),Image.Resampling.NEAREST),(x+18+col*36,y+36+row*36))
            scroller=Image.open(ASSETS/'minecraft/textures/gui/sprites/container/creative_inventory/scroller.png')
            creative.alpha_composite(scroller.resize((24,30),Image.Resampling.NEAREST),(x+350,y+36))
        cd.text((x,y+365),['物品页','搜索页','装备 / 背包页'][i],font=font(23),fill=P['text'])
    cd.text((30,640),'保留 195 × 136 面板、18px 槽位、原版标签拼接与搜索文本区域。',font=font(20),fill='#A0BDCD')
    creative.convert('RGB').save(HERE/'preview-creative.png')
    # A reusable static artifact allows side-by-side inspection in a browser.
    (HERE/'preview.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>创世之径 · UI 预览</title>
<style>body{margin:0;background:#09111c;color:#e0edf5;font:16px system-ui}main{max-width:1440px;margin:auto;padding:24px}h1{font-size:24px}p{color:#a0bdcd}img{width:100%;height:auto;display:block;border:1px solid #35536b;margin:20px 0}a{color:#58d9ea}</style>
<main><h1>创世之径 · 青蓝科技 UI</h1><p>这是使用实际资源绘制的静态示意，游戏字体、按钮、模组图标和动态进度仍由原模组绘制。</p>
<img src="preview-crafting.png" alt="合成界面素材预览"><img src="preview-creative.png" alt="创造背包素材预览"><img src="preview-hotbar.png" alt="快捷栏素材预览"><img src="preview-quests.png" alt="任务主题预览"><img src="preview-states.png" alt="组件状态素材预览"></main></html>''',encoding='utf-8')


def protect_snapshot():
    paths=[]
    for folder in ['config/ftbquests/quests','kubejs/server_scripts','kubejs/startup_scripts','kubejs/data','kubejs/client_scripts']:
        paths.extend(p for p in (ROOT/folder).rglob('*') if p.is_file())
    paths.extend(ROOT/p for p in ['options.txt','config/ftbquests-client.snbt','config/ftblibrary-client.snbt','config/fancymenu/customization/title_screen_layout.txt'])
    return {p.relative_to(ROOT).as_posix():digest(p) for p in paths if p.exists()}


def install():
    files=[p for p in ASSETS.rglob('*') if p.is_file()]
    old=(CACHE/'installation.json')
    previous_record=json.loads(old.read_text(encoding='utf-8')) if old.exists() else {}
    previous=previous_record.get('files',{})
    # Preflight all collisions before creating any live assets.
    for p in files:
        rel=p.relative_to(ASSETS).as_posix();dest=ROOT/'kubejs/assets'/rel
        if dest.exists() and digest(dest)!=digest(p) and digest(dest)!=previous.get(rel):
            raise RuntimeError(f'Existing asset needs explicit preservation: {rel}')
    switch=CACHE/'no-zip-switch';patch_record=json.loads((switch/'patch.json').read_text(encoding='utf-8'))
    source_mod=switch/OVERRIDE_NAME;dest_mod=ROOT/'mods'/OVERRIDE_NAME
    if not source_mod.exists() and dest_mod.exists():source_mod=dest_mod
    assert digest(source_mod)==patch_record['target_sha256'],'Prepared override mod hash differs'
    replace_override=dest_mod.exists() and digest(dest_mod)!=digest(source_mod)
    if replace_override and (previous_record.get('override_mod_path')!='mods/'+OVERRIDE_NAME or digest(dest_mod)!=previous_record.get('override_mod_sha256')):
        raise RuntimeError('Existing override mod differs from the owned installation: '+OVERRIDE_NAME)
    for jar in (ROOT/'mods').glob('*.jar'):
        if jar.name==OVERRIDE_NAME:continue
        with ZipFile(jar) as z:
            if 'org/hp/kubejs_lang_override/KubejsLangOverride.class' in z.namelist():
                raise RuntimeError('Another Assets Override JAR is already installed: '+jar.name)
    source_pack=HERE/PACK_NAME;dest_pack=ROOT/'resourcepacks'/PACK_NAME
    previous_pack=previous_record.get('pack_sha256')
    if dest_pack.exists() and digest(dest_pack) not in [digest(source_pack),previous_pack]:
        raise RuntimeError('Existing resource pack needs preservation: '+PACK_NAME)
    options=ROOT/'options.txt';raw=options.read_bytes()
    match=re.search(rb'^resourcePacks:([^\r\n]*)',raw,re.M)
    if not match:raise RuntimeError('resourcePacks option is missing; refusing to rewrite options')
    pack_list=json.loads(match[1]);enabled=[x for x in pack_list if x!=PACK_ID]
    changed=raw[:match.start(1)]+json.dumps(enabled,separators=(',',':'),ensure_ascii=False).encode('utf-8')+raw[match.end(1):]
    backup=switch/'backup';backup.mkdir(parents=True,exist_ok=True)
    if replace_override:
        repair_backup=switch/'crash-fix-backup';repair_backup.mkdir(parents=True,exist_ok=True)
        old_sha=digest(dest_mod)
        saved_mod=repair_backup/(old_sha+'.jar')
        if saved_mod.exists():assert digest(saved_mod)==old_sha,'Previous override backup differs'
        else:shutil.copyfile(dest_mod,saved_mod)
        saved_record=repair_backup/('installation-'+old_sha+'.json')
        if not saved_record.exists():shutil.copyfile(old,saved_record)
    (switch/'options-before-install.txt').write_bytes(raw)
    if not (backup/'options.txt').exists():(backup/'options.txt').write_bytes(raw)
    if old.exists() and not (backup/'installation.json').exists():shutil.copyfile(old,backup/'installation.json')
    before=protect_snapshot()
    (switch/'protected-before.json').write_text(json.dumps(before,indent=2),encoding='utf-8')
    existing_mods={p.name:[p.stat().st_size,p.stat().st_mtime_ns] for p in (ROOT/'mods').glob('*.jar') if p.name!=OVERRIDE_NAME}
    kubejs=ROOT/'mods/kubejs-neoforge-2101.7.2-build.377.jar';kubejs_hash=digest(kubejs)
    record={}
    for p in files:
        rel=p.relative_to(ASSETS);dest=ROOT/'kubejs/assets'/rel
        if dest.exists() and digest(dest)!=digest(p):
            prior=backup/'kubejs/assets'/rel;prior.parent.mkdir(parents=True,exist_ok=True)
            if not prior.exists():shutil.copyfile(dest,prior)
        dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists() or digest(dest)!=digest(p):shutil.copyfile(p,dest)
        record[rel.as_posix()]=digest(dest)
    if not dest_mod.exists() or replace_override:shutil.copyfile(source_mod,dest_mod)
    # Retire only the UI ZIP whose hash is owned by the previous installation.
    retired=backup/PACK_NAME
    for path in (dest_pack,retired):
        assert path.resolve().is_relative_to(ROOT.resolve())
    if dest_pack.exists():
        if retired.exists():
            assert digest(retired)==digest(dest_pack),'Backup ZIP differs; preserve both before continuing'
            dest_pack.unlink()
        else:shutil.move(str(dest_pack),str(retired))
    # Only the resource pack selection changes; every other options byte stays intact.
    if options.read_bytes()!=raw:raise RuntimeError('Options changed during installation; preserve the current file and rerun')
    if changed!=raw:options.write_bytes(changed)
    after=protect_snapshot()
    assert {k:v for k,v in before.items() if k!='options.txt'}=={k:v for k,v in after.items() if k!='options.txt'},'Protected task/recipe/config files changed'
    assert digest(kubejs)==kubejs_hash,'KubeJS core JAR changed'
    assert all((ROOT/'mods'/n).exists() and [(ROOT/'mods'/n).stat().st_size,(ROOT/'mods'/n).stat().st_mtime_ns]==v for n,v in existing_mods.items()),'Existing mod files changed'
    (CACHE/'installation.json').write_text(json.dumps({'files':record,'protected_files':len(before)-1,'protected_unchanged':True,
        'mode':'kubejs-assets-override','override_mod_path':'mods/'+OVERRIDE_NAME,'override_mod_sha256':digest(dest_mod),
        'override_mod_source':patch_record['source_url'],'original_mod_sha256':patch_record['source_sha256'],
        'compatibility_patch':{'old_pack_id':patch_record['old_pack_id'],'new_pack_id':patch_record['new_pack_id'],
            'patch_version':patch_record['patch_version'],'caller_list_unchanged':patch_record['caller_list_unchanged'],
            'change':patch_record['change']},
        'kubejs_core_unchanged':True,'existing_mods_unchanged':len(existing_mods),'standalone_ui_zip_retired':True,
        'retired_pack_path':retired.relative_to(ROOT).as_posix(),'pack_sha256':digest(retired),
        'resource_packs_before':pack_list,'resource_packs_after':enabled,
        'options_before_path':(switch/'options-before-install.txt').relative_to(ROOT).as_posix(),
        'options_before_sha256':hashlib.sha256(raw).hexdigest(),'options_after_sha256':digest(options),'other_options_unchanged':True},indent=2),encoding='utf-8')
    print(f'Installed {len(record)} KubeJS files and the override mod; retired the standalone UI ZIP; {len(before)-1} protected files and {len(existing_mods)} existing mods unchanged.')


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--install',action='store_true');args=parser.parse_args()
    CACHE.mkdir(parents=True,exist_ok=True)
    if args.install:install();return
    before=protect_snapshot();(CACHE/'protected-before.json').write_text(json.dumps(before,indent=2),encoding='utf-8')
    build_tables();build_vanilla();build_creative();build_jei();build_tweak_buttons();build_widgets();build_hotbar();build_quests();previews()
    (HERE/'tokens.json').write_text(json.dumps({'palette':P,'pixel_border':1,'slot':18,'item':16,'font':'Minecraft default'},indent=2),encoding='utf-8')
    (HERE/'manifest.json').write_text(json.dumps(MANIFEST,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    with ZipFile(HERE/PACK_NAME,'w',ZIP_DEFLATED) as z:
        z.writestr('pack.mcmeta',json.dumps({'pack':{'pack_format':34,'description':'Path of Creation | Cyan Circuit UI'}}))
        for p in ASSETS.rglob('*'):
            if p.is_file():z.write(p,'assets/'+p.relative_to(ASSETS).as_posix())
    assert before==protect_snapshot()
    print(f'Staged {len(MANIFEST)} PNG assets, theme, colors, metadata and static previews. No live files changed.')


if __name__=='__main__':main()
