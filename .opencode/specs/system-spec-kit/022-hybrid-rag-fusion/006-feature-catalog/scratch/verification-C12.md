OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-3fff-7981-b6e1-a67e99fdb56f
--------
user
You are a feature catalog verification agent. Read these feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md (files 11 through 17). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying feature catalog entries `11` through `17` against the actual `mcp_server` code. I’ll read each snippet’s `Current Reality` and `Source Files`, confirm every listed path exists, then trace the implementation to see whether the description is accurate and whether any important source files are missing.
Plan update
  → Read feature catalog files 11 through 17 and extract Current Reality plus Source Files sections
  • Inspect listed mcp_server source files and verify each path exists
  • Compare descriptions to code and identify missing source files per feature
  • Summarize results in the user’s required output format
codex
I’m checking the repository’s routing guidance as well, then I’ll pull the seven feature snippets and the corresponding code paths so we can compare them cleanly.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog snippets 11 through 17 by comparing Current Reality and Source Files sections against system-spec-kit mcp_server code; report invalid and missing source paths" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 643ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, !system-spec-kit(explicit), document~, files~, folder"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), files, specification~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit` (recommended at 0.95 confidence). User specified: “Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing.” Now I’m extracting the `Current Reality` and `Source Files` sections from files `11` through `17`.
exec
/bin/zsh -lc "awk 'BEGIN{p=0} /"'^## Current Reality/{p=1} /''^## / && $0!~/''^## Current Reality/ && p==1{p=0} p{print} /''^## Source Files/{p=2} /''^## / && $0!~/''^## Source Files/ && p==2{p=0} p{print}'"' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "awk 'BEGIN{p=0} /"'^## Current Reality/{p=1} /''^## / && $0!~/''^## Current Reality/ && p==1{p=0} p{print} /''^## Source Files/{p=2} /''^## / && $0!~/''^## Source Files/ && p==2{p=0} p{print}'"' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-structural-completeness-detection.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "awk 'BEGIN{p=0} /"'^## Current Reality/{p=1} /''^## / && $0!~/''^## Current Reality/ && p==1{p=0} p{print} /''^## Source Files/{p=2} /''^## / && $0!~/''^## Source Files/ && p==2{p=0} p{print}'"' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-confidence-band-and-threshold-gating.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "awk 'BEGIN{p=0} /"'^## Current Reality/{p=1} /''^## / && $0!~/''^## Current Reality/ && p==1{p=0} p{print} /''^## Source Files/{p=2} /''^## / && $0!~/''^## Source Files/ && p==2{p=0} p{print}'"' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-similarity-weighted-scoring.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
## Current Reality
## Current Reality


Four scoring-layer bugs were fixed:
Four scoring-layer bugs were fixed:


**C1 — Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.
**C1 — Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.


**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.
**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.


**C3 — Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.
**C3 — Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.


 exited 2 in 51ms:
awk: can't open file .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-confidence-band-and-threshold-gating.md
 source line number 1
 exited 2 in 51ms:
awk: can't open file .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-structural-completeness-detection.md
 source line number 1
 exited 2 in 51ms:
awk: can't open file .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-similarity-weighted-scoring.md
 source line number 1
codex
A few filenames didn’t match my first pass, so I’m listing the folder to grab the exact names before continuing the comparison.
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server' -maxdepth 3 -type f | sed 's#"'^./##'"' | sort | head -n 400" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/.github/hooks/superset-notify.json
.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skill/system-spec-kit/mcp_server/LICENSE
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/_pending
.opencode/skill/system-spec-kit/mcp_server/api/README.md
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/cli.ts
.opencode/skill/system-spec-kit/mcp_server/configs/README.md
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/core/README.md
.opencode/skill/system-spec-kit/mcp_server/core/config.ts
exec
/bin/zsh -lc "for f in \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md' \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md' \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md' \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md' \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md' \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md' \\
  '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md'; do
  printf 'FILE: %s\\n' \""'$f"
  awk '"'BEGIN{section=\"\"} /"'^## Current Reality/{section="current"} /''^## Source Files/{section="source"} /''^## / && $0!~/''^## Current Reality/ && $0!~/''^## Source Files/{section=""} section=="current" || section=="source" {print}'"' \""'$f"
  printf '"'\\n'
done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md
## Current Reality

Four scoring-layer bugs were fixed:

**C1 — Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.

**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.

**C3 — Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.

**C4 — Ablation binomial overflow:** `ablation-framework.ts` computed binomial coefficients using naive multiplication that overflowed for n>50 in the sign test. Replaced with `logBinomial(n, k)` using log-space summation.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
codex
I’ve got the seven snippets. Next I’m checking the real implementation files and tests they point to, because a few of these catalogs already look like they may be over-listing or using paths that don’t match the repo layout.
exec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server/lib' -maxdepth 4 -type f | sed 's#"'^./##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server/handlers' -maxdepth 3 -type f | sed 's#"'^./##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server/shared' -maxdepth 4 -type f | sed 's#"'^./##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server/tests' -maxdepth 2 -type f | sed 's#"'^./##'"' | sort | rg 'composite|access|quality-loop|tool-cache|local-reranker|rerank|rrf|rsf|mpab|ablation|causal|stage3|scoring|bm25|interference|cross-encoder|archival|fusion'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
find: .opencode/skill/system-spec-kit/mcp_server/shared: No such file or directory
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts
exec
/bin/zsh -lc "rg -n \"Math\\.max\\(0|citation|last_accessed|updated_at|composite\" '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"UNION ALL|UNION|WITH RECURSIVE|cycle|causal\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"logBinomial|binomial|sign test|signTest|overflow\" '.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
47:  citation: number;
81:    citation: FactorDetail;
116:  citation: 0.15,
190:// Applied as a final multiplier to composite scores so spec documents
220: * Parse last_accessed value that may be:
250:  const lastReview = (row.lastReview as string | undefined) || row.updated_at || row.created_at;
272:  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
303:  return Math.max(0, Math.min(1, retrievability));
311: * Normalized to 0-1 range for composite scoring
314:  accessCount = Math.max(0, accessCount);
332: * T033: Calculate citation recency score (REQ-017 Factor 5)
335:  // AI-GUARD: C2 FIX: Only use actual citation data (lastCited / last_cited).
336:  // Never fall back to last_accessed or updated_at — those conflate
337:  // general recency with citation recency. Uncited memories score 0.
346:  if (isNaN(timestamp)) return 0; // No valid citation date → score 0
349:  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
436:  return Math.max(0, Math.min(1, score));
489: * observability telemetry to an already-computed weighted composite score.
494: * @param composite  Raw weighted-sum composite score (pre-multiplier)
500:  composite: number,
 succeeded in 51ms:
4:// Graph-traversal score boosting via causal edge relationships.
5:// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
15:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
17:/** Combined causal + session boost ceiling to prevent runaway amplification. */
25: * C138-P2: Relation-type weight multipliers for causal edge traversal.
57:/** Check whether the causal boost feature flag is enabled. */
62:/** Store the database reference used by causal edge traversal queries. */
103: * Walk causal edges up to MAX_HOPS from the given seed memory IDs,
120:    WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
125:      FROM causal_edges ce
128:      UNION
134:      FROM causal_edges ce
137:      UNION
148:      FROM causal_walk cw
149:      JOIN causal_edges ce
155:    FROM causal_walk
183:    console.warn(`[causal-boost] Traversal failed: ${message}`);
203: * Apply causal graph boost to ranked search results, injecting
232:    const causalBoost = neighborBoosts.get(item.id) ?? 0;
233:    if (causalBoost <= 0) {
 succeeded in 50ms:
216: * Uses the exact binomial distribution.
222: * Precision note: Uses log-space computation to avoid integer overflow
223: * for large n (the naive iterative binomial coefficient exceeds
226:function signTestPValue(nPositive: number, nNegative: number): number | null {
230:  // Two-sided sign test: P(X <= min(n+, n-)) under Binomial(n, 0.5)
233:  // AI-WHY: Log-space binomial coefficient to avoid overflow for large n
234:  function logBinomial(nVal: number, kVal: number): number {
244:  // Compute cumulative binomial probability P(X <= k) for Binomial(n, 0.5)
249:    cumProb += Math.exp(logBinomial(n, i) + logP);
444:        const pValue = signTestPValue(queriesChannelHelped, queriesChannelHurt);
 succeeded in 51ms:
// @ts-nocheck
// ---------------------------------------------------------------
// TEST: CAUSAL FIXES
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import * as causalEdges from '../lib/storage/causal-edges';
import * as causalGraphHandler from '../handlers/causal-graph';
import BetterSqlite3 from 'better-sqlite3';

let testDb: any = null;

describe('T202 + T203: FlatEdge id & Relations Filter [deferred - requires DB test fixtures]', () => {
  beforeAll(() => {
    testDb = new BetterSqlite3(':memory:');

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
exec
/bin/zsh -lc "sed -n '320,360p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '500,520p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,255p' '.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '116,160p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/**
 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
 */
export function calculateImportanceScore(tier: string, baseWeight: number | undefined): number {
  const tierLower = (tier || 'normal').toLowerCase();
  const multiplier = IMPORTANCE_MULTIPLIERS[tierLower] || IMPORTANCE_MULTIPLIERS.normal;
  const base = baseWeight || 0.5;

  return Math.min(1, (base * multiplier) / 2.0);
}

/**
 * T033: Calculate citation recency score (REQ-017 Factor 5)
 */
export function calculateCitationScore(row: ScoringInput): number {
  // AI-GUARD: C2 FIX: Only use actual citation data (lastCited / last_cited).
  // Never fall back to last_accessed or updated_at — those conflate
  // general recency with citation recency. Uncited memories score 0.
  const lastCited = (row.lastCited as string | undefined)
    || (row.last_cited as string | undefined);
 succeeded in 52ms:
  composite: number,
  row: ScoringInput,
  queryIdPrefix: string,
): number {
  // Spec 126: Apply document type multiplier
  const docType = (row.document_type as string) || 'memory';
  const docMultiplier = DOCUMENT_TYPE_MULTIPLIERS[docType] ?? 1.0;
  composite *= docMultiplier;

  // TM-01: Apply interference penalty (after doc multiplier)
  const interferenceScore = (row.interference_score as number) || 0;
  composite = applyInterferencePenalty(composite, interferenceScore);

  // C1 FIX: Clamp to [0, 1] — doc-type multipliers can push composite above 1.0
  const finalScore = Math.max(0, Math.min(1, composite));

  // AI-TRACE: T010: Scoring observability (5% sampled, fail-safe)
  try {
    if (shouldSample()) {
      const createdMs = row.created_at ? new Date(row.created_at).getTime() : Date.now();
 succeeded in 52ms:
 * @returns p-value, or null if fewer than 5 non-tied observations.
 *
 * Precision note: Uses log-space computation to avoid integer overflow
 * for large n (the naive iterative binomial coefficient exceeds
 * Number.MAX_SAFE_INTEGER for n > ~50).
 */
function signTestPValue(nPositive: number, nNegative: number): number | null {
  const n = nPositive + nNegative;
  if (n < 5) return null; // Insufficient data for meaningful test

  // Two-sided sign test: P(X <= min(n+, n-)) under Binomial(n, 0.5)
  const k = Math.min(nPositive, nNegative);

  // AI-WHY: Log-space binomial coefficient to avoid overflow for large n
  function logBinomial(nVal: number, kVal: number): number {
    if (kVal < 0 || kVal > nVal) return -Infinity;
    if (kVal === 0 || kVal === nVal) return 0;
    let result = 0;
    for (let i = 0; i < kVal; i++) {
      result += Math.log(nVal - i) - Math.log(i + 1);
 succeeded in 52ms:
  // C138-P2: Relation-weighted CTE — accumulates score with multiplier
  // based on edge relation type and edge strength column.
  // 'supersedes' edges get 1.5x, 'contradicts' 0.8x, others 1.0x.
  const query = `
    WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
      SELECT ce.source_id, ce.target_id, 1,
             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
                   WHEN ce.relation = 'contradicts' THEN 0.8
                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_edges ce
      WHERE ce.source_id IN (${placeholders})

      UNION

      SELECT ce.target_id, ce.source_id, 1,
             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
                   WHEN ce.relation = 'contradicts' THEN 0.8
                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_edges ce
      WHERE ce.target_id IN (${placeholders})
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/mcp_server/shared/algorithms/mmr-reranker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"effectiveScore|intentAdjustedScore|rrfScore|stage2Score|resolveEffectiveScore|similarity / 100|similarity/100|isFinite\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' '.opencode/skill/system-spec-kit/mcp_server/shared/algorithms/mmr-reranker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
sed: .opencode/skill/system-spec-kit/mcp_server/shared/algorithms/mmr-reranker.ts: No such file or directory
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------
// Sprint 5 (R6): Stage interfaces with Stage 4 immutability invariant
// ---------------------------------------------------------------

import type { RetrievalTrace } from '@spec-kit/shared/contracts/retrieval-trace';

/**
 * Memory search row — the canonical internal result type flowing through the pipeline.
 * Extends Record<string, unknown> for backward compatibility with existing code.
 */
export interface PipelineRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  score?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Stage3 Rerank
// ---------------------------------------------------------------
// AI-GUARD: 4-Stage Retrieval Pipeline: Stage 3 of 4
//
// Responsibilities (in execution order):
//   1. Cross-encoder reranking   — re-scores results via neural model
//   2. MMR diversity pruning     — maximal marginal relevance (SPECKIT_MMR flag)
//   3. MPAB chunk collapse        — dedup chunks, reassemble parents
//
// Pipeline position constraint (Sprint 4):
// MPAB MUST remain AFTER RRF fusion (Stage 2).
//   Stage 3 is the only stage that may change scores after Stage 2.
//
// I/O CONTRACT:
//   Input:  Stage3Input { scored: PipelineRow[], config }
//   Output: Stage3Output { reranked: PipelineRow[], metadata }
//   Key invariants:
//     - reranked is sorted descending by effective score after all steps
//     - Chunk rows (parent_id != null) are collapsed; only parent rows exit
 exited 2 in 51ms:
rg: .opencode/skill/system-spec-kit/mcp_server/shared/algorithms/mmr-reranker.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:41:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:42:  intentAdjustedScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:44:  stage2Score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:54: * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:55: * all clamped to [0,1] with isFinite guards.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:57:export function resolveEffectiveScore(row: PipelineRow): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:58:  if (typeof row.intentAdjustedScore === 'number' && Number.isFinite(row.intentAdjustedScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:59:    return Math.max(0, Math.min(1, row.intentAdjustedScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:60:  if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:61:    return Math.max(0, Math.min(1, row.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:62:  if (typeof row.score === 'number' && Number.isFinite(row.score))
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:64:  if (typeof row.similarity === 'number' && Number.isFinite(row.similarity))
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:65:    return Math.max(0, Math.min(1, row.similarity / 100));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:75:  'similarity' | 'score' | 'importance_weight' | 'rrfScore' | 'intentAdjustedScore' | 'attentionScore'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:346:  rrfScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:347:  intentAdjustedScore?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:360:    rrfScore: r.rrfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:361:    intentAdjustedScore: r.intentAdjustedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:394:    if (row.rrfScore !== snap.rrfScore) {
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit' | rg 'mmr-reranker|retrieval-trace|normalization.ts|shared/types.ts|rrf-fusion.ts|path-security.ts|embeddings/providers|algorithms'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/utils/path-security.ts
.opencode/skill/system-spec-kit/shared/types.ts
.opencode/skill/system-spec-kit/shared/normalization.ts
.opencode/skill/system-spec-kit/shared/utils/path-security.ts
.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts
.opencode/skill/system-spec-kit/shared/algorithms/index.ts
.opencode/skill/system-spec-kit/shared/algorithms/mmr-reranker.ts
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts
.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts
.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts
exec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server' -maxdepth 2 \\( -path '*/dist' -o -path '*/node_modules' \\) -prune -o -type f | sed 's#"'^./##'"' | sort | rg '/utils/|tool-schemas\\.ts"'$|schemas/tool-input-schemas'"\\.ts"'$|shared/'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
.opencode/skill/system-spec-kit/mcp_server/utils/README.md
.opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts
.opencode/skill/system-spec-kit/mcp_server/utils/index.ts
.opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts
.opencode/skill/system-spec-kit/mcp_server/utils/validators.ts
exec
/bin/zsh -lc "sed -n '460,540p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,380p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"local reranker|rerankLocal|RERANKER_LOCAL|SPECKIT_RERANKER_MODEL|free memory|512MB|4GB|node-llama-cpp|gguf|bge-reranker\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' '.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  results: PipelineRow[],
  options: {
    rerank: boolean;
    applyLengthPenalty: boolean;
    limit: number;
  }
): Promise<{ rows: PipelineRow[]; applied: boolean }> {
  // AI-GUARD: Feature-flag guard
  if (!options.rerank || !isCrossEncoderEnabled()) {
    return { rows: results, applied: false };
  }

  // AI-GUARD: Minimum-document guard
  if (results.length < MIN_RESULTS_FOR_RERANK) {
    return { rows: results, applied: false };
  }

  // Build a lookup map so we can restore all original PipelineRow fields
  // after reranking (the cross-encoder only knows about id + text + score).
  const rowMap = new Map<string | number, PipelineRow>();
 succeeded in 51ms:
    stats.collapsedChunkHits += chunks.length - 1;
  }

  // Attempt DB reassembly for each parent group (in parallel)
  const reassembledRows = await Promise.all(
    chunkGroups.map((group) => reassembleParentRow(group, stats))
  );

  // Merge non-chunks + reassembled parent rows, sort by effective score
  const merged = [...nonChunks, ...reassembledRows];
  merged.sort((a, b) => effectiveScore(b) - effectiveScore(a));

  return { results: merged, stats };
}

/**
 * Elect the best representative chunk from a chunk group.
 * Selection criteria: highest `score`, breaking ties by `similarity`.
 *
 * @param chunks - All chunk rows for a single parent.
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:202: * Default: FALSE. Set RERANKER_LOCAL=true to enable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:206:  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:207:  return isFeatureEnabled('RERANKER_LOCAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:4:// AI-WHY: Optional local reranker for Stage 3. This module is fully gated by
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:5:// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:34:const DEFAULT_MODEL_RELATIVE_PATH = path.join('models', 'bge-reranker-v2-m3.Q4_K_M.gguf');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:46:  const configured = process.env.SPECKIT_RERANKER_MODEL?.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:68:  const mod = await dynamicImport('node-llama-cpp') as unknown;
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:70:    throw new Error('node-llama-cpp loaded without getLlama() export');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:102:      throw new Error('node-llama-cpp runtime missing loadModel()');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:181:  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:185:  // Use total system memory instead of free memory. On macOS/Linux,
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:187:  const hasCustomModel = Boolean(process.env.SPECKIT_RERANKER_MODEL?.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:202:export async function rerankLocal<T extends LocalRerankRow>(
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:238:        // Future optimization: batch inference via node-llama-cpp's evaluateBatch API.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:272:          reject(new Error(`local reranker timed out after ${RERANKER_TIMEOUT_MS}ms`));
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Local Reranker
// ---------------------------------------------------------------
// AI-WHY: Optional local reranker for Stage 3. This module is fully gated by
// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
// precondition or runtime failure.
//
// TODO(CHK-069): Document eval comparison — local GGUF MRR@5 vs remote Cohere/Voyage MRR@5.
// Deferred: requires eval infrastructure with ground truth queries and remote API access.

import os from 'os';
import path from 'path';
import { access } from 'fs/promises';
import { toErrorMessage } from '../../utils';

interface NodeLlamaCppModule {
  getLlama: () => Promise<unknown>;
}

type LocalRerankRow = Record<string, unknown> & {
exec
/bin/zsh -lc "sed -n '280,340p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const dispose = (context as { dispose?: () => Promise<void> | void } | null)?.dispose;
    if (typeof dispose === 'function') {
      try {
        await dispose.call(context);
      } catch (_error: unknown) {
        // AI-GUARD: non-fatal cleanup
      }
    }
  }
}

export async function disposeLocalReranker(): Promise<void> {
  // Sprint 9 fix: If modelLoadPromise is pending when shutdown triggers,
  // the model could resolve after dispose, leaving it orphaned. Chain cleanup.
  const pending = modelLoadPromise;
  if (pending) {
codex
I’m into the implementation pass now. The pattern so far is mixed: some snippets describe real fixes, but several `Source Files` tables are either over-broad or omit the files where the behavior actually lives.
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"timestamp-based recency|applyIntentWeights|intent weight|recency score|spread operator|Math\\.max\\(\\.\\.\\.scores\\)|Math\\.min\\(\\.\\.\\.scores\\)|normalizeCompositeScores|specFolder|document IDs as stringified numbers|rrf convergence|convergence bonus|doc-type adjustments|resolveEffectiveScore|threshold =|INTERFERENCE_SIMILARITY_THRESHOLD|Math\\.max\\(result.intentAdjustedScore, result.score\\)\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts' '.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '650,720p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:293: * @returns Fused results with cross-variant convergence bonuses
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:38:/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:43:   * result was ranked highly by more methods. Includes convergence bonus
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:149:      // AI: Fix F16 — apply convergence bonus only once per ID.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:172: * @param options - Optional k value, convergence bonus, and graph weight boost overrides.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:214:  // Apply convergence bonus for multi-source matches
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:291: * @param options - Fusion configuration (k, convergence bonus, graph weight boost).
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:318: * cross-variant convergence bonus when the same ID appears in results
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:324: * @returns Fused results with cross-variant convergence bonuses
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:330:  // Use ?? so callers can explicitly pass 0 convergence bonus without falling back to default
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:379:  // Step 4: Apply cross-variant convergence bonus (clean, no double-counting)
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:432:  // AI-WHY: Avoid Math.max(...scores) / Math.min(...scores) — spread on large
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:21:  specFolder: string;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:34:export const INTERFERENCE_SIMILARITY_THRESHOLD = 0.75;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:98: * @param specFolder - spec_folder of the memory
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:105:  specFolder: string,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:106:  threshold: number = INTERFERENCE_SIMILARITY_THRESHOLD
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:108:  if (!specFolder) return 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:124:  ).all(specFolder, memoryId) as Array<{
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:155:  // INTERFERENCE_SIMILARITY_THRESHOLD. Now configurable for testing/tuning.
 succeeded in 52ms:
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
 succeeded in 52ms:
      results = withFeedback;
      metadata.feedbackSignalsApplied = true;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
  }

  // -- 7. Artifact-based result limiting --
  // The routing strategy may specify a maxResults count stricter than the
  // overall pipeline limit. Apply it here so Stage 3 reranks a pre-trimmed set.
  results.sort((a, b) => resolveEffectiveScore(b) - resolveEffectiveScore(a));
  if (
    config.artifactRouting &&
    config.artifactRouting.confidence > 0 &&
    typeof config.artifactRouting.strategy?.maxResults === 'number' &&
    config.artifactRouting.strategy.maxResults > 0 &&
    results.length > config.artifactRouting.strategy.maxResults
  ) {
    results = results.slice(0, config.artifactRouting.strategy.maxResults);
exec
/bin/zsh -lc "sed -n '220,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '780,830p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"specFolder|spec_folder|stringified|document IDs|resolve spec_folder|getSpecFolder|filter.*spec\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"semantic|keyword|recency|normalize|doc-type|adaptive fusion|weights\" '.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
}

/**
 * Apply min-max normalization to composite scores, mapping to [0,1].
 * Gated behind SPECKIT_SCORE_NORMALIZATION env var — returns unchanged when disabled.
 *
 * - If all scores are equal, they normalize to 1.0.
 * - If a single result, it normalizes to 1.0.
 * - Returns empty array when given empty array.
 *
 * @param scores - Array of raw composite scores
 * @returns Normalized scores mapped to [0, 1] (or unchanged when disabled)
 */
export function normalizeCompositeScores(scores: number[]): number[] {
  if (scores.length === 0) return [];
  if (!isCompositeNormalizationEnabled()) return scores;

  // AI-WHY: Fix #7 (017-refinement-phase-6) — Use loop-based min/max instead of
  // Math.max(...scores) / Math.min(...scores) which causes stack overflow on arrays
  // larger than ~100K elements (exceeds JS call-stack argument limit).
 succeeded in 51ms:
 *
 * Weight combination:
 *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
 *
 * Similarity is normalised from the raw 0–100 scale to 0–1 before the
 * weighted combination so all three dimensions operate on the same scale.
 * Results are sorted descending by intentAdjustedScore.
 *
 * @param results - Pipeline rows to score
 * @param weights - Intent weight configuration {similarity, importance, recency}
 * @returns New array sorted by intentAdjustedScore descending
 */
function applyIntentWeightsToResults(
  results: PipelineRow[],
  weights: IntentWeightsConfig
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;
  if (!weights) return results;

  const scored: ScoredRow[] = results.map((row) => {
 exited 1 in 51ms:

 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:12:/** Represents fusion weights. */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:14:  /** Weight for semantic/vector search results (0-1) */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:15:  semanticWeight: number;
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:16:  /** Weight for keyword/lexical search results (0-1) */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:17:  keywordWeight: number;
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:18:  /** Weight for recency-based scoring (0-1) */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:19:  recencyWeight: number;
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:38:/** Represents adaptive fusion result. */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:41:  weights: FusionWeights;
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:57:  understand:      { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.15, graphCausalBias: 0.10 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:58:  find_spec:       { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.30, graphCausalBias: 0.10 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:59:  fix_bug:         { semanticWeight: 0.4, keywordWeight: 0.4, recencyWeight: 0.2, graphWeight: 0.10, graphCausalBias: 0.15 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60:  add_feature:     { semanticWeight: 0.5, keywordWeight: 0.3, recencyWeight: 0.2, graphWeight: 0.20, graphCausalBias: 0.15 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:61:  refactor:        { semanticWeight: 0.6, keywordWeight: 0.3, recencyWeight: 0.1, graphWeight: 0.15, graphCausalBias: 0.10 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:62:  security_audit:  { semanticWeight: 0.3, keywordWeight: 0.5, recencyWeight: 0.2, graphWeight: 0.15, graphCausalBias: 0.10 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:63:  find_decision:   { semanticWeight: 0.3, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.50, graphCausalBias: 0.15 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:67:  semanticWeight: 0.5,
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68:  keywordWeight: 0.3,
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:69:  recencyWeight: 0.2,
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:78:/** Small weight shift applied per document type to fine-tune intent weights. */
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: BM25 Index
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { normalizeContentForBM25 } from '../parsing/content-normalizer';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

interface BM25SearchResult {
  id: string;
  /**
   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
   * Higher = better lexical match. Not directly comparable to vector similarity
   * scores; use min-max normalization or RRF when combining with other methods.
   */
  score: number;
}
exec
/bin/zsh -lc "rg -n \"spec_folder|specFolder|memory_index|SELECT id|filter\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
105:    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
248:        `SELECT id, title, content_text, trigger_phrases, file_path
249:         FROM memory_index
324:  // Remove FTS5 special characters and column-filter colon.
331:    .filter(Boolean);
exec
/bin/zsh -lc "rg -n \"bm25.*spec_folder|spec_folder.*bm25|BM25.*spec_folder|resolve.*spec_folder|stringified numbers|spec folder.*BM25|bm25.*filter\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:192:    it('T031-BM25-06: bm25_search() respects spec_folder filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:861:    const bm25Sources = results.filter(r => r.source === 'bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:262:    // r.id against specFolder which never matched. Use DB lookup to resolve spec_folder.
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:550:      bm25.addDocument('filt1', 'memory retrieval search testing document indexing vector semantic hybrid filter');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:551:      bm25.addDocument('filt2', 'memory retrieval search testing document indexing vector semantic hybrid filter');
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:331:    const bm25Count = result.results.filter(r => r.source === 'bm25').length;
exec
/bin/zsh -lc "sed -n '240,290p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
}

/* --- 8. BM25 SEARCH --- */

/**
 * Search the BM25 index with optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit and specFolder filter.
 * @returns Array of BM25-scored results tagged with source 'bm25'.
 */
function bm25Search(
  query: string,
  options: { limit?: number; specFolder?: string } = {}
): HybridSearchResult[] {
  const { limit = DEFAULT_LIMIT, specFolder } = options;

  try {
    const index = getIndex();
    const results = index.search(query, limit);

exec
/bin/zsh -lc "sed -n '318,410p' '.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '428,455p' '.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '150,172p' '.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '96,170p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
 */
function normalizeRrfScores(results: FusionResult[]): void {
  if (results.length === 0) return;

  // AI-WHY: Avoid Math.max(...scores) / Math.min(...scores) — spread on large
  // arrays can exceed the JS engine call-stack argument limit and throw
  // "Maximum call stack size exceeded". A simple for-loop is O(n) and safe.
  let maxScore = -Infinity;
  let minScore = Infinity;
  const invalidResults = new Set<FusionResult>();
  for (const r of results) {
    if (!Number.isFinite(r.rrfScore)) {
      r.rrfScore = 0; // AI: Fix F2 — guard against NaN/Infinity weights.
      invalidResults.add(r);
      continue;
    }
    if (r.rrfScore > maxScore) maxScore = r.rrfScore;
    if (r.rrfScore < minScore) minScore = r.rrfScore;
  }
  if (maxScore === -Infinity || minScore === Infinity) return;
 succeeded in 52ms:
 * cross-variant convergence bonus when the same ID appears in results
 * from different query variants.
 *
 * @param variantLists - Array of variant result sets, each containing
 *                       multiple RankedLists (e.g., vector + fts per variant)
 * @param options - Standard fusion options
 * @returns Fused results with cross-variant convergence bonuses
 */
function fuseResultsCrossVariant(
  variantLists: RankedList[][],
  options: FuseMultiOptions = {}
): FusionResult[] {
  // Use ?? so callers can explicitly pass 0 convergence bonus without falling back to default
  const convergenceBonusPerVariant = options.convergenceBonus ?? CONVERGENCE_BONUS;
  const k = options.k ?? DEFAULT_K;
  if (k < 0) throw new Error('RRF k parameter must be non-negative');

  if (variantLists.length === 0) return [];

  // Step 1: Fuse each variant's lists independently
 succeeded in 51ms:
        break;
      case 'research':
        // Research docs: semantic similarity is paramount
        weights.semanticWeight = Math.min(1.0, weights.semanticWeight + DOC_TYPE_WEIGHT_SHIFT);
        weights.keywordWeight = Math.max(0, weights.keywordWeight - DOC_TYPE_WEIGHT_SHIFT);
        break;
      // No default adjustment needed
    }
  }

  // AI-WHY: Fix #10 (017-refinement-phase-6), P1-008 — Normalize core weights
  // (semantic + keyword + recency) to sum 1.0. Always applied regardless of
  // documentType presence. graphWeight and graphCausalBias are separate boosts,
  // not part of the weighted average.
  const coreSum = weights.semanticWeight + weights.keywordWeight + weights.recencyWeight;
  if (coreSum > 0 && Math.abs(coreSum - 1.0) > 0.001) {
    weights.semanticWeight /= coreSum;
    weights.keywordWeight /= coreSum;
    weights.recencyWeight /= coreSum;
  }
 succeeded in 51ms:
 * @param database - SQLite database instance
 * @param memoryId - ID of the memory to compute interference for
 * @param specFolder - spec_folder of the memory
 * @param threshold - similarity threshold (default: 0.75)
 * @returns interference count (0 = no similar memories)
 */
export function computeInterferenceScore(
  database: Database.Database,
  memoryId: number,
  specFolder: string,
  threshold: number = INTERFERENCE_SIMILARITY_THRESHOLD
): number {
  if (!specFolder) return 0;

  // Get the target memory's text fields
  const targetRow = database.prepare(
    'SELECT title, trigger_phrases FROM memory_index WHERE id = ?'
  ).get(memoryId) as { title: string | null; trigger_phrases: string | null } | undefined;

  if (!targetRow) return 0;
exec
/bin/zsh -lc "rg -n \"function computeRecencyScore|const computeRecencyScore|timestamp range|minTs|maxTs|recency\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
222: *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
229: * @param weights - Intent weight configuration {similarity, importance, recency}
251:    const recencyTimestamp = (row.created_at as string | undefined) ?? '';
253:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
258:      recency * weights.recency;
exec
/bin/zsh -lc "rg -n \"computeRecencyScore\" '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:62:import { computeRecencyScore } from '../../scoring/folder-scoring';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:253:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:11:  computeRecencyScore: (_ts: string, _tier: string, _rate: number) => 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:208:      const constRecency = mod.computeRecencyScore(oldTimestamp, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:209:      const normalRecency = mod.computeRecencyScore(oldTimestamp, 'normal');
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:7:import { computeRecencyScore, DECAY_RATE } from './folder-scoring';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:447:  return computeRecencyScore(timestamp || '', tier, DECAY_RATE);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:62:import { computeRecencyScore } from '../../scoring/folder-scoring';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:253:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:13:  computeRecencyScore,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:157:  // 5.5 computeRecencyScore and DECAY_RATE exports
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:159:    it('T-FS-12: computeRecencyScore exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:160:      expect(typeof computeRecencyScore).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:161:      const score = computeRecencyScore(new Date().toISOString());
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"toolCache|cacheKey|getCachedOrExecute|invalidateToolCache|tool-cache|TOOL_CACHE|memory_search|memory_save|memory_delete|memory_bulk_delete\" '.opencode/skill/system-spec-kit/mcp_server/handlers' '.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Mutation Hooks
// ---------------------------------------------------------------

import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { clearConstitutionalCache } from '../hooks/memory-surface';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';

import type { MutationHookResult } from './memory-crud-types';

export type { MutationHookResult };

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  const startTime = Date.now();

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Tool Cache
// ---------------------------------------------------------------

import crypto from 'crypto';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ToolCacheConfig {
  enabled: boolean;
  defaultTtlMs: number;
  maxEntries: number;
  cleanupIntervalMs: number;
}

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: TOOL CACHE
// ---------------------------------------------------------------

// Converted from: tool-cache.test.ts (node:test runner)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import {
  get,
  set,
  has,
  del,
  clear,
  generateCacheKey,
  invalidateByTool,
  invalidateByPattern,
  invalidateOnWrite,
  withCache,
  evictOldest,
  cleanupExpired,
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:49:const TOOL_CACHE_CONFIG: ToolCacheConfig = {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:50:  enabled: process.env.ENABLE_TOOL_CACHE !== 'false',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:51:  defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:52:  maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES || '1000', 10) || 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:53:  cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS || '30000', 10) || 30000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:77:    throw new Error('[tool-cache] toolName must be a non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:121:  if (!TOOL_CACHE_CONFIG.enabled) return null;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:141:  if (!TOOL_CACHE_CONFIG.enabled) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:143:  const { toolName = 'unknown', ttlMs = TOOL_CACHE_CONFIG.defaultTtlMs } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:146:  if (cache.size >= TOOL_CACHE_CONFIG.maxEntries) {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:162:  if (!TOOL_CACHE_CONFIG.enabled) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:210:    console.warn(`[tool-cache] Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:238:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:253:    console.error(`[tool-cache] Invalidated ${totalInvalidated} entries after ${operation}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:296:  }, TOOL_CACHE_CONFIG.cleanupIntervalMs);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:322:  if (!TOOL_CACHE_CONFIG.enabled || bypassCache) {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:355:    maxSize: TOOL_CACHE_CONFIG.maxEntries,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:367:  return { ...TOOL_CACHE_CONFIG };
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:371:  return TOOL_CACHE_CONFIG.enabled;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:380:  console.error(`[tool-cache] Initialized with ${TOOL_CACHE_CONFIG.defaultTtlMs}ms TTL, max ${TOOL_CACHE_CONFIG.maxEntries} entries`);
exec
/bin/zsh -lc "sed -n '260,430p' '.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   7. EVICTION & CLEANUP
--------------------------------------------------------------- */

// AI-WHY: Maps maintain insertion order; the first key is always the oldest
// entry. This replaces an O(n) full-scan with O(1) eviction.
function evictOldest(): void {
  const oldestKey = cache.keys().next().value;
  if (oldestKey !== undefined) {
    cache.delete(oldestKey);
    stats.evictions++;
  }
}

function cleanupExpired(): number {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      keysToDelete.push(key);
exec
/bin/zsh -lc "rg -n \"withCache\\(|generateCacheKey\\(|invalidateOnWrite\\(\" '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:31:    toolCacheInvalidated = toolCache.invalidateOnWrite(operation, context);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763:  const cachedResult = await toolCache.withCache(
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:368:    toolCache.invalidateOnWrite('chunked-save-rollback', { filePath });
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:451:      toolCache.invalidateOnWrite('chunked-save-rollback', { filePath });
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:490:  toolCache.invalidateOnWrite('chunked-save', { filePath });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:96:| `generateCacheKey(toolName, args)` | SHA-256 hash from tool name + canonicalized args |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:104:| `invalidateOnWrite(operation, context)` | Auto-invalidate after write operations |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:113:await withCache(toolName, args, asyncFn, options);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:176:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:190:const result = await withCache(
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:204:invalidateOnWrite('save', { specFolder: 'specs/<###-spec-name>' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:216:function generateCacheKey(query: string, docIds: Array<number | string>): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:393:    const cacheKey = generateCacheKey(query, documents.map(d => d.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433:      const cacheKey = generateCacheKey(query, documents.map(d => d.id));
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:75:function generateCacheKey(toolName: string, args: unknown): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:236:function invalidateOnWrite(operation: string, _context: Record<string, unknown> = {}): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:326:  const key = generateCacheKey(tool_name, args);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:129:      const key1 = crossEncoder.generateCacheKey('test query', ['a', 'b']);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:130:      const key2 = crossEncoder.generateCacheKey('test query', ['a', 'b']);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:135:      const key1 = crossEncoder.generateCacheKey('sort test', ['z', 'a', 'm']);
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' '.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"access_count|last_access|0\\.1|0\\.5|10000|getAccessStats|dormancy|archiv|popularity\" '.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts' '.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '300,360p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Access Tracker
// ---------------------------------------------------------------
// Batched access tracking with accumulator
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const ACCUMULATOR_THRESHOLD = 0.5;
const INCREMENT_VALUE = 0.1;
// AI-TRACE: P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
const MAX_ACCUMULATOR_SIZE = 10000;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Archival Manager
// ---------------------------------------------------------------
// Background archival job for dormant/archived memories
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. DEPENDENCIES (lazy-loaded)
----------------------------------------------------------------*/

// AI-WHY: Lazy-load tier-classifier to avoid circular dependencies
let tierClassifierModule: Record<string, unknown> | null = null;

function getTierClassifier(): Record<string, unknown> | null {
  if (tierClassifierModule !== null) return tierClassifierModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    tierClassifierModule = require('./tier-classifier');
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:15:  access_count: number;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:37:        access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:38:        last_accessed INTEGER DEFAULT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:86:      // Track access 5 times for memory 2 (5 * 0.1 = 0.5 >= threshold)
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:91:      // The 5th call should trigger flush (0.4 + 0.1 = 0.5 >= ACCUMULATOR_THRESHOLD)
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:94:      const row = requireDb().prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as AccessCountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:95:      expect(row.access_count).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:162:      const expectedAccumulated = mod.INCREMENT_VALUE || 0.1;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:21:  access_count: number;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:22:  last_accessed: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:41:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:42:      last_accessed TEXT DEFAULT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:85:      const row = requireTestDb().prepare('SELECT access_count, last_accessed FROM memory_index WHERE id = 1').get() as AccessRow;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:87:      expect(row.access_count).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:88:      expect(row.last_accessed).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:91:    it('flushAccessCounts increments access_count cumulatively', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:98:      const row = requireTestDb().prepare('SELECT access_count FROM memory_index WHERE id = 1').get() as Pick<AccessRow, 'access_count'>;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:99:      expect(row.access_count).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:216:    it('MAX_ACCUMULATOR_SIZE is 10000', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:217:      expect(mod.MAX_ACCUMULATOR_SIZE).toBe(10000);
 succeeded in 51ms:
  // AI-WHY: Inline FSRS power-law formula used when fsrs-scheduler module unavailable
  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);

  return Math.max(0, Math.min(1, retrievability));
}

export const calculateTemporalScore = calculateRetrievabilityScore;

/**
 * T032: Calculate usage score (REQ-017 Factor 2)
 * Formula: min(1.5, 1.0 + accessCount * 0.05)
 * Normalized to 0-1 range for composite scoring
 */
export function calculateUsageScore(accessCount: number): number {
  accessCount = Math.max(0, accessCount);
  const count = accessCount || 0;
  const usageBoost = Math.min(1.5, 1.0 + count * 0.05);
  return (usageBoost - 1.0) / 0.5;
}

exec
/bin/zsh -lc "sed -n '240,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  }
  exitHandlersInstalled = false;
}

/* -------------------------------------------------------------
   7. EXPORTS
----------------------------------------------------------------*/

export {
  ACCUMULATOR_THRESHOLD,
  INCREMENT_VALUE,
  MAX_ACCUMULATOR_SIZE,

  init,
  trackAccess,
  trackMultipleAccesses,
  flushAccessCounts,
  getAccumulatorState,
  calculatePopularityScore,
  calculateUsageBoost,
exec
/bin/zsh -lc "rg -n \"trackAccess\\(|trackMultipleAccesses\\(|calculatePopularityScore\\(\" '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:51:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:81:function trackMultipleAccesses(memoryIds: number[]): { tracked: number; flushed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:140:function calculatePopularityScore(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:289:| Track access | `trackAccess(memoryId)` | After memory is retrieved |
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:187:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:192:      const result = mod.trackAccess(overflowId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:207:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:209:      mod.trackAccess(MAX + 2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:232:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:250:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:69:      const result1 = mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:88:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:92:      mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:105:      const result = mod.trackMultipleAccesses(memoryIds);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:116:      const zeroScore = mod.calculatePopularityScore(0, null, null);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:122:      const score = mod.calculatePopularityScore(10, recentAccess, null);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:160:      mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:612:  const popularityScore = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:694:        popularity: calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:752:  const popularity = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
exec
/bin/zsh -lc "rg -n \"access-tracker|trackAccess|trackMultipleAccesses\" '.opencode/skill/system-spec-kit/mcp_server/handlers' '.opencode/skill/system-spec-kit/mcp_server/lib/search' '.opencode/skill/system-spec-kit/mcp_server/api'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/api/README.md:18:| `storage.ts` | Storage init API | Checkpoint/access-tracker initialization |
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts:9:export { init as initAccessTracker } from '../lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:129:  trackAccess?: boolean; // AI-TRACE:P3-09: opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:610:    trackAccess: trackAccess = false, // AI-TRACE:P3-09: opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:802:          trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:107:5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:141:  trackAccess: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:27://   3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:413: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:470: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:600:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:603:  if (config.trackAccess) {
exec
/bin/zsh -lc "sed -n '400,460p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

    if (currentScore === resolveBaseScore(row)) return row;

    return {
      ...row,
      score: currentScore,
    };
  });
}

/**
 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
 *
 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
 * unintended write side-effects during read-only searches).
 *
 * For each result, the current retrievability R(t) is computed from the stored
 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
 * GRADE_GOOD update — increasing stability proportional to how much the memory
 * needed the review.
exec
/bin/zsh -lc "rg -n \"initAccessTracker|trackAccess\\b|access tracker|access_count\" '.opencode/skill/system-spec-kit/mcp_server/api' '.opencode/skill/system-spec-kit/mcp_server/context-server.ts' '.opencode/skill/system-spec-kit/mcp_server/core' '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:129:  trackAccess?: boolean; // AI-TRACE:P3-09: opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:610:    trackAccess: trackAccess = false, // AI-TRACE:P3-09: opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:802:          trackAccess,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:853:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts:9:export { init as initAccessTracker } from '../lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:15:import { initAccessTracker, initCheckpoints } from './storage';
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:33:    accessTracker: { init: initAccessTracker },
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:43:  initAccessTracker(database);
exec
/bin/zsh -lc "rg -n \"lib/storage/access-tracker|from '../lib/storage/access-tracker'|from \\\"../lib/storage/access-tracker\\\"|trackMultipleAccesses\\(|trackAccess\\(\" '.opencode/skill/system-spec-kit/mcp_server' | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:65:import * as accessTracker from './lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/cli.ts:19:import * as accessTracker from './lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts:9:export { init as initAccessTracker } from '../lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:15:vi.mock('../lib/storage/access-tracker', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:342:      '../lib/storage/access-tracker',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:479:      vi.doMock('../lib/storage/access-tracker', () => ({ init: vi.fn(), reset: vi.fn() }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1584:      { module: './lib/storage/access-tracker', name: 'Access tracker' },
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:11:import * as mod from '../lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:69:      const result1 = mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:88:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:92:      mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:105:      const result = mod.trackMultipleAccesses(memoryIds);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:160:      mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:7:import * as mod from '../lib/storage/access-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:187:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:192:      const result = mod.trackAccess(overflowId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:207:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:209:      mod.trackAccess(MAX + 2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:232:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:250:        mod.trackAccess(2);
exec
/bin/zsh -lc "rg -n \"accessTracker\\.|init\\(db\\)|trackAccess|trackMultipleAccesses\" '.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"accessTracker\\.|trackAccess|trackMultipleAccesses\" '.opencode/skill/system-spec-kit/mcp_server/cli.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
92:  accessTracker.init(db);
 succeeded in 53ms:
581:  runCleanupStep('accessTracker', () => accessTracker.reset());
662:  runCleanupStep('accessTracker', () => accessTracker.reset());
846:    accessTracker.init(database);
exec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"coherence|temporal|quality score|trigger coverage|anchor density|token budget|rejection|quality loop\" '.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '320,520p' '.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:11:  coherence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:26:  rejectionReason?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:35:  coherence: 0.25,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:144: * Compute token budget quality sub-score.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:174:  issues.push(`Content exceeds token budget: ~${Math.ceil(charCount / CHARS_PER_TOKEN)} tokens (budget: ${DEFAULT_TOKEN_BUDGET})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:179: * Compute coherence quality sub-score.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:230: * Compute composite quality score for a memory file.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:237: *   - coherence × 0.25
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:249: *     `budget`, `coherence`), each in [0, 1].
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:251: *     in order: triggers → anchors → budget → coherence.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:260:  const coherenceResult = scoreCoherence(content);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:266:    coherenceResult.score * QUALITY_WEIGHTS.coherence;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:274:      coherence: coherenceResult.score,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:280:      ...coherenceResult.issues,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:291: * - Trim content to token budget
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:326:  const hasBudgetIssue = issues.some(i => /token budget/i.test(i));
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:396: * Run the verify-fix-verify quality loop on memory content.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:399: * Computes quality score, attempts auto-fix if below threshold,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:405: * @returns QualityLoopResult with pass/fail, scores, fixes, rejection info
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:475:  const rejectionReason = `Quality score ${score.total.toFixed(3)} below threshold ${threshold} after ${maxRetries} auto-fix attempts. Issues: ${score.issues.join('; ')}`;
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Quality Loop (T008)
// ---------------------------------------------------------------

import { initEvalDb } from '../lib/eval/eval-db';

interface QualityScoreBreakdown {
  triggers: number;
  anchors: number;
  budget: number;
  coherence: number;
}

interface QualityScore {
  total: number;
  breakdown: QualityScoreBreakdown;
  issues: string[];
}

interface QualityLoopResult {
 succeeded in 52ms:
  if (hasAnchorIssue) {
    fixedContent = normalizeAnchors(fixedContent);
    fixed.push('Normalized unclosed ANCHOR tags');
  }

  // Fix #3 (017-refinement-phase-6): Trim content to budget
  const hasBudgetIssue = issues.some(i => /token budget/i.test(i));
  if (hasBudgetIssue) {
    if (fixedContent.length > DEFAULT_CHAR_BUDGET) {
      // Trim to budget, preserving the last newline boundary
      const trimmed = fixedContent.substring(0, DEFAULT_CHAR_BUDGET);
      const lastNewline = trimmed.lastIndexOf('\n');
      fixedContent = lastNewline > 0 ? trimmed.substring(0, lastNewline) : trimmed;
      fixed.push(`Trimmed content from ${content.length} to ${fixedContent.length} chars`);
    }
  }

  return { content: fixedContent, metadata: fixedMetadata, fixed };
}

codex
I’ve finished most of the code tracing. I’m doing one systematic pass over every path listed in the seven `Source Files` tables now so the final report can separate description issues from plain path-validity issues.
exec
/bin/zsh -lc "python3 -c \"import os, re, json; root=os.path.abspath('.opencode/skill/system-spec-kit'); files=['feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md','feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md','feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md','feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md','feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md','feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md','feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md'];
for rel in files:
 p=os.path.join(root, rel); text=open(p).read(); s=text[text.find('## Source Files'):] if '## Source Files' in text else ''; paths=re.findall(r'"'`([''^`]+)`'"', s); invalid=[pp for pp in paths if not os.path.exists(os.path.join(root, pp))]; print(os.path.basename(rel)); print(json.dumps({'count': len(paths), 'invalid': invalid}, indent=2))\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:
zsh:3: unmatched "
exec
/bin/zsh -lc "python3 -c 'import os,re,json
root=os.path.abspath(\".opencode/skill/system-spec-kit\")
files=[\"feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md\",\"feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md\",\"feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md\",\"feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md\",\"feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md\",\"feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md\",\"feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md\"]
for rel in files:
 p=os.path.join(root,rel)
 text=open(p).read()
 s=text[text.find(\"## Source Files\"):] if \"## Source Files\" in text else \"\"
 paths=re.findall(r\""'`([''^`]+)`", s)
 invalid=[pp for pp in paths if not os.path.exists(os.path.join(root, pp))]
 print(os.path.basename(rel))
 print(json.dumps({"count": len(paths), "invalid": invalid}, indent=2))'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 719ms:
11-scoring-and-ranking-corrections.md
{
  "count": 27,
  "invalid": []
}
12-stage-3-effectivescore-fallback-chain.md
{
  "count": 94,
  "invalid": [
    "mcp_server/tests/retry.vitest.ts"
  ]
}
13-scoring-and-fusion-corrections.md
{
  "count": 8,
  "invalid": []
}
14-local-gguf-reranker-via-node-llama-cpp.md
{
  "count": 86,
exec
/bin/zsh -lc "rg -n \"effectiveScore|resolveEffectiveScore|stage2Score|intentAdjustedScore|rrfScore\" '.opencode/skill/system-spec-kit/mcp_server/tests'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:338:  it('T21: does not modify score, rrfScore, or similarity fields', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:343:        rrfScore: 0.68,
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:353:    expect(enriched[0].rrfScore).toBe(0.68);
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:357:  it('T22: does not modify intentAdjustedScore or importance_weight', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:361:        intentAdjustedScore: 0.91,
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:369:    expect(enriched[0].intentAdjustedScore).toBe(0.91);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:58:function makeFusionResult(id: number, rrfScore: number): FusionResult {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:61:    rrfScore,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:63:    sourceScores: { test: rrfScore },
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:94:      expect(results[0].rrfScore).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:95:      expect(results[1].rrfScore).toBeCloseTo(0.5, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:96:      expect(results[2].rrfScore).toBeCloseTo(0.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:100:        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:101:        expect(r.rrfScore).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:108:      expect(results[0].rrfScore).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:121:        expect(r.rrfScore).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:145:        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:146:        expect(r.rrfScore).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:149:      expect(results[0].rrfScore).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:151:      expect(results[results.length - 1].rrfScore).toBeCloseTo(0.0, 5);
exec
/bin/zsh -lc "sed -n '545,570p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
 * T032: Calculate 5-factor composite score (REQ-017)
 *
 * Returns a single 0-1 score combining five weighted factors:
 * temporal (FSRS retrievability), usage (access frequency),
 * importance (tier-based), pattern (query alignment), and citation (recency).
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional weights, query, anchors, model selection
 * @returns Composite score 0-1
 */
export function calculateFiveFactorScore(row: ScoringInput, options: ScoringOptions = {}): number {
  const rawWeights: FiveFactorWeights = { ...FIVE_FACTOR_WEIGHTS, ...(options.weights as Partial<FiveFactorWeights>) };
  // AI-WHY: Fix #6 (017-refinement-phase-6) — Normalize weights to sum 1.0 after
  // merging partial overrides. Without this, partial overrides break weighted-average semantics.
  const wSum = rawWeights.temporal + rawWeights.usage + rawWeights.importance + rawWeights.pattern + rawWeights.citation;
  const weights: FiveFactorWeights = Math.abs(wSum - 1.0) > 0.001 && wSum > 0
    ? {
        temporal: rawWeights.temporal / wSum,
        usage: rawWeights.usage / wSum,
        importance: rawWeights.importance / wSum,
exec
/bin/zsh -lc "rg -n \"runPostMutationHooks\\(\" '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts' '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts' '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts' '.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:213:      postMutationHooks = runPostMutationHooks('bulk-delete', { specFolder, tier, deletedCount });
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:193:      postMutationHooks = runPostMutationHooks('save', { specFolder: result.specFolder, filePath });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:205:    postMutationHooks = runPostMutationHooks('update', { memoryId: id });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:453:      postMutationHooks = runPostMutationHooks('atomic-save', {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:206:      postMutationHooks = runPostMutationHooks('delete', { specFolder, deletedCount });
exec
/bin/zsh -lc "rg -n \"stage2Score|resolveEffectiveScore|effectiveScore\\(|intentAdjustedScore.*similarity|rrfScore.*similarity\" '.opencode/skill/system-spec-kit/mcp_server/tests' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:338:  it('T21: does not modify score, rrfScore, or similarity fields', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:494:    const SCORE_FIELDS = ['score', 'rrfScore', 'similarity', 'intentAdjustedScore', 'importance_weight'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:170:    // System B should create intentAdjustedScore based on similarity/importance
exec
/bin/zsh -lc "rg -n \"Fix #5|Fix #6|Fix #7|Fix #8|Fix #9|Fix #10|Fix #11|Fix #12|017-refinement-phase-6\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:137:      // Fix #13 (017-refinement-phase-6): Expose previously hidden handler parameters
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:160:  // AI-WHY: Fix #10 (017-refinement-phase-6), P1-008 — Normalize core weights
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:333:          // AI-WHY: Fix #30 (017-refinement-phase-6) — WM already applies its own decay.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:335:  // AI-WHY: Fix #35 (017-refinement-phase-6) — Allow re-correction by accepting
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:305:  // AI-WHY: Fix #37 (017-refinement-phase-6) — Use 128-bit (32 hex chars) instead of
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:394:  // AI-WHY: Fix #28 (017-refinement-phase-6) — cleanupOrphanedEdges was exported but
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:543:// 017-refinement-phase-6 Sprint 1. These were only used by the legacy V1 pipeline.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:576:// 017-refinement-phase-6 Sprint 1. These were only used by the legacy V1 pipeline
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:775:      // AI-WHY: V2 pipeline is the only path (legacy V1 removed in 017-refinement-phase-6)
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:22:  // AI-WHY: Fix #36 (017-refinement-phase-6) — Guard against null/undefined/non-object
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:250:  // AI-WHY: Fix #25 (017-refinement-phase-6) — Clamp maxDepth to [1, 10] server-side
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:199:// was part of legacy V1 pipeline, removed in 017-refinement-phase-6 Sprint 1.
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:246:      // was removed in 017-refinement-phase-6. Length penalty is now handled by the V2
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:265:      // was removed in 017-refinement-phase-6. The V2 pipeline's Stage 3 passes length penalty
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:304:  // Fix #1 (017-refinement-phase-6): Re-extract trigger phrases if missing/insufficient
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:318:  // Fix #2 (017-refinement-phase-6): Close unclosed ANCHOR tags
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:325:  // Fix #3 (017-refinement-phase-6): Trim content to budget
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:85:      // AI-WHY: Fix #33 (017-refinement-phase-6) — Use recallK, not hardcoded 20
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:90:      // AI-WHY: Fix #19 (017-refinement-phase-6) — Embed title + content_text, not title alone.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:357:      // AI-WHY: Fix #23 (017-refinement-phase-6) — Use the actual error code from the
exec
/bin/zsh -lc "sed -n '470,520p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
 * @param intent - Intent type to get weights for
 * @returns Weight adjustments for recency, importance, similarity, and context type
 */
function getIntentWeights(intent: IntentType): IntentWeights {
  return INTENT_WEIGHT_ADJUSTMENTS[intent] ?? INTENT_WEIGHT_ADJUSTMENTS.understand;
}

/**
 * Apply intent-based weight adjustments to search results.
 *
 * @param results - Array of search result records
 * @param intent - Classified intent type to apply
 * @returns Results sorted by intent-adjusted score
 */
function applyIntentWeights(
  results: Array<Record<string, unknown>>,
  intent: IntentType
): Array<Record<string, unknown>> {
  const weights = getIntentWeights(intent);

exec
/bin/zsh -lc "rg -n \"node-llama-cpp|bge-reranker-v2-m3|RERANKER_LOCAL|SPECKIT_RERANKER_MODEL\" '.opencode/skill/system-spec-kit/mcp_server/package.json' '.opencode/skill/system-spec-kit/mcp_server/package-lock.json' '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: .opencode/skill/system-spec-kit/mcp_server/package-lock.json: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/package.json:45:    "node-llama-cpp": "^3.15.1",
.opencode/skill/system-spec-kit/mcp_server/README.md:760:| `RERANKER_LOCAL`                | `false` | Use local GGUF reranker path (`node-llama-cpp`) instead of remote Cohere/Voyage in Stage 3 |
.opencode/skill/system-spec-kit/mcp_server/README.md:761:| `SPECKIT_RERANKER_MODEL`        | `models/bge-reranker-v2-m3.Q4_K_M.gguf` | Optional custom model path override for local reranker |
.opencode/skill/system-spec-kit/mcp_server/README.md:768:When `RERANKER_LOCAL=true`, Stage 3 reranking uses `node-llama-cpp` with a local GGUF model.
.opencode/skill/system-spec-kit/mcp_server/README.md:772:   - `npm install node-llama-cpp`
.opencode/skill/system-spec-kit/mcp_server/README.md:777:   - `models/bge-reranker-v2-m3.Q4_K_M.gguf` (about `350MB`)
.opencode/skill/system-spec-kit/mcp_server/README.md:779:   - `RERANKER_LOCAL=true`
.opencode/skill/system-spec-kit/mcp_server/README.md:780:   - `SPECKIT_RERANKER_MODEL=models/bge-reranker-v2-m3.Q4_K_M.gguf`
.opencode/skill/system-spec-kit/mcp_server/README.md:827:| `node-llama-cpp`            | ^3.15.1        | Local GGUF reranker runtime (optional) |
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:153:      originalLocal = process.env.RERANKER_LOCAL;
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:159:      if (originalLocal) process.env.RERANKER_LOCAL = originalLocal;
.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:167:      delete process.env.RERANKER_LOCAL;
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:33:  delete process.env.RERANKER_LOCAL;
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:40:  for (const key of ['VOYAGE_API_KEY', 'COHERE_API_KEY', 'RERANKER_LOCAL', 'ENABLE_BM25']) {
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:248:  it('RP-04: returns local when RERANKER_LOCAL=true', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:250:    process.env.RERANKER_LOCAL = 'true';
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:361:  it('IRA-04: returns true when RERANKER_LOCAL=true', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:363:    process.env.RERANKER_LOCAL = 'true';
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:19:  delete process.env.RERANKER_LOCAL;
exec
/bin/zsh -lc "sed -n '760,790p' '.opencode/skill/system-spec-kit/mcp_server/README.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
| `RERANKER_LOCAL`                | `false` | Use local GGUF reranker path (`node-llama-cpp`) instead of remote Cohere/Voyage in Stage 3 |
| `SPECKIT_RERANKER_MODEL`        | `models/bge-reranker-v2-m3.Q4_K_M.gguf` | Optional custom model path override for local reranker |
| `SPECKIT_EVAL_LOGGING`          | `false` | Evaluation telemetry logging |
| `SPECKIT_ABLATION`              | `false` | Ablation tool execution |
| `SPECKIT_LEARN_FROM_SELECTION`  | `true`  | Learned-feedback from selection events (R11 — 9 safeguards, 0.7x boost weight) |

#### Local GGUF Reranker Setup (Sprint 9 P1-5)

When `RERANKER_LOCAL=true`, Stage 3 reranking uses `node-llama-cpp` with a local GGUF model.

1. Install runtime:
   - `cd .opencode/skill/system-spec-kit`
   - `npm install node-llama-cpp`
2. Verify platform (Apple Silicon):
   - `uname -sm` should report `Darwin arm64`
   - `node -p "process.platform + ' ' + process.arch"` should report `darwin arm64`
3. Place model file:
   - `models/bge-reranker-v2-m3.Q4_K_M.gguf` (about `350MB`)
4. Configure environment:
   - `RERANKER_LOCAL=true`
exec
/bin/zsh -lc "rg -n \"4GB|512MB|free memory|2GB|8GB\" '.opencode/skill/system-spec-kit/mcp_server/README.md' '.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts' '.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:185:  // Use total system memory instead of free memory. On macOS/Linux,
exec
/bin/zsh -lc "rg -n \"quality-loop|runQualityLoop|computeMemoryQualityScore\" '.opencode/skill/system-spec-kit/mcp_server/handlers' '.opencode/skill/system-spec-kit/mcp_server/lib'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:253:function computeMemoryQualityScore(
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:407:function runQualityLoop(
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:418:    const score = computeMemoryQualityScore(content, metadata);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:431:  let score = computeMemoryQualityScore(currentContent, currentMetadata);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:453:    score = computeMemoryQualityScore(currentContent, currentMetadata);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:529:    console.warn('[quality-loop] logQualityMetrics failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:534:  computeMemoryQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:542:  runQualityLoop,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:31:  computeMemoryQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:33:  runQualityLoop,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:45:} from './quality-loop';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:50:} from './quality-loop';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:123:  // Feature behavior remains gated by SPECKIT_QUALITY_LOOP inside runQualityLoop().
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:124:  const qualityLoopResult = runQualityLoop(parsed.content, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:531:  computeMemoryQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:533:  runQualityLoop,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:569:const compute_memory_quality_score = computeMemoryQualityScore;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:571:const run_quality_loop = runQualityLoop;
exec
/bin/zsh -lc "rg -n \"8 \\* 1024|2 \\* 1024|totalmem|custom model|memory threshold|canUseLocalReranker|RERANKER_LOCAL\" '.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

Plan update
  ✓ Read feature catalog files 11 through 17 and extract Current Reality plus Source Files sections
  ✓ Inspect listed mcp_server source files and verify each path exists
  ✓ Compare descriptions to code and identify missing source files per feature
  → Summarize results in the user’s required output format
exec
/bin/zsh -lc "sed -n '1,20p' '.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: ARCHIVAL MANAGER
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import * as archivalManager from '../lib/cache/cognitive/archival-manager';
import Database from 'better-sqlite3';

/* ─────────────────────────────────────────────────────────────
   TEST SETUP
──────────────────────────────────────────────────────────────── */

type TestDatabase = Database.Database;
type TestMemoryInput = {
  spec_folder?: string;
  file_path?: string;
  title?: string;
  importance_tier?: string;
  created_at?: string;
exec
/bin/zsh -lc "find '.opencode/skill/system-spec-kit/mcp_server/lib/cache' -maxdepth 3 -type f | sed 's#"'^./##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
Plan update
  ✓ Read feature catalog files 11 through 17 and extract Current Reality plus Source Files sections
  ✓ Inspect listed mcp_server source files and verify each path exists
  ✓ Compare descriptions to code and identify missing source files per feature
  ✓ Summarize results in the user’s required output format
codex
---
FEATURE: 11-scoring-and-ranking-corrections.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/causal-boost.ts, mcp_server/lib/eval/ablation-framework.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The four fixes described are present in code, but the Source Files table omits the actual C3 and C4 implementation files. `composite-scoring.ts` covers C1/C2; `causal-boost.ts` covers the `UNION` recursion fix; `ablation-framework.ts` covers the `logBinomial()` overflow fix.

---
FEATURE: 12-stage-3-effectivescore-fallback-chain.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `pipeline/types.ts` now provides the canonical `intentAdjustedScore -> rrfScore -> score -> similarity/100` fallback, and `stage3-rerank.ts` uses it for cross-encoder/MMR plus `stage2Score` preservation. The table includes one nonexistent test file and misses Stage 2’s shared adoption of the same fallback logic.

---
FEATURE: 13-scoring-and-fusion-corrections.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/intent-classifier.ts, mcp_server/lib/scoring/composite-scoring.ts, mcp_server/lib/search/hybrid-search.ts, shared/algorithms/adaptive-fusion.ts, mcp_server/lib/search/pipeline/types.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/scoring/interference-scoring.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The Current Reality matches the code, but the Source Files table is far too narrow. Most of the described fixes are implemented outside the three listed files, especially intent recency weighting, five-factor normalization, BM25 spec-folder filtering, adaptive fusion normalization, shared effective-score resolution, post-signal score sync, and configurable interference threshold.

---
FEATURE: 14-local-gguf-reranker-via-node-llama-cpp.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/package.json
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The local GGUF reranker is implemented, but the memory gating in code is `8GB total` by default and `2GB total` with a custom model, not `4GB free` and `512MB`. Stage 3 integration lives in `stage3-rerank.ts`, and the `node-llama-cpp` dependency is declared in `package.json`. One listed test path does not exist.

---
FEATURE: 15-tool-level-ttl-cache.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts, mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/chunking-orchestrator.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `tool-cache.ts` matches the TTL, SHA-256 keying, max-size eviction, stats, and cleanup behavior. The table omits the handlers that actually use the cache or trigger invalidation after writes/deletes/chunked saves.

---
FEATURE: 16-access-driven-popularity-scoring.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/api/storage.ts, mcp_server/api/indexing.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The accumulator logic, `0.1` increment, `0.5` flush threshold, `10000` cap, popularity scoring, and archival use of access data are present. But the code updates `last_accessed`, not `last_access_at`; there is no `getAccessStats()` export; and I did not find a retrieval-path call that actually invokes `trackAccess()` on search hits. The tracker is initialized, but not clearly wired into live retrieval flow.

---
FEATURE: 17-temporal-structural-coherence-scoring.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: `quality-loop.ts` does include a `coherence` dimension, but it is purely structural: non-empty content, minimum length, Markdown headings, and >200 characters. There is no temporal reasoning about future events, chronological consistency, spec-folder ordering, or causal-predecessor existence. `memory-save.ts` is also an important missing caller because it runs the quality loop and enforces rejection behavior.
---
tokens used
138,914
---
FEATURE: 11-scoring-and-ranking-corrections.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/causal-boost.ts, mcp_server/lib/eval/ablation-framework.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The four fixes described are present in code, but the Source Files table omits the actual C3 and C4 implementation files. `composite-scoring.ts` covers C1/C2; `causal-boost.ts` covers the `UNION` recursion fix; `ablation-framework.ts` covers the `logBinomial()` overflow fix.

---
FEATURE: 12-stage-3-effectivescore-fallback-chain.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `pipeline/types.ts` now provides the canonical `intentAdjustedScore -> rrfScore -> score -> similarity/100` fallback, and `stage3-rerank.ts` uses it for cross-encoder/MMR plus `stage2Score` preservation. The table includes one nonexistent test file and misses Stage 2’s shared adoption of the same fallback logic.

---
FEATURE: 13-scoring-and-fusion-corrections.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/intent-classifier.ts, mcp_server/lib/scoring/composite-scoring.ts, mcp_server/lib/search/hybrid-search.ts, shared/algorithms/adaptive-fusion.ts, mcp_server/lib/search/pipeline/types.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/scoring/interference-scoring.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The Current Reality matches the code, but the Source Files table is far too narrow. Most of the described fixes are implemented outside the three listed files, especially intent recency weighting, five-factor normalization, BM25 spec-folder filtering, adaptive fusion normalization, shared effective-score resolution, post-signal score sync, and configurable interference threshold.

---
FEATURE: 14-local-gguf-reranker-via-node-llama-cpp.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/package.json
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The local GGUF reranker is implemented, but the memory gating in code is `8GB total` by default and `2GB total` with a custom model, not `4GB free` and `512MB`. Stage 3 integration lives in `stage3-rerank.ts`, and the `node-llama-cpp` dependency is declared in `package.json`. One listed test path does not exist.

---
FEATURE: 15-tool-level-ttl-cache.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts, mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/chunking-orchestrator.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `tool-cache.ts` matches the TTL, SHA-256 keying, max-size eviction, stats, and cleanup behavior. The table omits the handlers that actually use the cache or trigger invalidation after writes/deletes/chunked saves.

---
FEATURE: 16-access-driven-popularity-scoring.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/api/storage.ts, mcp_server/api/indexing.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The accumulator logic, `0.1` increment, `0.5` flush threshold, `10000` cap, popularity scoring, and archival use of access data are present. But the code updates `last_accessed`, not `last_access_at`; there is no `getAccessStats()` export; and I did not find a retrieval-path call that actually invokes `trackAccess()` on search hits. The tracker is initialized, but not clearly wired into live retrieval flow.

---
FEATURE: 17-temporal-structural-coherence-scoring.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: `quality-loop.ts` does include a `coherence` dimension, but it is purely structural: non-empty content, minimum length, Markdown headings, and >200 characters. There is no temporal reasoning about future events, chronological consistency, spec-folder ordering, or causal-predecessor existence. `memory-save.ts` is also an important missing caller because it runs the quality loop and enforces rejection behavior.
---
