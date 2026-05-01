#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Template Utils
# ───────────────────────────────────────────────────────────────
# Template operations for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/template-utils.sh"
#
# Functions:
# Get_level_templates_dir()  - Resolve template directory for a given level
# Copy_template()            - Copy template file with level-specific fallback
# Copy_templates_batch()      - Render several manifest templates in one Node process
# Resolve_level_contract()   - Print the private Level contract as JSON
# Level_contract_docs_from_json() - Print scaffolded docs from a contract JSON
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_TEMPLATE_UTILS_LOADED:-}" ]] && return 0
_TEMPLATE_UTILS_LOADED=1

# ───────────────────────────────────────────────────────────────
# Get level-specific templates directory path.
# Maps documentation level (1, 2, 3, 3+) to the appropriate folder.
#
# Usage: dir=$(get_level_templates_dir "2" "/path/to/templates")
# Args:
# $1 - Documentation level: 1, 2, 3, or 3+
# $2 - Base templates directory path
# Returns: Prints resolved directory path to stdout
# ───────────────────────────────────────────────────────────────
get_level_templates_dir() {
    local level="$1"
    local base_dir="$2"
    case "$level" in
        1) printf '%s\n' "$base_dir/level_1" ;;
        2) printf '%s\n' "$base_dir/level_2" ;;
        3) printf '%s\n' "$base_dir/level_3" ;;
        "3+"|4) printf '%s\n' "$base_dir/level_3+" ;;
        *) printf '%s\n' "$base_dir/level_1" ;;  # Default fallback
    esac
}

# ───────────────────────────────────────────────────────────────
# Copy a template file to a destination directory with fallback.
# Tries level-specific folder first, then falls back to base templates.
# Missing required templates fail closed.
#
# Consolidated from create.sh's copy_template() and copy_subfolder_template()
# Which were near-identical (only differed in destination directory).
#
# Usage: copy_template "spec.md" "/dest/dir" "/level/templates" "/base/templates" [dest_name]
# Args:
# $1 - Template filename (e.g., "spec.md")
# $2 - Destination directory (e.g., "$FEATURE_DIR" or "$SUBFOLDER_PATH")
# $3 - Level-specific templates directory
# $4 - Base templates directory (fallback)
# $5 - (Optional) Destination filename if different from template name
# Returns: Prints the created filename to stdout (for tracking in CREATED_FILES)
# Exit: Non-zero when rendering, writing, or template lookup fails
# ───────────────────────────────────────────────────────────────
copy_template() {
    local template_name="$1"
    local dest_dir="$2"
    local level_or_dir="$3"
    local base_templates_dir="$4"
    local dest_name="${5:-$template_name}"
    local render_level
    render_level="$(_normalize_template_level "$level_or_dir")"
    local dest_path="$dest_dir/$dest_name"
    local template_path

    if ! _validate_contract_doc_name "$template_name" || ! _validate_contract_doc_name "$dest_name"; then
        echo "Error: invalid template document name for Level $render_level" >&2
        return 1
    fi

    if ! _ensure_dest_within_dir "$dest_dir" "$dest_path"; then
        echo "Error: template destination escapes target folder for Level $render_level" >&2
        return 1
    fi

    template_path="$(_manifest_template_path "$template_name" "$render_level" "$base_templates_dir")"

    if [[ -f "$template_path" ]]; then
        local renderer tmp_path
        renderer="$(_inline_gate_renderer_path)"
        tmp_path="$(mktemp "${dest_path}.tmp.XXXXXX")"
        if "$renderer" --level "$render_level" "$template_path" > "$tmp_path"; then
            :
        else
            local render_status=$?
            rm -f "$tmp_path"
            return "$render_status"
        fi
        if ! mv "$tmp_path" "$dest_path"; then
            local move_status=$?
            rm -f "$tmp_path"
            return "$move_status"
        fi
        printf '%s\n' "$dest_name"
    else
        echo "Error: required template document missing for Level $render_level: $template_name" >&2
        return 1
    fi
}

copy_templates_batch() {
    local docs="$1"
    local dest_dir="$2"
    local render_level="$3"
    local base_templates_dir="$4"
    local renderer
    renderer="$(_inline_gate_renderer_path)"

    local template_paths=()
    local doc_names=()
    local template_name template_path
    while IFS= read -r template_name; do
        [[ -z "$template_name" ]] && continue
        if ! _validate_contract_doc_name "$template_name"; then
            echo "Error: invalid template document name for Level $render_level" >&2
            return 1
        fi
        template_path="$(_manifest_template_path "$template_name" "$render_level" "$base_templates_dir")"
        if [[ ! -f "$template_path" ]]; then
            echo "Error: required template document missing for Level $render_level: $template_name" >&2
            return 1
        fi
        if ! _ensure_dest_within_dir "$dest_dir" "$dest_dir/$template_name"; then
            echo "Error: template destination escapes target folder for Level $render_level" >&2
            return 1
        fi
        template_paths+=("$template_path")
        doc_names+=("$template_name")
    done <<< "$docs"

    if [[ ${#template_paths[@]} -eq 0 ]]; then
        return 0
    fi

    if ! "$renderer" --level "$render_level" --out-dir "$dest_dir" "${template_paths[@]}"; then
        return $?
    fi

    if [[ "$render_level" == "phase" && -f "$dest_dir/phase-parent.spec.md" ]]; then
        mv "$dest_dir/phase-parent.spec.md" "$dest_dir/spec.md"
    fi

    local doc_name
    for doc_name in "${doc_names[@]}"; do
        printf '%s\n' "$doc_name"
    done
}

_validate_contract_doc_name() {
    local doc_name="$1"
    case "$doc_name" in
        ""|/*|.*|*".."*|*//*) return 1 ;;
    esac
    [[ "$doc_name" =~ ^([A-Za-z0-9][A-Za-z0-9_-]*/)?[A-Za-z0-9][A-Za-z0-9_-]*\.md$ ]]
}

_ensure_dest_within_dir() {
    local dest_dir="$1"
    local dest_path="$2"
    local resolved_dir resolved_parent resolved_path

    mkdir -p "$dest_dir" "$(dirname "$dest_path")"
    resolved_dir="$(cd "$dest_dir" >/dev/null 2>&1 && pwd -P)" || return 1
    resolved_parent="$(cd "$(dirname "$dest_path")" >/dev/null 2>&1 && pwd -P)" || return 1
    resolved_path="$resolved_parent/$(basename "$dest_path")"

    case "$resolved_path" in
        "$resolved_dir"/*) return 0 ;;
        *) return 1 ;;
    esac
}

_normalize_template_level() {
    local level_or_dir="$1"
    case "$level_or_dir" in
        1|2|3|"3+"|phase) printf '%s\n' "$level_or_dir" ;;
        phase-parent) printf '%s\n' "phase" ;;
        */level_1) printf '%s\n' "1" ;;
        */level_2) printf '%s\n' "2" ;;
        */level_3) printf '%s\n' "3" ;;
        */level_3+) printf '%s\n' "3+" ;;
        */phase_parent) printf '%s\n' "phase" ;;
        *) printf '%s\n' "1" ;;
    esac
}

_manifest_template_path() {
    local template_name="$1"
    local render_level="$2"
    local base_templates_dir="$3"
    local manifest_name

    if [[ "$render_level" == "phase" ]] && [[ "$template_name" == "spec.md" ]]; then
        manifest_name="phase-parent.spec.md.tmpl"
    elif [[ "$template_name" == *.tmpl ]]; then
        manifest_name="$template_name"
    else
        manifest_name="${template_name}.tmpl"
    fi

    printf '%s\n' "$base_templates_dir/manifest/$manifest_name"
}

_inline_gate_renderer_path() {
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local skill_root
    skill_root="$(cd "$script_dir/../.." && pwd)"
    printf '%s\n' "$skill_root/scripts/templates/inline-gate-renderer.sh"
}

# ───────────────────────────────────────────────────────────────
# Resolve the private Level contract for shell callers.
#
# Usage: resolve_level_contract "3"
# Args:
# $1 - Documentation level: 1, 2, 3, 3+, or phase
# Returns: Prints contract JSON to stdout
# ───────────────────────────────────────────────────────────────
resolve_level_contract() {
    local level="$1"
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local skill_root
    skill_root="$(cd "$script_dir/../.." && pwd)"
    local loader="$skill_root/scripts/node_modules/tsx/dist/loader.mjs"
    local resolver="$skill_root/mcp_server/lib/templates/level-contract-resolver.ts"

    node --import "$loader" --input-type=module - "$level" "$resolver" <<'NODE'
import { pathToFileURL } from 'node:url';

const [level, resolverPath] = process.argv.slice(2);
try {
  const resolver = await import(pathToFileURL(resolverPath).href);
  const contract = resolver.resolveLevelContract(level);
  process.stdout.write(JSON.stringify(resolver.serializeLevelContract(contract)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message || `Internal template contract could not be resolved for Level ${level}`);
  if (process.env.SPECKIT_VERBOSE_RESOLVER === '1' && error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  process.exit(3);
}
NODE
}

level_contract_docs_from_json() {
    local contract_json="$1"
    node - "$contract_json" <<'NODE'
const contract = JSON.parse(process.argv[2]);
const docRe = /^(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)?[A-Za-z0-9][A-Za-z0-9_-]*\.md$/u;
const docs = [...(contract.requiredCoreDocs || []), ...(contract.requiredAddonDocs || [])];
if (docs.length === 0) {
  console.error('Internal template contract did not include required documents');
  process.exit(3);
}
for (const doc of docs) {
  if (typeof doc !== 'string' || !docRe.test(doc) || doc.includes('..')) {
    console.error('Internal template contract included an invalid document name');
    process.exit(3);
  }
  process.stdout.write(`${doc}\n`);
}
NODE
}

# Exit codes:
# 0 - Success
