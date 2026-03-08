# Audit H-04: mcp_server/lib/search/ (G-R)

**Agent:** Codex GPT-5.4 xhigh (read-only)
**Scope:** 14 files in `mcp_server/lib/search/` (fsrs through rsf-fusion)
**Date:** 2026-03-08

## Per-File Results

| File | P0 | P1 | Issues |
|------|----|----|--------|
| fsrs.ts | FAIL (WHY comment not AI-prefixed L68) | PASS | 1 |
| graph-flags.ts | FAIL (header malformed L1-L4) | PASS | 1 |
| graph-search-fn.ts | FAIL (WHY comments not AI-prefixed L75,100,376) | FAIL (non-null assertion lacks justification L404) | 2 |
| hybrid-search.ts | FAIL (WHY comments not AI-prefixed L472-473,583-584,699) | FAIL (inline object param types L252,330,366,1585; non-null assertions L478,705; missing TSDoc on interfaces L61,82) | 4 |
| intent-classifier.ts | FAIL (WHY comments not AI-prefixed L222-223,228,427) | FAIL (missing TSDoc on exported interfaces L8,15) | 2 |
| learned-feedback.ts | FAIL (header malformed L1-L21; WHY comments not AI-prefixed L219,283,582) | FAIL (bare catch without unknown+narrowing L289) | 3 |
| local-reranker.ts | FAIL (WHY comments not AI-prefixed L76,87,126,185-186,296-297) | FAIL (missing TSDoc on exported functions L180,202,295; catch lacks instanceof L277) | 3 |
| memory-summaries.ts | FAIL (header malformed L1-L4; WHY comments not AI-prefixed L32,189) | PASS | 2 |
| query-classifier.ts | FAIL (WHY comments not AI-prefixed L111,117,153,170) | FAIL (missing TSDoc on exported interface L8) | 2 |
| query-expander.ts | FAIL (header malformed L1-L5) | PASS | 1 |
| query-router.ts | FAIL (header malformed L1-L5) | PASS | 1 |
| reranker.ts | FAIL (header malformed L1-L7; WHY comments not AI-prefixed L43,46) | FAIL (missing TSDoc on exported interfaces L13,19) | 3 |
| retrieval-directives.ts | FAIL (WHY comments not AI-prefixed L218,222,225,237-238,259,322) | FAIL (bare catch without unknown+narrowing L329) | 2 |
| rsf-fusion.ts | FAIL (WHY comments not AI-prefixed L91,96,100,196,223) | FAIL (non-null assertions lack justification L155,157,158) | 2 |

## Summary

- **Files scanned:** 14
- **P0 issues:** 17 (all WHY comment violations or header malformation)
- **P1 issues:** 12
- **Top 3 worst:** hybrid-search.ts (4), learned-feedback.ts (3), local-reranker.ts (3), reranker.ts (3)
