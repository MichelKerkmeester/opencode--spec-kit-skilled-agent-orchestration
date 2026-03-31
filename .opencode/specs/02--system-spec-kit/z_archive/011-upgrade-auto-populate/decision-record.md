---
title: "Decision Record: Upgrade Auto Populate [02--system-spec-kit/z_archive/011-upgrade-auto-populate/decision-record]"
description: "Archive normalization decision record for Upgrade Auto Populate."
trigger_phrases:
  - "decision record"
  - "archive"
  - "validation"
  - "normalization"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Upgrade Auto Populate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Normalize the archive to current Level 1 compatibility

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-31 |
| **Deciders** | Spec archive maintenance |

---

<!-- ANCHOR:adr-001-context -->
### Context

The archived folder for Upgrade Auto Populate had drifted away from the active templates. We needed a safe way to preserve the archive while eliminating validator errors.

### Constraints

- The folder had to stay within archive scope instead of reopening feature work.
- Existing top-level markdown files could remain, but they could no longer break validation.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Normalize the archive to the current Level 1 template set and keep lightweight compatibility stubs for legacy files.

**How it works**: The core docs use the active Level 1 structure. Any retained checklist, decision record, or archive note is simplified so it remains readable without reintroducing higher-level validator failures.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: Level 1 normalization** | Fast, stable, and validator-friendly for archives | Condenses some historical detail | 9/10 |
| Preserve older mixed-level docs | Keeps more historical structure | Continues failing modern validation | 3/10 |

**Why this one**: It preserves the archive as a usable record while minimizing future maintenance cost.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The archived folder can validate cleanly under current rules.
- Maintainers get a short, readable explanation of the archived topic.

**What it costs**:
- Detailed historical narrative is reduced. Mitigation: consult git history when deeper reconstruction is needed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future validator changes add new archive requirements | M | Revalidate and refresh the archive with current templates if needed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The archive had active error-level validation failures. |
| 2 | **Beyond Local Maxima?** | PASS | We compared preservation of legacy structure against normalization. |
| 3 | **Sufficient?** | PASS | Level 1 compliance removes error-level drift without reopening scope. |
| 4 | **Fits Goal?** | PASS | The goal is a stable archive, not a new implementation cycle. |
| 5 | **Open Horizons?** | PASS | Future maintainers can still rebuild deeper history from git when needed. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Rewrite core docs to current Level 1 structure.
- Simplify retained legacy markdown into safe archival notes.

**How to roll back**: Restore the previous archive files from git history and rerun validation to compare outcomes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
