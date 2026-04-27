# Iteration 010 — Final synthesis handoff

## Status
- Iteration: 10 / 10
- Focus: close the open questions into patch-sized recommendations, success criteria, and non-goals for synthesis
- newInfoRatio: 0.22
- Convergence trajectory: the loop is converged; this pass adds final implementation-shape ranking rather than new root evidence.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Answered; see iteration-005 through iteration-007. The final synthesis should keep this as Recommendation §1's P0 implementation packet, not as more research.

Refined implementation sketch:

1. Add a typed Copilot prompt helper beside `resolveCopilotPromptArg` in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:66` through `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:70`. Suggested shape: `buildCopilotPromptArg({ promptPath, prompt, targetAuthority })`, where `targetAuthority` is either `{ kind: "approved", specFolder }` or `{ kind: "missing", writeIntent: boolean }`.
2. Replace the deep-research call site at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:601` through `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:606`, before the existing `copilot -p ... --allow-all-tools --no-ask-user` dispatch at lines 617 through 625.
3. Replace the deep-review shell prompt-size branch at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:669` through `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:683` with the same Node helper path, so review and research loops cannot diverge.
4. Source approved authority only from workflow-owned resolved spec-folder state. Recovered memory, prompt body text, bootstrap summaries, and graph `last_active_child_id` stay advisory evidence.

Why this is the right boundary: Recommendation §1 says the failure is Copilot auto-selecting a folder from bootstrap context during `/memory:save` and mutating without operator authorization at `findings.md:113` through `findings.md:116`; the memory-save rewrite says the intended default is planner-first, stopping short of mutation, at `004-memory-save-rewrite/spec.md:56` through `004-memory-save-rewrite/spec.md:60`. Because Copilot is invoked with mutation authority in the deep-loop executor, the command-owned prompt wrapper is the load-bearing seam.

Ranked alternatives:

1. **Shared command-owned helper, recommended**: small patch, directly covers both small and large prompt forms, and works before Copilot can infer from context.
2. **Copilot global instructions only, reject as insufficient**: may improve ordinary sessions but does not bind non-interactive deep-loop dispatch.
3. **Memory-save handler-only hardening, secondary defense**: still useful, but it does not solve the immediate executor prompt-authority failure.

Success criteria:

- Approved prompts contain the exact workflow-approved spec folder.
- Missing authority plus continuity-write intent returns only the Gate 3 folder-selection question/options.
- Prompt-body folders, bootstrap folders, memory search hits, and `last_active_child_id` cannot override `targetAuthority.specFolder`.
- An I1-style "save the context for this conversation" replay performs no mutation when target authority is missing.

## Q-P1: code-graph fast-fail not testable

Answered; see iteration-006 through iteration-009. Final synthesis should map this directly to Recommendation §2.

Refined implementation sketch:

1. Keep the mocked fallback unit coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:120` through `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:174`. It already asserts no fallback for fresh reads, `rg` on readiness errors, and read-path full-scan boundary options.
2. Add one deterministic integration-style sweep under an isolated `SPEC_KIT_DB_DIR`, using the same environment-isolation pattern already present in the test corpus. The target behavior is not a production rewrite: it should force an empty/no-tracked-files graph without running `code_graph_scan`, then call `handleCodeGraphQuery` and assert `fallbackDecision.nextTool === "code_graph_scan"`.
3. Cover three buckets only: empty or broad stale state -> `code_graph_scan`; readiness exception -> `rg`; fresh or selective-inline state -> no `fallbackDecision`.

The production path is already explicit. `buildFallbackDecision` maps readiness errors to `rg` and full-scan-needed states to `code_graph_scan` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:791` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:807`, and the blocked payload carries that decision at lines 815 through 828. `ensure-ready.ts` creates the relevant full-scan states for empty graphs, no tracked files, HEAD changes, and broad stale sets at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:151` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:217`. Recommendation §2's defect was the stress harness, not the handler: v1.0.2 never exercised the degraded path because the graph was healthy after pre-flight recovery at `findings.md:118` through `findings.md:121`.

Ranked alternatives:

1. **Isolated DB sweep, recommended**: verifies the end-to-end weak-state contract without destabilizing production code.
2. **More mocked handler tests, useful but incomplete**: preserves unit confidence but does not answer the NEUTRAL stress result.
3. **Handler rewrite, reject**: current fallback semantics are already clear enough; changing them risks churn without evidence.

## Q-P2: file-watcher debounce

Answered; see iteration-006 through iteration-009. Final synthesis should translate Recommendation §3 from "tighten debounce or self-check" into "self-check first, debounce second if measured."

Refined implementation sketch:

1. Extract a read-only readiness snapshot helper from the detection part of `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`. The current `ensureCodeGraphReady` path has cache and cleanup behavior at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:373`; status should not inherit mutation or cache semantics.
2. Use that helper in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:225` so `code_graph_status` reports action-level readiness. Today it calls `getGraphFreshness`, then always builds a readiness block with `action: "none"` at lines 163 through 194, which hides the operational distinction between `full_scan` and `selective_reindex`.
3. Leave `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:49` at `DEFAULT_DEBOUNCE_MS = 2000` until status can prove whether drift remains. The watcher already waits for write stability at lines 251 through 253, coalesces per-file timers at lines 278 through 284, and listens to add/change/unlink at lines 433 through 440.

Why this wins: Recommendation §3 recorded a 4-hour staleness drift and offered either debounce tightening or a status self-check at `findings.md:123` through `findings.md:126`. The current source evidence points to a reporting gap first: status collapses readiness action, while `ensure-ready` can already distinguish empty/full-scan/selective states.

Success criteria:

- `code_graph_status` shows `readiness.action: "full_scan"` when a full scan is required.
- It shows `readiness.action: "selective_reindex"` for bounded stale files.
- It does not perform inline indexing, cleanup mutations, or full scans.
- Existing watcher debounce tests continue to pass with the 2000ms default.

## Q-OPP: CocoIndex fork telemetry leverage

Close as a small seed-fidelity packet. This is Recommendation §4-adjacent only in the sense that better terminology and telemetry should be visible to the model; it is not the vocabulary-sweep packet from `findings.md:128` through `findings.md:131`.

Recommended first implementation:

1. Extend `ContextHandlerArgs.seeds` in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:16` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:31` with optional `rawScore?: number`, `raw_score?: number`, `pathClass?: string`, `path_class?: string`, and `rankingSignals?: string[]`.
2. Normalize wire names in the CocoIndex seed branch at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:180`.
3. Extend `CocoIndexSeed` and `ArtifactRef` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:27` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:49` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:64`, then preserve fields in `resolveCocoIndexSeed` at lines 95 through 110.
4. Extend `codeGraphSeedSchema` at `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464` through `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:482`.
5. Emit those fields on returned anchors next to existing provider/score/snippet/range fields at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:245` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:256`.

The upstream fork has enough telemetry to preserve. `QueryResult` carries `score`, `raw_score`, `path_class`, and `rankingSignals` at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:36`. The query layer stores response counters `dedupedAliases` and `uniqueResultCount` at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:21` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:37`, and applies the bounded implementation-intent rerank at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:192` through `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:216`.

Ranked alternatives:

1. **Per-seed telemetry passthrough, recommended**: small, testable, and preserves traceability without changing ranking.
2. **Caller-supplied response telemetry, second**: add `cocoindexTelemetry?: { dedupedAliases?: number; uniqueResultCount?: number }` only after a real composition caller passes the whole CocoIndex response envelope into Code Graph context.
3. **`mcp_server/lib/search` rerank, reject for now**: prior iterations found that Spec Kit search is not the current CocoIndex result path. Duplicating `path_class` rerank would use the fork's scoring signal twice without a fixture proving retrieval improvement.

Success criteria:

- A seed with `raw_score`, `path_class`, and `rankingSignals` passes schema validation.
- Returned anchors preserve `rawScore`, `pathClass`, and `rankingSignals`.
- Seeds without telemetry keep current behavior.
- Anchor score, confidence, resolution, ordering, and source behavior are unchanged.

## Q-ARCH: intelligence-system seams (light touch)

Close with exactly two downstream briefs. Do not let this become a broad architecture theme.

1. **Authority token vs recovered context**: mutating CLI delegation needs an explicit authority token. Recovered context can suggest likely folders, but cannot approve writes. This brief owns the P0 Copilot patch above.
   - Success: approved authority mutates only the named packet; missing authority asks Gate 3; conflicting recovered context cannot override the approved target.
   - Non-goal: teaching every model to remember Gate 3 through prose alone.

2. **Specialist telemetry vs composed retrieval ranking**: specialist tools may emit richer signals without downstream systems immediately turning them into score changes. This brief owns the CocoIndex seed-fidelity patch above.
   - Success: CocoIndex telemetry survives Code Graph expansion for explanation and audit; no search or rerank score change ships without a measured fixture or sweep.
   - Non-goal: importing CocoIndex into the memory search pipeline or changing Stage 3 reranking during this packet.

Recommendation §5, the higher-N variance pass at `findings.md:133` through `findings.md:136`, should remain a separate evaluation packet. It is not a blocker for these two code packets, but it should gate any claim that the stress-remediation system is durably closed.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-009.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`

## Suggested focus for iteration 11

No iteration 11 recommended. Synthesize into `research.md`, mark Q-P0/Q-P1/Q-P2/Q-OPP/Q-ARCH answered, and open implementation packets for: Copilot target authority, degraded graph harness, status readiness snapshot, and CocoIndex seed telemetry passthrough.
