---
title: "Decision Record: /create:feature-catalog [03--commands-and-skills/025-cmd-create-feature-catalog/decision-record]"
description: "Accepted implementation decision covering naming, source inputs, and runtime-surface scope for /create:feature-catalog."
trigger_phrases:
  - "feature catalog command adr"
  - "/create:feature-catalog decision record"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: /create:feature-catalog Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Implement the Command from the Shipped Feature-Catalog Contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-19 |
| **Deciders** | User, spec packet author |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed one implementation decision that covers naming, source inputs, and runtime scope without drifting from the shipped documentation contract. The command has to be discoverable as `/create:feature-catalog`, generate the published `feature_catalog/` package, use the `sk-doc` feature-catalog guidance bundle, and mirror only the runtime surfaces that actually exist.

### Constraints

- The output package name is already standardized as `feature_catalog/`.
- The implementation must use the `sk-doc` creation guidance and both scaffold layers together.
- Runtime parity must stay limited to real command surfaces.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep `/create:feature-catalog` as the command name, generate `<skill-root>/feature_catalog/`, load the `sk-doc` creation guide plus both feature-catalog templates, and create only the real `.agents` mirror while updating the remaining runtime surfaces through documentation.

**How it works**: The command documentation will explain the naming translation, treat the `sk-doc` reference and template bundle as one required source package, and keep runtime parity honest by using one real mirror plus discovery-doc updates elsewhere.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use shipped contract end to end** | Preserves published package shape and source inputs | Requires explicit documentation of translation and mirror policy | 10/10 |
| Simplify to one template or one mirror rule | Less context in the command | Reintroduces contract drift or fake runtime symmetry | 4/10 |

**Why this one**: It is the only option that preserves the full shipped contract without inventing new structure or omitting required source inputs.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The command stays easy to discover in create-command menus.
- The generated folder shape stays aligned with the current feature-catalog contract.

**What it costs**:
- Readers need one explicit note about naming translation and source-input scope. Mitigation: make both part of the setup flow and acceptance criteria.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users assume the output folder uses the command slug | M | Document the translation in spec, command doc, and examples |
| Implementation omits one required source input | H | Treat the creation guide and both templates as a single required input set |
| Runtime docs imply unsupported mirrors | M | Restrict the mirror to `.agents` and update other surfaces as docs only |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The command must preserve the shipped package contract and source bundle |
| 2 | **Beyond Local Maxima?** | PASS | Simpler partial options were considered and rejected for drift risk |
| 3 | **Sufficient?** | PASS | One combined decision covers naming, inputs, and runtime scope |
| 4 | **Fits Goal?** | PASS | Directly supports the requested command while keeping package output correct |
| 5 | **Open Horizons?** | PASS | Leaves room for future command growth without changing the current package contract |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Command doc examples will use `/create:feature-catalog`.
- Output paths will consistently target `feature_catalog/`.
- Command assets will load the `sk-doc` creation guide and both template layers.
- Runtime parity will be implemented through one `.agents` mirror plus synchronized discovery docs.

**How to roll back**: Remove the new command family and associated doc updates together if the contract cannot be preserved cleanly.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
