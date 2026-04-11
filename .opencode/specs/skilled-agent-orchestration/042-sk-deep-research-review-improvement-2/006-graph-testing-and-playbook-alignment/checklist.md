---
title: "Verification Checklist: Graph Testing and Playbook Alignment [042.006]"
description: "Completed verification checklist for the graph testing and playbook alignment phase."
trigger_phrases:
  - "042.006"
  - "graph testing checklist"
importance_tier: "important"
contextType: "checklist"
---
# Verification Checklist: Graph Testing and Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- P0 items MUST be `[x]` with evidence before the phase is complete.
- P1 items MUST be `[x]` or carry an explicit deferral reason.
- Evidence must cite the live test, playbook, README, or validation surfaces.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] CommonJS coverage-graph helper surfaces were identified before closeout. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs`]
- [x] CHK-002 [P0] TypeScript graph DB surface was identified before closeout. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`]
- [x] CHK-003 [P1] Existing playbook trees were confirmed before recording the delivered scenarios. [EVIDENCE: `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent` playbook directories]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] `coverage-graph-integration.vitest.ts` exists as the cross-layer contract suite. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`]
- [x] CHK-005 [P0] `coverage-graph-stress.vitest.ts` exists as the larger-graph stress suite. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts`]
- [x] CHK-006 [P1] The phase packet uses the current Level 2 template markers and anchors. [EVIDENCE: packet docs include `SPECKIT_LEVEL`, `SPECKIT_TEMPLATE_SOURCE`, and required anchor blocks]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Research graph-convergence playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md`]
- [x] CHK-008 [P0] Research graph-events playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md`]
- [x] CHK-009 [P0] Review graph-convergence playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md`]
- [x] CHK-010 [P0] Review graph-events playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md`]
- [x] CHK-011 [P1] Improve-agent mutation-coverage playbook exists. [EVIDENCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`]
- [x] CHK-012 [P1] Improve-agent trade-off-detection playbook exists. [EVIDENCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`]
- [x] CHK-013 [P1] Improve-agent candidate-lineage playbook exists. [EVIDENCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`]
- [x] CHK-014 [P1] Strict phase validation passes after packet rewrite. [EVIDENCE: `validate.sh --strict` result]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-015 [P1] The packet introduces no secret-bearing paths or environment-specific credentials. [EVIDENCE: only repo-relative test, playbook, README, and validation paths are cited]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P0] The deep-research README is documented as a graph-capability surface. [EVIDENCE: `.opencode/skill/sk-deep-research/README.md`]
- [x] CHK-017 [P0] The deep-review README is documented as a graph-capability surface. [EVIDENCE: `.opencode/skill/sk-deep-review/README.md`]
- [x] CHK-018 [P1] The improve-agent README is documented as a graph-capability surface. [EVIDENCE: `.opencode/skill/sk-improve-agent/README.md`]
- [x] CHK-019 [P1] `implementation-summary.md` records the delivered tests, playbooks, and README updates. [EVIDENCE: `implementation-summary.md` sections `What Was Built`, `How It Was Delivered`, and `Verification`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P0] The phase includes the required Level 2 packet files. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` present]
- [x] CHK-021 [P1] The phase memory folder remains untouched. [EVIDENCE: `memory/.gitkeep` retained; no memory files modified]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- Total P0 items: 11
- Total P1 items: 10
- Status: Complete
- Closeout standard: live-path verification plus strict phase validation
<!-- /ANCHOR:summary -->
