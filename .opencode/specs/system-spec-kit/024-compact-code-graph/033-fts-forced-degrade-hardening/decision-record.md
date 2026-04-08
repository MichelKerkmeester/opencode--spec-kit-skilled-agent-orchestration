---
title: "Decision Record: FTS Forced-Degrade Hardening [template:level_3/decision-record.md]"
description: "Decision record for 033-fts-forced-degrade-hardening."
trigger_phrases:
  - "033-fts-forced-degrade-hardening"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: FTS Forced-Degrade Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Make FTS hardening conditional on a real truth gap

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The research demoted the FTS lane because the substrate is mostly there already. A separate packet is only justified if the runtime still lacks one truthful forced-degrade contract.

### Constraints

- Must respect the research ordering and bounded packet scope.
- Must enrich current owners instead of inventing a new subsystem.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Open this packet only conditionally, behind a quick runtime audit; otherwise fold any residual work into packet 032.

**How it works**: The packet scope stays narrow, names predecessors clearly, and passes a focused verification seam before any successor packet consumes it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conditional packet behind audit** | Keeps the train honest and avoids redundant work | May end with a documented skip | 8/10 |
| **Always open a dedicated hardening packet** | Feels orderly | Can duplicate already-shipped truth surfaces | 4/10 |

**Why this one**: It preserves the refined packet order and prevents later work from hardening the wrong seam first.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet ordering stays aligned to the research.
- Successor packets inherit a clearer boundary.

**What it costs**:
- Visible feature work may land after contract work. Mitigation: keep successor handoff explicit in packet docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope drift | H | Keep the packet focused on one seam and validate against the checklist. |
| Dependency confusion | M | Name predecessors and successors explicitly in spec and plan docs. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The research identifies this seam as part of the approved train. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were considered in the refined phase plan. |
| 3 | **Sufficient?** | PASS | The packet focuses on one bounded seam rather than a broad subsystem. |
| 4 | **Fits Goal?** | PASS | The packet exists to implement the approved follow-on train. |
| 5 | **Open Horizons?** | PASS | Later packets can build on this contract without redesigning it. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet-local spec, plan, tasks, checklist, and implementation-summary documents.
- Later runtime or contract work as named in `spec.md`.

**How to roll back**: Revert packet-local runtime changes, keep predecessor packets intact, and archive the packet if the seam is no longer needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
