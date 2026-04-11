---
title: "Decision Record: Further Deep-Loop Improvements [008]"
description: "Consolidated Phase 008 decision record preserving the three accepted design choices that shaped graph wiring, replay consumers, and tool routing."
trigger_phrases:
  - "008"
  - "phase 8 ADR"
importance_tier: "critical"
contextType: "implementation"
---
# Decision Record: Further Deep-Loop Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Consolidated Phase 008 Runtime-Truth Decisions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | michelkerkmeester-barter |
| **Supporting Evidence** | `v1.6.0.0`, `v1.3.0.0`, `v1.2.0.0`, `scratch/closing-review.md` |

### Context

Phase 008 had three design choices that materially shaped the shipped outcome:

1. which graph-convergence implementation became canonical
2. whether improve-agent replay consumers would be implemented or the docs would be downgraded
3. whether structural graph tools would be provisioned on the live research/review path or removed from prose

The original packet documented these as separate ADR sections. This closeout packet keeps all three accepted decisions intact but consolidates them under one template-compliant decision header so the phase validates cleanly.

### Decision

#### Decision Set 1: MCP handler is the canonical graph regime

- **Choice**: use the shared MCP convergence path as the authoritative graph-convergence implementation.
- **Why**: it fit the phase goal of active, live-path graph consultation better than leaving the CJS helper as a disconnected alternate truth.
- **Evidence**: `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md`; `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md`

#### Decision Set 2: Improve-agent replay consumers are implemented, not downgraded

- **Choice**: teach the improve-agent reducer to read journal, lineage, and mutation-coverage artifacts.
- **Why**: the helper files already existed, and the phase would have left improve-agent contract drift unresolved if it had only downgraded the docs.
- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md`

#### Decision Set 3: Structural graph tools stay on the live path

- **Choice**: keep `code_graph_query` and `code_graph_context` provisioned for the active research and review loop surfaces instead of removing them from prose.
- **Why**: Phase 008’s user-facing success criterion was active graph usage. Removing the tools would have moved in the opposite direction.
- **Evidence**: `implementation-summary.md`; release notes for research and review

### Alternatives Considered

| Option | Pros | Cons | Outcome |
|--------|------|------|---------|
| Keep graph, replay, and tool-routing features active on the live path | Matches the phase goal and release story | Requires coordinated work across skills, workflows, reducers, and tests | Chosen |
| Leave graph wiring or replay consumers as passive helper-only features | Smaller implementation surface | Preserves contract drift and undermines operator trust | Rejected |
| Remove structural graph tools from live-path docs | Smaller doc-only change | Conflicts with the explicit graph-integration goal | Rejected |

### Consequences

**Positive**

- The release notes for all three skills tell a consistent Phase 008 story.
- The phase packet can explain why graph usage, replay consumers, and tool parity were treated as required runtime work instead of optional polish.
- The closing-audit remediation commits have a clear decision context instead of looking like disconnected cleanup.

**Tradeoffs**

- The phase outcome spans multiple commits and release notes, so the packet must preserve the evidence chain carefully.
- A focused closing audit was still needed because the first release pass did not fully close every release-readiness issue.

### Verification

- [x] The three accepted decisions remain represented in this packet. `[EVIDENCE: decision sets 1-3 above]`
- [x] The phase-local closing review and later fixes remain connected to those decisions. `[EVIDENCE: scratch/closing-review.md; c07c9fbcf; f99739742]`
- [x] The packet now uses one template-compliant ADR header instead of multiple custom top-level ADR sections. `[EVIDENCE: this file; strict validation]`

### Rollback

If future packet curation needs the original per-ADR prose, the historical version remains recoverable from git history. This closeout record intentionally optimizes for current template compliance while preserving the accepted design outcomes.
<!-- /ANCHOR:adr-001 -->
