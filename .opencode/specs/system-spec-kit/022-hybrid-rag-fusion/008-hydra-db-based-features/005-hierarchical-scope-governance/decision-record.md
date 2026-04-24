---
title: ".. [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance/decision-record]"
description: "Phase-local architecture decisions for Hydra Phase 5 governance rollout."
trigger_phrases:
  - "phase 5 adr"
  - "governance adr"
importance_tier: "critical"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
---
# Decision Record: 005-hierarchical-scope-governance

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-501: Centralize Governance and Finish It Before Shared Memory

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainer |

---

### Context

Shared-memory collaboration raises the risk of cross-scope leakage sharply. If policy checks stay partial or scattered, it becomes too easy for one path to bypass governance and compromise isolation.

### Constraints

- Scope enforcement must be consistent across all relevant paths.
- Deletion and retention behavior must be auditable.
- Shared-memory rollout must stay blocked until governance passes.

---

### Decision

**We chose**: centralize governance enforcement and complete it before Phase 6 shared-memory rollout begins.

**How it works**: build shared policy middleware, governed ingest, lifecycle jobs, and audit outputs first. Treat Phase 6 as blocked until those controls pass verification.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Governance first** | Safer rollout, clearer audit story, fewer leak paths | Slower visible collaboration launch | 9/10 |
| Shared memory before governance | Faster demo value | High leak and compliance risk | 3/10 |
| Partial governance scattered by module | Lower short-term refactor cost | Inconsistent enforcement and harder audits | 5/10 |

**Why this one**: It protects the roadmap at the point where data-sharing risk becomes highest.

---

### Consequences

**What improves**:
- Stronger isolation and lifecycle control
- Cleaner rollout gate for collaboration

**What it costs**:
- More upfront platform work before shared features. Mitigation: keep policy surfaces centralized and testable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Policy complexity slows delivery | M | Keep the MVP policy set focused |
| One path bypasses shared middleware | H | Require leak tests across every affected path |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Collaboration without governance is unsafe |
| 2 | **Beyond Local Maxima?** | PASS | Shared-first and partial-governance options were considered |
| 3 | **Sufficient?** | PASS | Central middleware and lifecycle controls address the main risks |
| 4 | **Fits Goal?** | PASS | Directly supports safe shared-memory rollout |
| 5 | **Open Horizons?** | PASS | Leaves room for future policy expansion after a stable core |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Governance middleware, scope-aware retrieval and ingest, lifecycle jobs, audit output, and leak-test coverage

**How to roll back**: disable governance rollout, restore affected data if needed, and rerun isolation smoke tests before resuming any rollout.

<!-- /ANCHOR:adr-001 -->
