---
title: Shell Style Guide
description: Coding conventions and formatting standards for Bash scripts in the OpenCode development environment.
---

# Shell Style Guide

Coding conventions and formatting standards for Bash scripts in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines consistent styling rules for Bash scripts to ensure reliability, readability, and maintainability across all OpenCode shell scripts.

### Scope

Applies to all shell files in:
- `.opencode/skill/*/scripts/` - Skill automation scripts
- `.opencode/agent/scripts/` - Agent provider scripts
- `scripts/` - Build and deployment scripts

### Key Sources

| File | Evidence |
|------|----------|
| `lib/common.sh` | Color definitions, logging functions, utilities |
| `spec/create.sh` | Strict mode, argument parsing, control flow |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:file-structure -->
## 2. FILE STRUCTURE

### Shebang Line

**ALWAYS** use the portable bash shebang:

```bash
#!/usr/bin/env bash
```

**Evidence**: `lib/common.sh:1`

### File Header

Use the standard header format for identification:

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description of what this script does.
#
# Usage: script.sh [options] <arguments>
```

**Alternative** (detailed header for major scripts):

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: CREATE SPEC FOLDER
# ───────────────────────────────────────────────────────────────
# Creates spec folder with templates based on documentation level.
#
# TEMPLATE ARCHITECTURE (v2.0 - CORE + ADDENDUM):
#   templates/
#   ├── level_1/        # Core only (~270 LOC total)
#   ├── level_2/        # Core + Verification (~390 LOC)
#   └── level_3/        # Core + Verification + Architecture (~540 LOC)
```

**Evidence**: `spec/create.sh:1-20`

### Strict Mode

**ALWAYS** enable strict mode immediately after the shebang/header:

```bash
set -euo pipefail
```

| Flag | Purpose |
|------|---------|
| `-e` | Exit on error (non-zero return) |
| `-u` | Error on undefined variables |
| `-o pipefail` | Pipe fails if any command fails |

**Evidence**: `spec/create.sh:22`

### Section Organization

Organize code into numbered sections:

```bash
# ───────────────────────────────────────────────────────────────
# 1. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# ───────────────────────────────────────────────────────────────
# 2. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

log_info() {
    printf "${BLUE}INFO:${NC} %s\n" "$1"
}
```

**Evidence**: `lib/common.sh:9-35`

---

<!-- /ANCHOR:file-structure -->
<!-- ANCHOR:naming-conventions -->
## 3. NAMING CONVENTIONS

### Functions

**Use**: `lowercase_with_underscores`

```bash
# Public functions
validate_input() {
    local input="$1"
    # ...
}

process_file() {
    local file_path="$1"
    # ...
}
```

### Private/Internal Functions

**Use**: Single underscore prefix for helpers:

```bash
# Internal helper function
_json_escape() {
    local str="$1"
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    printf '%s' "$str"
}
```

**Evidence**: `lib/common.sh:37-45`

### Variables

**Use**: `lowercase_with_underscores` for local variables:

```bash
local file_path="$1"
local output_dir="${2:-./output}"
local is_valid=true
```

### Constants and Global Variables

**Use**: `UPPER_SNAKE_CASE` for constants and script-level variables:

```bash
readonly MAX_RETRIES=3
readonly DEFAULT_TIMEOUT=30

# Script-level state
ERRORS=0
WARNINGS=0
JSON_MODE=false
```

**Evidence**: `lib/common.sh:28-31`, `spec/create.sh:24-33`

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:color-definitions -->
## 4. COLOR DEFINITIONS

### Standard Color Setup

Define colors with terminal detection:

```bash
# ───────────────────────────────────────────────────────────────
# COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'  # No Color / Reset

# Disable colors if not terminal (for piping/logging)
if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi
```

**Evidence**: `lib/common.sh:13-22`

### Usage in Output

```bash
# Colored output
printf "${GREEN}SUCCESS:${NC} %s\n" "$message"
printf "${RED}ERROR:${NC} %s\n" "$error" >&2
printf "${YELLOW}WARNING:${NC} %s\n" "$warning"
```

---

<!-- /ANCHOR:color-definitions -->
<!-- ANCHOR:logging-functions -->
## 5. LOGGING FUNCTIONS

### Standard Logging Pattern

```bash
log_pass() {
    local rule="$1"
    local message="$2"
    printf "${GREEN}[PASS]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
}

log_warn() {
    local rule="$1"
    local message="$2"
    printf "${YELLOW}[WARN]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message" >&2
    ((WARNINGS++))
}

log_error() {
    local rule="$1"
    local message="$2"
    printf "${RED}[ERROR]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message" >&2
    ((ERRORS++))
}

log_info() {
    local rule="$1"
    local message="$2"
    printf "${BLUE}[INFO]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
}
```

**Evidence**: `lib/common.sh:47-88`

### Detail Logging

For sub-items or additional context:

```bash
log_detail() {
    printf "    - %s\n" "$1"
}
```

**Evidence**: `lib/common.sh:90-92`

### Inline Comments

Follow the universal commenting principles (see `../shared/universal_patterns.md`):

1. **Quantity limit:** Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does
3. **Focus on WHY, not WHAT:** Explain intent, constraints, reasoning
4. **No commented-out code:** Delete unused code (git preserves history)

**Good - explains reasoning:**

```bash
# Skip if output directory already exists to prevent data loss
if [[ -d "$output_dir" ]]; then
    log_error "Output directory already exists"
    exit 1
fi

# Strict mode must catch pipe failures in complex commands
set -o pipefail

# T107/REQ-033: pending file recovery transaction manager
source "$SCRIPT_DIR/lib/transaction.sh"
```

**Bad - narrates implementation:**

```bash
# Set the variable to output
output_dir="./output"

# Loop through files
for file in *.sh; do
    echo "$file"
done
```

### Capitalization

All comment text MUST start with a capital letter:

```bash
# Reverse order preserves dependency chain     # correct
# reverse order preserves dependency chain     # wrong
```

**Exceptions**: Directives like `shellcheck disable`, inline code references, and technical identifiers.

### Function Purpose Comments

Brief description above function:

```bash
# Validate JSON file against schema
# Returns 0 on success, 1 on validation error
validate_json() {
    local file="$1"
    local schema="$2"
    # implementation
}
```

---

<!-- /ANCHOR:logging-functions -->
<!-- ANCHOR:variable-handling -->
## 6. VARIABLE HANDLING

### Always Quote Variables

**ALWAYS** double-quote variable expansions:

```bash
# Correct
file_path="$1"
echo "$file_path"
if [[ -f "$file_path" ]]; then

# WRONG - unquoted variables
file_path=$1
echo $file_path
if [[ -f $file_path ]]; then
```

### Local Variables

**ALWAYS** declare local variables in functions:

```bash
process_file() {
    local file_path="$1"
    local output_dir="$2"
    local result=""

    # Use locals within function
    result=$(do_something "$file_path")
    echo "$result"
}
```

### Default Values

Use parameter expansion for defaults:

```bash
# Default value if not set
output_dir="${2:-./output}"

# Default value if empty or not set
timeout="${TIMEOUT:-30}"

# Error if not set
required_var="${REQUIRED_VAR:?Error: REQUIRED_VAR must be set}"
```

**Evidence**: `spec/create.sh:27`

---

<!-- /ANCHOR:variable-handling -->
<!-- ANCHOR:conditional-expressions -->
## 7. CONDITIONAL EXPRESSIONS

### Use [[ ]] for Tests

**ALWAYS** use `[[ ]]` over `[ ]`:

```bash
# Correct - modern bash test
if [[ -f "$file" ]]; then
if [[ "$string" == "value" ]]; then
if [[ "$number" -gt 10 ]]; then

# WRONG - POSIX test (less safe)
if [ -f "$file" ]; then
if [ "$string" = "value" ]; then
```

### String Comparisons

```bash
# Equality
if [[ "$var" == "value" ]]; then

# Pattern matching
if [[ "$var" == *.md ]]; then

# Regex matching
if [[ "$var" =~ ^[0-9]+$ ]]; then

# Empty/non-empty
if [[ -z "$var" ]]; then    # Empty
if [[ -n "$var" ]]; then    # Non-empty
```

### File Tests

```bash
if [[ -f "$path" ]]; then   # Is regular file
if [[ -d "$path" ]]; then   # Is directory
if [[ -e "$path" ]]; then   # Exists
if [[ -r "$path" ]]; then   # Is readable
if [[ -w "$path" ]]; then   # Is writable
if [[ -x "$path" ]]; then   # Is executable
```

---

<!-- /ANCHOR:conditional-expressions -->
<!-- ANCHOR:argument-parsing -->
## 8. ARGUMENT PARSING

### Simple Arguments

```bash
#!/usr/bin/env bash
set -euo pipefail

# Positional arguments
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <input_file>" >&2
    exit 1
fi

input_file="$1"
output_dir="${2:-./output}"
```

### Flag Parsing Pattern

```bash
# Initialize defaults
JSON_MODE=false
VERBOSE=false
OUTPUT_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --output|-o)
            if [[ $# -lt 2 ]]; then
                echo "Error: --output requires a value" >&2
                exit 1
            fi
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        -*)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
        *)
            # Positional argument
            ARGS+=("$1")
            shift
            ;;
    esac
done
```

**Evidence**: `spec/create.sh:42-60`

---

<!-- /ANCHOR:argument-parsing -->
<!-- ANCHOR:functions -->
## 9. FUNCTIONS

### Function Definition

```bash
# Function with documentation
validate_file() {
    # Validate that a file exists and is readable
    # Args:
    #   $1 - File path to validate
    # Returns:
    #   0 if valid, 1 if invalid

    local file_path="$1"

    if [[ ! -f "$file_path" ]]; then
        log_error "FILE" "Not found: $file_path"
        return 1
    fi

    if [[ ! -r "$file_path" ]]; then
        log_error "FILE" "Not readable: $file_path"
        return 1
    fi

    return 0
}
```

### Return Values

Use return codes for success/failure:

```bash
# Return 0 for success
do_something || return 1

# Return specific codes for different errors
validate() {
    [[ -f "$1" ]] || return 1  # File not found
    [[ -r "$1" ]] || return 2  # Not readable
    return 0                    # Success
}
```

---

<!-- /ANCHOR:functions -->
<!-- ANCHOR:error-handling -->
## 10. ERROR HANDLING

### Exit on Error

```bash
# Exit immediately on error (from strict mode)
set -e

# Or check explicitly
command || {
    echo "Error: command failed" >&2
    exit 1
}
```

### Trap for Cleanup

```bash
cleanup() {
    # Remove temp files
    [[ -n "${TEMP_FILE:-}" ]] && rm -f "$TEMP_FILE"
}

trap cleanup EXIT
```

### Error Messages to stderr

```bash
# Always send errors to stderr
echo "Error: something went wrong" >&2
printf "${RED}ERROR:${NC} %s\n" "$message" >&2
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:output-formatting -->
## 11. OUTPUT FORMATTING

### Printf vs Echo

Prefer `printf` for formatted output:

```bash
# Printf - more portable, better formatting
printf "Processing: %s\n" "$filename"
printf "Found %d files\n" "$count"
printf "${GREEN}SUCCESS${NC}\n"

# Echo - simple messages only
echo "Starting process..."
```

### JSON Output

```bash
# JSON output mode
if [[ "$JSON_MODE" == true ]]; then
    printf '{"status":"success","count":%d}\n' "$count"
else
    printf "Found %d items\n" "$count"
fi
```

---

<!-- /ANCHOR:output-formatting -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Internal References
- [quality_standards.md](./quality_standards.md) - Quality requirements
- [quick_reference.md](./quick_reference.md) - Quick lookup

### External Standards
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck](https://www.shellcheck.net/) - Static analysis tool
<!-- /ANCHOR:related-resources -->
