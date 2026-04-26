---
title: "DRV-029 -- Review resource-map emission"
description: "Verify synthesis emits review/resource-map.md from converged deltas and honors the opt-out path."
---

# DRV-029 -- Review resource-map emission

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-029`.

---

## 1. OVERVIEW

This scenario validates review resource-map emission for `DRV-029`. The objective is to verify that synthesis emits `review/resource-map.md` from converged delta evidence, that the map preserves the template category structure, and that `--no-resource-map` disables the write cleanly.

### WHY THIS MATTERS

Operators need a fast blast-radius view after a long review loop. If the workflow only emits `review-report.md`, reviewers still have to reconstruct which files carried active findings and which files were validated cleanly.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic prose review. The scenario is only complete when the operator can explain both the default emission path and the opt-out behavior back to a user in plain language.

- Objective: Verify synthesis emits `review/resource-map.md` from converged review deltas.
- Real user request: When deep review converges, show me the flat file ledger and confirm I can suppress it for one run.
- Prompt: `As a manual-testing orchestrator, validate the review resource-map emission contract for sk-deep-review against the current command entrypoint, YAML workflow, reducer, shared extractor, and docs. Verify synthesis emits review/resource-map.md from delta evidence, the map carries per-file P0/P1/P2 counts in a template-shaped output, and --no-resource-map disables the write cleanly. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the docs and workflow first, then run the shared extractor or reducer emission path on representative deltas, then exercise the opt-out branch.
- Desired user-facing outcome: The user is told where `resource-map.md` appears, what it summarizes, and how to skip it.
- Expected signals: The synthesis workflow contains an emission step, the reducer supports `--emit-resource-map`, the shared extractor renders template categories with finding counts, and config opt-out skips cleanly.
- Pass/fail posture: PASS if emission and opt-out both work as documented; FAIL if synthesis omits the map, produces malformed categories, or writes a file when opt-out is set.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the workflow contract is checked before the direct emission path.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short operator-facing explanation, not just raw implementation notes.

### Prompt

As a manual-testing orchestrator, validate the review resource-map emission contract for sk-deep-review against the current command entrypoint, YAML workflow, reducer, shared extractor, and docs. Verify synthesis emits review/resource-map.md from delta evidence, the map carries per-file P0/P1/P2 counts in a template-shaped output, and --no-resource-map disables the write cleanly. Return a concise operator-facing verdict.

### Commands

1. `bash: rg -n 'resource-map|no-resource-map|emit-resource-map' .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/references/convergence.md`
2. `bash: rg -n 'resource_map|resource-map|emit-resource-map' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml .opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
3. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> --emit-resource-map`
4. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> --emit-resource-map` with `deep-review-config.json` edited to `"resource_map": { "emit": false }`

### Expected

Synthesis emits `review/resource-map.md`, the output uses the ten-category template skeleton with per-file P0/P1/P2 notes, and opt-out skips the write without error.

### Evidence

Capture the command-doc opt-out mention, the YAML synthesis emission step, the reducer `--emit-resource-map` path, and the emitted or skipped output behavior.

### Pass/Fail

PASS if review synthesis emits the map by default and skips it cleanly when opt-out is set; FAIL if the map is malformed, missing, or still written under opt-out.

### Failure Triage

Privilege the YAML synthesis step and reducer behavior over secondary docs if they disagree.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | Matching feature entry for the convergence-time emission contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/deep-review.md` | Command entrypoint; opt-out and emitted-artifact contract |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Autonomous synthesis emission step |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Confirm-mode synthesis emission step |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Reducer flag handling and write path |
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Shared template renderer and review-shape adapter |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Focused regression coverage for the emitted output shape |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/029-resource-map-emission.md`
- Feature catalog entry: `feature_catalog/01--loop-lifecycle/06-resource-map-emission.md`
