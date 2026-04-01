# Iteration 018

## Focus

Translate the migration into a bounded verification matrix.

## Evidence Reviewed

- Workspace root scripts
- MCP package scripts
- Scripts package tests
- Dist-sensitive MCP tests

## Findings

- The migration needs both workspace-level and package-level gates.
- The exact root commands that work in this environment are `npm run --workspaces=false typecheck` and `npm run --workspaces=false test:cli`.
- Dist-sensitive MCP tests and scripts interoperability tests must be first-class gates.
- Two new or strengthened smoke tests are needed for bridge and health-handler path resolution.

## Ruled Out

- A verification plan made only of generic `build` and `test` invocations.

## Dead Ends

- Trusting `npm run typecheck` without the root workspace flag override in this environment.

## Next Focus

Write the final recommendation into `research/research.md`.
