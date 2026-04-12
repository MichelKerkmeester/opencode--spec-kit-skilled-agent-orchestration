---
title: "DRV-015 -- Review iterations emit structured graphEvents"
description: "Verify that review iteration records carry a graphEvents array with dimension_node, file_node, and finding_node entries."
---

# DRV-015 -- Review iterations emit structured graphEvents

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-015`.

---

## 1. OVERVIEW

This scenario validates structured graph event emission for `DRV-015`. The objective is to verify that a running deep review iteration writes a `graphEvents` array that includes review graph nodes such as `dimension_node`, `file_node`, and `finding_node`.

### WHY THIS MATTERS

Graph-aware review convergence depends on replayable iteration-level graph data. If review iterations do not persist structured graph events, graph-assisted coverage analysis cannot confirm which dimensions touched which files or whether findings are connected to evidence.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Review iterations emit structured graphEvents.
- Given: A running deep review iteration.
- When: The iteration completes with P0/P1/P2 findings.
- Then: The JSONL record contains `graphEvents` with `dimension_node`, `file_node`, and `finding_node` entries.
- Real user request: When a review iteration finishes, what graph data is written so coverage and convergence can replay the review state?
- Prompt: `As a manual-testing orchestrator, validate the structured graphEvents contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware review convergence expects graphEvents in iteration records, and that graph replay tests show review JSONL records carrying dimension_node, file_node, and finding_node entries. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the deep-review convergence reference for the graph-aware iteration-record contract first, then the coverage-graph replay tests for concrete review node types and JSONL-shaped examples.
- Desired user-facing outcome: The user understands that completed review iterations emit replayable graph events and which review node types are expected in those records.
- Expected signals: `graphEvents` referenced as iteration-record input for graph-aware review convergence; replay tests include review node-type coverage for `dimension_node`, `file_node`, and `finding_node`.
- Pass/fail posture: PASS if the convergence reference and graph replay tests agree that completed review iterations carry `graphEvents` and that review node types include `dimension_node`, `file_node`, and `finding_node`; FAIL if the record contract is absent or replay coverage is missing.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level test contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the structured graphEvents contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware review convergence expects graphEvents in iteration records, and that graph replay tests show review JSONL records carrying dimension_node, file_node, and finding_node entries. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'graphEvents|review iteration records|graph-aware review convergence' .opencode/skill/sk-deep-review/references/convergence.md`
2. `bash: rg -n 'graphEvents|dimension_node|file_node|finding_node|reviewNodeTypes' .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts`
3. `bash: rg -n 'graphEvents|finding_node' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts`
### Expected
`graphEvents` used as iteration-record input; replay tests show review node-type coverage including `dimension_node`, `file_node`, and `finding_node`.
### Evidence
Capture the convergence reference lines that describe `graphEvents` in review iteration records, the review node-type list, and one replay example showing JSONL-shaped `graphEvents`.
### Pass/Fail
PASS if the convergence reference and replay tests agree that completed review iterations emit `graphEvents` and that review graph node coverage includes `dimension_node`, `file_node`, and `finding_node`; FAIL if any of those pieces are missing or contradictory.
### Failure Triage
Privilege the convergence reference for the contract and the replay tests for concrete review node-type evidence.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-review/references/convergence.md` | Graph-aware review convergence contract; documents `graphEvents` as iteration-record input |
| `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` | Coverage-graph replay tests; review node-type coverage includes `dimension_node`, `file_node`, and `finding_node` |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | Replay tests with JSONL-shaped `graphEvents` examples used by graph reducers |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/015-graph-events-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-04-10.
