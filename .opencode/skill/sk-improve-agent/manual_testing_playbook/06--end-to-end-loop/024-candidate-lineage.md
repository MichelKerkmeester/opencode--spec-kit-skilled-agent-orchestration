---
title: "E2E-024 -- Candidate Lineage Graph Tracking"
description: "Manual validation scenario for E2E-024: Candidate Lineage Graph Tracking."
feature_id: "E2E-024"
category: "End-to-End Loop"
---

# E2E-024 -- Candidate Lineage Graph Tracking

This document captures the canonical manual-testing contract for `E2E-024`.

---

## 1. OVERVIEW

This scenario validates that the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Candidate Lineage Graph Tracking for the full improvement-loop and candidate-tracking scenarios.
- Real user request: `Validate that the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references.`
- RCAF Prompt: `As a manual-testing orchestrator, validate that the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Candidate lineage graph created with per-session node entries. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the documented command sequence exactly as written; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Candidate lineage graph created with per-session node entries; Each candidate node stores: session-id, wave-index (default 0 for single-wave), spawning mutation type, parent node reference; Root candidates have null parent; subsequent candidates reference their predecessor; Lineage is traversable from root to leaf (full candidate history); Session-id isolation: lineage from different sessions does not cross-contaminate; When parallel waves are enabled: multiple candidates per iteration with distinct wave indices
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: After a 3-iteration improvement run, the candidate lineage graph contains 3 nodes (one per iteration), each with the correct session-id and wave-index (0 for single-wave mode), and the lineage is traversable from the first candidate to the last via parent references.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| E2E-024 | Candidate Lineage Graph Tracking | Validate Candidate Lineage Graph Tracking | `As a manual-testing orchestrator, validate that the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Candidate lineage graph created with per-session node entries. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | /improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder=specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --iterations=3 | Candidate lineage graph created with per-session node entries; Each candidate node stores: session-id, wave-index (default 0 for single-wave), spawning mutation type, parent node reference; Root candidates have null parent; subsequent candidates reference their predecessor; Lineage is traversable from root to leaf (full candidate history); Session-id isolation: lineage from different sessions does not cross-contaminate; When parallel waves are enabled: multiple candidates per iteration with distinct wave indices | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | After a 3-iteration improvement run, the candidate lineage graph contains 3 nodes (one per iteration), each with the correct session-id and wave-index (0 for single-wave mode), and the lineage is traversable from the first candidate to the last via parent references. | If no lineage graph is created: verify that `candidate-lineage.cjs` is invoked by the orchestrator after each candidate evaluation<br>If parent references are null for all candidates: check that the orchestrator passes the previous candidate&#x27;s node ID as the parent parameter<br>If session-id is missing: verify the session-id is passed through from the config/resume mechanism<br>If wave-index is wrong: for single-wave mode, all candidates should have wave-index 0; check that the default is applied correctly<br>If parallel wave candidates appear in single-wave mode: verify the `parallelWaves.enabled: false` gate is respected |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output showing lineage nodes with parent references and session IDs]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `06--end-to-end-loop/024-candidate-lineage.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: End-to-End Loop
- Playbook ID: E2E-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--end-to-end-loop/024-candidate-lineage.md`
