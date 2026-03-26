---
title: "201 -- Warm server / daemon mode"
description: "This scenario validates Warm server / daemon mode for `201`. It focuses on verifying that daemon transport remains deferred and the current runtime still uses stdio startup behavior."
---

# 201 -- Warm server / daemon mode

## 1. OVERVIEW

This scenario validates Warm server / daemon mode for `201`. It focuses on verifying that daemon transport remains deferred and the current runtime still uses stdio startup behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `201` and confirm the expected signals without contradicting evidence.

- Objective: Verify warm daemon mode is still deferred and the server continues to operate as a per-invocation stdio process
- Prompt: `Validate the current warm server / daemon mode status. Capture the evidence needed to prove HTTP daemon transport is still deferred; the runtime still starts through stdio transport; eager warmup remains disabled; and no persistent warm-server path is active in the current operator workflow. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: HTTP daemon transport is documented as deferred; current startup path is stdio; `shouldEagerWarmup()` remains false in non-daemon mode; runtime behavior shows normal process startup/shutdown per invocation rather than a persistent background server
- Pass/fail: PASS if current behavior is clearly stdio-only and daemon mode remains deferred; FAIL if an active HTTP daemon path exists, eager warmup is enabled, or docs/code disagree about current transport

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 201 | Warm server / daemon mode | Verify warm daemon mode is still deferred and the server continues to operate as a per-invocation stdio process | `Validate the current warm server / daemon mode status. Capture the evidence needed to prove HTTP daemon transport is still deferred; the runtime still starts through stdio transport; eager warmup remains disabled; and no persistent warm-server path is active in the current operator workflow. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Review the documented current reality for daemon mode and note the deferred status 2) Start the server through the standard runtime path and capture the transport/startup behavior 3) Confirm the active flow is stdio-based rather than an HTTP listener or long-lived daemon endpoint 4) Inspect the warmup behavior and verify eager warmup remains disabled 5) End the session and confirm the process exits normally instead of remaining as a persistent background service | HTTP daemon transport is documented as deferred; current startup path is stdio; `shouldEagerWarmup()` remains false in non-daemon mode; runtime behavior shows normal process startup/shutdown per invocation rather than a persistent background server | Startup transcript + transport evidence + warmup flag/code evidence + shutdown observation | PASS if current behavior is clearly stdio-only and daemon mode remains deferred; FAIL if an active HTTP daemon path exists, eager warmup is enabled, or docs/code disagree about current transport | Inspect `context-server.ts` transport bootstrap; review `shouldEagerWarmup()` behavior in embedding provider setup; check for undocumented daemon flags, endpoints, or bootstrap branches in CLI/server entrypoints |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/15-warm-server-daemon-mode.md](../../feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 201
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/201-warm-server-daemon-mode.md`
