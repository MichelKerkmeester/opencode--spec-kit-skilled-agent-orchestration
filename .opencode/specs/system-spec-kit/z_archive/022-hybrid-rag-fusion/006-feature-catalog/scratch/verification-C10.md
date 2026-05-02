OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-287e-7fe3-9573-508a8c39881e
--------
user
You are a feature catalog verification agent. Read these feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md (6 files), then /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md (4 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
I’m verifying those 10 feature snippets directly against the `mcp_server` code, with no edits or sub-agents. First I’m pulling the snippet contents and their listed source paths, then I’ll cross-check whether the descriptions match the implementation and whether any important files are missing.
Plan update
  → Read the 10 requested feature snippet files and extract each Current Reality summary plus Source Files list
  • Validate that every listed source path exists under the mcp_server tree
  • Inspect the relevant source code to judge description accuracy and identify missing important files
  • Produce the per-feature verification report in the requested format
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detection.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog snippet descriptions and source file coverage against system-spec-kit mcp_server code" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 563ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, !system-spec-kit(explicit), document~, file, folder"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), file~, specification~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
codex
Skill routing selected `system-spec-kit` for this verification because the request is about spec/feature catalog accuracy. I’m loading just the relevant guidance now, then I’ll continue the code-to-doc cross-check.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# ANCHOR tags as graph nodes

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Promoting parsed ANCHOR markers into typed graph nodes (most creative insight from cross-AI research, Gemini-2) is deferred behind a dedicated 2-day feasibility spike. Estimated effort: S-M (3-5 days).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
 succeeded in 52ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

 succeeded in 52ms:
# Causal depth signal

## Current Reality

Not all memories sit at the same level of abstraction. A root decision that caused five downstream implementation memories occupies a different position in the knowledge graph than a leaf node.

Causal depth measures each memory's maximum distance from root nodes (those with in-degree zero) via BFS traversal. The raw depth is normalized by graph diameter to produce a [0,1] score. A memory at depth 3 in a graph with diameter 6 scores 0.5.

Like momentum, the depth signal applies as an additive bonus in Stage 2, capped at +0.05. Batch computation via `computeCausalDepthScores()` shares the same session cache infrastructure as momentum. Both signals are applied together by `applyGraphSignals()`, which iterates over pipeline rows and adds the combined bonus. A single-node variant of `computeCausalDepth` was removed during Sprint 8 remediation as dead code (the batch version `computeCausalDepthScores` is the only caller).

The combined N2a+N2b adjustment is modest by design: up to +0.10 total. This keeps graph signals as a tiebreaker rather than a dominant ranking factor. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2a).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
 succeeded in 52ms:
# Community detection

## Current Reality

Individual memories are retrieved based on query similarity, but they exist within communities of related knowledge. Community detection identifies these clusters so that when one member surfaces, its neighbors get a retrieval boost.

The primary algorithm is BFS connected components over the causal edge adjacency list. This is fast and sufficient when the graph has natural cluster boundaries. When the largest connected component exceeds 50% of all nodes (meaning the graph is too densely connected for BFS to produce meaningful clusters), the system escalates to a simplified pure-TypeScript Louvain modularity optimization. The Louvain implementation performs iterative node moves between communities to maximize modularity score Q, converging when no single move improves Q.

Community assignments are stored in the `community_assignments` table with a UNIQUE constraint on `memory_id`. Detection and persistence helpers (`detectCommunities*`, `storeCommunityAssignments`) include debounce logic, but they are not auto-invoked in the Stage 2 hot path.

The `applyCommunityBoost()` function in the pipeline injects up to 3 community co-members into the result set at 0.3x the source memory's score, using whatever assignments already exist in `community_assignments`. Community injection runs in Stage 2 at position 2b (between causal boost and graph signals) so that injected rows also receive N2a+N2b momentum and depth adjustments. Runs behind the `SPECKIT_COMMUNITY_DETECTION` flag (default ON).

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
 succeeded in 50ms:
# Temporal contiguity layer

## Current Reality

The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given a set of search results, it queries for temporally adjacent memories within a configurable window (default 1 hour, max 24 hours) and applies a boost factor of 0.15 per temporally proximate neighbor, capped at a cumulative maximum of 0.50 per result.

The module also provides `queryTemporalNeighbors()` for direct temporal neighborhood lookups and `buildSpecFolderTimeline()` for constructing chronological timelines within a spec folder. This captures the cognitive principle that memories formed close together in time are often contextually related — the temporal contiguity effect from memory psychology.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal proximity boost and timeline queries |

### Tests

| File | Focus |
|------|-------|
 succeeded in 50ms:
# Causal neighbor boost and injection

## Current Reality

After Stage 2 fusion produces a ranked result set, the causal boost module walks the `causal_edges` graph to amplify scores for memories related to top-ranked seed results. Up to 25% of the result set (capped at 5) serves as seed nodes. The graph walk traverses up to 2 hops via a weighted recursive CTE, applying a per-hop boost capped at 0.05. Relation-type weight multipliers (supersedes > leads_to > relates_to) scale the boost so stronger causal relationships receive proportionally more amplification.

The combined causal + session boost ceiling is 0.20, preventing runaway score inflation from graph-dense clusters. The feature is gated by `SPECKIT_CAUSAL_BOOST` (default `true`). When disabled, results pass through without graph-based score adjustment.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor graph walk and boost application |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion invoking causal boost |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Pipeline type definitions |
| `mcp_server/lib/search/session-boost.ts` | Lib | Session boost (shared ceiling with causal) |

### Tests
 succeeded in 51ms:
# Classification-based decay

## Current Reality

Not all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.

FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability, and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.

The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/attention-decay.ts` | Lib | FSRS attention decay |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
 succeeded in 50ms:
# Score normalization

## Current Reality

The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
 succeeded in 50ms:
# Interference scoring

## Current Reality

Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed a 0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases) within the same spec folder, then applies a `-0.08 * interference_score` penalty in composite scoring. (Novelty boost remains disabled in the hot path.)

Both the threshold (0.75) and coefficient (-0.08) are provisional. They will be tuned empirically after two R13 evaluation cycles, tracked as FUT-S2-001. Runs behind the `SPECKIT_INTERFERENCE_SCORE` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |

### Tests

 succeeded in 51ms:
# Cold-start novelty boost

## Current Reality

FSRS temporal decay biases against recent items. A memory indexed 2 hours ago has barely any retrievability score, even when it is exactly what you need.

The novelty boost applies an exponential decay (`0.15 * exp(-elapsed_hours / 12)`) to memories under 48 hours old, counteracting that bias. At indexing time, the boost is 0.15. After 12 hours, it drops to about 0.055. By 48 hours, it is effectively zero.

The boost applies before FSRS decay and caps the composite score at 0.95 to prevent runaway inflation. One side effect: memories with high base scores (above 0.80) see diminished effective boost because the cap clips them. That is intentional. High-scoring memories do not need extra help.

**Sprint 8 update:** The `calculateNoveltyBoost()` call was removed from the hot scoring path in `composite-scoring.ts` because evaluation showed it always returned 0. The function definition remains but is no longer invoked during search. Telemetry fields are hardcoded to `noveltyBoostApplied: false, noveltyBoostValue: 0` for log schema compatibility.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
codex
I’ve got the feature summaries; next I’m tracing the exact implementation symbols and the listed paths inside `mcp_server` to separate real coverage from generic boilerplate file lists. That should let me flag both bad descriptions and over/under-inclusive source lists cleanly.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Graph and cognitive memory fixes

## Current Reality

Seven fixes (of 9 planned; 2 deferred) addressed graph integrity and cognitive scoring:

- **Self-loop prevention (#24):** `insertEdge()` rejects `sourceId === targetId`.
- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
- **Community debounce (#27):** Replaced edge-count-only debounce with `count:maxId` hash. Edge count alone can't detect deletions followed by insertions that maintain the same count.
- **Orphaned edge cleanup (#28):** New `cleanupOrphanedEdges()` function exported from `causal-edges.ts`.
- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
- **Double-decay removal (#30):** Trigger handler no longer applies `* turnDecayFactor` to `wmEntry.attentionScore` (WM already applies its own decay).
- **Co-activation cache (#32):** `clearRelatedCache()` called from `memory-bulk-delete.ts` after bulk operations.

**Deferred:** #26 (FK existence check on causal edges, test fixtures use synthetic IDs not in memory_index) and #31 (session entry limit off-by-one, code already correct).

## Source Files

### Implementation

exec
/bin/zsh -lc 'rg -n "temporal contiguity|temporal-contiguity|queryTemporalNeighbors|buildSpecFolderTimeline|0.15|0.50|1 hour|24 hours" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "computeCausalDepthScores|applyGraphSignals|computeGraphMomentumScores|SPECKIT_GRAPH_SIGNALS|computeCausalDepth" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applyCausalBoost|SPECKIT_CAUSAL_BOOST|seed.*25%|weighted recursive CTE|session boost|0.20|2 hops|supersedes|leads_to|relates_to" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"calculateNoveltyBoost|noveltyBoost|SPECKIT_.*NOVELTY|exp\\(-elapsed_hours / 12\\)|0.15|48 hours|0.95|always returned 0|noveltyBoostApplied\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "normalize|SPECKIT_SCORE_NORMALIZATION|min-max|single-result|equal-score|normalizeScores|normalizeCompositeScores|normalizeRrfScores|0-0.07|0-1" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "anchor|ANCHOR|graph node|retrieval trace" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "detectCommunities|storeCommunityAssignments|applyCommunityBoost|SPECKIT_COMMUNITY_DETECTION|community_assignments|Louvain|connected component" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "classification decay|SPECKIT_CLASSIFICATION_DECAY|Infinity|stability|constitutional|critical|important|temporary|deprecated|context axis|tier axis|FSRS" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "interference|Jaccard|0.75|SPECKIT_INTERFERENCE_SCORE|-0.08|threshold|same spec folder|neighbor" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:66:import { applyGraphSignals } from '../../graph/graph-signals';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:590:      const signaled = applyGraphSignals(results, db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:138: * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:141:  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS');
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:372:| `SPECKIT_GRAPH_SIGNALS`   | `true`  | Enable N2a momentum + N2b causal depth scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:584:Graph-based scoring signals applied during Stage 2 fusion. Gated via `SPECKIT_GRAPH_SIGNALS` (N2a + N2b) and `SPECKIT_COMMUNITY_DETECTION` (N2c).
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:52:  'SPECKIT_GRAPH_SIGNALS',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:76:  { flag: 'SPECKIT_GRAPH_SIGNALS', checker: isGraphSignalsEnabled },
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:4:// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:242:export function computeCausalDepthScores(db: Database.Database, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:326:    console.warn(`[graph-signals] computeCausalDepthScores failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:361:export function applyGraphSignals(
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:370:    const depthScores = computeCausalDepthScores(db, ids);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:391:    console.warn(`[graph-signals] applyGraphSignals failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:4://         computeCausalDepthScores, applyGraphSignals, clearGraphSignalsCache
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:13:  computeCausalDepthScores,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:14:  applyGraphSignals,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:274:  // 5. computeCausalDepthScores
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:276:  describe('computeCausalDepthScores', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:282:      const scores = computeCausalDepthScores(db, [1, 2, 3]);
 succeeded in 51ms:
Total output lines: 239

.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:426:            // 'summary-session-1770903150838-...'). Prefers shortest match to
.opencode/skill/system-spec-kit/mcp_server/README.md:462:| Cold-start N4 (S2)     | Novelty boost                  | 0.15 * exp(-elapsed/12)  | Boost recently indexed memories               |
.opencode/skill/system-spec-kit/mcp_server/README.md:568:| **debug**          | 1 hour    | "Stack trace from crash"                |
.opencode/skill/system-spec-kit/mcp_server/README.md:580:| 0.50-0.69  | LOW_MATCH    | Create new, note similarity                  |
.opencode/skill/system-spec-kit/mcp_server/README.md:581:| < 0.50     | UNIQUE       | Create new memory normally                   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:8:const SESSION_BOOST_MULTIPLIER = 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:47: * and allow the caller to skip full retrieval scatter (saves 30-50ms).
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:76: * save 30-50 ms of latency.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:405:    let combined = (centroidScore * 0.5) + (keywordScore * 0.35) + (patternScore * 0.15);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:178:const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:179:const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:210:**Trade-off**: Adds 200-500ms latency but improves precision by 15-25%.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:598:Hub caps prevent high-degree nodes from dominating: `MAX_TYPED_DEGREE=15` (default max before normalization), `MAX_TOTAL_DEGREE=50` (hard cap on raw degree). Normalized boost capped at `DEGREE_BOOST_CAP=0.15`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:629:| 2. Content Quality | 5-dimension weighted signal density | Dimensions: title (0.25), triggers (0.20), length (0.20), anchors (0.15), metadata (0.20) |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:101:      "notes": "Graph-relationship query about architectural lineage. Tests find_decision intent routing with high graph weight (0.50 per adaptive-fusion profile)."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:143:    it('T531: Novel content (sim=0.50) creates new memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:179:  //   i=1: mem:20 → rel=3 > 0 → RETURN 1/(1+1) = 1/2 = 0.500
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:182:  //   MRR@5 = 0.500
 succeeded in 50ms:
Total output lines: 213

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:853:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:68:  'supersedes',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:44:  by_supersedes: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:95:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:139:      case 'supersedes': return result.by_supersedes;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:162:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:179:      case 'supersedes': merged.by_supersedes.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:226:    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:313:        chain = forwardFlat || backwardFlat || { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:317:      chain = tree ? flattenCausalTree(tree, maxDepth, mappedDirection) : { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:378:    if (chain.by_supersedes.length > 0) relationSummary.push(`${chain.by_supersedes.length} supersedes`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:401:        supersedes: chain.by_supersedes,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:34:  budget: 0.20,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:236: *   - budget    × 0.20
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:323:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:324:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Memory ID to trace causal lineage for (required)' }, maxDepth: { type: 'number', default: 3, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', enum: ['outgoing', 'incoming', 'both'], default: 'both', description: 'Traversal direction: outgoing (what this caused), incoming (what caused this), or both' }, relations: { type: 'array', items: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'] }, description: 'Filter to specific relationship types' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:329:  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
 succeeded in 52ms:
Total output lines: 389

.opencode/skill/system-spec-kit/mcp_server/README.md:462:| Cold-start N4 (S2)     | Novelty boost                  | 0.15 * exp(-elapsed/12)  | Boost recently indexed memories               |
.opencode/skill/system-spec-kit/mcp_server/README.md:577:| >= 0.95    | DUPLICATE    | Block save, reinforce existing               |
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:151:      { id: 'a', score: 0.95, meta: 'hello' },
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:350:      [1, 0.95], [2, 0.91], [3, 0.89], [4, 0.87],
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:351:      [5, 0.15], [6, 0.12], [7, 0.10], [8, 0.09], [9, 0.08], [10, 0.07],
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:229:      expect(determineAction(0.95)).toBe('merge');
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:6:  calculateNoveltyBoost,
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:33:// N4: calculateNoveltyBoost
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:36:describe('calculateNoveltyBoost — flag disabled (default)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:41:  it('returns 0 when SPECKIT_NOVELTY_BOOST is not set', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:42:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:46:  it('returns 0 when SPECKIT_NOVELTY_BOOST is "false"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:47:    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'false');
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:48:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:53:describe('calculateNoveltyBoost — feature removed (always returns 0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:55:    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:64:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:70:    const boost = calculateNoveltyBoost(createdAt);
 succeeded in 52ms:
Total output lines: 988

.opencode/skill/system-spec-kit/mcp_server/README.md:750:| `SPECKIT_SCORE_NORMALIZATION`   | `true`  | Normalize RRF/composite scores to [0,1] |
.opencode/skill/system-spec-kit/mcp_server/README.md:964:// - normalizedPath (canonical key)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:23:  normalizedPath: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:45:  normalizedPath: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:108:    const normalizedPath = toNormalizedPath(row.file_path);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:109:    const aliasKey = toSpecAliasKey(normalizedPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:121:    if (normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:124:    if (normalizedPath.includes(SPECS_SEGMENT) && !normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:127:    bucket.variants.add(normalizedPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:146:  for (const [normalizedPath, bucket] of buckets.entries()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:172:        normalizedPath,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:216:  for (const [normalizedPath, bucket] of buckets.entries()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:228:      normalizedPath,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:233:  return candidates.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:246:      normalizedPath: sample.normalizedPath,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:249:    .sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:285:        normalizedPath: sample.normalizedPath,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:300:      summary.errors.push(`[${sample.normalizedPath}] ${message}`);
 succeeded in 52ms:
Total output lines: 1558

.opencode/skill/system-spec-kit/shared/README.md:16:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/shared/README.md:28:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/shared/README.md:32:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/shared/README.md:106:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/shared/README.md:121:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/shared/README.md:164:<!-- /ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/shared/README.md:168:<!-- ANCHOR:structure -->
.opencode/skill/system-spec-kit/shared/README.md:224:| `contracts/retrieval-trace.ts` | Typed retrieval trace and context envelope contracts |
.opencode/skill/system-spec-kit/shared/README.md:229:<!-- /ANCHOR:structure -->
.opencode/skill/system-spec-kit/shared/README.md:233:<!-- ANCHOR:features -->
.opencode/skill/system-spec-kit/shared/README.md:309:<!-- /ANCHOR:features -->
.opencode/skill/system-spec-kit/shared/README.md:313:<!-- ANCHOR:configuration -->
.opencode/skill/system-spec-kit/shared/README.md:345:<!-- /ANCHOR:configuration -->
.opencode/skill/system-spec-kit/shared/README.md:349:<!-- ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/shared/README.md:441:<!-- /ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/shared/README.md:445:<!-- ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/shared/README.md:520:<!-- /ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/shared/README.md:524:<!-- ANCHOR:related -->
 succeeded in 51ms:
Total output lines: 167

.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:373:| `SPECKIT_COMMUNITY_DETECTION`| `true`| Enable N2c BFS/Louvain community detection |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:584:Graph-based scoring signals applied during Stage 2 fusion. Gated via `SPECKIT_GRAPH_SIGNALS` (N2a + N2b) and `SPECKIT_COMMUNITY_DETECTION` (N2c).
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:610:BFS connected-component labelling assigns community IDs. When the largest component contains >50% of all nodes, escalates to Louvain modularity optimization for finer-grained communities. Community co-members are injected into Stage 2 results before graph signal scoring. Gated via `SPECKIT_COMMUNITY_DETECTION`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:145: * N2c: Community detection (BFS connected components + Louvain escalation).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:146: * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:149:  return isFeatureEnabled('SPECKIT_COMMUNITY_DETECTION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:33:// v19: degree_snapshots + community_assignments (N2 graph centrality)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:609:          CREATE TABLE IF NOT EXISTS community_assignments (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:617:        database.exec('CREATE INDEX IF NOT EXISTS idx_community_assignments_community ON community_assignments(community_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:618:        logger.info('Migration v19: Created community_assignments table (N2c)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621:          console.warn('[VectorIndex] Migration v19 warning (community_assignments):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:368:      'DELETE FROM community_assignments WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:65:import { applyCommunityBoost } from '../../graph/community-detection';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:574:      const boosted = applyCommunityBoost(results, db);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:4:// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:98:export function detectCommunitiesBFS(
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:140: * Check whether the largest connected component contains >50% of all nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:141: * If true, the graph is poorly partitioned and Louvain should be attempted.
 succeeded in 51ms:
Total output lines: 807

.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:93:        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
.opencode/skill/system-spec-kit/mcp_server/README.md:83:| **Duplicates**    | Index everything    | Prediction Error Gating (4-tier thresholds)              |
.opencode/skill/system-spec-kit/mcp_server/README.md:461:| Interference (S2)      | TM-01 interference penalty     | -0.08 * score             | Penalize competing/contradictory memories     |
.opencode/skill/system-spec-kit/mcp_server/README.md:522:| Chunking threshold | 50,000 characters                 |
.opencode/skill/system-spec-kit/mcp_server/README.md:646:│   ├── chunking/           # Anchor-aware large-file chunker (50K threshold)
.opencode/skill/system-spec-kit/mcp_server/README.md:659:│   ├── scoring/            # Composite scoring, tiers, folder scoring, interference scoring
.opencode/skill/system-spec-kit/mcp_server/README.md:704:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:734:| `SPECKIT_CAUSAL_BOOST`       | `true`  | Enable 2-hop causal-neighbor score boost                                              |
.opencode/skill/system-spec-kit/mcp_server/README.md:748:| `SPECKIT_INTERFERENCE_SCORE`    | `true`  | TM-01 interference penalty |
.opencode/skill/system-spec-kit/mcp_server/README.md:791:| `SPECKIT_EMBEDDING_EXPANSION`  | `true`  | Expands queries with semantic neighbors before search (R12) |
.opencode/skill/system-spec-kit/mcp_server/README.md:1181:| `lib/search/causal-boost.ts`             | 2-hop causal-neighbor score boost                |
.opencode/skill/system-spec-kit/mcp_server/README.md:1191:| `lib/chunking/anchor-chunker.ts`         | Large-file anchor-aware chunking (50K threshold) |
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:52: * thresholds are:
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:399: * Computes quality score, attempts auto-fix if below threshold,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:404: * @param options - threshold (default 0.6), maxRetries (default 2)
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:410:  options?: { maxRetries?: number; threshold?: number },
 succeeded in 51ms:
Total output lines: 2065

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:128:interface AutoSurfaceResult { constitutional: unknown[]; triggered: unknown[]; }
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:430:    // Also scan constitutional directories (.opencode/skill/*/constitutional/)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:437:            const constDir = path.join(skillDir, entry.name, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:445:      // Non-fatal: constitutional directory discovery failed
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:75:- Indexed scope follows current scan behavior, including memory, constitutional and spec-doc discovery defaults.
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:17:    "constitutional": 2.0,
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:13:  constitutional?: unknown[];
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:79:    const constitutionalCount = Array.isArray(autoSurfacedContext?.constitutional)
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:80:      ? autoSurfacedContext.constitutional.length
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86:    if (constitutionalCount > 0 || triggeredCount > 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:91:        `Auto-surface hook: injected ${constitutionalCount} constitutional and ${triggeredCount} triggered memories (${latency}ms)`
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:96:      constitutionalCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  constitutionalCacheCleared: boolean;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:27:  constitutional: ConstitutionalMemory[];
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:58:let constitutionalCache: ConstitutionalMemory[] | null = null;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:59:let constitutionalCacheTime = 0;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  if (constitutionalCache && (now - constitutionalCacheTime) < CONSTITUTIONAL_CACHE_TTL) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:92:    return constitutionalCache;
codex
The code picture is getting clearer: a few snippets look tightly aligned, while others appear to carry generic or stale source lists. I’m opening the key implementation files now so I can judge each feature against the actual functions, constants, flags, and integration points instead of relying on test names alone.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,460p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,620p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,380p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '430,620p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '560,640p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Graph Signals
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from 'better-sqlite3';

// ---------------------------------------------------------------------------
// 2. SESSION CACHE
// ---------------------------------------------------------------------------

/** Maximum number of entries allowed in each session-scoped cache. */
const CACHE_MAX_SIZE = 10000;

/** Session-scoped cache for momentum scores (memoryId -> momentum). */
 succeeded in 52ms:
    const { adjacency, allNodes, inDegree } = buildAdjacencyList(db);

    if (allNodes.size === 0) {
      for (const id of uncached) {
        depthCache.set(id, 0);
        results.set(id, 0);
      }
      return results;
    }

    // Find root nodes
    const roots: number[] = [];
    for (const nodeId of allNodes) {
      if ((inDegree.get(nodeId) ?? 0) === 0) {
        roots.push(nodeId);
      }
    }

    if (roots.length === 0) {
      for (const id of uncached) {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Community Detection
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from "better-sqlite3";

// ---------------------------------------------------------------------------
// 2. TYPES
// ---------------------------------------------------------------------------

/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

// ---------------------------------------------------------------------------
 succeeded in 50ms:

        // Gain of inserting node into target community
        const insertGain =
          edgesIn / m -
          ((sigmaTarget + ki) / m2) ** 2 +
          (sigmaTarget / m2) ** 2;

        const totalGain = removeGain + insertGain;

        if (totalGain > bestGain) {
          bestGain = totalGain;
          bestCommunity = targetCommunity;
        }
      }

      if (bestCommunity !== currentCommunity && bestGain > 1e-10) {
        // Move node
        community.set(node, bestCommunity);

        // Update sigma totals
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Causal Boost
// ---------------------------------------------------------------
// Graph-traversal score boosting via causal edge relationships.
// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
// for results related to top seed results via weighted CTE.
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

import type Database from 'better-sqlite3';

/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
const MAX_HOPS = 2;
/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
const MAX_BOOST_PER_HOP = 0.05;
/** Combined causal + session boost ceiling to prevent runaway amplification. */
const MAX_COMBINED_BOOST = 0.20;
/** Top fraction of result set used as graph walk seed nodes. */
const SEED_FRACTION = 0.25;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Temporal Contiguity
// ---------------------------------------------------------------
// Boost search results when memories are temporally adjacent,
// query temporal neighbors, and build spec-folder timelines.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
export const MAX_WINDOW = 86400;      // 24 hours in seconds

const BOOST_FACTOR = 0.15;
// AI-WHY: Cap the cumulative contiguity boost per result so that a cluster of
// many temporally-close memories cannot inflate a score unboundedly.
const MAX_TOTAL_BOOST = 0.5;
 succeeded in 50ms:
 * Applied to the FSRS stability parameter before computing retrievability.
 * Infinity = no decay (retrievability always 1.0).
 * 2.0 = stability doubled → slower decay.
 * 1.0 = standard FSRS schedule.
 */
const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
  decision: Infinity,    // no decay — decisions are permanent
  research: 2.0,         // 2x stability — research context decays slower
  implementation: 1.0,   // standard decay
  discovery: 1.0,        // standard decay
  general: 1.0,          // standard decay
};

/**
 * TM-03: Importance-tier stability multipliers.
 * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
 * Used exclusively by getClassificationDecayMultiplier() when
 * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
 * constitutional/critical: Infinity = never decays.
 * important: 1.5x stability → slower decay.
 succeeded in 50ms:
      if (hasDocTypeMatch) {
        score += PATTERN_ALIGNMENT_BONUSES.type_match;
      }
    }
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * HIGH-003 FIX: Wrapper around unified compute_recency_score from folder-scoring.
 *
 * @param timestamp - ISO timestamp of last update
 * @param tier - Importance tier (defaults to 'normal')
 * @returns Recency score 0-1
 */
export function calculateRecencyScore(timestamp: string | undefined, tier: string = 'normal'): number {
  return computeRecencyScore(timestamp || '', tier, DECAY_RATE);
}

 succeeded in 50ms:
        database.exec("ALTER TABLE causal_edges ADD COLUMN created_by TEXT DEFAULT 'manual'");
        logger.info('Migration v18: Added created_by column to causal_edges');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (created_by):', get_error_message(e));
        }
      }
      try {
        database.exec('ALTER TABLE causal_edges ADD COLUMN last_accessed TEXT');
        logger.info('Migration v18: Added last_accessed column to causal_edges');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v18 warning (last_accessed):', get_error_message(e));
        }
      }

      try {
        database.exec("ALTER TABLE memory_index ADD COLUMN encoding_intent TEXT DEFAULT 'document'");
        database.exec('CREATE INDEX IF NOT EXISTS idx_encoding_intent ON memory_index(encoding_intent)');
        logger.info('Migration v18: Added encoding_intent column to memory_index (R16)');
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Interference Scoring
// ---------------------------------------------------------------
// Sprint 2, Task T005
// ---------------------------------------------------------------
// Computes interference scores for memories — a measure of how many
// similar memories exist in the same spec_folder. High interference
// means the memory is one of many similar items, suggesting redundancy.
// Applied as a penalty in composite scoring to demote redundant results.
// ---------------------------------------------------------------

import Database from 'better-sqlite3';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

interface InterferenceResult {
  memoryId: number;
  interferenceScore: number; // count of similar memories in same folder
exec
/bin/zsh -lc "sed -n '540,710p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg 'rollout-policy|search-flags|stage2-fusion|score-normalization|normalization|anchor-chunker|anchor-metadata|pipeline/types|access-tracker|scoring-observability|folder-scoring|importance-tiers|attention-decay|working-memory|memory-bulk-delete|causal-edges|memory-triggers|rollout-policy'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/shared/normalization.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
 succeeded in 52ms:
      if (topIds.length > 0) {
        const spreadResults: SpreadResult[] = spreadActivation(topIds);
        if (spreadResults.length > 0) {
          const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
          results = results.map((row) => {
            const boost = spreadMap.get(row.id);
            if (boost !== undefined) {
              const baseScore = resolveBaseScore(row);
              return {
                ...row,
                score: baseScore + boost * CO_ACTIVATION_CONFIG.boostFactor,
              };
            }
            return row;
          });
          // AI-GUARD: Re-sort after co-activation boost to ensure boosted results
          // are promoted to their correct position in the ranking
          results.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
          (metadata as Record<string, unknown>).coActivationApplied = true;
        }
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Score Normalization
// ---------------------------------------------------------------
// Score Normalization & K-Value Analysis

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the problematic @spec-kit/shared dependency chain
// so composite-scoring.ts can be imported without the shared workspace being linked
vi.mock('../lib/scoring/folder-scoring', () => ({
  computeRecencyScore: (_ts: string, _tier: string, _rate: number) => 0.5,
  DECAY_RATE: 0.01,
}));

vi.mock('../lib/storage/access-tracker', () => ({
  calculatePopularityScore: () => 0.5,
}));

vi.mock('../lib/scoring/importance-tiers', () => ({
  getTierConfig: (tier: string) => ({
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Search Flags
// ---------------------------------------------------------------
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Cold Start (N4)
// ---------------------------------------------------------------
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateNoveltyBoost,
  calculateFiveFactorScore,
  calculateCompositeScore,
} from '../lib/scoring/composite-scoring';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal ScoringInput row with a given created_at timestamp. */
function makeRow(createdAtMs: number, overrides: Record<string, unknown> = {}) {
  return {
    created_at: new Date(createdAtMs).toISOString(),
    importance_tier: 'normal',
    importance_weight: 0.5,
 exited 1 in 51ms:
sed: .opencode/skill/system-spec-kit/mcp_server/shared/normalization.ts: No such file or directory
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Anchor Metadata
// ---------------------------------------------------------------
// Sprint 5 Phase B — S2 template anchor optimization
//
// PURPOSE: Parse ANCHOR tags from memory content and attach the
// resulting metadata to search pipeline rows. This is a PURE
// ANNOTATION step — no scores are modified.
//
// ANCHOR FORMAT:
//   <!-- ANCHOR:id --> ... content ... <!-- /ANCHOR:id -->
//
// ANCHOR ID CONVENTION (for type extraction):
//   Structured IDs follow the pattern: TYPE-keywords-NNN
//   e.g.  DECISION-pipeline-003  → type = "DECISION"
//         state                  → type = "state"
//         summary                → type = "summary"
//
// Integration point: called at the end of Stage 2 fusion, after
// all scoring signals have been applied (signals 1-7). Adding
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
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Anchor Chunker
// ---------------------------------------------------------------
// Splits large memory files into chunks using ANCHOR tags as
// natural boundaries. Falls back to structure-aware markdown
// splitting when anchors are absent.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Describes the AnchorChunk shape.
 */
export interface AnchorChunk {
  /** The text content of this chunk */
  content: string;
  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
  anchorIds: string[];
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Retrieval Trace
// ---------------------------------------------------------------
// Typed contracts for the retrieval pipeline that enforce end-to-end
// type safety with trace stages and degraded-mode handling.
// C136-08: Foundation for observability and pipeline instrumentation.

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/** Pipeline stages in retrieval order */
export type RetrievalStage =
  | 'candidate'
  | 'filter'
  | 'fusion'
  | 'rerank'
  | 'fallback'
  | 'final-rank';

🌐 Searching the web...
🌐 Searched the web
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/shared | rg 'normalization|folder-scoring|types|retrieval-trace'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '660,760p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "normalizeCompositeScores|isCompositeNormalizationEnabled" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "clearRelatedCache|co-activation|cache" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers | head -n 80' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 50ms:
.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts
.opencode/skill/system-spec-kit/shared/types.ts
.opencode/skill/system-spec-kit/shared/normalization.ts
.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts
 succeeded in 50ms:
  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

/**
 * Legacy batch scoring for backward compatibility.
 *
 * Each result is augmented with:
 * - `composite_score`: Six-factor composite (0-1) combining similarity,
 *   importance, recency, popularity, tierBoost, and retrievability scores.
 * - `_scoring`: Breakdown of individual factor values for diagnostics.
 *
 * Results are sorted descending by composite_score.
 *
 * @param results - Array of scoring input rows
 * @param options - Optional scoring configuration
 * @returns Scored and sorted results with composite_score and _scoring breakdown
 */
export function applyCompositeScoring(
  results: ScoringInput[],
  options: ScoringOptions = {}
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Causal Edges
// ---------------------------------------------------------------
// Causal relationship graph for memory lineage
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { clearDegreeCache } from '../search/graph-search-fn';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Bulk Delete
// ---------------------------------------------------------------
// Tier-based bulk deletion of memories with safety gates.
// Eliminates the need for direct DB scripts when cleaning up
// deprecated/temporary memories at scale.
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

 succeeded in 50ms:
778:export function isCompositeNormalizationEnabled(): boolean {
793:export function normalizeCompositeScores(scores: number[]): number[] {
795:  if (!isCompositeNormalizationEnabled()) return scores;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Rollout Policy
// ---------------------------------------------------------------

const DEFAULT_ROLLOUT_PERCENT = 100;

function getRolloutPercent(): number {
  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  return Math.max(0, Math.min(100, parsed));
}

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Causal Graph
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   0. DEPENDENCIES
--------------------------------------------------------------- */

// Lib modules
import * as vectorIndex from '../lib/search/vector-index';
import * as causalEdges from '../lib/storage/causal-edges';
import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges';

// Core utilities
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';
import { getRecoveryHint } from '../lib/errors';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPErrorResponse, createMCPEmptyResponse } from '../lib/response/envelope';
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Working Memory
// ---------------------------------------------------------------
// AI-WHY: Session-based attention management
// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
// only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
// the working_memory table, NOT memory_index. This is intentionally
// independent of FSRS long-term decay — different time scale, different
// domain (ephemeral session attention vs persistent memory scoring).
// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
// ensures stable resting state and explicit low-score eviction.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isFeatureEnabled } from './rollout-policy';

/* --- 1. CONFIGURATION --- */

interface WorkingMemoryConfigType {
  enabled: boolean;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:83:/** Result returned by post-mutation hooks (cache invalidation, etc.). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:208:  // Invalidate caches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:22:import * as workingMemory from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:23:import * as attentionDecay from '../lib/cache/cognitive/attention-decay';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:24:import * as tierClassifier from '../lib/cache/cognitive/tier-classifier';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:25:import type { TierInput, StateStats } from '../lib/cache/cognitive/tier-classifier';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:26:import * as coActivation from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:11:import * as workingMemory from '../cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:10:import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:11:import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:9:import { lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:35:      // Check persistent embedding cache before calling provider
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:37:      const cachedBuf = lookupEmbedding(database, parsed.contentHash, modelId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:38:      if (cachedBuf) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:40:        embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:42:        console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:50:          // Store in persistent cache for future re-index
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:53:          console.error(`[memory-save] Embedding cache MISS+STORE for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:8:import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:292:    hints.push('Duplicate content matched an existing indexed memory, so caches were left unchanged');
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'ls -l .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'readlink .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts || true' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'readlink .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts || true' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/tier-classifier.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/archival-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/pressure-monitor.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/attention-decay.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/prediction-error-gate.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/temporal-contiguity.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/fsrs-scheduler.ts
 succeeded in 50ms:

 succeeded in 52ms:
lrwxr-xr-x@ 1 michelkerkmeester  staff  12 Feb 16 19:41 .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive -> ../cognitive
 succeeded in 51ms:

codex
A couple of patterns are emerging: some entries point at the real code paths cleanly, and some seem to inherit broad “scoring bundle” path lists that don’t actually implement the named feature. I’m checking the shared modules now because normalization in particular appears to live partly outside the files the snippet cites.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/normalization.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,420p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Folder Scoring
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/scoring/folder-scoring.js)

import type {
  ArchivePattern,
  FolderScore,
  FolderScoreOptions,
  Memory,
  ScoreWeights,
  TierWeights,
} from '../types';

/**
 * Loose input type for folder-scoring functions.
 * Accepts any partial Memory (camelCase) plus arbitrary extra fields
 * (snake_case DB columns, search-enriched properties, etc.).
 */
export type FolderMemoryInput = Partial<Memory> & Record<string, unknown>;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Normalization
// ---------------------------------------------------------------
// Converts between snake_case (database) and camelCase (application).
// This is the SINGLE SOURCE OF TRUTH for DB ↔ App type conversions.
//
// The raw DB schema is defined in:
//   mcp_server/lib/search/vector-index-impl.js (CREATE TABLE memory_index)
//
// Phase 6A Foundation — consumers should use MemoryDbRow (snake_case DB rows)
// or Memory (camelCase app layer) from this module.
// Phase 6B removed the deprecated MemoryRow/MemoryRecord interfaces.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. DATABASE ROW TYPE (snake_case — exactly as SQLite returns)
// ---------------------------------------------------------------

/**
 * Raw database row from the `memory_index` table.
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------
// Single source of truth for cross-workspace types.
// Used across shared/, mcp_server/, and scripts/.
//
// DB normalization types (MemoryDbRow, Memory, conversion fns)
// live in ./normalization.ts — import from there for DB ↔ App
// conversions.
// ---------------------------------------------------------------

// Import normalization types for local use (Memory used in IVectorStore.get)
// and re-export so consumers can import from here
import type { MemoryDbRow, Memory } from './normalization';
export type { MemoryDbRow, Memory };
export { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from './normalization';

// ---------------------------------------------------------------
// 1. EMBEDDING TYPES
// ---------------------------------------------------------------
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: K-Value Sensitivity Analysis (T004a)
// ---------------------------------------------------------------
// Measures the impact of different RRF K-values on ranking stability.
// This is a measurement/analysis tool, not production code.
// ---------------------------------------------------------------

import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Result metrics for a single K-value configuration. */
interface KValueMetrics {
  /** Mean Reciprocal Rank at cutoff 5, estimated against baseline ranking. */
  mrr5: number;
  /** Kendall tau rank correlation with the baseline (K=60) ranking. */
  kendallTau: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: GRAPH SIGNALS — Momentum + Causal Depth (N2a + N2b)
// Covers: snapshotDegrees, computeMomentum,
//         computeCausalDepthScores, applyGraphSignals, clearGraphSignalsCache
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  snapshotDegrees,
  computeMomentum,
  computeMomentumScores,
  computeCausalDepthScores,
  applyGraphSignals,
  clearGraphSignalsCache,
  __testables,
} from '../lib/graph/graph-signals.js';

// ---------------------------------------------------------------------------
// TEST HELPERS
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Scoring Observability (T010)
// ---------------------------------------------------------------
// AI-WHY: Lightweight observability logging for N4 cold-start boost and
// TM-01 interference scoring values at query time.
// Sampled at 5% of queries to avoid performance overhead.
// All logging is best-effort (fail-safe, never throws).
// Feature flags:
//   SPECKIT_NOVELTY_BOOST     — N4 cold-start boost
//   SPECKIT_INTERFERENCE_SCORE — TM-01 interference penalty
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

// ---------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------

/** 5% sampling rate — logs ~1 in 20 scoring calls */
export const SAMPLING_RATE = 0.05;
 succeeded in 51ms:
      const bonus = convergenceBonus * (uniqueSourceCount - 1);
      result.convergenceBonus = bonus;
      result.rrfScore += bonus;
    }
  }

  const results = Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);

  // T004: Normalize RRF scores to [0,1] when enabled
  if (isScoreNormalizationEnabled()) {
    normalizeRrfScores(results);
  }

  return results;
}

/**
 * Advanced score fusion with original term match counting.
 * @param results - Pre-fused results to augment with term-match bonuses.
 succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: COMMUNITY DETECTION — BFS + Louvain
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  detectCommunitiesBFS,
  shouldEscalateToLouvain,
  detectCommunitiesLouvain,
  detectCommunities,
  storeCommunityAssignments,
  getCommunityMembers,
  applyCommunityBoost,
  resetCommunityDetectionState,
  __testables,
} from '../lib/graph/community-detection.js';

// ---------------------------------------------------------------------------
// Test DB helper
 succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: TEMPORAL CONTIGUITY
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as mod from '../lib/cache/cognitive/temporal-contiguity';
import BetterSqlite3 from 'better-sqlite3';

describe('Temporal Contiguity Tests (T502)', () => {
  let testDb!: InstanceType<typeof BetterSqlite3>;
  let tmpDbPath: string = '';

  function seedMemories(memories: Array<{ title: string; spec_folder: string; created_at: string; importance_tier?: string }>) {
    const stmt = testDb.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
      VALUES (?, ?, ?, ?, ?)
 succeeded in 52ms:
// @ts-nocheck
// ---------------------------------------------------------------
// MODULE: Test — Interference Scoring
// ---------------------------------------------------------------
// Tests for interference score computation and penalty application.
// Covers: zero interference, penalty reduces score, score floor at 0,
// env var gating, batch computation, text similarity heuristic,
// and integration with composite scoring.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  computeInterferenceScore,
  computeInterferenceScoresBatch,
  computeTextSimilarity,
  applyInterferencePenalty,
  INTERFERENCE_SIMILARITY_THRESHOLD,
  INTERFERENCE_PENALTY_COEFFICIENT,
} from '../lib/scoring/interference-scoring';
import {
🌐 Searching the web...
🌐 Searched the web
exec
/bin/zsh -lc 'rg -n "cleanupOrphanedEdges|orphaned|deleteEdgesForMemory|clearDegreeCache|weight_history" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "normalizeCompositeScores|isCompositeNormalizationEnabled|SPECKIT_SCORE_NORMALIZATION" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applyClassificationDecay|getClassificationDecayMultiplier|CONTEXT_TYPE_STABILITY_MULTIPLIER|IMPORTANCE_TIER_STABILITY_MULTIPLIER" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"maxDepth|clamp.*10|Math.min\\(10|maxDepth.*1|handleMemoryDriftWhy\" .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '240,380p' .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '760,840p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
8:import { clearDegreeCache } from '../search/graph-search-fn';
100:    clearDegreeCache();
171:      // AI-WHY: Check if edge exists (for weight_history logging on conflict update).
173:      // to write a weight_history row after the upsert. The subsequent INSERT
396:      // T001d: Capture old strength for weight_history logging
413:      // T001d: Log weight change to weight_history
454:function deleteEdgesForMemory(memoryId: string): number {
468:    console.warn(`[causal-edges] deleteEdgesForMemory error: ${msg}`);
525:function cleanupOrphanedEdges(): { deleted: number } {
528:    const orphaned = findOrphanedEdges();
532:      for (const edge of orphaned) {
540:    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
610:      INSERT INTO weight_history (edge_id, old_strength, new_strength, changed_by, reason)
623:      SELECT * FROM weight_history WHERE edge_id = ? ORDER BY changed_at DESC LIMIT ?
647:        SELECT old_strength FROM weight_history
655:          SELECT old_strength FROM weight_history
756:  deleteEdgesForMemory,
759:  cleanupOrphanedEdges,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:413: * @returns True unless SPECKIT_SCORE_NORMALIZATION is explicitly 'false'.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:416:  return process.env.SPECKIT_SCORE_NORMALIZATION !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:774: * Default: TRUE (graduated Sprint 4). Set SPECKIT_SCORE_NORMALIZATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:778:export function isCompositeNormalizationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:779:  return process.env.SPECKIT_SCORE_NORMALIZATION?.toLowerCase() !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:784: * Gated behind SPECKIT_SCORE_NORMALIZATION env var — returns unchanged when disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:793:export function normalizeCompositeScores(scores: number[]): number[] {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:795:  if (!isCompositeNormalizationEnabled()) return scores;
 succeeded in 51ms:
54:  maxDepth?: number;
88:  maxDepth: number,
122:      // Check if we hit max depth (any child at maxDepth-1 with children means we capped)
123:      if (child.depth >= maxDepth - 1 && child.children.length === 0) {
126:        if (child.depth >= maxDepth - 1) {
242:async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
245:    maxDepth: rawMaxDepth = 3,
250:  // AI-WHY: Fix #25 (017-refinement-phase-6) — Clamp maxDepth to [1, 10] server-side
251:  const maxDepth = Math.min(Math.max(1, Math.floor(rawMaxDepth)), 10);
306:      const forwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
307:      const backwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
308:      const forwardFlat = forwardTree ? flattenCausalTree(forwardTree, maxDepth, 'forward') : null;
309:      const backwardFlat = backwardTree ? flattenCausalTree(backwardTree, maxDepth, 'backward') : null;
316:      const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, mappedDirection);
317:      chain = tree ? flattenCausalTree(tree, maxDepth, mappedDirection) : { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
387:      hints.push(`Max depth (${maxDepth}) reached - more relationships may exist beyond this depth`);
407:        maxDepthReached: chain.max_depth_reached,
409:        traversalOptions: { direction: mappedDirection, maxDepth }
717:  handleMemoryDriftWhy,
724:const handle_memory_drift_why = handleMemoryDriftWhy;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Attention Decay
// ---------------------------------------------------------------
// DECAY STRATEGY (ADR-004): This module is the FACADE for all long-term
// memory decay. It exposes FSRS-based decay as the canonical path
// (via composite-scoring.ts and fsrs-scheduler.ts).
// Legacy exponential functions (calculateDecayedScore, applyDecay) were
// removed in REC-017 Phase 4 — all callers migrated to applyFsrsDecay
// or calculateCompositeAttention.
//
// Decay ownership map:
//   Long-term memory scoring → FSRS v4 (fsrs-scheduler.ts)
//   Composite attention      → 5-factor model (composite-scoring.ts) using FSRS temporal
//   Session/working memory   → Linear decay (working-memory.ts) — separate domain
//   Search-time ranking      → FSRS-preferred SQL (vector-index-impl.js)
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:26:  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:164:function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:278:    if (fsrsScheduler?.applyClassificationDecay) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:279:      adjustedStability = fsrsScheduler.applyClassificationDecay(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:281:      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:264:| `fsrs-scheduler.ts`        | FSRS v4 + TM-03 classification decay | `calculateRetrievability`, `updateStability`, `processReview`, `applyClassificationDecay` |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:236: * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:239: *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:265:const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:276: * Used exclusively by getClassificationDecayMultiplier() when
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:284:const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:309:function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:310:  const contextMult = CONTEXT_TYPE_STABILITY_MULTIPLIER[contextType] ?? 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:311:  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:333:function applyClassificationDecay(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:344:  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:370:  CONTEXT_TYPE_STABILITY_MULTIPLIER,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:371:  IMPORTANCE_TIER_STABILITY_MULTIPLIER,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:372:  getClassificationDecayMultiplier,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:373:  applyClassificationDecay,
 succeeded in 51ms:

/** Handle memory_drift_why tool - traces causal relationships for a given memory */
async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
  const {
    memoryId,
    maxDepth: rawMaxDepth = 3,
    direction = 'both',
    relations = null,
    includeMemoryDetails = true
  } = args;
  // AI-WHY: Fix #25 (017-refinement-phase-6) — Clamp maxDepth to [1, 10] server-side
  const maxDepth = Math.min(Math.max(1, Math.floor(rawMaxDepth)), 10);

  const startTime = Date.now();

  if (memoryId === undefined || memoryId === null) {
    return createMCPErrorResponse({
      tool: 'memory_drift_why',
      error: 'memoryId is required',
      code: 'E031',
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Co Activation
// ---------------------------------------------------------------
// Spreading activation for related memory retrieval

import type Database from 'better-sqlite3';

/* --- 1. CONFIGURATION --- */

/**
 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
 *
 * Intentional deviation from Sprint 1 spec (which listed 0.2): empirical tuning raised
 * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
 * keeps hub-node inflation in check, so a higher raw factor remains safe. Tests are
 * written against 0.25 and serve as the authoritative contract going forward.
 */
const DEFAULT_COACTIVATION_STRENGTH = 0.25;

const CO_ACTIVATION_CONFIG = {
 succeeded in 51ms:
      recency: { value: recency, weight: weights.recency, contribution: recency * weights.recency },
      popularity: { value: popularity, weight: weights.popularity, contribution: popularity * weights.popularity },
      tierBoost: { value: tierBoost, weight: weights.tierBoost, contribution: tierBoost * weights.tierBoost },
      retrievability: { value: retrievability, weight: weights.retrievability, contribution: retrievability * weights.retrievability },
    },
    total: calculateCompositeScore(row, options),
    model: '6-factor-legacy',
  };
}

// --- 7. SCORE NORMALIZATION ---

/**
 * Check if composite score normalization is enabled.
 * Default: TRUE (graduated Sprint 4). Set SPECKIT_SCORE_NORMALIZATION=false to disable.
 *
 * @returns True if normalization is enabled (default: ON)
 */
export function isCompositeNormalizationEnabled(): boolean {
  return process.env.SPECKIT_SCORE_NORMALIZATION?.toLowerCase() !== 'false';
 succeeded in 51ms:
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

 succeeded in 51ms:
  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
      WHERE source_id = ?
      ORDER BY strength DESC
      LIMIT ?
    `) as Database.Statement).all(sourceId, limit) as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
    return [];
  }
}

function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
exec
/bin/zsh -lc "sed -n '520,580p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    return [];
  }
}

// AI-WHY: Fix #28 (017-refinement-phase-6) — Automated orphan edge cleanup
function cleanupOrphanedEdges(): { deleted: number } {
  if (!db) return { deleted: 0 };
  try {
    const orphaned = findOrphanedEdges();
    let deleted = 0;
    // AI: Fix F20 — wrap multi-step mutation in transaction for atomicity.
    const runInTransaction = db.transaction(() => {
      for (const edge of orphaned) {
        if (deleteEdge(edge.id)) deleted++;
      }
    });
    runInTransaction();
    return { deleted };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path');const root=path.resolve('.opencode/skill/system-spec-kit');const features=['.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md','.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detection.md','.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md','.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md','.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md','.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md','.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md','.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md','.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md','.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md'];for(const featurePath of features){const text=fs.readFileSync(featurePath,'utf8');const rels=[...text.matchAll(/\\|\\s*"'`([''^`]+)`'"\\s*\\|/g)].map(m=>m[1]).filter(Boolean);const unique=[...new Set(rels)];console.log(path.basename(featurePath));for(const rel of unique){const abs=path.join(root,rel);console.log((fs.existsSync(abs)?'OK ':'MISSING ')+rel)}console.log('')}}\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\"); const root=path.resolve(\".opencode/skill/system-spec-kit\"); const features=[\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md\",\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detection.md\",\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md\",\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md\",\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md\",\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md\",\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md\",\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md\",\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md\",\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md\"]; for (const featurePath of features) { const text=fs.readFileSync(featurePath,\"utf8\"); const rels=[...text.matchAll(/\\|\\s*"'`([''^`]+)`'"\\s*\\|/g)].map(m=>m[1]).filter(Boolean); const unique=[...new Set(rels)]; console.log(path.basename(featurePath)); for (const rel of unique) { const abs=path.join(root, rel); console.log((fs.existsSync(abs)?\"OK \":\"MISSING \")+rel); } console.log(\"\"); }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
06-causal-depth-signal.md
OK mcp_server/lib/cognitive/rollout-policy.ts
OK mcp_server/lib/graph/graph-signals.ts
OK mcp_server/lib/search/causal-boost.ts
OK mcp_server/tests/causal-boost.vitest.ts
OK mcp_server/tests/feature-eval-graph-signals.vitest.ts
OK mcp_server/tests/graph-signals.vitest.ts
OK mcp_server/tests/rollout-policy.vitest.ts

07-community-detection.md
OK mcp_server/lib/graph/community-detection.ts
OK mcp_server/tests/community-detection.vitest.ts

08-graph-and-cognitive-memory-fixes.md
OK mcp_server/lib/cognitive/attention-decay.ts
OK mcp_server/lib/cognitive/fsrs-scheduler.ts
OK mcp_server/lib/cognitive/rollout-policy.ts
OK mcp_server/lib/cognitive/working-memory.ts
OK mcp_server/lib/graph/graph-signals.ts
OK mcp_server/lib/scoring/composite-scoring.ts
exec
/bin/zsh -lc 'rg -n "applyCausalBoost|causal boost|causalBoost" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
53:import * as causalBoost from '../causal-boost';
487:    causalBoostApplied: false,
520:      const { results: boosted, metadata: cbMeta } = causalBoost.applyCausalBoost(results);
522:      metadata.causalBoostApplied = cbMeta.applied;
525:      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
712:        causalBoostApplied: metadata.causalBoostApplied,
exec
/bin/zsh -lc "sed -n '500,550p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
  // when the full hybrid result set is available for ordering.
  if (isHybrid && config.enableSessionBoost && config.sessionId) {
    try {
      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
        results,
        config.sessionId
      );
      results = boosted as PipelineRow[];
      metadata.sessionBoostApplied = sbMeta.applied;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] session boost failed: ${message}`);
    }
  }

  // -- 2. Causal boost --
  // Only for hybrid search type — causal graph traversal is seeded from the
  // top results after session boost has re-ordered them.
  if (isHybrid && config.enableCausalBoost) {
    try {
exec
/bin/zsh -lc "rg -n \"DECAY_FLOOR|mention|Math.min\\(1\\.0|Math.max\\(DECAY_FLOOR|turnDecayFactor|attentionScore|clamp\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:33:const DECAY_FLOOR = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:36:// AI-WHY: Cap mention_count to prevent unbounded integer growth in long-lived
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:37:// sessions. The mention boost formula (mention_count * MENTION_BOOST_FACTOR)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:53:    mention_count INTEGER NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:80:  mention_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:90:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:118:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:145:    if (!wmColumns.includes('mention_count')) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:146:      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:274:        wm.attention_score AS attentionScore
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:292:function calculateTier(attentionScore: number): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:293:  if (attentionScore >= 0.8) return 'focused';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:294:  if (attentionScore >= 0.5) return 'active';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:295:  if (attentionScore >= 0.2) return 'peripheral';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:310:  const clampedScore = Math.max(0, Math.min(1, score));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:            mention_count = MIN(mention_count + 1, ${MAX_MENTION_COUNT}),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:328:      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:334:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:336:      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
exec
/bin/zsh -lc "sed -n '300,345p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
            coActivatedMemories.push(...boosted);
          }
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
        }
      }
    }

    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
    const fullRecords = fetchMemoryRecords(matchedIds);

    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));

    const turnDecayFactor = turnNumber > 1
      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
      : 1.0;

    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
exec
/bin/zsh -lc "rg -n \"normalizeCompositeScores\\(|normalizeRrfScores\\(|isCompositeNormalizationEnabled\\(|isScoreNormalizationEnabled\\(\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:230:  if (isScoreNormalizationEnabled()) {
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:231:    normalizeRrfScores(results);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:393:  if (isScoreNormalizationEnabled()) {
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:394:    normalizeRrfScores(results);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:415:function isScoreNormalizationEnabled(): boolean {
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:429:function normalizeRrfScores(results: FusionResult[]): void {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:91:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:107:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:118:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:127:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:166:      expect(isScoreNormalizationEnabled()).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:172:      expect(isScoreNormalizationEnabled()).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:229:    const normalized = normalizeCompositeScores(scores);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:246:    const result = normalizeCompositeScores(scores);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:253:    expect(normalizeCompositeScores([])).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:260:    const normalized = normalizeCompositeScores(scores);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:270:    const normalized = normalizeCompositeScores([0.42]);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:354:      const normalized = normalizeCompositeScores([scoreA, scoreB, scoreC]);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:575:      const emptyNorm = normalizeCompositeScores([]);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:580:      normalizeRrfScores(emptyFusionResults);
exec
/bin/zsh -lc "rg -n \"normalizeCompositeScores\\(\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers | rg -v '/tests/'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:793:export function normalizeCompositeScores(scores: number[]): number[] {
exec
/bin/zsh -lc "sed -n '220,320p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

      let count = 0;
      for (const mem of allInFolder) {
        if (mem.id === row.id) continue;
        const siblingText = textMap.get(mem.id) || '';
        if (!siblingText) continue;

        const similarity = computeTextSimilarity(targetText, siblingText);
        if (similarity >= threshold) {
          count++;
        }
      }

      results.set(row.id, count);
    }
  }

  // Set 0 for any memoryIds not found in the database
  for (const id of memoryIds) {
    if (!results.has(id)) {
exec
/bin/zsh -lc 'test -e .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts && echo yes || echo no' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
yes
exec
/bin/zsh -lc 'rg -n "anchorMetadata|anchor_id|chunkLargeFile|extractAnchorMetadata|enrichResultsWithAnchorMetadata|anchorIds|anchorTypes" .opencode/skill/system-spec-kit/mcp_server | head -n 120' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:92:  anchorIds: string[];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:93:  anchorTypes: string[];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:180:function extractAnchorDetails(rawResult: RawSearchResult): { anchorIds: string[]; anchorTypes: string[] } {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:181:  const metadata = Array.isArray(rawResult.anchorMetadata)
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:182:    ? rawResult.anchorMetadata as Array<Record<string, unknown>>
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:184:  const anchorIds = metadata
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:187:  const anchorTypes = metadata
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:190:  return { anchorIds, anchorTypes };
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:379:        anchorIds: anchorsInfo.anchorIds,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:380:        anchorTypes: anchorsInfo.anchorTypes,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:33:  anchor_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:294:    // AI-WHY: Support both anchor_id (snake_case) and anchorId (camelCase) — callers may pass either form (P4-16).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:295:    hashInput = `${memory.id}:${memory.anchor_id || memory.anchorId || ''}:${memory.file_path || ''}`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:      // AI-WHY: Prefer anchor_id (canonical), fall back to anchorId for legacy callers (P4-16)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:299:      anchor: memory.anchor_id || memory.anchorId,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:18:import { needsChunking, chunkLargeFile } from '../lib/chunking/anchor-chunker';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:129:  const chunkResult = chunkLargeFile(parsed.content);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:17:    anchor_id: 'auth-flow',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:119:    expect(row.anchor_id).toBe('auth-flow');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:162:    row.anchor_id = null;
codex
I’ve finished the code pass. The main pattern is that every listed path exists, but several snippets have stale “Current Reality” text or generic source lists that miss the real integration files where the feature is actually turned on, wired in, or persisted.
Plan update
  ✓ Read the 10 requested feature snippet files and extract each Current Reality summary plus Source Files list
  ✓ Validate that every listed source path exists under the mcp_server tree
  ✓ Inspect the relevant source code to judge description accuracy and identify missing important files
  ✓ Produce the per-feature verification report in the requested format
codex
---
FEATURE: 06-causal-depth-signal.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core depth scoring exists in `graph-signals.ts`, but the code normalizes by maximum root-reachable depth, not true graph diameter. The snippet also omits the actual Stage 2 integration and flag gate.
---
FEATURE: 07-community-detection.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: BFS/Louvain behavior and Stage 2 injection are present, but debounce is implemented in `detectCommunities()` rather than `storeCommunityAssignments()`. The snippet also misses the schema file that creates `community_assignments`.
---
FEATURE: 08-graph-and-cognitive-memory-fixes.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/storage/causal-edges.ts, mcp_server/handlers/causal-graph.ts, mcp_server/lib/graph/community-detection.ts, mcp_server/handlers/memory-triggers.ts, mcp_server/handlers/mutation-hooks.ts, mcp_server/handlers/memory-bulk-delete.ts, mcp_server/lib/cognitive/co-activation.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The listed fixes do exist, but the snippet misses most of the real implementation files and includes many generic scoring files instead. It is also slightly stale: community debounce now fingerprints `count:maxId:checksum`, and co-activation cache clearing happens via `mutation-hooks.ts`.
---
FEATURE: 09-anchor-tags-as-graph-nodes.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: I found anchor chunking, anchor metadata extraction, and anchor-aware result shaping, but no code that promotes anchors into graph nodes. The deferred status is accurate.
---
FEATURE: 10-causal-neighbor-boost-and-injection.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The 2-hop weighted CTE, 25%/5 seed rule, and 0.20 causal+session ceiling all match. The relation description is stale: code weights `supersedes`, `contradicts`, `caused`, `enabled`, `derived_from`, and `supports`, not `leads_to` or `relates_to`.
---
FEATURE: 11-temporal-contiguity-layer.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The module exists, but the exported APIs are `getTemporalNeighbors()` and `buildTimeline()`, not `queryTemporalNeighbors()` or `buildSpecFolderTimeline()`. Boosting is also proximity-weighted by time distance, not a flat `0.15` per neighbor.
---
FEATURE: 01-score-normalization.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: shared/algorithms/rrf-fusion.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: RRF normalization is live in `shared/algorithms/rrf-fusion.ts`, but composite normalization is only exposed as a helper in `composite-scoring.ts` and is not wired into the production search path. Several listed files are generic scoring dependencies, and `shared/normalization.ts` is unrelated DB row normalization.
---
FEATURE: 02-cold-start-novelty-boost.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: Current runtime behavior is a no-op: `calculateNoveltyBoost()` always returns `0`, and telemetry is hardcoded to `noveltyBoostApplied: false` / `0`. The historical formula and cap remain only as deprecated constants/tests, so the first half of the description overstates what is active today.
---
FEATURE: 03-interference-scoring.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/scoring/composite-scoring.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The threshold, Jaccard-like token overlap, same-folder scope, and `-0.08 * interferenceScore` penalty all match. The source list should also include `composite-scoring.ts`, where the penalty is actually applied during scoring.
---
FEATURE: 04-classification-based-decay.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: `fsrs-scheduler.ts` matches the context/tier multiplier matrix exactly, including `Infinity` handling for no-decay cases, and `composite-scoring.ts` consumes it. Some listed files are generic, but no critical implementation files are missing.
---
tokens used
190,137
---
FEATURE: 06-causal-depth-signal.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core depth scoring exists in `graph-signals.ts`, but the code normalizes by maximum root-reachable depth, not true graph diameter. The snippet also omits the actual Stage 2 integration and flag gate.
---
FEATURE: 07-community-detection.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: BFS/Louvain behavior and Stage 2 injection are present, but debounce is implemented in `detectCommunities()` rather than `storeCommunityAssignments()`. The snippet also misses the schema file that creates `community_assignments`.
---
FEATURE: 08-graph-and-cognitive-memory-fixes.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/storage/causal-edges.ts, mcp_server/handlers/causal-graph.ts, mcp_server/lib/graph/community-detection.ts, mcp_server/handlers/memory-triggers.ts, mcp_server/handlers/mutation-hooks.ts, mcp_server/handlers/memory-bulk-delete.ts, mcp_server/lib/cognitive/co-activation.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The listed fixes do exist, but the snippet misses most of the real implementation files and includes many generic scoring files instead. It is also slightly stale: community debounce now fingerprints `count:maxId:checksum`, and co-activation cache clearing happens via `mutation-hooks.ts`.
---
FEATURE: 09-anchor-tags-as-graph-nodes.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: I found anchor chunking, anchor metadata extraction, and anchor-aware result shaping, but no code that promotes anchors into graph nodes. The deferred status is accurate.
---
FEATURE: 10-causal-neighbor-boost-and-injection.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The 2-hop weighted CTE, 25%/5 seed rule, and 0.20 causal+session ceiling all match. The relation description is stale: code weights `supersedes`, `contradicts`, `caused`, `enabled`, `derived_from`, and `supports`, not `leads_to` or `relates_to`.
---
FEATURE: 11-temporal-contiguity-layer.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The module exists, but the exported APIs are `getTemporalNeighbors()` and `buildTimeline()`, not `queryTemporalNeighbors()` or `buildSpecFolderTimeline()`. Boosting is also proximity-weighted by time distance, not a flat `0.15` per neighbor.
---
FEATURE: 01-score-normalization.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: shared/algorithms/rrf-fusion.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: RRF normalization is live in `shared/algorithms/rrf-fusion.ts`, but composite normalization is only exposed as a helper in `composite-scoring.ts` and is not wired into the production search path. Several listed files are generic scoring dependencies, and `shared/normalization.ts` is unrelated DB row normalization.
---
FEATURE: 02-cold-start-novelty-boost.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: Current runtime behavior is a no-op: `calculateNoveltyBoost()` always returns `0`, and telemetry is hardcoded to `noveltyBoostApplied: false` / `0`. The historical formula and cap remain only as deprecated constants/tests, so the first half of the description overstates what is active today.
---
FEATURE: 03-interference-scoring.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/scoring/composite-scoring.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The threshold, Jaccard-like token overlap, same-folder scope, and `-0.08 * interferenceScore` penalty all match. The source list should also include `composite-scoring.ts`, where the penalty is actually applied during scoring.
---
FEATURE: 04-classification-based-decay.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: `fsrs-scheduler.ts` matches the context/tier multiplier matrix exactly, including `Infinity` handling for no-decay cases, and `composite-scoring.ts` consumes it. Some listed files are generic, but no critical implementation files are missing.
---
