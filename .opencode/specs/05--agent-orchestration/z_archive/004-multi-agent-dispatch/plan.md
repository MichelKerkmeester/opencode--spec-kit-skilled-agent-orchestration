---
title: "Plan: Multi-Agent Dispatch Implementation [004-multi-agent-dispatch/plan]"
description: "User selects dispatch mode (A/B/C)"
trigger_phrases:
  - "plan"
  - "multi"
  - "agent"
  - "dispatch"
  - "implementation"
  - "004"
importance_tier: "important"
contextType: "decision"
---
# Plan: Multi-Agent Dispatch Implementation

<!-- ANCHOR:architecture -->
## Architecture

```
User selects dispatch mode (A/B/C)
         │
         ├─► A) Single Agent: Current behavior (1 Opus)
         │
         └─► B/C) Multi-Agent:
                 │
                 ├─► OPUS Orchestrator (coordinator mode)
                 │        │
                 │        ├─► SONNET Worker 1 (focused domain)
                 │        ├─► SONNET Worker 2 (focused domain)
                 │        └─► SONNET Worker 3 (Option C only)
                 │
                 └─► Orchestrator synthesizes → Returns result
```

<!-- /ANCHOR:architecture -->


<!-- ANCHOR:implementation-steps -->
## Implementation Steps

### Phase 1: Command Updates

1. **Update research.md command**
   - Add Phase 2.5: DISPATCH MODE SELECTION
   - Present A/B/C options
   - Store dispatch_mode variable

2. **Update debug.md command**
   - Extend Phase 2 to include dispatch mode
   - Present combined model + dispatch selection
   - Store both selected_model and dispatch_mode

### Phase 2: YAML Configuration

3. **Add multi_agent_config to research YAMLs**
   - Define dispatch modes (single, multi_small, multi_large)
   - Configure worker roles for research

4. **Add multi_agent_config to debug YAMLs**
   - Define dispatch modes
   - Configure worker roles for debugging

### Phase 3: Agent Updates

5. **Update research agent**
   - Add Section 6.5: Coordinator Mode
   - Add Section 6.6: Worker Mode
   - Define work division for research

6. **Update debug agent**
   - Add Section 3.5: Coordinator Mode
   - Add Section 3.6: Worker Mode
   - Define work division for debugging

<!-- /ANCHOR:implementation-steps -->


<!-- ANCHOR:work-division -->
## Work Division

### Research Workers (Options B/C)

| Worker | Model | Focus | Steps |
|--------|-------|-------|-------|
| Orchestrator | Opus | Coordinate + synthesize | 6, 7, 8, 9 |
| Codebase Explorer | Sonnet | Existing patterns | Step 3 |
| External Researcher | Sonnet | Documentation, APIs | Step 4 |
| Technical Analyzer | Sonnet | Feasibility, risks | Step 5 (Option C only) |

### Debug Workers (Options B/C)

| Worker | Model | Focus | Phase |
|--------|-------|-------|-------|
| Orchestrator | Opus | Observe + Fix | OBSERVE, FIX |
| Call Path Tracer | Sonnet | Execution path analysis | ANALYZE |
| Pattern Searcher | Sonnet | Similar working code | ANALYZE |
| Edge Case Hunter | Sonnet | Boundary conditions | HYPOTHESIZE (Option C only) |

<!-- /ANCHOR:work-division -->


<!-- ANCHOR:fallback-behavior -->
## Fallback Behavior

- If worker times out (60s): Continue with available outputs
- If all workers fail: Fall back to single-agent mode
- If orchestrator fails: Save partial results to scratch/

<!-- /ANCHOR:fallback-behavior -->
