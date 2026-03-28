---
title: "Verification Checklist: ESM Module Compliance"
description: "Verification gates for the real mcp_server ESM compliance refactor."
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

- [x] CHK-001 [P0] Current-state evidence distinguishes authoring syntax from runtime module mode [EVIDENCE: spec.md section 3 documents the compiler, package, dist, import-pattern, and package-boundary baseline]
- [x] CHK-010 [P1] Spec, plan, tasks, and checklist are synchronized to the real refactor scope [EVIDENCE: spec.md sections 4-7 plus the updated plan/tasks/checklist now describe the same `shared` + `mcp_server` ESM migration with `scripts` CommonJS interoperability]
- [x] CHK-011 [P1] Final module strategy is selected for `shared` and `mcp_server` [EVIDENCE: research/research.md section 4 locks package-local NodeNext plus explicit `scripts` interoperability boundaries]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-002 [P0] `shared/package.json` and `mcp_server/package.json` declare ESM-compatible runtime contracts
- [ ] CHK-003 [P0] Package-local compiler settings emit ESM for `shared` and `mcp_server`
- [ ] CHK-021 [P2] Guardrails exist to prevent new extensionless ESM-breaking imports
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-004 [P0] Non-test relative imports/exports under `shared/**/*.ts` and `mcp_server/**/*.ts` are Node ESM compatible, and cross-package imports use package/subpath boundaries instead of sibling-relative hops
- [ ] CHK-005 [P0] Built `dist/context-server.js` and emitted `shared` surfaces no longer depend on CommonJS `require(...)` / `exports`
- [ ] CHK-006 [P0] The exact verification matrix passes, including `npm run --workspaces=false typecheck`, `npm run --workspaces=false test:cli`, workspace-targeted builds/tests, and targeted Vitest runs
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

- [ ] CHK-012 [P1] `scripts/` CommonJS workflows continue to work, including `node scripts/dist/memory/generate-context.js --help`, internal scripts-module interoperability, and scripts-side loading of `@spec-kit/shared` / `@spec-kit/mcp-server/api*`
- [ ] CHK-013 [P1] `sk-code--opencode` and related decision docs match the implemented runtime
- [ ] CHK-014 [P1] Final `implementation-summary.md` records verification evidence after code migration
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
| P0 Items | 6 | 1/6 |
| P1 Items | 7 | 2/7 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-03-28
<!-- /ANCHOR:summary -->
