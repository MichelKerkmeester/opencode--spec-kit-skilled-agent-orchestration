## F-01: INT8 quantization evaluation
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE. This is a decision-record feature (NO-GO decision) with no dedicated implementation files. The decision documents evaluation results and rationale for not adopting INT8 quantization.
- **Test Gaps:** NONE
- **Playbook Coverage:** N/A
- **Recommended Fixes:** NONE

## F-02: Implemented: graph centrality and community detection
- **Status:** WARN
- **Code Issues:** NONE. Community detection BFS implementation (`mcp_server/lib/graph/community-detection.ts`) uses index-based queue (O(V+E)) with Louvain escalation when >50% nodes in largest component. PageRank (`mcp_server/lib/manage/pagerank.ts`) uses damping=0.85, convergence 1e-6, max 10 iterations with dangling-node correction. Both implementations are algorithmically correct.
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current Reality says N2a (graph momentum), N2b (causal depth), and migration v19 table additions are implemented (`feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md:7`), but the feature's Source Files table lists only `community-detection.ts` and `pagerank.ts` (`.../02-implemented-graph-centrality-and-community-detection.md:15-17`). N2a/N2b logic lives in `graph-signals.ts` (`mcp_server/lib/graph/graph-signals.ts:48-55`, `102-149`) and migration v19 table creation lives in `vector-index-schema.ts` (`mcp_server/lib/search/vector-index-schema.ts:587-623`). These are referenced in Current Reality text but omitted from the Source Files inventory, creating a completeness gap.
- **Test Gaps:** Listed tests cover community detection and pagerank (`feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md:22-23`), but do not cover the N2a/N2b graph-signals module or migration-v19 behavior referenced in Current Reality. Specifically, no test validates `computeGraphMomentum` or `computeCausalDepth` from `graph-signals.ts`.
- **Playbook Coverage:** N/A
- **Recommended Fixes:** 1. Update the feature Source Files table to include `mcp_server/lib/graph/graph-signals.ts` and the migration touchpoints in `vector-index-schema.ts`. 2. Add/attach test references for momentum/depth behavior and migration v19 expectations in this feature entry.

## F-03: Implemented: auto entity extraction
- **Status:** WARN
- **Code Issues:** 1. Rule-3 key-phrase extraction regex (`mcp_server/lib/extraction/entity-extractor.ts:69`) allows `.` in continuation tokens via the `[\w.-]+` character class. This means the pattern `(?:[Uu]sing|[Ww]ith|[Vv]ia|[Ii]mplements)\s+([A-Za-z][\w.-]+(?:\s+[A-Z][\w.-]+)*)` can capture across sentence boundaries when a sentence ends with a period followed by a capitalized word (e.g., "using GraphQL. Implements Singleton" would capture "GraphQL. Implements Singleton" as one key phrase).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current Reality positions this as precision-oriented noun-phrase extraction (`feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md:7`), but the Rule-3 regex behavior can absorb cross-sentence fragments, reducing extraction precision. The 5-rule extraction pipeline (proper_noun, technology, key_phrase, heading, quoted) is correctly structured, and the `filterEntities` denylist and length-check post-processing works as documented, but Rule-3 input quality is degraded by the period-in-continuation issue.
- **Test Gaps:** Existing tests currently codify the cross-sentence capture behavior instead of preventing it (`mcp_server/tests/entity-extractor.vitest.ts:106-118`). No negative test asserts that sentence-boundary periods terminate key-phrase capture.
- **Playbook Coverage:** N/A
- **Recommended Fixes:** 1. Tighten Rule-3 regex to use `[\w-]+` instead of `[\w.-]+` in the continuation token pattern, preventing period-based cross-sentence capture. 2. Add negative tests asserting that inputs like "using GraphQL. Implements caching" produce two separate entities, not one combined phrase.

## F-04: Implemented: memory summary generation
- **Status:** PASS
- **Code Issues:** NONE. TF-IDF summarizer (`mcp_server/lib/search/tfidf-summarizer.ts`) correctly computes term frequencies, inverse document frequencies, and extracts top-3 sentences by default. Memory summaries module (`mcp_server/lib/search/memory-summaries.ts`) correctly implements scale gate (>5000 memories check at lines 202-217) and summary embedding generation.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE. Runtime scale gate and threshold boundaries are covered (`mcp_server/lib/search/memory-summaries.ts:202-217`; `mcp_server/tests/memory-summaries.vitest.ts:540-570`).
- **Playbook Coverage:** N/A
- **Recommended Fixes:** NONE

## F-05: Implemented: cross-document entity linking
- **Status:** PASS
- **Code Issues:** NONE. Entity linker (`mcp_server/lib/search/entity-linker.ts`) correctly implements: entity name normalization (lowercase, whitespace collapse), cross-document matching requiring 2+ distinct spec folders, density guard with `MAX_EDGES_PER_NODE=20` (line 16), batch edge count pre-fetch for efficiency (lines 350-363), and `runEntityLinking` orchestrator (lines 483-513).
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE. Density guards, per-node edge cap, env-threshold override, and pipeline execution are covered (`mcp_server/lib/search/entity-linker.ts:16-23`, `350-363`, `483-513`; `mcp_server/tests/entity-linker.vitest.ts:351-421`, `563-610`).
- **Playbook Coverage:** N/A
- **Recommended Fixes:** NONE
