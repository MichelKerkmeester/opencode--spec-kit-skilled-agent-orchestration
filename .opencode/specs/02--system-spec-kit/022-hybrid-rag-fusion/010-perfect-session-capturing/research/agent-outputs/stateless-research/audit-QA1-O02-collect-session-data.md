# Audit QA1-O02: collect-session-data.ts

**File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (853 LOC)
**Auditor:** Claude Opus 4.6 (@review agent)
**Date:** 2026-03-09
**Focus:** SPEC_FOLDER backfill correctness, null safety on sparse stateless payloads, extractor orchestration order, data integrity through pipeline
**Severity contract:** P0 = data loss/security/crash, P1 = incorrect output/silent corruption, P2 = code quality

---

## Score Breakdown

| Dimension        | Score | Max | Notes                                                    |
| ---------------- | ----- | --- | -------------------------------------------------------- |
| Correctness      | 22    | 30  | Weight-swap bug in learning index; mutation of input arg |
| Security         | 23    | 25  | Path traversal guard present and correct                 |
| Patterns         | 18    | 20  | Consistent with project conventions                      |
| Maintainability  | 12    | 15  | Good structure; lazy-load wrapper is dead code           |
| Performance      | 9     | 10  | No obvious inefficiencies                                |
| **Total**        | **84**| 100 | **ACCEPTABLE** -- Pass with required fixes               |

---

## Findings

### P1-01: Learning weight swap -- context and uncertainty coefficients are transposed

**File:** `collect-session-data.ts:201-204`
**Evidence:**

```ts
const index =
  (dk * CONFIG.LEARNING_WEIGHTS.knowledge) +     // knowledge * 0.40  -- correct
  (du * CONFIG.LEARNING_WEIGHTS.context) +        // uncertainty * 0.35 -- WRONG
  (dc * CONFIG.LEARNING_WEIGHTS.uncertainty);     // context * 0.25     -- WRONG
```

The config defines weights as `{ knowledge: 0.4, context: 0.35, uncertainty: 0.25 }`. The variable `du` represents `deltaUncert` (uncertainty delta) but is multiplied by the **context** weight (0.35). Conversely, `dc` represents `deltaContext` but is multiplied by the **uncertainty** weight (0.25). The correct mapping should be:

```ts
(du * CONFIG.LEARNING_WEIGHTS.uncertainty) +   // uncertainty delta * uncertainty weight
(dc * CONFIG.LEARNING_WEIGHTS.context);        // context delta * context weight
```

**Impact:** Every learning index calculation is silently corrupted. Context improvements are underweighted by 29% (0.25 vs 0.35) and uncertainty reductions are overweighted by 40% (0.35 vs 0.25). All downstream `LEARNING_INDEX` and `LEARNING_SUMMARY` values in memory files are affected.

| Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
| --- | --- | --- | --- |
| P0 | No semantic alibi -- variable names `du`/`dc` are unambiguous abbreviations of `deltaUncert`/`deltaContext`. Could the naming be wrong instead of the weights? No -- `du = deltaUncert ?? 0` on line 199, `dc = deltaContext ?? 0` on line 200. The swap is in the weight selection, not the variable names. | Confirmed | P1 |

Downgraded from P0 to P1 because the learning index is informational metadata (no control flow depends on it) and no data is lost, but all values are silently incorrect.

---

### P1-02: Mutation of caller-owned `collectedData` object during SPEC_FOLDER backfill

**File:** `collect-session-data.ts:733-734`
**Evidence:**

```ts
if (!collectedData.SPEC_FOLDER && folderName) {
  collectedData.SPEC_FOLDER = folderName;   // mutates the argument in-place
}
```

The function signature accepts `collectedData: CollectedDataFull | null`. When non-null, the caller's object is mutated by adding a `SPEC_FOLDER` property. This is a side-effect that violates the function's stated purpose (collecting/returning session data, not modifying inputs). Callers in `workflow.ts` pass the same `collectedData` object to other extractors after `collectSessionData` returns, meaning the backfilled value leaks into downstream consumers that may not expect it.

**Impact:** Silent corruption if any downstream extractor behaves differently when `SPEC_FOLDER` is present vs absent. Currently no downstream crash observed, but the contract is fragile.

| Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
| --- | --- | --- | --- |
| P1 | The mutation is intentional (comment says "spec 013 Phase 0"). Downstream code in workflow.ts does reference `collectedData.SPEC_FOLDER` after this call but only for contamination filtering, where having the value is actually desired. | Confirmed but mitigated | P1 |

Kept at P1 because the mutation is undocumented in the function's contract and could cause subtle bugs if call order changes.

---

### P1-03: `sessionInfo` typed as `{}` loses type safety for subsequent property access

**File:** `collect-session-data.ts:678`
**Evidence:**

```ts
const sessionInfo = collectedData.recentContext?.[0] || {};
```

The fallback `{}` gives `sessionInfo` the type `RecentContextEntry | {}`. Every subsequent access casts it:

```ts
const SUMMARY: string = (sessionInfo as RecentContextEntry).learning  // line 697
const quickSummaryCandidates = [
  (sessionInfo as RecentContextEntry).request || '',   // line 711
  (sessionInfo as RecentContextEntry).learning || '',  // line 712
];
```

These repeated `as RecentContextEntry` casts suppress the type checker. If `recentContext` is missing (common in stateless mode), `sessionInfo` is `{}`, and all `.learning` / `.request` accesses silently return `undefined`, which is then coerced to empty string by `||`. This works at runtime but bypasses TypeScript's null-safety guarantees.

**Impact:** No runtime crash (optional chaining would be equivalent), but the pattern defeats compile-time detection of property access on wrong types. Future refactors could introduce bugs that TypeScript would otherwise catch.

| Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
| --- | --- | --- | --- |
| P1 | Runtime behavior is correct -- `undefined || ''` produces `''`. The casts are ugly but not dangerous today. | Confirmed, practical severity is low | P1 |

---

### P2-01: Lazy-load wrapper `getSimFactory()` is dead indirection

**File:** `collect-session-data.ts:604-607`
**Evidence:**

```ts
import * as simFactoryModule from '../lib/simulation-factory';
function getSimFactory(): typeof import('../lib/simulation-factory') {
  return simFactoryModule;
}
```

The import is a standard static `import *`. The wrapper function `getSimFactory()` adds no laziness -- the module is loaded at parse time regardless. The function is called once at line 671:

```ts
return getSimFactory().createSessionData({ ... });
```

This could be a direct call to `simFactoryModule.createSessionData(...)`.

**Impact:** No functional impact. Minor readability cost from the misleading "LAZY-LOADED DEPENDENCIES" section header.

---

### P2-02: Redundant conditional at lines 389-393

**File:** `collect-session-data.ts:389-393`
**Evidence:**

```ts
if (messageCount < 3) {
  return 'IN_PROGRESS';
}

return 'IN_PROGRESS';
```

The `if` guard returns the same value as the default return. The early return is dead code.

**Impact:** No functional impact. Minor readability confusion about whether different behavior was intended for low message counts.

---

### P2-03: `OUTCOMES` silently drops observations beyond index 10

**File:** `collect-session-data.ts:690-695`
**Evidence:**

```ts
const OUTCOMES: OutcomeEntry[] = observations
  .slice(0, 10)
  .map((obs) => ({
    OUTCOME: obs.title || obs.narrative?.substring(0, 300) || '',
    TYPE: detectObservationType(obs)
  }));
```

Observations are sliced to the first 10, and the remaining are discarded without logging. For long sessions with many observations, later (potentially more relevant) outcomes are lost.

**Impact:** Informational data loss in sessions with > 10 observations. Not a crash risk but reduces memory quality for complex sessions.

---

### P2-04: `continuationCount` fallback uses `||` instead of `??`

**File:** `collect-session-data.ts:580`
**Evidence:**

```ts
const continuationCount = recentContext?.[0]?.continuationCount || 1;
```

If `continuationCount` is explicitly `0` (first session, no continuations), `|| 1` coerces it to `1`. Should use `?? 1` to only fallback on `null`/`undefined`.

**Impact:** A session with `continuationCount: 0` would report `CONTINUATION_COUNT: 1` and `NEXT_CONTINUATION_COUNT: 2` instead of `0` and `1`. Affects session numbering accuracy.

| Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
| --- | --- | --- | --- |
| P1 | Is `continuationCount: 0` a valid value in practice? The `RecentContextEntry` interface types it as `number | undefined`, so `0` is valid. However, the first session would typically not have a `recentContext` entry at all, making the `?.` chain return `undefined` anyway. The `0` case is theoretically reachable but unlikely in practice. | Downgraded | P2 |

---

### P2-05: `TITLE` derivation may produce empty string for numeric-only folder names

**File:** `collect-session-data.ts:792`
**Evidence:**

```ts
TITLE: folderName.replace(/^\d{3}-/, '').replace(/-/g, ' '),
```

If `folderName` is `"001"` (no hyphen suffix), the regex `^\d{3}-` does not match, and `folderName` remains `"001"`. The result is `TITLE: "001"`, which is a valid but poor title. If `folderName` is `"001-"`, the regex strips it to `""`, producing an empty title.

**Impact:** Edge case only. Current spec folder naming conventions always include descriptive suffixes, making this unlikely in practice.

---

## SPEC_FOLDER Backfill Analysis (Audit Focus Area)

The backfill logic at lines 627-664 and 732-744 is **functionally correct** for its stated purpose:

1. **Detection chain:** CLI arg -> `detectSpecFolder()` -> multi-root resolution -> `/specs/` marker fallback -> `basename()` fallback. The chain is thorough and handles edge cases (multiple specs directories, normalized paths, Windows separators).

2. **Path traversal guard (lines 737-744):** Correctly uses `path.resolve()` + `startsWith(boundary + path.sep)` to prevent directory escape. The `=== boundary` check also allows the specs root itself, which is appropriate.

3. **Backfill mutation (line 734):** Correctly fills `collectedData.SPEC_FOLDER` before it's used on line 738, ensuring the path traversal guard applies to the backfilled value. The mutation side-effect is the concern documented in P1-02.

4. **Null propagation:** When `specFolderPath` is `null` (traversal rejected or no SPEC_FOLDER), `SPEC_FILES` defaults to `[]` and `detectRelatedDocs` is not called. This is safe.

---

## Null Safety on Sparse Stateless Payloads (Audit Focus Area)

The function handles `collectedData: null` correctly (line 669-676, returns simulation data). For non-null but sparse payloads:

- `collectedData.recentContext?.[0] || {}` -- safe but loses type info (P1-03)
- `collectedData.observations || []` -- safe
- `collectedData.userPrompts || []` -- safe
- `collectedData.SPEC_FOLDER` -- safe (nullish check before use)
- `collectedData.FILES` -- handled in `extractFilesFromData` which has its own null guards

No crash paths found for sparse stateless payloads. The main concern is the type-safety erosion from P1-03.

---

## Extractor Orchestration Order (Audit Focus Area)

The orchestration order in `collectSessionData()` (lines 686-831) is:

1. `calculateSessionDuration` -- depends on `userPrompts`, `now`
2. `extractFilesFromData` -- depends on `collectedData`, `observations`
3. Build `OUTCOMES` -- depends on `observations`
4. `detectSessionCharacteristics` -- depends on `observations`, `userPrompts`, `FILES`
5. Build `QUICK_SUMMARY` -- depends on `observations`, `sessionInfo`
6. `buildObservationsWithAnchors` -- depends on `observations`, `SPEC_FOLDER`
7. `generateSessionId` + `getChannel` -- stateless
8. **SPEC_FOLDER backfill** (line 733) -- mutates `collectedData`
9. `detectRelatedDocs` -- depends on `specFolderPath` (from step 8)
10. `buildImplementationGuideData` -- depends on `observations`, `FILES`, `folderName`
11. `buildProjectStateSnapshot` -- depends on `toolCounts`, `observations`, `FILES`, `SPEC_FILES`
12. `calculateExpiryEpoch` -- depends on `importanceTier`, `createdAtEpoch`
13. `extractPreflightPostflightData` -- depends on `collectedData`
14. `buildContinueSessionData` -- depends on many prior results

**Order correctness:** No dependency violations found. Each step's inputs are available from prior steps. The SPEC_FOLDER backfill (step 8) occurs before `detectRelatedDocs` (step 9) which needs it. Step 6 (`buildObservationsWithAnchors`) uses `collectedData.SPEC_FOLDER || folderName` directly, so it works regardless of backfill timing.

---

## Positive Highlights

1. **Path traversal guard** (lines 737-744) is well-implemented with proper `path.resolve()` + boundary check pattern.
2. **Error handling** around `detectRelatedDocs` (lines 747-753) correctly catches and logs without crashing.
3. **Comprehensive null coalescing** throughout the function prevents crashes on sparse payloads.
4. **Clean separation of concerns** -- each sub-function has a clear responsibility and well-defined interface.
5. **Session ID generation** uses `crypto.randomBytes(6)` (CSPRNG, 48 bits entropy) -- adequate for session identification.
6. **Multi-root spec directory resolution** (lines 633-654) handles complex project layouts robustly.

---

## Summary

| Severity | Count | IDs |
| --- | --- | --- |
| P0 (Blocker) | 0 | -- |
| P1 (Required) | 3 | P1-01 (weight swap), P1-02 (input mutation), P1-03 (type safety) |
| P2 (Suggestion) | 5 | P2-01 through P2-05 |

**Recommendation:** PASS with notes. The P1-01 weight swap is the most impactful finding -- it silently corrupts every learning index calculation. P1-02 and P1-03 are correctness hygiene issues that should be addressed to prevent future regressions. No P0 blockers; no security vulnerabilities; no crash paths.
