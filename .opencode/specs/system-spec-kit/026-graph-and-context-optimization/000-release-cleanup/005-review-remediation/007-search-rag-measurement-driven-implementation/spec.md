---
title: "Feature Specification: 007 Search RAG Measurement-Driven Implementation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Measurement-driven Phase E execution for deferred search/RAG workstreams W3-W7."
trigger_phrases:
  - "007 search rag measurement driven implementation"
  - "measurement driven implementation"
  - "rag trust tree"
  - "conditional rerank"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation"
    last_updated_at: "2026-04-29T03:35:49Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase E measurement-driven implementation and verification"
    next_safe_action: "Use documented opt-in flags only"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "measurements/"
    session_dedup:
      fingerprint: "sha256:007-search-rag-measurement-driven-implementation-20260429"
      session_id: "007-search-rag-measurement-driven-implementation-20260429"
      parent_session_id: "005-review-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-answered A for this exact sub-phase."
---
# Feature Specification: 007 Search RAG Measurement-Driven Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization/000-release-cleanup/005-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase C identified five promising search/RAG optimization workstreams but deferred them until Phase D measurement infrastructure existed. Phase E must measure each candidate before deciding whether to ship, keep opt-in, or skip.

### Purpose
Use the Phase D search-quality harness to make evidence-backed W3-W7 implementation decisions without changing production behavior by default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend the search-quality corpus for W3-W7 measurement cells.
- Capture baseline and variant measurements under `measurements/`.
- Add additive, shadow, or env-flagged runtime/test code under the approved `mcp_server/` paths.
- Record SHIP / KEEP-AS-OPT-IN / SKIP decisions in `implementation-summary.md`.

### Out of Scope
- Writes under `006/001` license audit packet.
- Network-dependent reranker, CocoIndex, or model calls.
- Production default behavior changes without measurement justification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create/Modify | Phase E packet docs and continuity. |
| `description.json`, `graph-metadata.json` | Create/Modify | Discovery and graph metadata. |
| `measurements/*.json` | Create | Baseline and variant measurement snapshots. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/` | Modify/Create | Corpus extensions, measurement runner, W3-W7 tests. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts` | Create | W3 trust-tree composer. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts` | Create | W4 opt-in rerank gate. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts` | Create | W6 duplicate-density telemetry. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/` | Modify | W5 shadow weights and `_shadow` output. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | W3 composed RAG trust tree must be measurement-gated. | Baseline and variant metrics exist; trust-tree code is additive. |
| REQ-002 | W4 conditional rerank must be measurement-gated. | Baseline and variant metrics exist; gate is enabled by default and skips rerank when no ambiguity/disagreement triggers fire. |
| REQ-003 | W5 advisor shadow learned weights must be measurement-gated. | Live weights remain fixed; shadow scores emit under `_shadow`. |
| REQ-004 | W6 CocoIndex calibration must be measurement-gated. | Duplicate-density telemetry exists; adaptive overfetch is gated by `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH`. |
| REQ-005 | W7 degraded-readiness stress cells must be measurement-gated. | Stale, empty, full-scan-required, and unavailable cells preserve harness metrics. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve production defaults. | Behavior changes remain shadow or opt-in. |
| REQ-007 | Preserve Phase D contracts. | Search-quality baseline and query-plan emission tests pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each W3-W7 section records hypothesis, baseline, variant, delta, and decision.
- **SC-002**: Measurement JSON exists for baseline and variant snapshots.
- **SC-003**: Focused Vitest, typecheck, build, and strict validator exit 0.
- **SC-004**: No writes occur under `006/001` or unrelated packets.

### Acceptance Scenarios

1. **Given** W3 contradiction fixtures, when the variant runs, then trust-tree coverage improves without reducing safety metrics.
2. **Given** W4 weak-agreement fixtures, when conditional rerank is flag-enabled, then precision improves and latency remains bounded.
3. **Given** W5 advisor fixtures, when shadow weights emit, then live recommendations stay unchanged.
4. **Given** W6 duplicate-heavy fixtures, when adaptive overfetch is flag-enabled, then precision improves without recall regression.
5. **Given** W7 degraded graph cells, when fallback envelopes are exercised, then harness metrics survive each state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Synthetic fixtures overstate real-world lift. | Could imply broader retrieval quality than measured. | Keep W4 and W6 opt-in. |
| Dependency | Phase D harness. | Workstream decisions need shared metrics. | Extend corpus additively. |
| Risk | Opt-in flags affect defaults. | Could violate Phase E boundary. | Tests cover flag-off behavior. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: New helpers must be synchronous and bounded.
- **NFR-P02**: Behavior-affecting helpers default off.

### Security
- **NFR-S01**: No network calls or secrets in fixtures.

### Reliability
- **NFR-R01**: Existing Phase D tests remain deterministic.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty candidate lists keep metrics defined.
- Missing trust signals emit explicit absent/unknown states.

### Error Scenarios
- Disabled flags preserve existing behavior.
- Unavailable code graph routes through fallback cells.

### State Transitions
- Each workstream moves baseline -> variant -> decision.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Five bounded workstreams. |
| Risk | 13/25 | Search/RAG surfaces are sensitive. |
| Research | 14/20 | Phase C/D context exists. |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
