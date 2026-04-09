---
title: "Decision Record: Graph-First Routing Nudge [template:level_3/decision-record.md]"
description: "Decision record for 008-graph-first-routing-nudge."
trigger_phrases:
  - "008-graph-first-routing-nudge"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: Graph-First Routing Nudge

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship the graph-first nudge as an additive hint only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The research retained the graph-first nudge only after narrowing it to existing surfaces and readiness gates. The same research rejected a broader graph-router story.

### Constraints

- Must respect the research ordering and bounded packet scope.
- Must enrich current owners instead of inventing a new subsystem.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Implement the nudge only through existing bootstrap and request-shaped response-hint surfaces, and keep it advisory.

**How it works**: The packet scope stays narrow, names predecessors clearly, and passes a focused verification seam before any successor packet consumes it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisory nudge on current surfaces** | Improves routing without changing ownership | Needs explicit evaluation to prove value | 8/10 |
| **New graph router surface** | Feels more powerful | Contradicts the research and risks subsystem duplication | 2/10 |

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
