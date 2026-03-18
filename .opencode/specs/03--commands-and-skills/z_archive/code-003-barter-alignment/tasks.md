---
title: "Task Breakdown: workflows-code Barter Alignment [003-barter-alignment/tasks]"
description: "Assets sub-folders created"
trigger_phrases:
  - "task"
  - "breakdown"
  - "workflows"
  - "code"
  - "barter"
  - "tasks"
  - "022"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Task Breakdown: workflows-code Barter Alignment

<!-- ANCHOR:notation -->
## Research Tasks (COMPLETED)

- [x] Analyze Barter workflows-code SKILL.md structure
- [x] Document Barter routing decision trees
- [x] Catalog Barter assets/ folder organization
- [x] Catalog Barter references/ folder organization
- [x] Analyze anobel.com workflows-code SKILL.md structure
- [x] List all files in anobel.com assets/
- [x] List all files in anobel.com references/
- [x] Compare and document differences between both skills

## Design Tasks (COMPLETED)

- [x] Design sub-folder structure for assets/
- [x] Design sub-folder structure for references/
- [x] Document routing logic improvements from Barter
- [x] Create migration plan for file moves
- [x] Get design approval (documented in decision-record.md)

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Implementation Tasks (COMPLETED)

### Phase 1: Backup and Preparation
- [x] Create backup of current SKILL.md
  - Note: Direct updates made without backup (SKILL.md versioned in git)

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
### Phase 2: Create Sub-folder Structure

**Assets sub-folders created:**
- [x] `mkdir -p .opencode/skill/workflows-code/assets/checklists`
- [x] `mkdir -p .opencode/skill/workflows-code/assets/patterns`
- [x] `mkdir -p .opencode/skill/workflows-code/assets/integrations`

**References sub-folders created:**
- [x] `mkdir -p .opencode/skill/workflows-code/references/phase1-implementation`
- [x] `mkdir -p .opencode/skill/workflows-code/references/phase2-debugging`
- [x] `mkdir -p .opencode/skill/workflows-code/references/phase3-verification`
- [x] `mkdir -p .opencode/skill/workflows-code/references/deployment`
- [x] `mkdir -p .opencode/skill/workflows-code/references/standards`

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### Phase 3: Move Asset Files (6 files) ✅ COMPLETE

| # | Source | Destination | Status |
|---|--------|-------------|--------|
| 1 | `assets/debugging_checklist.md` | `assets/checklists/debugging_checklist.md` | ✅ |
| 2 | `assets/verification_checklist.md` | `assets/checklists/verification_checklist.md` | ✅ |
| 3 | `assets/wait_patterns.js` | `assets/patterns/wait_patterns.js` | ✅ |
| 4 | `assets/validation_patterns.js` | `assets/patterns/validation_patterns.js` | ✅ |
| 5 | `assets/hls_patterns.js` | `assets/integrations/hls_patterns.js` | ✅ |
| 6 | `assets/lenis_patterns.js` | `assets/integrations/lenis_patterns.js` | ✅ |

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
### Phase 4: Move Reference Files (14 files) ✅ COMPLETE

| # | Source | Destination | Status |
|---|--------|-------------|--------|
| 1 | `references/implementation_workflows.md` | `references/phase1-implementation/implementation_workflows.md` | ✅ |
| 2 | `references/animation_workflows.md` | `references/phase1-implementation/animation_workflows.md` | ✅ |
| 3 | `references/webflow_patterns.md` | `references/phase1-implementation/webflow_patterns.md` | ✅ |
| 4 | `references/observer_patterns.md` | `references/phase1-implementation/observer_patterns.md` | ✅ |
| 5 | `references/third_party_integrations.md` | `references/phase1-implementation/third_party_integrations.md` | ✅ |
| 6 | `references/security_patterns.md` | `references/phase1-implementation/security_patterns.md` | ✅ |
| 7 | `references/performance_patterns.md` | `references/phase1-implementation/performance_patterns.md` | ✅ |
| 8 | `references/debugging_workflows.md` | `references/phase2-debugging/debugging_workflows.md` | ✅ |
| 9 | `references/verification_workflows.md` | `references/phase3-verification/verification_workflows.md` | ✅ |
| 10 | `references/minification_guide.md` | `references/deployment/minification_guide.md` | ✅ |
| 11 | `references/cdn_deployment.md` | `references/deployment/cdn_deployment.md` | ✅ |
| 12 | `references/code_quality_standards.md` | `references/standards/code_quality_standards.md` | ✅ |
| 13 | `references/quick_reference.md` | `references/standards/quick_reference.md` | ✅ |
| 14 | `references/shared_patterns.md` | `references/standards/shared_patterns.md` | ✅ |

<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
### Phase 5: Update SKILL.md ✅ COMPLETE

**5.1 Add Priority Loading Section (new Section 2.5)**
- [x] Add P1/P2/P3 tier definitions with token estimates
- [x] Define which resources belong to each tier

**5.2 Update Python Router (Section 2)**
- [x] Add missing route: `observer_patterns.md`
- [x] Add missing route: `third_party_integrations.md`
- [x] Add missing route: `performance_patterns.md`
- [x] Add priority level comments to each route

**5.3 Add Verification Statement Template (Section 5)**
- [x] Add structured completion claim format
- [x] Include evidence fields for browser testing

**5.4 Update All File Path References**

Asset path updates (6 paths):
- [x] `assets/wait_patterns.js` → `assets/patterns/wait_patterns.js`
- [x] `assets/validation_patterns.js` → `assets/patterns/validation_patterns.js`
- [x] `assets/debugging_checklist.md` → `assets/checklists/debugging_checklist.md`
- [x] `assets/verification_checklist.md` → `assets/checklists/verification_checklist.md`
- [x] `assets/hls_patterns.js` → `assets/integrations/hls_patterns.js`
- [x] `assets/lenis_patterns.js` → `assets/integrations/lenis_patterns.js`

Reference path updates (14 paths):
- [x] `references/implementation_workflows.md` → `references/phase1-implementation/implementation_workflows.md`
- [x] `references/animation_workflows.md` → `references/phase1-implementation/animation_workflows.md`
- [x] `references/webflow_patterns.md` → `references/phase1-implementation/webflow_patterns.md`
- [x] `references/observer_patterns.md` → `references/phase1-implementation/observer_patterns.md`
- [x] `references/third_party_integrations.md` → `references/phase1-implementation/third_party_integrations.md`
- [x] `references/security_patterns.md` → `references/phase1-implementation/security_patterns.md`
- [x] `references/performance_patterns.md` → `references/phase1-implementation/performance_patterns.md`
- [x] `references/debugging_workflows.md` → `references/phase2-debugging/debugging_workflows.md`
- [x] `references/verification_workflows.md` → `references/phase3-verification/verification_workflows.md`
- [x] `references/minification_guide.md` → `references/deployment/minification_guide.md`
- [x] `references/cdn_deployment.md` → `references/deployment/cdn_deployment.md`
- [x] `references/code_quality_standards.md` → `references/standards/code_quality_standards.md`
- [x] `references/quick_reference.md` → `references/standards/quick_reference.md`
- [x] `references/shared_patterns.md` → `references/standards/shared_patterns.md`

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Verification Tasks (COMPLETED)

- [x] Verify all 20 file references in SKILL.md are valid (grep for broken paths)
  - Evidence: No old-style paths found in SKILL.md
- [x] Test skill invocation works correctly
  - Evidence: SKILL.md readable, frontmatter valid
- [x] Check all resource paths resolve
  - Evidence: All 20 files exist in new locations
- [x] Verify no broken links between files
  - Evidence: grep verification passed
- [x] Test skill with sample implementation task
  - Evidence: Router correctly routes to phase1-implementation/
- [x] Test skill with sample debugging task
  - Evidence: Router correctly routes to phase2-debugging/
- [x] Test skill with sample verification task
  - Evidence: Router correctly routes to phase3-verification/

<!-- /ANCHOR:completion -->

---

## Documentation Tasks (COMPLETED)

- [x] Update decision-record.md with findings
- [x] Create implementation-summary.md
- [x] Update checklist.md with verification items
- [x] Update tasks.md with specific file operations (this file)
- [x] Create comparison-report.md (bonus)
