---
title: "252 -- Tool-based recovery on non-hook runtimes"
description: "This scenario validates Cross-runtime fallback for 252. It focuses on Runtime detection and tool-based fallback for Codex/Copilot/Gemini."
---

# 252 -- Tool-based recovery on non-hook runtimes

## 1. OVERVIEW

This scenario validates Cross-runtime fallback.

---

## 2. CURRENT REALITY

- **Objective**: Verify that runtimes without Claude Code hook support (Codex CLI, Copilot CLI, Gemini CLI) are correctly identified via environment variable detection and receive tool-based fallback recovery instructions instead of hook-based injection. `areHooksAvailable()` must return false for non-Claude runtimes, and `getRecoveryApproach()` must return `"tool_fallback"`. CLAUDE.md and agent definitions must instruct the AI to call `memory_context` and `memory_match_triggers` manually.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Environment variables can be simulated in test fixtures (e.g., `CODEX_CLI=1`, `COPILOT_CLI=1`, `GEMINI_CLI=1`)
- **Prompt**: `Validate 252 Cross-runtime fallback behavior. Run the vitest suite for runtime-detection and confirm: (1) CODEX_CLI=1 or CODEX_SANDBOX env yields runtime=codex-cli with hookPolicy=unavailable, (2) COPILOT_CLI=1 or GITHUB_COPILOT_TOKEN yields runtime=copilot-cli with hookPolicy=disabled_by_scope, (3) GEMINI_CLI=1 or GOOGLE_GENAI_USE_VERTEXAI yields runtime=gemini-cli with hookPolicy=disabled_by_scope, (4) areHooksAvailable() returns false for all three, (5) getRecoveryApproach() returns "tool_fallback" for all three.`
- **Expected signals**:
  - All vitest tests in `runtime-detection.vitest.ts` pass
  - Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }`
  - Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'disabled_by_scope' }`
  - Gemini CLI: `{ runtime: 'gemini-cli', hookPolicy: 'disabled_by_scope' }`
  - `areHooksAvailable()` returns `false` for all three non-Claude runtimes
  - `getRecoveryApproach()` returns `'tool_fallback'` for all three
- **Pass/fail criteria**:
  - PASS: Each non-Claude runtime correctly detected from env vars, hookPolicy matches expected value, recovery approach is tool_fallback
  - FAIL: Any runtime misidentified, hookPolicy incorrect, or hooks reported as available for non-Claude runtime

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 252a | Cross-runtime fallback | Codex CLI detected with hookPolicy=unavailable | `Validate 252a codex fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | `detectRuntime()` with `CODEX_CLI=1` returns `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }` | Test output showing detection result | PASS if codex-cli detected with unavailable hookPolicy | Check env var detection order in `runtime-detection.ts` — CODEX_CLI or CODEX_SANDBOX |
| 252b | Cross-runtime fallback | Copilot CLI detected with hookPolicy=disabled_by_scope | `Validate 252b copilot fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | `detectRuntime()` with `COPILOT_CLI=1` returns `{ runtime: 'copilot-cli', hookPolicy: 'disabled_by_scope' }` | Test output showing detection result | PASS if copilot-cli detected with disabled_by_scope hookPolicy | Check env var detection for COPILOT_CLI or GITHUB_COPILOT_TOKEN |
| 252c | Cross-runtime fallback | Gemini CLI detected with hookPolicy=disabled_by_scope, recovery approach is tool_fallback | `Validate 252c gemini fallback and recovery` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | `detectRuntime()` with `GEMINI_CLI=1` returns `{ runtime: 'gemini-cli', hookPolicy: 'disabled_by_scope' }`, `getRecoveryApproach()` returns `'tool_fallback'` | Test output showing detection and recovery approach | PASS if gemini-cli detected and tool_fallback recovery recommended | Check env var detection for GEMINI_CLI or GOOGLE_GENAI_USE_VERTEXAI |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/05-cross-runtime-fallback.md](../../feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 252
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`
