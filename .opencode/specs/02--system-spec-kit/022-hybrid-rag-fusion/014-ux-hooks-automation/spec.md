---
title: "Feature Specification: UX Hooks Automation"
description: "Define automated hook enforcement and command UX guardrails to reduce common operator mistakes in spec workflows."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "feature"
  - "specification"
  - "ux hooks"
  - "automation"
  - "guardrails"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: UX Hooks Automation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-03-05 |
| **Branch** | `014-ux-hooks-automation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Mutation handlers had inconsistent post-mutation follow-up behavior and uneven safety guarantees across save/update/delete paths. Missing shared wiring and uneven schema coverage created avoidable regressions and test instability.

### Purpose
Ship predictable post-mutation automation for memory handlers, add explicit safety parameters for destructive operations, and surface structured repair metadata for health workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared post-mutation hook automation for memory save/update/delete/bulk-delete and atomic save paths
- `memory_health` optional `autoRepair` behavior with repair metadata output
- Checkpoint delete safety via `confirmName` and metadata reporting
- Schema and type updates required for new params and response contracts

### Out of Scope
- New retrieval/ranking algorithms
- Unrelated spec command UX redesign outside memory mutation and checkpoint safety flows

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Add shared post-mutation hook wiring and atomic-save coverage |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modify | Apply shared post-mutation hook behavior to update mutations |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modify | Apply shared post-mutation hook behavior to delete mutations |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modify | Apply shared post-mutation hook behavior to bulk delete mutations |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Add optional `autoRepair` and repair metadata output |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts` | Modify | Add `confirmName` safety parameter and response metadata |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Add schema validation for new parameters |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Sync tool schema definitions |
| `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` | Modify | Sync MCP tool type contracts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared post-mutation hooks run automatically after memory mutations | Save/update/delete/bulk-delete and atomic save paths all invoke shared hook behavior |
| REQ-002 | Destructive checkpoint delete requires explicit confirmation name | Delete call without matching `confirmName` is rejected safely |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `memory_health` supports optional auto-repair with structured reporting | `autoRepair` runs return explicit repair metadata in handler output |
| REQ-004 | Schemas/types stay aligned with new parameters and outputs | Tool input schemas and type definitions validate added params and metadata contracts |
| REQ-005 | Validation-facing UX artifacts remain consistent with implemented behavior | Checklist evidence and acceptance scenarios map directly to implemented mutation safety and automation behavior |

### Acceptance Scenarios

1. **Given** a memory save, update, delete, bulk-delete, or atomic save operation succeeds, **When** the mutation completes, **Then** shared post-mutation hooks execute automatically for that path.
2. **Given** a checkpoint delete request is sent without a matching `confirmName`, **When** validation runs, **Then** the delete is rejected with a safe failure response and no checkpoint is removed.
3. **Given** `memory_health` is called with `autoRepair: true`, **When** repair actions run, **Then** the response includes structured repair metadata describing what was repaired.
4. **Given** new mutation safety parameters and output fields are introduced, **When** tool input schemas and types are checked, **Then** schema and type contracts remain aligned and validation passes.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Targeted mutation and schema tests pass (`150/150`)
- **SC-002**: Full test suite passes (`7146/7146`)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing command scripts and hook wrappers | Delayed rollout if wrappers differ by command | Start with shared wrapper and phase command migration |
| Risk | Guardrails become too strict and block valid expert workflows | Med | Allow explicit override path with warning and audit note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hook precheck overhead stays under 250ms p95 per command
- **NFR-P02**: Error messaging path renders in one response without follow-up prompts

### Security
- **NFR-S01**: Guardrails must not expose secrets in error output
- **NFR-S02**: Validation failures redact local absolute paths unless explicitly requested

### Reliability
- **NFR-R01**: Hook runner failures degrade gracefully to clear warning mode
- **NFR-R02**: False-positive guardrail blocks remain under 5% in manual scenario set
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: command asks for the missing spec folder once, then exits cleanly
- Maximum length: command names over limit are rejected with truncation guidance
- Invalid format: non `NNN-topic` phase names fail with example correction

### Error Scenarios
- External service failure: hooks that rely on MCP return warning and safe-stop before write
- Network timeout: one retry for hook status fetch, then deterministic fail-fast message
- Concurrent access: lock file collision returns retry advice and last writer info

### State Transitions
- Partial completion: rerun command resumes from pre-flight gate rather than halfway state
- Session expiry: user gets concise re-entry command preserving selected phase path
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Command docs plus hook scripts in a bounded area |
| Risk | 15/25 | UX and workflow regressions possible but recoverable |
| Research | 11/20 | Existing command behavior inventory required |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should override mode be hidden behind an env flag or an explicit command option?
- Which command set is in phase scope for first release: plan/implement/complete only or all spec_kit commands?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
