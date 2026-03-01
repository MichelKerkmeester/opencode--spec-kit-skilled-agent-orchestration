---
title: "Checklist: Multi-Agent Dispatch Implementation [004-multi-agent-dispatch/checklist]"
description: "1. .opencode/command/spec_kit/research.md - Added Phase 3 (Dispatch Mode)"
trigger_phrases:
  - "checklist"
  - "multi"
  - "agent"
  - "dispatch"
  - "implementation"
  - "004"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Multi-Agent Dispatch Implementation

<!-- ANCHOR:must-complete -->
## P0 - Must Complete

### Command Updates
- [x] **P0** research.md has Phase 3 with A/B/C dispatch options
  - Evidence: `.opencode/command/spec_kit/research.md` contains "PHASE 3: DISPATCH MODE SELECTION"
- [x] **P0** debug.md Phase 2 extended with dispatch mode question
  - Evidence: `.opencode/command/spec_kit/debug.md` Phase 2 renamed to "MODEL + DISPATCH SELECTION"
- [x] **P0** Both commands store dispatch_mode variable
  - Evidence: Both files contain `dispatch_mode = [single/multi_small/multi_large]`

### YAML Configuration
- [x] **P0** All 4 YAML files have multi_agent_config section
  - Evidence: All files contain "MULTI-AGENT DISPATCH CONFIGURATION" section
- [x] **P0** Dispatch modes defined: single, multi_small, multi_large
  - Evidence: All YAML files define dispatch_modes with ids A, B, C
- [x] **P0** Worker configurations specified for each mode
  - Evidence: orchestrator and workers defined with model, role, responsibilities

### Agent Updates
- [x] **P0** research.md agent has Coordinator Mode section
  - Evidence: `.opencode/agent/research.md` contains "## 9. COORDINATOR MODE"
- [x] **P0** research.md agent has Worker Mode section
  - Evidence: `.opencode/agent/research.md` contains "## 10. WORKER MODE"
- [x] **P0** debug.md agent has Coordinator Mode section
  - Evidence: `.opencode/agent/debug.md` contains "## 4. COORDINATOR MODE"
- [x] **P0** debug.md agent has Worker Mode section
  - Evidence: `.opencode/agent/debug.md` contains "## 5. WORKER MODE"

<!-- /ANCHOR:must-complete -->


<!-- ANCHOR:should-complete -->
## P1 - Should Complete

### Integration
- [x] **P1** Coordinator mode receives and validates worker outputs
  - Evidence: Both agents have "Worker Output Validation" checklist
- [x] **P1** Worker mode returns structured JSON format
  - Evidence: Both agents define `worker_output_format` with JSON structure
- [x] **P1** Fallback to single-agent mode works correctly
  - Evidence: YAML configs define `fallback_behavior` section

### Documentation
- [x] **P1** Work division tables accurate in agents
  - Evidence: research.md has Worker Roles table, debug.md has Worker Roles table
- [x] **P1** Dispatch mode selection clearly documented
  - Evidence: Phase 3 (research) and Phase 2 (debug) have clear A/B/C options
- [x] **P1** User prompt format matches plan
  - Evidence: Both commands use required format from plan.md
- [x] **P1** Sequential numbering used (no half sections/phases)
  - Evidence: All phases and sections use 1, 2, 3, 4, etc.

<!-- /ANCHOR:should-complete -->


<!-- ANCHOR:nice-to-have -->
## P2 - Nice to Have

- [x] **P2** Worker timeout handling documented
  - Evidence: `worker_timeout_seconds: 60` in all YAML configs
- [x] **P2** Partial results preservation documented
  - Evidence: `on_worker_timeout: "Continue with available outputs"`
- [x] **P2** Examples added for each dispatch mode
  - Evidence: `worker_output_format.example` in all YAML configs

<!-- /ANCHOR:nice-to-have -->


<!-- ANCHOR:verification-summary -->
## Verification Summary

| Item | Status | File |
|------|--------|------|
| Phase 3 in research.md | ✅ | `.opencode/command/spec_kit/research.md` |
| Phase 2 extended in debug.md | ✅ | `.opencode/command/spec_kit/debug.md` |
| multi_agent_config in research_auto.yaml | ✅ | `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml` |
| multi_agent_config in research_confirm.yaml | ✅ | `.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml` |
| multi_agent_config in debug_auto.yaml | ✅ | `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` |
| multi_agent_config in debug_confirm.yaml | ✅ | `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` |
| Coordinator Mode in research.md (Section 9) | ✅ | `.opencode/agent/research.md` |
| Worker Mode in research.md (Section 10) | ✅ | `.opencode/agent/research.md` |
| Coordinator Mode in debug.md (Section 4) | ✅ | `.opencode/agent/debug.md` |
| Worker Mode in debug.md (Section 5) | ✅ | `.opencode/agent/debug.md` |

<!-- /ANCHOR:verification-summary -->


<!-- ANCHOR:files-modified -->
## Files Modified

1. `.opencode/command/spec_kit/research.md` - Added Phase 3 (Dispatch Mode)
2. `.opencode/command/spec_kit/debug.md` - Extended Phase 2
3. `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml` - Added multi_agent_config
4. `.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml` - Added multi_agent_config
5. `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` - Added multi_agent_config
6. `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` - Added multi_agent_config
7. `.opencode/agent/research.md` - Added Sections 9 and 10, renumbered all sections
8. `.opencode/agent/debug.md` - Added Sections 4 and 5, renumbered all sections

<!-- /ANCHOR:files-modified -->


<!-- ANCHOR:post-verification-fixes -->
## Post-Verification Fixes

- [x] **P0** Phase 4 dependency reference corrected
  - Evidence: `.opencode/command/spec_kit/research.md` Line 147: "EXECUTE AFTER PHASE 3 PASSES"
- [x] **P0** Violation detection phase reference corrected
  - Evidence: `.opencode/command/spec_kit/research.md` Line 248: "(Phase 5)"

<!-- /ANCHOR:post-verification-fixes -->


<!-- ANCHOR:phase-2-complete-and-plan-commands -->
## Phase 2: Complete and Plan Commands

### Command Updates
- [x] **P0** complete.md has Phase 4 with A/B/C dispatch options
  - Evidence: `.opencode/command/spec_kit/complete.md` contains "PHASE 4: DISPATCH MODE SELECTION"
- [x] **P0** complete.md Phase 2.5 renamed to Phase 3 (sequential)
  - Evidence: `.opencode/command/spec_kit/complete.md` contains "PHASE 3: OPTIONAL RESEARCH PHASE"
- [x] **P0** complete.md Memory phase is now Phase 5
  - Evidence: `.opencode/command/spec_kit/complete.md` contains "PHASE 5: MEMORY CONTEXT LOADING"
- [x] **P0** plan.md has Phase 3 with A/B/C dispatch options
  - Evidence: `.opencode/command/spec_kit/plan.md` contains "PHASE 3: DISPATCH MODE SELECTION"
- [x] **P0** plan.md Memory phase is now Phase 4
  - Evidence: `.opencode/command/spec_kit/plan.md` contains "PHASE 4: MEMORY CONTEXT LOADING"
- [x] **P0** Both commands store dispatch_mode variable
  - Evidence: Both files contain `dispatch_mode = [single/multi_small/multi_large]`

### YAML Configuration
- [x] **P0** spec_kit_complete_auto.yaml has multi_agent_config section
  - Evidence: File contains "MULTI-AGENT DISPATCH CONFIGURATION" section
- [x] **P0** spec_kit_complete_confirm.yaml has multi_agent_config section
  - Evidence: File contains "MULTI-AGENT DISPATCH CONFIGURATION" section
- [x] **P0** spec_kit_plan_auto.yaml has multi_agent_config section
  - Evidence: File contains "MULTI-AGENT DISPATCH CONFIGURATION" section
- [x] **P0** spec_kit_plan_confirm.yaml has multi_agent_config section
  - Evidence: File contains "MULTI-AGENT DISPATCH CONFIGURATION" section
- [x] **P0** Worker configurations specified for complete/plan
  - Evidence: Workers defined: architecture_explorer, feature_explorer, dependency_explorer

### Violation Detection
- [x] **P1** complete.md violation detection includes dispatch mode skipping
  - Evidence: Contains "Skipped dispatch mode selection (Phase 4)"
- [x] **P1** plan.md violation detection includes dispatch mode skipping
  - Evidence: Contains "Skipped dispatch mode selection (Phase 3)"

<!-- /ANCHOR:phase-2-complete-and-plan-commands -->


<!-- ANCHOR:implementation-complete -->
## Implementation Complete

All P0 items verified. Sequential numbering applied to all phases and sections across all commands.

<!-- /ANCHOR:implementation-complete -->
