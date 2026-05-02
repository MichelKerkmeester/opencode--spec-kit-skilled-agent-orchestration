---
title: "...023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/decision-record]"
description: "Record the research framing choices that turn external graph survey work into implementable follow-on improvements."
trigger_phrases:
  - "phase 007 adr"
  - "graph research decision"
  - "external graph comparison decision"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["decision-record.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: External Graph Memory Research
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Compare Seven External Systems Against a Fixed Internal Baseline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-01 |
| **Deciders** | Current documentation session for Phase 007 |

---

<!-- ANCHOR:adr-001-context -->
### Context

We already know the internal graph is structurally healthy but not clearly helping retrieval enough. The graph has 3,854 edges, 79.92% coverage, 6 orphaned edges, average strength 0.76, and is dominated by `supports` and `caused` relations. We also have a concrete signal that retrieval discoverability is weak because `memory_search` for "Semantic Search" returned 0 results. If the research stays loose, it will produce interesting notes but weak implementation guidance.

### Constraints

- The phase is research-only. No code changes are allowed.
- The output must stay useful for later implementation planning.
- The seven named systems are already fixed by scope: Zep, Mem0, GraphRAG, LightRAG, Memoripy, Cognee, and Graphiti.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Compare all seven external systems against one fixed internal baseline and one shared rubric.

**How it works**: The research will evaluate each system on retrieval effectiveness, UX transparency, automatic graph use, and operational fit. Findings will then be converted into a ranked recommendation backlog instead of remaining as free-form notes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fixed baseline + shared rubric** | Comparable output, easier prioritization, cleaner handoff | Requires discipline and may drop side observations | 9/10 |
| Free-form survey notes | Fast to write and flexible | Hard to compare systems, weaker backlog quality | 4/10 |
| Jump straight to implementation ideas | Fastest path to action | Skips evidence gathering and risks solving the wrong problem | 3/10 |

**Why this one**: The phase exists to reduce uncertainty, not just to collect anecdotes. A fixed baseline and rubric keep the research pointed at the real graph gaps we already see.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Later phases get comparable findings instead of scattered notes.
- The research stays tied to current graph weaknesses, especially retrieval transparency and automatic use.

**What it costs**:
- The rubric limits how much space is available for side observations. Mitigation: capture notable extras in a short notes column instead of expanding scope.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A system does not fit the rubric neatly | M | Record the mismatch explicitly and note why |
| Public documentation is thin or marketing-heavy | M | Lower confidence, cite source quality, and avoid strong claims |
| Recommendations drift into implementation detail too early | H | Keep changes in backlog form only and defer code design |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The graph is healthy on paper but still weak on retrieval visibility and search hit quality |
| 2 | **Beyond Local Maxima?** | PASS | The survey forces comparison with outside systems before we optimize our current design |
| 3 | **Sufficient?** | PASS | A fixed rubric is simpler than a multi-method research process and still answers the core questions |
| 4 | **Fits Goal?** | PASS | The phase goal is ranked improvements, not free-form research storytelling |
| 5 | **Open Horizons?** | PASS | Findings can feed multiple later phases without locking code early |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `research/research.md` will use one repeated comparison structure for each external system
- The recommendation backlog will be ranked and tied to later implementation follow-up

**How to roll back**: Remove unsupported findings, keep only cited facts, and rerun the ranking from the cleaned survey notes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Prioritize Community Summarization and Query Expansion Over Temporal Edges

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-01 |
| **Deciders** | Research synthesis from 7-system survey |

---

### Context

The research survey identified 12 improvement candidates. The most impactful divide into two categories: (A) retrieval-side improvements (community summaries, dual-level search, query expansion, zero-result fallback) and (B) construction-side improvements (temporal edges, contradiction detection, entity deduplication, ontology hooks). The core retrieval gap — `memory_search("Semantic Search") -> 0 results` — is a retrieval problem, not a construction problem.

### Decision

**We chose**: Implement retrieval-side improvements first (Rank 1-5, 11 from the backlog) before construction-side improvements (Rank 6, 8, 10).

**Rationale**: The graph already has 3,854 edges at 79.92% coverage. The problem is not graph scarcity but graph under-utilization for retrieval. Retrieval improvements directly address the known failure mode and provide user-visible benefit faster than construction changes.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Retrieval-first** | Directly fixes known failures, faster user impact, lower complexity | Defers temporal/contradiction features | 9/10 |
| Construction-first | More architecturally complete | Does not fix the retrieval gap, higher complexity, slower impact | 4/10 |
| Both in parallel | Maximal coverage | Scope too large, coordination overhead | 5/10 |

### Consequences

**What improves**: The known zero-result failure gets fixed sooner. Users see graph-enhanced results faster.

**What it costs**: Temporal edges and contradiction detection are deferred. Mitigation: document as Phase 009+ candidates.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The retrieval gap is the most user-visible problem |
| 2 | **Beyond Local Maxima?** | PASS | Draws from GraphRAG, LightRAG, and Memoripy rather than just tweaking causal boost |
| 3 | **Sufficient?** | PASS | 5 retrieval improvements address different failure modes |
| 4 | **Fits Goal?** | PASS | The research goal was actionable improvements, not architectural purity |
| 5 | **Open Horizons?** | PASS | Construction improvements remain valid for later phases |

**Checks Summary**: 5/5 PASS

---
