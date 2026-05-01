# Focus

Inventory the current template system and map the consumer chain for the proposed consolidation of `.opencode/skill/system-spec-kit/templates/`.

# Actions Taken

1. Counted all files and markdown LOC under `.opencode/skill/system-spec-kit/templates/`.
2. Cataloged every template file with LOC, byte size, and observed purpose.
3. Traced `create.sh` template creation flow through `template-utils.sh::copy_template`.
4. Read the composition, anchor-wrapping, and validator hooks that depend on level template paths.
5. Checked marker prevalence under `.opencode/specs/` with both occurrence and unique folder counts.

# Findings

## Baseline Counts

| Scope | Files | Markdown files | Markdown LOC | Notes |
| --- | ---: | ---: | ---: | --- |
| Entire `templates/` tree | 86 | 83 | 13115 | Includes source fragments, composed outputs, examples, cross-cutting templates, stress-test templates, docs, `.hashes`, and scratch placeholder. |
| Per-level output dirs only | 25 | 25 | 4087 | `level_1`, `level_2`, `level_3`, `level_3+`; includes four README files. |
| Core plus addendum source dirs | 22 | 22 | 1744 | Includes `core/README.md` and `addendum/README.md`; content sources plus phase addendum snippets. |
| Marker occurrences in `.opencode/specs/` | n/a | n/a | 5889 occurrences | `rg -n "SPECKIT_TEMPLATE_SOURCE" .opencode/specs | wc -l`. |
| Files/folders with marker in `.opencode/specs/` | 3164 files | n/a | 713 folders | The "~800 folders" claim is plausible but high for current checkout; actual unique marker-bearing folders found: 713. |

Immediate delta anchor: eliminating the materialized level output directories would remove 25 files and 4087 LOC before adding any generator, manifest, compatibility shim, tests, or docs.

## Template File Inventory

| File | LOC | Bytes | Purpose |
| --- | ---: | ---: | --- |
| `.hashes` | 9 | 515 | Drift/hash baseline for composed template validation. |
| `README.md` | 119 | 6043 | Top-level template system overview and usage contract. |
| `addendum/README.md` | 89 | 3426 | Documents addendum fragment organization. |
| `addendum/level2-verify/checklist.md` | 110 | 2493 | Source checklist for Level 2+ verification. |
| `addendum/level2-verify/plan-level2.md` | 68 | 1733 | Level 2 plan addendum appended by composer. |
| `addendum/level2-verify/spec-level2.md` | 66 | 1622 | Level 2 spec addendum inserted before open questions. |
| `addendum/level3-arch/decision-record.md` | 126 | 3286 | Level 3+ decision-record source. |
| `addendum/level3-arch/plan-level3.md` | 87 | 2727 | Level 3 plan addendum appended by composer. |
| `addendum/level3-arch/spec-level3-guidance.md` | 28 | 873 | Level 3 spec guidance fragment. |
| `addendum/level3-arch/spec-level3-prefix.md` | 16 | 533 | Level 3/3+ spec prefix fragment. |
| `addendum/level3-arch/spec-level3-suffix.md` | 77 | 1818 | Level 3 spec suffix fragment. |
| `addendum/level3-arch/spec-level3.md` | 82 | 2142 | Legacy or standalone Level 3 spec addendum; not observed in `compose.sh` algorithm. |
| `addendum/level3-plus-govern/checklist-extended.md` | 83 | 2335 | Extra checklist content appended for Level 3 and Level 3+. |
| `addendum/level3-plus-govern/plan-level3plus.md` | 83 | 2121 | Level 3+ plan addendum appended by composer. |
| `addendum/level3-plus-govern/spec-level3plus-guidance.md` | 27 | 895 | Level 3+ spec guidance fragment. |
| `addendum/level3-plus-govern/spec-level3plus-suffix.md` | 107 | 2454 | Level 3+ spec suffix fragment. |
| `addendum/level3-plus-govern/spec-level3plus.md` | 84 | 1948 | Legacy or standalone Level 3+ spec addendum; not observed in `compose.sh` algorithm. |
| `addendum/phase/phase-child-header.md` | 41 | 1562 | Phase child back-reference header injected by `create.sh --phase`. |
| `addendum/phase/phase-parent-section.md` | 40 | 1564 | Phase map section appended to parent spec by `create.sh --phase`. |
| `changelog/README.md` | 21 | 1051 | Nested changelog template documentation. |
| `changelog/phase.md` | 46 | 601 | Phase changelog template consumed by create changelog workflows. |
| `changelog/root.md` | 45 | 586 | Root changelog template consumed by create changelog workflows. |
| `context-index.md` | 48 | 1720 | Optional migration/context bridge template for reorganized phase parents. |
| `core/README.md` | 77 | 1910 | Core fragment documentation. |
| `core/impl-summary-core.md` | 118 | 3554 | Shared implementation-summary source. |
| `core/plan-core.md` | 127 | 2728 | Shared plan source. |
| `core/spec-core.md` | 119 | 2635 | Shared spec source. |
| `core/tasks-core.md` | 89 | 1670 | Shared tasks source. |
| `debug-delegation.md` | 138 | 3886 | Cross-cutting debug delegation template. |
| `examples/README.md` | 64 | 1718 | Examples documentation. |
| `examples/level_1/implementation-summary.md` | 100 | 3365 | Example Level 1 implementation summary. |
| `examples/level_1/plan.md` | 153 | 4249 | Example Level 1 plan. |
| `examples/level_1/spec.md` | 142 | 4280 | Example Level 1 spec. |
| `examples/level_1/tasks.md` | 106 | 2571 | Example Level 1 tasks. |
| `examples/level_2/checklist.md` | 143 | 4060 | Example Level 2 checklist. |
| `examples/level_2/implementation-summary.md` | 145 | 5026 | Example Level 2 implementation summary. |
| `examples/level_2/plan.md` | 216 | 6076 | Example Level 2 plan. |
| `examples/level_2/spec.md` | 203 | 6627 | Example Level 2 spec. |
| `examples/level_2/tasks.md` | 134 | 3757 | Example Level 2 tasks. |
| `examples/level_3+/checklist.md` | 321 | 10897 | Example Level 3+ checklist. |
| `examples/level_3+/decision-record.md` | 305 | 11681 | Example Level 3+ decision record. |
| `examples/level_3+/implementation-summary.md` | 374 | 11942 | Example Level 3+ implementation summary. |
| `examples/level_3+/plan.md` | 490 | 17306 | Example Level 3+ plan. |
| `examples/level_3+/spec.md` | 390 | 14252 | Example Level 3+ spec. |
| `examples/level_3+/tasks.md` | 309 | 10052 | Example Level 3+ tasks. |
| `examples/level_3/checklist.md` | 192 | 5749 | Example Level 3 checklist. |
| `examples/level_3/decision-record.md` | 275 | 9676 | Example Level 3 decision record. |
| `examples/level_3/implementation-summary.md` | 227 | 7137 | Example Level 3 implementation summary. |
| `examples/level_3/plan.md` | 379 | 13767 | Example Level 3 plan. |
| `examples/level_3/spec.md` | 280 | 10489 | Example Level 3 spec. |
| `examples/level_3/tasks.md` | 204 | 6624 | Example Level 3 tasks. |
| `handover.md` | 138 | 4689 | Cross-cutting handover template. |
| `level_1/README.md` | 107 | 3314 | Level 1 materialized output documentation. |
| `level_1/implementation-summary.md` | 134 | 4103 | Level 1 materialized output. |
| `level_1/plan.md` | 143 | 3267 | Level 1 materialized output. |
| `level_1/spec.md` | 135 | 3165 | Level 1 materialized output. |
| `level_1/tasks.md` | 105 | 2209 | Level 1 materialized output. |
| `level_2/README.md` | 136 | 4951 | Level 2 materialized output documentation. |
| `level_2/checklist.md` | 126 | 3032 | Level 2 materialized output. |
| `level_2/implementation-summary.md` | 134 | 4113 | Level 2 materialized output. |
| `level_2/plan.md` | 199 | 4646 | Level 2 materialized output. |
| `level_2/spec.md` | 189 | 4436 | Level 2 materialized output. |
| `level_2/tasks.md` | 105 | 2219 | Level 2 materialized output. |
| `level_3+/README.md` | 141 | 6436 | Level 3+ materialized output documentation. |
| `level_3+/checklist.md` | 198 | 5012 | Level 3+ materialized output. |
| `level_3+/decision-record.md` | 142 | 3834 | Level 3+ materialized output. |
| `level_3+/implementation-summary.md` | 134 | 4121 | Level 3+ materialized output. |
| `level_3+/plan.md` | 346 | 8589 | Level 3+ materialized output. |
| `level_3+/spec.md` | 274 | 6543 | Level 3+ materialized output. |
| `level_3+/tasks.md` | 105 | 2227 | Level 3+ materialized output. |
| `level_3/README.md` | 142 | 5724 | Level 3 materialized output documentation. |
| `level_3/checklist.md` | 198 | 5003 | Level 3 materialized output. |
| `level_3/decision-record.md` | 142 | 3857 | Level 3 materialized output. |
| `level_3/implementation-summary.md` | 134 | 4113 | Level 3 materialized output. |
| `level_3/plan.md` | 276 | 6819 | Level 3 materialized output. |
| `level_3/spec.md` | 237 | 5642 | Level 3 materialized output. |
| `level_3/tasks.md` | 105 | 2219 | Level 3 materialized output. |
| `phase_parent/spec.md` | 117 | 4368 | Lean phase parent spec template. |
| `research.md` | 944 | 22166 | Cross-cutting research packet template. |
| `resource-map.md` | 202 | 8461 | Optional resource-map template. |
| `scratch/.gitkeep` | 0 | 0 | Keeps scratch directory present. |
| `scratch/README.md` | 95 | 3040 | Scratch directory guidance. |
| `stress_test/README.md` | 39 | 1636 | Stress-test template documentation. |
| `stress_test/findings-rubric.schema.md` | 72 | 5268 | Stress-test findings rubric schema. |
| `stress_test/findings-rubric.template.json` | 53 | 910 | Stress-test JSON findings rubric template. |
| `stress_test/findings.template.md` | 108 | 3980 | Stress-test findings report template. |

## Consumer Chain

The primary runtime chain is:

`scripts/spec/create.sh` -> `scripts/lib/template-utils.sh::get_level_templates_dir` -> `scripts/lib/template-utils.sh::copy_template` -> `templates/level_1|level_2|level_3|level_3+/*.md`

Observed branches:

- Normal spec creation: `create.sh` sets `TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"`, resolves `LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")`, loops over `"$LEVEL_TEMPLATES_DIR"/*.md`, then calls `copy_template` into the new feature folder.
- Subfolder creation: same level resolution and `copy_template` loop, but destination is `SUBFOLDER_PATH`.
- Phase mode parent: uses `templates/phase_parent/spec.md` plus `addendum/phase/phase-parent-section.md`; it does not use the Level-N parent docs.
- Phase mode children: hardcodes Level 1 child templates through `CHILD_LEVEL_DIR=$(get_level_templates_dir "1" "$TEMPLATES_BASE")`, then copies every child template via `copy_template`.
- `get_level_templates_dir` maps `1 -> level_1`, `2 -> level_2`, `3 -> level_3`, `3+|4 -> level_3+`, and unknown levels to `level_1`.
- `copy_template` tries the level-specific file first, falls back to the base templates directory, and creates an empty destination file if neither exists. This fallback is risky for consolidation because a missing generated file can silently become empty.

## Scripts That Read or Encode Template Paths

Operational scripts:

- `scripts/templates/compose.sh`: authoritative composer today. It reads `templates/core` and `templates/addendum`, writes materialized outputs under `templates/level_1`, `level_2`, `level_3`, and `level_3+`, supports `--dry-run`, `--verify`, and selected levels, and normalizes frontmatter title suffixes to the output path.
- `scripts/wrap-all-templates.ts`: TypeScript anchor wrapper. It iterates only over `level_1`, `level_2`, `level_3`, `level_3+` and the six canonical doc filenames, then uses `wrapSectionsWithAnchors`.
- `scripts/wrap-all-templates.sh`: shell wrapper equivalent that iterates the same four level folders and six filenames, calling the compiled anchor generator.
- `scripts/lib/template-utils.sh`: maps documentation levels to materialized level directories and copies templates.
- `scripts/spec/create.sh`: primary spec-folder creator; reads level directories, phase parent template, phase addendum snippets, and optional `templates/sharded` paths.
- `scripts/spec/upgrade-level.sh`: resolves `TEMPLATES_DIR`, `addendum/level2-verify`, `addendum/level3-arch`, and `addendum/level3-plus-govern` directly.
- `scripts/spec/validate.sh`: reads `templates/.hashes` for hash validation and contains template-aware special cases.
- `scripts/spec/check-template-staleness.sh`: template staleness detector; relevant to provenance/backward compatibility even though it excludes template folders during scans.
- `scripts/rules/check-files.sh`: encodes required files by numeric level; phase parents require only `spec.md` and remediation points to `templates/phase_parent/spec.md`.
- `scripts/rules/check-template-source.sh`: requires `SPECKIT_TEMPLATE_SOURCE` in the first 20 lines of spec docs.
- `scripts/rules/check-template-headers.sh`: validates H1/H2 structure against helper output and skips phase-parent level expectations.
- `scripts/utils/template-structure.js`: invoked by `check-template-headers.sh`; this is likely where expected per-level structures are materialized or inferred and needs a later direct read.

Test and registry consumers:

- `scripts/tests/test-template-comprehensive.js`, `test-template-system.js`, `test-five-checks.js`, `test-integration.vitest.ts`, and `test-phase-system.sh` hardcode the four level directories.
- `scripts/tests/test-scripts-modules.js` checks the shipped `wrap-all-templates` path.
- `scripts/scripts-registry.json` declares dependencies on `templates/`, `templates/changelog/`, and template-related scripts.
- `scripts/lib/validator-registry.json` registers `check-files.sh`, `check-template-source.sh`, and `check-template-headers.sh`.

Non-script hardcoded public API consumers:

- `.opencode/command/spec_kit/assets/spec_kit_plan_{auto,confirm}.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_{auto,confirm}.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_implement_{auto,confirm}.yaml`
- `.opencode/command/create/assets/create_agent_{auto,confirm}.yaml`
- `.opencode/command/create/assets/create_changelog_{auto,confirm}.yaml` for `templates/changelog`.
- `.opencode/agent/orchestrate.md`
- `AGENTS.md` and `CLAUDE.md`

These references make the level directory paths part of the workflow contract, not merely an internal cache.

## Composition Algorithm

`compose.sh` is currently the best generator candidate because it already owns the source-to-output transform.

Observed algorithm:

- Resolves `TEMPLATES_DIR` relative to `scripts/templates`.
- Defines source roots: `core/`, `addendum/level2-verify`, `addendum/level3-arch`, `addendum/level3-plus-govern`.
- Defines output roots: `level_1`, `level_2`, `level_3`, `level_3+`.
- Level 1:
  - `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` come from core only.
- Level 2:
  - `spec.md`: inserts `spec-level2.md` before open questions and renumbers open questions.
  - `plan.md`: appends `plan-level2.md`.
  - `tasks.md` and `implementation-summary.md`: copy core with level marker updated.
  - `checklist.md`: copies `addendum/level2-verify/checklist.md`.
- Level 3:
  - `spec.md`: dynamically assembles frontmatter, guidance, prefix, core body, suffix, open questions, and related docs.
  - `plan.md`: appends L2 and L3 plan addenda.
  - `checklist.md`: uses base checklist plus extended checklist.
  - `decision-record.md`: copies L3 decision record.
- Level 3+:
  - `spec.md`: dynamically assembles frontmatter, guidance, L3 prefix, core body, Level 3+ suffix, and open questions.
  - `plan.md`: appends L2, L3, and L3+ plan addenda.
  - `checklist.md`: uses base checklist plus extended checklist.
  - `decision-record.md`: currently copies L3 decision record, not a Level 3+ specific source.
- It updates `SPECKIT_LEVEL`, metadata level table values, strips addendum markers and frontmatter where needed, and normalizes frontmatter title suffixes to `template:level_N/file.md`.
- It writes files, verifies drift, or previews changes depending on flags.

The prompt mentioned `scripts/templates/wrap-all-templates.ts`; that path does not exist in this checkout. The actual TS wrapper is `scripts/wrap-all-templates.ts`; a shell wrapper also exists at `scripts/wrap-all-templates.sh`.

## Validator Hooks

`check-files.sh` does not read level template directories to decide required files. It encodes requirements directly:

- Level 1: `spec.md`, `plan.md`, `tasks.md`.
- `implementation-summary.md`: required after implementation evidence exists in `checklist.md`, or for Level 1 when completed tasks exist.
- Level 2+: adds `checklist.md`.
- Level 3+: adds `decision-record.md`.
- Phase parent: early branch requires only `spec.md`; remediation points to `templates/phase_parent/spec.md`.

This means a consolidation can preserve `check-files.sh` by moving required-file definitions into a manifest, but it does not strictly depend on materialized `level_N` folders today. The bigger validator dependency is structural: `check-template-headers.sh` delegates expected header comparison to `scripts/utils/template-structure.js`, and that helper needs direct inspection next.

## Early Dependency Answer for Q1

Can the level directories be eliminated entirely?

Not safely in one step. They are generated outputs, but they are also:

- The direct input to `create.sh` normal and subfolder creation.
- The source path asserted by agent and AGENTS governance text.
- The canonical path embedded in command YAML workflows for plan/complete/implement.
- The iteration target for anchor wrapping.
- The test fixture baseline for multiple template tests.
- The path encoded into composed template frontmatter title suffixes.

So the practical answer is currently PARTIAL: make `core/` plus `addendum/` the source of truth and introduce on-demand generation behind a compatibility path first. Full deletion only becomes safe after consumers stop assuming physical `templates/level_N/` directories.

## Early Source-of-Truth Answer for Q2

Minimum likely runtime source-of-truth set after consolidation:

- Core docs: `core/spec-core.md`, `core/plan-core.md`, `core/tasks-core.md`, `core/impl-summary-core.md`.
- Level 2 addenda: `addendum/level2-verify/spec-level2.md`, `plan-level2.md`, `checklist.md`.
- Level 3 addenda used by composer: `addendum/level3-arch/spec-level3-guidance.md`, `spec-level3-prefix.md`, `spec-level3-suffix.md`, `plan-level3.md`, `decision-record.md`.
- Level 3+ addenda used by composer: `addendum/level3-plus-govern/spec-level3plus-guidance.md`, `spec-level3plus-suffix.md`, `plan-level3plus.md`, `checklist-extended.md`.
- Phase templates: `phase_parent/spec.md`, `addendum/phase/phase-parent-section.md`, `addendum/phase/phase-child-header.md`.
- Cross-cutting templates: `handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`.
- Changelog templates: `changelog/root.md`, `changelog/phase.md`.
- Stress-test templates if still public: `stress_test/findings.template.md`, `stress_test/findings-rubric.schema.md`, `stress_test/findings-rubric.template.json`.

Files requiring follow-up classification:

- `addendum/level3-arch/spec-level3.md`
- `addendum/level3-plus-govern/spec-level3plus.md`
- all `examples/**`
- `scratch/**`
- README files and `.hashes`

My read: `.hashes` would either be removed with materialized outputs or replaced by generated-output golden hashes in tests. It should not remain as a static runtime contract if outputs are generated on demand.

# Questions Answered

- Q1 partially answered: complete deletion has many dependencies; direct removal is not safe. The dependency surface is larger than scripts alone because command YAMLs, agents, tests, and governance docs hardcode level output paths.
- Q2 partially answered: the minimum source set is core fragments, addenda used by composition, phase templates, cross-cutting templates, changelog templates, and possibly stress-test templates. Two addendum files look unused by `compose.sh` and need confirmation before removal.

# Questions Remaining

- Q3: Generator choice still open. Early signal favors extending `compose.sh` or wrapping it rather than a TS rewrite, because it already captures the exact transform.
- Q4: Need direct read of `scripts/utils/template-structure.js` and validator tests to decide whether required headers can move to manifest.
- Q5: Need inspect `check-template-staleness.sh`, frontmatter health parsers, and upgrade scripts for marker compatibility.
- Q6: Need byte-determinism test: generated on-demand output vs current `level_N` files.
- Q7: Need run timing for `compose.sh --verify` and selected-level generation.
- Q8: Need complete hardcoded-path inventory outside scripts, especially YAML command assets.
- Q9: Recommendation leaning PARTIAL, not final.
- Q10: Refactor plan pending Q3-Q8.

# Next Focus

Trace validator/header/anchor semantics and provenance parsing: `scripts/utils/template-structure.js`, `check-template-staleness.sh`, `shared/parsing/spec-doc-health.ts`, anchor generator, and tests that treat `templates/level_N/` as canonical.
