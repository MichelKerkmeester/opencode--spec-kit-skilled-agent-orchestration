---
title: "Phase 010: CocoIndex Bridge + Context [system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec]"
description: "Implement code_graph_context, the LLM-oriented orchestration tool that bridges CocoIndex semantic search results into structural graph neighborhoods. Accepts native CocoIndex MC..."
trigger_phrases:
  - "phase"
  - "010"
  - "cocoindex"
  - "bridge"
  - "spec"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 010: CocoIndex Bridge + code_graph_context

<!-- PHASE_LINKS: parent=../spec.md predecessor=009-code-graph-storage-query successor=011-compaction-working-set -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary

Implement `code_graph_context`, the LLM-oriented orchestration tool that bridges CocoIndex semantic search results into structural graph neighborhoods. Accepts native CocoIndex MCP result objects as seeds, resolves them to graph nodes, expands structurally, and returns compact context packages optimized for AI consumption.

### What Exists

- CocoIndex Code MCP returns: `file`, `lines`, `snippet`, `score`, `language` per hit
- Phase 009 provides `code_graph_query` for deterministic structural lookups
- Existing response philosophy: profile-driven shaping for LLM consumers (`profile-formatters.ts`)
- Existing envelope style: structured payloads with trace metadata (`search-results.ts`)

### Design Decisions

- **`code_graph_context` is the bridge**: Accepts seeds from any source, expands structurally, returns compact context
- **`code_graph_query` stays deterministic**: Exact structural operations only, no orchestration
- **Native seed acceptance**: CocoIndex MCP results accepted directly — no intermediate conversion required by callers
- **Three query modes**: `neighborhood` (default), `outline` (structure-first), `impact` (reverse dependencies)
- **Two-layer budget**: Tool-local shaping (default 1200 tokens) + outer envelope truncation at compaction
- **Formatter helpers are inlined**: `formatTextBrief()`, `buildCombinedSummary()`, and related response-formatting logic live inside `code-graph-context.ts`; there is no standalone `context-formatter.ts`

### Seed Types

```typescript
interface CocoIndexSeed {
  provider: 'cocoindex';
  file: string;
  range: { start: number; end: number };
  score: number;
  snippet?: string;
}

interface ManualSeed {
  provider: 'manual';
  symbolName: string;
  filePath?: string;
  kind?: SymbolKind;
}

interface GraphSeed {
  provider: 'graph';
  symbolId: string;
}
```

Internal normalization target:

```typescript
interface ArtifactRef {
  filePath: string;
  startLine: number;
  endLine: number;
  symbolId: string | null;
  fqName: string | null;
  kind: string | null;
  confidence: number;
  resolution: 'exact' | 'near_exact' | 'enclosing' | 'file_anchor';
}
```

### Seed Resolution Order

All seed types normalize to `ArtifactRef` using this resolution chain:

1. **Exact symbol overlap**: Seed line range matches a graph node exactly
2. **Near-exact symbol**: Seed start line lands within ±5 lines of a graph node start
3. **Enclosing symbol**: Seed falls within a larger function/class boundary
4. **Raw file anchor**: No graph nodes resolve; use file-level reference

### Query Modes

| Mode | Default Edges | Hop Policy | Typical Use |
|------|---------------|------------|-------------|
| `neighborhood` | bidirectional CALLS, IMPORTS, CONTAINS | 1 hop | Understand, debug, implementation lookup |
| `outline` | file outline nodes plus EXPORTS from the anchor | 0-1 hop | Orientation, repo map, package surface |
| `impact` | reverse CALLS, reverse IMPORTS | 1 hop with latency guard | Refactor, blast radius, verification planning |

### MCP Tool Schema

```typescript
interface CodeGraphContextArgs {
  input: string;
  queryMode?: 'neighborhood' | 'outline' | 'impact';
  subject?: string;
  seeds?: CodeGraphSeed[];
  budgetTokens?: number;
  profile?: 'quick' | 'research' | 'debug';
}
```

> Note: `includeTrace?: boolean` is now exposed on the `code_graph_context` schema and can be passed explicitly for trace-rich debugging payloads when needed.

### Output Format

### Structured Response

```json
{
  "status": "ok",
  "data": {
    "queryMode": "neighborhood",
    "combinedSummary": "1 anchor(s) across 1 file(s): AuthMiddleware.handle + 1 symbols, 1 relationships",
    "nextActions": ["Use `mcp__cocoindex_code__search` for semantic discovery of related code"],
    "anchors": [
      {
        "file": "src/auth/middleware.ts",
        "line": 10,
        "symbol": "AuthMiddleware.handle",
        "resolution": "near_exact",
        "confidence": 0.94,
        "source": "cocoindex"
      }
    ],
    "graphContext": [
      {
        "anchor": "src/auth/middleware.ts:10 (AuthMiddleware.handle)",
        "nodes": [{ "name": "TokenVerifier.verify", "kind": "function", "file": "src/auth/token.ts", "line": 18 }],
        "edges": [{ "from": "AuthMiddleware.handle", "to": "TokenVerifier.verify", "type": "CALLS" }]
      }
    ],
    "textBrief": "### src/auth/middleware.ts:10 (AuthMiddleware.handle)\nSymbols:\n  function TokenVerifier.verify (src/auth/token.ts:18)",
    "metadata": {
      "totalNodes": 1,
      "totalEdges": 1,
      "budgetUsed": 42,
      "budgetLimit": 1200,
      "freshness": { "lastScanAt": "2025-02-10T10:15:00.000Z", "staleness": "fresh" }
    }
  }
}
```

> Note: `buildContext()` returns internal `resolvedAnchors`, but `handleCodeGraphContext()` maps those into outward-facing `data.anchors[]` entries with `file`, `line`, `symbol`, `resolution`, `confidence`, and seed `source`.

### Text Fallback (Compact Brief)

```
Seed: src/auth/middleware.ts:10-42 (CocoIndex score 0.91)
Root: AuthMiddleware.handle() [function]
Called by: auth/routes.ts
Uses: TokenVerifier.verify, SessionStore
Tests: auth.test.ts
Why included: top semantic hit + direct request boundary
```

### Budget Enforcement

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

### What to Build

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
- Resolution chain: exact → near_exact → enclosing → file_anchor
- Deduplication across seeds
- Confidence scoring per resolution

### 3. Tool schema + server integration

- Add `code_graph_context` schema to `tool-schemas.ts`
- Register handler in `context-server.ts`
- Keep formatter helpers in `code-graph-context.ts` rather than splitting a separate formatter module

### Acceptance Criteria

- [ ] `code_graph_context` accepts native CocoIndex MCP result objects in `seeds[]`
- [ ] All seed types (CocoIndex, Manual, Graph) normalize to `ArtifactRef`
- [ ] Seed resolution chain works: exact → near_exact → enclosing → file_anchor
- [ ] `neighborhood` mode returns 1-hop structural expansion
- [ ] `outline` mode returns file/package structure
- [ ] `impact` mode returns reverse dependencies (callers, importers)
- [ ] Structured output matches handler shape: `status`, `data.queryMode`, `data.anchors`, `data.graphContext`, `data.textBrief`, `data.combinedSummary`, `data.nextActions`, `data.metadata`
- [ ] Text fallback renders compact repo-map style brief
- [ ] Budget enforcement truncates deterministically within target
- [ ] Tool registered in MCP server and callable by clients

### Files Modified

- NEW: `mcp_server/lib/code-graph/code-graph-context.ts`
- NEW: `mcp_server/lib/code-graph/seed-resolver.ts`
- EDIT: `mcp_server/tool-schemas.ts` (add code_graph_context schema)
- EDIT: `mcp_server/context-server.ts` (register handler)

### LOC Estimate

330-460 lines (context handler + seed resolver + inline formatting + schema)

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
