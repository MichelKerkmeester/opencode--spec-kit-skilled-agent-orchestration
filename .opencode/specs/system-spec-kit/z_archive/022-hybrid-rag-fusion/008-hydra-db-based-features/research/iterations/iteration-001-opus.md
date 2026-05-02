# Iteration 1 (Opus): Lineage State + Scope Governance Audit

## Focus
Deep audit of two core Hydra runtime modules: `lineage-state.ts` (append-only lineage transitions, active projection, asOf resolution, backfill) and `scope-governance.ts` (scope predicates, governed ingest validation, retention policy helpers, governance audit). Also reviewed the three associated test files for coverage gaps.

## Findings

### lineage-state.ts

1. **Bug: `backfillLineageState` dry-run seeded/skipped counts diverge from actual execution** — The dry-run counting logic (lines 915-928) computes `seeded` and `skipped` by comparing every field of existing lineage rows (version_number, root_memory_id, predecessor, superseded_by, valid_from, valid_to). But the actual write path (lines 942-1006) uses `INSERT ... ON CONFLICT(memory_id) DO UPDATE`, which always overwrites. So the dry-run may report `skipped: 3` on re-run while the execution would actually overwrite all 3 rows silently. The dry-run path also uses `normalizeTimestamp(row.created_at)` for `expectedValidFrom` (line 909) but the execution path uses `historyEvents[0]?.timestamp ?? normalizeTimestamp(row.created_at)` (line 949), meaning dry-run predictions can be wrong when history events exist.
   — SOURCE: lineage-state.ts:909-928 vs 942-991

2. **Bug: `recordLineageVersion` mock path leaks for real databases** — The compatibility wrapper `recordLineageVersion` (line 1061-1088) uses a duck-type check `typeof database.exec !== 'function'` to decide if the database is "real". However `better-sqlite3` Database objects always have `.exec()`, so this guard only fires for intentionally mocked objects. The mock return at line 1073 returns `rootMemoryId: params.predecessorMemoryId ?? params.memoryId`, which is semantically wrong if a predecessor was provided (the root should be the predecessor's root, not the predecessor itself). This mock is fragile and will silently produce incorrect lineage data for any test using a mock db.
   — SOURCE: lineage-state.ts:1071-1080

3. **Architectural concern: No transaction wrapping in `recordLineageTransition`** — The `recordLineageTransition` function (line 465-557) performs multiple related writes: UPDATE predecessor's valid_to/superseded_by (line 512-517), UPDATE predecessor's importance_tier via `markHistoricalPredecessor` (line 518), INSERT new lineage row (line 521-545), and UPSERT active projection (line 547). These are not wrapped in a transaction, so a crash between any step leaves the lineage in an inconsistent state. Note: `createAppendOnlyMemoryRecord` (line 565-578) does wrap its call in a transaction, but direct calls to `recordLineageTransition` (from pe-gating.ts, save/create-record.ts) are unprotected.
   — SOURCE: lineage-state.ts:465-557; pe-gating.ts:8; save/create-record.ts:14

4. **Redundancy: `seedLineageFromCurrentState` and `recordLineageTransition` share nearly identical early-return logic** — Lines 401-411 and 473-483 are duplicated. Both check `getLineageRow(database, memoryId)` and return the same shaped object. This is a DRY violation that increases maintenance cost.
   — SOURCE: lineage-state.ts:401-411 vs 473-483

5. **Dead code: `parseMetadata` unused result** — `parseMetadata` is called in `inspectLineageChain` (line 614), `resolveActiveLineageSnapshot` (line 734), and `resolveLineageAsOf` (line 781). In all cases, it only extracts `.snapshot` from the metadata. The rest of the `LineageMetadata` fields (contentHash, filePath, canonicalFilePath, anchorId, specFolder, history, actor) are stored but never read back. This metadata bloat inflates the database without value.
   — SOURCE: lineage-state.ts:237-247, 614, 734, 781

6. **Potential bug: `summarizeLineageInspection` version gap detection is overly aggressive** — Line 674 flags `hasVersionGaps = true` when `row.predecessor_memory_id !== rows[index - 1]?.memory_id`. This check is invalid for backfilled chains where predecessor references may point to memory IDs not matching the sorted order. After a backfill, chains can have correct version numbers but mismatched predecessor IDs, producing false-positive gap warnings.
   — SOURCE: lineage-state.ts:668-676

7. **Refinement: `insertAppendOnlyMemoryIndexRow` has an anchor_id column missing from INSERT** — The INSERT statement (lines 299-339) does not include `anchor_id` or `content_hash` columns. These are set only via `applyPostInsertMetadata` (line 342-353), requiring an extra UPDATE. This is a performance concern for high-throughput append paths.
   — SOURCE: lineage-state.ts:299-353

8. **Refinement: `buildLogicalKey` separator collision risk** — The logical key format `${spec_folder}::${canonicalPath}::${anchorId}` (line 187) uses `::` as separator. If any component contains `::` (e.g., a file path with `::` in it), logical keys would be ambiguous. No validation prevents this.
   — SOURCE: lineage-state.ts:180-188

### scope-governance.ts

9. **Bug: `validateGovernedIngest` returns `allowed: true` when no governance is needed, but normalizes empty strings for required fields** — When `requiresGovernedIngest` returns false (line 224-241), the function returns `allowed: true` with `tenantId: ''` and `sessionId: ''`. Downstream code that checks `decision.normalized.tenantId || null` (line 279 in `buildGovernancePostInsertFields`) will write `null` for these, but code checking `decision.normalized.tenantId` as truthy will incorrectly treat the empty string as present. The `Required<Pick<...>>` type forces these to be strings, hiding the emptiness.
   — SOURCE: scope-governance.ts:224-241, 277-301

10. **Architectural concern: `isDefaultOnFlagEnabled` defaults to `true`** — The function (lines 137-148) returns `true` when no env var is set. This means scope enforcement and governance guardrails are ON by default. However, `isScopeEnforcementEnabled` and `isGovernanceGuardrailsEnabled` are checked independently from `requiresGovernedIngest`. A request with scope metadata will trigger governed ingest validation regardless of these flags, which is inconsistent with the "default-on" naming.
    — SOURCE: scope-governance.ts:137-148, 171-188, 196-205

11. **Test gap: `validateGovernedIngest` happy path not tested** — The governance test file only tests the rejection case (missing provenance/scope). There is no test for a fully valid governed ingest that should return `allowed: true` with all fields normalized. This leaves the normalization of `deleteAfter` timestamp comparison (line 248) and retention policy mapping (line 218-220) untested.
    — SOURCE: memory-governance.vitest.ts:21-33

12. **Test gap: `createScopeFilterPredicate` no-op path untested** — When scope enforcement is disabled AND no scope constraints are provided, the predicate returns `() => true` (line 427). This path is not explicitly tested. The test at line 50-59 tests explicit session scope without enforcement, but never tests the full no-op branch.
    — SOURCE: scope-governance.ts:426-427; memory-governance.vitest.ts

13. **Refinement: `reviewGovernanceAudit` fires 4 separate SQL queries** — The function (lines 457-552) executes SELECT rows, COUNT, GROUP BY action, GROUP BY decision, and MAX(created_at) as separate prepared statements. These could be consolidated into a single query with window functions or a CTE to reduce round-trips, especially for large audit tables.
    — SOURCE: scope-governance.ts:467-526

14. **Refinement: `GovernanceDecision.normalized` type is overly complex** — The type `Required<Pick<GovernedIngestInput, ...>> & ScopeContext & { deleteAfter: string | null }` (line 45) creates a confusing intersection where `tenantId` appears twice (once Required from Pick, once optional from ScopeContext). TypeScript resolves this, but it harms readability.
    — SOURCE: scope-governance.ts:44-45

### Test Files

15. **Test gap: No test for `resolveLineageAsOf` with boundary timestamps** — The test at lines 107-116 in `memory-lineage-state.vitest.ts` tests before/after but never tests the exact `valid_from` boundary or the exact `valid_to` boundary. The SQL uses `valid_from <= ?` and `valid_to > ?`, so a test at exactly `valid_from` time is needed to verify inclusive/exclusive behavior.
    — SOURCE: memory-lineage-state.vitest.ts:107-116; lineage-state.ts:770-773

16. **Test gap: No test for `createAppendOnlyMemoryRecord`** — This is a critical function that combines memory insertion + lineage wiring in a transaction. It is not tested directly in any test file. The handler-level tests may cover it indirectly, but there's no unit test for rollback behavior on embedding dimension mismatch or BM25 failures.
    — SOURCE: lineage-state.ts:565-578

17. **Test gap: `backfillLineageState` re-run idempotency is tested but seeded/skipped count accuracy is not verified against actual DB state** — The test at `memory-lineage-backfill.vitest.ts:146-148` asserts `rerun.seeded === 0` and `rerun.skipped === 3`, but does not verify the DB rows are actually unchanged. Given Finding #1 (the ON CONFLICT overwrites), the skip count may be misleading.
    — SOURCE: memory-lineage-backfill.vitest.ts:146-148

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` (1206 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (605 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts` (291 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts` (313 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts` (173 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` (grep for table definitions)
- Import consumers: `handlers/memory-save.ts`, `handlers/pe-gating.ts`, `handlers/save/create-record.ts`, `lib/governance/retention.ts`, `lib/search/pipeline/stage1-candidate-gen.ts`

## Assessment
- New information ratio: **0.95** — First systematic audit of these modules; all findings are novel
- Questions addressed:
  - Bugs: 4 found (#1 dry-run divergence, #2 mock path logic, #6 false-positive gap detection, #9 empty string normalization)
  - Dead code: 1 found (#5 metadata bloat — stored but only `.snapshot` ever read)
  - Architecture: 2 concerns (#3 missing transaction wrapping, #10 default-on flag semantics)
  - Refinements: 4 opportunities (#4 DRY violation, #7 two-step INSERT+UPDATE, #8 separator collision, #13 query consolidation, #14 type complexity)
  - Test gaps: 5 identified (#11, #12, #15, #16, #17)

## Recommended Next Focus
1. **Retention module** (`lib/governance/retention.ts`) — referenced in tests but not yet audited; handles delete cascades
2. **Shared spaces** (`lib/collab/shared-spaces.ts`) — imports from scope-governance; governs multi-tenant memory sharing
3. **Handler integration** — `handlers/memory-save.ts` and `handlers/save/create-record.ts` wire lineage + governance together; need to verify transaction boundaries in the actual save flow
4. **vector-index-schema.ts** table definitions and migration paths — ensure lineage table schema matches actual usage patterns
