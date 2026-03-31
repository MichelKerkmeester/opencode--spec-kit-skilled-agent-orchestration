---
title: "Implementation Plan: Memory Database [02--system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/plan]"
description: "30-iteration deep-research review audit + 4 fix sprints + P2 triage + meta-review for the Spec Kit Memory MCP server. 121 original findings fixed, 29 meta-review findings pending remediation in Phase 12."
trigger_phrases:
  - "memory database refinement plan"
  - "deep research review plan"
  - "mcp server audit plan"
importance_tier: "important"
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
This plan covers the full lifecycle: a 30-iteration audit (20 primary + 10 deep dives), 4 fix sprints for 121 findings, P2 triage, deferred P2 fixes, a 10-iteration meta-review of fix quality, and Phase 12 remediation of 29 meta-review findings. Each review iteration produces P0/P1/P2 findings logged to `review/iterations/iteration-NNN.md`. Reports: `review/review-report-v1-original-audit.md` (original 121 findings) and `review/review-report.md` (v2 meta-review, 29 findings).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (CocoIndex MCP, repo DB)

### Definition of Done
- [x] All 30 iterations complete (20 primary + 10 deep dives)
- [x] Final `review/review-report-v1-original-audit.md` exists with ranked findings (121 total)
- [x] Each P0 finding has file path, code citation, and fix recommendation
- [x] All 5 P0 + 75 P1 findings fixed with tests passing
- [x] P2 triage complete (22 fixed, 15 deferred then fixed, 3 rejected)
- [x] 10-iteration meta-review complete with `review/review-report.md` (v2)
- [x] Phase 12 meta-review remediation complete (1 P0, 17 P1, 11 P2)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Autonomous deep-research review loop with externalized state. Each iteration gets a fresh context window, reads the strategy and prior state, reviews one dimension, and appends findings to the JSONL state file.

### Key Components
- **Review strategy** (`review/deep-review-strategy.md`): Maps dimensions to iteration slots with priority ordering.
- **State file** (`review/deep-research-state.jsonl`): Append-only log of iteration results, convergence signals, and findings counts.
- **Iteration artifacts** (`review/iterations/iteration-NNN.md`): Per-iteration findings (001-030 original audit, 031-040 meta-review).
- **Original audit report** (`review/review-report-v1-original-audit.md`): 121 findings from the 30-iteration audit.
- **Meta-review report** (`review/review-report.md`): 29 findings from the 10-iteration meta-review (v2).

### Deep-Research Review Configuration

| Parameter | Value |
|-----------|-------|
| **Mode** | `--review` |
| **Iterations** | 30 (20 primary + 10 deep dives) |
| **Execution** | `:auto` (autonomous) |
| **Target** | `.opencode/skill/system-spec-kit/mcp_server/` |
| **Spec folder** | `026-memory-database-refinement` |
| **Convergence** | Disabled (force all iterations for full coverage) |

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
- [x] Run 30 review iterations (20 primary + 10 deep dives)
- [x] Each iteration: read strategy, review assigned dimension, log findings
- [x] 121 findings classified: 5 P0, 75 P1, 41 P2

### Phase 3: Synthesis + Fix Sprints
- [x] Generate `review/review-report-v1-original-audit.md` with ranked findings
- [x] Fix all 5 P0 blockers (Phase 2 in tasks.md)
- [x] Fix all 75 P1 in 4 sprints (Phases 3-6 in tasks.md)
- [x] Reconcile 24 cross-agent test failures (Phase 8)
- [x] Triage 41 P2: 22 fixed, 16 deferred, 3 rejected (Phase 9)
- [x] Fix all 15 deferred P2 findings (Phase 10)

### Phase 4: Meta-Review
- [x] Run 10-iteration meta-review (iterations 031-040)
- [x] Found 29 new findings: 1 P0, 17 P1, 11 P2
- [x] Report: `review/review-report.md` (v2)

### Phase 5: Meta-Review Remediation (Phase 12 in tasks.md)
- [x] Fix P0 F-001: checkpoint restore scope isolation
- [x] Fix 6 code correctness P1s (F-002 through F-007)
- [x] Fix 7 documentation drift P1s (F-008 through F-014)
- [x] Fix 2 security P1s (F-015, F-016)
- [x] Fix 2 maintainability P1s (F-017, F-018)
- [x] Triage 11 P2 advisories (F-019 through F-029) — 6 code fixes, 5 doc fixes
- [x] Run full test suite + typecheck — 8,858 pass, tsc clean
- [x] Save context to memory

### Phase 6: Deep Research Refinement (Phase 13 in tasks.md)
- [ ] 5-iteration deep research complete — 28 findings across 5 dimensions
- [ ] WS-1: Fix 3 concurrency P1s (C-1 restore barrier, C-2 shared-space race, C-3 stale merge) + 1 P2 (C-4 scan cooldown)
- [ ] WS-2: Fix 3 high-impact search performance bottlenecks (S-1 fallback re-pipeline, S-2 token double-serialize, S-3 BM25 full scan) + 4 medium (S-4 degree N+1, S-5 graph FTS OR, S-6 fusion duplication, S-7 MMR re-fetch)
- [ ] WS-3: Fix 3 high-impact SQLite optimizations (Q-1 dedup indexes, Q-2 trigger cache, Q-3 co-activation N+1) + 3 medium (Q-4 temporal index, Q-5 causal LIKE, Q-6 working-memory indexes)
- [ ] WS-4: Fix 1 high error recovery gap (E-1 chunked PE partial commit) + 3 medium (E-2 safe-swap cleanup, E-3 BM25 rollback drift, E-4 reconsolidation BM25 repair)
- [ ] WS-5: Clean up 7 dead code/debt items (D-1 through D-7)
- [ ] Run full test suite + typecheck
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
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Review, 30 iters) --> Phase 3 (Synthesis + Fix Sprints) --> Phase 4 (Meta-Review) --> Phase 5 (Remediation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Spec approved | Review |
| Review (30 iterations) | Setup | Synthesis |
| Synthesis + Fix Sprints | Review | Meta-Review |
| Meta-Review (10 iterations) | Synthesis | Remediation |
| Remediation (Phase 12) | Meta-Review | Release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
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
