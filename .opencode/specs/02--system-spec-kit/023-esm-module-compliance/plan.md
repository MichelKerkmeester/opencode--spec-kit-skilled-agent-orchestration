---
title: "Implementation Plan: ESM Module Compliance"
description: "Technical plan for completing the real mcp_server ESM compliance refactor and the follow-on documentation updates."
trigger_phrases:
  - "esm plan"
  - "mcp_server esm migration plan"
importance_tier: "standard"
contextType: "architecture"
---
# Implementation Plan: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Node.js, Markdown |
| **Framework** | OpenCode skill workspace + MCP server runtime |
| **Storage** | N/A |
| **Testing** | Build, typecheck, targeted Vitest, emitted-artifact inspection, doc validation |

### Overview
This plan delivers the true ESM migration described by the research packet: `@spec-kit/shared` and `@spec-kit/mcp-server` move together to package-local native ESM, `@spec-kit/scripts` stays CommonJS, and the boundary between them is repaired with explicit interoperability loaders before standards docs are updated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current-state evidence distinguishes source syntax from runtime module mode
- [x] Final ESM compiler/package strategy selected for `shared` and `mcp_server`
- [x] Scope boundary between `shared`, `mcp_server`, and `scripts/` is explicit before code changes begin

### Definition of Done
- [ ] `shared` and `mcp_server` emit native ESM entrypoints instead of CommonJS wrappers
- [ ] Non-test runtime-relative imports/exports are ESM-compatible across both packages
- [ ] `scripts` CommonJS workflows pass through explicit interoperability loaders
- [ ] Build, typecheck, and targeted verification commands pass
- [ ] Follow-on standards docs describe the final architecture rather than the old assumption
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Incremental module-system migration with workspace boundary isolation

### Key Components
- **Workspace compiler config**: `.opencode/skill/system-spec-kit/tsconfig.json`
- **Shared package boundary**: `.opencode/skill/system-spec-kit/shared/{package.json,tsconfig.json}`
- **Runtime package boundary**: `.opencode/skill/system-spec-kit/mcp_server/package.json`
- **Import graphs**: `.opencode/skill/system-spec-kit/shared/**/*.ts` and `.opencode/skill/system-spec-kit/mcp_server/**/*.ts`
- **Scripts interoperability boundary**: `.opencode/skill/system-spec-kit/scripts/**/*.ts`
- **Verification surfaces**: `dist/context-server.js`, `scripts/dist/memory/generate-context.js`, targeted handler smokes, workspace build/test commands
- **Follow-on standards docs**: `.opencode/skill/sk-code--opencode/SKILL.md` and this spec package

### Data Flow
Source TypeScript in `shared` and `mcp_server` -> package-local Node-aware ESM settings -> emitted `dist/*.js` entrypoints -> CommonJS `scripts` interoperability loaders -> Node runtime smoke checks -> standards-doc alignment
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Baseline and Strategy Lock
- [x] Capture current-state evidence in the spec package
- [x] Lock the final package-local NodeNext strategy for `shared` and `mcp_server`
- [x] Confirm how `scripts/` stays CommonJS while sibling packages migrate through explicit interop loaders

### Phase 1: Toolchain and Package Alignment
- [ ] Update package-local compiler settings so `shared` and `mcp_server` emit ESM
- [ ] Update `shared/package.json` exports plus `mcp_server/package.json` metadata, exports, and entrypoints for the new runtime mode

### Phase 2: Source Migration
- [ ] Rewrite non-test relative imports/exports in `shared/**/*.ts` and `mcp_server/**/*.ts`
- [ ] Replace cross-package relative imports from `mcp_server` into `shared` with package/subpath imports
- [ ] Replace CommonJS-only globals and path assumptions inside `mcp_server` runtime files
- [ ] Refactor `scripts` runtime callers and internal shared modules to explicit CommonJS-to-ESM interoperability loaders
- [ ] Normalize barrel exports, deep relative paths, and dist-sensitive test imports/assertions affected by the new module mode

### Phase 3: Verification and Documentation
- [ ] Run the exact verification matrix, including deterministic root commands and workspace-targeted tests
- [ ] Inspect emitted `dist/context-server.js` and scripts-facing boundary smokes to verify the runtime is ESM-safe
- [ ] Update `sk-code--opencode` and any decision records only after the runtime migration is proven
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static audit | Package metadata, tsconfig, and import-pattern inventory | `rg`, `sed`, direct file reads |
| Deterministic root gates | Root scripts without workspace fan-out | `npm run --workspaces=false typecheck`, `npm run --workspaces=false test:cli` |
| Build verification | Emitted runtime artifact shape for ESM packages | `npm run build --workspace=@spec-kit/mcp-server`, direct inspection of `dist/context-server.js` |
| Runtime smoke | `mcp_server` entrypoint and scripts-owned CLI startup paths | `node dist/context-server.js`, `node scripts/dist/memory/generate-context.js --help` |
| Targeted tests | Module-resolution-sensitive server and scripts tests | `npx vitest run tests/cli.vitest.ts tests/regression-010-index-large-files.vitest.ts tests/continue-session.vitest.ts`, `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts`, `npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts` |
| Boundary smokes | High-risk bridge and interop path-resolution checks | Targeted smokes for `mcp_server/handlers/v-rule-bridge.ts`, `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/core/config.ts`, and the new scripts interoperability helpers |
| Documentation sync | Spec package and standards docs | `rg`, spec validation scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 18+ runtime | Internal | Green | ESM entrypoints cannot be validated |
| `@modelcontextprotocol/sdk` package entrypoints | External | Green | SDK import conventions influence the final module strategy |
| Workspace package boundaries (`shared`, `mcp_server`, `scripts`) | Internal | Yellow | Mixed module modes can break builds or startup unexpectedly |
| Existing test harness and Vitest config | Internal | Yellow | Runtime migration may require test-path adjustments |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Module migration breaks entrypoint startup, test resolution, or cross-workspace interoperability
- **Procedure**: Revert package/compiler changes together, restore pre-migration import specifiers, and keep standards docs pinned to the last verified runtime truth
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Phase 0 (Baseline) -> Phase 1 (Package metadata + NodeNext) -> Phase 2 (Imports + interop) -> Phase 3 (Verify + docs)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0: Baseline and strategy lock | Low | 30-60 minutes |
| Phase 1: Toolchain and package alignment | Medium | 2-4 hours |
| Phase 2: Import graph and interop migration | High | 6-12 hours |
| Phase 3: Verification and follow-on docs | Medium | 3-5 hours |
| **Total** | **High** | **11.5-22 hours** |
