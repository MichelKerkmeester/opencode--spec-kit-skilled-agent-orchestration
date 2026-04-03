---
title: "Implementation Plan: Shared ESM Migration [02--system-spec-kit/023-hybrid-rag-fusion-refinement/001-shared-esm-migration/plan]"
description: "Package metadata, compiler settings, and import specifier rewrites for @spec-kit/shared native ESM."
trigger_phrases:
  - "shared esm plan"
  - "023 phase 1 plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Shared ESM Migration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | OpenCode skill workspace (npm workspaces) |
| **Storage** | N/A |
| **Testing** | `npm run build --workspace=@spec-kit/shared`, manual dist inspection |

### Overview
Migrate `@spec-kit/shared` from inherited CommonJS to package-local native ESM. This is the first phase because `shared` is a dependency of both `mcp_server` and `scripts`, so its module contract must be truthful before downstream packages can adapt.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research locked the strategy in `../research/research.md`
- [x] `shared` baseline confirmed: no `"type"` field, inherits root CJS compiler settings, 48 extensionless relative imports

### Definition of Done
- [x] `shared/package.json` declares `"type": "module"` with valid `exports`
- [x] `shared/tsconfig.json` uses `nodenext` module/resolution settings
- [x] All relative imports in `shared/**/*.ts` use `.js` specifiers (no `src/` dir — source at package root)
- [x] `npm run build --workspace=@spec-kit/shared` exits 0
- [x] Emitted `shared/dist/*.js` contains ESM syntax (not CJS wrappers)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Package-local ESM override within an npm workspace that still has a CommonJS root baseline.

### Key Components
- **`shared/package.json`**: Package metadata declaring ESM contract
- **`shared/tsconfig.json`**: Compiler settings emitting native ESM
- **`shared/**/*.ts`**: Source files with runtime-valid ESM specifiers

### Data Flow
`shared/*.ts` (ESM imports with `.js` specifiers) -> TypeScript compiler (nodenext) -> `shared/dist/*.js` (native ESM output) -> consumed by `mcp_server` (Phase 2) and `scripts` (Phase 3)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delivery

### Step 1: Package Metadata
- [x] Add `"type": "module"` to `shared/package.json`
- [x] Update `exports` field to point at ESM dist output
- [x] Remove or update any `main`/`types` fields that assume CJS

### Step 2: Compiler Settings
- [x] Set `shared/tsconfig.json` to `module: "nodenext"`, `moduleResolution: "nodenext"`
- [x] Add `verbatimModuleSyntax: true`
- [x] Verify the config overrides root CJS baseline correctly

### Step 3: Import Specifier Rewrites
- [x] Rewrite all relative imports in `shared/**/*.ts` to use `.js` extensions
- [x] Rewrite all re-exports to use `.js` extensions
- [x] Verify no extensionless relative imports remain in non-test files

### Step 4: Build Verification
- [x] Run `npm run build --workspace=@spec-kit/shared`
- [x] Inspect `shared/dist/*.js` for ESM output (imports/exports, no require/exports wrappers)
- [x] Spot-check the main entrypoint resolves correctly
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command / Proof |
|-----------|-------|-----------------|
| Build | `shared` package compiles | `npm run build --workspace=@spec-kit/shared` |
| Output inspection | Emitted JS is ESM | Manual check of `shared/dist/*.js` for `import`/`export` syntax |
| Specifier audit | No extensionless relative imports | `grep -rn "from '\.\." shared/ --include="*.ts"` shows all use `.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent research | Internal | Green | Strategy source of truth |
| Root `tsconfig.json` | Internal | Yellow | Package-local overrides must not conflict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `shared` build fails or downstream `mcp_server` build breaks in Phase 2
- **Procedure**: Revert `shared/package.json`, `shared/tsconfig.json`, and import specifier changes together
<!-- /ANCHOR:rollback -->
