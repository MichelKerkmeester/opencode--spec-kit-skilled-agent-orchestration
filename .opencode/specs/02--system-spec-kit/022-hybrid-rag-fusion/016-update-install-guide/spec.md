---
title: "Update Install Guide"
description: "Verify and update the MCP server installation guide against current build system and dependencies."
trigger_phrases:
  - "install guide update"
  - "020 install guide"
  - "installation documentation"
  - "mcp install"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Specification: 016-update-install-guide

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-15 |
| **Branch** | `main` |
| **Parent** | `022-hybrid-rag-fusion` (Phase 020) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The install guide (`mcp_server/INSTALL_GUIDE.md`, ~930 lines) has a solid 5-phase gate structure but was written before the final dependency set stabilized. Some installation steps may reference outdated package names, missing build scripts, or stale platform-specific configurations. No rollback procedure exists if installation fails midway.

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
- README rewrite (owned by `015-rewrite-memory-mcp-readme`)
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
| IG-001 | All installation steps verified against current `package.json` | Every dependency name and version referenced in the guide exists in the current `package.json` |
| IG-002 | 5-phase gate structure preserved | The existing phase structure is intact with no phases removed or reordered |
| IG-003 | DQI >= 75 | `validate_document.py` scores the final document at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| IG-004 | Rollback procedure added | A dedicated section explains how to cleanly revert a failed installation |
| IG-005 | Platform configs refreshed | macOS, Linux, and Windows sections reflect current build requirements |
| IG-006 | Verification commands current | All test/build commands in the guide produce expected output with current codebase |
| IG-007 | No banned HVR words | Zero matches for sk-doc banned word list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh installation following the guide succeeds end-to-end on macOS
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: Rollback procedure documented and reachable from failure points
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
SPEC: 016-update-install-guide
Level 1 — In Progress (2026-03-15)
Target: Update (not rewrite) the install guide against current deps
-->
