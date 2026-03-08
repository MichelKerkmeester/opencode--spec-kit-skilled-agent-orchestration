---
title: "Feature Specification: Git Context Extractor for Stateless Memory Saves [025-git-context-extractor/spec]"
description: "Add a small dedicated extractor that captures repository state for stateless memory-save flows so saves can include consistent git context without depending on prior session state."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "git context extractor"
  - "stateless memory save"
  - "memory save git context"
  - "extractor"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Git Context Extractor for Stateless Memory Saves

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-08 |
| **Branch** | `025-git-context-extractor` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Stateless memory saves need a reliable way to attach current repository context such as branch, commit reference, and dirty-state hints. The extractor set in `.opencode/skill/system-spec-kit/scripts/extractors/` does not yet include a focused git-context module, which makes save-time context gathering inconsistent and harder to reuse.

### Purpose
Provide a dedicated TypeScript extractor that returns normalized git context for stateless memory-save workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts`.
- Follow existing extractor conventions for input, output, and error handling.
- Return a safe fallback shape when git metadata is unavailable.

### Out of Scope
- Changing the broader memory-save storage schema beyond what the extractor returns.
- Reworking unrelated extractor modules or the memory indexing pipeline.
- Adding new repository analytics beyond the minimal save-time git snapshot.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts` | Create | Add a dedicated extractor for git metadata used by stateless memory saves. |
| `.opencode/skill/system-spec-kit/scripts/extractors/index.ts` | Modify | Export the new extractor if the current extractor registry requires explicit wiring. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create a dedicated git-context extractor module. | The new TypeScript file exists in the extractor directory and follows the local module style used by adjacent extractors. |
| REQ-002 | Capture the minimum git context needed for stateless saves. | The extractor returns a normalized object that includes current branch or head reference, a commit identifier when available, and a repo-state indicator such as dirty or unavailable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Handle missing git context safely. | Running outside a git repo, in detached HEAD, or without git installed does not crash the save flow and returns an explicit fallback state. |
| REQ-004 | Keep the integration surface small and reusable. | The plan and tasks define a minimal integration path so stateless memory saves can call the extractor without introducing unrelated pipeline changes. |

### Acceptance Scenarios

1. **Given** the save flow runs inside a normal git repository, **when** the extractor is called, **then** it returns the current branch or head reference plus commit and repo-state details in the expected response shape.
2. **Given** the save flow runs where git metadata cannot be resolved, **when** the extractor is called, **then** it returns a documented unavailable-state object and the caller can continue without an unhandled error.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Stateless memory-save work has a dedicated extractor file for repository context instead of ad hoc git lookups.
- **SC-002**: The implementation can distinguish normal repo state from unavailable or detached-head cases without throwing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local git CLI and repository metadata | Missing or unexpected git output could leave save payloads incomplete. | Treat git access as best-effort and return a documented fallback object. |
| Risk | Extractor contract drift | If the stateless save flow expects a different response shape, follow-up wiring work may be needed. | Inspect adjacent extractors first and keep the output shape explicit in implementation notes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact fields does the stateless memory-save caller want persisted beyond branch, commit, and dirty state?
- Does the current extractor barrel or save pipeline require an explicit export update when the new file lands?
<!-- /ANCHOR:questions -->

---
