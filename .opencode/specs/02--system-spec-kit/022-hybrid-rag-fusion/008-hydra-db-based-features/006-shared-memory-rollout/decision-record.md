---
title: "Decisi [02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/decision-record]"
description: "Phase-local architecture decisions for Hydra Phase 6 collaboration rollout."
trigger_phrases:
  - "phase 6 adr"
  - "shared memory adr"
importance_tier: "critical"
contextType: "decision"
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
---
# Decision Record: 006-shared-memory-rollout

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-601: Ship Shared Memory as Opt-In Cohorts with Deny-by-Default Membership

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainer |

---

### Context

Shared memory is the most visible and risky part of the roadmap. It can unlock strong collaboration value, but it also multiplies the impact of any missing governance, confusing conflict behavior, or weak rollback controls.

### Constraints

- Phase 5 governance controls must remain mandatory.
- Operators need kill switches and staged rollout control.
- Early conflict behavior should stay simple and auditable.

---

### Decision

**We chose**: launch shared memory through opt-in cohorts with deny-by-default membership and hard rollback controls.

**How it works**: operators enable shared spaces only for approved cohorts, governance checks remain active, conflict handling stays explicit, and kill switches can disable collaboration quickly if needed.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in cohorts with deny-by-default membership** | Safest rollout, clear operator control, easy rollback | Slower expansion | 9/10 |
| Default-on collaboration | Fastest adoption | Highest leak and incident risk | 2/10 |
| Shared memory without explicit conflict strategy | Simpler first implementation | Too confusing and unsafe to operate | 4/10 |

**Why this one**: It gives the roadmap a collaboration release path that preserves the trust built in earlier phases.

---

### Consequences

**What improves**:
- Safer collaboration rollout
- Better operator control and clearer incident response

**What it costs**:
- More deliberate release management. Mitigation: keep the initial rollout surface focused and well documented.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cohort controls are too coarse | M | Expand cohort tooling only after initial evidence |
| Conflict strategy is too simplistic | M | Start simple, instrument it, and refine carefully |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Shared memory needs strong rollout control |
| 2 | **Beyond Local Maxima?** | PASS | Default-on and under-specified options were considered |
| 3 | **Sufficient?** | PASS | Opt-in cohorts and deny-by-default membership address the core rollout risk |
| 4 | **Fits Goal?** | PASS | Directly supports safe collaboration rollout |
| 5 | **Open Horizons?** | PASS | Leaves room to expand cohorts after evidence is gathered |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Shared-space modules, membership and conflict handling, telemetry, rollout controls, and runbooks

**How to roll back**: disable collaboration cohorts, confirm baseline governed behavior, and rerun rollback smoke tests before any re-enable decision.

<!-- /ANCHOR:adr-001 -->
