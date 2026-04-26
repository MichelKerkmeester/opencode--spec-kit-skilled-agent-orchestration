---
title: "DRV-027 -- Final synthesis memory save and guardrail behavior"
description: "Verify memory save via generate-context.js after review completion, LEAF-only agent enforcement, and the boundary between live and reference-only features."
---

# DRV-027 -- Final synthesis memory save and guardrail behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-027`.

---

## 1. OVERVIEW

This scenario validates final synthesis memory save and guardrail behavior for `DRV-027`. The objective is to verify that after review completion, context is saved via `generate-context.js`, the runtime agent remains LEAF-only, and the boundary between live executable behavior and reference-only features is maintained.

### WHY THIS MATTERS

This is the operator-facing endgame: the review loop should produce its canonical report, save context through the supported script, and avoid promising orchestration features that are still only documented for future work. Memory save ensures review findings persist across sessions, while LEAF-only enforcement prevents the agent from escalating beyond its intended scope.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify memory save via generate-context.js after review completion.
- Real user request: When the review loop finishes, how are the results preserved for future sessions, and what guardrails prevent the agent from doing more than it should?
- Prompt: `As a manual-testing orchestrator, validate the finalization and guardrail contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical review/review-report.md, memory save uses generate-context.js (not manual Write tool), the runtime agent remains LEAF-only (no sub-agent dispatch), and that the review agent does not modify target files under review (read-only contract). Return a concise operator-facing verdict.`
- Expected execution process: Inspect the command and skill save rules first, then the runtime agent LEAF-only boundary, then the SKILL.md rules for read-only and memory save contracts.
- Desired user-facing outcome: The user is told what final artifacts are produced, how memory is preserved, and what the agent is prevented from doing.
- Expected signals: Synthesis produces `review/review-report.md`, memory save calls `generate-context.js`, the runtime agent forbids nested delegation (LEAF-only), the agent never modifies files under review (read-only), and memory save uses the spec folder established at setup.
- Pass/fail posture: PASS if finalization and memory save use the supported contract and LEAF-only plus read-only behavior remain enforced; FAIL if memory is saved via Write tool, the agent dispatches sub-agents, or target files are modified.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the finalization and guardrail contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical review/review-report.md, memory save uses generate-context.js (not manual Write tool), the runtime agent remains LEAF-only (no sub-agent dispatch), and that the review agent does not modify target files under review (read-only contract). Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'generate-context.js|memory.*save|synthesis_complete|review-report|memory' .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md`
2. `bash: rg -n 'LEAF-only|Task tool|NEVER.*sub|NEVER.*dispatch|read.only|NEVER.*modify|observation.*only' .claude/agents/deep-review.md .codex/agents/deep-review.toml .opencode/skill/sk-deep-review/SKILL.md`
3. `bash: rg -n 'phase_synthesis|phase_save|generate-context.js|synthesis_complete|memory_save|review-report' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
### Expected
Synthesis produces `review/review-report.md`, memory save calls `generate-context.js`, agent is LEAF-only, target files are read-only.
### Evidence
Capture the synthesis/save contract, the LEAF-only prohibition from agent definitions, and the read-only rule from SKILL.md.
### Pass/Fail
PASS if finalization and memory save use the supported contract and LEAF-only plus read-only behavior remain enforced; FAIL if memory is saved via Write tool, the agent dispatches sub-agents, or target files are modified.
### Failure Triage
Privilege the agent definitions for LEAF-only behavior and the skill rules for read-only and memory save contracts.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/deep-review.md` | Command entrypoint; synthesis and memory integration contract |
| `.opencode/skill/sk-deep-review/SKILL.md` | Memory save rule (Rule 8), read-only rule (Rule 9), LEAF-only rule (NEVER 1); use `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/README.md` | Feature summary for memory save and guardrails |
| `.claude/agents/deep-review.md` | Claude runtime agent; LEAF-only enforcement and tool permissions |
| `.codex/agents/deep-review.toml` | Codex runtime agent; LEAF-only enforcement and tool permissions |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Final synthesis/save steps and workflow events |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Final synthesis/save steps and workflow events |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
