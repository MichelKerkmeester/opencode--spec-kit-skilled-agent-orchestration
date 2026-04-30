---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Code Graph Degraded Stress Cell"
description: "Add one vitest integration sweep that exercises code_graph_query fallbackDecision routing end-to-end against an isolated tmpdir code-graph.sqlite, covering empty/broad-stale/readiness-error/fresh buckets without touching production code or the live database."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "013-graph-degraded-stress-cell plan"
  - "code_graph_query degraded sweep plan"
  - "fallbackDecision integration plan"
  - "SPEC_KIT_DB_DIR isolation strategy"
  - "graph degraded test plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell"
    last_updated_at: "2026-04-27T19:58:00Z"
    last_updated_by: "implementation"
    recent_action: "Plan ratified; sweep implemented and passing"
    next_safe_action: "Reference plan during commit message authoring"
    blockers: []
    key_files:
      - "mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-graph-degraded-stress-cell"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Degraded Stress Cell

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), Node 18+ |
| **Framework** | Vitest 4.x |
| **Storage** | better-sqlite3 (isolated tmpdir per bucket) |
| **Testing** | Integration-style; complements existing mocked unit tests in `code-graph-query-fallback-decision.vitest.ts` |

### Overview
Build one vitest file that calls `handleCodeGraphQuery` end-to-end against three engineered graph states. State isolation uses `initDb(tempDir)` to swap the code-graph DB singleton onto a fresh tmpdir per test, plus `vi.spyOn(process, 'cwd')` to keep the module-level readiness-debounce cache from leaking between buckets. The live `code-graph.sqlite` is hashed before and after the suite to prove byte-equality.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear (research.md §4 Q-P1) and scope documented
- [x] Success criteria measurable (3 buckets + live-DB hash assertion)
- [x] Dependencies identified (`initDb` seam, `vi.spyOn`, vitest hooks)

### Definition of Done
- [x] All P0 acceptance criteria met (see spec.md §4 REQ-001..005)
- [x] Vitest file passes with 5 tests (zero skips; the corrupt-DB strategy is documented via Bucket B comment block only)
- [x] Existing `code-graph-*.vitest.ts` surface still passes (34 tests, zero regressions)
- [x] Live `code-graph.sqlite` byte-equal before/after the suite (asserted in `afterAll`)
- [x] Strict validation passes for the spec folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test-only integration sweep. No new module boundaries introduced; the existing seams (`initDb(dbDir)`, `closeDb()`, `vi.spyOn`) are sufficient.

### Key Components
- **`mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`**: New test file; the entire deliverable.
- **`mcp_server/code_graph/lib/code-graph-db.ts`** (read-only seam): exports `initDb(dbDir)`, `closeDb()`, `getDb()`. The singleton DB swap lets us isolate per-test state without touching production code.
- **`mcp_server/code_graph/lib/ensure-ready.ts`** (read-only seam): `detectState()` reads from whichever DB the singleton points at; once we initDb the tmpdir, `detectState` reads tmp state.
- **`mcp_server/code_graph/handlers/query.ts`** (read-only seam): the handler under test — invoked end-to-end via `handleCodeGraphQuery({ operation, subject, ... })`.

### Data Flow

```
Test setup (per bucket)
  ↓ closeDb() + mkdtempSync() + pinCwd(tempDir)
  ↓ initDb(tempDir)  ← swaps singleton onto tmp DB
  ↓ Optionally seed code_files / code_nodes for fresh / broad-stale buckets
  ↓ Optionally vi.spyOn(getDb).throw() for readiness-error bucket
handleCodeGraphQuery({ operation, subject })
  ↓ ensureCodeGraphReady(process.cwd(), { allowInlineFullScan: false })
  ↓ detectState() reads tmp DB
  ↓ buildFallbackDecision(readiness)
parseQueryResponse → assert fallbackDecision.nextTool
  ↓ closeDb() + rmSync(tempDir) + restoreAllMocks()
afterAll → assert hash(LIVE_DB) byte-equal
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify the existing `initDb(tempDir)` seam in `code-graph-db.vitest.ts`
- [x] Confirm the readiness-debounce cache in `ensure-ready.ts` is keyed on `process.cwd()`
- [x] Locate live DB path via `mcp_server/database/code-graph.sqlite` for the byte-equality guard

### Phase 2: Core Implementation
- [x] Author the new vitest with three buckets
- [x] Add live-DB hash capture in `beforeAll` and assertion in `afterAll`
- [x] Add `pinCwd(tempDir)` helper to isolate readiness cache between buckets
- [x] Add Bucket A' (broad-stale, >50 files) for full coverage of the `SELECTIVE_REINDEX_THRESHOLD` boundary
- [x] Make Bucket B use `vi.spyOn(codeGraphDb, 'getDb')` to throw — clean and disk-safe

### Phase 3: Verification
- [x] Run the new file in isolation: 5 tests pass, zero skips
- [x] Run the entire `code-graph-*.vitest.ts` surface: 34 tests pass, zero regressions
- [x] Confirm `git diff` shows zero changes outside `stress_test/` + `013-graph-degraded-stress-cell/`
- [x] Run strict spec-folder validator
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | `handleCodeGraphQuery` end-to-end against engineered DB states | Vitest 4.x, better-sqlite3 |
| Live-DB protection | byte-equality of production `code-graph.sqlite` | sha256 hash compare |
| Regression | `code-graph-*.vitest.ts` continues to pass | `npx vitest run tests/code-graph-*.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `code-graph-db.ts::initDb` (existing seam) | Internal | Green | Cannot isolate DB state per test |
| `vitest >= 4.0` (`vi.spyOn`, `vi.restoreAllMocks`) | External | Green | Cannot pin `process.cwd()` or stub `getDb()` |
| Packet 005 fallbackDecision contract (REQ-001..REQ-005) | Internal | Green | If fallback semantics change, this test must update in lockstep |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New cell flakes intermittently OR mutates the live DB hash unexpectedly
- **Procedure**: Delete `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`. The existing mocked unit tests in `code-graph-query-fallback-decision.vitest.ts` remain in place; packet 005 returns to its v1.0.2 NEUTRAL verdict pending a redesigned harness.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~120 lines, tailored from level_1/plan.md)
- Test-only deliverable; no production seam changes
- Three buckets map to spec REQ-001..003; broad-stale variant covers REQ-010
-->
