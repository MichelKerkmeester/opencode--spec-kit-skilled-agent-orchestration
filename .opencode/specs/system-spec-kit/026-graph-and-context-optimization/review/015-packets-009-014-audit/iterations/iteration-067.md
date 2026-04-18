# Iteration 67 - correctness - skill-assets-part3

## Dispatcher
- iteration: 67 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:16:58.259Z

## Files Reviewed
- .opencode/skill/sk-code-opencode/assets/checklists/python_checklist.md
- .opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md
- .opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md
- .opencode/skill/sk-code-opencode/assets/checklists/universal_checklist.md
- .opencode/skill/sk-code-web/assets/checklists/code_quality_checklist.md
- .opencode/skill/sk-code-web/assets/checklists/debugging_checklist.md
- .opencode/skill/sk-code-web/assets/checklists/performance_loading_checklist.md
- .opencode/skill/sk-code-web/assets/checklists/verification_checklist.md
- .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md
- .opencode/skill/sk-deep-research/assets/deep_research_strategy.md
- .opencode/skill/sk-deep-review/assets/deep_review_dashboard.md
- .opencode/skill/sk-deep-review/assets/deep_review_strategy.md
- .opencode/skill/sk-doc/assets/agents/agent_template.md
- .opencode/skill/sk-doc/assets/agents/command_template.md
- .opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md
- .opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md
- .opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md
- .opencode/skill/sk-doc/assets/documentation/install_guide_template.md
- .opencode/skill/sk-doc/assets/documentation/llmstxt_templates.md
- .opencode/skill/sk-doc/assets/documentation/readme_template.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### 1. `sk-doc` command scaffolding teaches a multiline `description` even though the documented command frontmatter contract is single-line only
- `.opencode/skill/sk-doc/assets/agents/command_template.md:308-315` marks a YAML block-scalar `description: |` as the required-field pattern for commands.
- `.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:200-221` says descriptions must stay on one line because the parser does not handle YAML multiline descriptions.
- Live command entrypoints keep single-line descriptions, e.g. `.opencode/command/create/feature-catalog.md:1-4`.

```json
{
  "claim": "The command template's normative frontmatter example contradicts the documented parser limitation and can cause generated command files to violate the live command contract.",
  "evidenceRefs": [
    ".opencode/skill/sk-doc/assets/agents/command_template.md:308-315",
    ".opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:200-221",
    ".opencode/command/create/feature-catalog.md:1-4"
  ],
  "counterevidenceSought": "I looked for a command-specific exception or live command entrypoints using multiline YAML descriptions and found only single-line command descriptions.",
  "alternativeExplanation": "The multiline block may have been intended as generic YAML illustration, but the section is labeled as the required frontmatter pattern and therefore reads as normative scaffolding.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade to P2 if the OpenCode command loader is confirmed to accept multiline descriptions and the single-line warning is explicitly narrowed to SKILL.md parsing only."
}
```

#### 2. The feature-catalog templates still generate `FEATURE_CATALOG.md`, but the shipped create workflow and live packages use `feature_catalog.md`
- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:29-35,84-85,235-239` defines the root package around `FEATURE_CATALOG.md`.
- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md:14-23,76-79` repeats `FEATURE_CATALOG.md` as the canonical root source.
- The executable create workflow writes and validates `feature_catalog/feature_catalog.md`, not the uppercase variant (`.opencode/command/create/assets/create_feature_catalog_auto.yaml:136-145,174-175`).
- Live shipped packages also use lowercase roots, e.g. `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1-6`.

```json
{
  "claim": "The sk-doc feature-catalog templates are out of sync with the executable create-command workflow and the shipped package layout, so generated packages follow a different root-file contract from the live system.",
  "evidenceRefs": [
    ".opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:29-35",
    ".opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:84-85",
    ".opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:235-239",
    ".opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md:14-23",
    ".opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md:76-79",
    ".opencode/command/create/assets/create_feature_catalog_auto.yaml:136-145",
    ".opencode/command/create/assets/create_feature_catalog_auto.yaml:174-175",
    ".opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1-6"
  ],
  "counterevidenceSought": "I checked the live create-command workflow and an existing shipped catalog package for an uppercase-root convention; both use lowercase `feature_catalog.md` instead.",
  "alternativeExplanation": "The uppercase filename may reflect an older naming convention, but the current create workflow is already enforcing lowercase output and validation paths.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade to P2 if the create workflow is intentionally migrated back to uppercase roots and all shipped packages plus validators are updated to match."
}
```

### P2 Findings
- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:15-19` and `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:127-133` still describe `fork` and `completed-continue` as active lifecycle branches, but the current runtime config only allows `new`, `resume`, and `restart` (`.opencode/skill/sk-deep-research/assets/deep_research_config.json:14-24`) and the skill README says `fork` / `completed-continue` are future-only (`.opencode/skill/sk-deep-research/README.md:37-40`).

## Traceability Checks
- **Cross-runtime consistency:** `sk-deep-review` runtime capability metadata still points at the documented OpenCode, Claude, Codex, Gemini, and legacy wrapper mirrors with existing resolver metadata (`.opencode/skill/sk-deep-review/assets/runtime_capabilities.json:1-92`).
- **Skill ↔ code alignment:** `sk-deep-research` lineage placeholders align with the shipped config schema (`.opencode/skill/sk-deep-research/assets/deep_research_config.json:14-24`), while `sk-doc` feature-catalog assets do not align with the live create-command output contract (`.opencode/command/create/assets/create_feature_catalog_auto.yaml:136-145,174-175`).
- **Command ↔ implementation alignment:** The live command surface remains markdown entrypoints under `.opencode/command/` with grouped namespaces and YAML workflow assets (`.opencode/command/README.txt:38-50,68-104`); the only command-contract drift found in this pass is the multiline-description example in `command_template.md`.

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-code-opencode/assets/checklists/python_checklist.md`
- `.opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md`
- `.opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md`
- `.opencode/skill/sk-code-opencode/assets/checklists/universal_checklist.md`
- `.opencode/skill/sk-code-web/assets/checklists/code_quality_checklist.md`
- `.opencode/skill/sk-code-web/assets/checklists/debugging_checklist.md`
- `.opencode/skill/sk-code-web/assets/checklists/performance_loading_checklist.md`
- `.opencode/skill/sk-code-web/assets/checklists/verification_checklist.md`
- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
- `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md`

## Next Focus
- Iteration 68 should continue the correctness pass across the remaining sk-doc creation surfaces, especially the testing-playbook package docs and any create-command entrypoints that still mention uppercase root-package filenames.
