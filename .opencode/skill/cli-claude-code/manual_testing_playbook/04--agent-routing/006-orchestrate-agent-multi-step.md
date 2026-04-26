---
title: "CC-022 -- Orchestrate agent multi-step coordination"
description: "This scenario validates Orchestrate agent multi-step coordination for `CC-022`. It focuses on confirming `--agent orchestrate` decomposes a complex task into a sequenced agent pipeline."
---

# CC-022 -- Orchestrate agent multi-step coordination

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CC-022`.

---

## 1. OVERVIEW

This scenario validates Orchestrate agent multi-step coordination for `CC-022`. It focuses on confirming `--agent orchestrate --permission-mode plan` produces a sequenced multi-agent decomposition for a complex task that names which Claude Code agents would run in which order with explicit handoffs.

### Why This Matters

The `orchestrate` agent is the documented entry point for multi-agent workflows on the Claude Code side per SKILL.md §3 Agent Routing Table. When an external conductor faces a complex task that touches multiple specializations (review plus debug plus docs), routing through `orchestrate` yields a decomposed plan that names the right specialists in the right order. If orchestrate output is single-agent freeform analysis, the multi-agent contract is broken and the orchestrator silently regresses to a single-agent dispatch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent orchestrate --permission-mode plan` decomposes a complex task into a sequenced multi-agent pipeline naming at least 3 distinct Claude Code agents with explicit handoffs.
- Real user request: `I need a comprehensive audit of the payment module: explore the architecture, review for security, identify test gaps. Plan the workflow before we start.`
- Prompt: `As an external-AI conductor facing a complex task that requires multiple Claude Code specializations in sequence, dispatch claude -p --agent orchestrate --permission-mode plan and ask for a decomposition that names at least 3 specialist agents (e.g., context, review, debug, ultra-think) and explicit handoffs between them. Verify the plan reads as a sequenced workflow rather than monolithic analysis. Return a verdict naming the agents in the planned order and confirming no file writes occur.`
- Expected execution process: External-AI orchestrator picks a synthetic complex task that maps to multiple specialists, dispatches with `--agent orchestrate --permission-mode plan`, captures the decomposition, then validates the plan names at least 3 agents and describes handoffs.
- Expected signals: Response names at least 3 distinct Claude Code agents from the documented roster. Sequences them in a clear order (Step 1, Step 2, Step 3 or equivalent). Describes handoff content between steps. No file mtimes change.
- Desired user-visible outcome: A multi-agent decomposition the operator can dispatch step by step.
- Pass/fail: PASS if plan names >= 3 agents in sequence with handoffs AND no mtimes changed. FAIL if plan is monolithic, names fewer than 3 agents, or any mtime advances.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick a synthetic complex task scope and snapshot mtimes for it.
3. Dispatch with `--agent orchestrate --permission-mode plan` and a prompt asking for multi-agent decomposition.
4. Re-snapshot mtimes and diff.
5. Verify the plan names >= 3 agents and describes handoffs.
6. Return a verdict naming the agents and confirming the mtime status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-022 | Orchestrate agent multi-step coordination | Confirm `--agent orchestrate --permission-mode plan` decomposes a task into a sequenced multi-agent plan | `As an external-AI conductor facing a complex task that requires multiple Claude Code specializations in sequence, dispatch claude -p --agent orchestrate --permission-mode plan and ask for a decomposition that names at least 3 specialist agents (e.g., context, review, debug, ultra-think) and explicit handoffs between them. Verify the plan reads as a sequenced workflow rather than monolithic analysis. Return a verdict naming the agents in the planned order and confirming no file writes occur.` | 1. `bash: find .opencode/skill/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-022-mtimes-before.txt` -> 2. `bash: claude -p "Plan a comprehensive audit of @./.opencode/skill/cli-claude-code/. The audit must explore architecture, review for documentation quality, and identify gaps. Decompose the workflow into a sequence of Claude Code specialist agents with explicit handoffs between steps. Name each agent and the artifact it hands to the next step." --agent orchestrate --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-022-output.txt` -> 3. `bash: find .opencode/skill/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-022-mtimes-after.txt` -> 4. `bash: diff /tmp/cc-022-mtimes-before.txt /tmp/cc-022-mtimes-after.txt && echo OK_UNCHANGED` -> 5. `bash: grep -ciE '(context\|review\|debug\|ultra-think\|research\|write\|handover\|speckit)' /tmp/cc-022-output.txt` | Step 1: mtime baseline captured; Step 2: plan names >= 3 agents in sequence; Step 3: mtime after captured; Step 4: `OK_UNCHANGED` printed; Step 5: count of distinct agent-name mentions >= 3 | `/tmp/cc-022-output.txt`, `/tmp/cc-022-mtimes-before.txt`, `/tmp/cc-022-mtimes-after.txt` | PASS if plan names >= 3 distinct agents in sequence with handoffs AND no mtime advances; FAIL if plan is monolithic or fewer than 3 agents or any mtime advances | 1. If the plan reads as monolithic, refine the prompt to insist on multi-agent decomposition and re-dispatch; 2. If fewer than 3 agents are named, prompt for a richer decomposition referencing the agent_delegation.md roster; 3. If `--agent orchestrate` is rejected, verify the agent definition is present in `.opencode/agent/orchestrate.md` |

### Optional Supplemental Checks

If the plan names exactly 3 agents but skips handoff description, re-prompt with an explicit "describe what each step hands to the next" clause and confirm the handoff content is added.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Orchestrate agent role per the documented roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 213) | Documents the orchestrate agent in the §3 Agent Routing Table |
| `../../references/agent_delegation.md` | Agent contract for multi-agent coordination |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-022
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/006-orchestrate-agent-multi-step.md`
