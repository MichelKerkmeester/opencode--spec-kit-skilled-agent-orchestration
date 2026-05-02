# Iteration 1: Scope Decision and Default Excludes

## Focus
Q1 and Q4: where the code graph scope decision lives today, and which paths are excluded by default.

## Findings
- The scan handler owns user input normalization: `ScanArgs` accepts `rootDir`, `includeGlobs`, `excludeGlobs`, `incremental`, `verify`, and `persistBaseline`, so the current public scan surface can already accept caller-provided exclude additions but has no explicit skill-indexing switch. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:25`.
- The scan handler calls `getDefaultConfig(resolvedRootDir)` and only appends caller excludes afterward, which means default scope begins in `getDefaultConfig()` before tool arguments are applied. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:214` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:216`.
- `getDefaultConfig()` currently includes TypeScript, JavaScript, Python, and shell globs, and excludes `node_modules`, `dist`, `.git`, `vendor`, `external`, `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`. It does not exclude `.opencode/skill`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:137` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:138`.
- The directory walker has a second, unconditional guard: `shouldExcludePath()` returns true when `shouldIndexForCodeGraph(fullPath)` is false, before checking configured exclude patterns. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1298`.
- The unconditional code graph guard lives in the shared index-scope utility. It excludes `external`, `node_modules`, `.git`, `dist`, `vendor`, `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`; it does not exclude `.opencode/skill` broadly. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31` and `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:39`.
- The walker applies default and argument-supplied exclude patterns before `.gitignore` checks, then counts those skips separately as `excludedByDefault`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1419` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1424`.
- Candidate discovery loops through every include glob and calls `findFiles(config.rootDir, pattern, config.excludeGlobs, config.maxFileSizeBytes)`, so any default exclude change affects candidate collection before parse, DB persistence, verification, or query behavior. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2091` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2092`.

## Decisions Made
- The scope decision should be treated as a two-file design point: the static default list in `indexer-types.ts`, and the hard guard in `index-scope.ts`. Rationale: updating only one would leave drift between configured excludes and the walker-level invariant.
- The default exclude path list should add `.opencode/skill/**`, with an explicit carve-out path still to be designed for maintainers. Rationale: current broad skill indexing is caused by the missing top-level skill path in both exclude layers.

## Open Questions Discovered
- Should the opt-in bypass both the static default list and the hard guard, or should the hard guard become flag-aware while `excludeGlobs` stays a reporting/config layer?
- Should the default also exclude `.codex/skills`, `.claude/agents`, `.gemini/agents`, and plugin cache paths, or should this packet stay narrowly scoped to `.opencode/skill`?

## What Worked
Exact path discovery with `find` and targeted `rg` found the live code graph package after the packet's shorthand `mcp_server/lib/code_graph` path missed the actual location.

## What Failed
The literal paths `mcp_server/lib/code_graph/scanner.ts` and `mcp_server/lib/code_graph/exclude-rules.ts` do not exist in this workspace; the equivalent live files are `code_graph/handlers/scan.ts`, `code_graph/lib/indexer-types.ts`, `code_graph/lib/structural-indexer.ts`, and `lib/utils/index-scope.ts`.

## Convergence Signal
narrowing

## Tokens / Confidence
0.86
