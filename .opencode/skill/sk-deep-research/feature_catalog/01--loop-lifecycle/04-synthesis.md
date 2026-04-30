---
title: "Synthesis"
description: "Compiles iteration findings into the canonical research output and closes the loop state."
---

# Synthesis

## 1. OVERVIEW

Compiles iteration findings into the canonical research output and closes the loop state.

Synthesis is the workflow-owned consolidation pass at the end of research. It turns the iteration trail into the final research document and records that the loop reached its terminal content state.

---

## 2. CURRENT REALITY

The synthesis phase reads every iteration file plus the final strategy state, then writes the canonical `research/research.md` document in the standard 17-section format. This phase owns deduplication and final organization even when progressive synthesis has already been updating the file during earlier iterations.

Negative knowledge is part of the live contract here. Synthesis must consolidate `ruledOut` entries and `Dead Ends` sections into a required `Eliminated Alternatives` table. It also updates the config status to `complete` and appends a `synthesis_complete` event so later tooling can tell the packet has reached terminal synthesis.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference | Defines the synthesis phase steps, required output shape, and terminal event contract. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Reference | Defines the `research/research.md` lifecycle and progressive update rules. |
| `.opencode/command/spec_kit/deep-research.md` | Command | Publishes the synth phase as a canonical command output. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Drives the autonomous synthesis phase and config-status update. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Mirrors the same synthesis phase with confirm-mode review gates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md` | Manual playbook | Verifies final synthesis and the handoff into save behavior. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md` | Manual playbook | Verifies negative knowledge is consolidated into the final research output. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/04-synthesis.md`
