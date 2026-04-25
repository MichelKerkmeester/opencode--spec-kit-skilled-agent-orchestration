# Iteration 22 - security - lib

## Dispatcher
- iteration: 22 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:48:14.792Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **The exported vector-index write surface does not enforce the same file-boundary checks that the read surface assumes.** `index_memory()` persists caller-supplied `filePath` values without any `validateFilePath`/canonical-doc restriction, and `SQLiteVectorStore.upsert()` forwards `metadata.file_path`/`filePath` the same way. Later, enriched retrieval helpers re-open the stored path through `safe_read_file_async()` against an allowlist rooted at `process.cwd()`, so any future caller that bypasses the higher-level save handlers can index and re-read arbitrary repo-local files rather than only canonical memory docs. The current tests cover cross-DB isolation and happy-path exports, but I did not find a regression that locks this boundary down. `[evidence: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:152-230; .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:289-329,959-1003; .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:727-729,818-820,899-900; .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:238-288]`
- **`SQLiteVectorStore.close()` is process-global rather than instance-scoped.** The class supports per-instance `dbPath` pinning, and the remediation suite explicitly treats separate store instances as isolated, but `close()` delegates to `close_db()`, which closes every tracked connection in `db_connections`. That turns one store's lifecycle action into a cross-instance availability/isolation side effect; I also did not find a regression test that exercises `storeA.close()` while `storeB` remains active. `[evidence: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:379-380,844-855,1055-1059; .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:238-288]`

## Traceability Checks
- The post-Gate-D canonical reader path is internally consistent about archival behavior: Stage 1's `applyArchiveFilter()` is an intentional no-op, the handler contract reports `archivedTierEnabled: false` and `includeArchivedCompatibility: 'ignored'`, and the Gate-D regression test asserts that exact contract. This implementation matches the current runtime intent even though several low-level helpers still carry `includeArchived` compatibility parameters. `[evidence: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:132-137; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1102-1111; .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts:204-243]`

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` + `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`: lexical input is sanitized before FTS use, and execution stays parameterized; I did not find a direct SQL-injection primitive in this slice.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts`: public graph-query helpers are built from prepared statements with bound parameters, not ad hoc SQL assembly from caller input.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`: these modules only consume environment/config state and assemble metadata; no command-exec or writable filesystem surface showed up here.

## Next Focus
- Review the save/ingest boundary around vector-index entrypoints and adjacent handlers for any remaining places where caller-controlled paths or lifecycle operations can bypass the canonical-reader isolation guarantees.
