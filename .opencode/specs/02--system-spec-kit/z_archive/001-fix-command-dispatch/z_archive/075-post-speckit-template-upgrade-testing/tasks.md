---
title: "Tasks: Post-SpecKit Template Upgrade Testing [075-post-speckit-template-upgrade-testing/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "post"
  - "speckit"
  - "template"
  - "upgrade"
  - "075"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Post-SpecKit Template Upgrade Testing

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

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Template System Tests

**Objective**: Verify CORE+ADDENDUM v2.0 template composition and file requirements

- [ ] T001 [P] Verify Level 1 core templates exist (`templates/core/`)
- [ ] T002 [P] Verify Level 2 addendum templates exist (`templates/addendum/level_2/`)
- [ ] T003 [P] Verify Level 3 addendum templates exist (`templates/addendum/level_3/`)
- [ ] T004 [P] Verify Level 3+ addendum templates exist (`templates/addendum/level_3+/`)
- [ ] T005 Verify composed Level 1 templates generated correctly (`templates/level_1/`)
- [ ] T006 Verify composed Level 2 templates generated correctly (`templates/level_2/`)
- [ ] T007 Verify composed Level 3 templates generated correctly (`templates/level_3/`)
- [ ] T008 Verify composed Level 3+ templates generated correctly (`templates/level_3+/`)
- [ ] T009 Test compose.sh script with all level combinations (`scripts/compose.sh`)
- [ ] T010 Validate SPECKIT_TEMPLATE_SOURCE headers in all templates
- [ ] T011 Validate SPECKIT_LEVEL headers match folder locations
- [ ] T012 Test placeholder pattern detection (CORE expects no `[PLACEHOLDER]` patterns)
- [ ] T013 Test addendum injection points (<!-- ADDENDUM: markers)
- [ ] T014 Verify Level 1 file requirements: spec.md, plan.md, tasks.md, implementation-summary.md
- [ ] T015 Verify Level 2 adds: checklist.md
- [ ] T016 Verify Level 3 adds: decision-record.md, optional research.md
- [ ] T017 Verify Level 3+ adds: AI protocols, extended checklist, sign-offs

---

## Phase 2: Validation Rule Tests

**Objective**: Verify all 13 validation rules function correctly against 52 test fixtures

- [ ] T018 Run test-validation.sh full suite (`scripts/test-validation.sh`)
- [ ] T019 [P] Test rule check-spec-exists.sh with valid/invalid fixtures
- [ ] T020 [P] Test rule check-plan-exists.sh with valid/invalid fixtures
- [ ] T021 [P] Test rule check-tasks-exists.sh with valid/invalid fixtures
- [ ] T022 [P] Test rule check-checklist-level.sh (Level 2+ requirement)
- [ ] T023 [P] Test rule check-decision-record-level.sh (Level 3+ requirement)
- [ ] T024 [P] Test rule check-placeholders.sh (unfilled placeholder detection)
- [ ] T025 [P] Test rule check-spec-metadata.sh (required metadata fields)
- [ ] T026 [P] Test rule check-cross-references.sh (file link validation)
- [ ] T027 [P] Test rule check-scope-section.sh (scope documentation)
- [ ] T028 [P] Test rule check-requirements-format.sh (P0/P1/P2 format)
- [ ] T029 [P] Test rule check-template-headers.sh (SPECKIT headers)
- [ ] T030 [P] Test rule check-file-structure.sh (folder organization)
- [ ] T031 [P] Test rule check-memory-format.sh (memory file validation)
- [ ] T032 Verify exit code 0 = pass for valid fixtures
- [ ] T033 Verify exit code 1 = warnings for minor issues
- [ ] T034 Verify exit code 2 = errors for must-fix issues
- [ ] T035 Test JSON output mode (`--format json`)
- [ ] T036 Test verbose output mode (`-v` flag)
- [ ] T037 Test quiet output mode (`-q` flag)
- [ ] T038 Test single-file validation mode
- [ ] T039 Test directory validation mode (recursive)

---

## Phase 3: MCP Tool Tests

**Objective**: Verify all 14 MCP tools in spec_kit_memory server function correctly

### Memory Search Tools

- [ ] T040 Test memory_search with text query (`query: "implementation pattern"`)
- [ ] T041 Test memory_search with concepts array (`concepts: ["template", "validation"]`)
- [ ] T042 Test memory_search with anchors (`anchors: ["summary", "decisions"]`)
- [ ] T043 Test memory_search with specFolder filter (`specFolder: "specs/075-..."`)
- [ ] T044 Test memory_search with includeContent flag
- [ ] T045 Test memory_search with limit parameter
- [ ] T046 Test memory_search empty results handling
- [ ] T047 Test memory_search relevance scoring

### Cognitive Features

- [ ] T048 Test memory_match_triggers with implementation prompt
- [ ] T049 Test memory_match_triggers with research prompt
- [ ] T050 Test memory_match_triggers with debugging prompt
- [ ] T051 Test memory_match_triggers with continuation pattern
- [ ] T052 Verify trigger confidence thresholds (0.7+ for match)
- [ ] T053 Test cognitive memory retrieval suggestions

### Memory Persistence Tools

- [ ] T054 Test memory_save with manual content input
- [ ] T055 Test memory_save with spec folder extraction
- [ ] T056 Test memory_save with importance scoring (1-6 scale)
- [ ] T057 Test memory_save anchor assignment
- [ ] T058 Test memory_index_scan for database health
- [ ] T059 Test memory_index_scan tier distribution report

### Checkpoint Tools

- [ ] T060 Test checkpoint_create with name and description
- [ ] T061 Test checkpoint_create with spec folder association
- [ ] T062 Test checkpoint_list with date range filter
- [ ] T063 Test checkpoint_list with spec folder filter
- [ ] T064 Test checkpoint_restore by ID
- [ ] T065 Test checkpoint_restore preserves memory state
- [ ] T066 Test checkpoint_delete by ID
- [ ] T067 Test checkpoint_delete cascade handling

### Memory CRUD Operations

- [ ] T068 Test memory_create with all required fields
- [ ] T069 Test memory_read by ID
- [ ] T070 Test memory_update content modification
- [ ] T071 Test memory_update anchor reassignment
- [ ] T072 Test memory_delete by ID
- [ ] T073 Test memory_delete with referenced content warning

### Health and Stats Tools

- [ ] T074 Test memory_health SQLite database connectivity
- [ ] T075 Test memory_health index integrity check
- [ ] T076 Test memory_health embedding status
- [ ] T077 Test memory_stats total memory count
- [ ] T078 Test memory_stats tier distribution
- [ ] T079 Test memory_stats storage size
- [ ] T080 Test memory_stats by folder breakdown

---

## Phase 4: Script Module Tests

**Objective**: Verify all 44 JavaScript modules and 17 shell scripts

### generate-context.js (Primary Entry Point)

- [ ] T081 Test JSON input mode (`node generate-context.js /tmp/data.json`)
- [ ] T082 Test folder input mode (`node generate-context.js specs/075-...`)
- [ ] T083 Test missing folder error handling
- [ ] T084 Test invalid JSON error handling
- [ ] T085 Test output file generation in memory/ subfolder
- [ ] T086 Test ANCHOR format in generated files
- [ ] T087 Test metadata extraction accuracy
- [ ] T088 Test auto-indexing trigger after save

### Extractors Module (`scripts/extractors/`)

- [ ] T089 [P] Test spec-extractor.js metadata parsing
- [ ] T090 [P] Test spec-extractor.js requirements extraction
- [ ] T091 [P] Test plan-extractor.js phase parsing
- [ ] T092 [P] Test plan-extractor.js dependency extraction
- [ ] T093 [P] Test tasks-extractor.js task status parsing
- [ ] T094 [P] Test tasks-extractor.js completion percentage
- [ ] T095 [P] Test checklist-extractor.js P0/P1/P2 categorization
- [ ] T096 [P] Test checklist-extractor.js blocker detection
- [ ] T097 [P] Test decision-extractor.js ADR parsing
- [ ] T098 [P] Test memory-extractor.js anchor identification

### Utils Module (`scripts/utils/`)

- [ ] T099 [P] Test input-normalizer.js path resolution
- [ ] T100 [P] Test input-normalizer.js JSON parsing
- [ ] T101 [P] Test output-formatter.js markdown generation
- [ ] T102 [P] Test output-formatter.js JSON export
- [ ] T103 [P] Test file-utils.js directory traversal
- [ ] T104 [P] Test file-utils.js file existence checks
- [ ] T105 [P] Test string-utils.js text truncation
- [ ] T106 [P] Test string-utils.js anchor detection

### Lib Module (`scripts/lib/`)

- [ ] T107 [P] Test embedding-client.js vector generation
- [ ] T108 [P] Test embedding-client.js batch processing
- [ ] T109 [P] Test sqlite-client.js connection pooling
- [ ] T110 [P] Test sqlite-client.js query execution
- [ ] T111 [P] Test sqlite-client.js transaction handling
- [ ] T112 [P] Test index-manager.js index creation
- [ ] T113 [P] Test index-manager.js index updates
- [ ] T114 [P] Test search-engine.js similarity search
- [ ] T115 [P] Test search-engine.js result ranking

### Spec Folder Module (`scripts/spec-folder/`)

- [ ] T116 [P] Test folder-validator.js level detection
- [ ] T117 [P] Test folder-validator.js file requirement checks
- [ ] T118 [P] Test folder-scanner.js recursive traversal
- [ ] T119 [P] Test folder-scanner.js gitignore respect
- [ ] T120 [P] Test context-builder.js aggregation
- [ ] T121 [P] Test context-builder.js summary generation

### Shell Scripts (`scripts/`)

- [ ] T122 [P] Test validate.sh single-spec validation
- [ ] T123 [P] Test validate.sh directory validation
- [ ] T124 [P] Test compose.sh template assembly
- [ ] T125 [P] Test compose.sh addendum injection
- [ ] T126 [P] Test create.sh spec folder scaffolding
- [ ] T127 [P] Test create.sh level selection
- [ ] T128 [P] Test check-*.sh individual rule execution

---

## Phase 5: Integration Tests

**Objective**: Verify end-to-end workflows across all system components

### End-to-End Memory Save Workflow

- [ ] T129 Create test spec folder with all required files
- [ ] T130 Run generate-context.js on test folder
- [ ] T131 Verify memory file created in memory/ subfolder
- [ ] T132 Verify ANCHOR markers present in output
- [ ] T133 Query memory_search for newly saved content
- [ ] T134 Verify search returns saved memory with correct metadata
- [ ] T135 Create checkpoint of current state
- [ ] T136 Modify memory content
- [ ] T137 Restore checkpoint and verify original state

### Full Validation Pipeline

- [ ] T138 Create intentionally invalid spec folder (missing files)
- [ ] T139 Run validate.sh and verify exit code 2
- [ ] T140 Create spec folder with warnings only
- [ ] T141 Run validate.sh and verify exit code 1
- [ ] T142 Create fully valid spec folder
- [ ] T143 Run validate.sh and verify exit code 0
- [ ] T144 Test validation with JSON output format
- [ ] T145 Verify JSON contains all rule results

### Cognitive Memory Session Flow

- [ ] T146 Start new session with trigger-matching prompt
- [ ] T147 Verify memory_match_triggers returns relevant suggestions
- [ ] T148 Load suggested memories via memory_search
- [ ] T149 Perform implementation work
- [ ] T150 Save session context via generate-context.js
- [ ] T151 Verify cognitive anchors assigned correctly
- [ ] T152 Start continuation session with handoff prompt
- [ ] T153 Verify continuation pattern detected
- [ ] T154 Verify prior session context retrieved
- [ ] T155 Complete workflow cycle test

---

## Phase 6: Regression Tests

**Objective**: Ensure v1.9.0 changes did not break existing functionality

- [ ] T156 [P] Run all 52 validation fixtures from pre-upgrade baseline
- [ ] T157 [P] Compare fixture results with expected outcomes
- [ ] T158 [P] Test backward compatibility with v1.8.0 spec folders
- [ ] T159 [P] Verify memory database schema unchanged
- [ ] T160 [P] Test existing saved memories still retrievable
- [ ] T161 [P] Verify checkpoint restore from pre-upgrade saves
- [ ] T162 Document any behavioral changes from upgrade

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 6 phases complete with evidence
- [ ] Regression tests pass (Phase 6)
- [ ] Integration tests pass (Phase 5)
- [ ] Manual verification completed for critical paths

---

## Test Evidence Requirements

| Phase | Evidence Required |
|-------|-------------------|
| Phase 1 | Template file listings, compose.sh output logs |
| Phase 2 | Validation exit codes, JSON output samples |
| Phase 3 | MCP tool response samples, query results |
| Phase 4 | Module unit test outputs, script execution logs |
| Phase 5 | End-to-end workflow screenshots, database queries |
| Phase 6 | Regression comparison report, diff outputs |

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

---

## Task Dependencies

```
Phase 1 (Templates) ──────┐
                          ├──► Phase 5 (Integration)
Phase 2 (Validation) ─────┤
                          │
Phase 3 (MCP Tools) ──────┤
                          │
Phase 4 (Scripts) ────────┘
                          │
                          ▼
                    Phase 6 (Regression)
```

| Task Range | Depends On | Blocks |
|------------|------------|--------|
| T001-T017 | None | T129-T155 |
| T018-T039 | None | T138-T145, T156-T162 |
| T040-T080 | None | T129-T155 |
| T081-T128 | None | T129-T155 |
| T129-T155 | T001-T128 | T156-T162 |
| T156-T162 | T129-T155 | None |

---

## Agent Assignment (Multi-Agent Execution)

| Agent | Task Range | Focus Area |
|-------|------------|------------|
| Test-Agent-1 | T001-T017 | Template System |
| Test-Agent-2 | T018-T039 | Validation Rules |
| Test-Agent-3 | T040-T080 | MCP Tools |
| Test-Agent-4 | T081-T128 | Script Modules |
| Test-Agent-5 | T129-T155 | Integration Tests |
| Test-Agent-6 | T156-T162 | Regression Tests |

---

## Task Statistics

| Phase | Total Tasks | Completed | Pending | Blocked |
|-------|-------------|-----------|---------|---------|
| Phase 1: Template System | 17 | 0 | 17 | 0 |
| Phase 2: Validation Rules | 22 | 0 | 22 | 0 |
| Phase 3: MCP Tools | 41 | 0 | 41 | 0 |
| Phase 4: Script Modules | 48 | 0 | 48 | 0 |
| Phase 5: Integration | 27 | 0 | 27 | 0 |
| Phase 6: Regression | 7 | 0 | 7 | 0 |
| **Total** | **162** | **0** | **162** | **0** |

---

<!--
LEVEL 3+ TASKS - Enterprise Governance
- 162 total test tasks across 6 phases
- Parallel execution markers [P] for efficiency
- Agent assignment matrix for multi-agent dispatch
- Dependency graph for execution ordering
- Evidence requirements per phase
-->
