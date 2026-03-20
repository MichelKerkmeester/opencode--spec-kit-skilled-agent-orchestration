---
title: "Implementation Plan: Research Remediation Merged Wave 1 and Wave 2 [template:level_1/plan.md]"
description: "The merged remediation phase carries forward the Wave 1 baseline and applies nine bounded hybrid-enrichment fixes with focused verification."
trigger_phrases:
  - "plan"
  - "research remediation wave 2"
  - "018 research remediation"
importance_tier: "high"
contextType: "implementation"
---
# Implementation Plan: Research Remediation Merged Wave 1 and Wave 2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Markdown |
| **Framework** | system-spec-kit session-capturing pipeline |
| **Storage** | Filesystem and generated memory artifacts |
| **Testing** | `tsc --noEmit`, `npm run build`, and targeted Vitest lanes |

### Overview
Wave 2 reused the shipped Wave 1 baseline and applied nine bounded fixes to the Phase 1B hybrid-enrichment path. The work focused on mutation safety, nested-field preservation, validation boundaries, consistent status calculations, and targeted regression coverage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All targeted Wave 2 acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted corrective follow-up on top of the shipped Wave 1 monolith.

### Key Components
- **Hybrid-enrichment workflow path**: Carries file-backed JSON-mode input through enrichment and rendering.
- **Normalization and extraction path**: Preserves nested fields, validates them, and produces coherent session output.

### Data Flow
Wave 2 begins with file-backed structured input, preserves the nested enrichment blocks through normalization, enriches the workflow safely, reconciles final session metrics, and proves the new behavior with focused tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Freeze Wave 1 as the baseline state inside the merged remediation phase.
- [x] Group the deep-research findings into a bounded Wave 2 implementation set.
- [x] Define TypeScript compile and targeted Vitest coverage as the gate.

### Phase 2: Core Implementation
- [x] Fix mutation safety, git-string fallthrough, and type usage in the workflow and extraction paths.
- [x] Preserve structured hybrid-enrichment blocks through normalization and add constrained nested validation.
- [x] Add reconciliation logic for status and completion percent.

### Phase 3: Verification
- [x] Run compile and targeted test coverage for the Phase 1B changes.
- [x] Confirm the added tests cover mutation, validation, and reconciliation behavior.
- [x] Update the successor phase documentation with both Wave 1 and Wave 2 outcomes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | TypeScript correctness for the changed pipeline files | `tsc --noEmit` |
| Build | End-to-end script build output | `npm run build` |
| Integration | Phase 1B hybrid-enrichment and task-enrichment behavior | `npx vitest run` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped Wave 1 remediation baseline | Internal | Green | The merged successor phase loses a stable baseline |
| Phase 1B deep research findings | Internal | Green | The Wave 2 fix list loses its evidence basis |
| Targeted Phase 1B test lanes | Internal | Green | Regression confidence drops on the changed path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Compile or test failures show the Wave 2 corrections destabilized the hybrid-enrichment path.
- **Procedure**: Revert the bounded Wave 2 changes, restore the Wave 1 successor baseline, and reintroduce the fixes one at a time with the new tests as guards.
<!-- /ANCHOR:rollback -->
