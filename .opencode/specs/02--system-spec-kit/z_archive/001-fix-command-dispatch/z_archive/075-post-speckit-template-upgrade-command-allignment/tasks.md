---
title: "Tasks: Post-SpecKit Template Upgrade - Command Alignment [075-post-speckit-template-upgrade-command-allignment/tasks]"
description: "Agent: Agent 1 (Opus)"
trigger_phrases:
  - "tasks"
  - "post"
  - "speckit"
  - "template"
  - "upgrade"
  - "075"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Post-SpecKit Template Upgrade - Command Alignment

## Phase Overview

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Research & Analysis | COMPLETE |
| Phase 1 | Section Structure Standardization | PENDING |
| Phase 2 | Mandatory Gate Fixes | PENDING |
| Phase 3 | Frontmatter Corrections | PENDING |
| Phase 4 | Spec_Kit Command Enhancements | PENDING |
| Phase 5 | Cross-Reference & Validation | PENDING |

---

## Phase 0: Research & Analysis [COMPLETE]

- [x] Task 0.1: Analyze Spec 072 findings
- [x] Task 0.2: Analyze Spec 073 optimization changes
- [x] Task 0.3: Analyze Spec 074 refinements
- [x] Task 0.4: Analyze Spec 075 test results
- [x] Task 0.5: Analyze system-spec-kit SKILL.md
- [x] Task 0.6: Analyze system-spec-kit references
- [x] Task 0.7: Analyze spec_kit commands
- [x] Task 0.8: Analyze memory commands
- [x] Task 0.9: Analyze search/create commands
- [x] Task 0.10: Complete compliance audit

---

## Phase 1: Section Structure Standardization [PENDING]

### Task 1.1: Update spec_kit namespace (7 commands)
**Agent**: Agent 1 (Opus)
**Commands**: complete.md, debug.md, handover.md, implement.md, plan.md, research.md, resume.md

Changes per command:
- [ ] Replace `🔜 WHAT NEXT?` with standardized emoji/name
- [ ] Remove parenthetical text from section headers
- [ ] Verify section numbering is sequential

### Task 1.2: Update memory namespace (4 commands)
**Agent**: Agent 2 (Opus)
**Commands**: checkpoint.md, database.md, save.md, search.md

Changes per command:
- [ ] Replace `🔜 WHAT NEXT?` with standardized emoji/name
- [ ] Remove parenthetical text from section headers
- [ ] Verify section numbering is sequential

### Task 1.3: Update create namespace (6 commands)
**Agent**: Agent 3 (Opus)
**Commands**: folder_readme.md, install_guide.md, skill.md, skill_asset.md, skill_reference.md, agent.md

Changes per command:
- [ ] Replace `🔜 WHAT NEXT?` with standardized emoji/name
- [ ] Remove parenthetical text from section headers
- [ ] Verify section numbering is sequential

### Task 1.4: Update search namespace (2 commands)
**Agent**: Agent 4 (Opus)
**Commands**: code.md, index.md

Changes per command:
- [ ] Replace `🔜 WHAT NEXT?` with standardized emoji/name
- [ ] Remove parenthetical text from section headers
- [ ] Verify section numbering is sequential

---

## Phase 2: Mandatory Gate Fixes [PENDING]

### Task 2.1: Add mandatory gate to /memory:search
**Agent**: Agent 2 (Opus)
**File**: .opencode/command/memory/search.md

Changes:
- [ ] Add multi-phase blocking gate after frontmatter
- [ ] Phase 1: INPUT COLLECTION for `<id>` and `<spec-folder>` args
- [ ] Phase 2: VALIDATION
- [ ] Add VIOLATION SELF-DETECTION section

---

## Phase 3: Frontmatter Corrections [PENDING]

### Task 3.1: Fix /create:skill argument-hint
**Agent**: Agent 3 (Opus)
**File**: .opencode/command/create/skill.md

Changes:
- [ ] Change `skill-name` to `<skill-name>` in argument-hint

### Task 3.2: Fix /create:agent argument-hint
**Agent**: Agent 3 (Opus)
**File**: .opencode/command/create/agent.md

Changes:
- [ ] Change `agent-name` to `<agent-name>` in argument-hint

---

## Phase 4: Spec_Kit Command Enhancements [PENDING]

### Task 4.1: Add OUTPUT FORMATS section (4 commands)
**Agent**: Agent 1 (Opus)
**Commands**: complete.md, implement.md, plan.md, research.md

Changes per command:
- [ ] Add `## N. 📊 OUTPUT FORMATS` section with example outputs

### Task 4.2: Add GATE 3 COMPLIANCE section (where missing)
**Agent**: Agent 1 (Opus)
**Commands**: complete.md, plan.md, research.md, handover.md, resume.md

Changes:
- [ ] Add explicit `## ⛔ GATE 3 COMPLIANCE` section if not present

### Task 4.3: Add RELATED COMMANDS section (where missing)
**Agent**: Agent 1 (Opus)
**Commands**: complete.md, implement.md, plan.md, research.md

Changes per command:
- [ ] Add `## N. 🔗 RELATED COMMANDS` section

---

## Phase 5: Cross-Reference & Validation [PENDING]

### Task 5.1: Fix cross-reference error in /memory:database
**Agent**: Agent 5 (Opus)
**File**: .opencode/command/memory/database.md

Changes:
- [ ] Line 393: Change `/memory:database restore` to `/memory:checkpoint restore pre-cleanup-...`

### Task 5.2: Final compliance validation
**Agent**: Agent 5 (Opus)

Validation:
- [ ] Verify all 19 commands pass section structure check
- [ ] Verify all mandatory gates are present
- [ ] Verify all frontmatter is compliant
- [ ] Verify no cross-reference errors
- [ ] Run manual spot-check on 5 random commands

---

## Summary Statistics

| Category | Total Tasks | Completed | Remaining |
|----------|-------------|-----------|-----------|
| Phase 0 | 10 | 10 | 0 |
| Phase 1 | 4 | 0 | 4 |
| Phase 2 | 1 | 0 | 1 |
| Phase 3 | 2 | 0 | 2 |
| Phase 4 | 3 | 0 | 3 |
| Phase 5 | 2 | 0 | 2 |
| **Total** | **22** | **10** | **12** |
