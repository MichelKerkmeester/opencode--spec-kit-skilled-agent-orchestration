# Iteration 015

## Focus

Identify the exact tests and commands that become migration gates or rewrite targets.

## Evidence Reviewed

- `mcp_server/tests/modularization.vitest.ts`
- `mcp_server/tests/cli.vitest.ts`
- `mcp_server/tests/regression-010-index-large-files.vitest.ts`
- `mcp_server/tests/continue-session.vitest.ts`
- `scripts/tests/test-integration.vitest.ts`
- `scripts/tests/architecture-boundary-enforcement.vitest.ts`

## Findings

- `tests/modularization.vitest.ts` currently hard-asserts CommonJS `require("./core")`-style output and must be rewritten.
- Dist-based CLI tests are the best post-migration smoke tests because they execute built files from disk.
- Several tests currently use `require`, `require.cache`, or `createRequire(import.meta.url)` around CommonJS-shaped artifacts.
- The verification matrix must prioritize dist-sensitive tests over source-only unit transforms.

## Ruled Out

- Using only source-level Vitest passes as proof that the built ESM runtime works.

## Dead Ends

- Treating `test:cli` as sufficient without the dist-based MCP-specific smoke tests.

## Next Focus

Compare the viable strategy options and make the architectural choice.
