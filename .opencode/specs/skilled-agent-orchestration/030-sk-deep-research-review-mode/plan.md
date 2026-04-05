---
title: "Implementation Plan: sk-deep-research Review Mode [03--commands-and-skills/030-sk-deep-research-review-mode/plan]"
description: "Plan the review-mode documentation and implementation follow-through while preserving the existing design intent recorded in the packet."
trigger_phrases:
  - "030"
  - "review mode plan"
  - "deep research review plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: sk-deep-research Review Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, and agent/runtime documentation |
| **Framework** | sk-deep-research plus sk-code-review integration |
| **Storage** | Git-tracked skill, command, and spec docs |
| **Testing** | Packet validation and manual reference review |

### Overview
Review mode reuses the deep-research orchestration model for automated review work. This repaired plan documents the intended path: define the contract, sync the supporting docs and assets, then verify the referenced surfaces stay aligned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Review-mode problem and scope documented in `spec.md`
- [x] Resume context preserved in `handover.md`
- [x] The packet now has committed spec, plan, and tasks docs

### Definition of Done
- [ ] Review-mode packet references resolve cleanly
- [ ] The missing plan and tasks docs remain synchronized with `spec.md`
- [ ] Validation exits with no hard errors for this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first extension of the existing deep-research loop.

### Key Components
- **Review packet spec docs**: `spec.md`, `plan.md`, `tasks.md`, `handover.md`
- **Shared review references**: `.opencode/skill/sk-code-review/` reference files
- **Review-mode command and skill docs**: `.opencode/command/spec_kit/deep-research.md` and `.opencode/skill/sk-deep-research/README.md`

### Data Flow
The packet defines the review-mode intent, shared review references provide the scoring and contract inputs, and the command or skill surfaces carry the runtime-facing behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Restore template-safe packet docs
- [x] Repair broken handover references to committed files

### Phase 2: Core Implementation
- [ ] Align review-mode command, skill, and reference surfaces
- [ ] Verify the review report contract and convergence behavior

### Phase 3: Verification
- [ ] Re-run packet validation
- [ ] Review the packet alongside the referenced repo artifacts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Link integrity | `handover.md` and sibling packet docs | Manual review and spec validator |
| Packet structure | This spec folder | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| Surface alignment | Referenced command and skill docs | Manual diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-code-review/references/review_core.md` | Internal | Green | Shared review doctrine becomes harder to trace |
| `.opencode/skill/sk-deep-research/README.md` | Internal | Green | Runtime-facing review guidance loses context |
| `.opencode/command/spec_kit/deep-research.md` | Internal | Green | Entry-point behavior becomes ambiguous |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The compliance repair distorts the original review-mode intent.
- **Procedure**: Revert the repaired packet docs and re-derive them from the preserved handover and spec notes.

<!-- ANCHOR:phase-deps -->
### Phase Dependencies
Spec repair comes first, then cross-surface review, then validation.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
### Effort Estimation
Most effort sits in verifying shared documentation surfaces rather than writing the packet scaffolding.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
### Enhanced Rollback
If needed, keep `handover.md`, `research/`, `memory/`, and `scratch/` untouched while rolling back only the repaired packet docs.
<!-- /ANCHOR:enhanced-rollback -->
<!-- /ANCHOR:rollback -->

---
