# Iteration 024

## Focus
Re-evaluate the `plugin.auth` crash path using the live loader semantics instead of the earlier static-type theory.

## Findings
- The packed runtime contains a provider-auth enumeration loop that dereferences `plugin.auth` without guarding the plugin object itself.
- The same runtime also contains a separate guarded path using `if (plugin && plugin.auth)`.
- This means at least one auth-related path assumes every hook entry in `Plugin.list()` is non-null.

## Why It Matters
The startup crash is more consistent with a nullish hook entry in the loaded plugin list than with a prompt-schema issue.

## Evidence
- Packed runtime extraction around the auth enumeration loop and `handlePluginAuth(...)`

## Outcome
The root issue remains in plugin materialization/resolution, not in the compact code graph payload contents.
