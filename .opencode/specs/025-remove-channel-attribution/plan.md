---
title: "Implementation Plan: Remove Channel Attribution"
description: "Deletes the deprecated channel-attribution artifacts, comments out the remaining dependent tests, and updates index documentation so it no longer points at removed files."
trigger_phrases:
  - "channel attribution plan"
  - "remove channel attribution"
  - "shadow scoring cleanup"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Remove Channel Attribution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, shell |
| **Framework** | Node.js + Vitest |
| **Storage** | None |
| **Testing** | Vitest + targeted repository search |

### Overview
This change removes the deprecated channel-attribution module and its historical documentation from `system-spec-kit`. The approach is to delete the requested files, comment out the test blocks that still rely on the deleted exports, and update the top-level catalog and playbook indexes so they do not reference removed documents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted repository cleanup

### Key Components
- **Deprecated eval module**: Remove `channel-attribution.ts` and its dedicated test file.
- **Dependent vitest suites**: Disable only the cases that still require deleted symbols.
- **Documentation indexes**: Remove sections and links that would otherwise become dead references.

### Data Flow
No runtime data-flow change is introduced. The work updates source layout, test coverage, and documentation to match the removal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Project structure created
- [x] Dependencies inspected
- [x] Development environment ready

### Phase 2: Core Implementation
- [x] Delete requested source, test, and markdown artifacts
- [x] Remove imports and comment out dependent vitest cases
- [x] Update feature catalog, eval README, and manual testing index entries

### Phase 3: Verification
- [x] Targeted vitest run complete
- [x] Repository search confirms no dangling edited references
- [x] Spec documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Affected eval and integration vitest suites | `vitest` |
| Integration | Imports and doc references across edited files | `rg` |
| Manual | Diff review for scope and deleted-file consistency | Git |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `system-spec-kit` Vitest setup | Internal | Green | Without it, we cannot confirm the edited suites still pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Affected vitest suites fail for reasons introduced by the removal or docs are found to rely on the deleted pages.
- **Procedure**: Restore the deleted files and re-enable the commented tests, then revisit the dependency cleanup more incrementally.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
