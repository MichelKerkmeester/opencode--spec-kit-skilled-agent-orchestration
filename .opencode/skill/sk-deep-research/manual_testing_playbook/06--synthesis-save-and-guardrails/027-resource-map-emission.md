---
title: "DR-027 -- Research resource-map emission"
description: "Verify synthesis emits research/resource-map.md from converged deltas and honors the opt-out path."
---

# DR-027 -- Research resource-map emission

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-027`.

---

## 1. OVERVIEW

This scenario validates research resource-map emission for `DR-027`. The objective is to verify that synthesis emits `research/resource-map.md` from converged delta evidence, that the map preserves the template category structure, and that `--no-resource-map` disables the write cleanly.

### WHY THIS MATTERS

Operators need a scannable citation ledger after a long research loop. If the workflow only emits `research.md`, it is still hard to see which paths were repeatedly cited and which categories dominated the investigation.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic prose review. The scenario is only complete when the operator can explain both the default emission path and the opt-out behavior back to a user in plain language.

- Objective: Verify synthesis emits `research/resource-map.md` from converged research deltas.
- Real user request: When deep research converges, show me the flat citation ledger and confirm I can suppress it for one run.
- RCAF Prompt: `As a manual-testing orchestrator, validate the research resource-map emission contract for sk-deep-research against the current command entrypoint, YAML workflow, reducer, shared extractor, and docs. Verify synthesis emits research/resource-map.md from delta evidence, the map carries per-file citation counts in a template-shaped output, and --no-resource-map disables the write cleanly. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the docs and workflow first, then run the shared extractor or reducer emission path on representative deltas, then exercise the opt-out branch.
- Desired user-visible outcome: The user is told where `resource-map.md` appears, what it summarizes, and how to skip it.
- Expected signals: The synthesis workflow contains an emission step, the reducer supports `--emit-resource-map`, the shared extractor renders template categories with citation counts, and config opt-out skips cleanly.
- Pass/fail posture: PASS if emission and opt-out both work as documented; FAIL if synthesis omits the map, produces malformed categories, or writes a file when opt-out is set.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the workflow contract is checked before the direct emission path.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short operator-facing explanation, not just raw implementation notes.

### Prompt

As a manual-testing orchestrator, validate the research resource-map emission contract for sk-deep-research against the current command entrypoint, YAML workflow, reducer, shared extractor, and docs. Verify synthesis emits research/resource-map.md from delta evidence, the map carries per-file citation counts in a template-shaped output, and --no-resource-map disables the write cleanly. Return a concise operator-facing verdict.

### Commands

1. `bash: rg -n 'resource-map|no-resource-map|emit-resource-map' .opencode/command/spec_kit/deep-research.md .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: rg -n 'resource_map|resource-map|emit-resource-map' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
3. `bash: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> --emit-resource-map`
4. `bash: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> --emit-resource-map` with `deep-research-config.json` edited to `"resource_map": { "emit": false }`

### Expected

Synthesis emits `research/resource-map.md`, the output uses the ten-category template skeleton with per-file citation notes, and opt-out skips the write without error.

### Evidence

Capture the command-doc opt-out mention, the YAML synthesis emission step, the reducer `--emit-resource-map` path, and the emitted or skipped output behavior.

### Pass/Fail

PASS if research synthesis emits the map by default and skips it cleanly when opt-out is set; FAIL if the map is malformed, missing, or still written under opt-out.

### Failure Triage

Privilege the YAML synthesis step and reducer behavior over secondary docs if they disagree.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated research protocol, and scenario summary |
| `feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | Matching feature entry for the convergence-time emission contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/deep-research.md` | Command entrypoint; opt-out and emitted-artifact contract |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Autonomous synthesis emission step |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Confirm-mode synthesis emission step |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Reducer flag handling and write path |
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Shared template renderer and research-shape adapter |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Focused regression coverage for the emitted output shape |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DR-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/027-resource-map-emission.md`
- Feature catalog entry: `feature_catalog/01--loop-lifecycle/06-resource-map-emission.md`
