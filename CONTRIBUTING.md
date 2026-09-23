# Contributing to PPGP

PPGP is experimental and published early so it can be tested on real repositories, challenged, simplified and corrected. Failure reports are at least as useful as positive results.

## Quick start for contributors

```bash
git clone https://github.com/Fatboy-coder/ppgp
cd ppgp
npm test                         # CLI, version consistency, hardening, benchmark, package suites
node test/installed-cli.test.js  # packs and installs the package, runs the generated shim
node bin/ppgp.js --help          # run the source CLI without installing
```

No dependencies are installed; the CLI and tests use Node's standard library only (Node 18+).

## Where things live

```text
SPEC.md                         the protocol; normative
skills/ppgp/                    canonical Agent Skill (SKILL.md, references/PPGP.md); edit here only
.agents/skills/ppgp/            generated mirror; never edit
plugins/ppgp/skills/ppgp/       generated mirror for the Claude plugin; never edit
bin/ppgp.js                     the CLI
test/                           regression tests; test/fixtures/ holds ACTIVE_GOAL variants
benchmarks/                     evaluation protocol, result schema, pilot fixture
docs/                           COMPATIBILITY, DISTRIBUTION, EVALUATION; ACTIVE_GOAL.md while a goal is open
research/                       dated, non-normative evidence records
scripts/sync-skill-mirror.js    regenerates the two mirrors from skills/ppgp/
```

After editing anything under `skills/ppgp/`, run `node scripts/sync-skill-mirror.js`; `npm test` fails if a mirror drifts.

## Rules that tests enforce

- Source-version artifacts (`package.json`, `SPEC.md` title, skill metadata, compact reference title, `CITATION.cff`, adapter manifests, benchmark protocol, `ROADMAP.md`, `CHANGELOG.md`) agree on one version.
- The `CHANGELOG.md` entry for that version reads `candidate` until the release is published; `CITATION.cff` carries `date-released` only once the entry is dated.
- No active document hard-codes an unpublished `ppgp-v<version>.zip` asset or `@<version>` install line; published versions are linked through GitHub Releases and npm.
- Adapter directories stay out of the npm payload; no generated archive is tracked.
- A canonical thirteen-field `ACTIVE_GOAL` parses as conformant; partial, malformed and missing state are reported distinctly.

## Proposing a change

1. Open an issue or start from an existing one; recovery failures and evaluation reports have issue forms.
2. Branch from `main`. Keep protocol changes and implementation changes in separate PRs where practical.
3. A change to protocol semantics needs a reproducible failure of the current model first. The evolution rule is falsification-driven: reproduce, classify (protocol, tooling, documentation, convention, operator error), try the existing model, make the smallest change, rerun the regression suite. See `research/` for how prior campaigns did this.
4. Do not add a vendor-specific requirement to the portable core; add an optional adapter and document it in `docs/COMPATIBILITY.md` with its evidence type and date.
5. Run `npm test` and `node test/installed-cli.test.js` locally; CI runs both on Linux and Windows.
6. Describe what was verified and what was not. Do not use "validated", "proven" or "certified" for maintainer-run tests.

## Self-hosting

Substantial changes to this repository are tracked with the protocol itself: open `docs/ACTIVE_GOAL.md` with `node bin/ppgp.js goal "<outcome>"`, keep it current after verified material changes, and delete it at verified closure. When the goal lives on a topic branch, name the branch in `ROADMAP.md` so a fresh agent on `main` can find it. Historical goal state remains in Git.

## Releases

Maintainers release through the guarded workflows described in [`docs/DISTRIBUTION.md`](./docs/DISTRIBUTION.md): bump `package.json` and the mirrored version strings on a release branch, keep the changelog entry marked `candidate`, merge after review, then run the release workflow, which tags, publishes the GitHub Release and chains npm and GitHub Packages publication. Only after that does the changelog entry receive its date.

## Discussion style

Challenge the protocol, not the contributor. Prefer concrete counterexamples over status arguments. Do not assume a technique that works for one model or repository is universal.

## License

By contributing, you agree that your contribution may be distributed under the MIT License used by this project.
