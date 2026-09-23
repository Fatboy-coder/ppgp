# ACTIVE_GOAL

## GOAL
Ship a PPGP v0.1.3 hardening candidate on branch `release/harden-0.1.3`: identical protocol semantics to v0.1.2, with a tolerant explicit CLI parser, malformed-state diagnostics, Git top-level root discovery, branch-visibility diagnostics in `doctor`, backup before forced goal replacement, documentation clarifications, and a regression suite derived from the 2026-09-23 adversarial fixtures. Ready for owner review; not merged, tagged or published.

## WHY
The 2026-09-23 adversarial validation (`ADVERSARIAL_VALIDATION.md`) found no core semantic failure in v0.1.2 but found that the published CLI parses none of the real ACTIVE_GOAL files in use (OneClickPDF, Search Control Plane), exits 0 on garbage, resolves root from cwd, and cannot see goals on other refs. `ROADMAP.md` commits to a v0.1.3 hardening candidate before any protocol extension.

## PHASE
SHIP

## DEFINITION_OF_DONE
1. `ppgp status`/`handoff` parse the canonical scaffold, an SCP-style `KEY:` file and an OCPDF-style free-header file without printing `(not set)` for every field while exiting 0; partially recognized files are reported as partial with the unrecognized sections named.
2. Parser contract documented in SPEC.md and the skill (accepted header forms, aliases, exit codes).
3. Diagnostics for: empty file, garbage, missing required sections, casing/level variants, duplicate sections, CLOSED phase inside an existing ACTIVE_GOAL, REMAINING non-empty with CLOSED, scaffold TODO placeholders. Warnings on stderr; exit 1 malformed, exit 2 partial, exit 0 otherwise.
4. Without `--root`, commands resolve the Git top-level from a nested cwd; outside Git, cwd is used.
5. `doctor` reports branch/HEAD/tracked-change count when Git is available, and when no ACTIVE_GOAL exists in the checkout lists other refs that carry one, without switching or merging.
6. `goal --force` writes a timestamped backup of the previous file before replacing it.
7. Documentation: handoff packet supplements state; parking convention via ROADMAP; blocker scope prose; GOAL/LOOP/TASK/SESSION relationship; E2E goal granularity guidance; ref-visibility rule. Skill mirrors synced.
8. `test/hardening.test.js` covers the eleven required regression areas using fixtures under `test/fixtures/`; existing tests unchanged in intent; `npm test` and `node test/installed-cli.test.js` green on Windows.
9. `npm pack --dry-run` clean; fixtures not shipped in the package.
10. Adversarial research harness re-run against the candidate CLI shows previous strengths intact and the tooling failures fixed.
11. Version 0.1.3 set consistently across all version-bearing artifacts; version-consistency test green. CHANGELOG entry written without claim inflation.
12. Branch pushed, PR opened against `main`, CI green. No merge, tag, release or publish.

## FROZEN_DECISIONS
- No new protocol primitive. No MISSION/TARGET/DEPENDS_ON/RUN_STATE/DoD levels/GATE/WAIT/registry/workspace identity/portfolio/concurrency.
- v0.2 branch and PR #10 untouched.
- Parser: accepts `#`-headers at any level, bold-only lines, and `KEY:` line starts; names matched case-insensitively after normalizing spaces/hyphens to underscores; small alias table (CURRENT_PHASE→PHASE, DOD→DEFINITION_OF_DONE, NEXT/NEXT_ACTION/headers containing NEXT→NEXT_EXECUTABLE_ACTION, AUTHORITY→HUMAN_AUTHORITY_REQUIRED, EVIDENCE→VERIFICATION_EVIDENCE). Unknown sections are retained and listed, never discarded silently. First occurrence wins on duplicates, with a warning.
- Required for non-partial status: GOAL and NEXT_EXECUTABLE_ACTION. Everything else missing is a warning.
- Exit codes: 0 ok (warnings allowed), 1 missing/malformed/error, 2 partial.
- Root discovery: explicit `--root` > `git rev-parse --show-toplevel` from cwd > cwd.
- Backups: `<file>.<UTC timestamp>.bak` beside the replaced file.
- Documentation changes clarify; they do not alter MUST/SHOULD rules of v0.1.2.
- Version bump is the last code change, after tests are green.
- Fixtures copied from `research/` (branch `research/ppgp-reality-audit`) with a provenance line; research branch itself not merged.

## INVARIANTS
- Every valid v0.1.2 repository (one `## SECTION` ACTIVE_GOAL) parses identically to before.
- `handoff` packet shape unchanged (`PPGP/<version>` + G/P/F/D/B/E/N).
- No command switches branches, merges, deletes or publishes.
- Skill mirrors (`.agents/`, `plugins/ppgp/`) stay byte-identical to `skills/ppgp/` (drift test).
- `docs/ACTIVE_GOAL.md` in this repository is this mission's state and must be deleted at closure after distill.

## VERIFIED_CURRENT_STATE
- Branch `release/harden-0.1.3` created from `main` = `f7858d8` (local main fast-forwarded from 92c951d; was 60 behind, 0 ahead). Working tree clean before this file.
- `package.json` 0.1.2; npm latest 0.1.2; `npm test` green on f7858d8 (cli/version/distribution, benchmark, package).
- `bin/ppgp.js` is 203 lines; parser is `^##\s+([A-Z_]+)\s*$`, last duplicate wins, root = `--root` or cwd.
- Research evidence at `research/` on branch `research/ppgp-reality-audit` (commits a46bc73, 4235b0c): 10 fixtures, 2 harness scripts, captured outputs.

## COMPLETED
- Preflight, fast-forward, branch creation, goal file (d285d9a).
- DoD 1-10: parser, diagnostics, root discovery, doctor ref visibility + git summary, force backup, docs (SPEC/skill/reference/README/CHANGELOG), mirrors synced, hardening suite (9 blocks, 12 fixtures), adversarial harness re-run against candidate CLI (all tooling failures fixed; unknown distill/close unchanged by design).
- DoD 11: version 0.1.3 set in 15 files + mirrors (commit 1381188); npm test, installed-cli smoke (win32) and npm pack --dry-run (24 files, 38.2 kB, no fixtures) green.

## REMAINING
- DoD 12: push branch, open PR, CI green on ubuntu + windows.
- Closure: self-hosting evidence in final report, distill durable lessons, delete this file (after owner review decision, since the branch is under review).

## BLOCKERS
- None. Merge/tag/release/publish are owner-only by mission mandate (not blockers for this goal's DoD).

## HUMAN_AUTHORITY_REQUIRED
- Merge to main, tag v0.1.3, GitHub Release, npm publish: owner only, after review.

## VERIFICATION_EVIDENCE
- `npm test` on f7858d8: 3 suites passed (baseline).
- `npm test` on candidate (post-commit 1): cli/version/distribution, hardening, benchmark, package all passed.
- Adversarial harness re-run (research/tests/run-adversarial.sh with PPGP_CLI=bin/ppgp.js): empty/garbage exit 1, missing sections exit 2, CLOSED-with-file warned, nested docs/ cwd resolves repo root, doctor prints branch/HEAD/dirty count.
- Real files: OCPDF docs/ACTIVE_GOAL.md -> partial, exit 2, 3 unrecognized sections listed, NEXT recovered; SCP docs/ACTIVE_GOAL.md -> ok, exit 0, GOAL/PHASE/FROZEN/DoD/NEXT recovered, PRODUCT_DIRECTION + RESIDUAL_LIMITATIONS retained.

## NEXT_EXECUTABLE_ACTION
- Push `release/harden-0.1.3`, open PR against main, watch CI (ubuntu + windows). If green: report READY FOR OWNER REVIEW. Owner decides merge; this file is deleted at closure after distill.
