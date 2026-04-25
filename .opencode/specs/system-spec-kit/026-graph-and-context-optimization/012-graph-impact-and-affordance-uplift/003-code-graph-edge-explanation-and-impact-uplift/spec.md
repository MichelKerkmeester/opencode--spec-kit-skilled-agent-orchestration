---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Code Graph Edge Explanation + Impact Uplift (012/003)"
description: "Add reason/step fields to edge metadata + display; enrich blast_radius with depth groups, risk levels, min-confidence filter, ambiguity candidates, structured failure-fallback. No SQLite migration."
trigger_phrases:
  - "012 edge explanation"
  - "012 blast radius uplift"
  - "code graph reason step"
  - "ambiguity candidates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized sub-phase scaffold"
    next_safe_action: "Wait for 012/001 license sign-off; then read query.ts:862-909 (computeBlastRadius)"
    completion_pct: 0
    blockers: ["012/001 license audit pending"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Feature Specification: Code Graph Edge Explanation + Impact Uplift (012/003)

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft (blocked on 012/001) |
| **Created** | 2026-04-25 |
| **Branch** | `012/003-code-graph-edge-explanation-and-impact-uplift` |

---

## 2. PROBLEM & PURPOSE

**Problem:** Public's edge metadata in `code_edges.metadata` carries `confidence`, `detectorProvenance`, `evidenceClass` (verified at `code-graph-db.ts:92` + emitted at `structural-indexer.ts:85-94`) but no `reason`/`step` fields explaining WHY a relation was inferred. `computeBlastRadius` (`query.ts:862-909`) groups by depth but lacks risk levels, min-confidence filtering, ambiguity surfacing, and structured failure states.

**Purpose:** Add owner-local explanation fields to edge metadata; enrich `blast_radius` output without schema migration.

---

## 3. SCOPE

### In Scope
- Extend edge metadata writer to include `reason` (string) + `step` (string) JSON fields
- Surface those fields in query output
- Extend `computeBlastRadius` with: depth-grouped affected symbols, `riskLevel` field, `minConfidence` parameter, `ambiguityCandidates` array, structured `failureFallback` (instead of error strings)
- Per-packet feature_catalog + manual_testing_playbook entries

### Out of Scope
- SQLite schema migration (purely JSON metadata extension)
- Route/tool/shape extraction (pt-02 Packet 5 — deferred)
- Replacing existing `confidence`/`detectorProvenance` (additive only)
- Mutating any code via the impact tool (read-only)

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/structural-indexer.ts:85-94` | MODIFY | Extend metadata writer with `reason`/`step` |
| `mcp_server/code_graph/handlers/query.ts:862-909` | MODIFY | Extend `computeBlastRadius` output shape |
| `mcp_server/code_graph/handlers/query.ts:978-981` | MODIFY | Surface `reason`/`step` in relationship-query output |
| `mcp_server/code_graph/lib/code-graph-context.ts` | MODIFY | Propagate enriched fields through context payloads |
| `feature_catalog/06--analysis/` | NEW entry | blast_radius uplift |
| `manual_testing_playbook/06--analysis/` | NEW entry | blast_radius testing flow |

---

## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R-003-1 | Edge metadata writer adds `reason` (string) + `step` (string) to JSON metadata |
| R-003-2 | Existing `confidence`/`detectorProvenance`/`evidenceClass` fields unchanged |
| R-003-3 | `computeBlastRadius` output: `{ depthGroups: { 1: [...], 2: [...], 3: [...] }, riskLevel: 'low'|'medium'|'high', ambiguityCandidates: [...], failureFallback?: { reason, partialResult? } }` |
| R-003-4 | New parameter `minConfidence: number` filters edges below threshold during traversal |
| R-003-5 | When target symbol is ambiguous, return `ambiguityCandidates` instead of silently picking one (pt-02 §12 RISK-07) |
| R-003-6 | Failures return structured `failureFallback` object — never bare error strings |
| R-003-7 | NO SQLite schema migration — JSON metadata only |
| R-003-8 | Backward compat: old callers that don't request new fields still get prior shape |

---

## 5. VERIFICATION

- [ ] Unit test: edge metadata round-trip with `reason`/`step`
- [ ] Unit test: `blast_radius` returns depth-grouped output
- [ ] Unit test: `riskLevel` correctly classified (rules TBD in plan.md)
- [ ] Unit test: `minConfidence` filters edges below threshold
- [ ] Unit test: ambiguous target returns candidates (no silent pick)
- [ ] Unit test: failures return `failureFallback`, not bare strings
- [ ] Integration: `code_graph_query` end-to-end with new fields
- [ ] `validate.sh --strict` passes
- [ ] sk-doc DQI ≥85 on feature_catalog + playbook entries

---

## 6. REFERENCES
- 012/spec.md §3 (scope), §4 (R-003 row)
- 012/decision-record.md ADR-012-002 (sub-phase decomposition), ADR-012-003 (route/tool/shape deferred — relevant to scope boundary), ADR-012-004 (mutating rename rejected — relevant to read-only impact tool)
- pt-02 §4 (Code Graph findings — Confidence edges, Explanation gap, Public blast radius rows)
- pt-02 §11 Packet 2
- Verified anchors: `code-graph-db.ts:92` (JSON metadata column), `structural-indexer.ts:85-94` (metadata writer), `query.ts:862-909` (computeBlastRadius), `query.ts:978-981` (query output)
