---
title: Shell Quick Reference
description: Fast lookup for Bash scripting patterns, syntax, and common structures in OpenCode.
---

# Shell Quick Reference

Fast lookup for Bash scripting patterns, syntax, and common structures in OpenCode.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Quick-access reference card for Bash patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:file-template -->
## 2. FILE TEMPLATE

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description of what this script does.
#
# Usage: script.sh [options] <arguments>
#
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments
#   2 - Processing error

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "$0")"

# ───────────────────────────────────────────────────────────────
# 2. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

# ───────────────────────────────────────────────────────────────
# 3. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

log_info() { printf "${BLUE}INFO:${NC} %s\n" "$1"; }
log_pass() { printf "${GREEN}PASS:${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}WARN:${NC} %s\n" "$1" >&2; }
log_error() { printf "${RED}ERROR:${NC} %s\n" "$1" >&2; }

show_help() {
    cat << EOF
Usage: $SCRIPT_NAME [options] <input>

Options:
    -h, --help      Show this help
    -v, --verbose   Verbose output
    -o, --output    Output directory

Examples:
    $SCRIPT_NAME file.txt
    $SCRIPT_NAME -o ./out file.txt
EOF
}

# ───────────────────────────────────────────────────────────────
# 4. MAIN LOGIC
# ───────────────────────────────────────────────────────────────

main() {
    # Validate arguments
    if [[ $# -lt 1 ]]; then
        log_error "Missing required argument"
        show_help
        exit 1
    fi

    local input="$1"

    # Process
    log_info "Processing: $input"

    # Success
    log_pass "Complete"
}

main "$@"
```

---

<!-- /ANCHOR:file-template -->
<!-- ANCHOR:naming-conventions -->
## 3. NAMING CONVENTIONS

| Element | Convention | Example |
|---------|------------|---------|
| Functions | snake_case | `validate_input()` |
| Local vars | snake_case | `local file_path="$1"` |
| Constants | UPPER_SNAKE | `readonly MAX_SIZE=100` |
| Private funcs | _prefix | `_internal_helper()` |
| Script files | kebab-case | `process-files.sh` |

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:variable-handling -->
## 4. VARIABLE HANDLING

### Declaration

```bash
# Local variables (in functions)
local file_path="$1"
local -r readonly_var="value"    # Local readonly
local -i count=0                  # Integer
local -a array=()                 # Array

# Global constants
readonly MAX_RETRIES=3
readonly -a VALID_TYPES=("a" "b" "c")

# Default values
output="${2:-./output}"           # Default if unset
timeout="${TIMEOUT:-30}"          # From env or default
required="${REQUIRED:?Must set}"  # Error if unset
```

### Arrays

```bash
# Declaration
files=()
files=("one.txt" "two.txt" "three.txt")

# Append
files+=("four.txt")

# Access
echo "${files[0]}"        # First element
echo "${files[@]}"        # All elements
echo "${#files[@]}"       # Count
echo "${files[-1]}"       # Last element

# Iteration
for f in "${files[@]}"; do
    echo "$f"
done
```

---

<!-- /ANCHOR:variable-handling -->
<!-- ANCHOR:conditionals -->
## 5. CONDITIONALS

### String Tests

```bash
[[ -z "$var" ]]           # Empty
[[ -n "$var" ]]           # Not empty
[[ "$a" == "$b" ]]        # Equal
[[ "$a" != "$b" ]]        # Not equal
[[ "$a" == *.txt ]]       # Glob match
[[ "$a" =~ ^[0-9]+$ ]]    # Regex match
[[ "$a" < "$b" ]]         # Alphabetically less
```

### Numeric Tests

```bash
[[ "$a" -eq "$b" ]]       # Equal
[[ "$a" -ne "$b" ]]       # Not equal
[[ "$a" -lt "$b" ]]       # Less than
[[ "$a" -le "$b" ]]       # Less or equal
[[ "$a" -gt "$b" ]]       # Greater than
[[ "$a" -ge "$b" ]]       # Greater or equal

# Arithmetic context
(( a == b ))
(( a > 10 ))
(( count++ ))
```

### File Tests

```bash
[[ -e "$path" ]]          # Exists
[[ -f "$path" ]]          # Regular file
[[ -d "$path" ]]          # Directory
[[ -r "$path" ]]          # Readable
[[ -w "$path" ]]          # Writable
[[ -x "$path" ]]          # Executable
[[ -s "$path" ]]          # Non-empty file
[[ -L "$path" ]]          # Symlink
[[ "$a" -nt "$b" ]]       # a newer than b
[[ "$a" -ot "$b" ]]       # a older than b
```

### Compound Tests

```bash
[[ cond1 && cond2 ]]      # AND
[[ cond1 || cond2 ]]      # OR
[[ ! condition ]]         # NOT
```

---

<!-- /ANCHOR:conditionals -->
<!-- ANCHOR:loops -->
## 6. LOOPS

### For Loops

```bash
# Over list
for item in a b c; do
    echo "$item"
done

# Over array
for f in "${files[@]}"; do
    echo "$f"
done

# Over glob
for f in *.txt; do
    [[ -f "$f" ]] || continue
    echo "$f"
done

# C-style
for ((i=0; i<10; i++)); do
    echo "$i"
done

# Range
for i in {1..10}; do
    echo "$i"
done
```

### While Loops

```bash
# Standard while
while [[ condition ]]; do
    # ...
done

# Read lines from file
while IFS= read -r line; do
    echo "$line"
done < file.txt

# Read lines from command
while IFS= read -r line; do
    echo "$line"
done < <(some_command)

# Infinite with break
while true; do
    [[ condition ]] && break
done
```

---

<!-- /ANCHOR:loops -->
<!-- ANCHOR:functions -->
## 7. FUNCTIONS

### Definition

```bash
# Basic function
my_function() {
    local arg1="$1"
    local arg2="${2:-default}"

    # Do something
    echo "$arg1 $arg2"
    return 0
}

# Call
my_function "value1" "value2"
result=$(my_function "value1")
```

### Return Values

```bash
# Return status (0-255)
validate() {
    [[ -f "$1" ]] || return 1
    [[ -r "$1" ]] || return 2
    return 0
}

# Check return
if validate "$file"; then
    echo "Valid"
fi

# Return string via stdout
get_value() {
    echo "result"
}
value=$(get_value)
```

---

<!-- /ANCHOR:functions -->
<!-- ANCHOR:argument-parsing -->
## 8. ARGUMENT PARSING

### Simple Positional

```bash
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <input>" >&2
    exit 1
fi

input="$1"
output="${2:-./output}"
```

### Flags with While

```bash
VERBOSE=false
OUTPUT=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -o|--output)
            OUTPUT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        --)
            shift
            break
            ;;
        -*)
            echo "Unknown: $1" >&2
            exit 1
            ;;
        *)
            ARGS+=("$1")
            shift
            ;;
    esac
done
```

---

<!-- /ANCHOR:argument-parsing -->
<!-- ANCHOR:string-operations -->
## 9. STRING OPERATIONS

### Substitution

```bash
${var:-default}           # Default if unset
${var:=default}           # Assign default if unset
${var:+alt}               # alt if var is set
${var:?error}             # Error if unset

${#var}                   # Length
${var#pattern}            # Remove shortest prefix
${var##pattern}           # Remove longest prefix
${var%pattern}            # Remove shortest suffix
${var%%pattern}           # Remove longest suffix
${var/old/new}            # Replace first
${var//old/new}           # Replace all
${var^}                   # Uppercase first
${var^^}                  # Uppercase all
${var,}                   # Lowercase first
${var,,}                  # Lowercase all
```

### Examples

```bash
file="/path/to/file.txt"
echo "${file##*/}"        # file.txt (basename)
echo "${file%/*}"         # /path/to (dirname)
echo "${file%.txt}"       # /path/to/file
echo "${file##*.}"        # txt (extension)
```

---

<!-- /ANCHOR:string-operations -->
<!-- ANCHOR:common-patterns -->
## 10. COMMON PATTERNS

### Safe Temp Files

```bash
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT
```

### Find Script Directory

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

### Check Command Exists

```bash
if command -v jq >/dev/null 2>&1; then
    echo "jq available"
fi
```

### Process Substitution

```bash
# Read from command output
while read -r line; do
    echo "$line"
done < <(find . -name "*.txt")

# Compare outputs
diff <(sort file1) <(sort file2)
```

### Here Documents

```bash
cat << 'EOF'
Literal content
No $variable expansion
EOF

cat << EOF
Content with $variable expansion
EOF
```

---

<!-- /ANCHOR:common-patterns -->
<!-- ANCHOR:quality-checklist -->
## 11. QUALITY CHECKLIST

```markdown
P0 - Must Fix:
[ ] #!/usr/bin/env bash
[ ] set -euo pipefail
[ ] All vars quoted: "$var"
[ ] File header present
[ ] No commented code
[ ] WHY-focused comments only (max 3/10 lines)

P1 - Required:
[ ] snake_case functions
[ ] local variables
[ ] Exit codes documented
[ ] Errors to stderr
[ ] TODOs with context

P2 - Recommended:
[ ] Standard colors
[ ] Function docs
[ ] ShellCheck clean
```

---

<!-- /ANCHOR:quality-checklist -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Detailed style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements
- [ShellCheck](https://www.shellcheck.net/) - Static analysis
<!-- /ANCHOR:related-resources -->
