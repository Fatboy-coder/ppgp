# PPGP v0.1.2 Adversarial Validation — 2026-09-23

Status: maintainer-run validation record. Non-normative.

This document records an adversarial evaluation of the published `@fatboy-coder/ppgp@0.1.2` release. It does not change the PPGP specification and should not be interpreted as independent peer review, proof of universal correctness, or a performance superiority claim.

## Purpose

The validation was run after a broader reality audit raised possible extensions such as explicit project identities, missions, targets, dependency primitives, richer lifecycle states, gates, waits and completion levels.

Instead of adopting those proposals, the test rule was:

> No new protocol primitive without a demonstrated failure of the existing model.

PPGP v0.1.2 was therefore exercised first as published.

## System under test

- Package: `@fatboy-coder/ppgp@0.1.2`
- Release/tag: `v0.1.2`
- Test date: 2026-09-23
- Environment: Windows 11, Node 22, throwaway Git repositories
- Real repositories used read-only for selected cases: OneClickPDF and Search Control Plane
- Published package CLI and specification were treated as the system under test

## Adversarial scenarios

The campaign covered:

1. documented happy path;
2. complete conversational-context loss;
3. agent-to-agent handoff;
4. interruption at multiple execution stages;
5. implementation complete with deployment forbidden;
6. external 28-day observation window;
7. single-active-goal stress;
8. multiple isolated projects;
9. cross-project OCPDF/SCP dependency;
10. project-versus-managed-target terminology;
11. goal-versus-mission decomposition;
12. stale evidence/documentation;
13. false completion;
14. blocker scope;
15. dirty Git / branch / detached HEAD / worktree conditions;
16. malformed or contradictory PPGP state;
17. PPGP self-hosting / historical branch recovery;
18. minimal-project ceremony.

## Result

No reproducible **core protocol semantic failure** was demonstrated.

Seventeen of the eighteen scenarios produced a usable classification without requiring a new PPGP primitive. The self-hosting scenario could establish that v0.1.2 state would have improved deterministic recovery, but the historical reason why the abandoned work stopped had never been recorded, so that part remained inconclusive.

This result is intentionally narrow. It establishes only that the tested v0.1.2 model survived these scenarios under the recorded conditions.

## Capabilities demonstrated

The tests provided evidence for the following properties under the tested conditions:

- repository-local state remained isolated across independent projects;
- a fresh agent could recover meaningful active-goal state after conversational context loss;
- all tested interruption stages were recoverable using repository-visible state plus ordinary repository inspection;
- "implemented but not deployed" and long external observation windows were representable without new lifecycle primitives;
- cross-project ownership, dependency and evidence could be expressed unambiguously through ordinary prose and repository/commit references;
- numbered Definition-of-Done items were sufficient for the tested subtask/mission cases;
- scoped blockers could be represented in prose;
- the one-active-goal constraint did not produce a demonstrated correctness failure and appeared to reduce work-in-progress ambiguity in the tested workflows.

## Proposed primitives not justified by this campaign

The campaign did **not** demonstrate a need to add the following to the PPGP core:

- `RUN_STATE`;
- Definition-of-Done completion levels;
- first-class `GATE` / `STOP`;
- first-class scoped `WAIT`;
- `DEPENDS_ON`;
- `TARGET`;
- `MISSION`;
- goal registry;
- global workspace identity.

Project slugs and a dedicated `CURRENT_STATE` role remain unproven rather than rejected.

These findings do not forbid future evolution. A future reproducible failure may justify revisiting any of them.

## Actionable findings

The strongest failures were in tooling and documentation rather than protocol semantics.

### CLI parser / validation

The published CLI failed to parse the real PPGP files examined in both OneClickPDF and Search Control Plane, returning unset fields while exiting successfully.

Malformed, incomplete, duplicated or contradictory state also produced little or no diagnostic feedback.

This is a tooling/conformance problem and should be hardened without changing the core continuity model.

### Repository root detection

The CLI currently behaves relative to the working directory rather than consistently resolving the Git top-level repository root. This can produce misleading behavior when invoked from a nested directory.

### Branch visibility

An `ACTIVE_GOAL` committed only on a feature branch is invisible from the default branch. Current documentation does not define which ref should be treated as canonical for discovering active state. This can create a duplicate-goal risk.

### Documentation clarifications

The campaign identified documentation work around:

- exact header shape expected by the CLI;
- branch/ref visibility of active state;
- the fact that a handoff packet is not a substitute for complete repository state;
- a simple parking convention for temporarily deferred goals;
- explicit prose for blocker scope.

## Release implication

The current official release remains **v0.1.2**.

The evidence supports a **v0.1.3 hardening candidate** focused on implementation reliability and documentation, not a semantic redesign.

Candidate scope:

- tolerant and explicit parser behavior;
- warnings for malformed or contradictory state;
- Git top-level repository resolution;
- branch visibility diagnostics in `doctor`;
- safer destructive/overwrite behavior such as backup before forced replacement;
- documentation clarifications identified above;
- regression coverage derived from the adversarial fixtures.

A v0.1.3 release becomes official only after implementation, tests, version consistency, tag/release creation and package publication complete successfully.

## Relationship to the v0.2.0 concurrency proposal

The existing v0.2.0 concurrency work remains research/proposal material. This validation campaign did not reproduce a core semantic failure requiring its richer coordination model.

It should therefore not be treated as the default successor to v0.1.2 without new evidence demonstrating necessity.

## Methodological rule going forward

PPGP evolution should remain falsification-driven:

1. reproduce a real failure;
2. distinguish protocol failure from tooling, documentation, project convention or operator error;
3. try the existing model first;
4. make the smallest change that resolves the demonstrated failure;
5. rerun the adversarial regression suite.

A passing scenario is evidence to preserve the current design, not an invitation to add another abstraction.
