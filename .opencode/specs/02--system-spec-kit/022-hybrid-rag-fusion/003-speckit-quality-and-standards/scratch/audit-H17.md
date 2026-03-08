# Audit H-17: mcp_server/tests/*.vitest.ts (I-R)

**Scope:** 81 total files, 18 sampled
**Sampling strategy:** Spread across full I-R alphabet range: 3 from I (importance-tiers, integration-checkpoint-lifecycle, intent-classifier), 1 from J (job-queue), 1 from L (lazy-loading), 4 from M (memory-context, memory-parser, mmr-reranker, mutation-ledger), 2 from P (pagerank, pipeline-v2), 2 from Q (query-expander, quality-loop), 5 from R (redaction-gate, retrieval-trace, retry-manager, rsf-fusion, reconsolidation). Selection balanced unit-test-style files, integration-style files, and algorithm-focused files.

## Sampled File Results

| File | Header | Naming | Mocks | `any` Leaks | Structure | Issues |
|------|--------|--------|-------|-------------|-----------|--------|
| importance-tiers.vitest.ts | TEST (not MODULE) | Good (T504-xx IDs) | None needed | None | 2 levels, clean | `@ts-nocheck` |
| integration-checkpoint-lifecycle.vitest.ts | TEST (not MODULE) | Good (T529-xx IDs) | None | `error: unknown` then `.message` without narrowing | 2 levels | `@ts-nocheck`; unsafe `error.message` access on `unknown` |
| intent-classifier.vitest.ts | TEST (not MODULE) | Good (T036-T060, C138 IDs) | None needed | `as string`, `as never` casts; `p: unknown` | 2 levels, clean | `@ts-nocheck`; several type casts |
| job-queue.vitest.ts | TEST (not MODULE) | Good, descriptive | Proper: `vi.resetModules()`/`vi.restoreAllMocks()` in afterEach | `Database.Database` typed; `as { state: string; ... }` casts | 2 levels | No `@ts-nocheck` BUT uses `as` casts on DB rows |
| lazy-loading.vitest.ts | TEST (not MODULE) | Good (T016-T019 IDs) | `vi.resetModules()` in helper; `beforeEach`/`afterEach` env cleanup | None | 2 levels, clean | No `@ts-nocheck`; clean file |
| memory-context.vitest.ts | TEST (not MODULE) | Good (T001-T210 IDs) | None needed | Explicit local interfaces (`ContextMode`, `ContextResult`); `as` casts on entries | 2 levels | `@ts-nocheck`; T029/T105 tautological tests (`expect(x).toBe(x)`); T037/T075 trivial `expect(true).toBe(true)` |
| memory-parser.vitest.ts | MODULE header | Good (T500-xx IDs) | `beforeAll`/`afterAll` for temp dir | None | 2 levels | Clean; uses MODULE header correctly |
| mmr-reranker.vitest.ts | TEST (not MODULE) | Good (T1-T11) | None needed | None | 2 levels, clean | Clean, well-structured |
| mutation-ledger.vitest.ts | TESTS (not MODULE) | Good, descriptive | `beforeEach` creates fresh in-memory DB | `as Array<{ name: string }>` and similar row casts | 1 level + sections | Clean mock hygiene; type casts on DB rows acceptable |
| pagerank.vitest.ts | TEST (not MODULE) | Good (T1-T10) | None needed | None | 2 levels, clean | Clean, well-structured |
| pipeline-v2.vitest.ts | TEST (not MODULE) | Good (R6-Txx IDs) | `beforeEach`/`afterEach` for env | None (uses proper type imports) | 3 levels in places | Clean; deepest nesting is 3 (acceptable) |
| query-expander.vitest.ts | TEST (not MODULE) | Good (T1-T11) | None needed | None | 2 levels, clean | Clean, well-structured |
| redaction-gate.vitest.ts | TEST (not MODULE) | Good, descriptive | None needed | None | 2 levels | Clean, concise |
| retrieval-trace.vitest.ts | TEST (not MODULE) | Good, descriptive | None needed | `as any` on `sanitized` (1 instance) | 2 levels, numbered sections | One `as any` cast on sanitized payload |
| retry-manager.vitest.ts | TEST (not MODULE) | Good (T01-T55 IDs) | `beforeEach` clears DB/stops job; `afterAll` cleanup | `db: any`; `(r: any)` in map callbacks (6+ instances); `(memory: any)` | 4 levels (deep) | `@ts-nocheck`; significant `any` usage (~10 instances); 4-level nesting |
| rsf-fusion.vitest.ts | MODULE header | Good (T023.x.y IDs) | None needed | None | 3 levels (describe.describe.it) | Clean; uses MODULE header correctly |
| reconsolidation.vitest.ts | TEST (not MODULE) | Good (RF/CT/AD/FS/MC/MP/CP/CMP/RO/EC IDs) | `beforeAll`/`afterAll` DB; `beforeEach` table cleanup; `afterEach` env restore | `testDb: any`; `capturedOptions: any`; `capturedMemory: any` | 3 levels | `@ts-nocheck`; ~5 `any` usages |
| quality-loop.vitest.ts | MODULE header | Good, descriptive | `beforeEach`/`afterEach` env save/restore | None | 2 levels | `@ts-nocheck`; uses MODULE header correctly |

## Common Patterns

### Positive Patterns
1. **Strong test naming**: All 18 files use clear, descriptive `describe`/`it` block names, often with task/test IDs (T504-xx, T036-xx, R6-Txx, etc.)
2. **Specific matchers**: Consistent use of `toBe()`, `toEqual()`, `toBeCloseTo()`, `toContain()`, `toHaveLength()`, `toBeGreaterThan()`, etc. No `toBeTruthy()` overuse. Files appropriately use domain-specific assertions.
3. **Good mock hygiene**: Files that use mocks consistently scope them with `beforeEach`/`afterEach` and properly clean up (e.g., `vi.restoreAllMocks()`, `vi.resetModules()`, env variable restoration).
4. **Well-organized structure**: Most files stay at 2 levels of nesting. Only 2 files reach 3 levels (pipeline-v2, rsf-fusion), and only 1 file reaches 4 levels (retry-manager).
5. **Typed helper functions**: Most files define well-typed helper/fixture functions for test data construction.

### Issues Found
1. **Header inconsistency**: Only 3 of 18 files use `MODULE` header (memory-parser, rsf-fusion, quality-loop). The remaining 15 use `TEST` or `TESTS` in the header comment block. The audit criteria specify "MODULE header (3-line block)."
2. **`@ts-nocheck` prevalence**: 9 of 18 files (50%) use `@ts-nocheck`, which suppresses all type checking and can mask `any` leaks. Files: importance-tiers, integration-checkpoint-lifecycle, intent-classifier, memory-context, retry-manager, reconsolidation, quality-loop.
3. **`any` type usage**: 4 files have notable `any` usage:
   - **retry-manager**: ~10 instances of `any` (`db: any`, `(r: any)`, `(memory: any)`)
   - **reconsolidation**: ~5 instances (`testDb: any`, `capturedOptions: any`)
   - **retrieval-trace**: 1 instance (`as any` on sanitized payload)
   - **integration-checkpoint-lifecycle**: Unsafe `error.message` access on `unknown` type
4. **Tautological/vacuous tests**: memory-context has 3 tests that assert nothing meaningful:
   - T029: `expect(handleMemoryContext).toBe(handleMemoryContext)` -- always true
   - T105: `expect(handleMemoryContext).toBe(handleMemoryContext)` -- duplicate of T029
   - T037: `expect(true).toBe(true)` -- no-op
   - T075: `expect(true).toBe(true)` -- no-op
5. **4-level nesting**: retry-manager nests 4 levels deep (describe > describe > describe > it), exceeding the 3-level guideline.
6. **Row type casting**: job-queue, mutation-ledger, and retry-manager use `as { ... }` casts on SQLite query results. This is a pragmatic pattern for `better-sqlite3` but technically introduces unverified type assumptions.

## Summary
- Files in scope: 81
- Files sampled: 18
- Issue density estimate: ~1.7 issues per file (31 issues across 18 files, extrapolated to ~137 across 81)
- Top concerns:
  1. **Header format inconsistency** (83% use TEST instead of MODULE) -- low severity if TEST is an accepted variant, high if MODULE is mandatory
  2. **`@ts-nocheck` prevalence** (50% of sampled files) -- masks type safety issues
  3. **`any` leaks in DB-dependent tests** (retry-manager, reconsolidation) -- limited to integration-style tests needing DB fixtures
  4. **Tautological tests** in memory-context (4 no-op assertions) -- low value tests inflate count
  5. **4-level nesting** in retry-manager -- single violation, localized
