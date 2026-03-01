---
title: "Implementation Summary: Modular Validation Architecture [002-modular-architecture/implementation-summary]"
description: "Transformed validate-spec.sh from a monolithic 600-line script into a modular architecture with 11 focused files totaling 1,291 lines. This refactoring enables plugin-like exten..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "modular"
  - "validation"
  - "architecture"
  - "implementation summary"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: Modular Validation Architecture

## Executive Summary

Transformed `validate-spec.sh` from a **monolithic 600-line script** into a **modular architecture with 11 focused files** totaling 1,291 lines. This refactoring enables plugin-like extensibility, per-rule configuration, and easier maintenance while maintaining full backward compatibility.

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Files | 1 | 11 | +10 |
| Total Lines | ~600 | 1,291 | +115% |
| Largest File | 600 | 289 | -52% |
| Validation Rules | 4 | 7 | +3 |
| Test Fixtures | 6 | 13 | +7 |
| Config Options | Env vars only | YAML + Env + CLI | ✓ |

---

## The Transformation

### BEFORE: Monolithic Architecture (v1.x)

```
┌─────────────────────────────────────────────────────────────┐
│                    validate-spec.sh                         │
│                      (~600 lines)                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Colors    │  │  Arg Parse  │  │    Help     │         │
│  │  (20 lines) │  │  (60 lines) │  │  (40 lines) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ FILE_EXISTS │  │ PLACEHOLDER │  │  SECTIONS   │         │
│  │  (80 lines) │  │ (100 lines) │  │  (80 lines) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │LEVEL_DECLARE│  │  JSON Gen   │  │    Main     │         │
│  │  (20 lines) │  │ (120 lines) │  │  (80 lines) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              Single point of failure
              Hard to extend/maintain
```

**How it worked:**
1. Script starts, parses arguments
2. Runs each validation function in sequence
3. Aggregates results in global variables
4. Generates output (text or JSON)
5. Exits with appropriate code

**Limitations:**
- Adding a rule required editing the main file
- All code in one place = merge conflicts
- No way to disable individual rules
- No per-project configuration
- Testing required running the whole script
- Output logic mixed with validation logic

---

### AFTER: Modular Architecture (v2.x)

```
┌─────────────────────────────────────────────────────────────┐
│                 validate-spec.sh (Orchestrator)             │
│                        (197 lines)                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ • Parse args  • Load config  • Run rules  • Output      ││
│  └─────────────────────────────────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────┘
                            │ sources
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  lib/common   │  │  lib/config   │  │  lib/output   │
│  (144 lines)  │  │  (289 lines)  │  │  (118 lines)  │
│               │  │               │  │               │
│ • Colors      │  │ • YAML parse  │  │ • Headers     │
│ • Logging     │  │ • Env vars    │  │ • Summary     │
│ • Utilities   │  │ • Glob match  │  │ • JSON gen    │
└───────────────┘  └───────────────┘  └───────────────┘
                            │
            ┌───────────────┼───────────────┐
            │     dynamically discovers     │
            ▼               ▼               ▼
┌───────────────────────────────────────────────────────────┐
│                      rules/*.sh                            │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│ check-  │ check-  │ check-  │ check-  │ check-  │ check-  │
│ files   │placehol-│sections │priority-│evidence │ anchors │
│ (55)    │ders(98) │  (85)   │tags(90) │  (97)   │  (94)   │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
              + check-level.sh (24 lines)
```

**How it works now:**
1. Orchestrator sources lib/*.sh for shared functionality
2. Loads configuration (.speckit.yaml → env vars → defaults)
3. Discovers all rules/check-*.sh files
4. For each rule: checks if enabled, runs run_check()
5. Aggregates results via standardized interface
6. Delegates output to lib/output.sh
7. Returns exit code via get_exit_code()

**Improvements:**
- Each file has single responsibility
- New rules = drop file in rules/
- Per-rule configuration (severity, enable/disable)
- Per-project .speckit.yaml configuration
- Individual rules are testable in isolation
- Clear separation: validation vs output vs config

---

## Execution Flow Comparison

### BEFORE

```
┌──────────────────────────────────────────────────────────────┐
│                         User                                 │
│                          │                                   │
│                          ▼                                   │
│              validate-spec.sh folder/                        │
│                          │                                   │
│     ┌────────────────────┼────────────────────┐             │
│     ▼                    ▼                    ▼             │
│ parse_args()      detect_level()      [hardcoded sequence]  │
│     │                    │                    │             │
│     └────────────────────┼────────────────────┘             │
│                          ▼                                   │
│              check_file_exists()                             │
│                          ▼                                   │
│              check_placeholders()                            │
│                          ▼                                   │
│              check_sections_present()                        │
│                          ▼                                   │
│              check_level_declared()                          │
│                          ▼                                   │
│              [inline output generation]                      │
│                          ▼                                   │
│                       exit $?                                │
└──────────────────────────────────────────────────────────────┘
```

### AFTER

```
┌──────────────────────────────────────────────────────────────┐
│                         User                                 │
│                          │                                   │
│                          ▼                                   │
│              validate-spec.sh folder/                        │
│                          │                                   │
│                          ▼                                   │
│     ┌────────────────────────────────────────┐              │
│     │  source lib/common.sh                  │              │
│     │  source lib/config.sh                  │              │
│     │  source lib/output.sh                  │              │
│     └────────────────────────────────────────┘              │
│                          │                                   │
│     ┌────────────────────┼────────────────────┐             │
│     ▼                    ▼                    ▼             │
│ parse_args()      load_config()      apply_env_overrides()  │
│     └────────────────────┼────────────────────┘             │
│                          ▼                                   │
│                   detect_level()                             │
│                          │                                   │
│                          ▼                                   │
│     ┌────────────────────────────────────────┐              │
│     │   for rule in rules/check-*.sh:        │              │
│     │       if should_run_rule(rule):        │◄─ Configurable│
│     │           source $rule                 │              │
│     │           run_check(folder, level)     │◄─ Standardized│
│     └────────────────────────────────────────┘              │
│                          │                                   │
│          ┌───────────────┴───────────────┐                  │
│          ▼                               ▼                  │
│   print_summary()               generate_json()             │
│   (if text mode)                (if --json)                 │
│          └───────────────┬───────────────┘                  │
│                          ▼                                   │
│                  get_exit_code()                             │
│                          ▼                                   │
│                       exit $?                                │
└──────────────────────────────────────────────────────────────┘
```

---

## Adding a New Rule: Before vs After

### BEFORE (7 steps, modifies core file)

```bash
# Step 1: Open the monolithic file
vim validate-spec.sh

# Step 2: Add the function (50-100 lines)
check_my_new_rule() {
    local folder="$1"
    # ... validation logic ...
    if [[ $errors -gt 0 ]]; then
        log_error "MY_NEW_RULE" "Found $errors issue(s)"
        # ... handle details ...
    else
        log_pass "MY_NEW_RULE" "All checks passed"
    fi
}

# Step 3: Add to main() execution sequence
main() {
    # ... existing code ...
    check_my_new_rule "$FOLDER_PATH"  # <-- Add here
    # ... rest of main ...
}

# Step 4: Update show_help() with new rule description
# Step 5: Update generate_json() to include new rule
# Step 6: Test (hope you didn't break anything)
# Step 7: Commit (large diff, hard to review)
```

### AFTER (2 steps, isolated file)

```bash
# Step 1: Create new rule file
cat > rules/check-my-new-rule.sh << 'EOF'
#!/bin/bash
# Rule: MY_NEW_RULE
# Severity: warn
# Description: Validates my new thing

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="MY_NEW_RULE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    # ... validation logic ...
    
    if [[ ${#issues[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Found ${#issues[@]} issue(s)"
        RULE_DETAILS=("${issues[@]}")
        RULE_REMEDIATION="Fix the issues"
    else
        RULE_MESSAGE="All checks passed"
    fi
    
    # Log result (uses lib/common.sh)
    case "$RULE_STATUS" in
        pass) log_pass "$RULE_NAME" "$RULE_MESSAGE" ;;
        warn) log_warn "$RULE_NAME" "$RULE_MESSAGE" "$RULE_REMEDIATION" ;;
        fail) log_error "$RULE_NAME" "$RULE_MESSAGE" "$RULE_REMEDIATION" ;;
    esac
}
EOF
chmod +x rules/check-my-new-rule.sh

# Step 2: Done! Orchestrator auto-discovers it.
# Optionally add test fixture and run tests.
```

---

## Feature Comparison

| Feature | Before (v1.x) | After (v2.x) |
|---------|---------------|--------------|
| **Architecture** | | |
| File count | 1 | 11 |
| Largest file | 600 lines | 289 lines |
| Separation of concerns | None | Full |
| **Validation Rules** | | |
| FILE_EXISTS | ✓ | ✓ |
| PLACEHOLDER_FILLED | ✓ | ✓ |
| SECTIONS_PRESENT | ✓ | ✓ |
| LEVEL_DECLARED | ✓ | ✓ |
| PRIORITY_TAGS | ✗ | ✓ NEW |
| EVIDENCE_CITED | ✗ | ✓ NEW |
| ANCHORS_VALID | ✗ | ✓ NEW |
| **Configuration** | | |
| CLI flags | ✓ | ✓ |
| Environment variables | ✓ | ✓ |
| .speckit.yaml file | ✗ | ✓ NEW |
| Per-rule severity | ✗ | ✓ NEW |
| Rule enable/disable | ✗ | ✓ NEW |
| Custom skip paths | Hardcoded | Configurable |
| **Output** | | |
| Text mode | ✓ | ✓ |
| JSON mode | ✓ | ✓ |
| Quiet mode | ✗ | ✓ NEW |
| Verbose mode | ✓ | ✓ |
| Remediation suggestions | ✗ | ✓ NEW |
| **Path Handling** | | |
| Skip scratch/ | ✓ | ✓ |
| Skip memory/ | ✓ | ✓ |
| Skip templates/ | ✗ | ✓ NEW |
| Glob patterns | ✗ | ✓ NEW |
| **Testing** | | |
| Test fixtures | 6 | 13 |
| Isolated rule testing | ✗ | ✓ |
| **Extensibility** | | |
| Add new rule | Edit main file | Drop file in rules/ |
| Custom rules | Impossible | Planned |

---

## Technical Details

### The Rule Interface

Every rule implements this standardized interface:

```bash
#!/bin/bash
# Rule: RULE_NAME
# Severity: error|warn|info
# Description: What this rule validates

run_check() {
    local folder="$1"   # Spec folder path
    local level="$2"    # Documentation level (1, 2, or 3)
    
    # OUTPUT VARIABLES (set by rule, read by orchestrator)
    RULE_NAME="RULE_NAME"           # Rule identifier
    RULE_STATUS="pass"              # pass | warn | fail
    RULE_MESSAGE=""                 # Human-readable summary
    RULE_DETAILS=()                 # Array of detail strings
    RULE_REMEDIATION=""             # How to fix (for JSON)
    
    # Validation logic here...
    
    # Call appropriate log function
    case "$RULE_STATUS" in
        pass) log_pass "$RULE_NAME" "$RULE_MESSAGE" ;;
        warn) log_warn "$RULE_NAME" "$RULE_MESSAGE" "$RULE_REMEDIATION" ;;
        fail) log_error "$RULE_NAME" "$RULE_MESSAGE" "$RULE_REMEDIATION" ;;
    esac
    
    # Log details
    for detail in "${RULE_DETAILS[@]}"; do
        log_detail "- $detail"
    done
}
```

### The Configuration Hierarchy

```
Priority (highest to lowest):
┌─────────────────────────────────────────┐
│ 1. CLI Flags                            │  --strict, --quiet, --json
├─────────────────────────────────────────┤
│ 2. Environment Variables                │  SPECKIT_STRICT=true
├─────────────────────────────────────────┤
│ 3. .speckit.yaml (spec folder)          │  validation.strict: true
├─────────────────────────────────────────┤
│ 4. .speckit.yaml (project root)         │  validation.rules.X: warn
├─────────────────────────────────────────┤
│ 5. Hardcoded Defaults                   │  FILE_EXISTS: error
└─────────────────────────────────────────┘
```

### Example .speckit.yaml

```yaml
version: "1.0"

validation:
  strict: false
  verbose: false
  
  rules:
    FILE_EXISTS: error
    PLACEHOLDER_FILLED: error
    SECTIONS_PRESENT: warn
    PRIORITY_TAGS: warn
    EVIDENCE_CITED: warn
    ANCHORS_VALID: error
    LEVEL_DECLARED: skip
  
  paths:
    skip:
      - "**/scratch/**"
      - "**/memory/**"
      - "**/templates/**"
      - "**/z_archive/**"
```

---

## Metrics Summary

### Line Count Distribution

| Component | Lines | % of Total |
|-----------|-------|------------|
| **Orchestrator** | 197 | 15% |
| **Libraries** | 551 | 43% |
| - common.sh | 144 | 11% |
| - config.sh | 289 | 22% |
| - output.sh | 118 | 9% |
| **Rules** | 543 | 42% |
| - check-files.sh | 55 | 4% |
| - check-placeholders.sh | 98 | 8% |
| - check-sections.sh | 85 | 7% |
| - check-level.sh | 24 | 2% |
| - check-priority-tags.sh | 90 | 7% |
| - check-evidence.sh | 97 | 8% |
| - check-anchors.sh | 94 | 7% |
| **TOTAL** | **1,291** | **100%** |

### Test Coverage

| Category | Count | Expected Result |
|----------|-------|-----------------|
| Positive (pass) | 8 | Exit 0 |
| Warning (warn) | 2 | Exit 1 |
| Negative (fail) | 3 | Exit 2 |
| **TOTAL** | **13** | All passing ✓ |

---

## Backward Compatibility

The new modular architecture is **100% backward compatible**:

```bash
# These all work exactly as before:
validate-spec.sh specs/my-feature/
validate-spec.sh --json specs/my-feature/
validate-spec.sh --strict specs/my-feature/
validate-spec.sh --verbose specs/my-feature/
validate-spec.sh --help

# Exit codes unchanged:
# 0 = passed
# 1 = passed with warnings
# 2 = failed (errors, or warnings in strict mode)
```

---

## Completion Status

| Priority | Items | Completed | Status |
|----------|-------|-----------|--------|
| P0 | 21 | 21 | ✅ 100% |
| P1 | 24 | 24 | ✅ 100% |
| P2 | 7 | 0 | Deferred |
| **Total** | **52** | **45** | **87%** |

### Deferred (P2) Items
- SKILL.md documentation update
- README.md documentation update  
- check-prerequisites.sh integration
- Verbose per-rule timing
- Rule execution order configuration
- Custom rules documentation

---

*Generated: 2024-12-25*
*Spec: 012-path-scoped-rules/002-modular-architecture*
