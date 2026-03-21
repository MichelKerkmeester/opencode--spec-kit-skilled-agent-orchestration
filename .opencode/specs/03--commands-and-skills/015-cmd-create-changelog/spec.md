---
title: "Feature Specification: Create Changelog Command [015-cmd-create-changelog/spec]"
description: "No automated way to create changelog entries — developers must manually determine the component, version number, and format each time, leading to inconsistent entries and forgotten changelogs."
trigger_phrases:
  - "feature"
  - "specification"
  - "changelog"
  - "create changelog"
  - "command"
  - "015"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Create Changelog Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No automated way to create changelog entries. Developers must manually determine the correct component subfolder (out of 18), calculate the next version number, and format the entry according to the established template. This leads to inconsistent entries, forgotten changelogs, and version numbering errors.

### Purpose
A `/create:changelog` command that dynamically detects what was worked on, resolves the correct changelog subfolder, calculates the next version, and generates a properly formatted changelog file — reducing manual effort and ensuring consistency.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Command file: `.opencode/command/create/changelog.md` (mode-based, :auto/:confirm)
- Auto YAML workflow: `.opencode/command/create/assets/create_changelog_auto.yaml`
- Confirm YAML workflow: `.opencode/command/create/assets/create_changelog_confirm.yaml`
- Dynamic detection of recent work via spec folders and git history
- Component resolution mapping (file paths to 18 changelog subfolders)
- Automatic version number calculation (MAJOR.MINOR.PATCH.BUILD)
- Content generation following established changelog format
- Quality validation of generated changelog files

### Out of Scope
- Modifying existing changelog files — create-only
- Umbrella release management (00--opencode-environment aggregation) — separate workflow
- Changelog folder restructuring or renaming
- Git tag creation or release management
- Automated publishing/deployment of changelogs

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/changelog.md` | Create | Mode-based command file with Phase 0, Setup Phase, and YAML routing |
| `.opencode/command/create/assets/create_changelog_auto.yaml` | Create | 7-step autonomous workflow with component mapping and content generation |
| `.opencode/command/create/assets/create_changelog_confirm.yaml` | Create | 7-step interactive workflow with checkpoint gates at each step |
| `.opencode/command/create/README.txt` | Modify | Add changelog command entry to command index |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command file follows mode-based command template | `grep -c "Phase 0" changelog.md` returns 1; `grep -c "Setup Phase" changelog.md` returns 1 |
| REQ-002 | Auto and confirm YAML workflows exist | Files `create_changelog_auto.yaml` and `create_changelog_confirm.yaml` exist in `assets/` |
| REQ-003 | Dynamic work detection from spec folder | When spec folder path provided, workflow reads implementation-summary.md, tasks.md, spec.md to extract work context |
| REQ-004 | Component resolution maps files to correct changelog subfolder | Component mapping table covers all 18 changelog subfolders (00-17) |
| REQ-005 | Version calculation produces correct next version | Workflow scans existing files, parses latest version, applies correct bump type |
| REQ-006 | Generated changelog follows established format | Output includes: H1 version, project backlink, date+version header, summary, highlights, files changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Git history fallback when no spec folder provided | `git log --since` analysis extracts changed files and commit messages |
| REQ-008 | Cross-component detection suggests multiple changelogs | When work spans 2+ components, workflow identifies all affected components |
| REQ-009 | Version bump type auto-detection from change type | Feature=MINOR, Fix=PATCH, Breaking=MAJOR, Hotfix=BUILD heuristics applied |
| REQ-010 | README.txt updated with new command entry | `grep "changelog" README.txt` returns matching line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:changelog` with spec folder path generates a valid changelog file in the correct subfolder
- **SC-002**: Generated changelog version number is sequential (no gaps, no duplicates)
- **SC-003**: Generated changelog content includes all required sections per established format
- **SC-004**: Command supports both `:auto` and `:confirm` execution modes
- **SC-005**: Component resolution correctly maps at least 90% of file paths to changelog subfolders
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Component mapping may not cover edge cases | Med | Default to "00--opencode-environment" umbrella for unmatched paths |
| Risk | Version parsing may fail on non-standard filenames | Low | Strict regex validation with fallback to v1.0.0.0 for new components |
| Dependency | Existing changelog format consistency | Low | Format derived from analysis of 370+ existing changelog files |
| Dependency | Git history availability | Low | Spec folder artifacts serve as primary source; git is secondary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Command workflow completes in a single session without context overflow
- **NFR-P02**: Component resolution lookup is instantaneous (embedded mapping table)

### Reliability
- **NFR-R01**: Version calculation never produces duplicate version numbers
- **NFR-R02**: Generated files are always valid markdown

### Maintainability
- **NFR-M01**: Component mapping table is clearly structured for easy updates when new components are added
- **NFR-M02**: Changelog format template is defined in one place within the YAML
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty spec folder (no artifacts): Fall back to git history analysis
- No git history available: Prompt user for manual input
- New component with no existing changelogs: Start at v1.0.0.0

### Error Scenarios
- Spec folder path doesn't exist: Error with suggestion to provide valid path
- Multiple components detected: Present list for user selection (auto: use all)
- Version conflict (file already exists): Increment BUILD segment

### State Transitions
- Partial completion (file written but not validated): Re-run validation step
- Cross-component work: Generate one changelog per component (user confirms in :confirm mode)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 3 new files + 1 modification, ~1000 LOC total |
| Risk | 8/25 | Pattern-following, no breaking changes, no auth |
| Research | 5/20 | Comprehensive research completed — patterns well understood |
| **Total** | **28/70** | **Level 2 — Medium complexity, established patterns** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — all design decisions resolved through research
<!-- /ANCHOR:questions -->

---
