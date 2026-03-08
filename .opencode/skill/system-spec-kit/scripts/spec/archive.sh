#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Archive Spec
# ───────────────────────────────────────────────────────────────
#
# Archive completed spec folders to specs/z_archive/
# Usage: archive-spec.sh <spec-folder> | --list | --restore <folder>

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use git rev-parse for robust project root detection (preferred over relative paths)
if git rev-parse --show-toplevel >/dev/null 2>&1; then
    PROJECT_ROOT="$(git rev-parse --show-toplevel)"
else
    # Fallback for non-git repos: relative path from scripts/spec/ to project root
    # Path: scripts/spec/ -> scripts/ -> system-spec-kit/ -> skill/ -> .opencode/ -> project
    PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"
    echo "Warning: Not in a git repo, using relative path for PROJECT_ROOT" >&2
fi
ARCHIVE_DIR="specs/z_archive"
COMPLETENESS_SCRIPT="$SCRIPT_DIR/calculate-completeness.sh"
MIN_COMPLETENESS=90

# ───────────────────────────────────────────────────────────────
# 2. COLORS
# ───────────────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  NC='\033[0m'
  BOLD='\033[1m'
else
  RED='' GREEN='' YELLOW='' BLUE='' NC='' BOLD=''
fi

# ───────────────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

show_help() {
    cat << 'EOF'
archive-spec.sh - Archive completed spec folders

USAGE:
    archive-spec.sh <spec-folder>
    archive-spec.sh --list
    archive-spec.sh --restore <archived-folder>

OPTIONS:
    --list, -l          List all archived specs
    --restore, -r       Restore an archived spec folder
    --force, -f         Skip completeness check (archive anyway)
    --help, -h          Show this help message

EXAMPLES:
    archive-spec.sh specs/051-feature-name/
    archive-spec.sh --force specs/051-feature-name/
    archive-spec.sh --list
    archive-spec.sh --restore specs/z_archive/051-feature-name/

NOTES:
    - Specs with <90% completeness will prompt for confirmation
    - Use --force to skip the completeness check
    - Archived specs are moved to specs/z_archive/
EOF
}

log_info() { echo -e "${BLUE}INFO:${NC} $1"; }
log_success() { echo -e "${GREEN}SUCCESS:${NC} $1"; }
log_warning() { echo -e "${YELLOW}WARNING:${NC} $1"; }
log_error() { echo -e "${RED}ERROR:${NC} $1" >&2; }

# Resolve an existing directory to a canonical physical path.
resolve_existing_dir() {
    local dir_path="$1"
    if [[ ! -d "$dir_path" ]]; then
        return 1
    fi
    (cd "$dir_path" >/dev/null 2>&1 && pwd -P)
}

# Containment check with path boundary semantics.
is_path_within() {
    local candidate="$1"
    local base="$2"
    [[ "$candidate" == "$base" || "$candidate" == "$base"/* ]]
}

# Spec folders must match NNN-name.
validate_spec_folder_name() {
    local folder_name="$1"
    local label="${2:-Spec}"
    if [[ ! "$folder_name" =~ ^[0-9]{3}-[A-Za-z0-9._-]+$ ]]; then
        log_error "${label} folder name must match NNN-name pattern: $folder_name"
        exit 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 4. CORE FUNCTIONS
# ───────────────────────────────────────────────────────────────

get_completeness() {
    local spec_folder="$1"

    if [[ ! -x "$COMPLETENESS_SCRIPT" ]]; then
        log_warning "Completeness script not found: $COMPLETENESS_SCRIPT"
        echo "0"
        return
    fi

    local json_output
    json_output=$("$COMPLETENESS_SCRIPT" --json "$spec_folder" 2>/dev/null || echo '{}')

    local completeness
    completeness=$(echo "$json_output" | grep -o '"overall_completion": [0-9]*' | grep -o '[0-9]*' || echo "0")

    # Default to 100 if calculation fails
    [[ -z "$completeness" ]] && completeness=100

    echo "$completeness"
}

archive_spec() {
    local spec_folder="$1"
    local force="${2:-false}"
    local specs_root archive_root resolved_spec

    spec_folder="${spec_folder%/}"

    if ! specs_root="$(resolve_existing_dir "$PROJECT_ROOT/specs")"; then
        log_error "Specs directory not found: $PROJECT_ROOT/specs"
        exit 1
    fi

    mkdir -p "$PROJECT_ROOT/$ARCHIVE_DIR"
    if ! archive_root="$(resolve_existing_dir "$PROJECT_ROOT/$ARCHIVE_DIR")"; then
        log_error "Archive directory not accessible: $PROJECT_ROOT/$ARCHIVE_DIR"
        exit 1
    fi

    if ! resolved_spec="$(resolve_existing_dir "$spec_folder")"; then
        log_error "Spec folder not found: $spec_folder"
        exit 1
    fi

    if is_path_within "$resolved_spec" "$archive_root"; then
        log_error "Folder is already archived: $resolved_spec"
        exit 1
    fi

    if ! is_path_within "$resolved_spec" "$specs_root"; then
        log_error "Refusing to archive outside specs root: $resolved_spec"
        log_info "Allowed root: $specs_root"
        exit 1
    fi

    if [[ "$force" != "true" ]]; then
        local completeness
        completeness=$(get_completeness "$resolved_spec")

        if [[ "$completeness" -lt "$MIN_COMPLETENESS" ]]; then
            log_warning "Spec is only ${completeness}% complete (minimum: ${MIN_COMPLETENESS}%)"
            echo -n "Archive anyway? (y/n): "
            read -r response
            if [[ "$response" != "y" ]] && [[ "$response" != "Y" ]]; then
                log_info "Archive cancelled."
                exit 0
            fi
        else
            log_info "Spec completeness: ${completeness}%"
        fi
    fi

    local basename
    basename=$(basename "$resolved_spec")
    validate_spec_folder_name "$basename" "Spec"

    if [[ -d "$archive_root/$basename" ]]; then
        log_error "Archive target already exists: $archive_root/$basename"
        exit 1
    fi

    # Atomic move: First copy to temp location within target, then rename
    # This avoids race conditions during directory operations
    local temp_target="$archive_root/.tmp_$$_$basename"
    
    # Clean up any stale temp directories from previous failed runs
    rm -rf "$archive_root"/.tmp_*_"$basename" 2>/dev/null || true
    
    # Copy to temp location first
    if ! cp -R "$resolved_spec" "$temp_target"; then
        rm -rf "$temp_target" 2>/dev/null || true
        log_error "Failed to copy spec folder to archive"
        exit 1
    fi
    
    # Atomic rename (mv within same filesystem is atomic)
    if ! mv "$temp_target" "$archive_root/$basename"; then
        rm -rf "$temp_target" 2>/dev/null || true
        log_error "Failed to rename temp archive to final location"
        exit 1
    fi
    
    # Only remove source after successful copy+rename
    rm -rf "$resolved_spec"

    log_success "Archived: $resolved_spec -> $archive_root/$basename"
}

list_archived() {
    if [[ ! -d "$ARCHIVE_DIR" ]]; then
        log_info "No archived specs found."
        exit 0
    fi

    local count
    count=$(find "$ARCHIVE_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')

    if [[ "$count" -eq 0 ]]; then
        log_info "No archived specs found."
        exit 0
    fi

    echo -e "${BOLD}Archived Specs ($count):${NC}"
    echo "================================"

    for dir in "$ARCHIVE_DIR"/*/; do
        if [[ -d "$dir" ]]; then
            local name
            name=$(basename "$dir")
            local date
            date=$(stat -f "%Sm" -t "%Y-%m-%d" "$dir" 2>/dev/null || stat -c "%y" "$dir" 2>/dev/null | cut -d' ' -f1)
            printf "  %-40s %s\n" "$name" "$date"
        fi
    done

    echo ""
    echo "To restore: archive-spec.sh --restore $ARCHIVE_DIR/<folder-name>"
}

restore_spec() {
    local archived_folder="$1"
    local specs_root archive_root resolved_archived

    archived_folder="${archived_folder%/}"

    if ! specs_root="$(resolve_existing_dir "$PROJECT_ROOT/specs")"; then
        log_error "Specs directory not found: $PROJECT_ROOT/specs"
        exit 1
    fi

    if ! archive_root="$(resolve_existing_dir "$PROJECT_ROOT/$ARCHIVE_DIR")"; then
        log_error "Archive directory not found: $PROJECT_ROOT/$ARCHIVE_DIR"
        exit 1
    fi

    if ! resolved_archived="$(resolve_existing_dir "$archived_folder")"; then
        log_error "Archived folder not found: $archived_folder"
        exit 1
    fi

    if ! is_path_within "$resolved_archived" "$archive_root"; then
        log_error "Folder is not in archive directory: $archived_folder"
        log_info "Archive directory: $archive_root"
        exit 1
    fi

    local basename
    basename=$(basename "$resolved_archived")
    validate_spec_folder_name "$basename" "Archived"

    local destination="$specs_root/$basename"

    if [[ -d "$destination" ]]; then
        log_error "Restore target already exists: $destination"
        exit 1
    fi

    mv "$resolved_archived" "$destination"

    log_success "Restored: $resolved_archived -> $destination"
}

# ───────────────────────────────────────────────────────────────
# 5. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    cd "$PROJECT_ROOT"

    local force=false
    local action=""
    local target=""

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --list|-l) action="list"; shift ;;
            --restore|-r) action="restore"; shift; target="${1:-}"; shift || true ;;
            --force|-f) force=true; shift ;;
            --help|-h) show_help; exit 0 ;;
            -*)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                if [[ -z "$action" ]]; then
                    action="archive"
                    target="$1"
                fi
                shift
                ;;
        esac
    done

    case "$action" in
        list) list_archived ;;
        restore)
            if [[ -z "$target" ]]; then
                log_error "No folder specified for restore"
                show_help
                exit 1
            fi
            restore_spec "$target"
            ;;
        archive)
            if [[ -z "$target" ]]; then
                log_error "No spec folder specified"
                show_help
                exit 1
            fi
            archive_spec "$target" "$force"
            ;;
        *)
            log_error "No action specified"
            show_help
            exit 1
            ;;
    esac
}

main "$@"

# Exit codes:
#   0 - Success
#   1 - ${RED}ERROR:${NC} $1
