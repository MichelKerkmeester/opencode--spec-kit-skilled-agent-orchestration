---
title: "Plan: Post-SpecKit Template Upgrade - Command Alignment [075-post-speckit-template-upgrade-command-allignment/plan]"
description: "Multi-agent analysis (10 Opus agents) of specs 072-075 and current system-spec-kit state reveals 19 commands requiring alignment updates due to recent SpecKit v1.9.0 CORE + ADDE..."
trigger_phrases:
  - "plan"
  - "post"
  - "speckit"
  - "template"
  - "upgrade"
  - "075"
importance_tier: "important"
contextType: "decision"
---
# Plan: Post-SpecKit Template Upgrade - Command Alignment

## Executive Summary

Multi-agent analysis (10 Opus agents) of specs 072-075 and current system-spec-kit state reveals **19 commands** requiring alignment updates due to recent SpecKit v1.9.0 CORE + ADDENDUM v2.0 template architecture changes. The primary issue is **section structure standardization** across all commands.

---

## 1. Research Synthesis

### Specs 072-075 Key Changes

| Spec | Version | Key Changes | Command Impact |
|------|---------|-------------|----------------|
| **072** | 1.7.2 | Memory ranking fixes, deprecated complexity detection, barrel export namespacing | Memory scoring, constitutional tier handling |
| **073** | 1.8.0 | CORE + ADDENDUM v2.0 architecture, 64-79% template reduction, workstream notation | Template path references, level selection |
| **074** | 1.9.0 | Verbose templates, compose.sh script, SPECKIT_TEMPLATE_STYLE env var | Template selection, environment variables |
| **075** | 1.9.0 | 557 tests (97% pass), validation verified, 15 recommendations | Validation workflow integration |

### Current System State

- **Version**: 1.9.0
- **Template Architecture**: CORE + ADDENDUM v2.0 with verbose variants
- **MCP Tools**: 14 tools fully operational
- **Test Coverage**: 97% (540/557 tests passing)
- **Environment Variables**: SPECKIT_TEMPLATE_STYLE added (minimal/verbose)

---

## 2. Command Alignment Gaps Identified

### Critical (Fix Required)

| Issue | Affected Commands | Description |
|-------|-------------------|-------------|
| **Section Structure** | ALL 19 commands | Non-standard `🔜` emoji, extra text in headers |
| **Missing Mandatory Gate** | `/memory:search` | Has required `<id>` args but no gate |

### High Priority (Improvement)

| Issue | Affected Commands | Description |
|-------|-------------------|-------------|
| **Argument-hint Format** | `/create:skill`, `/create:agent` | Missing angle brackets for required args |
| **OUTPUT FORMATS Missing** | `/spec_kit:complete`, `/spec_kit:implement`, `/spec_kit:plan`, `/spec_kit:research` | No dedicated output format section |
| **Gate 3 Declaration** | Multiple spec_kit commands | No explicit Gate 3 compliance section |

### Medium Priority (Consistency)

| Issue | Affected Commands | Description |
|-------|-------------------|-------------|
| **RELATED COMMANDS** | spec_kit commands | Missing dedicated section |
| **Cross-reference Error** | `/memory:database` line 393 | References wrong command |

---

## 3. Implementation Plan

### Phase 1: Section Structure Standardization (All Commands)

**Objective**: Align all 19 commands with command_template.md Section 6 emoji vocabulary

**Changes**:
1. Replace `🔜 WHAT NEXT?` with `📌 NEXT STEPS` (or add 🔜 to approved vocabulary)
2. Remove parenthetical text from section headers
3. Standardize section ordering

**Commands**: All 19

### Phase 2: Mandatory Gate Fixes

**Objective**: Add missing mandatory gates where required arguments exist

**Commands**:
- `/memory:search` - Add multi-phase blocking gate for `<id>` and `<spec-folder>` args

### Phase 3: Frontmatter Corrections

**Objective**: Fix argument-hint format inconsistencies

**Commands**:
- `/create:skill` - Change `skill-name` to `<skill-name>`
- `/create:agent` - Change `agent-name` to `<agent-name>`

### Phase 4: Spec_Kit Command Enhancements

**Objective**: Add missing sections for consistency

**Changes**:
1. Add `OUTPUT FORMATS` section to complete, implement, plan, research
2. Add explicit `GATE 3 COMPLIANCE` section header where missing
3. Add `RELATED COMMANDS` sections

### Phase 5: Cross-Reference Fixes

**Objective**: Fix documentation errors

**Changes**:
- `/memory:database` line 393: Change `/memory:database restore` to `/memory:checkpoint restore`

---

## 4. Parallel Dispatch Strategy

### 5 Opus Agents for Updates

| Agent | Scope | Commands |
|-------|-------|----------|
| **Agent 1** | Section Structure - spec_kit | complete, debug, handover, implement, plan, research, resume |
| **Agent 2** | Section Structure - memory | checkpoint, database, save, search + gate fix |
| **Agent 3** | Section Structure - create | folder_readme, install_guide, skill, skill_asset, skill_reference, agent + frontmatter fixes |
| **Agent 4** | Section Structure - search | code, index |
| **Agent 5** | Cross-reference fixes + validation | All commands - final verification |

---

## 5. Success Criteria

| Criterion | Metric |
|-----------|--------|
| Section Structure Compliance | 19/19 commands pass |
| Mandatory Gate Compliance | All commands with `<required>` args have gates |
| Frontmatter Compliance | All argument-hints use proper format |
| Cross-reference Accuracy | 0 incorrect command references |
| Template Alignment | All commands follow command_template.md |

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing command behavior | Low | High | Structure changes only, no logic changes |
| Missing edge cases | Medium | Low | Comprehensive compliance audit completed |
| Inconsistent application | Low | Medium | Use 5 parallel agents with same instructions |

---

## 7. Deliverables

1. Updated 19 command files with standardized structure
2. This spec folder documentation (Level 3+)
3. Implementation summary with change log
4. Memory context for future reference
