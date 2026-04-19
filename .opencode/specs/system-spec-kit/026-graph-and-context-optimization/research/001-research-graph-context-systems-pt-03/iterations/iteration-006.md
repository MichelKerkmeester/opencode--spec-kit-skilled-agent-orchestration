# Iteration 6 — Contract enrichment pipeline

> Engine: cli-codex (gpt-5.4 high), sandbox=read-only. The codex agent ran the full source trace successfully. Its read-only sandbox blocked direct file writes to `/tmp`, but the formatted report was preserved inside the captured `-o` last-message file as a fenced markdown block. This iteration file is the same content reformatted from that capture without modification of the findings.

## Summary
`enrichRouteContracts(routes, project)` is a second-pass mutator that rereads each detected route file, extracts path params from the route string, and fills a few optional `RouteInfo` fields with framework-specific regex heuristics. It does **not** invoke the TypeScript checker, does not parse OpenAPI specs, and does not structurally reuse tRPC, Zod, Valibot, Joi, or Yup contracts beyond one Hono-style `zValidator(...)` symbol-name capture. Its output is best treated as opportunistic hints rather than authoritative API contracts.

## Files Read
- external/src/detectors/contracts.ts:1-152
- external/src/index.ts:75-175 (scan() pipeline + enrichRouteContracts call site)
- external/src/types.ts:54-65 (RouteInfo contract fields)
- external/src/ast/extract-routes.ts:1-50, 287-337 (contract-relevant lines)
- external/tests/detectors.test.ts:19-29, 37-234 (no contract tests found)

## Findings

### Finding 1 — Enrichment is a post-detection, in-place mutation pass
- Source: `external/src/index.ts:104-133`; `external/src/detectors/contracts.ts:9-67`
- What it does: `scan()` first collects `rawRoutes` from `detectRoutes(...)`, then immediately passes that array into `enrichRouteContracts(rawRoutes, project)`. Inside `enrichRouteContracts`, the function caches file contents per `route.file`, rereads each source file once via `readFileSafe`, extracts path params from `:id`, `[id]`, `{id}`, and `<id>` patterns, dispatches on `route.framework`, and returns the same `routes` array after mutating its objects in place.
- Why it matters for Code_Environment/Public: This pattern is lightweight and cheap enough for a scan pipeline, but it means the "contract" layer is downstream decoration on top of route detection, not a source-of-truth contract extractor. If we borrowed this shape for graph/context work, we should treat the added fields as nullable annotations, not stable evidence.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: route-contract synthesis
- Risk/cost: medium — cheap to run, but easy to over-trust because it mutates already-detected routes without marking enrichment quality separately.

### Finding 2 — TS/JS framework enrichment is regex-only and strongly Hono-biased
- Source: `external/src/detectors/contracts.ts:40-50`; `external/src/detectors/contracts.ts:70-96`; `external/src/types.ts:56-65`
- What it does: For `hono`, `express`, `fastify`, `koa`, `nestjs`, `elysia`, `adonis`, and `raw-http`, the code calls one shared helper, `enrichTSRoute(...)`. That helper only scans the whole file for three patterns: `c.json<T>(...)` to set `responseType`, `zValidator('json'|'form', Identifier)` to set `requestType`, and `Promise<Response<T>>` return annotations to set `responseType`. It does not use AST nodes, does not scope the match to the specific handler for the current route, and does not populate any new metadata besides `requestType` or `responseType`.
- Why it matters for Code_Environment/Public: This is useful as a low-cost hinting pass, but it is not TypeScript type inference. It will miss common Express/NestJS/Fastify patterns such as `res.json(...)`, DTO decorators, schema objects, or typed request bodies, and it can cross-contaminate multiple routes that share one file because the regexes search the whole file globally.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: TypeScript contract extraction
- Risk/cost: medium — broad framework labels suggest richer support than the regexes actually provide.

### Finding 3 — App-router and Python support is literal-shape or decorator heuristic only
- Source: `external/src/detectors/contracts.ts:52-63`; `external/src/detectors/contracts.ts:98-152`
- What it does: `next-app`, `sveltekit`, `remix`, and `nuxt` all use `enrichNextRoute(...)`, which inspects `NextResponse.json({...})` or `Response.json({...})`, extracts up to eight object-literal keys, and writes a synthetic response shape like `{ key1, key2 }`. `fastapi` uses `response_model=SchemaName` to set `responseType`, then looks for the first non-dependency typed handler parameter and copies only its type name into `requestType`; `flask` only extracts key names from `jsonify({...})` and never expands actual Python/Pydantic types.
- Why it matters for Code_Environment/Public: These helpers are not consuming OpenAPI, not expanding schema definitions, and not reconstructing full request/response structures. For research and context generation, they are closer to "shape sketches" than contracts, especially when real APIs depend on typed models, decorators, or generated specs.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: multi-framework contract enrichment
- Risk/cost: low — the heuristics are simple, but their output is necessarily shallow.

### Finding 4 — tRPC has AST route extraction but zero contract enrichment
- Source: `external/src/ast/extract-routes.ts:25-50`; `external/src/ast/extract-routes.ts:287-337`; `external/src/detectors/contracts.ts:40-64`
- What it does: The AST extractor explicitly supports `trpc` and emits `RouteInfo` entries for `query`, `mutation`, and `subscription` procedures with `confidence: "ast"`. The contract enrichment switch never handles `trpc`, though, so procedure chains such as `.input(z.object(...)).mutation(...)` contribute route discovery only; no `requestType`, `responseType`, or other contract fields are added afterward.
- Why it matters for Code_Environment/Public: For a graph/context system, this is the sharpest contract blind spot in the inspected path: one of the most contract-heavy frameworks is recognized for topology but ignored for payload semantics. If we care about RPC contract graphs, this approach is not enough on its own.
- Evidence type: mixed
- Recommendation: reject
- Affected area: RPC contract modeling
- Risk/cost: high — the framework with the richest inline contract vocabulary gets no enrichment at all.

### Finding 5 — Silent no-ops are common, and the enrichment pass appears untested
- Source: `external/src/detectors/contracts.ts:17-21`; `external/src/detectors/contracts.ts:40-64`; `external/src/detectors/contracts.ts:70-152`; `external/src/scanner.ts:89-94`; `external/tests/detectors.test.ts:19-29`; `external/tests/detectors.test.ts:37-234`
- What it does: If a route file cannot be read, `readFileSafe(...)` returns an empty string rather than surfacing an error, so every subsequent regex quietly fails and the route is returned unchanged. Even on readable files, unmatched patterns simply leave `requestType`, `responseType`, and `params` absent, frameworks outside the switch receive no enrichment, and the test file imports `detectRoutes`, `detectSchemas`, `detectComponents`, `detectDependencyGraph`, `detectMiddleware`, `detectConfig`, and `detectLibs` but not the contract detector. The route tests call `detectRoutes(...)` directly, and no contract-specific assertions appear in the inspected test file.
- Why it matters for Code_Environment/Public: This makes enrichment easy to ship, but hard to trust operationally because misses are silent and there is no line of evidence in the inspected tests that contract behavior is guarded. If we adapt the idea, we should add explicit "enriched vs not-enriched" telemetry or test fixtures before relying on it in context pipelines.
- Evidence type: mixed
- Recommendation: reject
- Affected area: enrichment reliability and verification
- Risk/cost: high — failure modes degrade silently into missing metadata, which is easy to misread as "no contract found."

## Contract Enrichment Coverage Table
| Framework | Contract source | AST/regex/none | Notes |
|-----------|----------------|----------------|-------|
| Hono | `c.json<T>(...)`, `zValidator('json'\|'form', Identifier)`, `Promise<Response<T>>` | regex | Shared TS helper; no handler-local scoping, no real TS inference. |
| NestJS | Same shared TS helper only | regex | No decorator/DTO introspection despite NestJS route AST support elsewhere. |
| Express | Same shared TS helper only | regex | Comment mentions `res.json`, but implementation only matches `c.json<T>` and `Promise<Response<T>>`. |
| Fastify | Same shared TS helper only | regex | No fastify schema introspection. |
| Koa | Same shared TS helper only | regex | No middleware-aware enrichment. |
| Elysia | Same shared TS helper only | regex | No `t.Object(...)` schema reading. |
| AdonisJS | Same shared TS helper only | regex | No validator class introspection. |
| tRPC | None in `enrichRouteContracts` | none | Routes are AST-detected, but `.input(...)` / output contracts are ignored after detection. |
| Next.js (app router) | `NextResponse.json({...})`, `Response.json({...})` | regex | Up to 8 literal keys; synthetic `{ k1, k2 }` shape. |
| SvelteKit | Same as next-app | regex | Shared `enrichNextRoute` helper. |
| Remix | Same as next-app | regex | Shared `enrichNextRoute` helper. |
| Nuxt | Same as next-app | regex | Shared `enrichNextRoute` helper. |
| FastAPI | `response_model=SchemaName`; first non-dependency typed handler param | regex | Captures simple symbol names only; no OpenAPI/Pydantic model expansion. |
| Flask | `jsonify({...})` literal key extraction | regex | No type expansion at all. |
| Django | Not in switch | none | No enrichment. |
| Gin/Echo/Fiber/Chi | Not in switch | none | No enrichment for any Go framework. |

## Open Questions / Next Focus
- Does `route.file` always isolate one handler, or do multi-route files cause cross-route contract leakage because the regexes scan the whole file and stop at the first match?
- Can the earlier schema-detector outputs be joined to symbolic names like `UserCreate` or `zValidator(..., userSchema)` so enrichment produces real field-level shapes instead of bare identifiers?
- If iterations 7-10 stay on contracts, the highest-value follow-up is a type-checker-backed pass for tRPC/Hono/NestJS/Fastify rather than adding more regex cases. (Iteration 7 will pivot to Python/Go AST extraction depth, iteration 8 to token stats.)

## Cross-Phase Awareness
This iteration stayed inside phase 002-codesight by reading only Codesight's own contracts module, types, and tests. It did not analyze contextador's MCP query design (phase 003) or graphify's NetworkX/Leiden (phase 004). The contract enrichment finding has no overlap with either phase.

## Sandbox Note
The codex CLI was invoked with `--sandbox read-only`. The agent successfully completed the source trace but could not write its formatted report to `/tmp/codex-iter-006-output.md` (`zsh:1: operation not permitted`). The captured `-o` last-message file contained the agent's full formatted report inside a fenced markdown block, which the orchestrator (Claude Opus 4.6) lifted into this iteration file without modification of the findings.

## Metrics
- newInfoRatio: 0.82
- findingsCount: 5
- focus: "iteration 6: contract enrichment pipeline"
- status: insight
