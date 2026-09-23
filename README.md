# Portable Persistent Goal Protocol (PPGP)

> Open, vendor-neutral continuity protocol for coding agents: persistent goals, recoverable state, verified work, clean handoffs.

**Source version:** v0.1.3 candidate (this tree; see `package.json`)  
**Latest published release:** [GitHub Releases](https://github.com/Fatboy-coder/ppgp/releases/latest) · [npm](https://www.npmjs.com/package/@fatboy-coder/ppgp)  
**Status:** experimental, maintainer-tested, adversarially exercised under documented scenarios  
**License:** MIT

## What it is

Long-running coding agents lose their working context: sessions end, context is compacted, one agent replaces another. PPGP keeps the minimum state a fresh agent needs in repository-visible files, so work resumes from the repository instead of from a human retelling the story.

It does not replace model memory, Git, tests or MCP. It is a small control protocol around them: one temporary `ACTIVE_GOAL` file with thirteen fields, a goal lifecycle, an inner verify-and-record loop, and rules for evidence, blockers, handoff and closure.

## Try it

Inside any Git repository:

```bash
npx @fatboy-coder/ppgp init
npx @fatboy-coder/ppgp goal "Ship one verified milestone"
npx @fatboy-coder/ppgp status
npx @fatboy-coder/ppgp doctor
```

`goal` scaffolds `docs/ACTIVE_GOAL.md`; `status` and `handoff` read it back; `doctor` checks the repository. The CLI is a deterministic helper. `distill` and `close` are agent-performed protocol operations because they require judgement.

Install the Agent Skill into an Agent Skills-compatible client:

```bash
npx skills add https://github.com/Fatboy-coder/ppgp/tree/main/skills/ppgp
```

Manual install: open the [latest GitHub Release](https://github.com/Fatboy-coder/ppgp/releases/latest), download its versioned `ppgp-v*.zip`, and copy the `ppgp` directory into your client's skills location. Platform-specific routes (Claude, Codex, Gemini, Cursor, Copilot and others) are in [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## Core model

```text
GOAL
  |
  v
THINK -> FREEZE -> EXECUTE -> HARDEN -> SHIP -> DISTILL -> CLOSED
                     ^                    |
                     |                    v
              RETRIEVE -> ACT -> VERIFY -> DELTA
```

```text
CONSTITUTION   long-lived authority and constraints
ROADMAP        project direction, deferred goals
MEMORY         durable decisions, invariants and lessons
ACTIVE_GOAL    temporary working memory for exactly one goal
GIT            forensic history and implementation evidence
```

`ACTIVE_GOAL` is conformant when all thirteen fields of [SPEC §3.4](./SPEC.md) are present. The CLI is tolerant about how they are written (header level, bold, `KEY:` lines) and strict about which are missing: exit `0` conformant, `2` partial, `1` malformed or missing. Prepared is not done; started is not done; agent confidence is not evidence.

The protocol is [`SPEC.md`](./SPEC.md). The compact agent-facing reference is [`skills/ppgp/references/PPGP.md`](./skills/ppgp/references/PPGP.md).

## Versions

- **Source version** is the `version` in `package.json`, mirrored in `SPEC.md`, the skill metadata and `CITATION.cff`. It identifies this tree, released or not.
- **Published versions** are only what [GitHub Releases](https://github.com/Fatboy-coder/ppgp/releases) and [npm](https://www.npmjs.com/package/@fatboy-coder/ppgp) actually list. `CHANGELOG.md` marks an entry `candidate` until it is published.
- `0.x` releases are experimental and may change incompatibly. Cite the exact version you evaluated.

What comes next is in [`ROADMAP.md`](./ROADMAP.md).

## Evidence and research

PPGP does not claim to invent agent memory, outperform other systems, reduce tokens by a fixed percentage or eliminate human review. Its claims are narrow and meant to be falsified:

- [`docs/EVALUATION.md`](./docs/EVALUATION.md) — how to evaluate PPGP and what to record.
- [`benchmarks/`](./benchmarks/) — paired A/B recovery protocol, result schema, deterministic pilot fixture.
- [`research/`](./research/) — dated, non-normative validation records, including the 2026-09-23 adversarial validation of v0.1.2.

Recovery failures, overhead reports and negative results are welcome through the [issue forms](../../issues/new/choose).

## Repository map

```text
SPEC.md                 the protocol (normative)
skills/ppgp/            canonical Agent Skill; .agents/ and plugins/ are drift-tested mirrors
bin/ppgp.js             dependency-free CLI helper
test/                   regression suite and fixtures
benchmarks/             evaluation protocol, schema, pilot fixture
docs/                   compatibility, distribution, evaluation guide; ACTIVE_GOAL.md while a goal is open
research/               dated evidence records
CHANGELOG.md ROADMAP.md CONTRIBUTING.md CITATION.cff
```

Machine manifests at the root (`plugin.json`, `gemini-extension.json`, `.claude-plugin/`, `.codex-plugin/`) exist for agent platforms and need no reading.

## Contributing and citing

[`CONTRIBUTING.md`](./CONTRIBUTING.md) covers tests, the CLI, mirror synchronization, the self-hosting rule and releases. Cite with [`CITATION.cff`](./CITATION.cff), naming the exact version.

PPGP was first published on 2026-08-24 in the `Fatboy-coder/fatboy-coder` repository under `/ppgp`; this repository is its canonical home. It is an independent open-source project, not affiliated with or endorsed by any agent vendor.
