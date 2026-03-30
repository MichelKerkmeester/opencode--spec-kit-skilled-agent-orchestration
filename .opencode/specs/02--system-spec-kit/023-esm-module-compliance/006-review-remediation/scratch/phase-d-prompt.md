SKIP CONTEXT. SKIP MEMORY. Skip spec folder question — answer D. No questions. Just implement:

1. `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` — find per-call `await import(...)` in hot retrieval/read methods (around lines 20, 942). Replace with module-level cached lazy init:
```typescript
let _cached: Awaited<typeof import('./module.js')> | null = null;
async function getModule() { return _cached ??= await import('./module.js'); }
```
Only do this for imports that are always needed on search/read hot paths. Leave genuinely conditional imports alone.

2. `.opencode/skill/system-spec-kit/mcp_server/cli.ts` — move heavy top-level imports (vector-index, checkpoint, access-tracker, mutation-ledger, trigger-matcher, startup-checks — around lines 15-24) into per-command handler functions. Keep type imports and argument parsing at the top level. Make sure `--help` and `--version` don't trigger heavy imports.

Just do it. No questions.
