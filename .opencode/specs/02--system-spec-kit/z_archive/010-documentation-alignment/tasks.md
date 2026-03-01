---
title: "Tasks: Documentation Alignment for Spec 126 [127-documentation-alignment/tasks]"
description: "tasks document for 127-documentation-alignment."
trigger_phrases:
  - "tasks"
  - "documentation"
  - "alignment"
  - "for"
  - "spec"
  - "127"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->

# Tasks: Documentation Alignment for Spec 126

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable |

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SPEC FOLDER CREATION

- [x] T001 Create spec folder `127-spec126-documentation-alignment/` with `memory/` directory
- [x] T002 Create `spec.md` (Level 1)
- [x] T003 Create `plan.md` and `tasks.md`

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: ROOT README.md

- [x] T004 Add "spec documents" as 5th indexing source in Memory Engine section (~L81)
- [x] T005 Add `find_spec` + `find_decision` rows to Intent-Aware Scoring table, update "5 task types" -> "7 task types" (~L314)

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: SYSTEM SPEC KIT README.md

- [x] T006 Update Key Innovations table: "5 intent types" -> "7"; add Document-Type Scoring row (~L75)
- [x] T007 Update `memory_index_scan` tool entry: add `includeSpecDocs` parameter (~L385)
- [x] T008 Rename "4-Source Indexing Pipeline" -> "5-Source Indexing Pipeline", add spec documents row (~L490)
- [x] T009 Add Spec 126 entry to Recent Changes section (~L783)

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## PHASE 4: MCP SERVER README.md

- [x] T010 Update Key Innovations table: "4-Source Pipeline" -> "5-Source Pipeline"; add Document-Type Scoring row (~L81)
- [x] T011 Update `memory_index_scan` params: add `includeSpecDocs` parameter row + spec documents source row (~L263)
- [x] T012 Add `find_spec` + `find_decision` to Intent-Aware Retrieval table (5 -> 7 intents) (~L524)
- [x] T013 Add `SPECKIT_INDEX_SPEC_DOCS` to Feature Flags table (~L893)
- [x] T014 Note schema v13 columns (`document_type`, `spec_level`) in Database Schema section (~L920)
- [x] T015 Update `intent-classifier.ts` comment from "5 intent types" to "7 intent types" in Structure section (~L716)

<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## PHASE 5: SKILL.md

- [x] T016 Bump version header from `2.2.8.0` to `2.2.9.0`
- [x] T017 Add spec document indexing to `memory_index_scan` / README Content Discovery description (~L141)
- [x] T018 Add document-type scoring bullet (11 types, multipliers) to Key Concepts (~L507)

<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:phase-6 -->
## PHASE 6: REFERENCE FILES

- [x] T019 `memory_system.md`: Add spec documents as 5th source in Indexable Content Sources table (~L33)
- [x] T020 `memory_system.md`: Add `includeSpecDocs` to `memory_index_scan()` params (~L128)
- [x] T021 `memory_system.md`: Note `find_spec` + `find_decision` in intent reference
- [x] T022 `readme_indexing.md`: Update "4-Source" -> "5-Source" pipeline, add spec documents row (~L45)
- [x] T023 `save_workflow.md`: Add spec documents row to Other Indexed Content table (~L323)

<!-- /ANCHOR:phase-6 -->

<!-- ANCHOR:phase-7 -->
## PHASE 7: CHANGELOGS

- [x] T024 Create `.opencode/changelog/01--system-spec-kit/v2.2.17.0.md`
- [x] T025 Create `.opencode/changelog/00--opencode-environment/v2.0.5.0.md`

<!-- /ANCHOR:phase-7 -->

<!-- ANCHOR:phase-8 -->
## PHASE 8: POST-IMPLEMENTATION

- [x] T026 Create `implementation-summary.md` with all files changed and verification results

<!-- /ANCHOR:phase-8 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] Grep sweep: zero stale "4-source" or "5 intent" references in modified docs
- [x] No broken ANCHOR tags
- [x] Cross-reference consistency: all READMEs use 7 intents, 5 sources, 11 document types

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
