---
title: "Deep Research v2 — Iteration 007"
focus: "Q6+Q15+cross-validation of top 5 findings"
newInfoRatio: 0.28
timestamp: "2026-03-20T13:30:00Z"
---

# Iteration 007

## Cross-Validation of Top 5 Findings (A3)
All 5 claims CONFIRMED against current code:
1. P1-03 first-child selection: `matchingResponses[0]` at opencode-capture.ts:808,812 — CONFIRMED
2. NEW-1 frontmatter displacement: workflow.ts:2168-2170 prepends before `---` when qualityScore<20 — CONFIRMED (PARTIAL: conditional on low-quality branch)
3. Source-capabilities migration: contamination-filter.ts:110 uses getSourceCapabilities — CONFIRMED
4. V2 index-blocking rule: blockOnWrite=false, blockOnIndex=true at validate-memory-quality.ts:47-52 — CONFIRMED
5. Live proof date: 2026-03-17 timestamps confirmed in JSON — CONFIRMED

## Q6: Automated Proof Protocol (A1)
Generate-context.ts CLI interface documented. Per-CLI test inputs and validation checks outlined.

## Q15: Handback Protocol (A2)
ValidateInputData schema examined. Handback JSON flows through the standard data-loader → normalizer → workflow pipeline.
