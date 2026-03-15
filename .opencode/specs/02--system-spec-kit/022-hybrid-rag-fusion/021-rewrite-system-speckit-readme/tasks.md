---
title: "Tasks: Rewrite System Spec Kit README"
description: "Task breakdown for complete rewrite of the system-spec-kit README."
---
<!-- SPECKIT_LEVEL: 1 -->
# Tasks: 021-rewrite-system-speckit-readme

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

- [ ] T001 Catalog all skill components from SKILL.md and directory structure
- [ ] T002 [P] Extract documentation level definitions from template files
- [ ] T003 [P] List all 13 commands with descriptions from command directory
- [ ] T004 [P] Inventory scripts and validation tools
- [ ] T005 Write research brief to `scratch/research-brief.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Draft

- [ ] T006 Write Overview section (skill purpose, key capabilities)
- [ ] T007 Write Quick Start section (getting started with Spec Kit)
- [ ] T008 Write Components section (directory structure, key files)
- [ ] T009 Write Documentation Levels section (Level 1-3+ with CORE+ADDENDUM)
- [ ] T010 Write Memory System section (overview with link to MCP README)
- [ ] T011 Write Commands section (all 13 commands with brief descriptions)
- [ ] T012 Write Templates section (CORE+ADDENDUM v2.2 architecture)
- [ ] T013 Write Scripts section (validation, generation, memory tools)
- [ ] T014 Write Troubleshooting, FAQ, and Related Resources
- [ ] T015 Add TOC and ensure internal navigation works
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Review and Assembly

- [ ] T016 Run DQI scoring (target >= 75)
- [ ] T017 [P] Run HVR banned-word check
- [ ] T018 [P] Verify all 13 commands present
- [ ] T019 [P] Verify cross-references to MCP README and root README resolve
- [ ] T020 [P] Check for content duplication with MCP README
- [ ] T021 Apply review fixes
- [ ] T022 Final DQI check and replace current README
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] DQI >= 75 verified
- [ ] All components documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **SKILL.md**: `.opencode/skill/system-spec-kit/SKILL.md`
- **MCP README**: `.opencode/skill/system-spec-kit/mcp_server/README.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS: 021-rewrite-system-speckit-readme
0/22 tasks complete — In Progress (2026-03-15)
-->
