---
title: "Full Pipeline Loop with Non-Standard Agent (Debug)"
feature_id: "E2E-021"
category: "End-to-End Loop"
---

# Full Pipeline Loop with Non-Standard Agent (Debug)

Validates the complete `/improve:improve-agent` loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate the complete /improve:improve-agent loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dynamic profile generated on-the-fly (debug.md has no static profile). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```text
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder=specs/skilled-agent-orchestration/041-sk-improve-agent-loop/008-sk-improve-agent-holistic-evaluation --iterations=1
```

## Expected

- Dynamic profile generated on-the-fly (debug.md has no static profile)
- Integration scan discovers debug agent surfaces
- 5-dimension scoring produces scores for all dimensions: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`
- No errors about missing profile or unsupported target
- Dashboard reflects debug-specific scoring, not recycled data from a different agent

## Pass Criteria

Non-hardcoded agent evaluates successfully with dynamic profiling -- the full pipeline completes for `debug.md`, producing a dashboard with all 5 dimension scores (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) that reflect the debug agent's actual content.

## Failure Triage

- If the pipeline fails at profile generation: verify that dynamic mode is triggered when no pre-built profile exists for `debug.md`
- If scores look identical across unrelated agents: check that the candidate file path is correctly resolved to `debug.md` and passed through each stage
- If integration scan returns few surfaces: this may be valid for debug (compare against manual count), but verify the scanner is not filtering too aggressively
- If the command rejects the agent: check agent resolution logic for supported path formats (should accept any `.md` agent path)

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
