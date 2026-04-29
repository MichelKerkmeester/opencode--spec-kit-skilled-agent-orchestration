---
title: "Implementation Plan: 007 Search RAG Measurement-Driven Implementation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Five sequential workstreams use hypothesis, baseline, additive variant, re-measurement, and decision."
trigger_phrases:
  - "implementation plan"
  - "w3 trust tree"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation"
    last_updated_at: "2026-04-29T03:35:49Z"
    last_updated_by: "codex"
    recent_action: "Completed five-phase measurement plan"
    next_safe_action: "Reference implementation-summary decisions"
    blockers: []
    key_files:
      - "plan.md"
      - "measurements/"
    session_dedup:
      fingerprint: "sha256:007-search-rag-plan-20260429"
      session_id: "007-search-rag-measurement-driven-implementation-20260429"
      parent_session_id: "005-review-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 007 Search RAG Measurement-Driven Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest, MCP server modules |
| **Storage** | Synthetic search-quality fixtures |
| **Testing** | Vitest, typecheck, build, strict validator |

### Overview
The implementation ran W3 through W7 sequentially. Each phase measured baseline and variant output, compared the harness summary metrics, and recorded a disposition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] All acceptance criteria met.
- [x] Tests passing.
- [x] Docs updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive measurement modules plus opt-in behavior gates.

### Key Components
- **Search-quality runner**: writes W3-W7 JSON measurements.
- **Trust tree**: composes provenance signals.
- **Rerank gate**: env-flagged eligibility helper.
- **Shadow weights**: output-only advisor diagnostics.
- **CocoIndex calibration**: duplicate-density telemetry.
- **Degraded cells**: graph fallback survival tests.

### Data Flow
Corpus cases feed static baseline and variant runners. The harness writes per-workstream JSON, and docs record deltas.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: W3 - Composed RAG Trust Tree
- [x] Measure baseline.
- [x] Add additive trust-tree helper.
- [x] Re-measure and decide SHIP.

### Phase 2: W4 - Conditional Rerank Experiment
- [x] Measure baseline.
- [x] Add opt-in rerank gate.
- [x] Re-measure and decide KEEP-AS-OPT-IN.

### Phase 3: W5 - Advisor Shadow Learned Weights
- [x] Measure baseline.
- [x] Add `_shadow` diagnostics.
- [x] Re-measure and decide SHIP.

### Phase 4: W6 - CocoIndex Overfetch + Path-Class Calibration
- [x] Measure baseline.
- [x] Add opt-in duplicate-density calibration.
- [x] Re-measure and decide KEEP-AS-OPT-IN.

### Phase 5: W7 - Code-Graph Degraded-Readiness Stress Cells
- [x] Measure baseline.
- [x] Add four degraded-readiness tests.
- [x] Re-measure and decide SHIP.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Harness | W3-W7 baseline and variant metrics | Vitest |
| Unit | New helpers and schema output | Vitest |
| Static | TypeScript contracts | `npm run typecheck`, `npm run build` |
| Documentation | Packet compliance | strict validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase D harness | Internal | Green | No shared measurement output. |
| QueryPlan contract | Internal | Green | W4 gate lacks plan signals. |
| Advisor registry | Internal | Green | W5 cannot emit shadow weights. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests, typecheck, build, or validator fail.
- **Procedure**: Disable env-flagged variants, remove skipped code if needed, and preserve measurement evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline -> W3 -> W4 -> W5 -> W6 -> W7 -> verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| W3 | Baseline | W4 |
| W4 | W3 | W5 |
| W5 | W4 | W6 |
| W6 | W5 | W7 |
| W7 | W6 | Verification |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| W3 | Medium | Completed |
| W4 | Medium | Completed |
| W5 | Medium | Completed |
| W6 | Medium | Completed |
| W7 | Medium | Completed |
| **Total** | | **Completed within guardrail** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Variant defaults are shadow or opt-in.
- [x] Measurement deltas documented.

### Rollback Procedure
1. Leave W4 and W6 env flags unset.
2. Re-run focused tests.
3. Update implementation summary if disposition changes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
