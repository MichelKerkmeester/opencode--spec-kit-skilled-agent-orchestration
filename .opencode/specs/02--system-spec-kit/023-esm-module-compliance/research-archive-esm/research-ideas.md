# Research Ideas

## Deferred

- If the scripts-side interoperability refactor turns out to touch materially more runtime callers than expected, revisit dual-format exports for `shared` and `mcp_server` as a fallback.
- If Node version support is raised above 18 in a later release wave, reassess whether some interop helpers can simplify around newer Node ESM behavior.

## Promoted

- Package-local `nodenext` overrides for `shared` and `mcp_server`
- Scripts-side explicit `import()` interoperability helpers instead of dual-build-first
