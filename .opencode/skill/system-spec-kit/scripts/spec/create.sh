#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Create Spec Folder
# ───────────────────────────────────────────────────────────────
# Creates spec folder with templates based on documentation level.
#
# TEMPLATE ARCHITECTURE (v2.0 - CORE + ADDENDUM):
#   Templates/
#   ├── level_1/        # Core only (~270 LOC total)
#   ├── level_2/        # Core + Verification (~390 LOC)
#   ├── level_3/        # Core + Verification + Architecture (~540 LOC)
#   └── level_3+/       # All addendums (~640 LOC)
#
# LEVEL SCALING (Value-based, not just length):
#   L1: Essential what/why/how - spec, plan, tasks, impl-summary
#   L2: +Quality gates, verification - checklist.md
#   L3: +Architecture decisions - decision-record.md
#   L3+: +Enterprise governance - extended content
#
# Also creates scratch/ directories.

set -euo pipefail

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../lib/shell-common.sh"
source "${SCRIPT_DIR}/../lib/git-branch.sh"
source "${SCRIPT_DIR}/../lib/template-utils.sh"

JSON_MODE=false
SHORT_NAME=""
BRANCH_NUMBER=""
DOC_LEVEL=1  # Default to Level 1 (Baseline)
SKIP_BRANCH=false
SHARDED=false  # Enable sharded spec sections for Level 3
SUBFOLDER_MODE=false  # Enable versioned sub-folder creation
SUBFOLDER_BASE=""     # Base folder for sub-folder mode
SUBFOLDER_TOPIC=""    # Topic name for the sub-folder
TEMPLATE_STYLE="minimal"  # Only minimal templates supported
PHASE_MODE=false        # Enable phase decomposition mode
PHASE_COUNT=3           # Number of child phases to create
PHASE_COUNT_EXPLICIT=false
PHASE_NAMES=""          # Comma-separated phase names (optional)
PHASE_PARENT=""         # Existing parent spec folder path (phase append mode)
EXPLICIT_PATH=""        # Hidden test harness path override
EXPLICIT_NAME=""        # Hidden test harness name override

# Initialize variables used in JSON output (prevents "unbound variable" errors with set -u)
DETECTED_LEVEL=""
DETECTED_SCORE=""
DETECTED_CONF=""
EXPAND_TEMPLATES=false

ARGS=()
i=1
while [[ $i -le $# ]]; do
    arg="${!i}"
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --level)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --level requires a value (1, 2, or 3)' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --level requires a value (1, 2, or 3)' >&2
                exit 1
            fi
            if [[ ! "$next_arg" =~ ^(1|2|3|3\+|phase-parent)$ ]]; then
                echo 'Error: --level must be 1, 2, 3, or 3+' >&2
                exit 1
            fi
            if [[ "$next_arg" == "phase-parent" ]]; then
                DOC_LEVEL="phase"
            else
                DOC_LEVEL="$next_arg"
            fi
            ;;
        --path)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --path requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --path requires a value' >&2
                exit 1
            fi
            EXPLICIT_PATH="$next_arg"
            SKIP_BRANCH=true
            ;;
        --name)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --name requires a value' >&2
                exit 1
            fi
            EXPLICIT_NAME="$next_arg"
            ;;
        --skip-branch)
            SKIP_BRANCH=true
            ;;
        --sharded)
            SHARDED=true
            ;;
        --subfolder)
            SUBFOLDER_MODE=true
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --subfolder requires a base folder path' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --subfolder requires a base folder path' >&2
                exit 1
            fi
            SUBFOLDER_BASE="$next_arg"
            ;;
        --topic)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --topic requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --topic requires a value' >&2
                exit 1
            fi
            SUBFOLDER_TOPIC="$next_arg"
            ;;
        --phase)
            PHASE_MODE=true
            ;;
        --phases)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --phases requires a positive integer' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --phases requires a positive integer' >&2
                exit 1
            fi
            if ! [[ "$next_arg" =~ ^[1-9][0-9]*$ ]]; then
                echo 'Error: --phases must be a positive integer (got: '"$next_arg"')' >&2
                exit 1
            fi
            PHASE_COUNT="$next_arg"
            PHASE_COUNT_EXPLICIT=true
            ;;
        --phase-names)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --phase-names requires a comma-separated list' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --phase-names requires a comma-separated list' >&2
                exit 1
            fi
            PHASE_NAMES="$next_arg"
            ;;
        --parent)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --parent requires an existing spec folder path' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --parent requires an existing spec folder path' >&2
                exit 1
            fi
            PHASE_PARENT="$next_arg"
            ;;
        --phase-parent)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --phase-parent requires an existing spec folder path' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --phase-parent requires an existing spec folder path' >&2
                exit 1
            fi
            PHASE_PARENT="$next_arg"
            ;;
        --short-name)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            # Peek ahead: if next arg starts with --, current option has no value — use default
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            SHORT_NAME="$next_arg"
            ;;
        --number)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            BRANCH_NUMBER="$next_arg"
            ;;
        --help|-h)
            echo "Usage: $0 [options] <feature_description>"
            echo ""
            echo "Creates a new spec folder with templates based on documentation level."
            echo ""
            echo "Options:"
            echo "  --json              Output in JSON format"
            echo "  --level N           Documentation level: 1, 2, 3, or 3+ (extended)"
            echo "                      1=baseline, 2=verification, 3=full, 3+=extended"
            echo "                      Default: 1"
            echo "  --sharded           Create sharded spec sections (Level 3 only)"
            echo "                      Creates spec-sections/ with modular documentation"
            echo "  --subfolder <path>  Create versioned sub-folder in existing spec folder"
            echo "                      Auto-increments version (001, 002, etc.)"
            echo "  --topic <name>      Topic name for sub-folder (used with --subfolder)"
            echo "                      If not provided, uses feature_description"
            echo "  --phase             Create phased spec (parent + child folders)"
            echo "                      Mutually exclusive with --subfolder"
            echo "  --phases <N>        Number of initial child phases (default: 3)"
            echo "  --phase-names <list>  Comma-separated names for child phases"
            echo "  --parent <path>     Add phases to existing parent spec folder (with --phase)"
            echo "  --phase-parent <path>  Alias for --parent in phase mode (supports nested .opencode/specs/ paths)"
            echo "                      Example: --phase-names \"foundation,implementation,integration\""
            echo "  --short-name <name> Provide a custom short name (2-4 words) for the branch"
            echo "  --number N          Specify branch number manually (overrides auto-detection)"
            echo "  --skip-branch       Create spec folder only, don't create git branch"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Documentation Levels (CORE + ADDENDUM architecture v2.0):"
            echo ""
            echo "  Level 1 (Core ~270 LOC):     Essential what/why/how"
            echo "    Files: spec.md, plan.md, tasks.md, implementation-summary.md"
            echo ""
            echo "  Level 2 (Core + Verify):     +Quality gates, verification"
            echo "    Adds: checklist.md, NFRs, edge cases, effort estimation"
            echo ""
            echo "  Level 3 (Core + Verify + Arch): +Architecture decisions"
            echo "    Adds: decision-record.md, executive summary, risk matrix, ADRs"
            echo ""
            echo "  Level 3+ (All addendums):    +Enterprise governance"
            echo "    Adds: approval workflow, compliance, stakeholder matrix, AI protocols"
            echo ""
            echo "Template Composition:"
            echo "  Core templates (~270 LOC) are shared across all levels."
            echo "  Higher levels ADD value, not just length."
            echo "  Templates located in: .opencode/skill/system-spec-kit/templates/"
            echo ""
            echo "All levels include: scratch/ (git-ignored working files)"
            echo ""
            echo "Examples:"
            echo "  $0 'Add user authentication system' --short-name 'user-auth'"
            echo "  $0 'Implement complex OAuth2 flow' --level 2"
            echo "  $0 'Major architecture redesign' --level 3 --number 50"
            echo "  $0 'Large platform migration' --level 3 --sharded"
            echo ""
            echo "Sub-folder Versioning Examples:"
            echo "  $0 --subfolder specs/005-context-capture 'Initial implementation'"
            echo "  $0 --subfolder specs/005-context-capture --topic 'refactor' 'Phase 2 refactoring'"
            echo ""
            echo "  Creates: specs/005-context-capture/001-initial-implementation/"
            echo "           specs/005-context-capture/002-refactor/"
            echo ""
            echo "Phase Mode Examples:"
            echo "  $0 --phase 'Large platform migration'"
            echo "  $0 --phase --phases 3 'OAuth2 implementation'"
            echo "  $0 --phase --phases 3 --phase-names 'foundation,implementation,integration' 'OAuth2 flow'"
            echo "  $0 --phase --parent specs/042-oauth2-flow --phases 2 --phase-names 'stabilization,rollout' 'OAuth2 flow'"
            echo '  $0 --phase --phase-parent .opencode/specs/system-spec-kit/023-esm/011-fusion --phase-names "research,implementation" "Graph improvements"'
            echo ""
            echo "  Creates: specs/042-oauth2-flow/"
            echo "           specs/042-oauth2-flow/001-foundation/"
            echo "           specs/042-oauth2-flow/002-implementation/"
            echo "           specs/042-oauth2-flow/003-integration/"
            exit 0
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]:-$EXPLICIT_NAME}"
if [[ -z "$FEATURE_DESCRIPTION" ]]; then
    echo "Usage: $0 [--json] [--short-name <name>] [--number N] <feature_description>" >&2
    exit 1
fi

# Mutual exclusivity check: --phase and --subfolder cannot be combined
if [[ "$PHASE_MODE" = true ]] && [[ "$SUBFOLDER_MODE" = true ]]; then
    echo "Error: --phase and --subfolder are mutually exclusive" >&2
    exit 1
fi

# --parent/--phase-parent are only valid in phase mode
if [[ -n "$PHASE_PARENT" ]] && [[ "$PHASE_MODE" != true ]]; then
    echo "Error: --parent and --phase-parent can only be used with --phase" >&2
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS (shared functions sourced from lib/)
# ───────────────────────────────────────────────────────────────

slugify_token() {
    local input="$1"
    echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

create_versioned_subfolder() {
    local base_folder="$1"
    local topic="$2"
    
    # Validate base folder exists
    if [[ ! -d "$base_folder" ]]; then
        echo "Error: Base folder does not exist: $base_folder" >&2
        exit 1
    fi
    
    # Find next version number by scanning existing sub-folders
    local max_version=0
    for dir in "$base_folder"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$dir" ]]; then
            local dirname="${dir%/}"      # Remove trailing slash
            dirname="${dirname##*/}"       # Get basename
            local num="${dirname%%-*}"     # Extract number prefix
            num=$((10#$num))               # Remove leading zeros (force base-10)
            if [[ $num -gt $max_version ]]; then
                max_version=$num
            fi
        fi
    done
    
    local next_version=$((max_version + 1))
    local version_str=$(printf "%03d" $next_version)
    local subfolder_name="${version_str}-${topic}"
    local subfolder_path="$base_folder/$subfolder_name"
    
    # Create sub-folder scratch/ workspace.
    mkdir -p "$subfolder_path/scratch"
    touch "$subfolder_path/scratch/.gitkeep"
    create_graph_metadata_file "$subfolder_path" "${FEATURE_DESCRIPTION:-$topic}" "planned"
    
    echo "$subfolder_path"
}

# Resolve an existing directory to a canonical physical path.
resolve_existing_dir() {
    local dir_path="$1"
    if [[ ! -d "$dir_path" ]]; then
        return 1
    fi
    (cd "$dir_path" >/dev/null 2>&1 && pwd -P)
}

create_graph_metadata_file() {
    local folder_path="$1"
    local summary="${2:-}"
    local status="${3:-planned}"
    local graph_path="$folder_path/graph-metadata.json"

    if [[ -f "$graph_path" ]]; then
        return 0
    fi

    local relative_spec="${folder_path#$SPECS_DIR/}"
    if [[ "$relative_spec" == "$folder_path" ]]; then
        relative_spec="${folder_path#${REPO_ROOT}/.opencode/specs/}"
    fi
    relative_spec="${relative_spec#./}"

    local parent_name
    parent_name="$(basename "$(dirname "$folder_path")")"
    local parent_id="null"
    if [[ "$parent_name" =~ ^[0-9]{3}(?:[-_].+)?$ ]]; then
        local parent_rel
        parent_rel="$(dirname "$relative_spec")"
        parent_id="\"${parent_rel}\""
    fi

    local now_iso
    now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    local summary_text="$summary"
    if [[ -z "$summary_text" ]]; then
        summary_text="${FEATURE_DESCRIPTION:-Spec folder graph metadata scaffold}"
    fi

    local source_docs_json='["spec.md","plan.md","tasks.md"]'
    local key_files_json='["spec.md","plan.md","tasks.md"]'
    if [[ -f "$folder_path/spec.md" && ! -f "$folder_path/plan.md" && ! -f "$folder_path/tasks.md" ]]; then
        source_docs_json='["spec.md"]'
        key_files_json='["spec.md"]'
    elif [[ -f "$folder_path/checklist.md" && -f "$folder_path/decision-record.md" ]]; then
        source_docs_json='["spec.md","plan.md","tasks.md","checklist.md","decision-record.md"]'
        key_files_json='["spec.md","plan.md","tasks.md","checklist.md","decision-record.md"]'
    elif [[ -f "$folder_path/checklist.md" ]]; then
        source_docs_json='["spec.md","plan.md","tasks.md","checklist.md"]'
        key_files_json='["spec.md","plan.md","tasks.md","checklist.md"]'
    fi

    cat > "$graph_path" <<EOF
{
  "schema_version": 1,
  "packet_id": "${relative_spec}",
  "spec_folder": "${relative_spec}",
  "parent_id": ${parent_id},
  "children_ids": [],
  "manual": {
    "depends_on": [],
    "supersedes": [],
    "related_to": []
  },
    "derived": {
    "trigger_phrases": [],
    "key_topics": [],
    "importance_tier": "important",
    "status": "${status}",
    "key_files": ${key_files_json},
    "entities": [],
    "causal_summary": "${summary_text//\"/\\\"}",
    "created_at": "${now_iso}",
    "last_save_at": "${now_iso}",
    "save_lineage": "graph_only",
    "last_accessed_at": null,
    "source_docs": ${source_docs_json}
  }
}
EOF
}

ensure_template_source_near_top() {
    local file_path="$1"

    local marker
    marker=$(grep -m1 "SPECKIT_TEMPLATE_SOURCE:" "$file_path" 2>/dev/null || true)
    [[ -z "$marker" ]] && return 0
    marker="${marker#<!-- }"
    marker="${marker% -->}"
    marker="${marker#\# }"

    marker="<!-- ${marker} -->"

    local tmp_file
    tmp_file=$(mktemp "${file_path}.tmp.XXXXXX")
    awk -v marker="$marker" '
        /SPECKIT_TEMPLATE_SOURCE:/ {
            next
        }
        $0 == "---" {
            print
            dash_count += 1
            if (!inserted && dash_count == 2) {
                print marker
                inserted = 1
            }
            next
        }
        { print }
    ' "$file_path" > "$tmp_file"
    mv "$tmp_file" "$file_path"
}

finalize_scaffold_templates() {
    local folder_path="$1"
    local packet_pointer="$2"
    local feature_name="$3"
    local doc_level="${4:-$DOC_LEVEL}"
    local safe_packet_pointer
    safe_packet_pointer="$(slugify_token "$packet_pointer")"
    [[ -n "$safe_packet_pointer" ]] || safe_packet_pointer="$packet_pointer"
    local today now_iso
    today="$(date -u +"%Y-%m-%d")"
    now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

    local md_file
    for md_file in "$folder_path"/*.md; do
        [[ -f "$md_file" ]] || continue
        PACKET_POINTER="scaffold/$safe_packet_pointer" RAW_PACKET_POINTER="$packet_pointer" FEATURE_NAME="$feature_name" TODAY="$today" NOW_ISO="$now_iso" DOC_LEVEL="$doc_level" perl -0pi -e '
            s/\[NAME\]/$ENV{FEATURE_NAME}/g;
            s/\[YOUR_VALUE_HERE: feature-name\]/$ENV{FEATURE_NAME}/g;
            s/\[YOUR_VALUE_HERE: YYYY-MM-DD\]/$ENV{TODAY}/g;
            s/\[YOUR_VALUE_HERE: [^\]]+\]/$ENV{FEATURE_NAME}/g;
            s/\[###-feature-name\]/$ENV{PACKET_POINTER}/g;
            s/000-feature-name/$ENV{PACKET_POINTER}/g;
            s/packet_pointer: "[^"]+"/packet_pointer: "$ENV{PACKET_POINTER}"/g;
            s/system-spec-kit\/templates\/level_1/$ENV{PACKET_POINTER}/g;
            s/system-spec-kit\/templates\/level_2/$ENV{PACKET_POINTER}/g;
            s/system-spec-kit\/templates\/level_3\+/$ENV{PACKET_POINTER}/g;
            s/system-spec-kit\/templates\/level_3/$ENV{PACKET_POINTER}/g;
            s/\| \*\*Spec Folder\*\* \| scaffold\/([^|]+) \|/| **Spec Folder** | $ENV{RAW_PACKET_POINTER} |/g;
            s/\| \*\*Level\*\* \| \[1\/2\/3\/3\+\] \|/| **Level** | $ENV{DOC_LEVEL} |/g;
            s/\[YYYY-MM-DD\]/$ENV{TODAY}/g;
            s/last_updated_at: "[^"]+"/last_updated_at: "$ENV{NOW_ISO}"/g;
            s/session_id: "template-session"/"session_id: \"scaffold-$ENV{PACKET_POINTER}\""/eg;
        ' "$md_file"
        ensure_template_source_near_top "$md_file"
    done

    if [[ -f "$folder_path/spec.md" ]] && ! grep -q "SCAFFOLD_VALIDATION_COUNTS" "$folder_path/spec.md" 2>/dev/null; then
        cat >> "$folder_path/spec.md" <<'EOF'

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
EOF
    fi

    local doc_level_num="${doc_level/+/}"
    if [[ -f "$folder_path/plan.md" ]] && [[ "$doc_level_num" =~ ^[0-9]+$ ]] && [[ "$doc_level_num" -ge 3 ]] && ! grep -q "SCAFFOLD_AI_PROTOCOL_MARKERS" "$folder_path/plan.md" 2>/dev/null; then
        cat >> "$folder_path/plan.md" <<'EOF'

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
EOF
    fi
}

scaffold_phase_parent_validation_child() {
    local parent_path="$1"
    local feature_name="$2"
    local child_name="001-phase-one"
    local child_path="$parent_path/$child_name"
    local child_contract template_name

    local parent_spec="$parent_path/spec.md"
    if [[ -f "$parent_spec" ]] && ! grep -q '^_memory:' "$parent_spec" 2>/dev/null; then
        local parent_base parent_tmp now_iso
        parent_base="$(basename "$parent_path")"
        now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        parent_tmp="$(mktemp "${parent_spec}.tmp.XXXXXX")"
        awk -v pointer="scaffold/${parent_base}" -v now="$now_iso" '
            BEGIN { fence = 0 }
            $0 == "---" {
                fence++
                if (fence == 2 && !inserted) {
                    print "_memory:"
                    print "  continuity:"
                    print "    packet_pointer: \"" pointer "\""
                    print "    last_updated_at: \"" now "\""
                    print "    last_updated_by: \"scaffold\""
                    print "    recent_action: \"Initialize phase parent\""
                    print "    next_safe_action: \"Replace scaffold content\""
                    print "    blockers: []"
                    print "    key_files: []"
                    print "    session_dedup:"
                    print "      fingerprint: \"sha256:0000000000000000000000000000000000000000000000000000000000000000\""
                    print "      session_id: \"scaffold-" pointer "\""
                    print "      parent_session_id: null"
                    print "    completion_pct: 0"
                    print "    open_questions: []"
                    print "    answered_questions: []"
                    inserted = 1
                }
            }
            { print }
        ' "$parent_spec" > "$parent_tmp"
        mv "$parent_tmp" "$parent_spec"
    fi

    if [[ -f "$parent_spec" ]] && ! grep -q '^## .*REQUIREMENTS' "$parent_spec" 2>/dev/null; then
        cat >> "$parent_spec" <<EOF

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for ${feature_name}.
<!-- /ANCHOR:requirements -->
EOF
    fi

    mkdir -p "$child_path" "$child_path/scratch"
    touch "$child_path/scratch/.gitkeep"

    child_contract="$(resolve_level_contract "1")"
    if ! child_contract_docs="$(level_contract_docs_from_json "$child_contract")"; then
        echo "Error: failed to resolve Level 1 template documents" >&2
        exit 1
    fi
    while IFS= read -r template_name; do
        [[ -z "$template_name" ]] && continue
        if ! copy_template "$template_name" "$child_path" "1" "$TEMPLATES_BASE" >/dev/null; then
            echo "Error: copy_template failed for $template_name (level 1)" >&2
            exit 1
        fi
    done <<< "$child_contract_docs"

    finalize_scaffold_templates "$child_path" "$child_name" "Phase one for $feature_name" "1"
    if [[ -f "$child_path/spec.md" ]] && ! grep -q '\.\./spec\.md' "$child_path/spec.md" 2>/dev/null; then
        printf '\n<!-- Parent Spec: ../spec.md -->\n' >> "$child_path/spec.md"
    fi

    create_graph_metadata_file "$child_path" "Phase one for $feature_name" "planned"

    local desc_script
    desc_script="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
    if [[ -f "$desc_script" ]]; then
        node "$desc_script" "$child_path" "$parent_path" \
            --description "Phase one for $feature_name" --level "1" >/dev/null 2>&1 || true
    fi

    CREATED_FILES+=("$child_name/")
}

# Containment check with path boundary semantics.
is_path_within() {
    local candidate="$1"
    local base="$2"
    [[ "$candidate" == "$base" || "$candidate" == "$base"/* ]]
}

validate_spec_folder_basename() {
    local folder_name="$1"
    if [[ ! "$folder_name" =~ ^[0-9]{3}-[A-Za-z0-9._-]+$ ]]; then
        echo "Error: Spec folder must match NNN-name pattern (got: $folder_name)" >&2
        exit 1
    fi
}

# Resolve and validate a spec folder path against approved roots.
resolve_and_validate_spec_path() {
    local raw_path="$1"
    local label="${2:-spec folder}"
    local skip_basename_validation="${3:-false}"
    local candidate resolved

    if [[ "$raw_path" = /* ]]; then
        candidate="$raw_path"
    else
        candidate="$REPO_ROOT/$raw_path"
    fi

    if [[ ! -d "$candidate" ]]; then
        echo "Error: ${label} does not exist: $raw_path" >&2
        exit 1
    fi

    if ! resolved="$(resolve_existing_dir "$candidate")"; then
        echo "Error: Unable to resolve ${label}: $raw_path" >&2
        exit 1
    fi

    local allowed found=false
    for allowed in "$REPO_ROOT/specs" "$REPO_ROOT/.opencode/specs"; do
        if [[ -d "$allowed" ]]; then
            local allowed_resolved
            if allowed_resolved="$(resolve_existing_dir "$allowed")"; then
                if is_path_within "$resolved" "$allowed_resolved"; then
                    found=true
                    break
                fi
            fi
        fi
    done

    if [[ "$found" != "true" ]]; then
        echo "Error: ${label} must be under specs/ or .opencode/specs/" >&2
        echo "Resolved path: $resolved" >&2
        exit 1
    fi

    if [[ "$skip_basename_validation" != "true" ]]; then
        validate_spec_folder_basename "$(basename "$resolved")"
    fi
    printf '%s\n' "$resolved"
}

reject_explicit_path_outside_repo() {
    local raw_path="$1"
    cat >&2 <<EOF
Error: --path '$raw_path' would write outside the repository.
Use a path relative to the repo root, or an absolute path under /tmp/ for testing.
EOF
    exit 1
}

# Resolve an explicit create target before mkdir. Repo-relative targets must stay
# inside the repository; /tmp is allowed for test fixtures.
resolve_and_validate_create_target() {
    local raw_path="$1"
    local candidate parent resolved_parent resolved_target tmp_resolved

    if [[ "$raw_path" == *"/.."* || "$raw_path" == "../"* || "$raw_path" == ".." || "$raw_path" == *"/../"* ]]; then
        reject_explicit_path_outside_repo "$raw_path"
    fi

    if [[ "$raw_path" = /* ]]; then
        candidate="$raw_path"
    else
        candidate="$REPO_ROOT/$raw_path"
    fi

    parent="$(dirname "$candidate")"
    if [[ ! -d "$parent" ]]; then
        echo "Error: --path parent directory does not exist: $parent" >&2
        exit 1
    fi

    if ! resolved_parent="$(cd "$parent" >/dev/null 2>&1 && pwd -P)"; then
        echo "Error: Unable to resolve --path parent directory: $parent" >&2
        exit 1
    fi
    resolved_target="$resolved_parent/$(basename "$candidate")"

    for tmp_resolved in /tmp "${TMPDIR:-}"; do
        [[ -n "$tmp_resolved" ]] || continue
        if tmp_resolved="$(cd "$tmp_resolved" >/dev/null 2>&1 && pwd -P)" && is_path_within "$resolved_target" "$tmp_resolved"; then
            printf '%s\n' "$resolved_target"
            return 0
        fi
    done

    if ! is_path_within "$resolved_target" "$REPO_ROOT"; then
        reject_explicit_path_outside_repo "$raw_path"
    fi

    printf '%s\n' "$resolved_target"
}

# ───────────────────────────────────────────────────────────────
# 2. REPOSITORY DETECTION


# ───────────────────────────────────────────────────────────────

# Note: SCRIPT_DIR already set above during library sourcing

if git rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    HAS_GIT=true
else
    REPO_ROOT="$(find_repo_root "$SCRIPT_DIR")"
    if [[ -z "$REPO_ROOT" ]]; then
        echo "Error: Could not determine repository root. Please run this script from within the repository." >&2
        exit 1
    fi
    HAS_GIT=false
fi

cd "$REPO_ROOT"

SPECS_DIR="$REPO_ROOT/specs"
mkdir -p "$SPECS_DIR"

# ───────────────────────────────────────────────────────────────
# 3. SUBFOLDER MODE


# ───────────────────────────────────────────────────────────────

if [[ "$SUBFOLDER_MODE" = true ]]; then
    RESOLVED_BASE="$(resolve_and_validate_spec_path "$SUBFOLDER_BASE" "Base folder")"
    
    # Determine topic name
    if [[ -n "$SUBFOLDER_TOPIC" ]]; then
        TOPIC_NAME=$(slugify_token "$SUBFOLDER_TOPIC")
    else
        # Generate from feature description
        TOPIC_NAME=$(slugify_token "$FEATURE_DESCRIPTION")
    fi
    if [[ -z "$TOPIC_NAME" ]]; then
        echo "Error: --topic must contain at least one alphanumeric character after slugification" >&2
        exit 1
    fi

    SUBFOLDER_PATH=$(create_versioned_subfolder "$RESOLVED_BASE" "$TOPIC_NAME")
    SUBFOLDER_NAME=$(basename "$SUBFOLDER_PATH")
    
    # Copy templates based on documentation level from the resolver contract
    TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.opencode/skill/system-spec-kit/templates}"
    LEVEL_CONTRACT="$(resolve_level_contract "$DOC_LEVEL")"
    CREATED_FILES=()

    if ! level_contract_docs="$(level_contract_docs_from_json "$LEVEL_CONTRACT")"; then
        echo "Error: failed to resolve Level $DOC_LEVEL template documents" >&2
        exit 1
    fi
    while IFS= read -r template_name; do
        [[ -z "$template_name" ]] && continue
        if ! created_path=$(copy_template "$template_name" "$SUBFOLDER_PATH" "$DOC_LEVEL" "$TEMPLATES_BASE"); then
            echo "Error: copy_template failed for $template_name (level $DOC_LEVEL)" >&2
            exit 1
        fi
        CREATED_FILES+=("$created_path")
    done <<< "$level_contract_docs"
    finalize_scaffold_templates "$SUBFOLDER_PATH" "$SUBFOLDER_NAME" "$FEATURE_DESCRIPTION"

    if $JSON_MODE; then
        files_json=""
        for created_file in "${CREATED_FILES[@]}"; do
            [[ -n "$files_json" ]] && files_json="${files_json},"
            files_json="${files_json}\"$(_json_escape "$created_file")\""
        done
        # P1-03 FIX: Escape JSON values to prevent injection
        printf '{"SUBFOLDER_PATH":"%s","SUBFOLDER_NAME":"%s","BASE_FOLDER":"%s","DOC_LEVEL":"%s","CREATED_FILES":[%s]}\n' \
            "$(_json_escape "$SUBFOLDER_PATH")" "$(_json_escape "$SUBFOLDER_NAME")" "$(_json_escape "$RESOLVED_BASE")" "$DOC_LEVEL" "$files_json"
    else
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
        echo "  SpecKit: Versioned Sub-folder Created Successfully"
        echo "───────────────────────────────────────────────────────────────────"
        echo ""
        echo "  BASE_FOLDER:    $(basename "$RESOLVED_BASE")/"
        echo "  SUBFOLDER:      $SUBFOLDER_NAME/"
        echo "  DOC_LEVEL:      Level $DOC_LEVEL"
        echo "  FULL_PATH:      $SUBFOLDER_PATH"
        echo ""
        echo "  Created Structure:"
        echo "  └── $(basename "$RESOLVED_BASE")/"
        echo "      └── $SUBFOLDER_NAME/"
        for file in "${CREATED_FILES[@]}"; do
            echo "          ├── $file"
        done
        echo "          └── scratch/          (git-ignored working files)"
        echo "              └── .gitkeep"
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
    fi

    # Full post-create validation is opt-in; it is too expensive for default scaffolds.
    if [[ "${SPECKIT_POST_VALIDATE:-}" == "1" ]]; then
        if ! bash "$SCRIPT_DIR/validate.sh" "$SUBFOLDER_PATH" --quiet; then
            echo "Error: post-create validation failed for $SUBFOLDER_PATH" >&2
            exit 1
        fi
    fi

    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 3b. SHARED: Branch Name Generation & Git Branch Creation
# ───────────────────────────────────────────────────────────────
# Extracted to avoid duplication between phase mode and normal mode.
# Sets: BRANCH_SUFFIX, BRANCH_NUMBER, FEATURE_NUM, BRANCH_NAME
# Creates git branch unless SKIP_BRANCH=true or no git.

resolve_branch_name() {
    if [[ -n "$SHORT_NAME" ]]; then
        BRANCH_SUFFIX=$(slugify_token "$SHORT_NAME")
    else
        BRANCH_SUFFIX=$(generate_branch_name "$FEATURE_DESCRIPTION")
    fi

    if [[ -z "$BRANCH_NUMBER" ]]; then
        if [[ "$HAS_GIT" = true ]]; then
            BRANCH_NUMBER=$(check_existing_branches "$BRANCH_SUFFIX")
        else
            local highest=0
            if [[ -d "$SPECS_DIR" ]]; then
                for dir in "$SPECS_DIR"/*; do
                    [[ -d "$dir" ]] || continue
                    local dirname
                    dirname=$(basename "$dir")
                    local number
                    number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
                    number=$((10#$number))
                    if [[ "$number" -gt "$highest" ]]; then highest=$number; fi
                done
            fi
            BRANCH_NUMBER=$((highest + 1))
        fi
    fi

    FEATURE_NUM=$(printf "%03d" "$((10#$BRANCH_NUMBER))")
    BRANCH_NAME="${FEATURE_NUM}-${BRANCH_SUFFIX}"

    # GitHub enforces 244-byte branch name limit
    local max_branch_length=244
    if [[ ${#BRANCH_NAME} -gt $max_branch_length ]]; then
        local max_suffix_length=$((max_branch_length - 4))
        local truncated_suffix
        truncated_suffix=$(echo "$BRANCH_SUFFIX" | cut -c1-$max_suffix_length | sed 's/-$//')
        >&2 echo "[speckit] Warning: Branch name exceeded GitHub's 244-byte limit"
        >&2 echo "[speckit] Original: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
        BRANCH_NAME="${FEATURE_NUM}-${truncated_suffix}"
        >&2 echo "[speckit] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
    fi
}

create_git_branch() {
    if [[ "$SKIP_BRANCH" = true ]]; then
        >&2 echo "[speckit] Skipping branch creation (--skip-branch)"
    elif [[ "$HAS_GIT" = true ]]; then
        if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" 2>/dev/null; then
            >&2 echo "[speckit] Warning: Branch '$BRANCH_NAME' already exists, switching to it"
            git checkout "$BRANCH_NAME"
        else
            git checkout -b "$BRANCH_NAME"
        fi
    else
        >&2 echo "[speckit] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
    fi
}

# ───────────────────────────────────────────────────────────────
# 3c. PHASE MODE
# ───────────────────────────────────────────────────────────────

if [[ "$PHASE_MODE" = true ]]; then
    # Phase mode creates: parent spec folder + N child phase folders
    # Parent gets the lean phase-parent trio
    # Each child gets level 1 templates + parent back-reference injection

    TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.opencode/skill/system-spec-kit/templates}"
    readonly LEAN_PHASE_PARENT_TEMPLATE="$TEMPLATES_BASE/manifest/phase-parent.spec.md.tmpl"
    readonly INLINE_GATE_RENDERER="$REPO_ROOT/.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh"

    # Trap for temp file cleanup on error exit
    PHASE_TMP_FILES=()
    PHASE_LOCK_DIR=""
    _phase_cleanup() {
        for _f in "${PHASE_TMP_FILES[@]-}"; do rm -f "$_f"; done
        if [[ -n "$PHASE_LOCK_DIR" && -d "$PHASE_LOCK_DIR" ]]; then
            rm -rf "$PHASE_LOCK_DIR"
        fi
    }
    trap _phase_cleanup EXIT

    acquire_phase_scaffold_lock() {
        local parent_dir="$1"
        local attempts=0
        PHASE_LOCK_DIR="$parent_dir/.speckit-scaffold.lock"
        while ! mkdir "$PHASE_LOCK_DIR" 2>/dev/null; do
            attempts=$((attempts + 1))
            if [[ $attempts -ge 300 ]]; then
                echo "Error: timed out waiting for phase scaffold lock: $PHASE_LOCK_DIR" >&2
                exit 1
            fi
            sleep 0.1
        done
        printf '%s\n' "$$" > "$PHASE_LOCK_DIR/pid"
    }

    if [[ ! -f "$LEAN_PHASE_PARENT_TEMPLATE" ]]; then
        echo "Error: Lean phase parent template not found at $LEAN_PHASE_PARENT_TEMPLATE" >&2
        exit 1
    fi

    # ── Parse PHASE_NAMES into array ──
    PHASE_NAME_ARRAY=()
    if [[ -n "$PHASE_NAMES" ]]; then
        IFS=',' read -ra _raw_names <<< "$PHASE_NAMES"
        for _name in "${_raw_names[@]}"; do
            # Trim whitespace and slugify
            _trimmed=$(echo "$_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            _slugified=$(slugify_token "$_trimmed")
            if [[ -z "$_slugified" ]]; then
                echo "Error: --phase-names entries must include alphanumeric text (invalid entry: '$_name')" >&2
                exit 1
            fi
            PHASE_NAME_ARRAY+=("$_slugified")
        done
        # If --phase-names provided, override PHASE_COUNT with actual count
        if [[ "$PHASE_COUNT_EXPLICIT" = true ]] && [[ "$PHASE_COUNT" -ne ${#PHASE_NAME_ARRAY[@]} ]]; then
            >&2 echo "[speckit] Warning: --phases $PHASE_COUNT overridden by --phase-names (${#PHASE_NAME_ARRAY[@]} names provided)"
        fi
        PHASE_COUNT=${#PHASE_NAME_ARRAY[@]}
    fi

    PHASE_PARENT_RESOLVED=""
    APPEND_TO_EXISTING_PARENT=false
    EXISTING_PHASE_COUNT=0
    LAST_EXISTING_PHASE=""
    PARENT_CREATED_FILES=()

    # Optional append mode: add phases to an existing parent folder.
    if [[ -n "$PHASE_PARENT" ]]; then
        PHASE_PARENT_RESOLVED="$(resolve_and_validate_spec_path "$PHASE_PARENT" "--parent folder" "true")"

        if [[ ! -f "$PHASE_PARENT_RESOLVED/spec.md" ]]; then
            echo "Error: --parent folder must contain spec.md: $PHASE_PARENT" >&2
            exit 1
        fi

        APPEND_TO_EXISTING_PARENT=true
        FEATURE_DIR="$PHASE_PARENT_RESOLVED"
        BRANCH_NAME="$(basename "$FEATURE_DIR")"
        FEATURE_NUM="${BRANCH_NAME%%-*}"
        if [[ -z "$FEATURE_NUM" ]] || [[ ! "$FEATURE_NUM" =~ ^[0-9]+$ ]]; then
            FEATURE_NUM="000"
        fi

        create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
    else
        if [[ -n "$EXPLICIT_PATH" ]]; then
            FEATURE_DIR="$(resolve_and_validate_create_target "$EXPLICIT_PATH")"
            BRANCH_NAME="$(basename "$FEATURE_DIR")"
            FEATURE_NUM="${BRANCH_NAME%%-*}"
            if [[ -z "$FEATURE_NUM" ]] || [[ ! "$FEATURE_NUM" =~ ^[0-9]+$ ]]; then
                FEATURE_NUM="000"
            fi
        else
            # ── Branch name generation (shared function) ──
            resolve_branch_name
            create_git_branch
            FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
        fi

        # ── Create parent spec folder ──
        mkdir -p "$FEATURE_DIR"
    fi

    acquire_phase_scaffold_lock "$FEATURE_DIR"

    # ── Build child folder name list ──
    PHASE_START_INDEX=1
    if [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
        for dir in "$FEATURE_DIR"/[0-9][0-9][0-9]-*/; do
            if [[ -d "$dir" ]]; then
                _dirname="${dir%/}"
                _dirname="${_dirname##*/}"
                _num="${_dirname%%-*}"
                _num=$((10#${_num}))
                if [[ $_num -gt $EXISTING_PHASE_COUNT ]]; then
                    EXISTING_PHASE_COUNT=$_num
                    LAST_EXISTING_PHASE="$_dirname"
                fi
            fi
        done
        PHASE_START_INDEX=$((EXISTING_PHASE_COUNT + 1))
    fi

    TOTAL_PHASES=$((EXISTING_PHASE_COUNT + PHASE_COUNT))

    CHILD_FOLDERS=()
    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _phase_number=$((PHASE_START_INDEX + _i - 1))
        _child_num=$(printf "%03d" "$_phase_number")
        if [[ ${#PHASE_NAME_ARRAY[@]} -ge $_i ]]; then
            _child_slug="${PHASE_NAME_ARRAY[$((_i - 1))]}"
        else
            _child_slug="phase-${_phase_number}"
        fi
        CHILD_FOLDERS+=("${_child_num}-${_child_slug}")
    done

    # ── Build Phase Documentation Map rows for this invocation ──
    PARENT_SPEC="$FEATURE_DIR/spec.md"
    PHASE_ROWS=""
    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _folder="${CHILD_FOLDERS[$((_i - 1))]}"
        _phase_number=$((PHASE_START_INDEX + _i - 1))
        if [[ -n "$PHASE_ROWS" ]]; then
            PHASE_ROWS="${PHASE_ROWS}"$'\n'
        fi
        PHASE_ROWS="${PHASE_ROWS}| ${_phase_number} | ${_folder}/ | [Phase ${_phase_number} scope] | Pending |"
    done

    HANDOFF_ROWS=""
    if [[ -n "$LAST_EXISTING_PHASE" ]]; then
        _first_new="${CHILD_FOLDERS[0]}"
        HANDOFF_ROWS="| ${LAST_EXISTING_PHASE} | ${_first_new} | [Criteria TBD] | [Verification TBD] |"
    fi
    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        if [[ $_i -lt $PHASE_COUNT ]]; then
            _from="${CHILD_FOLDERS[$((_i - 1))]}"
            _to="${CHILD_FOLDERS[$_i]}"
            if [[ -n "$HANDOFF_ROWS" ]]; then
                HANDOFF_ROWS="${HANDOFF_ROWS}"$'\n'
            fi
            HANDOFF_ROWS="${HANDOFF_ROWS}| ${_from} | ${_to} | [Criteria TBD] | [Verification TBD] |"
        fi
    done

    if [[ "$APPEND_TO_EXISTING_PARENT" != true ]]; then
        _tmp_parent_spec=$(mktemp)
        PHASE_TMP_FILES+=("$_tmp_parent_spec")
        _tmp_parent_template=$(mktemp)
        PHASE_TMP_FILES+=("$_tmp_parent_template")
        "$INLINE_GATE_RENDERER" --level phase "$LEAN_PHASE_PARENT_TEMPLATE" > "$_tmp_parent_template"
        _feature_slug="$(basename "$FEATURE_DIR")"
        _phase_parent_packet_pointer="scaffold/$(slugify_token "$_feature_slug")"
        _today="$(date -u +"%Y-%m-%d")"
        _phase_parent_problem="This phased decomposition tracks ${FEATURE_DESCRIPTION} across independently executable child phase folders."
        _phase_parent_purpose="Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity."
        _scope_rows="- Root purpose and child phase manifest for ${FEATURE_DESCRIPTION}"$'\n'"- Per-phase implementation details in child folders"
        _file_row="| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |"

        while IFS= read -r _line; do
            case "$_line" in
                *"[YOUR_VALUE_HERE: PHASE_ROW]"*)
                    printf '%s\n' "$PHASE_ROWS"
                    ;;
                *"[YOUR_VALUE_HERE: HANDOFF_ROW]"*)
                    if [[ -n "$HANDOFF_ROWS" ]]; then
                        printf '%s\n' "$HANDOFF_ROWS"
                    else
                        printf '%s\n' "| (single phase - no handoffs) | | | |"
                    fi
                    ;;
                *)
                    _line="${_line//\[YOUR_VALUE_HERE: feature-name\]/$FEATURE_DESCRIPTION}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-line description\]/Phase parent for ${FEATURE_DESCRIPTION}}"
                    _line="${_line//\[YOUR_VALUE_HERE: trigger phrase 1\]/$_feature_slug}"
                    _line="${_line//\[YOUR_VALUE_HERE: trigger phrase 2\]/phase parent}"
                    _line="${_line//\[YOUR_VALUE_HERE: YYYY-MM-DD\]/$_today}"
                    _line="${_line//\[YOUR_VALUE_HERE: packet-id\]/$_phase_parent_packet_pointer}"
                    _line="${_line//\[YOUR_VALUE_HERE: predecessor-packet\]/None}"
                    _line="${_line//\[YOUR_VALUE_HERE: successor-packet, or \"None\"\]/None}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-paragraph problem statement — what needs solving and why\]/$_phase_parent_problem}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-paragraph purpose — what this phased decomposition achieves\]/$_phase_parent_purpose}"
                    if [[ "$_line" == *"[YOUR_VALUE_HERE: bullet list of what this phase decomposition covers]"* ]]; then
                        printf '%s\n' "$_scope_rows"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: bullet list of what is explicitly excluded]"* ]]; then
                        printf '%s\n' "- Detailed per-phase implementation plans at the parent level"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: summary table of files touched across all phases"* ]]; then
                        printf '%s\n' "Summary of aggregate file scope. Per-phase detail lives in child plans."
                    elif [[ "$_line" == *"| [YOUR_VALUE_HERE: path] |"* ]]; then
                        printf '%s\n' "$_file_row"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: open question 1]"* ]]; then
                        printf '%s\n' "- Which child phase should execute first?"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: open question 2]"* ]]; then
                        printf '%s\n' "- What handoff criteria must each child satisfy?"
                    else
                        printf '%s\n' "$_line"
                    fi
                    ;;
            esac
        done < "$_tmp_parent_template" > "$_tmp_parent_spec"

        mv "$_tmp_parent_spec" "$PARENT_SPEC"
        ensure_template_source_near_top "$PARENT_SPEC"
        PARENT_CREATED_FILES+=("spec.md")
        create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
    fi

    # ── Append Phase Documentation Map into existing parent spec.md ──
    if [[ -f "$PARENT_SPEC" ]]; then
        PHASE_MAP_EXISTS=false
        if grep -q "<!-- ANCHOR:phase-map -->" "$PARENT_SPEC"; then
            PHASE_MAP_EXISTS=true
        fi

        if [[ "$APPEND_TO_EXISTING_PARENT" = true ]] && [[ "$PHASE_MAP_EXISTS" = true ]]; then
            >&2 echo "[speckit] Existing PHASE DOCUMENTATION MAP found; appending new phase rows and handoffs"
            _tmp_parent_spec=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_parent_spec")
            _tmp_phase_rows=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_phase_rows")
            _tmp_handoff_rows=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_handoff_rows")
            printf '%s\n' "$PHASE_ROWS" > "$_tmp_phase_rows"
            printf '%s\n' "$HANDOFF_ROWS" > "$_tmp_handoff_rows"

            _handoff_has_rows=false
            [[ -n "$HANDOFF_ROWS" ]] && _handoff_has_rows=true

            awk -v phase_rows_file="$_tmp_phase_rows" -v handoff_rows_file="$_tmp_handoff_rows" -v handoff_has_rows="$_handoff_has_rows" '
                function print_rows(path, row) {
                    while ((getline row < path) > 0) {
                        print row;
                    }
                    close(path);
                }
                BEGIN {
                    in_phase=0;
                    in_handoff=0;
                    inserted_phase=0;
                    inserted_handoff=0;
                }
                /<!-- ANCHOR:phase-map -->/ {
                    in_phase=1;
                }
                in_phase && /^### Phase Transition Rules/ && !inserted_phase {
                    print_rows(phase_rows_file);
                    inserted_phase=1;
                }
                in_phase && /^### Phase Handoff Criteria/ {
                    in_handoff=1;
                }
                in_phase && in_handoff && handoff_has_rows == "true" && $0 ~ /^\| \(single phase - no handoffs\) \| \| \| \|$/ {
                    next;
                }
                in_phase && /<!-- \/ANCHOR:phase-map -->/ && !inserted_handoff {
                    if (handoff_has_rows == "true") {
                        print_rows(handoff_rows_file);
                    }
                    inserted_handoff=1;
                    in_phase=0;
                    in_handoff=0;
                }
                { print }
            ' "$PARENT_SPEC" > "$_tmp_parent_spec"

            mv "$_tmp_parent_spec" "$PARENT_SPEC"
        elif [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
            _tmp_phase_section=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_phase_section")

            {
                cat <<'EOF'
<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
EOF
                printf '%s\n' "$PHASE_ROWS"
                cat <<'EOF'

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
EOF
                if [[ -n "$HANDOFF_ROWS" ]]; then
                    printf '%s\n' "$HANDOFF_ROWS"
                else
                    printf '%s\n' "| (single phase - no handoffs) | | | |"
                fi
                printf '%s\n' "<!-- /ANCHOR:phase-map -->"
            } > "$_tmp_phase_section"

            # Append phase section to parent spec.md
            printf '\n' >> "$PARENT_SPEC"
            cat "$_tmp_phase_section" >> "$PARENT_SPEC"
            rm -f "$_tmp_phase_section"
        fi
    fi

    # ── Generate description.json for parent ──
    # NOTE: Description generation is manually tested. Automated coverage tracked as known gap (F10).
    # Key invariants: parent and child both use $(dirname FEATURE_DIR) as base. Failure is non-fatal.
    _DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
    if [[ -f "$_DESC_SCRIPT" ]]; then
      if node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" \
        --description "$FEATURE_DESCRIPTION" --level "phase"; then
        CREATED_FILES+=("description.json")
      else
        echo "  Warning: description.json generation skipped" >&2
      fi
    fi

    # ── Create child phase folders ──
    CHILD_LEVEL_CONTRACT="$(resolve_level_contract "1")"
    CHILDREN_INFO=()   # For JSON output

    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _child_folder="${CHILD_FOLDERS[$((_i - 1))]}"
        _child_path="$FEATURE_DIR/$_child_folder"
        _child_created_files=()

        # Create child directory structure
        mkdir -p "$_child_path" "$_child_path/scratch"
        touch "$_child_path/scratch/.gitkeep"
        create_graph_metadata_file "$_child_path" "Phase ${_i}: ${_child_folder#*-}" "planned"

        # Copy Level 1 templates to child folder
        if ! child_level_contract_docs="$(level_contract_docs_from_json "$CHILD_LEVEL_CONTRACT")"; then
            echo "Error: failed to resolve Level 1 template documents" >&2
            exit 1
        fi
        while IFS= read -r template_name; do
            [[ -z "$template_name" ]] && continue
            if ! created_path=$(copy_template "$template_name" "$_child_path" "1" "$TEMPLATES_BASE"); then
                echo "Error: copy_template failed for $template_name (level 1)" >&2
                exit 1
            fi
            _child_created_files+=("$created_path")
        done <<< "$child_level_contract_docs"

        # Generate description.json for child phase
        if [[ -f "$_DESC_SCRIPT" ]]; then
          _phase_name="${_child_folder#*-}"  # strip numeric prefix
          # Use parent of FEATURE_DIR as base so parentChain includes the parent folder
          if node "$_DESC_SCRIPT" "$_child_path" "$(dirname "$FEATURE_DIR")" \
            --description "Phase ${_i}: ${_phase_name}" --level "1"; then
            _child_created_files+=("description.json")
          else
            echo "  Warning: description.json generation skipped for phase ${_i}" >&2
          fi
        fi

        # Inject parent back-reference into child spec.md
        _child_spec="$_child_path/spec.md"
        if [[ -f "$_child_spec" ]]; then
            finalize_scaffold_templates "$_child_path" "$_child_folder" "Phase ${_i}: ${_child_folder#*-}"

            # Determine predecessor and successor
            if [[ $_i -eq 1 ]]; then
                if [[ -n "$LAST_EXISTING_PHASE" ]]; then
                    _predecessor="$LAST_EXISTING_PHASE"
                else
                    _predecessor="None"
                fi
            else
                _predecessor="${CHILD_FOLDERS[$((_i - 2))]}"
            fi
            if [[ $_i -eq $PHASE_COUNT ]]; then
                _successor="None"
            else
                _successor="${CHILD_FOLDERS[$_i]}"
            fi

            _phase_number=$((PHASE_START_INDEX + _i - 1))
            _phase_name="${_child_folder#*-}"
            _child_metadata_rows="| **Parent Spec** | ../spec.md |
| **Phase** | ${_phase_number} of ${TOTAL_PHASES} |
| **Predecessor** | ${_predecessor} |
| **Successor** | ${_successor} |
| **Handoff Criteria** | [To be defined during planning] |"
            _child_phase_context="<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase ${_phase_number}** of the ${FEATURE_DESCRIPTION} specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->"

            PHASE_CHILD_ROWS="$_child_metadata_rows" PHASE_CHILD_CONTEXT="$_child_phase_context" perl -0pi -e '
                if (index($_, "<!-- ANCHOR:phase-context -->") == -1) {
                    s/(<!-- \/ANCHOR:metadata -->)/$ENV{PHASE_CHILD_ROWS} . "\n" . $1 . "\n\n---\n\n" . $ENV{PHASE_CHILD_CONTEXT}/e;
                }
            ' "$_child_spec"
        fi

        # Collect child info for output
        _child_files_str=$(printf '%s,' "${_child_created_files[@]}" | sed 's/,$//')
        CHILDREN_INFO+=("${_child_folder}|${_child_files_str}")
    done

    # ── Output ──
    SPEC_FILE="$FEATURE_DIR/spec.md"
    export SPECIFY_FEATURE="$BRANCH_NAME"

    if $JSON_MODE; then
        # Build children JSON array
        children_json=""
        for _info in "${CHILDREN_INFO[@]}"; do
            _folder="${_info%%|*}"
            _files="${_info#*|}"
            # Build files array
            _files_json=""
            IFS=',' read -ra _file_arr <<< "$_files"
            for _f in "${_file_arr[@]}"; do
                [[ -z "$_f" ]] && continue
                if [[ -n "$_files_json" ]]; then _files_json="${_files_json},"; fi
                _files_json="${_files_json}\"$(_json_escape "$_f")\""
            done
            if [[ -n "$children_json" ]]; then children_json="${children_json},"; fi
            children_json="${children_json}{\"FOLDER\":\"$(_json_escape "$_folder")\",\"FILES\":[${_files_json}]}"
        done

        # Build parent files JSON
        parent_files_json=""
        for _pf in "${PARENT_CREATED_FILES[@]-}"; do
            [[ -n "$parent_files_json" ]] && parent_files_json="${parent_files_json},"
            parent_files_json="${parent_files_json}\"$(_json_escape "$_pf")\""
        done

        printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s","PHASE_MODE":true,"PHASE_COUNT":%d,"PARENT_FILES":[%s],"CHILDREN":[%s]}\n' \
            "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$PHASE_COUNT" "$parent_files_json" "$children_json"
    else
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
        echo "  SpecKit: Phase Spec Created Successfully"
        echo "───────────────────────────────────────────────────────────────────"
        echo ""
        echo "  BRANCH_NAME:  $BRANCH_NAME"
        echo "  FEATURE_NUM:  $FEATURE_NUM"
        echo "  DOC_LEVEL:    Level $DOC_LEVEL (parent)"
        echo "  PHASE_COUNT:  $PHASE_COUNT (new, $TOTAL_PHASES total)"
        echo "  SPEC_FOLDER:  $FEATURE_DIR"
        if [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
            echo "  MODE:         Append phases to existing parent"
        fi
        echo ""
        echo "  Created Structure:"
        echo "  └── $BRANCH_NAME/"
        for file in "${PARENT_CREATED_FILES[@]-}"; do
            echo "      ├── $file"
        done
        for (( _ci=1; _ci<=PHASE_COUNT; _ci++ )); do
            _cf="${CHILD_FOLDERS[$((_ci - 1))]}"
            _info="${CHILDREN_INFO[$((_ci - 1))]}"
            _files="${_info#*|}"
            echo "      ├── $_cf/"
            IFS=',' read -ra _file_arr <<< "$_files"
            for _f in "${_file_arr[@]}"; do
                [[ -z "$_f" ]] && continue
                echo "      │   ├── $_f"
            done
            echo "      │   └── scratch/"
            echo "      │       └── .gitkeep"
        done
        echo "      └── scratch/          (git-ignored working files)"
        echo "          └── .gitkeep"
        echo ""
        echo "  Phase Documentation Map injected into parent spec.md"
        echo "  Parent back-references injected into each child spec.md"
        echo ""
        echo "  Next steps:"
        echo "    1. Define phase scopes in parent spec.md Phase Documentation Map"
        echo "    2. Fill out each child spec.md with phase-specific requirements"
        echo "    3. Use /spec_kit:plan on each phase folder for detailed planning"
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
    fi

    # Full post-create validation is opt-in; it is too expensive for default scaffolds.
    if [[ "${SPECKIT_POST_VALIDATE:-}" == "1" ]]; then
        if ! bash "$SCRIPT_DIR/validate.sh" "$FEATURE_DIR" --quiet; then
            echo "Error: post-create validation failed for $FEATURE_DIR" >&2
            exit 1
        fi
    fi

    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 4. BRANCH NAME GENERATION (shared function)
# ───────────────────────────────────────────────────────────────

if [[ -n "$EXPLICIT_PATH" ]]; then
    FEATURE_DIR="$(resolve_and_validate_create_target "$EXPLICIT_PATH")"
    BRANCH_NAME="$(basename "$FEATURE_DIR")"
    FEATURE_NUM="${BRANCH_NAME%%-*}"
    if [[ -z "$FEATURE_NUM" ]] || [[ ! "$FEATURE_NUM" =~ ^[0-9]+$ ]]; then
        FEATURE_NUM="000"
    fi
else
    resolve_branch_name
    create_git_branch
fi

# ───────────────────────────────────────────────────────────────
# 5. CREATE SPEC FOLDER STRUCTURE


# ───────────────────────────────────────────────────────────────

if [[ -z "$EXPLICIT_PATH" ]]; then
    FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
fi

TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.opencode/skill/system-spec-kit/templates}"

LEVEL_CONTRACT="$(resolve_level_contract "$DOC_LEVEL")"
CREATED_FILES=()

# Validate templates directory exists
if [[ ! -d "$TEMPLATES_BASE" ]]; then
    echo "Error: Templates directory not found at $TEMPLATES_BASE" >&2
    exit 1
fi

mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"
touch "$FEATURE_DIR/scratch/.gitkeep"

# ───────────────────────────────────────────────────────────────
# 6. COPY TEMPLATES BASED ON DOCUMENTATION LEVEL


# ───────────────────────────────────────────────────────────────

# Copy all templates from the resolver contract (using library copy_template)
if ! level_contract_docs="$(level_contract_docs_from_json "$LEVEL_CONTRACT")"; then
    echo "Error: failed to resolve Level $DOC_LEVEL template documents" >&2
    exit 1
fi
batch_created_files="$(copy_templates_batch "$level_contract_docs" "$FEATURE_DIR" "$DOC_LEVEL" "$TEMPLATES_BASE")" || {
    echo "Error: batch template render failed for Level $DOC_LEVEL" >&2
    exit 3
}
while IFS= read -r created_path; do
    [[ -z "$created_path" ]] && continue
    CREATED_FILES+=("$created_path")
done <<< "$batch_created_files"
finalize_scaffold_templates "$FEATURE_DIR" "$BRANCH_NAME" "$FEATURE_DESCRIPTION"

create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"

# ───────────────────────────────────────────────────────────────
# 6.5. GENERATE PER-FOLDER description.json
# ───────────────────────────────────────────────────────────────

_DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
if [[ -f "$_DESC_SCRIPT" ]]; then
  if node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" \
    --description "$FEATURE_DESCRIPTION" --level "$DOC_LEVEL"; then
    CREATED_FILES+=("description.json")
  else
    echo "  Warning: description.json generation skipped" >&2
  fi
fi

if [[ "$DOC_LEVEL" == "phase" ]]; then
    scaffold_phase_parent_validation_child "$FEATURE_DIR" "$FEATURE_DESCRIPTION"
fi

# ───────────────────────────────────────────────────────────────
# 7. SHARDED SPEC SECTIONS (Level 3 with --sharded flag)
# ───────────────────────────────────────────────────────────────

if [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -ge 3 ]]; then
    # Create spec-sections directory
    mkdir -p "$FEATURE_DIR/spec-sections"
    CREATED_FILES+=("spec-sections/")

    # Resolve sharded templates directory
    SHARDED_TEMPLATES_DIR="$TEMPLATES_BASE/sharded"

    # Copy sharded index template (overwrites the standard spec.md)
    if [[ -f "$SHARDED_TEMPLATES_DIR/spec-index.md" ]]; then
        cp "$SHARDED_TEMPLATES_DIR/spec-index.md" "$FEATURE_DIR/spec.md"
    else
        >&2 echo "[speckit] Warning: Sharded template not found: $SHARDED_TEMPLATES_DIR/spec-index.md"
    fi

    # Copy section templates
    for shard in 01-overview.md 02-requirements.md 03-architecture.md 04-testing.md; do
        if [[ -f "$SHARDED_TEMPLATES_DIR/$shard" ]]; then
            cp "$SHARDED_TEMPLATES_DIR/$shard" "$FEATURE_DIR/spec-sections/$shard"
            CREATED_FILES+=("spec-sections/$shard")
        else
            >&2 echo "[speckit] Warning: Sharded template not found: $SHARDED_TEMPLATES_DIR/$shard"
            touch "$FEATURE_DIR/spec-sections/$shard"
            CREATED_FILES+=("spec-sections/$shard (empty - template not found)")
        fi
    done

elif [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -lt 3 ]]; then
    echo "Warning: --sharded flag is only supported with --level 3 or 3+. Ignoring --sharded." >&2
fi

# Set paths for output
SPEC_FILE="$FEATURE_DIR/spec.md"

# Set the SPECIFY_FEATURE environment variable for the current session
export SPECIFY_FEATURE="$BRANCH_NAME"

# ───────────────────────────────────────────────────────────────
# 10. OUTPUT


# ───────────────────────────────────────────────────────────────

if $JSON_MODE; then
    # Build JSON array of created files
    files_json=""
    for created_file in "${CREATED_FILES[@]}"; do
        [[ -n "$files_json" ]] && files_json="${files_json},"
        files_json="${files_json}\"$(_json_escape "$created_file")\""
    done

    # Build complexity info if available
    if [[ -n "$DETECTED_LEVEL" ]]; then
        complexity_json=",\"COMPLEXITY\":{\"detected\":true,\"level\":\"$DETECTED_LEVEL\",\"score\":$DETECTED_SCORE,\"confidence\":$DETECTED_CONF}"
    else
        complexity_json=",\"COMPLEXITY\":{\"detected\":false}"
    fi

    # Build expansion info
    if [[ "$EXPAND_TEMPLATES" = true ]]; then
        expansion_json=",\"EXPANDED\":true"
    else
        expansion_json=",\"EXPANDED\":false"
    fi

    # Build description info
    if [[ -f "$FEATURE_DIR/description.json" ]]; then
        description_json=",\"HAS_DESCRIPTION\":true"
    else
        description_json=",\"HAS_DESCRIPTION\":false"
    fi

    # P1-03 FIX: Escape JSON values to prevent injection
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s","SHARDED":%s%s%s%s,"CREATED_FILES":[%s]}\n' \
        "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$SHARDED" "$complexity_json" "$expansion_json" "$description_json" "$files_json"
else
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
    echo "  SpecKit: Spec Folder Created Successfully"
    echo "───────────────────────────────────────────────────────────────────"
    echo ""
    echo "  BRANCH_NAME:  $BRANCH_NAME"
    echo "  FEATURE_NUM:  $FEATURE_NUM"
    echo "  DOC_LEVEL:    Level $DOC_LEVEL"
    if [[ -n "$DETECTED_LEVEL" ]]; then
        echo "  COMPLEXITY:   Level $DETECTED_LEVEL (score: $DETECTED_SCORE/100, confidence: $DETECTED_CONF%)"
    fi
    if [[ "$EXPAND_TEMPLATES" = true ]]; then
        echo "  EXPANDED:     Yes (COMPLEXITY_GATE markers processed)"
    fi
    echo "  SPEC_FOLDER:  $FEATURE_DIR"
    echo ""
    echo "  Created Structure:"
    echo "  └── $BRANCH_NAME/"
    for file in "${CREATED_FILES[@]}"; do
        echo "      ├── $file"
    done
    echo "      ├── description.json   (per-folder identity)"
    echo "      └── scratch/          (git-ignored working files)"
    echo "          └── .gitkeep"
    echo ""
    echo "  Level $DOC_LEVEL Documentation (manifest-backed Level contract):"
    case $DOC_LEVEL in
        1) echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
           echo "      (Essential what/why/how - ~270 LOC)" ;;
        2) echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
           echo "    ✓ +Verify: checklist.md, NFRs, edge cases, effort estimation"
           echo "      (Quality gates - adds ~120 LOC)" ;;
        3|"3+") echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
           echo "    ✓ +Verify: checklist.md, NFRs, edge cases"
           echo "    ✓ +Arch: decision-record.md, executive summary, risk matrix"
           if [[ "$DOC_LEVEL" = "3+" ]]; then
               echo "    ✓ +Govern: approval workflow, compliance, AI protocols"
               echo "      (Full governance - adds ~100 LOC)"
           else
               echo "      (Architecture decisions - adds ~150 LOC)"
           fi
           if [[ "$SHARDED" = true ]]; then
               echo "    ✓ Sharded: spec-sections/ (modular documentation)"
           fi ;;
    esac
    echo ""
    echo "  Next steps:"
    echo "    1. Fill out spec.md with requirements"
    echo "    2. Create implementation plan in plan.md"
    echo "    3. Break down tasks in tasks.md"
    DOC_LEVEL_NUM_FOR_OUTPUT="${DOC_LEVEL/+/}"
    if [[ "$DOC_LEVEL_NUM_FOR_OUTPUT" =~ ^[0-9]+$ ]] && [[ "$DOC_LEVEL_NUM_FOR_OUTPUT" -ge 2 ]]; then
        echo "    4. Add verification items to checklist.md"
    fi
    if [[ "$DOC_LEVEL_NUM_FOR_OUTPUT" =~ ^[0-9]+$ ]] && [[ "$DOC_LEVEL_NUM_FOR_OUTPUT" -ge 3 ]]; then
        echo "    5. Document decisions in decision-record.md"
    fi
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
fi

# Full post-create validation is opt-in; it is too expensive for default scaffolds.
if [[ "${SPECKIT_POST_VALIDATE:-}" == "1" ]]; then
    if ! bash "$SCRIPT_DIR/validate.sh" "$FEATURE_DIR" --quiet; then
        echo "Error: post-create validation failed for $FEATURE_DIR" >&2
        exit 1
    fi
fi

# Exit codes:
#   0 - Success
#   1 - --level requires a value (1, 2, or 3)
