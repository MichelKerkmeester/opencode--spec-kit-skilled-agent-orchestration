---
title: "Plan: Agent-Improver [skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/plan]"
description: "Verify all 8 scripts work against the agent-improver target before running the full loop."
trigger_phrases:
  - "plan"
  - "agent"
  - "improver"
  - "009"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: Agent-Improver Self-Test

| Field | Value |
| --- | --- |
| Status | Complete |
| Phase | 009 |
| Approach | Execution-first: run the real command, observe, document |

## Deliverables

### D1: Pre-Flight Verification

Verify all 8 scripts work against the agent-improver target before running the full loop.

1. Verify all 8 `.cjs` scripts parse without errors (`node -c`)
2. Run `scan-integration.cjs --agent=agent-improver` — capture integration report
3. Run `generate-profile.cjs --agent=.opencode/agent/agent-improver.md` — capture dynamic profile
4. Run `score-candidate.cjs --candidate=.opencode/agent/agent-improver.md --dynamic` — capture baseline 5D scores

### D2: Execute Self-Improvement Loop

Run the full `/improve:agent` command targeting agent-improver.md.

- Target: `.opencode/agent/agent-improver.md`
- Mode: `:confirm` (interactive gates for observation at each iteration)
- Scoring: Dynamic (5-dimension, no static profile exists for agent-improver)
- Iterations: 3 maximum
- Runtime root: `009-sk-improve-agent-self-test/improvement/`

Per iteration: scan refresh → dispatch `@agent-improver` → score candidate → benchmark → append ledger → reduce state → check stop.

### D3: Record Observations

Document the self-referential test results:

- Integration scan output (surfaces discovered, mirror sync, command/skill/YAML refs)
- Dynamic profile contents (rules extracted, output checks, capability mismatches)
- Per-iteration 5-dimension scores (structural, ruleCoherence, integration, outputQuality, systemFitness)
- Self-referential anomalies (tautological scoring, plateau speed, benchmark behavior without fixtures)
- Reducer dashboard and registry final state

### D4: Update Parent Packet

- Add Phase 9 row to root `041` spec.md phase map
- Add Phase 9 section to root `041` implementation-summary.md
- Add Phase 9 entry to root `041` changelog.md

### D5: Write Implementation Summary

Write `implementation-summary.md` with full observations, scores, edge-case findings, and recommendations for future phases.

## Dependencies

```
D1 (pre-flight) ← D2 (loop execution)
D2 (loop execution) ← D3 (observations)
D3 (observations) ← D5 (implementation-summary)
D2 + D3 ← D4 (parent updates)
```

## Self-Referential Edge Cases

1. **Scanner finds own surfaces**: sk-improve-agent SKILL.md references `agent-improver` heavily — high ref count expected, not a bug
2. **Tautological rule coherence**: Profile extracts rules from agent-improver.md, then checks the same content for those rules — first iteration scores near 100
3. **Rapid plateau**: Well-maintained agent file likely converges immediately → plateau stop after 1-2 iterations
4. **No static fixtures**: `run-benchmark.cjs` has no fixture dir for agent-improver — observe how dynamic-only mode handles this
5. **Mutator reads itself**: `@agent-improver` subagent reads its own definition as the target — proposal-only boundary prevents circular modification
