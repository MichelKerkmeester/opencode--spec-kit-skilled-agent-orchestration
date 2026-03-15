---
title: "Spec: SpecKit Skill Refinement [003-speckit-skill-refinement/spec]"
description: "created: 2025-12-13"
trigger_phrases:
  - "spec"
  - "speckit"
  - "skill"
  - "refinement"
  - "003"
importance_tier: "important"
contextType: "decision"
complexity: medium
created: 2025-12-13
estimated_loc: 400
level: 2
status: active
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: SpecKit Skill Refinement

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

Comprehensively improve the `workflows-spec-kit` skill by reducing redundancy, improving structure, updating accuracy, enhancing clarity, and simplifying content while maintaining completeness.

**Scope:** SKILL.md and all references/ files (5 files) + assets/ files (2 files)
**Out of scope:** README.md, templates/, scripts/

<!-- /ANCHOR:metadata -->
## 2. PROBLEM STATEMENT

The current SpecKit skill documentation has several issues:

### 2.1 Heavy Redundancy
- The "progressive enhancement model" ASCII diagram appears 10+ times across files
- Level requirements (spec.md + plan.md + tasks.md, etc.) repeated in every document
- Template copy commands duplicated in multiple locations
- Same LOC thresholds stated repeatedly

### 2.2 Excessive Verbosity
- Total documentation: ~3,500+ lines across 8 files
- Much content is repetitive rather than additive
- Some sections could be tables instead of prose

### 2.3 Inconsistent Depth
- `path_scoped_rules.md` describes unimplemented features without clear status
- Some references are comprehensive, others thin
- Asset files duplicate reference content

### 2.4 Outdated/Inaccurate Content
- References to "hooks" that may not exist in OpenCode environment
- Mentions of `.spec-actives.json` (V10) vs `.spec-active.{SESSION_ID}` (V9) without clarity
- Some enforcement claims that are manual, not automatic

### 2.5 Structural Issues
- SKILL.md tries to be both reference AND quick-start
- No clear "start here" path for new users
- Asset files and reference files have significant overlap

## 3. SUCCESS CRITERIA

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Line count reduction | ≥30% | Total lines across all files |
| Redundancy elimination | Single source of truth | Each concept defined once, referenced elsewhere |
| Clarity improvement | Self-evident structure | Clear navigation, no circular references |
| Accuracy | 100% verified | All claims match actual behavior |
| Completeness | No information loss | All useful content preserved |

## 4. PROPOSED SOLUTION

### 4.1 Content Consolidation Strategy

**SKILL.md** → Primary orchestrator (load instructions, routing, rules)
- Keep: When to use, routing logic, rules (ALWAYS/NEVER/ESCALATE), success criteria
- Remove: Detailed explanations that belong in references
- Add: Clear pointers to reference files for deep dives

**References restructure:**
| File | New Focus | Content |
|------|-----------|---------|
| `level_specifications.md` | Single source for levels | All level details, requirements, migration |
| `template_guide.md` | Template usage only | Selection, adaptation, quality standards |
| `automation_workflows.md` | Workflow behavior | Enforcement, context save, agent protocol |
| `quick_reference.md` | Cheat sheet | Commands, checklists, troubleshooting |
| `path_scoped_rules.md` | Future/experimental | Mark clearly as NOT YET IMPLEMENTED |

**Assets restructure:**
| File | New Focus | Content |
|------|-----------|---------|
| `level_decision_matrix.md` | Decision support | Quick decision flowchart, edge cases |
| `template_mapping.md` | Copy commands only | Just the commands, no explanation |

### 4.2 Redundancy Elimination

Create canonical definitions:
1. **Progressive Enhancement Model** → Define ONCE in `level_specifications.md`, reference elsewhere
2. **LOC Thresholds** → Define ONCE in `level_decision_matrix.md`
3. **Template Requirements** → Define ONCE in `template_mapping.md`
4. **Copy Commands** → Define ONCE in `template_mapping.md`

Use cross-references:
```markdown
> **Level Requirements:** See [level_specifications.md](references/level_specifications.md#required-files)
```

### 4.3 Clarity Improvements

- Add "Purpose" header to each file
- Use tables instead of repeated prose
- Clear section numbering
- Consistent emoji usage
- Mark experimental features explicitly

## 5. FILES TO MODIFY

| File | Action | Estimated Change |
|------|--------|------------------|
| `.opencode/skills/workflows-spec-kit/SKILL.md` | Major refactor | -300 lines |
| `references/level_specifications.md` | Consolidate as canonical | -100 lines |
| `references/template_guide.md` | Remove duplicates | -200 lines |
| `references/automation_workflows.md` | Streamline | -150 lines |
| `references/quick_reference.md` | Convert to tables | -150 lines |
| `references/path_scoped_rules.md` | Add status banner | +10 lines |
| `assets/level_decision_matrix.md` | Simplify | -50 lines |
| `assets/template_mapping.md` | Commands only | -100 lines |

**Estimated total reduction:** ~1,000 lines (≈30%)

## 6. ️ RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Information loss | High | Review each deletion, preserve in scratch/ if uncertain |
| Breaking cross-references | Medium | Update all internal links after changes |
| Inconsistent state during refactor | Low | Complete all files before testing |

## 7. RELATED SPECS

- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive` - Previous SpecKit work
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive` - Memory system (referenced by SpecKit)
