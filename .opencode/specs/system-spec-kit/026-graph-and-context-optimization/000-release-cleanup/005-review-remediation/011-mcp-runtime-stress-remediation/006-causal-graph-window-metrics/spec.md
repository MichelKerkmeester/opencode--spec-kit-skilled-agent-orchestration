---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: causal-graph relation-window balance metrics + auto-edge caps [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/spec]"
description: "Remediation packet for 005/REQ-005+REQ-006+REQ-010 + 007/Q7. Adds deltaByRelation / dominantRelationShare / balanceStatus to causal-stats response, auto-edge caps for prediction-error supersession bursts, and zero-fills missing relation types."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "006-causal-graph-window-metrics"
  - "causal graph balance status"
  - "deltaByRelation dominantRelationShare"
  - "supersedes burst auto cap"
  - "REQ-005 REQ-006 REQ-010 causal stats"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics"
    last_updated_at: "2026-04-27T09:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet from 007 §5 Q7 + §11 Rec #5"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: causal-graph relation-window balance metrics + auto-edge caps

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 005-code-graph-fast-fail; SUCCESSOR: 007-intent-classifier-stability -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Sources** | 005/REQ-005, REQ-006, REQ-010, 007/Q7, 007/§11 Rec #5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
005/REQ-010 captured 344 new edges in 15 minutes — 100% `supersedes`, 0% `caused`/`supports`. 005/REQ-005 documented that `causal-stats` returns only 3 of 6 valid relation types (omits zero-count relations). 005/REQ-006 documented that `health:"healthy"` co-exists with `meetsTarget:false`. 007/Q7 isolated the cause: prediction-error and reconsolidation paths produce auto-supersedes edges at higher volume than conditional `caused`/`supports` producers. Existing caps are per-node or strength-based, not per-relation per-window. Stats report lifetime totals, not deltas, so the relation-window skew is invisible to operators.

### Purpose
Add `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, and `remediationHint` fields to `causal-stats` response per 007 §5 Q7. Add per-relation per-window auto-edge caps to prevent supersedes bursts. Zero-fill all 6 relation types in `by_relation` so missing types don't disappear. Reconcile `health` field with `meetsTarget`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `remediationHint`, `windowStartedAt` fields to `causal-stats` response.
- Zero-fill `by_relation` to always include all 6 valid relations: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`.
- Reconcile `health` with `meetsTarget`: `meetsTarget=false ⇒ health ∈ {"degraded","below_target"}`.
- Add per-relation per-window auto-edge cap routed through shared cap logic (per 007 §8 Implementation Guide).
- Update `mcp_server/handlers/causal-graph.ts` and `mcp_server/lib/storage/causal-edges.ts`.

### Out of Scope
- Backfilling missing `caused`/`supports` historical relations (separate operational task).
- Underlying causal-edge schema changes beyond stats shape.
- Other graph subsystems.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/causal-graph.ts` | Modify | Add new stats fields, zero-fill all 6 relations, reconcile health |
| `mcp_server/lib/storage/causal-edges.ts` | Modify | Route auto edges (esp. supersedes) through shared per-relation per-window cap |
| `mcp_server/handlers/save/create-record.ts` | Modify | Ensure prediction-error supersedes producer respects new cap |
| `mcp_server/tests/handler-causal-graph.vitest.ts` (or equivalent) | Modify | Test new stats fields + zero-fill |
| `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `causal-stats` response MUST always include all 6 valid relation types in `by_relation` (zero-filled if absent). | After fix, `memory_causal_stats()` returns `data.by_relation` with all 6 keys: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`. |
| REQ-002 | `health` field MUST agree with `meetsTarget`. | After fix, `meetsTarget:false` ⇒ `health ∈ {"degraded","below_target"}`. Never `health:"healthy"` co-existing with `meetsTarget:false`. |
| REQ-003 | `causal-stats` MUST include `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `windowStartedAt`. | After fix, response includes all 5 fields. `balanceStatus` is one of `balanced`, `relation_skewed`, `insufficient_data`. |
| REQ-004 | When `dominantRelationShare > 0.80` AND `total new edges in window >= 50`, `balanceStatus` MUST be `"relation_skewed"` and `remediationHint` MUST be set. | After fix, the 005/REQ-010 supersedes-burst scenario triggers `balanceStatus:"relation_skewed"` and a hint naming the producer. |
| REQ-005 | Auto-edge insertion MUST be capped per relation per time-window. | After fix, prediction-error producer cannot exceed N supersedes edges per window M (default values per implementation, documented in plan.md). Cap is shared logic so all auto-edge paths (insertEdge, insertEdgesBatch, bulkInsertEdges) respect it. |

### Acceptance Scenarios

**Given** a causal-stats call right after a fresh database, **when** the response is built, **then** `data.by_relation` contains all 6 keys with zero counts where no edges exist.

**Given** a 15-minute window with 344 new supersedes edges and 0 of any other relation, **when** stats are computed, **then** `balanceStatus:"relation_skewed"`, `dominantRelation:"supersedes"`, `dominantRelationShare:1.0`, `remediationHint` mentions prediction-error supersede burst.

**Given** auto-edge inserts that would exceed the per-relation per-window cap, **when** the producer attempts to insert, **then** the insert is throttled or rejected with a documented error/log line.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 REQs covered by tests.
- **SC-002**: Live `memory_causal_stats()` probe shows all 6 relations + new fields.
- **SC-003**: `validate.sh --strict` PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Caps could throttle legitimate edge growth. | Medium | Conservative defaults; log when cap fires; expose cap metrics. |
| Risk | Window boundary semantics (rolling vs fixed). | Medium | Pick rolling N-minute window; document in plan.md. |
| Dependency | Daemon restart per 005 phantom-fix lesson. | High | Per packet 013. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Cap defaults: 80% dominance + 50 edge minimum is a starting point per 007 §12. Tune in production.
- Window size: 15 min vs 1 hour vs configurable? Default: 15 min rolling.
<!-- /ANCHOR:questions -->
