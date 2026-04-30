---
title: "CLU-005 -- Sprint and standup summary"
description: "This scenario validates read-only sprint and summary commands for daily ClickUp workflows."
---

# CLU-005 -- Sprint and standup summary

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-005`.

---

## 1. OVERVIEW

This scenario validates the CLI-only sprint and standup summary workflow. It accepts either real sprint content or a clear no-active-sprint response.

### Why This Matters

The historical skill documents sprint and summary as CLI-native behavior rather than MCP behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `cu sprint` and `cu summary` return readable current-work signals.
- Real user request: `Give me my ClickUp sprint context and standup summary.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, run the CLI-native sprint and summary commands, capture their outputs, and verify they either return readable current-work information or a clear no-active-sprint message. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Run both read-only commands and classify output shape.
- Expected signals: both commands exit cleanly; output contains tasks, summary prose, or explicit no-sprint wording.
- Desired user-visible outcome: A short standup-readiness verdict.
- Pass/fail: PASS if both commands exit 0 and output is interpretable; FAIL if either command errors unexpectedly.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm auth passed.
2. Run `cu sprint`.
3. Run `cu summary`.
4. Classify no-sprint as PASS only if explicit and clean.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-005 | Sprint and standup summary | Confirm CLI-native sprint/summary commands are usable | `As a ClickUp manual-testing orchestrator, run the CLI-native sprint and summary commands, capture their outputs, and verify they either return readable current-work information or a clear no-active-sprint message. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: cu sprint 2>&1 \| tee /tmp/clu-005-sprint.txt` -> 2. `bash: echo "SprintExit: ${PIPESTATUS[0]}"` -> 3. `bash: cu summary 2>&1 \| tee /tmp/clu-005-summary.txt` -> 4. `bash: echo "SummaryExit: ${PIPESTATUS[0]}"` | Exit codes are 0; outputs are non-empty; output includes task/summary content or clear no-active-sprint message | Sprint output, summary output, exit code transcript | PASS if both commands are clean and interpretable; FAIL if commands crash or produce auth/config errors | 1. Verify CLU-002 auth; 2. Confirm workspace has sprint support; 3. If no active sprint, record SKIP only if command exits non-zero for plan/workspace reasons |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/SKILL.md` | Historical CLI-vs-MCP decision matrix |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical sprint/summary command reference |

---

## 5. SOURCE METADATA

- Group: READ OPERATIONS
- Playbook ID: CLU-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--read-operations/003-sprint-and-standup-summary.md`

