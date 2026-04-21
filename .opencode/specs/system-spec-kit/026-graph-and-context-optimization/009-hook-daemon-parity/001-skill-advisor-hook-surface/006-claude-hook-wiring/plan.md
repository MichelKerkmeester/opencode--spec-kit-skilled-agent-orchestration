---
title: "Implementation Plan: Claude Hook Wiring (UserPromptSubmit)"
description: "Single new Claude hook entry script that parses UserPromptSubmit JSON, calls buildSkillAdvisorBrief, and emits hookSpecificOutput.additionalContext. Fail-open on any error."
trigger_phrases:
  - "020 006 plan"
  - "claude hook plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T14:04:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Plan executed for Claude UserPromptSubmit runtime hook"
    next_safe_action: "Dispatch 007 Gemini/Copilot and 008 Codex follow-on adapters"
    blockers: []
    key_files: []

---
# Implementation Plan: Claude Hook Wiring (UserPromptSubmit)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM, Node 20+) |
| **Runtime** | Claude Code CLI |
| **Hook Event** | `UserPromptSubmit` |
| **Transport** | JSON `hookSpecificOutput.additionalContext` |

### Overview

Add `hooks/claude/user-prompt-submit.ts` alongside existing `session-prime.ts`. Script reads stdin JSON, parses Claude's documented hook envelope, calls 004's `buildSkillAdvisorBrief()`, and emits the rendered brief via `hookSpecificOutput.additionalContext`. Registered in `.claude/settings.local.json`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 005 hard gate lifted (all P0 items green)
- [x] 004 producer merged

### Definition of Done
- [x] 6 acceptance scenarios green
- [x] Parity test confirms shared fixtures match across Claude hook + direct producer
- [x] Hook registered in `.claude/settings.local.json`
- [x] Manual smoke test deferred to T9 integration gauntlet; direct CLI smoke with simulated stdin passed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file hook script that delegates to the producer. Same shape as `session-prime.ts` sibling.

### Key Components

```
mcp_server/
  hooks/claude/
    session-prime.ts                 (existing — no changes)
    user-prompt-submit.ts            NEW — this packet
  tests/
    claude-user-prompt-submit-hook.vitest.ts   NEW
.claude/
  settings.local.json                EDIT — register UserPromptSubmit hook
```

### Data Flow

```
Claude CLI emits UserPromptSubmit event
  ├─ stdin: { prompt, session_id, cwd, transcript_path }
  ├─ hook script reads stdin, parses JSON
  ├─ if (env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === "1") → empty stdout, exit 0
  ├─ try: result = await buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot: cwd })
  ├─ catch: → empty stdout, exit 0
  ├─ if (result.brief === null) → empty stdout, exit 0
  ├─ else: stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: result.brief } }))
  ├─ emit diagnostic JSONL line to stderr (no prompt content)
  └─ exit 0
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hook script
- [x] Create `hooks/claude/user-prompt-submit.ts`
- [x] Implement stdin read + JSON parse with defensive error handling
- [x] Call `buildSkillAdvisorBrief()`
- [x] Emit `hookSpecificOutput.additionalContext` on brief
- [x] Fail-open on any exception

### Phase 2: Settings registration
- [x] Edit `.claude/settings.local.json` to register `UserPromptSubmit` hook
- [x] Verify existing SessionStart / PreCompact / Stop hooks still present

### Phase 3: Tests
- [x] Write `claude-user-prompt-submit-hook.vitest.ts`
- [x] Cover 6 acceptance scenarios
- [x] Parity test with 005 fixtures

### Phase 4: Smoke test
- [x] Real Claude session — deferred to T9 integration gauntlet per mission; direct CLI smoke executed
- [x] Record smoke test result in implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Stdin parse, output shape | vitest |
| Integration | End-to-end with mocked producer | vitest |
| Parity | Shared fixtures (5 core) normalize identically | vitest + 005 comparator |
| Smoke | Real Claude session | Manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 004 producer | Predecessor | Complete |
| 005 renderer + harness | Predecessor (HARD GATE) | Complete |
| Claude CLI | Runtime | Live |
| `.claude/settings.local.json` | Settings | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: hook blocks a Claude turn OR smoke test fails.

**Procedure**: remove entry from `.claude/settings.local.json`. Hook script remains in repo but is no-op; re-enable after fix.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Hook script | Low-Med | 2-3 hours |
| Settings registration | Low | 30 min |
| Tests | Med | 2-3 hours |
| Smoke | Low | 30 min |
| **Total** | | **5-7 hours (0.75-1.25 days)** |
<!-- /ANCHOR:effort -->
