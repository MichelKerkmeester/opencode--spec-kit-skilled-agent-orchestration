#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-SPEC-DOC-INTEGRITY
# ───────────────────────────────────────────────────────────────

set -euo pipefail

resolve_repo_root() {
    git rev-parse --show-toplevel 2>/dev/null || pwd
}

resolve_target_path() {
    local value="$1"
    local repo_root="$2"

    value="${value#\`}"
    value="${value%\`}"

    if [[ "$value" = /* ]]; then
        printf '%s\n' "$value"
        return 0
    fi

    printf '%s/%s\n' "$repo_root" "$value"
}

resolve_markdown_reference_path() {
    local value="$1"
    local markdown_dir="$2"
    local spec_root="$3"
    local repo_root="$4"

    value="${value#\`}"
    value="${value%\`}"

    if [[ "$value" = /* ]]; then
        [[ -f "$value" ]] && printf '%s\n' "$value"
        return $?
    fi

    local candidate=""
    local candidates=(
        "$markdown_dir/$value"
        "$spec_root/$value"
        "$repo_root/$value"
    )

    for candidate in "${candidates[@]}"; do
        if [[ -f "$candidate" ]]; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done

    return 1
}

run_check() {
    local folder="$1"
    local _level="$2"

    RULE_NAME="SPEC_DOC_INTEGRITY"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local folder_basename
    folder_basename=$(basename "$folder")
    local repo_root
    repo_root=$(resolve_repo_root)
    local issues=()

    local markdown_file=""
    while IFS= read -r markdown_file; do
        [[ -z "$markdown_file" ]] && continue
        local filename
        filename=$(basename "$markdown_file")
        local markdown_dir
        markdown_dir=$(dirname "$markdown_file")

        local refs=""
        refs=$(grep -oE '\`[A-Za-z0-9._/-]+\.md\`' "$markdown_file" 2>/dev/null || true)
        if [[ -n "$refs" ]]; then
            local ref=""
            while IFS= read -r ref; do
                [[ -z "$ref" ]] && continue
                local target=${ref//\`/}
                if ! resolve_markdown_reference_path "$ref" "$markdown_dir" "$folder" "$repo_root" >/dev/null; then
                    issues+=("$filename references missing markdown file: $target")
                fi
            done <<< "$refs"
        fi

        if [[ "$filename" == implementation-summary*.md ]]; then
            local spec_folder_value=""
            spec_folder_value=$(sed -n 's/^| \*\*Spec Folder\*\* | \(.*\) |$/\1/p' "$markdown_file" | head -1)
            if [[ -n "$spec_folder_value" && "$spec_folder_value" != "$folder_basename" ]]; then
                issues+=("$filename has stale Spec Folder metadata: $spec_folder_value")
            fi
        fi

        if [[ "$filename" == handover*.md ]]; then
            local spec_line=""
            spec_line=$(sed -n 's/^\*\*Spec\*\*: \(.*\)$/\1/p' "$markdown_file" | head -1)
            if [[ -n "$spec_line" ]]; then
                local spec_path
                spec_path=$(resolve_target_path "$spec_line" "$repo_root")
                if [[ ! -e "$spec_path" ]]; then
                    issues+=("$filename points to missing spec path: $spec_line")
                fi
            fi

            local resume_path=""
            resume_path=$(sed -n 's|^/spec_kit:resume[[:space:]]\+\(.*\)$|\1|p' "$markdown_file" | head -1)
            if [[ -n "$resume_path" ]]; then
                local resolved_resume
                resolved_resume=$(resolve_target_path "$resume_path" "$repo_root")
                if [[ ! -e "$resolved_resume" ]]; then
                    issues+=("$filename contains a non-resolvable resume target: $resume_path")
                fi
            fi
        fi
    done < <(find "$folder" -maxdepth 1 -type f -name '*.md' | sort)

    if [[ ${#issues[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Spec doc references, metadata, and handover targets resolve cleanly"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="${#issues[@]} spec documentation integrity issue(s) found"
        RULE_DETAILS=("${issues[@]}")
        RULE_REMEDIATION="Fix missing markdown references, align Spec Folder metadata to the actual folder name, and ensure handover spec/resume targets resolve to real paths."
    fi
}

# Exit codes:
#   0 - Success
#   1 - General error
