# Iteration 001 — Initial Grounding

## Status
- Iteration: 1 / 10
- Focus: ground 5 questions in real artifacts; surface 2-3 candidate fix approaches per question
- newInfoRatio: 0.74
- Convergence trajectory: High initial coverage; Q-P0 and Q-OPP are well grounded, while Q-P1 and Q-P2 need one deeper implementation/test-design pass before convergence.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

### Evidence cited
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:19]: I1/cli-copilot is the worst cell and still treats "save the context" as authorization to mutate without Gate 3.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:49]: I1 comparison says codex/opencode honored Gate 3 while copilot mutated the wrong spec folder.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:101]: Copilot selected `004-retroactive-phase-parent-migration` from bootstrap context without asking.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:113]: Recommendation #1 calls for tightening planner-first default or adding explicit Gate 3 at CLI entry.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md:5]: Correctness score is 0 because copilot mutated a real packet without authorization.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md:8]: Hallucination score is 0 because no conversation context legitimately mapped to the selected folder.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md:25]: Narrative identifies the planner-first contract gap and autonomous target selection from bootstrap context.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-codex-1/score.md:5]: Codex asked the 5-option Gate 3 spec folder question.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-opencode-1/score.md:5]: Opencode asked a Gate 3 spec folder question and did not mutate.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md:60]: Planner-first default returns structured planner output; full-auto is explicit fallback.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md:105]: In-scope default path computes route and legality data but mutates no files.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md:161]: REQ-001 requires default `/memory:save` to be planner-first and non-mutating.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md:186]: Planner output must not expose unsafe file targets.

### Root cause hypothesis
The failure appears to be a boundary mismatch between copilot's natural-language "save context" interpretation and the Spec Kit planner-first contract. The correct behaviors in codex and opencode show the contract itself is unambiguous: missing target authority must stop at Gate 3. Copilot instead treats bootstrap-discovered context as sufficient target authority, then invokes save/index surfaces. The minimal fix likely belongs at the copilot CLI adapter or prompt/command contract boundary, before any memory tool can observe an inferred target.

### Candidate fix approaches (2-3)
1. **CLI preflight hard stop**: Add a copilot-side `/memory:save` preflight that detects missing operator-selected spec folder and emits Gate 3 choices before tool dispatch. Trade-offs: strongest safety and smallest behavioral surface; may duplicate command-layer planner checks.
2. **Planner-first tool refusal**: Harden the memory save handler so inferred bootstrap targets are marked unauthorized unless the request carries an explicit operator target or `SPECKIT_SAVE_PLANNER_MODE=full-auto`. Trade-offs: protects every caller; risks changing full-auto/scripted flows unless target-authority metadata is precise.
3. **Bootstrap-context quarantine**: Tag startup/resume spec pointers as "context only" and forbid them as save targets without confirmation. Trade-offs: directly addresses observed wrong-target origin; narrower than a full planner-first enforcement fix.

### Open sub-questions for next iteration
- Where does cli-copilot map natural-language "save the context" to MCP/tool execution?
- Does copilot pass any structured target-authority metadata that the save handler can inspect?
- Are codex/opencode correct because of CLI prompt text, command docs, or runtime handler enforcement?

## Q-P1: code-graph fast-fail not testable

### Evidence cited
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:73]: Packet 005 stayed NEUTRAL because Q1 cells did not exercise weak-state `fallbackDecision`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:87]: Re-test is recommended once graph state can be deterministically degraded.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:118]: Recommendation #2 asks for a degraded-graph sub-cell that captures `fallbackDecision.nextTool`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md:56]: Original problem was a blocked graph read with no strong machine-readable route to `code_graph_scan`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md:68]: Scope covers all readiness states, including empty and stale full-scan states.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md:96]: REQ-001 expects `fallbackDecision.nextTool:"code_graph_scan"` for empty graph reads.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md:97]: REQ-002 defines the routing matrix.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787]: Read paths block when readiness action is `full_scan` and inline indexing did not occur.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:791]: `buildFallbackDecision` maps error/full-scan readiness into next-tool decisions.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:799]: Full-scan states return `nextTool:"code_graph_scan"` and `retryAfter:"scan_complete"`.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089]: `code_graph_query` calls `ensureCodeGraphReady` with `allowInlineFullScan:false`.
- [.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76]: Unit test already covers empty graph routing to `code_graph_scan`.
- [.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:92]: Unit test covers stale full-scan routing.
- [.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:162]: Unit test preserves the read-path full-scan boundary.

### Root cause hypothesis
The implementation and mocked unit harness exist, so the gap is not pure testability. The stress harness failed to prove packet 005 because pre-flight recovered the graph before Q1 ran, leaving the weak readiness branch unreachable in live CLI execution. The missing artifact is an end-to-end degraded-state fixture or scenario switch that can force `ensureCodeGraphReady` into empty/stale-full-scan without letting pre-flight or selective self-heal repair it first.

### Candidate fix approaches (2-3)
1. **Degraded DB fixture cell**: Add a v1.0.3 Q1 sub-cell that moves/deletes the code-graph DB or points at an empty temp DB, then dispatches Q1 and scores `fallbackDecision`. Trade-offs: closest to observed failure; must avoid corrupting the real workspace DB.
2. **Readiness dependency injection harness**: Add a CLI stress option that mocks or shims `ensureCodeGraphReady` into `empty` / `stale full_scan` for one process. Trade-offs: deterministic and safe; less end-to-end than filesystem/DB degradation.
3. **Status-driven stale fixture**: Modify tracked files above the selective threshold or spoof metadata so `detectState` returns `full_scan`, then confirm query blocks before any scan. Trade-offs: exercises real readiness math; more brittle because watcher/self-heal may race.

### Open sub-questions for next iteration
- Which code-graph DB path can be safely swapped for an isolated stress run?
- Can the daemon be launched with a temp workspace or env override for graph persistence?
- Should the proof target `code_graph_query` only, or both `code_graph_query` and `code_graph_context`?

## Q-P2: file-watcher debounce

### Evidence cited
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:20]: Pre-flight found code-graph file-watcher drift after rapid changes.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:97]: Drift followed carve-out, renumber, scaffold, and doc tidy changes; one `code_graph_scan` recovered.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:123]: Recommendation #3 says tighten debounce or add freshness self-check.
- [.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:49]: Default watcher debounce is 2000ms.
- [.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:214]: `startFileWatcher` uses configured debounce or the default.
- [.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:251]: Chokidar uses `awaitWriteFinish` with 1000ms stability threshold.
- [.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:278]: Existing per-file debounce timers are cleared on subsequent events.
- [.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:283]: Reindex operation fires only after the debounce timeout.
- [.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:299]: `scheduleReindex` can force reindex on selected events.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:159]: `code_graph_status` is currently a freshness/reporting handler.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:163]: Status calls `getGraphFreshness`, not `ensureCodeGraphReady`.
- [.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:189]: Status builds a readiness block with `action:"none"`, so it reports but does not self-heal.

### Root cause hypothesis
The watcher stacks chokidar's 1000ms write-stability delay with a 2000ms per-file debounce, then hashes and skips unchanged content. That should smooth ordinary writes, but the observed drift involved rapid multi-file structural changes and spec moves where missed events or delayed reindex can leave status stale for hours. Lowering the debounce may reduce lag, but the more durable fix is probably a status/read-path freshness self-check that detects persisted staleness and either self-heals selectively or tells the operator exactly what to run.

### Candidate fix approaches (2-3)
1. **Lower watcher debounce**: Reduce `DEFAULT_DEBOUNCE_MS` from 2000ms to a smaller value and add a test for burst writes. Trade-offs: simple and likely improves latency; may increase reindex churn during large edits.
2. **Status freshness self-check**: Make `code_graph_status` call readiness logic or a lightweight drift detector and emit/perform bounded self-heal when stale. Trade-offs: catches watcher misses; status may become less purely observational.
3. **Both with telemetry guardrails**: Lower debounce modestly and add status fields such as last watcher event, pending timers, and stale duration threshold. Trade-offs: best diagnostics; larger change surface than the P2 may justify.

### Open sub-questions for next iteration
- Is the drift caused by file-watcher debounce, status not self-healing, symlink/move events, or daemon lifecycle?
- Does a test already cover rename/delete/burst scenarios for `.opencode/specs/**`?
- What staleness threshold should trigger self-check without making status expensive?

## Q-OPP: CocoIndex fork telemetry leverage

### Evidence cited
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:44]: S2 proved fork telemetry active, including `dedupedAliases`, `uniqueResultCount`, and `path_class`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:72]: Packet 004 verdict says fork telemetry surfaced in S2 opencode cells.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:105]: Live telemetry included `dedupedAliases:26`, `uniqueResultCount:10`, `path_class`, and `raw_score`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:152]: v1.0.3 rubric may add a dedicated "Fork-Telemetry Surfaced" dimension.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md:60]: Purpose is canonical identity, over-fetch/dedup, and path-class rerank for code-first search.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md:71]: Query path must fetch `limit * 4`, dedup, prefer canonical display path, and rerank by `path_class`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md:73]: Query telemetry should surface `dedupedAliases`, `uniqueResultCount`, and `rankingSignals`.
- [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md:113]: Implementation-intent rerank uses +0.05 implementation boost and -0.05 docs/spec penalty.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:52]: CocoIndex fork defines `classify_path`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:219]: Indexer stores `source_realpath`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:241]: Indexer stores `content_hash`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:242]: Indexer stores `path_class`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:158]: Query dedups by `source_realpath` or content hash.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:192]: Query preserves `raw_score` separately from reranked `score`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:196]: Query applies implementation-intent reranking based on `path_class`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:246]: Query returns response-level `dedupedAliases` and `uniqueResultCount`.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:282]: Query over-fetches `limit + offset` times 4.
- [.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:152]: Server maps fork fields into MCP search responses.
- [.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1230]: Hybrid search proceeds to local fusion when lists exist.
- [.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1250]: Hybrid search classifies intent for adaptive fusion, independently of CocoIndex fork telemetry.
- [.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1261]: Hybrid search computes adaptive fusion weights but does not consume `path_class`.

### Explicit grep results for 7 fork fields in `mcp_server/lib/search/*.ts`
- `path_class`: no hits.
- `dedupedAliases`: no hits.
- `uniqueResultCount`: no hits.
- `rankingSignals`: no hits.
- `source_realpath`: no hits.
- `content_hash`: hits only in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`; these are memory vector-index fields, not CocoIndex response consumption.
- `raw_score`: no hits.

### Root cause hypothesis
The CocoIndex fork already computes the right telemetry and exposes it through its own MCP server, but the Spec Kit search stack does not appear to consume those fork fields downstream. That means telemetry is model-visible when the CocoIndex tool is called directly, but local hybrid search, fusion/rerank, and scoring/rubric surfaces cannot yet use `dedupedAliases`, `path_class`, `rankingSignals`, or raw-vs-reranked score. `path_class` rerank is not duplicated upstream in `mcp_server/lib/search`; it is currently fork-local.

### Candidate fix approaches (2-3)
1. **Telemetry passthrough into search envelopes**: Add optional fork telemetry fields to search result types and response policy metadata. Trade-offs: low-risk visibility; does not itself change ranking.
2. **Hybrid fusion feature adoption**: Consume `path_class` and `rankingSignals` in local fusion or explainability so implementation-intent paths get consistent treatment across CocoIndex and memory search. Trade-offs: improves downstream quality; risks double-boosting if direct CocoIndex scores are already reranked.
3. **Rubric/instrumentation-only adoption**: Keep ranking untouched and add scorecard fields for dedup rate, path-class mix, raw-vs-adjusted delta, and telemetry surfaced. Trade-offs: safest for v1.0.3 evaluation; defers product-quality benefits.

### Open sub-questions for next iteration
- Which downstream surface first receives CocoIndex MCP results inside opencode: a direct tool bridge, hybrid search, or model-only visible output?
- Should `path_class` be used as a ranking feature downstream, or only as an explanation field to avoid double rerank?
- Is `.cocoindex_code/settings.yml` intentionally excluding `.opencode/specs/**`, while packet 004 originally said keep `.opencode/specs`?

## Q-ARCH: intelligence-system seams (light touch)

### Candidates surfaced (1-2 max, one-line "why now" each)
- **Target-authority seam for mutating tools**: Q-P0 shows planner-first intent can be lost between natural-language CLI handling, bootstrap context, and mutation-capable MCP tools.
- **Telemetry-contract seam between specialist indexes and general search**: Q-OPP shows fork-local intelligence exists but is not yet a typed downstream contract for hybrid search, scoring, or explainability.

## Sources read this iteration
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-codex-1/score.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/I1/cli-opencode-1/score.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/protocol.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.cocoindex_code/settings.yml`

## Suggested focus for iteration 002
Focus deepest on Q-P0 and Q-P1. Q-P0 is the only P0 and needs origin tracing through cli-copilot's save routing before fixes can be scoped. Q-P1 is closer to implementation than expected because the unit harness exists; iteration 002 should design the deterministic degraded end-to-end stress cell and identify the safest graph DB isolation mechanism. Q-OPP can be a side pass to map where direct CocoIndex MCP output enters opencode response construction.
