OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d114c-5765-74f1-93e7-fb3ee76c349d
--------
user
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
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a research-only pass on query intelligence for the Hybrid RAG Fusion system, so I’m starting by loading the relevant research workflow guidance and then I’ll gather primary-source papers plus just enough local context to anchor recommendations to your current architecture.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:
 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- ChatGPT runtime: `.opencode/agent/chatgpt/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Research query intelligence and reformulation for Hybrid RAG Fusion system; produce state-of-art survey with citations and recommendations" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[]
codex
I’ve confirmed this is a deep-research style task, and I’m grounding the paper survey against the local retrieval docs next so the recommendations line up with the actual flags and routing constraints rather than drifting into generic RAG advice.
Plan update
Running a research pass that combines local system context with primary-source literature so the recommendations are concrete and directly mappable to the current Hybrid RAG Fusion pipeline.
  → Load local context on current query pipeline, feature flags, and relevant retrieval docs
  • Survey primary-source literature on HyDE, query2doc, step-back prompting, decomposition, and multi-facet handling
  • Synthesize gap analysis, prioritized recommendations, and cross-dimensional dependencies
tool cocoindex_code.search({"query":"query complexity router feature 12-01 query expansion feature 12-06 confidence truncation dynamic token budget Hybrid RAG Fusion memory retrieval","limit":5,"refresh_index":true})
cocoindex_code.search({"query":"query complexity router feature 12-01 query expansion feature 12-06 confidence truncation dynamic token budget Hybrid RAG Fusion memory retrieval","limit":5,"refresh_index":true}) success in 3.28s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D2-query.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- Intent classifier routes queries to 7 classes: understand, fix_bug, add_feature, find_decision, recover_context, review_code, general\\n- Complexity router (R15) classifies queries as simple/moderate/complex and adjusts channel selection\\n- Query expansion via embedding-based term mining: generates additional search terms by finding semantically similar tokens\\n- Multi-query expansion: generates multiple query variants (feature-flagged)\\n- Query tokenization via `sanitizeQueryTokens()` for BM25 channel\\n- No query decomposition for multi-faceted questions\\n- No HyDE (Hypothetical Document Embeddings)\\n- No LLM-assisted reformulation\\n- No chain-of-thought query analysis\\n\\n**Stage 1 — Candidate Generation:**\",\n      \"start_line\": 10,\n      \"end_line\": 20,\n      \"score\": 0.6805220094592652\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D2-query.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## Current Reality (Feature Catalog Excerpts)\\n\\n- **Query Complexity Router** (feature 12-01): Implemented. Routes simple queries to fewer channels, complex to all 4. Based on token count + entity detection heuristics.\\n- **Query Expansion** (feature 12-06): Implemented. Embedding-based term mining with stop-word filtering. Mutually exclusive with R15 (can't use both simultaneously).\\n- **Confidence-Based Result Truncation** (feature 12-04): Implemented. Truncates low-confidence tail of results based on score distribution analysis.\\n- **Dynamic Token Budget** (feature 12-05): Implemented. Adjusts number of results returned based on available context window tokens.\\n\\n## Research Questions\",\n      \"start_line\": 45,\n      \"end_line\": 52,\n      \"score\": 0.6739193102512715\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D2-query.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## Current Reality (Feature Catalog Excerpts)\\n\\n- **Query Complexity Router** (feature 12-01): Implemented. Routes simple queries to fewer channels, complex to all 4. Based on token count + entity detection heuristics.\\n- **Query Expansion** (feature 12-06): Implemented. Embedding-based term mining with stop-word filtering. Mutually exclusive with R15 (can't use both simultaneously).\\n- **Confidence-Based Result Truncation** (feature 12-04): Implemented. Truncates low-confidence tail of results based on score distribution analysis.\\n- **Dynamic Token Budget** (feature 12-05): Implemented. Adjusts number of results returned based on available context window tokens.\\n\\n## Research Questions\",\n      \"start_line\": 33,\n      \"end_line\": 40,\n      \"score\": 0.6739193102512715\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- [Query intelligence](#query-intelligence)\\n  - [Query complexity router](#query-complexity-router)\\n  - [Relative score fusion in shadow mode](#relative-score-fusion-in-shadow-mode)\\n  - [Channel min-representation](#channel-min-representation)\\n  - [Confidence-based result truncation](#confidence-based-result-truncation)\\n  - [Dynamic token budget allocation](#dynamic-token-budget-allocation)\\n  - [Query expansion](#query-expansion)\\n- [Memory quality and indexing](#memory-quality-and-indexing)\\n  - [Verify-fix-verify memory quality loop](#verify-fix-verify-memory-quality-loop)\\n  - [Signal vocabulary expansion](#signal-vocabulary-expansion)\\n  - [Pre-flight token budget validation](#pre-flight-token-budget-validation)\\n  - [Spec folder description discovery](#spec-folder-description-discovery)\\n  - [Pre-storage quality gate](#pre-storage-quality-gate)\\n  - [Reconsolidation-on-save](#reconsolidation-on-save)\\n  - [Smarter memory content generation](#smarter-memory-content-generation)\",\n      \"start_line\": 123,\n      \"end_line\": 137,\n      \"score\": 0.6657897686522958\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/feature_catalog/feature_catalog.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- [Query intelligence](#query-intelligence)\\n  - [Query complexity router](#query-complexity-router)\\n  - [Relative score fusion in shadow mode](#relative-score-fusion-in-shadow-mode)\\n  - [Channel min-representation](#channel-min-representation)\\n  - [Confidence-based result truncation](#confidence-based-result-truncation)\\n  - [Dynamic token budget allocation](#dynamic-token-budget-allocation)\\n  - [Query expansion](#query-expansion)\\n- [Memory quality and indexing](#memory-quality-and-indexing)\\n  - [Verify-fix-verify memory quality loop](#verify-fix-verify-memory-quality-loop)\\n  - [Signal vocabulary expansion](#signal-vocabulary-expansion)\\n  - [Pre-flight token budget validation](#pre-flight-token-budget-validation)\\n  - [Spec folder description discovery](#spec-folder-description-discovery)\\n  - [Pre-storage quality gate](#pre-storage-quality-gate)\\n  - [Reconsolidation-on-save](#reconsolidation-on-save)\\n  - [Smarter memory content generation](#smarter-memory-content-generation)\",\n      \"start_line\": 149,\n      \"end_line\": 163,\n      \"score\": 0.6657897686522958\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D2-query.md",
        "language": "markdown",
        "content": "- Intent classifier routes queries to 7 classes: understand, fix_bug, add_feature, find_decision, recover_context, review_code, general\n- Complexity router (R15) classifies queries as simple/moderate/complex and adjusts channel selection\n- Query expansion via embedding-based term mining: generates additional search terms by finding semantically similar tokens\n- Multi-query expansion: generates multiple query variants (feature-flagged)\n- Query tokenization via `sanitizeQueryTokens()` for BM25 channel\n- No query decomposition for multi-faceted questions\n- No HyDE (Hypothetical Document Embeddings)\n- No LLM-assisted reformulation\n- No chain-of-thought query analysis\n\n**Stage 1 — Candidate Generation:**",
        "start_line": 10,
        "end_line": 20,
        "score": 0.6805220094592652
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D2-query.md",
tool codex.list_mcp_resources({})
codex.list_mcp_resources({}) success in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resources\":[]}"
    }
  ],
  "isError": false
}
exec
/bin/zsh -lc 'rg -n "12-01|12-04|12-05|12-06|SPECKIT_COMPLEXITY_ROUTER|SPECKIT_EMBEDDING_EXPANSION|SPECKIT_MULTI_QUERY|SPECKIT_CONFIDENCE_TRUNCATION|SPECKIT_DYNAMIC_TOKEN_BUDGET" .' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 49ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/checklist.md:5:created: "2025-12-01"
./.opencode/skill/system-spec-kit/references/structure/folder_structure.md:249:    └── 12-01-24_14-00__authentication-system.md
./.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:24:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25 and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking. RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/research/009 - analysis-gemini-2.md:105:3.  **Token Budget Scalability (from System-Spec-Kit):** The introduction of a dynamic token budget based on query complexity (`SPECKIT_DYNAMIC_TOKEN_BUDGET`), combined with ANCHOR-based chunking, proves that RAG systems must be actively hostile to token bloat. Fetching 150 tokens of an explicit `<!-- ANCHOR: decisions -->` is vastly superior to fetching a 3000-token document chunk.
./.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:634:  - Verified: 2025-12-01 14:30
./.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:637:  - Verified: 2025-12-01 14:32
./.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:642:  - Verified: 2025-12-01 14:35
./.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:645:  - Verified: 2025-12-01 14:38
./.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:652:  - Verified: 2025-12-01 14:40
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/spec.md:5:created: "2025-12-01"
./.opencode/skill/system-spec-kit/references/config/environment_variables.md:199:| `SPECKIT_MULTI_QUERY` | ON | S1 | Multi-query expansion for deep-mode retrieval |
./.opencode/skill/system-spec-kit/references/config/environment_variables.md:201:| `SPECKIT_EMBEDDING_EXPANSION` | ON | S3 | Query expansion for embedding retrieval. Suppressed when classification = "simple" |
./.opencode/skill/system-spec-kit/references/config/environment_variables.md:202:| `SPECKIT_CONFIDENCE_TRUNCATION` | ON | S4 | Confidence-based result truncation |
./.opencode/skill/system-spec-kit/references/config/environment_variables.md:203:| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | ON | S4 | Dynamic token budget allocation based on query complexity |
./.opencode/skill/system-spec-kit/references/config/environment_variables.md:204:| `SPECKIT_COMPLEXITY_ROUTER` | ON | S4 | Query complexity classification and routing |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/checklist.md:5:created: "2025-12-01"
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/description.json:20:    "15-03-26_12-05__perfect-session-capturing.md",
./.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:149:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25 and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking. RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
./.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2063:The `SPECKIT_COMPLEXITY_ROUTER` flag is **enabled by default** (graduated Sprint 4, `isComplexityRouterEnabled()` returns `true` unless explicitly set to `"false"`). When the flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.
./.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2125:Edge cases are handled. NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.
codex
The local docs confirm the feature wiring you described, including the “expansion vs complexity router” tension, so I’m drilling into the retrieval pipeline docs now and then I’ll map the literature onto those exact decision points.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Hybrid search pipeline"
description: "Covers the multi-channel retrieval engine with five search channels, adaptive fusion and tiered fallback."
---

# Hybrid search pipeline

## 1. OVERVIEW

Covers the multi-channel retrieval engine with five search channels, adaptive fusion and tiered fallback.

When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results.

---

## 2. CURRENT REALITY

The engine under the hood. `handlers/memory-search.ts` is the runtime entry point, and Stage 1 delegates candidate generation into `lib/search/hybrid-search.ts` plus the supporting pipeline stages. `hybrid-search.ts` still owns the multi-channel retrieval, adaptive fusion inputs, diversity reranking, and fallback chain, but it now operates as the candidate-generation engine inside the four-stage runtime pipeline rather than as a standalone top-level MCP entry point.

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.8) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/01-query-complexity-router.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/05-dynamic-token-budget.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/01-query-complexity-router.md: No such file or directory
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/05-dynamic-token-budget.md: No such file or directory
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/06-query-expansion.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/04-confidence-truncation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/06-query-expansion.md: No such file or directory
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/03--query-intelligence/04-confidence-truncation.md: No such file or directory
codex
One local path guess was wrong, so I’m resolving the exact feature-catalog locations before I keep citing them; after that it’s papers and benchmarks.
exec
/bin/zsh -lc 'rg -n "Query complexity router|Confidence-based result truncation|Dynamic token budget allocation|Query expansion" .opencode/skill/system-spec-kit/feature_catalog' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog | rg "query|confidence|token|complexity|expansion"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md
 succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2051:### Query complexity router
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2113:### Confidence-based result truncation
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2133:### Dynamic token budget allocation
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2153:### Query expansion
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:2:title: "Confidence-based result truncation"
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:3:description: "Confidence-based result truncation detects where relevant results end by analyzing consecutive score gaps and trims the irrelevant tail."
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:6:# Confidence-based result truncation
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:10:Confidence-based result truncation detects where relevant results end by analyzing consecutive score gaps and trims the irrelevant tail.
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:45:- Source feature title: Confidence-based result truncation
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:186:| `mcp_server/tests/query-expander.vitest.ts` | Query expansion tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:178:| `mcp_server/tests/query-expander.vitest.ts` | Query expansion tests |
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md:2:title: "Query complexity router"
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md:6:# Query complexity router
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md:64:- Source feature title: Query complexity router
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:2:title: "Dynamic token budget allocation"
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:3:description: "Dynamic token budget allocation scales the token budget returned per query based on query complexity tier."
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:6:# Dynamic token budget allocation
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:10:Dynamic token budget allocation scales the token budget returned per query based on query complexity tier.
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:49:- Source feature title: Dynamic token budget allocation
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:217:| `mcp_server/tests/query-expander.vitest.ts` | Query expansion tests |
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Query complexity router"
description: "The query complexity router classifies incoming queries by term count and trigger match to select how many search channels run."
---

# Query complexity router

## 1. OVERVIEW

The query complexity router classifies incoming queries by term count and trigger match to select how many search channels run.

Not every question needs the same amount of effort to answer. This feature sizes up your question first, like a triage nurse, and routes simple lookups through a fast path while sending complex research questions through a deeper search. Without it, every question would get the full heavy-duty treatment, wasting time and resources on things that could be answered in seconds.

---

## 2. CURRENT REALITY

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers. Tier classification is driven exclusively by `termCount` and `triggerMatch`. `charCount` and `stopWordRatio` are informational features that influence confidence scoring only (see `determineConfidence()`). Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.
 succeeded in 0ms:
---
title: "Query expansion"
description: "Query expansion broadens retrieval for complex queries by mining related terms from the vector index and appending them to the original query."
---

# Query expansion

## 1. OVERVIEW

Query expansion broadens retrieval for complex queries by mining related terms from the vector index and appending them to the original query.

Sometimes the words you use in a question do not match the words stored in the system, even though they mean the same thing. This feature automatically adds related terms to your search so you find relevant results even when the exact wording differs. It only kicks in for complex questions because simple lookups do not benefit from the extra breadth.

---

## 2. CURRENT REALITY

Embedding-based query expansion broadens retrieval for complex queries by mining similar memories from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.

When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Confidence-based result truncation"
description: "Confidence-based result truncation detects where relevant results end by analyzing consecutive score gaps and trims the irrelevant tail."
---

# Confidence-based result truncation

## 1. OVERVIEW

Confidence-based result truncation detects where relevant results end by analyzing consecutive score gaps and trims the irrelevant tail.

Search results often include a long tail of irrelevant items tacked onto the end. This feature detects the point where results stop being useful and cuts off the rest, like a reader who stops scrolling once the answers clearly run out. Without it, you would get padded results that waste your attention on things that do not actually match your question.

---

## 2. CURRENT REALITY

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Dynamic token budget allocation"
description: "Dynamic token budget allocation scales the token budget returned per query based on query complexity tier."
---

# Dynamic token budget allocation

## 1. OVERVIEW

Dynamic token budget allocation scales the token budget returned per query based on query complexity tier.

Every answer the system gives takes up space in a limited response window. This feature gives simple questions a small response budget and saves the big budget for complex questions that genuinely need more room. Think of it like packing a lunch bag versus a suitcase: you match the container to what you actually need to carry.

---

## 2. CURRENT REALITY

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead (~12 tokens per result, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.
codex
I’ve got the current pipeline docs pinned down now. I’m adding the missing pieces around multi-query and then moving into the literature pass so the recommendations can be prioritized against your actual latency and flag model.
exec
/bin/zsh -lc "rg -n \"SPECKIT_MULTI_QUERY|multi-query|multi query\" .opencode/skill/system-spec-kit/feature_catalog .opencode/skill/system-spec-kit/mcp_server | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:170:  mode?: string; // "deep" mode enables query expansion for multi-query RAG
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:86:| `SPECKIT_MULTI_QUERY` | `true` | boolean | `lib/search/search-flags.ts` | Enables multi-query expansion for deep-mode retrieval. The query is expanded into up to 3 variants via `expandQuery()`, each variant runs hybrid search in parallel, and results merge with deduplication. |
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:783:| `SPECKIT_MULTI_QUERY`        | `true`  | Enable multi-query expansion for deep-mode retrieval                                  |
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:1204:A: Start with `memory_context`. It routes by intent, applies multi-query RAG fusion and picks the best retrieval path for the query.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:168:        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3994:| `SPECKIT_MULTI_QUERY` | `true` | boolean | `lib/search/search-flags.ts` | Enables multi-query expansion for deep-mode retrieval. The query is expanded into up to 3 variants via `expandQuery()`, each variant runs hybrid search in parallel, and results merge with deduplication. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:5:// Rule-based synonym expansion for mode="deep" multi-query RAG.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:279:| `query-expander.ts`        | -      | TypeScript | Rule-based synonym expansion for mode="deep" multi-query RAG |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:375:      "query": "how does multi-query expansion work in deep mode retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:381:      "notes": "From T007b §1 step 3: multi-query expansion is specific to deep mode — cross-document query."
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:454:  it('aggregates multi-query sensitivity per query instead of cross-query fusion', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:29:  'SPECKIT_MULTI_QUERY',
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:81:    process.env.SPECKIT_MULTI_QUERY = 'false';
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:97:    process.env.SPECKIT_MULTI_QUERY = 'true';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:41: * Default: TRUE (enabled). Set SPECKIT_MULTI_QUERY=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:44:  return isFeatureEnabled('SPECKIT_MULTI_QUERY');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:244:    for (const flag of ['SPECKIT_MMR', 'SPECKIT_TRM', 'SPECKIT_MULTI_QUERY']) {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:257:      MULTI_QUERY: process.env['SPECKIT_MULTI_QUERY'],
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:263:      delete process.env['SPECKIT_MULTI_QUERY'];
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:271:      if (saved.MULTI_QUERY === undefined) delete process.env['SPECKIT_MULTI_QUERY']; else process.env['SPECKIT_MULTI_QUERY'] = saved.MULTI_QUERY;
tool cocoindex_code.search({"query":"multi-query expansion feature flag query variants stage1 candidate generation search","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"multi-query expansion feature flag query variants stage1 candidate generation search","limit":5,"refresh_index":false}) success in 254ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| NEW-038 | [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md) | Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion | Expanded query variants + dedup count + simple-query skip confirmation | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output | Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection |\",\n      \"start_line\": 346,\n      \"end_line\": 346,\n      \"score\": 0.6283989330638757\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/manual_testing_playbook.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| NEW-038 | [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md) | Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion | Expanded query variants + dedup count + simple-query skip confirmation | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output | Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection |\",\n      \"start_line\": 346,\n      \"end_line\": 346,\n      \"score\": 0.6283988816792032\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X04.md\",\n      \"language\": \"markdown\",\n      \"content\": \".opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:277:Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as \\\"simple\\\", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.\",\n      \"start_line\": 310,\n      \"end_line\": 310,\n      \"score\": 0.6019938936349529\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D2-query.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- Intent classifier routes queries to 7 classes: understand, fix_bug, add_feature, find_decision, recover_context, review_code, general\\n- Complexity router (R15) classifies queries as simple/moderate/complex and adjusts channel selection\\n- Query expansion via embedding-based term mining: generates additional search terms by finding semantically similar tokens\\n- Multi-query expansion: generates multiple query variants (feature-flagged)\\n- Query tokenization via `sanitizeQueryTokens()` for BM25 channel\\n- No query decomposition for multi-faceted questions\\n- No HyDE (Hypothetical Document Embeddings)\\n- No LLM-assisted reformulation\\n- No chain-of-thought query analysis\\n\\n**Stage 1 — Candidate Generation:**\",\n      \"start_line\": 10,\n      \"end_line\": 20,\n      \"score\": 0.596344835674671\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/iteration-012.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Rule-Based Query Expansion (query-expander.ts, 96 LOC)\\n\\n4. **Expansion is rule-based synonym substitution with a hardcoded 27-entry vocabulary map.** No LLM calls. For each query word matching a key in `DOMAIN_VOCABULARY_MAP`, one synonym is substituted to create a variant. Maximum 3 variants total (original + 2 expansions). The map covers 5 domains: auth (4 entries), error (4), architecture (4), code (3), memory system (12).\\n   [SOURCE: mcp_server/lib/search/query-expander.ts:12, 23-56, 73-95]\\n\\n5. **Expansion is used ONLY in deep mode (`mode === 'deep'`).** `expandQuery()` is called exclusively via `buildDeepQueryVariants()` in stage1-candidate-gen.ts, which only runs when `mode === 'deep' && isMultiQueryEnabled()`. Standard (non-deep) hybrid searches never use rule-based expansion.\\n   [SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:272-275]\",\n      \"start_line\": 19,\n      \"end_line\": 25,\n      \"score\": 0.5809545529291977\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md",
        "language": "markdown",
        "content": "| NEW-038 | [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md) | Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion | Expanded query variants + dedup count + simple-query skip confirmation | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output | Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection |",
        "start_line": 346,
        "end_line": 346,
        "score": 0.6283989330638757
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/manual_testing_playbook.md",
exec
/bin/zsh -lc "sed -n '70,110p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
| `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | `lib/search/search-flags.ts` | Enables the broader Stage 2 graph-signal surface. When active, graph momentum and causal-depth scoring remain available and the graph-walk rollout flag can graduate from `off` to `trace_only` or `bounded_runtime`. |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | inherited from `SPECKIT_GRAPH_SIGNALS` | enum (`off`, `trace_only`, `bounded_runtime`) | `lib/search/search-flags.ts` | Controls the bounded graph-walk ladder. `off` disables the walk bonus, `trace_only` keeps rollout state and diagnostics visible with zero applied bonus, and `bounded_runtime` applies the capped Stage 2 graph-walk bonus while preserving deterministic ordering protections. |
| `SPECKIT_GRAPH_UNIFIED` | `true` | boolean | `lib/search/graph-flags.ts` | Unified graph channel gate. Legacy compatibility shim that controls whether the graph search channel participates in hybrid retrieval. Disabled with explicit `'false'`. |
| `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | `lib/config/capability-flags.ts` | Legacy compatibility alias for the memory-roadmap phase label. Supported values are `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, and `shared-rollout`; Unsupported values fall back to `shared-rollout`. |
| `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the lineage roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap snapshots and rename-window compatibility paths. |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the unified-graph roadmap flag. Roadmap metadata is default-on unless explicitly opted out. It remains intentionally separate from the runtime `SPECKIT_GRAPH_UNIFIED` retrieval gate so roadmap snapshots cannot misreport graph-channel runtime state. |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the adaptive-ranking roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap metadata snapshots and adaptive shadow-ranking compatibility paths. |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the scope-enforcement roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap metadata and governed-scope compatibility paths. |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the governance-guardrail roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap metadata and governed-ingest compatibility paths. |
| `SPECKIT_HYDRA_SHARED_MEMORY` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the shared-memory roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. This snapshot flag is distinct from live shared-memory access controls, which still require explicit enablement at runtime. |
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | `handlers/memory-index-discovery.ts` | Controls whether `memory_index_scan` indexes spec folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`). Set to `'false'` to skip spec docs. |
| `SPECKIT_INTERFERENCE_SCORE` | `true` | boolean | `lib/scoring/interference-scoring.ts` | Enables interference-based penalty scoring in composite scoring. When disabled (set to `'false'`), the interference computation is bypassed and the raw score passes through unchanged. |
| `SPECKIT_LAZY_LOADING` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. Lazy provider initialization is now the permanent default, and both `SPECKIT_LAZY_LOADING` and `SPECKIT_EAGER_WARMUP` are documented compatibility no-ops. |
| `SPECKIT_LEARN_FROM_SELECTION` | `true` | boolean | `lib/search/learned-feedback.ts` | **Default ON (graduated).** Set to `'false'` to disable R11 learned relevance feedback. Records user result selections into `learned_triggers`, and applies boosts after a 1-week shadow period where terms are logged but not applied. |
| `SPECKIT_MEMORY_SUMMARIES` | `true` | boolean | `lib/search/search-flags.ts` | R8 TF-IDF extractive summary generation. At index time, generates a top-3-sentence extractive summary for each memory and joins those sentences into summary text. Summaries serve as a lightweight search channel for fallback matching. |
| `SPECKIT_MMR` | `true` | boolean | `lib/search/search-flags.ts` | Enables Maximal Marginal Relevance reranking after fusion to promote result diversity. Uses intent-specific lambda values from `INTENT_LAMBDA_MAP` (default 0.7). Requires embeddings to be loaded from `vec_memories` for top-N candidates. |
| `SPECKIT_MULTI_QUERY` | `true` | boolean | `lib/search/search-flags.ts` | Enables multi-query expansion for deep-mode retrieval. The query is expanded into up to 3 variants via `expandQuery()`, each variant runs hybrid search in parallel, and results merge with deduplication. |
| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | `lib/search/search-flags.ts` | T002b/A4 negative-feedback confidence demotion. Applies a confidence multiplier (starts at 1.0, decreases 0.1 per negative validation, floors at 0.3) with 30-day half-life recovery. |
| `SPECKIT_NOVELTY_BOOST` | inert | boolean | `lib/scoring/composite-scoring.ts` | **Inert.** N4 cold-start novelty boost was evaluated and removed. The env var is read in tests only; the production function always returns 0. |
| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Query Expander
// ───────────────────────────────────────────────────────────────
// Feature catalog: Query expansion
// Rule-based synonym expansion for mode="deep" multi-query RAG.
// No LLM calls — purely rule-based template substitution.

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
const MAX_VARIANTS = 3;

/** Escape special regex characters in user input to prevent ReDoS (P1-6). */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Domain vocabulary map for server-side synonym expansion.
exec
/bin/zsh -lc "sed -n '250,320p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    }

    channelCount = 1;
    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
      minSimilarity: MULTI_CONCEPT_MIN_SIMILARITY,
      limit,
      specFolder,
      includeArchived,
    }) as PipelineRow[];
  }

  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------

  else if (searchType === 'hybrid') {
    // Resolve the query embedding — either pre-computed in config or generate now
    // Fix #16 — Cache this embedding for reuse in constitutional injection path
    // To avoid a duplicate generateQueryEmbedding() call.
    const effectiveEmbedding: Float32Array | number[] | null =
      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
    cachedEmbedding = effectiveEmbedding;
codex
I’ve confirmed the current “multi-query” path is actually a lightweight deep-mode synonym variant fan-out, which matters because it means HyDE or decomposition would be a new class of query intelligence, not just an incremental tweak to the existing expander.
🌐 Searching the web...
🌐 Searched: HyDE hypothetical document embeddings paper Gao 2022 arXiv
🌐 Searching the web...
🌐 Searched: ACL Anthology self-ask compositional questions 2022 press query decomposition
🌐 Searching the web...
🌐 Searched: arXiv self-ask compositional questions 2022
🌐 Searching the web...
🌐 Searched: site:arxiv.org 2311.08526 GLiNER
🌐 Searching the web...
🌐 Searched: self-ask compositional questions with search official paper
🌐 Searching the web...
🌐 Searched: https://aclanthology.org/2023.emnlp-main.585/
🌐 Searching the web...
🌐 Searched: 'Step-Back Prompting' in https://deepmind.google/research/publications/step-back-prompting-enables-reasoning-via-abstraction-in-large-language-models/
🌐 Searching the web...
🌐 Searched: HyDE retrieval augmented generation query expansion pseudo-document enterprise documents paper
codex
I’m in the synthesis stretch now. The remaining work is mostly about turning the literature into concrete rollout advice: what belongs on the fast path, what should be deep-mode only, and what can be precomputed at save/index time.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '260,330p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	
   261	  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
   262	
   263	  else if (searchType === 'hybrid') {
   264	    // Resolve the query embedding — either pre-computed in config or generate now
   265	    // Fix #16 — Cache this embedding for reuse in constitutional injection path
   266	    // To avoid a duplicate generateQueryEmbedding() call.
   267	    const effectiveEmbedding: Float32Array | number[] | null =
   268	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   269	    cachedEmbedding = effectiveEmbedding;
   270	
   271	    if (!effectiveEmbedding) {
   272	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
   273	    }
   274	
   275	    // Deep mode: expand query into variants and run hybrid for each, then dedup
   276	    if (mode === 'deep' && isMultiQueryEnabled()) {
   277	      const queryVariants = await buildDeepQueryVariants(query);
   278	
   279	      if (queryVariants.length > 1) {
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Query Expander
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Query expansion
     5	// Rule-based synonym expansion for mode="deep" multi-query RAG.
     6	// No LLM calls — purely rule-based template substitution.
     7	
     8	// ───────────────────────────────────────────────────────────────
     9	// 1. CONSTANTS
    10	
    11	// ───────────────────────────────────────────────────────────────
    12	const MAX_VARIANTS = 3;
    13	
    14	/** Escape special regex characters in user input to prevent ReDoS (P1-6). */
    15	function escapeRegExp(str: string): string {
    16	  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    17	}
    18	
    19	/**
    20	 * Domain vocabulary map for server-side synonym expansion.
exec
/bin/zsh -lc "rg -n \"DEEP_EXPANSION_TIMEOUT_MS|withTimeout\\(|buildDeepQueryVariants|mode === 'deep'\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
58:const DEEP_EXPANSION_TIMEOUT_MS = 5000;
164:async function buildDeepQueryVariants(query: string): Promise<string[]> {
175:      `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
276:    if (mode === 'deep' && isMultiQueryEnabled()) {
277:      const queryVariants = await buildDeepQueryVariants(query);
282:          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
283:          const variantResultSets: PipelineRow[][] = await withTimeout(
296:            DEEP_EXPANSION_TIMEOUT_MS,
694:        deepExpansion: mode === 'deep' && isMultiQueryEnabled(),
723:  buildDeepQueryVariants,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Query complexity router"
     3	description: "The query complexity router classifies incoming queries by term count and trigger match to select how many search channels run."
     4	---
     5	
     6	# Query complexity router
     7	
     8	## 1. OVERVIEW
     9	
    10	The query complexity router classifies incoming queries by term count and trigger match to select how many search channels run.
    11	
    12	Not every question needs the same amount of effort to answer. This feature sizes up your question first, like a triage nurse, and routes simple lookups through a fast path while sending complex research questions through a deeper search. Without it, every question would get the full heavy-duty treatment, wasting time and resources on things that could be answered in seconds.
    13	
    14	---
    15	
    16	## 2. CURRENT REALITY
    17	
    18	Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.
    19	
    20	The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers. Tier classification is driven exclusively by `termCount` and `triggerMatch`. `charCount` and `stopWordRatio` are informational features that influence confidence scoring only (see `determineConfidence()`). Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.
 succeeded in 0ms:
     1	---
     2	title: "Query expansion"
     3	description: "Query expansion broadens retrieval for complex queries by mining related terms from the vector index and appending them to the original query."
     4	---
     5	
     6	# Query expansion
     7	
     8	## 1. OVERVIEW
     9	
    10	Query expansion broadens retrieval for complex queries by mining related terms from the vector index and appending them to the original query.
    11	
    12	Sometimes the words you use in a question do not match the words stored in the system, even though they mean the same thing. This feature automatically adds related terms to your search so you find relevant results even when the exact wording differs. It only kicks in for complex questions because simple lookups do not benefit from the extra breadth.
    13	
    14	---
    15	
    16	## 2. CURRENT REALITY
    17	
    18	Embedding-based query expansion broadens retrieval for complex queries by mining similar memories from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.
    19	
    20	When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).
exec
/bin/zsh -lc 'rg -n "embedding expansion|expanded-query|baseline and expanded|SPECKIT_EMBEDDING_EXPANSION|expand.*query" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts .opencode/skill/system-spec-kit/mcp_server/lib/search' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:39:import { expandQuery } from '../query-expander';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:166:    const expanded = expandQuery(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:275:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:338:      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:341:      // We expand the query using embedding similarity to find related terms
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:342:      // From the memory index. The expanded query is used as an additional
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:360:          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:365:          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:366:            // Run the baseline and the expanded query in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:411:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:603:  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:73:export function expandQuery(query: string): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:84:        const expanded = query.replace(new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i'), synonym);
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:14:// Controlled by SPECKIT_EMBEDDING_EXPANSION (default: ON, graduated).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:55:   * Maximum number of expanded terms to append to the combined query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:160: *   1. `SPECKIT_EMBEDDING_EXPANSION` flag is off (default).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:171: *   d. Append the top expanded terms to the original query → `combinedQuery`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:258:    const expanded = extractTermsFromContents(contents, queryTokens, maxTerms);
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:265:    // Append the top expanded terms to the original query.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '332,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '156,188p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   156	 * additional variants are produced by `expandQuery`. If expansion fails or produces
   157	 * no new terms, the array contains only the original query.
   158	 *
   159	 * Duplicates are eliminated via `Set` deduplication before slicing.
   160	 *
   161	 * @param query - The original search query string.
   162	 * @returns Array of distinct query variants, original first, capped at MAX_DEEP_QUERY_VARIANTS.
   163	 */
   164	async function buildDeepQueryVariants(query: string): Promise<string[]> {
   165	  try {
   166	    const expanded = expandQuery(query);
   167	    const variants = new Set<string>(expanded);
   168	    // ExpandQuery already includes the original as the first entry,
   169	    // But be explicit in case the implementation changes.
   170	    variants.add(query);
   171	    return Array.from(variants).slice(0, MAX_DEEP_QUERY_VARIANTS);
   172	  } catch (err: unknown) {
   173	    const msg = err instanceof Error ? err.message : String(err);
   174	    console.warn(
   175	      `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
 succeeded in 0ms:
   332	          query,
   333	          effectiveEmbedding,
   334	          { limit, specFolder, includeArchived }
   335	        )) as PipelineRow[];
   336	      }
   337	    } else {
   338	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
   339	      //
   340	      // When R12 is enabled and R15 does not classify the query as "simple",
   341	      // We expand the query using embedding similarity to find related terms
   342	      // From the memory index. The expanded query is used as an additional
   343	      // Hybrid search channel whose results are merged with the baseline.
   344	      //
   345	      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
   346	      // The query as "simple", suppressing expansion with zero added latency.
   347	
   348	      let r12ExpansionApplied = false;
   349	
   350	      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
   351	        try {
🌐 Searching the web...
🌐 Searched: ACL Anthology query2doc Query Expansion with Large Language Models
🌐 Searching the web...
🌐 Searched: arXiv question decomposition retrieval augmented generation 2507.00355
🌐 Searching the web...
🌐 Searched: site:arxiv.org 2507.00355 question decomposition retrieval augmented generation
🌐 Searching the web...
🌐 Searched: https://arxiv.org/abs/2212.10496
🌐 Searching the web...
🌐 Searched: https://arxiv.org/abs/2310.06117
🌐 Searching the web...
🌐 Searched: https://aclanthology.org/2023.emnlp-main.585/
🌐 Searching the web...
🌐 Searched: https://aclanthology.org/2025.naacl-long.216/
🌐 Searching the web...
🌐 Searched: site:arxiv.org GLiNER generalist model named entity recognition using bidirectional transformer
🌐 Searching the web...
🌐 Searched: arXiv Generative Multi-hop Retrieval 2022
codex
I’m tying the query-side research back into the graph path now. There’s a useful split emerging: use concept extraction to decide when graph should participate, and use decomposition/reformulation to improve candidate generation only when the query actually needs it.
exec
/bin/zsh -lc "rg -n \"graph signals|graph channel|SPECKIT_GRAPH_SIGNALS|causal\" .opencode/skill/system-spec-kit/feature_catalog/01--retrieval .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference .opencode/skill/system-spec-kit/mcp_server/lib/search | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:258: * Return current graph channel metrics for health check reporting.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:270:/** Reset all graph channel metrics counters to zero. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:284: * @param graphFn - Optional graph search function for causal/structural retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:721:        // Non-critical — graph channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:725:    // Degree channel re-ranks based on causal-edge connectivity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:57:function capCombinedBoost(sessionBoost: number, causalBoost: number = 0): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:59:  const boundedCausal = Math.max(0, causalBoost);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:64:function calculateSessionBoost(attentionScore: number, causalBoost: number = 0): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:70:  return capCombinedBoost(rawBoost, causalBoost);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:14: * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:5:// Graph-traversal score boosting via causal edge relationships.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:6:// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:14:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:16:/** Combined causal + session boost ceiling to prevent runaway amplification. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:24: * C138-P2: Relation-type weight multipliers for causal edge traversal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:29: * causal-edges.ts. causal-edges weights are applied during chain traversal
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:30: * scoring (getCausalChain), while these are applied during the causal-boost
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:33: *   - causal-edges: traversal strength propagation (range 0.8–1.5)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:34: *   - causal-boost: search result boost amplitude (range 0.8–1.5)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:54:  causalBoost?: number;
tool cocoindex_code.search({"query":"graph signals routing query concept detection causal edges graph channel when query mentions concept","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"graph signals routing query concept detection causal edges graph channel when query mentions concept","limit":5,"refresh_index":false}) success in 317ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 11. USER STORIES\\n\\n### US-001: Graph Channel Contribution (Priority: P0)\\n\\n**As an** AI agent consuming memory context, **I want** the graph channel to contribute structural relationship signals to search results, **so that** memories connected by causal, derivation, or contradiction edges surface alongside content-similar results.\\n\\n**Acceptance Criteria**:\\n1. Given a query about a topic with causal edges, When searching, Then graph channel results appear in `channelAttribution`\\n2. Given the R4 degree channel is enabled, When searching, Then well-connected memories receive measurable ranking boost\",\n      \"start_line\": 691,\n      \"end_line\": 699,\n      \"score\": 0.633797132923263\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 3. TEST EXECUTION\\n\\n| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |\\n|---|---|---|---|---|---|---|---|---|\\n| NEW-001 | Graph channel ID fix (G1) | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data. Capture the evidence needed to prove Graph channel returns >0 hits; channel attribution includes graph source. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create linked memories 2) Run graph-capable query 3) Verify graph hits | Graph channel returns >0 hits; channel attribution includes graph source\",\n      \"start_line\": 25,\n      \"end_line\": 29,\n      \"score\": 0.602114122218488\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 3. TEST EXECUTION\\n\\n| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |\\n|---|---|---|---|---|---|---|---|---|\\n| NEW-001 | Graph channel ID fix (G1) | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data. Capture the evidence needed to prove Graph channel returns >0 hits; channel attribution includes graph source. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create linked memories 2) Run graph-capable query 3) Verify graph hits | Graph channel returns >0 hits; channel attribution includes graph source\",\n      \"start_line\": 25,\n      \"end_line\": 29,\n      \"score\": 0.602114122218488\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| Feature ID | Feature Name | Scenario + Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |\\n|---|---|---|---|---|---|---|---|---|\\n| NEW-001 | Graph channel ID fix (G1) | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data.` | 1) Create linked memories 2) Run graph-capable query 3) Verify graph hits | Graph channel returns >0 hits; channel attribution includes graph source | Command transcript + search output showing graph channel contribution count | PASS: Graph channel contributes >=1 hit when causal edges exist; FAIL: Graph hits = 0 despite valid edges | Verify causal edges exist via `memory_causal_stats()` → Check graph channel ID matches schema → Inspect channel activation flags |\",\n      \"start_line\": 95,\n      \"end_line\": 97,\n      \"score\": 0.5966657272374061\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/manual_testing_playbook.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| Feature ID | Feature Name | Scenario + Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |\\n|---|---|---|---|---|---|---|---|---|\\n| NEW-001 | Graph channel ID fix (G1) | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data.` | 1) Create linked memories 2) Run graph-capable query 3) Verify graph hits | Graph channel returns >0 hits; channel attribution includes graph source | Command transcript + search output showing graph channel contribution count | PASS: Graph channel contributes >=1 hit when causal edges exist; FAIL: Graph hits = 0 despite valid edges | Verify causal edges exist via `memory_causal_stats()` → Check graph channel ID matches schema → Inspect channel activation flags |\",\n      \"start_line\": 95,\n      \"end_line\": 97,\n      \"score\": 0.5966657272374061\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md",
        "language": "markdown",
        "content": "## 11. USER STORIES\n\n### US-001: Graph Channel Contribution (Priority: P0)\n\n**As an** AI agent consuming memory context, **I want** the graph channel to contribute structural relationship signals to search results, **so that** memories connected by causal, derivation, or contradiction edges surface alongside content-similar results.\n\n**Acceptance Criteria**:\n1. Given a query about a topic with causal edges, When searching, Then graph channel results appear in `channelAttribution`\n2. Given the R4 degree channel is enabled, When searching, Then well-connected memories receive measurable ranking boost",
        "start_line": 691,
        "end_line": 699,
        "score": 0.633797132923263
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md",
exec
/bin/zsh -lc "sed -n '32,66p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
|---|---|---|---|---|
| `SPECKIT_ABLATION` | `false` | boolean | `lib/eval/ablation-framework.ts` | Activates the ablation study framework. Must be explicitly set to `'true'` to run controlled channel ablations via MCP; when `false`, the handler rejects `eval_run_ablation` calls with a disabled-flag error. |
| `SPECKIT_ARCHIVAL` | `true` | boolean | `lib/cognitive/archival-manager.ts` | Enables the archival manager which promotes DORMANT memories to the ARCHIVED state based on access patterns. Disable to keep all memories in active tiers. |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | `lib/search/search-flags.ts` | Enables R10 automatic noun-phrase entity extraction at index time. Extracted entities feed the entity linking channel (S5). Requires `SPECKIT_ENTITY_LINKING` to create graph edges. |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | `handlers/memory-context.ts` | In resume mode, automatically injects working-memory context items as `systemPromptContext` into the response. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | `lib/search/channel-representation.ts` | Sprint 3 Stage C: ensures every contributing search channel has at least one result in the top-k window. Results with a score below 0.005 are excluded from promotion regardless. |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
| `SPECKIT_COACTIVATION` | `true` | boolean | `lib/cognitive/co-activation.ts` | Enables co-activation spreading in the hybrid search path and trigger-matcher cognitive pipeline. Top-5 results spread activation through the co-occurrence graph; related memories receive a boost scaled by `SPECKIT_COACTIVATION_STRENGTH`. |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | `lib/cognitive/co-activation.ts` | Configures the raw boost multiplier applied to co-activated memories in hot-path Stage 2 spreading. A separate fan-divisor helper exists in the co-activation module, but Stage 2 currently applies spread scores directly. |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | `'i'` | string | `configs/cognitive.ts` | Regex flags for the cognitive co-activation pattern matcher. Must match `/^[dgimsuvy]*$/`. Invalid flags cause a startup validation error. |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | `'\\b(memory\|context\|decision\|implementation\|bug)\\b'` | string | `configs/cognitive.ts` | Regex pattern used by the cognitive pipeline to detect co-activation-relevant content. Backreferences and nested quantifier groups are rejected for safety. Maximum length 256 characters. |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2c BFS connected-component detection with Louvain escalation for large graphs. Injects community co-members alongside Stage 2 fusion results. |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | boolean | `lib/search/query-classifier.ts` | Sprint 3 Stage A: routes queries to channel subsets based on complexity tier. Simple queries use vector + FTS only; moderate adds BM25; complex uses all five channels. When disabled, all channels run for every query. |
| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | `lib/search/confidence-truncation.ts` | Sprint 3 Stage D: trims the low-confidence tail from fused results. A consecutive score gap exceeding 2× the median gap triggers truncation. Always returns at least 3 results. |
| `SPECKIT_CONSOLIDATION` | `true` | boolean | `lib/search/search-flags.ts` | Enables the N3-lite consolidation engine which runs after every successful save. Scans for contradictions (>0.85 cosine similarity with negation conflicts), applies Hebbian strengthening (+0.05/cycle, 30-day decay), detects stale edges (>90 days unfetched) and enforces 20 edges per node. Runs weekly. |
| `SPECKIT_CONSUMPTION_LOG` | inert | boolean | `lib/telemetry/consumption-logger.ts` | **Deprecated.** Eval complete (Sprint 7 audit). Telemetry is baked into core. The env var is accepted but has no effect; the function always returns `false`. |
| `SPECKIT_CONTEXT_HEADERS` | `true` | boolean | `lib/search/hybrid-search.ts` | **IMPLEMENTED (Sprint 019).** P1-4: Contextual tree injection into returned chunks. When enabled, `injectContextualTree()` string-prepends hierarchical context headers (`[parent > child — description]`, max 100 chars) using PI-B3 cached spec folder descriptions. Token budget adjusted for header overhead (~12 tokens/result) before truncation (CHK-060). |
| `SPECKIT_CROSS_ENCODER` | `true` | boolean | `lib/search/search-flags.ts` | Enables cross-encoder reranking in Stage 3 of the 4-stage pipeline. When enabled, the reranker rescores candidates using a more expensive cross-attention model. Disabling falls back to vector-only ranking from fusion. |
| `SPECKIT_DASHBOARD_LIMIT` | `10000` | number | `lib/eval/reporting-dashboard.ts` | Maximum number of rows fetched for the reporting dashboard. Parsed as integer with NaN guard (`|| 10000`). Replaces a previously hardcoded limit of 1000. Added in Phase 018 (CR-P2-3). |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md | sed -n '16,28p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    16	## 2. CURRENT REALITY
    17	
    18	This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.
    19	
    20	The search path is the 4-stage pipeline architecture, which is the sole runtime path. The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), bounded graph-walk scoring behind the `SPECKIT_GRAPH_WALK_ROLLOUT` ladder (`off`, `trace_only`, `bounded_runtime`), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
    21	
    22	A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.
    23	
    24	The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
    25	
    26	When trace is enabled, result envelopes now expose richer bounded Markovian diagnostics without altering the non-trace contract: `trace.graphContribution` includes `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`, and requests forwarded from `memory_context` can also include `trace.sessionTransition`. Extended telemetry summarizes the same behavior through `transitionDiagnostics` and `graphWalkDiagnostics`.
    27	
    28	---
🌐 Searching the web...
🌐 Searched: "Query2doc" arXiv
🌐 Searching the web...
🌐 Searched: ACL Anthology Query Expansion by Prompting Large Language Models
🌐 Searching the web...
🌐 Searched: https://arxiv.org/abs/2212.10496
🌐 Searching the web...
🌐 Searched: https://arxiv.org/abs/2305.03653
codex
The evidence is in place. I’m writing the answer around a simple rollout principle: keep the current fast path intact for simple queries, and reserve decomposition or LLM reformulation for the subset of queries where the papers consistently show meaningful gains.
Plan update
  ✓ Load local context on current query pipeline, feature flags, and relevant retrieval docs
  ✓ Survey primary-source literature on HyDE, query2doc, step-back prompting, decomposition, and multi-facet handling
  → Synthesize gap analysis, prioritized recommendations, and cross-dimensional dependencies
🌐 Searching the web...
🌐 Searched: https://arxiv.org/abs/2507.00355
codex
**Executive Summary**
- The highest-leverage addition is bounded query decomposition for deep, multi-faceted questions; it fits your example query better than broader expansion alone.
- For this corpus shape, corpus-grounded reformulation is a better default than raw HyDE. Small structured markdown collections punish drift more than web-scale corpora do.
- Query-time graph routing should be driven by cheap concept extraction and alias matching, reusing your existing index-time entity pipeline rather than jumping straight to LLM extraction.
- Keep simple queries on the current fast path. Any LLM reformulation, decomposition, or HyDE should be deep-mode or low-confidence only.
- More intelligence should move to index/save time: aliases, surrogate questions, short decision summaries, and concept labels.

**State Of Art Survey**
- HyDE, [Gao et al., ACL 2023](https://arxiv.org/abs/2212.10496): generate a hypothetical document, embed that instead of the raw query, then retrieve neighbors. Strong zero-shot dense retrieval method; useful when the raw query embedding is weak or underspecified.
- `query2doc`, [Wang et al., EMNLP 2023](https://aclanthology.org/2023.emnlp-main.585/): generate pseudo-doc text and append it to the query; reported BM25 gains of 3%-15% on ad-hoc IR. Good for disambiguation, but adds generation latency and can drift from corpus language.
- LLM QE more broadly, [Jagerman et al., 2023](https://arxiv.org/abs/2305.03653): chain-of-thought-style prompting can produce stronger expansions than classic PRF for recall-oriented retrieval.
- Corpus-grounded QE, [Lei et al., EACL 2024](https://aclanthology.org/2024.eacl-short.34/): steers LLM expansion using initially retrieved corpus text, explicitly reducing hallucinated or outdated expansions.
- Step-back prompting, [Zheng et al., ICLR 2024](https://arxiv.org/abs/2310.06117): abstraction-first reformulation improves Knowledge QA and multi-hop reasoning. Best retrieval use is an abstract surrogate query, not a final answer.
- Decomposition foundations, [Press et al., 2023](https://arxiv.org/abs/2210.03350) and [Zhou et al., ICLR 2023](https://openreview.net/forum?id=WZH7099tgfM): break a hard question into simpler sub-questions, solve sequentially, and optionally retrieve evidence per step.
- RAG-specific decomposition, [Ammann et al., ACL SRW 2025](https://arxiv.org/abs/2507.00355): decompose into sub-questions, retrieve per sub-question, merge and rerank; reports strong multi-hop gains.
- Relational/graph-aware QE, [Xia et al., NAACL 2025](https://aclanthology.org/2025.naacl-long.216/): argues pure text expansion misses relational intent and benefits from KG-aware expansion.

**Gap Analysis**
- Your complexity router is still shallow-heuristic: `termCount` + `triggerMatch`, with no facet or relation awareness. See [01-query-complexity-router.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md#L16).
- Current expansion is corpus-mined term append, not semantic reformulation or decomposition. See [06-query-expansion.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md#L16).
- Deep multi-query today is only rule-based synonym fan-out, max 3 variants. See [query-expander.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts#L23) and [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L275).
- The pipeline already has index-time auto-entities/entity linking and graph signals, but not query-time concept routing. See [01-1-search-pipeline-features-speckit.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) and [02-semantic-and-lexical-search-memorysearch.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md#L20).
- There is no HyDE, no step-back abstraction layer, no facet-aware merge, and no low-cost detector for “X and how it relates to Y” style queries.

**Recommendations**
Expected gains below are engineering estimates for your corpus, not paper guarantees.

1. `SPECKIT_QUERY_DECOMPOSITION` — bounded facet detection + decomposition. Size: `M`. Rationale: best fit for multi-faceted decision/explanation queries. Expected recall lift: `+6% to +15%` on complex multi-facet queries. Latency: `+15-60ms` with heuristics only, `+250-600ms` with LLM fallback.
`TS sketch:` `if (deep && isMultiFacet(q)) { const facets = decompose(q).slice(0,3); const pools = await Promise.all([q, ...facets].map(runHybrid)); return mergeByFacetCoverage(pools); }`

2. `SPECKIT_GRAPH_CONCEPT_ROUTING` — query-time concept extraction and alias routing for graph. Size: `S/M`. Rationale: leverage existing entity/index work to detect concepts like “graph signals” and “scoring” before retrieval. Expected lift: `+3% to +8%` on graph-relevant queries, mostly via better channel activation and precision. Latency: `<5ms` rule-based, optional deep-mode LLM fallback only.
`TS sketch:` `const concepts = matchAliases(nounPhrases(q), conceptAliasTable); if (concepts.length) route.enableGraph(concepts);`

3. `SPECKIT_LLM_REFORMULATION` — corpus-grounded reformulation first, not raw HyDE. Size: `M`. Rationale: use cheap initial lexical/vector seeds plus titles/trigger phrases to ask the model for an abstract query and 2-3 corpus-aligned surrogates; this matches structured markdown better than free-form pseudo-answers. Expected lift: `+4% to +10%` on paraphrase, recover-context, and decision queries. Latency: `+250-550ms` uncached, near-zero cached.
`TS sketch:` `const seeds = await cheapSeedRetrieve(q); const reform = await llm.rewrite({q, seeds, mode:'step_back+corpus'}); return fanout([q, reform.abstract, ...reform.variants]);`

4. `SPECKIT_HYDE` — HyDE in shadow mode, then conditional production rollout. Size: `M`. Rationale: HyDE is promising for semantically weak queries, but for a small structured corpus it should only trigger when baseline confidence is low or semantic coverage is poor. Expected lift: `+2% to +6%` on hard semantic-mismatch queries; neutral or negative on short trigger queries. Latency: `+300-700ms` uncached.
`TS sketch:` `if (deep && lowConfidence(baseline)) { const pseudo = await llm.hyde(q, 'markdown-memory'); const emb = await embed(pseudo); return merge(baseline, await vectorOnly(emb)); }`
Inference: cache normalized query -> pseudo-doc + embedding for 1-7 days; do not precompute globally because HyDE is query-dependent.

5. `SPECKIT_QUERY_SURROGATES` — move more intelligence to index/save time. Size: `M/L`. Rationale: precompute alias tables, section headings, one-line decision summaries, and likely user questions per memory so query-time reformulation has local structured material to work from. Expected lift: `+3% to +7%` broad recall, plus lower future LLM call rate. Latency: neutral or better at query time; adds save/index work instead.
`TS sketch:` `onIndex(doc) => store({aliases, headings, summary, surrogateQuestions}); onQuery(q) => search(q + matchedSurrogates(q));`

**Risk Assessment**
- Latency: default-on HyDE or LLM reformulation will break sub-second `p95` for simple queries. Keep the current router’s fast path intact.
- API cost: decomposition + reformulation + HyDE can stack badly. Enforce a per-query intelligence budget, ideally max 1 LLM call for moderate and max 2 for deep/complex.
- Over-expansion: small corpora are especially vulnerable to drift. Always keep the original query as anchor and cap generated variants.
- Merge noise: decomposition can over-retrieve loosely related facets. Use facet coverage constraints plus existing reranking before final truncation.
- Evaluation risk: these features need shadow metrics by trigger type, not only aggregate recall, or you may hide regressions on the simple path.

**Cross-Dimensional Dependencies**
- `D1 Fusion`: decomposition and reformulation need facet/variant attribution in fusion; plain dedup union will underperform.
- `D3 Graph`: graph concept routing depends on alias/entity tables and should control when graph signals become first-class rather than always-on.
- `D4 Feedback`: use reformulation-win, decomposition-win, and HyDE-win telemetry to learn better triggers over time.
- `D5 UX`: deep mode should expose a concise trace like “split into 2 sub-queries” or “expanded with corpus concepts” so users understand latency and behavior changes.

**Sources**
- Local retrieval docs: [01-query-complexity-router.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md#L16), [06-query-expansion.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md#L16), [query-expander.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts#L23), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L275), [02-semantic-and-lexical-search-memorysearch.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md#L20)
- Papers: [HyDE](https://arxiv.org/abs/2212.10496), [query2doc](https://aclanthology.org/2023.emnlp-main.585/), [LLM QE prompting](https://arxiv.org/abs/2305.03653), [Corpus-Steered QE](https://aclanthology.org/2024.eacl-short.34/), [Step-Back Prompting](https://arxiv.org/abs/2310.06117), [Self-Ask](https://arxiv.org/abs/2210.03350), [Least-to-Most](https://openreview.net/forum?id=WZH7099tgfM), [Question Decomposition for RAG](https://arxiv.org/abs/2507.00355), [Knowledge-Aware QE](https://aclanthology.org/2025.naacl-long.216/)
tokens used
207,881
**Executive Summary**
- The highest-leverage addition is bounded query decomposition for deep, multi-faceted questions; it fits your example query better than broader expansion alone.
- For this corpus shape, corpus-grounded reformulation is a better default than raw HyDE. Small structured markdown collections punish drift more than web-scale corpora do.
- Query-time graph routing should be driven by cheap concept extraction and alias matching, reusing your existing index-time entity pipeline rather than jumping straight to LLM extraction.
- Keep simple queries on the current fast path. Any LLM reformulation, decomposition, or HyDE should be deep-mode or low-confidence only.
- More intelligence should move to index/save time: aliases, surrogate questions, short decision summaries, and concept labels.

**State Of Art Survey**
- HyDE, [Gao et al., ACL 2023](https://arxiv.org/abs/2212.10496): generate a hypothetical document, embed that instead of the raw query, then retrieve neighbors. Strong zero-shot dense retrieval method; useful when the raw query embedding is weak or underspecified.
- `query2doc`, [Wang et al., EMNLP 2023](https://aclanthology.org/2023.emnlp-main.585/): generate pseudo-doc text and append it to the query; reported BM25 gains of 3%-15% on ad-hoc IR. Good for disambiguation, but adds generation latency and can drift from corpus language.
- LLM QE more broadly, [Jagerman et al., 2023](https://arxiv.org/abs/2305.03653): chain-of-thought-style prompting can produce stronger expansions than classic PRF for recall-oriented retrieval.
- Corpus-grounded QE, [Lei et al., EACL 2024](https://aclanthology.org/2024.eacl-short.34/): steers LLM expansion using initially retrieved corpus text, explicitly reducing hallucinated or outdated expansions.
- Step-back prompting, [Zheng et al., ICLR 2024](https://arxiv.org/abs/2310.06117): abstraction-first reformulation improves Knowledge QA and multi-hop reasoning. Best retrieval use is an abstract surrogate query, not a final answer.
- Decomposition foundations, [Press et al., 2023](https://arxiv.org/abs/2210.03350) and [Zhou et al., ICLR 2023](https://openreview.net/forum?id=WZH7099tgfM): break a hard question into simpler sub-questions, solve sequentially, and optionally retrieve evidence per step.
- RAG-specific decomposition, [Ammann et al., ACL SRW 2025](https://arxiv.org/abs/2507.00355): decompose into sub-questions, retrieve per sub-question, merge and rerank; reports strong multi-hop gains.
- Relational/graph-aware QE, [Xia et al., NAACL 2025](https://aclanthology.org/2025.naacl-long.216/): argues pure text expansion misses relational intent and benefits from KG-aware expansion.

**Gap Analysis**
- Your complexity router is still shallow-heuristic: `termCount` + `triggerMatch`, with no facet or relation awareness. See [01-query-complexity-router.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md#L16).
- Current expansion is corpus-mined term append, not semantic reformulation or decomposition. See [06-query-expansion.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md#L16).
- Deep multi-query today is only rule-based synonym fan-out, max 3 variants. See [query-expander.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts#L23) and [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L275).
- The pipeline already has index-time auto-entities/entity linking and graph signals, but not query-time concept routing. See [01-1-search-pipeline-features-speckit.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) and [02-semantic-and-lexical-search-memorysearch.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md#L20).
- There is no HyDE, no step-back abstraction layer, no facet-aware merge, and no low-cost detector for “X and how it relates to Y” style queries.

**Recommendations**
Expected gains below are engineering estimates for your corpus, not paper guarantees.

1. `SPECKIT_QUERY_DECOMPOSITION` — bounded facet detection + decomposition. Size: `M`. Rationale: best fit for multi-faceted decision/explanation queries. Expected recall lift: `+6% to +15%` on complex multi-facet queries. Latency: `+15-60ms` with heuristics only, `+250-600ms` with LLM fallback.
`TS sketch:` `if (deep && isMultiFacet(q)) { const facets = decompose(q).slice(0,3); const pools = await Promise.all([q, ...facets].map(runHybrid)); return mergeByFacetCoverage(pools); }`

2. `SPECKIT_GRAPH_CONCEPT_ROUTING` — query-time concept extraction and alias routing for graph. Size: `S/M`. Rationale: leverage existing entity/index work to detect concepts like “graph signals” and “scoring” before retrieval. Expected lift: `+3% to +8%` on graph-relevant queries, mostly via better channel activation and precision. Latency: `<5ms` rule-based, optional deep-mode LLM fallback only.
`TS sketch:` `const concepts = matchAliases(nounPhrases(q), conceptAliasTable); if (concepts.length) route.enableGraph(concepts);`

3. `SPECKIT_LLM_REFORMULATION` — corpus-grounded reformulation first, not raw HyDE. Size: `M`. Rationale: use cheap initial lexical/vector seeds plus titles/trigger phrases to ask the model for an abstract query and 2-3 corpus-aligned surrogates; this matches structured markdown better than free-form pseudo-answers. Expected lift: `+4% to +10%` on paraphrase, recover-context, and decision queries. Latency: `+250-550ms` uncached, near-zero cached.
`TS sketch:` `const seeds = await cheapSeedRetrieve(q); const reform = await llm.rewrite({q, seeds, mode:'step_back+corpus'}); return fanout([q, reform.abstract, ...reform.variants]);`

4. `SPECKIT_HYDE` — HyDE in shadow mode, then conditional production rollout. Size: `M`. Rationale: HyDE is promising for semantically weak queries, but for a small structured corpus it should only trigger when baseline confidence is low or semantic coverage is poor. Expected lift: `+2% to +6%` on hard semantic-mismatch queries; neutral or negative on short trigger queries. Latency: `+300-700ms` uncached.
`TS sketch:` `if (deep && lowConfidence(baseline)) { const pseudo = await llm.hyde(q, 'markdown-memory'); const emb = await embed(pseudo); return merge(baseline, await vectorOnly(emb)); }`
Inference: cache normalized query -> pseudo-doc + embedding for 1-7 days; do not precompute globally because HyDE is query-dependent.

5. `SPECKIT_QUERY_SURROGATES` — move more intelligence to index/save time. Size: `M/L`. Rationale: precompute alias tables, section headings, one-line decision summaries, and likely user questions per memory so query-time reformulation has local structured material to work from. Expected lift: `+3% to +7%` broad recall, plus lower future LLM call rate. Latency: neutral or better at query time; adds save/index work instead.
`TS sketch:` `onIndex(doc) => store({aliases, headings, summary, surrogateQuestions}); onQuery(q) => search(q + matchedSurrogates(q));`

**Risk Assessment**
- Latency: default-on HyDE or LLM reformulation will break sub-second `p95` for simple queries. Keep the current router’s fast path intact.
- API cost: decomposition + reformulation + HyDE can stack badly. Enforce a per-query intelligence budget, ideally max 1 LLM call for moderate and max 2 for deep/complex.
- Over-expansion: small corpora are especially vulnerable to drift. Always keep the original query as anchor and cap generated variants.
- Merge noise: decomposition can over-retrieve loosely related facets. Use facet coverage constraints plus existing reranking before final truncation.
- Evaluation risk: these features need shadow metrics by trigger type, not only aggregate recall, or you may hide regressions on the simple path.

**Cross-Dimensional Dependencies**
- `D1 Fusion`: decomposition and reformulation need facet/variant attribution in fusion; plain dedup union will underperform.
- `D3 Graph`: graph concept routing depends on alias/entity tables and should control when graph signals become first-class rather than always-on.
- `D4 Feedback`: use reformulation-win, decomposition-win, and HyDE-win telemetry to learn better triggers over time.
- `D5 UX`: deep mode should expose a concise trace like “split into 2 sub-queries” or “expanded with corpus concepts” so users understand latency and behavior changes.

**Sources**
- Local retrieval docs: [01-query-complexity-router.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md#L16), [06-query-expansion.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md#L16), [query-expander.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts#L23), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L275), [02-semantic-and-lexical-search-memorysearch.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md#L20)
- Papers: [HyDE](https://arxiv.org/abs/2212.10496), [query2doc](https://aclanthology.org/2023.emnlp-main.585/), [LLM QE prompting](https://arxiv.org/abs/2305.03653), [Corpus-Steered QE](https://aclanthology.org/2024.eacl-short.34/), [Step-Back Prompting](https://arxiv.org/abs/2310.06117), [Self-Ask](https://arxiv.org/abs/2210.03350), [Least-to-Most](https://openreview.net/forum?id=WZH7099tgfM), [Question Decomposition for RAG](https://arxiv.org/abs/2507.00355), [Knowledge-Aware QE](https://aclanthology.org/2025.naacl-long.216/)
