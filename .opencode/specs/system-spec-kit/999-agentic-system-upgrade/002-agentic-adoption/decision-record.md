---
title: "Decision Record: 002 Agentic Adoption [template:level_3/decision-record.md]"
description: "Decision record for the architecture and sequencing rules that govern the adoption train."
trigger_phrases:
  - "decision"
  - "record"
  - "agentic"
  - "adoption"
  - "002"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: 002 Agentic Adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Public's current stack

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Operator + packet synthesis |

<!-- ANCHOR:adr-001-context -->
### Context

The research repeatedly converged on shell simplification while preserving the current deep-loop, command, and memory authorities.

### Constraints

- Current Public authorities stay in place.
- Follow-on packets still need room for additive improvements.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep the current Public agent, command, memory, CocoIndex, and code-graph stack in place.

**How it works**: Follow-on packets may wrap or extend these authorities, but they do not replace them with external runtimes. This preserves the current packet, validator, and memory model as the base architecture.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen** | Preserves current guarantees and packet semantics | Requires selective shell work instead of big backend swaps | 9/10 |
| External runtime replacement | Looks simpler at first glance | Breaks the convergence principle and current-authority rule | 2/10 |

**Why this one**: The strongest cross-phase convergence supported shell simplification, not runtime replacement.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The adoption train starts from one fixed architecture rule.
- Child packets can move faster without reopening backend debates.

**What it costs**:
- Wrapper work remains necessary. Mitigation: keep child packets narrow and implementation-ready.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Decision drift in later child packets | H | Re-cite the parent packet before promotion |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Needed to turn nine research folders into one train |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were explored across nine systems |
| 3 | **Sufficient?** | PASS | Smallest rule that still governs the full train |
| 4 | **Fits Goal?** | PASS | Directly supports the packet's purpose |
| 5 | **Open Horizons?** | PASS | Still leaves room for additive investigations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Parent packet requirements and child packet constraints.
- Follow-on packet expectations for architecture and scope.

**How to roll back**: Re-scope the affected child packet into investigation-only work before any implementation packet lands.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
