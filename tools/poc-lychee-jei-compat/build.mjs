import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const args = process.argv.slice(2);
const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const jdk = option('--jdk');
if (!jdk) throw Error('Pass --jdk <Java 21 directory>');
const lines = fs.readFileSync(option('--classpath-file', path.join(root, 'tools/poc-cursor/build/javac.args')), 'utf8')
  .split(/\r?\n/).map(s => s.trim().replace(/^"|"$/g, ''));
const cpIndex = lines.indexOf('-classpath');
if (cpIndex < 0) throw Error('Expected a safe javac argument file with -classpath');
const libraries = lines[cpIndex + 1].split(path.delimiter);
for (const prefix of ['Lychee-', '[JEI', 'Kiwi-']) {
  const name = fs.readdirSync(path.join(root, 'mods')).find(n => n.startsWith(prefix) && n.endsWith('.jar'));
  if (!name) throw Error('Missing installed mod: ' + prefix);
  libraries.push(path.join(root, 'mods', name));
}
const classpath = [...new Set(libraries)].join(path.delimiter);
if (libraries.some(p => !fs.existsSync(p))) throw Error('Missing compile library');
const work = path.resolve(option('--work', path.join(os.tmpdir(), 'poc-lychee-jei-build')));
fs.mkdirSync(work, {recursive: true});
const build = fs.mkdtempSync(path.join(work, 'compile-'));
const classes = path.join(build, 'classes');
fs.mkdirSync(classes);
const walk = p => fs.readdirSync(p, {withFileTypes: true})
  .flatMap(e => e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)]);
const quote = s => '"' + String(s).replaceAll('\\', '/').replaceAll('"', '\\"') + '"';
let step = 0;
const run = (tool, values) => {
  const argfile = path.join(build, `${step++}-${tool}.args`);
  fs.writeFileSync(argfile, values.map(quote).join('\n'));
  // javac reads UTF-8 source/argument files; pass runtime paths as native Unicode
  // arguments so a Windows locale cannot corrupt the Chinese instance path.
  const result = spawnSync(path.join(jdk, 'bin', tool + (process.platform === 'win32' ? '.exe' : '')),
    tool === 'javac' ? ['@' + argfile] : values,
    {cwd: work, windowsHide: true});
  fs.writeFileSync(path.join(build, `${step - 1}-${tool}.log`), Buffer.concat([result.stdout ?? Buffer.alloc(0), result.stderr ?? Buffer.alloc(0)]));
  if (result.stdout?.length) process.stdout.write(result.stdout);
  if (result.stderr?.length) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error(tool + ' exited with ' + result.status);
};
run('javac', ['--release', '21', '-encoding', 'UTF-8', '-proc:none', '-classpath', classpath, '-d', classes,
  ...walk(path.join(here, 'src/main/java')).filter(p => p.endsWith('.java'))]);
fs.cpSync(path.join(here, 'src/main/resources'), classes, {recursive: true});
if (args.includes('--test')) {
  const tests = path.join(build, 'tests');
  fs.mkdirSync(tests);
  const launchwrapper = option('--launchwrapper', path.resolve(root, '../../libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar'));
  if (!fs.existsSync(launchwrapper)) throw Error('Offline Mixin verification requires --launchwrapper <local jar>');
  run('javac', ['--release', '21', '-encoding', 'UTF-8', '-proc:none', '-classpath', [classes, launchwrapper, classpath].join(path.delimiter),
    '-d', tests, ...walk(path.join(here, 'src/test/java')).filter(p => p.endsWith('.java'))]);
  run('java', ['-ea', '-Djava.awt.headless=true', '-classpath', [tests, classes, classpath].join(path.delimiter),
    'creation.compat.lychee.FluidQueryTest']);
  // Real Minecraft classes, not the test fluid fixtures, are used to weave Lychee.
  run('java', ['-ea', '-Djava.awt.headless=true', '-classpath', [classes, classpath, launchwrapper, tests].join(path.delimiter),
    'creation.compat.lychee.MixinTransformCheck', path.join(build, 'transformed')]);
}
fs.mkdirSync(path.join(classes, 'META-INF/licenses'), {recursive: true});
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(classes, 'META-INF/licenses/POC-LICENSE'));
const output = path.resolve(option('--output', path.join(work, 'poc-lychee-jei-compat-1.0.0.jar')));
fs.mkdirSync(path.dirname(output), {recursive: true});
run('jar', ['--create', '--file', output, '--date=2026-10-21T00:00:00Z', '-C', classes, '.']);
const report = {jar: output, size: fs.statSync(output).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex'), build, tests: args.includes('--test')};
fs.writeFileSync(path.join(work, 'build-result.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
