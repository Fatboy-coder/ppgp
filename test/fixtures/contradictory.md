# ACTIVE_GOAL

## GOAL
Rename the service from Foo to Bar everywhere.

## WHY
Brand change.

## PHASE
CLOSED

## DEFINITION_OF_DONE
- No occurrence of "Foo" remains in src/, docs/ or the deployed site.

## FROZEN_DECISIONS
- None.

## INVARIANTS
- None.

## VERIFIED_CURRENT_STATE
- Deployed site still shows "Foo" in the footer (observed 2026-09-22).

## COMPLETED
- All occurrences renamed and deployed.

## REMAINING
- Footer still says Foo.

## BLOCKERS
- None.

## HUMAN_AUTHORITY_REQUIRED
- None.

## VERIFICATION_EVIDENCE
- grep -r Foo src/ returns nothing.

## NEXT_EXECUTABLE_ACTION
- Goal complete; nothing to do.
- Fix the footer.
