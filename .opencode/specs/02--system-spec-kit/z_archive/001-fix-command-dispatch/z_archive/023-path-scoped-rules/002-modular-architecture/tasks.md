---
title: "Tasks: Modular Validation Architecture [002-modular-architecture/tasks]"
description: "tasks document for 002-modular-architecture."
trigger_phrases:
  - "tasks"
  - "modular"
  - "validation"
  - "architecture"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Modular Validation Architecture

## Task Overview

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1 | Extract Libraries | 2 hours |
| Phase 2 | Extract Existing Rules | 2 hours |
| Phase 3 | Refactor Orchestrator | 1 hour |
| Phase 4 | Add New Rules | 3 hours |
| Phase 5 | Add Test Fixtures | 1 hour |
| Phase 6 | Documentation & Polish | 1 hour |
| **Total** | | **10 hours** |

---

## Phase 1: Extract Libraries

### Task 1.1: Create lib/common.sh
- [ ] Create `scripts/lib/` directory
- [ ] Extract color definitions (RED, GREEN, YELLOW, BLUE, BOLD, NC)
- [ ] Extract logging functions (log_pass, log_warn, log_error, log_info, log_detail)
- [ ] Add utility functions (get_script_dir, normalize_path)
- [ ] Add global result arrays (RESULTS, ERRORS, WARNINGS, INFOS)
- [ ] Test: Source file without errors

### Task 1.2: Create lib/output.sh
- [ ] Extract print_header() function
- [ ] Extract print_summary() function
- [ ] Extract generate_json() function
- [ ] Add should_output() for quiet mode logic
- [ ] Add remediation message templates
- [ ] Add QUIET_MODE variable handling
- [ ] Test: Output functions work standalone

### Task 1.3: Create lib/config.sh
- [ ] Add load_config() for .speckit.yaml parsing
- [ ] Add find_config_file() helper
- [ ] Add parse_yaml_yq() for yq-based parsing
- [ ] Add parse_yaml_fallback() for grep/awk fallback
- [ ] Add apply_env_overrides() function
- [ ] Add glob_to_regex() for pattern conversion
- [ ] Add match_path_pattern() for glob matching
- [ ] Add should_skip_path() helper
- [ ] Add get_rule_severity() helper
- [ ] Add CONFIG_* variables and defaults
- [ ] Test: Config loading with/without yq

---

## Phase 2: Extract Existing Rules

### Task 2.1: Create rules/check-files.sh
- [ ] Create `scripts/rules/` directory
- [ ] Move check_file_exists() logic
- [ ] Implement run_check() interface
- [ ] Set RULE_STATUS, RULE_MESSAGE, RULE_DETAILS, RULE_REMEDIATION
- [ ] Add rule metadata header (name, severity, description)
- [ ] Test: Rule works in isolation

### Task 2.2: Create rules/check-placeholders.sh
- [ ] Move check_placeholders() logic
- [ ] Add templates/** path skipping
- [ ] Implement run_check() interface
- [ ] Include code block filtering (awk)
- [ ] Test: Rule works in isolation

### Task 2.3: Create rules/check-sections.sh
- [ ] Move check_sections_present() logic
- [ ] Implement run_check() interface
- [ ] Add templates/** path skipping
- [ ] Test: Rule works in isolation

### Task 2.4: Create rules/check-level.sh
- [ ] Move check_level_declared() logic
- [ ] Implement run_check() interface
- [ ] Test: Rule works in isolation

---

## Phase 3: Refactor Orchestrator

### Task 3.1: Slim down validate-spec.sh
- [ ] Keep argument parsing (parse_args function)
- [ ] Keep show_help() function
- [ ] Keep detect_level() function
- [ ] Add source statements for lib/*.sh
- [ ] Add dynamic rule discovery from rules/
- [ ] Add rule execution loop
- [ ] Add result aggregation
- [ ] Remove all validation logic (now in rules/)
- [ ] Test: All existing functionality works

### Task 3.2: Verify backward compatibility
- [ ] Test: `validate-spec.sh folder/` works
- [ ] Test: `validate-spec.sh --json folder/` works
- [ ] Test: `validate-spec.sh --strict folder/` works
- [ ] Test: `validate-spec.sh --verbose folder/` works
- [ ] Test: Exit codes correct (0, 1, 2)
- [ ] Test: All 6 existing fixtures pass

---

## Phase 4: Add New Rules

### Task 4.1: Create rules/check-priority-tags.sh
- [ ] Implement P0/P1/P2 header detection regex
- [ ] Implement checklist item format validation
- [ ] Implement untagged item detection
- [ ] Set severity to "warn"
- [ ] Add remediation messages
- [ ] Test: Valid checklist passes
- [ ] Test: Invalid checklist warns

### Task 4.2: Create rules/check-evidence.sh
- [ ] Implement completed item detection (`- [x]`)
- [ ] Implement [EVIDENCE:] suffix check
- [ ] Implement P2 exemption logic
- [ ] Set severity to "warn"
- [ ] Add remediation messages
- [ ] Test: Evidenced items pass
- [ ] Test: Missing evidence warns

### Task 4.3: Create rules/check-anchors.sh
- [ ] Implement memory/*.md file scanning
- [ ] Implement anchor opening tag extraction
- [ ] Implement anchor closing tag extraction
- [ ] Implement pair matching algorithm
- [ ] Detect unclosed anchors
- [ ] Detect orphaned closing tags
- [ ] Set severity to "error"
- [ ] Add remediation messages
- [ ] Test: Valid anchors pass
- [ ] Test: Invalid anchors error

---

## Phase 5: Add Test Fixtures

### Task 5.1: Create with-templates fixture
- [ ] Create test-fixtures/with-templates/spec.md
- [ ] Create test-fixtures/with-templates/plan.md
- [ ] Create test-fixtures/with-templates/tasks.md
- [ ] Create test-fixtures/with-templates/templates/example.md (with placeholders)
- [ ] Add test case to test-validation.sh

### Task 5.2: Create priority-tags fixtures
- [ ] Create test-fixtures/valid-priority-tags/ (4 files)
- [ ] Create test-fixtures/invalid-priority-tags/ (4 files)
- [ ] Add test cases to test-validation.sh

### Task 5.3: Create evidence fixtures
- [ ] Create test-fixtures/valid-evidence/ (4 files)
- [ ] Create test-fixtures/missing-evidence/ (4 files)
- [ ] Add test cases to test-validation.sh

### Task 5.4: Create anchors fixtures
- [ ] Create test-fixtures/valid-anchors/ (4 files + memory/)
- [ ] Create test-fixtures/invalid-anchors/ (4 files + memory/)
- [ ] Add test cases to test-validation.sh

### Task 5.5: Update test runner
- [ ] Add "warn" expectation support (exit code 1)
- [ ] Update test count expectations
- [ ] Run full test suite: 13/13 pass

---

## Phase 6: Documentation & Polish

### Task 6.1: Update SKILL.md
- [ ] Add modular architecture overview
- [ ] Document all 7 validation rules
- [ ] Document lib/ components
- [ ] Document adding custom rules
- [ ] Update version number

### Task 6.2: Update README.md
- [ ] Add validation section
- [ ] Document new directory structure
- [ ] Add quick start examples
- [ ] Update script count

### Task 6.3: Integration
- [ ] Add --validate flag to check-prerequisites.sh
- [ ] Test integration works
- [ ] Update help text

### Task 6.4: Final verification
- [ ] Run validate-spec.sh on own spec folder
- [ ] Verify all checklist items complete
- [ ] Update checklist with evidence
- [ ] Create implementation-summary.md
- [ ] Save context with generate-context.js

---

## Completion Tracking

| Phase | Status | Completed |
|-------|--------|-----------|
| Phase 1 | Pending | 0/3 tasks |
| Phase 2 | Pending | 0/4 tasks |
| Phase 3 | Pending | 0/2 tasks |
| Phase 4 | Pending | 0/3 tasks |
| Phase 5 | Pending | 0/5 tasks |
| Phase 6 | Pending | 0/4 tasks |
| **Total** | **Pending** | **0/21 tasks** |
