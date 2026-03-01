---
title: "Implementation Plan: SpecKit Scratch Folder Enforcement - Technical Approach [001-scratch-enforcement/plan]"
description: "Implementation plan defining the recommended changes to enforce scratch folder usage across the SpecKit system, with full OpenCode compatibility (no hooks required)."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "scratch"
  - "folder"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: SpecKit Scratch Folder Enforcement - Technical Approach

Implementation plan defining the recommended changes to enforce scratch folder usage across the SpecKit system, with full OpenCode compatibility (no hooks required).

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: speckit, scratch-enforcement, templates, documentation, opencode-compatible
- **Priority**: P1 - High priority enhancement
- **Branch**: `004-speckit`
- **Date**: 2025-12-13
- **Spec**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/001-scratch-enforcement/spec.md

### Summary
Based on analysis from 8 parallel agents, implement documentation-based enforcement for scratch folder usage. Since OpenCode does NOT support hooks, all enforcement must work through documentation that AI agents read and follow directly.

### Technical Context
- **Files to Modify**: AGENTS.md, Templates (.opencode/speckit/templates/)
- **No Code Changes**: Documentation-only updates
- **OpenCode Compatible**: All changes work without hooks
- **Testing**: Manual verification of template guidance
- **Constraints**: Must work in OpenCode (documentation-based enforcement)

---

## 2. OPENCODE COMPATIBILITY STRATEGY

### The Problem
- OpenCode does NOT support hooks
- Cannot rely on PreToolUse/PostToolUse automation
- Must use documentation-based self-enforcement

### The Solution: Four-Layer Documentation Enforcement

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: AGENTS.md Critical Rules (Section 1)                   │
│   - MUST/NEVER rules read by ALL agents at session start        │
│   - Primary enforcement for OpenCode                            │
│   - Agents follow these rules regardless of hook support        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Failure Pattern Table (AGENTS.md Section 1)            │
│   - Pattern #15: Root Folder Pollution                          │
│   - Agents self-correct when recognizing anti-patterns          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: Template Guidance                                       │
│   - Explicit file organization sections in spec.md, tasks.md    │
│   - Decision flow diagrams for scratch vs memory vs root        │
│   - Works in OpenCode                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 4: Checklist Verification (PRIMARY ENFORCEMENT)           │
│   - CHK036-038: P1 items verified before completion             │
│   - Gate 6 blocks completion claims without verification        │
│   - Works identically in both environments                      │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Works in OpenCode

| Enforcement Layer | Status | Notes |
|-------------------|--------|-------|
| AGENTS.md rules | ✅ | Read at session start |
| Failure patterns | ✅ | Documentation-based self-correction |
| Template guidance | ✅ | No hooks needed |
| Checklist items | ✅ | Agent verifies before "done" |

---

## 3. IMPLEMENTATION PHASES

### Phase 1: AGENTS.md Updates (P0 - PRIMARY)

**This is the PRIMARY enforcement mechanism for OpenCode.**

**File:** `AGENTS.md`

**Change 1:** Add to Section 1 Critical Rules (after line ~240)

```markdown
- **All temporary files MUST go in scratch/** - test scripts, debug files, prototypes, exploration code MUST be placed in `specs/[###-name]/scratch/`, NEVER in project root or spec folder root
```

**Change 2:** Add to Failure Patterns Table (Section 1, around line 230)

| # | Pattern | Trigger Phrase | Response Action |
|---|---------|---------------|-----------------|
| 15 | Root Folder Pollution | Creating temp file | STOP → Move to scratch/ → Verify location |

**Change 3:** Add after "scratch/ Best Practices" (line ~408)

```markdown
**MANDATORY RULES (OpenCode Compatible - No Hooks Required):**
- **MUST** use `specs/[###-name]/scratch/` for ALL temporary/exploratory files
- **NEVER** create test scripts, debug files, or prototypes in project root
- **NEVER** place disposable content in spec folder root (use scratch/ instead)
- **VERIFY** file placement before claiming completion (CHK036-038)
- **CLEAN UP** scratch/ contents when task completes

> **OpenCode Users:** These rules replace hook-based enforcement. Verify manually before completion.
```

### Phase 2: Template Updates (P1)

**Files to Update:**

| File | Change | Lines to Add |
|------|--------|--------------|
| `.opencode/speckit/templates/spec.md` | Add "Working Files" section | ~20 lines |
| `.opencode/speckit/templates/tasks.md` | Add "File Organization" section | ~15 lines |
| `.opencode/speckit/templates/research.md` | Add "File Organization" section | ~15 lines |
| `.opencode/speckit/templates/checklist.md` | Add scratch cleanup items (CHK036-038) | ~8 lines |

### Phase 3: Command Updates (P2)

**Files to Update:**
- `.opencode/commands/spec_kit/complete.md`
- `.opencode/commands/spec_kit/implement.md`
- `.opencode/commands/spec_kit/research.md`

**Change:** Add scratch folder guidance to implementation steps

---

## 4. SPECIFIC CHANGES

### 4.1 AGENTS.md - Critical Rules Addition

**Location:** Section 1, after existing critical rules (around line 240)

```markdown
- **All temporary files MUST go in scratch/** - test scripts, debug files, prototypes, exploration code MUST be placed in `specs/[###-name]/scratch/`, NEVER in project root or spec folder root. This rule enforces via documentation.
```

### 4.2 AGENTS.md - Failure Pattern Addition

**Location:** Section 1, Failure Patterns table (around line 230)

Add row:
```markdown
| 15  | Root Folder Pollution | Creating temp file | STOP → Move to scratch/ → Verify |
```

### 4.3 AGENTS.md - Mandatory Rules Block

**Location:** After "scratch/ Best Practices" (line ~408)

```markdown
**MANDATORY RULES (OpenCode Compatible - No Hooks Required):**
- **MUST** use `specs/[###-name]/scratch/` for ALL temporary/exploratory files
- **NEVER** create test scripts, debug files, or prototypes in project root
- **NEVER** place disposable content in spec folder root (use scratch/ instead)
- **VERIFY** file placement before claiming completion (CHK036-038)
- **CLEAN UP** scratch/ contents when task completes

> **Note:** Verify file placement manually before claiming completion.
```

### 4.4 spec.md Template Addition

**Location:** After Section 11 APPENDIX (around line 320)

```markdown
---

## 12. WORKING FILES

### File Organization During Development

**Temporary/exploratory files MUST be placed in:**
- `scratch/` - For drafts, prototypes, debug logs, test queries (git-ignored)

**Permanent documentation belongs in:**
- Root of spec folder - spec.md, plan.md, tasks.md, etc.
- `memory/` - Session context and conversation history

**Anti-pattern - DO NOT:**
- Place temporary files (debug-*.md, test-*.js, scratch-*.json) in project root
- Place disposable content in spec folder root (use scratch/ instead)

### Decision Flow
```
Is this content disposable after the task?
  YES → scratch/
  NO  → Will future sessions need this context?
          YES → memory/
          NO  → spec folder (permanent docs)
```

> **OpenCode Users:** Verify file placement manually before claiming completion.
> See checklist items CHK036-038.
```

### 4.5 tasks.md Template Addition

**Location:** After CONVENTIONS section

```markdown
---

## WORKING FILES LOCATION

**IMPORTANT:** During implementation, use appropriate directories:

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

**MUST:** Place ALL temporary/debug files in `scratch/`
**NEVER:** Create temp files in spec folder root or project root

> **Note:** Verify file placement manually before completion.
```

### 4.6 research.md Template Addition

**Location:** After Section 1 METADATA

```markdown
---

## FILE ORGANIZATION

**During research, organize files as:**
- Research findings → This file (research.md)
- Experiments/code → `scratch/experiments/`
- Raw data/responses → `scratch/data/`
- Debug/logs → `scratch/logs/`

**After research:**
- Move valuable code to permanent location
- Summarize key data in research.md
- Delete scratch/ contents

> **Note:** Clean up scratch/ manually before claiming completion.
```

### 4.7 checklist.md Template Addition (PRIMARY ENFORCEMENT)

**Location:** Add new category in Section 3 (VALIDATION ITEMS)

```markdown
### File Organization

- [ ] CHK036 [P1] All temporary/debug files placed in scratch/ (not spec root or project root)
- [ ] CHK037 [P1] scratch/ cleaned up before claiming completion
- [ ] CHK038 [P2] Valuable scratch findings moved to memory/ or permanent docs

> **Note:** These items are the PRIMARY enforcement mechanism. Verify before completion.
```

---

## 5. SUCCESS CRITERIA

| Criteria | Verification | Status |
|----------|--------------|--------|
| AGENTS.md has MUST/NEVER rules for scratch | Manual review | ✅ |
| Failure pattern #15 added | Manual review | ✅ |
| spec.md template has file organization section | Manual review | ✅ |
| tasks.md template has working files guidance | Manual review | ✅ |
| research.md template has file organization section | Manual review | ✅ |
| checklist.md has CHK036-038 items | Manual review | ✅ |

---

## 6. ATTRIBUTION

This plan synthesizes findings from 8 parallel analysis agents:

| Agent | Contribution | Quality Gate |
|-------|--------------|--------------|
| Agent 1 | AGENTS.md scratch rules analysis | ✅ Pass |
| Agent 2 | workflows-spec-kit skill analysis | ✅ Pass |
| Agent 3 | spec_kit commands analysis | ✅ Pass |
| Agent 4 | .opencode config analysis | ✅ Pass |
| Agent 5 | Hooks enforcement analysis | ✅ Pass |
| Agent 6 | Scratch usage patterns search | ✅ Pass |
| Agent 7 | Template content analysis | ✅ Pass |
| Agent 8 | Root folder audit | ✅ Pass |

All agents passed accuracy, completeness, and consistency gates.

---

## 7. CHANGELOG

### v1.2 (2025-12-13)
- Removed Claude Code references (OpenCode-only going forward)
- Simplified enforcement tables
- Removed future work section for hooks

### v1.1 (2025-12-13)
- Added 4-layer documentation enforcement strategy
- Restructured phases: AGENTS.md now P0 (primary enforcement)

### v1.0 (2025-12-13)
- Initial implementation plan based on 8-agent analysis synthesis
