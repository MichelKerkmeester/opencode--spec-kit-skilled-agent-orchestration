---
title: "Implementation Plan: SpecKit Template ToC Policy Enforcement [007-spec-kit-templates/plan.md]"
description: "Execution plan for documentation-only ToC policy enforcement and retro cleanup in scoped spec artifacts."
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec kit"
  - "toc policy"
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify | v2.2"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: SpecKit Template ToC Policy Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit Level 2 templates + spec validator |
| **Storage** | Repository filesystem |
| **Testing** | `rg` policy scan + `validate.sh` per affected folder |

### Overview
This plan executes a docs-only pass in three phases: template-based authoring of the new Level 2 spec folder, targeted removal of disallowed ToC sections from existing non-research artifacts, and validation/reporting for all affected folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope limited to markdown documentation in spec folders.
- [x] Target folders and required file list identified.
- [x] ToC policy clarified: only `research.md` may include ToC.

### Definition of Done
- [x] New Level 2 docs created in `007-spec-kit-templates`.
- [x] ToC sections removed from scoped non-research artifacts.
- [x] Validation executed for all requested folders.
- [x] Final concise report prepared.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation normalization workflow.

### Key Components
- **Template-aligned spec docs**: New Level 2 files in `007-spec-kit-templates`.
- **Retro cleanup set**: Existing standard artifacts in `039`, `040`, and `041`.
- **Validation layer**: `spec/validate.sh` run per target folder.

### Data Flow
1. Inspect templates and offender files.
2. Create new Level 2 docs with real task content.
3. Remove ToC blocks from scoped standard artifacts.
4. Run policy scan and folder validation commands.
5. Publish concise results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Read system-spec-kit Level 2 templates.
- [x] Scan scoped spec artifacts for ToC offenders.
- [x] Confirm exact cleanup file set.

### Phase 2: Documentation Edits
- [x] Create `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` in `007-spec-kit-templates`.
- [x] Remove ToC sections from non-research standard artifacts in `039`, `040`, `041`.
- [x] Preserve all out-of-scope files, including `research.md`.

### Phase 3: Verification and Reporting
- [x] Run ToC policy scan on targeted standard artifacts.
- [x] Run `validate.sh` on all requested folders.
- [x] Summarize changed files and validation outcomes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Policy scan | ToC headings in standard artifacts only | `rg` |
| Folder validation | Completeness and structure checks | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder>` |
| Manual inspection | Confirm only ToC blocks removed | `sed`, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/templates/level_2/*.md` | Internal | Available | Cannot produce template-aligned docs |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Available | Cannot verify requested folders |
| Existing scoped spec artifacts | Internal | Available | Retro cleanup cannot be completed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Unintended content removal or validation failures caused by cleanup edits.
- **Procedure**: Revert only affected markdown files and re-apply targeted ToC-only edits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preparation) ──► Phase 2 (Documentation Edits) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preparation | None | Documentation Edits |
| Documentation Edits | Preparation | Verification |
| Verification | Documentation Edits | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 20-30 min |
| Documentation Edits | Medium | 45-75 min |
| Verification | Low | 15-25 min |
| **Total** | | **80-130 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Target files confirmed in scope.
- [x] Edit pattern limited to explicit ToC blocks.
- [x] New docs authored in target spec folder only.

### Rollback Procedure
1. Restore prior markdown content for affected files.
2. Re-run targeted ToC scan to confirm pre/post behavior.
3. Re-apply scoped edits with manual inspection.
4. Re-run folder validation commands.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
