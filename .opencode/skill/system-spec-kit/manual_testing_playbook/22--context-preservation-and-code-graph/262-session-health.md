---
title: "262 -- Session health reports ok/warning/stale status"
description: "This scenario validates Session health tool for 262. It focuses on verifying session_health returns correct status thresholds and quality score."
---

# 262 -- Session health reports ok/warning/stale status

## 1. OVERVIEW

This scenario validates Session health tool (session_health).

---

## 2. CURRENT REALITY

- **Objective**: Verify that session_health correctly computes session status based on time thresholds: ok (last tool call within 15 minutes), warning (within 60 minutes), stale (beyond 60 minutes or session older than 24 hours). Response must include structured details (sessionAgeMs, lastToolCallAgoMs, graphFreshness, specFolder, primingStatus), a QualityScore with 4 factors (recency, recovery, graphFreshness, continuity), and actionable hints.
- **Prerequisites**:
  - MCP server running and accessible
  - At least one prior tool call in the session (to establish timestamps)
- **Prompt**: `Validate 262 Session health. Call session_health and confirm: (1) status is 'ok' immediately after another tool call, (2) details include sessionAgeMs, lastToolCallAgoMs, graphFreshness, specFolder, primingStatus, (3) qualityScore has level (healthy/degraded/critical), score (0.0-1.0), and factors (recency, recovery, graphFreshness, continuity), (4) hints array is present.`
- **Expected signals**:
  - status === 'ok' when called shortly after another tool call
  - All detail fields present with numeric values for age/time fields
  - graphFreshness is one of: fresh, stale, empty, error
  - qualityScore.level is 'healthy' for a fresh session
  - qualityScore.factors has all 4 keys with values 0.0-1.0
- **Pass/fail criteria**:
  - PASS: Status correct for timing, all detail fields present, quality score computed with valid factors
  - FAIL: Wrong status for timing, missing detail fields, or quality score factors missing/out of range

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 262a | Session health tool | Fresh session returns status=ok with healthy quality | `Validate 262a fresh session health` | Call `session_health({})` immediately after `memory_stats({})` | status === 'ok', qualityScore.level === 'healthy', recency factor close to 1.0 | session_health response JSON | PASS if status is 'ok' and quality level is 'healthy' | Check FIFTEEN_MINUTES_MS threshold and recency decay in context-metrics.ts |
| 262b | Session health tool | Detail fields and graph freshness | `Validate 262b detail fields` | Call `session_health({})` | sessionAgeMs > 0, lastToolCallAgoMs >= 0, graphFreshness in [fresh, stale, empty, error], primingStatus in [primed, not_primed] | Response fields and values | PASS if all detail fields present with valid values | Check getCodeGraphStatusSnapshot() and getSessionTimestamps() |
| 262c | Session health tool | Quality score 4-factor breakdown | `Validate 262c quality factors` | Call `session_health({})` | qualityScore.factors has recency, recovery, graphFreshness, continuity each 0.0-1.0 | Factor values in response | PASS if all 4 factors present and within [0.0, 1.0] range | Check computeQualityScore() in context-metrics.ts |
| 262d | Session health tool | session_health excluded from idle timer | `Validate 262d session_health idle-timer exclusion` | Call `memory_stats({})`, wait, call `session_health({})`, wait again, call `session_health({})` a second time | `lastToolCallAgoMs` continues increasing from the last non-health tool call instead of resetting on `session_health` | Two `session_health` responses showing increasing `lastToolCallAgoMs` despite an intervening health check | PASS if `lastToolCallAgoMs` reflects time since the last non-health tool call, not the `session_health` call itself | Check `hooks/memory-surface.ts` `recordToolCall()` usage and confirm `session_health` reads timestamps without mutating them |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/17-session-health-tool.md](../../feature_catalog/22--context-preservation-and-code-graph/17-session-health-tool.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 262
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/262-session-health.md`
