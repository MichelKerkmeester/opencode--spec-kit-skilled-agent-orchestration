---
title: "CO-033 -- Deep-review agent audit loop"
description: "This scenario validates the deep-review agent for `CO-033`. It focuses on confirming `--agent deep-review` executes a single audit iteration with severity-weighted P0/P1/P2 findings per the LEAF agent contract."
---

# CO-033 -- Deep-review agent audit loop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-033`.

---

## 1. OVERVIEW

This scenario validates the `deep-review` agent for `CO-033`. It focuses on confirming `--agent deep-review` executes a single review iteration that surfaces severity-tagged findings (P0, P1, P2) with file or line citations and respects the LEAF constraint (no nested dispatches), so the parent `/spec_kit:deep-review` command can manage severity-weighted convergence across multiple iterations.

### Why This Matters

`agent_delegation.md` §3 declares `deep-review` a LEAF agent dispatched only by `/spec_kit:deep-review` for single review-cycle execution with P0 plus P1 plus P2 severity classification. The skill rules in SKILL.md §4 ALWAYS rule 10 require classifying the use case before dispatch and the deep-review agent is the canonical executor for autonomous code-quality audits. If the agent silently spawns sub-agents or skips severity tagging, the convergence-detection contract for review loops collapses and the parent command cannot apply severity-weighted gating.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-033` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--agent deep-review` executes a single review iteration that surfaces at least one severity-tagged finding (P0, P1 or P2) with file or line citation, AND respects the LEAF constraint (no nested Task-tool dispatches in the JSON event stream).
- Real user request: `Run a single deep-review iteration on the cli-opencode SKILL.md file. Surface findings tagged P0 or P1 or P2 with file or line evidence.`
- Prompt: `As an external-AI conductor (or `/spec_kit:deep-review` simulator) running a single audit iteration, dispatch opencode run --agent deep-review --variant high --format json --dir <repo-root> "Run iteration 1 of the deep-review loop auditing the cli-opencode SKILL.md file at @./.opencode/skill/cli-opencode/SKILL.md. Surface at least 1 finding tagged P0, P1, or P2 with file or line citation. Do not dispatch sub-agents. State externalized at /tmp/co-033-state.jsonl." Verify the dispatch exits 0, the JSON event stream contains a session.completed event with severity-tagged findings, and that no Task or sub-agent tool.call events appear. Return a verdict naming the highest-severity finding and confirming LEAF compliance.`
- Expected execution process: External-AI orchestrator dispatches `--agent deep-review --format json` for a single iteration against a real target file, captures the JSON event stream, then validates that >= 1 severity-tagged finding surfaces and that no Task or sub-agent dispatches appear.
- Expected signals: Dispatch exits 0. JSON event stream contains session.started, message.delta events and session.completed. Response surfaces at least 1 finding with explicit severity tag (P0, P1 or P2). Each finding cites a file path or line number. Zero Task tool.call events. Zero `opencode run` nested invocations in tool.call payloads. Dispatched command line includes `--agent deep-review`.
- Desired user-visible outcome: A single audit-iteration result the parent command can feed into severity-weighted convergence detection.
- Pass/fail: PASS if exit 0 AND JSON parseable AND >= 1 severity-tagged finding with citation AND zero nested-dispatch tool.calls AND `--agent deep-review` in dispatch. FAIL if any check misses or LEAF constraint is violated.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create the state directory and snapshot the working tree.
2. Dispatch `--agent deep-review --format json` for iteration 1 against a real file.
3. Parse the JSON event stream and extract findings.
4. Verify at least one severity tag (P0, P1 or P2) appears with a citation.
5. Confirm zero Task tool.call events appear (LEAF compliance).
6. Return a verdict naming the highest-severity finding and confirming LEAF compliance.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-033 | Deep-review agent audit loop | Verify --agent deep-review executes a single audit iteration with severity-tagged findings and respects the LEAF constraint | `Spec folder: <repo-root>/.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/ (pre-approved, skip Gate 3). As an external-AI conductor (or /spec_kit:deep-review simulator) running a single audit iteration, dispatch opencode run --agent deep-review --variant high --format json --dir <repo-root> "Run iteration 1 of the deep-review loop auditing the cli-opencode SKILL.md file at @./.opencode/skill/cli-opencode/SKILL.md. Surface at least 1 finding tagged P0, P1, or P2 with file or line citation. Do not dispatch sub-agents. State externalized at /tmp/co-033-state.jsonl." Verify the dispatch exits 0, the JSON event stream contains a session.completed event with severity-tagged findings, and that no Task or sub-agent tool.call events appear. Return a verdict naming the highest-severity finding and confirming LEAF compliance.` | 1. `bash: rm -rf /tmp/co-033-events.jsonl /tmp/co-033-state.jsonl && touch /tmp/co-033-state.jsonl` -> 2. `opencode run --model opencode-go/deepseek-v4-pro --agent deep-review --variant high --format json --dir "$(pwd)" "Run iteration 1 of the deep-review loop auditing the cli-opencode SKILL.md file at @./.opencode/skill/cli-opencode/SKILL.md. Surface at least 1 finding tagged P0, P1, or P2 with file or line citation. Do not dispatch sub-agents. State externalized at /tmp/co-033-state.jsonl." > /tmp/co-033-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "session.completed") \| .payload.summary // empty' /tmp/co-033-events.jsonl \| head -c 500` -> 5. `bash: grep -cE '\b(P0\|P1\|P2)\b' /tmp/co-033-events.jsonl` -> 6. `bash: grep -ciE '(SKILL\.md\|line [0-9]+\|@\./\|@/)' /tmp/co-033-events.jsonl` -> 7. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-033-events.jsonl \| grep -ciE '^Task$' \| tr -d ' '` -> 8. `bash: jq -r 'select(.type == "tool.call") \| .payload.input.command // empty' /tmp/co-033-events.jsonl \| grep -ciE 'opencode run' \| tr -d ' '` | Step 1: state directory prepared; Step 2: dispatch captured; Step 3: exit 0; Step 4: session.completed summary extracted; Step 5: severity-tag count >= 1; Step 6: file or line citation count >= 1; Step 7: Task tool.call count = 0 (LEAF compliance); Step 8: nested `opencode run` count = 0 | `/tmp/co-033-events.jsonl`, `/tmp/co-033-state.jsonl`, terminal grep counts | PASS if exit 0 AND JSON parseable AND >= 1 severity tag AND >= 1 citation AND Task tool.call count = 0 AND nested opencode-run count = 0 AND `--agent deep-review` in dispatch; FAIL if any check misses or LEAF constraint is violated | (1) If Task tool.call count > 0, the LEAF constraint regressed, file a high-severity bug; (2) if severity tags are missing, refine the prompt to require explicit P0/P1/P2 tagging; (3) if `--agent deep-review` is rejected, run `opencode agent list` to confirm the agent is registered |

### Optional Supplemental Checks

For severity-distribution validation, dispatch a second iteration on a deliberately flawed file and confirm the second iteration surfaces a different severity profile from the first. The parent command (`/spec_kit:deep-review`) handles severity-weighted convergence detection, but a two-iteration smoke test confirms the agent produces stable severity tagging.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 deep-review) | Documents the deep-review LEAF agent contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 252) | Documents `--agent deep-review` in §3 agent routing table |
| `../../references/agent_delegation.md` | §3 deep-review, LEAF iteration loop executor |
| `.opencode/agent/deep-review.md` | Agent definition file |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-033
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/007-deep-review-agent-audit.md`
