# Pass 2 · Iteration 003 — audit trail verification (P1-008 + P1-016)

## Dispatcher
- iteration: 3 of 7
- pass: 2
- dimension: audit-trail-verification
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T11:00:00Z
- session: 2026-04-24T09:48:20.783Z (generation 2, lineageMode=restart)
- parentSessionId: 2026-04-24T08:04:38.636Z

## Summary

Wave-1 remediation for the audit-trail gaps P1-008 (save-time) and P1-016 (update-time) is **CLOSED**. All four mandated emission sites now write typed `governance_audit` rows via `recordGovernanceAudit` (single writer at `scope-governance.ts:314-334`, INSERT into `governance_audit(action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, reason, metadata)`). The four sites are: (a) `memory-save.ts:314-336` save-path downgrade, (b) `memory-crud-update.ts:182-207` handler-level re-verification, (c) SQL-layer `vector-index-mutations.ts:88-114` (via `tryRecordTierDowngradeAudit`) + `post-insert-metadata.ts:105-126`, (d) `checkpoints.ts:1325-1358` (via deferred `flushGovernanceAudits`). Every site wraps the `recordGovernanceAudit` call in `try/catch` and logs `console.warn` on failure — audit-write failure does NOT fail the primary op (contract satisfied).

Three observations surface from this iteration, two of which confirm/upgrade existing P2 findings and one of which is a **NEW P1**:
1. **P1-pass2-004 (NEW)**: `scripts/memory/cleanup-index-scope-violations.ts:324-330` performs a bulk downgrade `UPDATE memory_index SET importance_tier='important' WHERE id IN (...)` with ZERO governance_audit emission. It also actively **DELETES** existing `governance_audit` rows for the affected ids at line 309 via the generic reference-cleanup loop. Operator-run cleanup is precisely the scenario that most needs an audit trail, and the current script produces a silent bulk-downgrade + erases prior audit history.
2. **Redundancy trace (follow-up to P2-pass2-001)**: Count per downgrade-path is **1 or 2 rows**, NOT 3. Applied to the actual control flow (see §Redundancy analysis). P2 severity is appropriate — NOT upgraded to P1.
3. **Transaction-survivability asymmetry**: `memory-save.ts` audit fires OUTSIDE the subsequent write transaction (pre-transaction guard in `prepareParsedMemoryForIndexing`) → survives downstream rollback. `memory-crud-update.ts` + `vector-index-mutations.ts` audits fire INSIDE the `runInTransaction` closure → commit/rollback atomically with the underlying UPDATE. `checkpoints.ts` uses a deferred-flush pattern (`governanceAudits[]` → outer `finally`) → survives rollback. This asymmetry is intentional (audit-semantics vary by phase) but not documented.

## P1-008 Status: CLOSED
Save-path downgrade now emits a typed `tier_downgrade_non_constitutional_path` row with decision=`conflict`, source=`memory_save` (see `memory-save.ts:314-336`). No longer a `console.warn`-only emit.

## P1-016 Status: CLOSED
`memory_update` tier changes now emit `tier_downgrade_non_constitutional_path` from TWO emitters — SQL-layer `update_memory` (via `tryRecordTierDowngradeAudit`) and handler-layer narrow re-verification. Action string + decision match contract.

## Audit emission site table

| Site | file:line | action | decision | survives rollback? | audit-fail-safe? |
|---|---|---|---|---|---|
| (a) memory-save | `handlers/memory-save.ts:315-329` | tier_downgrade_non_constitutional_path | conflict | YES — audit fires in `prepareParsedMemoryForIndexing` which runs BEFORE the write transaction at :1349 / :2118 / :2628 | YES — try/catch at :330-335 logs `console.warn`; does not rethrow |
| (b) memory-crud-update | `handlers/memory-crud-update.ts:182-202` | tier_downgrade_non_constitutional_path | conflict | NO — fires inside `runInTransaction` (line 146); rolls back atomically with UPDATE (semantically correct: audit only exists if downgrade commits) | YES — try/catch at :203-207 logs `console.warn` |
| (c₁) SQL-layer update_memory | `lib/search/vector-index-mutations.ts:88-114` (`tryRecordTierDowngradeAudit`) | tier_downgrade_non_constitutional_path | conflict | NO — called from `update_memory` at :465, which is invoked inside caller's transaction | YES — try/catch at :107-113 logs via `logger.warn` |
| (c₂) SQL-layer post-insert-metadata | `lib/storage/post-insert-metadata.ts:105-126` | tier_downgrade_non_constitutional_path | conflict | NO — fires inside `applyPostInsertMetadata`, caller-transaction-scoped | YES — try/catch at :121-125 logs `console.warn` |
| (d) checkpoint-restore — excluded-path reject | `lib/storage/checkpoints.ts:1325-1338` | checkpoint_restore_excluded_path_rejected | deny | YES — entries pushed to closure-local array, flushed in outer `finally` at :1847-1849 via `flushGovernanceAudits` | YES — `flushGovernanceAudits` at :92-103 wraps each insert in try/catch |
| (d') checkpoint-restore — tier downgrade | `lib/storage/checkpoints.ts:1343-1358` | tier_downgrade_non_constitutional_path | conflict | YES — same deferred-flush | YES — same wrapper |

## Redundancy analysis (follow-up to P2-pass2-001)

Traced the actual control flow for each tier-downgrade scenario. Counts per single downgrade decision:

| Scenario | Path | Prior tier | Requested tier | Audit rows emitted | Sites firing |
|---|---|---|---|---|---|
| S1 | non-constitutional | `important` | `constitutional` (via memory_update) | **1** | (c₁) SQL-layer `tryRecordTierDowngradeAudit` |
| S2 | non-constitutional | `constitutional` | `constitutional` (via memory_update) | **2** | (c₁) SQL-layer + (b) handler narrow re-verification |
| S3 | non-constitutional | any | `constitutional` (via memory_save new row) | **1** | (a) memory-save |
| S4 | non-constitutional | any | `constitutional` (via applyPostInsertMetadata post-save) | **1** | (c₂) post-insert-metadata |
| S5 | non-constitutional | any | `constitutional` (save path AND follow-up postInsert) | **2** | (a) + (c₂) — defense-in-depth on same logical insert |
| S6 | excluded z_future/external path (via checkpoint restore) | any | any | **1** | (d) |
| S7 | non-constitutional (via checkpoint restore, tier=constitutional) | any | constitutional-in-blob | **1** | (d') |
| S8 | non-constitutional (via cleanup-index-scope-violations.ts `--apply`) | `constitutional` | `important` (bulk) | **0** | NONE — script bypasses recordGovernanceAudit (see P1-pass2-004) |

**Maximum redundancy is 2 rows per decision (S2, S5), NOT 3.** The three-site theoretical overlap cited in P2-pass2-001 is real at the call-graph level but not reachable in practice: `applyPostInsertMetadata` is invoked only from save/lineage/reconsolidation paths (not from `update_memory`), and the handler's narrow re-verification condition `previousTier==='constitutional' && nextTier==='important'` cannot coexist with post-insert-metadata on the same decision. Recommend:
- Keep P2-pass2-001 at P2 (confirmed max 2 rows, operator can dedup by `(memory_id, created_at)` window).
- Optionally add `source` metadata-key-based DISTINCT query docs to operator runbook.

## Cleanup-script gap analysis

`scripts/memory/cleanup-index-scope-violations.ts` is a maintenance tool. Line 324-330 executes:

```ts
summary.downgradedRows += database.prepare(`
  UPDATE memory_index
  SET importance_tier = 'important'
  WHERE id IN (${placeholders(plan.downgradeIds)})
`).run(...plan.downgradeIds).changes;
```

This is a bulk downgrade of constitutional rows on non-constitutional paths. No `governance_audit` row is created. Worse, line 309:

```ts
summary.deletedOtherReferenceRows += deleteRows(database, 'governance_audit', ['memory_id'], idsToDelete);
```

actively DELETES any pre-existing audit rows for the DELETED ids (which are separate from downgradeIds, but still: the generic reference-cleanup treats `governance_audit` as a foreign-key-dependent table rather than an immutable audit log).

Operational impact: an operator running `cleanup-index-scope-violations.ts --apply` will silently downgrade N rows with no `tier_downgrade_non_constitutional_path` trace, and will remove audit history for any rows cleaned up. This defeats the observability goal of Wave-1's audit-emit contract.

## New findings (this iteration)

### P0
None.

### P1
1. **P1-pass2-004 — Cleanup script bypasses governance_audit on bulk tier downgrades and deletes existing audit rows** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:324-330` (bulk UPDATE), `:309` (DELETE FROM governance_audit WHERE memory_id IN …) — The operator-facing maintenance script performs constitutional → important downgrades WITHOUT emitting `tier_downgrade_non_constitutional_path` rows, and its generic reference-cleanup removes existing audit rows for deleted memory ids. Both actions contradict Wave-1's audit-emit contract: every tier transition that mutates `importance_tier` away from `'constitutional'` on a non-constitutional path MUST produce a typed audit, and operator-run bulk fixes are the scenario that most needs it. Does not violate Invariant 3 (row is moving AWAY from constitutional), but the absence of the audit row in a cleanup scenario means the `governance_audit` table becomes non-authoritative for "all past tier downgrades" — an operator cannot rely on it for compliance or forensic review after a `--apply` run. Recommended fix: import `recordGovernanceAudit` into the cleanup script and emit one row per `plan.downgradeIds` entry with `source='cleanup_index_scope_violations', decision='conflict'` before/after the UPDATE (same transaction). Separately, exclude `governance_audit` from the reference-cleanup deleteRows loop — audit trails should survive memory deletion (industry-standard append-only audit semantics).

```json
{
  "claim": "The cleanup-index-scope-violations.ts operator script downgrades rows from constitutional to important in bulk without emitting the Wave-1 governance_audit action 'tier_downgrade_non_constitutional_path', and its generic reference-cleanup loop deletes pre-existing governance_audit rows for the affected memory ids — both actions break the Wave-1 audit-emit contract in the highest-volume, highest-impact operator scenario.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:324-330 (bulk downgrade UPDATE without audit emission)",
    ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:309 (deletes governance_audit rows for deleted memory ids)",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:314-336 (contract: every tier downgrade on non-constitutional path emits action='tier_downgrade_non_constitutional_path')",
    ".opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:314-334 (canonical recordGovernanceAudit writer)"
  ],
  "counterevidenceSought": "Checked whether mutation_ledger or any lower-level ledger picks up the cleanup script's UPDATE and back-fills a governance_audit row. It does not — mutation_ledger is a separate append log and does not call recordGovernanceAudit. Checked whether the script is guarded by an operator preflight that manually adds audit rows. It is not — entry point at :500+ runs plan + apply in one go.",
  "alternativeExplanation": "Intentional asymmetry: cleanup is an emergency repair tool and audit emission was considered optional. Against this: Wave-1 strategy explicitly lists audit emission as the observability fix for every tier transition, and the cleanup path produces the LARGEST volume of transitions.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "Evidence that operator runbook mandates manual audit-row entry before --apply, OR that mutation_ledger is contractually equivalent to governance_audit and is emitted by the script (neither is currently true)."
}
```

### P2
None net-new this iteration (P2-pass2-001, -002, -003 already filed; redundancy-analysis §above confirms P2-pass2-001 at P2).

### Related prior-pass findings (status tracked in registry)
- **P1-008 — RESOLVED**: save-path downgrade now emits typed `governance_audit` row (memory-save.ts:315-329). Pre-transaction placement means the audit survives downstream write rollback.
- **P1-016 — RESOLVED**: `memory_update` tier changes now emit `governance_audit` from SQL-layer `tryRecordTierDowngradeAudit` + narrow handler re-verification. Action + decision strings match contract.

## Traceability Checks

- **contract-writer protocol**: pass — canonical `recordGovernanceAudit` at `scope-governance.ts:314` is the single writer; all four mandated sites route through it.
- **action-string-uniqueness protocol**: pass — only two stable actions (`tier_downgrade_non_constitutional_path`, `checkpoint_restore_excluded_path_rejected`) exist in the wave-1 code; no conflicting or misspelled variants.
- **audit-fail-safe protocol**: pass — every call site wraps `recordGovernanceAudit` in try/catch with `console.warn`/`logger.warn`; audit-write failure does NOT fail the primary save/update/restore operation.
- **transaction-survivability protocol**: partial — asymmetric (see §Summary). `memory-save` + `checkpoints` audits survive rollback; `memory-crud-update` + SQL-layer audits do not. Intentional per-phase semantics, but NOT documented. Recommend strategy.md addition.
- **cleanup-script coverage protocol**: **fail** — `cleanup-index-scope-violations.ts` bulk downgrade path emits no audit AND deletes pre-existing audit rows (see P1-pass2-004).
- **live-db parity**: `SELECT action, decision, COUNT(*) FROM governance_audit GROUP BY action, decision;` returns **0 rows**. `SELECT COUNT(*) FROM governance_audit;` = **0**. No downgrades have been triggered in this DB yet; expected clean-slate posture.

## Confirmed-Clean Surfaces

- `recordGovernanceAudit` canonical writer (scope-governance.ts:314-334) — no alternative writer path bypasses it; single INSERT statement.
- Try/catch wrap around every `recordGovernanceAudit` call (all four sites + checkpoint flush loop).
- Action-string constants stable across the codebase (grep confirms exactly two strings, used consistently).
- Governance_audit schema matches Wave-1 contract (action, decision, memory_id, logical_key, reason, metadata, + scope/tenant fields, + created_at).
- `memory-save.ts` pre-transaction audit placement (survives downstream rollback).
- `checkpoints.ts` deferred-flush pattern (survives rollback by design).

## Coverage
- Dimension: audit-trail-verification — covered
- Files reviewed: 6 (see Files Reviewed)
- Remaining pass-2 dimensions: exploit-chain end-to-end (iter-4 or later), traceability / strategy drift (iter-4), maintainability regression (iter-5), synthesis (iter-6 or iter-7)

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (guard+audit site 298-340; transaction call sites :1349, :2118, :2628)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (transaction + audit site 140-210)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` (tryRecordTierDowngradeAudit 76-114; update_memory guard 456-478)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` (applyPostInsertMetadata 82-128)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (flushGovernanceAudits 92-103; validateMemoryRow 1291-1360)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (recordGovernanceAudit 314-334)
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts` (downgrade 324-330; audit deletion 309)
- Live DB: `context-index__voyage__voyage-4__1024.sqlite` (governance_audit row count query)

## Next iteration focus

**Pass 2 Iter 4 — traceability / strategy drift + maintainability regression.** Cross-check `review-pass-02/deep-review-strategy.md` (and parent pass-1 `review-report.md` remediation plan) against the actual Wave-1 diff: verify every stated patch maps to a real code change, and every code change maps to a stated patch. Specifically re-verify P2-pass2-002 (allowlist removal doc drift) and scan for other wave-1 docs that claim fixes that don't match code shape. Separately, scan the wave-1-introduced code for fresh maintainability debt (duplicated helpers, missing `source` enums, JSDoc gaps, test brittleness). Do NOT re-exercise P1-008/P1-016 (closed this iteration) or P0-001/P0-002 (closed iter-1/iter-2). Also: decide whether P1-pass2-004 (cleanup-script audit gap) warrants a Wave-1.5 patch or can defer to Wave-2.
