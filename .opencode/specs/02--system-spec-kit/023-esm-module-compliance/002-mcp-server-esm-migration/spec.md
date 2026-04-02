---
title: "Feature Specification: MCP Server [02--system-spec-kit/023-esm-module-compliance/002-mcp-server-esm-migration/spec]"
description: "Migrate @spec-kit/mcp-server to package-local native ESM: package metadata, tsconfig, import rewrites, and CommonJS cleanup."
trigger_phrases:
  - "mcp server esm migration"
  - "mcp_server esm"
  - "023 phase 2"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: MCP Server ESM Migration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 2** of the ESM Module Compliance specification.

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-shared-esm-migration |
| **Successor** | 003-scripts-interop-refactor |
| **Handoff Criteria** | `mcp_server` emits native ESM, CJS globals removed, `node dist/context-server.js` starts |

**Scope Boundary**: Package metadata, compiler settings, import rewrites, and CommonJS runtime cleanup for `@spec-kit/mcp-server` only. Requires Phase 1 (`shared` ESM) to be complete.

**Dependencies**:
- Phase 1 complete: `shared` emits native ESM
- Parent research locked in `../research/research.md`

**Deliverables**:
- `mcp_server/package.json` with native ESM metadata
- `mcp_server/tsconfig.json` with NodeNext settings
- All `mcp_server/**/*.ts` imports rewritten to `.js` specifiers
- CommonJS globals (`__dirname`, `__filename`, `require()`) replaced with ESM equivalents
- Cross-package relative hops replaced with package/subpath imports
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-29 |
| **Branch** | `main` |
| **Parent Spec** | 023-esm-module-compliance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`@spec-kit/mcp-server` has no `"type": "module"` in its `package.json`, inherits the root CommonJS compiler baseline, uses 839 relative import/export statements with only 3 `.js`-suffixed (all external SDK), and has 16 non-test files using CommonJS-only globals (`__dirname`, `__filename`, `createRequire`, `require()`). The emitted `dist/context-server.js` still outputs `exports` and `require(...)`.

### Purpose
Make `@spec-kit/mcp-server` a truthful native ESM package so that its runtime entrypoint (`dist/context-server.js`) executes as real Node ESM and its imports from the now-ESM `@spec-kit/shared` resolve correctly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `mcp_server/package.json` `type`, `main`, `exports`, and `bin` for native ESM
- Apply package-local TypeScript settings (`module: "nodenext"`, `moduleResolution: "nodenext"`, `verbatimModuleSyntax: true`)
- Rewrite all relative imports and exports in `mcp_server/**/*.ts` to `.js` specifiers
- Replace CommonJS-only runtime globals: `__dirname` -> `import.meta.dirname`, `__filename` -> `import.meta.filename`, `require()` -> `import()` or `createRequire`
- Replace cross-package relative hops (e.g., `../../shared/...`) with package or subpath imports
- Verify `node dist/context-server.js` starts successfully

### Out of Scope
- Changes to `shared` (Phase 1, must be complete)
- Changes to `scripts` (Phase 3)
- Test rewrites for CommonJS-emit assumptions (Phase 3)
- Standards docs outside 023

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/package.json` | Modify | Add `"type": "module"`, update `main`/`exports`/`bin` |
| `mcp_server/tsconfig.json` | Modify | Set `module`/`moduleResolution` to `nodenext`, add `verbatimModuleSyntax` |
| `mcp_server/lib/**/*.ts` | Modify | Rewrite relative imports to `.js`, replace CJS globals |
| `mcp_server/handlers/**/*.ts` | Modify | Rewrite relative imports to `.js`, replace CJS globals |
| `mcp_server/tools/**/*.ts` | Modify | Rewrite relative imports to `.js`, replace CJS globals |
| `mcp_server/context-server.ts` | Modify | Rewrite imports, replace CJS globals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `mcp_server/package.json` declares native ESM | `"type": "module"` present, `main`/`exports`/`bin` point to ESM dist output |
| REQ-002 | `mcp_server/tsconfig.json` emits native ESM | `module: "nodenext"`, `moduleResolution: "nodenext"`, `verbatimModuleSyntax: true` |
| REQ-003 | All relative imports use `.js` specifiers | No extensionless relative imports remain in non-test `mcp_server/**/*.ts` |
| REQ-004 | CommonJS globals are removed | No `__dirname`, `__filename`, or bare `require()` in non-test production files |
| REQ-005 | Cross-package hops use package imports | No `../../shared/...` relative imports; use `@spec-kit/shared/...` or subpath imports |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Server entrypoint starts | `node dist/context-server.js` runs without module resolution errors |
| REQ-007 | Package builds cleanly | `npm run build --workspace=@spec-kit/mcp-server` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mcp_server/package.json` has `"type": "module"` and valid `exports`/`bin`
- **SC-002**: `mcp_server/dist/` emits native ESM (no CJS wrappers)
- **SC-003**: `node dist/context-server.js` starts without module errors
- **SC-004**: No CommonJS globals remain in production `mcp_server` files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

### Acceptance Scenarios

**Given** the phase scope and requirements are loaded, **when** implementation starts, **then** only in-scope files and behaviors are changed.

**Given** the phase deliverables are implemented, **when** verification runs, **then** required checks complete without introducing regressions.

**Given** this phase depends on predecessor outputs, **when** those dependencies are present, **then** this phase behavior composes correctly with adjacent phases.

**Given** this phase modifies documented behavior, **when** packet docs are reviewed, **then** spec/plan/tasks/checklist remain internally consistent.

**Given** this phase is rerun in a clean environment, **when** the same commands are executed, **then** outcomes are reproducible.

**Given** completion is claimed, **when** evidence is inspected, **then** each required acceptance outcome is explicitly supported.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 complete (`shared` is ESM) | Blocker | Cannot start until `shared` emits ESM |
| Risk | 839 relative import/export statements need `.js` specifiers | High | Use automated rewrite tooling, verify with build |
| Risk | 16 files with CJS globals need manual replacement | Medium | `import.meta.dirname`/`import.meta.filename` are direct replacements (requires Node >=20.11.0; current runtime is v25.6.1). Update `engines` field to `>=20.11.0` as part of package metadata changes |
| Risk | Cross-package relative hops break under ESM | High | Replace with package imports (`@spec-kit/shared/...`) |
| Risk | `dist/context-server.js` startup regression | High | Runtime smoke test immediately after build |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Strategy locked by parent research.
<!-- /ANCHOR:questions -->
