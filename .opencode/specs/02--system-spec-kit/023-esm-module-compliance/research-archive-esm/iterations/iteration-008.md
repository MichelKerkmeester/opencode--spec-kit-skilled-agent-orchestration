# Iteration 008

## Focus

Determine whether `@spec-kit/shared` can stay CommonJS if `mcp_server` becomes native ESM.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/shared/package.json`
- `.opencode/skill/system-spec-kit/shared/tsconfig.json`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings.js`
- `mcp_server` imports from `@spec-kit/shared/...`

## Findings

- `shared` is also CommonJS-shaped today.
- `mcp_server` uses `@spec-kit/shared/...` broadly and relies on named imports.
- Leaving `shared` on CommonJS would force `mcp_server` to depend on Node CJS named-export heuristics at scale.
- The cleaner path is to migrate `shared` and `mcp_server` together.

## Ruled Out

- A `mcp_server`-only ESM flip with `shared` left unchanged.

## Dead Ends

- Treating `shared` as an implementation detail rather than a package boundary.

## Next Focus

Audit the explicit `scripts` CommonJS contract.
