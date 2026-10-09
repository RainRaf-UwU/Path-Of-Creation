"""Create an original, short electronic button click using only synthesized audio.

Usage: python design/button-sounds-2026-10-08/build_click.py --ffmpeg PATH
Writes candidates in this script's assets/ directory; does not install them.
"""
from pathlib import Path
import argparse
import array
import hashlib
import json
import math
import random
import subprocess
import sys
import wave


def build(ffmpeg: Path) -> dict:
    out = Path(__file__).resolve().parent
    assets = out / 'assets/minecraft'
    target = assets / 'sounds/ui/poc_button_click.ogg'
    target.parent.mkdir(parents=True, exist_ok=True)
    rate, duration = 44100, 0.100
    rng = random.Random(20261008)
    samples = []
    previous_noise = 0.0
    for i in range(round(rate * duration)):
        t = i / rate
        # A small mechanical body and a falling digital tone, with a damped snap.
        noise = rng.uniform(-1, 1)
        snap = (noise - previous_noise) * 0.11 * math.exp(-t / 0.0032)
        previous_noise = noise
        body = 0.58 * math.sin(2 * math.pi * (460 * t - 850 * t * t)) * math.exp(-t / 0.009)
        tone = 0.32 * math.sin(2 * math.pi * (1580 * t - 1900 * t * t)) * math.exp(-t / 0.018)
        overtone = 0.07 * math.sin(2 * math.pi * 2420 * t) * math.exp(-t / 0.008)
        attack = min(1.0, t / 0.0009)
        fade = min(1.0, max(0.0, (duration - t) / 0.016))
        samples.append((body + tone + overtone + snap) * attack * fade)
    gain = (10 ** (-3 / 20)) / max(abs(s) for s in samples)
    pcm = array.array('h', (round(s * gain * 32767) for s in samples))
    if sys.byteorder != 'little':
        pcm.byteswap()
    wav_path = out / 'button_click_preview.wav'
    with wave.open(str(wav_path), 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm.tobytes())
    subprocess.run([str(ffmpeg), '-hide_banner', '-loglevel', 'error', '-y',
                    '-i', str(wav_path), '-c:a', 'libvorbis', '-q:a', '5',
                    '-map_metadata', '-1', '-metadata', 'title=Path of Creation - Button Click',
                    '-metadata', 'comment=Original procedural synthesis; seed 20261008',
                    str(target)], check=True)
    config = {'ui.button.click': {'replace': True, 'sounds': [
        {'name': 'minecraft:ui/poc_button_click', 'stream': False, 'preload': True}
    ]}}
    (assets / 'sounds.json').write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
    return {'duration_seconds': duration, 'sample_rate': rate, 'channels': 1,
            'ogg_size': target.stat().st_size,
            'ogg_sha256': hashlib.sha256(target.read_bytes()).hexdigest()}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg', required=True, type=Path)
    args = parser.parse_args()
    print(json.dumps(build(args.ffmpeg), indent=2))
