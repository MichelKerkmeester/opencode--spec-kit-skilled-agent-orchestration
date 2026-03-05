---
title: "Verification Checklist: Architecture Boundary Remediation"
description: "34 verification items across 9 categories for architecture boundary compliance remediation"
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
trigger_phrases:
  - "boundary remediation checklist"
  - "architecture verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Architecture Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:pre-impl-hardening -->
## Pre-Implementation Hardening (Phase 0 — Cross-AI Review)

- [x] CHK-050 [P0] CI enforcement mandated in spec.md (not "pre-commit or CI" — CI is required) → T019 [evidence: spec.md updated by Codex-1]
- [x] CHK-051 [P0] Regex evasion vectors documented with accepted risk or AST upgrade timeline → T020 [evidence: ADR-001 in decision-record.md by Codex-2]
- [x] CHK-052 [P0] Allowlist expiry-warning mechanism defined (30-day advance notice) → T021 [evidence: check-allowlist-expiry.ts created by Codex-2]
- [x] CHK-053 [P0] All file path cross-references in 030 docs resolve to actual locations → T022 [evidence: 9/9 paths verified by Codex-1]
- [x] CHK-054 [P0] SC-001 covers dynamic deep-require bypass, not just static allowlist count → T023 [evidence: SC-001 updated in spec.md by Codex-1]
<!-- /ANCHOR:pre-impl-hardening -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npx tsc --noEmit` passes after all import migrations
- [ ] CHK-011 [P0] No new forbidden-direction imports introduced
- [ ] CHK-012 [P1] Re-exports maintain backward compatibility (core/config re-exports DB_UPDATED_FILE)
- [ ] CHK-013 [P1] Import paths follow project conventions (@spec-kit/shared/* or @spec-kit/mcp-server/api/*)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:boundary-compliance -->
## Boundary Compliance

- [ ] CHK-020 [P0] `check-no-mcp-lib-imports.ts` passes with reduced allowlist
- [ ] CHK-021 [P0] `check-api-boundary.sh` passes (no lib/ to api/ reverse imports)
- [ ] CHK-022 [P0] `check-architecture-boundaries.ts` passes (shared/ neutrality intact)
- [ ] CHK-023 [P1] Allowlist reduced from 6 entries to 3 or fewer
- [ ] CHK-024 [P1] Removed allowlist entries have no remaining forbidden imports in codebase
<!-- /ANCHOR:boundary-compliance -->

---

<!-- ANCHOR:enforcement -->
## Enforcement Automation

- [ ] CHK-030 [P1] Pre-commit hook or CI step exists and runs boundary checks
- [ ] CHK-031 [P1] Enforcement completes in < 5 seconds
- [ ] CHK-032 [P2] Enforcement blocks merge on violation (CI exit code non-zero)
<!-- /ANCHOR:enforcement -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] ARCHITECTURE_BOUNDARIES.md exceptions table updated
- [ ] CHK-041 [P1] Allowlist `lastReviewedAt` dates current for retained entries
- [ ] CHK-042 [P2] implementation-summary.md created after completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:029-remediation -->
## 012 Documentation Remediation (Phase 4 — Cross-AI Review)

- [x] CHK-060 [P1] ADR-004 status updated from "Proposed" to "Accepted" → T024 [evidence: status set to Accepted by Codex-3]
- [x] CHK-061 [P1] 7 orphaned tasks (T018-T070) linked to checklist items → T025 [evidence: CHK-433 through CHK-439 added by Codex-4]
- [x] CHK-062 [P1] 029 implementation-summary.md includes Phases 4-6 artifacts → T026 [evidence: Phases 4-6 added by Codex-4]
- [x] CHK-063 [P1] T013a `escapeLikePattern` re-export removed from memory-save.ts → T027 [evidence: memory-save.ts updated by Codex-5]
- [x] CHK-064 [P1] handler-utils.ts ADR added to 029 decision-record.md → T028 [evidence: ADR-005 created by Codex-3]
- [x] CHK-065 [P1] 5 orphaned requirements (REQ-001,003,004,005,007) have task traceability → T029 [evidence: section 4.5 traceability table added by Codex-4]
<!-- /ANCHOR:029-remediation -->

---

<!-- ANCHOR:tech-debt -->
## Technical Debt Remediation (Phase 5 — Cross-AI Review)

- [x] CHK-070 [P2] Non-ASCII slug generation handles Unicode text without degradation → T030 [evidence: slug-utils.ts updated by Codex-5]
- [x] CHK-071 [P2] Frontmatter parsing uses robust delimiter detection (not naive `---` regex) → T031 [evidence: file-writer.ts and quality-extractors.ts updated by Codex-5]
- [x] CHK-072 [P2] Chunk failure triggers parent cleanup when successCount===0 → T032 [evidence: chunking-orchestrator.ts updated by Codex-5]
- [x] CHK-073 [P2] API surface expansion decision documented (encapsulation vs convenience) → T033 [evidence: codex-5-api-assessment.md created by Codex-5]
- [x] CHK-074 [P2] ADR "Five Checks" P2 AST claim corrected in 029 → T034 [evidence: 029/decision-record.md corrected by Codex-3]
<!-- /ANCHOR:tech-debt -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Source |
|----------|-------|----------|--------|
| P0 Items | 12 | 5/12 | 7 original + 5 cross-AI review |
| P1 Items | 14 | 6/14 | 8 original + 6 cross-AI review |
| P2 Items | 8 | 5/8 | 3 original + 5 cross-AI review |
| **Total** | **34** | **16/34** | |

**Verification Date**: 2026-03-05
**Cross-AI Review Source**: `012-architecture-audit/scratch/cross-ai-review-2026-03-05/unified-synthesis.md`
<!-- /ANCHOR:summary -->

---
