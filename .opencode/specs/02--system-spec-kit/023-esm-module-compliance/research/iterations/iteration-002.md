# Iteration 002

## Focus

Extract the boundary rules from 022 `005-architecture-audit` that constrain any ESM rollout.

## Evidence Reviewed

- `022-hybrid-rag-fusion/005-architecture-audit/spec.md`
- `022-hybrid-rag-fusion/005-architecture-audit/implementation-summary.md`

## Findings

- `scripts`, `mcp_server`, and `shared` are separate ownership zones by design.
- Cross-boundary consumption should go through documented public surfaces, not private runtime internals.
- The repo prefers thin wrappers and API-first routing over duplicated logic.
- Any ESM plan that blurs the package boundary would violate already-accepted 022 architecture work.

## Ruled Out

- Fixing ESM by moving scripts logic into `mcp_server/scripts/*`.

## Dead Ends

- Boundary-breaking wrapper growth as a shortcut around package interop.

## Next Focus

Check the canonical 020 review to understand how risky the current release surface already is.
