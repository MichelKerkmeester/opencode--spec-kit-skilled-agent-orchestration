---
title: "271 -- Code Graph phase-DAG runner"
description: "This scenario validates the Code Graph phase-DAG runner for `271`. It focuses on proving the runner enforces declared dependencies, rejects malformed DAGs, and that the structural-indexer scan flow runs through the wrapped phases without changing observable behavior."
---

# 271 -- Code Graph phase-DAG runner

## 1. OVERVIEW

This scenario validates the Code Graph phase-DAG runner for `271`. It focuses on proving the runner enforces declared dependencies, rejects malformed DAGs, and that the structural-indexer scan flow runs through the wrapped phases without changing observable behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the phase-DAG runner rejects duplicate names / missing deps / cycles, hides undeclared upstream outputs from each phase body, and that `indexFiles()` produces the same `IndexFilesResult` shape it did before the wrap.
- Real user request: `Please validate Code Graph phase-DAG runner against the documented contract and tell me whether the expected signals are present: targeted phase-runner tests pass; existing code-graph indexer + scan suites pass unchanged; manual scan against a fixture matches the pre-wrap baseline.`
- RCAF Prompt: `As a pipeline validation operator, validate the Code Graph phase-DAG runner against the documented contract. Verify duplicate-name, missing-dependency, and cycle inputs each raise PhaseRunnerError with the offending phase named; confirm a phase body with no declared inputs cannot read another phase's output; and confirm a code_graph_scan against a known fixture produces the same filesScanned/filesIndexed/totalNodes counts as the pre-wrap baseline. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: targeted phase-runner tests pass; existing code-graph indexer + scan suites pass unchanged; manual scan against a fixture matches the pre-wrap baseline
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all three behaviors hold and no regression is observed in scan output

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, validate the Code Graph phase-DAG runner. Verify duplicate-name, missing-dependency, and cycle inputs each raise PhaseRunnerError with the offending phase named; confirm a phase body with no declared inputs cannot read another phase's output; and confirm a code_graph_scan against a known fixture produces the same filesScanned/filesIndexed/totalNodes counts as the pre-wrap baseline. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run the runner unit suite: `vitest run mcp_server/code_graph/tests/phase-runner.test.ts` — confirm the duplicate-name, missing-dependency, cycle, and dependency-only-output tests all pass.
2. Run the existing indexer + scan suites: `vitest run mcp_server/code_graph/tests/code-graph-indexer.vitest.ts mcp_server/code_graph/tests/code-graph-scan.vitest.ts` — confirm zero regressions.
3. Run a real scan: `code_graph_scan({ rootDir: <fixture-or-workspace> })` and capture `filesScanned`, `filesIndexed`, `totalNodes`, `totalEdges`.
4. Compare counts against the pre-wrap baseline (recorded before this sub-phase landed). Counts MUST match exactly because the wrap is purely orchestrational.
5. Inspect logs for `[structural-indexer] scanned ... files` and `[structural-indexer] refreshed ... specific file(s)` — both messages MUST still appear (now emitted from inside `find-candidates`).

### Expected

Targeted phase-runner tests pass; existing code-graph indexer + scan suites pass unchanged; manual scan against a fixture matches the pre-wrap baseline

### Evidence

Vitest output for the three suites plus a paired `code_graph_scan` payload showing identical `filesScanned`/`filesIndexed`/`totalNodes`/`totalEdges` counts before and after.

### Pass / Fail

- **Pass**: all three test suites green; manual scan counts match baseline; expected log lines still emitted.
- **Fail**: any regression in existing indexer/scan tests; scan counts diverge from baseline; or `PhaseRunnerError` lacks the offending phase name in `phaseName`.

### Failure Triage

Inspect `mcp_server/code_graph/lib/phase-runner.ts` (Kahn-sort + rejection paths), `mcp_server/code_graph/lib/structural-indexer.ts:buildIndexPhases` (the four declared phases), and `indexFiles()` (must preserve `IndexFilesResult` shape including `preParseSkippedCount`).

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/25-code-graph-phase-dag-runner.md](../../feature_catalog/14--pipeline-architecture/25-code-graph-phase-dag-runner.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 271
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/271-code-graph-phase-dag-runner.md`
- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes`
- Research basis: pt-02 §11 Packet 1
