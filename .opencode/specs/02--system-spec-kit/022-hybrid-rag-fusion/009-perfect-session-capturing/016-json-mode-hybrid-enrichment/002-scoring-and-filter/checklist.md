---
title: "Verification Checklist: Scoring and Filter — Quality Scorer Recalibration and Contamination Filter Expansion"
description: "Verification Date: TBD"
trigger_phrases:
  - "scoring filter checklist"
  - "quality scorer verification"
  - "contamination filter verification"
  - "002-scoring-and-filter checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Scoring and Filter

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] spec.md, plan.md, tasks.md created and reviewed
- [ ] CHK-002 [P0] Live scorer confirmed at workflow.ts:39 import (extractors/quality-scorer.ts, NOT core/)
- [ ] CHK-003 [P0] Dead-code scorer (core/quality-scorer.ts) confirmed as NOT imported in any production path
- [ ] CHK-004 [P1] Baseline Vitest pass count recorded before any changes
- [ ] CHK-005 [P1] Round 2 research.md Domains C and E reviewed for source-line citations
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] TypeScript compiles without errors after all changes (`tsc --noEmit` or build step)
- [ ] CHK-011 [P0] No console.error or unhandled rejections introduced
- [ ] CHK-012 [P0] filterContamination calls in workflow.ts guard against undefined/null inputs
- [ ] CHK-013 [P1] resolveProjectPhase() follows exact same pattern as resolveContextType() — no new abstraction layers
- [ ] CHK-014 [P1] Contamination pattern additions use existing array structure — no new data types
- [ ] CHK-015 [P1] Post-save review penalty values are constants, not magic numbers inline
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] quality-scorer-calibration.vitest.ts imports extractors/quality-scorer.ts (not core/) [Evidence: file line 5]
- [ ] CHK-021 [P0] `npx vitest run quality-scorer-calibration` passes after import fix
- [ ] CHK-022 [P0] Full `npx vitest run` passes with zero regressions from baseline [Evidence: test output]
- [ ] CHK-023 [P0] End-to-end save with 5 simultaneous medium issues: quality_score < 0.80 [Evidence: saved file frontmatter]
- [ ] CHK-024 [P0] End-to-end save with clean content: quality_score >= 0.90 [Evidence: saved file frontmatter]
- [ ] CHK-025 [P0] End-to-end save with hedging in sessionSummary: saved memory does not contain hedging phrase [Evidence: saved file diff]
- [ ] CHK-026 [P0] End-to-end save with hedging in recentContext: saved memory entry is cleaned [Evidence: saved file diff]
- [ ] CHK-027 [P0] End-to-end save with hedging in technicalContext value: saved memory entry is cleaned [Evidence: saved file diff]
- [ ] CHK-028 [P1] End-to-end save with `"projectPhase": "IMPLEMENTATION"`: frontmatter shows `PROJECT_PHASE: IMPLEMENTATION` [Evidence: saved file frontmatter]
- [ ] CHK-029 [P1] End-to-end save without projectPhase: frontmatter shows `PROJECT_PHASE: RESEARCH` (inferred default) [Evidence: saved file frontmatter]
- [ ] CHK-030 [P1] End-to-end save with HIGH post-save finding: quality_score is lower than a save without findings [Evidence: two saved files compared]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets or API keys introduced
- [ ] CHK-041 [P0] Contamination patterns do not strip security-relevant content (e.g., "I cannot access" in a legitimate technical context)
- [ ] CHK-042 [P1] Safety disclaimer patterns tested against edge case: "I cannot reproduce the bug" should NOT be stripped
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md, plan.md, tasks.md synchronized with final implementation (no stale sections)
- [ ] CHK-051 [P1] decision-record.md ADR-001 (bonus removal), ADR-002 (filter scope), ADR-003 (post-save penalty) all marked Accepted
- [ ] CHK-052 [P1] research.md finding references in spec.md are accurate (line numbers cited match live file)
- [ ] CHK-053 [P2] Code comments added to new filterContamination call sites explaining why each field is now cleaned
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] No temporary debug files left in scripts/ directory
- [ ] CHK-061 [P1] scratch/ cleaned before completion claim
- [ ] CHK-062 [P2] Post-completion memory save created via generate-context.js with session findings
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 15 | 0/15 |
| P2 Items | 3 | 0/3 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] All three ADRs documented in decision-record.md with Accepted status
- [ ] CHK-101 [P1] ADR-001 (bonus removal) includes alternatives considered and rejection rationale
- [ ] CHK-102 [P1] ADR-002 (filter scope expansion) documents the 4 fields added and why each was missed originally
- [ ] CHK-103 [P1] ADR-003 (post-save penalty values) documents chosen penalty per severity level with rationale
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] filterContamination additions do not increase per-save latency by more than 10ms (NFR-P01) [Evidence: timing comparison or acceptable-magnitude assessment]
- [ ] CHK-111 [P2] Scorer recalibration has no measurable latency impact
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Safety disclaimer patterns reviewed: "I cannot" variant does not strip valid technical statements
- [ ] CHK-131 [P1] Hedging pattern list reviewed against real session content to confirm no valid prose is stripped
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized after implementation
- [ ] CHK-141 [P2] Parent phase container spec.md (../spec.md) status for 002-scoring-and-filter updated from Draft to Complete
<!-- /ANCHOR:docs-verify -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
