---
title: "Tasks: Rewrite Memory MCP README [02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/tasks]"
description: "Task breakdown for complete rewrite of the MCP server README covering all 33 tools in simple-terms voice."
trigger_phrases:
  - "tasks"
  - "rewrite"
  - "memory"
  - "mcp"
  - "readme"
  - "016"
importance_tier: "normal"
contextType: "implementation"
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

- [x] T001 Research: extract 33 tool definitions, map feature categories, catalog architecture details (`scratch/research-brief.md`)
- [x] T002 Back up current README to `README.md.bak`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write frontmatter, title, tagline, and table of contents
- [x] T004 Write section 1: OVERVIEW (what, stats, comparison, requirements)
- [x] T005 Write section 2: QUICK START (setup, verify, first save/search)
- [x] T006 Write section 3: STRUCTURE (directory tree, key files, 7-layer table)
- [x] T007 Write section 4.1: How the Memory System Works (narrative, simple terms)
- [x] T008 Write section 4.2: Tool Reference (all 33 tools by layer with parameters)
- [x] T009 Write section 5: CONFIGURATION (providers, flags, schema)
- [x] T010 Write section 6: USAGE EXAMPLES (7 examples + patterns)
- [x] T011 Write section 7: TROUBLESHOOTING (issues, fixes, diagnostics)
- [x] T012 Write section 8: FAQ (10 Q&A entries)
- [x] T013 Write section 9: RELATED DOCUMENTS (internal + external links) and footer
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify all 33 tools present against `tool-schemas.ts` [EVIDENCE: 33/33 tools confirmed via grep]
- [x] T015 [P] Verify section headers match readme_template.md structure [EVIDENCE: 9/9 sections exact match]
- [x] T016 [P] Verify cross-references to sibling docs resolve [EVIDENCE: 9/9 links verified]
- [x] T017 Apply any fixes found [EVIDENCE: no fixes needed, all checks passed]
- [x] T018 Replace current README with rewritten version [EVIDENCE: README.md.bak created, new README written]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 33 tools documented with parameters and layer annotations
- [x] Simple-terms voice used throughout narrative sections
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Feature Catalog**: `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md`
- **Simple Terms Catalog**: `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md`
- **Tool Schemas**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Shared Memory Guide**: `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS: 016-rewrite-memory-mcp-readme
18/18 tasks complete — In Progress (2026-03-25)
-->
