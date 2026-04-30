---
title: "Memory save"
description: "Refreshes the deep research continuity artifact through the supported generate-context.js save path."
---

# Memory save

## 1. OVERVIEW

Refreshes the deep research continuity artifact through the supported `generate-context.js` save path.

Memory save is the loop's final preservation step. It hands the finished packet to the broader continuity system without making the research workflow responsible for ad hoc memory authoring.

---

## 2. CURRENT REALITY

The live save contract is narrow. After synthesis, the workflows call `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json {spec_folder}` and treat that command as the supported save boundary. The loop does not define an additional indexing phase inside its own contract.

The save rules also reject manual writes under `memory/`. The command entrypoint and YAML workflows explicitly mark hand-authored continuity artifacts as unsupported for this path. The workflow expects the save script to produce the support artifact and then verifies the result instead of building those files itself.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/command/spec_kit/deep-research.md` | Command | Defines the save phase and memory integration notes for the command entrypoint. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference | Defines the save phase and its verification step. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Runs `generate-context.js` in autonomous mode and marks manual memory authoring as invalid. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Runs the same save flow with confirm-mode review gates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md` | Manual playbook | Verifies the save phase uses the supported continuity path after synthesis. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Vitest | Verifies the command assets stay aligned on reducer execution and canonical deep-research packet references. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/05-memory-save.md`
