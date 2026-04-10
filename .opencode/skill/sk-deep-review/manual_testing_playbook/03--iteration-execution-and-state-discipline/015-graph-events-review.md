---
title: "DRV-015 -- Review iterations emit graphEvents in JSONL"
description: "Verify that each review iteration emits graphEvents in its JSONL record, containing node and edge events that build the review coverage graph with dimension and file nodes."
---

# DRV-015 -- Review iterations emit graphEvents in JSONL

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-015`.

---

## 1. OVERVIEW

This scenario validates that review iterations emit graphEvents in JSONL records for `DRV-015`. The objective is to verify that every review iteration appends a `graphEvents` array to its JSONL record containing typed node events (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION) and edge events (COVERS, EVIDENCE_FOR, IN_DIMENSION, IN_FILE, CONTRADICTS, RESOLVES, CONFIRMS).

### WHY THIS MATTERS

The review coverage graph tracks which files and dimensions have been examined, which findings have evidence, and which remediations have been proposed. If review iterations do not emit graphEvents, the graph convergence layer (dimensionCoverage, findingStability) has no data and cannot enforce its STOP-blocking guards. The coverage graph is the structural backbone of the review's completeness claim.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that review iterations emit graphEvents in JSONL records.
- Real user request: When I run a deep review, how does it track which files and dimensions have been covered? Where does that tracking data live?
- Orchestrator prompt: Validate the graphEvents emission contract for sk-deep-review. Confirm that the state format defines graphEvents for review iterations with review-specific node types (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION) and edge types (COVERS, EVIDENCE_FOR, IN_DIMENSION, IN_FILE, CONTRADICTS, RESOLVES, CONFIRMS), that the agent instructions mandate their emission, and that the reducer can reconstruct review graph state from these events, then return a concise operator-facing verdict.
- Expected execution process: Inspect state_format.md for review graphEvents schema, then the review agent for emission mandate, then the TS DB types for node/edge type validation, then the reducer for graph reconstruction.
- Desired user-facing outcome: The user understands that each review iteration builds a portion of the coverage graph through structured graphEvents, using review-specific node and edge types that map to dimensions and files.
- Expected signals: graphEvents array in review JSONL records; review-specific node types: DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION; review-specific edge types: COVERS, EVIDENCE_FOR, IN_DIMENSION, IN_FILE; parseGraphEvents handles review events.
- Pass/fail posture: PASS if graphEvents are defined for review with review-specific types and are consumed by the reducer; FAIL if graphEvents use research-only types, are undocumented, or the reducer cannot parse them.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-015 | Review graph events emission | Verify review iterations emit graphEvents with review-specific node and edge types. | Validate the graphEvents emission contract for sk-deep-review. Confirm review-specific node types (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION) and edge types (COVERS, EVIDENCE_FOR, IN_DIMENSION, IN_FILE) are defined and consumed, then return a concise operator-facing verdict. | 1. `bash: rg -n 'graphEvents\|graph_events' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'graphEvents\|graph.*event\|coverage' .opencode/agent/deep-review.md` -> 3. `bash: rg -n 'DIMENSION\|FILE\|FINDING\|EVIDENCE\|REMEDIATION\|ReviewNodeKind' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` -> 4. `bash: rg -n 'COVERS\|EVIDENCE_FOR\|IN_DIMENSION\|IN_FILE\|ReviewRelation' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | Review-specific node types defined (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION); review-specific edge types defined (COVERS, EVIDENCE_FOR, IN_DIMENSION, IN_FILE); graphEvents emitted in review JSONL; reducer parses them. | Capture the TS type definitions for ReviewNodeKind and ReviewRelation, the state format graphEvents schema, and the agent emission mandate. | PASS if review-specific node/edge types are defined and graphEvents are mandated for review; FAIL if review uses research-only types or graphEvents are not emitted. | If graphEvents are absent from the review agent: check whether the orchestrator YAML adds them on the agent's behalf. If node types mismatch: check the TS DB VALID_KINDS.review definition. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/state_format.md` | Shared state format; graphEvents schema for both research and review |
| `.opencode/agent/deep-review.md` | Review agent instructions; graphEvents emission mandate |
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | TS DB layer; ReviewNodeKind, ReviewRelation type definitions, VALID_KINDS.review, VALID_RELATIONS.review |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; graphEvents handling in dispatch step |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/015-graph-events-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-04-10.
