You are running iteration 8 of 12 in a deep-research loop on code-graph resilience. Iterations 1-7 already converged with 4 mandatory assets and a synthesis at `research/research.md` + `decision-record.md`. Iterations 8-12 extend the loop into concrete backend implementation design.

# Iteration 8 — Content-Hash Staleness Predicate Integration

## Goal

Design the patch that adds content-hash as a freshness signal alongside mtime in `isFileStale()`. The content_hash column already exists in `code_files` and `code_nodes` (per iteration 2 finding) but is not used for stale-gating. Produce a concrete, citation-grounded patch plan.

## Research Questions
- Q11A: What is the precise current shape of `isFileStale()` and its callers?
- Q11B: What is the cost profile for hashing on a stale check? Should hashing be lazy (only when mtime equal but suspicious) or eager?
- Q11C: How does the current persistence path produce content_hash? Can the stale predicate read it without re-hashing live files?
- Q11D: What is the minimal patch surface? List exact file:line ranges that need modification.
- Q11E: What is the fallback behavior when content_hash is missing for legacy rows?

## Required reads
1. `research/research.md` (synthesis) and `assets/staleness-model.md`
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` — focus on `isFileStale`, `getStaleFiles`, schema for `code_files.content_hash`
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` — readiness flow that calls the stale predicate
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` — where content_hash is computed and persisted (look for `crypto`, `createHash`, `sha256`)
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` — scan flow

## What to look for
- Exact function body of `isFileStale()` and how mtime comparison happens today
- Where content_hash is computed during scan (which function, what algorithm, what input)
- Whether content_hash for a candidate file requires reading the file (Yes → cost scaled by file size)
- Performance trade-off: hash-on-every-stale-check vs. hash-only-when-mtime-tied
- Migration: how do legacy rows (pre-content-hash schema) get a hash? On-demand backfill via scan?

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-008.md`

Required sections:
- **Summary** (3-5 sentences)
- **Current Stale Predicate** (function body + caller list with file:line citations)
- **Content-Hash Production Path** (where hashes are written today)
- **Proposed Predicate** (concrete pseudocode with mtime+hash logic + fallback)
- **Patch Surface** (exact file:line ranges per change, minimum 4 patch points)
- **Performance Analysis** (cost per stale-check before/after, with reasoning)
- **Migration Path** (how legacy rows are backfilled)
- **Test Plan** (unit + integration tests that prove the new predicate works)
- **Files Reviewed**
- **Convergence Signals**

### 2. Delta JSON
Path: `research/deltas/iteration-008.json`. Schema with `research_questions_answered: ["Q11A", "Q11B", "Q11C", "Q11D", "Q11E"]`, `iteration: 8`, `focus: "content-hash predicate integration"`.

### 3. State log append
JSONL line to `research/deep-research-state.jsonl` with `iteration: 8`, `status: "insight"`, citations array.

## Constraints
- Read-only research. Do not edit code under `.opencode/skill/system-spec-kit/mcp_server/`.
- Pseudocode is acceptable; do not write actual TS patches yet.
- Every claim about current behavior MUST cite a file:line range that you actually inspected.
- Minimum 8 distinct file:line citations across the iteration markdown.
