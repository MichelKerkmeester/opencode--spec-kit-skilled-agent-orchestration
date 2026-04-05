# Iteration 019

## Focus
Differentiate explicit plugin config entries from local auto-discovered file plugins.

## Findings
- In the live loader, any configured plugin value that does not start with `file://` is treated as a package specifier.
- Those package specifiers are installed through `BunProc.install(pkg, version)` before import.
- The current repo `opencode.json` entry uses bare `"spec-kit-compact-code-graph"`, which therefore matches package-style loading semantics rather than local-file semantics.

## Why It Matters
The explicit config entry is not equivalent to “load my local repo plugin file.” It asks OpenCode to resolve a package named `spec-kit-compact-code-graph`.

## Evidence
- Packed runtime extraction around `if (!plugin.startsWith("file://")) { ... BunProc.install(...) }`
- Repo config file: `opencode.json`

## Outcome
High-confidence finding that the explicit plugin specifier is structurally risky unless converted to a `file://...` URI or removed in favor of local auto-loading.
