---
title: "Feature Specification: Gemini + Copilot Hook Wiring"
description: "Parity expansion: Gemini JSON additionalContext adapter + Copilot SDK onUserPromptSubmitted adapter with notification-wrapper fallback. Normalized parity with Claude hook via 005 comparator."
trigger_phrases:
  - "020 gemini copilot hook"
  - "gemini user prompt submit advisor"
  - "copilot user prompt submitted advisor"
  - "cross-runtime advisor parity"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 006 converges"
    blockers: ["005-advisor-renderer-and-regression-harness", "006-claude-hook-wiring"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"

---
# Feature Specification: Gemini + Copilot Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessors** | ../004-*, ../005-* (HARD GATE), ../006-claude-hook-wiring/ |
| **Successor** | ../008-codex-integration-and-hook-policy/ (can run in parallel) |
| **Position in train** | 6 of 8 |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (parity expansion; Claude-only slice works user-visibly) |
| **Status** | Spec Ready, Blocked by 005 + 006 |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 1.25-2.5 engineering days |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 006 ships Claude's `UserPromptSubmit` adapter, Gemini and Copilot users still lack proactive advisor surfacing. Wave-2 §X3 established that Copilot's checked-in path is notification-only today (the shell wrapper discards stdin and returns `{}`), but the upstream Copilot SDK can inject model-visible `additionalContext` via `onUserPromptSubmitted`. Gemini needs a JSON-`hookSpecificOutput.additionalContext` adapter using `BeforeAgent` or its prompt-equivalent hook — plain stdout does **not** count as passing injection.

Wave-2 parity rule: all runtimes must produce identical model-visible brief text for each of the 5-7 renderer fixtures, verified via 005's `NormalizedAdvisorRuntimeOutput` comparator.

### Purpose

Ship two runtime adapters:
1. `hooks/gemini/user-prompt-submit.ts` using Gemini's prompt-equivalent hook, emitting JSON `hookSpecificOutput.additionalContext`
2. `hooks/copilot/user-prompt-submit.ts` with two paths:
   - **Preferred**: Copilot SDK `onUserPromptSubmitted` returning `{ additionalContext: "..." }`
   - **Fallback**: notification-shell-wrapper + prompt-wrapper compatibility (same as current Copilot `sessionStart` pattern)

Both adapters normalize via 005's comparator and pass the cross-runtime parity test against Claude.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

#### 3.1 Gemini adapter

- New `mcp_server/hooks/gemini/user-prompt-submit.ts`
- Transport: JSON `hookSpecificOutput.additionalContext` (same envelope shape as Claude; different event name)
- Event trigger: Gemini's `BeforeAgent` or a dedicated prompt-equivalent hook documented in `.gemini/settings.json`
- Plain text stdout is **not** a valid injection path — must be JSON
- Input shape: Gemini hook payload from stdin (documented in `.gemini/hooks/` README)
- Fail-open on any error (same contract as Claude)
- Register in `.gemini/settings.json`

#### 3.2 Copilot adapter

- New `mcp_server/hooks/copilot/user-prompt-submit.ts`
- Transport detection at runtime:
  - If SDK available + supports `onUserPromptSubmitted` return object → emit `{ additionalContext: "..." }`
  - Else → fallback to shell-wrapper + prompt-wrapper path (transform next outgoing prompt to include brief as preamble; only used when SDK path unavailable)
- **Do NOT** treat current `{}` notification success as proof of model-visible injection (wave-2 X3)
- Capture or fixture-check that the runtime exposes the SDK return object before shipping the default path
- Register in `.opencode/runtime/copilot/` wrapper config (path per existing Copilot pattern)

#### 3.3 Parity + integration tests

- New `mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts`
- New `mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts`
- New `mcp_server/tests/advisor-runtime-parity.vitest.ts`:
  - For each of 5 canonical fixtures (livePassing, stale, noPassing, failOpen, skipped):
    - Run through Claude adapter (006) → `NormalizedAdvisorRuntimeOutput`
    - Run through Gemini adapter → normalized
    - Run through Copilot adapter (SDK path + wrapper path) → normalized
    - Assert all four produce identical `additionalContext` string

### Out of Scope

- Codex adapter (belongs to 008)
- Documentation (belongs to 009)
- Modifying shared-payload envelope or producer (002/004 are upstream)
- Gemini-specific or Copilot-specific advisor behavior (renderer must stay shared per 005)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Create | Gemini adapter |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Create | Copilot adapter with SDK + wrapper paths |
| `.gemini/settings.json` | Modify | Register Gemini prompt hook |
| `.opencode/runtime/copilot/` or equivalent | Modify | Register Copilot userPromptSubmitted hook |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts` | Create | Gemini tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` | Create | Copilot tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Create | Cross-runtime parity |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gemini adapter emits JSON `hookSpecificOutput.additionalContext` | Snapshot test |
| REQ-002 | Gemini adapter registered in `.gemini/settings.json` | File diff |
| REQ-003 | Copilot adapter prefers SDK `onUserPromptSubmitted` path when available | Runtime detection + snapshot |
| REQ-004 | Copilot fallback (shell-wrapper) path: only used when SDK path unavailable | Detection test |
| REQ-005 | Cross-runtime parity: 5 canonical fixtures produce identical `additionalContext` across Claude/Gemini/Copilot | `advisor-runtime-parity.vitest.ts` green |
| REQ-006 | Gemini plain-text stdout is NOT used as injection path | Code review + test assertion |
| REQ-007 | Fail-open on any adapter error | Error injection tests |
| REQ-008 | Latency: each adapter total p95 ≤ 60 ms cache hit | Bench |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED honored per-runtime | Tests |
| REQ-021 | Diagnostic JSONL per invocation | Observability integration |
| REQ-022 | Runtime capability matrix documented in this child's implementation-summary.md | Matrix table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both adapter test files green
- **SC-002**: Parity test: 5 fixtures × 3 runtimes (Claude/Gemini/Copilot) identical
- **SC-003**: Gemini adapter registered in `.gemini/settings.json`
- **SC-004**: Copilot adapter registered; SDK-path detection tested
- **SC-005**: Manual smoke test in real Gemini session + real Copilot session
- **SC-006**: `tsc --noEmit` clean

### Acceptance Scenario 1: Gemini live brief via additionalContext
**Given** Gemini hook receives live passing fixture, **when** rendered, **then** stdout is JSON `{ hookSpecificOutput: { hookEventName, additionalContext } }`.

### Acceptance Scenario 2: Copilot SDK path
**Given** Copilot runtime exposes SDK `onUserPromptSubmitted` return object, **when** hook fires, **then** SDK return includes `{ additionalContext: <brief> }`.

### Acceptance Scenario 3: Copilot wrapper fallback
**Given** Copilot runtime does not expose SDK return object, **when** hook fires, **then** shell-wrapper path transforms next outgoing prompt to include brief as preamble.

### Acceptance Scenario 4: Cross-runtime parity
**Given** 5 canonical fixtures, **when** normalized via 005 comparator across Claude/Gemini/Copilot, **then** all three produce identical `additionalContext` strings.

### Acceptance Scenario 5: Gemini plain-text stdout rejected
**Given** advisor brief available, **when** Gemini adapter writes plain text instead of JSON, **then** parity test fails (proves plain-stdout is not injection).

### Acceptance Scenario 6: Copilot notification-only does not count
**Given** Copilot SDK path unavailable AND shell wrapper returns `{}` (notification), **when** asserted, **then** hook uses prompt-wrapper fallback (not notification) for injection.

### Acceptance Scenario 7: Fail-open per adapter
**Given** any producer error (Python missing, timeout, etc.), **when** each adapter runs, **then** no output on Gemini (empty stdout), SDK path returns `{}` on Copilot, wrapper adds no preamble.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Gemini `BeforeAgent` input schema changes | Medium | Defensive parsing; fail-open on unknown shape |
| Copilot SDK unavailable in shipped runtime | High | Fallback wrapper path + runtime detection; document capability matrix |
| Copilot wrapper path interferes with existing runtime | Medium | Reuse existing `sessionStart` wrapper pattern; isolate by hook event |
| Plain-text Gemini fallback silently works on dev but not prod | Low | Parity test blocks ship |
| Copilot SDK return object undocumented across versions | Medium | Capture fixture from wave-2 research; test runs on multiple versions if present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-adapter hook total p95 ≤ 60 ms cache hit

### Security
- **NFR-S01**: No adapter persists prompt content beyond producer-owned cache
- **NFR-S02**: Adapter stderr diagnostics are prompt-free

### Reliability
- **NFR-R01**: Fail-open on any error; never blocks or garbles a turn
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Gemini stdin shape varies by Gemini version: fail-open on unknown
- Copilot SDK API shape varies: feature-detect at load time

### Error Scenarios
- Gemini plain-text output: producer returns JSON always; adapter serializes explicitly
- Copilot wrapper silently swallowed: fallback path includes retry with prompt-wrapper
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 2 adapters + parity test + 2 settings |
| Risk | 14/25 | SDK detection variability; parity enforcement |
| Research | 4/20 | Wave-2 §X3 clarifies; validation remaining |
| **Total** | **32/70** | **Level 2 (upper)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1 (validation-only): Does the actually-shipped Copilot runtime expose the SDK return object? Answer via capture in this child; default assumption: yes on recent versions, wrapper fallback for older.
- Q2: Should the Copilot fallback wrapper be a separate entry script or embedded in the adapter? Recommend embedded (one file, branched at detection time).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessors: `../004-*`, `../005-*` (HARD GATE), `../006-claude-hook-wiring/`
- Research: `../../../research/020-pt-01/research.md §Gemini path + §Copilot path`
- Extended research: `../../../research/020-pt-02/research-extended.md §X3`
- Existing Gemini hook: `../../../../../skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- Existing Copilot hook: `../../../../../skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- 005 comparator: `../005-advisor-renderer-and-regression-harness/` (post-merge)
