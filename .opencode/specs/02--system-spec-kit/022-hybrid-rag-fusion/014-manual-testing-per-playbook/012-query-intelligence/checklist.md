---
title: "Verification Checklist: manual-testing-per-playbook query-intelligence phase [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-16"
trigger_phrases:
  - "query intelligence checklist"
  - "phase 012 verification"
  - "query complexity router checklist"
  - "channel min-representation checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook query-intelligence phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: File `spec.md` requirements section created with REQ-001 through REQ-006 covering all six query-intelligence scenarios with playbook-derived acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: File `plan.md` created with summary, quality gates, architecture, phases, testing strategy, dependencies, and rollback sections]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: File `plan.md` dependency table lists playbook, review protocol, feature catalog, MCP runtime, and sandbox corpus with status]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] 033: channel selection trace confirms simple=2, moderate=3, complex=5 channels; disabled flag produces "complex" fallback routing [EVIDENCE: pending manual execution]
- [ ] CHK-011 [P0] 034: code-path inspection confirms no live RSF branch in hybrid-search ranking path; RRF is the sole fusion method in returned results [EVIDENCE: pending manual execution]
- [ ] CHK-012 [P0] 035: post-fusion channel representation output confirms >=1 result per active channel in top-k; quality floor at 0.005 filters sub-threshold promotions [EVIDENCE: pending manual execution]
- [ ] CHK-013 [P0] 036: truncation metadata in trace shows cliff detection at first gap > 2x median; minimum 3 results always returned; all-equal scores pass through unchanged [EVIDENCE: pending manual execution]
- [ ] CHK-014 [P0] 037: budget allocation log confirms 1500/2500/4000 token tiers per complexity class; disabled flag returns 4000-token default for all queries [EVIDENCE: pending manual execution]
- [ ] CHK-015 [P0] 038: expansion produces >=2 variants for complex query; baseline-first dedup removes duplicates; simple query returns no expansion variants [EVIDENCE: pending manual execution]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 6 query-intelligence scenarios executed with exact prompts and command sequences from the playbook [EVIDENCE: pending manual execution]
- [ ] CHK-021 [P0] Every scenario has an assigned verdict (PASS/PARTIAL/FAIL) with rationale using review protocol acceptance rules [EVIDENCE: pending manual execution]
- [ ] CHK-022 [P0] Coverage reported as 6/6 scenarios with no skipped test IDs [EVIDENCE: pending manual execution]
- [ ] CHK-023 [P1] Feature flags restored to default-enabled state after 033 and 037 flag-toggle tests [EVIDENCE: pending manual execution]
- [ ] CHK-024 [P1] Sandbox corpus used for 035 dominance test documented for reproducibility [EVIDENCE: pending manual execution]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced; this phase creates only Markdown documentation files [EVIDENCE: All four created files are spec-kit Markdown artifacts with no credentials, tokens, or environment-specific secrets]
- [x] CHK-031 [P0] No input-validation regression; query-intelligence tests use read-only MCP tool calls with existing sandbox corpus [EVIDENCE: Phase 012 scenarios are all non-destructive; no corpus mutations, schema changes, or write-path modifications are involved]
- [x] CHK-032 [P1] Auth/authz unaffected; query-intelligence features operate at the search/scoring layer only [EVIDENCE: Feature catalog files confirm all six features (R15, R14/N1, R2, R15-ext, FUT-7, R12) are search-layer features with no auth/authz surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] All four Level 2 artifacts created: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` [EVIDENCE: All four files written to `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/012-query-intelligence/` on 2026-03-16]
- [ ] CHK-041 [P1] `implementation-summary.md` created after execution and verification are complete [EVIDENCE: pending — to be created after Phase 3 task T012]
- [x] CHK-042 [P2] Playbook rows 033 through 038 cross-referenced in scope table with exact prompts and catalog links [EVIDENCE: `spec.md` scope table row per test ID with relative catalog links and playbook-derived prompts]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All files created in the correct phase folder `014-manual-testing-per-playbook/012-query-intelligence/` [EVIDENCE: Four files written to the target folder path; no files created outside scope]
- [x] CHK-051 [P1] No scratch artifacts created; all content is final phase documentation [EVIDENCE: No `scratch/` folder created; all four files are the required phase-documentation artifacts]
- [ ] CHK-052 [P2] Findings saved to memory after execution and verification [EVIDENCE: pending — memory save deferred until T012 implementation-summary is complete]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 5/11 |
| P1 Items | 7 | 4/7 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-03-16
**Note**: Phase 012 documentation artifacts are complete and structurally verified. P0 items CHK-010 through CHK-022 and P1 items CHK-023, CHK-024, and CHK-041 are pending manual execution of the six query-intelligence scenarios. Update this checklist with evidence inline after each scenario run.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
