---
title: "Findings: Hook Plugin Per Runtime Testing"
description: "Live runtime hook and plugin matrix with JSONL evidence."
trigger_phrases:
  - "043-hook-plugin-per-runtime-testing"
  - "runtime hook tests"
  - "per-runtime hook validation"
  - "cli skill hook tests"
  - "hook live testing"
importance_tier: "important"
contextType: "implementation"
---
# Findings: Hook Plugin Per Runtime Testing

## Amendment (044): Corrected Verdict

The original verdict below misattributed the live CLI failures to operator auth,
keychain, or runtime setup. The actual evidence in `results/*.jsonl` shows the
runner executed inside a `codex exec --sandbox workspace-write` parent process.
That sandbox blocked or stripped the child CLIs' access to user auth state,
config, keychain, and state directories.

The hook and plugin code itself passed deterministic direct smokes in all five
runtime cells. The correct classification for the live CLI layer is
`BLOCKED_BY_TEST_SANDBOX`, not runtime hook failure.

## Corrected Matrix

| Runtime | Event | Corrected Status | Previous Status | Evidence | Corrected Cause |
|---------|-------|------------------|-----------------|----------|-----------------|
| Claude Code | UserPromptSubmit | BLOCKED_BY_TEST_SANDBOX | FAIL | `results/claude-user-prompt-submit.jsonl:1` | `claude -p` reported `Not logged in` because the sandboxed child process could not access its credentials; the direct hook emitted `additionalContext`. |
| Codex CLI | UserPromptSubmit freshness | BLOCKED_BY_TEST_SANDBOX | FAIL | `results/codex-user-prompt-submit-freshness.jsonl:1` | Child `codex exec` could not create session files under `~/.codex/sessions` because the parent sandbox blocked writes outside the workspace. |
| GitHub Copilot CLI | userPromptSubmitted next prompt | BLOCKED_BY_TEST_SANDBOX | FAIL | `results/copilot-user-prompt-submitted-next-prompt.jsonl:1` | The sandboxed child could not reach macOS keychain and failed with `SecItemCopyMatching failed -50`; the direct hook refreshed isolated managed instructions. |
| Gemini CLI | BeforeAgent additionalContext | BLOCKED_BY_TEST_SANDBOX | TIMEOUT_CELL | `results/gemini-before-agent-additional-context.jsonl:1` | The sandboxed child did not find auth state and fell back to interactive browser authentication despite `-y`; the direct hook emitted `additionalContext`. |
| OpenCode plugin bridge | plugin system transform | BLOCKED_BY_TEST_SANDBOX | FAIL | `results/opencode-plugin-system-transform.jsonl:1` | The sandbox blocked writes to `~/.local/state/opencode/locks/`; the direct plugin transform appended advisor context. |

## Corrected Aggregate

| Layer | PASS | FAIL | BLOCKED_BY_TEST_SANDBOX |
|-------|------|------|-------------------------|
| Direct hook/plugin smoke | 5 | 0 | 0 |
| Live CLI invocation | 0 | 0 | 5 |

Live CLI verdicts are deferred until the runner is executed from a normal
operator shell. A sandboxed parent cannot validate CLIs that require access to
the user's real auth state, keychain, home config, or runtime state directories.

## Direct Hook/Plugin Smoke Verdict

| Runtime | Direct Smoke Result | Evidence |
|---------|---------------------|----------|
| Claude Code | PASS | `hookSpecificOutput.additionalContext` emitted by `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:186`. |
| Codex CLI | PASS | Stale timeout fallback and freshness smoke fields emitted by `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:194` and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:28`. |
| GitHub Copilot CLI | PASS | Hook returned `{}` and wrote the managed next-prompt context via `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:233` and `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:122`. |
| Gemini CLI | PASS | `hookSpecificOutput.additionalContext` emitted by `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:200`. |
| OpenCode plugin bridge | PASS | Plugin transform appended advisor context through `.opencode/plugins/spec-kit-skill-advisor.js:627` and `.opencode/plugins/spec-kit-skill-advisor.js:663`. |

## Operator Remediation

Run the amended runner from a normal shell for the canonical live CLI verdict:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests
```

Running the same command under `codex exec --sandbox workspace-write` now records
direct smokes as `PASS` or `FAIL` and records live CLI cells as
`SKIPPED_SANDBOX`. That sandbox mode is a partial methodology check, not a live
runtime verdict.

## Original (incorrect) verdict

### Verdict

**FAIL in this host.** All five runtime binaries and configs were present, so no cell was SKIPPED. The live CLI layer did not produce a PASS: Claude, Codex, Copilot, and OpenCode failed before usable model execution, and Gemini timed out at an interactive auth prompt.

Direct hook/plugin smokes did produce useful signals for Claude, Codex, Copilot, Gemini, and OpenCode, but the cell contract requires the runtime CLI to execute successfully too.

### Matrix

| Runtime | Event | Status | Result Evidence | Primary Cause |
|---------|-------|--------|-----------------|---------------|
| Claude Code | UserPromptSubmit | FAIL | `results/claude-user-prompt-submit.jsonl:1` | `claude -p` returned `Not logged in`; direct hook emitted `additionalContext` |
| Codex CLI | UserPromptSubmit freshness | FAIL | `results/codex-user-prompt-submit-freshness.jsonl:1` | `codex exec` could not access `~/.codex/sessions`; direct hook emitted stale timeout fallback |
| GitHub Copilot CLI | userPromptSubmitted next prompt | FAIL | `results/copilot-user-prompt-submitted-next-prompt.jsonl:1` | `copilot` failed keychain lookup with `SecItemCopyMatching failed -50`; direct hook wrote isolated managed instructions |
| Gemini CLI | BeforeAgent additionalContext | TIMEOUT_CELL | `results/gemini-before-agent-additional-context.jsonl:1` | `gemini` waited at browser authentication prompt for 300s; direct hook emitted `additionalContext` |
| OpenCode plugin bridge | plugin system transform | FAIL | `results/opencode-plugin-system-transform.jsonl:1` | `opencode run` failed creating state locks under the user state dir; direct plugin transform appended advisor context |

### Aggregate

| Status | Count |
|--------|-------|
| PASS | 0 |
| FAIL | 4 |
| SKIPPED | 0 |
| TIMEOUT_CELL | 1 |

### Failures

#### Claude Code

Assertion failed: Claude UserPromptSubmit should emit `hookSpecificOutput.additionalContext` containing an advisor brief during a live runtime invocation.

Evidence: the CLI returned `Not logged in`; the direct hook command returned JSON with `hookSpecificOutput.additionalContext`. The source that produces the model-visible context is `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:186`.

Remediation: run `claude` login/setup for this host, then rerun `runners/run-all-runtime-hooks.ts`.

#### Codex CLI

Assertion failed: Codex prompt hook should expose stale timeout fallback and freshness smoke output during a live runtime invocation.

Evidence: `codex exec` failed before session creation because this sandbox could not access `/Users/michelkerkmeester/.codex/sessions`. The direct hook emitted the stale fallback from `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:194`, and the freshness helper from `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:28` returned JSON with `fresh`, `lastUpdateAt`, and `latencyMs`.

Remediation: run from an environment where Codex can read/write its session store, then rerun the cell. No doc contract drift surfaced.

#### GitHub Copilot CLI

Assertion failed: Copilot hook should return `{}` and refresh managed custom instructions for the next prompt during a live runtime invocation.

Evidence: `copilot` failed before model execution with `SecItemCopyMatching failed -50`. The direct hook returned `{}` and wrote a temp managed block using the code path at `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:233` and `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:122`.

Remediation: fix Copilot keychain/auth in the operator environment. The checked config still routes through the Superset wrapper, so a follow-up should decide whether that is intended runtime policy or the known wrapper-parity drift.

#### OpenCode

Assertion failed: OpenCode plugin should append an advisor brief through `experimental.chat.system.transform` during a live runtime invocation.

Evidence: `opencode run` failed while creating its user-state lock directory. The direct plugin transform appended advisor context through `.opencode/plugins/spec-kit-skill-advisor.js:627` and exposes the transform hook at `.opencode/plugins/spec-kit-skill-advisor.js:663`.

Remediation: run with an OpenCode state directory writable by the process, then rerun the cell. No hook contract doc change is needed from this result.

### Timeout

#### Gemini CLI

Assertion timed out: Gemini BeforeAgent should emit `hookSpecificOutput.additionalContext` containing an advisor brief during a live runtime invocation.

Evidence: `gemini` opened an authentication prompt and waited until the 300s cell timeout. The direct hook emitted `additionalContext` from `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:200`.

Remediation: complete Gemini authentication non-interactively or in a prepared shell, then rerun the cell.

### Skips

No cells were skipped. All binaries and runtime config files were present in this host.

### Follow-Up Tickets

| Ticket | Scope | Maps To |
|--------|-------|---------|
| runtime-auth-preflight | Add an operator preflight that checks Claude/Gemini auth and Copilot keychain before live hook runs. | Claude, Copilot, Gemini |
| runtime-state-permissions | Document or parameterize writable runtime state paths for Codex and OpenCode under sandboxed execution. | Codex, OpenCode |
| copilot-wrapper-parity | Decide whether `.github/hooks/superset-notify.json` should keep Superset wrapper routing or repo-local writer scripts. | Copilot |

### Evidence Hygiene

Result files store snippets only. Key-like config values are redacted before JSONL write, and the result directory was checked for unredacted API-key patterns.
