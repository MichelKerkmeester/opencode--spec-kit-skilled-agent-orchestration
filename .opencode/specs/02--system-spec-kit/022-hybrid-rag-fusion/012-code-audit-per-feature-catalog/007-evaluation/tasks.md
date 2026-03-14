---
title: "Tasks: evaluation [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) | Date: 2026-03-10 | Status: Draft"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "evaluation"
  - "phase"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: evaluation

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Build Evaluation feature inventory (`.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/`) — 2 features (F-01 ablation, F-02 dashboard) inventoried
- [x] T002 Confirm audit criteria and playbook mapping (`EX-032`, `EX-033`) — mapped to handler/service audit criteria
- [x] T003 [P] Validate referenced source/test file availability (`mcp_server/**`, `.opencode/skill/system-spec-kit/feature_catalog/**`) — all files confirmed present
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Resolve P0 finding: `eval_final_results` source mismatch (`mcp_server/lib/eval/reporting-dashboard.ts`, `.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`) — stale comment and catalog claim corrected; dashboard only queries `eval_metric_snapshots` + `eval_channel_results`
- [x] T005 Resolve P0 finding: add handler-level dashboard tests (`mcp_server/handlers/eval-reporting.ts`, `mcp_server/tests/*`) — 3 dashboard tests (T005-D1..D3) + 4 export tests (T005-E1..E4) in handler-eval-reporting.vitest.ts
- [x] T006 [P] Resolve P2 finding: add ablation handler-level normalization/flag tests (`mcp_server/handlers/eval-reporting.ts`, `mcp_server/tests/*`) — 9 ablation tests (T006-A1..A9) covering disabled flag, normalizeChannels, recallK defaults, DB-not-init, null-report, storeResults=false, includeFormattedReport=false
- [x] T007 [P] Resolve P2 finding: remove stale F-01 `retry.vitest.ts` reference (`.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md`) — confirmed clean, no references found
- [x] T008 [P] Resolve P2 finding: remove stale F-02 `retry.vitest.ts` reference (`.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`) — confirmed clean, no references found
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run targeted evaluation tests and verify expected behavior (`mcp_server/tests/*`) — 97/97 tests pass (34 reporting-dashboard + 47 ablation-framework + 16 handler-eval-reporting)
- [x] T010 Verify feature-catalog behavior parity after remediation (`.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/*.md`) — F-02 catalog corrected to match actual SQL paths; F-01 already clean
- [x] T011 Update and synchronize spec artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) — all 4 docs updated with implementation evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — 97/97 tests, tsc clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
