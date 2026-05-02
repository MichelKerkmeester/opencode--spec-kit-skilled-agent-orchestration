---
title: "Tasks: End-User Scope Default for Code Graph Indexing"
description: "Numbered implementation tasks for packet 009, grouped by the three plan phases and mapped to CHK-G acceptance gates."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "009 tasks"
  - "end user scope tasks"
  - "code graph indexing tasks"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T11:41:37Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Plan tasks checklist resource-map authored"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: End-User Scope Default for Code Graph Indexing

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T-### [S|P] Action (file path) — acceptance: CHK-G#-##`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Scope helpers + tests. Goal: default end-user scope with explicit skill indexing opt-in.**

- [x] T-101 [S] Read live import paths and confirm no cycle before choosing helper location (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`) — acceptance: CHK-G1-01
- [x] T-102 [S] Add or place scope policy resolver (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts` or existing scope file) — acceptance: CHK-G1-02
- [x] T-103 [S] Update path guard to reject `.opencode/skill/**` by default and accept explicit opt-in (`.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`) — acceptance: CHK-G1-02
- [x] T-104 [S] Add policy-aware default excludes and active scope fingerprint (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`) — acceptance: CHK-G1-03
- [x] T-105 [S] Thread `includeSkills` and env resolution through scan args/config (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`) — acceptance: CHK-G1-04
- [x] T-106 [S] Thread scope policy into candidate walking and workspace canonicalization (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`) — acceptance: CHK-G1-05
- [x] T-107 [S] Add `includeSkills` to strict scan input schema (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`) — acceptance: CHK-G1-06
- [x] T-108 [P] Add schema acceptance/rejection cases (`.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`) — acceptance: CHK-G1-06
- [x] T-109 [P] Add default exclude and opt-in config cases (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`) — acceptance: CHK-G1-03
- [x] T-110 [P] Add walker-level fixture proving `.opencode/skill/**` is skipped before parse by default (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`) — acceptance: CHK-G1-05
- [x] T-111 [S] Run focused Phase 1 Vitest suites and fix failures in scope (`.opencode/skill/system-spec-kit/mcp_server/`) — acceptance: CHK-G1-07
- [x] T-112 [S] Confirm no default-off behavior depends on stale process env between tests (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`) — acceptance: CHK-G1-08
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Migration + readiness messaging. Goal: stale skill-heavy databases require explicit full scan.**

- [x] T-201 [S] Add metadata helpers for active scope fingerprint (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`) — acceptance: CHK-G2-01
- [x] T-202 [S] Persist scope fingerprint after successful scan (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`) — acceptance: CHK-G2-01
- [x] T-203 [S] Compare stored and active scope fingerprints in readiness detection (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`) — acceptance: CHK-G2-02
- [x] T-204 [S] Ensure scope mismatch maps to full-scan-required state, not selective inline repair (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`) — acceptance: CHK-G2-03
- [x] T-205 [P] Reuse blocked full-scan payload in graph context reads (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`) — acceptance: CHK-G2-04
- [x] T-206 [P] Reuse blocked full-scan payload in graph query reads (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`) — acceptance: CHK-G2-04
- [x] T-207 [S] Surface active/stored scope and optional old skill-path count in status (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`) — acceptance: CHK-G2-05
- [x] T-208 [P] Align detect-changes and verify wording if readiness reason is surfaced there (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts`) — acceptance: CHK-G2-04
- [x] T-209 [P] Add concise mismatch hint to startup brief (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts`) — acceptance: CHK-G2-06
- [x] T-210 [S] Add or update readiness/status tests for scope mismatch (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/`) — acceptance: CHK-G2-02
- [x] T-211 [S] Run Phase 2 focused tests and fix failures in touched code graph files — acceptance: CHK-G2-06
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Docs + verification. Goal: operator path is documented and regression gates are green.**

- [x] T-301 [S] Update default exclude and filter-order docs (`.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md`) — acceptance: CHK-G3-01
- [x] T-302 [S] Document `SPECKIT_CODE_GRAPH_INDEX_SKILLS` default-off env behavior (`.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`) — acceptance: CHK-G3-02
- [x] T-303 [P] Add README migration note for existing databases and full scans (`.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md`) — acceptance: CHK-G3-03
- [x] T-304 [P] Confirm startup/status text is concise and does not alter spec workflow wording (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`) — acceptance: CHK-G3-04
- [x] T-305 [S] Run focused Vitest command for schema, indexer, and readiness/status suites (`.opencode/skill/system-spec-kit`) — acceptance: CHK-G3-05
- [x] T-306 [S] Run workflow-invariance Vitest (`.opencode/skill/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts`) — acceptance: CHK-G3-06
- [x] T-307 [S] Run strict validation for packet 009 (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default`) — acceptance: CHK-G3-07
- [x] T-308 [S] Run strict validation for sibling 008 (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience`) — acceptance: CHK-G3-07
- [x] T-309 [P] Run full-fleet sample regression and record any inherited failures separately (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/`) — acceptance: CHK-G3-08
- [x] T-310 [S] Measure pre/post graph file-node-edge counts after a default full scan (`.opencode/skill/system-spec-kit/mcp_server/code_graph/`) — acceptance: CHK-G3-08
- [x] T-311 [S] Update `implementation-summary.md` with final implementation, evidence, and performance baseline (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md`) — acceptance: CHK-G3-08
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T-101 through T-311 tasks are complete or explicitly marked blocked.
- [x] No task edits files outside `resource-map.md` scope without updating plan, tasks, checklist, and resource-map first.
- [x] All P0 checklist gates pass.
- [x] P1 gates pass or have documented maintainer approval to defer.
- [x] Performance baseline is measured from local data, not extrapolated from research.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Resource map**: `resource-map.md`
- **Decision record**: `decision-record.md`
- **Research synthesis**: `research/research.md`
- **Research file ledger**: `research/resource-map.md`
<!-- /ANCHOR:cross-refs -->
