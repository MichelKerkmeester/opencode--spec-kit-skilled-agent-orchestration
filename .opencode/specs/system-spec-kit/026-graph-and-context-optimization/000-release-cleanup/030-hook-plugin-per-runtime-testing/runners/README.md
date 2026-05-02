---
title: "Runtime Hook Runner Quickstart"
description: "Operator quickstart for live per-runtime hook and plugin validation."
trigger_phrases:
  - "runtime hook tests"
  - "per-runtime hook validation"
importance_tier: "important"
contextType: "implementation"
---
# Runtime Hook Runner Quickstart

<!-- SPECKIT_LEVEL: 2 -->

## Overview

These runners exercise the live hook/plugin surfaces for Claude Code, Codex CLI, GitHub Copilot CLI, Gemini CLI, and the OpenCode plugin bridge. Each runner invokes the runtime CLI, then captures the deterministic hook or plugin observable needed to classify the cell.

## Run

Canonical live verdicts must be run from a normal operator shell, not from inside
`codex exec` or another sandboxed parent process:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests
```

Equivalent direct runner:

```bash
node --import ./.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs \
  specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts
```

Results are written as JSONL under:

```text
specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/run-output/latest/
```

The original `results/*.jsonl` files are preserved as historical evidence from
the first matrix run. Set `RUNTIME_HOOK_RESULTS_DIR=/path/to/dir` to store a new
run elsewhere.

## Sandbox Mode

When the runner is launched from a sandboxed parent such as:

```bash
codex exec --sandbox workspace-write \
  "npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests"
```

it detects the sandbox, runs only direct hook/plugin smokes, and records live CLI
cells as `SKIPPED_SANDBOX`. This mode is useful for checking deterministic hook
code paths, but it is not a live runtime verdict.

Sandbox detection checks, in order:

| Method | Detection |
|--------|-----------|
| `env:CODEX_SANDBOX` | `CODEX_SANDBOX` is present |
| `env:SANDBOX_PROFILE` | `SANDBOX_PROFILE` is present |
| `home-mismatch` | `HOME` differs from the OS-level user home |
| `home-write-probe` | writing `~/.tmp-sandbox-probe-${pid}` fails with `EPERM` or `EACCES` |

## Statuses

| Status | Meaning |
|--------|---------|
| PASS | Expected hook artifact was observed |
| FAIL | Runtime or hook ran, but the expected artifact was absent |
| SKIPPED | Required binary or config was not present |
| SKIPPED_SANDBOX | Live CLI invocation was skipped because sandbox detection fired |
| TIMEOUT_CELL | The runtime or hook command exceeded the 300s timeout |

## Notes

- The orchestrator runs at most three runtime cells concurrently.
- The runners do not edit runtime hook configs.
- Copilot uses an isolated `SPECKIT_COPILOT_INSTRUCTIONS_PATH` so the live test does not overwrite the operator's default custom-instructions file.
- Provider auth, quota, and upstream CLI failures are captured in the JSONL evidence only when running outside the sandbox.
