"""Build the code-authored Star Core cursor; Pillow is used only for the static preview."""
import json
import math
import struct
from pathlib import Path
import zlib

HERE = Path(__file__).resolve().parent
TOKENS = json.loads((HERE / 'tokens.json').read_text(encoding='utf-8'))

def color(hex_value, alpha=255):
    return (*bytes.fromhex(hex_value.lstrip('#')), alpha)

def png(path, width, height, pixels):
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
    rows = b''.join(b'\0' + bytes(pixels[y * width * 4:(y + 1) * width * 4]) for y in range(height))
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    data += chunk(b'IDAT', zlib.compress(rows, 9)) + chunk(b'IEND', b'')
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)

def polygon(pixels, width, height, points, rgba):
    for y in range(height):
        for x in range(width):
            inside = False
            px, py = x + .5, y + .5
            for (x1,y1),(x2,y2) in zip(points, points[1:] + points[:1]):
                if (y1 > py) != (y2 > py) and px < (x2-x1)*(py-y1)/(y2-y1)+x1:
                    inside = not inside
            if inside:
                pixels[(y*width+x)*4:(y*width+x)*4+4] = rgba

def main():
    size = 48
    pixels = bytearray(size*size*4)
    def shape(points, value):
        polygon(pixels,size,size,points,color(value))
    palette=TOKENS['palette']
    def pixel(x,y,value):
        pixels[(y*size+x)*4:(y*size+x)*4+4]=color(value)
    def stroke(points,width,value):
        for y in range(size):
            for x in range(size):
                px,py=x+.5,y+.5
                for (x1,y1),(x2,y2) in zip(points,points[1:]):
                    dx,dy=x2-x1,y2-y1
                    t=max(0,min(1,((px-x1)*dx+(py-y1)*dy)/(dx*dx+dy*dy)))
                    if math.hypot(px-x1-t*dx,py-y1-t*dy)<=width/2:
                        pixel(x,y,value);break
    def radial(angle,start,end,width,value):
        theta=math.radians(angle)
        stroke([(24.5+math.cos(theta)*r,24.5+math.sin(theta)*r) for r in (start,end)],width,value)
    # Small telemetry dashes sit inside the orbit, leaving the center clear.
    for angle in (38,145,216,326): radial(angle,8.0,8.6,1,palette['silver'])
    # Short axes lead the eye to the exact center without covering the target.
    for a,b in [((24.5,16.5),(24.5,19.5)),((29.5,24.5),(32.5,24.5)),
                ((24.5,29.5),(24.5,32.5)),((16.5,24.5),(19.5,24.5))]:
        stroke([a,b],3,palette['void']);stroke([a,b],1,palette['silver'])
    shape([(24.5,21),(28,24.5),(24.5,28),(21,24.5)],palette['void'])
    for x,y in [(22,22),(26,22),(22,26),(26,26)]: pixel(x,y,palette['steel'])
    for x,y in [(24,23),(23,24),(25,24),(24,25)]: pixel(x,y,palette['left'])
    # The brightest pixel is also the GLFW hotspot.
    pixel(TOKENS['cursor']['hotspot_x'],TOKENS['cursor']['hotspot_y'],palette['text'])
    # Straight-alpha RGBA: two cyan rings and a faint membrane between them.
    ring=TOKENS['outer_ring']
    inner_ring=TOKENS['inner_ring']
    inner_start=inner_ring['radius']-inner_ring['width']/2
    inner_end=inner_ring['radius']+inner_ring['width']/2
    outer_start=ring['radius']-ring['width']/2
    outer_end=ring['radius']+ring['width']/2
    samples=ring['samples_per_axis']
    def layer_alpha(distance):
        if inner_start<=distance<=inner_end: return inner_ring['alpha']
        if inner_end<distance<outer_start: return TOKENS['membrane']['alpha']
        if outer_start<=distance<=outer_end: return ring['alpha']
        return 0
    for y in range(size):
        for x in range(size):
            # The original core and axis pixels take precedence over the rings.
            if pixels[(y*size+x)*4+3]: continue
            alpha=round(sum(
                layer_alpha(math.hypot(x+(sx+.5)/samples-24.5,y+(sy+.5)/samples-24.5))
                for sy in range(samples) for sx in range(samples)
            )/(samples*samples))
            if alpha:
                pixels[(y*size+x)*4:(y*size+x)*4+4]=color(ring['color'],alpha)

    for path in [HERE/'assets/cursor.png', HERE/'src/main/resources/assets/poc_cursor/textures/cursor.png']:
        png(path,size,size,pixels)
    preview()
    (HERE/'preview.html').write_text('''<!doctype html><meta charset="utf-8"><title>创世之径 · 虚空星核光标</title>
<style>body{background:#09111c;color:#e0edf5;font:16px system-ui,sans-serif;padding:32px}img{max-width:100%;image-rendering:pixelated}.demo{display:inline-grid;place-items:center;width:240px;height:120px;margin:12px;border:1px solid #35536b;cursor:url("assets/cursor.png") 24 24, crosshair}.light{background:#e0edf5;color:#142336}</style>
<h1>星核 · 青蓝双环与透明薄膜</h1><img src="preview.png"><p>中间星核保持原样，内外环均为完整半透明青蓝圆环，环间铺淡青蓝透明薄膜。内环约43%、外环约55%、膜约8%不透明度。中心白点是实际点击位置，原尺寸48×48，热点(24,24)。下方区域可以体验新指针形状。</p>
<div class="demo">深色区域</div><div class="demo light">浅色区域</div><p>这是静态预览，不是Minecraft实机截图。原有点击扩散效果保留。</p>''',encoding='utf-8')
    print('Built Star Core with translucent cyan rings and membrane (48x48, hotspot 24,24) and static preview')

def preview():
    from PIL import Image, ImageDraw, ImageFont
    panel=Image.new('RGB',(960,420),TOKENS['palette']['void'])
    draw=ImageDraw.Draw(panel)
    font_path=Path('C:/Windows/Fonts/msyh.ttc')
    font=lambda size: ImageFont.truetype(str(font_path),size) if font_path.is_file() else ImageFont.load_default()
    draw.text((32,21),'星核 · 青蓝双环  /  CYAN RINGS',fill=TOKENS['palette']['text'],font=font(25))
    draw.text((32,61),'中心星核保留 · 半透明同心圆环 · 环间透明薄膜 / 约8%不透明度',fill='#A8C8D1',font=font(15))
    sprite=Image.open(HERE/'assets/cursor.png')
    draw.rounded_rectangle((32,104,280,344),radius=12,fill='#142336',outline='#35536B')
    panel.paste(sprite.resize((144,144),Image.Resampling.NEAREST),(84,139),sprite.resize((144,144),Image.Resampling.NEAREST))
    draw.text((88,308),'结构放大 3×',fill='#A8C8D1',font=font(15))
    for x,label,bg,fg in [(308,'深色面板','#142336','#E0EDF5'),(524,'浅色面板','#E0EDF5','#142336'),(740,'纹理背景',None,'#E0EDF5')]:
        draw.rounded_rectangle((x,104,x+188,344),radius=12,fill=bg or '#26364A',outline='#35536B')
        if bg is None:
            for yy in range(144,285,12):
                for xx in range(x+12,x+177,12):
                    draw.rectangle((xx,yy,xx+11,yy+11),fill='#34495E' if ((xx-x)//12+yy//12)%2 else '#26364A')
        draw.text((x+22,118),label,fill=fg,font=font(15))
        draw.rounded_rectangle((x+22,174,x+166,267),radius=6,outline='#667586',width=1)
        cx,cy=x+94,221
        panel.paste(sprite,(cx-24,cy-24),sprite)
        draw.text((x+27,296),'原尺寸 48×48',fill=fg,font=font(15))
    draw.text((32,369),'热点 (24,24)  ·  透明 RGBA  ·  静态素材预览，游戏内测试由作者完成',fill='#A8C8D1',font=font(15))
    panel.save(HERE/'preview.png')

if __name__ == '__main__':
    main()
