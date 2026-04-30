# Iteration 009 — Final bridge contradiction check

## Status
- Iteration: 9 / 10
- Focus: verify no automatic CocoIndex-to-CodeGraph bridge contradicts the seed-fidelity recommendation; attach final success criteria for the two small architecture packets
- newInfoRatio: 0.27
- Convergence trajectory: P0/P1/P2 stay converged by reference; Q-OPP is now narrowed to additive seed metadata passthrough, and Q-ARCH is reduced to two falsifiable packets.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Converged; see iteration-005 through iteration-007. No new contradiction found this pass.

Final recommendation remains: add a command-owned Copilot target-authority preamble/helper shared by deep-research and deep-review. The helper should source approved write authority only from workflow-owned state, not from prompt body, bootstrap context, memory recovery, or `last_active_child_id`. Missing target authority plus a continuity-write prompt should force plan-only Gate 3 wording and perform no memory mutation.

Scope: small, centered on the Copilot prompt helper and executor tests. Success criteria from iteration-007 still hold: approved prompts carry the exact spec folder; omitted authority produces only a Gate 3 question/options response; bootstrap or prompt-body folders cannot override `targetAuthority.specFolder`.

## Q-P1: code-graph fast-fail not testable

Converged; see iteration-005 through iteration-007. No new contradiction found this pass.

Final recommendation remains: keep the mocked unit tests and add one deterministic degraded-graph sweep cell under an isolated `SPEC_KIT_DB_DIR`. The cell should cover empty/full-scan-required states routing to `fallbackDecision.nextTool:"code_graph_scan"`, readiness-error/unavailable states routing to `rg`, and fresh/selective-inline states emitting no `fallbackDecision`.

Scope: small-medium test harness work, not a production handler rewrite.

## Q-P2: file-watcher debounce

Converged; see iteration-006 and iteration-007. No new contradiction found this pass.

Final recommendation remains: add a read-only `getGraphReadinessSnapshot(rootDir)` and make `code_graph_status` report action-level readiness before changing `DEFAULT_DEBOUNCE_MS=2000`. Lowering debounce first would optimize an unproven latency hypothesis; the current issue is that status lacks the actionable `full_scan` vs `selective_reindex` distinction.

Scope: small helper extraction plus status tests. Do not call `ensureCodeGraphReady` from status, because that path includes cache/mutation behavior that status should not inherit.

## Q-OPP: CocoIndex fork telemetry leverage

Final contradiction check found no automatic CocoIndex search -> Code Graph context bridge that would require a broader `mcp_server/lib/search` rerank packet first. The live Code Graph path is still explicit seed input. `ContextHandlerArgs.seeds` accepts file/range/score/snippet/source-shaped seeds but no `raw_score`, `path_class`, or `rankingSignals` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:16` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:31`. The CocoIndex seed normalization copies only `score`, `snippet`, and `source` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:180`, and returned anchors still emit only source/provider/score/snippet/range at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:245` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:256`.

The lower-level types confirm the same metadata drop. `CocoIndexSeed` contains only provider/file/range/score/snippet/source at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:27`; `ArtifactRef` has no fork telemetry fields at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:49` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:64`; `resolveCocoIndexSeed` preserves only `score`, `snippet`, `range`, `provider`, and `source` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:95` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110`. The MCP input validator is also narrow: `codeGraphSeedSchema` allows `score` and `snippet`, but not raw score/path class/ranking signals, at `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464` through `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:482`.

The fork does provide useful telemetry. `QueryResult` carries `score`, `raw_score`, `path_class`, and `rankingSignals` at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:36`. Its bounded implementation-intent rerank adjusts `score` from `raw_score` using `path_class` at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:192` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:205`.

Recommended implementation shape, ranked:

1. **Seed-fidelity packet, recommended**: extend `ContextHandlerArgs.seeds`, `CocoIndexSeed`, `ArtifactRef`, and `codeGraphSeedSchema` with optional `rawScore`/`raw_score`, `pathClass`/`path_class`, and `rankingSignals`. Normalize Python wire names at the handler boundary, store TypeScript names internally, and emit the same metadata on `anchors[*]`. Do not change score, confidence, resolution, or anchor ordering.
2. **Response-level telemetry passthrough, second**: add caller-supplied `cocoindexTelemetry?: { dedupedAliases?: number; uniqueResultCount?: number }` only if a concrete composition caller is introduced. The current handler cannot infer response counters from individual seeds.
3. **Search-pipeline rerank, reject for now**: `mcp_server/lib/search` is not the current CocoIndex result path. Stage 1 names memory/vector/hybrid channels, not CocoIndex, at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17`, and `PipelineRow` has no CocoIndex telemetry fields at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:14` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:54`. Score-changing belongs to Stage 3 at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:11` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:14`, while Stage 4 explicitly cannot change scores at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:288` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:295`.

Scope estimate: small for shape 1, roughly `context.ts`, `seed-resolver.ts`, `tool-input-schemas.ts`, context handler tests, and docs. Shape 2 becomes small-medium only when a real composition caller exists. Shape 3 should wait for measured evidence; otherwise it duplicates the fork's `path_class` rerank.

Falsifiable success criteria for shape 1:
- A CocoIndex seed containing `raw_score`, `path_class`, and `rankingSignals` is accepted by schema validation.
- The returned `anchors[*]` preserves `rawScore`, `pathClass`, and `rankingSignals` with the same values.
- Existing seeds without the new fields still work.
- Anchor score, confidence, resolution, ordering, and `source` behavior are unchanged.

## Q-ARCH: intelligence-system seams (light touch)

Keep exactly two downstream packets.

1. **Authority token vs recovered context**. Mutating CLI delegation needs an explicit authority token; recovered memory, bootstrap hints, and graph active-child pointers are evidence only. Success criteria: prompts with authority mutate only the approved packet; prompts without authority ask Gate 3 and perform no writes; conflicting recovered context cannot override the approved target.

2. **Specialist telemetry vs composed retrieval ranking**. Specialist tools may emit richer telemetry without every downstream surface turning that metadata into scoring. Success criteria: CocoIndex telemetry is preserved through Code Graph anchors for traceability; no search/rerank score changes ship without a fixture or sweep proving benefit; any later `PipelineRow` import keeps metadata passthrough separate from Stage 3 score mutation. Stage 3 already preserves original non-score fields while updating score aliases at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:399` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:424`, so metadata-first adoption is compatible with the current search invariant.

Drop broad "intelligence-system seams" language from the final synthesis except as a parent label. The actionable units are the two packets above.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-008.md`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`

## Suggested focus for iteration 10

Final synthesis pass: mark Q-P0/Q-P1/Q-P2 as answered, close Q-OPP with the seed-fidelity packet as the recommended first implementation, and turn Q-ARCH into two short downstream packet briefs with success criteria and explicit non-goals.
