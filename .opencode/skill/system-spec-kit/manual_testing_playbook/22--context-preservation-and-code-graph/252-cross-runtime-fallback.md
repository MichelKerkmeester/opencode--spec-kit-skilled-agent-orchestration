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

## 2. CURRENT REALITY

- **Objective**: Verify that runtime detection reports the correct hook policy per runtime. Claude Code must report native hooks, Codex CLI must remain hookless, and Copilot CLI / Gemini CLI must follow repo-configured hook wiring before falling back to `/spec_kit:resume`.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Environment variables can be simulated in test fixtures (e.g., `CODEX_CLI=1`, `COPILOT_CLI=1`, `GEMINI_CLI=1`)
- **Prompt**: `As a context-and-code-graph validation operator, validate Cross-runtime fallback against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify Claude Code reports native hooks, Codex CLI remains hookless, and Copilot CLI plus Gemini CLI derive hookPolicy from repo/config wiring before falling back to /spec_kit:resume. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests in `runtime-detection.vitest.ts` pass
  - Claude Code: `{ runtime: 'claude-code', hookPolicy: 'enabled' }`
  - Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }`
  - Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo when `.github/hooks/*.json` contains `sessionStart`; otherwise `disabled_by_scope`
  - Gemini CLI: `{ runtime: 'gemini-cli', hookPolicy: 'enabled' }` only when `.gemini/settings.json` contains hooks; otherwise `disabled_by_scope` or `unavailable`
  - `areHooksAvailable()` and `getRecoveryApproach()` follow the detected hookPolicy instead of a hardcoded per-runtime answer
- **Pass/fail criteria**:
  - PASS: Each runtime is correctly detected from env vars, hookPolicy matches the current runtime/config reality, and fallback only appears when hooks are unavailable or disabled_by_scope and routes through /spec_kit:resume
  - FAIL: Any runtime misidentified, hookPolicy incorrect, or hooks reported as available for non-Claude runtime

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
As a context-and-code-graph validation operator, validate Codex CLI detected with hookPolicy=unavailable against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify detectRuntime() with CODEX_CLI=1 returns { runtime: 'codex-cli', hookPolicy: 'unavailable' }. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts

### Expected

detectRuntime()` with `CODEX_CLI=1` returns `{ runtime: 'codex-cli', hookPolicy: 'unavailable' }

### Evidence

Test output showing detection result

### Pass / Fail

- **Pass**: codex-cli detected with unavailable hookPolicy
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check env var detection order in `runtime-detection.ts` — CODEX_CLI or CODEX_SANDBOX

---

### Prompt

```
As a context-and-code-graph validation operator, validate Copilot CLI detects repo hook wiring dynamically against cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts. Verify detectRuntime() with COPILOT_CLI=1 returns { runtime: 'copilot-cli', hookPolicy: 'enabled' } in this repo and disabled_by_scope in a temp repo without .github/hooks/*.json. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts

### Expected

detectRuntime()` with `COPILOT_CLI=1` returns `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo and `disabled_by_scope` in a temp repo without `.github/hooks/*.json

### Evidence

Test output showing both branches

### Pass / Fail

- **Pass**: both enabled and missing-config branches are covered
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check repo `.github/hooks/*.json` and temp-dir no-hook branch

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
