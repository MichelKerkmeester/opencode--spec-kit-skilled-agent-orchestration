---
title: "Implementation Plan: Memory Database Refinement"
description: "20-iteration deep-research --review audit plan for the Spec Kit Memory MCP server, covering save pipeline, transactions, causal graph, hybrid search, embeddings, chunking, lineage, schema, feature flags, parsing, checkpoints, shared memory, FSRS, reconsolidation, query routing, error handling, index scan, graph signals, eval framework, and cross-cutting concurrency."
trigger_phrases:
  - "memory database refinement plan"
  - "deep research review plan"
  - "mcp server audit plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Memory Database Refinement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, better-sqlite3, sqlite-vec |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite (context-index.sqlite, speckit-eval.db) |
| **Testing** | Vitest, manual runtime probes |

### Overview
This plan configures a 20-iteration `/spec_kit:deep-research:review:auto` run against the full `mcp_server/` surface. Each iteration reviews one dimension from the spec, produces P0/P1/P2 findings, and logs them to `review/iterations/iteration-NNN.md`. The final synthesis produces `review/review-report.md` with a ranked findings table.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (CocoIndex MCP, repo DB)

### Definition of Done
- [ ] All 20 iterations complete (or early convergence documented)
- [ ] Final `review/review-report.md` exists with ranked findings
- [ ] Each P0 finding has file path, code citation, and fix recommendation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Autonomous deep-research review loop with externalized state. Each iteration gets a fresh context window, reads the strategy and prior state, reviews one dimension, and appends findings to the JSONL state file.

### Key Components
- **Review strategy** (`review/deep-research-strategy.md`): Maps 20 dimensions to iteration slots with priority ordering.
- **State file** (`review/deep-research-state.jsonl`): Append-only log of iteration results, convergence signals, and findings counts.
- **Iteration artifacts** (`review/iterations/iteration-NNN.md`): Per-iteration findings with severity, file paths, and fix recommendations.
- **Final synthesis** (`review/review-report.md`): Ranked findings table grouped by severity and dimension.

### Deep-Research Review Configuration

| Parameter | Value |
|-----------|-------|
| **Mode** | `--review` |
| **Iterations** | 20 |
| **Execution** | `:auto` (autonomous) |
| **Target** | `.opencode/skill/system-spec-kit/mcp_server/` |
| **Spec folder** | `026-memory-database-refinement` |
| **Convergence** | Disabled (force all 20 iterations for full coverage) |

### Iteration-to-Dimension Mapping

| Iter | Dimension | Priority Files |
|------|-----------|----------------|
| 001 | Save pipeline integrity | `handlers/memory-save.ts`, `pe-gating.ts`, `quality-loop.ts` |
| 002 | Transaction safety | `lib/storage/transaction-manager.ts`, `vector-index-mutations.ts` |
| 003 | Causal graph correctness | `lib/storage/causal-edges.ts`, `handlers/causal-graph.ts` |
| 004 | Hybrid search pipeline | `lib/search/hybrid-search.ts`, `bm25-index.ts`, `sqlite-fts.ts` |
| 005 | Embedding lifecycle | `lib/providers/embeddings.ts`, `lib/cache/embedding-cache.ts` |
| 006 | Chunking and thinning | `handlers/chunking-orchestrator.ts` |
| 007 | Lineage and versioning | `lib/storage/lineage-state.ts` |
| 008 | Schema migrations | `lib/search/vector-index-schema.ts` |
| 009 | Feature flag interactions | `lib/config/`, `search-flags.ts` |
| 010 | Memory parsing and validation | `lib/parsing/memory-parser.ts`, `content-normalizer.ts` |
| 011 | Checkpoint lifecycle | `handlers/checkpoints.ts`, `lib/storage/checkpoints.ts` |
| 012 | Shared memory and governance | `handlers/shared-memory.ts` |
| 013 | Session learning (FSRS) | `handlers/session-learning.ts` |
| 014 | Reconsolidation bridge | `lib/storage/reconsolidation.ts` |
| 015 | Query routing and intent | `lib/search/query-router.ts`, `intent-classifier.ts` |
| 016 | Error handling and recovery | `lib/errors.ts`, handler error paths |
| 017 | Index scan and ingest | `handlers/memory-index.ts`, `memory-ingest.ts` |
| 018 | Graph signals and degree boost | `lib/graph/graph-signals.ts`, `search/graph-search-fn.ts` |
| 019 | Eval framework correctness | `lib/eval/ablation-framework.ts`, `eval-metrics.ts` |
| 020 | Cross-cutting: concurrency and state | Global singletons, module-level state, race conditions |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Validate spec folder structure and create `review/` directory
- [ ] Initialize deep-research state files (`deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl`)
- [ ] Verify CocoIndex MCP is available for semantic code search

### Phase 2: Execute Review
- [ ] Run `/spec_kit:deep-research:review:auto` with 20 iterations
- [ ] Each iteration: read strategy, review assigned dimension, log findings to `review/iterations/iteration-NNN.md`, append state to JSONL
- [ ] Monitor for early convergence (3+ consecutive clean iterations)

### Phase 3: Synthesis
- [ ] Generate `review/review-report.md` with ranked findings table
- [ ] Classify all findings: P0 (blocker), P1 (required), P2 (improvement)
- [ ] Identify test coverage gaps for each P0/P1 finding
- [ ] Save context to memory
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Read-only audit | Full mcp_server/ source tree | Grep, Glob, Read, CocoIndex |
| Findings validation | Each P0/P1 finding verified by code citation | Read tool, line-level verification |
| Report completeness | All 20 dimensions covered in final report | Manual checklist against spec dimensions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| CocoIndex Code MCP | External | Green | Falls back to Grep/Glob for code discovery |
| Repo DB at `mcp_server/database/` | Internal | Green | Required for schema inspection queries |
| `@deep-research` agent | Internal | Green | Executes review iterations |
| `/spec_kit:deep-research` command | Internal | Green | Orchestrates the review loop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Review produces only false positives or the agent loops without progress.
- **Procedure**: Terminate the review loop, preserve partial findings in `review/iterations/`, and assess whether a manual targeted audit is more productive.
- **No code changes**: This is a read-only audit. Nothing to roll back in the codebase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Execute Review, 20 iterations) --> Phase 3 (Synthesis)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Spec approved | Execute Review |
| Execute Review | Setup | Synthesis |
| Synthesis | Execute Review | Follow-up fix specs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5-10 minutes |
| Execute Review (20 iterations) | High | 60-90 minutes (autonomous) |
| Synthesis | Medium | 10-15 minutes |
| **Total** | | **75-115 minutes** |
<!-- /ANCHOR:effort -->

---

## EXECUTION COMMAND

```
/spec_kit:deep-research:review:auto .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement
```

With the iteration count and dimension strategy defined in this plan, the deep-research review agent will autonomously execute all 20 iterations.
