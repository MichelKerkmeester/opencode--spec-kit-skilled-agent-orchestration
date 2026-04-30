# Iteration 008 — CocoIndex telemetry handoff and scoped architecture seams

## Status
- Iteration: 8 / 10
- Focus: finalize Q-OPP integration shapes and narrow Q-ARCH to two downstream packets
- newInfoRatio: 0.46
- Convergence trajectory: P0/P1/P2 can move to answered unless iteration 9 finds contradiction; Q-OPP now has a concrete first packet and a deliberate non-adoption decision for `mcp_server/lib/search` reranking.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

See iteration-005 through iteration-007. No contradiction found in this pass. Keep the converged recommendation: command-owned target authority for Copilot prompt construction, sourced only from workflow state, with missing authority forcing a plan-only Gate 3 question.

## Q-P1: code-graph fast-fail not testable

See iteration-005 through iteration-007. No contradiction found in this pass. Keep the converged recommendation: preserve mocked unit coverage and add a deterministic degraded-graph sweep cell under an isolated `SPEC_KIT_DB_DIR`.

## Q-P2: file-watcher debounce

See iteration-007. No contradiction found in this pass. Keep the converged recommendation: add a read-only `getGraphReadinessSnapshot(rootDir)` status self-check before touching `DEFAULT_DEBOUNCE_MS=2000`.

## Q-OPP: CocoIndex fork telemetry leverage

Recommended winner: first add a Code Graph seed-fidelity packet, not a `mcp_server/lib/search` rerank packet.

The fork already emits the telemetry needed for a useful handoff. `QueryResult` carries `score`, `raw_score`, `path_class`, and `rankingSignals` in `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:36`. Response-level telemetry exists as `dedupedAliases` and `uniqueResultCount` in `query.py:21` through `query.py:37`, and the daemon preserves per-result fields at `daemon.py:282` through `daemon.py:300` plus response counters at `daemon.py:469` through `daemon.py:476`. The MCP server exposes the same fields at `server.py:42` through `server.py:68` and serializes them in `server.py:152` through `server.py:172`.

The current first downstream consumer drops most of that information. `code_graph_context` accepts CocoIndex seeds with `file`, `range`, `score`, `snippet`, and `source`, but no `raw_score`, `path_class`, or `rankingSignals` in `context.ts:16` through `context.ts:31`. It converts CocoIndex seeds at `context.ts:172` through `context.ts:180`, then returns anchors with `source`, `provider`, `score`, `snippet`, and `range` at `context.ts:245` through `context.ts:256`. The lower-level seed type has the same gap: `CocoIndexSeed` only contains `file`, `range`, `score`, `snippet`, and `source` at `seed-resolver.ts:19` through `seed-resolver.ts:27`, while `ArtifactRef` exposes no fork-specific fields at `seed-resolver.ts:49` through `seed-resolver.ts:64`. The external validator is also narrow: `tool-input-schemas.ts:464` through `tool-input-schemas.ts:482` accepts `score` and `snippet`, but not the new telemetry.

Implementation shape A, recommended for v1.0.3:
- Extend `ContextHandlerArgs.seeds`, `CocoIndexSeed`, `ArtifactRef`, and `codeGraphSeedSchema` with optional `rawScore?: number`, `pathClass?: string`, `rankingSignals?: string[]`.
- Normalize both wire spellings: accept Python/MCP names `raw_score`, `path_class`, `rankingSignals` at the handler boundary, and emit TypeScript-friendly anchor names `rawScore`, `pathClass`, `rankingSignals`.
- Preserve the fields through `resolveCocoIndexSeed` and the `anchors` response, without changing graph resolution confidence or score.
- Add/extend `code-graph-context-handler.vitest.ts`; the existing fidelity tests at `code-graph-context-handler.vitest.ts:176` through `code-graph-context-handler.vitest.ts:330` are the right target.

Scope estimate: small, roughly 4 TypeScript files plus tests. Risk is low because it is additive metadata passthrough.

Implementation shape B, response-level telemetry passthrough:
- Add optional `cocoindexTelemetry?: { dedupedAliases?: number; uniqueResultCount?: number }` to `code_graph_context` input and output metadata.
- Use it only when a caller composes direct CocoIndex search results into Code Graph seeds. The Code Graph handler cannot infer response-level counters from individual seeds, so the field must be caller-supplied.
- Keep this second priority unless an actual bridge currently calls CocoIndex then `code_graph_context` in one flow. The current code search found routing hints to use `mcp__cocoindex_code__search`, but the concrete Code Graph input path is still seed-based, not an automatic bridge.

Scope estimate: small-medium because it touches tool schema, handler, docs, and at least one composition caller if found.

Implementation shape C, deliberately rejected for now:
- Do not add a new `path_class` boost inside `mcp_server/lib/search`.
- Reason: that pipeline is not currently the CocoIndex result path. Stage 1 documents memory/vector/hybrid channels at `stage1-candidate-gen.ts:11` through `stage1-candidate-gen.ts:17`, and `PipelineRow` has no CocoIndex telemetry fields at `pipeline/types.ts:14` through `pipeline/types.ts:54`. More importantly, `stage3-rerank.ts:11` through `stage3-rerank.ts:14` says Stage 3 is the score-changing stage, while Stage 4 is explicitly no-score-change at `pipeline/types.ts:288` through `pipeline/types.ts:295`. A second `path_class` rerank in `lib/search` would duplicate the fork's bounded rerank from `query.py:196` through `query.py:205` without evidence it improves retrieval.

If a later composite retrieval bridge imports CocoIndex rows into `PipelineRow`, the safe rule is metadata first: carry `{ provider: "cocoindex", pathClass, rawScore, rankingSignals }` through rows for trace/explainability, but gate any score use behind a measured Stage 3 feature flag. Stage 3 already preserves original non-score fields while updating only score aliases at `stage3-rerank.ts:399` through `stage3-rerank.ts:424`, so metadata passthrough is compatible with the current invariant.

## Q-ARCH: intelligence-system seams (light touch)

Two downstream packet candidates are now specific enough.

1. **Authority token vs recovered context**: mutating CLI delegation should carry an explicit, operator-approved target authority token. Memory, bootstrap, and `last_active_child_id` can be evidence, but they must never become write authority. This is the P0 packet; keep it narrow to Copilot prompt construction and deep-loop prompt helpers.

2. **Specialist telemetry vs composed retrieval ranking**: specialist tools can emit rich telemetry without every downstream system turning it into score changes. The immediate packet is CocoIndex-to-Code-Graph seed fidelity. A later packet can evaluate composed retrieval ranking only after telemetry is visible in traces and test fixtures.

I would drop the earlier broad "intelligence-system seams" framing from the final synthesis. It is accurate but too wide. These two packets are small enough to implement and falsify.

## Sources read this iteration (delta from prior)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`

## Suggested focus for iteration 9

Convert strategy state: mark Q-P0/Q-P1/Q-P2 answered, keep Q-OPP open only for a final contradiction check on whether any automatic CocoIndex-to-CodeGraph bridge already exists, and draft final success criteria for the two Q-ARCH packet candidates.
