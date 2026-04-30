---
title: "277 -- Code-graph fast-fail fallbackDecision routing"
description: "This scenario validates fallbackDecision.nextTool routing on blocked code_graph_query reads (packet 005). Empty graph and broad-stale states route to code_graph_scan; readiness exception routes to rg; fresh state omits fallbackDecision."
---

# 277 -- Code-graph fast-fail fallbackDecision routing

## 1. OVERVIEW

This scenario validates the `fallbackDecision` routing surface on `code_graph_query` introduced by packet 005. It focuses on confirming every documented blocked-read state emits the correct `nextTool` string and that the fresh-state path leaves the field absent so callers can rely on its presence as a routing signal.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `code_graph_query` emits `fallbackDecision.nextTool` for every documented blocked-read state; Empty graph → `code_graph_scan` (`reason:"full_scan_required"`, `retryAfter:"scan_complete"`); broad-stale (>50 stale tracked files) → `code_graph_scan` (`reason:"full_scan_required"`); readiness exception → `rg` (`reason:"scan_failed"`); fresh state → no `fallbackDecision` key in payload.
- Real user request: `` Please validate Code-graph fast-fail fallbackDecision routing against the four documented states (empty, broad-stale, readiness exception, fresh) and tell me whether the expected signals are present: Empty graph → `fallbackDecision.nextTool === "code_graph_scan"`, `fallbackDecision.reason === "full_scan_required"`, `fallbackDecision.retryAfter === "scan_complete"`; Broad-stale (>50 stale) → `fallbackDecision.nextTool === "code_graph_scan"`, `fallbackDecision.reason === "full_scan_required"`; Readiness exception (spy on `getDb` to throw) → `fallbackDecision.nextTool === "rg"`, `fallbackDecision.reason === "scan_failed"`; Fresh state → `fallbackDecision` field absent from payload (omitted, not null); Live `code-graph.sqlite` sha256 byte-equal before and after the sweep. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate fallbackDecision routing on code_graph_query against the four documented states (empty, broad-stale, readiness exception, fresh). Verify each engineered state emits the documented nextTool/reason pair, the fresh state omits the field entirely, and the live code-graph.sqlite is byte-equal pre/post (per packet 013 isolation guarantee). Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Empty graph → `fallbackDecision.nextTool === "code_graph_scan"`, `fallbackDecision.reason === "full_scan_required"`, `fallbackDecision.retryAfter === "scan_complete"`; Broad-stale (>50 stale) → `fallbackDecision.nextTool === "code_graph_scan"`, `fallbackDecision.reason === "full_scan_required"`; Readiness exception (spy on `getDb` to throw) → `fallbackDecision.nextTool === "rg"`, `fallbackDecision.reason === "scan_failed"`; Fresh state → `fallbackDecision` field absent from payload (omitted, not null); Live `code-graph.sqlite` sha256 byte-equal before and after the sweep
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: all four buckets emit the documented routing or omission AND live DB byte-equal pre/post; FAIL: any bucket emits a wrong `nextTool`/`reason`, fresh state still carries `fallbackDecision`, or live DB sha256 changes

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate fallbackDecision routing on code_graph_query against the four engineered states. Run the integration sweep and the unit harness; assert nextTool/reason/retryAfter fields per state and live-DB byte-equality pre/post. Return a concise pass/fail verdict.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-query-fallback-decision.vitest.ts`
2. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts`
3. `shasum -a 256 .opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` before and after the two suites

### Expected

Both vitest suites pass. Empty and broad-stale buckets emit `nextTool:"code_graph_scan"` with `reason:"full_scan_required"`. Readiness-exception bucket emits `nextTool:"rg"` with `reason:"scan_failed"`. Fresh bucket omits `fallbackDecision` entirely. Live `code-graph.sqlite` sha256 unchanged across the runs.

### Evidence

Vitest output for both suites + sha256 hash pair (before/after) showing byte-equality

### Pass / Fail

- **Pass**: all four routing states verified AND live DB byte-equal pre/post
- **Fail**: any state mis-routed, fresh state still carries `fallbackDecision`, or live DB sha256 changes (proves test isolation broke)

### Failure Triage

Inspect `mcp_server/code_graph/handlers/query.ts` `buildGraphQueryPayload()` and the readiness-to-fallback mapping; confirm packet 005 dist marker via `grep -l "fallbackDecision" mcp_server/dist/code_graph/handlers/query.js`; verify `initDb(tmpdir)` isolation in the integration sweep is wired correctly so the live DB cannot be touched

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Sibling: [254-code-graph-scan-query.md](./254-code-graph-scan-query.md) (counts + `graphQualitySummary` + `readiness.action` snapshot)
- Sibling: [275-code-graph-readiness-contract.md](./275-code-graph-readiness-contract.md) (shared readiness vocabulary)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 277
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/277-code-graph-fast-fail.md`
