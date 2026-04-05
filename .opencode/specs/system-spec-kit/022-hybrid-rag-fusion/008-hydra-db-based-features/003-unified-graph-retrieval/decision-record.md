---
title: "Deci [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/003-unified-graph-retrieval/decision-record]"
description: "Phase-local architecture decisions for Hydra Phase 3 graph fusion."
trigger_phrases:
  - "phase 3 adr"
  - "graph fusion adr"
importance_tier: "critical"
contextType: "planning"
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
---
<!-- ANCHOR:adr-001 -->
# Decision Record: 003-unified-graph-retrieval

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-301: Keep Graph Fusion Inside the Current Retrieval Pipeline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainer |

---

### Context

The server already has hybrid candidate generation and graph-adjacent signals. Splitting this phase into a separate service would add new operational complexity before the core retrieval contract is even stable.

### Constraints

- Retrieval must stay deterministic and rollbackable.
- Later adaptive phases need stable traces and stable inputs.
- Team velocity favors reuse of the current pipeline.

---

### Decision

**We chose**: integrate graph fusion directly into the current retrieval pipeline instead of creating an external graph service.

**How it works**: extend the existing stages with bounded graph enrichment and explicit scoring rules. Emit traces and telemetry so the effect of graph signals stays visible and measurable.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process graph fusion** | Lower ops cost, faster to ship, easier rollback | Adds complexity to existing pipeline | 9/10 |
| External graph service first | Cleaner long-term separation | Premature infra cost and more failure modes | 5/10 |
| Keep fragmented signals | Minimal change | Misses the core phase goal | 3/10 |

**Why this one**: It gives the roadmap the shortest path to measurable graph-aware retrieval without hiding complexity in a new service boundary.

---

### Consequences

**What improves**:
- One coherent graph-aware retrieval path
- Simpler rollback and local debugging

**What it costs**:
- The current pipeline becomes more sophisticated. Mitigation: explicit tie-break rules, traces, and regression tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Non-deterministic ordering | H | Determinism tests and explicit tie-break rules |
| Latency overhead | H | Bounded expansion and benchmarks |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fragmented signals are the core Phase 3 problem |
| 2 | **Beyond Local Maxima?** | PASS | External-service option considered and rejected for now |
| 3 | **Sufficient?** | PASS | Solves the current problem without extra infrastructure |
| 4 | **Fits Goal?** | PASS | Directly supports graph-aware retrieval and explainability |
| 5 | **Open Horizons?** | PASS | Leaves room to externalize later if evidence demands it |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Candidate enrichment, graph scoring, determinism, trace telemetry, and regression coverage

**How to roll back**: disable graph fusion, confirm baseline retrieval behavior, and revert the in-process scoring changes if needed.

<!-- /ANCHOR:adr-001 -->
