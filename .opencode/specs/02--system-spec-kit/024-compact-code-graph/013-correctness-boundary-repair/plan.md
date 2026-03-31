---
title: "Plan: Correctness & Boundary Repair [024/013]"
description: "Implementation order for 15 P0/P1/P2 fixes with zero external dependencies."
---
# Plan: Phase 013 — Correctness & Boundary Repair

## Implementation Order

### Group A: Core correctness (items 1, 7, 8)

1. **Item 1: endLine fix** (60-80 LOC) — highest impact, unblocks CALLS edges
   - Add brace-counting to `parseJsTs()`: track `{` depth after function/class declaration
   - Add indentation tracking to `parsePython()`: detect dedent to original level
   - Add marker tracking to `parseBash()`: match fi/done/esac/}/;;
   - Update `capturesToNodes()` to use corrected endLine in contentHash
   - Verify: `extractEdges()` now scans full function bodies for CALLS

2. **Item 7: Budget ceiling removal + sessionState budgeting** (15-20 LOC)
   - Replace hard-coded 4000 with parameter or default
   - Include sessionState section in allocation (currently bypasses entirely)
   - Verify allocator respects caller-provided budget

3. **Item 8: Merger zero-budget fix** (15-20 LOC)
   - Skip section rendering when `granted === 0`
   - Remove truncation marker outside budget

### Group B: DB safety (items 9, 10, 11, 6)

4. **Item 9: DB init on fresh runtime** (10-15 LOC)
   - Ensure initDb() is called before first scan; auto-create DB if missing
   - Verify code_graph_scan works on first use without prior initialization

5. **Item 10: initDb() migration guard** (15-20 LOC)
   - Wrap schema creation in try/catch
   - Reset module-level singleton on failure so next call retries
   - Verify: failed init → subsequent call retries (no poisoned singleton)

6. **Item 11: Transaction atomicity for replaceNodes/Edges** (15-20 LOC)
   - Wrap DELETE + INSERT in `db.transaction()`
   - If INSERT fails, DELETE is rolled back — file's graph preserved
   - Verify: constraint error in INSERT does not wipe file's nodes

7. **Item 6: Orphan edge cleanup** (20-30 LOC)
   - In `replaceNodes()`: collect deleted symbol IDs before DELETE
   - Add: `DELETE FROM code_edges WHERE target_id IN (?)`
   - Add: `DELETE FROM code_edges WHERE source_id IN (?)`

### Group C: Query correctness (items 12, 13)

8. **Item 12: Fix transitive query maxDepth leak** (15-20 LOC)
   - Add depth check at BFS/DFS traversal boundary
   - Deduplicate nodes by ID for converging paths
   - Verify: query with maxDepth=2 returns exactly 2 hops

9. **Item 13: includeTrace implementation or removal** (10-15 LOC)
   - Option A: implement trace metadata in context handler response
   - Option B: remove includeTrace from tool-schemas.ts + Phase 010 docs
   - Decision at implementation time based on trace value assessment

### Group D: Security & validation (items 4, 5, 15)

10. **Item 4: Tool arg validation via schema validators** (15-20 LOC)
    - Route ALL code-graph tool inputs through `validateToolArgs()` before dispatch
    - Validate rootDir: `path.resolve(rootDir).startsWith(process.cwd())`
    - Return error if validation fails

11. **Item 5: Exception sanitization** (15-20 LOC)
    - Wrap handler try/catch blocks with generic error messages
    - Log full error to stderr, return sanitized message to caller

12. **Item 15: ccc_feedback schema length validation** (5-10 LOC)
    - Enforce `comment` and `resultFile` length limits before disk write

### Group E: Remaining fixes (items 3, 14, 2)

13. **Item 3: Seed identity preservation** (15-20 LOC)
    - Preserve `source` field through seed processing pipeline
    - Ensure seeds retain manual/graph/cocoindex discriminator

14. **Item 14: Working-set-tracker maxFiles fix** (5-10 LOC)
    - Enforce maxFiles at insertion, not at 2x threshold
    - Verify: tracker never exceeds maxFiles count

15. **Item 2: Verify resume profile** (verification only)

## Testing

- Run existing vitest suite: `npx vitest run`
- Verify CALLS edges now detected for multi-line functions
- Verify rootDir validation rejects paths outside workspace
- Verify orphan edges cleaned after re-index
- Verify DB init works on fresh runtime (delete code-graph.sqlite, run scan)
- Verify failed initDb() does not poison singleton (corrupt DB, retry)
- Verify replaceNodes() is atomic (inject constraint error, check nodes preserved)
- Verify transitive query with maxDepth=2 returns exactly 2 hops
- Verify ccc_feedback rejects oversized comment/resultFile
