# Iteration 8: End-to-End Dry-Run

## Focus

END-TO-END DRY-RUN - walk three hypothetical packet shapes through the proposed manifest-driven scaffold and validation pipeline before final synthesis.

This iteration is a paper dry-run only. It does not run `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, does not scaffold into `.opencode/specs/sample/`, and does not modify production templates or validator source files.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-007.md` first, preserving the concrete diffs and open integration notes.
- Replayed the proposed pipeline for three presets:
  - `simple-change`, resolving to `kind=implementation` and `capabilities=[]`.
  - `arch-change`, resolving to `kind=implementation` and `capabilities=["qa-verification","architecture-decisions"]`.
  - `phase-parent`, resolving to `kind=phase-parent` and `capabilities=[]`.
- Checked the pipeline boundary between `create.sh`, `template-utils.sh`, inline-gate rendering, metadata generation, `validate.sh`, rule scripts, and `template-structure.js`.
- Concretized a full `spec-kit-docs.json` sketch for the three dry-run presets using camelCase keys and nested `presets[]`.

## Findings

### Dry-Run Preset A: simple-change

Preset A command:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --preset simple-change --name "Sample" .opencode/specs/sample/
```

Step 1 - User invokes create.

- Input artifact: CLI args `--preset simple-change`, `--name "Sample"`, target `.opencode/specs/sample/`.
- Expected intermediate state:
  - `PRESET=simple-change`
  - `FEATURE_DESCRIPTION=Sample`
  - `FEATURE_DIR=.opencode/specs/sample/`
- Output artifact: `create.sh` starts normal non-phase scaffold flow.
- What could go wrong: iteration 007's concrete `create.sh` diff still documents the older positional feature-description path and does not add `--name` or an explicit target-folder operand. Under current parser behavior, `--name` may be rejected or the target path may be interpreted as the feature description.
- Validator behavior: no validator behavior yet. This is a scaffolder entrypoint issue.

Step 2 - `create.sh` reads manifest, resolves preset.

- Input artifact: `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- Manifest lookup:
  - `presets[].name == "simple-change"`
  - `namespace` defaults to `core`
  - preset contract resolves to `core:simple-change`
- Output artifact:

```json
{
  "manifestVersion": "1.0.0",
  "preset": "core:simple-change",
  "kind": "implementation",
  "capabilities": [],
  "requiredDocs": [
    "spec.md",
    "plan.md",
    "tasks.md",
    "description.json",
    "graph-metadata.json"
  ],
  "sectionProfiles": [
    "implementation-core"
  ],
  "validationRules": [
    "files",
    "sections",
    "template-headers",
    "section-counts"
  ]
}
```

- What could go wrong: duplicate preset names across namespaces require either exact `core:simple-change` input or a uniqueness check. Iteration 007's helper already detects ambiguity.
- Validator behavior: later validator steps must use this resolved contract, not recompute from old numeric levels.

Step 3 - `create.sh` computes file list.

- Input artifact: resolved contract from Step 2.
- Computation:
  - Kind `implementation` contributes authored docs `spec.md`, `plan.md`, `tasks.md`.
  - Kind `implementation` contributes runtime docs `description.json`, `graph-metadata.json`.
  - No capabilities add authored docs.
- Output authored file list after filtering `owner=author` and excluding runtime metadata:
  - `spec.md`
  - `plan.md`
  - `tasks.md`
- Output runtime metadata list:
  - `description.json`
  - `graph-metadata.json`
- What could go wrong: if `requiredDocs` is treated as "copy every path", the scaffolder will try to copy runtime metadata from markdown templates. The manifest loader must distinguish `owner=runtime` from `owner=author`.
- Validator behavior: `check-files.sh` should require all five paths after scaffold, but `description.json` and `graph-metadata.json` are satisfied by Step 5, not Step 4.

Step 4 - `create.sh` calls `copy_template`, which calls the inline-gate renderer.

- Input artifact: active authored docs and their templates:
  - `.opencode/skill/system-spec-kit/templates/manifest/templates/spec.md.tmpl`
  - `.opencode/skill/system-spec-kit/templates/manifest/templates/plan.md.tmpl`
  - `.opencode/skill/system-spec-kit/templates/manifest/templates/tasks.md.tmpl`
- Active gate atoms:
  - `kind:implementation`
  - `preset:core:simple-change`
- Sample `spec.md` gate behavior:

```markdown
<!-- IF kind:implementation -->
## Requirements

### Functional Requirements
<!-- /IF -->

<!-- IF capability:qa-verification -->
## Verification Notes
<!-- /IF -->

<!-- IF capability:architecture-decisions -->
## Architectural Decisions
<!-- /IF -->
```

- Output artifact in `.opencode/specs/sample/spec.md`:

```markdown
## Requirements

### Functional Requirements
```

- Stripped sections:
  - `## Verification Notes`
  - `## Architectural Decisions`
- What could go wrong: iteration 007's diff has `scaffold_from_manifest` calling `render_active_inline_gates` directly, not `copy_template`. If the final design wants `copy_template` to be the instrumentation point, `copy_template` needs a manifest-aware overload or `create.sh` should call `copy_manifest_template` explicitly.
- Validator behavior: `check-sections.sh` and `check-template-headers.sh` must render the same active gates before checking headings, or they will expect inactive sections.

Step 5 - `create.sh` emits `description.json` and `graph-metadata.json`.

- Input artifact: resolved contract from Step 2 plus feature name and target folder.
- Expected `.opencode/specs/sample/description.json`:

```json
{
  "specFolder": ".opencode/specs/sample",
  "title": "Sample",
  "lastUpdated": "2026-05-01T00:00:00Z",
  "templateContract": {
    "manifestVersion": "1.0.0",
    "preset": "core:simple-change",
    "kind": "implementation",
    "capabilities": [],
    "requiredDocs": [
      "spec.md",
      "plan.md",
      "tasks.md",
      "description.json",
      "graph-metadata.json"
    ],
    "sectionProfiles": [
      "implementation-core"
    ],
    "validationRules": [
      "files",
      "sections",
      "template-headers",
      "section-counts"
    ]
  }
}
```

- Expected `.opencode/specs/sample/graph-metadata.json`:

```json
{
  "schema_version": "1.0.0",
  "packet_id": "sample",
  "spec_folder": ".opencode/specs/sample",
  "status": "planned",
  "source_docs": [
    "spec.md",
    "plan.md",
    "tasks.md"
  ],
  "key_files": [
    "spec.md",
    "plan.md",
    "tasks.md"
  ],
  "derived": {
    "template_contract": {
      "manifestVersion": "1.0.0",
      "preset": "core:simple-change",
      "kind": "implementation",
      "capabilities": [],
      "requiredDocs": [
        "spec.md",
        "plan.md",
        "tasks.md",
        "description.json",
        "graph-metadata.json"
      ],
      "sectionProfiles": [
        "implementation-core"
      ],
      "validationRules": [
        "files",
        "sections",
        "template-headers",
        "section-counts"
      ]
    }
  }
}
```

- What could go wrong: `description.json` generation and `graph-metadata.json` generation currently sit in separate code paths. If only `graph-metadata.json.derived.template_contract` is populated, frontmatter-aware or description-aware consumers cannot recover the contract.
- Validator behavior: `template_contract_for_folder` should read packet frontmatter first, then `graph-metadata.json.derived.template_contract`, then `description.json.templateContract`, then fallback preset inference.

Step 6 - User runs strict validator.

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sample/ --strict
```

- Input artifact: `.opencode/specs/sample/`.
- Output artifact: rule scripts run against the folder.
- What could go wrong: `validate.sh` may still pass a numeric level argument into rule scripts. The manifest-aware rules must tolerate the legacy argument but ignore it when a template contract is available.
- Validator behavior: strict mode should pass if all active docs and sections exist.

Step 7 - Validator reads packet contract and manifest.

- Input artifacts:
  - `.opencode/specs/sample/spec.md` frontmatter, if present.
  - `.opencode/specs/sample/graph-metadata.json`.
  - `.opencode/specs/sample/description.json`.
  - `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- Output artifact: same resolved contract from Step 2.
- What could go wrong: if the packet does not embed kind and capabilities in authored frontmatter, the validator depends on graph metadata. That works only if graph metadata exists and stays coherent.
- Validator behavior: pass with warning only if it had to fall back to inferred `simple-change`; otherwise pass normally.

Step 8 - Validator runs inline-gate-aware section checks.

- Input artifact: active rendered markdown for `spec.md`, `plan.md`, and `tasks.md`.
- Expected section profile:
  - `implementation-core`
- Expected required anchors:
  - `spec.md:Problem Statement,Requirements,Scope`
  - `plan.md:Technical Context,Architecture,Implementation`
  - `tasks.md:Task List`
- Output artifact: section checks pass.
- What could go wrong: `check-section-counts.sh` in iteration 007 proposes `json_number "$counts_json" "h2ByFile.spec.md" 0`. That dotted accessor breaks on the literal key `spec.md`, producing fallback `0` and weakening count validation.
- Validator behavior: file and section presence should pass; count thresholds may silently under-validate unless the dotted-key bug is fixed.

### Dry-Run Preset B: arch-change

Preset B command:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --preset arch-change --name "Sample" .opencode/specs/sample/
```

Step 1 - User invokes create.

- Input artifact: CLI args `--preset arch-change`, `--name "Sample"`, target `.opencode/specs/sample/`.
- Expected intermediate state:
  - `PRESET=arch-change`
  - `FEATURE_DESCRIPTION=Sample`
  - `FEATURE_DIR=.opencode/specs/sample/`
- Output artifact: `create.sh` starts normal non-phase scaffold flow.
- What could go wrong: same command-surface gap as Preset A. The greenfield invocation requires parser support for `--name` and explicit target path.
- Validator behavior: none yet.

Step 2 - `create.sh` reads manifest, resolves preset.

- Input artifact: `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- Manifest lookup:
  - `presets[].name == "arch-change"`
  - `kind=implementation`
  - `capabilities=["qa-verification","architecture-decisions"]`
- Output artifact:

```json
{
  "manifestVersion": "1.0.0",
  "preset": "core:arch-change",
  "kind": "implementation",
  "capabilities": [
    "qa-verification",
    "architecture-decisions"
  ],
  "requiredDocs": [
    "spec.md",
    "plan.md",
    "tasks.md",
    "description.json",
    "graph-metadata.json",
    "checklist.md",
    "decision-record.md"
  ],
  "sectionProfiles": [
    "implementation-core",
    "qa-verification",
    "architecture-decisions"
  ],
  "validationRules": [
    "files",
    "sections",
    "template-headers",
    "section-counts",
    "checklist-validation",
    "decision-record-validation"
  ]
}
```

- What could go wrong: capability order must be stable. Otherwise generated metadata and snapshots churn even when the semantic preset is unchanged.
- Validator behavior: later checks should require both capability docs and their sections.

Step 3 - `create.sh` computes file list.

- Input artifact: resolved contract from Step 2.
- Computation:
  - Kind `implementation` contributes `spec.md`, `plan.md`, `tasks.md`, `description.json`, `graph-metadata.json`.
  - Capability `qa-verification` contributes `checklist.md`.
  - Capability `architecture-decisions` contributes `decision-record.md`.
- Output authored file list:
  - `spec.md`
  - `plan.md`
  - `tasks.md`
  - `checklist.md`
  - `decision-record.md`
- Output runtime metadata list:
  - `description.json`
  - `graph-metadata.json`
- What could go wrong: if capabilities are not validated against `supportsKinds`, this preset would still work, but the same loader could accidentally allow `architecture-decisions` on `phase-parent`.
- Validator behavior: `check-files.sh` fails strict validation if either `checklist.md` or `decision-record.md` is absent.

Step 4 - `create.sh` calls `copy_template`, which calls the inline-gate renderer.

- Input artifact: active authored docs and their templates:
  - `spec.md`
  - `plan.md`
  - `tasks.md`
  - `checklist.md`
  - `decision-record.md`
- Active gate atoms:
  - `kind:implementation`
  - `preset:core:arch-change`
  - `capability:qa-verification`
  - `capability:architecture-decisions`
- Sample `spec.md` gate behavior:

```markdown
<!-- IF capability:qa-verification -->
## Verification Notes
<!-- /IF -->

<!-- IF capability:architecture-decisions -->
## Architectural Decisions
<!-- /IF -->
```

- Output artifact in `.opencode/specs/sample/spec.md`:

```markdown
## Verification Notes

## Architectural Decisions
```

- Output artifact in `.opencode/specs/sample/checklist.md` includes:
  - `## Verification Protocol`
  - `## Code Quality`
- Output artifact in `.opencode/specs/sample/decision-record.md` includes:
  - `## Context`
  - `## Decision`
  - `## Consequences`
- What could go wrong: the iteration 007 bridge renderer only handles `OR` atoms and does not implement the full iteration 006 EBNF. If a template uses `AND`, `NOT`, parentheses, or version predicates, scaffolder output and validator output diverge.
- Validator behavior: strict section checks must compare against the post-gate rendered result, not raw templates containing inactive capability sections.

Step 5 - `create.sh` emits `description.json` and `graph-metadata.json`.

- Input artifact: resolved contract from Step 2.
- Expected `.opencode/specs/sample/description.json` has `templateContract.capabilities`:

```json
[
  "qa-verification",
  "architecture-decisions"
]
```

- Expected `.opencode/specs/sample/graph-metadata.json` has:

```json
{
  "source_docs": [
    "spec.md",
    "plan.md",
    "tasks.md",
    "checklist.md",
    "decision-record.md"
  ],
  "key_files": [
    "spec.md",
    "plan.md",
    "tasks.md",
    "checklist.md",
    "decision-record.md"
  ],
  "derived": {
    "template_contract": {
      "preset": "core:arch-change",
      "kind": "implementation",
      "capabilities": [
        "qa-verification",
        "architecture-decisions"
      ]
    }
  }
}
```

- What could go wrong: if `template_contract_docs_json` only returns `.md` docs, metadata is good for `source_docs`; if it is reused for "required files", it omits runtime metadata. The helper name should make this distinction explicit.
- Validator behavior: validator should require runtime metadata via manifest required docs, while graph `source_docs` should intentionally contain authored markdown only.

Step 6 - User runs strict validator.

- Input artifact: `.opencode/specs/sample/`.
- Output artifact: rule scripts run against five authored docs plus two runtime docs.
- What could go wrong: old level-based `validate.sh` and rules might label this as Level 1 if `spec.md` no longer contains `- **Level**:`. Manifest-aware rules must stop extracting level from markdown.
- Validator behavior: strict mode should pass if active docs and sections exist.

Step 7 - Validator reads packet contract and manifest.

- Input artifacts:
  - packet frontmatter or metadata contract snapshot.
  - global manifest to resolve doc templates and section profiles by id.
- Output artifact: resolved active docs and profiles.
- What could go wrong: if the validator reads current manifest preset `arch-change` but ignores the packet's snapshotted `manifestVersion`, future manifest edits can retroactively change old packet validation. The packet must carry both `manifestVersion` and resolved ids.
- Validator behavior: prefer the packet snapshot for ids, use the current manifest only to look up profile definitions compatible with `manifestVersion`.

Step 8 - Validator runs inline-gate-aware section checks.

- Input artifact: rendered active markdown for all authored files.
- Expected section profile merge:
  - `implementation-core`
  - `qa-verification`
  - `architecture-decisions`
- Expected required anchors:
  - `spec.md:Problem Statement,Requirements,Scope,Verification Notes,Architectural Decisions`
  - `plan.md:Technical Context,Architecture,Implementation`
  - `tasks.md:Task List`
  - `checklist.md:Verification Protocol,Code Quality`
  - `decision-record.md:Context,Decision,Consequences`
- Output artifact: section checks pass.
- What could go wrong: `check-template-headers.sh` depends on `template-structure.js compare-manifest`, but iteration 007 did not provide the helper diff. Header validation cannot actually run in the proposed pipeline until that command exists.
- Validator behavior: `check-sections.sh` can pass with shell helpers; `check-template-headers.sh` should fail closed or report unsupported until `compare-manifest` is implemented.

### Dry-Run Preset C: phase-parent

Preset C command:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --preset phase-parent --name "Sample" .opencode/specs/sample/
```

Step 1 - User invokes create.

- Input artifact: CLI args `--preset phase-parent`, `--name "Sample"`, target `.opencode/specs/sample/`.
- Expected intermediate state:
  - `PRESET=phase-parent`
  - `FEATURE_DESCRIPTION=Sample`
  - `FEATURE_DIR=.opencode/specs/sample/`
- Output artifact: lean phase-parent scaffold flow.
- What could go wrong: existing `create.sh` has a separate `--phase-mode` branch. A `phase-parent` preset either needs to route into that branch or create a lean parent without children. The command in this dry-run does not specify child phases, so this preset can only create the parent packet.
- Validator behavior: strict validator treats this as phase-parent lean trio when metadata or frontmatter says `kind=phase-parent`.

Step 2 - `create.sh` reads manifest, resolves preset.

- Input artifact: `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.
- Manifest lookup:
  - `presets[].name == "phase-parent"`
  - `kind=phase-parent`
  - `capabilities=[]`
- Output artifact:

```json
{
  "manifestVersion": "1.0.0",
  "preset": "core:phase-parent",
  "kind": "phase-parent",
  "capabilities": [],
  "requiredDocs": [
    "spec.md",
    "description.json",
    "graph-metadata.json"
  ],
  "sectionProfiles": [
    "phase-parent-core"
  ],
  "validationRules": [
    "files",
    "sections",
    "template-headers",
    "phase-parent-content"
  ]
}
```

- What could go wrong: `is_phase_parent` currently detects child directories with phase docs. A newly scaffolded parent with zero children may not satisfy structural detection, so kind must come from the manifest contract.
- Validator behavior: do not rely only on child-folder detection for phase-parent behavior.

Step 3 - `create.sh` computes file list.

- Input artifact: resolved contract from Step 2.
- Computation:
  - Kind `phase-parent` contributes authored doc `spec.md`.
  - Kind `phase-parent` contributes runtime docs `description.json`, `graph-metadata.json`.
  - No capabilities add docs.
- Output authored file list:
  - `spec.md`
- Output runtime metadata list:
  - `description.json`
  - `graph-metadata.json`
- What could go wrong: if old phase-parent logic still creates Level 1 child docs at the parent, it will add `plan.md` and `tasks.md`, violating the lean trio policy.
- Validator behavior: `check-files.sh` should not require `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, or `implementation-summary.md` at the parent.

Step 4 - `create.sh` calls `copy_template`, which calls the inline-gate renderer.

- Input artifact: `.opencode/skill/system-spec-kit/templates/manifest/templates/phase-parent.spec.md.tmpl`.
- Active gate atoms:
  - `kind:phase-parent`
  - `preset:core:phase-parent`
- Sample gate behavior:

```markdown
<!-- IF kind:phase-parent -->
## Purpose

## Phase Manifest

## Current Status
<!-- /IF -->

<!-- IF kind:implementation -->
## Requirements
<!-- /IF -->
```

- Output artifact in `.opencode/specs/sample/spec.md`:

```markdown
## Purpose

## Phase Manifest

## Current Status
```

- Stripped sections:
  - `## Requirements`
- What could go wrong: if the same `spec.md.tmpl` is reused for implementation and phase-parent without strong gate coverage, implementation sections can leak into parent docs.
- Validator behavior: `check-phase-parent-content.sh` should enforce that the parent `spec.md` documents purpose, sub-phase manifest, and current status, not migration history or child implementation details.

Step 5 - `create.sh` emits `description.json` and `graph-metadata.json`.

- Input artifact: resolved contract from Step 2.
- Expected `.opencode/specs/sample/description.json`:

```json
{
  "specFolder": ".opencode/specs/sample",
  "title": "Sample",
  "lastUpdated": "2026-05-01T00:00:00Z",
  "templateContract": {
    "manifestVersion": "1.0.0",
    "preset": "core:phase-parent",
    "kind": "phase-parent",
    "capabilities": [],
    "requiredDocs": [
      "spec.md",
      "description.json",
      "graph-metadata.json"
    ],
    "sectionProfiles": [
      "phase-parent-core"
    ],
    "validationRules": [
      "files",
      "sections",
      "template-headers",
      "phase-parent-content"
    ]
  }
}
```

- Expected `.opencode/specs/sample/graph-metadata.json`:

```json
{
  "schema_version": "1.0.0",
  "packet_id": "sample",
  "spec_folder": ".opencode/specs/sample",
  "status": "planned",
  "source_docs": [
    "spec.md"
  ],
  "key_files": [
    "spec.md"
  ],
  "derived": {
    "kind": "phase-parent",
    "template_contract": {
      "manifestVersion": "1.0.0",
      "preset": "core:phase-parent",
      "kind": "phase-parent",
      "capabilities": [],
      "requiredDocs": [
        "spec.md",
        "description.json",
        "graph-metadata.json"
      ],
      "sectionProfiles": [
        "phase-parent-core"
      ],
      "validationRules": [
        "files",
        "sections",
        "template-headers",
        "phase-parent-content"
      ]
    }
  }
}
```

- What could go wrong: if graph metadata derives phase-parent status from existing children only, a new childless phase parent is misclassified as an implementation packet.
- Validator behavior: explicit `kind=phase-parent` in the contract wins over structural fallback.

Step 6 - User runs strict validator.

- Input artifact: `.opencode/specs/sample/`.
- Output artifact: validator runs lean parent rules.
- What could go wrong: legacy phase-parent validator may still require `description.json` and `graph-metadata.json` only indirectly. The manifest contract makes them explicit runtime core.
- Validator behavior: strict mode passes with the lean trio only.

Step 7 - Validator reads packet contract and manifest.

- Input artifacts:
  - `spec.md` frontmatter or metadata snapshot.
  - global manifest.
- Output artifact: `kind=phase-parent`, no capabilities.
- What could go wrong: if `template_contract_for_folder` first calls `is_phase_parent "$folder"` and there are no children yet, it falls back to `simple-change`. The order must be packet contract first, structural fallback second.
- Validator behavior: read explicit contract first, then use `is_phase_parent` only as a legacy inference path.

Step 8 - Validator runs inline-gate-aware section checks.

- Input artifact: rendered active phase-parent `spec.md`.
- Expected section profile:
  - `phase-parent-core`
- Expected required anchors:
  - `spec.md:Purpose,Phase Manifest,Current Status`
- Output artifact: section checks pass.
- What could go wrong: if `check-template-headers.sh` still has a hardcoded doc list, it will try to inspect missing `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- Validator behavior: compare only active authored docs from the manifest.

### Broken Steps + Fixes

1. Broken: Step 1 command surface is not fully represented in iteration 007's `create.sh` diff.

- Evidence: the dry-run command uses `--name "Sample"` plus an explicit target `.opencode/specs/sample/`, while the iteration 007 diff still shows feature-description-oriented examples and no parser addition for `--name`.
- Fix: update `.opencode/skill/system-spec-kit/scripts/spec/create.sh` argument parsing to support `--name NAME` and an optional explicit target directory. The direct target path should bypass branch-number folder derivation and set `FEATURE_DIR` after normalization.

2. Broken: Step 4 says `copy_template` calls the inline-gate renderer, but iteration 007's bridge routes around `copy_template`.

- Evidence: `scaffold_from_manifest` reads `doc.templateFile` and writes `render_active_inline_gates "$manifest_dir/$template_file" "$contract_json" > "$target_dir/$doc_path"` directly.
- Fix: either rename the manifest path to `copy_manifest_template` and document it as the new copy primitive, or add a manifest-aware `copy_template "$doc_path" "$target_dir" "$manifest_path" "$contract_json"` branch in `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`.

3. Broken: packet frontmatter does not yet declare the template contract.

- Evidence: Step 7 requires the validator to read packet frontmatter for kind and capabilities, but the iteration 007 helper first reads `graph-metadata.json.derived.template_contract`.
- Fix: add a `templateContract` YAML frontmatter block to generated authored docs, at minimum `spec.md`. Implement in `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` as `render_template_contract_frontmatter "$contract_json"` and have `create.sh` or the template renderer prepend it. Then update `template_contract_for_folder` to read `spec.md` frontmatter before graph metadata.

4. Broken: `template-structure.js compare-manifest` is still missing.

- Evidence: `check-template-headers.sh` proposed calling `node "$helper_script" compare-manifest "$manifest_path" "$contract_json" "$(basename "$file")" "$file" headers`, but iteration 007 explicitly names this as a follow-up.
- Fix: implement `compare-manifest` in `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`. It should resolve the doc template from manifest, render active inline gates with the same renderer used by scaffold, extract expected headers, extract actual headers, and compare them.

5. Broken: `description.json` and `graph-metadata.json` contract emission can diverge.

- Evidence: iteration 007 adds `template_contract` to graph metadata, while the existing description generator remains a separate later call.
- Fix: make `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js` accept `--template-contract-json` or read `graph-metadata.json.derived.template_contract`. `create.sh` should pass the same resolved contract to both metadata writers in one scaffold transaction.

6. Broken: manifest contract version is not explicitly checked during validation.

- Evidence: the resolved contract includes `manifestVersion`, but rule scripts in iteration 007 use current manifest definitions without a compatibility check.
- Fix: add `assert_manifest_compatible "$manifest_path" "$contract_json"` in `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`. Rule scripts should fail with a clear message when the packet's `manifestVersion` is newer than the validator supports.

7. Broken: `check-section-counts.sh` dotted JSON lookup fails for file names containing dots.

- Evidence: iteration 007 proposes `json_number "$counts_json" "h2ByFile.spec.md" 0`, but `spec.md` is a literal object key, not nested `spec -> md`.
- Fix: replace dotted-path lookup with a helper that accepts path segments, for example `json_number_key "$counts_json" h2ByFile "spec.md" 0`, or emit count entries as rows from `manifest_minimum_counts`.

8. Broken: childless phase parents are not reliably detected by structural fallback.

- Evidence: current phase-parent detection is child-directory based, while the dry-run creates only `.opencode/specs/sample/spec.md`, `description.json`, and `graph-metadata.json`.
- Fix: make explicit `kind=phase-parent` in frontmatter or metadata authoritative in `template_contract_for_folder`, `check-files.sh`, and phase-parent content checks. Keep `is_phase_parent` as legacy fallback.

9. Broken: orphan authored docs are not covered in the dry-run validator path.

- Evidence: if a packet changes from `arch-change` to `simple-change`, `decision-record.md` may remain. Iteration 006 says this should warn, but the iteration 007 file-check diff only checks required docs.
- Fix: add `manifest_orphan_authored_docs "$manifest_path" "$contract_json" "$folder"` in `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` and have `check-files.sh` warn on author-owned docs not active under the current contract.

### Concretized Manifest JSON

```json
{
  "manifestVersion": "1.0.0",
  "contractName": "spec-kit-docs",
  "kinds": [
    {
      "id": "implementation",
      "description": "Standard implementation packet with authored planning docs and runtime metadata.",
      "requiredCoreDocs": [
        "spec.md",
        "plan.md",
        "tasks.md"
      ],
      "requiredRuntimeDocs": [
        "description.json",
        "graph-metadata.json"
      ],
      "defaultSectionProfiles": [
        "implementation-core"
      ],
      "defaultValidationRules": [
        "files",
        "sections",
        "template-headers",
        "section-counts"
      ]
    },
    {
      "id": "phase-parent",
      "description": "Lean parent packet that owns a phase manifest and delegates heavy docs to child packets.",
      "requiredCoreDocs": [
        "spec.md"
      ],
      "requiredRuntimeDocs": [
        "description.json",
        "graph-metadata.json"
      ],
      "defaultSectionProfiles": [
        "phase-parent-core"
      ],
      "defaultValidationRules": [
        "files",
        "sections",
        "template-headers",
        "phase-parent-content"
      ]
    }
  ],
  "capabilities": [
    {
      "id": "qa-verification",
      "description": "Adds authored verification checklist and QA section expectations.",
      "supportsKinds": [
        "implementation"
      ],
      "conflictsWith": [],
      "addsAuthoredDocs": [
        "checklist.md"
      ],
      "addsSectionProfiles": [
        "qa-verification"
      ],
      "addsValidationRules": [
        "checklist-validation"
      ]
    },
    {
      "id": "architecture-decisions",
      "description": "Adds authored decision record and ADR section expectations.",
      "supportsKinds": [
        "implementation"
      ],
      "conflictsWith": [],
      "addsAuthoredDocs": [
        "decision-record.md"
      ],
      "addsSectionProfiles": [
        "architecture-decisions"
      ],
      "addsValidationRules": [
        "decision-record-validation"
      ]
    }
  ],
  "docTemplates": [
    {
      "path": "spec.md",
      "templateFile": "templates/spec.md.tmpl",
      "owner": "author",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "plan.md",
      "templateFile": "templates/plan.md.tmpl",
      "owner": "author",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "tasks.md",
      "templateFile": "templates/tasks.md.tmpl",
      "owner": "author",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "checklist.md",
      "templateFile": "templates/checklist.md.tmpl",
      "owner": "author",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "decision-record.md",
      "templateFile": "templates/decision-record.md.tmpl",
      "owner": "author",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "description.json",
      "owner": "runtime",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "graph-metadata.json",
      "owner": "runtime",
      "absenceBehavior": "hard-error"
    },
    {
      "path": "handover.md",
      "templateFile": "templates/handover.md.tmpl",
      "owner": "command-owned-lazy",
      "absenceBehavior": "silent-skip"
    },
    {
      "path": "research/research.md",
      "templateFile": "templates/research.md.tmpl",
      "owner": "workflow-owned-packet",
      "absenceBehavior": "silent-skip"
    }
  ],
  "directories": [
    {
      "path": "scratch",
      "owner": "runtime",
      "absenceBehavior": "warn"
    },
    {
      "path": "research/iterations",
      "owner": "workflow-owned-packet",
      "absenceBehavior": "silent-skip"
    },
    {
      "path": "research/deltas",
      "owner": "workflow-owned-packet",
      "absenceBehavior": "silent-skip"
    }
  ],
  "sectionProfiles": [
    {
      "id": "implementation-core",
      "appliesTo": [
        "spec.md",
        "plan.md",
        "tasks.md"
      ],
      "requiredAnchorsByFile": {
        "spec.md": [
          "Problem Statement",
          "Requirements",
          "Scope"
        ],
        "plan.md": [
          "Technical Context",
          "Architecture",
          "Implementation"
        ],
        "tasks.md": [
          "Task List"
        ]
      },
      "minimumCounts": {
        "h2ByFile": {
          "spec.md": 5,
          "plan.md": 4,
          "tasks.md": 1
        },
        "requirements": 3,
        "acceptanceScenarios": 2
      }
    },
    {
      "id": "qa-verification",
      "appliesTo": [
        "spec.md",
        "checklist.md"
      ],
      "requiredAnchorsByFile": {
        "spec.md": [
          "Verification Notes"
        ],
        "checklist.md": [
          "Verification Protocol",
          "Code Quality"
        ]
      },
      "minimumCounts": {
        "h2ByFile": {
          "spec.md": 6,
          "checklist.md": 2
        },
        "requirements": 5,
        "acceptanceScenarios": 4
      }
    },
    {
      "id": "architecture-decisions",
      "appliesTo": [
        "spec.md",
        "decision-record.md"
      ],
      "requiredAnchorsByFile": {
        "spec.md": [
          "Architectural Decisions"
        ],
        "decision-record.md": [
          "Context",
          "Decision",
          "Consequences"
        ]
      },
      "minimumCounts": {
        "h2ByFile": {
          "spec.md": 7,
          "decision-record.md": 3
        },
        "requirements": 6,
        "acceptanceScenarios": 4
      }
    },
    {
      "id": "phase-parent-core",
      "appliesTo": [
        "spec.md"
      ],
      "requiredAnchorsByFile": {
        "spec.md": [
          "Purpose",
          "Phase Manifest",
          "Current Status"
        ]
      },
      "minimumCounts": {
        "h2ByFile": {
          "spec.md": 3
        },
        "requirements": 0,
        "acceptanceScenarios": 0
      }
    }
  ],
  "presets": [
    {
      "namespace": "core",
      "name": "simple-change",
      "displayName": "Simple Change",
      "kind": "implementation",
      "capabilities": []
    },
    {
      "namespace": "core",
      "name": "arch-change",
      "displayName": "Architecture Change",
      "kind": "implementation",
      "capabilities": [
        "qa-verification",
        "architecture-decisions"
      ]
    },
    {
      "namespace": "core",
      "name": "phase-parent",
      "displayName": "Phase Parent",
      "kind": "phase-parent",
      "capabilities": []
    }
  ]
}
```

One correction surfaced while writing the manifest: section profile data should be `requiredAnchorsByFile`, not a flat `requiredAnchors` plus `appliesTo`. The flat shape in iteration 007 would incorrectly apply every anchor to every file in the profile. The validator helper should emit `docPath:anchors` rows from `requiredAnchorsByFile`.

## Questions Answered

- The three dry-run presets converge on a small runtime core: `spec.md`, `description.json`, and `graph-metadata.json`, with implementation packets adding `plan.md` and `tasks.md`.
- `simple-change` requires three authored docs plus two runtime metadata files.
- `arch-change` requires five authored docs plus two runtime metadata files.
- `phase-parent` requires only one authored doc plus two runtime metadata files.
- The validator can be manifest-driven, but only if the packet stores a stable contract snapshot in frontmatter or metadata.
- Inline-gate rendering must be the same implementation for scaffold output, section checks, and template-header comparison.
- `template-structure.js compare-manifest`, frontmatter contract emission, `--name` direct-path support, metadata contract convergence, and dotted JSON count lookup are the highest-priority missing pieces.

## Questions Remaining

- Should `spec.md` be the only authored doc with template-contract frontmatter, or should every authored doc carry the same block for local inspection?
- Should current-manifest validation support older `manifestVersion` values through adapters, or should greenfield packets require exact `manifestVersion` match until a real migration exists?
- Should `phase-parent --name "Sample" .opencode/specs/sample/` create only a parent, or should the CLI require child phase definitions when `kind=phase-parent` is selected?

## Next Focus

Iteration 9 is FINAL SYNTHESIS. Recommended work: write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md` with 17 consolidated sections from iterations 1 through 8, emit `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/resource-map.md`, declare convergence, and give the final recommendation for the C+F hybrid manifest design.
