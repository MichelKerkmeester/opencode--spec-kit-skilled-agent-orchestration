# Iteration 001: Save Pipeline Integrity

## Findings

No P0 issues found.

### [P1] Scoped PE filtering still matches unscoped rows
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:71-89`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:959-1009`
- **Issue**: `findSimilarMemories()` only rejects a candidate when both the requested scope and the row scope are present and unequal. Legacy or unscoped rows with `NULL` scope fields still pass through a tenant/session/shared-space save, so PE gating can reinforce or supersede the wrong memory. `handleMemorySave()` then applies governance metadata to the returned `result.id`, which can effectively re-home an unrelated row under the current save request.
- **Evidence**: The filter uses checks like `if (tenantId && r.tenant_id && r.tenant_id !== tenantId) return false;`, and the same pattern is repeated for `userId`, `agentId`, `sessionId`, and `sharedSpaceId`. That means a scoped save accepts rows where `r.tenant_id` or `r.session_id` is missing. Later, `handleMemorySave()` unconditionally runs `applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision))` for any non-duplicate/non-unchanged result.
- **Fix**: When a scope field is supplied, require exact equality on the candidate row and treat `NULL`/missing values as a mismatch instead of a match.

### [P1] PE update short-circuit can index auto-fixed content without rewriting the file
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:196-203`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:488-492`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:585-589`; `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:122-160`; `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:226-287`
- **Issue**: The prepare step replaces `parsed.content` with `qualityLoopResult.fixedContent` as soon as the quality loop passes. If PE gating chooses `UPDATE`, `updateExistingMemory()` writes that mutated content into a new append-only memory version, but `processPreparedMemory()` returns on `peResult.earlyReturn` before it ever calls `finalizeMemoryFileContent()`. The database can therefore contain the auto-fixed version while the canonical markdown file on disk still contains the pre-fix text.
- **Evidence**: `prepareParsedMemoryForIndexing()` sets `parsed.content = finalizedFileContent` and recomputes `contentHash`. `processPreparedMemory()` then does `if (peResult.earlyReturn) return peResult.earlyReturn;` before the later `finalizeMemoryFileContent()` call. On the PE `UPDATE` path, `updateExistingMemory()` persists `contentText: parsed.content` in the appended row and commits that transaction immediately.
- **Fix**: Finalize the fixed file content before returning from PE `UPDATE`, or defer applying `fixedContent` to `parsed.content` until the source file write is guaranteed to succeed.

### [P1] `atomicSaveMemory()` still has a DB-first failure window
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1017-1027`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1141-1161`
- **Issue**: The function advertises an atomic save, but it commits the database work before promoting the pending file into place. If `fs.renameSync(pendingPath, file_path)` fails, the function returns an error with `dbCommitted: true`, leaving the save indexed in SQLite even though the canonical file path was never updated.
- **Evidence**: The implementation comment says indexing runs first and the file is promoted afterward. The rename failure path returns `status: 'error'`, `dbCommitted: true`, and "Pending file kept for recovery", which confirms the DB commit has already happened and no compensating delete/rollback is attempted.
- **Fix**: Make file promotion part of the commit boundary, or perform compensating cleanup of the newly indexed memory row when final rename fails.

### [P2] Dry-run is not actually non-mutating when eval logging is enabled
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:775-829`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:864-918`; `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:557-575`; `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:669-700`
- **Issue**: Both dry-run branches call `prepareParsedMemoryForIndexing()`, which runs the quality loop. `runQualityLoop()` always calls `logQualityMetrics()` on both pass and reject paths, and that function inserts into `eval_metric_snapshots` whenever `SPECKIT_EVAL_LOGGING=true`. That violates the explicit "DryRun must remain non-mutating" contract.
- **Evidence**: `handleMemorySave()` documents dry-run as non-mutating, but both dry-run branches invoke `prepareParsedMemoryForIndexing(parsedForDryRun, database)`. Inside `runQualityLoop()`, every exit path calls `logQualityMetrics(...)`, and `logQualityMetrics()` performs an `INSERT INTO eval_metric_snapshots`.
- **Fix**: Pass an explicit "no side effects" flag through dry-run code paths and suppress eval metric writes when that flag is set.

### [P2] Anchor auto-fix cannot repair repeated anchor-name count mismatches
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:154-203`; `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:515-539`
- **Issue**: `scoreAnchorFormat()` correctly counts how many openings and closings exist per anchor name, but `normalizeAnchors()` only checks whether a closing tag for that name exists at least once. A file with two `<!-- ANCHOR:foo -->` tags and one `<!-- /ANCHOR:foo -->` is flagged as broken, yet the auto-fix appends nothing because `closeAnchors.includes('foo')` is already true.
- **Evidence**: The scorer builds per-name counts and records each missing close individually. The fixer instead does `const unclosed = openAnchors.filter(name => !closeAnchors.includes(name));`, which ignores multiplicity and only detects names with zero closes.
- **Fix**: Normalize anchors using the same counted-per-name approach as the scorer so the fixer appends the exact number of missing closing tags.

## Summary
- P0: 0 findings
- P1: 3 findings
- P2: 2 findings
