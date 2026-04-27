# Iteration 006 - Telemetry passthrough and status-readiness closure

## Status
- Iteration: 6 / 10
- Focus: close Q-OPP's exact serialization path and refine Q-P2's status-vs-watcher recommendation
- newInfoRatio: 0.38
- Convergence trajectory: P0/P1 remain provisionally converged; Q-OPP now has a concrete anchor-preservation patch shape, and Q-P2 has a narrower non-mutating status snapshot recommendation.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Provisionally converged; see iteration-005. I did not find a contradiction in this pass.

Recommended winner remains: add a command-owned Copilot target-authority preamble/helper shared by deep-research and deep-review, with plan-only Gate 3 behavior when write intent exists but operator-approved target authority is missing.

Success criteria remain falsifiable from iteration-005: approved small/large prompts carry the exact spec folder, missing-authority continuity writes return only the Gate 3 question, prompt-body/bootstrap folders cannot override `targetAuthority.specFolder`, and an I1-style cli-copilot replay performs no mutation without target authority.

## Q-P1: code-graph fast-fail not testable

Provisionally converged; see iteration-005. I did not re-open the harness design beyond checking that Q-P2's status helper should not be conflated with the degraded graph sweep.

Recommended winner remains: keep the mocked unit coverage, then add a deterministic end-to-end degraded graph cell with an isolated `SPEC_KIT_DB_DIR`. Empty/full-scan-required states should produce `fallbackDecision.nextTool:"code_graph_scan"` before retry; readiness-error/unavailable states should route to `rg`; fresh and selective-inline states should not emit `fallbackDecision`.

## Q-P2: file-watcher debounce

Refined recommendation: do not lower `DEFAULT_DEBOUNCE_MS=2000` first. Add a non-mutating status readiness snapshot that exposes the same action/reason shape as readiness detection, then decide on watcher debounce only if tests show watcher events are the delay source.

The nuance is that `code_graph_status` already does a fresh, non-mutating freshness probe, but it throws away action-level detail. In `status.ts`, the handler reads persisted stats, calls `getGraphFreshness(process.cwd())`, and builds a readiness block with `action:'none'` regardless of whether the underlying state would require a selective reindex or full scan (`status.ts:161` through `status.ts:194`). `getGraphFreshness` itself calls the private `detectState(rootDir)` and returns only `state.freshness` (`ensure-ready.ts:461` through `ensure-ready.ts:464`). The richer state already exists inside `detectState`: it returns `freshness`, `action`, stale/deleted files, and `reason`, with full-scan cases for empty graphs, HEAD drift, and too many stale files, plus selective-reindex cases for bounded stale sets (`ensure-ready.ts:141` through `ensure-ready.ts:226`).

So the lowest-risk fix is not "status should call `ensureCodeGraphReady`". That path has a 5s readiness debounce (`ensure-ready.ts:301` through `ensure-ready.ts:338`) and also cleans deleted tracked files after detection (`ensure-ready.ts:341` through `ensure-ready.ts:342`), which violates the README's status contract that status is a non-mutating probe (`handlers/README.md:20`). The cleaner patch is to extract or export a read-only snapshot helper, for example:

```ts
export interface GraphReadinessSnapshot {
  freshness: GraphFreshness;
  action: ReadyAction;
  reason: string;
  staleFileCount: number;
  deletedFileCount: number;
}

export function getGraphReadinessSnapshot(rootDir: string): GraphReadinessSnapshot {
  const state = detectState(rootDir);
  return {
    freshness: state.freshness,
    action: state.action,
    reason: state.reason,
    staleFileCount: state.staleFiles.length,
    deletedFileCount: state.deletedFiles.length,
  };
}
```

Then `code_graph_status` can build its readiness block from the snapshot's `freshness`, `action`, and `reason` while still not indexing or deleting rows. A crashed snapshot should keep the existing `'error' -> unavailable` behavior.

Watcher evidence supports keeping the debounce unchanged for now. The watcher combines `DEFAULT_DEBOUNCE_MS=2000` with chokidar `awaitWriteFinish: { stabilityThreshold: 1000 }` (`file-watcher.ts:49` and `file-watcher.ts:251` through `file-watcher.ts:254`), filters to Markdown paths, and dedupes repeated file changes by content hash before reindexing (`file-watcher.ts:271` through `file-watcher.ts:296`, `file-watcher.ts:357` through `file-watcher.ts:375`). It also bounds concurrent reindex to 2 and retries SQLite busy errors (`file-watcher.ts:222` through `file-watcher.ts:239`, `file-watcher.ts:383` through `file-watcher.ts:385`). Lowering debounce before action-level status visibility risks increasing churn without proving it fixes stale-status perception.

Falsifiable success criteria:
- After touching one tracked Markdown file, `code_graph_status` reports `freshness:"stale"`, `readiness.action:"selective_reindex"`, and a reason naming newer mtime or stale files before any query runs.
- After creating an empty isolated graph DB, status reports `readiness.action:"full_scan"` and a scan-required reason without mutating graph rows.
- Calling `code_graph_status` twice inside 5s still re-probes snapshot freshness, not `ensureCodeGraphReady`'s cached result.
- File-watcher tests with the default 2000ms debounce show event-to-reindex latency and no missed add/change/unlink events. Only if this fails should a second patch test 1000ms or 500ms debounce.

## Q-OPP: CocoIndex fork telemetry leverage

Recommended winner: preserve CocoIndex per-result telemetry through `code_graph_context` anchors as provenance/explainability fields, not as a second ranking step in `mcp_server/lib/search`.

This pass closes the exact serialization path. `code_graph_context` accepts seeds with `provider`, `source`, `file`, `range`, `score`, and `snippet`, but the handler's input type omits `raw_score`, `path_class`, and `rankingSignals` (`context.ts:16` through `context.ts:31`). Its CocoIndex seed normalization likewise forwards only file/range/score/snippet/source (`context.ts:166` through `context.ts:180`). The resolved response anchors preserve `source`, `provider`, `score`, `snippet`, and `range`, but there is currently no slot for raw score, path class, ranking signals, source realpath, or dedup metadata (`context.ts:245` through `context.ts:256`).

The lower-level resolver has the same shape. `CocoIndexSeed` includes `file`, `range`, `score`, `snippet`, and `source` only (`seed-resolver.ts:20` through `seed-resolver.ts:27`), and `resolveCocoIndexSeed` copies only `score`, `snippet`, `range`, `provider`, and `source` onto the anchor (`seed-resolver.ts:95` through `seed-resolver.ts:110`). The public MCP schema and Zod schema match that reduced contract: `tool-schemas.ts:607` through `tool-schemas.ts:621` and `tool-input-schemas.ts:464` through `tool-input-schemas.ts:482` list the seed fields but omit telemetry.

The fork-side evidence says this is lost metadata, not a missing ranking algorithm. CocoIndex already computes `raw_score`, applies bounded path-class reranking under implementation intent, and emits `rankingSignals` (`query.py:176` through `query.py:217`). The MCP/server side also exposes these fields (`server.py:51` through `server.py:53`, from the search hit output model) plus response-level `dedupedAliases` and `uniqueResultCount` (`server.py:66` through `server.py:67`). A search over `mcp_server/lib/search` found only unrelated local `rawScore` variables in memory-search scoring (`hybrid-search.ts:622` through `hybrid-search.ts:635`, `search-utils.ts:117` through `search-utils.ts:118`, `pipeline/stage1-candidate-gen.ts:113` through `pipeline/stage1-candidate-gen.ts:115`), and no `pathClass`/`rankingSignals` consumer. That supports "no deletion target" for duplicated path-class rerank in Spec Kit search.

Patch sketch:
1. Extend `ContextHandlerArgs.seeds`, `tool-schemas.ts`, and `tool-input-schemas.ts` with optional `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals`, and optionally `sourceRealpath`/`source_realpath`.
2. Normalize snake_case from the Python MCP payload to camelCase in the TypeScript handler. Preserve both only at input boundary; use one internal shape.
3. Extend `CocoIndexSeed` and `ArtifactRef` with `telemetry?: { rawScore?: number; pathClass?: string; rankingSignals?: string[]; sourceRealpath?: string }`.
4. Copy telemetry through `resolveCocoIndexSeed` and emit it on response anchors, but do not feed it into graph ranking/traversal.
5. Keep `dedupedAliases` and `uniqueResultCount` response-level for now. They belong to a whole CocoIndex response, not an individual seed; adding them to each seed would duplicate envelope metadata without a known consumer.

Falsifiable success criteria:
- `code_graph_context` accepts a seed with `provider:"cocoindex"`, `score`, `raw_score`, `path_class:"implementation"`, and `rankingSignals:["implementation_boost"]`.
- The resolved anchor includes the normalized telemetry object and still includes the existing `score`, `snippet`, `range`, `source`, and `provider` fields.
- Minimal existing CocoIndex seeds still validate and resolve unchanged.
- `mcp_server/lib/search` does not gain a path-class boost in this packet; any future ranking packet must prove it is not double-applying CocoIndex's upstream boost.

## Q-ARCH: intelligence-system seams (light touch)

The two seams still worth carrying into the final synthesis are:

1. **Authority vs recovered context**: context recovery can advise, but mutating delegation needs an explicit operator-approved authority token. Q-P0 is the proof case.
2. **Readiness signal vs remediation action**: status surfaces should report exactly what remediation is needed without performing it. Q-P2 is the proof case, and it generalizes beyond Code Graph to memory/search readiness surfaces.

The prior telemetry-vs-ranking seam is now mostly Q-OPP's local conclusion rather than a broader architectural packet: pass provenance first, prove ranking need later.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-005.md`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`

## Suggested focus for iteration 7
Close Q-P2 with a test-ready design for `getGraphReadinessSnapshot` and status assertions. Then do one final P0/P1 contradiction check against actual test files before marking them answered in strategy.
