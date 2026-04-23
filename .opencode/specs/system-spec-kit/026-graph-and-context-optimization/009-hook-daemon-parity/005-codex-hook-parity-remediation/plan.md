---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
title: "Implementation Plan: Codex CLI Hook Parity Remediation"
description: "Three-phase plan: contract investigation, native Codex hook port plus registration, then documentation and memory integration."
trigger_phrases:
  - "026/009/005 plan"
  - "codex hook parity plan"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Independent review and live re-verification — all claims hold"
    next_safe_action: "Validate and save"
    completion_pct: 100
---
# Implementation Plan: Codex CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The implementation used an investigation-first but implementation-heavy path. Phase 1 confirmed the Codex hook contract and feature flag behavior. Phase 2 shipped native Codex `SessionStart` and `UserPromptSubmit` adapters, registered them beside Superset notifications, and enabled `codex_hooks`. Phase 3 documented the contract and recorded verification evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Result |
|------|-------------|--------|
| Contract evidence | Primary-source and empirical Codex hook contract established | Complete |
| Build | TypeScript compiles in the MCP server package | Pass |
| Regression | Claude prompt hook test still passes | Pass |
| Codex tests | Codex SessionStart and UserPromptSubmit tests pass | Pass |
| Live config | Existing Superset notify hooks are preserved | Pass |
| Smoke | Direct hooks and fresh `codex exec` smoke run | Pass |
| Spec validation | Strict validation runs after documentation updates | Final gate |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Technical Context

Codex CLI 0.122.0 runs command hooks from `~/.codex/hooks.json` when `[features].codex_hooks = true` is present in `~/.codex/config.toml`. Hook commands receive event JSON on stdin and can return developer context through JSON stdout.

Codex reads event JSON from stdin, executes registered command hooks, and injects `hookSpecificOutput.additionalContext` as developer context. The Spec Kit adapters are thin runtime-specific wrappers around existing advisor/startup logic:

- `hooks/codex/session-start.ts` builds startup context and emits Codex-native JSON.
- `hooks/codex/user-prompt-submit.ts` builds the compact advisor brief and emits Codex-native JSON.
- `~/.codex/hooks.json` is the live registration surface.
- `~/.codex/config.toml` must enable `codex_hooks = true`.

The adapters are stdout-only and fail open with `{}`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Investigation

Confirmed stdin schema, stdout injection, exit-code behavior, timeouts, concurrency, event taxonomy, and the required `codex_hooks` feature flag. Outcome A was accepted in ADR-003.

### Phase 2: Port + Register

Created the Codex SessionStart adapter, verified the existing UserPromptSubmit adapter, added focused tests, built the MCP server, backed up live Codex hooks, appended Spec Kit commands, and enabled the feature flag.

### Phase 3: Document + Integrate

Added the cli-codex hook contract reference, updated cli-codex skill and README surfaces, updated parent summary, and recorded checklist/task evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Automated checks:

- `npm run build`
- `npx vitest run tests/codex-session-start-hook.vitest.ts tests/codex-user-prompt-submit-hook.vitest.ts tests/claude-user-prompt-submit-hook.vitest.ts`
- JSON parse of live hooks config
- `codex features list`

Manual and smoke checks:

- Direct SessionStart stdin smoke
- Direct UserPromptSubmit stdin smoke
- Fresh real `codex exec --json --ephemeral` smoke
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Required for | Status |
|------------|--------------|--------|
| Codex CLI 0.122.0 | Live feature flag and smoke tests | Confirmed |
| Existing Claude hook implementation | Reference behavior and regression test | Tracked and green |
| Superset notify hook | Existing user notification workflow | Preserved |
| MCP server build output | Live hook commands target `dist` files | Built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is direct:

1. Restore `/Users/michelkerkmeester/.codex/hooks.json.bak-20260422-130756` to `~/.codex/hooks.json`.
2. Remove or set `codex_hooks = false` in `~/.codex/config.toml`.
3. Revert the scoped repository files from this phase.

No Superset hook command was edited.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depended on ADR-003 accepting outcome A. Phase 3 depended on green build/tests and live registration.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Research was already complete from the previous session. The implementation pass completed in one focused turn with live config edit, tests, smoke checks, and documentation updates.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

The backup file allows restoring the exact pre-edit hook registration. The repo changes are isolated to Codex hook support and packet documentation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
ADR-003 contract
  -> Codex adapters
  -> build + focused tests
  -> live hooks/config
  -> direct and real Codex smokes
  -> docs + memory save
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path was adapter compilation, live `codex_hooks` activation, direct hook output verification, and a real `codex exec` smoke.

### AI Execution Protocol

**Pre-Task Checklist**

- Read scoped files before editing.
- Preserve live Superset notify hooks.
- Back up user-local Codex hook config before modification.
- Verify build, focused tests, direct smokes, and real Codex smoke before completion.

**Task Execution Rules**

| Rule | Application |
|------|-------------|
| TASK-SEQ | Research contract, implement adapters, register live hooks, then document. |
| TASK-SCOPE | Touch only Codex hook parity files, live Codex config, and this packet's docs. |
| TASK-VERIFY | Record command evidence in checklist and summary. |

**Status Reporting Format**

Status lines use: phase, current action, validation state, and blocker if present.

**Blocked Task Protocol**

If build, tests, live smoke, or strict validation fail, mark the item BLOCKED, keep evidence, and fix the failure before claiming completion.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status |
|-----------|--------|
| Contract accepted | Complete |
| Codex adapters built | Complete |
| Live hooks registered | Complete |
| Codex smoke passed | Complete |
| Spec validation and memory save | Final gate |
<!-- /ANCHOR:milestones -->
