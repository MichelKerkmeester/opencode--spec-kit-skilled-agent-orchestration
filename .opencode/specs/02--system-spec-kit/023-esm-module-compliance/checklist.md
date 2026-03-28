---
title: "Verification Checklist: ESM Module Compliance"
description: "Verification gates for the pending shared plus mcp_server native ESM migration, with scripts retained as CommonJS and standards docs deferred until runtime proof."
trigger_phrases:
  - "esm checklist"
  - "mcp_server esm verification"
importance_tier: "standard"
contextType: "architecture"
---
# Verification Checklist: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Current-state evidence distinguishes authoring syntax from runtime module mode [EVIDENCE: `research/research.md` locks the baseline and `spec.md` sections 3-7 now mirror it]
- [x] CHK-010 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are synchronized to the finished 20-iteration research [EVIDENCE: packet docs now consistently reference `research/research.md` as source of truth and keep runtime implementation pending]
- [x] CHK-011 [P1] First-pass module strategy is locked: `@spec-kit/shared` plus `@spec-kit/mcp-server` migrate together, `@spec-kit/scripts` stays CommonJS [EVIDENCE: `research/research.md` recommendation and `spec.md` requirements/plan phases match]
- [x] CHK-012 [P1] Dual-build or conditional exports is explicitly rejected as the first pass and preserved only as fallback if scripts interop proves too invasive [EVIDENCE: `research/research.md` rejected-options guidance and `plan.md` Phases 3/7 rollback rules]
- [x] CHK-013 [P1] Standards-doc updates outside 023 remain deferred until runtime verification passes [EVIDENCE: `spec.md` scope and `plan.md` Phase 4 defer downstream standards docs]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-002 [P0] `shared/package.json` and `mcp_server/package.json` declare truthful native ESM runtime contracts
- [ ] CHK-003 [P0] Package-local compiler settings emit native ESM for `shared` and `mcp_server`
- [ ] CHK-004 [P0] `scripts/package.json` stays CommonJS while scripts-owned runtime callers cross explicit interoperability boundaries instead of direct `require()` of ESM siblings
- [ ] CHK-021 [P2] Guardrails exist to prevent new extensionless ESM-breaking imports
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Non-test relative imports and exports under `shared/**/*.ts` and `mcp_server/**/*.ts` are Node ESM compatible, and cross-package imports use package or subpath boundaries instead of sibling-relative hops
- [ ] CHK-006 [P0] Built `dist/context-server.js` and emitted `shared` surfaces no longer depend on CommonJS `require(...)` / `exports`
- [ ] CHK-007 [P0] The exact verification matrix from `research/research.md` passes, including `npm run --workspaces=false typecheck`, `npm run --workspaces=false test:cli`, workspace-targeted builds/tests, targeted Vitest runs, and direct runtime smokes
- [ ] CHK-008 [P0] Highest-risk recent surfaces are re-tested first before downstream standards docs are touched
- [ ] CHK-009 [P0] Scripts interoperability proof exists and is treated as required, not optional, including `node scripts/dist/memory/generate-context.js --help`, scripts interop tests, and scripts-owned API loading paths
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No manual `dist/`-only edits or ad-hoc loaders are introduced to fake ESM compliance
- [ ] CHK-031 [P1] Package and CLI entrypoints stay limited to the intended surfaces after metadata and interop changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P1] The packet documents scripts interoperability proof as mandatory and keeps runtime completion claims out until that proof exists [EVIDENCE: `spec.md` requirements/success criteria plus `tasks.md` T008-T013]
- [ ] CHK-015 [P1] Final `implementation-summary.md` records runtime migration evidence after the code change actually lands
- [ ] CHK-016 [P1] Standards docs outside 023 are updated from the verified runtime state after CHK-007 through CHK-009 pass
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P2] Before/after import-migration counts are captured for `shared` and `mcp_server` regression tracking
- [ ] CHK-022 [P2] Generated artifacts are regenerated from source rather than hand-maintained
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 1/8 |
| P1 Items | 8 | 6/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-03-28
<!-- /ANCHOR:summary -->
