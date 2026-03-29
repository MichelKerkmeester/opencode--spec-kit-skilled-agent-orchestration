---
title: "Tasks: Shared ESM Migration"
description: "Task breakdown for @spec-kit/shared native ESM migration."
trigger_phrases:
  - "shared esm tasks"
  - "023 phase 1 tasks"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: Shared ESM Migration

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
## Phase 1: Package Metadata

- [ ] T001 Add `"type": "module"` to `shared/package.json` - WHY: Node must know this package emits ESM - Acceptance: `"type": "module"` present in `shared/package.json`
- [ ] T002 Update `exports` field in `shared/package.json` to point at ESM dist - WHY: consumers must resolve the correct ESM entrypoints - Acceptance: `exports` map references `.js` files in `dist/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Compiler Settings

- [ ] T003 Set `shared/tsconfig.json` to `module: "nodenext"` and `moduleResolution: "nodenext"` - WHY: compiler must emit native ESM instead of CJS wrappers - Acceptance: settings present, build emits ESM
- [ ] T004 Add `verbatimModuleSyntax: true` to `shared/tsconfig.json` - WHY: prevents TypeScript from rewriting import syntax to CJS - Acceptance: setting present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Import Specifier Rewrites

- [ ] T005 Rewrite all relative imports in `shared/**/*.ts` to use `.js` extensions - WHY: Node ESM requires explicit file extensions for relative imports (no `src/` dir — source at package root) - Acceptance: no extensionless relative imports remain in non-test `shared/` files
- [ ] T006 Rewrite all re-exports in `shared/**/*.ts` to use `.js` extensions - WHY: re-exports follow the same Node ESM specifier rules - Acceptance: no extensionless relative re-exports remain
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Build Verification

- [ ] T007 Update `shared/package.json` build script from no-op echo to `tsc --build`, then run `npm run build --workspace=@spec-kit/shared` - WHY: current build is `echo 'No build step needed'` which would pass on stale artifacts; need real TypeScript compilation - Acceptance: exit code 0, `dist/` contains freshly compiled ESM output
- [ ] T008 Inspect `shared/dist/*.js` output for ESM syntax - WHY: runtime output must be truthful ESM, not CJS wrappers - Acceptance: emitted files use `import`/`export`, not `require()`/`exports`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T008 marked `[x]`
- [ ] `shared` builds to native ESM
- [ ] Handoff criteria met for Phase 2 (002-mcp-server-esm-migration)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
