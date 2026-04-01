# Iteration 016

## Focus

Compare the viable rollout options and reject the weaker ones.

## Evidence Reviewed

- 022 boundary constraints
- Shared/scripts dependency audits
- Official Node/TypeScript guidance
- Test-verifier findings

## Findings

- `mcp_server`-only ESM is not viable because both `shared` and `scripts` would be stranded.
- Workspace-wide ESM violates the explicit scripts contract.
- Dual-build-first is technically viable but heavier than the current bounded evidence justifies.
- The smallest correct path is: `shared` + `mcp_server` native ESM, `scripts` CommonJS, scripts-side explicit interop helpers.

## Ruled Out

- `mcp_server`-only ESM
- Workspace-wide ESM
- Dual-build-first

## Dead Ends

- Chasing a zero-change path for `scripts`.

## Next Focus

Turn the chosen strategy into an ordered migration sequence.
