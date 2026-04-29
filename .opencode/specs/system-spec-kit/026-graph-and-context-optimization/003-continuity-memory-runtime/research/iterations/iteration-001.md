## Focus

Map the runtime surface area for the four child packets by turning packet-doc claims, git-lineage hints, and exact on-disk paths into a files x packets matrix ranked by audit risk.

## Actions Taken

1. Read the four child packets' `spec.md` and `implementation-summary.md`, plus the parent `context-index.md`, to capture each packet's declared scope, "Files to Change" surfaces, and packet-local runtime claims.
2. Probed structural readiness with `code_graph_status`; the graph is present but stale, so I used it only as a confidence hint and relied on direct file reads plus grep/lineage for ownership.
3. Ran packet-local token extraction across `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` for all four child packets; this produced the candidate runtime/module list and showed that packet `003` is mostly a coordination shell whose concrete runtime evidence lives in Gate D regression files.
4. Filtered recent git lineage under `.opencode/skill/system-spec-kit/mcp_server/`, `.opencode/skill/system-spec-kit/scripts/`, `.opencode/skill/sk-deep-research/`, and `.opencode/skill/sk-deep-review/` to isolate files with packet-specific markers such as `hook-state`, `session-stop`, `memory-save`, `SaveMode`, `post-save-review`, and Gate D names.
5. Resolved shorthand doc references to exact on-disk paths with targeted filesystem sweeps and sample-read the highest-risk owners (`hook-state.ts`, `session-stop.ts`, `memory-save.ts`, `post-save-review.ts`, and a Gate D regression suite) to confirm these are live runtime surfaces rather than packet-doc noise.

## Findings

Exact-path resolution confirmed 60 concrete runtime surfaces in scope. One shorthand from packet `004` docs, `file-writer.ts`, did not resolve to a current on-disk file during this orientation pass, so it is treated as a Q2 drift probe and is not counted in the matrix below.

| File Path | Packet (001/002/003/004/shared) | Kind (mcp-tool/script/shared-module/hook/CLI) | Risk bucket (H/M/L) | Reason |
| --- | --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | 001 | hook | H | Owns persisted Stop-hook state, producer metadata, and pending compact prime semantics. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | 001 | hook | H | Stop-path writer that snapshots transcript state, retargets spec folders, and spawns autosave. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts` | 001 | script | H | Replay harness is the packet's main proof surface for idempotency and out-of-bound write fencing. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts` | 001 | script | H | Direct regression coverage for the hook-state schema and persistence contract. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts` | 001 | script | H | Fastest executable surface for transcript replay and duplicate-ingest checks. |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | shared | CLI | H | Shared mutation entrypoint: packet `001` Stop-hook autosave calls it, while packets `002` and `004` cite it as the live save path. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | 002 | shared-module | H | Central save pipeline where multiple D1-D8 fixes, SaveMode logic, and reviewer wiring converged. |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | 002 | shared-module | H | D1-D8 reviewer surface and drift detector; packet docs cite multiple landed fixes here. |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | 002 | shared-module | H | Metadata rendering/ownership surface; packet docs tie D4/D7 repairs here. |
| `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | 002 | shared-module | H | Authored-decision precedence and lexical fallback logic are explicitly called out in packet closeout. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts` | 003 | script | H | Highest-signal Gate D reader-ready regression for resume routing and canonical continuity selection. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | 004 | mcp-tool | H | Primary `/memory:save` handler; planner-first default, blockers, routing, and fallback all converge here. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | 004 | shared-module | H | Shapes planner output, follow-up actions, and safety-critical response semantics. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts` | 004 | shared-module | H | Converts legality/template failures into planner blockers versus advisories. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` | 004 | shared-module | H | Record-identity surface for same-path authority, routed saves, and fallback parity. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | 004 | shared-module | H | Canonical mutation path preserved under planner-first fallback. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | 004 | shared-module | H | Explicitly trimmed behind opt-in flags; high risk for default-path behavior drift. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` | 004 | shared-module | H | Planner-first packet demotes auto-fix; this is the live quality-loop seam. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | 004 | shared-module | H | Hard legality/blocker gate that now must stay separate from advisories. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | 004 | shared-module | H | Scoped Tier 3 exception is one of the packet's main documented code/doc drift risks. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` | 004 | shared-module | H | Thin continuity upsert/rehydration surface reused by planner and fallback paths. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | 004 | script | H | Handler-level executable proof for the planner contract. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts` | 004 | script | H | Direct verification that default `/memory:save` is planner-only and non-mutating. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-fallback-fingerprint.vitest.ts` | 004 | script | H | Guards `POST_SAVE_FINGERPRINT` parity on the fallback path. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | 004 | script | H | End-to-end enforcement surface for planner, blockers, and follow-up behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts` | 001 | script | M | General Stop-hook coverage that complements replay-specific tests. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts` | 001 | script | M | Covers cache-token carry-forward and token snapshot behavior from packet `001`. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts` | 001 | script | M | Boundary test between Stop-hook producer metadata and later resume behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts` | 001 | script | M | Packet `001` names FTS hardening as a prerequisite; this is the visible proof surface. |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | 002 | shared-module | M | Session capture logic cited by the remediation docs for runtime save shaping. |
| `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts` | 002 | shared-module | M | Frontmatter migration path explicitly referenced in packet `002` lineage notes. |
| `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` | 002 | shared-module | M | Semantic signal shaping is cited as part of the remediation landing set. |
| `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts` | 002 | shared-module | M | D3/manual-trigger preservation and control-char guardrails land here. |
| `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` | 002 | shared-module | M | Shared truncation helper is one of the earliest D1/D8 repair anchors. |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | 002 | shared-module | M | Packet map keeps calling out the fast-path/normalizer seam as a follow-on risk. |
| `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts` | 002 | script | M | Executable coverage for the remediation reviewer logic. |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | shared | shared-module | M | Source TypeScript for the shared save/mutation entrypoint surfaced by packets `001`, `002`, and `004`. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts` | 003 | script | M | Gate D bootstrap regression coverage for canonical reader-ready routing. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts` | 003 | script | M | Intent-routing regression suite tied to Gate D reader behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts` | 003 | script | M | Reader pipeline contract test for the canonical search stack. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts` | 003 | script | M | Confirms reader-side quality gates after the continuity refactor. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts` | 003 | script | M | Reader/regression surface for reconsolidation behavior under Gate D. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts` | 003 | script | M | Session dedup is a core continuity-read invariant tracked in Gate D tests. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-memory-tiers.vitest.ts` | 003 | script | M | Memory-tier routing remains part of the Gate D reader-ready bundle. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-trigger-fast-match.vitest.ts` | 003 | script | M | Fast trigger matching is explicitly in the Gate D regression cluster. |
| `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts` | 004 | mcp-tool | M | Exposes follow-up freshness APIs (`refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`). |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | 004 | shared-module | M | Freshness metadata parser is explicitly decoupled from hot-path saves in packet `004`. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | 004 | shared-module | M | Post-insert enrichment is now opt-in and therefore a likely drift seam. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts` | 004 | script | M | Verifies dedup/ordering invariants under planner-first flow. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts` | 004 | script | M | Broad save-path regression suite beyond the minimal planner contract. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts` | 004 | script | M | Integration-level save-path verification. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` | 004 | script | M | Guards planner readability and response-shape regressions. |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | 004 | CLI | M | Packet `004` explicitly claims env/doc parity; this is the main env contract surface. |
| `.opencode/command/memory/save.md` | 004 | CLI | M | Operator-facing `/memory:save` command surface for planner-first behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | 001 | hook | L | Packet `001` keeps this read-only as a boundary check, not an active implementation seam. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` | 001 | script | L | SessionStart stays out of scope in packet `001`; this is mostly a guardrail check. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts` | 003 | script | L | Benchmark surface for Gate D, lower risk than correctness regressions. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts` | 003 | script | L | Performance probe, useful for orientation but not a primary correctness owner. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-trigger-fast-path.vitest.ts` | 003 | script | L | Benchmark-only trigger fast-path coverage. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts` | 003 | script | L | Benchmark-only memory-search harness for Gate D. |

## Questions Answered

None - orientation only.

## Questions Remaining

1. **Q1 Concurrency/race conditions in advisory-lock, sentinel-file, generation-bumping paths** - candidate files: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts`
2. **Q2 `/memory:save` planner-first routing table (code vs docs drift)** - candidate files: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
3. **Q3 Gates A-F enforcement (003-continuity-refactor-gates)** - candidate files: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts`
4. **Q4 D1-D8 remediation (landed in code vs only in docs/tests)** - candidate files: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
5. **Q5 Cache-warning hook transcript-identity + replay harness coverage** - candidate files: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts`
6. **Q6 Reducer / state rehydration schema agreement across children** - candidate files: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts`
7. **Q7 JSONL audit events emitted by live code vs documented events** - candidate files: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

## Next Focus

Walk Q1 first by tracing the Stop-hook write path and race boundaries through `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts`.
