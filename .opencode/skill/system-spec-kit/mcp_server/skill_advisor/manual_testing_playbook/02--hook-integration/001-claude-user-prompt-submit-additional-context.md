---
title: "SAD-003 -- Claude UserPromptSubmit Additional Context"
description: "Canonical manual scenario validating that the Claude prompt-time hook surfaces Skill Advisor additional context without blocking or leaking raw prompts."
---

# SAD-003 -- Claude UserPromptSubmit Additional Context

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAD-003`.

---

## 1. OVERVIEW

This scenario validates the Claude `UserPromptSubmit` adapter. It confirms that a realistic prompt can receive `hookSpecificOutput.additionalContext` from the native advisor while preserving fail-open behavior and prompt-safety diagnostics.

### Why This Matters

Most users experience the advisor through prompt-time runtime hooks, not direct MCP calls. The hook must add useful context without making the user's prompt fragile.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAD-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that the Claude hook emits advisor context for a matching prompt and fails open without prompt leakage.
- Real user request: `Create a manual testing playbook for this skill and validate the root document.`
- RCAF Prompt:
  - Role: Runtime hook operator validating prompt-time Skill Advisor integration.
  - Context: The MCP server build is current and the Claude hook script is available under `mcp_server/dist/hooks/claude/user-prompt-submit.js`.
  - Action: Pipe a realistic `UserPromptSubmit` payload into the hook, capture stdout and stderr separately, and inspect additional context plus diagnostics.
  - Format: Return `PASS` or `FAIL` with whether additional context appeared, whether diagnostics stayed prompt-safe, and whether the hook exited 0.
- Expected execution process: Operator builds the MCP server, runs the compiled hook with JSON stdin, captures stdout/stderr, and checks for `hookSpecificOutput.additionalContext` or an acceptable fail-open `{}`.
- Expected signals: Exit code is 0. Stdout is `{}` or a Claude hook envelope containing `hookSpecificOutput.additionalContext`. Matching prompts include an `Advisor:` context prefix when recommendations pass. Stderr diagnostics name runtime `claude` without raw prompt text.
- Desired user-visible outcome: Prompt-time context is available when the advisor is live, and the prompt still proceeds when advisor state is degraded.
- Pass/fail: PASS if the hook exits 0, produces valid stdout, emits advisor context or documented fail-open output, and does not leak raw prompt text. FAIL if the hook blocks, emits invalid JSON, or leaks prompt text.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Build the MCP server.
2. Run the hook with a realistic `UserPromptSubmit` payload.
3. Capture stdout to `/tmp/skill-advisor-playbook/sad-003.stdout.json`.
4. Capture stderr to `/tmp/skill-advisor-playbook/sad-003.stderr.jsonl`.
5. Inspect JSON shape, runtime diagnostics, and prompt-safety boundaries.
6. Return a concise verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-003 | Claude hook additional context | Confirm prompt-time hook surfaces advisor context and fails open safely | `Role: Runtime hook operator. Context: current MCP server build and Claude UserPromptSubmit hook script. Action: pipe a realistic prompt payload into the hook, capture stdout and stderr separately, and inspect additional context plus diagnostics. Format: return PASS or FAIL with context presence, prompt-safety result, and exit code.` | 1. `bash: npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` -> 2. `bash: mkdir -p /tmp/skill-advisor-playbook` -> 3. `bash: printf '%s' '{"prompt":"Create a manual testing playbook for this skill and validate the root document.","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js > /tmp/skill-advisor-playbook/sad-003.stdout.json 2> /tmp/skill-advisor-playbook/sad-003.stderr.jsonl` -> 4. `bash: echo "Exit: $?"` | Exit code 0; stdout is valid JSON; stdout is `{}` or contains `hookSpecificOutput.additionalContext`; stderr diagnostics identify `runtime: "claude"`; raw prompt literal is absent from stderr | Captured stdout, stderr, command transcript, and exit code | PASS if exit 0, stdout JSON is valid, additional context or documented fail-open output appears, and diagnostics are prompt-safe; FAIL otherwise | 1. Verify compiled hook exists; 2. Rebuild MCP server; 3. Run `advisor_status`; 4. Confirm disable flag is unset; 5. Inspect hook parity tests |

### Optional Supplemental Checks

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` for a separate run and verify the hook exits 0 with fail-open output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--hooks-and-plugin/01-claude-hook.md` | Feature-catalog source for Claude hook integration |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../hooks/claude/user-prompt-submit.ts` | Claude prompt-time hook implementation |
| `../../compat/index.ts` | Native advisor compatibility entrypoint |
| `../../tests/legacy/advisor-runtime-parity.vitest.ts` | Runtime parity coverage |
| `../../tests/hooks/settings-driven-invocation-parity.vitest.ts` | Hook invocation parity coverage |

---

## 5. SOURCE METADATA

- Group: Hook Integration
- Playbook ID: SAD-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--hook-integration/001-claude-user-prompt-submit-additional-context.md`
