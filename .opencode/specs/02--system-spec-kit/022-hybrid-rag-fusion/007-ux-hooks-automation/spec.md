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
| **Branch** | `007-ux-hooks-automation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Mutation handlers had inconsistent post-mutation follow-up behavior and uneven UX hint output across save/update/delete paths. Missing shared hook modules, uneven response contracts, and context-server hint wiring gaps created avoidable regressions and reduced operator guidance.

### Purpose
Ship predictable post-mutation automation for memory handlers, expose structured post-mutation UX hints, and keep context auto-surface behavior consistent so operators receive actionable follow-up guidance in successful responses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared post-mutation hook automation for memory save/update/delete/bulk-delete and atomic save paths
- `memory_health` optional `autoRepair` behavior with repair metadata output
- Checkpoint delete safety via `confirmName` and metadata reporting
- Schema and type updates required for new params and response contracts
- New hook modules `hooks/mutation-feedback.ts` and `hooks/response-hints.ts`
- Hook barrel and hook README updates for discoverable exports and usage docs
- `MutationHookResult` extension with latency and cache-clear booleans
- Mutation handler UX payload updates: `postMutationHooks` data and response hints
- `context-server.ts` success-path hint append via `appendAutoSurfaceHints(...)` while preserving `autoSurfacedContext`
- Manual test playbook scenario coverage for UX hook behavior (`NEW-103+`)

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
| `.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts` | Add | Centralize mutation feedback metadata builder |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts` | Add | Centralize UX hint generation and append helpers |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` | Modify | Export new hook modules from barrel |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` | Modify | Document hook contracts and usage |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Modify | Extend `MutationHookResult` with latency/cache-clear booleans |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Modify | Append success-path UX hints before returning responses |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Add schema validation for new parameters |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Sync tool schema definitions |
| `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` | Modify | Sync MCP tool type contracts |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts` | Add | Validate hook module behavior and payload shape |
| `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modify | Validate auto-surface hint appending on success responses |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-manual-testing-per-playbook/manual-test-playbooks.md` | Modify | Add NEW-103+ manual scenarios for UX hooks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared post-mutation hooks run automatically after memory mutations | Save/update/delete/bulk-delete and atomic save paths all invoke shared hook behavior and return `postMutationHooks` payloads |
| REQ-002 | Destructive checkpoint delete requires explicit confirmation name | Delete call without matching `confirmName` is rejected safely |
| REQ-006 | Successful mutation responses include operator-facing UX hints | Response payload includes structured hint signals and mutation feedback metadata when applicable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `memory_health` supports optional auto-repair with structured reporting | `autoRepair` runs return explicit repair metadata in handler output |
| REQ-004 | Schemas/types stay aligned with new parameters and outputs | Tool input schemas and type definitions validate added params and metadata contracts |
| REQ-005 | Validation-facing UX artifacts remain consistent with implemented behavior | Checklist evidence and acceptance scenarios map directly to implemented mutation safety and automation behavior |
| REQ-007 | Manual test playbook covers UX hook additions | `../016-manual-testing-per-playbook/manual-test-playbooks.md` includes NEW-103+ scenarios for hook modules, handler hints, context-server hint append, and automated verification commands |

### Acceptance Scenarios

1. **Given** a memory save, update, delete, bulk-delete, or atomic save operation succeeds, **When** the mutation completes, **Then** shared post-mutation hooks execute automatically for that path.
2. **Given** a checkpoint delete request is sent without a matching `confirmName`, **When** validation runs, **Then** the delete is rejected with a safe failure response and no checkpoint is removed.
3. **Given** `memory_health` is called with `autoRepair: true`, **When** repair actions run, **Then** the response includes structured repair metadata describing what was repaired.
4. **Given** new mutation safety parameters and output fields are introduced, **When** tool input schemas and types are checked, **Then** schema and type contracts remain aligned and validation passes.
5. **Given** a duplicate-content save becomes a no-op, **When** the response is assembled, **Then** it explains that caches were left unchanged and does not emit false `postMutationHooks` or cache-clearing hints.
6. **Given** `context-server.ts` returns a successful tool response, **When** final payload assembly runs, **Then** `appendAutoSurfaceHints(...)` executes before token-budget enforcement, `autoSurfacedContext` remains present, and `meta.tokenCount` reflects the finalized envelope.
7. **Given** manual verification coverage is updated, **When** reviewing the manual playbook, **Then** NEW-103+ scenarios define exact prompts, exact command sequences, expected signals, evidence, pass/fail, and triage paths.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: TypeScript build and lint both pass for the MCP server (`npx tsc -b` and `npm run lint`)
- **SC-002**: The fresh remediation-pass combined UX hook verification rerun passes across 9 files / 485 tests, and MCP SDK stdio smoke validation succeeds with 28 tools listed
- **SC-003**: Manual playbook `../016-manual-testing-per-playbook/manual-test-playbooks.md` contains NEW-103+ scenarios covering UX hooks and context-server hint behavior
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing command scripts and hook wrappers | Delayed rollout if wrappers differ by command | Start with shared wrapper and phase command migration |
| Risk | Guardrails become too strict and block valid expert workflows | Med | Allow explicit override path with warning and audit note |
| Risk | MCP stdio startup regresses if runtime code writes advisory output to stdout | High | Keep MCP server startup and runtime hook/indexing paths on stderr-safe logging and retain stdio regression coverage plus MCP SDK client smoke validation |
| Dependency | Provider/model-aware cache identity must resolve before lazy embeddings initialization | Med | Preserve the `tests/embeddings.vitest.ts` regression that proves `getModelName()` no longer returns `not-loaded` for cache identity |
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

- Which deferred follow-on should lead the next phase: structured response actions or a shared success-hint composition layer? See `research.md` for the ranked recommendation set and evidence.
- Should broader hook expansion stay incremental (Option A) or move to a small lifecycle registry (Option B) once the current startup and reliability hardening is stable? See `research.md` for the synthesis and tradeoffs.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
