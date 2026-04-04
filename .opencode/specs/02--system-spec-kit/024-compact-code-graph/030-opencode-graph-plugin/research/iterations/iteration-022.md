# Iteration 022

## Focus
Trace the wrapper/runtime path to understand which config roots and versions are active during a real `opencode` launch.

## Findings
- `opencode` is invoked through a Superset wrapper that sets `OPENCODE_CONFIG_DIR=/Users/michelkerkmeester/.superset/hooks/opencode`.
- The real binary launched by the wrapper is the Homebrew install under `/opt/homebrew/lib/node_modules/opencode-ai/bin/.opencode`.
- The workspace still contains local `@opencode-ai/plugin` and `@opencode-ai/sdk` packages at version `1.3.13`, which are not the same thing as the packed binary itself.

## Why It Matters
Live startup behavior is shaped by the Superset wrapper config root, the Homebrew binary, and the workspace files together. A fix that matches only one layer can still miss the active runtime.

## Evidence
- Wrapper script: `~/.superset/bin/opencode`
- Homebrew install path: `/opt/homebrew/lib/node_modules/opencode-ai`
- Environment variables observed in the workspace shell

## Outcome
Confirmed that startup debugging must account for wrapper-level config roots and binary-level behavior, not just repo-local code.
