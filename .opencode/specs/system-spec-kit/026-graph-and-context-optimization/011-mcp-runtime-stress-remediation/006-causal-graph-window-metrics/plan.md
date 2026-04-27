---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: causal-graph relation-window balance metrics + auto-edge caps [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/plan]"
description: "Add deltaByRelation/balanceStatus/remediationHint to causal-stats; per-relation per-window caps on auto-edge inserts."
trigger_phrases:
  - "causal graph window metrics plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics"
    last_updated_at: "2026-04-27T09:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: causal-graph relation-window balance metrics + auto-edge caps

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP server, causal-graph subsystem |
| **Storage** | sqlite (causal_edges table) |
| **Testing** | vitest |

### Overview
Two-part fix: (a) stats — augment `causal-stats` response with delta-by-relation + balance status + zero-fill all 6 relations + reconcile health. (b) caps — route ALL auto-edge inserts through shared per-relation per-window cap logic so supersedes bursts are throttled.

### Default Cap Values
- Window: 15 minutes rolling
- Dominance threshold: 0.80
- Minimum edges in window before triggering skew status: 50
- Per-relation per-window cap (initial): 100 edges (conservative, log-only first iteration)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Defects mapped (005/REQ-005, REQ-006, REQ-010)

### Definition of Done
- [ ] All REQs PASS
- [ ] dist marker grep PASS
- [ ] Live probe verifies new fields
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Stats schema extension + shared insert gate.

### Key Components
- `handlers/causal-graph.ts`: stats response builder. Add new fields + zero-fill.
- `lib/storage/causal-edges.ts:234-253`: existing per-node/strength caps. Add per-relation per-window cap shared by `insertEdge`, `insertEdgesBatch`, `bulkInsertEdges`.
- `handlers/save/create-record.ts:129-196,386-396`: prediction-error supersedes producer. Ensure it routes through the shared cap.

### Data Flow
```
stats query -> read all edges -> bucket by relation
            -> compute window deltas (rolling N min)
            -> compute dominantRelationShare
            -> derive balanceStatus + remediationHint
            -> zero-fill missing relations
            -> reconcile health vs meetsTarget
            -> emit response

edge insert -> check per-node cap (existing) -> check per-relation per-window cap (new)
            -> if exceeded: log warning + skip OR throttle
            -> else: insert
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source
- [ ] Read causal-graph.ts stats builder + causal-edges.ts cap logic + create-record.ts:129-396
- [ ] Add `RelationBalance` type per 007 §9
- [ ] Implement `computeRelationBalance(edges, windowMs)` helper
- [ ] Update stats response to include new fields
- [ ] Zero-fill `by_relation` for all 6 keys
- [ ] Reconcile `health` with `meetsTarget`
- [ ] Implement shared per-relation per-window cap function
- [ ] Route insertEdge / insertEdgesBatch / bulkInsertEdges through cap
- [ ] Wire prediction-error producer (create-record.ts) through the same cap

### Phase 2: Tests
- [ ] Test: zero-fill — empty DB stats include all 6 keys
- [ ] Test: health/meetsTarget reconciliation
- [ ] Test: supersedes-burst fixture → balanceStatus:"relation_skewed" + remediationHint set
- [ ] Test: cap enforcement — auto-insert N+1 edges in window N → (N+1)th throttled

### Phase 3: Verify
- [ ] `npx vitest run tests/handler-causal-graph*.vitest.ts tests/causal-edges*.vitest.ts` green
- [ ] `npm run build` clean
- [ ] dist marker grep
- [ ] Document daemon restart
- [ ] Live `memory_causal_stats()` after restart
- [ ] Update implementation-summary.md
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | computeRelationBalance helper | vitest |
| Unit | Cap function | vitest |
| Integration | Full causal-stats response shape | vitest fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007 research | Internal | Green | Defines contract |
| Packet 013 | Internal | Green | Restart procedure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cap throttles legitimate edges; stats break downstream consumers.
- **Procedure**: Set cap to Infinity (effectively disabled) via env override; revert stats fields if downstream parsers fail.
<!-- /ANCHOR:rollback -->
