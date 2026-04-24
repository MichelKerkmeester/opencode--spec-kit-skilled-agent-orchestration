---
title: "Decision Record [system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts/decision-record]"
description: "Decision record for 034-workflow-split-and-token-insight-contracts."
trigger_phrases:
  - "034-workflow-split-and-token-insight-contracts"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Workflow Split and Token Insight Contracts

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep workflow split and token insights as a late optional tail

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The refined plan keeps this lane last because earlier packets must settle measurement, publication, and cached-summary semantics first. Otherwise this packet would invent unstable contracts prematurely.

### Constraints

- Must respect the research ordering and bounded packet scope.
- Must enrich current owners instead of inventing a new subsystem.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Open the packet as an optional late-train placeholder and require it to reuse stabilized predecessor contracts if activated later.

**How it works**: The packet scope stays narrow, names predecessors clearly, and passes a focused verification seam before any successor packet consumes it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Optional late-tail packet** | Preserves ordering discipline and gives future work a clear home | May never need activation | 8/10 |
| **Open immediately with the rest of the train** | Feels comprehensive | Forces premature decisions and contradicts the refined ordering | 3/10 |

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
