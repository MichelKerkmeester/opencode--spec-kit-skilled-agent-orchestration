OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d114c-56e4-7d82-9a6f-bd4505df1e8e
--------
user
# Research Dimension D1: Advanced Fusion & Scoring Intelligence

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching a production Hybrid RAG Fusion system built in TypeScript with SQLite (better-sqlite3 + sqlite-vec + FTS5). The system retrieves from a corpus of hundreds to low thousands of structured markdown documents (spec-kit memories, not web pages).

**4-Stage Retrieval Pipeline:**
- **Stage 1 — Candidate Generation**: Executes 4 retrieval channels in parallel, then fuses via RRF
- **Stage 2 — Fusion & Scoring**: Single scoring point applying 12 signals (session boost, causal boost, co-activation, community co-retrieval, graph signals, FSRS write-back, intent weights, artifact routing, feedback signals, validation metadata)
- **Stage 3 — Reranking**: Optional cross-encoder, MMR diversity reranking
- **Stage 4 — Filtering**: Read-only (architectural invariant: no score changes). Quality threshold, tier limiting, chunk reassembly, context budget

**4 Retrieval Channels:**
1. Vector Search — sqlite-vec, 768-dim embeddings (Voyage 1024, OpenAI 1536 supported)
2. FTS5 Search — SQLite FTS5 with weighted BM25 (title=10x, triggers=5x, path=2x, content=1x)
3. BM25 Search — In-memory BM25 index with per-field weighting
4. Graph Search — Causal relationship traversal via `causal_edges` table

**Current Fusion:**
- Reciprocal Rank Fusion (RRF) with k=60 (Cormack et al., SIGIR 2009)
- `rrfScore = Σ 1/(k + rank_i)` per channel
- Convergence bonus: +0.10 flat when result appears in ≥2 channels
- Graph weight boost: 1.5x for curated causal edges
- Per-source min-max normalization before fusion
- Deterministic stable sort after fusion

**Adaptive Fusion (intent-aware):**
- Intent classifier routes to: understand, fix_bug, add_feature (+ others)
- Per-intent lambda mapping adjusts channel contributions (diversity vs relevance tradeoff)
- Applied as post-hybrid weight adjustment in Stage 2, not pre-fusion

**RSF (Relative Score Fusion):**
- Was implemented as shadow/eval mode — comparing RSF vs RRF scores
- Sprint 8 removed the runtime path entirely — RSF is now dead code
- RSF preserves score magnitude information that RRF discards

## Current Reality (Feature Catalog Excerpts)

- **RRF K-Value Sensitivity Analysis** (feature 11-08): Investigation planned but not yet executed. Default k=60 is empirical, not data-driven for this corpus.
- **Relative Score Fusion in Shadow Mode** (feature 12-02): Was shadow-mode evaluation. Runtime path removed in Sprint 8. No production data was collected comparing RSF vs RRF.
- **Scoring and Fusion Corrections** (feature 11-13): Applied corrections for double-counting, magnitude mismatch (was 15:1 between channels), and per-source normalization.
- **Adaptive Fusion** (implemented): Intent-aware weighting via `adaptive-fusion.ts`. 7 intent classes map to lambda values.

## Research Questions

1. **RRF vs RSF vs Learned Fusion**: Under what query conditions does RSF outperform RRF for structured document retrieval? Should RSF be resurrected from dead code? What is the state of art in learned fusion (Condorcet, neural fusion, score-distribution-aware fusion)?

2. **K-Value Optimization**: Is k=60 optimal for a 4-channel system with heterogeneous score distributions? How should k vary by channel count, corpus size, or query type? What does the literature say about adaptive k?

3. **Convergence Bonus Calibration**: The +0.10 flat bonus for multi-channel convergence is uncalibrated. Should it be proportional to the number of converging channels? Per-channel calibrated? What is the empirical evidence for convergence bonuses in hybrid search?

4. **Signal Weighting**: The 12 Stage 2 scoring signals appear to have static weights. Should they be learned? What feature importance analysis approaches work for retrieval scoring signals? How to prevent overfitting at small corpus scale?

5. **Graph Channel Integration**: The graph boost is 1.5x flat. How should graph channel weight scale with graph density, edge type quality, and query specificity? When should graph be promoted vs demoted?

6. **Per-Query Fusion Strategy Selection**: Can the intent router (7 classes) dynamically select not just channel weights but entire fusion strategies (RRF for some queries, RSF for others, weighted combination for others)?

## Constraints

- TypeScript/SQLite implementation (no external services except optional embedding API)
- ~15 feature flags available for experimentation and gradual rollout
- Corpus: hundreds to low thousands structured markdown documents
- Single developer implementation capacity — size recommendations as S (days), M (weeks), L (months)
- Must be backwards-compatible via feature flags
- Evidence-based: cite papers, benchmarks, or comparable systems for every recommendation

## Output Format

1. **Executive Summary** (3-5 bullet points of key findings)
2. **State of Art Survey** (what modern hybrid retrieval systems do for fusion — cite papers and systems)
3. **Gap Analysis** (current system vs state of art, with severity ratings)
4. **Recommendations** (priority-ordered, each with: description, rationale, effort size S/M/L, implementation sketch in TypeScript pseudocode, expected impact on MRR@5/NDCG@10/Recall@20, feature flag name)
5. **Risk Assessment** (what could go wrong with each recommendation)
6. **Cross-Dimensional Dependencies** (how fusion improvements connect to Query Intelligence D2, Graph Retrieval D3, Feedback Learning D4, and UX D5)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: cocoindex_code starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a deep research task on fusion and scoring strategy for the Hybrid RAG pipeline, so I’m first routing the request through the project’s skill workflow and checking what prior context or research tooling is available before I synthesize evidence.
tool codex.list_mcp_resources({})
tool codex.list_mcp_resource_templates({})
codex.list_mcp_resources({}) success in 4ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resources\":[]}"
    }
  ],
  "isError": false
}
codex.list_mcp_resource_templates({}) success in 4ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resourceTemplates\":[]}"
    }
  ],
  "isError": false
}
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Research Dimension D1: Advanced Fusion & Scoring Intelligence for a TypeScript/SQLite Hybrid RAG Fusion system; compare RRF vs RSF vs learned fusion, optimize k, convergence bonus calibration, signal weighting, graph channel integration, and per-query fusion strategy selection with evidence-based recommendations" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !convergence, convergence, per, research(name)"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.92,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !typescript, system, typescript"
  }
]
codex
SKILL ROUTING: `sk-deep-research` and `sk-code--opencode` both pass the threshold, so I’m using them in that order. I also checked for MCP-provided memory resources, but none are exposed in this session, so I’ll continue with the best available evidence path and keep that limitation explicit.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

exec
/bin/zsh -lc 'find .. -name AGENTS.md -print' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 2.00s:
../Barter/coder/AGENTS.md
../Public/.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
../Public/AGENTS.md
codex
I’ve confirmed the research skill path and am now grounding the write-up in the actual codebase so the recommendations fit the current implementation instead of staying generic. Next I’m locating the fusion modules, existing flags, and any evaluation hooks around `RRF`, adaptive fusion, and graph boosts.
tool cocoindex_code.search({"query":"RRF reciprocal rank fusion adaptive fusion hybrid retrieval graph boost convergence bonus RSF relative score fusion in TypeScript retrieval pipeline","languages":"typescript","paths":["**/*.ts"],"limit":8,"refresh_index":true})
cocoindex_code.search({"query":"RRF reciprocal rank fusion adaptive fusion hybrid retrieval graph boost convergence bonus RSF relative score fusion in TypeScript retrieval pipeline","languages":"typescript","paths":["**/*.ts"],"limit":8,"refresh_index":true}) failed in 7ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
exec
/bin/zsh -lc 'rg -n "RRF|RSF|adaptive[- ]fusion|reciprocal rank|convergence bonus|graph boost|causal_edges|rrfScore|adaptive-fusion|fusion" .' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 97ms:
./.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:32:    testDb.exec('DELETE FROM causal_edges');
./.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:38:    // Create causal_edges table matching production schema (+created_by, +last_accessed)
./.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:40:      CREATE TABLE IF NOT EXISTS causal_edges (
./.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:60:        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
./.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:856:      FROM causal_edges
./.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:860:      FROM causal_edges
./.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:45:      file_path: '/workspace/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-sprint-9-extra-features/memory/context.md',
./.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:50:      ['022-hybrid-rag-fusion/019-sprint-9-extra-features', 'Description'],
./.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:302:- Purpose: Owns the retrieval engine: candidate generation, vector/lexical channels, fusion, reranking, query intelligence, graph-aware retrieval, and schema/index helpers needed by the search path. This is the highest-churn and broadest domain module in `lib/`.
./.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:28:    env: 'SPECKIT_RRF',
./.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:29:    source: 'shared/algorithms/rrf-fusion.ts',
./.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:72:    addTraceEntry(trace, 'fusion', 30, 25, 8);
./.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:110:      'candidate', 'filter', 'fusion', 'rerank', 'fallback', 'final-rank',
./.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:146:      'embedding_timeout', 'bm25_only', 0.6, 'delayed', ['fusion']
./.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:189:      ['fusion', 'rerank', 'final-rank']
./.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:193:    expect(contract.degradedStages).toContain('fusion');
./.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:225:      'fusion',
./.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:14:} from '@spec-kit/shared/algorithms/adaptive-fusion';
./.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:15:import type { FusionWeights, DegradedModeContract, AdaptiveFusionResult } from '@spec-kit/shared/algorithms/adaptive-fusion';
./.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:16:import type { RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';
codex
I found the active project documentation for hybrid fusion under the `022-hybrid-rag-fusion` spec tree, plus live code references in the memory engine. I’m narrowing the search now so I can separate historical notes from the actual runtime behavior and then map that against the literature.
tool cocoindex_code.search({"query":"reciprocal rank fusion implementation adaptive-fusion relative score fusion graph channel boost convergence bonus retrieval telemetry hybrid rag","languages":["typescript"],"paths":[".opencode/**/*.ts","src/**/*.ts","**/*.ts"],"limit":10,"refresh_index":true})
cocoindex_code.search({"query":"reciprocal rank fusion implementation adaptive-fusion relative score fusion graph channel boost convergence bonus retrieval telemetry hybrid rag","languages":["typescript"],"paths":[".opencode/**/*.ts","src/**/*.ts","**/*.ts"],"limit":10,"refresh_index":true}) success in 3.27s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/shared/algorithms/rrf-fusion.d.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */\\ninterface FusionResult extends RrfItem {\\n    /**\\n     * Reciprocal Rank Fusion score. Combines rankings from multiple retrieval\\n     * methods using the formula `1/(k + rank)`. Higher values indicate the\\n     * result was ranked highly by more methods. Includes convergence bonus\\n     * when a result appears in multiple ranked lists.\\n     */\\n    rrfScore: number;\\n    sources: string[];\\n    sourceScores: Record<string, number>;\\n    convergenceBonus: number;\\n}\\n/** A ranked result list from a single retrieval source (e.g., vector, BM25, graph). */\\ninterface RankedList {\\n    source: string;\\n    results: RrfItem[];\\n    weight?: number;\\n}\\n/** Configuration options for multi-list RRF fusion. */\\ninterface FuseMultiOptions {\\n    k?: number;\\n    convergenceBonus?: number;\\n    graphWeightBoost?: number;\\n}\\n/** Configuration options for advanced score fusion with term matching. */\",\n      \"start_line\": 32,\n      \"end_line\": 57,\n      \"score\": 0.5354337158016094\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/shared/algorithms/adaptive-fusion.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback\\n\\n\\n/* --- 1. INTERFACES --- */\\n\\n/** Represents fusion weights. */\\nexport interface FusionWeights {\\n  /** Weight for semantic/vector search results (0-1) */\\n  semanticWeight: number;\\n  /** Weight for keyword/lexical search results (0-1) */\\n  keywordWeight: number;\\n  /** Weight for recency-based scoring (0-1) */\\n  recencyWeight: number;\\n  /** Weight for graph channel results (0-1). Only used when graph channel active. */\\n  graphWeight?: number;\\n  /** Bias toward causal-edge signals within graph-assisted ranking (0-1). */\\n  graphCausalBias?: number;\\n}\\n\\n/** Represents degraded mode contract. */\",\n      \"start_line\": 11,\n      \"end_line\": 30,\n      \"score\": 0.5332204927150244\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/shared/algorithms/adaptive-fusion.d.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"import type { RrfItem, FusionResult } from './rrf-fusion';\\n/** Represents fusion weights. */\\nexport interface FusionWeights {\\n    /** Weight for semantic/vector search results (0-1) */\\n    semanticWeight: number;\\n    /** Weight for keyword/lexical search results (0-1) */\\n    keywordWeight: number;\\n    /** Weight for recency-based scoring (0-1) */\\n    recencyWeight: number;\\n    /** Weight for graph channel results (0-1). Only used when graph channel active. */\\n    graphWeight?: number;\\n    /** Bias toward causal-edge signals within graph-assisted ranking (0-1). */\\n    graphCausalBias?: number;\\n}\\n/** Represents degraded mode contract. */\",\n      \"start_line\": 1,\n      \"end_line\": 15,\n      \"score\": 0.5174868105951571\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/shared/algorithms/rrf-fusion.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */\\ninterface FusionResult extends RrfItem {\\n  /**\\n   * Reciprocal Rank Fusion score. Combines rankings from multiple retrieval\\n   * methods using the formula `1/(k + rank)`. Higher values indicate the\\n   * result was ranked highly by more methods. Includes convergence bonus\\n   * when a result appears in multiple ranked lists.\\n   */\\n  rrfScore: number;\\n  sources: string[];\\n  sourceScores: Record<string, number>;\\n  convergenceBonus: number;\\n}\\n\\n/** A ranked result list from a single retrieval source (e.g., vector, BM25, graph). */\\ninterface RankedList {\\n  source: string;\\n  results: RrfItem[];\\n  weight?: number;\\n}\",\n      \"start_line\": 53,\n      \"end_line\": 72,\n      \"score\": 0.5126769273136897\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/shared/algorithms/rrf-fusion.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"const SOURCE_TYPES = {\\n  VECTOR: 'vector',\\n  FTS: 'fts',\\n  BM25: 'bm25',\\n  GRAPH: 'graph',\\n  DEGREE: 'degree',\\n  KEYWORD: 'keyword',\\n} as const;\\n\\n/**\\n * Default RRF smoothing constant used in the reciprocal rank term `1 / (k + rank)`.\\n *\\n * Origin: Cormack, Clarke, and Buettcher (SIGIR 2009), where Reciprocal Rank\\n * Fusion is introduced with `k = 60` as a robust default for rank aggregation.\\n *\\n * Behavior:\\n * - Lower `k` increases sensitivity to early ranks (top results dominate more).\\n * - Higher `k` flattens rank-position impact (more conservative, less top-heavy).\\n *\\n * Valid range:\\n * - Explicit `k` values must be finite and non-negative.\\n * - Runtime override `SPECKIT_RRF_K` is accepted only when parseable as a\\n *   finite positive number (`> 0`).\\n */\\nconst DEFAULT_K = 60;\\nconst CONVERGENCE_BONUS = 0.10;\\n// AI-WHY: Graph channel gets 1.5x boost when no explicit weight is supplied because\\n// graph edges encode curated human decisions (causal links) that are high-signal.\",\n      \"start_line\": 12,\n      \"end_line\": 39,\n      \"score\": 0.5099912957074366\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"  // Step 4: Compute metrics for each K\\n  const results: Record<number, KValueMetrics> = {};\\n  const allIds = new Set<number | string>();\\n\\n  for (const k of K_VALUES) {\\n    const fused = fusedByK.get(k) ?? [];\\n    const ranking = rankingsByK.get(k) ?? [];\\n\\n    for (const id of ranking) allIds.add(id);\\n\\n    const avgScore = fused.length > 0\\n      ? fused.reduce((sum, r) => sum + r.rrfScore, 0) / fused.length\\n      : 0;\\n\\n    results[k] = {\\n      mrr5: mrr5(baselineRanking, ranking),\\n      kendallTau: kendallTau(baselineRanking, ranking),\\n      avgScore,\\n    };\\n  }\\n\\n  return {\\n    baselineK: BASELINE_K,\\n    results,\\n    totalItems: allIds.size,\\n  };\\n}\",\n      \"start_line\": 165,\n      \"end_line\": 191,\n      \"score\": 0.47864302291051786\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/shared/algorithms/rrf-fusion.d.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/** Configuration options for advanced score fusion with term matching. */\\ninterface FuseAdvancedOptions {\\n    termMatchBonus?: number;\\n}\\n/** A search function descriptor: source label, async retrieval function, and optional weight. */\\ninterface SearchFunction {\\n    source: string;\\n    fn: () => Promise<RrfItem[]>;\\n    weight?: number;\\n}\\n/**\\n * Fuse two ranked result lists using Reciprocal Rank Fusion.\\n * @param listA - First ranked result list.\\n * @param listB - Second ranked result list.\\n * @param k - RRF smoothing constant (default 60).\\n * @param sourceA - Source label for listA (default 'vector').\\n * @param sourceB - Source label for listB (default 'fts').\\n * @returns Fused results sorted by descending RRF score.\\n */\\ndeclare function fuseResults(listA: RrfItem[], listB: RrfItem[], k?: number, sourceA?: string, sourceB?: string): FusionResult[];\",\n      \"start_line\": 57,\n      \"end_line\": 76,\n      \"score\": 0.46973983896896243\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// TEST: MMR Reranker (C138-P1)\\n// Maximal Marginal Relevance for post-fusion diversity pruning.\\n// Verifies dedup, lambda tuning, N-cap, performance, and limits.\\nimport { describe, it, expect } from 'vitest';\\nimport { applyMMR, computeCosine } from '@spec-kit/shared/algorithms/mmr-reranker';\\nimport type { MMRCandidate, MMRConfig } from '@spec-kit/shared/algorithms/mmr-reranker';\",\n      \"start_line\": 1,\n      \"end_line\": 6,\n      \"score\": 0.4685654467121978\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"    it('Degree channel contributes to convergence bonus', () => {\\n      // Item 1 appears in vector + degree = convergence bonus\\n      const withDegree: RankedList[] = [\\n        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },\\n        { source: SOURCE_TYPES.DEGREE, results: [{ id: 1 }] },\\n      ];\\n\\n      const withoutDegree: RankedList[] = [\\n        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },\\n      ];\\n\\n      const fusedWith = fuseResultsMulti(withDegree);\\n      const fusedWithout = fuseResultsMulti(withoutDegree);\\n\\n      // With graduated-ON normalization, single-result sets normalize to 1.0\\n      // So we verify via convergenceBonus and source count instead of raw score comparison\",\n      \"start_line\": 116,\n      \"end_line\": 131,\n      \"score\": 0.4667682457555884\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// ───────────────────────────────────────────────────────────────\\n// 1. TEST — RSF FUSION\\n// ───────────────────────────────────────────────────────────────\\n// Relative Score Fusion — Single-Pair Variant\\n// Hybrid RAG Fusion Refinement\\n\\nimport { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';\\nimport {\\n  fuseResultsRsf,\\n  extractScore,\\n  minMaxNormalize,\\n  clamp01,\\n} from '../lib/search/rsf-fusion';\\nimport type { RsfResult } from '../lib/search/rsf-fusion';\\nimport type { RankedList, RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';\",\n      \"start_line\": 1,\n      \"end_line\": 15,\n      \"score\": 0.4629502863396908\n    }\n  ],\n  \"total_returned\": 10,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/shared/algorithms/rrf-fusion.d.ts",
        "language": "typescript",
        "content": "/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */\ninterface FusionResult extends RrfItem {\n    /**\n     * Reciprocal Rank Fusion score. Combines rankings from multiple retrieval\n     * methods using the formula `1/(k + rank)`. Higher values indicate the\n     * result was ranked highly by more methods. Includes convergence bonus\n     * when a result appears in multiple ranked lists.\n     */\n    rrfScore: number;\n    sources: string[];\n    sourceScores: Record<string, number>;\n    convergenceBonus: number;\n}\n/** A ranked result list from a single retrieval source (e.g., vector, BM25, graph). */\ninterface RankedList {\n    source: string;\n    results: RrfItem[];\n    weight?: number;\n}\n/** Configuration options for multi-list RRF fusion. */\ninterface FuseMultiOptions {\n    k?: number;\n    convergenceBonus?: number;\n    graphWeightBoost?: number;\n}\n/** Configuration options for advanced score fusion with term matching. */",
        "start_line": 32,
        "end_line": 57,
        "score": 0.5354337158016094
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/shared/algorithms/adaptive-fusion.ts",
exec
/bin/zsh -lc "sed -n '1,220p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

exec
/bin/zsh -lc "rg --files . | rg \"(adaptive-fusion|fusion|rrf|rsf|retriev|memory.*search|graph).*\\.ts"'$|hybrid-rag-fusion|feature-catalog|decision-record"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./.opencode/command/create/feature-catalog.md
./.opencode/specs/03--commands-and-skills/003-sk-prompt-initial-creation/decision-record.md
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
./.opencode/specs/03--commands-and-skills/026-cmd-create-manual-testing-playbook/decision-record.md
./.opencode/specs/03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/spec.md
./.opencode/specs/03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/plan.md
./.opencode/specs/03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/checklist.md
./.opencode/specs/03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/tasks.md
./.opencode/specs/03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/description.json
./.opencode/specs/03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/implementation-summary.md
./.opencode/specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/decision-record.md
./.opencode/specs/03--commands-and-skills/004-skill-advisor-refinement/decision-record.md
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/decision-record.md
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/spec.md
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/plan.md
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/checklist.md
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/tasks.md
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/description.json
./.opencode/specs/03--commands-and-skills/025-cmd-create-feature-catalog/implementation-summary.md
codex
I’ve got the live fusion modules now. The next pass is reading the actual `rrf-fusion`, `stage2-fusion`, `adaptive-fusion`, and related tests so the recommendations can distinguish between current production behavior, shadow-only remnants, and already-planned work like the K-value study.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Adaptive Fusion
// ---------------------------------------------------------------
// Local
import { fuseResultsMulti } from './rrf-fusion';

// Type-only
import type { RrfItem, FusionResult, RankedList } from './rrf-fusion';

// Feature catalog: Hybrid search pipeline
// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback


/* --- 1. INTERFACES --- */

/** Represents fusion weights. */
export interface FusionWeights {
  /** Weight for semantic/vector search results (0-1) */
  semanticWeight: number;
  /** Weight for keyword/lexical search results (0-1) */
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Stage2 Fusion
// ───────────────────────────────────────────────────────────────
// the rollout (R6): 4-Stage Retrieval Pipeline
//
// I/O CONTRACT:
// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
// Output: Stage2Output { scored: PipelineRow[], metadata }
// Key invariants:
//     - Every score modification in the pipeline happens exactly once here
//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
//     - scored is sorted descending by effective composite score on exit
// Side effects:
//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
//     - Learned trigger and negative-feedback reads from DB
//
// PURPOSE: Single point for ALL scoring signals. Intent weights are
// Applied ONCE here only — this is the architectural guard against
// The G2 double-weighting recurrence bug.
//
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: RRF Fusion
// ---------------------------------------------------------------
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)

/* --- 1. CONSTANTS --- */

// Feature catalog: Hybrid search pipeline
// Feature catalog: RRF K-value sensitivity analysis

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  DEGREE: 'degree',
  KEYWORD: 'keyword',
} as const;

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Rsf Fusion
// ───────────────────────────────────────────────────────────────
/**
 * @module rsf-fusion
 *
 * **Status: DORMANT / Shadow-only.**
 *
 * This module implements Relative Score Fusion (RSF) as a comparison/evaluation
 * utility. It is NOT actively used in the search pipeline for ranking. The only
 * remaining integration point is the `rsfShadow` metadata field in
 * `hybrid-search.ts` (`Sprint3PipelineMeta.rsfShadow`), which records RSF
 * scores for offline evaluation without affecting live result ordering.
 *
 * The `isRsfEnabled()` feature flag was removed as dead code.
 * The dead RSF branch in hybrid-search.ts was also removed at that time.
 *
 * The core fusion functions (`fuseResultsRsf`, `fuseResultsRsfMulti`,
 * `fuseResultsRsfCrossVariant`) are preserved for:
 * - Offline A/B evaluation against RRF via Kendall tau correlation
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
          convergenceBonus: 0,
        });
      }
    }
  }

  // Apply convergence bonus for multi-source matches
  for (const result of scoreMap.values()) {
    // AI-WHY: Deduplicate sources before counting — a source can appear multiple
    // times when the same channel contributes via different code paths.
    const uniqueSourceCount = new Set(result.sources).size;
    if (uniqueSourceCount >= 2) {
      const bonus = convergenceBonus * (uniqueSourceCount - 1);
      result.convergenceBonus = bonus;
      result.rrfScore += bonus;
    }
  }

  const results = Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);
 succeeded in 0ms:
  const clampedR = (typeof retrievability === 'number' && retrievability >= 0 && retrievability <= 1)
    ? retrievability
    : 0.9;

  try {
    const memory = db.prepare(
      'SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?'
    ).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) return null;

    const grade = fsrsScheduler.GRADE_GOOD;
    const difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5);

    const newStability = fsrsScheduler.updateStability(
      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      grade,
      clampedR
    ) * (1 + difficultyBonus);
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    let scoreSum = 0;
    let countPresent = 0;
    const sources: string[] = [];
    const sourceScores: Record<string, number> = {};
    let mergedItem: RrfItem | undefined;

    for (const { list, normalizedMap } of sourceMaps) {
      const entry = normalizedMap.get(id);
      if (entry) {
        scoreSum += entry.normalizedScore;
        countPresent++;
        sources.push(list.source);
        sourceScores[list.source] = entry.normalizedScore;
        // Merge items: later sources are used as base, earlier sources overlay
        mergedItem = mergedItem ? { ...mergedItem, ...entry.item } : { ...entry.item };
      }
    }

    const avgScore = scoreSum / countPresent;

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// TEST: Stage 2 Fusion
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Stage2Input } from '../lib/search/pipeline/types';

const mockRequireDb = vi.fn();
const mockQueryLearnedTriggers = vi.fn();
const mockApplyGraphSignals = vi.fn();

vi.mock('../utils/db-helpers', () => ({
  requireDb: mockRequireDb,
}));

vi.mock('../lib/search/learned-feedback', () => ({
  queryLearnedTriggers: mockQueryLearnedTriggers,
}));

vi.mock('../lib/graph/graph-signals', () => ({
  applyGraphSignals: mockApplyGraphSignals,
}));

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// 1. TEST — RSF VS RRF KENDALL TAU
// ───────────────────────────────────────────────────────────────
// Verification: measure rank correlation between RRF and RSF
// Fusion to determine whether RSF is a safe replacement for RRF.
//
// Decision criterion: tau < 0.4 = REJECT RSF (rankings too different)

import { describe, it, expect, beforeAll } from 'vitest';
import { fuseResultsMulti, type RankedList, type RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';
import { fuseResultsRsfMulti, type RsfResult } from '../lib/search/rsf-fusion';

/* ───────────────────────────────────────────────────────────────
   KENDALL TAU-B IMPLEMENTATION
   ──────────────────────────────────────────────────────────────── */

/**
 * Compute Kendall tau-b rank correlation coefficient.
 * Handles ties using the tau-b variant:
 *   tau_b = (C - D) / sqrt((C + D + T1) * (C + D + T2))
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: K-Value Sensitivity Analysis (T004A)
// ───────────────────────────────────────────────────────────────
// Feature catalog: RRF K-value sensitivity analysis
// Measures the impact of different RRF K-values on ranking stability.
// This is a measurement/analysis tool, not production code.
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** Result metrics for a single K-value configuration. */
interface KValueMetrics {
  /** Mean Reciprocal Rank at cutoff 5, estimated against baseline ranking. */
  mrr5: number;
  /** Kendall tau rank correlation with the baseline (K=60) ranking. */
  kendallTau: number;
  /** Average RRF score across all fused results for this K-value. */
exec
/bin/zsh -lc 'rg -n "11-08|12-02|11-13|Adaptive Fusion|K-value|Relative Score Fusion|Scoring and Fusion Corrections|Adaptive fusion|dead code|shadow mode|removed" .opencode/skill/system-spec-kit/feature_catalog .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/implementation-summary.md:118:Recovery mode (`--recovery` flag) was fully removed from `generate-context.js` in commit `705ac0fa6`. The following updates were made to align this spec folder:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/spec.md:130:| REQ-008 | Document 046 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: All anchor chunks retained, filler removed, retained set non-empty |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/spec.md:105:- **SC-003**: Validation-blocking documentation issues are removed while preserving existing level/template structure.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/checklist.md:65:    - 064: `isPipelineV2Enabled()` removed (C8 CLEANUP), Sprint 8 dead code removal matches catalog, dispositions confirmed. PASS.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/memory/metadata.json:111:        "removed_phrases:3"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-constitutional-learn-refactor/spec.md:99:- REQ-002: Old subcommands (correct, undo, history) MUST be removed and replaced with (list, edit, remove, budget)
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:93:| `shared/algorithms/adaptive-fusion.ts` | Shared | Adaptive fusion algorithm |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:116:| `mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive fusion tests |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:51:**Flags removed (C8 CLEANUP):** `isPipelineV2Enabled()` removed — always returned true; `SPECKIT_PIPELINE_V2` env var is no longer consumed
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:61:| Deprecated flags cleaned | PASS | `isPipelineV2Enabled()` removed per C8 CLEANUP comment; V1 pipeline removed |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:79:- **9 flags dead code** for removal
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:82:**Phase 017 update documented in catalog:** `SPECKIT_PIPELINE_V2` deprecated; `isPipelineV2Enabled()` no longer exists in `search-flags.ts`. Code comment at line 107-109: `// C8 CLEANUP: isPipelineV2Enabled() removed — always returned true. // The V1 pipeline was removed and V2 is the only code path. // SPECKIT_PIPELINE_V2 env var is no longer consumed.`
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:84:**Sprint 8 dead code removal documented:** Dead feature flag branches removed from `hybrid-search.ts` (RSF and shadow-scoring), dead functions removed (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state cleaned up.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:92:| `isPipelineV2Enabled()` function removed | Expected | Documented in catalog Phase 017 update section |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:93:| `isShadowScoringEnabled()` removed | Expected | Sprint 8 dead code cleanup |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:94:| `isRsfEnabled()` removed | Expected | Sprint 8 dead code cleanup |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:98:Documented dispositions match code state. Deprecated `isPipelineV2Enabled()` is a confirmed no-op (removed from code). Dead code identified in Sprint 8 matches documented removal list. No undocumented deltas found.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:260:| 064 | Feature flag sunset audit | **PASS** | isPipelineV2Enabled() confirmed removed/no-op, Sprint 8 dead code matches catalog, no unexpected deltas |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/tasks.md:56:- [x] T010 Fix stale save-quality-gate comments (mcp_server/lib/validation/save-quality-gate.ts) — removed TM-04/MR12 tracking codes, fixed "default OFF" to "default ON, graduated"
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md:22:**E2: Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed. The function returns `null` on resolution failure.
codex
The code confirms a few important specifics already: `RRF` is still the live fusion primitive, multi-source convergence is now linear in source count, score normalization is on by default, and `RSF` is preserved only as an offline comparison utility. I’m pulling the feature-catalog and test evidence next so I can separate “implemented”, “planned”, and “retired” without guessing.
exec
/bin/zsh -lc "sed -n '220,420p' .opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      makeLinearList('fts', 3, 10, 0.90, 0.45),
      makeLinearList('bm25', 6, 10, 0.85, 0.40),
      makeLinearList('graph', 2, 8, 0.80, 0.35),
      makeLinearList('degree', 4, 8, 0.75, 0.30),
    ];
    scenarios.push({ name: `multi-5ch-${s}`, lists });
  }

  // Scenario 6: Skewed distributions (one dominant source)
  for (let s = 0; s < 10; s++) {
    const lists: RankedList[] = [
      makeLinearList('vector', 1, 20, 0.99, 0.80),  // Very high scores
      makeLinearList('fts', 1, 20, 0.40, 0.05),       // Very low scores
    ];
    scenarios.push({ name: `skewed-${s}`, lists });
  }

  // Scenario 7: Single item per list
  for (let s = 0; s < 5; s++) {
    const lists: RankedList[] = [
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/feature_catalog -type f | rg "k-value|relative-score-fusion|fusion|scoring|adaptive"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md
exec
/bin/zsh -lc 'find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion -type f | rg "(11-08|12-02|11-13|adaptive|fusion|scoring|k-value|relative-score|dead code|governance)"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/memory/.gitkeep
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/description.json
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/tasks.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/scratch/research-brief.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/scratch/.gitkeep
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/plan.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/spec.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec_validate_local.out
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/20-03-26_15-26__architecture-audit.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/06-03-26_13-00__phase-9-memory-naming-closure.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/.gitkeep
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/metadata.json
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/19-03-26_18-44__architecture-audit.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/06-03-26_20-32__post-review-remediation-010.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/implementation-summary.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/description.json
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/tasks.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent-output-iter-007-codex-A1.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/s4-1-pipeline-boundary-design.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/audit-v3-o07-alignment-specs-review.md
exec
/bin/zsh -lc "sed -n '420,560p' .opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
          scenario: scenario.name,
          tau: comparison.tau,
          commonIds: comparison.commonIds,
          totalIds: comparison.totalIds,
        });

        // Each tau should be a valid number in [-1, 1]
        expect(comparison.tau).toBeGreaterThanOrEqual(-1);
        expect(comparison.tau).toBeLessThanOrEqual(1);
      }

      expect(allTauResults.length).toBeGreaterThanOrEqual(100);
    });

    it('T032-15: statistical summary — mean tau, std dev, min, max', () => {
      expect(allTauResults.length).toBeGreaterThanOrEqual(100);

      const taus = allTauResults.map(r => r.tau);
      const mean = taus.reduce((a, b) => a + b, 0) / taus.length;
      const variance = taus.reduce((a, b) => a + (b - mean) ** 2, 0) / taus.length;
codex
I’ve reached the point where the repo’s own evaluation harness is more valuable than static code reading, so I’m running the fusion comparison tests and any K-sensitivity coverage to extract concrete numbers instead of inferring them from comments.
exec
/bin/zsh -lc 'cat .opencode/skill/system-spec-kit/mcp_server/package.json' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
{
  "name": "@spec-kit/mcp-server",
  "version": "1.7.2",
  "description": "Semantic Memory MCP Server - provides 28 tools for semantic search, memory management, validation, checkpoints, causal graphs, session learning, and auto-indexing",
  "main": "dist/context-server.js",
  "exports": {
    ".": "./dist/context-server.js",
    "./*.js": "./dist/*.js",
    "./*": "./dist/*.js"
  },
  "bin": {
    "context-server": "./dist/context-server.js",
    "spec-kit-cli": "./dist/cli.js"
  },
  "scripts": {
    "build": "tsc --build",
    "start": "node dist/context-server.js",
    "check": "npm run lint && npx tsc --noEmit",
    "check:full": "npm run check && npm run test",
    "lint": "eslint . --ext .ts",
exec
/bin/zsh -lc 'rg -n "k-value|analyzeKValueSensitivity|KValue" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/lib/eval' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:38:| Modules | 15 + 1 data file | eval-db, eval-logger, eval-metrics, eval-quality-proxy, eval-ceiling, bm25-baseline, edge-density, ground-truth-data, ground-truth-generator, k-value-analysis, channel-attribution, ground-truth-feedback, reporting-dashboard, shadow-scoring, ablation-framework, data/ground-truth.json |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:65: k-value-analysis.ts       # RRF K-value sensitivity analysis
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:80:| `k-value-analysis.ts` | Grid search for optimal RRF K parameter |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:110:### K-Value Analysis (`k-value-analysis.ts`)
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:37:  analyzeKValueSensitivity,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:38:  analyzeKValueSensitivityBatch,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:43:} from '../lib/eval/k-value-analysis';
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:379:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:391:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:396:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:401:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:413:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:422:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:431:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:439:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:445:    const analysis = analyzeKValueSensitivity([], 0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:465:      const first = analyzeKValueSensitivity(queryOne, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:466:      const second = analyzeKValueSensitivity(queryTwo, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:470:    const aggregated = analyzeKValueSensitivityBatch([queryOne, queryTwo]);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:471:    const naive = analyzeKValueSensitivity([...queryOne, ...queryTwo], 2);
exec
/bin/zsh -lc 'cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/rsf-vs-rrf-kendall.vitest.ts --reporter=verbose' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 699ms:

 RUN  v4.0.18 /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server

stdout | tests/rsf-vs-rrf-kendall.vitest.ts > T032: RSF vs RRF Kendall Tau Comparison > RSF vs RRF fusion comparison on 100+ scenarios > T032-15: statistical summary — mean tau, std dev, min, max

=== RSF vs RRF Kendall Tau Summary ===
N scenarios:  115
Mean tau:     0.8507
Std dev:      0.1674
Min tau:      0.2889
Max tau:      1.0000
Tau >= 0.4:   110 / 115
Tau >= 0.6:   110 / 115
Tau >= 0.8:   80 / 115

--- By scenario type ---
  identical: mean=1.0000, n=10
  disjoint: mean=0.9579, n=10
  overlap-20pct: mean=0.6737, n=5
  overlap-30pct: mean=0.7263, n=5
exec
/bin/zsh -lc "sed -n '340,520p' .opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '251,340p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
/** Formatted report returned by formatKValueReport(). */
interface KValueReport {
  baselineK: number;
  grid: Array<{ k: number; mrr5: number; kendallTau: number; avgScore: number }>;
  recommendation: string;
  sensitivityCurve: string;
}

/**
 * Format a KValueAnalysisResult into a human-readable structured report.
 *
 * - grid: sorted array of per-K metrics (ascending K order)
 * - recommendation: which K to use based on MRR@5 vs the baseline
 * - sensitivityCurve: prose description of score variation across the grid
 */
function formatKValueReport(analysis: KValueAnalysisResult): KValueReport {
  // Build grid sorted by ascending K
  const grid = (Object.keys(analysis.results) as unknown as number[])
    .map(Number)
    .sort((a, b) => a - b)
 succeeded in 0ms:
    expect(result).toEqual(scores);
  });

  it('handles empty array', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';
    expect(normalizeCompositeScores([])).toEqual([]);
  });

  it('equal scores normalize to 0.0', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

    const scores = [0.5, 0.5, 0.5];
    const normalized = normalizeCompositeScores(scores);

    for (const s of normalized) {
      expect(s).toBe(0.0);
    }
  });

  it('single score normalizes to 0.0', () => {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Relative score fusion in shadow mode"
description: "Relative score fusion (RSF) is a standalone fusion module retained for future use but no longer wired into live ranking."
---

# Relative score fusion in shadow mode

## 1. OVERVIEW

Relative score fusion (RSF) is a standalone fusion module retained for future use but no longer wired into live ranking.

When you search for something, multiple search methods each return their own ranked lists of results. This feature is an alternative way to merge those lists into one final ranking. It is currently shelved and not actively used, but it remains available if the team decides to switch merging strategies in the future.

---

## 2. CURRENT REALITY

RRF remains the live fusion method. RSF no longer runs in the shipped hybrid-search ranking path.

The repository still contains the standalone RSF fusion module and tests for three variants: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). Those artifacts can be exercised in isolation, but they are not wired into live ranking.
 succeeded in 0ms:
---
title: "Scoring and fusion corrections"
description: "Covers eight scoring fixes including intent weight recency, five-factor weight normalization, stack overflow prevention, BM25 specFolder filter and shared `resolveEffectiveScore` consolidation."
---

# Scoring and fusion corrections

## 1. OVERVIEW

Covers eight scoring fixes including intent weight recency, five-factor weight normalization, stack overflow prevention, BM25 specFolder filter and shared `resolveEffectiveScore` consolidation.

These eight fixes address problems in how scores are calculated and combined. Issues ranged from weights that did not add up to 100% to a method that crashed when processing large batches and a filter that compared apples to oranges. Each fix makes the scoring math more accurate and stable, ensuring the final ranking truly reflects which results are most relevant to your question.

---

## 2. CURRENT REALITY

Eight scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Community Detection
// ───────────────────────────────────────────────────────────────
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from "better-sqlite3";

// Feature catalog: Community detection


// ───────────────────────────────────────────────────────────────
// 2. TYPES

// ───────────────────────────────────────────────────────────────
/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Signals
// ───────────────────────────────────────────────────────────────
// Feature catalog: Typed-weighted degree channel
// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';
import {
  STAGE2_GRAPH_BONUS_CAP,
  clampStage2GraphBonus,
} from '../search/pipeline/ranking-contract';

// ───────────────────────────────────────────────────────────────
// 2. SESSION CACHE

// ───────────────────────────────────────────────────────────────
/** Maximum number of entries allowed in each session-scoped cache. */
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "RRF K-value sensitivity analysis"
description: "Documents the grid search over K values {20, 40, 60, 80, 100} that empirically grounded the RRF K parameter choice using MRR@5 delta and Kendall tau correlation."
---

# RRF K-value sensitivity analysis

## 1. OVERVIEW

Documents the grid search over K values {20, 40, 60, 80, 100} that empirically grounded the RRF K parameter choice using MRR@5 delta and Kendall tau correlation.

When combining results from different search methods, a single tuning knob controls how much "being ranked first" matters versus "appearing in multiple lists." This analysis tested five different settings for that knob and measured which one produced the best results. Before this work, the setting was chosen by gut feeling. Now it is chosen by data.

---

## 2. CURRENT REALITY

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values {20, 40, 60, 80, 100} measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Graph momentum scoring"
description: "Describes the temporal degree delta signal that scores memories higher when they gain new graph edges recently, applied as a capped +0.05 additive bonus in Stage 2."
---

# Graph momentum scoring

## 1. OVERVIEW

Describes the temporal degree delta signal that scores memories higher when they gain new graph edges recently, applied as a capped +0.05 additive bonus in Stage 2.

This tracks how quickly a piece of knowledge is gaining connections to other knowledge. Think of it like a trending topic: the faster something connects to related ideas, the more likely it is to be relevant right now. A memory that gained three new links this week gets a small search boost compared to one whose connections have not changed in months.

---

## 2. CURRENT REALITY

Graph connectivity changes over time, and that trajectory carries signal. A memory gaining three new edges this week is more actively relevant than one whose connections have been static for months.

Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Adaptive shadow ranking, bounded proposals, and rollback"
description: "Describes the Phase 4 adaptive ranking module that computes bounded proposal deltas from access and validation signals in shadow mode, preserving live ordering as the production source of truth."
---

# Adaptive shadow ranking, bounded proposals, and rollback

## 1. OVERVIEW

Describes the Phase 4 adaptive ranking module that computes bounded proposal deltas from access and validation signals in shadow mode, preserving live ordering as the production source of truth.

This feature lets the system experiment with new ranking ideas without changing what you actually see. It runs alternative rankings in the background and records what would have changed, like a flight simulator for search results. The experiments have strict limits on how big a change they can propose, and a single switch turns the whole thing off if anything looks wrong. Only after a deliberate decision would any of these proposals go live.

---

## 2. CURRENT REALITY

Phase 4 introduced adaptive ranking in shadow mode. The adaptive module computes proposal deltas from access and validation signals while preserving live ordering as the production source of truth.

Proposal magnitudes are explicitly bounded so adaptive exploration cannot produce unbounded score swings. Shadow payloads expose what would change, while the runtime result order remains unchanged unless an explicit graduation decision is made.
🌐 Searching the web...
🌐 Searched: Cormack Clarke Buettcher Reciprocal Rank Fusion PDF SIGIR 2009
🌐 Searching the web...
🌐 Searched: Weaviate relativeScoreFusion rankedFusion hybrid search docs
🌐 Searching the web...
🌐 Searched: Elasticsearch reciprocal rank fusion docs retriever linear retriever docs official
🌐 Searching the web...
🌐 Searched: site:elastic.co reciprocal rank fusion elastic retriever official docs
🌐 Searching the web...
🌐 Searched: paper hybrid retrieval learned fusion lexical semantic LambdaMART BEIR arxiv
🌐 Searching the web...
🌐 Searched: LambdaMART hybrid retrieval lexical semantic score fusion paper pdf
🌐 Searching the web...
🌐 Searched: Sebastian Bruch An Analysis of Fusion Functions for Hybrid Retrieval arxiv pdf
🌐 Searching the web...
🌐 Searched: site:arxiv.org 2210.11934 hybrid retrieval fusion functions
🌐 Searching the web...
🌐 Searched: https://arxiv.org/abs/2210.11934
🌐 Searching the web...
🌐 Searched: 'average improvement of 4%' in https://aclanthology.org/2025.findings-naacl.367.pdf
🌐 Searching the web...
🌐 Searched: query performance prediction fusion hybrid retrieval per-query selection paper text retrieval
🌐 Searching the web...
🌐 Searched: LambdaMART feature importance SHAP ranking paper official microsoft lightgbm docs
🌐 Searching the web...
🌐 Searched: query performance prediction hybrid retrieval semantic paper post-retrieval selection fusion
🌐 Searching the web...
🌐 Searched: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/linear-retriever
🌐 Searching the web...
🌐 Searched: 'Relative Score Fusion is the default fusion method' in https://docs.weaviate.io/weaviate/search/hybrid
🌐 Searching the web...
🌐 Searched: 'A retriever that normalizes and linearly combines the scores of other retrievers.' in https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/linear-retriever
codex
I have enough of the local implementation picture now to synthesize against external evidence. I’m pulling a last batch of sources on graph-aware retrieval and query-performance prediction so the recommendations around graph weighting and per-query strategy selection are evidence-backed rather than just sensible heuristics.
🌐 Searching the web...
🌐 Searched: graph retrieval hybrid ranking query specific weighting paper knowledge graph retrieval
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Ranking Contract
// ───────────────────────────────────────────────────────────────

import { resolveEffectiveScore } from './types';
import type { PipelineRow } from './types';

/**
 * Stage 2 graph-walk additive bonus cap.
 *
 * Centralized here so deterministic ordering rules and additive graph-bonus
 * bounds share one contract surface.
 */
export const STAGE2_GRAPH_BONUS_CAP = 0.03;

/**
 * Clamp a Stage 2 graph-derived additive bonus to the bounded contract.
 *
 * The contract is strictly additive and never allows negative graph bonuses.
 */
exec
/bin/zsh -lc "rg -n \"STAGE2_GRAPH_BONUS_CAP|graph bonus|appliedBonus|0\\.05|0\\.03|COMMUNITY_EDGE_WEIGHT_THRESHOLD|convergenceBonus|graphWeightBoost\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts:324:  const warningWeight = 0.05;
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:280:        totalDelta: 0.03,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:284:        appliedBonus: 0.03,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:307:      totalDelta: 0.03,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:311:      appliedBonus: 0.03,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:325:        totalDelta: 0.03,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:328:        appliedBonus: 0.015,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:350:        appliedBonus: 'bad',
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:364:      appliedBonus: undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:202: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1263:      score: Math.max(0, 1.0 - index * 0.05),
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:558:| **COLD**     | 0.05 <= R < 0.25 | None             | N/A       | Inactive but retrievable on demand         |
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:559:| **DORMANT**  | 0.02 <= R < 0.05 | None             | N/A       | Very weak, needs explicit revival          |
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:108:    const results = makeResults([[1, 0.9], [2, 0.5], [3, 0.4], [4, 0.05]]);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:135:    // Gaps:   0.05, 0.03, 0.72, 0.02
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:136:    // Median gap (of 4): sort=[0.02,0.03,0.05,0.72] → (0.03+0.05)/2 = 0.04
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:155:      { id: 'e', score: 0.05, meta: 'baz' },
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:178:    // Gaps: 0.05, 0.03, 0.72, 0.02 → sorted: 0.02, 0.03, 0.05, 0.72 → median = (0.03+0.05)/2 = 0.04
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:198:      [1, 0.9], [2, 0.1], [3, 0.05], [4, 0.04], [5, 0.03],
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:200:    // Gaps: 0.80, 0.05, 0.01, 0.01
exec
/bin/zsh -lc "sed -n '560,640p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
 * @param db   - Database instance for graph queries.
 * @returns The same rows with adjusted scores.
 */
export function applyGraphSignals(
  rows: Array<{ id: number; score?: number; [key: string]: unknown }>,
  db: Database.Database,
  options: { rolloutState?: GraphWalkRolloutState } = {},
): Array<{ id: number; score?: number; [key: string]: unknown }> {
  if (!rows || rows.length === 0) return rows;

  try {
    const ids = rows.map((row) => row.id);
    const momentumScores = computeMomentumScores(db, ids);
    const depthScores = computeCausalDepthScores(db, ids);
    const graphWalkScores = computeGraphWalkMetrics(db, ids);
    const rolloutState = options.rolloutState ?? 'bounded_runtime';

    return rows.map((row) => {
      const baseScore = typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0;
      const momentum = momentumScores.get(row.id) ?? 0;
🌐 Searching the web...
🌐 Searched: arXiv 2210.11934 An Analysis of Fusion Functions for Hybrid Retrieval
🌐 Searching the web...
🌐 Searched: "An Analysis of Fusion Functions for Hybrid Retrieval" arxiv abstract
🌐 Searching the web...
🌐 Searched: 'The algorithm uses a constant k = 60' in https://weaviate.io/developers/weaviate/search/hybrid
🌐 Searching the web...
🌐 Searched: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
🌐 Searching the web...
🌐 Searched: 'rank_constant' in https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking
🌐 Searching the web...
🌐 Searched: https://graphrag.com/appendices/research/2405.16506/
🌐 Searching the web...
🌐 Searched: query performance prediction retrieval selector hybrid sparse dense paper
🌐 Searching the web...
🌐 Searched: neural fusion retrieval rank fusion neural late fusion paper acl
🌐 Searching the web...
🌐 Searched: LambdaMART paper Microsoft NDCG rankboost PDF
🌐 Searching the web...
🌐 Searched: 'If a keyword search returns a very flat result set and a vector search returns a very differentiated result set' in https://weaviate.io/developers/weaviate/search/hybrid
🌐 Searching the web...
🌐 Searched: https://weaviate.io/developers/weaviate/api/graphql/search-operators
🌐 Searching the web...
🌐 Searched: 'The `rankedFusion` algorithm is Weaviate's original hybrid fusion algorithm.' in https://weaviate.io/developers/weaviate/api/graphql/search-operators
🌐 Searching the web...
🌐 Searched: https://www.sciencedirect.com/science/article/abs/pii/S0306457321002284
🌐 Searching the web...
🌐 Searched: adaptive reciprocal rank fusion k parameter paper retrieval
🌐 Searching the web...
🌐 Searched the web
codex
I’m in synthesis mode now. I’m grabbing a few exact line references from the local code so the gap analysis can point to concrete implementation facts, then I’ll package the research into the requested D1 structure with explicit recommendations, risks, and dependencies.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: RRF Fusion
     3	// ---------------------------------------------------------------
     4	// Reciprocal Rank Fusion for combining search results
     5	// P3-11: TypeScript source (previously orphaned .js only)
     6	
     7	/* --- 1. CONSTANTS --- */
     8	
     9	// Feature catalog: Hybrid search pipeline
    10	// Feature catalog: RRF K-value sensitivity analysis
    11	
    12	const SOURCE_TYPES = {
    13	  VECTOR: 'vector',
    14	  FTS: 'fts',
    15	  BM25: 'bm25',
    16	  GRAPH: 'graph',
    17	  DEGREE: 'degree',
    18	  KEYWORD: 'keyword',
    19	} as const;
    20	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts | sed -n '220,290p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   220	 * @param options - Optional k value, convergence bonus, and graph weight boost overrides.
   221	 * @returns Fused results sorted by descending RRF score, optionally normalized to [0,1].
   222	 */
   223	function fuseResultsMulti(
   224	  lists: RankedList[],
   225	  options: FuseMultiOptions = {}
   226	): FusionResult[] {
   227	  const k = resolveRrfK(options.k);
   228	  const rawConvergenceBonus = options.convergenceBonus;
   229	  const convergenceBonus = typeof rawConvergenceBonus === 'number' && Number.isFinite(rawConvergenceBonus) && rawConvergenceBonus >= 0
   230	    ? rawConvergenceBonus
   231	    : CONVERGENCE_BONUS;
   232	  const rawGraphWeightBoost = options.graphWeightBoost;
   233	  const graphWeightBoost = typeof rawGraphWeightBoost === 'number' && Number.isFinite(rawGraphWeightBoost) && rawGraphWeightBoost >= 0
   234	    ? rawGraphWeightBoost
   235	    : GRAPH_WEIGHT_BOOST;
   236	
   237	  const scoreMap = new Map<string, FusionResult>();
   238	
   239	  for (const list of lists) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Rsf Fusion
     3	// ───────────────────────────────────────────────────────────────
     4	/**
     5	 * @module rsf-fusion
     6	 *
     7	 * **Status: DORMANT / Shadow-only.**
     8	 *
     9	 * This module implements Relative Score Fusion (RSF) as a comparison/evaluation
    10	 * utility. It is NOT actively used in the search pipeline for ranking. The only
    11	 * remaining integration point is the `rsfShadow` metadata field in
    12	 * `hybrid-search.ts` (`Sprint3PipelineMeta.rsfShadow`), which records RSF
    13	 * scores for offline evaluation without affecting live result ordering.
    14	 *
    15	 * The `isRsfEnabled()` feature flag was removed as dead code.
    16	 * The dead RSF branch in hybrid-search.ts was also removed at that time.
    17	 *
    18	 * The core fusion functions (`fuseResultsRsf`, `fuseResultsRsfMulti`,
    19	 * `fuseResultsRsfCrossVariant`) are preserved for:
    20	 * - Offline A/B evaluation against RRF via Kendall tau correlation
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts | sed -n '560,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   560	 * @param db   - Database instance for graph queries.
   561	 * @returns The same rows with adjusted scores.
   562	 */
   563	export function applyGraphSignals(
   564	  rows: Array<{ id: number; score?: number; [key: string]: unknown }>,
   565	  db: Database.Database,
   566	  options: { rolloutState?: GraphWalkRolloutState } = {},
   567	): Array<{ id: number; score?: number; [key: string]: unknown }> {
   568	  if (!rows || rows.length === 0) return rows;
   569	
   570	  try {
   571	    const ids = rows.map((row) => row.id);
   572	    const momentumScores = computeMomentumScores(db, ids);
   573	    const depthScores = computeCausalDepthScores(db, ids);
   574	    const graphWalkScores = computeGraphWalkMetrics(db, ids);
   575	    const rolloutState = options.rolloutState ?? 'bounded_runtime';
   576	
   577	    return rows.map((row) => {
   578	      const baseScore = typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0;
   579	      const momentum = momentumScores.get(row.id) ?? 0;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage2 Fusion
     3	// ───────────────────────────────────────────────────────────────
     4	// the rollout (R6): 4-Stage Retrieval Pipeline
     5	//
     6	// I/O CONTRACT:
     7	// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
     8	// Output: Stage2Output { scored: PipelineRow[], metadata }
     9	// Key invariants:
    10	//     - Every score modification in the pipeline happens exactly once here
    11	//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
    12	//     - scored is sorted descending by effective composite score on exit
    13	// Side effects:
    14	//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
    15	//     - Learned trigger and negative-feedback reads from DB
    16	//
    17	// PURPOSE: Single point for ALL scoring signals. Intent weights are
    18	// Applied ONCE here only — this is the architectural guard against
    19	// The G2 double-weighting recurrence bug.
    20	//
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: https://docs.opensearch.org/docs/2.19/search-plugins/search-pipelines/normalization-processor/
🌐 Searching the web...
🌐 Searched: 'Valid values are `min_max`, `l2`, and `z_score`' in https://docs.opensearch.org/docs/2.19/search-plugins/search-pipelines/normalization-processor/
🌐 Searching the web...
🌐 Searched: site:opensearch.org blog z-score normalization technique for hybrid search
🌐 Searching the web...
🌐 Searched: ACL listwise reranking retrieval listt5 acl 2024
🌐 Searching the web...
🌐 Searched: "Reciprocal rank fusion outperforms condorcet and individual rank learning methods"
codex
**Executive Summary**
- `RRF` is still the safest default for this system, but the strongest modern evidence says calibrated score fusion can beat `RRF` when channel scores are informative and at least lightly tuned; that argues for resurrecting `RSF` only as part of a broader score-fusion lab, not as a straight production switch.
- `k=60` is still mostly a convention, not a proof. As of **March 21, 2026**, this repo already contains a `k-value-analysis.ts` module, but it evaluates against the `k=60` baseline rather than judged relevance, so it does not establish a production-optimal `k`.
- The highest-value near-term change is to replace fixed heuristics with calibrated, bounded features: overlap bonus, graph weight, and Stage 2 signal weights should all become query-aware before they become learned.
- Learned fusion is worth doing only after you have a small judged set. For a corpus of hundreds to low thousands of markdown memories, a regularized linear combiner is a better first step than a neural fusion model.
- Modern systems are converging on a pragmatic stack: simple robust fusion first, optional calibrated score fusion second, reranking last. The biggest learning gains in current literature are usually in reranking, not in replacing fusion with a heavy neural model.

**State Of Art Survey**
- Production systems no longer treat one fusion method as universal. Azure AI Search uses `RRF` for hybrid search; Elasticsearch supports both `RRF` and normalized linear fusion; OpenSearch supports weighted score normalization/combination and now also `RRF`; Weaviate switched its default hybrid method to `relativeScoreFusion`.
- The historical case for `RRF` is still real: Cormack et al. introduced it as a robust rank-only fusion method that beat Condorcet and several learned/rank-fusion baselines on their benchmarks.
- The main modern challenge to `RRF` is calibrated score fusion. Bruch et al. report that convex combination can outperform `RRF`, that `RRF` is parameter-sensitive, and that the calibrated alternative is sample-efficient.
- Multi-query late-fusion work still often uses `RRF` because it is robust across diverse expansions. MMLF is a good example: it uses `RRF` and reports average gains around 4% on BEIR.
- The learning frontier has shifted more toward reranking than fusion. ListT5 reports a `+1.3` average `nDCG@10` gain over RankT5 on BEIR, which is a reminder that the biggest learned lift may belong in Stage 3, not Stage 2.
- Per-query strategy selection is well-supported conceptually by query-performance-prediction work: semantic post-retrieval QPP has been shown useful for interpolation and for routing queries to different retrieval approaches.

**Gap Analysis**
- `High`: No judged offline benchmark is driving fusion decisions. The current live constants are still heuristic: `DEFAULT_K=60`, `CONVERGENCE_BONUS=0.10`, `GRAPH_WEIGHT_BOOST=1.5` in [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L21).
- `High`: Stage 2 is the single scoring point, but many signal magnitudes are static heuristics rather than validated weights; see the ordered signal stack in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L17) and bounded validation bonuses in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L123).
- `Medium`: `RSF` is dormant and shadow-only, not a real experimental framework. The current module is preserved for offline comparison, not rollout-ready evaluation in live traffic; see [rsf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L4).
- `Medium`: Overlap and graph are partly double-heuristic today: Stage 1 gives graph a flat `1.5x` weight and overlap a linear additive bonus, while Stage 2 can add graph momentum, depth, and walk bonuses up to `+0.05/+0.05/+0.03`; see [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L223) and [graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts#L563).
- `Medium`: The intent router changes weights, but not the fusion family itself. That leaves obvious wins on the table for literal-ID queries, graph-heavy causal queries, and semantically broad “understand” queries.
- `Repo-vs-prompt note`: as of **March 21, 2026**, the repo already has a dormant K-analysis module and an `RSF` vs `RRF` test harness. I ran the repo’s `tests/rsf-vs-rrf-kendall.vitest.ts`; it passed and reported mean Kendall `tau=0.8507` across 115 synthetic scenarios. That shows similarity, not superiority.

**Recommendations**
1. `P1` Build a generalized shadow fusion lab, not a straight `RSF` revival. Effort: `M`. Impact: inferred `+1 to +4 MRR@5`, `+1 to +4 NDCG@10`, `0 to +2 Recall@20`. Flag: `SPECKIT_FUSION_POLICY_SHADOW_V2`.
```ts
type FusionPolicy = 'rrf' | 'minmax_linear' | 'zscore_linear';
const channelScores = normalizePerChannel(rawScores, policy);
finalScore[id] = sum(weights[c] * channelScores[c][id]) + overlap(id);
shadow.compare(['rrf', 'minmax_linear', 'zscore_linear']);
```
Rationale: keep `RRF` live, but shadow-test weighted min-max and z-score fusion on judged queries plus telemetry. This matches Bruch’s evidence and what Elastic/OpenSearch/Weaviate expose. Sources: Cormack 2009, Bruch 2024, Elastic linear retriever, OpenSearch normalization, Weaviate relative score fusion.

2. `P1` Replace the flat convergence bonus with a calibrated overlap feature. Effort: `S`. Impact: inferred `0 to +1 MRR@5`, `0 to +1.5 NDCG@10`, neutral recall. Flag: `SPECKIT_CALIBRATED_OVERLAP_BONUS`.
```ts
const overlapRatio = (channelsHit - 1) / Math.max(1, totalChannels - 1);
const overlapScore = beta * overlapRatio * meanTopNormScore(id);
score += clamp(overlapScore, 0, 0.06);
```
Rationale: Azure explicitly notes that raw `RRF` score range grows with the number of fused queries, so a fixed `+0.10` bonus is miscalibrated as channel count changes. Keep it bounded and query-aware. Sources: Azure RRF scoring docs, local `rrf-fusion.ts`.

3. `P1` Redo K-optimization with judged relevance, segmented by query class. Effort: `M`. Impact: inferred `0 to +2 MRR@5`, `0 to +2 NDCG@10`, small recall change. Flag: `SPECKIT_RRF_K_EXPERIMENTAL`.
```ts
for (const k of [10,20,40,60,80,100,120]) {
  metrics[k] = evalQueries(qset, q => fuseRrf(q.channels, { k }));
}
bestK[intent] = argmax(metrics, 'ndcg10');
```
Rationale: the current repo module is useful instrumentation, but because it scores against the `k=60` baseline, it measures stability, not true quality. Bruch also found `RRF` parameter sensitivity, so this is worth doing. Sources: Bruch 2024, Azure RRF docs, local `k-value-analysis.ts`.

4. `P2` Make graph weight query-aware and edge-quality-aware. Effort: `M`. Impact: inferred overall `0 to +2 NDCG@10`; graph-heavy query segment `+2 to +6`. Flag: `SPECKIT_GRAPH_QUERY_GATING_V1`.
```ts
const graphEligible = intent in ['understand','find_decision'] && !looksLikeLiteralId(query);
const graphPrior = edgeQuality * queryAbstraction * graphDensityPenalty;
stage1.graphWeight = graphEligible ? lerp(0.6, 1.6, graphPrior) : 0.2;
```
Rationale: graph helps most on multi-hop, networked, causal queries, not literal lookups. GRAG supports graph promotion for networked documents; your own Stage 2 graph bonuses are already bounded, so the missing piece is when to promote or demote graph at all. Sources: GRAG 2024, QPP 2022, local `graph-signals.ts`.

5. `P2` Learn Stage 2 weights only after a small judged set exists, and start linear. Effort: `M` for linear, `L` for LambdaMART. Impact: inferred `+1 to +3.5 MRR@5`, `+1 to +4 NDCG@10`, `0 to +2 Recall@20`. Flag: `SPECKIT_LEARNED_STAGE2_COMBINER`.
```ts
features = [rrf, overlap, graph, session, causal, feedback, validation, artifact];
model = trainRegularizedLinearRanker(features, labels);
score = clamp(model.predict(features), 0, 1);
```
Rationale: for this corpus size and single-dev capacity, a regularized linear ranker or tiny LambdaMART is the right first learned step. Use leave-one-query-out validation, permutation ablation, and SHAP/per-feature drop tests before graduation. Full neural fusion is not the right first investment here. Sources: Bruch 2024, ListT5 2024.

6. `P2` Let the intent router choose the fusion family, not just weights. Effort: `M`. Impact: inferred `+0.5 to +2.5 MRR@5`, `+0.5 to +3 NDCG@10`, `0 to +1 Recall@20`. Flag: `SPECKIT_FUSION_POLICY_ROUTER`.
```ts
if (qpp.low && scoreSpread.high) policy = 'minmax_linear';
else if (looksLikeLiteralId(query)) policy = 'rrf';
else if (graphIntent && graphQuality.high) policy = 'rrf+graph';
```
Rationale: your 7-class intent router is already the right hook. Add post-retrieval QPP features such as score spread, channel agreement, entity-count, and lexical specificity to route between `RRF`, score fusion, and graph-heavy policies. Sources: QPP 2022, Weaviate hybrid docs, OpenSearch normalization docs.

**Risk Assessment**
- `R1`: Score-fusion shadow mode can overfit a small judged set and silently hurt literal queries if score calibration is poor.
- `R2`: A smarter overlap feature can accidentally duplicate the signal already present in `RRF`; keep it small and bounded.
- `R3`: K-tuning can optimize noise if you do not stratify by intent and hold out queries.
- `R4`: Query-aware graph promotion can amplify low-quality or overly dense edges; provenance and edge-type confidence must gate it.
- `R5`: Learned Stage 2 scoring can become opaque and brittle; require ablation reports and shadow rollout before any live switch.
- `R6`: Strategy routing can fail badly on misclassified intents; always preserve a safe fallback to `RRF`.

**Cross-Dimensional Dependencies**
- `D2 Query Intelligence`: this work depends directly on stronger intent features and post-retrieval QPP; without D2, per-query routing will be weak.
- `D3 Graph Retrieval`: graph-aware fusion needs edge provenance, edge typing, density stats, and graph-quality signals from D3.
- `D4 Feedback Learning`: judged queries, validation outcomes, and negative/positive feedback are the label source for calibrating or learning weights.
- `D5 UX`: once fusion becomes dynamic, users and developers need trace output showing chosen policy, channel contributions, overlap bonus, and graph boosts.

**Sources**
- Cormack et al., 2009, RRF: https://research.google/pubs/reciprocal-rank-fusion-outperforms-condorcet-and-individual-rank-learning-methods/
- Bruch et al., 2024, fusion analysis: https://huggingface.co/papers/2210.11934
- Azure AI Search hybrid RRF: https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking
- Elasticsearch RRF: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
- Elasticsearch linear retriever: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/retrievers-examples
- OpenSearch normalization processor: https://docs.opensearch.org/2.19/search-plugins/search-pipelines/normalization-processor/
- OpenSearch z-score hybrid search: https://opensearch.org/blog/introducing-the-z-score-normalization-technique-for-hybrid-search/
- Weaviate hybrid / relative score fusion: https://docs.weaviate.io/weaviate/api/graphql/search-operators
- MMLF, 2025: https://aclanthology.org/2025.findings-naacl.367/
- ListT5, 2024: https://aclanthology.org/2024.acl-long.125/
- Semantic QPP, 2022: https://doi.org/10.1016/j.ipm.2021.102746
- GRAG, 2024: https://graphrag.com/appendices/research/2405.16506/
tokens used
311,305
**Executive Summary**
- `RRF` is still the safest default for this system, but the strongest modern evidence says calibrated score fusion can beat `RRF` when channel scores are informative and at least lightly tuned; that argues for resurrecting `RSF` only as part of a broader score-fusion lab, not as a straight production switch.
- `k=60` is still mostly a convention, not a proof. As of **March 21, 2026**, this repo already contains a `k-value-analysis.ts` module, but it evaluates against the `k=60` baseline rather than judged relevance, so it does not establish a production-optimal `k`.
- The highest-value near-term change is to replace fixed heuristics with calibrated, bounded features: overlap bonus, graph weight, and Stage 2 signal weights should all become query-aware before they become learned.
- Learned fusion is worth doing only after you have a small judged set. For a corpus of hundreds to low thousands of markdown memories, a regularized linear combiner is a better first step than a neural fusion model.
- Modern systems are converging on a pragmatic stack: simple robust fusion first, optional calibrated score fusion second, reranking last. The biggest learning gains in current literature are usually in reranking, not in replacing fusion with a heavy neural model.

**State Of Art Survey**
- Production systems no longer treat one fusion method as universal. Azure AI Search uses `RRF` for hybrid search; Elasticsearch supports both `RRF` and normalized linear fusion; OpenSearch supports weighted score normalization/combination and now also `RRF`; Weaviate switched its default hybrid method to `relativeScoreFusion`.
- The historical case for `RRF` is still real: Cormack et al. introduced it as a robust rank-only fusion method that beat Condorcet and several learned/rank-fusion baselines on their benchmarks.
- The main modern challenge to `RRF` is calibrated score fusion. Bruch et al. report that convex combination can outperform `RRF`, that `RRF` is parameter-sensitive, and that the calibrated alternative is sample-efficient.
- Multi-query late-fusion work still often uses `RRF` because it is robust across diverse expansions. MMLF is a good example: it uses `RRF` and reports average gains around 4% on BEIR.
- The learning frontier has shifted more toward reranking than fusion. ListT5 reports a `+1.3` average `nDCG@10` gain over RankT5 on BEIR, which is a reminder that the biggest learned lift may belong in Stage 3, not Stage 2.
- Per-query strategy selection is well-supported conceptually by query-performance-prediction work: semantic post-retrieval QPP has been shown useful for interpolation and for routing queries to different retrieval approaches.

**Gap Analysis**
- `High`: No judged offline benchmark is driving fusion decisions. The current live constants are still heuristic: `DEFAULT_K=60`, `CONVERGENCE_BONUS=0.10`, `GRAPH_WEIGHT_BOOST=1.5` in [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L21).
- `High`: Stage 2 is the single scoring point, but many signal magnitudes are static heuristics rather than validated weights; see the ordered signal stack in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L17) and bounded validation bonuses in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L123).
- `Medium`: `RSF` is dormant and shadow-only, not a real experimental framework. The current module is preserved for offline comparison, not rollout-ready evaluation in live traffic; see [rsf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts#L4).
- `Medium`: Overlap and graph are partly double-heuristic today: Stage 1 gives graph a flat `1.5x` weight and overlap a linear additive bonus, while Stage 2 can add graph momentum, depth, and walk bonuses up to `+0.05/+0.05/+0.03`; see [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L223) and [graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts#L563).
- `Medium`: The intent router changes weights, but not the fusion family itself. That leaves obvious wins on the table for literal-ID queries, graph-heavy causal queries, and semantically broad “understand” queries.
- `Repo-vs-prompt note`: as of **March 21, 2026**, the repo already has a dormant K-analysis module and an `RSF` vs `RRF` test harness. I ran the repo’s `tests/rsf-vs-rrf-kendall.vitest.ts`; it passed and reported mean Kendall `tau=0.8507` across 115 synthetic scenarios. That shows similarity, not superiority.

**Recommendations**
1. `P1` Build a generalized shadow fusion lab, not a straight `RSF` revival. Effort: `M`. Impact: inferred `+1 to +4 MRR@5`, `+1 to +4 NDCG@10`, `0 to +2 Recall@20`. Flag: `SPECKIT_FUSION_POLICY_SHADOW_V2`.
```ts
type FusionPolicy = 'rrf' | 'minmax_linear' | 'zscore_linear';
const channelScores = normalizePerChannel(rawScores, policy);
finalScore[id] = sum(weights[c] * channelScores[c][id]) + overlap(id);
shadow.compare(['rrf', 'minmax_linear', 'zscore_linear']);
```
Rationale: keep `RRF` live, but shadow-test weighted min-max and z-score fusion on judged queries plus telemetry. This matches Bruch’s evidence and what Elastic/OpenSearch/Weaviate expose. Sources: Cormack 2009, Bruch 2024, Elastic linear retriever, OpenSearch normalization, Weaviate relative score fusion.

2. `P1` Replace the flat convergence bonus with a calibrated overlap feature. Effort: `S`. Impact: inferred `0 to +1 MRR@5`, `0 to +1.5 NDCG@10`, neutral recall. Flag: `SPECKIT_CALIBRATED_OVERLAP_BONUS`.
```ts
const overlapRatio = (channelsHit - 1) / Math.max(1, totalChannels - 1);
const overlapScore = beta * overlapRatio * meanTopNormScore(id);
score += clamp(overlapScore, 0, 0.06);
```
Rationale: Azure explicitly notes that raw `RRF` score range grows with the number of fused queries, so a fixed `+0.10` bonus is miscalibrated as channel count changes. Keep it bounded and query-aware. Sources: Azure RRF scoring docs, local `rrf-fusion.ts`.

3. `P1` Redo K-optimization with judged relevance, segmented by query class. Effort: `M`. Impact: inferred `0 to +2 MRR@5`, `0 to +2 NDCG@10`, small recall change. Flag: `SPECKIT_RRF_K_EXPERIMENTAL`.
```ts
for (const k of [10,20,40,60,80,100,120]) {
  metrics[k] = evalQueries(qset, q => fuseRrf(q.channels, { k }));
}
bestK[intent] = argmax(metrics, 'ndcg10');
```
Rationale: the current repo module is useful instrumentation, but because it scores against the `k=60` baseline, it measures stability, not true quality. Bruch also found `RRF` parameter sensitivity, so this is worth doing. Sources: Bruch 2024, Azure RRF docs, local `k-value-analysis.ts`.

4. `P2` Make graph weight query-aware and edge-quality-aware. Effort: `M`. Impact: inferred overall `0 to +2 NDCG@10`; graph-heavy query segment `+2 to +6`. Flag: `SPECKIT_GRAPH_QUERY_GATING_V1`.
```ts
const graphEligible = intent in ['understand','find_decision'] && !looksLikeLiteralId(query);
const graphPrior = edgeQuality * queryAbstraction * graphDensityPenalty;
stage1.graphWeight = graphEligible ? lerp(0.6, 1.6, graphPrior) : 0.2;
```
Rationale: graph helps most on multi-hop, networked, causal queries, not literal lookups. GRAG supports graph promotion for networked documents; your own Stage 2 graph bonuses are already bounded, so the missing piece is when to promote or demote graph at all. Sources: GRAG 2024, QPP 2022, local `graph-signals.ts`.

5. `P2` Learn Stage 2 weights only after a small judged set exists, and start linear. Effort: `M` for linear, `L` for LambdaMART. Impact: inferred `+1 to +3.5 MRR@5`, `+1 to +4 NDCG@10`, `0 to +2 Recall@20`. Flag: `SPECKIT_LEARNED_STAGE2_COMBINER`.
```ts
features = [rrf, overlap, graph, session, causal, feedback, validation, artifact];
model = trainRegularizedLinearRanker(features, labels);
score = clamp(model.predict(features), 0, 1);
```
Rationale: for this corpus size and single-dev capacity, a regularized linear ranker or tiny LambdaMART is the right first learned step. Use leave-one-query-out validation, permutation ablation, and SHAP/per-feature drop tests before graduation. Full neural fusion is not the right first investment here. Sources: Bruch 2024, ListT5 2024.

6. `P2` Let the intent router choose the fusion family, not just weights. Effort: `M`. Impact: inferred `+0.5 to +2.5 MRR@5`, `+0.5 to +3 NDCG@10`, `0 to +1 Recall@20`. Flag: `SPECKIT_FUSION_POLICY_ROUTER`.
```ts
if (qpp.low && scoreSpread.high) policy = 'minmax_linear';
else if (looksLikeLiteralId(query)) policy = 'rrf';
else if (graphIntent && graphQuality.high) policy = 'rrf+graph';
```
Rationale: your 7-class intent router is already the right hook. Add post-retrieval QPP features such as score spread, channel agreement, entity-count, and lexical specificity to route between `RRF`, score fusion, and graph-heavy policies. Sources: QPP 2022, Weaviate hybrid docs, OpenSearch normalization docs.

**Risk Assessment**
- `R1`: Score-fusion shadow mode can overfit a small judged set and silently hurt literal queries if score calibration is poor.
- `R2`: A smarter overlap feature can accidentally duplicate the signal already present in `RRF`; keep it small and bounded.
- `R3`: K-tuning can optimize noise if you do not stratify by intent and hold out queries.
- `R4`: Query-aware graph promotion can amplify low-quality or overly dense edges; provenance and edge-type confidence must gate it.
- `R5`: Learned Stage 2 scoring can become opaque and brittle; require ablation reports and shadow rollout before any live switch.
- `R6`: Strategy routing can fail badly on misclassified intents; always preserve a safe fallback to `RRF`.

**Cross-Dimensional Dependencies**
- `D2 Query Intelligence`: this work depends directly on stronger intent features and post-retrieval QPP; without D2, per-query routing will be weak.
- `D3 Graph Retrieval`: graph-aware fusion needs edge provenance, edge typing, density stats, and graph-quality signals from D3.
- `D4 Feedback Learning`: judged queries, validation outcomes, and negative/positive feedback are the label source for calibrating or learning weights.
- `D5 UX`: once fusion becomes dynamic, users and developers need trace output showing chosen policy, channel contributions, overlap bonus, and graph boosts.

**Sources**
- Cormack et al., 2009, RRF: https://research.google/pubs/reciprocal-rank-fusion-outperforms-condorcet-and-individual-rank-learning-methods/
- Bruch et al., 2024, fusion analysis: https://huggingface.co/papers/2210.11934
- Azure AI Search hybrid RRF: https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking
- Elasticsearch RRF: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
- Elasticsearch linear retriever: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/retrievers-examples
- OpenSearch normalization processor: https://docs.opensearch.org/2.19/search-plugins/search-pipelines/normalization-processor/
- OpenSearch z-score hybrid search: https://opensearch.org/blog/introducing-the-z-score-normalization-technique-for-hybrid-search/
- Weaviate hybrid / relative score fusion: https://docs.weaviate.io/weaviate/api/graphql/search-operators
- MMLF, 2025: https://aclanthology.org/2025.findings-naacl.367/
- ListT5, 2024: https://aclanthology.org/2024.acl-long.125/
- Semantic QPP, 2022: https://doi.org/10.1016/j.ipm.2021.102746
- GRAG, 2024: https://graphrag.com/appendices/research/2405.16506/
