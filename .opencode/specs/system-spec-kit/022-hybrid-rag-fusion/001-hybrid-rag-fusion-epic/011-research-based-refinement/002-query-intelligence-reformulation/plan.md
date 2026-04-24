---
title: "...hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/002-query-intelligence-reformulation/plan]"
description: "Focus: Heuristic-only query improvements — no LLM calls in the query path."
trigger_phrases:
  - "hybrid"
  - "rag"
  - "fusion"
  - "001"
  - "plan"
  - "002"
  - "query"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + phase-child-header | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/002-query-intelligence-reformulation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Query Intelligence & Reformulation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + phase-child-header | v2.2 -->

## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec** | `spec.md` |
| **Phase** | 2 of 5 (D2) |
| **Status** | Draft |
| **Created** | 2026-03-21 |

---

<!-- ANCHOR:phases -->
## 2. IMPLEMENTATION PHASES

### Phase A: Query Enhancement (REQ-D2-001, REQ-D2-002)

**Focus:** Heuristic-only query improvements — no LLM calls in the query path.

| Step | Task | Files | Est. |
|------|------|-------|------|
| A.1 | Implement facet detection heuristic (`isMultiFacet`) | `query-decomposer.ts` | 1d |
| A.2 | Implement bounded decomposition (`decompose()`, max 3 facets) | `query-decomposer.ts` | 1d |
| A.3 | Implement facet-coverage merge strategy | `query-decomposer.ts` | 1d |
| A.4 | Wire decomposition into `stage1-candidate-gen.ts` behind `SPECKIT_QUERY_DECOMPOSITION` | `stage1-candidate-gen.ts` | 0.5d |
| A.5 | Implement noun phrase extraction utility | `entity-linker.ts` | 0.5d |
| A.6 | Build concept alias table (bootstrap from existing concept index) | `entity-linker.ts` | 1d |
| A.7 | Implement alias matching and graph channel activation | `stage1-candidate-gen.ts`, `entity-linker.ts` | 0.5d |
| A.8 | Wire concept routing behind `SPECKIT_GRAPH_CONCEPT_ROUTING` | `stage1-candidate-gen.ts` | 0.5d |
| A.9 | Tests: facet detection, decomposition, merge, noun extraction, alias matching | test files | 1d |

**Phase A Total:** ~7 days

**Exit Criteria:**
- Multi-facet queries decompose correctly (max 3 facets)
- Concept routing activates graph channel only when aliases match
- Simple-query latency unchanged (no LLM calls added)
- All Phase A tests pass

---

### Phase B: LLM Integration (REQ-D2-003, REQ-D2-004)

**Focus:** LLM-powered query enhancement for deep/complex queries only.

**Prerequisite:** Phase A complete (decomposition available for fanout).

| Step | Task | Files | Est. |
|------|------|-------|------|
| B.1 | Implement cheap seed retrieval (`cheapSeedRetrieve`) | `llm-reformulation.ts` | 1d |
| B.2 | Implement step-back + corpus LLM reformulation | `llm-reformulation.ts` | 1.5d |
| B.3 | Wire reformulation into `stage1-candidate-gen.ts` behind `SPECKIT_LLM_REFORMULATION` | `stage1-candidate-gen.ts` | 0.5d |
| B.4 | Implement HyDE pseudo-document generation | `hyde.ts` | 1d |
| B.5 | Implement low-confidence detection (`lowConfidence`) and shadow mode gating | `hyde.ts` | 1d |
| B.6 | Wire HyDE into `stage1-candidate-gen.ts` behind `SPECKIT_HYDE` | `stage1-candidate-gen.ts` | 0.5d |
| B.7 | Implement LLM result caching (shared across reformulation + HyDE) | `llm-reformulation.ts`, `hyde.ts` | 1d |
| B.8 | Tests: seed retrieval, reformulation variants, HyDE generation, caching, shadow mode | test files | 1.5d |

**Phase B Total:** ~8 days

**Exit Criteria:**
- LLM reformulation produces grounded rewrites (not hallucinated)
- HyDE activates only for low-confidence deep queries
- LLM call budget ≤ 2 per query
- Caching prevents redundant LLM calls
- All Phase B tests pass

---

### Phase C: Index-Time Surrogates (REQ-D2-005)

**Focus:** Shift query-intelligence work to index time — precompute surrogates per memory.

**Prerequisite:** Phase A complete (alias matching reused for surrogate matching).

| Step | Task | Files | Est. |
|------|------|-------|------|
| C.1 | Design surrogate schema (aliases, headings, summary, surrogate questions) | index pipeline | 0.5d |
| C.2 | Implement surrogate generation at index time | index pipeline | 1.5d |
| C.3 | Store surrogates alongside vector embeddings | `vector-index-store.ts` | 1d |
| C.4 | Implement query-time surrogate matching and boost | `vector-index-store.ts` | 1d |
| C.5 | Wire behind `SPECKIT_QUERY_SURROGATES` flag | index pipeline, `vector-index-store.ts` | 0.5d |
| C.6 | Tests: surrogate generation, storage, query-time matching, recall impact | test files | 1d |

**Phase C Total:** ~5.5 days

**Exit Criteria:**
- Index pipeline generates surrogates for all indexed memories
- Query-time surrogate matching improves broad recall
- No runtime LLM calls for surrogate-based retrieval
- All Phase C tests pass

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:summary -->
## 3. PHASE SUMMARY

| Phase | Requirements | Focus | Est. | Dependencies |
|-------|-------------|-------|------|--------------|
| **A** | REQ-D2-001, REQ-D2-002 | Heuristic query enhancement | 7d | D3 Phase A (for concept routing entity tables) |
| **B** | REQ-D2-003, REQ-D2-004 | LLM-powered reformulation + HyDE | 8d | Phase A |
| **C** | REQ-D2-005 | Index-time surrogates | 5.5d | Phase A (alias matching reuse) |

**Total Estimate:** ~20.5 days

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:dependencies -->
## 4. CROSS-PHASE DEPENDENCIES

| This Phase Needs | From | Status |
|------------------|------|--------|
| Entity/alias tables for concept routing | D3 Phase A (typed traversal) | Draft |
| Existing concept index for alias bootstrap | Current codebase | Available |
| LLM API access for reformulation + HyDE | Infrastructure | Available |
| Evaluation framework for recall measurement | D1 / existing | Available |

| Other Phases Need from D2 | Consumer | Timing |
|---------------------------|----------|--------|
| Query decomposition signals | D1 channel attribution | D1 Phase C+ |
| Concept routing data | D3 graph activation heuristics | D3 Phase B |
| Surrogate schema | D5 explainability layer | D5 Phase B |

<!-- /ANCHOR:dependencies -->
---

## 5. FEATURE FLAGS

| Flag | Scope | Default | Phase |
|------|-------|---------|-------|
| `SPECKIT_QUERY_DECOMPOSITION` | Deep-mode only | Off | A |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | All queries | Off | A |
| `SPECKIT_LLM_REFORMULATION` | Deep-mode only | Off | B |
| `SPECKIT_HYDE` | Low-confidence deep only | Off | B |
| `SPECKIT_QUERY_SURROGATES` | Index + query time | Off | C |

---

## 6. ROLLBACK STRATEGY

Each feature is independently flag-gated. Rollback = disable flag. No data migrations required. Index-time surrogates (Phase C) are additive metadata — disabling the flag skips surrogate matching at query time but stored surrogates remain inert.

<!--
PLAN — D2: Query Intelligence & Reformulation
- 3 phases: A (heuristic), B (LLM), C (index-time)
- 5 feature flags, all off-by-default
- ~20.5 days total estimate
-->

<!-- ANCHOR:summary -->
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
<!-- /ANCHOR:rollback -->
