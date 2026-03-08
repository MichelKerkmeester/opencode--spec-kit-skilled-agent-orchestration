# Audit H-18: mcp_server/tests/*.vitest.ts (S-Z) + scripts/tests/

**Scope:** 60 total files (54 mcp_server S-Z + 6 scripts/tests), 18 sampled
**Date:** 2026-03-08

## Sampled File Results

| File | Header | Naming | Mocks | `any` Leaks | Structure | Issues |
|------|--------|--------|-------|-------------|-----------|--------|
| safety.vitest.ts | PASS (3-line TEST header) | PASS — clear T105/T106 IDs with descriptive text | PASS — no mocks, uses real DB | WARN — `@ts-nocheck` at top; `identity` typed as `(x: any) => x`; `createTestDb(): any` return type | PASS — 2 levels | 2: `@ts-nocheck`, `any` in helper signatures |
| scoring.vitest.ts | PASS (3-line TEST header + JSDoc block) | PASS — T505-01..T505-08 with descriptive names | PASS — no mocks needed | PASS — no `any` usage | PASS — flat describe blocks, clean | 0 |
| search-fallback-tiered.vitest.ts | PASS (3-line MODULE header) | PASS — T045-01..T045-19 with clear labels | PASS — env var backup/restore in beforeEach/afterEach, DB in beforeEach/afterEach per describe | PASS — no `any` | PASS — 2 levels max, well-organized numbered sections | 0 |
| session-manager.vitest.ts | PASS (3-line TEST header) | PASS — T001..T008 with descriptive test names | WARN — uses `beforeAll`/`afterAll` for DB lifecycle; `beforeEach` for `resetDb()` | WARN — `@ts-nocheck` at top; line 49 `testDb` typed with `\| null`; line 114 cast `as unknown as Record<string, unknown>` with TODO(P6-05) | PASS — 2 levels, clean nesting | 2: `@ts-nocheck`; intentional casts noted with TODO |
| trigger-matcher.vitest.ts | PASS (multi-line header block) | PASS — T501-01..T501-12, descriptive | PASS — `vi.mock` at top-level for transitive DB dep; `beforeEach` clears cache | WARN — line 96 `null as unknown as TriggerPrompt`, line 128 `null as unknown as UnicodeInput` — intentional null-safety tests | PASS — 2 levels, well-structured sections | 1: intentional `unknown` casts for null-safety edge cases (acceptable) |
| unit-rrf-fusion.vitest.ts | PASS (3-line TEST header) | PASS — T001..T006, C138-T1..CV6, clear | PASS — no mocks | PASS — uses typed `FusionResult`, no `any` | PASS — 3 top-level describes, 2 levels max | 0 |
| working-memory.vitest.ts | PASS (3-line TEST header) | PASS — descriptive names for config, utils, calculateTier, exports | PASS — no mocks | WARN — line 9 `workingMemoryModule = workingMemory as unknown as Record<string, unknown>` for export iteration; line 124 `null as unknown as WorkingMemoryDb` | PASS — 2 levels | 1: `unknown` cast for dynamic export checking (acceptable pattern) |
| unit-path-security.vitest.ts | PASS (multi-line header block) | PASS — T001..T007 descriptive | PASS — cleanup in `finally` block for symlink test | WARN — `@ts-nocheck`; line 72 `e as { code?: unknown }` cast; lines 97-101 `null/undefined as unknown as string` for edge-case testing | PASS — single describe, flat | 2: `@ts-nocheck`; intentional edge-case casts |
| token-budget.vitest.ts | PASS (3-line MODULE header) | PASS — clear names per function being tested | PASS — `vi.spyOn(console, 'warn')` in beforeEach, `vi.restoreAllMocks()` in afterEach; env backup/restore | PASS — no `any`; well-typed helpers | PASS — 2 levels | 0 |
| slug-uniqueness.vitest.ts | PASS (3-line MODULE header) | PASS — descriptive collision-focused names | PASS — `beforeEach`/`afterEach` for tmpDir create/cleanup | PASS — no `any` | PASS — 1 level, flat | 0 |
| stdio-logging-safety.vitest.ts | FAIL — no MODULE/TEST header block | PASS — single descriptive test | PASS — no mocks needed | PASS — no `any` | PASS — single describe/it | 1: missing 3-line header |
| generate-context-cli-authority.vitest.ts | PASS (3-line TEST header) | PASS — 3 clear test descriptions | PASS — `vi.hoisted` mocks with `vi.mock`; `beforeEach` resets modules and clears; `afterEach` restores argv | PASS — no `any` | PASS — 2 levels | 0 |
| save-quality-gate.vitest.ts | PASS (3-line TEST header) | PASS — FF1..FF5, WO1..WO7, L1-1..L1-9, TQ1..TQ8, etc. | PASS — `beforeEach`/`afterEach` for env and activation timestamp; `vi.spyOn` properly restored | WARN — `@ts-nocheck`; line 93 `(_embedding: any, _options: any)` in `mockFindSimilar`; line 213 `as any` in spy mock | PASS — 3 levels (describe > describe > it) — at limit but acceptable | 2: `@ts-nocheck`; `any` in mock helper |
| unit-fsrs-formula.vitest.ts | PASS (3-line TEST header) | PASS — T001..T007 with clear FSRS context | PASS — no mocks | PASS — no `any` | PASS — single describe, flat | 0 |
| validation-metadata.vitest.ts | PASS (multi-line header with coverage areas) | PASS — T1..T22 with clear signal names | PASS — no mocks; uses `__testables` import for integration | PASS — no `any` | PASS — many describes but all at 2 levels | 0 |
| structure-aware-chunker.vitest.ts | PASS (3-line TEST header) | PASS — T1..T9 with clear descriptions | PASS — no mocks | PASS — typed `Chunk` throughout | PASS — single describe, 1 level | 0 |
| progressive-validation.vitest.ts | PASS (multi-line TEST header with coverage list) | PASS — T-PB2-01..T-PB2-15 with clear pipeline-level names | PASS — `afterEach` tmpDir cleanup per nested describe | WARN — `@ts-nocheck`; line 591 `parsed: any` in JSON parse assertions | 3 levels (describe > describe > it) — at limit but acceptable | 2: `@ts-nocheck`; `any` for parsed JSON |
| tree-thinning.vitest.ts | PASS (3-line TEST header) | PASS — T1..T10 with clear threshold-focused names | PASS — no mocks | PASS — fully typed `FileEntry`, `ThinningConfig` | PASS — 2 levels, clean | 0 |

## Common Patterns

### Positive Patterns (Consistent Strengths)
1. **Header compliance is high** — 17/18 files have proper 3-line MODULE/TEST headers. Only `stdio-logging-safety.vitest.ts` is missing one.
2. **Mock hygiene is excellent** — All files using mocks scope them properly in `beforeEach`/`afterEach`. Environment variable tests consistently backup/restore. No leaked mocks detected.
3. **Naming quality is uniformly strong** — All files use clear test IDs (T001, T505-01, C138-T1, etc.) paired with descriptive text. No vague names like "should work" found.
4. **Structure is well-controlled** — No file exceeds 3 levels of nesting. Most use 2 levels.
5. **Assertions are specific** — Heavy use of `toBe`, `toEqual`, `toBeCloseTo`, `toContain`, `toHaveLength`, `toBeGreaterThan`. No instances of bare `toBeTruthy()` as the sole assertion on a meaningful value (used only for presence checks where appropriate).
6. **Fixture management (scripts/tests)** is solid — `progressive-validation.vitest.ts` and `tree-thinning.vitest.ts` both use proper `createTempSpecDir`/cleanup patterns. `slug-uniqueness.vitest.ts` uses `mkdtempSync`/`rmSync` in hooks.

### Recurring Issues
1. **`@ts-nocheck` usage** — Found in 5/18 files: `safety`, `session-manager`, `unit-path-security`, `save-quality-gate`, `progressive-validation`. This disables all TypeScript checking for the entire file, which can mask real type issues beyond the intentional casts.
2. **`any` in mock helpers** — `save-quality-gate.vitest.ts` has `(_embedding: any, _options: any)` and `safety.vitest.ts` has `identity = async (x: any) => x`. These are minor but could use typed alternatives.
3. **`any` for JSON parse results** — `progressive-validation.vitest.ts` uses `parsed: any` for dynamically parsed JSON. This is a common pattern but could use a lightweight interface.
4. **Intentional `unknown` casts for null-safety tests** — Present in `trigger-matcher`, `working-memory`, `unit-path-security`, `session-manager`. These are acceptable patterns for testing null/undefined edge cases, typically annotated with comments or TODO markers.

### Non-Issues (Verified Clean)
- No deeply nested (>3 levels) describe blocks found
- No leaked mocks between tests
- No bare `toBeTruthy()` misuse on typed values
- No missing teardown for resources (DB, temp files, env vars)

## Summary
- Files in scope: 60
- Files sampled: 18
- Pass rate: 10/18 files are fully clean (no issues); 8/18 have minor issues
- Total issues found: 13 across 8 files
- Issue density estimate: ~0.72 issues per file (extrapolated to full 60: ~43 total issues)
- **Top concerns (ordered by impact):**
  1. `@ts-nocheck` blanket suppression (5 files) — Consider replacing with targeted `@ts-expect-error` on specific lines
  2. `any` in mock/helper signatures (3 files) — Low risk but could use parameterized types
  3. Missing header (1 file: `stdio-logging-safety.vitest.ts`) — Trivial fix
- **Overall quality assessment:** HIGH — The S-Z range and scripts/tests maintain consistent quality. Mock hygiene, naming, structure, and assertion specificity are all strong. The `@ts-nocheck` usage is the most systemic concern but appears to be a deliberate trade-off for files with many intentional type-boundary tests.
