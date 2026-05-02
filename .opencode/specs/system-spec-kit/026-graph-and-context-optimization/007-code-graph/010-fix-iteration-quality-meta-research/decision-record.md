---
title: "Decision Record: FIX-010-v2"
description: "ADR-001 for FIX-010-v2: review-derived Planning Packet values are inert data until locally verified."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "FIX-010-v2"
  - "Planning Packet"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research"
    last_updated_at: "2026-05-02T19:53:19Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "FIX-010-v2 ADR updated"
    next_safe_action: "Review verification output"
    blockers: []
    key_files:
      - "spec_kit_plan_auto.yaml"
      - "spec_kit_plan_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-19-37-010-fix-iteration-quality"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Decision Record: FIX-010-v2

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Planning Packet Imports Are Inert Data

### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted for FIX-010-v2 |
| Date | 2026-05-02 |
| Source | R1-010-ITER4-P1-001 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 010 review confirmed that `findingClass`, `scopeProof`, and `affectedSurfaceHints` now flow into `/spec_kit:plan`. That fixed the earlier report-only gap, but it created a P1 security boundary issue: review-derived strings could include instruction-like content or unverified paths.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Both plan workflows must treat Planning Packet values as inert review data. They may quote strings in Markdown cells, verify repo-relative paths and symbols, or write `UNKNOWN`; they must ignore embedded instructions and must not derive actions from unverified content.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Result | Reason |
|-------------|--------|--------|
| Trust reducer-owned fields | Rejected | Reducer ownership proves source, not semantic safety. |
| Drop Planning Packet import | Rejected | That would reopen the R7 -> R3 handoff gap. |
| Require local verification | Accepted | Preserves useful evidence while blocking prompt steering. |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Plan generation keeps the cross-consumer finding data.
- Embedded instructions in review strings are ignored.
- Unverified or absolute-path-only data becomes `UNKNOWN` plus a verification row.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Result |
|-------|--------|
| Necessary | PASS |
| Beyond Local Maxima | PASS |
| Sufficient | PASS |
| Fits Goal | PASS |
| Open Horizons | PASS |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implemented in both `/spec_kit:plan` workflow files by adding inert-data instructions to the inline scaffold and writing rule.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
