# Iteration 006: Implementation-Ready Code for Server Instructions + Tool Descriptions

## Focus: Draft exact, implementation-ready TypeScript for `buildServerInstructions()` routing guidance and `code_graph_*` tool description updates, using the existing CocoIndex availability and Code Graph freshness plumbing.

## Code Snippets:

### 1) `buildServerInstructions()` routing section

Drop this into the existing `try` block in `context-server.ts`, immediately after the current Session Recovery lines. This keeps the change additive, reuses the existing `getSessionSnapshot()` dynamic import, and stays within the routing-token budget because it adds only three short routing bullets.

```ts
  try {
    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
    const snap = getSessionSnapshot();
    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
    if (hasData) {
      const recommended = !snap.primed ? 'call session_resume()' :
        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
      const graphReady = snap.graphFreshness === 'fresh';
      const cocoReady = snap.cocoIndexAvailable;

      lines.push('');
      lines.push('## Session Recovery');
      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
      lines.push(`- Code graph: ${snap.graphFreshness}`);
      lines.push(`- Session quality: ${snap.sessionQuality}`);
      lines.push(`- Recommended: ${recommended}`);
      lines.push('');
      lines.push('## Tool Routing');
      lines.push(`- Semantic/code-understanding queries: ${cocoReady ? 'use CocoIndex first' : 'CocoIndex unavailable; fall back to grep/glob for exact text and code_graph_* only when you already know the symbol or file'}.`);
      lines.push(`- Structural questions (callers, imports, impact, neighborhoods): ${graphReady ? 'use code_graph_query or code_graph_context' : 'code graph is not fresh; run code_graph_scan or session_resume before relying on code_graph_*'}.`);
      lines.push('- Exact text, regex, or known-path lookups: use grep/glob.');
    }
  } catch { /* session-snapshot not available — skip digest */ }
```

Why this shape:
- It avoids a new top-level import and matches the current `buildServerInstructions()` style. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:627-645`]
- It reuses `snap.cocoIndexAvailable` and `snap.graphFreshness`, which are already computed by the session snapshot helper. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:53-105`]

### 2) Exact availability/freshness check to use in the routing section

The preferred implementation is to derive both values from `getSessionSnapshot()` because that already centralizes the CocoIndex binary check and graph freshness classification:

```ts
const graphReady = snap.graphFreshness === 'fresh';
const cocoReady = snap.cocoIndexAvailable;
```

If the implementation wants a direct CocoIndex helper call instead of going through the snapshot, this is the exact utility call:

```ts
const { isCocoIndexAvailable } = await import('./lib/utils/cocoindex-path.js');
const cocoReady = isCocoIndexAvailable();
```

The direct helper is safe because `isCocoIndexAvailable()` is only an `existsSync()` check against the resolved `ccc` binary path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:51-59`]

### 3) Updated `code_graph_query` description

Replace the current description string with this version:

```ts
const codeGraphQuery: ToolDefinition = {
  name: 'code_graph_query',
  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph). Use this instead of Grep for structural questions when you already know the file or symbol and need callers, callees, imports, or reverse dependencies. If code_graph_status is stale or empty, run code_graph_scan first; use CocoIndex for semantic discovery when you do not know the symbol yet. Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      operation: { type: 'string', enum: ['outline', 'calls_from', 'calls_to', 'imports_from', 'imports_to'], description: 'Query operation (required)' },
      subject: { type: 'string', minLength: 1, description: 'File path, symbol name, or symbolId to query (required)' },
      edgeType: { type: 'string', description: 'Filter by edge type (optional)' },
      limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Max results' },
      includeTransitive: { type: 'boolean', default: false, description: 'Enable multi-hop BFS traversal (follows edges transitively)' },
      maxDepth: { type: 'number', minimum: 1, maximum: 10, default: 3, description: 'Max traversal depth when includeTransitive is true' },
    },
    required: ['operation', 'subject'],
  },
};
```

### 4) Updated `code_graph_context` description

Replace the current description string with this version:

```ts
const codeGraphContext: ToolDefinition = {
  name: 'code_graph_context',
  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Use this after CocoIndex finds relevant code, or when you need compact structural context/impact around a file or symbol instead of raw text matches. Accepts CocoIndex search results as seeds (provider: cocoindex), manual seeds (provider: manual), or graph seeds (provider: graph). If the code graph is stale or empty, run code_graph_scan first or keep using CocoIndex until refreshed. Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      input: { type: 'string', description: 'Natural language context query' },
      queryMode: { type: 'string', enum: ['neighborhood', 'outline', 'impact'], default: 'neighborhood', description: 'Graph expansion mode' },
      subject: { type: 'string', description: 'Symbol name, fqName, or symbolId' },
      seeds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePath: { type: 'string' },
            startLine: { type: 'number' },
            endLine: { type: 'number' },
            query: { type: 'string' },
            provider: { type: 'string', enum: ['cocoindex', 'manual', 'graph'], description: 'Seed provider type' },
            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
            score: { type: 'number', description: 'CocoIndex relevance score' },
            symbolName: { type: 'string', description: 'Manual seed symbol name' },
            symbolId: { type: 'string', description: 'Graph seed symbol ID' },
          },
        },
        description: 'Seeds from CocoIndex, manual input, or graph lookups',
      },
      budgetTokens: { type: 'number', minimum: 100, maximum: 4000, default: 1200, description: 'Token budget for response' },
      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
    },
    required: [],
  },
};
```

## Findings:

1. `buildServerInstructions()` can absorb routing guidance with no new top-level imports or helper functions. The function already dynamically imports `getSessionSnapshot()` inside its existing `try` block, so the least-risk implementation is to derive `cocoReady` and `graphReady` from `snap.cocoIndexAvailable` and `snap.graphFreshness` rather than adding more startup wiring. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:627-645`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:53-105`]

2. The correct freshness gate for Code Graph routing is `snap.graphFreshness === 'fresh'`, not merely `!== 'error'`. The snapshot classifies graph state as `fresh | stale | empty | error`, and the implementation uses a 24-hour threshold over `graphDb.getStats().lastScanTimestamp`; therefore stale and empty should route to "refresh first" guidance, not "graph available" guidance. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:31-47`]

3. The correct CocoIndex availability signal already exists in session snapshot as `snap.cocoIndexAvailable`, and that field is itself backed by `isCocoIndexAvailable()`. The helper resolves the project root, builds the absolute path to `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`, and returns `existsSync(...)`, so the routing section can trust it as a cheap startup-time availability check. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:70-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:12-13`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:51-59`]

4. The strongest implementation pattern for `code_graph_query` is to turn the description from a passive capability summary into an explicit routing rule: "use this instead of Grep for structural questions when you already know the file or symbol." That directly addresses the current gap where the description lists operations but does not steer the model away from Grep for call/import/dependency questions. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:637-652`]

5. The strongest implementation pattern for `code_graph_context` is to present it as the bridge between semantic discovery and structural expansion: use CocoIndex first to find candidate code, then feed those results into `code_graph_context` for neighborhood or impact context. This matches the existing schema, which already accepts CocoIndex seeds via `provider: 'cocoindex'`, but the current description does not foreground that routing path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:660-693`]

6. The routing text should refer to "CocoIndex" rather than hard-coding a runtime-specific external tool identifier inside server instructions. The MCP server controls only the Spec Kit Memory tool descriptions here, while CocoIndex is registered as a separate provider in `opencode.json`; using the product name keeps the instruction accurate across hook-compatible and non-hook runtimes whose displayed tool names may differ. [SOURCE: `opencode.json:40-49`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:637-693`]

7. The proposed routing section is short enough to fit the prior <200-token guidance budget while still encoding the three essential branches: semantic search -> CocoIndex, structural analysis -> Code Graph, exact text/path -> grep/glob. The lines are deliberately concise and avoid examples or long caveats so they can live alongside the existing memory/session summary without bloating the startup instruction payload. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:619-645`]

## Key Questions Answered:

- Q3: What does `buildServerInstructions()` currently return and how can it be extended with routing rules under 200 tokens?
- Q9: What should the exact wording be for `code_graph_query` and `code_graph_context` so tool descriptions reinforce routing behavior?
- Partial Q10: How to design routing without over-aggressive redirects? Answer: only treat `graphFreshness === 'fresh'` as Code Graph-ready, and keep exact-text/path lookups routed to grep/glob.

## New Information Ratio: 0.42

## Next Focus Recommendation: Validate the enforcement wording against tests and runtime display behavior: add a unit test that `buildServerInstructions()` emits the Tool Routing section under fresh/stale CocoIndex/graph combinations, then inspect whether any runtime-specific instruction files should mirror the exact same three-branch wording for consistency.
