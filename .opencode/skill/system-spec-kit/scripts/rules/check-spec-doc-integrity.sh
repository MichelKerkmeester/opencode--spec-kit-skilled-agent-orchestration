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

extract_markdown_link_targets() {
    # F-009-B4-01: Markdown link extraction now covers four formats:
    #
    #   1. Inline parens:        [label](path.md)         [label](path.md#anchor)
    #   2. Angle-bracket inline: [label](<path.md>)        — relative paths only
    #                            [label](<path.md#anchor>)   (skip absolute URLs)
    #   3. Reference definition: [label]: ./path.md          — at line start
    #   4. (shortcut/full reference USE like [label][ref] is NOT a target;
    #      the target lives in the matching reference definition (format 3))
    #
    # Absolute URL forms (`https://`, `http://`, `mailto:`) are excluded —
    # they are not local files and the missing-file probe doesn't apply.
    # The awk fence-skip passes through every non-fenced line; the parsing
    # is then done line-by-line by mode.
    awk '
        BEGIN { in_fence = 0 }
        /^[[:space:]]*(```|~~~)/ { in_fence = !in_fence; next }
        in_fence { next }

        # Format 3: Reference definition  [label]: ./path.md  (line start, optional title in quotes)
        # Captures the target up to the first whitespace.
        match($0, /^[[:space:]]*\[[^]]+\][[:space:]]*:[[:space:]]*[^[:space:]>]+\.md([#?][^[:space:]]*)?/) {
            ref = substr($0, RSTART, RLENGTH)
            sub(/^[[:space:]]*\[[^]]+\][[:space:]]*:[[:space:]]*/, "", ref)
            sub(/[#?].*$/, "", ref)
            # Skip absolute URLs.
            if (ref !~ /^(https?:|mailto:)/) print ref
        }

        # Format 1+2: extract every inline link [label](target) and [label](<target>) on the line.
        {
            line = $0
            while (match(line, /\[[^]]+\]\(<?[^)>]+\.md([^)>]*)?>?\)/)) {
                token = substr(line, RSTART, RLENGTH)
                line = substr(line, RSTART + RLENGTH)
                # Strip the [label]( prefix and trailing ).
                sub(/^\[[^]]+\]\(/, "", token)
                sub(/\)$/, "", token)
                # Strip optional <...> angle brackets.
                sub(/^</, "", token)
                sub(/>$/, "", token)
                # Strip anchor / query fragment.
                sub(/[#?].*$/, "", token)
                if (token !~ /^(https?:|mailto:)/ && token != "") print token
            }
        }
    ' "$1" 2>/dev/null || true
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
        refs=$(extract_markdown_link_targets "$markdown_file")
        if [[ -n "$refs" ]]; then
            local ref=""
            while IFS= read -r ref; do
                [[ -z "$ref" ]] && continue
                local target="$ref"
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
