---
title: "Methodology Correction: Hook Test Sandbox Fix"
description: "Root-cause analysis for the sandboxed live runtime hook test failures and the corrected operator-run methodology."
trigger_phrases:
  - "031-hook-test-sandbox-fix"
  - "hook test methodology"
  - "sandbox detection"
  - "BLOCKED_BY_TEST_SANDBOX"
  - "operator-run-outside-sandbox"
importance_tier: "important"
contextType: "implementation"
---
# Methodology Correction: Hook Test Sandbox Fix

## Root Cause

The prior live runtime hook matrix did not fail because the hook or plugin code
was broken. It failed because the test runner launched runtime CLIs from inside a
`codex exec --sandbox workspace-write` parent process.

That sandbox permits child processes to write inside the workspace, but the live
CLIs need user-level state outside the workspace:

| Runtime | Blocked Surface | Observed Evidence |
|---------|-----------------|-------------------|
| Claude Code | Credential access | `claude -p` returned `Not logged in`; direct hook emitted `additionalContext`. |
| Codex CLI | `~/.codex/sessions` writes | Child `codex exec` failed with permission denied creating session files. |
| GitHub Copilot CLI | macOS keychain | Child `copilot` failed with `SecItemCopyMatching failed -50`. |
| Gemini CLI | Auth state/config | Child `gemini` opened browser auth and timed out despite `-y`. |
| OpenCode | `~/.local/state/opencode/locks` writes | Child `opencode run` failed with `EPERM` creating a lock directory. |

The direct hook/plugin smokes all passed, which isolates the failure to the live
CLI execution environment rather than the hook code.

## Corrected Methodology

The runner now has two modes:

| Mode | Parent Environment | What Runs | Verdict Meaning |
|------|--------------------|-----------|-----------------|
| Operator live mode | Normal shell | Direct smokes plus live CLI cells | Canonical live verdict |
| Sandbox partial mode | `codex exec` or equivalent sandbox | Direct smokes only; live CLI cells are `SKIPPED_SANDBOX` | Hook-code smoke verdict only |

`SKIPPED_SANDBOX` is intentionally separate from `SKIPPED`. `SKIPPED` still
means a binary or config is missing. `SKIPPED_SANDBOX` means the runner detected
that live CLI execution would be invalid because the parent process blocks the
child runtime from user state.

## Detection

Sandbox detection checks:

1. `CODEX_SANDBOX` environment variable.
2. `SANDBOX_PROFILE` environment variable.
3. `HOME` mismatch against the OS-level home directory.
4. Failed write probe to `~/.tmp-sandbox-probe-${pid}` with `EPERM` or `EACCES`.

The detection reason and method are recorded in the live cell evidence when a
cell is skipped.

## Operator Path

Run this from a normal shell for the actual live CLI verdict:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests
```

Run this only for a sandbox-safe direct-smoke verdict:

```bash
codex exec --sandbox workspace-write \
  "npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests"
```

The second command should produce direct-smoke `PASS` or `FAIL` cells and live
CLI `SKIPPED_SANDBOX` cells. It must not be used to judge runtime auth health.

