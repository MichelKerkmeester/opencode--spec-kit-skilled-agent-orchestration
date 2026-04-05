---
title: "Deep Research v2 — Iteration 004"
focus: "Q12+Q15+Q7(deep): Description enrichment, handback protocol, abort ownership, quality scoring dual system, phase doc freshness"
newInfoRatio: 0.52
timestamp: "2026-03-20T12:15:00Z"
---

# Iteration 004

## Q12: Description Enrichment + Fallback (A1 — ANSWERED)
- 8 distinct fallback text patterns identified across 6 source files
- Fallback-capable paths: 25-80% of branches per module
- Impact: placeholder descriptions score 0 in quality scorer, can degrade sufficiency and embedding quality
- Mitigations exist: trigger extractor filters generic tokens, frontmatter stripped from weighted sections
- "continued work on" NOT found in current codebase (was removed or never existed)

## Quality Scoring Dual System (A3 — CRITICAL FINDING)
**3 severity levels found:**
1. **CRITICAL: Indexed quality_score can be forced to 0 when quality gates pass.** Warnings prepended before frontmatter cause quality-extractors.ts to return 0. Confirmed chain: workflow.ts:2168,2174,2252 → quality-extractors.ts:5,12,21 → memory-indexer.ts:123.
2. **HIGH: Legacy and v2 scores intentionally disagree.** Test proves: legacy 0.4 vs v2 0.9. Abort gates use legacy. Frontmatter/index stores v2.
3. **MEDIUM: RC-7 note misleading.** metadata.filtering.qualityScore is from content-filter (0-100), not quality-scorer.

**Consolidation NOT safe as hard cutover.** Phased approach: fix frontmatter consistency first, then migrate consumers.
