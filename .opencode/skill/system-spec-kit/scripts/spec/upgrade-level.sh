#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Upgrade Spec Folder Level
# ───────────────────────────────────────────────────────────────
# Upgrades existing spec folders from one documentation level to a higher one.
# Preserves all user-written content while injecting new template sections.
#
# UPGRADE PATHS (upward only):
#   L1 → L2:  Add checklist.md, NFR/Edge/Complexity sections to spec.md, plan.md sections
#   L2 → L3:  Add decision-record.md, promote L2: sections to numbered, add Risk Matrix/User Stories
#   L3 → L3+: Add governance sections to spec.md, plan.md, checklist.md
#   Skip-levels (e.g., L1→L3) chain through intermediate upgrades automatically.
#
# Usage: upgrade-level.sh <spec-folder> --to <2|3|3+> [--dry-run] [--verbose] [--json] [--keep-backups]
#
# Exit codes: 0=success, 1=validation error, 2=upgrade error, 3=backup error

# Strict mode for safer upgrade execution.
set -euo pipefail

# Cleanup temp files on interrupt or exit
CLEANUP_DIR=""
trap 'if [[ -n "$CLEANUP_DIR" ]]; then rm -f "$CLEANUP_DIR"/*.tmp 2>/dev/null; fi' EXIT

# ───────────────────────────────────────────────────────────────
# 1. SOURCE SHARED LIBRARIES
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ ! -f "${SCRIPT_DIR}/../lib/shell-common.sh" ]]; then
    echo "ERROR: Required helper not found: ${SCRIPT_DIR}/../lib/shell-common.sh" >&2
    exit 1
fi
source "${SCRIPT_DIR}/../lib/shell-common.sh"

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS & GLOBALS
# ───────────────────────────────────────────────────────────────

# Template directories (SCRIPT_DIR is scripts/spec/, templates is at ../../templates)
TEMPLATES_DIR="$(cd "${SCRIPT_DIR}/../../templates" 2>/dev/null && pwd)" || {
    echo "Error: Templates directory not found at ${SCRIPT_DIR}/../../templates" >&2
    exit 2
}
ADDENDUM_L2="${TEMPLATES_DIR}/addendum/level2-verify"
ADDENDUM_L3="${TEMPLATES_DIR}/addendum/level3-arch"
ADDENDUM_L3PLUS="${TEMPLATES_DIR}/addendum/level3plus-govern"

# Output control
VERBOSE=false
DRY_RUN=false
JSON_MODE=false
KEEP_BACKUPS=false

# State tracking
TARGET_LEVEL=""
SPEC_FOLDER=""
CURRENT_LEVEL=""
LEVEL_METHOD=""
BACKUP_DIR=""
MODIFIED_FILES=()
CREATED_FILES=()

# ───────────────────────────────────────────────────────────────
# 3. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo "[upgrade] $*" >&2
    fi
}

info() {
    if [[ "$JSON_MODE" != "true" ]]; then
        echo "[upgrade] $*" >&2
    fi
}

warn() {
    echo "⚠ $*" >&2
}

error_exit() {
    local msg="$1"
    local code="${2:-1}"
    echo "✗ $msg" >&2
    exit "$code"
}

# ───────────────────────────────────────────────────────────────
# 4. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

show_usage() {
    cat >&2 <<'USAGE'
Usage: upgrade-level.sh <spec-folder> --to <2|3|3+> [options]

Upgrades an existing spec folder to a higher documentation level.
Preserves all user-written content while injecting new template sections.

Required:
  <spec-folder>         Path to existing spec folder
  --to <level>          Target level: 2, 3, or 3+

Options:
  --dry-run             Show what would change without modifying files
  --verbose             Print detailed progress to stderr
  --json                Output results in JSON format
  --keep-backups        Retain all backup directories (skip cleanup)
  --help, -h            Show this help message

Upgrade Paths:
  L1 → L2:   Adds checklist.md, NFR/Edge/Complexity sections, effort estimation
  L2 → L3:   Adds decision-record.md, dependency graph, milestones, ADRs
  L3 → L3+:  Adds governance sections, extended checklist, AI execution framework
  Skip-levels (e.g., L1→L3) chain through intermediate upgrades automatically.

Examples:
  upgrade-level.sh specs/007-auth --to 2
  upgrade-level.sh specs/007-auth --to 3+ --dry-run
  upgrade-level.sh specs/007-auth --to 3 --verbose --keep-backups

Exit codes:
  0  Success
  1  Validation error (bad args, missing files, invalid upgrade path)
  2  Upgrade error (template missing, injection failed)
  3  Backup error (could not create/verify backup)
USAGE
}

ARGS=()
i=1
while [[ $i -le $# ]]; do
    arg="${!i}"
    case "$arg" in
        --to)
            if [[ $((i + 1)) -gt $# ]]; then
                error_exit "--to requires a target level (2, 3, or 3+)" 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                error_exit "--to requires a target level (2, 3, or 3+)" 1
            fi
            if [[ ! "$next_arg" =~ ^(2|3|3\+)$ ]]; then
                error_exit "--to must be 2, 3, or 3+" 1
            fi
            TARGET_LEVEL="$next_arg"
            ;;
        --dry-run)
            DRY_RUN=true
            ;;
        --verbose)
            VERBOSE=true
            ;;
        --json)
            JSON_MODE=true
            ;;
        --keep-backups)
            KEEP_BACKUPS=true
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        -*)
            error_exit "Unknown option: $arg (use --help for usage)" 1
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

# Validate required arguments
if [[ ${#ARGS[@]} -eq 0 ]]; then
    error_exit "Missing required argument: <spec-folder> (use --help for usage)" 1
fi

SPEC_FOLDER="${ARGS[0]}"

# Strip trailing slash for consistency
SPEC_FOLDER="${SPEC_FOLDER%/}"
CLEANUP_DIR="$SPEC_FOLDER"

if [[ -z "$TARGET_LEVEL" ]]; then
    error_exit "Missing required option: --to <level> (use --help for usage)" 1
fi

if [[ ! -d "$SPEC_FOLDER" ]]; then
    error_exit "Spec folder not found: $SPEC_FOLDER" 1
fi

if [[ ! -f "$SPEC_FOLDER/spec.md" ]]; then
    error_exit "Not a valid spec folder (missing spec.md): $SPEC_FOLDER" 1
fi

verbose "Spec folder: $SPEC_FOLDER"
verbose "Target level: $TARGET_LEVEL"

# ───────────────────────────────────────────────────────────────
# 5. LEVEL DETECTION
# ───────────────────────────────────────────────────────────────

detect_level() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    local level=""

    if [[ -f "$spec_file" ]]; then
        # Pattern 0: SPECKIT_LEVEL marker (most authoritative — machine-generated during upgrades)
        level=$(grep -oE '<!-- SPECKIT_LEVEL: *[123]\+? *-->' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)

        # Pattern 1: Table format with bold: | **Level** | 2 |
        if [[ -z "$level" ]]; then
            level=$(grep -E '\|\s*\*\*Level\*\*\s*\|\s*[123]\+?\s*\|' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 2: Table format without bold: | Level | 2 |
        if [[ -z "$level" ]]; then
            level=$(grep -E '\|\s*Level\s*\|\s*[123]\+?\s*\|' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 3: YAML frontmatter: level: 2
        if [[ -z "$level" ]]; then
            level=$(grep -E '^level:\s*[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 4: Inline "Level: N" or "Level N"
        if [[ -z "$level" ]]; then
            level=$(grep -E '^[Ll]evel[: ]+[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        [[ -n "$level" ]] && { CURRENT_LEVEL="$level"; LEVEL_METHOD="explicit"; return; }
    fi

    # Fallback: infer from existing files
    [[ -f "$folder/decision-record.md" ]] && { CURRENT_LEVEL=3; LEVEL_METHOD="inferred"; return; }
    [[ -f "$folder/checklist.md" ]] && { CURRENT_LEVEL=2; LEVEL_METHOD="inferred"; return; }
    CURRENT_LEVEL=1; LEVEL_METHOD="inferred"
}

# ───────────────────────────────────────────────────────────────
# 6. UPGRADE PATH VALIDATION
# ───────────────────────────────────────────────────────────────

# Convert level string to numeric value for comparison
level_to_numeric() {
    local lvl="$1"
    case "$lvl" in
        1)  echo 1 ;;
        2)  echo 2 ;;
        3)  echo 3 ;;
        "3+") echo 4 ;;
        *)  echo 0 ;;
    esac
}

validate_upgrade_path() {
    local current_num
    local target_num
    current_num=$(level_to_numeric "$CURRENT_LEVEL")
    target_num=$(level_to_numeric "$TARGET_LEVEL")

    if [[ "$current_num" -eq 0 ]]; then
        error_exit "Could not determine current level for: $SPEC_FOLDER" 1
    fi

    if [[ "$target_num" -eq 0 ]]; then
        error_exit "Invalid target level: $TARGET_LEVEL" 1
    fi

    if [[ "$current_num" -ge "$target_num" ]]; then
        error_exit "Already at Level $CURRENT_LEVEL (target: $TARGET_LEVEL). Upgrades are upward only." 1
    fi

    verbose "Upgrade path validated: L$CURRENT_LEVEL → L$TARGET_LEVEL"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 7. BACKUP
# ───────────────────────────────────────────────────────────────

create_backup() {
    local timestamp
    timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_path="${SPEC_FOLDER}/.backup-${timestamp}"

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would create backup at $backup_path"
        BACKUP_DIR="$backup_path"
        return 0
    fi

    verbose "Creating backup at $backup_path"

    if ! mkdir -p "$backup_path"; then
        error_exit "Failed to create backup directory: $backup_path" 3
    fi

    # Count and copy all .md files (root + subdirectories), preserving structure
    local source_count=0
    local copied_count=0

    # Root-level .md files
    for md_file in "$SPEC_FOLDER"/*.md; do
        [[ -f "$md_file" ]] || continue
        source_count=$((source_count + 1))
        if cp "$md_file" "$backup_path/"; then
            copied_count=$((copied_count + 1))
        else
            warn "Failed to backup: $md_file"
        fi
    done

    # Subdirectory .md files (memory/, scratch/, etc.) — preserve directory structure
    while IFS= read -r -d '' md_file; do
        local rel_path="${md_file#"$SPEC_FOLDER"/}"
        local rel_dir
        rel_dir="$(dirname "$rel_path")"
        if ! mkdir -p "$backup_path/$rel_dir"; then
            warn "Failed to create backup subdirectory: $backup_path/$rel_dir"
            continue
        fi
        source_count=$((source_count + 1))
        if cp "$md_file" "$backup_path/$rel_dir/"; then
            copied_count=$((copied_count + 1))
        else
            warn "Failed to backup: $md_file"
        fi
    done < <(find "$SPEC_FOLDER" -mindepth 2 -name '*.md' -type f -not -path '*/.backup-*' -print0)

    # Verify backup integrity
    if [[ "$source_count" -gt 0 ]] && [[ "$copied_count" -ne "$source_count" ]]; then
        error_exit "Backup integrity check failed: copied $copied_count of $source_count files" 3
    fi

    BACKUP_DIR="$backup_path"
    verbose "Backup complete: $copied_count files → $backup_path"
    return 0
}

# Restore all .md files from backup directory back to spec folder on upgrade failure
restore_from_backup() {
    if [[ -z "$BACKUP_DIR" ]] || [[ ! -d "$BACKUP_DIR" ]]; then
        warn "No backup directory available for restore"
        return 1
    fi

    local restored=0
    local removed=0
    local restore_failed=0

    # Restore root-level .md files
    for f in "$BACKUP_DIR"/*.md; do
        [[ -f "$f" ]] || continue
        if cp "$f" "$SPEC_FOLDER/"; then
            restored=$((restored + 1))
        else
            warn "Failed to restore file: $f"
            restore_failed=1
        fi
    done

    # Restore subdirectory .md files, mirroring original structure
    while IFS= read -r -d '' md_file; do
        local rel_path="${md_file#"$BACKUP_DIR"/}"
        local target_dir="$SPEC_FOLDER/$(dirname "$rel_path")"
        if ! mkdir -p "$target_dir"; then
            warn "Failed to create restore directory: $target_dir"
            restore_failed=1
            continue
        fi
        if cp "$md_file" "$target_dir/"; then
            restored=$((restored + 1))
        else
            warn "Failed to restore file: $md_file"
            restore_failed=1
        fi
    done < <(find "$BACKUP_DIR" -mindepth 2 -name '*.md' -type f -print0)

    # Remove markdown files created during failed upgrade and absent in backup
    while IFS= read -r -d '' current_md; do
        local rel_path="${current_md#"$SPEC_FOLDER"/}"
        if [[ ! -f "$BACKUP_DIR/$rel_path" ]]; then
            if rm -f "$current_md"; then
                removed=$((removed + 1))
            else
                warn "Failed to remove created file during rollback: $current_md"
                restore_failed=1
            fi
        fi
    done < <(find "$SPEC_FOLDER" -name '*.md' -type f -not -path '*/.backup-*/*' -not -path '*/.backup-*' -print0)

    if [[ "$restore_failed" -eq 0 ]]; then
        info "Restored $restored file(s), removed $removed created file(s): $BACKUP_DIR"
        return 0
    fi

    warn "Rollback incomplete: restored $restored file(s), removed $removed created file(s)"
    return 1
}

# ───────────────────────────────────────────────────────────────
# 8. BACKUP CLEANUP
# ───────────────────────────────────────────────────────────────

cleanup_old_backups() {
    if [[ "$KEEP_BACKUPS" == "true" ]]; then
        verbose "Skipping backup cleanup (--keep-backups)"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        verbose "DRY RUN: Would clean up old backups (keeping 3 most recent)"
        return 0
    fi

    # Collect backup directories sorted by name (which sorts by date due to timestamp format)
    local backup_dirs=()
    for d in "$SPEC_FOLDER"/.backup-*; do
        [[ -d "$d" ]] || continue
        backup_dirs+=("$d")
    done

    local count=${#backup_dirs[@]}
    if [[ "$count" -le 3 ]]; then
        verbose "Backup cleanup: $count backups found, nothing to remove (keeping 3)"
        return 0
    fi

    # Remove all but the 3 most recent (array is sorted by name ascending)
    local remove_count=$((count - 3))
    local removed=0
    local idx=0
    while [[ $idx -lt $remove_count ]]; do
        local old_backup="${backup_dirs[$idx]}"
        if rm -rf "$old_backup"; then
            verbose "Removed old backup: $(basename "$old_backup")"
            removed=$((removed + 1))
        else
            warn "Failed to remove old backup: $old_backup"
        fi
        idx=$((idx + 1))
    done

    verbose "Backup cleanup: removed $removed of $remove_count old backups"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 8b. TRAILING COMMENT BLOCK DETECTION (shared helper)
# ───────────────────────────────────────────────────────────────

# Scans backward from the end of a file to find where to insert content
# Before any trailing comment block (multi-line or single-line HTML comments).
# Handles: <!-- ... --> (multi-line), <!-- ... --> (single-line), and --- separators.
# Echoes the line number to insert BEFORE, or empty string if no trailing block found.
find_insert_point() {
    local file="$1"
    local total_lines
    total_lines=$(wc -l < "$file" | tr -d ' ')

    local line_num="$total_lines"
    local insert_before_line=""
    local in_comment_block=false
    local max_scan=200
    local scanned=0

    while [[ $line_num -gt 0 ]] && [[ $scanned -lt $max_scan ]]; do
        local line
        line=$(sed -n "${line_num}p" "$file")
        scanned=$((scanned + 1))

        # Skip trailing blank lines
        if [[ -z "$line" ]] || [[ "$line" =~ ^[[:space:]]*$ ]]; then
            line_num=$((line_num - 1))
            continue
        fi

        if [[ "$in_comment_block" == "true" ]]; then
            # Scanning backward through a multi-line comment looking for <!--
            if [[ "$line" =~ '<!--' ]]; then
                # Found the opening of this comment block
                insert_before_line="$line_num"
                in_comment_block=false
                line_num=$((line_num - 1))
                continue  # Keep scanning for more blocks or ---
            fi
            # Still inside the comment body — keep scanning
            line_num=$((line_num - 1))
            continue
        fi

        # Not inside a comment block
        if [[ "$line" =~ '-->'$ ]] && [[ "$line" =~ '<!--' ]]; then
            # Single-line comment: <!-- ... -->
            insert_before_line="$line_num"
            line_num=$((line_num - 1))
            continue
        elif [[ "$line" =~ '-->'$ ]]; then
            # End of a multi-line comment block — scan backward for opening <!--
            in_comment_block=true
            line_num=$((line_num - 1))
            continue
        elif [[ "$line" == "---" ]] && [[ -n "$insert_before_line" ]]; then
            # HR separator before the comment block
            insert_before_line="$line_num"
            break
        else
            # Hit non-comment, non-blank content — stop scanning
            break
        fi
    done

    echo "$insert_before_line"
}

# ───────────────────────────────────────────────────────────────
# 9. PLAN.MD UPGRADE
# ───────────────────────────────────────────────────────────────

upgrade_plan() {
    local from_level="$1"
    local to_level="$2"
    local plan_file="$SPEC_FOLDER/plan.md"

    # Determine which addendum fragment to use
    local fragment_path=""
    local idempotency_pattern=""
    case "${from_level}-${to_level}" in
        1-2)
            fragment_path="${ADDENDUM_L2}/plan-level2.md"
            idempotency_pattern="## L2: PHASE DEPENDENCIES"
            ;;
        2-3)
            fragment_path="${ADDENDUM_L3}/plan-level3.md"
            idempotency_pattern="## L3: DEPENDENCY GRAPH"
            ;;
        "3-3+")
            fragment_path="${ADDENDUM_L3PLUS}/plan-level3plus.md"
            idempotency_pattern="## L3+: AI EXECUTION FRAMEWORK"
            ;;
        *)
            warn "No plan.md upgrade fragment for L${from_level} → L${to_level}"
            return 0
            ;;
    esac

    if [[ ! -f "$plan_file" ]]; then
        warn "plan.md not found in $SPEC_FOLDER — skipping plan upgrade"
        return 0
    fi

    if [[ ! -f "$fragment_path" ]]; then
        warn "Addendum fragment not found: $fragment_path"
        return 2
    fi

    # Idempotency check: skip if the first heading is already present
    if grep -qF "$idempotency_pattern" "$plan_file" 2>/dev/null; then
        info "plan.md already contains '$idempotency_pattern' — skipping"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would inject $(basename "$fragment_path") into plan.md"
        return 0
    fi

    verbose "Injecting $(basename "$fragment_path") into plan.md"

    # Read the fragment and strip leading HTML comment lines (matching spec.md upgrade pattern)
    local fragment_content
    fragment_content=$(awk '
        BEGIN { in_header = 1 }
        in_header && /^<!--.*-->$/ { next }
        in_header && /^[[:space:]]*$/ { next }
        { in_header = 0; print }
    ' "$fragment_path")

    # Find insertion point: before any trailing comment block at end of file
    local tmp_file="${plan_file}.tmp"
    local insert_before_line
    insert_before_line=$(find_insert_point "$plan_file")

    if [[ -n "$insert_before_line" ]]; then
        # Insert fragment before the trailing comment block
        verbose "Inserting before trailing comment block at line $insert_before_line"
        {
            head -n $((insert_before_line - 1)) "$plan_file"
            printf '%s\n' "$fragment_content"
            tail -n +"${insert_before_line}" "$plan_file"
        } > "$tmp_file"
    else
        # No trailing comment block found — append to end of file
        verbose "Appending to end of plan.md"
        {
            cat "$plan_file"
            # Ensure there's a newline before the fragment
            printf '\n%s\n' "$fragment_content"
        } > "$tmp_file"
    fi

    # Atomic write
    mv "$tmp_file" "$plan_file"
    MODIFIED_FILES+=("plan.md")
    verbose "plan.md upgraded successfully"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 10. CHECKLIST.MD UPGRADE
# ───────────────────────────────────────────────────────────────

upgrade_checklist() {
    local from_level="$1"
    local to_level="$2"

    # Only L3→L3+ appends extended verification sections
    if [[ "$from_level" != "3" ]] || [[ "$to_level" != "3+" ]]; then
        verbose "No checklist extension needed for L${from_level} → L${to_level}"
        return 0
    fi

    local checklist_file="$SPEC_FOLDER/checklist.md"
    local fragment_path="${ADDENDUM_L3PLUS}/checklist-extended.md"

    if [[ ! -f "$checklist_file" ]]; then
        warn "checklist.md not found in $SPEC_FOLDER — skipping checklist upgrade"
        return 0
    fi

    if [[ ! -f "$fragment_path" ]]; then
        warn "Addendum fragment not found: $fragment_path"
        return 2
    fi

    # Idempotency check
    if grep -qF "## L3+: ARCHITECTURE VERIFICATION" "$checklist_file" 2>/dev/null; then
        info "checklist.md already contains L3+ sections — skipping"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would append checklist-extended.md to checklist.md"
        return 0
    fi

    verbose "Appending extended checklist sections to checklist.md"

    # Read the fragment and strip leading HTML comment lines (matching spec.md upgrade pattern)
    local fragment_content
    fragment_content=$(awk '
        BEGIN { in_header = 1 }
        in_header && /^<!--.*-->$/ { next }
        in_header && /^[[:space:]]*$/ { next }
        { in_header = 0; print }
    ' "$fragment_path")

    # Find insertion point: before any trailing comment block at end of file
    local tmp_file="${checklist_file}.tmp"
    local insert_before_line
    insert_before_line=$(find_insert_point "$checklist_file")

    if [[ -n "$insert_before_line" ]]; then
        verbose "Inserting before trailing comment block at line $insert_before_line"
        {
            head -n $((insert_before_line - 1)) "$checklist_file"
            printf '%s\n' "$fragment_content"
            tail -n +"${insert_before_line}" "$checklist_file"
        } > "$tmp_file"
    else
        verbose "Appending to end of checklist.md"
        {
            cat "$checklist_file"
            printf '\n%s\n' "$fragment_content"
        } > "$tmp_file"
    fi

    mv "$tmp_file" "$checklist_file"
    MODIFIED_FILES+=("checklist.md")
    verbose "checklist.md upgraded successfully"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 11. NEW FILE CREATION
# ───────────────────────────────────────────────────────────────

create_new_files() {
    local from_level="$1"
    local to_level="$2"

    case "${from_level}-${to_level}" in
        1-2)
            # L1→L2: Create checklist.md from full template
            local checklist_src="${ADDENDUM_L2}/checklist.md"
            local checklist_dest="$SPEC_FOLDER/checklist.md"

            if [[ -f "$checklist_dest" ]]; then
                info "checklist.md already exists — skipping creation"
                return 0
            fi

            if [[ ! -f "$checklist_src" ]]; then
                warn "Checklist template not found: $checklist_src"
                return 2
            fi

            if [[ "$DRY_RUN" == "true" ]]; then
                info "DRY RUN: Would create checklist.md from template"
                return 0
            fi

            verbose "Creating checklist.md from template"
            cp "$checklist_src" "$checklist_dest"
            CREATED_FILES+=("checklist.md")
            ;;

        2-3)
            # L2→L3: Create decision-record.md from template
            local dr_src="${ADDENDUM_L3}/decision-record.md"
            local dr_dest="$SPEC_FOLDER/decision-record.md"

            if [[ -f "$dr_dest" ]]; then
                info "decision-record.md already exists — skipping creation"
                return 0
            fi

            if [[ ! -f "$dr_src" ]]; then
                warn "Decision record template not found: $dr_src"
                return 2
            fi

            if [[ "$DRY_RUN" == "true" ]]; then
                info "DRY RUN: Would create decision-record.md from template"
                return 0
            fi

            verbose "Creating decision-record.md from template"
            cp "$dr_src" "$dr_dest"
            CREATED_FILES+=("decision-record.md")
            ;;

        "3-3+")
            # L3→L3+: No new files — extended content is appended to existing files
            verbose "No new files needed for L3 → L3+"
            ;;

        *)
            verbose "No new files defined for L${from_level} → L${to_level}"
            ;;
    esac

    return 0
}

# ───────────────────────────────────────────────────────────────
# 0. OS DETECTION (for sed in-place compatibility)
# ───────────────────────────────────────────────────────────────

# Wrapper function for portable sed in-place editing
_sed_inplace() {
    if [[ "$(uname)" == "Darwin" ]]; then
        sed -i '' "$@"
    else
        sed -i "$@"
    fi
}

# ───────────────────────────────────────────────────────────────
# 12. SPEC.MD UPGRADE: L1 → L2
# ───────────────────────────────────────────────────────────────

upgrade_spec_l1_to_l2() {
    local spec_file="$SPEC_FOLDER/spec.md"
    local fragment_path="${ADDENDUM_L2}/spec-level2.md"

    if [[ ! -f "$spec_file" ]]; then
        warn "spec.md not found in $SPEC_FOLDER — skipping spec upgrade"
        return 0
    fi

    if [[ ! -f "$fragment_path" ]]; then
        warn "L2 spec addendum not found: $fragment_path"
        return 2
    fi

    # Idempotency check (also match numbered variant from L2→L3 rename)
    if grep -q -e "## L2: NON-FUNCTIONAL REQUIREMENTS" -e "## 7. NON-FUNCTIONAL REQUIREMENTS" "$spec_file" 2>/dev/null; then
        info "spec.md already contains L2 sections — skipping"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would inject L2 addendum sections into spec.md"
        return 0
    fi

    verbose "Injecting L2 addendum sections into spec.md"

    # Read the fragment, strip leading HTML comment lines (SPECKIT_ADDENDUM + instruction comments)
    local fragment_content
    fragment_content=$(awk '
        BEGIN { in_header = 1 }
        in_header && /^<!--.*-->$/ { next }
        in_header && /^[[:space:]]*$/ { next }
        { in_header = 0; print }
    ' "$fragment_path")

    # Find OPEN QUESTIONS section: ## N. OPEN QUESTIONS (any N)
    local oq_line=""
    local oq_num=""
    oq_line=$(grep -n '^## [0-9][0-9]*\. OPEN QUESTIONS' "$spec_file" | head -1 | cut -d: -f1)

    if [[ -n "$oq_line" ]]; then
        # Extract the section number from the heading
        oq_num=$(sed -n "${oq_line}p" "$spec_file" | grep -oE '[0-9]+' | head -1)
        local new_oq_num=$((oq_num + 3))

        verbose "Found OPEN QUESTIONS at line $oq_line (section $oq_num → $new_oq_num)"

        local tmp_file="${spec_file}.tmp"
        {
            # Part 1: everything before OPEN QUESTIONS
            head -n $((oq_line - 1)) "$spec_file"
            # Part 2: the L2 fragment
            printf '%s\n' "$fragment_content"
            # Part 3: blank line + renumbered OPEN QUESTIONS heading
            printf '\n## %d. OPEN QUESTIONS\n' "$new_oq_num"
            # Part 4: everything after the original OPEN QUESTIONS heading
            tail -n +$((oq_line + 1)) "$spec_file"
        } > "$tmp_file"

        mv "$tmp_file" "$spec_file"
    else
        # Fallback: no OPEN QUESTIONS found — try any heading with "OPEN QUESTIONS"
        oq_line=$(grep -n '^## .*OPEN QUESTIONS' "$spec_file" | head -1 | cut -d: -f1)

        local tmp_file="${spec_file}.tmp"
        if [[ -n "$oq_line" ]]; then
            verbose "Found OPEN QUESTIONS (non-standard format) at line $oq_line"
            {
                head -n $((oq_line - 1)) "$spec_file"
                printf '%s\n' "$fragment_content"
                printf '\n'
                tail -n +"${oq_line}" "$spec_file"
            } > "$tmp_file"
        else
            # Last resort: append before the last ## heading, or just append to end
            local last_heading_line=""
            last_heading_line=$(grep -n '^## ' "$spec_file" | tail -1 | cut -d: -f1)

            if [[ -n "$last_heading_line" ]]; then
                verbose "No OPEN QUESTIONS found; inserting before last heading at line $last_heading_line"
                {
                    head -n $((last_heading_line - 1)) "$spec_file"
                    printf '%s\n' "$fragment_content"
                    printf '\n'
                    tail -n +"${last_heading_line}" "$spec_file"
                } > "$tmp_file"
            else
                verbose "No OPEN QUESTIONS or headings found; appending to end"
                {
                    cat "$spec_file"
                    printf '\n%s\n' "$fragment_content"
                } > "$tmp_file"
            fi
        fi

        mv "$tmp_file" "$spec_file"
    fi

    MODIFIED_FILES+=("spec.md")
    verbose "spec.md L1→L2 upgrade complete"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 13. SPEC.MD UPGRADE: L2 → L3
# ───────────────────────────────────────────────────────────────

upgrade_spec_l2_to_l3() {
    local spec_file="$SPEC_FOLDER/spec.md"
    local prefix_path="${ADDENDUM_L3}/spec-level3-prefix.md"
    local suffix_path="${ADDENDUM_L3}/spec-level3-suffix.md"

    if [[ ! -f "$spec_file" ]]; then
        warn "spec.md not found in $SPEC_FOLDER — skipping spec upgrade"
        return 0
    fi

    if [[ ! -f "$prefix_path" ]]; then
        warn "L3 spec prefix not found: $prefix_path"
        return 2
    fi

    if [[ ! -f "$suffix_path" ]]; then
        warn "L3 spec suffix not found: $suffix_path"
        return 2
    fi

    # Idempotency check
    if grep -qF '## EXECUTIVE SUMMARY' "$spec_file" 2>/dev/null; then
        info "spec.md already contains EXECUTIVE SUMMARY — skipping L2→L3 upgrade"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would upgrade spec.md from L2 to L3 (exec summary, rename L2 sections, add Risk Matrix/User Stories)"
        return 0
    fi

    verbose "Upgrading spec.md from L2 to L3"

    # --- Prepare external content ---

    # Executive summary (prefix file, 8 lines)
    local exec_summary
    exec_summary=$(cat "$prefix_path")

    # Risk Matrix and User Stories from suffix (sections 10-11, from ## 10 to end)
    local suffix_sections
    suffix_sections=$(awk '/^## 10\. RISK MATRIX/,0 { print }' "$suffix_path")

    # Multi-Agent and Coordination rows for complexity table
    local multiagent_row='| Multi-Agent | [/15] | [Workstreams: X] |'
    local coordination_row='| Coordination | [/15] | [Dependencies: X] |'

    # --- Write suffix sections to a temp file for awk to read ---
    local suffix_tmp="${spec_file}.suffix.tmp"
    printf '%s\n' "$suffix_sections" > "$suffix_tmp"

    # --- Write exec summary to a temp file for awk to read ---
    local exec_tmp="${spec_file}.exec.tmp"
    printf '%s\n' "$exec_summary" > "$exec_tmp"

    # --- Single awk pass for all transformations ---
    local tmp_file="${spec_file}.tmp"

    awk -v exec_file="$exec_tmp" \
        -v suffix_file="$suffix_tmp" \
        -v ma_row="$multiagent_row" \
        -v co_row="$coordination_row" \
    '
    BEGIN {
        inserted_exec = 0
        in_complexity = 0
        saw_multiagent = 0
        inserted_suffix = 0

        # Read executive summary from file
        exec_content = ""
        while ((getline line < exec_file) > 0) {
            if (exec_content != "") exec_content = exec_content "\n"
            exec_content = exec_content line
        }
        close(exec_file)

        # Read suffix sections from file
        suffix_content = ""
        while ((getline line < suffix_file) > 0) {
            if (suffix_content != "") suffix_content = suffix_content "\n"
            suffix_content = suffix_content line
        }
        close(suffix_file)
    }

    {
        line = $0

        # --- Stage 1: Insert Executive Summary before first ## 1. ---
        if (!inserted_exec && line ~ /^## 1\./) {
            print exec_content
            print ""
            print "---"
            print ""
            inserted_exec = 1
        }

        # --- Stage 2: Rename L2: prefixed sections to numbered ---
        if (line ~ /^## L2: NON-FUNCTIONAL REQUIREMENTS/) {
            sub(/^## L2: NON-FUNCTIONAL REQUIREMENTS/, "## 7. NON-FUNCTIONAL REQUIREMENTS", line)
        }
        else if (line ~ /^## L2: EDGE CASES/) {
            sub(/^## L2: EDGE CASES/, "## 8. EDGE CASES", line)
        }
        else if (line ~ /^## L2: COMPLEXITY ASSESSMENT/) {
            sub(/^## L2: COMPLEXITY ASSESSMENT/, "## 9. COMPLEXITY ASSESSMENT", line)
            in_complexity = 1
        }

        # --- Stage 3: Transform complexity section ---
        if (in_complexity) {
            # Fix scoring denominator and level label
            gsub(/\/70\]/, "/100]", line)
            gsub(/\/70\)/, "/100)", line)
            gsub(/\/70\*/, "/100*", line)
            gsub(/Level 2\*\*/, "Level 3**", line)

            # Track if Multi-Agent row already exists
            if (line ~ /^\|.*Multi-Agent/) saw_multiagent = 1

            # Before the Total row, insert Multi-Agent and Coordination if missing
            if (line ~ /\*\*Total\*\*/ && !saw_multiagent) {
                print ma_row
                print co_row
            }

            # Detect end of complexity section (next ## heading or --- followed by ## heading)
            # We use a simple heuristic: next ## heading that is not ## 9
            if (line ~ /^## / && line !~ /^## 9\. COMPLEXITY/) {
                in_complexity = 0
            }
        }

        # --- Stage 4: Insert Risk Matrix + User Stories before OPEN QUESTIONS ---
        if (line ~ /^## [0-9]+\. OPEN QUESTIONS/ && !inserted_suffix) {
            # Print the suffix sections (Risk Matrix, User Stories) before OPEN QUESTIONS
            print suffix_content
            print ""

            # Extract old section number and compute new one (+2 for two new sections)
            old_num = line
            gsub(/[^0-9].*/, "", old_num)
            gsub(/^[^0-9]*/, "", old_num)
            # More robust: use match
            if (match(line, /[0-9]+/)) {
                old_num = substr(line, RSTART, RLENGTH) + 0
            }
            new_num = old_num + 2
            sub(/## [0-9]+\. OPEN QUESTIONS/, "## " new_num ". OPEN QUESTIONS", line)
            inserted_suffix = 1
        }

        print line
    }
    END {
        if (!inserted_suffix) {
            print "[upgrade] \342\232\240 OPEN QUESTIONS heading not found \342\200\224 Risk Matrix/User Stories sections not inserted" > "/dev/stderr"
        }
    }
    ' "$spec_file" > "$tmp_file"

    # Clean up temp files
    rm -f "$suffix_tmp" "$exec_tmp"

    # Validate the output has content
    if [[ ! -s "$tmp_file" ]]; then
        rm -f "$tmp_file"
        warn "L2→L3 spec.md transformation produced empty output"
        return 2
    fi

    # Atomic write
    mv "$tmp_file" "$spec_file"

    MODIFIED_FILES+=("spec.md")
    verbose "spec.md L2→L3 upgrade complete"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 14. SPEC.MD UPGRADE: L3 → L3+
# ───────────────────────────────────────────────────────────────

upgrade_spec_l3_to_l3plus() {
    local spec_file="$SPEC_FOLDER/spec.md"
    local suffix_path="${ADDENDUM_L3PLUS}/spec-level3plus-suffix.md"

    if [[ ! -f "$spec_file" ]]; then
        warn "spec.md not found in $SPEC_FOLDER — skipping spec upgrade"
        return 0
    fi

    if [[ ! -f "$suffix_path" ]]; then
        warn "L3+ spec suffix not found: $suffix_path"
        return 2
    fi

    # Idempotency check: look for the L3+ governance sections
    if grep -qE '^## (12\. )?APPROVAL WORKFLOW' "$spec_file" 2>/dev/null; then
        info "spec.md already contains APPROVAL WORKFLOW — skipping L3→L3+ upgrade"
        return 0
    fi
    if grep -qE '^## L3\+:.*APPROVAL' "$spec_file" 2>/dev/null; then
        info "spec.md already contains L3+ APPROVAL section — skipping"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Would inject governance sections (12-15) into spec.md"
        return 0
    fi

    verbose "Injecting L3+ governance sections into spec.md"

    # Extract ONLY sections 12-15 from the L3+ suffix
    # (sections 7-11 are already present from L3)
    local governance_sections
    governance_sections=$(awk '/^## 12\. APPROVAL WORKFLOW/,0 { print }' "$suffix_path")

    if [[ -z "$governance_sections" ]]; then
        warn "Could not extract governance sections (12-15) from $suffix_path"
        return 2
    fi

    # Also update the complexity table label from Level 3 to Level 3+
    # (if not already updated)
    local needs_complexity_update=false
    if grep -qF 'Level 3**' "$spec_file" 2>/dev/null; then
        if ! grep -qF 'Level 3+**' "$spec_file" 2>/dev/null; then
            needs_complexity_update=true
        fi
    fi

    # Write governance sections to temp file for awk
    local gov_tmp="${spec_file}.gov.tmp"
    printf '%s\n' "$governance_sections" > "$gov_tmp"

    # Find OPEN QUESTIONS and insert governance sections before it, renumber
    local tmp_file="${spec_file}.tmp"

    awk -v gov_file="$gov_tmp" -v fix_complexity="$needs_complexity_update" '
    BEGIN {
        inserted = 0
        # Read governance sections from file
        gov_content = ""
        while ((getline line < gov_file) > 0) {
            if (gov_content != "") gov_content = gov_content "\n"
            gov_content = gov_content line
        }
        close(gov_file)
    }
    {
        line = $0

        # Update complexity label if needed
        if (fix_complexity == "true") {
            # Change "Level 3**" to "Level 3+**" but not "Level 3+**" (already done)
            # Use a two-step approach: mark existing 3+ to protect, change 3, restore
            if (line ~ /Level 3\*\*/ && line !~ /Level 3\+\*\*/) {
                gsub(/Level 3\*\*/, "Level 3+**", line)
            }
        }

        # Before OPEN QUESTIONS, insert governance sections
        if (line ~ /^## [0-9]+\. OPEN QUESTIONS/ && !inserted) {
            # Print governance sections
            print gov_content
            print ""

            # Renumber OPEN QUESTIONS: +4 (for sections 12,13,14,15)
            if (match(line, /[0-9]+/)) {
                old_num = substr(line, RSTART, RLENGTH) + 0
            }
            new_num = old_num + 4
            sub(/## [0-9]+\. OPEN QUESTIONS/, "## " new_num ". OPEN QUESTIONS", line)
            inserted = 1
        }

        print line
    }
    ' "$spec_file" > "$tmp_file"

    # Clean up
    rm -f "$gov_tmp"

    # Validate output
    if [[ ! -s "$tmp_file" ]]; then
        rm -f "$tmp_file"
        warn "L3→L3+ spec.md transformation produced empty output"
        return 2
    fi

    # Atomic write
    mv "$tmp_file" "$spec_file"

    MODIFIED_FILES+=("spec.md")
    verbose "spec.md L3→L3+ upgrade complete"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 15. SPEC.MD UPGRADE ROUTER
# ───────────────────────────────────────────────────────────────

upgrade_spec() {
    local from_level="$1"
    local to_level="$2"

    case "${from_level}-${to_level}" in
        1-2)
            upgrade_spec_l1_to_l2
            ;;
        2-3)
            upgrade_spec_l2_to_l3
            ;;
        "3-3+")
            upgrade_spec_l3_to_l3plus
            ;;
        *)
            warn "No spec.md upgrade defined for L${from_level} → L${to_level}"
            return 0
            ;;
    esac
}

# ───────────────────────────────────────────────────────────────
# 16. MARKER UPDATE FUNCTION
# ───────────────────────────────────────────────────────────────

update_markers() {
    local new_level="$1"
    local marker_pattern='<!-- SPECKIT_LEVEL:'
    local new_marker="<!-- SPECKIT_LEVEL: ${new_level} -->"
    local updated_count=0
    local added_count=0

    verbose "Updating SPECKIT_LEVEL markers to Level $new_level"

    for md_file in "$SPEC_FOLDER"/*.md; do
        [[ -f "$md_file" ]] || continue

        local basename_file
        basename_file=$(basename "$md_file")

        if grep -qF "$marker_pattern" "$md_file" 2>/dev/null; then
            # File has existing marker — update it
            if [[ "$DRY_RUN" == "true" ]]; then
                verbose "DRY RUN: Would update marker in $basename_file"
                continue
            fi

            _sed_inplace "s|<!-- SPECKIT_LEVEL:[^>]*-->|${new_marker}|g" "$md_file"

            # Update metadata table level field (both bold and non-bold variants)
            _sed_inplace "s/| *\*\*Level\*\* *| *[0-9][+]* *|/| **Level** | ${new_level} |/" "$md_file"
            _sed_inplace "s/| *Level *| *[0-9][+]* *|/| Level | ${new_level} |/" "$md_file"

            updated_count=$((updated_count + 1))
            verbose "Updated marker in $basename_file"
        else
            # Check if this is a newly created file (in CREATED_FILES array)
            local is_new_file=false
            local cf_idx=0
            while [[ $cf_idx -lt ${#CREATED_FILES[@]} ]]; do
                if [[ "${CREATED_FILES[$cf_idx]}" == "$basename_file" ]]; then
                    is_new_file=true
                    break
                fi
                cf_idx=$((cf_idx + 1))
            done

            if [[ "$is_new_file" == "true" ]]; then
                # Add marker on line 3 (after H1 heading and blank line)
                if [[ "$DRY_RUN" == "true" ]]; then
                    verbose "DRY RUN: Would add marker to new file $basename_file"
                    continue
                fi

                local total_lines
                total_lines=$(wc -l < "$md_file" | tr -d ' ')

                if [[ "$total_lines" -ge 2 ]]; then
                    # Insert at line 3
                    local tmp_marker="${md_file}.tmp"
                    {
                        head -n 2 "$md_file"
                        printf '%s\n' "$new_marker"
                        tail -n +3 "$md_file"
                    } > "$tmp_marker"
                    mv "$tmp_marker" "$md_file"
                else
                    # File is very short — append marker
                    printf '\n%s\n' "$new_marker" >> "$md_file"
                fi

                added_count=$((added_count + 1))
                verbose "Added marker to new file $basename_file"
            fi
        fi
    done

    verbose "Markers updated: $updated_count updated, $added_count added"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 17. JSON OUTPUT FUNCTION
# ───────────────────────────────────────────────────────────────

output_json() {
    local success="$1"
    local prev_level="$2"
    local new_level="$3"
    local err_msg="${4:-}"

    # Build modified files JSON array
    local modified_json="["
    local first=true
    local mf_idx=0
    while [[ $mf_idx -lt ${#MODIFIED_FILES[@]} ]]; do
        local escaped
        escaped=$(_json_escape "${MODIFIED_FILES[$mf_idx]}")
        if [[ "$first" == "true" ]]; then
            modified_json="${modified_json}\"${escaped}\""
            first=false
        else
            modified_json="${modified_json}, \"${escaped}\""
        fi
        mf_idx=$((mf_idx + 1))
    done
    modified_json="${modified_json}]"

    # Build created files JSON array
    local created_json="["
    first=true
    local cf_idx=0
    while [[ $cf_idx -lt ${#CREATED_FILES[@]} ]]; do
        local escaped
        escaped=$(_json_escape "${CREATED_FILES[$cf_idx]}")
        if [[ "$first" == "true" ]]; then
            created_json="${created_json}\"${escaped}\""
            first=false
        else
            created_json="${created_json}, \"${escaped}\""
        fi
        cf_idx=$((cf_idx + 1))
    done
    created_json="${created_json}]"

    # Escape string fields
    local escaped_method
    escaped_method=$(_json_escape "$LEVEL_METHOD")
    local escaped_prev_level
    escaped_prev_level=$(_json_escape "$prev_level")
    local escaped_new_level
    escaped_new_level=$(_json_escape "$new_level")
    local escaped_backup=""
    if [[ -n "$BACKUP_DIR" ]]; then
        escaped_backup=$(_json_escape "$(basename "$BACKUP_DIR")")
    fi
    local escaped_err=""
    if [[ -n "$err_msg" ]]; then
        escaped_err=$(_json_escape "$err_msg")
    fi

    # DRY_RUN as JSON boolean
    local dry_run_json="false"
    if [[ "$DRY_RUN" == "true" ]]; then
        dry_run_json="true"
    fi

    if [[ "$success" == "true" ]]; then
        cat <<ENDJSON
{
  "success": true,
  "previous_level": "${escaped_prev_level}",
  "new_level": "${escaped_new_level}",
  "detection_method": "${escaped_method}",
  "backup_dir": "${escaped_backup}",
  "files_modified": ${modified_json},
  "files_created": ${created_json},
  "dry_run": ${dry_run_json}
}
ENDJSON
    else
        cat <<ENDJSON
{
  "success": false,
  "previous_level": "${escaped_prev_level}",
  "new_level": "${escaped_new_level}",
  "detection_method": "${escaped_method}",
  "error": "${escaped_err}",
  "files_modified": ${modified_json},
  "files_created": ${created_json},
  "dry_run": ${dry_run_json}
}
ENDJSON
    fi
}

# ───────────────────────────────────────────────────────────────
# 18. SINGLE-STEP UPGRADE
# ───────────────────────────────────────────────────────────────

perform_single_upgrade() {
    local from_level="$1"
    local to_level="$2"

    info "Upgrading L${from_level} → L${to_level}"

    # Step 1: Create new files (checklist.md for L1→L2, decision-record.md for L2→L3)
    verbose "Step 1/5: Creating new files for L${from_level} → L${to_level}"
    if ! create_new_files "$from_level" "$to_level"; then
        warn "New file creation failed for L${from_level} → L${to_level}"
        return 2
    fi

    # Step 2: Upgrade plan.md
    verbose "Step 2/5: Upgrading plan.md for L${from_level} → L${to_level}"
    if ! upgrade_plan "$from_level" "$to_level"; then
        warn "plan.md upgrade failed for L${from_level} → L${to_level}"
        return 2
    fi

    # Step 3: Upgrade spec.md
    verbose "Step 3/5: Upgrading spec.md for L${from_level} → L${to_level}"
    if ! upgrade_spec "$from_level" "$to_level"; then
        warn "spec.md upgrade failed for L${from_level} → L${to_level}"
        return 2
    fi

    # Step 4: Upgrade checklist.md (only meaningful for L3→L3+)
    verbose "Step 4/5: Upgrading checklist.md for L${from_level} → L${to_level}"
    if ! upgrade_checklist "$from_level" "$to_level"; then
        warn "checklist.md upgrade failed for L${from_level} → L${to_level}"
        return 2
    fi

    # Step 5: Update SPECKIT_LEVEL markers in all .md files
    verbose "Step 5/5: Updating markers to L${to_level}"
    if ! update_markers "$to_level"; then
        warn "Marker update failed for L${to_level}"
        return 2
    fi

    info "Completed L${from_level} → L${to_level}"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 19. MAIN ORCHESTRATION
# ───────────────────────────────────────────────────────────────

main() {
    local original_level=""

    # Step 1: Detect current level
    detect_level "$SPEC_FOLDER"
    original_level="$CURRENT_LEVEL"
    info "Detected level: $CURRENT_LEVEL ($LEVEL_METHOD)"

    # Step 2: Validate upgrade path
    validate_upgrade_path

    # Step 3: Create backup (unless dry run)
    if [[ "$DRY_RUN" != "true" ]]; then
        if ! create_backup; then
            if [[ "$JSON_MODE" == "true" ]]; then
                output_json "false" "$original_level" "$TARGET_LEVEL" "Backup creation failed"
            fi
            exit 3
        fi
        info "Backup created: $(basename "$BACKUP_DIR")"
    else
        info "DRY RUN: Skipping backup"
        BACKUP_DIR=""
    fi

    # Step 4: Determine upgrade chain
    # Build a list of single-step upgrades to execute
    local chain_from=()
    local chain_to=()

    local current_num
    local target_num
    current_num=$(level_to_numeric "$CURRENT_LEVEL")
    target_num=$(level_to_numeric "$TARGET_LEVEL")

    # Map numeric back to level string
    # 1→"1", 2→"2", 3→"3", 4→"3+"
    local step_from="$CURRENT_LEVEL"
    if [[ $((current_num + 1)) -le "$target_num" ]]; then
        # Need one or more steps
        local step_num="$current_num"
        while [[ "$step_num" -lt "$target_num" ]]; do
            local next_num=$((step_num + 1))

            # Convert step_num to level string
            local from_str=""
            case "$step_num" in
                1) from_str="1" ;;
                2) from_str="2" ;;
                3) from_str="3" ;;
                4) from_str="3+" ;;
            esac

            # Convert next_num to level string
            local to_str=""
            case "$next_num" in
                1) to_str="1" ;;
                2) to_str="2" ;;
                3) to_str="3" ;;
                4) to_str="3+" ;;
            esac

            chain_from+=("$from_str")
            chain_to+=("$to_str")
            step_num="$next_num"
        done
    fi

    local chain_len=${#chain_from[@]}
    if [[ "$chain_len" -eq 0 ]]; then
        # This should not happen (validate_upgrade_path would have caught it)
        if [[ "$JSON_MODE" == "true" ]]; then
            output_json "false" "$original_level" "$TARGET_LEVEL" "No upgrade steps determined"
        else
            error_exit "No upgrade steps determined (L${CURRENT_LEVEL} → L${TARGET_LEVEL})" 1
        fi
        exit 1
    fi

    if [[ "$chain_len" -gt 1 ]]; then
        info "Multi-step upgrade: ${chain_len} steps"
    fi

    # Step 5: Execute each step in the chain
    local step_idx=0
    while [[ $step_idx -lt $chain_len ]]; do
        local from_lvl="${chain_from[$step_idx]}"
        local to_lvl="${chain_to[$step_idx]}"

        if [[ "$chain_len" -gt 1 ]]; then
            info "Step $((step_idx + 1))/${chain_len}: L${from_lvl} → L${to_lvl}"
        fi

        if ! perform_single_upgrade "$from_lvl" "$to_lvl"; then
            local rollback_ok=true
            if ! restore_from_backup; then
                rollback_ok=false
            fi
            if [[ "$JSON_MODE" == "true" ]]; then
                if [[ "$rollback_ok" == "true" ]]; then
                    output_json "false" "$original_level" "$TARGET_LEVEL" "Upgrade failed at step L${from_lvl} → L${to_lvl}; rollback restored backup"
                else
                    output_json "false" "$original_level" "$TARGET_LEVEL" "Upgrade failed at step L${from_lvl} → L${to_lvl}; rollback incomplete"
                fi
            else
                if [[ "$rollback_ok" == "true" ]]; then
                    warn "Upgrade failed. Restored from backup: $BACKUP_DIR"
                else
                    warn "Upgrade failed and rollback was incomplete: $BACKUP_DIR"
                fi
                error_exit "Upgrade failed at step L${from_lvl} → L${to_lvl}" 2
            fi
            exit 2
        fi

        step_idx=$((step_idx + 1))
    done

    # Step 6: Cleanup old backups (unless dry run or keep-backups)
    if [[ "$DRY_RUN" != "true" ]] && [[ "$KEEP_BACKUPS" != "true" ]]; then
        cleanup_old_backups
    fi

    # Step 7: Output results
    if [[ "$JSON_MODE" == "true" ]]; then
        output_json "true" "$original_level" "$TARGET_LEVEL"
    else
        info "Upgrade complete: L${original_level} → L${TARGET_LEVEL}"

        if [[ ${#CREATED_FILES[@]} -gt 0 ]]; then
            local created_list=""
            local ci=0
            while [[ $ci -lt ${#CREATED_FILES[@]} ]]; do
                if [[ -n "$created_list" ]]; then
                    created_list="${created_list}, ${CREATED_FILES[$ci]}"
                else
                    created_list="${CREATED_FILES[$ci]}"
                fi
                ci=$((ci + 1))
            done
            info "Created: $created_list"
        fi

        if [[ ${#MODIFIED_FILES[@]} -gt 0 ]]; then
            # Deduplicate modified files (same file may be listed multiple times from chain steps)
            local unique_modified=()
            local mi=0
            while [[ $mi -lt ${#MODIFIED_FILES[@]} ]]; do
                local mf="${MODIFIED_FILES[$mi]}"
                local already_listed=false
                local ui=0
                while [[ $ui -lt ${#unique_modified[@]} ]]; do
                    if [[ "${unique_modified[$ui]}" == "$mf" ]]; then
                        already_listed=true
                        break
                    fi
                    ui=$((ui + 1))
                done
                if [[ "$already_listed" != "true" ]]; then
                    unique_modified+=("$mf")
                fi
                mi=$((mi + 1))
            done

            local modified_list=""
            mi=0
            while [[ $mi -lt ${#unique_modified[@]} ]]; do
                if [[ -n "$modified_list" ]]; then
                    modified_list="${modified_list}, ${unique_modified[$mi]}"
                else
                    modified_list="${unique_modified[$mi]}"
                fi
                mi=$((mi + 1))
            done
            info "Modified: $modified_list"
        fi

        if [[ -n "$BACKUP_DIR" ]] && [[ "$DRY_RUN" != "true" ]]; then
            info "Backup: $(basename "$BACKUP_DIR")"
        fi
    fi

    exit 0
}

# ═══════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════

main
