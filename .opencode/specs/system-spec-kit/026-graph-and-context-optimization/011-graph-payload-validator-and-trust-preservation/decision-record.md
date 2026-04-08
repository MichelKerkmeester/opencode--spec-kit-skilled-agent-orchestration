---
title: "Decision Record: Graph Payload Validator and Trust Preservation [template:level_3/decision-record.md]"
description: "Decision record for 011-graph-payload-validator-and-trust-preservation."
trigger_phrases:
  - "011-graph-payload-validator-and-trust-preservation"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: Graph Payload Validator and Trust Preservation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fail closed on malformed trust metadata while preserving current owners

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

R5 keeps the validator work in the train only after R10 split provenance, evidence status, and freshness or authority into separate axes. Packet 006 now defines that contract, but a dedicated enforcement packet is still needed to keep code-graph and bridge payloads from emitting malformed trust metadata or collapsing the axes downstream.

### Constraints

- Must enforce the 006 vocabulary rather than redefine it.
- Must preserve current owner surfaces instead of creating a graph-only contract family.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Open a bounded validator-and-preservation packet that fails closed on malformed trust metadata and carries the three trust axes through current owner payloads end to end.

**How it works**: The packet adds validation at graph and bridge emission boundaries, preserves the separated fields across shared-payload, bootstrap, resume, graph-context, and bridge consumers, and blocks scalar-collapse attempts through focused contract tests.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive validator plus preservation packet** | Enforces R5 on top of 006 without creating a new owner surface | Requires careful propagation across several existing consumers | 9/10 |
| **Graph-only trust contract family** | Feels locally tidy for graph outputs | Violates the research and duplicates authority ownership | 3/10 |
| **One normalized trust scalar** | Easier to serialize and explain superficially | Recreates the exact collapse R10 and 006 rejected | 1/10 |

**Why this one**: It preserves the research ordering and enforces the contract where malformed payloads or collapsed fields would otherwise leak through.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Code-graph and bridge payloads gain a clear fail-closed trust boundary.
- Successor packets inherit preserved trust axes instead of reconstructing them.

**What it costs**:
- More payload-shape verification is required across current owners. Mitigation: keep the packet tightly focused on the named surfaces and add contract tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope drift into a second graph-only contract family | H | Keep additive-owner rules explicit in spec, tests, and contract docs. |
| Silent field collapse in consumer outputs | H | Add preservation checks on every named consumer path. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R5 explicitly calls for payload validation and separate trust fields downstream of R10. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives that invent a graph-only family or one trust scalar were considered and rejected. |
| 3 | **Sufficient?** | PASS | The packet stays bounded to payload emission and preservation seams. |
| 4 | **Fits Goal?** | PASS | The packet exists to enforce 006 rather than redefine the contract. |
| 5 | **Open Horizons?** | PASS | 008 and later packets can consume a preserved trust contract without redesigning it. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet-local spec, plan, tasks, checklist, and implementation-summary documents.
- Later runtime and contract work in the owner surfaces named in `spec.md`.

**How to roll back**: Revert packet-local runtime changes, keep 006 as the canonical trust-axis contract, and archive the packet if the seam is no longer needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
