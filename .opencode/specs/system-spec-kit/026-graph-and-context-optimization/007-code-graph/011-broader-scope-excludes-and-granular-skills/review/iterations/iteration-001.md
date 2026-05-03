## Dimension: correctness

## Files Reviewed (path:line list)

- `.claude/skills/sk-code-review/references/fix-completeness-checklist.md:12-34` - R5 finding classification and matrix/evidence expectations.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14-20` - canonical default exclude globs for skill, agent, command, specs, and plugins.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:63-69` - per-call override detection includes all five scope fields.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:162-189` - env/per-call resolution and source assignment for the five scope fields.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:147-162` - default indexer config appends policy-derived excludes to scan exclude globs.
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:72-90` - `shouldIndexForCodeGraph` rejects default-broad excludes and `.opencode/{skill,agent,command,specs,plugins}` unless policy opts in.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:26-38` - scan args expose `includeSkills`, `includeAgents`, `includeCommands`, `includeSpecs`, and `includePlugins`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:252-259` - scan handler resolves args through the shared policy resolver before building indexer config.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305` - directory walk excludes paths via `shouldIndexForCodeGraph` before glob matching.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1470` - specific-file scans also reject policy-excluded canonical paths.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:288-304` - default config asserts all five `.opencode` folders are excluded and rejected by `shouldIndexForCodeGraph`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:373-397` - table coverage for the four new fields covers default exclusion, env true inclusion, and per-call true overriding env false.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:409-455` - scan handler table coverage for the four new fields covers env true inclusion and per-call false overriding env true.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:580-583` and `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:494-497` - public/schema surfaces expose the four new booleans without independent scan policy logic.

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:373-397` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:409-455` - The requested six-case env/per-call matrix for each of `includeAgents`, `includeCommands`, `includeSpecs`, and `includePlugins` is only partially encoded. Current table coverage proves default exclusion, env true inclusion, per-call true over env false, and per-call false over env true, but it does not enumerate every env/per-call true/false/undefined combination at the scan boundary. Risk is low because `resolveIndexScopePolicy` uses nullish coalescing for all four fields and focused tests passed, but the packet's requested matrix/evidence bar is not fully represented as an explicit regression table.

## Verdict

CONDITIONAL - scan-time exclusion and policy wiring are correct for all five default excludes, with one low-severity matrix-evidence gap in the four new boolean test coverage.
