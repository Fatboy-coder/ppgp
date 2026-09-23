# ACTIVE_GOAL

## GOAL
Ship account-bound artifact chaining for the MCP tools to production.

## WHY
Intermediate base64 round-trips make multi-step agent workflows slow and expensive.

## PHASE
SHIP

## DEFINITION_OF_DONE
- All six MCP tools accept artifact_ref and delivery="artifact" (source + tests).
- Backend + MCP regression suite green.
- Change merged to main.
- Deployed to production and a live 5-step chained workflow succeeds against api.example.com.

## FROZEN_DECISIONS
- Base64 ingress stays supported.
- No arbitrary URL ingestion.

## INVARIANTS
- Production is NOT to be changed before the 2026-09-24 release window (owner decision, freeze on the search control plane).

## VERIFIED_CURRENT_STATE
- main at 5a64ed9 contains the full change; 1731 passed / 54 skipped / 0 failed (2026-09-18).
- Production still runs image c447695 (pre-change). Verified by reading the live container tag 2026-09-18, not from this file.

## COMPLETED
- DoD items 1-3: source, tests, merge.

## REMAINING
- DoD item 4: deploy + live chained-workflow acceptance. Not started.

## BLOCKERS
- Type B (external, dated): release window opens 2026-09-24; search-control-plane freeze must be lifted first.

## HUMAN_AUTHORITY_REQUIRED
- Production deployment. Do NOT deploy before the window; owner runs or explicitly delegates the runbook.

## VERIFICATION_EVIDENCE
- Test run 1731/54/0 at 5a64ed9 (2026-09-18 CI log #412).
- 12-call chained MCP dispatch against a local candidate container, zero intermediate base64 (docs/MCP_ARTIFACT_CHAINING.md).

## NEXT_EXECUTABLE_ACTION
- Nothing executable before 2026-09-24. On/after that date: run docs/SEPTEMBER_24_RUNBOOK.md from section 1.
