SKIP CONTEXT. SKIP MEMORY. Skip spec folder question — answer D. No questions. Just implement:

1. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` — around line 370 where warnings get flattened to "anchor issues" text. Add a `warnings` array to the response object that preserves typed warnings: `{ category: string, message: string }[]`. Keep the existing text field for backward compat. Don't flatten `file-persistence-failed` into `anchor-issues`.

2. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` — around lines 957, 991 where post-commit file write failures are handled. Emit typed warnings with `category: 'file-persistence-failed'` instead of generic anchor text. Pass these to the response builder.

3. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` — there are 3 different `await import('@spec-kit/mcp-server/api...')` call sites (around lines 214, 1139, 1633) with inconsistent error handling. Add a helper at the top of the file:
```typescript
async function tryImportMcpApi<T>(specifier: string, fallback: T): Promise<T> {
  try { return await import(specifier); }
  catch (err) { console.warn(`[workflow] Failed to import ${specifier}:`, (err as Error).message); return fallback; }
}
```
Then refactor all 3 call sites to use it. Keep the same logical behavior (what each site does on failure stays the same), just make the error handling pattern consistent.

4. `.opencode/skill/system-spec-kit/mcp_server/api/index.ts` — grep for all imports of `@spec-kit/mcp-server/api` across the codebase. Then remove re-exports from the barrel that are ONLY used internally within mcp_server (not by scripts/ or other packages). Add comment: `// Public API surface — only export what external consumers need`

Just do it. No questions.
