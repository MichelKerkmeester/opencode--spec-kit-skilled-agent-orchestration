# Iteration 011

## Focus

Inventory the runtime code in `mcp_server` that still depends on CommonJS semantics.

## Evidence Reviewed

- `mcp_server/handlers/v-rule-bridge.ts`
- `mcp_server/handlers/memory-crud-health.ts`
- `mcp_server/core/config.ts`
- `mcp_server/lib/errors/core.ts`
- `rg` inventory of `__dirname`, `__filename`, `createRequire`, and `require(...)`

## Findings

- At least `16` non-test `mcp_server` files still contain direct CommonJS assumptions.
- The bridge, config, and optional-loader code paths are the hardest blockers because they are runtime-sensitive, not cosmetic.
- Path resolution and optional module loading both need explicit ESM replacements.
- The migration is not reducible to adding `.js` extensions.

## Ruled Out

- A pure import-specifier rewrite without runtime code-shape changes.

## Dead Ends

- Assuming test transforms will mask real runtime path failures in compiled output.

## Next Focus

Quantify the relative-import rewrite surface across packages.
