---
title: Verification Agent 8 — Retrieval Enhancements (Features 55-60)
reviewer: reviewer-agent
date: 2026-03-01
spec: 02--system-spec-kit/022-hybrid-rag-fusion-refinement
features: F55 (TM-05), F56 (PI-A4), F57 (S4), F58 (N3-lite), F59 (R8), F60 (S5)
confidence: HIGH
---

# Verification Report: Retrieval Enhancements (Features 55-60)

## Summary

| Feature | ID     | Result | Severity of Issues |
|---------|--------|--------|--------------------|
| F55 — Dual-scope auto-surface | TM-05  | PASS   | None               |
| F56 — Constitutional directives | PI-A4  | PASS   | None               |
| F57 — Spec folder hierarchy scoring | S4     | ISSUE  | Important          |
| F58 — Lightweight consolidation | N3-lite| PASS   | None               |
| F59 — Memory summary channel | R8     | PASS   | None               |
| F60 — Cross-document entity linking | S5     | ISSUE  | Important          |

**Overall Score: 79/100** — ACCEPTABLE (PASS with notes)

---

## Score Breakdown

| Dimension        | Score | Notes                                          |
|------------------|-------|------------------------------------------------|
| Correctness      | 25/30 | Hierarchy scoring deviation, N+1 in entity linking |
| Security         | 25/25 | No vulnerabilities found                       |
| Patterns         | 17/20 | Minor: module-level mutable state in memory-surface.ts |
| Maintainability  | 14/15 | Very good; clear single-purpose functions, good docs |
| Performance      | 8/10  | getSpecFolder called per-loop within createEntityLinks |

---

## Feature Reviews

---

### Feature 55 — Dual-scope auto-surface (TM-05)

**Result: PASS**

**File reviewed:** `hooks/memory-surface.ts`

**Directive format check:** PASS
The pipe-delimited format is correctly applied. `formatDirectiveMetadata()` in `retrieval-directives.ts` produces `"<surfaceCondition> | <priorityCondition>"` (line 292). This is correctly consumed by `enrichWithRetrievalDirectives()` (line 316-343) which is called from `autoSurfaceMemories()` in `memory-surface.ts` (line 151).

**Dual-scope lifecycle hooks:** PASS
Two distinct hook points are implemented:
- `autoSurfaceAtToolDispatch` (line 194) — fires on non-memory-aware tool dispatch
- `autoSurfaceAtCompaction` (line 241) — fires on session compaction / resume-mode

**Token budgets:** PASS
Both hooks are capped at `TOOL_DISPATCH_TOKEN_BUDGET = 4000` and `COMPACTION_TOKEN_BUDGET = 4000` (lines 52-53). Enforcement is structural: the trigger-matcher is called with a limit of 5 results and constitutional cache is capped at 10, keeping well within budget.

**Recursive loop prevention:** PASS
`MEMORY_AWARE_TOOLS` Set (lines 42-49) correctly guards the dispatch hook. The six tools listed match the spec: `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, `memory_index_scan`.

**Error handling:** PASS
Both hooks have outer try-catch blocks. The cache update in `getConstitutionalMemories()` is guarded (lines 93-121).

**Positive observations:**
- Constitutional memory cache (1-minute TTL) avoids repeated DB queries per tool call.
- `extractContextHint()` gracefully handles null/missing args and supports array `concepts`.
- `clearConstitutionalCache()` is exported for test isolation.

---

### Feature 56 — Constitutional directives (PI-A4)

**Result: PASS**

**File reviewed:** `lib/search/retrieval-directives.ts`

**Pipe-delimited format:** PASS
`formatDirectiveMetadata()` at line 291-293 produces exactly `"<surfaceCondition> | <priorityCondition>"` with pipe-space-pipe delimiter. This matches the spec contract.

**Directive extraction logic:** PASS
- Scans up to `MAX_CONTENT_SCAN_CHARS = 2000` characters (line 79).
- Each component capped at `MAX_DIRECTIVE_COMPONENT_CHARS = 120` characters (line 82).
- Imperative keywords (10 items, lines 60-71) include `must`, `always`, `never`, `should`, `require`, `requires`, `ensure`, `only`, `do not`, `avoid`.
- Condition keywords (7 items, line 76): `when`, `if`, `for`, `during`, `before`, `after`, `on`.

**Fallback handling:** PASS
When no imperative lines are found and content is empty, falls back to title-as-directive (lines 257-269). Returns null only when both content and title are empty (line 207).

**Enrichment is non-destructive:** PASS
`enrichWithRetrievalDirectives()` (line 316) maps over results without filtering or reordering. File read failures are caught with an empty-content fallback (lines 322-331). Results without an extractable directive are returned unchanged (line 334-336).

**Synchronous/pure transformation:** PASS
`extractRetrievalDirective()` and `formatDirectiveMetadata()` are pure synchronous functions with no side effects. Only `enrichWithRetrievalDirectives()` performs I/O (synchronous `fs.readFileSync`), which is acceptable for an enrichment pass over a small set of constitutional memories (capped at 10 by the surface hook).

**Positive observations:**
- `fs.existsSync` before `readFileSync` (line 324) avoids ENOENT throws.
- `cap()` helper with ellipsis truncation (lines 99-102) ensures LLM-consumable output lengths.
- The `source` fallback uses `title ?? 'constitutional memory'` (line 209) — never throws on undefined title.

---

### Feature 57 — Spec folder hierarchy scoring (S4)

**Result: ISSUE — Important (P1)**

**File reviewed:** `lib/search/spec-folder-hierarchy.ts`

**Hierarchy construction:** PASS
Two-pass build is correct. First pass creates all nodes including implicit intermediate parents via `ensureNodeExists()` (line 108). Second pass links children to parents (lines 84-98). Root detection works correctly for folders without a DB-present parent.

**WeakMap cache pattern:** PASS
`hierarchyCache` is a `WeakMap<Database.Database, HierarchyCacheEntry>` (line 27). TTL is 60 seconds (line 18). Cache is invalidated by `invalidateHierarchyCache()` (line 34). Keying by database instance correctly isolates test and production contexts.

**Self=1.0:** PASS — Line 247: `relevanceMap.set(specFolder, 1.0)`

**Parent=0.8:** PASS — `ancestors[0]` receives `0.8 - 0 * 0.2 = 0.8` via the formula `Math.max(0.3, 0.8 - i * 0.2)` (line 250).

**Grandparent=0.6:** PASS — `ancestors[1]` receives `0.8 - 1 * 0.2 = 0.6`. Correct.

**P1 ISSUE — Grandparent formula works, but floor suppresses deeply-nested ancestors unexpectedly:**
The formula `Math.max(0.3, 0.8 - i * 0.2)` means:
- i=0 (parent): 0.8
- i=1 (grandparent): 0.6
- i=2 (great-grandparent): 0.4
- i=3+: floors at 0.3 (regardless of depth)

The spec states "self=1.0, parent=0.8, grandparent=0.6" with "floor of 0.3." The floor behavior is documented in the summary (`summary_of_new_features.md` line 544: "floor of 0.3") so the implementation is consistent with the documented spec. The self/parent/grandparent exact values are correct.

**P1 ISSUE — `getRelatedFolders()` includes siblings but `queryHierarchyMemories()` score for orphan folders defaults to 0.3 (fallback), not via the sibling map:**

`getRelatedFolders()` (line 212) adds siblings from `getSiblingPaths()`. However, `queryHierarchyMemories()` builds `relevanceMap` via `getAncestorPaths()` and `getSiblingPaths()` independently (lines 249-253). These are two separate calls. If a sibling has no parent in the nodeMap (orphan scenario), `getSiblingPaths()` returns `[]` at line 175 (parentNode not found). This means sibling memories would receive the `?? 0.3` fallback instead of 0.5.

This only manifests for top-level spec folders with no parent in the hierarchy, which is uncommon but not impossible. File: `spec-folder-hierarchy.ts`, line 271.

**Impact:** Low-frequency edge case. Siblings of root-level spec folders silently receive 0.3 instead of 0.5.

**Empty folder handling:** PASS
When `specFolder` is not in the hierarchy, `queryHierarchyMemories()` returns `[]` via `relatedFolders = [specFolder]` (always includes self), and the SQL query handles missing spec folders gracefully via `IN (?)` with no matches.

**Cyclic dependency risk:** PASS
`ensureNodeExists()` recursively builds parent chains (lines 128-132). Cycles in path segments are impossible because `getParentPath()` always shortens the path string via `lastIndexOf('/')`. This prevents infinite recursion.

---

### Feature 58 — Lightweight consolidation (N3-lite)

**Result: PASS**

**File reviewed:** `lib/storage/consolidation.ts`

**Weekly trigger cadence:** PASS
`CONSOLIDATION_INTERVAL_DAYS = 7` (line 56). `runConsolidationCycleIfEnabled()` (line 448) checks `consolidation_state.last_run_at` against `datetime('now', '-7 days')` before running.

**On-save trigger:** PASS
`handlers/memory-save.ts` line 2055-2068 calls `runConsolidationCycleIfEnabled(requireDb())` after every successful save. The cadence gate inside `runConsolidationCycleIfEnabled()` ensures the actual cycle runs at most weekly even though the hook fires on every save.

**Feature flag:** PASS
Gated via `isConsolidationEnabled()` (line 451) which reads `SPECKIT_CONSOLIDATION` env var. Default: ON.

**Fail-open behavior:** PASS
The outer catch at line 489-491 runs the consolidation cycle once even if cadence bookkeeping fails, preventing a stuck state.

**Four sub-components:** PASS
1. Contradiction scan (`scanContradictions`, line 77) — dual vector/heuristic strategy with fallback.
2. Hebbian strengthening (`runHebbianCycle`, line 308) — +0.05 per cycle, 30-day decay, auto-edge strength cap respected.
3. Staleness detection (`detectStaleEdges`, line 367) — delegates to `getStaleEdges(STALENESS_THRESHOLD_DAYS)`.
4. Edge bounds enforcement (`checkEdgeBounds`, line 382) — checks `MAX_EDGES_PER_NODE` per node.

**Error handling:** PASS
All four sub-components have their own try-catch blocks with `console.warn` on failure.

**Positive observations:**
- `consolidation_state` table is created with `CREATE TABLE IF NOT EXISTS`, safe for first-run.
- The `ON CONFLICT(id) DO UPDATE` upsert pattern (line 483) is correct for a single-row state table.
- Auto-edge strength cap respected in Hebbian: `edge.created_by === 'auto' ? Math.min(newStrength, MAX_AUTO_STRENGTH) : newStrength` (lines 326-328).

---

### Feature 59 — Memory summary channel (R8, TF-IDF extraction)

**Result: PASS**

**Files reviewed:** `lib/search/tfidf-summarizer.ts`, `lib/search/memory-summaries.ts`

**TF-IDF algorithm correctness:** PASS
- `computeTfIdf()` correctly implements TF = count/total_tokens, IDF = log(N/df) (lines 138-143).
- Normalization to [0,1] via `maxScore` reduction (lines 149-155). Uses `reduce` to avoid `Math.max(...spread)` RangeError on large arrays — good defensive pattern.
- `extractKeySentences()` returns top-N in original document order (lines 199-206) via sort on `index`, not `score`. This correctly preserves narrative coherence per spec.

**Sentence filtering:** PASS
`MIN_SENTENCE_LENGTH = 10`, `MAX_SENTENCE_LENGTH = 500` (lines 21-24). Applied in `extractKeySentences()` using `stripMarkdown()` length (lines 181-184), not raw length, which correctly handles markdown-heavy content.

**Markdown stripping:** PASS
`stripMarkdown()` handles: headers, bullets, numbered lists, images, links, inline code, bold/italic, strikethrough, blockquotes (lines 38-49).

**Summary storage:** PASS
`generateAndStoreSummary()` uses `INSERT OR REPLACE` with `COALESCE` to preserve original `created_at` (lines 114-128). Embedding stored as `Buffer` (Float32Array→Buffer via `float32ToBuffer()`). `key_sentences` stored as JSON string.

**Scale gate:** PASS
`checkScaleGate()` returns true only when `>5000` memories with `embedding_status = 'success'` (lines 204-219).

**LIMIT clause (Sprint 8 fix):** PASS
`querySummaryEmbeddings()` uses `fetchCap = Math.max(limit * 10, 1000)` (line 163) to prevent full-table scans. Verified at line 163-169.

**Async error handling:** PASS
`generateAndStoreSummary()` is async with outer try-catch (lines 102-138). Embedding failure results in `embeddingBlob = null` (line 110) — summary is still stored without embedding, which is correct.

**Cosine similarity edge cases:** PASS
`cosineSimilarity()` returns 0 for mismatched dimensions, zero-length arrays, and zero-norm vectors (lines 32-33, 49-52).

**Buffer round-trip:** PASS
`float32ToBuffer()` uses `Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength)` (line 60). `bufferToFloat32()` copies via `Uint8Array` to avoid alignment issues (lines 66-74). This defensive copy is correct.

**Single-sentence edge case:** PASS
`extractKeySentences()` returns the single sentence directly when `filtered.length === 1` (lines 190-192), bypassing TF-IDF (which would produce meaningless scores with 1 sentence anyway).

**IDF edge case — single-sentence corpus:** NOTICE (P2)
When a document contains only one sentence, `computeTfIdf()` is bypassed by the early return in `extractKeySentences()`. However, if `computeTfIdf()` is called directly with a single-sentence array, all terms have `df = 1` and `idf = log(1/1) = 0`, yielding all-zero scores. The normalized max score would be 0 and normalization is skipped. The function returns the single sentence with `score: 0`. This is not a bug in the normal call path (guarded by the single-sentence check), but the edge case in `computeTfIdf()` itself produces silently unhelpful scores for single-sentence inputs called directly. Not a blocker — single-sentence inputs via the normal path are handled correctly. Documented for test coverage awareness.

---

### Feature 60 — Cross-document entity linking with density guard (S5)

**Result: ISSUE — Important (P1)**

**File reviewed:** `lib/search/entity-linker.ts`

**Density guard:** PASS
`computeEdgeDensity()` (line 212) computes `total_edges / total_memories`. `runEntityLinking()` (line 491) checks density before calling `createEntityLinks()` and short-circuits if already over threshold (lines 505-514). Within `createEntityLinks()`, projected density is checked per-link before insert (lines 357-365), using a running `totalEdges` counter that increments in-memory as links are created (line 379). This prevents the check from becoming stale within a single run.

**`skippedByDensityGuard` and `blockedByDensityGuard` reporting:** PASS
`createEntityLinks()` returns both fields (lines 397-400). Pre-existing density excess is reported via `runEntityLinking()` early return (lines 507-513).

**Threshold sanitization:** PASS
`sanitizeDensityThreshold()` (line 187) rejects non-finite and negative values, falling back to `DEFAULT_MAX_EDGE_DENSITY = 1.0`. Environment variable path uses the same sanitizer (line 202).

**Cross-folder-only linking:** PASS
`folderA === folderB` check at line 351 correctly skips same-folder pairs.

**INSERT OR IGNORE for deduplication:** PASS
Line 311 uses `INSERT OR IGNORE` — existing edges are not duplicated.

**`supports` relation with strength 0.7:** PASS
Line 312: `'supports', 0.7, ?, 'entity_linker'`. Matches spec.

**Batch edge count pre-fetch (Sprint 8 improvement):** PASS
`batchGetEdgeCounts()` (lines 259-291) collects all unique node IDs before the loop and fetches counts in a single SQL UNION ALL query. The result is stored in `edgeCountCache` (line 327) and updated in-memory as edges are inserted (lines 381-382). This eliminates the N+1 pattern for edge count checks.

**P1 ISSUE — `getSpecFolder()` called once per `memoryId` inside the match loop (remaining N+1):**

Despite the batch edge-count pre-fetch, `createEntityLinks()` still calls `getSpecFolder(db, memoryId)` (line 335) inside the outer `for (const match of matches)` loop, once per `memoryId` per match. This is a separate SELECT per memory per match iteration. For M matches each with K memories, this is M*K individual queries.

The spec summary (`summary_of_new_features.md`) only documents the batch optimization for edge counts, not for spec-folder lookups. However, the entity catalog built by `buildEntityCatalog()` already fetches `spec_folder` alongside `memory_id` (lines 92-100 of the same file), and `findCrossDocumentMatches()` includes `specFolders` in the returned `EntityMatch` objects.

The `EntityMatch` interface has `specFolders: string[]` but `createEntityLinks()` discards this and re-fetches per-memory via individual queries. This is a missed optimization: the `memoryFolders` map could be built from the data already in `match.specFolders`, or the match results could carry a `Map<number, string>` from the catalog build phase.

This is an Important (P1) issue rather than a blocker because:
- The impact is bounded by the number of cross-document entity matches (typically small relative to total memories).
- The density guard limits total link creation anyway.
- No correctness bug: `getSpecFolder` returns the right value, just inefficiently.

**File:** `lib/search/entity-linker.ts`, lines 332-338

**Entity normalization consolidation (Sprint 8):** PASS
The `normalizeEntityName()` function (lines 64-70) uses Unicode-aware regex `[^\p{L}\p{N}\s]` with the `u` flag. The `computeEdgeDensity()` wrapper (line 212) delegates to `getGlobalEdgeDensityStats()`. Both consolidation points from Sprint 8 are correctly implemented.

**Infrastructure gate:** PASS
`hasEntityInfrastructure()` (line 468) checks `entity_catalog` has entries before running. Returns false on error (fail-safe).

**Error handling:** PASS
`buildEntityCatalog()` has outer try-catch with `console.warn` (lines 124-127). `createEntityLinks()` per-insert try-catch (lines 384-387). `getEntityLinkStats()` outer try-catch (lines 455-458).

---

## Issues Summary

### P1 — Required Fixes

**P1-01 — Hierarchy: Orphan-sibling fallback score (F57)**
- File: `lib/search/spec-folder-hierarchy.ts`, line 271
- Issue: Siblings of root-level spec folders (no parent in nodeMap) receive the `?? 0.3` fallback instead of the intended `0.5` sibling score. This occurs because `getSiblingPaths()` returns `[]` when the parent node is not in the tree, but the `relevanceMap` is populated from a separate `getSiblingPaths()` call that also returns `[]`, meaning those memories correctly get no entry in the map. The fallback `?? 0.3` is safe — no incorrect score is assigned for the root-level case. **Correction: this is a P2, not P1.** The fallback only applies to folders explicitly in `relatedFolders` that have no `relevanceMap` entry, which for root-level siblings means they were never added to `relatedFolders` to begin with. The logic is correct. Reclassified below.

**P1-01 — Entity linker: getSpecFolder N+1 per-match-loop (F60)**
- File: `lib/search/entity-linker.ts`, lines 332-338
- Issue: `getSpecFolder(db, memoryId)` executes one SELECT per `memoryId` inside the outer match loop. The `EntityMatch` already carries `specFolders[]` from the catalog build, but the data is not in a `Map<number, string>` form. A batch pre-fetch of `memoryId -> specFolder` across all matches would eliminate these queries.
- Fix direction: Either (a) extend `EntityMatch` to carry `Map<number, string>` from `buildEntityCatalog()`, or (b) add a batch pre-fetch similar to `batchGetEdgeCounts()` before the match loop.
- Impact: Performance degradation proportional to total entity matches * average memories per match. Bounded by density guard, but measurable at scale.

### P2 — Suggestions

**P2-01 — tfidf-summarizer: single-sentence IDF edge case undocumented (F59)**
- File: `lib/search/tfidf-summarizer.ts`, lines 105-158
- If `computeTfIdf()` is called directly with a single-sentence array, all term IDF values are `log(1/1) = 0`, yielding all-zero scores. The normal call path is protected by the single-sentence early return in `extractKeySentences()`. Add a comment or test for this direct-call edge case.

**P2-02 — memory-surface: module-level mutable cache state (F55)**
- File: `hooks/memory-surface.ts`, lines 56-58
- `constitutionalCache` and `constitutionalCacheTime` are module-level mutable variables. This works correctly in single-process Node.js but prevents proper test isolation without calling `clearConstitutionalCache()`. This pattern is consistent with existing code (the export of `clearConstitutionalCache()` at line 278 suggests awareness of this). No change required; document as a known test isolation concern.

**P2-03 — Hierarchy: comment/implementation mismatch for spec value (F57)**
- File: `lib/search/spec-folder-hierarchy.ts`, line 210 vs 245
- The JSDoc comment at line 210 says "Relevance order: self > parent > grandparent > siblings" but the actual function implementing this order is `queryHierarchyMemories()` (line 235), not `getRelatedFolders()`. The comment is on `getRelatedFolders()` which does not compute scores. Minor documentation misalignment.

---

## Standards Check

| Standard | Status | Notes |
|----------|--------|-------|
| WeakMap cache pattern | PASS | `spec-folder-hierarchy.ts` uses `WeakMap<Database.Database, ...>` correctly |
| Async error handling | PASS | All async functions have outer try-catch; no unhandled promise rejections |
| Batch query optimization | ISSUE | `entity-linker.ts` batch edge counts correctly, but `getSpecFolder` is still per-loop (P1-01) |
| TypeScript patterns | PASS | Interfaces well-defined, type assertions minimal, explicit `unknown` in catch blocks |
| Feature flag gating | PASS | All deferred features behind env-var flags with `isFeatureEnabled()` helper |

---

## Positive Highlights

1. **TF-IDF implementation quality** — Pure TypeScript with zero dependencies, correct IDF formula, proper normalization using `reduce` to avoid stack overflow on large arrays, narrative-order sentence return. Production-ready.

2. **Entity linker batch optimization** — The `batchGetEdgeCounts()` batch pre-fetch is a well-structured solution to the N+1 pattern, with in-memory cache updates that keep counts accurate within a single run without extra DB round-trips.

3. **Density guard design** — Dual-layer guard: pre-run global check in `runEntityLinking()` plus per-link projected density check in `createEntityLinks()` with a live running counter. This correctly prevents both pre-existing overflow and mid-run explosion.

4. **N3-lite fail-open cadence** — The outer catch in `runConsolidationCycleIfEnabled()` falls back to running the cycle once rather than failing silently or failing hard. Correct behavior for a maintenance task.

5. **Hierarchy cache with explicit invalidation** — `invalidateHierarchyCache(database)` exported for callers that modify spec folder membership. This prevents stale tree data without forcing manual TTL tuning.

6. **Constitutional directive extraction defensiveness** — File read errors in `enrichWithRetrievalDirectives()` fall back to title-only directive rather than throwing. `null` return only when both content and title are empty — the function is practically non-failing.

---

## Files Reviewed

| File | Lines | Issues Found |
|------|-------|--------------|
| `hooks/memory-surface.ts` | 279 | P2-02 (suggestion) |
| `lib/search/retrieval-directives.ts` | 344 | None |
| `lib/search/spec-folder-hierarchy.ts` | 273 | P2-01, P2-03 (suggestions) |
| `lib/search/folder-discovery.ts` | 547 | None (not a primary feature file; reviewed for context) |
| `lib/search/memory-summaries.ts` | 237 | P2-01 (suggestion) |
| `lib/search/tfidf-summarizer.ts` | 252 | P2-01 (suggestion) |
| `lib/storage/consolidation.ts` | 503 | None |
| `lib/search/entity-linker.ts` | 544 | P1-01 (required) |

---

## Recommendation

**CONDITIONAL PASS**

Features 55, 56, 58, and 59 are fully correct and ready. Feature 57 is correctly implemented for the documented spec values (self=1.0, parent=0.8, grandparent=0.6, floor=0.3) with only minor documentation and a rare edge-case note. Feature 60 is functionally correct with one performance issue (P1-01) that should be addressed before high-scale deployment.

The P1-01 issue in Feature 60 does not cause incorrect results; it causes unnecessary DB queries proportional to entity match size. Since the density guard naturally bounds the number of matches processed, this is tolerable at current scale but should be fixed before the entity linking feature is enabled in production environments with large entity catalogs.
