---
title: "Tasks: Document Specialist Refactor [001-doc-specialist-refactor/tasks]"
description: "tasks document for 001-doc-specialist-refactor."
trigger_phrases:
  - "tasks"
  - "document"
  - "specialist"
  - "refactor"
  - "015"
  - "doc"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks: Document Specialist Refactor

> Task breakdown for script-assisted AI analysis implementation.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Build extract_structure.py

### Task 1.1: Create script skeleton
- [x] Create `.opencode/skills/create-documentation/scripts/extract_structure.py`
- [x] Add shebang and module docstring
- [x] Import required modules (json, re, sys, pathlib)
- [x] Create main() function with argument parsing

### Task 1.2: Implement frontmatter parser
- [x] Extract YAML between `---` markers
- [x] Parse key-value pairs into dict
- [x] Detect multiline description issue
- [x] Detect invalid allowed-tools format
- [x] Return parsed dict and issues list

### Task 1.3: Implement markdown parser
- [x] Extract all headings (level, text, line number)
- [x] Detect heading format (emoji presence, number prefix)
- [x] Extract sections (content between headings)
- [x] Extract code blocks (language, line numbers, preview)

### Task 1.4: Implement metrics calculator
- [x] Calculate total word count
- [x] Calculate total line count
- [x] Count headings and max depth
- [x] Count code blocks
- [x] Count sections with code

### Task 1.5: Implement document type detector
- [x] Detect "skill" from SKILL.md filename
- [x] Detect "readme" from README.md filename
- [x] Detect "command" from /commands/ path
- [x] Detect "spec" from /specs/ path
- [x] Detect "reference" from /references/ path
- [x] Default to "generic"

### Task 1.6: Implement checklist runner
- [x] Define SKILL.md checklist (12 checks)
- [x] Define README.md checklist (4 checks)
- [x] Define command file checklist (3 checks)
- [x] Run appropriate checklist based on type
- [x] Calculate pass/fail counts and pass rate

### Task 1.7: Implement question generator
- [x] Define SKILL.md questions (6 questions)
- [x] Define README.md questions (5 questions)
- [x] Map questions to target sections
- [x] Assign importance levels

### Task 1.8: Assemble JSON output
- [x] Combine all components into output schema
- [x] Output valid JSON to stdout
- [x] Handle errors gracefully

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Enhance quick_validate.py

### Task 2.1: Add multiline description detection
- [x] Add regex to detect `description:\n` pattern
- [x] Return specific error message

### Task 2.2: Add allowed-tools format validation
- [x] Check if value starts with `[` (inline array)
- [x] Check if value starts with `\n` (YAML list)
- [x] Reject comma-separated strings without brackets

### Task 2.3: Add JSON output option
- [x] Check for `--json` flag in sys.argv
- [x] Output JSON format when flag present
- [x] Keep human-readable format as default

### Task 2.4: Add TODO placeholder detection
- [x] Check if description contains "TODO"
- [x] Return warning (not error)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Update CLI wrapper

### Task 3.1: Add extract subcommand
- [x] Add `extract)` case to CLI
- [x] Route to extract_structure.py
- [x] Pass remaining arguments

### Task 3.2: Remove --phase handling
- [x] Delete `--phase)` case entirely
- [x] Remove phase-related variables
- [x] Remove phase-related help text

### Task 3.3: Update help text
- [x] Document `extract` command
- [x] Document `validate` command
- [x] Document `init` command
- [x] Document `package` command
- [x] Remove obsolete options

### Task 3.4: Update default behavior
- [x] Route .md files to extract by default
- [x] Show help for other inputs

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Update SKILL.md

### Task 4.1: Add Script-Assisted Analysis Workflow section
- [x] Document 6-step analysis workflow
- [x] Include extraction command
- [x] Include AI evaluation steps
- [x] Include report format

### Task 4.2: Update SMART ROUTING
- [x] Add analyze_document routing
- [x] Keep create_skill routing
- [x] Keep package_skill routing
- [x] Keep validate_skill routing

### Task 4.3: Remove fake features
- [x] Remove c7score calculation references
- [x] Remove triple dimension scoring claims
- [x] Remove phase-based pipeline descriptions
- [x] Update any outdated examples

### Task 4.4: Add JSON output example
- [x] Show sample extraction output
- [x] Explain each JSON field
- [x] Show how AI uses the output

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Update reference docs

### Task 5.1: Update workflows.md
- [x] Replace phase descriptions with script-assisted workflow
- [x] Add JSON output examples
- [x] Document AI evaluation process

### Task 5.2: Update validation.md
- [x] Document checklist IDs from extract_structure.py
- [x] Document each check and criteria
- [x] Remove fake scoring claims

### Task 5.3: Update quick_reference.md
- [x] Update command list
- [x] Add `extract` command
- [x] Remove `--phase` references

### Task 5.4: Update skill_creation.md
- [x] Update CLI examples
- [x] Remove analyze_docs.py references
- [x] Add extract_structure.py usage

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Delete old script

### Task 6.1: Delete analyze_docs.py
- [x] Remove `.opencode/skills/create-documentation/scripts/analyze_docs.py`

### Task 6.2: Clean up references
- [x] Search for analyze_docs.py references
- [x] Remove from SKILL.md
- [x] Remove from reference docs
- [x] Remove from CLI wrapper

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Honesty Pass (Added 2024-12-14)

### Task 7.1: Remove numeric scoring language
- [x] Replace "90+/85+/80+" targets with qualitative levels
- [x] Replace "+X pts/points" impact with High/Medium/Low
- [x] Replace "Quality Score Thresholds (90-100, 80-89...)" with qualitative rubric
- [x] Update optimization.md transformation patterns

### Task 7.2: Remove pipeline mode language
- [x] Replace "Full Pipeline" with "Script-assisted review"
- [x] Replace "Validation Only" with "Structure checks"
- [x] Replace "Optimization Only" with "Content optimization"
- [x] Update workflows.md mode table

### Task 7.3: Rename score to pass_rate
- [x] Update extract_structure.py output field
- [x] Update spec.md JSON examples
- [x] Update tasks.md reference

### Task 7.4: Create negative test fixtures
- [x] Create bad-multiline/SKILL.md (multiline description)
- [x] Create bad-tools/SKILL.md (invalid allowed-tools format)
- [x] Verify both fail validation with correct errors

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: extract_structure.py | 8 | Complete |
| Phase 2: quick_validate.py | 4 | Complete |
| Phase 3: CLI wrapper | 4 | Complete |
| Phase 4: SKILL.md | 4 | Complete |
| Phase 5: Reference docs | 4 | Complete |
| Phase 6: Delete old script | 2 | Complete |
| Phase 7: Honesty pass | 4 | Complete |
| **Total** | **30** | **Complete** |

<!-- /ANCHOR:completion -->
