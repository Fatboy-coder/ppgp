# ACTIVE GOAL — Growth Intelligence V1

STATUS (2026-09-22): **SOURCE-COMPLETE ON A BRANCH, NOT DEPLOYED, NOT MERGED.**

GOAL: Make the control plane able to connect search demand to product value for its managed sites, as a bounded subsystem beside the frozen engine, with one client product first.

PRODUCT_DIRECTION: measures and explains; never mutates pricing, content or spend.

CURRENT_PHASE: **OWNER REVIEW → MERGE → DEPLOY → OBSERVE.**

FROZEN_DECISIONS:
- Engine stays frozen; the new subsystem writes nothing into it.
- Generic multi-product model; nothing named after the first client.

DEFINITION_OF_DONE (source, tests and local dogfood — deployment is a separate owner gate):

1. **DONE — contracts.** Event families, vocabularies, bounds.
2. **PARTIAL — product intelligence.** Backend-observed truth complete; frontend events deferred.
3. **DONE — tests.** 423 passed.

OWNER-GATED — NOT PERFORMED (stop conditions):
- **Merge** of the branch.
- **Production deployment.**

RESIDUAL_LIMITATIONS: see the subsystem document "Known limitations".

NEXT_EXECUTABLE_ACTION: owner reviews the PR; on merge, deploy with the added worker container, then let one full 28-day window accumulate before reading any opportunity as more than LOW sufficiency.
