---
title: "Setup Scripts"
description: "Prerequisite validation scripts for feature-folder readiness and environment requirements"
trigger_phrases:
  - "setup scripts"
  - "check prerequisites"
  - "spec folder setup"
---

# Setup Scripts

> Prerequisite validation scripts for feature-folder readiness and environment requirements.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RELATED DOCUMENTS](#7--related-documents)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What are Setup Scripts?

Setup scripts validate feature-folder prerequisites before implementation begins. They ensure required files exist for the active feature and can invoke full spec validation when needed.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Scripts | 4 | Prerequisite and environment validation |
| Validation Modes | 5 | Human-readable, JSON, paths-only, validate, strict |
| Check Time | <5 sec | Fast prerequisite checks |

### Key Features

| Feature | Description |
|---------|-------------|
| **Feature Folder Validation** | Confirms active feature folder exists |
| **File Requirement Checks** | Ensures required files exist for requested mode |
| **Docs Discovery** | Reports available docs (`research/research.md`, `checklists/`, `decisions/`) |
| **Full Validation Integration** | Optionally runs complete validation suite |
| **Multiple Output Formats** | Human-readable, JSON or paths-only modes |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Bash | 3.2+ | 5.0+ |
| grep | POSIX | GNU grep |
| jq | Optional | Useful for parsing JSON output |

<!-- /ANCHOR:overview -->

## 2. QUICK START
<!-- ANCHOR:quick-start -->

```bash
# Run from anywhere in the repository
cd /path/to/repo

# Check prerequisites
.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh
```

### Verify Installation

```bash
# Check that spec folder is ready
./check-prerequisites.sh

# Expected output:
# FEATURE_DIR:/path/to/repo/007-my-feature
# AVAILABLE_DOCS:
# research/research.md
# checklists/
```

### First Use

```bash
# Run with full validation (stricter checks)
./check-prerequisites.sh --validate-strict
```

<!-- /ANCHOR:quick-start -->

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
setup/
├── check-prerequisites.sh   # Validates spec folder structure and requirements
├── check-native-modules.sh  # Checks native Node.js module availability
├── rebuild-native-modules.sh # Rebuilds native modules when needed
├── record-node-version.js   # Records current Node.js version for compatibility
└── README.md                # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `check-prerequisites.sh` | Feature-folder prerequisite validation. Ensures required files exist before implementation |
| `check-native-modules.sh` | Checks native Node.js module availability (e.g., better-sqlite3) |
| `rebuild-native-modules.sh` | Rebuilds native modules for current Node.js version |
| `record-node-version.js` | Records Node.js version to detect version changes requiring rebuilds |

<!-- /ANCHOR:structure -->

## 4. FEATURES
<!-- ANCHOR:features -->

### Prerequisite Checker (check-prerequisites.sh)

**Purpose**: Validates active feature folder before implementation phase

| Validation | Description |
|------------|-------------|
| **Feature folder exists** | Confirms target folder exists and is accessible |
| **Required files** | Ensures spec.md, plan.md exist (tasks.md if required) |
| **Validation pass** | Optionally runs full `spec/validate.sh` |

**Options**:
```bash
./check-prerequisites.sh                  # Human-readable output
./check-prerequisites.sh --json           # JSON output
./check-prerequisites.sh --require-tasks  # Require tasks.md (implementation)
./check-prerequisites.sh --include-tasks  # Include tasks.md in output docs list
./check-prerequisites.sh --validate       # Run full validation
./check-prerequisites.sh --validate-strict # Warnings as errors
./check-prerequisites.sh --validate-verbose # Verbose validation output
```

**Output Modes**:

| Mode | Flag | Use Case |
|------|------|----------|
| Human | _(default)_ | Interactive terminal use |
| JSON | `--json` | Programmatic parsing, CI/CD |
| Paths | `--paths-only` | Scripting, file discovery |

**JSON Structure**:
```json
{
  "FEATURE_DIR": "/path/to/specs/001-name",
  "AVAILABLE_DOCS": ["research/research.md", "checklists/", "decisions/"]
}
```

<!-- /ANCHOR:features -->

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Validate Spec Folder Before Implementation

```bash
# Check if feature folder is ready for implementation
./check-prerequisites.sh --require-tasks

# Output:
# FEATURE_DIR:/path/to/specs/042-my-feature
# AVAILABLE_DOCS:
# tasks.md
```

---

### Example 2: CI/CD Integration

```bash
# Get JSON output for automated workflows
./check-prerequisites.sh --json --validate-strict

# Parse results programmatically
if [ $? -eq 0 ]; then
  echo "Spec folder validated, proceeding with implementation"
else
  echo "Validation failed, cannot proceed"
  exit 1
fi
```

---

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Quick check | `./check-prerequisites.sh` | Before starting implementation |
| Full validation | `./check-prerequisites.sh --validate` | Full spec folder check |
| CI validation | `./check-prerequisites.sh --json --validate-strict` | Automated pipelines |
| Get paths only | `./check-prerequisites.sh --paths-only` | Scripting integration |

<!-- /ANCHOR:usage-examples -->

## 6. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Prerequisite Check Fails: Missing Files

**Symptom**: `ERROR: Required file spec.md not found`

**Cause**: Not in a valid spec folder, or spec folder incomplete

**Solution**:
```bash
# Ensure you're in project root
pwd

# Check spec folder exists
ls specs/

# Create or repair required docs
.opencode/skill/system-spec-kit/scripts/spec/create.sh "<feature-title>" --level 1
```

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing files | Regenerate docs: `.opencode/skill/system-spec-kit/scripts/spec/create.sh specs/<id-name>` |
| Wrong directory | Ensure you're in a spec folder (specs/###-name/) |
| Validation fails | Run with `--validate` to see detailed errors |
| JSON parse error | Install jq: `brew install jq` (macOS) |

---

### Diagnostic Commands

```bash
# Check script exists and is executable (from repository root)
ls -la .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh

# Test from repository root
.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh

# Get verbose validation output
.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh --validate

# Check which files exist in a spec folder
ls -la specs/<###-spec-name>/spec.md specs/<###-spec-name>/plan.md specs/<###-spec-name>/checklist.md
```

<!-- /ANCHOR:troubleshooting -->

## 7. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [SKILL.md](../../SKILL.md) | Parent skill documentation |
| [Validation Rules](../rules/README.md) | Spec folder validation rules |
| [validate.sh](../spec/validate.sh) | Full validation orchestrator |
| [templates/](../../templates/) | Spec folder templates |

### External Resources

| Resource | Description |
|----------|-------------|
| [Bash Reference](https://www.gnu.org/software/bash/manual/) | Bash scripting documentation |
| [jq Manual](https://stedolan.github.io/jq/manual/) | JSON processing tool |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
