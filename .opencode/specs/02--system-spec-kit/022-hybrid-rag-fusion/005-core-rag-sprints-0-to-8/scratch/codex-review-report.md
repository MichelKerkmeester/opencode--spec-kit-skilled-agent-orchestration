# Codex Review Report: 005-core-rag-sprints-0-to-8

Generated: 2026-03-08
Agents: 10 (5x gpt-5.3-codex + 5x gpt-5.4)
Coverage: 96 code files (~34,400 LOC) + 6 spec docs (~9,800 lines)

---

## Executive Summary

| Category | P0 | P1 | P2 | Total |
|----------|----|----|-----|-------|
| Code bugs + standards (W1) | 15 | 47 | 17 | 79 |
| Architecture (W2-A1) | 0 | 3 | 3 | 6 |
| Doc quality: spec+plan (W2-A2) | 833 | 369 | 0 | 1,202 |
| Doc quality: tasks+checklist+impl (W2-A3) | 2 | 16 | 1 | 19 |
| Traceability (W2-A4) | 3 | 3 | 3 | 9 |
| Consolidation + handover (W2-A5) | 2 | 5 | 1 | 8 |
| **Grand Total** | **855** | **443** | **25** | **1,323** |

**Key takeaways:**
- 15 P0 code bugs requiring immediate fixes across search pipeline, eval metrics, storage and handlers
- 833 P0 doc violations are systemic punctuation issues (em dashes, semicolons, Oxford commas) in spec.md + plan.md
- Architecture health: FAIR (0 circular deps, 0 layer violations, 4 SRP violations)
- Traceability: 82% coverage (27 verified, 3 failed, 6 partial)
- Consolidation: 46/54 consistent (8 gaps, 5 contradictions)
- DQI scores: spec.md 42, plan.md 45, tasks.md 77, checklist.md 78, implementation-summary.md 79

---

## P0 Findings (Must Fix)

### Code Bugs (15)

#### Search Pipeline (W1-A1: 2 P0)

1. **stage2-fusion.ts:653** | algorithm-correctness
   Non-hybrid flow applies `intentAdjustedScore` (Step 4), then later steps write `score`. Final ranking uses `resolveEffectiveScore()` which prefers `intentAdjustedScore`, so later boosts are ignored. Fix: update single canonical score field after Step 4.

2. **hybrid-search.ts:722** | algorithm-correctness
   `keywordWeight` applied to both `fts` and `bm25` lists independently, double-counting lexical weight and breaking fusion weight normalization. Fix: split keyword weight across lexical channels or combine before RRF.

#### Scoring + Graph (W1-A2: 2 P0)

3. **community-detection.ts:240** | algorithm-correctness
   Louvain `removeGain/insertGain` math does not match standard modularity delta-Q. Node moves can be accepted/rejected incorrectly. Fix: use canonical delta-Q per Blondel formula.

4. **community-detection.ts:334** | core-logic
   Debounce path returns `loadStoredAssignments(db)` but `detectCommunities()` never persists computed result. Returns stale/empty communities on repeated calls. Fix: cache in-memory or persist before debounce.

#### Eval Infrastructure (W1-A3: 4 P0)

5. **eval-metrics.ts:191** | metric-correctness (Recall@20)
   `computeRecall` counts duplicate relevant hits without deduping `memoryId`. Can produce Recall > 1. Fix: compute intersection on sets.

6. **eval-metrics.ts:232** | metric-correctness (F1)
   `computeF1` reuses duplicate-sensitive counting. Recall and F1 can exceed 1. Fix: dedupe IDs, clamp to [0,1].

7. **k-value-analysis.ts:96** | metric-correctness (MRR@5)
   `mrr5` averages reciprocal ranks for all baseline top-5 items instead of reciprocal rank of first relevant item. Not standard MRR@5. Fix: implement true MRR@5 or rename.

8. **bm25-baseline.ts:512** | baseline-correctness
   Runner trusts `searchFn` output without enforcing BM25/FTS-only sources or rank ordering. Baseline can be contaminated. Fix: validate source and verify ranking.

#### Cognitive + Storage (W1-A4: 3 P0)

9. **working-memory.ts:200** | SQLite-safety
   `cleanupOldSessions()` compares `last_focused` (CURRENT_TIMESTAMP format) against ISO string (`toISOString()`). Lexical comparison can delete active same-day sessions. Fix: use SQLite datetime math.

10. **transaction-manager.ts:217** | transaction-isolation
    On rename failure after DB commit, `executeAtomicSave()` deletes the pending file, destroying the only recoverable copy. Creates irreversible DB/file divergence. Fix: keep pending file for recovery.

11. **reconsolidation.ts:332** | mutation-ledger
    `executeConflict()` deprecates memory then inserts `supersedes` edge without validating UPDATE affected a row. Can create dangling causal edges. Fix: check `changes > 0` before edge creation.

#### Handlers (W1-A5: 4 P0)

12. **memory-ingest.ts:66** | input-validation (security)
    `memory_ingest_start` accepts arbitrary paths without allowlist validation. Can read/index files outside memory directories. Fix: apply same path-security checks as `memory_save`.

13. **chunking-orchestrator.ts:163** | error-handling (data-loss)
    Old child chunks deleted before new chunk indexing succeeds. If all new chunks fail, old children are gone. Fix: stage new children first, swap in transaction.

14. **reconsolidation-bridge.ts:112** | data-integrity
    `storeMemory` writes `content_hash` from `parsed.contentHash` instead of actual `memory.content`. Reconsolidated variants get mismatched hashes. Fix: compute hash from actual content.

15. **memory-bulk-delete.ts:81** | input-validation
    `olderThanDays` only applied when `> 0`. Negative values silently remove age filter, broadening deletions. Fix: hard-validate as positive integer.

### Traceability Failures (W2-A4: 3 P0)

16. **spec.md:430** | REQ-S1-003
    Claims agent-consumption instrumentation is operational. `consumption-logger.ts` hard-disables logging (always returns `false`). Feature not operational.

17. **spec.md:696** | REQ-S2-002
    Claims cold-start boost behind `SPECKIT_NOVELTY_BOOST`. `composite-scoring.ts:452-471` marks it deprecated. `calculateNoveltyBoost()` always returns 0. Feature absent.

18. **spec.md:2204** | REQ-S7-005
    Sprint 7 marked `Completed` claims INT8 quantization evaluation. No INT8/quantization symbols found anywhere in codebase.

### Consolidation Failures (W2-A5: 2 P0)

19. **handover.md:5** | handover-completeness
    Consolidated handover only includes Sprint 0 and Sprint 4 source handovers. Sprints 1-3, 5-8 absent from 9-sprint consolidation.

20. **implementation-summary.md:1247** | data-loss
    Sprint 8 loses completed work: tasks.md marks T001-T003 complete, but implementation summary only documents its own creation.

### Documentation Integrity (W2-A3: 2 P0)

21. **checklist.md:1304** | priority-taxonomy
    Introduces `P3` items and double-tags items as both P2 and P3. Breaks required P0/P1/P2 taxonomy. Affected: lines 1304-1308, 1318-1321, 1330-1331, 1393.

22. **checklist.md:1322** | evidence-arithmetic
    Claims `6,739/6,762 pass` implies 23 failures, not the stated 4. Pass count, total count, or failure count is wrong.

---

## P1 Findings (Should Fix)

### Code Standards (47 across W1)

#### Search Pipeline (7 P1)
- hybrid-search.ts:754 | MPAB parents not deduplicated after merge
- stage4-filter.ts:209 | `extractScoringValue()` returns raw similarity without 0-100 to 0-1 normalization
- stage3-rerank.ts:353 | `stage2Score` misses true effective score
- stage2-fusion.ts:554 | Metadata fields bypass Stage2Output contract via unsafe casts
- types.ts:119 | Boolean fields violate `is/has/can/should` prefix rule
- stage1-candidate-gen.ts:186 | Plain `Error` instead of structured error with code/context
- hybrid-search.ts:9 | Import groups interleaved

#### Scoring + Graph (11 P1)
- mpab-aggregation.ts:141 | `collapseAndReassembleChunkResults()` ignores feature flag
- composite-scoring.ts:604 | Legacy 6-factor weight normalization missing
- composite-scoring.ts:712 | `getFiveFactorBreakdown()` uses unnormalized weights
- graph-signals.ts:61 | Inconsistent degree computation between `snapshotDegrees()` and `getCurrentDegree()`
- graph-signals.ts:358 | `applyGraphSignals()` runs unconditionally despite feature gate
- community-detection.ts:314 | `detectCommunities()` missing feature flag check
- community-detection.ts:459 | `Number.isFinite` allows non-integer IDs into DB
- composite-scoring.ts:230 | `parseLastAccessed()` lacks NaN/Infinity guard
- composite-scoring.ts:248 | `|| 1.0` treats valid `0` stability as missing
- community-detection.ts:530 | NaN score propagation
- confidence-tracker.ts:155 | `recordValidation()` swallows all errors

#### Eval Infrastructure (10 P1)
- bm25-baseline.ts:355 | `computeBootstrapCI` no guard for invalid iterations
- bm25-baseline.ts:482 | Metric names hardcoded when K is configurable
- eval-metrics.ts:115 | `computeMRR` uses slice index instead of actual rank
- eval-quality-proxy.ts:111 | `computeCountSaturation` can return negative
- eval-quality-proxy.ts:127 | `computeLatencyScore` can exceed 1
- reporting-dashboard.ts:237 | LIMIT without ORDER BY
- reporting-dashboard.ts:205 | Heuristic truncation can drop runs
- ground-truth-feedback.ts:149 | Global schema flag not keyed by DB path
- ablation-framework.ts:63 | `baselineRunId` documented but never used
- ablation-framework.ts:425 | Baseline query count from wrong source
- eval-db.ts:149 | Generic Error instead of typed custom error

#### Cognitive + Storage (8 P1)
- consolidation.ts:350 | `runHebbianCycle()` uses wrong DB handle via module global
- consolidation.ts:351 | Counters increment on failed updates
- temporal-contiguity.ts:73 | Division-by-zero with invalid `windowSeconds`
- access-tracker.ts:80 | Batch path bypasses accumulator size guard
- access-tracker.ts:110 | Mixed timestamp types (ISO text vs epoch numbers)
- mutation-ledger.ts:361 | Race condition in divergence reconcile
- reconsolidation.ts:505 | Orphaned vector rows on conflict cleanup
- reconsolidation.ts:121 | Feature flag default contradicts docs

#### Handlers (11 P1)
- tool-schemas.ts:267 | `olderThanDays` schema allows negatives
- memory-crud-delete.ts:98 | Success envelope for error path
- memory-crud-update.ts:191 | Success envelope for error path
- memory-crud-update.ts:75 | No guard for empty update
- memory-search.ts:652 | Incomplete `concepts` validation
- tool-schemas.ts:410 | Schema max (50) vs handler max (100) mismatch
- causal-graph.ts:502 | No source/target existence check, no strength clamping
- causal-graph.ts:647 | No integer/positive check on edgeId
- tool-schemas.ts:329 | Strength schema lacks min/max constraints
- memory-save.ts:124 | Handler contains substantial business logic (boundary violation)
- memory-search.ts:805 | Double casts bypass type safety

### Architecture (3 P1)
- context-server.ts:21 | God module (45 imports, monolithic control plane)
- hybrid-search.ts:8 | God module (1700 LOC, 25 imports, 8+ mixed concerns)
- memory-search.ts:9 | Handler not thin transport adapter

### Traceability (3 P1)
- spec.md:978 | Quality floor spec says 0.2, code says 0.005
- spec.md:1304 | Shadow scoring claimed operational, code returns null/false
- spec.md:2222 | R8 scale-gate omits `is_archived` filter

### Documentation (16 P1 across tasks+checklist+impl)
- tasks.md: 255 em-dash violations, 136 semicolons, 17 Oxford commas, H2 format non-compliance, inconsistent task ID schemes
- checklist.md: 292 em-dashes, 107 semicolons, 5 Oxford commas, H2 format, 227 placeholder evidence fields, 3 false completion claims
- implementation-summary.md: 106 em-dashes, 51 semicolons, 29 Oxford commas, H2 format, heading contradiction

### Consolidation (5 P1)
- spec.md:3 | Folder=005, title=006, intro says 006-018, frontmatter says 010-018
- plan.md:433 | Sprint 1/2 marked "Pending" vs "Complete" in other docs
- handover.md:142 | Stale file paths, missing memory files
- implementation-summary.md:812 | Sprint 6b partial coverage
- spec.md:2393 | Sprint 8 successor chain broken

---

## P2 Findings (Track)

17 code style issues + 3 architecture + 3 traceability naming + 1 consolidation + 1 doc = 25 total.

Key items:
- Boolean naming violations: `detected`, `triggerCacheCleared`, `passed`, `use_five_factor_model`
- File organization order issues in 4 modules
- Disallowed `AI:` comment prefix in causal-edges.ts, checkpoints.ts
- Import grouping issues
- Type union collapse (`ChannelName | string` = `string`)
- Snake_case local identifiers in session-learning.ts

---

## Architecture Assessment (W2-A1)

```
Layer violations:      0
Circular dependencies: 0
SRP violations:        4
Overall health:        FAIR
```

**SRP hotspots:**
1. `context-server.ts` (45 imports, monolithic)
2. `hybrid-search.ts` (1700 LOC, 25 imports, 8 concerns)
3. `memory-search.ts` handler (coordinates 6+ concerns)
4. `stage2-fusion.ts` (18 imports, integration hotspot)

**Positive:** No circular dependencies detected. No layer boundary violations (handler -> lib -> shared direction maintained).

---

## Documentation Quality (DQI Scores)

| Document | DQI Score | Band |
|----------|-----------|------|
| spec.md | 42/100 | Needs work |
| plan.md | 45/100 | Needs work |
| tasks.md | 77/100 | Good |
| checklist.md | 78/100 | Good |
| implementation-summary.md | 79/100 | Good |

**Systemic issues in spec.md + plan.md:** 833 P0 violations (mostly em dashes and semicolons). These are bulk punctuation violations requiring a find-and-replace pass across both files.

---

## Traceability Assessment (W2-A4)

```
Verified:     27 claims
Failed:        3 claims (missing features claimed as complete)
Partial:       6 claims (parameter mismatches, stale flags)
Coverage:     82%
```

**Failed claims:**
1. Agent consumption instrumentation (hard-disabled)
2. Cold-start novelty boost (deprecated, returns 0)
3. INT8 quantization evaluation (no code exists)

---

## Consolidation Integrity (W2-A5)

```
Consistent:     46/54 data points
Gaps:            8
Contradictions:  5
```

**Critical gaps:**
1. Handover missing 7 of 9 sprints
2. Sprint 8 implementation summary incomplete
3. Numbering inconsistency (folder 005 vs title 006)
4. Cross-doc status misalignment for Sprints 1-2
5. Broken successor chain for Sprint 8

---

## Recommendations

### Immediate (P0 fixes)
1. Fix 15 code bugs (prioritize security: memory-ingest path validation, bulk-delete validation)
2. Fix 3 traceability failures (update spec to match code reality, or implement missing features)
3. Complete handover.md with all 9 sprint summaries
4. Fix checklist arithmetic error and remove P3 category
5. Run em-dash/semicolon/Oxford comma replacement across all 6 docs

### Short-term (P1 fixes)
1. Normalize feature flag enforcement across graph/community/scoring modules
2. Fix error envelope consistency in CRUD handlers
3. Align schema constraints with handler validation
4. Address 4 SRP hotspots (hybrid-search.ts decomposition highest value)

### Track (P2)
1. Boolean naming convention sweep
2. File organization order normalization
3. Comment prefix standardization

---

## Agent Outputs

Raw outputs preserved at `/tmp/codex-review/`:
- w1-a1.md through w1-a5.md (Wave 1: code review)
- w2-a1.md through w2-a5.md (Wave 2: doc + architecture)

---

*Report generated by Claude Opus 4.6 orchestrating 10 Codex CLI agents (5x gpt-5.3-codex, 5x gpt-5.4)*
