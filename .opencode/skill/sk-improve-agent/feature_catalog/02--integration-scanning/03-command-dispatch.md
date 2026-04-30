---
title: "Command dispatch"
description: "Routes improve-agent execution from the slash command into the auto and confirm workflow assets."
---

# Command dispatch

## 1. OVERVIEW

Routes improve-agent execution from the slash command into the auto and confirm workflow assets.

This feature covers the operator-facing command surface and the workflow assets that actually run the improve-agent loop.

---

## 2. CURRENT REALITY

`.opencode/command/improve/agent.md` is the command entrypoint. It resolves the target agent, spec folder, and execution mode, then tells the caller to load either the autonomous or interactive YAML workflow. The command markdown explicitly says not to dispatch agents from the command file itself.

The real dispatch authority lives in the YAML assets. Both workflow files rescan integration, dispatch `@improve-agent` to write candidates, emit journal events with `improvement-journal.cjs`, and call the scoring, coverage, trade-off, and reducer helpers. Confirm mode adds approval gates around candidate generation and post-score review, while auto mode runs the same stages without those gates.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/command/improve/agent.md` | Command | Entry surface that gathers inputs and routes execution into the matching YAML workflow. |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Workflow | Runs the full loop autonomously and emits session-end journal events after synthesis. |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Workflow | Runs the same loop with approval gates before candidate generation and after scoring. |
| `.opencode/agent/improve-agent.md` | Proposal agent | Leaf agent that the workflows dispatch for bounded candidate generation. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/loop_protocol.md` | Workflow reference | Documents the expected propose, score, benchmark, reduce, and promote sequence. |
| `.opencode/skill/sk-improve-agent/references/quick_reference.md` | Operator reference | Provides the shortest command surface and runtime-path reminder for the loop. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--integration-scanning/03-command-dispatch.md`
