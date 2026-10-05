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
    harness = r'''
const fs = require('fs');
const assert = require('assert/strict');
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
const publish = new AsyncFunction('github', 'context', 'core', 'require', fs.readFileSync(process.argv[2], 'utf8'));
const readNotes = new AsyncFunction('context', 'require', 'process', fs.readFileSync(process.argv[3], 'utf8'));
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
async function run(previous, next, branchExists) {
  const calls = [];
  const notFound = () => Object.assign(new Error('missing'), {status: 404});
  const github = {rest: {
    git: {
      getRef: async args => { if (!branchExists) throw notFound(); return {}; },
      createRef: async args => { calls.push(['branch', args]); }
    },
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
    return {readFileSync: () => Buffer.from(JSON.stringify({version: next, notes: 'Chinese notes'}))};
  };
  await publish(github, {repo: {owner: 'RainRaf-UwU', repo: 'Path-Of-Creation'}, sha: 'release-commit'}, {info: () => {}}, mockRequire);
  return calls;
}
(async () => {
  const pack = {version: '0.1', changelog: '更新了若干 Mod。\n修复已知 Bug。\n优化整合包任务线。'};
  assert.equal(await notesFor('push', 'v0.1', pack), pack.changelog);
  assert.equal(await notesFor('release', 'v0.1', pack, 'Release page notes'), 'Release page notes');
  await assert.rejects(() => notesFor('push', 'v0.2', pack), /Release tag must match/);
  const initial = await run(null, '0.0.5', false);
  assert.equal(initial.length, 2);
  assert.equal(initial[0][1].ref, 'refs/heads/codex/poc-updates');
  assert.equal(initial[1][1].branch, 'codex/poc-updates');
  assert.equal(initial[1][1].message, 'new commit');
  assert.equal(JSON.parse(Buffer.from(initial[1][1].content, 'base64').toString()).version, '0.0.5');
  const upgraded = await run('0.0.9', '0.0.10', true);
  assert.equal(upgraded.length, 1);
  assert.equal(upgraded[0][1].sha, 'existing-file-sha');
  assert.equal((await run('0.0.10', '0.0.9', true)).length, 0);
  assert.equal((await run('0.0.10', '0.0.10', true)).length, 1);
  console.log('PASS: tag/release notes, mismatched-tag rejection and version feed publication');
})().catch(error => {console.error(error); process.exitCode = 1;});
'''
    file = folder / "harness.js"
    file.write_text(harness, encoding="utf-8")
    subprocess.run(["node", str(file), str(folder / "action.js"), str(folder / "notes.js")], check=True)


if __name__ == "__main__":
    main()
