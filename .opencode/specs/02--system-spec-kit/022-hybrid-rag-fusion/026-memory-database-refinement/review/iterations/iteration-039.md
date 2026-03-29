# Iteration 039: Maintainability — Code Patterns in High-Density Fix Files

**Dimension:** Maintainability
**Focus:** Code quality in the four highest-density fix files — dead code, naming consistency, comment quality, over-engineering, magic numbers, error handling patterns, and duplication across fix locations
**Date:** 2026-03-28
**Status:** complete

---

## Files Reviewed

| File | LOC | Fixes Applied |
|---|---|---|
| `mcp_server/lib/search/hybrid-search.ts` | 2247 | 6 |
| `mcp_server/lib/search/vector-index-schema.ts` | 2290 | 4 |
| `mcp_server/lib/storage/lineage-state.ts` | 1418 | 2 |
| `mcp_server/handlers/memory-save.ts` | 1389 | 3 |

---

## Findings

### [P1] Duplicated fallback policy implementation across two pipeline entry points

**File:** `mcp_server/lib/search/hybrid-search.ts`

The adaptive fallback chain is implemented separately in `searchWithFallback()` (line 1553) and `collectRawCandidates()` (line 1469). Both functions use the same threshold constants (`PRIMARY_FALLBACK_MIN_SIMILARITY = 30`, `SECONDARY_FALLBACK_MIN_SIMILARITY = 17`, `TIERED_FALLBACK_MIN_SIMILARITY = 10`), apply the same channel override logic via `applyAllowedChannelOverrides()`, and emit the same `fallbackRetry: true` marker on results. When the fallback policy changes — threshold values, channel override rules, retry behaviour — both paths must be updated in lockstep.

**Evidence:**
- `hybrid-search.ts:1496–1519` in `collectRawCandidates()`: primary pass at `PRIMARY_FALLBACK_MIN_SIMILARITY`, fallback at `SECONDARY_FALLBACK_MIN_SIMILARITY`, maps `fallbackRetry: true`
- `hybrid-search.ts:1566–1586` in `searchWithFallback()`: identical structure, same thresholds, same `fallbackRetry` tagging, same `applyAllowedChannelOverrides` calls
- Both paths also call `ftsSearch`/`bm25Search` as final last-resort fallback in the same order (`hybrid-search.ts:1522–1535` and `hybrid-search.ts:1591–1599`)

The duplication was introduced by fixing bugs in these two separately maintained paths; the fixes landed identically, which confirms they implement the same policy.

**Recommendation:** Extract a shared `runAdaptiveFallbackPasses()` that accepts a `stopAfterFusion: boolean` parameter and returns stage-appropriate results. Both callers then delegate to this shared executor.

---

### [P1] `memory_conflicts` DDL appears in three independent code sites

**File:** `mcp_server/lib/search/vector-index-schema.ts`

The `memory_conflicts` table is defined in three separate places with slightly different column sets and constraints. Future schema changes require updating all three, and the variation in shape between sites is a latent source of migration drift.

**Evidence:**
- `vector-index-schema.ts:179–198` — `createMemoryConflictsTable()`: canonical shape, full column set, correct constraints
- `vector-index-schema.ts:403–415` — migration v4 inline DDL: legacy shape missing `new_content_preview`, `existing_content_preview`, `contradiction_type`, `spec_folder`, and `created_at`; uses `similarity_score` not `similarity`
- `vector-index-schema.ts:1963–1980` — `ensureCompanionTables()` bootstrap: re-declares the table with the modern shape but as an independent `CREATE TABLE IF NOT EXISTS` block, bypassing `createMemoryConflictsTable()`

Additionally `idx_conflicts_memory` and `idx_conflicts_timestamp` are created in both `run_migrations()` migration v12 (line 619–631) and in `ensureCompanionTables()` (line 1987–1989) as separate `CREATE INDEX IF NOT EXISTS` calls.

**Recommendation:** Route all three sites through `createMemoryConflictsTable()` and consolidate index creation into one helper. Migration v4 should use the legacy shape only for the initial creation; migration v12 should handle the DDL upgrade via the existing `migrateMemoryConflictsTable()` path.

---

### [P1] Misleading log level: routine entity cleanup logged at `console.error`

**File:** `mcp_server/handlers/memory-save.ts`

Two calls to `refreshAutoEntitiesForMemory` on superseded memories use `console.error` for the success path (lines 754 and 763), creating false-positive noise in error monitoring. This pattern was introduced by the fix at the entity cleanup block and does not match the established convention in the rest of the file where `console.error` is reserved for actual failures.

**Evidence:**
- `memory-save.ts:754`: `console.error('[memory-save] Cleaned stale auto-entities for superseded memory #${existing.id}')` — this is a successful cleanup, not an error
- `memory-save.ts:763`: `console.error('[memory-save] Cleaned stale auto-entities for PE-superseded memory #${peResult.supersededId}')` — same pattern
- Compare: `memory-save.ts:755–757` and `memory-save.ts:764–766` use `console.warn` for actual failure paths, consistent with the rest of the file
- The surrounding code at `memory-save.ts:541` and `memory-save.ts:560` uses `console.error` correctly for quality gate rejections and failures

**Recommendation:** Change both `console.error` calls on the success path to `console.log` or `logger.debug`. Reserve `console.error` for genuine error conditions.

---

### [P2] Redundant `void error` suppression instead of explicit intent comment

**File:** `mcp_server/handlers/memory-save.ts`

At line 233, a caught error variable is suppressed with `void error` inside a try-catch block for the spec-doc-health check. While the intent (non-fatal check) is documented in the following comment, the `void error` idiom is inconsistent with how other non-fatal paths in the same file handle errors. Most non-fatal blocks either use `(_: unknown)` in the catch parameter or log the error at warn level. The `void error` form makes it less obvious that the variable was intentionally discarded.

**Evidence:**
- `memory-save.ts:232–235`:
  ```ts
  } catch (error: unknown) {
    void error;
    /* spec-doc-health check failure is non-fatal */
  }
  ```
- Compare with `memory-save.ts:1156`: `} catch (_: unknown) { /* best-effort cleanup */ }` — more idiomatic
- Compare with `memory-save.ts:566–569`: catch block logs error before proceeding — also consistent

**Recommendation:** Use `(_: unknown)` for the catch parameter (matching the file's dominant pattern) and keep the non-fatal comment. This eliminates the unused `error` binding and removes the need for `void`.

---

### [P2] `lineage-state.ts` read helpers repeat the same setup boilerplate four times

**File:** `mcp_server/lib/storage/lineage-state.ts`

Four exported read functions (`inspectLineageChain`, `summarizeLineageInspection`, `resolveActiveLineageSnapshot`, `resolveLineageAsOf`) each independently call `ensureLineageTables(database)` followed by `resolveLogicalKey(database, memoryId)` with identical null-guard returns. This pattern was consistent in original code and has been preserved by both fix passes, but its repetition increases maintenance cost when setup or guard logic changes.

**Evidence:**
- `lineage-state.ts:801–805`: `ensureLineageTables` + `resolveLogicalKey` + early return
- `lineage-state.ts:838–844`: same sequence
- `lineage-state.ts:922–927`: same sequence (omits `bindHistory`, inconsistency noted below)
- `lineage-state.ts:963–969`: same sequence (also omits `bindHistory`)

The write functions (`seedLineageFromCurrentState`, `recordLineageTransition`, `createAppendOnlyMemoryRecord`) all call `bindHistory()` before `ensureLineageTables()`. The read functions at lines 922 and 963 skip `bindHistory()`, which is inconsistent even if currently benign.

**Recommendation:** Extract `prepareLineageRead(database, memoryId)` that runs `ensureLineageTables`, optionally `bindHistory`, and `resolveLogicalKey`, returning the resolved key or null. Replace the four boilerplate blocks with this helper.

---

### [P2] `hybrid-search.ts` co-activation boost block has inconsistent indentation

**File:** `mcp_server/lib/search/hybrid-search.ts`

The M10 fix block at lines 1260–1265 introduced a score-alias update inside the co-activation boost loop. The inner block (`const boostedScore` through the `intentAdjustedScore` update) has inconsistent indentation relative to the surrounding `if (boost !== undefined)` guard — the inner lines are at the outer guard's indentation level rather than one level deeper.

**Evidence:**
- `hybrid-search.ts:1260–1265`:
  ```ts
              if (boost !== undefined) {
                // M10 FIX: Update all score aliases so downstream consumers see the boost
              const boostedScore = ((result.score as number) ?? 0) + boost * CO_ACTIVATION_CONFIG.boostFactor;
              (result as Record<string, unknown>).score = boostedScore;
              if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
              if ('intentAdjustedScore' in result) (result as Record<string, unknown>).intentAdjustedScore = boostedScore;
              }
  ```
  The `const boostedScore` and subsequent lines are at the same indent as the outer `if`, not inside it.

This is a visual indentation error that does not affect runtime behaviour (the code is within the `if` block) but misleads readers into thinking the boost-alias updates run unconditionally.

**Recommendation:** Indent lines 1261–1264 one additional level to match the `if (boost !== undefined)` guard.

---

### [P2] Magic numbers in `collectRawCandidates` `skipFusion` path are not explained

**File:** `mcp_server/lib/search/hybrid-search.ts`

At line 1011, `collectRawCandidates` filters the `degree` source out of fusion lists before calling `collectCandidatesFromLists`. This filtering decision has no comment. The `skipFusion` path at the same site is the only place where `degree` is explicitly excluded from candidate collection. All other fusion paths either include or exclude `degree` based on feature-flag gates, making this exclusion non-obvious.

**Evidence:**
- `hybrid-search.ts:1009–1013`:
  ```ts
  if (options.skipFusion) {
    return collectCandidatesFromLists(
      lists.filter((list) => list.source !== 'degree'),
      options.limit ?? DEFAULT_LIMIT
    );
  }
  ```
  No comment explains why `degree` must be excluded from raw-candidate mode.

**Recommendation:** Add a brief comment explaining that the `degree` channel provides re-ranking signals for fused results and does not carry independent content candidates, making it inappropriate for raw-candidate collection.

---

### [P2] `vector-index-schema.ts` migration version gap (10, 11 absent) has no explanation

**File:** `mcp_server/lib/search/vector-index-schema.ts`

The `migrations` object in `run_migrations()` jumps from version 9 to version 12 (lines 614–616), skipping versions 10 and 11. There is no comment explaining this gap. Readers and future contributors will not know whether versions 10 and 11 were deliberate no-ops, were merged into adjacent migrations, or represent a numbering mistake.

**Evidence:**
- `vector-index-schema.ts:613` — migration `9:` definition ends
- `vector-index-schema.ts:614` — `12:` definition begins immediately
- The schema version comment block (lines 320–341) lists V10 ("Schema consolidation and index optimization") and V11 ("Error code deduplication") but both are absent from the `migrations` map

The header comment at line 345 mentions "BUG-019 FIX: Wrap migrations in transaction for atomicity", and the code iterates `for (let v = from_version + 1; v <= to_version; v++)` (line 1076), which silently skips missing keys. This means databases upgrading from v9 will attempt v10, v11 (silently skip both), then run v12.

**Recommendation:** Either add empty migration stubs `10: () => {}` and `11: () => {}` with comments explaining what they historically contained, or add a comment near the `12:` definition explaining the deliberate skip.

---

### [P2] `lineage-state.ts` type alias `LineageRow` is dead code

**File:** `mcp_server/lib/storage/lineage-state.ts`

At line 167, a type alias `type LineageRow = MemoryLineageRow` is defined. This alias is used exactly once at line 530 in the `validateTransitionInput` function signature. Everywhere else in the file `MemoryLineageRow` is used directly. The alias adds no semantic value and creates a minor naming inconsistency — callers reading the `validateTransitionInput` signature must look up what `LineageRow` means.

**Evidence:**
- `lineage-state.ts:167`: `type LineageRow = MemoryLineageRow;`
- `lineage-state.ts:530`: `predecessor: LineageRow | null` — the one use
- All other parameters and local variables in the same file use `MemoryLineageRow` directly (e.g. `lineage-state.ts:272`, `lineage-state.ts:339`, `lineage-state.ts:397`, `lineage-state.ts:648`)

**Recommendation:** Remove the `LineageRow` alias and replace the one use at line 530 with `MemoryLineageRow` directly.

---

### [P2] `memory-save.ts` imports `applyPostInsertMetadata` from two different paths

**File:** `mcp_server/handlers/memory-save.ts`

The handler imports `applyPostInsertMetadata` from `'./save/db-helpers'` (line 46) and also passes it as a parameter to `indexChunkedMemoryFile` at line 609. However, the chunked indexing path receives it as a dependency injection argument while the direct path (line 1301) calls it directly on the import. This dual usage pattern — sometimes injected, sometimes called directly — is inconsistent and makes it harder to reason about which version of the function is in use.

**Evidence:**
- `memory-save.ts:46`: `import { applyPostInsertMetadata } from './save/db-helpers';`
- `memory-save.ts:609`: `const chunkedResult = await indexChunkedMemoryFile(filePath, parsed, { force, applyPostInsertMetadata });` — passes it as an option
- `memory-save.ts:1301`: `applyPostInsertMetadata(database, indexResult.id, {});` — calls it directly

This is not a bug, but the mixing of injection and direct call patterns in the same function suggests the chunked code path was refactored to accept the function as an injectable dependency, while the atomic path was not updated to match.

**Recommendation:** Either make the direct call site consistent with the injected pattern, or document the reason for the asymmetry in a brief comment.

---

## Summary

**P0:** 0 findings
**P1:** 3 findings
**P2:** 7 findings
**Total:** 10 findings

The dominant maintainability risks are:

1. **Duplicated orchestration policy** (`hybrid-search.ts`): The adaptive fallback chain exists twice in parallel code paths and must be maintained in lockstep. This is the highest-risk finding because the two paths have already drifted — `searchWithFallback` has a direct `tiered` delegation while `collectRawCandidates` re-implements the ladder — meaning further divergence is likely.

2. **Duplicated DDL declarations** (`vector-index-schema.ts`): The `memory_conflicts` table and companion indexes appear independently in three code sites with different schema shapes. The v4 migration still creates the legacy schema, the v12 migration upgrades it, and `ensureCompanionTables` re-declares the modern shape separately — all three are inconsistent with each other.

3. **Wrong log level on success path** (`memory-save.ts`): `console.error` used for non-error entity cleanup events will generate false-positive alerts in production log monitoring.

No dead unreachable code blocks (functions or branches that can never execute) were found in these files. The `LineageRow` type alias is a naming superfluity rather than dead code in the execution-path sense.
