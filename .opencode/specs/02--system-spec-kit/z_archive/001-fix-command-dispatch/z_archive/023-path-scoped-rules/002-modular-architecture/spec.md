---
title: "Modular Validation Architecture [002-modular-architecture/spec]"
description: "The current validate-spec.sh script is a monolithic ~600 line file. Adding all planned features (PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID, .speckit.yaml config, glob pattern..."
trigger_phrases:
  - "modular"
  - "validation"
  - "architecture"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Modular Validation Architecture

## Metadata

| Field | Value |
|-------|-------|
| **Type** | Enhancement |
| **Priority** | P0 |
| **Level** | 3 |
| **Status** | In Progress |
| **Parent** | 012-path-scoped-rules |
| **Predecessor** | 001-mvp-monolithic (72% complete) |

## 1. Problem Statement

The current `validate-spec.sh` script is a monolithic ~600 line file. Adding all planned features (PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID, .speckit.yaml config, glob patterns) would bloat it to ~1400 lines, making it:

- Hard to maintain and debug
- Difficult to test individual rules
- Challenging to extend with new rules
- Poor separation of concerns

## 2. Solution

Refactor into a **modular architecture** with:

1. **Orchestrator** (`validate-spec.sh`) - Loads config, runs rules, aggregates results
2. **Libraries** (`lib/*.sh`) - Shared utilities, config, output formatting
3. **Rules** (`rules/check-*.sh`) - Individual validation checks, one per file

## 3. Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Orchestrator loads and runs all rule scripts from `rules/` | P0 |
| FR-2 | Each rule script is self-contained and independently testable | P0 |
| FR-3 | Shared functions extracted to `lib/common.sh` | P0 |
| FR-4 | Output formatting (text/JSON) in `lib/output.sh` | P0 |
| FR-5 | Config loading (.speckit.yaml + env vars) in `lib/config.sh` | P1 |
| FR-6 | Glob pattern matching in `lib/config.sh` | P1 |
| FR-7 | New rule: PRIORITY_TAGS validation | P1 |
| FR-8 | New rule: EVIDENCE_CITED validation | P1 |
| FR-9 | New rule: ANCHORS_VALID validation | P1 |
| FR-10 | Quiet mode (`--quiet`) for CI | P1 |
| FR-11 | JSON remediation suggestions | P1 |
| FR-12 | check-prerequisites.sh integration | P2 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | No single file exceeds 200 lines | P0 |
| NFR-2 | Backward compatible with existing validate-spec.sh usage | P0 |
| NFR-3 | All existing tests continue to pass | P0 |
| NFR-4 | Adding a new rule requires only creating one file in `rules/` | P1 |
| NFR-5 | Total execution time < 2 seconds for typical spec | P1 |

## 4. Scope

### In Scope

- Refactoring validate-spec.sh into modular components
- Implementing all 15 remaining checklist items from 001-mvp-monolithic
- Creating test fixtures for new validation rules
- Updating SKILL.md and README.md documentation

### Out of Scope

- Custom rule plugins (external scripts) - covered in custom-rules-design.md
- GUI or web interface
- Integration with external CI systems (beyond exit codes)

## 5. Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| All existing tests pass | 6/6 test fixtures pass |
| New rules have test coverage | 6 new fixtures (2 per rule) |
| No file exceeds 200 lines | `wc -l` on all scripts |
| Backward compatible | Existing command syntax works |
| Checklist 100% complete | All P0/P1 items done |

## 6. Architecture Overview

```
scripts/
├── validate-spec.sh              # Orchestrator (≤200 lines)
├── lib/
│   ├── common.sh                 # Colors, logging, utilities
│   ├── config.sh                 # .speckit.yaml, env vars, globs
│   └── output.sh                 # Text/JSON formatting, quiet mode
└── rules/
    ├── check-files.sh            # FILE_EXISTS
    ├── check-placeholders.sh     # PLACEHOLDER_FILLED
    ├── check-sections.sh         # SECTIONS_PRESENT
    ├── check-priority-tags.sh    # PRIORITY_TAGS (new)
    ├── check-evidence.sh         # EVIDENCE_CITED (new)
    └── check-anchors.sh          # ANCHORS_VALID (new)
```

## 7. Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| bash 4.0+ | Runtime | Required for associative arrays |
| grep, awk, sed | Runtime | Standard Unix tools |
| yq (optional) | Runtime | For .speckit.yaml parsing, fallback if missing |

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing functionality | Medium | High | Comprehensive test suite, backward compat tests |
| Performance regression | Low | Medium | Benchmark before/after, optimize if needed |
| Complex debugging across files | Medium | Low | Clear logging, --verbose mode per rule |
