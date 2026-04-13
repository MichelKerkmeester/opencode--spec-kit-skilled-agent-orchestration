---
title: "Tasks: Graph Metadata Enrichment"
description: "Task breakdown for enriching all 20 per-skill graph-metadata.json files."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "metadata enrichment tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T22:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created tasks"
    next_safe_action: "Design enriched schema"
    key_files: ["tasks.md"]
---
# Tasks: Graph Metadata Enrichment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

---

## Phase 1: Schema Design

- [ ] T001 Design enriched v2 schema with `derived` block (trigger_phrases, key_topics, key_files, entities, causal_summary, source_docs, timestamps)
- [ ] T002 Document backwards-compatibility rules (v1 files still pass validation)
- [ ] T003 Update `skill_graph_compiler.py` validation to accept both v1 and v2 schemas

---

## Phase 2: Enrich All 20 Skills

### CLI Family (4 files)
- [P] T004 Enrich `cli-claude-code/graph-metadata.json` with derived block
- [P] T005 Enrich `cli-codex/graph-metadata.json` with derived block
- [P] T006 Enrich `cli-copilot/graph-metadata.json` with derived block
- [P] T007 Enrich `cli-gemini/graph-metadata.json` with derived block

### MCP Family (5 files)
- [P] T008 Enrich `mcp-chrome-devtools/graph-metadata.json` with derived block
- [P] T009 Enrich `mcp-clickup/graph-metadata.json` with derived block
- [P] T010 Enrich `mcp-coco-index/graph-metadata.json` with derived block
- [P] T011 Enrich `mcp-code-mode/graph-metadata.json` with derived block
- [P] T012 Enrich `mcp-figma/graph-metadata.json` with derived block

### Code Quality Family (4 files)
- [P] T013 Enrich `sk-code-full-stack/graph-metadata.json` with derived block
- [P] T014 Enrich `sk-code-opencode/graph-metadata.json` with derived block
- [P] T015 Enrich `sk-code-review/graph-metadata.json` with derived block
- [P] T016 Enrich `sk-code-web/graph-metadata.json` with derived block

### Deep/Util Family (4 files)
- [P] T017 Enrich `sk-deep-research/graph-metadata.json` with derived block
- [P] T018 Enrich `sk-deep-review/graph-metadata.json` with derived block
- [P] T019 Enrich `sk-improve-agent/graph-metadata.json` with derived block
- [P] T020 Enrich `sk-improve-prompt/graph-metadata.json` with derived block

### Doc/Git/System Family (3 files)
- [P] T021 Enrich `sk-doc/graph-metadata.json` with derived block
- [P] T022 Enrich `sk-git/graph-metadata.json` with derived block
- [P] T023 Enrich `system-spec-kit/graph-metadata.json` with derived block

---

## Phase 3: Compiler & Verification

- [ ] T024 Regenerate `skill-graph.json` with enriched metadata
- [ ] T025 Verify compiled output under 8KB size target
- [ ] T026 Run regression suite — 44/44 pass required
- [ ] T027 Verify all `key_files` paths exist on disk (no phantom references)
- [ ] T028 Run `--validate-only` — zero errors

---

## Phase 4: Documentation

- [ ] T029 Update compiler README/comments for v2 schema
- [ ] T030 Write implementation-summary.md
