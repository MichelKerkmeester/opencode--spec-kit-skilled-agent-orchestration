---
title: "CM-021 -- Invalid config error (DESTRUCTIVE)"
description: "This scenario validates the invalid-config error path for `CM-021`. It focuses on confirming Code Mode reports a structured config-validation error when `.utcp_config.json` has malformed JSON, then restores cleanly."
---

# CM-021 -- Invalid config error (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-021`.

---

## 1. OVERVIEW

This scenario validates the invalid-config error path for `CM-021`. It focuses on confirming that when `.utcp_config.json` contains malformed JSON, Code Mode reports a deterministic JSON parse error referencing the config file path, and that restoring the original file recovers normal operation.

**WARNING — Destructive scenario**: corrupts `.utcp_config.json`. Always back up before, restore after; never run during active development.

### Why This Matters

Operators inevitably break `.utcp_config.json` during edits (missing comma, trailing comma, unbalanced brace). If the error message is generic ("startup failed"), they can't self-correct. A clear file-path + parse-error message turns a 30-minute debug into a 30-second fix.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-021` and confirm the expected signals without contradictory evidence.

- Objective: Verify that corrupted `.utcp_config.json` causes Code Mode startup to fail with a JSON parse error naming the file; restoring fixes it.
- Real user request: `"My Code Mode broke after I edited .utcp_config.json — what's wrong?"` (debugging session)
- RCAF Prompt: `As a manual-testing orchestrator, back up .utcp_config.json, corrupt it (delete a closing brace), restart Code Mode, observe the error, then restore through Code Mode against the corrupted then-restored config. Verify the error names the config file and the JSON parse failure. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: backup → corrupt → restart Code Mode → observe failure → restore → restart → verify recovery.
- Expected signals: corrupted-state restart fails with JSON parse error referencing `.utcp_config.json`; restored-state restart succeeds and `list_tools()` returns normally.
- Desired user-visible outcome: A short report quoting the parse-error message and confirming recovery with a PASS verdict.
- Pass/fail: PASS if all three signals hold AND restore is complete; FAIL if error is generic, no error at all (Code Mode silently ignored bad JSON), or restore fails.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, back up .utcp_config.json, corrupt it (delete a closing brace), restart Code Mode, observe the error, then restore through Code Mode against the corrupted then-restored config. Verify the error names the config file and the JSON parse failure. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cp .utcp_config.json .utcp_config.json.bak` — back up
2. `bash: head -c -2 .utcp_config.json.bak > .utcp_config.json` — drop trailing closing brace (corrupt)
3. Restart Code Mode runtime; capture startup error
4. `bash: mv .utcp_config.json.bak .utcp_config.json` — restore
5. Restart Code Mode runtime
6. `list_tools()` — confirm recovery

### Expected

- Step 3: Code Mode startup fails; error output contains `.utcp_config.json` AND parse-error indicator (`SyntaxError`, `Unexpected end of JSON`, etc.)
- Step 6: returns non-empty array (per CM-001)

### Evidence

Capture the corrupted-state error message verbatim. Capture the post-restore `list_tools()` count.

### Pass / Fail

- **Pass**: Corrupted state errors with a named JSON parse failure; restore returns Code Mode to working state.
- **Fail**: Generic startup error (operator can't self-correct); no error (silent ignore); restore fails (`.bak` was lost — investigate `git status`).

### Failure Triage

1. If no error: check that the corruption actually broke JSON syntax (`bash: cat .utcp_config.json | jq '.'` should fail); some Code Mode versions are very lenient.
2. If generic error: enhancement target — file an issue. Operator can still cross-check by running `jq '.' .utcp_config.json` themselves.
3. If restore fails: check `git diff .utcp_config.json`; if backup is gone, hand-restore from `git show HEAD:.utcp_config.json > .utcp_config.json`.

### Optional Supplemental Checks

- After restore, run CM-001 to confirm full recovery before continuing other scenarios.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Config validation guidance |
| `.utcp_config.json` (project root) | Subject of corruption |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND CONFIG
- Playbook ID: CM-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--recovery-and-config/001-invalid-config-error.md`
