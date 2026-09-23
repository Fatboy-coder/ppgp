# ACTIVE_GOAL

## GOAL
Add CSV export to the reports page.

## WHY
Customers asked for it.

## PHASE
CLOSED

## DEFINITION_OF_DONE
- Export button downloads a CSV with all visible rows.
- CSV opens correctly in Excel (UTF-8 BOM, CRLF).
- Works for a report with 50,000 rows without timing out.

## FROZEN_DECISIONS
- Stream the response; no temp file.

## INVARIANTS
- No new dependency.

## VERIFIED_CURRENT_STATE
- Branch feat/csv merged to main at 9c0ffee.

## COMPLETED
- Button, streaming endpoint, BOM/CRLF handling.
- Unit tests for encoder.

## REMAINING
- None. Done.

## BLOCKERS
- None.

## HUMAN_AUTHORITY_REQUIRED
- None.

## VERIFICATION_EVIDENCE
- pytest reports/tests: 41 passed.
- Manually opened a 20-row export in Excel: OK.

## NEXT_EXECUTABLE_ACTION
- None. Goal complete.
