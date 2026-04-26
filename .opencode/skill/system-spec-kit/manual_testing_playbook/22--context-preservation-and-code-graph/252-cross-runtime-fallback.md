---
title: "252 -- Runtime-aware recovery across Claude, Codex, Copilot, and Gemini"
description: "This scenario validates Cross-runtime fallback for 252. It focuses on runtime detection plus native-hook, hookless, and config-driven recovery behavior."
audited_post_018: true
phase_018_change: "Reframed recovery so hook-limited runtimes fall back through /spec_kit:resume and the canonical packet continuity ladder."
---

# 252 -- Runtime-aware recovery across supported runtimes

## 1. OVERVIEW

This scenario validates Cross-runtime fallback.

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that runtime detection reports the correct hook policy per runtime. Claude Code must report native hooks, Codex CLI must report `live` or `partial` based on local Codex/settings availability, Copilot CLI must report wrapper-backed hook wiring from `.claude/settings.local.json` while delivering prompt-time context through the managed custom-instructions block, and Gemini CLI must follow repo-configured hook wiring before falling back to `/spec_kit:resume`.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Environment variables can be simulated in test fixtures (e.g., `CODEX_CLI=1`, `COPILOT_CLI=1`, `GEMINI_CLI=1`)
- **Prompt**: `As a context-and-code-graph validation operator, validate Cross-runtime fallback against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify Claude Code reports native hooks, Codex CLI reports live or partial hook policy from local Codex/settings availability, Copilot CLI derives hookPolicy from `.claude/settings.local.json` wrapper wiring plus managed custom-instructions refresh, and Gemini CLI derives hookPolicy from repo config before falling back to /spec_kit:resume. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests in `runtime-detection.vitest.ts` pass
  - Claude Code: `{ runtime: 'claude-code', hookPolicy: 'enabled' }`
  - Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'live' }` when Codex is installed and repo `.codex/settings.json` is valid; `partial` when Codex is installed but settings are missing or invalid; `unavailable` only when the probe fails.
  - Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo when `.claude/settings.local.json` exposes Copilot-safe top-level `type` / `bash` / `timeoutSec` wrapper fields and the `UserPromptSubmit` / `SessionStart` writer commands; `userPromptSubmitted` should print `{}` and refresh `SPEC-KIT-COPILOT-CONTEXT` in custom instructions; otherwise `disabled_by_scope`
  - Gemini CLI: `{ runtime: 'gemini-cli', hookPolicy: 'enabled' }` only when `.gemini/settings.json` contains hooks; otherwise `disabled_by_scope` or `unavailable`
  - `areHooksAvailable()` and `getRecoveryApproach()` follow the detected hookPolicy instead of a hardcoded per-runtime answer
- **Pass/fail criteria**:
  - PASS: Each runtime is correctly detected from env vars, hookPolicy matches the current runtime/config reality, Copilot custom-instructions refresh is recognized as the enabled prompt-time transport, and fallback only appears when hooks are unavailable or disabled_by_scope and routes through /spec_kit:resume
  - FAIL: Any runtime misidentified, hookPolicy incorrect, or hooks reported as available for a runtime/config state that should fall back

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Claude Code native hook detection against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify detectRuntime() with CLAUDE_CODE=1 returns { runtime: 'claude-code', hookPolicy: 'enabled' }. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts

### Expected

detectRuntime()` with `CLAUDE_CODE=1` returns `{ runtime: 'claude-code', hookPolicy: 'enabled' }`

### Evidence

Test output showing detection result

### Pass / Fail

- **Pass**: claude-code detected with enabled hookPolicy
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check env var detection order in `runtime-detection.ts` for `CLAUDE_CODE`, `CLAUDE_SESSION_ID`, or MCP server identity.

---

### Prompt

```
As a context-and-code-graph validation operator, validate Codex CLI detected with hookPolicy=live or partial against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify detectRuntime() with CODEX_CLI=1 returns { runtime: 'codex-cli', hookPolicy: 'live' } when Codex is installed and repo .codex/settings.json is valid, or partial when settings are missing/invalid. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts

### Expected

detectRuntime()` with `CODEX_CLI=1` returns `{ runtime: 'codex-cli', hookPolicy: 'live' }` in a repo with valid `.codex/settings.json`, or `partial` when settings are absent/invalid.

### Evidence

Test output showing detection result

### Pass / Fail

- **Pass**: codex-cli detected with live/partial hookPolicy according to local Codex/settings availability
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check env var detection order in `runtime-detection.ts` — CODEX_CLI or CODEX_SANDBOX

---

### Prompt

```
As a context-and-code-graph validation operator, validate Copilot CLI detects wrapper-backed hook wiring dynamically against cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts. Verify detectRuntime() with COPILOT_CLI=1 returns { runtime: 'copilot-cli', hookPolicy: 'enabled' } in this repo when `.claude/settings.local.json` carries the Copilot-safe top-level wrapper fields plus the `UserPromptSubmit` / `SessionStart` writer commands, and disabled_by_scope in a temp repo without that wrapper config. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. jq '{UserPromptSubmit: (.hooks.UserPromptSubmit[0] | {type, bash, timeoutSec}), SessionStart: (.hooks.SessionStart[0] | {type, bash, timeoutSec})}' .claude/settings.local.json
2. cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts

### Expected

detectRuntime()` with `COPILOT_CLI=1` returns `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo when `.claude/settings.local.json` exposes top-level `type` / `bash` / `timeoutSec` fields and the Copilot writer commands, and `disabled_by_scope` in a temp repo without that wrapper config.

### Evidence

Wrapper-field inspection plus test output showing both branches

### Pass / Fail

- **Pass**: both enabled and missing-config branches are covered, and the checked-in wrapper fields point `UserPromptSubmit` / `SessionStart` at the Copilot writers
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `.claude/settings.local.json` for top-level `type`, `bash`, and `timeoutSec` on `UserPromptSubmit` / `SessionStart`, confirm those wrappers invoke `dist/hooks/copilot/user-prompt-submit.js` and `dist/hooks/copilot/session-prime.js`, then re-check the temp-dir missing-wrapper branch and the `SPECKIT_COPILOT_INSTRUCTIONS_PATH` target.

### Copilot custom-instructions transport check

When the runtime detection branch reports Copilot hooks as enabled, verify the prompt-time transport separately through the wrapper-configured `UserPromptSubmit` path:

```bash
export SPECKIT_COPILOT_INSTRUCTIONS_PATH="$(mktemp -d)/copilot-instructions.md"
jq '.hooks.UserPromptSubmit[0] | {type, bash, timeoutSec}' .claude/settings.local.json
printf '%s' '{"prompt":"implement TypeScript hook remediation","cwd":"'"$PWD"'"}' | \
  bash -lc "$(jq -r '.hooks.UserPromptSubmit[0].bash' .claude/settings.local.json)"
rg -n "SPEC-KIT-COPILOT-CONTEXT|Active Advisor Brief|Advisor:" "$SPECKIT_COPILOT_INSTRUCTIONS_PATH"
```

Pass when the wrapper inspection shows the top-level Copilot-safe fields, stdout is `{}`, and the temp custom-instructions file contains the managed Spec Kit block with an advisor brief.

---

### Prompt

```
As a context-and-code-graph validation operator, validate Gemini CLI fallback remains config-driven against cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts. Verify detectRuntime() with GEMINI_CLI=1 returns hookPolicy based on .gemini/settings.json, and getRecoveryApproach() follows it. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts

### Expected

`detectRuntime()` with `GEMINI_CLI=1` returns hookPolicy based on `.gemini/settings.json`, and `getRecoveryApproach()` follows it

### Evidence

Test output showing detection and recovery approach

### Pass / Fail

- **Pass**: gemini-cli still respects config-driven fallback
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check env var detection for GEMINI_CLI or GOOGLE_GENAI_USE_VERTEXAI

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/05-cross-runtime-fallback.md](../../feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 252
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`
