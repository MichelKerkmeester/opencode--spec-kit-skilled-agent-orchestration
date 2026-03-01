# Custom Rules Design Document

> **Status**: Design Document (Future Implementation)  
> **Version**: 1.0.0  
> **Created**: 2024-12-24  
> **Related**: [validate-spec.sh](/.opencode/skill/system-spec-kit/scripts/validate-spec.sh)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Use Cases](#2-use-cases)
3. [Rule Definition Format](#3-rule-definition-format)
4. [Extension Points](#4-extension-points)
5. [Implementation Approaches](#5-implementation-approaches)
6. [API Design](#6-api-design)
7. [Future Considerations](#7-future-considerations)
8. [Recommendation](#8-recommendation)

---

## 1. Executive Summary

### Purpose

This document defines the architecture for extending `validate-spec.sh` with user-defined custom validation rules. Currently, the script supports four built-in rules:

| Rule ID              | Severity | Description                             |
| -------------------- | -------- | --------------------------------------- |
| `FILE_EXISTS`        | ERROR    | Required files present for level        |
| `PLACEHOLDER_FILLED` | ERROR    | No unfilled placeholders                |
| `SECTIONS_PRESENT`   | WARNING  | Required markdown sections exist        |
| `LEVEL_DECLARED`     | INFO     | Level explicitly stated in metadata     |

Custom rules will allow projects to enforce domain-specific quality requirements beyond these built-ins.

### Design Goals

1. **Simplicity**: Easy to define rules without programming knowledge
2. **Power**: Support complex validation logic when needed
3. **Compatibility**: Non-breaking addition to existing validate-spec.sh
4. **Performance**: Minimal impact on validation speed (<100ms overhead)
5. **Portability**: Rules work across macOS and Linux

---

## 2. Use Cases

### 2.1 Why Custom Rules?

Built-in rules cover generic spec folder quality. Projects often need:

- **Domain-specific standards** (API specs require OpenAPI version)
- **Team conventions** (certain sections always required)
- **Compliance requirements** (security docs must exist)
- **Integration checks** (referenced files must exist)

### 2.2 Example Custom Rules

#### Example 1: Webflow Project Standards

```yaml
# Require CSS variable usage in style-related specs
name: WEBFLOW_CSS_VARS
severity: warning
files: ["plan.md"]
pattern: "\\-\\-[a-z]+"
condition: present
message: "Style-related specs should document CSS custom properties"
when:
  folder_name: "*-style*"
```

#### Example 2: API Documentation

```yaml
# Require API endpoint documentation format
name: API_ENDPOINT_FORMAT
severity: error
files: ["spec.md"]
pattern: "^#{2,3}\\s+(GET|POST|PUT|DELETE|PATCH)\\s+/"
condition: present
message: "API specs must document endpoints with HTTP method headers"
when:
  has_file: "openapi.yaml"
```

#### Example 3: Security Review

```yaml
# Security-tagged specs need threat model
name: SECURITY_THREAT_MODEL
severity: error
files: ["spec.md", "decision-record.md"]
pattern: "## Threat Model|## Security Considerations"
condition: present
message: "Security-tagged specs require threat model section"
when:
  content_contains: "security|authentication|authorization"
```

#### Example 4: Cross-Reference Validation

```yaml
# Verify referenced files exist
name: REFERENCE_EXISTS
severity: warning
files: ["plan.md"]
pattern: "\\[.*\\]\\((\\.\\.\\/[^)]+)\\)"
condition: file_exists
message: "Referenced file does not exist: {match}"
```

#### Example 5: Checklist Conventions

```yaml
# P0 items must have owner assigned
name: P0_OWNER_REQUIRED
severity: error
files: ["checklist.md"]
pattern: "^- \\[ \\] \\*\\*P0\\*\\*.*@[a-zA-Z]+"
condition: absent_means_error
context_pattern: "^- \\[ \\] \\*\\*P0\\*\\*"
message: "All P0 items must have an @owner assigned"
```

#### Example 6: Memory File Structure

```yaml
# Memory files must have ANCHOR tags
name: MEMORY_ANCHORS
severity: error
files: ["memory/*.md"]
pattern: "<!-- ANCHOR_EXAMPLE:[a-z-]+ -->"
condition: paired
pair_pattern: "<!-- /ANCHOR_EXAMPLE:[a-z-]+ -->"
message: "Memory files require paired ANCHOR tags"
```

---

## 3. Rule Definition Format

### 3.1 Schema Overview

Rules are defined in YAML format with the following structure:

```yaml
# Required fields
name: RULE_NAME              # Unique identifier (SCREAMING_SNAKE_CASE)
severity: error|warning|info # Impact level
message: "Human-readable description"

# Target specification
files:                       # Files to check (glob patterns)
  - "spec.md"
  - "*.md"

# Validation logic (one of)
pattern: "regex pattern"     # Pattern to search for
script: "path/to/script.sh"  # External script to run
command: "grep -q 'text'"    # Inline command

# Pattern conditions
condition: present|absent|paired|file_exists|count_min|count_max
count: 3                     # For count_min/count_max

# Optional: When to apply
when:
  level: [2, 3]              # Only these documentation levels
  folder_name: "*-api*"      # Glob pattern for folder name
  has_file: "openapi.yaml"   # Folder must contain this file
  content_contains: "regex"  # Any file matches this pattern

# Optional: Remediation
remediation: |
  Add the required section:
  ## Security Considerations
  - Threat: ...
  - Mitigation: ...

# Optional: Metadata
enabled: true                # Can disable without removing
tags: ["security", "api"]    # For filtering
version: "1.0"               # Rule version
```

### 3.2 Complete Schema Definition

```yaml
# JSON Schema representation (for tooling/validation)
$schema: "http://json-schema.org/draft-07/schema#"
type: object
required: [name, severity, message]
properties:
  
  name:
    type: string
    pattern: "^[A-Z][A-Z0-9_]+$"
    description: "Unique rule identifier in SCREAMING_SNAKE_CASE"
    examples: ["SECURITY_REVIEW", "API_DOCS_REQUIRED"]
  
  severity:
    type: string
    enum: [error, warning, info]
    description: |
      error   - Validation fails (exit 2)
      warning - Validation warns (exit 1)
      info    - Informational only (exit 0)
  
  message:
    type: string
    description: "Human-readable message shown on failure"
    examples: ["API specs must include authentication section"]
  
  files:
    type: array
    items:
      type: string
    description: "Glob patterns for files to check"
    default: ["*.md"]
    examples:
      - ["spec.md"]
      - ["*.md", "!scratch/**"]
  
  pattern:
    type: string
    description: "Regex pattern for content validation"
  
  script:
    type: string
    description: "Path to external validation script"
  
  command:
    type: string
    description: "Inline shell command to execute"
  
  condition:
    type: string
    enum:
      - present       # Pattern must match at least once
      - absent        # Pattern must not match
      - paired        # Pattern must have closing pair
      - file_exists   # Captured groups are file paths that must exist
      - count_min     # Match count >= count value
      - count_max     # Match count <= count value
    default: present
  
  count:
    type: integer
    minimum: 0
    description: "Count threshold for count_min/count_max conditions"
  
  pair_pattern:
    type: string
    description: "Closing pattern for 'paired' condition"
  
  context_pattern:
    type: string
    description: "Pattern to find context for condition checking"
  
  when:
    type: object
    properties:
      level:
        oneOf:
          - type: integer
          - type: array
            items:
              type: integer
      folder_name:
        type: string
        description: "Glob pattern for spec folder name"
      has_file:
        type: string
        description: "File that must exist in folder"
      content_contains:
        type: string
        description: "Regex that must match in any file"
    description: "Conditions for rule application"
  
  remediation:
    type: string
    description: "Instructions for fixing the issue"
  
  enabled:
    type: boolean
    default: true
  
  tags:
    type: array
    items:
      type: string
  
  version:
    type: string
```

### 3.3 Variable Substitution

Rules support variable substitution in messages and remediation:

| Variable        | Description                          | Example Value                     |
| --------------- | ------------------------------------ | --------------------------------- |
| `{folder}`      | Spec folder path                     | `specs/007-auth/`                 |
| `{folder_name}` | Spec folder basename                 | `007-auth`                        |
| `{file}`        | Current file being checked           | `spec.md`                         |
| `{filepath}`    | Full file path                       | `specs/007-auth/spec.md`          |
| `{level}`       | Detected documentation level         | `2`                               |
| `{match}`       | First regex capture group            | `../missing-file.md`              |
| `{matches}`     | All matches (newline-separated)      | `file1.md\nfile2.md`              |
| `{line}`        | Line number of match                 | `42`                              |
| `{count}`       | Number of matches found              | `3`                               |

---

## 4. Extension Points

### 4.1 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        validate-spec.sh                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │ Built-in     │    │ Config-based │    │ Script-based │     │
│   │ Rules        │    │ Custom Rules │    │ Custom Rules │     │
│   │              │    │              │    │              │     │
│   │ FILE_EXISTS  │    │ .speckit.yaml│    │ .speckit/    │     │
│   │ PLACEHOLDER  │    │ or separate  │    │   rules/     │     │
│   │ SECTIONS     │    │ rule files   │    │   *.sh       │     │
│   │ LEVEL        │    │              │    │              │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│         │                    │                    │             │
│         └────────────────────┴────────────────────┘             │
│                              │                                  │
│                    ┌─────────▼─────────┐                       │
│                    │   Rule Engine     │                       │
│                    │                   │                       │
│                    │ • Load rules      │                       │
│                    │ • Check 'when'    │                       │
│                    │ • Execute checks  │                       │
│                    │ • Collect results │                       │
│                    └─────────┬─────────┘                       │
│                              │                                  │
│                    ┌─────────▼─────────┐                       │
│                    │  Result Reporter  │                       │
│                    │  (text/JSON)      │                       │
│                    └───────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Plugin Discovery

Custom rules are discovered from these locations (in order):

```
1. .speckit.yaml (inline rules section)
2. .speckit/rules/*.yaml (project rule files)
3. .speckit/rules/*.sh (script plugins)
4. ~/.speckit/rules/*.yaml (user global rules)
5. $SPECKIT_RULES_PATH/*.yaml (environment override)
```

Later sources can override earlier ones by rule name.

### 4.3 Script Plugin Interface

Script plugins receive context via environment variables:

```bash
#!/usr/bin/env bash
# .speckit/rules/my-custom-check.sh

# Input variables (set by validate-spec.sh)
# SPECKIT_FOLDER       - Absolute path to spec folder
# SPECKIT_FOLDER_NAME  - Basename of spec folder
# SPECKIT_LEVEL        - Detected documentation level (1/2/3)
# SPECKIT_FILES        - Newline-separated list of files
# SPECKIT_JSON         - "true" if JSON mode enabled

# Output: Write to stdout
# Exit codes:
#   0 = pass
#   1 = warning
#   2 = error

# Example: Check for TODO comments
if grep -r "TODO" "$SPECKIT_FOLDER"/*.md >/dev/null 2>&1; then
    echo "Found TODO comments in spec files"
    exit 1  # Warning
fi

exit 0  # Pass
```

### 4.4 Config-Based vs Script-Based

| Aspect              | Config-Based (.yaml)            | Script-Based (.sh)              |
| ------------------- | ------------------------------- | ------------------------------- |
| Complexity          | Simple pattern matching         | Arbitrary logic                 |
| Performance         | Fast (built-in regex)           | Slower (subprocess)             |
| Portability         | High (YAML is declarative)      | Medium (shell compatibility)    |
| Learning curve      | Low                             | Higher                          |
| Debugging           | Limited                         | Full shell debugging            |
| Use case            | 80% of custom rules             | Complex/multi-step validation   |

---

## 5. Implementation Approaches

### 5.1 Option A: External Rule Files (.speckit-rules.yaml)

**Description**: Dedicated rule files separate from main config.

```
project/
├── .speckit-rules.yaml      # Custom rules
├── .speckit.yaml            # Main config (optional)
└── specs/
```

**File format**:

```yaml
# .speckit-rules.yaml
version: "1.0"
rules:
  - name: SECURITY_SECTION
    severity: error
    files: ["spec.md"]
    pattern: "## Security"
    condition: present
    message: "All specs require a Security section"

  - name: NO_FIXME
    severity: warning
    files: ["*.md"]
    pattern: "FIXME"
    condition: absent
    message: "Resolve FIXME comments before completion"
```

**Pros**:
- Clear separation of concerns
- Easy to version control independently
- Can have multiple rule files (team, project, etc.)
- Supports rule file inheritance/composition

**Cons**:
- Another file to maintain
- Discoverability (users must know to look for it)
- Potential confusion with .speckit.yaml

### 5.2 Option B: Inline Rules in .speckit.yaml

**Description**: Rules embedded in main configuration file.

```yaml
# .speckit.yaml
version: "1.0"

# Main configuration
defaults:
  level: 2
  strict: false

# Validation settings
validation:
  enabled: true
  
  # Built-in rule overrides
  rules:
    FILE_EXISTS:
      enabled: true
    PLACEHOLDER_FILLED:
      severity: warning  # Downgrade from error
    SECTIONS_PRESENT:
      enabled: false     # Disable entirely
  
  # Custom rules (inline)
  custom:
    - name: CHANGELOG_REQUIRED
      severity: warning
      files: ["*.md"]
      pattern: "## Changelog"
      condition: present
      when:
        level: [2, 3]
      message: "Level 2+ specs should have a Changelog section"
```

**Pros**:
- Single configuration file
- Easy to discover (one place to look)
- Natural for small number of custom rules
- Built-in rule overrides in same place

**Cons**:
- Config file grows large with many rules
- Mixes concerns (config vs rules)
- Harder to share rules across projects

### 5.3 Option C: Script Plugins in .speckit/rules/

**Description**: Executable scripts in a dedicated directory.

```
project/
├── .speckit/
│   └── rules/
│       ├── security-check.sh
│       ├── api-validation.sh
│       └── link-checker.js
└── specs/
```

**Script example**:

```bash
#!/usr/bin/env bash
# .speckit/rules/security-check.sh
#
# RULE: SECURITY_AUDIT
# SEVERITY: error
# FILES: spec.md, decision-record.md
# MESSAGE: Security-tagged specs require audit trail
#

set -euo pipefail

# Check if security-related
if ! grep -qi "security\|auth" "$SPECKIT_FOLDER/spec.md" 2>/dev/null; then
    exit 0  # Not applicable
fi

# Check for audit section
if grep -q "## Security Audit" "$SPECKIT_FOLDER/decision-record.md" 2>/dev/null; then
    exit 0  # Pass
fi

echo "Security-tagged spec missing Security Audit section in decision-record.md"
exit 2  # Error
```

**Pros**:
- Maximum flexibility (any language)
- Full debugging capabilities
- Can call external tools
- Natural for complex validation

**Cons**:
- Requires programming knowledge
- Security considerations (executing arbitrary code)
- Performance overhead (subprocess per rule)
- Platform compatibility (shell differences)

### 5.4 Comparison Matrix

| Criterion               | Option A (Files) | Option B (Inline) | Option C (Scripts) |
| ----------------------- | ---------------- | ----------------- | ------------------ |
| Setup complexity        | Low              | Very Low          | Medium             |
| Rule complexity         | Medium           | Medium            | High               |
| Performance             | Fast             | Fast              | Slower             |
| Maintainability         | Good             | Good (small)      | Good               |
| Shareability            | Excellent        | Poor              | Good               |
| Learning curve          | Low              | Very Low          | Higher             |
| Debugging               | Limited          | Limited           | Full               |
| Security                | Safe             | Safe              | Needs review       |

### 5.5 Recommended: Hybrid Approach

Combine all three options with clear use-case guidance:

```
                    Simple Rules           Complex Rules
                         │                      │
                         ▼                      ▼
               ┌─────────────────┐    ┌─────────────────┐
Quick start →  │ .speckit.yaml   │    │ .speckit/rules/ │
               │ (inline custom) │    │ (scripts)       │
               └────────┬────────┘    └────────┬────────┘
                        │                      │
                        ▼                      │
               ┌─────────────────┐             │
Scaling up →   │ .speckit-rules/ │ ◄───────────┘
               │ *.yaml files    │
               └─────────────────┘
```

**Guidance**:
- **Start**: Inline rules in `.speckit.yaml` (0-5 rules)
- **Scale**: Move to `.speckit-rules/*.yaml` (5+ rules)
- **Complex**: Add `.speckit/rules/*.sh` for logic-heavy validation

---

## 6. API Design

### 6.1 Rule Context Object

Rules receive a context object (implemented as environment variables for shell):

```bash
# Available to all rules
SPECKIT_FOLDER="/path/to/specs/007-feature"
SPECKIT_FOLDER_NAME="007-feature"
SPECKIT_LEVEL="2"
SPECKIT_LEVEL_METHOD="explicit"  # or "inferred"
SPECKIT_FILES="spec.md:plan.md:tasks.md:checklist.md"
SPECKIT_JSON="false"
SPECKIT_STRICT="false"
SPECKIT_VERBOSE="false"

# File-specific (when checking individual files)
SPECKIT_FILE="spec.md"
SPECKIT_FILEPATH="/path/to/specs/007-feature/spec.md"
SPECKIT_FILE_CONTENT="..."  # For small files only
```

### 6.2 Result Reporting

#### Text Output (default)

```
✓ FILE_EXISTS: All required files present for Level 2
✗ SECURITY_SECTION: All specs require a Security section
    spec.md: Missing "## Security" header
    Remediation: Add section after Requirements
⚠ NO_FIXME: Resolve FIXME comments before completion
    plan.md:45: FIXME: add error handling
```

#### JSON Output (--json)

```json
{
  "folder": "/path/to/specs/007-feature",
  "level": 2,
  "results": [
    {
      "rule": "FILE_EXISTS",
      "status": "pass",
      "message": "All required files present for Level 2",
      "source": "builtin"
    },
    {
      "rule": "SECURITY_SECTION",
      "status": "fail",
      "severity": "error",
      "message": "All specs require a Security section",
      "source": "custom",
      "file": "spec.md",
      "details": {
        "pattern": "## Security",
        "condition": "present",
        "matches": 0
      },
      "remediation": "Add section after Requirements"
    },
    {
      "rule": "NO_FIXME",
      "status": "fail",
      "severity": "warning",
      "message": "Resolve FIXME comments before completion",
      "source": "custom",
      "matches": [
        {
          "file": "plan.md",
          "line": 45,
          "content": "FIXME: add error handling"
        }
      ]
    }
  ],
  "summary": {
    "errors": 1,
    "warnings": 1,
    "info": 0,
    "passed": false
  }
}
```

### 6.3 Error Handling

#### Rule Errors

When a rule itself fails (syntax error, script crash):

```json
{
  "rule": "BROKEN_RULE",
  "status": "error",
  "message": "Rule execution failed",
  "source": "custom",
  "error": {
    "type": "script_error",
    "code": 127,
    "stderr": "command not found: jq"
  }
}
```

#### Graceful Degradation

```yaml
# .speckit.yaml
validation:
  on_rule_error: warn  # warn | error | skip
```

- `warn`: Log warning, continue validation
- `error`: Treat as validation error
- `skip`: Silently skip broken rule

### 6.4 Rule Lifecycle Hooks

For script-based rules, optional lifecycle functions:

```bash
#!/usr/bin/env bash
# .speckit/rules/complex-check.sh

# Called once before checking any files
rule_init() {
    # Setup, caching, etc.
    CACHE_FILE=$(mktemp)
    export CACHE_FILE
}

# Called for each file (if FILES specified)
rule_check_file() {
    local file="$1"
    # Per-file validation
}

# Called once after all files
rule_check_folder() {
    # Cross-file validation
}

# Called for cleanup
rule_cleanup() {
    rm -f "$CACHE_FILE"
}

# Main execution
case "${1:-}" in
    --init) rule_init ;;
    --file) rule_check_file "$2" ;;
    --folder) rule_check_folder ;;
    --cleanup) rule_cleanup ;;
    *) 
        # Default: simple single-pass check
        rule_check_folder
        ;;
esac
```

---

## 7. Future Considerations

### 7.1 Rule Sharing and Distribution

#### Package Format

```
my-team-rules/
├── rules.yaml           # Rule definitions
├── scripts/             # Script-based rules
│   └── security.sh
├── README.md            # Documentation
└── package.json         # Metadata
{
  "name": "@myteam/speckit-rules",
  "version": "1.0.0",
  "speckit": {
    "rules": "rules.yaml",
    "scripts": "scripts/"
  }
}
```

#### Installation

```bash
# Future CLI command
speckit rules add @myteam/speckit-rules

# Or manual
# Copy to ~/.speckit/rules/myteam/
```

#### Registry

```yaml
# .speckit.yaml
extends:
  - "@speckit/security-rules"
  - "@myteam/api-standards"
  - "./local-rules.yaml"
```

### 7.2 Rule Versioning

```yaml
# Rule with version constraint
- name: API_DOCS_V2
  version: "2.0"
  min_speckit_version: "1.5.0"
  replaces: "API_DOCS"  # Supersedes older rule
```

### 7.3 Performance Implications

| Rule Count | Config-Based | Script-Based | Hybrid           |
| ---------- | ------------ | ------------ | ---------------- |
| 1-10       | <50ms        | <200ms       | <100ms           |
| 10-50      | <100ms       | <500ms       | <250ms           |
| 50-100     | <200ms       | ~1000ms      | <400ms           |

**Optimizations**:
- Parallel script execution
- Rule caching (skip unchanged files)
- Early termination on first error (optional)
- Lazy loading (only load applicable rules)

### 7.4 IDE Integration

Future LSP/editor integration:

```typescript
// Hypothetical VS Code extension API
interface SpeckitDiagnostic {
  rule: string;
  severity: DiagnosticSeverity;
  message: string;
  range: Range;
  source: "speckit";
  code: string;  // Rule ID
  codeDescription: {
    href: Uri;  // Link to rule docs
  };
  data: {
    remediation: string;
    quickFix?: CodeAction;
  };
}
```

### 7.5 Autofix Capability

```yaml
- name: MISSING_HEADER
  severity: warning
  pattern: "^# "
  condition: present
  message: "File should start with H1 header"
  autofix:
    type: prepend
    content: "# {folder_name}\n\n"
    confirm: true  # Require user confirmation
```

Autofix types:
- `prepend` / `append`
- `replace` (with capture groups)
- `insert_after` / `insert_before`
- `script` (custom fix script)

---

## 8. Recommendation

### Phased Implementation

| Phase | Scope                                  | Timeline  |
| ----- | -------------------------------------- | --------- |
| 1     | Config-based rules in .speckit.yaml    | MVP       |
| 2     | External rule files (.speckit-rules/)  | +2 weeks  |
| 3     | Script plugins (.speckit/rules/*.sh)   | +2 weeks  |
| 4     | Rule sharing/distribution              | Future    |
| 5     | IDE integration                        | Future    |
| 6     | Autofix                                | Future    |

### Phase 1 MVP Scope

Implement inline custom rules in `.speckit.yaml`:

```yaml
# .speckit.yaml
validation:
  custom:
    - name: RULE_NAME
      severity: error|warning|info
      files: ["*.md"]
      pattern: "regex"
      condition: present|absent
      message: "Description"
      when:
        level: [2, 3]
```

**Supported features**:
- Pattern conditions: `present`, `absent`
- When filters: `level`, `folder_name`
- Variable substitution: `{folder}`, `{file}`, `{match}`
- JSON output integration

**Deferred to Phase 2+**:
- Script plugins
- `paired` condition
- `file_exists` condition
- Rule inheritance/extends
- Remediation hints
- Autofix

### Success Criteria

Phase 1 complete when:
- [ ] Custom rules load from .speckit.yaml
- [ ] Rules execute in correct order (built-in → custom)
- [ ] Results appear in text and JSON output
- [ ] `when` filters work correctly
- [ ] Documentation updated
- [ ] Test coverage for custom rule engine

---

## Appendix A: Complete Examples

### A.1 Minimal Custom Rule

```yaml
# .speckit.yaml
validation:
  custom:
    - name: HAS_OVERVIEW
      severity: warning
      files: ["spec.md"]
      pattern: "## Overview"
      message: "Consider adding an Overview section"
```

### A.2 Level-Specific Rule

```yaml
- name: DECISION_RATIONALE
  severity: error
  files: ["decision-record.md"]
  pattern: "## Rationale|## Why"
  message: "Decision records must explain rationale"
  when:
    level: [3]
```

### A.3 Folder-Name Filtered Rule

```yaml
- name: API_OPENAPI_SPEC
  severity: error
  files: ["spec.md"]
  pattern: "openapi:|swagger:"
  message: "API specs must reference OpenAPI specification"
  when:
    folder_name: "*-api*"
```

### A.4 Multi-File Rule

```yaml
- name: CONSISTENT_NAMING
  severity: warning
  files: ["spec.md", "plan.md", "checklist.md"]
  pattern: "{folder_name}"
  message: "All files should reference the spec folder name"
```

### A.5 Script-Based Rule (Phase 3)

```bash
#!/usr/bin/env bash
# .speckit/rules/link-checker.sh
# Validates that all markdown links point to existing files

set -euo pipefail

errors=0

for file in "$SPECKIT_FOLDER"/*.md; do
    while IFS= read -r link; do
        target="${link#*](}"
        target="${target%)}"
        
        # Skip external URLs
        [[ "$target" == http* ]] && continue
        
        # Resolve relative path
        full_path="$SPECKIT_FOLDER/$target"
        
        if [[ ! -f "$full_path" ]]; then
            echo "$file: Broken link to $target"
            ((errors++))
        fi
    done < <(grep -oE '\[.*\]\([^)]+\)' "$file" 2>/dev/null || true)
done

if [[ $errors -gt 0 ]]; then
    exit 2  # Error
fi

exit 0  # Pass
```

---

## Appendix B: Migration Path

### From Ad-Hoc Validation

If you have custom grep/awk commands in CI:

```bash
# Before (CI script)
grep -q "## Security" specs/*/spec.md || exit 1
```

```yaml
# After (.speckit.yaml)
validation:
  custom:
    - name: SECURITY_SECTION
      severity: error
      files: ["spec.md"]
      pattern: "## Security"
      message: "All specs require Security section"
```

### From External Linters

If using markdownlint or similar:

```yaml
# Coexistence approach
validation:
  pre_hooks:
    - "npx markdownlint specs/*/**.md"
  custom:
    - name: SPECKIT_STRUCTURE
      # SpecKit-specific rules that markdownlint can't handle
```

---

*End of Design Document*
