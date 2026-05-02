---
title: "Dec [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/004-adaptive-retrieval-loops/decision-record]"
description: "Phase-local architecture decisions for Hydra Phase 4 adaptive learning."
trigger_phrases:
  - "phase 4 adr"
  - "adaptive adr"
importance_tier: "critical"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/004-adaptive-retrieval-loops"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
---
<!-- ANCHOR:adr-001 -->
# Decision Record: 004-adaptive-retrieval-loops

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-401: Require Shadow Mode Before Any Adaptive Promotion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainer |

---

### Context

Adaptive ranking can create silent regressions if it is allowed to change production behavior before we understand its effects. The roadmap needs a way to learn from signals without turning retrieval into an uncontrolled experiment.

### Constraints

- Phase 3 retrieval must remain the stable baseline.
- Promotion decisions need clear evidence and auditability.
- Rollback must be immediate and simple.

---

### Decision

**We chose**: run adaptive ranking in shadow mode only until explicit promotion criteria are met.

**How it works**: adaptive policies observe and score alongside the live baseline, but they do not affect live ordering until regression evidence, thresholds, and reviewers approve promotion.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shadow mode first** | Safer rollout, better evidence, easier rollback | Slower visible activation | 9/10 |
| Live adaptive updates immediately | Fastest learning | High regression and audit risk | 3/10 |
| Offline analysis only | Lowest runtime risk | Misses realistic evaluation conditions | 6/10 |

**Why this one**: It gives the roadmap a realistic evaluation path without exposing users to uncontrolled ranking changes.

---

### Consequences

**What improves**:
- Clearer evidence before promotion
- Simpler rollback and safer iteration

**What it costs**:
- Extra evaluation time before visible release. Mitigation: keep the shadow review loop well-instrumented.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shadow signals are too sparse | M | Threshold gates and manual review |
| Audit trails are incomplete | H | Decision traces and checklist sign-off |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Adaptive ranking is too risky to activate blindly |
| 2 | **Beyond Local Maxima?** | PASS | Immediate-live and offline-only options were considered |
| 3 | **Sufficient?** | PASS | Shadow mode provides realistic evaluation without live risk |
| 4 | **Fits Goal?** | PASS | Directly supports self-improving retrieval safely |
| 5 | **Open Horizons?** | PASS | Leaves room for future promotion once evidence exists |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Signal capture, adaptive policy logic, shadow evaluation, decision traces, and rollback controls

**How to roll back**: disable adaptive mode, clear or ignore adaptive state, and rerun baseline regression checks.

<!-- /ANCHOR:adr-001 -->
