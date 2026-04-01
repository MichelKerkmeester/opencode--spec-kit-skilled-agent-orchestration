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
# Also creates scratch/ and memory/ directories.

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
            if [[ ! "$next_arg" =~ ^(1|2|3|3\+)$ ]]; then
                echo 'Error: --level must be 1, 2, 3, or 3+' >&2
                exit 1
            fi
            DOC_LEVEL="$next_arg"
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
            echo "All levels include: scratch/ (git-ignored) + memory/ (context preservation)"
            echo ""
            echo "Examples:"
            echo "  $0 'Add user authentication system' --short-name 'user-auth'"
            echo "  $0 'Implement complex OAuth2 flow' --level 2"
            echo "  $0 'Major architecture redesign' --level 3 --number 50"
            echo "  $0 'Large platform migration' --level 3 --sharded"
            echo ""
            echo "Sub-folder Versioning Examples:"
            echo "  $0 --subfolder specs/005-memory 'Initial implementation'"
            echo "  $0 --subfolder specs/005-memory --topic 'refactor' 'Phase 2 refactoring'"
            echo ""
            echo "  Creates: specs/005-memory/001-initial-implementation/"
            echo "           specs/005-memory/002-refactor/"
            echo ""
            echo "Phase Mode Examples:"
            echo "  $0 --phase 'Large platform migration'"
            echo "  $0 --phase --phases 3 'OAuth2 implementation'"
            echo "  $0 --phase --phases 3 --phase-names 'foundation,implementation,integration' 'OAuth2 flow'"
            echo "  $0 --phase --parent specs/042-oauth2-flow --phases 2 --phase-names 'stabilization,rollout' 'OAuth2 flow'"
            echo '  $0 --phase --phase-parent .opencode/specs/02--system-spec-kit/023-esm/011-fusion --phase-names "research,implementation" "Graph improvements"'
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

FEATURE_DESCRIPTION="${ARGS[*]:-}"
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
    
    # Create sub-folder structure with independent memory/ and scratch/
    mkdir -p "$subfolder_path/memory"
    mkdir -p "$subfolder_path/scratch"
    touch "$subfolder_path/memory/.gitkeep"
    touch "$subfolder_path/scratch/.gitkeep"
    
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
    
    # Copy templates based on documentation level from level-specific folder
    TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
    # Normalize DOC_LEVEL for numeric comparisons (3+ becomes 3)
    DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
    LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
    CREATED_FILES=()

    # Copy all templates from the level folder
    for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
        if [[ -f "$template_file" ]]; then
            template_name=$(basename "$template_file")
            CREATED_FILES+=("$(copy_template "$template_name" "$SUBFOLDER_PATH" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
        fi
    done

    if $JSON_MODE; then
        files_json=$(printf '"%s",' "${CREATED_FILES[@]}" | sed 's/,$//')
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
        echo "          ├── scratch/          (git-ignored working files)"
        echo "          │   └── .gitkeep"
        echo "          └── memory/           (independent context)"
        echo "              └── .gitkeep"
        echo ""
        echo "  Note: Each sub-folder has independent memory/ and scratch/ directories."
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
    fi

    # Post-creation validation: catch template regressions early
    if [[ "${SPECKIT_SKIP_POST_VALIDATE:-}" != "1" ]]; then
        bash "$SCRIPT_DIR/validate.sh" "$SUBFOLDER_PATH" --quiet 2>/dev/null || true
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
    # Parent gets level templates + Phase Documentation Map injection
    # Each child gets level 1 templates + parent back-reference injection

    TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
    readonly PHASE_ADDENDUM_DIR="$TEMPLATES_BASE/addendum/phase"

    # Trap for temp file cleanup on error exit
    PHASE_TMP_FILES=()
    _phase_cleanup() { for _f in "${PHASE_TMP_FILES[@]-}"; do rm -f "$_f"; done; }
    trap _phase_cleanup EXIT

    # Validate addendum templates exist
    if [[ ! -f "$PHASE_ADDENDUM_DIR/phase-parent-section.md" ]]; then
        echo "Error: Phase parent template not found at $PHASE_ADDENDUM_DIR/phase-parent-section.md" >&2
        exit 1
    fi
    if [[ ! -f "$PHASE_ADDENDUM_DIR/phase-child-header.md" ]]; then
        echo "Error: Phase child template not found at $PHASE_ADDENDUM_DIR/phase-child-header.md" >&2
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

        mkdir -p "$FEATURE_DIR/scratch" "$FEATURE_DIR/memory"
        touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"
    else
        # ── Branch name generation (shared function) ──
        resolve_branch_name
        create_git_branch

        # ── Create parent spec folder ──
        FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
        mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch" "$FEATURE_DIR/memory"
        touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"

        # Copy parent templates based on documentation level
        DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
        LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")

        if [[ ! -d "$LEVEL_TEMPLATES_DIR" ]]; then
            >&2 echo "[speckit] Warning: Level folder not found at $LEVEL_TEMPLATES_DIR, using base templates"
            LEVEL_TEMPLATES_DIR="$TEMPLATES_BASE"
        fi

        for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
            if [[ -f "$template_file" ]]; then
                template_name=$(basename "$template_file")
                PARENT_CREATED_FILES+=("$(copy_template "$template_name" "$FEATURE_DIR" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
            fi
        done
    fi

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

    # ── Inject or append Phase Documentation Map into parent spec.md ──
    PARENT_SPEC="$FEATURE_DIR/spec.md"
    if [[ -f "$PARENT_SPEC" ]]; then
        PHASE_MAP_EXISTS=false
        if grep -q "<!-- ANCHOR:phase-map -->" "$PARENT_SPEC"; then
            PHASE_MAP_EXISTS=true
        fi

        # Build phase table rows for this invocation
        PHASE_ROWS=""
        for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
            _folder="${CHILD_FOLDERS[$((_i - 1))]}"
            _phase_number=$((PHASE_START_INDEX + _i - 1))
            if [[ -n "$PHASE_ROWS" ]]; then
                PHASE_ROWS="${PHASE_ROWS}"$'\n'
            fi
            PHASE_ROWS="${PHASE_ROWS}| ${_phase_number} | ${_folder}/ | [Phase ${_phase_number} scope] | [deps] | Pending |"
        done

        # Build handoff criteria rows for this invocation
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
        else
            # Read the parent section template
            PHASE_PARENT_TEMPLATE=$(< "$PHASE_ADDENDUM_DIR/phase-parent-section.md")

            # Replace placeholders in template
            # Use a temp file for sed replacements (avoids in-place issues)
            _tmp_phase_section=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_phase_section")

            # Write the template, replacing [PHASE_ROW] and [HANDOFF_ROW] line placeholders
            while IFS= read -r _line; do
                if [[ "$_line" == *"[YOUR_VALUE_HERE: PHASE_ROW]"* ]]; then
                    printf '%s\n' "$PHASE_ROWS"
                elif [[ "$_line" == *"[YOUR_VALUE_HERE: HANDOFF_ROW]"* ]]; then
                    if [[ -n "$HANDOFF_ROWS" ]]; then
                        printf '%s\n' "$HANDOFF_ROWS"
                    else
                        printf '%s\n' "| (single phase - no handoffs) | | | |"
                    fi
                else
                    printf '%s\n' "$_line"
                fi
            done <<< "$PHASE_PARENT_TEMPLATE" > "$_tmp_phase_section"

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
        --description "$FEATURE_DESCRIPTION"; then
        CREATED_FILES+=("description.json")
      else
        echo "  Warning: description.json generation skipped" >&2
      fi
    fi

    # ── Create child phase folders ──
    CHILD_LEVEL_DIR=$(get_level_templates_dir "1" "$TEMPLATES_BASE")
    CHILDREN_INFO=()   # For JSON output

    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _child_folder="${CHILD_FOLDERS[$((_i - 1))]}"
        _child_path="$FEATURE_DIR/$_child_folder"
        _child_created_files=()

        # Create child directory structure
        mkdir -p "$_child_path" "$_child_path/memory" "$_child_path/scratch"
        touch "$_child_path/memory/.gitkeep" "$_child_path/scratch/.gitkeep"

        # Copy Level 1 templates to child folder
        for template_file in "$CHILD_LEVEL_DIR"/*.md; do
            if [[ -f "$template_file" ]]; then
                template_name=$(basename "$template_file")
                _child_created_files+=("$(copy_template "$template_name" "$_child_path" "$CHILD_LEVEL_DIR" "$TEMPLATES_BASE")")
            fi
        done

        # Generate description.json for child phase
        if [[ -f "$_DESC_SCRIPT" ]]; then
          _phase_name="${_child_folder#*-}"  # strip numeric prefix
          # Use parent of FEATURE_DIR as base so parentChain includes the parent folder
          if node "$_DESC_SCRIPT" "$_child_path" "$(dirname "$FEATURE_DIR")" \
            --description "Phase ${_i}: ${_phase_name}"; then
            _child_created_files+=("description.json")
          else
            echo "  Warning: description.json generation skipped for phase ${_i}" >&2
          fi
        fi

        # Inject parent back-reference into child spec.md
        _child_spec="$_child_path/spec.md"
        if [[ -f "$_child_spec" ]]; then
            # Read child header template
            _child_header_template=$(< "$PHASE_ADDENDUM_DIR/phase-child-header.md")

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

            # Replace placeholders (YOUR_VALUE_HERE format for validation detection)
            _child_header="$_child_header_template"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: PARENT_FOLDER\]/..}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: PHASE_NUMBER\]/$_phase_number}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: TOTAL_PHASES\]/$TOTAL_PHASES}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: PREDECESSOR_FOLDER\]/$_predecessor}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: SUCCESSOR_FOLDER\]/$_successor}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: PARENT_SPEC_NAME\]/$FEATURE_DESCRIPTION}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: phase scope description\]/[To be defined during planning]}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: predecessor dependencies\]/[To be defined during planning]}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: phase deliverables\]/[To be defined during planning]}"
            _child_header="${_child_header//\[YOUR_VALUE_HERE: handoff criteria\]/[To be defined during planning]}"

            # Prepend back-reference block to child spec.md
            _tmp_child_spec=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_child_spec")
            printf '%s\n\n' "$_child_header" > "$_tmp_child_spec"
            cat "$_child_spec" >> "$_tmp_child_spec"
            mv "$_tmp_child_spec" "$_child_spec"
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
            echo "      │   ├── scratch/"
            echo "      │   │   └── .gitkeep"
            echo "      │   └── memory/"
            echo "      │       └── .gitkeep"
        done
        echo "      ├── scratch/          (git-ignored working files)"
        echo "      │   └── .gitkeep"
        echo "      └── memory/           (context preservation)"
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

    # Post-creation validation: catch template regressions early
    if [[ "${SPECKIT_SKIP_POST_VALIDATE:-}" != "1" ]]; then
        bash "$SCRIPT_DIR/validate.sh" "$FEATURE_DIR" --quiet 2>/dev/null || true
    fi

    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 4. BRANCH NAME GENERATION (shared function)
# ───────────────────────────────────────────────────────────────

resolve_branch_name
create_git_branch

# ───────────────────────────────────────────────────────────────
# 5. CREATE SPEC FOLDER STRUCTURE


# ───────────────────────────────────────────────────────────────

FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"

TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"

# Normalize DOC_LEVEL for numeric comparisons (3+ becomes 3)
DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
CREATED_FILES=()

# Validate templates directory exists
if [[ ! -d "$TEMPLATES_BASE" ]]; then
    echo "Error: Templates directory not found at $TEMPLATES_BASE" >&2
    exit 1
fi

# Validate level folder exists (with fallback warning)
if [[ ! -d "$LEVEL_TEMPLATES_DIR" ]]; then
    >&2 echo "[speckit] Warning: Level folder not found at $LEVEL_TEMPLATES_DIR, using base templates"
    LEVEL_TEMPLATES_DIR="$TEMPLATES_BASE"
fi

mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch" "$FEATURE_DIR/memory"
touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"

# ───────────────────────────────────────────────────────────────
# 6. COPY TEMPLATES BASED ON DOCUMENTATION LEVEL


# ───────────────────────────────────────────────────────────────

# Copy all templates from the level folder (using library copy_template)
for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
    if [[ -f "$template_file" ]]; then
        template_name=$(basename "$template_file")
        CREATED_FILES+=("$(copy_template "$template_name" "$FEATURE_DIR" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
    fi
done

# ───────────────────────────────────────────────────────────────
# 6.5. GENERATE PER-FOLDER description.json
# ───────────────────────────────────────────────────────────────

_DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
if [[ -f "$_DESC_SCRIPT" ]]; then
  if node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" \
    --description "$FEATURE_DESCRIPTION"; then
    CREATED_FILES+=("description.json")
  else
    echo "  Warning: description.json generation skipped" >&2
  fi
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
    files_json=$(printf '"%s",' "${CREATED_FILES[@]}" | sed 's/,$//')

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
    echo "      ├── scratch/          (git-ignored working files)"
    echo "      │   └── .gitkeep"
    echo "      └── memory/           (context preservation)"
    echo "          └── .gitkeep"
    echo ""
    echo "  Level $DOC_LEVEL Documentation (CORE + ADDENDUM v2.0):"
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
    [[ "${DOC_LEVEL/+/}" -ge 2 ]] && echo "    4. Add verification items to checklist.md"
    [[ "${DOC_LEVEL/+/}" -ge 3 ]] && echo "    5. Document decisions in decision-record.md"
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
fi

# Post-creation validation: catch template regressions early
if [[ "${SPECKIT_SKIP_POST_VALIDATE:-}" != "1" ]]; then
    bash "$SCRIPT_DIR/validate.sh" "$FEATURE_DIR" --quiet 2>/dev/null || true
fi

# Exit codes:
#   0 - Success
#   1 - --level requires a value (1, 2, or 3)
