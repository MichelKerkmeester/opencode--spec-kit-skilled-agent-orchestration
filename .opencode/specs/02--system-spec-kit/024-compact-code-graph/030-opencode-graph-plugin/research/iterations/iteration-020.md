# Iteration 020

## Focus
Test live export invocation semantics and identify what module shapes are safe.

## Findings
- The live loader does not filter module exports by name or by function type before invocation.
- It deduplicates export values by identity, but still attempts to invoke every unique export value as a function.
- This makes non-function exports such as string metadata unsafe in the current OpenCode loader path.

## Why It Matters
Any plugin module that exports both a plugin function and a non-function helper/metadata value can fail during import in the live runtime.

## Evidence
- Packed runtime extraction around `for (const [_name, fn] of Object.entries(mod)) { ... hooks.push(await fn(input)) }`
- Local direct import shape check of `spec-kit-compact-code-graph.js`

## Outcome
The safest module shape for the current runtime is a single function export, or multiple exports only when every export is itself a callable plugin function.
