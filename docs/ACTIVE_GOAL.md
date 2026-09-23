# ACTIVE_GOAL

## GOAL
Make PPGP v0.1.3 genuinely release-ready on PR #12: reconcile source-version vs published-release truth everywhere, restore 13-field ACTIVE_GOAL conformance semantics in CLI/spec/docs/tests, remove stale artifacts and branch references, date compatibility evidence, reorganize the repository surface so users, contributors and researchers each have a short path, and clean misleading GitHub surface state (branches, PR #10, description, topics, settings). No merge, tag, release or publish.

## WHY
Owner review of PR #12 (f98263e) found competing truths: README/DISTRIBUTION/CITATION claim 0.1.3 as published while npm and GitHub Releases are at 0.1.2; the hardening weakened conformance to GOAL+NEXT to satisfy the parser; `dist/ppgp-v0.1.zip`, a dead CI branch filter, undated compatibility claims, ten merged branches and a "v0.2.0 release candidate" PR #10 make the public repository tell several stories at once.

## PHASE
HARDEN

## DEFINITION_OF_DONE
1. Source vs published: README, docs/DISTRIBUTION.md, CITATION.cff, ROADMAP, SPEC header say "source/candidate 0.1.3" and point to GitHub Releases / npm for the published version via durable links; no `ppgp-v0.1.3.zip`, `@0.1.3` install example or release date exists anywhere active. Publication-failure simulation answer: NO false claim.
2. Conformance: CONFORMANT = all 13 canonical fields; PARTIAL = some PPGP state recognized but canonical fields missing; MALFORMED = no usable structure; MISSING = no file. Exit 0/2/1. bin, SPEC §3.4, README, SKILL, PPGP.md, CHANGELOG, tests updated; SCP-style and OCPDF-style fixtures expect partial/exit 2.
3. Version-consistency test enforces: source artifacts agree on package.json version; CHANGELOG has `## <version> - candidate` or a date; CITATION date-released present only when the CHANGELOG entry is dated; no active doc hard-codes `ppgp-v<version>.zip` or `@<version>` install lines.
4. `dist/ppgp-v0.1.zip` removed, `dist/` gone, `.gitignore` guards generated release archives without breaking the release workflow.
5. CI workflow push filter = `[main]`; workflow input descriptions timeless; release-notes paths correct after moves.
6. docs/COMPATIBILITY.md matrix carries Status, Evidence type, Last verified (dates from Git history; client versions "not recorded"); "Current state after this iteration" replaced by an evidence-based snapshot.
7. Information architecture: root reduced to README, SPEC, CONTRIBUTING, CHANGELOG, ROADMAP, LICENSE, CITATION.cff, package.json + machine manifests; COMPATIBILITY/DISTRIBUTION/EVALUATION under docs/, BENCHMARK_PROTOCOL under benchmarks/, ADVERSARIAL_VALIDATION under research/ with a research index; every reference updated; npm package files list updated; README is the single front door with a repository map; CONTRIBUTING gives the contributor path.
8. Supersession audit over the tree: every occurrence of version strings/"current release"/archive names classified; no stale active claim remains.
9. GitHub: ten merged branches deleted after 0-unique verification; `fix/release-downstream-trigger` deleted (placeholder + superseded wording only); `feat/ppgp-v0.2.0-concurrency` preserved as `research/v0.2-concurrency-experiment` at af5a2da, PR #10 commented and closed, old branch deleted; delete_branch_on_merge=true; description and topics set; empty wiki/projects disabled; main protection state reported only.
10. ROADMAP: one future (v0.1.3 candidate → review → release), v0.2 as preserved research.
11. PR #12 body rewritten; npm test, installed-cli, npm pack --dry-run green; CI green on ubuntu + windows.
12. Three-persona reading test (user, contributor, researcher) passes from README alone plus at most one link.

## FROZEN_DECISIONS
- Protocol semantics unchanged; "13 fields = conformant" is the v0.1.2 meaning restored, not a new rule.
- Durable links only for published artifacts: `releases/latest`, `npmjs.com/package/@fatboy-coder/ppgp`.
- CITATION keeps `version: "0.1.3"` (source identity) and drops `date-released` until a release exists.
- Moves: COMPATIBILITY.md→docs/, DISTRIBUTION.md→docs/, EVALUATION.md→docs/, BENCHMARK_PROTOCOL.md→benchmarks/PROTOCOL.md, ADVERSARIAL_VALIDATION.md→research/2026-09-23-adversarial-validation.md. SPEC, CHANGELOG, ROADMAP, CONTRIBUTING, CITATION, README stay at root (public links, package, citation).
- Machine manifests stay at root (format-mandated). Historical CHANGELOG text untouched.
- Branch deletions only after `git rev-list origin/main..<branch>` review; v0.2 preserved before any deletion.
- No branch protection changes.

## INVARIANTS
- Every valid v0.1.2 canonical ACTIVE_GOAL still parses as conformant, exit 0.
- Handoff packet shape unchanged.
- No merge to main, no tag, no release, no publish.
- Skill mirrors byte-identical to skills/ppgp/.
- This file is deleted at verified closure.

## VERIFIED_CURRENT_STATE
- Branch release/harden-0.1.3 at f98263e = origin, clean before this goal; main f7858d8 = origin/main; PR #12 open, CI green; PR #10 draft open at af5a2da.
- Published: GitHub Release latest v0.1.2; npm latest 0.1.2.
- Repo settings: deleteBranchOnMerge=false, wiki enabled (no wiki content), projects enabled (classic API 404), discussions off, homepage empty, description "Portable continuity protocol for long-running coding agents. Experimental and vendor-neutral.", topics agent-memory/agent-skill-repository/agent-skills/agentic-workflow/ai-agents/coding-agents/llm-agents/open-protocol. main not protected, no rulesets.
- Remote branches: 10 merged-PR branches; fix/release-downstream-trigger 4 unique commits = placeholder file + superseded release-note wording; distribution/adapters-v0.1 0 ahead/40 behind.
- dist/ppgp-v0.1.zip referenced by no workflow or test (only negative assertions).

## COMPLETED
- Preflight and this goal.
- DoD 2: bin severity conformant/partial/malformed on 13 fields; SPEC 3.4, SKILL, PPGP.md, README, CHANGELOG, hardening tests updated (SCP/OCPDF fixtures partial/exit 2).
- DoD 1,3: README/DISTRIBUTION/CITATION/SPEC/ROADMAP source-vs-published; cli.test.js enforces candidate/date + no unpublished asset names.
- DoD 4,5: dist removed, .gitignore, test.yml filter [main], timeless workflow inputs, release-notes paths, issue-template placeholders.
- DoD 6: docs/COMPATIBILITY.md dated matrix + verification snapshot.
- DoD 7: moves to docs/, benchmarks/PROTOCOL.md, research/; research/README.md; README front door + map; CONTRIBUTING path.
- DoD 8: supersession audit: only source-version identity strings and benchmark schema versions remain outside CHANGELOG/research.
- DoD 9 (part): research/v0.2-concurrency-experiment pushed at af5a2da (verified ls-remote); description, topics, delete_branch_on_merge=true, wiki/projects disabled.
- DoD 10: ROADMAP single future.

## REMAINING
- DoD 9 rest: PR #10 comment + close, delete feat/ppgp-v0.2.0-concurrency and 11 stale branches.
- DoD 11: PR #12 body, push, CI green.
- DoD 12: persona test; publication-failure simulation on the resulting tree; close.

## BLOCKERS
- None.

## HUMAN_AUTHORITY_REQUIRED
- Merge PR #12, tag, release, publish, branch protection: owner.

## VERIFICATION_EVIDENCE
- Preflight 2026-09-23: gh pr list, gh release list, npm view, gh repo view, git rev-list per branch (recorded above).
- npm test (4 suites) + installed-cli smoke (win32) green on the remediated tree; npm pack --dry-run 24 files, 36.9 kB, docs/EVALUATION.md + benchmarks/PROTOCOL.md shipped, no fixtures/research.
- gh repo view after edit: deleteBranchOnMerge=true, wiki=false, projects=false, description + 8 topics as specified.

## NEXT_EXECUTABLE_ACTION
- Commit and push; close PR #10 with comment; delete stale branches; rewrite PR #12 body; watch CI.
