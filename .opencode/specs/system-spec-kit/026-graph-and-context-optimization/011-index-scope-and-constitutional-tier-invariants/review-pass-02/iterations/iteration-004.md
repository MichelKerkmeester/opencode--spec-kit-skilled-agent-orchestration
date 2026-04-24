# Pass 2 · Iteration 004 — maintainability + Wave-1 introduced debt

## Dispatcher
- iteration: 4 of 7
- pass: 2
- dimension: maintainability
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T11:20:00Z
- session: 2026-04-24T09:48:20.783Z (generation 2, lineageMode=restart)
- parentSessionId: 2026-04-24T08:04:38.636Z

## Summary

Wave-1 is **functionally correct but carries mild maintainability debt**. The patches correctly reuse `isConstitutionalPath` / `shouldIndexForMemory` from the canonical path-policy helper (no re-implemented path checks). However, the governance-audit emission pattern is copy-pasted across five production sites: only one of them (`vector-index-mutations.ts`) extracted a local helper `tryRecordTierDowngradeAudit`, and that helper is module-scoped rather than exported. The other four sites each rebuild the `recordGovernanceAudit(...)` payload inline with the same action string, decision, `requestedTier`/`appliedTier` shape, and logical-key builder. Action strings `'tier_downgrade_non_constitutional_path'` and `'checkpoint_restore_excluded_path_rejected'` are free-floating string literals (5 prod + 3 test sites for the first, 1 prod + 1 test for the second) with no enum or constant. Zero inline ADR back-references were added to any Wave-1 guard site — pass-1 **P1-015 remains open**. Logger usage is mixed (`console.warn` in 3 sites, `logger.warn` in 1). Pass-1 **P1-003 (symlink bypass)** was NOT addressed — zero `realpathSync` additions anywhere in Wave-1. Pass-1 **P1-013/014 (three parallel exclusion sources)** remains three sources exactly — Wave-1 did NOT add a fourth and did NOT unify; status quo preserved (deferred to Wave-2 as expected). Wave-1 tests are hermetic (`:memory:` DBs, no production-DB contamination). No regressions detected on the spot-checked pass-1 P1s. Net new: **1 P2 debt finding**. Pass-1 **P1-pass2-004 (cleanup-script audit gap from iter-3)** is classified as natural Wave-2 deferral, NOT a Wave-1 regression.

## Wave-1 debt audit

- **Duplication**: YES — `recordGovernanceAudit(...)` payload for `tier_downgrade_non_constitutional_path` is copy-pasted inline across 5 sites:
  - `lib/search/vector-index-mutations.ts:88-106` (wrapped in local helper `tryRecordTierDowngradeAudit`, line 76-114; **helper is NOT exported**)
  - `lib/storage/post-insert-metadata.ts:105-120` (inline, no helper)
  - `handlers/memory-save.ts:315-329` (inline, no helper)
  - `handlers/memory-crud-update.ts:182-202` (inline, no helper)
  - `lib/storage/checkpoints.ts:1343-1357` (inline as queued `GovernanceAuditEntry`, legitimately different shape because of deferred-flush pattern)
  - Each site rebuilds: `action`, `decision`, `memoryId`, `logicalKey` via local `spec_folder::path::anchor` concatenation, `reason`, and `metadata` object with `source`, `requestedTier`, `appliedTier`, `filePath`, `canonicalFilePath`. Drift risk: if the payload contract changes (add `tenantId`, change `source` enum), operator must update 5 sites. 4 of the 5 paths deviate subtly — e.g., memory-save uses `::_` as anchor sentinel while the others use conditional anchor. File payload shape drift is already visible (some emit `previousTier`, some do not).
- **Dead code**: NO. After the guard hoist in `post-insert-metadata.ts:88-128`, the dynamic SET builder (line 130-143) with `ALLOWED_POST_INSERT_COLUMNS` check still runs for every field (including `importance_tier`). No dead branches. The allowlist retains `importance_tier` intentionally (see P2-pass2-002 traceability drift).
- **ADR back-refs**: **ZERO**. `grep -n "ADR-0\|packet 011\|Invariant 3\|INVARIANT"` across all 5 Wave-1 files returned no hits. P1-015 (pass-1) stays open even after Wave-1.
- **Magic strings**: NOT defined as constants.
  - `'tier_downgrade_non_constitutional_path'` appears as bare string literal at 5 prod sites (`vector-index-mutations.ts:89`, `post-insert-metadata.ts:106`, `checkpoints.ts:1344`, `memory-save.ts:316`, `memory-crud-update.ts:183`) + 3 test sites (`memory-save-index-scope.vitest.ts:345,368,394`, `memory-crud-update-constitutional-guard.vitest.ts:168`, `checkpoint-restore-invariant-enforcement.vitest.ts:157`).
  - `'checkpoint_restore_excluded_path_rejected'` at `checkpoints.ts:1326` + `checkpoint-restore-invariant-enforcement.vitest.ts:210`.
  - No `GOVERNANCE_AUDIT_ACTIONS` enum or const-namespace. Typo in any one site would silently produce an unaudited row.
- **JSDoc coverage**: PARTIAL.
  - `tryRecordTierDowngradeAudit` (vector-index-mutations.ts:76): **no JSDoc** — purpose, fail-safe semantics, transaction-context expectations undocumented.
  - `prepareParsedMemoryForIndexing` (memory-save.ts:298): **no JSDoc** — the new invariant-enforcing block at :310-337 is the primary save-time guard, yet the function header has no description.
  - `applyPostInsertMetadata` (post-insert-metadata.ts:82): **has JSDoc** (`Build and execute a dynamic UPDATE...`), but it does NOT mention the newly-hoisted constitutional guard at :88-128 — stale documentation relative to behavior.
  - `validateMemoryRow` (checkpoints.ts:1291): **has JSDoc** (`Strict on identity fields...`) — correctly describes strict/required/optional policy AND mentions the restore-time use context. Best-documented Wave-1 site.
  - `recordGovernanceAudit` (scope-governance.ts:314): **has JSDoc** — stable, no drift.
- **Test hermeticity**: HERMETIC.
  - `memory-crud-update-constitutional-guard.vitest.ts:9` → `new Database(':memory:')`.
  - `checkpoint-restore-invariant-enforcement.vitest.ts:11` → `new Database(':memory:')`.
  - Zero hits on `context-index__voyage__voyage-4__1024.sqlite` or any production SQLite path in either test file. ✓
- **Logging consistency**: MIXED.
  - `lib/search/vector-index-mutations.ts:108` uses `logger.warn('Failed to record governance audit...', {...})`.
  - `lib/storage/post-insert-metadata.ts:122-125` uses `console.warn('[post-insert-metadata] governance_audit insert failed...', error...)`.
  - `handlers/memory-save.ts:311, 331` uses `console.warn('[memory-save] ...', ...)`.
  - `handlers/memory-crud-update.ts:204-206` uses `console.warn('[memory-crud-update] ...', ...)`.
  - One site uses the structured logger, four sites use `console.warn` with a bracketed-tag prefix. Same inconsistency that was flagged pre-Wave-1 — Wave-1 did NOT unify, but also did NOT introduce a 2nd logger abstraction. Status quo preserved.

## Pass-1 P1 spot-check (3 items)

- **P1-001 TOCTOU in cleanup**: STATUS = still open, no regression. Wave-1 did NOT touch the cleanup-script transaction boundary (it didn't touch the cleanup script at all; that is the root of P1-pass2-004). No new TOCTOU surface introduced. Deferred to Wave-2.
- **P1-003 symlink bypass**: STATUS = still open, no regression. Grep for `realpathSync` / `fs.realpath` across all 5 Wave-1 files returned ZERO hits. Wave-1 did not add symlink resolution to the save-path guard (`memory-save.ts:306` uses `path.resolve` only, no realpath) nor to the checkpoint validator (`checkpoints.ts:1320-1322` reads stored paths directly). A symlink whose link-target sits under `/constitutional/` while the link itself is outside would still bypass `isConstitutionalPath`. Not worse, but the new guard sites inherit the same vulnerability. Partial fix? **NO — zero sites fixed**. Deferred to Wave-2.
- **P1-013/014 exclusion SSOT**: STATUS = still open, no regression, no improvement. Exactly three parallel exclusion sources remain:
  - `lib/utils/index-scope.ts:25` → `EXCLUDED_FOR_MEMORY` (path-regex list, used by `shouldIndexForMemory`, called by Wave-1 sites).
  - `lib/config/spec-doc-paths.ts:29` → `SPEC_DOCUMENT_EXCLUDED_SEGMENTS` (used at :72 by spec-doc classifier).
  - `handlers/memory-index-discovery.ts:28` → `SPEC_DOC_EXCLUDE_DIRS` Set (used at :75, :226 for fs-walker gating).
  - Wave-1 touched `post-insert-metadata.ts` (allowlist) but did NOT remove any exclusion source, did NOT add a 4th source. All Wave-1 guard sites correctly consume `shouldIndexForMemory` (route through `EXCLUDED_FOR_MEMORY` only) — no new divergence introduced. Unification is Wave-2 scope; status preserved.

## Cleanup-script gap classification (follow-up to iter-3 P1-pass2-004)

Re-read the Wave-1 mandate: the original prompt-to-Wave-1 specifically named:
1. `memory-save.ts:310-315` (save-path guard) — DONE at :298-337.
2. `memory-crud-update.ts` audit — DONE at :153-208.
3. `vector-index-mutations.ts` SQL-layer guard — DONE at :456-478.
4. `post-insert-metadata.ts` guard hoist — DONE at :88-128.
5. `checkpoints.ts` `validateMemoryRow` extension — DONE at :1291-1360.
6. Two vitest test files — DONE.

The cleanup script `scripts/memory/cleanup-index-scope-violations.ts` was **NOT explicitly named in the Wave-1 scope**. Its audit-gap is therefore a natural Wave-2 deferral, not a Wave-1 regression. P1-pass2-004 is correctly filed at P1 (iter-3) and remains open for Wave-2 patching, but it should NOT be held against Wave-1's completion verdict.

## New findings (this iteration)

### P0
None.

### P1
None.

### P2
1. **P2-pass2-004 — Governance-audit emission pattern duplicated across 5 sites without shared helper or action-string constants** — `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:76-114` (local-only `tryRecordTierDowngradeAudit`, not exported), `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:105-120` (inline duplicate), `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:315-329` (inline duplicate), `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:182-202` (inline duplicate), `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1343-1357` (legitimate variant for deferred-flush). Plus action strings `'tier_downgrade_non_constitutional_path'` (5 prod + 3 test) and `'checkpoint_restore_excluded_path_rejected'` (1 prod + 1 test) are bare string literals with no enum. Drift risk: a payload-shape change or a typo in any one site produces silent audit-row divergence. Also: the `tryRecordTierDowngradeAudit` helper exists and has the right shape, but it is module-scoped to `vector-index-mutations.ts` — four other sites could use it if it were exported. Recommend: (a) move `tryRecordTierDowngradeAudit` to `lib/governance/scope-governance.ts` alongside `recordGovernanceAudit` and export it, (b) define a `GOVERNANCE_AUDIT_ACTIONS` const-namespace enum with `TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH` and `CHECKPOINT_RESTORE_EXCLUDED_PATH_REJECTED`, (c) reuse the helper at memory-save, post-insert-metadata, memory-crud-update call sites — `checkpoints.ts` deferred-flush remains a legitimate variant and stays as-is.

```json
{
  "claim": "The Wave-1 governance-audit emission logic is copy-pasted inline at 5 production sites with subtle per-site variations (anchor sentinel, metadata shape) and uses bare string literals for action names instead of shared constants, creating drift risk on any future contract change.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:76 (local-only tryRecordTierDowngradeAudit, not exported)",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:105 (inline recordGovernanceAudit with rebuilt payload)",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:315 (inline recordGovernanceAudit with rebuilt payload + differing anchor sentinel '::_')",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:182 (inline recordGovernanceAudit with rebuilt payload + extra previousTier field)",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1343 (queued GovernanceAuditEntry — legitimate variant for deferred-flush)",
    "grep of action string 'tier_downgrade_non_constitutional_path' returns 5 production + 3 test sites with no enum/constant"
  ],
  "counterevidenceSought": "Checked whether scope-governance.ts exports a builder helper — it does not; only the low-level recordGovernanceAudit writer is exported. Checked whether any shared constants module (e.g., lib/governance/actions.ts) defines the action strings — no such module exists; grep confirms only bare literals. Checked whether checkpoints.ts's deferred-flush pattern is a legitimate variant — yes, because rollback-survivability requires post-transaction flushing and the helper's eager-insert shape would not fit.",
  "alternativeExplanation": "Intentional local-scope duplication: Wave-1 prioritized correctness and minimally-invasive edits over shared abstractions, deferring DRY cleanup to Wave-2 / Wave-3. This is consistent with the stated Wave-1 scope (close P0s and primary P1s first). If Wave-2 has 'unify governance-audit emission' on its plan, P2 severity is appropriate.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "Wave-2 plan explicitly schedules extraction of tryRecordTierDowngradeAudit to scope-governance.ts and introduction of a GOVERNANCE_AUDIT_ACTIONS enum. Then this finding is accepted-as-deferred."
}
```

### Related prior-pass findings (status tracked in registry)
- **P1-003 (symlink bypass)** — still open, no Wave-1 change. Zero `realpathSync` additions. No regression. Wave-2 scope.
- **P1-013/014 (three parallel exclusion sources)** — still open, no Wave-1 change. 3 sources preserved, no 4th added. Wave-2 scope.
- **P1-015 (zero inline ADR back-refs)** — still open after Wave-1. Zero back-refs added to any of 5 Wave-1 files. Wave-2 scope.

## Traceability Checks

- **canonical-helper-reuse protocol**: pass — all 5 Wave-1 guard sites consume `isConstitutionalPath` / `shouldIndexForMemory` from `lib/utils/index-scope.ts`; no re-implementations of the path check.
- **shared-helper-emergence protocol**: fail — `tryRecordTierDowngradeAudit` was extracted in one of 5 sites and kept module-local. Four sites duplicate the payload inline. Magic strings have no enum.
- **ADR-traceability protocol**: fail — zero inline ADR or packet-number back-references in Wave-1 guard code. P1-015 (pass-1) uncorrected by Wave-1.
- **test-hermeticity protocol**: pass — both Wave-1 vitest files use in-memory SQLite. No production-DB paths in test source.
- **logger-consistency protocol**: mixed — 1 site uses `logger.warn`, 4 sites use `console.warn`. Same state as pass-1; no regression.
- **exclusion-SSOT protocol**: partial — 3 parallel sources preserved, Wave-1 did not add a 4th and did not unify. Status quo.
- **JSDoc-coverage protocol**: partial — 2 of 5 Wave-1-modified functions have JSDoc; 1 of the 2 is stale (doesn't mention the hoisted guard); 3 have no JSDoc at all.

## Confirmed-Clean Surfaces

- Canonical path-policy helper (`isConstitutionalPath`, `shouldIndexForMemory`) is the single source for path checks across all 5 Wave-1 guard sites.
- Wave-1 did NOT introduce regressions to any pass-1 spot-checked P1s (P1-001 TOCTOU, P1-003 symlink, P1-013/014 exclusion SSOT).
- Wave-1 did NOT add a 4th exclusion source (P1-013/014 not worsened).
- Wave-1 did NOT add a 2nd logger abstraction (logging state quo preserved, not worsened).
- Wave-1 test files are hermetic — no production-DB contamination risk.
- `recordGovernanceAudit` canonical writer remains the single INSERT path; all 5 sites route through it correctly.
- Allowlist-hoist (`post-insert-metadata.ts:88-128`) is functionally sound; no dead branches after the hoist.

## Coverage
- Dimension: maintainability — covered
- Files reviewed: 8 (see Files Reviewed)
- Dimensions complete (pass-2): correctness (iter-1, iter-2), audit-trail (iter-3), maintainability (iter-4)
- Remaining pass-2 dimensions: traceability (iter-5 — packet docs match landed patches), exploit-chain end-to-end re-walk (iter-6 or folded into iter-7), synthesis (iter-7)

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` (helper 76-114, guard 456-478, import block)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` (full: 1-155)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (guard+audit 298-340)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (transaction + audit 140-210)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (validateMemoryRow 1285-1360)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (recordGovernanceAudit 300-334)
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` (hermeticity check)
- `.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts` (hermeticity check)
- Cross-ref greps: action-string occurrences, ADR back-refs, realpath additions, exclusion sources, logger usage.

## Next iteration focus

**Pass 2 Iter 5 — traceability verification: packet docs ↔ landed patches.** Cross-check `review-pass-02/deep-review-strategy.md` Wave-1 plan against the actual diff shape: every claimed patch maps to a real code change, every code change maps to a claimed patch. Re-verify P2-pass2-002 (allowlist-removal doc drift) against the current strategy.md text. Scan `plan.md`, `tasks.md`, `implementation-summary.md` for any Wave-1 claims that don't match shipped code (e.g., "action string defined as constant" if the strategy claims so). Inspect whether packet docs include ADR back-refs that the shipped code should have mirrored (reinforces P1-015). Also: verify that `implementation-summary.md` for the Wave-1 sub-packet cites the ACTUAL guard-hoist pattern (not the incorrect "allowlist removal" description).
