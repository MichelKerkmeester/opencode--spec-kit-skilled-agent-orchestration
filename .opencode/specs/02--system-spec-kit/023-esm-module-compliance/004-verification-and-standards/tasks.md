---
title: "Tasks: Verification and Standards Sync"
description: "Task breakdown for highest-risk retests, verification matrix, and deferred standards-doc sync."
trigger_phrases:
  - "verification tasks"
  - "023 phase 4 tasks"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: Verification and Standards Sync

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
## Step 1: Highest-Risk Retests

- [ ] T001 [P] Re-test `memory-save.ts` runtime paths - WHY: research identified as highest-risk recent surface - Acceptance: targeted smoke or regression passes
- [ ] T002 [P] Re-test `memory-index.ts` runtime paths - WHY: high-risk recent surface - Acceptance: targeted test passes
- [ ] T003 [P] Re-test `shared-memory.ts` runtime paths - WHY: high-risk recent surface - Acceptance: targeted test passes
- [ ] T004 [P] Re-test `vector-index-store.ts` runtime paths - WHY: high-risk recent surface - Acceptance: targeted test passes
- [ ] T005 [P] Re-test `session-manager.ts` runtime paths - WHY: high-risk recent surface - Acceptance: targeted test passes
- [ ] T006 [P] Re-test `scripts/memory/generate-context.ts` - WHY: primary CLI surface - Acceptance: `node scripts/dist/memory/generate-context.js --help` passes
- [ ] T007 [P] Re-test `scripts/core/workflow.ts` - WHY: core workflow engine - Acceptance: targeted test passes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Full Verification Matrix

- [ ] T008 Run root gates: `npm run --workspaces=false typecheck` and `npm run --workspaces=false test:cli` - WHY: workspace-level proof - Acceptance: both exit 0
- [ ] T009 Run workspace builds and tests - WHY: package-level proof - Acceptance: `npm run build` and `npm run test` for `mcp-server` and `scripts` workspaces exit 0
- [ ] T010 Run module-sensitive Vitest suites - WHY: high-signal module boundary verification - Acceptance: all listed suites pass
- [ ] T011 Run runtime smokes - WHY: entrypoint behavior proof - Acceptance: `node dist/context-server.js` and `node scripts/dist/memory/generate-context.js --help` pass
- [ ] T012 Run scripts interop tests - WHY: interop proof required - Acceptance: `test-scripts-modules.js` and `test-export-contracts.js` pass
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Standards-Doc Sync

- [ ] T013 Update `sk-code--opencode` standards docs with verified ESM state - WHY: standards must describe verified runtime, not planning intent - Acceptance: docs reflect actual ESM package configuration
- [ ] T014 Update any other affected standards surfaces - WHY: consistency across documentation - Acceptance: no standards doc references stale CJS patterns for migrated packages
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Packet Closure

- [ ] T015 Update parent `implementation-summary.md` with final runtime evidence - WHY: summary must record what shipped - Acceptance: summary includes verification results and migration evidence
- [ ] T016 Mark all parent `checklist.md` P0/P1 items with evidence - WHY: packet cannot close with pending items - Acceptance: all P0 items have `[x]` with `[EVIDENCE: ...]`
- [ ] T017 Close the parent packet - WHY: no implementation-pending caveats should remain - Acceptance: parent status set to Complete
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T017 marked `[x]`
- [ ] Full verification matrix passes
- [ ] Standards docs updated from verified runtime state
- [ ] Parent packet closed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Parent Checklist**: See `../checklist.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
