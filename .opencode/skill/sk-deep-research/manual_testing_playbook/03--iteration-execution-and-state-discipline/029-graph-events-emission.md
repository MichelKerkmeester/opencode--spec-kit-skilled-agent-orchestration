---
title: "DR-029 -- Research iterations emit flat graphEvents"
description: "Verify that research iteration records carry a graphEvents array using the current flat type-based schema (`question`, `finding`, `source`, `edge`)."
---

# DR-029 -- Research iterations emit flat graphEvents

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-029`.

---

## 1. OVERVIEW

This scenario validates the current flat graph-event emission contract for `DR-029`. The objective is to verify that a running deep research iteration writes a `graphEvents` array that uses the shipped flat `type` schema (`question`, `finding`, `source`, `edge`) rather than the older nested `kind/nodeType` form.

### WHY THIS MATTERS

Graph-aware convergence depends on replayable graph data from iteration records. If research iterations do not persist structured graph events, reducers and graph tooling cannot reconstruct question-to-finding-to-source coverage, and graph-aware stop analysis degrades to missing-data behavior.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Research iterations emit flat graphEvents.
- Given: A running deep research iteration.
- When: The iteration completes with findings.
- Then: The JSONL record contains a `graphEvents` array with flat `type` entries such as `question`, `finding`, `source`, and `edge`.
- Real user request: When a research iteration finishes, what flat graph-event payload gets written into state so convergence and tooling can replay it later?
- Prompt: `As a manual-testing orchestrator, validate the flat graphEvents contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware research convergence expects graphEvents in iteration records, and that the shipped state-format contract plus active graph tests use flat event types such as question, finding, source, and edge rather than question_node/finding_node wrappers. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the deep-research state-format graph-events section first, then the convergence reference for how iteration-record graphEvents are consumed, then the active coverage-graph tests for the flat node types in use now.
- Desired user-facing outcome: The user understands that completed research iterations emit replayable flat graph events and which event types are expected in those records.
- Expected signals: `graphEvents` documented as iteration-record input for graph-aware convergence; the state-format example uses flat `type` values; active graph tests use `question`, `finding`, and `source` node types rather than `question_node` / `finding_node` wrappers.
- Pass/fail posture: PASS if the state-format contract, convergence reference, and active graph tests agree that completed research iterations carry flat `graphEvents`; FAIL if the record contract is absent or still points at the older nested schema.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level test contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-029 | Research iterations emit flat graphEvents | Verify completed research iterations emit `graphEvents` with flat `type` coverage (`question`, `finding`, `source`, `edge`). | As a manual-testing orchestrator, validate the flat graphEvents contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware research convergence expects graphEvents in iteration records, and that the shipped state-format contract plus active graph tests use flat event types such as question, finding, source, and edge rather than question_node/finding_node wrappers. Return a concise operator-facing verdict. | 1. `bash: rg -n 'graphEvents|Graph Events|type \\| \"question\"|type \\| \"finding\"|type \\| \"source\"|type \\| \"edge\"' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'graphEvents|iteration records|graph-aware convergence' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: rg -n \"type: 'question'|type: 'finding'|type: 'source'\" .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts` | `graphEvents` documented as iteration-record input; the state-format example uses flat `type` values; active graph tests use `question`, `finding`, and `source` node types. | Capture the state-format example row for `graphEvents`, the convergence reference lines that describe `graphEvents` in iteration records, and one active test snippet showing flat node types. | PASS if the state-format contract, convergence reference, and active graph tests agree that completed research iterations emit flat `graphEvents`; FAIL if any of those pieces are missing or still point at the older nested schema. | Privilege `references/state_format.md` for the payload contract, `references/convergence.md` for consumption semantics, and the active graph tests for implementation truth. If they diverge, treat the active tests plus state-format doc as current reality and flag any remaining nested-schema wording as drift. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical flat `graphEvents` payload example and field table |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Graph-aware research convergence contract; documents `graphEvents` as iteration-record input |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts` | Active graph tests using flat `question` / `finding` / `source` node types |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-029
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/029-graph-events-emission.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-10.
