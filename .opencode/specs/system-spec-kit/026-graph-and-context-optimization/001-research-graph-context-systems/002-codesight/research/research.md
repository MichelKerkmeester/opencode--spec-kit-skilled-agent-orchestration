---
title: "Deep Research - 002-codesight: AST-based codebase analysis and AI-assistant context generation"
description: "Synthesis of 5-iteration deep-research session investigating the Codesight repository for concrete improvements applicable to Code_Environment/Public, covering AST detector design, framework/ORM coverage, MCP tool surface, blast-radius analysis, per-tool profile generation, and benchmark methodology."
phase: 002-codesight
session_id: dr-002-codesight-20260406T095851Z
generation: 1
status: complete
iterations: 5
findings: 26
questions_answered: 12
questions_total: 12
stop_reason: all_questions_answered
---

# Deep Research — 002-codesight

> Source repository: `external/` under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external/`
>
> Engine: 3 of 5 iterations dispatched via `cli-codex --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only --ephemeral` per user preference; iterations 4-5 fell back to native Read/Grep tools after codex stalled in `S` sleep state for 20-50 minutes (likely API throttling from concurrent codex traffic in another window). All findings remain source-confirmed with exact line citations.

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

Codesight is a zero-runtime-dependency Node.js/TypeScript CLI that scans a project root, runs AST-first detectors over routes, schemas, components, libraries, config, middleware, and an import graph, and projects the result into both static `.codesight/` markdown artifacts and a cached MCP query surface with 8 tools. The "zero dependency" claim is real at the package level (`external/package.json` has no runtime `dependencies`) but conditional in practice: AST precision depends on Codesight successfully borrowing the scanned project's own `typescript` package via `external/src/ast/loader.ts`. When that load fails, route and schema detectors degrade to deliberately narrow regex fallbacks.

The repository's strongest source-confirmed differentiators are (1) the unified `ScanResult` model in `external/src/index.ts:75-175` that branches late into static artifacts, MCP queries, profile files, and blast-radius analysis from one analysis pass; (2) the per-tool profile overlay system in `external/src/generators/ai-config.ts:164-264` that gives Claude Code, Cursor, Codex, Copilot, and Windsurf meaningfully different instructions on top of one shared summary; (3) the genuine AST decorator-walking NestJS route detector in `external/src/ast/extract-routes.ts:157-248`; and (4) a small but real precision/recall/F1 fixture harness in `external/src/eval.ts:43-244`.

Its weakest claims are (a) the README's "11.2x average token reduction" headline, which comes from three private SaaS codebases that are NOT in `external/eval/fixtures/` and is therefore not reproducible from this checkout; (b) the blast-radius "schema impact" overlay in `external/src/detectors/blast-radius.ts:91-127`, which heuristically marks all schemas affected when any affected file owns a route tagged `db`; and (c) a depth-cap off-by-one in the same blast-radius BFS that lets nodes one hop beyond `maxDepth` leak into results.

For `Code_Environment/Public`, the highest-leverage adoptions are the orchestration shape (one canonical scan, late-bound projections), the AST-first / regex-fallback / `confidence` label pattern, the per-tool profile overlay split, and the F1 fixture harness as a regression-test pattern. The biggest "do not duplicate" boundary is the cached MCP query interface, which belongs to phase 003-contextador, and the dependency-graph community detection layer, which belongs to phase 004-graphify.

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:topic-and-scope -->
## 2. Topic and Scope

**Research topic** (verbatim from `phase-research-prompt.md`):
> Research the external repository at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external` and identify concrete improvements for `Code_Environment/Public`, especially around AST-based codebase analysis, framework/ORM detector architecture, AI-assistant context file generation, MCP tool design, and per-tool config profile patterns.

**In scope:**
- AST route extraction pipeline (`extract-routes.ts`) and how it borrows project-local TypeScript.
- Framework/ORM detector architecture across 28 framework identifiers and 9 ORM identifiers in `external/src/types.ts`.
- MCP tool design and session-cache behavior in `external/src/mcp-server.ts`.
- Per-tool AI assistant profile generation in `external/src/generators/ai-config.ts`.
- Blast-radius reverse-import BFS in `external/src/detectors/blast-radius.ts` and the underlying graph in `external/src/detectors/graph.ts`.
- Hot-file ranking and dependency graph as "change carefully" surfaces.
- Benchmark methodology in `external/src/eval.ts` and fixture coverage under `external/eval/fixtures/`.
- Cross-phase boundary with 003-contextador (self-healing query interface) and 004-graphify (NetworkX/Leiden graph math).

**Out of scope** (per `phase-research-prompt.md` §10.2 and confirmed by every iteration):
- HTML report styling or presentational dashboard polish.
- npm publishing workflow, semver, release engineering.
- Generic TypeScript style commentary unrelated to AST detector design.
- Phase 003 self-healing MCP query interface (covered by `003-contextador`).
- Phase 004 NetworkX/Leiden community detection or evidence-tagging (covered by `004-graphify`).
- Re-implementing CocoIndex semantic search, Code Graph MCP structural queries, or Spec Kit Memory in `Code_Environment/Public`.

<!-- /ANCHOR:topic-and-scope -->

<!-- ANCHOR:methodology -->
## 3. Methodology

This synthesis is the result of a 5-iteration deep-research loop driven by `/spec_kit:deep-research:auto`, with externalized JSONL state and a reducer that maintains `findings-registry.json`, `deep-research-strategy.md`, and `deep-research-dashboard.md`.

**Iteration engine:** Per the user's request, every iteration was dispatched via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only --ephemeral` with `-o /tmp/codex-iter-NNN-output.md` to capture the agent's last message. Iterations 1, 2, and 3 returned cleanly (~3 min each); iterations 4 and 5 each had codex stall in `S` sleep state for 20-50 minutes with no output, likely because of concurrent codex API traffic from a parallel session in another window. After killing the stuck processes the orchestrator (Claude Opus 4.6) completed iterations 4 and 5 with native `Read` / `Grep` tools, preserving exact line citations and the same finding template used by codex iterations.

**Reading order discipline:** `external/src/index.ts` was read before `external/README.md` per `phase-research-prompt.md` instruction 3. README claims were always cross-checked against source files and fixtures and labeled `source-confirmed`, `test-confirmed`, `README-level`, or `mixed`.

**Convergence model:** The loop used the standard composite signal (rolling-average newInfoRatio, MAD noise floor, question entropy/coverage) plus three quality guards. It stopped at iteration 5 with stop reason `all_questions_answered` after coverage hit 12/12.

**Evidence rule:** Every finding cites exact paths under `external/src/`, `external/eval/`, or `external/tests/` with line ranges. README-only claims are explicitly flagged. Recommendations use the three-bucket rubric (`adopt now`, `prototype later`, `reject`) required by `phase-research-prompt.md` §11.

**Finding count per iteration:** 5, 4, 6, 6, 5 = 26 source-confirmed findings.

<!-- /ANCHOR:methodology -->

<!-- ANCHOR:system-overview -->
## 4. System Overview

Codesight ships as a single-binary CLI (`codesight`) with multiple sub-modes. The execution flow is:

```
codesight [path]
   |
   +-- detectProject(root)              -> ProjectInfo (frameworks, orms, language, monorepo)
   +-- collectFiles(root, maxDepth)     -> file list filtered by extension and ignore rules
   +-- Promise.all([
   |     detectRoutes,        -> RouteInfo[]   (AST or regex per framework)
   |     detectSchemas,       -> SchemaModel[] (AST or structured per ORM)
   |     detectComponents,    -> ComponentInfo[]
   |     detectLibs,          -> LibFile[]
   |     detectConfig,        -> { envVars, configFiles, dependencies }
   |     detectMiddleware,    -> MiddlewareInfo[]
   |     detectDependencyGraph -> { edges, hotFiles }
   |   ])
   +-- enrichRouteContracts(routes, project)
   +-- writeOutput(result, .codesight/)  -> 8 markdown files (conditional)
   +-- calculateTokenStats
   +-- writeOutput(result, .codesight/)  -> rewritten with accurate stats
   |
   +-- branch into optional modes (sharing the same `result`):
        |
        +-- --json                -> dump ScanResult as JSON
        +-- --html / --open       -> generate HTML report
        +-- --benchmark           -> token savings breakdown
        +-- --profile <tool>      -> generateProfileConfig(result, root, tool)
        +-- --blast <files>       -> analyzeBlastRadius(result, files)
        +-- --watch               -> debounced re-scan loop
        +-- --hook                -> install pre-commit hook
        +-- --mcp                 -> startMCPServer (replaces normal scan flow)
        +-- --eval                -> runEval (independent of scan)
```

The scan pipeline is the single source of truth. Static `.codesight/` artifacts and MCP tools are projections of the same `ScanResult`. The MCP server actually re-runs `writeOutput()` on cold cache misses, so static artifacts are a side effect of MCP scans, not a parallel pipeline.

**Critical files:**
- `external/src/index.ts:75-175` — `scan()` orchestration
- `external/src/index.ts:300-547` — `main()` argument parsing and mode dispatch
- `external/src/scanner.ts:97-330` — `detectProject()` and monorepo workspace aggregation
- `external/src/ast/loader.ts:14-105` — `loadTypeScript()` borrows the target repo's compiler via 3 fallback strategies
- `external/src/detectors/routes.ts` — framework-specific route detectors (Hono, Express, Fastify, Koa, NestJS, etc.)
- `external/src/ast/extract-routes.ts:1-248` — AST walks for Hono/Express/Fastify/NestJS routes
- `external/src/detectors/schema.ts` — ORM-specific schema detectors
- `external/src/ast/extract-schema.ts:1-260` — AST walks for Drizzle (and helpers for TypeORM)
- `external/src/detectors/graph.ts:1-238` — import-edge construction and hot-file ranking
- `external/src/detectors/blast-radius.ts:1-128` — reverse-BFS impact analysis
- `external/src/mcp-server.ts:1-534` — JSON-RPC stdio server with 8 cached tools
- `external/src/generators/ai-config.ts:1-264` — `generateAIConfigs` (5 files) + `generateProfileConfig` (5 profile cases)
- `external/src/formatter.ts:1-90` — `writeOutput` emits up to 8 conditional markdown files
- `external/src/eval.ts:1-244` — precision/recall/F1 harness against `eval/fixtures/`
- `external/tests/detectors.test.ts:1-499` — `node:test` integration tests for ~14 frameworks and 2 ORMs

<!-- /ANCHOR:system-overview -->

<!-- ANCHOR:findings -->
## 5. Key Findings

Findings are organized by domain and ranked by adoption priority within each domain. Every finding cites exact `external/` paths and labels evidence strength.

### 5.1 Orchestration and Pipeline Shape

#### F-ORCH-1 — `index.ts` keeps one canonical scan result and branches late
- **Source:** `external/src/index.ts:75-175`, `external/src/index.ts:300-547`
- **What it does:** `scan()` performs the core pipeline once: project detection → file collection → 7 parallel detectors → contract enrichment → `writeOutput` (twice, for placeholder and accurate token stats). `main()` then layers optional modes (JSON, HTML, benchmark, profile, blast-radius, MCP, eval, watch) on top of the same `result` object.
- **Why it matters:** This is a portable orchestration shape for `Code_Environment/Public`: keep one analysis artifact, project it into multiple surfaces, never duplicate the pipeline. The current Public stack already has fragments of this (Code Graph MCP, CocoIndex, Spec Kit Memory) but no shared "scan once" result that all assistant-facing surfaces consume.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** orchestration pipeline
- **Risk/cost:** medium — requires consolidating parallel context-producing paths around a shared result model

#### F-ORCH-2 — The pipeline is duplicated between `scan()` and `getScanResult()` in the MCP server
- **Source:** `external/src/index.ts:75-175`, `external/src/mcp-server.ts:45-85`
- **What it does:** Both functions run `detectProject` + `collectFiles` + 7 parallel detectors + `enrichRouteContracts`. Differences: `scan()` respects `disableDetectors` config, runs plugins, prints CLI progress, calls `writeOutput` twice. `getScanResult()` uses fixed `maxDepth=10`, skips plugins, calls `writeOutput` once, caches the result. There is no shared helper.
- **Why it matters:** Cautionary tale for `Code_Environment/Public`: factor any analogous pipeline into a single library function so toggles like disabled detectors and plugin hooks are not silently divergent across CLI and MCP surfaces.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now** (the refactor pattern, not the duplication)
- **Affected area:** orchestration pipeline, technical debt avoidance
- **Risk/cost:** low — easy if done at the start of any port

### 5.2 Zero-Dependency AST Loader

#### F-AST-1 — Zero-dependency claim is true at package level but AST fidelity is borrowed from the scanned repo
- **Source:** `external/package.json:10-15,44-50`, `external/src/ast/loader.ts:14-49`, `external/src/detectors/routes.ts:221-230,411-420`
- **What it does:** `package.json` declares only `devDependencies` and zero runtime `dependencies`. `loadTypeScript(projectRoot)` then tries three strategies in order: (1) `createRequire(projectRoot/package.json)`, (2) direct `node_modules/typescript`, (3) pnpm `.pnpm/typescript@*` glob. If all three fail it caches `null` and route detectors fall through to regex.
- **Why it matters:** This is a strong low-footprint pattern for analyzing arbitrary repos without bundling a compiler. For `Code_Environment/Public`, the right adoption is to expose AST capability as an explicit mode/status flag so downstream tools know when they are running with degraded precision.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** AST analysis pipeline
- **Risk/cost:** medium — capability depends on target repo layout and package manager; observability and fallback reporting are required

#### F-AST-2 — Stack detection is deliberately separated from detector dispatch
- **Source:** `external/src/scanner.ts:97-330`, `external/src/types.ts:1-45`, `external/src/detectors/routes.ts:32-120`, `external/src/detectors/schema.ts:18-40`
- **What it does:** `detectProject()` builds a `ProjectInfo` fingerprint first (frameworks, ORMs, component framework, language, monorepo workspaces). For monorepos it aggregates workspace dependencies into top-level detection. Route and schema detectors then `switch` over `project.frameworks` and `project.orms` rather than rediscovering stack info inside each detector.
- **Why it matters:** Cheap detector extension, single source for stack heuristics, mixed-stack support without forcing every detector to understand workspace layout. Directly portable to `Code_Environment/Public`.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** framework/ORM detector architecture
- **Risk/cost:** low

### 5.3 Framework Route Detection

#### F-ROUTE-1 — Hono is AST-first with prefix, params, and middleware capture
- **Source:** `external/src/detectors/routes.ts:206-248`, `external/src/ast/extract-routes.ts:25-50,55-142`, `external/src/ast/loader.ts:14-61`
- **What it does:** `detectHonoRoutes()` filters TS/JS files, checks for `hono` markers, borrows the target repo's TypeScript via `loadTypeScript`, and calls `extractRoutesAST(...)` before any regex. The AST walker visits every `CallExpression`, records `.use('/prefix', routerVar)` into a prefix map, detects `.get/.post/...` with literal paths, joins prefix to receiver path, extracts path params from the final path, and records identifier middleware from later call arguments.
- **Why it matters:** Directly reusable pattern for any framework with chained app calls. The AST path adds structurally useful data beyond simple method/path pairs.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** AST analysis pipeline, framework-specific detectors
- **Risk/cost:** medium — depends on borrowed TypeScript availability and only handles literal path strings

#### F-ROUTE-2 — Hono regex fallback is intentionally narrow; downstream contract enrichment cannot recover lost structure
- **Source:** `external/src/detectors/routes.ts:230-245`, `external/src/detectors/contracts.ts:9-96`, `external/src/types.ts:56-67`
- **What it does:** When TypeScript is unavailable or AST yields no routes, Hono falls back to a regex matching `\.(get|post|...)\(\s*['"\`]path/`, sets `confidence: "regex"`, and does NOT populate `params` or `middleware`. `enrichRouteContracts()` later re-reads each route file and backfills params from `route.path` plus type hints from `c.json<Type>(...)` and `zValidator(...)` regexes — but it cannot reconstruct missed `.use()` prefix chains or middleware identifiers.
- **Why it matters:** Consumers of regex-confidence routes must treat them as lower-fidelity. Public should surface confidence labels through to assistants and never assume enrichment fixes structural omissions.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now** (the confidence-label discipline)
- **Affected area:** contract enrichment pipeline
- **Risk/cost:** low — predictable behavior, requires only honest UX

#### F-ROUTE-3 — NestJS detection truly walks decorators and the regex fallback is materially less precise
- **Source:** `external/src/detectors/routes.ts:396-442`, `external/src/ast/extract-routes.ts:157-248`, `external/src/ast/loader.ts:64-105`
- **What it does:** `extractNestJSRoutes()` visits `ClassDeclaration` nodes, uses `getDecorators()` to support BOTH TS 4.x `node.decorators` and TS 5.x modifier-based decorators, parses `@Controller(...)` for the controller prefix, walks method decorators for `@Get/@Post/@Put/@Patch/@Delete`, joins controller and method paths, extracts `@Param(...)` names from method parameters, and collects `@UseGuards(...)` from class and method decorators into `middleware`. The regex fallback only grabs one file-level `@Controller(...)` prefix and scans every HTTP decorator in the file, so it loses class-to-method association and only reads the first string decorator argument.
- **Why it matters:** The strongest source-backed example of AST materially outperforming regex in the entire repository. If `Code_Environment/Public` does framework-specific AST work, decorator-heavy frameworks (NestJS, TypeORM entities, class-validator) are where the payoff is clearest.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** framework-specific route detector architecture
- **Risk/cost:** medium — the decorator parser is intentionally shallow (string-arg only)

### 5.4 Schema/ORM Detection

#### F-SCHEMA-1 — Drizzle is AST-backed for tables, field chains, and `relations()`, but indexes are not implemented
- **Source:** `external/src/detectors/schema.ts:48-147`, `external/src/ast/extract-schema.ts:18-260`, `external/src/types.ts:69-80`
- **What it does:** `detectDrizzleSchemas()` narrows to schema/db files, checks for `pgTable/mysqlTable/sqliteTable`, and prefers `extractDrizzleSchemaAST(...)`. The AST path walks `CallExpression`s for table constructors, accepts either an object literal or an arrow returning one for the field map, parses chained calls (`serial("id").primaryKey().notNull()`) into `type` plus `flags` (`pk`/`required`/`unique`/`default`/`fk`), extracts `.references(() => users.id)` targets, auto-adds `fk` by `*Id` naming, and separately walks `relations(table, () => ({ ... }))` for `one(...)` and `many(...)`.
- **Confirmed gap:** Full-file grep on `external/src/ast/extract-schema.ts` for `index|Index|uniqueIndex` returns ZERO matches. Only `primaryKey` is recognized in `parseFieldChain` (line 156). Full-file grep on `external/src/detectors/schema.ts` for `index` also returns zero matches. There is no Drizzle index extraction anywhere in the repository.
- **Why it matters:** Codesight's schema output should be treated as a table/column/relation summarizer, not a full schema model. If `Code_Environment/Public` ever needs index/foreign-key constraint awareness for migrations or blast-radius, that work has to be added on top, not assumed.
- **Evidence type:** source-confirmed
- **Recommendation:** **prototype later** (adopt the pattern, fix the gap when porting)
- **Affected area:** ORM/schema detector architecture
- **Risk/cost:** medium — extending the AST walk is feasible but non-trivial

### 5.5 Dependency Graph

#### F-GRAPH-1 — Import graph is regex-based and local-only with minimal alias normalization
- **Source:** `external/src/detectors/graph.ts:5-99,219-237`
- **What it does:** For TS/JS, Codesight scans each code file with regexes for `import/export ... from`, dynamic `import()`, and `require()`. It only keeps imports starting with `.` or the hard-coded aliases `@/` and `~/`, resolves relatives against the current file, rewrites `@/`/`~/` to `src/`, strips emitted `.js/.mjs/.cjs`, then tries exact-file / extension / `index.*` matches against the project file set. Imports outside those patterns (node_modules, custom path aliases) are ignored.
- **Why it matters:** This is a lightweight seed graph but NOT a build-accurate resolver for `tsconfig` path aliases or package exports. For `Code_Environment/Public`, this is a good starter pattern but should not be over-trusted in real monorepos.
- **Evidence type:** source-confirmed
- **Recommendation:** **prototype later**
- **Affected area:** dependency graph
- **Risk/cost:** medium — easy to port, easy to over-trust

#### F-GRAPH-2 — "Hot files" are ranked only by incoming import count (not real centrality)
- **Source:** `external/src/detectors/graph.ts:49-55`, `external/src/types.ts:127-139,156-159`
- **What it does:** Codesight increments `importCount` only when a file is imported, sorts descending, and returns the top 20 as `hotFiles`. There is no degree centrality, no outgoing-edge weighting, and no use of the `hotFileThreshold` config type declared in `types.ts`.
- **Why it matters:** The implementation is "most depended-on files," not "graph centrality." For `Code_Environment/Public`, borrow the metric but name it honestly. Do NOT call it centrality.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now** (with honest naming)
- **Affected area:** dependency graph, hot file ranking
- **Risk/cost:** low

### 5.6 Blast Radius

#### F-BLAST-1 — Reverse-dependency BFS dedupes cycles, but the depth cap is off by one
- **Source:** `external/src/detectors/blast-radius.ts:7-49,77-84`
- **What it does:** Builds `importedBy` and `imports` maps from the graph, then runs BFS over `importedBy` so a changed file fans out to direct and transitive dependents. Cycles are contained by the `affected` set, BUT dependents are added to `affected` BEFORE the queued node's depth is checked, so nodes one hop beyond `maxDepth` can still appear in the final result.
- **Why it matters:** The traversal direction is correct for change-impact analysis, but the depth semantics are looser than advertised. Public must enforce depth BEFORE adding descendants if it adopts this BFS.
- **Evidence type:** source-confirmed
- **Recommendation:** **reject** (in current form; pattern is fine if depth is fixed)
- **Affected area:** blast radius
- **Risk/cost:** medium — incorrect depth misleads impact estimates

#### F-BLAST-2 — Route and middleware overlays are direct file membership; model impact is heuristic
- **Source:** `external/src/detectors/blast-radius.ts:54-75,91-127`, `external/src/index.ts:493-527`
- **What it does:** Affected routes are routes whose `file` is in the affected set. Affected middleware is the same. Affected models are inferred MUCH more loosely: for each schema, the code checks whether any affected file owns a route tagged `db`, and if so it adds the schema name regardless of whether that schema is actually referenced from that file.
- **Why it matters:** Route and middleware overlays are plausible projections from the graph, but the model layer is not provenance-backed. Public should label schema impact as heuristic or upgrade it to a real symbol-usage graph (which is graphify/004 territory).
- **Evidence type:** source-confirmed
- **Recommendation:** **prototype later**
- **Affected area:** blast radius, schema impact
- **Risk/cost:** medium — mixed-confidence output creates false confidence unless explicitly surfaced

#### F-BLAST-3 — Multi-file blast radius is a unioned report, not a second traversal mode
- **Source:** `external/src/detectors/blast-radius.ts:91-127`
- **What it does:** Multi-file mode normalizes each input path, runs `analyzeBlastRadius()` once per file, unions affected files, dedupes routes by `path+method`, dedupes models and middleware via sets, removes the original input files from `affectedFiles`, and reports the combined source list as a comma-joined `file` string.
- **Why it matters:** Operationally simple, predictable, and cheap. It does NOT detect interactions between changed files beyond set union, but for review-time change summaries that may be sufficient.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** blast radius, multi-file reporting
- **Risk/cost:** low

### 5.7 MCP Tool Surface

#### F-MCP-1 — The MCP server is cached, text-first, and manually speaks JSON-RPC over stdio
- **Source:** `external/src/mcp-server.ts:35-49,51-85,89-534`
- **What it does:** All 8 tools call `getScanResult()`, which caches one `ScanResult` per resolved root and reuses it until either the root changes or `codesight_refresh` clears the cache. The server exposes tools via `tools/list`, wraps every tool result as `content: [{ type: "text", text: ... }]`, hand-parses `Content-Length` framed JSON-RPC messages from stdin, and never checks mtimes or file hashes for automatic staleness detection.
- **Why it matters:** The interface design (curated text summaries, not raw detector objects, with a stable cache) is worth borrowing. The hand-rolled protocol and manual cache invalidation are NOT — they should be replaced with an MCP SDK and an mtime-aware cache for any production port.
- **Evidence type:** source-confirmed
- **Recommendation:** **prototype later**
- **Affected area:** MCP tool design, cache lifecycle
- **Risk/cost:** medium

### 5.8 Per-Tool Profile Generation

#### F-PROFILE-1 — `generateAIConfigs` ships one shared summary into 5 distinct assistant files with safe append semantics
- **Source:** `external/src/generators/ai-config.ts:14-69,71-158`
- **What it does:** `generateContext(result)` builds one narrative paragraph from `project`, `routes`, `schemas`, `components`, `middleware`, `config.envVars`, and `graph.hotFiles`, ending with a "Read .codesight/CODESIGHT.md" pointer. `generateAIConfigs()` writes that same summary into `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md` (only if `.github` exists), `codex.md`, and `AGENTS.md`. Only the CLAUDE.md path has true append-aware behavior: if `CLAUDE.md` exists and does not already mention "codesight"/"CODESIGHT", it appends a `# AI Context (auto-generated by codesight)` block. The other four are first-write-wins.
- **Why it matters:** The shared-summary approach is portable. The cautionary lesson is that only CLAUDE.md gets a real upsert path; the others would be unsafe in repos that already maintain assistant-specific guidance. Public should add marker comments / namespaced sections before adopting.
- **Evidence type:** source-confirmed
- **Recommendation:** **prototype later**
- **Affected area:** AI-assistant context generation
- **Risk/cost:** medium

#### F-PROFILE-2 — `generateProfileConfig` is the real per-tool overlay layer (not just file renames)
- **Source:** `external/src/generators/ai-config.ts:164-264`
- **What it does:** Builds a compact ~1-2k token summary (stack, monorepo workspaces, route/model/env counts, top API areas, top 5 hot files, required env vars), then `switch (profile)`:
  - **claude-code → CLAUDE.md:** instructs the assistant to read `.codesight/CODESIGHT.md` first and lists 4 concrete MCP tool calls (`codesight_get_summary`, `codesight_get_routes --prefix /api/users`, `codesight_get_blast_radius --file src/lib/db.ts`, `codesight_get_schema --model users`) plus `tokenStats.saved` motivation. Has an in-place regex replace for prior `# AI Context` blocks.
  - **cursor → .cursorrules:** 4-step file reading order (`CODESIGHT.md`, `routes.md`, `schema.md`, `graph.md`) + explicit "Do not crawl the file tree" directive.
  - **codex → codex.md:** minimal one-line pointer + `Routes/Schema/Dependencies` file map.
  - **copilot → .github/copilot-instructions.md:** minimal pointer; creates `.github/` if missing.
  - **windsurf → .windsurfrules:** single-line pointer with `routes.md`/`graph.md` callouts.
  - **default:** falls back to `generateAIConfigs()` and writes everything.
- **Why it matters:** The single most directly transferable pattern in Codesight. Public could borrow the "shared summary + per-tool instruction overlay" split for `CLAUDE.md` / `.codex` / `.cursor` / `.gemini` directories. Cargo-cult risk: the Claude profile hardcodes `codesight_get_*` MCP tool names, which would only make sense after a similar MCP surface exists.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** AI-assistant context generation, per-tool config profiles
- **Risk/cost:** low

### 5.9 Static Artifact Layer

#### F-STATIC-1 — Static `.codesight/` artifacts and the MCP server are projections of the same `ScanResult`
- **Source:** `external/src/index.ts:75-175`, `external/src/formatter.ts:5-59`, `external/src/mcp-server.ts:45-96`
- **What it does:** `scan()` calls `writeOutput(result, outputDir)` twice (placeholder + accurate token stats). `writeOutput()` emits up to 8 markdown files. The MCP server's `getScanResult()` runs an almost identical pipeline manually, then explicitly calls `writeOutput(tempResult, resolve(root, ".codesight"))` so even MCP-only clients leave the same static files behind on disk. The cache reuses results until directory changes or `codesight_refresh` clears it.
- **Why it matters:** Confirms a useful design rule for `Code_Environment/Public`: a context-generation system should default to producing static artifacts (so the value is real even without a server running) and treat MCP query tools as a precision overlay on top, not a replacement. This complements Spec Kit Memory and Code Graph MCP with a third axis: "always-on stack/route/schema fingerprint."
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** AI-assistant context generation, MCP tool design, system architecture
- **Risk/cost:** low

#### F-STATIC-2 — The static artifact set is exactly 8 files, all conditional, with `CODESIGHT.md` as the unconditional combined index
- **Source:** `external/src/formatter.ts:5-59`
- **What it does:** `writeOutput()` emits a per-section file only when the matching detector has results: `routes.md` (if routes), `schema.md` (if schemas), `components.md`, `libs.md`, `config.md` (only if `formatConfig` returns non-empty), `middleware.md`, `graph.md` (only if hotFiles). `CODESIGHT.md` is always written as a combined index linking into whichever per-section files exist.
- **Why it matters:** The conditional-emission rule is directly portable: empty sections become absent files, not empty files, so assistants can rely on file existence as a positive signal.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** AI-assistant context generation
- **Risk/cost:** low

### 5.10 Benchmark Methodology

#### F-EVAL-1 — `eval.ts` is a real precision/recall/F1 harness, but its scope is detector accuracy NOT token savings
- **Source:** `external/src/eval.ts:43-244`
- **What it does:** `runEval()` reads each fixture's `repo.json` (file content map), materializes a temp directory, runs `detectProject` + `collectFiles` + 5 detectors in parallel, then compares detected sets to `ground-truth.json` for routes (`method:path`), models (lowercased name), env vars, and optionally components and middleware. `calcMetrics()` computes precision = TP/(TP+FP), recall = TP/(TP+FN), F1 = harmonic mean. Output is per-fixture metric tables plus an unweighted average across fixture/category pairs. There is no token-savings measurement, no statistical test, no confidence interval, no run-to-run variance.
- **Why it matters:** The strongest piece of "evidence" Codesight ships. Could be lifted directly as a regression-test pattern for `Code_Environment/Public` detectors. The limitations (no variance, no token-savings) are explicit in source.
- **Evidence type:** source-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** benchmark methodology, regression testing
- **Risk/cost:** low — ~245 LOC, no external dependencies

#### F-EVAL-2 — The "11.2x average token reduction" claim is README-only and not reproducible from this checkout
- **Source:** `external/README.md:52-64`, `external/eval/README.md:1-37`, `external/eval/fixtures/` (5 directories), `external/src/eval.ts:43-244`
- **What it does:** README presents one Benchmarks table with three projects ("SaaS A: Hono + Drizzle 4 workspaces, 12.9x", "SaaS B: raw HTTP + Drizzle, 11.7x", "SaaS C: Hono + Drizzle 3 workspaces, 9.1x") averaged to 11.2x. None of these SaaS codebases are present under `external/eval/fixtures/`; the fixture set covers different stacks (Express/Prisma, FastAPI/SQLAlchemy, Gin/GORM, Hono monorepo, Next.js/Drizzle). The reproducible `eval.ts` harness measures precision/recall/F1 only, never token counts.
- **Why it matters:** Treat token-savings claims as promotional unless we own the measurement. Adopt the F1 fixture pattern, but if Public wants a savings claim it must (a) instrument its own token counter against the same fixture set and (b) define an explicit baseline rather than borrow Codesight's number.
- **Evidence type:** README-level (claim) + source-confirmed (gap)
- **Recommendation:** **reject**
- **Affected area:** benchmark methodology, marketing-vs-engineering boundary
- **Risk/cost:** low — pure documentation/credibility risk

#### F-EVAL-3 — `tests/detectors.test.ts` is broader than the eval fixtures and is the strongest validation of "25+ frameworks"
- **Source:** `external/tests/detectors.test.ts:34-498`
- **What it does:** 500-line `node:test` file with inline `writeFixture()` helpers and dynamic imports from compiled `dist/`. Route Detection: 14 framework tests (Hono, Express, Fastify, NestJS, tRPC, SvelteKit, Remix, Nuxt, Next.js App Router, FastAPI, Django, Elysia, raw HTTP). Schema Detection: 2 (Drizzle and Prisma). Components: 1 (React). Dependency Graph: 2. Config: 1. Middleware: 1. Framework Detection: 7 package.json-only tests.
- **Why it matters:** ~14 unique frameworks have live integration assertions, plus 7 more have package.json-only detection. README's "25+ frameworks" is partially supported. README's "8 ORM parsers" is NOT — only Drizzle and Prisma are tested in this checkout. The test pattern (in-process fixtures, count + spot-check assertions) is directly portable.
- **Evidence type:** test-confirmed
- **Recommendation:** **adopt now**
- **Affected area:** detector regression testing
- **Risk/cost:** low — about 500 LOC for full coverage

<!-- /ANCHOR:findings -->

<!-- ANCHOR:detector-classification -->
## 6. Detector Classification Matrix

For each major detector traced end-to-end, the AST/regex split and downstream surfaces.

| Detector | Source | AST-backed? | Regex fallback? | Drives MCP tool? | Drives static `.md`? | Notes |
|----------|--------|-------------|-----------------|------------------|---------------------|-------|
| Hono routes | `external/src/detectors/routes.ts:206-248` | partial | yes | `codesight_get_routes` | `routes.md` | AST captures `.use()` prefixes, params, identifier middleware; regex only matches literal `.get/.post/...` |
| NestJS routes | `external/src/detectors/routes.ts:396-442` | partial | yes | `codesight_get_routes` | `routes.md` | AST really walks `@Controller` and method decorators; regex is file-level only |
| Express routes | `external/src/detectors/routes.ts:32-120` | partial | yes | `codesight_get_routes` | `routes.md` | Tested in `detectors.test.ts:56-71` |
| Fastify routes | `external/src/detectors/routes.ts:32-120` | partial | yes | `codesight_get_routes` | `routes.md` | Tested in `detectors.test.ts:73-87` |
| tRPC procedures | `external/src/detectors/routes.ts:32-120` | partial | yes | `codesight_get_routes` | `routes.md` | Tested in `detectors.test.ts:115-...` |
| FastAPI routes | `external/src/detectors/routes.ts:32-120` | structured | yes | `codesight_get_routes` | `routes.md` | Python helper in `external/src/ast/extract-python.ts` |
| Drizzle schema | `external/src/detectors/schema.ts:48-147` | partial | yes | `codesight_get_schema` | `schema.md` | AST handles tables, chained field modifiers, references, `relations()`; **NO index extraction anywhere** |
| Prisma schema | `external/src/detectors/schema.ts` | structured | yes | `codesight_get_schema` | `schema.md` | Schema file is structured; tested in `detectors.test.ts:300-320` |
| TypeORM schema | `external/src/detectors/schema.ts` | partial | yes | `codesight_get_schema` | `schema.md` | Decorator-based; helper exists but only Drizzle/Prisma have unit tests |
| SQLAlchemy / GORM | `external/src/detectors/schema.ts` | regex/structured | yes | `codesight_get_schema` | `schema.md` | Listed in `types.ts` ORM enum but not test-covered |
| React components | `external/src/detectors/components.ts` | yes (where AST possible) | yes | (no dedicated tool) | `components.md` | Props from interfaces + destructuring + forwardRef/memo per README |
| Dependency graph | `external/src/detectors/graph.ts:5-237` | regex | n/a | `codesight_get_hot_files` | `graph.md` | Local-only; `@/` and `~/` aliases hardcoded |
| Blast radius | `external/src/detectors/blast-radius.ts:1-128` | n/a | n/a | `codesight_get_blast_radius` | (none) | Reverse BFS over `importedBy`; depth cap off-by-one |
| Env vars / config | `external/src/detectors/config.ts` | structured | yes | `codesight_get_env` | `config.md` | Reads `.env`, code references, `process.env.*` |
| Middleware | `external/src/detectors/middleware.ts` | regex | n/a | (no dedicated tool) | `middleware.md` | File-pattern detection |

**Source-of-truth rule:** If a row says "partial" under "AST-backed?", inspect `external/src/ast/extract-routes.ts` or `external/src/ast/extract-schema.ts` for the exact AST coverage. The repo distinguishes AST-backed (high confidence) from regex (lower confidence) via the `confidence` field on `RouteInfo` and `SchemaModel`.

<!-- /ANCHOR:detector-classification -->

<!-- ANCHOR:mcp-tool-inventory -->
## 7. MCP Tool Inventory

Source: `external/src/mcp-server.ts:89-534`. All 8 tools share the per-root `cachedResult` cache built by `getScanResult()` (lines 41-85). The cache invalidates only when the resolved directory changes or when `codesight_refresh` is called explicitly.

| # | Tool name | Signature / params | One-line description | Cache reuse |
|---|-----------|-------------------|----------------------|-------------|
| 1 | `codesight_scan` | `({ directory?: string })` | Full codebase scan returning the complete AI context map across routes, schema, components, libraries, config, middleware, and dependency graph | yes |
| 2 | `codesight_get_summary` | `({ directory?: string })` | Compact project summary with stack, key stats, high-impact files, required env vars | yes |
| 3 | `codesight_get_routes` | `({ directory?: string, prefix?: string, tag?: string, method?: string })` | Returns API routes with methods, paths, params, tags, handler files; optional filtering | yes |
| 4 | `codesight_get_schema` | `({ directory?: string, model?: string })` | Returns database models with fields, types, constraints, relations; optional filter | yes |
| 5 | `codesight_get_blast_radius` | `({ directory?: string, file?: string, files?: string[], depth?: number })` | Returns transitively affected files, routes, models, middleware for one or more files | yes |
| 6 | `codesight_get_env` | `({ directory?: string, required_only?: boolean })` | Returns env vars with required/default status and source file | yes |
| 7 | `codesight_get_hot_files` | `({ directory?: string, limit?: number })` | Returns the most-imported files presented as highest-blast-radius files | yes |
| 8 | `codesight_refresh` | `({ directory?: string })` | Forces a re-scan so later tool calls use updated project context | no (clears cache) |

**Protocol:** Hand-rolled JSON-RPC over stdio with `Content-Length` framing. No MCP SDK. Tool results are wrapped as `content: [{ type: "text", text: ... }]` rather than structured arrays.

**Architectural note:** The MCP server's `toolScan` (lines 89-96) re-runs `writeOutput()` against `.codesight/` on every cached scan, so MCP and static artifacts converge on disk even when only MCP is in use.

<!-- /ANCHOR:mcp-tool-inventory -->

<!-- ANCHOR:per-tool-profile-diff -->
## 8. Per-Tool Profile Diff

Source: `external/src/generators/ai-config.ts:14-264`.

| Tool | Output file | Shared summary? | Tool-specific overlay | Behavior (append/overwrite/namespace) |
|------|-------------|-----------------|-----------------------|---------------------------------------|
| Claude Code | `CLAUDE.md` | yes (compact 1-2k summary) | Lists 4 specific MCP tool calls + `tokenStats.saved` motivation + "read .codesight/CODESIGHT.md first" | `generateProfileConfig` regex-replaces a prior `# AI Context...` block, else appends, else writes; `generateAIConfigs` appends `# AI Context (auto-generated by codesight)` if file exists and lacks "codesight" |
| Cursor | `.cursorrules` | yes | 4-step file reading order (`CODESIGHT.md` → `routes.md` → `schema.md` → `graph.md`) + explicit "Do not crawl" directive | `generateProfileConfig` overwrites; `generateAIConfigs` no-op if file exists |
| Codex | `codex.md` and `AGENTS.md` | yes | Minimal one-line pointer to `.codesight/CODESIGHT.md` + `Routes/Schema/Dependencies` file map | Both files first-write-wins (no append); `generateProfileConfig` writes only `codex.md` |
| Copilot | `.github/copilot-instructions.md` | yes | Single-line "Project context is pre-generated" pointer | `generateProfileConfig` creates `.github` if missing; `generateAIConfigs` only writes if `.github` already exists |
| Windsurf | `.windsurfrules` | yes | Single-line pointer with `routes.md`/`graph.md` callouts | `generateProfileConfig` overwrites; not handled by `generateAIConfigs` at all |

**Pattern to lift for `Code_Environment/Public`:** "Shared canonical summary + per-tool instruction overlay" with a `switch` over tool name and a small `summaryLines` array. Do NOT lift the hardcoded `codesight_get_*` MCP tool names from the Claude profile until an analogous MCP surface exists locally.

<!-- /ANCHOR:per-tool-profile-diff -->

<!-- ANCHOR:static-artifact-inventory -->
## 9. Static `.codesight/` Artifact Inventory

Source: `external/src/formatter.ts:5-59`.

| Artifact | Purpose | Conditional? | Source |
|----------|---------|--------------|--------|
| `CODESIGHT.md` | Combined index linking all per-section files | always written | `external/src/formatter.ts:55-58` |
| `routes.md` | Per-framework route table (method, path, params, tags, contract types) | only if `routes.length > 0` | `external/src/formatter.ts:13-17,61-89` |
| `schema.md` | Model table with fields, flags, references, relations | only if `schemas.length > 0` | `external/src/formatter.ts:19-23` |
| `components.md` | UI component list with props (when AST available) | only if `components.length > 0` | `external/src/formatter.ts:25-29` |
| `libs.md` | Library/utility file map | only if `libs.length > 0` | `external/src/formatter.ts:31-35` |
| `config.md` | Env vars + config files + dependency lists | only if `formatConfig` returns non-empty | `external/src/formatter.ts:37-41` |
| `middleware.md` | Middleware entries with type and source file | only if `middleware.length > 0` | `external/src/formatter.ts:43-47` |
| `graph.md` | Hot-file ranking + import-edge summary | only if `hotFiles.length > 0` | `external/src/formatter.ts:49-53` |

**Conditional-emission rule:** Empty detectors produce no file at all (not empty files). Assistants can use file existence as a positive signal.

<!-- /ANCHOR:static-artifact-inventory -->

<!-- ANCHOR:benchmark-validation -->
## 10. README Claims vs Fixture Coverage

Source: `external/README.md:5-74,149-155`, `external/eval/fixtures/`, `external/tests/detectors.test.ts:1-499`.

| README claim | Fixture or test source | Validated? | Gap |
|--------------|------------------------|------------|-----|
| 11.2x average token savings (9.1x-12.9x) | None in `external/eval/fixtures/` | **no** | Numbers come from 3 private SaaS codebases in `README.md:58-60`; `eval.ts` measures F1 only, never token counts |
| 25+ framework detectors | `external/tests/detectors.test.ts:34-269` (Routes), `:436-498` (Framework Detection) | **partial** | ~14 frameworks have live route-detection assertions + 7 more have package.json-only assertions; the gap to 25+ is filled by `external/src/types.ts` enum surface, not by tests |
| 8 ORM parsers | `external/tests/detectors.test.ts:271-321` | **partial** | Only Drizzle and Prisma have schema tests; the other 6 ORMs are claimed by README and `types.ts` but not test-covered in this checkout |
| Blast radius accuracy | None in `external/eval/fixtures/`, none in tests | **no** | `ground-truth.json` files have routes/models/components/envVars/middleware fields but no blast-radius field; no test in `detectors.test.ts` exercises `analyzeBlastRadius` |
| Zero runtime dependencies | `external/package.json:10-15,44-50` | **yes** | Confirmed at package level; AST fidelity is conditional on borrowed `typescript` from target repo (`external/src/ast/loader.ts:14-49`) |
| AST precision when TypeScript present | `external/tests/detectors.test.ts:34-499` | **yes** (for tested frameworks) | Test fixtures include `typescript` via package.json when needed; production behavior depends on target repo layout |

**Fixture set:** 5 directories under `external/eval/fixtures/` — `express-prisma`, `fastapi-sqlalchemy`, `gin-gorm`, `hono-monorepo`, `nextjs-drizzle`. The `eval/README.md` lists only 4 of those 5 (gin-gorm omitted). Each fixture is a `repo.json` (file content map) + `ground-truth.json` (expected detector output).

<!-- /ANCHOR:benchmark-validation -->

<!-- ANCHOR:recommendations -->
## 11. Recommendations

Ranked by adoption priority (high-impact / low-effort first), with explicit `adopt now`, `prototype later`, or `reject` per `phase-research-prompt.md` §10.3.

### 11.1 Adopt Now (high-leverage, low-cost)

1. **Single-canonical-`ScanResult` orchestration shape.** Project one analysis result into multiple consumer surfaces (static markdown, MCP, profile files, blast-radius), branching late inside `main()` rather than running parallel pipelines. Anchor: `external/src/index.ts:75-175`. Public lift: define a shared `RepoFingerprint` (or similar) that any context-producing surface — CLAUDE.md generator, MCP tool, code-graph snapshot, spec-kit memory bootstrap — consumes from a single function. F-ORCH-1, F-ORCH-2.

2. **AST-first / regex-fallback / `confidence` label discipline.** Always try the AST path first when the borrowed compiler is available, fall back to regex when not, and surface a `confidence: "ast" | "regex"` field through to consumers. Anchors: `external/src/detectors/routes.ts:206-248,396-442`, `external/src/ast/extract-routes.ts:1-248`. Public lift: extend any new detector with an explicit confidence enum and never let the consumer guess. F-ROUTE-1, F-ROUTE-2, F-ROUTE-3.

3. **Per-tool profile overlay split.** One shared canonical summary plus a `switch (profile)` of tool-specific instruction blocks. Anchor: `external/src/generators/ai-config.ts:164-264`. Public lift: build a `generateAssistantConfig(repoFingerprint, profile)` that emits CLAUDE.md / .codex / .gemini / .cursorrules with shared summary + tool-specific overlays. Do not hardcode MCP tool names that don't exist locally yet. F-PROFILE-2.

4. **Static-artifacts-as-default + MCP-as-overlay rule.** A context-generation system should always produce git-committable static markdown so the value is real even without a server running, and treat MCP query tools as a precision overlay on top. Anchors: `external/src/index.ts:435-444`, `external/src/mcp-server.ts:45-99`, `external/src/formatter.ts:5-59`. Public lift: any new context-generation effort must produce both layers from one scan. F-STATIC-1, F-STATIC-2.

5. **Conditional artifact emission.** Empty detector → absent file, not empty file. Assistants can rely on file existence as a positive signal. Anchor: `external/src/formatter.ts:13-58`. Public lift: trivial. F-STATIC-2.

6. **Stack detection separated from detector dispatch.** `detectProject()` builds a `ProjectInfo` fingerprint once; detectors `switch` on framework/ORM enum values rather than rediscovering stack. Anchor: `external/src/scanner.ts:97-330`. Public lift: cheap, makes detector extension trivial. F-AST-2.

7. **F1 fixture harness for detector regression testing.** ~245 LOC of zero-dependency precision/recall/F1 logic plus hand-curated `repo.json`/`ground-truth.json` pairs. Anchors: `external/src/eval.ts:43-244`, `external/eval/fixtures/hono-monorepo/ground-truth.json:1-33`. Public lift: directly portable as a regression test for any detector or context-generator added to the spec-kit toolchain. F-EVAL-1.

8. **`detectors.test.ts` integration pattern.** In-process fixtures via `writeFixture()`, parallel detector calls, count + spot-check assertions, dynamic imports from compiled `dist/`. Anchor: `external/tests/detectors.test.ts:1-499`. Public lift: ~500 LOC for full detector coverage. F-EVAL-3.

9. **Hot-file ranking by incoming import count, named honestly.** Borrow the metric (top-N most depended-on files) but call it "depended-on count," not "centrality." Anchor: `external/src/detectors/graph.ts:49-55`. F-GRAPH-2.

10. **Multi-file blast radius as union over per-file traversals.** Operationally simple, predictable, dedupes routes by `path+method`. Anchor: `external/src/detectors/blast-radius.ts:91-127`. F-BLAST-3.

### 11.2 Prototype Later (high-impact, medium-effort)

1. **Zero-runtime-dep AST loader pattern.** Borrow the target repo's `typescript` package via `createRequire` / `node_modules` / `.pnpm` glob, with explicit fallback to non-AST behavior. Anchor: `external/src/ast/loader.ts:14-49`. Public should expose AST capability as a status flag. F-AST-1.

2. **Per-tool profile generation in assistant directories.** The `generateAIConfigs` shared-summary writer is portable, but only `CLAUDE.md` has true upsert semantics in Codesight; the others would clobber existing files. Public must add marker comments / namespaced sections / `Code_Environment/Public/.claude/`-style directory namespacing before adopting. Anchor: `external/src/generators/ai-config.ts:71-158`. F-PROFILE-1.

3. **Drizzle schema AST extraction.** Useful for tables/fields/relations but missing index extraction entirely. Anchor: `external/src/detectors/schema.ts:48-147`, `external/src/ast/extract-schema.ts:18-260`. Public should add index handling before relying on it for migration planning. F-SCHEMA-1.

4. **Local-only regex import graph with `@/`/`~/` alias normalization.** Lightweight starter graph for code-impact analysis. Anchor: `external/src/detectors/graph.ts:5-237`. Public should not over-trust it in monorepos with custom path aliases. F-GRAPH-1.

5. **Cached MCP tool surface with narrow text-first responses.** The interface design is worth borrowing — but the cache invalidation, hand-rolled JSON-RPC, and tight coupling to `ScanResult` need hardening. Anchor: `external/src/mcp-server.ts:35-534`. **Note:** the MCP query interface is officially owned by phase 003-contextador, so this should be a narrow inspiration, not a full re-implementation here. F-MCP-1.

6. **Heuristic blast-radius schema overlay (with explicit labeling).** The route+middleware overlay is graph-backed; the schema overlay is heuristic. Anchor: `external/src/detectors/blast-radius.ts:54-127`. Public can adopt only if schema impact is explicitly labeled "heuristic" or upgraded to a real symbol-usage graph (which is graphify/004 territory). F-BLAST-2.

### 11.3 Reject

1. **The 11.2x token savings headline as published.** Not reproducible from the public eval suite; the SaaS A/B/C numbers are from private codebases. Public should not quote this number. F-EVAL-2.

2. **Reverse-dependency BFS in current form.** The depth-cap off-by-one can leak nodes one hop beyond `maxDepth` into results. The BFS pattern itself is fine if the depth check happens BEFORE adding descendants to the result set. Anchor: `external/src/detectors/blast-radius.ts:7-49,77-84`. F-BLAST-1.

3. **HTML report styling and presentational dashboard polish.** Out of scope per `phase-research-prompt.md` §10.2.

4. **Direct emission into root-level `CLAUDE.md` / `AGENTS.md` / `codex.md` without namespacing.** Codesight's first-write-wins behavior is unsafe in repos that already maintain assistant-specific guidance. Public must namespace under `.claude/` / `.codex/` / `.gemini/` directories or use marker comments before adopting `generateAIConfigs`. F-PROFILE-1 caveat.

<!-- /ANCHOR:recommendations -->

<!-- ANCHOR:eliminated-alternatives -->
## 12. Eliminated Alternatives

Negative knowledge is a primary research output per `loop_protocol.md:446-452`. The following approaches were investigated and definitively ruled out within this session.

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|------------------|----------|--------------|
| Trust the README's "11.2x token reduction" headline | The 3 SaaS codebases that produce that number are NOT in `external/eval/fixtures/`; `eval.ts` measures only F1, never tokens; the claim is README-only and unreproducible from this checkout | `external/README.md:52-64`, `external/eval/README.md:1-37`, `external/src/eval.ts:43-244` | iter 4 |
| Use `analyzeBlastRadius` as-shipped for change-impact reporting | Reverse-dependency BFS adds dependents to `affected` BEFORE checking depth, so nodes one hop past `maxDepth` leak into results; depth semantics are looser than advertised | `external/src/detectors/blast-radius.ts:7-49,77-84` | iter 3 |
| Treat the schema overlay in blast-radius as provenance-backed | Affected models are inferred by checking whether any affected file owns a route tagged `db`, regardless of whether that schema is referenced from that file; not actually schema-usage graph | `external/src/detectors/blast-radius.ts:54-75,91-127` | iter 3 |
| Call Codesight's "hot files" metric "graph centrality" | The implementation is incoming-import count only; no degree centrality, no outgoing-edge weighting, no use of `hotFileThreshold` config | `external/src/detectors/graph.ts:49-55`, `external/src/types.ts:127-139` | iter 3 |
| Rely on Codesight for full Drizzle schema awareness including indexes | No `index|Index|uniqueIndex` matches anywhere in `extract-schema.ts` or `detectors/schema.ts`; only `primaryKey/notNull/unique/default/references` are recognized as field flags | `external/src/ast/extract-schema.ts:130-194`, `external/src/detectors/schema.ts:48-147` (full grep returns zero index matches) | iter 2, iter 5 (re-confirmed) |
| Treat the import graph as a build-accurate resolver | The graph only tracks local relative imports plus hardcoded `@/`/`~/` aliases (rewritten to `src/`); ignores `tsconfig` path aliases, package exports, node_modules | `external/src/detectors/graph.ts:5-99,219-237` | iter 3 |
| Treat `generateAIConfigs` as safe to adopt verbatim | Only `CLAUDE.md` has true append-aware upsert behavior; the other 4 files (`.cursorrules`, `.github/copilot-instructions.md`, `codex.md`, `AGENTS.md`) are first-write-wins and would clobber existing repo guidance | `external/src/generators/ai-config.ts:71-158` | iter 4 |
| Adopt Codesight's MCP server design fully here in 002 | The MCP query interface is officially owned by phase 003-contextador (self-healing query pattern); duplicating it in 002 would create cross-phase scope drift | `phase-research-prompt.md` cross-phase awareness table, iter 5 cross-phase boundary | iter 5 |
| Re-implement dependency-graph community detection in 002 | NetworkX/Leiden community detection is officially owned by phase 004-graphify; Codesight's graph is a degree-counting starter, not graph math | iter 5 cross-phase boundary; `external/src/detectors/graph.ts` does no community detection | iter 5 |
| Skip the source-before-README reading order | `phase-research-prompt.md` instruction 3 explicitly forbids this; iter 1 followed it correctly and proved that several README claims overreach the source | `phase-research-prompt.md:3` | iter 1 |
| Use cli-codex for ALL iterations as originally planned | Iterations 4 and 5 stalled in `S` sleep state for 20-50 minutes each (likely OpenAI API throttling from concurrent codex traffic in another window); native Read/Grep fallback was required to keep the loop moving | bash `ps` output during iter 4 and iter 5; killed PIDs 5866/59530/56544 | iter 4, iter 5 |
| Trust unit-test coverage to validate "8 ORM parsers" | Only Drizzle and Prisma have schema unit tests in `tests/detectors.test.ts:271-321`; the other 6 ORMs (TypeORM, SQLAlchemy, GORM, etc.) are listed in `types.ts` but not test-covered in this checkout | `external/tests/detectors.test.ts:271-321` | iter 4 |

<!-- /ANCHOR:eliminated-alternatives -->

<!-- ANCHOR:open-questions -->
## 13. Open Questions

All 12 key questions from `phase-research-prompt.md` §6 are answered (12/12 coverage). Residual gaps that could justify future iterations if Codesight's design becomes a more direct reference for implementation in `Code_Environment/Public`:

1. **Deep TypeORM schema coverage.** Iteration 2 confirmed AST-backed paths exist for Hono/NestJS routes and Drizzle schema, but TypeORM's decorator surface was not traced end-to-end. If Public ever needs ORM coverage parity with Codesight's claims, a follow-up iteration should read `external/src/detectors/schema.ts` TypeORM branch + any helpers in `external/src/ast/extract-schema.ts`.
2. **SQLAlchemy / GORM / Mongoose / Sequelize coverage.** All listed in `types.ts` ORM enum but neither tested nor traced in this session. Treat as `partial` until proven.
3. **Plugin API surface and contract.** Iteration 1 noted that `scan()` runs `userConfig.plugins` post-processors but the plugin contract was not explored. If Public adopts a plugin pattern, this is a small follow-up read of `external/src/index.ts:402-413` and the plugin type definitions in `external/src/types.ts`.
4. **Token-stat methodology.** `calculateTokenStats(...)` produces the `tokenStats.saved` value used in the Claude profile motivation message but was not traced. Worth a single-file read of `external/src/index.ts` (or wherever the helper lives) before quoting any savings number in Public's own assistant configs.
5. **Watch mode debouncing and incremental scan.** `watchMode()` exists in `external/src/index.ts:235-298` but a real incremental detector pipeline was not investigated. If Public wants live-updating context, this is a separate research thread.
6. **HTML report and benchmark output formats.** Explicitly out of scope per `phase-research-prompt.md` §10.2; included here only for completeness.

None of these is blocking for the current synthesis or recommendations.

<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:cross-phase-boundary -->
## 14. Cross-Phase Boundary

Synthesized in iteration 5. Anchors the scope of phase 002 against neighboring phases so future implementation work does not duplicate or conflict with 003 / 004 / 005.

| Capability | Owns it | Why | `Code_Environment/Public` should... |
|------------|---------|-----|-------------------------------------|
| AST-first detector pipeline (14+ frameworks) | **002-codesight** | `extract-routes.ts` and `extract-schema.ts` are Codesight's core differentiator | adopt the AST-first + regex-fallback pattern with explicit `confidence` labels |
| Per-tool AI assistant profile generation (CLAUDE / Cursor / Codex / Copilot / Windsurf) | **002-codesight** | `generateProfileConfig()` is unique to this phase | adopt the "shared summary + per-tool overlay" split, write into namespaced sections only |
| Static `.codesight/` artifact emission via `formatter.ts` | **002-codesight** | `writeOutput()` materializes git-committable context files | adopt the conditional-emission rule (no file if no data); pick a different output directory |
| Reverse-import BFS blast-radius analysis | **002-codesight** (with caveats) | `analyzeBlastRadius()` is here, but graph math overlaps with 004 | borrow the BFS pattern but fix the depth-cap off-by-one (F-BLAST-1); for richer impact, defer to 004's graph math |
| Hot-file ranking by incoming import count | **002-codesight** | Trivial scoring, not real graph centrality | borrow only as a "depended-on count" metric; do NOT name it "centrality" |
| Cached `ScanResult` MCP tools (8 narrow tools) | **003-contextador** owns the long-term query interface; 002 owns the scan model | 003 is positioned as the self-healing query layer; 002 is the source of truth | borrow Codesight's narrow tool surface as design inspiration, but build the long-term query layer in 003-contextador, not here |
| NetworkX / Leiden community detection over imports | **004-graphify** | Codesight does not implement graph math beyond degree counting | do NOT re-implement community detection in 002; defer to 004 |
| EXTRACTED/INFERRED tagging on graph nodes | **004-graphify** | Codesight has no provenance tags on graph entries | do NOT bolt onto Codesight's edge model; let 004 own provenance |
| F1 fixture harness for detector regression | **002-codesight** | `eval.ts` is a small, self-contained regression pattern with no graph dependencies | adopt directly as a spec-kit testing pattern |
| Plugin marketplace + claude-memory + token insights | **005-claudest** | Out of scope for static analysis | not relevant to 002 |

<!-- /ANCHOR:cross-phase-boundary -->

<!-- ANCHOR:risks-and-caveats -->
## 15. Risks and Caveats

1. **The cli-codex engine fallback (iters 4-5).** Two of five iterations were completed with native Read/Grep tools instead of cli-codex gpt-5.4 high. The fallback is annotated in each iteration file's engine-note header and in `deep-research-state.jsonl`. All findings remain source-confirmed with exact line citations, and the synthesis treats native and codex iterations identically. The risk is reproducibility: a future re-run with codex available may produce subtly different prose or finding ordering. The substantive content (paths, line ranges, recommendations) is stable.

2. **Drizzle index extraction gap is asserted via grep, not via exhaustive AST inspection.** `external/src/ast/extract-schema.ts` and `external/src/detectors/schema.ts` were grep'd for `index|Index|uniqueIndex` and returned zero matches. There is a small residual risk that index handling lives in a sibling helper (e.g., via dynamic dispatch or a method name not matching the grep pattern). Iteration 2's original finding was AST-walked and confirmed; iteration 5 reconfirmed via grep. Confidence is high but not 100%.

3. **The MCP tool name `codesight_get_summary` referenced in the Claude profile.** The profile hardcodes 4 specific MCP tool calls (`codesight_get_summary`, `codesight_get_routes --prefix /api/users`, `codesight_get_blast_radius --file src/lib/db.ts`, `codesight_get_schema --model users`). These will only work if (a) the codesight MCP server is running and (b) the assistant has it configured. Public must NOT lift these literal tool names into its own profile generators without first ensuring an analogous MCP surface exists locally — or the generated CLAUDE.md will instruct the assistant to call tools that do not exist.

4. **Test coverage skew.** `tests/detectors.test.ts` is broad on routes (~14 frameworks) but narrow on schemas (Drizzle + Prisma only). README's "8 ORM parsers" headline overreaches the test coverage in this checkout. Treat any ORM beyond Drizzle and Prisma as `partial / unverified` until a follow-up iteration traces the relevant detector branch.

5. **The 11.2x token savings number is unreproducible from this checkout.** Public should not quote the figure under any circumstances unless it instruments its own measurement. Codesight's own eval suite measures detector accuracy (F1), not token reduction.

6. **Cross-phase scope drift risk.** Iterations 1-4 stayed clean of 003 (MCP query) and 004 (graph math) territory. Iteration 5 explicitly bounded the boundary. The risk going forward is that any future implementation work in `Code_Environment/Public` could accidentally re-implement Codesight's MCP server in 002 instead of deferring to 003-contextador, or duplicate Codesight's hot-file count in 002 instead of letting 004-graphify own real graph math. Section 14's boundary table is the contract.

<!-- /ANCHOR:risks-and-caveats -->

<!-- ANCHOR:appendix-iteration-lineage -->
## 16. Appendix — Iteration Lineage

| # | File | Engine | Findings | Δratio | Questions answered (this iteration) | Notable discoveries |
|---|------|--------|----------|--------|-------------------------------------|---------------------|
| 1 | `iterations/iteration-001.md` | cli-codex gpt-5.4 high | 5 | 0.62 | Q1 (orchestration), Q5 (zero-dep loader) | One canonical scan result; AST fidelity borrowed from target repo |
| 2 | `iterations/iteration-002.md` | cli-codex gpt-5.4 high | 4 | 0.69 | Q2 (framework AST coverage), Q3 (Hono+NestJS end-to-end), Q4 (Drizzle, partial) | NestJS truly walks decorators; Drizzle has no index extraction |
| 3 | `iterations/iteration-003.md` | cli-codex gpt-5.4 high (after first attempt stalled and was killed) | 6 | 0.78 | Q6 (8 MCP tools), Q7 (blast-radius algo), Q9 (hot files) | Blast-radius BFS depth cap off-by-one; model overlay heuristic; 8 MCP tools enumerated |
| 4 | `iterations/iteration-004.md` | native fallback (codex stalled in S sleep ~40 min) | 6 | 0.55 | Q8 (per-tool profiles), Q10 (eval/fixtures) | 11.2x claim is README-only; ~14 frameworks have live route tests, only Drizzle+Prisma have schema tests |
| 5 | `iterations/iteration-005.md` | native fallback (codex stalled in S sleep ~20 min) | 5 | 0.42 | Q11 (static vs query-time), Q12 (cross-phase), Q4 reconfirmed | Static artifacts and MCP both project the same `ScanResult`; Drizzle index gap reconfirmed via grep; cross-phase boundary finalized |

**Engine summary:** 3 of 5 iterations honored the user's "cli-codex gpt-5.4 high wherever possible" preference. Iterations 4 and 5 fell back to native Read/Grep after killing stuck codex processes (PIDs 5866, 59530, 56544 / 59524, 56538). All source-confirmed findings have exact `external/src/...` line citations regardless of engine.

**Reducer activity:** `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>` was run after each iteration. The reducer maintained `findings-registry.json`, refreshed `deep-research-strategy.md` machine-owned sections, and regenerated `deep-research-dashboard.md`.

**State files (final):**
```
research/
├── deep-research-config.json          (status="complete" after this synthesis)
├── deep-research-state.jsonl          (5 iteration records + session_start + convergence_signal + synthesis_complete)
├── deep-research-strategy.md          (reducer-synced through iter 5)
├── deep-research-dashboard.md         (reducer-synced)
├── findings-registry.json             (reducer-synced)
├── research.md                        (this file)
└── iterations/
    ├── iteration-001.md
    ├── iteration-002.md
    ├── iteration-003.md
    ├── iteration-004.md
    └── iteration-005.md
```

<!-- /ANCHOR:appendix-iteration-lineage -->

<!-- ANCHOR:convergence-report -->
## 17. Convergence Report

- **Stop reason:** `all_questions_answered` — 12 of 12 key questions answered (coverage 1.00, well above the 0.85 entropy threshold)
- **Total iterations:** 5 of 10 max
- **Questions answered:** 12 / 12
- **Remaining questions:** 0
- **newInfoRatio sequence:** 0.62 → 0.69 → 0.78 → 0.55 → 0.42 (rolling avg of last 3 = 0.58, well above 0.05 threshold; the loop stopped on coverage, not noise floor)
- **Findings count:** 26 source-confirmed findings across 5 iterations
- **Stuck count:** 0 (no consecutive no-progress iterations)
- **Quality guards:** all passed (every iteration had `status: insight`, source-cited findings, machine-owned strategy sections updated by the reducer)
- **Convergence threshold:** 0.05 (default)
- **Composite signals at stop:** rolling-avg signal NOT triggered (avg too high), MAD noise floor NOT triggered, question-entropy signal triggered (1.00 ≥ 0.85). Single-signal STOP via `all_questions_answered` short-circuit.
- **Last 3 iteration summaries:**
  - run 3: graph + blast-radius + 8 MCP tools (0.78)
  - run 4: profile generators + benchmark validation (0.55)
  - run 5: static vs query-time + cross-phase scoping (0.42)
- **Engine lineage:** cli-codex gpt-5.4 high (iters 1-3), native fallback (iters 4-5)
- **Synthesis path:** progressive synthesis was NOT in use; this `research/research.md` was compiled in one pass during the synthesis phase from the 5 iteration files.
- **Memory save:** triggered next via `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>`.

Segment transitions, wave scores, and checkpoint metrics are intentionally omitted (experimental signals not used by this session).

<!-- /ANCHOR:convergence-report -->
