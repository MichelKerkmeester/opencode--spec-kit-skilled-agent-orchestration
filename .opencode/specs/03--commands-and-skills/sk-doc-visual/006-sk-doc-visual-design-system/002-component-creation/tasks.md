---
title: "Tasks"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: SK-Doc-Visual Additional Extraction (Phase 002)

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Task format: `T### [P?] Description (target path)`.
Tasks below track completed implementation and remaining follow-up validation for phase 002.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Re-verify section and component source line anchors in `readme-guide-v2.html`.
- [x] T002 Confirm scaffold conventions from existing previews (`../variables/*` and `template-defaults.js`).
- [x] T003 Create implementation branch checkpoint for phase 002 extraction work.
- [x] T004 [P] Build per-target extraction notes for all 12 sections and 5 components.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Section Extraction
- [x] T005 Create `spec-kit-documentation-section.html` from source section `#spec-kit-documentation`.
- [x] T006 Create `memory-engine-section.html` from source section `#memory-engine`.
- [x] T007 Create `agent-network-section.html` from source section `#agent-network`.
- [x] T008 Create `command-architecture-section.html` from source section `#command-architecture`.
- [x] T009 Create `skills-library-section.html` from source section `#skills-library`.
- [x] T010 Create `gate-system-section.html` from source section `#gate-system`.
- [x] T011 Create `code-mode-mcp-section.html` from source section `#code-mode-mcp` and rename to `tool-integration-section.html`.
- [x] T012 Create `extensibility-section.html` from source section `#extensibility`.
- [x] T013 Create `configuration-section.html` from source section `#configuration`.
- [x] T014 Create `usage-examples-section.html` from source section `#usage-examples`.
- [x] T015 Create `troubleshooting-section.html` from source section `#troubleshooting`.
- [x] T016 Create `related-documents-section.html` from source section `#related-documents`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Component Extraction
- [x] T017 Create `toc-link.html` with base, hover, and active state parity.
- [x] T018 Create `site-nav-link.html` with active and icon-capable variants.
- [x] T019 Create `main-grid-shell.html` covering `.main-grid`, `.sidebar`, and `.right-sidebar` layout behavior.
- [x] T020 Create `scroll-progress.html` with fixed top bar style and scroll width updates.
- [x] T021 Create `copy-code-interaction.html` that preserves `.code-window` button query contract and clipboard behavior.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: File Creation and Wiring
- [x] T022 Ensure every new preview file includes `../variables/*` imports.
- [x] T023 Ensure every new preview file includes `../variables/template-defaults.js`.
- [x] T024 [P] Apply naming consistency checks across all newly created files.
- [x] T025 Keep source-derived IDs/classes unchanged unless documented in ADR addendum.

### Phase 4b: Consolidation (Overlap Reduction)
- [x] T032 Analyze overlap across new section previews and identify merge candidates.
- [x] T033 Merge overlapping sections into consolidated templates: `operations-overview-section.html`, `setup-and-usage-section.html`, `support-section.html`.
- [x] T034 Remove redundant section files after merge and keep final 8-section library.
- [x] T035 Update `SKILL.md`, references, and `/create:visual_html` docs to match consolidated section model.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification
- [ ] T026 Open every new section preview and perform visual smoke checks. [PENDING: manual browser pass not yet recorded]
- [ ] T027 Open every new component preview and confirm state/interaction parity. [PENDING: manual browser pass not yet recorded]
- [ ] T028 Verify copy-code interaction feedback and reset behavior. [PENDING: runtime interaction check not yet recorded]
- [ ] T029 Verify scroll-progress width updates on page scroll. [PENDING: runtime interaction check not yet recorded]
- [x] T030 Update checklist evidence and complete documentation sync work.
- [x] T031 Create `implementation-summary.md` after implementation is complete.
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All implementation tasks T001-T035 marked `[x]`.
- [x] No `[B]` tasks remain.
- [ ] Section/component outputs match source structure and interactions. [PENDING: final manual browser parity pass]
- [ ] Checklist evidence complete for completion claim. [PENDING: post-browser evidence]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Specification source: `spec.md`.
- Implementation sequencing: `plan.md`.
- Verification gates: `checklist.md`.
- Convention rationale: `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
