# Phase 010: CocoIndex Bridge + code_graph_context

## Summary

Implement `code_graph_context`, the LLM-oriented orchestration tool that bridges CocoIndex semantic search results into structural graph neighborhoods. Accepts native CocoIndex MCP result objects as seeds, resolves them to graph nodes, expands structurally, and returns compact context packages optimized for AI consumption.

## What Exists

- CocoIndex Code MCP returns: `file`, `lines`, `snippet`, `score`, `language` per hit
- Phase 009 provides `code_graph_query` for deterministic structural lookups
- Existing response philosophy: profile-driven shaping for LLM consumers (`profile-formatters.ts`)
- Existing envelope style: structured payloads with trace metadata (`search-results.ts`)

## Design Decisions

- **`code_graph_context` is the bridge**: Accepts seeds from any source, expands structurally, returns compact context
- **`code_graph_query` stays deterministic**: Exact structural operations only, no orchestration
- **Native seed acceptance**: CocoIndex MCP results accepted directly — no intermediate conversion required by callers
- **Three query modes**: `neighborhood` (default), `outline` (structure-first), `impact` (reverse dependencies)
- **Two-layer budget**: Tool-local shaping (default 1200 tokens) + outer envelope truncation at compaction

## Seed Types

```typescript
type CodeGraphSeed = CocoIndexSeed | ManualSeed | GraphSeed;

interface CocoIndexSeed {
  provider: 'cocoindex';
  file: string;
  lines: [number, number];
  snippet?: string;
  score?: number;
  language?: string;
}

interface ManualSeed {
  provider: 'manual';
  filePath: string;
  startLine: number;
  endLine: number;
  snippet?: string;
  relevance?: number;
  language?: string;
}

interface GraphSeed {
  provider: 'graph';
  symbolId?: string;
  fqName?: string;
  filePath?: string;
  startLine?: number;
  endLine?: number;
}
```

Internal normalization target:

```typescript
interface ArtifactRef {
  filePath: string;
  startLine: number;
  endLine: number;
  symbolId?: string;
  fqName?: string;
  language?: string;
}
```

## Seed Resolution Order

All seed types normalize to `ArtifactRef` using this resolution chain:

1. **Exact symbol overlap**: Seed line range matches a graph node exactly
2. **Enclosing symbol**: Seed falls within a larger function/class boundary
3. **Nearest file-level outline node**: No containing symbol; anchor to file outline
4. **Raw file anchor**: No graph nodes at all for this file; use file-level reference

## Query Modes

| Mode | Default Edges | Hop Policy | Typical Use |
|------|---------------|------------|-------------|
| `neighborhood` | CALLS, IMPORTS, CONTAINS, optional TESTED_BY | 1 hop | Understand, debug, implementation lookup |
| `outline` | CONTAINS, EXPORTS, ENTRY_POINTS | 0-1 hop | Orientation, repo map, package surface |
| `impact` | reverse CALLS, reverse IMPORTS, ENTRY_POINTS, TESTED_BY | 1 hop default, 2 hop selective | Refactor, blast radius, verification planning |

## MCP Tool Schema

```typescript
interface CodeGraphContextArgs {
  input: string;
  queryMode?: 'neighborhood' | 'outline' | 'impact';
  intent?: 'understand' | 'fix_bug' | 'refactor' | 'add_feature';
  subject?: {
    symbolId?: string;
    fqName?: string;
    filePath?: string;
    position?: { line: number; column: number };
  };
  seeds?: CodeGraphSeed[];
  pathGlobs?: string[];
  languages?: string[];
  maxSeeds?: number;
  maxNodes?: number;
  maxEdges?: number;
  budgetTokens?: number;
  includeOutline?: boolean;
  includeCallers?: boolean;
  includeCallees?: boolean;
  includeImports?: boolean;
  includeTests?: boolean;
  includeTrace?: boolean;
  freshness?: 'prefer_cached' | 'if_stale' | 'rebuild_scope';
  profile?: 'quick' | 'research' | 'debug';
}
```

## Output Format

### Structured Response

```json
{
  "query": { "input": "...", "queryMode": "neighborhood", "intent": "understand" },
  "semanticSeeds": [{ "provider": "cocoindex", "file": "...", "lines": [10, 42], "score": 0.91 }],
  "resolvedAnchors": [{ "artifact": { "filePath": "...", "symbolId": "..." }, "resolution": "enclosing_symbol", "confidence": 0.94 }],
  "graphContext": { "roots": [], "nodes": [], "edges": [], "outline": [], "tests": [] },
  "combinedSummary": "AuthMiddleware.handle is the main request gate...",
  "nextActions": ["Inspect callers of AuthMiddleware.handle"],
  "freshness": { "state": "hot", "partial": false },
  "warnings": []
}
```

### Text Fallback (Compact Brief)

```
Seed: src/auth/middleware.ts:10-42 (CocoIndex score 0.91)
Root: AuthMiddleware.handle() [function]
Called by: auth/routes.ts
Uses: TokenVerifier.verify, SessionStore
Tests: auth.test.ts
Why included: top semantic hit + direct request boundary
```

## Budget Enforcement

| Context | Default Budget | Notes |
|---------|---------------|-------|
| Direct tool call | 1200 tokens | Caller can override via `budgetTokens` |
| Compaction caller | 1200 tokens | Outer 4000-token envelope controls final allocation |
| `outline` mode | 800-1200 tokens | Structure-first, less expansion |
| `neighborhood` mode | 1200-1800 tokens | Default mode |
| `impact` mode | 1800-2500 tokens | Wider reverse expansion |

Truncation order (deterministic):
1. Drop second-hop neighbors
2. Drop sibling symbols
3. Drop semantic analogs
4. Drop tests when not direct evidence
5. Drop import-detail lines (preserve import presence)

Never drop: top seed, resolved root anchor, one boundary edge, one next action.

## What to Build

### 1. `code-graph-context.ts`

Main orchestration handler:
- Parse input + resolve subject/seeds
- Normalize all seeds to `ArtifactRef[]`
- Select query mode behavior
- Execute graph expansion via Phase 009 queries
- Optional: reverse semantic augmentation (graph neighbors → scoped CocoIndex query)
- Apply budget enforcement and truncation
- Format structured + text fallback response

### 2. `seed-resolver.ts`

Seed normalization and graph resolution:
- Accept `CodeGraphSeed[]` → produce `ArtifactRef[]`
- Resolution chain: exact → enclosing → file outline → file anchor
- Deduplication across seeds
- Confidence scoring per resolution

### 3. `context-formatter.ts`

Output formatting:
- Structured JSON response with provenance sections
- Compact text brief (repo-map style)
- Budget-aware truncation with deterministic order

### 4. Tool schema + server integration

- Add `code_graph_context` schema to `tool-schemas.ts`
- Register handler in `context-server.ts`

## Acceptance Criteria

- [ ] `code_graph_context` accepts native CocoIndex MCP result objects in `seeds[]`
- [ ] All seed types (CocoIndex, Manual, Graph) normalize to `ArtifactRef`
- [ ] Seed resolution chain works: exact → enclosing → file outline → file anchor
- [ ] `neighborhood` mode returns 1-hop structural expansion
- [ ] `outline` mode returns file/package structure
- [ ] `impact` mode returns reverse dependencies (callers, importers)
- [ ] Structured output separates semanticSeeds, resolvedAnchors, graphContext
- [ ] Text fallback renders compact repo-map style brief
- [ ] Budget enforcement truncates deterministically within target
- [ ] Tool registered in MCP server and callable by clients

## Files Modified

- NEW: `mcp_server/lib/code-graph/code-graph-context.ts`
- NEW: `mcp_server/lib/code-graph/seed-resolver.ts`
- NEW: `mcp_server/lib/code-graph/context-formatter.ts`
- EDIT: `mcp_server/tool-schemas.ts` (add code_graph_context schema)
- EDIT: `mcp_server/context-server.ts` (register handler)

## LOC Estimate

330-460 lines (context handler + seed resolver + formatter + schema)
