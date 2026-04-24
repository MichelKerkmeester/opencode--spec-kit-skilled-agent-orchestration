# Iteration 005 — correctness (deeper pass) — end-to-end invariant chain proofs

## Dispatcher
- iteration: 5 of 7
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T12:00:00Z
- session: 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)

## Summary
Deep correctness pass traced each of the three invariants end-to-end from every writable entry-point to the DB write, including non-save paths that mutate `memory_index`. Found **ONE new P0** (convergence veto): `memory_update` MCP tool (handlers/memory-crud-update.ts:67-87 + lib/search/vector-index-mutations.ts:351-403) accepts an arbitrary `importanceTier` parameter and writes it to `memory_index.importance_tier` WITHOUT any path check, defeating Invariant 3. The save-time guard at `memory-save.ts:310` only fires on the INSERT path; the UPDATE path via `memory_update` is unguarded. Any MCP caller can promote any indexed memory to `'constitutional'` tier irrespective of its `file_path`. This is reachable via the public tool surface (`tool-schemas.ts:295`, `tools/memory-tools.ts:70,104`). Also re-evaluated prior iter-1/2 findings: P1-003 (symlink bypass) remains P1 (requires symlink write access which is not a trivial attacker capability) but DOES confirm a coherent design gap — `code-graph/handlers/scan.ts:135-142` uses `realpathSync` explicitly for this reason, yet memory-save.ts:306 and walker paths do not. P1-001 (TOCTOU) confirmed real because cleanup script holds no cross-process lock. No other new P0/P1 findings beyond these; cross-dimension pass added one P1 (memory_update audit absence) and two P2s (update path silently invalidates constitutional cache; UPDATE path omitted from tests/invariants-section of README).

**Convergence veto: YES — one new P0 (memory_update bypasses Invariant 3).**

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (guard chain 306-315, 2685-2701, fromScan 2018-2027, 2390)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (handleMemoryUpdate 40-300)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` (update_memory 351-440, index_memory 200-253, index_memory_deferred 261-339)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` (markHistoricalPredecessor 426-434, INSERT at 453+, post-insert 495-506)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` (mergedImportanceTier 297, applyPostInsertMetadata 352, deprecation 512-526)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` (dynamic SET 80-109, ALLOWED_POST_INSERT_COLUMNS 54-62)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` (constitutional auto-surface 184-203)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` (walker 1121-1172, specificFiles 1240-1270)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` (realpathSync canonicalization 135-142)
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts` (getCanonicalPathKey with realpath 21-58)
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` (isMemoryFile 955-980)
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts` (dispatch 104)
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (memory_update schema 295)
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts` (326-379 — no UPDATE coverage)

## Findings - New

### P0 Findings

1. **memory_update MCP tool bypasses Invariant 3: arbitrary tier promotion on any existing row** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:67`, `87`, `149` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:399-403` — The `memory_update` handler validates `importanceTier` against `VALID_TIERS` (line 67) but performs NO check against the existing row's `file_path` before writing `importance_tier = ?` via `update_memory(updateParams)`. `update_memory` in vector-index-mutations.ts at lines 399-403 writes `importance_tier` directly with no path guard (it reads `existingRow.file_path` at line 382 but only for provenance, not for invariant enforcement). The tool is exposed in the public MCP surface (`tool-schemas.ts:295`, `memory-tools.ts:70,104`). Any caller — including an agent persuaded by poisoned frontmatter or a compromised client — can invoke `memory_update({ id: <any-non-constitutional-memory-id>, importanceTier: 'constitutional' })` and promote an arbitrary memory to `'constitutional'`. The auto-surface hook (`hooks/memory-surface.ts:187`) will then return that row in the top-10 constitutional set, effectively injecting attacker-controlled content into every search session's context prelude. This is a definitive bypass of the user-directed "Only documents placed in the dedicated constitutional folder can be marked as constitutional" invariant. Fix: in `handleMemoryUpdate`, when `importanceTier === 'constitutional'` is requested, fetch `existing.file_path` (already retrieved at line 75) and reject if `!isConstitutionalPath(existing.file_path)`; alternatively enforce the guard at `update_memory` so all UPDATE callers are covered (lineage-state, reconsolidation paths go through different code but those already respect the tier carried in `parsed.importanceTier` which has been downgraded by the save-time guard). Regression test needed: `memory-save-index-scope.vitest.ts` (or a new `memory-update-index-scope.vitest.ts`) must assert that `handleMemoryUpdate({ id, importanceTier: 'constitutional' })` on a row whose `file_path` is not under `/constitutional/` either rejects or downgrades.

```json
{
  "claim": "The memory_update MCP tool permits arbitrary tier promotion to 'constitutional' on any existing memory without a path check, defeating Invariant 3 (constitutional tier only for files under /constitutional/).",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:67", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:87", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:149", ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:399", ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:295", ".opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:104"],
  "counterevidenceSought": "Checked handleMemoryUpdate for any isConstitutionalPath call — none. Checked update_memory in vector-index-mutations.ts for any path check before the importance_tier column write — none (existingRow.file_path is fetched at line 382 but only used to return the spec_folder/canonical_file_path on the response, never compared against isConstitutionalPath). Checked whether the MCP tool is behind an authz gate — it's in the standard memory_update tool surface, validated only against VALID_TIERS. Checked whether validateGovernedIngest fires for memory_update — it doesn't; that is a memory_save-path control. Checked whether mutation-hooks.ts adds a tier-promotion veto — it invalidates caches post-update but does not block the update.",
  "alternativeExplanation": "If the product design intentionally treats memory_update as a superuser-only metadata editor with the expectation that callers uphold the invariant manually, then this is by-design. But the user-stated invariant is absolute ('Only documents placed in the dedicated constitutional folder can be marked as constitutional') and the invariant language makes no carve-out for metadata-editor tools. Packet 011's own Files-to-Change scope omitted memory-crud-update.ts, leaving a known write path unguarded.",
  "finalSeverity": "P0",
  "confidence": 0.95,
  "downgradeTrigger": "Evidence that memory_update is not in fact exposed to untrusted MCP clients (e.g., it requires an admin JWT), OR an explicit spec-level decision that the invariant applies only to memory_save writes. Neither is documented in packet 011."
}
```

### P1 Findings

1. **memory_update missing governance_audit record for tier changes** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:201-224` — Even assuming the P0 above is patched with a path-check, the `memory_update` path today writes to `mutation_ledger` (line 201) but never emits a `governance_audit` row specifically for `importanceTier` changes. Packet 010/011 do not introduce this; packet 011 iter-2 flagged the same gap for the save-path silent-downgrade branch. Combined with the P0 above, a successful attack would leave only a `mutation_ledger` trace with `reason: 'memory_update: metadata update'` — no explicit flag that a constitutional tier was promoted. Fix: when `importanceTier` transitions to or from `'constitutional'`, emit a `governance_audit` row (action=`tier_transition`, old_tier, new_tier, file_path).

```json
{
  "claim": "memory_update writes no governance_audit row when importanceTier changes, so tier-transition events (including potential Invariant 3 violations) are only visible in the generic mutation_ledger without a typed signal.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:201", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:220"],
  "counterevidenceSought": "Searched memory-crud-update.ts for 'governance_audit' / recordGovernanceAudit — no hits. Searched for any tier-transition logging — only a console.log via mutation-hooks clearing the constitutional cache (indirect signal).",
  "alternativeExplanation": "mutation_ledger is the canonical audit surface; governance_audit is optional and scope-governance-specific. If policy says mutation_ledger suffices, this is a non-issue.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "A spec-level statement that mutation_ledger is the sole audit surface for tier changes and governance_audit is never required for metadata writes."
}
```

2. **Iter-1 P1-003 (symlink bypass) — confirmed P1, re-evaluation: design-level inconsistency** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1245`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:135-142`, `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:21-42`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:956` — Confirmed: `path.resolve` is used in the save-time guard AND the walker's specificFiles path AND `isMemoryFile`. Adjacent code explicitly uses `realpathSync` with a SECURITY comment (code-graph/handlers/scan.ts:135 "Canonicalize paths via realpathSync() to prevent symlink bypass"), and `canonical-path.ts` uses `realpathSync` for DB canonical_file_path computation. So the project KNOWS symlinks need realpath resolution, but the Invariant-enforcing paths don't follow that doctrine. This is not a P0 because the attack requires symlink write access inside the repo (already a privileged state), but it IS a coherent design gap and should be upgraded to be tracked alongside the P0 in release notes. Severity stays P1 (no new finding; re-cross-referencing from deeper proof). This finding is now the strongest candidate for escalation if any evidence of symlink presence in a test fixture or CI-writeable scratch is found.

```json
{
  "claim": "The save-time guard and memory-walker use path.resolve (which does not follow symlinks) while sibling code (code-graph scan, canonical-path.ts) uses realpathSync explicitly for the same invariant; this is an acknowledged project doctrine that packet 011 did not extend to the memory save/walker guard paths.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306", ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1245", ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:135", ".opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:26"],
  "counterevidenceSought": "Checked whether a higher-level wrapper calls realpathSync before memory-save — no; the caller chain is MCP handler → handleMemorySave → prepareParsedMemoryForIndexing which is the first place canonicalFilePath is computed, and it uses path.resolve only.",
  "alternativeExplanation": "If the repo contract forbids symlinks under specs/ and .opencode/ (enforced by CI lint), the gap is defense-in-depth. The repo has no such lint, confirmed by absence of any CI hook referencing --verify in packet 011 iter-4 P2-017.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "Add CI lint preventing symlinks in writeable repo paths, or switch save-time/walker to realpathSync."
}
```

### P2 Findings

1. **update_memory silently invalidates constitutional cache on every tier change** — `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:402` — `clear_constitutional_cache()` fires whenever `importanceTier !== undefined` in the update params. If the P0 above is patched, this still produces a side-effect with no observability: a legitimate tier downgrade triggers a cache miss on the next auto-surface invocation. Low impact, but worth noting as the cache invalidation is the only live signal that tier changed. Combined with the missing governance_audit (P1 above), there is no durable record distinguishing "tier changed because of legitimate author edit" from "tier changed because of attempted promotion."

2. **README.md mcp_server "Invariants" section omits memory_update write path** — `.opencode/skill/system-spec-kit/mcp_server/README.md:111-116` (per iter-3 traceability check) — The README documents the three invariants but mentions only the save-time guard and walker-time exclusions. A reader searching for "every place tier is enforced" would miss the gap at memory_update. This is a documentation-completeness issue; after the P0 is patched, the README should enumerate every enforcement site.

3. **No test covers memory_update with importanceTier transitions** — `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:326-379` — The test suite covers only `handleMemorySave` and `indexMemoryFileFromScan`. No test asserts behavior when `memory_update` attempts to promote a non-constitutional path to `'constitutional'`. This is both the regression-test gap for the P0 above and a compound with iter-4 P2-016 (no readme.md exclusion test) and P2-014 (no direct isConstitutionalPath tests).

## Traceability Checks

- **invariant_chain_proof** (new protocol this iteration): Traced each of the three invariants through every known writable entry-point:
  - **Invariant 1 (z_future)**: chains pass for walker + save + parser + specificFiles; `memory_update` ACCEPTS the tier change but the row's `file_path` was vetted at original save time, so no NEW z_future row can appear via update. Pass.
  - **Invariant 2 (external)**: same; memory AND code-graph walker both gate; specificFiles gated; code-graph scan has realpath hardening, memory-save does not (see P1-2 above). Status: PASS for the direct chain, PARTIAL under threat-model lens (symlink bypass).
  - **Invariant 3 (constitutional tier)**: INSERT chain passes (memory-save guard, shared prepareParsedMemoryForIndexing for scan + direct). UPDATE chain FAILS — memory_update → update_memory has no path guard. Status: **FAIL — P0 above.**
- **spec_code**: pass — packet 011's Files-to-Change scope did not list memory-crud-update.ts, so the omission is consistent with the packet's declared scope, but the invariant is violated irrespective of scope. Recommend a follow-on packet in the 011-lineage series to patch update_memory.
- **fromScan × constitutional guard interaction**: pass — `fromScan` flag only affects the transactional-reconsolidation recheck at `memory-save.ts:2390`; the constitutional guard at :310 runs unconditionally via `prepareParsedMemoryForIndexing` regardless of origin. Verified by tracing all three call sites of `prepareParsedMemoryForIndexing` (lines 1327, 2096, 2606, 2827, 2873, 3126).

## Confirmed-Clean Surfaces (this iteration)

- **reconsolidation.ts merge path**: `mergedImportanceTier = newMemory.importanceTier ?? currentRow.importance_tier`. Because `newMemory.importanceTier` is the post-guard tier (already downgraded if path is non-constitutional), and because `currentRow.importance_tier` was itself validated at its own original save, no fresh bypass exists here.
- **lineage-state.markHistoricalPredecessor**: only SETS tier to `'deprecated'` or preserves `'constitutional'` (never elevates a non-constitutional row to constitutional). Clean.
- **schema migration at vector-index-schema.ts:729-731**: UPDATE `document_type='constitutional'` WHERE `importance_tier='constitutional'` — keyed off an already-constitutional tier, does not create new constitutional rows. Clean.
- **attention-decay.ts, retry-manager.ts, corrections.ts UPDATE memory_index paths**: all touch fields other than `importance_tier` (updated_at, retry_count, related_memories, etc.). Clean.
- **Auto-surface hook at hooks/memory-surface.ts**: correctly queries `WHERE importance_tier = 'constitutional'`; if the P0 is patched, this hook continues to serve the expected 2 rows. If the P0 is NOT patched, the hook will faithfully surface attacker-promoted rows — the hook itself is not buggy, the INPUT is poisoned.

## Cross-dimension findings

- **Correctness × Security**: the P0 is simultaneously (a) a correctness violation of Invariant 3 and (b) a security vulnerability enabling attacker-controlled content injection into every search session's constitutional prelude. Single finding, dual lens.
- **Correctness × Traceability**: memory_update handler is in the Files-to-Change scope of NO packet — 011's scope excluded it; 010's scope (fromScan) did not touch it. The gap is a blind spot that both iterations' single-dimension reviewers missed and a deeper cross-dimension probe surfaces.
- **Maintainability × Correctness**: iter-4 P1-015 flagged no code back-references to packet 011 in shipped files; this iteration strengthens that finding because `memory-crud-update.ts` is EXACTLY the kind of file a maintainer would not read when working on packet 011 follow-ups, precisely because there is no cross-reference.

## Severity Re-evaluation of Prior Findings

- **P1-001 (TOCTOU in cleanup)**: CONFIRMED P1. Cleanup script opens its own SQLite connection with no cross-process lock; MCP server uses in-process `withSpecFolderLock` only. SQLite's default journal mode serializes DB writes but not build-plan→apply logical consistency. Real race. No escalation — race is narrow (SELECT then DELETE-by-id in same connection, with milliseconds between). Severity P1 correct.
- **P1-003 (symlink bypass)**: CONFIRMED P1 with design-inconsistency framing (see P1-2 above). No escalation; attack requires symlink write access. Keeps P1.
- **P1-004 (LIKE divergence)**: CONFIRMED P1. No new evidence. Unchanged.
- **P2-003 (two guard invocations)**: CONFIRMED P2. The asymmetry at memory-save.ts:2695 (validatedPath, pre-resolve) vs :306 (canonicalFilePath, post-resolve) holds defense-in-depth; no escalation. If `path.resolve` were replaced with `realpathSync` (per P1-2), the asymmetry would need a second look, but currently P2 correct.
- **No iter-1..iter-4 finding should be downgraded.** No finding was resolved by subsequent implementation (we're read-only and no fixes have landed).

## Coverage

- Dimension: correctness (deeper pass + cross-dimension) — covered
- Files reviewed: 14 (see Files Reviewed)
- Remaining dimensions: security edge-cases (iteration 6), synthesis (iteration 7)

## Next Focus

**Security edge-cases (iteration 6)** — focus areas:
1. Confirm the P0 attack path is reachable via actual tool invocation (does the MCP tool require a specific client capability, tenant/scope check, or admin role? — evidence so far says no).
2. Audit all OTHER MCP tools that mutate `memory_index` for the same class of Invariant-3 bypass: `memory_delete`, `memory_bulk_delete`, `memory_validate`, `memory_causal_link`, `memory_causal_unlink`, `memory_ingest_start`.
3. Trace invariant chain for `memory_index_scan` rescans of existing rows — does the scan revisit rows and re-assert the guard, or does it only touch new paths?
4. Re-evaluate `fromScan` interaction with mutation-hooks cache invalidation — is there a TOCTOU between `clear_constitutional_cache` and `memory-surface.ts` cache refresh during a concurrent attack?
5. Prior security iteration (iter-2) did NOT cover `memory_update`; rectify here.
