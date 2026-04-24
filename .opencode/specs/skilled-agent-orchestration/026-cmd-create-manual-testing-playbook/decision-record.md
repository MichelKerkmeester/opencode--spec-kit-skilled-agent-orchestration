---
title: "Decision Record: /create:testing-pl [skilled-agent-orchestration/026-cmd-create-manual-testing-playbook/decision-record]"
description: "Accepted implementation decision covering naming, source inputs, integrated root guidance, and runtime scope for /create:testing-playbook."
trigger_phrases:
  - "testing playbook command adr"
  - "/create:testing-playbook decision record"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/026-cmd-create-manual-testing-playbook"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: /create:testing-playbook Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Implement the Command from the Shipped Testing-Playbook Contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-19 |
| **Deciders** | User, spec packet author |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed one implementation decision that covers naming, source inputs, root-guidance ownership, and runtime scope without drifting from the shipped playbook contract. The command has to be discoverable as `/create:testing-playbook`, generate the published `manual_testing_playbook/` package, use the `sk-doc` testing-playbook guidance bundle, preserve integrated root guidance, and avoid recreating legacy sidecar structures.

### Constraints

- The output package name is already standardized as `manual_testing_playbook/`.
- The implementation must use the `sk-doc` creation guidance and both scaffold layers together.
- Shared review and orchestration policy belongs in the root playbook, not sidecar files.
- Runtime parity must stay limited to real command surfaces.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep `/create:testing-playbook` as the command name, generate `<skill-root>/manual_testing_playbook/`, load the `sk-doc` testing-playbook creation guide plus both templates, keep shared review/orchestration guidance in the root playbook, and create only the real `.agents` mirror while updating the remaining runtime surfaces through documentation.

**How it works**: The command documentation will explain the naming translation, treat the `sk-doc` reference and template bundle as one required source package, scaffold the integrated root-guidance model, and keep runtime parity honest by using one real mirror plus discovery-doc updates elsewhere.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use shipped contract end to end** | Preserves package shape, prompt model, and root-guidance rules | Requires explicit documentation of translation and source-input scope | 10/10 |
| Simplify to one template or revive sidecar structures | Less context in the command | Reintroduces structural drift and weaker playbook scaffolding | 2/10 |

**Why this one**: It is the only option that preserves the full shipped playbook contract without inventing new structure or omitting required guidance.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The command stays easy to discover in create-command menus.
- The generated folder shape stays aligned with the shipped playbook contract.

**What it costs**:
- Readers need one explicit note about naming translation and source-input scope. Mitigation: make both part of the setup flow and acceptance criteria.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users assume the output folder uses the command slug | M | Document the translation in spec, command doc, and examples |
| Implementation omits one required source input | H | Treat the creation guide and both templates as a single required input set |
| Legacy sidecar structures leak back in | H | Treat their absence as a P0 implementation and verification rule |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The command must preserve the shipped package contract and source bundle |
| 2 | **Beyond Local Maxima?** | PASS | Simpler partial options were considered and rejected for drift risk |
| 3 | **Sufficient?** | PASS | One combined decision covers naming, inputs, root-guidance rules, and runtime scope |
| 4 | **Fits Goal?** | PASS | Directly supports the requested command while keeping package output correct |
| 5 | **Open Horizons?** | PASS | Leaves room for future command growth without changing the current playbook contract |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Command doc examples will use `/create:testing-playbook`.
- Output paths will consistently target `manual_testing_playbook/`.
- Command assets will load the `sk-doc` creation guide and both template layers.
- The generated package will keep shared review and orchestration policy in the root playbook.

**How to roll back**: Remove the new command family and associated doc updates together if the contract cannot be preserved cleanly.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
