---
title: "Spec: Delete Vestigial Embedding-Readiness Gate"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Delete the vestigial isEmbeddingModelReady/waitForEmbeddingModel gate from memory-search.ts that became dead code after T016-T019 lazy-loading migration. The gate blocks any in-process probe outside full server bootstrap, surfaced as the v1.0.3 stress test live-handler probe failure."
trigger_phrases:
  - "010-vestigial-embedding-readiness-gate-removal"
  - "embedding readiness gate removal"
  - "memory-search readiness gate"
  - "vestigial embedding gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-vestigial-embedding-readiness-gate-removal"
    last_updated_at: "2026-04-29T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 1 spec for vestigial embedding-readiness gate removal"
    next_safe_action: "Delete gate at memory-search.ts:927-932; reduce import on line 61; run focused tests"
    blockers: []
    completion_pct: 5
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Delete Vestigial Embedding-Readiness Gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source finding** | Phase J research RQ2 in sibling packet `011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research` + direct code investigation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The v1.0.3 stress test (Phase H) failed to capture full live-handler envelopes because the direct `handleMemorySearch` probe hit `Embedding model not ready after 30s timeout` at `memory-search.ts:930`. The probe runs the handler in-process without the full `context-server.ts` bootstrap path.

Root cause: `memory-search.ts:927-932` gates pipeline execution on a module-level boolean (`embeddingModelReady` in `db-state.ts:84`) that is **only flipped to `true` by `context-server.ts:1835` during full server bootstrap**:

```ts
// context-server.ts:1830-1835
// T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled
// in shared embeddings, so startup no longer branches on shouldEagerWarmup().
console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
// Mark embedding as "ready" since it will self-initialize on first use
setEmbeddingModelReady(true);
```

After the **T016-T019 lazy-loading migration**, the embedding model self-initializes on first use. The readiness flag no longer protects anything — it is a leftover from the eager-warmup era.

In production (full server bootstrap), the gate is harmless dead code. In any direct in-process probe (vitest harness, packet-local runners like the v1.0.3 one, future telemetry capture seams), the importer loads `handleMemorySearch` but does NOT run `context-server.ts`'s `main()`. The flag stays `false`. `waitForEmbeddingModel` polls a static `false` for 30s, then throws.

### Purpose

Remove the dead gate so in-process probes work without test-only bypass scaffolding.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete `memory-search.ts:927-932` readiness check.
- Reduce import at `memory-search.ts:61` to remove `isEmbeddingModelReady` and `waitForEmbeddingModel` (only `checkDatabaseUpdated` remains used in this file).
- Run focused vitest suites: `mcp_server/tests/handler-memory-search.vitest.ts`, `mcp_server/tests/memory-search-integration.vitest.ts`, `mcp_server/stress_test/search-quality/*.vitest.ts`, plus any test that imports the gate.
- Strict validator green on this packet.

### Out of Scope

- **NOT removing** `setEmbeddingModelReady(true)` at `context-server.ts:1835`. That call is harmless and keeps the second `waitForEmbeddingModel` consumer at `context-server.ts:1307` (in `startupScan`) instant-resolving. Cleanup of the entire readiness scaffolding is a follow-up.
- **NOT removing** the `db-state.ts` exports (`isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel`). Other consumers exist (server bootstrap + startup scan + tests). Full deprecation is a separate packet.
- **NOT removing** test mocks of these functions (e.g., `tests/adaptive-ranking-e2e.vitest.ts:29-30`, `memory-context.resume-gate-d.vitest.ts:15-16`). Those mocks become unnecessary noise but don't break anything; cleanup is a separate packet.
- **NOT changing** error semantics for any other code path. Only the in-handler gate is deleted.

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Edit (delete 6 lines + reduce import) | Remove vestigial readiness gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Readiness gate deleted from memory-search.ts. | Lines 927-932 no longer present; cache-miss branch builds `pipelineConfig` directly. |
| REQ-002 | Imports cleaned. | Line 61 imports only `checkDatabaseUpdated`. |
| REQ-003 | Focused vitest suites pass. | `handler-memory-search.vitest.ts`, `memory-search-integration.vitest.ts`, `search-quality/*.vitest.ts` exit 0. |
| REQ-004 | Build clean. | TypeScript compiles via the existing build script (`npm run build` or equivalent in `mcp_server/`). |
| REQ-005 | Strict validator passes on this packet. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

1. **Given** a direct in-process call to `handleMemorySearch` with a non-cached query, when the call runs without server bootstrap, then it does NOT throw `Embedding model not ready after 30s timeout` — it proceeds to pipeline execution (which may then succeed, fail at a real downstream cause, or use lazy embedding loading naturally).
2. **Given** the production MCP server flow, when `handleMemorySearch` runs after `context-server.ts` bootstrap, then behavior is unchanged (the gate was a no-op there anyway).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Gate deleted; imports cleaned.
- **SC-002**: Focused vitest exits 0.
- **SC-003**: Build clean.
- **SC-004**: Strict validator exits 0 on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A caller relies on the `Embedding model not ready after 30s timeout` error string for routing | Search for this exact string in the repo; if any consumer matches, escalate to the user before deleting |
| Risk | An untested code path actually needs the gate | Lazy-loading covers "model not loaded yet" at the actual embedding call site; production never hits the gate (flag set true at bootstrap); probe contexts cannot benefit from a gate that polls a never-flipped flag |
| Dependency | None | Single-file delete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should follow-up packet remove the entire readiness scaffolding (`db-state.ts` flag + `context-server.ts:1307` startupScan wait + `setEmbeddingModelReady(true)` at line 1835)? **Default**: yes, but as a separate packet to keep this change minimal.
<!-- /ANCHOR:questions -->
