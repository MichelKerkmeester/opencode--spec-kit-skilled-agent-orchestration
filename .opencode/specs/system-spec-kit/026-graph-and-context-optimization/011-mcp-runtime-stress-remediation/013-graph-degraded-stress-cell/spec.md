---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: Code Graph Degraded Stress Cell"
description: "Add an integration-style stress cell that exercises code_graph_query fallbackDecision routing end-to-end against a degraded graph using SPEC_KIT_DB_DIR / initDb isolation, closing the v1.0.2 NEUTRAL verdict on packet 005 fast-fail."
trigger_phrases:
  - "013-graph-degraded-stress-cell"
  - "code_graph_query degraded sweep"
  - "fallbackDecision integration test"
  - "SPEC_KIT_DB_DIR isolation sweep"
  - "packet 005 PROVEN verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell"
    last_updated_at: "2026-04-27T19:58:00Z"
    last_updated_by: "implementation"
    recent_action: "Authored test + docs; 5 active sweep tests passing, live DB byte-equal"
    next_safe_action: "Commit packet"
    blockers: []
    key_files:
      - "mcp_server/tests/code-graph-degraded-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-graph-degraded-stress-cell"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Code Graph Degraded Stress Cell

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-27 |
| **Branch** | `013-graph-degraded-stress-cell` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 010's v1.0.2 stress run produced a NEUTRAL verdict for packet 005 (code-graph fast-fail) because the Q1 cells did not exercise `fallbackDecision` end-to-end — pre-flight recovery left the live graph healthy before each cell ran. The handler at `mcp_server/code_graph/handlers/query.ts:791-828` and the readiness states at `mcp_server/code_graph/lib/ensure-ready.ts:151-217` already work correctly per their mocked unit tests, but no integration test closes the loop against a real degraded graph.

### Purpose
Add one deterministic integration sweep that forces the graph into degraded states using the existing `initDb(tmpdir)` isolation pattern, calls `handleCodeGraphQuery` end-to-end, and asserts the expected `fallbackDecision` branch — promoting packet 005's verdict from NEUTRAL to PROVEN without any production code change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One new vitest test file at `mcp_server/tests/code-graph-degraded-sweep.vitest.ts`
- Three coverage buckets: empty graph (+ broad-stale variant) → `code_graph_scan`; readiness exception → `rg`; fresh state → no `fallbackDecision`
- Live DB byte-equality assertion (sha256 hash before/after) so the test cannot mutate the production graph
- Packet docs (Level 1: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) + manifest (description.json, graph-metadata.json)

### Out of Scope
- Production code changes to `query.ts`, `ensure-ready.ts`, or any handler — this packet is test-only per research.md §4
- Adding new fallback branches or changing existing fallback semantics — packet 005 already nails the contract
- Higher-N variance pass on the load-bearing I2 cell (Recommendation §5 of 010 findings) — that is a separate evaluation packet
- Stress-harness re-run with the new cell baked in — owned by a future v1.0.3 packet, not 013

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/code-graph-degraded-sweep.vitest.ts` | Create | Integration sweep with three buckets + live-DB protection |
| `spec.md` (this packet) | Create | This file |
| `plan.md` (this packet) | Create | Technical plan |
| `tasks.md` (this packet) | Create | Three-phase task breakdown |
| `checklist.md` (this packet) | Create | Verification checklist |
| `implementation-summary.md` (this packet) | Create | Post-impl summary |
| `description.json` (this packet) | Create | Manifest |
| `graph-metadata.json` (this packet) | Create | Graph node + parent/dependency metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Empty-graph degraded read returns `fallbackDecision.nextTool === 'code_graph_scan'` end-to-end | New vitest passes Bucket A; assertion uses live `handleCodeGraphQuery`, NOT a mocked handler |
| REQ-002 | Readiness exception (e.g. simulated DB-locked / I/O fault) returns `fallbackDecision.nextTool === 'rg'` end-to-end | New vitest passes Bucket B; readiness throw is triggered without writing garbage to disk |
| REQ-003 | Fresh state returns no `fallbackDecision` end-to-end | New vitest passes Bucket C; payload omits the `fallbackDecision` key entirely |
| REQ-004 | Live `code-graph.sqlite` is byte-equal before and after the suite runs | sha256 hash captured in `beforeAll`, asserted in `afterAll`; suite fails loudly if any byte differs |
| REQ-005 | Zero production code modified | `git diff` shows changes only under `mcp_server/tests/` and the `013-graph-degraded-stress-cell/` packet folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Broad-stale state (>50 stale tracked files) also routes to `code_graph_scan` | Bucket A' covers the `SELECTIVE_REINDEX_THRESHOLD` boundary in `ensure-ready.ts:201-213` |
| REQ-011 | No regression in existing `code-graph-*.vitest.ts` test surface | `npx vitest run tests/code-graph-*.vitest.ts` passes with the same count as before, plus this packet's additions |
| REQ-012 | Test does NOT trigger `code_graph_scan` from inside the suite | Search the test for `code_graph_scan` invocations: only assertions on the *string* literal, never a real call |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Packet 005 verdict can be re-classified from NEUTRAL to PROVEN — the integration sweep exercises every `fallbackDecision` branch the handler emits.
- **SC-002**: The new cell is deterministic — no flakes from timing, file-watcher races, or filesystem-scan cooldowns.
- **SC-003**: The live code-graph DB is provably untouched — captured hash equality is asserted in the suite itself, not by ambient inspection.
- **SC-004**: The cell runs in under 1 second locally, fitting cleanly into the existing `npm run test:core` budget.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `initDb(tmpdir)` isolation pattern (used by `code-graph-db.vitest.ts`) | Test framework | Stay on the documented seam; no new mechanism invented |
| Risk | Module-level readiness debounce cache in `ensure-ready.ts` could leak state between buckets | Med | Pin `process.cwd()` per test via `vi.spyOn(process, 'cwd')` so each bucket's cache key is unique |
| Risk | Spy-based readiness throw could leak into other tests in the same module | Low | `vi.restoreAllMocks()` in `afterEach`; spy explicitly `mockRestore()` inside the test before assertions |
| Risk | If `getDb()` ever falls through to `initDb(DATABASE_DIR)` mid-test, the live DB is touched | High | Always call `initDb(tempDir)` BEFORE setting any spy that would force fallback — keeps the singleton on the tmp DB even when the spy is active |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All design choices match the sibling research packet (`../011-post-stress-followup-research/research/research.md` Section 4, Q-P1) recommendations 1-of-3 (isolated DB sweep). The remaining unknown of whether to also lower `DEFAULT_DEBOUNCE_MS` is owned by packet 014 (`../014-graph-status-readiness-snapshot/`), not this one.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~140 lines, tailored from level_1/spec.md)
- Test-only Level 1 packet
- All P0 requirements directly map to vitest assertions
- Implementation-summary.md filled in post-impl per Rule 13
-->
