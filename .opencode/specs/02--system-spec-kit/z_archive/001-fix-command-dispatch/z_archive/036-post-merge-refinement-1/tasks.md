---
title: "Task Breakdown [036-post-merge-refinement-1/tasks]"
description: "id: 036-post-merge-refinement"
trigger_phrases:
  - "task"
  - "breakdown"
  - "tasks"
  - "036"
  - "post"
importance_tier: "normal"
contextType: "implementation"
id: 036-post-merge-refinement
---
# Tasks

## Epic: Post-Merger System Refinement

### P0 - Critical (Must Fix First)

- [ ] **TASK-001**: Create validate-spec.sh script
  - Implement documented behavior from SKILL.md:537-636
  - Exit codes: 0=pass, 1=warning, 2=error
  - Support 7 validation rules
  - Test with existing spec folders
  
- [ ] **TASK-002**: Fix MCP tool naming in SKILL.md
  - Update lines 107-112 to full prefix
  - Update tool table at lines 389-397
  - Add clarifying note about naming convention

- [ ] **TASK-003**: Resolve recommend-level.sh reference
  - Decision: Create script OR remove reference
  - If create: Implement LOC analysis and level recommendation
  - If remove: Update SKILL.md:172

### P1 - High Priority

- [ ] **TASK-004**: Fix placeholder validation regex
  - Update check-placeholders.sh
  - Add Mustache pattern detection

- [ ] **TASK-005**: Consolidate lib directories
  - Audit scripts/lib/ vs mcp_server/lib/
  - Choose canonical location
  - Update all imports
  - Remove duplicates

- [ ] **TASK-006**: Create missing YAML assets
  - Verify spec_kit_plan_auto.yaml exists
  - Verify spec_kit_plan_confirm.yaml exists
  - Create if missing or fix references

- [ ] **TASK-007**: Add constitutional tier to context template
  - Update context_template.md sections
  - Ensure 6-tier consistency

- [ ] **TASK-008**: Fix memory_load phantom reference
  - Update resume.md:407-409
  - Use correct MCP tool name

### P2 - Medium Priority

- [ ] **TASK-009**: Standardize command path separators
- [ ] **TASK-010**: Fix template count in SKILL.md
- [ ] **TASK-011**: Update 035 spec status to Complete
- [ ] **TASK-012**: Document undocumented MCP parameters

### P3 - Low Priority (Future)

- [ ] **TASK-013**: Add cross-command workflow guide
- [ ] **TASK-014**: Clarify step counting in complete.md
- [ ] **TASK-015**: Add command aliases
- [ ] **TASK-016**: Add automated test suite
- [ ] **TASK-017**: Refactor generate-context.js complexity

## Progress Tracking

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| P0 | 3 | 0 | 3 |
| P1 | 5 | 0 | 5 |
| P2 | 4 | 0 | 4 |
| P3 | 5 | 0 | 5 |
| **Total** | **17** | **0** | **17** |
