---
title: "253 -- Runtime detection outputs"
description: "This scenario validates Runtime detection for 253. It focuses on runtime + hookPolicy for all 4 runtimes."
---

# 253 -- Runtime detection outputs

## 1. OVERVIEW

This scenario validates Runtime detection.

---

## 2. CURRENT REALITY

- **Objective**: Verify that `detectRuntime()` correctly identifies all 4 supported runtimes (claude-code, codex-cli, copilot-cli, gemini-cli) plus the unknown fallback from environment variables, and assigns the correct `hookPolicy` to each. Also verify the helper functions `areHooksAvailable()` and `getRecoveryApproach()` return correct values per runtime.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Tests must be able to simulate environment variables for each runtime
- **Prompt**: `Validate 253 Runtime detection behavior. Run the vitest suite for runtime-detection and confirm all 5 detection scenarios: (1) CLAUDE_CODE=1 or CLAUDE_SESSION_ID or MCP_SERVER_NAME=context-server yields runtime=claude-code, hookPolicy=enabled, (2) CODEX_CLI=1 or CODEX_SANDBOX yields runtime=codex-cli, hookPolicy=unavailable, (3) COPILOT_CLI=1 or GITHUB_COPILOT_TOKEN yields runtime=copilot-cli, hookPolicy=disabled_by_scope, (4) GEMINI_CLI=1 or GOOGLE_GENAI_USE_VERTEXAI yields runtime=gemini-cli, hookPolicy=disabled_by_scope, (5) no matching env vars yields runtime=unknown, hookPolicy=unknown.`
- **Expected signals**:
  - All vitest tests in `runtime-detection.vitest.ts` pass
  - Claude Code: `{ runtime: 'claude-code', hookPolicy: 'enabled' }` — `areHooksAvailable()` returns `true`, `getRecoveryApproach()` returns `'hooks'`
  - Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }` — `areHooksAvailable()` returns `false`
  - Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'disabled_by_scope' }` — `areHooksAvailable()` returns `false`
  - Gemini CLI: `{ runtime: 'gemini-cli', hookPolicy: 'disabled_by_scope' }` — `areHooksAvailable()` returns `false`
  - Unknown: `{ runtime: 'unknown', hookPolicy: 'unknown' }` — `areHooksAvailable()` returns `false`
  - Detection priority: claude-code checked first, then codex, copilot, gemini (first match wins)
- **Pass/fail criteria**:
  - PASS: All 5 runtime/hookPolicy combinations correct, helper functions return expected values, detection priority respected
  - FAIL: Any runtime misidentified, hookPolicy wrong, or detection order incorrect (e.g., codex env vars matching claude-code)

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 253a | Runtime detection | Claude Code detected with hookPolicy=enabled and hooks available | `Validate 253a claude-code detection` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | `CLAUDE_CODE=1` yields `{ runtime: 'claude-code', hookPolicy: 'enabled' }`, `areHooksAvailable()` returns true, `getRecoveryApproach()` returns 'hooks' | Test output showing detection and helper results | PASS if claude-code identified with enabled hooks | Check env var checks: CLAUDE_CODE, CLAUDE_SESSION_ID, MCP_SERVER_NAME |
| 253b | Runtime detection | All 4 runtimes produce correct hookPolicy values | `Validate 253b all runtime hookPolicies` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | claude-code=enabled, codex-cli=unavailable, copilot-cli=disabled_by_scope, gemini-cli=disabled_by_scope | Test output showing all hookPolicy values | PASS if all 4 hookPolicy values match expected | Verify `HookPolicy` type union covers all values |
| 253c | Runtime detection | Unknown runtime fallback when no env vars match | `Validate 253c unknown fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | No matching env vars yields `{ runtime: 'unknown', hookPolicy: 'unknown' }` | Test output showing unknown detection | PASS if clean environment returns unknown/unknown | Ensure test clears all runtime-related env vars before assertion |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/06-runtime-detection.md](../../feature_catalog/22--context-preservation-and-code-graph/06-runtime-detection.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 253
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/253-runtime-detection.md`
