---
title: "029 — Hook Parity Remediation Plan"
description: "Implementation plan for 10 hook findings: phased by criticality, per-finding evidence, commit cadence, and test strategy."
trigger_phrases:
  - "029 plan"
  - "hook parity plan"
importance_tier: "high"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/029-hook-parity-remediation"
    last_updated_at: "2026-04-21T10:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded plan; 4 phases + closing"
    next_safe_action: "Dispatch codex Phase A"
    completion_pct: 5
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan

<!-- ANCHOR:plan-sequence-029 -->
## Phase Sequence

Ordered by impact:

1. **Phase A — OpenCode plugin transport fix** (HOOK-P1-001 + HOOK-P2-005) — restores code-graph context delivery
2. **Phase B — Codex advisor hook reliability** (HOOK-P1-002 + HOOK-P1-003) — makes hook output visible
3. **Phase C — Copilot startup wiring + docs truth-sync** (HOOK-P1-004 + HOOK-P1-005 + HOOK-P2-001 + HOOK-P2-004)
4. **Phase D — Codex PreToolUse policy hardening** (HOOK-P2-002 + HOOK-P2-003)

One commit per phase (4 commits total), plus 1 closing commit to append remediation log to the source deep-dive doc.
<!-- /ANCHOR:plan-sequence-029 -->

<!-- ANCHOR:plan-phase-details-029 -->

## Phase A — OpenCode plugin transport fix

**Scope:** `session_resume({ minimal: true })` returns `opencodeTransport`; plugin contract test uses real bridge shape.

### Step A.1 — Confirm current behavior
Read `handlers/session-resume.ts:560-578` and `dist/handlers/session-resume.js:318-335` — identify the early-return that skips `payloadContract` + `opencodeTransport`.

### Step A.2 — Decide transport surface
**Decision** (see ADR-001): keep `--minimal` AND return `opencodeTransport`. The minimal flag is about skipping heavy enrichment (full memory snapshot), not skipping plugin contract fields.

### Step A.3 — Implement
In `handleSessionResume()` minimal branch: build `opencodeTransport` before the early return. Lift the transport construction out of the non-minimal path into a shared helper (e.g., `buildOpencodeTransport()`). Minimal returns `{ payloadContract: null, opencodeTransport: {...transportOnly:true}, ... }`.

### Step A.4 — Test
- `tests/session-resume.vitest.ts`: assert `minimal: true` output includes `opencodeTransport.transportOnly === true`.
- `tests/opencode-plugin.vitest.ts`: new test that invokes the real bridge stdout (via child_process) and feeds into `parseTransportPlan()` — NOT mocked.

### Step A.5 — Runtime status
Surface `Bridge returned no OpenCode transport payload` as an explicit advisor/plugin diagnostic (currently silent).

## Phase B — Codex advisor hook reliability

**Scope:** HOOK-P1-002 (fail-open SIGNAL_KILLED) + HOOK-P1-003 (invalid `codex hooks list` probe).

### Step B.1 — Policy detector fix (HOOK-P1-003)
- Replace `codex hooks list` probe in `lib/codex-hook-policy.ts` with `.codex/settings.json` file existence + JSON parse check.
- Scrub Superset/TUI env vars (`CODEX_TUI_RECORD_SESSION`, `CODEX_TUI_SESSION_LOG_PATH`, `CODEX_CI`) from the `codex --version` probe's `spawnSync` env.
- Update `tests/codex-hook-policy.vitest.ts` with: valid version + invalid `hooks list`, Superset env timeout simulation, `.codex/settings.json` positive detection.

### Step B.2 — Hook timeout + native path (HOOK-P1-002)
- In `hooks/codex/user-prompt-submit.ts`: when native advisor path is available (`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/` daemon reachable), use in-process scorer instead of spawning Python subprocess.
- Extend subprocess timeout to `3000ms` (configurable via `SPECKIT_CODEX_HOOK_TIMEOUT_MS`).
- On timeout, return a prompt-safe stale advisory: `hookSpecificOutput.additionalContext: "Advisor: stale (cold-start timeout)"` with `status:"stale"` diagnostic — NOT empty `{}` + `SIGNAL_KILLED`.

### Step B.3 — Compiled-entrypoint smoke test
New vitest `tests/codex-user-prompt-submit-hook.vitest.ts` that execs `dist/hooks/codex/user-prompt-submit.js` with a realistic payload and asserts non-empty `additionalContext`.

## Phase C — Copilot startup wiring + docs truth-sync

**Scope:** HOOK-P1-004, HOOK-P1-005, HOOK-P2-001, HOOK-P2-004.

### Step C.1 — Copilot JSON route (HOOK-P1-004)
- Update `.github/hooks/superset-notify.json`: `sessionStart` entry → `.github/hooks/scripts/session-start.sh`.
- Wrapper already fans out to Superset inline (line 41). No Superset-side change needed.
- Update `tests/copilot-hook-wiring.vitest.ts` to assert wrapper route.

### Step C.2 — Codex lifecycle docs (HOOK-P1-005)
- Choose: (a) create `.codex/agents/context-prime.toml`, OR (b) remove `context-prime` claims from packet docs.
- **Decision** (ADR-002): option (b) — remove claims. Codex startup uses `session_bootstrap` MCP tool per install guide. The `context-prime` reference in `024/030/implementation-summary.md:143` is corrected.
- Add a doc lint script (optional) that `grep -l context-prime` returns no matches without a corresponding file.

### Step C.3 — Codex hooks README (HOOK-P2-001)
- Rewrite `hooks/codex/README.md:19` area: describe current state (settings.json + policy.json present, lifecycle hooks absent, prompt hook smoke verification recommended, known SIGNAL_KILLED → stale fallback).

### Step C.4 — Runtime matrix docs (HOOK-P2-004)
- Add 2-column-split matrix to `.opencode/skill/system-spec-kit/references/config/hook_system.md`, `AGENTS.md`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`: **prompt hook** | **lifecycle hook** per runtime. Codex: `yes | no`. Copilot: `yes | yes (via repo wrapper)`. Claude: `yes | yes`. OpenCode: `no (advisor separate) | yes (plugin)`.

## Phase D — Codex PreToolUse policy hardening

**Scope:** HOOK-P2-002 + HOOK-P2-003.

### Step D.1 — Policy coverage (HOOK-P2-002)
- `CodexPolicyFile` type: accept `bashDenylist` AND `bash_denylist`.
- `loadPolicy()`: merge both keys if present.
- `bashCommandFor()`: parse `toolInput.command` (camelCase) in addition to existing casings.
- `.codex/policy.json` default denylist: add bare `git reset --hard`.
- Tests: three new cases in `codex-pre-tool-use.vitest.ts`.

### Step D.2 — Remove filesystem side-effect (HOOK-P2-003)
- `loadPolicy()`: if policy file missing, use in-memory default (do NOT write).
- `ensurePolicyFile()` → renamed to `ensurePolicyBootstrap()` and moved to a setup script or session_bootstrap handler.
- PreToolUse fail-open path: log `status: "in_memory_default"` diagnostic.
- Tests: missing-file case asserts no filesystem write.

## Commit Sequence

```
feat(029/A): OpenCode plugin transport fix (HOOK-P1-001 + P2-005)
feat(029/B): Codex advisor hook reliability (HOOK-P1-002 + P1-003)
feat(029/C): Copilot wiring + docs truth-sync (HOOK-P1-004 + P1-005 + P2-001 + P2-004)
feat(029/D): Codex PreToolUse policy hardening (HOOK-P2-002 + P2-003)
docs(029): remediation log + source deep-dive cross-reference
```

Each commit runs: typecheck + build + vitest + validate.sh on this spec folder. Python regression is NOT in scope for this phase (hook-specific — no skill-advisor scoring changes).

## Rollback

Per-phase: `git reset --hard <pre-phase-SHA>`.

Full: `git reset --hard <pre-029-SHA>` — preserves the scaffolding commit for re-use.

## Test Strategy

- **Vitest suites touched**: `session-resume.vitest.ts`, `opencode-plugin.vitest.ts`, `codex-hook-policy.vitest.ts`, `codex-user-prompt-submit-hook.vitest.ts` (new), `codex-pre-tool-use.vitest.ts`, `copilot-hook-wiring.vitest.ts`.
- **Smoke tests**: bridge stdout shape, compiled entrypoint smoke (documented under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/`).
- **Integration**: Phase A real-bridge contract test ensures HOOK-P1-001 doesn't silently regress.

## Risk + Mitigation

| Risk | Mitigation |
| --- | --- |
| `buildOpencodeTransport()` helper changes non-minimal path behavior | Snapshot test on non-minimal output before + after |
| Native advisor path not yet daemon-backed at hook time | Fall back to extended-timeout Python subprocess; emit `status: "python_fallback"` |
| Copilot JSON route change breaks Superset fan-out | Wrapper preserves `superset-notify.sh` call; verified in smoke |
| Doc changes drift from code reality | Doc-lint `grep` check runs in CI (optional stretch) |
<!-- /ANCHOR:plan-phase-details-029 -->
