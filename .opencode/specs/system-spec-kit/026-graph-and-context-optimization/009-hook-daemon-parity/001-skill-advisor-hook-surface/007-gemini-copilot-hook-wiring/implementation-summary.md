---
title: "Implementation Summary: Gemini + Copilot Hook Wiring"
description: "Gemini + Copilot user-prompt advisor hooks shipped with 3-runtime parity harness and runtime capability matrix."
trigger_phrases:
  - "020 007 summary"
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T14:25:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Gemini + Copilot user-prompt advisor hooks implemented with 3-runtime parity harness"
    next_safe_action: "dispatch-008-codex-integration"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts"

---
# Implementation Summary: Gemini + Copilot Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> 020/007 shipped Gemini and Copilot user-prompt advisor adapters. Interactive runtime smoke is deferred to the T9 gauntlet per packet instruction.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-gemini-copilot-hook-wiring |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessors** | `../004-*`, `../005-*`, `../006-*` |
| **Position in train** | 6 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the 020/007 runtime adapter slice:

- Gemini `BeforeAgent` prompt-equivalent adapter that parses prompt payloads, calls `buildSkillAdvisorBrief(..., { runtime: 'gemini' })`, and emits JSON `hookSpecificOutput.additionalContext` only when a rendered brief exists.
- Copilot `userPromptSubmitted` adapter with load-time SDK package detection, SDK-first `onUserPromptSubmitted` return-object support, and wrapper fallback that creates an in-memory advisor preamble when the SDK is unavailable.
- Cross-runtime parity harness covering Claude, Gemini, Copilot SDK, and Copilot wrapper variants across the 5 canonical 005 fixtures.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Created | Gemini JSON `additionalContext` adapter |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Created | Copilot SDK + wrapper fallback adapter |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts` | Created | Gemini unit coverage for schema parsing, no-op, fail-open, disabled flag, p95 |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` | Created | Copilot SDK/wrapper coverage, notification-only rejection, privacy, p95 |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Created | 5-fixture visible-text parity across Claude, Gemini, and Copilot |
| `.gemini/settings.json` | Modified | Registered `speckit-user-prompt-advisor` under `BeforeAgent` |
| `.github/hooks/superset-notify.json` | Modified locally | Registered Copilot userPromptSubmitted command before Superset fallback; file is excluded by `.git/info/exclude` |
| `tasks.md` | Modified | Marked T001-T029 complete with evidence |
| `checklist.md` | Modified | Marked P0/P1 verification complete; interactive smokes explicitly deferred |
| `implementation-summary.md` | Modified | Recorded capability matrix, decisions, verification, and limitations |

### Runtime Capability Matrix

| Runtime | Transport | SDK Required | Wrapper Available | Evidence |
|---------|-----------|--------------|-------------------|----------|
| Claude | JSON `hookSpecificOutput.additionalContext` via 006 | No | N/A | Parity baseline in `advisor-runtime-parity.vitest.ts` |
| Gemini | JSON `hookSpecificOutput.additionalContext` under `BeforeAgent` | No | No | `gemini-user-prompt-submit-hook.vitest.ts` + parity |
| Copilot SDK | `onUserPromptSubmitted` returns `{ additionalContext }` | Yes | Yes, if SDK unavailable | `copilot-user-prompt-submit-hook.vitest.ts` SDK branch |
| Copilot local checkout | Wrapper fallback (`promptWrapper` + in-memory `modifiedPrompt`) | SDK unavailable locally | Yes | `npm ls`/dynamic import checks returned unavailable; wrapper branch covered |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the 006 Claude hook structure and the 005 renderer/normalizer:

1. Gemini mirrors the Claude JSON envelope but extracts prompt text defensively from both direct `prompt` and nested `request.prompt` payload shapes.
2. Copilot performs load-time SDK package probes for `@github/copilot-cli`, `@github/copilot-sdk`, and `@ai-sdk/github-copilot`. None are installed in this checkout, so CLI execution routes to wrapper fallback while SDK exports remain testable and ready for a runtime that loads the hook module directly.
3. The parity harness centralizes runtime enumeration in `const RUNTIMES = ['claude', 'gemini', 'copilot'] as const;` so 008 can add `'codex'` with a small diff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Reused renderer-owned brief text for all runtimes; adapters only translate transport.
- Kept Copilot notification-only `{}` separate from model-visible success; wrapper fallback must produce `promptWrapper` when a brief exists.
- Did not persist or log rewritten Copilot prompts; wrapper-transformed prompt text exists only in memory and diagnostics omit prompt fields.
- Deferred real interactive Gemini/Copilot smoke to the T9 gauntlet as instructed by the packet.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Gemini hook suite | PASS | `npx vitest run tests/gemini-user-prompt-submit-hook.vitest.ts ...` in 3-file run |
| Copilot hook suite | PASS | `npx vitest run tests/copilot-user-prompt-submit-hook.vitest.ts ...` in 3-file run |
| Runtime parity suite | PASS | `npx vitest run tests/advisor-runtime-parity.vitest.ts ...` in 3-file run |
| TypeScript | PASS | `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` exited 0 |
| Interactive Gemini smoke | Deferred | Packet says defer real interactive smoke to T9 gauntlet |
| Interactive Copilot smoke | Deferred | Packet says defer real interactive smoke to T9 gauntlet; SDK unavailable locally |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Local Copilot SDK packages are not installed, so the SDK path is implemented and unit-tested with dependency injection but not runtime-captured against a real Copilot SDK in this session.
- `.github/hooks/superset-notify.json` is excluded by `.git/info/exclude`; the local registration was updated, but orchestrator may need to force-add or apply equivalent runtime config outside git if that file remains intentionally local.
- Real interactive Gemini/Copilot smoke remains deferred to the T9 gauntlet.
<!-- /ANCHOR:limitations -->
