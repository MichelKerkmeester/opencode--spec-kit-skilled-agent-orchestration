---
title: "Feature Specification: Memory Hook Cleanup - Remove Claude Code Hook References [004-memory-hook-cleanup/spec]"
description: "Remove outdated Claude Code Hook references from workflows-memory skill for OpenCode compatibility."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "hook"
  - "cleanup"
  - "spec"
  - "004"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Memory Hook Cleanup - Remove Claude Code Hook References

Remove outdated Claude Code Hook references from workflows-memory skill for OpenCode compatibility.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Fix
- **Tags**: workflows-memory, opencode-compatibility
- **Priority**: P1
- **Feature Branch**: `008-memory-hook-cleanup`
- **Created**: 2025-12-13
- **Status**: In Progress
- **Input**: User request to analyze and remove Claude Code Hook references from workflows-memory skill

### Stakeholders
- Developer (Michel)

### Purpose
Remove misleading Claude Code Hook references from the workflows-memory skill documentation to ensure accuracy for OpenCode (which does not have hooks).

### Assumptions
- OpenCode does not support Claude Code Hooks
- The memory system works via MCP tools and slash commands, not hooks
- References stating "no hooks required" should be KEPT (they are correct)
- Only references implying hook functionality should be removed/updated

---

## 2. SCOPE

### In Scope
- Update README.md architecture diagram to remove "UserPromptSubmit Hook" reference
- Update README.md storage table to change "hook execution" to "trigger execution"

### Out of Scope
- Removing correct statements like "No hooks required" (these should stay)
- Modifying test file references (just documentation, not functional code)
- Changes to other skill files (no problematic references found)

---

## 3. USERS & STORIES

### User Story 1 - Accurate Documentation (Priority: P0)

As a developer using OpenCode, I need the workflows-memory documentation to accurately reflect how the system works without implying Claude Code Hook functionality that doesn't exist.

**Why This Priority**: P0 because misleading documentation causes confusion and wasted debugging time.

**Independent Test**: Documentation accurately describes trigger-based (not hook-based) functionality.

**Acceptance Scenarios**:
1. **Given** README.md architecture diagram, **When** I read it, **Then** I don't see references to "UserPromptSubmit Hook"
2. **Given** README.md storage table, **When** I read it, **Then** performance is described as "trigger execution" not "hook execution"

---

## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** README.md MUST NOT contain architecture diagrams referencing Claude Code hooks
- **REQ-FUNC-002:** README.md MUST describe trigger execution, not hook execution

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Accurate Documentation | REQ-FUNC-001, REQ-FUNC-002 | Documentation cleanup |

---

## 5. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: No "UserPromptSubmit Hook" in README.md architecture diagram
- **SC-002**: "hook execution" replaced with "trigger execution" in README.md

---

## 6. ANALYSIS RESULTS

### Files Analyzed
- SKILL.md - No problematic hook references
- README.md - 2 problematic references found (lines 599-601, 639)
- execution_methods.md - "No hooks required" (KEEP - correct statement)
- trigger_config.md - "environments without hooks" (KEEP - correct statement)
- semantic_memory.md - No hook references
- troubleshooting.md - No hook references
- Other reference files - No problematic hook references

### Required Changes

| File | Line | Current | Action |
|------|------|---------|--------|
| README.md | 599-601 | "UserPromptSubmit Hook" in diagram | REMOVE/UPDATE |
| README.md | 639 | "hook execution" | CHANGE to "trigger execution" |

### No Changes Needed

| File | Line | Content | Reason to Keep |
|------|------|---------|----------------|
| execution_methods.md | 177 | "No hooks required" | Correct statement |
| trigger_config.md | 84 | "environments without hooks" | Correct statement |
| README.md | 312 | Table showing "Hooks = No" | Correct documentation |

---

## CHANGELOG

### v1.0 (2025-12-13)
**Initial specification**
- Documented analysis results
- Identified 2 problematic references in README.md
- Confirmed other hook references are correct and should be kept
