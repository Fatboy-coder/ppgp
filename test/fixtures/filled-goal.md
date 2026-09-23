# ACTIVE_GOAL

## GOAL
Add rate limiting to /login (5 attempts per minute per IP, HTTP 429 with Retry-After).

## WHY
Credential-stuffing traffic observed in access logs 2026-09-20; no throttle exists.

## PHASE
EXECUTE

## DEFINITION_OF_DONE
- POST /login returns 429 with Retry-After on the 6th attempt within 60 s from one IP (integration test).
- Existing login tests still pass.
- Limit is configurable via LOGIN_RATE_LIMIT env (default 5).
- Change merged to main.

## FROZEN_DECISIONS
- Use the existing in-memory token bucket helper `ratelimit.bucket()`; no Redis.
- Key by client IP from X-Forwarded-For only when TRUST_PROXY=1.

## INVARIANTS
- No change to session/cookie semantics.
- No logging of passwords or full request bodies.

## VERIFIED_CURRENT_STATE
- main at 4f2c1e9, tests 118/118 pass (2026-09-22 14:05 UTC).
- `ratelimit.bucket()` exists and is unit-tested.

## COMPLETED
- Middleware `login_limiter` added in auth/limiter.py (uncommitted on branch feat/login-rl).
- Unit test for bucket keying by IP added.

## REMAINING
- Integration test for 429 + Retry-After.
- Env config LOGIN_RATE_LIMIT.
- Commit, open PR, merge.

## BLOCKERS
- None.

## HUMAN_AUTHORITY_REQUIRED
- None.

## VERIFICATION_EVIDENCE
- pytest auth/tests/test_limiter_unit.py: 3 passed (2026-09-22 16:40 UTC, local).

## NEXT_EXECUTABLE_ACTION
- Write auth/tests/test_login_429.py asserting 429 + Retry-After on 6th request; run full suite.
