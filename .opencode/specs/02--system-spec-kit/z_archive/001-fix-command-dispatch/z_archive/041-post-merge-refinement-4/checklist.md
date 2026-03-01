---
title: "Checklist: Post-Merge Refinement 4 [041-post-merge-refinement-4/checklist]"
description: "Approved By: _______________"
trigger_phrases:
  - "checklist"
  - "post"
  - "merge"
  - "refinement"
  - "041"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist.md | v1.0 -->

# Checklist: Post-Merge Refinement 4

## Overview

| Phase | Items | Status |
|-------|-------|--------|
| Pre-Implementation | 8 | ⬜ |
| Phase 1 (P0) | 11 | ⬜ |
| Phase 2 (P1) | 12 | ⬜ |
| Phase 3 (P2) | 7 | ⬜ |
| Phase 4 (Validation) | 10 | ⬜ |
| **Total** | **48** | ⬜ |

---

## Pre-Implementation Checks

### Environment Verification
- [ ] **PRE-001**: OpenCode is running and responsive
- [ ] **PRE-002**: MCP server (context-server.js) is connected
- [ ] **PRE-003**: Database (context-index.sqlite) is accessible
- [ ] **PRE-004**: All spec folders 035-040 are complete

### Backup Verification
- [ ] **PRE-005**: Database backup created
- [ ] **PRE-006**: AGENTS.md backup created
- [ ] **PRE-007**: SKILL.md backup created
- [ ] **PRE-008**: Git branch created for changes

---

## Phase 1: Critical Fixes (P0)

### Agent Files
- [ ] **P0-001**: AGENTS.md agent list matches .opencode/agents/
  - Evidence: `ls .opencode/agents/` output matches AGENTS.md:877-884
  - Verified by: _______________

### Template Count
- [ ] **P0-002**: SKILL.md template count is accurate
  - Evidence: `ls templates/*.md | wc -l` matches SKILL.md:133
  - Verified by: _______________

### Missing Scripts
- [ ] **P0-003**: validate-spec.sh exists and works
  - Evidence: `bash scripts/validate-spec.sh specs/041-*` returns 0
  - Verified by: _______________
- [ ] **P0-004**: recommend-level.sh exists and works
  - Evidence: `bash scripts/recommend-level.sh specs/041-*` outputs level
  - Verified by: _______________

### Code Fixes
- [ ] **P0-005**: Empty query bug fixed
  - Evidence: `memory_search({ query: "" })` returns error
  - Verified by: _______________
- [ ] **P0-006**: Simulation mode has warning
  - Evidence: Generated file contains warning prefix
  - Verified by: _______________
- [ ] **P0-007**: Non-TTY mode doesn't crash
  - Evidence: `echo "" | node generate-context.js` doesn't throw
  - Verified by: _______________

### Template Consolidation
- [ ] **P0-008**: Single context template exists
  - Evidence: Only context_template.md exists (no memory/context.md)
  - Verified by: _______________
- [ ] **P0-009**: Constitutional tier documented
  - Evidence: All 6 tiers listed in template
  - Verified by: _______________

### Safety Features
- [ ] **P0-010**: Anchor validation works
  - Evidence: Malformed anchor produces warning
  - Verified by: _______________
- [ ] **P0-011**: Cleanup creates checkpoint
  - Evidence: Checkpoint exists after cleanup
  - Verified by: _______________

### Phase 1 Gate
- [ ] **GATE-P1**: All P0 items verified (11/11)
- [ ] **GATE-P1**: MCP server restarts without errors
- [ ] **GATE-P1**: No regression in existing functionality

---

## Phase 2: High Priority Fixes (P1)

### Documentation Alignment
- [ ] **P1-DOC-001**: Step count consistent (13 or 14)
  - Evidence: complete.md and YAML files match
  - Verified by: _______________
- [ ] **P1-DOC-002**: Version numbers all v16.0.0
  - Evidence: `grep -r "v12.5.0" .opencode/` returns nothing
  - Verified by: _______________
- [ ] **P1-DOC-003**: Progressive model includes implementation-summary.md
  - Evidence: template_guide.md, quick_reference.md, README.md updated
  - Verified by: _______________
- [ ] **P1-DOC-004**: Tool naming documented clearly
  - Evidence: Full names and aliases documented
  - Verified by: _______________
- [ ] **P1-DOC-005**: skills_system_memory references removed
  - Evidence: `grep -r "skills_system_memory" AGENTS.md` returns nothing
  - Verified by: _______________
- [ ] **P1-DOC-006**: memory_load references removed
  - Evidence: `grep -r "memory_load" .opencode/command/` returns nothing
  - Verified by: _______________

### Code Fixes
- [ ] **P1-CODE-001**: No duplicate step_5 in YAML
  - Evidence: `grep "step_5" spec_kit_plan_confirm.yaml` returns 1 result
  - Verified by: _______________
- [ ] **P1-CODE-002**: FTS5 operators escaped
  - Evidence: Search with "+" character works
  - Verified by: _______________
- [ ] **P1-CODE-003**: Embedding warmup handled
  - Evidence: Tool call during startup doesn't fail
  - Verified by: _______________
- [ ] **P1-CODE-004**: Constitutional caching implemented
  - Evidence: Second search faster than first
  - Verified by: _______________

### UX Improvements
- [ ] **P1-UX-001**: /memory:save:quick works
  - Evidence: Quick save completes in <3 steps
  - Verified by: _______________
- [ ] **P1-UX-002**: Inline help available
  - Evidence: /spec_kit:help shows summary
  - Verified by: _______________

### Phase 2 Gate
- [ ] **GATE-P2**: All P1 items verified (12/12)
- [ ] **GATE-P2**: All YAML files valid syntax
- [ ] **GATE-P2**: Documentation grep checks pass

---

## Phase 3: Medium Priority Fixes (P2)

### Templates
- [ ] **P2-001**: quick-fix.md template exists
  - Evidence: File exists in templates/
  - Verified by: _______________
- [ ] **P2-002**: Template decision tree in SKILL.md
  - Evidence: Flowchart or decision table present
  - Verified by: _______________

### Configuration
- [ ] **P2-003**: Batch size configurable
  - Evidence: BATCH_SIZE env var works
  - Verified by: _______________
- [ ] **P2-004**: Progress indicators visible
  - Evidence: Save shows step progress
  - Verified by: _______________

### Code Quality
- [ ] **P2-005**: Mustache conditionals simplified
  - Evidence: Section numbering readable
  - Verified by: _______________
- [ ] **P2-006**: .hashes file exists
  - Evidence: templates/.hashes contains all templates
  - Verified by: _______________
- [ ] **P2-007**: Lib directories consolidated
  - Evidence: No duplicate modules
  - Verified by: _______________

### Phase 3 Gate
- [ ] **GATE-P3**: All P2 items verified (7/7)
- [ ] **GATE-P3**: New template works correctly

---

## Phase 4: Final Validation

### Functional Testing
- [ ] **VAL-001**: All 13 MCP tools respond correctly
  - Evidence: Each tool tested with valid input
  - Verified by: _______________
- [ ] **VAL-002**: All 8 spec_kit commands work
  - Evidence: Each command tested
  - Verified by: _______________
- [ ] **VAL-003**: All 3 memory commands work
  - Evidence: save, search, checkpoint tested
  - Verified by: _______________

### Documentation Verification
- [ ] **VAL-004**: All template counts accurate
  - Evidence: Counts match actual files
  - Verified by: _______________
- [ ] **VAL-005**: All version numbers consistent
  - Evidence: No version mismatches
  - Verified by: _______________
- [ ] **VAL-006**: All paths correct
  - Evidence: No broken references
  - Verified by: _______________

### Regression Testing
- [ ] **VAL-007**: Existing memories still searchable
  - Evidence: Old memories appear in search
  - Verified by: _______________
- [ ] **VAL-008**: Existing spec folders still valid
  - Evidence: validate-spec.sh passes on old folders
  - Verified by: _______________

### Completion
- [ ] **VAL-009**: Analysis report updated
  - Evidence: Issues marked resolved
  - Verified by: _______________
- [ ] **VAL-010**: Completion summary created
  - Evidence: Summary document exists
  - Verified by: _______________

---

## Sign-Off

### Phase Completion

| Phase | Completed | Date | Verified By |
|-------|-----------|------|-------------|
| Pre-Implementation | ⬜ | | |
| Phase 1 (P0) | ⬜ | | |
| Phase 2 (P1) | ⬜ | | |
| Phase 3 (P2) | ⬜ | | |
| Phase 4 (Validation) | ⬜ | | |

### Final Approval

- [ ] All phases complete
- [ ] All gates passed
- [ ] No regressions detected
- [ ] Documentation accurate

**Approved By:** _______________
**Date:** _______________

---

## Rollback Plan

If critical issues discovered:

1. Restore database from backup
2. Revert AGENTS.md from backup
3. Revert SKILL.md from backup
4. Git reset to pre-change commit
5. Restart OpenCode

**Backup Location:** _______________
**Git Commit (pre-change):** _______________
