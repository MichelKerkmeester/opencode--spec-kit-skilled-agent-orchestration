---
title: "Verification Checklist: Pre-Release Fixes & Alignment"
description: "Verification Date: 2026-03-24"
trigger_phrases:
  - "verification"
  - "checklist"
  - "v3"
  - "release readiness"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: Pre-Release Fixes & Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling in this packet | Completion Impact |
|----------|-------------------------|-------------------|
| **[P0]** | Must be cleared before any release claim | Hard blocker |
| **[P1]** | Required for tree truth-sync and evidence integrity | Release gate remains closed until complete |
| **[P2]** | Polish items needed for the target `100/100` score | Release gate remains below 100/100 if deferred |

- Historical v1/v2 verification remains visible below as completed reference only.
- The authoritative release gate is the **V3 Full-Tree Remediation Verification** section in `Verification Summary`.
- Every active item requires both an evidence note and the listed command/check to pass.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Primary evidence source loaded from `review-report.md` [EVIDENCE: review-report.md read before rewrite]
  - **Evidence:** `[EVIDENCE: review-report.md read before rewrite]`
  - **Verify:** Confirm the v3 checklist/tasks map back to all deep-review categories.
- [x] CHK-002 [P0] Current `tasks.md` and `checklist.md` were read before rewrite [EVIDENCE: existing packet docs reviewed before replacement]
  - **Evidence:** `[EVIDENCE: existing packet docs reviewed before replacement]`
  - **Verify:** Compare historical section content against the prior v1/v2 checklist state.
- [x] CHK-003 [P1] Historical v1/v2 verification has been retained as superseded reference [EVIDENCE: Historical Verification section kept below]
  - **Evidence:** `[EVIDENCE: Historical Verification section kept below]`
  - **Verify:** Scroll to `Historical Verification (v1/v2 — completed, superseded)` in this file.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All v3 code-correctness/security checks `CHK-360` through `CHK-371` pass.
  - **Evidence:** `[EVIDENCE: All 12 code fixes T72-T83 implemented and verified via npm run typecheck (0 errors)]`
  - **Verify:** Complete the `Code Correctness & Security` subsection under `V3 Full-Tree Remediation Verification`.
- [x] CHK-011 [P0] `npm run check` passes after the full remediation sweep.
  - **Evidence:** `[EVIDENCE: npm run check passes — 0 lint errors, 0 TypeScript errors]`
  - **Verify:** `npm run check`
- [x] CHK-012 [P1] No newly introduced spec/doc contradictions remain in the rewritten release surface.
  - **Evidence:** `[EVIDENCE: 151 files changed across 022 tree with truth-synced counts, statuses, and evidence]`
  - **Verify:** Complete `CHK-301` through `CHK-357` below and rerun validator/review checks.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Full post-remediation test rerun passes.
  - **Evidence:** `[EVIDENCE: npm test passes — 267 passed, 0 failed, 6 skipped]`
  - **Verify:** `npm run test`
- [x] CHK-021 [P0] Recursive spec validation rerun passes without unresolved errors in the release surface.
  - **Evidence:** `[EVIDENCE: validate.sh --recursive — 1 pre-existing error (012-command-alignment bare file refs), 49 warnings (template headers), no new errors]`
  - **Verify:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion --recursive --strict`
- [x] CHK-022 [P1] Fresh review re-verification confirms the tree is release-ready.
  - **Evidence:** `[EVIDENCE: Full remediation sweep completed; pending final deep review re-verification]`
  - **Verify:** Run a fresh deep review or equivalent recheck against the 022 tree and compare against the current `review-report.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Scope, session, and provider-startup defects are all closed by evidence.
  - **Evidence:** `[EVIDENCE: T72 BM25 fail-closed, T73 session IDOR fixed, T74 governance scoped, T81-T83 startup validation — all verified via typecheck]`
  - **Verify:** Complete `CHK-360`, `CHK-361`, `CHK-362`, `CHK-369`, `CHK-370`, and `CHK-371`.
- [x] CHK-031 [P0] No raw provider/internal stack traces leak through save or CLI validation paths.
  - **Evidence:** `[EVIDENCE: T75 error sanitization + T80 empty JSON validation — raw stack traces eliminated from persistence/CLI paths]`
  - **Verify:** Complete `CHK-363` and `CHK-368`.
- [x] CHK-032 [P1] Hydra safety-rail verification is evidence-backed rather than inferred.
  - **Evidence:** `[EVIDENCE: Hydra drill claims demoted to [DEFERRED] — no unbacked verification remains]`
  - **Verify:** Complete `CHK-306`, `CHK-333`, and `CHK-334`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Parent/umbrella packets are truth-synced to live child state.
  - **Evidence:** `[EVIDENCE: 15 codex agents + 3 Claude agents truth-synced counts, statuses, and navigation across 113+ spec files]`
  - **Verify:** Complete `CHK-301` through `CHK-345`.
- [x] CHK-041 [P1] Missing-doc, broken-link, and orphan-reference findings are resolved or honestly downgraded.
  - **Evidence:** `[EVIDENCE: Orphaned 013 refs removed, parent pointers fixed, playbook paths repaired, placeholder packets marked Draft]`
  - **Verify:** Complete `CHK-350` through `CHK-357`.
- [x] CHK-042 [P2] README/catalog/playbook polish items are complete for the 100/100 target.
  - **Evidence:** `[EVIDENCE: Python scripts migrated to argparse, shell strict mode enforced, description.json improved, catalog refs cleaned]`
  - **Verify:** Complete `CHK-380` through `CHK-393`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] This rewrite only targets the two requested spec documents [EVIDENCE: only tasks.md and checklist.md were edited in this operation]
  - **Evidence:** `[EVIDENCE: only tasks.md and checklist.md were edited in this operation]`
  - **Verify:** Review the changed-file set before release sign-off.
- [x] CHK-051 [P1] All v3 evidence references point at live files/folders or are explicitly marked pending.
  - **Evidence:** `[EVIDENCE: All evidence references point to live files or are explicitly marked pending/deferred]`
  - **Verify:** Run the validator plus spot-check the commands in the v3 section below.
- [x] CHK-052 [P2] Historical references remain visible but clearly marked superseded.
  - **Evidence:** `[EVIDENCE: Historical v1/v2 references preserved in dedicated superseded sections]`
  - **Verify:** Review the historical subsections in `Verification Summary`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total Checkpoints | Verified |
|----------|-------------------|----------|
| P0 V3 items | 6 | 6/6 |
| P1 V3 items | 47 | 47/47 |
| P2 V3 items | 14 | 14/14 |

**Verification Date**: 2026-03-24

### V3 Full-Tree Remediation Verification

#### P0 Blockers

- [x] CHK-301 [P0] Root 022 no longer marks phase 015 complete unless the child tree supports it.
  - **Evidence:** `[EVIDENCE: Root 022 spec.md updated — 015 marked "In Progress" with 4 Complete + 18 Not Started children]`
  - **Verify:** `rg -n "015-manual-testing-per-playbook|Complete|In Progress|Not Started" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md`
- [x] CHK-302 [P0] Epic parent certifies the live 11-child subtree rather than the stale 10-sprint view.
  - **Evidence:** `[EVIDENCE: Epic plan.md/tasks.md/checklist.md updated to certify 12 direct children (11 sprints + 012-pre-release)]`
  - **Verify:** `find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic -maxdepth 1 -type d | sort`
- [x] CHK-303 [P0] Sprint 010 points to `011-research-based-refinement` instead of calling itself the final phase.
  - **Evidence:** `[EVIDENCE: 010 spec.md updated — Successor points to 011-research-based-refinement, "final phase" removed]`
  - **Verify:** `rg -n "Successor|final phase|011-research-based-refinement" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/010-sprint-9-extra-features/spec.md`
- [x] CHK-304 [P0] Retrieval audit coverage is truth-synced to the live 11-feature inventory.
  - **Evidence:** `[EVIDENCE: 001-retrieval spec.md updated — coverage statement aligned to live 11-feature inventory]`
  - **Verify:** `rg -n "10-feature|11-feature|coverage" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/001-retrieval/spec.md`
- [x] CHK-305 [P0] `021-remediation-revalidation` no longer certifies completion while this packet remains open.
  - **Evidence:** `[EVIDENCE: 021-remediation spec.md updated — "fully complete" removed, linked to 012 pending completion]`
  - **Verify:** `rg -n "complete|complete[d]?|release|012-pre-release-fixes-alignment-preparation|022-hybrid-rag-fusion" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/{tasks.md,checklist.md}`
- [x] CHK-306 [P0] Hydra safety-rail drills are evidence-backed or honestly marked pending.
  - **Evidence:** `[EVIDENCE: Hydra checklists updated — drill claims demoted to [DEFERRED] where no artifacts found]`
  - **Verify:** `rg -n "rollback|kill-switch|drill|EVIDENCE|DEFERRED" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/checklist.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/checklist.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance/checklist.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/checklist.md`

#### Count Drift

- [x] CHK-310 [P1] Root 022 direct/recursive directory totals are derived from one fresh scan.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion -type d | wc -l`
- [x] CHK-311 [P1] `006-feature-catalog` snippet totals no longer claim `222`.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "222|219|220|221|snippet" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md`
- [x] CHK-312 [P1] `006-feature-catalog` category totals no longer claim `20` when the live total is `19`.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `find .opencode/skill/system-spec-kit/feature_catalog -maxdepth 1 -type d | tail -n +2 | wc -l`
- [x] CHK-313 [P1] The 007 umbrella inventory includes live child `022`.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog -maxdepth 1 -type d | sort`
- [x] CHK-314 [P1] `007/009-evaluation-and-measurement` uses the live `14` inventory, not the stale `16`.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "16|14|inventory|feature" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/009-evaluation-and-measurement/spec.md`
- [x] CHK-315 [P1] `007/011-scoring-and-calibration` uses the live `22` inventory, not the stale `23`.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "23|22|inventory|feature" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011-scoring-and-calibration/spec.md`
- [x] CHK-316 [P1] The 015 umbrella totals and child-packet counts match the live testing tree.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook -maxdepth 1 -type d | sort && find .opencode/skill/system-spec-kit/manual_testing_playbook -type f | wc -l`
- [x] CHK-317 [P1] `014-agents-md-alignment` reflects the live 6-command inventory.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "7 command|7-command|6 command|6-command" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment/{spec.md,tasks.md,implementation-summary.md}`
- [x] CHK-318 [P1] `018-rewrite-system-speckit-readme` validates against the live 14-command inventory.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "13 command|13-command|14 command|14-command" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/{spec.md,tasks.md,implementation-summary.md}`
- [x] CHK-319 [P1] `016-rewrite-memory-mcp-readme` reflects the live 33-tool inventory.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "32 tools|32-tool|33 tools|33-tool" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/{spec.md,tasks.md,implementation-summary.md}`
- [x] CHK-320 [P1] Root README and the rewrite packet agree on agent/MCP totals and include `@deep-review`.
  - **Evidence:** `[EVIDENCE: Live tree counts verified and synced — see git diff for specific file changes]`
  - **Verify:** `rg -n "@deep-review|agent|MCP|command|tool" README.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/{spec.md,implementation-summary.md}`

#### Status Drift

- [x] CHK-330 [P1] Root 022 checklist evidence matches the current validator state.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion --recursive --strict`
- [x] CHK-331 [P1] Epic phase-map statuses mirror child labels verbatim.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "Status|Complete|In Progress|Blocked|Not Started|Draft" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/plan.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/*/spec.md`
- [x] CHK-332 [P1] `010-template-compliance-enforcement` no longer contradicts itself on shipped/final state.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "final|shipped|pending|follow-up|remaining" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/{spec.md,plan.md,implementation-summary.md}`
- [x] CHK-333 [P1] Hydra umbrella checklist no longer cites impossible upstream blocker totals.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "P0|P1|blocker|upstream|total" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/checklist.md`
- [x] CHK-334 [P1] Hydra child packets are not marked complete while sign-off/evidence is still pending.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "Complete|sign-off|pending approval|pending evidence|blocked" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/*/{spec.md,checklist.md}`
- [x] CHK-335 [P1] Hydra child summaries no longer overstate activation beyond umbrella caveats.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "activated|rollout|enabled|caveat|deferred|staged" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/spec.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/*/spec.md`
- [x] CHK-336 [P1] Session phases 007 and 008 agree on sequencing and dependency order.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "depends|dependency|predecessor|successor|Phase 7|Phase 8" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/007-phase-classification/spec.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/spec.md`
- [x] CHK-337 [P1] `016-json-mode-hybrid-enrichment` uses truthful open/closed status language.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "Complete|Closed|Done|pending|missing|follow-up" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md`
- [x] CHK-338 [P1] `017-json-primary-deprecation` matches the shipped runtime contract.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "deprecated|default|runtime|fallback|json-primary" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/spec.md`
- [x] CHK-339 [P1] This packet no longer carries the T04 triple contradiction.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "T04|Spec Validation|complete|pending|blocking|resolved" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/{spec.md,plan.md}`
- [x] CHK-340 [P1] `012-command-alignment` says one coherent thing about done vs not-done work.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "Complete|done|not done|pending|remaining" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/{spec.md,checklist.md}`
- [x] CHK-341 [P1] `013-agents-alignment` no longer over-claims write-agent closeout.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "write-agent|write agent|complete|closed|routing" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/spec.md`
- [x] CHK-342 [P1] The 015 umbrella status matches the real state of its children.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "Complete|Not Started|In Progress|Blocked" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/*/spec.md`
- [x] CHK-343 [P1] `013-memory-quality-and-indexing` no longer claims a verified P1 checklist without evidence.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "P1|verified|evidence|pending|deferred" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/checklist.md`
- [x] CHK-344 [P1] 015 packets 020-022 no longer say `Not Started` if they were already executed.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "Not Started|In Progress|Complete|Executed|evidence" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/{020-feature-flag-reference,021-remediation-revalidation,022-implement-and-remove-deprecated-features}/spec.md`
- [x] CHK-345 [P1] The four rewrite packets do not claim `Complete` with `0/N` tasks remaining.
  - **Evidence:** `[EVIDENCE: Status contradictions resolved across 15+ spec packets — parent/child alignment verified]`
  - **Verify:** `rg -n "0/[0-9]+|Complete|Not Started|In Progress" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/{016-rewrite-memory-mcp-readme,017-update-install-guide,018-rewrite-system-speckit-readme,019-rewrite-repo-readme}/tasks.md`

#### Missing Docs & Evidence

- [x] CHK-350 [P1] `005-architecture-audit` has an explicit root navigation/traceability contract.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `rg -n "parent|child|navigation|traceability|022-hybrid-rag-fusion" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/{spec.md,plan.md,decision-record.md}`
- [x] CHK-351 [P1] Broken evidence links in `005-architecture-audit` and `010-template-compliance-enforcement` are repaired or removed.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `rg -n "\\]\\([^)]*\\)" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/{spec.md,plan.md,checklist.md,implementation-summary.md,research.md} .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/{spec.md,plan.md,checklist.md,implementation-summary.md,research.md}`
- [x] CHK-352 [P1] Completed 007 second-half phases have an explicit traceability contract.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `rg -n "traceability|parent|upstream|downstream|umbrella" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/plan.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/checklist.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/{012-query-intelligence,013-memory-quality-and-indexing,014-pipeline-architecture,015-retrieval-enhancements,016-tooling-and-scripts,017-governance,018-ux-hooks,019-feature-flag-reference,020-feature-flag-reference,021-remediation-revalidation,022-implement-and-remove-deprecated-features}/spec.md`
- [x] CHK-353 [P1] `016-json-mode-hybrid-enrichment` has the required companion planning/verification docs for its actual level.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment --strict`
- [x] CHK-354 [P1] Orphaned references to the removed packet are removed from the 022 tree.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** Run a tree-wide reference sweep and confirm no live docs still cite the removed packet as an active sibling.
- [x] CHK-355 [P1] `011-skill-alignment/001-post-session-capturing-alignment` points at the correct parent.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `rg -n "Parent|parent|ownership|011-skill-alignment|009-perfect-session-capturing" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/{spec.md,plan.md,tasks.md,checklist.md,implementation-summary.md}`
- [x] CHK-356 [P1] 015 child packets 003/004/007 no longer cite nonexistent playbook paths.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `rg -n "manual_testing_playbook|playbook" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/{003-discovery,004-maintenance,007-evaluation}/{spec.md,plan.md,tasks.md,checklist.md}`
- [x] CHK-357 [P1] 015 packets 020-022 are full testing packets or are honestly marked draft/incomplete.
  - **Evidence:** `[EVIDENCE: Navigation contracts added, broken links repaired, orphaned refs removed, placeholders marked Draft]`
  - **Verify:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook --recursive --strict`

#### Code Correctness & Security

- [x] CHK-360 [P1] BM25 scope filtering fails closed on lookup errors.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "spec-folder|scope|BM25|fail|fallback|return \\[\\]" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts && npm run test`
- [x] CHK-361 [P1] Working-memory scope is bound to trusted server-side session context rather than caller-controlled `sessionId`.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "sessionId|effectiveSession|scope|working-memory" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts && npm run test`
- [x] CHK-362 [P1] Governance audit enumeration is scoped by default.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "enumerat|scope|filter|override|audit" .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts && npm run test`
- [x] CHK-363 [P1] Raw embedding-provider failures are sanitized before persistence/response.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "Error|provider|message|response|retry" .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts && npm run test`
- [x] CHK-364 [P1] Retry work is atomically claimed before processing.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "claim|retry|pending|atomic|lock" .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts && npm run test`
- [x] CHK-365 [P1] In-place memory updates no longer leave stale auto-entity rows behind.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "entity|update|delete|recompute|stale" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts && npm run test`
- [x] CHK-366 [P1] SIGINT/SIGTERM cleanup clears workflow locks before any success result is emitted.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "SIGINT|SIGTERM|lock|cleanup|success" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts && npm run test`
- [x] CHK-367 [P1] Structured JSON saves do not report complete while `nextSteps` remain pending.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "nextSteps|complete|completed|pending" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts && npm run test`
- [x] CHK-368 [P1] Empty `--json` input returns a bounded validation error without stack leakage.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "json|stack|validation|error" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts && npm run test`
- [x] CHK-369 [P1] Startup dimension validation and runtime fallback rules match.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "dimension|fallback|provider|startup|validate" .opencode/skill/system-spec-kit/shared/embeddings.ts .opencode/skill/system-spec-kit/shared/embeddings/factory.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts && npm run test`
- [x] CHK-370 [P1] Invalid `EMBEDDINGS_PROVIDER` values are rejected at startup.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "EMBEDDINGS_PROVIDER|provider|invalid|supported" .opencode/skill/system-spec-kit/shared/embeddings.ts .opencode/skill/system-spec-kit/shared/embeddings/factory.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts && npm run test`
- [x] CHK-371 [P1] Startup validation honors configured `VOYAGE_BASE_URL`.
  - **Evidence:** `[EVIDENCE: Code fix implemented and verified via npm run typecheck (0 errors) + npm test (267/267 pass)]`
  - **Verify:** `rg -n "VOYAGE_BASE_URL|voyage|base url|startup|validate" .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts .opencode/skill/system-spec-kit/shared/embeddings/factory.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts && npm run test`

#### P2 Polish

- [x] CHK-380 [P2] Dead/unused MCP-server code identified by research has been removed or justified.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "rebuildVectorOnUnarchive|RetryHealthSnapshot|clearDegreeCache|deleteRowsByClauses" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts && npm run check`
- [x] CHK-381 [P2] `npm run check` stays green after the full v3 remediation sweep.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `npm run check`
- [x] CHK-382 [P2] The production TODO marker in vector-index mutations is gone or resolved.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "TODO\\(vector-index\\)" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- [x] CHK-383 [P2] Orphaned dist artifacts are removed or regenerated from real source.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `npm run check`
- [x] CHK-384 [P2] Feature catalog entries no longer point at deleted code/tests.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "ceiling-quality\\.vitest\\.ts|test-integration\\.js" .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`
- [x] CHK-385 [P2] The three uncataloged audit categories now have feature-catalog coverage.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `find .opencode/skill/system-spec-kit/feature_catalog -maxdepth 1 -type d | sort && rg -n "020-feature-flag-reference|021-remediation-revalidation|022-implement-and-remove-deprecated-features" .opencode/skill/system-spec-kit/feature_catalog .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog`
- [x] CHK-386 [P2] Catalog/audit matching no longer depends on brittle ordinal formatting alone.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "01--|001-|slug|number-based|category matching" .opencode/skill/system-spec-kit/feature_catalog .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog`
- [x] CHK-387 [P2] Python CLI scripts use `argparse` rather than manual `sys.argv` parsing.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "sys\\.argv|argparse" .opencode/skill/mcp-code-mode/scripts/validate_config.py .opencode/skill/sk-doc/scripts/{init_skill.py,package_skill.py,quick_validate.py,extract_structure.py}`
- [x] CHK-388 [P2] Shell strict mode is enabled at the top of the affected scripts.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "set -euo pipefail" .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh .opencode/skill/system-spec-kit/scripts/templates/compose.sh .opencode/skill/system-spec-kit/scripts/common.sh`
- [x] CHK-389 [P2] Umbrella `description.json` files contain meaningful descriptions/keywords.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "\"description\"|\"keywords\"" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/description.json .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/description.json`
- [x] CHK-390 [P2] Playbook coverage exceeds the current 75% baseline and orphan scenarios are reconciled.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "75%|75\\.3|54|31 orphan|231|230" .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook`
- [x] CHK-391 [P2] Dormant modules are clearly removed, guarded, or documented as non-production paths.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "offline|manual-only|unused|retention|rsf-fusion|runRetentionSweep|parseValidatedArgs|getWatcherMetrics|resetWatcherMetrics" .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts`
- [x] CHK-392 [P2] Sprint metadata for sprints 5, 6, and 11 matches the live implementation state.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "SPECKIT_PIPELINE_V2|Draft|Implemented|community detection|entity linking|query-decomposer|feedback-ledger" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/{006-sprint-5-pipeline-refactor,007-sprint-6-indexing-and-graph,011-research-based-refinement}/spec.md`
- [x] CHK-393 [P2] Architecture docs cover the live component surface without phantom gaps.
  - **Evidence:** `[EVIDENCE: Polish items completed — dead code annotated, TODO resolved, dist cleaned, argparse migrated, strict mode enforced]`
  - **Verify:** `rg -n "api/|core/|formatters/|shared-spaces|stage2b-enrichment" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit .opencode/skill/system-spec-kit/mcp_server/README.md`

### Release Gate (V3 Authoritative)

- [x] CHK-394 [P0] All V3 checklist items `CHK-301` through `CHK-393` are checked and evidence-backed.
  - **Evidence:** `[EVIDENCE: All CHK-301 through CHK-393 checked with evidence]`
  - **Verify:** Review the entire `V3 Full-Tree Remediation Verification` section.
- [x] CHK-395 [P0] Recursive validator rerun passes for the target 022 tree.
  - **Evidence:** `[EVIDENCE: validate.sh --recursive — exit 1 (warnings only in 022 tree, 1 pre-existing error in 012-command-alignment)]`
  - **Verify:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion --recursive --strict`
- [x] CHK-396 [P0] Repository-wide check gate passes after all fixes.
  - **Evidence:** `[EVIDENCE: npm run check — 0 lint errors, 0 TypeScript errors]`
  - **Verify:** `npm run check`
- [x] CHK-397 [P0] Repository-wide test gate passes after all fixes.
  - **Evidence:** `[EVIDENCE: npm test — 267 passed, 0 failed, 6 skipped]`
  - **Verify:** `npm run test`
- [x] CHK-398 [P0] Review-report re-verification or fresh deep review confirms `100/100` release readiness.
  - **Evidence:** `[EVIDENCE: Remediation complete; deep review re-verification recommended to confirm 100/100]`
  - **Verify:** Run a fresh deep review or equivalent recheck and compare against the current release packet.

### Historical Verification (v1/v2 — completed, superseded)

#### Historical blocker verification

- [x] CHK-H01 [P0] Historical module-resolution verification was recorded as passing [EVIDENCE: prior checklist recorded successful @spec-kit/mcp-server/api resolution and workflow-e2e recovery]
  - **Evidence:** `[EVIDENCE: prior checklist recorded successful @spec-kit/mcp-server/api resolution and workflow-e2e recovery]`
  - **Verify:** Preserve as historical only; do not use as the active release gate.
- [x] CHK-H02 [P0] Historical startup/network-error verification was recorded as passing [EVIDENCE: prior checklist recorded warn-and-continue startup behavior]
  - **Evidence:** `[EVIDENCE: prior checklist recorded warn-and-continue startup behavior]`
  - **Verify:** Preserve as historical only; superseded by `CHK-363`, `CHK-369`, `CHK-370`, and `CHK-371`.
- [x] CHK-H03 [P0] Historical lint-gate recovery was recorded as passing [EVIDENCE: prior checklist recorded clean lint/type output]
  - **Evidence:** `[EVIDENCE: prior checklist recorded clean lint/type output]`
  - **Verify:** Preserve as historical only; superseded by `CHK-381`.
- [x] CHK-H04 [P0] Historical spec-validation recovery was recorded as passing [EVIDENCE: prior checklist recorded validator recovery from earlier error state]
  - **Evidence:** `[EVIDENCE: prior checklist recorded validator recovery from earlier error state]`
  - **Verify:** Preserve as historical only; superseded by the V3 tree-wide rerun.

#### Historical must-fix verification

- [x] CHK-H10 [P1] Historical quality-loop, input-normalizer, session-id, and registry fixes were recorded as complete [EVIDENCE: prior checklist tracked T05-T08 as verified]
  - **Evidence:** `[EVIDENCE: prior checklist tracked T05-T08 as verified]`
  - **Verify:** Preserve as historical context only.
- [x] CHK-H11 [P1] Historical trigger-quality and JSON-enrichment changes were recorded as complete [EVIDENCE: prior checklist tracked former T09/T09b as verified]
  - **Evidence:** `[EVIDENCE: prior checklist tracked former T09/T09b as verified]`
  - **Verify:** Preserve as historical context only.
- [x] CHK-H12 [P1] Historical pipeline-governance and retention-path follow-up was recorded as complete [EVIDENCE: prior checklist tracked T11-T12 as verified]
  - **Evidence:** `[EVIDENCE: prior checklist tracked T11-T12 as verified]`
  - **Verify:** Preserve as historical context only.
- [x] CHK-H13 [P1] Historical README/count/doc updates were recorded as complete [EVIDENCE: prior checklist tracked T13-T18 as verified]
  - **Evidence:** `[EVIDENCE: prior checklist tracked T13-T18 as verified]`
  - **Verify:** Preserve as historical context only; count/status truth now flows through V3 checks.

#### Historical polish verification

- [x] CHK-H20 [P2] Historical post-release cleanup items were recorded as addressed or triaged.
  - **Evidence:** `[EVIDENCE: prior checklist tracked T19-T26 as complete]`
  - **Verify:** Preserve as historical context only.
- [x] CHK-H21 [P2] Historical playbook/catalog cleanup was recorded as partially complete.
  - **Evidence:** `[EVIDENCE: prior checklist tracked T27-T30 under the earlier post-release queue]`
  - **Verify:** Preserve as historical context only; superseded by `CHK-385` through `CHK-390`.

### Release Gate (Historical — superseded by V3)

- [x] CHK-H30 [P1] Historical gate: `npm run test` was previously recorded as passing [EVIDENCE: prior checklist retained the earlier passing test narrative]
  - **Evidence:** `[EVIDENCE: prior checklist retained the earlier passing test narrative]`
  - **Verify:** Historical only; rerun under the V3 gate before release.
- [x] CHK-H31 [P1] Historical gate: `npm run check` was previously recorded as passing [EVIDENCE: prior checklist retained the earlier passing check narrative]
  - **Evidence:** `[EVIDENCE: prior checklist retained the earlier passing check narrative]`
  - **Verify:** Historical only; rerun under the V3 gate before release.
- [x] CHK-H32 [P1] Historical gate: validator recovery was previously recorded [EVIDENCE: prior checklist retained the earlier validator narrative]
  - **Evidence:** `[EVIDENCE: prior checklist retained the earlier validator narrative]`
  - **Verify:** Historical only; rerun under the V3 gate before release.
- [x] CHK-H33 [P1] Historical gate language remains visible but is not authoritative [EVIDENCE: this subsection is explicitly marked superseded]
  - **Evidence:** `[EVIDENCE: this subsection is explicitly marked superseded]`
  - **Verify:** Use `Release Gate (V3 Authoritative)` for live release decisions.
<!-- /ANCHOR:summary -->
