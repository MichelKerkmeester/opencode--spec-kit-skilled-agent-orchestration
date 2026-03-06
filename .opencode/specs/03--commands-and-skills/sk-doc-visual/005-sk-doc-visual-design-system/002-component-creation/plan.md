---
title: "Implementation Plan"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: SK-Doc-Visual Additional Extraction (Phase 002)

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | HTML, CSS, JavaScript, Markdown |
| **Framework** | Static preview templates with Tailwind utility usage |
| **Primary Source** | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` |
| **Validation Tool** | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |

### Overview
This plan was executed to extract additional previews and then reduce overlap.
Implementation produced 5 new component previews and consolidated sections to a final 8-file reusable section library.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [x] Problem statement and scope captured in `spec.md`
- [x] Section/component extraction matrix captured with source lines
- [x] Dependencies and naming conventions documented

### Definition of Done
- [x] Section previews consolidated under `.opencode/skill/sk-doc-visual/assets/sections/` to the final 8-file set
- [x] New component previews created under `.opencode/skill/sk-doc-visual/assets/components/`
- [ ] Visual and interaction verification completed (manual browser evidence pending)
- [x] `implementation-summary.md` authored during completion phase
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Source-anchored extraction pattern with deterministic file naming and shared preview scaffolding.

### Key Components
- **Section previews**: Consolidated generic set (`hero`, `quickstart`, `features`, `operations-overview`, `extensibility`, `setup-and-usage`, `support`, `related-documents`).
- **Component previews**: Isolated files for `toc-link`, `site-nav-link`, `main-grid shell`, `scroll-progress`, and copy-code interaction.
- **Shared preview scaffold**: Reuse variable imports and `template-defaults.js` from existing preview files.

### Data Flow
Canonical template source -> extraction matrix -> staged file creation -> visual/behavior verification -> completion artifacts.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup and Baseline Alignment
- Confirm source lines for all extraction targets in `readme-guide-v2.html`.
- Confirm naming conventions against existing files in `assets/sections/` and `assets/components/`.
- Prepare target file list and acceptance checklist for implementation.

### Phase 2: Section Extraction
- Create section previews for remaining README coverage.
- Preserve section wrapper IDs, semantic structure, and internal class names.
- Ensure each section preview uses `../variables/*` styles and `../variables/template-defaults.js`.

### Phase 2b: Section Consolidation
- Analyze overlap and merge similar sections into reusable generic templates.
- Replace multiple highly similar sections with `operations-overview`, `setup-and-usage`, and `support`.
- Remove redundant section files after merge.

### Phase 3: Component Extraction
- Create standalone component previews for `toc-link`, `site-nav-link`, `main-grid shell`, `scroll-progress`, and copy-code interaction contract.
- Include script behavior for scroll progress and clipboard copy interaction where applicable.

### Phase 4: Verification and Handoff
- Verify each preview opens without missing variable dependencies.
- Verify interactive components match source behavior contract.
- Update checklist evidence and implementation summary.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static traceability | Source line fidelity for all targets | `grep`, `read` |
| Visual smoke test | Open each new preview file and confirm rendering | Browser |
| Interaction verification | `scroll-progress` and copy-code behavior | Browser + console |
| Documentation validation | Spec Kit plan artifacts | `validate.sh` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` | Internal | Green | Cannot perform canonical extraction |
| Existing preview files (`hero-section.html`, `code-window.html`) | Internal | Green | Convention baseline unavailable |
| `../variables/*` and `template-defaults.js` | Internal | Green | New previews may render inconsistently |
| Spec validator script | Internal | Green | Cannot confirm plan-document completeness |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: Extracted previews fail parity checks against source or violate shared scaffold conventions.
- **Procedure**:
  1. Revert only files created for this phase.
  2. Reconfirm source line anchors from the matrix.
  3. Recreate previews using baseline scaffold from existing section/component previews.
  4. Re-run validation and visual checks before proceeding.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:ai-protocol -->
## AI Execution Protocol
### Pre-Task Checklist
- [x] Context and source lines loaded.
- [x] Consolidation targets documented.

### Execution Rules
| Rule | Description |
|------|-------------|
| R1 | Keep runtime template source (`readme-guide-v2.html`) unchanged. |
| R2 | Modify only target preview assets and related phase/docs paths. |
| R3 | Preserve existing preview dependency conventions. |
| R4 | Capture source evidence for every target before coding. |

### Status Reporting Format
- Report phase status as one of: `Not Started`, `In Progress`, `Blocked`, `Complete`.
- Include completed task IDs, remaining task IDs, and blocker references when status is `Blocked`.

### Blocked Task Protocol
- If any target line reference becomes stale, pause implementation, refresh the matrix, and continue.
<!-- /ANCHOR:ai-protocol -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and Alignment | None | Section Extraction, Component Extraction |
| Section Extraction | Setup and Alignment | Verification |
| Component Extraction | Setup and Alignment | Verification |
| Verification and Handoff | Section Extraction, Component Extraction | Completion |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and Alignment | Low | 30-45 mins |
| Section Extraction | High | 4-6 hours |
| Component Extraction | Medium | 2-4 hours |
| Verification and Handoff | Medium | 1-2 hours |
| **Total** | | **7.5-12.75 hours** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
### Pre-implementation Safeguards
- [x] Source matrix committed in planning docs.
- [x] Implementation branch checkpoint created.
- [ ] Optional screenshots captured for parity comparison.

### Rollback Procedure
1. Remove newly created preview files from this phase.
2. Restore known-good set from git history.
3. Re-extract one section and one component as parity checks.
4. Resume only after parity checks pass.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; this phase affects static preview assets only.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
- Source template line anchors -> section/component extraction tasks.
- Existing preview scaffold conventions -> new file bootstrap consistency.
- Extraction completion -> verification checklist evidence -> implementation summary.

### Dependency Matrix
| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Section target matrix | Source template | Section file plan | Section extraction |
| Component target matrix | Source template | Component file plan | Component extraction |
| Preview scaffold convention | Existing preview files | Shared setup contract | All new preview files |
| Verification workflow | Created previews | Completion evidence | Handoff |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
1. Setup and source-line revalidation.
2. Complete all section preview extraction.
3. Complete component extraction with interaction behavior parity.
4. Run verification and documentation closure.

**Total Critical Path**: 7.5-12.75 hours.

**Parallel Opportunities**:
- Section extraction and component extraction can run in parallel after setup.
- Visual verification can begin per-file as soon as each extraction unit is complete.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Planning approved | All plan docs validated, no placeholders | Complete |
| M2 | Section previews complete | Final 8-section consolidated library produced | Complete |
| M3 | Component previews complete | 5 component files created, interactions statically verified | Complete |
| M4 | Completion package ready | Checklist + implementation summary updated; browser verification follow-up pending | In progress |
<!-- /ANCHOR:milestones -->
