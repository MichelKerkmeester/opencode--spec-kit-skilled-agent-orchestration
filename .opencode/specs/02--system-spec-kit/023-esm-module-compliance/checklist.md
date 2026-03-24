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

- [x] CHK-001 [P0] Current-state evidence distinguishes authoring syntax from runtime module mode [EVIDENCE: spec.md section 3 documents the compiler, package, dist, and import-pattern baseline]
- [x] CHK-010 [P1] Spec, plan, tasks, and checklist are synchronized to the real refactor scope [EVIDENCE: spec.md sections 4-7 and the updated plan/tasks/checklist now describe the same runtime migration]
- [ ] CHK-011 [P1] Final module strategy is selected for `mcp_server`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-002 [P0] `mcp_server/package.json` declares an ESM-compatible runtime contract
- [ ] CHK-003 [P0] Compiler settings emit ESM for `mcp_server`
- [ ] CHK-021 [P2] Guardrails exist to prevent new extensionless ESM-breaking imports
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-004 [P0] Non-test relative imports/exports under `mcp_server/**/*.ts` are Node ESM compatible
- [ ] CHK-005 [P0] Built `dist/context-server.js` no longer depends on CommonJS `require(...)` / `exports`
- [ ] CHK-006 [P0] Required build, typecheck, and targeted verification commands pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No manual `dist/`-only edits or ad-hoc loaders are introduced to fake ESM compliance
- [ ] CHK-031 [P1] Package and CLI entrypoints stay limited to the intended surfaces after metadata changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] `scripts/` CommonJS workflows continue to work or have an approved follow-up migration
- [ ] CHK-013 [P1] `sk-code--opencode` and related decision docs match the implemented runtime
- [ ] CHK-014 [P1] Final `implementation-summary.md` records verification evidence after code migration
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P2] Before/after import-migration counts are captured for regression tracking
- [ ] CHK-022 [P2] Generated artifacts are regenerated from source rather than hand-maintained
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 1/6 |
| P1 Items | 7 | 1/7 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-03-24
<!-- /ANCHOR:summary -->
