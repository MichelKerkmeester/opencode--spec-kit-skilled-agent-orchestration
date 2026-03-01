---
title: "Implementation Plan: Modular Validation Architecture [002-modular-architecture/plan]"
description: ".opencode/skill/system-spec-kit/scripts/"
trigger_phrases:
  - "implementation"
  - "plan"
  - "modular"
  - "validation"
  - "architecture"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Modular Validation Architecture

## Technical Context

### Current State
- `validate-spec.sh` is a monolithic ~600 line script
- 4 validation rules implemented (FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, LEVEL_DECLARED)
- 6 test fixtures, all passing
- MVP complete at 72%

### Target State
- Modular architecture with orchestrator + libs + rules
- 7 validation rules (3 new: PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID)
- 13 test fixtures (7 new)
- Full feature complete at 100%

## Architecture

### Directory Structure

```
.opencode/skill/system-spec-kit/scripts/
├── validate-spec.sh              # Orchestrator
├── lib/
│   ├── common.sh                 # Shared utilities
│   ├── config.sh                 # Configuration loading
│   └── output.sh                 # Output formatting
├── rules/
│   ├── check-files.sh            # FILE_EXISTS
│   ├── check-placeholders.sh     # PLACEHOLDER_FILLED
│   ├── check-sections.sh         # SECTIONS_PRESENT
│   ├── check-level.sh            # LEVEL_DECLARED
│   ├── check-priority-tags.sh    # PRIORITY_TAGS (new)
│   ├── check-evidence.sh         # EVIDENCE_CITED (new)
│   └── check-anchors.sh          # ANCHORS_VALID (new)
├── test-fixtures/
│   ├── valid-level1/
│   ├── valid-level2/
│   ├── valid-level3/
│   ├── with-scratch/
│   ├── with-templates/           # (new)
│   ├── missing-required-files/
│   ├── unfilled-placeholders/
│   ├── valid-priority-tags/      # (new)
│   ├── invalid-priority-tags/    # (new)
│   ├── valid-evidence/           # (new)
│   ├── missing-evidence/         # (new)
│   ├── valid-anchors/            # (new)
│   └── invalid-anchors/          # (new)
└── test-validation.sh            # Test runner
```

### Component Responsibilities

| Component | Responsibility | Max Lines |
|-----------|---------------|-----------|
| `validate-spec.sh` | Parse args, load config, run rules, aggregate results, output | 200 |
| `lib/common.sh` | Colors, logging functions, path utilities, shared constants | 100 |
| `lib/config.sh` | .speckit.yaml parsing, env var handling, glob pattern matching | 150 |
| `lib/output.sh` | Text formatting, JSON generation, quiet mode, remediation | 120 |
| `rules/check-*.sh` | Individual validation logic, each implements `run_check()` | 100 each |

### Rule Interface

Each rule script must implement:

```bash
#!/bin/bash
# Rule: RULE_NAME
# Severity: error|warn|info
# Description: What this rule checks

# Dependencies
source "${LIB_DIR}/common.sh"

# Run the check
# Args: $1 = folder path, $2 = detected level
# Sets: RULE_STATUS (pass|warn|fail), RULE_MESSAGE, RULE_DETAILS[], RULE_REMEDIATION
run_check() {
    local folder="$1"
    local level="$2"
    
    # ... validation logic ...
    
    RULE_STATUS="pass"
    RULE_MESSAGE="All checks passed"
    RULE_DETAILS=()
    RULE_REMEDIATION=""
}
```

## Implementation Phases

### Phase 1: Extract Libraries (Day 1)

**Goal:** Create lib/ directory with shared functions

1. Create `lib/common.sh`
   - Extract: Color definitions, BOLD/NC constants
   - Extract: `log_pass()`, `log_warn()`, `log_error()`, `log_info()`, `log_detail()`
   - Add: `get_script_dir()`, `normalize_path()`

2. Create `lib/output.sh`
   - Extract: `print_header()`, `print_summary()`
   - Extract: `generate_json()`
   - Add: `should_output()` for quiet mode
   - Add: Remediation message templates

3. Create `lib/config.sh`
   - Add: `load_config()` for .speckit.yaml
   - Add: `apply_env_overrides()`
   - Add: `glob_to_regex()`, `match_path_pattern()`
   - Add: `should_skip_path()`, `get_rule_severity()`

### Phase 2: Extract Existing Rules (Day 1-2)

**Goal:** Move current validation logic to rules/

1. Create `rules/check-files.sh`
   - Move: `check_file_exists()` logic
   - Add: `run_check()` interface

2. Create `rules/check-placeholders.sh`
   - Move: `check_placeholders()` logic
   - Add: Templates path skipping
   - Add: `run_check()` interface

3. Create `rules/check-sections.sh`
   - Move: `check_sections_present()` logic
   - Add: `run_check()` interface

4. Create `rules/check-level.sh`
   - Move: `check_level_declared()` logic
   - Add: `run_check()` interface

### Phase 3: Refactor Orchestrator (Day 2)

**Goal:** Slim down validate-spec.sh to orchestrator role

1. Update `validate-spec.sh`
   - Keep: Argument parsing, `show_help()`
   - Keep: `detect_level()` (or move to lib/)
   - Add: Source lib/*.sh files
   - Add: Dynamic rule loading from rules/
   - Add: Result aggregation
   - Remove: All validation logic (now in rules/)

2. Verify backward compatibility
   - All existing command-line options work
   - Exit codes unchanged
   - Output format unchanged

### Phase 4: Add New Rules (Day 2-3)

**Goal:** Implement remaining validation checks

1. Create `rules/check-priority-tags.sh`
   - Implement: P0/P1/P2 header detection
   - Implement: Item format validation (`- [ ]` / `- [x]`)
   - Implement: Untagged item detection

2. Create `rules/check-evidence.sh`
   - Implement: Completed item detection
   - Implement: `[EVIDENCE:]` suffix check
   - Implement: P2 exemption logic

3. Create `rules/check-anchors.sh`
   - Implement: memory/*.md scanning
   - Implement: Anchor pair matching
   - Implement: Mismatch/orphan detection

### Phase 5: Add Test Fixtures (Day 3)

**Goal:** Full test coverage for all rules

1. Create `test-fixtures/with-templates/`
2. Create `test-fixtures/valid-priority-tags/`
3. Create `test-fixtures/invalid-priority-tags/`
4. Create `test-fixtures/valid-evidence/`
5. Create `test-fixtures/missing-evidence/`
6. Create `test-fixtures/valid-anchors/`
7. Create `test-fixtures/invalid-anchors/`

8. Update `test-validation.sh`
   - Add test cases for new fixtures
   - Add "warn" expectation support (exit code 1)

### Phase 6: Documentation & Polish (Day 3-4)

**Goal:** Complete documentation and integration

1. Update SKILL.md with all validation features
2. Update README.md with modular architecture
3. Integrate with check-prerequisites.sh
4. Final testing and cleanup

## File Size Targets

| File | Target Lines | Content |
|------|--------------|---------|
| `validate-spec.sh` | ≤200 | Orchestrator only |
| `lib/common.sh` | ≤100 | Colors, logging |
| `lib/config.sh` | ≤150 | YAML, env, globs |
| `lib/output.sh` | ≤120 | Text, JSON, quiet |
| `rules/check-files.sh` | ≤80 | FILE_EXISTS |
| `rules/check-placeholders.sh` | ≤100 | PLACEHOLDER_FILLED |
| `rules/check-sections.sh` | ≤80 | SECTIONS_PRESENT |
| `rules/check-level.sh` | ≤40 | LEVEL_DECLARED |
| `rules/check-priority-tags.sh` | ≤100 | PRIORITY_TAGS |
| `rules/check-evidence.sh` | ≤100 | EVIDENCE_CITED |
| `rules/check-anchors.sh` | ≤100 | ANCHORS_VALID |
| **Total** | **≤1170** | All features |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking changes | Run existing tests after each phase |
| Source path issues | Use `${BASH_SOURCE[0]}` for relative paths |
| Variable scope conflicts | Use `local` for all function variables |
| Performance regression | Benchmark: `time validate-spec.sh` before/after |

## Rollback Plan

If modular architecture causes issues:
1. Keep `001-mvp-monolithic/` as reference
2. Original validate-spec.sh can be restored from git
3. Each phase is incremental - can stop at any point

## Success Metrics

| Metric | Target |
|--------|--------|
| Existing tests | 6/6 pass |
| New tests | 7/7 pass |
| Total tests | 13/13 pass |
| Max file size | ≤200 lines |
| Checklist completion | 100% |
| Backward compatibility | Full |
