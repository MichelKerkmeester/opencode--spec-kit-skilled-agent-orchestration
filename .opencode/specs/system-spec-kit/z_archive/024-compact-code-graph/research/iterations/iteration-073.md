# Iteration 73: MIGRATION RISK ANALYSIS

## Focus
Deep dive into migration risk for the endLine fix (Phase A) and tree-sitter WASM migration. Iteration 64 identified migration detail as a gap. This iteration answers: What breaks when endLine changes? Is there DB schema migration? What is the rollback plan?

## Findings

### 1. No Tests Depend on the Broken endLine=startLine Behavior
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts]

The existing test file (146 lines) tests `parseFile` and `extractEdges` but **never asserts on endLine values**. Tests check:
- Function/class/interface/import names extracted correctly
- `parseHealth` values (`clean`, `recovered`)
- Edge type existence (`CONTAINS`)
- Node count and kind filtering

No test contains `endLine` in any assertion. This means the endLine fix has **zero risk of breaking existing tests**. The test suite validates node discovery (names, kinds) and edge type creation, not line range accuracy.

### 2. The endLine Bug Has a Cascading Impact on CALLS Edge Extraction
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:290]

Line 290 in `extractEdges()`:
```typescript
const bodyLines = contentLines.slice(caller.startLine - 1, caller.endLine);
```

When `endLine === startLine`, this slice produces exactly **one line** (the declaration line only). For a function spanning 20 lines, all call-site references in lines 2-20 are invisible. This means CALLS edges are systematically **under-detected** -- the graph only finds calls that happen to appear on the declaration line itself. Fixing endLine will immediately produce more CALLS edges, which is a behavioral change but a **correctness improvement**.

### 3. The contentHash Bug Compounds the endLine Bug
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:190]

Line 190:
```typescript
contentHash: generateContentHash(content.split('\n').slice(c.startLine - 1, c.endLine).join('\n')),
```

With `endLine === startLine`, the hash covers only the declaration line. When endLine is fixed, **every node's contentHash will change** even if the source file hasn't changed. This means:
- `isFileStale()` comparison in `code-graph-db.ts:172` works at the **file level** (compares file content hash), not per-node, so it won't cause spurious re-indexing
- But the per-node `content_hash` stored in `code_nodes` will change after a re-index, which is correct behavior (the hash should reflect the actual symbol body)
- A full re-index after the fix is needed to update all contentHash values

### 4. DB Schema Does NOT Need Migration -- SCHEMA_VERSION=1 with No Migration System
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:17-68]

The DB has `SCHEMA_VERSION = 1` (line 17) and `CREATE TABLE IF NOT EXISTS` (lines 20-68). There is **no migration system**:
- No `schema_version` table in the database
- No `SCHEMA_VERSION` check at startup
- No ALTER TABLE migrations
- The constant is only used in `getStats()` (line 278) as a response field

The endLine fix changes data **values** (endLine numbers, contentHash), not schema **structure**. The existing `end_line INTEGER NOT NULL` column (line 41) already stores the correct data type. A simple `code_graph_scan({ force: true })` after deploying the fix will re-populate all values correctly. No schema migration needed.

### 5. Seed Resolver Has a Dependency on Correct endLine for Enclosing-Symbol Resolution
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:196-198]

The enclosing symbol query:
```sql
WHERE file_path = ? AND start_line <= ? AND end_line >= ?
ORDER BY (end_line - start_line) ASC
```

With the current bug (endLine=startLine), this query **cannot find enclosing symbols** for any line other than the exact declaration line. The `end_line >= ?` condition fails for all lines inside function bodies. This means:
- CocoIndex seeds pointing to line 15 of a function spanning lines 10-30 currently fail to resolve to that function
- After the fix, enclosing-symbol resolution will work correctly
- This is a major quality improvement for code_graph_context, not a regression risk

### 6. Safe Migration Path: Force Re-index After Deploy, No Parallel Parser Needed
[INFERENCE: based on findings 1-5 and code-graph-db.ts architecture]

The migration is safe because:
1. **No schema change** -- same columns, same types, just better values
2. **No test breakage** -- no tests assert on endLine values
3. **Idempotent re-index** -- `replaceNodes()` (line 127-147) deletes all existing nodes for a file and re-inserts, so a force re-index is non-destructive
4. **Transactional writes** -- `replaceNodes()` and `replaceEdges()` both use `d.transaction()` (lines 137, 163), so partial failures are safe
5. **Recommended migration steps**:
   - Deploy the endLine fix to `structural-indexer.ts`
   - Run `code_graph_scan({ force: true })` -- this re-indexes all files
   - The `replaceNodes()` DELETE+INSERT pattern means old data is cleanly replaced
   - No need for parallel parsers (regex + tree-sitter) during Phase A

**Running parallel parsers (regex old vs regex new) for validation** is unnecessary for Phase A because:
- The fix is deterministic (brace-counting or indentation-based)
- Validation can be done via test cases that assert correct endLine values
- The existing `getStats()` function can verify node counts haven't decreased

### 7. Tree-Sitter WASM Rollback Plan: The Regex Parser Remains as Permanent Fallback
[INFERENCE: based on structural-indexer.ts architecture and iteration 066 adapter design]

For the tree-sitter migration (Phase C), the rollback plan is straightforward:
- Iteration 066 designed a `ParseResult` adapter interface -- the regex parser already produces `ParseResult`, so it remains as a built-in fallback
- The tree-sitter migration is opt-in per language (Phase C2: optional, Phase C3: default, Phase C4: regex removal)
- Phase C4 (regex removal) should not happen until tree-sitter has been stable for multiple release cycles
- If tree-sitter WASM fails to load (missing .wasm file, memory issues, Node.js version incompatibility), the adapter falls back to regex automatically
- The WASM binaries (~1.5MB per iteration 066's revised estimate) are loaded lazily, so non-WASM environments just use regex

### 8. The 255-Item Checklist Is at Zero Risk from Phase A
[INFERENCE: based on findings 1-4 and code_graph_scan behavior]

The checklist (from code_graph_status) counts files, nodes, edges, and parse health. After the endLine fix:
- **File count**: unchanged (same files indexed)
- **Node count**: unchanged (same regex patterns, same symbols detected)
- **Edge count**: will **increase** (CALLS edges now scan full function bodies instead of just declaration lines)
- **Parse health**: unchanged (same error recovery logic)
- **Node kinds**: unchanged (same kind extraction)

The only metric that changes is edge count (upward), which is a quality improvement. The checklist validates completeness, not exact edge counts.

## Ruled Out
- Parallel parser validation for Phase A (unnecessary -- deterministic fix, test-coverable)
- Schema migration tooling (no schema change needed)
- DB version tracking system (useful long-term but not blocking for Phase A)

## Dead Ends
- None -- all investigated paths yielded useful findings

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (full file, 339 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts` (lines 275-325)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts` (lines 190-235)
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts` (full file, 146 lines)
- Grep across entire mcp_server directory for endLine/end_line references (57 hits across 9 files)

## Assessment
- New information ratio: 0.72
- Questions addressed: All 6 sub-questions from the iteration focus
- Questions answered:
  - Risk of breaking the 255-item checklist during Phase A: ZERO (only edge count increases)
  - Tests that depend on broken endLine behavior: NONE
  - DB schema migration needed: NO (data values change, not schema structure)
  - Schema version system: EXISTS as constant but NOT wired (no migration logic)
  - Safe migration path: Force re-index after deploy, transactional replaceNodes
  - Rollback plan for tree-sitter: Regex parser stays as permanent fallback via adapter interface

## Reflection
- What worked and why: Direct source code reading of all 4 critical files (DB, indexer, tests, seed-resolver) revealed the complete dependency chain. The test file reading was especially high-value because it proved definitively that no tests assert on endLine, eliminating the primary migration risk concern.
- What did not work and why: N/A -- all investigation paths were productive.
- What I would do differently: Could have started with the test file first to immediately quantify breakage risk, then focused only on the DB schema question. This would have been more efficient.

## Recommended Next Focus
Error telemetry and observability design (from strategy "Next Focus"): How should errors from the code graph system be surfaced to users? Current stderr logging is invisible. Design structured error reporting patterns for MCP tool responses and health summaries. Then final consolidation synthesis.
