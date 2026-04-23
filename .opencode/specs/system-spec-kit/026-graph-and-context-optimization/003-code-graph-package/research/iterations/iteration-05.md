## Iteration 05
### Focus
Selective reindex efficiency and whether stale-file refresh actually narrows the filesystem walk.

### Findings
- For selective reindex, `ensure-ready` converts absolute stale file paths into root-relative strings and stores them in `config.includeGlobs`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:324-329`.
- `findFiles()` only special-cases patterns that look like `*.ext`; exact relative file paths do not match that parser, so `targetExt` becomes `null` and the walker recursively traverses the entire tree. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1185-1233`.
- `indexFiles()` still avoids re-parsing fresh files because `skipFreshFiles` defaults to `true`, but the expensive recursive directory walk and `.gitignore` evaluation still happen repo-wide, which weakens the “bounded inline refresh” promise for stale readers. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1235-1260`.
- The top-level README claims selective refresh parses only the necessary stale files, but the implementation currently narrows parse work more than discovery work. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md:157-184`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:324-329`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1185-1233`.

### New Questions
- Should selective reindex bypass glob walking entirely and parse the stale-file list directly?
- Would a dedicated `indexSpecificFiles()` helper be safer than overloading `includeGlobs` with exact paths?
- Do current large-repo benchmarks show filesystem walk time dominating stale refresh latency?

### Status
converging
