# Iteration 7: Integration Probe with Concrete Diffs

## Focus

INTEGRATION PROBE - concrete proposed diffs against current source files for the C+F hybrid template manifest design.

This iteration turns the iteration-005 pseudo-code and iteration-006 stress-test decisions into applyable unified-diff-format proposal hunks. No production source files were modified.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-005.md` first, preserving the pseudo-code refactor plan.
- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-006.md` second, preserving the inline-gate, manifest evolution, and edge mitigation decisions.
- Read the current full shell sources with line numbers:
  - `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`
  - `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`
- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/description.json` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/graph-metadata.json` to decide naming style.

## Findings

### Diff: create.sh

Current integration point: `.opencode/skill/system-spec-kit/scripts/spec/create.sh` still parses `--level`, copies `level_N/*.md`, emits `DOC_LEVEL` output, creates graph metadata before normal templates are copied, and uses Level 1 children in phase mode.

Proposed patch. This keeps backward compatibility by accepting `--level` as an alias where possible, but the primary contract becomes `--preset`.

```diff
--- .opencode/skill/system-spec-kit/scripts/spec/create.sh
+++ .opencode/skill/system-spec-kit/scripts/spec/create.sh
@@ -30,9 +30,9 @@ JSON_MODE=false
 SHORT_NAME=""
 BRANCH_NUMBER=""
-DOC_LEVEL=1  # Default to Level 1 (Baseline)
+PRESET="simple-change"  # Default manifest preset
 SKIP_BRANCH=false
-SHARDED=false  # Enable sharded spec sections for Level 3
+SHARDED=false  # Enable sharded spec sections when supported by the preset contract
 SUBFOLDER_MODE=false  # Enable versioned sub-folder creation
 SUBFOLDER_BASE=""     # Base folder for sub-folder mode
 SUBFOLDER_TOPIC=""    # Topic name for the sub-folder
@@ -57,22 +57,26 @@ while [[ $i -le $# ]]; do
         --json)
             JSON_MODE=true
             ;;
-        --level)
+        --preset)
             if [[ $((i + 1)) -gt $# ]]; then
-                echo 'Error: --level requires a value (1, 2, or 3)' >&2
+                echo 'Error: --preset requires a value' >&2
                 exit 1
             fi
             i=$((i + 1))
             next_arg="${!i}"
             if [[ "$next_arg" == --* ]]; then
-                echo 'Error: --level requires a value (1, 2, or 3)' >&2
-                exit 1
-            fi
-            if [[ ! "$next_arg" =~ ^(1|2|3|3\+)$ ]]; then
-                echo 'Error: --level must be 1, 2, 3, or 3+' >&2
+                echo 'Error: --preset requires a value' >&2
                 exit 1
             fi
-            DOC_LEVEL="$next_arg"
+            PRESET="$next_arg"
+            ;;
+        --level)
+            if [[ $((i + 1)) -gt $# ]]; then
+                echo 'Error: --level requires a value (1, 2, 3, or 3+)' >&2
+                exit 1
+            fi
+            i=$((i + 1))
+            next_arg="${!i}"
+            PRESET="$(legacy_level_to_preset "$next_arg")"
             ;;
@@ -197,11 +201,10 @@ while [[ $i -le $# ]]; do
         --help|-h)
             echo "Usage: $0 [options] <feature_description>"
             echo ""
-            echo "Creates a new spec folder with templates based on documentation level."
+            echo "Creates a new spec folder from a manifest preset."
             echo ""
             echo "Options:"
             echo "  --json              Output in JSON format"
-            echo "  --level N           Documentation level: 1, 2, 3, or 3+ (extended)"
-            echo "                      1=baseline, 2=verification, 3=full, 3+=extended"
-            echo "                      Default: 1"
+            echo "  --preset NAME       Manifest preset, e.g. simple-change, validated-change, arch-change"
+            echo "  --level N           Legacy alias mapped to the nearest manifest preset"
             echo "  --sharded           Create sharded spec sections (Level 3 only)"
@@ -248,7 +251,7 @@ while [[ $i -le $# ]]; do
             echo ""
             echo "Examples:"
             echo "  $0 'Add user authentication system' --short-name 'user-auth'"
-            echo "  $0 'Implement complex OAuth2 flow' --level 2"
-            echo "  $0 'Major architecture redesign' --level 3 --number 50"
+            echo "  $0 'Implement complex OAuth2 flow' --preset validated-change"
+            echo "  $0 'Major architecture redesign' --preset arch-change --number 50"
             echo "  $0 'Large platform migration' --level 3 --sharded"
@@ -352,8 +355,10 @@ create_graph_metadata_file() {
     local folder_path="$1"
     local summary="${2:-}"
     local status="${3:-planned}"
+    local preset="${4:-$PRESET}"
     local graph_path="$folder_path/graph-metadata.json"
+    local template_contract_json
+    template_contract_json="$(template_contract_for_preset "$TEMPLATES_BASE/manifest/spec-kit-docs.json" "$preset")"
@@ -384,13 +389,9 @@ create_graph_metadata_file() {
-    local source_docs_json='["spec.md","plan.md","tasks.md"]'
-    local key_files_json='["spec.md","plan.md","tasks.md"]'
-    if [[ -f "$folder_path/spec.md" && ! -f "$folder_path/plan.md" && ! -f "$folder_path/tasks.md" ]]; then
-        source_docs_json='["spec.md"]'
-        key_files_json='["spec.md"]'
-    elif [[ -f "$folder_path/checklist.md" && -f "$folder_path/decision-record.md" ]]; then
-        source_docs_json='["spec.md","plan.md","tasks.md","checklist.md","decision-record.md"]'
-        key_files_json='["spec.md","plan.md","tasks.md","checklist.md","decision-record.md"]'
-    elif [[ -f "$folder_path/checklist.md" ]]; then
-        source_docs_json='["spec.md","plan.md","tasks.md","checklist.md"]'
-        key_files_json='["spec.md","plan.md","tasks.md","checklist.md"]'
-    fi
+    local source_docs_json
+    local key_files_json
+    source_docs_json="$(template_contract_docs_json "$template_contract_json" "sourceDocs")"
+    key_files_json="$(template_contract_docs_json "$template_contract_json" "keyFiles")"
@@ -418,7 +419,8 @@ create_graph_metadata_file() {
     "last_save_at": "${now_iso}",
     "last_accessed_at": null,
-    "source_docs": ${source_docs_json}
+    "source_docs": ${source_docs_json},
+    "template_contract": ${template_contract_json}
   }
 }
@@ -538,19 +540,13 @@ if [[ "$SUBFOLDER_MODE" = true ]]; then
-    # Copy templates based on documentation level from level-specific folder
     TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
-    # Normalize DOC_LEVEL for numeric comparisons (3+ becomes 3)
-    DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
-    LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
+    MANIFEST_PATH="$TEMPLATES_BASE/manifest/spec-kit-docs.json"
     CREATED_FILES=()
 
-    # Copy all templates from the level folder
-    for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
-        if [[ -f "$template_file" ]]; then
-            template_name=$(basename "$template_file")
-            CREATED_FILES+=("$(copy_template "$template_name" "$SUBFOLDER_PATH" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
-        fi
-    done
+    mapfile -t CREATED_FILES < <(
+        scaffold_from_manifest "$MANIFEST_PATH" "$PRESET" "$SUBFOLDER_PATH" "$FEATURE_DESCRIPTION"
+    )
+    create_graph_metadata_file "$SUBFOLDER_PATH" "$FEATURE_DESCRIPTION" "planned" "$PRESET"
@@ -556,15 +552,15 @@ if [[ "$SUBFOLDER_MODE" = true ]]; then
-        printf '{"SUBFOLDER_PATH":"%s","SUBFOLDER_NAME":"%s","BASE_FOLDER":"%s","DOC_LEVEL":"%s","CREATED_FILES":[%s]}\n' \
-            "$(_json_escape "$SUBFOLDER_PATH")" "$(_json_escape "$SUBFOLDER_NAME")" "$(_json_escape "$RESOLVED_BASE")" "$DOC_LEVEL" "$files_json"
+        printf '{"SUBFOLDER_PATH":"%s","SUBFOLDER_NAME":"%s","BASE_FOLDER":"%s","PRESET":"%s","CREATED_FILES":[%s]}\n' \
+            "$(_json_escape "$SUBFOLDER_PATH")" "$(_json_escape "$SUBFOLDER_NAME")" "$(_json_escape "$RESOLVED_BASE")" "$(_json_escape "$PRESET")" "$files_json"
@@ -566,7 +562,7 @@ if [[ "$SUBFOLDER_MODE" = true ]]; then
-        echo "  DOC_LEVEL:      Level $DOC_LEVEL"
+        echo "  PRESET:         $PRESET"
@@ -663,9 +659,9 @@ if [[ "$PHASE_MODE" = true ]]; then
     TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
+    MANIFEST_PATH="$TEMPLATES_BASE/manifest/spec-kit-docs.json"
     readonly PHASE_ADDENDUM_DIR="$TEMPLATES_BASE/addendum/phase"
-    readonly LEAN_PHASE_PARENT_TEMPLATE="$TEMPLATES_BASE/phase_parent/spec.md"
+    readonly LEAN_PHASE_PARENT_TEMPLATE="$TEMPLATES_BASE/manifest/phase-parent.spec.md.tmpl"
@@ -855,7 +851,7 @@ if [[ "$PHASE_MODE" = true ]]; then
         mv "$_tmp_parent_spec" "$PARENT_SPEC"
         PARENT_CREATED_FILES+=("spec.md")
-        create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
+        create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned" "phase-parent"
     fi
@@ -962,7 +958,6 @@ if [[ "$PHASE_MODE" = true ]]; then
-    CHILD_LEVEL_DIR=$(get_level_templates_dir "1" "$TEMPLATES_BASE")
     CHILDREN_INFO=()   # For JSON output
@@ -973,15 +968,11 @@ if [[ "$PHASE_MODE" = true ]]; then
         touch "$_child_path/scratch/.gitkeep"
-        create_graph_metadata_file "$_child_path" "Phase ${_i}: ${_child_folder#*-}" "planned"
 
-        # Copy Level 1 templates to child folder
-        for template_file in "$CHILD_LEVEL_DIR"/*.md; do
-            if [[ -f "$template_file" ]]; then
-                template_name=$(basename "$template_file")
-                _child_created_files+=("$(copy_template "$template_name" "$_child_path" "$CHILD_LEVEL_DIR" "$TEMPLATES_BASE")")
-            fi
-        done
+        mapfile -t _child_created_files < <(
+            scaffold_from_manifest "$MANIFEST_PATH" "simple-change" "$_child_path" "Phase ${_i}: ${_child_folder#*-}"
+        )
+        create_graph_metadata_file "$_child_path" "Phase ${_i}: ${_child_folder#*-}" "planned" "simple-change"
@@ -1074,8 +1065,8 @@ if [[ "$PHASE_MODE" = true ]]; then
-        printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s","PHASE_MODE":true,"PHASE_COUNT":%d,"PARENT_FILES":[%s],"CHILDREN":[%s]}\n' \
-            "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$PHASE_COUNT" "$parent_files_json" "$children_json"
+        printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","PRESET":"phase-parent","PHASE_MODE":true,"PHASE_COUNT":%d,"PARENT_FILES":[%s],"CHILDREN":[%s]}\n' \
+            "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$PHASE_COUNT" "$parent_files_json" "$children_json"
@@ -1084,7 +1075,7 @@ if [[ "$PHASE_MODE" = true ]]; then
-        echo "  DOC_LEVEL:    Level $DOC_LEVEL (parent)"
+        echo "  PRESET:       phase-parent (parent), simple-change (children)"
@@ -1146,38 +1137,25 @@ FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
 TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
+MANIFEST_PATH="$TEMPLATES_BASE/manifest/spec-kit-docs.json"
 
-# Normalize DOC_LEVEL for numeric comparisons (3+ becomes 3)
-DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
-LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
 CREATED_FILES=()
@@ -1159,23 +1137,16 @@ if [[ ! -d "$TEMPLATES_BASE" ]]; then
-# Validate level folder exists (with fallback warning)
-if [[ ! -d "$LEVEL_TEMPLATES_DIR" ]]; then
-    >&2 echo "[speckit] Warning: Level folder not found at $LEVEL_TEMPLATES_DIR, using base templates"
-    LEVEL_TEMPLATES_DIR="$TEMPLATES_BASE"
+if [[ ! -f "$MANIFEST_PATH" ]]; then
+    echo "Error: Template manifest not found at $MANIFEST_PATH" >&2
+    exit 1
 fi
 
 mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"
 touch "$FEATURE_DIR/scratch/.gitkeep"
-create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
@@ -1170,12 +1141,10 @@ create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
-# 6. COPY TEMPLATES BASED ON DOCUMENTATION LEVEL
+# 6. SCAFFOLD AUTHOR-OWNED DOCS FROM MANIFEST PRESET
@@ -1175,11 +1144,10 @@ create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
-# Copy all templates from the level folder (using library copy_template)
-for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
-    if [[ -f "$template_file" ]]; then
-        template_name=$(basename "$template_file")
-        CREATED_FILES+=("$(copy_template "$template_name" "$FEATURE_DIR" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
-    fi
-done
+mapfile -t CREATED_FILES < <(
+    scaffold_from_manifest "$MANIFEST_PATH" "$PRESET" "$FEATURE_DIR" "$FEATURE_DESCRIPTION"
+)
+create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned" "$PRESET"
@@ -1201,7 +1169,7 @@ _DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
-if [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -ge 3 ]]; then
+if [[ "$SHARDED" = true ]] && preset_supports_feature "$MANIFEST_PATH" "$PRESET" "sharded-spec-sections"; then
@@ -1228,8 +1196,8 @@ if [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -ge 3 ]]; then
-elif [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -lt 3 ]]; then
-    echo "Warning: --sharded flag is only supported with --level 3 or 3+. Ignoring --sharded." >&2
+elif [[ "$SHARDED" = true ]]; then
+    echo "Warning: --sharded flag is not supported by preset $PRESET. Ignoring --sharded." >&2
 fi
@@ -1270,8 +1238,8 @@ if $JSON_MODE; then
-    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s","SHARDED":%s%s%s%s,"CREATED_FILES":[%s]}\n' \
-        "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$SHARDED" "$complexity_json" "$expansion_json" "$description_json" "$files_json"
+    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","PRESET":"%s","SHARDED":%s%s%s%s,"CREATED_FILES":[%s]}\n' \
+        "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$(_json_escape "$PRESET")" "$SHARDED" "$complexity_json" "$expansion_json" "$description_json" "$files_json"
@@ -1280,7 +1248,7 @@ else
-    echo "  DOC_LEVEL:    Level $DOC_LEVEL"
+    echo "  PRESET:       $PRESET"
@@ -1298,27 +1266,8 @@ else
-    echo "  Level $DOC_LEVEL Documentation (CORE + ADDENDUM v2.0):"
-    case $DOC_LEVEL in
-        1) echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
-           echo "      (Essential what/why/how - ~270 LOC)" ;;
-        2) echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
-           echo "    ✓ +Verify: checklist.md, NFRs, edge cases, effort estimation"
-           echo "      (Quality gates - adds ~120 LOC)" ;;
-        3|"3+") echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
-           echo "    ✓ +Verify: checklist.md, NFRs, edge cases"
-           echo "    ✓ +Arch: decision-record.md, executive summary, risk matrix"
-           if [[ "$DOC_LEVEL" = "3+" ]]; then
-               echo "    ✓ +Govern: approval workflow, compliance, AI protocols"
-               echo "      (Full governance - adds ~100 LOC)"
-           else
-               echo "      (Architecture decisions - adds ~150 LOC)"
-           fi
-           if [[ "$SHARDED" = true ]]; then
-               echo "    ✓ Sharded: spec-sections/ (modular documentation)"
-           fi ;;
-    esac
+    echo "  Manifest Contract:"
+    print_template_contract_summary "$MANIFEST_PATH" "$PRESET" | sed 's/^/    /'
@@ -1323,8 +1272,6 @@ else
-    [[ "${DOC_LEVEL/+/}" -ge 2 ]] && echo "    4. Add verification items to checklist.md"
-    [[ "${DOC_LEVEL/+/}" -ge 3 ]] && echo "    5. Document decisions in decision-record.md"
     echo ""
```

Integration note: this diff intentionally assumes helper functions added to `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`: `legacy_level_to_preset`, `scaffold_from_manifest`, `template_contract_for_preset`, `template_contract_docs_json`, `preset_supports_feature`, and `print_template_contract_summary`.

### Diff: check-files.sh

Current integration point: `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` hardcodes required files by numeric level and special-cases implementation-summary after work starts. The manifest contract should own required docs.

```diff
--- .opencode/skill/system-spec-kit/scripts/rules/check-files.sh
+++ .opencode/skill/system-spec-kit/scripts/rules/check-files.sh
@@ -7,12 +7,12 @@
 set -euo pipefail
+source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/lib/template-utils.sh"
@@ -31,8 +31,7 @@ run_check() {
     local missing=()
-    # T501 FIX: Strip non-numeric suffix (e.g. "3+" -> "3") for arithmetic comparisons
-    local numeric_level="${level//[^0-9]/}"
+    local manifest_path="$REPO_ROOT/.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json"
@@ -39,52 +38,35 @@ run_check() {
-    # Phase-parent early branch: if folder is a phase parent, only spec.md is required
-    # at the parent level. Plan, tasks, checklist, decision-record, and
-    # implementation-summary all live in child phase folders.
-    if is_phase_parent "$folder"; then
-        [[ ! -f "$folder/spec.md" ]] && missing+=("spec.md")
-
-        if [[ ${#missing[@]} -eq 0 ]]; then
-            RULE_STATUS="pass"
-            RULE_MESSAGE="Phase parent: spec.md present (lean trio policy)"
-        else
-            RULE_STATUS="fail"
-            RULE_MESSAGE="Phase parent: missing 1 required file"
-            RULE_DETAILS=("${missing[@]}")
-            RULE_REMEDIATION="Phase parents require only spec.md. Create it from templates/phase_parent/spec.md"
-        fi
-        return 0
-    fi
-
-    # Level 1 requirements
-    [[ ! -f "$folder/spec.md" ]] && missing+=("spec.md")
-    [[ ! -f "$folder/plan.md" ]] && missing+=("plan.md")
-    [[ ! -f "$folder/tasks.md" ]] && missing+=("tasks.md")
-    
-    # Implementation-summary.md required after implementation starts
-    local has_implementation=false
-    if [[ -f "$folder/checklist.md" ]]; then
-        if grep -qE '\[[xX]\]' "$folder/checklist.md" 2>/dev/null; then
-            has_implementation=true
-        fi
-    fi
-    
-    if [[ "$has_implementation" == "true" ]]; then
-        [[ ! -f "$folder/implementation-summary.md" ]] && missing+=("implementation-summary.md (required after implementation)")
-    fi
-    
-    # Level 1: check tasks.md for completion if no checklist
-    if [[ "$numeric_level" -eq 1 ]] && [[ ! -f "$folder/implementation-summary.md" ]]; then
-        if [[ -f "$folder/tasks.md" ]]; then
-            if grep -qE '\[[xX]\]' "$folder/tasks.md" 2>/dev/null; then
-                missing+=("implementation-summary.md (required: tasks show completion)")
-            fi
-        fi
-    fi
-    
-    # Level 2 additions
-    if [[ "$numeric_level" -ge 2 ]]; then
-        [[ ! -f "$folder/checklist.md" ]] && missing+=("checklist.md")
-    fi
-    
-    # Level 3 additions
-    if [[ "$numeric_level" -ge 3 ]]; then
-        [[ ! -f "$folder/decision-record.md" ]] && missing+=("decision-record.md")
-    fi
+    local contract_json
+    contract_json="$(template_contract_for_folder "$manifest_path" "$folder")"
+
+    local required_docs=()
+    mapfile -t required_docs < <(manifest_required_docs "$manifest_path" "$contract_json")
+
+    local entry doc_path owner absence_behavior
+    for entry in "${required_docs[@]-}"; do
+        IFS=$'\t' read -r doc_path owner absence_behavior <<< "$entry"
+        [[ -z "$doc_path" ]] && continue
+        [[ "$absence_behavior" == "silent-skip" ]] && continue
+        if [[ ! -f "$folder/$doc_path" ]]; then
+            if [[ "$absence_behavior" == "warn" ]]; then
+                RULE_STATUS="warn"
+                RULE_DETAILS+=("$doc_path (optional warning; owner=$owner)")
+            else
+                missing+=("$doc_path")
+            fi
+        fi
+    done
@@ -97,13 +79,17 @@ run_check() {
     if [[ ${#missing[@]} -eq 0 ]]; then
-        RULE_STATUS="pass"
-        RULE_MESSAGE="All required files present for Level $level"
+        if [[ "$RULE_STATUS" == "warn" ]]; then
+            RULE_MESSAGE="${#RULE_DETAILS[@]} optional manifest file warning(s)"
+            RULE_REMEDIATION="Create optional manifest-declared files only when the owning command or workflow requires them"
+        else
+            RULE_STATUS="pass"
+            RULE_MESSAGE="All required files present for manifest contract"
+        fi
     else
         RULE_STATUS="fail"
         RULE_MESSAGE="Missing ${#missing[@]} required file(s)"
         RULE_DETAILS=("${missing[@]}")
         local missing_list
         missing_list=$(IFS=', '; echo "${missing[*]}")
-        RULE_REMEDIATION="Create missing files: $missing_list. Use templates from .opencode/skill/system-spec-kit/templates/"
+        RULE_REMEDIATION="Create missing files: $missing_list. Use the active manifest preset templates."
     fi
 }
```

### Diff: check-sections.sh

Current integration point: `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` checks fixed section names by level. Manifest `sectionProfiles[].requiredAnchors` should replace the hardcoded array.

```diff
--- .opencode/skill/system-spec-kit/scripts/rules/check-sections.sh
+++ .opencode/skill/system-spec-kit/scripts/rules/check-sections.sh
@@ -7,6 +7,7 @@
 set -euo pipefail
+source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/lib/template-utils.sh"
@@ -31,18 +32,14 @@ run_check() {
     local -a missing=()
-    # T501 FIX: Strip non-numeric suffix (e.g. "3+" -> "3") for arithmetic comparisons
-    local numeric_level="${level//[^0-9]/}"
+    local manifest_path="$REPO_ROOT/.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json"
@@ -39,13 +36,12 @@ run_check() {
-    local -a file_sections=(
-        "spec.md:Problem Statement,Requirements,Scope"
-        "plan.md:Technical Context,Architecture,Implementation"
-    )
-    
-    [[ "$numeric_level" -ge 2 ]] && file_sections+=("checklist.md:Verification Protocol,Code Quality")
-    [[ "$numeric_level" -ge 3 ]] && file_sections+=("decision-record.md:Context,Decision,Consequences")
+    local contract_json
+    contract_json="$(template_contract_for_folder "$manifest_path" "$folder")"
+
+    local -a file_sections=()
+    mapfile -t file_sections < <(manifest_required_sections "$manifest_path" "$contract_json")
@@ -54,8 +50,7 @@ run_check() {
         local headers
-        headers=$(grep -E '^#{1,3} ' "$filepath" 2>/dev/null | sed 's/^#* //' || true)
+        headers=$(render_active_inline_gates "$filepath" "$contract_json" | grep -E '^#{1,3} ' | sed 's/^#* //' || true)
```

### Diff: check-template-headers.sh

Current integration point: `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` calls `template-structure.js compare "$level"` and always checks the same six docs. The manifest contract should choose active authored docs and the helper should compare against post-gate templates.

```diff
--- .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh
+++ .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh
@@ -7,6 +7,7 @@
 set -euo pipefail
+source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/lib/template-utils.sh"
@@ -33,6 +34,10 @@ run_check() {
     local rule_dir
     rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
     local helper_script="$rule_dir/../utils/template-structure.js"
+    local manifest_path="$REPO_ROOT/.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json"
+    local contract_json
+    contract_json="$(template_contract_for_folder "$manifest_path" "$folder")"
@@ -59,7 +64,7 @@ run_check() {
         local compare_output
-        compare_output=$(node "$helper_script" compare "$level" "$(basename "$file")" "$file" headers 2>/dev/null || true)
+        compare_output=$(node "$helper_script" compare-manifest "$manifest_path" "$contract_json" "$(basename "$file")" "$file" headers 2>/dev/null || true)
         if ! grep -q $'^supported\ttrue$' <<< "$compare_output"; then
             return
@@ -145,12 +150,11 @@ run_check() {
-    compare_headers "$folder/spec.md" "spec.md"
-    compare_headers "$folder/plan.md" "plan.md"
-    compare_headers "$folder/tasks.md" "tasks.md"
-    compare_headers "$folder/checklist.md" "checklist.md"
-    compare_headers "$folder/decision-record.md" "decision-record.md"
-    compare_headers "$folder/implementation-summary.md" "implementation-summary.md"
+    while IFS=$'\t' read -r doc_path owner absence_behavior; do
+        [[ "$owner" != "author" ]] && continue
+        [[ "$absence_behavior" == "silent-skip" ]] && continue
+        compare_headers "$folder/$doc_path" "$doc_path"
+    done < <(manifest_required_docs "$manifest_path" "$contract_json")
```

Integration note: `template-structure.js compare-manifest` is outside this iteration's named source-file set, but the shell diff is concrete about the boundary. Iteration 8 should include that helper in the dry-run path.

### Diff: check-section-counts.sh

Current integration point: `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` extracts level from `spec.md`, maps levels to count thresholds, and repeats file-existence checks. The manifest should provide merged `minimumCounts` from active section profiles.

```diff
--- .opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh
+++ .opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh
@@ -7,26 +7,13 @@
 set -euo pipefail
+source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/lib/template-utils.sh"
@@ -18,17 +18,6 @@
-# Extract level from spec.md
-_section_get_declared_level() {
-    local folder="$1"
-    local spec_file="$folder/spec.md"
-    if [[ -f "$spec_file" ]]; then
-        local level_line
-        level_line=$(grep -E "^\- \*\*Level\*\*:" "$spec_file" 2>/dev/null || true)
-        if [[ -n "$level_line" ]]; then
-            echo "$level_line" | head -1 | sed 's/.*Level.*: *//' | tr -d '[:space:]' | sed 's/\[.*\]//' | head -c 2
-        fi
-    fi
-}
-
@@ -104,9 +91,9 @@ run_check() {
     local warnings=()
     local errors=()
+    local manifest_path="$REPO_ROOT/.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json"
+    local contract_json counts_json
+    contract_json="$(template_contract_for_folder "$manifest_path" "$folder")"
+    counts_json="$(manifest_minimum_counts "$manifest_path" "$contract_json")"
 
-    # Get declared level from spec.md (fallback to passed level)
-    local declared_level
-    declared_level=$(_section_get_declared_level "$folder")
-    if [[ -z "$declared_level" ]]; then
-        declared_level="$level"
-    fi
@@ -121,64 +108,23 @@ run_check() {
     # Define minimum section expectations per level
     local min_spec_h2 min_plan_h2 min_requirements min_scenarios
-    case "$declared_level" in
-        1)
-            min_spec_h2=5
-            min_plan_h2=4
-            min_requirements=3
-            min_scenarios=2
-            ;;
-        2)
-            # Level 2 template has 6 required sections + 1 questions section = 7 H2 minimum.
-            # The 3 optional L2 sections (NFR, EDGE CASES, COMPLEXITY ASSESSMENT) may be
-            # legitimately absent; template-structural compliance is enforced by TEMPLATE_HEADERS.
-            min_spec_h2=7
-            min_plan_h2=6
-            min_requirements=5
-            min_scenarios=4
-            ;;
-        3|3+)
-            min_spec_h2=10
-            min_plan_h2=8
-            min_requirements=8
-            min_scenarios=6
-            ;;
-        *)
-            min_spec_h2=5
-            min_plan_h2=4
-            min_requirements=3
-            min_scenarios=2
-            ;;
-    esac
+    min_spec_h2="$(json_number "$counts_json" "h2ByFile.spec.md" 0)"
+    min_plan_h2="$(json_number "$counts_json" "h2ByFile.plan.md" 0)"
+    min_requirements="$(json_number "$counts_json" "requirements" 0)"
+    min_scenarios="$(json_number "$counts_json" "acceptanceScenarios" 0)"
@@ -154,31 +100,18 @@ run_check() {
     if [[ "$spec_h2" -lt "$min_spec_h2" ]]; then
-        warnings+=("spec.md has $spec_h2 sections, expected at least $min_spec_h2 for Level $declared_level")
+        warnings+=("spec.md has $spec_h2 sections, expected at least $min_spec_h2 for active manifest profiles")
     fi
@@ -159,7 +92,7 @@ run_check() {
     if [[ "$plan_h2" -lt "$min_plan_h2" ]]; then
-        warnings+=("plan.md has $plan_h2 sections, expected at least $min_plan_h2 for Level $declared_level")
+        warnings+=("plan.md has $plan_h2 sections, expected at least $min_plan_h2 for active manifest profiles")
     fi
@@ -164,21 +97,11 @@ run_check() {
     if [[ "$requirements" -lt "$min_requirements" ]]; then
-        warnings+=("Found $requirements requirements, expected at least $min_requirements for Level $declared_level")
+        warnings+=("Found $requirements requirements, expected at least $min_requirements for active manifest profiles")
     fi
@@ -169,18 +92,8 @@ run_check() {
     if [[ "$scenarios" -lt "$min_scenarios" ]]; then
-        warnings+=("Found $scenarios acceptance scenarios, expected at least $min_scenarios for Level $declared_level")
-    fi
-
-    # Check for required files at each level
-    if [[ "$declared_level" = "2" ]] || [[ "$declared_level" = "3" ]] || [[ "$declared_level" = "3+" ]]; then
-        if [[ ! -f "$folder/checklist.md" ]]; then
-            errors+=("Level $declared_level requires checklist.md")
-        fi
-    fi
-
-    if [[ "$declared_level" = "3" ]] || [[ "$declared_level" = "3+" ]]; then
-        if [[ ! -f "$folder/decision-record.md" ]]; then
-            warnings+=("Level $declared_level should include decision-record.md")
-        fi
+        warnings+=("Found $scenarios acceptance scenarios, expected at least $min_scenarios for active manifest profiles")
     fi
@@ -200,12 +113,12 @@ run_check() {
-        RULE_MESSAGE="Section counts below expectations for Level $declared_level"
+        RULE_MESSAGE="Section counts below active manifest profile expectations"
         RULE_DETAILS=("${warnings[@]}")
-        RULE_REMEDIATION="Expand spec content or reduce declared level"
+        RULE_REMEDIATION="Expand spec content or choose a lighter manifest preset"
     else
         RULE_STATUS="pass"
-        RULE_MESSAGE="Section counts appropriate for Level $declared_level"
+        RULE_MESSAGE="Section counts appropriate for active manifest profiles"
     fi
```

### Diff: template-utils.sh

Current integration point: `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` only resolves level folders and copies with `cp`. This is the natural shell boundary for manifest resolution until the TypeScript manifest-loader is wired.

```diff
--- .opencode/skill/system-spec-kit/scripts/lib/template-utils.sh
+++ .opencode/skill/system-spec-kit/scripts/lib/template-utils.sh
@@ -9,7 +9,9 @@
-# Get_level_templates_dir()  - Resolve template directory for a given level
-# Copy_template()            - Copy template file with level-specific fallback
+# get_level_templates_dir()  - Resolve template directory for a given legacy level
+# copy_template()            - Copy template file with legacy fallback
+# scaffold_from_manifest()   - Copy active author-owned docs from spec-kit-docs.json
@@ -85,6 +87,200 @@ copy_template() {
 }
+
+legacy_level_to_preset() {
+    local level="$1"
+    case "$level" in
+        1) printf '%s\n' "simple-change" ;;
+        2) printf '%s\n' "validated-change" ;;
+        3) printf '%s\n' "arch-change" ;;
+        "3+") printf '%s\n' "governed-change" ;;
+        *)
+            echo "Error: --level must be 1, 2, 3, or 3+ (got: $level)" >&2
+            return 1
+            ;;
+    esac
+}
+
+template_contract_for_preset() {
+    local manifest_path="$1"
+    local preset_name="$2"
+    node --input-type=module - "$manifest_path" "$preset_name" <<'NODE'
+import fs from 'node:fs';
+const [manifestPath, presetName] = process.argv.slice(2);
+const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
+const resolvePreset = (name) => {
+  const exact = manifest.presets.find((preset) => `${preset.namespace ?? 'core'}:${preset.name}` === name);
+  if (exact) return exact;
+  const matches = manifest.presets.filter((preset) => preset.name === name);
+  if (matches.length === 1) return matches[0];
+  if (matches.length > 1) throw new Error(`Ambiguous preset: ${name}`);
+  throw new Error(`Unknown preset: ${name}`);
+};
+const byId = (items, id, type) => {
+  const found = items.find((item) => item.id === id);
+  if (!found) throw new Error(`Unknown ${type}: ${id}`);
+  return found;
+};
+const preset = resolvePreset(presetName);
+const kind = byId(manifest.kinds, preset.kind, 'kind');
+const capabilities = (preset.capabilities ?? []).map((id) => byId(manifest.capabilities, id, 'capability'));
+for (const capability of capabilities) {
+  if (capability.supportsKinds && !capability.supportsKinds.includes(kind.id)) {
+    throw new Error(`Capability ${capability.id} does not support kind ${kind.id}`);
+  }
+  for (const conflict of capability.conflictsWith ?? []) {
+    if (capabilities.some((candidate) => candidate.id === conflict)) {
+      throw new Error(`Capability ${capability.id} conflicts with ${conflict}`);
+    }
+  }
+}
+const requiredDocs = new Set([...(kind.requiredCoreDocs ?? []), ...(kind.requiredRuntimeDocs ?? [])]);
+for (const capability of capabilities) {
+  for (const doc of capability.addsAuthoredDocs ?? []) requiredDocs.add(doc);
+}
+const sectionProfiles = new Set([...(kind.defaultSectionProfiles ?? [])]);
+for (const capability of capabilities) {
+  for (const profile of capability.addsSectionProfiles ?? []) sectionProfiles.add(profile);
+}
+const validationRules = new Set([...(kind.defaultValidationRules ?? [])]);
+for (const capability of capabilities) {
+  for (const rule of capability.addsValidationRules ?? []) validationRules.add(rule);
+}
+console.log(JSON.stringify({
+  manifestVersion: manifest.manifestVersion,
+  preset: `${preset.namespace ?? 'core'}:${preset.name}`,
+  kind: kind.id,
+  capabilities: capabilities.map((capability) => capability.id),
+  requiredDocs: [...requiredDocs],
+  sectionProfiles: [...sectionProfiles],
+  validationRules: [...validationRules],
+}));
+NODE
+}
+
+template_contract_for_folder() {
+    local manifest_path="$1"
+    local folder="$2"
+    if [[ -f "$folder/graph-metadata.json" ]]; then
+        local existing
+        existing=$(node -e "const fs=require('fs');const p=process.argv[1];const m=JSON.parse(fs.readFileSync(p,'utf8'));if(m.derived&&m.derived.template_contract) console.log(JSON.stringify(m.derived.template_contract));" "$folder/graph-metadata.json" 2>/dev/null || true)
+        if [[ -n "$existing" ]]; then
+            printf '%s\n' "$existing"
+            return 0
+        fi
+    fi
+    if is_phase_parent "$folder"; then
+        template_contract_for_preset "$manifest_path" "phase-parent"
+    else
+        template_contract_for_preset "$manifest_path" "simple-change"
+    fi
+}
+
+template_contract_docs_json() {
+    local contract_json="$1"
+    local mode="${2:-sourceDocs}"
+    node -e "const c=JSON.parse(process.argv[1]); const docs=(c.requiredDocs||[]).filter((d)=>d.endsWith('.md')); console.log(JSON.stringify(docs));" "$contract_json" "$mode"
+}
+
+manifest_required_docs() {
+    local manifest_path="$1"
+    local contract_json="$2"
+    node --input-type=module - "$manifest_path" "$contract_json" <<'NODE'
+import fs from 'node:fs';
+const [manifestPath, contractRaw] = process.argv.slice(2);
+const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
+const contract = JSON.parse(contractRaw);
+const docByPath = new Map((manifest.docTemplates ?? []).map((doc) => [doc.path, doc]));
+for (const docPath of contract.requiredDocs ?? []) {
+  const doc = docByPath.get(docPath) ?? {};
+  console.log(`${docPath}\t${doc.owner ?? 'author'}\t${doc.absenceBehavior ?? 'hard-error'}`);
+}
+NODE
+}
+
+manifest_required_sections() {
+    local manifest_path="$1"
+    local contract_json="$2"
+    node --input-type=module - "$manifest_path" "$contract_json" <<'NODE'
+import fs from 'node:fs';
+const [manifestPath, contractRaw] = process.argv.slice(2);
+const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
+const contract = JSON.parse(contractRaw);
+const profiles = new Map((manifest.sectionProfiles ?? []).map((profile) => [profile.id, profile]));
+const byFile = new Map();
+for (const profileId of contract.sectionProfiles ?? []) {
+  const profile = profiles.get(profileId);
+  if (!profile) continue;
+  for (const docPath of profile.appliesTo ?? []) {
+    const anchors = byFile.get(docPath) ?? new Set();
+    for (const anchor of profile.requiredAnchors ?? []) anchors.add(anchor);
+    byFile.set(docPath, anchors);
+  }
+}
+for (const [docPath, anchors] of byFile) {
+  console.log(`${docPath}:${[...anchors].join(',')}`);
+}
+NODE
+}
+
+manifest_minimum_counts() {
+    local manifest_path="$1"
+    local contract_json="$2"
+    node --input-type=module - "$manifest_path" "$contract_json" <<'NODE'
+import fs from 'node:fs';
+const [manifestPath, contractRaw] = process.argv.slice(2);
+const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
+const contract = JSON.parse(contractRaw);
+const profiles = new Map((manifest.sectionProfiles ?? []).map((profile) => [profile.id, profile]));
+const merged = { h2ByFile: {}, requirements: 0, acceptanceScenarios: 0 };
+for (const profileId of contract.sectionProfiles ?? []) {
+  const counts = profiles.get(profileId)?.minimumCounts;
+  if (!counts) continue;
+  for (const [file, value] of Object.entries(counts.h2ByFile ?? {})) {
+    merged.h2ByFile[file] = Math.max(merged.h2ByFile[file] ?? 0, value);
+  }
+  merged.requirements = Math.max(merged.requirements, counts.requirements ?? 0);
+  merged.acceptanceScenarios = Math.max(merged.acceptanceScenarios, counts.acceptanceScenarios ?? 0);
+}
+console.log(JSON.stringify(merged));
+NODE
+}
+
+json_number() {
+    local json="$1"
+    local dotted_path="$2"
+    local fallback="${3:-0}"
+    node -e "const obj=JSON.parse(process.argv[1]); const parts=process.argv[2].split('.'); let cur=obj; for (const part of parts) cur=cur?.[part]; console.log(Number.isFinite(cur) ? cur : process.argv[3]);" "$json" "$dotted_path" "$fallback"
+}
+
+render_active_inline_gates() {
+    local markdown_path="$1"
+    local contract_json="$2"
+    node --input-type=module - "$markdown_path" "$contract_json" <<'NODE'
+import fs from 'node:fs';
+const [markdownPath, contractRaw] = process.argv.slice(2);
+const contract = JSON.parse(contractRaw);
+const active = new Set([`kind:${contract.kind}`, `preset:${contract.preset}`, ...(contract.capabilities ?? []).map((cap) => `capability:${cap}`)]);
+const input = fs.readFileSync(markdownPath, 'utf8');
+const output = input.replace(/<!-- IF ([^>]+) -->([\s\S]*?)<!-- \/IF -->/g, (_match, expr, body) => {
+  const atoms = expr.split(/\s+OR\s+/).map((part) => part.trim());
+  return atoms.some((atom) => active.has(atom)) ? body : '';
+});
+process.stdout.write(output);
+NODE
+}
+
+scaffold_from_manifest() {
+    local manifest_path="$1"
+    local preset_name="$2"
+    local target_dir="$3"
+    local feature_description="${4:-}"
+    local manifest_dir
+    manifest_dir="$(dirname "$manifest_path")"
+
+    mkdir -p "$target_dir"
+    local contract_json
+    contract_json="$(template_contract_for_preset "$manifest_path" "$preset_name")"
+
+    while IFS=$'\t' read -r doc_path template_file owner absence_behavior; do
+        [[ "$owner" != "author" ]] && continue
+        [[ "$absence_behavior" == "silent-skip" ]] && continue
+        mkdir -p "$target_dir/$(dirname "$doc_path")"
+        render_active_inline_gates "$manifest_dir/$template_file" "$contract_json" > "$target_dir/$doc_path"
+        printf '%s\n' "$doc_path"
+    done < <(node --input-type=module - "$manifest_path" "$contract_json" <<'NODE'
+import fs from 'node:fs';
+const [manifestPath, contractRaw] = process.argv.slice(2);
+const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
+const contract = JSON.parse(contractRaw);
+const docByPath = new Map((manifest.docTemplates ?? []).map((doc) => [doc.path, doc]));
+for (const docPath of contract.requiredDocs ?? []) {
+  const doc = docByPath.get(docPath);
+  if (!doc || !doc.templateFile) continue;
+  console.log(`${docPath}\t${doc.templateFile}\t${doc.owner ?? 'author'}\t${doc.absenceBehavior ?? 'hard-error'}`);
+}
+NODE
+)
+}
+
+preset_supports_feature() {
+    local manifest_path="$1"
+    local preset_name="$2"
+    local feature="$3"
+    template_contract_for_preset "$manifest_path" "$preset_name" | node -e "const c=JSON.parse(require('fs').readFileSync(0,'utf8')); process.exit((c.validationRules||[]).includes(process.argv[1]) ? 0 : 1);" "$feature"
+}
+
+print_template_contract_summary() {
+    local manifest_path="$1"
+    local preset_name="$2"
+    template_contract_for_preset "$manifest_path" "$preset_name" | node -e "const c=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log('kind: '+c.kind); console.log('capabilities: '+(c.capabilities.length ? c.capabilities.join(', ') : '(none)')); console.log('docs: '+c.requiredDocs.join(', '));"
+}
```

### JSON Naming Decisions

The existing project metadata is mixed:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/description.json` uses camelCase keys: `specFolder`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/graph-metadata.json` uses snake_case keys: `schema_version`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `trigger_phrases`, `key_topics`, `importance_tier`, `key_files`, `causal_summary`, `created_at`, `last_save_at`, `source_docs`.

Decision: manifest schema uses camelCase because its closest peer is the existing TypeScript-facing `description.json` style and iteration-004 schema already used camelCase for manifest concepts. Packet graph metadata stores the resolved snapshot under snake_case to match the file it lives in.

Chosen manifest spellings:

- `manifestVersion`, not `schemaVersion`.
- `templateContract` in manifest-facing docs and TypeScript types.
- `template_contract` only inside `graph-metadata.json.derived` to preserve snake_case in that file.
- `directories`, not `dirs`.
- `supportsKinds`, not `supported_kinds`.
- `conflictsWith`, not `conflicts_with`.
- Presets stay inside `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json` under `presets[]`.
- Presets get `namespace`, defaulting to `core`; canonical identity is `core:simple-change`.

Reasoning:

- `manifestVersion` separates data-contract SemVer from JSON Schema `$schema` and future schema `$id` values.
- Keeping presets inside `spec-kit-docs.json` preserves one schema-validated source of truth. A separate `presets.json` would create a second lifecycle and versioning surface for what is conceptually only a named `kind + capabilities` bundle.
- The graph metadata snapshot should be named `template_contract` because that file is already snake_case. This is the one intentional bridge spelling.

## Questions Answered

- Concrete integration diffs are now available for all six requested files.
- `create.sh` should replace level-driven scaffold selection with `--preset` and a manifest path at `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- `check-files.sh` should use `graph-metadata.json.derived.template_contract` when present, with fallback preset resolution.
- `check-sections.sh` should validate active post-gate required anchors from section profiles.
- `check-template-headers.sh` should call a manifest-aware helper command, `compare-manifest`, rather than `compare "$level"`.
- `check-section-counts.sh` should consume merged `minimumCounts` and stop duplicating file-existence validation.
- `template-utils.sh` is the shell integration point for manifest helpers until the TypeScript manifest loader becomes the canonical shared implementation.
- JSON naming is settled: manifest camelCase, graph-metadata snake_case, with `manifestVersion` and nested `presets[]`.

## Questions Remaining

- The proposed shell helper embeds Node snippets as an integration bridge. The final implementation should decide whether those snippets are temporary or replaced immediately by `.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts` plus compiled JS.
- `template-structure.js compare-manifest` remains a necessary follow-up diff because `check-template-headers.sh` depends on it.
- `generate-description.js` and graph metadata generation should eventually converge so `description.json` and `graph-metadata.json` receive one coherent template-contract snapshot in the same command path.
- The proposed `render_active_inline_gates` bridge only handles simple `OR` atoms. It is enough to show integration points, but the implementation must use the full iteration-006 EBNF renderer.

## Next Focus

Iteration 8 should do END-TO-END DRY-RUN: scaffold a hypothetical packet using the manifest and these diffs, walking through each step: resolve preset -> copy templates -> strip gates -> emit metadata -> run validator. Verify every step produces the expected files, active sections, metadata snapshot, and validator outcomes.
