---
title: "DR-019 -- Final synthesis plus memory save and guardrail behavior"
description: "Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features."
---

# DR-019 -- Final synthesis plus memory save and guardrail behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-019`.

---

## 1. OVERVIEW

This scenario validates final synthesis plus memory save and guardrail behavior for `DR-019`. The objective is to verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features.

### WHY THIS MATTERS

This is the operator-facing endgame: the loop should produce canonical output, save context through the supported script, and avoid promising orchestration features that are still only documented for future work.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features.
- Real user request: When the research loop finishes, tell me what it saves, how memory is preserved, and which advanced behaviors are still only design notes.
- Orchestrator prompt: Validate the finalization and guardrail contract for sk-deep-research. Confirm that synthesis produces canonical research/research.md, memory save uses generate-context.js, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, :restart segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees, then return a concise operator verdict.
- Expected execution process: Inspect the command and skill save rules first, then the runtime agent LEAF-only boundary, then the loop protocol and state-format references for reference-only features.
- Desired user-facing outcome: The user is told what final artifacts are produced, how memory is preserved, and which advanced ideas are not yet part of the live executable contract.
- Expected signals: Synthesis produces canonical `research/research.md`, memory save calls `generate-context.js`, the Codex runtime agent forbids nested delegation, and wave orchestration, checkpoint commits, segment transitions, and alternate CLI dispatch remain reference-only.
- Pass/fail posture: PASS if finalization and memory save use the supported contract, LEAF-only behavior remains enforced, and reference-only features are clearly documented as non-live; FAIL if any non-live feature is presented as a shipped executable guarantee.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-019 | Final synthesis plus memory save and guardrail behavior | Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features. | Validate the finalization and guardrail contract for sk-deep-research. Confirm that synthesis produces canonical `research/research.md`, memory save uses `generate-context.js`, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, `:restart` segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees, then return a concise operator verdict. | 1. `bash: rg -n 'generate-context.js|synthesis_complete|research/research.md|memory' .opencode/command/spec_kit/deep-research.md .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-research/README.md` -> 2. `bash: rg -n 'LEAF-only|Task tool|NEVER create sub-tasks|reference-only|Wave orchestration|Checkpoint Commit|Direct Mode Fallback|Segment Model' .codex/agents/deep-research.toml .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: rg -n 'phase_synthesis|phase_save|generate-context.js|synthesis_complete|wave|segment|direct_mode' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/skill/sk-deep-research/references/quick_reference.md` | Synthesis produces canonical `research/research.md`, memory save calls `generate-context.js`, the Codex runtime agent forbids nested delegation, and wave orchestration, checkpoint commits, segment transitions, and alternate CLI dispatch remain reference-only. | Capture the final synthesis/save contract, the runtime LEAF-only prohibition, and the reference-only feature markings in one evidence set. | PASS if finalization and memory save use the supported contract, LEAF-only behavior remains enforced, and reference-only features are clearly documented as non-live; FAIL if any non-live feature is presented as a shipped executable guarantee. | Privilege the Codex runtime agent and skill rules for LEAF-only behavior, and the loop/state references for reference-only boundaries. |

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
| `.opencode/command/spec_kit/deep-research.md` | Synthesis and memory integration contract; use `## 5. OUTPUT FORMATS`, `## 6. MEMORY INTEGRATION`, and `## 10. ERROR HANDLING` |
| `.opencode/skill/sk-deep-research/SKILL.md` | Supported save path and reference-only features; use `ANCHOR:rules` |
| `.opencode/skill/sk-deep-research/README.md` | User-facing reference-only notes and FAQ; use `ANCHOR:overview`, `ANCHOR:faq`, and `ANCHOR:related-documents` |
| `.codex/agents/deep-research.toml` | Canonical runtime guardrails; inspect `## 0. ILLEGAL NESTING (HARD BLOCK)` and `SPEC FOLDER PERMISSION` |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference-only wave, checkpoint, and direct-mode sections; use `ANCHOR:phase-iteration-loop` and `ANCHOR:wave-orchestration-protocol` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Reference-only segment model and active events; use `ANCHOR:state-log` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Final synthesis/save steps and workflow events |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Final synthesis/save steps and workflow events |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Reference-only notes; use `Reference-Only Notes` under `ANCHOR:state-files` |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DR-019
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
