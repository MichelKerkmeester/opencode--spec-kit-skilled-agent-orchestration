## F14 Fix Report

### Scope
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts`

### Applied Fixes
1. **Catch instanceof narrowing**
   - `hybrid-search.ts`: replaced direct cast access `(_mpabErr as Error).message` with safe narrowing:
     - `const msg = _mpabErr instanceof Error ? _mpabErr.message : String(_mpabErr);`
   - `learned-feedback.ts`: changed bare catch to typed unknown:
     - `catch (_error: unknown)`
   - `retrieval-directives.ts`: changed bare catch to typed unknown:
     - `catch (_error: unknown)`

2. **Missing return types for exported functions**
   - Reviewed all exported functions in the listed files.
   - No additional missing explicit return type annotations were found.

### Validation Summary
- Catch blocks in scope now use `unknown` parameters and safe narrowing before property access where needed.
- Exported functions in scope already had explicit return types; no return-type edits were required.
