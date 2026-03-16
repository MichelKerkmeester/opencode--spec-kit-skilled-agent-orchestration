---
title: "Tasks: Rewrite Repo README"
description: "Task breakdown for complete rewrite of the repository root README."
---
<!-- SPECKIT_LEVEL: 1 -->
# Tasks: 018-rewrite-repo-readme

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
## Phase 1: Research

- [ ] T001 Enumerate all 11 agents with roles and capabilities
- [ ] T002 [P] Enumerate all 16 skills with descriptions
- [ ] T003 [P] Extract gate system summary from CLAUDE.md
- [ ] T004 [P] Inventory command architecture from command directory
- [ ] T005 [P] Catalog code mode MCP configuration
- [ ] T006 Write research brief to `scratch/research-brief.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Draft

- [ ] T007 Write Overview section (what OpenCode is, key numbers)
- [ ] T008 Write Quick Start section (first steps for new users)
- [ ] T009 Write Spec Kit Documentation section (summary, link to D3)
- [ ] T010 Write Memory Engine section (summary, link to D1)
- [ ] T011 Write Agent Network section (all 11 agents with roles)
- [ ] T012 Write Command Architecture section
- [ ] T013 Write Skills Library section (all 16 skills with descriptions)
- [ ] T014 Write Gate System section (3 gates from CLAUDE.md)
- [ ] T015 Write Code Mode MCP section
- [ ] T016 Write Configuration section
- [ ] T017 Write Usage Examples section
- [ ] T018 Write Troubleshooting, FAQ, and Related Documents
- [ ] T019 Add TOC and role-based navigation paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Review and Assembly

- [ ] T020 Run DQI scoring (target >= 75)
- [ ] T021 [P] Run HVR banned-word check
- [ ] T022 [P] Verify all 16 skills and 11 agents present
- [ ] T023 [P] Verify cross-references to D1 and D3 resolve
- [ ] T024 [P] Check for content duplication with D1 and D3
- [ ] T025 [P] Test role-based navigation paths (newcomer, developer, admin)
- [ ] T026 Apply review fixes
- [ ] T027 Final DQI check and replace current README
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] DQI >= 75 verified
- [ ] All 16 skills and 11 agents documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **MCP README (D1)**: `.opencode/skill/system-spec-kit/mcp_server/README.md`
- **Spec Kit README (D3)**: `.opencode/skill/system-spec-kit/README.md`
- **Agent definitions**: `.claude/agents/`, `.opencode/agent/`
- **Skill directory**: `.opencode/skill/`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS: 018-rewrite-repo-readme
0/27 tasks complete — In Progress (2026-03-15)
-->
