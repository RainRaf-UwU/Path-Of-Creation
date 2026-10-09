// Full and incremental update packages compatible with the installed updater.
// Requires Node.js and the JDK jar command; no downloaded build dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PACK = 'config/poc-updater/pack.json';
const BASELINE = 'config/poc-updater/baseline.json';
const ASSET = 'path-of-creation-update.zip';
const MANIFEST = 'poc-update.json';
const DELTA = 'poc-delta.json';
const MAX_BYTES = 8 * 1024 ** 3;
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const info = data => ({ sha256: createHash('sha256').update(data).digest('hex'), size: data.length });
const sameFile = (a, b) => a?.sha256 === b?.sha256 && a?.size === b?.size;

export function allowed(name) {
  // Keep this policy in sync with UpdateCore.allowed.
  if (!name || /[\\:]/.test(name)) return false;
  for (const part of name.split('/')) {
    if (['', '.', '..'].includes(part) || /[. ]$|[\x00-\x1f]/.test(part)
        || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i.test(part)) return false;
  }
  const p = name.toLowerCase();
  if (/credential|password|secret|token|account|session|auth/.test(p)) return false;
  if (/\.(bak|log|tmp|key|pem|p12|pfx|keystore|py)$/.test(p) || p.includes('/.')) return false;
  if (name === PACK || name === BASELINE) return true;
  if (p.startsWith('mods/')) return name.split('/').length === 2 && p.endsWith('.jar');
  if (p.startsWith('kubejs/')) return /^kubejs\/(assets|data|client_scripts|server_scripts|startup_scripts|event_groups)\/.+/.test(p) && !p.endsWith('jsconfig.json');
  if (p.startsWith('config/')) {
    if (/^config\/(poc-updater|modpack-update-checker)\//.test(p)) return false;
    if (/([-\/]client\.(toml|json|snbt)|[-\/]client-[0-9]+\.toml)$/.test(p)) return false;
    if (/^config\/(sodium.*|iris.*|replaymod.*|jei\/.*|inventoryprofilesnext\/.*|mcef\/.*|.*fingerprint.*)$/.test(p)) return false;
    if (/^config\/(ars_nouveau\/search_index|skyblockbuilder\/data)\//.test(p) || p === 'config/brandon3055/contributors.json') return false;
    return true;
  }
  return /^(defaultconfigs|resourcepacks|shaderpacks|patchouli_books)\/.+/.test(p) || p.startsWith('skyblockbuilder/exports/');
}

async function fileInfo(file) {
  const hash = createHash('sha256');
  let size = 0;
  for await (const chunk of fs.createReadStream(file)) { hash.update(chunk); size += chunk.length; }
  return { sha256: hash.digest('hex'), size };
}

function candidates(root) {
  const output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, maxBuffer: 16 * 1024 ** 2 });
  const names = new Set(output.toString('utf8').split('\0'));
  names.add(PACK);
  const result = [];
  for (const name of [...names].sort()) {
    if (name === BASELINE || !allowed(name)) continue;
    const file = path.resolve(root, name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    const canonical = fs.realpathSync(file);
    if (fs.lstatSync(file).isSymbolicLink() || canonical !== file || path.relative(root, canonical).startsWith('..')) {
      throw new Error('Linked files cannot be published: ' + name);
    }
    result.push(name);
  }
  if (new Set(result.map(p => p.toLowerCase())).size !== result.length) throw new Error('Case-insensitive duplicate file names');
  if (!result.includes('mods/poc-updater-1.0.0.jar')) throw new Error('Build the updater mod first');
  return result;
}

function manifest(pack, files) {
  if (Object.values(files).reduce((sum, f) => sum + f.size, 0) > MAX_BYTES || Object.keys(files).length > 50000) throw new Error('Update exceeds installer limits');
  return { schema: 1, version: pack.version, minecraft: pack.minecraft, neoforge: pack.neoforge, files };
}

function versionParts(value) {
  if (typeof value !== 'string' || !/^[vV]?\d+(?:\.\d+){1,3}$/.test(value)) throw new Error('Invalid numeric version');
  const parts = value.replace(/^[vV]/, '').split('.').map(BigInt);
  while (parts.length < 4) parts.push(0n);
  return parts;
}

function compareVersions(a, b) {
  const x = versionParts(a), y = versionParts(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  return 0;
}

function validateBase(base, target) {
  if (!base || base.schema !== 1 || !base.files || typeof base.files !== 'object' || Array.isArray(base.files)
      || !Object.keys(base.files).length || Object.keys(base.files).length > 50000 || !Object.hasOwn(base.files, PACK)) throw new Error('Invalid delta base manifest');
  if (compareVersions(base.version, target.version) >= 0) throw new Error('Delta base must be older than target');
  if (base.minecraft !== target.minecraft || base.neoforge !== target.neoforge) throw new Error('Delta base requires different Minecraft/NeoForge');
  const priorPaths = new Map();
  let total = 0;
  for (const [name, value] of Object.entries(base.files)) {
    if (!allowed(name) || priorPaths.has(name.toLowerCase()) || !value || !/^[a-fA-F0-9]{64}$/.test(value.sha256 || '')
        || !Number.isSafeInteger(value.size) || value.size < 0 || value.size > MAX_BYTES) throw new Error('Invalid delta base file: ' + name);
    priorPaths.set(name.toLowerCase(), name);
    total += value.size;
  }
  if (total > MAX_BYTES) throw new Error('Delta base exceeds installer limits');
  for (const name of Object.keys(target.files)) {
    if (priorPaths.has(name.toLowerCase()) && priorPaths.get(name.toLowerCase()) !== name) throw new Error('Delta cannot rename paths by case only: ' + name);
  }
}

async function writeArchive(root, archive, final, names, generated, jar, delta) {
  const parent = path.dirname(archive);
  const stage = fs.mkdtempSync(path.join(parent, '.poc-stage-'));
  try {
    const paths = [...names].sort();
    for (const name of paths) {
      const destination = path.join(stage, name);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      if (generated.has(name)) fs.writeFileSync(destination, generated.get(name));
      else fs.copyFileSync(path.join(root, name), destination);
      if (!sameFile(await fileInfo(destination), final.files[name])) throw new Error('File changed while packaging: ' + name);
    }
    fs.writeFileSync(path.join(stage, MANIFEST), jsonBytes(final));
    paths.push(MANIFEST);
    if (delta) { fs.writeFileSync(path.join(stage, DELTA), jsonBytes(delta)); paths.push(DELTA); }
    // An argument file avoids command-line length limits and preserves Unicode names.
    const list = path.join(stage, '.jar-files');
    fs.writeFileSync(list, paths.map(p => '"' + p.replaceAll('"', '\\"') + '"').join('\n') + '\n');
    execFileSync(jar, ['--create', '--file', archive, '--no-manifest', '@' + list], { cwd: stage, stdio: 'inherit' });
  } finally {
    // Only remove the generated staging directory directly beneath this output.
    if (path.dirname(stage) !== parent || !path.basename(stage).startsWith('.poc-stage-')) throw new Error('Invalid staging cleanup path');
    fs.rmSync(stage, { recursive: true, force: true });
  }
  if (fs.statSync(archive).size >= 2 * 1024 ** 3) throw new Error("Update ZIP exceeds GitHub's 2 GiB per-asset limit");
  const digest = (await fileInfo(archive)).sha256;
  fs.writeFileSync(archive + '.sha256', digest + '  ' + path.basename(archive) + '\n');
  return digest;
}

export async function packageRelease({ root = ROOT, version, notes, output, baseline = false, bases = [], jar = 'jar' } = {}) {
  root = fs.realpathSync(root);
  const pack = readJson(path.join(root, PACK));
  if (version !== undefined) { versionParts(version); pack.version = version.replace(/^[vV]/, ''); }
  if (notes !== undefined) pack.changelog = notes;
  const data = jsonBytes(pack);
  const files = {};
  for (const name of candidates(root)) files[name] = name === PACK && !baseline ? info(data) : await fileInfo(path.join(root, name));
  const initial = manifest(pack, files);
  if (baseline) {
    fs.mkdirSync(path.dirname(path.join(root, BASELINE)), { recursive: true });
    fs.writeFileSync(path.join(root, BASELINE), jsonBytes(initial));
    return initial;
  }
  if (!output) throw new Error('Output directory required');
  output = path.resolve(output);
  const baselineData = jsonBytes(initial);
  files[BASELINE] = info(baselineData);
  const final = manifest(pack, files);
  const baseVersions = new Set();
  for (const base of bases) {
    validateBase(base, final);
    const key = versionParts(base.version).join('.');
    if (baseVersions.has(key)) throw new Error('Duplicate delta base version');
    baseVersions.add(key);
  }
  fs.mkdirSync(output, { recursive: true });
  const generated = new Map([[PACK, data], [BASELINE, baselineData]]);
  const archive = path.join(output, ASSET);
  const digest = await writeArchive(root, archive, final, Object.keys(files), generated, jar);
  fs.writeFileSync(path.join(output, MANIFEST), jsonBytes(final));
  const tag = version ?? 'v' + pack.version;
  const repo = 'https://github.com/RainRaf-UwU/Path-Of-Creation/releases/';
  const prefix = repo + 'download/' + encodeURIComponent(tag) + '/';
  const deltas = [], assets = [ASSET, ASSET + '.sha256', MANIFEST];
  for (const base of bases) {
    const changed = Object.keys(files).filter(p => p === PACK || p === BASELINE || !sameFile(base.files[p], files[p])).sort();
    const removed = Object.keys(base.files).filter(p => !Object.hasOwn(files, p) && p !== BASELINE).sort();
    const delta = { schema: 1, base, files: changed, removed };
    const name = 'path-of-creation-delta-from-v' + base.version.replace(/^[vV]/, '') + '.zip';
    const destination = path.join(output, name);
    const deltaDigest = await writeArchive(root, destination, final, changed, generated, jar, delta);
    deltas.push({ from: base.version.replace(/^[vV]/, ''), download: prefix + name, digest: 'sha256:' + deltaDigest,
      checksum: prefix + name + '.sha256', size: fs.statSync(destination).size });
    assets.push(name, name + '.sha256');
    console.log(`Delta v${base.version} -> v${pack.version}: ${changed.length} payload files, ${removed.length} removals`);
  }
  fs.writeFileSync(path.join(output, 'latest.json'), jsonBytes({ version: pack.version, notes: pack.changelog ?? '',
    page: repo + 'tag/' + encodeURIComponent(tag), download: prefix + ASSET, digest: 'sha256:' + digest,
    checksum: prefix + ASSET + '.sha256', size: fs.statSync(archive).size, deltas }));
  fs.writeFileSync(path.join(output, 'assets.txt'), assets.join('\n') + '\n');
  console.log(`Release v${pack.version}: ${Object.keys(files).length} files, ZIP ${fs.statSync(archive).size} bytes`);
  return final;
}

async function main() {
  const options = { root: ROOT, output: path.join(ROOT, 'dist/poc-updater'), bases: [] };
  const manifests = [];
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (key === '--baseline') { options.baseline = true; continue; }
    const value = args[++i];
    if (value === undefined) throw new Error('Missing value for ' + key);
    if (key === '--notes-file') options.notes = fs.readFileSync(value, 'utf8').replace(/\r\n?/g, '\n');
    else if (key === '--base-manifest') manifests.push(value);
    else if (key === '--bases-dir') manifests.push(...fs.readdirSync(value).filter(p => p.endsWith('.json')).sort().map(p => path.join(value, p)));
    else if (['--root', '--version', '--output', '--jar'].includes(key)) options[key.slice(2)] = value;
    else throw new Error('Unknown option ' + key);
  }
  if (options.baseline && (options.version || options.notes !== undefined || manifests.length)) throw new Error('--baseline always snapshots the currently installed version');
  options.bases = manifests.map(readJson);
  await packageRelease(options);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
