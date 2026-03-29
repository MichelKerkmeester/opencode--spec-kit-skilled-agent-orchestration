---
title: "Tasks: MCP Server ESM Migration"
description: "Task breakdown for @spec-kit/mcp-server native ESM migration."
trigger_phrases:
  - "mcp server esm tasks"
  - "023 phase 2 tasks"
importance_tier: "standard"
contextType: "architecture"
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

- [ ] T001 Add `"type": "module"` to `mcp_server/package.json` and update `engines` to `>=20.11.0` - WHY: Node must know this package emits ESM; `import.meta.dirname`/`filename` requires Node >=20.11.0 - Acceptance: `"type": "module"` present, `engines.node` is `>=20.11.0`
- [ ] T002 Update `main`, `exports`, and `bin` fields for ESM dist - WHY: consumers and CLI must resolve ESM entrypoints - Acceptance: fields reference `.js` ESM output in `dist/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Compiler Settings

- [ ] T003 Set `mcp_server/tsconfig.json` to `module: "nodenext"` and `moduleResolution: "nodenext"` - WHY: compiler must emit native ESM - Acceptance: settings present
- [ ] T004 Add `verbatimModuleSyntax: true` to `mcp_server/tsconfig.json` - WHY: prevents TS from rewriting imports to CJS - Acceptance: setting present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Import Rewrites and Cross-Package Cleanup

- [ ] T005 Rewrite all relative imports in `mcp_server/**/*.ts` to `.js` specifiers - WHY: Node ESM requires explicit file extensions - Acceptance: no extensionless relative imports in non-test files
- [ ] T006 [P] Rewrite all re-exports to `.js` specifiers - WHY: re-exports follow same ESM rules - Acceptance: no extensionless re-exports
- [ ] T007 Replace cross-package relative hops (`../../shared/...`) with `@spec-kit/shared/...` - WHY: ESM packages must use package imports not sibling-relative paths - Acceptance: no `../../shared/` patterns in production files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: CommonJS Global Cleanup

- [ ] T008 Replace `__dirname` with `import.meta.dirname` in production files - WHY: `__dirname` is not available in ESM - Acceptance: zero `__dirname` hits in non-test `mcp_server/` files
- [ ] T009 [P] Replace `__filename` with `import.meta.filename` in production files - WHY: `__filename` is not available in ESM - Acceptance: zero `__filename` hits in non-test files
- [ ] T010 Replace bare `require()` sites with `import()` or `createRequire(import.meta.url)` - WHY: `require()` is not available in ESM without explicit wrapper - Acceptance: zero bare `require()` in production files. Key files: `lib/cognitive/archival-manager.ts` (5 lazy loads), `lib/cognitive/tier-classifier.ts`, `lib/errors/core.ts`, `lib/scoring/composite-scoring.ts`, `lib/ops/file-watcher.ts`
- [ ] T011 [P0] Migrate `handlers/v-rule-bridge.ts` to ESM-safe dynamic import - WHY: v-rule-bridge uses `createRequire(__filename)` to load scripts-side validator; this is a critical pipeline for memory save quality gates - Acceptance: bridge uses `import.meta.url` + dynamic `import()` instead of `createRequire`; V-rule validation works at runtime
- [ ] T011b Migrate `handlers/index.ts` dynamic handler loader from `require()` to `import()` - WHY: handler barrel uses `require(basePath)` for lazy loading; must become async - Acceptance: dynamic `import()` replaces `require()`, handler registration handles async correctly
- [ ] T011c Audit dist-sensitive bridge files for hardcoded CJS path assumptions - WHY: path resolution changes under ESM - Acceptance: no hardcoded `.cjs` or `require.resolve` patterns remain
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Build and Runtime Verification

- [ ] T012 Run `npm run build --workspace=@spec-kit/mcp-server` - WHY: build must pass with new settings - Acceptance: exit code 0
- [ ] T013 Run `node dist/context-server.js` startup smoke - WHY: runtime proof that ESM entrypoint works - Acceptance: server starts without module resolution errors
- [ ] T014 Inspect `mcp_server/dist/*.js` for ESM output - WHY: emitted output must be truthful ESM - Acceptance: files use `import`/`export`, not `require()`/`exports`
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T014 marked `[x]`
- [ ] `mcp_server` builds to native ESM
- [ ] `node dist/context-server.js` starts successfully
- [ ] Handoff criteria met for Phase 3 (003-scripts-interop-refactor)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
