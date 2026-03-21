---
title: "Implementation Plan: manual-testing-per-playbook [template:level_1/plan.md]"
description: "Alignment pass for the 014 parent packet: reconcile 19 phase folders to the current 213-ID exact scenario inventory, expand Phase 013 dedicated-memory coverage, and record the March 17, 2026 validator truth."
trigger_phrases:
  - "manual testing plan"
  - "testing phases"
  - "exact id audit"
  - "playbook alignment"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit Level 1 templates |
| **Storage** | Filesystem (spec folders + playbook docs) |
| **Testing** | Exact-ID audit + `validate.sh --recursive` |

### Overview
This pass does not generate the packet from scratch. It reconciles the existing 19 phase folders to the current playbook truth by switching the parent packet from a top-level-ID model (`195`) to an exact-ID model (`213`), expanding Phase `013-memory-quality-and-indexing` for the dedicated memory sub-scenarios, refreshing the `M-007` playbook verification wording, and recording the real validator outcome for the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current playbook inventory reviewed, including the dedicated memory-section suffixed IDs.
- [x] Existing phase ownership model reviewed across all 19 child folders.
- [x] Current recursive validator output captured for the parent packet.
- [x] Scope limited to the `014` parent docs, Phase `013` docs, the `M-007` playbook block, and the narrow `010` truth-cleanup.

### Definition of Done
- [ ] Parent packet uses the `213` exact-ID model as its authoritative coverage measure.
- [ ] Phase `013` explicitly documents `M-005a..c`, `M-006a..c`, and `M-007a..j`.
- [ ] Exact-ID audit reports `0` missing IDs and `0` duplicate owners.
- [ ] Recursive validation is rerun and its current `0`-error, `19`-warning state is recorded truthfully in the packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation reconciliation with exact-ID audit and validator-truth refresh.

### Key Components
- **Playbook source of truth**: `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, including the dedicated memory section.
- **Packet surface**: parent `014` docs plus child `013-memory-quality-and-indexing/`.
- **Supporting truth sources**: recursive validation output for `014`, validation output for `013`, and the `010` closure docs used to refresh `M-007` proof-lane wording.
- **Audit layer**: exact-ID ownership scan across all 19 child specs.

### Data Flow
`playbook exact IDs -> phase ownership docs -> exact-ID audit -> validator rerun -> parent packet truth update`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit the Current Packet
- [x] Re-read the parent `014` docs and capture every stale `195`-only or validation-pending claim.
- [x] Re-read `013-memory-quality-and-indexing/` and identify the missing exact IDs in the dedicated memory section.
- [x] Re-run parent recursive validation to capture the current `0`-error, `19`-warning result.

### Phase 2: Align Parent and Phase 013 Docs
- [ ] Update the parent `014` spec, plan, tasks, checklist, and implementation summary to the exact-ID model.
- [ ] Expand `013-memory-quality-and-indexing` docs from `26` top-level scenarios to `42` exact IDs.
- [ ] Replace `M-007` shorthand wording with literal `M-007a` through `M-007j` coverage.
- [ ] Refresh the `M-007` playbook block so its verification suite list and proof-lane wording match the `010` closure docs.

### Phase 3: Verify and Close Out
- [ ] Run an exact-ID ownership audit across all 19 child specs.
- [ ] Re-run validation on the touched `013-memory-quality-and-indexing/` child packet.
- [ ] Spot-check the dedicated memory IDs and the `010` parent narrative for internal consistency.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Exact-ID ownership audit | All 19 child `spec.md` files | Python exact-ID scan |
| Parent validation truth | `014-manual-testing-per-playbook/` | `validate.sh --recursive` |
| Child validation truth | `013-memory-quality-and-indexing/` | `validate.sh` |
| Spot checks | `M-005a..c`, `M-006a..c`, `M-007a..j`, `010` validator wording | `rg`, `sed` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook | Internal | Green | Exact-ID inventory and `M-007` wording cannot be aligned |
| Feature catalog | Internal | Green | Test-to-feature mappings cannot be verified |
| `validate.sh` | Internal | Green | Current packet truth cannot be recorded honestly |
| `009-perfect-session-capturing` closure docs | Internal | Green | `M-007` proof-lane wording cannot be aligned to the latest closure evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An alignment edit introduces broken counts, broken links, or contradictory validation claims.
- **Procedure**: Revert only the touched parent/Phase-013/playbook docs, rerun the exact-ID audit and validator commands, and reapply the alignment using the last verified counts and outputs.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
