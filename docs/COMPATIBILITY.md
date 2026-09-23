# PPGP Platform Compatibility

One canonical protocol skill lives at `skills/ppgp/`; platform adapters are thin discovery manifests around it. This page records what has actually been verified, how, and when. External platforms change independently of PPGP, so every row ages from its **Last verified** date; treat older rows as claims to re-check, not as guarantees.

Status vocabulary:

- **VERIFIED CLIENT**: install, discovery and invocation were manually exercised in the real client.
- **VERIFIED FORMAT**: the repository artifact matches the platform's documented format and is covered by `npm test`.
- **REPOSITORY NATIVE**: the platform documents discovery of the committed path; discovery itself was not exercised in that client.
- **IMPORT READY**: the platform can import the canonical public skill; no client-side smoke test was run.
- **STRUCTURALLY READY**: manifests are present and validated by `npm test`; no client-side smoke test was run.
- **DOCUMENTATION ONLY**: no stable adapter was added.

Evidence types: *manual client test* (a person used the client), *structural validation* (`npm test` parses and cross-checks the manifests), *documentation review* (platform documentation read, nothing executed).

## Matrix

| Platform | Native mechanism | PPGP artifact | Status | Evidence type | Last verified | Client version | Remaining external action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Anthropic Claude / Claude Code | Plugin + self-hosted marketplace | `.claude-plugin/marketplace.json`, `plugins/ppgp/` | VERIFIED CLIENT | manual client test | 2026-08-25 (install, updated-skill load, `/ppgp` invocation); 2026-08-26 (invocation-form notes) | not recorded | Public Anthropic listing not claimed |
| OpenAI Codex | Plugin + repo marketplace | `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `skills/ppgp/` | STRUCTURALLY READY | structural validation | 2026-08-25 | n/a | Import/test in Codex; Plugin Directory listing is external |
| OpenAI ChatGPT | Agent Skills / skill-only plugin | `skills/ppgp/`, Codex plugin package | IMPORT READY | documentation review | 2026-08-25 | n/a | Upload/import the skill; directory availability is external |
| Google Gemini CLI | Gemini Extension + Agent Skills | `gemini-extension.json`, `skills/ppgp/` | STRUCTURALLY READY | structural validation | 2026-08-25 | n/a | Run `gemini extensions install https://github.com/Fatboy-coder/ppgp --auto-update` |
| Cursor | Agent Plugins + Agent Skills | `plugin.json`, `skills/ppgp/` | STRUCTURALLY READY | structural validation | 2026-08-25 | n/a | Local plugin smoke test; marketplace publication external |
| GitHub Copilot | Agent Skills | `.agents/skills/ppgp/` mirror | REPOSITORY NATIVE | documentation review | 2026-08-25 | n/a | Open a repo with Copilot and verify discovery |
| Windsurf | Agent Skills | `.agents/skills/ppgp/` mirror | REPOSITORY NATIVE | documentation review | 2026-08-25 | n/a | Open a repo with Windsurf and verify discovery |
| Devin | Agent Skills | `.agents/skills/ppgp/` mirror | REPOSITORY NATIVE | documentation review | 2026-08-25 | n/a | Connect the repo in Devin and verify discovery |
| Kiro | Agent Skills import | canonical `skills/ppgp/` | IMPORT READY | documentation review | 2026-08-25 | n/a | Import the public skill in Kiro |
| Cline | Agent Skills | canonical `skills/ppgp/` | IMPORT READY | documentation review | 2026-08-25 | n/a | Copy into a supported skills directory and smoke-test |
| JetBrains Junie | Agent Skills | canonical `skills/ppgp/` | IMPORT READY | documentation review | 2026-08-25 | n/a | Import into Junie's skills location and smoke-test |
| Roo Code | depends on installed client | canonical `skills/ppgp/` | DOCUMENTATION ONLY | none | — | n/a | Confirm the installed version's skill discovery path first |
| Amazon Q Developer | no stable adapter validated | canonical protocol usable manually | DOCUMENTATION ONLY | none | — | n/a | Re-evaluate when a stable skill/plugin surface is confirmed |

Dates come from the repository history of this file and the adapter commits (matrix and adapters added 2026-08-25; Claude client verification recorded 2026-08-25; Windows and Claude invocation notes 2026-08-26). Structural validation re-runs on every `npm test`, but that only confirms manifest shape, not client behaviour.

## Verification snapshot

- Claude self-hosted marketplace: install, updated-skill loading and unnamespaced `/ppgp` invocation manually verified 2026-08-25 in one Claude client whose version was not recorded; that client did not expose `/reload-plugins`. Claude Code may expose `/ppgp:ppgp`. Nothing has been re-verified since.
- Codex/OpenAI, Cursor and Gemini: manifests validated structurally on every test run; no client smoke test has been performed.
- Copilot, Windsurf, Devin, Kiro, Cline, Junie: documentation-based readiness only.

## Adapter principles

1. Protocol semantics remain vendor-neutral; a manifest describes PPGP but never forks it.
2. Prefer direct use of `skills/ppgp/`; when a second path is required, keep it a deterministic drift-tested mirror.
3. Readiness, submission, approval and public listing are distinct states; a manifest is not vendor endorsement.
4. Repository-backed Claude plugin refresh follows repository revisions, not a pinned adapter version.
5. Record invocation forms from the exact tested client surface; do not generalize one slash-command form.
6. When a row is re-verified, update its date and evidence type; do not refresh a date because the file was edited.
