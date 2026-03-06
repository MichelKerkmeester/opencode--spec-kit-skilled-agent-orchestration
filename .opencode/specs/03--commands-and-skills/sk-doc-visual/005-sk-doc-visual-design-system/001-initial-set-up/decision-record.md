---
title: "Decision Record"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: SK-Doc-Visual Design System

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Source-Anchored Extraction as Canonical Documentation

<!-- ANCHOR:adr-001-context -->
### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-28 |
| **Deciders** | Michel Kerkmeester, OpenCode Agent |

### Context
We needed to stabilize design-system documentation for `sk-doc-visual`.
The previous state claimed extraction completion but did not include extracted evidence tables, which made review and reuse unreliable.

### Constraints
- The canonical source is `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` and must remain unchanged.
- Remediation scope is limited to `specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/001-initial-set-up`.
- Completion evidence must be command-backed for validation and memory-save workflows.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Document the design system directly from source HTML with line-referenced evidence tables inside `spec.md`.

**How it works**: `spec.md` Section 13 records layout patterns, full CSS variable inventory, component contracts, and the 15-section map with source references.
Supporting files (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) are synchronized to the same evidence model.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Source-anchored extraction (chosen)** | Highest fidelity, auditable with file:line evidence | Must be updated when source template changes | 9/10 |
| Narrative-only documentation | Quick to write | Not auditable, drifts from source quickly | 4/10 |
| New design system authored from scratch | Full control over structure | Breaks alignment with current runtime template | 3/10 |

**Why this one**: It is the only option that preserves canonical fidelity and supports deterministic review.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**:
- Reviewers can verify claims against explicit source references.
- Future updates can diff source HTML against documented tables.

**What it costs**:
- Documentation must be refreshed when the template evolves. Mitigation: keep extraction commands and source references in spec artifacts.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Source template changes invalidate references | Medium | Re-run extraction commands and refresh Section 13 tables. |
| Checklist drifts to unchecked assumptions | Medium | Require evidence or explicit N/A rationale on each completed item. |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prior docs lacked extracted artifact detail and auditability. |
| 2 | **Beyond Local Maxima?** | PASS | Compared extraction vs narrative-only vs rewrite options. |
| 3 | **Sufficient?** | PASS | Added exact evidence tables without touching runtime templates. |
| 4 | **Fits Goal?** | PASS | Goal is documentation fidelity, not UI refactor. |
| 5 | **Open Horizons?** | PASS | Future contributors can repeat extraction with the same process. |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**:
- `spec.md`: Added full extraction evidence section with source references.
- `plan.md` and `tasks.md`: Updated execution and verification flow to include validation and memory-save commands.
- `checklist.md`: Converted from assumption-based completion to evidence-backed verification with N/A rationale where needed.
- `implementation-summary.md`: Added verification and lifecycle evidence for handoff quality.

**How to roll back**:
1. Revert only files in `specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/001-initial-set-up`.
2. Restore previous checkpoint from git history for this folder.
3. Re-run validation to ensure restored state is consistent.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
