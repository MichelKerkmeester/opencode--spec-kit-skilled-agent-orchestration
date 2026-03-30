SKIP CONTEXT. SKIP MEMORY. Skip spec folder question — answer D (skip). Do NOT ask any questions. Just implement these 4 changes directly:

1. In `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts`: replace every `__dirname` with `import.meta.dirname`

2. In `.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts`: replace every `__dirname` with `import.meta.dirname`

3. In `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`: find where `main()` is called at the top level (around line 1156) and wrap it so it only runs when executed directly:
```
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain) { main(); }
```

4. In `.opencode/skill/system-spec-kit/shared/package.json`: change the root `"main"` and `"exports"` `"."` entry from `dist/embeddings.js` to `dist/index.js`. Add `"./embeddings": "./dist/embeddings.js"` to exports if not already present.

5. In ALL of these package.json files, ensure engines.node is `>=20.11.0`:
- `.opencode/skill/system-spec-kit/package.json`
- `.opencode/skill/system-spec-kit/scripts/package.json`
- `.opencode/skill/system-spec-kit/shared/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`

After making changes, run: `cd .opencode/skill/system-spec-kit && npm run build --workspace=@spec-kit/shared && npm run build --workspace=@spec-kit/mcp-server`

Just do it. No questions.
