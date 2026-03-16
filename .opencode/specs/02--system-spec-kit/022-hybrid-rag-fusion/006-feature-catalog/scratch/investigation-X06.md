OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce99-13b5-7b13-8d37-01e58154af71
--------
user
You are investigating undocumented features in an MCP server. Search for and read scoring and evaluation files under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/: scoring/composite-scoring.ts, eval/eval-metrics.ts, eval/bm25-baseline.ts, eval/ground-truth-feedback.ts, eval/ground-truth-generator.ts, eval/ablation-framework.ts, eval/channel-attribution.ts, and any telemetry/ files. Verify gaps 24-31: Gap 24 (Document-Type-Aware Scoring), Gap 25 (Diagnostic Retrieval Metrics Suite), Gap 26 (BM25 Contingency Gate), Gap 27 (Feedback-Driven Ground-Truth Expansion), Gap 28 (Ground-Truth Diversity Gate), Gap 29 (Ablation Significance Testing), Gap 30 (Exclusive Contribution Rate), Gap 31 (Extended Retrieval Telemetry). 

OUTPUT FORMAT (repeat for each gap):
---
GAP_NUMBER: [from undocumented-features-scan.md]
FEATURE_NAME: [descriptive name]
STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
SOURCE_FILES: [file:line-range for implementation]
DRAFT_DESCRIPTION: [2-5 sentence Current Reality text]
SUGGESTED_CATEGORY: [which of the 20 existing categories]
SIGNIFICANCE: [HIGH/MEDIUM/LOW]
NOTES: [additional context]
---

Also report any NEW capabilities you find in these files that are not in the gap list.

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to inspect the exact scoring, eval, and telemetry files you listed under `system-spec-kit/mcp_server/lib`, then map each Gap 24–31 to concrete code evidence with line references and status. I’ll start by locating all relevant files and reading their implementations end to end.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg 'scoring/composite-scoring.ts|eval/eval-metrics.ts|eval/bm25-baseline.ts|eval/ground-truth-feedback.ts|eval/ground-truth-generator.ts|eval/ablation-framework.ts|eval/channel-attribution.ts|telemetry/'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
codex
I found all target files, including a telemetry module set and one extra `cache/scoring/composite-scoring.ts` variant. Next I’ll read each file with line numbers and extract exact implementation evidence for each gap.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && wc -l .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md .opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     813 .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
     587 .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts
     587 .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts
     553 .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
     328 .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts
     755 .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
     251 .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts
     324 .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
     412 .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
     197 .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts
     222 .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts
     266 .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
       9 .opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
    5304 total
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"document|type-aware|docType|doc_type|metadata\\.type|diagnostic|diagnostics|precision|recall|ndcg|mrr|bm25|contingency|fallback|gate|ground.?truth|feedback|diversity|ablation|significance|pvalue|t-test|wilcoxon|exclusive|contribution|telemetry|channel|attribution|trace|latency|cost|cache|bandit|rrf|hybrid\" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 571

.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:3:description: "Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs."
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:5:  - "retrieval telemetry"
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:6:  - "latency metrics"
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:12:> Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:32:The telemetry module provides structured observability for the retrieval pipeline. It records per-stage latency, search mode selection, fallback triggers, and composite quality scores. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:38:| Modules | 1 | `retrieval-telemetry.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:50:| **QualityMetrics** | Composite 0–1 quality proxy derived from relevance, result count, and latency |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:51:| **TelemetryTracePayload** | Canonical retrieval trace payload (sanitized, no sensitive/extra fields) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:52:| **Feature Flag** | `SPECKIT_EXTENDED_TELEMETRY` gates extended metric collection (default: enabled) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:62:telemetry/
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:63: retrieval-telemetry.ts    # Telemetry interfaces, types, and collection utilities
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:71:| `retrieval-telemetry.ts` | Defines `RetrievalTelemetry`, `LatencyMetrics`, `ModeMetrics`, `FallbackMetrics`, and `QualityMetrics`; exposes collection helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:84:| `SPECKIT_EXTENDED_TELEMETRY` | `true` | Enable extended metric collection (latency breakdown, quality scoring) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:86:When disabled, only the minimal `RetrievalTelemetry` shell is populated; latency, mode, fallback, and quality sub-metrics are omitted.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:90:**Purpose**: Aggregate all metric groups for one retrieval run.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94:| `enabled` | `boolean` | Whether extended telemetry collection is enabled |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:96:| `latency` | `LatencyMetrics` | Per-stage timing breakdown |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:98:| `fallback` | `FallbackMetrics` | Fallback trigger record |
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg --files | rg 'undocumented-features-scan\\.md"'$|gap|undocumented'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-4-review-skill-gaps.md
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/research/003 - gaps-and-workarounds-sqlite-to-turso.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/research/006 - gaps-and-workarounds-sqlite-to-libsql.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-extra-features/scratch/w1-a2-runtime-gap-analysis.md
codex
I’ve started extracting direct evidence and also found the source gap register at `.../006-feature-catalog/undocumented-features-scan.md`, which I’ll use to align names/categories exactly. I’ll now read that and the target implementation files with line-accurate references.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	# Undocumented Features Scan — MCP Server vs Feature Catalog
     2	
     3	> **Date:** 2026-03-07
     4	> **Method:** 10 GPT-5.4 agents scanned 203 TypeScript source files against the 156-feature catalog
     5	> **Raw findings:** 91 | **After dedup + false-positive removal:** 55 genuine gaps
     6	
     7	---
     8	
     9	## Executive Summary
    10	
    11	The scan found **55 undocumented or significantly under-documented capabilities** across the MCP server codebase. These fall into three tiers:
    12	
    13	- **17 High-significance gaps** — Major capabilities with no catalog coverage
    14	- **25 Medium-significance gaps** — Substantial sub-features or extensions not mentioned
    15	- **13 Low-significance gaps** — Infrastructure details or minor extensions
    16	
    17	Most gaps are in the **infrastructure/operational layer** (server lifecycle, crash recovery, circuit breakers) and the **cognitive/scoring subsystems** (FSRS scheduling, working memory, type taxonomy) — areas the catalog describes at a high level but whose implementation depth far exceeds the documentation.
    18	
    19	---
    20	
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && ls -1 .opencode/skill/system-spec-kit/feature_catalog" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
01--retrieval
02--mutation
03--discovery
04--maintenance
05--lifecycle
06--analysis
07--evaluation
08--bug-fixes-and-data-integrity
09--evaluation-and-measurement
10--graph-signal-activation
11--scoring-and-calibration
12--query-intelligence
13--memory-quality-and-indexing
14--pipeline-architecture
15--retrieval-enhancements
16--tooling-and-scripts
17--governance
18--ux-hooks
19--decisions-and-deferrals
20--feature-flag-reference
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"DOCUMENT_TYPE_MULTIPLIERS|DOC_TYPE_QUERY_MAP|document_type|docType|applyCompositeScoreAdjustments|Spec 126|keyword\" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
189:// Spec 126: Document type scoring multipliers
192:export const DOCUMENT_TYPE_MULTIPLIERS: Readonly<Record<string, number>> = {
414:  // Spec 126: Document-type pattern alignment bonus
415:  // Boost score when query keywords match the document type
416:  if (queryLower && row.document_type) {
417:    const docType = row.document_type as string;
418:    const DOC_TYPE_QUERY_MAP: Record<string, string[]> = {
427:    const matchKeywords = DOC_TYPE_QUERY_MAP[docType];
504:  // Spec 126: Apply document type multiplier
505:  const docType = (row.document_type as string) || 'memory';
506:  const docMultiplier = DOCUMENT_TYPE_MULTIPLIERS[docType] ?? 1.0;
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '160,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   160	  temporary: 0.5,
   161	  deprecated: 0.25,
   162	};
   163	
   164	function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
   165	  const contextMult = CLASSIFICATION_CONTEXT_STABILITY_MULTIPLIER[contextType] ?? 1.0;
   166	  const tierMult = CLASSIFICATION_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
   167	
   168	  if (!isFinite(contextMult) || !isFinite(tierMult)) {
   169	    return Infinity;
   170	  }
   171	
   172	  return stability * contextMult * tierMult;
   173	}
   174	
   175	// REQ-017: Importance weight multipliers
   176	export const IMPORTANCE_MULTIPLIERS: Readonly<Record<string, number>> = {
   177	  constitutional: 2.0,
   178	  critical: 1.5,
   179	  important: 1.3,
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '360,450p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   360	 */
   361	export function calculatePatternScore(row: ScoringInput, options: ScoringOptions = {}): number {
   362	  let score = 0;
   363	  const query = options.query || '';
   364	  const queryLower = query.toLowerCase();
   365	
   366	  const similarity = (Number(row.similarity ?? 0) || 0) / 100;
   367	  score = similarity * 0.5;
   368	
   369	  if (row.title && queryLower) {
   370	    const titleLower = (row.title as string).toLowerCase();
   371	    if (titleLower.includes(queryLower) || queryLower.includes(titleLower)) {
   372	      score += PATTERN_ALIGNMENT_BONUSES.exact_match;
   373	    } else {
   374	      // Partial match: check for word overlap
   375	      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
   376	      const titleWords = titleLower.split(/\s+/);
   377	      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
   378	      if (matches.length > 0 && queryWords.length > 0) {
   379	        score += PATTERN_ALIGNMENT_BONUSES.partial_match * (matches.length / queryWords.length);
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '470,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   470	export function calculateNoveltyBoost(_createdAt: string | undefined): number {
   471	  return 0;
   472	}
   473	
   474	/**
   475	 * BUG-013 FIX: Use centralized tier values from importance-tiers.js.
   476	 *
   477	 * @param tier - Importance tier string
   478	 * @returns Boost value for the tier
   479	 */
   480	export function getTierBoost(tier: string): number {
   481	  const tierConfig = getTierConfig(tier);
   482	  return tierConfig.value;
   483	}
   484	
   485	// --- 3b. SHARED POST-PROCESSING ---
   486	
   487	/**
   488	 * Apply doc-type multiplier, novelty boost, interference penalty, and
   489	 * observability telemetry to an already-computed weighted composite score.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"export function|interface|type|Inversion|constitutional|importance|cold|F1|intent|NDCG|recall|precision|diagnostic|suite|metrics\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
4:// T006a-e: Pure computation functions for 11 evaluation metrics
5:// (6 core + 5 diagnostic). No DB access, no side effects.
13:export interface EvalResult {
23:export interface GroundTruthEntry {
36:  /** Optional importance tier (e.g. 'constitutional', 'critical', 'important', 'normal'). */
38:  /** Optional creation timestamp for cold-start detection. */
42:/** All computed metrics returned by computeAllMetrics(). */
43:export interface AllMetrics {
46:  recall: number;
49:  constitutionalSurfacingRate: number;
50:  importanceWeightedRecall: number;
51:  coldStartDetectionRate: number;
52:  precision: number;
55:  intentWeightedNdcg: number;
107:export function computeMRR(
133: * NDCG = DCG / IDCG
137:export function computeNDCG(
178:export function computeRecall(
204:export function computePrecision(
220: * Compute F1@K — harmonic mean of Precision@K and Recall@K.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval Metrics
     3	// ---------------------------------------------------------------
     4	// T006a-e: Pure computation functions for 11 evaluation metrics
     5	// (6 core + 5 diagnostic). No DB access, no side effects.
     6	// ---------------------------------------------------------------
     7	
     8	/* ---------------------------------------------------------------
     9	   1. TYPES
    10	--------------------------------------------------------------- */
    11	
    12	/** A single retrieved result from a search query. */
    13	export interface EvalResult {
    14	  /** Unique memory identifier. */
    15	  memoryId: number;
    16	  /** Retrieval score assigned by the search system. */
    17	  score: number;
    18	  /** 1-based rank position in the result list. */
    19	  rank: number;
    20	}
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | sed -n '220,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   220	 * Compute F1@K — harmonic mean of Precision@K and Recall@K.
   221	 * F1 = 2 * (P * R) / (P + R), or 0 if both are 0.
   222	 */
   223	export function computeF1(
   224	  results: EvalResult[],
   225	  groundTruth: GroundTruthEntry[],
   226	  k: number = 20
   227	): number {
   228	  if (k <= 0 || results.length === 0 || groundTruth.length === 0) return 0;
   229	  const relevantIds = new Set(
   230	    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
   231	  );
   232	  if (relevantIds.size === 0) return 0;
   233	  const topResults = topK(results, k);
   234	  const hits = topResults.filter(r => relevantIds.has(r.memoryId)).length;
   235	  const p = topResults.length === 0 ? 0 : hits / k;
   236	  const r = hits / relevantIds.size;
   237	  if (p + r === 0) return 0;
   238	  return 2 * (p * r) / (p + r);
   239	}
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | sed -n '420,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   420	
   421	  const gtMap = buildGroundTruthMap(groundTruth);
   422	  const topResults = topK(results, k);
   423	
   424	  let hitWeight = 0;
   425	  for (const r of topResults) {
   426	    const entry = gtMap.get(r.memoryId);
   427	    if (entry && entry.relevance > 0) {
   428	      hitWeight += getWeight(entry);
   429	    }
   430	  }
   431	
   432	  return Math.min(1, hitWeight / totalWeight);
   433	}
   434	
   435	/**
   436	 * T006d: Cold-Start Detection Rate.
   437	 *
   438	 * Percentage of queries where recently created memories (< cutoffHours
   439	 * old at query time) surface in top-K when they are relevant.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"export interface|export type|export function|contingency|bootstrap|confidence|CI|MRR|PAUSE|RATIONALIZE|PROCEED|statistical|p<|channel|saveBM25|runBM25|relative|evaluateContingency\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
6:// search path (disabling vector, graph, and trigger channels)
16://   - The contingency decision matrix turns the measured MRR@5
17://     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
24:  computeMRR,
42:export interface BM25BaselineConfig {
45:  /** Top-K cutoff for metrics. Defaults per metric (MRR@5, NDCG@10, Recall@20, HitRate@1). */
52:export interface BM25BaselineMetrics {
59:/** Full result returned by runBM25Baseline(). */
60:export interface BM25BaselineResult {
64:  contingencyDecision: ContingencyDecision;
65:  /** Per-query MRR@5 values for bootstrap CI computation. */
66:  perQueryMRR?: number[];
67:  /** Bootstrap 95% CI for MRR@5 (computed if perQueryMRR available). */
68:  bootstrapCI?: BootstrapCIResult;
71:/** Decision produced by evaluateContingency() or evaluateContingencyRelative(). */
72:export interface ContingencyDecision {
73:  /** The MRR@5 value used to derive the decision. */
74:  bm25MRR: number;
77:  /** Gate action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED'. */
78:  action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED';
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: BM25-Only Baseline Runner (T008)
     3	// ---------------------------------------------------------------
     4	//
     5	// Runs the ground truth query set through the BM25/FTS5-only
     6	// search path (disabling vector, graph, and trigger channels)
     7	// and computes baseline metrics. Records results in eval DB.
     8	//
     9	// The baseline measurement establishes the "floor" — what simple
    10	// keyword search achieves without any semantic, graph, or trigger
    11	// augmentation.
    12	//
    13	// Design notes:
    14	//   - The search function is injected as a dependency so tests
    15	//     can use mocks without a live DB.
    16	//   - The contingency decision matrix turns the measured MRR@5
    17	//     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
    18	//   - recordBaselineMetrics() is a pure DB write — no network I/O.
    19	// ---------------------------------------------------------------
    20	
codex
I’ve pulled the gap registry and confirmed the exact names for 24–31. I’m now going function-by-function in each target file to confirm whether each capability is implemented, partially implemented, or still a real gap.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | sed -n '140,290p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   140	 *     BM25 is moderate — semantic/graph channels must demonstrably
   141	 *     improve over this baseline. Each additional channel needs
   142	 *     positive delta evidence.
   143	 *
   144	 *   MRR@5 < 0.50 → PROCEED
   145	 *     BM25 alone is weak — strong justification for multi-channel
   146	 *     retrieval. Proceed with hybrid search implementation.
   147	 *
   148	 * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
   149	 * @returns ContingencyDecision with threshold label, action, and interpretation.
   150	 */
   151	export function evaluateContingency(bm25MRR: number): ContingencyDecision {
   152	  if (bm25MRR >= 0.80) {
   153	    return {
   154	      bm25MRR,
   155	      mode: 'absolute',
   156	      threshold: '>=0.8',
   157	      action: 'PAUSE',
   158	      interpretation:
   159	        'BM25 alone is very strong — semantic/graph additions may not justify complexity. ' +
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | sed -n '290,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   290	export interface BootstrapCIResult {
   291	  /** Point estimate (mean MRR@5 across all queries). */
   292	  pointEstimate: number;
   293	  /** Lower bound of 95% CI. */
   294	  ciLower: number;
   295	  /** Upper bound of 95% CI. */
   296	  ciUpper: number;
   297	  /** CI width (ciUpper - ciLower). Narrower is more confident. */
   298	  ciWidth: number;
   299	  /** Number of bootstrap iterations. */
   300	  iterations: number;
   301	  /** Number of queries in the sample. */
   302	  sampleSize: number;
   303	  /** Whether the CI excludes the contingency threshold boundaries.
   304	   *  true = the decision is statistically significant at p<0.05. */
   305	  isSignificant: boolean;
   306	  /** Which threshold boundary was tested. */
   307	  testedBoundary: number;
   308	}
   309	
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | sed -n '430,590p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   430	
   431	    // Contingency decision (stored as JSON metadata on a sentinel row)
   432	    const contingencyMeta = JSON.stringify(result.contingencyDecision);
   433	    insertSnapshot.run(
   434	      evalRunId,
   435	      'bm25_contingency_decision',
   436	      result.contingencyDecision.bm25MRR,
   437	      channel,
   438	      queryCount,
   439	      contingencyMeta,
   440	      createdAt,
   441	    );
   442	  });
   443	
   444	  writeAll();
   445	}
   446	
   447	/* ---------------------------------------------------------------
   448	   4. BM25 BASELINE RUNNER
   449	--------------------------------------------------------------- */
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"export interface|export type|export function|feedback|selection|LLM|judge|agreement|ground truth|corpus|schema|save|record|history|merge|expand\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
5:// Ground Truth Expansion via Feedback + LLM-Judge
7:// Phase B: Collect implicit feedback from user memory selections.
8://   When a user selects a memory from search results, that selection
9://   is recorded as implicit relevance signal for ground truth expansion.
11:// Phase C: LLM-judge relevance labeling for ground truth expansion.
12://   This module provides a deterministic judge implementation that
14://   It can be replaced with a model-backed judge later without
15://   changing the persistence or agreement APIs.
19://   - LLM-judge interface is deterministic (non-stub fallback).
20://   - Agreement rate target: >= 80% between LLM-judge and manual labels.
28:export interface SelectionContext {
37:  /** Session ID for grouping selections. */
43:/** A recorded user selection event. */
44:export interface UserSelection {
51:  /** Context about the selection. */
53:  /** ISO timestamp of the selection. */
57:/** A relevance label produced by the LLM-judge. */
58:export interface LlmJudgeLabel {
61:  /** The memory ID being judged. */
64:   * Relevance grade assigned by the LLM-judge.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Ground Truth Feedback
     3	// ---------------------------------------------------------------
     4	//
     5	// Ground Truth Expansion via Feedback + LLM-Judge
     6	//
     7	// Phase B: Collect implicit feedback from user memory selections.
     8	//   When a user selects a memory from search results, that selection
     9	//   is recorded as implicit relevance signal for ground truth expansion.
    10	//
    11	// Phase C: LLM-judge relevance labeling for ground truth expansion.
    12	//   This module provides a deterministic judge implementation that
    13	//   scores query-memory relevance using lexical overlap heuristics.
    14	//   It can be replaced with a model-backed judge later without
    15	//   changing the persistence or agreement APIs.
    16	//
    17	// Design notes:
    18	//   - Selections are persisted to the eval DB for durability.
    19	//   - LLM-judge interface is deterministic (non-stub fallback).
    20	//   - Agreement rate target: >= 80% between LLM-judge and manual labels.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | sed -n '180,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   180	    .filter((token) => !JUDGE_STOP_WORDS.has(token));
   181	}
   182	
   183	function clamp01(value: number): number {
   184	  if (!Number.isFinite(value)) return 0;
   185	  if (value < 0) return 0;
   186	  if (value > 1) return 1;
   187	  return value;
   188	}
   189	
   190	/**
   191	 * Ensure the feedback tables exist.
   192	 * Idempotent — safe to call multiple times.
   193	 */
   194	function ensureFeedbackSchema(): void {
   195	  if (_feedbackSchemaEnsured) return;
   196	  try {
   197	    const db = getDb();
   198	    db.exec(FEEDBACK_SCHEMA_SQL);
   199	    _feedbackSchemaEnsured = true;
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | sed -n '340,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   340	 * @returns Array of deterministic LlmJudgeLabel values.
   341	 */
   342	export function generateLlmJudgeLabels(
   343	  querySelectionPairs: Array<{ queryId: string; memoryId: number; queryText: string; memoryContent: string }>,
   344	): LlmJudgeLabel[] {
   345	  return querySelectionPairs.map(pair => ({
   346	    ...(() => {
   347	      const queryText = pair.queryText ?? '';
   348	      const memoryContent = pair.memoryContent ?? '';
   349	      const queryTokens = [...new Set(tokenizeForJudge(queryText))];
   350	      const memoryTokenSet = new Set(tokenizeForJudge(memoryContent));
   351	
   352	      if (queryTokens.length === 0 || memoryTokenSet.size === 0) {
   353	        return {
   354	          queryId: pair.queryId,
   355	          memoryId: pair.memoryId,
   356	          relevance: 0,
   357	          confidence: 0,
   358	          reasoning: 'Heuristic judge: insufficient lexical signal (empty query or content tokens)',
   359	        };
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | sed -n '520,580p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
   520	    const manualRow = db.prepare(
   521	      'SELECT COUNT(*) as cnt FROM eval_ground_truth',
   522	    ).get() as { cnt: number } | undefined;
   523	    const manualPairs = manualRow?.cnt ?? 0;
   524	
   525	    // User selection pairs (distinct query_id + memory_id combinations)
   526	    const selectionRow = db.prepare(
   527	      'SELECT COUNT(DISTINCT query_id || \':\' || memory_id) as cnt FROM eval_user_selections',
   528	    ).get() as { cnt: number } | undefined;
   529	    const selectionPairs = selectionRow?.cnt ?? 0;
   530	
   531	    // LLM-judge pairs
   532	    const llmRow = db.prepare(
   533	      'SELECT COUNT(*) as cnt FROM eval_llm_judge_labels',
   534	    ).get() as { cnt: number } | undefined;
   535	    const llmJudgePairs = llmRow?.cnt ?? 0;
   536	
   537	    return {
   538	      manualPairs,
   539	      selectionPairs,
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"export interface|export function|diversity|gate|hard negative|manual|complexity|intent|duplicate|validateGroundTruthDiversity|Diversity\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
10://   validateGroundTruthDiversity() — check all diversity gates
30:export interface GroundTruthDataset {
37:/** Per-dimension diversity validation result. */
38:export interface DiversityGate {
46:/** Full diversity validation report. */
47:export interface DiversityValidationReport {
50:  gates: DiversityGate[];
55:export interface LoadGroundTruthOptions {
56:  /** If true, DELETE existing rows before inserting. Default: false (skip duplicates). */
104:export function generateGroundTruth(): GroundTruthDataset {
131: * IGNORE to skip duplicates (based on UNIQUE(query_id, memory_id)
138:export function loadGroundTruth(
150:      (id, query, intent, category)
166:        q.intentType,
192:   5. validateGroundTruthDiversity()
193:   Checks all 6 hard gates and returns a structured report.
197: * Validate that the query dataset meets all diversity hard gates.
199: * Hard gates:
201: *   2. ≥5 queries per intent type (all 7 types)
202: *   3. ≥3 distinct complexity tiers present
codex
I’ve confirmed there is explicit hard-gate logic for diversity and multiple decision/stat testing components. I’m collecting exact line ranges now so each gap report is fully traceable.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Ground Truth Generator
     3	// ---------------------------------------------------------------
     4	// T007: Functions for generating, loading, and validating the
     5	// synthetic ground truth dataset for retrieval evaluation.
     6	//
     7	// Exports:
     8	//   generateGroundTruth()          — produce the full dataset
     9	//   loadGroundTruth(evalDb)        — populate eval DB tables
    10	//   validateGroundTruthDiversity() — check all diversity gates
    11	// ---------------------------------------------------------------
    12	
    13	import type Database from 'better-sqlite3';
    14	
    15	import {
    16	  GROUND_TRUTH_QUERIES,
    17	  GROUND_TRUTH_RELEVANCES,
    18	  QUERY_DISTRIBUTION,
    19	  type GroundTruthQuery,
    20	  type GroundTruthRelevance,
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | sed -n '180,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   180	        notes,
   181	      );
   182	      if (result.changes > 0) relevancesInserted++;
   183	    }
   184	  });
   185	
   186	  loadAll();
   187	
   188	  return { queriesInserted, relevancesInserted };
   189	}
   190	
   191	/* ---------------------------------------------------------------
   192	   5. validateGroundTruthDiversity()
   193	   Checks all 6 hard gates and returns a structured report.
   194	--------------------------------------------------------------- */
   195	
   196	/**
   197	 * Validate that the query dataset meets all diversity hard gates.
   198	 *
   199	 * Hard gates:
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"export interface|export type|export function|ablation|sign test|p-value|pvalue|two-sided|helped|hurt|unchanged|significance|alpha|channel|delta|wilcoxon|bootstrap|normal\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
5:// Controlled ablation studies for search channel contribution analysis.
6:// Selectively disables one search channel at a time, measures Recall@20
7:// delta against a full-pipeline baseline, and attributes per-channel
14:// - Paired sign-test for statistical significance
16:// - Human-readable ablation report formatting
43: * Anything else (undefined, "false", "1", ...) disables ablation studies.
45:export function isAblationEnabled(): boolean {
51:/** Known search channels that can be ablated. */
52:export type AblationChannel = 'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger';
54:/** All channels available for ablation. */
63:/** Configuration for an ablation study. */
64:export interface AblationConfig {
66:  channels: AblationChannel[];
76: * A search function that the ablation runner calls for each query.
77: * The runner passes channel disable flags; the function must respect them.
80: * @param disabledChannels - Set of channel names to disable for this run.
83:export type AblationSearchFn = (
88:/** Result of ablating a single channel. */
89:export interface AblationResult {
90:  /** The channel that was disabled. */
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Ablation Framework (R13-S3)
     3	// ---------------------------------------------------------------
     4	//
     5	// Controlled ablation studies for search channel contribution analysis.
     6	// Selectively disables one search channel at a time, measures Recall@20
     7	// delta against a full-pipeline baseline, and attributes per-channel
     8	// contribution to retrieval quality.
     9	//
    10	// Features:
    11	// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
    12	// - Ablation runner with ground truth evaluation
    13	// - Delta calculation (baseline vs ablated Recall@20)
    14	// - Paired sign-test for statistical significance
    15	// - Results storage in eval_metric_snapshots table
    16	// - Human-readable ablation report formatting
    17	//
    18	// CRITICAL: Ablation studies are experimental and gated behind
    19	// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
    20	// and is a no-op when the flag is not set.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '220,400p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   220	 * @returns p-value, or null if fewer than 5 non-tied observations.
   221	 *
   222	 * Precision note: Uses log-space computation to avoid integer overflow
   223	 * for large n (the naive iterative binomial coefficient exceeds
   224	 * Number.MAX_SAFE_INTEGER for n > ~50).
   225	 */
   226	function signTestPValue(nPositive: number, nNegative: number): number | null {
   227	  const n = nPositive + nNegative;
   228	  if (n < 5) return null; // Insufficient data for meaningful test
   229	
   230	  // Two-sided sign test: P(X <= min(n+, n-)) under Binomial(n, 0.5)
   231	  const k = Math.min(nPositive, nNegative);
   232	
   233	  // AI-WHY: Log-space binomial coefficient to avoid overflow for large n
   234	  function logBinomial(nVal: number, kVal: number): number {
   235	    if (kVal < 0 || kVal > nVal) return -Infinity;
   236	    if (kVal === 0 || kVal === nVal) return 0;
   237	    let result = 0;
   238	    for (let i = 0; i < kVal; i++) {
   239	      result += Math.log(nVal - i) - Math.log(i + 1);
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '400,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   400	      const disabledSet = new Set<AblationChannel>([channel]);
   401	      const ablatedRecalls: Map<number, number> = new Map();
   402	      const ablatedMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number }> = new Map();
   403	      let failedQuery: GroundTruthQuery | null = null;
   404	
   405	      try {
   406	        for (const q of queries) {
   407	          const gt = getGroundTruthForQuery(q.id);
   408	          if (gt.length === 0) continue;
   409	
   410	          failedQuery = q;
   411	          const t0 = performance.now();
   412	          const results = await Promise.resolve(searchFn(q.query, disabledSet));
   413	          const latencyMs = performance.now() - t0;
   414	
   415	          const recall = computeRecall(results, gt, recallK);
   416	          ablatedRecalls.set(q.id, recall);
   417	          ablatedMetricsPerQuery.set(q.id, { metrics: computeQueryMetrics(results, gt), latencyMs });
   418	        }
   419	
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '620,770p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   620	  lines.push(`- **Duration:** ${report.durationMs}ms`);
   621	  lines.push(`- **Queries evaluated:** ${report.results[0]?.queryCount ?? 0}`);
   622	  lines.push(``);
   623	
   624	  // Sort by absolute delta descending (most impactful first)
   625	  const sorted = [...report.results].sort(
   626	    (a, b) => Math.abs(b.delta) - Math.abs(a.delta),
   627	  );
   628	
   629	  lines.push(`| Channel | Baseline | Ablated | Delta | p-value | Ch. Helped | Ch. Hurt | Unchanged | Verdict |`);
   630	  lines.push(`|---------|----------|---------|-------|---------|------------|----------|-----------|---------|`);
   631	
   632	  for (const r of sorted) {
   633	    const sig = r.pValue !== null && r.pValue < 0.05 ? '*' : '';
   634	    const pStr = r.pValue !== null ? r.pValue.toFixed(4) : 'n/a';
   635	    const verdict = getVerdict(r);
   636	
   637	    lines.push(
   638	      `| ${r.channel} ` +
   639	      `| ${r.baselineRecall20.toFixed(4)} ` +
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Channel Attribution
     3	// ---------------------------------------------------------------
     4	//
     5	// Tags each search result with its source channel(s) for evaluation analysis.
     6	// Computes Exclusive Contribution Rate: how often each channel is the SOLE
     7	// source for a result in top-K.
     8	//
     9	// Channels: vector, fts, bm25, graph, trigger (extensible).
    10	//
    11	// Design notes:
    12	//   - Pure functions — no DB access, no side effects.
    13	//   - Channel names are lowercase strings matching existing conventions
    14	//     (see rrf-fusion.ts SOURCE_TYPES and eval-logger.ts channel parameter).
    15	// ---------------------------------------------------------------
    16	
    17	/* --- 1. TYPES --- */
    18	
    19	/** Known retrieval channels (extensible — any lowercase string accepted). */
    20	export type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'trigger' | string;
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Retrieval Telemetry (C136-12)
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Captures latency, mode selection, fallback, and quality-proxy
     5	// dimensions for governance review and Wave 2 gate decisions.
     6	// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
     7	// ---------------------------------------------------------------
     8	
     9	import {
    10	  sanitizeRetrievalTracePayload,
    11	} from './trace-schema';
    12	import type {
    13	  TelemetryTracePayload,
    14	} from './trace-schema';
    15	
    16	/* ---------------------------------------------------------------
    17	   1. FEATURE FLAG
    18	--------------------------------------------------------------- */
    19	
    20	/**
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Telemetry Trace Schema
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Canonical schema + runtime validation for retrieval trace payloads
     5	// used by telemetry serialization. Unknown or sensitive fields are
     6	// excluded from canonical payloads.
     7	// ---------------------------------------------------------------
     8	
     9	import type { RetrievalStage } from '@spec-kit/shared/contracts/retrieval-trace';
    10	
    11	const RETRIEVAL_TRACE_STAGES: RetrievalStage[] = [
    12	  'candidate',
    13	  'filter',
    14	  'fusion',
    15	  'rerank',
    16	  'fallback',
    17	  'final-rank',
    18	];
    19	
    20	const TRACE_STAGE_SET: Set<RetrievalStage> = new Set(RETRIEVAL_TRACE_STAGES);
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts | sed -n '1,460p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Consumption Logger (T004 — Agent UX Instrumentation)
     3	// ---------------------------------------------------------------
     4	// Logs agent consumption events to a SQLite table for G-NEW-2
     5	// requirement analysis: what agents query, what results they get,
     6	// and (via hooks) which results they actually use.
     7	//
     8	// Table: consumption_log
     9	// Feature flag: SPECKIT_CONSUMPTION_LOG (default true)
    10	// ---------------------------------------------------------------
    11	
    12	import Database from 'better-sqlite3';
    13	
    14	/* ---------------------------------------------------------------
    15	   1. TYPES
    16	--------------------------------------------------------------- */
    17	
    18	/**
    19	 * Defines the ConsumptionEventType type.
    20	 */
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Scoring Observability (T010)
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Lightweight observability logging for N4 cold-start boost and
     5	// TM-01 interference scoring values at query time.
     6	// Sampled at 5% of queries to avoid performance overhead.
     7	// All logging is best-effort (fail-safe, never throws).
     8	// Feature flags:
     9	//   SPECKIT_NOVELTY_BOOST     — N4 cold-start boost
    10	//   SPECKIT_INTERFERENCE_SCORE — TM-01 interference penalty
    11	// ---------------------------------------------------------------
    12	
    13	import type Database from 'better-sqlite3';
    14	
    15	// ---------------------------------------------------------------
    16	// 1. CONSTANTS
    17	// ---------------------------------------------------------------
    18	
    19	/** 5% sampling rate — logs ~1 in 20 scoring calls */
    20	export const SAMPLING_RATE = 0.05;
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md | sed -n '1,290p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	---
     2	title: "Telemetry"
     3	description: "Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs."
     4	trigger_phrases:
     5	  - "retrieval telemetry"
     6	  - "latency metrics"
     7	  - "quality metrics"
     8	---
     9	
    10	# Telemetry
    11	
    12	> Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs.
    13	
    14	---
    15	
    16	## TABLE OF CONTENTS
    17	<!-- ANCHOR:table-of-contents -->
    18	
    19	- [1. OVERVIEW](#1--overview)
    20	- [2. STRUCTURE](#2--structure)
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Composite Scoring
     3	// ---------------------------------------------------------------
     4	
     5	export * from '../../scoring/composite-scoring';
     6	/**
     7	 * Re-exports related public types.
     8	 */
     9	export type * from '../../scoring/composite-scoring';
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	---
     2	title: "Spec Kit Memory  -- Feature Catalog"
     3	description: "Unified reference combining the complete system feature inventory and the refinement program changelog for the Spec Kit Memory MCP server."
     4	---
     5	
     6	# Spec Kit Memory  -- Feature Catalog
     7	
     8	This document combines two complementary views of the Spec Kit Memory MCP server into a single reference. The **System Reference** section describes what the system is today  -- every tool, pipeline stage and capability organized by MCP layer. The **Refinement Program** section describes what was changed and why  -- every improvement delivered across the refinement program, with ticket IDs and implementation details.
     9	
    10	## Contents
    11	
    12	- [Retrieval](#retrieval)
    13	  - [Unified context retrieval (memory_context)](#unified-context-retrieval-memory_context)
    14	  - [Semantic and lexical search (memory_search)](#semantic-and-lexical-search-memory_search)
    15	  - [Trigger phrase matching (memory_match_triggers)](#trigger-phrase-matching-memory_match_triggers)
    16	  - [Hybrid search pipeline](#hybrid-search-pipeline)
    17	  - [4-stage pipeline architecture](#4-stage-pipeline-architecture)
    18	  - [BM25 trigger phrase re-index gate](#bm25-trigger-phrase-re-index-gate)
    19	  - [AST-level section retrieval tool](#ast-level-section-retrieval-tool)
    20	  - [Quality-aware 3-tier search fallback](#quality-aware-3-tier-search-fallback)
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"Document-Type-Aware|document type|inversion rate|constitutional surfacing|importance-weighted recall|cold-start detection|intent-weighted|BM25 contingency|PAUSE|RATIONALIZE|ground truth expansion|LLM-judge|diversity gate|ablation significance|sign-test|Exclusive Contribution Rate|ECR|extended telemetry|stage-level latency|trace payload|channel attribution\" .opencode/skill/system-spec-kit/feature_catalog" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:76:  - [Shadow scoring and channel attribution](#shadow-scoring-and-channel-attribution)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:217:Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:853:Seven diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant, precision@K and F1@K expose precision/recall balance, and intent-weighted NDCG adjusts ranking quality by query type.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:954:### Shadow scoring and channel attribution
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:956:Full A/B comparison infrastructure ran alternative scoring algorithms in parallel, logging results without affecting live ranking. The system computed detailed comparison metrics including Kendall tau rank correlation, per-result score deltas, and production-only versus shadow-only result sets. Channel attribution tagged each result with its source channels and computed Exclusive Contribution Rate per channel: how often each channel was the sole source for a result in the top-k window.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:958:Ground truth expansion via implicit user selection tracking and an LLM-judge stub interface were included for future corpus growth.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:1:# Shadow scoring and channel attribution
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:5:Full A/B comparison infrastructure ran alternative scoring algorithms in parallel, logging results without affecting live ranking. The system computed detailed comparison metrics including Kendall tau rank correlation, per-result score deltas, and production-only versus shadow-only result sets. Channel attribution tagged each result with its source channels and computed Exclusive Contribution Rate per channel: how often each channel was the sole source for a result in the top-k window.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:7:Ground truth expansion via implicit user selection tracking and an LLM-judge stub interface were included for future corpus growth.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:35:- Source feature title: Shadow scoring and channel attribution
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md:7:Seven diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant, precision@K and F1@K expose precision/recall balance, and intent-weighted NDCG adjusts ranking quality by query type.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:15:Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && ls -1 .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
01-evaluation-database-and-schema.md
02-core-metric-computation.md
03-observer-effect-mitigation.md
04-full-context-ceiling-evaluation.md
05-quality-proxy-formula.md
06-synthetic-ground-truth-corpus.md
07-bm25-only-baseline.md
08-agent-consumption-instrumentation.md
09-scoring-observability.md
10-full-reporting-and-ablation-study-framework.md
11-shadow-scoring-and-channel-attribution.md
12-test-quality-improvements.md
13-evaluation-and-housekeeping-fixes.md
14-cross-ai-validation-fixes.md
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"document type|inversion|constitutional|importance-weighted|cold-start|intent-weighted|contingency|PAUSE|RATIONALIZE|PROCEED|bootstrap|95%|selection|LLM-judge|agreement|corpus|diversity|hard negative|manual queries|ablation|sign-test|p-value|helped|hurt|Exclusive Contribution Rate|ECR|latency|fallback|trace|telemetry\" .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement .opencode/skill/system-spec-kit/feature_catalog/07--evaluation .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:7:Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:11:When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:15:Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:111:| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:112:| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Lib | Retrieval telemetry |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:113:| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:114:| `mcp_server/lib/telemetry/trace-schema.ts` | Lib | Trace schema definitions |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:132:| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:231:| `mcp_server/tests/retrieval-telemetry.vitest.ts` | Retrieval telemetry tests |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:232:| `mcp_server/tests/retrieval-trace.vitest.ts` | Retrieval trace tests |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:1:# Ablation studies (eval_run_ablation)
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:5:This tool runs controlled ablation studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:7:The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results).
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:9:Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. The tool requires `SPECKIT_ABLATION=true` to activate. When the flag is off, the MCP handler returns an explicit disabled-flag error and does not execute an ablation run.
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:31:| `mcp_server/lib/eval/ablation-framework.ts` | Lib | Ablation study framework |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:99:| `mcp_server/tests/ablation-framework.vitest.ts` | Ablation framework tests |
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:175:- Source feature title: Ablation studies (eval_run_ablation)
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md:14:- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md:7:FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability, and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md:24:| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |
codex
I’ve now cross-checked the implementation and the current feature-catalog docs to avoid mislabeling stale items. I’m doing one final pass to decide which entries are still real documentation gaps versus already-covered features.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && nl -ba .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
usage: nl [-p] [-b type] [-d delim] [-f type] [-h type] [-i incr] [-l num]
          [-n format] [-s sep] [-v startnum] [-w width] [file]
codex
I hit a command formatting issue while reading multiple catalog files at once; I’ll pull them one by one and finish the status calls next.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && for f in .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,120p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
===== .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md =====
     1	# Core metric computation
     2	
     3	## Current Reality
     4	
     5	Eleven metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).
     6	
     7	Seven diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant, precision@K and F1@K expose precision/recall balance, and intent-weighted NDCG adjusts ranking quality by query type.
     8	
     9	This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.
    10	
    11	## Source Files
    12	
    13	### Implementation
    14	
    15	| File | Layer | Role |
    16	|------|-------|------|
    17	| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
    18	
    19	### Tests
codex
---
GAP_NUMBER: 24
FEATURE_NAME: Document-Type-Aware Scoring
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:189-203,414-433,504-507`
DRAFT_DESCRIPTION: Composite scoring applies explicit `document_type` multipliers (for `spec`, `decision_record`, `plan`, etc.) before final clamping. It also adds query-keyword/type alignment bonuses via a per-document-type keyword map. This is active ranking logic, not metadata-only tagging. Unknown types safely fall back to neutral weighting.
SUGGESTED_CATEGORY: `11--scoring-and-calibration`
SIGNIFICANCE: MEDIUM
NOTES: This implementation depth goes beyond generic score normalization docs.
---

---
GAP_NUMBER: 25
FEATURE_NAME: Diagnostic Retrieval Metrics Suite
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:4-5,42-56,204-239,322-347,363-378,392-433,451-485,510-542,558-586`
DRAFT_DESCRIPTION: `eval-metrics.ts` implements an 11-metric package (core + diagnostics), including inversion rate, constitutional surfacing, importance-weighted recall, cold-start detection, precision/F1, and intent-weighted NDCG. `computeAllMetrics()` exposes these in one call. The module is pure computation (no DB side effects), so it can be reused in runners and tests consistently.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Capability is clearly implemented and testable as an independent metrics engine.
---

---
GAP_NUMBER: 26
FEATURE_NAME: BM25 Contingency Gate
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:151-189,216-281,321-389,472-559`
DRAFT_DESCRIPTION: The BM25 baseline module implements explicit gate actions (`PAUSE`, `RATIONALIZE`, `PROCEED`) based on MRR thresholds, and computes bootstrap 95% confidence intervals for statistical confidence checks. It records per-query MRR and derives significance from CI boundary exclusion. The runner returns both decision and CI artifacts in the baseline result payload.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: HIGH
NOTES: Includes both absolute and relative contingency modes in code.
---

---
GAP_NUMBER: 27
FEATURE_NAME: Feedback-Driven Ground-Truth Expansion
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:121-145,227-260,342-388,399-431,450-500,514-553`
DRAFT_DESCRIPTION: The feedback module persists implicit user selections, generates/stores LLM-judge relevance labels, computes judge-vs-manual agreement, and tracks corpus size by source. It defines dedicated tables for selection and judge labels. Agreement output includes exact/tolerant rates, target checks, and mean grade difference. Source-wise corpus accounting is implemented in SQL.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: The “LLM judge” path is deterministic heuristic logic today, but fully wired operationally.
---

---
GAP_NUMBER: 28
FEATURE_NAME: Ground-Truth Diversity Gate
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:67-84,211-302`
DRAFT_DESCRIPTION: `validateGroundTruthDiversity()` enforces hard diversity checks for total size, intent coverage, complexity coverage, manual-query quota, hard negatives, and duplicate query detection. It returns a structured per-gate report with pass/fail status and summary text. This is runtime validation logic, not just dataset documentation.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Code currently enforces 7 gates; one comment line still says “6 hard gates.”
---

---
GAP_NUMBER: 29
FEATURE_NAME: Ablation Significance Testing
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:226-254,358-460,629-653`
DRAFT_DESCRIPTION: The ablation framework computes per-channel deltas and applies a two-sided exact sign test (`pValue`) for significance. It explicitly tracks `queriesChannelHelped`, `queriesChannelHurt`, and `queriesUnchanged`. Results are surfaced in structured reports and significance-marked output formatting. This is full statistical attribution, not simple delta logging.
SUGGESTED_CATEGORY: `07--evaluation`
SIGNIFICANCE: HIGH
NOTES: Uses log-space binomial math for stability at larger sample sizes.
---

---
GAP_NUMBER: 30
FEATURE_NAME: Exclusive Contribution Rate
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:99-131,146-195,208-250`
DRAFT_DESCRIPTION: Channel attribution tags each result with contributing channels, marks exclusivity, and computes per-channel ECR (`exclusiveCount / totalInTopK`). The report also tracks multi-channel convergence, single-channel counts, unattributed results, and channel coverage. This provides direct unique-value vs overlap diagnostics for retrieval channels.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Supports extensible channel names beyond fixed enum-like values.
---

---
GAP_NUMBER: 31
FEATURE_NAME: Extended Retrieval Telemetry
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:20-26,43-86,129-204,210-237,243-310`; `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:21-33,66-137,139-189`
DRAFT_DESCRIPTION: Telemetry captures stage-level latency, mode/override/pressure, fallback trigger state, and quality-proxy inputs/scores. It also supports canonical sanitized trace payload attachment via strict schema sanitization/validation. Serialization keeps output constrained and drops invalid trace payloads. Collection is feature-flag gated.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: HIGH
NOTES: Code default for `SPECKIT_EXTENDED_TELEMETRY` is effectively disabled unless explicitly set to `true`.
---

NEW capabilities found (not in gaps 24–31):

---
GAP_NUMBER: NEW-1
FEATURE_NAME: Relative BM25-vs-Hybrid Contingency Mode
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:216-281`
DRAFT_DESCRIPTION: In addition to absolute thresholds, BM25 contingency supports ratio-based decisions against hybrid MRR (`bm25MRR / hybridMRR`). It returns mode, ratio, and action in a structured decision object. This creates a more deployment-relevant gate when hybrid baseline is known.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: This is materially beyond the basic absolute-threshold gate.
---

---
GAP_NUMBER: NEW-2
FEATURE_NAME: Multi-Metric Ablation Diagnostics (9 Metrics)
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:295-337,572-589,665-691`
DRAFT_DESCRIPTION: Ablation computes and persists a 9-metric delta profile per channel (MRR@5, precision/recall@5, NDCG@5, MAP, hit-rate, latency p50/p95, token usage placeholder). Report output includes a dedicated full-metric breakdown table. This enables richer trade-off analysis than Recall@20 alone.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Particularly useful for diagnosing quality-latency tradeoffs.
---

---
GAP_NUMBER: NEW-3
FEATURE_NAME: Consumption Pattern Mining over Telemetry Log
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:263-400`
DRAFT_DESCRIPTION: The consumption logger includes SQL-driven pattern detection for repeated queries, zero-result queries, low-selection behavior, intent mismatch, and session-heavy usage. It returns categorized counts with examples for operator diagnostics. This is implemented even though runtime logging is currently disabled by flag behavior.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: LOW
NOTES: Instrumentation path is present; `isConsumptionLogEnabled()` currently hardcodes `false`.
---

---
GAP_NUMBER: NEW-4
FEATURE_NAME: Sampled Scoring Observability Store
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:19-53,71-95,105-151,162-207`
DRAFT_DESCRIPTION: A dedicated observability subsystem logs sampled scoring observations (5%) to SQLite and computes aggregate drift stats (boost usage, interference penalties, score deltas). It is fail-safe by design and isolated from ranking behavior. This provides post-hoc calibration visibility for scoring signals.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Directly integrated from composite scoring via sampled logging hooks.
---
tokens used
118,980
---
GAP_NUMBER: 24
FEATURE_NAME: Document-Type-Aware Scoring
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:189-203,414-433,504-507`
DRAFT_DESCRIPTION: Composite scoring applies explicit `document_type` multipliers (for `spec`, `decision_record`, `plan`, etc.) before final clamping. It also adds query-keyword/type alignment bonuses via a per-document-type keyword map. This is active ranking logic, not metadata-only tagging. Unknown types safely fall back to neutral weighting.
SUGGESTED_CATEGORY: `11--scoring-and-calibration`
SIGNIFICANCE: MEDIUM
NOTES: This implementation depth goes beyond generic score normalization docs.
---

---
GAP_NUMBER: 25
FEATURE_NAME: Diagnostic Retrieval Metrics Suite
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:4-5,42-56,204-239,322-347,363-378,392-433,451-485,510-542,558-586`
DRAFT_DESCRIPTION: `eval-metrics.ts` implements an 11-metric package (core + diagnostics), including inversion rate, constitutional surfacing, importance-weighted recall, cold-start detection, precision/F1, and intent-weighted NDCG. `computeAllMetrics()` exposes these in one call. The module is pure computation (no DB side effects), so it can be reused in runners and tests consistently.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Capability is clearly implemented and testable as an independent metrics engine.
---

---
GAP_NUMBER: 26
FEATURE_NAME: BM25 Contingency Gate
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:151-189,216-281,321-389,472-559`
DRAFT_DESCRIPTION: The BM25 baseline module implements explicit gate actions (`PAUSE`, `RATIONALIZE`, `PROCEED`) based on MRR thresholds, and computes bootstrap 95% confidence intervals for statistical confidence checks. It records per-query MRR and derives significance from CI boundary exclusion. The runner returns both decision and CI artifacts in the baseline result payload.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: HIGH
NOTES: Includes both absolute and relative contingency modes in code.
---

---
GAP_NUMBER: 27
FEATURE_NAME: Feedback-Driven Ground-Truth Expansion
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:121-145,227-260,342-388,399-431,450-500,514-553`
DRAFT_DESCRIPTION: The feedback module persists implicit user selections, generates/stores LLM-judge relevance labels, computes judge-vs-manual agreement, and tracks corpus size by source. It defines dedicated tables for selection and judge labels. Agreement output includes exact/tolerant rates, target checks, and mean grade difference. Source-wise corpus accounting is implemented in SQL.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: The “LLM judge” path is deterministic heuristic logic today, but fully wired operationally.
---

---
GAP_NUMBER: 28
FEATURE_NAME: Ground-Truth Diversity Gate
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:67-84,211-302`
DRAFT_DESCRIPTION: `validateGroundTruthDiversity()` enforces hard diversity checks for total size, intent coverage, complexity coverage, manual-query quota, hard negatives, and duplicate query detection. It returns a structured per-gate report with pass/fail status and summary text. This is runtime validation logic, not just dataset documentation.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Code currently enforces 7 gates; one comment line still says “6 hard gates.”
---

---
GAP_NUMBER: 29
FEATURE_NAME: Ablation Significance Testing
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:226-254,358-460,629-653`
DRAFT_DESCRIPTION: The ablation framework computes per-channel deltas and applies a two-sided exact sign test (`pValue`) for significance. It explicitly tracks `queriesChannelHelped`, `queriesChannelHurt`, and `queriesUnchanged`. Results are surfaced in structured reports and significance-marked output formatting. This is full statistical attribution, not simple delta logging.
SUGGESTED_CATEGORY: `07--evaluation`
SIGNIFICANCE: HIGH
NOTES: Uses log-space binomial math for stability at larger sample sizes.
---

---
GAP_NUMBER: 30
FEATURE_NAME: Exclusive Contribution Rate
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:99-131,146-195,208-250`
DRAFT_DESCRIPTION: Channel attribution tags each result with contributing channels, marks exclusivity, and computes per-channel ECR (`exclusiveCount / totalInTopK`). The report also tracks multi-channel convergence, single-channel counts, unattributed results, and channel coverage. This provides direct unique-value vs overlap diagnostics for retrieval channels.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Supports extensible channel names beyond fixed enum-like values.
---

---
GAP_NUMBER: 31
FEATURE_NAME: Extended Retrieval Telemetry
STATUS: CONFIRMED_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:20-26,43-86,129-204,210-237,243-310`; `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:21-33,66-137,139-189`
DRAFT_DESCRIPTION: Telemetry captures stage-level latency, mode/override/pressure, fallback trigger state, and quality-proxy inputs/scores. It also supports canonical sanitized trace payload attachment via strict schema sanitization/validation. Serialization keeps output constrained and drops invalid trace payloads. Collection is feature-flag gated.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: HIGH
NOTES: Code default for `SPECKIT_EXTENDED_TELEMETRY` is effectively disabled unless explicitly set to `true`.
---

NEW capabilities found (not in gaps 24–31):

---
GAP_NUMBER: NEW-1
FEATURE_NAME: Relative BM25-vs-Hybrid Contingency Mode
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:216-281`
DRAFT_DESCRIPTION: In addition to absolute thresholds, BM25 contingency supports ratio-based decisions against hybrid MRR (`bm25MRR / hybridMRR`). It returns mode, ratio, and action in a structured decision object. This creates a more deployment-relevant gate when hybrid baseline is known.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: This is materially beyond the basic absolute-threshold gate.
---

---
GAP_NUMBER: NEW-2
FEATURE_NAME: Multi-Metric Ablation Diagnostics (9 Metrics)
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:295-337,572-589,665-691`
DRAFT_DESCRIPTION: Ablation computes and persists a 9-metric delta profile per channel (MRR@5, precision/recall@5, NDCG@5, MAP, hit-rate, latency p50/p95, token usage placeholder). Report output includes a dedicated full-metric breakdown table. This enables richer trade-off analysis than Recall@20 alone.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Particularly useful for diagnosing quality-latency tradeoffs.
---

---
GAP_NUMBER: NEW-3
FEATURE_NAME: Consumption Pattern Mining over Telemetry Log
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:263-400`
DRAFT_DESCRIPTION: The consumption logger includes SQL-driven pattern detection for repeated queries, zero-result queries, low-selection behavior, intent mismatch, and session-heavy usage. It returns categorized counts with examples for operator diagnostics. This is implemented even though runtime logging is currently disabled by flag behavior.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: LOW
NOTES: Instrumentation path is present; `isConsumptionLogEnabled()` currently hardcodes `false`.
---

---
GAP_NUMBER: NEW-4
FEATURE_NAME: Sampled Scoring Observability Store
STATUS: NEW_GAP
SOURCE_FILES: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:19-53,71-95,105-151,162-207`
DRAFT_DESCRIPTION: A dedicated observability subsystem logs sampled scoring observations (5%) to SQLite and computes aggregate drift stats (boost usage, interference penalties, score deltas). It is fail-safe by design and isolated from ranking behavior. This provides post-hoc calibration visibility for scoring signals.
SUGGESTED_CATEGORY: `09--evaluation-and-measurement`
SIGNIFICANCE: MEDIUM
NOTES: Directly integrated from composite scoring via sampled logging hooks.
---
