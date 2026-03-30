---
title: "Feature Specification: Shared ESM Migration"
description: "Migrate @spec-kit/shared to package-local native ESM: package metadata, tsconfig, and import rewrites."
trigger_phrases:
  - "shared esm migration"
  - "shared package esm"
  - "023 phase 1"
importance_tier: "standard"
contextType: "architecture"
---
# Feature Specification: Shared ESM Migration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 1** of the ESM Module Compliance specification.

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-mcp-server-esm-migration |
| **Handoff Criteria** | `shared` emits native ESM, `shared/package.json` has `"type": "module"`, all relative imports use `.js` specifiers |

**Scope Boundary**: Package metadata, compiler settings, and import specifiers for `@spec-kit/shared` only. No changes to `mcp_server` or `scripts`.

**Dependencies**:
- Parent research locked in `../research/research.md`

**Deliverables**:
- `shared/package.json` with native ESM metadata
- `shared/tsconfig.json` with NodeNext settings
- All `shared/**/*.ts` imports rewritten to `.js` specifiers
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
`@spec-kit/shared` has no `"type": "module"` in its `package.json`, its `tsconfig.json` inherits the root CommonJS baseline (`module: "commonjs"`, `moduleResolution: "node"`), and its 48 relative imports lack the `.js` extension specifiers that Node ESM requires. This means `shared` emits CommonJS output and must be migrated before `mcp_server` can safely flip to ESM.

### Purpose
Make `@spec-kit/shared` a truthful native ESM package so that `mcp_server` (Phase 2) can consume it as a real ESM sibling rather than relying on CommonJS interop heuristics.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `shared/package.json` to declare `"type": "module"` and truthful ESM exports
- Apply package-local TypeScript settings (`module: "nodenext"`, `moduleResolution: "nodenext"`, `verbatimModuleSyntax: true`)
- Rewrite all relative imports and re-exports in `shared/**/*.ts` to runtime-valid `.js` specifiers
- Verify `shared` builds to native ESM output

### Out of Scope
- Changes to `mcp_server` (Phase 2)
- Changes to `scripts` (Phase 3)
- Root `tsconfig.json` changes (package-local overrides only)
- Test rewrites (Phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/package.json` | Modify | Add `"type": "module"`, update `exports` field |
| `shared/tsconfig.json` | Modify | Set `module`/`moduleResolution` to `nodenext`, add `verbatimModuleSyntax` |
| `shared/**/*.ts` | Modify | Rewrite relative imports/exports to `.js` specifiers (no `src/` directory — source files are at package root) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `shared/package.json` declares native ESM | `"type": "module"` present, `exports` map points to `.js` ESM output |
| REQ-002 | `shared/tsconfig.json` emits native ESM | `module: "nodenext"`, `moduleResolution: "nodenext"`, `verbatimModuleSyntax: true` |
| REQ-003 | All relative imports use `.js` specifiers | No extensionless relative imports remain in non-test `shared/**/*.ts` files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `shared` builds cleanly | `npm run build --workspace=@spec-kit/shared` exits 0 |
| REQ-005 | Emitted output is ESM | `shared/dist/*.js` files contain `export`/`import` statements, not `require()`/`exports` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `shared/package.json` has `"type": "module"` and valid `exports` map
- **SC-002**: `shared/dist/` emits native ESM (no CommonJS wrappers)
- **SC-003**: All relative imports in `shared/**/*.ts` use `.js` specifiers
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent research (`../research/research.md`) | Source of truth for package-level decisions | Research is locked (20 iterations complete) |
| Risk | `shared` consumers in `mcp_server` break after flip | High | Phase 2 immediately follows to align `mcp_server` |
| Risk | Root `tsconfig.json` inheritance conflicts with package-local overrides | Medium | Use explicit `extends` or standalone settings in `shared/tsconfig.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Strategy locked by parent research.
<!-- /ANCHOR:questions -->
