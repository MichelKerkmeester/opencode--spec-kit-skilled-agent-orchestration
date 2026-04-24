## Iteration 01

### Focus

Operation-aware CALLS subject selection, ambiguity warnings, and candidate ranking in `code_graph_query`.

### Files Audited

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:45-170`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:218-350`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:337-451`

### Findings

- `[P1][correctness] .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:45-140 caps ambiguity inspection at the first 10 SQL matches before the operation-aware selector runs, so the improved CALLS ranking still cannot choose the best implementation symbol when the correct candidate sorts after that page.`
- `[P2][tests] .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:337-451 only exercises two-candidate ambiguity cases, so the packet never proves the new selector behaves correctly once the candidate count exceeds the hard limit.`
- `[P2][observability] .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:264-278 reports the total ambiguity count in the warning message, but the selected candidate and exposed candidate list still come from the truncated page, which can mislead operators into assuming the full ambiguity set was ranked.`

### Evidence

```ts
const RESOLVE_SUBJECT_CANDIDATE_LIMIT = 10;

SELECT symbol_id, fq_name, name, kind, file_path, start_line
FROM code_nodes
WHERE ${field} = ?
ORDER BY file_path, start_line, symbol_id
LIMIT ?

const selectedCandidate = rankedCandidates[0] ?? candidates[0];
```

### Recommended Fix

- Page the ambiguous `symbol_id` set first and run `pickOperationAwareCandidate()` across the full match set, or remove the hard cap from ranked ambiguity resolution altogether. Add a regression with more than 10 colliding `handle*` nodes so the intended implementation symbol still wins.
Target files:
`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
`.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`

### Status

new-territory
