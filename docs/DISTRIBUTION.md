# PPGP Distribution

How PPGP reaches users and agent platforms. The protocol and canonical Agent Skill are vendor-neutral; every platform manifest is a thin adapter for discovery and installation.

## Source version versus published release

These are different facts and this repository records them in different places.

| Fact | Canonical source |
| --- | --- |
| Source version of this tree | `version` in `package.json`; mirrored in `SPEC.md`, `skills/ppgp/SKILL.md`, `CITATION.cff`, adapter manifests |
| Latest published GitHub Release | https://github.com/Fatboy-coder/ppgp/releases/latest |
| Latest published npm package | https://www.npmjs.com/package/@fatboy-coder/ppgp |
| Whether and when the source version was published | GitHub Releases and npm only; the source tree never records it |
| Historical releases | `CHANGELOG.md` and GitHub Releases |

A source tree may carry a version that is not yet published. Documents in this repository therefore never hard-code a future download asset or package version; they link to the durable release and package pages instead.

## Canonical skill and mirrors

```text
skills/ppgp/SKILL.md
skills/ppgp/references/PPGP.md
```

Generated, byte-identical mirrors exist for platforms that discover other paths:

```text
.agents/skills/ppgp/          cross-agent .agents/skills convention (Copilot, Windsurf, Devin)
plugins/ppgp/skills/ppgp/     Claude plugin package (Claude copies plugins into its cache)
```

Regenerate with `node scripts/sync-skill-mirror.js`; `npm test` fails on drift. Never edit a mirror directly.

## Routes

Universal Agent Skills route (preferred):

```bash
npx skills add https://github.com/Fatboy-coder/ppgp/tree/main/skills/ppgp
```

Manual: open the latest GitHub Release, download its `ppgp-v<version>.zip` (a SHA-256 file is published beside it), extract, and copy the `ppgp` directory into the client's skills location.

CLI, zero-install:

```bash
npx @fatboy-coder/ppgp init
npx @fatboy-coder/ppgp doctor
npx @fatboy-coder/ppgp goal "Ship the next verified milestone"
npx @fatboy-coder/ppgp status
npx @fatboy-coder/ppgp handoff
```

Global install keeps the short executable: `npm install -g @fatboy-coder/ppgp`, then `ppgp --version`. To pin an exact historical version for reproducibility, append `@<version>` using a version listed on the npm page.

Inside this repository the source CLI runs without installation: `node ./bin/ppgp.js --version`.

### Windows note

Some npm versions route `npm` through the `npm.ps1` wrapper and mis-forward arguments, so `npm exec … -- ppgp --version` can print the npm version. Use `npm.cmd exec --yes --package=@fatboy-coder/ppgp -- ppgp --version` to bypass the wrapper. CI packs and installs the package on Windows and verifies the generated `ppgp.cmd` shim.

### Platform adapters

| Platform | Adapter | Notes |
| --- | --- | --- |
| Claude / Claude Code | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `plugins/ppgp/` | Plugins → Add marketplace → `Fatboy-coder/ppgp` → install `ppgp`. Invocation is `/ppgp`, or `/ppgp:ppgp` where Claude Code namespaces plugin skills. `/reload-plugins` exists only on some surfaces. The plugin manifest pins no version; refresh follows repository revisions. |
| OpenAI Codex / ChatGPT | `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json` | Skill-only plugin pointing at canonical `skills/`. Public Plugin Directory listing is a vendor-side step. |
| Google Gemini CLI | `gemini-extension.json` | `gemini extensions install https://github.com/Fatboy-coder/ppgp --auto-update`. |
| Cursor | `plugin.json` (Agent Plugins format) | Schema-safe manifest over canonical `skills/`. Marketplace publication is external. |
| GitHub Copilot, Windsurf, Devin | `.agents/skills/ppgp/` mirror | Repository-native discovery. |
| Kiro, Cline, JetBrains Junie | canonical `skills/ppgp/` | Import or copy the public skill; no platform-specific copy is maintained. |
| Roo Code, Amazon Q Developer | none | An adapter is added only once the platform exposes a stable, testable mechanism. |

Repository packaging never implies vendor endorsement, submission, approval or public listing. Verification state and dates per platform are in [`COMPATIBILITY.md`](./COMPATIBILITY.md).

Adapter manifests are repository distribution surfaces; they are excluded from the npm package, which bundles the CLI, the canonical skill, the specification, the evaluation guide and the benchmark protocol and tooling.

## Publishing

One guarded manual workflow starts a release; the package workflows chain from it:

```text
Publish PPGP release   (.github/workflows/publish-release.yml)
        ↓ workflow_run
Publish PPGP to npm    (.github/workflows/publish-npm.yml, npm Trusted Publishing / OIDC)
        ↓ workflow_run
Publish PPGP to GitHub Packages
```

The release workflow refuses a version that does not equal the committed `package.json` version, then creates the immutable tag, the GitHub Release and the `ppgp-v<version>.zip` asset. Downstream workflows re-check the release and package version before publishing. Manual dispatches exist to republish a package after an infrastructure failure. No long-lived npm token is required.

The tree tagged by the release is immutable, so it never embeds publication state: `CHANGELOG.md` uses a bare `## <version>` heading and `CITATION.cff` carries no `date-released`. If a publish step fails after the merge, nothing in `main` is wrong; GitHub Releases and npm simply do not list the version yet. `npm test` enforces that rule.

## What `npm test` validates about distribution

- canonical skill and compact reference exist and mirrors are byte-identical;
- Claude, Codex, Agent Plugin and Gemini manifests parse and name `ppgp`;
- versioned adapters, skill metadata, specification title, citation, benchmark protocol and CLI headers agree on the `package.json` version;
- no active document hard-codes an unpublished release asset or package version;
- adapter directories do not enter the npm payload;
- packing and installing the package produces a working `ppgp` binary on Linux and Windows.
