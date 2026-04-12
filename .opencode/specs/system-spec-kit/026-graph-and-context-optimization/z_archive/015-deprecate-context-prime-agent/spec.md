---
title: "Feature Specification: Deprecate context-prime Agent [template:level_1/spec.md]"
description: "Remove the deprecated context-prime bootstrap profile from the visible runtime agent surfaces now that SessionStart owns startup priming."
trigger_phrases:
  - "deprecate context-prime"
  - "remove context-prime agent"
  - "context-prime no longer needed"
  - "sessionstart replaces context-prime"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Deprecate context-prime Agent

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `015-deprecate-context-prime-agent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runtime agent surfaces still exposed `@context-prime` even though session startup priming is now handled by the SessionStart hook. That left a redundant bootstrap profile in the visible taxonomy and stale dispatch guidance in orchestrator documentation.

### Purpose
Remove the deprecated profile and its runtime-facing references so agent directories and root guidance reflect the current startup model.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the deprecated `context-prime` runtime profile from OpenCode, Claude, Codex, and Gemini agent surfaces
- Remove `@context-prime` references from the OpenCode and Codex orchestrator runtime definitions
- Remove the `@context-prime` entry from the root `CLAUDE.md` agent definitions
- Update the phase packet to implemented state with verification evidence

### Out of Scope
- The `@context` agent, which still owns exploration and retrieval work
- SessionStart or `session-prime.ts` runtime behavior
- Non-agent command or skill docs outside the verification surface requested for this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/` | Delete | Remove the OpenCode `context-prime` definition |
| `.claude/agents/` | Delete | Remove the Claude `context-prime` definition |
| `.codex/agents/context-prime.toml` | Delete | Remove the Codex `context-prime` mirror |
| `.gemini/agents/` | Delete | Remove the Gemini `context-prime` definition |
| `.opencode/agent/orchestrate.md` | Modify | Remove stale `@context-prime` delegation guidance |
| `.codex/agents/orchestrate.toml` | Modify | Keep the Codex runtime mirror aligned with the deprecation |
| `CLAUDE.md` | Modify | Remove the deprecated agent entry from the root directory listing |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-deprecate-context-prime-agent/` | Modify | Record completion state and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deprecated runtime profiles are removed | The OpenCode, Claude, Codex, and Gemini `context-prime` agent artifacts no longer exist after the phase is applied |
| REQ-002 | Runtime orchestration guidance no longer dispatches `@context-prime` | OpenCode and Codex orchestrator definitions contain no `@context-prime` references |
| REQ-003 | Root agent guidance matches the new runtime reality | `CLAUDE.md` no longer lists `@context-prime` in the agent definitions section |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The phase packet documents the delivered work | `spec.md`, `tasks.md`, and `implementation-summary.md` record implemented status and verification evidence |
| REQ-005 | Verification uses the scoped runtime surfaces named in the task | `rg -n "context-prime" .opencode/agent/ .claude/agents/ .codex/agents/ .gemini/agents/ CLAUDE.md` returns zero matches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No `context-prime` runtime definition remains in the scoped agent directories.
- **SC-002**: `rg -n "context-prime" .opencode/agent/ .claude/agents/ .codex/agents/ .gemini/agents/ CLAUDE.md` returns zero matches.
- **SC-003**: `validate.sh --strict` passes for the Phase 015 packet after the packet documentation is updated.
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

**Given** a maintainer inspects the scoped runtime agent directories after this phase lands, **when** they search for `context-prime`, **then** no runtime agent definition or orchestrator dispatch guidance remains.

**Given** a maintainer opens the Phase 015 packet after implementation, **when** they review the packet in isolation, **then** the status, tasks, and summary clearly show the phase is implemented and how it was verified.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing orchestrator mirrors | A stale runtime mirror can keep surfacing `@context-prime` after the primary doc is cleaned | Verify both OpenCode and Codex orchestrator definitions, then run the scoped grep |
| Dependency | Shared spec-kit validator | Packet closeout cannot be claimed cleanly if the phase remains off-template | Rewrite the packet docs to the current level-1 template before final validation |
| Risk | Over-broad cleanup outside the requested verification surface | The phase could drift into unrelated command-doc maintenance | Keep edits limited to the named runtime agent directories, `CLAUDE.md`, and the bound phase folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The phase scope and verification surface are fixed by the implementation task.
<!-- /ANCHOR:questions -->

---
