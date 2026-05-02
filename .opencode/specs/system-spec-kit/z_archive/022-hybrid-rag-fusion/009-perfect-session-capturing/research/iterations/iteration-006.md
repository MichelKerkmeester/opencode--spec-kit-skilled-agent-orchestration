---
title: "Deep Research v2 — Iteration 006"
focus: "Q10+Q11+NEW-1 verification+Q6+Q15+cross-validation"
newInfoRatio: 0.38
timestamp: "2026-03-20T13:00:00Z"
---

# Iteration 006

## Q10: Template Warnings (A1 — ANSWERED)
- **Exactly one warning emitter** in template-renderer.ts:147: `Missing template data for: {{key}}`
- Fires when placeholder value is undefined/null AND key not in OPTIONAL_PLACEHOLDERS
- **Not purely cosmetic**: missing data replaced with `''`, so output is structurally valid but semantically degraded
- Workflow does NOT treat renderer warnings as failures — continues regardless
- If missing values break contract-required fields, abort happens at downstream contract gate
- **Conclusion: Yes, successful runs CAN emit template-data warnings** for non-optional-but-non-contract-critical fields
- Only 1 E2E test checks for warning absence (workflow-e2e.vitest.ts:444)

## Q11: Quality Distribution (A2 — ANSWERED)
- **n=9 memory files** in 009-perfect-session-capturing/memory/
- Distribution: min 0.82, max 1.00, mean 0.98, median 1.00
- 8/9 (88.9%) score exactly 1.00; 1 outlier at 0.82 (empty source fields, zero file counts)
- **Scoring mismatch found:** bimodal.md says "quality score: 0/100" in body but frontmatter `quality_score: 1.00`
- Quality scoring dimensions: triggers, topics, file descriptions, length, HTML leakage, dedup + contamination/sufficiency penalties
- memory-indexer.ts enforces NO numeric threshold — gating is upstream in workflow (default 0.15)
- Validation rules are source-agnostic (appliesToSources: 'all') — policy designed CLI-consistent

## NEW-1 Verification (A3 — CONFIRMED CRITICAL)
**Frontmatter displacement bug VERIFIED with evidence:**
- **3 prepend paths:** low-quality note (workflow.ts:2168-2170), simulation warning (:2174-2176), medium-quality warning (:2252-2254)
- **Parser strictness:** FRONTMATTER_RE is start-anchored (`^---`); extractQualityScore returns 0 when not matched
- **Real evidence:** 5/44 memory files in 010-subtree have displaced frontmatter (~11.4%)
  - 4 from low-quality notes, 1 from medium-quality warning
  - Concrete: bimodal.md starts with `> **Note:** ...` before `---`, so extractor returns quality_score=0
- **Fix approach:** Move warning insertion to after frontmatter (primary); strip leading banners before parse (fallback); reindex displaced files (cleanup)
