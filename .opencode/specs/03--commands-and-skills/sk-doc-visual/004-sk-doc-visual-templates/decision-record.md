---
title: "Decision Record: sk-doc-visual Template Improvement [044-sk-doc-visual-template-improvement/decision-record]"
description: "Level 3 ADRs for modernization scope, validator policy, and completion workflow controls."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision record"
  - "adr"
  - "validator policy"
  - "template modernization"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: sk-doc-visual Template Improvement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

## Closeout Status

| Field | Value |
|-------|-------|
| **Status** | Completed |
| **Completed** | 2026-02-23 |
| **Execution Summary** | Implementation finished for scoped `sk-doc-visual` files; validation and memory-save gates passed |

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Modernize the Full Surface, Not a Partial Subset

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Date** | 2026-02-23 |
| **Deciders** | AI Agent, User Intent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The research synthesis shows mismatches across skill policy, references, templates, and validator rules. A partial migration would leave conflicting behavior and repeat work in later passes.

### Constraints

- Objective requires template improvement at system level, not one-file polish.
- Scope lock must stay deterministic for `/spec_kit:complete` auto mode.
- `research.md` recommendations must be actionable in tasks.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: execute a full-surface modernization covering `SKILL.md`, reference docs, seven templates, and validator alignment in one controlled Level 3 workflow.

**How it works**: The plan and tasks define mandatory phases for each file group. Completion is blocked until rewrite and validation gates pass with evidence.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full-surface modernization (chosen)** | End-to-end consistency and fewer follow-up migrations | Higher immediate effort | 9/10 |
| Template-only update | Faster first pass | Leaves skill/reference/validator conflicts unresolved | 4/10 |
| Single-file pilot | Lowest effort | Does not satisfy objective or readiness for auto completion | 2/10 |

**Why this one**: It is the only option that closes all known mismatch classes identified in research and supports reliable completion workflow.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Modernization scope is complete and auditable.
- `/spec_kit:complete` can execute without hidden policy drift.

**What it costs**:
- More coordinated rewrite effort. Mitigation: strict phase sequencing and parallel-safe tasks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rewrite breadth increases regression surface | Medium | Validator + manual checks before completion |
| Longer execution time | Medium | Parallelize non-dependent reference/template tasks |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research identifies multi-domain mismatch, not isolated issue |
| 2 | **Beyond Local Maxima?** | PASS | Compared full migration against partial options |
| 3 | **Sufficient?** | PASS | Covers every mismatch category in scope |
| 4 | **Fits Goal?** | PASS | Directly maps to template improvement objective |
| 5 | **Open Horizons?** | PASS | Reduces future drift and repeated migration cycles |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `tasks.md` includes full rewrite and validator phases.
- `checklist.md` requires evidence for each critical gate.

**How to roll back**: revert changed implementation files per phase baseline and rerun validations.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Adopt README Ledger Profile as Canonical Default

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Date** | 2026-02-23 |
| **Deciders** | AI Agent, User Intent |

---

<!-- ANCHOR:adr-002-context -->
### Context

The provided context package defines explicit design tokens, layout shell, components, and interaction patterns. Existing `sk-doc-visual` defaults differ in token namespace and style assumptions.

### Constraints

- Must use `context/README.html` and `context/context.md` as canonical references.
- Output must remain deterministic and verifiable.
- Migration should not weaken safety checks.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: make README Ledger profile the default target for this modernization wave.

**How it works**: Skill and reference docs define canonical ledger primitives; templates adopt shared ledger shell; verification checks assert parity.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **README Ledger as default (chosen)** | Clear parity target and simple review criteria | Requires broad rewrite across docs/templates | 9/10 |
| Multi-profile coexistence first | Lower short-term disruption | Higher complexity and ambiguous default behavior | 6/10 |
| Keep legacy style and patch visuals | Low immediate effort | Fails modernization objective | 1/10 |

**Why this one**: It directly aligns with user-provided context and removes ambiguity during implementation and QA.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Single source of truth for design and behavior.
- Faster review due to objective parity checks.

**What it costs**:
- Legacy style assumptions may need migration notes. Mitigation: include compatibility notes in references.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Drift between docs and templates | Medium | Cross-check checklist items CHK-011 and CHK-012 |
| Confusion over dependency strategy | Medium | Keep library guide explicit and pinned |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Context files explicitly define target profile |
| 2 | **Beyond Local Maxima?** | PASS | Compared with multi-profile and legacy-patch options |
| 3 | **Sufficient?** | PASS | Covers visual, layout, and interaction contract |
| 4 | **Fits Goal?** | PASS | Exactly matches template improvement objective |
| 5 | **Open Horizons?** | PASS | Establishes clear default for future artifacts |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `SKILL.md` and references are rewritten around ledger profile defaults.
- Seven templates are rewritten to shared ledger shell.

**How to roll back**: restore previous template/doc versions from baseline snapshots and reopen decision if parity constraints change.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Align Validator Policy With Modernization While Preserving Safety

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Date** | 2026-02-23 |
| **Deciders** | AI Agent, User Intent |

---

<!-- ANCHOR:adr-003-context -->
### Context

Research identifies validator constraints that conflict with ledger profile expectations (token contract, typography policy, and controlled interval clock behavior). Without policy alignment, rewritten templates may fail validation even when correct by design intent.

### Constraints

- Validation must remain strict on safety and quality.
- Policy updates must be explicit and testable.
- No silent weakening of checks is acceptable.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: update validator rules to support modernization policy while preserving core safety checks and deterministic pass/fail behavior.

**How it works**: validator logic is revised for token/typography/theme/script allowances tied to documented profile expectations, then validated across all rewritten templates.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Policy-aligned validator update (chosen)** | Accurate validation for new profile, keeps safety gates | Requires careful script edits | 9/10 |
| Disable conflicting checks | Quick green builds | Weakens QA rigor and hides regressions | 1/10 |
| Keep validator unchanged | No script changes | Blocks valid modernization outputs | 3/10 |

**Why this one**: It keeps quality enforcement credible while enabling the intended modernization outcome.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Validator outcomes match the declared style and behavior contract.
- Completion evidence remains objective.

**What it costs**:
- Additional script maintenance. Mitigation: dedicated phase and targeted tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overly broad allowances reduce guardrail strength | High | Tie allowances to explicit profile checks and manual review |
| Script regression from rule edits | Medium | Validate against all seven templates and record outputs |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing validator conflicts with modernization requirements |
| 2 | **Beyond Local Maxima?** | PASS | Compared keep-as-is and disable-check alternatives |
| 3 | **Sufficient?** | PASS | Covers identified contradiction categories |
| 4 | **Fits Goal?** | PASS | Enables reliable completion workflow |
| 5 | **Open Horizons?** | PASS | Provides maintainable policy baseline for future templates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Tasks T500-T503 define validator/drift alignment work.
- Checklist CHK-013, CHK-020 to CHK-023 enforce verification evidence.

**How to roll back**: restore validator scripts to baseline and rerun prior validation profile.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
LEVEL 3 DECISION RECORD
ADRs cover modernization breadth, canonical profile, and validator alignment policy
-->
