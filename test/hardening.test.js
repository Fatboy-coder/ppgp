'use strict';
// v0.1.3 hardening regression suite. Fixtures under test/fixtures/ were derived from the
// 2026-09-23 adversarial validation (research branch research/ppgp-reality-audit).
// Every case runs in a disposable temp directory; nothing depends on the developer's repository.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = path.resolve(__dirname, '..');
const cli = path.join(repo, 'bin', 'ppgp.js');
const fixtures = path.join(__dirname, 'fixtures');
const pkg = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
const temps = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function tmp(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `ppgp-hardening-${name}-`));
  temps.push(dir);
  return dir;
}

function ppgp(args, options = {}) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', ...options });
  return { code: result.status, out: result.stdout || '', err: result.stderr || '' };
}

function git(dir, args) {
  const result = spawnSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@example.test', ...args], { encoding: 'utf8' });
  assert(result.status === 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout.trim();
}

function repoWith(name, fixture) {
  const dir = tmp(name);
  git(dir, ['init', '-q', '-b', 'main']);
  if (fixture) {
    fs.mkdirSync(path.join(dir, 'docs'));
    fs.writeFileSync(path.join(dir, 'docs', 'ACTIVE_GOAL.md'), fs.readFileSync(path.join(fixtures, fixture), 'utf8'));
  }
  return dir;
}

function fields(out) {
  return Object.fromEntries(out.split(/\r?\n/).filter((l) => /^[a-z]+: /.test(l)).map((l) => {
    const i = l.indexOf(': ');
    return [l.slice(0, i), l.slice(i + 2)];
  }));
}

try {
  // 1. canonical happy path: scaffold -> status -> handoff, unchanged v0.1.2 behaviour, no warnings beyond TODOs
  {
    const dir = repoWith('happy');
    assert(ppgp(['init', '--root', dir]).code === 0, 'init failed');
    assert(ppgp(['goal', 'Ship the test', '--root', dir]).code === 0, 'goal failed');
    const status = ppgp(['status', '--root', dir]);
    assert(status.code === 0, 'scaffold status must exit 0');
    assert(status.out.includes(`PPGP/${pkg.version} status from docs/ACTIVE_GOAL.md`), 'status header');
    assert(fields(status.out).goal === 'Ship the test', 'goal not recovered');
    assert(status.out.includes('state: ok'), 'scaffold must be ok');
    assert(/TODO/.test(status.err) && !/missing/.test(status.err), 'scaffold warns about TODOs only');
    const handoff = ppgp(['handoff', '--root', dir]);
    assert(handoff.code === 0 && handoff.out.startsWith(`PPGP/${pkg.version}\nG=Ship the test\nP=THINK\n`), 'handoff packet shape changed');
    assert(ppgp(['goal', 'Second', '--root', dir]).code === 1, 'second goal must be refused without --force');
  }

  // 2. realistic parsing: filled canonical file, SCP-style key lines, OCPDF-style free headers
  {
    const filled = ppgp(['status', '--root', repoWith('filled', 'filled-goal.md')]);
    assert(filled.code === 0 && filled.out.includes('state: ok') && filled.err === '', `filled fixture must be clean: ${filled.err}`);
    assert(fields(filled.out).next.startsWith('Write auth/tests/test_login_429.py'), 'filled next');

    const scp = ppgp(['status', '--root', repoWith('scp', 'scp-style.md')]);
    assert(scp.code === 0, `SCP-style file must parse (exit ${scp.code})`);
    const f = fields(scp.out);
    assert(f.goal.startsWith('Make the control plane able'), 'SCP GOAL: line not parsed');
    assert(f.phase.includes('OWNER REVIEW'), 'SCP CURRENT_PHASE alias not parsed');
    assert(f.frozen.includes('Engine stays frozen'), 'SCP FROZEN_DECISIONS: block not parsed');
    assert(f.next.startsWith('owner reviews the PR'), 'SCP NEXT_EXECUTABLE_ACTION: not parsed');
    assert(!f.goal.includes('PRODUCT_DIRECTION'), 'unknown upper-case key must start its own section');
    assert(scp.out.includes('unrecognized: PRODUCT_DIRECTION | RESIDUAL_LIMITATIONS'), 'unknown keys must be listed, not dropped');
    assert(/not a lifecycle phase/.test(scp.err), 'non-lifecycle phase must warn');
    const scpHandoff = ppgp(['handoff', '--root', repoWith('scp2', 'scp-style.md')]);
    assert(scpHandoff.code === 0 && scpHandoff.out.includes('N:owner reviews the PR'), 'SCP handoff');

    const ocpdf = ppgp(['status', '--root', repoWith('ocpdf', 'ocpdf-style.md')]);
    assert(ocpdf.code === 2, `OCPDF-style thin pointer must be partial (exit 2), got ${ocpdf.code}`);
    assert(ocpdf.out.includes('goal: (no GOAL section) title: Product Active Goal'), 'title fallback');
    assert(fields(ocpdf.out).next.includes('On or after'), '"Next executable sequence" header must map to NEXT');
    assert(ocpdf.out.includes('unrecognized: Current gate'), 'unrecognized headers must be listed');
    assert(/required section\(s\) missing: GOAL/.test(ocpdf.err), 'missing GOAL must be reported');
    assert(!ocpdf.out.includes('goal: (not set)'), 'the silent (not set) failure mode must be gone');
  }

  // 3. state representation cases: implemented-not-deployed, observation window, scoped blocker are ok, not partial
  for (const [fixture, expect] of [
    ['implemented-not-deployed.md', { phase: 'SHIP', remaining: 'DoD item 4', authority: 'Do NOT deploy' }],
    ['observation-window.md', { phase: 'SHIP', blockers: 'elapsed time until 2026-10-23' }],
    ['blocker-scope.md', { blockers: 'Steps B and C are NOT blocked', next: 'Step B' }],
  ]) {
    const r = ppgp(['status', '--root', repoWith('repr', fixture)]);
    assert(r.code === 0 && r.err === '', `${fixture} must be clean ok: exit ${r.code} ${r.err}`);
    const f = fields(r.out);
    for (const [k, v] of Object.entries(expect)) assert(f[k].includes(v), `${fixture}: ${k} should contain "${v}", got "${f[k]}"`);
  }

  // 4. malformed / contradictory diagnostics
  {
    const missing = ppgp(['status', '--root', repoWith('missing', 'malformed-missing-sections.md')]);
    assert(missing.code === 2 && /required section\(s\) missing: NEXT_EXECUTABLE_ACTION/.test(missing.err), 'missing NEXT must be partial');

    const headers = ppgp(['status', '--root', repoWith('headers', 'malformed-headers.md')]);
    assert(headers.code === 0, `casing/level/bold/colon variants must parse: ${headers.err}`);
    const h = fields(headers.out);
    assert(h.goal === 'Lowercase header variant.' && h.phase === 'EXECUTE', 'lowercase and ### headers');
    assert(h.next === 'Trailing colon on header.', 'trailing-colon header');
    assert(/duplicate section NEXT_EXECUTABLE_ACTION/.test(headers.err), 'bold duplicate must warn, first kept');

    const closed = ppgp(['status', '--root', repoWith('closed', 'false-completion.md')]);
    assert(closed.code === 0 && /PHASE is CLOSED but ACTIVE_GOAL still exists/.test(closed.err), 'CLOSED-with-file must warn');
    const contra = ppgp(['status', '--root', repoWith('contra', 'contradictory.md')]);
    assert(/contradiction: PHASE is CLOSED while REMAINING is not empty/.test(contra.err), 'CLOSED + REMAINING must warn');

    const emptyDir = repoWith('empty', 'filled-goal.md');
    fs.writeFileSync(path.join(emptyDir, 'docs', 'ACTIVE_GOAL.md'), '');
    const empty = ppgp(['status', '--root', emptyDir]);
    assert(empty.code === 1 && /malformed: file is empty/.test(empty.err), 'empty file must fail');
    fs.writeFileSync(path.join(emptyDir, 'docs', 'ACTIVE_GOAL.md'), Buffer.from([0, 1, 2, 255, 254, 0, 7, 8, 0, 1]));
    const garbage = ppgp(['status', '--root', emptyDir]);
    assert(garbage.code === 1 && /not readable text/.test(garbage.err), 'binary garbage must fail');
    fs.writeFileSync(path.join(emptyDir, 'docs', 'ACTIVE_GOAL.md'), 'Just a paragraph of prose with no sections.\n');
    const prose = ppgp(['status', '--root', emptyDir]);
    assert(prose.code === 1 && /no recognizable ACTIVE_GOAL sections/.test(prose.err), 'sectionless prose must fail');
    const doctor = ppgp(['doctor', '--root', emptyDir]);
    assert(doctor.code === 1 && /malformed/.test(doctor.out), 'doctor must surface malformed state');
  }

  // 5. nested-directory invocation resolves the Git top-level; outside Git, cwd is the root
  {
    const dir = repoWith('nested', 'filled-goal.md');
    fs.mkdirSync(path.join(dir, 'src', 'components'), { recursive: true });
    const nested = ppgp(['status'], { cwd: path.join(dir, 'src', 'components') });
    assert(nested.code === 0 && nested.out.includes('status from docs/ACTIVE_GOAL.md'), `nested cwd must find repo state: ${nested.err}`);
    const plain = tmp('nogit');
    fs.mkdirSync(path.join(plain, 'docs'));
    fs.copyFileSync(path.join(fixtures, 'filled-goal.md'), path.join(plain, 'docs', 'ACTIVE_GOAL.md'));
    const noGit = ppgp(['status'], { cwd: plain });
    assert(noGit.code === 0, 'non-Git directory must still work from cwd');
    const noGitDoctor = ppgp(['doctor'], { cwd: plain });
    assert(noGitDoctor.code === 0 && /Git forensic history was not detected/.test(noGitDoctor.out), 'doctor without Git');
  }

  // 6. branch visibility: goal committed only on a feature branch is reported by doctor from main
  {
    const dir = repoWith('branch');
    git(dir, ['commit', '-q', '--allow-empty', '-m', 'init']);
    git(dir, ['checkout', '-q', '-b', 'feat/x']);
    ppgp(['goal', 'Goal on branch', '--root', dir]);
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', 'goal on branch']);
    git(dir, ['checkout', '-q', 'main']);
    const doctor = ppgp(['doctor', '--root', dir]);
    assert(doctor.code === 0, 'doctor exit');
    assert(/Git: branch main @ [0-9a-f]+, working tree clean/.test(doctor.out), `doctor must print branch summary: ${doctor.out}`);
    assert(/other refs carry one: feat\/x:docs\/ACTIVE_GOAL\.md/.test(doctor.out), `doctor must list feat/x: ${doctor.out}`);
    assert(/Not switching branches/.test(doctor.out), 'doctor must say it does not switch');
    assert(git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']) === 'main', 'doctor must not change the checkout');
    fs.writeFileSync(path.join(dir, 'dirty.txt'), 'x');
    assert(/working tree 1 changed path/.test(ppgp(['doctor', '--root', dir]).out), 'dirty count');
  }

  // 7. --force preserves the previous ACTIVE_GOAL
  {
    const dir = repoWith('force', 'filled-goal.md');
    const forced = ppgp(['goal', 'Replacement', '--root', dir, '--force']);
    assert(forced.code === 0 && /Previous ACTIVE_GOAL preserved at docs[\\/]ACTIVE_GOAL\.md\.\d{8}T\d{6}Z\.bak/.test(forced.out), `backup message: ${forced.out}`);
    const backups = fs.readdirSync(path.join(dir, 'docs')).filter((f) => f.endsWith('.bak'));
    assert(backups.length === 1, 'exactly one backup');
    assert(fs.readFileSync(path.join(dir, 'docs', backups[0]), 'utf8').includes('Add rate limiting to /login'), 'backup keeps old content');
    assert(fields(ppgp(['status', '--root', dir]).out).goal === 'Replacement', 'new goal active');
  }

  // 8. minimal repository: one command, one file, thirteen sections; no other files created
  {
    const dir = repoWith('minimal');
    ppgp(['goal', 'Fix typo in README', '--root', dir]);
    const created = fs.readdirSync(dir).filter((f) => f !== '.git');
    assert(created.length === 1 && created[0] === 'docs', `goal must create only docs/: ${created}`);
    const content = fs.readFileSync(path.join(dir, 'docs', 'ACTIVE_GOAL.md'), 'utf8');
    assert((content.match(/^## /gm) || []).length === 13, 'thirteen sections');
  }

  // 9. skill-path and install-skill unchanged
  {
    assert(ppgp(['skill-path']).out.trim().endsWith(path.join('skills', 'ppgp')), 'skill-path');
    const dest = tmp('skill');
    const installed = ppgp(['install-skill', dest]);
    assert(installed.code === 0 && fs.existsSync(path.join(dest, 'ppgp', 'SKILL.md')), 'install-skill');
  }

  console.log('PPGP hardening regression tests passed.');
} finally {
  for (const dir of temps) fs.rmSync(dir, { recursive: true, force: true });
}
