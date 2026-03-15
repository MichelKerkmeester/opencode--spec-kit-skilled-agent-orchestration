#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Template Staleness Checker
# ───────────────────────────────────────────────────────────────
# Compares SPECKIT_TEMPLATE_SOURCE version in each spec folder
# against the current template version. Reports stale folders.
#
# Usage:
#   check-template-staleness.sh [--json] [--auto-upgrade] [--root <path>]
#
# Exit codes:
#   0 - all up to date
#   1 - stale folders found

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

JSON_MODE=false
AUTO_UPGRADE=false
ROOT_PATH=""
TEMPLATE_DIR=""

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --json) JSON_MODE=true; shift ;;
            --auto-upgrade) AUTO_UPGRADE=true; shift ;;
            --root) ROOT_PATH="$2"; shift 2 ;;
            --help|-h) show_help; exit 0 ;;
            *) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;
        esac
    done
}

show_help() {
    cat <<'EOF'
check-template-staleness.sh — Detect spec folders with outdated template versions

Usage: check-template-staleness.sh [--json] [--auto-upgrade] [--root <path>]

Options:
  --json           Machine-readable JSON output
  --auto-upgrade   Apply safe auto-fixes to stale folders (update version comment)
  --root           Repository root (default: git root or cwd)
  --help           Show this help
EOF
}

# ───────────────────────────────────────────────────────────────
# 2. TEMPLATE VERSION DETECTION
# ───────────────────────────────────────────────────────────────

get_current_template_version() {
    local template_spec="$TEMPLATE_DIR/level_1/spec.md"
    if [[ ! -f "$template_spec" ]]; then
        echo "unknown"
        return
    fi
    local version
    version=$(head -n 30 "$template_spec" | grep "SPECKIT_TEMPLATE_SOURCE" | grep -oE 'v[0-9]+\.[0-9]+' | head -1 || true)
    echo "${version:-unknown}"
}

get_folder_template_version() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    [[ ! -f "$spec_file" ]] && { echo "missing"; return; }

    local version
    version=$(head -n 30 "$spec_file" | grep "SPECKIT_TEMPLATE_SOURCE" | grep -oE 'v[0-9]+\.[0-9]+' | head -1 || true)
    echo "${version:-none}"
}

# ───────────────────────────────────────────────────────────────
# 3. SPEC FOLDER DISCOVERY
# ───────────────────────────────────────────────────────────────

discover_spec_folders() {
    local root="$1"
    find "$root" -name "spec.md" -type f \
        -not -path "*/scratch/*" \
        -not -path "*/memory/*" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/test-fixtures/*" \
        -not -path "*/templates/*" \
        2>/dev/null | while IFS= read -r spec_file; do
        dirname "$spec_file"
    done | sort -u
}

# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    parse_args "$@"

    if [[ -z "$ROOT_PATH" ]]; then
        ROOT_PATH="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
    fi

    TEMPLATE_DIR="$ROOT_PATH/.opencode/skill/system-spec-kit/templates"
    if [[ ! -d "$TEMPLATE_DIR" ]]; then
        echo "ERROR: Templates directory not found at $TEMPLATE_DIR" >&2
        exit 2
    fi

    local current_version
    current_version=$(get_current_template_version)

    # Discover and scan folders
    local folders=()
    while IFS= read -r folder; do
        [[ -n "$folder" ]] && folders+=("$folder")
    done < <(discover_spec_folders "$ROOT_PATH")

    local total=${#folders[@]}
    local current_count=0 stale_count=0 none_count=0 missing_count=0
    local stale_folders=()
    # Bash 3.2 compatible version tracking (parallel arrays instead of associative)
    local version_keys=()
    local version_vals=()

    for folder in "${folders[@]}"; do
        local folder_name
        folder_name=$(echo "$folder" | sed "s|$ROOT_PATH/||")
        local version
        version=$(get_folder_template_version "$folder")

        # Track version distribution (Bash 3.2 compatible)
        local found=false
        local idx=0
        for vk in "${version_keys[@]+"${version_keys[@]}"}"; do
            if [[ "$vk" == "$version" ]]; then
                version_vals[$idx]=$(( ${version_vals[$idx]} + 1 ))
                found=true
                break
            fi
            ((idx++))
        done
        if ! $found; then
            version_keys+=("$version")
            version_vals+=(1)
        fi

        case "$version" in
            "$current_version") ((current_count++)) || true ;;
            "none") ((none_count++)) || true; stale_folders+=("$folder_name ($version)") ;;
            "missing") ((missing_count++)) || true ;;
            *) ((stale_count++)) || true; stale_folders+=("$folder_name ($version)")

               if $AUTO_UPGRADE; then
                   for md_file in "$folder"/*.md; do
                       [[ ! -f "$md_file" ]] && continue
                       local basename_md
                       basename_md=$(basename "$md_file")
                       case "$basename_md" in
                           spec.md|plan.md|tasks.md|checklist.md|decision-record.md|implementation-summary.md)
                               if head -n 30 "$md_file" | grep -q "SPECKIT_TEMPLATE_SOURCE:"; then
                                   # Only bump the version portion (vN.N), preserving the template ID
                                   # e.g., "plan-core | v2.0" → "plan-core | v2.2"
                                   sed -i '' "s/\(SPECKIT_TEMPLATE_SOURCE:.*| \)v[0-9][0-9]*\.[0-9][0-9]*/\1$current_version/" "$md_file" 2>/dev/null || true
                               fi
                               ;;
                       esac
                   done
               fi
               ;;
        esac
    done

    if $JSON_MODE; then
        local stale_json="["
        local first=true
        for s in "${stale_folders[@]+"${stale_folders[@]}"}"; do
            $first && first=false || stale_json+=","
            stale_json+="\"$s\""
        done
        stale_json+="]"

        local versions_json="{"
        local first_v=true
        local vidx=0
        for vk in "${version_keys[@]+"${version_keys[@]}"}"; do
            $first_v && first_v=false || versions_json+=","
            versions_json+="\"$vk\":${version_vals[$vidx]}"
            ((vidx++))
        done
        versions_json+="}"

        cat <<EOF
{"current_version":"$current_version","total":$total,"current":$current_count,"stale":$stale_count,"no_version":$none_count,"missing_spec":$missing_count,"versions":$versions_json,"stale_folders":$stale_json}
EOF
    else
        echo ""
        echo "═══════════════════════════════════════════════════════════════"
        echo "  Template Staleness Report"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        echo "  Current template version: $current_version"
        echo "  Total spec folders: $total"
        echo ""
        echo "  Version distribution:"
        local vidx=0
        for vk in "${version_keys[@]+"${version_keys[@]}"}"; do
            local count=${version_vals[$vidx]}
            local marker=""
            [[ "$vk" == "$current_version" ]] && marker=" (current)"
            echo "    $vk: $count folders$marker"
            ((vidx++))
        done
        echo ""

        if [[ ${#stale_folders[@]} -gt 0 ]]; then
            echo "  Stale folders:"
            for s in "${stale_folders[@]}"; do
                echo "    - $s"
            done
            echo ""
        else
            echo "  All folders are up to date."
            echo ""
        fi

        echo "═══════════════════════════════════════════════════════════════"
    fi

    [[ $stale_count -gt 0 || $none_count -gt 0 ]] && exit 1
    exit 0
}

main "$@"
