---
title: "Tasks: MCP Server ESM Migration [02--system-spec-kit/023-esm-module-compliance/002-mcp-server-esm-migration/tasks]"
description: "Task breakdown for @spec-kit/mcp-server native ESM migration."
trigger_phrases:
  - "mcp server esm tasks"
  - "023 phase 2 tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: MCP Server ESM Migration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description - WHY - Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Step 1: Package Metadata

- [x] T001 Add `"type": "module"` to `mcp_server/package.json` and update `engines` to `>=20.11.0` - WHY: Node must know this package emits ESM; `import.meta.dirname`/`filename` requires Node >=20.11.0 - Acceptance: `"type": "module"` present, `engines.node` is `>=20.11.0`. Evidence: committed in `d4fa69b4b` as the Phase 2 `@spec-kit/mcp-server` native ESM migration.
- [x] T002 Update `main`, `exports`, and `bin` fields for ESM dist - WHY: consumers and CLI must resolve ESM entrypoints - Acceptance: fields reference `.js` ESM output in `dist/`. Evidence: `d4fa69b4b` landed the package-surface ESM rewrite and the emitted server output is native ESM.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Compiler Settings

- [x] T003 Set `mcp_server/tsconfig.json` to `module: "nodenext"` and `moduleResolution: "nodenext"` - WHY: compiler must emit native ESM - Acceptance: settings present. Evidence: `d4fa69b4b` switched `mcp_server` to the NodeNext ESM compiler path and the package build passes.
- [x] T004 Add `verbatimModuleSyntax: true` to `mcp_server/tsconfig.json` - WHY: prevents TS from rewriting imports to CJS - Acceptance: setting present. Evidence: `d4fa69b4b` completed the Phase 2 TypeScript ESM config required for truthful output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Import Rewrites and Cross-Package Cleanup

- [x] T005 Rewrite all relative imports in `mcp_server/**/*.ts` to `.js` specifiers - WHY: Node ESM requires explicit file extensions - Acceptance: no extensionless relative imports in non-test files. Evidence: Phase 2 landed in `d4fa69b4b` across `181` files, including the production import rewrite.
- [x] T006 [P] Rewrite all re-exports to `.js` specifiers - WHY: re-exports follow same ESM rules - Acceptance: no extensionless re-exports. Evidence: `d4fa69b4b` completed the ESM specifier rewrite across the `mcp_server` source tree.
- [x] T007 Replace cross-package relative hops (`../../shared/...`) with `@spec-kit/shared/...` - WHY: ESM packages must use package imports not sibling-relative paths - Acceptance: no `../../shared/` patterns in production files. Evidence: the `181`-file Phase 2 migration in `d4fa69b4b` included the cross-package import cleanup needed for `shared` ESM consumption.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: CommonJS Global Cleanup

- [x] T008 Replace `__dirname` with `import.meta.dirname` in production files - WHY: `__dirname` is not available in ESM - Acceptance: zero `__dirname` hits in non-test `mcp_server/` files. Evidence: `d4fa69b4b` completed the CommonJS-global replacement required for native ESM runtime.
- [x] T009 [P] Replace `__filename` with `import.meta.filename` in production files - WHY: `__filename` is not available in ESM - Acceptance: zero `__filename` hits in non-test files. Evidence: Phase 2 replaced the CommonJS path globals as part of the `181`-file ESM conversion in `d4fa69b4b`.
- [x] T010 Replace bare `require()` sites with `import()` or `createRequire(import.meta.url)` - WHY: `require()` is not available in ESM without explicit wrapper - Acceptance: zero bare `require()` in production files. Key files: `lib/cognitive/archival-manager.ts` (5 lazy loads), `lib/cognitive/tier-classifier.ts`, `lib/errors/core.ts`, `lib/scoring/composite-scoring.ts`, `lib/ops/file-watcher.ts`. Evidence: `d4fa69b4b` completed the Phase 2 CommonJS cleanup and the built server starts successfully.
- [x] T011 [P0] Migrate `handlers/v-rule-bridge.ts` to ESM-safe dynamic import - WHY: v-rule-bridge uses `createRequire(__filename)` to load scripts-side validator; this is a critical pipeline for memory save quality gates - Acceptance: bridge uses `import.meta.url` + dynamic `import()` instead of `createRequire`; V-rule validation works at runtime. Evidence: the `181`-file ESM migration in `d4fa69b4b` includes the handler bridge/runtime cleanup required for successful server startup.
- [x] T011b Migrate `handlers/index.ts` dynamic handler loader from `require()` to `import()` - WHY: handler barrel uses `require(basePath)` for lazy loading; must become async - Acceptance: dynamic `import()` replaces `require()`, handler registration handles async correctly. Evidence: `d4fa69b4b` landed the handler-loader ESM conversion and `node dist/context-server.js` starts.
- [x] T011c Audit dist-sensitive bridge files for hardcoded CJS path assumptions - WHY: path resolution changes under ESM - Acceptance: no hardcoded `.cjs` or `require.resolve` patterns remain. Evidence: Phase 2 completed the dist/runtime path cleanup needed for `context-server.js` startup.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Build and Runtime Verification

- [x] T012 Run `npm run build --workspace=@spec-kit/mcp-server` - WHY: build must pass with new settings - Acceptance: exit code 0. Evidence: the Phase 2 `mcp_server` build passes after `d4fa69b4b`.
- [x] T013 Run `node dist/context-server.js` startup smoke - WHY: runtime proof that ESM entrypoint works - Acceptance: server starts without module resolution errors. Evidence: `context-server.js` starts successfully after the Phase 2 ESM migration.
- [x] T014 Inspect `mcp_server/dist/*.js` for ESM output - WHY: emitted output must be truthful ESM - Acceptance: files use `import`/`export`, not `require()`/`exports`. Evidence: Phase 2 verification records that the emitted `dist/` server files are native ESM.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T014 marked `[x]`. Evidence: Phase 2 closed in commit `d4fa69b4b`.
- [x] `mcp_server` builds to native ESM. Evidence: the package build passes after the `181`-file migration.
- [x] `node dist/context-server.js` starts successfully. Evidence: startup smoke passes after the Phase 2 ESM conversion.
- [x] Handoff criteria met for Phase 3 (003-scripts-interop-refactor). Evidence: `mcp_server` now emits native ESM and starts cleanly for the scripts-side interop phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
