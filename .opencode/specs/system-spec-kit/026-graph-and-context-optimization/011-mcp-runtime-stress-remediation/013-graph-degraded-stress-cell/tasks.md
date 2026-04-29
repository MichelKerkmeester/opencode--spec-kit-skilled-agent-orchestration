---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Code Graph Degraded Stress Cell"
description: "Three-phase task breakdown for authoring the code_graph_query fallbackDecision integration sweep, packet docs, and verification."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "013-graph-degraded-stress-cell tasks"
  - "code_graph degraded sweep tasks"
  - "fallbackDecision test tasks"
  - "graph degraded stress cell phases"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell"
    last_updated_at: "2026-04-27T19:58:00Z"
    last_updated_by: "implementation"
    recent_action: "All tasks complete; tests passing; validator green"
    next_safe_action: "Hand off to commit"
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
# Tasks: Code Graph Degraded Stress Cell

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read research.md §4 (Q-P1) and packet 005 spec.md to anchor scope
- [x] T002 Read `mcp_server/code_graph/handlers/query.ts:791-828` (`buildFallbackDecision` + blocked-payload emission)
- [x] T003 Read `mcp_server/code_graph/lib/ensure-ready.ts:151-217` (`detectState` full-scan branches)
- [x] T004 Read existing mocked test in `mcp_server/tests/code-graph-query-fallback-decision.vitest.ts` to understand the contract surface
- [x] T005 Identify `initDb(tempDir)` seam in `mcp_server/tests/code-graph-db.vitest.ts` as the isolation pattern
- [x] T006 Locate live DB path: `mcp_server/database/code-graph.sqlite`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` skeleton (suite + helpers + lifecycle hooks)
- [x] T011 Add live-DB sha256 hash capture in `beforeAll`; byte-equality assertion in `afterAll`
- [x] T012 Add `pinCwd(tempDir)` helper using `vi.spyOn(process, 'cwd')` so per-test readiness-debounce cache keys are unique
- [x] T013 Bucket A: empty graph → assert `fallbackDecision.nextTool === 'code_graph_scan'`
- [x] T014 Bucket A' (broad-stale): seed >50 stale tracked files → same assertion (covers `SELECTIVE_REINDEX_THRESHOLD` branch)
- [x] T015 Bucket B: spy `vi.spyOn(codeGraphDb, 'getDb')` to throw → assert `fallbackDecision.nextTool === 'rg'`, `reason === 'scan_failed'`
- [x] T016 Bucket C: seed fresh on-disk file with matching mtime + content hash → assert no `fallbackDecision`
- [x] T017 Add live-DB protection sanity test (existsSync + non-null hash baseline) so the afterAll guard cannot silently no-op
- [x] T018 Add 7-doc packet bundle: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `npx vitest run --config vitest.stress.config.ts mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` -> 5 tests pass, zero skips
- [x] T021 Run `npx vitest run mcp_server/tests/code-graph-*.vitest.ts` → 34 tests pass, zero regressions
- [x] T022 `git status` shows changes only in `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` and `013-graph-degraded-stress-cell/`
- [x] T023 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → structural errors = 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (vitest output captured in implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `../011-post-stress-followup-research/research/research.md` §4
- **Source packet (NEUTRAL verdict closed)**: See `../005-code-graph-fast-fail/spec.md`
- **v1.0.2 findings (recommendation §2)**: See `../010-stress-test-rerun-v1-0-2/findings.md` lines 118-121
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~70 lines, tailored from level_1/tasks.md)
- 3 phases as required
- Each task references the file it touches when applicable
-->
