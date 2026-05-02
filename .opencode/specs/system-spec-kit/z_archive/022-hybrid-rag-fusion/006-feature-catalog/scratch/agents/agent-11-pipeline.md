● skill(sk-code-review)

I’m loading the review rubric and inventorying the 22 catalog files first, then I’ll cross-check each one against both `mcp_server` and `scripts` so the final report is evidence-based rather than just keyword matching.

● Read README.md
  │ .agents/skills/sk-code-review/README.md
  └ 79 lines read

● Read review_core.md
  │ .agents/skills/sk-code-review/references/review_core.md
  └ 98 lines read

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code-review/references/review_ux_single_pass.md
  └ 82 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code-review/references/security_checklist.md
  └ 206 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code-review/references/code_quality_checklist.md
  └ 162 lines read

● Search (glob)
  │ "*.md" in .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture
  └ 22 files found

● Run skill advisor and create session plan (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture and compare
  │ described features against .opencode/skill/system-spec-kit/mcp_server and
  │ .opencode/skill/system-spec-kit/scripts" --threshold 0.8 && cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/14b9af08-7520-41ba-923f-f769cc6386a6/plan.md'…
  └ 52 lines...

● skill(sk-code-opencode)

I’ve got the inventory and review criteria loaded. Next I’m batching the catalog into a few analysis passes so I can compare every feature claim against both code trees with actual code citations, not just filenames.

● Explore Review batch A
  └ Agent started in background with agent_id: pipeline-batch-a. You can use read...

● Read universal_patterns.md
  │ .agents/skills/sk-code-opencode/references/shared/universal_patterns.md
  └ 571 lines read

● Read alignment_verification_automation.md
  │ .agents/skills/sk-code-opencode/references/shared/alignment_verification_automation.md
  └ 62 lines read

● Explore Review batch B
  └ Agent started in background with agent_id: pipeline-batch-b. You can use read...

● Explore Review batch C
  └ Agent started in background with agent_id: pipeline-batch-c. You can use read...

● Explore Review batch D
  └ Agent started in background with agent_id: pipeline-batch-d. You can use read...

The batch reviewers are running now. While they work, I’m going to spot-check likely drift areas myself so I can validate any high-severity calls before I hand you the final matrix.

● Listing background agents

● Summarize all pipeline feature docs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture')
  │ for path in sorted(base.glob('*.md')):
  │ text = path.read_text()…
  └ 99 lines...

● search four-stage pipeline refactor memory ingestion pipeline chunk aggregation ordering template…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Read (Explore agent — Review batch A)
  └ Running

● Read (Explore agent — Review batch B)
  └ Running

● Read (Explore agent — Review batch C)
  └ Running

● Read (Explore agent — Review batch D)
  └ Running

I haven’t got the batch summaries back yet, so I’m sampling representative docs directly to understand how these catalog entries describe “current reality.” That makes it easier to separate true implementation drift from wording drift once the batch results land.

● Read 01-4-stage-pipeline-refactor.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-re
  │ factor.md
  └ 226 lines read

● Read 11-pipeline-and-mutation-hardening.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutati
  │ on-hardening.md
  └ 89 lines read

● Read 17-cross-process-db-hot-rebinding.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-ho
  │ t-rebinding.md
  └ 44 lines read

● Read 22-lineage-state-active-projection-and-asof-resolution.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-lineage-state-activ
  │ e-projection-and-asof-resolution.md
  └ 55 lines read

● Read 18-atomic-write-then-index-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-i
  │ ndex-api.md
  └ 48 lines read

● Search (grep)
  │ "constitutionalInjected|resolveEffectiveScore|verifyScoreInvariant|postSearchPipeline|resolveBas
  │ eScore" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "DB_UPDATED_FILE|checkDatabaseUpdated|reinitializeDatabase|initializeDb|lastDbCheck|embedding
  │ model readiness|constitutional cache" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "resolveLineageStateAsOf|active projection|lineage|asOf|appendLineage" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "pending file|pendingPath|dbCommitted|retry.*index|rename|atomicSaveMemory|memory_save" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I found a few likely hotspots already: `db-state.ts`, `memory-save.ts`, and `lineage-state.ts` are clearly involved. I’m reading those directly now to verify whether the catalog wording matches the actual runtime behavior or overstates it.

● Read db-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
  └ L1:260 (260 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1:320 (320 lines read)

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L1:320 (320 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:260 (260 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:260 (259 lines read)

● Search (grep)
  │ "lineage-state|memory_lineage|active_memory_projection|asOf|recordLineageVersion|createAppendOnl
  │ yMemoryRecord" in *.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "DB_UPDATED_FILE|checkDatabaseUpdated|reinitializeDatabase|db-state|initializeDb" in
  │ *.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ 32 lines found

● Search (grep)
  │ "4-stage|stage1|stage2|stage3|stage4|orchestrator|resolveEffectiveScore|verifyScoreInvariant" in
  │ *.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ 6 lines found

● Search (grep)
  │ "pendingPath|dbCommitted|atomicSaveMemory|memory-save|transaction-manager" in *.{ts,js,py,sh}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

One batch just finished, so I’m pulling that report now and checking whether the other batches are close behind. Once I’ve got them all, I’ll normalize the statuses and severity counts into one final table.

● Read (Explore agent — Review batch C)
  └ idle

● Listing background agents

Batch C looks clean so far: those six docs appear to match the current code pretty closely. I’m waiting on the remaining three batches now, then I’ll sanity-check any `MISALIGNED` or `PARTIAL` calls before I finalize the full catalog report.

● Read 14-dynamic-server-instructions-at-mcp-initialization.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-inst
  │ ructions-at-mcp-initialization.md
  └ 1 line read

● Read 15-warm-server-daemon-mode.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-
  │ mode.md
  └ 46 lines read

● Read 13-strict-zod-schema-validation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-v
  │ alidation.md
  └ 42 lines read

● Read 16-backend-storage-adapter-abstraction.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-ada
  │ pter-abstraction.md
  └ 46 lines read

● Read (Explore agent — Review batch A)
  └ idle

● Listing background agents

Batch A also came back clean. The interesting part now is whether batches B and D find any genuine drift in the remediation/backfill docs, because those are usually where catalogs over-claim relative to the live code.

● Read (Explore agent — Review batch B)
  └ idle

● Read (Explore agent — Review batch D)
  └ idle

Reviewed all 22 files against both `.opencode/skill/system-spec-kit/mcp_server/` and `.opencode/skill/system-spec-kit/scripts/`.

`01-4-stage-pipeline-refactor.md | ALIGNED |` 4-stage pipeline exists in `mcp_server/lib/search/pipeline/{stage1-candidate-gen,stage2-fusion,stage3-rerank,stage4-filter,orchestrator,types}.ts`; Stage 4 immutability is enforced by `Stage4ReadonlyRow` + `verifyScoreInvariant()`. No competing legacy runtime path found in `scripts`.

`02-mpab-chunk-to-memory-aggregation.md | ALIGNED |` MPAB aggregation is implemented in `mcp_server/lib/scoring/mpab-aggregation.ts` and wired through Stage 3; tests exist in `mcp_server/tests/mpab-aggregation.vitest.ts`. No conflicting scripts implementation found.

`03-chunk-ordering-preservation.md | ALIGNED |` Chunk reassembly preserves document order via `chunkIndex`/`chunk_index` handling in `mcp_server/lib/search/chunk-reassembly.ts` and related MPAB logic/tests. No scripts drift found.

`04-template-anchor-optimization.md | ALIGNED |` Anchor parsing/annotation is implemented in `mcp_server/lib/search/anchor-metadata.ts` and fed into pipeline enrichment; behavior is annotation-only, not score mutation. No scripts-side contradiction found.

`05-validation-signals-as-retrieval-metadata.md | ALIGNED |` Validation metadata extraction exists in `mcp_server/lib/search/validation-metadata.ts` and bounded multiplier logic in `stage2-fusion.ts`; tests cover it. No conflicting scripts behavior found.

`06-learned-relevance-feedback.md | ALIGNED |` Learned feedback is implemented in `mcp_server/lib/search/learned-feedback.ts` with denylist/TTL/shadow-period safeguards and tests. Scripts contain only supporting tests/reference usage, no mismatch.

`07-search-pipeline-safety.md | ALIGNED |` Safety fixes are present: query token sanitization in `bm25-index.ts`/`sqlite-fts.ts`, channel quality floor in `channel-representation.ts`, and Stage 1 summary quality filtering. Tests back all three; no scripts drift found.

`08-performance-improvements.md | ALIGNED |` Claimed optimizations are present across `tfidf-summarizer.ts`, `memory-summaries.ts`, `mutation-ledger.ts`, `entity-linker.ts`, `causal-edges.ts`, and `spec-folder-hierarchy.ts`; tests exist. No scripts contradiction found.

`09-activation-window-persistence.md | ALIGNED |` Activation timestamp persistence is implemented in `mcp_server/lib/validation/save-quality-gate.ts` and covered by tests. No conflicting scripts implementation found.

`10-legacy-v1-pipeline-removal.md | ALIGNED |` Current runtime uses only the 4-stage pipeline; no active `isPipelineV2Enabled()`/`SPECKIT_PIPELINE_V2` runtime path was found. Scripts only reference the current path in tests/tooling.

`11-pipeline-and-mutation-hardening.md | ALIGNED |` Schema exposure, constitutional passthrough, embedding caching, stemmer fix, full-content re-embedding, delete cleanup, BM25 cleanup, atomic-save error tracking, and preflight code propagation all exist in cited `mcp_server` files. Scripts contain only supporting test references.

`12-dbpath-extraction-and-import-standardization.md | ALIGNED |` Shared DB path/config extraction exists in `shared/config.ts` / `shared/paths.ts`; scripts use the shared aliases/import standardization (`scripts/tsconfig.json`, cleanup/indexing scripts). No mismatch between trees.

`13-strict-zod-schema-validation.md | ALIGNED |` Strict Zod input schemas are implemented in `mcp_server/schemas/tool-input-schemas.ts`, re-exported through tool schema layers, with tests in `tool-input-schema.vitest.ts`. No scripts contradiction found.

`14-dynamic-server-instructions-at-mcp-initialization.md | ALIGNED |` Dynamic MCP instructions are built in `mcp_server/context-server.ts` behind the feature flag in `search-flags.ts`; tests verify enabled/disabled modes. No scripts-side mismatch.

`15-warm-server-daemon-mode.md | ALIGNED |` Catalog correctly describes this as deferred: runtime still uses stdio transport in `mcp_server/context-server.ts`; `shouldEagerWarmup()` remains effectively disabled. No scripts contradiction found.

`16-backend-storage-adapter-abstraction.md | ALIGNED |` The vector-storage seam exists via `mcp_server/lib/interfaces/vector-store.ts` and `vector-index-store.ts`; SQLite remains the concrete backend as documented. Scripts do not claim a separate backend path.

`17-cross-process-db-hot-rebinding.md | ALIGNED |` Hot rebinding is implemented in `mcp_server/core/db-state.ts` via marker-file detection, reinitialize mutex, and dependent-module rebinds. Scripts participate by writing/using the DB update marker (`scripts/core/memory-indexer.ts`) and test references.

`18-atomic-write-then-index-api.md | ALIGNED |` Atomic pending-write/index/rename flow is implemented in `mcp_server/handlers/memory-save.ts` with helper/recovery logic in `lib/storage/transaction-manager.ts`; tests cover rollback/retry/recovery. Scripts only reference the handler path in tests/docs, no conflict.

`19-embedding-retry-orchestrator.md | ALIGNED |` Retry orchestration with cache dedup, retry state, and progressive backoff is implemented in `mcp_server/lib/providers/retry-manager.ts` plus embedding-cache integration and tests. No scripts contradiction found.

`20-7-layer-tool-architecture-metadata.md | ALIGNED |` L1-L7 architecture metadata exists in `mcp_server/lib/architecture/layer-definitions.ts` and is surfaced through tool dispatch/context logic; tests cover budgets/dispatch. No conflicting scripts implementation found.

`21-atomic-pending-file-recovery.md | ALIGNED |` Pending-file discovery/recovery is implemented in `mcp_server/lib/storage/transaction-manager.ts` and invoked from startup in `mcp_server/context-server.ts`; tests cover recovery. No scripts-side drift found.

`22-lineage-state-active-projection-and-asof-resolution.md | ALIGNED |` Lineage append/projection/`asOf` resolution is implemented in `mcp_server/lib/storage/lineage-state.ts`, integrated in `handlers/memory-save.ts`, and backed by schema support/tests. No scripts contradiction found.

**SUMMARY:** total=22, aligned=22, misaligned=0, partial=0, P0=0, P1=0, P2=0.

