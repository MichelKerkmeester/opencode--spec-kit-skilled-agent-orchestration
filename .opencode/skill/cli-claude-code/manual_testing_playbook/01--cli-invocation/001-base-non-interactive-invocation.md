---
title: "CC-001 -- Base non-interactive invocation"
description: "This scenario validates Base non-interactive invocation for `CC-001`. It focuses on confirming the canonical `claude -p \"<prompt>\" --output-format text 2>&1` dispatch returns coherent text and exits cleanly."
---

# CC-001 -- Base non-interactive invocation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-001`.

---

## 1. OVERVIEW

This scenario validates Base non-interactive invocation for `CC-001`. It focuses on confirming the canonical `claude -p "<prompt>" --output-format text 2>&1` dispatch returns coherent text and exits cleanly.

### Why This Matters

Every other scenario in this playbook builds on this baseline. If the base `-p` invocation is broken (binary not installed, auth failed, nesting tripped), no agent route, model variant or pattern integration can pass. CC-001 is the single most important critical-path test in the package.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that `claude -p "<prompt>" --output-format text 2>&1` returns a coherent text response and exits 0.
- Real user request: `Use Claude Code to explain what the following TypeScript snippet does and tell me if it has any obvious bugs: function add(a, b) { return a + b }`
- Prompt: `As an external-AI conductor delegating a quick code-explanation task to Claude Code CLI, dispatch a single non-interactive claude -p call against a small TypeScript snippet. Verify the binary returns plain-text output and exits 0. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator constructs the prompt, runs the dispatch through Bash, captures stdout+stderr via `2>&1`, parses the output and returns a one-line verdict to the user.
- Expected signals: Command exits 0. Stdout contains a coherent natural-language explanation of the snippet. Stderr is empty or contains only warnings. Total runtime under 60 seconds for a simple prompt.
- Desired user-visible outcome: A short paragraph explaining the snippet plus a one-line verdict (PASS or FAIL with the reason).
- Pass/fail: PASS if exit code is 0 AND stdout contains a coherent explanation AND runtime is under 60 seconds. FAIL if any of those conditions fail or if `CLAUDECODE` is set (nesting refused).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the orchestrator runtime is NOT Claude Code itself (`[ -z "$CLAUDECODE" ]`).
3. Confirm `claude` is on PATH.
4. Execute the deterministic steps exactly as written.
5. Compare the observed output against the desired user-visible outcome.
6. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-001 | Base non-interactive invocation | Confirm `claude -p "<prompt>" --output-format text 2>&1` returns coherent text and exits 0 | `As an external-AI conductor delegating a quick code-explanation task to Claude Code CLI, dispatch a single non-interactive claude -p call against a small TypeScript snippet. Verify the binary returns plain-text output and exits 0. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: [ -z "$CLAUDECODE" ] && command -v claude` -> 2. `bash: claude -p "Explain what this TypeScript function does and flag any obvious bugs: function add(a, b) { return a + b }" --output-format text 2>&1 \| tee /tmp/cc-001-output.txt` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: wc -c /tmp/cc-001-output.txt` | Step 1: both checks succeed; Step 2: stdout contains an explanation referencing "addition" or "sum"; Step 3: exit code 0; Step 4: byte count > 0 | `/tmp/cc-001-output.txt` plus terminal transcript with timestamps and exit code | PASS if exit 0 AND output mentions addition/sum AND runtime under 60s; FAIL if any condition fails | 1. Verify `command -v claude` returns a path; 2. Verify `[ -z "$CLAUDECODE" ]` (must be unset); 3. Verify `ANTHROPIC_API_KEY` is set or `claude auth status` reports authenticated; 4. Re-run with `--verbose` to see processing details |

### Optional Supplemental Checks

If the base scenario passes, optionally re-run with `--verbose` to confirm the verbose log surfaces tool calls and processing events. This helps later scenarios that rely on log inspection (notably CC-005 and CC-007).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | CLI flag reference (sections 4-5: core invocation, flags) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill rules including ALWAYS rule 6 (capture stderr with 2>&1) and ALWAYS rule 7 (specify model) |
| `../../references/cli_reference.md` | Authoritative CLI flag inventory |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CC-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/001-base-non-interactive-invocation.md`
