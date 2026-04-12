---
title: "Decision Record: Warm-Start Bundle Conditional Validation [template:level_3/decision-record.md]"
description: "Decision record for 013-warm-start-bundle-conditional-validation."
trigger_phrases:
  - "013-warm-start-bundle-conditional-validation"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: Warm-Start Bundle Conditional Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the warm-start bundle conditional until the full matrix proves dominance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

R8 explicitly moved the warm-start bundle out of early multiplier status and into a terminal validation slot behind R2, R3, and R4. The bundle remains worthwhile only if the combined configuration lowers cost without losing pass rate on a frozen resume-plus-follow-up corpus when compared against both baseline and component-only variants.

### Constraints

- Must preserve the dependency order: R2, R3, R4, then bundle validation.
- Must treat the combined bundle as non-default until the complete benchmark matrix proves otherwise.
- Must stay inside the named test, eval, and ENV surfaces rather than rewriting the benchmark harness broadly.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Open a bounded validation packet that freezes the corpus, runs the full baseline-plus-variants comparison matrix, and keeps the warm-start bundle conditional unless the combined R2+R3+R4 configuration dominates.

**How it works**: The packet defines one frozen corpus, orchestrates baseline and component-only comparisons, then evaluates the combined bundle against the exact R8 acceptance criterion before any later rollout packet can treat it as promotion-ready.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conditional validation packet** | Preserves the research ordering and forces evidence before rollout | Delays any default-bundle claim until the full matrix is available | 9/10 |
| **Promote the bundle after predecessor completion only** | Faster narrative progress | Risks turning prerequisites into assumed proof without a frozen comparison matrix | 4/10 |

**Why this one**: It matches the research downgrade, keeps fairness explicit, and prevents certainty laundering from partial wins or missing variants.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Bundle rollout is tied to auditable evidence rather than intuition.
- Later packets inherit a clear non-default gate and comparison contract.

**What it costs**:
- The bundle may remain conditional longer if the matrix or predecessors are incomplete. Mitigation: keep the blocker explicit instead of widening scope.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Partial comparison treated as sufficient | H | Require baseline plus each component-only variant before any promotion claim. |
| Missing predecessor packet muddies readiness | H | Keep readiness status explicit and fail closed when prerequisites are absent. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R8 specifically requires this validation packet before bundle promotion. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were considered, including skipping directly to rollout assumptions. |
| 3 | **Sufficient?** | PASS | The packet focuses on one bounded validation seam rather than broader harness changes. |
| 4 | **Fits Goal?** | PASS | The packet exists to prove or reject default promotion using the exact research criterion. |
| 5 | **Open Horizons?** | PASS | Later rollout or publication work can build on this gate without redefining the evidence contract. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet-local spec, plan, tasks, checklist, and implementation-summary documents.
- Frozen corpus fixtures, bounded eval orchestration, and conditional ENV reference wording as named in `spec.md`.

**How to roll back**: Revert packet-local benchmark and documentation changes, preserve predecessor packet state, and keep the warm-start bundle conditional until the validation contract is restored.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
