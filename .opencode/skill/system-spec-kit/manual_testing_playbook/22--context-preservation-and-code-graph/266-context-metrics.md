---
title: "266 -- Context preservation metrics quality score computation"
description: "This scenario validates Context preservation metrics for 266. It focuses on verifying quality score computation from tool call events and factor decay."
audited_post_018: true
---

# 266 -- Context preservation metrics quality score computation

## 1. OVERVIEW

This scenario validates Context preservation metrics (context-metrics.ts).

---

## 2. CURRENT REALITY

- **Objective**: Verify that the context-metrics module correctly tracks session events (tool_call, memory_recovery, code_graph_query, spec_folder_change) and computes QualityScore with 4 weighted factors. The recency factor must decay over time (1.0 for recent, lower as time passes). The recovery factor must be 1.0 after a memory_recovery event. The graphFreshness factor must reflect actual code graph state (1.0 fresh, 0.5 stale, 0.0 empty). The continuity factor must decrease on spec folder transitions. The composite score must map to quality levels: healthy (>= 0.7), degraded (>= 0.4), critical (< 0.4).
- **Prerequisites**:
  - MCP server running and accessible
  - Ability to make multiple tool calls to generate events
- **Prompt**: `As a context-and-code-graph validation operator, validate Context preservation metrics quality score computation against memory_stats({}). Verify the context-metrics module correctly tracks session events (tool_call, memory_recovery, code_graph_query, spec_folder_change) and computes QualityScore with 4 weighted factors. The recency factor must decay over time (1.0 for recent, lower as time passes). The recovery factor must be 1.0 after a memory_recovery event. The graphFreshness factor must reflect actual code graph state (1.0 fresh, 0.5 stale, 0.0 empty). The continuity factor must decrease on spec folder transitions. The composite score must map to quality levels: healthy (>= 0.7), degraded (>= 0.4), critical (< 0.4). Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - After tool call: recency factor close to 1.0
  - After memory_recovery: recovery factor === 1.0
  - graphFreshness factor matches code graph state
  - Composite score >= 0.7 maps to 'healthy'
  - All factors in [0.0, 1.0] range
- **Pass/fail criteria**:
  - PASS: All events tracked, factors computed correctly, quality level mapping correct
  - FAIL: Events not counted, factors out of range, or quality level incorrect for composite score

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Tool call events tracked and recency computed against memory_stats({}). Verify toolCallCount > 0 in metrics, recency factor close to 1.0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_stats({})` then `session_health({})`

### Expected

toolCallCount > 0 in metrics, recency factor close to 1.0

### Evidence

session_health response qualityScore.factors.recency

### Pass / Fail

- **Pass**: recency > 0.9 immediately after tool call
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check recordMetricEvent() in context-metrics.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate Memory recovery tracked and factor updated against memory_context({ mode: "resume" }). Verify recovery factor === 1.0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_context({ mode: "resume" })` then `session_health({})`

### Expected

recovery factor === 1.0

### Evidence

session_health response qualityScore.factors.recovery

### Pass / Fail

- **Pass**: recovery factor is 1.0 after resume call
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check memory_recovery event recording and factor computation

---

### Prompt

```
As a context-and-code-graph validation operator, validate Quality level mapping from composite score against session_health({}). Verify qualityScore.level matches expected level for score value. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})` after several interactions

### Expected

qualityScore.level matches expected level for score value

### Evidence

session_health response qualityScore

### Pass / Fail

- **Pass**: level is 'healthy' when score >= 0.7, 'degraded' when >= 0.4, 'critical' when < 0.4
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check threshold constants in context-metrics.ts

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/22-context-preservation-metrics.md](../../feature_catalog/22--context-preservation-and-code-graph/22-context-preservation-metrics.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 266
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/266-context-metrics.md`
