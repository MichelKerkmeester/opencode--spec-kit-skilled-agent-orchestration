# Iteration 14 — Domain 1: Silent Fail-Open Patterns (4/10)

## Investigation Thread
I re-read the five target runtime seams against prior iterations 001-011 and the Phase 015 review so this pass only captured residual fail-open paths that were still undocumented. The main angle was second-order truth loss: branches where the runtime does not crash, but still tells callers a step was successful, complete, or empty when the underlying work was skipped, partially applied, or filtered by an invalid input.

## Findings

### Finding R14-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `175-193, 257-268, 274-276`
- **Severity:** P1
- **Description:** Producer-metadata failure also fail-opens the incremental transcript cursor. Trigger: transcript parsing succeeds, but `buildProducerMetadata(...)` or the subsequent `recordStateUpdate(...)` throws. Caller perception: the stop hook parsed the new transcript segment once and advanced the persisted offset. Reality: `storeTokenSnapshot()` already rewrote `metrics.lastTranscriptOffset` back to `0`, the catch block swallows the later failure, and the real `newOffset` never becomes durable.
- **Evidence:** `storeTokenSnapshot()` writes `lastTranscriptOffset: 0` before producer metadata is built (`session-stop.ts:175-193`). The happy-path offset advance and metadata write only happen later inside `recordStateUpdate(... lastTranscriptOffset: newOffset, producerMetadata: ... )` (`session-stop.ts:257-268`). Any exception in that block is absorbed by the broad `catch` at `274-276`. The replay suite only locks in the all-success contract: `tests/hook-session-stop-replay.vitest.ts:14-56` expects `producerMetadataWritten === true` and stable second-run totals, but never simulates metadata-construction failure.
- **Downstream Impact:** Later stop events can re-parse the same transcript segment, re-run spec-folder detection and autosave off stale cursor state, and violate the replay-stability behavior the direct harness only proves in the success case.

### Finding R14-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `26-39, 442-555`
- **Severity:** P2
- **Description:** Unsupported or mistyped `edgeType` filters fail open into success-shaped empty graph answers. Trigger: caller passes any non-empty `edgeType` string that does not correspond to stored edge rows. Caller perception: the queried symbol simply has no matching callers/importers. Reality: the handler uppercases and trusts the filter, then returns `status: "ok"` with an empty edge set instead of surfacing that the filter itself was invalid.
- **Evidence:** `resolveRequestedEdgeType()` accepts any trimmed string and normalizes it with `.toUpperCase()` (`query.ts:26-29`). The one-hop query paths pass that value straight into the DB edge filter and still serialize `status: 'ok'` (`query.ts:442-555`). `queryEdgesFrom()` / `queryEdgesTo()` just append `AND edge_type = ?` with no validation layer (`lib/code-graph/code-graph-db.ts:494-521`). Direct tests only cover valid normalized filters like `imports` and `overrides`, not a bogus edge type that should be rejected (`tests/code-graph-query-handler.vitest.ts:66-107`).
- **Downstream Impact:** Agents and operator tooling can get false-negative structural answers from `code_graph_query` when they supply an ad hoc or misspelled edge filter, then treat the empty result as authoritative graph truth.

### Finding R14-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `94-113`
- **Severity:** P1
- **Description:** Partial causal-link failures are normalized into successful enrichment. Trigger: `processCausalLinks()` returns unresolved references or per-edge errors without throwing. Caller perception: causal-link enrichment succeeded because `enrichmentStatus.causalLinks` is `true` and no generic partial-enrichment warning appears. Reality: the causal graph is incomplete, but the post-insert layer only logs and does not propagate the partial failure.
- **Evidence:** `runPostInsertEnrichment()` sets `enrichmentStatus.causalLinks = true` immediately after any non-throwing `processCausalLinks(...)` call (`post-insert.ts:97-100`), and only emits a log for unresolved references (`post-insert.ts:103-105`). The processor itself explicitly returns partial-failure state through `unresolved` and `errors` arrays (`handlers/causal-links-processor.ts:345-420`). The response layer only warns when a status flag is `false` (`handlers/save/response-builder.ts:315-321`). The helper tests prove unresolved and mixed-result paths exist (`tests/handler-helpers.vitest.ts:680-710`), while the dedicated post-insert test only exercises planner-first deferral (`tests/post-insert-deferred.vitest.ts:11-48`).
- **Downstream Impact:** `memory_save` responses can look causally enriched even when some lineage edges were never written, which weakens later `memory_drift_why`, causal traversal, and graph-boosted retrieval without surfacing a user-visible warning.

### Finding R14-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `159-177`
- **Severity:** P2
- **Description:** Entity-linking density-guard skips are also normalized into success. Trigger: `runEntityLinkingForMemory()` returns `skippedByDensityGuard: true` because the graph is already above the configured edge-density threshold. Caller perception: cross-document linking ran and found nothing actionable. Reality: no linking work was allowed to run, but the post-insert status still marks `entityLinking` as successful.
- **Evidence:** The entity-linking branch logs the density-guard skip but still sets `enrichmentStatus.entityLinking = true` unconditionally afterward (`post-insert.ts:161-177`). The entity-linker returns an explicit skipped result with `skippedByDensityGuard`, `edgeDensity`, and `densityThreshold` instead of throwing (`lib/search/entity-linker.ts:1111-1125`). Direct suites lock in that skip path (`tests/entity-linker.vitest.ts:539-541,754-756`; `tests/deferred-features-integration.vitest.ts:316-329`), but the post-insert wrapper does not forward that nuance into its status model.
- **Downstream Impact:** Dense-graph packets can silently stop generating incremental entity links while `memory_save` still reports healthy enrichment, which hides one of the few signals operators could use to explain missing cross-document link growth.

## Novel Insights
- The still-unreported fail-open paths were mostly **second-order effects**, not the already-documented top-level warning branches. The strongest example is `session-stop.ts`: the missing producer-metadata write does not just drop metadata, it also leaves the incremental cursor in a replayable state.
- `post-insert.ts` is even more status-collapsed than earlier iterations showed. Prior work already covered deferred mode and helper no-ops for summaries/graph lifecycle; this pass found the same truth-loss pattern in causal-link partial failures and entity-link density-guard skips.
- After re-reading the source and prior writeups, I did **not** find additional unique fail-open paths in `graph-metadata-parser.ts:223-255` or `reconsolidation-bridge.ts:283-294` beyond Iteration 11's legacy-fallback and scope-filter disappearance findings. The targeted `session-stop.ts:85-101` autosave-success bug also remains the same one already captured by Phase 015 iteration 010.

## Next Investigation Angle
Trace the higher-level consumers that flatten these degraded states into final tool responses: `handlers/save/response-builder.ts`, `handlers/memory-save.ts`, and any startup/resume readers that trust `session-stop` cursor state. The next pass should ask which APIs preserve these low-level degradation markers and which ones erase them completely.
