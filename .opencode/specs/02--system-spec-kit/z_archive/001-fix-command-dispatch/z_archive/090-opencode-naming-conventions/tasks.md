---
title: "Tasks: OpenCode Naming Convention Alignment [090-opencode-naming-conventions/tasks]"
description: "tasks document for 090-opencode-naming-conventions."
trigger_phrases:
  - "tasks"
  - "opencode"
  - "naming"
  - "convention"
  - "alignment"
  - "090"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: OpenCode Naming Convention Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Phase 1: Spec Folder Setup

- [x] T001 Create spec folder structure (090-opencode-naming-conventions/)
- [x] T002 Create spec.md, plan.md, tasks.md, checklist.md, decision-record.md

---

## Phase 2: Skill Documentation (Part A)

- [ ] T010 [P] Update SKILL.md - naming matrix and routing rules
- [ ] T011 [P] Update references/javascript/style_guide.md - camelCase examples
- [ ] T012 [P] Update references/javascript/quality_standards.md - export patterns
- [ ] T013 [P] Update references/javascript/quick_reference.md - file template
- [ ] T014 [P] Update references/shared/universal_patterns.md - JS examples
- [ ] T015 [P] Update references/shared/code_organization.md - export pattern
- [ ] T016 [P] Update assets/checklists/javascript_checklist.md - P0 camelCase
- [ ] T017 [P] Update assets/checklists/universal_checklist.md - alignment
- [ ] T018 [P] Update CHANGELOG.md - v1.1.0 entry

---

## Phase 3: JS Migration (Part B)

- [ ] T020 [P] W:1 Migrate mcp_server/handlers/ (~10 files)
- [ ] T021 [P] W:2 Migrate mcp_server/core/ + mcp_server/shared/ (~15 files)
- [ ] T022 [P] W:3 Migrate mcp_server/lib/search/ (~8 files)
- [ ] T023 [P] W:4 Migrate mcp_server/lib/ other subdirs (~10 files)
- [ ] T024 [P] W:5 Migrate mcp_server/formatters/ (~5 files)
- [ ] T025 [P] W:6 Migrate scripts/core/ + scripts/extractors/ (11 files)
- [ ] T026 [P] W:7 Migrate scripts/lib/ + scripts/utils/ (20 files)
- [ ] T027 [P] W:8 Migrate scripts/memory/ + scripts/loaders/ + scripts/renderers/ (7 files)
- [ ] T028 [P] W:9 Migrate scripts/spec-folder/ + scripts/tests/ (15 files)
- [ ] T029 [P] W:10 Migrate remaining (config/, install/, standalone scripts) (~10 files)

---

## Phase 4: Cross-Reference Sweep

- [ ] T030 [B] Fix cross-directory import mismatches (blocked on T020-T029)

---

## Phase 5: Verification

- [ ] T040 [B] MCP server startup test (blocked on T030)
- [ ] T041 [B] Grep for orphaned snake_case function calls
- [ ] T042 [B] Grep for undefined camelCase references
- [ ] T043 [B] Run any existing tests

---

## Phase 6: Completion

- [ ] T050 [B] Create implementation-summary.md
- [ ] T051 [B] Verify checklist.md - all items marked
- [ ] T052 [B] Save memory context

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] MCP server starts successfully
- [ ] Zero orphaned snake_case function calls
