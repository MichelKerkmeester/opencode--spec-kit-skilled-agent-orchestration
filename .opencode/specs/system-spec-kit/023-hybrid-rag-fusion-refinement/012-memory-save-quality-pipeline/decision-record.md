---
title: "Decision Record: Memory Save Quality Pipeline [system-spec-kit/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline/decision-record]"
description: "Architecture decisions for structured memory-save quality remediation."
trigger_phrases:
  - "decision record"
  - "memory save quality decisions"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Memory Save Quality Pipeline

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse Existing Normalization Instead of Building a Parallel Structured Pipeline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-01 |
| **Deciders** | Spec-kit maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

Structured (`--json`/`--stdin`) saves were underperforming because the primary path still assumed transcript-heavy inputs. The team needed a fix that improved structured quality without destabilizing transcript behavior.

### Constraints

- Changes had to stay compatible with existing workflow/extractor contracts.
- Validation safety could not be broadly relaxed.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Extend existing normalization and extraction paths with structured-aware guards rather than create an independent structured-only pipeline.

**How it works**: Structured fields are normalized into canonical forms, synthesis fills message gaps when needed, and quality/validation modules apply constrained structured-aware logic.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend existing pipeline (chosen)** | Lower risk, less duplication, easier maintenance | Requires careful guard conditions | 9/10 |
| Build separate structured pipeline | Clear isolation | High duplication and regression risk | 5/10 |

**Why this one**: It solved the root cause while minimizing blast radius and preserving existing transcript behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Structured saves produce higher-signal outputs.
- Existing pipeline remains unified and maintainable.

**What it costs**:
- Guard-condition complexity increases. Mitigation: keep behavior explicitly documented and tested.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Structured-mode over-permissiveness in validation | H | Restrict relaxations to same-parent sibling references |
| Quality-floor inflation | M | Damped and capped floor with contamination override |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Root-cause analysis showed structured path quality collapse |
| 2 | **Beyond Local Maxima?** | PASS | Alternative architecture was considered and rejected |
| 3 | **Sufficient?** | PASS | Existing pipeline extension covers required fixes |
| 4 | **Fits Goal?** | PASS | Targets core save-quality failures directly |
| 5 | **Open Horizons?** | PASS | Keeps future improvements centralized |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Workflow normalization wiring for structured payloads.
- Structured extraction, decision shaping, contamination, and quality-score refinements.

**How to roll back**: Revert structured-path patches module-by-module and rebuild scripts/dist.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
