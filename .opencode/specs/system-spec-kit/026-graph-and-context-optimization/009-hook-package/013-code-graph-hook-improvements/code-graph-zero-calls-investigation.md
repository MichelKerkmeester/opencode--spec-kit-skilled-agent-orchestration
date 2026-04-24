# Code Graph: Zero Call Edges Investigation

**Date**: 2026-04-24
**Status**: Investigating
**Severity**: P2 — structural call graph incomplete

---

## Issue Summary

Querying `calls_from` and `calls_to` for `handleMemoryContext` (symbolId `0470757d9d3bfdbc`) returns **zero CALLS edges**, despite the function being 527+ lines long and calling 20+ other functions.

---

## Investigation Method

| Approach | Command | Result |
|---|---|---|
| **Code graph — outline** | `code_graph_query(operation='outline', subject='.../memory-context.ts')` | 50 symbols extracted (27 imports, 10 interfaces, 1 type alias) |
| **Code graph — calls_from** | `code_graph_query(operation='calls_from', subject='0470757d9d3bfdbc')` | 0 edges |
| **Code graph — calls_to** | `code_graph_query(operation='calls_to', subject='0470757d9d3bfdbc')` | 0 edges |
| **Code graph — blast_radius** | `code_graph_query(operation='blast_radius', subject='.../memory-context.ts')` | 1 node (self), 0 affected files |
| **Grep** | `rg "memory-context\|handleMemoryContext" --type ts` | 20 files, 90+ matches across source and test files |

---

## Root Cause Analysis

### Finding 1: CALLS edge extraction is regex-based, not AST-based

The structural indexer's CALLS extraction (`structural-indexer.ts:942-973`) uses a **regex pattern** (`/\b(\w+)\s*\(/g`) over the function body text — not tree-sitter AST node traversal:

```typescript
// structural-indexer.ts:947
const callPattern = /\b(\w+)\s*\(/g;
```

This is a heuristic approach with known limitations.

### Finding 2: `handleMemoryContext` symbol kind may not match `callableNodes` filter

The CALLS extractor only operates on nodes where `kind === 'function' || kind === 'method'`:

```typescript
// structural-indexer.ts:944-946
const callableNodes = nodes.filter(
  n => n.kind === 'function' || n.kind === 'method',
);
```

The outline query for `memory-context.ts` returned **zero function nodes** — only `module`, `import`, `interface`, and `type_alias` symbols. This means `handleMemoryContext` was either:
- Not extracted as a `function` kind symbol by the tree-sitter parser
- Extracted with a different kind label (e.g., `variable` for `async function` declarations)

### Finding 3: Tree-sitter parser errors on 10 files in this codebase

The scan reported syntax errors (partial parse) for 10 TypeScript files:

```
Tree contains syntax errors (partial parse)
```

Affected files include:
- `handlers/memory-index-discovery.ts`
- `handlers/quality-loop.ts`
- `lib/chunking/anchor-chunker.ts`
- `lib/chunking/chunk-thinning.ts`
- `lib/merge/anchor-merge-operation.ts`
- `lib/parsing/content-normalizer.ts`
- `lib/parsing/memory-parser.ts`
- `lib/search/anchor-metadata.ts`
- `lib/search/llm-reformulation.ts`
- `lib/search/validation-metadata.ts`

Partial parses may emit incomplete or incorrect symbol kind data, preventing CALLS edge extraction.

### Finding 4: `preferredKinds` resolution is fragile

The CALLS extractor uses `preferredKinds()` to resolve called function names to target symbols:

```typescript
// structural-indexer.ts:963
const target = preferredKinds(calledName, ['function', 'method', 'class', 'variable'], caller.symbolId);
```

If the target function is not extracted with one of these preferred kinds, no edge is created. This is especially problematic when:
- The called function was not parsed (partial parse)
- The function is exported via re-export chain
- The function is dynamically imported

### Finding 5: Cross-file CALLS resolution has no symbol resolution fallback

The regex-based approach extracts caller/called names from the function body but relies on `preferredKinds()` finding a matching symbol in the same file's node set. There is **no cross-file symbol resolution** — if the called function is in another file, the edge is silently dropped.

---

## Evidence Chain

```
handleMemoryContext (line 1196, async function)
  ├── Calls: checkDatabaseUpdated() ✅ (imported, but no CALLS edge)
  ├── Calls: createMCPErrorResponse() ✅ (imported, but no CALLS edge)
  ├── Calls: classifyQueryIntent() ✅ (imported, but no CALLS edge)
  ├── Calls: estimateTokens() ✅ (imported, but no CALLS edge)
  ├── Calls: buildResumeLadder() ✅ (imported, but no CALLS edge)
  └── ... 15+ more calls, all missing from graph
```

Grep confirms all these calls exist in the function body. The graph has zero CALLS edges.

---

## Impact

| Metric | Current | Expected |
|---|---|---|
| CALLS edges for `handleMemoryContext` | 0 | 20+ |
| Files with tree-sitter errors | 10 | 0 |
| Function kind extraction | 0 functions found in 1723-line file | ~5+ functions |
| Blast radius coverage | 1 node (self) | 10+ affected files |

---

## Recommendations

### P0: Fix tree-sitter parse errors

The 10 files with syntax errors need investigation. Likely causes:
- TypeScript features not supported by the tree-sitter grammar version
- JSX/TSX syntax in `.ts` files
- Experimental syntax (decorators, type assertions)

**Action**: Run tree-sitter parse on each file individually and report the specific error nodes.

### P1: Verify function symbol extraction

Check if `handleMemoryContext` appears in the graph at all, and with what `kind` value:

```sql
SELECT symbol_id, name, kind, fq_name, start_line
FROM code_nodes
WHERE name = 'handleMemoryContext';
```

If kind is not `function` or `method`, the CALLS extractor skips it entirely.

### P2: Improve CALLS edge extraction

Options (in order of complexity):
1. **Fix regex to handle `async` functions** — add `async` to keyword skip list if it's being captured as a call target
2. **Use tree-sitter call_expression nodes** — replace regex with AST-based `CallExpression` and `NewExpression` node extraction
3. **Add cross-file symbol resolution** — build a name→symbolId index across all files and resolve call targets globally

### P3: Add call edge validation to scan

After each scan, verify that functions with known calls (via regex sanity check) have corresponding CALLS edges. Report discrepancy count as a scan health metric.

---

## Related Files

- `mcp_server/code-graph/lib/structural-indexer.ts:942-973` — CALLS edge extraction logic
- `mcp_server/code-graph/lib/code-graph-context.ts:190-207` — neighborhood expansion using CALLS edges
- `mcp_server/code-graph/lib/code-graph-db.ts:466` — call_count aggregation query
- `mcp_server/handlers/memory-context.ts:1196` — target function definition
