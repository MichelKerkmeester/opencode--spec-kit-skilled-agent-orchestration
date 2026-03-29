---
title: "Tasks: Scripts Interop Refactor"
description: "Task breakdown for @spec-kit/scripts CJS-to-ESM interoperability refactor and test rewrites."
trigger_phrases:
  - "scripts interop tasks"
  - "023 phase 3 tasks"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: Scripts Interop Refactor

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
## Step 1: Interop Helper

- [ ] T001 Create `scripts/src/lib/esm-interop.ts` with typed dynamic `import()` wrappers - WHY: central boundary for CJS->ESM crossing - Acceptance: helper exports typed functions for `shared` and `mcp-server/api*` surfaces
- [ ] T002 Handle async loading pattern with proper error handling - WHY: `import()` returns Promises in CJS context - Acceptance: helper gracefully handles import failures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Consumer Refactors

- [ ] T003 Audit all 38 scripts files consuming ESM siblings - WHY: need bounded scope before committing to interop approach - Acceptance: audit list with change complexity per file
- [ ] T004 Replace `require('@spec-kit/shared/...')` calls with interop helpers - WHY: `require()` of ESM packages fails at runtime - Acceptance: zero direct `require()` of `@spec-kit/shared` in scripts
- [ ] T005 Replace `require('@spec-kit/mcp-server/api...')` calls with interop helpers - WHY: same CJS->ESM boundary issue - Acceptance: zero direct `require()` of `@spec-kit/mcp-server` in scripts
- [ ] T006 Ensure all refactored call sites correctly `await` async imports - WHY: dynamic `import()` is async - Acceptance: no unhandled Promise sites at interop boundaries
- [ ] T007 Evaluate dual-build fallback if interop proves too invasive - WHY: research defines explicit fallback gate - Acceptance: documented decision if >50% of files need deep restructuring
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Test Rewrites

- [ ] T008 Rewrite module-sensitive tests asserting old CJS emit details - WHY: tests anchored to old output hide real runtime breakage - Acceptance: updated suites assert ESM runtime truth
- [ ] T009 [P] Update `modularization.vitest.ts` and `trigger-config-extended.vitest.ts` - WHY: these suites are module-boundary sensitive - Acceptance: suites pass with ESM packages
- [ ] T010 [P] Update `test-integration.vitest.ts` and `architecture-boundary-enforcement.vitest.ts` - WHY: integration tests must reflect new interop boundaries - Acceptance: suites pass
- [ ] T011 Add or update scripts interop tests (`test-scripts-modules.js`, `test-export-contracts.js`) - WHY: interop proof is required, not optional - Acceptance: dedicated tests exercise interop helpers and failing paths
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Runtime Verification

- [ ] T012 Run `node scripts/dist/memory/generate-context.js --help` - WHY: primary CLI surface must work - Acceptance: help output displayed, exit code 0
- [ ] T013 Run `npm run test --workspace=@spec-kit/scripts` - WHY: full test suite must pass - Acceptance: exit code 0
- [ ] T014 Run module-sensitive Vitest suites - WHY: ESM-truth assertions must pass - Acceptance: all targeted suites green
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T014 marked `[x]`
- [ ] `scripts` stays CommonJS with proven ESM interop
- [ ] No dual-build fallback needed (or decision documented if needed)
- [ ] Handoff criteria met for Phase 4 (004-verification-and-standards)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
