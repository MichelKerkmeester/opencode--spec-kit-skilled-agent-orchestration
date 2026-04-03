# Diagnosis Trace: memory_search("Semantic Search")

## Date: 2026-04-01

## Query
```
memory_search({ query: "Semantic Search", includeTrace: true, includeConstitutional: false, limit: 5 })
```

## Result Summary
- **5 results returned** (not 0 as spec originally stated — prior fixes helped)
- requestQuality: "weak"
- Top result confidence: 0.341 (low)
- Recovery status: "low_confidence", reason: "low_signal_query"
- Total pipeline time: 650ms

## Stage-by-Stage Trace

### Stage 1: Candidate Generation (382ms)
- **D2 concept routing**: Activated, matched concept `["search"]` — graphActivated=true
  - NOTE: "semantic" NOT matched (missing from BUILTIN_CONCEPT_ALIASES in entity-linker.ts)
- **R12 embedding expansion**: Enabled but produced 0 expansion terms
- **Hybrid search**: 1 channel, 5 candidates
- **Deep expansion**: false

### Stage 2: Fusion (5ms)
- Session boost: OFF (no session ID provided)
- Causal boost: APPLIED
  - 0 causal boosted
  - 2 co-activation boosted
  - 0 community injected
  - 0 graph signals boosted
  - rolloutState: "bounded_runtime"
- Artifact routing: APPLIED (detected "research" class at 0.33 confidence)
- Intent weights: OFF
- Feedback signals: OFF

### Stage 3: Rerank (262ms)
- Cross-encoder reranking: APPLIED
- Chunk reassembly: none needed

### Stage 4: Filter (1ms)
- State filtered: 0
- Evidence gap: NOT detected
- Token budget truncated: 5 → 1 (display layer, not retrieval)

## Top Result
- ID: 19014
- Spec: 010-search-retrieval-quality-fixes/spec.md
- Semantic similarity: 75.61
- Fusion score: 0.402
- Confidence: 0.341 (low)
- Graph contribution: raw=3, normalized=0.031, bonus=0.001

## Key Findings

### What Already Works
1. Basic hybrid search returns relevant results
2. D2 concept routing activates for known aliases
3. Causal boost infrastructure is active (co-activation fires)
4. Cross-encoder reranking improves ordering
5. Artifact routing classifies query type
6. Recovery payload generates structured recovery suggestion

### What's Missing/Broken (All 8 improvements confirmed needed)
1. **"semantic" not in concept aliases** — entity-linker.ts BUILTIN_CONCEPT_ALIASES has "search" but not "semantic"
2. **Community detection + summaries**: communityInjected=0, no community search channel
3. **Query expansion via graph**: Concept routing only logs to trace metadata; doesn't expand search terms
4. **Graph-expanded fallback**: Recovery payload suggests "switch_mode" but doesn't try graph expansion
5. **Always-on graph injection**: Graph signals only via reactive causal/co-activation boost
6. **Provenance**: No graphEvidence field in results
7. **Temporal edges**: No valid_at/invalid_at fields
8. **Usage-weighted ranking**: No access count signal
9. **Ontology hooks**: Not implemented

### Overlap with Existing Code (T005b/T005c/T005d)
- `query-intent-classifier.ts`: Routes structural/semantic/hybrid for code graph vs CocoIndex. **Extend with extractConcepts()** rather than building separate extractor
- `recovery-payload.ts`: Has framework for suggested recovery — extend for graph-expanded retry
- `envelope.hints` in context-server.ts: Existing hint injection pipeline — use for provenance display
- `SessionSnapshot.cocoIndexAvailable`: Already exists, graph improvements integrate naturally
