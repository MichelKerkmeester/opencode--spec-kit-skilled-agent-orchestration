# C10 Type Safety Audit

Scope: `.opencode/skill/system-spec-kit/`
Audit date: 2026-03-21
Auditor: C10 Type Safety

## Baseline

- `cd .opencode/skill/system-spec-kit && npx tsc --noEmit 2>&1`
  Result: clean exit, 0 compiler errors under `strict: true`.
- Explicit `: any` search:
  Result: 91 owned hits in test files, 0 production code hits. The 3 non-test matches were comment text in `mcp_server/lib/telemetry/scoring-observability.ts`, not type annotations.
- Unsafe cast search (`as any|as unknown`):
  Result: 66 production hits, 283 test hits.
- Non-null assertion search (`!\.`):
  Result: 26 production hits, 625 test hits.
- Exported functions missing explicit return types:
  Result: none found via TypeScript AST scan.
- Functions with implicit `any` parameters:
  Result: none found via TypeScript AST scan.
- `@ts-ignore` / `@ts-expect-error` search:
  Result: 63 owned suppressions. Most are clearly justified invalid-input/runtime-guard tests; two infrastructure suppressions stand out as questionable.

## Categorization Notes

- Intentional / acceptable boundary narrowing:
  `JSON.parse(... ) as unknown` followed by structural guards in files such as `mcp_server/hooks/response-hints.ts`, `mcp_server/handlers/save/dedup.ts`, `scripts/lib/cli-capture-shared.ts`, and `scripts/extractors/codex-cli-capture.ts`.
- Intentional / acceptable non-null assertions:
  Guarded map lookups and database access patterns with preceding `has()`/`assertDb()`/early-return checks in files such as `shared/scoring/folder-scoring.ts`, `mcp_server/lib/storage/index-refresh.ts`, and `mcp_server/lib/search/hybrid-search.ts`.
- Accidental / risky escape hatches:
  Central generic casts in tool dispatch, mass schema-registry double-casts, search-pipeline response coercions, and broad `any` usage in large regression tests.

### C10-001: Tool Dispatch Relies On A Blind Generic Cast
Severity: Medium
Category: Unsafe Generic Cast
Location: `mcp_server/tools/types.ts:19`
Description:
- `parseArgs<T>()` claims arbitrary handler argument types without proving that the validated schema output actually matches `T`.
- The fallback branch synthesizes an impossible value with `return {} as T`, which means the type system accepts missing required fields whenever this helper is called outside the ideal path.
- This helper is the central boundary for virtually every MCP tool dispatch.
Evidence:
- `parseArgs<T>(args: Record<string, unknown>): T`
- `return {} as T;`
- `return args as unknown as T;`
- Representative callsites: `mcp_server/tools/memory-tools.ts:46-74`, `mcp_server/tools/lifecycle-tools.ts:51-63`, `mcp_server/tools/checkpoint-tools.ts:31-34`
- Tests explicitly codify the cast-based behavior in `mcp_server/tests/context-server.vitest.ts:75-97`
Impact:
- Schema/handler drift is not compiler-detectable at the dispatch boundary.
- A handler can compile against required properties that the runtime validator no longer guarantees.
- Future refactors can silently widen unsoundness across every MCP tool.
Recommended Fix:
- Replace `parseArgs<T>` with schema-derived typing, for example a helper that returns `z.output<typeof schema>` instead of caller-supplied `T`.
- Remove the `{}` fallback and throw on invalid/non-object input at the boundary.
- Make tool dispatch tables bind each handler directly to its schema so the schema output type becomes the handler input type.

### C10-002: Schema Registry Uses 33 Double-Casts That Bypass Zod-Type Compatibility
Severity: Medium
Category: Unsafe Cast
Location: `mcp_server/schemas/tool-input-schemas.ts:386`
Description:
- `TOOL_SCHEMAS` is declared as `Record<string, ToolInputSchema>`, but almost every entry is forced into that type with `as unknown as ToolInputSchema`.
- This suppresses compile-time checking between the real Zod object/union/preprocess output and the declared registry contract.
- The pattern appears 33 times in the registry.
Evidence:
- `type ToolInputSchema = ZodType<ToolInput>;`
- `memory_context: memoryContextSchema as unknown as ToolInputSchema,`
- `shared_space_upsert: getSchema({...}).superRefine(...) as unknown as ToolInputSchema,`
- Count: `tool_schema_cast_count=33`
Impact:
- Registry/schema incompatibilities are hidden instead of resolved.
- Changes to preprocessors, unions, or refined schemas can break the assumed tool-input contract without surfacing at compile time.
- This compounds the unsoundness introduced by `parseArgs<T>()`.
Recommended Fix:
- Introduce a typed `asToolSchema()` helper that preserves `z.output` while constraining keys, or define `TOOL_SCHEMAS` with `satisfies` instead of double-casting.
- Prefer a mapped type keyed by tool name so each registry entry keeps its concrete schema type.
- If a true abstraction gap exists, document it once in a helper instead of repeating `as unknown as` per entry.

### C10-003: Memory Search Response Path Contains Multiple Cross-Layer Type Coercions
Severity: Medium
Category: Unsafe Cast
Location: `mcp_server/handlers/memory-search.ts:964`
Description:
- The memory-search handler coerces pipeline configuration, pipeline results, and response envelopes through multiple `as unknown as` conversions.
- These casts bridge several subsystems: pipeline execution, eval payload generation, result formatting, and session-dedup response parsing.
- The casts are clustered inside one of the highest-complexity request paths in the codebase.
Evidence:
- `artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],`
- `pipelineResult.results as unknown as Array<Record<string, unknown>>`
- `pipelineResult.results as unknown as RawSearchResult[]`
- `resultsData = responseToReturn as unknown as Record<string, unknown>;`
- Count in this file: `memory_search_cross_cast_count=4`
Impact:
- Pipeline shape regressions can compile cleanly while failing later in formatting, telemetry, or dedup logic.
- Refactors of `PipelineResult` or `RawSearchResult` are less likely to trigger compiler feedback in the places that consume them most heavily.
- This raises regression risk in the core retrieval path even though `tsc` is currently green.
Recommended Fix:
- Give `formatSearchResults`, `buildEvalChannelPayloads`, and response-envelope helpers concrete typed inputs instead of `Record<string, unknown>`.
- Normalize pipeline result shapes once at the stage boundary, then pass typed values downstream.
- Replace ad hoc envelope casts with a dedicated parsed-envelope type guard.

### C10-004: `memory-crud-extended` Test Harness Uses `any` So Broadly That Drift Can Hide In A Critical Regression Suite
Severity: Medium
Category: Accidental `any`
Location: `mcp_server/tests/memory-crud-extended.vitest.ts:11`
Description:
- This single regression file uses blanket `any` across imported modules, mocked functions, helper return values, and shared state.
- The pattern goes far beyond targeted invalid-input testing; it effectively disables type checking for a large handler test surface.
- This is the most significant accidental `any` concentration found in the owned codebase.
Evidence:
- `const actual = await importOriginal() as any;`
- `deleteMemory: vi.fn((...args: any[]) => actual.deleteMemory?.(...args)),`
- `let handler: any = null;`
- `function parseResponse(result: any): any {`
- Count in this file: `memory_crud_extended_any_hits=83`
Impact:
- Interface drift between handlers and mocked collaborators can slip through tests unnoticed.
- Refactors can break the real contract while the test suite continues compiling because mocks are untyped.
- This weakens confidence in a file meant to provide broad CRUD regression coverage.
Recommended Fix:
- Replace module-wide `any` state with typed module aliases using `typeof import(...)`.
- Type mock factories with the exported function signatures they replace.
- Give `parseResponse` and helper structures explicit envelope/result types instead of `any`.

### C10-005: Two Test Files Use Type Suppressions To Paper Over Module-System Mismatch
Severity: Low
Category: `@ts-ignore` / `@ts-expect-error`
Location: `mcp_server/tests/continue-session.vitest.ts:9`
Description:
- Most suppression comments in this codebase are clearly labeled runtime-guard tests and are justified.
- Two infrastructure-oriented suppressions stand out because they hide a test/runtime configuration mismatch rather than intentionally invalid business input.
- Those suppressions are in `continue-session.vitest.ts` and `bm25-index.vitest.ts`.
Evidence:
- `mcp_server/tests/continue-session.vitest.ts:9`:
  `// @ts-ignore -- vitest runs as ESM; tsc sees CommonJS from tsconfig`
- `mcp_server/tests/bm25-index.vitest.ts:21`:
  `// @ts-expect-error top-level await in test file`
- By contrast, the nearby suppressions at `bm25-index.vitest.ts:117` and `:124` are justified invalid-input coverage.
Impact:
- Real module-format or test-runner config drift is hidden instead of fixed.
- Future ESM/CommonJS changes can accumulate more suppressions rather than improving test typing.
- These suppressions also make the test environment harder to reason about for new contributors.
Recommended Fix:
- Use a test-specific tsconfig / module target aligned with Vitest ESM behavior.
- Replace top-level-await suppression with an async setup helper or `beforeAll` import pattern that matches the configured module system.
- Keep suppression comments only for deliberate invalid-input coverage, not environment mismatches.

## No-Finding Checks

- Exported functions missing explicit return types: none found.
- Implicit `any` parameters: none found.
- Dangerous production non-null assertions: none clearly unsafe after spot-auditing the 26 production hits. Representative assertions in `shared/scoring/folder-scoring.ts`, `shared/parsing/spec-doc-health.ts`, `mcp_server/lib/storage/index-refresh.ts`, `mcp_server/lib/search/hybrid-search.ts`, and `mcp_server/lib/manage/pagerank.ts` are all preceded by guards or invariant-establishing branches.

## Overall Assessment

TypeScript strictness is materially helping this codebase: the project type-checks cleanly, exported APIs are consistently annotated, and no implicit-`any` parameter leakage was found. The remaining risk is not “missing strict mode”; it is concentrated in a few deliberate escape hatches:

- one central unsound generic cast at tool dispatch,
- one mass schema-registry double-cast,
- one heavily-cast search response path,
- and a small set of overly-loose tests.

Those are good remediation targets because they reduce real type-safety risk without requiring a broad rewrite.
