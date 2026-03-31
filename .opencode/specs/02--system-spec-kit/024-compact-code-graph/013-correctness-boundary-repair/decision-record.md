---
title: "Decision Record: Correctness & Boundary Repair [024/013]"
description: "Key decisions for endLine heuristic, DB singleton recovery, includeTrace removal, and maxDepth semantics."
---
# Decision Record: Phase 013

## DR-013-A: Brace-Counting Heuristic for endLine

**Decision:** Fix endLine using regex brace-counting, not tree-sitter AST
**Date:** 2026-03-31
**Context:** The endLine bug (all parsers set endLine=startLine) is a P0 blocker for CALLS edge detection and contentHash. Tree-sitter would also fix this but requires Phase 015 (WASM bundles, ~1.5MB).
**Rationale:**
- Brace-counting is ~60 LOC across 3 helpers, zero dependencies
- Tree-sitter is 200+ LOC with external WASM grammars
- The adapter interface (Phase 015) means the heuristic is replaceable
- String literals containing `{}` can shift the count, but this is rare in practice
**Impact:** Unblocks CALLS edge detection for all multi-line functions. Phase 015 tree-sitter will provide exact ranges.

## DR-013-B: Reset Singleton on initDb Failure

**Decision:** On initDb() error, reset both `db` and `dbPath` to null before rethrowing
**Date:** 2026-03-31
**Context:** The module-level singleton pattern means a failed init poisons all subsequent calls. Rethrowing alone leaves dbPath set, which can confuse getDb() callers.
**Rationale:**
- Full reset allows the next initDb() call to retry from scratch
- The alternative (lazy retry inside getDb()) adds complexity to every read path
- better-sqlite3 Database constructor can fail on corrupted files or permission issues
**Impact:** Transient failures (disk full, locked file) are now recoverable without process restart.

## DR-013-C: Remove includeTrace from Schema

**Decision:** Remove `includeTrace` from `code_graph_context` tool schema rather than implement it
**Date:** 2026-03-31
**Context:** Review F033 found includeTrace advertised in the schema but never emitting trace data.
**Rationale:**
- No downstream consumers depend on trace metadata
- Implementing trace (seed chain, expansion steps) adds complexity for unclear value
- If trace is needed later, the schema property can be re-added with a working implementation
**Impact:** Cleaner schema. No behavioral change since the option was already a no-op.

## DR-013-D: Strict maxDepth Boundary (>= not >)

**Decision:** Change transitive BFS depth check from `> maxDepth` to `>= maxDepth`
**Date:** 2026-03-31
**Context:** Review F026 found nodes leaking beyond maxDepth. With `>`, nodes at depth=maxDepth still expanded their edges, adding depth+1 results.
**Rationale:**
- maxDepth=2 should return nodes at depths 0, 1, 2 (inclusive) but not explore from depth=2
- The `>=` check stops expansion at the boundary while keeping boundary nodes in results
- Combined with symbolId deduplication, this eliminates both the leak and duplicate paths
**Impact:** Transitive query results are now bounded and deduplicated as callers expect.
