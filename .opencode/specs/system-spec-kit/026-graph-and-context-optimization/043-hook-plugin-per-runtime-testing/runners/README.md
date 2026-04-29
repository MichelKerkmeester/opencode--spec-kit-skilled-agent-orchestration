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

```bash
.opencode/skill/system-spec-kit/scripts/node_modules/.bin/tsx \
  specs/system-spec-kit/026-graph-and-context-optimization/043-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts
```

Results are written as JSONL under:

```text
specs/system-spec-kit/026-graph-and-context-optimization/043-hook-plugin-per-runtime-testing/results/
```

## Statuses

| Status | Meaning |
|--------|---------|
| PASS | Expected hook artifact was observed |
| FAIL | Runtime or hook ran, but the expected artifact was absent |
| SKIPPED | Required binary or config was not present |
| TIMEOUT_CELL | The runtime or hook command exceeded the 300s timeout |

## Notes

- The orchestrator runs at most three runtime cells concurrently.
- The runners do not edit runtime hook configs.
- Copilot uses an isolated `SPECKIT_COPILOT_INSTRUCTIONS_PATH` so the live test does not overwrite the operator's default custom-instructions file.
- Provider auth, quota, and upstream CLI failures are captured in the JSONL evidence.
