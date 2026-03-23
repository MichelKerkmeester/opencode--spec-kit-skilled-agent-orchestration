---
title: "Feature Specification: Remove Channel Attribution"
description: "Removes the deprecated channel-attribution module and its historical documentation from system-spec-kit. Cleans the remaining tests and index documents so the repository no longer points at deleted artifacts."
trigger_phrases:
  - "channel attribution"
  - "remove channel attribution"
  - "shadow scoring cleanup"
  - "system-spec-kit cleanup"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Remove Channel Attribution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-23 |
| **Branch** | `025-remove-channel-attribution` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository still ships a deprecated `channel-attribution.ts` module, its dedicated tests, and multiple documentation entries that describe it as a supported evaluation feature. Removing only the source file would leave broken imports and dead links in test and catalog documents.

### Purpose
Retire the channel-attribution artifacts cleanly so tests, indexes, and eval documentation match the code that remains.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the requested channel-attribution source, test, and documentation files.
- Remove channel-attribution imports and disable the test blocks that depended on them.
- Remove or update catalog, playbook, and eval README references that would otherwise point to deleted artifacts.

### Out of Scope
- Refactoring remaining shadow-scoring code that does not depend on channel attribution.
- Changing evaluation behavior beyond keeping the test suite and docs consistent with the removal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts` | Delete | Remove deprecated evaluation helper module |
| `.opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts` | Delete | Remove dedicated test coverage for the deleted module |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts` | Modify | Remove import and disable channel-attribution-specific tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts` | Modify | Remove imports and disable channel-attribution-specific tests |
| `.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md` | Delete | Remove obsolete feature entry |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Remove the corresponding section and dead link |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` | Modify | Remove the corresponding simplified section |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/015-shadow-scoring-and-channel-attribution-r13-s2.md` | Delete | Remove obsolete manual test scenario |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Remove dead references to the deleted playbook entry |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md` | Modify | Remove channel-attribution mentions from eval docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Requested channel-attribution files are removed | The four specified files no longer exist in the working tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Remaining tests compile without channel-attribution imports | `shadow-scoring.vitest.ts` and `mpab-quality-gate-integration.vitest.ts` no longer import the deleted module, and dependent tests are commented out |
| REQ-003 | Repository docs stop advertising the removed feature | The feature catalog, simple-terms catalog, eval README, and root manual testing index no longer reference channel attribution artifacts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Targeted tests and docs contain no live imports or index links to `channel-attribution.ts`.
- **SC-002**: Verification passes for the affected vitest files and repository search shows no dangling references in the edited index documents.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vitest coverage for shadow-scoring and integration suites | Medium | Comment out only the channel-attribution-specific tests; keep unrelated coverage intact |
| Risk | Deleting docs leaves broken root-index links | Medium | Remove matching index entries in catalog and playbook files during the same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The user provided an exact removal list and requested execution without follow-up questions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
