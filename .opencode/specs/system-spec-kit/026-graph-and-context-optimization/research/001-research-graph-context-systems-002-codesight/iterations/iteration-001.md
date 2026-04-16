# Iteration 1 - Codesight execution flow + zero-dep loader

## Summary
This iteration proves that `external/src/index.ts` is a thin orchestrator around one canonical scan pipeline: detect the project, collect files, fan out to detectors, enrich contracts, write output, then optionally project the result into JSON, AI context files, HTML, benchmark output, profile files, or blast-radius analysis. The zero-runtime-dependency story is source-confirmed at the package level because `package.json` has no runtime `dependencies`, but the AST path is only “zero-dep” because Codesight borrows the scanned repo’s own `typescript` package at runtime. That means AST precision is conditional, not guaranteed: if TypeScript cannot be loaded from the target repo, route/schema detectors degrade to regex or text parsing. The repo also cleanly separates stack detection from detector dispatch, which looks directly reusable for Code_Environment/Public.

## Files Read
- `external/package.json:1-57`
- `external/src/index.ts:1-547`
- `external/src/ast/loader.ts:1-116`
- `external/src/types.ts:1-201`
- `external/src/scanner.ts:1-489`
- `external/src/generators/ai-config.ts:1-264`
- `external/src/mcp-server.ts:1-534`
- `external/src/detectors/routes.ts:32-120,205-242,396-435`
- `external/src/detectors/schema.ts:18-40,80-182`

## Findings

### Finding 1 - `index.ts` keeps one canonical scan result and branches late
- Source: `external/src/index.ts:75-195`, `external/src/index.ts:382-400`, `external/src/index.ts:402-444`, `external/src/index.ts:493-541`
- What it does: `scan()` performs the core pipeline once: `detectProject()`, `collectFiles()`, parallel detector fan-out, plugin detector merge, `enrichRouteContracts()`, `writeOutput()`, token-stat calculation, then a second `writeOutput()` with accurate token counts. `main()` loads config, runs that scan once, then layers optional modes on top of the same `result` object for telemetry, JSON, AI config generation, HTML, benchmark output, blast radius, profile generation, and watch mode.
- Why it matters: Code_Environment/Public can borrow this shape to keep code-graph/context generation, assistant-facing output, and MCP responses aligned to one analysis artifact instead of maintaining parallel pipelines that drift.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: orchestration pipeline
- Risk/cost: medium - it requires consolidating existing context-producing paths around a shared result model before adding new projections.

### Finding 2 - The zero-dependency claim is true at package level, but AST fidelity is borrowed from the scanned repo
- Source: `external/package.json:10-15`, `external/package.json:44-50`, `external/src/ast/loader.ts:14-49`, `external/src/detectors/routes.ts:221-230`, `external/src/detectors/routes.ts:411-420`
- What it does: `package.json` defines only `devDependencies` and no runtime `dependencies`, while `loadTypeScript(projectRoot)` tries three strategies to borrow the target repo’s compiler: `createRequire(projectRoot/package.json)`, direct `node_modules/typescript`, then pnpm `.pnpm/typescript@*`. If all three fail, it caches `null` and route detectors like Hono and NestJS drop to regex parsing instead of AST extraction.
- Why it matters: This is a strong low-footprint pattern for analyzing arbitrary repos, but Code_Environment/Public should expose AST capability as an explicit mode or status flag so downstream tools know when they are running with degraded precision.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: AST analysis pipeline
- Risk/cost: medium - capability depends on target repo layout and package manager behavior, so observability and fallback reporting are necessary.

### Finding 3 - Stack detection is deliberately separated from detector execution
- Source: `external/src/scanner.ts:97-167`, `external/src/scanner.ts:169-330`, `external/src/types.ts:1-45`, `external/src/detectors/routes.ts:32-120`, `external/src/detectors/schema.ts:18-40`
- What it does: `detectProject()` builds a `ProjectInfo` fingerprint first, including frameworks, ORMs, component framework, language, and monorepo workspaces; for monorepos it aggregates workspace dependencies back into top-level detection. Route and schema scanning then switch over `project.frameworks` and `project.orms` rather than rediscovering stack information inside each detector.
- Why it matters: This architecture is a good fit for Code_Environment/Public because it makes detector extension cheap, keeps stack heuristics in one place, and supports mixed-stack repos without forcing every detector to understand workspace layout.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: framework/ORM detector architecture
- Risk/cost: low - the main work is defining a stable project fingerprint contract that existing analyzers can consume.

### Finding 4 - AI context generation uses a shared summary plus tool-specific profile overlays
- Source: `external/src/generators/ai-config.ts:14-68`, `external/src/generators/ai-config.ts:71-157`, `external/src/generators/ai-config.ts:164-264`, `external/src/index.ts:435-444`, `external/src/index.ts:530-536`, `external/src/types.ts:141-152`
- What it does: `generateAIConfigs()` builds one generic narrative summary and writes or appends it into assistant-specific files such as `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `codex.md`, and `AGENTS.md`. `generateProfileConfig()` then creates tighter tool-specific variants, with the Claude profile explicitly instructing the assistant to read `.codesight/CODESIGHT.md` first and use narrow MCP tools for routes, schema, and blast radius.
- Why it matters: Code_Environment/Public should likely borrow the split between a canonical summary generator and per-tool overlays, but not the direct “write root instruction files” behavior; the better fit is to emit into existing `.codex`, spec-packet, or prompt-wrapper surfaces.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: AI-assistant context generation, per-tool config profiles
- Risk/cost: medium - direct file emission into assistant instruction files can conflict with repo-owned guidance unless carefully namespaced.

### Finding 5 - The MCP design is narrow, cached, and query-oriented instead of exposing one giant blob
- Source: `external/src/index.ts:366-370`, `external/src/mcp-server.ts:16-19`, `external/src/mcp-server.ts:41-85`, `external/src/mcp-server.ts:89-288`, `external/src/mcp-server.ts:292-398`, `external/src/mcp-server.ts:402-534`
- What it does: `--mcp` exits the normal CLI path and starts a raw JSON-RPC-over-stdio server with a per-directory cached scan result. The tool surface is intentionally narrow: full scan, summary, routes, schema, blast radius, env vars, hot files, and refresh, all backed by the same cached scan pipeline.
- Why it matters: For Code_Environment/Public, this suggests an MCP pattern where assistants ask focused questions against a cached structural snapshot instead of repeatedly materializing whole-repo context, which could complement existing memory/code-graph tools well.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: MCP tool design, blast radius
- Risk/cost: medium - freshness and invalidation rules must be explicit or assistants will over-trust stale cached analysis.

## Answered Questions
- Q1: answered - `external/src/index.ts:75-195`, `external/src/index.ts:366-370`, `external/src/index.ts:435-444`, `external/src/index.ts:493-536` show the full orchestration path from project detection through scan, output, profile generation, MCP startup, and blast-radius mode.
- Q5: answered - `external/package.json:10-15`, `external/package.json:44-50`, and `external/src/ast/loader.ts:14-49` prove the zero-runtime-dependency package shape while showing that AST support is borrowed from the target repo’s `typescript` installation via three fallback strategies.

## Open Questions / Next Focus
- Trace `external/src/detectors/routes.ts:205-242` for Hono next. It is a clean AST-first plus regex-fallback route detector that exercises the borrowed-TypeScript loader without decorator complexity, so it is the best baseline route trace.
- Trace `external/src/detectors/routes.ts:396-435` for NestJS next. The source explicitly says NestJS “benefits most from AST” because it must combine controller-level and method-level decorators, making it the highest-value check for whether AST extraction is meaningfully better than regex.
- Trace `external/src/detectors/schema.ts:18-40` plus `external/src/detectors/schema.ts:80-147` for Drizzle next. Drizzle is the first ORM branch, has dedicated schema extraction plus separate relation parsing, and is the best candidate to compare AST-backed schema richness against simpler text parsers like Prisma.

## Cross-Phase Awareness
This iteration stayed inside phase `002-codesight` by tracing Codesight’s own orchestration, loader, MCP, and profile-generation surfaces without comparing implementation parity against Code_Environment/Public internals yet. It also avoided phase `003/004` overlap by only nominating next detector traces, not synthesizing cross-repo adoption plans or final architectural decisions.

## Metrics
- newInfoRatio: 0.62
- findingsCount: 5
- focus: "iteration 1: index.ts execution + zero-dep loader"
- status: insight