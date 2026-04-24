---
title: "...026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring/spec]"
description: "Wire the advisor brief into Claude's UserPromptSubmit event via JSON hookSpecificOutput.additionalContext. First user-visible runtime slice."
trigger_phrases:
  - "020 claude hook"
  - "userpromptsubmit advisor"
  - "claude additional context advisor"
  - "advisor prompt submit wire"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T14:04:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Claude UserPromptSubmit adapter implemented and verified"
    next_safe_action: "Dispatch 007 Gemini/Copilot and 008 Codex follow-on adapters"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Claude Hook Wiring (UserPromptSubmit)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessors** | ../004-advisor-brief-producer-cache-policy/, ../005-advisor-renderer-and-regression-harness/ (HARD GATE) |
| **Successor** | ../007-gemini-copilot-hook-wiring/ |
| **Position in train** | 5 of 8 (first user-visible slice) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (first user-visible slice) |
| **Status** | Implemented |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 0.75-1.25 engineering days |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 002-005 land, the advisor producer + renderer stack exists but is not wired to any runtime. Wave-2 §X2 established that Claude's `UserPromptSubmit` event is the cleanest first-class surface: it accepts `prompt` + standard session fields, supports model-visible context via JSON `hookSpecificOutput.additionalContext`, and uses top-level `decision: "block"` (or exit code `2`) for prompt denial. This is distinct from `SessionStart` which takes different input types.

Without this adapter, Claude users can't benefit from proactive advisor surfacing. With it, the 019/004 routing-accuracy work becomes automatic rather than dependent on Gate 2 being called.

### Purpose

Ship `mcp_server/hooks/claude/user-prompt-submit.ts` that:
- Parses the Claude `UserPromptSubmit` hook JSON from stdin
- Calls `buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot })`
- Emits JSON `hookSpecificOutput.additionalContext` with the rendered brief
- Fail-opens cleanly (no output, no decision block) on any producer error
- Passes snapshot tests against a Claude payload fixture captured in wave-2 research
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New `mcp_server/hooks/claude/user-prompt-submit.ts` entry script
- Input parsing: Claude `UserPromptSubmit` hook JSON from stdin with `prompt`, `session_id`, `cwd`, `transcript_path` fields
- Wire to `buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot: cwd })`
- Output shape: `{ "hookSpecificOutput": { "hookEventName": "UserPromptSubmit", "additionalContext": "<rendered brief>" } }`
- When `brief: null`: emit empty stdout (Claude treats as no-op)
- Top-level `decision: "block"` and exit code `2`: reserved for future policy use; NOT used by this adapter (advisor is advice-only, never blocks)
- Error handling: any exception caught → empty stdout + exit 0 (fail-open)
- Register in `.claude/settings.local.json` under `hooks.UserPromptSubmit`
- Snapshot test matching the Claude payload contract documented in wave-2 iteration 002
- Integration test using a mock Claude-invocation fixture

### Out of Scope

- Modifying existing `session-prime.ts` or `hook-state.ts` beyond reading advisor cache state (which is producer-owned, not hook-owned)
- Gemini / Copilot adapters (belongs to 007)
- Codex adapter (belongs to 008)
- `decision: "block"` policy wiring (advisor is advice-only in this phase)
- Documentation (belongs to 009)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Create | Hook entry script |
| `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts` | Create | Snapshot + integration tests |
| `.claude/settings.local.json` | Modify | Register `UserPromptSubmit` hook pointing at the new script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hook parses Claude stdin JSON with `prompt`, `session_id`, `cwd` | Integration test with fixture JSON |
| REQ-002 | Emits `{ hookSpecificOutput: { hookEventName, additionalContext } }` on successful brief | Snapshot test |
| REQ-003 | Emits empty stdout when `brief: null` | Integration test |
| REQ-004 | Fail-open: any exception → empty stdout + exit 0 | Error-injection test |
| REQ-005 | Does not use `decision: "block"` | Code review assertion |
| REQ-006 | Normalized output matches 005's comparator for shared test fixtures | Parity test |
| REQ-007 | Hook registered in `.claude/settings.local.json` | File diff |
| REQ-008 | Latency: hook total p95 ≤ 60 ms (producer p95 ≤ 50 ms + stdin parse + stdout serialize) | Bench lane in existing timing harness |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Diagnostic stderr line (JSONL) recorded per invocation | Observability integration |
| REQ-021 | Respects `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` env flag | When set, empty stdout + no producer call |
| REQ-022 | Argv fallback if stdin is empty (defensive — wave-1 noted Codex uses this) | Not required for Claude, but documented as optional resilience |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `claude-user-prompt-submit-hook.vitest.ts` green (snapshot + integration + error injection)
- **SC-002**: Parity test: shared fixtures produce identical model-visible brief across Claude vs direct producer call
- **SC-003**: Hook registered in `.claude/settings.local.json`
- **SC-004**: Manual smoke test: real Claude session invokes the hook; additionalContext surfaces in context
- **SC-005**: `tsc --noEmit` clean

### Acceptance Scenario 1: Live passing advisor produces brief
**Given** Claude hook receives `{ prompt: "refactor the auth middleware", session_id: "s1", cwd: "/workspace" }`, **when** advisor returns `livePassingSkill` result, **then** stdout contains JSON `{ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: "Advisor: live; use sk-..." } }`.

### Acceptance Scenario 2: Fail-open on Python missing
**Given** hook receives valid prompt but `python3` is absent, **when** producer fail-opens, **then** stdout is empty and exit code is 0.

### Acceptance Scenario 3: Skipped prompt → no output
**Given** prompt is `/help`, **when** hook runs, **then** stdout is empty.

### Acceptance Scenario 4: Disabled flag honored
**Given** `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` in env, **when** hook receives prompt, **then** no producer call is made; stdout is empty.

### Acceptance Scenario 5: Invalid stdin → fail-open
**Given** hook receives malformed JSON, **when** parsed, **then** stdout is empty and exit 0; stderr diagnostic recorded.

### Acceptance Scenario 6: Never uses decision: block
**Given** any advisor result, **when** hook emits output, **then** output never contains `decision: "block"` or `decision: "deny"`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Claude hook input schema drift | Medium | Defensive parsing; log schema version; fail-open on unknown shape |
| stdin buffering differences across Claude versions | Low | Use async `readAll` pattern; small timeout |
| Advisor latency blows hook budget | Medium | 004's cache absorbs repeated prompts; 005 gates p95 ≤ 50 ms |
| Hook output interferes with Claude's existing context | Low | `additionalContext` is the Claude-documented slot for this purpose |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hook total wall time p95 ≤ 60 ms (cache hit)
- **NFR-P02**: Cold-path wall time p95 ≤ 1200 ms

### Security
- **NFR-S01**: Raw prompt never logged to stderr (only structured diagnostic)
- **NFR-S02**: Hook does not persist prompt content to `.claude/` or any state file

### Reliability
- **NFR-R01**: Never throws — all errors mapped to empty stdout + exit 0
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- stdin > 1 MB: read first 1 MB, truncate; producer's internal handling applies further truncation
- `cwd` missing or non-existent: fail-open
- Multiple hooks registered: each runs independently; our hook never interferes with others

### Error Scenarios
- Subprocess killed mid-read: fail-open
- Node runtime mismatch: fail-open with stderr diagnostic
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Single script + single test file + settings.json edit |
| Risk | 10/25 | User-visible but fail-open |
| Research | 3/20 | Research converged (wave-2 §X2) |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1: Should the hook emit diagnostic JSONL to stderr by default, or gated by verbose flag? Recommend default-on (aligns with 005 observability contract) but schema-only (no prompts).
<!-- /ANCHOR:questions -->

---

### Related Documents

- Parent: `../spec.md`
- Predecessors: `../004-advisor-brief-producer-cache-policy/`, `../005-advisor-renderer-and-regression-harness/`
- Research: `../../../research/020-skill-advisor-hook-surface-pt-01/research.md §Claude path`
- Extended research: `../../../research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X2`
- Claude hook docs: Anthropic's `UserPromptSubmit` hook schema (see research-extended §X2 for citation)
- Existing Claude hook: `../../../../../skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
