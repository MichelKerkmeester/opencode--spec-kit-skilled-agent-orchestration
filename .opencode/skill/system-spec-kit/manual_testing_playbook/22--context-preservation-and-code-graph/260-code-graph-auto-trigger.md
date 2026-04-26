---
title: "260 -- Code graph auto-trigger on read paths"
description: "This scenario validates Code graph auto-trigger for 260. It focuses on the blocked query/context contract plus the live ensure-ready state transitions."
audited_post_018: true
---

# 260 -- Code graph auto-trigger on read paths

## 1. OVERVIEW

This scenario validates Code graph auto-trigger (ensureCodeGraphReady).

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that the live auto-trigger contract covers both the helper decision surface and the caller-visible blocked read path. `ensureCodeGraphReady()` must still distinguish fresh/stale/empty graphs and choose `none`, `selective_reindex`, or `full_scan` appropriately, while `code_graph_query` and `code_graph_context` must return an explicit `status: "blocked"` contract when readiness requires a full scan that read paths will not run inline.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Git repository with at least one commit
- **Prompt**: `As a context-and-code-graph validation operator, validate the code graph auto-trigger read-path contract against cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run tests/ensure-ready.vitest.ts code-graph/tests/code-graph-query-handler.vitest.ts code-graph/tests/code-graph-context-handler.vitest.ts. Verify ensureCodeGraphReady() still distinguishes fresh/stale/empty graphs and chooses none/selective_reindex/full_scan correctly, and verify code_graph_query plus code_graph_context now return explicit blocked payloads when readiness requires a suppressed full scan. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - `tests/ensure-ready.vitest.ts` passes and confirms `selective_reindex` for small stale sets plus `full_scan` when git HEAD drift or large stale sets require broader reindexing on read paths
  - `code-graph/tests/code-graph-query-handler.vitest.ts` passes and confirms `code_graph_query` returns `status: "blocked"` with `requiredAction: "code_graph_scan"` when readiness requires a full scan
  - `code-graph/tests/code-graph-context-handler.vitest.ts` passes and confirms `code_graph_context` returns `status: "blocked"` with `blocked`, `degraded`, `graphAnswersOmitted`, `requiredAction`, and readiness metadata
  - Blocked payloads carry `blockReason: "full_scan_required"` and the shared readiness vocabulary (`canonicalReadiness`, `trustState`)
- **Pass/fail criteria**:
  - PASS: The helper suite proves the state transitions and the query/context handler suites prove the blocked read contract callers now see
  - FAIL: The playbook still relies on the old indexer-only path, helper state selection no longer matches the tests, or blocked read payloads are missing required fields

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate ensure-ready state selection against cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run tests/ensure-ready.vitest.ts. Verify ensureCodeGraphReady() keeps small stale sets in selective_reindex territory, preserves full_scan when git HEAD drift or >50 stale files require broader work, and skips inline full scans on read paths. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run tests/ensure-ready.vitest.ts`

### Expected

`ensureCodeGraphReady()` preserves the live helper contract: `selective_reindex` for small stale sets, `full_scan` when git HEAD drift or large stale sets require broader work, and `inline full scan skipped for read path` when read paths suppress the heavier repair

### Evidence

Vitest output showing `selective_reindex` and `full_scan` assertions from `tests/ensure-ready.vitest.ts`

### Pass / Fail

- **Pass**: helper-state assertions confirm the live `selective_reindex` vs `full_scan` decision boundary for read paths
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `code-graph/lib/ensure-ready.ts` for stale-file thresholds, git HEAD drift handling, and read-path full-scan suppression

---

### Prompt

```
As a context-and-code-graph validation operator, validate the blocked query contract against cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run code-graph/tests/code-graph-query-handler.vitest.ts. Verify code_graph_query returns status: "blocked", message starting with code_graph_full_scan_required, and data fields including blocked, degraded, graphAnswersOmitted, requiredAction: "code_graph_scan", and blockReason: "full_scan_required" when readiness requires a full scan. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run code-graph/tests/code-graph-query-handler.vitest.ts`

### Expected

`code_graph_query` emits a blocked payload with `status: "blocked"`, `requiredAction: "code_graph_scan"`, `graphAnswersOmitted: true`, and `blockReason: "full_scan_required"`

### Evidence

Vitest output showing the blocked `code_graph_query` assertion set in `code-graph-query-handler.vitest.ts`

### Pass / Fail

- **Pass**: the query handler exposes the blocked contract instead of silently reporting only helper action details
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `code-graph/handlers/query.ts` blocked-payload builder and its readiness gating around `ensureCodeGraphReady()`

---

### Prompt

```
As a context-and-code-graph validation operator, validate the blocked context contract against cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run code-graph/tests/code-graph-context-handler.vitest.ts. Verify code_graph_context returns status: "blocked" with blocked, degraded, graphAnswersOmitted, requiredAction: "code_graph_scan", blockReason: "full_scan_required", and shared readiness metadata when readiness requires a suppressed full scan. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run code-graph/tests/code-graph-context-handler.vitest.ts`

### Expected

`code_graph_context` emits a blocked payload with `blocked: true`, `degraded: true`, `graphAnswersOmitted: true`, `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, plus `readiness`, `canonicalReadiness`, `trustState`, and `lastPersistedAt`

### Evidence

Vitest output showing the blocked `code_graph_context` assertion set in `code-graph-context-handler.vitest.ts`

### Pass / Fail

- **Pass**: the context handler surfaces the blocked read contract callers rely on before retrying after a scan
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `code-graph/handlers/context.ts` for the blocked response payload and readiness metadata passthrough

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md](../../feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 260
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`
