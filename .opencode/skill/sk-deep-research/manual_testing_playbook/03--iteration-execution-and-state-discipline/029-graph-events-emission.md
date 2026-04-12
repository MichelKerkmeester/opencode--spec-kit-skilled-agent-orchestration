---
title: "DR-029 -- Research iterations emit structured graphEvents"
description: "Verify that research iteration records carry a graphEvents array with question_node, finding_node, and source_node entries."
---

# DR-029 -- Research iterations emit structured graphEvents

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-029`.

---

## 1. OVERVIEW

This scenario validates structured graph event emission for `DR-029`. The objective is to verify that a running deep research iteration writes a `graphEvents` array that includes research graph nodes such as `question_node`, `finding_node`, and `source_node`.

### WHY THIS MATTERS

Graph-aware convergence depends on replayable graph data from iteration records. If research iterations do not persist structured graph events, reducers and graph tooling cannot reconstruct question-to-finding-to-source coverage, and graph-aware stop analysis degrades to missing-data behavior.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Research iterations emit structured graphEvents.
- Given: A running deep research iteration.
- When: The iteration completes with findings.
- Then: The JSONL record contains a `graphEvents` array with `question_node`, `finding_node`, and `source_node` entries.
- Real user request: When a research iteration finishes, what graph data gets written into state so convergence and tooling can replay it later?
- Prompt: `As a manual-testing orchestrator, validate the structured graphEvents contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware research convergence expects graphEvents in iteration records, and that the graph replay tests show research JSONL records carrying question_node, finding_node, and source_node entries. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the deep-research convergence reference for the graph-aware iteration-record contract first, then the coverage-graph replay tests for concrete research node types and JSONL-shaped examples.
- Desired user-facing outcome: The user understands that completed research iterations emit replayable graph events and which research node types are expected in those records.
- Expected signals: `graphEvents` referenced as iteration-record input for graph-aware convergence; replay tests include `kind: "node"` entries for `question_node`, `finding_node`, and research node-type coverage including `source_node`.
- Pass/fail posture: PASS if the convergence reference and graph replay tests agree that completed research iterations carry `graphEvents` and that research node types include `question_node`, `finding_node`, and `source_node`; FAIL if the record contract is absent or the replay tests do not cover those node types.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level test contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-029 | Research iterations emit structured graphEvents | Verify completed research iterations emit `graphEvents` with `question_node`, `finding_node`, and `source_node` coverage. | As a manual-testing orchestrator, validate the structured graphEvents contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware research convergence expects graphEvents in iteration records, and that the graph replay tests show research JSONL records carrying question_node, finding_node, and source_node entries. Return a concise operator-facing verdict. | 1. `bash: rg -n 'graphEvents|iteration records|graph-aware convergence' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'graphEvents|question_node|finding_node' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` -> 3. `bash: rg -n 'graphEvents|researchNodeTypes|question_node|finding_node|source_node' .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` | `graphEvents` used as iteration-record input; replay tests show `question_node` and `finding_node` entries; research node-type coverage includes `source_node`. | Capture the convergence reference lines that describe `graphEvents` in iteration records, a replay-test record with `graphEvents`, and the research node-type list that includes `source_node`. | PASS if the convergence reference and replay tests agree that completed research iterations emit `graphEvents` and that research graph node coverage includes `question_node`, `finding_node`, and `source_node`; FAIL if any of those pieces are missing or contradictory. | Privilege the convergence reference for the contract and the replay tests for concrete JSONL-shaped evidence. If the node-type list and replay examples diverge, treat the tests as implementation truth and flag doc drift. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Graph-aware research convergence contract; documents `graphEvents` as iteration-record input |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | Replay tests showing JSONL-shaped `graphEvents` examples with `question_node` and `finding_node` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` | Coverage-graph replay tests; research node-type coverage includes `source_node` |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-029
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/029-graph-events-emission.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-10.
