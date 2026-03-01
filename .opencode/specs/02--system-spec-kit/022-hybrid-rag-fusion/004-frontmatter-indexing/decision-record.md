---
title: "Decision Record: 004-frontmatter-indexing [004-frontmatter-indexing/decision-record]"
description: "We need one predictable metadata contract before rebuilding indexes. Legacy documents contain mixed key casing, optional aliases, and inconsistent scalar vs list values. If we r..."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "record"
  - "004"
  - "frontmatter"
  - "indexing"
  - "decision record"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: 004-frontmatter-indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical Frontmatter Contract Before Reindex

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec Kit maintainers |

---

### Context

We need one predictable metadata contract before rebuilding indexes. Legacy documents contain mixed key casing, optional aliases, and inconsistent scalar vs list values. If we reindex before normalization, retrieval quality and parser reliability drift by source type.

### Constraints

- Migration must be idempotent and safe to rerun.
- Existing document content outside frontmatter must remain unchanged.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: canonical frontmatter normalization as a blocking step before index rebuild.

**How it works**: parser and compose tooling will map legacy keys to canonical keys, coerce values to canonical types, and emit deterministic frontmatter ordering. Reindex runs only after migration reports zero hard errors.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical normalize then rebuild** | Deterministic metadata, testable migration, stable retrieval inputs | Requires up-front schema design and corpus rewrite | 9/10 |
| Reindex legacy metadata as-is | Faster initial delivery | Preserves drift, and parser complexity is harder to debug | 4/10 |

**Why this one**: it creates a durable contract that simplifies indexing, testing, and future template evolution.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Retrieval and indexing operate on one metadata shape across templates/spec/memory docs.
- Parser behavior and tests become easier to reason about and maintain.

**What it costs**:
- Bulk migration introduces review overhead. Mitigation: use dry-run diff mode and staged apply.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy edge cases fail migration | M | Add compatibility mapping + explicit error reporting |
| Large rewrite hides accidental changes | M | Restrict rewrite scope to frontmatter and validate idempotency |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Index quality depends on consistent metadata contracts. |
| 2 | **Beyond Local Maxima?** | PASS | Compared normalize-first vs reindex-as-is approaches. |
| 3 | **Sufficient?** | PASS | Canonical schema + idempotent migration is the simplest robust path. |
| 4 | **Fits Goal?** | PASS | Directly targets frontmatter normalization and rebuild objective. |
| 5 | **Open Horizons?** | PASS | Enables stable future schema evolution and validation tooling. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add canonical schema mapping and parser/compose normalization logic.
- Add migration + reindex execution flow with regression tests.

**How to roll back**: revert migration outputs and parser changes, restore prior index snapshot, rerun baseline tests.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
