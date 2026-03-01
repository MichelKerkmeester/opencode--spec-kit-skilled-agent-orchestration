---
title: "Debug Delegation Integration [002-debugger/spec]"
description: "The debug-delegation.md template exists in SpecKit but is underutilized. There's no active workflow that triggers its use, and debugging tasks are handled ad-hoc without structu..."
trigger_phrases:
  - "debug"
  - "delegation"
  - "integration"
  - "spec"
  - "002"
  - "debugger"
importance_tier: "important"
contextType: "decision"
---
# Debug Delegation Integration

## Problem Statement
The `debug-delegation.md` template exists in SpecKit but is underutilized. There's no active workflow that triggers its use, and debugging tasks are handled ad-hoc without structured context handoff to sub-agents.

## Solution
Create a `/spec_kit:debug` command and auto-detection system that:
1. **Always uses parallel sub-agent** for debugging via Task tool
2. **Always asks user which AI model** to use (mandatory selection)
3. **Generates structured debug report** using debug-delegation.md template
4. **Auto-suggests** when detecting repeated failures or frustration keywords

## Success Criteria
- [x] `/spec_kit:debug` command created and functional (591 lines)
- [x] Model selection is mandatory (Sonnet/Opus/o1/Other) - Phase 2 HARD STOP
- [x] Auto-suggestion triggers after 3+ failed fix attempts (debug_triggers in SKILL.md)
- [x] Auto-suggestion triggers on frustration keywords (expanded list)
- [x] debug-delegation.md saved to spec folder root (Step 2)
- [x] Sub-agent receives full context and returns structured findings (Step 3-4)
- [x] All documentation updated (SKILL.md, README.md, AGENTS.md, etc.)

## Scope
**In Scope:**
- New /spec_kit:debug command
- SKILL.md debug workflow section
- Auto-detection logic
- Documentation updates

**Out of Scope:**
- Changes to Task tool itself
- New model integrations
- UI/visual changes
