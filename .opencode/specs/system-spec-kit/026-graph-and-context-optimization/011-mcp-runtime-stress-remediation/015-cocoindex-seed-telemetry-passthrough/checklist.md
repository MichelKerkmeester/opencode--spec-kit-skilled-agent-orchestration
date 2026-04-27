---
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: CocoIndex seed telemetry passthrough [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/checklist]"
description: "Verification Date: 2026-04-27"
trigger_phrases:
  - "cocoindex seed telemetry checklist"
  - "015 checklist"
  - "verification 015"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough"
    last_updated_at: "2026-04-27T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored verification checklist"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files: ["checklist.md"]
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: CocoIndex seed telemetry passthrough

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (additive passthrough; no scoring change)
- [x] CHK-003 [P1] Source-of-truth (research.md §6 / Q-OPP) read end-to-end
- [x] CHK-004 [P1] Fork shape confirmed at `mcp-coco-index/mcp_server/cocoindex_code/schema.py` (`raw_score`, `path_class`, `rankingSignals`)
- [x] CHK-005 [P1] Existing `code_graph_context` anchor envelope (lines 245-256) confirmed as the emission boundary
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] `npx tsc --noEmit` PASS
- [x] CHK-011 [P0] No new compile warnings introduced
- [x] CHK-012 [P1] Snake_case + camelCase variants both validated (research.md §6.3 wire-vs-internal duality)
- [x] CHK-013 [P1] Telemetry omitted entirely from JSON envelope when absent (no null serialization)
- [x] CHK-014 [P1] Inline comments at all four edit sites point at research.md §6 / Q-OPP for traceability
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Test A (snake_case wire schema accepts) PASS
- [x] CHK-021 [P0] Test B (camelCase + mixed schema accepts) PASS
- [x] CHK-022 [P0] Test C (anchors emit telemetry next to score/snippet/range) PASS
- [x] CHK-023 [P0] Test D (no telemetry → no extra anchor fields; backward compat) PASS
- [x] CHK-024 [P0] Test E (anchor score/confidence/resolution/ordering byte-equal pre vs post) PASS — most load-bearing
- [x] CHK-025 [P0] Test E2 (`anchor.score === seed.score`, NOT `seed.raw_score`) PASS
- [x] CHK-026 [P0] Test F (hybrid-search.ts + search-utils.ts do NOT reference fork tokens) PASS
- [x] CHK-027 [P1] Sibling regression `tests/code-graph-*.vitest.ts` shows no NEW failures (pre-existing 013 sweep failure exempted)
- [x] CHK-028 [P1] `tool-input-schema.vitest.ts` (79 cases) passes alongside the new 12 cases (91/91 in combined run)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P1] No new secrets, env vars, or credentials introduced
- [x] CHK-031 [P1] No new external network calls; passthrough is purely in-memory schema-then-handler
- [x] CHK-032 [P2] Anchor envelope shape backward-compatible (existing fields preserved unchanged)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P0] spec.md REQ-001..006 documented
- [x] CHK-041 [P0] plan.md phases all walked
- [x] CHK-042 [P0] tasks.md per-REQ traceability complete
- [x] CHK-043 [P0] implementation-summary.md authored (NOT placeholder)
- [ ] CHK-044 [P1] `validate.sh --strict` PASS recorded
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:scope-discipline -->
## Scope Discipline
- [x] CHK-050 [P0] No `mcp_server/lib/search/*` change (research.md §6.3 alt #3 REJECTED)
- [x] CHK-051 [P0] No `dedupedAliases` / `uniqueResultCount` response-level change (research.md §6.3 alt #2 deferred)
- [x] CHK-052 [P0] No fork (cocoindex_code v0.2.3+spec-kit-fork.0.2.0) change — frozen
- [x] CHK-053 [P0] No anchor `score`, `confidence`, `resolution`, `source`, or ordering change — invariants preserved
- [x] CHK-054 [P0] No Stage 3 reranking change
- [x] CHK-055 [P1] Existing `score`, `snippet`, `range`, `provider`, `source`, `confidence`, `resolution` fields on anchors preserved unchanged
<!-- /ANCHOR:scope-discipline -->
