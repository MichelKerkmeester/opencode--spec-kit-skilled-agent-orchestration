---
title: "EX-014 -- detect_changes preflight (Code Graph)"
description: "This scenario validates detect_changes for `EX-014`. It focuses on the P1 safety invariant: status='blocked' on stale graph and accurate symbol attribution on a fresh graph."
---

# EX-014 -- detect_changes preflight (Code Graph)

## 1. OVERVIEW

This scenario validates detect_changes for `EX-014`. It focuses on the P1 safety invariant: status='blocked' on stale graph and accurate symbol attribution on a fresh graph.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-014` and confirm the expected signals without contradicting evidence.

- Objective: Confirm detect_changes refuses to answer on stale state and reports correct affected symbols on fresh state
- Prompt: `As a discovery validation operator, validate detect_changes against a deliberately-stale Code Graph and then against a freshly-scanned Code Graph. Verify the stale run returns status='blocked' (never 'ok' with empty affectedSymbols), and the fresh run returns status='ok' with affectedSymbols matching the touched symbols. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: status='blocked' on stale; status='ok' with non-empty affectedSymbols on fresh diff that touches indexed symbol ranges
- Pass/fail: PASS if both behaviors are observed; FAIL if stale state ever returns 'ok' with empty affectedSymbols

---

## 3. TEST EXECUTION

### Prompt

```
As a discovery validation operator, validate detect_changes preflight against the documented validation surface. Run it once when the graph is intentionally stale and once after a fresh code_graph_scan. Verify status='blocked' on stale (NEVER 'ok' with empty affectedSymbols) and status='ok' with the expected affected symbols on fresh. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Modify a tracked source file to make the graph stale (or skip running `code_graph_scan`).
2. Generate a unified diff that touches a known indexed function: `git diff -- path/to/file.ts > /tmp/diff.txt`.
3. Call `detect_changes({ diff: <diff text>, rootDir: <workspace> })` with the stale graph and confirm `status: 'blocked'` plus a `blockedReason` describing the stale state.
4. Run `code_graph_scan({ incremental: true })` to refresh the graph.
5. Re-run `detect_changes` with the same diff and confirm `status: 'ok'` plus `affectedSymbols[]` containing the touched function/class/method by `fqName`.
6. Inspect `affectedFiles` to confirm the touched file paths roll up correctly.

### Expected

Stale graph → `{ status: 'blocked', affectedSymbols: [], blockedReason: 'graph readiness is "stale" ...', readiness.freshness: 'stale' }`. Fresh graph → `{ status: 'ok', affectedSymbols: [...], affectedFiles: [...], readiness.freshness: 'fresh' }`.

### Evidence

Stored response payloads from steps 3 and 5; the diff text from step 2; the file paths and known indexed symbol fqNames from `code_graph_query({ operation: 'outline', subject: <filePath> })`.

### Pass / Fail

- **Pass**: Stale invocation returns `status: 'blocked'` with the readiness reason carried through; fresh invocation returns `status: 'ok'` with the expected indexed symbols listed (and the synthetic `module` node correctly excluded).
- **Fail**: Stale invocation returns `status: 'ok'` with an empty `affectedSymbols` array (false-safe RISK-03 violation); or fresh invocation misses a symbol whose source range demonstrably overlaps an `@@` hunk.

### Failure Triage

Confirm `ensureCodeGraphReady` is wired with `allowInlineIndex: false` so the read path doesn't silently scan → check `mcp_server/code_graph/handlers/detect-changes.ts:readinessRequiresBlock` switch is comparing against `'fresh'` only → if attribution misses, inspect `queryOutline(filePath)` rows and `parseUnifiedDiff` hunk ranges for off-by-one in line numbering.

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [03--discovery/04-detect-changes-preflight.md](../../feature_catalog/03--discovery/04-detect-changes-preflight.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--discovery/014-detect-changes-preflight.md`
- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes`
- Research basis: pt-02 §11 Packet 1, §12 RISK-03
