---
title: "100 -- Async shutdown with deadline (server lifecycle)"
description: "This scenario validates Async shutdown with deadline (server lifecycle) for `100`. It focuses on Confirm graceful shutdown completes async cleanup."
---

# 100 -- Async shutdown with deadline (server lifecycle)

## 1. OVERVIEW

This scenario validates Async shutdown with deadline (server lifecycle) for `100`. It focuses on Confirm graceful shutdown completes async cleanup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `100` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graceful shutdown completes async cleanup
- Prompt: `Validate server shutdown deadline behavior. Capture the evidence needed to prove File watcher closes; local reranker disposes; vector index closes; shutdown completes within 5s; force exit fires if cleanup exceeds deadline. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: File watcher closes; local reranker disposes; vector index closes; shutdown completes within 5s; force exit fires if cleanup exceeds deadline
- Pass/fail: PASS if all async resources are cleaned up within deadline

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 100 | Async shutdown with deadline (server lifecycle) | Confirm graceful shutdown completes async cleanup | `Validate server shutdown deadline behavior. Capture the evidence needed to prove File watcher closes; local reranker disposes; vector index closes; shutdown completes within 5s; force exit fires if cleanup exceeds deadline. Return a concise user-facing pass/fail verdict with the main reason.` | 1) start server with file watcher and local reranker enabled 2) send SIGTERM 3) verify file watcher closes, local reranker disposes, and vector index closes 4) verify shutdown completes within 5s deadline (no hang) 5) if async cleanup exceeds 5s, verify force exit fires | File watcher closes; local reranker disposes; vector index closes; shutdown completes within 5s; force exit fires if cleanup exceeds deadline | Process exit behavior + cleanup logs | PASS if all async resources are cleaned up within deadline | Check `context-server.ts` for `SHUTDOWN_DEADLINE_MS` and `gracefulShutdown()` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: *(server lifecycle — no dedicated catalog entry)*

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 100
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md`
