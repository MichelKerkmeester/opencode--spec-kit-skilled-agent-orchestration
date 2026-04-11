---
title: "Tasks: Gate F — Archive Permanence [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate f tasks"
  - "archive permanence tasks"
  - "retire keep investigate tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: Gate F — Archive Permanence

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
## Phase 1: Evidence Collection

- [ ] T001 Confirm Gate E is closed and the 180-day window is measured from the Gate B archive flip (`spec.md`, `plan.md`)
- [ ] T002 Pull 180 days of daily `archived_hit_rate`, eligibility floors, and anomaly markers from the metrics source (`implementation-summary.md`)
- [ ] T003 [P] Collect query-intent, spec-family, and top archive-only query slices needed for the evidence package (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Decision Classification

- [ ] T004 Apply iter 036 weekly seasonality correction and compute EWMA with `alpha=0.1` (`implementation-summary.md`)
- [ ] T005 Check 30-day stability using rolling stddev, max raw-rate spike, and 14-day slope guards (`implementation-summary.md`)
- [ ] T006 Evaluate the section 6 ladder and classify RETIRE, KEEP, INVESTIGATE, or ESCALATE (`implementation-summary.md`)
- [ ] T007 Write the full evidence package: trend data, slice breakdown, top 20 archive-only queries, fresh-doc comparisons, and cost estimate (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Conditional Follow-up

- [ ] T008 If RETIRE, implement `scripts/memory/retirement-018.ts` and update `mcp_server/lib/search/stage1-candidate-gen.ts` plus `mcp_server/lib/storage/incremental-index.ts`
- [ ] T009 If KEEP, document the permanent thin-layer rationale and close Gate F with no runtime code changes (`implementation-summary.md`)
- [ ] T010 If INVESTIGATE or ESCALATE, file the required follow-up spec and stop archive retirement work (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All decision tasks are complete for the selected outcome path
- [ ] No unresolved telemetry or archive-only evidence blockers remain undocumented
- [ ] Conditional verification is complete for RETIRE, KEEP, or INVESTIGATE
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
