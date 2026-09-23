# ACTIVE_GOAL

## GOAL
Migrate outbound email from provider X to provider Y.

## WHY
Provider X is being discontinued 2026-11-01.

## PHASE
EXECUTE

## DEFINITION_OF_DONE
- Step A: production sends via Y (requires Y API key in the prod env).
- Step B: mail templates rendered by the new adapter, snapshot tests pass.
- Step C: bounce webhook from Y handled and tested.

## FROZEN_DECISIONS
- Adapter pattern; provider chosen by MAIL_PROVIDER env.

## INVARIANTS
- No customer email may be sent from a non-production environment.

## VERIFIED_CURRENT_STATE
- main at 77aa00b; adapter skeleton exists; 0 templates ported.

## COMPLETED
- Adapter interface + X adapter extracted.

## REMAINING
- Step A (blocked, see BLOCKERS).
- Step B (independent of A; safe to do now).
- Step C (independent of A; safe to do now).

## BLOCKERS
- Step A only: Type C authority. Owner must create the Y account and place the API key in prod env. Steps B and C are NOT blocked.

## HUMAN_AUTHORITY_REQUIRED
- Owner: create provider Y account, provision key (Step A).

## VERIFICATION_EVIDENCE
- None yet.

## NEXT_EXECUTABLE_ACTION
- Step B: port templates/welcome.html to the adapter and add snapshot test.
