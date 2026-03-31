---
title: "Implementation Plan: cli-gemini Model Consolidation + cli-codex Skill [03--commands-and-skills/005-cli-codex-creation/plan]"
description: "Plan for consolidating cli-gemini model guidance and creating the cli-codex skill."
---
# Implementation Plan: cli-gemini Model Consolidation + cli-codex Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | OpenCode CLI skill pattern |
| **Storage** | Repository files only |
| **Testing** | Manual checks + advisor/readme verification |

### Overview
The plan combines two related documentation efforts: simplify `cli-gemini` model guidance to one canonical model, then create and register the new `cli-codex` skill by following the established CLI bridge pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing `cli-gemini` scope reviewed.
- [x] `cli-codex` documentation structure identified.
- [x] Registration surfaces identified.

### Definition of Done
- [x] `cli-gemini` uses one canonical model reference.
- [x] `cli-codex` skill files exist.
- [x] Advisor and README surfaces are updated.
- [x] Spec-folder compliance errors are resolved.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only CLI skill normalization and creation.

### Key Components
- **`cli-gemini` documentation**: normalized single-model guidance.
- **`cli-codex` skill package**: SKILL.md, references, and prompt templates.
- **Discovery surfaces**: advisor routing and README catalogs.

### Data Flow
User query -> skill advisor or README discovery -> CLI bridge skill loads -> external CLI usage guidance is followed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Review sibling CLI skill structure.
- [x] Identify all `cli-gemini` model references.

### Phase 2: Core Implementation
- [x] Normalize `cli-gemini` model references.
- [x] Create the `cli-codex` skill files.
- [x] Register `cli-codex` in advisor and catalogs.

### Phase 3: Verification
- [x] Check skill files exist.
- [x] Confirm registration surfaces are updated.
- [x] Validate the spec-folder structure.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation review | Model normalization and skill structure | Manual inspection |
| Registration review | Advisor + README surfaces | Manual inspection |
| Structural validation | Spec-folder markdown compliance | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing CLI skill patterns | Internal | Green | The new skill would drift from established structure |
| Advisor routing surfaces | Internal | Green | `cli-codex` would be harder to discover |
| README catalogs | Internal | Green | Users would miss the new skill |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Model normalization or `cli-codex` registration introduces incorrect guidance.
- **Procedure**: Revert the scoped documentation and catalog changes, then reapply with verified references only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Short |
| Core Implementation | Medium | Moderate |
| Verification | Low | Short |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Revert `cli-gemini`, `cli-codex`, advisor, and catalog edits as one scoped change set.
- Re-check sibling skill consistency before reapplying.
- Re-run structural validation after rollback or rework.
<!-- /ANCHOR:enhanced-rollback -->

---
