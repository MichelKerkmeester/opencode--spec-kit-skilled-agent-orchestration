---
title: "Verification Checklist: /create:testing-playbook Command [template:level_3/checklist.md]"
description: "Verification Date: 2026-03-19"
trigger_phrases:
  - "testing playbook command checklist"
  - "/create:testing-playbook checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: /create:testing-playbook Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim implementation complete until verified |
| **[P1]** | Required | Must complete OR get explicit deferral |
| **[P2]** | Optional | May defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: `spec.md` defines command files, output contract, and runtime-sync scope]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: `plan.md` defines the command-family, runtime-sync, and validation phases]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: spec `021`, `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`, and both testing-playbook template files are listed as dependencies]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Canonical command markdown file created
- [ ] CHK-011 [P0] Auto and confirm YAML assets created
- [ ] CHK-012 [P0] `.agents` TOML mirror created
- [ ] CHK-013 [P0] Generated scaffold contract forbids sidecar playbook files and a `snippets/` subtree
- [ ] CHK-014 [P1] The command loads both testing-playbook templates and the creation reference
- [ ] CHK-015 [P1] Runtime discovery docs stay synchronized
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `validate_document.py` passes for `.opencode/command/create/testing-playbook.md`
- [ ] CHK-021 [P0] YAML parse checks pass for both workflow assets
- [ ] CHK-022 [P1] TOML parse check passes for `.agents/commands/create/testing-playbook.toml`
- [ ] CHK-023 [P1] Grep/path sweeps confirm runtime docs reference the new command consistently
- [ ] CHK-024 [P1] Spec validator passes for this folder
- [ ] CHK-025 [P1] Contract review confirms no legacy review/ledger sidecars or `snippets/` in generated output assumptions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or machine-specific credentials were introduced
- [ ] CHK-031 [P1] The scaffold preserves safety guidance for destructive scenarios
- [ ] CHK-032 [P1] Prompt scaffolds encourage evidence capture and explicit verdicts
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` are synchronized for planning state [EVIDENCE: all packet files were created together on 2026-03-19]
- [ ] CHK-041 [P1] `implementation-summary.md` updated with actual implementation evidence
- [ ] CHK-042 [P2] Command inventories updated with the new command
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] This spec folder contains only the standard Level 3 packet files [EVIDENCE: six markdown files only]
- [x] CHK-051 [P1] No scratch or temp artifacts were introduced [EVIDENCE: direct file creation only]
- [ ] CHK-052 [P2] Memory save handled separately if continuation context is needed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 |
| P1 Items | 11 | 5/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-03-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [EVIDENCE: ADRs cover naming translation, integrated root guidance, and realistic prompt scaffolding]
- [ ] CHK-101 [P1] All ADR-backed implementation choices are reflected in the command files
- [ ] CHK-102 [P1] Alternatives and rejection rationale remain visible after implementation
- [ ] CHK-103 [P2] Migration path for command inventories is documented if needed
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Consolidated setup prompt keeps interaction count low
- [ ] CHK-111 [P1] Reference/template loading remains scoped to the required files
- [ ] CHK-112 [P2] Time-to-scaffold is acceptable in manual review
- [ ] CHK-113 [P2] Any performance observations are documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Command-discovery docs updated in the same rollout
- [ ] CHK-122 [P1] Runtime mirrors confirmed accurate
- [ ] CHK-123 [P1] Runbook-level notes captured in `implementation-summary.md`
- [ ] CHK-124 [P2] Final docs review completed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] `sk-doc` contract alignment reviewed against spec `021`
- [ ] CHK-131 [P1] Command naming and path references stay consistent
- [ ] CHK-132 [P2] Edge-case handling documented for create vs update behavior
- [ ] CHK-133 [P2] Source-strategy preference for existing feature catalogs is documented
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Level 3 packet exists and is decision-complete for planning [EVIDENCE: six standard docs created with requirements, plan, tasks, ADRs, and pending verification]
- [ ] CHK-141 [P1] Command markdown references both templates and the creation guide
- [ ] CHK-142 [P2] Runtime-facing docs updated
- [ ] CHK-143 [P2] Knowledge-transfer notes captured after implementation
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
