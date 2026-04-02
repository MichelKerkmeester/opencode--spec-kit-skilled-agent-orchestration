---
title: "Verification Checklist: ESM Module Compliance [02--system-spec-kit/023-esm-module-compliance/checklist]"
description: "Verification gates for the completed shared plus mcp_server native ESM migration, with scripts retained as CommonJS and follow-on documentation convergence tracked in child phases."
trigger_phrases:
  - "esm checklist"
  - "mcp_server esm verification"
importance_tier: "normal"
contextType: "implementation"
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
- [x] CHK-010 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are synchronized to the finished 20-iteration research [EVIDENCE: packet docs now consistently reference `research/research.md` as source of truth and reflect completed runtime implementation]
- [x] CHK-011 [P1] First-pass module strategy is locked: `@spec-kit/shared` plus `@spec-kit/mcp-server` migrate together, `@spec-kit/scripts` stays CommonJS [EVIDENCE: `research/research.md` recommendation and `spec.md` requirements/plan phases match]
- [x] CHK-012 [P1] Dual-build or conditional exports is explicitly rejected as the first pass and preserved only as fallback if scripts interop proves too invasive [EVIDENCE: `research/research.md` rejected-options guidance and `plan.md` Phases 3/7 rollback rules]
- [x] CHK-013 [P1] Standards-doc updates outside 023 remain deferred until runtime verification passes [EVIDENCE: `spec.md` scope and `plan.md` Phase 4 defer downstream standards docs]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-002 [P0] `shared/package.json` and `mcp_server/package.json` declare truthful native ESM runtime contracts [EVIDENCE: `.opencode/skill/system-spec-kit/shared/package.json` and `.opencode/skill/system-spec-kit/mcp_server/package.json` both set `"type": "module"` with ESM `main` and `exports` entrypoints]
- [x] CHK-003 [P0] Package-local compiler settings emit native ESM for `shared` and `mcp_server` [EVIDENCE: `.opencode/skill/system-spec-kit/shared/tsconfig.json` and `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` both set `"module": "nodenext"` and `"moduleResolution": "nodenext"`]
- [x] CHK-004 [P0] `scripts/package.json` stays CommonJS while scripts-owned runtime callers cross explicit interoperability boundaries instead of direct `require()` of ESM siblings [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/package.json` keeps `"type": "commonjs"` while `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` uses `await import('@spec-kit/mcp-server/api/providers')` and `await import('@spec-kit/mcp-server/api')` for the package boundary]
- [x] CHK-021 [P2] Guardrails exist to prevent new extensionless ESM-breaking imports [EVIDENCE: nodenext compiler enforces .js extensions at build; architecture-boundary-enforcement.vitest.ts covers import hygiene]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Non-test relative imports and exports under `shared/**/*.ts` and `mcp_server/**/*.ts` are Node ESM compatible, and cross-package imports use package or subpath boundaries instead of sibling-relative hops [EVIDENCE: Phase 1 rewrote 48 shared imports, Phase 2 rewrote 839 mcp_server imports to .js specifiers; all builds clean]
- [x] CHK-006 [P0] Built `dist/context-server.js` and emitted `shared` surfaces no longer depend on CommonJS `require(...)` / `exports` [EVIDENCE: Both packages emit native ESM with "type":"module"; Phase 6 confirmed no __dirname residue in scripts (P1-COR-03 fixed)]
- [x] CHK-007 [P0] The exact verification matrix from `research/research.md` passes, including `npm run --workspaces=false typecheck`, `npm run --workspaces=false test:cli`, workspace-targeted builds/tests, targeted Vitest runs, and direct runtime smokes [EVIDENCE: Phase 5 — mcp-server 8997/8997, scripts 483/483, 9480 total, 0 failures]
- [x] CHK-008 [P0] Highest-risk recent surfaces are re-tested first before downstream standards docs are touched [EVIDENCE: Phase 4/5 — memory-save, memory-index, shared-memory, vector-index-store, session-manager, generate-context, workflow all retested and passing]
- [x] CHK-009 [P0] Scripts interoperability proof exists and is treated as required, not optional, including `node scripts/dist/memory/generate-context.js --help`, scripts interop tests, and scripts-owned API loading paths [EVIDENCE: Phase 3 — generate-context.js --help passes, scripts interop tests green, Phase 6 workflow.ts tryImportMcpApi helper consolidated]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No manual `dist/`-only edits or ad-hoc loaders are introduced to fake ESM compliance [EVIDENCE: All changes are source-level .ts edits compiled through tsc; no dist-only patches]
- [x] CHK-031 [P1] Package and CLI entrypoints stay limited to the intended surfaces after metadata and interop changes [EVIDENCE: Phase 6 — context-server.ts guarded with entrypoint check (P1-COR-01), cli.ts defers heavy imports (P2-PRF-02)]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P1] The packet documents scripts interoperability proof as mandatory and keeps runtime completion claims out until that proof exists [EVIDENCE: `spec.md` requirements/success criteria plus `tasks.md` T008-T013]
- [x] CHK-015 [P1] Final `implementation-summary.md` records runtime migration evidence after the code change actually lands [EVIDENCE: implementation-summary.md records all 6 phases with verification results]
- [x] CHK-016 [P1] Standards docs outside 023 are updated from the verified runtime state after CHK-007 through CHK-009 pass [EVIDENCE: Phase 4 updated standards docs from verified ESM state]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P2] Before/after import-migration counts are captured for `shared` and `mcp_server` regression tracking [EVIDENCE: Phase 1: 48 shared imports, Phase 2: 839 mcp_server imports recorded in changelog v3.1.2.0]
- [x] CHK-022 [P2] Generated artifacts are regenerated from source rather than hand-maintained [EVIDENCE: tsc --build regenerates all dist/ from source; no manual dist edits]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-04-02
<!-- /ANCHOR:summary -->
