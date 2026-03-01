---
title: "Plan: SpecKit Skill Refinement (Conservative Approach) [003-speckit-skill-refinement/plan]"
description: "created: 2025-12-13"
trigger_phrases:
  - "plan"
  - "speckit"
  - "skill"
  - "refinement"
  - "conservative"
  - "003"
importance_tier: "important"
contextType: "decision"
approach: conservative
created: 2025-12-13
level: 2
status: active
---
# Plan: SpecKit Skill Refinement (Conservative Approach)

## 1. Philosophy

**Principle:** Improve without restructuring. Each file keeps its current purpose and structure. Changes focus on:
- Fixing inaccuracies
- Reducing obvious redundancy
- Adding clarity where needed
- Preserving all existing information

**What we will NOT do:**
- Move content between files
- Change file purposes
- Remove detailed explanations
- Convert prose to tables (unless clearly better)
- Create new cross-reference dependencies

---

## 2. Proposed Changes by File

### 2.1 SKILL.md (724 lines)

**Current issues:**
- Some outdated hook references
- Progressive enhancement diagram repeated (also in references)
- Version in frontmatter may be outdated

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| 4 | Update | `version: 1.1.0` (or similar) | `version: 1.2.0` | Reflect updates |
| ~50-60 | Clarify | Hook-based enforcement language | Documentation-assisted enforcement | Hooks may not exist in OpenCode |
| N/A | Keep | Progressive enhancement diagram | Keep as-is | Primary file, diagram belongs here |

**Estimated impact:** ~5-10 lines changed, 0 lines removed

---

### 2.2 level_specifications.md (421 lines)

**Current issues:**
- Progressive enhancement diagram duplicated from SKILL.md
- Minor: could add "CANONICAL" note since other files reference it

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| 1-5 | Add | No canonical marker | Add note: "Primary source for level requirements" | Clarifies this is the reference |
| 5-17 | Keep | Progressive enhancement diagram | Keep as-is | This IS the canonical source |

**Estimated impact:** ~3 lines added, 0 lines removed

---

### 2.3 template_guide.md (843 lines)

**Current issues:**
- Progressive enhancement diagram repeated (3rd time)
- Some sections very detailed (good for reference, keep)

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| 3-16 | Simplify | Full progressive enhancement diagram | Brief reference + link to level_specifications.md | Reduce redundancy, keep detail in canonical source |
| Rest | Keep | All detailed content | Keep as-is | Detailed guide should be detailed |

**Estimated impact:** ~10 lines changed, ~5 lines removed (net: -5)

---

### 2.4 automation_workflows.md (576 lines)

**Current issues:**
- Progressive enhancement diagram repeated (4th time)
- Some hook-based language that may be outdated
- Section 5 mentions hooks blocking commits

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| ~8-20 | Simplify | Full progressive enhancement diagram | Brief reference + link | 4th repetition unnecessary |
| ~370-400 | Clarify | "Hooks will block commits" | "Verify templates exist before commits" | Clarify enforcement is manual |
| ~520+ | Review | Hook-based language | Update if needed | Accuracy |

**Estimated impact:** ~15 lines changed, ~10 lines removed (net: -10)

---

### 2.5 quick_reference.md (514 lines)

**Current issues:**
- Progressive enhancement diagram repeated (5th time)
- Purpose is quick lookup - some sections could be more scannable

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| ~10-25 | Simplify | Full progressive enhancement diagram | One-line summary + link | Quick reference should be quick |
| ~65-75 | Keep | Command table | Keep as-is | Already good format |
| ~400+ | Keep | Troubleshooting | Keep as-is | Useful detail |

**Estimated impact:** ~10 lines changed, ~8 lines removed (net: -8)

---

### 2.6 path_scoped_rules.md (105 lines)

**Current issues:**
- Already has "NOT YET IMPLEMENTED" banner (good!)
- No changes needed

**Proposed changes:**

None - file is already well-structured with clear status.

**Estimated impact:** 0 lines changed

---

### 2.7 level_decision_matrix.md (174 lines)

**Current issues:**
- Progressive enhancement diagram repeated (6th time)
- Otherwise good decision support document

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| ~15-25 | Simplify | Full progressive enhancement diagram | Brief table + link | Focus on decision matrix |

**Estimated impact:** ~8 lines changed, ~5 lines removed (net: -5)

---

### 2.8 template_mapping.md (250 lines)

**Current issues:**
- Progressive enhancement diagram repeated (7th time)
- Copy commands are the core value - keep detailed

**Proposed changes:**

| Line(s) | Change Type | Current | Proposed | Rationale |
|---------|-------------|---------|----------|-----------|
| ~15-25 | Simplify | Full progressive enhancement diagram | Brief summary + link | Focus on copy commands |
| Rest | Keep | All copy commands and explanations | Keep as-is | Core purpose of file |

**Estimated impact:** ~8 lines changed, ~5 lines removed (net: -5)

---

## 3. Summary of Changes

### By Category

| Category | Files Affected | Lines Changed | Lines Removed |
|----------|----------------|---------------|---------------|
| Remove duplicate diagrams | 5 files | ~40 | ~33 |
| Clarify enforcement language | 2 files | ~10 | 0 |
| Add canonical markers | 1 file | ~3 | 0 |
| Version update | 1 file | ~1 | 0 |
| **TOTAL** | **7 files** | **~54** | **~33** |

### What Stays the Same

- All detailed explanations
- All examples and troubleshooting
- All copy commands
- All checklists
- File structure and organization
- Cross-references between files
- SKILL.md as primary orchestrator

### Net Impact

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total lines | ~3,607 | ~3,574 | -33 (~1%) |
| Files modified | 0 | 7 | - |
| Files restructured | 0 | 0 | - |

---

## 4. The One Redundancy to Address

The **progressive enhancement diagram** appears 7 times across files:

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research
```

**Proposed approach:**
- **Keep full diagram in:** SKILL.md (primary), level_specifications.md (canonical source)
- **Replace with brief reference in:** template_guide.md, automation_workflows.md, quick_reference.md, level_decision_matrix.md, template_mapping.md

**Replacement text:**
```markdown
> **Levels:** 1 (baseline) → 2 (+checklist) → 3 (+decision-record)
> See [level_specifications.md](references/level_specifications.md) for full requirements.
```

This preserves the information while reducing repetition from 7 instances to 2.

---

## 5. Accuracy Fixes

### Hook-based Language

Several files mention hooks enforcing or blocking:

| File | Current Language | Proposed Language |
|------|------------------|-------------------|
| automation_workflows.md | "hooks will block commits" | "verify templates exist before commits" |
| SKILL.md | "hook-based enforcement" | "documentation-assisted enforcement" |
| template_mapping.md | "Hooks will block commits if..." | "Verification required before commits if..." |

### Rationale
OpenCode environment may not have the same hook infrastructure. Language should reflect that enforcement is manual/documentation-based rather than automated hooks.

---

## 6. Implementation Order

1. **SKILL.md** - Update version, clarify enforcement language
2. **level_specifications.md** - Add canonical marker
3. **automation_workflows.md** - Fix hook language, simplify diagram
4. **template_guide.md** - Simplify diagram reference
5. **quick_reference.md** - Simplify diagram reference
6. **level_decision_matrix.md** - Simplify diagram reference
7. **template_mapping.md** - Simplify diagram, fix hook language

---

## 7. Verification Checklist

After changes, verify:

- [ ] All files still have complete information
- [ ] Cross-references work correctly
- [ ] No broken links
- [ ] Enforcement language is accurate
- [ ] Diagram appears in full in SKILL.md and level_specifications.md
- [ ] Other files have brief reference + link
- [ ] Total line reduction is minimal (~1%)

---

## 8. Rollback Plan

If issues discovered:
```bash
git checkout HEAD -- .opencode/skills/workflows-spec-kit/
```

All changes are cosmetic/clarifying - no structural changes that would complicate rollback.
