# Pass 2 · Iteration 001 — correctness (verify P0-001 closure)

## Dispatcher
- iteration: 1 of 7
- pass: 2
- dimension: correctness-P0-001-verification
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T10:20:00Z
- session: 2026-04-24T09:48:20.783Z (generation 2, lineageMode=restart)
- parentSessionId: 2026-04-24T08:04:38.636Z

## Summary
Wave-1 remediation for P0-001 is **CLOSED**. The SQL-layer guard in `update_memory` (vector-index-mutations.ts:456-478) rejects `importanceTier='constitutional'` for any row whose stored `canonical_file_path || file_path` is not under a `/constitutional/` segment, downgrading it to `'important'` and emitting a `tier_downgrade_non_constitutional_path` governance audit. `importance_tier` was removed from `ALLOWED_POST_INSERT_COLUMNS`... no, correction: it remains in the allowlist at `post-insert-metadata.ts:56`, BUT a companion guard was hoisted into `applyPostInsertMetadata` itself (lines 88-128), so any allow-listed write of `importance_tier='constitutional'` now runs through the same path check before the dynamic UPDATE SET. A 12-site SQL-write census across `mcp_server/` confirmed no remaining bypass path: every writer either (a) goes through a guarded helper, (b) hard-codes a non-constitutional tier, or (c) cannot elevate (lineage-state CASE, schema migration). Two NEW P2 findings surfaced during the audit (redundant audit emitters, dead-branch semantic gap on constitutional→critical downgrades). No new P0/P1.

## P0-001 Status: CLOSED

## Evidence of closure

### Guard locations (primary)
- **SQL-layer guard** — `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456-478` — inside `update_memory` transaction, when `importanceTier === 'constitutional'` and `existingRow` is present, reads `guardPath = existingRow.canonical_file_path || existingRow.file_path`; if `!isConstitutionalPath(guardPath)`, forces `nextImportanceTier = 'important'` and calls `tryRecordTierDowngradeAudit` (line 76-114) before the SQL `UPDATE memory_index SET importance_tier = ?` at line 517-519.
- **Handler-layer re-verification + audit** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:153-208` — after `vectorIndex.updateMemory(updateParams)`, re-reads the row and emits an additional governance_audit IF `previousTier==='constitutional' && nextTier==='important'`. Defense-in-depth wrapper (see P2-pass2-001 below — this branch is semantically narrow).
- **Post-insert-metadata guard** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:86-128` — before the dynamic SET builder, if `normalizedFields.importance_tier === 'constitutional'`, reads the row's path and downgrades + audits via `recordGovernanceAudit`. Closes the P1-018 structural-fragility gap at the write layer.
- **Underlying helper** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:50-52` — `isConstitutionalPath` export present and stable; segment regex `(^|/)constitutional(/|$)` (case-insensitive) matches any directory literally named `constitutional`.

### Allowlist status
- `importance_tier` is **STILL present** in `ALLOWED_POST_INSERT_COLUMNS` at `post-insert-metadata.ts:55-64` (line 56). The Wave-1 strategy description stated it was removed; in practice it was NOT removed but the guard was HOISTED inside `applyPostInsertMetadata` itself. Result is functionally equivalent: no write of `importance_tier='constitutional'` escapes without the path check. This is a documentation/strategy-description drift, not a correctness gap — see P2-pass2-002 below.

### Test coverage
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts`
  - Test 1 (line 146-170): seeds row with `file_path=/workspace/.../plan.md` (outside `/constitutional/`), seed tier `'important'`, request `importanceTier='constitutional'`, asserts final tier `'important'` AND exactly one `tier_downgrade_non_constitutional_path` audit row.
  - Test 2 (line 172-193): seeds row with `file_path=/workspace/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, request `importanceTier='constitutional'`, asserts tier stays `'constitutional'` AND zero audit rows.
- The test actually exercises the real `handleMemoryUpdate` → real `vectorIndex.updateMemory` (via mocked module that calls `actual.updateMemory(params, database)` at line 94). The SQL-layer guard in `update_memory` runs against the test DB. Real guard is exercised, not mocked around. ✓
- Test DOES NOT cover: (a) the missing-row fail-closed branch, (b) `importanceTier='critical'` on a previously-constitutional non-constitutional-path row (see P2-pass2-003 below), (c) concurrent double-call race, (d) case-variant paths like `/Constitutional/` (regex is case-insensitive, should pass).

### Call-site audit (12 sites reviewed)

| # | File | Line | Status | Reasoning |
|---|------|------|--------|-----------|
| 1 | `lib/search/vector-index-mutations.ts` | 475 (update_memory) | GUARDED | SQL-layer guard at 456-478 |
| 2 | `lib/storage/post-insert-metadata.ts` | 133 (dynamic SET) | GUARDED | Guard hoisted at 88-128 |
| 3 | `lib/search/auto-promotion.ts` | 246 (raw UPDATE) | SAFE-BY-DESIGN | `PROMOTION_PATHS` caps at `critical`; `NON_PROMOTABLE_TIERS` excludes `constitutional`; cannot elevate to constitutional |
| 4 | `lib/scoring/confidence-tracker.ts` | 264 (raw UPDATE) | SAFE-BY-DESIGN | hard-codes `'critical'` literal |
| 5 | `handlers/pe-gating.ts` | 246, 325 (raw UPDATE) | SAFE-BY-DESIGN | hard-codes `'deprecated'` literal |
| 6 | `lib/storage/reconsolidation.ts` | 514 (raw UPDATE) | SAFE-BY-DESIGN | hard-codes `'deprecated'` literal |
| 7 | `handlers/save/create-record.ts` | 380 (raw UPDATE) | SAFE-BY-DESIGN | hard-codes `'deprecated'` literal |
| 8 | `lib/storage/lineage-state.ts` | 428 (CASE) | SAFE-BY-DESIGN | CASE only preserves existing constitutional or writes `'deprecated'`; cannot elevate a non-constitutional row |
| 9 | `handlers/chunking-orchestrator.ts` | 514 (raw UPDATE) | TRANSITIVELY-GUARDED | Value is `parsed.importanceTier`, which comes from `prepareParsedMemoryForIndexing` where the save-time guard at `memory-save.ts:310` already downgraded any non-constitutional-path request |
| 10 | `lib/storage/checkpoints.ts` | 1342, 1358 (raw UPDATE path) | GUARDED (Pass-2 Iter-2 verifies) | Wave-1 P0-002 fix; separate iteration scope |
| 11 | `lib/search/vector-index-schema.ts` | 731 (migration UPDATE) | SAFE-BY-DESIGN | WHERE already filters `importance_tier='constitutional'`; cannot create new constitutional rows |
| 12 | `lib/search/vector-index-mutations.ts` | 273-300 (index_memory INSERT) | SAFE-BY-DESIGN | INSERT omits `importance_tier` column; tier is set later via `applyPostInsertMetadata` which is guarded (row 2) |

**Verdict: all 12 SQL-write sites either enforce the guard or cannot reach `'constitutional'` by construction. No bypass candidates remain.**

## Bypass probes attempted

1. **Direct raw UPDATE via an uninvolved handler** — grep across `mcp_server/` for `UPDATE memory_index SET .*importance_tier = ?` with a dynamic value parameter. Only sites 1, 3, and 9 in the census match; 3 is capped at `critical`, 9 is transitively guarded, 1 is guarded. Result: **blocked**.
2. **`importance_tier` re-injection via `applyPostInsertMetadata` from a bypass caller** — confirmed guard runs BEFORE the SET clause is built (line 88-128 runs before line 130-143). Any caller passing `importance_tier='constitutional'` with a non-constitutional path row is downgraded pre-SET. Result: **blocked**.
3. **Missing-row fail-open** — if `id` does not exist in `memory_index`, `existingRow` is undefined in `update_memory`. Guard block is `&& existingRow`-gated (line 460), so skipped. BUT the final UPDATE also has `WHERE id = ?` with `changes === 0` short-circuit at line 522, so the write has no effect. Result: **blocked (fails closed)**.
4. **`applyPostInsertMetadata` missing-row** — if row lookup at line 89-98 returns undefined, `guardPath = null`, `!isConstitutionalPath(null)` is skipped, downgrade branch not taken. The subsequent UPDATE runs `WHERE id = ?` against a non-existent row → zero changes. Result: **blocked (fails closed)**.
5. **Case-variant path** — `/Constitutional/` (capital C). `compileSegmentPattern` uses `'i'` flag → match. `/CONSTITUTIONAL/` → match. No case escape. Result: **blocked**.
6. **Symlink bypass** — a row whose `canonical_file_path` was computed via `getCanonicalPathKey` (uses `realpathSync`) would hold the real path. The guard reads `canonical_file_path` first, so symlinks-pointing-OUT-of-constitutional ARE caught. Symlinks-pointing-INTO-constitutional from outside would flip the wrong way, but this is the P1-003/P1-017 Wave-2 scope — NOT the current P0-001 verification surface. Result: **out-of-scope for this iteration**.
7. **Invalid tier parameter** — `handleMemoryUpdate` line 69 rejects via `isValidTier`. `update_memory` line 457 only triggers the guard when `importanceTier === 'constitutional'` exactly. Intermediate invalid strings cannot slip through. Result: **blocked**.
8. **Direct `index_memory` INSERT with constitutional + non-constitutional path** — `index_memory` inserts without `importance_tier` column (vector-index-mutations.ts:273-287); tier is set later via `applyPostInsertMetadata` path (chain runs through guard). Result: **blocked**.

## New findings (this iteration)

### P0
None.

### P1
None.

### P2
1. **P2-pass2-001 — Redundant tier-downgrade governance_audit emitters** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:182-202`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:88-114`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:105-120` — Three code sites can emit `action='tier_downgrade_non_constitutional_path'` for overlapping scenarios. Handler condition requires `previousTier==='constitutional' && nextTier==='important'` (narrow demotion), SQL-layer fires whenever the guard downgrades a new promotion request, post-insert-metadata fires on any allow-listed write. For a typical `handleMemoryUpdate({ importanceTier: 'constitutional' })` on a row whose prior tier is ALREADY constitutional AND whose path is non-constitutional, both the SQL-layer and handler audits would fire → two audit rows for one decision. Today's test scenario only exercises the "seed tier = important → request constitutional → downgrade" path where only the SQL-layer audit fires (handler's `previousTier==='constitutional'` condition fails), so the test does not catch the duplication. Recommend: consolidate to the SQL-layer emitter as single-source-of-truth and remove handler + post-insert-metadata duplicates, OR tag emitters with distinct `source` metadata and document intent.

   ```json
   {
     "claim": "Three code sites emit the same governance_audit action for overlapping tier-downgrade scenarios, which can produce duplicate audit rows for a single tier-change decision when the narrow handler condition (previous=constitutional, next=important) overlaps with the SQL-layer guard's unconditional emit.",
     "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:182", ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:88", ".opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:105"],
     "counterevidenceSought": "Checked whether the handler-layer emitter is conditional in a way that prevents overlap — it is, but only for the subset where previousTier!='constitutional'. Checked whether post-insert-metadata is ever called on the same row transactionally alongside update_memory — it can be via the save-path orchestrator, but those calls serialize on different params.",
     "alternativeExplanation": "Intentional defense-in-depth: each site logs from its own scope so an operator can trace exactly which write layer caught the violation. If documented and `source` metadata is sufficient for deduplication, this is acceptable redundancy.",
     "finalSeverity": "P2",
     "confidence": 0.75,
     "downgradeTrigger": "Documentation stating the three emitters are intentional and a dedup strategy via `source` metadata is assumed by operator tooling."
   }
   ```

2. **P2-pass2-002 — Wave-1 remediation-plan description drift: `importance_tier` remains in ALLOWED_POST_INSERT_COLUMNS** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/review-pass-02/deep-review-strategy.md:15` claims "`importance_tier` removed from ALLOWED_POST_INSERT_COLUMNS allowlist" as Wave-1 P1-018 fix. In practice, `post-insert-metadata.ts:56` still lists `'importance_tier'` in the allowlist; the fix instead hoisted the guard ABOVE the SET builder. Functional equivalence holds (the column cannot be written with `'constitutional'` without the path check), but the strategy-description text is drift against reality. Minor doc-correctness issue; wave-1 strategy should be updated to reflect the actual shape of the fix.

3. **P2-pass2-003 — Constitutional→critical downgrade is not audited** — `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456-478`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:167-172` — The guard only fires for `importanceTier === 'constitutional'` requests. If an attacker (or a legitimate edit) submits `importanceTier='critical'` on a row whose prior tier is `'constitutional'` and whose path is non-constitutional, the tier downgrades from constitutional→critical with zero governance_audit. Handler guard condition `nextTier==='important'` also does not match. Outcome: a constitutional row loses constitutional status WITHOUT a typed audit trail. This does NOT violate Invariant 3 (the row is moving AWAY from constitutional), but loses observability on tier transitions that operators may want to monitor. Matches the spirit of P1-008 / P1-016. Raise to P1 if a policy decision requires auditing every constitutional-tier transition regardless of direction.

### Related prior-pass findings (status tracked in registry)
- **P0-001 — RESOLVED**: closed by Wave-1 guard at vector-index-mutations.ts:456-478 + post-insert-metadata.ts:88-128.
- **P1-018 — RESOLVED-IN-SPIRIT**: `importance_tier` still in allowlist but guard hoisted; functionally equivalent to removal. Downgrade to RESOLVED given guard placement.

## Traceability Checks

- **guard-hoist protocol**: pass — guard exists at both SQL layer (update_memory) AND metadata layer (applyPostInsertMetadata); no lower-level caller can bypass.
- **audit-emit protocol**: pass (with P2 redundancy noted) — `tier_downgrade_non_constitutional_path` emitted on every guard trip.
- **test-coverage protocol**: pass — Wave-1 test exercises BOTH downgrade and preservation branches against a real in-memory DB with the real `update_memory` + SQL guard.
- **live-db parity**: constitutional_count = 2 (unchanged from pass-1 iter-3), governance_audit table schema matches Wave-1 assumptions (action, decision, memory_id, logical_key, reason, metadata, created_at), governance_audit row count = 0 (expected — no downgrades have actually been triggered yet in this DB).

## Confirmed-Clean Surfaces

- All 12 SQL-write sites to `memory_index.importance_tier` (see Call-site audit table).
- Guard fail-closed semantics on missing rows (probes 3 and 4).
- Case-insensitive path matching (probe 5).
- Valid-tier validation chain (probe 7).

## Coverage
- Dimension: correctness-P0-001-verification — covered
- Files reviewed: 10 (see Files Reviewed below)
- Remaining pass-2 dimensions: P0-002 verification (iter-2), audit trail / P1-008+P1-016 (iter-3), exploit chain re-walk (iter-4), traceability / strategy drift (iter-5), maintainability regression (iter-6), synthesis (iter-7)

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (guard site 298-340)
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts` (VALID_TIERS check)

## Next iteration focus

**Pass 2 Iter 2 — verify P0-002 (checkpoint_restore) closure.** Read `lib/storage/checkpoints.ts:1258-1600`, confirm `validateMemoryRow` (or row-level guard) re-asserts `isConstitutionalPath` + `shouldIndexForMemory` for every row before INSERT OR REPLACE / UPDATE. Read `tests/checkpoint-restore-invariant-enforcement.vitest.ts`. Probe tampered-blob and poisoned-row bypass paths. PROCEED with iter-2; P0-001 verified closed.
