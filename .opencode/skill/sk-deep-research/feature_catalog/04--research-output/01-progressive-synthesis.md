---
title: "Progressive synthesis"
description: "Keeps research/research.md current during the loop while preserving workflow ownership of the final synthesis pass."
---

# Progressive synthesis

## 1. OVERVIEW

Keeps `research/research.md` current during the loop while preserving workflow ownership of the final synthesis pass.

Progressive synthesis is the live writing path for the research document. It lets the packet stay readable during the loop without moving ownership of the final result away from the workflow.

---

## 2. CURRENT REALITY

`progressiveSynthesis` defaults to `true` in the shipped config template. When that flag is enabled, the iteration agent may create or extend `research/research.md` after each pass by adding new findings to the relevant sections. The agent may read and edit that file, but only under the progressive-synthesis rule set and only after reading config first.

The final workflow still owns synthesis. After convergence, the synth phase reads all iteration files and the final strategy state, deduplicates overlap, and cleans the document into the canonical 17-section structure. If `progressiveSynthesis` is disabled, the loop skips iteration-time writes and creates `research/research.md` from scratch during synthesis, but the file remains the workflow-owned final research surface in both modes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Asset | Sets `progressiveSynthesis` to `true` by default in the live config template. |
| `.opencode/agent/deep-research.md` | Agent | Defines when the iteration agent may create or update `research/research.md`. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Reference | Defines progressive update rules for `research/research.md`. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference | Defines the final synthesis cleanup pass that consolidates the document. |
| `.opencode/command/spec_kit/deep-research.md` | Command | Publishes `research/research.md` as a canonical loop output. |

### Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-progressive-synthesis-behavior-for-research-md.md` | Manual playbook | Verifies iteration-time updates respect the progressive-synthesis contract. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md` | Manual playbook | Verifies final synthesis still owns the terminal research document. |

---

## 4. SOURCE METADATA

- Group: Research output
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--research-output/01-progressive-synthesis.md`
