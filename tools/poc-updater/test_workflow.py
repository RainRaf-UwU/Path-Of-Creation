"""Run the exact Actions feed script against a fake GitHub API; no credentials."""
from pathlib import Path
import subprocess
import tempfile


def main():
    workflow = Path(__file__).resolve().parents[2] / ".github/workflows/poc-update-release.yml"
    lines = workflow.read_text(encoding="utf-8").splitlines()
    begin = next(i for i, line in enumerate(lines) if "name: Publish static version feed" in line)
    script = next(i for i in range(begin, len(lines)) if lines[i].strip() == "script: |")
    source = "\n".join(line[12:] for line in lines[script + 1:] if line.startswith(" " * 12))
    folder = Path(tempfile.mkdtemp(prefix="poc-workflow-test-"))
    (folder / "action.js").write_text(source, encoding="utf-8")
    begin_notes = next(i for i, line in enumerate(lines) if "name: Read release notes" in line)
    notes_script = next(i for i in range(begin_notes, len(lines)) if lines[i].strip() == "script: |")
    notes_lines = []
    for line in lines[notes_script + 1:]:
        if not line.startswith(" " * 12):
            break
        notes_lines.append(line[12:])
    (folder / "notes.js").write_text("\n".join(notes_lines), encoding="utf-8")
    begin_bases = next(i for i, line in enumerate(lines) if "name: Select published delta bases" in line)
    bases_script = next(i for i in range(begin_bases, len(lines)) if lines[i].strip() == "script: |")
    bases_lines = []
    for line in lines[bases_script + 1:]:
        if not line.startswith(" " * 12):
            break
        bases_lines.append(line[12:])
    (folder / "bases.js").write_text("\n".join(bases_lines), encoding="utf-8")
    harness = r'''
const fs = require('fs');
const assert = require('assert/strict');
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
const publish = new AsyncFunction('github', 'context', 'core', 'require', fs.readFileSync(process.argv[2], 'utf8'));
const readNotes = new AsyncFunction('context', 'require', 'process', fs.readFileSync(process.argv[3], 'utf8'));
const selectBases = new AsyncFunction('github', 'context', 'core', 'require', 'process', 'fetch', 'AbortSignal', fs.readFileSync(process.argv[4], 'utf8'));
async function testBases() {
  const writes = [], reads = [], fetched = [], warnings = [];
  const base = (version, neoforge = '21.1.255') => ({schema: 1, version, minecraft: '1.21.1', neoforge, files: {}});
  const url = 'https://github.com/RainRaf-UwU/Path-Of-Creation/releases/download/v0.0.10/poc-update.json';
  const releases = ['0.0.7','0.0.8','0.0.9','0.0.10','0.0.11','0.0.12','0.0.13','0.0.14'].map(version => ({
    tag_name: 'v' + version, draft: version === '0.0.11', prerelease: version === '0.0.14',
    assets: version === '0.0.10' ? [{name: 'poc-update.json', size: 100, browser_download_url: url}] : []
  }));
  // Deleted tags never appear in the published-release list and cannot become a delta base.
  const github = {rest: {repos: {
    listReleases: async args => {assert.equal(args.per_page, 100); return {data: releases};},
    getContent: async args => {
      reads.push(args.ref);
      assert.equal(args.path, 'config/poc-updater/baseline.json');
      const data = base(args.ref.slice(1), args.ref === 'v0.0.8' ? '21.1.254' : '21.1.255');
      return {data: {type: 'file', size: 100, content: Buffer.from(JSON.stringify(data)).toString('base64')}};
    }
  }}};
  const mockRequire = name => {
    assert.equal(name, 'fs');
    return {
      mkdirSync: (path, options) => {assert.equal(path, 'dist/delta-bases'); assert.equal(options.recursive, true);},
      readFileSync: path => {assert.equal(path, 'config/poc-updater/pack.json'); return JSON.stringify(base('0.0.12'));},
      writeFileSync: (path, bytes) => writes.push([path, JSON.parse(bytes.toString('utf8'))])
    };
  };
  const fetchManifest = async requested => {fetched.push(requested); return {ok: true, arrayBuffer: async () => Buffer.from(JSON.stringify(base('0.0.10')))};};
  await selectBases(github, {repo: {owner: 'RainRaf-UwU', repo: 'Path-Of-Creation'}},
    {warning: message => warnings.push(message)}, mockRequire, {env: {RELEASE_TAG: 'v0.0.12'}}, fetchManifest, {timeout: () => ({})});
  assert.deepEqual(writes.map(x => x[0]), ['dist/delta-bases/v0.0.10.json','dist/delta-bases/v0.0.9.json']);
  assert.deepEqual(reads, ['v0.0.9','v0.0.8']);
  assert.deepEqual(fetched, [url]);
  assert.equal(warnings.length, 0);
  releases[3].assets[0].browser_download_url = 'https://example.com/manifest.json';
  writes.length = reads.length = fetched.length = 0;
  await selectBases(github, {repo: {owner: 'RainRaf-UwU', repo: 'Path-Of-Creation'}},
    {warning: message => warnings.push(message)}, mockRequire, {env: {RELEASE_TAG: 'v0.0.12'}}, fetchManifest, {timeout: () => ({})});
  assert.equal(warnings.length, 1);
  assert.deepEqual(fetched, []);
  assert.deepEqual(writes.map(x => x[0]), ['dist/delta-bases/v0.0.9.json']);
}
async function notesFor(eventName, tag, pack, body) {
  let output;
  const mockRequire = name => {
    assert.equal(name, 'fs');
    return {
      readFileSync: path => {
        assert.equal(path, 'config/poc-updater/pack.json');
        return JSON.stringify(pack);
      },
      writeFileSync: (path, value, encoding) => {
        assert.equal(path, 'release-notes.txt');
        assert.equal(encoding, 'utf8');
        output = value;
      }
    };
  };
  await readNotes({eventName, payload: {release: {body}}}, mockRequire, {env: {RELEASE_TAG: tag}});
  return output;
}
async function run(previous, next) {
  const calls = [];
  const notFound = () => Object.assign(new Error('missing'), {status: 404});
  const github = {rest: {
    repos: {
      getContent: async args => {
        if (previous === null) throw notFound();
        return {data: {sha: 'existing-file-sha', content: Buffer.from(JSON.stringify({version: previous})).toString('base64')}};
      },
      createOrUpdateFileContents: async args => { calls.push(['feed', args]); }
    }
  }};
  const mockRequire = name => {
    assert.equal(name, 'fs');
    return {readFileSync: () => Buffer.from(JSON.stringify({version: next, notes: 'Chinese notes', deltas: [{from: '0.0.4', size: 17}]}))};
  };
  await publish(github, {repo: {owner: 'RainRaf-UwU', repo: 'Path-Of-Creation'}, sha: 'release-commit'}, {info: () => {}}, mockRequire);
  return calls;
}
(async () => {
  await testBases();
  const pack = {version: '0.1', changelog: '更新了若干 Mod。\n修复已知 Bug。\n优化整合包任务线。'};
  assert.equal(await notesFor('push', 'v0.1', pack), pack.changelog);
  assert.equal(await notesFor('release', 'v0.1', pack, 'Release page notes'), 'Release page notes');
  await assert.rejects(() => notesFor('push', 'v0.2', pack), /Release tag must match/);
  const initial = await run(null, '0.0.5');
  assert.equal(initial.length, 1);
  assert.equal(initial[0][1].branch, 'main');
  assert.equal(initial[0][1].path, 'config/poc-updater/latest.json');
  assert.equal(initial[0][1].message, 'new commit');
  assert.equal(JSON.parse(Buffer.from(initial[0][1].content, 'base64').toString()).version, '0.0.5');
  assert.deepEqual(JSON.parse(Buffer.from(initial[0][1].content, 'base64').toString()).deltas, [{from: '0.0.4', size: 17}]);
  const upgraded = await run('0.0.9', '0.0.10');
  assert.equal(upgraded.length, 1);
  assert.equal(upgraded[0][1].sha, 'existing-file-sha');
  assert.equal((await run('0.0.10', '0.0.9')).length, 0);
  assert.equal((await run('0.0.10', '0.0.10')).length, 1);
  console.log('PASS: published delta-base selection, legacy manifests, runtime compatibility, URL restrictions, release notes and full/delta feed publication');
})().catch(error => {console.error(error); process.exitCode = 1;});
'''
    file = folder / "harness.js"
    file.write_text(harness, encoding="utf-8")
    subprocess.run(["node", str(file), str(folder / "action.js"), str(folder / "notes.js"), str(folder / "bases.js")], check=True)


if __name__ == "__main__":
    main()
