---
title: "CC-021 -- Handover agent context transfer"
description: "This scenario validates Handover agent context transfer for `CC-021`. It focuses on confirming `--agent handover` produces a structured session-state capture suitable for cross-session resume."
---

# CC-021 -- Handover agent context transfer

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CC-021`.

---

## 1. OVERVIEW

This scenario validates Handover agent context transfer for `CC-021`. It focuses on confirming `--agent handover` produces a structured session-state capture covering active work, modified files, recent decisions, and next steps so a follow-up session can resume without re-discovery.

### Why This Matters

The `handover` agent is the documented bridge for cross-session work transfer in the cli-claude-code roster (SKILL.md §3 Agent Routing Table). When an external orchestrator hands off a long-running task to Claude Code, the handover artifact is what lets the next runtime pick up where the prior turn stopped. If the handover output is freeform or omits canonical fields, the cross-session resume contract collapses and operators must re-derive context from scratch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent handover` produces a structured session-state capture covering active work, modified files, recent decisions, and next steps in a single read-only dispatch.
- Real user request: `Use Claude Code to capture a handover for the work I just finished on the auth refactor so the next session can pick it up tomorrow.`
- Prompt: `As an external-AI conductor closing out a multi-step task and preparing handoff for a follow-up session, dispatch claude -p --agent handover --permission-mode plan against the active task scope and capture a structured handover document. Verify the response identifies active work, modified files, key decisions, blockers, and next steps. Return a concise pass/fail verdict naming the captured fields and confirming no file writes.`
- Expected execution process: External-AI orchestrator selects a real recent change set in the repo as the synthetic task scope, snapshots mtimes of all candidate files, dispatches with `--agent handover --permission-mode plan`, then verifies the response covers the canonical handover fields and that no mtimes advanced.
- Expected signals: Response names the active task in plain language. Lists at least 2 modified or referenced files. Surfaces at least 1 decision or rationale. Declares at least 1 blocker or open question (or attests to none). Names at least 1 concrete next step. No file mtimes change.
- Desired user-visible outcome: A structured handover summary the operator can paste into a continuation prompt for tomorrow's session.
- Pass/fail: PASS if response covers active work, modified files, decisions, blockers, and next steps AND no mtimes changed. FAIL if any canonical field is missing or any mtime advances.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Snapshot mtimes for the recent change-set scope in the repo.
3. Dispatch with `--agent handover --permission-mode plan` and a prompt naming the synthetic task scope.
4. Re-snapshot mtimes and diff.
5. Verify the response covers all 5 canonical handover fields.
6. Return a verdict naming the captured fields and confirming the mtime status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-021 | Handover agent context transfer | Confirm `--agent handover --permission-mode plan` produces a structured session-state capture covering 5 canonical fields | `As an external-AI conductor closing out a multi-step task and preparing handoff for a follow-up session, dispatch claude -p --agent handover --permission-mode plan against the cli-claude-code skill scope and capture a structured handover document. Verify the response identifies active work, modified files, key decisions, blockers, and next steps. Return a concise pass/fail verdict naming the captured fields and confirming no file writes.` | 1. `bash: find .opencode/skill/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-021-mtimes-before.txt` -> 2. `bash: claude -p "Capture a handover for cross-session resume. Active scope is the cli-claude-code skill at @./.opencode/skill/cli-claude-code/. Surface active work, modified or referenced files, key decisions or rationale, blockers or open questions, and concrete next steps." --agent handover --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-021-output.txt` -> 3. `bash: find .opencode/skill/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-021-mtimes-after.txt` -> 4. `bash: diff /tmp/cc-021-mtimes-before.txt /tmp/cc-021-mtimes-after.txt && echo OK_UNCHANGED` -> 5. `bash: grep -ciE '(active work\|modified\|files\|decision\|blocker\|open question\|next step)' /tmp/cc-021-output.txt` | Step 1: mtime baseline captured; Step 2: response covers 5 canonical fields; Step 3: mtime after captured; Step 4: `OK_UNCHANGED` printed; Step 5: count of canonical-field keyword mentions >= 5 | `/tmp/cc-021-output.txt`, `/tmp/cc-021-mtimes-before.txt`, `/tmp/cc-021-mtimes-after.txt` | PASS if response covers active work, modified files, decisions, blockers, and next steps AND no mtime advances; FAIL if any canonical field is missing or any mtime advances | 1. If a canonical field is missing, refine the prompt to enumerate the 5 fields explicitly and re-dispatch; 2. If mtimes advance, the read-only safety contract was violated, file a regression bug; 3. If `--agent handover` is rejected, run `claude agents list` to confirm the agent is registered |

### Optional Supplemental Checks

If the response covers all 5 fields but reads as freeform prose, ask the orchestrator to request a JSON shape via `--json-schema` to confirm the agent can produce machine-parseable handover output for downstream pipelines.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Handover agent role per the documented roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 212) | Documents the handover agent in the §3 Agent Routing Table |
| `../../references/agent_delegation.md` | Agent contract for cross-session handover |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-021
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/005-handover-agent-context-transfer.md`
