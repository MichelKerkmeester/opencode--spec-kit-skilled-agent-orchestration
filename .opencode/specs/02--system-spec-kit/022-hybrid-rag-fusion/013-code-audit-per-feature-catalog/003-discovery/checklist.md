---
title: "Verification Checklist: discovery [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-10"
trigger_phrases:
  - "verification"
  - "checklist"
  - "discovery"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: discovery

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

- [ ] CHK-001 [P0] Discovery findings for F-01, F-02, and F-03 are documented in `spec.md`
- [ ] CHK-002 [P0] Remediation tasks are defined in `tasks.md` with T### numbering
- [ ] CHK-003 [P1] Source files and playbook mappings (EX-018 to EX-020) are verified
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `memory_stats` summary uses accurate folder total semantics (`totalSpecFolders`)
- [ ] CHK-011 [P0] `memory_health` includes `requestId` consistently in error responses
- [ ] CHK-012 [P1] Error hint sanitization preserves safe, useful diagnostics
- [ ] CHK-013 [P1] Follow-up changes align with sk-code--opencode TypeScript patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Discovery success criteria are validated for all 3 features
- [ ] CHK-021 [P0] `memory_list` edge-case tests cover pagination hint and sort fallback behavior
- [ ] CHK-022 [P1] `memory_stats` tests cover scoring fallback and limit truncation behavior
- [ ] CHK-023 [P1] `memory_health` tests cover `divergent_aliases`, `autoRepair`, and schema-missing paths
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] Input validation remains enforced for Discovery handler parameters
- [ ] CHK-032 [P1] Correlation/debug improvements do not expose unsafe absolute paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized
- [ ] CHK-041 [P1] Stale `retry.vitest.ts` references are removed or replaced in Discovery docs
- [ ] CHK-042 [P2] Feature-level status notes are updated after remediation and verification
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary work artifacts remain in `scratch/` only
- [ ] CHK-051 [P1] Discovery updates are scoped to the `003-discovery/` phase folder
- [ ] CHK-052 [P2] Findings are saved to `memory/` when workflow requires persistence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
