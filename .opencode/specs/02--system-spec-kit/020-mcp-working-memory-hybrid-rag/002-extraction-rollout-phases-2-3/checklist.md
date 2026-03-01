---
title: "Verification Checklist: Extraction and Rollout Package [002-extraction-rollout-phases-2-3/checklist]"
description: "checklist document for 002-extraction-rollout-phases-2-3."
trigger_phrases:
  - "verification"
  - "checklist"
  - "extraction"
  - "and"
  - "rollout"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Extraction and Rollout Package

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-checklist | v1.1 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| P0 | Hard blocker |
| P1 | Required unless explicitly deferred |
| P2 | Optional optimization |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:p0-blockers -->
## P0 - Blockers

- [x] EXR-CHK-001 Root checks `CHK-140-145` mapped and verifiable in this package. [EVIDENCE: File: ../checklist.md; Source: CHK-140-145 mapping retained in package scope]
- [x] EXR-CHK-002 Root checks `CHK-152-154` mapped and verifiable in this package. [EVIDENCE: File: ../checklist.md; Source: CHK-152-154 mapping retained in package scope]
- [x] EXR-CHK-003 Root checks `CHK-160-161` mapped and verifiable in this package. [EVIDENCE: File: ../checklist.md; Source: CHK-160-161 mapping retained in package scope]
- [x] EXR-CHK-004 Hard dependency from package 001 confirmed before Phase 2 execution. [EVIDENCE: File: spec.md; Source: Dependencies and Handoffs dependency lock]
- [x] EXR-CHK-005 Post-research checklist ownership is handed off to wave packages: Wave 1 (`CHK-217-222`, `CHK-226`), Wave 2 (`CHK-223-225`), Wave 3 (`CHK-227-228`). [EVIDENCE: File: ../checklist.md; Source: post-research wave checklist allocation]
- [x] EXR-CHK-006 Historical-to-wave transition explicitly preserves completed Phase 2/3 evidence while appending technical handoff contracts. [EVIDENCE: File: spec.md; Source: Transition Contract Matrix]
<!-- /ANCHOR:p0-blockers -->

<!-- ANCHOR:p1-required -->

## P1 - Required

- [x] EXR-CHK-010 Root checks `CHK-146-151` mapped and verifiable in this package. [EVIDENCE: File: ../checklist.md; Source: CHK-146-151 mapping retained in package scope]
- [x] EXR-CHK-011 Root checks `CHK-162-166` mapped and verifiable in this package. [EVIDENCE: File: ../checklist.md; Source: CHK-162-166 mapping retained in package scope]
- [x] EXR-CHK-012 Metrics thresholds preserved: precision >= 85%, recall >= 70%, MRR >= 0.95x. [EVIDENCE: File: spec.md; Source: Acceptance Targets]
- [x] EXR-CHK-013 Execution status is explicit and synchronized with root completion claims. [EVIDENCE: File: spec.md; Source: Metadata and Status Statement]
- [x] EXR-CHK-014 Root references remain synchronized across `../spec.md`, `../plan.md`, `../tasks.md`, and `../checklist.md`. [EVIDENCE: File: spec.md; Source: Root Mapping section]
- [x] EXR-CHK-015 Wave package references are explicit in root docs and package transition notes (`../004-post-research-wave-1-governance-foundations/`, `../005-post-research-wave-2-controlled-delivery/`, `../006-post-research-wave-3-outcome-confirmation/`). [EVIDENCE: File: spec.md; Source: Dependencies and Handoffs transition handoff bullets]
- [x] EXR-CHK-016 Transition contract matrix maps requested technical capabilities to wave ownership without changing frozen C136 backlog mapping. [EVIDENCE: File: spec.md; Source: Transition Contract Matrix]
<!-- /ANCHOR:p1-required -->

<!-- ANCHOR:p2-optional -->

## P2 - Optional

- [x] EXR-CHK-020 Package-level rollout risk notes kept aligned with root `../plan.md`.
- [x] EXR-CHK-021 Telemetry evidence structure reviewed before implementation starts.
- [x] EXR-CHK-022 Historical evidence sections are preserved while transition notes are appended.
- [x] EXR-CHK-023 Sequencing lock confirmed: Wave 1 (`004`) -> Wave 2 (`005`) -> Wave 3 (`006`).
<!-- /ANCHOR:p2-optional -->

<!-- ANCHOR:evidence -->

## Evidence

- Root tasks: `../tasks.md`
- Root verification: `../checklist.md`
- Rollout artifacts: `../scratch/`
- Wave 1 package: `../004-post-research-wave-1-governance-foundations/`
- Wave 2 package: `../005-post-research-wave-2-controlled-delivery/`
- Wave 3 package: `../006-post-research-wave-3-outcome-confirmation/`
<!-- /ANCHOR:evidence -->
