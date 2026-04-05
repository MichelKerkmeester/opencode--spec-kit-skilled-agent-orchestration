---
title: "Feature Specification: Graph Retrieval Improvements [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements]"
description: "Implement 8 graph memory improvements derived from the 007 external research survey to fix retrieval gaps, add community summarization, and surface graph provenance."
trigger_phrases:
  - "graph retrieval improvements"
  - "community summaries"
  - "dual level retrieval"
  - "zero result fallback"
  - "graph provenance"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Graph Retrieval Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory graph has 3,854 causal edges at 79.92% coverage but is underutilized: `memory_search("Semantic Search")` returns 0 results, graph signals are invisible to users, and the graph fires only reactively via causal boost. Phase 007 surveyed 7 external graph memory systems and produced a 12-item ranked improvement backlog. This spec implements the top 8 improvements across 4 dependency-ordered phases.

**Key Decisions**: Diagnose first (trace existing pipeline before building), then Build graph artifacts, then improve Retrieval, then Surface provenance, then add Maintenance features.

**Critical Dependencies**: Existing search pipeline, causal graph, feature flag system, research findings from `../007-external-graph-memory-research/research/research.md`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-04-01 |
| **Branch** | `011-009-graph-retrieval-improvements` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 008-create-sh-phase-parent |
| **Successor** | None |
| **Prior Research** | `../007-external-graph-memory-research/research/research.md` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The graph is structurally healthy but does not meaningfully improve retrieval. Specific failures:
1. `memory_search("Semantic Search")` returns 0 results despite substantial search-related knowledge in the graph
2. No community/topic-level search — only individual memory matching
3. No graph-expanded fallback when primary search fails
4. Graph context is injected only when causal boost fires, not proactively
5. Users cannot see which memories/edges contributed to a result
6. Old facts are never invalidated when contradicted
7. Frequently useful memories get no ranking advantage
8. No domain ontology guides graph construction

### Purpose

Implement 8 improvements that turn the existing graph from a passive structure into an active retrieval channel with user-visible provenance, automatic context injection, and self-maintaining temporal accuracy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| # | Improvement | Source Systems | Phase |
|---|-------------|----------------|-------|
| 0 | **Diagnosis gate**: trace why "Semantic Search" returns 0 before building | Internal | Phase 0 |
| 1 | **Community detection + summaries**: cluster the graph and generate topic summaries | GraphRAG, Graphiti | Phase A |
| 2 | **Dual-level retrieval**: add local (entity) + global (thematic) search modes | GraphRAG, LightRAG | Phase B |
| 3 | **Query expansion + zero-result fallback**: extract concepts from query, expand via graph, retry on empty | Memoripy, LightRAG | Phase B |
| 4 | **Automatic graph context injection**: always include graph signals, not just when causal boost fires | Zep, Mem0 | Phase B |
| 5 | **Provenance-bearing answers**: cite edge IDs, memory paths, community IDs in results | GraphRAG, Graphiti | Phase C |
| 6 | **Temporal edges + contradiction detection**: bi-temporal validity model, invalidate outdated facts | Graphiti, Zep | Phase D |
| 7 | **Usage-weighted ranking**: boost memories that are frequently retrieved successfully | Memoripy | Phase D |
| 8 | **Ontology hooks**: let domain schemas guide graph extraction | Cognee | Phase D |

### Out of Scope

- Graph visualization UI (separate concern)
- Changing the existing causal edge schema (extend, don't replace)
- External graph database migration (stay on current storage)
- Real-time streaming ingestion

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/graph/` | Modify/Create | Community detection, temporal edges, ontology hooks |
| `mcp_server/lib/search/pipeline/` | Modify | Dual-level retrieval, query expansion, fallback |
| `mcp_server/handlers/memory-search.ts` | Modify | Graph context injection, provenance in results |
| `mcp_server/lib/search/causal-boost.ts` | Modify | Always-on graph signals |
| `mcp_server/lib/extraction/` | Modify | Ontology-guided extraction |
| `mcp_server/lib/search/recovery-payload.ts` | Modify | Zero-result graph fallback |
| Feature catalog entries | Create | New feature flag docs for each improvement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Diagnose the "Semantic Search" zero-result failure | Retrieval trace shows exactly where and why the query fails in the current pipeline |
| REQ-002 | Community detection clusters the memory graph | At least 5 communities detected from 3,854 edges with generated summaries |
| REQ-003 | Zero-result fallback uses graph expansion | `memory_search("Semantic Search")` returns relevant results via graph-expanded retry |
| REQ-004 | Query expansion extracts concepts from queries | Query "Semantic Search" expands to related terms (vector search, embedding, ranking) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Dual-level retrieval supports local + global modes | API accepts `mode: "local" | "global" | "auto"` parameter |
| REQ-006 | Graph context injected automatically | Graph signals appear in results even when causal boost doesn't fire |
| REQ-007 | Provenance visible in search results | Each result includes `graphEvidence: { edges: [...], communities: [...] }` |
| REQ-008 | Temporal edges with validity timestamps | Edges have `valid_at` / `invalid_at` fields |
| REQ-009 | Contradiction detection invalidates old edges | When a new fact contradicts an old one, old edge gets `invalid_at` set |
| REQ-010 | Usage-weighted ranking signal | Memories retrieved N+ times get a ranking boost proportional to access count |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Ontology hooks for domain-specific extraction | Custom schema can be provided that guides entity/relation extraction |
| REQ-012 | Community summaries searchable via vector similarity | Community summary embeddings in the vector index |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_search("Semantic Search")` returns at least 3 relevant results
- **SC-002**: Community detection produces meaningful clusters with human-readable summaries
- **SC-003**: Zero-result queries trigger graph-expanded fallback automatically
- **SC-004**: Search results include graph provenance metadata
- **SC-005**: Contradicted facts are marked with `invalid_at` timestamps
- **SC-006**: All improvements gated behind feature flags for safe rollout
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

- **Given** a query like `memory_search("Semantic Search")` starts with weak primary recall, **When** concept expansion and graph fallback are enabled, **Then** the query returns relevant graph-assisted results.
- **Given** the graph contains stable communities, **When** community summaries are generated, **Then** topic-level retrieval can surface a useful summary even when direct memory matches are weak.
- **Given** a structural retrieval result is returned, **When** provenance is enabled, **Then** the envelope includes graph evidence with edges or communities that explain the result.
- **Given** an older edge is contradicted by newer information, **When** contradiction detection runs, **Then** the stale edge receives an `invalid_at` timestamp.
- **Given** a memory is retrieved successfully multiple times, **When** usage-weighted ranking is enabled, **Then** that memory gains a bounded ranking boost.
- **Given** a rollout issue appears in any improvement, **When** the corresponding `SPECKIT_*` feature flag is disabled, **Then** retrieval falls back to the prior behavior without breaking the rest of the pipeline.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing search pipeline architecture | All retrieval changes must integrate cleanly | Build behind feature flags, test in shadow mode first |
| Dependency | Research findings from 007 | Recommendations may need adjustment after diagnosis | Phase 0 diagnosis gate validates assumptions before building |
| Risk | Community detection on small graph (3,854 edges) | May produce trivial or too-broad clusters | Tune clustering parameters; require minimum cluster size |
| Risk | Performance impact of always-on graph injection | Could slow retrieval | Benchmark before/after; use caching for community summaries |
| Risk | Temporal edge migration | Adding fields to existing edges requires careful migration | Add fields as optional; backfill incrementally |
| Risk | Over-building before diagnosis | Existing features may already cover some gaps | Phase 0 traces pipeline first; skip improvements already working |
| Dependency | **Phase 025 tool routing enforcement** | If AI doesn't use Code Graph tools, always-on graph injection is wasted | Coordinate with 025: server instructions must route structural queries to Code Graph |
| Risk | Duplicate query classifier | `lib/code-graph/query-intent-classifier.ts` already has structural-vs-semantic heuristic | Phase 0 must audit existing classifier before building new `query-concept-extractor.ts` |
| Dependency | Envelope.hints pipeline | Provenance must use existing `envelope.hints` in context-server.ts, not new plumbing | Phase C should extend existing hint injection, not create parallel path |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Graph-expanded fallback adds no more than 200ms to retrieval latency
- **NFR-P02**: Community summary generation completes within 30 seconds for the current graph size

### Reliability
- **NFR-R01**: All improvements gated behind `SPECKIT_*` feature flags
- **NFR-R02**: Fallback to current behavior if any improvement errors at runtime

### Maintainability
- **NFR-M01**: Each improvement is independently toggleable
- **NFR-M02**: Community summaries regenerate automatically when graph changes significantly

---

## 8. EDGE CASES

### Query Boundaries
- Query matches zero memories AND zero community summaries → return honest "no results" with suggestion
- Query matches community summary but no individual memories → return community-level answer with caveat
- Multiple communities match equally → return top-N by relevance, not arbitrary selection

### Temporal Boundaries
- Edge contradicted by newer edge from a different session → invalidate with cross-session provenance
- Edge with `invalid_at` is the only match for a query → return with "[outdated]" marker, not silently
- Bulk import of historical data → skip contradiction detection (use `bulk_mode` flag)

### Graph Structure
- Graph has disconnected components → community detection handles each component independently
- Single-node communities → merge into nearest neighbor or mark as unclustered
- Circular causal chains → community detection tolerates cycles

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 8 improvements, ~15 files, ~2000 LOC estimated |
| Risk | 18/25 | Search pipeline integration, performance, migration |
| Research | 5/20 | Research already done in 007; diagnosis needed in Phase 0 |
| Multi-Agent | 10/15 | Phases A-D can partially parallelize |
| Coordination | 12/15 | Feature flag coordination, pipeline integration order |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Diagnosis shows existing features already handle zero-result | L | M | Good outcome — skip unnecessary work |
| R-002 | Community detection produces meaningless clusters | H | M | Tune parameters; require min cluster coherence score |
| R-003 | Always-on graph injection degrades latency | H | M | Benchmark; use lazy loading and caching |
| R-004 | Temporal migration breaks existing edge queries | H | L | Optional fields; backward-compatible schema |
| R-005 | Ontology hooks add too much complexity for current needs | M | M | Keep as P2; implement only if clear demand |

---

## 11. USER STORIES

### US-001: Zero-result recovery (Priority: P0)

**As a** developer querying Spec Kit Memory, **I want** graph-expanded fallback when my search returns 0 results, **so that** I get relevant memories even when my exact wording doesn't match.

**Acceptance Criteria**:
1. Given `memory_search("Semantic Search")` currently returns 0, When the improvement is active, Then it returns at least 3 relevant results via concept expansion + community fallback.

### US-002: See why a result was returned (Priority: P1)

**As a** developer reviewing search results, **I want** to see which graph edges and communities contributed to each result, **so that** I can trust the ranking and debug unexpected results.

**Acceptance Criteria**:
1. Given a search result, When I inspect `graphEvidence`, Then I see edge IDs, community names, and boost factors.

### US-003: Outdated facts are marked (Priority: P1)

**As a** developer relying on stored knowledge, **I want** contradicted facts to be marked as outdated, **so that** I don't act on stale information.

**Acceptance Criteria**:
1. Given a memory contradicted by newer information, When I search, Then the old memory appears with an `[outdated]` marker or is ranked below the newer fact.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should community summaries be stored as regular memories (searchable alongside normal results) or as a separate index?
  - **ADR-003 resolved**: Separate artifact type with own embeddings
- What clustering algorithm is best for a typed causal graph — Leiden (like GraphRAG), label propagation, or spectral clustering?
- Should Phase 0 diagnosis be a separate spec child or inline in this spec?
- **[From Phase 025]** Should `buildServerInstructions()` routing section advertise graph retrieval capabilities (community search, dual-level mode) once implemented?
- **[From Phase 025]** Should the existing `query-intent-classifier.ts` be extended for concept extraction or replaced by a new `query-concept-extractor.ts`?
- **[From Phase 025]** Should `PrimePackage.routingRules` include graph retrieval modes (e.g., "If broad topic question → try community search")?

---

## RELATED DOCUMENTS

- **Prior Research**: See `../007-external-graph-memory-research/research/research.md`
- **Cross-Dependency**: See `../../../024-compact-code-graph/025-tool-routing-enforcement/spec.md` — tool routing enforcement must coordinate with graph improvements
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Phase**: See `../spec.md`

<!-- /ANCHOR:questions -->
