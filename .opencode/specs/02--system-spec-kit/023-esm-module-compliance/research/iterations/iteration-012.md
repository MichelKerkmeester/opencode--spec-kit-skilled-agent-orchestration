# Iteration 012

## Focus

Quantify the relative import/export rewrite needed for native Node ESM.

## Evidence Reviewed

- `rg` counts over `mcp_server`, `shared`, and `mcp_server/tests`

## Findings

- `mcp_server` currently has `1883` relative import/export statements and only `13` `.js`-suffixed ones.
- `shared` still has `54` extensionless relative imports.
- `mcp_server/tests` also contain a large relative-import surface and many CommonJS assumptions.
- `scripts` can keep CommonJS-style relative imports because that package is intentionally staying on CommonJS output.

## Ruled Out

- Migrating only `mcp_server` relative imports and ignoring `shared`.

## Dead Ends

- Assuming the test suite will automatically follow the runtime package shape without explicit updates.

## Next Focus

Audit which public entrypoints must remain stable.
