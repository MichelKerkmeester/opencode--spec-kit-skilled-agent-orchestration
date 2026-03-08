# Audit H-16: mcp_server/tests/*.vitest.ts (A-H)

**Scope:** 108 total files, 18 sampled
**Sampling strategy:** Stratified alphabetical spread — ~3 files from A, ~2 from B, ~2 from C, ~1 each from D/E, ~2 from E/F, ~2 from G, ~3 from H. Selected to cover different domains (search, handlers, eval, storage, graph, extraction) and different test authors/styles.

## Sampled File Results

| # | File | Header | Naming | Mocks | `any` Leaks | Structure | Issues |
|---|------|--------|--------|-------|-------------|-----------|--------|
| 1 | ablation-framework | MODULE (3-line) | Clear, descriptive IDs (R13-S3) | Proper beforeEach/afterEach env save/restore | 0 — all typed (AblationChannel, AblationConfig, etc.) | 3 top-level describes, 2 levels max | None |
| 2 | anchor-prefix-matching | `@ts-nocheck` + TEST header | Clear P01-P22/I01-I06 IDs | No mocks needed (pure logic) | 0 | 2-level nesting, clean | `@ts-nocheck` at line 1 |
| 3 | api-key-validation | TEST header (3-line) | Clear T087-T090 IDs | Proper beforeEach/afterEach env reset | 0 | Flat, clean | None |
| 4 | bm25-index | `@ts-nocheck` + TEST header | Clear T031-T039 IDs | beforeEach per sub-describe | `any`: `let index: any` (lines 192, 269, 314); `hybridSearch: any` (line 19) | 2-level nesting | 4x `any` typed variables; `@ts-nocheck` |
| 5 | batch-processor | `@ts-nocheck` + TEST header | Clear T01-T32 IDs | Global afterEach restoreAllMocks | `any`: T10 `(x: any) => x`, T14 `(x: any) => x`, T28 `(x: any) => x`; `unknown` casts (lines 172, 248, 333) | 2-level nesting | 3x `any` in lambdas; `@ts-nocheck` |
| 6 | causal-boost | TEST header (3-line) | Clear T038-T044 IDs | Proper beforeEach/afterEach env + db | 0 — uses `RankedSearchResult` type + `unknown` cast | 2-level, flat | None |
| 7 | checkpoint-working-memory | `@ts-nocheck` + TEST header | Clear T213-01 thru T213-09 | beforeAll/afterAll with DB and cleanup | `any`: `mod: any`, `testDb: any` (lines 15-16), `(e: any)` casts (lines 126, 155) | 2-level nesting | 4x `any`; `@ts-nocheck` |
| 8 | content-hash-dedup | `@ts-nocheck` + MODULE header | Clear T054-1 thru T054-12 | beforeAll/afterAll DB lifecycle | 0 — properly typed with `Database.Database` | 2-level nesting | `@ts-nocheck` (but types look clean) |
| 9 | crash-recovery | TEST header (3-line) | Clear T009-T016, T071-T075 | None needed | 0 | 2-level nesting | **All tests are stubs** — `expect(true).toBe(true)` throughout (31 tests) |
| 10 | decay | MODULE header (3-line) | Clear T020-1 thru T020-6 | No mocks; `withFlag()` helper | 0 — all typed | 1-level (flat top-level describes) | None |
| 11 | edge-density | `@ts-nocheck` + MODULE header | Clear D1-D7 IDs | Proper beforeEach/afterEach DB | `any`: `createTestDb(): any`, `db: any`, `insertEdges(db: any, ...)`, `insertMemories(db: any, ...)` (lines 22, 61, 71, 85) | 2-level nesting | 4x `any`; `@ts-nocheck` |
| 12 | entity-extractor | TEST header (6-line, extended) | Clear section numbering (1-8) | Proper beforeEach DB | 0 — uses `ExtractedEntity` type, `Database.Database` | 2-level nesting | None |
| 13 | evidence-gap-detector | TEST header (4-line) | Clear T1-T12 IDs | No mocks needed (pure logic) | 0 | Flat describe | None |
| 14 | folder-discovery | MODULE header (3-line) | Clear T009 prefix per section | Proper beforeEach/afterEach with tmpDir cleanup | 0 — uses `DescriptionCache`, `PerFolderDescription` types | 2-level nesting | None |
| 15 | graph-signals | TEST header (3-line) | Clear section numbering (1-9) | Proper beforeEach/afterEach DB + cache clear | 0 — uses `Database.Database` | 2-level nesting | None |
| 16 | handler-memory-search | `@ts-nocheck` (justified in comment) + TEST header | Clear T516-1 thru T516-8, T002-1 thru T002-7 | No mocks; uses real imports | `unknown` casts (intentional, noted in `@ts-nocheck` comment) | 2-level nesting | `@ts-nocheck` (justified for invalid-arg validation tests) |
| 17 | handler-helpers | `@ts-nocheck` + TEST header (duplicate header block) | Clear suite-based naming | vi.mock for config, vi.spyOn for DB | `any`: `memorySave: any`, `memoryContext: any`, `causalEdges: any`, `BetterSqlite3: any`, `createTestDb(): any`, `seedTestMemories(db: any)`, `(m as unknown)` casts | 2-level nesting | 7+ `any` vars; `@ts-nocheck`; many `if (!module) return` guards instead of `.skip` |
| 18 | hybrid-search | `@ts-nocheck` (justified) + TEST header | Clear T031-* hierarchical IDs | Proper beforeEach/beforeAll with init | `Record<string, unknown>` used extensively; some `any` in casts (lines 679, 767) | 2-level nesting | 2x `any` casts; `@ts-nocheck`; env var save/restore pattern repeated across describes |

## Common Patterns

### Positive Patterns (consistently applied)
1. **3-line MODULE/TEST header** — Present in all 18 files. Format is consistent: `// ---...`, `// MODULE: Test — Name` or `// TEST: NAME`, `// ---...`.
2. **describe/it naming** — Universally clear and descriptive. Test IDs (T031, T054, P01, etc.) enable traceability to requirements.
3. **Specific matchers** — `toBe`, `toEqual`, `toBeCloseTo`, `toContain`, `toHaveLength`, `toBeUndefined`, `toBeNull` used throughout. No `toBeTruthy`-only assertions.
4. **Nesting depth** — Maximum 2 levels of describe nesting. No deeply nested (>3) structures found.
5. **Environment variable hygiene** — Save/restore pattern consistently applied in `beforeEach`/`afterEach` for `process.env.*` variables.
6. **DB lifecycle** — In-memory SQLite databases properly created in `beforeEach`/`beforeAll` and closed in `afterEach`/`afterAll`.

### Issues Found

| Issue | Severity | Count | Files Affected |
|-------|----------|-------|----------------|
| `@ts-nocheck` blanket suppression | P1 | 9/18 (50%) | anchor-prefix-matching, bm25-index, batch-processor, checkpoint-working-memory, content-hash-dedup, edge-density, handler-memory-search, handler-helpers, hybrid-search |
| `any` typed variables/parameters | P1 | 6/18 (33%) | bm25-index (4), batch-processor (3), checkpoint-working-memory (4), edge-density (4), handler-helpers (7+), hybrid-search (2) |
| Stub tests (`expect(true).toBe(true)`) | P0 | 1/18 (6%) | crash-recovery (31 stub tests) |
| `if (!module) return` guards instead of `it.skip` | P2 | 1/18 (6%) | handler-helpers (~30 tests use early-return guards) |
| Env var save/restore duplication | P2 | 2/18 (11%) | hybrid-search (repeated across 3+ describes), handler-helpers |

### Detail: `@ts-nocheck` Analysis

Of the 9 files with `@ts-nocheck`:
- **2 justified** — `handler-memory-search` (intentional invalid-arg testing, documented), `hybrid-search` (mock DB shapes incompatible with full types, documented)
- **7 unjustified** — The remaining files use `@ts-nocheck` as a convenience to avoid typing test helpers and variables. These could be fixed by properly typing the variables (e.g., `let index: BM25Index` instead of `let index: any`).

### Detail: Stub Tests (crash-recovery.vitest.ts)

This file contains 31 test cases, **all of which are `expect(true).toBe(true)` stubs**. The file header says `[deferred - requires DB test fixtures]` but it has been in this state with no actual assertions. These tests provide zero coverage and inflate test counts.

## Summary

- **Files in scope:** 108
- **Files sampled:** 18
- **Sample coverage:** 16.7%
- **Issue density estimate:** 1.6 issues per file (extrapolated from 29 issues across 18 files)
- **Top concerns:**
  1. **`@ts-nocheck` prevalence (50%)** — Half of sampled files suppress all TypeScript checking. Most are unjustified convenience uses. This masks potential type errors in test code and allows `any` to proliferate.
  2. **`any` type leaks (33%)** — 6 of 18 files use `any` for DB handles, module imports, or test helpers. Total ~24 `any` occurrences across sampled files. Extrapolated: ~140 `any` leaks across all 108 A-H files.
  3. **Stub tests in crash-recovery (P0)** — 31 tests that assert nothing. Should be either implemented or removed/marked `.todo`.
  4. **Early-return guards vs `.skip`** — handler-helpers uses `if (!module) return` in ~30 tests. This silently passes tests when modules fail to import, hiding real failures. Should use `it.skipIf()` or `describe.skipIf()`.
  5. **Env var save/restore duplication** — Multiple describes in the same file independently save/restore the same env vars. Could be consolidated with a shared `beforeEach`/`afterEach` at the top level.
