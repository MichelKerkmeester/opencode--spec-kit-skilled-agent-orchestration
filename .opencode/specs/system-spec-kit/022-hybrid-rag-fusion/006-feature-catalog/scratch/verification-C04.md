OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce97-e1ad-71a2-942a-0916faed0ba2
--------
user
You are a feature catalog verification agent. Read each feature snippet file in: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/ (7 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/ (2 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying each feature snippet against the `mcp_server` code now. First I’m collecting the 9 feature files and their declared `## Source Files` so I can cross-check both the descriptions and the path coverage systematically.
exec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' -maxdepth 3 -type f | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md
 succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md
 succeeded in 51ms:
Total output lines: 1825

/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/.github/hooks/superset-notify.json
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/LICENSE
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/_pending
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts
codex
I’ve got the target feature files and the `mcp_server` tree. Next I’m reading the snippet text itself so I can compare each “Current Reality” claim against the actual handler, tool, schema, and API wiring.
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Causal edge creation (memory_causal_link)

## Current Reality

Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 52ms:
# Causal graph statistics (memory_causal_stats)

## Current Reality

Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target memory counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target memories that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
 succeeded in 51ms:
# Causal chain tracing (memory_drift_why)

## Current Reality

"Why was this decision made?" This tool answers that question by tracing the causal relationship chain for a given memory through depth-limited graph traversal.

You choose the traversal direction: outgoing (what did this memory cause or enable?), incoming (what caused or enabled this memory?) or both. Maximum depth is configurable from 1 to 10, defaulting to 3. Cycle detection via a visited set prevents infinite traversal through circular relationships.

Results are grouped by relationship type: causedBy, enabledBy, supersedes, contradicts, derivedFrom and supports. Each edge carries a relation-weighted strength value. Supersedes edges receive a 1.5x weight boost (because replacement is a strong signal). Caused edges receive 1.3x. Enabled edges receive 1.1x. Supports and derived_from edges pass through at 1.0x. Contradicts edges receive 0.8x dampening because contradictions weaken rather than strengthen the chain.

You can filter to specific relationship types after traversal. Pass `relations: ["caused", "supersedes"]` to see only the replacement and causation chains. The response includes a `maxDepthReached` flag that warns when the depth limit may have truncated results. If you see that flag, consider increasing `maxDepth` for a more complete picture.

When contradictions are found, the response includes warning hints. Two memories that contradict each other in the same causal chain is a signal that something needs resolution.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
 succeeded in 51ms:
# Epistemic baseline capture (task_preflight)

## Current Reality

Before starting implementation work, this tool records how much the agent knows, how uncertain it is and how complete the context is. All three scores are on a 0-100 scale. You can optionally list identified knowledge gaps as an array of strings.

Records are stored in the `session_learning` table with a `UNIQUE` constraint on `(spec_folder, task_id)`. If a preflight record already exists for the same combination and is still in the "preflight" phase, calling preflight again updates the existing record rather than creating a duplicate. Completed records (where postflight has already run) cannot be overwritten. That guard prevents accidental resets of finished learning cycles.

The purpose of preflight is establishing a baseline for learning measurement. Without knowing where you started, you cannot measure how much you learned. The postflight tool completes the measurement.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
 succeeded in 51ms:
# Causal edge deletion (memory_causal_unlink)

## Current Reality

Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).

A library-level variant, `deleteEdgesForMemory()`, removes all edges referencing a given memory ID. This variant is called automatically during memory deletion (`memory_delete`) to maintain graph integrity. You do not need to manually clean up edges when deleting a memory. The system handles it.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/causal-links-processor.ts` | Handler | Causal link mutation handler |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Post-task learning measurement (task_postflight)

## Current Reality

After completing implementation work, this tool captures the post-task epistemic state and computes a Learning Index by comparing against the preflight baseline. The formula weights three deltas: `LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)`.

The uncertainty delta is inverted (pre minus post) so that reduced uncertainty counts as a positive learning signal. If you started at 70% uncertainty and finished at 20%, that is a +50 uncertainty reduction contributing +17.5 to the Learning Index.

Interpretation bands give the score meaning. 40 or above signals significant learning (you understood something that changed your approach). 15-39 is moderate learning. 5-14 is incremental. 0-4 is an execution-focused session where you applied existing knowledge without gaining new understanding. Below zero indicates knowledge regression, which usually means the task revealed that prior assumptions were wrong.

You can track gaps closed during the task and new gaps discovered. Both are stored as JSON arrays alongside the scores. The phase updates from "preflight" to "complete" after postflight runs. Calling postflight without a matching preflight record throws an error.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 51ms:
# Learning history (memory_get_learning_history)

## Current Reality

Retrieves learning records for a spec folder with optional filtering by session ID and completion status. Each record shows the preflight scores, postflight scores, computed deltas and Learning Index.

The summary statistics are where this tool earns its keep. Across all completed tasks in a spec folder, you see the average Learning Index, maximum and minimum LI, average knowledge gain, average uncertainty reduction and average context improvement. Trend interpretation maps the average LI to a human-readable assessment: above 15 is a strong learning trend, 7-15 is positive, 0-7 is slight, zero is neutral and below zero is regression.

Pass `onlyComplete: true` to restrict results to tasks where both preflight and postflight were recorded. This gives you clean data for trend analysis without incomplete records skewing the averages. Records are ordered by `updated_at` descending so the most recent learning cycles appear first.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 51ms:
# Reporting dashboard (eval_reporting_dashboard)

## Current Reality

Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (markdown-formatted) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots`, `eval_channel_results` and `eval_final_results` tables. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON or `eval_run_id` grouping. A `isHigherBetter()` helper correctly interprets trend direction for different metric types (recall and precision are higher-better; latency is lower-better).

This is a read-only module. It queries the eval database and produces reports. No writes, no side effects, no feature flag gate.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 51ms:
# Ablation studies (eval_run_ablation)

## Current Reality

This tool runs controlled ablation studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results).

Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. The tool requires `SPECKIT_ABLATION=true` to activate. When the flag is off, the MCP handler returns an explicit disabled-flag error and does not execute an ablation run.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
codex
The snippet files are heavily over-listing dependencies, so I’m checking the actual module layout next. That will let me separate “core implementation files” from broad transitive dependencies and catch any outright nonexistent paths cleanly.
exec
/bin/zsh -lc "find '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' -maxdepth 2 -type d | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' | rg '("'^|/)(handlers|tools|schemas|api|context-server|tool-schemas|tests)/|session-learning|causal|eval|reporting-dashboard|ablation-framework|causal-edges|tool-input-schemas'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/.github
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/.github/hooks
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/api
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/configs
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/core
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/database
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/formatters
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/lib
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/schemas
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/scripts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tests
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tools
 succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
codex
I’ve confirmed the repo does have focused implementation modules for these features. Now I’m reading the actual tool registrations and handlers to see whether the prose claims are accurate or if the snippets describe behavior that isn’t really there.
exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"memory_causal_link|memory_causal_unlink|memory_causal_stats|memory_drift_why|task_preflight|task_postflight|memory_get_learning_history|eval_run_ablation|eval_reporting_dashboard\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' --glob '"'!dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Causal Tools
// ---------------------------------------------------------------
// Dispatch for L6 causal memory graph tools: drift_why,
// causal_link, causal_stats, causal_unlink (T303).
// ---------------------------------------------------------------

import {
  handleMemoryDriftWhy,
  handleMemoryCausalLink,
  handleMemoryCausalStats,
  handleMemoryCausalUnlink,
} from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';

import {
  MCPResponse, parseArgs,
  DriftWhyArgs, CausalLinkArgs, CausalStatsArgs, CausalUnlinkArgs,
} from './types';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Context Tools
// ---------------------------------------------------------------
// Dispatch for L1 Orchestration tool: memory_context (T303).
// ---------------------------------------------------------------

import { handleMemoryContext } from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';
import { MCPResponse, parseArgs, ContextArgs } from './types';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set(['memory_context']);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
    default: return null;
  }
}
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Lifecycle Tools
// ---------------------------------------------------------------
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// postflight, learning_history (T303).
// ---------------------------------------------------------------

import {
  handleMemoryIndexScan,
  handleMemoryIngestStart,
  handleMemoryIngestStatus,
  handleMemoryIngestCancel,
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  handleEvalRunAblation,
  handleEvalReportingDashboard,
} from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tool Schemas
// ---------------------------------------------------------------
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
// ---------------------------------------------------------------

export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas';

// --- 1. TYPES ---

/** Defines an MCP tool schema entry. */
export interface ToolDefinition {
  name: string;
 succeeded in 50ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:284:| `task_preflight`              | Capture epistemic baseline before task             | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:285:| `task_postflight`             | Capture state after task, calculate learning delta | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:286:| `memory_get_learning_history` | Get learning history with trends                   | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:292:| `memory_drift_why`     | Trace causal chain for decision lineage      | varies  |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:293:| `memory_causal_link`   | Create causal relationships between memories | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:294:| `memory_causal_stats`  | Graph statistics and coverage metrics        | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:295:| `memory_causal_unlink` | Remove causal relationships                  | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:301:| `eval_run_ablation`        | Run controlled channel-ablation experiments and report deltas | varies  |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:302:| `eval_reporting_dashboard` | Aggregate eval metrics into sprint and channel dashboards     | varies  |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:309:| `memory_get_learning_history` | Review preflight/postflight learning history         | <50ms   |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:346:| L6    | Analysis      | 1200         | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard` |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:347:| L7    | Maintenance   | 1000         | `memory_index_scan`, `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:893:memory_drift_why({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:904:memory_causal_link({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:916:task_preflight({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:927:task_postflight({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:976:| Decision archaeology             | `memory_drift_why({ memoryId: "..." })`                         | Understanding past decisions              |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:977:| Track learning                   | `task_preflight` -> work -> `task_postflight`                   | Implementation tasks                      |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1044:| Causal graph empty        | Use `memory_causal_link` to create relationships |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:153:/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
exec
/bin/zsh -lc "sed -n '220,760p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '140,760p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '300,430p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

const memoryGetLearningHistorySchema = getSchema({
  specFolder: pathString(1),
  sessionId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  onlyComplete: z.boolean().optional(),
  includeSummary: z.boolean().optional(),
});

const memoryIngestStartSchema = getSchema({
  paths: z.array(pathString(1)).min(1).max(50),
  specFolder: optionalPathString(),
});

const memoryIngestStatusSchema = getSchema({
  jobId: z.string().min(1),
});

const memoryIngestCancelSchema = getSchema({
  jobId: z.string().min(1),
 succeeded in 51ms:
    if (score.value === undefined || score.value === null) {
      throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, `${score.name} is required`, { param: score.name });
    }
    if (typeof score.value !== 'number' || score.value < 0 || score.value > 100) {
      throw new MemoryError(ErrorCodes.INVALID_PARAMETER, `${score.name} must be a number between 0 and 100`, { param: score.name, value: score.value });
    }
  }
}

/* ---------------------------------------------------------------
   3. TASK PREFLIGHT HANDLER
--------------------------------------------------------------- */

/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
async function handleTaskPreflight(args: PreflightArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();
  const {
    specFolder: spec_folder,
    taskId,
    knowledgeScore: knowledge_score,
 succeeded in 51ms:
  const allowed = new Set(relations);

  const filtered: FlattenedChain = {
    all: chain.all.filter(e => allowed.has(e.relation)),
    by_cause: allowed.has('caused') ? chain.by_cause : [],
    by_enabled: allowed.has('enabled') ? chain.by_enabled : [],
    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
    by_derived_from: allowed.has('derived_from') ? chain.by_derived_from : [],
    by_supports: allowed.has('supports') ? chain.by_supports : [],
    total_edges: 0,
    max_depth_reached: chain.max_depth_reached,
  };
  filtered.total_edges = filtered.all.length;
  return filtered;
}

/* ---------------------------------------------------------------
   3. MEMORY DRIFT WHY HANDLER
--------------------------------------------------------------- */
 succeeded in 51ms:
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
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Eval Reporting
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { init as initHybridSearch, hybridSearchEnhanced } from '../lib/search/hybrid-search';
import { generateQueryEmbedding } from '../lib/providers/embeddings';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework';
exec
/bin/zsh -lc "sed -n '220,320p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '300,430p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
const checkpointListSchema = getSchema({
  specFolder: optionalPathString(),
  limit: positiveIntMax(100).optional(),
});

const checkpointRestoreSchema = getSchema({
  name: z.string().min(1),
  clearExisting: z.boolean().optional(),
});

const checkpointDeleteSchema = getSchema({
  name: z.string().min(1),
  confirmName: z.string().min(1),
});

const taskPreflightSchema = getSchema({
  specFolder: pathString(1),
  taskId: z.string().min(1),
  knowledgeScore: boundedNumber(0, 100),
  uncertaintyScore: boundedNumber(0, 100),
 succeeded in 51ms:
        description: 'Required safety confirmation. It must exactly match name.'
      }
    },
    required: ['name', 'confirmName']
  },
};

// L6: Analysis - Deep inspection and lineage (Token Budget: 1200)
const taskPreflight: ToolDefinition = {
  name: 'task_preflight',
  description: '[L6:Analysis] Capture epistemic baseline before task execution. Call at the start of implementation work to record knowledge, uncertainty, and context scores for learning measurement. Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
};

const taskPostflight: ToolDefinition = {
  name: 'task_postflight',
  description: '[L6:Analysis] Capture epistemic state after task execution and calculate learning delta. Call after completing implementation work. Calculates Learning Index: LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
};

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Ablation Framework (R13-S3)
// ---------------------------------------------------------------
//
// Controlled ablation studies for search channel contribution analysis.
// Selectively disables one search channel at a time, measures Recall@20
// delta against a full-pipeline baseline, and attributes per-channel
// contribution to retrieval quality.
//
// Features:
// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
// - Ablation runner with ground truth evaluation
// - Delta calculation (baseline vs ablated Recall@20)
// - Paired sign-test for statistical significance
// - Results storage in eval_metric_snapshots table
// - Human-readable ablation report formatting
//
// CRITICAL: Ablation studies are experimental and gated behind
// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
// and is a no-op when the flag is not set.
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Reporting Dashboard (R13-S3)
// ---------------------------------------------------------------
// Sprint 7: Full reporting dashboard for eval infrastructure.
// Aggregates metrics per sprint/eval-run, per-channel views,
// trend analysis, and formatted report output.
//
// Uses: eval-db.ts singleton, eval_metric_snapshots table,
//       eval_channel_results table, eval_final_results table.
//
// Design:
//   - Read-only queries against eval DB (no writes).
//   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
//   - Pure aggregation logic; DB access isolated to query functions.
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

// Internal modules
exec
/bin/zsh -lc "sed -n '340,520p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '320,640p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      metricLatest.set(snap.metric_name, {
        value: snap.metric_value,
        time: snap.created_at,
      });
    }
  }

  // Build metric summaries
  const metrics: Record<string, MetricSummary> = {};
  for (const [name, values] of metricGroups) {
    const latest = metricLatest.get(name)?.value ?? 0;
    metrics[name] = computeMetricSummary(values, latest);
  }

  // Build channel performance
  const channels: Record<string, ChannelPerformance> = {};
  const runChannelRows = channelRows.filter(r => evalRunIds.includes(r.eval_run_id));

  const channelGroups = new Map<string, ChannelResultRow[]>();
  for (const row of runChannelRows) {
 succeeded in 52ms:
    'precision@5': entry(bMetrics.map(m => m.metrics.precision), aMetrics.map(m => m.metrics.precision)),
    'recall@5': entry(bMetrics.map(m => m.metrics.recall), aMetrics.map(m => m.metrics.recall)),
    'NDCG@5': entry(bMetrics.map(m => m.metrics.ndcg), aMetrics.map(m => m.metrics.ndcg)),
    'MAP': entry(bMetrics.map(m => m.metrics.map), aMetrics.map(m => m.metrics.map)),
    'hit_rate': entry(bMetrics.map(m => m.metrics.hitRate), aMetrics.map(m => m.metrics.hitRate)),
    'latency_p50': {
      baseline: percentile(bLatencies, 50),
      ablated: percentile(aLatencies, 50),
      delta: percentile(aLatencies, 50) - percentile(bLatencies, 50),
    },
    'latency_p95': {
      baseline: percentile(bLatencies, 95),
      ablated: percentile(aLatencies, 95),
      delta: percentile(aLatencies, 95) - percentile(bLatencies, 95),
    },
    'token_usage': { baseline: 0, ablated: 0, delta: 0 },
  };
}

/* --- 4. PUBLIC API --- */
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

import * as memorySearch from './memory-search';
import * as memoryTriggers from './memory-triggers';
import * as memorySave from './memory-save';
import * as memoryCrud from './memory-crud';
import * as memoryIndex from './memory-index';
import * as memoryBulkDelete from './memory-bulk-delete';
import * as checkpoints from './checkpoints';
import * as sessionLearning from './session-learning';
import * as causalGraph from './causal-graph';
import * as evalReporting from './eval-reporting';
// T061: L1 Orchestration - unified entry point
import * as memoryContext from './memory-context';
import * as memoryIngest from './memory-ingest';

/* ---------------------------------------------------------------
   RE-EXPORTS: All handler functions
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Context Server
// ---------------------------------------------------------------
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// logic in tools/*.ts. This file retains server init, startup,
// shutdown, and main orchestration only.
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
   1. MODULE IMPORTS
--------------------------------------------------------------- */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

codex
I’m running a quick structural check across the markdown tables now. That will give me an exact invalid-path list per feature file before I finalize the higher-level accuracy judgments.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const base=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\";const files=[\"feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md\",\"feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md\",\"feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md\",\"feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md\",\"feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md\",\"feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md\",\"feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md\",\"feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md\",\"feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md\"];for(const rel of files){const full=path.join(base,rel);const text=fs.readFileSync(full,\"utf8\");const paths=[];for(const line of text.split(/\\r?\\n/)){const m=line.match(/"'^'"\\| "'`([''^`]+)` '"\\|/);if(m)paths.push(m[1]);}const invalid=paths.filter(p=>"'!fs.existsSync(path.join(base,p)));console.log(`FILE ${path.basename(full)}`);console.log(`TOTAL_PATHS ${paths.length}`);console.log(`INVALID_COUNT ${invalid.length}`);if(invalid.length)console.log(invalid.join("'"\\n\"));console.log(\"---\");}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE 01-causal-edge-creation-memorycausallink.md
TOTAL_PATHS 94
INVALID_COUNT 1
mcp_server/tests/retry.vitest.ts
---
FILE 02-causal-graph-statistics-memorycausalstats.md
TOTAL_PATHS 98
INVALID_COUNT 1
mcp_server/tests/retry.vitest.ts
---
FILE 03-causal-edge-deletion-memorycausalunlink.md
TOTAL_PATHS 94
INVALID_COUNT 1
mcp_server/tests/retry.vitest.ts
---
FILE 04-causal-chain-tracing-memorydriftwhy.md
TOTAL_PATHS 98
INVALID_COUNT 1
mcp_server/tests/retry.vitest.ts
---
exec
/bin/zsh -lc "sed -n '340,620p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"deleteEdgesForMemory|getGraphStats|findOrphanedEdges|createSpecDocumentChain|logWeightChange|countEdgesForNode|last_accessed|weight_history|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH|insertEdgesBatch\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '620,820p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      visited.add(nextId);

      // C138: apply relation weight multiplier, then re-clamp to [0, 1]
      const weight = RELATION_WEIGHTS[edge.relation] ?? 1.0;
      const weightedStrength = Math.min(1, edge.strength * weight);

      const child: CausalChainNode = {
        id: nextId,
        edgeId: edge.id,               // T202: preserve edge ID for unlink workflow
        depth: depth + 1,
        relation: edge.relation,
        strength: weightedStrength,
        children: [],
      };

      node.children.push(child);
      traverse(child, depth + 1);
    }
  }

 succeeded in 51ms:
42:const MAX_EDGES_PER_NODE = 20;
43:const MAX_AUTO_STRENGTH = 0.5;
62:  last_accessed: string | null;
144:  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
146:    ? Math.min(strength, MAX_AUTO_STRENGTH)
157:  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
159:    const edgeCount = countEdgesForNode(sourceId);
160:    if (edgeCount >= MAX_EDGES_PER_NODE) {
161:      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
169:    // AI-WHY: Wrap SELECT + UPSERT + logWeightChange in a transaction for atomicity
171:      // AI-WHY: Check if edge exists (for weight_history logging on conflict update).
173:      // to write a weight_history row after the upsert. The subsequent INSERT
195:        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
213:function insertEdgesBatch(
251:    console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
394:    // AI-WHY: Wrap SELECT + UPDATE + logWeightChange in a transaction for atomicity
396:      // T001d: Capture old strength for weight_history logging
413:      // T001d: Log weight change to weight_history
417:          logWeightChange(edgeId, oldStrength, newStrength, changedBy, reason);
454:function deleteEdgesForMemory(memoryId: string): number {
 succeeded in 51ms:
  if (!db) return [];
  try {
    return (db.prepare(`
      SELECT * FROM weight_history WHERE edge_id = ? ORDER BY changed_at DESC LIMIT ?
    `) as Database.Statement).all(edgeId, limit) as WeightHistoryEntry[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getWeightHistory error: ${msg}`);
    return [];
  }
}

function rollbackWeights(edgeId: number, toTimestamp: string): boolean {
  if (!db) return false;
  const database = db;
  try {
    // AI-WHY: Wrap SELECTs + UPDATE + logWeightChange in a transaction for atomicity
    const changed = database.transaction(() => {
      // Get current strength before rollback
      const current = (database.prepare(
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"eval_run_ablation|eval_reporting_dashboard\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"deleteEdgesForMemory\\(|cleanupOrphanedEdges\\(|createSpecDocumentChain\\(\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server' --glob '"'!dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
// Re-exports all tool dispatch modules for context-server (T303).
// ---------------------------------------------------------------

import * as contextTools from './context-tools';
import * as memoryTools from './memory-tools';
import * as causalTools from './causal-tools';
import * as checkpointTools from './checkpoint-tools';
import * as lifecycleTools from './lifecycle-tools';

export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools };

export type { MCPResponse } from './types';

/** All tool dispatch modules in priority order */
export const ALL_DISPATCHERS = [
  contextTools,
  memoryTools,
 exited 1 in 50ms:

 succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:74:          causalEdges.deleteEdgesForMemory(String(numericId));
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:166:            causalEdges.deleteEdgesForMemory(String(memory.id));
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:401:      const orphanResult = causalEdges.cleanupOrphanedEdges();
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:178:          causalEdges.deleteEdgesForMemory(String(memory.id));
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:472:            const chainResult = createSpecDocumentChain(docIds);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:304:        try { causalEdges.deleteEdgesForMemory(String(memory.id)); } catch { /* ignore */ }
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:789:  describe('T072: createSpecDocumentChain() export and structure', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:801:      const result = createSpecDocumentChain({ spec: 1, plan: 2 });
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:806:      const result = createSpecDocumentChain({});
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:811:      const result = createSpecDocumentChain({ spec: 1 });
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:562:      const count = causalEdges.deleteEdgesForMemory('2');
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:573:      causalEdges.deleteEdgesForMemory('2');
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:581:      const count = causalEdges.deleteEdgesForMemory('999');
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:608:      const deleted = causalEdges.deleteEdgesForMemory('1');
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:454:function deleteEdgesForMemory(memoryId: string): number {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:525:function cleanupOrphanedEdges(): { deleted: number } {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:556:function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '420,520p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Causal Links Processor
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';

import type { CausalLinks } from '../lib/parsing/memory-parser';
import * as causalEdges from '../lib/storage/causal-edges';
import { toErrorMessage } from '../utils';
import { escapeLikePattern } from './handler-utils';

interface CausalLinkMapping {
  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
  reverse: boolean;
}

interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Delete
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

 succeeded in 52ms:
  if (include_spec_docs) {
    try {
      // AI-WHY: Determine which spec folders had spec document changes in this scan.
      // We use parsed document type (not basename) to avoid false positives
      // from memory/plan.md or similar filenames.
      const affectedSpecFolders = new Set<string>();
      for (const fileResult of results.files) {
        if (!fileResult.specFolder || fileResult.status === 'failed') {
          continue;
        }

        if (!fileResult.filePath) {
          continue;
        }

        const docType = memoryParser.extractDocumentType(fileResult.filePath);
        if (
          docType !== 'memory' &&
          docType !== 'constitutional'
        ) {
exec
/bin/zsh -lc "rg -n \"try|catch|getVerdict|HARMFUL|CRITICAL|pValue|SPECKIT_ABLATION|negative timestamp|eval_metric_snapshots\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"eval_final_results|eval_metric_snapshots|eval_channel_results|isHigherBetter|sprintLabel|sprint\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"complete\\)|phase IN|learningIndexRounded|avg_learning_index|ORDER BY updated_at DESC|only_complete|include_summary\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"causedBy|enabledBy|supersedes|contradicts|derivedFrom|supports|maxDepthReached|relations filter|coveragePercent|orphanedEdges|meetsTarget|link_coverage_percent|Delete causal edge|Created causal link\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
70:    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
339:    WHERE spec_folder = ? AND task_id = ? AND phase IN ('preflight', 'complete')
357:  const learningIndexRounded = Math.round(learningIndex * 100) / 100;
360:  if (learningIndexRounded >= 40) {
362:  } else if (learningIndexRounded >= 15) {
364:  } else if (learningIndexRounded >= 5) {
366:  } else if (learningIndexRounded >= 0) {
398:      learningIndexRounded,
406:    console.error(`[session-learning] Postflight recorded: spec=${spec_folder}, task=${taskId}, LI=${learningIndexRounded}`);
417:      summary: `Learning measured: LI=${learningIndexRounded} (${interpretation.split(' - ')[0]})`,
439:          learningIndex: learningIndexRounded,
474:    onlyComplete: only_complete = false,
475:    includeSummary: include_summary = true
503:    if (only_complete) {
507:    sql += ' ORDER BY updated_at DESC LIMIT ?';
558:    if (include_summary) {
564:          AVG(CASE WHEN phase = 'complete' THEN learning_index END) as avg_learning_index,
580:      if (only_complete) {
589:        averageLearningIndex: stats.avg_learning_index !== null
590:          ? Math.round((stats.avg_learning_index as number) * 100) / 100
 succeeded in 51ms:
5:// Aggregates metrics per sprint/eval-run, per-channel views,
8:// Uses: eval-db.ts singleton, eval_metric_snapshots table,
9://       eval_channel_results table, eval_final_results table.
32:  /** Filter to specific sprint labels (matched against metadata). */
33:  sprintFilter?: string[];
51:/** Per-channel performance within a sprint. */
58:/** Report for a single sprint / eval-run group. */
61:  sprint: string;
62:  /** Number of eval runs in this sprint group. */
64:  /** Eval run IDs included in this sprint group. */
70:  /** Earliest timestamp in this sprint group. */
72:  /** Latest timestamp in this sprint group. */
104:  /** Per-sprint reports. */
105:  sprints: SprintReport[];
124:/** Row shape from eval_metric_snapshots. */
136:/** Row shape from eval_channel_results. */
146: * Extract sprint label from a metadata JSON string.
147: * Looks for "sprint" key in the JSON. Returns null if not found.
153:    if (parsed.sprint !== undefined && parsed.sprint !== null) {
154:      return String(parsed.sprint);
 succeeded in 51ms:
15:// - Results storage in eval_metric_snapshots table
18:// CRITICAL: Ablation studies are experimental and gated behind
19:// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
32:import type { EvalResult, GroundTruthEntry } from './eval-metrics';
42: * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
46:  return process.env.SPECKIT_ABLATION?.toLowerCase() === 'true';
99:  pValue: number | null;
112:/** A single metric entry comparing baseline vs ablated. */
113:export interface AblationMetricEntry {
121:  'MRR@5': AblationMetricEntry;
122:  'precision@5': AblationMetricEntry;
123:  'recall@5': AblationMetricEntry;
124:  'NDCG@5': AblationMetricEntry;
125:  'MAP': AblationMetricEntry;
126:  'hit_rate': AblationMetricEntry;
127:  'latency_p50': AblationMetricEntry;
128:  'latency_p95': AblationMetricEntry;
129:  'token_usage': AblationMetricEntry;
170:  try {
172:  } catch {
 succeeded in 51ms:
44:  by_supersedes: FlatEdge[];
45:  by_contradicts: FlatEdge[];
47:  by_supports: FlatEdge[];
95:    by_supersedes: [],
96:    by_contradicts: [],
98:    by_supports: [],
139:      case 'supersedes': return result.by_supersedes;
140:      case 'contradicts': return result.by_contradicts;
142:      case 'supports': return result.by_supports;
162:    by_supersedes: [],
163:    by_contradicts: [],
165:    by_supports: [],
179:      case 'supersedes': merged.by_supersedes.push(edge); break;
180:      case 'contradicts': merged.by_contradicts.push(edge); break;
182:      case 'supports': merged.by_supports.push(edge); break;
226:    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
227:    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
229:    by_supports: allowed.has('supports') ? chain.by_supports : [],
313:        chain = forwardFlat || backwardFlat || { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
317:      chain = tree ? flattenCausalTree(tree, maxDepth, mappedDirection) : { all: [], by_cause: [], by_enabled: [], by_supersedes: [], by_contradicts: [], by_derived_from: [], by_supports: [], total_edges: 0, max_depth_reached: false };
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
exec
/bin/zsh -lc "sed -n '1,140p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Session Learning
// ---------------------------------------------------------------

import * as vectorIndex from '../lib/search/vector-index';
import { checkDatabaseUpdated } from '../core';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { toErrorMessage } from '../utils';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse, DatabaseExtended as Database } from './types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface PreflightArgs {
exec
/bin/zsh -lc "sed -n '680,760p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
        `| ${m['recall@5'].delta >= 0 ? '+' : ''}${m['recall@5'].delta.toFixed(4)} ` +
        `| ${m['NDCG@5'].delta >= 0 ? '+' : ''}${m['NDCG@5'].delta.toFixed(4)} ` +
        `| ${m['MAP'].delta >= 0 ? '+' : ''}${m['MAP'].delta.toFixed(4)} ` +
        `| ${m['hit_rate'].delta >= 0 ? '+' : ''}${m['hit_rate'].delta.toFixed(4)} ` +
        `| ${m['latency_p50'].delta >= 0 ? '+' : ''}${m['latency_p50'].delta.toFixed(1)}ms ` +
        `| ${m['latency_p95'].delta >= 0 ? '+' : ''}${m['latency_p95'].delta.toFixed(1)}ms ` +
        `| ${m['token_usage'].delta >= 0 ? '+' : ''}${m['token_usage'].delta.toFixed(0)} |`,
      );
    }
    lines.push(``);
    lines.push(`**Note:** Delta values shown (ablated - baseline). Negative = channel contributes positively to that metric.`);
    lines.push(``);
  }

  // Channel contribution ranking
  lines.push(`### Channel Contribution Ranking`);
  lines.push(``);

  const ranked = [...sorted].sort((a, b) => a.delta - b.delta); // Most negative delta = most valuable
  for (let i = 0; i < ranked.length; i++) {
codex
I’ve finished the code comparison pass. I’m consolidating it feature-by-feature now, with two kinds of findings: stale path tables and a smaller set of prose mismatches where the snippet overstates or misstates what the handler actually returns.
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// TEST: Reporting Dashboard
// Full reporting dashboard for eval infrastructure.
//
// Validates:
//   RD-1  — generateDashboardReport() returns valid DashboardReport structure
//   RD-2  — Report includes sprint-level metric aggregation (mean, min, max, latest)
//   RD-3  — Report includes channel performance data
//   RD-4  — Report includes trend entries with direction
//   RD-5  — formatReportText() produces non-empty string with expected sections
//   RD-6  — formatReportJSON() produces valid JSON matching DashboardReport shape
//   RD-7  — Filter by sprint works correctly
//   RD-8  — Empty database returns report with zero eval runs
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

/* ---------------------------------------------------------------
   MOCK: eval-db module
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Test — Ablation Framework
// ---------------------------------------------------------------
//
// Unit and integration tests for the ablation study framework.
// Verifies feature flag gating, channel-to-flag mapping, ablation runner
// with dependency-injected mock search functions, report formatting,
// and DB persistence of ablation results.
//
// Acceptance criterion: ablation run shows per-channel Recall@20 delta
// and can isolate the contribution of at least 1 individual channel.

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import {
  isAblationEnabled,
  runAblation,
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Preflight Validation Tests (T067-T070, T156-T166)
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import * as preflight from '../lib/validation/preflight';

type DuplicateParams = Parameters<typeof preflight.checkDuplicate>[0];

/* -------------------------------------------------------------
   Test Data
---------------------------------------------------------------- */

const TEST_CONTENT_VALID = `# Test Memory

This is a test memory file with valid content.

<!-- ANCHOR:summary -->
This is the summary section.
<!-- /ANCHOR:summary -->
codex
---
FEATURE: 01-causal-edge-creation-memorycausallink.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/causal-graph.ts, mcp_server/tools/causal-tools.ts, mcp_server/handlers/memory-index.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior matches the code, but the direct `memory_causal_link` handler is in `handlers/causal-graph.ts`; `handlers/causal-links-processor.ts` is for auto-extracted links, and spec-doc chain creation is invoked from `handlers/memory-index.ts`.
---
FEATURE: 02-causal-graph-statistics-memorycausalstats.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/causal-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core metrics, 60% target, and orphan detection match, but the tool returns only an orphan count, not orphan edge IDs, so the cleanup guidance via `memory_drift_why` is overstated.
---
FEATURE: 03-causal-edge-deletion-memorycausalunlink.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/causal-graph.ts, mcp_server/tools/causal-tools.ts, mcp_server/handlers/memory-crud-delete.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The deletion workflow matches the code, but the user-facing unlink handler lives in `handlers/causal-graph.ts`, and automatic edge cleanup during `memory_delete` is implemented in `handlers/memory-crud-delete.ts`.
---
FEATURE: 04-causal-chain-tracing-memorydriftwhy.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/causal-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Traversal, weighting, filtering, and warning behavior match the code; the main omission is the direct dispatcher in `tools/causal-tools.ts`.
---
FEATURE: 05-epistemic-baseline-capture-taskpreflight.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The preflight behavior matches the implementation; the main missing feature-specific source file is the lifecycle dispatcher.
---
FEATURE: 06-post-task-learning-measurement-taskpostflight.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The Learning Index formula, bands, and error behavior match; the main missing feature-specific source file is the lifecycle dispatcher.
---
FEATURE: 07-learning-history-memorygetlearninghistory.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Complete records include postflight scores, deltas, and Learning Index, but preflight-only records do not, so “each record shows” overstates the actual response shape.
---
FEATURE: 01-ablation-studies-evalrunablation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The ablation framework, feature-flag gating, partial-failure handling, and negative `eval_run_id` storage behavior all match the code; the main omission is the lifecycle dispatcher.
---
FEATURE: 02-reporting-dashboard-evalreportingdashboard.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The dashboard logic matches for sprint grouping, channel aggregation, and trends, but the implementation queries `eval_metric_snapshots` and `eval_channel_results` only; `eval_final_results` is not actually read.
---
tokens used
160,664
---
FEATURE: 01-causal-edge-creation-memorycausallink.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/causal-graph.ts, mcp_server/tools/causal-tools.ts, mcp_server/handlers/memory-index.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior matches the code, but the direct `memory_causal_link` handler is in `handlers/causal-graph.ts`; `handlers/causal-links-processor.ts` is for auto-extracted links, and spec-doc chain creation is invoked from `handlers/memory-index.ts`.
---
FEATURE: 02-causal-graph-statistics-memorycausalstats.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/causal-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Core metrics, 60% target, and orphan detection match, but the tool returns only an orphan count, not orphan edge IDs, so the cleanup guidance via `memory_drift_why` is overstated.
---
FEATURE: 03-causal-edge-deletion-memorycausalunlink.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/causal-graph.ts, mcp_server/tools/causal-tools.ts, mcp_server/handlers/memory-crud-delete.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The deletion workflow matches the code, but the user-facing unlink handler lives in `handlers/causal-graph.ts`, and automatic edge cleanup during `memory_delete` is implemented in `handlers/memory-crud-delete.ts`.
---
FEATURE: 04-causal-chain-tracing-memorydriftwhy.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/causal-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Traversal, weighting, filtering, and warning behavior match the code; the main omission is the direct dispatcher in `tools/causal-tools.ts`.
---
FEATURE: 05-epistemic-baseline-capture-taskpreflight.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The preflight behavior matches the implementation; the main missing feature-specific source file is the lifecycle dispatcher.
---
FEATURE: 06-post-task-learning-measurement-taskpostflight.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The Learning Index formula, bands, and error behavior match; the main missing feature-specific source file is the lifecycle dispatcher.
---
FEATURE: 07-learning-history-memorygetlearninghistory.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Complete records include postflight scores, deltas, and Learning Index, but preflight-only records do not, so “each record shows” overstates the actual response shape.
---
FEATURE: 01-ablation-studies-evalrunablation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The ablation framework, feature-flag gating, partial-failure handling, and negative `eval_run_id` storage behavior all match the code; the main omission is the lifecycle dispatcher.
---
FEATURE: 02-reporting-dashboard-evalreportingdashboard.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/lifecycle-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The dashboard logic matches for sprint grouping, channel aggregation, and trends, but the implementation queries `eval_metric_snapshots` and `eval_channel_results` only; `eval_final_results` is not actually read.
---
