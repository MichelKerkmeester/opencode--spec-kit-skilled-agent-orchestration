---
title: "Initialization"
description: "Sets up the deep research packet, canonical state files, and lineage mode before the loop begins."
---

# Initialization

## 1. OVERVIEW

Sets up the deep research packet, canonical state files, and lineage mode before the loop begins.

Initialization is the workflow-owned entry into a research session. It creates the packet directory, seeds the state surfaces that the LEAF agent will read later, and decides whether the run is a fresh start, a resume, or a restart.

---

## 2. CURRENT REALITY

The live initialization contract classifies the packet state before it writes anything. It distinguishes fresh state, resumable state, completed-session state, and invalid state. Fresh runs create `research/deep-research-config.json`, the first JSONL line in `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`, and `research/findings-registry.json`. Confirm mode adds a charter review gate before the first iteration continues.

Lineage handling is narrower than some older drafts. The runtime supports `new`, `resume`, and `restart`. Resume keeps the same session identifier and appends a typed `resumed` event. Restart archives the old research tree, mints a fresh session identifier, increments generation, and appends a typed `restarted` event. `fork` and `completed-continue` remain documented references, but they are not exposed as live modes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/command/spec_kit/deep-research.md` | Command | Defines the init phase inputs, packet outputs, and setup contract before the YAML workflow loads. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Creates canonical state files and applies the autonomous initialization path. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Mirrors the init path with confirm-mode charter review and state checks. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference | Documents session classification, canonical names, and the resumed or restarted lifecycle event contract. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Asset | Supplies the default config shape written during initialization. |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Asset | Supplies the initial strategy structure and anchor layout. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md` | Manual playbook | Verifies fresh initialization creates the canonical packet files. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md` | Manual playbook | Verifies resume classification and restart-safe continuation from valid state. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md` | Manual playbook | Verifies contradictory packet state halts instead of guessing. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/027-research-charter-validation.md` | Manual playbook | Verifies the research charter sections exist before the loop proceeds. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/01-initialization.md`
