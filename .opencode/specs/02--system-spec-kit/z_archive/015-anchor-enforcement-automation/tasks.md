---
title: "Tasks: Anchor Enforcement Automation [132-anchor-enforcement-automation/tasks]"
description: "Task Format: T### [P?] [W:XXXX?] Description (file path) [Priority]"
trigger_phrases:
  - "tasks"
  - "anchor"
  - "enforcement"
  - "automation"
  - "132"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Anchor Enforcement Automation

<!-- SPECKIT_LEVEL: 3+ -->
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
| `[W:XXXX]` | Workstream tag |

**Task Format**: `T### [P?] [W:XXXX?] Description (file path) [Priority]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Research & Analysis (COMPLETED)

- [x] T001 Root cause analysis of template non-compliance (scratch/wave1-context-investigations.md) [P0]
- [x] T002 Under-utilization analysis of @speckit agent (spec.md section 2) [P0]
- [x] T003 [P] Template structure investigation (plan.md section 3) [P0]
- [x] T004 [P] Existing validation gap identification (spec.md section 6) [P0]
- [x] T005 Evidence gathering from codebase (research findings) [P0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Validation Enhancement

- [ ] T006 [W:VALID] Extend validate.sh with template source header check (scripts/spec/validate.sh) [P0]
- [ ] T007 [W:VALID] Add ANCHOR tag requirement validation for spec docs (scripts/spec/validate.sh) [P0]
- [ ] T008 [W:VALID] [P] Implement template hash verification with informational warnings (scripts/spec/validate.sh) [P1]
- [ ] T009 [W:VALID] [P] Add clear error messages with remediation guidance (scripts/spec/validate.sh) [P1]
- [ ] T010 [W:VALID] Create validation test suite with edge cases (test fixtures + bash harness) [P1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: ANCHOR Auto-Generation

- [ ] T011 [W:ANCHOR] [P] Enhance anchor-generator.ts to detect major sections (## headings) (scripts/lib/anchor-generator.ts) [P0]
- [ ] T012 [W:ANCHOR] [P] Auto-wrap template sections with ANCHOR tags (scripts/lib/anchor-generator.ts) [P0]
- [ ] T013 [W:ANCHOR] Preserve existing ANCHOR tags on regeneration (scripts/lib/anchor-generator.ts) [P1]
- [ ] T014 [W:ANCHOR] [P] Add ANCHOR ID collision detection and resolution (scripts/lib/anchor-generator.ts) [P1]
- [ ] T015 [W:ANCHOR] Update all level_N template files with ANCHOR coverage (templates/level_1-3+/*.md) [P0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Agent Routing Enforcement

- [ ] T016 [W:ROUTE] Update speckit.md with pre-flight validation gates (.opencode/agent/chatgpt/speckit.md) [P0]
- [ ] T017 [W:ROUTE] Modify orchestrate.md with Gate 3 HARD BLOCK enforcement (.opencode/agent/chatgpt/orchestrate.md) [P0]
- [ ] T018 [W:ROUTE] [B:T016] Add routing violation detection in file write paths (AGENTS.md) [P0]
- [ ] T019 [W:ROUTE] [P] Implement emergency bypass logging mechanism (.opencode/agent/chatgpt/speckit.md) [P1]
- [ ] T020 [W:ROUTE] [B:T017] Update AGENTS.md with clarified Gate 3 rules and examples (AGENTS.md) [P1]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: MCP Integration

- [ ] T021 [W:MCP] [B:T007] Add ANCHOR validation in memory/save.ts (mcp_server/src/routes/memory/save.ts) [P1]
- [ ] T022 [W:MCP] [B:T021] Implement pre-flight check before file write (mcp_server/src/routes/memory/save.ts) [P1]
- [ ] T023 [W:MCP] [P] Add validation bypass for scratch/ folder (mcp_server/src/routes/memory/save.ts) [P2]
- [ ] T024 [W:MCP] [B:T007] Integrate with check-anchors.sh validation (mcp_server/src/routes/memory/save.ts) [P1]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Documentation & Testing

- [ ] T025 [W:DOCS] [P] Update system-spec-kit SKILL.md with new enforcement rules (.opencode/skill/system-spec-kit/SKILL.md) [P1]
- [ ] T026 [W:DOCS] [P] Create migration guide for legacy specs (scratch/migration-guide.md) [P2]
- [ ] T027 [W:TEST] [B:T010,T014,T022] Write integration tests for all enforcement layers (test suite) [P1]
- [ ] T028 [W:DOCS] Document emergency bypass procedures (system-spec-kit SKILL.md) [P2]
- [ ] T029 [W:DOCS] [B:T025,T026,T027] Complete implementation-summary.md (implementation-summary.md) [P0]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Verification & Completion

- [ ] T030 [W:VERIFY] [B:T029] Run full validation suite on all existing specs (validate.sh across specs/*/) [P0]
- [ ] T031 [W:VERIFY] [B:T030] Verify checklist.md P0/P1/P2 completion with evidence (checklist.md) [P0]
- [ ] T032 [W:VERIFY] [B:T031] Gather evidence artifacts for each checklist item (scratch/evidence/) [P0]
- [ ] T033 [W:VERIFY] [B:T032] Save context to memory with generate-context.js (memory/) [P0]
- [ ] T034 [W:VERIFY] [B:T033] Final compliance audit and success criteria verification (spec.md section 5) [P0]
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]` (22 total P0 tasks)
- [ ] No `[B]` blocked tasks remaining
- [ ] All 3 enforcement layers operational (validation, routing, MCP)
- [ ] Checklist.md P0/P1 items completed with evidence citations
- [ ] validate.sh exit code 0 or 1 (no errors, warnings acceptable)
- [ ] Test suite passing (vitest + bash validation tests)
- [ ] Documentation updated (5 files: AGENTS.md, speckit.md, orchestrate.md, SKILL.md, implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (requirements, scope, success criteria)
- **Plan**: See `plan.md` (architecture, phases, effort estimates)
- **Verification**: See `checklist.md` (P0/P1/P2 quality gates)
- **Decisions**: See `decision-record.md` (ADRs for enforcement approach)
- **Research**: See `research.md` (root cause analysis, evidence)
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:workstream-summary -->
## Workstream Summary

| Workstream | Tasks | Parallelizable | Estimated Effort |
|------------|-------|----------------|------------------|
| [W:VALID] Validation | 5 | 3 | 4-6 hours |
| [W:ANCHOR] ANCHOR Gen | 5 | 4 | 3-4 hours |
| [W:ROUTE] Routing | 5 | 2 | 4-5 hours |
| [W:MCP] MCP Integration | 4 | 2 | 2-3 hours |
| [W:DOCS] Documentation | 5 | 3 | 2-3 hours |
| [W:TEST] Testing | 1 | 0 | (integrated) |
| [W:VERIFY] Verification | 5 | 0 | 1-2 hours |
| **Total** | **30** | **14** | **16-23 hours** |

**Parallel Efficiency**: 14 of 30 tasks (47%) can run in parallel, reducing wall-clock time by ~35% with optimal agent allocation.
<!-- /ANCHOR:workstream-summary -->

---

<!-- ANCHOR:blocking-graph -->
## Task Dependency Graph

```
Phase 1: T001-T005 (COMPLETED) ───────┐
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
Phase 2: T006-T010 (parallel)           Phase 3: T011-T015 (parallel)
         [W:VALID]                               [W:ANCHOR]
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      ↓
Phase 4: T016-T020 (sequential, blocks on T006-T015)
         [W:ROUTE]
                    │
                    ├──► Phase 5: T021-T024 (blocks on T007, T021)
                    │            [W:MCP]
                    ↓
Phase 6: T025-T029 (mostly parallel, T029 blocks on T025-T027)
         [W:DOCS, W:TEST]
                    ↓
Phase 7: T030-T034 (sequential waterfall)
         [W:VERIFY]
```

**Critical Path**: T001→T005 (DONE) → T006→T007 → T016→T018 → T025→T029 → T030→T034 = ~11-16 hours
<!-- /ANCHOR:blocking-graph -->

---

<!--
LEVEL 3+ TASKS (~140 lines)
- 30 tasks across 7 phases
- Workstream tagging ([W:XXXX])
- Blocking task references ([B:T###])
- Parallelization markers ([P])
- Priority indicators ([P0/P1/P2])
- Comprehensive ANCHOR coverage
-->
