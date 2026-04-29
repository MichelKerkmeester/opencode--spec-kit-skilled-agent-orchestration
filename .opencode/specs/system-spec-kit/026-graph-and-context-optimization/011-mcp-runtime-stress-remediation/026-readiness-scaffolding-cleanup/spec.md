---
title: "Spec: Readiness Scaffolding Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Mechanical cleanup of vestigial embedding-readiness scaffolding remaining after 010-vestigial-embedding-readiness-gate-removal: remove db-state.ts exports, context-server.ts callers, and 8 test mock files."
trigger_phrases:
  - "026-readiness-scaffolding-cleanup"
  - "readiness scaffolding cleanup"
  - "embedding readiness deprecation"
  - "isEmbeddingModelReady removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup"
    last_updated_at: "2026-04-29T09:45:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Removed vestigial embedding-readiness scaffolding and verified zero references"
    next_safe_action: "Resolve unrelated Vitest failures before claiming full-suite green"
    blockers:
      - "Full vitest suite reported unrelated failures and then did not terminate within the observed window"
    completion_pct: 95
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Readiness Scaffolding Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implemented, verification limited |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Source** | Known-limitation follow-up after `010-vestigial-embedding-readiness-gate-removal` commit `e91d2c7c2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet `010-vestigial-embedding-readiness-gate-removal` (commit `e91d2c7c2`) deleted the readiness gate at `memory-search.ts:927-932` but kept the surrounding scaffolding untouched as out-of-scope:

- `db-state.ts:84` `let embeddingModelReady: boolean = false;`
- `db-state.ts:559` `export function isEmbeddingModelReady(): boolean`
- `db-state.ts:564` `export function setEmbeddingModelReady(ready: boolean): void`
- `db-state.ts:569` `export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean>`
- `core/index.ts:58-60` re-exports
- `context-server.ts:1307` calls `await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS)` in `startupScan` — no-op now (flag is true at bootstrap)
- `context-server.ts:1835` `setEmbeddingModelReady(true)` at server bootstrap — no-op now
- 8 test files mock `isEmbeddingModelReady`/`waitForEmbeddingModel` to `() => true` purely to bypass the deleted gate (mocks now unnecessary noise)

After the T016-T019 lazy-loading migration, the embedding model self-initializes on first use. None of this scaffolding protects anything. Removing it eliminates dead code that future readers must mentally route around.

### Purpose

Remove the entire vestigial readiness scaffolding mechanically. No new behavior. No design decisions. Single goal: dead code goes away.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove `embeddingModelReady` flag declaration (`db-state.ts:84`).
- Remove `isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel` function definitions (`db-state.ts:558-581`).
- Remove re-exports in `core/index.ts:58-60`.
- Remove the `await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS)` block in `context-server.ts` `startupScan` (lines 1306-1313 inclusive — both the wait AND the not-ready early-return become dead).
- Remove the `setEmbeddingModelReady(true)` call at `context-server.ts:1835` and the surrounding comments lines 1830-1836.
- Remove `EMBEDDING_MODEL_TIMEOUT_MS` constant if it has no other consumers.
- Remove import of `setEmbeddingModelReady, waitForEmbeddingModel` at `context-server.ts:26`.
- Remove `setEmbeddingModelReady` and `isEmbeddingModelReady` re-exports from any handler index files (e.g., `handlers/memory-crud.ts`, `handlers/index.ts`).
- Remove test mocks of `isEmbeddingModelReady` / `waitForEmbeddingModel` from each of the 8 affected files (mocks become unnecessary; remove the `vi.fn` lines but keep the test structure).
- Remove `T519-H2: setEmbeddingModelReady(true) succeeds` and `T519-H2b: setEmbeddingModelReady(false) succeeds` test cases at `tests/handler-memory-crud.vitest.ts:242-247` (they test now-deleted functions).

### Out of Scope

- Behavior changes. Production runtime must be functionally identical post-cleanup.
- Adding new readiness or health-check infrastructure.
- Touching unrelated lazy-loading code paths.
- Touching code-graph readiness scaffolding (different subsystem; covered by `025-memory-search-degraded-readiness-wiring`).

### Files to Change

| File | Action | Lines (approx) |
|------|--------|-----|
| `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts` | Edit | -25 lines (flag + 3 functions) |
| `.opencode/skill/system-spec-kit/mcp_server/core/index.ts` | Edit | -3 lines (re-exports) |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Edit | -15 lines (import + 2 call sites + comments) |
| `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts` | Edit | remove warmup readiness marker |
| `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Edit | remove scheduler readiness wait |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` (and dist .d.ts) | Edit | -2 lines (re-exports) |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` | Edit | remove lazy handler readiness exports |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Edit | remove health dependency on deleted readiness flag |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Edit | -2 lines (mocks) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts` | Edit | -4 lines (2 mock blocks) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Edit | -4 lines (2 mock blocks) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts` | Edit | -2 lines (mocks) |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts` | Edit | -2 lines (mocks) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts` | Edit | -2 lines (mocks) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts` | Edit | remove readiness mocks/comment discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts` | Edit | -10 lines (T519-H2 + T519-H2b + mock list entry) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Edit | varies (mock list entries) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Edit | remove readiness setup calls, expectations, and suite |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts` | Edit | remove readiness mocks discovered by pre-flight grep |
| `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` | Edit | remove readiness export expectations |

Pre-flight grep found these additional runtime and test references outside the original narrow list. They are included in scope because REQ-001 requires zero non-dist TypeScript references to the deleted readiness symbols.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Scaffolding fully removed. | `grep -rn "isEmbeddingModelReady\|setEmbeddingModelReady\|waitForEmbeddingModel\|embeddingModelReady" mcp_server/` (excluding /dist/) returns ZERO matches. |
| REQ-002 | TypeScript compiles. | `npx tsc --noEmit` clean. |
| REQ-003 | All vitest suites pass. | `npx vitest run` — full suite — exits 0 (or with documented unrelated pre-existing failures). |
| REQ-004 | Build artifact regenerated. | `npx tsc` (write target) clean; dist/ does not contain stale references in newly-rebuilt files. |
| REQ-005 | Strict validator on this packet exits 0. | `validate.sh <packet> --strict` passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero references to readiness scaffolding in non-dist source.
- **SC-002**: Tests pass.
- **SC-003**: Strict validator green.
- **SC-004**: Production runtime functionally identical (no behavior change).

### Acceptance Scenarios

**Given** the MCP server TypeScript source, **when** readiness symbols are grepped outside `dist/`, **then** no `isEmbeddingModelReady`, `setEmbeddingModelReady`, `waitForEmbeddingModel`, or `embeddingModelReady` references remain.

**Given** lazy embedding initialization remains active, **when** startup scan and health flows run, **then** they no longer wait on or report the deleted readiness flag.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A test outside the known 8 references the scaffolding indirectly | Pre-flight: full grep before deletion; if extra refs found, document and include in scope |
| Risk | Dist files retain stale references and confuse downstream consumers | REQ-004 covers full rebuild |
| Dependency | `010-vestigial-embedding-readiness-gate-removal` (e91d2c7c2) merged | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should `EMBEDDING_MODEL_TIMEOUT_MS` constant be deleted if it has no other consumers? **Default**: yes; verify with grep before deletion.
<!-- /ANCHOR:questions -->
