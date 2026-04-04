# Iteration 026

## Focus
Convert the loader findings into an implementation-ready fix strategy.

## Findings
- Safest plugin module contract for the live runtime: a single callable export only, with no metadata/string exports.
- Safest plugin registration strategy: prefer local auto-loaded file plugins from `.opencode/plugin/` or `.opencode/plugins/`, or use explicit `file://...` URIs when configuration must be explicit.
- Avoid duplicate specifiers that collapse to the same plugin name during deduplication, because they can change which plugin source wins.

## Why It Matters
This gives packet 030 a concrete next-step implementation path that is directly grounded in the live OpenCode binary behavior.

## Evidence
- Combined evidence from live loader extraction, wrapper inspection, local config inspection, and working plugin comparisons

## Outcome
Recommended fix order:
1. collapse the plugin module back to a single function export
2. remove non-function exports like `id`
3. stop using the bare package-style plugin specifier for the local plugin
4. retest startup before touching prompt-transform behavior again
