# Code Review: Core Pipeline Files
**Scope:** Recently modified/added sections only
**Files:** hybrid-search.ts, adaptive-fusion.ts, hybrid-search.vitest.ts

---

## P0 Violations Found and Fixed: 0

No P0 violations in the new/recently modified sections. All three files have box headers,
no `any` in public API (test file suppressed via `@ts-nocheck` — acceptable), no
commented-out code blocks, and WHY comments are present on complex logic.

---

## P1 Issues: 3 found, 3 fixed

### P1-1 FIXED — `intent` missing from `HybridSearchOptions` interface
**File:** `hybrid-search.ts`
**Location:** L438 and L409 (before fix)
**Issue:** `intent` was accessed via unsafe cast `(options as HybridSearchOptions & { intent?: string }).intent`
twice in `hybridSearchEnhanced`. The field was not declared on the interface, so callers had no
type-safe way to pass it.
**Fix:** Added `intent?: string` to `HybridSearchOptions` with TSDoc comment. Both cast expressions
replaced with plain `options.intent` access.

### P1-2 FIXED — Non-null assertion in `hybridSearch()` lacks justification comment
**File:** `hybrid-search.ts`
**Location:** `bySource.get(src)!.push(r)` (score normalization loop)
**Issue:** `!` assertion present without comment explaining why it is safe.
**Fix:** Added inline comment: `// non-null safe: has() guard above guarantees entry exists`

### P1-3 FIXED — Non-null assertion in `hybridSearchEnhanced()` lacks justification comment
**File:** `hybrid-search.ts`
**Location:** `sourceMap.get(r.id)!.add(list.source)` (T008 metrics tracking loop)
**Issue:** Same pattern as P1-2 — `has()` guard precedes the `!` but comment was absent.
**Fix:** Added identical inline justification comment.

---

## P2 Observations (noted only)

### P2-1 — `adaptive-fusion.ts` L316: Incomplete `FusionWeights` on flag-off return path
The early-return when feature flag is OFF returns
`{ semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 }` — omitting the now-defined
optional fields `graphWeight` and `graphCausalBias`. TypeScript accepts this because the fields
are `?` optional, but callers reading `adaptiveResult.weights.graphWeight` on this path receive
`undefined` rather than the profile default. Consider filling with `DEFAULT_WEIGHTS` values.

### P2-2 — `hybrid-search.vitest.ts`: `@ts-nocheck` suppresses all type errors
The `@ts-nocheck` directive at L1 was likely added to avoid mock type friction, but it blanket-
disables type checking across the entire test file, including the new C138 test suites. The new
suites (L510-606) use no `any`-dependent patterns that require it. Consider scoping type
suppressions to `@ts-expect-error` on individual mock function signatures instead.

### P2-3 — `hybridSearchEnhanced()`: `import type` could be used for `SpreadResult`
**File:** `hybrid-search.ts` L11
`import type { SpreadResult }` is already used correctly. No action needed — noting as
confirmation of existing compliance.
