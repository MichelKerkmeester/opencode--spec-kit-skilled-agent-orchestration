I audited the active server at `.opencode/skill/system-spec-kit/mcp_server` because the prompt’s `.opencode/mcp/memory-mcp-server/` path does not exist in this checkout.

**Findings**
1. SEVERITY: P0  
FILE: [context-server.ts#L755](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)  
ISSUE: Default startup can abort before serving if API-key validation reports any transient network failure.  
EVIDENCE: `if (!validation.valid) { ... process.exit(1); }`; running `node dist/context-server.js` exited with `FATAL: Cannot start MCP server with invalid API key` after `Network error during validation: fetch failed`.

2. SEVERITY: P1  
FILE: [factory.ts#L434](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts#L434)  
ISSUE: Transient timeout/network errors are classified as `valid: false`, so the caller cannot distinguish “bad key” from “validation could not reach provider.”  
EVIDENCE: timeout path returns `{ valid: false, errorCode: 'E053' }`; generic network path also returns `{ valid: false, error: 'Network error during validation: ...' }`.

3. SEVERITY: P1  
FILE: [quality-loop.ts#L597](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts#L597)  
ISSUE: The quality loop claims it tracks the “best state” so worse auto-fixes can be reverted, but the saved best content/attempt are never used. Rejected responses can therefore return a worse final mutation than the best attempt discovered.  
EVIDENCE: `bestContent` / `bestAttempt` are updated at lines 617-618, but the function returns `currentContent` on both success and rejection at lines 630 and 656.

4. SEVERITY: P2  
FILE: [archival-manager.ts#L455](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L455)  
ISSUE: Dead code path: `rebuildVectorOnUnarchive` is defined but never called.  
EVIDENCE: ESLint flags it as unused, and `unarchiveMemory()` calls `syncVectorOnUnarchive()` at line 618 instead.

5. SEVERITY: P2  
FILE: [retry-manager.ts#L46](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L46)  
ISSUE: Empty interface wrapper adds no behavior and fails the lint gate.  
EVIDENCE: `interface RetryHealthSnapshot extends EmbeddingRetryStats {}` triggers `@typescript-eslint/no-empty-object-type`.

6. SEVERITY: P2  
FILE: [causal-edges.ts#L7](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L7)  
ISSUE: Unused import indicates stale dead code in the causal-edge storage path.  
EVIDENCE: `clearDegreeCache` is imported, but only `clearDegreeCacheForDb` is referenced.

7. SEVERITY: P2  
FILE: [checkpoints.ts#L405](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L405)  
ISSUE: Unused helper remains in the checkpoint module and fails the lint gate.  
EVIDENCE: `deleteRowsByClauses(...)` is defined here and not referenced elsewhere in the file.

8. SEVERITY: P2  
FILE: [k-value-analysis.ts#L692](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts#L692)  
ISSUE: Style-only defect still blocks `npm run check`, so the release gate is red.  
EVIDENCE: `let globalSumNdcg: Record<number, number> = {};` is never reassigned and fails `prefer-const`.

9. SEVERITY: P2  
FILE: [vector-index-mutations.ts#L104](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L104)  
ISSUE: Explicit unfinished-work marker remains in production code.  
EVIDENCE: `// TODO(vector-index): Keep these mutation-local extensions until appendOnly and canonicalFilePath semantics are shared...`

**Summary**
P0: 1  
P1: 2  
P2: 6

Verification notes: `npx tsc --noEmit` passed, `npm test` passed, but `npm run check` failed on the listed lint issues. I did not find a tool-manifest/dispatcher mismatch: the server advertises 33 tools and dispatches 33 tools. I also did not find a clear SQL syntax failure in the current schema/query paths; foreign keys are enabled and the regression suite covering migrations/indexing passed.
