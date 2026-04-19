# Iteration 2 - Hono + NestJS routes and Drizzle schema deep dive

## Summary
All three traced detectors are mixed rather than pure AST pipelines: each tries AST first, then falls back to regex when `loadTypeScript(project.root)` cannot borrow the target repo's `typescript` package or when the AST extractor returns no results. Hono and NestJS route detection are genuinely AST-backed in the source, with Hono walking `CallExpression`s for `.get/.post/...` plus `.use('/prefix', router)` prefix chaining, and NestJS walking decorator-bearing class and method nodes to combine `@Controller` and `@Get/@Post/...` paths. Drizzle schema detection is also AST-first and materially richer than its fallback because it walks chained field calls and `relations(...)`, but it does not implement index extraction in the inspected source. By precision and usefulness, NestJS is the strongest AST win, Hono is next, and Drizzle is useful but narrower because it stops at tables, fields, references, and relations.

## Files Read
- `external/src/detectors/routes.ts:205-248,396-442`
- `external/src/ast/extract-routes.ts:1-248`
- `external/src/ast/loader.ts:14-105`
- `external/src/detectors/schema.ts:18-147`
- `external/src/ast/extract-schema.ts:18-260`
- `external/src/detectors/contracts.ts:9-96`
- `external/src/types.ts:54-80`

## Findings

### Finding 1 - Hono is AST-first and the AST path captures prefixes, params, and middleware
- Source: `external/src/detectors/routes.ts:206-248`, `external/src/ast/extract-routes.ts:25-50,55-142`, `external/src/ast/loader.ts:14-61`
- What it does: `detectHonoRoutes()` filters TS/JS-like files, checks for `hono` markers, borrows the target repo's TypeScript compiler with `loadTypeScript(project.root)`, and calls `extractRoutesAST(...)` before any regex. The AST walker parses a `SourceFile`, visits every `CallExpression`, records `.use('/prefix', routerVar)` into a prefix map, detects `.get/.post/.put/...` calls with literal path arguments, joins the registered prefix to the receiver's route path, extracts path params from the final path, and records identifier middleware from later call arguments.
- Why it matters: This is a reusable pattern for Code_Environment/Public when route precision matters but shipping a bundled compiler is undesirable; it shows an AST path that adds structurally useful data beyond simple method/path pairs.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: AST analysis pipeline
- Risk/cost: medium - the AST path depends on being able to load the analyzed repo's `typescript`, and it only handles literal path strings.

### Finding 2 - Hono regex fallback is intentionally narrow, and downstream contract enrichment cannot recover lost route structure
- Source: `external/src/detectors/routes.ts:230-245`, `external/src/detectors/contracts.ts:9-68,70-96`, `external/src/types.ts:56-67`
- What it does: When TypeScript is unavailable or AST extraction yields no routes, Hono falls back to `/\\.(get|post|put|patch|delete|options|all)\\( ['\"\`]path/` matching and only emits routes whose literal path starts with `/` or `:`. That fallback sets `confidence: "regex"` but does not populate `params` or `middleware`; `enrichRouteContracts()` later re-reads each route file once, backfills params from `route.path`, and uses file-level regexes like `c.json<Type>(...)` and `zValidator(...)` to infer types, but it does not reconstruct `.use()` prefix chains or middleware that were missed upstream.
- Why it matters: Code_Environment/Public can safely consume degraded route results if confidence is surfaced clearly, but it should not assume later enrichment fixes structural omissions introduced by regex-only detection.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: contract enrichment pipeline
- Risk/cost: low - the behavior is predictable, but consumers must treat `regex` routes as lower-fidelity inputs.

### Finding 3 - NestJS detection truly walks decorators, and the regex fallback is much less precise
- Source: `external/src/detectors/routes.ts:396-442`, `external/src/ast/extract-routes.ts:157-248`, `external/src/ast/loader.ts:64-105`
- What it does: NestJS is not regex-only in practice: `extractNestJSRoutes()` visits `ClassDeclaration` nodes, uses `getDecorators()` to support both TS 4.x `node.decorators` and TS 5.x modifier-based decorators, parses `@Controller(...)` to get the controller prefix, then walks method decorators for `@Get/@Post/@Put/...`, joins controller and method paths, extracts `@Param(...)` names from method parameters, and collects `@UseGuards(...)` from class and method decorators into `middleware`. The fallback regex path only grabs one file-level `@Controller(...)` prefix and scans every HTTP decorator in the file, so it loses class-to-method association and only understands the first string decorator argument.
- Why it matters: This is the strongest source-backed example in Codesight of AST materially outperforming regex; if Code_Environment/Public wants framework-specific AST work, decorator-heavy frameworks are where the payoff is clearest.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: framework-specific route detector architecture
- Risk/cost: medium - the decorator parser is intentionally shallow and will miss non-string decorator arguments or richer metadata objects.

### Finding 4 - Drizzle is AST-backed for tables, field chains, and `relations()`, but indexes are not implemented
- Source: `external/src/detectors/schema.ts:48-147`, `external/src/ast/extract-schema.ts:18-29,49-129,132-194,196-260`, `external/src/types.ts:69-80`
- What it does: `detectDrizzleSchemas()` narrows to likely schema/db files, checks for `pgTable/mysqlTable/sqliteTable`, and then prefers `extractDrizzleSchemaAST(...)`. The AST path walks `CallExpression`s for those table constructors, accepts either an object literal or an arrow/function returning one for the field map, parses chained calls like `serial("id").primaryKey().notNull()` into `type` plus flags, extracts `.references(() => users.id)` targets, auto-adds `fk` by `*Id` naming, and separately walks `relations(table, () => ({ ... }))` for `one(...)` and `many(...)`; the regex fallback only handles exported `const x = pgTable("name", { ... })`-style literals plus simple field and relations regexes. No inspected AST or regex path handles Drizzle indexes.
- Why it matters: This is a promising schema summarizer for Code_Environment/Public, but it should be treated as a table/column/relation detector rather than a full schema model until index coverage exists.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: ORM/schema detector architecture
- Risk/cost: medium - missing indexes and approximate `relations()` model matching limit completeness for downstream graph or contract features.

## Detector Classification Table
| Detector | Path | AST-backed? | Regex fallback? | Notes |
|----------|------|-------------|-----------------|-------|
| Hono routes | `external/src/detectors/routes.ts:206-248` | partial | yes | Mixed path: AST captures `.use()` prefixes, params, and identifier middleware; regex only matches literal `.get/.post/...` calls. |
| NestJS routes | `external/src/detectors/routes.ts:396-442` | partial | yes | Mixed path: AST really walks `@Controller` and method decorators; regex is file-level and can lose controller-to-method association. |
| Drizzle schema | `external/src/detectors/schema.ts:48-147` | partial | yes | Mixed path: AST handles table calls, chained field modifiers, references, and `relations()`; no source-confirmed index extraction. |

## Answered Questions
- Q2: answered - `external/src/detectors/routes.ts:206-248` and `external/src/ast/extract-routes.ts:55-142` show the Hono detector end to end, including the AST walk and the exact regex fallback.
- Q3: answered - `external/src/detectors/routes.ts:396-442` and `external/src/ast/extract-routes.ts:157-248` confirm real NestJS decorator walking, not just regex scanning.
- Q4: partially answered - `external/src/detectors/schema.ts:48-147` and `external/src/ast/extract-schema.ts:49-260` prove Drizzle table/field/relation extraction, but the inspected source does not implement index extraction.

## Open Questions / Next Focus
- `external/src/detectors/blast-radius.ts` plus `external/src/detectors/graph.ts`: verify whether these route/schema outputs actually feed impact analysis, and whether low-confidence regex detections are treated differently.
- `external/src/mcp-server.ts`: confirm whether `confidence`, `params`, `middleware`, and schema relation details survive the MCP tool surface or get flattened away.
- `external/tests/detectors.test.ts` or `external/eval/fixtures/hono-monorepo/ground-truth.json`: validate whether the claimed AST advantages for Hono/NestJS/Drizzle are covered by tests or benchmark fixtures rather than being source-only.

## Cross-Phase Awareness
This iteration stayed inside phase `002-codesight` by tracing detector entry points, AST helpers, and one downstream consumer shape without comparing or redesigning Code_Environment/Public internals. It also avoided phase `003/004` overlap by stopping before blast-radius, MCP-tool UX, or benchmark synthesis and only naming those as next-step targets.

## Metrics
- newInfoRatio: 0.69
- findingsCount: 4
- focus: "iteration 2: Hono + NestJS routes + Drizzle schema"
- status: insight