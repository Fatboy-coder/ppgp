# Research and evidence records

Dated, non-normative records behind PPGP's claims. Nothing here changes the protocol; `SPEC.md` is normative. Each record names the exact version it examined, its method, its limitations and what it did not show. Records are never edited to match later truth; a newer record supersedes an older one by date.

| Date | Record | Examined | Kind |
| --- | --- | --- | --- |
| 2026-09-23 | [`2026-09-23-adversarial-validation.md`](./2026-09-23-adversarial-validation.md) | `@fatboy-coder/ppgp@0.1.2` | maintainer-run adversarial validation, 18 scenarios |

Reproduction material:

- `test/fixtures/` — ACTIVE_GOAL variants derived from the 2026-09-23 campaign, exercised by `test/hardening.test.js` on every `npm test`.
- `benchmarks/` — paired A/B recovery protocol, result schema, deterministic pilot fixture.
- `docs/EVALUATION.md` — what to record when evaluating PPGP.
- Branch `research/ppgp-reality-audit` — the full audit and validation working papers, raw CLI captures and harness scripts of the 2026-09-23 campaign.
- Branch `research/v0.2-concurrency-experiment` — a richer coordination model implemented in 2026-08 and preserved as research; not a release path.

Vocabulary used in these records, in increasing strength: maintainer-tested, adversarially exercised under documented scenarios, reproducible methodology, independent validation, peer review, formal verification. Only the first three apply to PPGP today.
