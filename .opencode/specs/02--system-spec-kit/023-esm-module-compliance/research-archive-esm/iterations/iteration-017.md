# Iteration 017

## Focus

Build the safest implementation sequence across packages and subsystems.

## Evidence Reviewed

- Research findings from iterations 1-16

## Findings

- `shared` has to move before `mcp_server`, otherwise the server lands on an incompatible sibling package.
- `scripts` interop work should follow the package migrations, not precede them.
- Tests need to move with the runtime shape, not afterward.
- Docs should update only after the code and verification truth exist.

## Ruled Out

- Migrating `mcp_server` before `shared`.

## Dead Ends

- Deferring dist-sensitive test rewrites to a later cleanup pass.

## Next Focus

Build the regression matrix and concrete command list.
