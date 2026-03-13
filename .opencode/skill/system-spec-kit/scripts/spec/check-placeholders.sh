#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: CHECK PLACEHOLDERS
# ───────────────────────────────────────────────────────────────
# Scan spec folder .md files for remaining bracket placeholder
# Patterns after upgrade-level.sh + auto-populate.
# Bash 3.2+ compatible (macOS and Linux).

set -euo pipefail

VERSION="1.0.0"

# Colors (disabled for non-TTY)
if [[ -t 1 ]]; then
    RED='\033[0;31m' GREEN='\033[0;32m' YELLOW='\033[1;33m' BOLD='\033[1m' NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BOLD='' NC=''
fi

# ─── Usage ────────────────────────────────────────────────────
usage() {
    cat <<EOF
Usage: $(basename "$0") <spec-folder> [OPTIONS]

Scan a spec folder for remaining bracket placeholder patterns.

Arguments:
  <spec-folder>    Path to spec folder (e.g., specs/042-feature/)

Options:
  --json           Output results in JSON format
  --verbose        Show each match with file and line number
  --help, -h       Show this help message

Exit codes:
  0  No placeholders found (PASS)
  1  Placeholders found (FAIL)
  2  Invalid arguments or folder not found

Examples:
  $(basename "$0") specs/042-feature/
  $(basename "$0") specs/042-feature/ --verbose
  $(basename "$0") specs/042-feature/ --json
EOF
}

# ─── Args ─────────────────────────────────────────────────────
FOLDER_PATH=""
JSON_MODE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)     JSON_MODE=true; shift ;;
        --verbose)  VERBOSE=true; shift ;;
        --help|-h)  usage; exit 0 ;;
        -*)         echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
        *)
            if [[ -z "$FOLDER_PATH" ]]; then
                FOLDER_PATH="$1"
            else
                echo "Error: unexpected argument '$1'" >&2
                usage >&2
                exit 2
            fi
            shift
            ;;
    esac
done

if [[ -z "$FOLDER_PATH" ]]; then
    echo "Error: spec folder path required" >&2
    usage >&2
    exit 2
fi

# Normalize trailing slash
FOLDER_PATH="${FOLDER_PATH%/}"

if [[ ! -d "$FOLDER_PATH" ]]; then
    echo "Error: folder not found: $FOLDER_PATH" >&2
    exit 2
fi

# ─── Placeholder patterns ────────────────────────────────────
# Match bracket patterns that look like template placeholders:
#   [Response time target], [Low/Med/High], [Component A],
#   [YOUR_VALUE_HERE], [PLACEHOLDER], etc.
#
# Exclude patterns that are NOT placeholders:
#   [x] / [ ] (checkbox), [P0] / [P1] / [P2] (priority tags),
#   [SPECKIT...] (markers), [ANCHOR...] (anchors),
#   [EVIDENCE...] (checklist evidence), [W:...] (workstream),
#   [NEEDS CLARIFICATION] (spec markers), [B] (blocked task)
#
# Also exclude lines where brackets appear inside code blocks
# (backtick-wrapped) since those describe placeholder concepts
# Rather than being actual unfilled placeholders.

TOTAL=0
MATCHES=""

# Process each .md file (skip backup/temp directories)
while IFS= read -r file; do
    # Skip backup directories and non-template subfolders.
    # Memory/ contains generated session context markdown that legitimately
    # Uses bracketed TOC links (e.g., [CONTINUE SESSION]); scratch/ is temp.
    case "$file" in
        */.backup-*) continue ;;
        */memory/*) continue ;;
        */scratch/*) continue ;;
    esac

    line_num=0
    while IFS= read -r line; do
        line_num=$((line_num + 1))

        # Skip lines inside code fences or with backtick-wrapped brackets
        case "$line" in
            '```'*) continue ;;
            *'`['*) continue ;;
        esac

        # Skip HTML comments
        case "$line" in
            *'<!--'*'-->'*) continue ;;
        esac

        # Match bracket patterns that look like placeholders
        # Use grep to find [Something here] patterns
        if echo "$line" | grep -qE '\[[A-Z][A-Za-z0-9 /,._-]+\]' 2>/dev/null; then
            # Exclude known non-placeholder patterns
            cleaned="$line"
            # Remove known safe patterns before re-checking
            cleaned=$(echo "$cleaned" | sed -E \
                -e 's/\[x\]//g' \
                -e 's/\[ \]//g' \
                -e 's/\[P[0-2]\]//g' \
                -e 's/\[B\]//g' \
                -e 's/\[SPECKIT[^]]*\]//g' \
                -e 's/\[ANCHOR[^]]*\]//g' \
                -e 's/\[EVIDENCE[^]]*\]//g' \
                -e 's/\[NEEDS CLARIFICATION\]//g' \
                -e 's/\[W:[^]]*\]//g' \
                -e 's/`[^`]*`//g' \
            )

            # Check if any placeholder-like patterns remain after cleanup
            if echo "$cleaned" | grep -qE '\[[A-Z][A-Za-z0-9 /,._-]{2,}\]' 2>/dev/null; then
                TOTAL=$((TOTAL + 1))
                match_text=$(echo "$line" | grep -oE '\[[A-Z][A-Za-z0-9 /,._-]{2,}\]' 2>/dev/null | head -1)
                if [[ "$VERBOSE" == "true" ]]; then
                    MATCHES="${MATCHES}  ${file}:${line_num}: ${match_text}\n"
                fi
            fi
        fi
    done < "$file"
done < <(find "$FOLDER_PATH" -name "*.md" -type f 2>/dev/null | sort)

# ─── Output ──────────────────────────────────────────────────
if [[ "$JSON_MODE" == "true" ]]; then
    if [[ $TOTAL -eq 0 ]]; then
        echo "{\"status\":\"PASS\",\"placeholders\":0,\"folder\":\"$FOLDER_PATH\"}"
    else
        echo "{\"status\":\"FAIL\",\"placeholders\":$TOTAL,\"folder\":\"$FOLDER_PATH\"}"
    fi
else
    if [[ $TOTAL -eq 0 ]]; then
        echo -e "${GREEN}${BOLD}PASS${NC} — Zero placeholder patterns found in ${FOLDER_PATH}"
    else
        echo -e "${RED}${BOLD}FAIL${NC} — ${TOTAL} placeholder pattern(s) found in ${FOLDER_PATH}" >&2
        if [[ "$VERBOSE" == "true" && -n "$MATCHES" ]]; then
            echo ""
            echo -e "$MATCHES"
        fi
    fi
fi

# Exit code: 0 = pass, 1 = fail
if [[ $TOTAL -eq 0 ]]; then
    exit 0
else
    exit 1
fi
