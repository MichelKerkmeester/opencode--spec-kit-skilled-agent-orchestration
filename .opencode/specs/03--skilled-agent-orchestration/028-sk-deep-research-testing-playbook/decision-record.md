---
title: "Decision Record: sk-deep-research [03--commands-and-skills/028-sk-deep-research-testing-playbook/decision-record]"
description: "Architectural decisions for the approved sk-deep-research manual testing playbook implementation."
trigger_phrases:
  - "deep research playbook adr"
  - "manual testing playbook decision record"
importance_tier: "important"
contextType: "general"
---
# Decision Record: sk-deep-research Manual Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build the playbook first and document the missing feature catalog explicitly

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-19 |
| **Deciders** | Spec author, skill maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-deep-research` has no `manual_testing_playbook/` package and no `feature_catalog/` package. The current `sk-doc` playbook contract expects feature-catalog cross-reference guidance when a catalog exists, but the approved implementation plan is greenfield playbook work only and explicitly acknowledges that no feature catalog exists yet.

### Constraints

- The current task may write only inside this spec folder.
- The future playbook must stay honest about current repository state and cannot invent companion artifacts.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: define a playbook-first package that ships without a companion feature catalog and states that absence explicitly in the root playbook and per-feature metadata.

**How it works**: The future package will assign stable IDs `DR-001` through `DR-019` across the 6 approved category folders. The root playbook will include a feature-catalog cross-reference section that explicitly says no dedicated `feature_catalog/` exists yet for `sk-deep-research`, and per-feature files will repeat that note where the normal contract would otherwise link to catalog entries.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Playbook first, catalog later** | Delivers the operator-facing validation surface now, matches the approved scope, avoids inventing missing docs | Requires a future linking strategy if a feature catalog is added | 9/10 |
| Create feature catalog first | Stronger long-term traceability from day one | Expands scope, delays the first playbook, violates the approved no-catalog reality | 5/10 |
| Wait until both packages can ship together | Keeps both document families aligned immediately | Blocks useful validation work on a future dependency with no approved scope | 4/10 |

**Why this one**: It is the only option that satisfies the approved implementation scope, preserves truthful documentation, and still gives `sk-deep-research` a reusable manual validation surface.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The first playbook can ship without waiting on a second documentation package.
- Operators get stable scenario IDs that future catalog work can map back to.

**What it costs**:
- Future feature-catalog work must decide how to map or reuse the published playbook IDs. Mitigation: keep playbook IDs stable and document the open question now.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future catalog work creates a conflicting ID scheme | M | Preserve stable playbook IDs and record the linking decision when catalog work starts |
| Reviewers assume the missing catalog is an accidental omission | M | State the absence explicitly in root and per-feature docs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The repository currently lacks any playbook for `sk-deep-research` |
| 2 | **Beyond Local Maxima?** | PASS | We considered catalog-first and dual-package options before choosing playbook-first |
| 3 | **Sufficient?** | PASS | A playbook-first package solves the immediate operator-validation need without extra scope |
| 4 | **Fits Goal?** | PASS | The approved plan is greenfield playbook implementation only |
| 5 | **Open Horizons?** | PASS | Stable playbook IDs preserve a clean path to future catalog linkage |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The future root playbook gains explicit "no feature catalog yet" language in its cross-reference section.
- Every per-feature file uses stable `DR-001` through `DR-019` IDs and metadata that can support later catalog mapping.

**How to roll back**: If catalog-first work becomes mandatory before playbook authoring starts, pause playbook implementation, add a new decision record that supersedes this one, and regenerate the scenario inventory against the new document-family plan.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Use the integrated root-guidance package shape and the approved 6-category scenario map

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-19 |
| **Deciders** | Spec author, skill maintainer |

---

### Context

The current `sk-doc` contract requires a root playbook file plus numbered category folders with one per-feature file per feature ID. The approved implementation plan also fixes the scenario inventory: `DR-001` through `DR-019` across 6 categories, ending with synthesis, save, and guardrails rather than a guardrails-only category.

### Constraints

- The package must follow the shipped `sk-doc` contract exactly.
- Operators need truthful manual scenarios for what is live today, not speculative runtime claims.

---

### Decision

**We chose**: use the integrated root-guidance package shape from `sk-doc` and map the approved `DR-001` through `DR-019` inventory into the 6 named category folders.

**How it works**: The root playbook will own review protocol, orchestration rules, evidence expectations, and category summaries. Per-feature files will hold scenario execution truth, and the approved categories will flow from entry points and state setup through iteration discipline, convergence, pause and resume, and finally synthesis, save, and guardrails. `DR-019` closes the package by explaining which behaviors are executable today versus documented for future or reference use only.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Integrated root guidance plus approved 6-category map** | Matches the shipped contract, keeps execution truth centralized, preserves the approved scenario order | Requires careful synchronization across more files | 10/10 |
| Separate sidecar docs for review protocol and runtime limits | Spreads concerns into smaller files | Violates the current contract and recreates deprecated playbook structure | 3/10 |
| Smaller 4-category package | Easier to draft | No longer matches the approved plan or the locked scenario inventory | 2/10 |

**Why this one**: It is the only option that preserves the live `sk-doc` package contract and the approved 19-scenario implementation plan at the same time.

---

### Consequences

**What improves**:
- The playbook stays structurally aligned with the shipped `sk-doc` contract.
- The approved scenario ordering is visible in both the root guide and the per-feature files.

**What it costs**:
- The root and per-feature files must stay tightly synchronized. Mitigation: add prompt-sync and link sweeps to the validation workflow.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Root summaries drift from per-feature execution tables | M | Add explicit prompt-sync review during validation |
| Reference-only notes are still phrased as live behavior | H | Keep them explicit in the final synthesis-save-and-guardrails category and review wording manually |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The contract already requires this package shape |
| 2 | **Beyond Local Maxima?** | PASS | We considered sidecars and a smaller category map before rejecting them |
| 3 | **Sufficient?** | PASS | Root guidance plus 19 per-feature files covers both package-level and scenario-level truth |
| 4 | **Fits Goal?** | PASS | The goal is the approved operator-facing manual playbook implementation |
| 5 | **Open Horizons?** | PASS | Stable categories and IDs support future catalog mapping and incremental updates |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- The future package uses one root playbook and 6 numbered category folders with one file per approved feature ID.
- The final category documents progressive synthesis, memory save, LEAF-only behavior, and reference-only boundaries as first-class scenario concerns.

**How to roll back**: If the `sk-doc` contract or approved scenario inventory changes before implementation begins, rebuild the package plan from the updated root and snippet templates and supersede this ADR with the new contract decision.

---

<!--
Level 3 decision record for the approved sk-deep-research manual testing playbook implementation.
-->
