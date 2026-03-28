---
title: "Validation Rules"
description: "Modular shell scripts that validate spec folder structure and documentation completeness"
trigger_phrases:
  - "validation rules"
  - "check spec folder"
  - "spec validation scripts"
---

# Validation Rules

> Modular shell scripts that validate spec folder structure and documentation completeness.

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

### What are Validation Rules?

Validation rules are modular shell scripts that check spec folders for structural correctness and documentation completeness. Each rule focuses on a single validation concern and returns standardized results that the orchestrator (`spec/validate.sh`) aggregates.

### Key Statistics

| Category             | Count | Details                                       |
| -------------------- | ----- | --------------------------------------------- |
| Rules                | 18    | Modular validation scripts                    |
| Severity Levels      | 3     | error, warn, info                             |
| Documentation Levels | 4     | L1, L2, L3, L3+ with progressive requirements |

### Key Features

| Feature                    | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| **Modular Design**         | Each rule is self-contained and independently testable         |
| **Level-Aware**            | Rules adapt validation based on documentation level (L1/L2/L3) |
| **Standardized Interface** | All rules export `run_check()` and set `RULE_*` variables      |
| **Remediation Guidance**   | Failed rules provide actionable fix instructions               |

### Requirements

| Requirement | Minimum | Recommended |
| ----------- | ------- | ----------- |
| Bash        | 3.2+    | 5.0+        |
| grep        | POSIX   | GNU grep    |
| awk         | POSIX   | gawk        |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# Rules are invoked via the orchestrator, not directly
# Run validation from repository root (automatically invokes all rules)
.opencode/skill/system-spec-kit/scripts/spec/validate.sh <###-spec-name>/
```

### Verify Installation

```bash
# Check that rules are executable
ls -la .opencode/skill/system-spec-kit/scripts/rules/

# Expected: 18 .sh files with execute permissions
# -rwxr-xr-x check-files.sh
# -rwxr-xr-x check-priority-tags.sh
# -rwxr-xr-x check-complexity.sh
# ...
```

### First Use

```bash
# Validate a spec folder with verbose output
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<###-spec-name>/ --verbose
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
rules/
├── check-ai-protocols.sh   # AI_PROTOCOL - AI execution protocols (L3+)
├── check-anchors.sh        # ANCHORS_VALID - Memory file anchor pairs
├── check-complexity.sh     # COMPLEXITY_MATCH - Level vs content validation
├── check-evidence.sh       # EVIDENCE_CITED - P0/P1 completion evidence
├── check-files.sh          # FILE_EXISTS - Required files by level
├── check-folder-naming.sh  # FOLDER_NAMING - ###-short-name pattern validation
├── check-frontmatter.sh    # FRONTMATTER_VALID - YAML frontmatter validation
├── check-level.sh          # LEVEL_DECLARED - Explicit vs inferred level
├── check-level-match.sh    # LEVEL_MATCH - Required files match declared level
├── check-links.sh          # LINKS_VALID - Cross-skill wikilink validation (opt-in)
├── check-phase-links.sh    # PHASE_LINKS - Parent/child phase-link consistency
├── check-placeholders.sh   # PLACEHOLDER_FILLED - Unfilled placeholders
├── check-priority-tags.sh  # PRIORITY_TAGS - Checklist priority context
├── check-section-counts.sh # SECTION_COUNTS - Section count validation
├── check-sections.sh       # SECTIONS_PRESENT - Required markdown sections
├── check-toc-policy.sh     # TOC_POLICY - ToC allowed only in research/research.md
├── check-spec-doc-integrity.sh # SPEC_DOC_INTEGRITY - Markdown cross-reference validation
├── check-template-source.sh   # TEMPLATE_SOURCE - Template provenance marker checks
└── README.md                  # This file
```

### Key Files

| File                      | Purpose                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `check-files.sh`          | Core validation: ensures required files exist for documentation level     |
| `check-folder-naming.sh`  | Structure validation: ensures ###-short-name pattern                      |
| `check-complexity.sh`     | Level validation: ensures declared level matches content complexity       |
| `check-level-match.sh`    | File validation: ensures required files match declared level              |
| `check-ai-protocols.sh`   | Protocol validation: ensures L3+ specs have AI execution protocols        |
| `check-section-counts.sh` | Content validation: validates section counts are within expected ranges   |
| `check-frontmatter.sh`    | Metadata validation: validates YAML frontmatter structure                 |
| `check-priority-tags.sh`  | Quality validation: ensures checklist items have P0/P1/P2 context         |
| `check-evidence.sh`       | Completion validation: ensures completed items cite evidence              |
| `check-links.sh`          | Link validation: validates wikilinks across skill markdown trees          |
| `check-phase-links.sh`    | Phase validation: checks parent/child phase chain references              |
| `check-spec-doc-integrity.sh` | Reference validation: verifies inline markdown file references resolve |
| `check-toc-policy.sh`     | Style validation: allows ToC only in `research/research.md`                        |
| `check-template-source.sh`| Provenance validation: checks template-source metadata markers            |

`check-links.sh` runs as `LINKS_VALID` only when `SPECKIT_VALIDATE_LINKS=true` to avoid expensive repository-wide scans during routine per-spec validation.

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

### Rule Interface

All rules implement a standardized interface:

| Variable           | Type   | Description                                    |
| ------------------ | ------ | ---------------------------------------------- |
| `RULE_NAME`        | string | Unique rule identifier (e.g., `FILE_EXISTS`)   |
| `RULE_STATUS`      | enum   | Result: `pass`, `fail`, `warn`, `skip`, `info` |
| `RULE_MESSAGE`     | string | Human-readable result summary                  |
| `RULE_DETAILS`     | array  | Specific issues found                          |
| `RULE_REMEDIATION` | string | How to fix the issue                           |

### Rule Catalog

#### FILE_EXISTS (check-files.sh)

**Purpose**: Validates required files exist for documentation level

| Level | Required Files                   |
| ----- | -------------------------------- |
| L1    | `spec.md`, `plan.md`, `tasks.md` |
| L2    | L1 + `checklist.md`              |
| L3    | L2 + `decision-record.md`        |

`implementation-summary.md` is required once implementation progress is detected (checked tasks/checklist items).

**Severity**: error (blocks validation)

---

#### PRIORITY_TAGS (check-priority-tags.sh)

**Purpose**: Validates checklist items have priority context (P0/P1/P2)

**Patterns Recognized**:
- Section headers: `## P0`, `### P1:`, `## P2 - Optional`
- Inline tags: `[P0]`, `[P1]`, `[P2]`, `**P0**`, `**P1**`, `**P2**`

**Severity**: warn (advisory)

---

#### EVIDENCE_CITED (check-evidence.sh)

**Purpose**: Checks completed P0/P1 items have evidence citations

**Evidence Patterns**:
- `[EVIDENCE: description]` or `[Evidence: ...]`
- `| Evidence:` (pipe-separated)
- Checkmark symbols with description
- `(verified)`, `(tested)`, `(confirmed)` at end
- `[DEFERRED: reason]` counts as explained

**Severity**: warn (advisory)

---

#### PLACEHOLDER_FILLED (check-placeholders.sh)

**Purpose**: Detects unfilled placeholders in spec files

**Patterns Detected**:
- `[YOUR_VALUE_HERE: ...]`
- `[NEEDS CLARIFICATION: ...]`
- `{{mustache}}` style placeholders

**Severity**: fail (blocks validation)

---

#### ANCHORS_VALID (check-anchors.sh)

**Purpose**: Validates anchor pairs in memory files are properly matched

**Checks**:
- Every `<!-- ANCHOR:id -->` has matching `<!-- /ANCHOR:id -->`
- No orphaned closing anchors
- Reports line numbers for mismatches

**Severity**: fail (blocks validation)

---

#### COMPLEXITY_MATCH (check-complexity.sh)

**Purpose**: Validates that declared complexity level matches actual content

**Complexity Calculation**:
- Counts user stories, phases, tasks and requirements
- Checks for AI protocol presence (L3+ indicator)
- Compares against level thresholds

**Complexity Scoring**:
```
Score = User Stories x 10 + Phases x 5 + Tasks x 2 + Requirements x 1
```

**Thresholds**:
- L1: Score 0-30 (simple, <100 LOC)
- L2: Score 31-70 (moderate, 100-499 LOC)
- L3: Score 71+ (complex, 500+ LOC)
- L3+: Score 80+ with AI protocols

**Severity**: warn (advisory)

---

#### LEVEL_MATCH (check-level-match.sh)

**Purpose**: Validates that required files match declared documentation level

**Checks**:
- L1: Requires spec.md, plan.md, tasks.md
- L2: L1 + checklist.md
- L3: L2 + decision-record.md
- L3+: L3 + AI protocols, extended checklists

**Severity**: error (blocks validation)

---

#### SECTION_COUNTS (check-section-counts.sh)

**Purpose**: Validates section counts are within expected ranges for level

**Counts Tracked**:
- H2 headers (##) in spec.md, plan.md
- H3 headers (###) in spec.md, plan.md
- Functional requirements (REQ-FUNC-, REQ-DATA-)
- Acceptance scenarios (**Given** patterns)

**Expected Ranges**:
```
L1: 3-8 major sections, minimal requirements
L2: 5-12 major sections, defined requirements
L3: 8+ major sections, comprehensive requirements
L3+: 10+ major sections, detailed acceptance scenarios
```

**Severity**: warn (advisory)

---

#### TOC_POLICY (check-toc-policy.sh)

**Purpose**: Enforces SpecKit ToC policy for spec artifacts

**Policy**:
- `research/research.md`: ToC allowed
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `debug-delegation.md`: ToC forbidden

**Detection**:
- Headings matching `## TABLE OF CONTENTS`, `## Table of Contents`, or `## TOC`

**Severity**: error (blocks validation)

---

#### AI_PROTOCOL (check-ai-protocols.sh)

**Purpose**: Validates AI execution protocols are present for Level 3+ specs

**Required Protocol Sections** (L3+):
- `AI EXECUTION` section header
- `Pre-Task Checklist` subsection
- `Task Execution Rules` (TASK-SEQ, TASK-SCOPE)
- `Status Reporting` format
- `Blocked Task Protocol`

**Locations Checked**:
- `plan.md` (recommended)
- `tasks.md` (alternative)

**Severity**: warn (advisory for L3, info for L1/L2)

---

#### SECTIONS_PRESENT (check-sections.sh)

**Purpose**: Checks for required markdown sections in spec files

| File                      | Required Sections                               |
| ------------------------- | ----------------------------------------------- |
| `spec.md`                 | Problem Statement, Requirements, Scope          |
| `plan.md`                 | Technical Context, Architecture, Implementation |
| `checklist.md` (L2+)      | P0, P1                                          |
| `decision-record.md` (L3) | Context, Decision, Consequences                 |

**Severity**: warn (advisory)

---

#### LEVEL_DECLARED (check-level.sh)

**Purpose**: Checks if documentation level was explicitly declared vs inferred

**Recommendation**: Add `| **Level** | N |` to spec.md metadata table

**Severity**: info (informational only)

---

#### FOLDER_NAMING (check-folder-naming.sh)

**Purpose**: Validates spec folder follows `###-short-name` naming convention

**Pattern**: `[0-9]{3}-[a-z0-9-]+`

**Examples**:
- `007-add-authentication`
- `042-fix-login-bug`
- `add-authentication` (missing number prefix)
- `7-feature` (number not zero-padded)
- `007_feature` (underscore instead of hyphen)

**Severity**: error (blocks validation)

---

#### FRONTMATTER_VALID (check-frontmatter.sh)

**Purpose**: Validates YAML frontmatter structure in markdown files

**Checks**:
- Frontmatter delimiters (`---`) present
- Valid YAML syntax
- No duplicate keys
- Optional: validates expected fields (title, description, etc.)

**Severity**: warn (advisory)

---

#### SPEC_DOC_INTEGRITY (check-spec-doc-integrity.sh)

**Purpose**: Validates that inline backtick-quoted markdown file references (e.g., `` `plan.md` ``) point to files that actually exist

**Checks**:
- Scans all `.md` files in the spec folder for backtick-quoted `.md` references
- Resolves references relative to the markdown file, the spec root, and the repo root
- Reports any references that cannot be resolved to an existing file

**Severity**: warn (advisory)

<!-- /ANCHOR:features -->

---

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Basic Validation

```bash
# Validate a spec folder
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<###-spec-name>/

# Output:
# FILE_EXISTS: All required files present for Level 2
# PRIORITY_TAGS: All checklist items have priority context
# EVIDENCE_CITED: Found 3 completed item(s) without evidence
# PLACEHOLDER_FILLED: No unfilled placeholders found
```

### Example 2: Verbose Output

```bash
# Get detailed output including passing rules
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<###-spec-name>/ --verbose

# Shows all rule results with details
```

### Example 3: JSON Output

```bash
# Get machine-readable output
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<###-spec-name>/ --json

# Returns structured JSON for programmatic processing
```

### Common Patterns

| Pattern         | Command                               | When to Use         |
| --------------- | ------------------------------------- | ------------------- |
| Quick check     | `spec/validate.sh <folder>`           | Before committing   |
| Detailed review | `spec/validate.sh <folder> --verbose` | Debugging failures  |
| CI integration  | `spec/validate.sh <folder> --json`    | Automated pipelines |

<!-- /ANCHOR:usage-examples -->

---

## 6. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Rule Not Found

**Symptom**: `source: rules/check-*.sh: No such file or directory`

**Cause**: Running from wrong directory or rules not installed

**Solution**:
```bash
# Ensure you're in the project root
cd /path/to/project

# Verify rules exist
ls .opencode/skill/system-spec-kit/scripts/rules/
```

#### Permission Denied

**Symptom**: `bash: ./check-files.sh: Permission denied`

**Cause**: Rule scripts not executable

**Solution**:
```bash
chmod +x .opencode/skill/system-spec-kit/scripts/rules/*.sh
```

#### False Positive on Placeholders

**Symptom**: Rule flags placeholders inside code blocks

**Cause**: Code examples containing placeholder syntax

**Solution**: The rule filters fenced code blocks. If still flagged, wrap in backticks:
```markdown
Use `[YOUR_VALUE_HERE: example]` syntax for placeholders.
```

### Quick Fixes

| Problem           | Quick Fix                                        |
| ----------------- | ------------------------------------------------ |
| Missing files     | Create from templates in `templates/`            |
| No priority tags  | Add `## P0`, `## P1`, `## P2` headers            |
| Missing evidence  | Add `[EVIDENCE: description]` to completed items |
| Unmatched anchors | Check memory files for typos in anchor IDs       |

### Diagnostic Commands

```bash
# Check which rules are available
ls .opencode/skill/system-spec-kit/scripts/rules/*.sh

# Test a single rule manually (advanced)
source .opencode/skill/system-spec-kit/scripts/rules/check-files.sh
run_check "specs/<###-spec-name>" 2
echo "Status: $RULE_STATUS, Message: $RULE_MESSAGE"
```

<!-- /ANCHOR:troubleshooting -->

---

## 7. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document                                | Purpose                             |
| --------------------------------------- | ----------------------------------- |
| [validate.sh](../spec/validate.sh) | Orchestrator that invokes all rules |
| [SKILL.md](../../SKILL.md)              | Parent skill documentation          |
| [templates/](../../templates/)          | Spec folder templates               |

### External Resources

| Resource                                                    | Description                  |
| ----------------------------------------------------------- | ---------------------------- |
| [Bash Reference](https://www.gnu.org/software/bash/manual/) | Bash scripting documentation |
| [ShellCheck](https://www.shellcheck.net/)                   | Shell script linting tool    |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.0 | Last updated: 2025-12-26*
