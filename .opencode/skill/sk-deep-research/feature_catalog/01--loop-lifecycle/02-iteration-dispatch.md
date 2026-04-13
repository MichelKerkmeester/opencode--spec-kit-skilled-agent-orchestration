---
title: "Iteration dispatch"
description: "Dispatches one fresh-context deep-research iteration and syncs reducer-owned packet state afterward."
---

# Iteration dispatch

## 1. OVERVIEW

Dispatches one fresh-context deep-research iteration and syncs reducer-owned packet state afterward.

Iteration dispatch is the main loop body. It gives the LEAF agent a clean context window for one focused pass, then hands the new evidence back to the reducer-owned packet surfaces.

---

## 2. CURRENT REALITY

Before each dispatch, the workflow reads `deep-research-config.json`, `deep-research-state.jsonl`, and `deep-research-strategy.md`, checks the optional pause sentinel, and builds a short state summary for the agent prompt. The agent contract is strict. `.opencode/agent/deep-research.md` reads the packet files first, chooses one focus, performs 3 to 5 research actions, writes a new `iteration-NNN.md` file, appends one JSONL record, and only updates `research/research.md` when `progressiveSynthesis` is enabled.

After the agent finishes, the loop does not treat the strategy, dashboard, or findings registry as agent-owned surfaces. Instead, the workflow runs `reduce-state.cjs`, which rewrites the machine-owned strategy anchors, refreshes `findings-registry.json`, and regenerates `deep-research-dashboard.md`. That reducer pass is the live sync point between raw iteration output and the readable packet state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/command/spec_kit/deep-research.md` | Command | Describes the iterate phase, state-summary injection, and reducer sync boundary. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Dispatches the LEAF agent, checks the pause sentinel, and runs the reducer after each iteration. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Mirrors dispatch flow with confirm-mode pause and review gates. |
| `.opencode/agent/deep-research.md` | Agent | Defines the single-iteration read, research, write, and progressive-synthesis rules. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Reducer | Synchronizes strategy, findings registry, and dashboard from iteration artifacts and events. |

### Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md` | Manual playbook | Verifies every iteration reads state before researching. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md` | Manual playbook | Verifies the iteration file and JSONL append contract. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-strategy-next-focus-and-exhausted-approach-discipline.md` | Manual playbook | Verifies next-focus selection and exhausted-approach discipline. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Vitest | Verifies reducer sync writes stable registry, strategy, and dashboard outputs from iteration state. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/02-iteration-dispatch.md`
