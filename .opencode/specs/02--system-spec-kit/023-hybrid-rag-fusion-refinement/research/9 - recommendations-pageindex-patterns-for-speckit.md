# PageIndex Patterns for Spec-Kit: Actionable Recommendations

## Metadata

| Field         | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| Research ID   | RESEARCH-140-011                                                       |
| Status        | Complete                                                               |
| Date          | 2026-02-26                                                             |
| Companion     | RESEARCH-140-010 (Technical Analysis)                                  |
| Scope         | Spec-Kit Memory MCP Server + Spec-Kit Logic (non-memory)               |
| Method        | 5-agent synthesis → pattern extraction → sprint mapping                |

---

## Executive Summary

From the 14 transferable patterns identified in the PageIndex technical analysis, this document distills 8 actionable recommendations — 5 for the memory MCP server, 3 for spec-kit logic. Each recommendation is mapped to a specific spec 140 sprint, includes implementation effort, and identifies risks. The highest-impact, lowest-effort recommendations are: (1) DocScore-style folder aggregation for search scoring, (2) strategy degradation fallback chains, and (3) pre-flight token budget validation. These three can be implemented within existing sprints without architectural changes.

---

## Part A: Memory MCP Server Recommendations

### A1. Folder-Level Relevance Scoring via DocScore Aggregation

**Pattern source:** PageIndex semantic multi-doc search (DocScore formula)

**Current gap:** `memory_search` returns individual memories ranked by similarity score. When memories cluster by spec folder, there is no mechanism to assess folder-level relevance. A query matching 15 low-relevance memories in folder A appears stronger than 2 high-relevance memories in folder B.

**Recommendation:** Implement a folder aggregation step in the reranking pipeline:

```
FolderScore = (1 / sqrt(M + 1)) * SUM(MemoryScore(m))
```

Where `M` is the count of matching memories in the folder. This produces a secondary ranking: query results can be grouped by folder with a folder-level relevance score, enabling the two-phase pattern (select folders first, then search within).

**Sprint mapping:** Sprint 2 (Scoring Calibration) — extends R-006 (weight rebalancing) and R-007 (scoring pipeline)

**Effort:** Low (4-8h). Pure scoring logic addition to existing reranker. No schema changes.

**Risk:** Low. Additive change; existing search behavior preserved when folder grouping is not requested.

---

### A2. Search Strategy Degradation with Fallback Chain

**Pattern source:** PageIndex mode fallback (TOC_with_pages → TOC_no_pages → No_TOC)

**Current gap:** `memory_search` uses a single retrieval path. When the primary embedding search returns poor results (low similarity scores, few matches), there is no automatic fallback to alternative strategies.

**Recommendation:** Implement a three-tier fallback chain:

```
Tier 1: Full hybrid search (embedding + reranking + causal boost)
  → If top result similarity < 0.4 OR result count < 3:

Tier 2: Broadened search (relaxed filters, expanded limit, trigger matching)
  → If still insufficient:

Tier 3: Structural search (spec folder browsing, tier-based listing)
```

Each tier degrades precision but increases recall. The transition thresholds should be configurable. The key insight from PageIndex is that fallback should be **automatic and bounded** — not requiring user intervention.

**Sprint mapping:** Sprint 3 (Retrieval Enhancement) — new recommendation alongside R-010 (hybrid fusion), R-012 (graph integration)

**Effort:** Medium (12-16h). Requires refactoring `memory_search` to support multiple strategies and transition logic.

**Risk:** Medium. Fallback thresholds need tuning via eval framework (Sprint 0 dependency). Poor thresholds could cause unnecessary degradation.

---

### A3. Pre-Flight Token Budget Validation

**Pattern source:** PageIndex `check_token_limit()` before LLM submission

**Current gap:** Memory search results are assembled and returned without verifying they fit within the caller's token budget. The `tokenUsage` parameter in `memory_context` is advisory but not enforced at the search level.

**Recommendation:** Add a pre-flight check before result assembly:

```
1. Estimate total tokens for candidate results (title + summary or full content)
2. If exceeds caller budget: truncate result set (highest-scoring first)
3. If includeContent=true and single result exceeds budget: return summary instead
4. Log budget overflow events for monitoring
```

**Sprint mapping:** Sprint 1 (Calibration) — extends R-004 (baseline scoring benchmarks)

**Effort:** Low (4-6h). Token counting utility already exists. Logic addition to result assembly.

**Risk:** Low. Truncation is a safe degradation — returning fewer high-quality results is better than overflowing.

---

### A4. Constitutional Memory as Expert Knowledge Injection

**Pattern source:** PageIndex expert knowledge injection into search prompts

**Current gap:** Constitutional memories are included in search results via `includeConstitutional: true`, but they are formatted identically to other results. They appear as additional context, not as search-guiding instructions.

**Recommendation:** When constitutional memories are surfaced, format them as **retrieval directives** rather than content:

```
Current: "Memory: Use generate-context.js for saves" (content item)
Proposed: "SEARCH DIRECTIVE: When query involves saving context,
           prioritize memories related to generate-context.js workflows"
```

In practice, this means the `memory_context` orchestration layer should parse constitutional memories for search-relevant instructions and inject them into the query expansion step, not just append them to results.

**Sprint mapping:** Sprint 4 (Context Enhancement) — extends R-015 (context-aware retrieval)

**Effort:** Medium (8-12h). Requires classifying constitutional memories by function (search directives vs. informational) and modifying context assembly.

**Risk:** Low-Medium. Misclassified constitutional memories could misdirect search. Mitigation: start with explicit `search_directive: true` metadata on qualifying memories.

---

### A5. Verify-Fix-Verify for Memory Quality

**Pattern source:** PageIndex accuracy verification with bounded correction

**Current gap:** `memory_validate` records usefulness feedback, and `memory_health` reports system status. But there is no automated pipeline that detects quality issues and attempts correction.

**Recommendation:** Implement a bounded quality loop for memory indexing:

```
1. VERIFY: After memory_save, check embedding quality
   (cosine self-similarity > 0.7, title-content alignment > 0.5)
2. FIX: If below threshold, re-generate embedding with enhanced metadata
3. RE-VERIFY: Check quality again
4. FALLBACK: If still failing after 2 retries, flag for manual review
```

The bounded retry (max 2, not 3 as in PageIndex — memory saves are less critical than document indexing) prevents infinite loops while catching the most common embedding quality issues.

**Sprint mapping:** Sprint 0 (Evaluation Infrastructure) — extends R-001 (eval framework) and R-002 (quality metrics)

**Effort:** Medium (12-16h). Requires quality scoring functions and integration into the save pipeline.

**Risk:** Medium. Quality thresholds need calibration. Start conservative (accept most, flag outliers).

---

## Part B: Spec-Kit Logic Recommendations (Non-Memory)

### B1. Tree Thinning for Spec Folder Consolidation

**Pattern source:** PageIndex `tree_thinning_for_index()` (bottom-up merge of small nodes)

**Current gap:** Spec folders accumulate many small files over time — scratch notes, partial research, incremental updates. When context is loaded, these small items consume disproportionate token budget relative to their information content.

**Recommendation:** Implement a tree thinning pass when loading spec folder context:

```
1. List all content files in spec folder hierarchy
2. For each file < 200 tokens: merge summary into parent section summary
3. For each file < 500 tokens: use file content directly as summary (no LLM call)
4. Present the thinned view as the default context loading mode
```

**Key threshold mapping from PageIndex:**
- PageIndex uses 5000 tokens for thinning, 200 for "text IS summary"
- For memory files (shorter, more focused): use 300 tokens for thinning, 100 for "text IS summary"

**Sprint mapping:** Not directly mapped to spec 140 (this is spec-kit logic, not memory MCP). Would be a separate spec item or an extension of the generate-context.js workflow.

**Effort:** Medium (10-14h). Requires file size analysis, merge logic, and integration with context generation.

**Risk:** Low. Thinning is a view layer optimization — original files are preserved.

---

### B2. Progressive Validation for Spec Documents

**Pattern source:** PageIndex verify-fix-verify cycle + strategy degradation

**Current gap:** Spec validation (`validate.sh`) is pass/fail with warnings. There is no automatic fix attempt when validation detects issues.

**Recommendation:** Extend validation with a progressive fix pipeline:

```
Level 1: DETECT — Identify missing fields, broken references, format issues
Level 2: AUTO-FIX — Apply safe fixes (add missing dates, fix heading levels,
         normalize whitespace)
Level 3: SUGGEST — For issues requiring judgment, present options
Level 4: REPORT — Unresolvable issues flagged for manual review
```

This mirrors PageIndex's approach: attempt automatic correction for deterministic issues, escalate ambiguous ones, and report what cannot be fixed.

**Sprint mapping:** Independent of spec 140. Would enhance the existing spec-kit validation pipeline.

**Effort:** Medium-High (16-24h). Requires classifying validation errors by fixability and implementing auto-fix rules.

**Risk:** Medium. Auto-fixes could introduce errors if fix rules are wrong. Mitigation: all auto-fixes logged with before/after diff.

---

### B3. Description-Based Spec Folder Discovery

**Pattern source:** PageIndex description-based multi-document pre-filtering

**Current gap:** Finding the right spec folder for a task currently relies on naming conventions and manual browsing. `memory_search` can find memories by content, but there's no lightweight way to ask "which spec folder is relevant to X?"

**Recommendation:** Generate and cache a one-sentence description for each spec folder (derived from spec.md title + summary):

```
02--system-spec-kit/125-memory-upgrade: "Memory system upgrade adding causal edges,
  session dedup, and working memory features"
02--system-spec-kit/022-hybrid-rag-fusion: "36-recommendation program to add BM25,
  graph retrieval, evaluation framework, and scoring calibration"
```

These descriptions can be presented to an LLM or even used for simple keyword matching to route tasks to the correct spec folder. This is the lowest-cost implementation of PageIndex's description strategy.

**Sprint mapping:** Independent of spec 140. Enhances spec-kit folder navigation.

**Effort:** Low (4-8h). Script to extract first paragraph of each spec.md, cache as descriptions.json.

**Risk:** Low. Descriptions are supplementary metadata — no impact on existing workflows.

---

## Priority Matrix

| Rec  | Impact | Effort  | Risk   | Dependencies      | Recommended Order |
| ---- | ------ | ------- | ------ | ----------------- | ----------------- |
| A1   | High   | Low     | Low    | None              | 1st               |
| A3   | Medium | Low     | Low    | None              | 2nd               |
| B3   | Medium | Low     | Low    | None              | 3rd               |
| A2   | High   | Medium  | Medium | Sprint 0 (eval)   | 4th               |
| A4   | Medium | Medium  | Low-Med| Constitutional tagged | 5th           |
| B1   | Medium | Medium  | Low    | None              | 6th               |
| A5   | Medium | Medium  | Medium | Sprint 0 (eval)   | 7th               |
| B2   | Medium | Med-High| Medium | Validation rules   | 8th               |

**Quick wins (implement now):** A1, A3, B3 — combined effort ~12-22h, no dependencies, additive changes

**After Sprint 0:** A2, A5 — require evaluation infrastructure for threshold tuning

**Independent improvements:** B1, B2, B3 — enhance spec-kit logic regardless of memory MCP timeline

---

## Risk Summary

| Risk Category         | Mitigation                                              |
| --------------------- | ------------------------------------------------------- |
| Threshold tuning      | Use eval framework (Sprint 0) before setting production thresholds |
| LLM cost at retrieval | Tree search is optional; embedding search remains default |
| Fallback noise        | Conservative thresholds initially; tighten with data    |
| Auto-fix errors       | Log all auto-fixes with diffs; manual review for first month |
| Constitutional drift  | Explicit metadata tagging (`search_directive: true`) rather than content parsing |

---

## Migration Pathway

**Phase 1 (Weeks 1-2):** Implement A1 (DocScore), A3 (token budget), B3 (descriptions). These are additive changes with zero regression risk.

**Phase 2 (Weeks 3-4, after Sprint 0):** Implement A2 (fallback chain) and A4 (constitutional formatting). These require quality metrics to validate.

**Phase 3 (Weeks 5-8):** Implement B1 (tree thinning), A5 (verify-fix-verify), B2 (progressive validation). These are deeper changes that benefit from the infrastructure built in Phases 1-2.

**End state:** The memory MCP server gains folder-level scoring, automatic strategy degradation, and quality verification. Spec-kit logic gains thinning-based context optimization, progressive validation, and description-based discovery. Both systems become more resilient, more self-correcting, and better at handling edge cases — all patterns validated by PageIndex's production use at 98.7% accuracy on financial documents.

---

### Changelog

| Date       | Change                                     |
| ---------- | ------------------------------------------ |
| 2026-02-26 | Initial recommendations from 5-agent synthesis |
