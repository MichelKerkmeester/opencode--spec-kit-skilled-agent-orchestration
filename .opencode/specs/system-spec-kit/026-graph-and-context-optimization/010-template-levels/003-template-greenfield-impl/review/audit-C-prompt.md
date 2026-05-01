# Audit C — `system-spec-kit/references/` + `system-spec-kit/assets/`

You are a fresh agent doing a focused audit. No conversation context.

## Goal

The user is implementing the C+F hybrid manifest-driven greenfield template-system per the design in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`. The implementation plan + file-by-file blast radius live in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/`.

A binding constraint (ADR-005 in `002/decision-record.md`): **`Level 1/2/3/3+` is the SOLE public/AI-facing vocabulary**. Banned terms on every public/AI-facing surface: `preset`, `capability`, `kind`, `manifest`. Workflow-invariance CI test will fail the build if those leak.

## Your task: audit these two directories for impact

Audit ALL files under:
- `.opencode/skill/system-spec-kit/references/` (34 markdown files in subdirs: `memory/`, `config/`, `debugging/`, `workflows/`, `cli/`, `hooks/`, `templates/`, `structure/`, `validation/`)
- `.opencode/skill/system-spec-kit/assets/` (4 markdown files: `parallel_dispatch_config.md`, `level_decision_matrix.md`, `complexity_decision_matrix.md`, `template_mapping.md`)

**Highest-impact candidates to check first** (read these end-to-end):
- `references/templates/level_selection_guide.md`
- `references/templates/level_specifications.md`
- `references/templates/template_guide.md`
- `references/templates/template_style_guide.md`
- `references/structure/folder_structure.md`
- `references/structure/phase_definitions.md`
- `references/structure/phase_system.md`
- `references/validation/template_compliance_contract.md`
- `references/validation/validation_rules.md`
- `references/validation/phase_checklists.md`
- `references/workflows/quick_reference.md`
- `references/workflows/worked_examples.md`
- `assets/level_decision_matrix.md`
- `assets/complexity_decision_matrix.md`
- `assets/template_mapping.md`

For EACH file, classify under one of:
- **MODIFY** — file has references to deleted paths (`templates/level_N/`, `templates/{core,addendum,phase_parent}/`, root cross-cutting templates, `compose.sh`, `wrap-all-templates`) OR contains banned vocabulary (preset/capability/kind/manifest) on user/AI-facing surface OR describes build-time composition that won't exist post-implementation
- **DELETE** — file is OBSOLETE under the new design (e.g., a "level folder layout" reference doc with no salvageable content under manifest design). Be conservative — prefer MODIFY over DELETE.
- **UNTOUCHED** — no impact

For each MODIFY/DELETE, give:
- Specific line(s) needing edit
- Replacement guidance (preserve Level vocabulary; describe manifest-driven design where it replaces composer/level-folder explanation)

## Output format

Plain markdown to stdout. Sections: References Audit (group by subdir), Assets Audit. Per-file row with `Path | Action | Reason | Replacement guidance (if MODIFY/DELETE)`. Under 1500 words. Be specific.

## Constraints

- Read-only audit. Do NOT edit any file.
- Use `Read`, `Grep`, `Glob` only.
- Write your output to stdout only.
- Don't recommend net-new scope.
