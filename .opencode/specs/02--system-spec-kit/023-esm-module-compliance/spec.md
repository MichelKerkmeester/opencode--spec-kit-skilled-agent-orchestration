---
title: "Feature Specification: ESM Module Compliance"
description: "Capture the real mcp_server ESM compliance refactor: align package metadata, compiler settings, import specifiers, and follow-on standards docs."
trigger_phrases:
  - "esm module compliance"
  - "mcp_server esm refactor"
  - "system-spec-kit esm migration"
importance_tier: "standard"
contextType: "architecture"
---
# Feature Specification: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

### Executive Summary

This spec folder now describes the actual `mcp_server/` ESM compliance refactor rather than a documentation-only wording fix. The TypeScript source tree already prefers `import`/`export` authoring, but the runtime contract is still CommonJS-oriented today: the workspace compiler target is `commonjs`, the `@spec-kit/mcp-server` package does not declare `"type": "module"`, the built entrypoint emits `require(...)` and `exports`, and production code still contains 1,482 extensionless relative imports that are not valid Node ESM specifiers.

**Key Decisions**: Treat this as a real code-and-tooling migration for `mcp_server/`, keep `scripts/` on CommonJS unless a later phase intentionally changes it, and update standards docs only after the runtime truth has been established in code.

**Critical Dependencies**: `.opencode/skill/system-spec-kit/tsconfig.json`, `.opencode/skill/system-spec-kit/mcp_server/package.json`, relative import/export paths across `mcp_server/**/*.ts`, and the build/test harness that exercises those entrypoints.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-23 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level spec folder) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The earlier version of this spec understated the work by treating ESM compliance as a standards-document update. In reality, the codebase is in a mixed state: authoring syntax looks ESM, but the package metadata, compiler settings, emitted JavaScript, and most production-relative imports still align to a CommonJS runtime shape.

### Purpose
Turn this spec into an actionable plan for completing the true `mcp_server/` ESM runtime migration and then documenting that final architecture accurately.

### Rationale
Without this correction, future implementation work would be under-scoped. The repo would still ship CommonJS output while the spec incorrectly claims the architecture is already ESM-compliant.
<!-- /ANCHOR:problem -->

---

### Current State Evidence

| Artifact | Current State | Refactor Implication |
|----------|---------------|----------------------|
| `.opencode/skill/system-spec-kit/tsconfig.json` | Root compiler options still set `"module": "commonjs"` and `"moduleResolution": "node"` | `mcp_server` does not currently compile with a true Node ESM contract |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | No `"type": "module"` is declared; `main`, `exports`, and `bin` all point to `.js` files in `dist/` | Node will continue treating emitted `.js` as CommonJS unless package metadata changes |
| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | Built output starts with `"use strict"` and emits `require(...)` and `exports` wrappers | The current runtime artifact is CommonJS, not native ESM |
| `.opencode/skill/system-spec-kit/mcp_server/**/*.ts` | `mcp_server` still has `1883` relative import/export statements and only `13` `.js`-suffixed ones across source plus tests; the non-test tree still has `0` `.js` relative specifiers | The migration needs a large specifier rewrite and cannot rely on test-only ESM-style imports |
| `.opencode/skill/system-spec-kit/shared/**/*.ts` | `shared` still has `54` relative import/export statements without Node-valid `.js` specifiers | `mcp_server` cannot become native ESM safely while a heavily imported sibling package stays extensionless and CommonJS-shaped |
| `.opencode/skill/system-spec-kit/scripts/package.json` and `scripts/**/*.ts` | `scripts` explicitly stays `"type": "commonjs"` and still touches `@spec-kit/shared` / `@spec-kit/mcp-server` in `38` files | The migration must preserve the CommonJS package boundary and add explicit interop instead of flipping the whole workspace |
| `.opencode/skill/system-spec-kit/mcp_server/core/config.ts` | A live runtime file still reaches into `shared` with a sibling-relative import path (`../../shared/paths`) that resolves today through CommonJS behavior | Native ESM needs package/subpath imports at cross-package boundaries, not repo-relative hops that happen to work in CJS builds |

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Update the spec package in this folder so it reflects the real cross-package migration scope and verification gates
- Move `shared` and `mcp_server` package metadata and compiler settings to real ESM-compatible runtime contracts
- Rewrite production relative imports/exports in `shared/**/*.ts` and `mcp_server/**/*.ts` to Node-valid runtime specifiers
- Replace CommonJS-only runtime assumptions and path-resolution patterns at the `mcp_server` and `scripts` interoperability boundary
- Replace cross-package relative imports with real package or subpath imports wherever `mcp_server` currently reaches into `shared`
- Align test files, exact build/typecheck commands, emitted entrypoints, and runtime smoke checks with the chosen mixed-module strategy
- Update standards documentation only after the runtime migration proves the final architecture

### Out of Scope
- Converting the `scripts/` workspace itself to ESM in the same phase
- Behavior changes unrelated to module loading or path resolution
- Manual edits to generated `dist/` artifacts without corresponding source changes
- Starting with dual-build / conditional-exports unless the bounded scripts-interop pass proves that necessary
- Broad style-guide rewrites outside the module-compliance clarification

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/02--system-spec-kit/023-esm-module-compliance/spec.md` | Update | Reframe the spec around the real multi-package runtime migration |
| `specs/02--system-spec-kit/023-esm-module-compliance/plan.md` | Update | Expand the implementation plan for the chosen ESM strategy |
| `specs/02--system-spec-kit/023-esm-module-compliance/tasks.md` | Update | Track `shared`, `mcp_server`, and `scripts` interop workstreams |
| `specs/02--system-spec-kit/023-esm-module-compliance/checklist.md` | Update | Verify ESM runtime, scripts interop, and doc follow-through |
| `.opencode/skill/system-spec-kit/shared/package.json` | Update | Align `@spec-kit/shared` package metadata with package-local ESM |
| `.opencode/skill/system-spec-kit/shared/tsconfig.json` | Update | Introduce package-local Node-aware ESM compiler settings |
| `.opencode/skill/system-spec-kit/shared/**/*.ts` | Update | Rewrite runtime-relative imports/exports to `.js` specifiers |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Update | Align package metadata and entrypoints with ESM runtime expectations |
| `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` | Update | Introduce package-local Node-aware ESM compiler settings |
| `.opencode/skill/system-spec-kit/mcp_server/**/*.ts` | Update | Rewrite runtime-relative imports/exports, convert cross-package relative imports to package/subpath imports, and fix module-resolution edge cases |
| `.opencode/skill/system-spec-kit/scripts/**/*.ts` | Update | Preserve CommonJS entrypoints while adding explicit ESM interop helpers in both CLI wrappers and internal runtime modules |
| `.opencode/skill/sk-code--opencode/SKILL.md` | Update | Document the final module standard after the code refactor lands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `shared` and `mcp_server` use real ESM runtime contracts | Package metadata and package-local compiler settings emit Node-executable ESM rather than CommonJS wrappers |
| REQ-002 | Production imports/exports are ESM-compatible across both packages | Non-test `shared/**/*.ts` and `mcp_server/**/*.ts` files use runtime-valid relative specifiers, cross-package imports use package/subpath boundaries, and the packages pass typecheck/build verification |
| REQ-003 | Entrypoints and exports remain launchable after migration | `shared` exports plus `mcp_server` `main`, `exports`, `bin`, and start commands resolve correctly against emitted ESM output |
| REQ-004 | `scripts/` CommonJS workflows remain intact through explicit interop | `generate-context.js` and other `scripts/` entrypoints continue to work while `@spec-kit/shared` and `@spec-kit/mcp-server/api*` are loaded through approved interop boundaries |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Test harness and local tooling align with the new mixed-module mode | Vitest config, direct test imports, scripts interoperability helpers, and targeted runtime smoke checks pass under the chosen ESM strategy |
| REQ-006 | Standards docs are updated after runtime truth is established | `sk-code--opencode` and any related ADR text describe the implemented architecture, not the pre-refactor assumption |
| REQ-007 | Spec folder stays synchronized with the implementation reality | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` reflect actual migration status and evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: `shared` and `mcp_server` build to native ESM entrypoints instead of CommonJS `require(...)` wrappers
- **SC-002**: Non-test relative imports/exports under `shared/**/*.ts` and `mcp_server/**/*.ts` no longer rely on extensionless specifiers
- **SC-003**: `scripts` CommonJS entrypoints continue to work while loading `@spec-kit/shared` and `@spec-kit/mcp-server/api*` through explicit interoperability helpers
- **SC-004**: The exact verification matrix in `research/research.md` passes after migration, including `node dist/context-server.js` and `node scripts/dist/memory/generate-context.js --help`
- **SC-005**: Standards documentation is updated to match the final runtime architecture
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

1. **Given** `shared` and `mcp_server` still emit CommonJS today, **when** package-local Node-aware ESM settings and package metadata are updated, **then** their emitted `dist/*.js` entrypoints should ship as native ESM without `require(...)` wrappers.
2. **Given** production files still contain extensionless relative imports, **when** the import graphs are migrated, **then** non-test `shared/**/*.ts` and `mcp_server/**/*.ts` files should use runtime-valid ESM specifiers.
3. **Given** `scripts` must remain CommonJS, **when** sibling packages flip to ESM, **then** scripts-owned runtime callers should continue working through explicit interoperability helpers instead of direct `require()` of ESM packages.
4. **Given** package metadata, runtime imports, and boundary loaders change together, **when** the exact verification matrix runs, **then** `node dist/context-server.js`, `node scripts/dist/memory/generate-context.js --help`, and targeted tests should still resolve and execute successfully.
5. **Given** the runtime migration is complete, **when** standards docs are refreshed, **then** `sk-code--opencode` and related spec artifacts should describe the final architecture instead of the pre-refactor assumption.

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widespread import-specifier churn creates noisy diffs and broken edge paths | High | Migrate in phases, prefer scripted edits where possible, and verify barrels/re-exports separately |
| Risk | Workspace-level CJS and ESM settings interact in unexpected ways | High | Isolate `shared` and `mcp_server` package-local ESM changes, keep `scripts/` explicitly CommonJS, and smoke-test both entrypoint families |
| Risk | Test helpers pass while production entrypoints still emit CommonJS | Medium | Inspect built `dist/context-server.js` directly instead of relying on source syntax alone |
| Risk | `scripts` CommonJS callers break when sibling packages flip to ESM | High | Convert runtime consumers to explicit `await import(...)` helper boundaries and add focused interoperability regression tests |
| Dependency | `@modelcontextprotocol/sdk` entrypoints already use `.js` ESM specifiers | Green | Use current SDK import style as the baseline for runtime-compatible imports |
| Dependency | Existing package `exports` and CLI `bin` wiring | Yellow | Update `shared` export maps plus `mcp_server` metadata together with emitted file shape and smoke-test startup |
<!-- /ANCHOR:risks -->

---

### Refactor Workstreams

### Workstream 1: Module-System Boundary
- Apply the locked package-local NodeNext strategy to `shared` and `mcp_server`
- Keep `scripts/` explicitly isolated so CommonJS workflows do not break accidentally

### Workstream 2: Import Graph Migration
- Rewrite production relative imports and re-exports in `shared` and `mcp_server` to runtime-valid specifiers
- Audit barrel files and deep `../` imports that are easy to miss during bulk edits

### Workstream 3: Verification
- Prove the emitted `shared` and `mcp_server` entrypoints are ESM
- Re-run the exact build/typecheck/tests and boundary smoke checks after the import graphs and package metadata change

### Workstream 4: Follow-On Documentation
- Update standards docs and any shared ADR text after the runtime state is verified
- Keep this spec package and implementation summary synchronized with actual results

---

## L2: EDGE CASES

### Module Resolution
- Barrel exports may compile cleanly but fail at runtime if re-export specifiers stay extensionless
- `scripts` CommonJS consumers cannot use unchanged static `require()` calls against ESM sibling packages
- Cross-package relative imports from `mcp_server` into `shared` need to become package/subpath imports before the runtime can be considered boundary-safe
- JSON imports and package-internal path aliases need verification under the final ESM strategy

### Runtime Entrypoints
- `shared` exports plus `mcp_server` `main`, `exports`, and `bin` all target `.js` files that currently execute as CommonJS
- `node dist/context-server.js` must remain launchable after the migration

### Test Boundary
- Some tests already import `.js` paths, which can mask production files that still use extensionless imports
- Vitest config may require small adjustments once package/module settings change

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- No unresolved strategy questions remain from the research run.
- The implementation decision is locked: `shared` and `mcp_server` move together to package-local native ESM with `module: "nodenext"`, `moduleResolution: "nodenext"`, and `"type": "module"`.
- `scripts` stays `"type": "commonjs"` and must consume ESM sibling packages only through explicit interoperability helpers.
- Standards-doc updates should ship only after the runtime verification matrix passes.
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
