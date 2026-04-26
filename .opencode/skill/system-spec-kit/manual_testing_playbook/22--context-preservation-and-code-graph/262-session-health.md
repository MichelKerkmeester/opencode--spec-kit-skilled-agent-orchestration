---
title: "262 -- Session health reports ok/warning/stale status"
description: "This scenario validates Session health tool for 262. It focuses on verifying session_health returns correct status thresholds and quality score."
audited_post_018: true
---

# 262 -- Session health reports ok/warning/stale status

## 1. OVERVIEW

This scenario validates Session health tool (session_health).

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that session_health correctly computes session status based on time thresholds: ok (last tool call within 15 minutes), warning (within 60 minutes), stale (beyond 60 minutes or session older than 24 hours). Response must include structured details (sessionAgeMs, lastToolCallAgoMs, graphFreshness, specFolder, primingStatus), a QualityScore with 4 factors (recency, recovery, graphFreshness, continuity), and actionable hints.
- **Prerequisites**:
  - MCP server running and accessible
  - At least one prior tool call in the session (to establish timestamps)
- **Prompt**: `As a context-and-code-graph validation operator, validate Session health reports ok/warning/stale status against session_health({}). Verify session_health correctly computes session status based on time thresholds: ok (last tool call within 15 minutes), warning (within 60 minutes), stale (beyond 60 minutes or session older than 24 hours). Response must include structured details (sessionAgeMs, lastToolCallAgoMs, graphFreshness, specFolder, primingStatus), a QualityScore with 4 factors (recency, recovery, graphFreshness, continuity), and actionable hints. Return a concise pass/fail verdict with the main reason and cited evidence.`
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

### Prompt

```
As a context-and-code-graph validation operator, validate Fresh session returns status=ok with healthy quality against session_health({}). Verify status === 'ok', qualityScore.level === 'healthy', recency factor close to 1.0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})` immediately after `memory_stats({})`

### Expected

status === 'ok', qualityScore.level === 'healthy', recency factor close to 1.0

### Evidence

session_health response JSON

### Pass / Fail

- **Pass**: status is 'ok' and quality level is 'healthy'
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check FIFTEEN_MINUTES_MS threshold and recency decay in context-metrics.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate Detail fields and graph freshness against session_health({}). Verify sessionAgeMs > 0, lastToolCallAgoMs >= 0, graphFreshness in [fresh, stale, empty, error], primingStatus in [primed, not_primed]. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})`

### Expected

sessionAgeMs > 0, lastToolCallAgoMs >= 0, graphFreshness in [fresh, stale, empty, error], primingStatus in [primed, not_primed]

### Evidence

Response fields and values

### Pass / Fail

- **Pass**: all detail fields present with valid values
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check getCodeGraphStatusSnapshot() and getSessionTimestamps()

---

### Prompt

```
As a context-and-code-graph validation operator, validate Quality score 4-factor breakdown against session_health({}). Verify qualityScore.factors has recency, recovery, graphFreshness, continuity each 0.0-1.0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})`

### Expected

qualityScore.factors has recency, recovery, graphFreshness, continuity each 0.0-1.0

### Evidence

Factor values in response

### Pass / Fail

- **Pass**: all 4 factors present and within [0.0, 1.0] range
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check computeQualityScore() in context-metrics.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate session_health excluded from idle timer against memory_stats({}). Verify lastToolCallAgoMs continues increasing from the last non-health tool call instead of resetting on session_health. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_stats({})`, wait, call `session_health({})`, wait again, call `session_health({})` a second time

### Expected

lastToolCallAgoMs` continues increasing from the last non-health tool call instead of resetting on `session_health

### Evidence

Two `session_health` responses showing increasing `lastToolCallAgoMs` despite an intervening health check

### Pass / Fail

- **Pass**: `lastToolCallAgoMs` reflects time since the last non-health tool call, not the `session_health` call itself
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `hooks/memory-surface.ts` `recordToolCall()` usage and confirm `session_health` reads timestamps without mutating them

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/17-session-health-tool.md](../../feature_catalog/22--context-preservation-and-code-graph/17-session-health-tool.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 262
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/262-session-health.md`
