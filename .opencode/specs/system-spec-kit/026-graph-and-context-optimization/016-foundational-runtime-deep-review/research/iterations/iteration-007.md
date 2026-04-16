# Iteration 7 — Save-time enrichment replay seam (7/10)

## Investigation Thread
I traced the planner-first save follow-up path for deferred enrichment: `memory-save.ts` -> `api/indexing.ts` -> `memory-index.ts` -> `post-insert.ts`, then cross-checked the entity-extraction and entity-linking substeps to see whether the runtime truthfully replays deferred work and surfaces soft failures.

## Findings

### Finding R7-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`
- **Lines:** `111-122`
- **Severity:** P1
- **Description:** The explicit `runEnrichmentBackfill` follow-up can be a no-op for the exact documents it claims to backfill. It only flips `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` and then calls `memory_index_scan` with `incremental: true` and `force: false`, so already-indexed unchanged files are fast-path skipped before they ever re-enter `indexMemoryFile()` and the post-insert enrichment pipeline.
- **Evidence:** `api/indexing.ts:111-122` wires `runEnrichmentBackfill()` to `runMemoryIndexScan({ specFolder, includeSpecDocs: true, includeConstitutional: false, incremental: true, force: false })`; `handlers/memory-index.ts:368-388` turns `categorized.toSkip` into `unchanged`/`fast_path_skips` instead of indexing those files; `lib/storage/incremental-index.ts:172-186` returns `'skip'` whenever `file_mtime_ms` is unchanged and `embedding_status` is not pending/failed. The existing tests only assert the env flip and the response hint (`tests/follow-up-api.vitest.ts:102-149`, `tests/post-insert-deferred.vitest.ts:50-81`); none verify that an unchanged deferred document is actually reprocessed.
- **Downstream Impact:** A user can follow the advertised `runEnrichmentBackfill` action and still leave entity extraction, summaries, linking, and graph refresh unapplied until the file changes again or someone runs a forceful/manual reindex. The tool surface says “backfill deferred enrichment,” but the runtime can silently do nothing.

### Finding R7-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `116-125,159-173`
- **Severity:** P1
- **Description:** Entity extraction can soft-fail while still being recorded as a success, and the pipeline then proceeds into cross-document entity linking using whatever entity rows were already in the database. That means stale `memory_entities` data can drive new cross-document edges without any warning surfaced to the caller.
- **Evidence:** `post-insert.ts:118-125` calls `refreshAutoEntitiesForMemory()` and then unconditionally sets `enrichmentStatus.entityExtraction = true` without checking the returned `{ removed, stored, catalogRebuilt }`; `lib/extraction/entity-extractor.ts:198-240` catches refresh failures and returns `{ removed: 0, stored: 0, catalogRebuilt: false }` instead of throwing; `post-insert.ts:159-173` runs `runEntityLinkingForMemory()` based only on feature flags; `lib/search/entity-linker.ts:527-550,608-640,1096-1132` reads `memory_entities` for the current memory and builds incremental cross-document matches from those rows. `handlers/save/response-builder.ts:311-321` only emits a partial-enrichment warning when a status flag is `false`, so this soft failure path remains invisible. Coverage is missing: `tests/post-insert-deferred.vitest.ts:11-47` only locks the deferred path, and `tests/handler-memory-save.vitest.ts:546-557,2286-2308` mocks post-insert as all-true success instead of exercising a zero-store/failed-refresh branch.
- **Downstream Impact:** A failed refresh can leave old entity rows in place, causing incremental entity linking to preserve or create cross-document edges from stale content. Operators receive a clean-looking save result even though the entity graph may now reflect superseded text instead of the newly saved document.

## Novel Insights
This iteration exposed a save-path seam that differs from the earlier hook-state and code-graph findings: the failure mode is not “the write fails,” but “the follow-up machinery says it ran when it either never replayed or replayed against stale state.” The common pattern is post-save truth collapse: explicit backfill actions reuse incremental skip logic, and in-process enrichment reuses boolean success flags that cannot distinguish real completion from soft failure.

## Next Investigation Angle
Trace the remaining planner follow-up actions (`reindexSpecDocs`, `refreshGraphMetadata`, reconsolidation follow-ups) against their actual execution paths, with special attention to other places where “replay” actions may silently short-circuit on cached mtime/state or where skipped substeps are reported as successful completion.
