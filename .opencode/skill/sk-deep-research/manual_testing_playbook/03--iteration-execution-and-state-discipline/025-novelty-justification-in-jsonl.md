---
title: "DR-025 -- Novelty justification present in JSONL"
description: "Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio."
---

# DR-025 -- Novelty justification present in JSONL

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-025`.

---

## 1. OVERVIEW

This scenario validates that novelty justification is present in JSONL iteration records for `DR-025`. The objective is to verify that every iteration record includes both `newInfoRatio` and a human-readable `noveltyJustification` field.

### WHY THIS MATTERS

A bare `newInfoRatio` number (e.g., 0.70) is opaque without context. The `noveltyJustification` field explains what the ratio means in concrete terms, enabling post-hoc analysis and helping operators and users understand whether the research is genuinely progressing or just re-covering familiar ground.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio.
- Real user request: How can I tell WHY the agent rated its findings as 70% new?
- Prompt: `As a manual-testing orchestrator, validate the novelty justification contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL iteration record schema requires both newInfoRatio and noveltyJustification, that the justification is a human-readable sentence, and that ALWAYS rule 11 and the agent Step 6 mandate their inclusion. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the state format for the noveltyJustification field definition, then SKILL.md ALWAYS rule 11, then the agent file Step 6 for the required fields list.
- Desired user-facing outcome: The user can inspect any JSONL iteration record and find a plain-language explanation of what the newInfoRatio represents.
- Expected signals: JSONL iteration records contain both `newInfoRatio` (number, 0.0-1.0) and `noveltyJustification` (string, human-readable sentence); the justification field is listed as required in v1.1.0 agent instructions; ALWAYS rule 11 mandates both fields.
- Pass/fail posture: PASS if the field schema, ALWAYS rule 11, and agent Step 6 all consistently require both fields and the justification is a human-readable sentence; FAIL if any source omits the requirement, or the field is defined as optional without enforcement.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the novelty justification contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL iteration record schema requires both newInfoRatio and noveltyJustification, that the justification is a human-readable sentence, and that ALWAYS rule 11 and the agent Step 6 mandate their inclusion. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'noveltyJustification\|Novelty Justification' .opencode/skill/sk-deep-research/references/state_format.md`
2. `bash: rg -n 'rule.*11\|novelty.*justification\|newInfoRatio.*novelty' .opencode/skill/sk-deep-research/SKILL.md`
3. `bash: rg -n 'noveltyJustification\|Required fields' .opencode/agent/deep-research.md`
### Expected
JSONL record has both `newInfoRatio` and `noveltyJustification` fields; justification is a human-readable sentence (e.g., "2 new findings on reconnection backoff, 1 refinement of prior keepalive finding"); field is listed as required in v1.1.0 agent instructions (Step 6); ALWAYS rule 11 mandates both.
### Evidence
Capture the state format field definition, SKILL.md ALWAYS rule 11 text, and agent Step 6 required fields list with the example JSONL record.
### Pass/Fail
PASS if the field schema, ALWAYS rule 11, and agent Step 6 all consistently require both fields and the justification is a human-readable sentence; FAIL if any source omits the requirement or defines the field as optional without enforcement.
### Failure Triage
Privilege the SKILL.md ALWAYS rules as the normative contract; use state_format.md for schema details and agent files for implementation enforcement. Note: state_format.md marks the field as `No` (not required) in the schema table but SKILL.md ALWAYS rule 11 and agent v1.1.0 instructions override this to required.
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
| `.opencode/skill/sk-deep-research/references/state_format.md` | State format; inspect `Novelty Justification` subsection under `ANCHOR:state-log` for field definition and example |
| `.opencode/skill/sk-deep-research/SKILL.md` | Skill rules; inspect ALWAYS rule 11: "Report newInfoRatio + 1-sentence novelty justification" |
| `.opencode/agent/deep-research.md` | Agent instructions; inspect Step 6 (Append State) for required fields (v1.1.0) including `noveltyJustification` |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-025
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
