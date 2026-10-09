"""Rebuild the original RGBA cursor and static handoff preview using only stdlib."""
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
    # Layered armour rather than a flat triangle; each accent remains at least one pixel wide.
    shape([(2,2),(2,38),(12,30),(19,46),(28,42),(21,28),(39,27)],'#09111C')
    shape([(3,4),(3,35),(12,27),(20,44),(26,41),(18,26),(36,26)],'#35536B')
    shape([(4,6),(4,32),(12,24),(21,41),(24,40),(17,25),(32,25)],'#A8C8D1')
    shape([(5,8),(5,29),(12,22),(20,38),(22,37),(15,23),(29,24)],'#142336')
    shape([(6,10),(6,26),(13,20),(26,22)],'#1E344B')
    shape([(7,12),(7,24),(13,19),(23,21)],'#286879')
    # Bright front bevel, split armour plates and metallic shaft.
    shape([(3,4),(4,6),(4,31),(3,34)],'#58D9EA')
    shape([(5,7),(32,25),(28,24),(6,10)],'#E0EDF5')
    shape([(13,24),(14,23),(23,40),(21,41)],'#58D9EA')
    shape([(17,27),(18,27),(25,41),(24,41)],'#667586')
    shape([(6,28),(12,23),(13,24),(6,30)],'#E0EDF5')
    # Internal circuit with two junctions, status light, engraved vents and edge markers.
    shape([(8,17),(9,17),(9,21),(14,21),(14,22),(8,22)],'#58D9EA')
    shape([(13,17),(15,17),(15,19),(13,19)],'#7AD9B0')
    shape([(18,21),(20,21),(20,23),(18,23)],'#E0EDF5')
    shape([(10,14),(11,15),(10,16),(9,15)],'#E0EDF5')
    for k in range(3):
        x=16+k*3
        shape([(x,23),(x+2,23),(x+3,24),(x+1,24)],'#58D9EA')
    shape([(4,14),(5,14),(5,17),(4,17)],'#7AD9B0')
    shape([(4,21),(5,21),(5,24),(4,24)],'#58D9EA')
    shape([(27,27),(34,27),(34,28),(27,28)],'#58D9EA')
    shape([(20,43),(24,41),(25,42),(21,44)],'#7AD9B0')
    # The arrow tip is the native click hotspot, including its visible outline.
    pixels[(2*size+2)*4:(2*size+2)*4+4] = color(TOKENS['palette']['left'])
    for path in [HERE/'assets/cursor.png', HERE/'src/main/resources/assets/poc_cursor/textures/cursor.png']:
        png(path,size,size,pixels)
    width,height=640,192
    preview=bytearray(color(TOKENS['palette']['panel'])*(width*height))
    for y in range(size):
        for x in range(size):
            rgba=pixels[(y*size+x)*4:(y*size+x)*4+4]
            if rgba[3]:
                for yy in range(3):
                    for xx in range(3):
                        at=((24+y*3+yy)*width+24+x*3+xx)*4
                        preview[at:at+4]=rgba
    for i,t in enumerate([.0,.25,.6,.9]):
        cx,cy=228+i*112,94
        radius=(3+10*(1-(1-t)**3))*3
        rgb=color(TOKENS['palette']['left'])
        alpha=.68*(1-t)**2
        for y in range(height):
            for x in range(max(0,cx-50),min(width,cx+51)):
                if abs(math.hypot(x-cx,y-cy)-radius)<1.2:
                    at=(y*width+x)*4
                    preview[at:at+3]=bytes(round(rgb[k]*alpha+preview[at+k]*(1-alpha)) for k in range(3))
    png(HERE/'preview.png',width,height,preview)
    (HERE/'preview.html').write_text('<!doctype html><meta charset="utf-8"><title>创世之径光标静态预览</title><style>body{background:#09111c;color:#e0edf5;font:16px sans-serif;padding:32px}img{image-rendering:pixelated;max-width:100%}</style><h1>青蓝装甲光标与点击扩散</h1><img src="preview.png"><p>箭头放大 3 倍；光环依次显示 0%、25%、60%、90% 时间状态。静态设计预览，不是游戏截图。</p><p>原尺寸：<img src="assets/cursor.png" width="48" height="48"></p>',encoding='utf-8')
    print('Built detailed RGBA cursor (48x48, hotspot 2,2) and static preview')

if __name__ == '__main__':
    main()
