# PPGP Roadmap

PPGP is currently experimental. The roadmap prioritizes evidence, portability and reduction of unnecessary protocol overhead.

## v0.1.2

Published as the current experimental line and available for public testing.

Current capabilities:

- portable repository-visible goal state;
- THINK, FREEZE, EXECUTE, HARDEN, SHIP, DISTILL lifecycle;
- RETRIEVE, ACT, VERIFY, DELTA inner loop;
- logical memory roles without mandatory filenames;
- explicit human-authority boundaries;
- compact handoff format;
- Agent Skills-compatible implementation;
- downloadable skill package;
- public specification, citation metadata and evaluation guide;
- explicit ACTIVE_GOAL hot-state recovery semantics;
- reproducible paired benchmark infrastructure.

### 2026-09-23 adversarial validation

A maintainer-run adversarial campaign tested the published v0.1.2 package across context loss, agent replacement, interruption recovery, long external waits, single-goal stress, independent projects, cross-project references, stale state, false completion, malformed state, Git/worktree conditions and minimal-project overhead.

No reproducible core protocol semantic failure was demonstrated in the tested scenarios.

The campaign instead identified implementation and documentation weaknesses, especially:

- CLI parsing/validation of real-world PPGP files;
- malformed-state diagnostics;
- repository-root resolution;
- branch/ref visibility of ACTIVE_GOAL state;
- a small set of documentation clarifications.

See [ADVERSARIAL_VALIDATION.md](./ADVERSARIAL_VALIDATION.md) for scope, limitations and findings.

This result is not a universality or superiority claim. It is a regression baseline for future changes.

## Next candidate: v0.1.3 hardening

v0.1.3 is the next planned release candidate. It is **not yet the current release**.

The intended scope is to harden the v0.1.2 implementation without changing its core continuity model:

- tolerant, explicit CLI parsing;
- warnings for malformed or contradictory state;
- Git top-level repository resolution;
- branch visibility diagnostics in `doctor`;
- safer overwrite/force behavior;
- documentation clarifications;
- regression tests derived from adversarial fixtures.

The release becomes official only after implementation, verification, version-consistency checks, tag/release creation and package publication.

## Next priorities

### Harden before extending

Prefer fixing demonstrated implementation or documentation failures over adding new protocol primitives.

A new core concept should require reproducible evidence that the existing v0.1.x model cannot safely express the workflow.

### Gather independent evidence

Collect recovery failures, successful replications, overhead reports and comparative evaluations from different repositories, agents and providers.

### Reduce protocol overhead

Identify fields, steps or rules that can be removed without reducing recovery quality.

### Test portability

Validate that the same repository-visible state can be interpreted consistently by materially different coding agents and environments.

### Clarify conformance

Refine the minimum requirements for claiming PPGP compatibility using observed implementation failures rather than theoretical completeness.

### Improve packaging

Keep installation simple across Agent Skills-compatible clients without making the portable core dependent on one vendor.

## Research branches and proposals

Richer coordination models, including the existing v0.2.0 concurrency proposal, remain research material until a reproducible core limitation demonstrates the need for them.

The 2026-09-23 adversarial validation did not establish such a requirement.

## Not planned as core requirements

PPGP does not plan to require:

- a specific model provider;
- MCP;
- vector databases or embeddings;
- a hosted service;
- multi-agent orchestration;
- proprietary infrastructure.

These may be useful optional integrations, but they should not become prerequisites for protocol conformance.

## Stability

A future `1.0` should require evidence that the core rules are sufficiently stable across multiple independent projects and environments.

No target date is assigned. Evidence, not calendar time, should determine promotion to a stable specification.
