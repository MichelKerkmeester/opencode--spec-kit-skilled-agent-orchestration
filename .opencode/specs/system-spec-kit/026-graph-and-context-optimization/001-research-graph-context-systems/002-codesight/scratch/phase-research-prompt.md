# $refine TIDD-EC Prompt: 002-codesight

## 2. Role

You are a research specialist in zero-dependency AST-based codebase analysis, multi-framework detection, ORM schema parsing, MCP tool ergonomics, and AI-assistant context file generation. Work like a systems analyst who can separate README claims from source-proven behavior, trace detector pipelines end to end, and translate Codesight's concrete design into practical improvements for `Code_Environment/Public`.

## 3. Task

Research Codesight's AST extraction pipeline, framework and ORM detector architecture, MCP tool design, profile-based context generation, and blast-radius analysis to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around AST-based codebase analysis, AI-assistant context generation, per-tool config profiles, and structural impact analysis. Focus on what the external repo actually proves in `src/`, what the evaluation fixtures support, and what the README claims beyond the code.

## 4. Context

### 4.1 System Description

Codesight is a zero-dependency Node.js/TypeScript CLI that scans a project root and generates AI-assistant context artifacts from structured code analysis instead of file-by-file exploration. The README positions it around AST precision, 25+ framework detectors, 8 ORM parsers, 8 MCP tools, blast-radius analysis, per-tool profiles, and benchmarked 9x-13x token savings. In source, the entry flow in `external/src/index.ts` detects the project stack, collects files, runs detectors in parallel, enriches route contracts, writes `.codesight/` output, calculates token-savings estimates, and optionally generates profile-specific files such as `CLAUDE.md`, `.cursorrules`, `codex.md`, `AGENTS.md`, and `.github/copilot-instructions.md`. Its "zero dependency" story is not magic: `external/package.json` has no runtime deps, and `external/src/ast/loader.ts` dynamically borrows the scanned project's `typescript` package when available, then falls back to regex or structured parsing when AST support is unavailable.

Framework and ORM coverage is broad but heterogeneous. `external/src/types.ts` defines roughly 28 framework identifiers and 9 ORM identifiers, while `external/src/scanner.ts` detects them from package metadata, workspace aggregation, and language-specific files like `requirements.txt`, `go.mod`, `Gemfile`, and `mix.exs`. Route and schema detection are split between framework-specific detector modules in `external/src/detectors/` and AST helpers in `external/src/ast/`. AST extraction is strongest for Hono/Express/Fastify/Koa/Elysia/NestJS/tRPC routes and Drizzle/TypeORM schemas; unsupported or partially supported cases intentionally degrade to regex or language-specific structured parsing.

Codesight also exposes an MCP server and impact-analysis layer. `external/src/mcp-server.ts` implements raw JSON-RPC over stdio with 8 tools and a session cache, while `external/src/detectors/blast-radius.ts` computes reverse-import BFS over the dependency graph and overlays affected routes, middleware, and probable models. `external/src/generators/ai-config.ts` shows how each AI-tool profile emphasizes different navigation instructions, and `external/src/eval.ts` plus `external/eval/fixtures/` provide a benchmark harness that should be treated as stronger evidence than marketing copy in the README.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Claude Optimization Settings (Reddit post) | Configuration audit + ENABLE_TOOL_SEARCH | None | Reddit narrative, not codebase |
| 002 | codesight | Zero-dep AST + framework detectors -> CLAUDE.md generation | 003 (context maps), 004 (knowledge graph) | Focus AST detectors, framework parsers, MCP tools |
| 003 | contextador | MCP server + queryable structure + Mainframe shared cache | 002, 004 | Focus self-healing, shared cache, MCP query interface |
| 004 | graphify | Knowledge graph (NetworkX + Leiden + EXTRACTED/INFERRED tags) | 002, 003 | Focus graph viz, multimodal, evidence tagging |
| 005 | claudest | Plugin marketplace + claude-memory + token insights | None | Marketplace, plugin discovery |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has CocoIndex for semantic code search, Code Graph MCP for structural queries, Spec Kit Memory for context preservation, and `validate.sh` for spec validation. It does not currently have Codesight-style automated `CLAUDE.md` / `.cursorrules` / `codex.md` / `AGENTS.md` generation from a single project scan, per-AI-tool profile generation, or a blast-radius command built around reverse dependency traversal. Do not describe this repo as lacking semantic search or structural analysis; compare Codesight against the current stack, not a stale baseline.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read `AGENTS.md` guidance first, then inspect the phase folder layout before touching any markdown. If there are no local AGENTS files inside the phase, rely on the repo-root guidance and continue.
3. Start with `external/src/index.ts` before `README.md`. Trace the execution order: project detection, file collection, detector fan-out, contract enrichment, output writing, benchmark reporting, profile generation, MCP startup, and blast-radius mode.
4. Read `external/package.json` immediately after `src/index.ts` to confirm the zero-dependency claim, packaging boundaries, Node version floor, and available CLI scripts (`build`, `test`, `eval`, telemetry, benchmark).
5. Read `external/src/scanner.ts`, `external/src/types.ts`, and `external/src/ast/loader.ts` to understand the framework/ORM catalog, monorepo aggregation logic, and how TypeScript is borrowed dynamically from the scanned project instead of bundled as a dependency.
6. Follow the route-analysis path in this order: `external/src/detectors/routes.ts` -> `external/src/ast/extract-routes.ts` -> any language-specific helpers that matter (`external/src/ast/extract-python.ts`, `external/src/ast/extract-go.ts`) -> `external/src/detectors/contracts.ts`. Trace one framework end to end, preferably Hono or NestJS.
7. Follow the schema-analysis path in this order: `external/src/detectors/schema.ts` -> `external/src/ast/extract-schema.ts` -> language-specific helpers where relevant. Separate AST-backed ORM parsing from regex-only or structured-file parsing.
8. Read `external/src/detectors/graph.ts` and `external/src/detectors/blast-radius.ts` together. Capture how import edges are built, how hot files are ranked, how reverse BFS works, and where blast-radius results are heuristic rather than exact.
9. Read `external/src/mcp-server.ts` in full. Enumerate the exact 8 tools, the session-cache behavior, and how scan reuse changes the AI interaction model compared with the MCP surfaces already present in `Code_Environment/Public`.
10. Read `external/src/generators/ai-config.ts` and `external/src/generators/html-report.ts`. Focus on per-tool profile generation, file-target differences, instruction style, and which parts are content-generation patterns versus presentational extras.
11. Read `external/tests/detectors.test.ts`, `external/src/eval.ts`, `external/eval/README.md`, and the folders inside `external/eval/fixtures/`. Use them to verify which benchmark claims are reproducible, which fixtures exist, and where the README is broader than the measured evidence.
12. Only after the source walkthrough, read `external/README.md`. Treat it as a product narrative and claim inventory: token savings, zero-dependency positioning, MCP story, blast radius, profile generation, and framework/ORM coverage should all be cross-checked against source and fixtures.
13. Use CocoIndex first for concept-based tracing and grep second for exact follow-up checks. When tracing detector implementations, prefer semantic discovery of the relevant subsystem before line-level confirmation.
14. Before deep research begins, ensure the phase folder contains the required Level 3 Spec Kit docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`. Use `@speckit` for markdown authoring when the runtime allows agent delegation; if delegation is unavailable, preserve the same Level 3 document expectations manually.
15. Validate the phase folder with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight" --strict
    ```
16. Run deep research using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external and identify concrete improvements for Code_Environment/Public, especially around AST-based codebase analysis, framework/ORM detector architecture, AI-assistant context file generation, MCP tool design, and per-tool config profile patterns.
    ```
17. Save all substantive outputs under `research/`, especially `research/research.md`. Every finding must cite exact file paths, state whether the evidence is source-confirmed, test-confirmed, or README-level, and classify the recommendation as `adopt now`, `prototype later`, or `reject`.
18. When research completes, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight"
    ```

## 6. Research Questions

1. How does the AST extraction pipeline really work in practice: where does `src/index.ts` hand off to detector modules, when does `src/ast/loader.ts` successfully load project-local TypeScript, and how often do detectors fall back to regex or other structured parsing?
2. Which frameworks are detected by dependency and file heuristics in `src/scanner.ts`, and which of those frameworks receive true AST route extraction versus regex-only detection?
3. How does one full detector pipeline work end to end, such as Hono or NestJS routes: stack detection, file filtering, AST walking, prefix handling, param extraction, middleware capture, contract enrichment, and final output formatting?
4. How are ORM schemas parsed across Drizzle, Prisma, TypeORM, SQLAlchemy, and GORM, and what is the exact split between AST extraction, regex parsing, and language-specific structured helpers?
5. What does Codesight's zero-dependency claim really mean operationally, and what tradeoffs come from borrowing the target project's `typescript` package instead of bundling one?
6. What exact 8 MCP tools are exposed in `src/mcp-server.ts`, how do they share cached scan state, and how does that compare with the current MCP and search surfaces already present in `Code_Environment/Public`?
7. How does the blast-radius algorithm work internally: reverse dependency traversal, max depth, multi-file merge behavior, route/model/middleware overlays, and what blind spots remain because model impact is inferred heuristically?
8. How are per-tool profile files generated in `src/generators/ai-config.ts`, what instructions differ between Claude Code, Cursor, Codex, Copilot, and Windsurf, and which profile patterns are transferable to this repo?
9. What is the role of the dependency graph and hot-file ranking in the broader Codesight story, and could a similar "change carefully" surfacing improve agent behavior in `Code_Environment/Public`?
10. How much of the benchmark and token-savings narrative is supported by `src/eval.ts`, `eval/README.md`, `eval/fixtures/`, and `tests/detectors.test.ts`, and where does the README overreach or generalize beyond the fixture set?
11. What architectural value comes from separating static context generation (`.codesight/` plus profile files) from query-time MCP tools, and how should that boundary inform Public's own context-system design?
12. Which Codesight ideas overlap too heavily with phases `003` and `004`, and which are genuinely unique to this phase because they center on AST detector design, profile generation, and source-driven static context artifacts?

## 7. Do's

- Do trace one complete detector path end to end, preferably Hono or NestJS routes, including AST walk details and fallback behavior.
- Do inspect the MCP tool definitions directly and list the exact 8 tool names rather than repeating the README summary.
- Do study `src/ast/loader.ts` carefully; the zero-dependency claim depends on that implementation detail.
- Do examine the blast-radius algorithm and call out where it is graph-backed versus heuristic.
- Do compare profile outputs across Claude Code, Cursor, Codex, Copilot, and Windsurf rather than treating "AI config generation" as one generic feature.
- Do validate benchmark and token-savings claims against `eval/fixtures/`, `eval/README.md`, and `tests/detectors.test.ts`.
- Do compare Codesight against current `Code_Environment/Public` capabilities so recommendations target real gaps instead of reinventing CocoIndex, Code Graph MCP, or Spec Kit Memory.

## 8. Don'ts

- Do not spend most of the analysis on npm packaging; it is standard and not the differentiator.
- Do not treat README marketing claims as source truth when the code or fixtures prove something narrower.
- Do not conflate Codesight with contextador: this phase is about static context generation and detector architecture, not the self-healing query interface covered by phase `003`.
- Do not ignore the zero-dependency constraint; it shapes AST loading, fallback behavior, and runtime portability.
- Do not describe blast radius as a full semantic impact engine when the implementation is reverse import-graph BFS plus overlays and heuristics.
- Do not assume all listed ORMs or frameworks have equal implementation depth; distinguish AST-backed, regex-backed, and not-yet-deeply-supported paths.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example Finding: Hono route extraction is strongest when AST and prefix tracking both succeed

```text
**Finding: Hono detection combines dependency heuristics with AST-first route extraction and a regex fallback**
- Source: external/src/scanner.ts, external/src/detectors/routes.ts, external/src/ast/extract-routes.ts, external/tests/detectors.test.ts
- What it does: The scanner first marks a project as Hono when the dependency graph includes `hono`. The Hono detector then filters candidate TS/JS files, attempts AST extraction through `extractRoutesAST(...)`, tracks `.use('/prefix', routerVar)` prefixes, extracts params and middleware, and only falls back to regex when TypeScript is unavailable or AST parsing yields no routes.
- Why it matters: This is a concrete pattern for `Code_Environment/Public`: combine cheap stack heuristics with AST-first extraction and explicit fallback instead of pretending every stack gets uniform structural precision.
- Recommendation: adopt now
- Affected area: structural code analysis, future context generation, framework-specific detector design
- Risk/cost: Medium; precision is high for supported AST cases, but fallback paths still need transparent confidence labeling
```

## 10. Constraints

### 10.1 Error Handling

- If AST parsing fails or project-local TypeScript is unavailable, document the fallback path instead of calling the detector "broken."
- If a README claim exceeds what the code or fixtures prove, label it as README-level rather than source-confirmed.
- If a detector appears shallow for a listed framework or ORM, capture that gap explicitly instead of assuming feature parity.
- If benchmark fixtures do not cover a headline claim, state that the claim lacks direct fixture validation in this checkout.

### 10.2 Scope Boundaries

**IN SCOPE**

- AST route extraction pipeline
- framework and ORM detector architecture
- MCP tool design and cache behavior
- profile-based AI config generation
- blast-radius analysis
- dependency graph and hot-file ranking as context features
- benchmark methodology and fixture coverage

**OUT OF SCOPE**

- HTML report styling details
- npm publishing workflow
- generic TypeScript style commentary
- phase `003` self-healing query interface analysis
- phase `004` graph visualization or evidence-tagging analysis

### 10.3 Prioritization Framework

Rank findings in this order: high-impact/low-effort profile-generation patterns to adopt now, high-impact/medium-effort blast-radius and hot-file ideas to prototype later, and clearly out-of-scope or low-signal items such as HTML dashboard polish to reject. Prefer recommendations that complement CocoIndex, Code Graph MCP, and Spec Kit Memory rather than duplicating them.

## 11. Deliverables

- `research/research.md` with at least 5 evidence-backed findings
- each finding cites exact `external/src/` paths and adds `external/tests/` or `external/eval/` paths when validation evidence is relevant
- each finding states evidence type: source-confirmed, test-confirmed, README-level, or mixed
- each finding includes impact on `Code_Environment/Public` plus `adopt now`, `prototype later`, or `reject`
- `implementation-summary.md` created at the end

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE is visible and complete:
  - **Role** is specialized in AST analysis, detector architecture, profile generation, MCP tooling, and blast radius
  - **Instructions** are ordered, path-specific, and force source-before-README analysis
  - **Context** is domain-specific, cross-phase aware, and corrected for current Public capabilities
  - **Constraints** separate source-confirmed behavior from README narrative
  - **Examples** show a realistic Codesight-derived finding with exact repo paths
- at least 5 findings are evidence-backed rather than generic
- cross-phase overlap with `003` and `004` is explicitly bounded
- benchmark claims are checked against fixtures and tests, not repeated uncritically

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with `external/src/index.ts` and only moved to `README.md` after the core source path was understood
- the exact validation command was used for this phase folder
- the exact deep-research topic string appears in the work
- `research/research.md` contains at least 5 evidence-backed findings
- each finding cites exact source paths and labels evidence strength
- checklist updates and `implementation-summary.md` are present
- memory was saved successfully for `002-codesight`
- overlap with phases `003` and `004` is addressed directly
