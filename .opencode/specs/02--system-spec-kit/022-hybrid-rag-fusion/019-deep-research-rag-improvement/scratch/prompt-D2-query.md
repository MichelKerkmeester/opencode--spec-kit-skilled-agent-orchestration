# Research Dimension D2: Query Intelligence & Reformulation

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching query understanding and reformulation for a production Hybrid RAG Fusion system. The system retrieves structured markdown documents (spec-kit memories) from a corpus of hundreds to low thousands of items. It's built in TypeScript with SQLite.

**Current Query Pipeline:**
- Intent classifier routes queries to 7 classes: understand, fix_bug, add_feature, find_decision, recover_context, review_code, general
- Complexity router (R15) classifies queries as simple/moderate/complex and adjusts channel selection
- Query expansion via embedding-based term mining: generates additional search terms by finding semantically similar tokens
- Multi-query expansion: generates multiple query variants (feature-flagged)
- Query tokenization via `sanitizeQueryTokens()` for BM25 channel
- No query decomposition for multi-faceted questions
- No HyDE (Hypothetical Document Embeddings)
- No LLM-assisted reformulation
- No chain-of-thought query analysis

**Stage 1 — Candidate Generation:**
- Channel selection based on complexity class and intent
- Query expansion applied before channel execution
- Constitutional memory injection if missing from results
- Quality score and tier filtering

**Relevant Feature Flags:**
- `SPECKIT_EMBEDDING_EXPANSION` — embedding-based query expansion
- `SPECKIT_MULTI_QUERY` — multi-query expansion
- `SPECKIT_COMPLEXITY_ROUTER` — query complexity routing
- `SPECKIT_CONFIDENCE_TRUNCATION` — confidence-based result truncation
- `SPECKIT_DYNAMIC_TOKEN_BUDGET` — token-aware result limiting

## Current Reality (Feature Catalog Excerpts)

- **Query Complexity Router** (feature 12-01): Implemented. Routes simple queries to fewer channels, complex to all 4. Based on token count + entity detection heuristics.
- **Query Expansion** (feature 12-06): Implemented. Embedding-based term mining with stop-word filtering. Mutually exclusive with R15 (can't use both simultaneously).
- **Confidence-Based Result Truncation** (feature 12-04): Implemented. Truncates low-confidence tail of results based on score distribution analysis.
- **Dynamic Token Budget** (feature 12-05): Implemented. Adjusts number of results returned based on available context window tokens.

## Research Questions

1. **HyDE for Structured Documents**: Does Hypothetical Document Embeddings (generating a hypothetical answer, then searching by its embedding) improve recall for structured markdown documents? How does HyDE perform vs embedding expansion at small corpus scale? What's the latency cost? Can HyDE be cached or pre-computed?

2. **Query Decomposition**: When a user asks "what was decided about graph signals and how does it relate to scoring?" — should the system decompose into sub-queries? What decomposition strategies work for knowledge-base QA (vs web search)? How to recombine sub-query results?

3. **Concept Extraction for Graph Routing**: Can the system extract entities/concepts from the query to route more effectively to the graph channel? E.g., detecting "graph signals" as a concept linked to known causal edges. Rule-based vs lightweight NER vs LLM extraction?

4. **LLM-Assisted Reformulation**: At small corpus scale (hundreds to thousands), is the cost/benefit of LLM-based query reformulation justified? What are efficient approaches (step-back prompting, query2doc, chain-of-thought reformulation)? Can reformulation be done locally without API calls?

5. **Multi-Faceted Query Handling**: How should the system detect that a query has multiple facets vs a single intent? What routing strategies exist for multi-faceted queries (fan-out, sequential refinement, merge)?

6. **Query-Time vs Index-Time Intelligence**: What should happen at query time vs what should be pre-computed at index/save time? (e.g., entity extraction, concept linking, document summarization)

## Constraints

- TypeScript/SQLite, no GPU available for local model inference
- LLM API calls are available but add latency (200-500ms per call)
- Corpus is structured markdown with metadata (title, trigger_phrases, importance_tier, context_type, spec_folder)
- Must maintain sub-second p95 latency for simple queries
- Feature flags available for gradual rollout
- Size recommendations as S (days), M (weeks), L (months)

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (HyDE, query2doc, step-back prompting, decomposition strategies — cite papers)
3. **Gap Analysis** (current system vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, TypeScript pseudocode sketch, expected recall improvement, latency impact, feature flag name)
5. **Risk Assessment** (latency budget, API cost, over-expansion pitfalls)
6. **Cross-Dimensional Dependencies** (how query improvements connect to Fusion D1, Graph D3, Feedback D4, UX D5)
