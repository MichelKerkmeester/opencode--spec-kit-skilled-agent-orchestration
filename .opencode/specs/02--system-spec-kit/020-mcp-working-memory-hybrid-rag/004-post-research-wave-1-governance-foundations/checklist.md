---
title: "Verification Checklist: Post-Research Wave 1 Package [004-post-research-wave-1-governance-foundations/checklist]"
description: "checklist document for 004-post-research-wave-1-governance-foundations."
trigger_phrases:
  - "verification"
  - "checklist"
  - "post"
  - "research"
  - "wave"
  - "004"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Post-Research Wave 1 Package

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-checklist | v1.1 -->

---

<!-- ANCHOR:verification-protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| P0 | Hard blocker |
| P1 | Required unless explicitly deferred |
| P2 | Optional optimization |
<!-- /ANCHOR:verification-protocol -->

---

<!-- ANCHOR:p0-blockers -->
## P0 - Blockers

- [x] W1-CHK-001 Root checks `CHK-220-222` mapped and verifiable in this package with typed trace-stage and degraded-mode contract expectations. [Evidence: `mcp_server/lib/contracts/retrieval-trace.ts`, `mcp_server/lib/search/artifact-routing.ts`, `mcp_server/lib/search/adaptive-fusion.ts` + tests]
- [x] W1-CHK-002 Root check `CHK-226` mapped with telemetry evidence requirements. [Evidence: `mcp_server/lib/telemetry/retrieval-telemetry.ts` + tests]
- [x] W1-CHK-003 Root checks `CHK-217-219` (approval closure) mapped and evidence expectations defined. [Evidence: `scratch/c136-01-tech-lead-approval-packet.md`, `scratch/c136-02-data-reviewer-approval-packet.md`, `scratch/c136-03-product-owner-approval-packet.md`]
- [x] W1-CHK-004 Dependency on package `../002-extraction-rollout-phases-2-3/` closure artifacts is explicit. [Evidence: Wave 1 tasks reference prior phase outputs]
- [x] W1-CHK-005 Package `../002-extraction-rollout-phases-2-3/` closure artifacts verified available before Wave 1 execution begins (Definition of Ready pre-condition from plan.md). [Evidence: Phase 2-3 package complete, artifacts available]
<!-- /ANCHOR:p0-blockers -->

---

<!-- ANCHOR:p1-required -->
## P1 - Required

- [x] W1-CHK-010 Backlog IDs `C136-08`, `C136-09`, `C136-10`, `C136-12`, `C136-01`, `C136-02`, `C136-03` are mapped in `../tasks.md`. [Evidence: root tasks.md references all IDs]
- [x] W1-CHK-011 Wave sequencing and handoff to package `../005-post-research-wave-2-controlled-delivery/` is explicit, including the Wave 2-required contract bundle. [Evidence: W1-020 handoff task complete]
- [x] W1-CHK-012 Execution status is explicit and synchronized with root completion claims. [Evidence: all W1 tasks marked complete with evidence]
- [x] W1-CHK-013 Root references remain synchronized across `../spec.md`, `../plan.md`, `../tasks.md`, and `../checklist.md`. [Evidence: root documents reference Wave 1 package]
- [x] W1-CHK-014 Adaptive fusion behavior is verified as dynamic by intent/document type (no fixed one-size weighting profile). [Evidence: `mcp_server/lib/search/adaptive-fusion.ts` + tests + `scratch/c136-10-evidence.md`]
- [x] W1-CHK-015 Typed retrieval trace envelope includes all required stages (`candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank`). [Evidence: `mcp_server/lib/contracts/retrieval-trace.ts` + tests]
- [x] W1-CHK-016 Artifact-aware routing policy is verified for `spec`, `plan`, `tasks`, and `checklist` classes. [Evidence: `mcp_server/lib/search/artifact-routing.ts` + tests]
- [x] W1-CHK-017 Milestone labels (W1-M1, W1-M2, W1-M3) traceable to specific verification items in this checklist. [Evidence: milestones map to CHK-001/CHK-002/CHK-003 groups]
- [x] W1-CHK-018 This package's documentation set (spec.md, plan.md, tasks.md, checklist.md) confirmed referenced by root CHK-229. [Evidence: root checklist cross-reference verified]
<!-- /ANCHOR:p1-required -->

---

<!-- ANCHOR:p2-optional -->
## P2 - Optional

- [x] W1-CHK-020 Package-level risk notes stay aligned with root `../plan.md`. [Evidence: risk notes consistent with root plan]
<!-- /ANCHOR:p2-optional -->

---

<!-- ANCHOR:evidence -->
## Evidence

- Root tasks: `../tasks.md`
- Root verification: `../checklist.md`
- Backlog source: `../research/136 - prioritized-implementation-backlog-post-research.md`
- Execution artifacts: `../scratch/`
<!-- /ANCHOR:evidence -->
