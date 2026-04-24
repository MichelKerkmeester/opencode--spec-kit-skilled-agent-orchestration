# Iteration 006 — security-extended — complete mutation-surface audit for invariant bypasses

## Dispatcher
- iteration: 6 of 7
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T13:00:00Z
- session: 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)

## Summary

Iter-6 completes the API attack-surface inventory demanded after iter-5's P0-001 discovery. Every MCP tool exposed in `tool-schemas.ts` that can mutate `memory_index` was audited for path-check presence before `importance_tier` and `file_path` writes, plus every direct-DB write path (`prepare("INSERT INTO memory_index"` / `UPDATE memory_index SET ... importance_tier`) was grepped across `mcp_server/` and `scripts/`.

**Result: ONE NEW P0 confirmed (P0-002: `checkpoint_restore` raw-row revival bypasses Invariant 3 via `INSERT OR REPLACE INTO memory_index`).** Plus ONE NEW P1 (P1-018: `applyPostInsertMetadata` accepts `importance_tier` in its allowed-columns allowlist with no path check, making every caller structurally dependent on upstream guard). Plus ONE NEW P2 (P2-022: re-check of P0-001 reachability confirms the tool is exposed to any MCP client with no admin gate — P0-001 severity unchanged).

**Good news on the inventory sweep:** `auto-promotion.ts` (PROMOTION_PATHS hard-caps target at `'critical'`; constitutional is in NON_PROMOTABLE_TIERS) and `confidence-tracker.ts` (`promoteToCritical` writes only `'critical'`) do NOT expose constitutional promotion paths. `memory_bulk_delete` refuses constitutional tier without explicit specFolder scope. `memory_delete` is a by-ID row delete with no tier manipulation. `memory_validate`, `memory_causal_link`, `memory_causal_unlink`, `memory_ingest_*` do not touch `importance_tier`. `ccc_reindex`/`ccc_feedback` are CocoIndex-only (separate system). Chunking-orchestrator consumes `parsed.importanceTier` which has already been downgraded by the save guard.

**Convergence veto: YES — second P0 (checkpoint_restore snapshot revival).**

Iter-6 also re-evaluated P0-001 (memory_update) severity: confirmed the tool has no authz gate in the current MCP surface — it is callable by any MCP client. Severity stays P0.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (TOOL_DEFINITIONS 861-923, memory_update 294-297, memory_bulk_delete 322-325)
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts` (dispatch 70, 104)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (re-read 40-300)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` (1-200)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts` (1-80)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` (240-390, 490-540)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` (340-400)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts` (grep — only tier='deprecated' writes and parsed.importanceTier pass-through)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` (update_memory 351-440)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts` (full file — PROMOTION_PATHS, NON_PROMOTABLE_TIERS)
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts` (promoteToCritical 236-275)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` (ALLOWED_POST_INSERT_COLUMNS 53-62, applyPostInsertMetadata 80-109)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (validateMemoryRow 1258-1282, restoreCheckpoint 1467-1570)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` (markHistoricalPredecessor 425-435, insertAppendOnlyMemoryIndexRow 437-506)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tools/code-graph-tools.ts` (ccc_reindex dispatch 76-77)

## Attack-surface inventory table — every mutating MCP tool

| Tool | Can set file_path? | Can set tier? | Can create new row? | Invariant-3 guard applied? | Severity of gap |
|---|---|---|---|---|---|
| memory_save | yes (from filePath arg) | yes (from file content frontmatter) | yes | YES — `prepareParsedMemoryForIndexing` at memory-save.ts:310 | clean |
| memory_update | NO (schema omits filePath) | YES (via `importanceTier`, validated only against VALID_TIERS) | no | **NO** — no path check between VALID_TIERS gate and `update_memory` SQL write | **P0-001 (iter-5, confirmed)** |
| memory_delete | n/a (delete by id) | n/a | n/a | n/a | clean |
| memory_bulk_delete | n/a | tier is a FILTER, not a write | n/a | refuses constitutional without specFolder scope (defense-in-depth) | clean |
| memory_validate | no | no (only updates `confidence`/`validation_count`) | no | n/a (no tier write) | clean |
| memory_causal_link | no | no (writes `causal_edges`, not `memory_index`) | no (no memory_index row) | n/a | clean |
| memory_causal_unlink | no | no | no | n/a | clean |
| memory_ingest_start / _cancel | no (enqueues paths; actual ingest goes through memory_save) | no (inherits memory_save guard) | yes (via memory_save) | YES (delegates to memory_save) | clean |
| memory_index_scan | no (discovers files via walker) | yes (via indexMemoryFileFromScan → prepareParsedMemoryForIndexing) | yes | YES (walker excludes z_future/external; save guard downgrades non-constitutional-path tier) | clean |
| checkpoint_create | reads from DB; does not write memory_index | reads | no | n/a (read only) | clean |
| **checkpoint_restore** | **YES (writes raw file_path column from snapshot)** | **YES (writes raw importance_tier column from snapshot)** | **yes (INSERT OR REPLACE)** | **NO — `validateMemoryRow` checks TYPES only, not the file_path↔tier invariant** | **P0-002 (NEW, this iteration)** |
| checkpoint_delete | no | no | no | n/a | clean |
| ccc_reindex / ccc_feedback | no (CocoIndex-only, separate system) | no | no | n/a | clean |
| code_graph_scan | no (writes code-graph DB, not memory_index) | no | no (for memory_index) | n/a | clean |
| advisor_* / skill_graph_* | no | no | no | n/a | clean |
| deep_loop_graph_upsert | no (writes deep_loop graph DB) | no | no | n/a | clean |
| eval_run_ablation / eval_reporting_dashboard | no (writes eval_metric_snapshots) | no | no | n/a | clean |

Internal (non-tool) UPDATE paths touching `importance_tier`:
| Path | Target tier | Path-check? | Gap |
|---|---|---|---|
| `auto-promotion.ts:246` | `'important'` or `'critical'` (PROMOTION_PATHS hardcoded) | NON_PROMOTABLE_TIERS excludes constitutional sources; target is never constitutional | clean |
| `confidence-tracker.ts:263` | `'critical'` only (hard-coded literal) | never writes constitutional | clean |
| `pe-gating.ts:246, 325` | `'deprecated'` only | never writes constitutional | clean |
| `save/create-record.ts:380` | `'deprecated'` only | never writes constitutional | clean |
| `reconsolidation.ts:334` | `'deprecated'` only | never writes constitutional | clean |
| `lineage-state.ts:428-431` | `'deprecated'` or preserves `'constitutional'` (CASE) | never ELEVATES; safe | clean |
| `vector-index-schema.ts:729-731` | sets `document_type` gated by existing `importance_tier='constitutional'` (SELECT-only filter) | keyed off existing tier | clean |
| `chunking-orchestrator.ts:514` | `parsed.importanceTier` (already-downgraded) | UPSTREAM guard covers | clean |
| **`post-insert-metadata.ts:53-62`** | **`importance_tier` is an ALLOWED column in the dynamic SET builder** | **NO path check in the builder; every caller MUST have upstream-guarded the value** | **P1-018 (structural risk, see below)** |

Direct INSERT INTO memory_index sites (grep `prepare("INSERT INTO memory_index"`):
| File:line | Guard applied? |
|---|---|
| `vector-index-mutations.ts:220, 319` | consumes params that upstream callers have guarded |
| `lineage-state.ts:453` | invoked by save-path, parsed.importanceTier is post-guard |
| `reconsolidation.ts:329` | post-guard parsed.importanceTier |
| `schema-downgrade.ts:284` | migration-only, no new rows |
| `vector-index-schema.ts:1050` (INSERT INTO memory_index SELECT FROM memory_index_v24_backup) | migration-only |
| `checkpoints.ts:1544` | **NO PATH CHECK (P0-002)** |
| `scripts/evals/run-performance-benchmarks.ts:185` | eval harness; not user-reachable |
| `scripts/tests/test-*.js` | test fixtures only |

Direct `UPDATE memory_index SET ... importance_tier` sites (grep):
| File:line | Target tier |
|---|---|
| `vector-index-mutations.ts:259` (dynamic SET inside update_memory) | caller-supplied via `memory_update` — **P0-001** |
| `auto-promotion.ts:246` | never constitutional |
| `confidence-tracker.ts:263` | never constitutional |
| `pe-gating.ts:246, 325` | `'deprecated'` only |
| `create-record.ts:380` | `'deprecated'` only |
| `reconsolidation.ts:334` | `'deprecated'` only |
| `lineage-state.ts:428` | `'deprecated'` or preserves existing constitutional |
| **`chunking-orchestrator.ts:514`** | **parsed.importanceTier (post-guard) — but via raw dynamic SET, relies entirely on caller** |
| **`post-insert-metadata.ts:104-108`** (dynamic SET builder) | **caller-supplied; allowlist includes `importance_tier`** |
| **`checkpoints.ts:1552`** (dynamic SET over memoryRestoreColumns) | **snapshot-supplied — P0-002** |

## Findings - New

### P0 Findings

1. **`checkpoint_restore` revives any memory row verbatim from snapshot, including arbitrary `importance_tier` and `file_path` combinations; no invariant re-assertion** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1467-1570` (body), `:1544` (`INSERT OR REPLACE INTO memory_index`), `:1552` (`UPDATE memory_index SET ... = ?`), `:1258-1282` (`validateMemoryRow` checks TYPES only) — `restoreCheckpoint` decompresses the stored `memory_snapshot` blob (line 1492), parses JSON (line 1493), and for each row validates only: `id` is a finite number, `file_path` is a non-empty string, `spec_folder` is a non-empty string, and the presence of `title, importance_weight, created_at, updated_at, importance_tier` (line 1276). **Nowhere** does it re-assert Invariant 3 (`importance_tier='constitutional'` only for paths under `/constitutional/`), and nowhere does it re-assert Invariants 1/2 (no `/z_future/*` or `/external/*` paths). Rows are then written via `INSERT OR REPLACE INTO memory_index (...columns...)` (line 1544) or `UPDATE memory_index SET col = ? ...` (line 1552) with `nonIdColumns` taken DIRECTLY from the snapshot — `importance_tier` and `file_path` are ordinary columns in `getMemoryRestoreColumns`. An attacker with the ability to create or obtain a checkpoint with tampered rows (via compromised backup media, direct DB file edit, or any prior Invariant-3 bypass — notably via P0-001) can call `checkpoint_restore` and hydrate arbitrary `(file_path, importance_tier)` pairs into `memory_index`. The bypass is especially grave because checkpoints are presented as a safety/recovery mechanism: operators restoring from backup reasonably expect guarded content. Fix: in `restoreCheckpoint`, before the INSERT or UPDATE batch, iterate every row and apply `if (row.importance_tier === 'constitutional' && !isConstitutionalPath(row.file_path)) reject or downgrade`; reject rows with `file_path` under `/z_future/` or `/external/`. Regression test: add a checkpoint fixture with a seeded `(file_path='specs/foo/bar.md', importance_tier='constitutional')` row and assert restore either rejects or downgrades. Also consider whether to run the row-level guard inside the barrier-held transaction so a single bad row halts the entire restore atomically.

```json
{
  "claim": "checkpoint_restore hydrates arbitrary (file_path, importance_tier) combinations from a snapshot blob without re-asserting any of the three invariants, allowing restoration of attacker-tampered checkpoints to land constitutional-tier rows whose file_path is not under /constitutional/ (and rows under /z_future/ or /external/).",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1467",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1492",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1544",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1552",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1258",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1276"
  ],
  "counterevidenceSought": "Grepped checkpoints.ts for 'isConstitutionalPath' / 'z_future' / 'external' / 'shouldIndexForMemory' / 'index-scope' — none. Grepped validateMemoryRow for any file_path↔tier coupling — none. Checked whether the outer transaction (acquireRestoreBarrier) adds a post-commit validation — it does not; barrier is a mutex, not an invariant check. Checked whether getMemoryRestoreColumns filters importance_tier or file_path out — it intersects snapshot columns with live-schema columns (checkpoints.ts:1211 area), so both columns pass through.",
  "alternativeExplanation": "If checkpoints are treated as a trust boundary (operators trust their own backups), the gap is mitigated by operational policy. But checkpoints are system-generated (checkpoint_create reads live DB) and can be silently corrupted by P0-001 having contaminated the DB before snapshot was taken — meaning a routine post-attack 'restore to known-good state' actually re-installs the attack. Also, Packet 011's invariant language does not make a carve-out for 'restored rows' and the README's Invariants section does not exempt checkpoint_restore.",
  "finalSeverity": "P0",
  "confidence": 0.90,
  "downgradeTrigger": "Evidence that checkpoints are cryptographically signed and integrity-verified before restore (none found today), OR an explicit decision-record statement that checkpoint_restore is a trust-boundary operation outside Invariant 3 scope (also none found today)."
}
```

### P1 Findings

1. **`applyPostInsertMetadata` accepts `importance_tier` in its allowlist with no path check; every caller is structurally dependent on upstream guard enforcement** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:53-62` (ALLOWED_POST_INSERT_COLUMNS includes `'importance_tier'`), `:80-109` (dynamic SET builder issues `UPDATE memory_index SET importance_tier = ?` with no inspection of the value against any companion `file_path`) — the helper builds a dynamic `UPDATE memory_index SET ... WHERE id = ?` from any caller-supplied `{col:value}` map where `col` is in the allowlist. `importance_tier` is in that allowlist, so every caller of `applyPostInsertMetadata` can write an arbitrary tier. Today all callers in the save path (`create-record.ts:347`, `lineage-state.ts:495`, `reconsolidation.ts:352`, `chunking-orchestrator.ts:247, 345`, `pe-gating.ts:311`, `memory-save.ts:3050, 3235`) pass `parsed.importanceTier` which has been downgraded by the save-time guard — so the invariant holds today. But this is STRUCTURAL fragility: any future caller added without running the save-time guard first would silently bypass Invariant 3, and the helper gives no local signal that the column is invariant-constrained. Fix: remove `'importance_tier'` from ALLOWED_POST_INSERT_COLUMNS and force all tier writes through a single tier-aware helper that takes `(memoryId, filePath, tier)` and re-validates via `isConstitutionalPath`. Alternatively, if removal is too invasive, have `applyPostInsertMetadata` read the row's `file_path` when `importance_tier === 'constitutional'` is requested and re-validate. Compound with P0-001 and P0-002 — both exploit exactly the kind of caller the allowlist enables.

```json
{
  "claim": "applyPostInsertMetadata's ALLOWED_POST_INSERT_COLUMNS allowlist includes importance_tier with no row-level path check, leaving all current and future callers structurally dependent on upstream guard enforcement (any new or refactored caller bypasses Invariant 3 silently).",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:54",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:80",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:104"
  ],
  "counterevidenceSought": "Grepped for all callers of applyPostInsertMetadata — today every caller passes parsed.importanceTier which has been through the save-time guard. Checked whether the helper has JSDoc warning about the invariant constraint — it does not.",
  "alternativeExplanation": "Keeping importance_tier in the allowlist is ergonomic for the save path (single helper for all post-insert metadata). The tradeoff is acceptable if (a) every future caller is reviewed against Invariant 3 and (b) iter-4 P1-015's 'no back-references to packet 011' finding is addressed so future maintainers see the coupling. Both are fragile assumptions.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Add a JSDoc warning on ALLOWED_POST_INSERT_COLUMNS flagging importance_tier as invariant-constrained, AND add a unit test asserting that applyPostInsertMetadata is never the sole point of entry for a tier=constitutional write on a non-/constitutional/ path."
}
```

### P2 Findings

1. **P0-001 reachability re-check — confirmed unguarded on the public MCP surface** — `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:70, 104`, `tool-schemas.ts:294-297`, `schemas/tool-input-schemas.ts` memory_update schema — `memory_update` is listed in the L4:Mutation tier alongside `memory_delete`, `memory_validate`, `memory_bulk_delete`. The dispatch at `memory-tools.ts:104` takes the validated args and calls `handleMemoryUpdate` with no authz gate, no admin-role check, no provenance requirement (unlike `memory_save` which has `provenanceSource`/`provenanceActor` governance parameters at tool-schemas.ts:223). Any MCP client that can call `memory_search` can call `memory_update` with the same capability envelope. Evidence also via absence: there is no `validateGovernedIngest`-equivalent call in `handleMemoryUpdate`, no `tenantId`/`userId` required in the memory_update schema (unlike checkpoint_create which requires `tenantId`). This downgrade-trigger for P0-001 is therefore NOT met; P0-001 severity is unchanged.

### Symlink / race / sequence attack re-check (required by dispatch brief)

- **Symlink inside `/constitutional/` pointing OUT**: an attacker with write access inside `.opencode/skill/*/constitutional/` could place a symlink like `constitutional/real.md -> ../../../../specs/attacker-controlled/poisoned.md`. Because memory-save's `path.resolve` (P1-003 iter-1) does NOT follow symlinks, `canonicalFilePath` would be `constitutional/real.md` and `isConstitutionalPath` would PASS, indexing poisoned content as constitutional. **This is a concrete escalation of P1-003 severity** but does not require a new finding — P1-003's `iter5Verification` text should be extended. Flag for synthesis: this symlink-into-constitutional attack is strictly worse than P1-003's symlink-out-of-repo attack because the attacker already needs write access to a /constitutional/ directory that a repo maintainer must merge (detection surface); whereas symlinks-out require only transient FS write access.
- **Race: walker-skipped z_future folder then manual file drop**: the walker excludes `z_future/` via `EXCLUDED_FOR_MEMORY`, but `memory_save({ filePath: "specs/foo/z_future/bar.md" })` from a direct MCP call bypasses the walker entirely. The save-time guard at `memory-save.ts:310` fires on `parsed.importanceTier === 'constitutional'` only — for a `z_future/` path at tier `'important'` or lower, no guard blocks the row. **Verified this is NOT yet covered: `prepareParsedMemoryForIndexing` only checks `isConstitutionalPath(canonicalFilePath)` when `parsed.importanceTier === 'constitutional'`; it does not call `shouldIndexForMemory`.** This is a Invariant-1 bypass on the direct-save path. Elevating to a P1 finding below.
- **TOCTOU between `clear_constitutional_cache` and `memory-surface.ts`**: `update_memory` invalidates cache at `vector-index-mutations.ts:402`; auto-surface hook re-reads on next invocation. No race window that an attacker can exploit beyond the base P0-001.

### Additional P1 (from symlink+race pass)

2. **`memory_save` direct-call bypasses walker's z_future/external exclusion because `prepareParsedMemoryForIndexing` only runs `isConstitutionalPath`, not `shouldIndexForMemory`** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:298-320` — The guard block `if (parsed.importanceTier === 'constitutional' && !isConstitutionalPath(canonicalFilePath)) { downgrade }` only fires for constitutional-tier saves. A direct `memory_save({ filePath: '/abs/path/.opencode/specs/foo/z_future/bar.md' })` call with normal/critical/important tier is NOT blocked here. The walker exclusion only fires during `memory_index_scan`; direct saves bypass the walker. Invariant 1 (`/z_future/*` NEVER indexed) holds for the walker path but fails for the direct-MCP-call path. This is not iter-1 P1-003 (that's symlink); this is a distinct logical gap. Fix: before the constitutional check, call `if (!shouldIndexForMemory(canonicalFilePath)) throw` or reject the save. Regression test: add a test that `handleMemorySave({ filePath: /z_future/x.md })` rejects or is ignored. Severity P1 (not P0) because exploiting it requires an attacker to first place a file under `z_future/` inside the repo — a non-trivial capability gate in most deployments, but not rare for internal development where the repo is co-located with the MCP server and the attacker has any shell access.

```json
{
  "claim": "memory_save on direct calls does not reject z_future/ or external/ paths; prepareParsedMemoryForIndexing only gates tier=constitutional against isConstitutionalPath, not the full shouldIndexForMemory predicate, so Invariant 1 (never index z_future) and Invariant 2 (never index external) are enforced only on the walker path, not the direct-save path.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:298",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:310"
  ],
  "counterevidenceSought": "Grepped prepareParsedMemoryForIndexing body for 'shouldIndexForMemory' — not present. Checked for any upstream caller-side guard in handleMemorySave — the only path filter is `ALLOWED_BASE_PATHS` which permits specs/ and .opencode/specs/ and .opencode/skill/*/constitutional/ — a z_future subfolder under specs/ passes this. Checked whether memory-parser rejects z_future paths — it has no such rejection (walker-level exclusion does not apply to parser).",
  "alternativeExplanation": "If the product decision is that z_future paths are expected to be flagged by the caller and the invariant is walker-only (walker is the authoritative discovery path), then this is by-design. But the user-stated invariant uses absolute language ('NEVER indexed by memory system') which does not make a carve-out for direct calls.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Evidence that handleMemorySave is only reachable via the walker in production (e.g., direct-save is behind an admin gate), OR a spec-level decision to narrow Invariant 1/2 to the walker path."
}
```

## Traceability Checks

- **attack_surface_inventory** (new this iteration): 17 MCP tools enumerated; 15 clean, 1 P0 already known (memory_update), 1 new P0 discovered (checkpoint_restore). 10 internal UPDATE-tier paths enumerated; all currently safe for Invariant 3 except the helper allowlist (P1-018). Protocol: **partial** (gating failure: 1 new P0 blocks convergence).
- **direct_db_write_grep** (new this iteration): 9 INSERT INTO memory_index sites (2 migration, 1 eval harness, 4 post-guard save-path, 1 P0-002, 1 test-only); 10 UPDATE SET importance_tier sites (4 hard-coded deprecated, 2 hard-coded non-constitutional promotion caps, 2 parsed-value pass-through from save guard, 2 attacker-controllable — P0-001 and P0-002). Pass for all save-path sites; fail for the 2 known P0s.
- **reachability_gate** (new this iteration): memory_update and checkpoint_restore both confirmed exposed on the public MCP surface with no admin gate. Pass for inventory accuracy; fail for invariant enforcement.

## Confirmed-Clean Surfaces (this iteration)

- **auto-promotion.ts**: NON_PROMOTABLE_TIERS explicitly excludes `'constitutional'` from sources AND PROMOTION_PATHS targets never include `'constitutional'` — dual protection. `executeAutoPromotion` cannot elevate any row to constitutional. Plus throttle safeguard (MAX_PROMOTIONS_PER_WINDOW=3 in 8h) limits even legitimate `normal→important→critical` movement.
- **confidence-tracker.ts**: `promoteToCritical` hard-codes `'critical'` as the target tier. Cannot elevate to constitutional. The `isPromotionEligible` predicate excludes already-constitutional rows (early-return false).
- **memory_bulk_delete**: For tier=constitutional, requires explicit `specFolder` scope AND an auto-checkpoint with no skipCheckpoint override. Safety gate is intact.
- **memory_delete**: by-ID delete only; no tier manipulation.
- **memory_validate**: touches `confidence`, `validation_count` only. No tier write.
- **memory_causal_link / memory_causal_unlink**: writes `causal_edges` table; does not touch `memory_index`.
- **memory_ingest_***: delegates to memory_save (which has the guard).
- **ccc_reindex / ccc_feedback / code_graph_***: CocoIndex / code-graph DBs are separate from memory_index.
- **checkpoint_create**: read-only from live DB; cannot introduce new invariant violations (if live DB is clean, snapshot is clean).
- **chunking-orchestrator.ts**: consumes `parsed.importanceTier` from the save path (post-guard). Clean transitively, but structurally depends on `applyPostInsertMetadata` allowlist (P1-018).
- **pe-gating.ts, reconsolidation.ts, create-record.ts, lineage-state.ts**: hardcoded `'deprecated'` or CASE-preserving constitutional; cannot elevate non-constitutional to constitutional.

## Cross-dimension findings

- **Correctness × Security (both new P0s)**: Both P0-001 (memory_update) and P0-002 (checkpoint_restore) are simultaneously Invariant-3 correctness violations AND attacker-controlled-content-injection vulnerabilities. P0-002 is more severe because a single malicious checkpoint can hydrate MULTIPLE tampered rows in one call (N memories per restore vs 1 memory per memory_update).
- **Maintainability × Correctness (P1-018)**: iter-4 P1-015 (no code back-references to packet 011) STRONGLY compounds here: the `applyPostInsertMetadata` allowlist has no JSDoc signaling the tier-invariant coupling, so any maintainer adding a new caller would have zero local signal that `importance_tier` requires upstream guarding. Combined with P0-001's scope-omission lesson, packet 011's follow-on remediation should include JSDoc + inline ADR-004 back-references on every allowlist entry for an invariant-constrained column.
- **Traceability × Security**: `mcp_server/README.md` Invariants section (iter-5 P2-020) omits BOTH memory_update AND checkpoint_restore; it only mentions the save-time guard and walker exclusions. A reader searching the README for 'all enforcement sites' would miss 2 P0s. P2-020 is structurally strengthened.

## Severity Re-evaluation of Prior Findings

- **P0-001 (iter-5, memory_update)**: **CONFIRMED P0.** Reachability re-check passes: tool is exposed to any MCP client, no admin gate, no provenance gate. Severity unchanged.
- **P1-003 (iter-1, symlink bypass)**: **ESCALATED IN IMPACT** (no new finding, but the symlink-into-/constitutional/ variant surfaced in this iteration is strictly worse than the symlink-out-of-repo original framing). Severity stays P1 because detection surface is higher (repo maintainer reviews symlinks on PR), but add to iter-5 `iter5Verification` text that this variant exists.
- **P1-017 (iter-5, symlink design inconsistency)**: confirmed; no change.
- **P2-020 (iter-5, README Invariants section)**: **REINFORCED** — README now omits at least 3 enforcement sites (save-time guard is documented; memory_update P0-001, checkpoint_restore P0-002, applyPostInsertMetadata P1-018 are not). Severity stays P2 (documentation), but expand scope in the fix.
- **No downgrades.** No prior finding has been resolved; all remain open (no fixes landed this review session).

## Convergence Signal Check

Per-iteration newFindingsRatio:
- iter-1: 1.0 (11 new findings, fresh start)
- iter-2: 0.77 (6 new, 4 cross-ref strengthened)
- iter-3: 0.81 (7 new, 3 adjacent-known categories)
- iter-4: 1.0 (9 new, all distinct categories)
- iter-5: 1.0 (6 new, P0 override floor)
- iter-6 (this): 1.0 (3 fully new: P0-002, P1-018, P1 z_future direct-save; plus 1 confirmatory P2; severity-weighted = (1*10 + 2*5 + 1*1) / (1*10 + 2*5 + 1*1) = 21/21 = 1.0; P0 override floor also applies)

Noise floor calculation:
- Ratios: [1.0, 0.77, 0.81, 1.0, 1.0]
- Median = 1.0
- Absolute deviations from median: [0.0, 0.23, 0.19, 0.0, 0.0]
- MAD = median of deviations = 0.0
- Noise floor = MAD * 1.4826 * 1.4 = **0.0**

Because MAD is 0, the noise floor is effectively "any novelty is signal." Iter-6's ratio is 1.0 — firmly above noise floor. **Convergence is NOT allowed.**

**P0 override:** Two new P0s this session (P0-001 in iter-5, P0-002 in iter-6). Each alone blocks convergence.

## Recommendation for Iteration 7

**Iter-7 MUST continue finding, NOT be synthesis-only.** Two P0s block release; synthesis with unresolved P0s would produce a misleading report. Specifically iter-7 should focus on:

1. **Exploit-chain analysis for P0-002**: can an attacker reach `checkpoint_restore` without admin privilege today? (Same as P0-001 reachability probe — the MCP tool surface shows no admin gate on checkpoint_restore.) If confirmed, the compound exploit is: (a) use P0-001 to promote one memory to constitutional, (b) create_checkpoint to capture the poisoned state as a "clean" snapshot, (c) delete the audit trail via bulk_delete (or wait for retention sweep), (d) restore_checkpoint to re-hydrate the poison into future sessions with no mutation_ledger trail that survives the restore. This is a RELEASE-BLOCKER scenario.
2. **Final check: any OTHER unguarded MCP tools**: iter-6 covered all tools in `tool-schemas.ts`. Iter-7 should sweep `memory-tools.ts` handler dispatch for any handler NOT in tool-schemas.ts (shadow handlers or test-only handlers that might be reachable).
3. **`canonical-path.ts` audit**: iter-5 noted `canonical-path.ts` uses `realpathSync`. Does the canonical-path computation itself ever INJECT a post-symlink path back into the invariant-checked inputs, or is it write-only to the DB canonical_file_path column? If it is consulted by `isConstitutionalPath`, is there a window where the pre-symlink `file_path` matches but post-symlink `canonical_file_path` doesn't (or vice versa)?
4. **Decision: synthesis at iter-7 is only acceptable if iter-7 finds zero new P0s AND the open P0 count stays at 2.** If iter-7 finds a 3rd P0, recommend extending review past the 7-iteration budget or accepting FAIL verdict immediately.

## Coverage

- Dimension: security-extended (this iteration) — covered
- Files reviewed: 15 (see Files Reviewed)
- Remaining: iter-7 (final continuation finding or exploit-chain + synthesis)

## Next Focus

**Iteration 7: exploit-chain synthesis + final sweep** — validate compound P0-001+P0-002 attack chain end-to-end; sweep for any shadow handlers not in tool-schemas.ts; audit canonical-path realpath interaction with isConstitutionalPath; only if zero new P0s found, produce synthesis section.
