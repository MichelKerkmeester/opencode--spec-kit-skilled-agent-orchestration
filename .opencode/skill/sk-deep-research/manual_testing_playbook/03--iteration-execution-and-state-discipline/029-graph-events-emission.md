---
title: "DR-029 -- Graph events emission in JSONL iteration records"
description: "Verify that each research iteration emits graphEvents in its JSONL record, containing node and edge events that build the semantic coverage graph."
---

# DR-029 -- Graph events emission in JSONL iteration records

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-029`.

---

## 1. OVERVIEW

This scenario validates that graphEvents are emitted in JSONL iteration records for `DR-029`. The objective is to verify that every research iteration appends a `graphEvents` array to its JSONL record containing typed node events (with id, nodeType, label) and edge events (with source, target, relation, weight).

### WHY THIS MATTERS

The semantic coverage graph is built incrementally from iteration JSONL records. If iterations do not emit graphEvents, the graph cannot be reconstructed from the JSONL authority chain, breaking the fallback authority order (JSONL first, local JSON second, MCP/SQLite third). Without graph events, convergence guards (sourceDiversity, evidenceDepth) have no data and the coverage graph degrades to empty.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that research iterations emit graphEvents in JSONL records.
- Real user request: When I run a deep research loop, does each iteration contribute to the coverage graph? Where does the graph data come from?
- Orchestrator prompt: Validate the graphEvents emission contract for sk-deep-research. Confirm that the state format defines graphEvents as an array of node/edge events in iteration records, that the agent instructions (Step 6) mandate their inclusion, and that the reducer parseGraphEvents function can reconstruct graph state from JSONL records, then return a concise operator-facing verdict.
- Expected execution process: Inspect state_format.md for the graphEvents schema, then the agent file for Step 6 instructions, then the reducer for parseGraphEvents.
- Desired user-facing outcome: The user understands that each iteration builds a portion of the coverage graph through structured graphEvents in JSONL, and that this data feeds convergence guards.
- Expected signals: graphEvents array in JSONL iteration records; node events with {kind: "node", id, nodeType, label}; edge events with {kind: "edge", source, target, relation, weight}; parseGraphEvents reconstructs graph from these events.
- Pass/fail posture: PASS if state_format.md defines graphEvents, agent instructions mandate emission, and parseGraphEvents successfully reconstructs graph state from JSONL; FAIL if graphEvents are undocumented, optional without enforcement, or parseGraphEvents cannot handle the schema.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-029 | Graph events emission in JSONL | Verify research iterations emit graphEvents in JSONL records. | Validate the graphEvents emission contract for sk-deep-research. Confirm that graphEvents are defined in the state format, mandated by agent instructions, and consumed by the reducer's parseGraphEvents, then return a concise operator-facing verdict. | 1. `bash: rg -n 'graphEvents\|graph_events\|graphEvent' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'graphEvents\|graph.*event\|coverage.*graph' .opencode/agent/deep-research.md` -> 3. `bash: rg -n 'parseGraphEvents\|graphEvents' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` -> 4. `bash: rg -n 'graphEvents' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | graphEvents array in JSONL; node events {kind: "node", id, nodeType, label}; edge events {kind: "edge", source, target, relation, weight}; parseGraphEvents function exists and handles the schema. | Capture the state format graphEvents definition, agent Step 6 emission mandate, and parseGraphEvents test evidence. | PASS if graphEvents defined, mandated, and parseable; FAIL if undefined, optional, or parseGraphEvents cannot handle them. | Privilege state_format.md for the schema contract; use agent instructions for the emission mandate; use test files for parseGraphEvents evidence. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/state_format.md` | State format; graphEvents schema definition in iteration record |
| `.opencode/agent/deep-research.md` | Agent instructions; Step 6 (Append State) must include graphEvents |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | Integration tests; parseGraphEvents function contract verification |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; graphEvents handling in dispatch and convergence steps |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-029
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/029-graph-events-emission.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-10.
