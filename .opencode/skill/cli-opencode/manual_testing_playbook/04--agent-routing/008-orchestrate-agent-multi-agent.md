---
title: "CO-034 -- Orchestrate agent multi-agent coordination"
description: "This scenario validates the orchestrate agent for `CO-034`. It focuses on confirming `--agent orchestrate` produces a sequenced multi-agent decomposition without nested opencode run invocations."
---

# CO-034 -- Orchestrate agent multi-agent coordination

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-034`.

---

## 1. OVERVIEW

This scenario validates the `orchestrate` agent for `CO-034`. It focuses on confirming `--agent orchestrate` produces a sequenced multi-agent decomposition that names at least 3 distinct OpenCode agents from the documented roster with explicit handoffs, AND that no nested `opencode run` invocations appear in the JSON event stream (nested runs break the orchestration tree per agent_delegation.md §6).

### Why This Matters

`agent_delegation.md` §6 declares the orchestrate agent the entry point for multi-agent workflows on the OpenCode side, with the explicit constraint that the orchestrator must spawn sub-agents through OpenCode's native Task tool rather than nested `opencode run` invocations. If orchestrate output collapses into single-agent freeform analysis or spawns nested CLI runs, the multi-agent coordination contract is broken and the orchestration tree becomes unobservable for the calling AI.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-034` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--agent orchestrate` produces a sequenced multi-agent plan naming at least 3 distinct OpenCode agent slugs with explicit handoffs, AND that the JSON event stream contains zero nested `opencode run` tool.call events.
- Real user request: `Use opencode orchestrate to plan a comprehensive audit of the auth module. Decompose into specialist agents in sequence and explain handoffs.`
- Prompt: `As an external-AI conductor facing a complex task that requires multiple OpenCode specializations in sequence, dispatch opencode run --agent orchestrate --variant high --format json --dir <repo-root> "Plan a comprehensive audit of the cli-opencode skill itself. Decompose into a sequence of OpenCode specialist agents (e.g., context, review, write, ultra-think) with explicit handoffs between steps. Name each agent slug, the artifact each step produces, and what it hands to the next step. Do not dispatch nested opencode run invocations." Verify the response names at least 3 distinct agent slugs in sequence with handoffs and that zero nested opencode-run tool.calls appear. Return a verdict naming the agents in planned order and confirming the no-nested-run constraint.`
- Expected execution process: External-AI orchestrator dispatches `--agent orchestrate --format json` with a multi-agent decomposition prompt, captures the JSON event stream, then validates the plan names >= 3 distinct slugs and zero nested `opencode run` tool.calls.
- Expected signals: Dispatch exits 0. JSON event stream contains session.started, message.delta events and session.completed. Response or summary names at least 3 distinct agent slugs from the documented roster (general, context, review, write, debug, deep-research, deep-review, ultra-think, improve-agent). Steps are sequenced (Step 1, Step 2, etc.) with handoff descriptions. Zero `opencode run` nested invocations in tool.call payloads. Dispatched command line includes `--agent orchestrate`.
- Desired user-visible outcome: A multi-agent decomposition plan the operator can execute step by step with separate dispatches.
- Pass/fail: PASS if exit 0 AND >= 3 distinct slugs in sequence AND handoffs described AND zero nested opencode-run tool.calls AND `--agent orchestrate` in dispatch. FAIL if any check misses or nested runs appear.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Snapshot the working tree status.
2. Dispatch `--agent orchestrate --format json` with the multi-agent decomposition prompt.
3. Parse the JSON event stream and count distinct agent slugs in the response.
4. Verify handoffs are described between steps.
5. Confirm zero nested `opencode run` tool.call events.
6. Return a verdict naming the agent slugs and confirming the no-nested-run constraint.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-034 | Orchestrate agent multi-agent coordination | Verify --agent orchestrate produces a sequenced multi-agent plan with no nested opencode run dispatches | `Spec folder: <repo-root>/.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/ (pre-approved, skip Gate 3). As an external-AI conductor facing a complex task that requires multiple OpenCode specializations in sequence, dispatch opencode run --agent orchestrate --variant high --format json --dir <repo-root> "Plan a comprehensive audit of the cli-opencode skill itself. Decompose into a sequence of OpenCode specialist agents (for example context, review, write, ultra-think) with explicit handoffs between steps. Name each agent slug, the artifact each step produces, and what it hands to the next step. Do not dispatch nested opencode run invocations." Verify the response names at least 3 distinct agent slugs in sequence with handoffs and that zero nested opencode-run tool.calls appear. Return a verdict naming the agents in planned order and confirming the no-nested-run constraint.` | 1. `bash: rm -rf /tmp/co-034-events.jsonl && git status --porcelain > /tmp/co-034-pre.txt` -> 2. `opencode run --model github-copilot/gpt-5.4 --agent orchestrate --variant high --format json --dir "$(pwd)" "Plan a comprehensive audit of the cli-opencode skill itself. Decompose into a sequence of OpenCode specialist agents (for example context, review, write, ultra-think) with explicit handoffs between steps. Name each agent slug, the artifact each step produces, and what it hands to the next step. Do not dispatch nested opencode run invocations." > /tmp/co-034-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "session.completed") \| .payload.summary // empty' /tmp/co-034-events.jsonl > /tmp/co-034-summary.txt` -> 5. `bash: grep -ciE '(general\|context\|review\|write\|debug\|deep-research\|deep-review\|ultra-think\|improve-agent)' /tmp/co-034-summary.txt` -> 6. `bash: grep -ciE '(step [0-9]+\|handoff\|hand off\|hands to\|passes to)' /tmp/co-034-summary.txt` -> 7. `bash: jq -r 'select(.type == "tool.call") \| .payload.input.command // empty' /tmp/co-034-events.jsonl \| grep -ciE 'opencode run' \| tr -d ' '` -> 8. `bash: git status --porcelain > /tmp/co-034-post.txt && diff /tmp/co-034-pre.txt /tmp/co-034-post.txt && echo OK_TREE_CLEAN` | Step 1: pre-snapshot captured; Step 2: dispatch captured; Step 3: exit 0; Step 4: session.completed summary extracted; Step 5: distinct agent-slug count >= 3 (across multiple grep hits); Step 6: handoff or step keyword count >= 2; Step 7: nested `opencode run` count = 0; Step 8: `OK_TREE_CLEAN` printed | `/tmp/co-034-events.jsonl`, `/tmp/co-034-summary.txt`, pre and post tree-status diff | PASS if exit 0 AND >= 3 distinct agent slugs AND handoffs described AND nested opencode-run count = 0 AND working tree clean AND `--agent orchestrate` in dispatch; FAIL if any check misses or nested runs appear | (1) If nested `opencode run` count > 0, the orchestrator violated the no-nested-run constraint, file a high-severity bug per agent_delegation.md §6; (2) if fewer than 3 slugs are named, refine the prompt to require explicit decomposition into at least 3 specialists; (3) if `--agent orchestrate` is rejected, run `opencode agent list` to confirm the agent is registered |

### Optional Supplemental Checks

For full multi-agent flow validation, dispatch the first specialist named by the orchestrator (e.g., `--agent context`) with the same target scope and verify the output is consistent with what the orchestrator described as Step 1. This confirms the orchestrator's plan is dispatchable by the calling AI without further refinement.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 + §6) | Documents the orchestrate agent and multi-agent contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 254) | Documents `--agent orchestrate` in §3 agent routing table |
| `../../references/agent_delegation.md` | §6 multi-agent workflows and the no-nested-run rule |
| `.opencode/agent/orchestrate.md` | Agent definition file |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-034
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/008-orchestrate-agent-multi-agent.md`
