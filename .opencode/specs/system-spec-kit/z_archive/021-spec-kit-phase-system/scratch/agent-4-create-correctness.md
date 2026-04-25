# Agent 4: Functional Correctness — create.sh Phase Mode

**Reviewer:** @review agent (Claude Opus 4.6)
**Date:** 2026-03-08
**Primary file:** `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
**Reference spec:** `.opencode/specs/system-spec-kit/021-spec-kit-phase-system/spec.md`

---

## Summary

The `--phase` flag implementation in `create.sh` is **substantially complete and functionally correct** across 6 of the 7 checks. One check reveals a moderate issue (unreplaced YAML frontmatter placeholder in the child header template) and another reveals a structural concern (duplicate YAML frontmatter in child spec files). The core phase creation logic — folder numbering, template injection, placeholder replacement, and parent-child linking — is well-implemented with careful handling of edge cases like append-to-existing-parent mode and phase-name/count conflicts.

**Overall verdict:** 6 PASS, 0 FAIL, 1 PASS WITH CAVEATS

---

## Check 1: Mutual Exclusivity (`--phase` and `--subfolder`)

**Result: PASS**

**Evidence:**
- Lines 270–274 of `create.sh`:
```bash
# Mutual exclusivity check: --phase and --subfolder cannot be combined
if [[ "$PHASE_MODE" = true ]] && [[ "$SUBFOLDER_MODE" = true ]]; then
    echo "Error: --phase and --subfolder are mutually exclusive" >&2
    exit 1
fi
```

The check is explicit, placed immediately after argument parsing (line 262, end of the `while` loop), and before any filesystem operations begin. It produces a clear error message and exits with code 1.

**Additional validation:** Lines 277–280 also enforce that `--parent` requires `--phase`:
```bash
if [[ -n "$PHASE_PARENT" ]] && [[ "$PHASE_MODE" != true ]]; then
    echo "Error: --parent can only be used with --phase" >&2
    exit 1
fi
```

This aligns with spec OQ-05's proposal that `--phase` and `--subfolder` are mutually exclusive flags.

---

## Check 2: `--phases <N>` Auto-Numbering

**Result: PASS**

**Evidence:**
- Lines 113–130 parse `--phases` with validation:
```bash
--phases)
    ...
    if ! [[ "$next_arg" =~ ^[1-9][0-9]*$ ]]; then
        echo 'Error: --phases must be a positive integer (got: '"$next_arg"')' >&2
        exit 1
    fi
    PHASE_COUNT="$next_arg"
    PHASE_COUNT_EXPLICIT=true
    ;;
```

- Lines 678–688 generate child folder names with 3-digit numbering:
```bash
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
```

The `printf "%03d"` at line 681 ensures 3-digit zero-padded numbering (001, 002, 003...). When no `--phase-names` are provided, the default slug is `phase-N` (e.g., `001-phase-1`, `002-phase-2`, `003-phase-3`).

**Append mode numbering:** Lines 658–674 correctly handle appending to an existing parent by scanning for the highest existing phase number and setting `PHASE_START_INDEX` accordingly:
```bash
PHASE_START_INDEX=1
if [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
    for dir in "$FEATURE_DIR"/[0-9][0-9][0-9]-*/; do
        ...
        if [[ $_num -gt $EXISTING_PHASE_COUNT ]]; then
            EXISTING_PHASE_COUNT=$_num
            ...
        fi
    done
    PHASE_START_INDEX=$((EXISTING_PHASE_COUNT + 1))
fi
```

This satisfies edge case EC-04 from the spec (numbering gap tolerance via max+1 logic).

---

## Check 3: `--phase-names` Customization

**Result: PASS**

**Evidence:**
- Lines 131–143 parse `--phase-names`:
```bash
--phase-names)
    ...
    PHASE_NAMES="$next_arg"
    ;;
```

- Lines 586–604 split, trim, slugify, and validate names:
```bash
PHASE_NAME_ARRAY=()
if [[ -n "$PHASE_NAMES" ]]; then
    IFS=',' read -ra _raw_names <<< "$PHASE_NAMES"
    for _name in "${_raw_names[@]}"; do
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
```

Key behaviors verified:
1. Names are comma-separated, individually trimmed, and slugified
2. Empty/invalid names produce an error with the offending entry shown
3. When both `--phases N` and `--phase-names` are provided, `--phase-names` wins (with a warning) -- `PHASE_COUNT` is overridden to match the actual name count (line 603)
4. The names are used at line 683 in the folder generation loop:
```bash
if [[ ${#PHASE_NAME_ARRAY[@]} -ge $_i ]]; then
    _child_slug="${PHASE_NAME_ARRAY[$((_i - 1))]}"
```

Example result: `--phase-names "foundation,implementation,integration"` produces `001-foundation/`, `002-implementation/`, `003-integration/`.

---

## Check 4: Phase Documentation Map Injection into Parent spec.md

**Result: PASS**

**Evidence:**

The code handles two distinct scenarios:

### Scenario A: New parent (lines 778–806)
```bash
# Read the parent section template
PHASE_PARENT_TEMPLATE=$(< "$PHASE_ADDENDUM_DIR/phase-parent-section.md")

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
```

The template is loaded from `phase-parent-section.md` (verified at line 576-579 with existence check). Phase rows and handoff rows are generated at lines 698-724 in the correct 5-column and 4-column table formats matching the template.

### Scenario B: Existing parent with Phase Map (lines 726–777)
An awk-based approach appends new phase rows before `### Phase Transition Rules` and new handoff rows before `<!-- /ANCHOR:phase-map -->`. This correctly handles the append-to-existing-parent case.

**Template verification:** The `phase-parent-section.md` template contains the `<!-- ANCHOR:phase-map -->` section with placeholders `[YOUR_VALUE_HERE: PHASE_ROW]` and `[YOUR_VALUE_HERE: HANDOFF_ROW]` which are correctly matched by the `*"[YOUR_VALUE_HERE: PHASE_ROW]"*` glob patterns.

---

## Check 5: Parent Back-Reference Injection into Children

**Result: PASS WITH CAVEATS**

### Core functionality: PASS

**Evidence (lines 852–894):**
```bash
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

# Replace placeholders
_child_header="${_child_header//\[YOUR_VALUE_HERE: PARENT_FOLDER\]/..}"
_child_header="${_child_header//\[YOUR_VALUE_HERE: PHASE_NUMBER\]/$_phase_number}"
_child_header="${_child_header//\[YOUR_VALUE_HERE: TOTAL_PHASES\]/$TOTAL_PHASES}"
_child_header="${_child_header//\[YOUR_VALUE_HERE: PREDECESSOR_FOLDER\]/$_predecessor}"
_child_header="${_child_header//\[YOUR_VALUE_HERE: SUCCESSOR_FOLDER\]/$_successor}"
_child_header="${_child_header//\[YOUR_VALUE_HERE: PARENT_SPEC_NAME\]/$FEATURE_DESCRIPTION}"
...

# Prepend back-reference block to child spec.md
printf '%s\n\n' "$_child_header" > "$_tmp_child_spec"
cat "$_child_spec" >> "$_tmp_child_spec"
mv "$_tmp_child_spec" "$_child_spec"
```

The back-references correctly include:
- `../spec.md` and `../plan.md` (via `PARENT_FOLDER` -> `..`)
- Phase number and total phases
- Predecessor/successor folder names (with correct `None` for first/last)
- Parent spec name from feature description

**The template used is `phase-child-header.md`** as required.

### Caveat 1: Duplicate YAML Frontmatter (P2 — SUGGESTION)

The child header template (`phase-child-header.md`) contains YAML frontmatter (lines 1–14, `---` delimited block with title, description, trigger_phrases, etc.). The Level 1 `spec.md` template also contains its own YAML frontmatter (lines 1–12). Since the child header is prepended raw (line 892: `printf '%s\n\n' "$_child_header" > "$_tmp_child_spec"`), the resulting child spec.md will contain two YAML frontmatter blocks. This produces:

```
---
title: "This is Phase 1 of the ..."   <-- from child header
...
---
(phase back-reference content)

---
title: "Feature Specification: ..."    <-- from L1 spec.md
...
---
(spec template content)
```

Most Markdown parsers treat only the first `---`-delimited block as frontmatter. The second block may be rendered as a horizontal rule + visible text. This is a cosmetic/structural issue, not a functional blocker, since the memory/search system likely reads the first frontmatter block.

### Caveat 2: Unreplaced Placeholder in YAML Frontmatter Title (P2 — SUGGESTION)

Line 2 of `phase-child-header.md`:
```
title: "This is Phase [YOUR_VALUE_HERE: PHASE_NUMBER] of the [YOUR_VALUE_HERE [template:addendum/phase/phase-child-header.md]"
```

The second placeholder `[YOUR_VALUE_HERE [template:addendum/phase/phase-child-header.md]` is malformed -- it uses `[YOUR_VALUE_HERE [template:...]` instead of `[YOUR_VALUE_HERE: PARENT_SPEC_NAME]`. The code replaces `[YOUR_VALUE_HERE: PARENT_SPEC_NAME]` (with colon) but this template placeholder (without colon, different content) will NOT be matched. After replacement, the title would read:

```
title: "This is Phase 1 of the [YOUR_VALUE_HERE [template:addendum/phase/phase-child-header.md]"
```

This is a template authoring defect, not a `create.sh` logic defect. The code correctly replaces all properly-formatted `[YOUR_VALUE_HERE: ...]` placeholders.

**Remediation:** In `phase-child-header.md` line 2, change:
```
[YOUR_VALUE_HERE [template:addendum/phase/phase-child-header.md]
```
to:
```
[YOUR_VALUE_HERE: PARENT_SPEC_NAME] [template:addendum/phase/phase-child-header.md]
```

---

## Check 6: Placeholder Replacement

**Result: PASS**

**Evidence:** Complete placeholder mapping between template and code:

### Parent template (`phase-parent-section.md`)

| Template Placeholder | Code Replacement | Line |
|---|---|---|
| `[YOUR_VALUE_HERE: PHASE_ROW]` | Full 5-column table row with phase#, folder, scope, deps, status | 789, 706 |
| `[YOUR_VALUE_HERE: HANDOFF_ROW]` | Full 4-column table row with from, to, criteria, verification | 791, 722 |

Both placeholders are matched via `*"[YOUR_VALUE_HERE: ...]"*` glob patterns and replaced with dynamically-generated table rows.

### Child template (`phase-child-header.md`)

| Template Placeholder | Code Replacement | Line | Value |
|---|---|---|---|
| `[YOUR_VALUE_HERE: PARENT_FOLDER]` | `..` | 878 | Relative path to parent |
| `[YOUR_VALUE_HERE: PHASE_NUMBER]` | `$_phase_number` | 879 | Integer (1, 2, 3...) |
| `[YOUR_VALUE_HERE: TOTAL_PHASES]` | `$TOTAL_PHASES` | 880 | Total including existing |
| `[YOUR_VALUE_HERE: PREDECESSOR_FOLDER]` | `$_predecessor` | 881 | Folder name or "None" |
| `[YOUR_VALUE_HERE: SUCCESSOR_FOLDER]` | `$_successor` | 882 | Folder name or "None" |
| `[YOUR_VALUE_HERE: PARENT_SPEC_NAME]` | `$FEATURE_DESCRIPTION` | 883 | User-provided description |
| `[YOUR_VALUE_HERE: phase scope description]` | `[To be defined during planning]` | 884 | Deferred placeholder |
| `[YOUR_VALUE_HERE: predecessor dependencies]` | `[To be defined during planning]` | 885 | Deferred placeholder |
| `[YOUR_VALUE_HERE: phase deliverables]` | `[To be defined during planning]` | 886 | Deferred placeholder |
| `[YOUR_VALUE_HERE: handoff criteria]` | `[To be defined during planning]` | 887 | Deferred placeholder |

All 10 child placeholders from the template body (lines 19–37) are handled. The 4 deferred placeholders are intentionally replaced with `[To be defined during planning]` rather than left as `[YOUR_VALUE_HERE: ...]`, which prevents `validate.sh` from flagging them as unfilled but still signals they need user attention.

**Exception:** The YAML frontmatter title placeholder on line 2 of the template is malformed (see Check 5, Caveat 2). This is a template defect, not a `create.sh` defect.

---

## Check 7: Default L1 Children

**Result: PASS**

**Evidence:**
- Line 821:
```bash
CHILD_LEVEL_DIR=$(get_level_templates_dir "1" "$TEMPLATES_BASE")
```

The child phase folders are **always** created with Level 1 templates, hardcoded as `"1"` in the `get_level_templates_dir` call. This matches:
- Spec OQ-01's proposal: "Default L1, allow --level override"
- Spec risk R-02 mitigation: "Default to L1/L2 for child phases"
- Spec EC-05: "Mixed levels: parent is L3+, child phases are L1: Valid"

- Lines 833–839 copy Level 1 templates:
```bash
for template_file in "$CHILD_LEVEL_DIR"/*.md; do
    if [[ -f "$template_file" ]]; then
        template_name=$(basename "$template_file")
        _child_created_files+=("$(copy_template "$template_name" "$_child_path" "$CHILD_LEVEL_DIR" "$TEMPLATES_BASE")")
    fi
done
```

**Note:** There is currently **no `--child-level` override flag** to allow children at a level other than L1. The spec OQ-01 proposes "allow --level override" but this is not yet implemented. This is acceptable since OQ-01 is still an open question, not a requirement.

---

## Adversarial Self-Check (Hunter/Skeptic/Referee)

No P0 findings. One finding was evaluated at P1 level during the Hunter pass:

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---|---|---|---|
| Duplicate YAML frontmatter in child spec.md | P1 — structural correctness | YAML frontmatter is metadata for memory/search system, not spec content. Most parsers handle gracefully. The child header is an addendum prepended by design. | Downgraded — cosmetic, no functional impact on phase workflow or validate.sh | P2 |
| Unreplaced placeholder in child header YAML title | P1 — incomplete replacement | This is a template authoring defect in `phase-child-header.md`, not a `create.sh` bug. The code correctly replaces all properly-formatted placeholders. | Confirmed as template defect, but downgraded since it only affects YAML metadata title, not user-facing content | P2 |

---

## Results Summary

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Mutual exclusivity (`--phase` / `--subfolder`) | **PASS** | Lines 270–274; clear error + exit 1 |
| 2 | `--phases <N>` auto-numbering | **PASS** | 3-digit `printf "%03d"`, max+1 logic for append mode |
| 3 | `--phase-names` customization | **PASS** | Comma-split, trim, slugify, validate; overrides `--phases` count |
| 4 | Phase Documentation Map injection | **PASS** | Template loaded + placeholders replaced; awk-based append for existing parents |
| 5 | Parent back-reference injection | **PASS (caveats)** | All 10 body placeholders replaced; 2 minor template-level issues (P2) |
| 6 | Placeholder replacement | **PASS** | 2 parent + 10 child placeholders verified; 4 deferred as `[To be defined]` |
| 7 | Default L1 children | **PASS** | Hardcoded `"1"` in `get_level_templates_dir` call; no override flag yet |

---

## Findings by Severity

### P0 (BLOCKER)
None.

### P1 (REQUIRED)
None.

### P2 (SUGGESTION)

**P2-1: Duplicate YAML frontmatter in child spec.md**
- File: `create.sh:892` + `templates/addendum/phase/phase-child-header.md:1-14`
- The phase-child-header.md template includes YAML frontmatter which is prepended verbatim to the L1 spec.md (which has its own frontmatter). Resulting file has two `---` blocks.
- Impact: Cosmetic. Second frontmatter block may render as visible text in some Markdown parsers.
- Remediation: Either strip YAML frontmatter from phase-child-header.md before injection, or remove frontmatter from the addendum template (since it's an injection fragment, not a standalone document).

**P2-2: Malformed placeholder in phase-child-header.md YAML title**
- File: `templates/addendum/phase/phase-child-header.md:2`
- The title contains `[YOUR_VALUE_HERE [template:addendum/phase/phase-child-header.md]` which lacks the colon separator and uses different content than the expected `[YOUR_VALUE_HERE: PARENT_SPEC_NAME]`.
- Impact: After replacement, the YAML title retains an unreplaced bracket expression.
- Remediation: Fix the template to use `[YOUR_VALUE_HERE: PARENT_SPEC_NAME] [template:addendum/phase/phase-child-header.md]`.

---

## Spec Requirements Cross-Reference

| Requirement | Status | Evidence |
|---|---|---|
| REQ-002 (create.sh --phase creates parent + children) | Implemented | Lines 562–984; parent folder + N children with docs |
| REQ-009 (parent Phase Documentation Map) | Implemented | Lines 690–806; template injection with row replacement |
| REQ-010 (child parent back-references) | Implemented | Lines 852–894; 10 placeholder replacements + predecessor/successor |
