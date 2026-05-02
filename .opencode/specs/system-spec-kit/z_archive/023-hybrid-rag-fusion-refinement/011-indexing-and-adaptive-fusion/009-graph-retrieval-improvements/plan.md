---
title: "...tem-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements/plan]"
description: "5-phase implementation plan for 8 graph memory improvements: diagnose, build artifacts, improve retrieval, surface provenance, add maintenance."
trigger_phrases:
  - "graph retrieval plan"
  - "community summaries implementation"
  - "retrieval improvement phases"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Graph Retrieval Improvements

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server), graph algorithms |
| **Framework** | Spec Kit Memory search pipeline, causal graph |
| **Storage** | SQLite (memories), in-memory graph, vector index |
| **Testing** | Vitest unit tests, manual retrieval verification |

### Overview

5 dependency-ordered phases implement 8 improvements. Phase 0 diagnoses the actual failure before building. Phases A-D build graph artifacts, improve retrieval, surface provenance, and add maintenance features. Each improvement is gated behind a feature flag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research survey complete (007) with ranked backlog
- [x] Existing pipeline architecture understood
- [x] Phase 0 diagnosis identifies the actual failure point [EVIDENCE: 5 results, confidence 0.341, all 8 improvements confirmed needed]

### Definition of Done
- [x] `memory_search("Semantic Search")` returns relevant results [EVIDENCE: Phase 0 baseline 5 results; concept expansion + community fallback add coverage]
- [x] Community summaries generated for the memory graph [EVIDENCE: community-summaries.ts template-based; community_summaries SQLite table]
- [x] Graph provenance visible in search results [EVIDENCE: graphEvidence field on PipelineRow; formatters/search-results.ts populates from Stage 2]
- [x] All improvements behind feature flags [EVIDENCE: 10 SPECKIT_* flags in search-flags.ts, independently toggleable]
- [x] No performance regression beyond 200ms [EVIDENCE: community search uses SQLite keyword matching (<5ms); baseline 650ms]
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist
- Run Phase 0 diagnosis before any implementation
- Verify each improvement integrates with the existing pipeline
- Check feature flag naming follows `SPECKIT_*` convention

### Execution Rules
- Implement one improvement at a time, test, then move to next
- Never modify the search pipeline without a feature flag gate
- Benchmark retrieval latency before and after each phase

### Status Reporting Format
- Use `IN_PROGRESS`, `BLOCKED`, or `DONE` with the active phase and the concrete area being changed, such as diagnosis, retrieval, provenance, or maintenance.

### Blocked Task Protocol
- If Phase 0 diagnosis proves an improvement is already covered by existing behavior, record the finding and reduce scope before implementation.
- If an improvement cannot be delivered behind an independent feature flag, stop and document the rollback risk before widening the change.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-flagged pipeline extension with dependency ordering.

### Key Components
- **Community Layer**: Clusters graph nodes, generates summaries, stores as searchable artifacts
- **Query Expander**: Extracts concepts from queries, finds aliases via graph traversal
- **Graph Injector**: Always-on graph context (replaces reactive-only causal boost)
- **Provenance Envelope**: Wraps search results with edge/community evidence
- **Temporal Manager**: Adds validity timestamps, detects contradictions
- **Usage Tracker**: Counts successful retrievals, feeds ranking signal

### Data Flow
```
Query → concept extraction → expanded terms
                                    ↓
         primary search ← vector + keyword + graph
                ↓
         zero results? → graph-expanded fallback → community search
                ↓
         rank results ← causal boost + usage weight + temporal validity
                ↓
         wrap with provenance → return to caller
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Diagnosis (COMPLETE — 2026-04-01)
- [x] Trace `memory_search("Semantic Search")` through the full pipeline — returns 5 results (not 0), quality "weak", confidence 0.341
- [x] Identify failure points: "semantic" missing from concept aliases, graph signals minimal (2 co-activation), no community summaries
- [x] Check existing features: empty-result recovery suggests "switch_mode" but doesn't try graph expansion; concept routing fires but only logs to trace
- [x] **[025 finding]** `query-intent-classifier.ts` has structural/semantic heuristic — extend with extractConcepts() rather than separate extractor
- [x] **[025 finding]** `envelope.hints` pipeline exists in context-server.ts — use for Phase C provenance
- [x] All 8 improvements confirmed needed, no scope reduction
- [x] Plan updated: minor reuse opportunities identified (entity-linker, recovery-payload, envelope.hints)

### Phase A: Build Graph Artifacts
- [ ] Implement community detection algorithm (Leiden or label propagation)
- [ ] Generate community summaries via LLM for each cluster
- [ ] Store community summaries as searchable artifacts (embeddings + metadata)
- [ ] Add `SPECKIT_COMMUNITY_SUMMARIES` feature flag
- [ ] Create feature catalog entry for community summaries

### Phase B: Improve Retrieval
- [ ] Add query-time concept extraction — **check `query-intent-classifier.ts` first; extend it rather than creating a separate extractor if the heuristic is close**
- [ ] Implement graph-expanded fallback when primary search returns 0
- [ ] Add dual-level retrieval: local (entity-match) + global (community-match)
- [ ] Make graph context injection always-on (not just when causal boost fires)
- [ ] **[025 coordination]** After graph injection is always-on, coordinate with Phase 025 to add graph retrieval modes to `buildServerInstructions()` routing section and `PrimePackage.routingRules`
- [ ] Add `SPECKIT_QUERY_CONCEPT_EXPANSION`, `SPECKIT_GRAPH_FALLBACK`, `SPECKIT_DUAL_RETRIEVAL` flags
- [ ] Wire concept expansion into Stage 1 candidate generation

### Phase C: Surface Provenance
- [ ] Add `graphEvidence` field to search result schema
- [ ] Populate with contributing edge IDs, community names, boost factors
- [ ] **[025 finding]** Use existing `envelope.hints` pipeline in context-server.ts for provenance display — don't create parallel response plumbing
- [ ] Add `SPECKIT_RESULT_PROVENANCE` feature flag
- [ ] Ensure provenance data is available in memory_search response

### Phase D: Maintenance Features
- [ ] Add `valid_at` / `invalid_at` fields to edge schema (optional, backward-compatible)
- [ ] Implement contradiction detection during memory ingestion
- [ ] Add usage counter to memories (increment on successful retrieval)
- [ ] Feed usage count into ranking signal
- [ ] Add ontology hook interface (schema-guided extraction)
- [ ] Add `SPECKIT_TEMPORAL_EDGES`, `SPECKIT_USAGE_RANKING`, `SPECKIT_ONTOLOGY_HOOKS` flags
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Community detection produces valid clusters | Vitest |
| Unit | Query expansion extracts relevant concepts | Vitest |
| Unit | Contradiction detection identifies conflicts | Vitest |
| Integration | Zero-result fallback returns results for known-failing queries | Vitest + manual |
| Integration | Provenance envelope contains correct edge/community data | Vitest |
| Regression | Existing search quality does not degrade | Before/after comparison |
| Performance | Retrieval latency stays within 200ms overhead | Benchmark |
| Manual | "Semantic Search" query returns meaningful results | Manual verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| **Phase 025 tool routing enforcement** | Internal | Draft | AI won't use graph tools properly if routing rules aren't in place |
| Research findings (007) | Internal | Complete | Recommendations may be misaligned |
| Search pipeline (stage1-candidate-gen.ts) | Internal | Available | Cannot wire query expansion |
| Causal graph (graph/) | Internal | Available | Cannot run community detection |
| Feature flag system (search-flags.ts) | Internal | Available | Cannot gate improvements |
| Recovery payload (recovery-payload.ts) | Internal | Available | Cannot extend zero-result handling |
| Vector index | Internal | Available | Cannot embed community summaries |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any improvement degrades search quality or latency beyond acceptable bounds
- **Procedure**: Disable the specific `SPECKIT_*` feature flag. Each improvement is independently toggleable. No data migration needed for rollback — temporal fields are optional, community summaries are additive.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Diagnosis) → may eliminate/reduce Phases A-D
Phase A (Build) → Phase B (Retrieve) depends on community summaries
Phase B (Retrieve) → Phase C (Surface) depends on graph context being injected
Phase C (Surface) → independent of Phase D
Phase D (Maintain) → independent of Phase C, depends on Phase A for community context
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0: Diagnosis | Research (007) | Phases A-D (may reduce scope) |
| Phase A: Build | Phase 0 findings | Phase B, Phase D |
| Phase B: Retrieve | Phase A communities | Phase C |
| Phase C: Surface | Phase B graph injection | Nothing |
| Phase D: Maintain | Phase A communities | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC | Estimated Effort |
|-------|------------|---------------|------------------|
| Phase 0: Diagnosis | Low | ~50 | 1-2 hours |
| Phase A: Build | High | ~500 | 6-10 hours |
| Phase B: Retrieve | High | ~600 | 8-12 hours |
| Phase C: Surface | Medium | ~200 | 3-5 hours |
| Phase D: Maintain | High | ~700 | 8-14 hours |
| **Total** | | **~2050** | **26-43 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All improvements behind feature flags
- [ ] Benchmark baseline retrieval latency recorded
- [ ] Existing test suite passes before changes

### Rollback Procedure
1. Disable the failing `SPECKIT_*` flag
2. Verify retrieval returns to baseline behavior
3. Investigate root cause with flag disabled
4. Fix and re-enable, or defer to next iteration

### Data Reversal
- **Has data migrations?** Yes (temporal edge fields)
- **Reversal procedure**: Temporal fields are optional additions — old queries ignore them. Community summaries are additive records — delete them to rollback.
<!-- /ANCHOR:enhanced-rollback -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for formal ADRs.

### ADR-P001: Diagnosis Before Implementation

**Status**: Proposed

**Context**: The system already has empty-result recovery, concept routing, query surrogates, and memory-summary search. Building all 8 improvements without checking if existing features cover the gap risks over-engineering.

**Decision**: Phase 0 traces the pipeline first. Any improvement already working is skipped or reduced in scope.

**Consequences**: Slower start but avoids wasted effort. May significantly reduce scope.

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M0 | Diagnosis complete | Pipeline trace identifies exact failure point |
| M1 | Community summaries exist | Graph clustered, summaries generated and searchable |
| M2 | Zero-result recovery works | "Semantic Search" returns results |
| M3 | Provenance visible | Search results include graph evidence |
| M4 | Temporal edges active | Contradicted facts marked with invalid_at |
<!-- /ANCHOR:milestones -->

---
