---
title: "Decision Record: Form Input Components [01--anobel.com/z_archive/011-form-input-upload-select/decision-record]"
description: "Archived decision record for Form Input Components Enhancement."
trigger_phrases:
  - "spec"
  - "form"
  - "input"
  - "components"
  - "enhancement"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Form Input Components Enhancement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Normalize Archived Root Documents

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-31 |
| **Deciders** | Copilot archive repair workflow |

---

<!-- ANCHOR:adr-001-context -->
### Context

This folder contains historically useful archive notes, but the active validator now expects newer root document structure. The archive needed compliant root documents without discarding the original markdown.

### Constraints

- The archive content had to remain recoverable.
- The repair needed to avoid introducing broken local markdown references.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Regenerate the required root documents and preserve the original source files in `scratch/legacy`.

**How it works**: The active root docs are rewritten to match the current template structure, while the legacy source markdown is copied aside before any replacement. Supporting archive notes stay in place after unresolved markdown references are sanitized.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Regenerate root docs and preserve originals** | Clears validator errors and keeps history recoverable | Adds a preservation layer in scratch/legacy | 9/10 |
| Leave legacy docs untouched | Zero rewrite effort | Validation errors remain permanent | 3/10 |

**Why this one**: It resolves the compliance problem while still keeping the historical source material available for inspection.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Root archive docs stay compatible with the active validator.
- Historical root markdown remains recoverable from scratch/legacy.

**What it costs**:
- The active root docs become normalized summaries rather than verbatim historical copies. Mitigation: preserve originals in scratch/legacy.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future readers miss a legacy nuance | M | Review the preserved scratch/legacy files when deeper detail is needed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Validator errors blocked archive compliance |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were considered before rewriting |
| 3 | **Sufficient?** | PASS | Root document regeneration solves the validator-facing drift |
| 4 | **Fits Goal?** | PASS | The task focused on spec compliance only |
| 5 | **Open Horizons?** | PASS | Preserved backups keep future review options open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Required root documents are regenerated with current template headers and anchors.
- Original root markdown is copied into scratch/legacy before rewrite.

**How to roll back**: Restore the original root files from scratch/legacy or recover them from git history.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
