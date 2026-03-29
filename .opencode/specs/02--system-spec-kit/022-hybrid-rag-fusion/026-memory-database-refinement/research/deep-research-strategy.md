# Deep Research Strategy

## Topic
Further refinement opportunities in the Spec Kit Memory MCP server codebase, building on the completed 30-iteration audit (121 findings) + 10-iteration meta-review (29 findings, all fixed). Test suite at 8,858. Looking for remaining edge cases, performance improvements, and architectural refinements beyond what the audit covered.

## Research Charter
- **Goal**: Identify remaining improvement opportunities that weren't caught by the 40-iteration review process
- **Non-goals**: Re-auditing already-fixed findings, re-running the same review dimensions
- **Stop conditions**: All key questions answered or diminishing returns after 5 iterations

## Key Questions
- [ ] Q1: Are there any remaining concurrency hazards in the save pipeline or checkpoint lifecycle that the audit missed?
- [ ] Q2: What performance bottlenecks exist in the hybrid search pipeline (token counting, fallback cascades, BM25 rebuild)?
- [ ] Q3: Are there any SQLite query patterns that would benefit from index optimization or prepared statement caching?
- [ ] Q4: What error recovery gaps exist — can any handler leave the database in an inconsistent state after a partial failure?
- [ ] Q5: Are there any dead code paths, unused exports, or orphaned test helpers that accumulated during the 4 fix sprints?

## Known Context
- 30-iteration audit: 121 findings (5 P0, 75 P1, 41 P2) — all fixed
- 10-iteration meta-review: 29 findings (1 P0, 17 P1, 11 P2) — all fixed in Phase 12
- Test suite: 8,858 passing, 332/335 files, tsc clean
- MCP server: 70K+ LOC TypeScript, 31 tools, 57-column schema, hybrid search, causal graph, FSRS scheduling
- Key files: handlers/ (13 files), lib/ (search, storage, parsing, graph, eval, config, cache, chunking, learning, response, errors)
- Prior review dimensions: save pipeline, transactions, causal graph, hybrid search, embeddings, chunking, lineage, schema, feature flags, parsing, checkpoints, shared memory, FSRS, reconsolidation, query routing, errors, index scan, graph signals, eval, concurrency

## Next Focus
Iteration 2 should stay on Q1, but shift from the main save/checkpoint/shared-memory surfaces to adjacent lifecycle paths that can still overlap them:
- background and async mutation paths (`memory-ingest`, job queue, access-tracker flushes) that may run during restore/rebind windows
- any remaining shared-memory authorization TOCTOU edges, especially checks performed outside the write transaction
- DB rebind plus long-running task interactions where module-global state can survive across a connection swap

After that pass, move to Q2 only if no additional lifecycle/concurrency hazards surface.

## Configuration
- Max iterations: 5
- Convergence threshold: 0.05
