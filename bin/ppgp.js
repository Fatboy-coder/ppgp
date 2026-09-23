#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const pkg = require('../package.json');

const ROLE_CANDIDATES = {
  CONSTITUTION: ['docs/MASTER.md', 'MASTER.md', 'docs/CONSTITUTION.md', 'CONSTITUTION.md'],
  ROADMAP: ['docs/ROADMAP.md', 'ROADMAP.md'],
  MEMORY: ['docs/PROJECT_MEMORY.md', 'PROJECT_MEMORY.md', 'docs/MEMORY.md', 'MEMORY.md'],
  ACTIVE_GOAL: ['docs/ACTIVE_GOAL.md', 'ACTIVE_GOAL.md']
};

// The thirteen ACTIVE_GOAL fields of SPEC.md section 3.4, in canonical order.
const SECTIONS = [
  'GOAL', 'WHY', 'PHASE', 'DEFINITION_OF_DONE', 'FROZEN_DECISIONS', 'INVARIANTS',
  'VERIFIED_CURRENT_STATE', 'COMPLETED', 'REMAINING', 'BLOCKERS',
  'HUMAN_AUTHORITY_REQUIRED', 'VERIFICATION_EVIDENCE', 'NEXT_EXECUTABLE_ACTION'
];

// Conformance (SPEC 3.4): all thirteen fields present = CONFORMANT; some PPGP state recognized but
// canonical fields missing = PARTIAL; no usable structure = MALFORMED; no file = MISSING.

// Small alias table for names seen in real repositories. Kept deliberately short.
const ALIASES = {
  CURRENT_PHASE: 'PHASE',
  DOD: 'DEFINITION_OF_DONE',
  DEFINITION_OF_DONE: 'DEFINITION_OF_DONE',
  FROZEN: 'FROZEN_DECISIONS',
  BLOCKER: 'BLOCKERS',
  AUTHORITY: 'HUMAN_AUTHORITY_REQUIRED',
  HUMAN_AUTHORITY: 'HUMAN_AUTHORITY_REQUIRED',
  EVIDENCE: 'VERIFICATION_EVIDENCE',
  VERIFIED_STATE: 'VERIFIED_CURRENT_STATE',
  NEXT: 'NEXT_EXECUTABLE_ACTION',
  NEXT_ACTION: 'NEXT_EXECUTABLE_ACTION',
  NEXT_STEP: 'NEXT_EXECUTABLE_ACTION',
  NEXT_EXECUTABLE_ACTIONS: 'NEXT_EXECUTABLE_ACTION'
};

const PHASES = ['THINK', 'FREEZE', 'EXECUTE', 'HARDEN', 'SHIP', 'DISTILL', 'CLOSED'];

const EXIT = { OK: 0, ERROR: 1, PARTIAL: 2 };

function die(message, code = EXIT.ERROR) {
  console.error(`PPGP: ${message}`);
  process.exit(code);
}

function warn(message) {
  console.error(`PPGP warning: ${message}`);
}

function parseArgs(argv) {
  const args = [...argv];
  const options = { root: null, force: false };
  const positional = [];

  while (args.length) {
    const arg = args.shift();
    if (arg === '--root') {
      const value = args.shift();
      if (!value) die('--root requires a path.');
      options.root = path.resolve(value);
    } else if (arg === '--force') {
      options.force = true;
    } else {
      positional.push(arg);
    }
  }

  return { options, positional };
}

function git(root, args) {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function hasGit(root) {
  return git(root, ['rev-parse', '--is-inside-work-tree']) === 'true';
}

// Explicit --root wins. Otherwise the Git top-level of the working directory, so that a nested
// cwd still finds repository-level PPGP state. Outside Git, cwd itself is the root (portability).
function resolveRoot(options) {
  if (options.root) return options.root;
  const cwd = process.cwd();
  const top = git(cwd, ['rev-parse', '--show-toplevel']);
  return top ? path.resolve(top) : cwd;
}

function findRole(root, role) {
  for (const candidate of ROLE_CANDIDATES[role] || []) {
    const absolute = path.join(root, candidate);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return candidate;
  }
  return null;
}

function roleMap(root) {
  return Object.fromEntries(Object.keys(ROLE_CANDIDATES).map((role) => [role, findRole(root, role)]));
}

function printMap(root) {
  const roles = roleMap(root);
  console.log(`PPGP ${pkg.version} repository mapping`);
  console.log(`Root: ${root}`);
  for (const [role, file] of Object.entries(roles)) {
    console.log(`${role.padEnd(12)} ${file || '(not mapped)'}`);
  }
  console.log(`GIT          ${hasGit(root) ? 'available' : '(not detected)'}`);
  return roles;
}

function activeGoalPath(root) {
  const existing = findRole(root, 'ACTIVE_GOAL');
  return existing ? path.join(root, existing) : path.join(root, 'docs', 'ACTIVE_GOAL.md');
}

function goalTemplate(outcome) {
  return `# ACTIVE_GOAL\n\n## GOAL\n${outcome}\n\n## WHY\nTODO: Why this goal matters.\n\n## PHASE\nTHINK\n\n## DEFINITION_OF_DONE\n- TODO: Define a verifiable completion condition.\n\n## FROZEN_DECISIONS\n- None yet.\n\n## INVARIANTS\n- None recorded yet.\n\n## VERIFIED_CURRENT_STATE\n- TODO: Verify current repository or runtime state.\n\n## COMPLETED\n- Nothing yet.\n\n## REMAINING\n- Define and execute the work required to reach the Definition of Done.\n\n## BLOCKERS\n- None currently known.\n\n## HUMAN_AUTHORITY_REQUIRED\n- None currently known.\n\n## VERIFICATION_EVIDENCE\n- None yet.\n\n## NEXT_EXECUTABLE_ACTION\n- Complete THINK and freeze the first executable plan.\n`;
}

// --- parser -------------------------------------------------------------------------------

function normalizeName(raw) {
  return raw.replace(/[*_`]+/g, ' ').replace(/:\s*$/, '').trim().toUpperCase()
    .replace(/[\s-]+/g, '_').replace(/[^A-Z0-9_]/g, '');
}

function canonicalName(raw) {
  const name = normalizeName(raw);
  if (!name) return null;
  if (SECTIONS.includes(name)) return name;
  if (ALIASES[name]) return ALIASES[name];
  if (/(^|_)NEXT(_|$)/.test(name)) return 'NEXT_EXECUTABLE_ACTION';
  return null;
}

// Recognized section starts, in order of precedence:
//   1. Markdown header at any level:   ## GOAL   /   ### Definition of Done   /   # NEXT_EXECUTABLE_ACTION:
//   2. Bold-only line:                 **GOAL**
//   3. Upper-case key line:            GOAL: text   /   FROZEN_DECISIONS:   /   DEFINITION_OF_DONE (note):
//      Unknown upper-case keys containing an underscore also start a (retained) section.
// Names are matched case-insensitively after spaces and hyphens become underscores.
function matchSectionStart(line) {
  let m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
  if (m) return { level: m[1].length, raw: m[2].trim(), inline: '' };
  m = line.match(/^\*\*([^*]+?)\*\*\s*:?\s*$/);
  if (m) return { level: 2, raw: m[1].trim(), inline: '' };
  m = line.match(/^([A-Z][A-Z0-9_]*(?:[ -][A-Z0-9_]+)*)(?:\s*\([^)]*\))?\s*:\s*(.*)$/);
  if (m && m[1].length <= 40 && (canonicalName(m[1]) || m[1].includes("_"))) return { level: 2, raw: m[1].trim(), inline: m[2].trim() };
  return null;
}

function parseActiveGoal(content) {
  const result = { title: null, sections: {}, unknown: [], duplicates: [], starts: 0 };
  let current = null; // { name, level, lines }
  const lines = content.split(/\r?\n/);
  let inFence = false;

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const start = inFence ? null : matchSectionStart(line);
    if (start) {
      const name = canonicalName(start.raw);
      const deeperThanCurrent = current && start.level > current.level;
      if (!name && start.level === 1 && result.starts === 0 && !result.title) {
        result.title = start.raw;
        return;
      }
      if (!name && deeperThanCurrent) {
        current.lines.push(line); // sub-heading inside a section
        return;
      }
      if (name && deeperThanCurrent && current.name === name) {
        current.lines.push(line);
        return;
      }
      result.starts += 1;
      if (name && result.sections[name] !== undefined) {
        result.duplicates.push({ name, line: index + 1 });
        current = { name: null, level: start.level, lines: [] }; // ignore the duplicate body
        return;
      }
      current = { name, raw: start.raw, level: start.level, lines: [] };
      if (start.inline) current.lines.push(start.inline);
      if (name) result.sections[name] = current;
      else result.unknown.push(current);
      return;
    }
    if (current) current.lines.push(line);
  });

  const text = (entry) => entry.lines.join('\n').trim();
  result.sections = Object.fromEntries(Object.entries(result.sections).map(([k, v]) => [k, text(v)]));
  result.unknown = result.unknown.map((entry) => ({ title: entry.raw, text: text(entry) }));
  return result;
}

function isEmptyish(value) {
  const stripped = (value || '').replace(/^[-*\d.)\s]+/gm, '').trim();
  return !stripped || /^(none|nothing|n\/a|-)\b/i.test(stripped) && stripped.split(/\n/).length === 1;
}

// Classifies parsed state: conformant | partial | malformed, plus human-readable warnings.
function analyze(parsed, content) {
  const warnings = [];
  const present = Object.keys(parsed.sections);

  if (!content.trim()) return { severity: 'malformed', reason: 'file is empty', warnings };
  const control = (content.match(/[^\t\r\n\x20-\x7E\u00A0-\uFFFF]/g) || []).length;
  if (control > content.length * 0.05) return { severity: "malformed", reason: "file is not readable text", warnings };
  if (present.length === 0) {
    const seen = parsed.unknown.map((u) => `"${u.title}"`).slice(0, 6).join(', ');
    return {
      severity: 'malformed',
      reason: `no recognizable ACTIVE_GOAL sections (expected "## GOAL" style headers or "GOAL:" lines)${seen ? `; headers seen: ${seen}` : ''}`,
      warnings
    };
  }

  const missing = SECTIONS.filter((s) => !present.includes(s));
  if (missing.length) warnings.push(`canonical field(s) missing (${missing.length} of ${SECTIONS.length}): ${missing.join(', ')}`);
  for (const d of parsed.duplicates) warnings.push(`duplicate section ${d.name} at line ${d.line} ignored (first occurrence kept)`);
  if (parsed.unknown.length) warnings.push(`unrecognized section(s) kept as-is: ${parsed.unknown.map((u) => `"${u.title}"`).join(', ')}`);

  const phase = (parsed.sections.PHASE || '').split(/\n/)[0].replace(/[*_`]/g, '').trim();
  const phaseWord = phase.toUpperCase().split(/[^A-Z]/)[0];
  if (phase && !PHASES.includes(phaseWord)) warnings.push(`PHASE "${phase}" is not a lifecycle phase name (${PHASES.join(' -> ')})`);
  if (phaseWord === 'CLOSED') {
    warnings.push('PHASE is CLOSED but ACTIVE_GOAL still exists; SPEC 3.4 requires deletion after verified closure and distillation. Verify the Definition of Done before treating this goal as closed.');
    if (!isEmptyish(parsed.sections.REMAINING)) warnings.push('contradiction: PHASE is CLOSED while REMAINING is not empty');
  }
  const todo = (content.match(/\bTODO\b/g) || []).length;
  if (todo) warnings.push(`${todo} scaffold TODO placeholder(s) still present`);

  return { severity: missing.length ? 'partial' : 'conformant', reason: null, warnings };
}

function oneLine(value, fallback = '(not set)') {
  if (!value) return fallback;
  return value.replace(/^[-*]\s+/gm, '').replace(/\s*\n\s*/g, ' | ').replace(/\s+/g, ' ').trim() || fallback;
}

function readActiveGoal(root) {
  const file = findRole(root, 'ACTIVE_GOAL');
  if (!file) die('No ACTIVE_GOAL found. Start one with: ppgp goal "<outcome>"');
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const parsed = parseActiveGoal(content);
  const health = analyze(parsed, content);
  if (health.severity === 'malformed') die(`${file} is malformed: ${health.reason}`);
  for (const w of health.warnings) warn(w);
  return { file, sections: parsed.sections, parsed, health };
}

function exitFor(health) {
  process.exitCode = health.severity === 'partial' ? EXIT.PARTIAL : EXIT.OK;
}

// --- commands -----------------------------------------------------------------------------

function cmdInit(root) {
  printMap(root);
  console.log('\nInitialization is non-destructive. Existing documentation is reused; no empty memory files are created.');
}

function gitSummary(root) {
  const branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const sha = git(root, ['rev-parse', '--short', 'HEAD']);
  const status = git(root, ['status', '--porcelain']);
  const changed = status ? status.split(/\r?\n/).filter(Boolean).length : 0;
  const where = branch === 'HEAD' ? `detached HEAD @ ${sha}` : `branch ${branch} @ ${sha || '(no commits)'}`;
  return `Git: ${where}, working tree ${changed ? `${changed} changed path(s)` : 'clean'}`;
}

// Lists refs whose tip contains an ACTIVE_GOAL candidate. Read-only; never switches or merges.
function activeGoalOnOtherRefs(root) {
  const refs = (git(root, ['for-each-ref', '--format=%(refname:short)', 'refs/heads', 'refs/remotes']) || '')
    .split(/\r?\n/).filter((r) => r && !/\/HEAD$/.test(r)).slice(0, 200);
  const found = [];
  for (const ref of refs) {
    for (const candidate of ROLE_CANDIDATES.ACTIVE_GOAL) {
      if (git(root, ['cat-file', '-e', `${ref}:${candidate}`]) !== null) {
        const date = git(root, ['log', '-1', '--format=%cs', ref, '--', candidate]) || '?';
        found.push(`${ref}:${candidate} (last change ${date})`);
        break;
      }
    }
  }
  return found;
}

function cmdDoctor(root) {
  const roles = printMap(root);
  const notes = [];
  const gitAvailable = hasGit(root);
  if (gitAvailable) console.log(gitSummary(root));
  else notes.push('Git forensic history was not detected.');

  if (!roles.ACTIVE_GOAL) {
    const elsewhere = gitAvailable ? activeGoalOnOtherRefs(root) : [];
    if (elsewhere.length) {
      notes.push(`No ACTIVE_GOAL in this checkout, but other refs carry one: ${elsewhere.join('; ')}. Not switching branches. Inspect with: git show <ref>:<path>. Verify it is current before treating it as the active goal.`);
    } else {
      notes.push('No ACTIVE_GOAL is present. This is normal when no substantial goal is active.');
    }
  } else {
    const content = fs.readFileSync(path.join(root, roles.ACTIVE_GOAL), 'utf8');
    const health = analyze(parseActiveGoal(content), content);
    if (health.severity === 'malformed') notes.push(`${roles.ACTIVE_GOAL} is malformed: ${health.reason}`);
    for (const w of health.warnings) notes.push(`${roles.ACTIVE_GOAL}: ${w}`);
    if (health.severity === 'malformed') process.exitCode = EXIT.ERROR;
    else if (health.severity === 'partial') process.exitCode = EXIT.PARTIAL;
  }
  console.log(notes.length ? `\nNotes:\n- ${notes.join('\n- ')}` : '\nNo obvious repository-level PPGP issues detected.');
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

function cmdGoal(root, positional, force) {
  const outcome = positional.join(' ').trim();
  if (!outcome) die('goal requires an outcome, for example: ppgp goal "Ship the authentication migration"');
  const target = activeGoalPath(root);
  if (fs.existsSync(target)) {
    if (!force) die(`${path.relative(root, target)} already exists. Use --force only when intentionally replacing the active goal.`);
    const backup = `${target}.${timestamp()}.bak`;
    fs.copyFileSync(target, backup);
    console.log(`Previous ACTIVE_GOAL preserved at ${path.relative(root, backup)}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, goalTemplate(outcome), 'utf8');
  console.log(`Created ${path.relative(root, target)} in THINK phase.`);
  console.log('Next: verify current state, define the Definition of Done, then freeze the executable plan.');
}

function cmdStatus(root) {
  const { file, sections, parsed, health } = readActiveGoal(root);
  console.log(`PPGP/${pkg.version} status from ${file}`);
  if (!sections.GOAL && parsed.title) console.log(`goal: (no GOAL section) title: ${parsed.title}`);
  else console.log(`goal: ${oneLine(sections.GOAL)}`);
  console.log(`phase: ${oneLine(sections.PHASE)}`);
  console.log(`frozen: ${oneLine(sections.FROZEN_DECISIONS)}`);
  console.log(`verified: ${oneLine(sections.VERIFIED_CURRENT_STATE)}`);
  console.log(`remaining: ${oneLine(sections.REMAINING)}`);
  console.log(`blockers: ${oneLine(sections.BLOCKERS)}`);
  console.log(`authority: ${oneLine(sections.HUMAN_AUTHORITY_REQUIRED)}`);
  console.log(`next: ${oneLine(sections.NEXT_EXECUTABLE_ACTION)}`);
  console.log(`evidence: ${oneLine(sections.VERIFICATION_EVIDENCE)}`);
  if (parsed.unknown.length) console.log(`unrecognized: ${parsed.unknown.map((u) => u.title).join(' | ')}`);
  console.log(`state: ${health.severity}${health.warnings.length ? ` (${health.warnings.length} warning(s) on stderr)` : ''}`);
  exitFor(health);
}

function cmdHandoff(root) {
  const { sections, health } = readActiveGoal(root);
  console.log(`PPGP/${pkg.version}`);
  console.log(`G=${oneLine(sections.GOAL)}`);
  console.log(`P=${oneLine(sections.PHASE)}`);
  console.log(`F:${oneLine(sections.FROZEN_DECISIONS)}`);
  console.log(`D:${oneLine(sections.COMPLETED)}`);
  console.log(`B:${oneLine(sections.BLOCKERS)}`);
  console.log(`E:${oneLine(sections.VERIFICATION_EVIDENCE)}`);
  console.log(`N:${oneLine(sections.NEXT_EXECUTABLE_ACTION)}`);
  exitFor(health);
}

function cmdSkillPath() {
  console.log(path.join(path.resolve(__dirname, '..'), 'skills', 'ppgp'));
}

function cmdInstallSkill(positional) {
  const destination = positional[0];
  if (!destination) die('install-skill requires a destination directory, for example: ppgp install-skill ~/.config/agent-skills');
  const source = path.join(path.resolve(__dirname, '..'), 'skills', 'ppgp');
  if (!fs.existsSync(source)) die('Bundled Agent Skill was not found in this package.');
  const parent = path.resolve(destination);
  const target = path.join(parent, 'ppgp');
  fs.mkdirSync(parent, { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true });
  console.log(`Installed PPGP Agent Skill to ${target}`);
}

function help() {
  console.log(`PPGP ${pkg.version}\nPortable Persistent Goal Protocol CLI\n\nUsage:\n  ppgp init [--root PATH]\n  ppgp doctor [--root PATH]\n  ppgp goal <outcome> [--root PATH] [--force]\n  ppgp status [--root PATH]\n  ppgp handoff [--root PATH]\n  ppgp skill-path\n  ppgp install-skill <destination>\n  ppgp --version\n\nRoot: --root, else the Git top-level of the working directory, else the working directory.\n\nACTIVE_GOAL sections are recognized as "## GOAL" headers at any level, "**GOAL**" bold lines, or\n"GOAL:" upper-case key lines; names are matched case-insensitively (spaces/hyphens as underscores).\n\nExit codes: 0 ok (warnings may be printed on stderr), 1 error or malformed state, 2 partial state\n(GOAL or NEXT_EXECUTABLE_ACTION could not be found).\n\nThe handoff packet supplements the repository-visible ACTIVE_GOAL; it never replaces it.\n\nThe CLI is a deterministic companion to the PPGP protocol. It does not replace agent reasoning, verification, distillation, or closure checks.\n`);
}

const raw = process.argv.slice(2);
if (raw.length === 0 || raw.includes('--help') || raw.includes('-h')) {
  help();
  process.exit(0);
}
if (raw.includes('--version') || raw.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

const command = raw.shift();
const { options, positional } = parseArgs(raw);
const root = resolveRoot(options);
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) die(`Root is not a directory: ${root}`);

switch (command) {
  case 'init': cmdInit(root); break;
  case 'doctor': cmdDoctor(root); break;
  case 'goal': cmdGoal(root, positional, options.force); break;
  case 'status': cmdStatus(root); break;
  case 'handoff': cmdHandoff(root); break;
  case 'skill-path': cmdSkillPath(); break;
  case 'install-skill': cmdInstallSkill(positional); break;
  default: die(`Unknown command: ${command}. Run ppgp --help.`);
}
