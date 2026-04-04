# Iteration 017

## Focus
Extract the live OpenCode plugin loader flow from the packed runtime instead of relying on local package type definitions.

## Findings
- The shipped OpenCode binary contains a `src/plugin/index.ts` block that builds a `hooks` array from internal plugins plus configured plugins.
- Configured plugin specifiers are loaded after `Config.waitForDependencies()`.
- Imported plugin module entries are iterated with `Object.entries(mod)` and each unique export value is invoked as a function, with the returned value pushed into the `hooks` array.

## Why It Matters
This means the live runtime behavior is determined by the packed CLI loader, not just the `@opencode-ai/plugin` type definitions in workspace `node_modules`.

## Evidence
- Homebrew OpenCode packed runtime string extraction around `src/plugin/index.ts`
- Local binary path: `/opt/homebrew/lib/node_modules/opencode-ai/bin/.opencode`

## Outcome
High-confidence evidence that loader semantics must be treated as the source of truth for this startup crash.
