# Audit H-03: mcp_server/lib/search/ (A-F)

**Agent:** Codex GPT-5.4 xhigh (read-only)
**Scope:** 18 files in `mcp_server/lib/search/` (anchor-metadata through folder-relevance)
**Date:** 2026-03-08

## Per-File Results

| File | P0 | P1 | SQL | Issues |
|------|----|----|-----|--------|
| anchor-metadata.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| artifact-routing.ts | FAIL (header; non-AI comments) | FAIL (missing TSDoc @11,22,36,42,208,231,239,310) | SAFE | 10 |
| auto-promotion.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| bm25-index.ts | FAIL (non-AI comments) | FAIL (missing TSDoc @12,22,56,72,97,109,121,287,294) | SAFE | 10 |
| causal-boost.ts | FAIL (header; non-AI comments) | FAIL (missing TSDoc @37,45) | UNSAFE (interpolated SQL @118-157,192-196) | 6 |
| channel-enforcement.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| channel-representation.ts | FAIL (non-AI comments) | PASS | SAFE | 1 |
| confidence-truncation.ts | FAIL (non-AI comments) | PASS | SAFE | 1 |
| context-budget.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| cross-encoder.ts | FAIL (header; non-AI comments) | FAIL (missing TSDoc @26,73,85,100,175,192,198,215,231,273,315,355,470,474,499,505; inline object param @354-358) | SAFE | 19 |
| dynamic-token-budget.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| embedding-expansion.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| encoding-intent.ts | FAIL (header; non-AI comments) | FAIL (missing TSDoc @19) | SAFE | 3 |
| entity-linker.ts | FAIL (header; non-AI comments; commented-out SQL @253-257) | FAIL (missing TSDoc @27,33,47,283; non-null assertions @337-338; catch lacks instanceof @165,179) | UNSAFE (interpolated SQL @259-264) | 12 |
| evidence-gap-detector.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| feedback-denylist.ts | FAIL (header; non-AI comments) | PASS | SAFE | 2 |
| folder-discovery.ts | FAIL (non-AI comments) | FAIL (catch lacks instanceof @496,670) | SAFE | 3 |
| folder-relevance.ts | FAIL (header; non-AI comments) | PASS | UNSAFE (interpolated SQL @110) | 3 |

## Summary

- **Files scanned:** 18
- **P0 issues:** 33 (headers + non-AI comment violations pervasive)
- **P1 issues:** 47
- **SQL issues:** 4 (causal-boost, entity-linker, folder-relevance)
- **Top 3 worst:** cross-encoder.ts (19), entity-linker.ts (12), artifact-routing.ts/bm25-index.ts (10 tied)

## SQL Safety Note

The "unsafe" SQL uses parameterized `?` placeholders for all user-supplied values — the interpolation is only for programmatically-generated `IN (?,?,?)` clauses with `.map(() => '?').join(', ')`. This is a standard safe pattern but technically fails the "no string interpolation" rule.
