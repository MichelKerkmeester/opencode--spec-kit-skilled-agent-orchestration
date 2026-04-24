# Pass 2 · Iteration 006 — exploit-chain regression re-walk

## Dispatcher
- iteration: 6 of 7
- pass: 2
- dimension: regression-exploit-chain
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T12:00:00Z
- session: 2026-04-24T09:48:20.783Z (generation 2, lineageMode=restart)
- parentSessionId: 2026-04-24T08:04:38.636Z

## Summary

All 5 steps of the pass-1 iter-7 compound exploit chain are re-verified **BLOCKED** against the current Wave-1 patched code, re-read fresh (not relying on iter-2 conclusions). Each step fails at a specific, named guard with the audit row emitted or the transaction rolled back. No NEW P0 discovered. The Wave-1 attack surface (new `recordGovernanceAudit` emitters, Wave-1 SQL-layer guard, Wave-1 checkpoint validator) contains no exploitable weaponization path: the audit writer is parameterized and append-only, the guard's `canonical_file_path || file_path` precedence fails closed on missing/empty, and the validator's exceptions are caught by `Restore validation failed:` wrapper at checkpoints.ts:1642 which propagates rollback. The three pass-1 P1s spot-checked in iter-4 (P1-001 TOCTOU, P1-003 symlink, P1-013/014 exclusion SSOT) remain open with NO regression. Wave-1 tests remain structurally consistent with the current code-under-test. **Convergence verdict: no P0 veto, 1 P1 (P1-pass2-004 cleanup audit gap) remains the only active non-P2 finding.**

One RESIDUAL analytical observation worth registering but NOT promoting: a forged-checkpoint-blob scenario where an attacker sets `canonical_file_path='/constitutional/X.md'` and `file_path='/z_future/Y.md'` (divergence trick) would pass the validator (which prefers canonical) and insert a row whose stored `file_path` points at z_future. This is reachable ONLY via direct SQLite file write access (the `createCheckpoint` MCP path builds snapshots from the already-guarded `memory_index`), which is a different threat model (filesystem/root access) and is covered by pass-1 P1-003/P1-017 (symlink/canonical divergence) deferred to Wave-2. It is NOT a Wave-1 regression.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` (tryRecordTierDowngradeAudit :76-114; update_memory :440-524; canonicalFilePath UPDATE path :479-481)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (handler destructure :43-75; updateParams population :85-89; in-transaction audit :153-208)
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (memoryUpdate :294-298; checkpointCreate :329-345; checkpointRestore :363-378)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (validateMemoryRow :1280-1360; restoreTx :1628-1838; runPostRestoreRebuilds :1102-1180; writers survey)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (recordGovernanceAudit :304-334)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (prepareParsedMemoryForIndexing :298-340)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` (constitutional cache :176-212)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts` (PROMOTION_PATHS :47-50; NON_PROMOTABLE_TIERS :62-67)
- Cross-ref greps: `INSERT INTO checkpoints`, `UPDATE memory_index SET importance_tier`, `realpathSync`, exclusion constants

## Chain re-walk (5 steps — fresh verification)

| Step | Attack vector | Guard that blocks | File:line | Audit row emitted | Verdict |
|---|---|---|---|---|---|
| 1 | `memory_update({ id, importanceTier: 'constitutional' })` on non-constitutional-path row | SQL-layer guard inside `update_memory` transaction: `!isConstitutionalPath(guardPath)` where `guardPath = canonical_file_path || file_path`; forces `nextImportanceTier = 'important'` and calls `tryRecordTierDowngradeAudit` BEFORE the `UPDATE memory_index SET ...` statement | `lib/search/vector-index-mutations.ts:456-478` (guard) → `:517-519` (UPDATE) | `tier_downgrade_non_constitutional_path` with `decision=conflict`, `source=update_memory` — emitted via `tryRecordTierDowngradeAudit` at :88-106; try/catch wrapper at :107-113 logs via `logger.warn` on audit-write failure (primary op not failed) | **BLOCKED** — guard downgrades tier, audit row written; MCP tool returns success (silent downgrade is by design — handler does not throw) |
| 2 | Alter `file_path` (or `canonical_file_path`) via some tool on UPDATE | `memory_update` schema at `tool-schemas.ts:297` has `additionalProperties: false` and lists ONLY `{id, title, triggerPhrases, importanceWeight, importanceTier, allowPartialUpdate}` — no `filePath` / `canonicalFilePath` / `canonical_file_path` / `file_path` property. Handler `memory-crud-update.ts:48-55` destructures the same whitelist; `updateParams` population at :85-89 never assigns path fields. No other MCP tool accepts path mutation on UPDATE (grep of `tool-schemas.ts` confirms no update/write tool exposes `filePath` or `canonicalFilePath`). Note: `update_memory` internally HAS a `canonicalFilePath` write branch at vector-index-mutations.ts:479-481, but it is unreachable from MCP — no handler populates that `UpdateMemoryParams` field. | `tool-schemas.ts:297` (schema) + `handlers/memory-crud-update.ts:48-89` (handler) | N/A — schema validation rejects extra properties before handler dispatch | **BLOCKED** at schema layer (MCP validateToolArgs returns error before handler runs) |
| 3 | Direct write to `checkpoints` table bypassing `checkpoint_create` | Only one production writer: `checkpoints.ts:1428` inside `createCheckpoint`, which builds the snapshot from the ALREADY-GUARDED `memory_index`. Grep for `INSERT INTO checkpoints` / `UPDATE checkpoints` outside `checkpoints.ts` returns only test-file hits (`tests/checkpoints-storage.vitest.ts:244`, `tests/checkpoint-completeness.vitest.ts:468`, `tests/checkpoint-restore-invariant-enforcement.vitest.ts:102`, `tests/checkpoints-extended.vitest.ts` — all use test-only DB). No MCP handler exposes checkpoint-blob mutation. No tool accepts `memory_snapshot` as input. Attacker-controlled direct write requires SQLite-file filesystem access (separate threat model). | `lib/storage/checkpoints.ts:1428` (sole prod writer) | N/A — direct-write path not exposed via MCP | **BLOCKED** via MCP surface; any bypass requires filesystem/root access (out-of-scope for Wave-1 invariant contract) |
| 4 | `checkpoint_restore` with mutated snapshot | `validateMemoryRow` at `checkpoints.ts:1291-1360`, called inside restore transaction at `:1637-1645` BEFORE any INSERT/UPDATE. Excluded-path rows (`z_future`/`external`/`z_archive`) → `throw Error('path excluded from memory indexing')` → caught at :1641 and re-thrown as `Restore validation failed: ...` at :1642 → aborts `database.transaction(...)` at :1636 → SQLite atomic rollback. Constitutional-on-non-constitutional-path rows → mutate `r.importance_tier = 'important'` at :1358 + push `tier_downgrade_non_constitutional_path` to `governanceAudits[]` (deferred flush). Validation is a pre-flight SWEEP over ALL rows before insertion loop → if ANY row fails, NO rows are written. | `checkpoints.ts:1291-1360` (validator) + `:1636-1645` (pre-flight sweep inside txn) + `:1847` (flushGovernanceAudits in outer finally, survives rollback) | `checkpoint_restore_excluded_path_rejected` (decision=deny) for z_future/external paths; `tier_downgrade_non_constitutional_path` (decision=conflict) for non-constitutional-path constitutional rows. Both survive rollback via deferred-flush pattern. | **BLOCKED** — atomic abort on exclusion violation; tier downgrade + audit on tier violation; both audit paths survive transaction rollback |
| 5 | Post-restore async pipelines poisoning (embedding regen, auto-surface hook, consolidation, vector backfill) | Validator MUTATES `r.importance_tier = 'important'` at `:1358` BEFORE `memoryInsertStmt.run(...)` at `:1755`. Row inserted already has corrected tier. `runPostRestoreRebuilds` at `:1102-1180` operates on post-insertion memory_index state. Auto-surface hook at `hooks/memory-surface.ts:185-193` reads `WHERE importance_tier='constitutional'` at query time (with TTL cache); `clear_constitutional_cache()` is called by `vector-index-mutations.ts:477` on every tier write. Auto-promotion at `auto-promotion.ts:47-67` has `PROMOTION_PATHS = {normal→important, important→critical}` — CANNOT write `constitutional`. `NON_PROMOTABLE_TIERS` includes `constitutional`. Reconsolidation hard-codes `'deprecated'`. No async path elevates tier. | `checkpoints.ts:1358` (pre-insert mutation) + `auto-promotion.ts:47-67` (cap) + `hooks/memory-surface.ts:185` (query-time read) | N/A — no poison reaches async stage | **NOT A RISK** — tier corrected before insertion; async paths cannot re-elevate |

**Chain integrity verdict: FULLY SEVERED.** The compound pass-1 P0-001 + P0-002 attack chain has no viable path. Every step from pass-1 iter-7 terminates at a named guard, and the residual observations (forged-blob divergence, `update_memory` dormant canonical write path) require out-of-band capabilities (direct filesystem access, non-existent handler field) that are out-of-scope for Wave-1.

## Wave-1 attack surface probes

| Probe | Analysis | Result |
|---|---|---|
| 6 — Audit writer weaponization | `recordGovernanceAudit` at `scope-governance.ts:314-334` is a parameterized prepared-statement INSERT. `reason` and `metadata` accept attacker-controllable strings/objects, but `metadata` is `JSON.stringify()`-serialized → no SQL injection. No rate limiting. An attacker running `memory_update({importanceTier:'constitutional'})` in a loop would produce one audit row per call (1:1 ratio, no amplification). DoS via audit table growth is theoretically possible but requires many MCP-authenticated calls; no trust-boundary bypass. | **No weaponization; DoS via amplification not present (1:1 ratio)** |
| 7a — NULL canonical_file_path (legacy row) | Validator at `checkpoints.ts:1320-1322`: `resolvedPath = canonical_file_path || file_path`. If `canonical_file_path` is null/undefined/empty, falls back to `file_path`. If `file_path` also null/empty → `shouldIndexForMemory(null)` → returns false (regex match on null/empty fails) → row rejected. Additionally the strict check at :1305 `typeof r.file_path !== 'string' \|\| !r.file_path` throws FIRST, before the resolvedPath logic. | **Fails closed** |
| 7b — canonical vs file_path disagreement | Precedence: canonical wins when non-empty. If attacker forges `canonical='/constitutional/safe' + file_path='/z_future/evil'` in a snapshot blob (requires direct DB write — Step 3 blocks this via MCP), validator passes (canonical is under /constitutional/) AND `shouldIndexForMemory('/constitutional/safe')` passes (constitutional is not in EXCLUDED). Row inserted with divergent paths and constitutional tier. This is a KNOWN divergence bypass — covered by pass-1 P1-003/P1-017 (symlink/canonical divergence deferred to Wave-2). NOT a Wave-1 regression; reachable only via direct filesystem write to SQLite (out of MCP threat model). | **Known divergence (P1-003/P1-017); not reachable via MCP** |
| 8a — Validator crash via malformed blob | Validator's required-type checks at :1296-1317 throw typed errors (`Checkpoint row N: X`) on non-object, non-number id, non-string file_path/spec_folder, missing required fields. Each throw is caught by `checkpoints.ts:1641` catch block → re-thrown as `Restore validation failed: ...` → transaction rolls back cleanly. No exception escapes the wrapper. No `JSON.parse` inside the validator (metadata is already deserialized upstream). | **Exception handler safe; no crash path** |
| 8b — DoS via giant checkpoint blob | The blob is decompressed + parsed upstream (not inside validator). Validator iterates rows with bounded per-row work (finite type checks + 2 regex). Giant blob would consume memory during parse, but the blob size cap (if any) is an orthogonal concern tied to `checkpoint_create`; Wave-1 did not introduce new surface here. Blob size is bounded by whatever `createCheckpoint` would produce from the legitimate `memory_index` — it cannot grow beyond reality. Direct-write attackers could supply arbitrary blobs, but they already have DB access. | **No Wave-1 regression; size bound tied to createCheckpoint upstream** |

## Pass-1 P1 spot-check (3 items still open, no regression)

- **P1-001 TOCTOU in cleanup**: **still open, no regression.** Wave-1 did not modify the cleanup script at all (confirmed iter-4). No new TOCTOU surface introduced in the 4 Wave-1 files. Deferred to Wave-2.
- **P1-003 symlink bypass**: **still open, no regression.** Grep for `realpathSync` across `memory-save.ts`, `checkpoints.ts`, `vector-index-mutations.ts`, `post-insert-metadata.ts` returns ZERO hits. Save-time guard uses `path.resolve` only; checkpoint validator uses stored canonical path as-is. Symlink-INTO-/constitutional/-pointing-OUT variant (pass-1 iter-7 A.3) is NOT closed. Wave-1 guards inherit the same symlink vulnerability. Deferred to Wave-2.
- **P1-013/014 exclusion SSOT (3 parallel sources)**: **still open, no regression.** Three sources confirmed: `lib/utils/index-scope.ts:25` (EXCLUDED_FOR_MEMORY, 4 hits), `lib/config/spec-doc-paths.ts:29` (SPEC_DOCUMENT_EXCLUDED_SEGMENTS, 2 hits), `handlers/memory-index-discovery.ts:28` (SPEC_DOC_EXCLUDE_DIRS, 3 hits). Wave-1 did NOT add a 4th source (Wave-1 guard sites consume `shouldIndexForMemory` which routes through `EXCLUDED_FOR_MEMORY` only). Deferred to Wave-2.

## Wave-1 test re-verification

- `tests/checkpoint-restore-invariant-enforcement.vitest.ts` — asserts exist at lines 124-159 (poisoned-constitutional downgrade), 161-212 (walker-excluded row aborts restore with baseline id=9 survival), 214-244 (clean-constitutional preservation). All assertions map to current guard shape: `governanceAudits` flushed in outer finally (verified iter-2), `INSERT OR REPLACE / INSERT OR IGNORE` statements gated by pre-flight sweep (verified iter-2), `r.importance_tier = 'important'` mutation at :1358 (verified iter-2). Test code would pass if executed against current code.
- `tests/memory-crud-update-constitutional-guard.vitest.ts` — asserts at lines 146-193 match the current `vector-index-mutations.ts:456-478` SQL-layer guard behavior (downgrade + audit for non-constitutional path; preserve for constitutional path). Test code would pass if executed against current code.
- `tests/memory-save-index-scope.vitest.ts` — per iter-3 the audit action string checks at :345,368,394 match current `memory-save.ts:315-329` emission. Test code would pass if executed against current code.

Runtime execution was not performed (read-only review context); structural validation only.

## New findings (this iteration)

### P0
None.

### P1
None.

### P2
None.

### Related prior-pass findings (status tracked in registry)
- **P0-001** — RESOLVED (confirmed iter-1, re-validated here via Step 1 chain re-walk).
- **P0-002** — RESOLVED (confirmed iter-2, re-validated here via Step 4 chain re-walk).
- **P1-008** — RESOLVED (iter-3, re-confirmed via Step 1 audit emission).
- **P1-016** — RESOLVED (iter-3, re-confirmed via Step 1 audit emission).
- **P1-018** — RESOLVED-IN-SPIRIT (iter-1, allowlist retained but guard hoisted; functionally equivalent).
- **P1-010/P1-011/P1-012** — RESOLVED (iter-5 doc drift closure).
- **P1-pass2-004** — OPEN (iter-3 cleanup-script audit gap; confirmed no Wave-1 fix; remains Wave-2 scope).
- **P1-003 / P1-017** — OPEN (symlink/canonical divergence; re-confirmed no Wave-1 fix in this iteration).
- **P1-001 / P1-013 / P1-014 / P1-015** — OPEN (iter-4 spot-check confirmed status, re-confirmed here).

## Traceability Checks

- **chain-reachability protocol**: pass — all 5 pass-1 chain steps re-verified severed at named guards with file:line citations; no step reopens.
- **wave1-attack-surface-no-regression protocol**: pass — audit writer, SQL-layer guard, checkpoint validator all audited for exploitable weaponization; none found.
- **pass1-P1-regression protocol**: pass — P1-001, P1-003, P1-013/014 spot-checked; all still open, no improvement, no worsening.
- **test-assertions-match-code protocol**: pass — all three Wave-1 tests structurally validate against current code shape (runtime execution not performed).
- **async-pipeline-no-re-elevation protocol**: pass — auto-promotion capped at critical; reconsolidation hard-codes deprecated; no async tier-elevating writer exists.
- **schema-level-step-2-block protocol**: pass — `memory_update` schema whitelists 6 properties, `additionalProperties: false`, no path fields; dormant `canonicalFilePath` write branch in `update_memory` is unreachable from MCP.
- **divergence-residual-observation protocol**: partial — forged-blob canonical vs file_path divergence requires filesystem access (out of MCP threat model); covered by pass-1 P1-003/P1-017; not a Wave-1 regression.

## Confirmed-Clean Surfaces (this iteration)

- All 5 pass-1 exploit-chain steps blocked at identified guards with named audit emissions.
- Wave-1 audit writer (`recordGovernanceAudit`) has no amplification/DoS weaponization path.
- Checkpoint validator exception handler wraps every per-row throw in `Restore validation failed:` and cleanly rolls back the transaction.
- `update_memory` dormant `canonicalFilePath` write branch is present in library code but unreachable from MCP (no handler populates the field).
- Post-restore async pipelines (`runPostRestoreRebuilds`, auto-surface cache, auto-promotion, reconsolidation) operate on corrected tier state; no re-elevation path.
- Wave-1 tests structurally consistent with current shipped code; assertions would pass under real execution.
- Pass-1 P1s (001, 003, 013, 014, 015) remain open with no Wave-1-introduced regression.

## Coverage

- Dimension: regression-exploit-chain — covered
- Files reviewed: 9 source files + cross-ref greps (see Files Reviewed)
- Pass-2 dimensions complete: correctness (iter-1, iter-2), audit-trail (iter-3), maintainability (iter-4), traceability (iter-5), regression-exploit-chain (iter-6)
- Remaining pass-2 dimensions: synthesis (iter-7 only)

## Next iteration focus

**Pass 2 Iter 7 — final synthesis + `review-report-pass-02.md`.** Consolidate findings across iter-1..iter-6: Wave-1 closures (P0-001, P0-002, P1-008, P1-016, P1-018 functional-equivalent, P1-010, P1-011, P1-012), pass-2-new findings (P1-pass2-004 cleanup-script audit gap, P2-pass2-001..007), pass-1 deferred items still open (P1-001, P1-003, P1-013, P1-014, P1-015, P1-017, plus pass-1 P2s not closed). Produce a final verdict (PASS / CONDITIONAL / FAIL) under the pass-2 gate rules: no active P0 ⇒ not FAIL; 1 active P1 (P1-pass2-004) ⇒ CONDITIONAL. Recommend remediation route (Wave-2 scope update to include cleanup-script audit emission + the three doc-drift P2s from iter-5). No further code verification needed; iter-7 is documentation synthesis only.
