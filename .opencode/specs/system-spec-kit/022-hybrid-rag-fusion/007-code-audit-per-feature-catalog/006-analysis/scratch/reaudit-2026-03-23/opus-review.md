# Phase 006 Review: Analysis

**Reviewer:** Opus 4.6 (1M context)
**Date:** 2026-03-23
**Analyst:** GPT-5.4 (gpt54-analyst.md)
**Verifier:** GPT-5.3-Codex (codex53-verifier.md)

---

## Summary

| Metric | Value |
|--------|-------|
| Features reviewed | 7 |
| MATCH | 3 |
| PARTIAL | 4 |
| MISMATCH | 0 |
| Agreement rate (analyst vs verifier) | 100% (7/7 identical verdicts) |
| Changes from prior audit | 2 features changed (01, 03: MATCH -> PARTIAL) |

Both delegates produced identical verdicts for all 7 features. Independent source code verification confirmed every verdict. The analyst report was factually accurate on 6 of 7 features but contained one incorrect claim on Feature 03 (see Disagreements). The verifier report was factually accurate across all 7 features.

---

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence | Notes |
|---|---------|---------|----------|-------|------------|-------|
| 01 | Causal edge creation (`memory_causal_link`) | PARTIAL | PARTIAL | PARTIAL | 95% | Catalog lists `causal-links-processor.ts` but not the actual MCP handler `causal-graph.ts:432` or the indexing caller `memory-index.ts:497-523` |
| 02 | Causal graph statistics (`memory_causal_stats`) | MATCH | MATCH | MATCH | 95% | Catalog correctly lists `causal-graph.ts`; behavioral claims verified accurate |
| 03 | Causal edge deletion (`memory_causal_unlink`) | PARTIAL | PARTIAL | PARTIAL | 95% | Catalog lists `causal-links-processor.ts` but not the actual MCP handler `causal-graph.ts:652`; auto-cleanup paths omitted from source list |
| 04 | Causal chain tracing (`memory_drift_why`) | MATCH | MATCH | MATCH | 95% | Catalog correctly lists `causal-graph.ts`; all traversal behaviors verified |
| 05 | Epistemic baseline capture (`task_preflight`) | MATCH | MATCH | MATCH | 95% | Behavioral claims accurate; source list bloated but complete for relevant files |
| 06 | Post-task learning measurement (`task_postflight`) | PARTIAL | PARTIAL | PARTIAL | 90% | Re-correction behavior (postflight on already-complete records) undocumented in catalog |
| 07 | Learning history (`memory_get_learning_history`) | PARTIAL | PARTIAL | PARTIAL | 90% | Layer classification mismatch (code says L7, catalog groups as L6); `includeSummary` param omitted; trend boundary off-by-one |

---

## Disagreements

### Between Analyst and Verifier

No disagreements. All 7 verdicts were identical across both reports.

### Between Delegates and Independent Verification

**Feature 03 -- Analyst factual error (corrected, verdict unchanged)**

The analyst (GPT-5.4) claimed: "current code does automatic cleanup with direct SQL, not by calling that helper" (`deleteEdgesForMemory()`), citing `vector-index-mutations.ts:68` as the auto-cleanup path.

Independent verification proves this claim incorrect:
- `memory-crud-delete.ts:115` calls `causalEdges.deleteEdgesForMemory(String(numericId))` -- the library helper, not direct SQL
- `memory-bulk-delete.ts:201` calls `causalEdges.deleteEdgesForMemory(String(memory.id))` -- same library helper
- The direct SQL at `vector-index-mutations.ts:68-74` is a separate utility used by the vector index mutation layer, not by the main memory delete handlers

The catalog's claim that `deleteEdgesForMemory()` is called during `memory_delete` is **correct**. The analyst's challenge of that claim was wrong.

However, the PARTIAL verdict still holds because the catalog omits the actual MCP handler path (`causal-graph.ts:652`) and dispatch file (`causal-tools.ts`), listing only `causal-links-processor.ts`.

The verifier (GPT-5.3-Codex) correctly identified the real auto-cleanup call sites at `memory-crud-delete.ts:114` and `memory-bulk-delete.ts:201` and did not make this error.

---

## Changes from Prior Audit

| # | Feature | Prior Verdict | Current Verdict | Change Reason |
|---|---------|---------------|-----------------|---------------|
| 01 | Causal edge creation | MATCH | PARTIAL | Catalog source map now recognized as missing the actual MCP handler (`causal-graph.ts`) and indexing caller (`memory-index.ts`). Prior audit may not have checked handler-level file references. |
| 03 | Causal edge deletion | MATCH | PARTIAL | Same pattern as Feature 01: catalog lists `causal-links-processor.ts` instead of the actual MCP handler `causal-graph.ts`. Prior audit noted missing files as a cross-cutting issue but still rated MATCH. |
| 06 | Post-task learning measurement | PARTIAL | PARTIAL | No change. Re-correction behavior remains undocumented. |
| 07 | Learning history | PARTIAL | PARTIAL | No change. Layer mismatch and `includeSummary` omission persist. |

The prior audit scored 5 MATCH / 2 PARTIAL. This re-audit scores 3 MATCH / 4 PARTIAL. The difference is that Features 01 and 03 were downgraded because the catalog's source file lists reference `causal-links-processor.ts` (a lower-level mutation processor) while omitting `handlers/causal-graph.ts` (where the actual MCP tool handler functions live). The prior audit noted missing handler files as a cross-cutting issue but did not downgrade individual verdicts for it.

---

## Recommendations

### Catalog Fixes (4 items)

1. **Features 01 and 03**: Replace `causal-links-processor.ts` with `causal-graph.ts` in the source file tables, or add `causal-graph.ts` alongside it. Also add `tools/causal-tools.ts` (dispatch layer). For Feature 01, also add `handlers/memory-index.ts` (spec doc chain creation caller).

2. **Feature 06**: Document the re-correction behavior. The handler at `session-learning.ts:396-403` explicitly accepts both `preflight` and `complete` phase records, allowing postflight to be called again on completed records. Add a sentence to the Current Reality section.

3. **Feature 07**: (a) Fix the trend boundary: catalog says "7-15 positive" but code uses `> 7` (exclusive), so 7.00 exactly falls to "slight." (b) Document the `includeSummary` parameter (default `true`) in the Current Reality section. (c) Resolve or document the layer classification mismatch -- `tool-schemas.ts:519` labels the tool `[L7:Maintenance]` but the catalog groups it under `06--analysis`.

4. **Cross-cutting -- source list bloat**: Features 05, 06, and 07 each list 40+ implementation files and 30+ test files. The vast majority are shared infrastructure irrelevant to the specific feature. Consider trimming to feature-relevant files only (roughly 8-12 per feature).

### Delegate Quality Assessment

| Delegate | Accuracy | Evidence Quality | Verdict |
|----------|----------|-----------------|---------|
| GPT-5.4 (analyst) | 6/7 features fully accurate; 1 factual error on Feature 03 auto-cleanup mechanism | Strong: cited specific file:line references throughout | Good overall; one error did not affect the final verdict |
| GPT-5.3-Codex (verifier) | 7/7 features fully accurate | Strong: systematic file verification, function verification, flag checks | Excellent; more methodical and no factual errors |

The verifier's structured checklist approach (Files OK? / Functions OK? / Flags OK? / Unreferenced?) proved more reliable than the analyst's narrative approach. For future audits, the checklist format should be the standard for both roles.
