---
title: "Verification Checklist: manual-testing-per-playbook governance phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 017 governance manual test packet covering NEW-063, NEW-064, NEW-122, NEW-123, and NEW-148."
trigger_phrases:
  - "governance verification checklist"
  - "phase 017 checklist"
  - "feature flag governance checklist"
  - "shared memory governance testing"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook governance phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: _Pending — verify spec.md contains all five test IDs with exact prompts, command sequences, feature links, and acceptance criteria._
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: _Pending — verify plan.md covers all three execution phases (non-destructive, stateful, verdict), the rollback procedure, and testing strategy table._
- [ ] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: _Pending — confirm feature catalog files in `../../feature_catalog/17--governance/`, the playbook, review protocol, and MCP runtime are all accessible._
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: _Pending — governance scenarios NEW-063 and NEW-064 are process audits against `search-flags.ts`; confirm no TypeScript or Markdown lint errors are introduced by any doc corrections made during execution._
- [ ] CHK-011 [P0] No console errors or warnings
  - **Evidence**: _Pending — verify MCP tool calls for NEW-122, NEW-123, and NEW-148 produce no unexpected runtime warnings or unhandled errors._
- [ ] CHK-012 [P1] Error handling implemented
  - **Evidence**: _Pending — confirm NEW-122 provenance-rejection path and NEW-123 kill-switch path each produce well-formed error responses, not unhandled exceptions._
- [ ] CHK-013 [P1] Code follows project patterns
  - **Evidence**: _Pending — confirm governance checks in `scope-governance.ts`, `retention.ts`, and `shared-spaces.ts` follow existing lib patterns and no new anti-patterns were introduced._
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: _Pending — verify all five scenarios reach a PASS verdict per the review protocol:_
    - _NEW-063 Feature flag governance: all SPECKIT_ flags enumerated, B8 governance targets reviewed, compliance gaps recorded._
    - _NEW-064 Feature flag sunset audit: 27 graduate/9 dead/3 active dispositions confirmed in code, `isPipelineV2Enabled()` always-true no-op confirmed, deltas logged._
    - _NEW-122 Governed ingest and scope isolation: missing provenance rejected, valid scoped save persists, cross-scope retrieval blocked, `governance_audit` rows present._
    - _NEW-123 Shared-space deny-by-default rollout: non-member denied, member allowed, kill switch blocks existing member._
    - _NEW-148 Shared-memory default-off and first-run setup: default off, enable persists to DB, idempotent, README created, restart persistence confirmed, env-var override works, command gate triggers._
- [ ] CHK-021 [P0] Manual testing complete
  - **Evidence**: _Pending — all five scenario prompts executed as written with evidence captured per the review protocol acceptance rules._
- [ ] CHK-022 [P1] Edge cases tested
  - **Evidence**: _Pending — confirm NEW-122 tests both missing-provenance-with-scope and valid-provenance paths; confirm NEW-148 tests both first-run and idempotent-enable paths._
- [ ] CHK-023 [P1] Error scenarios validated
  - **Evidence**: _Pending — confirm NEW-122 rejection output is a structured error (not a silent no-op), and NEW-123 kill-switch blocks even a previously authorized member._
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: _Pending — confirm no tenant IDs, user credentials, or environment tokens are embedded in evidence artifacts or documentation._
- [ ] CHK-031 [P0] Input validation implemented
  - **Evidence**: _Pending — verify NEW-122 confirms that `provenanceSource` and `provenanceActor` are required when scope fields are present, and that the handler rejects ambiguous writes rather than silently accepting them._
- [ ] CHK-032 [P1] Auth/authz working correctly
  - **Evidence**: _Pending — verify NEW-123 membership model: `shared_space_membership_set()` grants access and removal (or kill switch) immediately revokes it with no residual access window._
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: _Pending — verify spec.md, plan.md, and tasks.md all reference the same five test IDs and the same feature catalog paths, with no stale cross-references._
- [ ] CHK-041 [P1] Code comments adequate
  - **Evidence**: _Pending — confirm `scope-governance.ts` and `shared-spaces.ts` contain inline comments explaining the provenance requirement and the two-tier enablement check (`isSharedMemoryEnabled()`)._
- [ ] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: _Pending — if MCP server README documents shared-memory tooling, confirm it reflects the default-off state and `shared_memory_enable` setup flow introduced in Phase 6._
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: _Pending — confirm no ad-hoc temporary evidence files are placed outside `scratch/` during execution._
- [ ] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: _Pending — confirm `scratch/` is cleared of intermediate evidence drafts before phase closeout._
- [ ] CHK-052 [P2] Findings saved to memory/
  - **Evidence**: _Pending — after execution, run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for this spec folder to persist findings._
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 7 | 0/7 |
| P2 Items | 2 | 0/2 |

**Verification Date**: _Pending execution_
**Audit Method**: Manual execution per `plan.md` Phase 4 verdict workflow
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
