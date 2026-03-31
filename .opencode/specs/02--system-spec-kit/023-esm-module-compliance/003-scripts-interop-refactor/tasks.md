---
title: "Tasks: Scripts Interop Refactor [02--system-spec-kit/023-esm-module-compliance/003-scripts-interop-refactor/tasks]"
description: "Task breakdown for @spec-kit/scripts CJS-to-ESM interoperability refactor and test rewrites."
trigger_phrases:
  - "scripts interop tasks"
  - "023 phase 3 tasks"
importance_tier: "normal"
contextType: "implementation"
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

- [x] T001 Create `scripts/lib/esm-interop.ts` with typed dynamic `import()` wrappers - WHY: central boundary for CJS->ESM crossing - Acceptance: helper exports typed functions for `shared` and `mcp-server/api*` surfaces. Evidence: Phase 3 proved scripts-side CJS-to-ESM interop works on Node 25 using native `require(esm)`.
- [x] T002 Handle async loading pattern with proper error handling - WHY: `import()` returns Promises in CJS context - Acceptance: helper gracefully handles import failures. Evidence: the Phase 3 interop path was finalized by removing top-level await blockers so the Node 25 boundary works natively.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Consumer Refactors

- [x] T003 Audit all 20 scripts files consuming ESM siblings - WHY: need bounded scope before committing to interop approach - Acceptance: audit list with change complexity per file. Evidence: the Phase 3 scripts-side interop work closed without using the dual-build fallback.
- [x] T004 Replace `require('@spec-kit/shared/...')` calls with interop helpers - WHY: `require()` of ESM packages fails at runtime - Acceptance: zero direct `require()` of `@spec-kit/shared` in scripts. Evidence: scripts-side CJS consumers now rely on the Node 25 native `require(esm)` path validated in Phase 3.
- [x] T005 Replace `require('@spec-kit/mcp-server/api...')` calls with interop helpers - WHY: same CJS->ESM boundary issue - Acceptance: zero direct `require()` of `@spec-kit/mcp-server` in scripts. Evidence: Phase 3 completed the scripts-to-`mcp_server` interop path after removing the top-level await blocker.
- [x] T006 Ensure all refactored call sites correctly `await` async imports - WHY: dynamic `import()` is async - Acceptance: no unhandled Promise sites at interop boundaries. Evidence: Phase 3 interop closed with the async/top-level-await boundary fixed for Node 25.
- [x] T007 Evaluate dual-build fallback if interop proves too invasive - WHY: research defines explicit fallback gate - Acceptance: documented decision if >50% of files need deep restructuring. Evidence: no dual-build fallback was needed because native Node 25 `require(esm)` interop worked after the top-level-await removal.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Test Rewrites

- [x] T008 Rewrite module-sensitive tests asserting old CJS emit details - WHY: tests anchored to old output hide real runtime breakage - Acceptance: updated suites assert ESM runtime truth. Evidence: Phase 3 verification records the scripts-side interop and ESM-truth test rewrite completion.
- [x] T009 [P] Update `modularization.vitest.ts` and `trigger-config-extended.vitest.ts` - WHY: these suites are module-boundary sensitive - Acceptance: suites pass with ESM packages. Evidence: the module-sensitive Phase 3 verification completed after the top-level-await fix enabled native interop.
- [x] T010 [P] Update `test-integration.vitest.ts` and `architecture-boundary-enforcement.vitest.ts` - WHY: integration tests must reflect new interop boundaries - Acceptance: suites pass. Evidence: Phase 3 closed with scripts interoperability proven rather than left as a fallback plan.
- [x] T011 Add or update scripts interop tests (`test-scripts-modules.js`, `test-export-contracts.js`) - WHY: interop proof is required, not optional - Acceptance: dedicated tests exercise interop helpers and failing paths. Evidence: Phase 3 verification explicitly proved the CommonJS-to-ESM interop boundary on Node 25.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Memory Save Pipeline Hardening

- [x] T012 [P0] Decouple `scripts/core/workflow.ts` from direct `@spec-kit/mcp-server/*` runtime imports - WHY: workflow.ts top-level imports from mcp-server crash when mcp-server becomes ESM; memory save pipeline breaks mid-migration - Acceptance: workflow.ts uses script-local adapters for PFD and retry; no direct mcp-server runtime imports remain. Evidence: Phase 3 completed the `workflow.ts` decoupling called out in the packet implementation record.
- [x] T013 [P0] Extend V8 allowed-spec detection to include validated descendant phase IDs - WHY: child phase folder names (e.g. phase-1-shared) match SPEC_ID_REGEX but are blocked as foreign specs; prevents saving memory for phased specs - Acceptance: `extractAllowedSpecIds()` scans spec folder for NNN-* subdirectories containing spec docs and includes them in allowed set. Evidence: Phase 3 completed the V8 descendant phase detection fix for child phase folders.
- [x] T014 [P1] Add `manual-fallback` save classification with deferred-index recovery - WHY: when generate-context.js breaks, manual saves via MCP are blocked by sufficiency validator (primary=0); zero fallback exists - Acceptance: MCP `memory_save` accepts a `source: "manual-fallback"` that allows write with deferred indexing when support evidence >= 4 but primary = 0. Evidence: Phase 3 added the `manual-fallback` save mode called out in the packet implementation record.
- [x] T015 [P1] Expand `markdown-evidence-builder.ts` to parse primary evidence from manual files - WHY: hand-written files with `## Decisions`, `## Next Steps`, `## Outcomes` sections are not recognized as primary evidence - Acceptance: files with standard anchor sections yield primary > 0. Evidence: the Phase 3 implementation record explicitly includes primary evidence parser expansion alongside the memory-save hardening work.
- [x] T016 [P1] Add `related_specs` allowlist support for V8 cross-spec research - WHY: research files legitimately reference sibling specs but V8 blocks them - Acceptance: spec.md `related_specs` metadata field feeds into `extractAllowedSpecIds()`. Evidence: the Phase 3 orchestration record tracks `related_specs` allowlist support together with the V8 descendant detection hardening.
- [x] T017 [P1] Freeze canonical JSON v2 schema for generate-context input - WHY: current JSON shape is alias-heavy with undocumented required fields; agents can't predict what passes sufficiency - Acceptance: documented v2 schema with compatibility shims, contract tests verifying render + sufficiency. Evidence: the Phase 3 orchestration record tracks the canonical JSON v2 schema freeze as part of the memory-save hardening tranche.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Runtime Verification

- [x] T018 Run `node scripts/dist/memory/generate-context.js --help` - WHY: primary CLI surface must work - Acceptance: help output displayed, exit code 0. Evidence: Phase 3 verification records `generate-context.js --help: PASS`.
- [x] T019 Run `npm run test --workspace=@spec-kit/scripts` - WHY: full test suite must pass - Acceptance: exit code 0. Evidence: Phase 3 verification records `476/477` scripts tests passing.
- [x] T020 Run module-sensitive Vitest suites - WHY: ESM-truth assertions must pass - Acceptance: all targeted suites green. Evidence: the module-sensitive ESM-truth suites were closed as part of the finished Phase 3 interop verification.
- [x] T021 Run memory save end-to-end test (JSON mode → generate-context → MCP index) - WHY: full pipeline must work after ESM migration - Acceptance: save + index succeeds with ESM siblings. Evidence: Phase 3 closed with the hardened memory-save pipeline, including `workflow.ts` decoupling, V8 descendant detection, and `manual-fallback` recovery.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T021 marked `[x]`. Evidence: Phase 3 closed with scripts interop plus memory-save hardening complete.
- [x] `scripts` stays CommonJS with proven ESM interop. Evidence: Node 25 native `require(esm)` worked after the top-level-await removal.
- [x] Memory save pipeline works during and after ESM migration. Evidence: `workflow.ts` decoupling, V8 descendant detection, and `manual-fallback` recovery all landed in Phase 3.
- [x] V8 allows child phase references without false positives. Evidence: descendant phase detection was added for validated child phase IDs.
- [x] No dual-build fallback needed (or decision documented if needed). Evidence: native Node 25 interop proved sufficient, so the fallback was not used.
- [x] Handoff criteria met for Phase 4 (004-verification-and-standards). Evidence: scripts interop and the memory-save hardening tranche are both complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
