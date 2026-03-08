OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-4bc3-73c0-9f99-3f071b59e6dc
--------
user
You are a feature catalog verification agent. Read each feature snippet file in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/ (6 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying the six feature snippets in `12--query-intelligence` against the actual `mcp_server` code, path by path. I’ll first inventory the snippet files and read their `Current Reality` and `Source Files` sections, then I’ll trace those paths in the codebase and note any mismatches or missing implementation files.
exec
/bin/zsh -lc "pwd && rg --files '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md
 succeeded in 52ms:
AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
codex
I’ve confirmed the six target snippet files and there isn’t a deeper `AGENTS.md` governing that feature catalog subtree. Next I’m reading the snippets themselves so I can extract each feature’s claimed behavior and listed source files before checking the implementation.
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Query complexity router

## Current Reality

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers based on term count, character count, trigger phrase presence and stop-word ratio. Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

When the `SPECKIT_COMPLEXITY_ROUTER` flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

The router's classification tier (`routeResult.tier`) is propagated into `traceMetadata.queryComplexity` in hybrid search (CHK-038), making it available in response envelopes when `includeTrace: true`. The formatter reads this via a fallback path from `traceMetadata` when stage metadata is unavailable.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |
| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing |
 succeeded in 51ms:
# Relative score fusion in shadow mode

## Current Reality

RRF has been the fusion method since day one, but is it the best option? Relative Score Fusion runs alongside RRF in shadow mode to find out.

Three RSF variants are implemented: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). RSF results are logged for evaluation comparison but do not affect actual ranking.

Kendall tau correlation between RSF and RRF rankings is computed at sprint exit to measure how much the two methods diverge. If RSF consistently outperforms, a future sprint can switch the primary fusion method with measured evidence.

**Sprint 8 update:** The `isRsfEnabled()` feature flag function was removed as dead code. The dead RSF branch in `hybrid-search.ts` (which was gated behind this flag returning `false`) was also removed. The RSF fusion module (`rsf-fusion.ts`) retains its core fusion logic for potential future activation, but the flag guard function is gone.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/rsf-fusion.ts` | Lib | Relative score fusion |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |
 succeeded in 51ms:
# Confidence-based result truncation

## Current Reality

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled: NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |

### Tests

 succeeded in 51ms:
# Dynamic token budget allocation

## Current Reality

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead (~12 tokens per result, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |

### Tests
 succeeded in 50ms:
# Channel min-representation

## Current Reality

A strong vector channel can monopolize the top-k results, pushing out graph and lexical results entirely. Channel min-representation fixes that.

After fusion, the system checks that every channel which returned results has at least one representative in the top-k window. Results below a 0.005 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel. The floor was lowered from 0.2 to 0.005 during Sprint 8 remediation because RRF scores typically fall in the 0.01-0.03 range, and the original 0.2 threshold was filtering out virtually all RRF-sourced results.

Promoted items are appended to the result list and the entire set is re-sorted by score so ranking integrity is preserved. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |

### Tests

 succeeded in 50ms:
# Query expansion

## Current Reality

Embedding-based query expansion broadens retrieval for complex queries by mining similar memories from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.

When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
codex
I’ve pulled the six snippet definitions. The next pass is the code reality check: reading the actual implementation files and tracing where these features are wired into hybrid search, so I can tell the difference between “exists in isolation” and “is really part of the pipeline.”
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/mcp_server/lib/search' '.opencode/skill/system-spec-kit/mcp_server/shared' '.opencode/skill/system-spec-kit/mcp_server/tests' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"queryComplexity|complexity|confidence truncation|channel min|min representation|RSF|relative score|embedding expansion|dynamic token|token budget|query expansion|query router|query classifier|routeResult|includeTrace|SPECKIT_\" '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
rg: .opencode/skill/system-spec-kit/mcp_server/shared: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
 succeeded in 50ms:
Total output lines: 1640

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:221:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:338:    // T205: Enforce per-layer token budgets with actual truncation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:376:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:384:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:391:        // Non-JSON response, skip token budget injection
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:704:  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:705:  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:723:        console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:738:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:743:  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:783:    console.error('[context-server] Set SPECKIT_EAGER_WARMUP=true to restore eager warmup');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:989:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:33:// AI-TRACE: T005: Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:35:// AI-TRACE: T005: Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:63:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:142:   Enforces per-layer/per-mode token budgets by estimating the
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:148: * T205: Enforce token budget on strategy results.
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Query Classifier
// ---------------------------------------------------------------
/* --- 1. TYPES & CONSTANTS --- */

type QueryComplexityTier = 'simple' | 'moderate' | 'complex';

interface ClassificationResult {
  tier: QueryComplexityTier;
  features: {
    termCount: number;
    charCount: number;
    hasTriggerMatch: boolean;
    stopWordRatio: number;
  };
  confidence: 'high' | 'medium' | 'low' | 'fallback';
}

/** Config-driven thresholds */
const SIMPLE_TERM_THRESHOLD = 3;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Query Router
// ---------------------------------------------------------------
// Tier-to-channel-subset routing for query complexity (Sprint 3, T001b)
// Maps classifier tiers to channel subsets for selective pipeline execution.

import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier';

/* -----------------------------------------------------------
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Dynamic Token Budget
// ---------------------------------------------------------------
//
// ADVISORY-ONLY: This module computes a token budget for a query
// based on its complexity tier, but does NOT enforce that budget
// downstream. The returned BudgetResult is handed to callers who
// are solely responsible for respecting it (e.g. by trimming
// result sets or truncating content before sending to the LLM).
// ---------------------------------------------------------------
import { type QueryComplexityTier } from './query-classifier';

/* --- 1. TYPES & CONSTANTS --- */

/** Budget (in tokens) allocated per complexity tier. */
interface TokenBudgetConfig {
  /** Simple query budget: 1500 tokens. */
  simple: number;
  /** Moderate query budget: 2500 tokens. */
  moderate: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Channel Representation
// ---------------------------------------------------------------
/* --- 1. CONSTANTS --- */

/** Minimum similarity / relevance score for a result to qualify for promotion.
 * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
 * compatible with both raw RRF scores and normalized [0,1] scores. */
export const QUALITY_FLOOR = 0.005;

/** Env-var name for the feature flag. */
const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';

/* --- 2. INTERFACES --- */

/** A single item that may appear in a top-k result set. */
interface TopKItem {
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Embedding Expansion
// ---------------------------------------------------------------
// AI-WHY: Sprint 5 Phase B — semantic query expansion using embedding similarity.
//
// R12/R15 Mutual Exclusion:
//   When the R15 query complexity classifier returns tier = "simple",
// embedding expansion is suppressed entirely. This prevents unnecessary
//   latency on short, well-defined queries that benefit from exact matches
//   rather than semantic broadening.
//
// Feature Flag:
//   Controlled by SPECKIT_EMBEDDING_EXPANSION (default: ON, graduated).
//   Set to 'false' to disable. If disabled, expandQueryWithEmbeddings()
//   returns immediately with an identity result (original query only,
//   no expanded terms).
// ---------------------------------------------------------------

import { isEmbeddingExpansionEnabled } from './search-flags';
import { classifyQueryComplexity } from './query-classifier';
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Confidence Truncation
// ---------------------------------------------------------------
/* --- 1. TYPES & CONSTANTS --- */

/** Generic scored result for truncation — supports both numeric and string IDs. */
interface ScoredResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

/** Result of a truncation operation with full audit metadata. */
interface TruncationResult {
  results: ScoredResult[];
  truncated: boolean;
  originalCount: number;
  truncatedCount: number;
  /** Inclusive index of the last kept result (0-based). */
  cutoffIndex: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: RSF Fusion
// ---------------------------------------------------------------
import type { RrfItem, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

/* --- 1. INTERFACES --- */

/** Result of RSF fusion: an RrfItem augmented with normalized fused score and source tracking. */
interface RsfResult extends RrfItem {
  /** Relative Score Fusion score, clamped to [0, 1]. */
  rsfScore: number;
  /** Sources that contributed to this result. */
  sources: string[];
  /** Per-source normalized scores. */
  sourceScores: Record<string, number>;
}

/* --- 2. HELPERS --- */

/**
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Query Expander
// ---------------------------------------------------------------
// Rule-based synonym expansion for mode="deep" multi-query RAG.
// No LLM calls — purely rule-based template substitution.

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

const MAX_VARIANTS = 3;

/** Escape special regex characters in user input to prevent ReDoS (P1-6). */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Domain vocabulary map for server-side synonym expansion.
 * No LLM calls — purely rule-based template substitution.
exec
/bin/zsh -lc "sed -n '260,520p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,420p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"routeQuery|queryComplexity|traceMetadata|includeTrace|analyzeChannelRepresentation|truncateByConfidence|getDynamicTokenBudget|expandQueryWithEmbeddings|expandQuery\\(|fuseResultsRsf|kendall|SPECKIT_EMBEDDING_EXPANSION|SPECKIT_CHANNEL_MIN_REP|SPECKIT_CONFIDENCE_TRUNCATION|SPECKIT_DYNAMIC_TOKEN_BUDGET|SPECKIT_COMPLEXITY_ROUTER\" '.opencode/skill/system-spec-kit/mcp_server/lib/search' '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
    // FTS and embedding re-encoding without requiring a separator token.
    const combinedQuery = `${query} ${expanded.join(' ')}`;

    return {
      original: query,
      expanded,
      combinedQuery,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[embedding-expansion] Expansion failed, using original query: ${msg}`);
    return identityResult(query);
  }
}

/* ---------------------------------------------------------------
   6. UTILITY: Check whether expansion is active for a query
   --------------------------------------------------------------- */

/**
 succeeded in 51ms:
      rsfScore = avgScore;
    } else {
      // AI-WHY: Proportional penalty scales with missing sources
      rsfScore = avgScore * (countPresent / totalSources);
    }

    rsfScore = clamp01(rsfScore);

    results.push({
      ...(mergedItem as RrfItem),
      rsfScore,
      sources,
      sourceScores,
    });
  }

  // --- Step 5: Sort descending by rsfScore ---
  return results.sort((a, b) => b.rsfScore - a.rsfScore);
}

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:136:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:283:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:310:  includeTrace = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:335:    includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:617:    includeTrace: includeTraceArg = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:619:  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:620:  const includeTrace = includeTraceByFlag || includeTraceArg === true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:757:    includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:881:          includeTrace
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:30:import { routeQuery } from './query-router';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:32:import { truncateByConfidence } from './confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:33:import { getDynamicTokenBudget, isDynamicTokenBudgetEnabled } from './dynamic-token-budget';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:121:  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:125:  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:127:  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:129:  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:539:    // AI-WHY: -- Sprint 3 Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:542:    const routeResult = routeQuery(query, options.triggerPhrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:551:    // channel disable was a no-op because only routeQuery() controlled activeChannels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:566:    // AI-WHY: -- Sprint 3 Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
🌐 Searching the web...
🌐 Searched the web
codex
The code trace is already surfacing one important distinction: several of these features have standalone modules, but I’m checking whether they’re actually wired into `hybrid-search` or the stage pipeline, since the snippets describe runtime behavior rather than just library availability. I’m also validating whether the listed “shared/*” paths are real in this skill tree or stale references.
exec
/bin/zsh -lc "sed -n '520,1040p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,420p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit' -maxdepth 3 -type d \\( -name shared -o -name mcp_server \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Channel Enforcement
// ---------------------------------------------------------------
// Pipeline-ready wrapper around the channel min-representation check.
// Provides a single enforceChannelRepresentation() entry point for
// use inside the hybrid-search pipeline after RRF/RSF fusion.
//
// Feature flag: SPECKIT_CHANNEL_MIN_REP (default: disabled)
// Delegates core logic to channel-representation.ts.
// ---------------------------------------------------------------

import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
} from './channel-representation';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Stage1 Candidate Gen
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-Stage Retrieval Pipeline Architecture
// ---------------------------------------------------------------
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage performs NO scoring modifications — it only retrieves candidates
// from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
//                         Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: searchWithFallback → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
 succeeded in 52ms:
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
async function hybridSearchEnhanced(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  try {
    const lists: Array<{
      source: string;
      results: Array<{ id: number | string; [key: string]: unknown }>;
      weight?: number;
    }> = [];

    // Sprint 3: Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // AI-WHY: -- Sprint 3 Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server
.opencode/skill/system-spec-kit/shared
.opencode/skill/system-spec-kit/shared/mcp_server
exec
/bin/zsh -lc "sed -n '720,980p' '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"_s3meta|queryComplexity|traceMetadata|format.*trace|includeTrace|budgetTruncated|routing|tokenBudget|truncation|enforcement\" '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // AI-TRACE:C136-08: Create retrieval trace at pipeline entry
  const trace = createTrace(
    normalizedQuery || (concepts ? concepts.join(', ') : ''),
    sessionId,
    detectedIntent || undefined
  );

  // AI-TRACE:T012-T015: Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    limit,
    mode,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Query Classifier
// ---------------------------------------------------------------
// Query Intelligence: complexity classification and routing

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  SIMPLE_TERM_THRESHOLD,
  COMPLEX_TERM_THRESHOLD,
  STOP_WORDS,
  extractTerms,
  calculateStopWordRatio,
  hasTriggerMatch,
  type QueryComplexityTier,
  type ClassificationResult,
} from '../lib/search/query-classifier';

/* -------------------------------------------------------------
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Query Router-Channel Interaction
// ---------------------------------------------------------------
// Ensures that R15 complexity-based channel routing does NOT violate
// R2 channel-minimum representation.
//
// Key invariants:
// 1. R15 always routes to >= 2 channels (MIN_CHANNELS enforcement)
// 2. R2 can enforce diversity within whatever channel subset R15 provides
// 3. The two modules compose correctly in the pipeline

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  classifyQueryComplexity,
  type QueryComplexityTier,
} from '../lib/search/query-classifier';
import {
  routeQuery,
  getChannelSubset,
  enforceMinimumChannels,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Query Router
// ---------------------------------------------------------------
// Tier-to-Channel-Subset Routing + Pipeline Integration
// 22 tests covering:
//   channel subset per tier, minimum invariant, custom config,
//   routeQuery convenience, feature flag disabled, classification details,
//   edge cases, enforceMinimumChannels, ALL_CHANNELS constant

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,
  getChannelSubset,
  routeQuery,
  enforceMinimumChannels,
  type ChannelName,
  type ChannelRoutingConfig,
 succeeded in 50ms:
Total output lines: 486

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:331:    // token-budget enforcement so metadata reflects the final envelope.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:337:    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:338:    // T205: Enforce per-layer token budgets with actual truncation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:353:          meta.tokenBudget = budget;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:              meta.tokenBudgetTruncated = true;
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:917:| v2.x | 2025 | Adaptive fusion, extended telemetry, artifact-class routing, append-only mutation ledger, typed retrieval contracts. |
.opencode/skill/system-spec-kit/mcp_server/README.md:234:| **Orchestration**        | 1     | Unified entry point with intent-aware routing          |
.opencode/skill/system-spec-kit/mcp_server/README.md:248:| `memory_context` | Unified entry with intent-aware routing (L1 Orchestration). START HERE for most retrieval tasks | ~500ms  |
.opencode/skill/system-spec-kit/mcp_server/README.md:358:Specs 137-139 expanded the pipeline from 3 to 4 primary retrieval channels. Sprint 1 (spec 140) added a 5th degree channel with typed-weighted graph degree computation. Sprint 3 added RSF fusion, query complexity routing, confidence truncation, channel min-representation and dynamic token budgets. Post-fusion enhancements are applied after retrieval and are not counted as separate channels:
.opencode/skill/system-spec-kit/mcp_server/README.md:751:| `SPECKIT_COMPLEXITY_ROUTER`     | `true`  | Query complexity routing |
.opencode/skill/system-spec-kit/mcp_server/README.md:753:| `SPECKIT_CONFIDENCE_TRUNCATION` | `true`  | Low-confidence tail truncation |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:19:// AI-TRACE:C136-09: Artifact-class routing (spec/plan/tasks/checklist/memory)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:20:import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:46:import type { RoutingResult, WeightedResult } from '../lib/search/artifact-routing';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:136:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:283:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:310:  includeTrace = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:335:    includeTrace,
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '180,320p' '.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/tests/dynamic-token-budget.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
function extractAnchorDetails(rawResult: RawSearchResult): { anchorIds: string[]; anchorTypes: string[] } {
  const metadata = Array.isArray(rawResult.anchorMetadata)
    ? rawResult.anchorMetadata as Array<Record<string, unknown>>
    : [];
  const anchorIds = metadata
    .map((entry) => (typeof entry.id === 'string' ? entry.id : null))
    .filter((entry): entry is string => entry !== null);
  const anchorTypes = metadata
    .map((entry) => (typeof entry.type === 'string' ? entry.type : null))
    .filter((entry): entry is string => entry !== null);
  return { anchorIds, anchorTypes };
}

function addChannel(channelsUsed: Set<string>, candidate: unknown): void {
  if (typeof candidate !== 'string') return;
  const normalized = candidate.trim();
  if (normalized.length === 0) return;
  channelsUsed.add(normalized);
}

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Channel Representation
// ---------------------------------------------------------------
// 15 tests covering:
//   all-represented, one-missing, floor-boundary, multi-missing,
//   no-results-not-penalised, empty-topk, flag-disabled,
//   promotion-metadata, channel-counts, exact-floor-threshold

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
  QUALITY_FLOOR,
} from '../lib/search/channel-representation';

/* ---------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------- */

const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';
 succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: CHANNEL
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach } from 'vitest';
// TODO: Source module ../lib/session/channel not found — needs investigation
// import * as mod from '../lib/session/channel';

describe('Channel Tests (T511) [deferred - requires DB test fixtures]', () => {
  it('T511-01: DEFAULT_CHANNEL is "default"', () => {
    expect(true).toBe(true);
  });

  it('T511-02a: deriveChannelFromGitBranch returns non-empty string', () => {
    expect(true).toBe(true);
  });

  it('T511-02b: Channel name is normalized (lowercase, alphanumeric, hyphens)', () => {
    expect(true).toBe(true);
  });
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Dynamic Token Budget
// ---------------------------------------------------------------
// Query Intelligence
// 16 tests covering:
//   budget per tier, flag disabled, custom config, edge cases

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,
  type TokenBudgetConfig,
  type BudgetResult,
} from '../lib/search/dynamic-token-budget';

/* ---------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------- */
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Test — Token Budget
// ---------------------------------------------------------------
// Verifies token estimation, greedy truncation, single-result
// summary fallback, overflow logging, and env var configuration.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  estimateTokenCount,
  estimateResultTokens,
  truncateToBudget,
  getTokenBudget,
  DEFAULT_TOKEN_BUDGET,
  SUMMARY_MAX_CHARS,
} from '../lib/search/hybrid-search';

import type {
  HybridSearchResult,
  OverflowLogEntry,
  TruncateToBudgetResult,
codex
I’ve confirmed the runtime wiring for the router, truncation, enforcement, and token-budget pieces in `hybrid-search`, plus the formatter fallback that surfaces `queryComplexity` in trace output. I’m now closing the loop on RSF and query expansion specifically, because those are the two snippets most likely to overstate what’s active in production versus what exists as library code or evaluation support.
exec
/bin/zsh -lc "rg -n \"rsf-fusion|fuseResultsRsf|rsf|kendall|tau|shadow mode|shadow\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 570

.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:84:    expect(() => validateFilePathLocal('/home/user/../../../etc/shadow')).toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:38:  kendallTau,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:293:      expect(analysis.results[k].kendallTau).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:303:  it('K=60 has kendallTau = 1.0 (correlation with itself)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:305:    expect(analysis.results[60].kendallTau).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:320:  it('Kendall tau is in [-1, 1] range for all K values', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:324:      expect(analysis.results[k].kendallTau).toBeGreaterThanOrEqual(-1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:325:      expect(analysis.results[k].kendallTau).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:368:  it('identical rankings have tau = 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:369:    expect(kendallTau([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:372:  it('reversed rankings have tau = -1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:373:    expect(kendallTau([1, 2, 3, 4, 5], [5, 4, 3, 2, 1])).toBeCloseTo(-1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:376:  it('single element has tau = 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:377:    expect(kendallTau([1], [1])).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:380:  it('empty rankings have tau = 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:381:    expect(kendallTau([], [])).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:384:  it('partially shuffled ranking has 0 < tau < 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:385:    const tau = kendallTau([1, 2, 3, 4, 5], [1, 3, 2, 4, 5]);
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — RSF Fusion
// ---------------------------------------------------------------
// Relative Score Fusion — Single-Pair Variant
// Hybrid RAG Fusion Refinement

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fuseResultsRsf,
  extractScore,
  minMaxNormalize,
  clamp01,
} from '../lib/search/rsf-fusion';
import type { RsfResult } from '../lib/search/rsf-fusion';
import type { RankedList, RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

 succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: RSF Fusion Edge Cases (A3-P2-5)
// Tests edge-case behavior for fuseResultsRsfCrossVariant()
// including zero variants, single variant, extreme scores,
// and duplicate IDs across variants.
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import {
  fuseResultsRsfCrossVariant,
  fuseResultsRsfMulti,
  clamp01,
} from '../lib/search/rsf-fusion';

type CrossVariantResult = ReturnType<typeof fuseResultsRsfCrossVariant>[number];

function expectDefined<T>(value: T | undefined, label: string): T {
  expect(value).toBeDefined();
  if (value === undefined) {
    throw new Error(`Expected ${label} to be defined`);
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — RSF vs RRF Kendall Tau
// ---------------------------------------------------------------
// Verification: measure rank correlation between RRF and RSF
// fusion to determine whether RSF is a safe replacement for RRF.
//
// Decision criterion: tau < 0.4 = REJECT RSF (rankings too different)

import { describe, it, expect, beforeAll } from 'vitest';
import { fuseResultsMulti, type RankedList, type RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';
import { fuseResultsRsfMulti, type RsfResult } from '../lib/search/rsf-fusion';

/* ---------------------------------------------------------------
   KENDALL TAU-B IMPLEMENTATION
   --------------------------------------------------------------- */

/**
 * Compute Kendall tau-b rank correlation coefficient.
 * Handles ties using the tau-b variant:
 *   tau_b = (C - D) / sqrt((C + D + T1) * (C + D + T2))
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: RRF Fusion
// ---------------------------------------------------------------
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)

/* --- 1. CONSTANTS --- */

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  DEGREE: 'degree',
  KEYWORD: 'keyword',
} as const;

// AI-WHY: K=60 is the standard RRF constant from Cormack et al. (2009); higher K
// flattens rank differences, reducing the dominance of top-1 results. 60 balances
// discrimination vs. stability for our typical 10-50 candidate lists.
exec
/bin/zsh -lc "for p in \\
'mcp_server/lib/search/query-classifier.ts' \\
'mcp_server/lib/search/query-router.ts' \\
'mcp_server/tests/query-classifier.vitest.ts' \\
'mcp_server/tests/query-router-channel-interaction.vitest.ts' \\
'mcp_server/tests/query-router.vitest.ts' \\
'mcp_server/lib/search/rsf-fusion.ts' \\
'shared/algorithms/rrf-fusion.ts' \\
'mcp_server/tests/rrf-fusion.vitest.ts' \\
'mcp_server/tests/rsf-fusion-edge-cases.vitest.ts' \\
'mcp_server/tests/rsf-fusion.vitest.ts' \\
'mcp_server/tests/unit-rrf-fusion.vitest.ts' \\
'mcp_server/lib/search/channel-representation.ts' \\
'mcp_server/tests/channel-representation.vitest.ts' \\
'mcp_server/tests/channel.vitest.ts' \\
'mcp_server/lib/search/confidence-truncation.ts' \\
'mcp_server/tests/confidence-truncation.vitest.ts' \\
'mcp_server/lib/search/dynamic-token-budget.ts' \\
'mcp_server/tests/dynamic-token-budget.vitest.ts' \\
'mcp_server/tests/token-budget.vitest.ts' \\
'mcp_server/configs/cognitive.ts' \\
'mcp_server/core/config.ts' \\
'mcp_server/lib/cache/embedding-cache.ts' \\
'mcp_server/lib/cognitive/rollout-policy.ts' \\
'mcp_server/lib/interfaces/vector-store.ts' \\
'mcp_server/lib/parsing/content-normalizer.ts' \\
'mcp_server/lib/providers/embeddings.ts' \\
'mcp_server/lib/scoring/interference-scoring.ts' \\
'mcp_server/lib/search/bm25-index.ts' \\
'mcp_server/lib/search/embedding-expansion.ts' \\
'mcp_server/lib/search/query-classifier.ts' \\
'mcp_server/lib/search/query-expander.ts' \\
'mcp_server/lib/search/search-flags.ts' \\
'mcp_server/lib/search/vector-index-aliases.ts' \\
'mcp_server/lib/search/vector-index-mutations.ts' \\
'mcp_server/lib/search/vector-index-queries.ts' \\
'mcp_server/lib/search/vector-index-schema.ts' \\
'mcp_server/lib/search/vector-index-store.ts' \\
'mcp_server/lib/search/vector-index-types.ts' \\
'mcp_server/lib/search/vector-index.ts' \\
'mcp_server/lib/utils/canonical-path.ts' \\
'mcp_server/lib/utils/format-helpers.ts' \\
'mcp_server/lib/utils/logger.ts' \\
'mcp_server/lib/utils/path-security.ts' \\
'shared/chunking.ts' \\
'shared/config.ts' \\
'shared/embeddings.ts' \\
'shared/embeddings/factory.ts' \\
'shared/embeddings/profile.ts' \\
'shared/embeddings/providers/hf-local.ts' \\
'shared/embeddings/providers/openai.ts' \\
'shared/embeddings/providers/voyage.ts' \\
'shared/normalization.ts' \\
'shared/types.ts' \\
'shared/utils/path-security.ts' \\
'shared/utils/retry.ts' \\
'mcp_server/tests/bm25-index.vitest.ts' \\
'mcp_server/tests/cognitive-gaps.vitest.ts' \\
'mcp_server/tests/config-cognitive.vitest.ts' \\
'mcp_server/tests/consumption-logger.vitest.ts' \\
'mcp_server/tests/content-normalizer.vitest.ts' \\
'mcp_server/tests/embedding-cache.vitest.ts' \\
'mcp_server/tests/embedding-expansion.vitest.ts' \\
'mcp_server/tests/embeddings.vitest.ts' \\
'mcp_server/tests/eval-logger.vitest.ts' \\
'mcp_server/tests/hybrid-search-flags.vitest.ts' \\
'mcp_server/tests/interference.vitest.ts' \\
'mcp_server/tests/memory-types.vitest.ts' \\
'mcp_server/tests/query-classifier.vitest.ts' \\
'mcp_server/tests/query-expander.vitest.ts' \\
'mcp_server/tests/retry-manager.vitest.ts' \\
'mcp_server/tests/retry.vitest.ts' \\
'mcp_server/tests/rollout-policy.vitest.ts' \\
'mcp_server/tests/score-normalization.vitest.ts' \\
'mcp_server/tests/scoring.vitest.ts' \\
'mcp_server/tests/search-flags.vitest.ts' \\
'mcp_server/tests/trigger-config-extended.vitest.ts' \\
'mcp_server/tests/unit-composite-scoring-types.vitest.ts' \\
'mcp_server/tests/unit-folder-scoring-types.vitest.ts' \\
'mcp_server/tests/unit-normalization-roundtrip.vitest.ts' \\
'mcp_server/tests/unit-normalization.vitest.ts' \\
'mcp_server/tests/unit-path-security.vitest.ts' \\
'mcp_server/tests/unit-tier-classifier-types.vitest.ts' \\
'mcp_server/tests/unit-transaction-metrics-types.vitest.ts' \\
'mcp_server/tests/vector-index-impl.vitest.ts'; do \\
  if [ -e \".opencode/skill/system-spec-kit/"'$p" ]; then echo "OK $p"; else echo "MISSING $p"; fi; '"\\
done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"expandQueryWithEmbeddings|isExpansionActive|buildDeepQueryVariants|expandQuery\\(|queryComplexity|routeQuery\\(|enforceChannelRepresentation\\(|truncateByConfidence\\(|getDynamicTokenBudget\\(|formatSearchResults\\(|rsfShadow|fuseResultsRsfMulti|fuseResultsRsfCrossVariant\" '.opencode/skill/system-spec-kit/mcp_server/tests' '.opencode/skill/system-spec-kit/mcp_server/lib' '.opencode/skill/system-spec-kit/mcp_server/formatters'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
OK mcp_server/lib/search/query-classifier.ts
OK mcp_server/lib/search/query-router.ts
OK mcp_server/tests/query-classifier.vitest.ts
OK mcp_server/tests/query-router-channel-interaction.vitest.ts
OK mcp_server/tests/query-router.vitest.ts
OK mcp_server/lib/search/rsf-fusion.ts
OK shared/algorithms/rrf-fusion.ts
OK mcp_server/tests/rrf-fusion.vitest.ts
OK mcp_server/tests/rsf-fusion-edge-cases.vitest.ts
OK mcp_server/tests/rsf-fusion.vitest.ts
OK mcp_server/tests/unit-rrf-fusion.vitest.ts
OK mcp_server/lib/search/channel-representation.ts
OK mcp_server/tests/channel-representation.vitest.ts
OK mcp_server/tests/channel.vitest.ts
OK mcp_server/lib/search/confidence-truncation.ts
OK mcp_server/tests/confidence-truncation.vitest.ts
OK mcp_server/lib/search/dynamic-token-budget.ts
OK mcp_server/tests/dynamic-token-budget.vitest.ts
OK mcp_server/tests/token-budget.vitest.ts
OK mcp_server/configs/cognitive.ts
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:102:  queryComplexity: string | null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:235:  let queryComplexity: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:261:    if (typeof meta.queryComplexity === 'string' && meta.queryComplexity.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:262:      queryComplexity = meta.queryComplexity;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:283:  // CHK-038: Fallback — read queryComplexity from traceMetadata if not found in stages
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:284:  if (!queryComplexity) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:286:    if (typeof tm?.queryComplexity === 'string' && (tm.queryComplexity as string).length > 0) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:287:      queryComplexity = tm.queryComplexity as string;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:295:    queryComplexity,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:306:export async function formatSearchResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:124:  rsfShadow?: { resultCount: number; topRsfScore: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:542:    const routeResult = routeQuery(query, options.triggerPhrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:551:    // channel disable was a no-op because only routeQuery() controlled activeChannels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:569:    const budgetResult = getDynamicTokenBudget(routeResult.tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:789:        const enforcementResult: EnforcementResult = enforceChannelRepresentation(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:812:        const truncationResult: TruncationResult = truncateByConfidence(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:995:            // AI-TRACE: CHK-038: Wire queryComplexity from router classification into trace
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996:            queryComplexity: routeResult.tier,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:119:    const res = await formatSearchResults(null, 'semantic');
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:126:    const res = await formatSearchResults([], 'trigger');
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '90,130p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,460p' '.opencode/skill/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  return isFeatureEnabled('SPECKIT_NEGATIVE_FEEDBACK');
}

// -- Pipeline Refactor flags --

/**
 * R6: 4-stage pipeline architecture (Stage 1-4 with Stage 4 invariant).
 * @deprecated Always returns true. Legacy V1 pipeline was removed in
 * 017-refinement-phase-6 Sprint 1. The SPECKIT_PIPELINE_V2 env var is
 * still accepted but ignored — V2 is the only code path.
 */
export function isPipelineV2Enabled(): boolean {
  return true;
}

/**
 * R12: Query expansion for embedding-based retrieval.
 * Suppressed when R15 classification = "simple" (mutual exclusion).
 * Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
 */
 succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: Embedding-Based Query Expansion
// SPECKIT_EMBEDDING_EXPANSION feature flag
//
// Test matrix:
//   T1  Feature flag OFF → identity result, no expansion
//   T2  Feature flag ON, simple query (R15) → expansion suppressed
//   T3  Feature flag ON, complex query → expansion runs (may be empty if no DB)
//   T4  R15 mutual exclusion detail — "simple" tier always suppresses
//   T5  isExpansionActive() respects flag OFF
//   T6  isExpansionActive() respects R15 "simple" classification
//   T7  isExpansionActive() returns true for complex query when flag is ON
//   T8  Empty embedding → identity result
//   T9  ExpandedQuery shape is correct
//   T10 No latency degradation for simple queries (< 5 ms)
//   T11 combinedQuery equals original when no expansion terms found
//   T12 combinedQuery appends expanded terms with space separator
// ---------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
 succeeded in 50ms:
  });

  // -- T7: isExpansionActive() returns true for complex query ---------------

  it('T7: isExpansionActive() returns true for complex query when flag is on', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // 9 terms → complex (> COMPLEX_TERM_THRESHOLD = 8)
    const complexQuery = 'how does embedding expansion affect recall and precision tradeoffs here';
    expect(isExpansionActive(complexQuery)).toBe(true);
  });

  it('T7b: isExpansionActive() returns true for complex query even with R15 explicitly disabled', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    // SPECKIT_COMPLEXITY_ROUTER is graduated — must explicitly disable with 'false'
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';

    // When R15 complexity router is explicitly disabled, its fallback is "complex" for all queries.
    // R12 should therefore run on all queries (flag is on, not "simple").
exec
/bin/zsh -lc "sed -n '330,390p' '.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '100,140p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '180,270p' '.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      }
    });

    it('T031-HYB-07: hybridSearchEnhanced() respects limit option', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 3 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('T031-HYB-08: hybridSearchEnhanced() accepts specFolder filter', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('module', mockEmbedding, { limit: 10, specFolder: 'specs/auth' });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('T031-HYB-09: hybridSearchEnhanced() accepts query string', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('test query', mockEmbedding, { limit: 5 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
 succeeded in 51ms:
/** Normalize a fused RRF result to the HybridSearchResult contract. */
function toHybridResult(result: FusionResult): HybridSearchResult {
  const sourceCandidate = (result as { source?: unknown }).source;
  const primarySource = result.sources[0] ?? 'hybrid';
  const scoreCandidate = (result as { score?: unknown }).score;

  return {
    ...result,
    id: result.id,
    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
  };
}

/* --- 3. SPRINT 3 PIPELINE METADATA --- */

/**
 * Optional metadata about Sprint 3 pipeline stages attached to enhanced search results.
 * Only populated when the corresponding feature flags are enabled.
 */
 succeeded in 51ms:
  const map = new Map<number, ScoredResult>();
  for (const r of results) {
    map.set(r.memoryId, r);
  }
  return map;
}

/**
 * Compute Kendall tau-like rank correlation between two ranked lists.
 * Returns a value in [-1, 1]:
 *   1  = identical ordering
 *   0  = no correlation
 *  -1  = fully inverted
 *
 * Only considers overlapping results.
 */
function computeRankCorrelation(
  production: ScoredResult[],
  shadow: ScoredResult[],
): number {
exec
/bin/zsh -lc "rg -n \"queryComplexity|budgetTruncated\" '.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '300,360p' '.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

 succeeded in 51ms:
      contentSource: 'reassembled_chunks',
      precomputedContent: 'Reassembled content from chunks.',
    }];
    const res = await formatSearchResults(mockResults, 'semantic', true);
    const envelope = parseEnvelope(res);
    const result = envelope.data.results[0];
    expect(result.content).toBe('Reassembled content from chunks.');
    expect(result.contentError).toBeUndefined();
    expect(result.isChunk).toBe(true);
    expect(result.parentId).toBe(999);
    expect(result.chunkCount).toBe(3);
    expect(result.contentSource).toBe('reassembled_chunks');
  });

  it('C16: trace.channelsUsed includes row-level provenance and attribution matches', async () => {
    const mockResults = [{
      id: 52,
      spec_folder: 'specs/010-test',
      file_path: '/tmp/mock.md',
      title: 'Trace Parent',
 succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: Contextual Tree Headers (Sprint 9 P1-4 / T063-T065)
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { __testables } from '../lib/search/hybrid-search';

type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;

function getContent(row: InjectContextualTreeResult): string | undefined {
  const content = (row as Record<string, unknown>).content;
  return typeof content === 'string' ? content : undefined;
}

describe('Contextual tree injection', () => {
  it('T063: injects contextual header in expected format', () => {
    const row: InjectContextualTreeInput = {
      id: 1,
      score: 1,
exec
/bin/zsh -lc "rg -n \"queryComplexity|budgetTruncated\" '.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:

exec
/bin/zsh -lc "rg -n \"cutoffIndex|medianGap|cutoffGap|originalCount|truncatedCount\" '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:362:              const originalCount = innerResults.length;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:376:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379:              meta.originalResultCount = originalCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:184:        const originalCount = innerResults.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:216:            originalResultCount: originalCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:941:      const originalCount = existingResults.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:943:      const filteredCount = originalCount - dedupedCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:946:      const savingsPercent = originalCount > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:947:        ? Math.round((filteredCount / originalCount) * 100)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:956:        originalCount: originalCount,
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:112:    expect(out.truncatedCount).toBe(4);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:113:    expect(out.originalCount).toBe(4);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:120:    expect(out.medianGap).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:121:    expect(out.cutoffGap).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:138:    // gap[2] = 0.72 > 0.08 → cutoffIndex = 2 (keep 0,1,2)
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:144:    expect(out.truncatedCount).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:145:    expect(out.cutoffIndex).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:163:  it('T10: originalCount reflects pre-truncation count', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:166:    expect(out.originalCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:167:    expect(out.truncatedCount).toBe(3);
codex
---
FEATURE: 01-query-complexity-router.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/formatters/search-results.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Tier routing is driven by term count plus exact trigger-match. `charCount` is only recorded, and `stopWordRatio` affects confidence, not tier selection. The snippet is also missing the hybrid-search wiring and formatter fallback that actually surface `queryComplexity`.
---
FEATURE: 02-relative-score-fusion-in-shadow-mode.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/eval/shadow-scoring.ts`, `mcp_server/tests/rsf-multi.vitest.ts`, `mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts`
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The RSF algorithms exist, including single-pair, multi-list, and cross-variant fusion, but they are not running alongside RRF in the live search pipeline. Shadow scoring is disabled, `runShadowScoring()` is a no-op, and Kendall tau comparison exists as offline/test logic rather than an active runtime “sprint exit” mechanism.
---
FEATURE: 03-channel-min-representation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/channel-enforcement.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/tests/channel-enforcement.vitest.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior is correct at system level, but runtime enforcement happens through the wrapper and hybrid-search integration, not just `channel-representation.ts`. The listed `channel.vitest.ts` exists but is a deferred placeholder, not the main enforcement test.
---
FEATURE: 04-confidence-based-result-truncation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The truncation algorithm itself matches the code. The mismatch is the claim that full truncation metadata is returned alongside live results: the module computes it, but the live pipeline only keeps limited truncation metadata and does not expose `cutoffIndex`, `medianGap`, and `cutoffGap` in formatted responses.
---
FEATURE: 05-dynamic-token-budget-allocation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: The mechanics are correct: tier-based budgets, early computation, and context-header overhead subtraction all happen in code. The snippet misses the actual hybrid-search integration file, and the “recover roughly 40%” savings claim is not something the code itself verifies.
---
FEATURE: 06-query-expansion.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_CODE_PATHS: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Embedding expansion is real, but it is not limited to complex queries; moderate queries also expand, with only `simple` queries suppressed. The snippet also omits the key Stage 1 pipeline file that actually runs baseline and expanded searches in parallel with baseline-first deduplication.
tokens used
156,986
---
FEATURE: 01-query-complexity-router.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/formatters/search-results.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Tier routing is driven by term count plus exact trigger-match. `charCount` is only recorded, and `stopWordRatio` affects confidence, not tier selection. The snippet is also missing the hybrid-search wiring and formatter fallback that actually surface `queryComplexity`.
---
FEATURE: 02-relative-score-fusion-in-shadow-mode.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/eval/shadow-scoring.ts`, `mcp_server/tests/rsf-multi.vitest.ts`, `mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts`
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The RSF algorithms exist, including single-pair, multi-list, and cross-variant fusion, but they are not running alongside RRF in the live search pipeline. Shadow scoring is disabled, `runShadowScoring()` is a no-op, and Kendall tau comparison exists as offline/test logic rather than an active runtime “sprint exit” mechanism.
---
FEATURE: 03-channel-min-representation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/channel-enforcement.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/tests/channel-enforcement.vitest.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior is correct at system level, but runtime enforcement happens through the wrapper and hybrid-search integration, not just `channel-representation.ts`. The listed `channel.vitest.ts` exists but is a deferred placeholder, not the main enforcement test.
---
FEATURE: 04-confidence-based-result-truncation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The truncation algorithm itself matches the code. The mismatch is the claim that full truncation metadata is returned alongside live results: the module computes it, but the live pipeline only keeps limited truncation metadata and does not expose `cutoffIndex`, `medianGap`, and `cutoffGap` in formatted responses.
---
FEATURE: 05-dynamic-token-budget-allocation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: `mcp_server/lib/search/hybrid-search.ts`
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: The mechanics are correct: tier-based budgets, early computation, and context-header overhead subtraction all happen in code. The snippet misses the actual hybrid-search integration file, and the “recover roughly 40%” savings claim is not something the code itself verifies.
---
FEATURE: 06-query-expansion.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_CODE_PATHS: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Embedding expansion is real, but it is not limited to complex queries; moderate queries also expand, with only `simple` queries suppressed. The snippet also omits the key Stage 1 pipeline file that actually runs baseline and expanded searches in parallel with baseline-first deduplication.
