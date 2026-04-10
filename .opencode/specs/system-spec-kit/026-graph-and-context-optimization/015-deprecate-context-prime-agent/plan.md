---
title: "Implementation Plan: Deprecate context-prime Agent [template:level_1/plan.md]"
description: "This phase performs a documentation and agent-surface deprecation. The work removes obsolete runtime profiles, aligns orchestrator mirrors, and closes the packet with scoped verification."
trigger_phrases:
  - "implementation"
  - "plan"
  - "deprecate context-prime"
  - "phase 015"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Deprecate context-prime Agent

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TOML, repository documentation |
| **Framework** | Runtime agent profiles for OpenCode, Claude, Codex, and Gemini |
| **Storage** | None |
| **Testing** | Scoped `rg`, spec-kit strict validation, `git diff --check` |

### Overview
This phase is a bounded deprecation pass. It removes the redundant `context-prime` profile from the runtime agent directories, cleans the remaining orchestrator guidance that still dispatches it, and closes the packet with the exact verification command requested for the agent directories and `CLAUDE.md`.
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
Documentation-first runtime surface deprecation

### Key Components
- **Runtime agent definitions**: Remove the deprecated `context-prime` profile from the visible agent directories
- **Orchestrator mirrors**: Keep OpenCode and Codex orchestration instructions aligned after the profile deletion
- **Phase packet**: Record implemented status, completed tasks, and verification evidence in a validator-compliant layout

### Data Flow
The work starts by deleting the obsolete runtime profile artifacts, then updates the remaining orchestrator and root guidance to stop advertising `@context-prime`, and ends by validating the phase packet plus the requested zero-match grep across the scoped runtime surfaces.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the bound phase packet and all targeted runtime files before editing
- [x] Confirm the exact verification surface for the runtime agent directories and `CLAUDE.md`
- [x] Identify every scoped `context-prime` occurrence that must be removed

### Phase 2: Core Implementation
- [x] Delete the deprecated runtime profile artifacts
- [x] Remove stale `@context-prime` guidance from the OpenCode and Codex orchestrator definitions
- [x] Remove the deprecated agent entry from `CLAUDE.md`
- [x] Update the phase packet to implemented state

### Phase 3: Verification
- [x] Run the scoped zero-match grep for the runtime agent directories and `CLAUDE.md`
- [x] Run strict spec-kit validation on the Phase 015 packet
- [x] Run `git diff --check` on the touched files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Search verification | Scoped runtime agent directories plus `CLAUDE.md` | `rg` |
| Packet validation | Phase 015 spec folder structure and content | `validate.sh --strict` |
| Diff hygiene | Whitespace and patch sanity on touched files | `git diff --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime agent mirrors | Internal | Green | A stale mirror would keep surfacing the deprecated agent after deletion |
| Spec-kit validator | Internal | Green | The phase cannot be closed as complete without a clean strict validation result |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Runtime guidance still depends on `@context-prime` or the scoped verification surface regresses after deletion.
- **Procedure**: Restore the deleted runtime profiles and the paired orchestrator references from version control, then rerun the scoped grep and spec validation.
<!-- /ANCHOR:rollback -->

---
