# Iteration 007 - Q6 empty and stale code-graph recovery

## Focus

Q6: explain why sparse or empty structural code-graph state caused a slow Q1/cli-opencode fallback path, then recommend a recovery protocol that gives callers a fast, explicit `code_graph_scan` route instead of spending minutes discovering the graph is unusable. Q1 was not reopened. Q5 was also not reopened because Iterations 002 and 005 already answer the memory_context truncation root cause.

## Actions Taken

1. Checked prior iteration coverage and confirmed Q2, Q3, Q4, and Q5 already have source-backed recommendations.
2. Read the 006 stress-test Q1 evidence for the 249.8s cli-opencode degradation and the sparse `code_graph_query` fallback to grep.
3. Inspected `code_graph_query`, `code_graph_context`, `ensureCodeGraphReady`, session bootstrap, startup/autoprime, and scan handler paths.
4. Compared the existing readiness/blocking contract with the observed failure mode and documented the missing operational preflight.

## Findings

### 1. Q6 is not primarily a silent-empty-query bug anymore; it is a priming and routing bug

The stress-test evidence says Q1/cli-opencode took 249.8s because it chose the intended structural tool, hit a sparse graph, and then fell back to grep mid-execution (`001-search-intelligence-stress-test/002-scenario-execution/findings.md:26`, `:74`, `:119-123`). That is a real degradation, but the current source no longer looks like an unrestricted "query empty graph for minutes" path.

Current `code_graph_query` calls `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })` before answering (`mcp_server/code_graph/handlers/query.ts:1045-1059`). If readiness says a full scan is required and no inline full scan ran, `shouldBlockReadPath()` returns true (`query.ts:775-777`) and the handler emits a blocked payload with `requiredAction: "code_graph_scan"` (`query.ts:779-796`). `code_graph_context` mirrors the same blocked-read shape (`mcp_server/code_graph/handlers/context.ts:137-159`).

The missing piece is earlier than the query. Callers need to see the graph state before they choose a structural strategy, or they will still attempt `code_graph_query`, receive sparse or blocked output, and then pay the fallback cost.

### 2. Full-scan avoidance is deliberate and correct for read paths

`ensureCodeGraphReady()` classifies empty graph state as `freshness: "empty", action: "full_scan"` when there are zero nodes or no tracked files (`mcp_server/code_graph/lib/ensure-ready.ts:141-170`). It also marks broad stale states as `action: "full_scan"` when more than 50 files are stale (`ensure-ready.ts:200-212`). Because read handlers pass `allowInlineFullScan: false`, those states return immediately with `inlineIndexPerformed: false` and a reason ending in `inline full scan skipped for read path` (`ensure-ready.ts:368-375`).

That policy is sound. A full workspace scan is a mutating, potentially expensive maintenance operation, so structural reads should not surprise callers by doing it inline. The recovery protocol should preserve that rule and make the blocked state visible sooner.

### 3. Selective stale repair exists, but broad stale and empty states still need explicit operator action

For small stale sets, `ensureCodeGraphReady()` can run a bounded selective reindex with a 10s timeout (`ensure-ready.ts:52-56`, `:398-421`). For broad stale or empty states, the first-class repair tool is `code_graph_scan`, whose handler indexes the workspace and records whether the scan was incremental or forced full reindex (`mcp_server/code_graph/handlers/scan.ts:171-224`, `:301-336`).

So the canonical recovery split should be:

- `fresh`: use `code_graph_query`.
- `stale + selective_reindex`: allow the read path to self-heal, then query.
- `empty` or `stale + full_scan`: do not query first; run `code_graph_scan`, then retry the structural query.
- `error`: use `memory_health` / diagnostics instead of structural answers.

### 4. Startup and bootstrap already carry the right hints, but routing still allows avoidable first-attempt misses

Session surfaces expose the intended guidance. `session-snapshot` recommends structural reads for ready graphs, bounded refresh or `code_graph_scan` for stale graphs, and `code_graph_scan` for missing graphs (`mcp_server/lib/session/session-snapshot.ts:210-256`). Autoprime adds `code_graph_scan` to recommended calls when graph status is stale or empty and only includes `code_graph_query` as a routing rule when the graph is not empty (`mcp_server/hooks/memory-surface.ts:437-472`).

The gap is that this guidance is advisory. A caller can still go straight to `code_graph_query` without checking readiness, then spend time interpreting partial/blocked output. The runtime should make structural-read readiness part of the query contract: every structural query response should include a small `fallbackDecision` field with `nextTool: "code_graph_scan"` for full-scan-required states and `nextTool: "grep_or_rg"` only after scan is declined or fails.

## Questions Answered

### Q6 root cause

The slow Q1/cli-opencode path came from choosing the right structural tool against an unprimed or sparse structural graph, then discovering too late that the graph could not answer with enough coverage. Current code has a blocked-read path for empty/full-scan-required graph state, but the operational contract still lets callers attempt `code_graph_query` before using the startup/bootstrap readiness hints.

### Q6 recommended recovery protocol

Use a two-stage structural preflight:

1. At session start or before the first structural query, read the bootstrap/autoprime graph state.
2. If the state is `empty`, `missing`, or `stale` with `action: "full_scan"`, run `code_graph_scan` before `code_graph_query`.
3. If the state is `stale` with `action: "selective_reindex"`, allow `code_graph_query` / `code_graph_context` to self-heal through `ensureCodeGraphReady()`.
4. If `code_graph_query` returns `status:"blocked"` with `requiredAction:"code_graph_scan"`, stop structural querying and run scan; only fall back to `rg` if scan is unavailable, rejected, or fails.
5. Record latency and coverage separately: blocked-fast is a success state, sparse-partial-after-query is a degradation.

## Questions Remaining

- Q7: causal-graph edge growth is lopsided toward `supersedes`; investigate caps, balancing, and spam detection.
- Q8: intent classifier improvements beyond Cluster 2; investigate dual-classifier dissonance and cross-CLI paraphrase stability.
- A follow-up implementation packet should turn the Q6 protocol into a hard routing guard or query-response `fallbackDecision`, not only advisory text.

## Next Focus

Q7: investigate lopsided causal-graph edge growth. Determine why `supersedes` edges can grow rapidly while `caused` and `supports` stay flat, then recommend per-class caps, balancing, or supersedes-spam detection.
