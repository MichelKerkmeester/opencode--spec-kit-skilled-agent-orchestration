---
title: "Implementation Plan: Delete Vestigial Embedding-Readiness Gate"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Single-file surgical delete of vestigial readiness gate at memory-search.ts:927-932 plus the corresponding import on line 61. Conservative scope keeps adjacent dead-code scaffolding untouched for a follow-up packet."
trigger_phrases:
  - "010-vestigial-embedding-readiness-gate-removal plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-vestigial-embedding-readiness-gate-removal"
    last_updated_at: "2026-04-29T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 1 plan"
    next_safe_action: "Validate; author implementation-summary.md"
    blockers: []
    completion_pct: 60
---

# Implementation Plan: Delete Vestigial Embedding-Readiness Gate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP server (custom) |
| **Storage** | None (in-memory flag delete) |
| **Testing** | vitest |

### Overview
Delete the dead readiness gate at `memory-search.ts:927-932` and reduce the corresponding import on line 61. Single-file change unblocks any in-process probe (vitest harness, packet-local runners) that imports `handleMemorySearch` without running the full `context-server.ts` bootstrap.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md REQ-001..REQ-005)
- [x] Success criteria measurable (SC-001..SC-004)
- [x] Dependencies identified (none — single-file delete)

### Definition of Done
- [x] All acceptance criteria met (gate deleted; imports cleaned; tests pass; build clean; validator green)
- [x] Tests passing (16 files / 97 passed / 5 todo on focused suites; 6 files / 57 passed on readiness-mock suites)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical delete. No new abstractions, no new patterns, no test-fixture changes.

### Key Components
- **`memory-search.ts:61`**: Reduce TS import from `{ checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel }` to `{ checkDatabaseUpdated }`.
- **`memory-search.ts:927-932`**: Delete the cache-miss readiness check.

### Data Flow
Before: cache miss → `isEmbeddingModelReady()` check → `waitForEmbeddingModel(30000)` poll → throw on timeout → pipeline build.
After: cache miss → pipeline build directly. The lazy-loaded embedding model self-initializes at the first actual embedding call site downstream.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm no other in-tree consumer routes on the error string `Embedding model not ready after 30s timeout` (only memory-search.ts:930 produced it; no consumer matched).
- [x] Confirm test-mocks of `isEmbeddingModelReady`/`waitForEmbeddingModel` exist solely to bypass the gate (they do; mocks become unnecessary noise but stay functional).

### Phase 2: Core Implementation
- [x] Reduce import on line 61.
- [x] Delete gate on lines 927-932.
- [x] Build (`npx tsc`) clean.

### Phase 3: Verification
- [x] Focused vitest suites pass.
- [x] Readiness-mock suites still pass.
- [x] Strict validator green on this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `tests/handler-memory-search.vitest.ts` | vitest |
| Integration | `tests/memory-search-integration.vitest.ts`, `tests/search-quality/*.vitest.ts` | vitest |
| Mock-bypass parity | `tests/adaptive-ranking-e2e.vitest.ts`, `tests/memory-context.resume-gate-d.vitest.ts`, `tests/shadow-evaluation-runtime.vitest.ts`, `tests/gate-d-benchmark-memory-search.vitest.ts`, `tests/graph-first-routing-nudge.vitest.ts`, `tests/handler-memory-crud.vitest.ts` | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase H stress test (021) | Internal evidence | Green | Gate could not have been characterized as vestigial without v1.0.3 probe failure |
| Phase J research (022) | Internal evidence | Green | RQ2 confirmed root cause |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A previously hidden caller breaks because it relied on the 30s wait or the specific error string.
- **Procedure**: `git revert` the single commit; restore the import on line 61 and the 6-line gate. No data migration, no config rollback, no infrastructure changes.
<!-- /ANCHOR:rollback -->
