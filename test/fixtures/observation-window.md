# ACTIVE_GOAL

## GOAL
Growth telemetry produces at least one MEDIUM-sufficiency opportunity after a full 28-day window in production.

## WHY
Opportunities read from less than 28 days of data are LOW sufficiency by definition; decisions need a mature window.

## PHASE
SHIP

## DEFINITION_OF_DONE
- Telemetry enabled in production (done 2026-09-25).
- 28 consecutive days of ingest with zero DEAD outbox rows.
- On or after 2026-10-23: `growth opportunities` lists >= 1 opportunity at MEDIUM or higher.

## FROZEN_DECISIONS
- No cost-model edits during the window (would invalidate comparability).

## INVARIANTS
- Do not read any opportunity as more than LOW before 2026-10-23.

## VERIFIED_CURRENT_STATE
- Enabled 2026-09-25 10:00 UTC; /health shows enabled=true configured=true dead=0 (observed 2026-09-25).

## COMPLETED
- DoD item 1.

## REMAINING
- DoD items 2-3 (time-gated).

## BLOCKERS
- Type B external asynchronous: elapsed time until 2026-10-23. Not agent-solvable.

## HUMAN_AUTHORITY_REQUIRED
- None.

## VERIFICATION_EVIDENCE
- /health snapshot 2026-09-25 (ops/evidence/health-20260925.json).

## NEXT_EXECUTABLE_ACTION
- Before 2026-10-23: nothing for this goal. Weekly: check /health dead==0 and record it here. Unrelated work may proceed on other branches; this file stays as is.
- On/after 2026-10-23: run `growth opportunities`, record result, close if DoD 3 holds.
