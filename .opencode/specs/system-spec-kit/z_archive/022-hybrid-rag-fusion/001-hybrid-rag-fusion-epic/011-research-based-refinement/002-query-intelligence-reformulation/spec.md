---
title: "...hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/002-query-intelligence-reformulation/spec]"
description: "Add query decomposition, graph concept routing, corpus-grounded LLM reformulation, HyDE shadow mode, and index-time query surrogates."
trigger_phrases:
  - "query decomposition"
  - "hyde"
  - "concept routing"
  - "llm reformulation"
  - "query surrogates"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/002-query-intelligence-reformulation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

# Feature Specification: Query Intelligence & Reformulation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-21 |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 2 of 5 |
| **Predecessor** | `../001-fusion-scoring-intelligence/spec.md` |
| **Successor** | `../003-graph-augmented-retrieval/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current retrieval pipeline treats every user query as a single opaque string — one embedding lookup, one keyword expansion, one graph probe. This works for simple, well-phrased queries but fails when the user's question is multi-faceted ("what decisions were made about scoring AND graph pruning?"), uses vocabulary that diverges from stored terminology, or targets concepts that sit across multiple memory clusters. The result is missed recall on complex queries while simple-query latency must remain untouched.

### Purpose

Introduce five query-intelligence capabilities — decomposition, concept routing, corpus-grounded LLM reformulation, HyDE shadow mode, and index-time query surrogates — each behind a feature flag, each gated to deep/complex queries only, to close the recall gap on hard queries without regressing the fast path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **REQ-D2-001** — Query decomposition with bounded facet detection
- **REQ-D2-002** — Graph concept routing via alias matching
- **REQ-D2-003** — Corpus-grounded LLM reformulation (step-back + seeds)
- **REQ-D2-004** — HyDE shadow mode for low-confidence deep queries
- **REQ-D2-005** — Index-time query surrogates (precomputed aliases, surrogate questions)

### Out of Scope

- Changes to the embedding model or provider
- Breaking changes to existing MCP tool contracts
- Raw HyDE (ungrounded hallucinated documents) — replaced by corpus-grounded approach
- Community detection graph features (deferred to D3)
- Feedback loop integration (D4 scope)

### Files to Change

| File | Change Type | Requirements |
|------|-------------|--------------|
| `stage1-candidate-gen.ts` | Modify | REQ-D2-001, -002, -003, -004 |
| `query-decomposer.ts` | **New** | REQ-D2-001 |
| `entity-linker.ts` | Modify | REQ-D2-002 |
| `llm-reformulation.ts` | **New** | REQ-D2-003 |
| `hyde.ts` | **New** | REQ-D2-004 |
| `vector-index-store.ts` | Modify | REQ-D2-005 |
| Index pipeline modules | Modify | REQ-D2-005 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-D2-001: Query Decomposition (Research Rec #10, Size M)

**What:** Bounded facet detection that decomposes deep multi-faceted questions into up to 3 sub-queries, runs hybrid retrieval for each, and merges results by facet coverage.

**Feature Flag:** `SPECKIT_QUERY_DECOMPOSITION` — deep-mode only.

**Files:** `stage1-candidate-gen.ts`, new `query-decomposer.ts`

**Implementation Sketch:**

```typescript
if (deep && isMultiFacet(q)) {
  const facets = decompose(q).slice(0, 3);
  const pools = await Promise.all([q, ...facets].map(runHybrid));
  return mergeByFacetCoverage(pools);
}
```

**Expected Impact:**
- Recall: +6–15% on complex multi-facet queries
- Latency: +15–60ms heuristic decomposition, +250–600ms LLM fallback

---

### REQ-D2-002: Graph Concept Routing (Research Rec #11, Size S/M)

**What:** Query-time alias matching that extracts noun phrases, matches them against a concept alias table, and activates the graph channel only when relevant concepts are detected.

**Feature Flag:** `SPECKIT_GRAPH_CONCEPT_ROUTING`

**Files:** `stage1-candidate-gen.ts`, `entity-linker.ts`

**Implementation Sketch:**

```typescript
const concepts = matchAliases(nounPhrases(q), conceptAliasTable);
if (concepts.length) route.enableGraph(concepts);
```

**Expected Impact:**
- Recall: +3–8% on graph-relevant queries
- Latency: <5ms (rule-based matching)

**Cross-Dependencies:** D3 Phase A (typed traversal) + entity tables from graph lifecycle.

---

### REQ-D2-003: Corpus-Grounded LLM Reformulation (Research Rec #12, Size M)

**What:** Step-back abstraction combined with corpus seed retrieval — not raw HyDE. Retrieves cheap seed results first, then asks the LLM to rewrite the query using those seeds as grounding context.

**Feature Flag:** `SPECKIT_LLM_REFORMULATION` — deep-mode only.

**Files:** new `llm-reformulation.ts`, `stage1-candidate-gen.ts`

**Implementation Sketch:**

```typescript
const seeds = await cheapSeedRetrieve(q);
const reform = await llm.rewrite({
  q,
  seeds,
  mode: 'step_back+corpus'
});
return fanout([q, reform.abstract, ...reform.variants]);
```

**Expected Impact:**
- Recall: +4–10% on paraphrase/vocabulary-mismatch queries
- Latency: +250–550ms uncached (LLM call)

---

### REQ-D2-004: HyDE Shadow Mode (Research Rec #24, Size M)

**What:** Hypothetical document embedding generation, activated only for low-confidence deep queries. Generates a pseudo-document, embeds it, and merges vector-only results with the baseline. Starts in shadow mode with conditional production promotion.

**Feature Flag:** `SPECKIT_HYDE`

**Files:** new `hyde.ts`, `stage1-candidate-gen.ts`

**Implementation Sketch:**

```typescript
if (deep && lowConfidence(baseline)) {
  const pseudo = await llm.hyde(q, 'markdown-memory');
  const emb = await embed(pseudo);
  return merge(baseline, await vectorOnly(emb));
}
```

**Expected Impact:**
- Recall: +2–6% on semantic mismatch queries
- Latency: +300–700ms uncached (LLM generation + embedding)

---

### REQ-D2-005: Index-Time Query Surrogates (Research Rec #25, Size M/L)

**What:** At index time, precompute aliases, decision summaries, and likely user questions for each memory. At query time, match against surrogates to boost recall without runtime LLM calls.

**Feature Flag:** `SPECKIT_QUERY_SURROGATES`

**Files:** index pipeline modules, `vector-index-store.ts`

**Implementation Sketch:**

```typescript
// Index time
onIndex(doc) => store({
  aliases,
  headings,
  summary,
  surrogateQuestions
});

// Query time
onQuery(q) => search(q + matchedSurrogates(q));
```

**Expected Impact:**
- Recall: +3–7% broad recall improvement
- Lower runtime LLM call rate (work shifted to index time)
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Measurement |
|----|-----------|-------------|
| SC-D2-001 | Recall@20 improvement on complex queries | ≥ +5% vs baseline |
| SC-D2-002 | Simple-query p95 latency unchanged | Regression test passes |
| SC-D2-003 | Per-query LLM budget for deep/complex | ≤ 2 LLM calls |
| SC-D2-004 | All 5 features behind feature flags | Flags verified off-by-default |
| SC-D2-005 | Existing test suite passes | 4876+ tests green |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Latency budget — sub-second for simple queries | High | Feature flags + deep-mode gating; simple path untouched |
| Risk | API cost stacking — multiple LLM calls per query | Medium | ≤ 2 LLM calls budget, caching, corpus-grounded approach reduces retries |
| Risk | Over-expansion drift — decomposition generates too many sub-queries | Medium | Hard cap at 3 facets, facet-coverage merge deduplicates |
| Risk | Merge noise from decomposition | Medium | Facet-coverage scoring prioritizes relevant results |
| Dependency | D3 Phase A — typed traversal for concept routing | REQ-D2-002 blocked if no graph types | Execute D3 Phase A in Wave 1 |
| Dependency | Entity tables from graph lifecycle | REQ-D2-002 needs alias data | Bootstrapped from existing concept index |
<!-- /ANCHOR:risks -->

---

## 7. RELATED DOCUMENTS

- [Parent Spec](../spec.md) — Research-Based Refinement (011)
- [Parent Plan](../plan.md) — Cross-phase implementation waves
- [Predecessor: D1](../001-fusion-scoring-intelligence/spec.md) — Fusion Scoring Intelligence
- [Successor: D3](../003-graph-augmented-retrieval/spec.md) — Graph-Augmented Retrieval
- Research Source (historical, path removed) — Full 29-recommendation synthesis
- [Plan](plan.md) — D2 implementation phases
- [Tasks](tasks.md) — D2 task breakdown
- [Checklist](checklist.md) — Level 2 verification

<!--
LEVEL 2 SPEC — Phase 2 of 5 (D2: Query Intelligence & Reformulation)
- Child of 011-research-based-refinement
- 5 requirements from research recommendations #10, #11, #12, #24, #25
- 5 feature flags, 3 new modules, deep-mode gating
-->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->
