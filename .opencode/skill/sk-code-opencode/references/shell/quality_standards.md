---
title: Shell Quality Standards
description: Code quality requirements, validation rules, and best practices for Bash scripts in the OpenCode development environment.
---

# Shell Quality Standards

Code quality requirements, validation rules, and best practices for Bash scripts in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Establishes quality gates and validation criteria that all Bash scripts must meet before being committed or deployed.

### Quality Tiers

| Tier | Requirement Level | Enforcement |
|------|-------------------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get approval |
| P2 | Recommended | Can defer with justification |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:p0-hard-blockers -->
## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Shebang Line

Every shell script must start with the portable shebang:

```bash
#!/usr/bin/env bash
```

**Evidence**: `lib/common.sh:1`

### Strict Mode

Every script must enable strict mode:

```bash
set -euo pipefail
```

| Flag | Purpose | Why Required |
|------|---------|--------------|
| `-e` | Exit on error | Prevents silent failures |
| `-u` | Error on undefined vars | Catches typos, missing args |
| `-o pipefail` | Pipe failure propagation | Catches hidden pipe errors |

**Evidence**: `spec/create.sh:22`

### Double-Quoted Variables

ALL variable expansions must be double-quoted:

```bash
# Correct
echo "$variable"
file_path="$1"
[[ -f "$file" ]]

# WRONG - WILL FAIL VALIDATION
echo $variable
file_path=$1
[[ -f $file ]]
```

**Exceptions**: Only inside `[[ ]]` arithmetic contexts:
```bash
# OK without quotes in arithmetic
if (( count > 10 )); then
```

### File Header Present

Every script must have a header comment block:

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description of script purpose
```

### No Commented-Out Code

Remove all commented-out code. Use version control for history.

```bash
# WRONG - remove this
# old_function() {
#     echo "deprecated"
# }

# OK - explanatory comment
# Note: Using -f flag because...
```

### WHY Comments for Non-Obvious Code

Complex logic must include comments explaining WHY:

```bash
# WRONG - describes what (obvious)
# Loop through files
for f in *.md; do

# CORRECT - explains why
# Process only markdown files to avoid binary file corruption
for f in *.md; do
```

---

<!-- /ANCHOR:p0-hard-blockers -->
<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

These items must be addressed or receive explicit approval to defer.

### Function Naming

All functions must use `lowercase_with_underscores`:

```bash
# Correct
validate_input() { ... }
process_file() { ... }

# WRONG
validateInput() { ... }    # camelCase
ProcessFile() { ... }      # PascalCase
```

**Evidence**: `lib/common.sh:47-88`

### Local Variables in Functions

All function variables must be declared local:

```bash
# Correct
process_file() {
    local file_path="$1"
    local result=""
    # ...
}

# WRONG - pollutes global scope
process_file() {
    file_path="$1"
    result=""
}
```

### Exit Codes Documented

Non-trivial scripts must document exit codes:

```bash
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments
#   2 - File not found
#   3 - Permission denied
```

### Error Output to stderr

All errors must go to stderr:

```bash
# Correct
echo "Error: file not found" >&2
printf "${RED}ERROR:${NC} %s\n" "$msg" >&2

# WRONG - error to stdout
echo "Error: file not found"
```

### TODOs With Context

TODOs must include owner or ticket:

```bash
# Correct
# TODO(username): Add input validation
# TODO(TICKET-123): Handle edge case

# WRONG
# TODO: fix this later
```

---

<!-- /ANCHOR:p1-required -->
<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

These items improve quality but can be deferred.

### POSIX Portability

When possible, avoid bash-specific features for portability:

```bash
# More portable
command -v program >/dev/null 2>&1

# Bash-specific (but OK in OpenCode context)
type -t program >/dev/null 2>&1
```

### Consistent Color Scheme

Use the standard color definitions:

```bash
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi
```

**Evidence**: `lib/common.sh:13-22`

### Function Documentation

Functions should have comment blocks:

```bash
# Validate that a file exists and is readable
# Args:
#   $1 - File path to validate
# Returns:
#   0 if valid, 1 if invalid
validate_file() {
    local file_path="$1"
    # ...
}
```

### ShellCheck Compliance

Scripts should pass ShellCheck without warnings:

```bash
# Check with shellcheck
shellcheck script.sh
```

---

<!-- /ANCHOR:p2-recommended -->
<!-- ANCHOR:validation-patterns -->
## 5. VALIDATION PATTERNS

### Input Validation Pattern

```bash
validate_args() {
    # Check argument count
    if [[ $# -lt 1 ]]; then
        echo "Error: Missing required argument" >&2
        echo "Usage: $0 <input_file> [output_dir]" >&2
        return 1
    fi

    local input_file="$1"

    # Check file exists
    if [[ ! -f "$input_file" ]]; then
        echo "Error: File not found: $input_file" >&2
        return 1
    fi

    # Check file is readable
    if [[ ! -r "$input_file" ]]; then
        echo "Error: Cannot read: $input_file" >&2
        return 1
    fi

    return 0
}
```

### Safe File Operations

```bash
# Check before operating
if [[ -f "$file" ]]; then
    rm "$file"
fi

# Or use conditional
[[ -f "$file" ]] && rm "$file"

# Safe directory creation
mkdir -p "$output_dir"

# Safe temporary files
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT
```

### Process Exit Pattern

```bash
main() {
    # Validation
    validate_args "$@" || exit 1

    # Processing
    if ! process_files; then
        log_error "PROCESS" "Processing failed"
        exit 2
    fi

    # Success
    log_pass "DONE" "Completed successfully"
    exit 0
}

main "$@"
```

---

<!-- /ANCHOR:validation-patterns -->
<!-- ANCHOR:error-handling -->
## 6. ERROR HANDLING

### Exit Code Standards

| Code | Meaning | Usage |
|------|---------|-------|
| 0 | Success | Normal completion |
| 1 | General error | Invalid args, validation failure |
| 2 | Misuse | Command syntax error |
| 126 | Not executable | Permission issues |
| 127 | Not found | Command not found |

### Error Recovery Pattern

```bash
# Try operation with fallback
if ! primary_command; then
    log_warn "PRIMARY" "Failed, trying fallback"
    fallback_command || {
        log_error "FALLBACK" "Both methods failed"
        exit 1
    }
fi
```

### Cleanup on Exit

```bash
TEMP_FILES=()

cleanup() {
    for f in "${TEMP_FILES[@]}"; do
        [[ -f "$f" ]] && rm -f "$f"
    done
}

trap cleanup EXIT

# Usage
TEMP_FILE=$(mktemp)
TEMP_FILES+=("$TEMP_FILE")
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:output-standards -->
## 7. OUTPUT STANDARDS

### Message Format

Use consistent formatting for different message types:

```bash
# Status messages
log_pass "RULE" "Description of success"
log_warn "RULE" "Description of warning"
log_error "RULE" "Description of error"
log_info "RULE" "Informational message"
```

**Evidence**: `lib/common.sh:47-88`

### JSON Mode Support

For scripts used by other tools, support JSON output:

```bash
JSON_MODE=false

# Parse --json flag
[[ "${1:-}" == "--json" ]] && JSON_MODE=true

# Output based on mode
if [[ "$JSON_MODE" == true ]]; then
    printf '{"status":"success","files":%d}\n' "$count"
else
    printf "Processed %d files\n" "$count"
fi
```

### Progress Indicators

For long-running operations:

```bash
# Simple progress
echo "Processing file $i of $total..."

# With percentage
printf "\rProgress: %d%%" "$((i * 100 / total))"
```

---

<!-- /ANCHOR:output-standards -->
<!-- ANCHOR:security-considerations -->
## 8. SECURITY CONSIDERATIONS

### Avoid eval

Never use eval with user input:

```bash
# DANGEROUS
eval "$user_input"

# Safe alternative - use case statements
case "$action" in
    start) start_service ;;
    stop) stop_service ;;
    *) echo "Unknown action" >&2; exit 1 ;;
esac
```

### Quote All Paths

Especially important for paths with spaces:

```bash
# Always quote paths
cd "$directory"
cat "$file_path"
rm "$temp_file"
```

### Validate External Input

```bash
# Validate before use
if [[ ! "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "Error: Invalid characters in input" >&2
    exit 1
fi
```

---

<!-- /ANCHOR:security-considerations -->
<!-- ANCHOR:code-review-checklist -->
## 9. REVIEW HANDOFF (SK-CODE--REVIEW BASELINE)

Use `sk-code-review` for formal findings-first review output and severity handling. Keep this file focused on shell technical standards.

For review runs:

1. Use `sk-code-review/references/quick_reference.md` for severity model and output contract.
2. Use `sk-code-review/references/code_quality_checklist.md`, `security_checklist.md`, and `test_quality_checklist.md` for baseline risk checks.
3. Cite this shell standards file as the overlay source for shell-specific findings.

---

<!-- /ANCHOR:code-review-checklist -->
<!-- ANCHOR:shellcheck-integration -->
## 10. SHELLCHECK INTEGRATION

### Running ShellCheck

```bash
# Check single file
shellcheck script.sh

# Check all scripts
find . -name "*.sh" -exec shellcheck {} \;

# Ignore specific rules
shellcheck -e SC2034 script.sh  # Ignore unused variable warning
```

### Common ShellCheck Warnings

| Code | Issue | Fix |
|------|-------|-----|
| SC2086 | Unquoted variable | Quote: `"$var"` |
| SC2034 | Unused variable | Remove or use |
| SC2155 | Declare and assign separately | Split declaration |
| SC2164 | Use `cd ... \|\| exit` | Add error handling |

### Inline Directives

```bash
# Disable for single line
# shellcheck disable=SC2034
UNUSED_VAR="value"

# Disable for block
# shellcheck disable=SC2034,SC2086
problematic_function() {
    ...
}
```

---

<!-- /ANCHOR:shellcheck-integration -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Internal References
- [style_guide.md](./style_guide.md) - Formatting and conventions
- [quick_reference.md](./quick_reference.md) - Quick lookup

### External Tools
- [ShellCheck](https://www.shellcheck.net/) - Static analysis
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
<!-- /ANCHOR:related-resources -->
