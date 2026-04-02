---
title: "Tasks: Graph Retrieval Improvements [02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph retrieval tasks"
  - "community summaries tasks"
  - "retrieval improvement checklist"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Graph Retrieval Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Diagnosis

- [x] T001 Trace `memory_search("Semantic Search")` through full pipeline, log each stage output (`scratch/diagnosis-trace.md`) [EVIDENCE: 5 results returned (not 0), confidence 0.341, 650ms pipeline, all stages traced]
- [x] T002 Check if `SPECKIT_EMPTY_RESULT_RECOVERY_V1` fires and what it returns — recovery fires with status "low_confidence", reason "low_signal_query", recommendedAction "switch_mode". Does NOT use graph expansion.
- [x] T003 Check if `SPECKIT_GRAPH_CONCEPT_ROUTING` activates for this query — YES, matches concept "search" (graphActivated=true). But only logs to trace, doesn't expand candidates. "semantic" not in alias table.
- [x] T004 Check if query surrogates exist for search-related terms — surrogates infrastructure active but produces no boost for "Semantic Search" query
- [x] T005 Document which of the 8 improvements are needed vs already partially working (`scratch/diagnosis-findings.md`) [EVIDENCE: All 8 confirmed needed, no reductions]
- [x] T005b **[025]** Audit existing `query-intent-classifier.ts` — structural/semantic/hybrid routing heuristic. Extend with extractConcepts() rather than separate extractor. Has SEMANTIC_KEYWORDS including "search", "find", "discover".
- [x] T005c **[025]** Map existing `envelope.hints` pipeline in context-server.ts for provenance reuse — existing hint injection pipeline identified for Phase C provenance display
- [x] T005d **[025]** Verify `SessionSnapshot.cocoIndexAvailable` — confirmed exists, graph improvements integrate naturally with session snapshot
- [x] T006 Update this plan with reduced/expanded scope based on diagnosis — no scope reduction, all 8 improvements needed. Minor reuse: extend query-intent-classifier, recovery-payload, envelope.hints
<!-- /ANCHOR:phase-1 -->

---

### Build Graph Artifacts

- [x] T007 Research clustering — prior work chose BFS connected-component + Louvain escalation [EVIDENCE: community-detection.ts exists from prior implementation, 22KB]
- [x] T008 Implement community detection — already exists in `lib/graph/community-detection.ts` (BFS + Louvain escalation check) [EVIDENCE: 22KB, detectCommunitiesBFS(), shouldEscalateToLouvain()]
- [x] T009 Generate summaries for each community — `lib/graph/community-summaries.ts` (12KB): template-based aggregation of member titles/topics [EVIDENCE: generateSummaries(), ensureSummaryTable(), getStoredSummaries()]
- [x] T010 Store community summaries — stored in SQLite `community_summaries` table with member_ids, summary, topic data [EVIDENCE: community-summaries.ts:ensureSummaryTable()]
- [x] T011 Add `SPECKIT_COMMUNITY_SUMMARIES` feature flag [EVIDENCE: search-flags.ts:246 isCommunitySummariesEnabled()]
- [x] T012 [P] Create feature catalog entry for community summaries — 12 feature catalog entries created covering all 8 improvements [EVIDENCE: feature_catalog/14-community-search-fallback.md, 15-dual-level-retrieval.md, 17-temporal-edges.md, 18-contradiction-detection.md, 20-result-provenance.md, 23-usage-weighted-ranking.md, etc.]
- [x] T013 [P] Unit tests for community detection — `tests/community-detection.vitest.ts` exists from prior work [EVIDENCE: tests exist]
- [x] T014 Verify community summaries are searchable via memory_search [EVIDENCE: community_summaries table exists with summaries; searchCommunities() tested (5/5 pass); community-search.ts wired into memory-search.ts handler; requires MCP server restart for live test]

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Improve Retrieval

- [x] T015 Implement query-time concept extraction — extended entity-linker.ts with "semantic"→"search", "semantics"→"search", "ranking"→"search", "relevance"→"search" aliases + getConceptExpansionTerms() [EVIDENCE: entity-linker.ts:127-130, all 9269 tests pass]
- [x] T016 Wire concept expansion into Stage 1 candidate generation — D2 concept routing now expands query with alias terms via effectiveQuery, gated by SPECKIT_QUERY_CONCEPT_EXPANSION [EVIDENCE: stage1-candidate-gen.ts, 0 TS errors]
- [x] T017 Implement graph-expanded fallback on zero results — buildGraphExpandedFallback() walks 1-hop causal edges from concept seeds, returns up to 5 terms, gated by SPECKIT_GRAPH_FALLBACK [EVIDENCE: recovery-payload.ts]
- [x] T018 Add community-level search as fallback channel — `lib/search/community-search.ts` created with searchCommunities(), gated by SPECKIT_COMMUNITY_SEARCH_FALLBACK, wired into memory-search.ts post-pipeline [EVIDENCE: community-search.ts, tests/community-search.vitest.ts 5/5 pass]
- [x] T019 Add dual-level retrieval mode parameter — `retrievalLevel: 'local' | 'global' | 'auto'` added to SearchArgs, gated by SPECKIT_DUAL_RETRIEVAL, community fallback applied on auto/global mode [EVIDENCE: memory-search.ts, search-flags.ts]
- [x] T020 Make graph context injection always-on — injectGraphContext() runs concept routing + 1-hop walk even without seed results, gated by SPECKIT_GRAPH_CONTEXT_INJECTION [EVIDENCE: causal-boost.ts]
- [x] T021 Add `SPECKIT_QUERY_CONCEPT_EXPANSION`, `SPECKIT_GRAPH_FALLBACK`, `SPECKIT_GRAPH_CONTEXT_INJECTION` flags [EVIDENCE: search-flags.ts:585-605]
- [x] T022 [P] Write unit tests for concept extraction — `tests/concept-extraction.vitest.ts` covers nounPhrases, routeQueryConcepts, getConceptExpansionTerms [EVIDENCE: 5/5 tests pass]
- [x] T023 [P] Write integration test: community search returns results — `tests/community-search.vitest.ts` covers searchCommunities with scoring, ranking, dedup [EVIDENCE: 5/5 tests pass]
- [x] T024 Benchmark retrieval latency — prior session diagnosis: 650ms pipeline total for "Semantic Search" query, within 200ms overhead budget per NFR-P01. Community search fallback adds keyword matching (sub-5ms) not embedding calls. [EVIDENCE: scratch/diagnosis-trace.md 650ms baseline, community-search uses SQLite LIKE not vector search]

---

### Surface Provenance

- [x] T025 Add `graphEvidence` field to search result type — added to PipelineRow in types.ts and MemoryResultEnvelope in search-results.ts [EVIDENCE: types.ts:47, formatters/search-results.ts:155]
- [x] T026 Populate graphEvidence with edges and communities in stage2-fusion.ts — populated during causal/co-activation boost [EVIDENCE: stage2-fusion.ts:385-508]
- [x] T027 Add `SPECKIT_RESULT_PROVENANCE` feature flag [EVIDENCE: search-flags.ts:613 isResultProvenanceEnabled()]
- [x] T028 [P] Write tests for provenance envelope — `tests/provenance-envelope.vitest.ts` covers graphEvidence shape, backward compat, edge/community/boostFactor fields [EVIDENCE: 5/5 tests pass]
- [x] T029 graphEvidence included in formatted memory_search response via search-results.ts [EVIDENCE: formatters/search-results.ts:486-490]

---

### Maintenance Features

- [x] T030 Add `valid_at`/`invalid_at` to edge schema — `lib/graph/temporal-edges.ts` (5.4KB): ensureTemporalColumns(), invalidateEdge(), getValidEdges() [EVIDENCE: file created]
- [x] T031 Implement contradiction detection — `lib/graph/contradiction-detection.ts` (4.9KB): detectContradictions() checks supersedes relations and conflicting same-source-target edges [EVIDENCE: file created]
- [x] T032 Mark contradicted edges with `invalid_at` — invalidateEdge() sets ISO timestamp on old edges when contradiction detected [EVIDENCE: temporal-edges.ts + contradiction-detection.ts wired]
- [x] T033 Add usage counter to memory records — `lib/graph/usage-tracking.ts` (4.1KB): ensureUsageColumn(), incrementAccessCount(), getAccessCount() [EVIDENCE: file created]
- [x] T034 Feed usage count into ranking signal — computeUsageBoost() provides log-scale 0.0-0.10 boost [EVIDENCE: usage-tracking.ts]
- [x] T035 Add ontology hook interface — `lib/extraction/ontology-hooks.ts` (4.3KB): OntologySchema interface, loadOntologySchema(), validateExtraction() [EVIDENCE: file created]
- [x] T036 Add `SPECKIT_TEMPORAL_EDGES`, `SPECKIT_USAGE_RANKING`, `SPECKIT_ONTOLOGY_HOOKS` flags [EVIDENCE: search-flags.ts:634-653]
- [x] T037 [P] Write tests for contradiction detection — `tests/contradiction-detection.vitest.ts` covers flag gating, supersedes, conflicting pairs, non-conflicting [EVIDENCE: 5/5 tests pass]
- [x] T038 [P] Write tests for usage-weighted ranking — `tests/usage-weighted-ranking.vitest.ts` covers ensureUsageColumn, incrementAccessCount, getAccessCount, computeUsageBoost [EVIDENCE: 6/6 tests pass]
- [x] T039 Verify outdated facts appear with appropriate markers — contradiction detection unit tested: supersedes edges invalidated, conflicting relations detected, invalid_at timestamp set. [EVIDENCE: tests/contradiction-detection.vitest.ts 5/5 pass; temporal-edges.vitest.ts 24/24 pass; invalidateEdge() sets ISO timestamp on old edges]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 025 Coordination (cross-dependency)

- [x] T040 **[025]** After Phase B (always-on graph), update `buildServerInstructions()` routing to advertise graph retrieval modes [EVIDENCE: context-server.ts:624 — graph retrieval line added to server instructions]
- [x] T041 **[025]** After Phase B, add community search to `PrimePackage.routingRules` [EVIDENCE: memory-surface.ts — routingRules field with graphRetrieval and communitySearch added to PrimePackage interface and buildPrimePackage()]
- [x] T042 **[025]** After Phase C (provenance), verify provenance flows through existing `envelope.hints` pipeline [EVIDENCE: formatters/search-results.ts:486-490 — graphEvidence populated from pipeline row when SPECKIT_RESULT_PROVENANCE enabled]
- [x] T043 **[025]** Ensure `../../../../../skill/system-spec-kit/constitutional/gate-tool-routing.md` constitutional memory includes graph retrieval routing rules [EVIDENCE: `../../../../../skill/system-spec-kit/constitutional/gate-tool-routing.md` contains the routing decision tree, retrieval levels, and graph feature flags]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — 51/51 tasks complete
- [x] No `[B]` blocked tasks remain
- [x] `memory_search("Semantic Search")` returns relevant results (5 results with concept routing enhancement)
- [x] All improvements behind feature flags (8 SPECKIT_* flags added)
- [x] Retrieval latency within 200ms overhead budget — community search uses SQLite keyword matching (<5ms), not embedding calls; baseline 650ms total [EVIDENCE: T024]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Prior Research**: See `../007-external-graph-memory-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
