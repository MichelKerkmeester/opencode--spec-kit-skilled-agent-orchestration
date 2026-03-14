---
title: "Verification Checklist: bug-fixes-and-data-integrity [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-13"
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
trigger_phrases:
  - "verification"
  - "bug fixes"
  - "data integrity"
  - "causal link"
  - "scripts package"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: bug-fixes-and-data-integrity

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

## P0 - Blockers

P0 items below are complete and include inline evidence.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/spec.md`]
- [x] CHK-002 [P0] Technical approach documented in `plan.md` [EVIDENCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/plan.md`]
- [x] CHK-003 [P1] Dependencies identified [EVIDENCE: plan dependency table reflects current completed verification and ongoing documentation maintenance needs]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Causal lock/busy errors are re-thrown as infra failures [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`]
- [x] CHK-011 [P0] Handler-path regression for lock/busy -> `E022` exists [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts`]
- [x] CHK-012 [P1] Symlink pass-through branches replaced with explicit capability gating [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts`]
- [x] CHK-013 [P1] Legacy stale `hash_checks` token removed [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts`]
- [x] CHK-014 [P1] Scripts local testing path fixes applied [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/package.json`, `.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts`, `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts`]
- [x] CHK-015 [P0] Packet artifact cleanup completed [EVIDENCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/005-lifecycle/.DS_Store` absent]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] TypeScript verification passes [EVIDENCE: `npm run typecheck` passed in `.opencode/skill/system-spec-kit`]
- [x] CHK-021 [P0] Targeted MCP suites pass [EVIDENCE: `npm test -- --run tests/causal-edges.vitest.ts tests/integration-causal-graph.vitest.ts tests/incremental-index.vitest.ts tests/incremental-index-v2.vitest.ts` passed in `.opencode/skill/system-spec-kit/mcp_server`]
- [x] CHK-022 [P1] Selected scripts suites pass individually [EVIDENCE: `generate-context-cli-authority`, `memory-render-fixture`, `import-policy-rules`, `tree-thinning`, `slug-uniqueness`, `task-enrichment`, `runtime-memory-inputs` suites passed in `.opencode/skill/system-spec-kit/scripts`]
- [x] CHK-023 [P1] Full scripts package `npm test` completed end-to-end [EVIDENCE: `.opencode/skill/system-spec-kit/scripts` result `Test Files 9 passed (9)`, `Tests 150 passed (150)`, `Duration 77.49s`]
- [x] CHK-024 [P1] Package quality checks and packet verification state are fully aligned [EVIDENCE: `npm run check` passed in `.opencode/skill/system-spec-kit/mcp_server` and `.opencode/skill/system-spec-kit/scripts`; packet docs and tasks/checklist now closed for required checks]
<!-- /ANCHOR:testing -->

---

## P1 - Required

P1 items are complete unless explicitly marked pending.

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] Root/test README coverage claims updated to current state [EVIDENCE: `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`]
- [x] CHK-031 [P1] Watcher feature doc wording aligned to current reliability coverage [EVIDENCE: `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md`]
- [x] CHK-032 [P1] Manual playbook includes coverage notes matrix for 29 catalog entries [EVIDENCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`]
- [x] CHK-033 [P1] Discovery task doc uses concrete path references (no stale brace/glob placeholders) [EVIDENCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/003-discovery/tasks.md`]
- [x] CHK-034 [P1] 008 packet docs synchronized to actual fixes [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-040 [P1] Documentation edits limited to approved packet markdown file list [EVIDENCE: `git status --short` shows only requested spec packet markdown files touched under `.opencode/specs/.../003-discovery` and `.opencode/specs/.../008-bug-fixes-and-data-integrity`]
- [x] CHK-041 [P2] Context saved to memory via `generate-context.js` [EVIDENCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/memory/14-03-26_10-42__closed-deferred-context-save-item-after-final.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |
| **Total** | **21** | **21/21** |

**Verification Date**: 2026-03-13
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
