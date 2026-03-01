---
title: "Tasks: 013 - Deprecate Skill Graph and README/Skill-Ref Indexing [001-deprecated-skill-graph-experiment/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "013"
  - "deprecate"
  - "skill"
  - "graph"
  - "001"
  - "deprecated"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 013 - Deprecate Skill Graph and README/Skill-Ref Indexing (Completion Pass 2)

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Run MCP compile gate (`.opencode/skill/system-spec-kit/mcp_server` -> `npx tsc -p tsconfig.json`)
- [x] T002 Run full MCP test gate (`.opencode/skill/system-spec-kit/mcp_server` -> `npm test`)
- [x] T003 [P] Run forbidden-term scan for `sgqs|skill-ref|readme-indexing|skill-graph` in mcp_server source
- [x] T004 [P] Run command scan for `graph_node` in `.opencode/command/create`
- [x] T005 [P] Run command scan for README indexing notes in create-folder-readme YAMLs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Residual Cleanup Evidence Capture

- [x] T010 Capture README TOC anchor completion evidence for:
  - `.opencode/skill/mcp-chrome-devtools/README.md`
  - `.opencode/skill/sk-doc/README.md`
  - `.opencode/skill/system-spec-kit/templates/addendum/README.md`
- [x] T011 Capture MCP residual rename cleanup evidence (`SkillGraphLike` -> `MemoryGraphLike`)
- [x] T012 Capture runtime asset restoration evidence (`mcp_server/dist/database`, `mcp_server/dist/configs/search-weights.json`)
- [x] T013 Capture boundary statement that causal graph features remain in scope as supported behavior
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Level 3 Artifact Authoring

- [x] T020 Create `spec.md` (this folder)
- [x] T021 Create `plan.md` (this folder)
- [x] T022 Create `tasks.md` (this folder)
- [x] T023 Create `checklist.md` (this folder)
- [x] T024 Create `decision-record.md` (this folder)
- [x] T025 Create `implementation-summary.md` (this folder)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Validation

- [x] T030 Run spec validation for `013` folder (`validate.sh`)
- [x] T031 Run placeholder scan for `013` folder (`check-placeholders.sh`)
- [x] T032 Final sync check across all six artifacts
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Legacy Skill-Graph Consolidation

- [x] T040 Create `merge-manifest.md` with source-to-archive mapping
- [x] T041 Consolidate legacy skill-graph source context (`002/003/006/007/009/012`) into active `013` docs
- [x] T042 Move legacy source folders to `../z_archive/skill-graph-legacy/`
- [x] T043 Mark parent root lifecycle docs as intentionally removed and keep child folders as canonical state
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` tasks remaining
- [x] Compile/test/scan evidence captured in checklist
- [x] Level 3 artifact set validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Merge Manifest**: `merge-manifest.md`
<!-- /ANCHOR:cross-refs -->
