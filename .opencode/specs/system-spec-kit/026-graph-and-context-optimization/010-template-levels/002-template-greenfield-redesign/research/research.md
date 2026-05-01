# Greenfield Template-System Redesign Research

## 1. TL;DR

- Recommendation: implement the C+F hybrid manifest-driven greenfield design. One private manifest drives scaffolding, validation, lifecycle ownership, internal level-contract rows, directories, and section profiles while public workflow language stays level-based.
- Source-file delta: the greenfield design reduces the template-system source surface from the 86-file current baseline to 15 functional source files. The earlier 010 partial framing was only 86 to 83 plus one resolver.
- Killer feature 1: duplicated on-disk `templates/level_N/` folders disappear. Level 1/2/3/3+ and phase-parent stay the public and AI-facing contract, with private manifest internals resolving the implementation contract.
- Killer feature 2: addon docs get lifecycle ownership. `handover.md`, `debug-delegation.md`, `research/research.md`, `resource-map.md`, and `context-index.md` are no longer confused with default authored scaffold docs.
- Killer feature 3: inline gates preserve whole-document markdown authoring while letting validators compare post-gate active sections.
- AI behavior + user conversation flow stays byte-identical. The `--level N` flag stays public; preset/capability/kind names live ONLY in the private manifest.

## 2. Recommendation

Choose C+F hybrid.

The design combines Design C's capability model with Design F's minimal default and lazy addon lifecycle. The reason this wins is not that it is the smallest possible system in isolation. It wins because it separates the contracts that the current level system tangles together:

- runtime discovery core: `spec.md`, `description.json`, and `graph-metadata.json`;
- authored implementation scaffold: `spec.md`, `plan.md`, `tasks.md`, plus level-required addon docs;
- workflow-owned outputs: research, review, handover, debug, and resource maps;
- validation expectations: required files, active sections, section counts, and template headers;
- public level contracts: stable user-facing names like `Level 1`, `Level 2`, `Level 3`, `Level 3+`, and `phase-parent`.

The strong version of the recommendation is:

> C+F hybrid manifest-driven greenfield. 86 to 15 source files. On-disk level folders eliminated; level workflow preserved. Lazy command-owned addons. Single private manifest drives scaffolder and validator internals. Inline-gate sections. Implementation phases live in `plan.md` of the follow-on packet.

AI behavior + user conversation flow stays byte-identical to today. The `--level N` flag remains the public API, and preset/capability/kind names live ONLY in the private manifest and its internal resolver.

Rejected alternatives remain useful as guardrails:

- Design F alone is too thin. It keeps the lean runtime core but cannot express QA, architecture, governance, and addon ownership without hidden rules.
- Design B scaffolds too much. It turns command-owned and workflow-owned docs into stale author starter docs.
- Design D handles section reuse but adds fragment composition complexity that the evidence does not justify.
- Design G is cleanly typed but moves template authorship away from markdown and into schema/data editing.

## 3. Background

The current system encodes documentation shape as Level 1, Level 2, Level 3, Level 3+, and phase-parent. That looks simple at the command surface, but the implementation spreads level meaning across template folders, shell validators, TypeScript validation, README documentation, generated metadata, and phase-parent special cases.

Iteration 1 found that the true runtime discovery core is smaller than the current authored scaffold. Memory indexing can discover packets from `description.json` and `graph-metadata.json`, and resume can fall back to available spec docs. But current ordinary-folder validation still requires `spec.md`, `plan.md`, and `tasks.md`; Level 2 adds `checklist.md`; Level 3 adds `decision-record.md`; Level 3+ changes sections rather than files.

Iteration 2 showed why the level model fails as a design abstraction:

- Some files are authored docs, such as `spec.md`, `plan.md`, and `tasks.md`.
- Some files are command-owned lazy outputs, such as `handover.md`.
- Some files are agent-owned or command-scaffolded lazy handoffs, such as `debug-delegation.md`.
- Some files are workflow-owned packet outputs, such as `research/research.md`.
- Some files are optional author-maintained navigation aids, such as root `resource-map.md` and `context-index.md`.

The level system cannot express those lifecycle differences. It can only say "this level has this file." That is why attempts to simplify the current system by cleaning level folders still leave hardcoded rules in validators and command paths.

The greenfield design removes duplicated level folders as the implementation source of truth, not the public level taxonomy. The public taxonomy remains Level 1/2/3/3+ and phase-parent; private manifest rows map those levels to implementation composition. The manifest owns the internal contract, while `--level N`, `SPECKIT_LEVEL`, and level-shaped validator output remain stable.

## 4. Methodology

This research ran as an externalized deep-research loop over eight evidence iterations plus this final synthesis pass. State lived under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/`.

The loop used:

- iteration narratives in `research/iterations/iteration-001.md` through `research/iterations/iteration-008.md`;
- JSONL state in `research/deep-research-state.jsonl`;
- per-iteration deltas in `research/deltas/iter-001.jsonl` through `research/deltas/iter-008.jsonl`;
- strategy and registry files in `research/deep-research-strategy.md` and `research/findings-registry.json`;
- cross-validation context from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md`.

Iteration focus:

| Iteration | Focus | newInfoRatio |
|---:|---|---:|
| 1 | Parser contract probe and irreducible core inventory | 0.78 |
| 2 | Addon lifecycle classification and level-validator survey | 0.82 |
| 3 | Candidate design elimination | 0.74 |
| 4 | Manifest schema, scaffold matrix, and golden tests | 0.67 |
| 5 | Refactor plan, inline-gate decision, and risk register | 0.58 |
| 6 | Inline-gate grammar, manifest evolution, and edge probes | 0.47 |
| 7 | Concrete integration diffs | 0.41 |
| 8 | End-to-end dry-run of three presets | 0.38 |
| 9 | Final synthesis and convergence | 0.06 |

The investigation started broader than the final answer. It scored multiple designs, challenged the winner with parser contracts and lifecycle ownership, then dry-ran three shapes through the pipeline before synthesis.

## 5. Findings Per Q1-Q10

| Question | Final answer | Evidence |
|---|---|---|
| Q1. Smallest canonical source set? | Runtime core is `spec.md`, `description.json`, `graph-metadata.json`; implementation presets add authored planning docs. The template source should be one manifest plus canonical templates, not duplicated level folders. | Iteration 1 parser/core probe |
| Q2. Can levels become capabilities? | Yes: Level 1 is `kind=implementation`; Level 2 adds `qa-verification`; Level 3 adds `architecture-decisions`; Level 3+ adds `governance-expansion`; phase parent is `kind=phase-parent`. | Iterations 2-4 matrix |
| Q3. Mandatory vs optional vs workflow-owned? | Authored docs are scaffolded; `handover.md` and `debug-delegation.md` are lazy command/agent outputs; `research/research.md` and workflow maps are workflow-owned; root `resource-map.md` and `context-index.md` are optional author aids. | Iteration 2 lifecycle table |
| Q4. Parser/frontmatter contract? | Memory cares about metadata and resume-readable docs, not numeric levels. Greenfield packets need stable metadata and a resolved template contract, not preserved `SPECKIT_LEVEL` semantics. | Iteration 1 parser survey |
| Q5. Single manifest? | Yes. The manifest owns kinds, capabilities, doc templates, directories, lifecycle ownership, section profiles, validation rules, and presets. | Iterations 4-8 |
| Q6. Phase-parent semantics? | `kind=phase-parent` scaffolds only `spec.md`, `description.json`, and `graph-metadata.json`; heavy docs live in children. Explicit contract kind wins over structural child-folder detection. | Iteration 8 dry-run |
| Q7. Addon lifecycle model? | Use `owner`, `creationTrigger`, and `absenceBehavior` per path. A boolean `required` field is too weak. | Iteration 2 |
| Q8. Presets? | v1 catalog: `simple-change`, `validated-change`, `arch-change`, `governed-change`, `phase-parent`, `investigation`, plus internal `runtime-core`. | Iterations 4 and 8 |
| Q9. Authoring confidence? | Add golden Vitest snapshots for preset resolution, scaffolded files, lazy docs, active section profiles, validation rules, and inline-gate rendering. | Iteration 4 test design |
| Q10. Inline gates or fragments? | Inline gates. They preserve whole-document markdown authoring and let validators compare post-gate templates without a fragment composer. | Iterations 5 and 6 |

## 6. Final Design - Manifest Schema

The manifest lives at `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`.

Example v1 manifest:

```json
{
  "manifestVersion": "1.0.0",
  "contractName": "spec-kit-docs",
  "kinds": [
    {
      "id": "implementation",
      "description": "Standard packet with authored planning docs and runtime metadata.",
      "requiredCoreDocs": ["spec.md", "plan.md", "tasks.md"],
      "requiredRuntimeDocs": ["description.json", "graph-metadata.json"],
      "defaultSectionProfiles": ["implementation-core"],
      "defaultValidationRules": ["files", "sections", "template-headers", "section-counts"]
    },
    {
      "id": "phase-parent",
      "description": "Lean parent packet that owns a phase manifest.",
      "requiredCoreDocs": ["spec.md"],
      "requiredRuntimeDocs": ["description.json", "graph-metadata.json"],
      "defaultSectionProfiles": ["phase-parent-core"],
      "defaultValidationRules": ["files", "sections", "template-headers", "phase-parent-content"]
    },
    {
      "id": "investigation",
      "description": "Research packet shell; research outputs are workflow-owned.",
      "requiredCoreDocs": ["spec.md", "plan.md", "tasks.md"],
      "requiredRuntimeDocs": ["description.json", "graph-metadata.json"],
      "defaultSectionProfiles": ["implementation-core"],
      "defaultValidationRules": ["files", "sections", "template-headers"]
    }
  ],
  "capabilities": [
    {
      "id": "qa-verification",
      "description": "Adds authored verification checklist and QA validation.",
      "supportsKinds": ["implementation", "investigation"],
      "conflictsWith": [],
      "addsAuthoredDocs": ["checklist.md"],
      "addsSectionProfiles": ["qa-verification"],
      "addsValidationRules": ["checklist-validation"]
    },
    {
      "id": "architecture-decisions",
      "description": "Adds authored decision record and ADR validation.",
      "supportsKinds": ["implementation", "investigation"],
      "conflictsWith": [],
      "addsAuthoredDocs": ["decision-record.md"],
      "addsSectionProfiles": ["architecture-decisions"],
      "addsValidationRules": ["decision-record-validation"]
    },
    {
      "id": "governance-expansion",
      "description": "Adds governance sections without adding a document.",
      "supportsKinds": ["implementation"],
      "conflictsWith": [],
      "addsAuthoredDocs": [],
      "addsSectionProfiles": ["governance-expansion"],
      "addsValidationRules": ["governance-validation"]
    }
  ],
  "docTemplates": [
    { "path": "spec.md", "templateFile": "templates/spec.md.tmpl", "owner": "author", "creationTrigger": "create.sh", "absenceBehavior": "hard-error" },
    { "path": "plan.md", "templateFile": "templates/plan.md.tmpl", "owner": "author", "creationTrigger": "create.sh", "absenceBehavior": "hard-error" },
    { "path": "tasks.md", "templateFile": "templates/tasks.md.tmpl", "owner": "author", "creationTrigger": "create.sh", "absenceBehavior": "hard-error" },
    { "path": "checklist.md", "templateFile": "templates/checklist.md.tmpl", "owner": "author", "creationTrigger": "capability:qa-verification", "absenceBehavior": "hard-error" },
    { "path": "decision-record.md", "templateFile": "templates/decision-record.md.tmpl", "owner": "author", "creationTrigger": "capability:architecture-decisions", "absenceBehavior": "hard-error" },
    { "path": "implementation-summary.md", "templateFile": "templates/implementation-summary.md.tmpl", "owner": "author", "creationTrigger": "completion", "absenceBehavior": "warn" },
    { "path": "description.json", "owner": "runtime", "creationTrigger": "create.sh", "absenceBehavior": "hard-error" },
    { "path": "graph-metadata.json", "owner": "runtime", "creationTrigger": "create.sh", "absenceBehavior": "hard-error" },
    { "path": "handover.md", "templateFile": "templates/handover.md.tmpl", "owner": "command", "creationTrigger": "/memory:save", "absenceBehavior": "silent-skip" },
    { "path": "debug-delegation.md", "templateFile": "templates/debug-delegation.md.tmpl", "owner": "agent", "creationTrigger": "debug delegation threshold", "absenceBehavior": "silent-skip" },
    { "path": "research/research.md", "templateFile": "templates/research.md.tmpl", "owner": "workflow", "creationTrigger": "/spec_kit:deep-research", "absenceBehavior": "silent-skip" },
    { "path": "resource-map.md", "templateFile": "templates/resource-map.md.tmpl", "owner": "author", "creationTrigger": "explicit resource-map option", "absenceBehavior": "warn" },
    { "path": "context-index.md", "templateFile": "templates/context-index.md.tmpl", "owner": "author", "creationTrigger": "phase migration bridge", "absenceBehavior": "warn" }
  ],
  "directories": [
    { "path": "scratch", "owner": "runtime", "creationTrigger": "create.sh", "absenceBehavior": "warn" },
    { "path": "research/iterations", "owner": "workflow", "creationTrigger": "/spec_kit:deep-research", "absenceBehavior": "silent-skip" },
    { "path": "research/deltas", "owner": "workflow", "creationTrigger": "/spec_kit:deep-research", "absenceBehavior": "silent-skip" }
  ],
  "sectionProfiles": [
    {
      "id": "implementation-core",
      "requiredAnchorsByFile": {
        "spec.md": ["Problem Statement", "Requirements", "Scope"],
        "plan.md": ["Technical Context", "Architecture", "Implementation"],
        "tasks.md": ["Task List"]
      },
      "minimumCounts": {
        "h2ByFile": { "spec.md": 5, "plan.md": 4, "tasks.md": 1 },
        "requirements": 3,
        "acceptanceScenarios": 2
      }
    },
    {
      "id": "qa-verification",
      "requiredAnchorsByFile": {
        "spec.md": ["Verification Notes"],
        "checklist.md": ["Verification Protocol", "Code Quality"]
      },
      "minimumCounts": {
        "h2ByFile": { "spec.md": 6, "checklist.md": 2 },
        "requirements": 5,
        "acceptanceScenarios": 4
      }
    },
    {
      "id": "architecture-decisions",
      "requiredAnchorsByFile": {
        "spec.md": ["Architectural Decisions"],
        "decision-record.md": ["Context", "Decision", "Consequences"]
      },
      "minimumCounts": {
        "h2ByFile": { "spec.md": 7, "decision-record.md": 3 },
        "requirements": 6,
        "acceptanceScenarios": 4
      }
    },
    {
      "id": "phase-parent-core",
      "requiredAnchorsByFile": {
        "spec.md": ["Purpose", "Phase Manifest", "Current Status"]
      },
      "minimumCounts": {
        "h2ByFile": { "spec.md": 3 },
        "requirements": 0,
        "acceptanceScenarios": 0
      }
    }
  ],
  "presets": [
    { "namespace": "core", "name": "simple-change", "kind": "implementation", "capabilities": [] },
    { "namespace": "core", "name": "validated-change", "kind": "implementation", "capabilities": ["qa-verification"] },
    { "namespace": "core", "name": "arch-change", "kind": "implementation", "capabilities": ["qa-verification", "architecture-decisions"] },
    { "namespace": "core", "name": "governed-change", "kind": "implementation", "capabilities": ["qa-verification", "architecture-decisions", "governance-expansion"] },
    { "namespace": "core", "name": "phase-parent", "kind": "phase-parent", "capabilities": [] },
    { "namespace": "core", "name": "investigation", "kind": "investigation", "capabilities": [] }
  ]
}
```

Two details matter:

- `requiredAnchorsByFile` replaces the earlier flat `requiredAnchors` shape. The flat version would incorrectly apply every anchor to every file.
- `implementation-summary.md` is warning/lifecycle-gated in the manifest example because the current completion contract creates or finalizes it after implementation. A follow-on implementation packet may choose to scaffold it from day one for implementation packets, but that must be explicit and tested.

## 7. Final Design - Inline-Gate Grammar

Inline gates are a template-rendering contract, not shell string filtering. The canonical renderer should live at `.opencode/skill/system-spec-kit/mcp_server/lib/templates/inline-gates.ts`, with shell consumers calling compiled output or a narrow wrapper from `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`.

Syntax example:

```md
<!-- IF capability:architecture-decisions -->
## Architectural Decisions
<!-- /IF -->
```

Formal grammar from iteration 6:

```ebnf
gate-open      ::= "<!--" ws "IF" ws expr ws "-->"
gate-close     ::= "<!--" ws "/IF" ws "-->"
expr           ::= or-expr
or-expr        ::= and-expr { ws "OR" ws and-expr }
and-expr       ::= unary-expr { ws "AND" ws unary-expr }
unary-expr     ::= [ "NOT" ws ] primary
primary        ::= atom | "(" ws expr ws ")"
atom           ::= axis ":" ident
axis           ::= "capability" | "kind" | "preset"
ident          ::= lower { lower | digit | "-" }
ws             ::= { " " | "\t" }
lower          ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
digit          ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

Rules:

- Precedence is `NOT`, then `AND`, then `OR`.
- Parentheses are allowed.
- Nested gates are allowed only if balanced.
- Unknown axes are hard errors.
- Gate markers inside fenced code blocks are ignored.
- Gates must wrap complete markdown blocks. A full list item is valid; heading text, inline prose, table rows, blockquote continuations, and code fences are invalid gate locations.
- There is no `ELSE`. Use sibling gates for alternatives.

Validators consume post-gate rendered templates. A stripped inactive section is not missing. An active section that fails to render is a hard error.

## 8. Final Design - Addon Lifecycle Map

| Artifact | Owner | Creation trigger | Author edited after creation? | Absence behavior |
|---|---|---|---|---|
| `handover.md` | command | `/memory:save` handover routing | Normally no | silent skip |
| `debug-delegation.md` | command scaffold, then agent | debug threshold and `@debug` dispatch | Limited pre-dispatch fill-in | silent skip |
| `research/research.md` | workflow | `/spec_kit:deep-research` synthesis | No | silent skip |
| `research/resource-map.md` | workflow | deep-research convergence | No | silent skip |
| `review/resource-map.md` | workflow | deep-review convergence | No | silent skip |
| root `resource-map.md` | author | explicit path-ledger option | Yes | warn |
| `context-index.md` | author | phase migration/reorganization bridge | Yes | warn |
| `description.json` | runtime | create/save metadata generation | No manual edits | hard error |
| `graph-metadata.json` | runtime | create/save metadata generation | No manual edits except documented metadata repair | hard error |

This table is the reason the manifest needs ownership. A boolean `required` field is too weak.

## 9. Final Design - Preset Catalog

| Preset | Kind | Capabilities | Scaffolded authored docs | Runtime docs | Notes |
|---|---|---|---|---|---|
| `simple-change` | `implementation` | none | `spec.md`, `plan.md`, `tasks.md` | `description.json`, `graph-metadata.json` | Level 1 replacement |
| `validated-change` | `implementation` | `qa-verification` | simple docs plus `checklist.md` | same runtime docs | Level 2 replacement |
| `arch-change` | `implementation` | `qa-verification`, `architecture-decisions` | validated docs plus `decision-record.md` | same runtime docs | Level 3 replacement |
| `governed-change` | `implementation` | `qa-verification`, `architecture-decisions`, `governance-expansion` | same files as `arch-change` | same runtime docs | Level 3+ replacement; section-only expansion |
| `phase-parent` | `phase-parent` | none | `spec.md` | `description.json`, `graph-metadata.json` | Lean parent only |
| `investigation` | `investigation` | none by default | `spec.md`, `plan.md`, `tasks.md` | `description.json`, `graph-metadata.json` | Research output remains workflow-owned |
| `runtime-core` | internal/test | none | `spec.md` | `description.json`, `graph-metadata.json` | Parser-contract fixture, not normal user preset |

The catalog should stay intentionally small. Preset sprawl would recreate levels under friendlier names.

## 10. Refactor Plan - Phase-by-Phase

The follow-on implementation packet should stage the work so the manifest can be tested before shell behavior changes.

### Phase 1. Manifest Core

Add:

- `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`
- `.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/templates/inline-gates.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/template-scaffold.vitest.ts`

Implement:

- manifest schema validation;
- preset resolution with namespace support;
- `supportsKinds` and `conflictsWith` checks;
- post-gate rendering;
- `requiredAnchorsByFile`;
- stable resolved `templateContract` output.

### Phase 2. Manifest Templates

Add or port:

- `.opencode/skill/system-spec-kit/templates/manifest/templates/spec.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/plan.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/tasks.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/checklist.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/decision-record.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/implementation-summary.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/phase-parent.spec.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/handover.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/debug-delegation.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/research.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/resource-map.md.tmpl`
- `.opencode/skill/system-spec-kit/templates/manifest/templates/context-index.md.tmpl`

Keep the 15-file source target by treating these as the functional source surface plus manifest/loader utilities. Legacy level folders are removed only after tests prove parity.

### Phase 3. Scaffolder Integration

Modify `.opencode/skill/system-spec-kit/scripts/spec/create.sh`:

- replace primary `--level` with `--preset`;
- keep `--level` as a legacy alias mapping `1 -> simple-change`, `2 -> validated-change`, `3 -> arch-change`, `3+ -> governed-change`;
- scaffold author-owned docs from the manifest;
- generate runtime metadata after contract resolution;
- write `graph-metadata.json.derived.template_contract`;
- mirror `templateContract` into `description.json` or make the description generator read the graph snapshot;
- make `phase-parent` create only the parent unless child specs are explicitly supplied.

Modify `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` only as a thin shell bridge. The canonical logic belongs in TypeScript.

### Phase 4. Validator Integration

Modify:

- `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`

Rules:

- required docs come from the resolved contract;
- required sections come from `sectionProfiles.requiredAnchorsByFile`;
- minimum counts come from merged `minimumCounts`;
- header comparison uses `compare-manifest` against post-gate templates;
- orphan authored docs warn, never auto-delete;
- command/workflow lazy docs are skipped when absent.

### Phase 5. Legacy Removal

Delete or relocate level-era template sources only after snapshot and strict validation pass:

- `.opencode/skill/system-spec-kit/templates/level_1/`
- `.opencode/skill/system-spec-kit/templates/level_2/`
- `.opencode/skill/system-spec-kit/templates/level_3/`
- `.opencode/skill/system-spec-kit/templates/level_3+/`
- `.opencode/skill/system-spec-kit/templates/addendum/`
- `.opencode/skill/system-spec-kit/templates/core/`
- `.opencode/skill/system-spec-kit/templates/examples/`
- `.opencode/skill/system-spec-kit/templates/phase_parent/`

Move stress-test assets out of `templates/` if they remain useful.

### ADR-002. Manifest Version Validation

Decision: greenfield v1 requires exact `manifestVersion` match. No adapter layer ships until the first real migration exists.

Reasoning: adapters designed before real migration pressure are speculative. Exact-match validation fails loudly and keeps v1 implementation smaller. The future adapter design is recorded in section 16.

### ADR-003. Phase Parent Creation

Decision: `phase-parent --name X` creates only the parent. Child phase definitions come through subsequent invocations such as `create.sh --subfolder` or a specific phase-child command surface.

Reasoning: forcing child definitions at parent creation mixes two workflows. A lean parent is useful before decomposition is complete.

### ADR-004. Template Contract Frontmatter

Decision: only `spec.md` carries template-contract frontmatter among authored docs. The durable machine copy lives in `graph-metadata.json.derived.template_contract`; `description.json.templateContract` may mirror it.

Reasoning: every authored doc carrying the same block creates drift and noisy reviews. `spec.md` is enough for local inspection; metadata is enough for machines.

## 11. Risk Register

| Rank | ID | Description | Impact | Likelihood | Mitigation | Owner |
|---:|---|---|---|---|---|---|
| 1 | R-001 | False simplicity: presets can hide a new matrix if commands hardcode mappings. | H | M | Make `spec-kit-docs.json` the only mapping source and snapshot every preset. | Spec Kit maintainer |
| 2 | R-002 | Shell and TS validators parse manifest differently. | H | M | Put canonical parsing in `manifest-loader.ts`; shell consumes compiled output. | Validation owner |
| 3 | R-003 | Authors scaffold command/workflow-owned docs by mistake. | H | M | Enforce `owner` and `absenceBehavior`; snapshots assert lazy docs are not scaffolded. | Scaffolder owner |
| 4 | R-004 | Section-only traits such as governance get lost because no file appears. | H | M | Schema fails no-op capabilities unless they add docs, profiles, or rules. | Manifest owner |
| 5 | R-005 | `silent-skip` masks genuinely missing author docs. | H | M | Reject `owner=author` plus `silent-skip` unless explicitly optional. | Validation owner |
| 6 | R-006 | Manifest schema evolution breaks old packets. | M | M | Use exact v1 matching now; add adapters only with real migrations. | Spec Kit maintainer |
| 7 | R-007 | Preset sprawl recreates level confusion. | M | M | Keep v1 catalog small; require tests and design notes for new presets. | Workflow owner |
| 8 | R-008 | Inline gates become unreadable when nested deeply. | M | L | Lint nested gates and invalid locations; prefer simple block gates. | Template owner |
| 9 | R-009 | Runtime metadata drifts from rendered docs. | H | L | Generate metadata from the same resolved contract after scaffolding. | Scaffolder owner |
| 10 | R-010 | Legacy level folders remain and attract future edits. | M | H | Delete or relocate them in the same PR that adds manifest templates. | Migration owner |
| 11 | R-011 | Golden tests snapshot paths but miss gate rendering. | M | M | Snapshot included and excluded anchors for each gated capability. | Test owner |
| 12 | R-012 | Phase-parent logic remains a manual `create.sh` branch. | M | M | Make `phase-parent` a normal preset; only phase-row injection stays special. | Phase workflow owner |

## 12. Manifest Evolution Policy

The manifest uses `manifestVersion`, not `schemaVersion`. JSON Schema keeps its own `$schema` and `$id`.

| Scenario | Version impact | Mitigation | Validator behavior |
|---|---|---|---|
| Add capability | Minor | Add `supportsKinds`, docs/profiles/rules, and tests | Existing packets ignore unless they opt in |
| Remove capability | Major | Deprecate first; provide migration | New scaffolds hard-error; old snapshots warn if supported |
| Rename capability | Major, or minor with alias | Add new, deprecate old, migrate explicitly | Old snapshots warn; unknown old IDs hard-error without adapter |
| Add section to existing capability | Minor for new snapshots | Existing packets keep recorded profile set | New/refreshed packets require it |
| Remove section from capability | Major if active | Deprecate profile first; never delete content automatically | Existing snapshots continue or warn |

Packet metadata stores a resolved contract:

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
    "checklist.md",
    "decision-record.md",
    "description.json",
    "graph-metadata.json"
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

For v1, validators require exact `manifestVersion`. Migration adapters are future work.

## 13. Edge-Case Probe Results + Mitigations

| Edge case | Result | Mitigation |
|---|---|---|
| Capability A requires section X while capability B forbids it | Breaks naive additive model | Use `conflictsWith`; avoid general forbidden-section rules |
| `phase-parent` declares `architecture-decisions` | Should be invalid by default | Enforce `supportsKinds`; parent can have an index profile, not child ADR docs |
| Investigation packets need `research/` directories | File-only manifest is insufficient | Add `directories[]` with owner and absence behavior |
| User wants checklist without strict QA gate | Coarse capabilities are too large | Split capabilities when partial use is plausible; presets compose them |
| User removes capability but authored doc remains | Auto-delete would be unsafe | Emit orphan warning; future prune/archive command may move content |
| Duplicate preset names across namespaces | Ambiguous command input | Accept short name only when unique; otherwise require `namespace:name` |
| New childless phase parent | Structural detection fails | Explicit contract kind wins; `is_phase_parent` is legacy fallback |
| Count lookup for `spec.md` key | Dotted paths fail on literal dots | Use `requiredAnchorsByFile` and key-safe JSON helpers |
| Raw template header comparison | Inactive gated sections look missing | Compare post-gate rendered expected templates |

## 14. Dry-Run Verification

Iteration 8 dry-ran three presets through the proposed pipeline.

### `simple-change`

Resolved state:

| Field | Value |
|---|---|
| `preset` | `core:simple-change` |
| `kind` | `implementation` |
| `capabilities` | none |
| `requiredDocs` | `spec.md`, `plan.md`, `tasks.md`, `description.json`, `graph-metadata.json` |
| `sectionProfiles` | `implementation-core` |
| `validationRules` | `files`, `sections`, `template-headers`, `section-counts` |

Intermediate checks:

- authored docs copied: `spec.md`, `plan.md`, `tasks.md`;
- runtime docs generated: `description.json`, `graph-metadata.json`;
- inactive QA and architecture gates stripped;
- validator requires implementation-core anchors only.

Broken step found: command surface in iteration 7 did not fully support `--name` plus explicit target path. Fix: add explicit parser support before documenting that invocation.

### `arch-change`

Resolved state:

| Field | Value |
|---|---|
| `preset` | `core:arch-change` |
| `kind` | `implementation` |
| `capabilities` | `qa-verification`, `architecture-decisions` |
| `requiredDocs` | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `description.json`, `graph-metadata.json` |
| `sectionProfiles` | `implementation-core`, `qa-verification`, `architecture-decisions` |

Intermediate checks:

- authored docs copied: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`;
- active gates include QA and architecture blocks;
- graph metadata `source_docs` contains authored markdown only;
- required files still include runtime metadata.

Broken step found: `template-structure.js compare-manifest` is required before header validation can run. Fix: implement it in `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`.

### `phase-parent`

Resolved state:

| Field | Value |
|---|---|
| `preset` | `core:phase-parent` |
| `kind` | `phase-parent` |
| `capabilities` | none |
| `requiredDocs` | `spec.md`, `description.json`, `graph-metadata.json` |
| `sectionProfiles` | `phase-parent-core` |
| `validationRules` | `files`, `sections`, `template-headers`, `phase-parent-content` |

Intermediate checks:

- authored docs copied: `spec.md`;
- runtime docs generated: `description.json`, `graph-metadata.json`;
- implementation sections stripped;
- validator must not require child-heavy docs at the parent.

Broken step found: childless phase-parent cannot depend on structural child-folder detection. Fix: explicit `kind=phase-parent` in contract wins.

## 15. File/LOC Deltas

Two baselines matter:

| Framing | Delta |
|---|---|
| 010 partial redesign | 86 current template-system source files to 83 plus one resolver |
| 011 greenfield redesign | 86 current template-system source files to 15 functional source files |

The greenfield 15-file target:

```text
.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json
.opencode/skill/system-spec-kit/templates/manifest/templates/spec.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/plan.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/tasks.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/implementation-summary.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/checklist.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/decision-record.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/phase-parent.spec.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/resource-map.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/context-index.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/handover.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/debug-delegation.md.tmpl
.opencode/skill/system-spec-kit/templates/manifest/templates/research.md.tmpl
.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh
.opencode/skill/system-spec-kit/mcp_server/lib/templates/manifest-loader.ts
```

Practical implementation may add `.opencode/skill/system-spec-kit/mcp_server/lib/templates/inline-gates.ts` as a separate file. If so, keep the spirit of the target by counting it as the shared renderer that removes complexity from shell scripts, not as a regression into a template folder matrix.

Per-level directories deleted after parity:

- `.opencode/skill/system-spec-kit/templates/level_1/`
- `.opencode/skill/system-spec-kit/templates/level_2/`
- `.opencode/skill/system-spec-kit/templates/level_3/`
- `.opencode/skill/system-spec-kit/templates/level_3+/`
- `.opencode/skill/system-spec-kit/templates/addendum/`
- `.opencode/skill/system-spec-kit/templates/core/`
- `.opencode/skill/system-spec-kit/templates/examples/`
- `.opencode/skill/system-spec-kit/templates/phase_parent/`

Addon stubs eliminated from default scaffolds:

- `handover.md`;
- `debug-delegation.md`;
- `research/research.md`;
- workflow-owned `research/resource-map.md`;
- optional `context-index.md`;
- optional root `resource-map.md`.

## 16. Open Items / Future Work

The three iteration-8 open questions are resolved:

| Item | Resolution |
|---|---|
| Should every authored doc carry template-contract frontmatter? | No. Only `spec.md` carries it; metadata carries the durable machine contract. |
| Should current-manifest validation support older `manifestVersion` values via adapters? | Not in v1. Require exact match until the first real migration. |
| Should `phase-parent --name X` require child phase definitions? | No. Create only the parent; children are explicit subsequent invocations. |

Future work:

- Design the first manifest-version migration adapter when v1 has a concrete breaking change.
- Decide whether `implementation-summary.md` is scaffolded from day one or remains lifecycle/warn-gated.
- Implement `compare-manifest` in `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`.
- Wire `generate-description.js` and graph metadata creation to the same resolved contract.
- Add orphan authored-doc warnings.
- Add a prune/archive command only after warning behavior is proven.
- Add a compatibility report for existing non-greenfield packets if backward compatibility returns to scope.

Migration adapter sketch:

1. Read packet `graph-metadata.json.derived.template_contract.manifestVersion`.
2. If equal to current manifest, validate normally.
3. If older and an adapter exists, transform the packet-local contract to the current resolver shape without mutating authored docs.
4. Emit a warning that validation used an adapter.
5. Require an explicit migration command to rewrite `spec.md` frontmatter or metadata.

No adapter should silently drop capabilities, sections, or authored docs.

## 17. Appendices

### Appendix A. Graph From Iterations 1-8

| Iteration | Main graph edges |
|---:|---|
| 1 | `memory-parser.ts -> description.json`; `memory-parser.ts -> graph-metadata.json`; `resume-ladder.ts -> spec docs`; `reduce-state.cjs -> deep-research-state.jsonl` |
| 2 | `content-router.ts -> handover.md`; `scaffold-debug-delegation.sh -> debug-delegation.md`; `deep-research.md -> research/research.md`; `reduce-state.cjs -> research/resource-map.md` |
| 3 | `Design C+F hybrid -> qa-verification`; `Design C+F hybrid -> architecture-decisions`; `Design C+F hybrid -> phase-parent`; `Design C+F hybrid -> workflow-owned-packet` |
| 4 | `spec-kit-docs.json -> kind=implementation`; `spec-kit-docs.json -> kind=phase-parent`; `template-scaffold.vitest.ts -> scaffoldFromManifest` |
| 5 | `spec-kit-docs.json -> create.sh`; `spec-kit-docs.json -> check-files.sh`; `spec-kit-docs.json -> check-sections.sh`; `manifest-loader.ts -> spec-doc-structure.ts` |
| 6 | `inline-gate-renderer -> check-sections.sh`; `manifestVersion -> template_contract`; `conflictsWith -> manifest-loader`; `directories -> research/iterations` |
| 7 | `template_contract -> check-files.sh`; `sectionProfiles -> check-sections.sh`; `minimumCounts -> check-section-counts.sh`; `active authored docs -> check-template-headers.sh` |
| 8 | `simple-change -> spec/plan/tasks/metadata`; `arch-change -> checklist/decision-record`; `phase-parent -> lean trio`; `requiredAnchorsByFile -> check-sections.sh` |

### Appendix B. Commands Run

Representative command classes used during the loop:

```bash
sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md
sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md
find .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research -maxdepth 3 -type f | sort
wc -c .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-00*.md
```

### Appendix C. Cross-Validation Summary

Cross-validation in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md` framed the scope around minimal source set, capability flags, lifecycle ownership, parser/frontmatter contract, manifest-driven validation, phase-parent semantics, addon lifecycle, and authoring confidence. The loop answered those and added Q10, the inline-gates-versus-fragments decision.

The cross-validation warning held: simplification is real only if the manifest is the single source for scaffold and validation. A small template folder with hardcoded shell rules would only move the complexity.

### Convergence Declaration

All 10 design questions are answered. The last synthesis pass produced `newInfoRatio=0.06`, below the `0.10` threshold. Status: `converged`.

## §18. WORKFLOW-INVARIANCE ADDENDUM (iters 10-13)

<!-- ANCHOR:workflow-invariance-addendum -->

### 18.1 Why The Loop Reopened

The loop reopened on 2026-05-01 because the user added a stronger invariant after the original iteration-9 convergence: AI behavior, Gate 3 behavior, user conversation flow, command syntax, generated packet markers, and user-visible validator output must remain level-based and byte-identical in shape. That constraint does not reject the C+F hybrid. It corrects the public/private boundary.

The earlier shorthand that implied level vocabulary would go away was too broad. Corrected recommendation language:

> The on-disk `templates/level_N/` folders disappear; the `--level N` user-facing API stays.

AI behavior + user conversation flow stays byte-identical. The `--level N` flag stays public; preset/capability/kind names live ONLY in the private manifest and internal resolver.

### 18.2 Public Contract vs Private Implementation

The key insight from iterations 10-13 is simple:

- Levels are the PUBLIC contract.
- Kind, capabilities, preset, section profiles, and manifest rows are PRIVATE implementation.

Public and AI-facing surfaces keep `Level 1`, `Level 2`, `Level 3`, `Level 3+`, phase-parent wording, `--level N`, `DOC_LEVEL`, `<!-- SPECKIT_LEVEL: N -->`, `level: N`, and `spec_level`. The scaffolder and validators may privately call `resolveLevelContract(level)` and read `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`, but they must not emit internal taxonomy terms into help text, command docs, skill text, validator output, generated Markdown, or AI-readable packet metadata.

### 18.3 Iteration 10 Audit Findings

Iteration 10 found that the workflow-invariant constraint is compatible with the C+F design if the public boundary remains level-shaped:

- Gate 3 classifier remains unchanged. It detects write/read/resume intent and presents the same folder options; it must not learn preset/capability/kind vocabulary.
- AI-facing skill text remains unchanged in vocabulary. `system-spec-kit`, root policy docs, slash-command markdown, and orchestrator prompts continue to talk about documentation levels.
- Level vocabulary is preserved across command surfaces, validator output, generated markers, and resume-readable packet files.
- The old iteration-7 `--preset` public proposal is rejected for v1. `create.sh --level N` remains the documented and normal entrypoint.
- `SPECKIT_LEVEL`, `level`, and `spec_level` remain backward-readable anchors.

### 18.4 Iteration 11 ADR-005 + Resolver Summary

Iteration 11 drafted ADR-005 and specified the invariant-safe bridge:

```ts
resolveLevelContract(level: '1' | '2' | '3' | '3+' | 'phase'): LevelContract
```

Returned fields are level-shaped and safe for shell/validator boundaries: `requiredCoreDocs`, `requiredAddonDocs`, `lazyAddonDocs`, `sectionGates`, and `frontmatterMarkerLevel`. The resolver may traverse the private manifest internally, but callers must not receive or print raw `preset`, `capability`, or `kind` names. Resolver failures are remapped to `Internal template contract could not be resolved for Level N`.

### 18.5 ADR-005. Workflow-Invariant Level Contract

**Status:** Accepted

**Date:** 2026-05-01

**Deciders:** Spec Kit maintainer, workflow-invariant constraint owner, deep-research iteration 11

**Context:** On 2026-05-01 the user added a workflow invariant: AI behavior, Gate 3 behavior, user conversation flow, command syntax, authored packet markers, and user-visible validator output must remain level-based. The C+F manifest design can still remove duplicated template source folders, but it must not introduce a new public taxonomy. Iteration 10 found that earlier iteration-007 and iteration-009 wording leaked `preset`, `capability`, and `kind` into public CLI help, validator messages, metadata, and synthesis language.

**Decision:** Level vocabulary remains the sole public and AI-facing contract. `Level 1`, `Level 2`, `Level 3`, `Level 3+`, and phase-parent remain the user-facing taxonomy in `CLAUDE.md`, `AGENTS.md`, command markdown, skill text, generated packet markers, validator output, and CLI help. Preset, capability, and kind names are strictly internal to `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`, the TypeScript resolver, and scaffolder internals. The public bridge is `resolveLevelContract(level)`.

**Specific bans:**

- No public `--preset X` flag. Drop it from `create.sh --help`, examples, slash-command docs, and AI-facing skill text. If test-only fixture generation needs a non-level selector, it must be private, undocumented, and unable to appear in normal help or logs.
- No mention of `preset`, `capability`, or `kind` in `CLAUDE.md`, `AGENTS.md`, command markdown, agent prompts, `.opencode/skill/system-spec-kit/SKILL.md`, validator error messages, validator remediation text, scaffolder log lines, or frontmatter exposed to the AI.
- Keep `--level N`, `<!-- SPECKIT_LEVEL: N -->`, existing `level: N` frontmatter, `spec_level` metadata, and the Level 1/2/3/3+ taxonomy in user-facing docs.

**Implementation:** Replace the iteration-007 public `--preset` proposal with level-only public diffs. Canonical API: `.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts::resolveLevelContract(level)`. Shell bridge: `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh::resolve_level_contract <level>`. `create.sh` keeps `DOC_LEVEL`, `--level`, `DOC_LEVEL` JSON, and Level-shaped logs. Validator rules consume the resolved contract internally but emit only Level-shaped or taxonomy-neutral messages.

**Consequences:** Workflow invariance improves because existing AI prompts, slash commands, Gate 3 behavior, and user muscle memory remain stable. Maintainability improves because duplicated `templates/level_N/` source folders can disappear after parity, while level semantics resolve from one manifest row. The cost is one adapter layer, and v1 cannot expose arbitrary named presets without a future ADR that reopens the public workflow contract.

ADR-005 narrows ADR-001 without superseding it. ADR-001 still chooses the C+F hybrid manifest-driven greenfield design; ADR-005 constrains how that design is exposed. It also narrows ADR-004's metadata implications: AI-readable metadata must not persist raw private taxonomy fields.

### 18.6 Iteration 12 11-Surface Audit

Iteration 12 audited eleven live or proposed output surfaces and confirmed the public vocabulary can remain level-shaped:

- `create.sh --help`, normal stdout, JSON stdout, phase-parent logs, and sharded warnings are already level-only.
- `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, `validate.sh`, generated `description.json`, and generated `graph-metadata.json` can stay level-only or taxonomy-neutral.
- Generated `spec.md` content preserves `SPECKIT_LEVEL` and `| **Level** | N |`.
- Two minor leaks were identified in generated template language, not in the design contract.

### 18.7 Iteration 13 Conversation Dry-Run

Iteration 13 dry-ran five user-conversation scenarios. All 5 PASS workflow-invariance:

| Scenario | Result |
|---|---|
| Routine implementation with fresh spec folder | PASS: AI says Level 2, file names, and packet language only. |
| Architectural change requiring `decision-record.md` | PASS: AI says Level 3 and names the public file directly. |
| Phase-parent migration | PASS: AI uses Gate 3 Option E and phase-parent wording without internal taxonomy. |
| Validator-failure remediation | PASS: diagnosis is level-shaped: `Level 3 packet missing required file: decision-record.md`. |
| Resume | PASS: AI summarizes by Level 3 packet state, docs, and next task. |

### 18.8 Two Leak Fixes + CI

Apply these replacements in the follow-on implementation packet:

1. Replace `[capability]` placeholders with `[needed behavior]`.

   ```text
   **As a** [user type], **I want** [needed behavior], **so that** [benefit].
   ```

   Also replace addendum frontmatter and keywords:

   ```text
   title: "As a [user type], I want [needed behavior], so that [benefit]. [template:addendum/level3-arch/spec-level3-suffix.md]"
   description: "As a [user type], I want [needed behavior], so that [benefit]."
   ```

   Replace keyword entry `"capability"` with `"needed behavior"`.

2. Replace phase-parent wording:

   ```text
   - Sub-phase list: which child phase folders exist and what each one does
   ```

Workflow-invariance CI should be a single Vitest file under `.opencode/skill/system-spec-kit/scripts/tests/`, for example `workflow-invariance.vitest.ts`. It should scan live script outputs, generated fixture snapshots, template sources, command docs, agent prompts, and skill/root policy docs for banned public taxonomy terms. It should allow historical research references only through explicit path/section allowlists, and existing affected fixtures should be rewritten immediately in the same implementation PR.

### 18.9 Final Recommendation + Convergence

Final recommendation:

> C+F hybrid manifest-driven greenfield. Public surface: today's `--level N`, Gate 3 classifier, AI conversation flow -- all UNCHANGED. Private surface: 86 -> 15 source files; level->preset->capabilities resolver inside scaffolder + validator; level dirs deleted. ADR-001 chooses C+F hybrid. ADR-005 locks in workflow invariance.

Iteration 14 produced `newInfoRatio=0.08`, below the `0.10` threshold. Status: `converged`. This pass introduced no new design direction; it only consolidated iterations 10-13, corrected public recommendation language, appended ADR-005, and locked the final workflow-invariance boundary.

<!-- /ANCHOR:workflow-invariance-addendum -->
