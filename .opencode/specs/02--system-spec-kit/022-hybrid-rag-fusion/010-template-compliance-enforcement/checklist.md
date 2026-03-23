---
title: "Verification Checklist: Template Compliance Enforcement"
description: "Level 2 verification checklist for 3-layer template compliance enforcement implementation."
trigger_phrases:
  - "template compliance checklist"
  - "enforcement verification"
  - "compliance verification"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Template Compliance Enforcement

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-010)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (4-phase architecture)
- [ ] CHK-003 [P1] Dependencies identified and available (`template-structure.js` verified to exist)
- [ ] CHK-004 [P0] Research complete -- 9 iterations, 8/8 questions answered, all artifacts drafted in `research.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Shared reference file (references/template-compliance-contract.md) contracts match `template-structure.js contract` CLI output for all 5 L2 doc types
- [ ] CHK-011 [P0] Compact inline contract in agent definitions is exactly 49 lines and covers all 5 L2 doc types + L3 decision-record.md
- [ ] CHK-012 [P0] All 4 CLI @speckit agent definitions contain identical contract content (minus TOML formatting differences)
- [ ] CHK-013 [P1] No placeholder text remains in any modified agent definition file
- [ ] CHK-014 [P1] TOML formatting in `.codex/agents/speckit.toml` uses correct triple-quoted multi-line string syntax
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fresh Level 2 spec folder created by @speckit passes `validate.sh --strict` with exit code 0 on first generation
- [ ] CHK-021 [P1] Agent conversation log confirms validate.sh executed after each individual file write
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials in any deliverable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized -- all reference the same 4-phase structure (A-D)
- [ ] CHK-041 [P1] Shared reference file includes sync protocol for future template changes
- [ ] CHK-042 [P1] Shared reference file includes version stamp and `last_synced` date
- [ ] CHK-043 [P2] Implementation summary completed after all phases
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Research artifacts remain in `scratch/` (iteration files)
- [ ] CHK-051 [P1] Shared reference file placed in correct path (references/template-compliance-contract.md)
- [ ] CHK-052 [P2] Session context saved to `memory/` after completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---
