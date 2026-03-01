---
title: "Decision: Level-Based Template Architecture Alignment - Architecture [071-speckit-level-alignment/decision-record]"
description: "Architecture Decision Record documenting the approach for aligning SpecKit scripts and documentation with level-based template folders."
trigger_phrases:
  - "decision"
  - "level"
  - "based"
  - "template"
  - "architecture"
  - "decision record"
  - "071"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision: Level-Based Template Architecture Alignment - Architecture Decision Record

Architecture Decision Record documenting the approach for aligning SpecKit scripts and documentation with level-based template folders.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

## 1. METADATA

- **Decision ID**: ADR-071
- **Status**: Accepted
- **Date**: 2026-01-16
- **Deciders**: Development team
- **Related Feature**: [spec.md](./spec.md), [Spec 069](../069-speckit-template-complexity/)
- **Supersedes**: N/A
- **Superseded By**: N/A

---

## 2. CONTEXT

### Problem Statement

Spec 069 created a level-based template architecture with dedicated folders (`level_1/`, `level_2/`, `level_3/`, `level_3+/`) containing pre-expanded templates. However, the SpecKit scripts (`create-spec-folder.sh`, `expand-template.js`) and documentation still referenced the old flat template structure with COMPLEXITY_GATE markers. This created an inconsistent system where the new architecture existed but was not being used.

### Current Situation

- Level folders exist and contain appropriate templates (4/5/6/6 files respectively)
- Scripts copy templates from root `templates/` directory instead of level folders
- Documentation contains copy commands referencing flat paths like `templates/spec.md`
- `level_2/checklist.md` still contains 6 COMPLEXITY_GATE markers that should have been pre-expanded
- 171 existing tests pass and must continue to pass

### Constraints

- Backward compatibility: Root templates must remain functional as fallback
- Test suite stability: All 171 existing tests must continue to pass
- Minimal disruption: Changes should not break existing workflows
- Documentation consistency: All references must be updated simultaneously

### Assumptions

- Level folders will remain the primary template source going forward
- Existing spec folders do not need automatic migration
- The marker-parser.js may still be used by some dynamic expansion workflows
- Users will transition to level-based commands over time

---

## 3. DECISION

### Summary

Align all SpecKit scripts and documentation with level-based template folders while maintaining backward compatibility through root template fallback.

### Detailed Description

The alignment approach modifies scripts to:
1. Add a `get_level_templates_dir()` function that maps level numbers to folder paths
2. Use level-specific folders as the primary template source
3. Fall back to root templates only when level folders are missing or unspecified
4. Remove COMPLEXITY_GATE markers from level folders (they should be pre-expanded)
5. Add deprecation notices to marker-related code without removing it

Documentation updates:
- Update 17+ copy commands across 10 documentation files
- Change paths from `templates/spec.md` to `templates/level_N/spec.md`
- Add notes about level folder architecture

### Technical Approach

```bash
# Shell script level folder selection
get_level_templates_dir() {
    local level="$1"
    local base_dir="$2"
    case "$level" in
        1|2|3) echo "$base_dir/level_$level" ;;
        "3+"|4) echo "$base_dir/level_3+" ;;
        *) echo "$base_dir/level_1" ;;  # Default fallback
    esac
}
```

```javascript
// JavaScript level folder selection
function getTemplatesDir(level = null) {
  const baseDir = path.join(__dirname, '..', 'templates');
  if (!level) return baseDir;  // Fallback to root

  const levelFolder = level === '3+' ? 'level_3+' : `level_${level}`;
  const levelDir = path.join(baseDir, levelFolder);
  return fs.existsSync(levelDir) ? levelDir : baseDir;
}
```

---

## 4. ALTERNATIVES CONSIDERED

### Option 1: [CHOSEN] Additive Alignment with Fallback

**Description**: Modify scripts to prefer level folders while keeping root templates as fallback. Deprecate marker-related code but do not remove.

**Pros**:
- Full backward compatibility
- Gradual migration path
- No breaking changes
- Preserves dynamic expansion option

**Cons**:
- Duplicate template content (root + level folders)
- Some code remains deprecated but present
- More complex resolution logic

**Score**: 9/10

**Why Chosen**: Best balance of new functionality and backward compatibility. Allows gradual transition without forcing immediate changes to existing workflows.

---

### Option 2: Full Replacement

**Description**: Remove root templates entirely, force all workflows to use level folders.

**Pros**:
- Cleaner architecture
- No duplicate templates
- Simpler resolution logic

**Cons**:
- Breaking change for existing workflows
- No fallback if level folders have issues
- Requires immediate migration of all users

**Score**: 5/10

**Why Rejected**: Too risky without a migration period. Breaking existing workflows would cause immediate disruption.

---

### Option 3: Symbolic Links

**Description**: Replace root templates with symbolic links to level_2 (default level) templates.

**Pros**:
- Single source of truth
- Root path still works
- No duplicate content

**Cons**:
- Platform-dependent (symlinks work differently on Windows)
- Unexpected behavior if default level changes
- Complex version control handling

**Score**: 6/10

**Why Rejected**: Cross-platform compatibility concerns and potential for unexpected behavior.

---

### Comparison Matrix

| Criterion | Weight | Option 1: Additive | Option 2: Full Replace | Option 3: Symlinks |
|-----------|--------|-------------------|------------------------|-------------------|
| Backward Compatibility | 10/10 | 10/10 | 3/10 | 7/10 |
| Simplicity | 8/10 | 7/10 | 9/10 | 5/10 |
| Cross-Platform | 7/10 | 10/10 | 10/10 | 4/10 |
| Maintainability | 6/10 | 7/10 | 9/10 | 6/10 |
| Migration Risk | 9/10 | 9/10 | 4/10 | 7/10 |
| **Weighted Score** | - | **8.6/10** | 6.6/10 | 5.7/10 |

---

## 5. CONSEQUENCES

### Positive Consequences

- Scripts now use level-appropriate templates automatically
- Documentation accurately reflects current architecture
- Clear deprecation path for marker-based system
- No breaking changes to existing workflows
- Test suite continues to pass (171/171)

### Negative Consequences

- Duplicate template content exists (root + level folders) - mitigated by documenting level folders as primary
- marker-parser.js remains in codebase (deprecated) - mitigated by deprecation notice
- Some documentation may reference old paths until discovered - mitigated by systematic grep-based updates

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Missed documentation references | Low | Medium | Grep verification before completion |
| Test regression | High | Low | Run full test suite after each phase |
| User confusion (two systems) | Medium | Low | Clear deprecation notices |

### Technical Debt Introduced

- Deprecated marker-parser.js should be removed after 6-month deprecation period
- Root templates should be evaluated for removal in future release

---

## 6. IMPLEMENTATION NOTES

> **Parallel Work:** Tasks organized by phase, with some parallelization possible within phases:

- Phase 1: Scripts (P0 - must complete first)
  - [P] TASK-001: create-spec-folder.sh
  - [P] TASK-002: expand-template.js
- Phase 2: Lib Modules (P1 - after scripts)
  - [P] TASK-003-006: Can parallelize within phase
- Phase 3: Documentation (P1-P2 - after lib modules)
  - [P] All 10 doc files can be updated in parallel
- Phase 4: Templates (P1 - can parallel with Phase 3)
  - TASK-017: level_2/checklist.md cleanup

---

## 7. IMPACT ASSESSMENT

### Systems Affected

- `create-spec-folder.sh` - Template copying logic
- `expand-template.js` - Template resolution
- `preprocessor.js` - Folder selection
- 10 documentation files - Path references

### Teams Impacted

- SpecKit users - Updated copy commands in documentation
- AI assistants - Updated paths for template references

### Rollback Strategy

If issues discovered after implementation:
1. Revert script changes (level folder logic reverts to root templates)
2. Documentation references still work with root templates
3. No data migration required - spec folders unaffected

---

## 8. TIMELINE

- **Decision Made**: 2026-01-16
- **Implementation Start**: 2026-01-16
- **Target Completion**: 2026-01-16
- **Review Date**: N/A (implementation same-day)

---

## 9. REFERENCES

### Related Documents

- **Feature Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Related Spec**: [069-speckit-template-complexity](../069-speckit-template-complexity/)

### External References

- SpecKit level system documentation in SKILL.md
- Template architecture in references/templates/

---

## 10. APPROVAL & SIGN-OFF

### Approvers

| Name | Role | Approved | Date | Comments |
|------|------|----------|------|----------|
| Development Team | Implementation | Yes | 2026-01-16 | Approved via task completion |

### Status Changes

| Date | Previous Status | New Status | Reason |
|------|----------------|------------|--------|
| 2026-01-16 | - | Proposed | Initial proposal with spec creation |
| 2026-01-16 | Proposed | Accepted | Implementation completed successfully |

---

## 11. UPDATES & AMENDMENTS

### Amendment History

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| 2026-01-16 | Initial ADR created | Document alignment decision post-implementation | Claude |

---

*ADR-071: Level-Based Template Architecture Alignment*
