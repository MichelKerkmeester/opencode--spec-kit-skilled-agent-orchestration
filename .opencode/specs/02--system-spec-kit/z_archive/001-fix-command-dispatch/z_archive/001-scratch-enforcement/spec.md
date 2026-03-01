---
title: "Feature Specification: SpecKit Scratch Folder Enforcement - Requirements & Analysis [001-scratch-enforcement/spec]"
description: "Complete specification for enforcing scratch folder usage to prevent root folder pollution."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "scratch"
  - "folder"
  - "spec"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: SpecKit Scratch Folder Enforcement - Requirements & Analysis

Complete specification for enforcing scratch folder usage to prevent root folder pollution.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: speckit, file-organization, enforcement, scratch-folder
- **Priority**: P1
- **Feature Branch**: `004-speckit`
- **Created**: 2025-12-13
- **Status**: In Progress
- **Input**: User request to analyze SpecKit system and enforce scratch folder usage for temporary files

### Stakeholders
- AI Agent System (OpenCode)
- Development Team

### Purpose
Ensure AI agents never place random scripts, tests, or temporary files in the project root folder, directing them to use `specs/[###-name]/scratch/` directories instead.

### Analysis Summary

**Current State:** Root folder is CLEAN - no immediate violations found.

**Key Finding:** DOCUMENTATION-ENFORCEMENT GAP exists. Scratch folders are well-documented in AGENTS.md and workflows-spec-kit skill, but have ZERO enforcement mechanisms in hooks or commands.

---

## 2. SCOPE

### In Scope
- Analysis of all SpecKit system components for scratch folder guidance
- Identification of enforcement gaps across hooks, templates, and commands
- Recommendations for implementing scratch folder enforcement
- Template updates to add explicit scratch guidance

### Out of Scope
- Implementation of new hooks (documented as recommendations only)
- Changes to unrelated parts of the codebase
- Automated cleanup scripts for scratch folders

---

## 3. ANALYSIS FINDINGS

### 3.1 Agent Contribution Summary

| Agent | Focus Area | Key Finding |
|-------|------------|-------------|
| Agent 1 | AGENTS.md | Scratch documented at lines 381-408, but NO enforcement mechanism |
| Agent 2 | workflows-spec-kit skill | Comprehensive scratch guidance in SKILL.md (lines 324-379), but no hooks enforce it |
| Agent 3 | spec_kit commands | ZERO scratch references in any of 13 command files |
| Agent 4 | .opencode config | scratch/ auto-created by create-spec-folder.sh, gitignore configured |
| Agent 5 | Hooks analysis | NO hook blocks root writes; "D) Skip" bypasses ALL validation |
| Agent 6 | Scratch patterns | .gitignore properly configured; root folder is clean |
| Agent 7 | Template content | Only plan.md mentions scratch (buried in folder diagram) |
| Agent 8 | Root audit | Root is CLEAN - only 1 file needs review (agents_universal_framework.md) |

### 3.2 Current Documentation Status

**Well-Documented (EXISTS):**
- AGENTS.md lines 385-408: "Scratch vs Memory" table and decision flow
- workflows-spec-kit/SKILL.md lines 324-379: Dedicated scratch section
- .opencode/speckit/README.md lines 178-216: Special folders section
- plan.md template lines 83-88: Folder structure with scratch tip

**Not Documented (GAPS):**
- spec.md template: NO scratch guidance
- tasks.md template: NO scratch guidance
- research.md template: NO scratch guidance
- checklist.md template: NO cleanup verification item
- All spec_kit commands: ZERO scratch references

### 3.3 Enforcement Mechanism Status

| Mechanism | Status | Details |
|-----------|--------|---------|
| Hooks blocking root writes | ❌ MISSING | No PreToolUse hook validates file placement |
| Scratch folder enforcement | ❌ MISSING | No hook redirects temp files to scratch/ |
| "D) Skip" protection | ❌ VULNERABILITY | Creates `.spec-skip` marker bypassing ALL validation |
| Task scope validation | ⚠️ PARTIAL | Allows all writes when scope undefined |
| Template guidance | ⚠️ PARTIAL | Only plan.md mentions scratch/ |
| Checklist verification | ❌ MISSING | No item for scratch cleanup |

---

## 4. GAP ANALYSIS MATRIX

| Component | Has Scratch Docs? | Has Enforcement? | Priority to Fix |
|-----------|-------------------|------------------|-----------------|
| AGENTS.md | ✅ Lines 385-408 | ❌ No hooks | P2 (add enforcement ref) |
| workflows-spec-kit SKILL.md | ✅ Lines 324-379 | ❌ No rules | P2 (add RULES section) |
| spec_kit commands | ❌ None | ❌ None | **P1 (critical gap)** |
| Templates (spec.md) | ❌ None | ❌ None | **P1 (critical gap)** |
| Templates (tasks.md) | ❌ None | ❌ None | **P1 (critical gap)** |
| Templates (checklist.md) | ❌ None | ❌ None | **P1 (add cleanup item)** |
| PreToolUse hooks | N/A | ❌ None | **P0 (enforcement)** |
| .gitignore | ✅ Configured | ✅ Working | ✅ Complete |
| create-spec-folder.sh | ✅ Creates scratch/ | ✅ Working | ✅ Complete |

---

## 5. ROOT FOLDER AUDIT RESULTS

### Current State: CLEAN

| Category | Count | Status |
|----------|-------|--------|
| Test scripts in root | 0 | ✅ Clean |
| Temp/debug files | 0 | ✅ Clean |
| Prototype files | 0 | ✅ Clean |
| Legitimate config files | 12 | ✅ Appropriate |
| Files to review | 1 | ⚠️ agents_universal_framework.md |

### Legitimate Root Files
- package.json, package-lock.json (Node.js)
- .gitignore, .mcp.json, .utcp_config.json (configs)
- AGENTS.md, opencode.json (AI agent configs)
- .yamllint, .spec-active (project configs)

### Review Needed
- `agents_universal_framework.md` - Appears to be portable version of AGENTS.md; clarify if intentional or consolidate

---

## 6. OPENCODE COMPATIBILITY

### The Challenge

OpenCode does NOT support hooks. This means:
- No automated PreToolUse validation
- No automated PostToolUse warnings  
- No blocking mechanisms via hook system

### Solution: Documentation-Based Self-Enforcement

Since hooks cannot enforce rules in OpenCode, enforcement must come from:

1. **AGENTS.md MUST/NEVER Rules** - AI agents read and follow these rules directly
2. **Template Guidance** - Explicit instructions in templates that agents follow
3. **Checklist Verification** - P1 items that agents verify before claiming completion
4. **Failure Pattern Recognition** - Anti-patterns documented so agents self-correct

### Enforcement Model

| Mechanism | Status | Approach |
|-----------|--------|----------|
| Spec folder gates | ⚠️ Manual | Document as MUST rule |
| Scratch enforcement | ✅ Documentation | Documentation-based |
| Checklist verification | ✅ Manual | Agent reads checklist |
| Template guidance | ✅ Works | Primary enforcement method |

### Documentation Pattern

When documenting features, use this pattern:

```markdown
> **Note:** Verify manually before completion.
```

---

## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: All spec_kit commands include scratch folder guidance
- **SC-002**: Templates (spec.md, tasks.md, research.md) include file organization section
- **SC-003**: checklist.md includes cleanup verification items (P1 priority)
- **SC-004**: Documentation updates complete for all identified gaps
- **SC-005**: AGENTS.md includes MUST/NEVER rules (documentation-based enforcement)
- **SC-006**: All templates include verification notes where applicable

### Future Enhancement Criteria

- **SC-007**: Hook-based blocking for temp file creation (if hook support added)
- **SC-008**: Automated suggestion of scratch/ for temp patterns

---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Template files editable | Internal | ✅ Green | Cannot add guidance |
| Command files editable | Internal | ✅ Green | Cannot add guidance |
| Hook system functional | Internal | ✅ Green | Cannot add enforcement |

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Documentation not followed | Medium | Medium | Add enforcement hooks in future phase |
| "D) Skip" continues bypass | High | High | Consider removing skip option or adding warning |
| Template changes not propagated | Medium | Low | Update all templates simultaneously |

---

## 9. RECOMMENDED CHANGES

### P0 - Critical (AGENTS.md Foundation - Hook-Independent)

1. **Add scratch enforcement to AGENTS.md Critical Rules (Section 1)**
   - This is the PRIMARY enforcement mechanism for OpenCode
   - Rules in Section 1 are read by ALL agents regardless of hook support
   - Must be explicit MUST/NEVER format that agents will follow

### P1 - High Priority (Documentation-Based Enforcement - Works in OpenCode)

2. **Update AGENTS.md Section 1 (Critical Rules)** - Add MUST/NEVER rules:
   - `MUST use specs/[###-name]/scratch/ for all temporary files`
   - `NEVER create test scripts, debug files, or prototypes in project root`
   - `NEVER place disposable content in spec folder root`
   
3. **Update AGENTS.md Failure Patterns Table** - Add pattern #15:
   - Pattern: "Root Folder Pollution"
   - Trigger: Creating temp files outside scratch/
   - Response: Move to scratch/, verify before completion

4. **Update `spec.md` template** - Add file organization section with OpenCode note
5. **Update `tasks.md` template** - Add working files guidance with OpenCode note
6. **Update `research.md` template** - Add file organization section
7. **Update `checklist.md` template** - Add scratch cleanup items (PRIMARY ENFORCEMENT):
   - `CHK036 [P1] All temporary files in scratch/ (not spec root or project root)`
   - `CHK037 [P1] scratch/ cleaned up before completion`
   - `CHK038 [P2] Valuable scratch findings moved to memory/`

8. **Update spec_kit commands** - Add scratch guidance to implementation steps

### P2 - Medium Priority (Enhancement)

9. **Update workflows-spec-kit SKILL.md** - Add RULES section for scratch usage
10. **Add verification notes** - Where needed, add manual verification guidance

---

## 10. APPENDIX

### Verbatim Source: AGENTS.md Scratch Rules (Lines 385-408)

```markdown
### Scratch vs Memory: When to Use Each

| Write to...     | When...                                          | Examples                                                               |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| **scratch/**    | Content is temporary, exploratory, or disposable | Draft snippets, debug logs, test queries, prototypes, comparison files |
| **memory/**     | Content preserves context for future sessions    | Decisions made, approaches tried, blockers found, session summaries    |
| **spec folder** | Content is permanent documentation               | spec.md, plan.md, tasks.md, final implementation                       |

**Decision Flow:**
Is this content disposable after the task?
  YES → scratch/
  NO  → Will future sessions need this context?
          YES → memory/
          NO  → spec folder (spec.md, plan.md, etc.)

**scratch/ Best Practices:**
- Use for code snippets you're testing before committing
- Store temporary investigation notes (delete when resolved)
- Keep debug output/logs during troubleshooting
- Draft content before moving to final location
- **Clean up**: Delete scratch/ contents when task completes
```

### Verbatim Source: plan.md Template (Lines 83-88)

```markdown
scratch/             # Drafts, prototypes, debug logs (git-ignored, delete when done)
> **Tip:** Use `scratch/` for throwaway work (test queries, debug output, draft code).
> Move valuable findings to spec.md, plan.md, or memory/ before completing the task.
```

---

## 11. CHANGELOG

### v1.0 (2025-12-13)
**Initial specification**
- Comprehensive analysis of SpecKit scratch folder system
- 8 parallel agent analysis synthesized
- Gap analysis matrix created
- Recommendations prioritized (P0/P1/P2)
