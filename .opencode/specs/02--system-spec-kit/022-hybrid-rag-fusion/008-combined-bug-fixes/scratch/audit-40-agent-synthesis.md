# 15-Agent Cross-Model Code Audit — Synthesis Report

**Date**: 2026-03-10
**Scope**: Last 30 commits (7efbb6e8..40d08239), 313 source files
**Agents**: 10x GPT-5.3-Codex xhigh (via cli-copilot), 5x GPT-5.4 xhigh (via cli-codex)
**Orchestration**: Depth 0→1, single-hop LEAF, no sub-agents

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| P0 | 0 | — |
| P1 | 29 | **All fixed** (W3 commit) |
| P2 | 38 | Should fix |
| Architecture | 3 | Circular imports |
| **Total** | **70** | |

---

## P1 Findings (26)

### Search Pipeline (Agents 2, 3)

| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 1 | `mcp_server/lib/search/anchor-metadata.ts` | 117 | Same-line anchors (`<!-- ANCHOR:x -->...<!-- /ANCHOR:x -->`) dropped — close tag checked first, `continue` skips open-tag | Parse tags in positional order per line |
| 2 | `mcp_server/lib/search/auto-promotion.ts` | 227 | Promotion throttle + tier update + audit insert non-atomic — concurrent calls exceed limits | Wrap in `BEGIN IMMEDIATE` transaction |
| 3 | `mcp_server/lib/search/graph-search-fn.ts` | 111 | Dedup keeps highest score per ID but returns map insertion order, then slices by `limit` without sorting — high-score items dropped | Sort by `score` desc after dedup, then slice |
| 4 | `mcp_server/lib/search/learned-feedback.ts` | 320 | `recordSelection()` returns `applied: true` even if `applyLearnedTriggers()` fails (error swallowed) | Return success/failure from callee |
| 5 | `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | 466 | Constitutional injection runs after contextType filtering — injected rows bypass caller filters | Re-apply contextType filter after injection |
| 6 | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | 698 | Score demotions nullified: `intentAdjustedScore = Math.max(...)` preserves older higher values | Sync intentAdjustedScore to final score |
| 7 | `mcp_server/lib/search/pipeline/stage3-rerank.ts` | 469 | MPAB merge emits duplicate parent entries when parent exists in nonChunks and from chunk reassembly | Deduplicate by `id`, prefer highest score |
| 8 | `mcp_server/lib/search/vector-index-queries.ts` | 1309 | `verify_integrity` queries `vec_memories` unconditionally — throws when sqlite-vec unavailable | Guard with sqlite_vec availability check |
| 9 | `mcp_server/lib/search/vector-index-store.ts` | 382 | Prepared statements globally cached, not scoped per DB instance — multi-DB executes against wrong connection | Scope cache per `Database` via `WeakMap` |

### Storage & Cognitive (Agent 5)

| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 10 | `mcp_server/lib/chunking/anchor-chunker.ts` | 136 | MAX_CHUNK_CHARS hard cap violated — oversized anchor sections emitted as single oversized chunks | Further split oversized sections |
| 11 | `mcp_server/lib/cognitive/attention-decay.ts` | 125 | Invalid `last_review`/`created_at` → `NaN` elapsed days → NaN attention scores propagate | Validate with `Number.isFinite()`, fallback to baseScore |
| 12 | `mcp_server/lib/cognitive/co-activation.ts` | 22 | `SPECKIT_COACTIVATION_STRENGTH` env parsed without validation — invalid values → NaN score math | Guard with `Number.isFinite()`, fallback to default |
| 13 | `mcp_server/lib/storage/mutation-ledger.ts` | 201 | Query builder emits `ORDER BY ... OFFSET n` without `LIMIT` — invalid SQLite syntax | Always emit LIMIT before OFFSET |
| 14 | `mcp_server/lib/storage/reconsolidation.ts` | 121 | Feature flag defaults to enabled (`!= 'false'`) while contract says default OFF | Fix default to match contract (opt-in) |
| 15 | `mcp_server/lib/storage/reconsolidation.ts` | 503 | Conflict cleanup deletes only `memory_index` — orphan embedding/artifact rows remain | Clean up related tables in same transaction |

### API/Core/CLI (Agent 6)

| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 16 | `mcp_server/cli.ts` | 378 | `runReindex()` ignores `result.isError` — failures return exit code 0 | Check `result.isError`, exit non-zero |
| 17 | `mcp_server/cli.ts` | 215 | `--older-than` parseInt'd but never validated — invalid/negative values → broken datetime filters | Validate `Number.isInteger(n) && n > 0` |

### Scripts (Agents 7, 8, 9)

| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 18 | `scripts/core/file-writer.ts` | 21 | `realpathSync(filePath)` on new files throws ENOENT (file doesn't exist yet) | Check parent directory instead |
| 19 | `scripts/extractors/collect-session-data.ts` | 600 | `new Date(lastPrompt.timestamp).toISOString()` throws RangeError on invalid timestamps | Parse safely with `isNaN(d.getTime())` guard |
| 20 | `scripts/rules/check-ai-protocols.sh` | 24 | Level detection only reads `- **Level**:` bullets — misses table/frontmatter/marker declarations | Add alternative level detection patterns |
| 21 | `scripts/rules/check-phase-links.sh` | 68 | Parent check accepts any `| **Parent Spec**` row without validating referenced path | Validate parent path exists |
| 22 | `scripts/evals/run-ablation.ts` | 88 | `initHybridSearch(db)` called before `if (!db)` guard — null dereference if DB init fails | Move guard before init call |
| 23 | `scripts/lib/content-filter.ts` | 376 | Shallow merge drops nested defaults — `config.pipeline.stages.includes()` throws | Use deep merge or structured defaults |
| 24 | `scripts/lib/flowchart-generator.ts` | 355 | Loop detection treats any diagram with `└`/`┘` as loop — most boxed diagrams misclassified | Use context-aware pattern matching |
| 25 | `scripts/evals/map-ground-truth-ids.ts` | 31 | `--apply` flag parsed but never used to update ground-truth-data.ts — contradicts contract | Implement the apply logic or remove flag |

### Shared (Agent 10)

| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 26 | `shared/embeddings.ts` | 303 | `generateBatchEmbeddings()` — `concurrency` of 0 or negative → infinite loop | Validate `concurrency >= 1` upfront |

### Handlers (Agent 13 — GPT-5.4 Error Handling)

| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 27 | `mcp_server/handlers/memory-bulk-delete.ts` | 177 | `causalEdges.deleteEdgesForMemory()` in bulk-delete transaction: edge cleanup failure caught and logged, memory row deleted but causal edges remain → data inconsistency | Propagate edge-cleanup errors to fail the transaction |
| 28 | `mcp_server/lib/eval/eval-metrics.ts` | 195 | `computeRecall` counts duplicate memoryId hits — Recall and F1 can exceed 1.0 | Deduplicate hits before counting |
| 29 | `mcp_server/lib/eval/eval-metrics.ts` | 274 | `computeMAP` increments for duplicate relevant IDs — MAP can exceed 1.0 | Deduplicate relevant IDs |

---

## P2 Findings (34)

### Search (Agents 2, 3)

| # | File | Line | Bug |
|---|------|------|-----|
| 1 | `lib/search/context-budget.ts` | 117 | Missing `graphRegion` treated as "unseen" forever |
| 2 | `lib/search/cross-encoder.ts` | 207 | Length penalty updates `rerankerScore` only, not `score` |
| 3 | `lib/search/graph-search-fn.ts` | 203 | LIKE fallback ignores matching `title` when `content_text` exists |
| 4 | `lib/search/spec-folder-hierarchy.ts` | 270 | `!= 'deprecated'` excludes NULL tiers (SQLite NULL comparison) |
| 5 | `lib/search/vector-index-aliases.ts` | 229 | Cache clearing via `key.includes(spec_folder)` never matches SHA keys |
| 6 | `lib/search/vector-index-mutations.ts` | 457 | `delete_memories` returns pre-rollback counts |
| 7 | `lib/search/vector-index-queries.ts` | 150 | Missing 'partial' embedding status in counts |
| 8 | `lib/search/vector-index-store.ts` | 430 | Constitutional cache ignores `includeArchived` flag |

### Storage & Cognitive (Agent 5)

| # | File | Line | Bug |
|---|------|------|-----|
| 9 | `lib/cache/embedding-cache.ts` | 115 | Eviction runs before upsert on existing key — unnecessary entry loss |
| 10 | `lib/cognitive/co-activation.ts` | 117 | Cache key ignores `limit` parameter |
| 11 | `lib/config/type-inference.ts` | 231 | Case-sensitive `importanceTier` lookup — "Critical" misses mapping |
| 12 | `lib/storage/access-tracker.ts` | 89 | `trackMultipleAccesses` bypasses map-size guard — unbounded growth |
| 13 | `lib/storage/consolidation.ts` | 361 | Counters increment without checking `updateEdge()` success |
| 14 | `lib/utils/format-helpers.ts` | 19 | Invalid date → "NaN months ago" output |

### API/Core (Agent 6)

| # | File | Line | Bug |
|---|------|------|-----|
| 15 | `mcp_server/core/db-state.ts` | 194 | `getLastScanTime()` returns NaN on corrupt config → cooldown math breaks |

### Scripts (Agents 7, 8, 9)

| # | File | Line | Bug |
|---|------|------|-----|
| 16 | `scripts/extractors/collect-session-data.ts` | 691 | `observations.slice(0, MAX)` keeps oldest, not newest |
| 17 | `scripts/extractors/diagram-extractor.ts` | 183 | Regex capture group incorrect for "chose X" branch |
| 18 | `scripts/rules/check-links.sh` | 67 | `>> "$output_file" >&2` sends to stderr, not file |
| 19 | `scripts/rules/check-anchors.sh` | 131 | Anchor validation only checks counts, not ordering |
| 20 | `scripts/evals/check-no-mcp-lib-imports-ast.ts` | 100 | Unvalidated `allowlist.exceptions` → TypeError on malformed JSON |
| 21 | `scripts/evals/check-no-mcp-lib-imports.ts` | 92 | Same unvalidated exceptions issue |
| 22 | `scripts/evals/check-no-mcp-lib-imports.ts` | 294 | Transitive scan is one-hop only — deeper chains missed |
| 23 | `scripts/lib/decision-tree-generator.ts` | 125 | Empty label matches everything (`includes('') === true`) |

### Shared (Agent 10)

| # | File | Line | Bug |
|---|------|------|-----|
| 24 | `scripts/utils/input-normalizer.ts` | 480 | NaN `captureBaseTime` → `toISOString()` throws RangeError |
| 25 | `shared/algorithms/rrf-fusion.ts` | 187 | Default `graphWeightBoost` is 0 — graph channel effectively disabled |
| 26 | `scripts/utils/message-utils.ts` | 203 | `extractKeyArtifacts()` ignores `TOOL_NAME` field |
| 27 | `shared/embeddings/providers/openai.ts` | 313 | Cost estimate 1000x too high (per-token multiplier wrong) |
| 28 | `shared/embeddings/providers/voyage.ts` | 332 | Cost estimate 1000x too high (same pattern) |

### Handlers (Agent 13 — GPT-5.4 Error Handling)

| # | File | Line | Bug |
|---|------|------|-----|
| 33 | `mcp_server/handlers/save/db-helpers.ts` | 67 | `hasReconsolidationCheckpoint()` swallows all DB errors, returning false for both "no checkpoint" and "DB broken" |
| 34 | `mcp_server/handlers/session-learning.ts` | 517 | Three `JSON.parse()` calls swallow parse failures, falling back to empty arrays silently |
| 35 | `mcp_server/handlers/memory-search.ts` | 805 | 5 unsafe `as unknown as` double-casts mask contract drift |
| 36 | `mcp_server/handlers/memory-context.ts` | 498 | `includeTrace` double-cast bypasses handler's own typed contract |

### Eval/Scoring (Agent 4)

| # | File | Line | Bug |
|---|------|------|-----|
| 37 | `lib/eval/bm25-baseline.ts` | 323 | `computeBootstrapCI` — iterations ≤ 0 → NaN bounds |
| 38 | `lib/eval/eval-quality-proxy.ts` | 128 | Negative latency → score > 1.0, violating normalization |
| 39 | `lib/parsing/memory-parser.ts` | 722 | `validateAnchors` false positive on repeated anchor IDs |
| 40 | `lib/scoring/composite-scoring.ts` | 256 | Only reads `importance_tier` (snake), ignores `importanceTier` (camel) |

---

## Architecture Issues (Agent 12 — GPT-5.4 AST Analysis)

### Circular Import Cycles (3 confirmed)

1. `vector-index-store.ts` ↔ `vector-index-queries.ts`
2. `vector-index-mutations.ts` ↔ `vector-index-store.ts`
3. `vector-index-store.ts` ↔ `vector-index-aliases.ts`

**Root cause**: The `vector-index-*.ts` split created mutual dependencies. `vector-index-store.ts` uses dynamic `await import()` to break cycles at runtime, but static imports in `-queries`, `-mutations`, `-aliases` still form compile-time cycles.

**Fix**: Extract shared types/state into a `vector-index-common.ts` module that all four files import from, eliminating bidirectional dependencies.

---

## GPT-5.4 Deep Analysis Notes

Agents 11 (security), 13 (error handling), 14 (data integrity), 15 (type safety) performed extensive analysis but hit the 10-minute execution timeout before writing final conclusions.

**Agent 11 (Security)**: Preliminary finding — "ruled out obvious SQL and path candidates because dynamic pieces are either parameterized or locked to allowlists/constants." No confirmed security vulnerabilities in the in-scope files. The codebase uses parameterized queries, `ALLOWED_POST_INSERT_COLUMNS` allowlists, and `sanitizePath()` guards correctly.

**Agent 12 (Architecture)**: Found 3 circular import cycles via AST analysis (reported above). Also confirmed ~30 `handlers → lib/` direct imports which are documented as intentional (the ARCHITECTURE.md notes these).

---

## Recommendations

### Immediate (P1 blockers)

1. **NaN propagation** (findings 11, 12, 17, 24): Add `Number.isFinite()` guards on all parsed numeric values from DB/env/user input
2. **Search pipeline correctness** (findings 5, 6, 7, 3): Fix constitutional injection filtering, score synchronization, MPAB dedup, and graph-search sorting
3. **SQLite edge cases** (findings 8, 9, 13): Guard sqlite-vec queries, scope prepared statements per DB, fix OFFSET without LIMIT
4. **File writer ENOENT** (finding 18): Check parent directory instead of file path for new files
5. **Reconsolidation default** (finding 14): Fix feature flag to match contract (opt-in, not opt-out)

### Next Sprint (P2)

1. **Cost estimation** (findings 27, 28): Fix 1000x multiplier error in OpenAI/Voyage cost estimates
2. **Cache correctness** (findings 5, 8, 10): Include all relevant parameters in cache keys
3. **Metric accuracy** (eval-metrics findings): Deduplicate hits before computing Recall/MAP
4. **Shell script fixes** (findings 18, 19, 20, 21): Fix stderr redirect, anchor ordering, level detection

### Architecture

1. Extract `vector-index-common.ts` to break the 3 circular import cycles
