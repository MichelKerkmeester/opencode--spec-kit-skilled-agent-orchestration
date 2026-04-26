---
title: "CX-016 -- --full-auto + native hook integration"
description: "This scenario validates --full-auto plus native Codex hooks for `CX-016`. It focuses on confirming Spec Kit Memory's SessionStart and UserPromptSubmit hooks fire and inject the advisor brief."
---

# CX-016 -- --full-auto + native hook integration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-016`.

---

## 1. OVERVIEW

This scenario validates `--full-auto` plus native Codex hook integration for `CX-016`. It focuses on confirming `codex --enable codex_hooks` (or `[features].codex_hooks = true` in config) plus `--full-auto` runs the documented Spec Kit Memory hooks at `SessionStart` and `UserPromptSubmit`, with the advisor brief injected into model context.

### Why This Matters

`references/hook_contract.md` documents the native-hook surface (Codex CLI 0.122.0+) and Spec Kit Memory's wiring at `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/{session-start,user-prompt-submit}.js`. If the hooks fail to load, every session in this skill loses startup context and the Skill Advisor brief - a major regression for the AGENTS.md Gate 2 routing surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex --enable codex_hooks` plus `--full-auto` runs the Spec Kit Memory hooks at SessionStart and UserPromptSubmit and that the advisor brief is injected.
- Real user request: `Confirm Codex's native hooks are wired into Spec Kit Memory and the skill advisor still surfaces.`
- Prompt: `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator validating Codex hook parity, FIRST verify ~/.codex/hooks.json contains entries for SessionStart and UserPromptSubmit pointing at .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/{session-start,user-prompt-submit}.js, THEN dispatch codex --enable codex_hooks exec --full-auto "Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts" with --model gpt-5.5 -c service_tier="fast". Verify the hook stdout contract is satisfied (session-start emits {} or hookSpecificOutput.additionalContext; user-prompt-submit emits an Advisor: brief). Return a verdict naming the hook script paths and confirming the advisor brief surfaced.`
- Expected execution process: Operator inspects `~/.codex/hooks.json` -> runs the documented manual smoke checks from `hook_contract.md` §6 -> dispatches `codex --enable codex_hooks exec --full-auto` with the smoke-test prompt -> captures stdout -> verifies the hook scripts are reachable.
- Expected signals: `~/.codex/hooks.json` lists both hooks at the documented paths. Manual smoke checks emit `{}` or `hookSpecificOutput.additionalContext` for SessionStart and an `Advisor:`-prefixed brief for UserPromptSubmit. `codex --enable codex_hooks exec --full-auto` exits 0. The test file is written.
- Desired user-visible outcome: Evidence that Spec Kit Memory's startup context and skill-advisor brief are wired into Codex via the documented hook contract.
- Pass/fail: PASS if hooks.json lists both entries at the documented paths AND both manual smoke checks succeed AND the `codex --enable codex_hooks` dispatch exits 0. FAIL if hooks.json is missing entries, smoke checks fail or dispatch errors out.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect `~/.codex/hooks.json` and confirm both hook entries are present.
2. Run the documented manual smoke checks from `hook_contract.md` §6 for SessionStart and UserPromptSubmit.
3. Dispatch `codex --enable codex_hooks exec --full-auto` with the test prompt.
4. Verify exit 0 and the test file is written.
5. Return a verdict naming the hook paths and confirming the advisor brief surfaced.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-016 | --full-auto + native hook integration | Verify Spec Kit Memory hooks fire under --full-auto and inject the advisor brief | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator validating Codex hook parity, FIRST verify ~/.codex/hooks.json contains entries for SessionStart and UserPromptSubmit pointing at .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/{session-start,user-prompt-submit}.js, THEN dispatch codex --enable codex_hooks exec --full-auto "Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts" with --model gpt-5.5 -c service_tier="fast". Verify the hook stdout contract is satisfied (session-start emits {} or hookSpecificOutput.additionalContext; user-prompt-submit emits an Advisor: brief). Return a verdict naming the hook script paths and confirming the advisor brief surfaced.` | 1. `bash: cat ~/.codex/hooks.json \| jq '.hooks.SessionStart, .hooks.UserPromptSubmit' > /tmp/cli-codex-cx016-hooks.json` -> 2. `bash: printf '%s\n' '{"session_id":"cx016","hook_event_name":"SessionStart","source":"startup","cwd":"'"$PWD"'","model":"gpt-5.5","permission_mode":"default"}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js > /tmp/cli-codex-cx016-session-start.json 2>&1` -> 3. `bash: printf '%s\n' '{"prompt":"implement TypeScript hook smoke test","cwd":"'"$PWD"'"}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js > /tmp/cli-codex-cx016-prompt-submit.json 2>&1` -> 4. `bash: rm -rf /tmp/cli-codex-playbook-cx016 && mkdir -p /tmp/cli-codex-playbook-cx016 && codex --enable codex_hooks exec --full-auto --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" "Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts: a function that returns { ok: true } when called." > /tmp/cli-codex-cx016-stdout.txt 2>&1` -> 5. `bash: ls /tmp/cli-codex-playbook-cx016/hook.ts && cat /tmp/cli-codex-playbook-cx016/hook.ts && grep -i "advisor" /tmp/cli-codex-cx016-prompt-submit.json` | Step 1: hooks.json includes SessionStart and UserPromptSubmit pointing at the documented paths; Step 2: stdout is `{}` or contains `hookSpecificOutput.additionalContext`; Step 3: stdout contains `Advisor:` prefix; Step 4: exit 0; Step 5: hook.ts exists with `{ ok: true }` body AND the prompt-submit smoke output contained `Advisor:` | hooks.json snapshot, both smoke-check stdouts, captured Codex stdout, generated hook.ts file, dispatched command line, exit code | PASS if hooks.json has both entries at the documented paths AND both smoke checks emit the documented output AND the codex dispatch exits 0 with a generated hook.ts; FAIL if hooks.json missing entries, smoke checks emit empty/error output, or dispatch fails | (1) Re-read `references/hook_contract.md` §6 Manual Smoke Checks; (2) confirm Codex CLI is at version >= 0.122.0 (`codex --version`); (3) verify `[features].codex_hooks = true` in `~/.codex/config.toml`; (4) inspect smoke-check stderr for missing-script errors |

### Optional Supplemental Checks

- Run a third smoke check with `source: "resume"` for SessionStart and confirm the hook handles all three documented `source` values (startup, resume, clear).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/hook_contract.md` (§1 Activation, §2 Registration, §6 Spec Kit Memory Wiring) | Authoritative hook contract |
| `../../references/cli_reference.md` (§4 Command-Line Flags - --full-auto) | Documents --full-auto |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/hook_contract.md` | Native hook contract documentation |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js` | Spec Kit Memory SessionStart hook |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js` | Spec Kit Memory UserPromptSubmit hook |
| `~/.codex/hooks.json` | Operator-side hook registration |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CX-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/001-full-auto-hooks.md`
