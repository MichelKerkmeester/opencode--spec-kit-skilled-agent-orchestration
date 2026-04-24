---
title: "...h-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/plan]"
description: "Two new hook adapters (Gemini JSON additionalContext, Copilot SDK + wrapper fallback) + cross-runtime parity test. Blocked by 005 hard gate and 006 landing."
trigger_phrases:
  - "020 007 plan"
  - "gemini copilot hook plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 006 converges"
    blockers: []
    key_files: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Gemini + Copilot Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) |
| **Runtimes** | Gemini CLI, Copilot CLI |
| **Transports** | Gemini: JSON `additionalContext`; Copilot: SDK `onUserPromptSubmitted` preferred, wrapper fallback |
| **Parity authority** | 005 `NormalizedAdvisorRuntimeOutput` comparator |

### Overview

Two runtime adapters that call the same producer (004) and renderer (005) and emit model-visible brief text via the runtime-native transport. Parity test enforces identical visible text across Claude/Gemini/Copilot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 005 hard gate lifted
- [ ] 006 Claude adapter merged
- [ ] Copilot SDK capability captured for repo runtime version

### Definition of Done
- [ ] Both adapters ship
- [ ] Parity test green: 5 fixtures × 3 runtimes
- [ ] Gemini + Copilot settings registered
- [ ] Manual smoke tests pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single adapter per runtime, each calling `buildSkillAdvisorBrief()` and emitting transport-native output. Parity test lives outside the adapters.

### Key Components

```
mcp_server/hooks/
  gemini/
    session-prime.ts                 (existing)
    user-prompt-submit.ts            NEW
  copilot/
    session-prime.ts                 (existing)
    user-prompt-submit.ts            NEW  (SDK path + wrapper fallback)

mcp_server/tests/
  gemini-user-prompt-submit-hook.vitest.ts    NEW
  copilot-user-prompt-submit-hook.vitest.ts   NEW
  advisor-runtime-parity.vitest.ts            NEW

.gemini/settings.json                EDIT — register Gemini hook
.opencode/runtime/copilot/ (or equiv) EDIT — register Copilot hook
```

### Data Flow (Gemini)

```
Gemini event
  ├─ stdin JSON
  ├─ adapter parses prompt
  ├─ buildSkillAdvisorBrief({ runtime: 'gemini' })
  ├─ if brief → stdout JSON { hookSpecificOutput: { additionalContext } }
  └─ else → empty stdout
```

### Data Flow (Copilot)

```
Copilot event
  ├─ SDK detection: hasSDK?
  │     yes → onUserPromptSubmitted return { additionalContext }
  │     no  → shell-wrapper path
  │            ├─ buildSkillAdvisorBrief(...)
  │            └─ wrap next outgoing prompt with "[Advisor: ...] " preamble
  └─ fail-open on any error
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gemini adapter
- [ ] Create `hooks/gemini/user-prompt-submit.ts`
- [ ] Register in `.gemini/settings.json`
- [ ] Write `gemini-user-prompt-submit-hook.vitest.ts` (6 scenarios)

### Phase 2: Copilot adapter (SDK path)
- [ ] Create `hooks/copilot/user-prompt-submit.ts` with SDK detection
- [ ] Implement `onUserPromptSubmitted` return-object path
- [ ] Write Copilot SDK-path tests

### Phase 3: Copilot adapter (wrapper fallback)
- [ ] Implement wrapper path in same file; detect at invocation time
- [ ] Write wrapper-path tests
- [ ] Ensure wrapper path never emits notification-only output (must inject)

### Phase 4: Cross-runtime parity
- [ ] Create `advisor-runtime-parity.vitest.ts`
- [ ] 5 canonical fixtures × 3 runtimes via 005's comparator
- [ ] Assert identical `additionalContext` strings

### Phase 5: Settings + smoke
- [ ] Verify Copilot runtime registration path (may follow existing `sessionStart` pattern)
- [ ] Manual Gemini smoke test
- [ ] Manual Copilot smoke test (SDK-path preferred)

### Phase 6: Verification
- [ ] All 3 test files green
- [ ] Parity 100% across 5 × 3 matrix
- [ ] `tsc --noEmit` clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Gemini adapter (stdin, output shape, fail-open) | vitest |
| Unit | Copilot SDK path + wrapper path | vitest |
| Integration | Cross-runtime parity (5 fixtures × 3 runtimes) | vitest + 005 comparator |
| Smoke | Real Gemini + Copilot sessions | Manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 004 producer | Predecessor | Pending |
| 005 renderer + comparator | Predecessor (HARD GATE) | Pending |
| 006 Claude adapter | Predecessor | Pending |
| Gemini CLI | Runtime | Live |
| Copilot CLI + SDK | Runtime | Live (version-dependent) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: parity test fails OR smoke reveals either adapter blocks a turn.

**Procedure**: unregister the failing adapter from its settings file; keep script for fix. Claude (006) remains user-visible.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Gemini adapter | Med | 2-3 hours |
| Copilot SDK path | Med-High | 3-4 hours |
| Copilot wrapper fallback | High | 3-5 hours |
| Cross-runtime parity | Med | 2-3 hours |
| Settings + smoke | Low | 1-2 hours |
| Verification | Low | 1 hour |
| **Total** | | **12-18 hours (1.25-2.5 days)** |
<!-- /ANCHOR:effort -->
