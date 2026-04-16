# Iteration 34 - traceability - tests

## Dispatcher
- iteration: 34 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:16:16.694Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Archived constitutional filtering is broken in the implementation, and the remediation test hard-codes the broken behavior instead of catching it.** `vector-index-store.ts:609-668:get_constitutional_memories` accepts `includeArchived`, but the SQL at `630-643` never checks `is_archived`. The public wrapper still advertises the flag (`vector-index-queries.ts:288-295:get_constitutional_memories_public`, `vector-index-store.ts:1093-1100:SQLiteVectorStore.getConstitutionalMemories`). After archiving a constitutional row, `vector-index-store-remediation.vitest.ts:128-137` asserts that both the default path and `includeArchived: true` still return `[4001]`, which cements the contract violation rather than detecting it.

```json
{"claim":"The constitutional-memory API exposes includeArchived semantics, but the underlying query ignores the flag and the remediation test now enshrines that wrong behavior.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:609-668",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:288-295",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1093-1100",".opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:128-137"],"counterevidenceSought":"Looked for any is_archived predicate or post-query archived filtering in constitutional retrieval wrappers and for tests asserting different behavior when includeArchived=false vs true.","alternativeExplanation":"The flag could have been added only for future parity, but it is already part of public options and is threaded through the call stack, so callers are invited to rely on it today.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the intended contract is explicitly 'constitutional memories always ignore archival state' and the public option is documented as a no-op placeholder."}
```

- **`includeArchived` is also dead code in keyword and multi-concept search, and the impl suite never exercises the advertised option.** `vector-index-queries.ts:343-345:multi_concept_search` and `616-618:keyword_search` explicitly discard `includeArchived` with `void includeArchived`; the SQL at `364-390` and `638-643` has no archival predicate. The implementation tests cover tokenization and shape only (`vector-index-impl.vitest.ts:681-704`, `1317-1322`), so these public options can remain broken with green tests.

```json
{"claim":"Keyword and multi-concept search expose includeArchived in their public options but do not implement or test it, leaving a live contract gap behind passing tests.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:343-345",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:364-390",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:616-618",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:638-643",".opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:681-704",".opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1317-1322"],"counterevidenceSought":"Checked for archival filtering in the SQL and for any focused test that archives a row then verifies keyword/multi-concept results differ when includeArchived flips.","alternativeExplanation":"The option may have been copied for signature parity with other search APIs, but exported flags that are silently ignored still break caller expectations.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if these options are intentionally undocumented/internal-only and no external caller is meant to depend on archival filtering for these code paths."}
```

### P2 Findings
- `vector-index-impl.vitest.ts:135-139` hard-codes `EMBEDDING_DIM` to `1024`, even though the implementation resolves dimensions from the active provider (`vector-index-store.ts:121-129`) and the same suite otherwise accepts `[768, 1024, 1536]` as valid (`vector-index-impl.vitest.ts:415-420`). That makes the suite provider-profile brittle instead of tracking the real contract.
- `vector-index-impl.vitest.ts:946-948` (`getConstitutionalMemories`) and `1287-1292` (`vectorSearch respects minSimilarity`) assert only that the APIs return arrays. Those checks will stay green if constitutional filtering or similarity-threshold enforcement regresses completely.

## Traceability Checks
- `vector-index-schema-migration-refinements.vitest.ts:32-55` stays aligned with the schema contract: it forces an index-build failure and verifies `schema_version` does not advance, matching the transactional migration behavior in `vector-index-schema.ts`.
- `vector-index-schema-migration-refinements.vitest.ts:57-118`, `120-189`, and `212-359` also verify concrete row/index/column outcomes for v23/v24/v26/v12/embedding-cache migrations rather than only checking that helper functions return successfully.
- The drift is concentrated in the search-facing tests: the public APIs expose archival controls, but the focused tests either encode the wrong semantics or only check result shape.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts` — good traceability for the validator’s current contract: it exercises both the empty-database failure case and a minimally compatible footprint, then asserts the full compatibility report fields.
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` — high-signal migration coverage; it validates rollback behavior, canonicalization, DDL additions, and legacy-row preservation against live DB state.
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:835-869` — the vec-delete rollback case is a strong contract test because it verifies the primary delete is not attempted when vector cleanup fails.

## Next Focus
- Iteration 35 should trace archived-memory handling through higher-level handlers/callers (`memory-search`, bootstrap/resume, checkpoint flows) to see where these dead `includeArchived` options surface as user-visible behavior.
