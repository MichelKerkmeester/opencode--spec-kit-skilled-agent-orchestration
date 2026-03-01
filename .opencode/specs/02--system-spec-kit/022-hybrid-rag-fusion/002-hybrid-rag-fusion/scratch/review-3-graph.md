# Code Review: Graph Channel Files (003 deliverables)

Reviewer: @review agent | Date: 2026-02-20

---

## P0 — HARD BLOCKERS (fixed)

### 1. Duplicate section number in graph-search-fn.ts
**File:** `lib/search/graph-search-fn.ts`
**Issue:** Two sections were both numbered `6.` — "SGQS SKILL GRAPH CHANNEL" (line 204) and "FACTORY FUNCTION" (line 248 after the rename). Violates the clean section ordering rule.
**Fix applied:** Renamed the first `6.` to `5b. SGQS SKILL GRAPH CHANNEL` and the second to `6. FACTORY FUNCTION (createUnifiedGraphSearchFn)`.

### 2. cachedAuthorityMap never populated — logic dead code (graph-search-fn.ts)
**File:** `lib/search/graph-search-fn.ts`, lines 113, 226-233
**Issue:** `cachedAuthorityMap` (module-level `Map<string, number> | null`) was declared and read inside `querySkillGraph` for T013 authority scoring, but it was never written to anywhere in the module. `computeAuthorityScores()` was exported but never called internally. The T013 authority path was therefore always a no-op (`cachedAuthorityMap` remained `null` forever), making `isGraphAuthorityEnabled()` flag checks meaningless.
**Fix applied:** Both `then()` callbacks inside `createUnifiedGraphSearchFn` — the initial warm-load and the per-call background refresh — now call `cachedAuthorityMap = computeAuthorityScores(graph)` alongside `cachedGraph = graph`. Authority scores are now populated and kept in sync with each graph snapshot refresh.

### 3. Missing box header in graph-flags.vitest.ts
**File:** `tests/graph-flags.vitest.ts`, line 1
**Issue:** File started directly with `// @ts-nocheck` and an import, without the box header used by the other two test files. Violates the P0 "File has box header" rule.
**Fix applied:** Added the standard box header block after `// @ts-nocheck`.

---

## P1 — REQUIRED (noted, no fix required)

### 4. createUnifiedGraphSearchFn return type is inferred, not declared
**File:** `lib/search/graph-search-fn.ts`, line 267
**Status:** The function signature `function createUnifiedGraphSearchFn(...): GraphSearchFn` does declare an explicit return type (`GraphSearchFn`). This passes P1. No action needed.

### 5. options parameter uses Record<string, unknown> (no named interface)
**File:** `lib/search/graph-search-fn.ts`, line 288
**Status:** The `unifiedGraphSearch` inner function receives `options: Record<string, unknown>` rather than a named interface (e.g., `GraphSearchOptions`). Acceptable for now since `GraphSearchFn` is the contract type and options are accessed with runtime narrowing. Track for a future interface extraction if options shape grows.

### 6. cachedAuthorityMap is module-level mutable state
**File:** `lib/search/graph-search-fn.ts`, line 113
**Note:** The module-level `cachedAuthorityMap` variable is shared across all instances of `createUnifiedGraphSearchFn`. If two factories are created with different `skillRoot` values, they race on this single map. This is consistent with the existing `cachedGraph` being factory-local (not module-level), so there is an asymmetry. Low risk for the current single-factory usage pattern, but worth noting for future refactor.

---

## P2 — RECOMMENDED

### 7. `import type` separation
**Files:** All three source files
**Status:** All three source files correctly use `import type` for type-only imports. Pass.

### 8. Readonly on AUTHORITY_TYPE_MULTIPLIERS
**File:** `lib/search/graph-search-fn.ts`, line 97
**Status:** `AUTHORITY_TYPE_MULTIPLIERS` is typed `Record<string, number>` — could be `Readonly<Record<string, number>>` to prevent accidental mutation. Low priority, no runtime risk.

### 9. Test file @ts-nocheck scope
**Files:** All three test files
**Note:** All use `// @ts-nocheck` at the top. Acceptable for test files that exercise runtime mock patterns, but worth progressively removing as the test suite matures to catch type-level regressions.

---

## Special Checks

### Feature flag strict checking (=== 'true')
**Status: PASS.** All three flags in `graph-flags.ts` use strict string equality (`=== 'true'`). The test suite in `graph-flags.vitest.ts` explicitly verifies that `'TRUE'`, `'1'`, and `'yes'` all return `false`. Correct.

### Singleton pattern correctness
**Status: PASS.** `skill-graph-cache.ts` exports a module-level `const skillGraphCache = new SkillGraphCacheManager()`. Single-flight guard via `this.inflight` is correctly nulled after resolution so subsequent calls re-enter the expiry check path. TTL comparison uses `>` (strict) which means a graph exactly at TTL boundary is rebuilt — acceptable conservative behaviour.

### Namespace prefix consistency (mem: / skill:)
**Status: PASS.** `queryCausalEdges` prefixes IDs with `mem:` (line 185). `querySkillGraph` prefixes IDs with `skill:` (line 236). Test 7 in `graph-search-fn.vitest.ts` asserts both prefixes are present and that no result lacks a recognised prefix. Consistent.
