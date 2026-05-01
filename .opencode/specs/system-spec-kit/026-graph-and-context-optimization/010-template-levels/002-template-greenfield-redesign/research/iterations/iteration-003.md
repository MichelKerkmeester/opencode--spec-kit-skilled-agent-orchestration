# Iteration 3: Design Elimination Round

## Focus

DESIGN ELIMINATION ROUND. Score the five candidate designs against the parser-contract reality from iteration 1 and the addon-lifecycle table from iteration 2. Eliminate designs that conflate owner, trigger, absence behavior, section/header expectations, or runtime metadata. Pick a winner or narrow to finalists for iteration 4.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md` first to preserve the parser and irreducible-core baseline.
- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-002.md` second to preserve the addon lifecycle and level-validator baseline.
- Loaded the `sk-deep-research` quick reference and iteration contract.
- Re-read `.opencode/skill/system-spec-kit/templates/README.md` and `.opencode/skill/system-spec-kit/assets/template_mapping.md` to verify current level rows, phase-parent behavior, and Level 3+ section-only expansion.
- Listed the broader current template, rule, utility, metadata, and validation source surface under `.opencode/skill/system-spec-kit/`; the broad touched surface is 151 files, while this research packet's stated current template-system comparison baseline remains 86 files.
- Scored designs F, C+F hybrid, B, D, and G against R1-R7.

## Findings

### Scoring Matrix

Scores use 1-5. A high total does not automatically survive if the design violates lifecycle ownership or authoring ergonomics.

| Rubric | F | C+F hybrid | B | D | G |
|---|---|---|---|---|---|
| R1: Expresses irreducible core without forcing extra files | 5 - starts from `spec.md`, `description.json`, and `graph-metadata.json` only | 5 - can model runtime core separately from authored capabilities | 2 - full addon scaffolding forces non-core files into new packets | 4 - can compose a lean core, but composer surface is larger than the core | 5 - schema can render only the runtime core |
| R2: Distinguishes `author-scaffolded`, `command-owned-lazy`, and `workflow-owned-packet` cleanly | 1 - treats every addon as command-owned lazy | 5 - lifecycle owner, trigger, and absence behavior remain separate fields | 1 - scaffolds command and workflow outputs as author starter docs | 3 - possible in manifest, but the fragment model is aimed at sections, not ownership | 5 - schema can encode owner and lifecycle as separate data |
| R3: Single manifest drives scaffolder and validator | 2 - no real manifest model beyond absence warnings | 5 - manifest is the shared source for scaffold and validation | 5 - explicitly manifest-driven | 4 - manifest plus composer can drive both, but section order becomes a second contract | 5 - schema is the manifest and renderer source |
| R4: Capability flags reproduce today's level matrix without hardcoded level lookup | 1 - no capability matrix for `qa-verification`, `architecture-decisions`, or `governance-expanded` | 5 - Level 1/2/3/3+ map naturally to ordinary packet plus capabilities | 4 - possible, but starter-addon behavior pollutes the matrix | 4 - possible with section profiles and doc capabilities | 5 - possible through typed capability data |
| R5: Section-level variance handleable | 1 - warnings on absent addon files do not express arch-only or governance-only sections | 5 - section profiles can attach to doc templates by capability | 3 - full-document variants can handle this but duplicate whole docs | 5 - strongest section reuse model | 5 - strongest typed section control |
| R6: Authoring ergonomics through markdown edits | 3 - minimal markdown exists, but most docs become generated command artifacts | 5 - maintainers edit canonical markdown templates | 5 - maintainers edit full markdown templates | 2 - maintainers edit small fragments and composer order, not whole docs | 1 - maintainers edit TypeScript schema, not markdown |
| R7: Phase-parent semantics representable cleanly | 3 - lean parent is possible, but no clean child/profile semantics | 5 - `kind=phase-parent` plus runtime core and child profiles are explicit | 4 - kind-based manifest can represent phase parent, but extra addon scaffolding must be suppressed | 4 - profile fragments can express phase parent, with extra composer complexity | 5 - typed profiles can express phase parent cleanly |
| Total | 16/35 | 35/35 | 24/35 | 26/35 | 31/35 |

The elimination test from copilot is decisive: owner, trigger, absence behavior, section/header expectations, and runtime metadata must be expressible separately. C+F hybrid is the only candidate that scores high while preserving all five separations in the natural source format maintainers already use.

### Eliminated Designs

- F is eliminated at 16/35. It satisfies the lean runtime core, but it conflates all addon lifecycles into `command-owned-lazy` and cannot reproduce today's level matrix with capability flags.
- B is eliminated despite 24/35. Scaffolding all addons as starter docs violates the iteration-2 lifecycle table: `handover.md`, `debug-delegation.md`, and `research/research.md` are not author-scaffolded docs.
- D is eliminated despite 26/35. It handles section variance well, but a roughly 25-fragment library plus composer creates a second section-ordering source and weakens the markdown-editing ergonomics requirement.
- G is eliminated despite 31/35. It represents contracts cleanly, but schema-first templates violate the explicit authoring ergonomic: maintainers should edit markdown templates, not TypeScript data structures.

### Surviving Finalists with Source Surface Counts

Winner: C+F hybrid.

Concrete source surface estimate: 15 files.

| Source file | Purpose |
|---|---|
| `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json` | Single manifest for doc kinds, capabilities, owners, triggers, absence behavior, metadata requirements, and section profiles |
| `.opencode/skill/system-spec-kit/templates/manifest/spec.md.tmpl` | Markdown source for ordinary authored spec docs |
| `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl` | Markdown source for authored implementation plans |
| `.opencode/skill/system-spec-kit/templates/manifest/tasks.md.tmpl` | Markdown source for authored task lists |
| `.opencode/skill/system-spec-kit/templates/manifest/implementation-summary.md.tmpl` | Markdown source for authored completion and `_memory.continuity` records |
| `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl` | Markdown source gated by `capability=qa-verification` |
| `.opencode/skill/system-spec-kit/templates/manifest/decision-record.md.tmpl` | Markdown source gated by `capability=architecture-decisions` |
| `.opencode/skill/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl` | Markdown source for `kind=phase-parent` lean parent `spec.md` |
| `.opencode/skill/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Optional author-scaffolded root path ledger |
| `.opencode/skill/system-spec-kit/templates/manifest/context-index.md.tmpl` | Optional author-scaffolded phase-parent migration bridge |
| `.opencode/skill/system-spec-kit/templates/manifest/handover.md.tmpl` | Command-owned lazy output template for `/memory:save` routing |
| `.opencode/skill/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` | Command-scaffolded and `@debug`-owned lazy output template |
| `.opencode/skill/system-spec-kit/templates/manifest/research.md.tmpl` | Workflow-owned packet output template for `/spec_kit:deep-research` and `/spec_kit:deep-review` |
| `.opencode/skill/system-spec-kit/scripts/templates/scaffold-from-manifest.ts` | Scaffolder that copies authored docs and reserves lazy outputs by lifecycle |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/validate-from-manifest.ts` | Validator adapter that replaces level hardcoding with manifest-derived required docs and section profiles |

NFR-M02 verdict: pass. The finalist source surface is 15 files, which is under the hard ceiling of 30 and exactly at the preferred ceiling of 15. Against the stated 86-file current baseline, that is an 82.6% reduction. Against the broad 151-file touched surface listed in this iteration, it is a 90.1% reduction.

Phase-parent edge-case probe: C+F hybrid represents phase parents as `kind=phase-parent`, with runtime metadata requirements `spec.md`, `description.json`, and `graph-metadata.json`. Heavy authored docs are not scaffolded at the parent; child packets carry ordinary authored capabilities.

Level 3+ edge-case probe: C+F hybrid represents Level 3+ as `capability=governance-expanded` or `profile=governance-expanded`, not as a file requirement. That preserves the iteration-2 finding that Level 3+ has no unique file and only expands section/header expectations inside existing authored docs.

## Questions Answered

- Q2 is answered enough for design selection. The capability flag matrix can reproduce today's Level 1/2/3/3+ and phase-parent behavior without hardcoded level lookup.
- Q5 is answered directionally. A single manifest should drive scaffolding and validation, but it must keep lifecycle owner, trigger, absence behavior, runtime metadata, and section profiles as separate fields.
- Q6 is answered for the winning design. Phase parent belongs in `kind` or `profile`, not in an ordinary level-like capability.
- Q10 is partially answered. Inline section profiles win over a large fragment library for this system because they preserve whole-document markdown authoring.
- The big design choice is answered: choose C+F hybrid.

## Questions Remaining

- Q8 remains open: preset names and exact user-facing aliases still need design.
- Q9 remains open: golden tests should be defined against manifest-to-scaffold and manifest-to-validator behavior.
- Q10 needs a concrete schema decision: whether section gates live inline inside the manifest or as small named section profiles referenced by capability.
- The exact manifest field names and sample packet outputs need to be drafted and tested.

## Next Focus

Iteration 4 should produce the manifest schema plus sample packet scaffolds for C+F hybrid. It should include one ordinary Level 1-equivalent packet, one QA packet, one architecture packet, one governance-expanded packet, and one phase-parent packet, then define golden tests for scaffolded files and validator expectations.
