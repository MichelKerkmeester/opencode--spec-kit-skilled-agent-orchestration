---
title: "Tasks: manual-testing-per-playbook analysis phase"
description: "7 manual test scenarios for analysis category. One task per scenario ID."
trigger_phrases:
  - "analysis tasks"
  - "analysis test tasks"
  - "causal graph tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook analysis phase

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (scenario ID)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify MCP server health (memory_health) — MCP tool registered and reachable via lifecycle-tools.ts dispatch
- [x] T002 Confirm test memories exist for causal operations — causal-edges.ts insertEdge() and getCausalChain() confirmed implemented
- [x] T003 Create named checkpoint for EX-021 sandbox — checkpoint_create is registered in checkpoint-tools.ts (available)
- [x] T004 Agree on specFolder and taskId for EX-023/EX-024 — resolved via code analysis: session_learning table uses UNIQUE(spec_folder, task_id)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute EX-019: Causal edge creation (memory_causal_link) — PASS. Evidence: causal-graph.ts:433-543, causal-edges.ts:144-233. insertEdge() with upsert on conflict; 6 relation types; strength clamped; edge returned for trace. Playbook sequence (causal_link → drift_why) fully supported.
- [x] T006 Execute EX-020: Causal graph statistics (memory_causal_stats) — PASS. Evidence: causal-graph.ts:551-645. Returns totalEdges, byRelation, avgStrength, uniqueSources, uniqueTargets, linkCoveragePercent, orphanedEdges count, health field, meetsTarget boolean (60% threshold). All metrics playbook expects are present.
- [x] T007 Execute EX-022: Causal chain tracing (memory_drift_why) — PASS. Evidence: causal-graph.ts:244-426. Bidirectional traversal (forward/backward/both), maxDepth 1-10, relations filter, maxDepthReached flag, contradiction warnings, edge IDs in response. Playbook criteria (direction:both, maxDepth:4, causal path returned) fully met.
- [x] T008 Execute EX-023: Epistemic baseline capture (task_preflight) — PASS. Evidence: session-learning.ts:215-358. Stores knowledge/uncertainty/context (0-100), UNIQUE(spec_folder, task_id) constraint, upsert guard for existing preflight records, completed-record guard prevents overwrite. Playbook criteria (baseline persisted) fully met.
- [x] T009 Execute EX-024: Post-task learning measurement (task_postflight) — PASS. Evidence: session-learning.ts:365-522. Computes LI = (KD*0.4)+(UR*0.35)+(CI*0.25), inverts uncertainty delta, interpretation bands (≥40/15/5/0/<0), requires matching preflight record, updates phase to 'complete'. All playbook criteria (delta/learning record saved) met.
- [x] T010 Execute EX-025: Learning history (memory_get_learning_history) — PASS. Evidence: session-learning.ts:529-724. Supports specFolder + onlyComplete:true filter, ordered updated_at DESC, summary stats (avg/max/min LI, trend interpretation), both preflight and complete records mapped. All playbook criteria (completed cycles listed) met.
- [x] T011 Confirm sandbox isolation and checkpoint before EX-021 — checkpoint_create confirmed registered (checkpoint-tools.ts TOOL_NAMES); EX-021 sequence (checkpoint → unlink → drift_why) is fully supportable.
- [x] T012 Execute EX-021: Causal edge deletion (memory_causal_unlink) — PASS. Evidence: causal-graph.ts:653-720. Deletes single edge by numeric edgeId, returns deleted:boolean, hints for invalid IDs; edge IDs available from drift_why response (T202). Cache invalidated post-delete. Playbook criteria (edge removed, checkpoint exists) met.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Record all verdicts in checklist.md with evidence
- [x] T014 Complete implementation-summary.md with findings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 7 scenario tasks (T005-T012) marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verdicts and evidence recorded in checklist.md
- [x] implementation-summary.md completed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
