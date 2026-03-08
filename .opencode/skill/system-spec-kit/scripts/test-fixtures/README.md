---
title: "SpecKit Validation Test Fixtures"
description: "Test scenarios for validating SpecKit spec folder structure, content rules, validation logic and edge-case handling."
trigger_phrases:
  - "test fixtures"
  - "validation fixtures"
  - "spec folder test scenarios"
---

# SpecKit Validation Test Fixtures

> Test scenarios for validating SpecKit spec folder structure, content rules, validation logic and edge-case handling.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RELATED DOCUMENTS](#7--related-documents)
- [8. COGNITIVE MEMORY FIXTURES](#8--cognitive-memory-fixtures)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What are Test Fixtures?

Test fixtures are pre-built spec folder examples that cover all validation scenarios (both valid and invalid cases). They serve as regression tests for the SpecKit validation system and document expected behaviors through concrete examples.

**Purpose**: Ensure validation scripts correctly identify valid spec folders and catch all violation patterns.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Total Fixtures | 51 | Valid + invalid cases across all rules |
| Documentation Levels | 4 | Level 1, 2, 3, 3+ |
| Validation Rules | 12+ | Structure, anchors, priorities, evidence, placeholders |
| Valid Examples | 8 | Baseline conformant spec folders |

### Key Features

| Feature | Description |
|---------|-------------|
| **Full Coverage** | Tests for structure, content, anchors, priorities, evidence, placeholders |
| **Level-Specific Tests** | Fixtures for all documentation levels (1, 2, 3, 3+) |
| **Regression Prevention** | Automated test suite catches validation logic regressions |
| **Documentation by Example** | Each fixture demonstrates a specific rule or violation |
| **Isolated Scenarios** | Single-concern fixtures for precise failure diagnosis |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Bash | 4.0+ | 5.0+ |
| SpecKit | 2.0+ | Latest |
| Test Runner | spec/validate.sh | test-validation.sh |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
# 1. Navigate to scripts directory
cd .opencode/skill/system-spec-kit/scripts

# 2. Run validation on a single fixture
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/002-valid-level1

# 3. Run full test suite
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
```

### Verify Test Suite

```bash
# Run all fixtures with expected results
cd .opencode/skill/system-spec-kit/scripts
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh

# Expected output:
# ✓ 51/51 tests passed
```

### First Use

```bash
# Test a specific validation rule
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/007-valid-anchors

# Output shows anchor validation results
```

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
test-fixtures/
├── README.md                           # This file
├── 001-empty-folder/                   # Empty directory (invalid)
├── 002-valid-level1/                   # Valid Level 1 spec
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── implementation-summary.md
├── 003-valid-level2/                   # Valid Level 2 spec
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── implementation-summary.md
│   └── checklist.md
├── 004-valid-level3/                   # Valid Level 3 spec
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── implementation-summary.md
│   ├── checklist.md
│   └── decision-record.md
├── 005-unfilled-placeholders/          # Placeholder violations
├── 006-missing-required-files/         # Structure violations
├── 007-valid-anchors/                  # Proper memory anchor usage
│   └── memory/
│       └── session-001.md
├── 008-invalid-anchors/                # Anchor format violations
├── 009-valid-priority-tags/            # Proper P0/P1/P2 usage
├── 010-valid-evidence/                 # Checklist evidence patterns
├── 011-anchors-duplicate-ids/          # Duplicate anchor IDs
├── 012-anchors-empty-memory/           # Empty memory files
├── 013-anchors-multiple-files/         # Multiple memory files
├── 014-anchors-nested/                 # Nested memory structure
├── 015-anchors-no-memory/              # Missing memory directory
├── 016-evidence-all-patterns/          # All valid evidence formats
├── 017-evidence-case-variations/       # Case-insensitive evidence
├── 018-evidence-checkmark-formats/     # Unicode checkmark variants
├── 019-evidence-p2-exempt/             # P2 items exempt from evidence
├── 020-evidence-wrong-suffix/          # Invalid evidence suffix
├── 021-invalid-priority-tags/          # Invalid P3, P-1, etc.
├── 022-level-explicit/                 # Explicit level declaration
├── 023-level-inferred/                 # Inferred from file structure
├── 024-level-no-bold/                  # Missing bold Level marker
├── 025-level-out-of-range/             # Invalid level number
├── 026-level-zero/                     # Level 0 (invalid)
├── 027-level2-missing-checklist/       # Level 2 without checklist.md
├── 028-level3-missing-decision/        # Level 3 without decision-record.md
├── 029-missing-checklist-sections/     # Incomplete checklist structure
├── 030-missing-decision-sections/      # Incomplete decision-record structure
├── 031-missing-evidence/               # P0/P1 items without evidence
├── 032-missing-plan/                   # No plan.md
├── 033-missing-plan-sections/          # Incomplete plan structure
├── 034-missing-spec-sections/          # Incomplete spec structure
├── 035-missing-tasks/                  # No tasks.md
├── 036-multiple-placeholders/          # Multiple placeholder types
├── 037-placeholder-case-variations/    # Mixed case placeholders
├── 038-placeholder-in-codeblock/       # Placeholders in code (allowed)
├── 039-placeholder-in-inline-code/     # Placeholders in inline code (allowed)
├── 040-priority-context-reset/         # Priority context inheritance
├── 041-priority-inline-tags/           # Inline priority markers
├── 042-priority-lowercase/             # Lowercase p0/p1/p2
├── 043-priority-mixed-format/          # Mixed priority formats
├── 044-priority-p3-invalid/            # Invalid P3 priority
├── 045-valid-sections/                 # All required sections present
├── 046-with-config/                    # With config.yaml
├── 047-with-extra-files/               # With optional files
├── 048-with-memory-placeholders/       # Placeholders in memory/ (allowed)
├── 049-with-rule-order/                # Rule execution order test
├── 050-with-scratch/                   # With scratch/ directory
└── 051-with-templates/                 # With template files
```

### Key Files

| File | Purpose |
|------|---------|
| `002-valid-level1/` | Baseline valid Level 1 spec folder |
| `003-valid-level2/` | Baseline valid Level 2 spec folder |
| `004-valid-level3/` | Baseline valid Level 3 spec folder |
| `007-valid-anchors/` | Demonstrates proper memory anchor syntax |
| `010-valid-evidence/` | Demonstrates proper checklist evidence |
| `001-empty-folder/` | Empty directory (should fail validation) |

---

<!-- /ANCHOR:structure -->

<!-- ANCHOR:features -->
## 4. FEATURES

### Validation Rule Coverage

**Purpose**: Test all SpecKit validation rules with positive and negative cases

| Rule Category | Fixtures | Example |
|---------------|----------|---------|
| **Structure** | 8 | 001-empty-folder, 006-missing-required-files, 032-missing-plan |
| **Levels** | 6 | 022-level-explicit, 027-level2-missing-checklist, 028-level3-missing-decision |
| **Anchors** | 6 | 007-valid-anchors, 011-anchors-duplicate-ids, 012-anchors-empty-memory |
| **Evidence** | 6 | 010-valid-evidence, 016-evidence-all-patterns, 031-missing-evidence |
| **Priorities** | 7 | 009-valid-priority-tags, 021-invalid-priority-tags, 044-priority-p3-invalid |
| **Placeholders** | 6 | 005-unfilled-placeholders, 036-multiple-placeholders, 038-placeholder-in-codeblock |
| **Sections** | 4 | 029-missing-checklist-sections, 033-missing-plan-sections, 045-valid-sections |

### Valid Baseline Fixtures

**Purpose**: Conformant spec folders for each documentation level

```bash
# Level 1 baseline (minimal)
test-fixtures/002-valid-level1/

# Level 2 baseline (with QA)
test-fixtures/003-valid-level2/

# Level 3 baseline (with architecture)
test-fixtures/004-valid-level3/
```

### Edge Case Coverage

**Purpose**: Test boundary conditions and unusual but valid scenarios

| Fixture | Edge Case |
|---------|-----------|
| `038-placeholder-in-codeblock/` | Placeholders in code blocks are allowed |
| `039-placeholder-in-inline-code/` | Placeholders in inline code are allowed |
| `040-priority-context-reset/` | Priority inheritance across sections |
| `043-priority-mixed-format/` | Mixed bracket and heading priority formats |
| `048-with-memory-placeholders/` | Placeholders in memory/ are allowed |

### Automated Test Suite

**Purpose**: Run all fixtures with expected results validation

```bash
# Located in ..opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh

# Tests each fixture against expected validation outcome
# Exit 0: All tests passed
# Exit 1: One or more tests failed
```

---

<!-- /ANCHOR:features -->

<!-- ANCHOR:usage-examples -->
## 5. USAGE EXAMPLES

### Example 1: Validate Single Fixture

```bash
# Test a specific validation scenario
cd .opencode/skill/system-spec-kit/scripts
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/007-valid-anchors
```

**Result**: Shows validation results for anchor syntax checking.

### Example 2: Run Full Test Suite

```bash
# Run all fixtures with expected results
cd .opencode/skill/system-spec-kit/scripts
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
```

**Result**: Reports pass/fail for all 51 fixtures.

### Example 3: Test Specific Rule Category

```bash
# Test all anchor-related fixtures
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/007-valid-anchors
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/008-invalid-anchors
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/011-anchors-duplicate-ids
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/012-anchors-empty-memory
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/013-anchors-multiple-files
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/014-anchors-nested
```

**Result**: Tests anchor validation logic across all cases.

### Example 4: Debug Validation Logic

```bash
# Test edge case to verify validation behavior
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/038-placeholder-in-codeblock --verbose

# Confirm placeholders in code blocks are allowed (should pass)
```

**Result**: Validates that the validation script correctly allows placeholders in code contexts.

### Example 5: Regression Testing

```bash
# After modifying validation logic, run full suite
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh

# Any failures indicate regression
```

**Result**: Ensures validation changes don't break existing rules.

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Single fixture test | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/[name]` | Testing specific rule |
| Full regression test | `.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh` | After validation changes |
| Rule category test | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/*-priority-*` | Testing priority logic |
| Baseline validation | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/00[2-4]-valid-*` | Sanity check |
| Edge case verification | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/0[3-4][0-9]-*` | Boundary conditions |

---

<!-- /ANCHOR:usage-examples -->

<!-- ANCHOR:troubleshooting -->
## 6. TROUBLESHOOTING

### Common Issues

#### Test suite reports failures

**Symptom**: `.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh` shows failed tests

**Cause**: Validation logic change or fixture corruption

**Solution**:
```bash
# Run specific failing fixture with verbose output
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/[failing-fixture] --verbose

# Compare expected vs actual validation results
# Update fixture or fix validation logic as needed
```

#### Fixture structure unclear

**Symptom**: Don't understand what a fixture is testing

**Cause**: Fixture naming doesn't reveal test purpose

**Solution**:
```bash
# Read the README (this file) for fixture descriptions
# Or examine fixture files directly
cd test-fixtures/[fixture-name]
ls -la
cat spec.md
```

#### Validation passes when it should fail

**Symptom**: Expect fixture to fail validation but it passes

**Cause**: Validation rule not correctly implemented

**Solution**:
```bash
# Verify fixture is properly malformed
cd test-fixtures/[fixture-name]
grep -r "PLACEHOLDER" .  # Check for placeholders
grep -r "P3" .           # Check for invalid priorities

# Run with verbose output to see validation logic
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/[fixture-name] --verbose
```

#### Need to add new test case

**Symptom**: Want to test new validation rule or edge case

**Cause**: New validation rule added or bug discovered

**Solution**:
```bash
# 1. Create new fixture directory
mkdir test-fixtures/052-new-test-case

# 2. Copy baseline fixture
cp -r test-fixtures/002-valid-level1/* test-fixtures/052-new-test-case/

# 3. Modify to create test scenario
# Edit files to introduce the condition you want to test

# 4. Validate behavior
.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/052-new-test-case

# 5. Add to test suite
# Update ..opencode/skill/system-spec-kit/scripts/tests/test-validation.sh with expected result
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Test suite fails | `.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh` to see which fixtures |
| Need baseline example | Use `test-fixtures/002-valid-level1` |
| Check anchor syntax | Examine `test-fixtures/007-valid-anchors/memory/` |
| Check evidence patterns | Examine `test-fixtures/016-evidence-all-patterns/checklist.md` |
| Verify priority tags | Examine `test-fixtures/009-valid-priority-tags/checklist.md` |

### Diagnostic Commands

```bash
# Run full test suite
.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh

# Count fixtures by category
ls test-fixtures/ | grep -c "valid"
ls test-fixtures/ | grep -c "anchor"
ls test-fixtures/ | grep -c "evidence"

# List all valid baseline fixtures
ls test-fixtures/ | grep "valid-level"

# Find fixtures testing specific rule
ls test-fixtures/ | grep "placeholder"
ls test-fixtures/ | grep "priority"
```

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:related -->
## 7. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../../SKILL.md](../../SKILL.md) | SpecKit skill documentation |
| [../../references/validation/validation_rules.md](../../references/validation/validation_rules.md) | Validation rule reference |
| [../../references/validation/phase_checklists.md](../../references/validation/phase_checklists.md) | Validation phase definitions |
| [../../references/templates/template_guide.md](../../references/templates/template_guide.md) | Template usage guide |
| [../spec/validate.sh](../spec/validate.sh) | Main validation script |

### Testing Resources

| Resource | Location |
|----------|----------|
| Test runner | `.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh` |
| Validation script | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| Template fixtures | `../templates/` |

### Fixture Categories

| Category | Fixtures |
|----------|----------|
| Valid baselines | `002-valid-level1`, `003-valid-level2`, `004-valid-level3` |
| Anchor tests | `007-015` (9 fixtures) |
| Evidence tests | `010, 016-020` (6 fixtures) |
| Priority tests | `009, 021, 040-044` (7 fixtures) |
| Placeholder tests | `005, 036-039, 048` (6 fixtures) |
| Level tests | `022-028` (7 fixtures) |

---

<!-- /ANCHOR:related -->

<!-- ANCHOR:cognitive-fixtures -->
## 8. COGNITIVE MEMORY FIXTURES

### Overview

Additional fixtures for testing the Cognitive Memory Upgrade features including FSRS scheduling, prediction error gating, tier classification and semantic similarity.

### Cognitive Memory Fixtures

**Note:** Cognitive memory test fixtures have been moved to `mcp_server/tests/fixtures/`:

| File | Purpose | New Location |
|------|---------|--------------|
| `sample-memories.json` | Sample memory objects for all 5 importance tiers | `../../mcp_server/tests/fixtures/` |
| `contradiction-pairs.json` | Statement pairs for contradiction detection testing | `../../mcp_server/tests/fixtures/` |
| `similarity-test-cases.json` | Semantic similarity scoring validation cases | `../../mcp_server/tests/fixtures/` |

---

*Test fixtures for SpecKit v2.1 validation system | Last updated: 2026-02-07*

<!-- /ANCHOR:cognitive-fixtures -->
