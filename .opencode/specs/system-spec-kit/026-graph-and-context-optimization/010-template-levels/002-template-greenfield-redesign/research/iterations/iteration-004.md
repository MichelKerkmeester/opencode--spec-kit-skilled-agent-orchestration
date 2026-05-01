# Iteration 4: Manifest Schema, Scaffold Matrix, and Golden Tests

## Focus

MANIFEST SCHEMA + SAMPLE PACKET SCAFFOLDS + GOLDEN TESTS for the C+F hybrid winner from iteration 3.

This iteration turns the winning design into an executable contract: one manifest schema, six sample scaffold rows, and a regression-test harness. It also checks two prompt-level count constraints against the current required core docs instead of assuming the counts are internally consistent.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-003.md` first to preserve the design decision and 15-file inventory.
- Loaded the `sk-deep-research` quick reference and current state log.
- Re-read `.opencode/skill/system-spec-kit/assets/template_mapping.md` and `.opencode/skill/system-spec-kit/templates/README.md` to confirm today's Level 1/2/3/3+ and phase-parent file behavior.
- Checked `.opencode/skill/system-spec-kit/package.json` and `.opencode/skill/system-spec-kit/scripts/package.json` to place the golden tests in the existing Vitest surface.
- Drafted the manifest JSON Schema, sample scaffold matrix, and golden-test contract.

## Findings

### Manifest Schema

The manifest should be a schema-validated JSON file at `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`. The key design choice is to keep five axes separate:

- `kind` says what kind of packet this is.
- `capability` says what authored docs, section profiles, and validation rules are added.
- `docTemplates` says who owns each template, when it is created, and what absence means.
- `sectionProfiles` says which headers or blocks are activated inside existing authored docs.
- `preset` gives users shorthand names without reintroducing levels.

Complete schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://spec-kit.local/schemas/spec-kit-docs.schema.json",
  "title": "Spec Kit Docs Manifest",
  "type": "object",
  "required": ["schemaVersion", "kinds", "capabilities", "docTemplates", "sectionProfiles", "presets"],
  "additionalProperties": false,
  "properties": {
    "schemaVersion": { "type": "string", "pattern": "^1\\.0\\.0$" },
    "kinds": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/kind" }
    },
    "capabilities": {
      "type": "array",
      "items": { "$ref": "#/$defs/capability" }
    },
    "docTemplates": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/docTemplate" }
    },
    "sectionProfiles": {
      "type": "array",
      "items": { "$ref": "#/$defs/sectionProfile" }
    },
    "presets": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/preset" }
    }
  },
  "$defs": {
    "id": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "docPath": {
      "type": "string",
      "pattern": "^(research/)?[a-z0-9-]+\\.(md|json)$"
    },
    "templatePath": {
      "type": "string",
      "pattern": "^templates/manifest/[a-z0-9./-]+\\.(md|json)\\.tmpl$"
    },
    "kind": {
      "type": "object",
      "required": ["id", "requiredCoreDocs", "requiredRuntimeDocs"],
      "additionalProperties": false,
      "properties": {
        "id": { "$ref": "#/$defs/id" },
        "requiredCoreDocs": {
          "type": "array",
          "items": { "$ref": "#/$defs/docPath" }
        },
        "requiredRuntimeDocs": {
          "type": "array",
          "items": { "enum": ["description.json", "graph-metadata.json"] }
        },
        "defaultSectionProfiles": {
          "type": "array",
          "items": { "$ref": "#/$defs/id" },
          "default": []
        }
      }
    },
    "capability": {
      "type": "object",
      "required": ["id", "addsAuthoredDocs", "addsSectionProfiles", "addsValidationRules"],
      "additionalProperties": false,
      "properties": {
        "id": { "$ref": "#/$defs/id" },
        "addsAuthoredDocs": {
          "type": "array",
          "items": { "$ref": "#/$defs/docPath" }
        },
        "addsSectionProfiles": {
          "type": "array",
          "items": { "$ref": "#/$defs/id" }
        },
        "addsValidationRules": {
          "type": "array",
          "items": { "$ref": "#/$defs/id" }
        }
      }
    },
    "docTemplate": {
      "type": "object",
      "required": ["path", "owner", "creationTrigger", "absenceBehavior", "templateFile"],
      "additionalProperties": false,
      "properties": {
        "path": { "$ref": "#/$defs/docPath" },
        "owner": { "enum": ["author", "command", "agent", "workflow"] },
        "creationTrigger": { "type": "string", "minLength": 1 },
        "absenceBehavior": { "enum": ["hard-error", "warn", "silent-skip"] },
        "templateFile": { "$ref": "#/$defs/templatePath" }
      }
    },
    "sectionProfile": {
      "type": "object",
      "required": ["id", "appliesTo", "requiredAnchors"],
      "additionalProperties": false,
      "properties": {
        "id": { "$ref": "#/$defs/id" },
        "appliesTo": {
          "type": "array",
          "items": { "$ref": "#/$defs/docPath" }
        },
        "requiredAnchors": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 }
        }
      }
    },
    "preset": {
      "type": "object",
      "required": ["name", "kind", "capabilities"],
      "additionalProperties": false,
      "properties": {
        "name": { "$ref": "#/$defs/id" },
        "kind": { "$ref": "#/$defs/id" },
        "capabilities": {
          "type": "array",
          "items": { "$ref": "#/$defs/id" }
        }
      }
    }
  }
}
```

The schema expresses all current behavior without reviving level numbers:

- Level 1 becomes `kind=implementation` with no capabilities.
- Level 2 becomes `kind=implementation` plus `qa-verification`.
- Level 3 becomes `kind=implementation` plus `qa-verification` and `architecture-decisions`.
- Level 3+ becomes Level 3 plus `governance-expansion`, which adds sections and validation rules but no new files.
- Phase parent becomes `kind=phase-parent`, whose `requiredCoreDocs` are only `spec.md` and whose `requiredRuntimeDocs` are `description.json` and `graph-metadata.json`.

Edge case checks:

- Section-only traits work because `governance-expansion.addsAuthoredDocs` can be `[]` while `addsSectionProfiles` and `addsValidationRules` are non-empty.
- Lazy addon owners work because `handover.md` can be declared as `owner=command`, `creationTrigger=/memory:save`, and `absenceBehavior=silent-skip`; validators can know the document exists without requiring it during ordinary packet validation.
- Phase-parent lean trio works because `kind=phase-parent` requires only `spec.md`, `description.json`, and `graph-metadata.json`; child packets carry the heavy docs.

### Sample Scaffold Matrix

The matrix below uses concrete repo-relative sample packet paths. The path names are examples; the file sets are the contract.

| Preset | Kind | Capabilities | Files Scaffolded (with paths) | Files NOT Scaffolded (would-be-stale) |
|---|---|---|---|---|
| `simple-change` | `implementation` | `[]` | `.opencode/specs/example-simple-change/spec.md`<br>`.opencode/specs/example-simple-change/plan.md`<br>`.opencode/specs/example-simple-change/tasks.md`<br>`.opencode/specs/example-simple-change/implementation-summary.md`<br>`.opencode/specs/example-simple-change/description.json`<br>`.opencode/specs/example-simple-change/graph-metadata.json` | `.opencode/specs/example-simple-change/checklist.md` (no `qa-verification`)<br>`.opencode/specs/example-simple-change/decision-record.md` (no `architecture-decisions`)<br>`.opencode/specs/example-simple-change/handover.md` (command-owned lazy)<br>`.opencode/specs/example-simple-change/debug-delegation.md` (agent-owned lazy)<br>`.opencode/specs/example-simple-change/research/research.md` (workflow-owned packet)<br>`.opencode/specs/example-simple-change/resource-map.md` (optional author-scaffolded)<br>`.opencode/specs/example-simple-change/context-index.md` (optional migration bridge) |
| `validated-change` | `implementation` | `[qa-verification]` | `.opencode/specs/example-validated-change/spec.md`<br>`.opencode/specs/example-validated-change/plan.md`<br>`.opencode/specs/example-validated-change/tasks.md`<br>`.opencode/specs/example-validated-change/implementation-summary.md`<br>`.opencode/specs/example-validated-change/checklist.md`<br>`.opencode/specs/example-validated-change/description.json`<br>`.opencode/specs/example-validated-change/graph-metadata.json` | `.opencode/specs/example-validated-change/decision-record.md` (no `architecture-decisions`)<br>`.opencode/specs/example-validated-change/handover.md` (command-owned lazy)<br>`.opencode/specs/example-validated-change/debug-delegation.md` (agent-owned lazy)<br>`.opencode/specs/example-validated-change/research/research.md` (workflow-owned packet)<br>`.opencode/specs/example-validated-change/resource-map.md` (optional author-scaffolded)<br>`.opencode/specs/example-validated-change/context-index.md` (optional migration bridge) |
| `arch-change` | `implementation` | `[qa-verification, architecture-decisions]` | `.opencode/specs/example-arch-change/spec.md`<br>`.opencode/specs/example-arch-change/plan.md`<br>`.opencode/specs/example-arch-change/tasks.md`<br>`.opencode/specs/example-arch-change/implementation-summary.md`<br>`.opencode/specs/example-arch-change/checklist.md`<br>`.opencode/specs/example-arch-change/decision-record.md`<br>`.opencode/specs/example-arch-change/description.json`<br>`.opencode/specs/example-arch-change/graph-metadata.json` | `.opencode/specs/example-arch-change/handover.md` (command-owned lazy)<br>`.opencode/specs/example-arch-change/debug-delegation.md` (agent-owned lazy)<br>`.opencode/specs/example-arch-change/research/research.md` (workflow-owned packet)<br>`.opencode/specs/example-arch-change/resource-map.md` (optional author-scaffolded)<br>`.opencode/specs/example-arch-change/context-index.md` (optional migration bridge) |
| `governed-change` | `implementation` | `[qa-verification, architecture-decisions, governance-expansion]` | `.opencode/specs/example-governed-change/spec.md`<br>`.opencode/specs/example-governed-change/plan.md`<br>`.opencode/specs/example-governed-change/tasks.md`<br>`.opencode/specs/example-governed-change/implementation-summary.md`<br>`.opencode/specs/example-governed-change/checklist.md`<br>`.opencode/specs/example-governed-change/decision-record.md`<br>`.opencode/specs/example-governed-change/description.json`<br>`.opencode/specs/example-governed-change/graph-metadata.json`<br>Section-only additions inside `.opencode/specs/example-governed-change/spec.md` and `.opencode/specs/example-governed-change/decision-record.md` | `.opencode/specs/example-governed-change/handover.md` (command-owned lazy)<br>`.opencode/specs/example-governed-change/debug-delegation.md` (agent-owned lazy)<br>`.opencode/specs/example-governed-change/research/research.md` (workflow-owned packet)<br>`.opencode/specs/example-governed-change/resource-map.md` (optional author-scaffolded)<br>`.opencode/specs/example-governed-change/context-index.md` (optional migration bridge) |
| `phase-parent` | `phase-parent` | `[]` | `.opencode/specs/example-phase-parent/spec.md`<br>`.opencode/specs/example-phase-parent/description.json`<br>`.opencode/specs/example-phase-parent/graph-metadata.json` | `.opencode/specs/example-phase-parent/plan.md` (children carry heavy docs)<br>`.opencode/specs/example-phase-parent/tasks.md` (children carry heavy docs)<br>`.opencode/specs/example-phase-parent/implementation-summary.md` (children carry heavy docs)<br>`.opencode/specs/example-phase-parent/checklist.md` (children carry heavy docs)<br>`.opencode/specs/example-phase-parent/decision-record.md` (children carry heavy docs)<br>`.opencode/specs/example-phase-parent/handover.md` (command-owned lazy)<br>`.opencode/specs/example-phase-parent/debug-delegation.md` (agent-owned lazy)<br>`.opencode/specs/example-phase-parent/research/research.md` (workflow-owned packet)<br>`.opencode/specs/example-phase-parent/resource-map.md` (optional author-scaffolded)<br>`.opencode/specs/example-phase-parent/context-index.md` (optional migration bridge) |
| `investigation` | `investigation` | `[]` | `.opencode/specs/example-investigation/spec.md`<br>`.opencode/specs/example-investigation/plan.md`<br>`.opencode/specs/example-investigation/tasks.md`<br>`.opencode/specs/example-investigation/implementation-summary.md`<br>`.opencode/specs/example-investigation/description.json`<br>`.opencode/specs/example-investigation/graph-metadata.json` | `.opencode/specs/example-investigation/research/research.md` (`/spec_kit:deep-research` workflow-owned output)<br>`.opencode/specs/example-investigation/checklist.md` (no `qa-verification`)<br>`.opencode/specs/example-investigation/decision-record.md` (no `architecture-decisions`)<br>`.opencode/specs/example-investigation/handover.md` (command-owned lazy)<br>`.opencode/specs/example-investigation/debug-delegation.md` (agent-owned lazy)<br>`.opencode/specs/example-investigation/resource-map.md` (optional author-scaffolded)<br>`.opencode/specs/example-investigation/context-index.md` (optional migration bridge) |

Coverage check:

- Current Level 1 behavior is reproduced by `simple-change`.
- Current Level 2 behavior is reproduced by `validated-change`.
- Current Level 3 behavior is reproduced by `arch-change`.
- Current Level 3+ behavior is reproduced by `governed-change` through section profiles, not a unique file.
- Current phase-parent behavior is reproduced by `phase-parent`.
- Deep research starts with `investigation`; `research/research.md` remains workflow-owned and is created by `/spec_kit:deep-research`, not by ordinary scaffolding.

Count check:

- `simple-change` scaffolds 6 files. This satisfies the requested `<=6` bound.
- `validated-change` scaffolds 7 files.
- `arch-change` scaffolds 8 files under today's rules: 4 authored core docs + 2 capability docs + 2 runtime metadata files. The requested `<=7` bound is not satisfiable unless either `implementation-summary.md` or generated metadata is excluded from the count. Excluding either would contradict the prompt's simple-change row and the current template mapping.
- `phase-parent` scaffolds 3 files. This satisfies the requested `<=3` bound.

### Golden Test Design

Test file:

- `.opencode/skill/system-spec-kit/scripts/tests/template-scaffold.vitest.ts`

The test belongs in `@spec-kit/scripts` because `.opencode/skill/system-spec-kit/scripts/package.json` already runs Vitest with `vitest run --config ../mcp_server/vitest.config.ts --root .`. The root package already calls `npm run test --workspace=@spec-kit/scripts`, so no new GitHub workflow is required unless a dedicated template-only job is desired.

Scaffolder signature:

```ts
type ScaffoldSnapshot = {
  preset: string
  kind: string
  capabilities: string[]
  files: Array<{
    path: string
    owner: "author" | "command" | "agent" | "workflow"
    creationTrigger: string
    absenceBehavior: "hard-error" | "warn" | "silent-skip"
    templateFile?: string
    generated?: true
  }>
  sectionProfiles: string[]
  validationRules: string[]
  lazyTemplates: string[]
}

function scaffoldFromManifest(
  manifestPath: string,
  presetName: string,
  targetRoot: string
): ScaffoldSnapshot
```

Snapshot shape:

```ts
expect(scaffoldFromManifest(
  ".opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json",
  "arch-change",
  ".opencode/specs/example-arch-change"
)).toMatchInlineSnapshot()
```

The snapshot should record sorted file paths, owners, triggers, absence behavior, section profiles, and validation rules. It should not snapshot rendered timestamps, generated IDs, or user-entered content.

Six requested test cases:

| Test | Assertion |
|---|---|
| `simple-change scaffolds baseline implementation packet` | Snapshot equals 6 files: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`; no checklist, no decision record, no lazy addons. |
| `validated-change adds qa verification only` | Snapshot equals `simple-change` plus `checklist.md`; includes `qa-verification` validation rules and no architecture sections. |
| `arch-change adds architecture decisions` | Snapshot equals `validated-change` plus `decision-record.md`; includes architecture validation rules; count is 8 when runtime metadata is included. |
| `governed-change adds section profiles without files` | File list equals `arch-change`; `sectionProfiles` contains governance sections for `spec.md` and `decision-record.md`; `addsAuthoredDocs` contributes no extra file. |
| `phase-parent scaffolds lean trio only` | Snapshot equals `spec.md`, `description.json`, and `graph-metadata.json`; all heavy docs are absent from scaffold output. |
| `minimum viable spec contract validates` | A probe fixture containing only `spec.md`, `description.json`, and `graph-metadata.json` passes the parser-contract validator used by iteration 1; it does not pass `kind=implementation` scaffolder validation unless a minimum-runtime-only mode is requested. |

CI hook:

- Existing integration point: `.opencode/skill/system-spec-kit/scripts/package.json` `test` script, via `vitest run --config ../mcp_server/vitest.config.ts --root .`.
- Root integration point: `.opencode/skill/system-spec-kit/package.json` `test:root`, which already runs `npm run test --workspace=@spec-kit/scripts`.
- Optional dedicated local command: add `test:templates` to `.opencode/skill/system-spec-kit/scripts/package.json` as `vitest run tests/template-scaffold.vitest.ts --config ../mcp_server/vitest.config.ts --root .`.

The prompt asks for 5 preset snapshots plus 1 minimum-viable case. The scaffold matrix names 6 presets if `investigation` is counted as a UX preset. To keep the requested 6-test harness, `investigation` should either be covered by the same baseline file-set assertion as `simple-change` with `kind=investigation`, or the harness should add a seventh snapshot. My recommendation is to add the seventh snapshot during implementation; otherwise one named preset remains unsnapshotted.

## Questions Answered

- Q2 is fully answered for the sample packet matrix. The current Level 1/2/3/3+/phase-parent behavior is reproducible with `kind` plus capability flags.
- Q5 is answered with a complete JSON Schema for `spec-kit-docs.json`.
- Q6 is answered with `kind=phase-parent` and a lean trio scaffold.
- Q8 is answered with practical presets: `simple-change`, `validated-change`, `arch-change`, `governed-change`, `phase-parent`, and `investigation`.
- Q9 is answered with a concrete Vitest harness location, scaffolder signature, snapshot shape, CI integration point, and test cases.

## Questions Remaining

- Q10 still needs implementation-detail resolution: how `create.sh`, `check-files.sh`, generated JS/TS wrappers, and validator adapters consume the manifest without a compatibility layer.
- The final synthesis should decide whether `investigation` is a first-class preset snapshot or an alias that shares the `simple-change` file-set test.
- The count policy should be explicit in the manifest implementation: generated runtime metadata counts as scaffold output, but not as markdown template source.

## Next Focus

Iteration 5 should produce the refactor plan: concrete source changes for `create.sh`, `check-files.sh`, the generated/dist validation entry points, and the new manifest scaffolder. It should also resolve Q10 by choosing inline section-profile gates in the manifest, then produce a risk register for the final synthesis.
