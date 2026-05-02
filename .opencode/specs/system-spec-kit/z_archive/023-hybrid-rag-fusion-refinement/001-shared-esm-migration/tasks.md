---
title: "Tasks: Shared ESM Migration [system-spec-kit/023-hybrid-rag-fusion-refinement/001-shared-esm-migration/tasks]"
description: "Task breakdown for @spec-kit/shared native ESM migration."
trigger_phrases:
  - "shared esm tasks"
  - "023 phase 1 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/001-shared-esm-migration"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Shared ESM Migration

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
## Phase 1: Setup

- [x] T001 Add `"type": "module"` to `shared/package.json` - WHY: Node must know this package emits ESM - Acceptance: `"type": "module"` present in `shared/package.json`. Evidence: committed in `018f3360b` as the Phase 1 `@spec-kit/shared` native ESM migration.
- [x] T002 Update `exports` field in `shared/package.json` to point at ESM dist - WHY: consumers must resolve the correct ESM entrypoints - Acceptance: `exports` map references `.js` files in `dist/`. Evidence: `018f3360b` landed the shared package export-map rewrite and the phase verification records that `dist/` emits ESM.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Set `shared/tsconfig.json` to `module: "nodenext"` and `moduleResolution: "nodenext"` - WHY: compiler must emit native ESM instead of CJS wrappers - Acceptance: settings present, build emits ESM. Evidence: `018f3360b` switched `shared` to the NodeNext ESM compiler path and the shared build passes.
- [x] T004 Add `verbatimModuleSyntax: true` to `shared/tsconfig.json` - WHY: prevents TypeScript from rewriting import syntax to CJS - Acceptance: setting present. Evidence: `018f3360b` completed the shared TypeScript ESM configuration that now emits native ESM output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rewrite all relative imports in `shared/**/*.ts` to use `.js` extensions - WHY: Node ESM requires explicit file extensions for relative imports (no `src/` dir — source at package root) - Acceptance: no extensionless relative imports remain in non-test `shared/` files. Evidence: `018f3360b` completed the Phase 1 `.js` specifier rewrite and the emitted `dist/` files are ESM.
- [x] T006 Rewrite all re-exports in `shared/**/*.ts` to use `.js` extensions - WHY: re-exports follow the same Node ESM specifier rules - Acceptance: no extensionless relative re-exports remain. Evidence: `018f3360b` completed the shared re-export rewrite required for native ESM output.
<!-- /ANCHOR:phase-3 -->

---

### Phase 4: Build Verification

- [x] T007 Update `shared/package.json` build script from no-op echo to `tsc --build`, then run `npm run build --workspace=@spec-kit/shared` - WHY: current build is `echo 'No build step needed'` which would pass on stale artifacts; need real TypeScript compilation - Acceptance: exit code 0, `dist/` contains freshly compiled ESM output. Evidence: shared build passes after `018f3360b`.
- [x] T008 Inspect `shared/dist/*.js` output for ESM syntax - WHY: runtime output must be truthful ESM, not CJS wrappers - Acceptance: emitted files use `import`/`export`, not `require()`/`exports`. Evidence: Phase 1 verification records that `shared/dist/*.js` emits ESM, not CommonJS wrappers.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T008 marked `[x]`. Evidence: Phase 1 closed in commit `018f3360b`.
- [x] `shared` builds to native ESM. Evidence: shared build passes and `dist/` emits ESM output.
- [x] Handoff criteria met for Phase 2 (002-mcp-server-esm-migration). Evidence: Phase 1 completed the `type: "module"`, NodeNext, and `.js` specifier handoff required by Phase 2.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
