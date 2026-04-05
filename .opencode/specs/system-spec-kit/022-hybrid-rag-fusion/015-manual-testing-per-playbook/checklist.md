---
title: "Verification Checklist [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/checklist]"
description: "Verification checklist for keeping the root manual-testing wrapper aligned to the live 290-file playbook tree."
trigger_phrases:
  - "manual testing checklist"
  - "playbook verification"
  - "umbrella checklist"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- This checklist verifies the root wrapper packet only.
- Historical `272 exact ID` execution evidence remains valid, but it is not the current live denominator.
- Current wrapper truth uses `290` scenario files across `21` live categories.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Root docs use the live `290`-file denominator.
- [ ] CHK-002 [P0] Root docs use the live `21`-category denominator.
- [ ] CHK-003 [P0] The root phase map includes all `001` through `022` phase folders and explains the retained duplicate `020` folder.
- [ ] CHK-004 [P1] Historical `272 exact ID` execution evidence is explicitly labeled as historical only.
- [ ] CHK-005 [P1] Root docs use the live `255`-entry feature-catalog denominator when describing traceability work.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-040 [P0] Root wrapper docs are internally consistent after the denominator refresh.
- [ ] CHK-041 [P1] Historical execution claims do not overstate current live playbook coverage.
- [ ] CHK-042 [P1] Traceability-remediation status remains visible and unresolved until separately verified.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Root wrapper validation passes after truth-sync edits.
- [ ] CHK-011 [P1] Live scenario totals match the filesystem recount (`290`, excluding the root playbook index).
- [ ] CHK-012 [P1] Live category totals match the filesystem recount (`21`).
- [ ] CHK-013 [P1] Root traceability wording no longer depends on stale `222`-entry catalog totals.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] Root wrapper edits remain documentation-only.
- [ ] CHK-051 [P1] The packet does not claim current live execution coverage that was not re-run.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Root spec, plan, and checklist all reflect the same live counts and boundary language.
- [ ] CHK-061 [P1] Historical execution evidence is clearly labeled as historical in the root wrapper docs.
- [ ] CHK-062 [P2] Remaining traceability remediation is described without inventing closure.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Root wrapper files stay synchronized after the truth-sync pass.
- [ ] CHK-071 [P1] The phase map matches the actual `001` through `022` folder set.
- [ ] CHK-072 [P2] No unrelated child-phase documentation was changed in this wrapper-only pass.
<!-- /ANCHOR:file-org -->

---

- [ ] CHK-100 [P0] Traceability-remediation status remains visible in the root wrapper packet.
- [ ] CHK-101 [P1] Current remediation wording references the live 255-entry catalog denominator.
- [ ] CHK-102 [P1] Current remediation wording references the live 290-file playbook denominator.
- [ ] CHK-103 [P1] Root wrapper docs do not present the deep-review backlog as already complete.

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] [P0] Root wrapper docs use the live denominator truthfully.
- [ ] [P1] Historical execution evidence is preserved but clearly bounded.
- [ ] [P1] Traceability remediation remains visible and unresolved until separately verified.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Umbrella verification for 24-subdirectory manual testing + traceability remediation
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
