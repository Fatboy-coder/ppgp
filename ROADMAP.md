# PPGP Roadmap

PPGP is experimental. The roadmap prioritizes evidence, portability and the removal of unnecessary protocol overhead. Published versions are listed on [GitHub Releases](https://github.com/Fatboy-coder/ppgp/releases); history is in `CHANGELOG.md`.

## Where things stand

The latest published release is v0.1.2 (2026-08-26). A maintainer-run adversarial campaign on 2026-09-23 exercised that package across context loss, agent replacement, interruption recovery, long external waits, single-goal stress, independent projects, cross-project references, stale state, false completion, malformed state, Git/worktree conditions and minimal-project overhead. No core protocol semantic failure was reproduced; the failures found were in the CLI and documentation. The record is `research/2026-09-23-adversarial-validation.md`. That result is a regression baseline, not a universality claim.

## v0.1.3 hardening candidate

The only release currently in flight. Implemented on branch `release/harden-0.1.3` (PR #12) and awaiting owner review; it becomes a published release only after the release workflow tags, publishes and chains the npm and GitHub Packages publication.

Scope, as implemented, hardens the v0.1.2 implementation without changing its continuity model:

- tolerant ACTIVE_GOAL parsing with strict thirteen-field conformance reporting;
- explicit conformant / partial / malformed / missing state and exit codes;
- warnings for missing fields, contradictory state and leftover scaffolding;
- Git top-level repository resolution;
- branch and working-tree summary and other-ref goal visibility in `doctor`;
- backup before forced goal replacement;
- documentation clarifications (parking, blocker scope, handoff packet, goal/loop/task/session, goal granularity, ref visibility);
- source-version versus published-release truth kept separate and test-enforced;
- regression suite derived from the adversarial fixtures;
- a smaller root surface: compatibility, distribution and evaluation guides under `docs/`, benchmark protocol under `benchmarks/`, evidence under `research/`.

Path: owner review → merge → release workflow → v0.1.3 listed on GitHub Releases and npm. The tree itself does not change at publication.

## After v0.1.3

Harden before extending. A new core concept requires reproducible evidence that the v0.1.x model cannot safely express a real workflow. Until then the priorities are:

- gather independent evidence: recovery failures, replications, overhead reports, comparative evaluations from other repositories, agents and providers;
- reduce protocol overhead: remove fields, steps or rules that do not improve recovery;
- test portability: the same repository-visible state interpreted consistently by materially different agents;
- clarify conformance from observed implementation failures rather than theoretical completeness;
- keep installation simple across Agent Skills-compatible clients without making the core depend on one vendor.

A `1.0` requires evidence that the core rules are stable across multiple independent projects and environments. No date is assigned.

## Preserved research, not a release path

A richer coordination model (portfolios, workstreams, execution leases, checkout claims, scoped waits, durability classes) was implemented in 2026-08 and is preserved unchanged on branch `research/v0.2-concurrency-experiment`. The 2026-09-23 validation did not reproduce a failure that requires it, so it is not the next release. It may be revisited if such a failure is reproduced.

## Not planned as core requirements

A specific model provider, MCP, vector databases or embeddings, a hosted service, multi-agent orchestration, proprietary infrastructure. These may be optional integrations; they will not become prerequisites for conformance.
