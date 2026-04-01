# Iteration 010

## Focus

Map reverse dependencies from `scripts` into `mcp_server` and `shared`.

## Evidence Reviewed

- `rg` inventory of `@spec-kit/mcp-server` and `@spec-kit/shared` imports under `scripts/`
- Key files such as `scripts/core/workflow.ts`, `scripts/core/memory-indexer.ts`, `scripts/spec-folder/generate-description.ts`, and `scripts/memory/rebuild-auto-entities.ts`

## Findings

- `scripts` has a bounded but non-trivial dependency surface: `38` files reference `shared` and/or `mcp_server`.
- The runtime callers are more important than the type-only consumers.
- The scripts-side problem is finite enough to solve with explicit interoperability helpers.
- The size of this surface does not justify a dual-build-first strategy on its own.

## Ruled Out

- Treating the scripts package as an external consumer that requires zero code changes.

## Dead Ends

- Assuming the scripts-side work is too large without counting the actual call sites.

## Next Focus

List the concrete CommonJS-only runtime assumptions in `mcp_server`.
