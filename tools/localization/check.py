"""Validate the pack's two locales and player-specific server text selection."""
from pathlib import Path
import json
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
QUOTED = re.compile(r'"(?:\\.|[^"\\])*"')
HAN = re.compile(r'[\u3400-\u9fff]')


def quest_lang(path):
    text = path.read_text(encoding='utf-8-sig')
    fields = list(re.finditer(r'(?m)^\t([^\s:]+):[ \t]*', text))
    result = {}
    for i, field in enumerate(fields):
        end = fields[i + 1].start() if i + 1 < len(fields) else text.rfind('}')
        raw = text[field.end():end].strip()
        if raw.startswith('['):
            assert not QUOTED.sub('', raw).strip('[] \r\n\t,'), (path, field.group(1))
            value = [json.loads(token.group()) for token in QUOTED.finditer(raw)]
        else:
            value = json.loads(raw)
        assert field.group(1) not in result, (path, field.group(1))
        result[field.group(1)] = value
    return result


def main():
    quests = ROOT / 'config/ftbquests/quests/lang'
    zh = quest_lang(quests / 'zh_cn.snbt')
    en = quest_lang(quests / 'en_us.snbt')
    assert zh.keys() == en.keys(), 'Quest locale keys differ'
    assert all(isinstance(en[k], type(v)) for k, v in zh.items()), 'Quest value types differ'
    assert not HAN.search(json.dumps(en, ensure_ascii=False)), 'Chinese text remains in English quests'
    for key, value in zh.items():
        if isinstance(value, list):
            # Quest image directives refer to game resources, not prose.
            images = [v for v in value if v.startswith('{image:')]
            assert all(v in en[key] for v in images), (key, 'missing image')
    for namespace, folder in [
        ('rain', ROOT / 'kubejs/assets/rain/lang'),
        ('poc_updater', ROOT / 'tools/poc-updater/src/main/resources/assets/poc_updater/lang'),
    ]:
        a = json.loads((folder / 'zh_cn.json').read_text(encoding='utf-8-sig'))
        b = json.loads((folder / 'en_us.json').read_text(encoding='utf-8-sig'))
        assert a.keys() == b.keys(), namespace + ': locale keys differ'
        assert not HAN.search(json.dumps(b, ensure_ascii=False)), namespace + ': untranslated text'
        for key in a:
            assert re.findall(r'%(?:\d+\$)?s', a[key]) == re.findall(r'%(?:\d+\$)?s', b[key]), key
        print(namespace + ':', len(a), 'matching bilingual keys')
    node = shutil.which('node')
    assert node, 'Node.js is required for script syntax and language-selection checks'
    scripts = sorted(ROOT.glob('kubejs/*_scripts/**/*.js'))
    for path in scripts:
        subprocess.run([node, '--check', str(path)], check=True, capture_output=True)
    harness = r'''
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const root = process.argv[1];
const context = vm.createContext({global: {}, JsonIO: {
  readString: path => fs.readFileSync(root + '/' + path, 'utf8')
}});
vm.runInContext(fs.readFileSync(root + '/kubejs/startup_scripts/localization.js', 'utf8'), context);
const player = locale => ({clientInformation: () => ({language: () => locale})});
const zh = player('zh_cn'), en = player('en_us');
const text = context.global.pocText;
assert.equal(text(zh, 'rain.story.warning'), '警告！请立刻退出仪式！！！');
assert.equal(text(en, 'rain.story.warning'), 'Warning! Stop the ritual immediately!!!');
assert.equal(text(player('de_de'), 'rain.story.warning'), text(en, 'rain.story.warning'));
assert.equal(text(player('zh_tw'), 'rain.story.warning'), text(zh, 'rain.story.warning'));
assert.equal(text(en, 'missing.key'), 'missing.key');
const switched = player('zh_cn');
assert.equal(text(switched, 'rain.story.warning'), text(zh, 'rain.story.warning'));
switched.clientInformation = () => ({language: () => 'en_us'});
assert.equal(text(switched, 'rain.story.warning'), text(en, 'rain.story.warning'));
for (const locale of [zh, en]) {
  for (const [line, fragment] of [['death','death'],['energy','energy'],['strength','entity'],
      ['strength','exclamation'],['identity','know'],['damaged_log','creatures'],['damaged_log','intruders']]) {
    assert(text(locale, 'rain.story.' + line).includes(text(locale, 'rain.story.glitch.' + fragment)));
  }
}
console.log('PASS: two simultaneous player locales, fallback, language changes and story glitch fragments');
'''
    subprocess.run([node, '-e', harness, str(ROOT)], check=True)
    print('PASS:', len(zh), 'quest entries;', len(scripts), 'JavaScript files parse')


if __name__ == '__main__':
    main()
