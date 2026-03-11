---
title: "Tasks: Outsourced Agent Memory Capture"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["outsourced agent tasks", "memory handback tasks"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: Outsourced Agent Memory Capture
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
## Phase 1: Protocol Design

- [ ] T001 Research generate-context.js JSON mode — input format, `/tmp/save-context-data.json` schema (source: `scripts/memory/generate-context.ts`)
- [ ] T002 Research context template v2.2 — required fields, anchors (in system-spec-kit templates folder)
- [ ] T003 Define memory return protocol — structured output format for external agents to append to their response
- [ ] T004 Define minimum viable fields: `session_summary`, `files_modified`, `decisions`, `next_steps`, `spec_folder`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Prompt Template Updates

- [ ] T005 Design universal memory epilogue template (shared content for all cli-* skills)
- [ ] T006 [P] Add memory epilogue to cli-codex prompt templates
- [ ] T007 [P] Add memory epilogue to cli-copilot prompt templates
- [ ] T008 [P] Add memory epilogue to cli-gemini prompt templates
- [ ] T009 [P] Add memory epilogue to cli-claude-code prompt templates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: SKILL Updates

- [ ] T010 Design universal Memory Handback section for CLI SKILL files
- [ ] T011 [P] Add Memory Handback section to cli-codex SKILL
- [ ] T012 [P] Add Memory Handback section to cli-copilot SKILL
- [ ] T013 [P] Add Memory Handback section to cli-gemini SKILL
- [ ] T014 [P] Add Memory Handback section to cli-claude-code SKILL
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T015 Round-trip test: dispatch task via cli-codex with memory epilogue
- [ ] T016 Verify `generate-context.js` accepts captured output and saves to memory
- [ ] T017 Verify saved memory is searchable via `memory_search`
- [ ] T018 Test graceful degradation: agent output without structured memory section
- [ ] T019 Update spec folder documentation (spec.md status, checklist.md)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Round-trip validation passed
- [ ] All 4 cli-* SKILL files updated
- [ ] All 4 prompt templates files updated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Key utility**: generate-context.ts JSON mode (under `system-spec-kit/scripts/memory/`)
- **Context template**: context template v2.2 (under `system-spec-kit/templates/`)
- **CLI skills**: cli-codex, cli-copilot, cli-gemini, cli-claude-code (under `sk-cli/`)
<!-- /ANCHOR:cross-refs -->
