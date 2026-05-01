## SKILL.md — MODIFY

| Lines | Finding | Exact text | Replacement guidance |
|---|---|---|---|
| 3 | Wrong old taxonomy | `"CORE + ADDENDUM template architecture (v2.2)"` | Say “Level-based template workflow, validation, and Spec Kit Memory.” Do not name private internals in AI-facing description. |
| 61 | Deleted path + old template source model | `"templates/level_N/"`, `"root cross-cutting templates"` | Replace with “MUST start from the level-appropriate generated template output or workflow-owned template source.” Avoid deleted paths. |
| 63 | Deleted path | `` `.opencode/skill/system-spec-kit/templates/handover.md` `` | Replace with “created by `/memory:save` when first needed.” |
| 65 | Deleted root-template location | `` `resource-map.md` is a peer cross-cutting template under `.opencode/skill/system-spec-kit/templates/` `` | Replace with “`resource-map.md` remains optional and is generated from the workflow’s template source when needed.” |
| 85, 95 | Wrong composition wording | `"template composition"`, `"Template usage and composition rules"` | Replace with “level selection, template usage, and structure guides.” |
| 96 | Deleted paths + wrong taxonomy | `` `templates/level_N/` ``, `` `core/` ``, `` `addendum/` `` | Replace with “Use `create.sh --level N`; templates are selected through the level resolver.” |
| 108 | Deleted script | `` `templates/compose.sh` `` | Remove from primary operational scripts. |
| 358-362 | Deleted paths | `` `templates/level_1/` ``, `` `templates/level_2/` ``, `` `templates/level_3/` ``, `` `templates/level_3+/` ``, `` `templates/phase_parent/` `` | Keep Level rows, drop “Template Folder” column or change to “Created with `create.sh --level N`.” Phase parent: “lean trio.” |
| 364 | Banned AI-facing vocabulary | `"root purpose + sub-phase manifest + what needs done"` | Replace `manifest` with “phase map” or “phase outline.” |
| 377 | Wrong old taxonomy | `"3-Level Progressive Enhancement (CORE + ADDENDUM v2.2)"` | Replace with “Level-Based Progressive Documentation.” Keep Level 1/2/3/3+ descriptions. |
| 688, 693-694 | Banned AI-facing vocabulary | `"Roadmap & Capabilities"`, `"Canonical capability flag"` | Rename to “Roadmap & Milestones”; replace with “Canonical feature flag.” |
| 829 | Deleted path | `"Copy templates from `templates/level_N/`"` | Replace with “Create folders through `create.sh --level N`; do not hand-author spec docs from scratch.” |
| 979 | Deleted paths + wrong taxonomy | `` `templates/level_1/` through `level_3+/` ``, `"Pre-merged level templates"` | Replace with “Level templates selected through `create.sh --level N` / resolver-rendered output.” |

Content that stays correct: Level 1/2/3/3+ taxonomy, `--level N`, validator flow, `SPECKIT_LEVEL`, checklist rules, and phase-parent lean-trio behavior.

## README.md — MODIFY

| Lines | Finding | Exact text | Replacement guidance |
|---|---|---|---|
| 3, 72, 93 | Wrong old taxonomy | `"CORE + ADDENDUM v2.2 templates"`, `"CORE + ADDENDUM Templates"` | Replace overview with maintainer-facing manifest architecture. README may use private terms. |
| 267 | Maintainer-facing banned term, allowed but confusing | `"Phase Parent | n/a (manifest only)"` | Prefer “Phase Parent | n/a (lean trio only)” in the public level table; explain manifest internals later. |
| 326 | Deleted paths | `` `templates/phase_parent/spec.md` ``, `` `templates/level_N/` `` | Replace with “parent uses the phase-parent template contract; children use the selected Level output.” |
| 498-539 | Entire old architecture is obsolete | `"CORE + ADDENDUM Architecture (v2.2)"`, `"spec-core.md"`, `` `level2-verify/` ``, `` `level3-arch/` ``, `` `templates/core/` ``, `` `templates/addendum/` ``, `` `templates/level_1/` through `templates/level_3+/` ``, `` `templates/compose.sh` `` | Replace section with: “Templates live in `templates/manifest/`: private `spec-kit-docs.json` plus `.md.tmpl` files. Maintainers edit one template per output document. Inline `IF level:N` gates replace addendum layering. `create.sh` and validators both read the same level contract via resolver. There is no compose step and no pre-merged level directories.” |
| 545-548 | Deleted root-level special templates | `` `research/research.md` ``, `` `handover.md` ``, `` `debug-delegation.md` ``, `` `resource-map.md` `` | Recast as workflow-owned/lazy templates under the new template source; note generated output paths remain packet-local docs. |
| 610 | Deleted script + wrong build-time composition | `"Run `scripts/templates/compose.sh` after editing any core or addendum template"` | Replace with “No build-time composition step; tests render level outputs from the manifest/resolver.” |
| 625-628 | Deleted tree | `"Template system (CORE + ADDENDUM v2.2)"`, `"core/"`, `"addendum/"`, `"level_1/ - level_3+/"` | Replace tree with `templates/manifest/spec-kit-docs.json`, `*.md.tmpl`, and `README.md`. |
| 629-632 | Deleted root template paths | `"research/research.md"`, `"handover.md"`, `"debug-delegation.md"`, `"resource-map.md"` | Show as `.md.tmpl` sources in `templates/manifest/`, not root template files. |
| 636 | Deleted script folder purpose | `"templates/              # Template composition (compose.sh)"` | Delete or rewrite if folder remains only for tests/docs; composer is obsolete. |
| 671 | Deleted path | `` [`templates/core/`](./templates/core/) `` | Replace with `templates/manifest/README.md` as maintainer reference. |
| 808 | Deleted path | `"pre-merged templates from `templates/level_2/`"` | Replace with “the Level 2 output generated by `create.sh --level 2`.” |
| 1083 | Wrong old taxonomy | `"It injects the addendum templates"` | Replace with “It re-renders or adds the documents/sections required by the target Level.” |
| 1111 | Wrong composition wording | `"Template usage and composition rules"` | Replace with “Template usage and level contract rules.” |

README banned vocabulary occurrences are allowed by ADR-005 because README is maintainer-facing: lines 78, 131, 267, 379, 645. Keep only where they document internals; avoid using them in user-oriented level/workflow tables where “Level” language is clearer.
