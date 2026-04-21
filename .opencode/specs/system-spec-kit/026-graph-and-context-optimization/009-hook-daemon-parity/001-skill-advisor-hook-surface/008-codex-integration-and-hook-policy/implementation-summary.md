---
title: "Implementation Summary: Codex Integration + Hook Policy"
description: "Codex detector, UserPromptSubmit adapter, Bash-only PreToolUse deny, prompt-wrapper fallback, and 4-runtime parity shipped; .codex registration blocked by sandbox EPERM."
trigger_phrases:
  - "020 008 summary"
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/008-codex-integration-and-hook-policy"
    last_updated_at: "2026-04-19T16:40:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Codex detector + hook adapters + parity tests"
    next_safe_action: "Apply .codex registration"
    blockers: [".codex/settings.json and .codex/policy.json writes denied by sandbox EPERM"]
    key_files: []

---
# Implementation Summary: Codex Integration + Hook Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

Codex runtime integration is implemented and verified for the code/test surface. The only remaining blocker is repo-local `.codex/` configuration: this sandbox rejected writes to `.codex/settings.json` and `.codex/policy.json` with `EPERM`, so hook registration and the versioned curated denylist still need to be applied outside the sandbox boundary.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-codex-integration-and-hook-policy |
| **Completed** | 2026-04-19 (code/tests), with `.codex/` registration blocked |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessors** | `../002-*`, `../004-*`, `../005-*` |
| **Position in train** | 7 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the Codex hook surface as a first-class runtime alongside Claude, Gemini, and Copilot:

- Dynamic `detectCodexHookPolicy()` probes `codex --version` and `codex hooks list`, caches once per process session, and reports `live`, `partial`, or `unavailable`.
- Codex `UserPromptSubmit` adapter defensively parses stdin and argv JSON, with stdin winning when both are present.
- Codex `PreToolUse` adapter denies only Bash commands that match a repo-local denylist entry; non-Bash tools emit no decision.
- Codex prompt-wrapper fallback prepends a markdown-comment advisor preamble only when the detector reports `unavailable`.
- Runtime parity now covers `claude`, `gemini`, `copilot`, and `codex` across the five canonical advisor fixtures.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Added | Dynamic Codex hook policy detector |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts` | Modified | Uses dynamic Codex detector instead of hard-coded unavailable |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Added | Codex prompt-time advisor adapter |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Added | Bash-only PreToolUse deny policy |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Added | Legacy fallback prompt wrapper |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts` | Added | Detector unit tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Added | Stdin/argv adapter tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts` | Added | Bash-only deny tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts` | Added | Fallback wrapper tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Modified | Adds Codex as 4th runtime |
| `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts` | Modified | Allows dynamic Codex hook policy |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts` | Modified | Recovery expectation follows dynamic Codex policy |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts` | Modified | Codex fixture uses dynamic detector |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/codex-runtime-capability.json` | Added | Sandbox runtime capability capture |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Runtime capability fixture: `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/codex-runtime-capability.json`
- Sandbox capture: `codex --version` returned `codex-cli 0.121.0`; `codex hooks list` returned CLI argument error, so detector outcome is `partial`.
- Grep result: `rg "hookPolicy.*unavailable" .opencode/skill/system-spec-kit/mcp_server --glob '!dist/**' --glob '!**/tests/**'` returned 0 hits.
- Parity: 4 runtimes produce identical `additionalContext` for five advisor fixtures.
- Real Codex smoke remains deferred to T9 per execution plan.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Inherits ADR-002 + ADR-003 + ADR-004 from parent. Additional implementation decisions:

- Version-known but hook-inspection-probe failure is `partial`, not `unavailable`, because modern Codex can expose prompt hooks without a `hooks list` CLI surface.
- Stdin is canonical for Codex hook JSON and wins over argv when both are present; argv remains a compatibility path.
- PreToolUse enforcement is intentionally Bash-only; Edit/Read/Write and other tools emit no decision.
- Prompt-wrapper fallback is gated on detector result `unavailable`; `live` and `partial` use native paths.
- `session-prime.ts` remains deferred because this packet targets prompt-time advice and Bash-only policy, not startup/session recovery.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `codex-hook-policy.vitest.ts` | PASS | Focused Vitest run |
| `codex-user-prompt-submit-hook.vitest.ts` | PASS | Focused Vitest run |
| `codex-pre-tool-use.vitest.ts` | PASS | Focused Vitest run |
| `codex-prompt-wrapper.vitest.ts` | PASS | Focused Vitest run |
| `advisor-runtime-parity.vitest.ts` | PASS | 4 runtime parity across 5 fixtures |
| `runtime-detection.vitest.ts` + `cross-runtime-fallback.vitest.ts` | PASS | Dynamic Codex policy compatibility |
| `npx tsc --noEmit --composite false -p tsconfig.json` | PASS | TypeScript clean |
| hard-coded `hookPolicy: "unavailable"` grep | PASS | 0 code hits outside tests/specs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `.codex/settings.json` and `.codex/policy.json` could not be created in this sandbox. Both `apply_patch` and direct Node filesystem writes failed with `EPERM`.
- Manual Codex smoke is deferred to T9 per execution plan.
- `session-prime.ts` for Codex is intentionally deferred; prompt-time advice and Bash-only enforcement are the approved scope for this packet.
<!-- /ANCHOR:limitations -->
