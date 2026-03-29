---
title: "Deep Research: MCP Server ESM Module Compliance"
description: "Twenty-iteration research synthesis for what actually has to change to make @spec-kit/mcp-server ESM-compliant without breaking @spec-kit/scripts."
trigger_phrases:
  - "esm deep research"
  - "mcp server esm recommendation"
  - "023 research"
importance_tier: "critical"
contextType: "architecture"
---
# Deep Research: MCP Server ESM Module Compliance

## 1. Executive Summary

This research run confirms that `023-esm-module-compliance` is not a docs-only correction and not a one-package flag flip. The actual job is a coordinated module-boundary migration across `@spec-kit/shared` and `@spec-kit/mcp-server`, followed by targeted interoperability refactors in `@spec-kit/scripts`, which must remain CommonJS.

The repo is still CommonJS at the places that matter:

| Surface | Current Truth | Why It Blocks Native ESM |
|---------|---------------|--------------------------|
| Root compiler baseline | `tsconfig.json` still sets `module: "commonjs"` and `moduleResolution: "node"` | `mcp_server` and `shared` inherit a CommonJS build contract by default |
| `@spec-kit/mcp-server` package | No `"type": "module"` in `mcp_server/package.json` | Node still treats emitted `.js` as CommonJS |
| `@spec-kit/shared` package | No `"type": "module"` in `shared/package.json` | `mcp_server` depends on a sibling package that is also CJS-shaped |
| Built server output | `mcp_server/dist/context-server.js` still emits `exports` and `require(...)` | Confirms runtime output is CommonJS, not just the source tree |
| Relative import graph | `mcp_server` has `839` relative import/export statements and only `3` `.js`-suffixed ones (all external SDK); `shared` still has `48` relative imports without Node-ESM specifiers | Native Node ESM requires explicit file extensions for relative imports |
| CommonJS-only runtime assumptions | At least `16` non-test `mcp_server` files still use `__dirname`, `__filename`, `createRequire`, or `require(...)` | These need code-shape changes even after package metadata changes |
| CommonJS sibling package | `scripts/package.json` explicitly declares `"type": "commonjs"` and still consumes `@spec-kit/shared` / `@spec-kit/mcp-server` in `20` files | A pure-ESM flip would break sibling runtime consumers under the current contract |

The chosen recommendation is:

1. Convert `@spec-kit/shared` and `@spec-kit/mcp-server` together to package-local native ESM.
2. Keep `@spec-kit/scripts` on CommonJS.
3. Replace static CommonJS-emitted runtime consumption of `@spec-kit/shared` and `@spec-kit/mcp-server/api*` inside `scripts` with explicit interoperability loaders based on dynamic `import()`.
4. Do not begin with a dual-build/conditional-exports strategy unless the scripts-side interoperability refactor proves too invasive after a bounded audit.

That recommendation best matches the evidence from 022 boundary work, current package topology, and official Node/TypeScript guidance.

## 2. Evidence Base

This packet synthesized:

- The active `023` packet itself.
- The authoritative 022 prior-work chain, prioritized as `005-architecture-audit`, `020-pre-release-remediation` plus its canonical review packet, `021-ground-truth-id-remapping`, `022-spec-doc-indexing-bypass`, `015-manual-testing-per-playbook`, and `007-code-audit-per-feature-catalog`.
- The last three GitHub releases for `MichelKerkmeester/opencode-spec-kit-framework`: [`v3.0.0.0`](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases/tag/v3.0.0.0), [`v3.0.0.1`](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases/tag/v3.0.0.1), and [`v3.0.0.2`](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases/tag/v3.0.0.2).
- The newest 50 commits on `main`, with the highest-risk MCP surfaces centered on `f10fb98`, `ca15faf`, `85078af`, and `6da69a9`.
- Official module-system guidance from Node and TypeScript:
  - [Node packages docs](https://nodejs.org/api/packages.html#packagejson-and-file-extensions)
  - [Node ESM docs: mandatory file extensions](https://nodejs.org/api/esm.html#mandatory-file-extensions)
  - [Node ESM docs: differences from CommonJS](https://nodejs.org/api/esm.html#differences-between-es-modules-and-commonjs)
  - [Node module docs: `module.createRequire`](https://nodejs.org/api/module.html#modulecreaterequirefilename)
  - [TypeScript modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference)
  - [TypeScript choosing compiler options](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html)
  - [TypeScript `module` option](https://www.typescriptlang.org/tsconfig/module.html)

## 3. What 022 Changes About This Migration

The 022 packet materially constrains the ESM work:

- `005-architecture-audit` makes the boundary contract explicit: `scripts`, `mcp_server`, and `shared` must remain separate ownership zones. ESM work cannot "solve" the problem by moving logic into `mcp_server/scripts/*` shims or by collapsing package boundaries.
- `020-pre-release-remediation` says the live release surface is still unstable. The canonical review remains `FAIL` with `14` active `P1` and `16` active `P2` findings, including runtime and tooling risks. ESM work therefore enters an already hot runtime, not a frozen one.
- `021-ground-truth-id-remapping` and the `020` compatibility-wrapper slice show a strong repo preference for thin boundary-preserving wrappers over runtime-local duplication.
- `022-spec-doc-indexing-bypass` proves `memory-save.ts` and the rebuilt `dist/` path are active release-significant surfaces, so any ESM change that alters emitted path semantics will affect real workflows immediately.
- `015-manual-testing-per-playbook` is useful for feature coverage mapping, but its implementation summary explicitly says the pass was based on static TypeScript source analysis rather than live runtime execution. It is not enough to treat it as proof that ESM runtime behavior is safe.

## 4. Chosen Strategy

### Decision

Use package-local native ESM for `shared` and `mcp_server`, keep `scripts` CommonJS, and repair the CJS-to-ESM boundary explicitly inside `scripts`.

### Why This One

- The runtime server should execute as real Node ESM from `dist/`, so the module contract has to be truthful where the server actually runs.
- `shared` cannot be left behind as CommonJS if `mcp_server` becomes native ESM, because the server imports `@spec-kit/shared/...` broadly and relies on named imports rather than CJS-default interop heuristics.
- `scripts` is intentionally pinned to CommonJS and still owns the required `generate-context.js` CLI surface, so flipping the entire workspace to ESM would violate both the current package contract and the explicit spec scope.
- A dual-build strategy for `shared` and `mcp_server` would preserve unchanged CommonJS callers, but it adds build, export-map, test, and release complexity before it is proven necessary.
- The known CommonJS consumers are finite and local to `scripts`, so adapting those call sites with explicit interoperability loaders is smaller and more aligned with the repo's existing boundary-first architecture choices.

### Exact Package Decisions

#### `@spec-kit/shared`

- Add `"type": "module"` to `shared/package.json`.
- Move `shared/tsconfig.json` to package-local Node-aware ESM settings:
  - `"module": "nodenext"`
  - `"moduleResolution": "nodenext"`
  - `"verbatimModuleSyntax": true`
- Rewrite relative imports/exports in `shared/**/*.ts` to `.js` specifiers.
- Treat `shared/dist/*.js` as the authoritative ESM runtime output for both server and cross-package consumption.

#### `@spec-kit/mcp-server`

- Add `"type": "module"` to `mcp_server/package.json`.
- Move `mcp_server/tsconfig.json` to package-local Node-aware ESM settings:
  - `"module": "nodenext"`
  - `"moduleResolution": "nodenext"`
  - `"verbatimModuleSyntax": true`
- Rewrite all relative imports/exports in `mcp_server/**/*.ts` to `.js` specifiers.
- Keep `main`, `exports`, and `bin` pointing at `.js` files in `dist/`, but those files become ESM rather than CommonJS.
- Keep the API-first boundary with `scripts`: `@spec-kit/mcp-server/api*` remains the only supported runtime-import surface from `scripts`.

#### `@spec-kit/scripts`

- Keep `"type": "commonjs"` in `scripts/package.json`.
- Keep `scripts/tsconfig.json` on CommonJS output.
- Convert runtime imports of `@spec-kit/shared/*` and `@spec-kit/mcp-server/api*` in `scripts` from static CommonJS-emitted imports to explicit interoperability loaders:
  - keep `import type` for types,
  - use `await import(...)` for runtime values,
  - centralize repeated patterns behind helper loader modules where possible,
  - preserve CLI entrypoints and `require.main === module` behavior only inside scripts-owned CommonJS files.

## 5. Code Changes That Are Actually Required

### 5.1 Shared Package Work

- Rewrite relative imports in `shared` to `.js` specifiers.
- Audit public exports in `shared/package.json` so each exposed path resolves to an emitted ESM file.
- Rebuild any cross-package barrels that assume CommonJS resolution or extensionless imports.

### 5.2 MCP Server Work

- Rewrite relative imports and re-exports in `mcp_server` to `.js` specifiers.
- Replace CommonJS globals and path assumptions:
  - `__dirname` / `__filename` -> `fileURLToPath(import.meta.url)` plus `path.dirname(...)`
  - `createRequire(__filename)` -> `createRequire(import.meta.url)`
- Replace or isolate runtime `require(...)` sites in non-test code:
  - where a static import is valid, use a normal ESM import,
  - where loading remains optional or environment-bound, use `createRequire(import.meta.url)` or an async `import()` boundary, depending on call-site constraints.
- Replace cross-package relative imports that currently rely on CommonJS-friendly resolution with real package or subpath imports, especially the `../../shared/paths` hop in `mcp_server/core/config.ts`.
- Rework bridge and wrapper files that currently hard-code `scripts/dist/*.js` paths from CommonJS semantics, especially:
  - `mcp_server/handlers/v-rule-bridge.ts`
  - `mcp_server/scripts/map-ground-truth-ids.ts`
  - `mcp_server/scripts/reindex-embeddings.ts`
  - `mcp_server/handlers/memory-crud-health.ts`
  - `mcp_server/core/config.ts`
  - `mcp_server/lib/errors/core.ts`

### 5.3 Scripts Interoperability Work

- Audit the `20` `scripts` files that touch `@spec-kit/shared` and/or `@spec-kit/mcp-server`, including non-CLI internal modules that currently compile to CommonJS `require(...)` calls.
- Prioritize runtime callers first:
  - `scripts/memory/rebuild-auto-entities.ts`
  - `scripts/core/memory-indexer.ts`
  - `scripts/core/workflow.ts`
  - `scripts/spec-folder/generate-description.ts`
  - `scripts/memory/reindex-embeddings.ts`
  - `scripts/memory/generate-context.ts`
- Replace static runtime imports with explicit `await import(...)` helpers so CommonJS `scripts` can consume ESM sibling packages under the current `node >=18` contract without relying on unsupported direct `require()` of ESM, even when the caller is an internal shared module rather than a top-level CLI entrypoint.

### 5.4 Test And Tooling Work

- Rewrite tests that currently assert CommonJS emit details rather than runtime behavior.
- Rewrite dist-sensitive tests that use `require.cache`, `require(...)`, or hard-coded CommonJS import strings when they target `mcp_server/dist`.
- Preserve scripts-owned CommonJS test coverage for `scripts/dist/**`.
- Update docs, READMEs, and playbooks only after runtime verification passes, in the same overall delivery sequence.

## 6. Rejected Options

### Rejected: docs-only closure

Rejected because the runtime is still CommonJS at compiler, package, and emitted-output level.

### Rejected: `mcp_server`-only ESM flip

Rejected because `mcp_server` depends heavily on `@spec-kit/shared`, and `scripts` consumes `@spec-kit/mcp-server/api*` from CommonJS.

### Rejected: workspace-root `tsconfig` flip to NodeNext

Rejected because `scripts` is intentionally CommonJS and must stay that way. Package-local overrides are the safer boundary.

### Rejected: dual-build first

Rejected for the first implementation pass because it adds more moving parts than are justified by the current evidence. Use it only if the scripts-side interoperability refactor proves materially larger than expected.

## 7. Ordered Migration Sequence

1. Freeze the current truth in `023` docs and add the final decision record embodied by this research output.
2. Update `shared` package metadata and TypeScript config to native ESM.
3. Rewrite `shared` relative imports/exports and verify its public surfaces.
4. Update `mcp_server` package metadata and TypeScript config to native ESM.
5. Rewrite `mcp_server` relative imports/exports and remove CommonJS-only runtime assumptions.
6. Refactor `scripts` runtime callers to load `shared` and `mcp_server/api*` through explicit interoperability helpers while staying CommonJS.
7. Rewrite dist-sensitive tests and CommonJS-emit assertions to ESM-runtime assertions.
8. Run the verification matrix and only then update standards docs and release-facing notes.

## 8. Verification Matrix

The post-migration proof set should use the following commands and targeted checks.

### Workspace Gates

- `npm run --workspaces=false typecheck`
- `npm run --workspaces=false test:cli`
- `npm run build --workspace=@spec-kit/mcp-server`
- `npm run test --workspace=@spec-kit/mcp-server`
- `npm run test --workspace=@spec-kit/scripts`

### Targeted MCP Server Gates

- `npx vitest run tests/cli.vitest.ts tests/regression-010-index-large-files.vitest.ts tests/continue-session.vitest.ts`
- `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts`
- Direct runtime smoke: `node dist/context-server.js`

### Targeted Scripts Gates

- `node scripts/dist/memory/generate-context.js --help`
- `node scripts/tests/test-scripts-modules.js`
- `node scripts/tests/test-export-contracts.js`
- `npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts`

### New Or Strengthened Gates Needed

- One targeted smoke test for `mcp_server/handlers/v-rule-bridge.ts` under compiled output.
- One targeted smoke test for `mcp_server/handlers/memory-crud-health.ts` path resolution under compiled output.
- One targeted regression for the CommonJS `scripts` interoperability helpers that load ESM `shared` / `mcp_server/api*`.

### Baseline Observations From This Research Pass

- `npm run --workspaces=false typecheck` passes today.
- `npm run --workspaces=false test:cli` passes today.
- `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts tests/continue-session.vitest.ts` currently fails because `tests/modularization.vitest.ts` still asserts CommonJS `require("./core")` style output.
- Plain `npm run typecheck` and `npm run test:cli` from the workspace root currently fan out as workspace runs in this environment and fail before they reach the intended root scripts. Use the exact `--workspaces=false` form above for deterministic verification.

## 9. Highest-Risk Recent Surfaces To Re-Test First

Recent history did not start the ESM migration, but it did expand the surface area that must stay stable:

- `f10fb98`: pre-release remediation and MCP hardening
- `ca15faf`: spec-doc indexing and memory-save/indexing changes
- `85078af`: manual-test remediation touching runtime handlers
- `6da69a9`: tenant-scoped checkpoints and shared-memory admin identity

Re-test first:

- `mcp_server/handlers/memory-save.ts`
- `mcp_server/handlers/memory-index.ts`
- `mcp_server/handlers/shared-memory.ts`
- `mcp_server/lib/search/vector-index-store.ts`
- `mcp_server/lib/session/session-manager.ts`
- `scripts/memory/generate-context.ts`
- `scripts/core/workflow.ts`

## 10. Source Index

### Local Evidence

- `specs/02--system-spec-kit/023-esm-module-compliance/*`
- `specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/*`
- `specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation/*`
- `.opencode/skill/system-spec-kit/{shared,mcp_server,scripts}/`

### External Primary Sources

- Node:
  - [Packages](https://nodejs.org/api/packages.html)
  - [ESM](https://nodejs.org/api/esm.html)
  - [`node:module`](https://nodejs.org/api/module.html)
- TypeScript:
  - [Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference)
  - [Choosing Compiler Options](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html)
  - [`module` option](https://www.typescriptlang.org/tsconfig/module.html)
- GitHub:
  - [Releases](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases)
  - [Commit history](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/commits/main/)
