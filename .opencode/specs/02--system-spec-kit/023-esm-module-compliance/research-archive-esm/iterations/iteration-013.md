# Iteration 013

## Focus

Audit the public package surfaces that must remain stable through the migration.

## Evidence Reviewed

- `mcp_server/package.json`
- `shared/package.json`
- `scripts/package.json`
- `scripts` import policy docs and tests

## Findings

- `mcp_server` must preserve `main`, `exports`, `bin`, and `api/*` surfaces.
- `shared` must preserve the paths consumed by both `mcp_server` and `scripts`.
- `scripts` must preserve its CommonJS-owned CLI contract.
- The clean boundary is: ESM packages expose stable `.js` entrypoints; scripts consumes only the public API with explicit interop at runtime.

## Ruled Out

- Letting `scripts` reach into `mcp_server` internals to dodge the package contract.

## Dead Ends

- Treating `api/*` as a documentation nicety instead of a hard migration boundary.

## Next Focus

Use official docs to choose the compiler and package strategy.
