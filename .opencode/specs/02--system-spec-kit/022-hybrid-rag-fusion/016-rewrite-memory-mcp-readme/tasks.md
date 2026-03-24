---
title: "Tasks: Rewrite Memory MCP README"
description: "Task breakdown for complete rewrite of the MCP server README covering all 32 tools."
---
<!-- SPECKIT_LEVEL: 1 -->
# Tasks: 016-rewrite-memory-mcp-readme

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

- [ ] T001 Extract 32 tool definitions from `tool-schemas.ts` into structured inventory
- [ ] T002 [P] Map 22 feature categories from feature_catalog.md to README sections
- [ ] T003 [P] Extract architecture details: hybrid search pipeline, FSRS decay, 6-tier importance, 5-state lifecycle
- [ ] T004 [P] Catalog feature flags and configuration options
- [ ] T005 Write research brief to `scratch/research-brief.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Write Overview section (project description, key capabilities)
- [ ] T007 Write Quick Start section (installation reference, basic usage)
- [ ] T008 Write Architecture section (hybrid search, memory model, layer system)
- [ ] T009 Write MCP Tools section (all 32 tools with parameters and layer annotations)
- [ ] T010 Write Search System section (BM25 + vector fusion, query expansion, reranking)
- [ ] T011 Write Configuration section (feature flags, environment variables)
- [ ] T012 Write Usage Examples section (common workflows)
- [ ] T013 Write Troubleshooting and FAQ sections
- [ ] T014 Write Related Resources section (links to sibling docs)
- [ ] T015 Add TOC and ensure internal navigation works
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run DQI scoring via `validate_document.py` (target >= 75)
- [ ] T017 [P] Run HVR banned-word check
- [ ] T018 [P] Verify all 32 tools present against `tool-schemas.ts`
- [ ] T019 [P] Verify section headers match readme_template.md
- [ ] T020 [P] Verify cross-references to sibling docs resolve
- [ ] T021 Apply review fixes
- [ ] T022 Final DQI check and replace current README
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] DQI >= 75 verified
- [ ] All 32 tools documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Feature Catalog**: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- **Tool Schemas**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS: 016-rewrite-memory-mcp-readme
0/22 tasks complete — In Progress (2026-03-15)
-->
