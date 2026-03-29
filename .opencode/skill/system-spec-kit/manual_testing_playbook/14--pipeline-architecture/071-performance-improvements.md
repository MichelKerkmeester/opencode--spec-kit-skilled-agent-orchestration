---
title: "071 -- Performance improvements"
description: "This scenario validates Performance improvements for `071`. It focuses on confirming key perf remediations active, including fallback split, token-estimate caching, and BM25 demotion behavior."
---

# 071 -- Performance improvements

## 1. OVERVIEW

This scenario validates Performance improvements for `071`. It focuses on confirming key perf remediations active, including fallback split, token-estimate caching, and BM25 demotion behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `071` and confirm the expected signals without contradicting evidence.

- Objective: Confirm key perf remediations active
- Prompt: `Verify performance improvements (Sprint 8). Capture the evidence needed to prove optimized code paths are active (not bypassed); tiered fallback collects fused candidates before a single enrichment pass; truncateToBudget() caches per-result token estimates instead of re-serializing each row; ENABLE_BM25 is opt-in while FTS5 remains the default lexical engine; BM25 warmup uses incremental syncChangedRows() maintenance instead of a blocking full rebuild; and heavy queries complete within acceptable time. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Optimized code paths are active (not bypassed); fallback enrichment is single-pass; token estimation is cached per result; BM25 is opt-in with FTS5 default; BM25 warmup uses incremental maintenance; heavy queries complete within acceptable time; no performance regressions
- Pass/fail: PASS if optimized paths are active and the fallback split, token cache, BM25 opt-in/default behavior, and incremental warmup are all visible in code/runtime evidence without regressions

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 071 | Performance improvements | Confirm key perf remediations active | `Verify performance improvements (Sprint 8). Capture the evidence needed to prove optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions. Include fallback split, token estimate caching, and BM25 opt-in maintenance evidence.` | 1) Inspect `hybrid-search.ts` and confirm `executeFallbackPlan()` collects fused tier outputs before `searchWithFallbackTiered()` calls `enrichFusedResults()` once on the final merged set 2) Inspect `truncateToBudget()` and confirm it caches token estimates in a `Map` keyed by canonical result id and uses field-aware `estimateResultTokens()` instead of whole-object serialization 3) Inspect `bm25-index.ts` and confirm `isBm25Enabled()` returns false unless `ENABLE_BM25` is explicitly set to an allowed truthy value 4) Confirm `rebuildFromDatabase()` schedules batched warmup through `syncChangedRows()` instead of performing a synchronous full rebuild 5) Run or review a representative heavy retrieval path and capture timing notes for the post-change code path | Optimized code paths are active; fallback enrichment is single-pass; token estimation is cached per result; BM25 stays disabled by default unless explicitly enabled; batched `syncChangedRows()` warmup replaces blocking rebuilds; heavy queries complete within acceptable time; no regressions | Code inspection evidence from `hybrid-search.ts` and `bm25-index.ts`, plus timing notes for a representative heavy retrieval path | PASS if optimized paths are active and evidence shows the fallback split, token cache, BM25 opt-in posture, and incremental warmup without regressions | Profile the heavy retrieval path; check whether enrichment helpers are re-entered per tier; inspect token-budget estimation for cache misses; verify BM25 enablement and warmup scheduling behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/08-performance-improvements.md](../../feature_catalog/14--pipeline-architecture/08-performance-improvements.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 071
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/071-performance-improvements.md`
