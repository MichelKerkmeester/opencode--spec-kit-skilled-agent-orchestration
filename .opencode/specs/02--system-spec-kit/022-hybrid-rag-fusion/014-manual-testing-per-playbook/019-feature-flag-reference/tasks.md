---
title: "Tasks: manual-testing-per-playbook feature-flag-reference phase [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "feature flag reference tasks"
  - "phase 019 tasks"
  - "flag catalog manual testing tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook feature-flag-reference phase

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Open and verify playbook source: `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T002 Load review protocol from playbook §4
- [ ] T003 Confirm feature catalog links for all 8 scenarios: `../../feature_catalog/19--feature-flag-reference/`
- [ ] T004 Confirm MCP runtime access for `memory_search` and `memory_context`
- [ ] T005 Verify flag documentation is indexed; run `memory_index_scan({ force:true })` if flag docs are absent
- [ ] T006 Confirm dist build at `.opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js` is current; run `npm run build` if in doubt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Execute EX-028 — `memory_search({ query:"SPECKIT flags active inert deprecated", limit:20 })` then `memory_context({ mode:"deep", prompt:"Classify SPECKIT flags as active, inert, or deprecated", sessionId:"ex028" })`; capture output and classify flags
- [ ] T008 Execute EX-029 — `memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })`; surface all required session/cache control keys
- [ ] T009 Execute EX-030 — `memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })`; identify defaults and keys for MCP guardrails
- [ ] T010 Execute EX-031 — `memory_search({ query:"SPEC_KIT_DB_DIR SPECKIT_DB_DIR database path precedence", limit:20 })` then `memory_context({ mode:"focused", prompt:"Explain DB path precedence env vars", sessionId:"ex031" })`; confirm DB path precedence chain
- [ ] T011 Execute EX-032 — `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })`; confirm provider routing and key precedence
- [ ] T012 Execute EX-033 — `memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 })`; separate opt-in from inert controls
- [ ] T013 Execute EX-034 — `memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })`; surface all listed branch env vars
- [ ] T014 [P] If any EX-028 through EX-034 returns 0 results: run `memory_index_scan({ force:true })`, retry once; document EVIDENCE GAP and triage via feature catalog if still 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Change to `.opencode/skill/system-spec-kit/mcp_server/` directory
- [ ] T016 Execute 125 step 1 — `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"` — capture JSON output; confirm `phase:"shared-rollout"` with `capabilities.graphUnified:true`
- [ ] T017 Execute 125 step 2 — `SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` — capture JSON output; confirm `phase:"graph"` with `capabilities.graphUnified:false`
- [ ] T018 Unset all SPECKIT_HYDRA_* env vars after both snapshots are captured
- [ ] T019 Capture evidence bundle for EX-028: prompt, command output, classification, triage notes, verdict (PASS/PARTIAL/FAIL)
- [ ] T020 Capture evidence bundle for EX-029: prompt, command output, keys surfaced, verdict (PASS/PARTIAL/FAIL)
- [ ] T021 Capture evidence bundle for EX-030: prompt, command output, defaults identified, verdict (PASS/PARTIAL/FAIL)
- [ ] T022 Capture evidence bundle for EX-031: prompt, command output, precedence chain, verdict (PASS/PARTIAL/FAIL)
- [ ] T023 Capture evidence bundle for EX-032: prompt, command output, routing rules, verdict (PASS/PARTIAL/FAIL)
- [ ] T024 Capture evidence bundle for EX-033: prompt, command output, opt-in vs inert separation, verdict (PASS/PARTIAL/FAIL)
- [ ] T025 Capture evidence bundle for EX-034: prompt, command output, branch vars found, verdict (PASS/PARTIAL/FAIL)
- [ ] T026 Capture evidence bundle for 125: both JSON snapshots, isolation confirmation, verdict (PASS/PARTIAL/FAIL)
- [ ] T027 Report phase coverage as 8/8 scenarios with verdict summary
- [ ] T028 Update `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 8 scenarios have verdicts (PASS/PARTIAL/FAIL)
- [ ] Phase coverage reported as 8/8
- [ ] 125 snapshot outputs captured; SPECKIT_HYDRA_* env vars unset
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
