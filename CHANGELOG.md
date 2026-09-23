# Changelog

## 0.1.3 - candidate

Hardening release. Protocol semantics are unchanged from 0.1.2; the CLI and documentation are brought up to the model that the 2026-09-23 adversarial validation (`research/2026-09-23-adversarial-validation.md`) found sound.

CLI:

- tolerant ACTIVE_GOAL parser: fields are recognized as Markdown headers at any level, bold-only lines or upper-case `KEY:` lines, matched case-insensitively with a small alias set; unrecognized sections are retained and reported instead of dropped; the first of duplicate sections wins with a warning;
- explicit conformance classification and exit codes: `0` conformant (all thirteen SPEC 3.4 fields present; warnings on stderr), `2` partial (PPGP state recognized but canonical fields missing, each named), `1` malformed or missing; empty, unreadable or sectionless files no longer report healthy state;
- diagnostics for missing sections, non-lifecycle PHASE values, `CLOSED` phase inside an existing ACTIVE_GOAL, `CLOSED` with non-empty REMAINING, and leftover scaffold placeholders; `doctor` surfaces the same findings;
- repository root resolves from `--root`, else the Git top-level of the working directory, else the working directory, so nested invocation finds repository-level state; Git remains optional;
- `doctor` prints branch, HEAD and working-tree change count and, when no ACTIVE_GOAL is checked out, lists other refs that carry one without switching or merging;
- `goal --force` preserves the replaced file as a timestamped `.bak`.

Documentation (clarifications only, no new normative fields):

- machine-readable shape of ACTIVE_GOAL and CLI exit codes;
- visibility of goal state across refs and the ROADMAP pointer convention;
- handoff packet supplements, never replaces, repository state;
- parking convention for deferred goals using ROADMAP;
- blocker scope expressed in prose;
- GOAL / LOOP / TASK / SESSION relationship and end-to-end goal granularity guidance;
- `distill` and `close` stay agent-performed operations;
- source version and published release recorded as separate facts: documents link to GitHub Releases and npm instead of hard-coding unpublished assets, and `CITATION.cff` carries `date-released` only once the release exists;
- compatibility matrix carries evidence type and last-verified date per platform.

Repository:

- smaller root surface: `COMPATIBILITY.md`, `DISTRIBUTION.md` and `EVALUATION.md` moved under `docs/`, `BENCHMARK_PROTOCOL.md` to `benchmarks/PROTOCOL.md`, the adversarial validation record to `research/`; README rewritten as the single entry point with a repository map; CONTRIBUTING rewritten as the contributor path;
- stale tracked archive `dist/ppgp-v0.1.zip` removed; generated release archives ignored;
- CI push filter reduced to `main`; workflow inputs describe versions generically;
- the v0.2.0 concurrency proposal retired to branch `research/v0.2-concurrency-experiment`.

Tests:

- `test/hardening.test.js` with fixtures derived from the adversarial validation: happy path, realistic canonical/SCP-style/OCPDF-style files, implemented-not-deployed, observation window, scoped blocker, malformed and contradictory state, nested-directory invocation, branch visibility, forced replacement backup, minimal repository, skill install.

This release was maintainer-tested and adversarially exercised under documented scenarios. It makes no universality, superiority or formal-verification claim.

## 0.1.2 - 2026-08-26

Version-consistency and release-hardening patch.

Includes:

- one canonical current version, `0.1.2`, across the specification, npm package, versioned adapters, Agent Skill metadata, citation metadata and public documentation;
- CLI `status` and `handoff` protocol headers derived from `package.json` instead of a hard-coded `PPGP/0.1` value;
- current README download text and asset links normalized to `ppgp-v0.1.2.zip`;
- removal of the stale protocol-level `ppgp-v0.1.zip` alias from future release generation;
- explicit separation between historical release numbers, benchmark schema versions and the current PPGP release version;
- automated version-consistency assertions to prevent future documentation/package drift.

This patch does not change the continuity model introduced in the experimental line. It makes the current release identity internally consistent and machine-checked.

## 0.1.1 - 2026-08-26

Historical package and distribution release.

Includes:

- Claude Code plugin + self-hosted marketplace packaging;
- OpenAI Codex plugin + repository marketplace metadata;
- Google Gemini CLI extension manifest;
- open Agent Plugin manifest for compatible clients such as Cursor;
- generated `.agents/skills/ppgp/` compatibility mirror with drift tests;
- canonical project identity and evidence-status metadata inside the Agent Skill;
- explicit `ACTIVE_GOAL` hot-state recovery semantics;
- falsifiable recovery evaluation cases;
- paired A/B benchmark protocol, machine-readable result schema, reporter, and deterministic Pilot 01 fixture/materializer;
- npm payload hardening so benchmark tooling is actually shipped;
- a guarded GitHub Release gate and downstream package-publication workflows.

At this historical point the package/adapters used `0.1.1` while several protocol-facing texts and CLI headers still identified the protocol as `0.1`. That version drift is explicitly corrected in 0.1.2.

## 0.1 - 2026-08-24

First public experimental release of the Portable Persistent Goal Protocol.

Includes:

- vendor-neutral PPGP specification;
- hierarchical repository-visible memory roles;
- THINK / FREEZE / EXECUTE / HARDEN / SHIP / DISTILL lifecycle;
- RETRIEVE / ACT / VERIFY / DELTA inner loop;
- compact recovery and handoff rules;
- human-authority blocker classification;
- conditional multi-agent rule;
- distillation and ACTIVE_GOAL garbage collection;
- Agent Skills-compatible `ppgp` skill;
- `init`, `goal`, `status`, `handoff`, `distill`, and `close` operations.

No performance or universality benchmark claim was made in v0.1.
