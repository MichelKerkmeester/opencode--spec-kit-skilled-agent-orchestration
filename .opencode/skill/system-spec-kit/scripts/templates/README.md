---
title: "SpecKit Template Composer"
description: "Automated composition system for SpecKit documentation templates across all documentation levels."
trigger_phrases:
  - "template composer"
  - "compose templates"
  - "template composition"
---

# SpecKit Template Composer

> Automated composition system for SpecKit documentation templates across all documentation levels.

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

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is Template Composer?

The Template Composer (`compose.sh`) is an automated build system that generates level-specific documentation templates from modular source components. It merges core templates with level-specific addendums to create consistent templates for Levels 1, 2, 3 and 3+.

**Purpose**: Maintain single-source-of-truth template components while preventing drift across documentation levels.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Documentation Levels | 4 | Level 1, 2, 3, 3+ |
| Core Templates | 4 | spec, plan, tasks, implementation-summary |
| Addendum Sets | 3 | level2-verify, level3-arch, level3plus-govern |
| Output Templates | 21 | Generated template files across Levels 1, 2, 3, and 3+ (excluding README.md) |

### Key Features

| Feature | Description |
|---------|-------------|
| **Modular Composition** | Merge core templates with level-specific addendums automatically |
| **Drift Prevention** | Single source files ensure consistency when templates are updated |
| **Dry-Run Mode** | Preview changes before applying to verify composition logic |
| **Verification Mode** | Check if composed templates match current sources |
| **Selective Composition** | Compose individual levels or all levels at once |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Bash | 4.0+ | 5.0+ |
| Operating System | macOS/Linux | macOS/Linux |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

```bash
# 1. Navigate to scripts/templates directory
cd .opencode/skill/system-spec-kit/scripts/templates

# 2. Make script executable (if needed)
chmod +x compose.sh

# 3. Compose all templates (operates on ../../templates/ directory)
./compose.sh
```

### Verify Composition

```bash
# Check if composed templates are current
./compose.sh --verify

# Expected output:
# ✓ All templates are current
```

### First Use

```bash
# Compose all levels with verbose output
./compose.sh --verbose

# Output shows each composition step and files written
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
scripts/templates/
├── compose.sh                   # Template composition script (this tool)
└── README.md                    # This file

Template sources (at ../../templates/):
templates/
├── core/                        # Single-source template components
│   ├── spec-core.md             # Core spec template
│   ├── plan-core.md             # Core plan template
│   ├── tasks-core.md            # Core tasks template
│   └── impl-summary-core.md     # Core implementation summary
├── addendum/                    # Level-specific extensions
│   ├── level2-verify/           # Level 2 additions (QA/verification)
│   ├── level3-arch/             # Level 3 additions (architecture)
│   └── level3plus-govern/       # Level 3+ additions (governance)
└── level_N/                     # Composed output templates
    ├── spec.md                  # Ready-to-use templates
    ├── plan.md
    ├── tasks.md
    ├── implementation-summary.md
    ├── checklist.md             # (Level 2+)
    └── decision-record.md       # (Level 3 and 3+)
```

### Key Files

| File | Purpose | Location |
|------|---------|----------|
| `compose.sh` | Main composition script with merge logic | `scripts/templates/` |
| `core/*.md` | Base templates shared across all levels | `../../templates/core/` |
| `addendum/level*/*.md` | Level-specific template sections | `../../templates/addendum/` |
| `level_N/*.md` | Composed output templates ready for use | `../../templates/level_N/` |
| `changelog/*.md` | Standalone nested changelog templates (not composed) | `../../templates/changelog/` |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

### Automated Template Composition

**Purpose**: Generate level-specific templates from modular components

| Aspect | Details |
|--------|---------|
| **Input** | Core templates + level-specific addendums |
| **Output** | Complete, ready-to-use templates for each level |
| **Process** | Marker-based section merging with validation |

**Composition Rules**:
- **Level 1**: Core only (spec, plan, tasks, implementation-summary)
- **Level 2**: Core + level2-verify addendum (adds checklist.md)
- **Level 3**: Core + level2-verify + level3-arch addendums (adds decision-record.md)
- **Level 3+**: Core + all addendums (adds AI protocols, governance)
- `templates/changelog/` remains standalone and is consumed directly by the nested changelog generator.

### Template Markers

Special HTML comments control composition behavior:

```markdown
<!-- SPECKIT_LEVEL: N -->                # Updated to target level
<!-- SPECKIT_TEMPLATE_SOURCE: ... -->    # Preserved from core
<!-- SPECKIT_ADDENDUM: ... -->           # Stripped from output
```

### Dry-Run Mode

**Purpose**: Preview changes without modifying files

```bash
./compose.sh --dry-run

# Shows what would change without writing files
```

### Verification Mode

**Purpose**: Check if composed templates match current sources

```bash
./compose.sh --verify

# Exit 0: Templates are current
# Exit 1: Templates need recomposition
```

### Selective Composition

**Purpose**: Compose specific levels only

```bash
# Compose only Level 2
./compose.sh 2

# Compose Levels 2 and 3
./compose.sh 2 3

# Compose all levels
./compose.sh
```

<!-- /ANCHOR:features -->

---

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Compose All Templates

```bash
# Standard workflow after editing core templates
cd .opencode/skill/system-spec-kit/scripts/templates
./compose.sh
```

**Result**: All level templates (1, 2, 3, 3+) are regenerated from current sources.

### Example 2: Preview Changes

```bash
# See what would change before committing
./compose.sh --dry-run --verbose
```

**Result**: Detailed output shows merge operations without modifying files.

### Example 3: Update Single Level

```bash
# After editing level2-verify addendum, recompose Level 2 only
./compose.sh 2

# Verify Level 2 templates are current
./compose.sh --verify 2
```

**Result**: Only Level 2 templates are updated. Other levels remain unchanged.

### Example 4: CI/CD Validation

```bash
# In pre-commit hook or CI pipeline
./compose.sh --verify || {
  echo "ERROR: Templates out of sync. Run ./compose.sh to update."
  exit 1
}
```

**Result**: Fails the build if templates need recomposition.

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Full recomposition | `./compose.sh` | After editing core or addendum templates |
| Preview changes | `./compose.sh --dry-run` | Before committing template changes |
| Verify consistency | `./compose.sh --verify` | In CI/CD or pre-commit hooks |
| Debug composition | `./compose.sh --verbose` | When troubleshooting merge logic |
| Selective update | `./compose.sh 2 3` | After editing specific addendums |

<!-- /ANCHOR:usage-examples -->

---

## 6. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Verification fails after editing templates

**Symptom**: `./compose.sh --verify` exits with error, shows "Templates need recomposition"

**Cause**: Core or addendum templates were edited but composed outputs not regenerated

**Solution**:
```bash
# Recompose all templates
./compose.sh

# Verify they're now current
./compose.sh --verify
```

#### Script not executable

**Symptom**: `bash: ./compose.sh: Permission denied`

**Cause**: Execute permission not set on script

**Solution**:
```bash
chmod +x compose.sh
./compose.sh
```

#### Unexpected merge results

**Symptom**: Composed template missing expected sections or has duplicates

**Cause**: Marker syntax error in core or addendum templates

**Solution**:
```bash
# Run with verbose output to see merge logic
./compose.sh --verbose --dry-run

# Check marker syntax in source files
grep -r "SPECKIT_" core/ addendum/
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Templates out of sync | `./compose.sh` |
| Permission denied | `chmod +x compose.sh` |
| Need to verify | `./compose.sh --verify` |
| See merge details | `./compose.sh --verbose --dry-run` |

### Diagnostic Commands

```bash
# Check composition status
./compose.sh --verify

# See what would change
./compose.sh --dry-run

# Verbose composition of specific level
./compose.sh --verbose 2

# Check template markers
grep -r "SPECKIT_" core/ addendum/
```

<!-- /ANCHOR:troubleshooting -->

---

## 7. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../../templates/README.md](../../templates/README.md) | Template system overview |
| [../../SKILL.md](../../SKILL.md) | SpecKit skill documentation |
| [../../references/templates/template_guide.md](../../references/templates/template_guide.md) | Template usage guide |
| [../test-fixtures/README.md](../test-fixtures/README.md) | Test fixtures for validation |

### Template Sources

| Component | Location |
|-----------|----------|
| Core templates | `../../templates/core/` |
| Level 2 addendum | `../../templates/addendum/level2-verify/` |
| Level 3 addendum | `../../templates/addendum/level3-arch/` |
| Level 3+ addendum | `../../templates/addendum/level3plus-govern/` |
| Composed outputs | `../../templates/level_N/` |

<!-- /ANCHOR:related -->

---

*Documentation for SpecKit v2.0 Template Composer | Last updated: 2026-02-07 | Path clarifications added*
