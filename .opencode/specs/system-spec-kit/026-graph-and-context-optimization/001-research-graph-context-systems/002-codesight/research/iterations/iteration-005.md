# Iteration 5 - Static vs query-time architecture and cross-phase scoping

> Engine note: cli-codex (gpt-5.4 high) stalled again in S sleep state for ~20 minutes after iteration 4. Killed and ran iteration 5 with native Read/Grep tools. The codex throttle appears persistent today (confirmed concurrent codex traffic from another window plus repeated stalls).

## Summary
The "static `.codesight/` files vs query-time MCP tools" split is not really a split: both layers consume the same `ScanResult` data structure, and the MCP server actually re-runs `writeOutput()` to materialize the same static files on cold cache misses, so the static artifacts are a side effect of running the MCP scan, not a separate pipeline. The architectural value of the static layer is that it lets assistants without an MCP connection still read pre-generated context (great for git-committed `CLAUDE.md`/`AGENTS.md`), while the MCP layer adds filtering and on-demand queries on top of the same data. Iteration 2's "no Drizzle index extraction" finding is reconfirmed: `extract-schema.ts` only handles `primaryKey/notNull/unique/default/references` as field flags, with zero matches for `index/Index/uniqueIndex/composite index` patterns. Cross-phase boundaries are now clean: 002-codesight uniquely owns AST detector design, per-tool profile generation, and static artifact emission; 003-contextador owns the self-healing query MCP; 004-graphify owns NetworkX/Leiden graph math.

## Files Read
- `external/src/index.ts:75-175` (scan() pipeline)
- `external/src/index.ts:200-300` (CLI arg parsing + sub-modes)
- `external/src/formatter.ts:1-90` (writeOutput emits 8 static files)
- `external/src/mcp-server.ts:35-99` (cache + getScanResult + toolScan)
- `external/src/ast/extract-schema.ts:130-260` (Drizzle field chain + relations)
- `external/src/ast/extract-schema.ts` (full grep for "index|Index|uniqueIndex|primaryKey")
- `external/src/detectors/schema.ts` (full grep for "index")

## Findings

### Finding 1 - Static `.codesight/` artifacts and the MCP server are projections of the same `ScanResult`, not parallel pipelines
- Source: `external/src/index.ts:75-175`, `external/src/formatter.ts:5-59`, `external/src/mcp-server.ts:45-96`
- What it does: `scan(root, ...)` runs `detectProject` + `collectFiles` + 7 parallel detectors + `enrichRouteContracts`, builds a `ScanResult`, calls `writeOutput(result, outputDir)` twice (once with placeholder token stats, once with real token stats from `calculateTokenStats`). `writeOutput()` in `formatter.ts` emits up to 8 markdown files: `routes.md`, `schema.md`, `components.md`, `libs.md`, `config.md`, `middleware.md`, `graph.md`, and the combined `CODESIGHT.md`. The MCP server's `getScanResult()` (mcp-server.ts:45-85) runs an almost identical pipeline manually inside the server process, then explicitly calls `writeOutput(tempResult, resolve(root, ".codesight"))` so that even MCP-only clients leave the same static files behind on disk. The cache (`cachedResult`/`cachedRoot`) reuses the result for subsequent tool calls until directory changes or `codesight_refresh` clears it.
- Why it matters: For `Code_Environment/Public`, this proves the right primitive is one analysis result projected into multiple surfaces, not two parallel pipelines. The duplication of pipeline code between `scan()` in `index.ts` and `getScanResult()` in `mcp-server.ts` is also a cautionary tale: lifting either one without sharing a common scan function would inherit the same drift risk.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: orchestration pipeline, MCP tool design
- Risk/cost: low - the pattern is small; the lift is mostly about hosting one canonical `scan()` so static and MCP consumers share it.

### Finding 2 - The static artifact set is exactly 8 files, all conditional, with `CODESIGHT.md` as the unconditional combined index
- Source: `external/src/formatter.ts:5-59`
- What it does: `writeOutput()` only emits a per-section markdown file when the matching detector has results: `routes.md` if `routes.length > 0`, `schema.md` if `schemas.length > 0`, `components.md`, `libs.md`, `config.md` (only if `formatConfig` returns a non-empty string), `middleware.md`, `graph.md` (only if `hotFiles.length > 0`). `CODESIGHT.md` is always written as a combined index that links into whichever per-section files exist. Files are simple markdown without frontmatter or machine-owned anchors.
- Why it matters: For `Code_Environment/Public`, this is a small surface to mirror if we want a "scan once, drop assistant-readable artifacts" mode alongside existing Spec Kit Memory and Code Graph MCP. The conditional emission pattern is also worth borrowing: empty sections become absent files, not empty files, so assistants can rely on file existence as a positive signal.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: AI-assistant context generation, static artifact emission
- Risk/cost: low - the formatter is straightforward and easy to namespace under our own output directory.

### Finding 3 - Drizzle index extraction is genuinely absent: only `primaryKey/notNull/unique/default/references` are recognized
- Source: `external/src/ast/extract-schema.ts:132-194` (parseFieldChain), full-file grep for `index|Index|uniqueIndex` (zero matches), `external/src/detectors/schema.ts` full-file grep for `index` (zero matches)
- What it does: `parseFieldChain()` walks chained call expressions and only switches on these methods: `primaryKey` → `pk` flag, `notNull` → `required` flag, `unique` → `unique` flag, `default`/`defaultNow`/`$default`/`$defaultFn` → `default` flag, `references` → `fk` flag plus a `refTarget` extracted from arrow-function bodies. `extractDrizzleRelations()` walks `relations(table, () => ({ ... }))` for `one(...)` and `many(...)` only. Neither file mentions `index()`, `uniqueIndex()`, composite indexes, or any second-positional-argument table constructor metadata where Drizzle stores indexes.
- Why it matters: For `Code_Environment/Public`, this means Codesight's schema output should be treated as a table/column/relation summarizer rather than a full index-aware schema model. If we ever need index/foreign-key constraint awareness for blast-radius or migration planning, that work has to be added on top of Codesight's pattern, not assumed.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: ORM/schema detector architecture
- Risk/cost: medium - adding index extraction is feasible but requires extending both the AST walk and the field-chain switch.

### Finding 4 - The pipeline is duplicated between `scan()` and `getScanResult()`, which is a maintainability tax
- Source: `external/src/index.ts:75-175`, `external/src/mcp-server.ts:45-85`
- What it does: Both `scan()` and `getScanResult()` run `detectProject` + `collectFiles` + the 7 parallel detectors + `enrichRouteContracts`. The differences are: `scan()` respects `userConfig.disableDetectors`, runs plugin detectors and post-processors, prints CLI progress, calls `writeOutput` twice (placeholder then accurate token stats); `getScanResult()` skips the plugin path, uses fixed maxDepth=10, calls `writeOutput` once, caches the result. There is no shared helper.
- Why it matters: For `Code_Environment/Public`, the lesson is to factor any analogous "scan + project" pipeline into a single library function that both the CLI and any future MCP/server entry points call, so that toggles like disabled detectors, plugin hooks, and progress reporting are not silently divergent.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: orchestration pipeline, technical debt avoidance
- Risk/cost: low - it is the kind of refactor that costs nothing if done at the start.

### Finding 5 - Static + MCP coexistence is the right pattern for an AI-context tool, even when both layers come from the same scan
- Source: `external/src/index.ts:435-444` (profile generation), `external/src/index.ts:493-541` (blast-radius mode), `external/src/mcp-server.ts:89-130` (toolScan), `external/src/generators/ai-config.ts:71-158` (assistant file writers)
- What it does: The static layer (`.codesight/` markdown files + `CLAUDE.md`/`.cursorrules`/`codex.md`/`AGENTS.md`/`.github/copilot-instructions.md` from `generateAIConfigs()`) is the always-available, git-committable, no-MCP path that any assistant can read. The MCP layer (8 tools) is the on-demand, filtered, query-time path with a session cache. Both consume the same `ScanResult`, and `toolScan` even regenerates the static `.codesight/` content from the cached scan when called.
- Why it matters: For `Code_Environment/Public`, this confirms a useful design rule: a context-generation system should default to producing static artifacts (so the value is real even without a server running) and treat MCP query tools as a precision overlay on top, not a replacement for the artifacts. This complements Spec Kit Memory (long-term semantic store) and Code Graph MCP (structural queries) by adding a third axis: "always-on stack/route/schema fingerprint."
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: AI-assistant context generation, MCP tool design, system architecture
- Risk/cost: low - the architectural rule is cheap to adopt; the implementation cost lives in the detectors, not the orchestration.

## Static `.codesight/` Artifact Inventory
| Artifact | Purpose | Conditional? | Source |
|----------|---------|--------------|--------|
| `CODESIGHT.md` | Combined index that links into all per-section files | always written | `external/src/formatter.ts:55-58` |
| `routes.md` | Per-framework route table with method, path, params, tags, contract types | only if `routes.length > 0` | `external/src/formatter.ts:13-17,61-89` |
| `schema.md` | Model table with fields, flags, references, relations | only if `schemas.length > 0` | `external/src/formatter.ts:19-23` |
| `components.md` | UI component list with props (when AST available) | only if `components.length > 0` | `external/src/formatter.ts:25-29` |
| `libs.md` | Library/utility file map | only if `libs.length > 0` | `external/src/formatter.ts:31-35` |
| `config.md` | Env vars + config files + dependency lists | only if `formatConfig` returns non-empty | `external/src/formatter.ts:37-41` |
| `middleware.md` | Middleware entries with type and source file | only if `middleware.length > 0` | `external/src/formatter.ts:43-47` |
| `graph.md` | Hot-file ranking + import-edge summary | only if `hotFiles.length > 0` | `external/src/formatter.ts:49-53` |

## Cross-Phase Boundary Table
| Capability | Phase that owns it | Why | Public should... |
|------------|-------------------|-----|------------------|
| AST-first route detection across 14+ frameworks | 002-codesight | `extract-routes.ts` is Codesight's core differentiator | adopt the AST-first + regex-fallback pattern with explicit `confidence` labels |
| Per-tool AI assistant profile generation (CLAUDE/Cursor/Codex/Copilot/Windsurf) | 002-codesight | `generateProfileConfig()` is unique to this phase | adopt the "shared summary + per-tool overlay" split, write into namespaced sections only |
| Static `.codesight/` artifact emission via formatter | 002-codesight | `writeOutput()` materializes git-committable context files | adopt the conditional-emission rule (no file if no data); pick a different output directory |
| Reverse-import BFS blast-radius analysis | 002-codesight (with caveats) | `analyzeBlastRadius()` is here, but graph math overlaps with 004 | borrow the BFS pattern but fix the depth-cap off-by-one (Finding 3 in iter 3); for richer impact, defer to 004's graph math |
| Hot-file ranking by incoming import count | 002-codesight | Trivial scoring, not real graph centrality | borrow only as a "depended-on count" metric; do NOT name it "centrality" |
| Cached `ScanResult` MCP tools (8 tools) | 003-contextador owns query interface; 002 owns scan model | 003 is positioned as the self-healing query layer; 002 is the source of truth | borrow Codesight's narrow tool surface as design inspiration, but build the long-term query layer in 003-contextador, not here |
| NetworkX/Leiden community detection over imports | 004-graphify | Codesight does not implement graph math beyond degree counting | do NOT re-implement community detection in 002; defer to 004 |
| EXTRACTED/INFERRED tagging on graph nodes | 004-graphify | Codesight has no provenance tags on graph entries | do NOT bolt onto Codesight's edge model; let 004 own provenance |
| Plugin marketplace + claude-memory + token insights | 005-claudest | Out of scope for static analysis | not relevant to 002 |

## Drizzle Index Re-Check
- Iteration 2's "no Drizzle index extraction" finding is reconfirmed. Full-file grep on `external/src/ast/extract-schema.ts` for `index|Index|uniqueIndex` returns zero matches; only `primaryKey` is handled (as a `pk` flag in `parseFieldChain` at line 156). Full-file grep on `external/src/detectors/schema.ts` for `index` returns zero matches. The Drizzle path produces tables, fields with flags (`pk`/`required`/`unique`/`default`/`fk`), `refTarget`, and `relations`, but no index/composite-index records.

## Answered Questions
- Q11: answered - `external/src/index.ts:75-175` + `external/src/mcp-server.ts:45-99` show static artifact emission and MCP queries are both projections of the same `ScanResult`; the MCP path even calls `writeOutput()` so static files are a side effect of MCP scans.
- Q12: answered - The boundary table above shows AST detector pipeline + per-tool profile generation + static `.codesight/` emission belong uniquely to 002, while query-time MCP belongs to 003-contextador and graph math belongs to 004-graphify; 005-claudest does not overlap.
- Q4 (re-check): confirmed - Drizzle index extraction is absent in `extract-schema.ts` and `detectors/schema.ts`. Iteration 2's gap finding holds.

## Open Questions / Next Focus
- All 12 key questions are now answered (Q1, Q2, Q3, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12 fully; Q4 has a clear "no index extraction" answer with reconfirmation). Coverage is at 12/12. Composite convergence score is high enough that the loop should STOP and proceed to synthesis. No iteration 6 needed unless synthesis surfaces a new gap.

## Cross-Phase Awareness
This iteration finalized the cross-phase boundary by anchoring AST detector design, per-tool profile generation, and static artifact emission as uniquely Codesight (phase 002), while explicitly assigning the MCP query interface to 003-contextador and graph math to 004-graphify. It avoided 003/004 territory by reading only Codesight's own source files and by defining the boundary as a "do not duplicate" rule for the synthesis phase.

## Metrics
- newInfoRatio: 0.42
- findingsCount: 5
- focus: "iteration 5: static vs query-time + cross-phase scoping"
- status: insight
