# Deep Research Strategy

## Topic

Determine what actually needs to change to make `@spec-kit/mcp-server` ESM-compliant without breaking `@spec-kit/scripts`.

## Key Questions

1. Is this migration isolated to `mcp_server`, or does `shared` also have to move?
2. Can `scripts` remain CommonJS without a dual-publish strategy?
3. What exact code-shape changes are required besides adding `"type": "module"`?
4. Which tests and commands are real migration gates, and which current passes are only source-level confidence?
5. Which recent 022 workstreams, releases, and commits expand the ESM regression surface?

## Answered Questions

- `mcp_server` cannot move alone; `shared` must migrate in the same change set.
- `scripts` should remain CommonJS, but it needs explicit interoperability loaders for runtime imports of `shared` and `mcp_server/api*`.
- The migration requires package metadata changes, package-local `nodenext` compiler changes, `.js` relative specifiers, CommonJS-global replacement, and bridge/wrapper refactors.
- Dist-sensitive runtime tests matter more than source-only Vitest passes for proving the migration.
- Recent 022 and GitHub history increased the runtime/test surface but did not start the ESM migration.

## Non-Goals

- Rewriting `scripts` as a native ESM package.
- Collapsing `scripts`, `mcp_server`, and `shared` into one package to dodge interop work.
- Starting with a dual-build strategy before the smaller scripts-side interop refactor is evaluated.
- Claiming that static-analysis-only passes prove runtime ESM safety.

## Stop Conditions

- The packet has a decision-complete recommendation for package boundaries, compiler settings, code-shape changes, and verification gates.
- The recommendation explicitly chooses between pure ESM plus scripts interop vs dual-build-first.
- The required follow-up edits to `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are unambiguous.

## Evidence Lanes

- `023-packet`
- `022-prior-work`
- `git-history`
- `official-docs`
- `module-graph`
- `shared-boundary`
- `scripts-boundary`
- `test-verifier`

## Proven Constraints

- `scripts/package.json` must remain `"type": "commonjs"` for the current CLI contract.
- Node ESM requires explicit relative file extensions.
- `mcp_server` still contains real CommonJS runtime assumptions beyond import specifiers.
- `shared` is a real package boundary, not just a source folder.
- 022 boundary rules favor package-local truth and thin wrappers over cross-boundary duplication.

## Ruled Out

- Docs-only closure
- `mcp_server`-only ESM flip
- Workspace-wide ESM flip
- Dual-build-first rollout

## Active Risks

- The scripts-side runtime import surface is finite but still broad enough to require a deliberate helper pattern.
- Dist-sensitive tests encode CommonJS assumptions and will fail noisily during the migration unless updated in the same workstream.
- The live release surface already carries open 020 review findings, so verification has to be stricter than a normal package refactor.

## Next Focus

Research loop complete. Use `research/research.md` as the canonical synthesis and keep 023 spec docs aligned to the chosen strategy:

1. `shared` + `mcp_server` package-local ESM
2. `scripts` stays CommonJS
3. scripts-side runtime interop helpers instead of dual-build-first
4. dist-sensitive verification before standards-doc updates
