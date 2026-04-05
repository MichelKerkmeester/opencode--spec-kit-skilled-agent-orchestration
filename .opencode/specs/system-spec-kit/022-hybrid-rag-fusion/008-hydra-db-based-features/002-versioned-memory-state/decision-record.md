---
title: "Decis [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/decision-record]"
description: "Phase-local architecture decisions for Hydra Phase 2 lineage rollout."
trigger_phrases:
  - "phase 2 adr"
  - "lineage adr"
importance_tier: "critical"
contextType: "planning"
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
---
# Decision Record: 002-versioned-memory-state

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-201: Keep Immutable Lineage History Separate from Active Projection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainer |

---

### Context

Historical correctness and current-read performance pull the storage model in different directions. A single mutable structure would make `asOf` semantics hard to reason about, while scanning full lineage for every current read would be too costly.

### Constraints

- Existing MCP storage architecture must remain evolvable, not replaced wholesale.
- Rollback must stay possible through checkpoints.
- Later phases need stable lineage identifiers and current-state semantics.

---

### Decision

**We chose**: store immutable lineage history separately from an active projection used for current reads.

**How it works**: every superseding write appends a new version to lineage history and updates the current-state projection. Historical reads traverse lineage rules; current reads use the active projection.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate lineage and projection** | Clear semantics, faster current reads, easier `asOf` reasoning | Needs synchronization logic | 9/10 |
| Mutable in-place updates only | Simple write path | Loses historical truth | 3/10 |
| Full lineage scan for every read | Simple model | Poor current-read performance | 5/10 |

**Why this one**: It gives Phase 2 the cleanest contract for both correctness and performance.

---

### Consequences

**What improves**:
- Historical truth remains explicit.
- Current reads stay efficient.

**What it costs**:
- Projection consistency becomes another thing to verify. Mitigation: add integrity validators and rollback drills.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Projection and lineage drift apart | H | Integrity checks and transactional updates |
| Migration complexity grows | M | Keep checkpoints and dry-run backfill |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Temporal truth is a core Phase 2 goal |
| 2 | **Beyond Local Maxima?** | PASS | Compared against mutable-only and scan-only options |
| 3 | **Sufficient?** | PASS | Solves correctness and performance without a rewrite |
| 4 | **Fits Goal?** | PASS | Directly unblocks Phase 3 and Phase 5 |
| 5 | **Open Horizons?** | PASS | Leaves room for future optimization without redefining the contract |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Schema extensions for lineage and active projection
- Write-path transition logic
- Temporal read resolver and integrity validation

**How to roll back**: restore the pre-lineage checkpoint, disable lineage rollout flags, and rerun current-read smoke checks.

<!-- /ANCHOR:adr-001 -->
