---
title: "266 -- Context preservation metrics quality score computation"
description: "This scenario validates Context preservation metrics for 266. It focuses on verifying quality score computation from tool call events and factor decay."
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
- **Prompt**: `Validate 266 Context metrics. Make several tool calls and check quality scoring: (1) call memory_stats to register a tool_call event, (2) call session_health and verify recency factor is close to 1.0, (3) call memory_context with mode=resume to register memory_recovery, (4) call session_health and verify recovery factor is 1.0, (5) verify composite score maps to correct quality level.`
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

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 266a | Context preservation metrics | Tool call events tracked and recency computed | `Validate 266a event tracking` | Call `memory_stats({})` then `session_health({})` | toolCallCount > 0 in metrics, recency factor close to 1.0 | session_health response qualityScore.factors.recency | PASS if recency > 0.9 immediately after tool call | Check recordMetricEvent() in context-metrics.ts |
| 266b | Context preservation metrics | Memory recovery tracked and factor updated | `Validate 266b recovery tracking` | Call `memory_context({ mode: "resume" })` then `session_health({})` | recovery factor === 1.0 | session_health response qualityScore.factors.recovery | PASS if recovery factor is 1.0 after resume call | Check memory_recovery event recording and factor computation |
| 266c | Context preservation metrics | Quality level mapping from composite score | `Validate 266c quality level mapping` | Call `session_health({})` after several interactions | qualityScore.level matches expected level for score value | session_health response qualityScore | PASS if level is 'healthy' when score >= 0.7, 'degraded' when >= 0.4, 'critical' when < 0.4 | Check threshold constants in context-metrics.ts |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/22-context-preservation-metrics.md](../../feature_catalog/22--context-preservation-and-code-graph/22-context-preservation-metrics.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 266
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/266-context-metrics.md`
