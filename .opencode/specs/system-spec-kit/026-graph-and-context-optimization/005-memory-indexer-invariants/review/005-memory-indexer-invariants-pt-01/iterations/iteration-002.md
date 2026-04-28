# Iteration 2 — Security

## Dimension

Security pass over cleanup atomicity, symlink/realpath boundary handling, walker DoS caps, constitutional-tier promotion/downgrade surfaces, governance-audit durability, and save-time rejection behavior.

## Files Reviewed

- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/symlink-realpath-hardening.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts`

## Findings — P0 (Blockers)

None.

## Findings — P1 (Required)

None new.

Existing `P1-001` is security-relevant because a poisoned checkpoint can preserve a README-backed constitutional row, but this pass did not re-emit it. The security angle reinforces the existing storage-boundary finding rather than creating a separate duplicate.

## Findings — P2 (Suggestions)

### P2-003 — Walker DoS caps warn only through logs, not tool results

The caps are present and graceful, but operator visibility is weak. `memory-index-discovery.ts` flips `maxNodesExceeded` and calls `console.warn` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:36`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:42`, and depth warnings at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:103`; the discovery API still returns only `results` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:158`. `memory_index_scan` calls those discovery helpers at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:224` and returns response data at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:646` without cap-hit metadata. Code graph has the same shape: cap constants are defined at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:78`, warning-only exits happen at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1377` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1393`, and `findFiles()` returns only files/exclusion counts at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1425`.

Security impact: an adversarial tree can force partial discovery while the MCP response still looks like a normal successful scan unless the operator has server stderr. Return structured `warnings` / `capExceeded` fields from both walkers and surface them in `memory_index_scan` and code-graph scan summaries.

### P2-004 — Save-time excluded-path rejection lacks a stable error code

The rejection happens before the indexing write path, but it is emitted as a generic thrown `Error`. The path guard rejects excluded realpaths at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2714` with `throw new Error(...)` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2715`; the local catch only translates `VRuleUnavailableError` into an MCP error envelope at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3047` and rethrows other errors at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3061`.

Security impact: the invariant is preserved, but clients cannot reliably distinguish an index-scope rejection from a generic handler failure. Return a stable code such as `E_MEMORY_INDEX_SCOPE_EXCLUDED` with the canonical rejected path in details.

### P2-005 — Exported chunking helper has an unguarded fallback tier write

The normal `memory_save` path prepares and downgrades parsed memory before chunking: `runWithinSpecFolderLock` uses `prepareParsedMemoryForIndexing()` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2113`, and chunking is invoked with the guarded `applyPostInsertMetadata` wrapper at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2304` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2308`. However, `indexChunkedMemoryFile()` itself defaults to `applyPostInsertMetadataFallback` at `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:161`; that fallback dynamically updates `importance_tier` with no `isConstitutionalPath()` guard at `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:101` through `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:119`. Its safe-swap parent update also writes `importance_tier = ?` directly from `parsed.importanceTier` at `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:510` through `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:529`.

Security impact: I did not find a current MCP `memory_save` bypass, because the production caller passes the prepared parsed object and guarded metadata helper. The exported helper is still a defense-in-depth gap for direct internal imports and tests. Route the fallback and safe-swap parent update through the same post-insert guard or apply the SSOT predicate locally.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| S1 cleanup transaction + TOCTOU | Pass | Apply path opens `database.transaction(...)` and rebuilds the plan inside the transaction at `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:429` through `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:435`. Cleanup audit inserts happen inside `applyCleanup()` at `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:343` through `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:358`, so an uncaught audit insert failure aborts the transaction rather than committing an unaudited cleanup. |
| S1 action-string contract | Pass | Shared constants define `tier_downgrade_non_constitutional_path` and `tier_downgrade_non_constitutional_path_cleanup` at `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:117` through `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:120`; cleanup tests assert the cleanup action at `.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts:121` through `.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts:140`. |
| S1 idempotency | Pass by recorded evidence | `CHK-S04` records second `--apply` as zero planned + zero applied changes at `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist.md:124`; implementation summary records final dry-run/apply/verify zero states at `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/implementation-summary.md:198` through `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/implementation-summary.md:204`. |
| S2 symlink / realpath bypass | Pass | `resolveCanonicalPath()` uses `fs.realpathSync()` with fail-open fallback at `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:36` through `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:41`; `memory-save` evaluates `shouldIndexForMemory()` and `isConstitutionalPath()` against the canonical path at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:309` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:313`; code-graph specific file handling rejects by canonical path at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1431` through `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1445`. Symlink regression tests cover both surfaces at `.opencode/skill/system-spec-kit/mcp_server/tests/symlink-realpath-hardening.vitest.ts:51` through `.opencode/skill/system-spec-kit/mcp_server/tests/symlink-realpath-hardening.vitest.ts:109`. |
| S3 walker DoS caps | Partial | Caps exist and stop gracefully, but only log warnings; see P2-003. |
| S4 constitutional promotion / downgrade paths | Partial | `memory_update`, vector-index mutations, and post-insert metadata guard non-constitutional paths, with tests at `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:145` through `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:223`. The exported chunking helper fallback remains a defense-in-depth gap; see P2-005. |
| S5 governance audit durability under failure | Pass | `recordGovernanceAudit()` writes via `INSERT INTO governance_audit` at `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:350` through `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:369`; save/update/post/vector callers catch audit write failures and preserve the invariant at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:326`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:202`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:117`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:93`. Cleanup intentionally fails closed by leaving the audit insert uncaught inside the cleanup transaction. |
| S6 save-time invariant guard | Partial | Excluded paths are rejected before indexing, but the error code is not stable; see P2-004. Invalid constitutional tiers are downgraded and audited rather than rejected, matching the packet decision at `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/implementation-summary.md:147`. |

## Claim Adjudication Packets

No new P0/P1 findings in this iteration, so no claim-adjudication packets are required.

## Verdict

CONDITIONAL. No new P0/P1 security findings were found, but the prior active P1 remains open. New advisories are P2-only: cap observability, stable rejection codes, and chunking-helper defense-in-depth.

## Next Dimension

Iteration 3 should move to traceability. Focus on whether checklist, strategy, implementation-summary, tests, and current on-disk paths agree after the root merge and Wave-2 hardening, without re-flagging the known iteration-1 inventory items.
