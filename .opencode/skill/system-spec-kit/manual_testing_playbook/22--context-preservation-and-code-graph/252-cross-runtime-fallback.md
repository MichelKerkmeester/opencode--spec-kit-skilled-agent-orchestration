---
title: "252 -- Tool-based recovery on hook-limited runtimes"
description: "This scenario validates Cross-runtime fallback for 252. It focuses on Runtime detection and tool-based fallback for Codex and dynamically configured Copilot/Gemini."
audited_post_018: true
phase_018_change: "Reframed recovery so hook-limited runtimes fall back through /spec_kit:resume and the canonical packet continuity ladder."
---

# 252 -- Tool-based recovery on non-hook runtimes

## 1. OVERVIEW

This scenario validates Cross-runtime fallback.

---

## 2. CURRENT REALITY

- **Objective**: Verify that runtimes without active hook wiring fall back to tools correctly. Codex CLI remains hookless, while Copilot CLI and Gemini CLI are now dynamic: they report hooks when the current repo/config exposes `sessionStart` wiring and otherwise fall back to the canonical tool path through `/spec_kit:resume`. CLAUDE.md and agent definitions must still preserve tool-based recovery whenever hook context is unavailable.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Environment variables can be simulated in test fixtures (e.g., `CODEX_CLI=1`, `COPILOT_CLI=1`, `GEMINI_CLI=1`)
- **Prompt**: `As a context-and-code-graph validation operator, validate Tool-based recovery on hook-limited runtimes against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify runtimes without active hook wiring fall back to tools correctly. Codex CLI remains hookless, while Copilot CLI and Gemini CLI are now dynamic: they report hooks when the current repo/config exposes sessionStart wiring and otherwise fall back to the canonical tool path through /spec_kit:resume. CLAUDE.md and agent definitions must still preserve tool-based recovery whenever hook context is unavailable. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests in `runtime-detection.vitest.ts` pass
  - Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }`
  - Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo when `.github/hooks/*.json` contains `sessionStart`; otherwise `disabled_by_scope`
  - Gemini CLI: `{ runtime: 'gemini-cli', hookPolicy: 'enabled' }` only when `.gemini/settings.json` contains hooks; otherwise `disabled_by_scope` or `unavailable`
  - `areHooksAvailable()` and `getRecoveryApproach()` follow the detected hookPolicy instead of a hardcoded per-runtime answer
- **Pass/fail criteria**:
  - PASS: Each runtime is correctly detected from env vars, dynamic hookPolicy matches the current repo/config state, and fallback only appears when hooks are unavailable or disabled_by_scope and routes through /spec_kit:resume
  - FAIL: Any runtime misidentified, hookPolicy incorrect, or hooks reported as available for non-Claude runtime

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 252a | Cross-runtime fallback | Codex CLI detected with hookPolicy=unavailable | `As a context-and-code-graph validation operator, validate Codex CLI detected with hookPolicy=unavailable against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify detectRuntime() with CODEX_CLI=1 returns { runtime: 'codex-cli', hookPolicy: 'unavailable' }. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | `detectRuntime()` with `CODEX_CLI=1` returns `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }` | Test output showing detection result | PASS if codex-cli detected with unavailable hookPolicy | Check env var detection order in `runtime-detection.ts` — CODEX_CLI or CODEX_SANDBOX |
| 252b | Cross-runtime fallback | Copilot CLI detects repo hook wiring dynamically | `As a context-and-code-graph validation operator, validate Copilot CLI detects repo hook wiring dynamically against cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts. Verify detectRuntime() with COPILOT_CLI=1 returns { runtime: 'copilot-cli', hookPolicy: 'enabled' } in this repo and disabled_by_scope in a temp repo without .github/hooks/*.json. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts` | `detectRuntime()` with `COPILOT_CLI=1` returns `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo and `disabled_by_scope` in a temp repo without `.github/hooks/*.json` | Test output showing both branches | PASS if both enabled and missing-config branches are covered | Check repo `.github/hooks/*.json` and temp-dir no-hook branch |
| 252c | Cross-runtime fallback | Gemini CLI fallback remains config-driven | `As a context-and-code-graph validation operator, validate Gemini CLI fallback remains config-driven against cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts. Verify detectRuntime() with GEMINI_CLI=1 returns hookPolicy based on .gemini/settings.json, and getRecoveryApproach() follows it. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts` | `detectRuntime()` with `GEMINI_CLI=1` returns hookPolicy based on `.gemini/settings.json`, and `getRecoveryApproach()` follows it | Test output showing detection and recovery approach | PASS if gemini-cli still respects config-driven fallback | Check env var detection for GEMINI_CLI or GOOGLE_GENAI_USE_VERTEXAI |

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
