---
title: "Implementation Plan: MCP Server ESM [02--system-spec-kit/023-esm-module-compliance/002-mcp-server-esm-migration/plan]"
description: "Package metadata, compiler settings, import rewrites, and CommonJS cleanup for @spec-kit/mcp-server native ESM."
trigger_phrases:
  - "mcp server esm plan"
  - "023 phase 2 plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: MCP Server ESM Migration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | OpenCode MCP server (npm workspaces) |
| **Storage** | N/A |
| **Testing** | `npm run build --workspace=@spec-kit/mcp-server`, `node dist/context-server.js` smoke |

### Overview
Migrate `@spec-kit/mcp-server` from inherited CommonJS to package-local native ESM. This is the largest phase by file count (839 relative import/export statements, 16 CJS global sites across 253 source files) and depends on Phase 1 having already flipped `shared` to ESM.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 complete: `shared` emits native ESM
- [x] Research locked the strategy in `../research/research.md`

### Definition of Done
- [x] `mcp_server/package.json` declares `"type": "module"` with valid `main`/`exports`/`bin`
- [x] `mcp_server/tsconfig.json` uses `nodenext` module/resolution settings
- [x] All relative imports in `mcp_server/**/*.ts` use `.js` specifiers
- [x] No CJS globals (`__dirname`, `__filename`, bare `require()`) in production files
- [x] No cross-package relative hops to `../../shared/`
- [x] `npm run build --workspace=@spec-kit/mcp-server` exits 0
- [x] `node dist/context-server.js` starts without module errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Package-local ESM override with CommonJS global cleanup and cross-package import normalization.

### Key Components
- **`mcp_server/package.json`**: Package metadata declaring ESM contract
- **`mcp_server/tsconfig.json`**: Compiler settings emitting native ESM
- **`mcp_server/lib/**`**: Core library modules (bulk of import rewrites)
- **`mcp_server/handlers/**`**: Request handlers (import rewrites + CJS cleanup)
- **`mcp_server/context-server.ts`**: Main entrypoint (must start as ESM)

### Data Flow
`mcp_server/*.ts` (ESM imports with `.js` specifiers) -> TypeScript compiler (nodenext) -> `mcp_server/dist/*.js` (native ESM output) -> `node dist/context-server.js` (runtime proof) -> consumed by `scripts` via interop (Phase 3)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delivery

### Step 1: Package Metadata
- [x] Add `"type": "module"` to `mcp_server/package.json`
- [x] Update `main`, `exports`, and `bin` fields for ESM dist output
- [x] Keep `@spec-kit/mcp-server/api*` as the supported cross-package surface

### Step 2: Compiler Settings
- [x] Set `mcp_server/tsconfig.json` to `module: "nodenext"`, `moduleResolution: "nodenext"`
- [x] Add `verbatimModuleSyntax: true`
- [x] Verify override of root CJS baseline

### Step 3: Import Specifier Rewrites
- [x] Rewrite all relative imports in `mcp_server/**/*.ts` to use `.js` extensions
- [x] Rewrite all re-exports to use `.js` extensions
- [x] Replace cross-package relative hops (`../../shared/...`) with `@spec-kit/shared/...` package imports

### Step 4: CommonJS Global Cleanup
- [x] Replace `__dirname` with `import.meta.dirname`
- [x] Replace `__filename` with `import.meta.filename`
- [x] Replace bare `require()` with `import()` or `createRequire(import.meta.url)`
- [x] Audit dist-sensitive bridge files for hardcoded CJS path assumptions

### Step 5: Build and Runtime Verification
- [x] Run `npm run build --workspace=@spec-kit/mcp-server`
- [x] Run `node dist/context-server.js` startup smoke
- [x] Inspect emitted dist for ESM syntax
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command / Proof |
|-----------|-------|-----------------|
| Build | `mcp_server` package compiles | `npm run build --workspace=@spec-kit/mcp-server` |
| Runtime smoke | Server entrypoint starts | `node dist/context-server.js` |
| Output inspection | Emitted JS is ESM | Manual check of `dist/*.js` for `import`/`export` syntax |
| CJS audit | No CJS globals remain | `grep -rn "__dirname\|__filename\|require(" mcp_server/lib/ mcp_server/handlers/ --include="*.ts"` shows 0 production hits |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (`shared` ESM) | Internal | Must be complete | Server imports from `shared` would fail |
| Parent research | Internal | Green | Strategy source of truth |
| Node >=20.11.0 | External | Green | Required for `import.meta.dirname`/`filename` (current runtime: v25.6.1). Update `engines` field in package.json from `>=18.0.0` to `>=20.11.0` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Server build fails, `node dist/context-server.js` fails, or `scripts` consumers (Phase 3) are materially broken
- **Procedure**: Revert `mcp_server/package.json`, `mcp_server/tsconfig.json`, import rewrites, and CJS replacements together
<!-- /ANCHOR:rollback -->
