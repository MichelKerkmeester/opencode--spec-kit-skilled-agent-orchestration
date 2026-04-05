# C9 Build & Config Integrity Audit

Scope: `.opencode/skill/system-spec-kit/`

Configs inspected:
- `tsconfig.json`
- `shared/tsconfig.json`
- `mcp_server/tsconfig.json`
- `scripts/tsconfig.json`
- `package.json`
- `shared/package.json`
- `mcp_server/package.json`
- `scripts/package.json`

Commands run:
- `cd .opencode/skill/system-spec-kit && find . -name 'tsconfig*.json' -not -path '*/node_modules/*'`
- `cd .opencode/skill/system-spec-kit && find . -name 'package.json' -not -path '*/node_modules/*'`
- `cd .opencode/skill/system-spec-kit && npm run build`
- `cd .opencode/skill/system-spec-kit && npm run typecheck`
- `cd .opencode/skill/system-spec-kit && node scripts/dist/evals/check-source-dist-alignment.js`
- `cd .opencode/skill/system-spec-kit && npm ls vitest typescript @modelcontextprotocol/sdk zod eslint globals typescript-eslint @huggingface/transformers onnxruntime-common better-sqlite3 sqlite-vec sqlite-vec-darwin-arm64 --all`

Quick status:
- `npm run build`: FAIL
- `npm run typecheck`: FAIL
- `check-source-dist-alignment.js`: PASS
- Root TS project references and declared `paths` entries point at real directories; no broken alias target was found.
- No orphaned `dist/lib/*.js` artifacts were reported by the repo's alignment checker.

### C9-001: Production TS Build Includes Test Sources And Currently Fails
Severity: High
Category: Build Pipeline
Location: `mcp_server/tsconfig.json:17`
Description: The `mcp_server` project compiles `**/*.ts`, which pulls the Vitest suite into the same `tsc --build` graph as production code. Only three individual test files are excluded, so the root build and typecheck pipelines are blocked by ordinary test-only strictness errors.
Evidence: `mcp_server/tsconfig.json:17-24` includes all TypeScript files and excludes only three named tests. Running `npm run build` and `npm run typecheck` from `.opencode/skill/system-spec-kit/` both exit with code `2` on `mcp_server/tests/shared-memory-handlers.vitest.ts:129`, `:179`, `:191`, `:205`, and `:227` with `TS18048: 'envelope.data.details' is possibly 'undefined'`.
Impact: The documented workspace build command does not succeed, CI or setup flows that rely on `tsc --build` are unstable, and production compilation is coupled to test-source typing details.
Recommended Fix: Split production and test compilation boundaries. Exclude `tests/**/*.ts` from `mcp_server/tsconfig.json`, add a dedicated test tsconfig if needed for editor/Vitest typechecking, and keep `tsc --build` focused on shippable sources.

### C9-002: Test Artifacts Are Emitted Into `mcp_server/dist`
Severity: Medium
Category: Build Artifacts
Location: `mcp_server/tsconfig.json:17`
Description: Because the production project includes test files, the checked-in `mcp_server/dist/` tree contains a compiled mirror of the test suite.
Evidence: `find mcp_server/tests -type f | wc -l` returns `294`. `find mcp_server/dist/tests -type f | wc -l` returns `1184`. Sample emitted files include `mcp_server/dist/tests/context-server.vitest.js`, `mcp_server/dist/tests/hybrid-search.vitest.js`, and many matching `.d.ts` and `.map` files.
Impact: The runtime artifact tree is much larger than necessary, stale test JS can linger in `dist`, and packaging/runtime boundaries are harder to reason about because non-runtime files are shipped alongside the server.
Recommended Fix: Stop compiling tests into the production dist tree and add a clean step or output-pruning step so `dist/` only contains runtime/public API artifacts.

### C9-003: Workspace Packages Rely On Root Symlinks Instead Of Declared Internal Dependencies
Severity: High
Category: Workspace Configuration
Location: `scripts/package.json:17`
Description: Internal package consumption is encoded in TS `paths` and in source imports, but not in the consuming workspace manifests. This makes the repo work only because the root install creates `node_modules/@spec-kit/*` symlinks.
Evidence: `scripts/core/workflow.ts:62-71` imports `@spec-kit/mcp-server/*` and `@spec-kit/shared/*`; `scripts/core/memory-indexer.ts:17-22` does the same; `mcp_server/handlers/memory-save.ts:12-26` and many other `mcp_server` files import `@spec-kit/shared/*`. The compiled JS keeps bare package requires, for example `scripts/dist/core/workflow.js:71-75` and `mcp_server/dist/handlers/memory-save.js:53-56`. But `scripts/package.json:17-27` declares only `better-sqlite3`, `sqlite-vec`, `tsx`, and `vitest`, while `mcp_server/package.json:39-58` declares external libraries but not `@spec-kit/shared`. The only visible links are root-level symlinks under `node_modules/@spec-kit/`.
Impact: Individual workspaces are not self-describing packages. Alternate install layouts, isolated workspace execution, or future publishing/packaging changes can fail at runtime even though the monorepo currently works.
Recommended Fix: Declare internal workspace dependencies explicitly, preferably with workspace references such as `@spec-kit/shared: "workspace:*"` and `@spec-kit/mcp-server: "workspace:*"` in the consuming manifests.

### C9-004: `@spec-kit/shared` Uses Runtime Dependencies That Its Manifest Does Not Own
Severity: High
Category: Dependency Ownership
Location: `shared/package.json:1`
Description: The `shared` workspace ships runtime code that imports `@huggingface/transformers`, but its `package.json` declares no dependencies at all. The dependency is instead carried by the workspace root.
Evidence: `shared/embeddings/providers/hf-local.ts:111` dynamically imports `@huggingface/transformers`, and the compiled output at `shared/dist/embeddings/providers/hf-local.js:112` requires the same package. `shared/package.json:1-14` has no `dependencies`, `optionalDependencies`, or `peerDependencies`. The root manifest carries `@huggingface/transformers` in `package.json:35-39` and `onnxruntime-common` in `package.json:41-43`.
Impact: `@spec-kit/shared` is not a self-contained runtime package. It can only execute correctly when installed through the root workspace topology, which undermines package portability and makes dependency ownership ambiguous.
Recommended Fix: Move runtime-owned libraries into `shared/package.json` using `dependencies` or `optionalDependencies` as appropriate, and leave the root manifest for true workspace-level tooling only.

### C9-005: Root Test Script Hardcodes A Nested Vitest Binary And Uses A Different Version Than `scripts`
Severity: Medium
Category: Package Scripts
Location: `package.json:22`
Description: The root `test:task-enrichment` script directly executes `mcp_server/node_modules/vitest/vitest.mjs` instead of invoking Vitest through the `scripts` workspace. That couples the command to a specific install layout and bypasses the version declared by the workspace under test.
Evidence: `package.json:22` runs `node mcp_server/node_modules/vitest/vitest.mjs ... --root scripts`. `scripts/package.json:13-15` already defines its own Vitest-based test entrypoint. `mcp_server/package.json:21-24` uses `vitest` from `mcp_server`, and `scripts/package.json:24-27` declares `vitest` separately. `npm ls ... --all` shows two versions installed: `vitest@4.0.18` under `@spec-kit/mcp-server` and `vitest@4.1.0` under `@spec-kit/scripts`.
Impact: Test behavior depends on whichever nested binary happens to exist, workspace test runs are not version-consistent, and the command can break if npm hoists dependencies differently.
Recommended Fix: Run the task-enrichment test through the `scripts` workspace itself, for example via `npm run test --workspace=scripts -- tests/task-enrichment.vitest.ts` or `npm exec --workspace=scripts vitest ...`, and converge on a single Vitest version if separate versions are not required.

## Notes

- Root project references are structurally consistent:
  - `tsconfig.json` references `shared`, `mcp_server`, and `scripts`
  - `mcp_server/tsconfig.json` references `../shared`
  - `scripts/tsconfig.json` references `../shared` and `../mcp_server`
- Declared `paths` aliases match existing directories:
  - `@spec-kit/shared/* -> ../shared/*`
  - `@spec-kit/mcp-server/* -> ../mcp_server/*`
- Source/dist mapping is healthy at the file level: `check-source-dist-alignment.js` reported `149` aligned JS files and `0` violations.
