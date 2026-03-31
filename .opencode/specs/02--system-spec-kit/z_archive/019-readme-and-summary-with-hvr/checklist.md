---
title: "Verification Checklist: Human Voice Rules — [02--system-spec-kit/z_archive/019-readme-and-summary-with-hvr/checklist]"
description: "These items verify that this spec folder demonstrates the style it promotes."
trigger_phrases:
  - "verification"
  - "checklist"
  - "human"
  - "voice"
  - "rules"
  - "137"
  - "readme"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Human Voice Rules — Template Integration

<!-- SPECKIT_LEVEL: 3+ -->
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

### P0 — Hard Blockers

- [x] CHK-001 [P0] Requirements documented in spec.md [File: spec.md created 2026-02-19]
- [x] CHK-002 [P0] Technical approach defined in plan.md [File: plan.md created 2026-02-19]

### P1 — Required

- [x] CHK-003 [P1] Dependencies identified and available [Source HVR file confirmed present; all template paths verified via Glob]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:hvr-asset -->
## HVR Standalone Asset

- [ ] CHK-010 [P0] `hvr_rules.md` created at `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`
- [ ] CHK-011 [P0] Zero occurrences of "Barter", "MEQT", "DEAL", "CONTENT" in hvr_rules.md [Evidence: grep output]
- [ ] CHK-012 [P0] Loading condition updated to system-agnostic language
- [ ] CHK-013 [P0] All 10 HVR sections present in standalone file (0-9 from source)
- [ ] CHK-014 [P1] ANCHOR tags from source preserved in hvr_rules.md for structured retrieval
<!-- /ANCHOR:hvr-asset -->

---

<!-- ANCHOR:annotation-blocks -->
## HVR Annotation Blocks

- [ ] CHK-020 [P0] Implementation-summary HVR block drafted and covers: hard-blocker reference, top 10 banned words, top 4 structural patterns
- [ ] CHK-021 [P0] Decision-record HVR block drafted and covers: active voice in context/rationale, plain-language guidance
- [ ] CHK-022 [P1] README HVR block drafted and covers: direct address, active voice in capability descriptions
- [ ] CHK-023 [P1] Install-guide HVR block drafted and covers: imperative verbs, no hedging in steps
- [ ] CHK-024 [P1] All blocks under 30 lines each
- [ ] CHK-025 [P1] All blocks reference full `hvr_rules.md` path
<!-- /ANCHOR:annotation-blocks -->

---

<!-- ANCHOR:speckit-templates -->
## SpecKit Template Updates

- [ ] CHK-030 [P0] `templates/level_1/implementation-summary.md` contains HVR block
- [ ] CHK-031 [P0] `templates/level_2/implementation-summary.md` contains HVR block
- [ ] CHK-032 [P0] `templates/level_3/implementation-summary.md` contains HVR block
- [ ] CHK-033 [P0] `templates/level_3+/implementation-summary.md` contains HVR block
- [ ] CHK-034 [P0] `templates/level_3/decision-record.md` contains HVR block
- [ ] CHK-035 [P0] `templates/level_3+/decision-record.md` contains HVR block
- [ ] CHK-036 [P0] All six SpecKit files retain original ANCHOR tags [Evidence: grep for ANCHOR count before/after]
- [ ] CHK-037 [P0] All six SpecKit files retain SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers
- [ ] CHK-038 [P1] HVR block position: after SPECKIT_TEMPLATE_SOURCE comment, before first content section in each file
<!-- /ANCHOR:speckit-templates -->

---

<!-- ANCHOR:wfdoc-templates -->
## Workflows-Doc Template Updates

- [ ] CHK-040 [P0] `readme_template.md` contains HVR block
- [ ] CHK-041 [P0] `install_guide_template.md` contains HVR block
- [ ] CHK-042 [P0] Both files retain existing structure and frontmatter
- [ ] CHK-043 [P1] HVR blocks in both files are readable without prior HVR knowledge
<!-- /ANCHOR:wfdoc-templates -->

---

<!-- ANCHOR:style-compliance -->
## Style Compliance — This Spec Folder

These items verify that this spec folder demonstrates the style it promotes.

- [ ] CHK-050 [P1] spec.md: zero hard-blocker words (grep: delve, embark, leverage, seamless, holistic, ecosystem, paradigm, utilize, revolutionise, groundbreaking) [Evidence: grep output]
- [ ] CHK-051 [P1] plan.md: zero hard-blocker words [Evidence: grep output]
- [ ] CHK-052 [P1] tasks.md: zero hard-blocker words [Evidence: grep output]
- [ ] CHK-053 [P1] decision-record.md: zero hard-blocker words [Evidence: grep output]
- [ ] CHK-054 [P2] No "not just X, but also Y" patterns in any spec folder document
- [ ] CHK-055 [P2] No em dashes in any spec folder document
<!-- /ANCHOR:style-compliance -->

---

<!-- ANCHOR:docs -->
## Documentation Completeness

- [x] CHK-060 [P1] spec.md complete with all 16 sections filled [Verified: no placeholder markers remaining]
- [x] CHK-061 [P1] plan.md complete with all phases documented [Verified: 5 phases + L2/L3/L3+ sections]
- [x] CHK-062 [P1] tasks.md complete with T001-T036 defined [Verified: all tasks have descriptions]
- [ ] CHK-063 [P1] decision-record.md complete with ADR-001 and ADR-002
- [ ] CHK-064 [P2] implementation-summary.md created post-implementation
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Spec folder at correct path: `.opencode/specs/02--system-spec-kit/z_archive/019-readme-and-summary-with-hvr`
- [ ] CHK-071 [P1] scratch/ clean before completion claim
- [ ] CHK-072 [P2] Memory context saved after implementation completes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [File: decision-record.md created 2026-02-19]
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (N/A — no existing HVR-integrated templates to migrate)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Performance criteria are N/A for a documentation-only change. No runtime impact.

- [ ] CHK-110 [P2] Template readability: HVR blocks scannable in under 60 seconds [Manual assessment]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented in plan.md [Plan §7: git checkout restores any file]
- [x] CHK-121 [P1] No feature flags required — documentation-only changes
- [ ] CHK-122 [P1] All target files verified as modified (not just spec folder docs)
- [ ] CHK-123 [P1] validate.sh run on this spec folder [Evidence: exit code]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] No Barter-specific content in hvr_rules.md [Evidence: grep results]
- [ ] CHK-131 [P1] All existing template licenses/headers preserved
- [ ] CHK-132 [P1] HVR rules content matches source document (no rules removed or changed, only Barter framing updated)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec.md scope matches plan.md phases matches tasks.md T-numbers)
- [ ] CHK-141 [P1] hvr_rules.md self-contained and readable as a standalone document
- [ ] CHK-142 [P2] User-facing documentation updated — N/A (no public-facing docs in this change)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project owner | Decision-maker | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 3/22 |
| P1 Items | 18 | 4/18 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-02-19 (spec folder creation; implementation pending)
<!-- /ANCHOR:summary -->
