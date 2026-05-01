# Iteration 5: Refactor Plan, Q10 Resolution, and Risk Register

## Focus

REFACTOR PLAN + Q10 RESOLUTION + RISK REGISTER for the C+F hybrid manifest design.

This is the penultimate iteration. It closes the remaining design question around inline section gates versus fragment files, then turns the iteration-004 manifest schema into a concrete implementation map for the current scaffolder and validator files.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-004.md` first to preserve the manifest schema, six presets, and golden-test contract.
- Loaded the `sk-deep-research` workflow instructions to preserve the LEAF iteration contract.
- Read the current level-based scaffold path in `.opencode/skill/system-spec-kit/scripts/spec/create.sh`.
- Read the current level-based validator paths in `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`, and `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`.
- Confirmed `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` exists and still carries a hardcoded spec-doc basename set.
- Listed the current `.opencode/skill/system-spec-kit/templates/` tree to produce a concrete legacy deletion list.

## Findings

### Refactor Plan - File-by-File Changes

#### `.opencode/skill/system-spec-kit/scripts/spec/create.sh`

Current behavior:

- Parses `--level` into `DOC_LEVEL`.
- Resolves `LEVEL_TEMPLATES_DIR` through `get_level_templates_dir`.
- Copies every Markdown file from `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, or `.opencode/skill/system-spec-kit/templates/level_3+`.
- Special-cases phase parents through `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md`.
- Emits `description.json` after copying templates and emits `graph-metadata.json` before the final template set is known.

Required change:

- Replace `--level` with `--preset`, defaulting to `simple-change`.
- Resolve `preset -> kind + capabilities` from `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- Scaffold only author-owned docs from `kind.requiredCoreDocs + capabilities[].addsAuthoredDocs`.
- Generate runtime docs from `kind.requiredRuntimeDocs`, specifically `description.json` and `graph-metadata.json`.
- Record the resolved template contract in generated metadata: `templatePreset`, `templateKind`, and `templateCapabilities`.
- In phase mode, scaffold the parent through preset `phase-parent`; child phases default to preset `simple-change` unless a later command surface explicitly adds a child-preset flag.
- Remove `DOC_LEVEL_NUM`, `LEVEL_TEMPLATES_DIR`, and all output text that says `DOC_LEVEL`.

Before, relevant lines from current normal mode:

```bash
DOC_LEVEL=1

case "$arg" in
  --level)
    i=$((i + 1))
    next_arg="${!i}"
    if [[ ! "$next_arg" =~ ^(1|2|3|3\+)$ ]]; then
      echo 'Error: --level must be 1, 2, 3, or 3+' >&2
      exit 1
    fi
    DOC_LEVEL="$next_arg"
    ;;
esac

TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
CREATED_FILES=()

mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"
touch "$FEATURE_DIR/scratch/.gitkeep"
create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"

for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
  if [[ -f "$template_file" ]]; then
    template_name=$(basename "$template_file")
    CREATED_FILES+=("$(copy_template "$template_name" "$FEATURE_DIR" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
  fi
done

if node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" --description "$FEATURE_DESCRIPTION"; then
  CREATED_FILES+=("description.json")
fi
```

After, manifest-driven pseudo-code:

```bash
PRESET="simple-change"

case "$arg" in
  --preset)
    i=$((i + 1))
    next_arg="${!i}"
    [[ -z "$next_arg" || "$next_arg" == --* ]] && {
      echo 'Error: --preset requires a value' >&2
      exit 1
    }
    PRESET="$next_arg"
    ;;
esac

TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
MANIFEST_PATH="$TEMPLATES_BASE/manifest/spec-kit-docs.json"
CREATED_FILES=()

mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"
touch "$FEATURE_DIR/scratch/.gitkeep"

mapfile -t CREATED_FILES < <(
  scaffold_from_manifest "$MANIFEST_PATH" "$PRESET" "$FEATURE_DIR" "$FEATURE_DESCRIPTION"
)

create_description_file \
  "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" "$FEATURE_DESCRIPTION" "$PRESET"

create_graph_metadata_file \
  "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned" "$PRESET"

CREATED_FILES+=("description.json" "graph-metadata.json")
```

The phase-parent block should shrink. Today it manually renders `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` and then separately creates children from Level 1. After the refactor, phase mode should call `scaffold_from_manifest "$MANIFEST_PATH" "phase-parent" "$FEATURE_DIR" "$FEATURE_DESCRIPTION"` for the parent and `scaffold_from_manifest "$MANIFEST_PATH" "simple-change" "$_child_path" "$FEATURE_DESCRIPTION"` for each child before injecting phase rows/back-references.

#### `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`

Add one shell entry point that the scaffolder can call from normal, subfolder, and phase-child paths.

Function sketch:

```bash
scaffold_from_manifest() {
  local manifest_path="$1"
  local preset_name="$2"
  local target_dir="$3"
  local feature_description="${4:-}"

  [[ -f "$manifest_path" ]] || {
    echo "Error: manifest not found: $manifest_path" >&2
    return 1
  }

  mkdir -p "$target_dir"

  node --input-type=module - "$manifest_path" "$preset_name" <<'NODE' |
import fs from 'node:fs';
import path from 'node:path';
const [manifestPath, presetName] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const preset = manifest.presets.find((item) => item.name === presetName);
if (!preset) throw new Error(`Unknown preset: ${presetName}`);
const kind = manifest.kinds.find((item) => item.id === preset.kind);
const caps = preset.capabilities.map((id) => manifest.capabilities.find((item) => item.id === id));
const authored = new Set([...(kind.requiredCoreDocs || []), ...caps.flatMap((cap) => cap.addsAuthoredDocs || [])]);
for (const docPath of authored) {
  const doc = manifest.docTemplates.find((item) => item.path === docPath);
  if (doc && doc.owner === 'author' && doc.absenceBehavior !== 'silent-skip') {
    console.log(`${doc.path}\t${doc.templateFile}`);
  }
}
NODE
  while IFS=$'\t' read -r doc_path template_file; do
    local source_path
    source_path="$(dirname "$manifest_path")/$(basename "$template_file")"
    mkdir -p "$target_dir/$(dirname "$doc_path")"
    render_template_with_inline_gates "$source_path" "$target_dir/$doc_path" "$preset_name" "$feature_description"
    printf '%s\n' "$doc_path"
  done
}
```

This function intentionally emits only created author-doc paths on stdout. Runtime metadata remains the responsibility of `create.sh`, because it already owns branch naming, packet IDs, parent-child links, and generated timestamps.

#### `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`

Current behavior:

- Early-branches phase parents.
- Requires `spec.md`, `plan.md`, and `tasks.md`.
- Requires `implementation-summary.md` only after checklist/tasks imply work started.
- Adds `checklist.md` for numeric level >= 2.
- Adds `decision-record.md` for numeric level >= 3.

Required change:

- Remove numeric-level parsing.
- Infer the packet template contract from `graph-metadata.json.derived.templatePreset`, `graph-metadata.json.derived.templateKind`, and `graph-metadata.json.derived.templateCapabilities`, with a fallback of preset `simple-change` when metadata is missing in a greenfield packet created before the metadata write completed.
- Load `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- Required docs are `kind.requiredCoreDocs + kind.requiredRuntimeDocs + capabilities[].addsAuthoredDocs`.
- For each candidate doc, look up `docTemplates[path]`.
- If `absenceBehavior=silent-skip`, do not fail when absent. This covers command-owned-lazy, agent-owned-lazy, and workflow-owned-packet docs such as `handover.md`, `debug-delegation.md`, and `research/research.md`.
- If `owner=author` and `absenceBehavior=hard-error`, fail when absent.
- If `owner=command`, `owner=agent`, or `owner=workflow`, fail only when the manifest says `absenceBehavior=hard-error`; otherwise skip.

Before, requirements lookup:

```bash
missing=()
numeric_level="${level//[^0-9]/}"

if is_phase_parent "$folder"; then
  [[ ! -f "$folder/spec.md" ]] && missing+=("spec.md")
  return 0
fi

[[ ! -f "$folder/spec.md" ]] && missing+=("spec.md")
[[ ! -f "$folder/plan.md" ]] && missing+=("plan.md")
[[ ! -f "$folder/tasks.md" ]] && missing+=("tasks.md")

if [[ "$has_implementation" == "true" ]]; then
  [[ ! -f "$folder/implementation-summary.md" ]] && missing+=("implementation-summary.md")
fi

if [[ "$numeric_level" -ge 2 ]]; then
  [[ ! -f "$folder/checklist.md" ]] && missing+=("checklist.md")
fi

if [[ "$numeric_level" -ge 3 ]]; then
  [[ ! -f "$folder/decision-record.md" ]] && missing+=("decision-record.md")
fi
```

After, manifest-driven requirements lookup:

```bash
missing=()
manifest_path="$REPO_ROOT/.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json"
contract_json="$(_template_contract_for_folder "$manifest_path" "$folder")"

mapfile -t required_docs < <(
  node --input-type=module - "$manifest_path" "$contract_json" <<'NODE'
const fs = await import('node:fs');
const [manifestPath, contractRaw] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const contract = JSON.parse(contractRaw);
const kind = manifest.kinds.find((item) => item.id === contract.kind);
const caps = contract.capabilities.map((id) => manifest.capabilities.find((item) => item.id === id));
const paths = new Set([...(kind.requiredCoreDocs || []), ...(kind.requiredRuntimeDocs || [])]);
for (const cap of caps) for (const doc of cap.addsAuthoredDocs || []) paths.add(doc);
for (const docPath of paths) {
  const doc = manifest.docTemplates.find((item) => item.path === docPath);
  const absence = doc?.absenceBehavior ?? 'hard-error';
  const owner = doc?.owner ?? 'generated';
  console.log(`${docPath}\t${owner}\t${absence}`);
}
NODE
)

for entry in "${required_docs[@]-}"; do
  IFS=$'\t' read -r doc_path owner absence_behavior <<< "$entry"
  [[ "$absence_behavior" == "silent-skip" ]] && continue
  [[ ! -f "$folder/$doc_path" ]] && missing+=("$doc_path")
done
```

`implementation-summary.md` should no longer be conditional after implementation starts. Iteration 1 and iteration 4 established it as an authored core doc for implementation/investigation packets, so the manifest should require it for those kinds from creation time.

#### `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`

Current behavior:

- Hardcodes `spec.md:Problem Statement,Requirements,Scope`.
- Hardcodes `plan.md:Technical Context,Architecture,Implementation`.
- Adds `checklist.md:Verification Protocol,Code Quality` for numeric level >= 2.
- Adds `decision-record.md:Context,Decision,Consequences` for numeric level >= 3.

Required change:

- Replace `file_sections=(...)` with active section profiles:
  - `kind.defaultSectionProfiles`
  - `capabilities[].addsSectionProfiles`
- Each `sectionProfile` already has `appliesTo` and `requiredAnchors`.
- For Q10 inline gates, profiles are enabled by rendering gated blocks inside the same template file; validators should check anchors after rendering, not inspect separate fragments.
- Section profile schema needs one small iteration-005 extension: add optional `minimumCounts` for `check-section-counts.sh`. Without this field, count checks would either keep hidden level math or duplicate section profile semantics elsewhere.

Manifest schema extension:

```json
{
  "sectionProfile": {
    "required": ["id", "appliesTo", "requiredAnchors"],
    "properties": {
      "id": { "$ref": "#/$defs/id" },
      "appliesTo": { "type": "array", "items": { "$ref": "#/$defs/docPath" } },
      "requiredAnchors": { "type": "array", "items": { "type": "string", "minLength": 1 } },
      "minimumCounts": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "h2ByFile": { "type": "object", "additionalProperties": { "type": "integer", "minimum": 0 } },
          "requirements": { "type": "integer", "minimum": 0 },
          "acceptanceScenarios": { "type": "integer", "minimum": 0 }
        }
      }
    }
  }
}
```

#### `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`

Current behavior:

- Extracts a declared level from `spec.md`.
- Uses a `case "$declared_level"` matrix to set `min_spec_h2`, `min_plan_h2`, `min_requirements`, and `min_scenarios`.
- Rechecks level-derived file requirements for `checklist.md` and `decision-record.md`.

Required change:

- Remove `_section_get_declared_level`.
- Remove the `case "$declared_level"` matrix.
- Load active section profiles from the manifest.
- Merge `minimumCounts` across all active profiles by taking the maximum value for each counter.
- Stop checking required files in this rule; file existence belongs only in `check-files.sh`.

The new count rule is profile-derived:

```bash
counts_json="$(_active_section_counts "$manifest_path" "$folder")"
min_spec_h2="$(json_get "$counts_json" 'h2ByFile.spec.md' 0)"
min_plan_h2="$(json_get "$counts_json" 'h2ByFile.plan.md' 0)"
min_requirements="$(json_get "$counts_json" 'requirements' 0)"
min_scenarios="$(json_get "$counts_json" 'acceptanceScenarios' 0)"

[[ "$spec_h2" -lt "$min_spec_h2" ]] && warnings+=("spec.md has $spec_h2 sections, expected at least $min_spec_h2")
[[ "$plan_h2" -lt "$min_plan_h2" ]] && warnings+=("plan.md has $plan_h2 sections, expected at least $min_plan_h2")
[[ "$requirements" -lt "$min_requirements" ]] && warnings+=("Found $requirements requirements, expected at least $min_requirements")
[[ "$scenarios" -lt "$min_scenarios" ]] && warnings+=("Found $scenarios acceptance scenarios, expected at least $min_scenarios")
```

#### `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`

Current behavior:

- Calls `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js compare "$level" "$(basename "$file")" "$file" headers`.
- The JS helper has `TEMPLATE_PATHS` hardcoded for Level 1, Level 2, Level 3, and Level 3+.
- The shell script always attempts the same six authored docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.

Required change:

- The shell rule should call the helper with a manifest contract, not a level:
  - `node "$helper_script" compare-manifest "$manifest_path" "$contract_json" "$(basename "$file")" "$file" headers`
- The helper should resolve the expected template through `mcp_server/lib/templates/manifest-loader.ts` or its compiled JS output.
- Inline gates must be evaluated against the active capability set before extracting expected H2 headers.
- The shell loop should compare only manifest-active authored docs, plus generated runtime docs if a runtime doc gains a markdown template in the future.

#### `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`

Although not named in the prompt, this file is the actual header-comparison dependency behind `check-template-headers.sh`.

Required change:

- Delete `TEMPLATE_PATHS`.
- Replace `normalizeLevel(level)` with `normalizeContract(contract)`.
- Add `loadManifestContract(manifestPath, contract)` that returns:
  - active doc templates,
  - active capability IDs,
  - active section profiles,
  - custom allowed anchors from active profiles.
- Add a small inline-gate renderer before `extractH2Headers`:

```js
function renderInlineGates(content, activeCapabilities) {
  return content.replace(
    /<!-- IF capability:([a-z][a-z0-9-]*) -->([\s\S]*?)<!-- \/IF -->/g,
    (_match, capability, body) => activeCapabilities.has(capability) ? body : '',
  );
}
```

#### `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`

Current behavior:

- `SPEC_DOC_BASENAMES` is hardcoded to `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- Optional docs are separately hardcoded as `handover.md`, `research.md`, `research/research.md`, and `resource-map.md`.

Required change:

- Consume the same manifest through a new module at `.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts`.
- Replace hardcoded `SPEC_DOC_BASENAMES` and optional docs with manifest-derived docs:
  - required authored docs for the active kind/capabilities,
  - runtime docs where relevant,
  - lazy docs only if they physically exist or the rule being executed explicitly targets them.
- Export `loadManifest()` and `getRequiredDocs(kind, capabilities)` from the loader and import them here.
- This file should never decide whether `decision-record.md` exists because the level is 3; it should ask the manifest whether capability `architecture-decisions` is active.

#### `.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts`

Add a typed TS loader used by MCP validation and by any JS/TS test harness.

Export sketch:

```ts
export type AbsenceBehavior = 'hard-error' | 'warn' | 'silent-skip';
export type TemplateOwner = 'author' | 'command' | 'agent' | 'workflow';

export interface SpecKitDocsManifest {
  schemaVersion: string;
  kinds: ManifestKind[];
  capabilities: ManifestCapability[];
  docTemplates: ManifestDocTemplate[];
  sectionProfiles: ManifestSectionProfile[];
  presets: ManifestPreset[];
}

export function defaultManifestPath(): string;
export function loadManifest(manifestPath?: string): SpecKitDocsManifest;
export function resolvePreset(manifest: SpecKitDocsManifest, presetName: string): {
  preset: ManifestPreset;
  kind: ManifestKind;
  capabilities: ManifestCapability[];
};
export function getRequiredDocs(
  manifest: SpecKitDocsManifest,
  kindId: string,
  capabilityIds: string[],
): ManifestDocTemplate[];
export function getSectionProfiles(
  manifest: SpecKitDocsManifest,
  kindId: string,
  capabilityIds: string[],
): ManifestSectionProfile[];
export function getScaffoldDocs(
  manifest: SpecKitDocsManifest,
  presetName: string,
): ManifestDocTemplate[];
```

`getRequiredDocs()` should include `kind.requiredCoreDocs`, `kind.requiredRuntimeDocs`, and `capabilities[].addsAuthoredDocs`, then attach each path's `docTemplate` metadata when present. `getScaffoldDocs()` should filter to `owner=author` and `absenceBehavior != silent-skip`.

#### New Manifest Template Inventory

The proposed 15-file source inventory is correct for the greenfield design:

```text
.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json
.opencode/skill/system-spec-kit/templates/manifest/spec.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/tasks.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/implementation-summary.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/decision-record.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/resource-map.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/context-index.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/handover.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/debug-delegation.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/research.md.tmpl
.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh
.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts
```

One caveat: this is the functional source inventory. Existing README, hash, changelog, stress-test, or scratch assets either need deletion, relocation outside `.opencode/skill/system-spec-kit/templates/`, or explicit classification as non-source assets. Leaving them under `templates/` makes "exactly 15 files" false on disk.

#### Concrete Legacy Template Deletion List

Delete these current template-source files after their content is ported into `.opencode/skill/system-spec-kit/templates/manifest/*.tmpl` and covered by golden snapshots:

```text
.opencode/skill/system-spec-kit/templates/.hashes
.opencode/skill/system-spec-kit/templates/README.md
.opencode/skill/system-spec-kit/templates/addendum/README.md
.opencode/skill/system-spec-kit/templates/addendum/level2-verify/checklist.md
.opencode/skill/system-spec-kit/templates/addendum/level2-verify/plan-level2.md
.opencode/skill/system-spec-kit/templates/addendum/level2-verify/spec-level2.md
.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md
.opencode/skill/system-spec-kit/templates/addendum/level3-arch/plan-level3.md
.opencode/skill/system-spec-kit/templates/addendum/level3-arch/spec-level3-guidance.md
.opencode/skill/system-spec-kit/templates/addendum/level3-arch/spec-level3-prefix.md
.opencode/skill/system-spec-kit/templates/addendum/level3-arch/spec-level3-suffix.md
.opencode/skill/system-spec-kit/templates/addendum/level3-arch/spec-level3.md
.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/checklist-extended.md
.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/plan-level3plus.md
.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-guidance.md
.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-suffix.md
.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus.md
.opencode/skill/system-spec-kit/templates/addendum/phase/phase-child-header.md
.opencode/skill/system-spec-kit/templates/addendum/phase/phase-parent-section.md
.opencode/skill/system-spec-kit/templates/changelog/README.md
.opencode/skill/system-spec-kit/templates/changelog/phase.md
.opencode/skill/system-spec-kit/templates/changelog/root.md
.opencode/skill/system-spec-kit/templates/context-index.md
.opencode/skill/system-spec-kit/templates/core/README.md
.opencode/skill/system-spec-kit/templates/core/impl-summary-core.md
.opencode/skill/system-spec-kit/templates/core/plan-core.md
.opencode/skill/system-spec-kit/templates/core/spec-core.md
.opencode/skill/system-spec-kit/templates/core/tasks-core.md
.opencode/skill/system-spec-kit/templates/debug-delegation.md
.opencode/skill/system-spec-kit/templates/examples/README.md
.opencode/skill/system-spec-kit/templates/examples/level_1/implementation-summary.md
.opencode/skill/system-spec-kit/templates/examples/level_1/plan.md
.opencode/skill/system-spec-kit/templates/examples/level_1/spec.md
.opencode/skill/system-spec-kit/templates/examples/level_1/tasks.md
.opencode/skill/system-spec-kit/templates/examples/level_2/checklist.md
.opencode/skill/system-spec-kit/templates/examples/level_2/implementation-summary.md
.opencode/skill/system-spec-kit/templates/examples/level_2/plan.md
.opencode/skill/system-spec-kit/templates/examples/level_2/spec.md
.opencode/skill/system-spec-kit/templates/examples/level_2/tasks.md
.opencode/skill/system-spec-kit/templates/examples/level_3/checklist.md
.opencode/skill/system-spec-kit/templates/examples/level_3/decision-record.md
.opencode/skill/system-spec-kit/templates/examples/level_3/implementation-summary.md
.opencode/skill/system-spec-kit/templates/examples/level_3/plan.md
.opencode/skill/system-spec-kit/templates/examples/level_3/spec.md
.opencode/skill/system-spec-kit/templates/examples/level_3/tasks.md
.opencode/skill/system-spec-kit/templates/examples/level_3+/checklist.md
.opencode/skill/system-spec-kit/templates/examples/level_3+/decision-record.md
.opencode/skill/system-spec-kit/templates/examples/level_3+/implementation-summary.md
.opencode/skill/system-spec-kit/templates/examples/level_3+/plan.md
.opencode/skill/system-spec-kit/templates/examples/level_3+/spec.md
.opencode/skill/system-spec-kit/templates/examples/level_3+/tasks.md
.opencode/skill/system-spec-kit/templates/handover.md
.opencode/skill/system-spec-kit/templates/level_1/README.md
.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md
.opencode/skill/system-spec-kit/templates/level_1/plan.md
.opencode/skill/system-spec-kit/templates/level_1/spec.md
.opencode/skill/system-spec-kit/templates/level_1/tasks.md
.opencode/skill/system-spec-kit/templates/level_2/README.md
.opencode/skill/system-spec-kit/templates/level_2/checklist.md
.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md
.opencode/skill/system-spec-kit/templates/level_2/plan.md
.opencode/skill/system-spec-kit/templates/level_2/spec.md
.opencode/skill/system-spec-kit/templates/level_2/tasks.md
.opencode/skill/system-spec-kit/templates/level_3/README.md
.opencode/skill/system-spec-kit/templates/level_3/checklist.md
.opencode/skill/system-spec-kit/templates/level_3/decision-record.md
.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md
.opencode/skill/system-spec-kit/templates/level_3/plan.md
.opencode/skill/system-spec-kit/templates/level_3/spec.md
.opencode/skill/system-spec-kit/templates/level_3/tasks.md
.opencode/skill/system-spec-kit/templates/level_3+/README.md
.opencode/skill/system-spec-kit/templates/level_3+/checklist.md
.opencode/skill/system-spec-kit/templates/level_3+/decision-record.md
.opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md
.opencode/skill/system-spec-kit/templates/level_3+/plan.md
.opencode/skill/system-spec-kit/templates/level_3+/spec.md
.opencode/skill/system-spec-kit/templates/level_3+/tasks.md
.opencode/skill/system-spec-kit/templates/phase_parent/spec.md
.opencode/skill/system-spec-kit/templates/research.md
.opencode/skill/system-spec-kit/templates/resource-map.md
.opencode/skill/system-spec-kit/templates/scratch/.gitkeep
.opencode/skill/system-spec-kit/templates/scratch/README.md
.opencode/skill/system-spec-kit/templates/stress_test/README.md
.opencode/skill/system-spec-kit/templates/stress_test/findings-rubric.schema.md
.opencode/skill/system-spec-kit/templates/stress_test/findings-rubric.template.json
.opencode/skill/system-spec-kit/templates/stress_test/findings.template.md
```

If stress-test templates are still needed, move them to `.opencode/skill/system-spec-kit/assets/stress_test/` before deleting the old `templates/stress_test/` paths. They are useful assets, but they should not live under the manifest-driven spec-document template root.

### Q10 Decision: Inline Gates vs Fragments

Pick inline gates.

Inline gates keep authoring in one readable template per document, which fits the evidence from iteration 4: section reuse across docs is rare, while `spec.md`, `plan.md`, and `decision-record.md` need capability-specific blocks in-place. Fragment files would make the generator more complex and would reintroduce a mini composition system for sections that mostly do not repeat.

Contract:

```markdown
<!-- IF capability:architecture-decisions -->
## Architecture Decision Context

<!-- ANCHOR:architecture-decisions -->
[YOUR_VALUE_HERE: decision context]
<!-- /ANCHOR:architecture-decisions -->
<!-- /IF -->
```

Generator behavior:

- If the active preset includes `architecture-decisions`, keep the block body and remove the gate comments.
- If it does not, remove the whole gated block.
- Validators compare against the post-gate rendered expected template.

### Risk Register

| Rank | ID | Description | Impact | Likelihood | Mitigation | Owner |
|---:|---|---|---|---|---|---|
| 1 | R-001 | False simplicity: replacing levels with presets can hide a new matrix if every command grows its own preset mapping. | H | M | Make `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json` the only mapping source; reject hardcoded preset maps in code review and golden-test every preset. | Spec Kit maintainer |
| 2 | R-002 | Parser fragility: shell validators and TS validators may parse the manifest differently. | H | M | Put canonical parsing in `.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts`; shell callers either consume its compiled output or use a shared JSON emission contract tested by Vitest. | Validation owner |
| 3 | R-003 | Addon ownership confusion: authors may scaffold command-owned lazy docs like `handover.md` or workflow-owned `research/research.md`. | H | M | Enforce `owner` and `absenceBehavior` in `scaffold_from_manifest()`; golden snapshots must assert lazy docs are declared but not scaffolded. | Scaffolder owner |
| 4 | R-004 | Section-only traits, especially governance, get lost because no file appears in `addsAuthoredDocs`. | H | M | Require every section-only capability to add at least one `sectionProfile` or `addsValidationRules` entry; schema validation fails empty no-op capabilities. | Manifest owner |
| 5 | R-005 | Command-owned-lazy semantics silently mask a genuinely missing author doc if `absenceBehavior` is set too broadly. | H | M | Allow `silent-skip` only for `owner=command`, `owner=agent`, or `owner=workflow`; schema rejects `owner=author` plus `silent-skip` unless explicitly marked optional. | Validation owner |
| 6 | R-006 | Manifest schema evolution breaks existing command code because shell and TS consumers assume exact field names. | M | M | Version the manifest with `schemaVersion`; loader accepts only known versions and emits a clear unsupported-version error before scaffolding. | Spec Kit maintainer |
| 7 | R-007 | Preset sprawl recreates Level 1/2/3 confusion under friendlier names. | M | M | Keep six canonical presets in v1; require a design note and golden snapshot for each added preset; periodically prune aliases that differ only by name. | Product/workflow owner |
| 8 | R-008 | Inline gates become hard to read if deeply nested or repeated across many docs. | M | L | Support only one-level `<!-- IF capability:x -->` blocks; lint templates for nested gates and duplicate gated anchors. | Template owner |
| 9 | R-009 | Generated runtime metadata drifts from rendered docs, causing validators to read the wrong preset/kind/capabilities. | H | L | Write `description.json` and `graph-metadata.json` after scaffold resolution; add a post-create validation that reads metadata and recomputes the expected file set. | Scaffolder owner |
| 10 | R-010 | Legacy template files remain in `.opencode/skill/system-spec-kit/templates/`, so future patches accidentally edit deleted architecture. | M | H | Delete or relocate all legacy template files in the same PR that adds manifest templates; add a test that fails when `templates/level_1`, `templates/level_2`, `templates/level_3`, or `templates/level_3+` exists. | Migration owner |
| 11 | R-011 | Golden tests snapshot file paths but not section-gate rendering, so Q10 regressions slip through. | M | M | Add one snapshot per gated capability that asserts included and excluded anchors after rendering. | Test owner |
| 12 | R-012 | Phase-parent handling remains a manual branch in `create.sh` and drifts from manifest semantics. | M | M | Make `phase-parent` a normal preset for parent scaffolding; keep only phase-row injection as special behavior. | Phase workflow owner |

## Questions Answered

- Q10 is answered: use inline gates, not fragment files.
- The candidate inventory is verified as exactly 15 functional source files, with the caveat that existing non-manifest assets under `.opencode/skill/system-spec-kit/templates/` must be deleted or relocated if the disk tree must also contain exactly 15 files.
- The refactor plan is now concrete enough for a follow-on implementation packet:
  - `create.sh` stops copying level folders and calls `scaffold_from_manifest()`.
  - `check-files.sh` derives required docs from the manifest.
  - section validators derive active profiles from `kind.defaultSectionProfiles + capabilities[].addsSectionProfiles`.
  - TS validation consumes the same manifest through `manifest-loader.ts`.
- The risk register is synthesized from Copilot's analysis and iteration 1-4 findings.

## Questions Remaining

None. All design questions Q1 through Q10 are now closed.

## Next Focus

Iteration 6 should be synthesis-only. It should write the canonical `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md` by consolidating iterations 1 through 5 into a final recommendation, implementation sequence, manifest contract, and verification checklist.
