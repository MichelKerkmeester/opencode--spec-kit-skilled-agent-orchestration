# Deep Research Strategy — Copilot CLI 1.0.34 Hook-Config Schema Resolution

**Topic**: Copilot CLI 1.0.34 hook-config JSON schema. Resolve the `"Neither 'bash' nor 'powershell' specified in hook command configuration"` execution failure blocking `026/007/007 copilot-hook-parity-remediation`. Identify the current schema that Copilot CLI accepts for `sessionStart` / `userPromptSubmitted` / `sessionEnd` / `postToolUse` / `preToolUse` hooks, confirm the config-file path and discovery rules, and produce a concrete JSON patch to `.github/hooks/superset-notify.json` with an empirical reproducer.

**Research packet**: `007-deep-review-remediation-pt-03/`
**Parent spec phase**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/007-copilot-hook-parity-remediation/`
**Prior research**: `../007-deep-review-remediation-pt-01/research.md` (outcome B file-based workaround; no hook-schema investigation)
**Max iterations**: 10
**Convergence threshold**: 0.05

---

## Charter

### In scope
- Current Copilot CLI hook-config JSON schema (1.0.34 and surrounding releases) — field names, nesting, allowed shapes for each of the 6 documented events.
- Reason for asymmetric parse behavior: `sessionStart` at 11:08 UTC produced a successful write; `userPromptSubmitted` at 13:30 UTC failed schema validation. Determine whether this is event-specific validation, a version upgrade between runs, or a file-level issue.
- Where Copilot CLI reads hook configs from: `.github/hooks/*.json`, `$HOME/.copilot/hooks.json`, a field in `~/.copilot/config.json`, or other.
- Debug/trace paths: `--debug`, `COPILOT_DEBUG`, verbose log level.
- Published examples: official Copilot CLI docs, GitHub `github/copilot-cli` repo, GitHub changelog, authoritative issues/PRs mentioning hook schema.
- ACP fallback: would `copilot --acp` bypass the hook schema entirely and still deliver per-prompt refresh?
- Concrete JSON patch to `.github/hooks/superset-notify.json` that Copilot 1.0.34 accepts for all 4 registered events (sessionStart, sessionEnd, userPromptSubmitted, postToolUse).

### Out of scope
- Modifying source code this run — research only. Fix-implementation goes into a follow-on packet.
- Re-opening ADR-003's Outcome A vs B classification unless a primary source proves prompt-mutation via hooks is now supported.
- Hook parity for Gemini or Cursor — those are separate efforts.
- The writer logic itself — `custom-instructions.ts`, `user-prompt-submit.ts`, and `session-prime.ts` are already verified working.

### Stop conditions (convergence signal)
Stop when ALL three are satisfied:
1. **Primary source cited** — current hook-config schema documented in Copilot CLI 1.0.34 official docs, release notes, generated JSON-schema file, or an authoritative GitHub issue (linkable URL).
2. **Concrete JSON patch** — exact corrected shape of each hook entry in `.github/hooks/superset-notify.json` or its successor location.
3. **Empirical reproducer** — a minimal test (create a patched config, start a Copilot session, check `~/.copilot/logs/process-*.log` for successful hook execution without the "Neither 'bash' nor 'powershell'" error, verify `Refreshed:` timestamp in `$HOME/.copilot/copilot-instructions.md` advances after a prompt).

---

## Key Questions

- [ ] **KQ-1**: What is the current (Copilot CLI 1.0.34) hook-config JSON schema? Field names, nesting, required vs optional keys, allowed values for each of the 6 hook events.
- [ ] **KQ-2**: Why does `sessionStart` succeed at 11:08 UTC while `userPromptSubmitted` fails at 13:30 UTC in the same config file? Event-specific validation, version drift, or file-level schema mismatch?
- [ ] **KQ-3**: Is there a new required key (e.g., `command`, `run`, `shell`, or nested `command: { bash: ... }`) that replaced the flat `"bash": "..."` form?
- [ ] **KQ-4**: Which config-file path is Copilot CLI 1.0.34 actually reading? `.github/hooks/superset-notify.json`, `$HOME/.copilot/hooks.json`, `$HOME/.copilot/config.json`, or a merged/layered lookup?
- [ ] **KQ-5**: Does Copilot CLI emit a schema-validation trace that names the expected field? Check `--debug`, `COPILOT_DEBUG`, `copilot --verbose`, or log level env vars.
- [ ] **KQ-6**: Does the Copilot CLI ship a JSON-schema file (similar to Codex CLI's `hooks.schema.json`) inside the binary or its NPM package?
- [ ] **KQ-7**: What is the corrected JSON patch for `.github/hooks/superset-notify.json` that makes all 4 registered events parse cleanly on 1.0.34?
- [ ] **KQ-8**: Does the old `"bash": "path"` schema produce a deprecation warning when parsed or does it fail silently? (Understanding silent-vs-explicit failure is required to avoid future regressions.)
- [ ] **KQ-9**: Is the ACP (`copilot --acp`) path viable as a more capable fallback if the hook schema can't be fixed to deliver per-prompt refresh? If yes, what's the minimum client-wrapper cost?
- [ ] **KQ-10**: After patching and successful hook execution, does `$HOME/.copilot/copilot-instructions.md` `Refreshed:` timestamp advance on each prompt in a live Copilot session? (Verifies the full integration works end-to-end.)

---

## Known Context

### From memory / prior packet
- `007-deep-review-remediation-pt-01` converged on Outcome B (file-based workaround) in April 2026 with 30+ primary-source citations. It did NOT investigate the hook-config schema — only confirmed that Copilot customer hooks cannot mutate prompts per GitHub docs.
- `007-copilot-hook-parity-remediation/implementation-summary.md` reports a successful `copilot -p` smoke on 2026-04-22 that returned the advisor line. The session in which that smoke ran used the same `.github/hooks/superset-notify.json` file shape that is now failing.
- The compiled writer (`dist/hooks/copilot/user-prompt-submit.js`) is verified working via temp-file smoke (`SPECKIT_COPILOT_INSTRUCTIONS_PATH` override) — producing the managed block with a live advisor line. The breakage is specifically at the Copilot-CLI-to-hook-script edge.

### Observed failure
- Copilot CLI 1.0.34 installed (`copilot --version` → `GitHub Copilot CLI 1.0.34. Run 'copilot update' to check for updates.`).
- Error from `~/.copilot/logs/process-1776864631540-59265.log` at `2026-04-22T13:30:37.080Z` and `2026-04-22T13:30:48.469Z`:
  ```
  Error: Neither 'bash' nor 'powershell' specified in hook command configuration
  ```
- Current (failing) config entry shape:
  ```json
  { "type": "command", "bash": ".github/hooks/scripts/user-prompt-submitted.sh", "timeoutSec": 5 }
  ```
- `~/.copilot/config.json` does not have a `hooks` field; it has `banner`, `firstLaunchAt`, `lastLoggedInUser`, `trustedFolders`.
- `.github/hooks/superset-notify.json` is the current repo-level config file; the error indicates Copilot CLI tried to execute but rejected the schema.

### Source materials to consult
- GitHub docs: `docs.github.com/en/copilot/github-copilot-in-the-cli/**` — hooks page, release notes, troubleshooting.
- GitHub repo: `github/copilot-cli` — releases, issues, PRs, source.
- NPM package `@github/copilot`: inspect `package.json`, any embedded schema files.
- Existing `~/.superset/hooks/copilot-hook.sh` comment block for prior schema conventions.
- Copilot CLI debug traces: `COPILOT_DEBUG=1`, `--verbose`, or log-level escalation.

### Prior empirical data
- sessionStart hook DID fire successfully at 11:08 UTC: the managed block was written with `Source: "system-spec-kit copilot sessionStart hook"`. This proves the session-start branch either (a) uses a different schema than userPromptSubmitted, or (b) was executed by a different Copilot CLI version before the upgrade.

### Executor
- cli-codex gpt-5.4 high fast, sandbox workspace-write, 900s timeout per iteration.

---

## Next Focus

**Iteration 1**: Ground-truth the current hook-config schema from primary sources. Hit the Copilot CLI changelog + docs for the last 6 months, dump the NPM package contents to look for schema files, and run `copilot --help`, `copilot --debug`, `COPILOT_DEBUG=1 copilot -p "x"` to flush any schema-validation trace. Output: at least one primary-source citation naming the expected field, or empirical evidence of the correct key name.

---

## Machine-Owned Sections (reducer-maintained)

<!-- REDUCER:registry-summary:BEGIN -->
_Pending first reducer run._
<!-- REDUCER:registry-summary:END -->

<!-- REDUCER:dashboard-snapshot:BEGIN -->
_Pending first reducer run._
<!-- REDUCER:dashboard-snapshot:END -->
