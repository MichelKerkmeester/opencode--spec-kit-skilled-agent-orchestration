---
title: "DR-017 -- Malformed JSONL lines are skipped with defaults"
description: "Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop."
---

# DR-017 -- Malformed JSONL lines are skipped with defaults

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-017`.

---

## 1. OVERVIEW

This scenario validates malformed jsonl lines are skipped with defaults for `DR-017`. The objective is to verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.

### WHY THIS MATTERS

Partial state corruption should degrade gracefully so the session can still continue or recover.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.
- Real user request: If one line in the JSONL is broken, I want to know whether the whole loop dies or keeps going safely.
- Prompt: `As a manual-testing orchestrator, validate the JSONL fault-tolerance contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed lines are skipped, missing fields are defaulted, and a warning is emitted instead of crashing the loop. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the state-format fault-tolerance rules, then the convergence reader guidance, then the README troubleshooting notes.
- Desired user-facing outcome: The user is told that malformed JSONL lines are handled defensively and do not automatically kill the loop.
- Expected signals: Per-line parse protection exists, defaults are specified, skipped-line warnings are documented, and convergence operates on valid entries only.
- Pass/fail posture: PASS if malformed lines are skipped with documented defaults and warnings; FAIL if the contract implies full-loop failure for any parse error.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the JSONL fault-tolerance contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed lines are skipped, missing fields are defaulted, and a warning is emitted instead of crashing the loop. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'Fault Tolerance|skip malformed|defaults|Warning:' .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: rg -n 'missing_newInfoRatio|malformed|skipped' .opencode/skill/sk-deep-research/references/state_format.md`
3. `bash: rg -n 'State file corrupt|Validate JSONL' .opencode/skill/sk-deep-research/README.md`
### Expected
Per-line parse protection exists, defaults are specified, skipped-line warnings are documented, and convergence operates on valid entries only.
### Evidence
Capture the defensive parse rules, the default values, and the troubleshooting guidance.
### Pass/Fail
PASS if malformed lines are skipped with documented defaults and warnings; FAIL if the contract implies full-loop failure for any parse error.
### Failure Triage
Use the state-format reference as the primary source and the convergence reference as secondary confirmation of valid-entry-only behavior.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/state_format.md` | Fault tolerance and event schema; use `ANCHOR:state-log` |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Defensive JSONL reading; use `ANCHOR:signal-definitions` |
| `.opencode/skill/sk-deep-research/README.md` | Troubleshooting language; use `ANCHOR:troubleshooting` |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DR-017
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
