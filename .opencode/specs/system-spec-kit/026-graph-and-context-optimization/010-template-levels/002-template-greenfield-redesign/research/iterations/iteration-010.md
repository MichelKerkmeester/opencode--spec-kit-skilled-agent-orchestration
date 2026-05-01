# Iteration 10: Workflow-Invariant Constraint Pass

## Focus

Re-test the converged C+F hybrid manifest-driven greenfield design against the new invariant: AI behavior, Gate 3 behavior, user conversation flow, and user-facing vocabulary must remain byte-identical to today's level-based workflow. The design is not reopened wholesale; this pass identifies the mitigations needed to keep kind, capabilities, and preset as internal implementation details only.

## Actions Taken

- Re-read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-009.md` first, as required.
- Audited level, preset, capability, phase-parent, and `SPECKIT_LEVEL` references across:
  - `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
  - `.opencode/skill/system-spec-kit/SKILL.md`
  - `.opencode/skill/sk-doc/`
  - `CLAUDE.md`
  - `AGENTS.md`
  - `.opencode/command/spec_kit/*.md`
  - `.opencode/agent/*.md`
  - `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
- Re-read the iteration-007 proposed diffs for `create.sh`, `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, and adjacent `check-section-counts.sh` notes.
- Checked generated/template marker usage for `<!-- SPECKIT_LEVEL: N -->` and existing parser expectations.

## Findings

### AI-Facing Surface Audit

| Surface | Category | Evidence | Invariant result |
| --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` | STRICTLY INVISIBLE TO USER | Classifies write/resume/read-only triggers. It has no documentation-level or preset selection logic. | Leave byte-identical unless Gate 3 triggers change for unrelated reasons. The C+F design must not require classifier changes. |
| `.opencode/skill/system-spec-kit/SKILL.md` | AI-facing prompt text | Tells the AI: "When user selects B) New, AI estimates complexity and recommends a level", then runs `create.sh --level N`. Rules require determining level and using `templates/level_N/`. | Must keep level vocabulary. Replace implementation details only if phrased as "resolve the Level-N template contract internally", never "choose preset/capability". |
| `CLAUDE.md` | AI-facing and user-facing root policy | Documents Documentation Levels 1/2/3/3+, phase parent, Level 1 completion skip, checklist Level 2+, and `templates/level_N/`. | Must remain level-only. This is one of the strongest invariance anchors. |
| `AGENTS.md` | AI-facing and user-facing root policy | Same level system as `CLAUDE.md`; also says the classifier module is authoritative for Gate 3. | Must remain level-only. |
| `.opencode/command/spec_kit/plan.md` | AI-facing slash command text and user-facing command help | Argument hint includes `--level=1|2|3|3+`; setup binds `selected_level`; intake asks about documentation level; phase flow says children receive Level-N templates. | Must keep `selected_level`, `--level`, and documentation-level language. |
| `.opencode/command/spec_kit/complete.md` | AI-facing slash command text and user-facing command help | Intake asks documentation level; workflow binds `selected_level`; completion and checklist gates are keyed to Level 1+ and Level 2+. | Must keep level language. No preset/capability terms in setup, prompts, or command docs. |
| `.opencode/command/spec_kit/resume.md` | AI-facing slash command text | Resume focuses on folder selection, phase-child redirect, canonical continuity, and artifacts. It does not ask about documentation level except by reading existing docs. | Safe if unchanged. Resume must not start interpreting presets or capabilities in visible prompt text. |
| Other `.opencode/command/spec_kit/*.md` | Mixed AI-facing command docs | `implement.md` uses Level 2+ checklist prerequisites. Deep-research/deep-review "reasoning-effort level" mentions are unrelated. | Keep doc-level mentions as levels; unrelated "level" usage is out of scope. |
| `.opencode/agent/orchestrate.md` | AI-facing agent prompt text | Requires "Level selection (1, 2, 3, 3+)" and `templates/level_N/` for spec docs; rejects "Level Not Determined". | Must keep level vocabulary. If orchestrator ever receives internal contract details, they must be rendered as the original level. |
| Other `.opencode/agent/*.md` | AI-facing agent prompt text | Mentions are mostly confidence level, memory tool level, nesting depth, or top-level. | No spec-level taxonomy issue except `orchestrate.md`. |
| `.opencode/skill/sk-doc/` | AI-facing docs skill text | No active prompt tells AI to choose spec-kit levels. It references system-spec-kit templates and one HVR rule points at `templates/level_3*/decision-record.md`. | No new taxonomy should be introduced. Existing level path references can remain or be hidden behind unchanged examples. |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh --help` | USER-facing and AI-visible CLI surface | Help says "documentation level", exposes only `--level`, and examples use `--level`. Stdout prints `DOC_LEVEL: Level N` and "Level N Documentation". JSON includes `"DOC_LEVEL"`. | Must remain level-only. Iteration-007's `--preset` primary contract violates the invariant. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | USER-facing and AI-visible validator output | Current pass message says "All required files present for Level $level"; remediation is taxonomy-neutral templates path. | Keep level or taxonomy-neutral messages. Do not mention manifest contract. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` | USER-facing and AI-visible validator output | Current messages are taxonomy-neutral: required sections found/missing. | Safe if manifest-backed validation keeps messages taxonomy-neutral. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` | USER-facing and AI-visible validator output | Current messages mention phase parent and template headers, not preset/capability. | Safe if helper errors do not expose manifest/preset/capability. |
| Authored spec docs and parser health | USER-facing and AI-readable packet files | Templates and tests rely on `<!-- SPECKIT_LEVEL: N -->`, `| **Level** | N |`, and parser warnings for missing `SPECKIT_LEVEL`. | Preserve these markers. Do not replace them with capability declarations. |

### Stress-Test Results 1-5

**Stress-test 1: classifier/AI emits a level number.**

The new design can accept today's level input without the AI knowing about kind, capabilities, or preset, but only if the public entrypoint remains level-shaped.

Exact internal mapping:

```text
resolve_level_contract(input):
  "1" ->
    publicLevel = "1"
    internalPreset = "level-1"
    kind = "implementation"
    capabilities = []
    authoredDocs = ["spec.md", "plan.md", "tasks.md"]
    completionDocs = ["implementation-summary.md"]

  "2" ->
    publicLevel = "2"
    internalPreset = "level-2"
    kind = "implementation"
    capabilities = ["qa-verification"]
    authoredDocs = ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    completionDocs = ["implementation-summary.md"]

  "3" ->
    publicLevel = "3"
    internalPreset = "level-3"
    kind = "implementation"
    capabilities = ["qa-verification", "architecture-decisions"]
    authoredDocs = ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    completionDocs = ["implementation-summary.md"]

  "3+" ->
    publicLevel = "3+"
    internalPreset = "level-3-plus"
    kind = "implementation"
    capabilities = ["qa-verification", "architecture-decisions", "governance-expansion"]
    authoredDocs = ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    completionDocs = ["implementation-summary.md"]

  "phase-parent" ->
    publicLevel = "Phase Parent"
    internalPreset = "phase-parent"
    kind = "phase-parent"
    capabilities = []
    authoredDocs = ["spec.md"]
    runtimeDocs = ["description.json", "graph-metadata.json"]
```

The important change from iteration 9: `internalPreset` names should be level-preserving (`level-1`, `level-2`, `level-3`, `level-3-plus`, `phase-parent`), not user-semantic names like `simple-change`, `validated-change`, `arch-change`, or `governed-change`.

**Stress-test 2: AI calls `create.sh --level 3`.**

Iteration-007 fails this test. It proposed:

- primary `--preset`;
- help text saying "manifest preset";
- examples using `--preset validated-change` and `--preset arch-change`;
- internal stdout/log support functions such as `template_contract_for_preset`;
- graph metadata carrying a resolved contract with `preset`, `kind`, and `capabilities`.

Required invariant-safe result:

- CLI input remains `create.sh --level 3`.
- `create.sh --help` remains documentation-level help.
- stdout remains `DOC_LEVEL: Level 3` and "Level 3 Documentation".
- JSON remains `DOC_LEVEL`.
- generated file names remain the same.
- authored Markdown continues to contain `<!-- SPECKIT_LEVEL: 3 -->` and `| **Level** | 3 |`.
- no generated user-visible file should contain `preset`, `capability`, or `kind` unless it already did for an unrelated domain.

Clean diffs can include removal of stale empty stub files or elimination of duplicate level-folder source files after parity tests. They should not include new public taxonomy fields.

**Stress-test 3: validator failures.**

The current validator output is mostly invariant-safe. The iteration-007 proposed diffs are not. These messages leak the new taxonomy:

- `All required files present for manifest contract`
- `optional manifest file warning(s)`
- `Use the active manifest preset templates`
- `expected at least ... for active manifest profiles`
- `choose a lighter manifest preset`
- helper errors such as `Unknown preset`, `Ambiguous preset`, `Capability ... does not support kind ...`

Required rewrite:

- user/AI-visible output must say "Level $level" or avoid taxonomy entirely;
- internal helper errors must be caught and remapped, for example `Internal template contract could not be resolved for Level $level`;
- validation details may name files and sections, but not preset/capability/kind.

**Stress-test 4: `/spec_kit:resume` and `/spec_kit:complete`.**

`resume.md` can remain unchanged. It does not require level selection in its visible prompt. It reads canonical continuity, phase child pointers, and artifacts.

`complete.md` must remain unchanged at the user prompt boundary. It binds `selected_level`, asks the intake contract for documentation level, and gates checklist/summary behavior by Level 2+ and Level 1+. It must not ask the user or AI for preset/capability/kind.

`plan.md` has the same requirement as `complete.md`: preserve `--level`, `selected_level`, and "documentation level" wording.

**Stress-test 5: frontmatter and packet authoring.**

Keep today's markers:

```text
<!-- SPECKIT_LEVEL: 3 -->
```

and keep any `level: 3` or `spec_level` metadata paths that existing memory/search/parsing code understands. The existing parser health code warns when `SPECKIT_LEVEL` is absent, and memory normalization includes `spec_level`. Replacing these with capabilities would break AI-prompt invariance and backward readability.

If an internal manifest contract must be persisted, it should not be authored into user-facing Markdown. Prefer deriving it from `SPECKIT_LEVEL` at validation time. If persistence is truly required, store a level-shaped public contract, not `preset/kind/capabilities`, and keep it out of prompts and reports.

### Required Design Modifications

1. Public API stays level-only. `create.sh` must keep `--level` as the primary and documented flag. Remove the proposed public `--preset` flag for v1. If a hidden test-only flag exists, it must not appear in help, command docs, skills, or user-facing examples.
2. Preset names become 1:1 level aliases: `level-1`, `level-2`, `level-3`, `level-3-plus`, `phase-parent`. Do not use `simple-change`, `validated-change`, `arch-change`, or `governed-change` in v1 public-adjacent files.
3. The level-to-preset mapping must be 1:1. N:1 or semantic presets recreate a new decision surface and invite AI/user vocabulary drift.
4. Keep `selected_level` in command markdown and intake contracts. Internally, the runner may call `resolve_level_contract(selected_level)`.
5. Preserve `<!-- SPECKIT_LEVEL: N -->`, `| **Level** | N |`, `level: N`, and `spec_level` fields for backward readability.
6. Validator output must be level-shaped or taxonomy-neutral. Manifest, preset, capability, and kind are implementation terms and must not appear in errors, warnings, remediations, or summary lines.
7. `graph-metadata.json` needs an ADR-level decision. Iteration 9 recommended `derived.template_contract` with preset/kind/capabilities. Under this invariant, that exact shape is too visible for a file the AI may read during resume. Either derive contracts from `SPECKIT_LEVEL` at runtime, or persist only a public level-shaped contract.
8. All AI/user-facing documentation remains level-only: `CLAUDE.md`, `AGENTS.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/command/spec_kit/*.md`, `.opencode/agent/orchestrate.md`, and relevant sk-doc references.
9. Internal source names may still use kind/capabilities if they are not rendered into help, logs, generated docs, validator output, slash-command prompts, or AI-facing skill text.

### Updated Recommendation Delta

The C+F hybrid survives, but iteration 9 overstated the removal of levels. Corrected recommendation:

- Do not remove the level taxonomy from the workflow model. Remove duplicated level folders from the source implementation only.
- Treat levels as the stable public and AI-facing API.
- Treat kind/capabilities as a private manifest implementation model.
- Treat preset as either private terminology or avoid the word entirely in shell/validator boundaries.
- Amend ADR-001/ADR-004 with a workflow-invariance rule: public and AI-facing surfaces must remain level-based.

This is a material delta from iteration 9. The design is still C+F internally, but "levels disappear" is wrong under the new constraint. The safer statement is: "levels remain the public contract; level folders disappear as duplicated implementation source."

## Questions Answered

1. Can the design accept today's level number without teaching the AI a new taxonomy?
   Yes, if `resolve_level_contract(level)` is the only public-to-internal bridge.

2. Should manifest preset names be semantic names?
   No. Use 1:1 level names for v1, or keep preset names entirely hidden.

3. Should `--preset` become the primary `create.sh` flag?
   No. That violates the invariant in help text, examples, and likely AI command usage.

4. Should `SPECKIT_LEVEL` be preserved?
   Yes. It is a backward-readability and AI-invariance anchor.

5. Do iteration-007 validator diffs need changes?
   Yes. Any "manifest preset", "active manifest profile", "capability", or "kind" output must be remapped to level or made taxonomy-neutral.

## Questions Remaining

1. Should `graph-metadata.json` persist any internal contract at all, or should validators derive from `SPECKIT_LEVEL` every time?
2. If `graph-metadata.json` keeps a contract snapshot, what exact field shape is allowed without leaking kind/capabilities/preset into resume prompts?
3. Should the implementation ban `--preset` entirely, or allow an undocumented test-only environment variable for fixture generation?
4. Should ADR-004 be amended or superseded by a new ADR-005 focused on workflow invariance?

## Next Focus

Iteration 11 should write ADR-005 and concrete invariant-locking diffs:

- revise iteration-007's `create.sh` diff to keep `--level` public;
- revise validator messages to remove manifest/preset/capability/kind language;
- define the exact `resolve_level_contract(level)` API;
- update the synthesis language from "levels disappear" to "levels remain the public API; level folders disappear internally."
