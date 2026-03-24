# Iteration 001 - Build System & Module Resolution Verification (Q1)

## Focus
Build system and module-resolution verification for `@spec-kit/mcp-server` package exports versus the compiled `dist/` layout.

## Summary
The current `exports` map is only partially aligned with the compiled package layout. A targeted `./api -> ./dist/api/index.js` fix is sufficient to resolve the documented public-surface breakage behind P0-4, because the real public consumers currently use either `@spec-kit/mcp-server/api` or leaf `api/*` modules. However, the broader wildcard rule is still structurally wrong for every directory-barrel subpath, not just `api`: it also mis-resolves `core`, `formatters`, `handlers`, `hooks`, `tools`, `utils`, and nested barrels like `handlers/save`, because the build preserves directory structure and emits `dist/<dir>/index.js`, not `dist/<dir>.js`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`, `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:4-5`, `.opencode/skill/system-spec-kit/mcp_server/core/index.ts:5-35`, `.opencode/skill/system-spec-kit/mcp_server/formatters/index.ts:5-31`, `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:23-32`, `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`, `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:4-16`, `.opencode/skill/system-spec-kit/mcp_server/utils/index.ts:4-20`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:4-6`.

## Findings

### Finding 1
The build is directory-preserving, while the wildcard `exports` rule assumes flat `dist/*.js` artifacts. `package.json` maps both `./*.js` and `./*` to `./dist/*.js`, but `tsconfig.json` compiles with `rootDir: "."` and `outDir: "./dist"`, which preserves nested source paths under `dist/` instead of flattening them. This means a directory barrel such as `api/index.ts` compiles to `dist/api/index.js`, not `dist/api.js`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`, `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:4-5`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/index.js:1-6`.

### Finding 2
The immediate public breakage is the bare `@spec-kit/mcp-server/api` entrypoint. The public API README explicitly recommends `@spec-kit/mcp-server/api` as the preferred import surface, and several real script consumers use that exact path, including `rebuild-auto-entities.ts`, `generate-description.ts`, and `run-performance-benchmarks.ts`. From the current `exports` rule, `./api` is inferred to resolve to `./dist/api.js`, which does not match the compiled barrel at `dist/api/index.js`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:46-49`, `.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:25-30`, `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:16-23`, `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:17-25`, `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/index.js:1-6`.

### Finding 3
The leaf `api/*` imports that are actually in use appear structurally correct under the existing wildcard rule. Real consumers import `@spec-kit/mcp-server/api/indexing`, `@spec-kit/mcp-server/api/search`, and `@spec-kit/mcp-server/api/providers`, and the corresponding compiled files exist at `dist/api/indexing.js`, `dist/api/search.js`, and `dist/api/providers.js`. Because these are file-like leaf subpaths rather than directory barrels, the current `./* -> ./dist/*.js` rule lines up with their emitted locations. Evidence: `.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts:12-18`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:15-18`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:59-60`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/indexing.js:1-18`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/search.js:1-7`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/providers.js:1-6`.

### Finding 4
There are additional broken directory-barrel paths beyond `api`. The source tree defines other barrel entrypoints at `core/index.ts`, `formatters/index.ts`, `handlers/index.ts`, `hooks/index.ts`, `tools/index.ts`, `utils/index.ts`, and `handlers/save/index.ts`. Under the current wildcard export, these would be inferred to resolve as `dist/core.js`, `dist/formatters.js`, `dist/handlers.js`, `dist/hooks.js`, `dist/tools.js`, `dist/utils.js`, and `dist/handlers/save.js` respectively, but the build layout implies `dist/<dir>/index.js` instead. Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`, `.opencode/skill/system-spec-kit/mcp_server/core/index.ts:5-35`, `.opencode/skill/system-spec-kit/mcp_server/formatters/index.ts:5-31`, `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:23-32`, `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`, `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:4-16`, `.opencode/skill/system-spec-kit/mcp_server/utils/index.ts:4-20`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:4-6`.

### Finding 5
Those additional broken barrel paths are mostly latent/internal rather than part of the intended public API. The API README prohibits package imports from `lib`, `core`, and `handlers`, and the import-policy tests explicitly mark `@spec-kit/mcp-server/core`, `@spec-kit/mcp-server/core/db-state`, `@spec-kit/mcp-server/handlers`, and `@spec-kit/mcp-server/handlers/memory-index` as prohibited while allowing only `@spec-kit/mcp-server/api` and `@spec-kit/mcp-server/api/indexing`. So the broader wildcard mismatch is real, but it only becomes release-critical if those internal barrels are meant to be external entrypoints. Evidence: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:46-49`, `.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:8-12`, `.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:28-33`.

## Dist Structure vs Exports

Observed top-level `dist/` shape from local filesystem listing:

```text
dist/
  api/
  configs/
  core/
  database/
  formatters/
  handlers/
  hooks/
  lib/
  schemas/
  scripts/
  tests/
  tools/
  utils/
  cli.js
  context-server.js
  startup-checks.js
  tool-schemas.js
  vitest.config.js
```

Representative subpath verification:

| Package subpath | Current export target (inferred from `package.json`) | Actual compiled artifact | Status |
| --- | --- | --- | --- |
| `.` | `dist/context-server.js` | `dist/context-server.js` | Correct |
| `./api` | `dist/api.js` | `dist/api/index.js` | Broken |
| `./api/indexing` | `dist/api/indexing.js` | `dist/api/indexing.js` | Correct |
| `./api/search` | `dist/api/search.js` | `dist/api/search.js` | Correct |
| `./api/providers` | `dist/api/providers.js` | `dist/api/providers.js` | Correct |
| `./core` | `dist/core.js` | `dist/core/index.js` | Broken but internal/prohibited |
| `./formatters` | `dist/formatters.js` | `dist/formatters/index.js` | Broken but undocumented |
| `./handlers` | `dist/handlers.js` | `dist/handlers/index.js` | Broken but internal/prohibited |
| `./hooks` | `dist/hooks.js` | `dist/hooks/index.js` | Broken but undocumented |
| `./tools` | `dist/tools.js` | `dist/tools/index.js` | Broken but undocumented |
| `./utils` | `dist/utils.js` | `dist/utils/index.js` | Broken but undocumented |
| `./handlers/save` | `dist/handlers/save.js` | `dist/handlers/save/index.js` | Broken nested barrel |

Inference basis for the table: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`, `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:4-5`, `.opencode/skill/system-spec-kit/mcp_server/core/index.ts:5-35`, `.opencode/skill/system-spec-kit/mcp_server/formatters/index.ts:5-31`, `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:23-32`, `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`, `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:4-16`, `.opencode/skill/system-spec-kit/mcp_server/utils/index.ts:4-20`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:4-6`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/index.js:1-6`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/indexing.js:1-18`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/search.js:1-7`, `.opencode/skill/system-spec-kit/mcp_server/dist/api/providers.js:1-6`.

## Answer to Q1
Yes, the explicit `./api -> ./dist/api/index.js` fix is sufficient for the immediate P0-4 problem because the documented public surface and the real failing consumers use `@spec-kit/mcp-server/api`, while the actively used leaf imports already resolve correctly through `./*`. But no, `api` is not the only broken barrel-style path. The current wildcard `exports` map is globally inaccurate for directory barrels, and it would also mis-resolve `core`, `formatters`, `handlers`, `hooks`, `tools`, `utils`, and nested barrels such as `handlers/save` if those were ever treated as supported package entrypoints. Evidence: `.opencode/skill/system-spec-kit/mcp_server/api/README.md:46-49`, `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`, `.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:8-12`, `.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:28-33`.

## Ruled Out
- The "api-only anomaly" hypothesis is ruled out. The mismatch comes from a package-wide pattern (`./* -> ./dist/*.js`) colliding with directory-preserving compilation, so any directory barrel has the same shape mismatch. Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-9`, `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`, `.opencode/skill/system-spec-kit/mcp_server/core/index.ts:5-35`, `.opencode/skill/system-spec-kit/mcp_server/formatters/index.ts:5-31`.

## Dead Ends
- Initial `src/`-based barrel search was a dead end because this package compiles from the project root, not from a `src/` directory. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:5-6`.

## Iteration Metrics
- `findingsCount`: 5
- `newInfoRatio`: 0.83
- `newInfoRatio justification`: This pass fully answered Q1, mapped the real consumer import set, and uncovered several additional latent barrel mismatches beyond the previously known `api` problem. Some information overlapped with known P0-4 context, so the ratio is high but not 1.0.
- `status`: `complete`
