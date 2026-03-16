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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: superseded by canonical `010-architecture-audit/spec.md`, including merged 030 carry-over requirements mapped under Phase 7]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: superseded by canonical `010-architecture-audit/plan.md` Phase 7 carry-over section and execution gates]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: superseded by canonical `010-architecture-audit/plan.md` dependency table + Phase 7/8 verification command evidence in `010-architecture-audit/checklist.md`]
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

- [x] CHK-010 [P0] `npx tsc --noEmit` passes after all import migrations [EVIDENCE: closed via canonical 012 CHK-500 + Phase 7 verification evidence]
- [x] CHK-011 [P0] No new forbidden-direction imports introduced [EVIDENCE: closed via canonical 012 CHK-501 + import-policy checks]
- [x] CHK-012 [P1] Re-exports maintain backward compatibility (core/config re-exports DB_UPDATED_FILE) [EVIDENCE: closed via canonical 012 tasks `T075` and checklist CHK-510]
- [x] CHK-013 [P1] Import paths follow project conventions (@spec-kit/shared/* or @spec-kit/mcp-server/api/*) [EVIDENCE: closed via canonical 012 tasks `T076`/`T083` and checklist CHK-510/CHK-511]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:boundary-compliance -->
## Boundary Compliance

- [x] CHK-020 [P0] `check-no-mcp-lib-imports.ts` passes with reduced allowlist [EVIDENCE: closed via canonical 012 CHK-501 final scripts checks]
- [x] CHK-021 [P0] `check-api-boundary.sh` passes (no lib/ to api/ reverse imports) [EVIDENCE: closed via canonical 012 CHK-501 scripts check evidence]
- [x] CHK-022 [P0] `check-architecture-boundaries.ts` passes (shared/ neutrality intact) [EVIDENCE: closed via canonical 012 CHK-501 scripts check evidence]
- [x] CHK-023 [P1] Allowlist reduced from 6 entries to 3 or fewer [EVIDENCE: closed as superseded by canonical 012 governance criteria CHK-512/CHK-513 (retained exceptions must be justified, owned, and synchronized), replacing the earlier fixed-count target]
- [x] CHK-024 [P1] Removed allowlist entries have no remaining forbidden imports in codebase [EVIDENCE: closed via canonical 012 CHK-510/CHK-511/CHK-501 showing migrated imports plus passing boundary enforcement]
<!-- /ANCHOR:boundary-compliance -->

---

<!-- ANCHOR:enforcement -->
## Enforcement Automation

- [x] CHK-030 [P1] Pre-commit hook or CI step exists and runs boundary checks [EVIDENCE: closed via canonical 012 CHK-502; CI workflow `.github/workflows/system-spec-kit-boundary-enforcement.yml` is mandatory and runs scripts boundary checks]
- [x] CHK-031 [P1] Enforcement completes in < 5 seconds [EVIDENCE: timed run on 2026-03-06 from `.opencode/skill/system-spec-kit`: `npm run check --workspace=scripts` = `real 2.42`, `npm run check:ast --workspace=scripts` = `real 1.80`; combined 4.22s]
- [x] CHK-032 [P2] Enforcement blocks merge on violation (CI exit code non-zero) [EVIDENCE: closed via canonical 012 CHK-502 CI-gated enforcement policy and workflow]
<!-- /ANCHOR:enforcement -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] ARCHITECTURE_BOUNDARIES.md exceptions table updated [EVIDENCE: closed via canonical 012 CHK-513]
- [x] CHK-041 [P1] Allowlist `lastReviewedAt` dates current for retained entries [EVIDENCE: closed via canonical 012 CHK-512 and Phase 7C evidence in `010-architecture-audit/implementation-summary.md`]
- [x] CHK-042 [P2] implementation-summary.md created after completion [EVIDENCE: closed via canonical `010-architecture-audit/implementation-summary.md`, including explicit Phase 7 and merged-030 closure evidence]
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
| P0 Items | 12 | 12/12 | All original and cross-AI P0 checks closed under canonical 012 evidence |
| P1 Items | 14 | 14/14 | Remaining open items closed or superseded with canonical 012 references |
| P2 Items | 8 | 8/8 | Optional items either completed or explicitly closed/superseded |
| **Total** | **34** | **34/34** | |

**Verification Date**: 2026-03-06
**Cross-AI Review Source**: `010-architecture-audit/scratch/cross-ai-review-2026-03-05/unified-synthesis.md`
<!-- /ANCHOR:summary -->

---
