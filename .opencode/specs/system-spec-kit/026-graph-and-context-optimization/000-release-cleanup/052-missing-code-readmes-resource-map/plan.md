---
title: "Implementation Plan: Missing Code READMEs Resource Map [template:level_2/plan.md]"
description: "Plan, implement and verify the exact 65-folder missing README manifest."
trigger_phrases:
  - "missing code readmes resource map"
  - "readme coverage plan"
  - "resource grouping"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map"
    last_updated_at: "2026-05-02T16:15:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created all 65 target README files from the exact manifest"
    next_safe_action: "Review git diff and summarize completed README implementation"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/resource-map.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Missing Code READMEs Resource Map

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec documentation |
| **Framework** | system-spec-kit phase workflow |
| **Storage** | Spec folder docs and metadata |
| **Testing** | `validate.sh --strict` |

### Overview
This phase corrects and implements the remaining code README/resource-map work. It records the Task #36 manifest as 65 unique existing folders that were missing `README.md` at audit time, then creates the 65 target README files without creating target folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [File: spec.md]
- [x] Success criteria measurable [File: spec.md]
- [x] Dependencies identified [File: spec.md]

### Definition of Done
- [x] Phase docs contain no template placeholders. [Evidence: final doc review before validation]
- [x] `resource-map.md` records all 65 unique target folders and B01-B17 batches. [File: resource-map.md]
- [x] All 65 target README files exist. [Evidence: final manifest verification]
- [x] Per-file README validation exits 0. [Test: validate_document.py across target READMEs]
- [x] Strict validation exits 0 or 1. [Test: validate.sh --strict - PASSED, 0 errors, 0 warnings]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Spec-kit phase child with Level 2 verification and a phase-local resource map.

### Key Components
- **spec.md**: Defines audit facts, boundaries, requirements, and success criteria.
- **plan.md**: Describes the documentation-only workflow and validation approach.
- **tasks.md**: Tracks manifest correction, README creation, and verification steps.
- **checklist.md**: Verifies Level 2 planning requirements and boundary controls.
- **resource-map.md**: Stores the exact manifest counts, 65 unique target folders, 3 file-path mappings, B01-B17 batches, and implementation evidence.

### Data Flow
Task #36 target entries are normalized into `spec.md`, then converted into the grouped path ledger in `resource-map.md`. The implementation reads each target folder, creates a concise README, validates the README, then verifies that all 65 manifest entries now have `README.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold
- [x] Create child phase `052-missing-code-readmes-resource-map/`.
- [x] Add Level 2 checklist and resource-map surfaces.

### Phase 2: Manifest Correction
- [x] Replace incorrect one-missing-README finding with exact 65-folder manifest.
- [x] Record manifest counts: 65 unique folders, 0 existing READMEs, 0 missing paths, 3 file-path mappings.
- [x] Record Task #36 batches B01-B17.

### Phase 3: README Implementation
- [x] Create B01-B05 READMEs. [Evidence: 20 files created and validated]
- [x] Create B06-B10 READMEs. [Evidence: 20 files created and validated]
- [x] Create B11-B15 READMEs. [Evidence: 20 files created and validated]
- [x] Create B16-B17 READMEs. [Evidence: 5 files created and validated]

### Phase 4: Verification
- [x] Run per-file README validation. [Test: validate_document.py across target READMEs]
- [x] Run strict phase validation. [Test: validate.sh --strict - PASSED]
- [x] Report validation exit summary. [Evidence: 0 errors, 0 warnings]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## 4A. PHASE DEPENDENCIES

| Dependency | Required Before | Notes |
|------------|-----------------|-------|
| Phase 051 README code template | Later README implementation | Provides concise README guidance. |
| Phase 052 resource map | README implementation and final verification | Defines exact 65-folder manifest and B01-B17 batches. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 4B. EFFORT ESTIMATE

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Phase scaffold and docs | Small | Spec docs only. |
| README implementation | Medium | Created 65 concise target READMEs and validated each file. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase folder template compliance | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase> --strict` |
| README validation | Target README format compliance | `python3 .opencode/skill/sk-doc/scripts/validate_document.py <README.md>` |
| Manifest verification | Exact target coverage | Existence check across all 65 target `README.md` files |
| Manual review | Boundary compliance and audit facts | Read phase docs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Task #36 manifest | Internal | Green | Provides the 65 unique folders, B01-B17 batches, and file-path mappings. |
| README implementation | Internal | Complete | Final manifest and strict validation checks passed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase created under the wrong parent or with wrong scope.
- **Procedure**: Remove the new child phase and parent phase-map row before any downstream work references it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 7A. ENHANCED ROLLBACK

If validation or scope review rejects this planning phase, remove the phase 052 child folder and the phase 052 parent map/handoff rows together so the parent manifest does not point at a missing child.
<!-- /ANCHOR:enhanced-rollback -->
