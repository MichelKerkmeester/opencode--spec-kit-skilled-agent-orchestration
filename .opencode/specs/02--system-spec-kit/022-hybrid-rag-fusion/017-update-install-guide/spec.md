---
title: "Update Install Guide"
description: "Verify and update the MCP server installation guide against current build system and dependencies."
trigger_phrases:
  - "install guide update"
  - "017 install guide"
  - "installation documentation"
  - "mcp install"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Specification: 017-update-install-guide

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (tasks tracker pending completion evidence) |
| **Created** | 2026-03-15 |
| **Branch** | `main` |
| **Parent** | `022-hybrid-rag-fusion` (Phase 017) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../016-rewrite-memory-mcp-readme/spec.md |
| **Successor** | ../018-rewrite-system-speckit-readme/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The install guide (mcp_server/INSTALL_GUIDE.md, ~930 lines) has a solid 5-phase gate structure but was written before the final dependency set stabilized. Some installation steps may reference outdated package names, missing build scripts, or stale platform-specific configurations. No rollback procedure exists if installation fails midway.

### Purpose

Verify every installation step against the current `package.json` and build system, update any stale references, add a rollback procedure, and refresh platform configs — all while preserving the proven 5-phase gate structure. DQI >= 75.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Update** | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| **Verify** | All installation steps against current `package.json` |
| **Add** | Rollback procedure for failed installations |
| **Refresh** | Platform-specific configurations (macOS, Linux, Windows) |
| **Update** | Verification commands to match current build output |

### Out of Scope

- MCP server runtime code changes
- README rewrite (owned by `016-rewrite-memory-mcp-readme`)
- Restructuring the 5-phase gate format (preserve it)
- Adding new installation methods not currently supported

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modify | Update against current deps, add rollback, refresh platform configs |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md.bak` | Create | Backup before update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All installation steps are verified against the current `package.json` (legacy `IG-001`) | Every dependency name and version referenced in the guide exists in the current `package.json` |
| REQ-002 | The 5-phase gate structure is preserved (legacy `IG-002`) | The existing phase structure remains intact with no phases removed or reordered |
| REQ-003 | DQI is at least 75 (legacy `IG-003`) | `validate_document.py` scores the final document at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A rollback procedure is added (legacy `IG-004`) | A dedicated section explains how to cleanly revert a failed installation |
| REQ-005 | Platform configs are refreshed (legacy `IG-005`) | macOS, Linux, and Windows sections reflect current build requirements |
| REQ-006 | Verification commands are current (legacy `IG-006`) | All test and build commands in the guide produce expected output with the current codebase |
| REQ-007 | The guide contains no banned HVR words (legacy `IG-007`) | Zero matches for the sk-doc banned word list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh installation following the guide succeeds end-to-end on macOS
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: Rollback procedure documented and reachable from failure points

### Acceptance Scenarios

**Given** the updated install guide, **when** a reviewer compares it against the current `package.json` and build scripts, **then** dependency names and verification commands match the live repo.

**Given** an installation failure midway through setup, **when** a user follows the rollback section, **then** they can return the environment to a clean pre-install state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current `package.json` | High | Read it before any edits |
| Risk | Platform-specific steps untestable locally | Medium | Document what was verified vs. what needs manual validation |
| Risk | Over-editing breaks the proven structure | Low | Update only, do not restructure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining — update scope is bounded by current `package.json` truth
<!-- /ANCHOR:questions -->

---

<!--
SPEC: 017-update-install-guide
Level 1 — In Progress (tasks tracker not yet reconciled, 2026-03-24)
Target: Update (not rewrite) the install guide against current deps
-->

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../016-rewrite-memory-mcp-readme/spec.md |
| **Next Phase** | ../018-rewrite-system-speckit-readme/spec.md |
