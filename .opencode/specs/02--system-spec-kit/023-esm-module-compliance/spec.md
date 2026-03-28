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
| `.opencode/skill/system-spec-kit/mcp_server/**/*.ts` (non-test) | 1,482 relative imports/exports are still extensionless; only 14 already use explicit `.js` specifiers | A bulk specifier migration is required for Node ESM compatibility |
| `.opencode/skill/system-spec-kit/mcp_server/tests/**/*.ts` | Some tests already use `.js` specifiers while the production tree mostly does not | Test/runtime assumptions are mixed and must be normalized during the refactor |

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Update the spec package in this folder so it reflects the real `mcp_server/` migration scope and verification gates
- Move `mcp_server` package metadata and compiler settings to a real ESM-compatible runtime contract
- Rewrite production relative imports/exports in `mcp_server/**/*.ts` to Node-valid runtime specifiers
- Align test files, start/build/typecheck commands, and emitted entrypoints with the chosen module strategy
- Update standards documentation only after the runtime migration proves the final architecture

### Out of Scope
- Converting the `scripts/` workspace to ESM in the same phase
- Behavior changes unrelated to module loading or path resolution
- Manual edits to generated `dist/` artifacts without corresponding source changes
- Broad style-guide rewrites outside the module-compliance clarification

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/spec.md` | Update | Reframe the spec around the real runtime migration |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/plan.md` | Update | Expand the implementation plan for the refactor |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/tasks.md` | Update | Track migration workstreams instead of a docs-only change |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/checklist.md` | Update | Verify ESM runtime, tooling, and doc follow-through |
| `.opencode/skill/system-spec-kit/tsconfig.json` | Update | Introduce an ESM-compatible compiler strategy for `mcp_server` |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Update | Align package metadata and entrypoints with ESM runtime expectations |
| `.opencode/skill/system-spec-kit/mcp_server/**/*.ts` | Update | Rewrite runtime-relative imports/exports and any module-resolution edge cases |
| `.opencode/skill/sk-code--opencode/SKILL.md` | Update | Document the final module standard after the code refactor lands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `mcp_server` uses a real ESM runtime contract | Package metadata and compiler settings emit Node-executable ESM rather than CommonJS wrappers |
| REQ-002 | Production relative imports/exports are ESM-compatible | Non-test `mcp_server/**/*.ts` files use runtime-valid relative specifiers and pass typecheck/build verification |
| REQ-003 | Entrypoints and exports remain launchable after migration | `main`, `exports`, `bin`, and start commands resolve correctly against the emitted ESM output |
| REQ-004 | `scripts/` CommonJS workflows remain intact | `generate-context.js` and other `scripts/` entrypoints continue to work or have an explicitly approved follow-up migration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Test harness and local tooling align with the new module mode | Vitest config, direct test imports, and targeted runtime smoke checks pass under the chosen ESM strategy |
| REQ-006 | Standards docs are updated after runtime truth is established | `sk-code--opencode` and any related ADR text describe the implemented architecture, not the pre-refactor assumption |
| REQ-007 | Spec folder stays synchronized with the implementation reality | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` reflect actual migration status and evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: `mcp_server` builds to native ESM entrypoints instead of CommonJS `require(...)` wrappers
- **SC-002**: Non-test relative imports/exports under `mcp_server/**/*.ts` no longer rely on extensionless specifiers
- **SC-003**: `npm run build`, `npm run typecheck`, and targeted `mcp_server` verification commands pass after migration
- **SC-004**: Standards documentation is updated to match the final runtime architecture
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

1. **Given** `mcp_server` still emits CommonJS today, **when** compiler and package settings are updated, **then** `dist/context-server.js` should ship as native ESM without `require(...)` wrappers.
2. **Given** production files still contain extensionless relative imports, **when** the import graph is migrated, **then** non-test `mcp_server/**/*.ts` files should use runtime-valid ESM specifiers.
3. **Given** package metadata and import paths change together, **when** build, typecheck, and targeted server verification run, **then** the entrypoint and tests should still resolve and execute successfully.
4. **Given** the runtime migration is complete, **when** standards docs are refreshed, **then** `sk-code--opencode` and related spec artifacts should describe the final architecture instead of the pre-refactor assumption.

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widespread import-specifier churn creates noisy diffs and broken edge paths | High | Migrate in phases, prefer scripted edits where possible, and verify barrels/re-exports separately |
| Risk | Workspace-level CJS and ESM settings interact in unexpected ways | High | Isolate `mcp_server` changes, keep `scripts/` explicitly scoped, and smoke-test both entrypoints |
| Risk | Test helpers pass while production entrypoints still emit CommonJS | Medium | Inspect built `dist/context-server.js` directly instead of relying on source syntax alone |
| Dependency | `@modelcontextprotocol/sdk` entrypoints already use `.js` ESM specifiers | Green | Use current SDK import style as the baseline for runtime-compatible imports |
| Dependency | Existing package `exports` and CLI `bin` wiring | Yellow | Update package metadata together with emitted file shape and smoke-test startup |
<!-- /ANCHOR:risks -->

---

### Refactor Workstreams

### Workstream 1: Module-System Boundary
- Choose the final compiler/package strategy for `mcp_server` ESM output
- Keep `scripts/` explicitly isolated so CommonJS workflows do not break accidentally

### Workstream 2: Import Graph Migration
- Rewrite production relative imports and re-exports to runtime-valid specifiers
- Audit barrel files and deep `../` imports that are easy to miss during bulk edits

### Workstream 3: Verification
- Prove the emitted entrypoint is ESM
- Re-run build/typecheck/tests after the import graph and package metadata change

### Workstream 4: Follow-On Documentation
- Update standards docs and any shared ADR text after the runtime state is verified
- Keep this spec package and implementation summary synchronized with actual results

---

## L2: EDGE CASES

### Module Resolution
- Barrel exports may compile cleanly but fail at runtime if re-export specifiers stay extensionless
- JSON imports and package-internal path aliases need verification under the final ESM strategy

### Runtime Entrypoints
- `main`, `exports`, and `bin` all target `.js` files that currently execute as CommonJS
- `node dist/context-server.js` must remain launchable after the migration

### Test Boundary
- Some tests already import `.js` paths, which can mask production files that still use extensionless imports
- Vitest config may require small adjustments once package/module settings change

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should `mcp_server` move to `NodeNext` directly, or should it use package-local ESM compiler overrides while the workspace root stays CommonJS for other packages?
- Does `@spec-kit/shared` need package-metadata updates for clean ESM consumption, or is its current export map sufficient once consumers migrate?
- Should the standards-doc update ship in the same change as the runtime migration, or only after build/test verification lands?
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
