---
title: "...ybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/002-query-intelligence-reformulation/tasks]"
description: "A01 (facet detect) ──► A02 (decompose) ──► A03 (merge) ──► A04 (wire)"
trigger_phrases:
  - "ybrid"
  - "rag"
  - "fusion"
  - "001"
  - "hybrid"
  - "tasks"
  - "002"
  - "query"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Query Intelligence & Reformulation

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + phase-child-header | v2.2 -->

## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec** | `spec.md` |
| **Plan** | `plan.md` |
| **Phase** | 2 of 5 (D2) |
| **Status** | Draft |
| **Created** | 2026-03-21 |

---

## 2. TASK BREAKDOWN

### Phase A: Query Enhancement (REQ-D2-001, REQ-D2-002)

#### A.1 — Facet Detection Heuristic

- [ ] **T-D2-A01**: Implement `isMultiFacet(query)` heuristic in `query-decomposer.ts`
  - Detect conjunctions, enumeration patterns, multi-clause questions
  - Return boolean + confidence score
  - Handle edge cases: rhetorical "and", quoted phrases, negations
  - **Req:** REQ-D2-001 | **Est:** 1d

#### A.2 — Query Decomposition

- [ ] **T-D2-A02**: Implement `decompose(query)` in `query-decomposer.ts`
  - Extract up to 3 facets from multi-faceted questions
  - Heuristic-first approach (conjunction splitting, clause extraction)
  - LLM fallback for ambiguous decomposition (behind latency guard)
  - **Req:** REQ-D2-001 | **Est:** 1d

#### A.3 — Facet-Coverage Merge

- [ ] **T-D2-A03**: Implement `mergeByFacetCoverage(pools)` in `query-decomposer.ts`
  - Merge result pools from original + facet sub-queries
  - Score results by coverage across facets (not just single-facet relevance)
  - Deduplicate results appearing in multiple pools
  - **Req:** REQ-D2-001 | **Est:** 1d

#### A.4 — Decomposition Wiring

- [ ] **T-D2-A04**: Wire decomposition pipeline into `stage1-candidate-gen.ts`
  - Gate behind `SPECKIT_QUERY_DECOMPOSITION` flag
  - Only activate in deep mode
  - Preserve original query as primary, facets as supplementary
  - **Req:** REQ-D2-001 | **Est:** 0.5d

#### A.5 — Noun Phrase Extraction

- [ ] **T-D2-A05**: Implement `nounPhrases(query)` utility in `entity-linker.ts`
  - Extract candidate noun phrases from query text
  - Handle compound nouns, proper nouns, technical terms
  - Lightweight — no external NLP library dependency
  - **Req:** REQ-D2-002 | **Est:** 0.5d

#### A.6 — Concept Alias Table

- [ ] **T-D2-A06**: Build `conceptAliasTable` in `entity-linker.ts`
  - Bootstrap from existing concept index / graph node labels
  - Include common aliases, abbreviations, and synonyms
  - Support runtime updates (new concepts from graph lifecycle)
  - **Req:** REQ-D2-002 | **Est:** 1d

#### A.7 — Alias Matching and Graph Activation

- [ ] **T-D2-A07**: Implement `matchAliases()` and `route.enableGraph(concepts)` in `entity-linker.ts` / `stage1-candidate-gen.ts`
  - Match extracted noun phrases against concept alias table
  - Activate graph channel with matched concept IDs
  - Rule-based, <5ms latency budget
  - **Req:** REQ-D2-002 | **Est:** 0.5d

#### A.8 — Concept Routing Flag Wiring

- [ ] **T-D2-A08**: Wire concept routing behind `SPECKIT_GRAPH_CONCEPT_ROUTING` flag in `stage1-candidate-gen.ts`
  - Default off, available for all query modes (not just deep)
  - Log matched concepts for observability
  - **Req:** REQ-D2-002 | **Est:** 0.5d

#### A.9 — Phase A Tests

- [ ] **T-D2-A09**: Write tests for all Phase A functionality
  - Facet detection: true/false on known patterns, edge cases
  - Decomposition: correct facet extraction, max 3 cap
  - Facet-coverage merge: deduplication, coverage scoring
  - Noun phrase extraction: compound nouns, technical terms
  - Alias matching: exact match, partial match, no match
  - Latency: simple query path unchanged
  - **Req:** REQ-D2-001, REQ-D2-002 | **Est:** 1d

---

### Phase B: LLM Integration (REQ-D2-003, REQ-D2-004)

#### B.1 — Cheap Seed Retrieval

- [ ] **T-D2-B01**: Implement `cheapSeedRetrieve(query)` in `llm-reformulation.ts`
  - Fast, low-cost retrieval to get grounding context for LLM
  - Use keyword-only or lightweight vector search (no full hybrid pipeline)
  - Return top-3 seed results with titles and summaries
  - **Req:** REQ-D2-003 | **Est:** 1d

#### B.2 — LLM Reformulation

- [ ] **T-D2-B02**: Implement `llm.rewrite({q, seeds, mode})` in `llm-reformulation.ts`
  - Step-back abstraction: generate a more abstract version of the query
  - Corpus-grounded: use seed results to anchor reformulation in actual content
  - Output: `{ abstract: string, variants: string[] }`
  - Prompt engineering: prevent hallucination, stay grounded in seeds
  - **Req:** REQ-D2-003 | **Est:** 1.5d

#### B.3 — Reformulation Wiring

- [ ] **T-D2-B03**: Wire reformulation into `stage1-candidate-gen.ts` behind `SPECKIT_LLM_REFORMULATION`
  - Gate to deep-mode only
  - Fanout original + abstract + variants through hybrid pipeline
  - Merge results, deduplicate
  - **Req:** REQ-D2-003 | **Est:** 0.5d

#### B.4 — HyDE Pseudo-Document Generation

- [ ] **T-D2-B04**: Implement `llm.hyde(query, format)` in `hyde.ts`
  - Generate hypothetical document that would answer the query
  - Format-aware: generate in markdown-memory style matching the corpus
  - Length-bounded: max 200 tokens to control embedding quality
  - **Req:** REQ-D2-004 | **Est:** 1d

#### B.5 — Low-Confidence Detection and Shadow Mode

- [ ] **T-D2-B05**: Implement `lowConfidence(baseline)` and shadow mode infrastructure in `hyde.ts`
  - Detect when baseline retrieval results have low confidence scores
  - Shadow mode: run HyDE in parallel but only log results, do not merge
  - Conditional promotion: merge into production results when shadow evaluation passes
  - **Req:** REQ-D2-004 | **Est:** 1d

#### B.6 — HyDE Wiring

- [ ] **T-D2-B06**: Wire HyDE into `stage1-candidate-gen.ts` behind `SPECKIT_HYDE`
  - Gate to deep + low-confidence queries only
  - Embed pseudo-document, run vector-only search
  - Merge HyDE results with baseline
  - **Req:** REQ-D2-004 | **Est:** 0.5d

#### B.7 — LLM Result Caching

- [ ] **T-D2-B07**: Implement shared LLM result cache for reformulation and HyDE
  - Cache key: normalized query + mode
  - TTL-based expiration (configurable, default 1 hour)
  - Shared across reformulation and HyDE to prevent duplicate LLM calls
  - Track cache hit rate for observability
  - **Req:** REQ-D2-003, REQ-D2-004 | **Est:** 1d

#### B.8 — Phase B Tests

- [ ] **T-D2-B08**: Write tests for all Phase B functionality
  - Seed retrieval: returns grounding results, respects cost budget
  - Reformulation: grounded output, no hallucination, correct structure
  - HyDE: format-aware generation, length bounds
  - Low-confidence detection: threshold calibration
  - Shadow mode: logging without merging
  - Caching: hit/miss, TTL expiration, shared cache
  - LLM call budget: ≤ 2 calls per deep query
  - **Req:** REQ-D2-003, REQ-D2-004 | **Est:** 1.5d

---

### Phase C: Index-Time Surrogates (REQ-D2-005)

#### C.1 — Surrogate Schema Design

- [ ] **T-D2-C01**: Design and document the surrogate metadata schema
  - Fields: `aliases`, `headings`, `summary`, `surrogateQuestions`
  - Align with existing index metadata structure
  - Define generation rules per field
  - **Req:** REQ-D2-005 | **Est:** 0.5d

#### C.2 — Surrogate Generation at Index Time

- [ ] **T-D2-C02**: Implement surrogate generation in the index pipeline
  - Extract aliases from document content (abbreviations, synonyms)
  - Extract headings as structural surrogates
  - Generate summary (LLM at index time, cached)
  - Generate 2–5 likely user questions per memory (LLM at index time)
  - **Req:** REQ-D2-005 | **Est:** 1.5d

#### C.3 — Surrogate Storage

- [ ] **T-D2-C03**: Store surrogates alongside vector embeddings in `vector-index-store.ts`
  - Extend existing storage schema with surrogate fields
  - Ensure backward compatibility (surrogates optional)
  - Indexable for fast query-time lookup
  - **Req:** REQ-D2-005 | **Est:** 1d

#### C.4 — Query-Time Surrogate Matching

- [ ] **T-D2-C04**: Implement `matchedSurrogates(query)` for query-time boosting in `vector-index-store.ts`
  - Match query against stored surrogate questions and aliases
  - Boost matching documents in retrieval scoring
  - No runtime LLM calls — all matching is precomputed
  - **Req:** REQ-D2-005 | **Est:** 1d

#### C.5 — Surrogate Flag Wiring

- [ ] **T-D2-C05**: Wire surrogates behind `SPECKIT_QUERY_SURROGATES` flag
  - Index-time: generate surrogates only when flag is on
  - Query-time: match surrogates only when flag is on
  - Graceful degradation: missing surrogates = no boost (no errors)
  - **Req:** REQ-D2-005 | **Est:** 0.5d

#### C.6 — Phase C Tests

- [ ] **T-D2-C06**: Write tests for all Phase C functionality
  - Surrogate generation: correct fields, reasonable questions
  - Storage: backward compatibility, schema extension
  - Query-time matching: boost accuracy, no false positives
  - Flag gating: on/off behavior for both index and query paths
  - Recall impact: measure improvement on test corpus
  - **Req:** REQ-D2-005 | **Est:** 1d

---

## 3. TASK SUMMARY

| Phase | Tasks | Requirements | Est. Total |
|-------|-------|-------------|------------|
| **A** | T-D2-A01 through T-D2-A09 (9 tasks) | REQ-D2-001, REQ-D2-002 | 7d |
| **B** | T-D2-B01 through T-D2-B08 (8 tasks) | REQ-D2-003, REQ-D2-004 | 8d |
| **C** | T-D2-C01 through T-D2-C06 (6 tasks) | REQ-D2-005 | 5.5d |
| | **23 tasks total** | **5 requirements** | **20.5d** |

---

## 4. TASK DEPENDENCIES

```
A01 (facet detect) ──► A02 (decompose) ──► A03 (merge) ──► A04 (wire)
A05 (noun phrases) ──► A06 (alias table) ──► A07 (matching) ──► A08 (wire)
A01–A08 ──► A09 (Phase A tests)

A04 (decomposition available) ──► B01 (seed retrieval)
B01 ──► B02 (reformulation) ──► B03 (wire)
B02 ──► B04 (HyDE gen) ──► B05 (shadow mode) ──► B06 (wire)
B02 + B04 ──► B07 (caching)
B01–B07 ──► B08 (Phase B tests)

A06 (alias table reuse) ──► C01 (schema)
C01 ──► C02 (generation) ──► C03 (storage) ──► C04 (matching) ──► C05 (wire)
C01–C05 ──► C06 (Phase C tests)
```

<!--
TASKS — D2: Query Intelligence & Reformulation
- 23 tasks across 3 phases
- Phase A: 9 tasks (heuristic query enhancement)
- Phase B: 8 tasks (LLM-powered reformulation + HyDE)
- Phase C: 6 tasks (index-time surrogates)
-->

<!-- ANCHOR:notation -->
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
<!-- /ANCHOR:cross-refs -->
