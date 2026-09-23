# PPGP Specification v0.1.3

Status: Experimental / Provisional  
First published: 2026-08-24  
Source version: 0.1.3 (see package.json); published releases: https://github.com/Fatboy-coder/ppgp/releases  
Protocol: Portable Persistent Goal Protocol (PPGP)

## 1. Scope

PPGP defines a portable continuity protocol for long-running coding-agent work.

A conforming implementation SHOULD allow a fresh compatible agent to recover an active software goal without requiring the human operator to reconstruct the previous conversation.

PPGP is model-vendor neutral and repository-oriented.

## 2. Normative language

The terms MUST, MUST NOT, SHOULD, SHOULD NOT and MAY describe protocol requirements and recommendations.

## 3. Logical memory roles

PPGP defines logical roles, not mandatory filenames.

### 3.1 CONSTITUTION

Long-lived mission, authority, invariants and non-negotiable project constraints.

It SHOULD change rarely.

### 3.2 ROADMAP

Current project direction, completed goals, future goals, dependencies and deferred work.

It SHOULD describe state and direction, not preserve a full execution diary.

#### Parking deferred work

PPGP keeps exactly one ACTIVE_GOAL. When a substantial goal must yield to more urgent work without being closed or abandoned, park it instead of keeping two active goals:

1. bring the current ACTIVE_GOAL to verified truth (VERIFIED_CURRENT_STATE, COMPLETED, REMAINING, BLOCKERS, NEXT_EXECUTABLE_ACTION);
2. record it under ROADMAP as deferred work with a one-line resume condition and a reference to where its full state is preserved (the last commit that contained it, or a dated file in ordinary project documentation);
3. remove or replace ACTIVE_GOAL for the new goal;
4. when resuming, re-instantiate ACTIVE_GOAL from the preserved state and re-verify VERIFIED_CURRENT_STATE before continuing.

A parked goal is neither active nor closed. ROADMAP holds the pointer, not the diary. This convention needs no registry and preserves one ACTIVE_GOAL, low work-in-progress, explicit deferred work and deterministic recovery.

### 3.3 MEMORY

Durable facts that future agents would otherwise need to rediscover.

Good candidates include architectural decisions, non-obvious invariants, validated operational facts, expensive failed approaches worth avoiding, durable repository conventions, authority decisions and recurring failure modes.

A MEMORY item SHOULD change future behavior.

### 3.4 ACTIVE_GOAL

Temporary working memory for exactly one active goal.

It SHOULD remain compact enough for a fresh agent to recover the goal in one read.

Minimum fields:

```text
GOAL
WHY
PHASE
DEFINITION_OF_DONE
FROZEN_DECISIONS
INVARIANTS
VERIFIED_CURRENT_STATE
COMPLETED
REMAINING
BLOCKERS
HUMAN_AUTHORITY_REQUIRED
VERIFICATION_EVIDENCE
NEXT_EXECUTABLE_ACTION
```

ACTIVE_GOAL is the primary repository-visible hot state for recovery of unfinished work.

A fresh agent SHOULD be able to recover an active goal from current ACTIVE_GOAL plus selectively relevant durable state and evidence without requiring a prior `distill` operation.

Implementations SHOULD update ACTIVE_GOAL after material state changes often enough that abrupt interruption does not force substantial human reconstruction or unnecessary repetition of verified work.

PPGP does not require persistence after every trivial action. Checkpoint frequency is implementation-dependent and SHOULD balance recovery fidelity against state-maintenance overhead.

ACTIVE_GOAL MUST NOT become the permanent chronological history.

ACTIVE_GOAL MUST be removed after successful closure and distillation.

#### Machine-readable shape

ACTIVE_GOAL is written for humans and agents first. The reference CLI recognizes a field when its name appears as:

```text
a Markdown header at any level      ## GOAL          ### Definition of Done
a bold-only line                    **GOAL**
an upper-case key starting a line   GOAL: text       FROZEN_DECISIONS:
```

Names are matched case-insensitively; spaces and hyphens are treated as underscores. A small alias set is accepted (`CURRENT_PHASE`, `DOD`, `NEXT`/`NEXT_ACTION`, `AUTHORITY`, `EVIDENCE`, and any header containing `NEXT`). Sections with other names are retained and reported, never silently discarded. If a field appears twice, the first occurrence is used and a warning is emitted.

Tolerant reading does not weaken conformance. An ACTIVE_GOAL is **conformant** only when all thirteen minimum fields above are present. A tool MUST distinguish:

```text
CONFORMANT   all thirteen canonical fields present
PARTIAL      PPGP state recognized, but one or more canonical fields missing; each missing field named
MALFORMED    no usable PPGP structure: empty, unreadable, or without any recognizable field
MISSING      no ACTIVE_GOAL file
```

and MUST NOT report partial, malformed or missing state as healthy. GOAL and NEXT_EXECUTABLE_ACTION are useful recovery anchors in a partial file; they are not sufficient for conformance. The reference CLI exits 0 for conformant state (warnings allowed), 2 for partial state and 1 for malformed or missing state.

### 3.5 GIT / FORENSIC HISTORY

Git or the repository's equivalent history is the forensic record of what actually changed.

PPGP memory SHOULD preserve meaning and current state rather than duplicating Git chronology.

## 4. Goal lifecycle

A substantial PPGP goal follows:

```text
THINK -> FREEZE -> EXECUTE -> HARDEN -> SHIP -> DISTILL -> CLOSED
```

### Goal granularity

A substantial PPGP goal SHOULD describe a meaningful end-to-end outcome rather than a single implementation step. Prefer "deliver production-ready artifact chaining with verified behavior" over "change function X". Do not make the goal so large that its Definition of Done becomes vague. A useful heuristic:

> the largest independently meaningful end-to-end outcome that remains objectively verifiable and safely pursuable by the agent.

This is guidance, not a normative field. Sub-steps belong in DEFINITION_OF_DONE, COMPLETED and REMAINING, not in separate goals.

### THINK

Inspect, research, compare alternatives and determine an executable strategy.

### FREEZE

Record the selected strategy, critical invariants, Definition of Done and authority boundaries.

After FREEZE, an agent SHOULD NOT reopen strategy merely because another agent would have chosen differently.

Replanning is justified when new evidence materially invalidates a frozen assumption.

### EXECUTE

Perform the work autonomously within the frozen strategy and delegated authority.

### HARDEN

Attack the implementation through tests, edge cases, security review, independent review or other relevant verification.

HARDEN improves the selected solution. It is not a default invitation to redesign it.

### SHIP

Verify the implementation in the environment required by the Definition of Done.

When production behavior is part of the Definition of Done, local success alone MUST NOT close the goal.

### DISTILL

Move durable information into ROADMAP, MEMORY or CONSTITUTION as appropriate.

Discard temporary chronology and redundant execution detail.

DISTILL is a consolidation and garbage-collection phase. It is not the primary survival mechanism for an unfinished goal.

If a session is interrupted before DISTILL, current ACTIVE_GOAL state SHOULD still be sufficient to recover the active goal when combined with relevant repository evidence.

### CLOSED

A goal is CLOSED only after synchronous Definition-of-Done requirements are verified and temporary working memory has been garbage-collected.

## 5. Inner execution loop

Inside a goal, implementations SHOULD use:

```text
RETRIEVE -> ACT -> VERIFY -> DELTA
```

### RETRIEVE

Load only the state and evidence relevant to the current decision.

### ACT

Perform the next bounded action.

### VERIFY

Check observable evidence rather than relying on model confidence.

### DELTA

Record only material state changes needed for continuation.

A DELTA SHOULD update repository-visible hot state when the change would materially affect recovery after interruption.

The loop repeats until the current phase exit condition is met.

### Goal, loop, task and session

These terms are already implicit in PPGP and are clarified here without adding fields or commands:

```text
GOAL     durable, meaningful, verifiable end-to-end outcome (ACTIVE_GOAL)
LOOP     RETRIEVE -> ACT -> VERIFY -> DELTA, repeated while pursuing the goal
TASK     disposable implementation decomposition chosen during execution
SESSION  replaceable execution container (one conversation, one agent run)
```

The invariant is that the GOAL survives loops and sessions. A loop may stop because of context exhaustion, session replacement, temporary interruption, a budget boundary or a legitimate authority blocker without destroying the durable goal. Tasks are recorded only insofar as COMPLETED, REMAINING and NEXT_EXECUTABLE_ACTION need them for recovery.

## 6. Boot and recovery

A fresh agent SHOULD start from a minimal boot packet:

```text
GOAL_CONTRACT
+ HOT_STATE
+ RELEVANT_MEMORY
+ RELEVANT_EVIDENCE
```

The implementation SHOULD avoid loading the complete project history unless required.

A recovery sequence SHOULD inspect, as relevant:

1. repository agent instructions;
2. ACTIVE_GOAL;
3. selectively relevant durable memory;
4. `git status`;
5. recent relevant commits;
6. verification evidence;
7. NEXT_EXECUTABLE_ACTION.

If ACTIVE_GOAL says the strategy is frozen, recovery SHOULD resume execution rather than restart THINK by default.

Abrupt interruption before DISTILL MUST NOT by itself be treated as loss of the active goal if current repository-visible hot state exists.

### Visibility across refs

ACTIVE_GOAL is discovered on the checked-out ref. Goal state committed only on another branch is invisible from the integration branch, and a fresh agent booting there may wrongly conclude that no goal is active.

When a goal's ACTIVE_GOAL lives on a topic branch, the integration branch's ROADMAP SHOULD name that branch. A Git-aware tool MAY list other refs that carry an ACTIVE_GOAL, but MUST NOT switch branches, merge, or assume that such a file is current. The agent verifies currency before treating it as the active goal.

## 7. Evidence precedence

When technical claims conflict, implementations SHOULD prefer more direct evidence.

A useful default order is:

```text
production/runtime behavior
> automated verification
> current repository implementation
> Git history
> ACTIVE_GOAL
> durable MEMORY
> ROADMAP
> conversation claims
> agent recollection
```

CONSTITUTION remains authoritative for project policy and authority, but technical documentation MUST be corrected when contradicted by observable reality.

## 8. Blocker classification

PPGP uses four blocker classes.

### A. Agent-solvable

Reversible technical or implementation problem.

Action: solve autonomously.

### B. External asynchronous

Propagation, crawler refresh, external processing or another event that may complete later.

Action: record it. Do not block synchronous goal closure unless the Definition of Done explicitly requires it.

### C. Authority boundary

Requires human/product/legal/financial/account authority.

Action: escalate with the smallest decision required.

### D. Hard dependency

Required information or resource is genuinely unavailable and no safe autonomous path exists.

Action: escalate only after autonomous alternatives are exhausted.

Agents MUST NOT promote routine Type A decisions to Type C solely to avoid responsibility.

### Blocker scope

A blocker applies to the smallest true scope, not automatically to the whole goal. State the scope in prose inside BLOCKERS and keep REMAINING and NEXT_EXECUTABLE_ACTION pointing at work that is still safe:

```text
BLOCKERS
- Step A only: Type C authority. Owner must provision the provider key. Steps B and C are NOT blocked.

NEXT_EXECUTABLE_ACTION
- Step B: port templates/welcome.html to the adapter and add a snapshot test.
```

An agent SHOULD continue independent safe work before escalating a scoped blocker. No additional structure is required.

## 9. Human interruption policy

The default is agent autonomy inside established authority.

Human escalation SHOULD be reserved for matters such as irreversible destructive actions, legal or financial commitments, unavailable credentials or external authorization, genuinely ambiguous product policy, brand or governance authority, material changes to frozen architecture, and actions outside delegated permissions.

Routine debugging, reversible refactors, test failures and ordinary implementation choices SHOULD NOT require human interruption.

## 10. Multi-agent policy

PPGP does not require multiple agents.

A second agent SHOULD be introduced only when its expected independent information gain exceeds communication and coordination cost.

Useful examples include adversarial review, security review, linguistic review, architecture challenge and independent verification.

A reviewer SHOULD receive the artifact, requirements and relevant facts without unnecessary exposure to the implementer's self-assessment.

## 11. Handoff format

Handoffs SHOULD prefer compact structured state or deltas over narrative transcripts.

Example:

```text
PPGP/0.1.3
G=8
P=HARDEN

F:
strategy=frozen
seo_ready=page

D:
ja_review=PASS
tests=PASS

B:
master_text=AUTH

E:
commit=8f3d55b

N:
review_de
ship
```

The exact encoding is not normative.

The invariant is that the handoff remain unambiguous, portable, auditable and cheaper than replaying the conversation.

Opaque model-specific gibberish is NOT required for PPGP conformance.

A handoff packet is a compact transfer signal, not a replacement for repository-visible PPGP state. It deliberately omits WHY, DEFINITION_OF_DONE, INVARIANTS, REMAINING and HUMAN_AUTHORITY_REQUIRED. A receiving agent SHOULD normally have the repository, the current ACTIVE_GOAL and the packet; the packet alone is not sufficient for safe continuation. Do not expand the packet into a full context dump; update ACTIVE_GOAL instead.

## 12. Distillation and garbage collection

Before closing a goal, every material ACTIVE_GOAL fact SHOULD be classified:

```text
strategic authority/invariant -> CONSTITUTION
current/future direction      -> ROADMAP
durable reusable lesson       -> MEMORY
temporary execution detail    -> discard
```

Git remains the detailed forensic archive.

Failure to distill MAY increase long-term state noise or rediscovery cost, but it SHOULD NOT make a still-active, correctly checkpointed goal unrecoverable.

After successful distillation, ACTIVE_GOAL MUST be deleted.

## 13. Suggested operational metrics

Implementations MAY measure:

- HIG: Human Interruptions per Completed Goal.
- TPG: Tokens per Completed Goal.
- RSR: Recovery Success Rate.
- VWR: Verified Work Rate.
- MCR: Memory Compression Ratio.

PPGP v0.1.3 defines these metrics but makes no benchmark claim.

## 14. Interoperability

A PPGP implementation MUST NOT require a specific model provider.

It MAY integrate with native model compaction, Agent Skills, MCP, vector or semantic retrieval, IDE-specific hooks, provider-specific memory, and multi-agent orchestration.

Such integrations are optional accelerators. The repository-visible control state SHOULD remain sufficient for recovery by another compatible agent.

## 15. Reference file mapping

PPGP logical roles may be mapped to existing project documents.

A common mapping is:

```text
CONSTITUTION -> docs/MASTER.md
ROADMAP      -> docs/ROADMAP.md
MEMORY       -> docs/PROJECT_MEMORY.md
ACTIVE_GOAL  -> docs/ACTIVE_GOAL.md
FORENSICS    -> Git
```

Implementations SHOULD reuse equivalent existing documents instead of creating duplicate sources of truth.

## 16. Conformance test

A useful PPGP recovery test is:

1. Agent A begins a substantial goal.
2. Agent A records current ACTIVE_GOAL state after at least one material verified change.
3. Context is compacted, lost or deliberately removed before DISTILL.
4. Agent B starts without the prior conversation.
5. Agent B reads repository-visible PPGP state.
6. Agent B correctly identifies the goal, phase, frozen decisions, verified state, remaining work, blockers and next executable action.
7. Agent B continues without asking the human to reconstruct prior history.
8. The goal is eventually verified, distilled and closed.

A system that cannot pass this recovery test SHOULD NOT claim robust PPGP continuity.

Passing one recovery test demonstrates recovery under that tested condition only. It does not establish universal effectiveness or superiority.

## 17. Versioning

PPGP uses semantic specification versions.

v0.x releases are experimental and may change incompatibly.

The community is encouraged to report failures before the protocol is declared stable.
