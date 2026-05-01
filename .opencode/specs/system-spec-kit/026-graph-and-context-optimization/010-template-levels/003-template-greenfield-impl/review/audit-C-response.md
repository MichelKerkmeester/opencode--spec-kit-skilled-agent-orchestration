## References Audit

### `cli/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/cli/memory_handback.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/cli/shared_smart_router.md` | UNTOUCHED | No impacted terms/paths found. | — |

### `config/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/config/environment_variables.md` | MODIFY | Lines 310, 312, 318 use banned `Capability/capabilities`. | Replace with `feature flag`, `runtime support`, or `adaptive ranking features`. |
| `references/config/hook_system.md` | MODIFY | Lines 49, 51, 99 use banned `capability/capabilities`. | Reword as `hook surfaces`, `runtime support`, or `supported hook features`. |

### `debugging/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/debugging/troubleshooting.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/debugging/universal_debugging_methodology.md` | UNTOUCHED | No impacted terms/paths found. | — |

### `hooks/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/hooks/skill-advisor-hook.md` | MODIFY | Line 37 uses banned `manifest`. | Replace with `parent child listing` or `phase listing`. |
| `references/hooks/skill-advisor-hook-validation.md` | UNTOUCHED | No impacted terms/paths found. | — |

### root

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/intake-contract.md` | MODIFY | Lines 31, 260-261 reference `templates/phase_parent/spec.md`, `templates/context-index.md`, and old composition phrasing. | Keep Level 1/2/3/3+ public wording; describe parent output as lean trio selected by the new internal routing source. Avoid deleted direct template paths. |

### `memory/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/memory/embedding_resilience.md` | MODIFY | Line 119 uses banned `Capability`. | Use `Search Support` or `Search Mode`. |
| `references/memory/epistemic_vectors.md` | MODIFY | Lines 36, 74, 89-90, 273 use banned `capability/capabilities`. | Reword as `model boundary`, `operating range`, `reliability concerns`. |
| `references/memory/memory_system.md` | MODIFY | Line 29 uses banned `Core Capabilities`. | Rename to `Core Features`. |
| `references/memory/save_workflow.md` | MODIFY | Line 152 uses banned `capability`; line 301 references `templates/phase_parent/spec.md`. | Use `response support`; replace direct phase-parent template path with new internal template selection wording. |
| `references/memory/trigger_config.md` | UNTOUCHED | No impacted terms/paths found. | — |

### `structure/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/structure/folder_routing.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/structure/folder_structure.md` | MODIFY | Lines 14-36 describe deleted `core/`, `addendum/`, `level_*`, and cross-level template layout. | Replace with generated-template overview using Level 1/2/3/3+ as the only public selection vocabulary. |
| `references/structure/phase_definitions.md` | MODIFY | Line 101 references `templates/phase_parent/spec.md`, `templates/level_N/`, and uses banned `manifest`. | Say phase parent and child docs are generated from the selected Level contract via the internal routing source. |
| `references/structure/phase_system.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/structure/sub_folder_versioning.md` | UNTOUCHED | No impacted terms/paths found. | — |

### `templates/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/templates/level_selection_guide.md` | MODIFY | Lines 107, 124-128, 200-213 describe pre-expanded level folders and direct paths. | Replace folder lists/examples with Level 1/2/3/3+ selection outcomes and generated file sets. |
| `references/templates/level_specifications.md` | MODIFY | Lines 3, 8, 14-45, 90-93, 142-151, 225-234, 335-345, 470-480, 565-567, 738-741, 807-827 describe CORE + ADDENDUM, deleted paths, and composition. | Preserve Level requirements, but remove build-time architecture and direct source path sections. |
| `references/templates/template_guide.md` | MODIFY | Lines 48-70, 84-87, 135, 174, 214-223, 339, 437, 464, 492, 773, 1083, 1135-1155 reference composition, `compose.sh`, and deleted level folders. | Replace copy-command workflow with create/generate workflow; keep only Level 1/2/3/3+ file expectations. |
| `references/templates/template_style_guide.md` | UNTOUCHED | No impacted terms/paths found. | — |

### `validation/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/validation/decision_format.md` | MODIFY | Line 126 uses banned `capability`; line 368 links `templates/level_3/decision-record.md`. | Use `model boundary`; replace link with Level 3/3+ decision-record contract reference. |
| `references/validation/five_checks.md` | MODIFY | Lines 317, 319 link deleted `templates/level_2` and `templates/level_3`. | Link to validation contract sections instead. |
| `references/validation/path_scoped_rules.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/validation/phase_checklists.md` | MODIFY | Line 177 links deleted `templates/level_2/checklist.md`. | Point to Level 2+ checklist contract, not path. |
| `references/validation/template_compliance_contract.md` | MODIFY | Lines 223, 225, 231, 268 reference `phase_parent`, `templates/level_N`, composition, and banned `manifest`. | Keep structural contract; describe template sync through new generated-template source and phase listing wording. |
| `references/validation/validation_rules.md` | MODIFY | Lines 139, 155, 172, 178, 673, 784, 838 reference deleted template paths and banned `manifest`. | Replace examples with create/generate commands and `phase listing` language. |

### `workflows/`

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `references/workflows/execution_methods.md` | MODIFY | Lines 3, 8, 14, 156-184 describe `compose.sh` and template composition. | Remove composition section; document validation, creation, and generation only. |
| `references/workflows/nested_changelog.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/workflows/quick_reference.md` | MODIFY | Lines 41, 56-91, 143-153, 190, 489, 692-724 reference deleted paths, `compose.sh`, and banned `manifest`. | Replace copy commands with create/generate examples; use `phase listing`. |
| `references/workflows/rollback_runbook.md` | UNTOUCHED | No impacted terms/paths found. | — |
| `references/workflows/worked_examples.md` | UNTOUCHED | No impacted terms/paths found. | — |

## Assets Audit

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `assets/complexity_decision_matrix.md` | MODIFY | Lines 157, 238 reference `templates/level_N` and `compose.sh`. | Keep scoring matrix; replace path/script references with Level selection output. |
| `assets/level_decision_matrix.md` | MODIFY | Lines 131, 338 reference `templates/level_N` and `compose.sh`. | Replace with “generated files for selected Level”. |
| `assets/parallel_dispatch_config.md` | MODIFY | Line 156 references `compose.sh`. | Remove script link or point to current generation workflow. |
| `assets/template_mapping.md` | MODIFY | Lines 48-71, 100-105, 111-145, 357-389, 430-461 reference deleted folders, `compose.sh`, `phase_parent`, and banned `manifest`. | Rewrite as Level-to-file contract map driven by the new internal template source; remove raw copy commands and deleted path links. |

No DELETE candidates found; every impacted file has salvageable Level 1/2/3/3+ guidance.
