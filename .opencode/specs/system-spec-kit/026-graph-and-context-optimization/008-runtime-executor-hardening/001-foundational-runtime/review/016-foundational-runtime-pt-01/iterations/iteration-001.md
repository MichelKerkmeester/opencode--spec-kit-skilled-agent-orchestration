# Iteration 1 — Correctness

## Dispatcher

- iteration: 1 of 7
- dispatcher: task-tool / @deep-review / claude-opus-4-7
- session_id: 2026-04-17T120827Z-016-phase017-review
- timestamp: 2026-04-17T10:45:00Z

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`

## Investigation Thread

Targeted correctness pass against the seven Phase 017 core primitives in this iteration's brief:

1. Predecessor CAS in `executeConflict()` (reconsolidation.ts)
2. Zod `HookStateSchema` + `.bad` quarantine (hook-state.ts)
3. `mtime` re-read TOCTOU guard in `cleanStaleStates()` (hook-state.ts)
4. `migrated` marker propagation: graph-metadata-parser -> memory-parser -> stage1 ranker
5. `OperationResult<T>` status aggregation in `runPostInsertEnrichment()` (post-insert.ts)
6. Atomic single-patch write in `processStopHook()` (session-stop.ts)
7. 4-state `TrustState` exhaustiveness (shared-payload, session-health, code-graph/query)

Cross-referenced Phase 016 FINAL synthesis IDs and the four P2 closing-pass findings (CP-001..CP-004) in `closing-pass-notes.md` to avoid flagging already-documented issues. Closing-pass verdict #4 explicitly confirms that `executeMerge`/`executeConflict` now compare `contentHash`, `updatedAt`, `importanceTier`, and the four scope fields (tenant/user/agent/session) via `hasPredecessorChanged` -> `hasScopeRetagged`; my read of lines 279, 505-520, 557-571 is consistent with that verdict.

## Findings

### P0 Findings

None. The four P0 composites from Phase 016 all appear correctly remediated in the primitives reviewed this iteration; no new P0 correctness issues were found.

### P1 Findings

1. **Conflict-path `UPDATE ... WHERE content_hash = ?` becomes a no-op when the predecessor's `content_hash` is NULL and schema did not backfill it** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:522-537`, `:573-593` — When `capturePredecessorVersion()` reads a row whose `content_hash` column is stored as `NULL` (legacy rows pre-`post-insert-metadata.ts` backfill), `predecessorSnapshot.contentHash` becomes `null`. The WHERE clause in both the "distinct-new-id" deprecation UPDATE (lines 522-537) and the "legacy fallback in-place" UPDATE (lines 573-593) uses:
    ```
    AND ((content_hash = @contentHash) OR (content_hash IS NULL AND @contentHash IS NULL))
    ```
    The OR branch correctly matches `NULL == NULL`, so a legacy row with `content_hash = NULL` WILL be updated. The bug is the opposite direction: if a concurrent writer stores a `content_hash` between `baselineRow` read (line 493) and the transaction re-read (line 508), and the snapshot captured `null`, then `updateResult.changes === 0` correctly aborts with `conflict_stale_predecessor`. That part is sound.
    However, the `hasScopeRetagged(predecessorSnapshot, currentRow)` check at line 513 reads scope fields from `currentRow` via `getOptionalString(...)` which returns `undefined` for empty strings (`line 873-875`). If a concurrent writer explicitly sets `tenant_id = ''` (empty string) to "clear" scope, `getOptionalString` returns `undefined`; the snapshot may have captured `null`; `snapshot.tenantId !== null` is false so `hasScopeRetagged` returns false and the scope-change is NOT detected. This is a narrow-but-real CAS bypass: empty-string scope writes look identical to "no change" to the guard. The severity-reducing fact is that scope fields are normally written by code that either sets a non-empty string or `null`, not empty string — but there is no schema-level `CHECK` to guarantee this. Grep for `tenant_id =` in writers would clarify exposure; that is a follow-up for iteration 2.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "hasScopeRetagged's reliance on getOptionalString (which collapses empty string to undefined) allows a concurrent empty-string scope rewrite to bypass the scope-change CAS in executeConflict.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:872-875",
        ".opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:918-923",
        ".opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:513",
        ".opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:564"
      ],
      "counterevidenceSought": "Searched for any writer that sets tenant_id/user_id/agent_id/session_id to empty string; capturePredecessorSnapshot uses the same getOptionalString so both sides collapse identically.",
      "alternativeExplanation": "Both capture and comparison use getOptionalString, so 'null vs empty string' normalizes on both sides identically; the bug surface is narrower than it first appears.",
      "finalSeverity": "P1",
      "confidence": 0.78,
      "downgradeTrigger": "If a DB CHECK constraint or consistent writer policy guarantees scope fields are always NULL or non-empty, this downgrades to P2 (defense-in-depth)."
    }
    ```

2. **`post-insert.ts` treats `partial_causal_link_unresolved` as a `partial` execution status, triggering `runEnrichmentBackfill` even when unresolved references are structurally non-retryable** — `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:159-173`, `:340-368` — At line 158-170, the handler classifies a partial outcome based on `causalLinksResult.unresolved.length > 0`. Line 167 maps unresolved-with-no-errors to reason `'partial_causal_link_unresolved'` and status `'partial'`. The roll-up at lines 347-365 then sets the top-level `executionStatus` to `{ status: 'partial', reason: 'enrichment_step_partial', followUpAction: 'runEnrichmentBackfill', partialSteps: ['causalLinks', ...] }`.
    The correctness concern: `unresolved` references can be structurally non-retryable (e.g. `supersedes: [nonexistent-memory-id-42]` where memory 42 was archived). A causal-links backfill that re-processes the same memory will produce the same `unresolved` count, trigger `partial` again, re-schedule backfill — a benign infinite-retry loop IF consumers of `followUpAction` do not rate-limit. The T-PIN-04 comment explicitly says "partial causal-link failures must surface as `partial`, not `ran`" — which is correct — but pairing `partial` with `followUpAction: 'runEnrichmentBackfill'` without a retry-exhaustion counter means structurally-unresolvable references get retried indefinitely.
    The `errors[].length > 0` branch (reason `partial_causal_link_errors`) is different: those are actual exceptions that may be transient. But the pure-unresolved branch is explicitly the "reference missing" branch, and that is rarely transient.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "post-insert.ts pairs partial_causal_link_unresolved with followUpAction: 'runEnrichmentBackfill' with no retry-exhaustion counter, so structurally-unresolvable references cause recurring backfill scheduling.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:159-173",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:347-365"
      ],
      "counterevidenceSought": "Searched for rate-limit, retry-count, or exhaustion logic on runEnrichmentBackfill consumer side; not visible in this file. The followUpAction is only an advisory field, but partialSteps: ['causalLinks'] on the same outcome each time means the backfill driver will likely re-enqueue.",
      "alternativeExplanation": "The backfill consumer may itself dedupe by memory ID + step + reason and effectively rate-limit; if so, this is a documentation/contract gap rather than a runtime bug.",
      "finalSeverity": "P1",
      "confidence": 0.72,
      "downgradeTrigger": "If backfill consumer dedupes by (memoryId, step, reason) and skips work when reason is 'partial_causal_link_unresolved' after the first retry, downgrade to P2."
    }
    ```

### P2 Findings

1. **`cleanStaleStates()` identity check holds an open descriptor across `unlinkSync`, but the TOCTOU window between `statSync` and `openSync` is unprotected** — `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:818-864` — The sequence is: `statSync` (line 834) -> `openSync` (line 841) -> `fstatSync` (line 842) -> identity-check -> `closeSync` (line 849) -> `unlinkSync` (line 853). The identity check correctly confirms that the file at `filePath` still points to the same inode that `statSync` saw, so a writer that renamed a fresh state over a stale path between `readdirSync` and `openSync` will be detected. Good. However, the descriptor is closed BEFORE `unlinkSync`, so the TOCTOU window between `closeSync` (line 849) and `unlinkSync` (line 853) is open: another writer could replace the file in that micro-window and the unlink would remove the new file. The fix is to call `unlinkSync` inside the `finally` block BEFORE `closeSync`, or keep the descriptor open until after unlink. This is classified P2 because the window is microseconds on a local tmpfs and the blast radius is "one stale state file cleanup removes one session-start file", not lineage or governance data. Also, this mirrors P0-D's original TOCTOU fix pattern; the fix was applied one-step-short of fully closing the window.

2. **`deriveGraphMetadata()` carries `migrated: existing?.migrated ?? undefined` but Zod schema may coerce `undefined` to `false`, erasing the migration marker on refresh** — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1076-1083`, `:1094-1106` — Line 1078 passes `existing?.migrated ?? undefined` into `graphMetadataSchema.parse(...)`. If the schema defines `migrated` with `.default(false)` (the idiomatic Zod pattern for nullable booleans), then `undefined` gets coerced to `false` at parse time. `mergeGraphMetadata` at line 1098 then does `migrated: existing?.migrated ?? refreshed.migrated` which preserves the EXISTING value — so there is a safety net at merge time. But `deriveGraphMetadata` is also called standalone by `refreshGraphMetadataForSpecFolder` (line 1174) and its output goes into `mergeGraphMetadata(existing, refreshed)`. The chain ultimately preserves the marker only because `mergeGraphMetadata` re-reads `existing.migrated`. If a caller ever invokes `deriveGraphMetadata` without going through `mergeGraphMetadata`, the `migrated: true` flag is lost. This is defense-in-depth — the current call graph does not appear to expose the bug — but the contract is fragile. P2, documentation/hardening-level.

3. **`session-stop.ts` three-write collapse is correctly single-write, but the `stateBeforeStopResult` snapshot at line 313 is read BEFORE the spec-folder refresh at line 421, creating stale-read of `lastSpecFolder` only** — `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:313`, `:421-423`, `:477-488` — T-SST-11 (R37-002) in the code comment says the refresh at line 421 exists specifically to avoid locking in a stale generation. The implementation does call `loadState(sessionId)` again at line 421 to get `refreshedState.lastSpecFolder`. Good. However, the `stateBeforeStop` captured at line 313 is still used for `metrics.lastTranscriptOffset` at line 321 and as the autosave fallback at line 474. Between lines 313 and 421, another writer could advance both `lastSpecFolder` AND `metrics.lastTranscriptOffset` — the refresh catches the former but the latter uses the stale value. The consequence: `startOffset` at line 321 may be older than the actual last-parsed offset, causing transcript re-parsing of already-counted messages. `prepareStateForPersist` handles this at lines 243-246 by doing `Math.max(existingMetrics.lastTranscriptOffset, patchMetrics.lastTranscriptOffset)` — which would correct monotonic offset advancement. So this is effectively benign given the max-guard downstream, but the `stateBeforeStop` read is strictly-speaking stale. P2, architectural tidiness. No runtime issue observable today; only worth flagging because the T-SST-11 comment promises "fresh state read immediately before detection" and only delivers it for one field.

## Traceability Checks

- **spec -> code (reconsolidation)**: pass — Phase 016 research §4.4 and §8.2 identified `executeConflict` as missing CAS; Phase 017 T-RCB landed `hasPredecessorChanged` + `hasScopeRetagged`; code at `reconsolidation.ts:505-520, 557-571` implements the contract.
- **spec -> code (hook-state)**: pass — P0-A required Zod parse + quarantine + mtime re-read; code at `hook-state.ts:54-72, 301-317, 409-418` implements all three. CAS on schemaVersion is correct; `.bad` rename is atomic (renameSync on POSIX); mtime TOCTOU check catches in-flight writes.
- **spec -> code (migrated marker)**: pass — P0-C required a penalty-not-boost path for migrated graph-metadata candidates on packet-oriented queries; `stage1-candidate-gen.ts:292-320` applies `Math.max(0, currentScore - 0.12)` for migrated candidates vs. `Math.min(1, currentScore + 0.12)` for native ones. The penalty direction is correct.
- **spec -> code (TrustState exhaustiveness)**: pass — `trustStateFromGraphState` and `trustStateFromStructuralStatus` (`shared-payload.ts:643-670`) are exhaustive switches on the five/three input states with no default branch; TypeScript verifies exhaustiveness. `session-health.ts` uses `Extract<SharedPayloadTrustState, 'live'|'stale'|'absent'|'unavailable'>` to narrow to the 4-state subset and switches correspondingly. `code-graph/query.ts:238-280` uses `queryTrustStateFromFreshness` which returns one of the same four narrowed states. No missing `absent`/`unavailable` cases found in any handler.
- **spec -> code (session-stop atomic write)**: partial — the collapse is correctly single-write via `updateState(sessionId, patch)` at line 478; pre/post asserts around `updateResult.persisted` at lines 480-488 gate autosave on write success. See P2 finding #3 above for the narrow stale-read observation.

## Confirmed-Clean Surfaces

- `reconsolidation.ts:executeMerge()` — predecessor CAS (contentHash + updatedAt + importanceTier + scope) is correctly implemented and re-read inside the transaction (line 273-282). Append-only pattern is sound.
- `hook-state.ts:HookStateSchema` — Zod schema matches the shape actually written by `prepareStateForPersist`; `pendingCompactPrime.opaqueId` migration is handled lazily in `parseLoadedState`.
- `hook-state.ts:quarantineStateFile()` — atomic rename; caller isolates per-file error so a poisoned sibling does not mask valid state.
- `post-insert.ts:runPostInsertEnrichment()` executionStatus roll-up — failed/partial/ran aggregation is correct; extraction gate (`extractionRan` at line 247) correctly blocks downstream entity-linking when extraction failed or was skipped.
- `stage1-candidate-gen.ts:isMigratedGraphMetadataCandidate()` — correctly reads both DB-level `migrated` column and `qualityFlags` array, so the penalty applies whether the migration was marked at DB-level or via the quality-flag side-channel from `memory-parser.ts:331`.
- `session-stop.ts:detectSpecFolderResult()` — correctly uses `fstatSync` on the open descriptor (line 547) rather than re-stat on the path, so the tail-read is against the same generation.
- `shared-payload.ts:trustStateFromCache()` — returns `'stale'` when `cachedAt` is unparseable, which is the fail-closed default.

## Confirmed Already-Known (cross-reference to closing-pass-notes.md)

- CP-001 (P2) `code-graph/context.ts:97-105` readiness fail-open — not re-reviewed this iteration; iteration 2 scope.
- CP-002 (P2) `graph-lifecycle.ts:onIndex()` — not re-reviewed this iteration.
- CP-003 (P2) `entity-linker.ts:1131-1133` whole-corpus fallback — not re-reviewed this iteration.
- CP-004 (P2) `spec_kit_complete_confirm.yaml` boolean DSL — maintainability / traceability scope, not correctness.

## Convergence Signal

- Novel findings this iteration: 5 (2 P1, 3 P2)
- Overlap with prior Phase 016 research: partial — my P2 #1 (cleanStaleStates TOCTOU window) is a residual sub-window of P0-D (R3-003) that the original remediation closed only for the stat -> open window, not for the close -> unlink window. Not a reinforcement of an OPEN issue; it is a newly-identified residual seam.
- Overlap with closing-pass-notes CP-001..CP-004: none (all four CPs are out of this iteration's correctness scope).

## Next Iteration Angle

Iteration 2 should pivot to SECURITY dimension on:

- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` and `shared/predicates/boolean-expr.ts` — trust the S5/S7 structural refactors under adversarial input (malformed predicates, unicode normalization, prototype-pollution vectors).
- `hooks/claude/shared.ts` `escapeProvenanceField` against a wider exploit corpus than the T-GSH-01 regression test covers (e.g. right-to-left override, zero-width joiners, UTF-16 surrogates).
- `reconsolidation-bridge.ts` entry point — does the bridge validate that `newMemory.specFolder` actually matches the existing predecessor's `spec_folder` before calling `executeConflict`? Grep for the bridge's scope-guard contract.
- `session-bootstrap.ts` + `session-resume.ts` + `session-health.ts` — trust boundaries for session ID handling; can a forged session ID poison another session's state?
- Residual from this iteration: iteration 3 should re-examine P1 finding #1 (empty-string scope bypass) by grepping for actual writers of `tenant_id`/`user_id`/`agent_id`/`session_id` to verify whether empty-string writes are possible.

## Assessment

- Correctness of Phase 017 remediation is strong on the P0 composites. The Zod schema, CAS pattern, migration-marker flow, and atomic-write collapse are all correctly implemented against their stated contracts.
- The two P1 findings (scope-CAS empty-string edge case, partial-unresolved infinite-retry pairing) are narrow residuals that slipped through because Phase 016 focused on presence of CAS and presence of typed status; it did not re-examine the normalization boundary and the retry-exhaustion boundary. Neither is a regression; both are latent gaps.
- The three P2 findings are defense-in-depth hardening notes, not blockers.
- No new P0 surfaces found this iteration.
