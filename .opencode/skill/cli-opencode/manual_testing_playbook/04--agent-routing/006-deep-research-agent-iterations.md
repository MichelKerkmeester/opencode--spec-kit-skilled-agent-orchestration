---
title: "CO-032 -- Deep-research agent iteration loop"
description: "This scenario validates the deep-research agent for `CO-032`. It focuses on confirming `--agent deep-research` executes a single research iteration with externalized JSONL state per the LEAF agent contract."
---

# CO-032 -- Deep-research agent iteration loop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-032`.

---

## 1. OVERVIEW

This scenario validates the `deep-research` agent for `CO-032`. It focuses on confirming `--agent deep-research` executes a single research iteration against externalized JSONL state and respects the LEAF constraint (no nested dispatches), so the parent `/spec_kit:deep-research` command can manage convergence detection across multiple iterations without each iteration spawning sub-agents.

### Why This Matters

`agent_delegation.md` §3 declares `deep-research` a LEAF agent dispatched only by `/spec_kit:deep-research` for single research-cycle execution. The skill rules in SKILL.md §4 ALWAYS rule 10 require classifying the use case (1, 2 or 3) before dispatch and the deep-research agent is the canonical executor for use case 1 research loops. If the agent silently spawns sub-agents or skips externalized state, the convergence-detection contract for autonomous research loops collapses and the parent command loses its source of truth.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-032` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--agent deep-research` executes a single research iteration against externalized JSONL state at a temp path, surfaces findings or hypotheses in the response, AND respects the LEAF constraint (no nested Task-tool dispatches in the JSON event stream).
- Real user request: `Run a single deep-research iteration on the cli-opencode self-invocation guard rationale. Externalize state under /tmp so we can re-run convergence detection later.`
- Prompt: `As an external-AI conductor (or `/spec_kit:deep-research` simulator) running a single research iteration, dispatch opencode run --agent deep-research --variant high --format json --dir <repo-root> "Run iteration 1 of the deep-research loop investigating the cli-opencode self-invocation guard rationale documented in ADR-001 and integration_patterns.md §5. State externalized at /tmp/co-032-state.jsonl. Surface at least 2 findings or open hypotheses. Do not dispatch sub-agents." Verify the dispatch exits 0, the JSON event stream contains a session.completed event referencing findings or hypotheses, and that no Task or sub-agent tool.call events appear. Return a verdict naming the iteration findings count and confirming LEAF compliance.`
- Expected execution process: External-AI orchestrator dispatches `--agent deep-research --format json` for a single iteration, captures the JSON event stream, then validates that >= 2 findings surface and that no Task or sub-agent dispatches appear in the event stream.
- Expected signals: Dispatch exits 0. JSON event stream contains session.started, message.delta events and session.completed. Response surfaces at least 2 findings or hypotheses (numbered or labeled). Zero Task tool.call events. Zero `opencode run` nested invocations in tool.call payloads. Dispatched command line includes `--agent deep-research`.
- Desired user-visible outcome: A single research-iteration result the parent command can feed into convergence detection on the next iteration.
- Pass/fail: PASS if exit 0 AND JSON parseable AND >= 2 findings AND zero nested-dispatch tool.calls AND `--agent deep-research` in dispatch. FAIL if any check misses or LEAF constraint is violated.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create the state directory and snapshot the working tree.
2. Dispatch `--agent deep-research --format json` for iteration 1.
3. Parse the JSON event stream and count findings.
4. Confirm zero Task tool.call events appear (LEAF compliance).
5. Verify the response references the iteration plus state path.
6. Return a verdict naming the findings count and confirming LEAF compliance.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-032 | Deep-research agent iteration loop | Verify --agent deep-research executes a single iteration with externalized state and respects the LEAF constraint | `Spec folder: <repo-root>/.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/ (pre-approved, skip Gate 3). As an external-AI conductor (or /spec_kit:deep-research simulator) running a single research iteration, dispatch opencode run --agent deep-research --variant high --format json --dir <repo-root> "Run iteration 1 of the deep-research loop investigating the cli-opencode self-invocation guard rationale documented in ADR-001 and integration_patterns.md §5. State externalized at /tmp/co-032-state.jsonl. Surface at least 2 findings or open hypotheses. Do not dispatch sub-agents." Verify the dispatch exits 0, the JSON event stream contains a session.completed event referencing findings or hypotheses, and that no Task or sub-agent tool.call events appear. Return a verdict naming the iteration findings count and confirming LEAF compliance.` | 1. `bash: rm -rf /tmp/co-032-events.jsonl /tmp/co-032-state.jsonl && touch /tmp/co-032-state.jsonl` -> 2. `opencode run --model github-copilot/gpt-5.5 --agent orchestrate --variant high --format json --dir "$(pwd)" "Use the deep-research subagent to run iteration 1 of the deep-research loop investigating the cli-opencode self-invocation guard rationale documented in ADR-001 and integration_patterns.md anchor 5. State externalized at /tmp/co-032-state.jsonl. Surface at least 2 findings or open hypotheses. The deep-research subagent is LEAF — it must not dispatch further sub-agents." > /tmp/co-032-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "session.completed") \| .payload.summary // empty' /tmp/co-032-events.jsonl \| head -c 500` -> 5. `bash: grep -ciE '(finding\|hypothesis\|hypothes[ie]s)' /tmp/co-032-events.jsonl` -> 6. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-032-events.jsonl \| grep -ciE '^Task$' \| tr -d ' '` -> 7. `bash: jq -r 'select(.type == "tool.call") \| .payload.input.command // empty' /tmp/co-032-events.jsonl \| grep -ciE 'opencode run' \| tr -d ' '` | Step 1: state directory prepared; Step 2: dispatch captured; Step 3: exit 0; Step 4: session.completed summary extracted; Step 5: finding mention count >= 2; Step 6: Task tool.call count = 0 (LEAF compliance); Step 7: nested `opencode run` count = 0 | `/tmp/co-032-events.jsonl`, `/tmp/co-032-state.jsonl`, terminal grep counts | PASS if exit 0 AND JSON parseable AND >= 2 findings AND Task tool.call count = 0 AND nested opencode-run count = 0 AND `--agent deep-research` in dispatch; FAIL if any check misses or LEAF constraint is violated | (1) If Task tool.call count > 0, the LEAF constraint regressed, file a high-severity bug; (2) if findings are absent, the agent may have refused or the prompt may be too vague, refine and re-dispatch; (3) if `--agent deep-research` is rejected, run `opencode agent list` to confirm the agent is registered |

### Optional Supplemental Checks

For full convergence-detection validation, run a second iteration with `-c` (continue) and verify the second iteration references findings from the first via the externalized state. The parent command (`/spec_kit:deep-research`) is the canonical convergence detector but a manual two-iteration smoke test confirms state externalization works.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 deep-research) | Documents the deep-research LEAF agent contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 251) | Documents `--agent deep-research` in §3 agent routing table |
| `../../references/agent_delegation.md` | §3 deep-research, LEAF iteration loop executor |
| `.opencode/agent/deep-research.md` | Agent definition file |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-032
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/006-deep-research-agent-iterations.md`
