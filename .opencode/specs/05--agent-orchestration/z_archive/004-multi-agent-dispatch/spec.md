---
title: "Spec: Multi-Agent Dispatch for Research and Debug Commands [004-multi-agent-dispatch/spec]"
description: "Add user-selectable multi-agent dispatch to /spec_kit:research and /spec_kit:debug commands, allowing 1 Opus orchestrator + 2-3 Sonnet parallel workers."
trigger_phrases:
  - "spec"
  - "multi"
  - "agent"
  - "dispatch"
  - "for"
  - "004"
importance_tier: "important"
contextType: "decision"
---
# Spec: Multi-Agent Dispatch for Research and Debug Commands

<!-- ANCHOR:overview -->
## Overview

Add user-selectable multi-agent dispatch to `/spec_kit:research` and `/spec_kit:debug` commands, allowing 1 Opus orchestrator + 2-3 Sonnet parallel workers.

<!-- /ANCHOR:overview -->


<!-- ANCHOR:requirements -->
## Requirements

### Functional Requirements

1. **Dispatch Mode Selection**
   - Users can choose between:
     - A) Single Agent (default, current behavior)
     - B) Multi-Agent (1+2): 1 Opus orchestrator + 2 Sonnet workers
     - C) Multi-Agent (1+3): 1 Opus orchestrator + 3 Sonnet workers

2. **Research Command**
   - Add Phase 2.5: DISPATCH MODE SELECTION after Phase 2
   - Workers handle: Codebase exploration, External research, Technical analysis (Option C only)

3. **Debug Command**
   - Extend Phase 2 to include dispatch mode alongside model selection
   - Workers handle: Call path tracing, Pattern searching, Edge case hunting (Option C only)

4. **YAML Configuration**
   - Add `multi_agent_config` section to all 4 YAML files

5. **Agent Modes**
   - Coordinator mode: Receives worker outputs, validates, synthesizes
   - Worker mode: Focused domain, returns structured JSON, does not create final docs

### Non-Functional Requirements

- Fallback to single-agent mode if workers fail
- Worker timeout: 60 seconds
- Partial results preserved on failure

<!-- /ANCHOR:requirements -->


<!-- ANCHOR:scope -->
## Scope

### In Scope
- Command files: research.md, debug.md
- YAML configs: 4 files (research auto/confirm, debug auto/confirm)
- Agent files: research.md, debug.md

### Out of Scope
- Other spec_kit commands (complete, plan, implement, handover)
- Changes to Task tool itself
- New agent files (reusing existing agents)

<!-- /ANCHOR:scope -->


<!-- ANCHOR:success-criteria -->
## Success Criteria

- [ ] User can select A/B/C dispatch mode for research
- [ ] User can select A/B/C dispatch mode for debug
- [ ] Multi-agent mode spawns correct number of workers
- [ ] Orchestrator synthesizes worker outputs correctly
- [ ] Fallback to single-agent works when workers fail

<!-- /ANCHOR:success-criteria -->
