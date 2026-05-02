# Iteration 023

## Focus
Assess version skew between the live binary and the locally installed plugin helper packages.

## Findings
- The Homebrew package metadata reports `opencode-ai` version `1.2.15`.
- The config-root and workspace `@opencode-ai/plugin` packages report `1.3.13`.
- The `PluginModule.server` type shape in `@opencode-ai/plugin` therefore cannot be assumed to reflect the exact semantics of the live bundled binary.

## Why It Matters
The earlier `server`-export fix matched the local types but was insufficient to explain the still-failing runtime, because the actual bundled loader behaves differently.

## Evidence
- `/opt/homebrew/lib/node_modules/opencode-ai/package.json`
- `~/.superset/hooks/opencode/node_modules/@opencode-ai/plugin/package.json`
- `.opencode/node_modules/@opencode-ai/plugin/package.json`

## Outcome
High-confidence finding that live plugin debugging must prioritize bundled-loader behavior over local type declarations when the versions diverge.
