---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: causal-graph window metrics + auto-edge caps [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/tasks]"
description: "Per-REQ work units for relation-window balance stats + per-relation per-window auto-edge caps."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "causal graph window metrics tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics"
    last_updated_at: "2026-04-27T09:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: causal-graph window metrics + auto-edge caps

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Author spec/plan/tasks
- [ ] T002 [P] Author implementation-summary.md placeholder
- [ ] T003 [P] Generate description.json + graph-metadata.json
- [ ] T004 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T101 Read mcp_server/handlers/causal-graph.ts (stats builder), mcp_server/lib/storage/causal-edges.ts (caps at :234-253, batch at :366-468), and mcp_server/handlers/save/create-record.ts (:129-196, :386-396)
- [ ] T102 Add `RelationBalance` type per 007 §9: `{ deltaByRelation, dominantRelation, dominantRelationShare, balanceStatus, remediationHint? }`
- [ ] T103 Implement `computeRelationBalance(edges, windowMs)` helper that:
  - Filters edges to last windowMs (default 15min rolling)
  - Counts by relation type
  - Computes dominantRelationShare = max(count) / total
  - Returns balanceStatus: "balanced" if share < 0.80 OR total < 50, "relation_skewed" if share >= 0.80 AND total >= 50, "insufficient_data" if total < 5
  - When skewed, sets remediationHint based on dominant relation (e.g., "prediction-error supersedes burst" for supersedes)
- [ ] T104 Update `causal-stats` response builder to include all 6 valid relations (caused, enabled, supersedes, contradicts, derived_from, supports) — zero-fill if absent
- [ ] T105 Reconcile `health` field: when `meetsTarget:false`, set `health` to `"degraded"` (or `"below_target"`); when `meetsTarget:true`, keep current logic
- [ ] T106 Implement shared `enforceRelationWindowCap(relation, windowMs, capPerWindow)` function in causal-edges.ts that:
  - Counts inserts for this relation in last windowMs
  - Returns true (allow) if under cap, false (deny) if at/over cap
  - Logs WARN line on deny
  - Default cap: 100 per relation per 15-min window (configurable via env or constant)
- [ ] T107 Route `insertEdge`, `insertEdgesBatch`, `bulkInsertEdges` through enforceRelationWindowCap before actual insert
- [ ] T108 Audit prediction-error supersedes producer in create-record.ts; ensure it goes through one of the gated insert paths (not bypassing)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T201 Test: empty DB stats response has all 6 by_relation keys with zero counts
- [ ] T202 Test: health/meetsTarget reconciliation — fixture with meetsTarget:false asserts health is "degraded" not "healthy"
- [ ] T203 Test: supersedes-burst fixture (60+ supersedes in window, no other relations) → balanceStatus:"relation_skewed", dominantRelation:"supersedes", dominantRelationShare ~1.0, remediationHint set
- [ ] T204 Test: cap enforcement — attempt 105 supersedes inserts in 15min window → 100 succeed, 5 throttled
- [ ] T205 Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-causal-graph*.vitest.ts tests/causal-edges*.vitest.ts` → green
- [ ] T206 npm run build
- [ ] T207 grep dist for `deltaByRelation`, `dominantRelationShare`, `balanceStatus`, `enforceRelationWindowCap` markers
- [ ] T208 Document daemon restart requirement
- [ ] T209 After restart: live `memory_causal_stats()` probe; verify all 6 relations + new fields
- [ ] T210 Mark all REQ-001..005 PASSED
- [ ] T211 `validate.sh --strict` PASS
- [ ] T212 Commit + push: `fix(mcp/causal-graph): add deltaByRelation+balanceStatus+per-relation per-window caps per 007/Q7 + 005/REQ-005-006-010`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] REQ-001..005 PASSED
- [ ] Live probe verification recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Sources**: ../005-memory-search-runtime-bugs (REQ-005, REQ-006, REQ-010), ../002-mcp-runtime-improvement-research (Q7)
<!-- /ANCHOR:cross-refs -->
