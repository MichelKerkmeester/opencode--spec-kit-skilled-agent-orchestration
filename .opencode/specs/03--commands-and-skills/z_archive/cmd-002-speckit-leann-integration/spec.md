---
title: "SpecKit LEANN Integration [002-speckit-leann-integration/spec]"
description: "Add backwards-compatible LEANN semantic discovery to SpecKit commands (/spec_kit:plan, /spec_kit:complete, /spec_kit:research) to enhance codebase exploration with semantic sear..."
trigger_phrases:
  - "speckit"
  - "leann"
  - "integration"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# SpecKit LEANN Integration

## Summary
Add backwards-compatible LEANN semantic discovery to SpecKit commands (`/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:research`) to enhance codebase exploration with semantic search capabilities.

<!-- ANCHOR:problem -->
## Problem
SpecKit commands use parallel agent exploration for codebase investigation, but lack semantic code search capabilities. Users with LEANN installed miss out on enhanced discovery that could provide better context for planning and implementation.
<!-- /ANCHOR:problem -->

## Solution
Add LEANN semantic discovery as a **soft enhancement** (SOFT_ENHANCEMENT gate type) that:
1. Checks LEANN availability via `leann_list()`
2. If available, runs semantic searches for relevant patterns
3. If unavailable or fails, gracefully skips and continues workflow
4. Feeds discovery results into existing parallel agent exploration

<!-- ANCHOR:requirements -->
## Requirements
- **Backwards compatible**: Never block workflow if LEANN unavailable
- **Graceful fallback**: Clear skip messaging when LEANN not present
- **Enhancement pattern**: Treat as optional enhancement, not requirement
- **Integration**: Feed LEANN findings into existing exploration logic
<!-- /ANCHOR:requirements -->

## Files Modified
1. `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml` (Step 3) ✅
2. `.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml` ✅
3. `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` (Step 6) ✅
4. `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` ✅
5. `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` (Step 6) ✅
6. `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` ✅

<!-- ANCHOR:success-criteria -->
## Success Criteria
- [x] LEANN discovery section added to all 6 YAML files
- [x] Workflow continues normally when LEANN unavailable (SOFT_ENHANCEMENT gate)
- [x] Clear skip message logged when LEANN not present
- [x] Discovery context feeds into parallel agent exploration
<!-- /ANCHOR:success-criteria -->

## Implementation Details

### LEANN Discovery Section Structure
```yaml
leann_semantic_discovery:
  gate_type: SOFT_ENHANCEMENT
  enforcement: "Enhances discovery with semantic search, not blocking"
  skip_condition: "No LEANN index available OR leann_list() fails OR user requests --skip-discovery"
  fallback: "Skip semantic discovery, proceed to next phase"
  
  availability_check:
    tool: leann_list
    on_success: "Proceed to semantic_search"
    on_failure: "Log skip message, continue workflow"
  
  semantic_search:
    tool: leann_search
    queries: [task-specific patterns]
    output_variable: leann_discovery_context
  
  integration:
    target: "parallel agent exploration"
    enhancement: "Pass leann_discovery_context to agents"
```

### Placement
- **Research workflow**: Step 3 (Codebase Investigation) - before `pre_phase_parallel_check`
- **Plan/Complete workflows**: Step 6 (Planning) - before `inline_parallel_exploration`
