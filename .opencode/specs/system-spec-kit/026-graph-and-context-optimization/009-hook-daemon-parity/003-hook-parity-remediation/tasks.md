---
title: "029 — Hook Parity Remediation Tasks"
description: "Granular task list mapping each of 10 findings to concrete file edits + test additions, grouped by phase."
trigger_phrases:
  - "029 tasks"
  - "hook parity tasks"
importance_tier: "high"
contextType: "task-list"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T13:10:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Phases A-D implemented; phase summaries written"
    next_safe_action: "Orchestrator reviews summaries and resolves documented blockers"
    completion_pct: 95
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks

Status legend: `[ ]` pending · `[x]` done · `[~]` deferred

<!-- ANCHOR:tasks-phase-a-029 -->
## Closing Status

- [x] Phase A implemented and summarized in `phase-A-fix-summary.md`.
- [x] Phase B implemented and summarized in `phase-B-fix-summary.md`.
- [x] Phase C implemented and summarized in `phase-C-fix-summary.md`.
- [x] Phase D implemented and summarized in `phase-D-fix-summary.md`.
- [x] Phase E remediation log, implementation summary, and checklist evidence updated.
- [~] Full-suite vitest gate deferred: the completed run reports out-of-scope baseline failures across progressive-validation, canonical-save, integration, context-server, CLI, resume performance, task-enrichment, search archival, transcript planner, advisor runtime parity, and deep-loop prompt-pack tests.
- [~] Direct `.codex/policy.json` edit deferred: sandbox writes to the file return `EPERM`; runtime/setup defaults include bare `git reset --hard`.

## Phase A — OpenCode plugin transport fix

### A.1 Extract `buildOpencodeTransport()` helper
- [ ] Read `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:384-413` (non-minimal path)
- [ ] Extract the transport-construction block into a named function `buildOpencodeTransport(state, { minimal })`
- [ ] The helper returns `{ transportOnly: true, source: "session_resume", ...}` with the fields the plugin parser requires

### A.2 Call helper from minimal branch
- [ ] `handlers/session-resume.ts:560-578` — add `opencodeTransport: buildOpencodeTransport(state, { minimal: true })` to the minimal return payload
- [ ] Recompile: `npm run build` in `mcp_server/`
- [ ] Confirm `dist/handlers/session-resume.js:318-335` contains the updated branch

### A.3 Update plugin contract test
- [ ] `tests/opencode-plugin.vitest.ts` — add one test that runs the real bridge via `child_process.spawnSync('node', ['.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs', '--minimal'])` and feeds stdout into `parseTransportPlan()`
- [ ] Assert `plan.transportOnly === true`

### A.4 Add session-resume contract test
- [ ] `tests/session-resume.vitest.ts` — assert `handleSessionResume({ minimal: true })` returns `data.opencodeTransport.transportOnly === true`

### A.5 Diagnostic surface
- [ ] In the bridge `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`, when `opencodeTransport` is missing from the handler output, emit `stderr` log: `[bridge] session_resume returned no opencodeTransport — plugin injection will no-op`
- [ ] Add assertion in plugin `experimental.chat.system.transform` handler: if parsing fails, surface a visible runtime-status entry

### A.6 Commit
- [ ] `feat(029/A): restore OpenCode plugin transport delivery (HOOK-P1-001 + P2-005)`

## Phase B — Codex advisor hook reliability

### B.1 Policy detector replacement
- [ ] `lib/codex-hook-policy.ts` — remove `codex hooks list` probe
- [ ] Detect `.codex/settings.json` existence + JSON validity as the authoritative signal
- [ ] Keep `codex --version` as a soft capability hint; scrub `CODEX_TUI_*`, `CODEX_CI`, `CODEX_THREAD_ID` from `spawnSync` env

### B.2 Hook detector tests
- [ ] `tests/codex-hook-policy.vitest.ts` — add three new cases:
  - valid `codex --version` + invalid `hooks list` returns `full`
  - inherited Superset env: scrubbed-env probe returns `full` without timeout
  - `.codex/settings.json` + `.codex/policy.json` present → `full`

### B.3 Codex hook runtime path
- [ ] `hooks/codex/user-prompt-submit.ts` — add native-first advisor dispatch (when daemon/native scorer reachable, bypass Python subprocess)
- [ ] Extend subprocess timeout to `SPECKIT_CODEX_HOOK_TIMEOUT_MS` env (default `3000ms`, was `1000ms`)
- [ ] On timeout: return `hookSpecificOutput.additionalContext: "Advisor: stale (cold-start timeout ≥3s)"` with stderr diagnostic `status: "stale"` (not `fail_open` + `SIGNAL_KILLED`)

### B.4 Compiled-entrypoint smoke
- [ ] New `tests/codex-user-prompt-submit-hook.vitest.ts` — execs `dist/hooks/codex/user-prompt-submit.js` via `child_process.spawnSync` with payload `{"prompt":"review this","cwd":"<workspace>"}`, asserts stdout contains `hookSpecificOutput.additionalContext`

### B.5 Subprocess timeout classification
- [ ] `skill-advisor/lib/subprocess.ts` — distinguish true `TIMEOUT` (elapsed ≥ timeout) from `SIGNAL_KILLED` (external kill)
- [ ] Update `errorCode` classification to emit `TIMEOUT` when `elapsed >= timeoutMs`

### B.6 Commit
- [ ] `feat(029/B): Codex advisor hook reliability (HOOK-P1-002 + P1-003)`

## Phase C — Copilot startup + docs truth-sync

### C.1 Copilot JSON route fix
- [ ] `.github/hooks/superset-notify.json:4-10` — change `sessionStart` target to `.github/hooks/scripts/session-start.sh`
- [ ] Verify `.github/hooks/scripts/session-start.sh:41` already fans out to Superset via `superset-notify.sh` (no new code needed)

### C.2 Copilot wiring test
- [ ] `tests/copilot-hook-wiring.vitest.ts` — assert the JSON `sessionStart.command` equals the wrapper path

### C.3 Codex lifecycle docs
- [ ] `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/implementation-summary.md:143` — remove "context-prime" claim, point at `session_bootstrap`
- [ ] `grep -rn context-prime .opencode/specs/ .opencode/skill/ AGENTS.md` — remove any stale references that don't have a corresponding file
- [ ] Optional: create `.codex/agents/context-prime.toml` that aliases `session_bootstrap` (stretch goal; not required for AC-5)

### C.4 Codex hooks README
- [ ] `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md:19` — rewrite the deferred-registration paragraph:
  - `.codex/settings.json` registers `UserPromptSubmit` + `PreToolUse`
  - `.codex/policy.json` holds PreToolUse denylist
  - Startup/compaction/stop lifecycle hooks are absent (Codex CLI does not surface them)
  - Prompt hook smoke: run `dist/hooks/codex/user-prompt-submit.js` with `{"prompt":"x","cwd":"$PWD"}` — expect non-empty `hookSpecificOutput.additionalContext`; timeouts fall back to `status:"stale"` advisory

### C.5 Runtime matrix docs
- [ ] `.opencode/skill/system-spec-kit/references/config/hook_system.md` — add a matrix table:
  ```
  | Runtime | Prompt hook | Lifecycle hook | Compaction | Stop |
  |---------|-------------|----------------|------------|------|
  | Claude  | yes         | yes            | yes        | yes  |
  | Codex   | yes         | no             | no         | no   |
  | Copilot | yes         | yes (wrapper)  | yes        | n/a  |
  | Gemini  | yes         | yes            | yes        | yes  |
  | OpenCode| n/a (advisor separate) | yes (plugin) | yes (plugin) | n/a |
  ```
- [ ] `AGENTS.md:92-98` — replace "hook-capable runtimes" phrasing with explicit reference to the new matrix
- [ ] `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137` — clarify Codex startup recovery uses `session_bootstrap`

### C.6 Commit
- [ ] `feat(029/C): Copilot wiring + docs truth-sync (HOOK-P1-004 + P1-005 + P2-001 + P2-004)`

## Phase D — Codex PreToolUse policy hardening

### D.1 Policy type + loader
- [ ] `hooks/codex/pre-tool-use.ts` — update `CodexPolicyFile` type to include `bash_denylist?: string[]`
- [ ] `loadPolicy()` — merge `bashDenylist ?? []` and `bash_denylist ?? []`
- [ ] Remove `ensurePolicyFile()` call from `loadPolicy()` (no filesystem write during hook execution)
- [ ] When policy file missing, return `{ bashDenylist: DEFAULT_DENYLIST }` in-memory and log stderr `status: "in_memory_default"`

### D.2 Command parsing
- [ ] `bashCommandFor()` — add `tool_input.command`, `toolInput.command`, `input.command` cases (covers both snake_case and camelCase)

### D.3 Default denylist expansion
- [ ] `.codex/policy.json` default denylist — add `git reset --hard` (bare form, matches any argument suffix)
- [ ] Update type check in `pre-tool-use.ts` to match prefix semantics for `git reset --hard*` patterns

### D.4 Policy bootstrap extraction
- [ ] Move `ensurePolicyBootstrap()` (renamed from `ensurePolicyFile()`) to `mcp_server/handlers/session-bootstrap.ts` or a standalone setup script under `hooks/codex/setup.ts`
- [ ] Call it from `session_bootstrap` MCP tool so new installs get the file
- [ ] Add npm script `npm run setup:codex-policy` that writes the default policy (idempotent)

### D.5 Tests
- [ ] `tests/codex-pre-tool-use.vitest.ts`:
  - bash_denylist alias denies bare `git reset --hard`
  - toolInput.command (camelCase) denies configured command
  - missing policy file: no filesystem write + in-memory default allows/denies correctly

### D.6 Commit
- [ ] `feat(029/D): Codex PreToolUse policy hardening (HOOK-P2-002 + P2-003)`

## Phase E — Closing

### E.1 Remediation log
- [ ] Append `## Remediation Log 2026-04-21` section to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/codex-and-code-graph-hook-deep-dive.md` listing each finding ID → status → phase commit SHA → primary file(s) changed → test citation

### E.2 Validate spec folder
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation --strict --no-recursive`

### E.3 Update implementation-summary.md
- [ ] Fill in actual summary (not placeholders), set status `complete`, update `_memory.continuity.recent_action` + `completion_pct: 100`

### E.4 Closing commit
- [ ] `docs(029): remediation log + implementation summary — 10 findings closed`
<!-- /ANCHOR:tasks-phase-a-029 -->
