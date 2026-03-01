---
title: "Debug Delegation Implementation Plan [002-debugger/plan]"
description: "plan document for 002-debugger."
trigger_phrases:
  - "debug"
  - "delegation"
  - "implementation"
  - "plan"
  - "002"
  - "debugger"
importance_tier: "important"
contextType: "decision"
---
# Debug Delegation Implementation Plan

## Phase 1: Command Creation
- Create `.opencode/command/spec_kit/debug.md`
- 5-phase workflow: Context → Model Selection → Report → Dispatch → Integration
- Model options: Sonnet, Opus, o1/o3, Other

## Phase 2: SKILL.md Updates
- Add Section: "Debug Delegation Workflow"
- Expand trigger keywords for auto-suggestion
- Update command table (add /spec_kit:debug)
- Add routing logic for debug escalation

## Phase 3: Supporting Documentation
- README.md: Add command, update counts (7 commands)
- implementation-phase.md: Add debug checkpoint
- template_guide.md: Expand debug-delegation.md section

## Phase 4: AGENTS.md Updates
- Both AGENTS.md files: Add to SpecKit Commands table
- Add debug delegation to tool routing guidance

## Phase 5: Verification
- Test command execution
- Test auto-suggestion triggers
- Verify sub-agent dispatch works
- Confirm documentation consistency
