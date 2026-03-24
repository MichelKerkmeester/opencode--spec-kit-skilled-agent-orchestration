#!/usr/bin/env bash
set -euo pipefail
# ───────────────────────────────────────────────────────────────
# SPEC-KIT: TEMPLATE COMPOSER
# ───────────────────────────────────────────────────────────────
#
# Automated template composition for SpecKit documentation levels.
#
# PURPOSE:
#   Composes level-specific templates from core + addendum components.
#   Ensures consistency between source templates and composed outputs.
#   Prevents drift when core/ or addendum/ templates are modified.
#
# USAGE:
#   Compose.sh [OPTIONS] [LEVELS...]
#
# OPTIONS:
#   --dry-run, -n        Preview changes without writing files
#   --verbose, -v        Show detailed output during composition
#   --verify             Verify composed templates match sources (no changes)
#   --help, -h           Show this help message
#
# LEVELS:
#   1, 2, 3, 3+          Specific levels to compose (default: all)
#
# EXAMPLES:
#   Compose.sh                    # Compose all levels
#   Compose.sh 2 3                # Compose only Level 2 and 3
#   Compose.sh --dry-run          # Preview all changes
#   Compose.sh --verbose 2        # Verbose composition of Level 2
#   Compose.sh --verify           # Check if composed templates are current
#
# COMPOSITION RULES:
#   Level 1:  Core only
#   Level 2:  Core + level2-verify addendum
#   Level 3:  Core + level2-verify + level3-arch addendums
#   Level 3+: Core + level2-verify + level3-arch + level3plus-govern addendums
#
# FILE MAPPING:
#   Spec.md:                 Merge spec-core.md + spec-levelN.md sections
#   Plan.md:                 Merge plan-core.md + plan-levelN.md sections
#   Tasks.md:                Copy tasks-core.md (no addendums)
#   Implementation-summary.md: Copy impl-summary-core.md (no addendums)
#   Checklist.md:            Copy from level2-verify (Level 2+)
#   Decision-record.md:      Copy from level3-arch (Level 3+)
#
# TEMPLATE MARKERS:
#   <!-- SPECKIT_LEVEL: N -->          Updated in composed output
#   <!-- SPECKIT_TEMPLATE_SOURCE: -->  Preserved from core
#   <!-- SPECKIT_ADDENDUM: -->         Stripped from output
#

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Get script directory and resolve paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$(cd "$SCRIPT_DIR/../../templates" && pwd)"

# Source directories
CORE_DIR="$TEMPLATES_DIR/core"
ADDENDUM_DIR="$TEMPLATES_DIR/addendum"
ADDENDUM_L2="$ADDENDUM_DIR/level2-verify"
ADDENDUM_L3="$ADDENDUM_DIR/level3-arch"
ADDENDUM_L3PLUS="$ADDENDUM_DIR/level3plus-govern"

# Output directories
OUT_L1="$TEMPLATES_DIR/level_1"
OUT_L2="$TEMPLATES_DIR/level_2"
OUT_L3="$TEMPLATES_DIR/level_3"
OUT_L3PLUS="$TEMPLATES_DIR/level_3+"

# ───────────────────────────────────────────────────────────────
# 2. GLOBALS
# ───────────────────────────────────────────────────────────────

DRY_RUN=false
VERBOSE=false
VERIFY_ONLY=false
LEVELS_TO_COMPOSE=()
CHANGES_MADE=0
ERRORS=0

# Colors for output
if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  BLUE='\033[0;34m'
  NC='\033[0m'
else
  RED='' GREEN='' YELLOW='' BLUE='' NC=''
fi

# ───────────────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Show_help()
# Display usage information
show_help() {
    cat << 'EOF'
SpecKit Template Composer

Composes level-specific templates from core + addendum components.

USAGE:
  compose.sh [OPTIONS] [LEVELS...]

OPTIONS:
  --dry-run, -n        Preview changes without writing files
  --verbose, -v        Show detailed output during composition
  --verify             Verify composed templates match sources (no changes)
  --help, -h           Show this help message

LEVELS:
  1, 2, 3, 3+          Specific levels to compose (default: all)

EXAMPLES:
  compose.sh                    # Compose all levels
  compose.sh 2 3                # Compose only Level 2 and 3
  compose.sh --dry-run          # Preview all changes
  compose.sh --verbose 2        # Verbose composition of Level 2
  compose.sh --verify           # Check if composed templates are current

COMPOSITION RULES:
  Level 1:  Core templates only (spec, plan, tasks, impl-summary)
  Level 2:  Core + level2-verify (adds checklist, NFRs, edge cases)
  Level 3:  Core + L2 + level3-arch (adds decision-record, risk matrix)
  Level 3+: Core + L2 + L3 + level3plus-govern (adds governance, compliance)

EOF
    exit 0
}

# Log()
# Colored logging helper
log() {
    local level="$1"
    shift
    local message="$*"

    case "$level" in
        INFO)  echo -e "${BLUE}[INFO]${NC} $message" ;;
        OK)    echo -e "${GREEN}[OK]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        DEBUG) [[ "$VERBOSE" == true ]] && echo -e "[DEBUG] $message" || true ;;
    esac
}

# Verbose()
# Print only if verbose mode is enabled (to stderr to avoid polluting stdout)
verbose() {
    [[ "$VERBOSE" == true ]] && echo "  $*" >&2 || true
}

# Ensure_dir()
# Create directory if it doesn't exist
ensure_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        if [[ "$DRY_RUN" == true ]]; then
            log DEBUG "Would create directory: $dir"
        else
            mkdir -p "$dir"
            verbose "Created directory: $dir"
        fi
    fi
}

# File_exists()
# Check if file exists
file_exists() {
    [[ -f "$1" ]]
}

# ───────────────────────────────────────────────────────────────
# 4. COMPOSITION FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Update_level_marker()
# Update SPECKIT_LEVEL comment in content
# Args: $1=content, $2=level_value (1, 2, 3, or 3+)
update_level_marker() {
    local content="$1"
    local level="$2"

    # Replace CORE marker with actual level
    echo "$content" | sed "s/<!-- SPECKIT_LEVEL: CORE -->/<!-- SPECKIT_LEVEL: $level -->/"
}

# Update_metadata_level()
# Update the Level value in METADATA table
# Args: $1=content, $2=level_value
update_metadata_level() {
    local content="$1"
    local level="$2"

    # Update | **Level** | [1/2/3] | to actual level
    echo "$content" | sed "s/| \*\*Level\*\* | \[1\/2\/3\] |/| **Level** | $level |/"
}

# Strip_addendum_markers()
# Remove SPECKIT_ADDENDUM comments from content
strip_addendum_markers() {
    local content="$1"
    echo "$content" | grep -v "<!-- SPECKIT_ADDENDUM:" | grep -v "<!-- Append after" | grep -v "<!-- Insert after"
}

# Strip_frontmatter()
# Remove leading YAML frontmatter block from content if present.
strip_frontmatter() {
    local content="$1"

    if [[ "$(echo "$content" | head -n 1)" != "---" ]]; then
        echo "$content"
        return
    fi

    local stripped
    stripped=$(echo "$content" | awk '
        BEGIN { in_frontmatter=0; seen_start=0 }
        NR==1 && $0 ~ /^---[[:space:]]*$/ {
            in_frontmatter=1
            seen_start=1
            next
        }
        in_frontmatter==1 && $0 ~ /^---[[:space:]]*$/ {
            in_frontmatter=0
            next
        }
        in_frontmatter==1 {
            next
        }
        {
            print
        }
    ')

    if [[ -z "$stripped" ]]; then
        echo "$content"
        return
    fi

    echo "$stripped"
}

# Normalize_template_title_suffix()
# Rewrite frontmatter title suffix to composed output path:
#   "... [template:core/spec-core.md]" -> "... [template:level_2/spec.md]"
# Ensures composed templates remain dashboard-disambiguated and idempotent
# With the frontmatter migration CLI.
normalize_template_title_suffix() {
    local filepath="$1"
    local content="$2"

    # Only normalize files written under templates/
    if [[ "${filepath#"$TEMPLATES_DIR"/}" == "$filepath" ]]; then
        echo "$content"
        return
    fi

    local rel_path="${filepath#"$TEMPLATES_DIR"/}"
    local suffix="[template:${rel_path}]"

    if [[ "$(echo "$content" | head -n 1)" != "---" ]]; then
        echo "$content"
        return
    fi

    echo "$content" | awk -v suffix="$suffix" '
        BEGIN {
            in_frontmatter = 0;
            title_done = 0;
        }

        NR == 1 && $0 ~ /^---[[:space:]]*$/ {
            in_frontmatter = 1;
            print;
            next;
        }

        in_frontmatter == 1 && $0 ~ /^---[[:space:]]*$/ {
            in_frontmatter = 0;
            print;
            next;
        }

        {
            if (in_frontmatter == 1 && title_done == 0 && $0 ~ /^[[:space:]]*title:[[:space:]]*/) {
                line = $0;
                sub(/^[[:space:]]*title:[[:space:]]*/, "", line);
                sub(/\r$/, "", line);
                sub(/^[[:space:]]+/, "", line);
                sub(/[[:space:]]+$/, "", line);

                if (substr(line, 1, 1) == "\"" && substr(line, length(line), 1) == "\"") {
                    line = substr(line, 2, length(line) - 2);
                }

                gsub(/\\"/, "\"", line);
                gsub(/\\\\/, "\\", line);
                gsub(/ \[template:[^]]+\]/, "", line);
                sub(/[[:space:]]+$/, "", line);

                if (line == "") {
                    line = "Template";
                }

                line = line " " suffix;
                gsub(/\\/, "\\\\", line);
                gsub(/"/, "\\\"", line);

                print "title: \"" line "\"";
                title_done = 1;
                next;
            }

            print;
        }
    '
}

# Extract_frontmatter()
# Return leading YAML frontmatter block (with delimiters) if present.
extract_frontmatter() {
    local content="$1"

    if [[ "$(echo "$content" | head -n 1)" != "---" ]]; then
        echo ""
        return
    fi

    echo "$content" | awk '
        BEGIN { in_frontmatter=0; started=0 }
        NR==1 && $0 ~ /^---[[:space:]]*$/ {
            in_frontmatter=1
            started=1
            print
            next
        }
        in_frontmatter==1 {
            print
            if ($0 ~ /^---[[:space:]]*$/) {
                exit
            }
        }
    '
}

# Compose_spec()
# Compose spec.md from core + addendums based on level
# Args: $1=level (1, 2, 3, 3+)
compose_spec() {
    local level="$1"
    local output=""

    verbose "Composing spec.md for Level $level"

    # Start with core
    local core_content
    core_content=$(<"$CORE_DIR/spec-core.md")

    case "$level" in
        1)
            # Level 1: Core only, remove placeholder text
            output="$core_content"
            ;;
        2)
            # Level 2: Core + L2 addendum (NFRs, Edge Cases, Complexity)
            local l2_content
            l2_content=$(<"$ADDENDUM_L2/spec-level2.md")
            l2_content=$(strip_frontmatter "$l2_content")
            l2_content=$(strip_addendum_markers "$l2_content")

            # Insert L2 content after Section 6 (Risks & Dependencies)
            # And before Section 7 (Open Questions)
            # Split core at section boundary, insert L2 content between halves
            local before_marker after_marker
            before_marker=$(echo "$core_content" | sed -n '/^## 7\. OPEN QUESTIONS/q;p')
            after_marker=$(echo "$core_content" | sed -n '/^## 7\. OPEN QUESTIONS/,$p')
            output="${before_marker}
${l2_content}

${after_marker}"
            # Renumber Section 7 to Section 10
            output=$(echo "$output" | sed 's/## 7\. OPEN QUESTIONS/## 10. OPEN QUESTIONS/')
            ;;
        3)
            # Level 3: Dynamic composition from core + L3 fragments
            local l3_guidance l3_prefix l3_suffix core_frontmatter core_without_frontmatter core_body open_q
            l3_guidance=$(<"$ADDENDUM_L3/spec-level3-guidance.md")
            l3_prefix=$(<"$ADDENDUM_L3/spec-level3-prefix.md")
            l3_suffix=$(<"$ADDENDUM_L3/spec-level3-suffix.md")
            l3_guidance=$(strip_frontmatter "$l3_guidance")
            l3_prefix=$(strip_frontmatter "$l3_prefix")
            l3_suffix=$(strip_frontmatter "$l3_suffix")
            core_frontmatter=$(extract_frontmatter "$core_content")
            core_without_frontmatter=$(strip_frontmatter "$core_content")

            # Extract core body: sections 1-6 (between first "## 1." and "## 7.")
            core_body=$(echo "$core_without_frontmatter" | sed -n '/^## 1\. /,/^## 7\. /{ /^## 7\. /d; p; }')

            # Extract open questions content (section heading + items, without trailing ---)
            open_q=$(echo "$core_without_frontmatter" | sed -n '/^## 7\. OPEN QUESTIONS/,/^---$/{ /^---$/d; p; }')
            # Renumber to section 12
            open_q=$(echo "$open_q" | sed 's/^## 7\. OPEN QUESTIONS/## 12. OPEN QUESTIONS/')

            output="${core_frontmatter}
# Feature Specification: [NAME]

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

${l3_guidance}

---

${l3_prefix}

---

${core_body}

${l3_suffix}

---

${open_q}

---

## RELATED DOCUMENTS

- **Implementation Plan**: See \`plan.md\`
- **Task Breakdown**: See \`tasks.md\`
- **Verification Checklist**: See \`checklist.md\`
- **Decision Records**: See \`decision-record.md\`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->"
            ;;
        "3+")
            # Level 3+: Dynamic composition from core + L3 prefix + L3+ fragments
            local l3plus_guidance l3_prefix l3plus_suffix core_frontmatter core_without_frontmatter core_body open_q
            l3plus_guidance=$(<"$ADDENDUM_L3PLUS/spec-level3plus-guidance.md")
            l3_prefix=$(<"$ADDENDUM_L3/spec-level3-prefix.md")
            l3plus_suffix=$(<"$ADDENDUM_L3PLUS/spec-level3plus-suffix.md")
            l3plus_guidance=$(strip_frontmatter "$l3plus_guidance")
            l3_prefix=$(strip_frontmatter "$l3_prefix")
            l3plus_suffix=$(strip_frontmatter "$l3plus_suffix")
            core_frontmatter=$(extract_frontmatter "$core_content")
            core_without_frontmatter=$(strip_frontmatter "$core_content")

            # Extract core body: sections 1-6
            core_body=$(echo "$core_without_frontmatter" | sed -n '/^## 1\. /,/^## 7\. /{ /^## 7\. /d; p; }')

            # Open questions as section 16
            open_q="## 16. OPEN QUESTIONS

- [Question 1 requiring clarification]"

            output="${core_frontmatter}
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: [NAME]

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

${l3plus_guidance}

---

${l3_prefix}

---

${core_body}

${l3plus_suffix}

---

${open_q}

---

## RELATED DOCUMENTS

- **Implementation Plan**: See \`plan.md\`
- **Task Breakdown**: See \`tasks.md\`
- **Verification Checklist**: See \`checklist.md\`
- **Decision Records**: See \`decision-record.md\`

---

<!--
LEVEL 3+ SPEC (~200 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->"
            ;;
    esac

    # Update level markers
    output=$(update_level_marker "$output" "$level")
    output=$(update_metadata_level "$output" "$level")

    echo "$output"
}

# Compose_plan()
# Compose plan.md from core + addendums based on level
compose_plan() {
    local level="$1"
    local output=""

    verbose "Composing plan.md for Level $level"

    local core_content
    core_content=$(<"$CORE_DIR/plan-core.md")

    case "$level" in
        1)
            output="$core_content"
            ;;
        2)
            # Level 2: Core + L2 addendum
            local l2_content
            l2_content=$(<"$ADDENDUM_L2/plan-level2.md")
            l2_content=$(strip_frontmatter "$l2_content")
            l2_content=$(strip_addendum_markers "$l2_content")

            # Append L2 sections after core content (before closing comment)
            output=$(echo "$core_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$l2_content

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->"
            ;;
        3)
            # Level 3: Core + L2 + L3 addendums
            local l2_content l3_content
            l2_content=$(<"$ADDENDUM_L2/plan-level2.md")
            l3_content=$(<"$ADDENDUM_L3/plan-level3.md")
            l2_content=$(strip_frontmatter "$l2_content")
            l3_content=$(strip_frontmatter "$l3_content")
            l2_content=$(strip_addendum_markers "$l2_content")
            l3_content=$(strip_addendum_markers "$l3_content")

            output=$(echo "$core_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$l2_content

$l3_content

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->"
            ;;
        "3+")
            # Level 3+: Core + L2 + L3 + L3+ addendums
            local l2_content l3_content l3plus_content
            l2_content=$(<"$ADDENDUM_L2/plan-level2.md")
            l3_content=$(<"$ADDENDUM_L3/plan-level3.md")
            l3plus_content=$(<"$ADDENDUM_L3PLUS/plan-level3plus.md")
            l2_content=$(strip_frontmatter "$l2_content")
            l3_content=$(strip_frontmatter "$l3_content")
            l3plus_content=$(strip_frontmatter "$l3plus_content")
            l2_content=$(strip_addendum_markers "$l2_content")
            l3_content=$(strip_addendum_markers "$l3_content")
            l3plus_content=$(strip_addendum_markers "$l3plus_content")

            output=$(echo "$core_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$l2_content

$l3_content

$l3plus_content

<!--
LEVEL 3+ PLAN (~260 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->"
            ;;
    esac

    # Update level markers
    output=$(update_level_marker "$output" "$level")

    echo "$output"
}

# Compose_tasks()
# Copy tasks-core.md (no addendums exist)
compose_tasks() {
    local level="$1"
    verbose "Composing tasks.md for Level $level"

    local core_content
    core_content=$(<"$CORE_DIR/tasks-core.md")

    # Update level marker
    core_content=$(update_level_marker "$core_content" "$level")

    echo "$core_content"
}

# Compose_impl_summary()
# Copy impl-summary-core.md (no addendums exist)
compose_impl_summary() {
    local level="$1"
    verbose "Composing implementation-summary.md for Level $level"

    local core_content
    core_content=$(<"$CORE_DIR/impl-summary-core.md")

    # Update level marker
    core_content=$(update_level_marker "$core_content" "$level")

    echo "$core_content"
}

# Compose_checklist()
# Copy checklist from level2-verify, add L3+ extensions if needed
compose_checklist() {
    local level="$1"
    verbose "Composing checklist.md for Level $level"

    local base_content
    base_content=$(<"$ADDENDUM_L2/checklist.md")

    case "$level" in
        2)
            echo "$base_content"
            ;;
        3|"3+")
            # Add L3+ extended checklist items
            local ext_content
            ext_content=$(<"$ADDENDUM_L3PLUS/checklist-extended.md")
            ext_content=$(strip_frontmatter "$ext_content")
            ext_content=$(strip_addendum_markers "$ext_content")

            # Append extended items before closing comment
            local output
            output=$(echo "$base_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$ext_content

<!--
Level ${level} checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->"

            # Update level marker in comment
            output=$(echo "$output" | sed "s/<!-- SPECKIT_LEVEL: 2 -->/<!-- SPECKIT_LEVEL: $level -->/")

            echo "$output"
            ;;
    esac
}

# Compose_decision_record()
# Copy decision-record from level3-arch
compose_decision_record() {
    local level="$1"
    verbose "Composing decision-record.md for Level $level"

    cat "$ADDENDUM_L3/decision-record.md"
}

# ───────────────────────────────────────────────────────────────
# 5. LEVEL COMPOSITION ORCHESTRATION
# ───────────────────────────────────────────────────────────────

# Write_file()
# Write content to file (respecting dry-run mode)
write_file() {
    local filepath="$1"
    local content="$2"
    local filename
    filename=$(basename "$filepath")

    content=$(normalize_template_title_suffix "$filepath" "$content")

    if [[ "$DRY_RUN" == true ]]; then
        log DEBUG "Would write: $filepath"
        if [[ "$VERBOSE" == true ]]; then
            echo "--- Preview: $filename ---"
            echo "$content" | head -20
            echo "... (truncated)"
            echo "---"
        fi
        ((CHANGES_MADE++)) || true
    elif [[ "$VERIFY_ONLY" == true ]]; then
        if [[ -f "$filepath" ]]; then
            local existing
            existing=$(<"$filepath")
            if [[ "$existing" != "$content" ]]; then
                log WARN "Drift detected: $filepath"
                ((CHANGES_MADE++)) || true
            else
                verbose "OK: $filepath matches"
            fi
        else
            log WARN "Missing: $filepath"
            ((CHANGES_MADE++)) || true
        fi
    else
        echo "$content" > "$filepath"
        verbose "Wrote: $filepath"
        ((CHANGES_MADE++)) || true
    fi
}

# Compose_level()
# Compose all templates for a given level
compose_level() {
    local level="$1"
    local out_dir

    case "$level" in
        1)    out_dir="$OUT_L1" ;;
        2)    out_dir="$OUT_L2" ;;
        3)    out_dir="$OUT_L3" ;;
        "3+") out_dir="$OUT_L3PLUS" ;;
        *)
            log ERROR "Unknown level: $level"
            ((ERRORS++)) || true
            return 1
            ;;
    esac

    log INFO "Composing Level $level templates..."
    ensure_dir "$out_dir"

    # Always compose these files (all levels)
    local spec_content plan_content tasks_content impl_content
    spec_content=$(compose_spec "$level")
    plan_content=$(compose_plan "$level")
    tasks_content=$(compose_tasks "$level")
    impl_content=$(compose_impl_summary "$level")

    write_file "$out_dir/spec.md" "$spec_content"
    write_file "$out_dir/plan.md" "$plan_content"
    write_file "$out_dir/tasks.md" "$tasks_content"
    write_file "$out_dir/implementation-summary.md" "$impl_content"

    # Level 2+: Add checklist
    if [[ "$level" != "1" ]]; then
        local checklist_content
        checklist_content=$(compose_checklist "$level")
        write_file "$out_dir/checklist.md" "$checklist_content"
    fi

    # Level 3+: Add decision-record
    if [[ "$level" == "3" || "$level" == "3+" ]]; then
        local decision_content
        decision_content=$(compose_decision_record "$level")
        write_file "$out_dir/decision-record.md" "$decision_content"
    fi

    log OK "Level $level complete"
}

# ───────────────────────────────────────────────────────────────
# 6. MAIN SCRIPT
# ───────────────────────────────────────────────────────────────

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run|-n)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --verify)
            VERIFY_ONLY=true
            shift
            ;;
        --help|-h)
            show_help
            ;;
        1|2|3)
            LEVELS_TO_COMPOSE+=("$1")
            shift
            ;;
        "3+")
            LEVELS_TO_COMPOSE+=("3+")
            shift
            ;;
        *)
            log ERROR "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Default to all levels if none specified
if [[ ${#LEVELS_TO_COMPOSE[@]} -eq 0 ]]; then
    LEVELS_TO_COMPOSE=(1 2 3 "3+")
fi

# ───────────────────────────────────────────────────────────────
# 7. VALIDATION
# ───────────────────────────────────────────────────────────────

# Verify source directories exist
if [[ ! -d "$CORE_DIR" ]]; then
    log ERROR "Core templates directory not found: $CORE_DIR"
    exit 1
fi

if [[ ! -d "$ADDENDUM_DIR" ]]; then
    log ERROR "Addendum templates directory not found: $ADDENDUM_DIR"
    exit 1
fi

# Verify required source files exist
required_files=(
    "$CORE_DIR/spec-core.md"
    "$CORE_DIR/plan-core.md"
    "$CORE_DIR/tasks-core.md"
    "$CORE_DIR/impl-summary-core.md"
    "$ADDENDUM_L2/spec-level2.md"
    "$ADDENDUM_L2/plan-level2.md"
    "$ADDENDUM_L2/checklist.md"
    "$ADDENDUM_L3/spec-level3.md"
    "$ADDENDUM_L3/spec-level3-prefix.md"
    "$ADDENDUM_L3/spec-level3-suffix.md"
    "$ADDENDUM_L3/spec-level3-guidance.md"
    "$ADDENDUM_L3/plan-level3.md"
    "$ADDENDUM_L3/decision-record.md"
    "$ADDENDUM_L3PLUS/spec-level3plus.md"
    "$ADDENDUM_L3PLUS/spec-level3plus-suffix.md"
    "$ADDENDUM_L3PLUS/spec-level3plus-guidance.md"
    "$ADDENDUM_L3PLUS/plan-level3plus.md"
    "$ADDENDUM_L3PLUS/checklist-extended.md"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        log ERROR "Required source file not found: $file"
        ((ERRORS++)) || true
    fi
done

if [[ $ERRORS -gt 0 ]]; then
    log ERROR "Cannot proceed with $ERRORS missing source files"
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 8. EXECUTE COMPOSITION
# ───────────────────────────────────────────────────────────────

echo ""
if [[ "$DRY_RUN" == true ]]; then
    log INFO "DRY RUN MODE - No files will be modified"
elif [[ "$VERIFY_ONLY" == true ]]; then
    log INFO "VERIFY MODE - Checking for drift"
fi
echo ""

for level in "${LEVELS_TO_COMPOSE[@]}"; do
    compose_level "$level"
done

echo ""
if [[ "$DRY_RUN" == true ]]; then
    log INFO "Dry run complete. $CHANGES_MADE files would be written."
elif [[ "$VERIFY_ONLY" == true ]]; then
    if [[ $CHANGES_MADE -gt 0 ]]; then
        log WARN "Verification found $CHANGES_MADE files with drift. Run compose.sh to update."
        exit 1
    else
        log OK "All composed templates are current."
    fi
else
    log OK "Composition complete. $CHANGES_MADE files written."
fi

exit 0

# Exit codes:
#   0 - Success
#   1 - General error
