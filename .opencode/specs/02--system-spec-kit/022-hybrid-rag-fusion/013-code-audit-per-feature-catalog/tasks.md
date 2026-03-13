---
title: "Tasks: Code Audit Per Feature Catalog [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "tasks"
  - "code audit"
  - "feature catalog"
  - "remediation"
importance_tier: "high"
contextType: "general"
---
# Tasks: Code Audit Per Feature Catalog

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase folder inventory and naming consistency for phases `001` through `021` (`013-code-audit-per-feature-catalog/*`)
- [x] T002 Confirm feature-catalog and playbook inputs are available for audit traceability (`feature_catalog/`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`)
- [x] T003 Register remediation phase 021 in parent planning artifacts (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Remediation Reconciliation

- [x] T004 Preserve and reference existing phase 001-020 audit artifacts while adding phase 021 (`001-*` through `020-*`, `021-*`)
- [x] T005 Capture chunk-thinning timeout remediation evidence (`mcp_server/tests/chunk-thinning.vitest.ts`)
- [x] T006 Capture tests README placeholder-suite labeling update (`.opencode/skill/system-spec-kit/mcp_server/tests/README.md`)
- [x] T007 Capture feature-catalog coverage wording alignment for incremental-index suites across phases 001-018 (`feature_catalog/01--*` through `18--*`)
- [x] T008 Update phase navigation from phase 020 to phase 021 (`020-feature-flag-reference/spec.md`)
- [x] T009 Rewrite parent synthesis so 41/106/33 is historical superseded context, not current truth (`synthesis.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run recursive spec validation for parent + child phase docs (`validate.sh --recursive`) [RESULT: PASS; root + all 21 phases validated cleanly after parent implementation summary closeout]
- [x] T011 Verify no template placeholders remain in phase 021 completion artifacts (`021-remediation-revalidation/*.md`) [RESULT: PASS, no hits (rg exit 1)]
- [x] T012 Record real verification outcomes in phase 021 checklist and implementation summary (`021-remediation-revalidation/checklist.md`, `021-remediation-revalidation/implementation-summary.md`)
- [ ] T013 Save memory context snapshot if explicitly requested (`memory/` via generate-context script)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T010-T012 marked complete with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Parent synthesis and phase-link map reflect current remediation truth
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
