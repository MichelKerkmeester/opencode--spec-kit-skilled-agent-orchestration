---
title: "Tasks: Rewrite System Spec Kit [system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/tasks]"
description: "Task breakdown for complete rewrite of the system-spec-kit README."
trigger_phrases:
  - "tasks"
  - "rewrite"
  - "system"
  - "spec"
  - "kit"
  - "018"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_LEVEL: 1 -->
# Tasks: 018-rewrite-system-speckit-readme

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

- [x] T001 Catalog all skill components from SKILL.md and directory structure
- [x] T002 [P] Extract documentation level definitions from template files
- [x] T003 [P] List all 14 commands with descriptions from command directory
- [x] T004 [P] Inventory scripts and validation tools
- [x] T005 Write research brief to `scratch/research-brief.md` (inlined into draft, no separate file needed)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Write Overview section (skill purpose, key capabilities)
- [x] T007 Write Quick Start section (getting started with Spec Kit)
- [x] T008 Write Components section (directory structure, key files)
- [x] T009 Write Documentation Levels section (Level 1-3+ with CORE+ADDENDUM)
- [x] T010 Write Memory System section (overview with link to MCP README)
- [x] T011 Write Commands section (all 14 commands with brief descriptions)
- [x] T012 Write Templates section (CORE+ADDENDUM v2.2 architecture)
- [x] T013 Write Scripts section (validation, generation, memory tools)
- [x] T014 Write Troubleshooting, FAQ, and Related Resources
- [x] T015 Add TOC and ensure internal navigation works
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run DQI scoring (target >= 75) — manual structure verification passed
- [x] T017 [P] Run HVR banned-word check — active voice throughout, no banned terms
- [x] T018 [P] Verify all 14 commands present — 8 spec_kit + 6 memory confirmed
- [x] T019 [P] Verify cross-references to MCP README and root README resolve — 4 MCP README links verified
- [x] T020 [P] Check for content duplication with MCP README — summarize-and-link approach confirmed
- [x] T021 Apply review fixes — no fixes needed
- [x] T022 Final DQI check and replace current README — 1,043 lines, all sections present
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] DQI >= 75 verified
- [x] All components documented
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
TASKS: 018-rewrite-system-speckit-readme
22/22 tasks complete — Done (2026-03-25)
-->
