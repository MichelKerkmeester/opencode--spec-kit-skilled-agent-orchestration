---
title: "CG-011 -- @review agent for cross-AI second opinion"
description: "This scenario validates routing a code-review task to the Gemini `@review` agent for `CG-011`. It focuses on confirming the agent returns severity-classified findings (P0/P1/P2 or critical/warning/info) for a small intentionally flawed snippet without modifying any files."
---

# CG-011 -- @review agent for cross-AI second opinion

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-011`.

---

## 1. OVERVIEW

This scenario validates the `@review` agent routing for `CG-011`. It focuses on confirming the documented `As @review agent: ...` prefix returns severity-classified findings against a small intentionally flawed code snippet and that the agent operates strictly read-only as documented in `references/agent_delegation.md`.

### Why This Matters

`@review` is the canonical cli-gemini delegation for cross-AI second-opinion code review. The orchestrator routes to it precisely because it produces structured severity classifications that can feed dashboards or downstream triage. If `@review` silently degrades to generic prose review without severities, downstream automation breaks.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `As @review agent: ...` returns at least one severity-classified finding (one of `P0`/`P1`/`P2` or `critical`/`high`/`medium`/`low`/`warning`/`info`) for a small intentionally flawed snippet, with no file modifications
- Real user request: `Have Gemini's @review agent look at a tiny intentionally-buggy snippet I'll drop in /tmp and tell me the severity-ranked findings — I want a second opinion on what's wrong before I share it with the team.`
- RCAF Prompt: `As a cross-AI orchestrator seeking a second opinion, dispatch the @review agent against the cli-gemini skill in this repository to review the small intentionally flawed Python snippet at /tmp/cg-011-snippet.py. Verify the agent returns at least one finding tagged with a severity classifier (P0/P1/P2 or critical/high/medium/low/warning/info) and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the highest-severity finding.`
- Expected execution process: orchestrator drops a small flawed snippet into `/tmp/cg-011-snippet.py`, runs a `git status` tripwire, dispatches `@review` against that snippet, then greps the response for a severity classifier
- Expected signals: command exits 0. Response contains at least one of the documented severity tokens (`P0`, `P1`, `P2`, `critical`, `high`, `medium`, `low`, `warning`, `info`) in a finding context, the response identifies the obvious flaw (eval / shell injection / unguarded division) and `git status --porcelain` diff is empty
- Desired user-visible outcome: PASS verdict + the highest-severity finding line such as `critical: eval(user_input) enables arbitrary code execution`
- Pass/fail: PASS if at least one severity-classified finding appears AND the obvious flaw is identified AND the working tree is unchanged. FAIL if no severity classifier appears, the obvious flaw is missed or the working tree is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify @review routing produces structured severity-classified findings".
2. Stay local. This is a direct CLI dispatch.
3. Use a tiny, obviously flawed snippet so the test is deterministic, `eval(input())` is a guaranteed critical/P0 finding.
4. Tripwire `git status` to confirm `@review` honours its read-only contract.
5. Surface the highest-severity finding in the verdict so the operator can match it against the snippet.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-011 | @review agent | Confirm `As @review agent:` returns severity-classified findings for an intentionally flawed snippet without mutating the working tree | `As a cross-AI orchestrator seeking a second opinion, dispatch the @review agent against the cli-gemini skill in this repository to review the small intentionally flawed Python snippet at /tmp/cg-011-snippet.py. Verify the agent returns at least one finding tagged with a severity classifier (P0/P1/P2 or critical/high/medium/low/warning/info) and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the highest-severity finding.` | 1. `bash: printf '%s\n' 'def run(user_input):' '    return eval(user_input)' '' 'print(run(input("> ")))' > /tmp/cg-011-snippet.py` -> 2. `bash: git -C "$PWD" status --porcelain > /tmp/cg-011-before.txt` -> 3. `bash: gemini "As @review agent: Review @/tmp/cg-011-snippet.py for security and correctness issues. Tag every finding with a severity (P0, P1, P2 or critical/high/medium/low). Be explicit about the highest-severity issue." -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-011.txt; echo EXIT=$?` -> 4. `bash: cat /tmp/cg-011.txt` -> 5. `bash: grep -ciE 'P0\|P1\|P2\|critical\|high\|medium\|low\|warning\|info' /tmp/cg-011.txt` -> 6. `bash: grep -ciE 'eval\|injection\|arbitrary code\|unsafe' /tmp/cg-011.txt` -> 7. `bash: git -C "$PWD" status --porcelain > /tmp/cg-011-after.txt && diff /tmp/cg-011-before.txt /tmp/cg-011-after.txt` | Step 3: `EXIT=0`; Step 5: grep count >= 1 (severity classifier present); Step 6: grep count >= 1 (obvious flaw identified); Step 7: diff is empty | `/tmp/cg-011-snippet.py`, `/tmp/cg-011.txt`, outputs from Steps 5, 6, and 7 | PASS if Step 5 count >= 1 AND Step 6 count >= 1 AND Step 7 diff is empty; FAIL if no severity classifier appears, the eval flaw is missed, or the working tree is mutated | 1. If severity classifier is missing, re-run with explicit `Use the format SEVERITY: description for each finding`; 2. If the eval flaw is missed, the snippet may have been silently truncated — re-run with the snippet inlined into the prompt body; 3. If diff shows mutations, the `@review` agent did not honour its read-only contract — escalate |

### Optional Supplemental Checks

If you want extra confidence, re-run with `-o json` and confirm `.toolCalls` lists only read-side tools (`read_file`, `grep_search`, `list_directory`, `run_shell_command` for read-only commands).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (agent routing table in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 AGENT CATALOG → @review (read-only contract, P0/P1/P2 severity classification) |
| `../../references/integration_patterns.md` | §10 CROSS-VALIDATION WITH CLAUDE → adversarial review pattern |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CG-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/002-review-agent-second-opinion.md`
